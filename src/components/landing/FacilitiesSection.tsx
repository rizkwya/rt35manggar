import React, { useEffect, useState } from 'react';
import { Landmark, MapPin, Sparkles } from 'lucide-react';
import { RTFacility } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

export const FacilitiesSection: React.FC = () => {
  const [facilities, setFacilities] = useState<RTFacility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFacilities = async () => {
      setLoading(true);
      try {
        const data = await SupabaseService.fetchFacilities();
        setFacilities(data);
      } catch (err) {
        console.error('Failed to load facilities list:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFacilities();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-bold text-slate-400">
        Memuat data sarana prasarana RT...
      </div>
    );
  }

  return (
    <section id="fasilitas-umum" className="py-24 bg-[#FAF9F6] relative border-t border-slate-100 scroll-mt-16 bg-grid-dots">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10 animate-fade-in">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="badge-premium-sage">
            <Landmark className="w-4 h-4 text-slate-700" />
            <span>Sarana & Prasarana Wilayah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Fasilitas Umum <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e293b] via-[#475569] to-[#94a3b8]">RT 35 Manggar 2</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-semibold">
            Infrastruktur penunjang kegiatan warga, pos keamanan, serta ruang sosial terbuka yang dikelola bersama.
          </p>
        </div>

        {/* FACILITIES GRID */}
        {facilities.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-bold">Belum ada sarana prasarana yang didaftarkan oleh pengurus RT.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((f) => (
            <div
              key={f.id}
              className="premium-card overflow-hidden flex flex-col justify-between group"
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
                  <div className="h-52 w-full bg-gradient-to-tr from-[#1E4D6B]/5 via-[#85A389]/10 to-[#E5D3B3]/5 flex items-center justify-center relative border-b border-slate-100">
                    <Landmark className="w-10 h-10 text-[#85A389] opacity-40 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  <span className="inline-block text-[9px] font-black uppercase tracking-wider text-[#85A389] bg-[#85A389]/10 px-2.5 py-0.5 rounded-md">
                    Fasilitas Umum
                  </span>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-[#1E4D6B] transition-colors">
                    {f.name}
                  </h3>

                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              {f.location && (
                <div className="flex items-center space-x-1.5 text-[10px] text-[#5F8D4E] font-extrabold border-t border-slate-100 pt-4 pb-5 px-6">
                  <MapPin className="w-4 h-4 text-[#85A389]" />
                  <span>Lokasi: {f.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        )}

      </div>
    </section>
  );
};
