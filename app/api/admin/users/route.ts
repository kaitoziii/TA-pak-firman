import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = JSON.parse(session);
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                username: true,
                name: true,
                role: true,
                createdAt: true,
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = (await cookies()).get('session')?.value;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currentUser = JSON.parse(session);
    if (currentUser.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    try {
        const body = await request.json();
        const { username, password, name, role, additionalInfo } = body;
        // additionalInfo contains: { nis, nip, classId }

        if (!username || !password || !name || !role) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Check availability
        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing) {
            return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
        }

        // Check NIS/NIP uniqueness if provided
        if (role === 'TEACHER' && additionalInfo?.nip) {
            const existingNip = await prisma.teacher.findUnique({ where: { nip: additionalInfo.nip } });
            if (existingNip) return NextResponse.json({ error: 'NIP already used' }, { status: 400 });
        }
        if (role === 'STUDENT' && additionalInfo?.nis) {
            const existingNis = await prisma.student.findUnique({ where: { nis: additionalInfo.nis } });
            if (existingNis) return NextResponse.json({ error: 'NIS already used' }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                username,
                password,
                name,
                role,
            }
        });

        // Create related profile based on role
        if (role === 'TEACHER') {
            await prisma.teacher.create({
                data: {
                    userId: newUser.id,
                    nip: additionalInfo?.nip || username,
                    classId: additionalInfo?.classId // Optional
                }
            });
        } else if (role === 'STUDENT') {
            const classIdSource = additionalInfo?.classId;
            // If no class selected, maybe fail or default?
            // User requested explicit class selection. If not provided, Student creation might fail or need nullable classId (which is not in schema currently, let's check).
            // Schema: classId String (required). So we must provide it.
            // If not provided in UI, we fetch a default.

            let targetClassId = classIdSource;
            if (!targetClassId) {
                const defaultClass = await prisma.class.findFirst();
                targetClassId = defaultClass?.id;
                if (!targetClassId) {
                    // Clean up
                    await prisma.user.delete({ where: { id: newUser.id } });
                    return NextResponse.json({ error: 'No class available. Create a class first.' }, { status: 400 });
                }
            }

            await prisma.student.create({
                data: {
                    userId: newUser.id,
                    nis: additionalInfo?.nis || username,
                    classId: targetClassId
                }
            });
        } else if (role === 'PARENT') {
            await prisma.parent.create({ data: { userId: newUser.id } });
        }

        return NextResponse.json(newUser);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
