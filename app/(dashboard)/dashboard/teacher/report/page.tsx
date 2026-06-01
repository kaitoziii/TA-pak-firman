import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function TeacherReportPage() {
    // In a real app, this would filter by the teacher's classes.
    // For now, we show all students or students of a specific class.

    const students = await prisma.student.findMany({
        include: { user: true, class: true },
        orderBy: { class: { name: 'asc' } }
    });

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Cetak Rapor Siswa</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Siswa</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NIS</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student: any) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.nis}</TableCell>
                                    <TableCell>{student.user.name}</TableCell>
                                    <TableCell>{student.class?.name || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/dashboard/teacher/report/${student.userId}`}>
                                            <Button variant="outline" size="sm">Cetak Rapor</Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
