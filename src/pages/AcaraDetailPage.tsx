import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';
import { SafeImage } from '@/components/ui/SafeImage';
import { ArrowLeft, Share2, Bookmark, Loader2, Calendar, MapPin, Clock, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';

import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function AcaraDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { singleEvent, isLoading, fetchEventDetail } = useEvents();

    const getPublicImageUrl = (imageId?: string | null) => {
        if (!imageId) return 'https://placehold.co/1200x600/ece8e1/3f3c39?text=Gambar+Tidak+Tersedia';
        return imageId.replace('/view/', '/public/view/');
    };

    useEffect(() => {
        if (slug) fetchEventDetail(slug);
    }, [slug, fetchEventDetail]);

    const handleShare = async () => {
        const publicUrl = `${window.location.origin}/acara/${singleEvent.slug}`;
        const shareData = {
            title: singleEvent.judul,
            text: `Agenda Akademik: ${singleEvent.judul}`,
            url: publicUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(publicUrl);
                toast.success("Tautan berhasil disalin ke papan klip!");
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name !== 'AbortError') {
                    toast.error("Gagal membagikan event");
                }
            } else {
                toast.error("Terjadi kesalahan yang tidak terduga");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="bg-[#FAF9F6] min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#1e3a8a] w-10 h-10" />
            </div>
        );
    }

    if (!singleEvent) return null;

    return (
        <div className="bg-[#FAF9F6] min-h-screen font-sans selection:bg-[#1e3a8a] selection:text-white text-stone-900">
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

            <Navbar />

            <main className="pt-32 pb-24 px-6 relative z-10">
                <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">

                    {/* Breadcrumb / Back */}
                    <div className="mb-12 border-b border-stone-300 pb-4">
                        <button
                            onClick={() => navigate('/acara')}
                            className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-[#1e3a8a] transition-colors"
                        >
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Kalender Akademik
                        </button>
                    </div>

                    {/* Header Title */}
                    <header className="text-center max-w-4xl mx-auto mb-16 space-y-6">
                        <div className="flex items-center gap-3 justify-center">
                            <div className="h-[1px] w-8 bg-[#1e3a8a]"></div>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1e3a8a]">
                                <Bookmark size={12} />
                                Warta Kampus
                            </span>
                            <div className="h-[1px] w-8 bg-[#1e3a8a]"></div>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-stone-900 leading-[1.1] tracking-tight">
                            {singleEvent.judul}
                        </h1>
                    </header>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                        {/* LEFT COLUMN: Article */}
                        <div className="lg:col-span-8 space-y-12">
                            <div className="aspect-video w-full border border-stone-900 bg-stone-200 relative overflow-hidden group shadow-[6px_6px_0px_0px_rgba(28,25,23,1)]">
                                <SafeImage
                                    src={getPublicImageUrl(singleEvent.thumbnail)}
                                    alt={singleEvent.judul}
                                    className="w-full h-full object-cover grayscale sepia-[.3] contrast-125 opacity-90 group-hover:grayscale-0 group-hover:sepia-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                                />
                            </div>

                            <div
                                className="prose prose-stone lg:prose-lg max-w-none 
                                prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-stone-900
                                prose-p:text-stone-700 prose-p:leading-relaxed prose-p:text-justify
                                prose-blockquote:border-l-4 prose-blockquote:border-[#1e3a8a] prose-blockquote:bg-stone-100/50
                                break-words"
                                dangerouslySetInnerHTML={{ __html: singleEvent.konten }}
                            />
                        </div>

                        {/* RIGHT COLUMN: Sidebar Info */}
                        <div className="lg:col-span-4 sticky top-28 space-y-6">
                            <div className="border-2 border-stone-900 p-8 bg-white shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]">
                                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1e3a8a] mb-8 flex items-center gap-2 border-b border-stone-100 pb-4">
                                    <Info size={14} /> Logistik Agenda
                                </h4>

                                <div className="space-y-8">
                                    {/* Tanggal */}
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 border border-stone-200 flex items-center justify-center text-stone-600 shrink-0">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Tanggal</p>
                                            <p className="text-stone-900 font-serif font-bold text-sm">
                                                {singleEvent.tanggal_event
                                                    ? format(new Date(singleEvent.tanggal_event), 'EEEE, dd MMMM yyyy', { locale: id })
                                                    : 'Segera Diumumkan'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Lokasi */}
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 border border-stone-200 flex items-center justify-center text-stone-600 shrink-0">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Lokasi</p>
                                            <p className="text-stone-900 font-serif font-bold text-sm leading-snug">
                                                {singleEvent.lokasi || 'Informasi Menyusul'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Waktu */}
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 border border-stone-200 flex items-center justify-center text-stone-600 shrink-0">
                                            <Clock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Waktu</p>
                                            <p className="text-stone-900 font-serif font-bold text-sm">
                                                {singleEvent.waktu_event ? `${singleEvent.waktu_event} WIB` : '--:-- WIB'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-8 border-t border-stone-200 space-y-4">
                                    {singleEvent.cta_link && (
                                        <a
                                            href={singleEvent.cta_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-3 w-full h-12 bg-[#1e3a8a] text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-stone-900 transition-colors shadow-[3px_3px_0px_0px_rgba(168,162,158,0.5)]"
                                        >
                                            {singleEvent.cta_label || 'Registrasi Sekarang'}
                                            <ArrowRight size={14} />
                                        </a>
                                    )}

                                    <Button
                                        variant="outline"
                                        onClick={handleShare}
                                        className="w-full h-12 rounded-none border-stone-900 text-stone-900 bg-transparent hover:bg-stone-50 font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
                                    >
                                        <Share2 size={14} className="mr-3" /> Bagikan Lembaran
                                    </Button>
                                </div>
                            </div>

                            <p className="text-[10px] text-stone-400 italic text-center px-4">
                                * Pastikan Anda melakukan konfirmasi kehadiran sesuai dengan tenggat waktu yang ditentukan.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}