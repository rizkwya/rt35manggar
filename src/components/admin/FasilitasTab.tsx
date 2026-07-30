import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, MapPin, Landmark, Upload } from 'lucide-react';
import { RTFacility } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

interface FasilitasTabProps {
  showSuccess: (msg: string) => void;
}

export const FasilitasTab: React.FC<FasilitasTabProps> = ({ showSuccess }) => {
  const [facilities, setFacilities] = useState<RTFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    const loadFacilities = async () => {
      setLoading(true);
      try {
        const data = await SupabaseService.fetchFacilities();
        setFacilities(data);
      } catch (err) {
        console.error('Failed to load facilities:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFacilities();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const url = await SupabaseService.uploadImage(file, 'facilities');
      setImageUrl(url);
      showSuccess('Gambar fasilitas berhasil diunggah!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal mengunggah foto fasilitas: ' + (err.message || err));
    } finally {
      setUploadingImg(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const facilityObj: RTFacility = {
        name,
        description,
        location: location || undefined,
        image_url: imageUrl || undefined
      };

      if (editId) {
        facilityObj.id = editId;
      }

      const updatedList = await SupabaseService.updateFacility(facilityObj);
      setFacilities(updatedList);
      
      // Reset Form
      setName('');
      setDescription('');
      setLocation('');
      setImageUrl('');
      setEditId(null);
      
      showSuccess(editId ? 'Informasi fasilitas berhasil diperbarui!' : 'Fasilitas umum baru berhasil ditambahkan!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menyimpan fasilitas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (f: RTFacility) => {
    setEditId(f.id || null);
    setName(f.name || '');
    setDescription(f.description || '');
    setLocation(f.location || '');
    setImageUrl(f.image_url || '');
    
    // Scroll form into view on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Apakah Anda yakin ingin menghapus fasilitas umum ini?')) return;

    setLoading(true);
    try {
      const updatedList = await SupabaseService.deleteFacility(id);
      setFacilities(updatedList);
      showSuccess('Fasilitas umum berhasil dihapus!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menghapus fasilitas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* Form Input Fasilitas */}
      <form onSubmit={handleFormSubmit} className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-md">
        <div className="border-b border-slate-100 pb-2.5">
          <h3 className="text-lg font-black text-slate-900">
            {editId ? 'Ubah Detail Fasilitas' : 'Tambah Fasilitas Umum'}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Masukkan sarana warga terbaru seperti masjid, pos ronda, lapangan, atau taman.
          </p>
        </div>

        <div className="space-y-4 text-sm font-bold text-slate-700">
          {/* Nama Fasilitas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Nama Fasilitas</label>
            <input
              type="text"
              required
              placeholder="Contoh: Balai Pertemuan RT 35"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
            />
          </div>

          {/* Deskripsi Fasilitas */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Deskripsi / Rincian</label>
            <textarea
              rows={3}
              required
              placeholder="Tulis deskripsi fungsi, jadwal penggunaan, atau sejarah sarana..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
            />
          </div>

          {/* Lokasi Fisik */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Keterangan Lokasi</label>
            <input
              type="text"
              placeholder="Contoh: Depan Musholla RT 35 atau Sektor Barat"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
            />
          </div>

          {/* Gambar Fasilitas */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">Foto Fasilitas</label>
            
            {imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-55 h-36 shadow-sm group">
                <img src={imageUrl} alt="Preview Fasilitas" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow"
                  >
                    Hapus Foto
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-55 text-center hover:bg-slate-100/50 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[100px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  disabled={uploadingImg}
                />
                {uploadingImg ? (
                  <div className="space-y-1.5">
                    <div className="w-4 h-4 border-2 border-[#85A389] border-t-transparent rounded-full animate-spin mx-auto" />
                    <span className="text-[9px] text-slate-500 font-bold">Mengunggah foto...</span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-[#5F8D4E] hover:underline block">
                      Unggah Foto Fasilitas
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
            {editId ? <Save className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
            <span>{editId ? 'Simpan Perubahan' : 'Tambah Fasilitas'}</span>
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setName('');
                setDescription('');
                setLocation('');
                setImageUrl('');
              }}
              className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold border border-slate-300 transition-all"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* List Sarana Prasarana Aktif */}
      <div className="lg:col-span-7 space-y-4">
        <div className="p-4 rounded-2xl bg-[#85A389]/10 border border-[#85A389]/30">
          <h4 className="text-xs font-black text-[#5F8D4E] uppercase tracking-wider">Fasilitas Terdaftar ({facilities.length})</h4>
          <p className="text-[11px] text-slate-550 font-bold mt-1">
            Berikut adalah daftar fasilitas umum yang ditayangkan di halaman depan portal publik RT 35 Anda.
          </p>
        </div>

        {facilities.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs font-bold text-slate-400">
            Belum ada data sarana prasarana. Silakan tambahkan fasilitas pertama Anda!
          </div>
        ) : (
          <div className="space-y-4">
            {facilities.map((item) => (
              <div 
                key={item.id} 
                className="p-5 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-100 shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                      <Landmark className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h4 className="text-sm font-black text-slate-800 truncate leading-snug">{item.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold line-clamp-2">{item.description}</p>
                    {item.location && (
                      <p className="text-[10px] text-[#5F8D4E] font-bold flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{item.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-750 border border-slate-200 text-xs font-bold flex items-center justify-center shadow-sm"
                    title="Ubah Fasilitas"
                  >
                    <Edit className="w-4 h-4 text-[#85A389]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center shadow-sm"
                    title="Hapus Fasilitas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
