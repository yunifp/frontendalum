import React, { useState, useMemo } from 'react';
import { useSektorPekerjaan, SektorPekerjaan } from '@/hooks/useSektorPekerjaan';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Loader2, Search, Edit, ArrowUpDown, Save, Briefcase } from 'lucide-react';

export default function SektorPekerjaanPage() {
    const {
        sektorList, isLoading, isProcessing,
        handleCreateSektor, handleUpdateSektor, handleDeleteSektor
    } = useSektorPekerjaan();

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State Form
    const [editingSektor, setEditingSektor] = useState<SektorPekerjaan | null>(null);
    const [idInput, setIdInput] = useState(''); // ID Sektor (misal: IT, EDU)
    const [namaInput, setNamaInput] = useState('');

    // State Search & Sort
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // --- LOGIKA FILTER & SORT ---
    const filteredSektor = useMemo(() => {
        return [...sektorList]
            .filter(s =>
                s.nama_sektor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.id_sektor.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => sortOrder === 'asc'
                ? a.nama_sektor.localeCompare(b.nama_sektor)
                : b.nama_sektor.localeCompare(a.nama_sektor)
            );
    }, [sektorList, searchQuery, sortOrder]);

    // --- HANDLERS ---
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
        let success = false;

        if (editingSektor) {
            success = await handleUpdateSektor(editingSektor.id_sektor, namaInput);
        } else {
            success = await handleCreateSektor(idInput, namaInput);
        }

        if (success) setIsModalOpen(false);
    };

    const toggleSort = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

    return (
        <div className="p-8 space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-indigo-950 uppercase tracking-tight flex items-center gap-3">
                        <Briefcase className="text-indigo-600" /> Manajemen Sektor Pekerjaan
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">Kelola kategori bidang pekerjaan untuk riwayat karir alumni.</p>
                </div>
                <Button variant="outline" size="sm" onClick={toggleSort} className="rounded-xl border-slate-200 font-bold text-slate-600 shadow-sm">
                    <ArrowUpDown className="w-4 h-4 mr-2" /> Urutan: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                </Button>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari ID atau nama sektor..."
                            className="pl-12 h-11 rounded-2xl bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={openAddModal} className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl h-11 px-6 font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
                        <Plus className="w-4 h-4 mr-2 stroke-3" /> Tambah Sektor
                    </Button>
                </div>

                <div className="border rounded-[2rem] overflow-hidden border-slate-100 shadow-inner bg-slate-50/30">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="w-16 text-center font-bold">No</TableHead>
                                <TableHead className="w-32 font-bold">ID Sektor</TableHead>
                                <TableHead className="font-bold">Nama Sektor Industri</TableHead>
                                <TableHead className="font-bold text-center">Pengguna</TableHead>
                                <TableHead className="text-right font-bold pr-8">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-indigo-500 h-10 w-10" />
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat data Sektor...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredSektor.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center gap-2 opacity-40">
                                            <Search size={40} />
                                            <p className="text-sm font-bold uppercase tracking-tighter">Data tidak ditemukan</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredSektor.map((item, index) => (
                                <TableRow key={item.id_sektor} className="hover:bg-white transition-colors border-slate-50">
                                    <TableCell className="text-center text-slate-400 font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <code className="bg-slate-100 px-2 py-1 rounded-md text-xs font-bold text-indigo-600">
                                            {item.id_sektor}
                                        </code>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-700">{item.nama_sektor}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-none font-bold">
                                            {item._count?.karirs || 0} Karir
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-indigo-500 hover:bg-indigo-50 rounded-xl"
                                                onClick={() => openEditModal(item)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:bg-red-50 rounded-xl"
                                                onClick={() => handleDeleteSektor(item.id_sektor)}
                                                disabled={isProcessing}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* DIALOG FORM */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-md">
                    <div className="bg-indigo-600 p-8 text-white relative">
                        <DialogHeader>
                            <DialogTitle className="font-black uppercase tracking-tight text-xl">
                                {editingSektor ? 'Edit Sektor' : 'Sektor Baru'}
                            </DialogTitle>
                            <p className="text-indigo-100 text-xs font-medium">
                                {editingSektor ? 'Perbarui informasi kategori industri pekerjaan.' : 'Tambahkan kategori industri baru ke dalam sistem.'}
                            </p>
                        </DialogHeader>
                        <Briefcase className="absolute right-6 bottom-6 text-white/10 w-20 h-20 -rotate-12" />
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">ID Sektor (Kode)</Label>
                                <Input
                                    value={idInput}
                                    onChange={(e) => setIdInput(e.target.value.toUpperCase())}
                                    required
                                    disabled={!!editingSektor}
                                    placeholder="Contoh: IT, FIN, EDU"
                                    className="h-12 rounded-2xl bg-slate-50 border-none font-bold focus-visible:ring-indigo-500/20"
                                />
                                {editingSektor && <p className="text-[9px] text-amber-600 font-bold ml-1 italic">* ID Sektor tidak dapat diubah untuk menjaga integritas data.</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Nama Sektor</Label>
                                <Input
                                    value={namaInput}
                                    onChange={(e) => setNamaInput(e.target.value)}
                                    required
                                    placeholder="Contoh: Teknologi Informasi"
                                    className="h-12 rounded-2xl bg-slate-50 border-none font-bold focus-visible:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 h-12 rounded-2xl font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                                Batal
                            </Button>
                            <Button type="submit" disabled={isProcessing} className="flex-2 h-12 rounded-2xl bg-indigo-600 font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                                {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                {editingSektor ? 'Simpan' : 'Tambah'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}