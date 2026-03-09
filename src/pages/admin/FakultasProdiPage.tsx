// src/pages/admin/FakultasProdiPage.tsx
import { useState, useMemo } from 'react';
import { useFakultasProdi, Fakultas, Prodi } from '@/hooks/useFakultasProdi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, Trash2, Loader2, Search, Edit2, 
  MoreHorizontal, School, BookOpen, Save, 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; // <-- Import useAuth

export default function FakultasProdiPage() {
    const { user } = useAuth(); // <-- Ambil user dari context
    
    // Cek apakah user adalah Super Admin (yang berhak kelola Fakultas)
    const isSuperAdmin = user?.role === 'ADMIN';

    const {
        fakultasList, prodiList, isLoading, isProcessing,
        handleCreateFakultas, handleUpdateFakultas, handleDeleteFakultas,
        handleCreateProdi, handleUpdateProdi, handleDeleteProdi
    } = useFakultasProdi();

    const [isFakultasModalOpen, setIsFakultasModalOpen] = useState(false);
    const [isProdiModalOpen, setIsProdiModalOpen] = useState(false);
    const [editingFakultas, setEditingFakultas] = useState<Fakultas | null>(null);
    const [editingProdi, setEditingProdi] = useState<Prodi | null>(null);
    const [namaInput, setNamaInput] = useState('');
    const [selectedFakultasId, setSelectedFakultasId] = useState('');
    const [searchFakultas, setSearchFakultas] = useState('');
    const [searchProdi, setSearchProdi] = useState('');

    // --- LOGIKA FILTER ---
    const filteredFakultas = useMemo(() => {
        return fakultasList.filter(f => f.nama.toLowerCase().includes(searchFakultas.toLowerCase()));
    }, [fakultasList, searchFakultas]);

    const filteredProdi = useMemo(() => {
        return prodiList.filter(p => 
            p.nama.toLowerCase().includes(searchProdi.toLowerCase()) || 
            p.fakultas?.nama.toLowerCase().includes(searchProdi.toLowerCase())
        );
    }, [prodiList, searchProdi]);

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

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Struktur Akademik</h1>
                    <p className="text-sm text-slate-500">Manajemen data master Fakultas dan Program Studi kampus.</p>
                </div>
            </div>

            <Tabs defaultValue={isSuperAdmin ? "fakultas" : "prodi"} className="w-full space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    <TabsList className="bg-slate-100/50 border-none p-1">
                        {/* Tab Fakultas Hanya Muncul jika Super Admin */}
                        {isSuperAdmin && (
                            <TabsTrigger value="fakultas" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <School className="w-4 h-4 mr-2" /> Fakultas
                            </TabsTrigger>
                        )}
                        <TabsTrigger value="prodi" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <BookOpen className="w-4 h-4 mr-2" /> Program Studi
                        </TabsTrigger>
                    </TabsList>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                        {/* Tombol Tambah Fakultas Hanya Muncul jika Super Admin */}
                        {isSuperAdmin && (
                            <TabsContent value="fakultas" className="mt-0 w-full">
                                <Button onClick={openAddFakultas} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto rounded-xl shadow-sm">
                                    <Plus className="w-4 h-4 mr-2" /> Tambah Fakultas
                                </Button>
                            </TabsContent>
                        )}
                        <TabsContent value="prodi" className="mt-0 w-full">
                            <Button onClick={openAddProdi} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto rounded-xl shadow-sm">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Prodi
                            </Button>
                        </TabsContent>
                    </div>
                </div>

                {/* --- TAB FAKULTAS (Hanya di-render jika Super Admin) --- */}
                {isSuperAdmin && (
                    <TabsContent value="fakultas" className="space-y-4">
                        <div className="flex items-center px-3 border rounded-xl bg-white shadow-sm max-w-md focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                            <Search className="w-4 h-4 text-gray-400" />
                            <Input 
                                placeholder="Cari fakultas..." 
                                className="border-0 focus-visible:ring-0 text-sm h-10" 
                                value={searchFakultas} 
                                onChange={(e) => setSearchFakultas(e.target.value)} 
                            />
                        </div>

                        <div className="border rounded-xl bg-white overflow-hidden shadow-sm border-slate-200">
                            <Table>
                                <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
                                    <TableRow className="hover:bg-transparent border-b border-slate-200">
                                        <TableHead className="h-12 px-4 text-center font-bold text-[11px] uppercase text-slate-600 w-16">No</TableHead>
                                        <TableHead className="h-12 px-4 text-left font-bold text-[11px] uppercase text-slate-600">Nama Fakultas</TableHead>
                                        <TableHead className="h-12 px-4 text-left font-bold text-[11px] uppercase text-slate-600">Statistik</TableHead>
                                        <TableHead className="h-12 px-4 text-right font-bold text-[11px] uppercase text-slate-600">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="animate-spin inline mr-2 text-indigo-500" /> Memuat data...</TableCell></TableRow>
                                    ) : filteredFakultas.length === 0 ? (
                                        <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400 text-sm">Data fakultas tidak ditemukan</TableCell></TableRow>
                                    ) : filteredFakultas.map((item, index) => (
                                        <TableRow key={item.id_fakultas} className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                                            <TableCell className="px-4 py-3 text-center text-xs font-mono text-slate-500">{index + 1}</TableCell>
                                            <TableCell className="px-4 py-3 font-bold text-xs uppercase text-slate-900">{item.nama}</TableCell>
                                            <TableCell className="px-4 py-3">
                                                <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold">
                                                    {item._count?.prodis || 0} PRODI
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-right">
                                                <DropdownAction onEdit={() => openEditFakultas(item)} onDelete={() => handleDeleteFakultas(item.id_fakultas)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                )}

                {/* --- TAB PRODI --- */}
                <TabsContent value="prodi" className="space-y-4">
                    <div className="flex items-center px-3 border rounded-xl bg-white shadow-sm max-w-md focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                        <Search className="w-4 h-4 text-gray-400" />
                        <Input 
                            placeholder="Cari prodi atau fakultas..." 
                            className="border-0 focus-visible:ring-0 text-sm h-10" 
                            value={searchProdi} 
                            onChange={(e) => setSearchProdi(e.target.value)} 
                        />
                    </div>

                    <div className="border rounded-xl bg-white overflow-hidden shadow-sm border-slate-200">
                        <Table>
                            <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
                                <TableRow className="hover:bg-transparent border-b border-slate-200">
                                    <TableHead className="h-12 px-4 text-center font-bold text-[11px] uppercase text-slate-600 w-16">No</TableHead>
                                    <TableHead className="h-12 px-4 text-left font-bold text-[11px] uppercase text-slate-600">Program Studi</TableHead>
                                    <TableHead className="h-12 px-4 text-left font-bold text-[11px] uppercase text-slate-600">Fakultas</TableHead>
                                    <TableHead className="h-12 px-4 text-right font-bold text-[11px] uppercase text-slate-600">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="animate-spin inline mr-2 text-indigo-500" /> Memuat data...</TableCell></TableRow>
                                ) : filteredProdi.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} className="text-center py-20 text-slate-400 text-sm">Data prodi tidak ditemukan</TableCell></TableRow>
                                ) : filteredProdi.map((item, index) => (
                                    <TableRow key={item.id_prodi} className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                                        <TableCell className="px-4 py-3 text-center text-xs font-mono text-slate-500">{index + 1}</TableCell>
                                        <TableCell className="px-4 py-3 font-bold text-xs uppercase text-slate-900">{item.nama}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{item.fakultas?.nama}</span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-right">
                                            <DropdownAction onEdit={() => openEditProdi(item)} onDelete={() => handleDeleteProdi(item.id_prodi)} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* MODALS */}
            {isSuperAdmin && (
                <FakultasDialog 
                    isOpen={isFakultasModalOpen} 
                    setIsOpen={setIsFakultasModalOpen} 
                    editing={editingFakultas} 
                    namaInput={namaInput} 
                    setNamaInput={setNamaInput} 
                    onSubmit={submitFakultas} 
                    isProcessing={isProcessing} 
                />
            )}

            <ProdiDialog 
                isOpen={isProdiModalOpen} 
                setIsOpen={setIsProdiModalOpen} 
                editing={editingProdi} 
                namaInput={namaInput} 
                setNamaInput={setNamaInput} 
                fakultasList={fakultasList}
                selectedFakultasId={selectedFakultasId}
                setSelectedFakultasId={setSelectedFakultasId}
                onSubmit={submitProdi} 
                isProcessing={isProcessing} 
            />
        </div>
    );
}

