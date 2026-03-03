import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPgae';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'register'>('login');

  return (
    <>
      {currentPage === 'login' ? (
        <LoginPage onNavigateToRegister={() => setCurrentPage('register')} />
      ) : (
        <RegisterPage onNavigateToLogin={() => setCurrentPage('login')} />
      )}
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;