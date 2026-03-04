import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { AuthContext } from './AuthContext';
import { User } from './AuthContextType';
import { toast } from 'sonner';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('auth_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });

  const [isLoading, setIsLoading] = useState(true);

  const clearAuthData = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data } = await api.post('/auth/me');
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }
    } catch {
      clearAuthData();
    }
  }, [clearAuthData]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!token || !refreshToken) {
        clearAuthData();
        setIsLoading(false);
        return;
      }

      await refreshSession();
      setIsLoading(false);
    };

    initAuth();

    const handleLogoutEvent = () => {
      clearAuthData();
      
      if (window.location.pathname !== '/login') {
        toast.error('Sesi Anda telah berakhir, silakan login kembali');
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, [navigate, clearAuthData, refreshSession]);

  const login = async (identifier: string, password: string) => {
    try {
      const { data } = await api.post('/auth/login', { identifier, password });
      if (data.success) {
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        setUser(data.user);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login gagal');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
    } finally {
      clearAuthData();
      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, setUser }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};