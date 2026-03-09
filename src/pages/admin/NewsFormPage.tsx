import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { usePost } from '@/hooks/usePost';
import { ArrowLeft, Save, UploadCloud, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SafeImage } from '@/components/ui/SafeImage';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const NEWS_CATEGORY_ID = 1;

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')   
    .replace(/[^\w\-]+/g, '')    
    .replace(/\-\-+/g, '-');   
};

export default function NewsFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);
  
  const { createPost, updatePost, isProcessing } = usePost();

  const [formData, setFormData] = useState({
    judul: '',
    slug: '', 
    konten: '',
    status: 'DRAFT',
    kategori_id: NEWS_CATEGORY_ID,
    author_id: 1 
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCustomSlug, setIsCustomSlug] = useState(false);

  useEffect(() => {
    if (isEdit && location.state?.post) {
      const { post } = location.state;
      setFormData({
        judul: post.judul || '',
        slug: post.slug || '',
        konten: post.konten || '',
        status: post.status || 'DRAFT',
        kategori_id: post.kategori_id || NEWS_CATEGORY_ID,
        author_id: post.author_id
      });
      if (post.thumbnail) {
          setPreview(post.thumbnail);
      }
      if (post.slug) {
          setIsCustomSlug(true); 
      }
    }
  }, [isEdit, location.state]);

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
      // Pastikan slug terisi jika user iseng menghapusnya sampai kosong
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
      navigate('/admin/news');
    } catch (error) {
        // Error di-handle di usePost
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
          <h1 className="text-2xl font-bold text-indigo-950">
            {isEdit ? 'Edit Berita' : 'Tambah Berita'}
          </h1>
          <p className="text-slate-500 text-sm">Lengkapi form di bawah untuk menyimpan berita</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* INPUT JUDUL */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Judul Berita</label>
              <Input 
                required
                placeholder="Masukkan judul berita..."
                className="rounded-xl border-slate-200"
                value={formData.judul}
                onChange={handleJudulChange}
              />
            </div>

            {/* INPUT SLUG */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                Custom Slug
              </label>
              <Input 
                required
                placeholder="contoh-judul-berita"
                className="rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                value={formData.slug}
                onChange={handleSlugChange}
              />
              <p className="text-xs text-slate-400">Terisi otomatis dari judul, namun dapat diubah manual.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Konten Berita</label>
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
              <ReactQuill 
                theme="snow"
                value={formData.konten}
                onChange={(value) => setFormData({ ...formData, konten: value })}
                modules={quillModules}
                className="h-[300px] pb-10" 
                placeholder="Tulis konten berita yang menarik di sini..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Thumbnail / Gambar Utama</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden">
                  {preview ? (
                    <SafeImage src={preview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500"><span className="font-semibold">Klik untuk upload</span></p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Status Publikasi</label>
              <select 
                className="w-full h-10 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => navigate(-1)}>
              Batal
            </Button>
            <Button type="submit" disabled={isProcessing} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 gap-2">
              <Save className="w-4 h-4" /> {isProcessing ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}