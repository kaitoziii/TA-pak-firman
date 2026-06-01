import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = JSON.parse(session);
    if (user.role !== 'PARENT') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const parent = await prisma.parent.findUnique({
            where: { userId: user.id },
            include: {
                students: {
                    include: {
                        user: { select: { name: true } },
                        class: { select: { name: true } },
                        grades: {
                            include: { subject: true }
                        }
                    }
                }
            }
        });

        if (!parent) return NextResponse.json({ error: 'Parent profile not found' }, { status: 404 });

        return NextResponse.json(parent.students);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
