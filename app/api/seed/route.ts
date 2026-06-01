import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Clear existing (optional, usually good for dev)
        // await prisma.grade.deleteMany();
        // await prisma.student.deleteMany();
        // await prisma.teacher.deleteMany();
        // await prisma.user.deleteMany();
        // await prisma.class.deleteMany();
        // await prisma.subject.deleteMany();

        // 1. Create Admin
        const adminUser = await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: 'admin123', // Simple plain text
                name: 'Administrator',
                role: 'ADMIN',
            },
        });

        // 2. Create Class
        const class10A = await prisma.class.upsert({
            where: { name: '10A' },
            update: {},
            create: { name: '10A' },
        });

        // 3. Create Subject
        const mathSubject = await prisma.subject.upsert({
            where: { name: 'Matematika' },
            update: {},
            create: { name: 'Matematika' },
        });

        // 4. Create Teacher
        const teacherUser = await prisma.user.upsert({
            where: { username: 'guru' },
            update: {},
            create: {
                username: 'guru',
                password: 'guru123',
                name: 'Budi Santoso',
                role: 'TEACHER',
            }
        });

        const teacher = await prisma.teacher.upsert({
            where: { userId: teacherUser.id },
            update: {},
            create: {
                userId: teacherUser.id,
                nip: '198001012005011001'
            }
        });

        // 5. Create Student
        const studentUser = await prisma.user.upsert({
            where: { username: 'siswa' },
            update: {},
            create: {
                username: 'siswa',
                password: 'siswa123',
                name: 'Andi Pratama',
                role: 'STUDENT',
            }
        });

        const student = await prisma.student.upsert({
            where: { userId: studentUser.id },
            update: {},
            create: {
                userId: studentUser.id,
                nis: '123456',
                classId: class10A.id,
            }
        });

        return NextResponse.json({ success: true, message: 'Database seeded' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Seeding failed' }, { status: 500 });
    }
}
