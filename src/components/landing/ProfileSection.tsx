import React, { useState } from 'react';
import { Sparkles, Target, Landmark, Compass, Navigation } from 'lucide-react';
import { RTSettings } from '../../types/database';

interface ProfileSectionProps {
  settings?: RTSettings;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ settings }) => {
  const [activeTab, setActiveTab] = useState<'visi-misi' | 'sejarah'>('visi-misi');

  const visionText = settings?.vision || 'Menjadi lingkungan RT 35 Kelurahan Manggar yang religius, mandiri, aman, tenteram, dan unggul dalam pelayanan digital.';
  const missionLines = (settings?.mission || '1. Meningkatkan kerukunan antar tetangga dengan kerja bakti rutin.\n2. Memberikan keterbukaan administrasi digital bagi seluruh warga.\n3. Mendorong kemandirian ekonomi UMKM pesisir.\n4. Memelihara keamanan lingkungan dengan siskamling aktif.')
    .split('\n')
    .filter(line => line.trim() !== '');

  const historyText = settings?.history || 'RT 35 didirikan di kawasan pesisir Kelurahan Manggar pada tahun 1998 sebagai pemekaran wilayah guna mempercepat pembangunan sosial masyarakat nelayan dan pelaku usaha mikro. Sejak pendiriannya, RT 35 telah menjadi contoh lingkungan gotong royong di Balikpapan Timur.';

  return (
    <section id="profil-rt" className="py-24 relative bg-[#FAF9F6] border-t border-slate-100 scroll-mt-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10 animate-fade-in">
        
        {/* HEADER */}
        <div className="text-center space-y-3">
          <div className="badge-premium-sage">
            <Landmark className="w-4 h-4 text-[#85A389]" />
            <span>Profil Lengkap Rukun Tetangga</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Mengenal Lebih Dekat <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E4D6B] via-[#85A389] to-[#bca481]">RT 35 Manggar</span>
          </h2>
          <p className="text-slate-650 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-semibold">
            Visi misi arah pembangunan, sejarah pembentukan wilayah, serta rincian batas teritorial kepengurusan RT 35.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: VISION/MISSION OR HISTORY TABS (SPAN 7) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-6">
              {/* Tab Selector Buttons */}
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('visi-misi')}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                    activeTab === 'visi-misi'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 border border-slate-200/50 hover:bg-slate-100'
                  }`}
                >
                  <Target className="w-4.5 h-4.5 text-[#85A389]" />
                  <span>Visi & Misi RT 35</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setActiveTab('sejarah')}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                    activeTab === 'sejarah'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 border border-slate-200/50 hover:bg-slate-100'
                  }`}
                >
                  <Landmark className="w-4.5 h-4.5 text-[#E5D3B3]" />
                  <span>Sejarah Singkat</span>
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="min-h-[220px] transition-all duration-300">
                {activeTab === 'visi-misi' ? (
                  <div className="space-y-6 animate-fade-in">
                    {/* Vision Statement */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#1E4D6B] flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-[#85A389]" />
                        <span>Visi Utama</span>
                      </h4>
                      <p className="text-slate-800 text-sm sm:text-base font-extrabold italic leading-relaxed border-l-4 border-[#85A389] pl-4">
                        "{visionText}"
                      </p>
                    </div>

                    {/* Mission Statement List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#1E4D6B]">Misi Lingkungan</h4>
                      <ul className="space-y-2.5">
                        {missionLines.map((mission, idx) => (
                          <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                            <span className="flex items-center justify-center w-5.5 h-5.5 rounded-lg bg-[#85A389]/10 text-[#5F8D4E] font-black shrink-0 text-[10px] mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{mission.replace(/^\d+[\.\s]*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#1E4D6B] flex items-center gap-1.5">
                      <Landmark className="w-4.5 h-4.5 text-[#E5D3B3]" />
                      <span>Sejarah Pendirian Wilayah</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold whitespace-pre-line bg-[#FAF9F6] p-5 rounded-2xl border border-slate-100">
                      {historyText}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-450 font-bold flex items-center justify-between">
              <span>* Data Diperbarui secara Berkala oleh Sekretaris RT</span>
              <span>Terintegrasi Portal RT 35</span>
            </div>
          </div>

          {/* RIGHT: BOUNDARIES & GEOGRAPHY (SPAN 5) */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-[#1E4D6B] via-[#245b7f] to-[#1E4D6B] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden border border-[#2a668e]">
            {/* Wave Pattern Decorative Accent */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" fill="currentColor">
                <path d="M0,50 C30,70 70,30 100,50 L100,100 L0,100 Z" />
              </svg>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                <div className="p-2.5 rounded-2xl bg-white/10 text-white border border-white/10">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">Batas Administrasi Wilayah</h3>
                  <p className="text-[10px] text-white/60 font-semibold mt-0.5">Letak administrasi geografis lingkungan RT 35</p>
                </div>
              </div>

              {/* Borders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
                
                {/* North */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[9px] font-black text-[#FAF7F0] uppercase tracking-widest flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-[#E5D3B3] rotate-0" />
                    <span>Sebelah Utara</span>
                  </span>
                  <p className="text-xs font-bold opacity-90">{settings?.boundary_north || 'Kelurahan Manggar Sari / RT 34'}</p>
                </div>

                {/* East */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[9px] font-black text-[#FAF7F0] uppercase tracking-widest flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-[#E5D3B3] rotate-90" />
                    <span>Sebelah Timur</span>
                  </span>
                  <p className="text-xs font-bold opacity-90">{settings?.boundary_east || 'Selat Makassar / Area Pesisir'}</p>
                </div>

                {/* South */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[9px] font-black text-[#FAF7F0] uppercase tracking-widest flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-[#E5D3B3] rotate-180" />
                    <span>Sebelah Selatan</span>
                  </span>
                  <p className="text-xs font-bold opacity-90">{settings?.boundary_south || 'Kawasan Pantai Nelayan Manggar'}</p>
                </div>

                {/* West */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-[9px] font-black text-[#FAF7F0] uppercase tracking-widest flex items-center gap-1.5">
                    <Navigation className="w-3 h-3 text-[#E5D3B3] -rotate-90" />
                    <span>Sebelah Barat</span>
                  </span>
                  <p className="text-xs font-bold opacity-90">{settings?.boundary_west || 'Jalan Mulawarman Raya / RT 36'}</p>
                </div>

              </div>

              {/* Maps Location Anchor Info */}
              {settings?.maps_coordinate && (
                <div className="p-4 rounded-2xl bg-white/5 border border-[#85A389]/30 text-xs font-medium space-y-1.5">
                  <span className="font-black text-[#E5D3B3] block uppercase tracking-wider text-[9px]">Titik Koordinat GPS Balai RT</span>
                  <span className="font-mono text-[11px] block select-all bg-black/20 p-2 rounded-lg text-white/80 border border-white/5">
                    📍 {settings.maps_coordinate}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-[10px] text-white/50 font-semibold text-right">
              Kelurahan Manggar 2 • Balikpapan Timur
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
