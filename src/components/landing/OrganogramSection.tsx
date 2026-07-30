import React, { useEffect, useState } from 'react';
import { UserCheck, HeartHandshake, PhoneCall, ShieldCheck } from 'lucide-react';
import { RTPengurus } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

export const OrganogramSection: React.FC = () => {
  const [pengurusList, setPengurusList] = useState<RTPengurus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPengurus = async () => {
      setLoading(true);
      try {
        const data = await SupabaseService.fetchPengurus();
        setPengurusList(data);
      } catch (err) {
        console.error('Failed to load pengurus list:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPengurus();
  }, []);

  if (loading) return null;

  return (
    <section id="pengurus-rt" className="py-20 bg-white relative border-t border-slate-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#85A389]/10 border border-[#85A389]/30 text-[#5F8D4E] text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-[#85A389]" />
            <span>Struktur Pemerintahan Lingkungan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Jajaran Pengurus <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E4D6B] via-[#85A389] to-[#bca481]">RT 35 Manggar 2</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
            Aparatur RT 35 Kelurahan Manggar 2 yang berdedikasi melayani administrasi kependudukan dan kerukunan warga pesisir.
          </p>
        </div>

        {/* ORGANOGRAM GRID */}
        {pengurusList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pengurusList.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-3xl bg-[#F8FAFC] border border-slate-200 shadow-sm hover:border-[#85A389]/40 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4 text-center">
                  <div className="relative inline-block mx-auto">
                    <img
                      src={p.foto_url || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23CBD5E1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'}
                      alt={p.nama}
                      className="w-24 h-24 rounded-2xl object-cover border border-slate-200 group-hover:border-[#85A389] transition-all duration-300 mx-auto shadow-sm bg-slate-100"
                    />
                    <span className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-[#85A389] text-white shadow">
                      <ShieldCheck className="w-4.5 h-4.5" />
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-[#85A389] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#85A389]/10 border border-[#85A389]/20">
                      {p.jabatan}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-800 mt-3.5 tracking-tight">{p.nama}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center justify-center space-x-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-[#85A389] inline" />
                      <span>{p.phone}</span>
                    </p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/62${p.phone.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-[#85A389] text-slate-700 hover:text-white font-bold text-xs text-center transition-all flex items-center justify-center space-x-1.5 border border-slate-200 hover:border-transparent shadow-sm"
                >
                  <HeartHandshake className="w-4 h-4 text-[#85A389] group-hover:text-white" />
                  <span>Hubungi via WA</span>
                </a>
              </div>
            ))}
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
