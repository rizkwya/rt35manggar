import React from 'react';
import { ShieldCheck, Cpu, Database, MapPin, CheckCircle2, Trees, Waves } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="py-20 relative bg-white border-t border-beach-sky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: TEXT DESCRIPTION */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-beach-sand text-amber-900 text-xs font-bold border border-beach-sand-dark">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>Profil Pengabdian & Wilayah</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-800 tracking-tight">
              Sinergi Teknologi & Masyarakat <br />
              <span className="gradient-text-ocean">RT 35 Kelurahan Manggar 2</span>
            </h2>

            <p className="text-slate-700 text-base leading-relaxed font-medium">
              Wilayah RT 35 Kelurahan Manggar 2 Balikpapan Timur merupakan kawasan pemukiman pesisir yang berkembang pesat dengan keberagaman usaha warga, olahan laut, dan kegiatan sosial kemasyarakatan.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              Tim KKN yang terdiri dari 8 mahasiswa (Informatika, Sistem Informasi, Manajemen, Akuntansi, Farmasi) hadir secara khusus untuk mendukung warga RT 35 melalui pemberdayaan UMKM, sosialisasi kesehatan, dan sistem informasi presensi digital.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-beach-palm-dark shrink-0 mt-0.5" />
                <p className="text-sm text-slate-800 font-bold">Peta Digital & Katalog UMKM Kuliner Pesisir Manggar 2</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-beach-palm-dark shrink-0 mt-0.5" />
                <p className="text-sm text-slate-800 font-bold">CMS Live Report Berita Harian dengan Supabase Realtime</p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-beach-palm-dark shrink-0 mt-0.5" />
                <p className="text-sm text-slate-800 font-bold">Sistem Presensi & Rekap Logbook Digital Mahasiswa KKN</p>
              </div>
            </div>
          </div>

          {/* RIGHT: DECORATIVE PASTEL CARDS */}
          <div className="relative">
            <div className="beach-card p-8 space-y-6 relative z-10 bg-gradient-to-br from-white via-beach-sand-light to-beach-sky">
              
              <div className="flex items-center space-x-4 pb-6 border-b border-beach-sky">
                <div className="w-14 h-14 rounded-2xl bg-beach-palm/20 border border-beach-palm flex items-center justify-center text-beach-palm-dark font-bold">
                  <Trees className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-800">Informatika & Fasilkom</h4>
                  <p className="text-xs text-slate-600 font-semibold">Pengabdian Berbasis Teknologi & Masyarakat Pesisir</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-beach-sky shadow-sm">
                  <Database className="w-6 h-6 text-beach-blue-dark mb-2" />
                  <h5 className="font-extrabold text-slate-800 text-sm">Supabase Realtime</h5>
                  <p className="text-xs text-slate-500 font-medium mt-1">Cloud Sync & Data Store</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-beach-sky shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-amber-600 mb-2" />
                  <h5 className="font-extrabold text-slate-800 text-sm">Akses Berperan</h5>
                  <p className="text-xs text-slate-500 font-medium mt-1">Developer vs Mahasiswa</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-beach-sand border border-beach-sand-dark">
                <p className="text-xs text-amber-900 font-bold italic">
                  "Menghubungkan inovasi teknologi kampus Informatika langsung ke tengah masyarakat dan pesisir Kelurahan Manggar 2."
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
