import React from 'react';
import { Heart, MapPin, Mail, Phone, Waves, Trees } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1E4D6B] text-white border-t-4 border-beach-sand pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* COL 1: BRAND */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white p-0.5 shadow-md flex items-center justify-center text-beach-blue-dark">
                <Waves className="w-6 h-6" />
              </div>
              <span className="font-display font-black text-lg text-white tracking-wide">KKN MANGGAR 2</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              Portal digital resmi KKN Kelurahan Manggar 2, Balikpapan Timur. Pengabdian berbasis teknologi Informatika & pemberdayaan masyarakat pesisir.
            </p>
          </div>

          {/* COL 2: QUICK LINKS */}
          <div>
            <h4 className="text-amber-300 font-extrabold text-xs mb-4 tracking-wider uppercase">Menu Utama</h4>
            <ul className="space-y-2.5 text-xs text-slate-200 font-medium">
              <li><a href="#beranda" className="hover:text-amber-300 transition-colors">Beranda</a></li>
              <li><a href="#tentang" className="hover:text-amber-300 transition-colors">Tentang Manggar 2</a></li>
              <li><a href="#proker" className="hover:text-amber-300 transition-colors">Program Kerja</a></li>
              <li><a href="#berita" className="hover:text-amber-300 transition-colors">Live Report Berita</a></li>
              <li><a href="#tim" className="hover:text-amber-300 transition-colors">Tim Mahasiswa</a></li>
            </ul>
          </div>

          {/* COL 3: LOKASI & KONTAK */}
          <div>
            <h4 className="text-amber-300 font-extrabold text-xs mb-4 tracking-wider uppercase">Posko Manggar 2</h4>
            <ul className="space-y-3 text-xs text-slate-200 font-medium">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>Jl. Mulawarman RT 04, Kelurahan Manggar 2, Balikpapan Timur, Kalimantan Timur</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <span>kkn.manggar2@fasilkom.ac.id</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <span>+62 812-3456-7890 (Humas)</span>
              </li>
            </ul>
          </div>

          {/* COL 4: SUPABASE & TECH STACK */}
          <div>
            <h4 className="text-amber-300 font-extrabold text-xs mb-4 tracking-wider uppercase">Teknologi Web</h4>
            <p className="text-xs text-slate-200 mb-3 font-medium">
              Portal pantai & presensi realtime berbasis teknologi modern:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-bold border border-white/20">React 18</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-bold border border-white/20">TypeScript</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-amber-300 text-[11px] font-bold border border-white/20">TailwindCSS</span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-400/20 text-emerald-200 text-[11px] font-bold border border-emerald-400/30">Supabase</span>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-slate-300 gap-4 font-medium">
          <p>© 2026 KKN Kelurahan Manggar 2 Balikpapan Timur. Hak Cipta Dilindungi.</p>
          <div className="flex items-center space-x-1 text-slate-200">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 mx-0.5 inline" />
            <span>oleh Mahasiswa Informatika / Fasilkom</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
