/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useAlumniUsers } from '@/hooks/useAlumniUsers';
import { useAuth } from '@/hooks/useAuth';
import {
    Search, GraduationCap, Mail, Phone,
    Linkedin, Instagram, UserPlus, UserMinus, Loader2, Users2, FilterX,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';

export default function AlumniDirectoryPage() {
    const { user } = useAuth();
    const {
        alumniList, isLoading, meta,
        fetchAlumni, toggleFollow,
        uniqueAngkatan, uniqueTahunLulus, masterFakultas, masterProdi,
        fetchMasterFilters
    } = useAlumniUsers();

    // Filter States
    const [search, setSearch] = useState('');
    const [angkatan, setAngkatan] = useState('all');
    const [tahunLulus, setTahunLulus] = useState('all');
    const [fakultasId, setFakultasId] = useState('all');
    const [prodiId, setProdiId] = useState('all');
    const [page, setPage] = useState(1);

    const [followingState, setFollowingState] = useState<Record<number, boolean>>({});

    // Load filter reference data on mount
    useEffect(() => {
        fetchMasterFilters();
    }, []);

    // Debounced fetch when any filter changes
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchAlumni({
                page,
                search,
                angkatan: angkatan === 'all' ? undefined : angkatan,
                tahunLulus: tahunLulus === 'all' ? undefined : tahunLulus,
                fakultasId: fakultasId === 'all' ? undefined : fakultasId,
                prodiId: prodiId === 'all' ? undefined : prodiId
            });
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [search, angkatan, tahunLulus, fakultasId, prodiId, page]);

    // Map initial following states
    useEffect(() => {
        if (alumniList && alumniList.length > 0) {
            const initialState: Record<number, boolean> = {};
            alumniList.forEach((item) => {
                initialState[item.id_pengguna] = item.isFollowing || false;
            });
            setFollowingState(initialState);
        }
    }, [alumniList]);

    const handleFollow = async (id: number) => {
        const isFollowing = await toggleFollow(id);
        if (isFollowing !== null) {
            setFollowingState(prev => ({ ...prev, [id]: isFollowing }));
        }
    };

    const resetFilters = () => {
        setSearch('');
        setAngkatan('all');
        setTahunLulus('all');
        setFakultasId('all');
        setProdiId('all');
        setPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* --- HEADER & SEARCH SECTION --- */}
            <div className="relative overflow-hidden bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                                <Users2 size={14} className="text-indigo-600" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Alumni Network</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                Direktori Alumni
                            </h1>
                            <p className="text-slate-500 text-sm font-medium">Temukan dan jalin kembali koneksi dengan rekan sejawat.</p>
                        </div>

                        <div className="flex gap-3">
                            <div className="relative flex-1 lg:w-96 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <Input
                                    placeholder="Cari Nama atau NIM..."
                                    className="pl-11 rounded-2xl bg-slate-50/50 border-slate-100 h-12 focus-visible:ring-indigo-500/20 focus-visible:bg-white transition-all font-bold"
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                />
                            </div>
                            {(search || angkatan !== 'all' || tahunLulus !== 'all' || fakultasId !== 'all' || prodiId !== 'all') && (
                                <Button variant="ghost" onClick={resetFilters} className="h-12 px-4 rounded-2xl font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                    <FilterX size={18} className="mr-2" /> Reset
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* --- FILTER BAR --- */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100/60">
                        <Select value={fakultasId} onValueChange={(v) => { setFakultasId(v); setProdiId('all'); setPage(1); }}>
                            <SelectTrigger className="rounded-2xl bg-slate-50/50 border-slate-100 h-12 font-bold text-slate-600">
                                <SelectValue placeholder="Semua Fakultas" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                <SelectItem value="all" className="font-bold">Semua Fakultas</SelectItem>
                                {masterFakultas.map(f => (
                                    <SelectItem key={f.id_fakultas} value={String(f.id_fakultas)}>{f.nama}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={prodiId} onValueChange={(v) => { setProdiId(v); setPage(1); }}>
                            <SelectTrigger className="rounded-2xl bg-slate-50/50 border-slate-100 h-12 font-bold text-slate-600">
                                <SelectValue placeholder="Semua Prodi" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                <SelectItem value="all" className="font-bold">Semua Program Studi</SelectItem>
                                {masterProdi
                                    .filter(p => fakultasId === 'all' || String(p.fakultas_id) === fakultasId)
                                    .map(p => <SelectItem key={p.id_prodi} value={String(p.id_prodi)}>{p.nama}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select value={angkatan} onValueChange={(v) => { setAngkatan(v); setPage(1); }}>
                            <SelectTrigger className="rounded-2xl bg-slate-50/50 border-slate-100 h-12 font-bold text-slate-600">
                                <SelectValue placeholder="Angkatan" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                <SelectItem value="all" className="font-bold">Semua Angkatan</SelectItem>
                                {uniqueAngkatan.map(year => (
                                    <SelectItem key={year} value={String(year)}>Angkatan {year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={tahunLulus} onValueChange={(v) => { setTahunLulus(v); setPage(1); }}>
                            <SelectTrigger className="rounded-2xl bg-slate-50/50 border-slate-100 h-12 font-bold text-slate-600">
                                <SelectValue placeholder="Thn Lulus" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-slate-100">
                                <SelectItem value="all" className="font-bold">Semua Lulusan</SelectItem>
                                {uniqueTahunLulus.map(year => (
                                    <SelectItem key={year} value={String(year)}>Lulusan {year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50" />
            </div>

            {/* --- ALUMNI GRID --- */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                    <div className="relative">
                        <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
                        <div className="absolute inset-0 blur-xl bg-indigo-400/20 animate-pulse rounded-full" />
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Menyinkronkan Data...</p>
                </div>
            ) : alumniList.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Alumni tidak ditemukan</h3>
                    <p className="text-slate-500 text-sm">Coba sesuaikan pencarian atau filter Anda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {alumniList.map((alumni) => (
                        <Card key={alumni.id_pengguna} className="group rounded-[2rem] border-slate-100 shadow-sm hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500 overflow-hidden bg-white border-none ring-1 ring-slate-100 flex flex-col h-full">
                            <CardContent className="p-0 flex flex-col flex-1">
                                {/* Header Card / Background Gradient */}
                                <div className="h-20 bg-linear-to-br from-indigo-500/10 via-slate-50 to-white transition-all duration-500 group-hover:from-indigo-500/20" />

                                <div className="px-5 pb-6 flex flex-col flex-1">
                                    <div className="relative -mt-10 mb-3">
                                        <Avatar className="h-20 w-20 border-[4px] border-white shadow-xl ring-1 ring-slate-100 group-hover:scale-105 transition-transform duration-500">
                                            <AvatarImage src={alumni.foto} className="object-cover" />
                                            <AvatarFallback className="bg-linear-to-br from-indigo-600 to-violet-700 text-white font-black text-xl">
                                                {alumni.nama_lengkap?.[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <div className="space-y-1 mb-4 flex-1">
                                        <h3 className="text-base font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2" title={alumni.nama_lengkap}>
                                            {alumni.nama_lengkap}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                            <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-none text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm">
                                                {alumni.angkatan || 'N/A'} — {alumni.tahun_lulus || 'Present'}
                                            </Badge>
                                            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 truncate" title={alumni.prodi?.nama}>
                                                <GraduationCap size={12} className="text-slate-300 shrink-0" />
                                                {alumni.prodi?.nama || 'Prodi belum diatur'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 mb-6">
                                        <div className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-xl group-hover:bg-indigo-50/50 transition-colors duration-500 border border-transparent group-hover:border-indigo-100/50">
                                            <div className="p-1.5 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-indigo-600">
                                                <Mail size={14} />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-600 truncate">{alumni.email || 'Private'}</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-xl group-hover:bg-rose-50/50 transition-colors duration-500 border border-transparent group-hover:border-rose-100/50">
                                            <div className="p-1.5 bg-white rounded-lg shadow-sm text-slate-400 group-hover:text-rose-600">
                                                <Phone size={14} />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-600 truncate">{alumni.hp || 'Private'}</span>
                                        </div>
                                    </div>

                                    {/* Footer: Social Media & Follow */}
                                    <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                                        <div className="flex gap-1 shrink-0">
                                            {alumni.sosial_media?.linkedin ? (
                                                <a href={`https://linkedin.com/in/${alumni.sosial_media.linkedin}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90">
                                                    <Linkedin size={18} strokeWidth={2.5} />
                                                </a>
                                            ) : (
                                                <div className="p-2 text-slate-200"><Linkedin size={18} /></div>
                                            )}
                                            {alumni.sosial_media?.instagram ? (
                                                <a href={`https://instagram.com/${alumni.sosial_media.instagram}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90">
                                                    <Instagram size={18} strokeWidth={2.5} />
                                                </a>
                                            ) : (
                                                <div className="p-2 text-slate-200"><Instagram size={18} /></div>
                                            )}
                                        </div>

                                        {alumni.id_pengguna !== user?.id && (
                                            <Button
                                                size="sm"
                                                variant={followingState[alumni.id_pengguna] ? "outline" : "default"}
                                                className={`flex-1 rounded-xl h-9 text-xs font-black transition-all duration-300 ${followingState[alumni.id_pengguna]
                                                    ? 'border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200/50 active:scale-95'
                                                    }`}
                                                onClick={() => handleFollow(alumni.id_pengguna)}
                                            >
                                                {followingState[alumni.id_pengguna] ? (
                                                    <><UserMinus size={14} className="mr-1.5" /> Unfollow</>
                                                ) : (
                                                    <><UserPlus size={14} className="mr-1.5" /> Follow</>
                                                )}
                                            </Button>
                                        )}

                                        {alumni.id_pengguna === user?.id && (
                                            <div className="flex-1 flex justify-center items-center h-9 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Profil Anda</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* --- PAGINATION SECTION --- */}
            {alumniList.length > 0 && meta.totalPages > 1 && (
                <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl shadow-sm mt-8">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Menampilkan {alumniList.length} dari {meta.total} Alumni
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-xl border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                            disabled={page === 1 || isLoading}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft size={18} />
                        </Button>
                        <div className="px-4 h-10 flex items-center justify-center font-black text-sm bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                            Hal {page} / {meta.totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-xl border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                            disabled={page === meta.totalPages || isLoading}
                            onClick={() => setPage(p => p + 1)}
                        >
                            <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}