import { PrismaClient } from '@prisma/client'; // Use types
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PrintButton } from '../../../student/print-button';
import { notFound } from 'next/navigation';

export default async function TeacherReportDetailPage({ params }: { params: { studentId: string } }) {
    const { studentId } = params;

    const student = await prisma.student.findUnique({
        where: { userId: studentId },
        include: {
            user: true,
            class: true,
            grades: {
                include: { subject: true }
            }
        }
    });

    if (!student) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center print:hidden">
                <h2 className="text-3xl font-bold tracking-tight">Rapor: {student.user.name}</h2>
                <PrintButton />
            </div>

            <div className="print:block space-y-6">
                <Card className="print:shadow-none print:border-none">
                    <CardHeader className="print:px-0">
                        <CardTitle className="text-center text-2xl hidden print:block mb-4">Laporan Hasil Belajar Siswa</CardTitle>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Nama Siswa</p>
                                <p className="font-semibold text-lg">{student.user.name}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Nomor Induk Siswa</p>
                                <p className="font-semibold text-lg">{student.nis}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Kelas</p>
                                <p className="font-semibold text-lg">{student.class?.name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Tahun Ajaran</p>
                                <p className="font-semibold text-lg">2024/2025 (Semester 1)</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="print:px-0">
                        <Table className="border rounded-md">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">No</TableHead>
                                    <TableHead>Mata Pelajaran</TableHead>
                                    <TableHead className="text-center">Tugas</TableHead>
                                    <TableHead className="text-center">UTS</TableHead>
                                    <TableHead className="text-center">UAS</TableHead>
                                    <TableHead className="text-center font-bold">Nilai Akhir</TableHead>
                                    <TableHead className="text-center">Predikat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {student.grades.map((grade: any, index: number) => (
                                    <TableRow key={grade.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{grade.subject.name}</TableCell>
                                        <TableCell className="text-center">{grade.assignment}</TableCell>
                                        <TableCell className="text-center">{grade.midExam}</TableCell>
                                        <TableCell className="text-center">{grade.finalExam}</TableCell>
                                        <TableCell className="text-center font-bold">{Math.round(grade.finalScore)}</TableCell>
                                        <TableCell className="text-center font-bold text-primary">{grade.predicate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
            body * {
                visibility: hidden;
            }
            .print\\:block, .print\\:block * {
                visibility: visible;
            }
            .print\\:block {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            header, nav, footer {
                display: none !important;
            }
        }
      `}} />
        </div>
    );
}
