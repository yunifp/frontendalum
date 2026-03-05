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

export interface AlumniProfile {
    fullName?: string;
    avatar?: string;
    birthPlace?: string;
    birthDate?: string;
    address?: string;
    angkatan?: number;
    graduationYear?: number;
    wisudaDate?: string;
    agama?: string;
    jenjang?: string;
    gender?: string;
    thesisTitle?: string;
    degree?: string;
    fakultas?: string;
    prodi?: string;
    sosialMedia?: {
        linkedin?: string;
        instagram?: string;
    };
}

export interface AlumniDetail extends UserData {
    profile?: AlumniProfile;
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

            const { data } = await api.post('/rbac/users', {
                action: 'GET_ALL',
                role: 'USER',
                page: 1,
                limit: 100,
                search: searchQuery
            });

            setAlumni(data.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat data alumni');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchAlumniDetail = useCallback(async (userId: number) => {
        try {
            setIsDetailLoading(true);

            const userRes = await api.post('/rbac/users/get-by-id', { id: userId });
            const userData = userRes.data.data;

            try {
                const profileRes = await api.post('/master/profile', {
                    action: 'GET_BY_ID',
                    id: userId
                });

                if (profileRes.data.success) {
                    const p = profileRes.data.data;

                    // Mapping sesuai response API yang baru
                    userData.profile = {
                        fullName: p.nama_lengkap,
                        avatar: p.foto,
                        birthPlace: p.tempat_lahir,
                        birthDate: p.tanggal_lahir ? new Date(p.tanggal_lahir).toLocaleDateString('id-ID') : 'Belum diisi',
                        angkatan: p.angkatan,
                        graduationYear: p.tahun_lulus,
                        wisudaDate: p.tanggal_wisuda,
                        agama: p.agama,
                        jenjang: p.jenjang,
                        gender: p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan',
                        thesisTitle: p.judul_skripsi,
                        degree: p.gelar,
                        // Sesuai struktur: p.prodi.fakultas.nama
                        fakultas: p.prodi?.fakultas?.nama,
                        prodi: p.prodi?.nama,
                        sosialMedia: {
                            linkedin: p.sosial_media?.linkedin,
                            instagram: p.sosial_media?.instagram
                        }
                    };
                }

            } catch (err) {
                console.error('Gagal mengambil profile', err);
            }

            setDetailData(userData);

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat detail alumni');
        } finally {
            setIsDetailLoading(false);
        }
    }, []);

    const handleUpdateUser = async (id: number, updateData: Partial<UserData>) => {
        try {
            setProcessingId(id);

            await api.post('/rbac/users', {
                action: 'UPDATE',
                id: id,
                data: updateData
            });

            toast.success('Data user berhasil diperbarui');

            fetchAlumniDetail(id);

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal update user');
        } finally {
            setProcessingId(null);
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: 'ACTIVE' | 'REJECTED' | 'DEACTIVATED') => {
        try {
            setProcessingId(id);
            await api.post('/rbac/users', {
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
        fetchAlumni,
        fetchAlumniDetail,
        handleUpdateUser,
        handleUpdateStatus
    };
};