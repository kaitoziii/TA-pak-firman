"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Grade {
    id: string;
    subject: { name: string };
    assignment: number;
    midExam: number;
    finalExam: number;
    finalScore: number;
    predicate: string;
    description: string;
    semester: string;
}

interface Student {
    id: string;
    user: { name: string };
    nis: string;
    class: { name: string };
    grades: Grade[];
}

export default function ParentDashboard() {
    const [children, setChildren] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/parent/children");
                if (res.ok) {
                    const data = await res.json();
                    setChildren(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (children.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <p>Belum ada data siswa yang terhubung dengan akun Anda.</p>
                <p>Silakan hubungi admin sekolah.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Orang Tua</h2>

            {children.map((child) => (
                <Card key={child.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="flex justify-between items-center">
                            <span>{child.user.name}</span>
                            <Badge variant="outline">{child.class.name} | {child.nis}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mata Pelajaran</TableHead>
                                    <TableHead className="text-center">Tugas</TableHead>
                                    <TableHead className="text-center">UTS</TableHead>
                                    <TableHead className="text-center">UAS</TableHead>
                                    <TableHead className="text-center">Nilai Akhir</TableHead>
                                    <TableHead className="text-center">Predikat</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {child.grades.length > 0 ? (
                                    child.grades.map((grade) => (
                                        <TableRow key={grade.id}>
                                            <TableCell className="font-medium">{grade.subject.name}</TableCell>
                                            <TableCell className="text-center">{grade.assignment}</TableCell>
                                            <TableCell className="text-center">{grade.midExam}</TableCell>
                                            <TableCell className="text-center">{grade.finalExam}</TableCell>
                                            <TableCell className="text-center font-bold">{grade.finalScore.toFixed(1)}</TableCell>
                                            <TableCell className="text-center font-bold">{grade.predicate || '-'}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{grade.description || '-'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                            Belum ada nilai yang diinput.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
