/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [prodis, setProdis] = useState<any[]>([]);
    const [fakultas, setFakultas] = useState<any[]>([]);
    const [provinsis, setProvinsis] = useState<any[]>([]);
    const [kabupatens, setKabupatens] = useState<any[]>([]);

    const uploadFoto = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('action', 'UPLOAD');
        formData.append('folder', 'profiles');
        formData.append('isPublic', 'true');

        try {
            const res = await api.post('/file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                return `${api.defaults.baseURL}/file/view/${res.data.data.id}`;
            }
        } catch {
            toast.error("Gagal mengunggah foto profil");
            return null;
        }
    };

    // --- FUNGSI HAPUS FOTO LAMA ---
    const deleteOldFoto = async (photoUrl: string) => {
        if (!photoUrl) return;
        const fileId = photoUrl.split('/').pop();
        try {
            await api.post('/file', { action: 'DELETE', id: fileId });
        } catch {
            console.error("Gagal menghapus file lama di storage");
        }
    };

    const getProfileById = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const response = await api.post('/master/profile', { action: 'GET_BY_ID', id });
            return response.data.data;
        } catch {
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchFakultas = useCallback(async () => {
        try {
            const response = await api.post('/master/fakultas-prodi/fakultas', { action: 'GET_ALL' });
            setFakultas(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchProdis = useCallback(async () => {
        try {
            const response = await api.post('/master/fakultas-prodi/prodi', { action: 'GET_ALL' });
            setProdis(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchProvinsis = useCallback(async () => {
        try {
            const response = await api.post('/master/wilayah/', { action: 'GET_PROVINSI' });
            setProvinsis(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const fetchKabupatens = useCallback(async (kodeProvinsi: string) => {
        if (!kodeProvinsi) return;
        try {
            const response = await api.post('/master/wilayah/', {
                action: 'GET_KABUPATEN',
                data: { kode_provinsi: kodeProvinsi }
            });
            setKabupatens(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const updateProfile = async (id: number, data: any) => {
        setIsLoading(true);
        try {
            const response = await api.post('/master/profile', { action: 'UPDATE', id, data });
            if (response.data.success) {
                toast.success("Profil berhasil diperbarui!");
                return response.data.data;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal update profil");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        getProfileById, updateProfile, fetchProdis, prodis,
        fetchProvinsis, provinsis, fetchKabupatens, kabupatens,
        isLoading, uploadFoto, deleteOldFoto, fetchFakultas, fakultas
    };
};