import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Loader2,
  UserCheck,
  Clock,
  MoreVertical,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useVerification } from '@/hooks/useVerification';

// Tipe data untuk Modal Konfirmasi
interface ConfirmModalState {
  isOpen: boolean;
  userId: number;
  userName: string;
  action: 'ACTIVE' | 'REJECTED' | null;
}

export default function VerificationPage() {
  const { user } = useAuth();

  const {
    users,
    isLoading,
    processingId,
    fetchUsers,
    handleUpdateStatus
  } = useVerification();

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [modal, setModal] = useState<ConfirmModalState>({
    isOpen: false,
    userId: 0,
    userName: '',
    action: null
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const handleScroll = () => setActiveDropdown(null);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handler membuka modal konfirmasi
  const openConfirmModal = (id: number, name: string, action: 'ACTIVE' | 'REJECTED') => {
    setActiveDropdown(null); // Tutup menu dropdown
    setModal({
      isOpen: true,
      userId: id,
      userName: name,
      action: action
    });
  };

  // Handler eksekusi submit dari modal
  const onConfirmAction = async () => {
    if (modal.action && modal.userId) {
      await handleUpdateStatus(modal.userId, modal.action);
      setModal({ isOpen: false, userId: 0, userName: '', action: null });
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950 flex items-center gap-3">
          <UserCheck className="h-8 w-8 text-indigo-700" />
          Verifikasi Pengguna
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Kelola persetujuan dan status akses untuk pengguna yang terdaftar.
        </p>
      </div>

      <Card className="border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 bg-slate-50/50 px-8 py-5 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Daftar Pengguna
          </CardTitle>
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
            {users.length} Total Data
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
              <p className="font-medium">Memuat data pengguna...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <UserCheck className="h-14 w-14 text-slate-200 mb-4" />
              <p className="font-medium text-lg">Belum ada data pendaftar.</p>
            </div>
          ) : (
            <div className="overflow-visible min-h-[300px]">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50/80 uppercase font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4">Informasi Pengguna</th>
                    <th className="px-6 py-4">Kontak</th>
                    <th className="px-6 py-4">Waktu Daftar</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-8 py-4 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-bold text-indigo-950 text-base">{u.username}</div>
                        <div className="text-slate-500 font-medium mt-0.5">NIM: {u.nim}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-slate-700 font-medium">{u.email}</div>
                        <div className="text-slate-500 text-xs mt-1">{u.hp || '-'}</div>
                      </td>
                      <td className="px-6 py-5 text-slate-600 font-medium">
                        {new Date(u.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-5">
                        {u.status === 'PENDING' && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1">
                            <Clock className="w-3.5 h-3.5 mr-1.5" /> Tertunda
                          </Badge>
                        )}
                        {u.status === 'ACTIVE' && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Aktif
                          </Badge>
                        )}
                        {u.status === 'REJECTED' && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1">
                            <XCircle className="w-3.5 h-3.5 mr-1.5" /> Ditolak
                          </Badge>
                        )}
                      </td>
                      <td className="px-8 py-5 text-center relative">
                        {processingId === u.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-indigo-600 mx-auto" />
                        ) : (
                          <>
                            {/* Tombol Kebab Menu */}
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === u.id ? null : u.id)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === u.id && (
                              <>
                                {/* Invisible overlay untuk menutup dropdown jika klik di luar */}
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setActiveDropdown(null)}
                                />

                                <div className="absolute right-8 top-12 mt-1 w-48 bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                                  <div className="py-1">
                                    {/* Opsi Aktifkan (Muncul jika status bukan ACTIVE) */}
                                    {u.status !== 'ACTIVE' && (
                                      <button
                                        onClick={() => openConfirmModal(u.id, u.username, 'ACTIVE')}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Setujui / Aktifkan
                                      </button>
                                    )}

                                    {/* Opsi Tolak (Muncul jika status bukan REJECTED) */}
                                    {u.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => openConfirmModal(u.id, u.username, 'REJECTED')}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                      >
                                        <XCircle className="w-4 h-4" />
                                        Tolak Akses
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
                Konfirmasi {modal.action === 'ACTIVE' ? 'Persetujuan' : 'Penolakan'}
              </h3>

              <p className="text-slate-500 font-medium leading-relaxed mb-8 max-w-sm">
                Apakah Anda yakin ingin{" "}
                <strong className={modal.action === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}>
                  {modal.action === 'ACTIVE' ? 'menyetujui' : 'menolak'}
                </strong>{" "}
                pengguna bernama{" "}
                <span className="text-slate-800 font-bold">"{modal.userName}"</span>?
                {modal.action === 'REJECTED' && " Pengguna ini tidak akan bisa mengakses sistem."}
              </p>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1 font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
                  onClick={() =>
                    setModal({
                      isOpen: false,
                      userId: 0,
                      userName: "",
                      action: null
                    })
                  }
                >
                  Batal
                </Button>

                <Button
                  className={`flex-1 font-bold text-white ${modal.action === "ACTIVE"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                    }`}
                  onClick={onConfirmAction}
                >
                  Ya, Lanjutkan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}