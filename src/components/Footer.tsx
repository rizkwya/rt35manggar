import React from 'react';
import { Anchor, MapPin, Phone, Heart, Globe, Mail, Shield } from 'lucide-react';
import { RTSettings } from '../types/database';

interface FooterProps {
  settings?: RTSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-[#FAF9F5] border-t border-slate-250 text-slate-600 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COL 1: BRANDING & PARTNERSHIP (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-5 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <img src="/logo.png" alt="Logo RT 35" className="h-11 w-auto object-contain" />
                <div className="h-8 w-px bg-slate-200"></div>
                <img src="/logohutum.png" alt="Logo Universitas Mulawarman" className="h-12 w-auto object-contain" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-800 text-sm tracking-tight uppercase">PORTAL RESMI RT 35 MANGGAR</h3>
              <p className="text-[10px] font-black text-[#5F8D4E] uppercase tracking-wider">Kolaborasi Pengabdian Mulawarman & Warga</p>
            </div>
            <p className="text-xs text-slate-650 leading-relaxed max-w-md">
              {settings?.portal_description || 'Platform digitalisasi pelayanan publik resmi RT 35 Kelurahan Manggar, Kecamatan Balikpapan Timur, Kota Balikpapan. Menghadirkan informasi transparansi data warga pesisir yang terintegrasi bersama Tim KKN Kelompok 7 Universitas Mulawarman.'}
            </p>
          </div>
 
          {/* COL 2: NAVIGATION LINKS (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-l-2 border-[#5F8D4E] pl-3">Navigasi Portal</h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li>
                <a href="/" className="text-slate-600 hover:text-[#5F8D4E] transition-colors text-left block">
                  Beranda Utama
                </a>
              </li>
              <li>
                <a href="/#statistik-warga" className="text-slate-600 hover:text-[#5F8D4E] transition-colors text-left block">
                  Statistik & Data Demografi KK
                </a>
              </li>
              <li>
                <a href="/#pengumuman-rt" className="text-slate-600 hover:text-[#5F8D4E] transition-colors text-left block">
                  Papan Pengumuman RT 35
                </a>
              </li>
              <li>
                <a href="/#pengurus-rt" className="text-slate-600 hover:text-[#5F8D4E] transition-colors text-left block">
                  Struktur Pengurus & Layanan
                </a>
              </li>
              <li>
                <a href="/kkn" className="text-[#5F8D4E] font-bold hover:opacity-85 transition-opacity text-left block">
                  Sub-Portal Pengabdian KKN
                </a>
              </li>
            </ul>
          </div>

          {/* COL 3: SECURE INFO & SECERTARIAT (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-l-2 border-[#5F8D4E] pl-3">Hubungi Kami</h4>
            <div className="space-y-3.5 text-xs text-slate-600 font-semibold">
              <p className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#5F8D4E] shrink-0 mt-0.5" />
                <span className="leading-normal">{settings?.address || 'Balai RT 35 Kelurahan Manggar, Balikpapan Timur'}</span>
              </p>
              <p className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#5F8D4E] shrink-0" />
                <span>Hubungi Pengurus: {settings?.phone_secretary || '0812-9876-5432'}</span>
              </p>
              <p className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Website: www.rt35manggar.my.id</span>
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom Division */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© 2026 Pemerintah RT 35 Kelurahan Manggar. Hak Cipta Dilindungi.</p>
          <p className="flex items-center justify-center space-x-1">
            <span>Dikelola oleh Pengurus RT 35 & Tim KKN</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </p>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
