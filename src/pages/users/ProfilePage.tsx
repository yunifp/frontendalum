/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    User as UserIcon, Briefcase, Save, Plus, Trash2, GraduationCap, MapPin,
    Calendar, Loader2, Building2, BookOpen, Hash,
    ShieldCheck, Globe, Lock, Edit3, X, Award, Mail, Phone,
    BriefcaseBusiness, Edit, Camera, School,
    CheckCircle
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
import { SafeImage } from '@/components/ui/SafeImage';
import { Textarea } from '@/components/ui/textarea';

const DataField = ({ label, value, icon: Icon, color = "text-slate-500" }: any) => (
    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
        <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 ${color}`}>
            <Icon size={16} />
        </div>
        <div className="overflow-hidden w-full">
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
    const {
        updateProfile, getProfileById,
        fetchFakultas, fakultas,
        fetchProdis, prodis,
        fetchProvinsis, provinsis, fetchKabupatens, kabupatens,
        isLoading: isUpdatingMaster, uploadFoto, deleteOldFoto
    } = useProfile();

    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const { karirs, sektors, isFetching: isFetchingKarir, isProcessing: isProcessingKarir, fetchKarirs, fetchSektors, addKarir, updateKarir, deleteKarir } = useKarir(user?.id);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
    const [profileData, setProfileData] = useState<any>(null);
    const [isKarirModalOpen, setIsKarirModalOpen] = useState(false);
    const [editingKarirId, setEditingKarirId] = useState<number | null>(null);

    const [accountForm, setAccountForm] = useState({ username: user?.username || '', hp: user?.hp || '', email: user?.email || '', newPassword: '' });
    const [masterForm, setMasterForm] = useState({
        nama_lengkap: '', tempat_lahir: '', tanggal_lahir: '', fakultas_id: '', program_studi_id: '',
        angkatan: '', tahun_lulus: '', agama: '', jenjang: '', jenis_kelamin: '',
        judul_skripsi: '', gelar: '', sosial_media: { linkedin: '', instagram: '' },
        provinsi_kode: '', kabupaten_kode: '', alamat: ''
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
    }, [user]);

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
                    provinsi_kode: masterData.provinsi_kode || '',
                    kabupaten_kode: masterData.kabupaten_kode || '',
                    alamat: masterData.alamat || '',
                    sosial_media: masterData.sosial_media || { linkedin: '', instagram: '' },
                    angkatan: masterData.angkatan?.toString() || '',
                    tahun_lulus: masterData.tahun_lulus?.toString() || '',
                    fakultas_id: masterData.fakultas_id?.toString() || (masterData.prodi?.fakultas_id?.toString() || ''),
                    program_studi_id: masterData.program_studi_id?.toString() || '',
                });
                if (masterData.provinsi_kode) {
                    fetchKabupatens(masterData.provinsi_kode);
                }
            }
            fetchKarirs();
            fetchSektors();
            fetchFakultas();
            fetchProdis();
            fetchProvinsis();
        } catch (error) { console.error(error); }
    }, [user?.id]);

    useEffect(() => { loadAllData(); }, [loadAllData]);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        // Validasi ukuran (misal 2MB)
        if (file.size > 2 * 1024 * 1024) return toast.error("Ukuran foto maksimal 2MB");

        setIsUploadingPhoto(true);
        try {
            const newPhotoUrl = await uploadFoto(file);
            if (newPhotoUrl) {
                if (profileData?.foto) await deleteOldFoto(profileData.foto);
                await updateProfile(user.id, { foto: newPhotoUrl });
                loadAllData();
                toast.success("Foto profil berhasil diperbarui");
            }
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleRemovePhoto = async () => {
        if (!user?.id || !profileData?.foto) return;
        if (!confirm("Hapus foto profil saat ini?")) return;

        setIsUploadingPhoto(true);
        try {
            await deleteOldFoto(profileData.foto);
            await updateProfile(user.id, { foto: null });
            loadAllData();
            toast.success("Foto profil dihapus");
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleMasterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return toast.error("User tidak ditemukan");
        const payload = {
            ...masterForm,
            angkatan: masterForm.angkatan ? parseInt(masterForm.angkatan as string) : null,
            tahun_lulus: masterForm.tahun_lulus ? parseInt(masterForm.tahun_lulus as string) : null,
            fakultas_id: masterForm.fakultas_id ? parseInt(masterForm.fakultas_id as string) : null,
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
                        <div className="relative group shrink-0">
                            {/* Input file disembunyikan */}
                            <input
                                type="file" hidden ref={photoInputRef} accept="image/*"
                                onChange={handlePhotoChange} disabled={!isEditMode}
                            />

                            <div className={`h-32 w-32 rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden ring-4 shadow-xl relative transition-all duration-500 
                                ${isEditMode ? 'ring-indigo-200 cursor-pointer group-hover:ring-indigo-400' : 'ring-white shadow-md'}`}
                            >
                                {isUploadingPhoto && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-indigo-600" />
                                    </div>
                                )}

                                {profileData?.foto ? (
                                    <SafeImage
                                        src={profileData.foto}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt="Profile"
                                    />
                                ) : (
                                    <div className="bg-slate-200 h-full w-full flex items-center justify-center">
                                        <UserIcon size={48} strokeWidth={1.5} className="text-slate-400" />
                                    </div>
                                )}

                                {isEditMode && (
                                    <button
                                        type="button" onClick={() => photoInputRef.current?.click()}
                                        className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 z-10"
                                    >
                                        <Camera size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-white/90">Ganti Foto</span>
                                    </button>
                                )}
                            </div>

                            {isEditMode && profileData?.foto && (
                                <button
                                    type="button" onClick={handleRemovePhoto} title="Hapus Foto"
                                    className="absolute -top-1 -left-1 bg-white text-rose-500 p-2.5 rounded-2xl shadow-xl border border-rose-100 hover:bg-rose-50 transition-all active:scale-90 z-30"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}

                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-2xl shadow-lg border-4 border-white z-30">
                                <Award size={18} />
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-4 flex-1 w-full">
                            <div className="space-y-1">
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{masterForm.nama_lengkap || user?.username}</h1>
                                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-2 py-0 h-5 text-[9px] font-bold uppercase tracking-wider">Verified</Badge>
                                </div>
                                <p className="text-sm font-medium text-indigo-600/80 flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                                    <GraduationCap size={16} /> {masterForm.gelar || "Alumni"}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                                <div className="space-y-0.5"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">NIM / NIDN</p><p className="text-sm font-semibold text-slate-700">{user?.nim || '-'}</p></div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Fakultas / Unit</p>
                                    <p className="text-sm font-semibold text-slate-700 truncate max-w-50" title={profileData?.fakultas?.nama || profileData?.prodi?.fakultas?.nama || '-'}>
                                        {profileData?.fakultas?.nama || profileData?.prodi?.fakultas?.nama || '-'}
                                    </p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Status Akun</p>
                                    <div className="flex justify-center md:justify-start"><Badge variant="outline" className="h-5 px-2 text-[9px] font-bold border-emerald-200 text-emerald-600 uppercase">{user?.status}</Badge></div>
                                </div>
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
                                <div className="flex items-center gap-2.5 text-xs font-medium w-full overflow-hidden">
                                    <div className="p-1.5 bg-white/10 rounded-md shrink-0"><Mail size={12} /></div>
                                    <span className="truncate">{user?.email || 'N/A'}</span>
                                </div>
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
                        <CardHeader className="border-b border-slate-50 py-4 px-8"><CardTitle className="text-xl font-black text-slate-800 flex items-center gap-2"><UserIcon className="text-indigo-500" /> Data Personal & Akademik</CardTitle></CardHeader>
                        <CardContent className="px-4 md:px-8 py-6">
                            {!isEditMode ? (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        <DataField label="Nama Lengkap" value={masterForm.nama_lengkap} icon={UserIcon} color="text-blue-500" />
                                        <DataField label="Jenis Kelamin" value={masterForm.jenis_kelamin === 'L' ? 'Laki-laki' : masterForm.jenis_kelamin === 'P' ? 'Perempuan' : ''} icon={ShieldCheck} color="text-purple-500" />
                                        <DataField label="Agama" value={masterForm.agama} icon={Globe} color="text-emerald-500" />
                                        <DataField label="Tempat Lahir" value={masterForm.tempat_lahir} icon={MapPin} color="text-red-500" />
                                        <DataField label="Tanggal Lahir" value={masterForm.tanggal_lahir} icon={Calendar} color="text-orange-500" />
                                        <DataField label="Gelar" value={masterForm.gelar} icon={Award} color="text-amber-500" />
                                    </div>

                                    {/* Info Akademik */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/50 relative overflow-hidden">
                                        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4"><School size={120} /></div>

                                        <DataField label="Fakultas" value={profileData?.fakultas?.nama || profileData?.prodi?.fakultas?.nama} icon={Building2} color="text-indigo-600" />
                                        <DataField label="Program Studi" value={profileData?.prodi?.nama} icon={BookOpen} color="text-indigo-500" />
                                        <DataField label="Jenjang" value={masterForm.jenjang} icon={Award} color="text-slate-600" />
                                        <DataField label="Tahun Masuk" value={masterForm.angkatan} icon={Hash} color="text-slate-600" />

                                        <div className="md:col-span-2 lg:col-span-4 pt-2">
                                            <DataField label="Tahun Lulus" value={masterForm.tahun_lulus} icon={Calendar} color="text-slate-600" />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5"><BookOpen size={12} /> Judul Skripsi / Tugas Akhir</p>
                                        <p className="text-sm font-bold text-slate-700 italic">"{masterForm.judul_skripsi || 'Belum diatur'}"</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-start gap-4">
                                            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-indigo-500 shrink-0">
                                                <MapPin size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Domisili</p>
                                                <p className="text-sm font-bold text-slate-700 leading-relaxed">
                                                    {masterForm.alamat ? `${masterForm.alamat}, ` : ''}
                                                    {profileData?.kabupaten_relasi?.nama_wilayah || ''}
                                                    {profileData?.provinsi_relasi?.nama_provinsi ? `, ${profileData.provinsi_relasi.nama_provinsi}` : (masterForm.alamat ? '' : 'Alamat belum diatur')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <a
                                            href={masterForm.sosial_media?.linkedin ? `https://linkedin.com/in/${masterForm.sosial_media.linkedin}` : "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`p-4 rounded-[1.5rem] border flex items-center gap-3 transition-all ${masterForm.sosial_media?.linkedin ? 'bg-blue-50/50 border-blue-100 hover:bg-blue-50' : 'bg-slate-50 border-slate-100 opacity-60 pointer-events-none'}`}
                                        >
                                            <div className="p-2 bg-white rounded-xl shadow-sm border border-blue-100 text-blue-600 shrink-0">
                                                <Globe size={16} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-0.5">LinkedIn</p>
                                                <p className="text-sm font-bold text-slate-700 truncate">
                                                    {masterForm.sosial_media?.linkedin || "Belum diatur"}
                                                </p>
                                            </div>
                                        </a>

                                        <a
                                            href={masterForm.sosial_media?.instagram ? `https://instagram.com/${masterForm.sosial_media.instagram}` : "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`p-4 rounded-[1.5rem] border flex items-center gap-3 transition-all ${masterForm.sosial_media?.instagram ? 'bg-pink-50/50 border-pink-100 hover:bg-pink-50' : 'bg-slate-50 border-slate-100 opacity-60 pointer-events-none'}`}
                                        >
                                            <div className="p-2 bg-white rounded-xl shadow-sm border border-pink-100 text-pink-600 shrink-0">
                                                <Edit3 size={16} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest mb-0.5">Instagram</p>
                                                <p className="text-sm font-bold text-slate-700 truncate">
                                                    {masterForm.sosial_media?.instagram ? `@${masterForm.sosial_media.instagram}` : "Belum diatur"}
                                                </p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleMasterSubmit} className="space-y-8 animate-in slide-in-from-top-4 duration-300">
                                    {/* --- INFORMASI DASAR --- */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                                            <UserIcon size={14} /> Data Pribadi
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-400">Nama Lengkap Sesuai Ijazah</Label>
                                                <Input
                                                    value={masterForm.nama_lengkap}
                                                    onChange={(e) => setMasterForm({ ...masterForm, nama_lengkap: e.target.value })}
                                                    className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-400">Jenis Kelamin</Label>
                                                <Select value={masterForm.jenis_kelamin || ''} onValueChange={(v) => setMasterForm({ ...masterForm, jenis_kelamin: v })}>
                                                    <SelectTrigger className="h-12 w-full rounded-xl bg-slate-50 border-none font-bold">
                                                        <SelectValue placeholder="Pilih" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="L">Laki-laki</SelectItem>
                                                        <SelectItem value="P">Perempuan</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-400">Agama</Label>
                                                <Select value={masterForm.agama || ''} onValueChange={(v) => setMasterForm({ ...masterForm, agama: v })}>
                                                    <SelectTrigger className="h-12 w-full rounded-xl bg-slate-50 border-none font-bold">
                                                        <SelectValue placeholder="Pilih Agama" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDHA', 'KHONGHUCU'].map(a =>
                                                            <SelectItem key={a} value={a}>{a}</SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-400">Provinsi Lahir</Label>
                                                <Select onValueChange={(v) => fetchKabupatens(v)}>
                                                    <SelectTrigger className="h-12 w-full rounded-xl bg-slate-50 border-none font-bold">
                                                        <SelectValue placeholder="Pilih Provinsi" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {provinsis.map(p => (
                                                            <SelectItem key={p.kode_provinsi} value={p.kode_provinsi}>{p.nama_provinsi}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-400">Kota/Kab Lahir</Label>
                                                <Select value={masterForm.tempat_lahir || ''} onValueChange={(v) => setMasterForm({ ...masterForm, tempat_lahir: v })}>
                                                    <SelectTrigger className="h-12 w-full rounded-xl bg-slate-50 border-none font-bold">
                                                        <SelectValue placeholder="Pilih Kota/Kab" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {kabupatens.map(k => (
                                                            <SelectItem key={k.kode_wilayah} value={k.nama_wilayah}>{k.nama_wilayah}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-400">Tanggal Lahir</Label>
                                                <Input
                                                    type="date"
                                                    value={masterForm.tanggal_lahir}
                                                    onChange={(e) => setMasterForm({ ...masterForm, tanggal_lahir: e.target.value })}
                                                    className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- DATA AKADEMIK --- */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                                            <School size={14} /> Afiliasi Akademik
                                        </h4>
                                        <div className="p-6 md:p-8 bg-indigo-50/40 rounded-[2rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border border-indigo-100/50">

                                            {/* DROPDOWN FAKULTAS */}
                                            <div className="space-y-2 lg:col-span-3">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Fakultas / Unit</Label>
                                                <Select
                                                    value={masterForm.fakultas_id || ''}
                                                    onValueChange={(v) => setMasterForm({ ...masterForm, fakultas_id: v, program_studi_id: '' })}
                                                >
                                                    <SelectTrigger className="h-12 w-full rounded-xl bg-white border-slate-200 font-bold shadow-sm">
                                                        <SelectValue placeholder="Pilih Fakultas" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {fakultas.map(f => <SelectItem key={f.id_fakultas} value={f.id_fakultas.toString()}>{f.nama}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* DROPDOWN PRODI BERGANTUNG PADA FAKULTAS */}
                                            <div className="space-y-2 lg:col-span-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Program Studi</Label>
                                                <Select
                                                    value={masterForm.program_studi_id || ''}
                                                    onValueChange={(v) => setMasterForm({ ...masterForm, program_studi_id: v })}
                                                    disabled={!masterForm.fakultas_id}
                                                >
                                                    <SelectTrigger className="h-12 w-full rounded-xl bg-white border-slate-200 font-bold shadow-sm">
                                                        <SelectValue placeholder="Pilih Program Studi" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {prodis
                                                            .filter(p => p.fakultas_id.toString() === masterForm.fakultas_id)
                                                            .map(p => <SelectItem key={p.id_prodi} value={p.id_prodi.toString()}>{p.nama}</SelectItem>)
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Jenjang</Label>
                                                <Select value={masterForm.jenjang || ''} onValueChange={(v) => setMasterForm({ ...masterForm, jenjang: v })}>
                                                    <SelectTrigger className="h-12 w-full rounded-xl bg-white border-slate-200 font-bold shadow-sm">
                                                        <SelectValue placeholder="Pilih Jenjang" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['D3', 'D4', 'S1', 'S2', 'S3'].map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Gelar (Contoh: S.Kom)</Label>
                                                <Input value={masterForm.gelar} onChange={(e) => setMasterForm({ ...masterForm, gelar: e.target.value })} className="h-12 rounded-xl bg-white border-slate-200 font-bold shadow-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Tahun Masuk (Angkatan)</Label>
                                                <Input type="number" value={masterForm.angkatan} onChange={(e) => setMasterForm({ ...masterForm, angkatan: e.target.value })} className="h-12 rounded-xl bg-white border-slate-200 font-bold shadow-sm" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Tahun Lulus</Label>
                                                <Input type="number" value={masterForm.tahun_lulus} onChange={(e) => setMasterForm({ ...masterForm, tahun_lulus: e.target.value })} className="h-12 rounded-xl bg-white border-slate-200 font-bold shadow-sm" />
                                            </div>

                                            <div className="space-y-2 lg:col-span-3">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Judul Skripsi / Tugas Akhir</Label>
                                                <Textarea
                                                    value={masterForm.judul_skripsi}
                                                    onChange={(e) => setMasterForm({ ...masterForm, judul_skripsi: e.target.value })}
                                                    className="min-h-20 rounded-xl bg-white border-slate-200 shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- SOSMED & ALAMAT --- */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase text-indigo-500 tracking-widest flex items-center gap-2 border-b border-slate-100 pb-2">
                                            <MapPin size={14} /> Kontak & Domisili
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 bg-slate-50/50 rounded-[2.5rem]">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Link LinkedIn</Label>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md group-focus-within:text-blue-600 transition-colors">in/</div>
                                                    <Input
                                                        value={masterForm.sosial_media?.linkedin || ''}
                                                        onChange={(e) => setMasterForm({ ...masterForm, sosial_media: { ...masterForm.sosial_media, linkedin: e.target.value } })}
                                                        className="h-12 rounded-xl bg-white border-slate-200 pl-14 shadow-xs focus-visible:ring-blue-500 font-bold"
                                                        placeholder="http://linkedin.com/in/username"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Link Instagram</Label>
                                                <div className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md group-focus-within:text-pink-600 transition-colors">@</div>
                                                    <Input
                                                        value={masterForm.sosial_media?.instagram || ''}
                                                        onChange={(e) => setMasterForm({ ...masterForm, sosial_media: { ...masterForm.sosial_media, instagram: e.target.value } })}
                                                        className="h-12 rounded-xl bg-white border-slate-200 pl-12 shadow-xs focus-visible:ring-pink-500 font-bold"
                                                        placeholder="http://instagram.com/username"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Provinsi Domisili Saat Ini</Label>
                                                <Select
                                                    value={masterForm.provinsi_kode || ''}
                                                    onValueChange={(v) => { setMasterForm({ ...masterForm, provinsi_kode: v, kabupaten_kode: '' }); fetchKabupatens(v); }}
                                                >
                                                    <SelectTrigger className="h-12 w-full rounded-xl bg-white border-slate-200 font-bold shadow-sm">
                                                        <SelectValue placeholder="Pilih Provinsi" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {provinsis.map(p => <SelectItem key={p.kode_provinsi} value={p.kode_provinsi}>{p.nama_provinsi}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Kabupaten/Kota Domisili</Label>
                                                <Select disabled={!masterForm.provinsi_kode} value={masterForm.kabupaten_kode || ''} onValueChange={(v) => setMasterForm({ ...masterForm, kabupaten_kode: v })}>
                                                    <SelectTrigger className="h-12 w-full rounded-xl bg-white border-slate-200 font-bold shadow-sm">
                                                        <SelectValue placeholder="Pilih Kabupaten" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {kabupatens.map(k => <SelectItem key={k.kode_wilayah} value={k.kode_wilayah}>{k.nama_wilayah}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="md:col-span-2 space-y-2">
                                                <Label className="text-[10px] font-black ml-1 uppercase text-slate-500">Alamat Lengkap</Label>
                                                <Textarea
                                                    value={masterForm.alamat}
                                                    onChange={(e) => setMasterForm({ ...masterForm, alamat: e.target.value })}
                                                    placeholder="Nama jalan, No Rumah, RT/RW"
                                                    className="min-h-24 rounded-xl bg-white border-slate-200 shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={isUpdatingMaster} className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]">
                                        {isUpdatingMaster ? <Loader2 className="animate-spin" /> : <Save className="mr-2 w-5 h-5" />} Simpan Profil & Akademik
                                    </Button>
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
                                                    <div className="flex gap-5 items-start sm:items-center w-full">
                                                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner"><Building2 size={30} strokeWidth={1.5} /></div>
                                                        <div className="space-y-1 w-full">
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
                                                        <div className="flex gap-2 self-end sm:self-center shrink-0">
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
                            <div className="bg-indigo-50/50 border border-dashed border-indigo-200 rounded-[2.5rem] p-8 text-center sticky top-24">
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
                                            className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">WhatsApp</Label>
                                        <Input
                                            value={accountForm.hp}
                                            onChange={(e) => setAccountForm({ ...accountForm, hp: e.target.value })}
                                            className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400">Password Baru</Label>
                                        <Input
                                            type="password"
                                            placeholder="Biarkan kosong jika tidak ganti"
                                            value={accountForm.newPassword}
                                            onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                                            className="h-12 rounded-xl bg-slate-50 border-none font-bold placeholder:font-normal"
                                        />
                                    </div>
                                    <Button type="submit" disabled={isUpdatingAccount} className="w-full bg-red-600 hover:bg-red-700 h-12 rounded-xl font-bold uppercase tracking-widest shadow-lg mt-4 transition-all active:scale-[0.98]">
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
                    <div className="bg-indigo-600 px-8 py-6 text-white relative overflow-hidden">
                        <DialogHeader>
                            <DialogTitle className="font-black uppercase tracking-tight text-lg text-white">
                                {editingKarirId ? 'Edit Riwayat Karir' : 'Tambah Riwayat'}
                            </DialogTitle>
                            <DialogDescription className="text-indigo-100 text-[10px] font-medium opacity-80 uppercase tracking-widest">
                                {editingKarirId ? 'Perbarui detail pengalaman Anda' : 'Isi detail pengalaman profesional baru'}
                            </DialogDescription>
                        </DialogHeader>
                        <BriefcaseBusiness className="absolute -right-4 top-1/2 -translate-y-1/2 text-white/10 w-24 h-24 -rotate-12" />
                    </div>

                    <form onSubmit={onAddKarir} className="px-8 py-6 space-y-4 bg-white">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Jabatan</Label>
                                <Input placeholder="Contoh: Senior Engineer" className="h-11 rounded-xl bg-slate-50 border-none text-sm font-bold" value={newKarir.posisi_pekerjaan} onChange={(e) => setNewKarir({ ...newKarir, posisi_pekerjaan: e.target.value })} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Instansi</Label>
                                    <Input placeholder="Perusahaan" className="h-11 rounded-xl bg-slate-50 border-none text-sm font-bold" value={newKarir.nama_perusahaan} onChange={(e) => setNewKarir({ ...newKarir, nama_perusahaan: e.target.value })} required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Sektor</Label>
                                    <Select value={newKarir.sektor_pekerjaan_id} onValueChange={(v) => setNewKarir({ ...newKarir, sektor_pekerjaan_id: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none text-sm font-bold"><SelectValue placeholder="Pilih" /></SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-xl">{sektors.map(s => <SelectItem key={s.id_sektor} value={s.id_sektor} className="text-xs">{s.nama_sektor}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Kota</Label>
                                    <Input placeholder="Lokasi" className="h-11 rounded-xl bg-slate-50 border-none text-sm font-bold" value={newKarir.lokasi_pekerjaan} onChange={(e) => setNewKarir({ ...newKarir, lokasi_pekerjaan: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipe Pekerjaan</Label>
                                    <Select value={newKarir.jenis_pekerjaan} onValueChange={(v) => setNewKarir({ ...newKarir, jenis_pekerjaan: v })}>
                                        <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none text-sm font-bold"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl shadow-xl">{['On-site', 'Remote', 'Hybrid', 'Freelance'].map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-end bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tahun Masuk</Label>
                                    <Input type="number" className="h-11 rounded-xl bg-white border-slate-200 text-sm font-bold shadow-sm" value={newKarir.tahun_masuk} onChange={(e) => setNewKarir({ ...newKarir, tahun_masuk: e.target.value })} required />
                                </div>
                                {!newKarir.saat_ini ? (
                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-left-1 duration-200">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tahun Keluar</Label>
                                        <Input type="number" className="h-11 rounded-xl bg-white border-slate-200 text-sm font-bold shadow-sm" value={newKarir.tahun_keluar} onChange={(e) => setNewKarir({ ...newKarir, tahun_keluar: e.target.value })} required />
                                    </div>
                                ) : (
                                    <div className="h-11 flex justify-center items-center px-3 bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5"><CheckCircle size={12} /> Aktif</span>
                                    </div>
                                )}

                                <div className="col-span-2 flex items-center gap-3 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewKarir({ ...newKarir, saat_ini: !newKarir.saat_ini })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${newKarir.saat_ini ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newKarir.saat_ini ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                    <label className="text-[11px] font-bold text-slate-600 cursor-pointer select-none" onClick={() => setNewKarir({ ...newKarir, saat_ini: !newKarir.saat_ini })}>Saya masih bekerja di posisi ini</label>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" disabled={isProcessingKarir} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 mt-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]">
                            {isProcessingKarir ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <><Save size={16} className="mr-2" /> {editingKarirId ? 'Update Riwayat' : 'Simpan Riwayat'}</>}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProfilePage;