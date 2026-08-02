import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, Upload } from 'lucide-react';
import { NavigationItem } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

interface MenuNavigationTabProps {
  navItems: NavigationItem[];
  onNavItemsUpdate: (items: NavigationItem[]) => void;
  showSuccess: (msg: string) => void;
}

export const MenuNavigationTab: React.FC<MenuNavigationTabProps> = ({
  navItems,
  onNavItemsUpdate,
  showSuccess
}) => {
  const [loading, setLoading] = useState(false);

  // Navigation Menu Form States
  const [editingNavId, setEditingNavId] = useState<string | null>(null);
  const [navLabel, setNavLabel] = useState('');
  const [navType, setNavType] = useState<'anchor' | 'custom_page'>('anchor');
  const [navTargetId, setNavTargetId] = useState('');
  const [navOrder, setNavOrder] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const [navContent, setNavContent] = useState('');

  // Structured Page Template States
  const [navBannerUrl, setNavBannerUrl] = useState('');
  const [navSubtitle, setNavSubtitle] = useState('');
  const [navBody, setNavBody] = useState('');
  const [navGridItems, setNavGridItems] = useState<{ title: string; description: string; image_url?: string; badge?: string; summary?: string; created_at?: string; }[]>([]);

  // Temp card item builder states
  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');
  const [cardImg, setCardImg] = useState('');
  const [cardBadge, setCardBadge] = useState('');

  const [uploadingNavBanner, setUploadingNavBanner] = useState(false);
  const [uploadingCardImg, setUploadingCardImg] = useState(false);

  const handleNavBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNavBanner(true);
    try {
      const url = await SupabaseService.uploadImage(file, 'banners');
      setNavBannerUrl(url);
      showSuccess('Gambar banner halaman berhasil diunggah!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal mengunggah banner: ' + (err.message || err) + '\n\n💡 Solusi: Pastikan Anda telah membuat bucket bernama "rt-assets" di storage Supabase Anda dan menyetel aksesnya ke publik.');
    } finally {
      setUploadingNavBanner(false);
    }
  };

  const handleCardImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCardImg(true);
    try {
      const url = await SupabaseService.uploadImage(file, 'cards');
      setCardImg(url);
      showSuccess('Gambar kartu berhasil diunggah!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal mengunggah foto kartu: ' + (err.message || err) + '\n\n💡 Solusi: Pastikan Anda telah membuat bucket bernama "rt-assets" di storage Supabase Anda dan menyetel aksesnya ke publik.');
    } finally {
      setUploadingCardImg(false);
    }
  };

  const handleEditNav = (item: NavigationItem) => {
    setEditingNavId(item.id);
    setNavLabel(item.label);
    setNavType(item.type);
    setNavTargetId(item.target_id);
    setNavOrder(item.order_index);
    setNavVisible(item.is_visible);
    setNavContent(item.custom_content || '');

    if (item.type === 'custom_page' && item.custom_content?.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(item.custom_content);
        setNavBannerUrl(parsed.banner_url || '');
        setNavSubtitle(parsed.subtitle || '');
        setNavBody(parsed.body || '');
        setNavGridItems(parsed.grid_items || []);
      } catch (e) {
        setNavBannerUrl('');
        setNavSubtitle('');
        setNavBody(item.custom_content || '');
        setNavGridItems([]);
      }
    } else {
      setNavBannerUrl('');
      setNavSubtitle('');
      setNavBody('');
      setNavGridItems([]);
    }
  };

  const resetNavForm = () => {
    setEditingNavId(null);
    setNavLabel('');
    setNavType('anchor');
    setNavTargetId('');
    setNavOrder(0);
    setNavVisible(true);
    setNavContent('');
    setNavBannerUrl('');
    setNavSubtitle('');
    setNavBody('');
    setNavGridItems([]);
    setCardTitle('');
    setCardDesc('');
    setCardImg('');
    setCardBadge('');
  };

  const handleSaveNav = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!navLabel.trim() || !navTargetId.trim()) {
      alert('Nama Menu dan ID Target harus diisi!');
      return;
    }
    setLoading(true);
    try {
      let finalContent = navContent;

      if (navType === 'custom_page') {
        finalContent = JSON.stringify({
          banner_url: navBannerUrl.trim(),
          subtitle: navSubtitle.trim(),
          body: navBody.trim(),
          grid_items: navGridItems
        });
      }

      const payload: NavigationItem = {
        id: editingNavId || `nav-${Date.now()}`,
        label: navLabel.trim(),
        type: navType,
        target_id: navTargetId.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
        order_index: Number(navOrder),
        is_visible: navVisible,
        custom_content: finalContent
      };

      const res = await SupabaseService.saveNavItems([payload]);
      onNavItemsUpdate(res);
      resetNavForm();
      showSuccess('Item menu navigasi berhasil disimpan!');
    } catch (err: any) {
      console.error('Error saving nav item:', err);
      alert('Gagal menyimpan menu navigasi: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNav = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini? Warga tidak akan bisa melihat halaman/tautan ini lagi.')) return;
    setLoading(true);
    try {
      const res = await SupabaseService.deleteNavItem(id);
      onNavItemsUpdate(res);
      showSuccess('Menu navigasi berhasil dihapus!');
    } catch (err: any) {
      console.error('Error deleting nav item:', err);
      alert('Gagal menghapus menu navigasi: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNavVisible = async (item: NavigationItem) => {
    setLoading(true);
    try {
      const updated = { ...item, is_visible: !item.is_visible };
      const res = await SupabaseService.saveNavItems([updated]);
      onNavItemsUpdate(res);
      showSuccess(`Menu "${item.label}" sekarang ${!item.is_visible ? 'ditampilkan' : 'disembunyikan'}.`);
    } catch (err: any) {
      console.error('Error toggling nav visibility:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* Form Column */}
      <form onSubmit={handleSaveNav} className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-md">
        <div className="border-b border-slate-100 pb-2.5">
          <h3 className="text-lg font-black text-slate-900">
            {editingNavId ? 'Edit Menu Navigasi' : 'Tambah Menu Navigasi'}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Kelola menu di header portal secara fleksibel tanpa coding.
          </p>
        </div>

        <div className="space-y-4 text-sm font-bold text-slate-700">
          {/* Nama Menu */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Nama Menu (Label)</label>
            <input
              type="text"
              required
              placeholder="Contoh: Kegiatan Warga"
              value={navLabel}
              onChange={(e) => setNavLabel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
            />
          </div>

          {/* Tipe Menu */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Tipe Aksi Menu</label>
            <select
              value={navType}
              onChange={(e) => setNavType(e.target.value as 'anchor' | 'custom_page')}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
            >
              <option value="anchor">Scroll ke Section Beranda (Anchor)</option>
              <option value="custom_page">Buka Sub-halaman Baru (Custom Page)</option>
            </select>
          </div>

          {/* Target ID / Path */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              {navType === 'anchor' ? 'ID Target Section (Scroll)' : 'Path Halaman Unik (URL)'}
            </label>
            <input
              type="text"
              required
              placeholder={navType === 'anchor' ? 'Contoh: pengurus-rt' : 'Contoh: bank-sampah'}
              value={navTargetId}
              onChange={(e) => setNavTargetId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
            />
            <p className="text-[10px] text-slate-400 font-bold leading-normal">
              {navType === 'anchor' 
                ? 'Gunakan ID yang ada di landing page (seperti: statistik-warga, pengurus-rt, kontak-layanan)'
                : `URL sub-halaman nanti adalah: /page/${navTargetId.toLowerCase().replace(/[^a-z0-9-_]/g, '-')}`
              }
            </p>
          </div>

          {/* Urutan & Visibilitas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Urutan Menu</label>
              <input
                type="number"
                value={navOrder}
                onChange={(e) => setNavOrder(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Status Tampil</label>
              <select
                value={navVisible ? 'true' : 'false'}
                onChange={(e) => setNavVisible(e.target.value === 'true')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none"
              >
                <option value="true">Tampilkan di Header</option>
                <option value="false">Sembunyikan</option>
              </select>
            </div>
          </div>

          {/* CUSTOM PAGE TEMPLATE CONFIGURATION */}
          {navType === 'custom_page' && (
            <div className="border-t border-slate-200 pt-5 mt-5 space-y-4">
              <div className="bg-[#85A389]/10 p-3.5 rounded-xl border border-[#85A389]/20">
                <h4 className="text-xs font-black text-[#5F8D4E] uppercase tracking-wider">Tata Letak Sub-halaman</h4>
                <p className="text-[10px] text-slate-450 mt-1 font-bold">Isi konten dan galeri kartu untuk sub-halaman dinamis ini.</p>
              </div>

              {/* Banner Cover */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider">Gambar Banner Atas (Cover)</label>
                {navBannerUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-28 shadow-sm group">
                    <img src={navBannerUrl} alt="Preview Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => setNavBannerUrl('')} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black rounded-lg">
                        Hapus Banner
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-55 text-center hover:bg-slate-100/50 cursor-pointer flex flex-col items-center justify-center min-h-[70px]">
                    <input type="file" accept="image/*" onChange={handleNavBannerUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" disabled={uploadingNavBanner} />
                    {uploadingNavBanner ? (
                      <div className="w-4 h-4 border-2 border-[#85A389] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-xs font-bold text-[#5F8D4E]">Pilih Banner Cover</span>
                    )}
                  </div>
                )}
              </div>

              {/* Subtitle Halaman */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider">Subtitle Halaman</label>
                <input
                  type="text"
                  placeholder="Kutipan singkat penjelas isi halaman..."
                  value={navSubtitle}
                  onChange={(e) => setNavSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              {/* Paragraf Utama */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider">Isi Deskripsi Paragraf</label>
                <textarea
                  rows={3}
                  placeholder="Paragraf penjelasan lengkap isi halaman..."
                  value={navBody}
                  onChange={(e) => setNavBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              {/* List Kartu Galeri / Grid Builder */}
              <div className="space-y-3.5 border-t border-slate-150 pt-4">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600">Buat Kartu Galeri Grid ({navGridItems.length} kartu)</label>
                
                {/* List item kartu yang sudah ditambahkan */}
                {navGridItems.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 p-3 rounded-2xl bg-slate-50/50">
                    {navGridItems.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-[10px] font-bold">
                        <span className="truncate pr-2">{c.title}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...navGridItems];
                            updated.splice(idx, 1);
                            setNavGridItems(updated);
                          }}
                          className="text-rose-500 hover:text-rose-700 shrink-0 font-extrabold"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form pembuat kartu temporary */}
                <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 space-y-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Form Desain Kartu</span>
                  
                  <input
                    type="text"
                    placeholder="Judul Kartu..."
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold"
                  />
                  <textarea
                    rows={2}
                    placeholder="Keterangan singkat..."
                    value={cardDesc}
                    onChange={(e) => setCardDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Badge (opsional)..."
                      value={cardBadge}
                      onChange={(e) => setCardBadge(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold"
                    />
                    
                    {/* Upload Card Image */}
                    {cardImg ? (
                      <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-white h-8 flex items-center justify-center text-[10px] font-extrabold text-[#5F8D4E] truncate px-2">
                        Ada Gambar
                        <button type="button" onClick={() => setCardImg('')} className="absolute right-1 text-rose-600 font-extrabold hover:text-rose-800">×</button>
                      </div>
                    ) : (
                      <div className="relative border border-slate-200 rounded-lg h-8 bg-white hover:bg-slate-100/50 text-center flex items-center justify-center cursor-pointer text-[10px] font-bold text-[#5F8D4E]">
                        <input type="file" accept="image/*" onChange={handleCardImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" disabled={uploadingCardImg} />
                        {uploadingCardImg ? '...' : 'Upload Foto'}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!cardTitle.trim() || !cardDesc.trim()) {
                        alert('Judul Kartu dan Keterangan harus diisi!');
                        return;
                      }
                      setNavGridItems([
                        ...navGridItems,
                        {
                          title: cardTitle.trim(),
                          description: cardDesc.trim(),
                          image_url: cardImg.trim() || undefined,
                          badge: cardBadge.trim() || undefined
                        }
                      ]);
                      // Clear inputs
                      setCardTitle('');
                      setCardDesc('');
                      setCardImg('');
                      setCardBadge('');
                    }}
                    className="w-full py-2 bg-[#85A389]/10 hover:bg-[#85A389]/20 text-[#5F8D4E] font-extrabold text-xs rounded-xl transition-all border border-[#85A389]/20"
                  >
                    + Tambah Kartu ke Halaman
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="flex-grow py-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow"
          >
            <Save className="w-4 h-4" />
            <span>{editingNavId ? 'Simpan Perubahan' : 'Tambah Menu'}</span>
          </button>
          {editingNavId && (
            <button
              type="button"
              onClick={resetNavForm}
              className="px-4 py-3 rounded-xl bg-slate-200 hover:bg-[#85A389]/10 text-slate-700 text-xs font-bold transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* List Column */}
      <div className="lg:col-span-7 space-y-4">
        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-md">
          <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 mb-4">
            Daftar Menu Navigasi Aktif
          </h3>
          
          <div className="space-y-3">
            {navItems.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-2xl border-2 border-slate-100 hover:border-[#85A389]/25 bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-900">{item.label}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      item.type === 'anchor' 
                        ? 'bg-sky-50 text-sky-605 border border-sky-100'
                        : 'bg-emerald-50 text-emerald-605 border border-emerald-100'
                    }`}>
                      {item.type === 'anchor' ? 'Anchor Section' : 'Halaman Baru'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Target: <code className="bg-slate-50 px-1.5 py-0.5 rounded text-slate-600 font-semibold">
                      {item.type === 'anchor' ? `#${item.target_id}` : `/page/${item.target_id}`}
                    </code>
                    <span className="mx-2">•</span>
                    Urutan: <strong>{item.order_index}</strong>
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {/* Visibility Toggle */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleToggleNavVisible(item)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all border ${
                      item.is_visible
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-[#85A389]/10'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {item.is_visible ? 'Tampil' : 'Sembunyi'}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleEditNav(item)}
                    className="p-1.5 rounded-lg border-2 border-slate-100 hover:border-slate-350 text-slate-600 hover:text-slate-900 transition-all bg-slate-50"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleDeleteNav(item.id)}
                    className="p-1.5 rounded-lg border-2 border-slate-100 hover:border-rose-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {navItems.length === 0 && (
              <div className="text-center py-8 text-xs font-semibold text-slate-400">
                Belum ada menu navigasi terdaftar.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
