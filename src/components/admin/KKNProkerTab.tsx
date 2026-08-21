import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit, Trash2, Save, X, Upload, Loader2, Briefcase, Clock } from 'lucide-react';
import { ProkerItem } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

interface KKNProkerTabProps {
  prokerList: ProkerItem[];
  onUpdateProkerList: (data: ProkerItem[]) => void;
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

const CATEGORIES = [
  'Digitalisasi & IT',
  'Pendataan & Sosial',
  'Ekonomi & UMKM',
  'Lingkungan Hidup',
  'Edukasi & Kesehatan',
  'Infrastruktur',
  'Lainnya'
];

export const KKNProkerTab: React.FC<KKNProkerTabProps> = ({
  prokerList,
  onUpdateProkerList,
  showSuccess
}) => {
  const [localProkerList, setLocalProkerList] = useState<ProkerItem[]>(prokerList || []);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingEditImg, setUploadingEditImg] = useState(false);

  // Pagination state (Max 3 prokers per page for ultra clean layout)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Form state for creating new proker
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Digitalisasi & IT');
  const [newDesc, setNewDesc] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [newPicName, setNewPicName] = useState('');
  const [newProgress, setNewProgress] = useState(0);
  const [newStatus, setNewStatus] = useState<'Planned' | 'In Progress' | 'Completed'>('In Progress');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Editing state
  const [editingProkerId, setEditingProkerId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Digitalisasi & IT');
  const [editDesc, setEditDesc] = useState('');
  const [editTargetDate, setEditTargetDate] = useState('');
  const [editPicName, setEditPicName] = useState('');
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState<'Planned' | 'In Progress' | 'Completed'>('In Progress');
  const [editImageUrl, setEditImageUrl] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<ProkerItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (prokerList) {
      setLocalProkerList(prokerList);
    }
  }, [prokerList]);

  useEffect(() => {
    const fetchFresh = async () => {
      try {
        const fresh = await SupabaseService.fetchProker();
        if (fresh && fresh.length > 0) {
          setLocalProkerList(fresh);
          onUpdateProkerList(fresh);
        }
      } catch (e) {}
    };
    fetchFresh();
  }, []);

  // Reset pagination to page 1 if current page becomes out of range
  const totalPages = Math.ceil(localProkerList.length / itemsPerPage);
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [localProkerList.length, totalPages, currentPage]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditMode = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEditMode) {
      setUploadingEditImg(true);
    } else {
      setUploadingImg(true);
    }

    try {
      const url = await SupabaseService.uploadImage(file, 'proker-covers');
      if (isEditMode) {
        setEditImageUrl(url);
      } else {
        setNewImageUrl(url);
      }
      showSuccess('Foto dokumentasi proker berhasil diunggah!');
    } catch (err: any) {
      console.error(err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditMode) {
          setEditImageUrl(reader.result as string);
        } else {
          setNewImageUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      if (isEditMode) {
        setUploadingEditImg(false);
      } else {
        setUploadingImg(false);
      }
    }
  };

  const handleAddProker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setLoading(true);
    setIsAdding(true);
    try {
      const newItem: ProkerItem = {
        id: generateUUID(),
        title: newTitle.trim(),
        category: newCategory.trim(),
        description: newDesc.trim(),
        target_date: newTargetDate.trim() || 'Agustus 2026',
        pic_name: newPicName.trim() || 'Tim KKN 7',
        progress_percent: Math.min(100, Math.max(0, Number(newProgress) || 0)),
        status: newStatus,
        image_url: newImageUrl.trim() || undefined
      };

      const updated = await SupabaseService.addProker(newItem);
      setLocalProkerList(updated);
      onUpdateProkerList(updated);
      showSuccess('Program kerja KKN berhasil ditambahkan!');

      // Reset form
      setNewTitle('');
      setNewCategory('Digitalisasi & IT');
      setNewDesc('');
      setNewTargetDate('');
      setNewPicName('');
      setNewProgress(0);
      setNewStatus('In Progress');
      setNewImageUrl('');
    } catch (err: any) {
      console.error('Error adding proker:', err);
      alert('Gagal menambah program kerja: ' + (err.message || err));
    } finally {
      setLoading(false);
      setIsAdding(false);
    }
  };

  const startEditProker = (p: ProkerItem) => {
    setEditingProkerId(p.id);
    setEditTitle(p.title);
    setEditCategory(p.category);
    setEditDesc(p.description);
    setEditTargetDate(p.target_date);
    setEditPicName(p.pic_name);
    setEditProgress(p.progress_percent);
    setEditStatus(p.status);
    setEditImageUrl(p.image_url || '');
  };

  const cancelEdit = () => {
    setEditingProkerId(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim() || !editDesc.trim()) return;

    setLoading(true);
    try {
      const existing = localProkerList.find(p => p.id === id);
      const updatedItem: ProkerItem = {
        ...existing,
        id,
        title: editTitle.trim(),
        category: editCategory.trim(),
        description: editDesc.trim(),
        target_date: editTargetDate.trim() || 'Agustus 2026',
        pic_name: editPicName.trim() || 'Tim KKN 7',
        progress_percent: Math.min(100, Math.max(0, Number(editProgress) || 0)),
        status: editStatus,
        image_url: editImageUrl.trim() || undefined
      };

      // Optimistic in-place update (stays strictly at its current index)
      const idx = localProkerList.findIndex(p => p.id === id);
      let localUpdated = [...localProkerList];
      if (idx !== -1) {
        localUpdated[idx] = updatedItem;
      }
      setLocalProkerList(localUpdated);
      onUpdateProkerList(localUpdated);

      const updated = await SupabaseService.updateProker(updatedItem);
      if (updated && updated.length > 0) {
        setLocalProkerList(updated);
        onUpdateProkerList(updated);
      }
      showSuccess('Perubahan program kerja berhasil disimpan!');
      setEditingProkerId(null);
    } catch (err: any) {
      console.error('Error updating proker:', err);
      alert('Gagal memperbarui program kerja: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteAction = async () => {
    if (!deleteTarget) return;

    setLoading(true);
    setDeletingId(deleteTarget.id);
    try {
      const updated = await SupabaseService.deleteProker(deleteTarget.id);
      setLocalProkerList(updated);
      onUpdateProkerList(updated);
      showSuccess(`Program kerja "${deleteTarget.title}" berhasil dihapus!`);
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('Error deleting proker:', err);
      alert('Gagal menghapus program kerja: ' + (err.message || err));
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  // Slice paginated items
  const paginatedProker = localProkerList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Program Kerja KKN Kelompok 7</h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Kelola program kerja pengabdian masyarakat, target capaian, progress, dokumentasi foto, dan PIC penanggung jawab.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* CREATE PROKER FORM */}
        <div className="xl:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Tambah Program Kerja</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Input proker baru untuk dipublikasikan di halaman KKN.</p>
          </div>

          <form onSubmit={handleAddProker} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Judul Program Kerja
              </label>
              <input
                type="text"
                required
                placeholder="cth: Digitalisasi Pelayanan & Sistem RT 35"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Kategori / Sektor
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Status Pelaksanaan
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setNewStatus(val);
                    if (val === 'Completed') setNewProgress(100);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                >
                  <option value="Planned">Planned (Rencana)</option>
                  <option value="In Progress">In Progress (Berjalan)</option>
                  <option value="Completed">Completed (Selesai)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                  Capaian Target: <span className="text-[#0b5665] font-black">{newProgress}%</span>
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => {
                    const p = Number(e.target.value);
                    setNewProgress(p);
                    if (p === 100) setNewStatus('Completed');
                    else if (p > 0) setNewStatus('In Progress');
                  }}
                  className="flex-1 accent-[#0b5665] cursor-pointer"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={(e) => {
                    const p = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                    setNewProgress(p);
                    if (p === 100) setNewStatus('Completed');
                    else if (p > 0) setNewStatus('In Progress');
                  }}
                  className="w-16 px-2 py-1 text-center rounded-lg border-2 border-slate-200 bg-slate-50 text-xs font-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Target Tanggal
                </label>
                <input
                  type="text"
                  placeholder="cth: 15 Agustus 2026"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  PIC Penanggung Jawab
                </label>
                <input
                  type="text"
                  placeholder="cth: Dimarco (Informatika)"
                  value={newPicName}
                  onChange={(e) => setNewPicName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Cover / Foto Dokumentasi
              </label>
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="URL Gambar atau unggah berkas di bawah"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800 mb-1.5"
              />
              <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] inline-flex items-center space-x-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImg ? 'Mengunggah...' : 'Pilih Berkas Foto'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, false)}
                  disabled={uploadingImg}
                  className="hidden"
                />
              </label>
              {newImageUrl && (
                <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewImageUrl('')}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full text-xs cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Deskripsi & Uraian Kegiatan
              </label>
              <textarea
                required
                rows={3}
                placeholder="Jelaskan tujuan, pelaksanaan, dan dampak program kerja ini bagi warga RT 35..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading || isAdding}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer active:scale-98"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Menambahkan Proker...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>+ Terbitkan Program Kerja</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* LIST PROKER ITEMS */}
        <div className="xl:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>Daftar Program Kerja KKN ({localProkerList.length})</span>
            </h3>
            {totalPages > 1 && (
              <span className="text-xs font-bold text-slate-500">
                Halaman {currentPage} dari {totalPages}
              </span>
            )}
          </div>

          {localProkerList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-bold text-xs space-y-2">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Belum ada program kerja terdaftar. Gunakan formulir di sebelah kiri untuk menambahkan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedProker.map((p) => {
                const isEditing = editingProkerId === p.id;
                const isDeleting = deletingId === p.id;

                return (
                  <div
                    key={p.id}
                    className={`p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between space-y-4 ${
                      isEditing
                        ? 'border-slate-900 bg-slate-50/80 shadow-md'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {isEditing ? (
                      /* EDITING FORM INLINE */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Edit Program Kerja
                          </span>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Judul</label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Kategori</label>
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                            >
                              {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Status</label>
                            <select
                              value={editStatus}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setEditStatus(val);
                                if (val === 'Completed') setEditProgress(100);
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                            >
                              <option value="Planned">Planned</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                              Capaian Target (%): {editProgress}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={editProgress}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setEditProgress(val);
                                if (val === 100) setEditStatus('Completed');
                              }}
                              className="w-full accent-[#0b5665]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Target Tanggal</label>
                            <input
                              type="text"
                              value={editTargetDate}
                              onChange={(e) => setEditTargetDate(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">PIC Penanggung Jawab</label>
                            <input
                              type="text"
                              value={editPicName}
                              onChange={(e) => setEditPicName(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Cover / Foto Proker</label>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <input
                                type="text"
                                value={editImageUrl}
                                onChange={(e) => setEditImageUrl(e.target.value)}
                                placeholder="URL Gambar atau unggah berkas..."
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                              />
                              <label className="cursor-pointer px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center justify-center space-x-1.5 shrink-0 transition-all">
                                <Upload className="w-3.5 h-3.5" />
                                <span>{uploadingEditImg ? 'Mengunggah...' : 'Unggah Foto'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, true)}
                                  disabled={uploadingEditImg}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            {editImageUrl && (
                              <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                <img src={editImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setEditImageUrl('')}
                                  className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black text-white rounded-full text-xs cursor-pointer shadow-md"
                                  title="Hapus foto"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Deskripsi</label>
                            <textarea
                              rows={2}
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                          <button
                            type="button"
                            disabled={loading}
                            onClick={cancelEdit}
                            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleSaveEdit(p.id)}
                            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center space-x-1.5 shadow-sm cursor-pointer"
                          >
                            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            <span>Simpan Perubahan</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* READ VIEW */
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          
                          {/* Image preview & info */}
                          <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.title}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0 bg-slate-100"
                              />
                            ) : (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200/80 border border-slate-200 flex items-center justify-center shrink-0 text-slate-400">
                                <Briefcase className="w-7 h-7" />
                              </div>
                            )}

                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0b5665]/10 text-[#0b5665] border border-[#0b5665]/20">
                                  {p.category}
                                </span>
                                <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                                  p.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : p.status === 'In Progress'
                                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                                      : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                  {p.status}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Target: {p.target_date}
                                </span>
                              </div>

                              <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                                {p.title}
                              </h4>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                                {p.description}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold">
                                PIC: <strong className="text-slate-700">{p.pic_name}</strong>
                              </p>
                            </div>
                          </div>

                          {/* Progress bar visualizer */}
                          <div className="w-full sm:w-36 shrink-0 space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80">
                            <div className="flex items-center justify-between text-[10px] font-black text-slate-700">
                              <span>Capaian</span>
                              <span className="text-[#0b5665]">{p.progress_percent}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  p.progress_percent === 100
                                    ? 'bg-emerald-500'
                                    : p.progress_percent >= 50
                                      ? 'bg-[#0b5665]'
                                      : 'bg-amber-500'
                                }`}
                                style={{ width: `${p.progress_percent}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            disabled={loading}
                            onClick={() => startEditProker(p)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-slate-600" />
                            <span>Ubah Proker</span>
                          </button>
                          <button
                            type="button"
                            disabled={loading || isDeleting}
                            onClick={() => setDeleteTarget(p)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center transition-all cursor-pointer"
                            title="Hapus Program Kerja"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* NUMERIC PAGINATION CONTROLS (1 2 3 dst) */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-1.5 pt-4 flex-wrap gap-y-2 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8 shadow-sm cursor-pointer"
                    aria-label="Previous page"
                  >
                    &larr;
                  </button>
                  
                  <div className="flex items-center space-x-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all active:scale-95 border shadow-sm cursor-pointer ${
                          currentPage === p
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8 shadow-sm cursor-pointer"
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

      {/* FULLSCREEN DELETE CONFIRMATION MODAL VIA PORTAL TO BODY */}
      {deleteTarget && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md">
          {/* Backdrop click to dismiss */}
          <div className="absolute inset-0" onClick={() => !loading && setDeleteTarget(null)} />
          
          {/* Modal Container */}
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-rose-150 p-6 sm:p-8 space-y-6 z-10 text-center animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <Trash2 className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                Konfirmasi Hapus Proker
              </span>
              <h4 className="text-xl font-black text-slate-900 leading-snug pt-1">
                Hapus Program Kerja?
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed px-2">
                Apakah Anda yakin ingin menghapus program kerja <span className="text-slate-900 font-black">"{deleteTarget.title}"</span>? Data yang dihapus tidak dapat dipulihkan.
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => setDeleteTarget(null)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={confirmDeleteAction}
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
        </div>,
        document.body
      )}

    </div>
  );
};
export default KKNProkerTab;
