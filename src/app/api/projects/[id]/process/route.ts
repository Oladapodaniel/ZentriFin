import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { processingQueue } from '@/lib/queue';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: projectId } = await params;

    try {
        const files = await prisma.file.findMany({
            where: { projectId, status: 'pending' },
        });

        for (const file of files) {
            await processingQueue.add('process-file', {
                fileId: file.id,
                filePath: file.url,
            });

            await prisma.file.update({
                where: { id: file.id },
                data: { status: 'queued' },
            });
        }

        await prisma.project.update({
            where: { id: projectId },
            data: { status: 'processing' },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Process error:', error);
        return NextResponse.json({ error: 'Failed to start processing' }, { status: 500 });
    }
}
