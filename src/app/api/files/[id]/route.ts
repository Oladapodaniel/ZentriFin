import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const file = await prisma.file.findUnique({
            where: { id },
            include: { project: true }
        });

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        if (file.project.userId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Download from Supabase Storage
        const { data: fileBlob, error: downloadError } = await supabaseAdmin
            .storage
            .from('statements')
            .download(file.url);

        if (downloadError || !fileBlob) {
            console.error('Supabase download error:', downloadError);
            return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });
        }

        const buffer = Buffer.from(await fileBlob.arrayBuffer());

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${file.name}"`,
            },
        });

    } catch (error) {
        console.error('File fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
