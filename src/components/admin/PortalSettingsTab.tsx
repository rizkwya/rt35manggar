import React, { useState, useEffect } from 'react';
import { Save, MapPin } from 'lucide-react';
import { RTSettings } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

interface PortalSettingsTabProps {
  settings: RTSettings | undefined;
  onUpdateSettings: (settings: RTSettings) => void;
  showSuccess: (msg: string) => void;
}

export const PortalSettingsTab: React.FC<PortalSettingsTabProps> = ({
  settings,
  onUpdateSettings,
  showSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [portalName, setPortalName] = useState('');
  const [portalDesc, setPortalDesc] = useState('');
  const [portalAddress, setPortalAddress] = useState('');
  const [portalAddressDetail, setPortalAddressDetail] = useState('');
  const [portalServiceHours, setPortalServiceHours] = useState('');
  const [portalPhoneSecretary, setPortalPhoneSecretary] = useState('');
  const [portalEmergencyTitle, setPortalEmergencyTitle] = useState('');
  const [portalEmergencyDesc, setPortalEmergencyDesc] = useState('');
  const [portalMapsCoordinate, setPortalMapsCoordinate] = useState('');
  const [portalSyaratSurat, setPortalSyaratSurat] = useState('');
  const [portalKontakDarurat, setPortalKontakDarurat] = useState('');
  const [portalVision, setPortalVision] = useState('');
  const [portalMission, setPortalMission] = useState('');
  const [portalHistory, setPortalHistory] = useState('');
  const [portalBoundaryNorth, setPortalBoundaryNorth] = useState('');
  const [portalBoundarySouth, setPortalBoundarySouth] = useState('');
  const [portalBoundaryEast, setPortalBoundaryEast] = useState('');
  const [portalBoundaryWest, setPortalBoundaryWest] = useState('');
  const [kknPoskoLocation, setKknPoskoLocation] = useState('');

  useEffect(() => {
    if (settings) {
      setPortalName(settings.portal_name || 'Portal Pelayanan Digital Masyarakat RT 35 Manggar');
      setPortalDesc(settings.portal_description || 'Media informasi resmi warga pesisir RT 35. Menyediakan transparansi data demografi kependudukan, pemetaan tingkat kesejahteraan warga, papan pengumuman lingkungan, serta integrasi layanan aspirasi online.');
      setPortalAddress(settings.address || 'Balai RT 35 Kelurahan Manggar 2, Balikpapan Timur');
      setPortalAddressDetail(settings.address_detail || 'Kawasan Pesisir RT 35, Kelurahan Manggar 2, Kecamatan Balikpapan Timur, Kota Balikpapan, Kalimantan Timur (76116).');
      setPortalServiceHours(settings.service_hours || 'Senin - Jumat: 19.30 - 21.30 WITA (Di Balai RT)\nSabtu - Minggu: Dengan Perjanjian');
      setPortalPhoneSecretary(settings.phone_secretary || '0812-9876-5432');
      setPortalEmergencyTitle(settings.emergency_title || 'Siaga Darurat RT 35');
      setPortalEmergencyDesc(settings.emergency_description || 'Hubungi kontak darurat berikut jika memerlukan bantuan cepat.');
      setPortalMapsCoordinate(settings.maps_coordinate || '1°14\'11.4"S 116°56\'04.0"E');
      setPortalSyaratSurat(settings.syarat_surat || '');
      setPortalKontakDarurat(settings.kontak_darurat || '');
      setKknPoskoLocation(settings.kkn_posko_location || 'RT 35 Kel. Manggar');
      
      // Load profile RT fields
      setPortalVision(settings.vision || '');
      setPortalMission(settings.mission || '');
      setPortalHistory(settings.history || '');
      setPortalBoundaryNorth(settings.boundary_north || '');
      setPortalBoundarySouth(settings.boundary_south || '');
      setPortalBoundaryEast(settings.boundary_east || '');
      setPortalBoundaryWest(settings.boundary_west || '');
    }
  }, [settings]);

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated: RTSettings = {
        ...settings,
        portal_name: portalName,
        portal_description: portalDesc,
        address: portalAddress,
        address_detail: portalAddressDetail,
        service_hours: portalServiceHours,
        phone_secretary: portalPhoneSecretary,
        emergency_title: portalEmergencyTitle,
        emergency_description: portalEmergencyDesc,
        maps_coordinate: portalMapsCoordinate,
        syarat_surat: portalSyaratSurat,
        kontak_darurat: portalKontakDarurat,
        
        // Profile RT fields
        vision: portalVision,
        mission: portalMission,
        history: portalHistory,
        boundary_north: portalBoundaryNorth,
        boundary_south: portalBoundarySouth,
        boundary_east: portalBoundaryEast,
        boundary_west: portalBoundaryWest,
        kkn_posko_location: kknPoskoLocation
      };
      await SupabaseService.updateSettings(updated);
      onUpdateSettings(updated);
      showSuccess('Pengaturan portal dan profil RT berhasil disimpan!');
    } catch (err: any) {
      console.error('Failed saving settings:', err);
      alert('Gagal menyimpan pengaturan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSettingsSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6 animate-fade-in">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-lg font-black text-slate-900">Konfigurasi Pengaturan Portal Publik</h3>
        <p className="text-xs text-slate-500 font-semibold mt-1">Ubah nama portal, deskripsi, alamat balai, jam pelayanan, dan informasi kontak dinamis lainnya.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 text-sm font-bold text-slate-700">
        
        {/* Nama Portal */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Nama / Judul Portal</label>
          <input
            type="text"
            value={portalName}
            onChange={(e) => setPortalName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389] focus:bg-white"
            required
          />
        </div>

        {/* Deskripsi Portal */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Deskripsi / Subtitle Utama</label>
          <textarea
            rows={3}
            value={portalDesc}
            onChange={(e) => setPortalDesc(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#85A389] focus:bg-white"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Alamat Singkat */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Nama Alamat Balai RT (Singkat)</label>
            <input
              type="text"
              value={portalAddress}
              onChange={(e) => setPortalAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#85A389] focus:bg-white"
              required
            />
          </div>

          {/* Lokasi Posko KKN */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0b5665]">Lokasi Posko KKN Kelompok 7</label>
            <input
              type="text"
              value={kknPoskoLocation}
              onChange={(e) => setKknPoskoLocation(e.target.value)}
              placeholder="Contoh: RT 35 Kel. Manggar"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          {/* Telepon Sekretaris */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Nomor Telepon Sekretaris RT</label>
            <input
              type="text"
              value={portalPhoneSecretary}
              onChange={(e) => setPortalPhoneSecretary(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389]"
              required
            />
          </div>
        </div>

        {/* Detail Alamat Balai */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Alamat Lengkap Sekretariat / Balai RT</label>
          <textarea
            rows={2}
            value={portalAddressDetail}
            onChange={(e) => setPortalAddressDetail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-[#85A389]"
            required
          />
        </div>

        {/* Jam Layanan */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Jam Operasional Pelayanan Administrasi (Satu per baris)</label>
          <textarea
            rows={2}
            value={portalServiceHours}
            onChange={(e) => setPortalServiceHours(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#85A389]"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Judul Info Darurat */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Judul Panel Info Darurat</label>
            <input
              type="text"
              value={portalEmergencyTitle}
              onChange={(e) => setPortalEmergencyTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389]"
              required
            />
          </div>

          {/* Deskripsi Info Darurat */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Keterangan Panel Info Darurat</label>
            <input
              type="text"
              value={portalEmergencyDesc}
              onChange={(e) => setPortalEmergencyDesc(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389]"
              required
            />
          </div>
        </div>

        {/* Koordinat Google Maps */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <div>
            <h4 className="text-sm font-extrabold text-[#1E4D6B] flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-[#1E4D6B]" />
              <span>Lokasi Koordinat GPS Peta (Google Maps)</span>
            </h4>
            <p className="text-[11px] text-slate-450 mt-0.5 leading-relaxed">
              Masukkan titik koordinat lokasi untuk memperbarui pin peta secara otomatis. Anda bisa memasukkan format desimal biasa (seperti <code className="bg-slate-100 px-1 py-0.5 rounded font-black text-rose-600">-1.282367, 116.974441</code>) atau format derajat DMS presisi tinggi (seperti <code className="bg-slate-100 px-1 py-0.5 rounded font-black text-rose-600">1°14'11.4"S 116°56'04.0"E</code>) hasil copy-paste langsung dari Google Maps.
            </p>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Koordinat Lokasi GPS (Decimal atau DMS)</label>
            <input
              type="text"
              placeholder="Contoh: 1°14'11.4&quot;S 116°56'04.0&quot;E atau -1.282367, 116.974441"
              value={portalMapsCoordinate}
              onChange={(e) => setPortalMapsCoordinate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-black text-slate-800 focus:outline-none focus:border-[#85A389]"
              required
            />
          </div>
        </div>

        {/* Syarat Surat Pengantar & Pusat Kontak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 pt-4">
          
          {/* Syarat Surat Pengantar */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Syarat Surat Pengantar RT (Satu per baris)</label>
            <textarea
              rows={4}
              placeholder="Contoh:&#10;Fotokopi KK Terbaru&#10;Fotokopi KTP Pemohon"
              value={portalSyaratSurat}
              onChange={(e) => setPortalSyaratSurat(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-850 focus:outline-none focus:border-[#85A389]"
              required
            />
          </div>

          {/* Daftar Pusat Kontak Darurat */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Daftar Kontak Darurat (Satu per baris)</label>
            <textarea
              rows={4}
              placeholder="Contoh:&#10;Ambulans: 118&#10;Pemadam Kebakaran: 113"
              value={portalKontakDarurat}
              onChange={(e) => setPortalKontakDarurat(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-850 focus:outline-none focus:border-[#85A389]"
              required
            />
          </div>

        </div>

        {/* Profil RT Editor Fields */}
        <div className="border-t border-slate-100 pt-6 space-y-6">
          <div>
            <h4 className="text-sm font-extrabold text-[#1E4D6B] uppercase tracking-wider">Profil Rukun Tetangga (RT 35)</h4>
            <p className="text-[11px] text-slate-450 mt-0.5 leading-relaxed">
              Konfigurasi Visi, Misi, Sejarah, dan batas kewilayahan untuk ditampilkan secara dinamis di seksi Profil halaman depan.
            </p>
          </div>

          <div className="space-y-4">
            {/* Visi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Visi Lingkungan RT 35</label>
              <textarea
                rows={2}
                placeholder="Tulis visi lingkungan..."
                value={portalVision}
                onChange={(e) => setPortalVision(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-850 focus:outline-none focus:border-[#85A389]"
                required
              />
            </div>

            {/* Misi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Misi Lingkungan (Satu per baris)</label>
              <textarea
                rows={4}
                placeholder="Contoh:&#10;1. Meningkatkan kerukunan warga...&#10;2. Mendorong digitalisasi..."
                value={portalMission}
                onChange={(e) => setPortalMission(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-850 focus:outline-none focus:border-[#85A389]"
                required
              />
            </div>

            {/* Sejarah Singkat */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Sejarah Singkat Pendirian RT 35</label>
              <textarea
                rows={4}
                placeholder="Tulis narasi sejarah berdirinya lingkungan..."
                value={portalHistory}
                onChange={(e) => setPortalHistory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm font-semibold text-slate-850 focus:outline-none focus:border-[#85A389]"
                required
              />
            </div>

            {/* Batas Geografis (Grid 2x2) */}
            <div className="space-y-3 pt-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Batas Administrasi Wilayah RT 35</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450">Batas Utara</label>
                  <input
                    type="text"
                    value={portalBoundaryNorth}
                    onChange={(e) => setPortalBoundaryNorth(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450">Batas Timur</label>
                  <input
                    type="text"
                    value={portalBoundaryEast}
                    onChange={(e) => setPortalBoundaryEast(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450">Batas Selatan</label>
                  <input
                    type="text"
                    value={portalBoundarySouth}
                    onChange={(e) => setPortalBoundarySouth(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450">Batas Barat</label>
                  <input
                    type="text"
                    value={portalBoundaryWest}
                    onChange={(e) => setPortalBoundaryWest(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-805 focus:outline-none focus:border-[#85A389]"
                    required
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1E4D6B] to-[#85A389] hover:opacity-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4 text-white" />
          <span>Simpan Pengaturan Portal</span>
        </button>
      </div>
    </form>
  );
};
