import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export interface UserData {
    id: number;
    nim: string;
    username: string;
    email: string;
    hp: string;
    role: string;
    status: string;
    createdAt: string;
}

export const useVerification = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data } = await api.post('/rbac/users', {
                action: 'GET_ALL',
                role: 'USER',
                page: 1,
                limit: 100,
                status: 'PENDING',
            });

            setUsers(data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat data pengguna', {
                id: 'fetch-users-error'
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleUpdateStatus = async (id: number, newStatus: 'ACTIVE' | 'REJECTED') => {
        try {
            setProcessingId(id);
            await api.post('/rbac/users', {
                action: 'UPDATE_STATUS',
                id: id,
                data: { status: newStatus }
            });

            toast.success(`User berhasil di-${newStatus === 'ACTIVE' ? 'aktivasi' : 'tolak'}`, {
                id: 'update-status-toast'
            });
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal mengubah status user', {
                id: 'update-status-toast'
            });
        } finally {
            setProcessingId(null);
        }
    };

    return {
        users,
        isLoading,
        processingId,
        fetchUsers,
        handleUpdateStatus
    };
};