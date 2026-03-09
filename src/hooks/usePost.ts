/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const usePost = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

    const fetchPosts = useCallback(async (params: { page?: number; limit?: number; search?: string; status?: string; kategoriId?: number } = {}) => {
        try {
            setIsLoading(true);
            const { data } = await api.post('/master/post-kategori/post', { 
                action: 'GET_ALL', 
                ...params 
            });
            setPosts(data.data);
            if (data.meta) setMeta(data.meta);
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat data Postingan');
            return { data: [] };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getFileIdFromUrl = (url: string) => {
        if (!url) return null;
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const deleteMediaFromFileService = async (url: string) => {
        const fileId = getFileIdFromUrl(url);
        if (!fileId) return;
        try {
            await api.post('/file', { action: 'DELETE', id: fileId });
        } catch {
            console.error("Gagal menghapus file fisik:", fileId);
        }
    };

    const uploadThumbnail = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('action', 'UPLOAD');
        formData.append('folder', 'post_thumbnails');
        formData.append('isPublic', 'true');

        const res = await api.post('/file', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data.success) {
            const fileRecord = res.data.data;
            return `${api.defaults.baseURL}/file/view/${fileRecord.id}`;
        }
        throw new Error('Gagal upload thumbnail');
    };

    const createPost = async (postData: any, file?: File) => {
        try {
            setIsProcessing(true);
            let finalThumbnailUrl = postData.thumbnail || null;

            if (file) {
                finalThumbnailUrl = await uploadThumbnail(file);
            }

            const payload = {
                ...postData,
                thumbnail: finalThumbnailUrl
            };

            const { data } = await api.post('/master/post-kategori/post', {
                action: 'CREATE',
                data: payload
            });
            
            toast.success('Postingan berhasil ditambahkan');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menambah Postingan');
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    const updatePost = async (id: number, postData: any, file?: File, oldThumbnailUrl?: string) => {
        try {
            setIsProcessing(true);
            let finalThumbnailUrl = postData.thumbnail;

            if (file) {
                finalThumbnailUrl = await uploadThumbnail(file);
                if (oldThumbnailUrl) {
                    await deleteMediaFromFileService(oldThumbnailUrl);
                }
            }

            const payload = {
                ...postData,
                thumbnail: finalThumbnailUrl
            };

            const { data } = await api.post('/master/post-kategori/post', {
                action: 'UPDATE',
                id: id,
                data: payload
            });
            
            toast.success('Postingan berhasil diperbarui');
            return data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memperbarui Postingan');
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    const deletePost = async (id: number, thumbnailUrl?: string) => {
        try {
            setIsProcessing(true);
            
            if (thumbnailUrl) {
                await deleteMediaFromFileService(thumbnailUrl);
            }

            await api.post('/master/post-kategori/post', { action: 'DELETE', id });
            toast.success('Postingan berhasil dihapus');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menghapus Postingan');
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        posts, meta, isLoading, isProcessing,
        fetchPosts, createPost, updatePost, deletePost
    };
};