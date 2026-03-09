import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';
import { SafeImage } from '@/components/ui/SafeImage';
import { Calendar, Eye, ArrowLeft, Share2, Loader2, Bookmark } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function BeritaDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { singleNews, isLoading, fetchNewsDetail } = useNews();

    const getPublicImageUrl = (imageId?: string | null) => {
        if (!imageId) return 'https://placehold.co/1200x600/ece8e1/3f3c39?text=Gambar+Tidak+Tersedia';
        return imageId.replace('/view/', '/public/view/');
    };

    useEffect(() => {
        if (slug) fetchNewsDetail(slug);
    }, [slug, fetchNewsDetail]);

    if (isLoading) {
        return (
            <div className="bg-[#FAF9F6] min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#1e3a8a] w-10 h-10" />
            </div>
        );
    }

    if (!singleNews) return null;

    return (
        <div className="bg-[#FAF9F6] min-h-screen font-sans selection:bg-[#1e3a8a] selection:text-white text-stone-900">
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

            <Navbar />

            <main className="pt-32 pb-24 px-6 relative z-10 border-b border-stone-300">
                <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">

                    <div className="mb-12 border-b border-stone-300 pb-4">
                        <button
                            onClick={() => navigate('/berita')}
                            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-[#1e3a8a] transition-colors"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Ruang Redaksi
                        </button>
                    </div>

                    <article>
                        <header className="text-center max-w-4xl mx-auto mb-12 space-y-8">
                            <div className="flex items-center gap-3 justify-center">
                                <div className="h-[1px] w-8 bg-[#1e3a8a]"></div>
                                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1e3a8a]">
                                    <Bookmark size={12} />
                                    {singleNews.kategori?.nama || 'Laporan Utama'}
                                </span>
                                <div className="h-[1px] w-8 bg-[#1e3a8a]"></div>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-medium text-stone-900 leading-[1.1] tracking-tight">
                                {singleNews.judul}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 pt-4">
                                <span className="flex items-center gap-2">
                                    <Calendar size={12} className="text-stone-400" />
                                    {format(new Date(singleNews.created_at), 'EEEE, dd MMMM yyyy', { locale: id })}
                                </span>
                                <div className="hidden sm:block w-1 h-1 bg-[#1e3a8a] rounded-full"></div>
                                <span className="flex items-center gap-2">
                                    <Eye size={12} className="text-stone-400" />
                                    Edisi Dibaca {singleNews.jumlah_view} Kali
                                </span>
                            </div>
                        </header>

                        <div className="aspect-video w-full border border-stone-900 bg-stone-200 mb-16 relative overflow-hidden group shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
                            <SafeImage
                                src={getPublicImageUrl(singleNews.thumbnail)}
                                alt={singleNews.judul}
                                className="w-full h-full object-cover grayscale sepia-[.3] contrast-125 opacity-90 group-hover:grayscale-0 group-hover:sepia-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                            />
                            <div className="absolute inset-2 border border-white/20 pointer-events-none"></div>
                        </div>

                        <div className="max-w-3xl mx-auto relative">
                            <div className="absolute -left-16 top-0 hidden lg:block text-[#1e3a8a] opacity-20">
                                <span className="text-9xl font-serif leading-none">"</span>
                            </div>

                            <div
                                className="prose prose-stone lg:prose-lg max-w-none
                                prose-headings:font-serif
                                prose-headings:tracking-tight
                                prose-headings:text-stone-900

                                prose-p:text-stone-700
                                prose-p:leading-loose
                                prose-p:text-justify

                                prose-a:text-blue-800
                                prose-a:no-underline
                                hover:prose-a:underline

                                prose-img:rounded-md
                                prose-img:shadow-md
                                prose-img:max-w-full

                                prose-blockquote:border-l-4
                                prose-blockquote:border-blue-800
                                prose-blockquote:italic
                                prose-blockquote:text-stone-600
                                prose-blockquote:bg-stone-100
                                prose-blockquote:py-2
                                prose-blockquote:px-4

                                prose-pre:overflow-x-auto
                                break-words"
                                dangerouslySetInnerHTML={{ __html: singleNews.konten }}
                            />
                        </div>

                        <div className="max-w-3xl mx-auto mt-20 pt-8 border-t-2 border-stone-900 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <span className="font-bold uppercase tracking-[0.3em] text-[9px] text-stone-500">
                                Akhir dari Lembaran
                            </span>
                            <Button
                                variant="outline"
                                className="rounded-none border-stone-900 text-stone-900 bg-transparent hover:bg-[#1e3a8a] hover:text-[#FAF9F6] hover:border-[#1e3a8a] font-bold text-[10px] uppercase tracking-[0.2em] px-8 h-12 transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                            >
                                <Share2 size={14} className="mr-3" /> Bagikan Lembaran
                            </Button>
                        </div>

                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}