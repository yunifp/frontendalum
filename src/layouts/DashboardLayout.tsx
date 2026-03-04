import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { useAuth } from '../hooks/useAuth';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { title: 'Dashboard', icon: 'layout-dashboard', href: '/' },
    { title: 'Data Alumni', icon: 'users', href: '/alumni' },
    { title: 'Karir & Lowongan', icon: 'briefcase', href: '/career' },
  ];

  if (user?.role === 'ADMIN') {
    navItems.splice(1, 0, { title: 'Verifikasi User', icon: 'user-check', href: '/verification' });
  }

  navItems.push({ title: 'Pengaturan', icon: 'settings', href: '/settings' });

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