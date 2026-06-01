"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Key } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    username: string;
    name: string;
    role: string;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [classes, setClasses] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditPassOpen, setIsEditPassOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form States
    const [newItem, setNewItem] = useState({
        username: "",
        password: "",
        name: "",
        role: "STUDENT",
        additionalInfo: {
            nis: "",
            nip: "",
            classId: ""
        }
    });
    const [newPassword, setNewPassword] = useState("");

    const router = useRouter();

    const fetchClasses = async () => {
        try {
            const res = await fetch("/api/admin/classes");
            if (res.ok) {
                const data = await res.json();
                setClasses(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchClasses();
    }, []);

    const handleCreate = async () => {
        if (newItem.role === 'TEACHER' && !newItem.additionalInfo.classId) {
            alert("Harap pilih kelas untuk guru!");
            return;
        }
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem),
            });
            if (res.ok) {
                setIsAddOpen(false);
                setNewItem({
                    username: "",
                    password: "",
                    name: "",
                    role: "STUDENT",
                    additionalInfo: { nis: "", nip: "", classId: "" }
                });
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to create user");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdatePassword = async () => {
        if (!selectedUser) return;
        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: newPassword }),
            });
            if (res.ok) {
                setIsEditPassOpen(false);
                setNewPassword("");
                alert("Password updated successfully");
            } else {
                alert("Failed to update password");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete all related data (Student/Teacher info).")) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            if (res.ok) fetchUsers();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Kelola Pengguna</h2>
                <Button onClick={() => setIsAddOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> Tambah User
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Nama Lengkap</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
                        ) : users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell className="font-medium">{user.role}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setIsEditPassOpen(true); }}>
                                        <Key className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(user.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add User Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select
                                value={newItem.role}
                                onValueChange={(value) => setNewItem({ ...newItem, role: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STUDENT">Siswa</SelectItem>
                                    <SelectItem value="TEACHER">Guru</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="PARENT">Orang Tua</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Nama Lengkap</Label>
                            <Input
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                placeholder="Contoh: Budi Santoso"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Username</Label>
                            <Input
                                value={newItem.username}
                                onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
                                placeholder="username123"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={newItem.password}
                                onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                                placeholder="*******"
                            />
                        </div>

                        {/* Extended Form for Student & Teacher */}
                        {newItem.role === 'STUDENT' && (
                            <>
                                <div className="space-y-2">
                                    <Label>Nomor Induk Siswa (NIS)</Label>
                                    <Input
                                        value={newItem.additionalInfo.nis}
                                        onChange={(e) => setNewItem({
                                            ...newItem,
                                            additionalInfo: { ...newItem.additionalInfo, nis: e.target.value }
                                        })}
                                        placeholder="Ex: 2024001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kelas</Label>
                                    <Select
                                        value={newItem.additionalInfo.classId}
                                        onValueChange={(value) => setNewItem({
                                            ...newItem,
                                            additionalInfo: { ...newItem.additionalInfo, classId: value }
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}

                        {newItem.role === 'TEACHER' && (
                            <>
                                <div className="space-y-2">
                                    <Label>NIP (Nomor Induk Pegawai)</Label>
                                    <Input
                                        value={newItem.additionalInfo.nip}
                                        onChange={(e) => setNewItem({
                                            ...newItem,
                                            additionalInfo: { ...newItem.additionalInfo, nip: e.target.value }
                                        })}
                                        placeholder="Ex: 19800101..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Wali Kelas (Wajib)</Label>
                                    <Select
                                        value={newItem.additionalInfo.classId}
                                        onValueChange={(value) => setNewItem({
                                            ...newItem,
                                            additionalInfo: { ...newItem.additionalInfo, classId: value }
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kelas yang Diampu (Wajib)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                        <Button onClick={handleCreate}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Password Dialog */}
            <Dialog open={isEditPassOpen} onOpenChange={setIsEditPassOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ganti Password: {selectedUser?.username}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Password Baru</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="*******"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditPassOpen(false)}>Batal</Button>
                        <Button onClick={handleUpdatePassword}>Simpan Password</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
