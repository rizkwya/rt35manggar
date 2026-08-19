import React, { useEffect, useState } from 'react';
import { Landmark, MapPin, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';
import { RTFacility, RTSettings } from '../../types/database';
import { SupabaseService, supabase } from '../../lib/supabase';
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadFacilities = async () => {
      if (!propFacilities) {
        setLoading(true);
      }
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

    // Subscribe to realtime changes for facilities
    const channel = supabase
      .channel('realtime-facilities-page')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_facilities' },
        async () => {
          const updated = await SupabaseService.fetchFacilities();
          setFacilities(updated);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propFacilities]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Lock body scroll when facility detail modal is open
  useEffect(() => {
    if (selectedFacility) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedFacility]);

  const totalPages = Math.ceil(facilities.length / itemsPerPage);
  const paginatedFacilities = facilities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-[#FAF9F6] pb-2">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10 pb-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button 
            onClick={onGoToLanding}
            className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors font-extrabold text-xs group bg-white border border-slate-200 px-4.5 py-2.5 rounded-xl shadow-sm hover:scale-[1.02] active:scale-98"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Beranda Utama</span>
          </button>
        </div>

        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-xs font-black uppercase tracking-wider mx-auto">
            <Landmark className="w-4 h-4" />
            <span>Sarana & Prasarana Wilayah</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Daftar Fasilitas Umum <span className="text-[#0b5665]">RT 35 Manggar</span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
            Infrastruktur penunjang kegiatan sosial, keamanan, dan sarana olahraga terbuka yang dikelola bersama oleh warga RT 35 Kelurahan Manggar, Balikpapan Timur.
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
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedFacilities.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFacility(f)}
                  className="bg-white border border-slate-200/70 rounded-3xl overflow-hidden flex flex-col justify-between group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Cover Image */}
                    {f.image_url ? (
                      <div className="h-52 w-full overflow-hidden relative bg-slate-50 border-b border-slate-100">
                        <img 
                          src={f.image_url} 
                          alt={f.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-52 w-full bg-slate-50 flex items-center justify-center relative border-b border-slate-100">
                        <Landmark className="w-10 h-10 text-slate-400 opacity-40 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-6 space-y-2.5">
                      <span className="inline-flex px-2.5 py-0.5 rounded-md bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-[9px] font-black uppercase tracking-wider">
                        Fasilitas Umum
                      </span>

                      <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-[#0b5665] transition-colors duration-300">
                        {f.name}
                      </h3>

                      <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-3">
                        {f.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  {f.location && (
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-700 font-extrabold border-t border-slate-100/80 pt-4 pb-5 px-6">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="truncate">Lokasi: {f.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6 pb-2 md:pb-4">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[36px]"
                  aria-label="Previous page"
                >
                  &larr;
                </button>

                {/* Desktop Numeric Pagination */}
                <div className="hidden sm:flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setCurrentPage(p);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all active:scale-95 border ${
                        currentPage === p
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Mobile Text Pagination Indicator */}
                <span className="sm:hidden text-xs font-bold text-slate-500 px-3">
                  Hal {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[36px]"
                  aria-label="Next page"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAIL & BOOKING MODAL (Responsive side-by-side layout) */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]">
            
            {/* Left Column: Image & Live Google Map */}
            <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-slate-150 md:max-h-full md:overflow-y-auto scrollbar-thin">
              {/* Facility Cover Photo */}
              <div className="relative h-48 sm:h-60 md:h-64 w-full shrink-0 bg-slate-100">
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
              </div>
              
              {/* Google Maps Embed directly in left column */}
              {selectedFacility.latitude_longitude && (
                <div className="p-5 flex-grow bg-slate-50 border-t border-slate-100 flex flex-col justify-center">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 h-40 sm:h-44 relative shadow-sm">
                    <iframe
                      title={`Peta Lokasi ${selectedFacility.name}`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedFacility.latitude_longitude)}&z=16&output=embed`}
                      className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
                    <span>Koordinat: {selectedFacility.latitude_longitude}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Title, Description, and Details Form */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between md:max-h-full md:overflow-y-auto scrollbar-thin">
              <div className="space-y-5">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div className="space-y-1.5">
                    <span className="inline-flex px-3 py-1 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-[9px] font-black uppercase tracking-wider">
                      Detail Sarana RT 35
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                      {selectedFacility.name}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setSelectedFacility(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-950 transition-colors shrink-0"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-semibold">
                  {selectedFacility.description}
                </p>

                {/* Location Box */}
                <div className="flex items-center space-x-3 text-xs text-slate-700 font-extrabold bg-slate-50 border border-slate-150 p-4 rounded-2xl">
                  <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Lokasi Fisik</p>
                    <p className="mt-0.5 truncate">{selectedFacility.location || 'Wilayah RT 35 Kelurahan Manggar'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-3 mt-6 md:mt-0">
                {selectedFacility.latitude_longitude && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedFacility.latitude_longitude)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-grow py-3 px-4 rounded-xl bg-[#0b5665] hover:bg-[#08424e] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5 active:scale-98"
                  >
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    <span>Dapatkan Rute</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedFacility(null)}
                  className="flex-grow py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors shadow-sm text-center active:scale-98"
                >
                  Tutup Detail
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};
