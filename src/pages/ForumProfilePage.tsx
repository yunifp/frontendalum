 import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForum } from '@/hooks/useForum';
import { useAuth } from '@/hooks/useAuth';
import {
    ArrowLeft, Calendar, MapPin, Link as LinkIcon,
    MessageSquare, UserPlus, UserMinus, Loader2, CheckCircle2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function ForumProfilePage() {
    const { id: userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const {
        toggleFollow,
        profile,
        userTweets,
        stats,
        isLoading,
        fetchProfileData,
        isFollowing
    } = useForum();

    useEffect(() => {
        if (userId) {
            // Pastikan parsing ID ke Number dan kirim currentUser?.id untuk check following
            fetchProfileData(Number(userId), currentUser?.id);
        }
    }, [userId, currentUser?.id, fetchProfileData]);

    const handleFollowAction = async () => {
        await toggleFollow(Number(userId));
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="animate-spin text-indigo-600 h-10 w-10 mb-2" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest text-center animate-pulse">
                Menyinkronkan Profil...
            </p>
        </div>
    );

    if (!profile) return null;

    return (
        <div className="max-w-2xl mx-auto bg-white border-x border-slate-100 min-h-screen animate-in fade-in duration-700 shadow-sm">
            {/* --- NAV HEADER --- */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 py-2 flex items-center gap-6 border-b border-slate-50">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full hover:bg-slate-100">
                    <ArrowLeft size={20} />
                </Button>
                <div className="overflow-hidden">
                    <h2 className="text-lg font-black text-slate-900 leading-tight flex items-center gap-1 truncate">
                        {profile.nama_lengkap}
                        <CheckCircle2 size={16} className="text-indigo-500 fill-indigo-500/10 shrink-0" />
                    </h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{userTweets.length} Postingan</p>
                </div>
            </div>

            {/* --- COVER & AVATAR --- */}
            <div className="relative">
                <div className="h-32 md:h-44 bg-linear-to-r from-indigo-600 to-violet-700"></div>
                <div className="px-5">
                    <div className="relative flex justify-between items-end -mt-12 md:-mt-16 mb-4">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-2xl ring-1 ring-slate-100">
                            <AvatarImage src={profile.foto} className="object-cover" />
                            <AvatarFallback className="bg-slate-100 text-2xl font-black text-slate-400 uppercase text-center flex items-center justify-center">
                                {profile.nama_lengkap?.[0] || '?'}
                            </AvatarFallback>
                        </Avatar>

                        {/* Tombol Follow: Sembunyikan jika profil sendiri */}
                        {currentUser?.id !== Number(userId) && (
                            <Button
                                onClick={handleFollowAction}
                                variant={isFollowing ? "outline" : "default"}
                                className={`rounded-full px-6 font-black transition-all duration-300 ${isFollowing
                                    ? 'border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg'
                                    }`}
                            >
                                {isFollowing ? <><UserMinus size={16} className="mr-2" /> Unfollow</> : <><UserPlus size={16} className="mr-2" /> Follow</>}
                            </Button>
                        )}
                    </div>

                    <div className="space-y-4 pb-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{profile.nama_lengkap}</h1>
                            <p className="text-slate-500 font-bold text-sm tracking-tight">@{profile.prodi?.nama?.toLowerCase().replace(/\s/g, '') || 'alumni'}</p>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-500 font-bold">
                            {profile.kabupaten_relasi && (
                                <div className="flex items-center gap-1.5"><MapPin size={15} className="text-slate-400" /> {profile.kabupaten_relasi.nama_wilayah}</div>
                            )}
                            <div className="flex items-center gap-1.5"><Calendar size={15} className="text-slate-400" /> Angkatan {profile.angkatan || '-'}</div>
                            {profile.sosial_media?.linkedin && (
                                <div className="flex items-center gap-1.5 text-indigo-600 hover:underline cursor-pointer">
                                    <LinkIcon size={14} /> {profile.sosial_media.linkedin}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-6">
                            <div className="flex gap-1.5 items-center border-b-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer pb-1">
                                <span className="font-black text-slate-900">{stats.followingCount || 0}</span>
                                <span className="text-slate-400 text-xs font-black uppercase tracking-wider">Mengikuti</span>
                            </div>
                            <div className="flex gap-1.5 items-center border-b-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer pb-1">
                                <span className="font-black text-slate-900">{stats.followersCount || 0}</span>
                                <span className="text-slate-400 text-xs font-black uppercase tracking-wider">Pengikut</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FEED SECTION --- */}
            <div className="border-t border-slate-100">
                <div className="px-6 py-4 bg-white sticky top-14 z-10 border-b border-slate-50">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                        <MessageSquare size={14} strokeWidth={3} /> Postingan Terkini
                    </h3>
                </div>

                <div className="divide-y divide-slate-50">
                    {userTweets.length === 0 ? (
                        <div className="py-24 text-center space-y-3 bg-slate-50/30">
                            <div className="bg-white w-16 h-16 rounded-3xl shadow-sm flex items-center justify-center mx-auto text-slate-200">
                                <MessageSquare size={32} />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Belum ada postingan</p>
                        </div>
                    ) : (
                        userTweets.map((tweet) => (
                            <div key={tweet.id_tweet} className="p-6 hover:bg-slate-50/40 transition-colors group">
                                <p className="text-slate-700 font-medium leading-relaxed text-[15px]">{tweet.content}</p>
                                {tweet.media?.length > 0 && (
                                    <div className="mt-4 rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
                                        <img src={tweet.media[0].url_media} className="w-full h-auto object-cover max-h-96" alt="Post content" />
                                    </div>
                                )}
                                <div className="mt-5 flex items-center gap-6 text-slate-400 text-[11px] font-black uppercase tracking-tighter">
                                    <div className="flex items-center gap-1.5 hover:text-rose-600 transition-colors cursor-pointer">
                                        <div className="p-2 bg-slate-50 rounded-full group-hover:bg-rose-50 transition-colors">❤️ {tweet._count?.likes || 0}</div>
                                    </div>
                                    <div className="flex items-center gap-1.5 hover:text-sky-600 transition-colors cursor-pointer">
                                        <div className="p-2 bg-slate-50 rounded-full group-hover:bg-sky-50 transition-colors">💬 {tweet._count?.comments || 0}</div>
                                    </div>
                                    <span className="ml-auto text-slate-300">
                                        {format(new Date(tweet.created_at), 'dd MMM yyyy', { locale: localeId })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}