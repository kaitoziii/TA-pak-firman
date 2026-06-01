import { GradeInputForm } from './grade-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

export default async function TeacherDashboard() {
    const classes = await prisma.class.findMany();
    const subjects = await prisma.subject.findMany();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h2>
                <Link href="/dashboard/teacher/report">
                    <Button variant="outline" className="gap-2">
                        <Printer className="w-4 h-4" /> Cetak Rapor Siswa
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Input Grades</CardTitle>
                </CardHeader>
                <CardContent>
                    <GradeInputForm classes={classes} subjects={subjects} />
                </CardContent>
            </Card>
        </div>
    );
}
