/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import {
    User as UserIcon, Briefcase, Save, Plus,
    Trash2, GraduationCap, MapPin, Calendar,
    Loader2, Building2, Instagram, Linkedin,
    BookOpen, Hash, Map, ShieldCheck, Globe, Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useKarir } from '@/hooks/useKarir';
import { toast } from 'sonner';

const ProfilePage = () => {
    const { user } = useAuth();

    // Hooks yang terhubung ke API Gateway
    const { updateProfile, getProfileById, isLoading: isUpdatingMaster } = useProfile();
    const {
        karirs, isFetching: isFetchingKarir, isProcessing: isProcessingKarir,
        fetchKarirs, addKarir, deleteKarir
    } = useKarir(user?.id);

    // State Gabungan
    const [profileData, setProfileData] = useState<any>(null);
    const [accountForm, setAccountForm] = useState({
        username: user?.username || '',
        hp: user?.hp || '',
        newPassword: ''
    });

    const [masterForm, setMasterForm] = useState({
        nama_lengkap: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        program_studi_id: '',
        angkatan: '',
        tahun_lulus: '',
        agama: '',
        jenjang: '',
        jenis_kelamin: '',
        judul_skripsi: '',
        gelar: '',
        sosial_media: { linkedin: '', instagram: '' }
    });

    const [newKarir, setNewKarir] = useState({
        posisi_pekerjaan: '',
        nama_perusahaan: '',
        lokasi_pekerjaan: '',
        tahun_masuk: '',
        tahun_keluar: '',
        saat_ini: false,
        sektor_pekerjaan_id: 'IT'
    });

    // Load Initial Data
    const loadAllData = useCallback(async () => {
        // Tetap gunakan pengecekan id untuk safety
        if (!user?.id) return;

        try {
            // Ambil data dari Master Service via Gateway
            const masterData = await getProfileById(user.id);
            if (masterData) {
                setProfileData(masterData);
                setMasterForm({
                    ...masterData,
                    // Pastikan format tanggal sesuai untuk input type="date"
                    tanggal_lahir: masterData.tanggal_lahir ? masterData.tanggal_lahir.split('T')[0] : '',
                    sosial_media: masterData.sosial_media || { linkedin: '', instagram: '' }
                });
            }
            fetchKarirs();
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    }, [user, getProfileById, fetchKarirs]);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // Handle Update ke RBAC Service (Account)
    const handleAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Logic: Hit Gateway -> RBAC Service Action 'UPDATE_USER' / 'UPDATE_PASSWORD'
        toast.success("Pengaturan akun berhasil diperbarui");
    };

    // Handle Update ke Master Service (Profile)
    const handleMasterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        await updateProfile(user.id, masterForm);
    };

    const handleAddKarir = async () => {
        if (!newKarir.posisi_pekerjaan || !newKarir.nama_perusahaan) return;
        const success = await addKarir(newKarir);
        if (success) {
            setNewKarir({
                posisi_pekerjaan: '', nama_perusahaan: '', lokasi_pekerjaan: '',
                tahun_masuk: '', tahun_keluar: '', saat_ini: false, sektor_pekerjaan_id: 'IT'
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- TOP HERO SECTION --- */}
            <div className="relative overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-12">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-105 duration-500">
                            {profileData?.foto ? (
                                <img src={profileData.foto} alt="Profile" className="h-full w-full object-cover rounded-[2rem]" />
                            ) : (
                                <UserIcon size={64} strokeWidth={1.5} />
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-indigo-600 cursor-pointer hover:bg-slate-50">
                            <Plus size={20} />
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black text-indigo-950 tracking-tight">
                                {masterForm.nama_lengkap || user?.username}
                            </h1>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] font-bold">
                                {user?.status}
                            </Badge>
                        </div>
                        <p className="text-slate-500 font-medium text-lg flex items-center justify-center md:justify-start gap-2">
                            <GraduationCap className="text-indigo-500" size={20} />
                            {masterForm.jenjang} {profileData?.prodi?.nama} • Lulus {masterForm.tahun_lulus || '-'}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-sm font-bold">
                                <Hash size={16} className="text-indigo-400" /> {user?.nim || 'NIM BELUM DISET'}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-sm font-bold">
                                <Map size={16} className="text-indigo-400" /> {profileData?.prodi?.fakultas?.nama || 'Fakultas'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="bg-white/50 backdrop-blur-md p-1.5 rounded-[1.8rem] h-16 border border-slate-200/60 shadow-sm mb-8 inline-flex w-full md:w-auto">
                    <TabsTrigger value="personal" className="rounded-[1.2rem] px-8 h-full data-[state=active]:bg-indigo-950 data-[state=active]:text-white transition-all font-bold">
                        <UserIcon className="w-4 h-4 mr-2" /> Data Personal
                    </TabsTrigger>
                    <TabsTrigger value="akademik" className="rounded-[1.2rem] px-8 h-full data-[state=active]:bg-indigo-950 data-[state=active]:text-white transition-all font-bold">
                        <BookOpen className="w-4 h-4 mr-2" /> Akademik
                    </TabsTrigger>
                    <TabsTrigger value="karir" className="rounded-[1.2rem] px-8 h-full data-[state=active]:bg-indigo-950 data-[state=active]:text-white transition-all font-bold">
                        <Briefcase className="w-4 h-4 mr-2" /> Pengalaman
                    </TabsTrigger>
                    <TabsTrigger value="keamanan" className="rounded-[1.2rem] px-8 h-full data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all font-bold">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Keamanan
                    </TabsTrigger>
                </TabsList>

                {/* --- TAB 1: PERSONAL (MASTER SERVICE) --- */}
                <TabsContent value="personal" className="animate-in slide-in-from-left-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                                <CardTitle className="text-indigo-950 flex items-center gap-2">Detail Personal</CardTitle>
                                <CardDescription>Informasi ini akan muncul pada direktori alumni.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Nama Lengkap (Sesuai Ijazah)</Label>
                                        <Input value={masterForm.nama_lengkap} onChange={(e) => setMasterForm({ ...masterForm, nama_lengkap: e.target.value })} className="h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Jenis Kelamin</Label>
                                        <Select value={masterForm.jenis_kelamin} onValueChange={(v) => setMasterForm({ ...masterForm, jenis_kelamin: v })}>
                                            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Pilih" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="L">Laki-laki</SelectItem>
                                                <SelectItem value="P">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tempat Lahir</Label>
                                        <Input value={masterForm.tempat_lahir} onChange={(e) => setMasterForm({ ...masterForm, tempat_lahir: e.target.value })} className="h-12 rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tanggal Lahir</Label>
                                        <Input type="date" value={masterForm.tanggal_lahir} onChange={(e) => setMasterForm({ ...masterForm, tanggal_lahir: e.target.value })} className="h-12 rounded-xl" />
                                    </div>
                                </div>
                                <Button onClick={handleMasterSubmit} disabled={isUpdatingMaster} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl font-bold">
                                    {isUpdatingMaster ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} Simpan Perubahan Profile
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] bg-gradient-to-b from-slate-900 to-indigo-950 text-white">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2"><Globe size={20} /> Jejaring Sosial</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-indigo-200">LinkedIn URL</Label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-3 text-indigo-400" size={18} />
                                            <Input
                                                className="pl-10 bg-white/10 border-none h-12 rounded-xl text-white placeholder:text-slate-500"
                                                value={masterForm.sosial_media.linkedin}
                                                onChange={(e) => setMasterForm({ ...masterForm, sosial_media: { ...masterForm.sosial_media, linkedin: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-indigo-200">Instagram</Label>
                                        <div className="relative">
                                            <Instagram className="absolute left-3 top-3 text-indigo-400" size={18} />
                                            <Input
                                                className="pl-10 bg-white/10 border-none h-12 rounded-xl text-white placeholder:text-slate-500"
                                                value={masterForm.sosial_media.instagram}
                                                onChange={(e) => setMasterForm({ ...masterForm, sosial_media: { ...masterForm.sosial_media, instagram: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* --- TAB 2: AKADEMIK (MASTER SERVICE) --- */}
                <TabsContent value="akademik" className="animate-in zoom-in-95 duration-500">
                    <Card className="border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem]">
                        <CardHeader className="p-8">
                            <CardTitle className="text-indigo-950 flex items-center gap-2">Pendidikan di Perguruan Tinggi</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-2"><Label>Jenjang</Label>
                                <Select value={masterForm.jenjang} onValueChange={(v) => setMasterForm({ ...masterForm, jenjang: v })}>
                                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {['D3', 'D4', 'S1', 'S2', 'S3'].map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2"><Label>Angkatan</Label><Input type="number" value={masterForm.angkatan} onChange={(e) => setMasterForm({ ...masterForm, angkatan: e.target.value })} className="h-12 rounded-xl" /></div>
                            <div className="space-y-2"><Label>Tahun Lulus</Label><Input type="number" value={masterForm.tahun_lulus} onChange={(e) => setMasterForm({ ...masterForm, tahun_lulus: e.target.value })} className="h-12 rounded-xl" /></div>
                            <div className="space-y-2"><Label>Gelar Akhir</Label><Input value={masterForm.gelar} onChange={(e) => setMasterForm({ ...masterForm, gelar: e.target.value })} placeholder="Contoh: S.Kom" className="h-12 rounded-xl" /></div>
                            <div className="md:col-span-4 space-y-2">
                                <Label>Judul Skripsi / Tugas Akhir</Label>
                                <Input value={masterForm.judul_skripsi} onChange={(e) => setMasterForm({ ...masterForm, judul_skripsi: e.target.value })} className="h-12 rounded-xl font-medium" />
                            </div>
                            <Button onClick={handleMasterSubmit} className="lg:col-span-1 bg-indigo-900 h-12 rounded-xl font-bold">Simpan Data Akademik</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- TAB 3: KARIR (MASTER SERVICE) --- */}
                <TabsContent value="karir" className="animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {isFetchingKarir ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500 h-10 w-10" /></div>
                            ) : karirs.map((k) => (
                                <Card key={k.id_karir} className="border-none shadow-lg rounded-[1.8rem] group hover:ring-2 ring-indigo-500/30 transition-all">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div className="flex gap-5">
                                            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                                <Building2 size={30} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-indigo-950 leading-tight">{k.posisi_pekerjaan}</h3>
                                                <p className="text-indigo-600 font-semibold">{k.nama_perusahaan}</p>
                                                <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-2 font-black uppercase tracking-widest">
                                                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md"><Calendar size={12} /> {k.tahun_masuk} - {k.saat_ini ? 'Present' : k.tahun_keluar}</span>
                                                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md"><MapPin size={12} /> {k.lokasi_pekerjaan}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50" onClick={() => deleteKarir(k.id_karir)}>
                                            <Trash2 size={20} />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-[2.5rem] sticky top-24 h-fit">
                            <CardHeader><CardTitle>Tambah Pengalaman</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1.5"><Label className="text-xs font-bold">Posisi</Label><Input placeholder="Contoh: UI/UX Designer" className="h-11 rounded-xl" value={newKarir.posisi_pekerjaan} onChange={(e) => setNewKarir({ ...newKarir, posisi_pekerjaan: e.target.value })} /></div>
                                <div className="space-y-1.5"><Label className="text-xs font-bold">Instansi</Label><Input placeholder="Nama Perusahaan" className="h-11 rounded-xl" value={newKarir.nama_perusahaan} onChange={(e) => setNewKarir({ ...newKarir, nama_perusahaan: e.target.value })} /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5"><Label className="text-xs font-bold">Thn Masuk</Label><Input type="number" className="h-11 rounded-xl" value={newKarir.tahun_masuk} onChange={(e) => setNewKarir({ ...newKarir, tahun_masuk: e.target.value })} /></div>
                                    <div className="space-y-1.5"><Label className="text-xs font-bold">Thn Keluar</Label><Input type="number" className="h-11 rounded-xl" disabled={newKarir.saat_ini} value={newKarir.tahun_keluar} onChange={(e) => setNewKarir({ ...newKarir, tahun_keluar: e.target.value })} /></div>
                                </div>
                                <div className="flex items-center space-x-2 py-2">
                                    <input type="checkbox" id="saat_ini" className="h-5 w-5 rounded-lg border-slate-300 text-indigo-600" checked={newKarir.saat_ini} onChange={(e) => setNewKarir({ ...newKarir, saat_ini: e.target.checked })} />
                                    <label htmlFor="saat_ini" className="text-sm font-bold text-slate-600">Masih aktif</label>
                                </div>
                                <Button onClick={handleAddKarir} disabled={isProcessingKarir} className="w-full bg-indigo-600 h-14 rounded-2xl font-bold text-lg shadow-lg">
                                    {isProcessingKarir ? <Loader2 className="animate-spin" /> : <Plus className="mr-2" />} Tambah Karir
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* --- TAB 4: KEAMANAN (RBAC SERVICE) --- */}
                <TabsContent value="keamanan" className="animate-in slide-in-from-top-4 duration-500">
                    <Card className="border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] max-w-2xl">
                        <CardHeader className="p-8">
                            <CardTitle className="text-red-600 flex items-center gap-2"><Lock /> Keamanan Akun</CardTitle>
                            <CardDescription>Update kredensial login Anda pada RBAC Service.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nomor Handphone (Akun)</Label>
                                    <Input value={accountForm.hp} onChange={(e) => setAccountForm({ ...accountForm, hp: e.target.value })} className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Password Baru</Label>
                                    <Input type="password" placeholder="Masukan password baru" onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })} className="h-12 rounded-xl" />
                                </div>
                            </div>
                            <Button onClick={handleAccountSubmit} className="bg-red-600 hover:bg-red-700 h-12 px-8 rounded-xl font-bold">Update Kredensial</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProfilePage;