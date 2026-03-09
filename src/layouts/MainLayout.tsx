import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#a51417]/30 flex flex-col font-sans">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}