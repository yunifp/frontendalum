/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [fakultasList, setFakultasList] = useState<any[]>([]);
    const [prodiList, setProdiList] = useState<any[]>([]);

    // 1. Fetch Daftar Fakultas
    const fetchFakultas = useCallback(async () => {
        try {
            const resFak = await api.post('/master/fakultas-prodi/public/fakultas', { action: 'GET_ALL' })
                .catch(() => ({ data: { data: [] } }));
            setFakultasList(resFak.data?.data || []);
        } catch (error) {
            console.error("Gagal mengambil data fakultas", error);
        }
    }, []);

    // 2. Fetch Daftar Prodi berdasarkan Fakultas ID
    const fetchProdi = useCallback(async (fakultasId: string) => {
        try {
            const resProdi = await api.post('/master/fakultas-prodi/public/prodi', { action: 'GET_ALL' })
                .catch(() => ({ data: { data: [] } }));
            const allProdi = resProdi.data?.data || [];

            // Filter prodi agar hanya muncul yang sesuai dengan fakultas_id
            const filteredProdi = allProdi.filter((p: any) => String(p.fakultas_id) === String(fakultasId));
            setProdiList(filteredProdi);
        } catch (error) {
            console.error("Gagal mengambil data program studi", error);
        }
    }, []);

    // 3. Proses Registrasi User + Create Profile
    const registerUser = async (formData: any, selectedFakultas: string, selectedProdi: string) => {
        if (!selectedFakultas || !selectedProdi) {
            toast.error('Silakan pilih Fakultas dan Program Studi terlebih dahulu');
            return false;
        }

        setIsLoading(true);
        try {
            // A. Register Akun di DB RBAC
            const response = await api.post('/auth/register', formData);
            const data = response.data;

            if (!data.success) {
                toast.error(data.message || 'Registrasi gagal');
                return false;
            }

            const userId = data.user.id; // Sesuaikan dengan struktur response backend Anda

            // B. Create Profil di DB Master
            await api.post('/master/create-profile', {
                id_pengguna: userId,
                nama_lengkap: formData.nama_lengkap,
                fakultas_id: Number(selectedFakultas), // Menyimpan Fakultas ID
                program_studi_id: Number(selectedProdi) // Menyimpan Prodi ID
            });

            toast.success(response.data.message || 'Registrasi berhasil! Silakan login.');
            return true; // Berhasil
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat registrasi';
            toast.error(errorMessage);
            console.error("Register Flow Error:", error);
            return false; // Gagal
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        fakultasList,
        prodiList,
        fetchFakultas,
        fetchProdi,
        registerUser
    };
};