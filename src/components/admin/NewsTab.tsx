import React, { useState } from 'react';
import { Plus, Clock, Trash2, BookOpen, Edit, AlertTriangle, Loader2 } from 'lucide-react';
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
  const [isAdding, setIsAdding] = useState(false);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);
  const [deleteTargetNews, setDeleteTargetNews] = useState<NewsPost | null>(null);
  
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
    if (!editingNewsId) {
      setIsAdding(true);
    }
    try {
      const computedSummary = getPlainSummary(newContent);
      
      if (editingNewsId) {
        const existing = newsList.find(n => n.id === editingNewsId);
        const updatedItem: NewsPost = {
          id: editingNewsId,
          title: newTitle.trim(),
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
          title: newTitle.trim(),
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
      setIsAdding(false);
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

  const confirmDeleteNewsAction = async () => {
    if (!deleteTargetNews) return;
    setLoading(true);
    setDeletingNewsId(deleteTargetNews.id);
    try {
      const updatedList = await SupabaseService.deleteNews(deleteTargetNews.id);
      onUpdateNews(updatedList);
      showSuccess(`Berita "${deleteTargetNews.title}" berhasil dihapus!`);
      setDeleteTargetNews(null);
    } catch (err: any) {
      console.error(err);
      alert('Gagal menghapus berita: ' + (err.message || err));
    } finally {
      setLoading(false);
      setDeletingNewsId(null);
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
                placeholder="cth: RT 35 Raih Penghargaan Kebersihan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Kategori</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-800"
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
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="URL Cover (cth: https://images.unsplash.com/...)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-800"
              />
              <div className="flex items-center space-x-2 pt-1">
                <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center space-x-1">
                  <span>{uploadingNewsImg ? 'Mengunggah...' : 'Pilih Berkas Foto'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewsImageUpload}
                    disabled={uploadingNewsImg}
                    className="hidden"
                  />
                </label>
                {newImageUrl && (
                  <span className="text-[10px] text-emerald-600 font-bold">✓ Foto terlampir</span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Isi Lengkap Berita (Mendukung Rich Text)</label>
              <TiptapEditor 
                content={newContent} 
                onChange={(html) => setNewContent(html)} 
                placeholder="Tulis liputan berita secara mendalam..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || isAdding}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Menerbitkan Berita...</span>
                </>
              ) : (
                <span>{editingNewsId ? 'Simpan Perubahan Berita' : 'Terbitkan Berita'}</span>
              )}
            </button>
          </form>
        </div>

        {/* LIST PANEL */}
        <div className="xl:col-span-2 space-y-4">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Daftar Berita Aktif</span>
              </div>
              <span className="text-xs text-slate-500 font-bold">{newsList.length} Berita</span>
            </h3>

            {newsList.length === 0 ? (
              <div className="text-center py-16 text-slate-400 font-semibold text-xs">
                Belum ada berita yang diterbitkan.
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedNews.map((item) => {
                  const isBeingDeleted = deletingNewsId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        editingNewsId === item.id 
                          ? 'border-slate-900 bg-slate-50/80 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                            <BookOpen className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-1 truncate">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                            {item.summary}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5 text-slate-500" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetNews(item)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                          title="Hapus berita"
                          disabled={loading || isBeingDeleted}
                        >
                          {isBeingDeleted ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                
                {/* Desktop Numeric Pagination */}
                <div className="hidden sm:flex items-center space-x-1.5">
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
                </div>

                {/* Mobile Text Pagination Indicator */}
                <span className="sm:hidden text-xs font-bold text-slate-500 px-3">
                  Hal {currentPage} / {totalPages}
                </span>

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

      {/* DELETE CONFIRMATION MODAL POPUP */}
      {deleteTargetNews && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => !loading && setDeleteTargetNews(null)} />
          
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-rose-150 p-6 sm:p-8 space-y-6 z-10 animate-scale-up text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                Konfirmasi Hapus Berita
              </span>
              <h4 className="text-xl font-black text-slate-900 leading-snug pt-1">
                Hapus Berita Ini?
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed px-2">
                Apakah Anda yakin ingin menghapus berita <span className="text-slate-900 font-black">"{deleteTargetNews.title}"</span>? Data yang dihapus tidak dapat dipulihkan.
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setDeleteTargetNews(null)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={confirmDeleteNewsAction}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-lg shadow-rose-600/25 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default NewsTab;
