import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { usePost } from '@/hooks/usePost';
import { ArrowLeft, Save, UploadCloud, Link as LinkIcon, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SafeImage } from '@/components/ui/SafeImage';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const EVENT_CATEGORY_ID = 2;

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export default function EventFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);

  const { createPost, updatePost, isProcessing } = usePost();

  const [formData, setFormData] = useState(() => {
    if (isEdit && location.state?.post) {
      const { post } = location.state;
      return {
        judul: post.judul || '',
        slug: post.slug || '',
        konten: post.konten || '',
        status: post.status || 'DRAFT',
        // --- DATA BARU EVENT ---
        tanggal_event: post.tanggal_event ? post.tanggal_event.split('T')[0] : '',
        waktu_event: post.waktu_event || '',
        lokasi: post.lokasi || '',

        cta_label: post.cta_label || '',
        cta_link: post.cta_link || '',

        kategori_id: post.kategori_id || EVENT_CATEGORY_ID,
        author_id: post.author_id || 1
      };
    }
    return {
      judul: '',
      slug: '',
      konten: '',
      status: 'DRAFT',
      // --- DATA BARU EVENT ---
      tanggal_event: '',
      waktu_event: '',
      lokasi: '',

      cta_label: '',
      cta_link: '',
      kategori_id: EVENT_CATEGORY_ID,
      author_id: 1
    };
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(() => {
    if (isEdit && location.state?.post?.thumbnail) {
      return location.state.post.thumbnail;
    }
    return null;
  });
  const [isCustomSlug, setIsCustomSlug] = useState(() => {
    if (isEdit && location.state?.post?.slug) return true;
    return false;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleJudulChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      judul: val,
      slug: isCustomSlug ? prev.slug : generateSlug(val)
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustomSlug(true);
    setFormData((prev) => ({
      ...prev,
      slug: generateSlug(e.target.value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const finalFormData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.judul)
      };

      if (isEdit && id) {
        const oldThumbnailUrl = location.state?.post?.thumbnail;
        await updatePost(Number(id), finalFormData, file || undefined, oldThumbnailUrl);
      } else {
        await createPost(finalFormData, file || undefined);
      }
      navigate('/admin/events');
    } catch (error) {
      console.error(error);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'blockquote'],
      ['clean']
    ],
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </Button>
        <div>
          <h1 className="text-2xl font-black text-indigo-950 tracking-tight">
            {isEdit ? 'Edit Agenda Event' : 'Buat Event Baru'}
          </h1>
          <p className="text-slate-500 text-sm font-medium">Informasi detail mengenai pelaksanaan kegiatan alumni.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* KOLOM KIRI: MAIN INFO */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Judul Event</label>
                <Input
                  required
                  placeholder="Masukkan judul event..."
                  className="h-12 rounded-2xl border-slate-200 focus:ring-indigo-500/20"
                  value={formData.judul}
                  onChange={handleJudulChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> Custom Slug
                </label>
                <Input
                  required
                  placeholder="contoh-judul-event"
                  className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white"
                  value={formData.slug}
                  onChange={handleSlugChange}
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Detail Konten</label>
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
                  <ReactQuill
                    theme="snow"
                    value={formData.konten}
                    onChange={(value) => setFormData({ ...formData, konten: value })}
                    modules={quillModules}
                    className="h-[350px] pb-12"
                    placeholder="Tulis deskripsi lengkap event..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: EVENT LOGISTICS & THUMBNAIL */}
          <div className="space-y-6">
            {/* LOGISTIK SECTION */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Detail Acara
              </h3>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  Tanggal Pelaksanaan
                </label>
                <Input
                  type="date"
                  required
                  className="h-11 rounded-xl bg-slate-50 border-none font-bold text-slate-700"
                  value={formData.tanggal_event}
                  onChange={(e) => setFormData({ ...formData, tanggal_event: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  Waktu (WIB)
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: 09:00 - Selesai"
                  required
                  className="h-11 rounded-xl bg-slate-50 border-none font-bold text-slate-700"
                  value={formData.waktu_event}
                  onChange={(e) => setFormData({ ...formData, waktu_event: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  Lokasi / Link Zoom
                </label>
                <Input
                  placeholder="Gedung Serbaguna / Zoom Link"
                  required
                  className="h-11 rounded-xl bg-slate-50 border-none font-bold text-slate-700"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  Call To Action (CTA)
                </label>
                <Input
                  placeholder="Daftar Sekarang / Register Now"
                  required
                  className="h-11 rounded-xl bg-slate-50 border-none font-bold text-slate-700"
                  value={formData.cta_label}
                  onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  CTA Link
                </label>
                <Input
                  placeholder="https://example.com/register"
                  required
                  className="h-11 rounded-xl bg-slate-50 border-none font-bold text-slate-700"
                  value={formData.cta_link}
                  onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                />
              </div>
            </div>

            {/* THUMBNAIL SECTION */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Poster Event</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all relative overflow-hidden group">
                  {preview ? (
                    <SafeImage src={preview} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-10 h-10 text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload Poster</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            {/* STATUS SECTION */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Status Publikasi</label>
              <select
                className="w-full h-12 px-4 rounded-2xl border-none bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-600 transition-all cursor-pointer"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="DRAFT">Draft (Simpan Internal)</option>
                <option value="PUBLISHED">Published (Tampil di Publik)</option>
              </select>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3">
              <Button type="submit" disabled={isProcessing} className="h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all">
                {isProcessing ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                {isEdit ? 'Perbarui Event' : 'Terbitkan Event'}
              </Button>
              <Button type="button" variant="ghost" className="h-12 rounded-2xl font-bold text-slate-400 hover:text-rose-500" onClick={() => navigate(-1)}>
                Batal & Kembali
              </Button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}