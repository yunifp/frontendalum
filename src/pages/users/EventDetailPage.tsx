
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '@/hooks/useEvents';
import { SafeImage } from '@/components/ui/SafeImage';
import { Calendar, Clock, MapPin, ArrowLeft, Share2, Info, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function EventDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { singleEvent, isLoading, fetchEventDetail } = useEvents();

    useEffect(() => {
        if (slug) fetchEventDetail(slug);
    }, [slug, fetchEventDetail]);

    if (isLoading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" /></div>;
    if (!singleEvent) return null;

    const handleShare = async () => {
        // Format URL publik sesuai permintaan
        const publicUrl = `${window.location.origin}/acara/${singleEvent.slug}`;
        const shareData = {
            title: singleEvent.judul,
            text: `Halo! Cek event menarik ini: ${singleEvent.judul}`,
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
                toast.error("Gagal membagikan event");
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 px-4 md:px-0">
            <Button variant="ghost" onClick={() => navigate('/events')} className="rounded-full hover:bg-white text-slate-500 font-bold group">
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Jelajah Event
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Content */}
                <div className="lg:col-span-2 space-y-8 min-w-0"> {/* min-w-0 penting untuk mencegah flex item melebar */}
                    <div className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm">
                        <div className="aspect-video relative">
                            <SafeImage src={singleEvent.thumbnail || ''} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-8 md:p-12 space-y-6">
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight break-words">
                                {singleEvent.judul}
                            </h1>

                            {/* Perbaikan Konten: break-words mencegah teks/link panjang merusak layout */}
                            <div
                                className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-p:text-slate-600 prose-strong:text-slate-900 break-words overflow-hidden"
                                dangerouslySetInnerHTML={{ __html: singleEvent.konten }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Info (Sesuai kolom baru di database) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm sticky top-24">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-8 flex items-center gap-2">
                            <Info size={14} strokeWidth={3} /> Detail Informasi
                        </h4>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                    <Calendar size={22} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tanggal</p>
                                    <p className="text-slate-900 font-bold text-sm">
                                        {singleEvent.tanggal_event
                                            ? format(new Date(singleEvent.tanggal_event), 'EEEE, dd MMM yyyy', { locale: id })
                                            : 'Segera Hadir'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                                    <MapPin size={22} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lokasi</p>
                                    <p className="text-slate-900 font-bold text-sm leading-snug">
                                        {singleEvent.lokasi || 'Lokasi menyusul'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                    <Clock size={22} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waktu</p>
                                    <p className="text-slate-900 font-bold text-sm uppercase">
                                        {singleEvent.waktu_event || '-- : --'} WIB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50 space-y-3">
                            {singleEvent.cta_link && (
                                <a
                                    href={singleEvent.cta_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center justify-center w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-200 transition-all duration-300 active:scale-[0.98] overflow-hidden"
                                >
                                    {/* Layer Efek Hover Glossy */}
                                    <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                                    <div className="relative flex items-center gap-2">
                                        <span className="uppercase tracking-[0.15em] text-[11px]">
                                            {singleEvent.cta_label || singleEvent.cta_text || 'Ikuti Event Ini'}
                                        </span>
                                        <ArrowRight size={16} className="-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                </a>
                            )}
                            <Button
                                variant="outline"
                                className="w-full h-14 rounded-2xl border-slate-100 font-bold text-slate-500 hover:bg-slate-50 active:scale-95 transition-all"
                                onClick={handleShare}
                            >
                                <Share2 size={18} className="mr-2" /> Bagikan Event
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}