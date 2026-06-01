import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { grades } = body; // Array of { studentId, subjectId, assignment, midExam, finalExam }

        if (!Array.isArray(grades)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        const updates = grades.map(async (grade: any) => {
            // Calculate Final Score
            // Formula: 30% Assign, 30% Mid, 40% Final (Example)
            const finalScore = (grade.assignment * 0.3) + (grade.midExam * 0.3) + (grade.finalExam * 0.4);
            let predicate = 'E';
            let description = 'Siswa tidak menguasai materi.';

            if (finalScore >= 85) {
                predicate = 'A';
                description = 'Siswa sangat mampu menguasai materi yang diberikan.';
            } else if (finalScore >= 75) {
                predicate = 'B';
                description = 'Siswa mampu menguasai materi yang diberikan.';
            } else if (finalScore >= 60) {
                predicate = 'C';
                description = 'Siswa cukup mampu menguasai materi, namun perlu bimbingan.';
            } else if (finalScore >= 50) {
                predicate = 'D';
                description = 'Siswa belum menguasai materi dan perlu remedial.';
            }

            return prisma.grade.upsert({
                where: {
                    studentId_subjectId_semester_academicYear: {
                        studentId: grade.studentId,
                        subjectId: grade.subjectId,
                        semester: '1',
                        academicYear: '2024/2025'
                    }
                },
                update: {
                    assignment: grade.assignment,
                    midExam: grade.midExam,
                    finalExam: grade.finalExam,
                    finalScore,
                    predicate,
                    description
                },
                create: {
                    studentId: grade.studentId,
                    subjectId: grade.subjectId,
                    semester: '1',
                    academicYear: '2024/2025',
                    assignment: grade.assignment,
                    midExam: grade.midExam,
                    finalExam: grade.finalExam,
                    finalScore,
                    predicate,
                    description
                }
            });
        });

        await Promise.all(updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}
