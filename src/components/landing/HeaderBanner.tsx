import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin, PieChart, Users, Megaphone, Home, ShieldCheck, Ship, Navigation } from 'lucide-react';
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
  currentRole,
  onOpenAuth,
  onOpenDashboard,
  onOpenPresensi,
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
    <section id="beranda" className="relative pt-24 pb-28 overflow-hidden bg-[#FAF9F6] border-b border-slate-100 bg-grid-dots">
      
      {/* Soft gradient aura behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#85A389]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 animate-fade-in">
        
        {/* OFFICIAL GOVERNMENT BADGES */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="badge-premium-sage">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5F8D4E]" />
            <span>Portal Resmi Pemerintahan RT 35</span>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-white border border-slate-200/60 text-slate-800 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#1E4D6B]" />
            <span>{settings?.address || 'Kelurahan Manggar 2, Balikpapan Timur'}</span>
          </div>
        </div>

        {/* HERO TITLE */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight leading-[1.08] max-w-5xl mx-auto">
          {settings?.portal_name || 'Portal Pelayanan Digital Masyarakat RT 35 Manggar'}
        </h1>

        {/* SUBTITLE */}
        <p className="text-slate-700 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed font-bold">
          {settings?.portal_description || 'Media informasi resmi warga pesisir RT 35. Menyediakan transparansi data demografi kependudukan, pemetaan tingkat kesejahteraan warga, papan pengumuman lingkungan, serta integrasi layanan aspirasi online.'}
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          
          <button
            onClick={() => scrollToSection('statistik-warga')}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm flex items-center space-x-2 transition-all hover:scale-[1.02] active:scale-98"
          >
            <PieChart className="w-4 h-4 text-white" />
            <span>Data Statistik Warga</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={() => scrollToSection('pengumuman-rt')}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs border border-slate-200 flex items-center space-x-2 transition-all shadow-sm active:scale-98"
          >
            <Megaphone className="w-4 h-4 text-[#85A389]" />
            <span>Pengumuman RT 35</span>
          </button>



        </div>

        {/* DEMOGRAPHIC METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8">
          
          <div className="premium-card p-6 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-[#E5D3B3]/10 text-[#a38b64]">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-800 leading-none">{demographics.total_kk}</span>
            </div>
            <p className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Kepala Keluarga</p>
          </div>

          <div className="premium-card p-6 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-[#85A389]/10 text-[#5F8D4E]">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-800 leading-none">{demographics.total_warga}</span>
            </div>
            <p className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Total Warga Jiwa</p>
          </div>

          <div className="premium-card p-6 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-[#1E4D6B]/10 text-[#1E4D6B]">
                <Ship className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-800 leading-none">{demographics.total_umkm}</span>
            </div>
            <p className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Pelaku UMKM RT</p>
          </div>

          <div className="premium-card p-6 text-left">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-[#85A389]/10 text-emerald-600">
                <Navigation className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-800 leading-none">{demographics.total_usia_produktif}</span>
            </div>
            <p className="text-xs text-slate-600 font-extrabold uppercase tracking-wider">Usia Produktif</p>
          </div>

        </div>

      </div>

    </section>
  );
};
export default HeaderBanner;
