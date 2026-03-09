/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  CheckCircle, XCircle, Loader2, UserCheck, Clock, MoreHorizontal,
  CheckCircle2, Search, ChevronLeft, ChevronRight, AlertTriangle,
  FilterX, SlidersHorizontal, Building, Mail
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useVerification } from '@/hooks/useVerification';

interface ConfirmModalState {
  isOpen: boolean;
  userId: number;
  userName: string;
  action: 'ACTIVE' | 'REJECTED' | null;
}

interface FilterState {
  role: string;
  status: string;
  fakultasId: string;
  prodiId: string;
}

export default function VerificationPage() {
  const { user } = useAuth();
  const {
    users, isLoading, processingId, total,
    fetchUsers, handleUpdateStatus,
    masterFakultas, masterProdi, fetchMasterData, myProfile
  } = useVerification(user);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Default Status untuk Verifikasi adalah PENDING
  const [filters, setFilters] = useState<FilterState>({
    role: 'all', status: 'PENDING', fakultasId: 'all', prodiId: 'all'
  });

  const [modal, setModal] = useState<ConfirmModalState>({
    isOpen: false, userId: 0, userName: '', action: null
  });

  useEffect(() => {
    fetchMasterData();
  }, []);

  const effectiveFakultasId = ['ADMIN_FAKULTAS', 'ADMIN_PRODI'].includes(user?.role || '') && myProfile?.fakultas_id
    ? String(myProfile.fakultas_id)
    : filters.fakultasId;

  const effectiveProdiId = user?.role === 'ADMIN_PRODI' && myProfile?.program_studi_id
    ? String(myProfile.program_studi_id)
    : filters.prodiId;

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(page, search, filters.role, filters.status, effectiveFakultasId, effectiveProdiId);
    }, 500);
    return () => clearTimeout(timer);
  }, [page, search, filters.role, filters.status, effectiveFakultasId, effectiveProdiId, fetchUsers]);

  // Berikan izin akses untuk ADMIN, ADMIN_FAKULTAS, dan ADMIN_PRODI
  if (!['ADMIN', 'ADMIN_FAKULTAS', 'ADMIN_PRODI'].includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  const resetFilters = () => {
    setFilters({ role: 'all', status: 'PENDING', fakultasId: 'all', prodiId: 'all' });
    setSearch('');
    setPage(1);
  };

  const openConfirmModal = (id: number, name: string, action: 'ACTIVE' | 'REJECTED') => {
    setModal({ isOpen: true, userId: id, userName: name, action: action });
  };

  const onConfirmAction = async () => {
    if (modal.action && modal.userId) {
      const success = await handleUpdateStatus(modal.userId, modal.action);
      if (success) {
        setModal({ isOpen: false, userId: 0, userName: '', action: null });
        fetchUsers(page, search, filters.role, filters.status, effectiveFakultasId, effectiveProdiId);
      }
    }
  };


  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
            <UserCheck className="text-indigo-600" /> Verifikasi Pengguna
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            {user?.role === 'ADMIN' ? 'Kelola persetujuan seluruh pengguna sistem.' : 'Kelola persetujuan untuk pengguna di area Anda.'}
          </p>
        </div>
        <Button variant="outline" onClick={resetFilters} className="rounded-xl border-slate-200 font-bold text-xs uppercase h-11">
          <FilterX size={14} className="mr-2" /> Reset Filter
        </Button>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="bg-gradient-to-br from-white to-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-4">
          <SlidersHorizontal size={16} /> Filter Antrean Verifikasi
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <Input
              placeholder="Cari Username, Email, NIM..."
              className="pl-11 h-11 rounded-xl bg-white border-slate-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all text-sm font-medium"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <Select
            value={effectiveFakultasId}
            onValueChange={(v) => { setFilters({ ...filters, fakultasId: v, prodiId: 'all' }); setPage(1); }}
            disabled={['ADMIN_FAKULTAS', 'ADMIN_PRODI'].includes(user?.role || '')}
          >
            <SelectTrigger className="h-11 w-full rounded-xl bg-white border-slate-200 font-medium text-slate-600 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
              <SelectValue placeholder="Fakultas" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Semua Fakultas</SelectItem>
              {masterFakultas.map(f => <SelectItem key={f.id_fakultas} value={String(f.id_fakultas)}>{f.nama}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select
            value={effectiveProdiId}
            onValueChange={(v) => { setFilters({ ...filters, prodiId: v }); setPage(1); }}
            disabled={user?.role === 'ADMIN_PRODI'}
          >
            <SelectTrigger className="h-11 w-full rounded-xl bg-white border-slate-200 font-medium text-slate-600 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
              <SelectValue placeholder="Program Studi" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Semua Program Studi</SelectItem>
              {masterProdi
                .filter(p => effectiveFakultasId === 'all' || String(p.fakultas_id) === effectiveFakultasId)
                .map(p => <SelectItem key={p.id_prodi} value={String(p.id_prodi)}>{p.nama}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="border rounded-2xl bg-white overflow-hidden shadow-sm border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-b border-slate-200">
              <TableHead className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identitas Akun</TableHead>
              <TableHead className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Afiliasi Akademik</TableHead>
              <TableHead className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Waktu Daftar</TableHead>
              <TableHead className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status & Role</TableHead>
              <TableHead className="h-12 px-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-24">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin mx-auto text-indigo-600 w-8 h-8" />
                    <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Memuat antrean...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((u) => (
                <TableRow key={u.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                  <TableCell className="px-6 py-5 align-middle">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-sm uppercase">{u.profile?.nama_lengkap || u.username}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">NIM/NIDN: {u.nim || '-'}</span>
                      <div className="flex items-center gap-1.5 mt-2 text-slate-500 text-xs font-medium">
                        <Mail size={12} className="text-slate-300" /> {u.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 align-middle">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase">
                        <Building size={12} className="text-indigo-400" />
                        {['USER', 'ADMIN_PRODI'].includes(u.role) ? (u.profile?.prodi?.nama || 'Belum Diatur') : '-'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {u.role === 'ADMIN' ? 'Sistem Administrator' : (u.profile?.fakultas?.nama || '-')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 align-middle text-xs text-slate-600 font-bold">
                    {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="px-6 py-5 align-middle">
                    <div className="flex flex-col gap-2 items-start">
                      {u.status === 'PENDING' && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                          <Clock className="w-3 h-3 mr-1.5" /> Tertunda
                        </Badge>
                      )}
                      {u.status === 'ACTIVE' && (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                          <CheckCircle className="w-3 h-3 mr-1.5" /> Disetujui
                        </Badge>
                      )}
                      {u.status === 'REJECTED' && (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                          <XCircle className="w-3 h-3 mr-1.5" /> Ditolak
                        </Badge>
                      )}
                      <span className="text-[9px] font-black text-slate-400 tracking-widest border border-slate-200 px-2 rounded-md">{u.role}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5 align-middle text-right">
                    {processingId === u.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600 inline-block" />
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-xl p-2 min-w-40">
                          {u.status !== 'ACTIVE' && (
                            <DropdownMenuItem onClick={() => openConfirmModal(u.id, u.profile?.nama_lengkap || u.username, 'ACTIVE')} className="cursor-pointer font-bold text-xs py-2.5 text-emerald-600 focus:text-emerald-700">
                              <CheckCircle2 className="w-4 h-4 mr-3" /> Setujui Akses
                            </DropdownMenuItem>
                          )}
                          {u.status !== 'REJECTED' && (
                            <DropdownMenuItem onClick={() => openConfirmModal(u.id, u.profile?.nama_lengkap || u.username, 'REJECTED')} className="cursor-pointer font-bold text-xs py-2.5 text-red-600 focus:text-red-700">
                              <XCircle className="w-4 h-4 mr-3" /> Tolak Akses
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 bg-slate-50 rounded-full">
                      <UserCheck className="w-10 h-10 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tidak ada antrean ditemukan.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="p-5 bg-white border-t flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Total {total} Antrean • Hal {page}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl h-9 w-9 p-0 border-slate-200" disabled={page === 1 || isLoading} onClick={() => setPage(p => p - 1)}><ChevronLeft size={16} /></Button>
            <Button variant="outline" size="sm" className="rounded-xl h-9 w-9 p-0 border-slate-200" disabled={page * 10 >= total || isLoading} onClick={() => setPage(p => p + 1)}><ChevronRight size={16} /></Button>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      <Dialog open={modal.isOpen} onOpenChange={(isOpen) => !isOpen && setModal({ isOpen: false, userId: 0, userName: "", action: null })}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-8 border-none shadow-2xl">
          <DialogHeader>
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-4 ${modal.action === 'ACTIVE' ? 'bg-emerald-50' : 'bg-red-50'}`}>
              {modal.action === 'ACTIVE' ? <CheckCircle2 className="h-8 w-8 text-emerald-500" /> : <AlertTriangle className="h-8 w-8 text-red-500" />}
            </div>
            <DialogTitle className="text-center text-xl font-black uppercase tracking-tight text-slate-800">
              Konfirmasi {modal.action === 'ACTIVE' ? 'Persetujuan' : 'Penolakan'}
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-sm font-medium text-slate-500">
              Apakah Anda yakin ingin <strong className={modal.action === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}>{modal.action === 'ACTIVE' ? 'menyetujui' : 'menolak'}</strong> pengguna bernama <strong className="text-slate-900 uppercase">{modal.userName}</strong>?
              {modal.action === 'REJECTED' && <span className="block mt-2 text-xs text-red-400">Pengguna ini tidak akan bisa mengakses sistem.</span>}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 pt-6 sm:justify-center">
            <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setModal({ isOpen: false, userId: 0, userName: "", action: null })}>
              Batal
            </Button>
            <Button type="button" className={`flex-1 h-12 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg ${modal.action === "ACTIVE" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100" : "bg-red-500 hover:bg-red-600 shadow-red-100"}`} onClick={onConfirmAction}>
              Ya, Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}