import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft, Users, GraduationCap, MapPin, Briefcase, Loader2, Save, BookOpen, Instagram, Linkedin
} from 'lucide-react';
import { useAlumni } from '@/hooks/useAlumni';

export default function AlumniDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const {
        isDetailLoading,
        detailData,
        processingId,
        fetchAlumniDetail,
        handleUpdateUser
    } = useAlumni();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        nim: '',
        hp: ''
    });

    useEffect(() => {
        if (!id || loaded) return;
        fetchAlumniDetail(Number(id));
        setLoaded(true);
    }, [id, fetchAlumniDetail, loaded]);

    useEffect(() => {
        if (detailData) {
            setFormData({
                username: detailData.username || '',
                email: detailData.email || '',
                nim: detailData.nim || '',
                hp: detailData.hp || ''
            });
        }
    }, [detailData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            await handleUpdateUser(Number(id), formData);
        }
    };

    const formatBirthDate = (dateString?: string) => {
        if (!dateString || dateString === 'Belum diisi') return '-';
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(date);
        } catch (e) {
            return dateString;
        }
    };

    if (isDetailLoading || !detailData) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-slate-500 font-medium">Memuat detail alumni...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate('/alumni')} className="rounded-xl">
                    <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Button>
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-indigo-950">Detail Alumni</h1>
                    <p className="text-slate-500 text-sm mt-1">Kelola data otentikasi dan lihat profil master alumni.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 shadow-sm border-slate-100 rounded-2xl h-fit">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-600" /> Data Akun (RBAC)
                        </CardTitle>
                        <p className="text-xs text-slate-500 mt-1">Dapat diedit oleh Admin</p>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Nama Lengkap / Username</Label>
                                <Input
                                    id="username" name="username"
                                    value={formData.username} onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nim">NIM</Label>
                                <Input
                                    id="nim" name="nim"
                                    value={formData.nim} onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email" name="email" type="email"
                                    value={formData.email} onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hp">No. Handphone</Label>
                                <Input
                                    id="hp" name="hp"
                                    value={formData.hp} onChange={handleChange}
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                    disabled={processingId === Number(id)}
                                >
                                    {processingId === Number(id) ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Simpan Perubahan Akun
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-slate-100 rounded-2xl">
                        <CardContent className="p-6 flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-indigo-50 border-4 border-white shadow flex items-center justify-center overflow-hidden text-indigo-300 shrink-0">
                                {detailData.profile?.avatar ? (
                                    <img src={detailData.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Users className="w-8 h-8" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-900">{detailData.profile?.fullName || detailData.username}</h3>
                                    <div className="flex gap-2">
                                        {detailData.profile?.sosialMedia?.linkedin && (
                                            <a href={detailData.profile.sosialMedia.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-full hover:bg-indigo-100 text-indigo-600 transition-colors">
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                        {detailData.profile?.sosialMedia?.instagram && (
                                            <a href={detailData.profile.sosialMedia.instagram} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 rounded-full hover:bg-pink-100 text-pink-600 transition-colors">
                                                <Instagram className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-2">
                                    <Badge variant="outline" className="bg-slate-50 uppercase tracking-wider text-[10px]">Role: {detailData.role}</Badge>
                                    <Badge variant="secondary" className={`
                                        ${detailData.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' :
                                            detailData.status === 'PENDING' ? 'bg-orange-50 text-orange-700' :
                                                'bg-red-50 text-red-700'}
                                    `}>
                                        Status: {detailData.status}
                                    </Badge>
                                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                                        {detailData.profile?.gender || '-'}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-100 rounded-2xl">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-emerald-500" /> Data Akademik & Profil
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-slate-500 text-xs mb-1">Fakultas</p>
                                <p className="font-medium text-slate-900 bg-slate-50 p-2 rounded-md border border-slate-100">{detailData.profile?.fakultas || 'Belum diisi'}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs mb-1">Program Studi</p>
                                <p className="font-medium text-slate-900 bg-slate-50 p-2 rounded-md border border-slate-100">{detailData.profile?.prodi || 'Belum diisi'}</p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs mb-1">Jenjang & Gelar</p>
                                <div className="flex gap-2">
                                    <p className="font-medium text-slate-900 bg-slate-50 p-2 rounded-md border border-slate-100 flex-1">{detailData.profile?.jenjang || '-'}</p>
                                    <p className="font-medium text-indigo-700 bg-indigo-50 p-2 rounded-md border border-indigo-100 flex-1">{detailData.profile?.degree || '-'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs mb-1">Angkatan & Tahun Lulus</p>
                                <div className="flex gap-2">
                                    <p className="font-medium text-slate-900 bg-slate-50 p-2 rounded-md border border-slate-100 flex-1">{detailData.profile?.angkatan || '-'}</p>
                                    <p className="font-medium text-slate-900 bg-slate-50 p-2 rounded-md border border-slate-100 flex-1">{detailData.profile?.graduationYear || '-'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs mb-1">Tempat, Tanggal Lahir</p>
                                <p className="font-medium text-slate-900 bg-slate-50 p-2 rounded-md border border-slate-100">
                                    {detailData.profile?.birthPlace || '-'}, {formatBirthDate(detailData.profile?.birthDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs mb-1">Agama</p>
                                <p className="font-medium text-slate-900 bg-slate-50 p-2 rounded-md border border-slate-100">{detailData.profile?.agama || '-'}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-slate-500 text-xs mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3 text-indigo-500" /> Judul Skripsi</p>
                                <p className="font-medium text-slate-900 bg-indigo-50/30 p-3 rounded-md border border-indigo-100 italic text-sm">
                                    "{detailData.profile?.thesisTitle || 'Belum mengisi judul skripsi'}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-100 rounded-2xl">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-amber-500" /> Riwayat Karir
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {detailData.pekerjaan && detailData.pekerjaan.length > 0 ? (
                                <div className="space-y-4">
                                    {detailData.pekerjaan.map((job, idx) => (
                                        <div key={idx} className="border-l-2 border-indigo-200 pl-4 relative">
                                            <div className="absolute w-2 h-2 bg-indigo-500 rounded-full -left-[5px] top-2"></div>
                                            <p className="font-bold text-slate-800">{job.position}</p>
                                            <p className="text-slate-600 text-sm">{job.company}</p>
                                            <p className="text-slate-400 text-xs mt-1">{job.startDate}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-400">
                                    <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Belum ada data karir yang ditambahkan.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}