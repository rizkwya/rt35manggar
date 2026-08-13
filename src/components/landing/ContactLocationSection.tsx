import React, { useState } from 'react';
import { MapPin, Phone, Send, CheckCircle, ShieldAlert, Clock, MessageSquare, Shield } from 'lucide-react';
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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (defaultFormTab) {
      setActiveFormTab(defaultFormTab);
      if (onClearDefaultFormTab) {
        onClearDefaultFormTab();
      }
    }
  }, [defaultFormTab, onClearDefaultFormTab]);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    setLoading(true);
    try {
      // 1. Fetch latest settings to avoid overwriting newer data
      const latestSettings = await SupabaseService.fetchSettings();
      const currentMessages = latestSettings.messages_list || [];

      // 2. Build the new message / guest report payload
      const newMessage: RTMessage = {
        id: Math.random().toString(36).substring(2, 9),
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

      setSubmitted(true);
      
      // Reset form fields
      setName('');
      setPhone('');
      setMessage('');
      setGuestNik('');
      setRelation('');
      setHostName('');
      setStartDate('');
      setDuration('');

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      console.error('Error submitting message/report:', err);
      alert('Gagal mengirim laporan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontak-layanan" className="py-24 bg-white relative border-t border-slate-200/60 scroll-mt-16 bg-grid-dots">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-xs font-black uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-[#0b5665]" />
            <span>Lokasi & Pelayanan Mandiri</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Pusat Sekretariat & <span className="text-[#0b5665]">Aspirasi & Lapor Tamu RT 35</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-bold">
            Temukan lokasi balai pelayanan RT 35, nomor kontak darurat, serta lakukan kewajiban wajib lapor tamu 24 jam atau kirim aspirasi warga secara online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
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
              <div className="h-64 relative">
                <iframe
                  title="Peta Lokasi RT 35 Manggar"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings?.maps_coordinate || '1°14\'11.4"S 116°56\'04.0"E')}&z=15&output=embed`}
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Koordinat Balai RT</span>
                  <p className="text-[11px] font-black text-[#0b5665]">{settings?.maps_coordinate || '1°14\'11.4"S 116°56\'04.0"E'}</p>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings?.maps_coordinate || '1°14\'11.4"S 116°56\'04.0"E')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4.5 py-2.5 rounded-full bg-[#0b5665] hover:bg-[#08424e] text-white text-xs font-black transition-all shadow-sm flex items-center space-x-1.5 active:scale-98"
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span>Dapatkan Rute</span>
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT: DUAL FORM PORTAL (ASPIRASI & WAJIB LAPOR) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6 h-fit">
            <div>
              {/* Form Tab Switched */}
              <div className="flex border-b border-slate-200/80 mb-6">
                <button
                  type="button"
                  onClick={() => { setActiveFormTab('aspirasi'); setSubmitted(false); }}
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
                  onClick={() => { setActiveFormTab('wajib_lapor'); setSubmitted(false); }}
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

              {submitted && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-3 text-xs font-bold mb-6 animate-fade-in">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    {activeFormTab === 'aspirasi' 
                      ? 'Terima kasih! Aspirasi Anda telah berhasil terkirim secara online ke pengurus RT 35.' 
                      : 'Laporan tamu menginap berhasil dikirim. Terima kasih atas kepatuhan Anda terhadap aturan Wajib Lapor.'}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeFormTab === 'aspirasi' ? (
                  /* Form Aspirasi & Pengaduan */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                      <input
                        type="text"
                        placeholder="Contoh: Budi Santoso"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nomor HP/WA (Untuk Konfirmasi)</label>
                      <input
                        type="text"
                        placeholder="Contoh: 0812XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Aspirasi / Pengaduan Lingkungan</label>
                      <textarea
                        rows={4}
                        placeholder="Tulis saran, keluhan kebersihan/keamanan, atau masukan Anda di sini secara objektif..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] font-bold"
                        required
                      />
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
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama Tamu</label>
                        <input
                          type="text"
                          placeholder="Nama lengkap tamu"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">NIK / KTP Tamu</label>
                        <input
                          type="text"
                          placeholder="KTP Tamu (16 Digit NIK)"
                          value={guestNik}
                          onChange={(e) => setGuestNik(e.target.value.replace(/\D/g, ''))}
                          maxLength={16}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Hubungan dengan Tuan Rumah</label>
                        <input
                          type="text"
                          placeholder="Contoh: Keluarga, Teman, Rekan Kerja"
                          value={relation}
                          onChange={(e) => setRelation(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nama & Alamat Tuan Rumah</label>
                        <input
                          type="text"
                          placeholder="Contoh: Bapak Ahmad / Rumah No. 12"
                          value={hostName}
                          onChange={(e) => setHostName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tanggal Mulai Menginap</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#0b5665]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Durasi (Hari)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="Contoh: 3"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] font-bold"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">No. HP Penanggung Jawab / Tamu</label>
                      <input
                        type="text"
                        placeholder="Contoh: 0812XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] font-bold"
                        required
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-[#0b5665] hover:bg-[#08424e] disabled:bg-slate-400 text-white font-black text-xs shadow-sm transition-all flex items-center justify-center space-x-2 active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Mengirim Data...' : activeFormTab === 'aspirasi' ? 'Kirim Aspirasi Online' : 'Kirim Laporan Tamu (Wajib Lapor)'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
export default ContactLocationSection;
