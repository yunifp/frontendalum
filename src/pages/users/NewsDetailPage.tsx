 
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';
import { SafeImage } from '@/components/ui/SafeImage';
import { Calendar, Eye, ArrowLeft, Share2, Tag, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function NewsDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { singleNews, isLoading, fetchNewsDetail } = useNews();

    useEffect(() => {
        if (slug) fetchNewsDetail(slug);
    }, [slug, fetchNewsDetail]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Memuat Berita...</p>
        </div>
    );

    if (!singleNews) return null;

    const handleShare = async () => {
        // Format URL publik sesuai permintaan
        const publicUrl = `${window.location.origin}/berita/${singleNews.slug}`;
        const shareData = {
            title: singleNews.judul,
            text: `Halo! Cek berita menarik ini: ${singleNews.judul}`,
            url: publicUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(publicUrl);
                toast.success("Link berhasil disalin ke clipboard!");
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                toast.error("Gagal membagikan berita");
            }
        }
    };
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in slide-in-from-bottom-4 duration-700 px-4 md:px-0">
            {/* --- BACK BUTTON --- */}
            <Button
                variant="ghost"
                onClick={() => navigate('/news')}
                className="rounded-full hover:bg-white font-bold text-slate-500 hover:text-indigo-600 group transition-all"
            >
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Daftar Berita
            </Button>

            <article className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-50 min-w-0">
                {/* Hero Thumbnail */}
                <div className="aspect-video md:aspect-21/9 w-full relative bg-slate-100">
                    <SafeImage src={singleNews.thumbnail || ''} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                        <div className="flex flex-wrap gap-3 mb-4">
                            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600/90 backdrop-blur-md text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                                <Tag size={12} strokeWidth={3} /> {singleNews.kategori?.nama}
                            </div>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                            {singleNews.judul}
                        </h1>
                    </div>
                </div>

                <div className="p-6 md:p-12 space-y-8">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                            <div className="flex items-center gap-2.5 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                                    <Calendar size={18} />
                                </div>
                                {format(new Date(singleNews.created_at), 'EEEE, dd MMM yyyy', { locale: id })}
                            </div>
                            <div className="flex items-center gap-2.5 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                                    <Eye size={18} />
                                </div>
                                {singleNews.jumlah_view} <span className="hidden sm:inline">Pembaca</span>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleShare} className="rounded-2xl h-11 border-slate-100 text-slate-500 font-black uppercase tracking-widest text-[10px] px-6 hover:bg-slate-50 transition-all active:scale-95">
                            <Share2 size={16} className="mr-2" /> Bagikan
                        </Button>
                    </div>

                    {/* --- ARTICLE CONTENT (REFINED) --- */}
                    <div className="relative overflow-hidden">
                        <div
                            className="prose prose-slate prose-lg max-w-none 
                            prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                            prose-strong:text-slate-900 prose-strong:font-black
                            prose-img:rounded-[2.5rem] prose-img:shadow-xl prose-img:mx-auto
                            prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-3xl
                            /* SOLUSI TERPOTONG: */
                            break-words overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: singleNews.konten }}
                        />
                    </div>
                </div>
            </article>

            {/* Footer Article (Optional) */}
            <div className="bg-indigo-50/50 rounded-[2.5rem] p-8 text-center border border-indigo-100/50 shadow-sm shadow-indigo-100/20">
                <p className="text-xs font-black text-indigo-900 uppercase tracking-[0.2em] mb-4">Informasi Tambahan</p>
                <p className="text-sm text-indigo-600/80 font-medium max-w-md mx-auto">
                    Berita ini diterbitkan secara resmi melalui sistem Alumni Hub. Jika terdapat kekeliruan informasi, hubungi admin.
                </p>
            </div>
        </div>
    );
}