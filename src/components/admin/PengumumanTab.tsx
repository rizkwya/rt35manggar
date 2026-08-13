import React, { useState } from 'react';
import { Plus, Clock, Trash2, ShieldAlert, Bell } from 'lucide-react';
import { RTAnnouncement, UserProfile } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

interface PengumumanTabProps {
  announcements: RTAnnouncement[];
  user: UserProfile;
  onUpdateAnnouncements: (data: RTAnnouncement[]) => void;
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

export const PengumumanTab: React.FC<PengumumanTabProps> = ({
  announcements,
  user,
  onUpdateAnnouncements,
  showSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Informasi RT & Lainnya');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState<string>(user.full_name || 'Sekretaris RT 35');
  const [isUrgent, setIsUrgent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset to page 1 when announcements list changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [announcements]);

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newAuthor.trim()) return;

    const newItem: RTAnnouncement = {
      id: generateUUID(),
      title: newTitle,
      category: newCategory,
      content: newContent,
      date: new Date().toISOString().split('T')[0],
      author: newAuthor,
      is_urgent: isUrgent
    };

    setLoading(true);
    try {
      const updatedList = await SupabaseService.addAnnouncement(newItem);
      onUpdateAnnouncements(updatedList);
      
      // Reset form
      setNewTitle('');
      setNewCategory('Informasi RT & Lainnya');
      setNewContent('');
      setIsUrgent(false);
      showSuccess('Pengumuman baru resmi diterbitkan!');
    } catch (err: any) {
      console.error('Error adding announcement:', err);
      alert('Gagal menambahkan pengumuman: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return;
    setLoading(true);
    try {
      const updated = await SupabaseService.deleteAnnouncement(id);
      onUpdateAnnouncements(updated);
      showSuccess('Pengumuman berhasil dihapus.');
    } catch (err: any) {
      console.error('Error deleting announcement:', err);
      alert('Gagal menghapus pengumuman: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(announcements.length / itemsPerPage);
  const paginatedAnnouncements = announcements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* Form Column */}
      <form onSubmit={handleAddAnnouncement} className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm">
        <div className="border-b border-slate-100 pb-2.5">
          <h3 className="text-lg font-black text-slate-900">Buat Pengumuman Baru</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Siarkan berita resmi ke warga RT 35</p>
        </div>

        <div className="space-y-4 text-sm font-bold text-slate-700">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Judul Pengumuman</label>
            <input
              type="text"
              placeholder="Contoh: Fogging Massal Mencegah DBD"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Kategori Pengumuman</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-slate-800 focus:bg-white"
            >
              <option value="Kerja Bakti">Kerja Bakti</option>
              <option value="Kesehatan & Posyandu">Kesehatan & Posyandu</option>
              <option value="Keamanan & Ronda">Keamanan & Ronda</option>
              <option value="Sosialisasi & Rapat">Sosialisasi & Rapat</option>
              <option value="Informasi RT & Lainnya">Informasi RT & Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Penerbit Pengumuman (Nama/Instansi)</label>
            <input
              type="text"
              placeholder="cth: Ketua Posyandu, Tim PKK, Sekretaris RT"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Uraian / Isi Detail Informasi</label>
            <textarea
              rows={4}
              placeholder="Tulis berita lengkap, tempat, dan ketentuan warga..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 focus:bg-white"
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="urgentCheck"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="w-4 h-4 rounded border-slate-350 text-slate-900 focus:ring-slate-800"
            />
            <label htmlFor="urgentCheck" className="text-xs text-rose-600 font-extrabold cursor-pointer select-none flex items-center space-x-1.5">
              <ShieldAlert className="w-4.5 h-4.5 text-rose-600 inline" />
              <span>TANDAI PENTING / MENDESAK</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-850 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>{loading ? 'Menerbitkan...' : 'Terbitkan Pengumuman'}</span>
        </button>
      </form>

      {/* List Column */}
      <div className="lg:col-span-7 space-y-6">
        <div className="p-4.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-slate-550" />
            <span className="text-sm font-black text-slate-800">Daftar Pengumuman Terbit</span>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 font-black text-slate-650">
            {announcements.length} Pengumuman
          </span>
        </div>

        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="bg-white p-8 border border-slate-200 rounded-3xl text-center text-xs text-slate-400 font-bold">
              Belum ada pengumuman yang aktif.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {paginatedAnnouncements.map((item) => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all duration-200 bg-white border-slate-200 relative group flex justify-between items-start ${
                      item.is_urgent ? 'ring-2 ring-rose-500/20 border-rose-200' : ''
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md ${
                            item.is_urgent
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.date}</span>
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        {item.title}
                        {item.is_urgent && (
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse inline-block" />
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{item.content}</p>
                      
                      <div className="text-[10px] text-slate-400 font-bold pt-1.5">
                        Penerbit: <strong className="text-slate-600">{item.author}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(item.id)}
                      disabled={loading}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100/50 transition-colors"
                      title="Hapus pengumuman"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

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
          )}
        </div>
      </div>
    </div>
  );
};
