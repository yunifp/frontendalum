/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';

// 1. Definisikan interface props agar tidak error 'IntrinsicAttributes'
interface DashboardLayoutProps {
  variant: 'admin' | 'user';
}

// 2. Terapkan interface pada komponen
export default function DashboardLayout({ variant }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // 3. Logika Navigasi yang dinamis berdasarkan Variant/Role
  let navItems: any[] = [];

  if (variant === 'admin') {
    // Menu Khusus Admin
    navItems = [
      { title: 'Dashboard', icon: 'layout-dashboard', href: '/admin' },
      { title: 'Verifikasi User', icon: 'user-check', href: '/admin/verification' },
      { title: 'Data Alumni', icon: 'users', href: '/admin/alumni' },
      { title: 'Pengaturan', icon: 'settings', href: '/admin/settings' },
    ];
  } else {
    // Menu Khusus User / Alumni
    navItems = [
      { title: 'Profil Saya', icon: 'user', href: '/profile' },
      { title: 'Info Karir', icon: 'briefcase', href: '/career-info' },
      { title: 'Berita', icon: 'newspaper', href: '/news' },
      { title: 'Pengaturan', icon: 'settings', href: '/settings' },
    ];
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      {/* Pastikan komponen Sidebar Anda juga menerima props navItems.
          Variant dikirimkan jika Sidebar butuh styling berbeda antara Admin & User.
      */}
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
            {/* Outlet akan merender halaman sesuai rute (ProfilePage, DashboardPage, dll) */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}