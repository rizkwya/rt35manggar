import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Globe, 
  Building2, 
  MapPin, 
  Compass, 
  BookOpen, 
  ShieldAlert, 
  FileText, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Loader2,
  HelpCircle
} from 'lucide-react';
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
  const isInitialized = useRef(false);

  // 1. Branding & Identity
  const [portalName, setPortalName] = useState('');
  const [portalDesc, setPortalDesc] = useState('');

  // 2. Balai & Posko Contacts
  const [portalAddress, setPortalAddress] = useState('');
  const [portalAddressDetail, setPortalAddressDetail] = useState('');
  const [portalServiceHours, setPortalServiceHours] = useState('');
  const [portalPhoneSecretary, setPortalPhoneSecretary] = useState('');
  const [kknPoskoLocation, setKknPoskoLocation] = useState('');

  // 3. Map & Boundaries
  const [portalMapsCoordinate, setPortalMapsCoordinate] = useState('');
  const [portalBoundaryNorth, setPortalBoundaryNorth] = useState('');
  const [portalBoundarySouth, setPortalBoundarySouth] = useState('');
  const [portalBoundaryEast, setPortalBoundaryEast] = useState('');
  const [portalBoundaryWest, setPortalBoundaryWest] = useState('');

  // 4. Vision, Mission & History
  const [portalHistory, setPortalHistory] = useState('');
  const [portalVision, setPortalVision] = useState('');
  const [portalMission, setPortalMission] = useState('');

  // 5. Emergency & Services
  const [portalEmergencyTitle, setPortalEmergencyTitle] = useState('');
  const [portalEmergencyDesc, setPortalEmergencyDesc] = useState('');
  const [portalKontakDarurat, setPortalKontakDarurat] = useState('');
  const [portalSyaratSurat, setPortalSyaratSurat] = useState('');

  // Initialize form state ONLY ONCE from props or when explicitly reset (prevents auto-erasing text while typing)
  useEffect(() => {
    if (settings && !isInitialized.current) {
      isInitialized.current = true;
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
      
      // Profile RT fields
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
        portal_name: portalName.trim(),
        portal_description: portalDesc.trim(),
        address: portalAddress.trim(),
        address_detail: portalAddressDetail.trim(),
        service_hours: portalServiceHours.trim(),
        phone_secretary: portalPhoneSecretary.trim(),
        emergency_title: portalEmergencyTitle.trim(),
        emergency_description: portalEmergencyDesc.trim(),
        maps_coordinate: portalMapsCoordinate.trim(),
        syarat_surat: portalSyaratSurat.trim(),
        kontak_darurat: portalKontakDarurat.trim(),
        
        // Profile RT fields
        vision: portalVision.trim(),
        mission: portalMission.trim(),
        history: portalHistory.trim(),
        boundary_north: portalBoundaryNorth.trim(),
        boundary_south: portalBoundarySouth.trim(),
        boundary_east: portalBoundaryEast.trim(),
        boundary_west: portalBoundaryWest.trim(),
        kkn_posko_location: kknPoskoLocation.trim()
      };

      const result = await SupabaseService.updateSettings(updated);
      onUpdateSettings(result);
      showSuccess('Seluruh konfigurasi portal publik berhasil disimpan secara real-time!');
    } catch (err: any) {
      console.error('Failed saving settings:', err);
      alert('Gagal menyimpan pengaturan: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSettingsSubmit} className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER WITH REALTIME STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#0b5665]" />
            <span>Pengaturan Portal Publik & Profil RT</span>
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Konfigurasi identitas web, alamat resmi, titik peta GPS, visi misi, kontak darurat, dan syarat layanan warga.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-[#0b5665] text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer active:scale-95 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>
      </div>

      {/* 1. IDENTITAS & BRANDING PORTAL */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-150 pb-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0b5665] border border-teal-200 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              1. Identitas & Branding Portal
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Nama utama portal dan sub-deskripsi yang muncul di banner beranda web.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Nama / Judul Portal Web
            </label>
            <input
              type="text"
              required
              value={portalName}
              onChange={(e) => setPortalName(e.target.value)}
              placeholder="cth: PORTAL RT 35 KELURAHAN MANGGAR"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Deskripsi / Subtitle Utama
            </label>
            <textarea
              required
              rows={3}
              value={portalDesc}
              onChange={(e) => setPortalDesc(e.target.value)}
              placeholder="Tuliskan deskripsi ringkas tentang layanan dan profil portal RT 35..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-900 leading-relaxed focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 2. ALAMAT, POSKO & KONTAK PELAYANAN */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-150 pb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              2. Alamat Sekretariat, Posko KKN & Kontak Pelayanan
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Informasi lokasi balai RT, posko mitra KKN, nomor telepon resmi, dan jam operasional.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Nama Alamat Balai RT (Singkat)
            </label>
            <input
              type="text"
              required
              value={portalAddress}
              onChange={(e) => setPortalAddress(e.target.value)}
              placeholder="cth: Balai RT 35 Kelurahan Manggar 2, Balikpapan Timur"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Lokasi Posko KKN Kelompok 7
            </label>
            <input
              type="text"
              value={kknPoskoLocation}
              onChange={(e) => setKknPoskoLocation(e.target.value)}
              placeholder="cth: RT 35 Kel. Manggar"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-500" />
              <span>Nomor Telepon / WhatsApp Sekretaris RT</span>
            </label>
            <input
              type="text"
              required
              value={portalPhoneSecretary}
              onChange={(e) => setPortalPhoneSecretary(e.target.value)}
              placeholder="cth: 0812-9876-5432"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Alamat Lengkap Sekretariat / Balai RT
            </label>
            <textarea
              rows={2}
              required
              value={portalAddressDetail}
              onChange={(e) => setPortalAddressDetail(e.target.value)}
              placeholder="Kawasan Pesisir RT 35, Kelurahan Manggar 2, Kecamatan Balikpapan Timur, Kota Balikpapan, Kalimantan Timur (76116)."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-900 leading-relaxed focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Jam Operasional Pelayanan Administrasi (Satu Jadwal per Baris)</span>
            </label>
            <textarea
              rows={2}
              required
              value={portalServiceHours}
              onChange={(e) => setPortalServiceHours(e.target.value)}
              placeholder="Senin - Jumat: 19.30 - 21.30 WITA (Di Balai RT)&#10;Sabtu - Minggu: 24 Jam Online"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-900 leading-relaxed focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 3. PETA GPS & BATAS WILAYAH RT */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-150 pb-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              3. Titik Koordinat Peta GPS & Batas Wilayah RT 35
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Integrasi pin peta interaktif Google Maps dan keterangan batas geografis lingkungan.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                Koordinat Lokasi GPS (Decimal atau DMS)
              </label>
              <span className="text-[10px] text-slate-400 font-bold">
                Mendukung: -1.232367, 116.974441 atau 1°14'11.4"S 116°56'04.0"E
              </span>
            </div>
            <input
              type="text"
              required
              value={portalMapsCoordinate}
              onChange={(e) => setPortalMapsCoordinate(e.target.value)}
              placeholder="1°14'11.4&quot;S 116°56'04.0&quot;E"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>Batas Geografis Wilayah RT 35</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Batas Utara</span>
                <input
                  type="text"
                  value={portalBoundaryNorth}
                  onChange={(e) => setPortalBoundaryNorth(e.target.value)}
                  placeholder="cth: RT 34 Manggar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
                />
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Batas Selatan</span>
                <input
                  type="text"
                  value={portalBoundarySouth}
                  onChange={(e) => setPortalBoundarySouth(e.target.value)}
                  placeholder="cth: Pesisir Selat Makassar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
                />
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Batas Timur</span>
                <input
                  type="text"
                  value={portalBoundaryEast}
                  onChange={(e) => setPortalBoundaryEast(e.target.value)}
                  placeholder="cth: Muara Sungai Manggar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
                />
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Batas Barat</span>
                <input
                  type="text"
                  value={portalBoundaryWest}
                  onChange={(e) => setPortalBoundaryWest(e.target.value)}
                  placeholder="cth: Jalan Mulawarman"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SEJARAH, VISI & MISI RT 35 */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-150 pb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              4. Sejarah Singkat, Visi & Misi RT 35
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Teks profil kelembagaan RT 35 yang ditampilkan pada bagian Visi Misi & Profil Lingkungan.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Sejarah Singkat Pembentukan RT 35
            </label>
            <textarea
              rows={3}
              value={portalHistory}
              onChange={(e) => setPortalHistory(e.target.value)}
              placeholder="Ceritakan latar belakang sejarah berdirinya lingkungan RT 35 Manggar 2..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-900 leading-relaxed focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Visi RT 35
              </label>
              <textarea
                rows={3}
                value={portalVision}
                onChange={(e) => setPortalVision(e.target.value)}
                placeholder="cth: Terwujudnya Lingkungan RT 35 yang Bersih, Harmonis, Mandiri, dan Berbasis Digital."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-900 leading-relaxed focus:outline-none focus:border-[#0b5665] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
                Misi RT 35 (Satu Butir per Baris)
              </label>
              <textarea
                rows={3}
                value={portalMission}
                onChange={(e) => setPortalMission(e.target.value)}
                placeholder="1. Meningkatkan pelayanan administrasi warga secara digital.&#10;2. Menjaga kebersihan dan kelestarian kawasan pesisir.&#10;3. Memperkuat gotong royong dan keamanan lingkungan."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-900 leading-relaxed focus:outline-none focus:border-[#0b5665] focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. SIAGA DARURAT & SYARAT SURAT ADMINISTRASI */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-150 pb-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              5. Siaga Darurat Lingkungan & Syarat Layanan Surat
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Daftar kontak penting darurat warga dan persyaratan pengurusan surat pengantar RT.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Judul Panel Siaga Darurat
            </label>
            <input
              type="text"
              value={portalEmergencyTitle}
              onChange={(e) => setPortalEmergencyTitle(e.target.value)}
              placeholder="cth: Siaga Darurat RT 35"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Keterangan Panel Siaga Darurat
            </label>
            <input
              type="text"
              value={portalEmergencyDesc}
              onChange={(e) => setPortalEmergencyDesc(e.target.value)}
              placeholder="cth: Hubungi kontak darurat berikut jika memerlukan bantuan cepat."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Daftar Kontak Darurat (Satu Kontak per Baris)
            </label>
            <textarea
              rows={3}
              value={portalKontakDarurat}
              onChange={(e) => setPortalKontakDarurat(e.target.value)}
              placeholder="Ketua RT: 0812-3456-7890&#10;Bhabinkamtibmas: 0813-9876-5432&#10;Babinsa: 0821-1234-5678&#10;Damkar Balikpapan: 113"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-900 leading-relaxed focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3 h-3 text-slate-500" />
              <span>Syarat Pengajuan Surat RT (Satu Syarat per Baris)</span>
            </label>
            <textarea
              rows={3}
              value={portalSyaratSurat}
              onChange={(e) => setPortalSyaratSurat(e.target.value)}
              placeholder="1. Fotokopi Kartu Tanda Penduduk (KTP)&#10;2. Fotokopi Kartu Keluarga (KK)&#10;3. Bukti Lunas Iuran Sampah/Kebersihan&#10;4. Surat Pengantar Keperluan Khusus (Jika ada)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-medium text-slate-900 leading-relaxed focus:outline-none focus:border-[#0b5665] focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-[#0b5665] text-white font-black text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center space-x-2.5 disabled:opacity-60 cursor-pointer active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Menyimpan Seluruh Pengaturan...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Simpan Perubahan Pengaturan Portal</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};
export default PortalSettingsTab;
