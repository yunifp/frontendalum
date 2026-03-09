/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useAlumni = (currentUser?: any) => {
    const [alumniList, setAlumniList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

    const fetchAlumni = useCallback(async (params: {
        page?: number;
        limit?: number;
        search?: string;
        prodiId?: string | number;
        fakultasId?: string | number;
        angkatan?: string | number;
        tahunLulus?: string | number;
        agama?: string;
        jenjang?: string;
        gender?: string;
        provinsi?: string;
        kabupaten?: string;
    } = {}) => {
        if (!currentUser) return;
        setIsLoading(true);
        try {
            let forcedFakultasId = params.fakultasId;

            if (currentUser.role === 'ADMIN_FAKULTAS') {
                const adminProfileRes = await api.post('/master/profile', {
                    action: 'GET_BY_ID',
                    id: currentUser.id
                });
                const adminFakultasId = adminProfileRes.data?.data?.prodi?.fakultas_id;

                if (!adminFakultasId) {
                    toast.error('Profil Admin tidak memiliki data Fakultas.');
                    setAlumniList([]);
                    setIsLoading(false);
                    return;
                }

                forcedFakultasId = adminFakultasId;
            }

            const cleanParam = (val: any) => (val === 'all' || val === '') ? undefined : val;

            const resMaster = await api.post('/master/profile', {
                action: 'GET_ALL',
                page: params.page || 1,
                limit: params.limit || 10,
                search: cleanParam(params.search),
                prodiId: cleanParam(params.prodiId),
                fakultasId: cleanParam(forcedFakultasId),
                angkatan: cleanParam(params.angkatan),
                tahunLulus: cleanParam(params.tahunLulus),
                agama: cleanParam(params.agama),
                jenjang: cleanParam(params.jenjang),
                gender: cleanParam(params.gender),
                provinsi: cleanParam(params.provinsi),
                kabupaten: cleanParam(params.kabupaten)
            });

            if (resMaster.data.success) {
                const profiles = resMaster.data.data;

                const enrichedAlumni = await Promise.all(profiles.map(async (profile: any) => {
                    try {
                        const resUser = await api.post('/rbac/users/get-by-id', { id: profile.id_pengguna });
                        const userData = resUser.data.data;
                        return {
                            ...profile,
                            id: userData?.id || profile.id_pengguna,
                            username: userData?.username || 'User',
                            email: userData?.email || '-',
                            hp: userData?.hp || '-',
                            nim: userData?.nim || profile.nim || '-',
                            status: userData?.status || 'PENDING',
                            createdAt: userData?.createdAt
                        };
                    } catch {
                        return { ...profile, username: 'User', status: 'PENDING' };
                    }
                }));

                setAlumniList(enrichedAlumni);
                setMeta(resMaster.data.meta);
            }
        } catch {
            toast.error("Gagal memuat data alumni");
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    const handleUpdateStatus = async (userId: number, newStatus: string) => {
        try {
            const res = await api.post('/rbac/users', {
                action: 'UPDATE_STATUS',
                id: userId,
                data: { status: newStatus }
            });
            if (res.data.success) {
                toast.success("Status berhasil diperbarui");
                return true;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal update status");
        }
        return false;
    };

    return { alumniList, isLoading, meta, fetchAlumni, handleUpdateStatus };
};