/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface Fakultas {
    id_fakultas: number;
    nama: string;
    _count?: { prodis: number };
}

export interface Prodi {
    id_prodi: number;
    fakultas_id: number;
    nama: string;
    fakultas?: Fakultas;
}

export const useFakultasProdi = (isPublic: boolean = false) => {
    const [fakultasList, setFakultasList] = useState<Fakultas[]>([]);
    const [prodiList, setProdiList] = useState<Prodi[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchPublicFakultas = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await api.post('/master/fakultas-prodi/public/fakultas', { action: 'GET_ALL' });
            setFakultasList(data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat data Fakultas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchPublicProdi = useCallback(async (searchQuery = '', fakultasId?: number) => {
        try {
            setIsLoading(true);
            const { data } = await api.post('/master/fakultas-prodi/public/prodi', { 
                action: 'GET_ALL',
                search: searchQuery,
                fakultasId
            });
            setProdiList(data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat data Prodi');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- FUNGSI PRIVATE (Butuh Token) ---
    const fetchFakultas = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await api.post('/master/fakultas-prodi/fakultas', { action: 'GET_ALL' });
            setFakultasList(data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat data Fakultas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchProdi = useCallback(async (searchQuery = '', fakultasId?: number) => {
        try {
            setIsLoading(true);
            const { data } = await api.post('/master/fakultas-prodi/prodi', { 
                action: 'GET_ALL',
                search: searchQuery,
                fakultasId
            });
            setProdiList(data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat data Prodi');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- EFFECT: Panggil yang public ATAU private sesuai parameter ---
    useEffect(() => {
        if (isPublic) {
            fetchPublicFakultas();
            fetchPublicProdi();
        } else {
            fetchFakultas();
            fetchProdi();
        }
    }, [isPublic, fetchPublicFakultas, fetchPublicProdi, fetchFakultas, fetchProdi]);

    // --- FUNGSI MUTASI (Hanya Private) ---
    const handleCreateFakultas = async (nama: string) => {
        try {
            setIsProcessing(true);
            await api.post('/master/fakultas-prodi/fakultas', { action: 'CREATE', data: { nama } });
            toast.success('Fakultas berhasil ditambahkan');
            await fetchFakultas();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menambah Fakultas');
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateFakultas = async (id: number, nama: string) => {
        try {
            setIsProcessing(true);
            await api.post('/master/fakultas-prodi/fakultas', { action: 'UPDATE', id, data: { nama } });
            toast.success('Fakultas berhasil diperbarui');
            await fetchFakultas();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memperbarui Fakultas');
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteFakultas = async (id: number) => {
        try {
            setIsProcessing(true);
            await api.post('/master/fakultas-prodi/fakultas', { action: 'DELETE', id });
            toast.success('Fakultas berhasil dihapus');
            await fetchFakultas();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menghapus Fakultas');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCreateProdi = async (nama: string, fakultas_id: number) => {
        try {
            setIsProcessing(true);
            await api.post('/master/fakultas-prodi/prodi', { 
                action: 'CREATE', 
                data: { nama, fakultas_id } 
            });
            toast.success('Program Studi berhasil ditambahkan');
            await fetchProdi();
            await fetchFakultas();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menambah Program Studi');
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateProdi = async (id: number, nama: string, fakultas_id: number) => {
        try {
            setIsProcessing(true);
            await api.post('/master/fakultas-prodi/prodi', { action: 'UPDATE', id, data: { nama, fakultas_id } });
            toast.success('Program Studi berhasil diperbarui');
            await fetchProdi();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memperbarui Program Studi');
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeleteProdi = async (id: number) => {
        try {
            setIsProcessing(true);
            await api.post('/master/fakultas-prodi/prodi', { action: 'DELETE', id });
            toast.success('Program Studi berhasil dihapus');
            await fetchProdi();
            await fetchFakultas();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menghapus Program Studi');
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        fakultasList, prodiList, isLoading, isProcessing,
        fetchPublicFakultas, fetchPublicProdi, // Ekspor fungsi public
        fetchFakultas, handleCreateFakultas, handleUpdateFakultas, handleDeleteFakultas,
        fetchProdi, handleCreateProdi, handleUpdateProdi, handleDeleteProdi
    };
};