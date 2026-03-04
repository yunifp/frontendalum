import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  CheckCircle,
  XCircle,
  Loader2,
  UserCheck,
  Clock,
  MoreHorizontal,
  ShieldAlert,
  CheckCircle2,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
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

  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk Paginasi Client-side
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [modal, setModal] = useState<ConfirmModalState>({
    isOpen: false,
    userId: 0,
    userName: '',
    action: null
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset page ke 0 ketika melakukan pencarian
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // Handler membuka modal konfirmasi
  const openConfirmModal = (id: number, name: string, action: 'ACTIVE' | 'REJECTED') => {
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

  // Filter & Paginasi Data
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.nim.includes(searchTerm)
  );
  
  const pageCount = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    currentPage * pageSize, 
    (currentPage + 1) * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Verifikasi Pengguna</h1>
          <p className="text-sm text-slate-500">Kelola persetujuan dan status akses untuk pengguna yang terdaftar.</p>
        </div>
      </div>

      {/* Search Bar - Hanya muncul jika ada data user */}
      {users.length > 0 && (
        <div className="flex items-center px-3 border rounded-xl bg-white shadow-sm max-w-md focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <Search className="w-4 h-4 text-gray-400" />
          <Input 
            className="border-0 focus-visible:ring-0 text-sm"
            placeholder="Cari nama atau NIM pendaftar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Table Section */}
      <div className="border rounded-xl bg-white overflow-hidden shadow-sm border-slate-200">
        <Table>
          <TableHeader className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
            <TableRow className="hover:bg-transparent border-b border-slate-200">
              <TableHead className="h-12 px-4 text-center align-middle font-bold text-[11px] uppercase text-slate-600 w-16">
                No
              </TableHead>
              <TableHead className="h-12 px-4 text-left align-middle font-bold text-[11px] uppercase text-slate-600">
                Informasi Pengguna
              </TableHead>
              <TableHead className="h-12 px-4 text-left align-middle font-bold text-[11px] uppercase text-slate-600">
                Kontak
              </TableHead>
              <TableHead className="h-12 px-4 text-left align-middle font-bold text-[11px] uppercase text-slate-600">
                Waktu Daftar
              </TableHead>
              <TableHead className="h-12 px-4 text-left align-middle font-bold text-[11px] uppercase text-slate-600">
                Status
              </TableHead>
              <TableHead className="h-12 px-4 text-right align-middle font-bold text-[11px] uppercase text-slate-600">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin mx-auto text-indigo-600" />
                    <p className="text-xs text-slate-400 font-medium tracking-wide">Memuat data pengguna...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((u, index) => (
                <TableRow 
                  key={u.id} 
                  className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                >
                  <TableCell className="px-4 py-3 align-middle text-center text-xs font-mono text-slate-500">
                    {(currentPage * pageSize) + index + 1}
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 align-middle">
                    <div className="flex flex-col py-1">
                      <span className="font-bold text-xs uppercase text-slate-900">{u.username}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">NIM: {u.nim}</span>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 align-middle">
                     <div className="flex flex-col gap-1 py-1">
                        <div className="text-xs text-slate-600">{u.email}</div>
                        <div className="text-[10px] text-slate-500">{u.hp || 'Belum diisi'}</div>
                     </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 align-middle text-xs text-slate-600 font-medium">
                    {new Date(u.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </TableCell>

                  <TableCell className="px-4 py-3 align-middle">
                    {u.status === 'PENDING' && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 text-[10px] px-2 py-0.5">
                        <Clock className="w-3 h-3 mr-1" /> Tertunda
                      </Badge>
                    )}
                    {u.status === 'ACTIVE' && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] px-2 py-0.5">
                        <CheckCircle className="w-3 h-3 mr-1" /> Aktif
                      </Badge>
                    )}
                    {u.status === 'REJECTED' && (
                      <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 text-[10px] px-2 py-0.5">
                        <XCircle className="w-3 h-3 mr-1" /> Ditolak
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="px-4 py-3 align-middle text-right">
                    {processingId === u.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600 inline-block mr-2" />
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {u.status !== 'ACTIVE' && (
                            <DropdownMenuItem 
                              onClick={() => openConfirmModal(u.id, u.username, 'ACTIVE')} 
                              className="cursor-pointer text-emerald-600 focus:text-emerald-700"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Setujui / Aktifkan
                            </DropdownMenuItem>
                          )}

                          {u.status !== 'REJECTED' && (
                            <DropdownMenuItem 
                              onClick={() => openConfirmModal(u.id, u.username, 'REJECTED')} 
                              className="cursor-pointer text-red-600 focus:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Tolak Akses
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
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 bg-slate-50 rounded-full">
                      <UserCheck className="w-10 h-10 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-700">Belum ada data pendaftar ditemukan.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginasi Area */}
      {users.length > 0 && (
        <div className="flex items-center justify-between px-2 py-2 border-t pt-4">
          <div className="text-xs text-slate-500">Total {filteredUsers.length} data</div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} 
              disabled={currentPage === 0 || isLoading}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))} 
              disabled={currentPage >= pageCount - 1 || isLoading || pageCount === 0}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Persetujuan / Penolakan */}
      <Dialog open={modal.isOpen} onOpenChange={(isOpen) => !isOpen && setModal({ isOpen: false, userId: 0, userName: "", action: null })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 ${
              modal.action === 'ACTIVE' ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              {modal.action === 'ACTIVE' ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <DialogTitle className="text-center text-xl">
              Konfirmasi {modal.action === 'ACTIVE' ? 'Persetujuan' : 'Penolakan'}
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Apakah Anda yakin ingin{" "}
              <strong className={modal.action === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}>
                {modal.action === 'ACTIVE' ? 'menyetujui' : 'menolak'}
              </strong>{" "}
              pengguna bernama <strong className="text-slate-900">{modal.userName}</strong>?
              {modal.action === 'REJECTED' && " Pengguna ini tidak akan bisa mengakses sistem."}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex sm:justify-center gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setModal({ isOpen: false, userId: 0, userName: "", action: null })}
            >
              Batal
            </Button>
            <Button
              type="button"
              className={`flex-1 ${modal.action === "ACTIVE" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
              onClick={onConfirmAction}
            >
              Ya, Lanjutkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}