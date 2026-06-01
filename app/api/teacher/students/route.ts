import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const subjectId = searchParams.get('subjectId');

    if (!classId || !subjectId) {
        return NextResponse.json({ error: 'Missing classId or subjectId' }, { status: 400 });
    }

    try {
        const students = await prisma.student.findMany({
            where: { classId },
            include: {
                user: { select: { name: true } },
                grades: {
                    where: { subjectId }
                }
            }
        });
        return NextResponse.json(students);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
