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
import ProfilePage from './pages/users/ProfilePage'; // Halaman Profile yang kita buat tadi
import { Toaster } from '@/components/ui/sonner';
import AlumniManagementPage from './pages/admin/AlumniManagementPage';
import AlumniDetailPage from './pages/admin/AdminDetailPage';

function RoleBasedRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/profile" replace />;
}

function Root() {
  return (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
      <Toaster
        position="top-right"
        richColors
        visibleToasts={1}
      />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      // --- PUBLIC ROUTES ---
      {
        element: <PublicRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> }
        ]
      },

      // --- PROTECTED ROUTES (Root & User) ---
      {
        path: '/',
        element: <ProtectedRoute allowedRoles={['USER', 'ADMIN']} />,
        children: [
          // Navigasi Otomatis berdasarkan Role
          {
            index: true,
            element: <RoleBasedRedirect />
          },
          // Route khusus User (Alumni)
          {
            element: <DashboardLayout variant="user" />,
            children: [
              {
                path: 'profile',
                element: <ProfilePage />
              },
              {
                path: 'career-info',
                element: <div className="p-8"><h1>Info Karir & Loker</h1></div>
              },
              {
                path: 'news',
                element: <div className="p-8"><h1>Berita Kampus</h1></div>
              }
            ]
          }
        ]
      },

      // --- ADMIN ROUTES (Prefix /admin) ---
      {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          {
            element: <DashboardLayout variant="admin" />,
            children: [
              {
                index: true, // Dashboard Admin (/admin)
                element: <DashboardPage />
              },
              {
                path: 'verification',
                element: <VerificationPage />
              },
              {
                path: 'alumni',
                element: <AlumniManagementPage />
              },
              {
                path: 'alumni/:id',
                element: <AlumniDetailPage />
              },
              {
                path: 'settings',
                element: <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"><h1 className="text-2xl font-bold text-indigo-950">Pengaturan</h1></div>
              }
            ]
          }
        ]
      },

      // --- 404 / FALLBACK ---
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