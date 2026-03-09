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
import AlumniDetailPage from './pages/admin/AlumniDetailPage';
import FakultasProdiPage from './pages/admin/FakultasProdiPage';
import LandingPage from './pages/Home';
import MainLayout from './layouts/MainLayout';
import SektorPekerjaanPage from './pages/admin/SektorPekerjaanPage';
import ForumPage from './pages/ForumPage';
import NewsPage from './pages/users/NewsPage';
import NewsDetailPage from './pages/users/NewsDetailPage';
import NewsManagementPage from './pages/admin/NewsManagementPage';
import NewsFormPage from './pages/admin/NewsFormPage'; 
import EventManagementPage from './pages/admin/EventManagementPage';
import EventFormPage from './pages/admin/EventFormPage';
import AlumniDirectoryPage from './pages/users/AlumniDirectoryPage';
import EventDetailPage from './pages/users/EventDetailPage';
import EventsPage from './pages/users/EventsPage';
import ForumProfilePage from './pages/ForumProfilePage';
import Berita from './pages/Berita';
import Acara from './pages/Acara';
import BeritaDetailPage from './pages/BeritaDetailPage';
import AcaraDetailPage from './pages/AcaraDetailPage';
import LoggingManagementPage from './pages/admin/LoggingManagementPage';
import NotificationPage from './pages/NotificationPage';
import NotificationDetailPage from './pages/NotificationDetailPage';
import UserManagementPage from './pages/admin/UserManagementPage';

function RoleBasedRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  return user?.role?.includes('ADMIN') ? <Navigate to="/admin" replace /> : <Navigate to="/profile" replace />;
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
      { path: '/', element: <Navigate to="/home" replace /> },
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <Navigate to="/home" replace /> },
          { path: 'home', element: <LandingPage /> },
          { path: 'berita', element: <Berita /> },
          { path: 'berita/:slug', element: <BeritaDetailPage /> },
          { path: 'acara/:slug', element: <AcaraDetailPage /> },
          { path: 'acara', element: <Acara /> },
        ]
      },
      {
        element: <PublicRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> }
        ]
      },
      
      {
        path: '/redirect',
        element: <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'ADMIN_FAKULTAS', 'ADMIN_PRODI']} />,
        children: [{ index: true, element: <RoleBasedRedirect /> }]
      },

      {
        element: <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'ADMIN_FAKULTAS', 'ADMIN_PRODI']} />,
        children: [
          {
            element: <DashboardLayout variant="user" />, 
            children: [
              { path: '/profile', element: <ProfilePage /> },
              { path: '/forum', element: <ForumPage /> },
              { path: '/forum/profile/:id', element: <ForumProfilePage /> },
              { path: '/alumni-directory', element: <AlumniDirectoryPage /> },
              { path: '/news', element: <NewsPage /> },
              { path: '/news/:slug', element: <NewsDetailPage /> },
              { path: '/events', element: <EventsPage /> },
              { path: '/events/:slug', element: <EventDetailPage /> },
              { path: 'notifications', element: <NotificationPage /> },
              { path: 'notifications/:id', element: <NotificationDetailPage /> },
            ]
          }
        ]
      },

      {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['ADMIN', 'ADMIN_FAKULTAS', 'ADMIN_PRODI']} />,
        children: [
          {
            element: <DashboardLayout variant="admin" />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'verification', element: <VerificationPage /> },
              { path: 'alumni', element: <AlumniManagementPage /> },
              { path: 'alumni/:id', element: <AlumniDetailPage /> },
              { path: 'fakultas-prodi', element: <FakultasProdiPage /> },
              { path: 'forum', element: <ForumPage /> },
              { path: 'forum/profile/:id', element: <ForumProfilePage /> },
              { path: 'notifications', element: <NotificationPage /> },
              { path: 'notifications/:id', element: <NotificationDetailPage /> },
              { path: 'news', element: <NewsManagementPage /> },
              { path: 'news/create', element: <NewsFormPage /> },
              { path: 'news/edit/:id', element: <NewsFormPage /> },
              { path: 'events', element: <EventManagementPage /> },
              { path: 'events/create', element: <EventFormPage /> },
              { path: 'events/edit/:id', element: <EventFormPage /> },
              { path: 'users', element: <UserManagementPage /> },

              // STRICT ADMIN ONLY (Hanya Super Admin yang bisa akses Rute ini)
              {
                element: <ProtectedRoute allowedRoles={['ADMIN']} />,
                children: [
                  { path: 'sektor-pekerjaan', element: <SektorPekerjaanPage /> },
                  { path: 'logging', element: <LoggingManagementPage /> },
                  {
                    path: 'settings',
                    element: <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                      <h1 className="text-2xl font-bold text-indigo-950">Pengaturan Admin</h1>
                    </div>
                  }
                ]
              }
            ]
          }
        ]
      },
      
      { path: '*', element: <Navigate to="/home" replace /> }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}