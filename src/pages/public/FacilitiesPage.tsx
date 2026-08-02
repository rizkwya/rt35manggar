import React, { useEffect, useState } from 'react';
import { Landmark, MapPin, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';
import { RTFacility, RTSettings } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { Footer } from '../../components/Footer';

interface FacilitiesPageProps {
  onGoToLanding: () => void;
  settings: RTSettings;
  facilities?: RTFacility[];
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({ onGoToLanding, settings, facilities: propFacilities }) => {
  const [facilities, setFacilities] = useState<RTFacility[]>(propFacilities || []);
  const [loading, setLoading] = useState(!propFacilities);
  const [selectedFacility, setSelectedFacility] = useState<RTFacility | null>(null);

  useEffect(() => {
    if (propFacilities) {
      setFacilities(propFacilities);
      setLoading(false);
      return;
    }
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
  }, [propFacilities]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                onClick={() => setSelectedFacility(f)}
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

                  {/* Real Google Maps Embed */}
                  {selectedFacility.latitude_longitude && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative flex flex-col">
                      <div className="h-64 relative">
                        <iframe
                          title={`Peta Lokasi ${selectedFacility.name}`}
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedFacility.latitude_longitude)}&z=16&output=embed`}
                          className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-left space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Koordinat Fasilitas</span>
                          <p className="text-[11px] font-black text-slate-700">{selectedFacility.latitude_longitude}</p>
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedFacility.latitude_longitude)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1E4D6B] to-[#85A389] hover:opacity-95 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
                        >
                          <MapPin className="w-3.5 h-3.5 text-white" />
                          <span>Dapatkan Rute</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* ACTION CONTROLS */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedFacility(null)}
                      className="w-full py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-sm text-center"
                    >
                      Kembali
                    </button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
