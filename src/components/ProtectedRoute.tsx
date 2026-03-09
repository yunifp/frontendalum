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
        <p className="font-bold text-indigo-950 tracking-wide animate-pulse">Memverifikasi Akses...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Cek apakah user memiliki salah satu dari allowedRoles
  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  // --- ADMIN BYPASS (BERLAKU UNTUK SEMUA JENIS ADMIN) ---
  if (user?.role?.includes('ADMIN')) {
    return <Outlet />;
  }

  const currentPath = location.pathname;

  // --- SINKRONISASI DISINI ---
  // Daftarkan rute yang boleh diakses USER tanpa perlu cek permission DB
  const isGlobalRoute =
    currentPath === '/' ||
    currentPath.startsWith('/notifications') ||
    currentPath.startsWith('/profile') ||
    currentPath.startsWith('/forum');

  const permissions = (user as any)?.permissions || [];

  const hasAccess =
    permissions.length > 0
      ? permissions.some((p: any) => {
        if (!p.link) return false;
        const cleanDbLink = p.link.startsWith('/admin') ? p.link : `/admin${p.link}`;
        return currentPath === cleanDbLink || currentPath.startsWith(cleanDbLink + '/');
      })
      : true;

  if (!isGlobalRoute && !hasAccess) {
    console.warn(`Akses ditolak ke: ${currentPath}`);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;