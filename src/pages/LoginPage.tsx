import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(identifier, password);
      toast.success('Berhasil login!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4">
      <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-900/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-orange-500/5 blur-[120px]" />

      <div className="relative w-full max-w-[420px]">
        <Card className="border-slate-100 bg-white shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-2 pb-6 pt-10 px-8">
            <div className="mx-auto flex justify-center mb-4">
              <img 
                src="/src/assets/logo.jpg" 
                alt="Logo ITB" 
                className="h-20 w-auto object-contain mix-blend-multiply" 
              />
            </div>
            <CardTitle className="text-2xl font-black text-center text-indigo-950 tracking-tight">
              ALUMNI CONNECT
            </CardTitle>
            <p className="text-center text-sm text-slate-500 font-medium">Portal Resmi Jejaring Alumni</p>
          </CardHeader>

          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <CardContent className="space-y-5 p-0">
              <div className="space-y-2.5">
                <Label htmlFor="identifier" className="text-slate-700 font-bold text-sm ml-1">Email / Username / NIM</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-800 transition-colors" />
                  <Input
                    id="identifier"
                    placeholder="Alamat Email, Username, atau NIM"
                    className="pl-11 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-900/20 focus-visible:border-indigo-900 rounded-xl transition-all"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-slate-700 font-bold text-sm ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-800 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-900/20 focus-visible:border-indigo-900 rounded-xl transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button disabled={isLoading} className="w-full h-12 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-xl mt-2 transition-colors" type="submit">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Masuk ke Akun"}
              </Button>

              <p className="text-center text-sm mt-6 text-slate-600 font-medium">
                Belum punya akun?{' '}
                <button type="button" onClick={() => navigate('/register')} className="text-orange-600 font-bold hover:text-orange-700 hover:underline">
                  Daftar di sini
                </button>
              </p>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;