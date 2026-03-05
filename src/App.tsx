import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/admin/DashboardPage';
import VerificationPage from './pages/admin/VerificationPage';
import ProfilePage from './pages/users/ProfilePage';
import { Toaster } from '@/components/ui/sonner';
import AlumniManagementPage from './pages/admin/AlumniManagementPage';
import AlumniDetailPage from './pages/admin/AdminDetailPage';
import FakultasProdiPage from './pages/admin/FakultasProdiPage';
import LandingPage from './pages/Home';
import MainLayout from './layouts/MainLayout';
import SektorPekerjaanPage from './pages/admin/SektorPekerjaanPage';

// Fungsi pengalihan berdasarkan Role setelah login
function RoleBasedRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Navigate to="/profile" replace />;
}

function Root() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster position="top-right" richColors visibleToasts={1} />
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      // 1. PUBLIC LANDING AREA (Bisa diakses siapa saja)
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <LandingPage /> }, // path: /
          { path: 'home', element: <Navigate to="/" replace /> } // redirect /home ke / agar konsisten
        ]
      },

      // 2. AUTH AREA (Hanya bisa diakses jika BELUM login)
      {
        element: <PublicRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> }
        ]
      },

      // 3. PRIVATE REDIRECTOR (Jembatan setelah login)
      {
        path: '/redirect',
        element: <ProtectedRoute allowedRoles={['USER', 'ADMIN']} />,
        children: [
          { index: true, element: <RoleBasedRedirect /> }
        ]
      },

      // 4. USER AREA (Hanya role USER & ADMIN)
      {
        element: <ProtectedRoute allowedRoles={['USER', 'ADMIN']} />,
        children: [
          {
            element: <DashboardLayout variant="user" />,
            children: [
              { path: '/profile', element: <ProfilePage /> },
              { path: '/career-info', element: <div className="p-8"><h1>Info Karir & Loker</h1></div> },
              { path: '/news', element: <div className="p-8"><h1>Berita Kampus</h1></div> }
            ]
          }
        ]
      },

      // 5. ADMIN AREA (Hanya role ADMIN)
      {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          {
            element: <DashboardLayout variant="admin" />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'verification', element: <VerificationPage /> },
              { path: 'alumni', element: <AlumniManagementPage /> },
              { path: 'alumni/:id', element: <AlumniDetailPage /> },
              { path: 'fakultas-prodi', element: <FakultasProdiPage /> },
              { path: 'sektor-pekerjaan', element: <SektorPekerjaanPage /> },
              {
                path: 'settings',
                element: <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h1 className="text-2xl font-bold text-indigo-950">Pengaturan Admin</h1>
                </div>
              }
            ]
          }
        ]
      },

      // 6. 404 NOT FOUND - Lempar kembali ke Home
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}