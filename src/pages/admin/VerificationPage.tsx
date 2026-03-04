import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, UserCheck, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useVerification } from '@/hooks/useVerification'; // <-- Import hook barumu

export default function VerificationPage() {
  const { user } = useAuth();
  
  const { 
    users, 
    isLoading, 
    processingId, 
    fetchUsers, 
    handleUpdateStatus 
  } = useVerification();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950 flex items-center gap-3">
          <UserCheck className="h-8 w-8 text-indigo-700" />
          Verifikasi Pengguna Baru
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Kelola persetujuan akses untuk alumni yang baru mendaftar.
        </p>
      </div>

      <Card className="border-slate-100 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 bg-slate-50/50 px-8 py-5">
          <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Daftar Antrean Pendaftar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
              <p className="font-medium">Memuat data pendaftar...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <UserCheck className="h-12 w-12 text-slate-200 mb-4" />
              <p className="font-medium">Tidak ada data pengguna yang perlu diverifikasi.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50/80 uppercase font-bold">
                  <tr>
                    <th className="px-8 py-4">Informasi User</th>
                    <th className="px-6 py-4">Kontak</th>
                    <th className="px-6 py-4">Waktu Daftar</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-indigo-950">{u.username}</div>
                        <div className="text-slate-500 text-xs font-medium mt-0.5">NIM: {u.nim}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-slate-700 font-medium">{u.email}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{u.hp || '-'}</div>
                      </td>
                      <td className="px-6 py-5 text-slate-600 font-medium">
                        {new Date(u.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-5">
                        {u.status === 'PENDING' && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 flex w-fit items-center gap-1.5 px-2.5 py-1">
                            <Clock className="w-3 h-3" /> Tertunda
                          </Badge>
                        )}
                        {u.status === 'ACTIVE' && (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex w-fit items-center gap-1.5 px-2.5 py-1">
                            <CheckCircle className="w-3 h-3" /> Aktif
                          </Badge>
                        )}
                        {u.status === 'REJECTED' && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex w-fit items-center gap-1.5 px-2.5 py-1">
                            <XCircle className="w-3 h-3" /> Ditolak
                          </Badge>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        {u.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              disabled={processingId === u.id}
                              onClick={() => handleUpdateStatus(u.id, 'REJECTED')}
                            >
                              Tolak
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-indigo-900 hover:bg-indigo-800 text-white"
                              disabled={processingId === u.id}
                              onClick={() => handleUpdateStatus(u.id, 'ACTIVE')}
                            >
                              {processingId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Setujui'}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">SELESAI</span>
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
    </div>
  );
}