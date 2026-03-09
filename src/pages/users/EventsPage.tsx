import { useEffect, useState } from 'react';
import { useEvents } from '@/hooks/useEvents';
import { SafeImage } from '@/components/ui/SafeImage';
import { CalendarDays, MapPin, ArrowRight, Search, Sparkles, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EventsPage() {
    const { events, isLoading, fetchEvents, meta } = useEvents();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchEvents(currentPage, search);
        }, 500);
        return () => clearTimeout(delay);
    }, [fetchEvents, search, currentPage]);

    // Handler untuk reset page ke 1 saat mencari
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil((meta?.total || 0) / (meta?.limit || 9));

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* --- HERO HEADER --- */}
            <div className="relative overflow-hidden bg-indigo-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-indigo-200 text-xs font-bold uppercase tracking-widest">
                        <Sparkles size={14} /> Agenda Alumni
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">Temukan Event <br />Menarik Mendatang</h1>
                    <p className="text-indigo-100/80 font-medium">Jalin kembali silaturahmi dan tingkatkan skill profesional melalui berbagai kegiatan alumni.</p>

                    <div className="relative max-w-md pt-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
                        <Input
                            placeholder="Cari agenda event..."
                            className="h-14 pl-12 pr-6 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-indigo-300 focus-visible:ring-white/30 backdrop-blur-xl"
                            value={search}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] right-[10%] w-60 h-60 bg-pink-500/20 rounded-full blur-3xl" />
            </div>

            {/* --- EVENTS GRID --- */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-112.5 bg-slate-100 animate-pulse rounded-[2rem]" />
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <CalendarDays size={48} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold tracking-tight">Tidak ada event yang ditemukan</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((ev) => (
                            <Link
                                to={`/events/${ev.slug}`}
                                key={ev.id_post}
                                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <SafeImage
                                        src={ev.thumbnail || ''}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-6 left-6 bg-white rounded-2xl p-3 shadow-xl text-center min-w-15 border border-slate-50">
                                        <span className="block text-2xl font-black text-indigo-600 leading-none">
                                            {format(new Date(ev.tanggal_event || ev.created_at), 'dd')}
                                        </span>
                                        <span className="block text-[10px] font-black uppercase text-slate-400 mt-1">
                                            {format(new Date(ev.tanggal_event || ev.created_at), 'MMM')}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em]">
                                            <MapPin size={14} /> {ev.lokasi || 'Lokasi TBA'}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                                            <Clock size={14} className="text-indigo-400" /> {ev.waktu_event || '--:--'} WIB
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {ev.judul}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 font-medium leading-relaxed">
                                        Mari bergabung dalam keseruan acara ini bersama ribuan alumni lainnya dari berbagai angkatan.
                                    </p>
                                    <div className="pt-4 flex items-center justify-between">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{ev.jumlah_view} Dilihat</span>
                                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* --- PAGINATION SECTION --- */}
                    {totalPages && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-10 pb-10">
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