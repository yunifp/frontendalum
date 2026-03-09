/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '../lib/axios';

export function useSystemLogs() {
    const [configs, setConfigs] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [audits, setAudits] = useState<any[]>([]);

    const [totalConfigs, setTotalConfigs] = useState<number>(0);
    const [totalActivities, setTotalActivities] = useState<number>(0);
    const [totalAudits, setTotalAudits] = useState<number>(0);
    const [servicesList, setServicesList] = useState<any[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    const fetchConfigs = useCallback(async (page = 1, search = '', limit = 10) => {
        setLoading(true);
        try {
            const response = await api.post('/logs/configs', { action: 'GET_ALL', page, limit, search });
            if (response.data.success) {
                setConfigs(response.data.data);
                setTotalConfigs(response.data.meta?.total || 0);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat konfigurasi log');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchActivities = useCallback(async (page = 1, search = '', limit = 10) => {
        setLoading(true);
        try {
            const response = await api.post('/logs/activities', { action: 'GET_ALL', page, limit, search });
            if (response.data.success) {
                setActivities(response.data.data);
                setTotalActivities(response.data.meta?.total || 0);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat aktivitas log');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAudits = useCallback(async (page = 1, search = '', limit = 10) => {
        setLoading(true);
        try {
            const response = await api.post('/logs/audits', { action: 'GET_ALL', page, limit, search });
            if (response.data.success) {
                setAudits(response.data.data);
                setTotalAudits(response.data.meta?.total || 0);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal memuat audit trail');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchServices = useCallback(async () => {
        try {
            const response = await api.post('/logs/services', { action: 'GET_ALL', limit: 100 });
            if (response.data?.success) setServicesList(response.data.data);
        } catch (error) {
            console.error('Gagal memuat master services:', error);
        }
    }, []);

    const submitConfig = useCallback(async (action: 'CREATE' | 'UPDATE', payload: any, id?: string) => {
        setLoading(true);
        try {
            const response = await api.post('/logs/configs', { action, id, data: payload });
            if (response.data.success) {
                toast.success(response.data.message || 'Konfigurasi berhasil disimpan');
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Terjadi kesalahan sistem');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteConfig = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const response = await api.post('/logs/configs', { action: 'DELETE', id });
            if (response.data.success) {
                toast.success('Konfigurasi berhasil dihapus');
                return true;
            }
            return false;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gagal menghapus data');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        configs, activities, audits, totalConfigs, totalActivities, totalAudits,
        servicesList, loading, fetchConfigs, fetchActivities, fetchAudits,
        fetchServices, submitConfig, deleteConfig
    };
}