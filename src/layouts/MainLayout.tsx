import { Outlet } from 'react-router-dom';
import Navbar from '../components/home/Navbar';
import Footer from '../components/home/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#a51417]/30 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}