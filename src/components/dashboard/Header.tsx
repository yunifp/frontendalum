/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Menu, LogOut, Settings, User as UserIcon, BellIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription
} from '../ui/sheet';
import { useAuth } from '../../hooks/useAuth';
import * as LucideIcons from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';

interface NavItem {
  title: string;
  icon: string;
  href: string;
}

interface HeaderProps {
  pathname: string;
  navItems: NavItem[];
}

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const formattedName = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const IconComponent = (LucideIcons as any)[formattedName] || LucideIcons.Circle;
  return <IconComponent className={className} />;
};

export default function Header({ pathname, navItems }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount, fetchUnreadCount } = useNotification();

  useEffect(() => {
    fetchUnreadCount();
    const handleNotificationUpdate = () => {
      fetchUnreadCount();
    };
    window.addEventListener('notificationUpdated', handleNotificationUpdate);
    return () => {
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
    };
  }, [fetchUnreadCount]);

  const handleLogout = async () => {
    await logout();
  };

  // --- LOGIKA FORMAT NAMA PENGGUNA ---
  const formatDisplayName = (name: string) => {
    if (!name) return 'Pengguna';

    // Menghapus pola angka pada username hasil seeder
    // 1. admin_prodi_94_informatika -> admin_prodi_informatika
    // 2. admin_fakultas_11 -> admin_fakultas
    const cleanedName = name.replace(/_\d+_/g, '_').replace(/_\d+$/g, '');

    // Mengganti underscore dengan spasi dan memberikan huruf kapital (Title Case)
    return cleanedName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Gunakan nama_lengkap jika ada di payload auth, jika tidak format username-nya
  const displayName = formatDisplayName(user?.username || '');
  const displayEmail = user?.email || 'Email tidak tersedia';

  // --- LOGIKA FORMAT ROLE ---
  const getDisplayRole = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'Sistem Administrator';
      case 'ADMIN_FAKULTAS': return 'Admin Fakultas';
      case 'ADMIN_PRODI': return 'Admin Program Studi';
      case 'USER': return 'Alumni';
      default: return 'Pengguna';
    }
  };
  const displayRole = getDisplayRole(user?.role);

  // --- LOGIKA INITIALS AVATAR ---
  const getInitials = (name: string) => {
    const words = name.split(' ').filter(w => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase() || 'US';
  };

  return (
    <header className="flex h-20 items-center gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-xl px-6 justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className="sm:hidden rounded-xl">
              <Menu className="h-6 w-6 text-slate-600" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="bg-white border-slate-100 p-6 w-72">
            <SheetTitle className="sr-only">Menu Navigasi Sidebar</SheetTitle>
            <SheetDescription className="sr-only">
              Gunakan menu ini untuk menavigasi halaman aplikasi.
            </SheetDescription>

            <div className="flex items-center gap-3 mb-10 mt-2">
              <img
                src="/src/assets/logo.jpg"
                alt="Logo ITB"
                className="h-10 w-auto object-contain mix-blend-multiply"
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-indigo-950 leading-none">ALUMNI</span>
                <span className="text-[10px] font-bold text-orange-500 tracking-widest mt-0.5 uppercase">Connect</span>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={index}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${isActive
                      ? 'bg-indigo-900 text-white shadow-md shadow-indigo-900/20'
                      : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-900'
                      }`}
                  >
                    <DynamicIcon name={item.icon} className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={() => {
            if (user?.role === 'ADMIN') {
              navigate('/admin/notifications');
            } else {
              navigate('/notifications');
            }
          }}
          variant="ghost"
          size="icon"
          className="rounded-xl text-slate-500 hover:text-blue-700 relative"
        >
          <BellIcon className="h-8 w-8" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 border-2 border-white text-[9px] font-bold text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="pl-1 pr-3 py-1 h-11 rounded-full hover:bg-slate-100 transition-all gap-3 border border-slate-200 shadow-sm bg-white"
            >
              <Avatar className="h-8 w-8 rounded-full border border-indigo-100">
                <AvatarFallback className="bg-linear-to-br from-indigo-800 to-indigo-900 text-white text-xs font-bold">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>

              <div className="hidden md:flex flex-col items-start max-w-40">
                <span className="text-sm font-bold text-slate-900 leading-none truncate w-full text-left">
                  {displayName}
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-1 truncate w-full text-left uppercase tracking-widest">
                  {displayRole}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 p-2 rounded-2xl border-slate-200 shadow-2xl bg-white"
          >
            <div className="px-3 py-3 mb-2 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900 truncate">{displayName}</p>
              <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{displayEmail}</p>
            </div>

            <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer focus:bg-indigo-50 focus:text-indigo-900 transition-colors">
              <UserIcon className="mr-3 h-4 w-4 text-indigo-500" />
              <span className="font-medium">Profil Saya</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer focus:bg-indigo-50 focus:text-indigo-900 transition-colors">
              <Settings className="mr-3 h-4 w-4 text-indigo-500" />
              <span className="font-medium">Pengaturan Akun</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-slate-100 my-1" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-orange-600 focus:text-orange-700 focus:bg-orange-50 cursor-pointer rounded-xl py-2.5 font-bold transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Keluar Sistem
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}