import React from 'react';
import { UserRole } from '../../types/database';
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Code2, 
  FileText, 
  MapPin, 
  Sparkles, 
  Users,
  Waves,
  Sun,
  LogIn
} from 'lucide-react';

interface HeroSectionProps {
  currentRole: UserRole;
  onOpenPresensi: () => void;
  onOpenDashboard: () => void;
  onOpenAuth: () => void;
  newsCount: number;
  prokerCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentRole,
  onOpenPresensi,
  onOpenDashboard,
  onOpenAuth,
  newsCount,
  prokerCount
}) => {
  const handleScrollToNews = () => {
    const element = document.getElementById('berita');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="beranda" className="relative pt-10 pb-20 overflow-hidden bg-gradient-to-b from-[#DDF0FA] via-[#E8F5FC] to-[#EBF5FA]">
      
      {/* CORNER PALM VECTOR DECORATION */}
      <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none opacity-25 sm:opacity-35">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C60 40 100 110 80 200C120 120 180 60 200 0H0Z" fill="#80C290"/>
          <path d="M0 40C40 70 80 120 60 180C100 110 150 70 180 20H0Z" fill="#4F9460"/>
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-25 sm:opacity-35 scale-x-[-1]">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C60 40 100 110 80 200C120 120 180 60 200 0H0Z" fill="#80C290"/>
          <path d="M0 40C40 70 80 120 60 180C100 110 150 70 180 20H0Z" fill="#4F9460"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* TOP PILL BADGES WITH HIGH CONTRAST */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="px-3.5 py-1 rounded-full bg-[#4F9460] text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>• LIVE REPORT</span>
          </div>

          <div className="px-3.5 py-1 rounded-full bg-[#FBEED2] border border-amber-300 text-amber-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-800" />
            <span>RT 35 Kelurahan Manggar 2, Balikpapan Timur</span>
          </div>

          <div className="px-3.5 py-1 rounded-full bg-[#DDF0FA] border border-blue-200 text-[#1C597E] font-extrabold text-xs shadow-sm">
            <span>DAY 01 • KKN 2026</span>
          </div>
        </div>

        {/* MAIN HEADLINE */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-slate-900 tracking-tight leading-[1.15] max-w-5xl mx-auto mb-6">
          KKN RT 35 KELURAHAN <br />
          MANGGAR 2 <br />
          <span className="gradient-text-ocean">BALIKPAPAN TIMUR</span>
        </h1>

        {/* SUBHEADLINE */}
        <p className="text-base sm:text-lg text-slate-800 max-w-3xl mx-auto leading-relaxed mb-8 font-semibold">
          Portal pengabdian kelompok KKN (8 Mahasiswa Lintas Prodi). Wadah <strong className="text-[#1C597E] font-black">Live Report Berita</strong> kegiatan harian warga RT 35, pemberdayaan UMKM, serta sistem <strong className="text-[#3F774F] font-black">presensi digital</strong> kelompok.
        </p>

        {/* COMMUNITY & BEACH INFINITY BADGE */}
        <div className="max-w-md mx-auto mb-8 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2 text-[#236F9E] font-extrabold text-xs">
            <Waves className="w-4 h-4 text-[#236F9E]" />
            <span>Wilayah RT 35</span>
          </div>
          <span className="text-slate-300 font-bold">•</span>
          <div className="flex items-center space-x-2 text-[#4F9460] font-extrabold text-xs">
            <Users className="w-4 h-4 text-[#4F9460]" />
            <span>Masyarakat RT 35</span>
          </div>
          <span className="text-slate-300 font-bold">•</span>
          <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-xs">
            <Sun className="w-4 h-4 text-amber-600" />
            <span>KKN 2026</span>
          </div>
        </div>

        {/* ACTION BUTTONS: CLEAN BUTTONS WITHOUT MUTATING URL HASH! */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
          
          <button
            onClick={handleScrollToNews}
            className="px-6 py-3.5 rounded-xl bg-[#236F9E] hover:bg-[#1C597E] text-white font-extrabold text-sm shadow-md flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <FileText className="w-4 h-4 text-white" />
            <span className="text-white">Lihat Live Report Berita</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          {currentRole !== 'public' && (
            <>
              <button
                onClick={onOpenPresensi}
                className="px-6 py-3.5 rounded-xl bg-[#4F9460] hover:bg-[#3F774F] text-white font-extrabold text-sm shadow-md flex items-center space-x-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span className="text-white">Input Presensi & Logbook</span>
              </button>

              {currentRole === 'developer' && (
                <button
                  onClick={onOpenDashboard}
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-md flex items-center space-x-2 transition-all"
                >
                  <Code2 className="w-4 h-4 text-slate-950" />
                  <span className="text-slate-950 font-black">Control Panel CMS</span>
                </button>
              )}
            </>
          )}

        </div>

        {/* STATS CARDS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-left border-l-4 border-l-[#236F9E]">
            <div className="flex items-center space-x-3 mb-1">
              <div className="p-2 rounded-xl bg-[#DDF0FA] text-[#236F9E] font-bold">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl font-display font-black text-slate-900">8</span>
            </div>
            <p className="text-xs text-slate-800 font-extrabold">Anggota Kelompok KKN</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-left border-l-4 border-l-[#4F9460]">
            <div className="flex items-center space-x-3 mb-1">
              <div className="p-2 rounded-xl bg-emerald-100 text-[#4F9460] font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-2xl font-display font-black text-slate-900">{prokerCount}</span>
            </div>
            <p className="text-xs text-slate-800 font-extrabold">Program Kerja Utama</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-left border-l-4 border-l-amber-500">
            <div className="flex items-center space-x-3 mb-1">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-2xl font-display font-black text-slate-900">{newsCount}</span>
            </div>
            <p className="text-xs text-slate-800 font-extrabold">Live Report Tayang</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-left border-l-4 border-l-teal-600">
            <div className="flex items-center space-x-3 mb-1">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-800 font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-2xl font-display font-black text-slate-900">35</span>
            </div>
            <p className="text-xs text-slate-800 font-extrabold">Hari Pengabdian KKN</p>
          </div>

        </div>

      </div>

      {/* BOTTOM WAVE DECORATION */}
      <div className="w-full mt-12 overflow-hidden leading-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 text-white fill-current">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,130.83,121.61,192,112.34,236.08,105.67,279.7,85.23,321.39,56.44Z"></path>
        </svg>
      </div>

    </section>
  );
};
