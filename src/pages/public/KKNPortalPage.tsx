import React from 'react';
import { CheckCircle2, GraduationCap, Clock, Award, ArrowLeft, Anchor, Compass } from 'lucide-react';
import { ProkerItem, TeamMember } from '../../types/database';

interface KKNPortalPageProps {
  prokerList: ProkerItem[];
  kknTeam: TeamMember[];
  onBackToHome: () => void;
}

export const KKNPortalPage: React.FC<KKNPortalPageProps> = ({ prokerList, kknTeam, onBackToHome }) => {

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#0b5665] selection:text-white">
      
      {/* 1. HERO BANNER WITH 8-MEMBER LINEUP */}
      <div className="relative min-h-[500px] flex items-end overflow-hidden bg-slate-950 pt-32 pb-16">
        
        {/* Background Rice Field Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero_sawah.jpg" 
            alt="Sawah KKN" 
            className="w-full h-full object-cover object-center opacity-40" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-transparent z-10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          
          {/* Header Texts */}
          <div className="space-y-6 max-w-xl text-left pb-6">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-sm transition-all border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span>Kembali ke Portal RT 35</span>
            </button>

            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Portal Pengabdian Masyarakat KKN</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Kuliah Kerja Nyata (KKN) <br />
                <span className="text-amber-400">
                  Kelompok 7 Universitas Mulia
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-bold">
                Selamat datang di sub-portal pengabdian mahasiswa KKN Universitas Mulia. Halaman ini didedikasikan untuk transparansi program kerja, laporan kegiatan harian, serta informasi tim pelaksana KKN di lingkungan RT 35 Kelurahan Manggar, Balikpapan Timur.
              </p>
            </div>
          </div>

          {/* Lineup of 8 KKN Team Cutouts (Desktop) */}
          <div className="hidden lg:flex items-end justify-end relative h-[380px] w-[540px] shrink-0 self-end z-30 mr-4">
            <img src="/kkn_member_1.png" className="absolute bottom-0 right-[350px] h-[310px] z-10 hover:z-50 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none pointer-events-none" />
            <img src="/kkn_member_2.png" className="absolute bottom-0 right-[300px] h-[330px] z-20 hover:z-50 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none pointer-events-none" />
            <img src="/kkn_member_3.png" className="absolute bottom-0 right-[250px] h-[310px] z-15 hover:z-50 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none pointer-events-none" />
            <img src="/kkn_member_4.png" className="absolute bottom-0 right-[200px] h-[340px] z-30 hover:z-50 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none pointer-events-none" />
            <img src="/kkn_member_5.png" className="absolute bottom-0 right-[150px] h-[320px] z-25 hover:z-50 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none pointer-events-none" />
            <img src="/kkn_member_6.png" className="absolute bottom-0 right-[100px] h-[335px] z-35 hover:z-50 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none pointer-events-none" />
            <img src="/kkn_member_7.png" className="absolute bottom-0 right-[50px]  h-[315px] z-20 hover:z-50 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none pointer-events-none" />
            <img src="/kkn_member_8.png" className="absolute bottom-0 right-0       h-[345px] z-40 hover:z-50 hover:scale-105 transition-all duration-300 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] select-none pointer-events-none" />
          </div>

          {/* Overlapping Lineup (Tablet/Medium Screen fallback - 4 members) */}
          <div className="hidden md:flex lg:hidden items-end justify-end relative h-[380px] w-[320px] shrink-0 self-end z-30">
            <img src="/kkn_member_2.png" className="absolute bottom-0 right-[180px] h-[330px] z-10 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <img src="/kkn_member_4.png" className="absolute bottom-0 right-[120px] h-[340px] z-20 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <img src="/kkn_member_6.png" className="absolute bottom-0 right-[60px]  h-[335px] z-30 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <img src="/kkn_member_8.png" className="absolute bottom-0 right-0       h-[345px] z-40 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
          </div>
        </div>

        {/* Dynamic bottom wave curve (Gold and White transition) */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] sm:h-[45px]">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-slate-50"></path>
          </svg>
        </div>
      </div>

      {/* DETAILED INFO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* STATS HIGHLIGHT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-[#0b5665]/10 text-[#0b5665] border border-[#0b5665]/20">
              <Anchor className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Lokasi Posko</p>
              <h4 className="text-sm sm:text-base font-black text-slate-800">RT 35 Kel. Manggar</h4>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Jumlah Proker</p>
              <h4 className="text-sm sm:text-base font-black text-slate-800">4 Program Utama</h4>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-[#0b5665]/10 text-[#0b5665] border border-[#0b5665]/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Tim Pengabdi</p>
              <h4 className="text-sm sm:text-base font-black text-slate-800">8 Mahasiswa S1</h4>
            </div>
          </div>
        </div>

        {/* PROGRAM KERJA (PROKER) SECTION */}
        <div className="space-y-8">
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-850 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[#0b5665]" />
              <span>Program Kerja & Progress</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold">
              Rencana aksi digitalisasi, pemetaan kesehatan masyarakat, dan edukasi akuntansi ekonomi untuk warga RT 35.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {prokerList.map((item) => (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#0b5665]/40 shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665]">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 font-bold flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target: {item.target_date}</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-bold leading-relaxed">{item.description}</p>
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-3 pt-6 mt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-slate-500">Progress Pengerjaan:</span>
                    <span className="text-[#0b5665]">{item.progress_percent}%</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="h-full rounded-full bg-[#0b5665] transition-all duration-500"
                      style={{ width: `${item.progress_percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-bold">
                    <span>PJ Program: <strong className="text-slate-700">{item.pic_name}</strong></span>
                    <span className="flex items-center space-x-1 font-black text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.status}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TEAM MEMBER SECTION */}
        <div className="space-y-8">
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <span>Tim Mahasiswa KKN Kelompok 7</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold">
              Kolaborasi mahasiswa lintas program studi Universitas Mulia dalam program pengabdian masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {kknTeam.map((m, idx) => {
              // Map avatars cleanly to matching optimized transparent PNG files
              const cutoutSrc = `/kkn_member_${(idx % 8) + 1}.png`;
              
              return (
                <div
                  key={m.id}
                  className="p-5 rounded-3xl bg-white border border-slate-250 text-center space-y-4 hover:border-[#0b5665]/30 hover:shadow-md transition-all hover:scale-[1.03] duration-300 shadow-sm flex flex-col justify-between overflow-hidden relative group"
                >
                  {/* Subtle decorative background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0b5665]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative w-28 h-28 mx-auto mt-2 bg-slate-50 rounded-full border border-slate-200 overflow-hidden flex items-end justify-center shadow-inner">
                    <img
                      src={cutoutSrc}
                      alt={m.name}
                      className="h-[95%] w-auto object-contain select-none pointer-events-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="relative z-10 pt-2">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{m.name}</h4>
                    <p className="text-[10px] sm:text-xs font-black text-[#0b5665] mt-1">{m.role_kkn}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-0.5">{m.prodi}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
export default KKNPortalPage;
