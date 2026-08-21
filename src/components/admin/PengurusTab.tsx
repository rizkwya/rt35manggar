import React, { useState } from 'react';
import { Upload, Plus, Smartphone, Edit, Trash2, Save, AlertTriangle, X, Loader2, UserCheck } from 'lucide-react';
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
  const [deleteTarget, setDeleteTarget] = useState<RTPengurus | null>(null);
  
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
  }, [pengurusList.length]);

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
        nama: editPName.trim(),
        jabatan: editPJabatan.trim(),
        phone: editPPhone.trim(),
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

  const confirmDeleteAction = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    setDeletingId(deleteTarget.id);
    try {
      const res = await SupabaseService.deletePengurus(deleteTarget.id);
      onUpdatePengurusList(res);
      showSuccess(`Data aparatur "${deleteTarget.nama}" berhasil dihapus!`);
      setDeleteTarget(null);
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
      jabatan: newPJabatan.trim(),
      nama: newPName.trim(),
      phone: newPPhone.trim(),
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPengurus = pengurusList.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ADD PENGURUS FORM */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="text-base font-black text-slate-900">Tambah Aparatur RT</h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Masukkan data pengurus atau aparatur RT baru di sini.</p>
          </div>

          <form onSubmit={handleAddPengurus} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Contoh: Bapak H. Ahmad Sujono"
                value={newPName}
                onChange={(e) => setNewPName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Jabatan / Peran</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ketua RT 35, Sekretaris RT"
                value={newPJabatan}
                onChange={(e) => setNewPJabatan(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Nomor WhatsApp</label>
              <input
                type="text"
                required
                placeholder="Contoh: 081234567890"
                value={newPPhone}
                onChange={(e) => setNewPPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Unggah Foto (HP / Laptop)</label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setNewPFoto)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  {newPFoto ? (
                    <img src={newPFoto} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-[#85A389]" />
                  ) : (
                    <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600 flex items-center space-x-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Pilih File</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isAdding}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer active:scale-98"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Menambahkan...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>+ Tambah Aparatur</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* LIST PENGURUS */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">
              Daftar Aparatur RT Aktif ({pengurusList.length} orang)
            </h3>
          </div>

          {pengurusList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-bold text-xs space-y-2">
              <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Belum ada aparatur RT terdaftar. Masukkan data di sebelah kiri untuk menambahkan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                {paginatedPengurus.map((p) => {
                  const isEditing = editingPengurusId === p.id;
                  return (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 relative group"
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className="relative shrink-0">
                          <img
                            src={isEditing ? (editPFoto || '/logo.png') : (p.foto_url || '/logo.png')}
                            alt={p.nama}
                            className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shadow-sm bg-white"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editPName}
                                onChange={(e) => setEditPName(e.target.value)}
                                className="w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                                placeholder="Nama Lengkap"
                              />
                              <input
                                type="text"
                                value={editPJabatan}
                                onChange={(e) => setEditPJabatan(e.target.value)}
                                className="w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                                placeholder="Jabatan"
                              />
                              <input
                                type="text"
                                value={editPPhone}
                                onChange={(e) => setEditPPhone(e.target.value)}
                                className="w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-white"
                                placeholder="WhatsApp"
                              />
                              <div className="relative border border-dashed border-slate-300 rounded-lg p-1.5 text-center bg-white">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, setEditPFoto)}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <span className="text-[10px] text-slate-500 font-bold">Ganti Foto</span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider mb-1">
                                {p.jabatan}
                              </span>
                              <h4 className="text-sm font-black text-slate-900 truncate">{p.nama}</h4>
                              <p className="text-xs text-slate-500 font-semibold flex items-center space-x-1 mt-0.5">
                                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                                <span>{p.phone}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                        {isEditing ? (
                          <div className="flex space-x-2 w-full">
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => setEditingPengurusId(null)}
                              className="flex-1 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => handleSavePengurus(p.id)}
                              className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center space-x-1"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Simpan</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2 w-full">
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => startEditPengurus(p)}
                              className="flex-grow py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                            >
                              <Edit className="w-3.5 h-3.5 text-slate-600" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => setDeleteTarget(p)}
                              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center transition-all cursor-pointer"
                              title="Hapus Pengurus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

      {/* DELETE CONFIRMATION MODAL POPUP */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => !loading && setDeleteTarget(null)} />
          
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
                Konfirmasi Hapus Data
              </span>
              <h4 className="text-xl font-black text-slate-900 leading-snug pt-1">
                Hapus Aparatur RT?
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed px-2">
                Apakah Anda yakin ingin menghapus data aparatur <span className="text-slate-900 font-black">"{deleteTarget.nama}"</span> ({deleteTarget.jabatan})? Data yang dihapus tidak dapat dipulihkan.
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
        </div>
      )}

    </div>
  );
};
export default PengurusTab;
