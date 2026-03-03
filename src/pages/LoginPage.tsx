import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onNavigateToRegister?: () => void;
}

const LoginPage = ({ onNavigateToRegister }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted UI-only", { email, password });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4">
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-900/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="relative w-full max-w-[450px] transition-all duration-500 hover:scale-[1.01]">
        <Card className="border-slate-200 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="space-y-2 pb-8 pt-10">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg shadow-indigo-900/10 p-2">
              <img src="/src/assets/logo.jpg" alt="Logo ITB" className="h-full w-full object-contain rounded-xl" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-b from-indigo-950 to-indigo-800">
              ALUMNI CONNECT
            </CardTitle>
            <CardDescription className="text-center text-slate-500 font-medium">
              Portal Resmi Alumni ITB <br />
              <span className="text-xs font-light text-slate-400">Mari Terhubung Kembali</span>
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 ml-1 font-semibold">Alamat Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-indigo-800" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="alumni@itb.ac.id"
                    className="h-12 border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 focus:border-indigo-800 focus:ring-indigo-800/20 rounded-xl transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                Masuk
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-slate-600">
                  Belum punya akun?{' '}
                  <button 
                    type="button" 
                    onClick={onNavigateToRegister}
                    className="text-orange-600 font-bold hover:text-orange-700 hover:underline transition-colors"
                  >
                    Daftar di sini
                  </button>
                </p>
              </div>
            </CardContent>

            <div className="px-6 pb-8 pt-2 text-center">
              <p className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Ikatan Alumni ITB. <br />
                All rights reserved.
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;