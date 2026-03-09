/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useNews = () => {
    const [newsList, setNewsList] = useState<any[]>([]);
    const [singleNews, setSingleNews] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });

    const fetchNews = useCallback(async (page = 1, search = '') => {
        setIsLoading(true);
        try {
            const response = await api.post('/master/post-kategori/public/post', {
                action: 'GET_ALL',
                kategoriId: 1, // Khusus Berita
                status: 'PUBLISHED',
                page,
                limit: 10,
                search
            });
            if (response.data.success) {
                setNewsList(response.data.data);
                setMeta(response.data.meta);
            }
        } catch {
            toast.error("Gagal memuat berita");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchNewsDetail = useCallback(async (slug: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('/master/post-kategori/public/post', {
                action: 'GET_BY_SLUG',
                slug: slug, // Dikirim di root body
            });

            if (response.data.success && response.data.data) {
                const foundNews = response.data.data;
                setSingleNews(foundNews);

                api.post('/master/post-kategori/public/post', {
                    action: 'INCREMENT_VIEW',
                    id: foundNews.id_post
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Berita tidak ditemukan");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { newsList, singleNews, isLoading, meta, fetchNews, fetchNewsDetail };
};