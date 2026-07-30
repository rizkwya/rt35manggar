import React, { useEffect, useState } from 'react';
import { Landmark, MapPin, Sparkles, ArrowLeft, Calendar, Clock, User, Phone, CheckCircle, ExternalLink, CalendarDays } from 'lucide-react';
import { RTFacility, RTSettings } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { Footer } from '../../components/Footer';

interface FacilitiesPageProps {
  onGoToLanding: () => void;
  settings: RTSettings;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ onGoToLanding, settings }) => {
  const [facilities, setFacilities] = useState<RTFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<RTFacility | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    date: '',
    purpose: ''
  });
  const [showBookingForm, setShowBookingForm] = useState(false);

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
    window.scrollTo(0, 0);
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) return;

    // Clean phone number from settings
    const secretaryPhone = settings.phone_secretary || '';
    let cleanPhone = secretaryPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    if (!cleanPhone) {
      cleanPhone = '6281234567890'; // Fallback
    }

    const message = `Halo Sekretaris RT 35,\n\nSaya ingin mengajukan permohonan penggunaan fasilitas:\n- *Fasilitas*: ${selectedFacility.name}\n- *Nama Pemohon*: ${bookingForm.name}\n- *No. WA*: ${bookingForm.phone}\n- *Tanggal*: ${bookingForm.date}\n- *Keperluan*: ${bookingForm.purpose}\n\nMohon konfirmasi ketersediaan jadwal. Terima kasih.`;
    
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    
    // Reset booking state
    setBookingForm({ name: '', phone: '', date: '', purpose: '' });
    setShowBookingForm(false);
    setSelectedFacility(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-28 pb-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button 
            onClick={onGoToLanding}
            className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors font-extrabold text-xs group w-fit"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Beranda Utama</span>
          </button>
        </div>

        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="badge-premium-sage mx-auto w-fit">
            <Landmark className="w-4 h-4 text-slate-700" />
            <span>Sarana & Prasarana Wilayah</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Daftar Fasilitas Umum <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e293b] via-[#475569] to-[#94a3b8]">RT 35 Manggar 2</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-semibold">
            Infrastruktur penunjang kegiatan sosial, keamanan, dan sarana olahraga terbuka yang dikelola bersama oleh warga RT 35 Kelurahan Manggar 2, Balikpapan Timur.
          </p>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="py-24 text-center text-xs font-bold text-slate-400">
            Memuat data sarana prasarana RT...
          </div>
        ) : facilities.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-bold">Belum ada sarana prasarana yang didaftarkan oleh pengurus RT.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((f) => (
              <div
                key={f.id}
                onClick={() => {
                  setSelectedFacility(f);
                  setShowBookingForm(false);
                }}
                className="premium-card overflow-hidden flex flex-col justify-between group cursor-pointer hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Cover Image */}
                  {f.image_url ? (
                    <div className="h-52 w-full overflow-hidden relative bg-slate-50">
                      <img 
                        src={f.image_url} 
                        alt={f.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-52 w-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center relative border-b border-slate-100">
                      <Landmark className="w-10 h-10 text-slate-400 opacity-40 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <span className="inline-block text-[9px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      Fasilitas Umum
                    </span>

                    <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-slate-800 transition-colors">
                      {f.name}
                    </h3>

                    <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
                      {f.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                {f.location && (
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-700 font-extrabold border-t border-slate-100 pt-4 pb-5 px-6">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Lokasi: {f.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL & BOOKING MODAL */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">
            
            {/* Modal Header Image */}
            <div className="relative h-48 sm:h-64 w-full bg-slate-100">
              {selectedFacility.image_url ? (
                <img 
                  src={selectedFacility.image_url} 
                  alt={selectedFacility.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center">
                  <Landmark className="w-12 h-12 text-slate-400 opacity-40" />
                </div>
              )}
              <button 
                onClick={() => setSelectedFacility(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              {!showBookingForm ? (
                // VIEW FACILITY DETAILS
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="inline-block text-[9px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                      Detail Sarana RT 35
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {selectedFacility.name}
                    </h2>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-semibold">
                    {selectedFacility.description}
                  </p>

                  <div className="flex items-center space-x-2 text-xs text-slate-700 font-extrabold bg-slate-50 border border-slate-100 p-4.5 rounded-2xl">
                    <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Lokasi Fisik</p>
                      <p className="mt-0.5">{selectedFacility.location || 'Wilayah RT 35 Kelurahan Manggar 2'}</p>
                    </div>
                  </div>

                  {/* Mock Map pin widget */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Peta & Akses Proksimitas</span>
                      <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-500" /> Terverifikasi GPS RT 35
                      </span>
                    </div>
                    <div className="h-28 bg-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                      {/* Stylized background representing a map */}
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] bg-slate-800" />
                      <div className="absolute w-2 h-2 bg-slate-800/10 rounded-full scale-150 animate-ping" />
                      <div className="absolute w-3 h-3 bg-[#475569] border-2 border-white rounded-full shadow-md" />
                      <div className="absolute bottom-2 left-2 text-[8px] font-bold bg-white/80 backdrop-blur-md px-2 py-0.5 rounded text-slate-600 border border-slate-100">
                        Latitude: {settings.maps_coordinate || '-1.2505, 116.8992'}
                      </div>
                    </div>
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-sm flex items-center justify-center space-x-2"
                    >
                      <CalendarDays className="w-4 h-4" />
                      <span>Ajukan Penggunaan (Reservasi)</span>
                    </button>
                    <button
                      onClick={() => setSelectedFacility(null)}
                      className="py-3 px-5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-colors"
                    >
                      Kembali
                    </button>
                  </div>
                </div>
              ) : (
                // RESERVATION BOOKING FORM
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900">Form Penggunaan Fasilitas</h3>
                    <p className="text-xs text-slate-500">Ajukan permohonan peminjaman ke Sekretaris RT 35</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1.5">Nama Lengkap Pemohon</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                          placeholder="Contoh: Budi Santoso"
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1.5">No. WhatsApp Aktif</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          placeholder="Contoh: 08123456789"
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1.5">Rencana Tanggal Penggunaan</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="date"
                          required
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1.5">Tujuan & Keperluan Acara</label>
                      <textarea
                        required
                        rows={3}
                        value={bookingForm.purpose}
                        onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                        placeholder="Tuliskan detail keperluan penggunaan fasilitas..."
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 outline-none resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-sm flex items-center justify-center space-x-2"
                    >
                      <span>Kirim ke WhatsApp Pengurus</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="py-3 px-5 rounded-xl border border-slate-200 text-slate-600 font-extrabold text-xs hover:bg-slate-50 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
