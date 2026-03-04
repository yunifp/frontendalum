import axios from 'axios';

const getStoredAccessToken = () => localStorage.getItem('access_token');
const getStoredRefreshToken = () => localStorage.getItem('refresh_token');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-app-id': import.meta.env.VITE_APP_ID || 'frontend-app-123'
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message?.toLowerCase() || "";

    const isAuthError = status === 401 || status === 403;
    const isTokenExpired = message.includes('expired') || message.includes('invalid');

    if (isAuthError && isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getStoredRefreshToken();

      if (!refreshToken) {
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          { headers: { 'x-app-id': import.meta.env.VITE_APP_ID || 'frontend-app-123' } }
        );

        if (data.success && data.accessToken) {
          localStorage.setItem('access_token', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 