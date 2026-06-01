"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface ClassItem {
    id: string;
    name: string;
    _count: {
        students: number;
        teachers: number;
    }
}

export default function ClassManagementPage() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/classes");
            if (res.ok) {
                const data = await res.json();
                setClasses(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleCreate = async () => {
        if (!newClassName) return;
        try {
            const res = await fetch("/api/admin/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newClassName }),
            });
            if (res.ok) {
                setIsAddOpen(false);
                setNewClassName("");
                fetchClasses();
            } else {
                alert("Failed to create class");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Kelola Kelas</h2>
                <Button onClick={() => setIsAddOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> Tambah Kelas
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama Kelas</TableHead>
                            <TableHead className="text-center">Jumlah Siswa</TableHead>
                            <TableHead className="text-center">Jumlah Guru</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
                        ) : classes.map((c, index) => (
                            <TableRow key={c.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{c.name}</TableCell>
                                <TableCell className="text-center">{c._count.students}</TableCell>
                                <TableCell className="text-center">{c._count.teachers}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Kelas Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Nama Kelas</Label>
                            <Input
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                placeholder="Ex: 10A"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                        <Button onClick={handleCreate}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
