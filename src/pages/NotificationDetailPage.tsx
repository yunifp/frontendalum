import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification, Notification } from '../hooks/useNotification';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    CheckCircle,
    Info,
    AlertTriangle,
    XCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function NotificationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { getNotificationById, markAsRead, fetchUnreadCount } = useNotification();
    const [notif, setNotif] = useState<Notification | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetail = async () => {
            if (!id) return;
            setLoading(true);
            const data = await getNotificationById(id);
            if (data) {
                setNotif(data);
                if (!data.isRead) {
                    await markAsRead(id);
                    fetchUnreadCount();
                }
            }
            setLoading(false);
        };
        loadDetail();
    }, [id]);

    const getIconColor = (type: string) => {
        switch (type) {
            case 'SUCCESS': return 'bg-green-100 text-green-600';
            case 'WARNING': return 'bg-yellow-100 text-yellow-600';
            case 'ERROR': return 'bg-red-100 text-red-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="h-5 w-5" />;
            case 'WARNING': return <AlertTriangle className="h-5 w-5" />;
            case 'ERROR': return <XCircle className="h-5 w-5" />;
            default: return <Info className="h-5 w-5" />;
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse font-medium">Membuka pesan...</div>;
    if (!notif) return <div className="p-12 text-center text-red-500 font-medium">Pesan tidak ditemukan.</div>;

    return (
        <div className="max-w-5xl mx-auto w-full space-y-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            if (user?.role === 'ADMIN') {
                                navigate('/admin/notifications');
                            } else {
                                navigate('/notifications');
                            }
                        }}
                        className="rounded-full h-9 w-9 text-slate-600"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-8">
                    <div className="px-14">
                        <h2 className="text-2xl font-normal text-slate-800 tracking-tight leading-tight">
                            {notif.title}
                        </h2>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${getIconColor(notif.type)}`}>
                            {getIcon(notif.type)}
                        </div>
                        <div className="flex-1 flex justify-between items-start">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900">Sistem Notifikasi</span>
                                    <span className="text-xs text-slate-400 font-medium tracking-tight">{'<noreply@system.com>'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                    <span>Kepada saya</span>
                                    <Button variant="ghost" size="icon" className="h-3 w-3 p-0 hover:bg-transparent"><Info className="h-2 w-2" /></Button>
                                </div>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                                {new Intl.DateTimeFormat('id-ID', {
                                    dateStyle: 'full',
                                    timeStyle: 'short'
                                }).format(new Date(notif.createdAt))}
                            </div>
                        </div>
                    </div>

                    <div className="px-14 pt-2">
                        <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-[14px] font-normal tracking-normal">
                            {notif.message}
                        </div>
                    </div>


                </CardContent>
            </Card>
        </div>
    );
}