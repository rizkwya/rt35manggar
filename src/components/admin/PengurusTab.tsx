import React, { useState } from 'react';
import { Upload, Plus, Smartphone, Edit, Trash2, Save } from 'lucide-react';
import { RTPengurus } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

interface PengurusTabProps {
  pengurusList: RTPengurus[];
  onUpdatePengurusList: (data: RTPengurus[]) => void;
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

export const PengurusTab: React.FC<PengurusTabProps> = ({
  pengurusList,
  onUpdatePengurusList,
  showSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newPName, setNewPName] = useState('');
  const [newPJabatan, setNewPJabatan] = useState('');
  const [newPPhone, setNewPPhone] = useState('');
  const [newPFoto, setNewPFoto] = useState('');

  const [editingPengurusId, setEditingPengurusId] = useState<string | null>(null);
  const [editPName, setEditPName] = useState('');
  const [editPJabatan, setEditPJabatan] = useState('');
  const [editPPhone, setEditPPhone] = useState('');
  const [editPFoto, setEditPFoto] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(pengurusList.length / itemsPerPage);

  // Reset to page 1 when list updates
  React.useEffect(() => {
    setCurrentPage(1);
  }, [pengurusList]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setTarget: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setTarget(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startEditPengurus = (p: RTPengurus) => {
    setEditingPengurusId(p.id);
    setEditPName(p.nama);
    setEditPJabatan(p.jabatan);
    setEditPPhone(p.phone);
    setEditPFoto(p.foto_url || '');
  };

  const handleSavePengurus = async (pId: string) => {
    if (!editPName.trim() || !editPJabatan.trim() || !editPPhone.trim()) return;
    setLoading(true);
    try {
      const target = pengurusList.find((p) => p.id === pId);
      if (!target) return;

      const updatedItem: RTPengurus = {
        ...target,
        nama: editPName,
        jabatan: editPJabatan,
        phone: editPPhone,
        foto_url: editPFoto
      };

      const res = await SupabaseService.updatePengurus(updatedItem);
      onUpdatePengurusList(res);
      setEditingPengurusId(null);
      showSuccess('Informasi pengurus RT berhasil diperbarui!');
    } catch (err: any) {
      console.error('Error saving pengurus:', err);
      alert('Gagal menyimpan perubahan data pengurus: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePengurus = async (pId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data pengurus ini?')) return;
    setLoading(true);
    setDeletingId(pId);
    try {
      const res = await SupabaseService.deletePengurus(pId);
      onUpdatePengurusList(res);
      showSuccess('Data pengurus RT berhasil dihapus!');
    } catch (err: any) {
      console.error('Error deleting pengurus:', err);
      alert('Gagal menghapus pengurus: ' + err.message);
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  const handleAddPengurus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPName.trim() || !newPJabatan.trim() || !newPPhone.trim()) return;

    const newItem: RTPengurus = {
      id: generateUUID(),
      jabatan: newPJabatan,
      nama: newPName,
      phone: newPPhone,
      foto_url: newPFoto.trim() || undefined
    };

    setLoading(true);
    setIsAdding(true);
    try {
      const res = await SupabaseService.updatePengurus(newItem);
      onUpdatePengurusList(res);
      setNewPName('');
      setNewPJabatan('');
      setNewPPhone('');
      setNewPFoto('');
      showSuccess('Aparatur RT baru berhasil ditambahkan!');
    } catch (err: any) {
      console.error('Error adding pengurus:', err);
      alert('Gagal menambah pengurus: ' + (err.message || err));
    } finally {
      setLoading(false);
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      {/* Form Input Aparatur Baru */}
      <form onSubmit={handleAddPengurus} className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-md">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-black text-slate-900">Tambah Aparatur RT</h3>
          <p className="text-xs text-slate-505 font-semibold mt-1">Masukkan data pengurus atau aparatur RT baru di sini.</p>
        </div>

        <div className="space-y-4 text-xs font-bold text-slate-700">
          <div>
            <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
            <input
              type="text"
              value={newPName}
              onChange={(e) => setNewPName(e.target.value)}
              placeholder="Contoh: Bapak H. Ahmad Sujono"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-805 focus:outline-none focus:border-[#85A389] focus:bg-white transition-all disabled:opacity-60"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider mb-1.5">Jabatan / Peran</label>
            <input
              type="text"
              value={newPJabatan}
              onChange={(e) => setNewPJabatan(e.target.value)}
              placeholder="Contoh: Ketua RT 35, Sekretaris RT"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-805 focus:outline-none focus:border-[#85A389] focus:bg-white transition-all disabled:opacity-60"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider mb-1.5">Nomor WhatsApp</label>
            <input
              type="text"
              value={newPPhone}
              onChange={(e) => setNewPPhone(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-805 focus:outline-none focus:border-[#85A389] focus:bg-white transition-all disabled:opacity-60"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider">Unggah Foto (HP / Laptop)</label>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200">
              {newPFoto && (
                <img src={newPFoto} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
              )}
              <label className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-slate-350 hover:bg-slate-100 text-slate-750 font-bold text-xs shadow-sm ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}>
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Pilih File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, setNewPFoto)}
                  disabled={loading}
                />
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center space-x-1.5">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Menyimpan...</span>
            </span>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Tambah Aparatur</span>
            </>
          )}
        </button>
      </form>

      {/* List Aparatur RT */}
      <div className="lg:col-span-8 space-y-4">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-md">
          <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 mb-4">
            Daftar Aparatur RT Aktif ({pengurusList.length} orang)
          </h3>

          {pengurusList.length === 0 ? (
            <div className="text-center py-12 text-xs font-semibold text-slate-400">
              Belum ada aparatur RT terdaftar. Masukkan data di sebelah kiri untuk menambahkan.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                {/* Skeleton Loader at top only when adding a new officer */}
                {isAdding && (
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-5 animate-pulse">
                    <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
                    <div className="space-y-2 flex-grow">
                      <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                      <div className="h-4.5 bg-slate-200 rounded w-2/3" />
                      <div className="h-3.5 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                )}

                {pengurusList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p) => {
                  const isEditing = editingPengurusId === p.id;
                  const isSavingThis = isEditing && loading;
                  const isDeletingThis = deletingId === p.id && loading;

                  if (isSavingThis || isDeletingThis) {
                    return (
                      <div key={p.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-5 animate-pulse min-h-[160px]">
                        <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
                        <div className="space-y-2 flex-grow">
                          <div className="h-3.5 bg-slate-200 rounded w-1/3" />
                          <div className="h-4.5 bg-slate-250 rounded w-2/3" />
                          <div className="h-3.5 bg-slate-200 rounded w-1/2" />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={p.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:border-[#85A389]/30 transition-all duration-200">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="space-y-3.5 text-xs font-bold text-slate-700">
                            <div>
                              <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider mb-1.5">Jabatan / Peran</label>
                              <input
                                type="text"
                                value={editPJabatan}
                                onChange={(e) => setEditPJabatan(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389] focus:bg-white disabled:opacity-60"
                                required
                                disabled={loading}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider mb-1.5">Nama Pengurus</label>
                              <input
                                type="text"
                                value={editPName}
                                onChange={(e) => setEditPName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389] focus:bg-white disabled:opacity-60"
                                required
                                disabled={loading}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider mb-1.5">Nomor WhatsApp</label>
                              <input
                                type="text"
                                value={editPPhone}
                                onChange={(e) => setEditPPhone(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389] focus:bg-white disabled:opacity-60"
                                required
                                disabled={loading}
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider">Unggah Foto (HP / Laptop)</label>
                              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200">
                                {editPFoto && (
                                  <img src={editPFoto} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
                                )}
                                <label className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-slate-350 hover:bg-slate-100 text-slate-750 font-bold text-xs shadow-sm ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}>
                                  <Upload className="w-4 h-4 text-slate-500" />
                                  <span>Pilih File Gambar</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, setEditPFoto)}
                                    disabled={loading}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-5">
                          <img
                            src={p.foto_url || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23CBD5E1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'}
                            alt={p.nama}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#85A389]/20 shadow shrink-0 bg-slate-100"
                          />
                          <div className="space-y-1.5 min-w-0">
                            <span className="text-[9px] font-black text-[#5F8D4E] px-2.5 py-0.5 rounded-full bg-[#85A389]/10 border border-[#85A389]/25 uppercase tracking-wider">
                              {p.jabatan}
                            </span>
                            <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight pt-1 truncate">{p.nama}</h4>
                            <p className="text-xs text-slate-500 font-bold flex items-center space-x-1.5">
                              <Smartphone className="w-4 h-4 text-[#85A389]" />
                              <span>{p.phone}</span>
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2 pt-4 border-t border-slate-100">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => handleSavePengurus(p.id)}
                              className="flex-grow py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm disabled:opacity-60"
                            >
                              {loading ? (
                                <span className="flex items-center space-x-1.5">
                                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span>Menyimpan...</span>
                                </span>
                              ) : (
                                <>
                                  <Save className="w-4 h-4" />
                                  <span>Simpan</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => setEditingPengurusId(null)}
                              className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-60"
                            >
                              Batal
                            </button>
                          </>
                        ) : (
                          <div className="flex w-full space-x-2">
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => startEditPengurus(p)}
                              className="flex-grow py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-855 text-xs font-bold border-2 border-slate-200 flex items-center justify-center space-x-2 shadow-sm disabled:opacity-60"
                            >
                              <Edit className="w-4 h-4 text-[#85A389]" />
                              <span>Edit Biodata</span>
                            </button>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => handleDeletePengurus(p.id)}
                              className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border-2 border-rose-200 text-xs font-bold flex items-center justify-center shadow-sm"
                              title="Hapus Pengurus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-1.5 pt-4 flex-wrap gap-y-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8 shadow-sm"
                    aria-label="Previous page"
                  >
                    &larr;
                  </button>
                  
                  <div className="hidden sm:flex items-center space-x-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all active:scale-95 border shadow-sm ${
                          currentPage === p
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <span className="block sm:hidden text-xs font-black text-slate-600 px-3 select-none">
                    Hal {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8 shadow-sm"
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
