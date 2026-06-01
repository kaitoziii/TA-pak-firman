import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const session = (await cookies()).get('session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentUser = JSON.parse(session);
    if (currentUser.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const body = await request.json();
        const { password } = body; // Only supporting password update for now

        if (!password) {
            return NextResponse.json({ error: 'Password required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: { password } // Plain text for demo
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = (await cookies()).get('session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentUser = JSON.parse(session);
    if (currentUser.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        // Cascade delete handled by Prisma mainly if relations set up or manual
        // Manual cleanup for relations since typical cascade might not be set in simple schema
        const user = await prisma.user.findUnique({ where: { id: params.id } });
        if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        if (user.role === 'TEACHER') await prisma.teacher.deleteMany({ where: { userId: params.id } });
        if (user.role === 'STUDENT') await prisma.student.deleteMany({ where: { userId: params.id } });
        if (user.role === 'PARENT') await prisma.parent.deleteMany({ where: { userId: params.id } });

        await prisma.user.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
