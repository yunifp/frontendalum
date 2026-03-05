// components/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // Tunggu proses cek token selesai

  return isAuthenticated ? <Navigate to="/redirect" replace /> : <Outlet />;
};

export default PublicRoute;