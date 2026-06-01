import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const classes = await prisma.class.findMany({
            include: {
                _count: {
                    select: { students: true, teachers: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(classes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = (await cookies()).get('session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentUser = JSON.parse(session);
    if (currentUser.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const { name } = await request.json();
        if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

        const newClass = await prisma.class.create({ data: { name } });
        return NextResponse.json(newClass);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
    }
}
