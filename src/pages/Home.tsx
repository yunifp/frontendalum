import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Globe,
  CheckCircle2, Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNews } from '@/hooks/useNews';
import { useEvents } from '@/hooks/useEvents';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import hero1 from '../assets/hero1.jpeg';
import hero2 from '../assets/hero2.jpg';
import MapSection from '@/components/home/MapSection';

export default function Home() {
  const { newsList, isLoading: newsLoading, fetchNews } = useNews();
  const { events, isLoading: eventsLoading, fetchEvents } = useEvents();

  useEffect(() => {
    fetchNews(1);
    fetchEvents(1);
  }, [fetchNews, fetchEvents]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-stone-900 font-sans selection:bg-[#1e3a8a] selection:text-white">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-stone-300">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative">
          <div className="lg:col-span-6 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 z-10">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-[#1e3a8a]"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1e3a8a]">The Alumni Chronicle</span>
            </div>

            <h1 className="text-6xl lg:text-[5.5rem] font-serif font-medium text-stone-900 leading-[1] tracking-tight">
              Jejaring Alumni ITB. <br />
              <span className="italic text-stone-600">Kolaborasi Tanpa Batas.</span>
            </h1>

            <p className="text-stone-600 text-lg font-serif italic max-w-md leading-relaxed border-l-2 border-stone-300 pl-6 my-8">
              "Platform resmi komunitas alumni ITB untuk membangun jejaring profesional,
              berbagi pengetahuan, serta menciptakan kolaborasi lintas generasi di seluruh dunia."
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link to="/register">
                <Button className="w-full sm:w-auto h-14 px-10 rounded-none bg-stone-900 hover:bg-[#1e3a8a] text-white font-bold tracking-widest uppercase text-xs transition-colors duration-500 group">
                  Mulai Bergabung <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/berita">
                <Button variant="ghost" className="w-full sm:w-auto h-14 px-8 rounded-none font-bold text-stone-600 border border-stone-300 hover:border-[#1e3a8a] hover:text-[#1e3a8a] hover:bg-transparent transition-all tracking-widest uppercase text-xs">
                  Berita Terbaru
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative animate-in fade-in slide-in-from-right-12 duration-1000">
            <div className="grid grid-cols-2 gap-4 h-[500px] lg:h-[600px]">
              <div className="bg-stone-200 overflow-hidden group border border-stone-300">
                <img src={hero1} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt="Students" />
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-[#1e3a8a] p-8 text-[#FAF9F6] flex flex-col justify-between h-1/2 border border-[#172e6e]">
                  <Bookmark size={24} className="opacity-50" />
                  <div>
                    <h3 className="font-serif text-3xl font-medium leading-tight mb-2">5,000+</h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Alumni Aktif</p>
                  </div>
                </div>

                <div className="bg-stone-900 overflow-hidden group h-1/2 border border-stone-300">
                  <img src={hero2} className="w-full h-full object-cover sepia-[.5] opacity-80 group-hover:sepia-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" alt="Graduation" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-b border-stone-300 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16">

            <div className="lg:col-span-5 space-y-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1e3a8a]">Bab I &mdash; The Hub</span>
              <h2 className="text-4xl lg:text-5xl font-serif text-stone-900 leading-tight">
                Lebih dari Sekadar <br /> Database, <span className="italic">Ini Adalah Warisan.</span>
              </h2>
              <p className="text-stone-600 font-serif text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-[#1e3a8a] first-letter:mr-1 first-letter:float-left">
                Alumni Hub didirikan dengan misi mulia untuk menjembatani jarak antara dunia akademik yang idealis dan lanskap profesional yang dinamis. Kami merawat relasi.
              </p>

              <ul className="flex flex-col gap-4 pt-4 border-t border-stone-300">
                {['Akses Lowongan Kerja Eksklusif', 'Mentoring Lintas Angkatan', 'Jejaring Skala Internasional'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-stone-800 font-sans text-sm tracking-wide uppercase font-semibold">
                    <CheckCircle2 size={16} className="text-[#1e3a8a]" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8">
              <div className="space-y-8 mt-12">
                <div className="group border-t-2 border-stone-900 pt-6">
                  <span className="text-5xl font-serif text-stone-300 group-hover:text-[#1e3a8a] transition-colors duration-500 block mb-4">01.</span>
                  <h4 className="font-bold text-stone-900 uppercase text-xs tracking-[0.2em] mb-3">Visi Kami</h4>
                  <p className="text-stone-600 font-serif leading-relaxed">Menjadi episentrum kolaborasi alumni paling berpengaruh, menciptakan pemimpin masa depan dari akar almamater.</p>
                </div>
                <div className="group border-t border-stone-300 pt-6">
                  <span className="text-5xl font-serif text-stone-300 group-hover:text-[#1e3a8a] transition-colors duration-500 block mb-4">02.</span>
                  <h4 className="font-bold text-stone-900 uppercase text-xs tracking-[0.2em] mb-3">Solidaritas</h4>
                  <p className="text-stone-600 font-serif leading-relaxed">Membangun komunitas berkelanjutan yang tidak lekang oleh waktu, saling menopang dalam setiap fase karir.</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="group border-t border-stone-300 pt-6">
                  <span className="text-5xl font-serif text-stone-300 group-hover:text-[#1e3a8a] transition-colors duration-500 block mb-4">03.</span>
                  <h4 className="font-bold text-stone-900 uppercase text-xs tracking-[0.2em] mb-3">Misi Mendasar</h4>
                  <p className="text-stone-600 font-serif leading-relaxed">Memberdayakan setiap individu melalui pemanfaatan teknologi jaringan profesional yang mutakhir namun tetap membumi.</p>
                </div>
                <div className="group border-t border-stone-300 pt-6">
                  <span className="text-5xl font-serif text-stone-300 group-hover:text-[#1e3a8a] transition-colors duration-500 block mb-4">04.</span>
                  <h4 className="font-bold text-stone-900 uppercase text-xs tracking-[0.2em] mb-3">Inovasi Terus Menerus</h4>
                  <p className="text-stone-600 font-serif leading-relaxed">Menghadirkan rubrik, fitur, dan dukungan modern yang responsif terhadap perubahan lanskap industri global.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FAF9F6] border-b border-stone-300">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-stone-300 -translate-x-1/2"></div>
          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 tracking-tight">Upcoming events</h2>
              <div className="h-[1px] flex-1 bg-stone-300 mt-2"></div>
            </div>

            <div className="flex flex-col gap-4">
              {eventsLoading ? (
                [1, 2, 3].map(i => <div key={i} className="h-32 border border-stone-200 animate-pulse bg-stone-100" />)
              ) : (
                events.slice(0, 3).map((event) => {
                  // Gunakan tanggal_event dari response API, fallback ke created_at atau hari ini
                  const eventDate = new Date(event.tanggal_event || event.created_at || new Date());

                  return (
                    <Link to={`/acara/${event.slug}`} key={event.id_post}>
                      <div className="group bg-[#FAF9F6] border border-stone-300 p-6 flex gap-6 hover:bg-white hover:border-[#1e3a8a] transition-all duration-500 relative">
                        <div className="absolute top-0 left-0 w-0 h-[2px] bg-[#1e3a8a] transition-all duration-500 group-hover:w-full"></div>

                        {/* BOX TANGGAL JIR */}
                        <div className="flex flex-col text-center w-14 shrink-0 mt-1">
                          {/* Ini buat Singkatan BULAN (Jan, Feb, dsb) */}
                          <span className="text-sm font-bold text-[#1e3a8a] uppercase tracking-widest font-sans">
                            {format(eventDate, 'MMM', { locale: id })}
                          </span>

                          {/* Ini buat ANGKA TANGGAL (01, 02, dsb) */}
                          <span className="text-[2.5rem] font-serif text-[#1e3a8a] leading-none mt-1 group-hover:scale-110 transition-transform duration-500">
                            {format(eventDate, 'dd', { locale: id })}
                          </span>
                        </div>

                        <div className="flex flex-col justify-center border-l border-stone-200 pl-6">
                          <h3 className="text-lg font-bold font-serif text-stone-900 leading-snug mb-2 group-hover:text-[#1e3a8a] transition-colors duration-300">
                            {event.judul}
                          </h3>
                          <p className="text-[11px] font-sans text-stone-500 uppercase tracking-wider font-semibold">
                            {/* Format Full: Hari, Tanggal Bulan, Jam */}
                            {format(eventDate, 'EEEE, d MMMM, HH:mm', { locale: id })} WIB
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            <div className="mt-10 flex flex-col gap-8">
              <Link to="/events" className="text-sm font-bold font-sans text-[#1e3a8a] hover:text-stone-900 flex items-center gap-2 transition-colors uppercase tracking-widest">
                View more events <ArrowRight size={14} />
              </Link>
              <div className="flex flex-wrap items-center gap-8 text-xs font-bold font-sans text-stone-900">
                <Link to="/academic-calendar" className="group flex items-center gap-3 uppercase tracking-[0.2em] transition-all">
                  Academic Calendar
                  <div className="bg-[#1e3a8a] text-white p-1 rounded-none group-hover:bg-stone-900 transition-colors">
                    <ArrowRight size={14} />
                  </div>
                </Link>
                <Link to="/athletic-schedule" className="group flex items-center gap-3 uppercase tracking-[0.2em] transition-all">
                  Athletic Schedule
                  <div className="bg-[#1e3a8a] text-white p-1 rounded-none group-hover:bg-stone-900 transition-colors">
                    <ArrowRight size={14} />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 tracking-tight">News & stories</h2>
              <div className="h-[1px] flex-1 bg-stone-300 mt-2"></div>
            </div>

            <div className="flex flex-col">
              {newsLoading ? (
                [1, 2, 3].map(i => <div key={i} className="h-28 border-t border-stone-200 animate-pulse bg-stone-100" />)
              ) : (
                newsList.slice(0, 3).map((news, idx) => (
                  <Link to={`/berita/${news.slug}`} key={news.id_post} className={`block group py-7 border-t border-stone-300 relative transition-all duration-500 hover:bg-white hover:px-4 hover:-mx-4 ${idx === 2 ? 'border-b' : ''}`}>
                    <h3 className="text-xl lg:text-2xl font-serif text-stone-900 leading-snug mb-3 group-hover:text-[#1e3a8a] transition-colors">
                      {news.judul}
                    </h3>
                    <p className="text-[13px] font-sans text-stone-500 mb-4 font-medium tracking-wide">
                      {format(new Date(news.created_at), 'MMMM dd, yyyy', { locale: id })}
                    </p>
                    <p className="text-[10px] font-bold font-sans text-stone-800 uppercase tracking-[0.2em]">
                      {news.kategori?.nama || 'NEWSROOM'}
                    </p>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-10">
              <Link to="/news" className="text-sm font-bold font-sans text-[#1e3a8a] hover:text-stone-900 flex items-center gap-2 transition-colors uppercase tracking-widest">
                View more news & stories <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* <section className="py-24 bg-stone-900 text-[#FAF9F6] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-8">
            <Compass size={40} className="text-[#3b82f6]" strokeWidth={1.5} />
            <div className="space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Global Coverage</span>
              <h2 className="text-4xl lg:text-5xl font-serif tracking-tight leading-tight">
                Jejak Kami <br /><span className="italic text-stone-400">Di Peta Dunia.</span>
              </h2>
              <p className="text-stone-400 font-serif text-lg leading-relaxed">
                Menyebar luas layaknya tinta di atas perkamen. Alumni hub hadir mewarnai industri di seluruh penjuru benua.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 border-t border-stone-700 pt-8">
              <div>
                <p className="text-4xl font-serif text-[#FAF9F6]">34<span className="text-[#3b82f6]">+</span></p>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mt-2">Provinsi</p>
              </div>
              <div>
                <p className="text-4xl font-serif text-[#FAF9F6]">12<span className="text-[#3b82f6]">+</span></p>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mt-2">Negara</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border p-2 border-stone-700 bg-stone-800">
              <div className="aspect-video w-full bg-stone-900 relative border border-stone-700 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000" className="w-full h-full object-cover sepia-[.8] contrast-125 opacity-40 mix-blend-luminosity" alt="Vintage World Map" />
                
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-[#3b82f6] rounded-full animate-pulse ring-4 ring-[#3b82f6]/20" />
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#1e3a8a] rounded-full animate-pulse ring-4 ring-[#1e3a8a]/20" />
                <div className="absolute top-1/3 left-2/3 w-2 h-2 bg-amber-600 rounded-full animate-pulse ring-4 ring-amber-600/20" />
                <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-[#3b82f6] rounded-full animate-pulse ring-4 ring-[#3b82f6]/20" />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <MapSection />

      <section className="py-32 bg-[#1e3a8a] relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stucco.png")' }}></div>
        <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
          <Globe size={48} className="mx-auto text-white/50" strokeWidth={1} />
          <h2 className="text-5xl lg:text-7xl font-serif text-[#FAF9F6] leading-[1.1] tracking-tight">
            Bagian Dari Sejarah. <br />
            <span className="italic font-light">Mulai Lembaran Baru.</span>
          </h2>
          <p className="text-blue-100/80 font-serif text-xl max-w-2xl mx-auto">
            Jangan lewatkan kesempatan untuk menulis ulang narasi karir Anda bersama keluarga besar almamater.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register">
              <Button className="h-16 px-12 rounded-none bg-[#FAF9F6] text-[#1e3a8a] hover:bg-stone-900 hover:text-white font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500">
                Daftar Sekarang
              </Button>
            </Link>
            <Link to="/login">
              <Button className="h-16 px-12 rounded-none bg-transparent text-[#FAF9F6] hover:bg-[#FAF9F6] hover:text-[#1e3a8a] font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500 border border-[#FAF9F6]">
                Masuk Akun
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}