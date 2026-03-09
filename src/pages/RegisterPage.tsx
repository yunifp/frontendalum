import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff, User, IdCard, Loader2, Phone, Building2, GraduationCap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import logo from '../assets/logo.png';

// Import Custom Hook Baru
import { useRegister } from '@/hooks/useRegister';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nim: '', username: '', nama_lengkap: '', email: '', password: '', hp: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Menggunakan Hook Registrasi
  const { isLoading, fakultasList, prodiList, fetchFakultas, fetchProdi, registerUser } = useRegister();

  const [selectedFakultas, setSelectedFakultas] = useState<string>('');
  const [selectedProdi, setSelectedProdi] = useState<string>('');

  // Panggil fetchFakultas saat pertama kali halaman dirender
  useEffect(() => {
    fetchFakultas();
  }, [fetchFakultas]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFakultasChange = (value: string) => {
    setSelectedFakultas(value);
    setSelectedProdi(''); // Reset pilihan prodi saat fakultas berganti
    fetchProdi(value); // Panggil list prodi berdasarkan fakultas yang dipilih
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Proses registrasi dikirim ke Hook
    const success = await registerUser(formData, selectedFakultas, selectedProdi);

    // Jika registrasi dan insert master profile berhasil, arahkan ke login
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 p-4 py-10">
      <div className="absolute top-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-900/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-orange-500/5 blur-[120px]" />

      <div className="relative w-full max-w-150">
        <Card className="border-slate-100 bg-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-2 pb-6 pt-10 px-8">
            <div className="mx-auto flex justify-center mb-2">
              <img
                src={logo}
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

              {/* Row 1: NIM & Username */}
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

              {/* Row 2: Nama Lengkap & Email */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {/* Row 3: Fakultas & Program Studi */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-sm ml-1">Fakultas</Label>
                  <Select value={selectedFakultas} onValueChange={handleFakultasChange}>
                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:ring-indigo-900/20 focus:border-indigo-900 rounded-xl pl-10 relative">
                      <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
                      <SelectValue placeholder="Pilih Fakultas" />
                    </SelectTrigger>
                    <SelectContent>
                      {fakultasList.map((fakultas) => (
                        <SelectItem key={fakultas.id_fakultas} value={fakultas.id_fakultas.toString()}>
                          {fakultas.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold text-sm ml-1">Program Studi</Label>
                  <Select value={selectedProdi} onValueChange={setSelectedProdi} disabled={!selectedFakultas}>
                    <SelectTrigger className="h-12 bg-slate-50 border-slate-200 focus:ring-indigo-900/20 focus:border-indigo-900 rounded-xl pl-10 relative">
                      <GraduationCap className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 z-10" />
                      <SelectValue placeholder="Pilih Program Studi" />
                    </SelectTrigger>
                    <SelectContent>
                      {prodiList.map((prodi) => (
                        <SelectItem key={prodi.id_prodi} value={prodi.id_prodi.toString()}>
                          {prodi.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 4: No HP & Password */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <Button disabled={isLoading} className="w-full h-12 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-xl mt-6 transition-colors" type="submit">
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