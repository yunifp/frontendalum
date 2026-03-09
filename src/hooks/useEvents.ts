/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [singleEvent, setSingleEvent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 9 });

    const fetchEvents = useCallback(async (page = 1, search = '') => {
        setIsLoading(true);
        try {
            const response = await api.post('/master/post-kategori/public/post', {
                action: 'GET_ALL',
                kategoriId: 2,
                status: 'PUBLISHED',
                page,
                limit: 9,
                search
            });
            if (response.data.success) {
                setEvents(response.data.data);
                setMeta(response.data.meta);
            }
        } catch {
            toast.error("Gagal memuat daftar event");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchEventDetail = useCallback(async (slug: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('/master/post-kategori/public/post', {
                action: 'GET_BY_SLUG',
                slug: slug
            });
            if (response.data.success) {
                setSingleEvent(response.data.data);
                // Trigger increment view
                api.post('/master/post-kategori/post', { action: 'INCREMENT_VIEW', id: response.data.data.id_post });
            }
        } catch {
            toast.error("Event tidak ditemukan");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { events, singleEvent, isLoading, meta, fetchEvents, fetchEventDetail };
};