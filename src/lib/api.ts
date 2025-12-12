import { AnalyticsSummary, ApiKey, Batch, Transaction, Project } from "@/types";

// Mock Data Generators

const CATEGORIES = [
    "Office Supplies",
    "Software Subscription",
    "Travel",
    "Meals & Entertainment",
    "Payroll",
    "Utilities",
    "Professional Services",
    "Marketing",
];

const MERCHANTS = [
    "Amazon AWS",
    "Google Workspace",
    "Uber",
    "Delta Airlines",
    "Staples",
    "WeWork",
    "Slack",
    "Zoom",
    "Salesforce",
    "Apple Store",
];

const generateId = () => Math.random().toString(36).substring(2, 9);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock Store (In-Memory)
const batches: Batch[] = [];
const apiKeys: ApiKey[] = [];

export const api = {
    uploadStatements: async (files: File[], projectName?: string, mode: 'merge' | 'separate' = 'merge'): Promise<Batch | { projects: Project[] }> => {
        const formData = new FormData();
        files.forEach(f => formData.append('files', f));
        if (projectName) formData.append('projectName', projectName);
        formData.append('mode', mode);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();

        if (mode === 'separate' && data.projects) {
            return { projects: data.projects };
        }

        return {
            id: data.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            files: data.files ? data.files.map((f: any) => ({
                id: f.id,
                file: files.find(file => file.name === f.name) as File,
                filename: f.name,
                size: 0,
                status: f.status,
                progress: 0,
            })) : [],
            transactions: [],
            createdAt: data.createdAt,
            status: data.status,
        };
    },

    processBatch: async (batchId: string, onProgress: (fileId: string, progress: number) => void): Promise<Batch> => {
        await fetch(`/api/projects/${batchId}/process`, { method: 'POST' });

        // Poll for status
        while (true) {
            await delay(2000);
            const res = await fetch(`/api/projects/${batchId}`);
            if (!res.ok) throw new Error('Failed to fetch project status');

            const project = await res.json();

            // Update progress for each file
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            project.files.forEach((f: any) => {
                let progress = 0;
                if (f.status === 'completed') progress = 100;
                else if (f.status === 'processing') progress = 50;
                else if (f.status === 'queued') progress = 10;

                onProgress(f.id, progress);
            });

            // Check if all files are done (or project status is completed)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const allDone = project.files.every((f: any) => f.status === 'completed' || f.status === 'error');

            if (allDone) {
                return {
                    id: project.id,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    files: project.files.map((f: any) => ({
                        id: f.id,
                        filename: f.name,
                        status: f.status,
                        progress: f.status === 'completed' ? 100 : 0,
                    })),
                    transactions: [], // Transactions would be fetched separately
                    createdAt: project.createdAt,
                    status: 'completed',
                } as unknown as Batch;
            }
        }
    },

    getBatch: async (batchId: string): Promise<Batch | undefined> => {
        const res = await fetch(`/api/projects/${batchId}`);
        if (!res.ok) return undefined;

        const project = await res.json();

        // Transform to Batch type
        return {
            id: project.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            files: project.files.map((f: any) => ({
                id: f.id,
                filename: f.name,
                status: f.status,
                progress: f.status === 'completed' ? 100 : 0,
            })),
            transactions: project.transactions || [],
            createdAt: project.createdAt,
            status: project.status,
            validationSummary: {
                balanceErrors: 0,
                uncategorizedCount: 0,
                currencyMismatches: 0,
                potentialDuplicates: 0
            }
        } as unknown as Batch;
    },

    getAnalytics: async (batchId?: string): Promise<AnalyticsSummary> => {
        await delay(600);

        // In a real app, we'd filter by batchId if provided. 
        // Here we just return static mock data enhanced with some randomness.

        return {
            totalInflow: 125000,
            totalOutflow: 84300,
            netCashFlow: 40700,
            transactionCount: 342,
            anomaliesCount: 3,
            categoryBreakdown: [
                { name: "Payroll", value: 45000, color: "var(--chart-1)" },
                { name: "Software", value: 12000, color: "var(--chart-2)" },
                { name: "Office", value: 5000, color: "var(--chart-3)" },
                { name: "Marketing", value: 15000, color: "var(--chart-4)" },
                { name: "Travel", value: 7300, color: "var(--chart-5)" },
            ],
            monthlyCashFlow: [
                { name: "Jan", inflow: 40000, outflow: 24000 },
                { name: "Feb", inflow: 30000, outflow: 13980 },
                { name: "Mar", inflow: 20000, outflow: 9800 },
                { name: "Apr", inflow: 27800, outflow: 39080 },
                { name: "May", inflow: 18900, outflow: 4800 },
                { name: "Jun", inflow: 23900, outflow: 3800 },
            ],
        };
    },

    generateApiKey: async (): Promise<ApiKey> => {
        await delay(500);
        const key = `bsp_live_${generateId()}${generateId()}${generateId()}`;
        const newKey = {
            key,
            createdAt: new Date().toISOString(),
            masked: `bsp_live_...${key.slice(-4)}`,
        };
        apiKeys.push(newKey);
        return newKey;
    },

    getProjects: async (): Promise<import("@/types").Project[]> => {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
    },
};
