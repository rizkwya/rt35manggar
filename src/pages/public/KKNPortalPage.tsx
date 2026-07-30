import React from 'react';
import { Sparkles, CheckCircle2, GraduationCap, Clock, Award, ArrowLeft, Anchor, Compass } from 'lucide-react';
import { ProkerItem, TeamMember } from '../../types/database';

interface KKNPortalPageProps {
  prokerList: ProkerItem[];
  kknTeam: TeamMember[];
  onBackToHome: () => void;
}

export const KKNPortalPage: React.FC<KKNPortalPageProps> = ({ prokerList, kknTeam, onBackToHome }) => {

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#85A389] selection:text-white">
      
      {/* BEACH HEADER SECTION */}
      <div className="relative py-20 overflow-hidden bg-gradient-to-b from-[#EBF3F5] via-[#FAF7F0] to-slate-50 border-b border-slate-200">
        
        {/* Coastal / Wave Accents */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <svg className="absolute w-full bottom-0 left-0" viewBox="0 0 1440 320" fill="none">
            <path fill="#85A389" d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,197.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-6">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 font-bold text-xs border border-slate-200 shadow-sm hover:bg-[#85A389]/10 hover:text-[#5F8D4E] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#85A389]" />
            <span>Kembali ke Portal RT 35</span>
          </button>

          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#85A389]/10 border border-[#85A389]/30 text-[#5F8D4E] text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-[#85A389]" />
              <span>Portal Pengabdian Masyarakat KKN</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-[#1E4D6B] tracking-tight leading-tight">
              Kuliah Kerja Nyata (KKN) <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E4D6B] via-[#85A389] to-[#bca481]">
                Kelompok 7 Manggar 2
              </span>
            </h1>
            <p className="text-slate-650 max-w-3xl text-xs sm:text-sm sm:text-base leading-relaxed font-semibold">
              Selamat datang di sub-portal pengabdian mahasiswa KKN Universitas. Halaman ini didedikasikan untuk transparansi program kerja, laporan kegiatan harian, serta informasi tim pelaksana KKN di lingkungan RT 35 Kelurahan Manggar 2, Balikpapan Timur.
            </p>
          </div>
        </div>
      </div>

      {/* DETAILED INFO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* STATS HIGHLIGHT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-[#85A389]/10 text-[#85A389] border border-[#85A389]/20">
              <Anchor className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Lokasi Posko</p>
              <h4 className="text-base font-extrabold text-slate-800">RT 35 Manggar 2</h4>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-[#E5D3B3]/25 text-[#b09874] border border-[#E5D3B3]/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Jumlah Proker</p>
              <h4 className="text-base font-extrabold text-slate-800">4 Program Utama</h4>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-700 bg-indigo-50 border border-indigo-100">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Tim Pengabdi</p>
              <h4 className="text-base font-extrabold text-slate-800">8 Mahasiswa S1</h4>
            </div>
          </div>
        </div>

        {/* PROGRAM KERJA (PROKER) SECTION */}
        <div className="space-y-8">
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[#85A389]" />
              <span>Program Kerja & Progress</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Rencana aksi digitalisasi, pemetaan kesehatan masyarakat, dan edukasi akuntansi ekonomi untuk warga RT 35.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {prokerList.map((item) => (
              <div
                key={item.id}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 hover:border-[#85A389]/40 shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#85A389]/10 border border-[#85A389]/20 text-[#5F8D4E]">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target: {item.target_date}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800 leading-snug">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-3 pt-6 mt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-505">Progress Pengerjaan:</span>
                    <span className="text-[#85A389]">{item.progress_percent}%</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#85A389] to-[#E5D3B3] transition-all duration-500"
                      style={{ width: `${item.progress_percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-550 pt-1">
                    <span>PJ Program: <strong className="text-slate-700">{item.pic_name}</strong></span>
                    <span className="flex items-center space-x-1 font-semibold text-emerald-600">
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
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#E5D3B3]" />
              <span>Tim Mahasiswa KKN Kelompok 7</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-505 font-medium">
              Kolaborasi mahasiswa lintas program studi Universitas dalam program pengabdian masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {kknTeam.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 text-center space-y-4 hover:border-[#85A389]/30 transition-all hover:scale-[1.02] duration-300 shadow-sm"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    src={m.avatar_url}
                    alt={m.name}
                    className="w-full h-full rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg bg-[#85A389] text-white flex items-center justify-center shadow">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">{m.name}</h4>
                  <p className="text-[10px] sm:text-xs font-bold text-[#85A389] mt-1">{m.role_kkn}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{m.prodi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
export default KKNPortalPage;
