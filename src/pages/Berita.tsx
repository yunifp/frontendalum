import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SafeImage } from '@/components/ui/SafeImage';
import { useNews } from '@/hooks/useNews';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';

export default function Berita() {
    const [searchQuery, setSearchQuery] = useState('');
    const { newsList, isLoading, fetchNews } = useNews();

    useEffect(() => {
        fetchNews(1);
    }, [fetchNews]);

    const handleSearch = () => {
        fetchNews(1, searchQuery);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const getPublicImageUrl = (imageId?: string | null) => {
        if (!imageId) return 'https://placehold.co/600x400/ece8e1/3f3c39?text=Image+Not+Found';
        return imageId.replace('/view/', '/public/view/');
    };

    return (
        <div className="bg-[#FAF9F6] min-h-screen font-sans selection:bg-[#1e3a8a] selection:text-white text-stone-900">
            <Navbar />

            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 border-b border-stone-300">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

                <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                    <div className="flex items-center gap-3 justify-center mb-6">
                        <div className="h-[1px] w-12 bg-[#1e3a8a]"></div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1e3a8a]">Ruang Redaksi</span>
                        <div className="h-[1px] w-12 bg-[#1e3a8a]"></div>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-serif text-stone-900 leading-[1.1] tracking-tight">
                        Warta Kampus & <br className="hidden sm:block" />
                        <span className="italic text-stone-600">Jejaring Alumni</span>
                    </h1>

                    <p className="text-stone-600 text-lg md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed border-x border-stone-300 px-6">
                        "Menyelisik kabar terkini, liputan eksklusif, dan cerita inspiratif dari ekosistem kampus serta rekam jejak alumni di seluruh penjuru dunia."
                    </p>

                    <div className="max-w-xl mx-auto pt-8">
                        <div className="relative flex p-1 bg-white border border-stone-900 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)] focus-within:shadow-[2px_2px_0px_0px_rgba(28,25,23,1)] focus-within:translate-x-[2px] focus-within:translate-y-[2px] transition-all">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />

                            {/* 4. Hubungkan Input dengan state */}
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Cari rubrik atau artikel..."
                                className="h-12 pl-12 pr-4 rounded-none border-none shadow-none focus-visible:ring-0 w-full font-serif text-stone-900 placeholder:text-stone-400 focus-visible:outline-none bg-transparent"
                            />

                            {/* 5. Tambahkan onClick pada Button */}
                            <Button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="rounded-none px-8 h-12 bg-stone-900 hover:bg-[#1e3a8a] text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors"
                            >
                                {isLoading ? '...' : 'Cari'}
                            </Button>
                        </div>
                    </div>

                </div>
            </section>

            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="flex flex-col border-t border-stone-300 pt-6">
                                    <div className="h-64 bg-stone-200 animate-pulse border border-stone-300 mb-6" />
                                    <div className="h-4 w-1/4 bg-stone-200 animate-pulse mb-4" />
                                    <div className="h-8 w-full bg-stone-200 animate-pulse mb-2" />
                                    <div className="h-8 w-3/4 bg-stone-200 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : newsList.length === 0 ? (
                        <div className="text-center py-32 bg-[#FAF9F6] border-y border-stone-300 relative">
                            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-stone-200 -translate-x-1/2 hidden md:block"></div>
                            <div className="relative z-10 bg-[#FAF9F6] inline-block px-8">
                                <Bookmark size={40} className="mx-auto text-stone-300 mb-6" strokeWidth={1} />
                                <h3 className="text-3xl font-serif text-stone-900 tracking-tight mb-4">Belum Ada Terbitan</h3>
                                <p className="text-stone-500 font-serif italic max-w-sm mx-auto">Mesin cetak kami sedang menyiapkan rubrik terbaru. Silakan kembali untuk edisi selanjutnya.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                            {newsList.map((news) => (
                                <Link to={`/berita/${news.slug}`} key={news.id_post} className="group flex flex-col pt-6 border-t-2 border-transparent hover:border-[#1e3a8a] transition-all duration-500 relative">                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-stone-300 group-hover:bg-transparent transition-colors"></div>

                                    <div className="h-64 overflow-hidden relative bg-stone-200 border border-stone-300 mb-6">
                                        <SafeImage
                                            src={getPublicImageUrl(news.thumbnail)}
                                            alt={news.judul}
                                            className="w-full h-full object-cover grayscale sepia-[.2] opacity-90 group-hover:grayscale-0 group-hover:sepia-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                                        />

                                        <div className="absolute top-4 left-4">
                                            <span className="bg-[#FAF9F6] text-stone-900 font-bold uppercase text-[9px] tracking-[0.2em] px-3 py-1.5 border border-stone-900 shadow-[2px_2px_0px_0px_rgba(28,25,23,1)]">
                                                {news.kategori?.nama || 'Editorial'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                                            <span>{format(new Date(news.created_at), 'dd MMM yyyy', { locale: id })}</span>
                                            <div className="w-1 h-1 bg-[#1e3a8a] rounded-full"></div>
                                            <span>Redaksi</span>
                                        </div>

                                        <h3 className="text-2xl font-serif font-medium text-stone-900 leading-snug line-clamp-3 group-hover:text-[#1e3a8a] transition-colors flex-1 mb-6">
                                            {news.judul}
                                        </h3>

                                        <div className="flex items-center text-stone-900 font-bold text-[10px] uppercase tracking-[0.2em] gap-2 pt-4 border-t border-stone-200 group-hover:text-[#1e3a8a] transition-colors mt-auto">
                                            Baca Artikel <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {!isLoading && newsList.length > 0 && (
                        <div className="mt-24 text-center border-t border-stone-300 pt-16">
                            <Button variant="outline" className="rounded-none border-stone-900 text-stone-900 bg-transparent hover:bg-stone-900 hover:text-[#FAF9F6] font-bold text-[10px] uppercase tracking-[0.2em] h-14 px-12 transition-all duration-300">
                                Muat Halaman Berikutnya
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}