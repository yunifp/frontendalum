/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

interface DashboardLayoutProps {
  variant: 'admin' | 'user';
}

export default function DashboardLayout({ variant }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Logika Navigasi yang disesuaikan dengan kategori
  let navItems: any[] = [];

  if (variant === 'admin') {
    navItems = [
      { title: 'Dashboard', icon: 'layout-dashboard', href: '/admin' },

      // Pengguna & Verifikasi
      { type: 'label', title: 'Pengguna' },
      { title: 'Pengguna', icon: 'users', href: '/admin/users' },
      { title: 'Verifikasi Pengguna', icon: 'user-check', href: '/admin/verification' },

      // Master Data
      { type: 'label', title: 'Master Data' },
      { title: 'Data Alumni', icon: 'users', href: '/admin/alumni' },
      { title: 'Fakultas & Prodi', icon: 'graduation-cap', href: '/admin/fakultas-prodi' }, // Anda bisa memfilter view di page ini
      { title: 'Sektor Pekerjaan', icon: 'briefcase', href: '/admin/sektor-pekerjaan' },

      // Berita & Event
      { type: 'label', title: 'Berita & Event' },
      { title: 'Kelola Berita', icon: 'newspaper', href: '/admin/news' },
      { title: 'Kelola Event', icon: 'calendar', href: '/admin/events' },

      // Forum
      { type: 'label', title: 'Komunitas' },
      { title: 'Forum Diskusi', icon: 'messages-square', href: '/admin/forum' },

      { type: 'label', title: 'Pengaturan' },
      { title: 'Logs System', icon: 'history', href: '/admin/logging' },
      { title: 'Pengaturan', icon: 'settings', href: '/admin/settings' },
    ];
  } else {
    navItems = [
      { title: 'Profil Saya', icon: 'user', href: '/profile' },
      { title: 'Forum Diskusi', icon: 'messages-square', href: '/forum' },
      { title: 'Direktori Alumni', icon: 'users', href: '/alumni-directory' },
      { title: 'Berita', icon: 'newspaper', href: '/news' },
      { title: 'Event', icon: 'calendar', href: '/events' },
    ];
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        navItems={navItems}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          pathname={location.pathname}
          navItems={navItems}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}