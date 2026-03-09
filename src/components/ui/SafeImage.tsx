import { useEffect, useState, useMemo } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { Loader2 } from 'lucide-react';


const getStoredAccessToken = () => localStorage.getItem('access_token');

interface SafeImageProps {
  src?: string;
  className?: string;
  alt?: string;
}

export const SafeImage = ({ src, className, alt }: SafeImageProps) => {
  const [imageBlob, setImageBlob] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const token = getStoredAccessToken();

  const axiosConfig: AxiosRequestConfig = useMemo(() => ({
    headers: {
      'x-app-id': import.meta.env.VITE_APP_ID || 'frontend-app-123',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    responseType: 'blob'
  }), [token]);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    const fetchImage = async () => {
      if (!src) {
        setLoading(false);
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(false);
      }

      try {
        const response = await axios.get(src, axiosConfig);

        if (isMounted) {
          objectUrl = URL.createObjectURL(response.data);
          setImageBlob(objectUrl);
          setLoading(false);
        }
      } catch (err) {
        console.error("Gagal load gambar:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src, axiosConfig]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-50 border border-slate-100`}>
        <Loader2 className="animate-spin text-slate-300" size={20} />
      </div>
    );
  }

  if (error || !imageBlob) {
    return (
      <div className={`${className} flex items-center justify-center bg-slate-100 text-slate-400 text-[10px]`}>
        Gagal memuat gambar
      </div>
    );
  }

  return <img src={imageBlob} className={className} alt={alt} loading="lazy" />;
};
