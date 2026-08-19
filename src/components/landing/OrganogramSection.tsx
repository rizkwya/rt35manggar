import React, { useRef, useState, useEffect } from 'react';
import { UserCheck, HeartHandshake, PhoneCall, ShieldCheck } from 'lucide-react';
import { RTPengurus } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

interface OrganogramSectionProps {
  pengurusList: RTPengurus[];
}

export const OrganogramSection: React.FC<OrganogramSectionProps> = ({ pengurusList: initialPengurusList }) => {
  const [pengurusList, setPengurusList] = useState<RTPengurus[]>(initialPengurusList || []);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadLivePengurus = async () => {
      try {
        const liveData = await SupabaseService.fetchPengurus();
        if (liveData && liveData.length > 0) {
          setPengurusList(liveData);
        }
      } catch (err) {
        console.warn('Failed to fetch live pengurus list:', err);
      }
    };
    loadLivePengurus();
  }, []);

  if (pengurusList.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const scrollAmount = 320; // width of card + gap
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="pengurus-rt" className="pt-24 pb-8 bg-white relative border-t border-slate-200/60 scroll-mt-16 overflow-hidden w-full">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 animate-fade-in">
        
        {/* HEADER & SLIDE BUTTONS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-xs font-black uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-[#0b5665]" />
              <span>Struktur Pemerintahan Lingkungan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Jajaran Pengurus <span className="text-[#0b5665]">RT 35 Manggar</span>
            </h2>
            <p className="text-slate-500 max-w-xl text-xs sm:text-sm leading-relaxed font-bold">
              Aparatur RT 35 Kelurahan Manggar yang berdedikasi melayani administrasi kependudukan dan kerukunan warga pesisir.
            </p>
          </div>

        </div>

        {/* ORGANOGRAM HORIZONTAL CAROUSEL */}
        {pengurusList.length > 0 ? (
          <div className="relative w-full overflow-hidden">
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-6 pt-2 px-1 snap-x snap-mandatory scroll-smooth scrollbar-none"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {pengurusList.map((p) => (
                <div
                  key={p.id}
                  className="w-[280px] sm:w-[300px] shrink-0 p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm hover:border-[#0b5665]/40 transition-all duration-300 flex flex-col justify-between space-y-4 group snap-center"
                >
                  <div className="space-y-4 text-center">
                    <div className="relative inline-block mx-auto">
                      <img
                        src={p.foto_url || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23CBD5E1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'}
                        alt={p.nama}
                        className="w-24 h-24 rounded-2xl object-cover border border-slate-200 group-hover:border-[#0b5665] transition-all duration-300 mx-auto shadow-sm bg-slate-100"
                      />
                      <span className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-[#0b5665] text-white shadow">
                        <ShieldCheck className="w-4.5 h-4.5" />
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-[#0b5665] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20">
                        {p.jabatan}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 mt-3.5 tracking-tight">{p.nama}</h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center justify-center space-x-1.5 font-bold">
                        <PhoneCall className="w-3.5 h-3.5 text-[#0b5665] inline" />
                        <span>{p.phone}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/62${p.phone.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-[#0b5665] text-slate-700 hover:text-white font-bold text-xs text-center transition-all flex items-center justify-center space-x-1.5 border border-slate-200 hover:border-transparent shadow-sm"
                  >
                    <HeartHandshake className="w-4 h-4 text-[#0b5665] group-hover:text-white" />
                    <span>Hubungi via WA</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-10 text-center rounded-3xl border-2 border-dashed border-slate-250 bg-slate-50 max-w-lg mx-auto">
            <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-extrabold text-slate-700">Belum ada data aparatur RT</p>
            <p className="text-xs text-slate-450 mt-1 font-semibold leading-relaxed">Struktur organisasi kepengurusan RT sedang diperbarui oleh Sekretaris.</p>
          </div>
        )}

      </div>
    </section>
  );
};
export default OrganogramSection;
