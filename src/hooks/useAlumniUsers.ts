/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useAlumniUsers = () => {
    const [alumniList, setAlumniList] = useState<any[]>([]);

    // Master data untuk Filters
    const [uniqueAngkatan, setUniqueAngkatan] = useState<number[]>([]);
    const [uniqueTahunLulus, setUniqueTahunLulus] = useState<number[]>([]);
    const [masterFakultas, setMasterFakultas] = useState<any[]>([]);
    const [masterProdi, setMasterProdi] = useState<any[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });

    const fetchMasterFilters = useCallback(async () => {
        try {
            const [resAngkatan, resLulus, resFak, resProdi] = await Promise.all([
                api.post('/master/profile', { action: 'GET_UNIQUE_ANGKATAN' }).catch(() => ({ data: { data: [] } })),
                api.post('/master/profile', { action: 'GET_UNIQUE_TAHUN_LULUS' }).catch(() => ({ data: { data: [] } })),
                api.post('/master/fakultas-prodi/fakultas', { action: 'GET_ALL' }).catch(() => ({ data: { data: [] } })),
                api.post('/master/fakultas-prodi/prodi', { action: 'GET_ALL' }).catch(() => ({ data: { data: [] } }))
            ]);

            if (resAngkatan.data.success) setUniqueAngkatan(resAngkatan.data.data);
            if (resLulus.data.success) setUniqueTahunLulus(resLulus.data.data);
            setMasterFakultas(resFak.data?.data || []);
            setMasterProdi(resProdi.data?.data || []);
        } catch (error) {
            console.error("Gagal mengambil data master filter", error);
        }
    }, []);

    const fetchAlumni = useCallback(async (params: {
        page?: number;
        search?: string;
        angkatan?: string;
        tahunLulus?: string;
        fakultasId?: string;
        prodiId?: string;
    }) => {
        setIsLoading(true);
        try {
            // 1. Ambil data profil dari Master Service
            const resMaster = await api.post('/master/profile', {
                action: 'GET_ALL',
                page: params.page || 1,
                limit: 1000, // Tarik data agak besar agar filter manual role tidak membuat list kosong
                search: params.search,
                angkatan: params.angkatan,
                tahunLulus: params.tahunLulus,
                fakultasId: params.fakultasId,
                prodiId: params.prodiId
            });

            if (resMaster.data.success) {
                const profiles = resMaster.data.data;

                // 2. Gabungkan dengan data RBAC dan ambil rolenya
                const enrichedAlumni = await Promise.all(profiles.map(async (profile: any) => {
                    try {
                        const resUser = await api.post('/rbac/users/get-by-id', { id: profile.id_pengguna });
                        return {
                            ...profile,
                            email: resUser.data.data?.email,
                            hp: resUser.data.data?.hp,
                            role: resUser.data.data?.role // 👈 Ambil role untuk filter
                        };
                    } catch {
                        // Jika gagal ambil data rbac, kita beri role null agar otomatis terfilter out
                        return { ...profile, role: null };
                    }
                }));

                // 3. Filter HANYA yang role-nya 'USER'
                const finalData = enrichedAlumni.filter(a => a.role === 'USER');

                // Manual Client-Side Pagination (karena total berubah setelah filter USER)
                const limitPerPage = 12;
                const currentPage = params.page || 1;
                const startIndex = (currentPage - 1) * limitPerPage;
                const endIndex = startIndex + limitPerPage;
                const paginatedData = finalData.slice(startIndex, endIndex);

                setAlumniList(paginatedData);

                // Sesuaikan meta agar UI pagination berfungsi benar
                setMeta({
                    total: finalData.length,
                    page: currentPage,
                    limit: limitPerPage,
                    totalPages: Math.ceil(finalData.length / limitPerPage)
                });
            }
        } catch {
            toast.error("Gagal memuat data alumni");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const toggleFollow = async (targetId: number) => {
        try {
            const res = await api.post('/master/forum', {
                action: 'TOGGLE_FOLLOW',
                id: targetId
            });
            if (res.data.success) {
                toast.success(res.data.data.following ? "Berhasil mengikuti" : "Berhenti mengikuti");
                return res.data.data.following;
            }
        } catch (error: any) {
            toast.error(error.message || "Gagal melakukan aksi");
        }
        return null;
    };

    return {
        alumniList, isLoading, meta,
        fetchAlumni, toggleFollow,
        uniqueAngkatan, uniqueTahunLulus, masterFakultas, masterProdi,
        fetchMasterFilters
    };
};