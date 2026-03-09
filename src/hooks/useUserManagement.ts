import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useUserManagement = (currentUser: any) => {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllUsers = useCallback(async () => {
        if (!currentUser) return;
        
        try {
            setIsLoading(true);
            
            const { data: rbacData } = await api.post('/rbac/users', {
                action: 'GET_ALL',
                page: 1,
                limit: 2000, 
            });

            let allUsers = rbacData.data;

            if (currentUser.role === 'ADMIN_FAKULTAS') {
                const adminProfileRes = await api.post('/master/profile', {
                    action: 'GET_BY_ID',
                    id: currentUser.id
                });
                const adminFakultasId = adminProfileRes.data?.data?.prodi?.fakultas_id;

                if (!adminFakultasId) {
                    toast.error('Profil Admin tidak memiliki Fakultas.');
                    setUsers([]);
                    setIsLoading(false);
                    return;
                }

                const allProfilesRes = await api.post('/master/profile', {
                    action: 'GET_ALL',
                    limit: 2000
                });
                const profilesData = allProfilesRes.data?.data || [];

                allUsers = allUsers.filter((u: any) => {
                    const userProfile = profilesData.find((p: any) => p.id_pengguna === u.id);
                    return userProfile && userProfile.prodi?.fakultas_id === adminFakultasId;
                });
            }

            setUsers(allUsers);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat daftar pengguna');
        } finally {
            setIsLoading(false);
        }
    }, [currentUser]);

    return { users, isLoading, fetchAllUsers };
};