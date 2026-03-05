/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface SektorPekerjaan {
    id_sektor: string;
    nama_sektor: string;
    _count?: { karirs: number };
}

export const useSektorPekerjaan = () => {
    const [sektorList, setSektorList] = useState<SektorPekerjaan[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchSektors = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await api.post('/master/karir-sektor/sektor', { action: 'GET_ALL' });
            setSektorList(data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat data Sektor');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSektors();
    }, [fetchSektors]);

    const handleCreateSektor = async (id_sektor: string, nama_sektor: string) => {
        try {
            setIsProcessing(true);
            await api.post('/master/karir-sektor/sektor', {
                action: 'CREATE',
                data: { id_sektor, nama_sektor }
            });
            toast.success('Sektor berhasil ditambahkan');
            await fetchSektors();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menambah Sektor');
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateSektor = async (id: string, nama_sektor: string) => {
        try {
            setIsProcessing(true);
            // Menggunakan endpoint yang sama dengan pola action UPDATE
            await api.post('/master/karir-sektor/sektor', {
                action: 'UPDATE',
                id,
                data: { nama_sektor }
            });
            toast.success('Sektor berhasil diperbarui');
            await fetchSektors();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memperbarui Sektor');
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteSektor = async (id: string) => {
        try {
            setIsProcessing(true);
            await api.post('/master/karir-sektor/sektor', { action: 'DELETE', id });
            toast.success('Sektor berhasil dihapus');
            await fetchSektors();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menghapus Sektor');
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        sektorList,
        isLoading,
        isProcessing,
        fetchSektors,
        handleCreateSektor,
        handleUpdateSektor,
        handleDeleteSektor
    };
};