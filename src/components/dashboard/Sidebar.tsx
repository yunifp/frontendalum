/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import * as LucideIcons from 'lucide-react';

// Perbarui Interface agar mendukung type 'label' dan 'divider'
interface NavItem {
  type?: 'label' | 'divider';
  title?: string;
  icon?: string;
  href?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  navItems: NavItem[];
}

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  // Mengubah kebab-case (layout-dashboard) ke PascalCase (LayoutDashboard)
  const formattedName = name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const IconComponent = (LucideIcons as any)[formattedName] || LucideIcons.Circle;
  return <IconComponent className={className} />;
};

export default function Sidebar({ isCollapsed, setIsCollapsed, navItems }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`hidden border-r border-slate-200 bg-white transition-all duration-500 sm:flex flex-col shadow-sm ${isCollapsed ? 'w-20' : 'w-72'
        }`}
    >
      {/* Header Sidebar */}
      <div className="flex h-20 items-center px-6 justify-between border-b border-slate-50">
        {!isCollapsed && (
          <div className="flex items-center gap-3 cursor-pointer">
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
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-800 ${isCollapsed ? 'mx-auto' : ''
            }`}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigasi */}
      <nav className="flex flex-col gap-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          // 1. Render Label Kategori
          if (item.type === 'label') {
            return !isCollapsed ? (
              <div key={`label-${index}`} className="px-4 mt-6 mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                  {item.title}
                </p>
              </div>
            ) : (
              <div key={`label-${index}`} className="mx-auto my-4 h-px w-8 bg-slate-100" />
            );
          }

          // 2. Render Divider
          if (item.type === 'divider') {
            return <hr key={`div-${index}`} className="my-3 border-slate-50 mx-4" />;
          }

          // 3. Render Nav Item Biasa
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={index}
              to={item.href || '#'}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 font-bold text-sm group ${isActive
                  ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/20'
                  : 'text-slate-500 hover:text-indigo-900 hover:bg-indigo-50'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                <DynamicIcon name={item.icon || 'circle'} className="w-5 h-5" />
              </div>

              {!isCollapsed && (
                <span className="truncate">{item.title}</span>
              )}

              {/* Tooltip sederhana saat collapsed (opsional) */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 rounded-md bg-indigo-950 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 font-medium">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}