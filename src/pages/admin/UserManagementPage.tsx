/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUsers } from '@/hooks/useUsers';
import {
    Plus, Search, Edit2, Trash2, ShieldCheck, Mail, Key,
    Loader2, ChevronLeft, ChevronRight, MoreVertical, FilterX, SlidersHorizontal, Building, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FilterState {
    role: string;
    status: string;
    fakultasId: string;
    prodiId: string;
}

export default function UserManagementPage() {
    const { user } = useAuth();

    // Ambil semua fungsi dan data master dari hook
    const {
        users, isLoading, isProcessing, total,
        fetchUsers, submitUser, deleteUser,
        masterFakultas, masterProdi, fetchMasterData, myProfile
    } = useUsers(user);

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [filters, setFilters] = useState<FilterState>({
        role: 'all', status: 'all', fakultasId: 'all', prodiId: 'all'
    });

    const [formData, setFormData] = useState({
        username: '', email: '', nim: '', password: '', role: 'USER', status: 'ACTIVE', hp: '',
        nama_lengkap: '', program_studi_id: '', fakultas_id: ''
    });

    useEffect(() => {
        fetchMasterData();
    }, []);

    // 🌟 KUNCI PERBAIKAN: Hitung state *Effective Filter* sebelum memanggil fetch
    // Ini memastikan UI dan pemanggilan API memiliki pemahaman yang sama soal siapa yang dikunci
    const effectiveFakultasId = ['ADMIN_FAKULTAS', 'ADMIN_PRODI'].includes(user?.role || '') && myProfile?.fakultas_id
        ? String(myProfile.fakultas_id)
        : filters.fakultasId;

    const effectiveProdiId = user?.role === 'ADMIN_PRODI' && myProfile?.program_studi_id
        ? String(myProfile.program_studi_id)
        : filters.prodiId;

    useEffect(() => {
        const timer = setTimeout(() => {
            // Kita pass data yang sudah dihitung 'effective'-nya agar backend tidak kebingungan
            fetchUsers(page, search, filters.role, filters.status, effectiveFakultasId, effectiveProdiId);
        }, 500);
        return () => clearTimeout(timer);
    }, [page, search, filters.role, filters.status, effectiveFakultasId, effectiveProdiId, fetchUsers]);

    // Berikan izin akses untuk ADMIN, ADMIN_FAKULTAS, dan ADMIN_PRODI
    if (!['ADMIN', 'ADMIN_FAKULTAS', 'ADMIN_PRODI'].includes(user?.role || '')) {
        return <Navigate to="/" replace />;
    }

    const resetFilters = () => {
        setFilters({ role: 'all', status: 'all', fakultasId: 'all', prodiId: 'all' });
        setSearch('');
        setPage(1);
    };

    // Role Option Dinamis berdasarkan Jabatan User
    const availableRoles = user?.role === 'ADMIN'
        ? [{ value: 'ADMIN', label: 'Admin' }, { value: 'ADMIN_FAKULTAS', label: 'Admin Fakultas' }, { value: 'ADMIN_PRODI', label: 'Admin Prodi' }, { value: 'USER', label: 'User' }]
        : user?.role === 'ADMIN_FAKULTAS'
            ? [{ value: 'ADMIN_PRODI', label: 'Admin Prodi' }, { value: 'USER', label: 'User' }]
            : [{ value: 'USER', label: 'User' }];

    const handleOpenModal = (userData?: any) => {
        if (userData) {
            setSelectedUser(userData);
            setFormData({
                ...userData,
                password: '',
                nama_lengkap: userData.profile?.nama_lengkap || '',
                fakultas_id: userData.profile?.fakultas_id ? String(userData.profile.fakultas_id) : '',
                program_studi_id: userData.profile?.program_studi_id ? String(userData.profile.program_studi_id) : ''
            });
        } else {
            setSelectedUser(null);
            setFormData({
                username: '', email: '', nim: '', password: '', status: 'ACTIVE', hp: '', nama_lengkap: '',
                role: availableRoles[0].value, // Set default role aman
                fakultas_id: ['ADMIN_FAKULTAS', 'ADMIN_PRODI'].includes(user?.role || '') && myProfile?.fakultas_id ? String(myProfile.fakultas_id) : '',
                program_studi_id: user?.role === 'ADMIN_PRODI' && myProfile?.program_studi_id ? String(myProfile.program_studi_id) : ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const action = selectedUser ? 'UPDATE' : 'CREATE';

        const finalData = { ...formData };
        if (formData.role === 'ADMIN') {
            finalData.fakultas_id = '';
            finalData.program_studi_id = '';
        } else if (formData.role === 'ADMIN_FAKULTAS') {
            finalData.program_studi_id = '';
        }

        const success = await submitUser(action, finalData, selectedUser?.id);
        if (success) {
            setIsModalOpen(false);
            fetchUsers(page, search, filters.role, filters.status, effectiveFakultasId, effectiveProdiId);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Hapus akun ini secara permanen? Data terkait mungkin akan hilang.")) {
            await deleteUser(id);
            fetchUsers(page, search, filters.role, filters.status, effectiveFakultasId, effectiveProdiId);
        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                        <ShieldCheck className="text-indigo-600" /> Akun Pengguna
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Kendalikan akses dan kredensial pengguna</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" onClick={resetFilters} className="rounded-xl border-slate-200 font-bold text-xs uppercase h-11">
                        <FilterX size={14} className="mr-2" /> Reset
                    </Button>
                    <Button onClick={() => handleOpenModal()} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 font-bold uppercase tracking-widest text-xs flex-1 md:flex-none shadow-lg shadow-indigo-100">
                        <Plus size={18} className="mr-2" /> Tambah User
                    </Button>
                </div>
            </div>

            {/* --- FILTER BAR --- */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                    <SlidersHorizontal size={16} /> Filter Pencarian
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
                        <Input
                            placeholder="Cari Username, Email, NIM..."
                            className="pl-11 h-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm font-bold"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>

                    <Select value={filters.role} onValueChange={(v) => { setFilters({ ...filters, role: v }); setPage(1); }}>
                        <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Role</SelectItem>
                            {availableRoles.map(r => (
                                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filters.status} onValueChange={(v) => { setFilters({ ...filters, status: v }); setPage(1); }}>
                        <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            {['ACTIVE', 'PENDING', 'DEACTIVATED', 'REJECTED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    {/* FAKULTAS FILTER */}
                    <Select
                        value={effectiveFakultasId}
                        onValueChange={(v) => { setFilters({ ...filters, fakultasId: v, prodiId: 'all' }); setPage(1); }}
                        disabled={['ADMIN_FAKULTAS', 'ADMIN_PRODI'].includes(user?.role || '')}
                    >
                        <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600 lg:col-span-2">
                            <SelectValue placeholder="Fakultas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Fakultas</SelectItem>
                            {masterFakultas.map(f => <SelectItem key={f.id_fakultas} value={String(f.id_fakultas)}>{f.nama}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    {/* PROGRAM STUDI FILTER */}
                    <Select
                        value={effectiveProdiId}
                        onValueChange={(v) => { setFilters({ ...filters, prodiId: v }); setPage(1); }}
                        disabled={user?.role === 'ADMIN_PRODI'}
                    >
                        <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600 lg:col-span-3">
                            <SelectValue placeholder="Program Studi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Program Studi</SelectItem>
                            {masterProdi
                                /* LOGIKA DINAMIS PRODI: Jika Fakultas terpilih (bukan 'all'), tampilkan Prodi milik Fakultas tsb saja. 
                                   Jika Fakultas 'all', tampilkan SELURUH Prodi. */
                                .filter(p => effectiveFakultasId === 'all' || String(p.fakultas_id) === effectiveFakultasId)
                                .map(p => <SelectItem key={p.id_prodi} value={String(p.id_prodi)}>{p.nama}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* --- TABLE SECTION --- */}
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest text-slate-400">Identitas Akun</TableHead>
                            <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest text-slate-400">Afiliasi Akademik</TableHead>
                            <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest text-slate-400">Akses / Role</TableHead>
                            <TableHead className="px-6 h-12 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
                            <TableHead className="px-6 h-12 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Kelola</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={5} className="h-64 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></TableCell></TableRow>
                        ) : users.length > 0 ? users.map((u) => (
                            <TableRow key={u.id} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                                <TableCell className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="font-black text-slate-900 text-sm uppercase">{u.profile?.nama_lengkap || u.username}</span>
                                        <span className="text-[10px] font-mono text-slate-400 mt-0.5 tracking-tighter">NIM/NIDN: {u.nim || '-'}</span>
                                        <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs font-medium">
                                            <Mail size={12} className="text-slate-300" /> {u.email}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                                            <Building size={12} className="text-indigo-400" />
                                            {/* Logic Prodi: Hanya tampil untuk USER dan ADMIN_PRODI */}
                                            {['USER', 'ADMIN_PRODI'].includes(u.role) ? (u.profile?.prodi?.nama || 'Belum Diatur') : '-'}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            {/* Logic Fakultas: Tampilkan khusus selain ADMIN */}
                                            {u.role === 'ADMIN' ? 'Sistem Administrator' : (u.profile?.fakultas?.nama || '-')}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    <Badge variant="outline" className="font-black text-[9px] bg-indigo-50 text-indigo-700 border-indigo-100 px-3 tracking-widest">{u.role}</Badge>
                                </TableCell>
                                <TableCell className="px-6 py-5">
                                    <Badge className={`text-[9px] font-black uppercase px-2.5 py-1 shadow-none border ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        u.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            'bg-rose-50 text-rose-600 border-rose-100'
                                        }`}>{u.status}</Badge>
                                </TableCell>
                                <TableCell className="px-6 py-5 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9"><MoreVertical size={16} /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-xl p-2 min-w-40">
                                            <DropdownMenuItem onClick={() => handleOpenModal(u)} className="cursor-pointer font-bold text-xs py-2.5"><Edit2 size={14} className="mr-3 text-blue-500" /> Edit Akun</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(u.id)} className="cursor-pointer font-bold text-xs text-rose-600 py-2.5"><Trash2 size={14} className="mr-3" /> Hapus User</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} className="h-64 text-center font-bold text-xs text-slate-400 uppercase tracking-widest">Tidak ada data ditemukan</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="p-5 bg-white border-t flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Total {total} Records • Hal {page}</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl h-9 w-9 p-0 border-slate-200" disabled={page === 1 || isLoading} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></Button>
                        <Button variant="outline" size="sm" className="rounded-xl h-9 w-9 p-0 border-slate-200" disabled={page * 10 >= total || isLoading} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></Button>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORM --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-indigo-600 p-8 text-white">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight leading-none">
                            {selectedUser ? 'Edit Akun' : 'Tambah Akun Baru'}
                        </DialogTitle>
                        <p className="text-indigo-200 text-[10px] mt-2 font-bold uppercase tracking-widest">Manajemen Kredensial & Identitas Profile</p>
                    </div>

                    <form onSubmit={handleSave} className="p-8 space-y-6 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Informasi Akun (RBAC)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase ml-1 text-slate-500">Username *</Label>
                                    <Input required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase ml-1 text-slate-500">Email *</Label>
                                    <Input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase ml-1 text-slate-500">NIM/NIDN (Opsional)</Label>
                                    <Input value={formData.nim} onChange={e => setFormData({ ...formData, nim: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-none font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase ml-1 text-slate-500">No HP</Label>
                                    <Input value={formData.hp} onChange={e => setFormData({ ...formData, hp: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase ml-1 text-slate-500">Role</Label>
                                    <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                                        <SelectTrigger className="h-12 w-full rounded-xl bg-slate-50 border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {availableRoles.map(r => (
                                                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase ml-1 text-slate-500">Status</Label>
                                    <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                                        <SelectTrigger className="h-12 w-full rounded-xl bg-slate-50 border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['ACTIVE', 'PENDING', 'DEACTIVATED', 'REJECTED'].map(s => <SelectItem key={s} value={s} className="font-bold text-xs">{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2 relative">
                                    <Label className="text-[10px] font-black uppercase ml-1 text-slate-500">{selectedUser ? 'Ganti Password (Kosongkan jika tidak)' : 'Password *'}</Label>
                                    <div className="relative">
                                        <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            type="password" placeholder="••••••••"
                                            value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className="h-12 pl-12 rounded-xl bg-slate-50 border-none font-bold text-lg"
                                            required={!selectedUser}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {formData.role !== 'ADMIN' && (
                            <div className="space-y-4 pt-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2 flex justify-between items-center">
                                    Profil Master
                                    <span className="text-[9px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full lowercase tracking-normal">Sync otomatis</span>
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-[10px] font-black uppercase ml-1 text-slate-500">Nama Lengkap</Label>
                                        <Input value={formData.nama_lengkap} onChange={e => setFormData({ ...formData, nama_lengkap: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-none font-bold uppercase" placeholder="Kosongkan jika sama dgn Username" />
                                    </div>

                                    <div className="col-span-2 space-y-2">
                                        <Label className="text-[10px] font-black uppercase ml-1 text-slate-500">Afiliasi Fakultas</Label>
                                        <Select
                                            value={formData.fakultas_id}
                                            onValueChange={v => setFormData({ ...formData, fakultas_id: v, program_studi_id: '' })}
                                            disabled={['ADMIN_FAKULTAS', 'ADMIN_PRODI'].includes(user?.role || '')}
                                        >
                                            <SelectTrigger className="h-12 w-full rounded-xl bg-slate-50 border-none font-bold text-xs"><SelectValue placeholder="Pilih Fakultas" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Belum Diatur</SelectItem>
                                                {masterFakultas.map(f => <SelectItem key={f.id_fakultas} value={String(f.id_fakultas)}>{f.nama}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {(formData.role === 'ADMIN_PRODI' || formData.role === 'USER') && (
                                        <div className="col-span-2 space-y-2">
                                            <Label className="text-[10px] font-black uppercase ml-1 text-slate-500">Afiliasi Program Studi</Label>
                                            <Select
                                                value={formData.program_studi_id}
                                                onValueChange={v => setFormData({ ...formData, program_studi_id: v })}
                                                disabled={user?.role === 'ADMIN_PRODI' || !formData.fakultas_id || formData.fakultas_id === 'none'}
                                            >
                                                <SelectTrigger className="h-12 w-full rounded-xl bg-slate-50 border-none font-bold text-xs"><SelectValue placeholder="Pilih Prodi" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Belum Diatur</SelectItem>
                                                    {masterProdi
                                                        .filter(p => String(p.fakultas_id) === formData.fakultas_id)
                                                        .map(p => <SelectItem key={p.id_prodi} value={String(p.id_prodi)}>{p.nama}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={isProcessing} className="w-full h-14 mt-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 uppercase font-black tracking-widest shadow-xl shadow-indigo-100 text-xs">
                            {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                            {selectedUser ? 'Simpan Perubahan' : 'Buat User Baru'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}