// Helper Components
function DropdownAction({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                    <Edit2 className="w-4 h-4 mr-2 text-indigo-600" /> Edit Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-600 focus:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" /> Hapus Permanen
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function FakultasDialog({ isOpen, setIsOpen, editing, namaInput, setNamaInput, onSubmit, isProcessing }: any) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">{editing ? 'Ubah' : 'Tambah'} Fakultas</DialogTitle>
                    <DialogDescription>Masukkan nama fakultas secara lengkap dan benar.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase text-slate-500">Nama Fakultas</Label>
                        <Input value={namaInput} onChange={(e) => setNamaInput(e.target.value)} required className="rounded-xl border-slate-200" placeholder="Contoh: Fakultas Teknik" />
                    </div>
                    <DialogFooter className="pt-4 gap-2">
                        <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setIsOpen(false)}>Batal</Button>
                        <Button type="submit" disabled={isProcessing} className="flex-1 rounded-xl bg-indigo-600">
                            {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ProdiDialog({ isOpen, setIsOpen, editing, namaInput, setNamaInput, fakultasList, selectedFakultasId, setSelectedFakultasId, onSubmit, isProcessing }: any) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">{editing ? 'Ubah' : 'Tambah'} Prodi</DialogTitle>
                    <DialogDescription>Pilih fakultas induk dan masukkan nama program studi.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase text-slate-500">Induk Fakultas</Label>
                        <Select value={selectedFakultasId} onValueChange={setSelectedFakultasId}>
                            <SelectTrigger className="rounded-xl border-slate-200">
                                <SelectValue placeholder="Pilih Fakultas" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {fakultasList.map((f: any) => (
                                    <SelectItem key={f.id_fakultas} value={f.id_fakultas.toString()}>{f.nama}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold uppercase text-slate-500">Nama Program Studi</Label>
                        <Input value={namaInput} onChange={(e) => setNamaInput(e.target.value)} required className="rounded-xl border-slate-200" placeholder="Contoh: Informatika" />
                    </div>
                    <DialogFooter className="pt-4 gap-2">
                        <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setIsOpen(false)}>Batal</Button>
                        <Button type="submit" disabled={isProcessing || !selectedFakultasId} className="flex-1 rounded-xl bg-indigo-600">
                            {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}