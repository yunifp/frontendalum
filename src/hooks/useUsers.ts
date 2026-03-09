/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useUsers = (currentUser?: any) => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [total, setTotal] = useState(0);

    // Menyimpan master data untuk Fakultas dan Prodi
    const [masterFakultas, setMasterFakultas] = useState<any[]>([]);
    const [masterProdi, setMasterProdi] = useState<any[]>([]);

    // Menyimpan profil admin yang sedang login untuk proteksi akses
    const [myProfile, setMyProfile] = useState<any>(null);

    // --- FETCH CURRENT ADMIN PROFILE ---
    useEffect(() => {
        if (currentUser && ['ADMIN_FAKULTAS', 'ADMIN_PRODI'].includes(currentUser.role)) {
            api.post('/master/profile', { action: 'GET_BY_ID', id: currentUser.id })
                .then(res => {
                    if (res.data.success) setMyProfile(res.data.data);
                })
                .catch(() => console.error("Gagal memuat profil admin"));
        }
    }, [currentUser]);

    // --- FETCH MASTER DATA ---
    const fetchMasterData = useCallback(async () => {
        try {
            const [resFak, resProdi] = await Promise.all([
                api.post('/master/fakultas-prodi/fakultas', { action: 'GET_ALL' }).catch(() => ({ data: { data: [] } })),
                api.post('/master/fakultas-prodi/prodi', { action: 'GET_ALL' }).catch(() => ({ data: { data: [] } }))
            ]);
            setMasterFakultas(resFak.data?.data || []);
            setMasterProdi(resProdi.data?.data || []);
        } catch (error) {
            console.error("Gagal memuat data master fakultas/prodi", error);
        }
    }, []);

    // --- FETCH USERS ---
    const fetchUsers = useCallback(async (
        page = 1,
        search = '',
        role = 'all',
        status = 'all',
        fakultasId = 'all',
        prodiId = 'all'
    ) => {
        if (!currentUser) return;
        setIsLoading(true);
        try {
            const isAdminFakultas = currentUser.role === 'ADMIN_FAKULTAS';
            const isAdminProdi = currentUser.role === 'ADMIN_PRODI';

            // Jika role terbatas atau filter aktif, tarik data skala besar untuk difilter JS
            const isClientSideFilter = isAdminFakultas || isAdminProdi || fakultasId !== 'all' || prodiId !== 'all';
            const limitToFetch = isClientSideFilter ? 2000 : 10;
            const pageToFetch = isClientSideFilter ? 1 : page;

            // 1. Fetch Users dari RBAC Service
            const res = await api.post('/rbac/users', {
                action: 'GET_ALL',
                page: pageToFetch,
                limit: limitToFetch,
                search,
                role: role !== 'all' ? role : undefined,
                status: status !== 'all' ? status : undefined
            });

            if (res.data.success) {
                const allUsers = res.data.data;
                let finalTotal = res.data.total;

                // 2. Ambil Profile dari DB Master untuk digabungkan
                const allProfilesRes = await api.post('/master/profile', {
                    action: 'GET_ALL',
                    limit: 2000
                });
                const profilesData = allProfilesRes.data?.data || [];

                // 3. Gabungkan Data (User + Profile)
                let enrichedUsers = allUsers.map((u: any) => {
                    const profile = profilesData.find((p: any) => p.id_pengguna === u.id);
                    return { ...u, profile: profile || null };
                });

                // 4. Client-side Filtering berdasarkan Role & Inputan
                if (isClientSideFilter) {
                    let targetFakultasId = fakultasId;
                    let targetProdiId = prodiId;

                    if (isAdminFakultas || isAdminProdi) {
                        const adminProfile = profilesData.find((p: any) => p.id_pengguna === currentUser.id);

                        if (isAdminFakultas) {
                            targetFakultasId = adminProfile?.fakultas_id ? String(adminProfile.fakultas_id) : 'none';
                        } else if (isAdminProdi) {
                            targetFakultasId = adminProfile?.fakultas_id ? String(adminProfile.fakultas_id) : 'none';
                            targetProdiId = adminProfile?.program_studi_id ? String(adminProfile.program_studi_id) : 'none';
                        }

                        // Cegah jika profil admin rusak / belum disetting
                        if (targetFakultasId === 'none' || (isAdminProdi && targetProdiId === 'none')) {
                            toast.error('Profil Admin Anda belum terkonfigurasi dengan lengkap.');
                            setUsers([]);
                            setTotal(0);
                            setIsLoading(false);
                            return;
                        }
                    }

                    enrichedUsers = enrichedUsers.filter((u: any) => {
                        const matchFakultas = targetFakultasId === 'all' || String(u.profile?.fakultas_id) === String(targetFakultasId);
                        const matchProdi = targetProdiId === 'all' || String(u.profile?.program_studi_id) === String(targetProdiId);
                        return matchFakultas && matchProdi;
                    });

                    // Update Pagination sesuai dengan jumlah data yang sudah difilter manual
                    finalTotal = enrichedUsers.length;
                    enrichedUsers = enrichedUsers.slice((page - 1) * 10, page * 10);
                }

                setUsers(enrichedUsers);
                setTotal(finalTotal);
            }
        } catch {
            toast.error("Gagal memuat data pengguna");
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    // --- SUBMIT USER ---
    const submitUser = async (action: 'CREATE' | 'UPDATE', data: any, id?: number) => {
        setIsProcessing(true);
        try {
            // Proteksi Tambahan: Override paksa data berdasarkan role admin
            if (currentUser.role === 'ADMIN_FAKULTAS' && myProfile) {
                data.fakultas_id = myProfile.fakultas_id;
                if (data.role === 'ADMIN' || data.role === 'ADMIN_FAKULTAS') {
                    toast.error('Akses ditolak: Anda tidak dapat membuat role ini.');
                    setIsProcessing(false);
                    return false;
                }
            } else if (currentUser.role === 'ADMIN_PRODI' && myProfile) {
                data.fakultas_id = myProfile.fakultas_id;
                data.program_studi_id = myProfile.program_studi_id;
                data.role = 'USER'; // Paksa role menjadi USER untuk ADMIN_PRODI
            }

            // Pisahkan data profile dari data rbac
            const { nama_lengkap, program_studi_id, fakultas_id, ...rbacData } = data;

            // 1. Simpan/Update ke RBAC
            const res = await api.post('/rbac/users', { action, data: rbacData, id });

            if (res.data.success) {
                const userId = id || res.data.data.id;

                // 2. Simpan/Update ke Master Profile
                if (nama_lengkap || program_studi_id || fakultas_id) {
                    try {
                        const profileAction = action === 'CREATE' ? 'CREATE' : 'UPDATE';
                        const profileEndpoint = action === 'CREATE' ? '/master/create-profile' : '/master/profile';

                        await api.post(profileEndpoint, {
                            action: profileAction,
                            id: userId,
                            id_pengguna: userId,
                            data: {
                                nama_lengkap: nama_lengkap || rbacData.username,
                                program_studi_id: program_studi_id ? Number(program_studi_id) : null,
                                fakultas_id: fakultas_id ? Number(fakultas_id) : null
                            }
                        });
                    } catch (profileError) {
                        console.error("Gagal sinkronisasi profil:", profileError);
                        toast.warning("Akun terbuat, tapi gagal menyimpan profil ke Master");
                    }
                }

                toast.success(id ? "User diperbarui" : "User ditambahkan");
                return true;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Terjadi kesalahan");
        } finally {
            setIsProcessing(false);
        }
        return false;
    };

    // --- DELETE USER ---
    const deleteUser = async (id: number) => {
        try {
            const res = await api.post('/rbac/users', { action: 'DELETE', id });
            if (res.data.success) {
                toast.success("User berhasil dihapus");
                return true;
            }
        } catch {
            toast.error("Gagal menghapus user");
        }
        return false;
    };

    return {
        users, isLoading, isProcessing, total,
        fetchUsers, submitUser, deleteUser,
        masterFakultas, masterProdi, fetchMasterData, myProfile
    };
};