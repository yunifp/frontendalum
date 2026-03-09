/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, GraduationCap, Briefcase, Loader2, BookOpen, Instagram, Linkedin, Mail, Phone, MapPin, CheckCircle2, XCircle, Building2, Calendar } from 'lucide-react';
import { useAlumni } from '@/hooks/useAlumni';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { SafeImage } from '@/components/ui/SafeImage';

export default function AlumniDetailPage() {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { alumniList, isLoading, fetchAlumni, handleUpdateStatus } = useAlumni(user);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (alumniList.length === 0) {
            fetchAlumni();
        }
    }, [fetchAlumni]);

    const detailData = useMemo(() => {
        return alumniList.find(a => a.id_pengguna === Number(id) || a.id === Number(id));
    }, [id, alumniList]);

    const onStatusChange = async (newStatus: 'ACTIVE' | 'REJECTED' | 'DEACTIVATED') => {
        setIsProcessing(true);
        await handleUpdateStatus(Number(id), newStatus);
        setIsProcessing(false);
    };

    const formatBirthDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: localeId });
        } catch {
            return dateString;
        }
    };

    if (isLoading || !detailData) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Menyinkronkan Profil...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate('/admin/alumni')} className="rounded-2xl bg-white border-slate-200">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Detail Profil</h1>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Informasi Lengkap tentang Alumni</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    {detailData.status !== 'ACTIVE' && (
                        <Button
                            onClick={() => onStatusChange('ACTIVE')}
                            disabled={isProcessing}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest h-10 px-6 shadow-lg shadow-emerald-100"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Aktifkan Akun
                        </Button>
                    )}
                    {detailData.status !== 'REJECTED' && (
                        <Button
                            variant="outline"
                            onClick={() => onStatusChange('REJECTED')}
                            disabled={isProcessing}
                            className="border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl font-bold uppercase text-[10px] tracking-widest h-10 px-6"
                        >
                            <XCircle className="w-4 h-4 mr-2" /> Nonaktifkan
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 overflow-hidden bg-white">
                        <div className="h-28 bg-linear-to-br from-indigo-600 to-violet-700" />
                        <CardContent className="relative pt-0 px-6 pb-8">
                            <div className="flex flex-col items-center -mt-12 space-y-4">
                                <div className="h-24 w-24 rounded-[2rem] border-[6px] border-white shadow-xl bg-slate-100 overflow-hidden">
                                    {detailData.foto ? (
                                        <SafeImage src={detailData.foto} alt={detailData.nama_lengkap || detailData.username} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                                            <Users size={40} />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                        {detailData.nama_lengkap || detailData.username}
                                    </h3>
                                    <div className="flex flex-col items-center gap-2">
                                        <Badge className={`text-[9px] font-black uppercase px-3 ${detailData.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {detailData.status}
                                        </Badge>
                                        <span className="text-[10px] font-mono text-slate-400">ID: {detailData.id_pengguna}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3 p-4 bg-slate-50/50 rounded-3xl border border-slate-100">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Mail size={16} className="text-indigo-400" />
                                    <span className="text-xs font-bold truncate">{detailData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Phone size={16} className="text-indigo-400" />
                                    <span className="text-xs font-bold">{detailData.hp || '-'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <MapPin size={16} className="text-indigo-400" />
                                    <span className="text-xs font-bold uppercase truncate">{detailData.kabupaten_relasi?.nama_wilayah || 'Lokasi Belum Diset'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-none shadow-sm ring-1 ring-slate-100 bg-white">
                        <CardHeader className="pb-2"><CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Akses Sosial</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="rounded-xl border-slate-100 h-11 text-xs font-bold" asChild disabled={!detailData.sosial_media?.linkedin}>
                                <a href={`https://linkedin.com/in/${detailData.sosial_media?.linkedin}`} target="_blank" rel="noreferrer">
                                    <Linkedin className="w-4 h-4 mr-2 text-blue-600" /> LinkedIn
                                </a>
                            </Button>
                            <Button variant="outline" className="rounded-xl border-slate-100 h-11 text-xs font-bold" asChild disabled={!detailData.sosial_media?.instagram}>
                                <a href={`https://instagram.com/${detailData.sosial_media?.instagram}`} target="_blank" rel="noreferrer">
                                    <Instagram className="w-4 h-4 mr-2 text-pink-600" /> Instagram
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
                            <CardTitle className="text-xs font-black uppercase text-indigo-600 tracking-[0.2em] flex items-center gap-2">
                                <GraduationCap className="w-5 h-5" /> Informasi Akademik & Pendidikan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">NIM Mahasiswa</Label>
                                <p className="text-sm font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono tracking-tight">{detailData.nim || '-'}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Fakultas</Label>
                                <p className="text-sm font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 uppercase">{detailData.prodi?.fakultas?.nama || '-'}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Program Studi</Label>
                                <p className="text-sm font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100 uppercase">{detailData.prodi?.nama || '-'}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Gelar Akademik</Label>
                                <p className="text-sm font-bold text-indigo-700 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">{detailData.gelar || '-'}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Tahun Masuk</Label>
                                <p className="text-sm font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">{detailData.angkatan || '-'}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Tahun Lulus</Label>
                                <p className="text-sm font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-100">{detailData.tahun_lulus || '-'}</p>
                            </div>

                            <div className="md:col-span-2 p-6 bg-slate-900 rounded-[2rem] space-y-2 border border-slate-800 shadow-2xl">
                                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                                    <BookOpen size={14} /> Judul Skripsi / Tugas Akhir
                                </p>
                                <p className="text-[13px] font-medium text-slate-300 leading-relaxed italic">
                                    "{detailData.judul_skripsi || 'Belum mengisi data skripsi.'}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
                            <CardTitle className="text-xs font-black uppercase text-amber-600 tracking-[0.2em] flex items-center gap-2">
                                <Briefcase className="w-5 h-5" /> Riwayat Pekerjaan & Karir
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            {detailData.karirs && detailData.karirs.length > 0 ? (
                                <div className="space-y-6">
                                    {detailData.karirs.map((job: any, index: number) => (
                                        <div key={job.id_karir} className="relative pl-10 group">
                                            {index !== detailData.karirs.length - 1 && (
                                                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-100 group-hover:bg-indigo-100 transition-colors" />
                                            )}
                                            <div className={`absolute left-0 top-1 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${job.saat_ini ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                                                <Building2 size={18} />
                                            </div>
                                            <div className="space-y-2 ml-3">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-black text-slate-900 uppercase tracking-tight">{job.posisi_pekerjaan}</h4>
                                                    {job.saat_ini && (
                                                        <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100 text-[9px] font-black px-2 py-0">PRESENT</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm font-bold text-slate-600 flex items-center gap-2 italic">
                                                    {job.nama_perusahaan} • <span className="text-slate-400 font-medium not-italic">{job.lokasi_pekerjaan}</span>
                                                </p>
                                                <div className="flex items-center gap-4 pt-1">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                                        <Calendar size={12} /> {job.tahun_masuk} — {job.tahun_keluar || (job.saat_ini ? 'Sekarang' : '?')}
                                                    </div>
                                                    <Badge variant="outline" className="text-[9px] font-black border-slate-200 text-slate-400">{job.jenis_pekerjaan}</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 space-y-3 opacity-40 italic">
                                    <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Belum ada riwayat karir tercatat</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6 px-8">
                            <CardTitle className="text-xs font-black uppercase text-amber-600 tracking-[0.2em] flex items-center gap-2">
                                <Briefcase className="w-5 h-5" /> Detail Personal & Lokasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Tempat & Tanggal Lahir</Label>
                                <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                                    {detailData.tempat_lahir || '-'}, {formatBirthDate(detailData.tanggal_lahir)}
                                </p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Jenis Kelamin</Label>
                                <p className="text-sm font-bold text-slate-800 uppercase">
                                    {detailData.jenis_kelamin === 'L' ? 'Laki-Laki' : detailData.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
                                </p>
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-0.5">Alamat Lengkap</Label>
                                <p className="text-sm font-bold text-slate-600 leading-relaxed uppercase">{detailData.alamat || '-'}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {detailData.kabupaten_relasi?.nama_wilayah || '-'}, {detailData.provinsi_relasi?.nama_provinsi || '-'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}