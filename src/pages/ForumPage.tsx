/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useForum } from '@/hooks/useForum';
import { useAuth } from '@/hooks/useAuth';
import {
    Image as ImageIcon, Heart, MessageCircle, MoreHorizontal,
    Lock, X, Loader2, Globe, Users, Send, ChevronDown, ChevronUp, Edit2, Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { SafeImage } from '@/components/ui/SafeImage';
import { Link } from 'react-router-dom';

export default function ForumPage() {
    const { user } = useAuth();
    const { tweets, isLoading, isPosting, fetchFeed, createPost, updatePost, deletePost, toggleLike, addComment } = useForum();

    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('PUBLIC');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingMedia, setExistingMedia] = useState<any[]>([]);
    const [mediaToDelete, setMediaToDelete] = useState<any[]>([]);

    const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
    const [showComments, setShowComments] = useState<Record<number, boolean>>({});
    const [commentText, setCommentText] = useState('');
    const [editingTweetId, setEditingTweetId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial load: Fetch feed biasa
    useEffect(() => { fetchFeed(); }, [fetchFeed]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content && selectedFiles.length === 0 && existingMedia.length === 0) return;

        let success;
        if (editingTweetId) {
            success = await updatePost(editingTweetId, content, visibility, mediaToDelete);
        } else {
            success = await createPost(content, visibility, selectedFiles);
        }

        if (success) {
            setContent(''); setSelectedFiles([]); setPreviews([]);
            setEditingTweetId(null); setExistingMedia([]); setMediaToDelete([]);
        }
    };

    const handleEditInitiate = (tweet: any) => {
        setEditingTweetId(tweet.id_tweet);
        setContent(tweet.content);
        setVisibility(tweet.visibility);
        setExistingMedia(tweet.media || []);
        setMediaToDelete([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const removeExistingMedia = (media: any) => {
        setExistingMedia(prev => prev.filter(m => m.id_media !== media.id_media));
        setMediaToDelete(prev => [...prev, media]);
    };

    const handleDeletePost = async (tweet: any) => {
        if (confirm("Hapus postingan ini beserta semua medianya?")) {
            const urls = tweet.media.map((m: any) => m.url_media);
            await deletePost(tweet.id_tweet, urls);
        }
    };

    const handleCancelEdit = () => {
        setEditingTweetId(null); setContent(''); setExistingMedia([]); setMediaToDelete([]);
    };

    const handleSendComment = async (tweetId: number) => {
        if (!commentText.trim()) return;
        const success = await addComment(tweetId, commentText);
        if (success) {
            setCommentText('');
            setActiveCommentId(null);
            setShowComments(prev => ({ ...prev, [tweetId]: true }));
        }
    };

    const toggleCommentVisibility = (tweetId: number) => {
        setShowComments(prev => ({ ...prev, [tweetId]: !prev[tweetId] }));
    };

    return (
        <div className="max-w-2xl mx-auto bg-white border-x border-slate-100 min-h-screen animate-in fade-in duration-700 shadow-sm">
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-50 px-5 py-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Timeline Diskusi</h2>
            </div>

            <div className={`px-5 py-4 border-b-8 border-slate-50 transition-colors ${editingTweetId ? 'bg-amber-50/30' : 'bg-white'}`}>
                {editingTweetId && (
                    <div className="mb-3 flex items-center justify-between bg-amber-100/50 px-3 py-1 rounded-full border border-amber-200">
                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Mode Edit Postingan</span>
                        <button onClick={handleCancelEdit} className="text-amber-700 hover:text-amber-900"><X size={14} /></button>
                    </div>
                )}
                <div className="flex gap-4">
                    <Avatar className="h-11 w-11 shrink-0 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarImage src={(user as any)?.foto || (user as any)?.profile?.foto} />
                        <AvatarFallback className="bg-indigo-600 text-white font-bold">{user?.username?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                        <Textarea placeholder="Apa yang sedang dipikirkan?" className="border-none focus-visible:ring-0 text-lg resize-none p-0 min-h-20 font-medium placeholder:text-slate-400 leading-tight" value={content} onChange={(e) => setContent(e.target.value)} />

                        {(existingMedia.length > 0 || previews.length > 0) && (
                            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-4">
                                {existingMedia.map((m) => (
                                    <div key={m.id_media} className="relative aspect-video group">
                                        <SafeImage src={m.url_media} className="object-cover w-full h-full opacity-60" />
                                        <button type="button" onClick={() => removeExistingMedia(m)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full shadow-xl hover:bg-red-700 transition-all"><Trash size={16} /></button>
                                        <div className="absolute bottom-2 left-2 bg-black/50 text-[8px] text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-tighter">Media Lama</div>
                                    </div>
                                ))}
                                {previews.map((src, i) => (
                                    <div key={i} className="relative aspect-video group border-2 border-indigo-200 rounded-xl overflow-hidden">
                                        <img src={src} className="object-cover w-full h-full" alt="Preview" />
                                        <button type="button" onClick={() => removeFile(i)} className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full transition-all"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                            <div className="flex items-center gap-1.5">
                                {!editingTweetId && (
                                    <Button variant="ghost" size="icon" className="text-indigo-600 rounded-full hover:bg-indigo-50 h-9 w-9" onClick={() => fileInputRef.current?.click()}><ImageIcon size={20} /></Button>
                                )}
                                <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                                <Select value={visibility} onValueChange={setVisibility}>
                                    <SelectTrigger className="w-fit h-8 border-none bg-indigo-50/50 text-indigo-700 text-[10px] font-black rounded-full px-3 transition-all"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                        <SelectItem value="PUBLIC"><div className="flex items-center gap-2 text-slate-700"><Globe size={14} /> Publik</div></SelectItem>
                                        <SelectItem value="FOLLOWERS_ONLY"><div className="flex items-center gap-2 text-slate-700"><Users size={14} /> Pengikut</div></SelectItem>
                                        <SelectItem value="PRIVATE"><div className="flex items-center gap-2 text-slate-700"><Lock size={14} /> Privat</div></SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                {editingTweetId && <Button variant="ghost" onClick={handleCancelEdit} className="rounded-full h-9 font-bold text-slate-500 hover:bg-slate-100">Batal</Button>}
                                <Button onClick={handleSubmit} disabled={isPosting || (!content && selectedFiles.length === 0 && existingMedia.length === 0)} className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-6 font-black h-9 shadow-lg shadow-indigo-100 transition-all active:scale-95 text-sm uppercase tracking-wider">{isPosting ? <Loader2 className="animate-spin" size={18} /> : (editingTweetId ? "Simpan" : "Posting")}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-slate-100 bg-white shadow-sm rounded-b-[2rem] overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white">
                        <div className="relative">
                            <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
                            <div className="absolute inset-0 blur-xl bg-indigo-400/20 animate-pulse rounded-full"></div>
                        </div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
                            Menyinkronkan Feed
                        </p>
                    </div>
                ) : (
                    tweets.map((tweet) => (
                        <div
                            key={tweet.id_tweet}
                            className="group relative px-6 py-5 hover:bg-slate-50/50 transition-all duration-300 ease-in-out border-b border-slate-50 last:border-0"
                        >
                            <div className="flex gap-4">
                                {/* --- AVATAR SECTION --- */}
                                <div className="flex flex-col items-center">
                                    <Link to={`/forum/profile/${tweet.author_id}`}>
                                        <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:ring-indigo-100 transition-all duration-300">
                                            <AvatarImage src={tweet.author?.foto} className="object-cover" />
                                            <AvatarFallback className="bg-linear-to-br from-slate-100 to-slate-200 text-slate-600 font-bold text-lg">
                                                {tweet.author?.nama_lengkap?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    {/* Decorative Line for Threads visual */}
                                    {tweet.comments?.length > 0 && showComments[tweet.id_tweet] && (
                                        <div className="w-0.5 grow bg-slate-100 mt-2 rounded-full mb-1"></div>
                                    )}
                                </div>

                                {/* --- CONTENT SECTION --- */}
                                <div className="flex-1 space-y-2.5 overflow-hidden">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <Link to={`/forum/profile/${tweet.author_id}`} className="hover:underline decoration-indigo-500/30">
                                                    <span className="font-black text-[15px] text-slate-900 truncate hover:text-indigo-600 transition-colors tracking-tight">
                                                        {tweet.author?.nama_lengkap || `User ${tweet.author_id}`}
                                                    </span>
                                                </Link>
                                                <span className="text-slate-300 text-xs font-bold">·</span>
                                                <span className="text-slate-400 text-[13px] font-medium whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(tweet.created_at), { addSuffix: true, locale: id })}
                                                </span>
                                                {tweet.visibility !== 'PUBLIC' && (
                                                    <div className="bg-slate-100 p-1 rounded-md ml-1" title={tweet.visibility}>
                                                        <Lock size={10} className="text-slate-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <Link to={`/forum/profile/${tweet.author_id}`}>
                                                <span className="text-[11px] text-slate-400 font-bold -mt-0.5 hover:text-indigo-400 transition-colors">
                                                    @{tweet.author?.username || 'member'}
                                                </span>
                                            </Link>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-2xl shadow-2xl border-slate-100 min-w-45 p-1.5 animate-in fade-in zoom-in-95 duration-200">
                                                {tweet.author_id === user?.id && (
                                                    <>
                                                        <DropdownMenuItem onClick={() => handleEditInitiate(tweet)} className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 font-bold text-slate-600 cursor-pointer focus:bg-indigo-50 focus:text-indigo-700 transition-colors">
                                                            <div className="p-1.5 bg-slate-100 rounded-lg group-focus:bg-white transition-colors">
                                                                <Edit2 size={14} />
                                                            </div>
                                                            Edit Postingan
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeletePost(tweet)} className="rounded-xl flex items-center gap-2.5 py-2.5 px-3 font-bold text-rose-500 cursor-pointer focus:bg-rose-50 focus:text-rose-600 transition-colors">
                                                            <div className="p-1.5 bg-rose-50 rounded-lg transition-colors">
                                                                <Trash size={14} />
                                                            </div>
                                                            Hapus Permanen
                                                        </DropdownMenuItem>
                                                        <div className="h-px bg-slate-100 my-1 mx-2" />
                                                    </>
                                                )}

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* Tweet Text */}
                                    <p className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-word font-medium tracking-tight">
                                        {tweet.content}
                                    </p>

                                    {/* Media Grid - Improved with spacing and borders */}
                                    {tweet.media?.length > 0 && (
                                        <div className={`mt-3 grid gap-2 rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm ${tweet.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                            {tweet.media.map((m: any) => (
                                                <div key={m.id_media} className="relative aspect-video overflow-hidden bg-slate-100">
                                                    <SafeImage
                                                        src={m.url_media}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out cursor-zoom-in"
                                                        alt="Media Content"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* --- ACTION BAR --- */}
                                    <div className="flex items-center justify-between pt-3 max-w-sm ml-2">
                                        <button
                                            onClick={() => toggleLike(tweet.id_tweet)}
                                            className={`group/btn flex items-center gap-1.5 transition-all duration-300 ${tweet.likes?.length > 0 ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'}`}
                                        >
                                            <div className={`p-2 rounded-full transition-all duration-300 ${tweet.likes?.length > 0 ? 'bg-rose-50' : 'group-hover/btn:bg-rose-50'}`}>
                                                <Heart
                                                    size={18}
                                                    fill={tweet.likes?.length > 0 ? "currentColor" : "none"}
                                                    className={`transition-transform duration-300 ${tweet.likes?.length > 0 ? "scale-110" : "group-active/btn:scale-125"}`}
                                                />
                                            </div>
                                            <span className="text-[13px] font-black tabular-nums">{tweet._count?.likes || 0}</span>
                                        </button>

                                        <button
                                            onClick={() => setActiveCommentId(activeCommentId === tweet.id_tweet ? null : tweet.id_tweet)}
                                            className="group/btn flex items-center gap-1.5 text-slate-400 hover:text-sky-500 transition-all duration-300"
                                        >
                                            <div className="p-2 rounded-full group-hover/btn:bg-sky-50 transition-all">
                                                <MessageCircle size={18} className="group-active/btn:scale-110 transition-transform" />
                                            </div>
                                            <span className="text-[13px] font-black tabular-nums">{tweet._count?.comments || 0}</span>
                                        </button>
                                    </div>

                                    {/* --- COMMENT INPUT BOX --- */}
                                    {activeCommentId === tweet.id_tweet && (
                                        <div className="mt-4 flex gap-3 animate-in slide-in-from-top-3 fade-in duration-500 bg-indigo-50/40 p-4 rounded-[1.5rem] border border-indigo-100/50 ring-4 ring-indigo-50/20">
                                            <Avatar className="h-9 w-9 shrink-0 border-2 border-white shadow-sm">
                                                <AvatarImage src={(user as any)?.foto || (user as any)?.profile?.foto} />
                                                <AvatarFallback className="text-[10px] bg-indigo-600 text-white font-black">{user?.username?.[0].toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 flex gap-2">
                                                <input
                                                    autoFocus
                                                    placeholder="Tulis balasan Anda..."
                                                    className="bg-transparent border-none focus:ring-0 text-sm flex-1 font-semibold text-slate-700 placeholder:text-indigo-300 placeholder:font-normal"
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment(tweet.id_tweet)}
                                                />
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSendComment(tweet.id_tweet)}
                                                    className="bg-indigo-600 hover:bg-indigo-700 h-9 w-9 rounded-full p-0 shrink-0 shadow-lg shadow-indigo-200 transition-all active:scale-90"
                                                >
                                                    <Send size={15} className="ml-0.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- COMMENTS LIST SECTION --- */}
                                    {tweet.comments?.length > 0 && (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => toggleCommentVisibility(tweet.id_tweet)}
                                                className={`text-[11px] font-black flex items-center gap-1.5 uppercase tracking-wider py-1.5 px-3 rounded-full transition-all duration-300 ${showComments[tweet.id_tweet] ? 'bg-indigo-100 text-indigo-700' : 'text-indigo-600 hover:bg-indigo-50'}`}
                                            >
                                                {showComments[tweet.id_tweet] ? <ChevronUp size={14} strokeWidth={3} /> : <ChevronDown size={14} strokeWidth={3} />}
                                                {showComments[tweet.id_tweet] ? 'Sembunyikan Balasan' : `Lihat ${tweet.comments.length} Balasan`}
                                            </button>

                                            {showComments[tweet.id_tweet] && (
                                                <div className="mt-4 space-y-5 border-l-2 border-slate-100 ml-4 pl-6 animate-in fade-in slide-in-from-left-2 duration-500">
                                                    {tweet.comments.map((comment: any) => (
                                                        <div key={comment.id_comment} className="flex gap-3 relative group/comment">
                                                            {/* Visual branch connection */}
                                                            <div className="absolute -left-6 top-4 w-6 h-0.5 bg-slate-100 rounded-full"></div>

                                                            <Avatar className="h-8 w-8 shrink-0 border border-white shadow-sm group-hover/comment:ring-2 ring-indigo-50 transition-all">
                                                                <AvatarImage src={comment.author?.foto} />
                                                                <AvatarFallback className="text-[10px] bg-slate-100 text-slate-500 font-bold">{comment.author?.nama_lengkap?.[0].toUpperCase()}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 bg-slate-50/60 p-4 rounded-[1.2rem] border border-slate-100/50 hover:bg-white hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-black text-[13px] text-slate-900 leading-none hover:text-indigo-600 cursor-pointer">{comment.author?.nama_lengkap}</span>
                                                                        <span className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: id })}</span>
                                                                    </div>
                                                                </div>
                                                                <p className="text-[14px] text-slate-600 leading-relaxed font-medium">{comment.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="h-20" />
        </div>
    );
}