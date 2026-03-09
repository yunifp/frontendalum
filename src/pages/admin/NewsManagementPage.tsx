import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost } from '@/hooks/usePost';
import {
    Plus, Search, Edit2, Trash2,
    ImageIcon, Loader2, MoreHorizontal,
    Newspaper, ChevronLeft, ChevronRight,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { SafeImage } from '@/components/ui/SafeImage';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';

const NEWS_CATEGORY_ID = 1;

export default function NewsManagementPage() {
    const navigate = useNavigate();
    const { posts, fetchPosts, deletePost, isLoading } = usePost();
    const [search, setSearch] = useState('');
    
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

  
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        id: 0,
        title: '',
        thumbnail: ''
    });

    const loadData = async () => {
        await fetchPosts({
            kategoriId: NEWS_CATEGORY_ID,
            search: search
        });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadData();
            setCurrentPage(0);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const confirmDelete = async () => {
        await deletePost(deleteModal.id, deleteModal.thumbnail);
        setDeleteModal({ ...deleteModal, isOpen: false });
        loadData();
    };

    // Filtered & Paginated Data
    const pageCount = Math.ceil(posts.length / pageSize);
    const paginatedPosts = posts.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Berita</h1>
                    <p className="text-sm text-slate-500">Kelola artikel dan berita kampus terbaru untuk konsumsi publik.</p>
                </div>
                <Button
                    onClick={() => navigate('/admin/news/create')}
                    className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-2"
                >
                    <Plus className="w-4 h-4" /> Tambah Berita
                </Button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center px-3 border rounded-xl bg-white shadow-sm max-w-md focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                    placeholder="Cari judul berita..."
                    className="border-0 focus-visible:ring-0 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table Section */}
            <div className="border rounded-xl bg-white overflow-hidden shadow-sm border-slate-200">
                <Table>
                    <TableHeader className="bg-slate-50/80 backdrop-blur-sm">
                        <TableRow className="hover:bg-transparent border-b border-slate-200">
                            <TableHead className="h-12 px-4 text-center align-middle font-bold text-[11px] uppercase text-slate-600 w-20">
                                Info
                            </TableHead>
                            <TableHead className="h-12 px-4 text-left align-middle font-bold text-[11px] uppercase text-slate-600">
                                Konten Berita
                            </TableHead>
                            <TableHead className="h-12 px-4 text-left align-middle font-bold text-[11px] uppercase text-slate-600">
                                Tanggal Rilis
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
                                <TableCell colSpan={5} className="text-center py-20">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="animate-spin mx-auto text-indigo-600" />
                                        <p className="text-xs text-slate-400 font-medium tracking-wide">Memuat data berita...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : paginatedPosts.length > 0 ? (
                            paginatedPosts.map((post: any) => (
                                <TableRow key={post.id_post} className="group hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                                    <TableCell className="px-4 py-3 align-middle">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm mx-auto">
                                            {post.thumbnail ? (
                                                <SafeImage
                                                    src={post.thumbnail}
                                                    className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                                                    alt={post.judul}
                                                />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 align-middle">
                                        <div className="flex flex-col py-1">
                                            <span className="font-bold text-xs uppercase text-slate-900 line-clamp-1">{post.judul}</span>
                                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 uppercase tracking-tighter">ID: {post.id_post}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 align-middle text-xs text-slate-600 font-medium">
                                        {new Date(post.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 align-middle">
                                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${
                                            post.status === 'PUBLISHED' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                            : 'bg-orange-50 text-orange-600 border-orange-100'
                                        }`}>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 align-middle text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem 
                                                    onClick={() => navigate(`/admin/news/edit/${post.id_post}`, { state: { post } })}
                                                    className="cursor-pointer"
                                                >
                                                    <Edit2 className="w-4 h-4 mr-2 text-indigo-600" /> Ubah Berita
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => setDeleteModal({
                                                        isOpen: true,
                                                        id: post.id_post,
                                                        title: post.judul,
                                                        thumbnail: post.thumbnail
                                                    })}
                                                    className="cursor-pointer text-red-600 focus:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Hapus Permanen
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <div className="p-4 bg-slate-50 rounded-full">
                                            <Newspaper className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700">Tidak ada berita ditemukan</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Area */}
            <div className="flex items-center justify-between px-2 py-2 border-t pt-4">
                <div className="text-xs text-slate-500">Total {posts.length} berita</div>
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

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModal.isOpen} onOpenChange={(val) => !val && setDeleteModal({ ...deleteModal, isOpen: false })}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Hapus Berita?</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            Tindakan ini tidak dapat dibatalkan. Berita berjudul <strong className="text-slate-900">"{deleteModal.title}"</strong> akan dihapus secara permanen dari database.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex sm:justify-center gap-2 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                        >
                            Batal
                        </Button>
                        <Button
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            onClick={confirmDelete}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}