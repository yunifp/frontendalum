import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import logoheader from '../../assets/logo.png';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Beranda', path: '/home' },
    { label: 'Berita', path: '/berita' },
    { label: 'Event', path: '/acara' }
  ];

  const dashboardPath = user?.role?.includes('ADMIN') ? '/admin' : '/profile';

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-t-[6px] border-t-[#1e3a8a] font-sans ${
        isScrolled ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-sm border-b border-stone-300 py-3' : 'bg-[#FAF9F6] py-5 border-b border-stone-200'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20  flex items-center justify-between">
        <div className="flex items-center flex-shrink-0">
          <Link to="/home" className="group">
            <img
              src={logoheader}
              alt="Logo"
              className="h-10 lg:h-20 w-auto object-contain mix-blend-multiply group-hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-end gap-10">
          <div className="flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative group text-[11px] uppercase tracking-[0.2em] font-bold transition-colors py-1 ${
                    isActive ? 'text-[#1e3a8a]' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                  <span 
                    className={`absolute bottom-0 left-0 h-[1px] bg-[#1e3a8a] transition-all duration-500 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center pl-8 border-l border-stone-300">
            <Link to={user ? dashboardPath : '/login'}>
              <Button 
                variant="outline" 
                className="rounded-none border border-stone-900 text-stone-900 bg-transparent hover:bg-[#1e3a8a] hover:text-[#FAF9F6] hover:border-[#1e3a8a] font-bold text-[10px] uppercase tracking-[0.2em] h-10 px-6 transition-all duration-300 shadow-none"
              >
                {user ? 'Dashboard' : 'Masuk'}
              </Button>
            </Link>
          </div>

        </div>

        <button
          className="md:hidden text-stone-900 focus:outline-none ml-auto hover:text-[#1e3a8a] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
        </button>

      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#FAF9F6] border-b border-stone-300 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-2 duration-300">
          
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <Link 
                  key={item.label}
                  to={item.path} 
                  className={`font-bold uppercase tracking-[0.2em] text-xs py-2 border-b border-stone-200 ${
                    isActive ? 'text-[#1e3a8a]' : 'text-stone-900 hover:text-[#1e3a8a]'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link to={user ? dashboardPath : '/login'} className="w-full mt-2" onClick={() => setIsMenuOpen(false)}>
            <Button variant="outline" className="w-full rounded-none border-stone-900 text-stone-900 hover:bg-[#1e3a8a] hover:text-[#FAF9F6] hover:border-[#1e3a8a] font-bold h-12 uppercase tracking-[0.2em] text-[11px] transition-colors">
              {user ? 'Go to Dashboard' : 'Masuk Akun'}
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;  