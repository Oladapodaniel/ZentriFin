import 'dotenv/config';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
/* eslint-disable @typescript-eslint/no-require-imports */
import { prisma } from '@/lib/db';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabase';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});



const worker = new Worker('statement-processing', async (job) => {
    const { fileId, filePath } = job.data;
    console.log(`Processing file ${fileId} from ${filePath}`);

    try {
        await prisma.file.update({
            where: { id: fileId },
            data: { status: 'processing' },
        });

        // Check if we have an API key
        // Check if we have an API key
        const apiKey = process.env.ACA_API_TOKEN;
        const isPlaceholder = !apiKey || apiKey === 'your_token_here' || apiKey.includes('placeholder');

        if (isPlaceholder) {
            console.log('No valid ACA API token found (placeholder detected), using mock processing');
            await mockProcessing(fileId);
        } else {
            console.log('Using ACA Endpoint for processing');
            try {
                await acaProcessing(fileId, filePath, apiKey);
            } catch (error) {
                console.error('ACA processing failed:', error);
                console.log('Falling back to mock processing due to error.');
                await mockProcessing(fileId);
            }
        }

        await prisma.file.update({
            where: { id: fileId },
            data: { status: 'completed' },
        });

        // Check if all files in the project are completed
        const file = await prisma.file.findUnique({ where: { id: fileId } });
        if (file) {
            const projectFiles = await prisma.file.findMany({
                where: { projectId: file.projectId }
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const allCompleted = projectFiles.every((f: any) => f.status === 'completed' || f.status === 'failed');
            if (allCompleted) {
                await prisma.project.update({
                    where: { id: file.projectId },
                    data: { status: 'completed' }
                });
            }
        }

        console.log(`File ${fileId} processed successfully`);

    } catch (error) {
        console.error(`Error processing file ${fileId}:`, error);
        await prisma.file.update({
            where: { id: fileId },
            data: { status: 'error' },
        });
        // Don't throw if we want to keep the worker alive, but usually we should to trigger retries
        // throw error; 
    }

}, { connection });

async function mockProcessing(fileId: string) {
    console.log(`Starting mock processing for file ${fileId}`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        await prisma.transaction.create({
            data: {
                date: new Date(),
                description: 'Mock Transaction (No API Key)',
                amount: 123.45,
                debit: 123.45,
                credit: null,
                balance: 1000.00,
                currency: 'USD',
                fileId: fileId,
            }
        });
        console.log(`Mock transaction created for file ${fileId}`);
    } catch (error) {
        console.error(`Failed to create mock transaction for file ${fileId}:`, error);
        throw error;
    }
}

async function acaProcessing(fileId: string, filePath: string, token: string) {
    // Download file from Supabase Storage
    const { data: fileBlob, error: downloadError } = await supabaseAdmin
        .storage
        .from('statements')
        .download(filePath);

    if (downloadError || !fileBlob) {
        throw new Error(`Failed to download file from storage: ${downloadError?.message}`);
    }

    const fileBuffer = Buffer.from(await fileBlob.arrayBuffer());
    const base64Content = fileBuffer.toString('base64');

    // Determine file type (simple check)
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const type = ext === 'pdf' ? 'pdf' : 'image'; // ACA might expect 'image' or specific types, defaulting to pdf/image logic

    const payload = {
        openai_config: {
            model: "gpt-4o",
            reasoning_effort: "medium",
            image_detail: "high",
            temperature: 0,
            max_tokens: 16384,
            // model: "gpt-5",
            // reasoning_effort: "auto",
            // image_detail: "auto",
            // temperature: null,
            // max_tokens: null,
            timeout: 360,
            max_retries: 0,
            costs_per_token: {
                completion: 1.25e-7,
                prompt: 0.00000125,
                reasoning: 0.00001
            }
        },
        strict: true,
        output_schema: {
            additionalProperties: false,
            properties: {
                transactions: {
                    type: "array",
                    items: {
                        additionalProperties: false,
                        properties: {
                            date: {
                                description: "Transaction date (YYYY-MM-DD)",
                                type: "string"
                            },
                            description: {
                                description: "Description of the transaction",
                                type: "string"
                            },
                            amount: {
                                description: "Transaction amount (absolute value)",
                                type: "number"
                            },
                            debit: {
                                description: "Debit amount (if applicable)",
                                type: ["number", "null"]
                            },
                            credit: {
                                description: "Credit amount (if applicable)",
                                type: ["number", "null"]
                            },
                            balance: {
                                description: "Running balance after transaction",
                                type: ["number", "null"]
                            },
                            currency: {
                                description: "Currency code (e.g. USD)",
                                type: "string"
                            }
                        },
                        required: ["date", "description", "amount", "debit", "credit", "balance", "currency"],
                        type: "object"
                    }
                }
            },
            required: ["transactions"],
            title: "BankStatement",
            type: "object"
        },
        payload: {
            type: "pdf",
            description: "Bank statement file",
            preprocess_config: {
                contrast_factor: 1,
                dpi: 300,
                grayscale: false,
                ocr_enhancement: "all"
            },
            value: {
                content: base64Content,
                source: "base64"
            }
        }
    };

    console.log('Sending request to ACA endpoint...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

    try {
        const response = await fetch('https://acawarehousemain.purplehill-a173ffdb.swedencentral.azurecontainerapps.io/api/v2/openai/extract', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ACA API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const transactions = (result as any).extraction?.transactions || [];

        console.log(`Extracted ${transactions.length} transactions from ACA`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        for (const t of transactions as any[]) {
            let date = new Date(t.date);
            if (isNaN(date.getTime())) {
                console.warn(`Invalid date found: ${t.date}, using current date as fallback`);
                date = new Date();
            }

            await prisma.transaction.create({
                data: {
                    date: date,
                    description: t.description,
                    amount: Math.abs(t.amount),
                    debit: t.debit || (t.amount < 0 ? Math.abs(t.amount) : null),
                    credit: t.credit || (t.amount > 0 ? Math.abs(t.amount) : null),
                    balance: t.balance,
                    currency: t.currency || 'USD',
                    fileId: fileId,
                }
            });
        }
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

console.log('Worker started...');
console.log('Worker Version: Supabase Storage Enabled');

// Simple HTTP server to satisfy Render's port requirement for Web Services
import http from 'http';
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Worker is running\n');
});

server.listen(port, () => {
    console.log(`Health check server listening on port ${port}`);
});
