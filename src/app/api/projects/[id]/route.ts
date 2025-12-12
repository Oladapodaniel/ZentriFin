import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                files: {
                    include: {
                        transactions: true
                    }
                }
            },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Flatten transactions from all files
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allTransactions = project.files.flatMap((f: any) => f.transactions);

        return NextResponse.json({
            ...project,
            transactions: allTransactions
        });
    } catch (error) {
        console.error('Fetch project error:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}
