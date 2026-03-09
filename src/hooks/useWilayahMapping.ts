/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const useWilayahMapping = () => {
    // State untuk menyimpan data mapping & alumni
    const [statsProvinsi, setStatsProvinsi] = useState<any[]>([]);
    const [statsKabupaten, setStatsKabupaten] = useState<any[]>([]);
    const [alumniList, setAlumniList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch statistik sebaran alumni tingkat Provinsi
    const fetchStatsProvinsi = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.post('master/wilayah/', {
                action: 'GET_MAP_STATS_PROVINSI'
            });
            if (response.data.success) {
                setStatsProvinsi(response.data.data);
            }
        } catch {
            toast.error("Gagal memuat statistik sebaran provinsi");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch statistik sebaran alumni tingkat Kabupaten (Bisa di-filter per provinsi)
    const fetchStatsKabupaten = useCallback(async (kodeProvinsi?: string) => {
        setIsLoading(true);
        try {
            const payload: any = { action: 'GET_MAP_STATS_KABUPATEN' };
            
            // Masukkan data kode_provinsi jika parameter dikirim
            if (kodeProvinsi) {
                payload.data = { kode_provinsi: kodeProvinsi };
            }

            const response = await api.post('master/wilayah/', payload);
            if (response.data.success) {
                setStatsKabupaten(response.data.data);
            }
        } catch {
            toast.error("Gagal memuat statistik sebaran kabupaten");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch detail daftar alumni berdasarkan wilayah yang diklik di Peta
    const fetchAlumniByWilayah = useCallback(async (jenis: 'PROVINSI' | 'KABUPATEN', kode: string) => {
        setIsLoading(true);
        try {
            const response = await api.post('master/wilayah/', {
                action: 'GET_ALUMNI_BY_WILAYAH',
                data: {
                    jenis: jenis,
                    kode: kode
                }
            });
            if (response.data.success) {
                setAlumniList(response.data.data);
            }
        } catch {
            toast.error("Gagal memuat daftar alumni untuk wilayah ini");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { 
        statsProvinsi, 
        statsKabupaten, 
        alumniList, 
        isLoading, 
        fetchStatsProvinsi, 
        fetchStatsKabupaten, 
        fetchAlumniByWilayah 
    };
};