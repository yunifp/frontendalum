/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Eye, Loader2, CheckCircle2, XCircle, AlertTriangle, ChevronLeft, ChevronRight, Users, FilterX, SlidersHorizontal, Mail, Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useAlumni } from '@/hooks/useAlumni';
import { SafeImage } from '@/components/ui/SafeImage';
import api from '@/lib/axios';

interface ConfirmModalState {
  isOpen: boolean;
  userId: number;
  userName: string;
  action: 'ACTIVE' | 'REJECTED' | 'DEACTIVATED' | null;
}

interface FilterState {
  tahunLulus: string | undefined;
  prodiId: string;
  fakultasId: string;
  angkatan: string;
  jenjang: string;
  agama: string;
  gender: string;
  provinsi: string;
  kabupaten: string;
}

export default function AlumniManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { alumniList, isLoading, meta, fetchAlumni, handleUpdateStatus } = useAlumni(user);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    prodiId: 'all',
    fakultasId: 'all',
    angkatan: 'all',
    tahunLulus: 'all',
    jenjang: 'all',
    agama: 'all',
    gender: 'all',
    provinsi: 'all',
    kabupaten: 'all'
  });

  const [masterData, setMasterData] = useState<{
    provinsi: any[];
    kabupaten: any[];
    uniqueAngkatan: number[];
    uniqueTahunLulus: number[];
    prodi: any[];
    fakultas: any[];
    adminFakultasId: number | null;
  }>({
    provinsi: [],
    kabupaten: [],
    uniqueAngkatan: [],
    uniqueTahunLulus: [],
    prodi: [],
    fakultas: [],
    adminFakultasId: null
  });

  const [modal, setModal] = useState<ConfirmModalState>({
    isOpen: false,
    userId: 0,
    userName: '',
    action: null
  });

  const openConfirmModal = (id: number, name: string, action: 'ACTIVE' | 'REJECTED' | 'DEACTIVATED') => {
    setModal({ isOpen: true, userId: id, userName: name, action: action });
  };

  const onConfirmAction = async () => {
    if (modal.action && modal.userId) {
      setProcessingId(modal.userId);
      const success = await handleUpdateStatus(modal.userId, modal.action);
      if (success) {
        setModal({ isOpen: false, userId: 0, userName: '', action: null });
      }
      setProcessingId(null);
    }
  };

  const handleViewDetail = (userId: number) => {
    navigate(`/admin/alumni/${userId}`);
  };

  const loadMasterData = async () => {
    try {
      let admFakId = null;
      if (user?.role === 'ADMIN_FAKULTAS') {
        const adminProfileRes = await api.post('/master/profile', { action: 'GET_BY_ID', id: user.id });
        admFakId = adminProfileRes.data?.data?.prodi?.fakultas_id || null;
      }

      const [resProv, resAng, resTahunLulus, resFak, resProdi] = await Promise.all([
        api.post('/master/profile', { action: 'GET_PROVINSI' }),
        api.post('/master/profile', { action: 'GET_UNIQUE_ANGKATAN' }),
        api.post('/master/profile', { action: 'GET_UNIQUE_TAHUN_LULUS' }),
        api.post('/master/fakultas-prodi/fakultas', { action: 'GET_ALL' }).catch(() => ({ data: { data: [] } })),
        api.post('/master/fakultas-prodi/prodi', { action: 'GET_ALL' }).catch(() => ({ data: { data: [] } }))
      ]);
      setMasterData(prev => ({
        ...prev,
        provinsi: resProv.data.data || [],
        uniqueAngkatan: resAng.data.data || [],
        uniqueTahunLulus: resTahunLulus.data.data || [],
        fakultas: resFak.data.data || [],
        prodi: resProdi.data.data || [],
        adminFakultasId: admFakId
      }));
    } catch (e) {
      console.error("Load master data failed", e);
    }
  };

  useEffect(() => {
    if (filters.provinsi !== 'all') {
      api.post('/master/profile', { action: 'GET_KABUPATEN', data: { kode_provinsi: filters.provinsi } })
        .then(res => setMasterData(prev => ({ ...prev, kabupaten: res.data.data || [] })));
    } else {
      setMasterData(prev => ({ ...prev, kabupaten: [] }));
    }
  }, [filters.provinsi]);

  useEffect(() => {
    loadMasterData();
  }, [user]);

  const loadAlumni = useCallback(() => {
    const activeFilters: any = {};
    if (filters.fakultasId !== 'all') activeFilters.fakultasId = filters.fakultasId;
    if (filters.prodiId !== 'all') activeFilters.prodiId = filters.prodiId;
    if (filters.angkatan !== 'all') activeFilters.angkatan = filters.angkatan;
    if (filters.tahunLulus !== 'all') activeFilters.tahunLulus = filters.tahunLulus;
    if (filters.jenjang !== 'all') activeFilters.jenjang = filters.jenjang;
    if (filters.agama !== 'all') activeFilters.agama = filters.agama;
    if (filters.gender !== 'all') activeFilters.gender = filters.gender;
    if (filters.provinsi !== 'all') activeFilters.provinsi = filters.provinsi;
    if (filters.kabupaten !== 'all') activeFilters.kabupaten = filters.kabupaten;

    fetchAlumni({ page: currentPage, search: searchTerm, ...activeFilters });
  }, [currentPage, searchTerm, filters, fetchAlumni]);

  useEffect(() => {
    const timer = setTimeout(loadAlumni, 500);
    return () => clearTimeout(timer);
  }, [loadAlumni]);

  if (user?.role !== 'ADMIN' && user?.role !== 'ADMIN_FAKULTAS') return <Navigate to="/" replace />;

  const resetFilters = () => {
    setFilters({
      prodiId: 'all', fakultasId: 'all', angkatan: 'all', tahunLulus: 'all', jenjang: 'all',
      agama: 'all', gender: 'all', provinsi: 'all', kabupaten: 'all'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 p-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
            <Users className="text-indigo-600" /> Database Alumni
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
            {user?.role === 'ADMIN_FAKULTAS' ? 'Menampilkan Alumni dari Fakultas Anda' : 'Master Management System'}
          </p>
        </div>
        <Button variant="outline" onClick={resetFilters} className="rounded-xl border-slate-200 font-bold text-xs uppercase h-11">
          <FilterX size={14} className="mr-2" /> Reset Filter
        </Button>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
          <SlidersHorizontal size={16} /> Filter Pencarian
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
            <Input
              placeholder="Cari Nama, NIM..."
              className="pl-11 h-12 rounded-2xl bg-slate-50/50 border-slate-100 focus:bg-white transition-all text-sm font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {user?.role !== 'ADMIN_FAKULTAS' && (
            <Select value={filters.fakultasId} onValueChange={(v) => setFilters({ ...filters, fakultasId: v, prodiId: 'all' })}>
              <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
                <SelectValue placeholder="Pilih Fakultas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Fakultas</SelectItem>
                {masterData.fakultas.map((f) => (
                  <SelectItem key={f.id_fakultas} value={String(f.id_fakultas)}>{f.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={filters.prodiId} onValueChange={(v) => setFilters({ ...filters, prodiId: v })}>
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
              <SelectValue placeholder="Pilih Prodi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Program Studi</SelectItem>
              {masterData.prodi
                .filter(p => {
                  if (user?.role === 'ADMIN_FAKULTAS') return String(p.fakultas_id) === String(masterData.adminFakultasId);
                  return filters.fakultasId === 'all' || String(p.fakultas_id) === filters.fakultasId;
                })
                .map((p) => (
                  <SelectItem key={p.id_prodi} value={String(p.id_prodi)}>{p.nama}</SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select value={filters.angkatan} onValueChange={(v) => setFilters({ ...filters, angkatan: v })}>
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
              <SelectValue placeholder="Angkatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun Masuk</SelectItem>
              {masterData.uniqueAngkatan.map((year) => (
                <SelectItem key={year} value={String(year)}>Tahun {year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.tahunLulus} onValueChange={(v) => setFilters({ ...filters, tahunLulus: v })}>
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
              <SelectValue placeholder="Tahun Lulus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun Lulus</SelectItem>
              {masterData.uniqueTahunLulus.map((year) => (
                <SelectItem key={year} value={String(year)}>Tahun {year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.jenjang} onValueChange={(v) => setFilters({ ...filters, jenjang: v })}>
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
              <SelectValue placeholder="Jenjang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenjang</SelectItem>
              {['D3', 'D4', 'S1', 'S2', 'S3'].map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.agama} onValueChange={(v) => setFilters({ ...filters, agama: v })}>
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
              <SelectValue placeholder="Agama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Agama</SelectItem>
              {['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDHA', 'KHONGHUCU'].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.gender} onValueChange={(v) => setFilters({ ...filters, gender: v })}>
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Gender</SelectItem>
              <SelectItem value="L">Laki-Laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.provinsi} onValueChange={(v) => setFilters({ ...filters, provinsi: v, kabupaten: 'all' })}>
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
              <SelectValue placeholder="Provinsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Seluruh Indonesia</SelectItem>
              {masterData.provinsi.map((p) => (
                <SelectItem key={p.kode_provinsi} value={p.kode_provinsi}>{p.nama_provinsi}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.kabupaten} onValueChange={(v) => setFilters({ ...filters, kabupaten: v })} disabled={filters.provinsi === 'all'}>
            <SelectTrigger className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold text-slate-600">
              <SelectValue placeholder="Kabupaten" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota/Kab</SelectItem>
              {masterData.kabupaten.map((k) => (
                <SelectItem key={k.kode_wilayah} value={k.kode_wilayah}>{k.nama_wilayah}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-[2rem] bg-white overflow-hidden shadow-sm border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-slate-200">
              <TableHead className="h-12 px-6 text-center font-black text-[10px] uppercase tracking-widest text-slate-400 w-16">No</TableHead>
              <TableHead className="h-12 px-4 text-left font-black text-[10px] uppercase tracking-widest text-slate-400">Alumni & Identity</TableHead>
              <TableHead className="h-12 px-4 text-left font-black text-[10px] uppercase tracking-widest text-slate-400">Kontak</TableHead>
              <TableHead className="h-12 px-4 text-left font-black text-[10px] uppercase tracking-widest text-slate-400">Tgl Bergabung</TableHead>
              <TableHead className="h-12 px-4 text-left font-black text-[10px] uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="h-12 px-6 text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-24">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : alumniList.length > 0 ? (
              alumniList.map((u, index) => (
                <TableRow key={u.id_pengguna || index} className="group hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0">
                  <TableCell className="px-6 py-4 text-center text-xs font-mono font-bold text-slate-400">
                    {((meta.page - 1) * meta.limit) + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm shrink-0">
                        {u.foto ? (
                          <SafeImage src={u.foto} alt={u.nama_lengkap || u.username} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs font-black bg-indigo-50 text-indigo-500 uppercase">
                            {(u.nama_lengkap?.[0] || u.username?.[0] || '?')}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-black text-xs uppercase text-slate-900 truncate">
                          {u.nama_lengkap || u.username}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-tighter">NIM: {u.nim || 'N/A'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-[11px] text-slate-600 font-bold flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-slate-300" /> {u.email || '-'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 truncate">
                        <Phone className="w-3 h-3 text-slate-300" /> {u.hp || '-'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-xs text-slate-600 font-bold uppercase tracking-tighter">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <Badge className={`text-[9px] font-black uppercase px-2.5 py-0.5 shadow-none border ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      u.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {processingId === u.id_pengguna ? (
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600 ml-auto" />
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                          <DropdownMenuItem onClick={() => handleViewDetail(u.id_pengguna)} className="cursor-pointer font-bold text-xs py-2">
                            <Eye className="w-4 h-4 mr-2 text-indigo-600" /> Detail Profil
                          </DropdownMenuItem>

                          {u.status !== 'ACTIVE' && (
                            <DropdownMenuItem onClick={() => openConfirmModal(u.id_pengguna, u.nama_lengkap || u.username, 'ACTIVE')} className="cursor-pointer text-emerald-600 font-bold text-xs py-2">
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Aktifkan Akun
                            </DropdownMenuItem>
                          )}

                          {u.status !== 'REJECTED' && (
                            <DropdownMenuItem onClick={() => openConfirmModal(u.id_pengguna, u.nama_lengkap || u.username, 'REJECTED')} className="cursor-pointer text-rose-600 font-bold text-xs py-2">
                              <XCircle className="w-4 h-4 mr-2" /> Nonaktifkan
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
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                    <Users className="w-12 h-12 text-slate-300" />
                    <p className="text-xs font-black uppercase tracking-widest">Data alumni tidak ditemukan</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4 bg-slate-50/50 rounded-2xl border border-slate-100">
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">
          Total {meta.total} Data • Hal {meta.page} dari {meta.totalPages || 1}
        </div>
        <div className="flex items-center gap-2 mr-2">
          <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-slate-200" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={meta.page <= 1 || isLoading}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-slate-200" onClick={() => setCurrentPage(prev => prev + 1)} disabled={meta.page >= meta.totalPages || isLoading}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Dialog open={modal.isOpen} onOpenChange={(open) => !open && setModal({ ...modal, isOpen: false })}>
        <DialogContent className="sm:max-w-md rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className={`h-2 w-full ${modal.action === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <div className="p-8 flex flex-col items-center">
            <div className={`flex h-20 w-20 items-center justify-center rounded-[2rem] mb-6 shadow-2xl ${modal.action === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {modal.action === 'ACTIVE' ? <CheckCircle2 size={40} /> : <AlertTriangle size={40} />}
            </div>
            <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Konfirmasi</DialogTitle>
            <DialogDescription className="text-center pt-3 font-bold text-slate-500 text-sm leading-relaxed uppercase tracking-wider">
              Ubah status akun <span className="text-indigo-600">"{modal.userName}"</span> menjadi <span className={modal.action === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-600'}>{modal.action}</span>?
            </DialogDescription>
            <div className="grid grid-cols-2 gap-4 w-full mt-10">
              <Button variant="ghost" className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-12" onClick={() => setModal({ ...modal, isOpen: false })}>Batal</Button>
              <Button className={`rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 shadow-lg ${modal.action === 'ACTIVE' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'}`} onClick={onConfirmAction}>Ya, Lanjutkan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}