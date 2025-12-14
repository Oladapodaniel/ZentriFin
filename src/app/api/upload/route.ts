import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { processingQueue } from '@/lib/queue';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase';

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

                const buffer = await file.arrayBuffer();
                const fileExt = file.name.split('.').pop();
                const fileName = `${session.user.id}/${project.id}/${uuidv4()}.${fileExt}`;

                const { error: uploadError } = await supabaseAdmin
                    .storage
                    .from('statements')
                    .upload(fileName, buffer, {
                        contentType: file.type,
                        upsert: false
                    });

                if (uploadError) {
                    console.error('Supabase upload error:', uploadError);
                    throw new Error('Failed to upload file to storage');
                }

                const fileRecord = await prisma.file.create({
                    data: {
                        name: file.name,
                        url: fileName, // Store the path in bucket
                        projectId: project.id,
                        status: 'pending',
                    },
                });
                createdFiles.push(fileRecord);

                // Add to queue
                await processingQueue.add('process-statement', {
                    fileId: fileRecord.id,
                    filePath: fileName, // Pass the storage path
                });

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
                const buffer = await file.arrayBuffer();
                const fileExt = file.name.split('.').pop();
                const fileName = `${session.user.id}/${project.id}/${uuidv4()}.${fileExt}`;

                const { error: uploadError } = await supabaseAdmin
                    .storage
                    .from('statements')
                    .upload(fileName, buffer, {
                        contentType: file.type,
                        upsert: false
                    });

                if (uploadError) {
                    console.error('Supabase upload error:', uploadError);
                    throw new Error('Failed to upload file to storage');
                }

                const fileRecord = await prisma.file.create({
                    data: {
                        name: file.name,
                        url: fileName, // Store the path in bucket
                        projectId: project.id,
                        status: 'pending',
                    },
                });
                createdFiles.push(fileRecord);

                // Add to queue
                await processingQueue.add('process-statement', {
                    fileId: fileRecord.id,
                    filePath: fileName, // Pass the storage path
                });
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
