import { Link } from 'react-router-dom';
import { GraduationCap, Instagram, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#FAF9F6] border-t border-stone-300 pt-24 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-4 gap-16 mb-24">
          
          <div className="col-span-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="border border-stone-900 p-2.5 rounded-none text-[#1e3a8a]">
                <GraduationCap size={32} strokeWidth={1.5} />
              </div>
              <span className="font-serif text-3xl font-medium tracking-tight text-stone-900 uppercase">
                IKATAN ALUMNI ITB<span className="text-[#1e3a8a] italic">.</span>
              </span>
            </div>
            <p className="text-stone-600 max-w-sm font-serif text-lg leading-relaxed italic border-l border-stone-300 pl-4">
              "Menghubungkan masa lalu, membangun masa depan, memberdayakan almamater lintas generasi."
            </p>
          </div>

          <div className="space-y-6 text-center sm:text-left">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em]">Direct Links</h4>
            <ul className="space-y-4 font-bold text-stone-800 text-xs">
              <li><Link to="/home" className="hover:text-[#1e3a8a] transition-colors uppercase tracking-[0.2em]">Beranda</Link></li>
              <li><Link to="/news" className="hover:text-[#1e3a8a] transition-colors uppercase tracking-[0.2em]">Warta Kampus</Link></li>
              <li><Link to="/events" className="hover:text-[#1e3a8a] transition-colors uppercase tracking-[0.2em]">Agenda Event</Link></li>
            </ul>
          </div>

          <div className="space-y-6 text-center sm:text-left">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em]">Support</h4>
            <ul className="space-y-4 font-bold text-stone-800 text-xs">
              <li><Link to="/faq" className="hover:text-[#1e3a8a] transition-colors uppercase tracking-[0.2em]">Pusat Bantuan</Link></li>
              <li><Link to="/contact" className="hover:text-[#1e3a8a] transition-colors uppercase tracking-[0.2em]">Kontak</Link></li>
              <li><Link to="/policy" className="hover:text-[#1e3a8a] transition-colors uppercase tracking-[0.2em]">Privasi</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-300 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} IKATAN ALUMNI ITB.
          </p>
          <div className="flex gap-8">
            <Instagram size={18} className="text-stone-400 hover:text-[#1e3a8a] cursor-pointer transition-colors" />
            <Linkedin size={18} className="text-stone-400 hover:text-[#1e3a8a] cursor-pointer transition-colors" />
            <Globe size={18} className="text-stone-400 hover:text-[#1e3a8a] cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;