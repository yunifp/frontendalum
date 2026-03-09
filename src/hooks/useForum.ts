/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useForum = () => {
    const [profile, setProfile] = useState<any>(null);
    const [userTweets, setUserTweets] = useState<any[]>([]);
    const [stats, setStats] = useState({
        followingCount: 0,
        followersCount: 0,
        followingIds: [] as number[],
        followersIds: [] as number[]
    })
    const [tweets, setTweets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    // --- FETCH PROFILE DATA ---
    const fetchProfileData = useCallback(async (userId: number, currentUserId?: number) => {
        setIsLoading(true);
        try {
            // Ambil Data Profile
            const resProfile = await api.post('/master/profile', { action: 'GET_BY_ID', id: userId });
            // Ambil Statistik Follow (Termasuk List ID)
            const resStats = await api.post('/master/forum', { action: 'GET_SOCIAL_STATS', id: userId });
            // Ambil Feed User
            const resTweets = await api.post('/master/forum', {
                action: 'GET_FEED',
                userId: userId,
                limit: 50
            });

            if (resProfile.data.success) setProfile(resProfile.data.data);
            if (resStats.data.success) {
                const sData = resStats.data.data;
                setStats(sData);

                // Pengecekan status follow yang akurat: 
                // Jika ID saya ada di dalam daftar followersIds akun ini
                if (currentUserId) {
                    setIsFollowing(sData.followersIds.includes(currentUserId));
                }
            }
            if (resTweets.data.success) setUserTweets(resTweets.data.data);

        } catch (error) {
            console.error(error);
            toast.error("Gagal memuat profil pengguna");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- TOGGLE FOLLOW ---
    const toggleFollow = async (profileId: number) => {
        try {
            const response = await api.post('/master/forum', { action: 'TOGGLE_FOLLOW', id: profileId });
            if (response.data.success) {
                const isNowFollowing = response.data.data.following;

                // Sinkronkan state internal hook
                setIsFollowing(isNowFollowing);

                // Update statistik secara real-time
                setStats(prev => ({
                    ...prev,
                    followersCount: isNowFollowing ? prev.followersCount + 1 : prev.followersCount - 1
                }));

                toast.success(isNowFollowing ? "Berhasil mengikuti" : "Berhenti mengikuti");
                return isNowFollowing;
            }
        } catch (error) {
            console.error(error);
            toast.error("Gagal melakukan aksi follow");
        }
        return null;
    };

    // fetchFeed sekarang menerima isRefresh untuk bypass cache
    const fetchFeed = useCallback(async (page = 1, isRefresh = false) => {
        setIsLoading(true);
        try {
            const response = await api.post('/master/forum', {
                action: 'GET_FEED',
                page,
                limit: 20,
                // Cache Buster: Menambahkan timestamp agar URL/Payload dianggap unik oleh network/cache
                _t: isRefresh ? Date.now() : undefined
            });
            if (response.data.success) setTweets(response.data.data);
        } catch { toast.error("Gagal memuat feed"); }
        finally { setIsLoading(false); }
    }, []);

    const getFileIdFromUrl = (url: string) => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const deleteMediaFromFileService = async (url: string) => {
        const fileId = getFileIdFromUrl(url);
        try {
            await api.post('/file', { action: 'DELETE', id: fileId });
        } catch { console.error("Gagal menghapus file fisik:", fileId); }
    };

    const uploadMedia = async (files: File[]) => {
        const uploadedUrls: any[] = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('action', 'UPLOAD');
            formData.append('folder', 'forum');
            formData.append('isPublic', 'true');
            try {
                const res = await api.post('/file', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                if (res.data.success) {
                    const fileRecord = res.data.data;
                    uploadedUrls.push({
                        url: `${api.defaults.baseURL}/file/view/${fileRecord.id}`,
                        type: file.type.includes('video') ? 'video' : 'image'
                    });
                }
            } catch { toast.error(`Gagal upload: ${file.name}`); }
        }
        return uploadedUrls;
    };

    const createPost = async (content: string, visibility: string, files: File[]) => {
        setIsPosting(true);
        try {
            const mediaData = files.length > 0 ? await uploadMedia(files) : [];
            const response = await api.post('/master/forum', { action: 'CREATE_POST', data: { content, visibility, media: mediaData } });
            if (response.data.success) {
                toast.success("Diposting!");
                await fetchFeed(1, true); // Force refresh tanpa cache
                return true;
            }
        } catch { toast.error("Gagal mengirim"); return false; }
        finally { setIsPosting(false); }
    };

    // Di dalam useForum hook...

    const updatePost = async (id: number, content: string, visibility: string, mediaToDelete?: any[]) => {
        setIsPosting(true);
        try {
            if (mediaToDelete && mediaToDelete.length > 0) {
                // A. Hapus fisik di File Service (menggunakan URL)
                for (const media of mediaToDelete) {
                    await deleteMediaFromFileService(media.url_media);
                }
            }

            // B. Kirim ID media yang dihapus ke Forum Service agar record di DB hilang
            const deleteIds = mediaToDelete?.map(m => m.id_media) || [];

            const response = await api.post('/master/forum', {
                action: 'UPDATE_POST',
                id,
                data: {
                    content,
                    visibility,
                    mediaToDeleteIds: deleteIds
                }
            });

            if (response.data.success) {
                toast.success("Diperbarui!");
                await fetchFeed(1, true);
                return true;
            }
        } catch { toast.error("Gagal memperbarui"); return false; }
        finally { setIsPosting(false); }
    };

    const deletePost = async (id: number, mediaUrls: string[]) => {
        try {
            for (const url of mediaUrls) {
                await deleteMediaFromFileService(url);
            }
            const response = await api.post('/master/forum', { action: 'DELETE_POST', id });
            if (response.data.success) {
                toast.success("Postingan dihapus");
                setTweets(prev => prev.filter(t => t.id_tweet !== id));
                return true;
            }
        } catch { toast.error("Gagal menghapus"); return false; }
    };

    const toggleLike = async (tweetId: number) => {
        try {
            const response = await api.post('/master/forum', { action: 'TOGGLE_LIKE', id: tweetId });
            if (response.data.success) {
                const isLiked = response.data.data.liked;
                setTweets(prev => prev.map(t => t.id_tweet === tweetId ? {
                    ...t, likes: isLiked ? [{ user_id: 1 }] : [],
                    _count: { ...t._count, likes: isLiked ? t._count.likes + 1 : t._count.likes - 1 }
                } : t));
            }
        } catch (error) { console.error(error); }
    };

    const addComment = async (tweetId: number, content: string) => {
        try {
            const response = await api.post('/master/forum', { action: 'ADD_COMMENT', id: tweetId, data: { content } });
            if (response.data.success) {
                toast.success("Komentar dikirim");
                await fetchFeed(1, true); // Refresh feed untuk melihat komentar terbaru tanpa cache
                return true;
            }
        } catch { toast.error("Gagal mengirim komentar"); }
        return false;
    };

    return {
        tweets, isLoading, isPosting, fetchFeed, createPost, updatePost, deletePost, toggleLike, addComment, profile, userTweets, stats, fetchProfileData, isFollowing, toggleFollow
    };
};