/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useProfile = () => {
    const [isLoading, setIsLoading] = useState(false);

    // Ambil data profile lengkap termasuk relasi Prodi & Fakultas
    const getProfileById = useCallback(async (id: number) => {
        setIsLoading(true);
        try {
            const response = await api.post('/master/profile', {
                action: 'GET_BY_ID',
                id
            });
            return response.data.data;
        } catch (error: any) {
            toast.error("Gagal memuat profil");
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateProfile = async (id: number, data: any) => {
        setIsLoading(true);
        try {
            const response = await api.post('/master/profile', {
                action: 'UPDATE',
                id,
                data
            });
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

    return { getProfileById, updateProfile, isLoading };
};