import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const projects = await prisma.project.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: { createdAt: 'desc' },
            include: {
                files: {
                    include: {
                        transactions: true
                    }
                }
            }
        });

        // Transform to match frontend Project type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedProjects = projects.map((p: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const allTransactions = p.files.flatMap((f: any) => f.transactions);
            const transactionCount = allTransactions.length;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const totalValue = allTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);

            // Mock extract rate based on status for now, or random if completed
            const extractRate = p.status === 'completed' ? 98 : 0;

            return {
                id: p.id,
                name: p.name,
                date: p.createdAt.toISOString(),
                status: p.status,
                extractRate,
                transactionCount,
                totalValue,
                currency: "USD"
            };
        });

        return NextResponse.json(formattedProjects);
    } catch (error) {
        console.error('Fetch projects error:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}
