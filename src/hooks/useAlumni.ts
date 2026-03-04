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

export interface AlumniDetail extends UserData {
  profile?: {
    fullName: string;
    address: string;
    birthDate: string;
    graduationYear: string;
    fakultas: string;
    prodi: string;
    avatar?: string;
  };
  pekerjaan?: {
    company: string;
    position: string;
    startDate: string;
  }[];
}

export const useAlumni = () => {
  const [alumni, setAlumni] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<AlumniDetail | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchAlumni = useCallback(async (searchQuery = '') => {
    try {
      setIsLoading(true);
      const { data } = await api.post('/users', {
        action: 'GET_ALL',
        role: 'USER',
        page: 1,
        limit: 100,
        search: searchQuery
      });
      
      setAlumni(data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memuat data alumni', {
        id: 'fetch-alumni-error'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAlumniDetail = async (userId: number) => {
    try {
      setIsDetailLoading(true);
      const { data } = await api.post('/users', {
        action: 'GET_DETAIL',
        id: userId
      });
      
      setDetailData(data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memuat detail alumni', {
        id: 'fetch-detail-error'
      });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: 'ACTIVE' | 'REJECTED' | 'DEACTIVATED') => {
    try {
      setProcessingId(id);
      await api.post('/users', {
        action: 'UPDATE_STATUS',
        id: id,
        data: { status: newStatus }
      });

      toast.success(`Status pengguna berhasil diubah menjadi ${newStatus}`, {
        id: 'update-status-toast'
      });
      fetchAlumni();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengubah status pengguna', {
        id: 'update-status-toast'
      });
    } finally {
      setProcessingId(null);
    }
  };

  return {
    alumni,
    isLoading,
    isDetailLoading,
    detailData,
    processingId,
    setDetailData,
    fetchAlumni,
    fetchAlumniDetail,
    handleUpdateStatus
  };
};