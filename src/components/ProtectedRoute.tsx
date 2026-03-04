/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-900 border-t-indigo-200"></div>
        <p className="font-bold text-indigo-950 tracking-wide animate-pulse">
          Memverifikasi Akses...
        </p>
      </div>
    );
  }

  // --- 2. AUTH CHECK ---
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- 3. ROLE CHECK ---
  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    console.warn(`Role ${user?.role} tidak diizinkan mengakses path ini.`);
    return <Navigate to="/" replace />;
  }

  // --- 4. ADMIN BYPASS (ADMIN boleh akses semua halaman admin) ---
  if (user?.role === 'ADMIN') {
    return <Outlet />;
  }

  // --- 5. PERMISSION CHECK UNTUK USER BIASA ---
  const currentPath = location.pathname;

  const isGlobalRoute =
    currentPath === '/' ||
    currentPath.startsWith('/notifications') ||
    currentPath.startsWith('/profile');

  const permissions = (user as any)?.permissions || [];

  const hasAccess =
    permissions.length > 0
      ? permissions.some((p: any) => {
          if (!p.link) return false;

          const cleanDbLink = p.link.startsWith('/admin')
            ? p.link
            : `/admin${p.link}`;

          return (
            currentPath === cleanDbLink ||
            currentPath.startsWith(cleanDbLink + '/')
          );
        })
      : true;

  if (!isGlobalRoute && !hasAccess) {
    console.warn(`Akses ditolak (Permission Missing) ke: ${currentPath}`);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;