/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import {
    User as UserIcon, Briefcase, Save, Plus, Trash2, GraduationCap, MapPin,
    Calendar, Loader2, Building2, BookOpen, Hash,
    ShieldCheck, Globe, Lock, Edit3, X, Award, Mail, Phone,
    BriefcaseBusiness, Edit
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useKarir } from '@/hooks/useKarir';
import api from '@/lib/axios';
import { toast } from 'sonner';

const DataField = ({ label, value, icon: Icon, color = "text-slate-500" }: any) => (
    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
        <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 ${color}`}>
            <Icon size={16} />
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
            <p className="text-sm font-bold text-slate-800 truncate">{value || <span className="text-slate-300 italic font-normal text-xs text-nowrap">Belum diatur</span>}</p>
        </div>
    </div>
);

const EmptyDisplay = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50 w-full">
        <div className="p-4 bg-white rounded-full shadow-sm mb-3">
            <X size={20} className="text-slate-300" />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter leading-relaxed">{message}</p>
    </div>
);

const ProfilePage = () => {
    const { user } = useAuth();
    const { updateProfile, getProfileById, fetchProdis, prodis, isLoading: isUpdatingMaster } = useProfile();
    const { karirs, sektors, isFetching: isFetchingKarir, isProcessing: isProcessingKarir, fetchKarirs, fetchSektors, addKarir, updateKarir, deleteKarir } = useKarir(user?.id);

    const [isEditMode, setIsEditMode] = useState(false);
    const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [isKarirModalOpen, setIsKarirModalOpen] = useState(false);
    const [editingKarirId, setEditingKarirId] = useState<number | null>(null);

    const [accountForm, setAccountForm] = useState({ username: user?.username || '', hp: user?.hp || '', email: user?.email || '', newPassword: '' });
    const [masterForm, setMasterForm] = useState({
        nama_lengkap: '', tempat_lahir: '', tanggal_lahir: '', program_studi_id: '',
        angkatan: '', tahun_lulus: '', agama: '', jenjang: '', jenis_kelamin: '',
        judul_skripsi: '', gelar: '', sosial_media: { linkedin: '', instagram: '' }
    });

    useEffect(() => {
        if (user) {
            setAccountForm({
                username: user.username || '',
                hp: user.hp || '',
                email: user.email || '',
                newPassword: ''
            });
        }
    }, [user])

    const [newKarir, setNewKarir] = useState({
        posisi_pekerjaan: '', nama_perusahaan: '', lokasi_pekerjaan: '',
        tahun_masuk: '', tahun_keluar: '', saat_ini: false, sektor_pekerjaan_id: '', jenis_pekerjaan: 'On-site'
    });

    const loadAllData = useCallback(async () => {
        if (!user?.id) return;
        try {
            const masterData = await getProfileById(user.id);
            if (masterData) {
                setProfileData(masterData);
                setMasterForm({
                    ...masterData,
                    tanggal_lahir: masterData.tanggal_lahir ? masterData.tanggal_lahir.split('T')[0] : '',
                    sosial_media: masterData.sosial_media || { linkedin: '', instagram: '' },
                    angkatan: masterData.angkatan?.toString() || '',
                    tahun_lulus: masterData.tahun_lulus?.toString() || '',
                    program_studi_id: masterData.program_studi_id?.toString() || '',
                });
            }
            fetchKarirs();
            fetchSektors();
            fetchProdis();
        } catch (error) { console.error(error); }
    }, [user?.id]);

    useEffect(() => { loadAllData(); }, [loadAllData]);

    const handleMasterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return toast.error("User tidak ditemukan");
        const payload = {
            ...masterForm,
            angkatan: masterForm.angkatan ? parseInt(masterForm.angkatan as string) : null,
            tahun_lulus: masterForm.tahun_lulus ? parseInt(masterForm.tahun_lulus as string) : null,
            program_studi_id: masterForm.program_studi_id ? parseInt(masterForm.program_studi_id as string) : null,
        };
        const success = await updateProfile(user.id, payload);
        if (success) { setIsEditMode(false); loadAllData(); }
    };

    const handleAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return toast.error("User tidak ditemukan");
        setIsUpdatingAccount(true);
        try {
            const response = await api.post('/rbac/users', {
                action: 'UPDATE',
                id: user.id,
                data: {
                    username: accountForm.username,
                    hp: accountForm.hp,
                    ...(accountForm.newPassword && { password: accountForm.newPassword })
                }
            });

            if (response.data.success) {
                toast.success("Data keamanan diperbarui");

                // 2. Kosongkan password field
                setAccountForm(prev => ({ ...prev, newPassword: '' }));
                setIsEditMode(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal update keamanan");
        } finally {
            setIsUpdatingAccount(false);
        }
    };

    const onAddKarir = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKarir.posisi_pekerjaan || !newKarir.nama_perusahaan || !newKarir.sektor_pekerjaan_id) {
            return toast.error("Harap isi Posisi, Perusahaan, dan Sektor!");
        }

        let success = false;
        if (editingKarirId) {
            success = (await updateKarir(editingKarirId, newKarir)) ?? false;
        } else {
            success = (await addKarir(newKarir)) ?? false;
        }

        if (success) {
            setNewKarir({ posisi_pekerjaan: '', nama_perusahaan: '', lokasi_pekerjaan: '', tahun_masuk: '', tahun_keluar: '', saat_ini: false, sektor_pekerjaan_id: '', jenis_pekerjaan: 'On-site' });
            setEditingKarirId(null);
            setIsKarirModalOpen(false);
        }
    };

    const handleOpenEditKarir = (k: any) => {
        setEditingKarirId(k.id_karir);
        setNewKarir({
            posisi_pekerjaan: k.posisi_pekerjaan,
            nama_perusahaan: k.nama_perusahaan,
            lokasi_pekerjaan: k.lokasi_pekerjaan,
            tahun_masuk: k.tahun_masuk.toString(),
            tahun_keluar: k.tahun_keluar?.toString() || '',
            saat_ini: k.saat_ini,
            sektor_pekerjaan_id: k.sektor_pekerjaan_id,
            jenis_pekerjaan: k.jenis_pekerjaan
        });
        setIsKarirModalOpen(true);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-700">
            {/* --- TOP SUMMARY CARD --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="lg:col-span-3 border-none shadow-lg rounded-[1.5rem] bg-white overflow-hidden relative border-t-4 border-indigo-600">
                    <div className="absolute top-4 right-4 z-10">
                        <Button
                            onClick={() => setIsEditMode(!isEditMode)}
                            variant={isEditMode ? "destructive" : "secondary"}
                            size="sm"
                            className="rounded-full px-4 h-9 font-bold shadow-sm transition-all"
                        >
                            {isEditMode ? <><X size={14} className="mr-1.5" /> Batal</> : <><Edit3 size={14} className="mr-1.5" /> Edit Profil</>}
                        </Button>
                    </div>

                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-8">
                        <div className="relative shrink-0">
                            <div className="h-28 w-28 md:h-32 md:w-32 rounded-2xl bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-400 overflow-hidden ring-4 ring-slate-50 shadow-md">
                                {profileData?.foto ? <img src={profileData.foto} className="h-full w-full object-cover" alt="Profile" /> : <UserIcon size={48} strokeWidth={1.5} />}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg border-2 border-white"><Award size={14} /></div>
                        </div>

                        <div className="text-center md:text-left space-y-4 flex-1">
                            <div className="space-y-1">
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{masterForm.nama_lengkap || user?.username}</h1>
                                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-2 py-0 h-5 text-[9px] font-bold uppercase tracking-wider">Verified</Badge>
                                </div>
                                <p className="text-sm font-medium text-indigo-600/80 flex items-center justify-center md:justify-start gap-1.5"><GraduationCap size={16} /> {masterForm.gelar || "Alumni"}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                                <div className="space-y-0.5"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">NIM</p><p className="text-sm font-semibold text-slate-700">{user?.nim || '-'}</p></div>
                                <div className="space-y-0.5"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Program Studi</p><p className="text-sm font-semibold text-slate-700 truncate max-w-50">{profileData?.prodi?.nama || '-'}</p></div>
                                <div className="space-y-0.5"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Status Akun</p><div className="flex justify-center md:justify-start"><Badge variant="outline" className="h-5 px-2 text-[9px] font-bold border-emerald-200 text-emerald-600 uppercase">{user?.status}</Badge></div></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg rounded-[1.5rem] bg-indigo-950 text-white p-6 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                    <div className="space-y-5 relative z-10">
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Kontak</p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2.5 text-xs font-medium"><div className="p-1.5 bg-white/10 rounded-md"><Phone size={12} /></div>{user?.hp || 'N/A'}</div>
                                <div className="flex items-center gap-2.5 text-xs font-medium"><div className="p-1.5 bg-white/10 rounded-md"><Mail size={12} /></div><span className="truncate">{user?.email || 'N/A'}</span></div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-3">Ringkasan</p>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                                <div><p className="text-xl font-bold text-white leading-none">{karirs.length}</p><p className="text-[9px] font-medium text-indigo-300 uppercase mt-1">Total Karir</p></div>
                                <Briefcase size={20} className="text-indigo-400/50" />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* --- MAIN TABS --- */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-transparent p-0 h-auto gap-4 mb-6 flex-wrap justify-start">
                    {[{ id: 'profile', label: 'Profil & Akademik', icon: UserIcon }, { id: 'karir', label: 'Riwayat Karir', icon: Briefcase }, { id: 'keamanan', label: 'Akses Akun', icon: ShieldCheck }].map((t) => (
                        <TabsTrigger key={t.id} value={t.id} className="rounded-2xl px-6 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 font-bold border-2 border-transparent data-[state=active]:border-indigo-100 transition-all text-slate-500 bg-slate-100/50">
                            <t.icon size={16} className="mr-2" /> {t.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* --- PROFILE TAB --- */}
                <TabsContent value="profile">
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50 p-8"><CardTitle className="text-xl font-black text-slate-800">Data Personal & Akademik</CardTitle></CardHeader>
                        <CardContent className="p-8">
                            {!isEditMode ? (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <DataField label="Nama Lengkap" value={masterForm.nama_lengkap} icon={UserIcon} color="text-blue-500" />
                                        <DataField label="Jenis Kelamin" value={masterForm.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} icon={ShieldCheck} color="text-purple-500" />
                                        <DataField label="Agama" value={masterForm.agama} icon={Globe} color="text-emerald-500" />
                                        <DataField label="Tempat Lahir" value={masterForm.tempat_lahir} icon={MapPin} color="text-red-500" />
                                        <DataField label="Tanggal Lahir" value={masterForm.tanggal_lahir} icon={Calendar} color="text-orange-500" />
                                        <DataField label="Gelar" value={masterForm.gelar} icon={Award} color="text-amber-500" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/50">
                                        <DataField label="Program Studi" value={profileData?.prodi?.nama} icon={BookOpen} color="text-indigo-600" />
                                        <DataField label="Jenjang" value={masterForm.jenjang} icon={Award} color="text-slate-600" />
                                        <DataField label="Thn Masuk" value={masterForm.angkatan} icon={Hash} color="text-slate-600" />
                                        <DataField label="Thn Lulus" value={masterForm.tahun_lulus} icon={Calendar} color="text-slate-600" />
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Judul Skripsi</p><p className="text-sm font-bold text-slate-700 italic">"{masterForm.judul_skripsi || 'Belum diatur'}"</p></div>
                                </div>
                            ) : (
                                <form onSubmit={handleMasterSubmit} className="space-y-8 animate-in slide-in-from-top-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2"><Label className="text-xs font-black ml-1 uppercase text-slate-400">Nama Lengkap</Label><Input value={masterForm.nama_lengkap} onChange={(e) => setMasterForm({ ...masterForm, nama_lengkap: e.target.value })} className="h-12 rounded-xl bg-slate-50 border-none" /></div>
                                        <div className="space-y-2"><Label className="text-xs font-black ml-1 uppercase text-slate-400">Jenis Kelamin</Label>
                                            <Select value={masterForm.jenis_kelamin || ''} onValueChange={(v) => setMasterForm({ ...masterForm, jenis_kelamin: v })}><SelectTrigger className="h-12 rounded-xl bg-slate-50"><SelectValue placeholder="Pilih" /></SelectTrigger><SelectContent><SelectItem value="L">Laki-laki</SelectItem><SelectItem value="P">Perempuan</SelectItem></SelectContent></Select>
                                        </div>
                                        <div className="space-y-2"><Label className="text-xs font-black ml-1 uppercase text-slate-400">Agama</Label>
                                            <Select value={masterForm.agama || ''} onValueChange={(v) => setMasterForm({ ...masterForm, agama: v })}><SelectTrigger className="h-12 rounded-xl bg-slate-50"><SelectValue placeholder="Pilih Agama" /></SelectTrigger><SelectContent>{['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDHA', 'KHONGHUCU'].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select>
                                        </div>
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2"><Label className="text-xs font-black ml-1 uppercase text-slate-400">Prodi</Label>
                                            <Select value={masterForm.program_studi_id || ''} onValueChange={(v) => setMasterForm({ ...masterForm, program_studi_id: v })}><SelectTrigger className="h-11 rounded-xl bg-white border-slate-200"><SelectValue placeholder="Pilih Prodi" /></SelectTrigger><SelectContent>{prodis.map(p => <SelectItem key={p.id_prodi} value={p.id_prodi.toString()}>{p.nama}</SelectItem>)}</SelectContent></Select>
                                        </div>
                                        <div className="space-y-2"><Label className="text-xs font-black ml-1 uppercase text-slate-400">Jenjang</Label>
                                            <Select value={masterForm.jenjang || ''} onValueChange={(v) => setMasterForm({ ...masterForm, jenjang: v })}><SelectTrigger className="h-11 rounded-xl bg-white border-slate-200"><SelectValue /></SelectTrigger><SelectContent>{['D3', 'D4', 'S1', 'S2', 'S3'].map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent></Select>
                                        </div>
                                        <div className="space-y-2"><Label className="text-xs font-black ml-1 uppercase text-slate-400">Gelar</Label><Input value={masterForm.gelar} onChange={(e) => setMasterForm({ ...masterForm, gelar: e.target.value })} className="h-11 rounded-xl bg-white border-slate-200" /></div>
                                        <div className="space-y-2"><Label className="text-xs font-black ml-1 uppercase text-slate-400">Thn Masuk</Label><Input type="number" value={masterForm.angkatan} onChange={(e) => setMasterForm({ ...masterForm, angkatan: e.target.value })} className="h-11 rounded-xl bg-white border-slate-200" /></div>
                                        <div className="space-y-2"><Label className="text-xs font-black ml-1 uppercase text-slate-400">Thn Lulus</Label><Input type="number" value={masterForm.tahun_lulus} onChange={(e) => setMasterForm({ ...masterForm, tahun_lulus: e.target.value })} className="h-11 rounded-xl bg-white border-slate-200" /></div>
                                        <div className="space-y-2"><Label className="text-xs font-black ml-1 uppercase text-slate-400">Judul Skripsi</Label><Input value={masterForm.judul_skripsi} onChange={(e) => setMasterForm({ ...masterForm, judul_skripsi: e.target.value })} className="h-11 rounded-xl bg-white border-slate-200" /></div>
                                    </div>
                                    <Button type="submit" disabled={isUpdatingMaster} className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold uppercase tracking-widest shadow-xl">{isUpdatingMaster ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />} Simpan Profil</Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- KARIR TAB --- */}
                <TabsContent value="karir" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN: CAREER LISTING */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Riwayat Pengalaman</h3>
                                    <p className="text-xs text-slate-500 font-medium">Daftar perjalanan karir dan profesional Anda.</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold">
                                        {karirs.length} Posisi
                                    </Badge>
                                    {isEditMode && (
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setEditingKarirId(null);
                                                setNewKarir({ posisi_pekerjaan: '', nama_perusahaan: '', lokasi_pekerjaan: '', tahun_masuk: '', tahun_keluar: '', saat_ini: false, sektor_pekerjaan_id: '', jenis_pekerjaan: 'On-site' });
                                                setIsKarirModalOpen(true);
                                            }}
                                            className="rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg font-bold"
                                        >
                                            <Plus size={16} className="mr-1.5" /> Tambah
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {isFetchingKarir ? (
                                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                                    <Loader2 className="animate-spin text-indigo-500 h-10 w-10 mb-4" />
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat data...</p>
                                </div>
                            ) : karirs.length === 0 ? (
                                <EmptyDisplay message="Belum ada riwayat karir yang ditambahkan" />
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {karirs.map((k) => (
                                        <Card key={k.id_karir} className="border-none shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 rounded-[2rem] bg-white group transition-all duration-300 border border-transparent hover:border-indigo-100 overflow-hidden">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                                    <div className="flex gap-5 items-start sm:items-center">
                                                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner"><Building2 size={30} strokeWidth={1.5} /></div>
                                                        <div className="space-y-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h4 className="font-black text-slate-800 text-lg leading-tight">{k.posisi_pekerjaan}</h4>
                                                                <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-black uppercase tracking-tighter">{k.jenis_pekerjaan}</Badge>
                                                            </div>
                                                            <p className="text-indigo-600 font-bold text-sm flex items-center gap-1.5">{k.nama_perusahaan} <span className="h-1 w-1 bg-slate-300 rounded-full"></span> <span className="text-slate-500 font-medium text-xs">{k.sektor?.nama_sektor || 'Sektor Umum'}</span></p>
                                                            <div className="flex flex-wrap gap-4 pt-2">
                                                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400"><Calendar size={14} className="text-indigo-400" />{k.tahun_masuk} — {k.saat_ini ? <span className="text-emerald-600">Sekarang</span> : k.tahun_keluar}</div>
                                                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400"><MapPin size={14} className="text-indigo-400" />{k.lokasi_pekerjaan}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {isEditMode && (
                                                        <div className="flex gap-2 self-end sm:self-center">
                                                            <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => handleOpenEditKarir(k)}><Edit size={18} /></Button>
                                                            <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 text-slate-300 hover:text-red-500 hover:bg-red-50" onClick={() => deleteKarir(k.id_karir)}><Trash2 size={20} /></Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: INFO SIDEBAR */}
                        <div className="lg:col-span-4">
                            <div className="bg-indigo-50/50 border border-dashed border-indigo-200 rounded-[2.5rem] p-8 text-center sticky top-6">
                                <BriefcaseBusiness size={40} className="text-indigo-300 mx-auto mb-4" />
                                <h4 className="text-sm font-bold text-indigo-900 mb-2">{isEditMode ? 'Manajemen Karir' : 'Mode Preview'}</h4>
                                <p className="text-[11px] text-indigo-600/70 font-medium leading-relaxed">
                                    {isEditMode
                                        ? 'Gunakan tombol Tambah di atas untuk memperbarui riwayat pengalaman profesional Anda.'
                                        : 'Klik tombol Edit Profil di bagian atas untuk menambah atau menghapus riwayat karir Anda.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* --- KEAMANAN TAB --- */}
                <TabsContent value="keamanan">
                    <Card className="border-none shadow-xl rounded-[2.5rem] max-w-2xl mx-auto bg-white overflow-hidden">
                        <CardHeader className="text-center p-10 bg-slate-50/50 border-b border-slate-100">
                            <div className="h-20 w-20 bg-white text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-xl border border-red-50"><Lock size={32} strokeWidth={2.5} /></div>
                            <CardTitle className="text-2xl font-black text-slate-800">Keamanan & Akses</CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            {!isEditMode ? (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    {/* Gunakan data dari accountForm agar perubahannya terlihat langsung (Reaktif) */}
                                    <DataField label="Username Utama" value={accountForm.username} icon={UserIcon} />
                                    <DataField label="Verifikasi Email" value={accountForm.email} icon={Mail} color="text-indigo-500" />
                                    <DataField label="Nomor WhatsApp" value={accountForm.hp} icon={Phone} color="text-emerald-500" />
                                </div>
                            ) : (
                                <form onSubmit={handleAccountSubmit} className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">Username</Label>
                                        <Input
                                            value={accountForm.username}
                                            onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                                            className="h-12 rounded-xl bg-slate-50 border-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">WhatsApp</Label>
                                        <Input
                                            value={accountForm.hp}
                                            onChange={(e) => setAccountForm({ ...accountForm, hp: e.target.value })}
                                            className="h-12 rounded-xl bg-slate-50 border-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">Password Baru</Label>
                                        <Input
                                            type="password"
                                            placeholder="Biarkan kosong jika tidak ganti"
                                            value={accountForm.newPassword}
                                            onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                                            className="h-12 rounded-xl bg-slate-50 border-none"
                                        />
                                    </div>
                                    <Button type="submit" disabled={isUpdatingAccount} className="w-full bg-red-600 hover:bg-red-700 h-12 rounded-xl font-bold uppercase tracking-widest shadow-lg">
                                        {isUpdatingAccount ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={18} className="mr-2" /> Konfirmasi Perubahan Akun</>}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* MODAL TAMBAH/EDIT KARIR (COMPACT) */}
            <Dialog open={isKarirModalOpen} onOpenChange={setIsKarirModalOpen}>
                <DialogContent className="rounded-[2rem] border-none shadow-2xl overflow-hidden p-0 max-w-md">
                    <div className="bg-indigo-600 px-8 py-6 text-white relative">
                        <DialogHeader>
                            <DialogTitle className="font-black uppercase tracking-tight text-lg text-white">
                                {editingKarirId ? 'Edit Riwayat Karir' : 'Tambah Riwayat'}
                            </DialogTitle>
                            <DialogDescription className="text-indigo-100 text-[10px] font-medium opacity-80 uppercase tracking-widest">
                                {editingKarirId ? 'Perbarui detail pengalaman Anda' : 'Isi detail pengalaman profesional baru'}
                            </DialogDescription>
                        </DialogHeader>
                        <BriefcaseBusiness className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 w-12 h-12 -rotate-12" />
                    </div>

                    <form onSubmit={onAddKarir} className="px-8 py-6 space-y-4 bg-white">
                        <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Jabatan</Label>
                                <Input placeholder="Contoh: Senior Engineer" className="h-10 rounded-xl bg-slate-50 border-none text-sm focus-visible:ring-1" value={newKarir.posisi_pekerjaan} onChange={(e) => setNewKarir({ ...newKarir, posisi_pekerjaan: e.target.value })} required />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Instansi</Label>
                                    <Input placeholder="Perusahaan" className="h-10 rounded-xl bg-slate-50 border-none text-sm" value={newKarir.nama_perusahaan} onChange={(e) => setNewKarir({ ...newKarir, nama_perusahaan: e.target.value })} required />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Sektor</Label>
                                    <Select value={newKarir.sektor_pekerjaan_id} onValueChange={(v) => setNewKarir({ ...newKarir, sektor_pekerjaan_id: v })}>
                                        <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none text-sm"><SelectValue placeholder="Pilih" /></SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-xl">{sektors.map(s => <SelectItem key={s.id_sektor} value={s.id_sektor} className="text-xs">{s.nama_sektor}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Kota</Label>
                                    <Input placeholder="Lokasi" className="h-10 rounded-xl bg-slate-50 border-none text-sm" value={newKarir.lokasi_pekerjaan} onChange={(e) => setNewKarir({ ...newKarir, lokasi_pekerjaan: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipe</Label>
                                    <Select value={newKarir.jenis_pekerjaan} onValueChange={(v) => setNewKarir({ ...newKarir, jenis_pekerjaan: v })}>
                                        <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-xl">{['On-site', 'Remote', 'Hybrid', 'Freelance'].map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 items-end">
                                <div className="space-y-1">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tahun Masuk</Label>
                                    <Input type="number" className="h-10 rounded-xl bg-slate-50 border-none text-sm" value={newKarir.tahun_masuk} onChange={(e) => setNewKarir({ ...newKarir, tahun_masuk: e.target.value })} required />
                                </div>
                                {!newKarir.saat_ini ? (
                                    <div className="space-y-1 animate-in fade-in slide-in-from-left-1 duration-200">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tahun Keluar</Label>
                                        <Input type="number" className="h-10 rounded-xl bg-slate-50 border-none text-sm" value={newKarir.tahun_keluar} onChange={(e) => setNewKarir({ ...newKarir, tahun_keluar: e.target.value })} required />
                                    </div>
                                ) : (
                                    <div className="h-10 flex items-center px-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Aktif Sekarang</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mt-2 border border-slate-100/50">
                                <button
                                    type="button"
                                    onClick={() => setNewKarir({ ...newKarir, saat_ini: !newKarir.saat_ini })}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${newKarir.saat_ini ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newKarir.saat_ini ? 'translate-x-4' : 'translate-x-0.5'}`}
                                    />
                                </button>
                                <label className="text-[9px] font-black text-slate-600 uppercase cursor-pointer select-none" onClick={() => setNewKarir({ ...newKarir, saat_ini: !newKarir.saat_ini })}>Masih bekerja di sini</label>
                            </div>
                        </div>

                        <Button type="submit" disabled={isProcessingKarir} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                            {isProcessingKarir ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <><Save size={16} className="mr-2" /> {editingKarirId ? 'Update' : 'Simpan'}</>}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProfilePage;