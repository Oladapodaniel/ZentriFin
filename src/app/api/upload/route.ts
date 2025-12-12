import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { processingQueue } from '@/lib/queue';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const files = formData.getAll('files') as File[];
        const projectName = formData.get('projectName') as string || `Batch ${new Date().toISOString()}`;
        const mode = formData.get('mode') as string || 'merge'; // 'merge' | 'separate'

        if (!files.length) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const createdProjects = [];
        const createdFiles = [];

        if (mode === 'separate') {
            // Create a project for each file
            for (const file of files) {
                const project = await prisma.project.create({
                    data: {
                        name: files.length > 1 ? `${projectName} - ${file.name}` : projectName,
                        status: 'processing',
                        userId: session.user.id,
                    },
                });

                const buffer = Buffer.from(await file.arrayBuffer());
                const fileName = `${uuidv4()}-${file.name}`;
                const filePath = path.join(process.cwd(), 'uploads', fileName);

                await writeFile(filePath, buffer);

                const fileRecord = await prisma.file.create({
                    data: {
                        name: file.name,
                        url: filePath,
                        projectId: project.id,
                        status: 'pending',
                    },
                });
                createdFiles.push(fileRecord);

                createdProjects.push(project);
            }
        } else {
            // Merge all files into one project
            const project = await prisma.project.create({
                data: {
                    name: projectName,
                    status: 'processing',
                    userId: session.user.id,
                },
            });

            for (const file of files) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const fileName = `${uuidv4()}-${file.name}`;
                const filePath = path.join(process.cwd(), 'uploads', fileName);

                await writeFile(filePath, buffer);

                const fileRecord = await prisma.file.create({
                    data: {
                        name: file.name,
                        url: filePath,
                        projectId: project.id,
                        status: 'pending',
                    },
                });
                createdFiles.push(fileRecord);
            }
            createdProjects.push(project);
        }

        // Return the first project ID for backward compatibility, but also the full list
        return NextResponse.json({
            id: createdProjects[0].id,
            projects: createdProjects,
            files: createdFiles,
            status: 'processing'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
