import { useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
}

export interface MetaPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [meta, setMeta] = useState<MetaPagination | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async (page: number = 1, limit: number = 10, search: string = ''): Promise<void> => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/notifications', { action: 'GET_ALL', page, limit, search });
      if (data.success) {
        setNotifications(data.data);
        setMeta({
          total: data.total,
          page,
          limit,
          totalPages: Math.ceil(data.total / limit)
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memuat data notifikasi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async (): Promise<void> => {
    try {
      const { data } = await api.post('/notifications', { action: 'GET_UNREAD_COUNT' });
      if (data.success) {
        setUnreadCount(data.data);
      }
    } catch (error: any) {
      console.error(error);
    }
  }, []);

  const markAsRead = async (id: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/notifications', { action: 'MARK_AS_READ', id });
      if (data.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
        window.dispatchEvent(new Event('notificationUpdated'));
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menandai notifikasi');
      return false;
    }
  };

  const getNotificationById = async (id: string): Promise<Notification | null> => {
    try {
      const { data } = await api.post('/notifications', { action: 'GET_BY_ID', id });
      if (data.success) {
        return data.data;
      }
      return null;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memuat detail notifikasi');
      return null;
    }
  };

  const deleteNotification = async (id: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/notifications', { action: 'DELETE', id });
      if (data.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        window.dispatchEvent(new Event('notificationUpdated'));
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menghapus notifikasi');
      return false;
    }
  };

  return { 
    notifications, 
    unreadCount, 
    meta, 
    isLoading, 
    fetchNotifications, 
    fetchUnreadCount, 
    markAsRead,
    getNotificationById,
    deleteNotification
  };
};