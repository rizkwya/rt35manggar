import React from 'react';
import { Anchor, MapPin, Phone, Heart } from 'lucide-react';
import { RTSettings } from '../types/database';

interface FooterProps {
  settings?: RTSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const handleNavClick = (id: string) => {
    const currentPath = window.location.pathname;
    if (currentPath !== '/home' && currentPath !== '/') {
      window.history.pushState(null, '', '/home');
      window.dispatchEvent(new Event('popstate'));
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleKKNClick = () => {
    window.history.pushState(null, '', '/kkn');
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <footer className="bg-[#FAF9F5] border-t border-slate-200 text-slate-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COL 1: RT 35 BRANDING */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1E4D6B] via-[#85A389] to-[#E5D3B3] flex items-center justify-center text-white shadow-sm">
                <Anchor className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 tracking-tight">PORTAL RT 35 MANGGAR</h3>
                <p className="text-[10px] font-bold text-[#85A389] uppercase tracking-wider">Balikpapan Timur</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {settings?.portal_description || 'Platform digitalisasi pelayanan publik resmi RT 35 Kelurahan Manggar 2, Kecamatan Balikpapan Timur, Kota Balikpapan. Menghadirkan informasi transparansi data warga pesisir yang terintegrasi.'}
            </p>
          </div>

          {/* COL 2: QUICK LINKS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Navigasi Portal</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><button onClick={() => handleNavClick('beranda')} className="hover:text-[#1E4D6B] transition-colors text-left text-slate-600">Beranda Utama</button></li>
              <li><button onClick={() => handleNavClick('statistik-warga')} className="hover:text-[#1E4D6B] transition-colors text-left text-slate-600">Statistik & Data Demografi KK</button></li>
              <li><button onClick={() => handleNavClick('pengumuman-rt')} className="hover:text-[#1E4D6B] transition-colors text-left text-slate-600">Papan Pengumuman RT 35</button></li>
              <li><button onClick={() => handleNavClick('pengurus-rt')} className="hover:text-[#1E4D6B] transition-colors text-left text-slate-600">Struktur Pengurus & Layanan</button></li>
              <li><button onClick={handleKKNClick} className="hover:text-[#1E4D6B] transition-colors text-left font-bold text-[#85A389]">Sub-Portal Pengabdian KKN</button></li>
            </ul>
          </div>

          {/* COL 3: CONTACT & LOCATION */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Kontak & Sekretariat</h4>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#85A389] shrink-0 mt-0.5" />
                <span className="text-slate-600">{settings?.address || 'Balai RT 35 Kelurahan Manggar 2, Balikpapan Timur'}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#1E4D6B] shrink-0" />
                <span className="text-slate-600">Sekretaris RT: {settings?.phone_secretary || '0812-9876-5432'}</span>
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-2 sm:space-y-0">
          <p>© 2026 Pemerintah RT 35 Kelurahan Manggar 2. Hak Cipta Dilindungi.</p>
          <p className="flex items-center space-x-1">
            <span>Dikelola bersama oleh Pengurus RT 35 & Tim KKN</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1" />
          </p>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
