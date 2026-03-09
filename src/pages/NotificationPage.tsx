import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from "@/components/ui/checkbox";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
    CheckCircle,
    Info,
    AlertTriangle,
    XCircle,
    BellRing,
    ChevronLeft,
    ChevronRight,
    Trash2,
    MailCheck,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function NotificationPage() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const {
        notifications,
        isLoading,
        fetchNotifications,
        meta,
        markAsRead,
        fetchUnreadCount,
        deleteNotification
    } = useNotification();

    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // State untuk Modal Hapus
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchNotifications(currentPage, limit);
    }, [currentPage, fetchNotifications]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
            case 'WARNING': return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />;
            case 'ERROR': return <XCircle className="h-3.5 w-3.5 text-red-500" />;
            default: return <Info className="h-3.5 w-3.5 text-blue-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(new Date(dateString));
    };

    const handleSelectAll = () => {
        if (selectedIds.length === notifications.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(notifications.map(n => n.id));
        }
    };

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleMarkAsReadSelected = async () => {
        for (const id of selectedIds) {
            const notif = notifications.find(n => n.id === id);
            if (notif && !notif.isRead) {
                await markAsRead(id);
            }
        }
        toast.success("Notifikasi berhasil ditandai dibaca");
        setSelectedIds([]);
        fetchNotifications(currentPage, limit);
        fetchUnreadCount();
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            let successCount = 0;
            for (const id of selectedIds) {
                const success = await deleteNotification(id);
                if (success) successCount++;
            }

            if (successCount > 0) {
                toast.success(`${successCount} notifikasi berhasil dihapus`);
                setSelectedIds([]);
                fetchNotifications(currentPage, limit);
                fetchUnreadCount();
            }
            setIsDeleteModalOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto w-full pb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Notifikasi</h1>
                    <p className="text-xs text-slate-500 uppercase font-black tracking-widest mt-1">Pusat Pesan Sistem</p>
                </div>

                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full animate-in fade-in slide-in-from-top-2">
                        <span className="text-[10px] font-bold mr-2">{selectedIds.length} Terpilih</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 hover:bg-white/20 text-white"
                            onClick={handleMarkAsReadSelected}
                        >
                            <MailCheck className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-[10px] font-bold">Baca</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 hover:bg-white/20 text-red-400"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-[10px] font-bold">Hapus</span>
                        </Button>
                    </div>
                )}
            </div>

            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/80">
                            <TableRow className="hover:bg-transparent border-b border-slate-200">
                                <TableHead className="h-10 w-12 text-center">
                                    <Checkbox
                                        checked={notifications.length > 0 && selectedIds.length === notifications.length}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="h-10 px-2 text-[10px] uppercase font-bold text-slate-600 w-10 text-center">Tipe</TableHead>
                                <TableHead className="h-10 px-4 text-[10px] uppercase font-bold text-slate-600">Pesan</TableHead>
                                <TableHead className="h-10 px-4 text-[10px] uppercase font-bold text-slate-600 w-40 text-right">Waktu</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-xs text-slate-400 font-medium">Memuat data...</TableCell>
                                </TableRow>
                            ) : notifications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <BellRing className="h-8 w-8 text-slate-200" />
                                            <p className="text-xs font-semibold text-slate-700 uppercase tracking-tighter">Tidak ada notifikasi</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                notifications.map((notif) => (
                                    <TableRow
                                        key={notif.id}
                                        onClick={() => {
                                            const baseUrl = user?.role === 'ADMIN' ? '/admin/notifications' : '/notifications';
                                            navigate(`${baseUrl}/${notif.id}`);
                                        }}
                                        className={`group cursor-pointer transition-colors border-b border-slate-100 last:border-0 ${notif.isRead ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/20 hover:bg-blue-50/50'
                                            }`}
                                    >
                                        <TableCell className="px-4 py-2 text-center" onClick={(e) => toggleSelect(notif.id, e)}>
                                            <Checkbox
                                                checked={selectedIds.includes(notif.id)}
                                                onCheckedChange={() => { }}
                                            />
                                        </TableCell>
                                        <TableCell className="px-2 py-2 text-center">
                                            <div className="flex justify-center relative">
                                                {getIcon(notif.type)}
                                                {!notif.isRead && (
                                                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full border-2 border-white animate-pulse" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-2">
                                            <div className="flex flex-col leading-tight">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[11px] uppercase tracking-tight ${notif.isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                                                        {notif.title}
                                                    </span>
                                                    {!notif.isRead && <span className="text-[8px] bg-blue-600 text-white px-1 rounded-sm font-black italic">NEW</span>}
                                                </div>
                                                <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                                    {notif.message}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-right text-[10px] text-slate-400 font-medium font-mono">
                                            {formatDate(notif.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between px-2 pt-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {meta ? `Total ${meta.total} Data` : ''}
                </div>
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || isLoading}
                        className="h-7 w-7 p-0 rounded-md border-slate-200"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>

                    <div className="flex items-center gap-1">
                        {meta && [...Array(meta.totalPages)].map((_, i) => (
                            <Button
                                key={i + 1}
                                variant={currentPage === i + 1 ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setCurrentPage(i + 1)}
                                className={`h-7 min-w-[28px] px-1.5 rounded-md text-[10px] font-bold ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'text-slate-400'}`}
                            >
                                {i + 1}
                            </Button>
                        )).slice(Math.max(0, currentPage - 2), Math.min(meta?.totalPages || 0, currentPage + 1))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={!meta || currentPage === meta.totalPages || isLoading}
                        className="h-7 w-7 p-0 rounded-md border-slate-200"
                    >
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Konfirmasi Hapus</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            Apakah Anda yakin ingin menghapus <strong className="text-slate-900">{selectedIds.length}</strong> notifikasi yang dipilih? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-center gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                            className="flex-1 font-bold"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="flex-1 bg-red-600 hover:bg-red-700 font-bold"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menghapus...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Ya, Hapus
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}