/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useKarir = (userId?: number) => {
    const [karirs, setKarirs] = useState<any[]>([]);
    const [sektors, setSektors] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchKarirs = useCallback(async () => {
        if (!userId) return;
        setIsFetching(true);
        try {
            const response = await api.post('/master/karir-sektor/karir', {
                action: 'GET_ALL',
                userId
            });
            setKarirs(response.data.data);
        } catch (error) {
            console.error("Error fetching career", error);
        } finally {
            setIsFetching(false);
        }
    }, [userId]);

    const fetchSektors = useCallback(async () => {
        try {
            const response = await api.post('/master/karir-sektor/sektor', {
                action: 'GET_ALL'
            });
            setSektors(response.data.data);
        } catch (error) {
            console.error("Error fetching sectors", error);
        }
    }, []);

    const addKarir = async (data: any) => {
        setIsProcessing(true);
        try {
            const response = await api.post('/master/karir-sektor/karir', {
                action: 'CREATE',
                data: { ...data, id_pengguna: userId }
            });
            if (response.data.success) {
                toast.success("Pengalaman karir ditambahkan");
                fetchKarirs();
                return true;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menambah karir");
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    // FITUR BARU: Update Karir
    const updateKarir = async (id: number, data: any) => {
        setIsProcessing(true);
        try {
            const response = await api.post('/master/karir-sektor/karir', {
                action: 'UPDATE',
                id,
                data: { ...data, id_pengguna: userId }
            });
            if (response.data.success) {
                toast.success("Riwayat karir diperbarui");
                fetchKarirs();
                return true;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal memperbarui karir");
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const deleteKarir = async (id: number) => {
        setIsProcessing(true);
        try {
            await api.post('/master/karir-sektor/karir', { action: 'DELETE', id });
            toast.success("Riwayat dihapus");
            setKarirs(prev => prev.filter(k => k.id_karir !== id));
        } catch {
            toast.error("Gagal menghapus");
        } finally {
            setIsProcessing(false);
        }
    };

    return { karirs, sektors, isFetching, isProcessing, fetchKarirs, fetchSektors, addKarir, updateKarir, deleteKarir };
};