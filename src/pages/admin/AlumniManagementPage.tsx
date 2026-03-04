import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search,
  MoreVertical, 
  Eye, 
  GraduationCap, 
  MapPin, 
  Briefcase, 
  Mail, 
  Phone,
  Calendar,
  Loader2,
  X,
  CheckCircle2,
  ShieldAlert,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAlumni } from '@/hooks/useAlumni';

interface ConfirmModalState {
  isOpen: boolean;
  userId: number;
  userName: string;
  action: 'ACTIVE' | 'REJECTED' | 'DEACTIVATED' | null;
}

export default function AlumniManagementPage() {
  const { user } = useAuth();
  const { 
    alumni, 
    isLoading, 
    isDetailLoading, 
    detailData, 
    processingId,
    setDetailData,
    fetchAlumni,
    fetchAlumniDetail,
    handleUpdateStatus
  } = useAlumni();

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState<ConfirmModalState>({
    isOpen: false,
    userId: 0,
    userName: '',
    action: null
  });

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  useEffect(() => {
    const handleScroll = () => setActiveDropdown(null);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const handleViewDetail = (id: number) => {
    setActiveDropdown(null);
    fetchAlumniDetail(id);
  };

  const openConfirmModal = (id: number, name: string, action: 'ACTIVE' | 'REJECTED' | 'DEACTIVATED') => {
    setActiveDropdown(null);
    setModal({
      isOpen: true,
      userId: id,
      userName: name,
      action: action
    });
  };

  const onConfirmAction = async () => {
    if (modal.action && modal.userId) {
      await handleUpdateStatus(modal.userId, modal.action);
      setModal({ isOpen: false, userId: 0, userName: '', action: null });
    }
  };

  const filteredAlumni = alumni.filter(a => 
    a.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.nim.includes(searchTerm)
  );

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950 flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-700" />
            Manajemen Alumni
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Kelola data dan pantau informasi detail profil seluruh alumni terdaftar.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama atau NIM..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 bg-slate-50/50 px-8 py-5 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Direktori Alumni
          </CardTitle>
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
            {filteredAlumni.length} Data
          </Badge>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
              <p className="font-medium">Memuat data alumni...</p>
            </div>
          ) : filteredAlumni.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Users className="h-14 w-14 text-slate-200 mb-4" />
              <p className="font-medium text-lg">Tidak ada data alumni yang ditemukan.</p>
            </div>
          ) : (
            <div className="overflow-visible min-h-[300px]">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50/80 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4">Nama Lengkap & NIM</th>
                    <th className="px-6 py-4">Kontak</th>
                    <th className="px-6 py-4">Tgl Bergabung</th>
                    <th className="px-6 py-4">Status Akun</th>
                    <th className="px-8 py-4 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAlumni.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-bold text-indigo-950 text-base">{u.username}</div>
                        <div className="text-slate-500 font-medium mt-0.5">NIM: {u.nim}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-slate-700 font-medium flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {u.email}
                        </div>
                        <div className="text-slate-500 text-xs mt-1.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {u.hp || 'Belum diisi'}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-600 font-medium">
                        {new Date(u.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="outline" className={`px-3 py-1 ${
                          u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          u.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-5 text-center relative">
                        {processingId === u.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mx-auto" />
                        ) : (
                          <>
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === u.id ? null : u.id)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all focus:outline-none"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {activeDropdown === u.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                                <div className="absolute right-8 top-12 mt-1 w-48 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden z-20 animate-in fade-in zoom-in-95">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleViewDetail(u.id)}
                                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors border-b border-slate-50"
                                    >
                                      <Eye className="w-4 h-4" />
                                      Lihat Detail Profil
                                    </button>

                                    {u.status !== 'ACTIVE' && (
                                      <button
                                        onClick={() => openConfirmModal(u.id, u.username, 'ACTIVE')}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Aktifkan Akun
                                      </button>
                                    )}

                                    {u.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => openConfirmModal(u.id, u.username, 'REJECTED')}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                      >
                                        <XCircle className="w-4 h-4" />
                                        Nonaktifkan / Tolak
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Konfirmasi Ubah Status */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl">
            <div className="p-8 flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${modal.action === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {modal.action === 'ACTIVE' ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <ShieldAlert className="w-7 h-7" />
                )}
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                Konfirmasi {modal.action === 'ACTIVE' ? 'Aktivasi' : 'Penonaktifan'}
              </h3>

              <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-sm">
                Apakah Anda yakin ingin{" "}
                <strong className={modal.action === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}>
                  {modal.action === 'ACTIVE' ? 'mengaktifkan' : 'menonaktifkan'}
                </strong>{" "}
                akun dari pengguna{" "}
                <span className="text-slate-800 font-bold">"{modal.userName}"</span>?
              </p>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
                  onClick={() => setModal({ isOpen: false, userId: 0, userName: "", action: null })}
                >
                  Batal
                </Button>

                <Button
                  className={`flex-1 font-bold text-white ${modal.action === "ACTIVE" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
                  onClick={onConfirmAction}
                >
                  Ya, Lanjutkan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Profil */}
      {isDetailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
           <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
      )}

      {detailData && !isDetailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transform animate-in zoom-in-95 duration-200">
            
            <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-indigo-950 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Informasi Detail Alumni
              </h2>
              <button 
                onClick={() => setDetailData(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col md:flex-row gap-8">
                
                <div className="w-full md:w-1/3 flex flex-col items-center text-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-indigo-50 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden text-indigo-300">
                    {detailData.profile?.avatar ? (
                      <img src={detailData.profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-12 h-12" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{detailData.profile?.fullName || detailData.username}</h3>
                    <p className="text-slate-500 font-medium text-sm mt-1">{detailData.nim}</p>
                    <Badge variant="secondary" className="mt-3 bg-indigo-50 text-indigo-700">
                      {detailData.status}
                    </Badge>
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-500" /> Informasi Akademik
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Fakultas</p>
                        <p className="font-medium text-slate-900">{detailData.profile?.fakultas || '-'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Program Studi</p>
                        <p className="font-medium text-slate-900">{detailData.profile?.prodi || '-'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Tahun Lulus</p>
                        <p className="font-medium text-slate-900">{detailData.profile?.graduationYear || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-500" /> Kontak & Personal
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-slate-500 text-xs">Email</p>
                          <p className="font-medium text-slate-900">{detailData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-slate-500 text-xs">No. Handphone</p>
                          <p className="font-medium text-slate-900">{detailData.hp || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-slate-500 text-xs">Alamat Domisili</p>
                          <p className="font-medium text-slate-900">{detailData.profile?.address || '-'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-slate-500 text-xs">Tanggal Lahir</p>
                          <p className="font-medium text-slate-900">{detailData.profile?.birthDate || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {detailData.pekerjaan && detailData.pekerjaan.length > 0 && (
                     <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                         <Briefcase className="w-4 h-4 text-amber-500" /> Riwayat Karir
                       </h4>
                       <div className="space-y-3">
                         {detailData.pekerjaan.map((job, idx) => (
                           <div key={idx} className="border-l-2 border-slate-200 pl-3">
                              <p className="font-bold text-slate-800 text-sm">{job.position}</p>
                              <p className="text-slate-600 text-xs">{job.company}</p>
                              <p className="text-slate-400 text-xs mt-0.5">{job.startDate}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                  )}

                </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button 
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium"
                onClick={() => setDetailData(null)}
              >
                Tutup Jendela
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}