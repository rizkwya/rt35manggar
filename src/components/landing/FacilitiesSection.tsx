import React, { useEffect, useState } from 'react';
import { Landmark, MapPin } from 'lucide-react';
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
    <section id="fasilitas-umum" className="py-24 bg-white relative border-t border-slate-200/60 scroll-mt-16 bg-grid-dots">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10 animate-fade-in">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-xs font-black uppercase tracking-wider">
            <Landmark className="w-4 h-4 text-[#0b5665]" />
            <span>Sarana & Prasarana Wilayah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Fasilitas Umum <span className="text-[#0b5665]">RT 35 Manggar</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-bold">
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
              className="premium-card overflow-hidden flex flex-col justify-between group hover:border-[#0b5665]/40"
            >
              <div>
                {/* Cover Image */}
                {f.image_url ? (
                  <div className="h-52 w-full overflow-hidden relative bg-slate-50 border-b border-slate-200">
                    <img 
                      src={f.image_url} 
                      alt={f.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-52 w-full bg-slate-100 flex items-center justify-center relative border-b border-slate-200">
                    <Landmark className="w-10 h-10 text-[#0b5665] opacity-40 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  <span className="inline-block text-[9px] font-black uppercase tracking-wider text-[#0b5665] bg-[#0b5665]/10 px-2.5 py-0.5 rounded-md">
                    Fasilitas Umum
                  </span>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-[#0b5665] transition-colors">
                    {f.name}
                  </h3>

                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              {f.location && (
                <div className="flex items-center space-x-1.5 text-[10px] text-[#0b5665] font-black border-t border-slate-250/60 pt-4 pb-5 px-6">
                  <MapPin className="w-4 h-4 text-[#0b5665]" />
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
export default FacilitiesSection;
