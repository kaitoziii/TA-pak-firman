'use client';

import { useState } from 'react';
import { Class, Subject, Student, Grade } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';


interface GradeInputFormProps {
    classes: Class[];
    subjects: Subject[];
}

export function GradeInputForm({ classes, subjects }: GradeInputFormProps) {
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [students, setStudents] = useState<(Student & { user: { name: string }, grades: Grade[] })[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchStudents = async (classId: string, subjectId: string) => {
        if (!classId || !subjectId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/teacher/students?classId=${classId}&subjectId=${subjectId}`);
            const data = await res.json();
            setStudents(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchStudents(selectedClass, selectedSubject);
    };

    const updateGrade = (studentId: string, field: 'assignment' | 'midExam' | 'finalExam', value: string) => {
        setStudents(prev => prev.map(s => {
            if (s.id === studentId) {
                // Find grade for this subject or create dummy? 
                // Better to assume we have the grade object or will send upsert
                // For UI, let's update local state
                // Logic to handle grade update locally is complex if grades array is empty.
                // Simplified: Just keep a separate map of changes or modify the grades array directly if it exists.

                // For this quick implementation, I'll store changes in a state map or just use <input> defaultValue if just submitting individual.
                // Let's simplified: Auto-save on blur or "Save All" button.
                // I'll stick to local state update.

                const existingGrade = s.grades.find(g => g.subjectId === selectedSubject) || {
                    studentId: s.id,
                    subjectId: selectedSubject,
                    assignment: 0,
                    midExam: 0,
                    finalExam: 0,
                    semester: '1', // default
                    academicYear: '2024/2025'
                } as any;

                const updatedGrade = { ...existingGrade, [field]: parseFloat(value) || 0 };

                // Re-merge
                const newGrades = s.grades.filter(g => g.subjectId !== selectedSubject).concat(updatedGrade);

                return { ...s, grades: newGrades };
            }
            return s;
        }));
    };

    const saveGrades = async () => {
        // Loop through students and send update
        // Ideally batch update API
        setLoading(true);
        try {
            const payload = students.map(s => {
                const g = s.grades.find(g => g.subjectId === selectedSubject);
                if (!g) return null;
                return {
                    studentId: s.id,
                    subjectId: selectedSubject,
                    assignment: g.assignment,
                    midExam: g.midExam,
                    finalExam: g.finalExam,
                };
            }).filter(Boolean);

            await fetch('/api/teacher/grades', {
                method: 'POST',
                body: JSON.stringify({ grades: payload }),
                headers: { 'Content-Type': 'application/json' }
            });
            alert('Data saved successfully!');
        } catch (e) {
            alert('Failed to save');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-4 items-end">
                <div className="space-y-2 w-48">
                    <Label>Class</Label>
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2 w-48">
                    <Label>Subject</Label>
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <Button onClick={handleSearch} disabled={loading || !selectedClass || !selectedSubject}>Load Students</Button>
            </div>

            {students.length > 0 && (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student Name</TableHead>
                                <TableHead className="w-24">Assignment</TableHead>
                                <TableHead className="w-24">Mid Exam</TableHead>
                                <TableHead className="w-24">Final Exam</TableHead>
                                <TableHead className="w-16">Score</TableHead>
                                <TableHead className="w-16">Grade</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map(student => {
                                const grade = student.grades.find(g => g.subjectId === selectedSubject);
                                const assignment = grade?.assignment || 0;
                                const midExam = grade?.midExam || 0;
                                const finalExam = grade?.finalExam || 0;
                                const finalScore = (assignment * 0.3) + (midExam * 0.3) + (finalExam * 0.4);

                                let predicate = 'E';
                                let description = 'Siswa tidak menguasai materi.';
                                if (finalScore >= 85) { predicate = 'A'; description = 'Siswa sangat mampu menguasai materi yang diberikan.'; }
                                else if (finalScore >= 75) { predicate = 'B'; description = 'Siswa mampu menguasai materi yang diberikan.'; }
                                else if (finalScore >= 60) { predicate = 'C'; description = 'Siswa cukup mampu menguasai materi, namun perlu bimbingan.'; }
                                else if (finalScore >= 50) { predicate = 'D'; description = 'Siswa belum menguasai materi dan perlu remedial.'; }

                                return (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.user.name}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                defaultValue={assignment}
                                                onChange={(e) => updateGrade(student.id, 'assignment', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                defaultValue={midExam}
                                                onChange={(e) => updateGrade(student.id, 'midExam', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                defaultValue={finalExam}
                                                onChange={(e) => updateGrade(student.id, 'finalExam', e.target.value)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-bold">{finalScore.toFixed(1)}</TableCell>
                                        <TableCell className="font-bold text-center">{predicate}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{description}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <div className="p-4 flex justify-end">
                        <Button onClick={saveGrades} disabled={loading}>Save All Grades</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
