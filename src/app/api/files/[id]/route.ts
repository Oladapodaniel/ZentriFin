import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { readFile } from 'fs/promises';
import mime from 'mime';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const file = await prisma.file.findUnique({
            where: { id },
        });

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Check if file exists locally
        try {
            const buffer = await readFile(file.url);
            const mimeType = mime.getType(file.url) || 'application/pdf';

            return new NextResponse(buffer, {
                headers: {
                    'Content-Type': mimeType,
                    'Content-Disposition': `inline; filename="${file.name}"`,
                },
            });
        } catch (error) {
            console.error('File read error:', error);
            return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
        }

    } catch (error) {
        console.error('File serve error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
