import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff, User, IdCard, CalendarDays } from 'lucide-react';

interface RegisterPageProps {
  onNavigateToLogin?: () => void;
}

const RegisterPage = ({ onNavigateToLogin }: RegisterPageProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nim: '',
    graduationYear: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register form submitted UI-only", formData);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 py-10">
      <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-900/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="relative w-full max-w-[500px] transition-all duration-500 hover:scale-[1.01]">
        <Card className="border-slate-200 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="space-y-2 pb-6 pt-8">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg shadow-indigo-900/10 p-1.5">
              <img src="/src/assets/logo.jpg" alt="Logo ITB" className="h-full w-full object-contain rounded-xl" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-b from-indigo-950 to-indigo-800">
              REGISTRASI ALUMNI
            </CardTitle>
            <CardDescription className="text-center text-slate-500 font-medium">
              Bergabunglah dengan jejaring alumni ITB
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-700 ml-1 font-semibold">Nama Lengkap</Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-800" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    className="h-12 border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-indigo-800 focus:ring-indigo-800/20 rounded-xl transition-all"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nim" className="text-slate-700 ml-1 font-semibold">NIM</Label>
                  <div className="relative group">
                    <IdCard className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-800" />
                    <Input
                      id="nim"
                      type="text"
                      placeholder="NIM saat kuliah"
                      className="h-12 border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-indigo-800 focus:ring-indigo-800/20 rounded-xl transition-all"
                      value={formData.nim}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="graduationYear" className="text-slate-700 ml-1 font-semibold">Tahun Lulus</Label>
                  <div className="relative group">
                    <CalendarDays className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-800" />
                    <Input
                      id="graduationYear"
                      type="number"
                      placeholder="Contoh: 2025"
                      className="h-12 border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-indigo-800 focus:ring-indigo-800/20 rounded-xl transition-all"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 ml-1 font-semibold">Alamat Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-800" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="h-12 border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-indigo-800 focus:ring-indigo-800/20 rounded-xl transition-all"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 ml-1 font-semibold">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-800" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 border-slate-200 bg-slate-50 pl-11 pr-11 text-slate-900 placeholder:text-slate-400 focus:border-indigo-800 focus:ring-indigo-800/20 rounded-xl transition-all"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                className="w-full h-12 mt-4 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/20 transition-all" 
                type="submit"
              >
                Buat Akun
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-slate-600">
                  Sudah punya akun?{' '}
                  <button 
                    type="button" 
                    onClick={onNavigateToLogin}
                    className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-colors"
                  >
                    Masuk di sini
                  </button>
                </p>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;