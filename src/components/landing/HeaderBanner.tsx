import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, PieChart, Users, Megaphone, Home, Ship, Navigation } from 'lucide-react';
import { UserRole, RTSettings, RTDemographics } from '../../types/database';
import { SupabaseService, INITIAL_DEMOGRAPHICS } from '../../lib/supabase';

interface HeaderBannerProps {
  currentRole: UserRole;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onOpenPresensi: () => void;
  settings?: RTSettings;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  settings
}) => {
  const [demographics, setDemographics] = useState<RTDemographics>(INITIAL_DEMOGRAPHICS);

  useEffect(() => {
    const loadDemo = async () => {
      try {
        const demoData = await SupabaseService.fetchDemographics();
        if (demoData) setDemographics(demoData);
      } catch (err) {
        console.error('Error loading HeaderBanner demographics:', err);
      }
    };
    loadDemo();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="beranda" 
      className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-36 pb-36 overflow-hidden bg-[#0b5665] text-white"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(11, 86, 101, 0.72) 0%, rgba(6, 48, 57, 0.85) 100%), url("https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2041")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll'
      }}
    >
      {/* Dynamic particles or soft glowing auras */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 flex-grow flex flex-col justify-center items-center pt-8">

        {/* HERO TITLE */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto drop-shadow-sm">
          {settings?.portal_name || 'Portal Pelayanan Digital Masyarakat RT 35 Manggar'}
        </h1>

        {/* SUBTITLE */}
        <p className="text-white/80 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed font-bold drop-shadow-sm">
          {settings?.portal_description || 'Media informasi resmi warga pesisir RT 35. Menyediakan transparansi data demografi kependudukan, pemetaan tingkat kesejahteraan warga, papan pengumuman lingkungan, serta integrasi layanan aspirasi online.'}
        </p>

        {/* CTA BUTTONS (Simkopdes style outline and solid) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => scrollToSection('statistik-warga')}
            className="px-6 py-3.5 rounded-full bg-white hover:bg-white/95 text-[#0b5665] font-black text-xs shadow-md flex items-center space-x-2 transition-all hover:scale-[1.02] active:scale-98"
          >
            <PieChart className="w-4 h-4 text-[#0b5665]" />
            <span>Data Statistik Warga</span>
            <ArrowRight className="w-4 h-4 text-[#0b5665]" />
          </button>

          <button
            onClick={() => scrollToSection('pengumuman-rt')}
            className="px-6 py-3.5 rounded-full border border-white/50 hover:border-white hover:bg-white/10 text-white font-black text-xs flex items-center space-x-2 transition-all active:scale-98"
          >
            <Megaphone className="w-4 h-4 text-amber-450" />
            <span>Pengumuman Lingkungan</span>
          </button>
        </div>

        {/* DEMOGRAPHIC METRIC CARDS (Glassmorphism design matching Simkopdes overlay) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl mx-auto pt-10">
          
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 text-left shadow-lg hover:bg-white/12 transition-all">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-white/10 text-amber-400">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white leading-none">{demographics.total_kk}</span>
            </div>
            <p className="text-[10px] text-white/70 font-extrabold uppercase tracking-wider">Kepala Keluarga</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 text-left shadow-lg hover:bg-white/12 transition-all">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-white/10 text-amber-400">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white leading-none">{demographics.total_warga}</span>
            </div>
            <p className="text-[10px] text-white/70 font-extrabold uppercase tracking-wider">Total Warga Jiwa</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 text-left shadow-lg hover:bg-white/12 transition-all">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-white/10 text-amber-400">
                <Ship className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white leading-none">{demographics.total_umkm}</span>
            </div>
            <p className="text-[10px] text-white/70 font-extrabold uppercase tracking-wider">Pelaku UMKM RT</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 text-left shadow-lg hover:bg-white/12 transition-all">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-white/10 text-amber-400">
                <Navigation className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white leading-none">{demographics.total_usia_produktif}</span>
            </div>
            <p className="text-[10px] text-white/70 font-extrabold uppercase tracking-wider">Usia Kerja</p>
          </div>

        </div>

      </div>

      {/* 
        SIMKOPDES SIGNATURE GRAPHIC CURVES AT THE BOTTOM 
        Using layered SVG path waves of yellow-gold, teal and the background color slate-50
      */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-[60px] md:h-[90px]"
        >
          {/* Gold wave */}
          <path 
            d="M985.66,92.83C906.67,72,723.29,31,524,65.34,312.33,101.83,165.6,56.83,0,2.18V120H1200V85.34C1134,117.83,1048.66,109.33,985.66,92.83Z" 
            fill="#e5b83b" 
            opacity="0.35"
          />
          {/* Teal wave */}
          <path 
            d="M1000,80C920,60,750,20,550,55C350,90,180,45,0,0V120H1200V75C1150,95,1060,95,1000,80Z" 
            fill="#063039" 
            opacity="0.8"
          />
          {/* Main content transition wave (solid white/slate-50 matching body background) */}
          <path 
            d="M1200,90C1100,110,950,105,800,85C600,60,400,30,200,65C100,80,50,65,0,50V120H1200Z" 
            fill="#FAF9F6"
          />
        </svg>
      </div>

    </section>
  );
};

export default HeaderBanner;
