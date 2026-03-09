import { useEffect, useState } from 'react';
import { useNews } from '@/hooks/useNews';
import { SafeImage } from '@/components/ui/SafeImage';
import { Calendar, Eye, ArrowRight, Search, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewsPage() {
    const { newsList, isLoading, fetchNews, meta } = useNews();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchNews(currentPage, search);
        }, 500);
        return () => clearTimeout(delay);
    }, [fetchNews, search, currentPage]);

    // Handler untuk reset page ke 1 saat mencari
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil((meta?.total || 0) / (meta?.limit || 10));

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* --- HEADER SECTION --- */}
            <div className="relative overflow-hidden bg-indigo-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-indigo-200 text-xs font-bold uppercase tracking-widest">
                        <Sparkles size={14} /> Berita Alumni
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Temukan Berita <br />Menarik Mendatang</h1>
                    <p className="text-indigo-100/80 font-medium">Jalin kembali silaturahmi dan tingkatkan skill profesional melalui berbagai kegiatan alumni.</p>

                    <div className="relative max-w-md pt-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
                        <Input
                            placeholder="Cari berita..."
                            className="h-14 pl-12 pr-6 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-indigo-300 focus-visible:ring-white/30 backdrop-blur-xl"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] right-[10%] w-60 h-60 bg-pink-500/20 rounded-full blur-3xl" />
            </div>

            {/* --- NEWS GRID --- */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-[2rem]" />
                    ))}
                </div>
            ) : newsList.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">Belum ada berita tersedia</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newsList.map((news) => (
                            <Link
                                to={`/news/${news.slug}`}
                                key={news.id_post}
                                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 border border-slate-50 flex flex-col"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <SafeImage
                                        src={news.thumbnail || ''}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            {news.kategori?.nama}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-1 space-y-3">
                                    <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={12} className="text-indigo-500" />
                                            {format(new Date(news.created_at), 'dd MMM yyyy', { locale: id })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye size={12} className="text-indigo-500" />
                                            {news.jumlah_view} Views
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {news.judul}
                                    </h3>
                                    <div
                                        className="text-slate-600 text-sm line-clamp-3 overflow-hidden"
                                        dangerouslySetInnerHTML={{ __html: news.konten }}
                                    />
                                    <div className="pt-4 flex items-center text-indigo-600 text-xs font-black uppercase tracking-widest gap-2 group-hover:opacity-100 transition-opacity -translate-x-2.5 group-hover:translate-x-0">
                                        Baca Selengkapnya <ArrowRight size={14} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* --- PAGINATION SECTION --- */}
                    {totalPages && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-10">
                            {/* Tombol Previous */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-xl border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={20} />
                            </Button>

                            {/* Nomor Halaman Dinamis */}
                            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                    // Logika sederhana untuk menyembunyikan nomor halaman jika terlalu banyak (optional)
                                    // Menampilkan hanya halaman di sekitar current page
                                    if (
                                        totalPages > 7 &&
                                        page !== 1 &&
                                        page !== totalPages &&
                                        Math.abs(page - currentPage) > 1
                                    ) {
                                        if (Math.abs(page - currentPage) === 2) return <span key={page} className="px-1 text-slate-300">...</span>;
                                        return null;
                                    }

                                    return (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "ghost"}
                                            size="sm"
                                            className={`min-w-10 h-10 rounded-xl font-black transition-all ${currentPage === page
                                                    ? "bg-indigo-600 shadow-lg shadow-indigo-100"
                                                    : "text-slate-500 hover:bg-slate-50"
                                                }`}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
                            </div>

                            {/* Tombol Next */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-xl border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}