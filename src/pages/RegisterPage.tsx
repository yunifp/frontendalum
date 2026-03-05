/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff, User, IdCard, Loader2, Phone } from 'lucide-react';
import api from '@/lib/axios';
import { toast } from 'sonner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nim: '', username: '', nama_lengkap: '', email: '', password: '', hp: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Registrasi Akun ke RBAC Service
      const response = await api.post('/auth/register', formData);
      const data = response.data;

      if (!data.success) {
        toast.error(data.message || 'Registrasi gagal');
        return;
      }

      // Pastikan nama key id sesuai dengan response backend Anda (userId atau id)
      const userId = data.user.id;

      // 2. Membuat Profil ke Master Service
      // PENTING: Tambahkan Header x-internal-key di sini
      await api.post('/master/create-profile', {
        id_pengguna: userId,
        nama_lengkap: formData.nama_lengkap
      });

      toast.success(response.data.message || 'Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (error: any) {
      // Cek apakah error berasal dari request pertama atau kedua
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat registrasi';
      toast.error(errorMessage);
      console.error("Register Flow Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 p-4 py-10">
      <div className="absolute top-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-900/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-orange-500/5 blur-[120px]" />

      <div className="relative w-full max-w-[500px]">
        <Card className="border-slate-100 bg-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-2 pb-6 pt-10 px-8">
            <div className="mx-auto flex justify-center mb-2">
              <img
                src="/src/assets/logo.jpg"
                alt="Logo ITB"
                className="h-16 w-auto object-contain mix-blend-multiply"
              />
            </div>
            <CardTitle className="text-2xl font-black text-center text-indigo-950 tracking-tight">
              REGISTRASI ALUMNI
            </CardTitle>
            <p className="text-center text-sm text-slate-500 font-medium">Lengkapi form untuk bergabung</p>
          </CardHeader>
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <CardContent className="space-y-4 p-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nim" className="text-slate-700 font-bold text-sm ml-1">NIM</Label>
                  <div className="relative group">
                    <IdCard className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-800 transition-colors" />
                    <Input id="nim" placeholder="NIM" className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-900/20 focus-visible:border-indigo-900 rounded-xl" onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-700 font-bold text-sm ml-1">Username</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-800 transition-colors" />
                    <Input id="username" placeholder="Username" className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-900/20 focus-visible:border-indigo-900 rounded-xl" onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nama_lengkap" className="text-slate-700 font-bold text-sm ml-1">Nama Lengkap</Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-800 transition-colors" />
                  <Input id="nama_lengkap" placeholder="Nama Lengkap" className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-900/20 focus-visible:border-indigo-900 rounded-xl" onChange={handleChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-bold text-sm ml-1">Email Utama</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-800 transition-colors" />
                  <Input id="email" type="email" placeholder="contoh@alumni.itb.ac.id" className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-900/20 focus-visible:border-indigo-900 rounded-xl" onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hp" className="text-slate-700 font-bold text-sm ml-1">No Handphone (Opsional)</Label>
                <div className="relative group">
                  <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-800 transition-colors" />
                  <Input id="hp" type="text" placeholder="08123456789" className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-900/20 focus-visible:border-indigo-900 rounded-xl" onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-bold text-sm ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-800 transition-colors" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" className="pl-10 pr-11 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-900/20 focus-visible:border-indigo-900 rounded-xl" onChange={handleChange} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button disabled={isLoading} className="w-full h-12 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-xl mt-4 transition-colors" type="submit">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Buat Akun Sekarang"}
              </Button>

              <p className="text-center text-sm mt-6 text-slate-600 font-medium">
                Sudah punya akun? <button type="button" onClick={() => navigate('/login')} className="text-orange-600 font-bold hover:text-orange-700 hover:underline">Masuk di sini</button>
              </p>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;