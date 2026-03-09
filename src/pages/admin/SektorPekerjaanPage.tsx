// src/pages/admin/SektorPekerjaanPage.tsx
import React, { useState, useMemo } from 'react';
import { useSektorPekerjaan, SektorPekerjaan } from '@/hooks/useSektorPekerjaan';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
    Plus, Trash2, Loader2, Search, Edit2, 
    MoreHorizontal, Briefcase, Save, AlertTriangle 
} from 'lucide-react';

export default function SektorPekerjaanPage() {
    const {
        sektorList, isLoading, isProcessing,
        handleCreateSektor, handleUpdateSektor, handleDeleteSektor
    } = useSektorPekerjaan();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSektor, setEditingSektor] = useState<SektorPekerjaan | null>(null);
    const [idInput, setIdInput] = useState('');
    const [namaInput, setNamaInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSektor = useMemo(() => {
        return sektorList.filter(s =>
            s.nama_sektor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id_sektor.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [sektorList, searchQuery]);

    const openAddModal = () => {
        setEditingSektor(null);
        setIdInput('');
        setNamaInput('');
        setIsModalOpen(true);
    };

    const openEditModal = (sektor: SektorPekerjaan) => {
        setEditingSektor(sektor);
        setIdInput(sektor.id_sektor);
        setNamaInput(sektor.nama_sektor);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = editingSektor
            ? await handleUpdateSektor(editingSektor.id_sektor, namaInput)
            : await handleCreateSektor(idInput, namaInput);
        if (success) setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sektor Pekerjaan</h1>
                    <p className="text-sm text-slate-500">Kelola kategori bidang industri untuk klasifikasi karir alumni.</p>
                </div>
                <Button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm gap-2">
                    <Plus className="w-4 h-4" /> Tambah Sektor
                </Button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center px-3 border rounded-xl bg-white shadow-sm max-w-md focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Search className="w-4 h-4 text-gray-400" />
                <Input 
                    placeholder="Cari ID atau nama sektor..." 
                    className="border-0 focus-visible:ring-0 text-sm h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Table Section */}
            <div className="border rounded-xl bg-white overflow-hidden shadow-sm border-slate-200">
                <Table>
                    <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
                        <TableRow className="hover:bg-transparent border-b border-slate-200">
                            <TableHead className="h-12 px-4 text-center font-bold text-[11px] uppercase text-slate-600 w-16">No</TableHead>
                            <TableHead className="h-12 px-4 text-left font-bold text-[11px] uppercase text-slate-600 w-32">ID Sektor</TableHead>
                            <TableHead className="h-12 px-4 text-left font-bold text-[11px] uppercase text-slate-600">Nama Industri</TableHead>
                            <TableHead className="h-12 px-4 text-center font-bold text-[11px] uppercase text-slate-600 w-32">Populasi</TableHead>
                            <TableHead className="h-12 px-4 text-right font-bold text-[11px] uppercase text-slate-600 w-20">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="animate-spin text-indigo-600 h-6 w-6" />
                                        <p className="text-xs text-slate-400 font-medium">Memuat data sektor...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredSektor.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="p-4 bg-slate-50 rounded-full">
                                            <Briefcase className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700">Data tidak ditemukan</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredSektor.map((item, index) => (
                            <TableRow key={item.id_sektor} className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                                <TableCell className="px-4 py-3 text-center text-xs font-mono text-slate-500">{index + 1}</TableCell>
                                <TableCell className="px-4 py-3">
                                    <code className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-600 border border-slate-200">
                                        {item.id_sektor}
                                    </code>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <span className="font-bold text-xs uppercase text-slate-900">{item.nama_sektor}</span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-600 border-emerald-100">
                                        {item._count?.karirs || 0} ALUMNI
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEditModal(item)} className="cursor-pointer text-slate-700">
                                                <Edit2 className="w-4 h-4 mr-2 text-indigo-600" /> Edit Sektor
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => handleDeleteSektor(item.id_sektor)} 
                                                className="cursor-pointer text-red-600 focus:text-red-700"
                                                disabled={isProcessing}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" /> Hapus Sektor
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* FORM MODAL */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
                    <div className="bg-indigo-600 p-6 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingSektor ? 'Ubah' : 'Tambah'} Sektor Pekerjaan</DialogTitle>
                            <DialogDescription className="text-indigo-100">
                                Pastikan kode dan nama sektor sesuai dengan standar industri.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase text-slate-500 ml-1">Kode Sektor (ID)</Label>
                                <Input
                                    value={idInput}
                                    onChange={(e) => setIdInput(e.target.value.toUpperCase())}
                                    required
                                    disabled={!!editingSektor}
                                    placeholder="Contoh: IT, EDU, FIN"
                                    className="rounded-xl border-slate-200 uppercase font-mono"
                                />
                                {editingSektor && (
                                    <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> ID tidak dapat diubah setelah dibuat.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold uppercase text-slate-500 ml-1">Nama Sektor Industri</Label>
                                <Input
                                    value={namaInput}
                                    onChange={(e) => setNamaInput(e.target.value)}
                                    required
                                    placeholder="Contoh: Teknologi Informasi"
                                    className="rounded-xl border-slate-200"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4 gap-2">
                            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setIsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isProcessing} className="flex-1 rounded-xl bg-indigo-600">
                                {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                {editingSektor ? 'Simpan' : 'Tambah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}