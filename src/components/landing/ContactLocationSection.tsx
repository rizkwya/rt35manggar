import React, { useState } from 'react';
import { MapPin, Phone, Send, CheckCircle, ShieldAlert, Clock, Anchor } from 'lucide-react';
import { RTSettings } from '../../types/database';

interface ContactLocationSectionProps {
  settings?: RTSettings;
}

export const ContactLocationSection: React.FC<ContactLocationSectionProps> = ({ settings }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  return (
    <section id="kontak-layanan" className="py-20 bg-[#FAF9F5] relative border-t border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#85A389]/10 border border-[#85A389]/30 text-[#5F8D4E] text-xs font-bold uppercase tracking-wider">
            <Anchor className="w-4 h-4 text-[#85A389]" />
            <span>Lokasi & Kontak Layanan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Pusat Sekretariat & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E4D6B] via-[#85A389] to-[#bca481]">Aspirasi Warga RT 35</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
            Temukan alamat balai pelayanan RT 35, nomor kontak darurat wilayah pesisir, serta kirim saran & permohonan bantuan secara online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: LOCATION DETAILS & EMERGENCY CONTACTS */}
          <div className="space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#85A389]" />
                <span>Alamat & Jam Pelayanan</span>
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-slate-50 text-[#85A389] shrink-0 mt-0.5 border border-slate-200">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-800 block font-bold">Balai RT 35 Manggar 2:</strong>
                    <div className="space-y-0.5 mt-0.5 leading-relaxed text-slate-500 text-xs">
                      {(settings?.address_detail || 'Kawasan Pesisir RT 35, Kelurahan Manggar 2, Kecamatan Balikpapan Timur, Kota Balikpapan, Kalimantan Timur (76116).')
                        .split('\n')
                        .map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-slate-50 text-[#85A389] shrink-0 mt-0.5 border border-slate-200">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-800 block font-bold">Jam Layanan Surat Administrasi:</strong>
                    <div className="space-y-0.5 mt-0.5">
                      {(settings?.service_hours || 'Senin - Jumat: 19.30 - 21.30 WITA (Di Balai RT)')
                        .split('\n')
                        .map((line, idx) => (
                          <p key={idx} className="text-slate-500 text-xs">{line}</p>
                        ))
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-slate-50 text-[#1E4D6B] shrink-0 mt-0.5 border border-slate-200">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-slate-800 block font-bold">Telepon Sekretaris RT:</strong>
                    <p className="text-slate-500 text-xs mt-0.5">{settings?.phone_secretary || '0812-9876-5432 (Ibu Nurhayati, S.Pd)'}</p>
                  </div>
                </div>
              </div>


            </div>

            {/* GOOGLE MAPS EMBED */}
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative flex flex-col">
              <div className="h-64 relative">
                <iframe
                  title="Peta Lokasi RT 35 Manggar 2"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings?.maps_coordinate || '1°14\'11.4"S 116°56\'04.0"E')}&z=15&output=embed`}
                  className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Koordinat Balai RT</span>
                  <p className="text-[11px] font-black text-slate-700">{settings?.maps_coordinate || '1°14\'11.4"S 116°56\'04.0"E'}</p>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings?.maps_coordinate || '1°14\'11.4"S 116°56\'04.0"E')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E4D6B] to-[#85A389] hover:opacity-95 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span>Dapatkan Rute</span>
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT: ASPIRASI / CITIZEN SUGGESTION FORM */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center space-x-2">
                  <Send className="w-4.5 h-4.5 text-[#85A389]" />
                  <span>Kirim Saran & Aspirasi Warga</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Sampaikan masukan, pengaduan lingkungan, atau pertanyaan ke pengurus RT</p>
              </div>

              {submitted && (
                <div className="p-4 rounded-2xl bg-[#85A389]/15 border border-[#85A389]/30 text-[#5F8D4E] flex items-center space-x-3 text-xs font-bold animate-fade-in">
                  <CheckCircle className="w-5 h-5 text-[#85A389] shrink-0" />
                  <span>Terima kasih! Aspirasi Anda telah terkirim secara online ke Sekretariat RT 35.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#85A389] focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nomor HP/WA (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#85A389] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Aspirasi / Pengaduan</label>
                  <textarea
                    rows={5}
                    placeholder="Tulis pesan atau masukan Anda tentang kebersihan, keamanan, atau layanan warga di sini..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#85A389] focus:bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1E4D6B] to-[#85A389] hover:opacity-95 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Aspirasi Online</span>
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
