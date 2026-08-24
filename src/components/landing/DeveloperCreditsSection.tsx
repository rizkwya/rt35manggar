import React from 'react';
import { GraduationCap, ArrowRight, Award, Laptop, Users } from 'lucide-react';

interface DeveloperCreditsSectionProps {
  navigateTo: (path: string) => void;
}

export const DeveloperCreditsSection: React.FC<DeveloperCreditsSectionProps> = ({ navigateTo }) => {
  return (
    <section className="py-20 bg-slate-50 relative border-t border-slate-200/60 scroll-mt-16 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* TEXT CONTENT */}
          <div className="space-y-6 max-w-2xl text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-xs font-black uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-[#0b5665]" />
              <span>Program KKN Universitas Mulia</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Sistem Informasi Dikembangkan Oleh <br />
              <span className="text-[#0b5665]">KKN Kelompok Manggar 2 Universitas Mulia</span>
            </h2>
            
            <p className="text-slate-550 text-xs sm:text-sm leading-relaxed font-bold">
              Website Portal Warga RT 35 Manggar ini dirancang, dibangun, dan dihibahkan oleh mahasiswa Kuliah Kerja Nyata (KKN) Kelompok Manggar 2 Universitas Mulia Balikpapan sebagai bakti nyata digitalisasi pelayanan administrasi kependudukan di tingkat rukun tetangga.
            </p>

            {/* QUICK FEATURE BADGES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center space-x-2 text-slate-700">
                <Laptop className="w-4.5 h-4.5 text-[#0b5665]" />
                <span className="text-xs font-black">Digitalisasi Layanan</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <Users className="w-4.5 h-4.5 text-amber-600" />
                <span className="text-xs font-black">Kolaborasi Warga</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <Award className="w-4.5 h-4.5 text-[#0b5665]" />
                <span className="text-xs font-black">Pengabdian Masyarakat</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON / CARD */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-4 max-w-sm w-full shrink-0 flex flex-col justify-center">
            <GraduationCap className="w-12 h-12 text-[#0b5665] mx-auto" />
            <div>
              <h4 className="text-sm font-black text-slate-900">Portal KKN & Program Kerja</h4>
              <p className="text-[11px] text-slate-400 mt-1 font-bold">
                Lihat daftar program kerja utama, progress pengerjaan, serta profil lengkap tim mahasiswa pelaksana.
              </p>
            </div>
            <button
              onClick={() => navigateTo('/kkn')}
              className="w-full py-3 px-4 rounded-full bg-[#0b5665] hover:bg-[#08424e] text-white text-xs font-black transition-all shadow-sm flex items-center justify-center space-x-1.5 active:scale-98"
            >
              <span>Lihat Detail Tim KKN</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
export default DeveloperCreditsSection;
