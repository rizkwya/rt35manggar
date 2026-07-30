import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Activity } from 'lucide-react';
import { NavigationItem } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { TiptapEditor } from './TiptapEditor';
import { getPreviewText } from '../../lib/utils';

interface KegiatanWargaTabProps {
  navItems: NavigationItem[];
  onNavItemsUpdate: (items: NavigationItem[]) => void;
  showSuccess: (msg: string) => void;
}

export const KegiatanWargaTab: React.FC<KegiatanWargaTabProps> = ({
  navItems,
  onNavItemsUpdate,
  showSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [pageSubtitle, setPageSubtitle] = useState('');
  const [pageBody, setPageBody] = useState('');
  const [editingKegiatanIdx, setEditingKegiatanIdx] = useState<number | null>(null);
  const [kegiatanTitle, setKegiatanTitle] = useState('');
  const [kegiatanBadge, setKegiatanBadge] = useState('');
  const [kegiatanDesc, setKegiatanDesc] = useState('');
  const [kegiatanImageUrl, setKegiatanImageUrl] = useState('');
  const [uploadingKegiatanImg, setUploadingKegiatanImg] = useState(false);

  useEffect(() => {
    const kegiatan = navItems.find(item => item.target_id === 'kegiatan-warga');
    if (kegiatan?.custom_content) {
      try {
        const parsed = JSON.parse(kegiatan.custom_content);
        setPageSubtitle(parsed.subtitle || '');
        setPageBody(parsed.body || '');
      } catch (e) {}
    }
  }, [navItems]);

  const handleKegiatanImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingKegiatanImg(true);
    try {
      const url = await SupabaseService.uploadImage(file, 'activities');
      setKegiatanImageUrl(url);
      showSuccess('Gambar kegiatan berhasil diunggah!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal mengunggah foto kegiatan: ' + (err.message || err) + '\n\n💡 Solusi: Pastikan Anda telah membuat bucket bernama "rt-assets" di storage Supabase Anda dan menyetel aksesnya ke publik.');
    } finally {
      setUploadingKegiatanImg(false);
    }
  };

  const handleSaveKegiatan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kegiatanTitle.trim()) return;

    const kegiatanPageItem = navItems.find(item => item.target_id === 'kegiatan-warga');
    if (!kegiatanPageItem) {
      alert('Halaman Kegiatan Warga tidak ditemukan.');
      return;
    }

    setLoading(true);
    try {
      let contentObj = { banner_url: '', subtitle: '', body: '', grid_items: [] as any[] };
      if (kegiatanPageItem.custom_content) {
        try {
          contentObj = JSON.parse(kegiatanPageItem.custom_content);
        } catch (err) {
          console.warn('Failed to parse current custom content:', err);
        }
      }

      const newItem = {
        title: kegiatanTitle,
        badge: kegiatanBadge,
        description: kegiatanDesc,
        image_url: kegiatanImageUrl
      };

      let updatedGridItems = [...(contentObj.grid_items || [])];
      if (editingKegiatanIdx !== null) {
        updatedGridItems[editingKegiatanIdx] = newItem;
      } else {
        updatedGridItems.push(newItem);
      }

      const updatedPageItem = {
        ...kegiatanPageItem,
        custom_content: JSON.stringify({
          ...contentObj,
          grid_items: updatedGridItems
        })
      };

      const res = await SupabaseService.saveNavItems([updatedPageItem]);
      onNavItemsUpdate(res);
      
      setEditingKegiatanIdx(null);
      setKegiatanTitle('');
      setKegiatanBadge('');
      setKegiatanDesc('');
      setKegiatanImageUrl('');
      
      showSuccess(editingKegiatanIdx !== null ? 'Kegiatan warga berhasil diperbarui!' : 'Kegiatan warga baru berhasil ditambahkan!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyimpan kegiatan warga: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKegiatan = async (idx: number) => {
    const kegiatanPageItem = navItems.find(item => item.target_id === 'kegiatan-warga');
    if (!kegiatanPageItem) return;

    if (!window.confirm('Apakah Anda yakin ingin menghapus kegiatan warga ini?')) return;

    setLoading(true);
    try {
      let contentObj = { banner_url: '', subtitle: '', body: '', grid_items: [] as any[] };
      if (kegiatanPageItem.custom_content) {
        try {
          contentObj = JSON.parse(kegiatanPageItem.custom_content);
        } catch (err) {
          console.warn('Failed to parse current custom content:', err);
        }
      }

      let updatedGridItems = [...(contentObj.grid_items || [])];
      updatedGridItems.splice(idx, 1);

      const updatedPageItem = {
        ...kegiatanPageItem,
        custom_content: JSON.stringify({
          ...contentObj,
          grid_items: updatedGridItems
        })
      };

      const res = await SupabaseService.saveNavItems([updatedPageItem]);
      onNavItemsUpdate(res);
      showSuccess('Kegiatan warga berhasil dihapus!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menghapus kegiatan warga: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    const kegiatanPageItem = navItems.find(item => item.target_id === 'kegiatan-warga');
    if (!kegiatanPageItem) return;

    setLoading(true);
    try {
      let contentObj = { banner_url: '', subtitle: '', body: '', grid_items: [] as any[] };
      if (kegiatanPageItem.custom_content) {
        try {
          contentObj = JSON.parse(kegiatanPageItem.custom_content);
        } catch (err) {
          console.warn(err);
        }
      }

      const updatedPageItem = {
        ...kegiatanPageItem,
        custom_content: JSON.stringify({
          ...contentObj,
          subtitle: pageSubtitle,
          body: pageBody
        })
      };

      const res = await SupabaseService.saveNavItems([updatedPageItem]);
      onNavItemsUpdate(res);
      showSuccess('Informasi halaman Kegiatan Warga berhasil diperbarui!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyimpan informasi halaman: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Meta Section: Title & Subtitle */}
      <form onSubmit={handleSavePageMeta} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-900">Deskripsi Halaman Kegiatan Warga</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Atur teks pengantar dan kutipan deskripsi yang tampil di bagian atas halaman Kegiatan Warga publik.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 text-sm font-bold text-slate-700">
          {/* Subtitle / Kutipan */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Subtitle / Kutipan Halaman</label>
            <input
              type="text"
              value={pageSubtitle}
              onChange={(e) => setPageSubtitle(e.target.value)}
              placeholder="Contoh: Dokumentasi kebersamaan dan program aksi sosial kemasyarakatan warga RT 35 Manggar."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#85A389] focus:bg-white"
            />
          </div>

          {/* Deskripsi Utama */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Deskripsi Paragraf Utama</label>
            <textarea
              rows={3}
              value={pageBody}
              onChange={(e) => setPageBody(e.target.value)}
              placeholder="Tulis paragraf deskripsi selamat datang di halaman kegiatan warga..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#85A389] focus:bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#1E4D6B] to-[#85A389] hover:opacity-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Save className="w-4.5 h-4.5 text-white" />
            <span>Simpan Informasi Halaman</span>
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Input Kegiatan Warga */}
        <form onSubmit={handleSaveKegiatan} className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-md">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="text-lg font-black text-slate-900">
              {editingKegiatanIdx !== null ? 'Edit Kegiatan Warga' : 'Tambah Kegiatan Warga'}
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Buat dokumentasi kegiatan atau aksi gotong royong warga terbaru.
            </p>
          </div>

          <div className="space-y-4 text-sm font-bold text-slate-700">
            {/* Judul Kegiatan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Nama / Judul Kegiatan</label>
              <input
                type="text"
                required
                placeholder="Contoh: Kerja Bakti Minggu Bersih"
                value={kegiatanTitle}
                onChange={(e) => setKegiatanTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
              />
            </div>

            {/* Kategori Kegiatan (Badge) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Kategori (Badge)</label>
              <input
                type="text"
                placeholder="Contoh: Sosial, Kesehatan, Gotong Royong"
                value={kegiatanBadge}
                onChange={(e) => setKegiatanBadge(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Deskripsi Kegiatan (Mendukung Rich Text)</label>
              <TiptapEditor
                content={kegiatanDesc}
                onChange={setKegiatanDesc}
                placeholder="Tulis rincian lengkap mengenai pelaksanaan kegiatan ini..."
              />
            </div>

            {/* Gambar Kegiatan */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Gambar Kegiatan</label>
              
              {kegiatanImageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-55 h-36 shadow-sm group">
                  <img src={kegiatanImageUrl} alt="Preview Kegiatan" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setKegiatanImageUrl('')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow"
                    >
                      Hapus Gambar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-55 text-center hover:bg-slate-100/50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[100px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleKegiatanImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    disabled={uploadingKegiatanImg}
                  />
                  {uploadingKegiatanImg ? (
                    <div className="space-y-1.5">
                      <div className="w-4 h-4 border-2 border-[#85A389] border-t-transparent rounded-full animate-spin mx-auto" />
                      <span className="text-[9px] text-slate-500 font-bold">Mengunggah gambar...</span>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-[#5F8D4E] hover:underline block">
                        Upload Foto Kegiatan
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold block">
                        Format PNG, JPG atau JPEG
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="flex-grow py-3 rounded-2xl bg-[#85A389] hover:bg-[#729276] text-white font-extrabold text-xs shadow transition-all flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>{editingKegiatanIdx !== null ? 'Simpan Perubahan' : 'Tambah Kegiatan'}</span>
            </button>

            {editingKegiatanIdx !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingKegiatanIdx(null);
                  setKegiatanTitle('');
                  setKegiatanBadge('');
                  setKegiatanDesc('');
                  setKegiatanImageUrl('');
                }}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold border border-slate-300 transition-all"
              >
                Batal
              </button>
            )}
          </div>
        </form>

        {/* List Kegiatan Warga Aktif */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-[#85A389]/10 border border-[#85A389]/30">
            <h4 className="text-xs font-black text-[#5F8D4E] uppercase tracking-wider">Daftar Kegiatan Aktif</h4>
            <p className="text-[11px] text-slate-550 font-bold mt-1">
              Berikut adalah seluruh dokumentasi kegiatan warga yang sedang tampil di portal publik Anda.
            </p>
          </div>

          {(() => {
            const kegiatanPage = navItems.find(item => item.target_id === 'kegiatan-warga');
            let items = [] as any[];
            if (kegiatanPage?.custom_content) {
              try {
                const parsed = JSON.parse(kegiatanPage.custom_content);
                items = parsed.grid_items || [];
              } catch (e) {}
            }

            if (items.length === 0) {
              return (
                <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs font-bold text-slate-400">
                  Belum ada data kegiatan warga. Silakan tambahkan kegiatan pertama Anda!
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center space-x-4 min-w-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-sm" />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                          <Activity className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h4 className="text-sm font-black text-slate-800 truncate leading-snug">{item.title}</h4>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#85A389]/10 text-[#5F8D4E] rounded border border-[#85A389]/20 uppercase tracking-wider shrink-0">{item.badge}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-2">{getPreviewText(item.description)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingKegiatanIdx(idx);
                          setKegiatanTitle(item.title || '');
                          setKegiatanBadge(item.badge || '');
                          setKegiatanDesc(item.description || '');
                          setKegiatanImageUrl(item.image_url || '');
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center shadow-sm"
                        title="Edit Kegiatan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteKegiatan(idx)}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center shadow-sm"
                        title="Hapus Kegiatan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
};
