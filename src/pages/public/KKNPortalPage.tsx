import React from 'react';
import { CheckCircle2, GraduationCap, Clock, Award, ArrowLeft, Anchor, Compass } from 'lucide-react';
import { ProkerItem, TeamMember } from '../../types/database';

interface KKNPortalPageProps {
  prokerList: ProkerItem[];
  kknTeam: TeamMember[];
  onBackToHome: () => void;
}

export const KKNPortalPage: React.FC<KKNPortalPageProps> = ({ prokerList, kknTeam, onBackToHome }) => {

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#0b5665] selection:text-white">
      
      {/* 1. HERO BANNER WITH SYMMETRICAL 2x2 GRID (BANNER STYLE) */}
      <section 
        className="relative min-h-[650px] flex items-end justify-between pt-36 pb-20 overflow-hidden text-white bg-[#0b5665]"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(11, 86, 101, 0.72) 0%, rgba(6, 48, 57, 0.85) 100%), url("/hero_sawah.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll'
        }}
      >
        {/* Glowing auras */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

        {/* Outer container of the banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex-grow flex flex-col justify-center items-center">
          
          {/* LEFT SIDE MEMBERS (4 students in 2x2 Grid) - Desktop Only */}
          <div className="hidden xl:block absolute bottom-[-50px] left-[-40px] h-[560px] w-[500px] z-10 select-none pointer-events-none">
            {/* Back Row */}
            <img src="/kkn_member_1.png" className="absolute bottom-[130px] left-[20px] h-[370px] z-10 opacity-75 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <img src="/kkn_member_2.png" className="absolute bottom-[130px] left-[180px] h-[370px] z-10 opacity-75 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            
            {/* Front Row */}
            <img src="/kkn_member_3.png" className="absolute bottom-0 left-[-30px] h-[480px] z-30 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" />
            <img src="/kkn_member_4.png" className="absolute bottom-0 left-[140px] h-[480px] z-30 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" />
          </div>

          {/* LEFT SIDE FALLBACK (2 students) - Tablet/Medium Screens */}
          <div className="hidden md:block xl:hidden absolute bottom-[-40px] left-[-30px] h-[480px] w-[260px] z-10 select-none pointer-events-none">
            <img src="/kkn_member_1.png" className="absolute bottom-0 left-0 h-[380px] z-10 opacity-80 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <img src="/kkn_member_3.png" className="absolute bottom-0 left-[80px] h-[440px] z-20 filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)]" />
          </div>

          {/* CENTERED TEXT & ACTION CONTROLS */}
          <div className="max-w-2xl mx-auto text-center space-y-8 relative z-30 pt-10">
            
            {/* OFFICIAL BADGE */}
            <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in">
              <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Portal Pengabdian KKN Universitas Mulia</span>
              </div>
            </div>

            {/* HERO TITLE */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-sm">
              KKN Kelompok 7 <br />
              <span className="text-amber-400">Universitas Mulia</span>
            </h1>

            {/* SUBTITLE */}
            <p className="text-white/85 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed font-bold drop-shadow-sm">
              Sistem Informasi Portal RT 35 Manggar ini dirancang, dibangun, dan dihibahkan oleh mahasiswa Kuliah Kerja Nyata (KKN) Kelompok 7 Universitas Mulia Balikpapan sebagai program kerja utama digitalisasi pelayanan administrasi kependudukan.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onBackToHome}
                className="py-3 px-6 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-black transition-all border border-white/20 flex items-center space-x-2 active:scale-98"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </button>
              <button
                onClick={() => scrollToSection('proker-kkn')}
                className="py-3 px-6 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all flex items-center space-x-2 active:scale-98 shadow-md shadow-amber-500/10"
              >
                <span>Lihat Program Kerja</span>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE MEMBERS (4 students in 2x2 Grid) - Desktop Only */}
          <div className="hidden xl:block absolute bottom-[-50px] right-[-40px] h-[560px] w-[500px] z-10 select-none pointer-events-none">
            {/* Back Row */}
            <img src="/kkn_member_5.png" className="absolute bottom-[130px] right-[180px] h-[370px] z-10 opacity-75 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <img src="/kkn_member_6.png" className="absolute bottom-[130px] right-[20px] h-[370px] z-10 opacity-75 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            
            {/* Front Row */}
            <img src="/kkn_member_7.png" className="absolute bottom-0 right-[140px] h-[480px] z-30 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" />
            <img src="/kkn_member_8.png" className="absolute bottom-0 right-[-30px] h-[480px] z-30 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" />
          </div>

          {/* RIGHT SIDE FALLBACK (2 students) - Tablet/Medium Screens */}
          <div className="hidden md:block xl:hidden absolute bottom-[-40px] right-[-30px] h-[480px] w-[260px] z-10 select-none pointer-events-none">
            <img src="/kkn_member_6.png" className="absolute bottom-0 right-[80px] h-[380px] z-20 opacity-80 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" />
            <img src="/kkn_member_8.png" className="absolute bottom-0 right-0 h-[440px] z-40 filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)]" />
          </div>
        </div>

        {/* Dynamic wave SVG transition */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] sm:h-[45px]">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-slate-50"></path>
          </svg>
        </div>
      </section>

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
        <div id="proker-kkn" className="space-y-8 scroll-mt-20">
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
