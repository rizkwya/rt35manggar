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
      
      {/* 1. HERO BANNER - CLEAN FULL GROUP PHOTO ONLY (NO CUTOUT OVERLAYS) */}
      <section className="relative min-h-[640px] lg:min-h-[760px] flex flex-col justify-center items-center py-24 sm:py-32 overflow-hidden text-white bg-slate-50">
        
        {/* Absolute Background Photo - Offset by wave height at the bottom to prevent cropping */}
        <div 
          className="absolute inset-0 bottom-[30px] sm:bottom-[45px] z-10"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(11, 86, 101, 0.42) 0%, rgba(6, 48, 57, 0.65) 100%), url("/hero_sawah.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 82%',
            backgroundAttachment: 'scroll'
          }}
        />

        {/* Glowing auras */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none z-10" />

        {/* Outer container of the banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col justify-center items-center text-center">
          
          {/* CENTERED TEXT & ACTION CONTROLS */}
          <div className="max-w-3xl mx-auto text-center space-y-8">
            
            {/* HERO TITLE */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-sm">
              KKN Kelompok 7 <br />
              <span className="text-amber-400">Universitas Mulia</span>
            </h1>

            {/* SUBTITLE */}
            <p className="text-white/85 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-bold drop-shadow-sm">
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
                onClick={() => scrollToSection('tim-mahasiswa')}
                className="py-3 px-6 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all flex items-center space-x-2 active:scale-98 shadow-md shadow-amber-500/10"
              >
                <span>Lihat Profil Mahasiswa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic wave SVG transition - Placed in the offset area below the photo */}
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

        {/* 3D INTERACTIVE TEAM SHOWCASE SECTION */}
        <div id="tim-mahasiswa" className="space-y-12 scroll-mt-20">
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <span>Tim Mahasiswa KKN Kelompok 7</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-bold">
              Kolaborasi mahasiswa lintas program studi Universitas Mulia dalam program pengabdian masyarakat. Sorot kartu untuk melihat efek 3D!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
            {kknTeam.map((m, idx) => {
              // Map avatars cleanly to matching optimized transparent PNG files
              const cutoutSrc = `/kkn_member_${(idx % 8) + 1}.png`;
              
              return (
                <div
                  key={m.id}
                  className="group relative rounded-3xl bg-white border border-slate-200/80 shadow-sm p-6 hover:shadow-xl hover:border-[#0b5665]/35 transition-all duration-500 flex flex-col justify-between overflow-visible h-[360px] cursor-pointer hover:-translate-y-2.5"
                >
                  {/* Subtle 3D background shadow aura */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#0b5665]/0 to-[#0b5665]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* 3D POP OUT FRAME CONTAINER */}
                  <div className="relative w-36 h-36 mx-auto rounded-full bg-slate-50 border border-slate-100 shadow-inner flex items-end justify-center overflow-visible mt-2">
                    {/* Ring glow behind head */}
                    <div className="absolute inset-2 rounded-full bg-[#0b5665]/5 scale-0 group-hover:scale-110 transition-transform duration-500" />
                    
                    {/* The cutout photo that overflows the container (Creating the 3D popout effect!) */}
                    <img
                      src={cutoutSrc}
                      alt={m.name}
                      className="absolute bottom-0 h-[125%] w-auto object-contain select-none pointer-events-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] group-hover:scale-110 group-hover:-translate-y-3 transition-all duration-500 z-10"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="text-center relative z-20 space-y-2 mt-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-[10px] font-black uppercase tracking-wider">
                      {m.role_kkn}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#0b5665] transition-colors duration-300 truncate">
                      {m.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {m.prodi}
                    </p>
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
