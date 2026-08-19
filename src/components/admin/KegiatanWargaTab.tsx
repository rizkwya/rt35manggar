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
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const [pageSubtitle, setPageSubtitle] = useState('');
  const [pageBody, setPageBody] = useState('');
  const [editingKegiatanIdx, setEditingKegiatanIdx] = useState<number | null>(null);
  const [kegiatanTitle, setKegiatanTitle] = useState('');
  const [kegiatanBadge, setKegiatanBadge] = useState('');
  const [kegiatanSummary, setKegiatanSummary] = useState('');
  const [kegiatanDesc, setKegiatanDesc] = useState('');
  const [kegiatanImageUrl, setKegiatanImageUrl] = useState('');
  const [pageBannerUrl, setPageBannerUrl] = useState('');
  const [uploadingKegiatanImg, setUploadingKegiatanImg] = useState(false);
  const [uploadingPageBanner, setUploadingPageBanner] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Extract kegiatan items
  const kegiatanPage = navItems.find(item => item.target_id === 'kegiatan-warga');
  let kegiatanItems = [] as any[];
  if (kegiatanPage?.custom_content) {
    try {
      const parsed = JSON.parse(kegiatanPage.custom_content);
      kegiatanItems = parsed.grid_items || [];
    } catch (e) {}
  }

  // Reset page when items length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [kegiatanItems.length]);

  useEffect(() => {
    if (kegiatanPage?.custom_content) {
      try {
        const parsed = JSON.parse(kegiatanPage.custom_content);
        setPageSubtitle(parsed.subtitle || '');
        setPageBody(parsed.body || '');
        setPageBannerUrl(parsed.banner_url || '');
      } catch (e) {}
    }
  }, [navItems]);

  const handlePageBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPageBanner(true);
    try {
      const url = await SupabaseService.uploadImage(file, 'banners');
      setPageBannerUrl(url);
      showSuccess('Gambar banner halaman berhasil diunggah!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal mengunggah banner: ' + (err.message || err));
    } finally {
      setUploadingPageBanner(false);
    }
  };

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

    if (!kegiatanPage) {
      alert('Halaman Kegiatan Warga tidak ditemukan.');
      return;
    }

    setLoading(true);
    if (editingKegiatanIdx === null) {
      setIsAdding(true);
    }
    try {
      let contentObj = { banner_url: '', subtitle: '', body: '', grid_items: [] as any[] };
      if (kegiatanPage.custom_content) {
        try {
          contentObj = JSON.parse(kegiatanPage.custom_content);
        } catch (err) {
          console.warn('Failed to parse current custom content:', err);
        }
      }

      let updatedGridItems = [...(contentObj.grid_items || [])];
      
      const getPlainSummary = (htmlContent: string) => {
        const plain = htmlContent.replace(/<[^>]*>/g, ' ');
        const cleaned = plain.replace(/\s+/g, ' ').trim();
        if (cleaned.length <= 120) return cleaned;
        return cleaned.substring(0, 120) + '...';
      };

      const newItem = {
        title: kegiatanTitle,
        badge: kegiatanBadge,
        summary: getPlainSummary(kegiatanDesc),
        description: kegiatanDesc,
        image_url: kegiatanImageUrl,
        created_at: editingKegiatanIdx !== null && updatedGridItems[editingKegiatanIdx]?.created_at
          ? updatedGridItems[editingKegiatanIdx].created_at
          : new Date().toISOString()
      };

      if (editingKegiatanIdx !== null) {
        updatedGridItems[editingKegiatanIdx] = newItem;
      } else {
        updatedGridItems.push(newItem);
      }

      const updatedPageItem = {
        ...kegiatanPage,
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
      setKegiatanSummary('');
      setKegiatanDesc('');
      setKegiatanImageUrl('');
      
      showSuccess(editingKegiatanIdx !== null ? 'Kegiatan warga berhasil diperbarui!' : 'Kegiatan warga baru berhasil ditambahkan!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyimpan kegiatan warga: ' + err.message);
    } finally {
      setLoading(false);
      setIsAdding(false);
    }
  };

  const handleDeleteKegiatan = async (idx: number) => {
    if (!kegiatanPage) return;

    if (!window.confirm('Apakah Anda yakin ingin menghapus kegiatan warga ini?')) return;

    setLoading(true);
    setDeletingIdx(idx);
    try {
      let contentObj = { banner_url: '', subtitle: '', body: '', grid_items: [] as any[] };
      if (kegiatanPage.custom_content) {
        try {
          contentObj = JSON.parse(kegiatanPage.custom_content);
        } catch (err) {
          console.warn('Failed to parse current custom content:', err);
        }
      }

      let updatedGridItems = [...(contentObj.grid_items || [])];
      updatedGridItems.splice(idx, 1);

      const updatedPageItem = {
        ...kegiatanPage,
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
      setDeletingIdx(null);
    }
  };

  const handleSavePageMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kegiatanPage) return;

    setLoading(true);
    setIsSavingMeta(true);
    try {
      let contentObj = { banner_url: '', subtitle: '', body: '', grid_items: [] as any[] };
      if (kegiatanPage.custom_content) {
        try {
          contentObj = JSON.parse(kegiatanPage.custom_content);
        } catch (err) {
          console.warn(err);
        }
      }

      const updatedPageItem = {
        ...kegiatanPage,
        custom_content: JSON.stringify({
          ...contentObj,
          banner_url: pageBannerUrl,
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
      setIsSavingMeta(false);
    }
  };

  const totalPages = Math.ceil(kegiatanItems.length / itemsPerPage);
  const paginatedItems = kegiatanItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Meta Section: Title & Subtitle */}
      <form onSubmit={handleSavePageMeta} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-900">Deskripsi Halaman Kegiatan Warga</h3>
          <p className="text-xs text-slate-505 font-semibold mt-1">
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
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-808 focus:outline-none focus:border-[#85A389] focus:bg-white"
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
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-medium text-slate-808 focus:outline-none focus:border-[#85A389] focus:bg-white"
            />
          </div>

          {/* Banner Cover Halaman */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gambar Banner Atas (Cover)</label>
            {pageBannerUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-40 shadow-sm group max-w-xl">
                <img src={pageBannerUrl} alt="Preview Banner Halaman" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => setPageBannerUrl('')} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg">
                    Hapus Banner
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-all relative max-w-xl">
                <input type="file" accept="image/*" onChange={handlePageBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" disabled={uploadingPageBanner} />
                {uploadingPageBanner ? (
                  <span className="text-xs text-slate-400">Sedang mengunggah...</span>
                ) : (
                  <span className="text-xs font-bold text-[#5F8D4E]">Pilih Banner Cover Baru</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {isSavingMeta ? (
              <span className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyimpan...</span>
              </span>
            ) : (
              <>
                <Save className="w-4.5 h-4.5 text-white" />
                <span>Simpan Informasi Halaman</span>
              </>
            )}
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-808 focus:outline-none focus:border-slate-800 disabled:opacity-60"
                disabled={loading}
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-808 focus:outline-none focus:border-slate-800 disabled:opacity-60"
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Deskripsi Kegiatan (Mendukung Rich Text)</label>
              <div className={loading ? 'opacity-60 pointer-events-none' : ''}>
                <TiptapEditor
                  content={kegiatanDesc}
                  onChange={setKegiatanDesc}
                  placeholder="Tulis rincian lengkap mengenai pelaksanaan kegiatan ini..."
                />
              </div>
            </div>

            {/* Gambar Kegiatan */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Gambar Kegiatan</label>
              
              {kegiatanImageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-36 shadow-sm group">
                  <img src={kegiatanImageUrl} alt="Preview Kegiatan" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setKegiatanImageUrl('')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow"
                      disabled={loading}
                    >
                      Hapus Gambar
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`relative border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50 text-center hover:bg-slate-100/50 transition-colors flex flex-col items-center justify-center min-h-[100px] ${loading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleKegiatanImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    disabled={uploadingKegiatanImg || loading}
                  />
                  {uploadingKegiatanImg ? (
                    <div className="space-y-1.5">
                      <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto" />
                      <span className="text-[9px] text-slate-555 font-bold">Mengunggah gambar...</span>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold text-slate-800 hover:underline block">
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
              className="flex-grow py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs shadow transition-all flex items-center justify-center space-x-1.5 disabled:opacity-60"
            >
              {loading && editingKegiatanIdx === null ? (
                <span className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </span>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-white" />
                  <span>{editingKegiatanIdx !== null ? 'Simpan Perubahan' : 'Tambah Kegiatan'}</span>
                </>
              )}
            </button>

            {editingKegiatanIdx !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingKegiatanIdx(null);
                  setKegiatanTitle('');
                  setKegiatanBadge('');
                  setKegiatanSummary('');
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
        <div className="lg:col-span-7 space-y-6">
          <div className="p-4.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-slate-550" />
              <span className="text-sm font-black text-slate-800">Daftar Kegiatan Aktif</span>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 font-black text-slate-650">
              {kegiatanItems.length} Kegiatan
            </span>
          </div>

          {kegiatanItems.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs font-bold text-slate-400">
              Belum ada data kegiatan warga. Silakan tambahkan kegiatan pertama Anda!
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {/* Skeleton Loader at top only when adding a new activity */}
                {isAdding && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4 animate-pulse min-h-[80px]">
                    <div className="w-14 h-14 rounded-xl bg-slate-200 shrink-0" />
                    <div className="space-y-2 flex-grow">
                      <div className="h-3.5 bg-slate-200 rounded w-1/4" />
                      <div className="h-4.5 bg-slate-200 rounded w-2/3" />
                    </div>
                  </div>
                )}

                {paginatedItems.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                  const isSavingThis = editingKegiatanIdx === globalIdx && loading;
                  const isDeletingThis = deletingIdx === globalIdx && loading;

                  if (isSavingThis || isDeletingThis) {
                    return (
                      <div key={globalIdx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4 animate-pulse min-h-[80px]">
                        <div className="w-14 h-14 rounded-xl bg-slate-200 shrink-0" />
                        <div className="space-y-2 flex-grow">
                          <div className="h-3.5 bg-slate-200 rounded w-1/4" />
                          <div className="h-4.5 bg-slate-250 rounded w-2/3" />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={globalIdx} className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-slate-350 transition-all">
                      <div className="flex items-center space-x-4 min-w-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100 shadow-sm" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                            <Activity className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <h4 className="text-sm font-black text-slate-800 truncate leading-snug">{item.title}</h4>
                            {item.badge && (
                              <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#85A389]/10 text-[#5F8D4E] rounded border border-[#85A389]/20 uppercase tracking-wider shrink-0">{item.badge}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-2">{item.summary || getPreviewText(item.description)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingKegiatanIdx(globalIdx);
                            setKegiatanTitle(item.title || '');
                            setKegiatanBadge(item.badge || '');
                            setKegiatanSummary(item.summary || '');
                            setKegiatanDesc(item.description || '');
                            setKegiatanImageUrl(item.image_url || '');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center shadow-sm"
                          title="Edit Kegiatan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteKegiatan(globalIdx)}
                          className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center shadow-sm"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                  
                  {/* Desktop Pagination Numbers */}
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

                  {/* Mobile Pagination Info Indicator */}
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
          )}
        </div>

      </div>
    </div>
  );
};
