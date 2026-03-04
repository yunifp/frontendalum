import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, GraduationCap, Briefcase, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const statsData = [
    { 
      title: 'Total Alumni Terdaftar', 
      value: '2,845', 
      desc: '+12% dari bulan lalu', 
      icon: Users, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50' 
    },
    { 
      title: 'Angkatan Aktif', 
      value: '42', 
      desc: 'Tersebar di berbagai program studi', 
      icon: GraduationCap, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      title: 'Peluang Karir', 
      value: '156', 
      desc: 'Lowongan pekerjaan baru minggu ini', 
      icon: Briefcase, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50' 
    },
  ];

  const chartData = [
    { date: 'Senin', count: 45 },
    { date: 'Selasa', count: 52 },
    { date: 'Rabu', count: 38 },
    { date: 'Kamis', count: 65 },
    { date: 'Jumat', count: 48 },
    { date: 'Sabtu', count: 25 },
    { date: 'Minggu', count: 30 },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950">Dashboard Alumni</h1>
          <p className="text-slate-500 font-medium mt-1">Selamat datang kembali di portal jaringan alumni ITB.</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 shadow-sm">
          <TrendingUp className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-bold text-orange-700">Data Terkini</span>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {statsData.map((stat, i) => (
          <Card key={i} className="border border-slate-200 bg-white/80 backdrop-blur-xl shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
              <CardTitle className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">{stat.title}</CardTitle>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="text-4xl font-black text-indigo-950 tracking-tighter">{stat.value}</div>
              <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1">
                {stat.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
        <h3 className="text-xl font-extrabold text-indigo-950 mb-6">Aktivitas Login (7 Hari Terakhir)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
              />
              <Tooltip 
                cursor={{ fill: '#e0e7ff', opacity: 0.4 }}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#312e81' }}
              />
              <Bar 
                dataKey="count" 
                fill="#312e81" 
                radius={[6, 6, 0, 0]} 
                name="Aktivitas" 
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}