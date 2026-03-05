import { useState, useMemo } from 'react';
import { useFakultasProdi, Fakultas, Prodi } from '@/hooks/useFakultasProdi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Loader2, Search, Edit, ArrowUpDown, Save } from 'lucide-react';

export default function FakultasProdiPage() {
    const {
        fakultasList, prodiList, isLoading, isProcessing,
        handleCreateFakultas, handleUpdateFakultas, handleDeleteFakultas,
        handleCreateProdi, handleUpdateProdi, handleDeleteProdi
    } = useFakultasProdi();

    // State Modal
    const [isFakultasModalOpen, setIsFakultasModalOpen] = useState(false);
    const [isProdiModalOpen, setIsProdiModalOpen] = useState(false);

    // State Form & Edit
    const [editingFakultas, setEditingFakultas] = useState<Fakultas | null>(null);
    const [editingProdi, setEditingProdi] = useState<Prodi | null>(null);
    const [namaInput, setNamaInput] = useState('');
    const [selectedFakultasId, setSelectedFakultasId] = useState('');

    // State Search & Sort
    const [searchFakultas, setSearchFakultas] = useState('');
    const [searchProdi, setSearchProdi] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // --- LOGIKA FILTER & SORT ---
    const filteredFakultas = useMemo(() => {
        return [...fakultasList]
            .filter(f => f.nama.toLowerCase().includes(searchFakultas.toLowerCase()))
            .sort((a, b) => sortOrder === 'asc' ? a.nama.localeCompare(b.nama) : b.nama.localeCompare(a.nama));
    }, [fakultasList, searchFakultas, sortOrder]);

    const filteredProdi = useMemo(() => {
        return [...prodiList]
            .filter(p => p.nama.toLowerCase().includes(searchProdi.toLowerCase()) || p.fakultas?.nama.toLowerCase().includes(searchProdi.toLowerCase()))
            .sort((a, b) => sortOrder === 'asc' ? a.nama.localeCompare(b.nama) : b.nama.localeCompare(a.nama));
    }, [prodiList, searchProdi, sortOrder]);

    // --- HANDLERS ---
    const openAddFakultas = () => {
        setEditingFakultas(null);
        setNamaInput('');
        setIsFakultasModalOpen(true);
    };

    const openEditFakultas = (fakultas: Fakultas) => {
        setEditingFakultas(fakultas);
        setNamaInput(fakultas.nama);
        setIsFakultasModalOpen(true);
    };

    const openAddProdi = () => {
        setEditingProdi(null);
        setNamaInput('');
        setSelectedFakultasId('');
        setIsProdiModalOpen(true);
    };

    const openEditProdi = (prodi: Prodi) => {
        setEditingProdi(prodi);
        setNamaInput(prodi.nama);
        setSelectedFakultasId(prodi.fakultas_id.toString());
        setIsProdiModalOpen(true);
    };

    const submitFakultas = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = editingFakultas
            ? await handleUpdateFakultas(editingFakultas.id_fakultas, namaInput)
            : await handleCreateFakultas(namaInput);

        if (success) setIsFakultasModalOpen(false);
    };

    const submitProdi = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFakultasId) return;
        const success = editingProdi
            ? await handleUpdateProdi(editingProdi.id_prodi, namaInput, Number(selectedFakultasId))
            : await handleCreateProdi(namaInput, Number(selectedFakultasId));

        if (success) setIsProdiModalOpen(false);
    };

    const toggleSort = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black text-indigo-950 uppercase tracking-tight">Manajemen Fakultas & Prodi</h1>
                <Button variant="outline" size="sm" onClick={toggleSort} className="rounded-xl border-slate-200">
                    <ArrowUpDown className="w-4 h-4 mr-2" /> Urutan: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                </Button>
            </div>

            <Tabs defaultValue="fakultas" className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <TabsList className="mb-6 bg-slate-100 p-1 rounded-2xl">
                    <TabsTrigger value="fakultas" className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Fakultas</TabsTrigger>
                    <TabsTrigger value="prodi" className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Program Studi</TabsTrigger>
                </TabsList>

                {/* TAB FAKULTAS */}
                <TabsContent value="fakultas" className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="Cari fakultas..." className="pl-10 rounded-xl bg-slate-50 border-none" value={searchFakultas} onChange={(e) => setSearchFakultas(e.target.value)} />
                        </div>
                        <Button onClick={openAddFakultas} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Fakultas
                        </Button>
                    </div>

                    <div className="border rounded-2xl overflow-hidden border-slate-100">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead>Nama Fakultas</TableHead>
                                    <TableHead>Jumlah Prodi</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="animate-spin inline mr-2 text-indigo-500" /> Memuat...</TableCell></TableRow>
                                ) : filteredFakultas.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400">Data tidak ditemukan</TableCell></TableRow>
                                ) : filteredFakultas.map((item, index) => (
                                    <TableRow key={item.id_fakultas} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="text-slate-400 font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-bold text-slate-700">{item.nama}</TableCell>
                                        <TableCell className='font-medium text-slate-700'>{item._count?.prodis} Prodi</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="text-indigo-500 hover:bg-indigo-50 rounded-lg" onClick={() => openEditFakultas(item)}><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteFakultas(item.id_fakultas)} disabled={isProcessing}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* TAB PRODI */}
                <TabsContent value="prodi" className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input placeholder="Cari prodi atau fakultas..." className="pl-10 rounded-xl bg-slate-50 border-none" value={searchProdi} onChange={(e) => setSearchProdi(e.target.value)} />
                        </div>
                        <Button onClick={openAddProdi} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Prodi
                        </Button>
                    </div>

                    <div className="border rounded-2xl overflow-hidden border-slate-100">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="w-12">No</TableHead>
                                    <TableHead>Fakultas</TableHead>
                                    <TableHead>Program Studi</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="animate-spin inline mr-2 text-indigo-500" /> Memuat...</TableCell></TableRow>
                                ) : filteredProdi.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400">Data tidak ditemukan</TableCell></TableRow>
                                ) : filteredProdi.map((item, index) => (
                                    <TableRow key={item.id_prodi} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="text-slate-400 font-medium">{index + 1}</TableCell>
                                        <TableCell className="text-slate-500 font-medium text-xs uppercase tracking-wider">{item.fakultas?.nama}</TableCell>
                                        <TableCell className="font-bold text-slate-700">{item.nama}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="text-indigo-500 hover:bg-indigo-50 rounded-lg" onClick={() => openEditProdi(item)}><Edit className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 rounded-lg" onClick={() => handleDeleteProdi(item.id_prodi)} disabled={isProcessing}><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* SHARED DIALOG FOR FAKULTAS */}
            <Dialog open={isFakultasModalOpen} onOpenChange={setIsFakultasModalOpen}>
                <DialogContent className="rounded-[2rem] border-none shadow-2xl">
                    <DialogHeader><DialogTitle className="font-black text-indigo-950 uppercase">{editingFakultas ? 'Edit' : 'Tambah'} Fakultas</DialogTitle></DialogHeader>
                    <form onSubmit={submitFakultas} className="space-y-6 mt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nama Fakultas</Label>
                            <Input value={namaInput} onChange={(e) => setNamaInput(e.target.value)} required className="h-12 rounded-2xl bg-slate-50 border-none font-bold" />
                        </div>
                        <Button type="submit" disabled={isProcessing} className="w-full h-12 rounded-2xl bg-indigo-600 font-bold uppercase tracking-widest shadow-lg shadow-indigo-100">
                            {isProcessing ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-4 w-4" />} {editingFakultas ? 'Simpan Perubahan' : 'Tambah Sekarang'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* SHARED DIALOG FOR PRODI */}
            <Dialog open={isProdiModalOpen} onOpenChange={setIsProdiModalOpen}>
                <DialogContent className="rounded-[2rem] border-none shadow-2xl">
                    <DialogHeader><DialogTitle className="font-black text-indigo-950 uppercase">{editingProdi ? 'Edit' : 'Tambah'} Program Studi</DialogTitle></DialogHeader>
                    <form onSubmit={submitProdi} className="space-y-6 mt-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Induk Fakultas</Label>
                            <Select value={selectedFakultasId} onValueChange={setSelectedFakultasId}>
                                <SelectTrigger className="h-12 rounded-2xl bg-slate-50 border-none font-bold"><SelectValue placeholder="Pilih Fakultas" /></SelectTrigger>
                                <SelectContent className="rounded-2xl shadow-xl border-slate-100">
                                    {fakultasList.map((f) => (<SelectItem key={f.id_fakultas} value={f.id_fakultas.toString()} className="rounded-xl my-1">{f.nama}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Nama Program Studi</Label>
                            <Input value={namaInput} onChange={(e) => setNamaInput(e.target.value)} required className="h-12 rounded-2xl bg-slate-50 border-none font-bold" />
                        </div>
                        <Button type="submit" disabled={isProcessing || !selectedFakultasId} className="w-full h-12 rounded-2xl bg-indigo-600 font-bold uppercase tracking-widest shadow-lg shadow-indigo-100">
                            {isProcessing ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-4 w-4" />} {editingProdi ? 'Simpan Perubahan' : 'Tambah Sekarang'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}