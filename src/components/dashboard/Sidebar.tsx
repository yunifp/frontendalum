import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import * as LucideIcons from 'lucide-react';

interface NavItem {
  title: string;
  icon: string;
  href: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
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

export default function Sidebar({ isCollapsed, setIsCollapsed, navItems }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`hidden border-r border-slate-200 bg-white transition-all duration-500 sm:flex flex-col shadow-sm ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
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
          className={`rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-800 ${
            isCollapsed ? 'mx-auto' : ''
          }`}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex flex-col gap-2 px-4 py-6 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={index}
              to={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 font-bold text-sm ${
                isActive
                  ? 'bg-indigo-900 text-white shadow-lg shadow-indigo-900/20'
                  : 'text-slate-500 hover:text-indigo-900 hover:bg-indigo-50'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <DynamicIcon name={item.icon} className="w-5 h-5" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}