import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types/database';
import { 
  CheckCircle2, 
  Code2, 
  LogIn, 
  LogOut, 
  Menu, 
  ShieldCheck, 
  UserCheck, 
  X,
  Waves
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  onOpenPresensi: () => void;
  onOpenDashboard: () => void;
  onLogout: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  userProfile,
  onOpenAuth,
  onOpenPresensi,
  onOpenDashboard,
  onLogout,
  activeSection,
  setActiveSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'tentang', label: 'Tentang' },
    { id: 'proker', label: 'Proker' },
    { id: 'berita', label: 'Live Report' },
    { id: 'tim', label: 'Tim KKN' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'kontak', label: 'Posko' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* MINIMALIST CLEAN LOGO */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group" 
            onClick={() => handleNavClick('beranda')}
          >
            <div className="w-9 h-9 rounded-xl bg-[#236F9E] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base text-slate-900 tracking-tight leading-none">
                KKN RT 35 MANGGAR 2
              </span>
              <span className="text-[10px] font-extrabold text-[#4F9460] mt-0.5">
                Balikpapan Timur
              </span>
            </div>
          </div>

          {/* DESKTOP MINIMALIST NAV LINKS */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  activeSection === link.id
                    ? 'text-[#236F9E] bg-[#DDF0FA] font-black'
                    : 'text-slate-700 hover:text-[#236F9E] hover:bg-slate-100 font-extrabold'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* RIGHT SIDE: ONLY SHOW LOGIN BUTTON FOR PUBLIC VISITORS! */}
          <div className="hidden lg:flex items-center space-x-2.5">
            
            {currentRole === 'public' ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#236F9E] hover:bg-[#1C597E] text-white font-black text-xs shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span className="text-white font-black">Masuk / Login</span>
              </button>
            ) : (
              /* WHEN USER IS LOGGED IN */
              <div className="flex items-center space-x-2.5">
                
                {/* ROLE BADGE */}
                {currentRole === 'developer' && (
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-[11px] font-black">
                    <Code2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Dev Admin</span>
                  </div>
                )}
                
                {currentRole === 'mahasiswa' && (
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-[11px] font-black">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{userProfile?.full_name.split(' ')[0]}</span>
                  </div>
                )}

                {/* ACTION BUTTONS WHEN LOGGED IN */}
                {currentRole === 'developer' && (
                  <button
                    onClick={onOpenDashboard}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm transition-all"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                    <span>CMS Admin</span>
                  </button>
                )}

                <button
                  onClick={onOpenPresensi}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#4F9460] hover:bg-[#3F774F] text-white font-black text-xs shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Presensi Harian</span>
                </button>

                <button
                  onClick={onLogout}
                  title="Keluar / Logout"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>

              </div>
            )}

          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex md:hidden items-center space-x-2">
            {currentRole === 'public' ? (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg bg-[#236F9E] text-white font-black text-xs flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </button>
            ) : (
              <button
                onClick={onOpenPresensi}
                className="px-3 py-1.5 rounded-lg bg-[#4F9460] text-white font-black text-xs flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Presensi
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-800 hover:bg-slate-100 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-black ${
                  activeSection === link.id
                    ? 'text-[#236F9E] bg-[#DDF0FA]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {currentRole === 'public' ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#236F9E] text-white font-black text-xs shadow-md"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Masuk / Login Mahasiswa & Admin</span>
              </button>
            ) : (
              <div className="space-y-2">
                {currentRole === 'developer' && (
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenDashboard(); }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Buka CMS Admin</span>
                  </button>
                )}

                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenPresensi(); }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-[#4F9460] text-white font-black text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Presensi Harian</span>
                </button>

                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 text-red-600 border border-slate-200 text-xs font-black"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar / Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
