import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/admin/DashboardPage';
import VerificationPage from './pages/admin/VerificationPage';
import { Toaster } from '@/components/ui/sonner';
import AlumniManagementPage from './pages/admin/AlumniManagementPage';

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
      {
        element: <PublicRoute />,
        children: [
          {
            path: '/login',
            element: <LoginPage />
          },
          {
            path: '/register',
            element: <RegisterPage />
          }
        ]
      },
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                index: true,
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
                path: 'alumni',
                element: <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"><h1 className="text-2xl font-bold text-indigo-950">Data Alumni</h1></div>
              },
              {
                path: 'career',
                element: <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"><h1 className="text-2xl font-bold text-indigo-950">Karir & Lowongan</h1></div>
              },
              {
                path: 'settings',
                element: <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"><h1 className="text-2xl font-bold text-indigo-950">Pengaturan</h1></div>
              }
            ]
          }
        ]
      },
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