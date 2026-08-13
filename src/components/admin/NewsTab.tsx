import React, { useState } from 'react';
import { Plus, Clock, Trash2, BookOpen, Edit } from 'lucide-react';
import { NewsPost, UserProfile } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { TiptapEditor } from './TiptapEditor';

interface NewsTabProps {
  newsList: NewsPost[];
  user: UserProfile;
  onUpdateNews: (data: NewsPost[]) => void;
  showSuccess: (msg: string) => void;
}

const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
};

export const NewsTab: React.FC<NewsTabProps> = ({
  newsList,
  user,
  onUpdateNews,
  showSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Kegiatan Utama');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingNewsImg, setUploadingNewsImg] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page when newsList updates
  React.useEffect(() => {
    setCurrentPage(1);
  }, [newsList.length]);

  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNewsImg(true);
    try {
      const url = await SupabaseService.uploadImage(file, 'news-covers');
      setNewImageUrl(url);
      showSuccess('Gambar cover berita berhasil diunggah!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal mengunggah foto cover: ' + (err.message || err) + '\n\n💡 Solusi: Pastikan Anda telah membuat bucket bernama "rt-assets" di storage Supabase Anda dan menyetel aksesnya ke publik.');
    } finally {
      setUploadingNewsImg(false);
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const getPlainSummary = (htmlContent: string) => {
      const plain = htmlContent.replace(/<[^>]*>/g, ' ');
      const cleaned = plain.replace(/\s+/g, ' ').trim();
      if (cleaned.length <= 120) return cleaned;
      return cleaned.substring(0, 120) + '...';
    };

    setLoading(true);
    try {
      const computedSummary = getPlainSummary(newContent);
      
      if (editingNewsId) {
        const existing = newsList.find(n => n.id === editingNewsId);
        const updatedItem: NewsPost = {
          id: editingNewsId,
          title: newTitle,
          slug: existing && existing.title === newTitle ? existing.slug : `${slugify(newTitle)}-${Date.now()}`,
          summary: computedSummary,
          content: newContent,
          category: newCategory,
          image_url: newImageUrl.trim(),
          author_name: existing?.author_name || user.full_name || 'Sekretaris RT 35',
          is_published: true,
          created_at: existing?.created_at || new Date().toISOString()
        };
        const updatedList = await SupabaseService.updateNews(updatedItem);
        onUpdateNews(updatedList);
        showSuccess('Berita berhasil diperbarui!');
        setEditingNewsId(null);
      } else {
        const newItem: NewsPost = {
          id: generateUUID(),
          title: newTitle,
          slug: `${slugify(newTitle)}-${Date.now()}`,
          summary: computedSummary,
          content: newContent,
          category: newCategory,
          image_url: newImageUrl.trim(),
          author_name: user.full_name || 'Sekretaris RT 35',
          is_published: true,
          created_at: new Date().toISOString()
        };
        const updatedList = await SupabaseService.addNews(newItem);
        onUpdateNews(updatedList);
        showSuccess('Berita baru berhasil diterbitkan!');
      }
      
      // Reset form
      setNewTitle('');
      setNewCategory('Kegiatan Utama');
      setNewSummary('');
      setNewContent('');
      setNewImageUrl('');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyimpan berita: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (news: NewsPost) => {
    setEditingNewsId(news.id);
    setNewTitle(news.title);
    setNewCategory(news.category);
    setNewSummary(news.summary);
    setNewContent(news.content);
    setNewImageUrl(news.image_url || '');
  };

  const handleCancelEdit = () => {
    setEditingNewsId(null);
    setNewTitle('');
    setNewCategory('Kegiatan Utama');
    setNewSummary('');
    setNewContent('');
    setNewImageUrl('');
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    setLoading(true);
    try {
      const updatedList = await SupabaseService.deleteNews(id);
      onUpdateNews(updatedList);
      showSuccess('Berita berhasil dihapus!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menghapus berita: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(newsList.length / itemsPerPage);
  const paginatedNews = newsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Manajemen Berita RT</h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">Tulis dan terbitkan berita seputar pencapaian, acara sosial, dan kegiatan resmi RT 35.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* FORM PANEL */}
        <div className="xl:col-span-1 p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-5">
          <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-slate-500" />
              <span>{editingNewsId ? 'Edit Berita' : 'Tulis Berita Baru'}</span>
            </div>
            {editingNewsId && (
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="text-[9px] font-black uppercase text-rose-650 bg-rose-50 border border-rose-100 px-2 py-1 rounded-md hover:bg-rose-100"
              >
                Batal Edit
              </button>
            )}
          </h3>

          <form onSubmit={handleSaveNews} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Judul Berita</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="cth: RT 35 Meraih Penghargaan Kebersihan"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-808 focus:outline-none focus:border-slate-800 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Kategori</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-808 focus:outline-none focus:border-slate-800 transition-all"
              >
                <option value="Kegiatan Utama">Kegiatan Utama</option>
                <option value="Penghargaan">Penghargaan</option>
                <option value="Pemberdayaan">Pemberdayaan</option>
                <option value="Pembangunan">Pembangunan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Cover Gambar Halaman</label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="URL Cover (cth: https://images.unsplash.com/...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-808 focus:outline-none focus:border-slate-800 transition-all"
                />
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-808 text-[10px] font-extrabold rounded-lg transition-colors border border-slate-200">
                    <span>Pilih Berkas Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleNewsImageUpload}
                      className="hidden"
                      disabled={uploadingNewsImg}
                    />
                  </label>
                  {uploadingNewsImg && <span className="text-[10px] text-slate-555 animate-pulse font-bold">Mengunggah...</span>}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Isi Lengkap Berita (Mendukung Rich Text)</label>
              <TiptapEditor
                content={newContent}
                onChange={setNewContent}
                placeholder="Tuliskan cerita lengkap berita di sini..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || uploadingNewsImg}
              className="w-full py-3 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all"
            >
              {loading ? 'Mengirim...' : editingNewsId ? 'Simpan Perubahan' : 'Terbitkan Berita'}
            </button>
          </form>
        </div>

        {/* LIST VIEW PANEL */}
        <div className="xl:col-span-2 space-y-6">
          <div className="p-4.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-slate-550" />
              <span className="text-sm font-black text-slate-800">Daftar Berita Aktif</span>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 font-black text-slate-650">{newsList.length} Berita</span>
          </div>

          <div className="space-y-6">
            {newsList.length === 0 ? (
              <div className="bg-white p-8 border border-slate-200 rounded-3xl text-center text-xs text-slate-400 font-bold">
                Belum ada berita yang diterbitkan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedNews.map((item) => (
                  <div key={item.id} className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all duration-200">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                        <div className="flex items-center text-[10px] text-slate-400 font-bold space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.summary}</p>
                      
                      {item.image_url && (
                        <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 mt-1">
                          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-555">
                      <span>Oleh: <strong className="text-slate-700">{item.author_name}</strong></span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100/50 transition-colors"
                          title="Edit berita"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNews(item.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100/50 transition-colors"
                          title="Hapus berita"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1.5 pt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8"
                  aria-label="Previous page"
                >
                  &larr;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-black transition-all active:scale-95 border ${
                      currentPage === p
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8"
                  aria-label="Next page"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
