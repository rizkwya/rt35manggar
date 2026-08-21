import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  MessageSquare, 
  Shield, 
  X, 
  User, 
  Calendar, 
  FileText, 
  Sparkles, 
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';
import { RTSettings, RTMessage } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

interface ContactLocationSectionProps {
  settings?: RTSettings;
  onSettingsUpdate?: (settings: RTSettings) => void;
  defaultFormTab?: 'aspirasi' | 'wajib_lapor';
  onClearDefaultFormTab?: () => void;
}

export const ContactLocationSection: React.FC<ContactLocationSectionProps> = ({ 
  settings,
  onSettingsUpdate,
  defaultFormTab,
  onClearDefaultFormTab
}) => {
  const [activeFormTab, setActiveFormTab] = useState<'aspirasi' | 'wajib_lapor'>('aspirasi');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmittedType, setLastSubmittedType] = useState<'aspirasi' | 'wajib_lapor'>('aspirasi');
  const [submittedDataSummary, setSubmittedDataSummary] = useState<{
    name: string;
    phone?: string;
    detail?: string;
  } | null>(null);

  // Field errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (defaultFormTab) {
      setActiveFormTab(defaultFormTab);
      if (onClearDefaultFormTab) {
        onClearDefaultFormTab();
      }
    } else if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'wajib_lapor') {
        setActiveFormTab('wajib_lapor');
        const url = new URL(window.location.href);
        url.searchParams.delete('tab');
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    }
  }, [defaultFormTab, onClearDefaultFormTab]);

  // Lock background scroll when success modal is open
  React.useEffect(() => {
    if (showSuccessModal) {
      const originalOverflow = document.body.style.overflow;
      const originalTouch = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouch;
      };
    }
  }, [showSuccessModal]);
  
  // Shared Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Aspirasi fields
  const [message, setMessage] = useState('');
  
  // Wajib Lapor fields
  const [guestNik, setGuestNik] = useState('');
  const [relation, setRelation] = useState('');
  const [hostName, setHostName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');

  // Validate form inputs
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Nomor HP/WA wajib diisi';
    } else if (phone.length < 9 || phone.length > 15) {
      newErrors.phone = 'Nomor HP/WA harus antara 9 - 15 digit angka';
    }

    if (activeFormTab === 'aspirasi') {
      if (!message.trim()) {
        newErrors.message = 'Isi pesan/aspirasi wajib diisi';
      } else if (message.trim().length < 5) {
        newErrors.message = 'Isi aspirasi minimal 5 karakter';
      }
    } else {
      // Wajib Lapor fields validation
      if (!guestNik.trim()) {
        newErrors.guestNik = 'NIK tamu wajib diisi';
      } else if (guestNik.length !== 16) {
        newErrors.guestNik = `NIK harus tepat 16 digit angka (saat ini ${guestNik.length} digit)`;
      }

      if (!relation.trim()) {
        newErrors.relation = 'Hubungan dengan tuan rumah wajib diisi';
      }

      if (!hostName.trim()) {
        newErrors.hostName = 'Nama/alamat tuan rumah wajib diisi';
      }

      if (!startDate) {
        newErrors.startDate = 'Tanggal mulai menginap wajib dipilih';
      }

      if (!duration.trim()) {
        newErrors.duration = 'Durasi menginap wajib diisi';
      } else if (parseInt(duration, 10) < 1) {
        newErrors.duration = 'Durasi minimal 1 hari';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // 1. Fetch latest settings to avoid overwriting newer data
      const latestSettings = await SupabaseService.fetchSettings();
      const currentMessages = latestSettings.messages_list || [];

      // 2. Build the new message / guest report payload
      const newMessage: RTMessage = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        type: activeFormTab,
        name: name.trim(),
        phone: phone.trim() || undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...(activeFormTab === 'aspirasi' ? {
          message: message.trim()
        } : {
          guestNik: guestNik.trim(),
          relation: relation.trim(),
          hostName: hostName.trim(),
          startDate: startDate,
          duration: duration.trim()
        })
      };

      // 3. Update settings record in Supabase
      const updatedSettings: RTSettings = {
        ...latestSettings,
        messages_list: [newMessage, ...currentMessages]
      };

      const savedSettings = await SupabaseService.updateSettings(updatedSettings);
      
      // 4. Update parent state if available
      if (onSettingsUpdate) {
        onSettingsUpdate(savedSettings);
      }

      // Record summary for modal popup
      setLastSubmittedType(activeFormTab);
      setSubmittedDataSummary({
        name: name.trim(),
        phone: phone.trim(),
        detail: activeFormTab === 'aspirasi' ? message.trim() : `Tamu: ${name.trim()} (NIK: ${guestNik}) di rumah ${hostName}`
      });

      // Show Popup Modal
      setShowSuccessModal(true);
      
      // Reset form fields
      setName('');
      setPhone('');
      setMessage('');
      setGuestNik('');
      setRelation('');
      setHostName('');
      setStartDate('');
      setDuration('');
      setErrors({});

    } catch (err: any) {
      console.error('Error submitting message/report:', err);
      alert('Gagal mengirim laporan: ' + (err.message || 'Terjadi kesalahan sistem'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontak-layanan" className="py-20 sm:py-24 bg-white relative border-t border-slate-200/60 scroll-mt-16 bg-grid-dots">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-xs font-black uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#0b5665]" />
            <span>Lokasi & Pelayanan Mandiri</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">
            Pusat Sekretariat & <span className="text-[#0b5665]">Aspirasi & Lapor Tamu RT 35</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-bold">
            Temukan lokasi balai pelayanan RT 35, nomor kontak darurat, serta lakukan kewajiban wajib lapor tamu 24 jam atau kirim aspirasi warga secara online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT: LOCATION DETAILS & EMERGENCY CONTACTS */}
          <div className="space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#0b5665]" />
                <span>Alamat & Jam Pelayanan</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-650">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-[#0b5665]/5 text-[#0b5665] shrink-0 mt-0.5 border border-slate-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-black">Balai RT 35 Manggar:</strong>
                    <div className="space-y-0.5 mt-0.5 leading-relaxed text-slate-500 text-xs font-bold">
                      {(settings?.address_detail || 'Kawasan Pesisir RT 35, Kelurahan Manggar, Kecamatan Balikpapan Timur, Kota Balikpapan, Kalimantan Timur (76116).')
                        .split('\n')
                        .map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-[#0b5665]/5 text-[#0b5665] shrink-0 mt-0.5 border border-slate-200">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-black">Jam Layanan Surat Administrasi:</strong>
                    <div className="space-y-0.5 mt-0.5">
                      {(settings?.service_hours || 'Senin - Jumat: 19.30 - 21.30 WITA (Di Balai RT)')
                        .split('\n')
                        .map((line, idx) => (
                          <p key={idx} className="text-slate-500 text-xs font-bold">{line}</p>
                        ))
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-[#0b5665]/5 text-[#0b5665] shrink-0 mt-0.5 border border-slate-200">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-black">Telepon Sekretaris RT:</strong>
                    <p className="text-slate-500 text-xs font-bold mt-0.5">{settings?.phone_secretary || '0812-9876-5432 (Ibu Nurhayati, S.Pd)'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAPS EMBED */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative flex flex-col">
              <div className="h-60 sm:h-64 relative">
                <iframe
                  title="Peta Lokasi RT 35 Manggar"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings?.maps_coordinate || '1°14\'11.4"S 116°56\'04.0"E')}&z=15&output=embed`}
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Koordinat Balai RT</span>
                  <p className="text-[11px] font-black text-[#0b5665]">{settings?.maps_coordinate || '1°14\'11.4"S 116°56\'04.0"E'}</p>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings?.maps_coordinate || '1°14\'11.4"S 116°56\'04.0"E')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4.5 py-2.5 rounded-full bg-[#0b5665] hover:bg-[#08424e] text-white text-xs font-black transition-all shadow-sm flex items-center justify-center space-x-1.5 active:scale-98"
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span>Dapatkan Rute</span>
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT: DUAL FORM PORTAL (ASPIRASI & WAJIB LAPOR) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <div>
              {/* Form Tab Switched */}
              <div className="flex border-b border-slate-200/80 mb-6">
                <button
                  type="button"
                  onClick={() => { setActiveFormTab('aspirasi'); setErrors({}); }}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 text-center flex items-center justify-center space-x-1.5 ${
                    activeFormTab === 'aspirasi'
                      ? 'border-[#0b5665] text-[#0b5665]'
                      : 'border-transparent text-slate-400 hover:text-[#0b5665]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Aspirasi</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveFormTab('wajib_lapor'); setErrors({}); }}
                  className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 text-center flex items-center justify-center space-x-1.5 ${
                    activeFormTab === 'wajib_lapor'
                      ? 'border-[#0b5665] text-[#0b5665]'
                      : 'border-transparent text-slate-400 hover:text-[#0b5665]'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Wajib Lapor Tamu</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {activeFormTab === 'aspirasi' ? (
                  /* Form Aspirasi & Pengaduan */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Budi Santoso"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-bold ${
                          errors.name ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-[#0b5665]'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                        Nomor HP/WA (Untuk Konfirmasi) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="Contoh: 081234567890 (Hanya Angka)"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 15);
                          setPhone(val);
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-bold ${
                          errors.phone ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-[#0b5665]'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                        Aspirasi / Pengaduan Lingkungan <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Tulis saran, keluhan kebersihan/keamanan, atau masukan Anda di sini secara objektif..."
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-bold resize-none ${
                          errors.message ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-[#0b5665]'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Form Wajib Lapor Tamu 1x24 Jam */
                  <div className="space-y-4">
                    <div className="bg-[#0b5665]/5 border border-[#0b5665]/10 p-3.5 rounded-xl text-slate-600 text-[10px] font-bold flex items-start space-x-2">
                      <ShieldAlert className="w-4 h-4 text-[#0b5665] shrink-0 mt-0.5" />
                      <span>
                        Sesuai aturan keamanan lingkungan, setiap warga yang menerima tamu menginap lebih dari 24 jam wajib melaporkan data tamu kepada Ketua RT.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Nama Tamu <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nama lengkap tamu"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                          }}
                          className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-bold ${
                            errors.name ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-[#0b5665]'
                          }`}
                        />
                        {errors.name && (
                          <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.name}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            NIK / KTP Tamu <span className="text-rose-500">*</span>
                          </label>
                          <span className="text-[9px] font-mono font-bold text-slate-400">
                            {guestNik.length}/16 digit
                          </span>
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="16 Digit NIK KTP (Hanya Angka)"
                          value={guestNik}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                            setGuestNik(val);
                            if (errors.guestNik) setErrors(prev => ({ ...prev, guestNik: '' }));
                          }}
                          maxLength={16}
                          className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-mono transition-all font-bold ${
                            errors.guestNik ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-[#0b5665]'
                          }`}
                        />
                        {errors.guestNik && (
                          <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.guestNik}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Hubungan dengan Tuan Rumah <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Saudara, Teman, Rekan Kerja"
                          value={relation}
                          onChange={(e) => {
                            setRelation(e.target.value);
                            if (errors.relation) setErrors(prev => ({ ...prev, relation: '' }));
                          }}
                          className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-bold ${
                            errors.relation ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-[#0b5665]'
                          }`}
                        />
                        {errors.relation && (
                          <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.relation}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Nama & Alamat Tuan Rumah <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Bpk. Ahmad (Rumah No. 12)"
                          value={hostName}
                          onChange={(e) => {
                            setHostName(e.target.value);
                            if (errors.hostName) setErrors(prev => ({ ...prev, hostName: '' }));
                          }}
                          className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-bold ${
                            errors.hostName ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-[#0b5665]'
                          }`}
                        />
                        {errors.hostName && (
                          <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.hostName}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Tanggal Mulai Menginap <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            if (errors.startDate) setErrors(prev => ({ ...prev, startDate: '' }));
                          }}
                          className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs text-slate-800 font-bold focus:outline-none transition-all ${
                            errors.startDate ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-[#0b5665]'
                          }`}
                        />
                        {errors.startDate && (
                          <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.startDate}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          Durasi (Hari) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="90"
                          placeholder="Hari"
                          value={duration}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                            setDuration(val);
                            if (errors.duration) setErrors(prev => ({ ...prev, duration: '' }));
                          }}
                          className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-mono transition-all font-bold ${
                            errors.duration ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-[#0b5665]'
                          }`}
                        />
                        {errors.duration && (
                          <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{errors.duration}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                        No. HP Penanggung Jawab / Tamu <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="Contoh: 081234567890 (Hanya Angka)"
                        value={phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 15);
                          setPhone(val);
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl bg-white border text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-bold ${
                          errors.phone ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-[#0b5665]'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] font-bold text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-[#0b5665] hover:bg-[#08424e] disabled:bg-slate-400 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Memproses Pengiriman...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>{activeFormTab === 'aspirasi' ? 'Kirim Aspirasi Online' : 'Kirim Laporan Tamu (Wajib Lapor)'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>

      {/* POPUP MODAL: PENGIRIMAN BERHASIL (STANDARD INTERNASIONAL & RESPONSIVE) */}
      {typeof document !== 'undefined' && showSuccessModal && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setShowSuccessModal(false); }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto overscroll-contain touch-none select-none"
        >
          <div 
            className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-center relative overflow-hidden animate-scale-up touch-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-[#0b5665] to-teal-400" />
            
            {/* Close Icon Button */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              aria-label="Tutup popup"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon Emblem */}
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center shadow-inner text-emerald-600 relative">
              <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#0b5665] text-white rounded-full flex items-center justify-center text-[10px] font-black shadow">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {lastSubmittedType === 'aspirasi' ? 'Aspirasi Berhasil Dikirim!' : 'Laporan Tamu Berhasil Terkirim!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed px-2">
                {lastSubmittedType === 'aspirasi'
                  ? 'Terima kasih atas partisipasi Anda. Pesan dan aspirasi warga telah tercatat di sistem pengurus RT 35 secara real-time.'
                  : 'Laporan wajib lapor tamu menginap 1x24 jam telah diteruskan ke Sekretariat RT 35 demi ketertiban dan keamanan lingkungan.'}
              </p>
            </div>

            {/* Submission Quick Summary Card */}
            {submittedDataSummary && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nama Pengirim</span>
                  <span className="font-black text-slate-900">{submittedDataSummary.name}</span>
                </div>
                {submittedDataSummary.phone && (
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nomor Kontak</span>
                    <span className="font-mono text-slate-800">{submittedDataSummary.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-0.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Data</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    <span>Tersimpan Real-Time</span>
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-md active:scale-98"
              >
                Selesai & Tutup
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </section>
  );
};
export default ContactLocationSection;
