import React, { useState } from 'react';
import { UserRole, UserProfile, NavigationItem } from '../types/database';
import { 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  Menu, 
  ShieldCheck, 
  PieChart, 
  Anchor, 
  Sparkles, 
  X 
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
  navItems: NavigationItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  userProfile,
  onOpenAuth,
  onOpenPresensi,
  onOpenDashboard,
  onLogout,
  activeSection,
  setActiveSection,
  navItems
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = window.location.pathname;

  const isHomeActive = (targetId: string) => {
    if (targetId === 'beranda') {
      return ['beranda', 'statistik-warga', 'pengumuman-rt', 'pengurus-rt', 'kkn-rt35', 'kontak-layanan'].includes(activeSection) && (currentPath === '/home' || currentPath === '/');
    }
    return activeSection === targetId && (currentPath === '/home' || currentPath === '/');
  };

  const visibleItems: NavigationItem[] = [
    { id: 'nav-1', label: 'Beranda', type: 'anchor', target_id: 'beranda', order_index: 1, is_visible: true },
    { id: 'nav-2', label: 'Fasilitas RT', type: 'custom_page', target_id: 'fasilitas', order_index: 2, is_visible: true },
    { id: 'nav-3', label: 'Kegiatan Warga', type: 'custom_page', target_id: 'kegiatan-warga', order_index: 3, is_visible: true },
    { id: 'nav-4', label: 'Berita RT', type: 'custom_page', target_id: 'berita', order_index: 4, is_visible: true }
  ];

  const handleNavItemClick = (item: NavigationItem) => {
    setMobileMenuOpen(false);
    if (item.target_id === 'fasilitas') {
      window.history.pushState(null, '', '/fasilitas');
      window.dispatchEvent(new Event('popstate'));
      return;
    }
    if (item.target_id === 'berita') {
      window.history.pushState(null, '', '/berita');
      window.dispatchEvent(new Event('popstate'));
      return;
    }
    if (item.type === 'anchor') {
      if (item.target_id === 'kkn') {
        window.history.pushState(null, '', '/kkn');
        window.dispatchEvent(new Event('popstate'));
      } else if (item.target_id === 'berita') {
        window.history.pushState(null, '', '/berita');
        window.dispatchEvent(new Event('popstate'));
      } else {
        setActiveSection(item.target_id);
        if (currentPath !== '/home' && currentPath !== '/') {
          window.history.pushState(null, '', '/home');
          window.dispatchEvent(new Event('popstate'));
          setTimeout(() => {
            const element = document.getElementById(item.target_id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } else {
          const element = document.getElementById(item.target_id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    } else {
      window.history.pushState(null, '', `/page/${item.target_id}`);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  return (
    <header className="sticky top-4 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass-panel rounded-[24px] px-6 h-16 flex items-center justify-between gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all">
        
        {/* RT 35 BRAND LOGO */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group shrink-0" 
          onClick={() => {
            window.history.pushState(null, '', '/home');
            window.dispatchEvent(new Event('popstate'));
            setTimeout(() => {
              const el = document.getElementById('beranda');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        >
          <div className="w-9 h-9 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
            <img src="/logo.png" alt="Logo RT 35" className="w-9 h-9 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xs text-slate-800 tracking-tight leading-none uppercase">
              PORTAL RT 35
            </span>
            <span className="text-[8px] font-black text-[#5F8D4E] mt-1.5 uppercase tracking-wider leading-none">
              Manggar Balikpapan
            </span>
          </div>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-1.5 overflow-hidden">
          {visibleItems.map((item) => {
            if (item.type === 'anchor') {
              if (item.target_id === 'kkn') {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavItemClick(item)}
                    className={`px-2 xl:px-3 py-1.5 rounded-lg text-[11px] xl:text-xs font-black transition-all flex items-center space-x-1 shrink-0 ${
                      currentPath === '/kkn'
                        ? 'text-[#5F8D4E] bg-[#85A389]/10'
                        : 'text-[#85A389] hover:text-[#5F8D4E] hover:bg-[#85A389]/5'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#85A389]" />
                    <span>{item.label}</span>
                  </button>
                );
              }
              if (item.target_id === 'berita') {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavItemClick(item)}
                    className={`px-2 xl:px-3 py-1.5 rounded-lg text-[11px] xl:text-xs font-black transition-all shrink-0 ${
                      currentPath === '/berita'
                        ? 'text-[#1E4D6B] bg-slate-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavItemClick(item)}
                  className={`px-2 xl:px-3 py-1.5 rounded-lg text-[11px] xl:text-xs font-black transition-all shrink-0 ${
                    isHomeActive(item.target_id)
                      ? 'text-[#1E4D6B] bg-slate-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            } else {
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavItemClick(item)}
                  className={`px-2 xl:px-3 py-1.5 rounded-lg text-[11px] xl:text-xs font-black transition-all shrink-0 ${
                    currentPath === `/page/${item.target_id}` || 
                    (item.target_id === 'fasilitas' && currentPath === '/fasilitas') ||
                    (item.target_id === 'berita' && currentPath === '/berita')
                      ? 'text-[#1E4D6B] bg-slate-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            }
          })}
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="hidden lg:flex items-center space-x-2.5 shrink-0">
          {currentRole === 'public' ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 px-4.5 py-2 rounded-xl bg-gradient-to-r from-[#1E4D6B] to-[#85A389] hover:shadow-md text-white font-extrabold text-xs transition-all hover:scale-102 active:scale-98"
            >
              <LogIn className="w-4 h-4 text-white" />
              <span>Masuk Login</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              {currentRole === 'sekretaris_rt' && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E5D3B3]/10 border border-[#E5D3B3]/30 text-[#a38b64] text-[10px] font-black uppercase tracking-wider">
                  <PieChart className="w-3.5 h-3.5" />
                  <span>Sekretaris RT</span>
                </div>
              )}

              {currentRole === 'mahasiswa' && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#85A389]/10 border border-[#85A389]/25 text-[#5F8D4E] text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Anggota KKN</span>
                </div>
              )}

              {currentRole === 'developer' && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1E4D6B]/10 border border-[#1E4D6B]/25 text-[#1E4D6B] text-[10px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>IT Developer</span>
                </div>
              )}

              <button
                onClick={currentRole === 'mahasiswa' ? onOpenPresensi : onOpenDashboard}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs transition-all border border-slate-200 shadow-sm"
              >
                Dashboard
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-100"
                title="Logout"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center space-x-2">
          {currentRole === 'public' ? (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg bg-[#1E4D6B] text-white font-extrabold text-xs flex items-center gap-1 shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" /> Login
            </button>
          ) : (
            <button
              onClick={currentRole === 'sekretaris_rt' ? onOpenDashboard : onOpenPresensi}
              className="px-3 py-1.5 rounded-lg bg-[#1E4D6B] text-white font-extrabold text-xs flex items-center gap-1 shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Panel
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-panel rounded-[20px] p-4 space-y-3 shadow-lg border border-white/20 animate-fade-in">
          <div className="grid grid-cols-2 gap-1.5">
            {visibleItems.map((item) => {
              if (item.type === 'anchor') {
                if (item.target_id === 'berita') {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavItemClick(item)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-bold ${
                        currentPath === '/berita'
                          ? 'text-[#1E4D6B] bg-[#1E4D6B]/5 font-extrabold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                }
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavItemClick(item)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-bold ${
                      isHomeActive(item.target_id)
                        ? 'text-[#1E4D6B] bg-[#1E4D6B]/5 font-extrabold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              } else {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavItemClick(item)}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-bold ${
                      currentPath === `/page/${item.target_id}` || 
                      (item.target_id === 'fasilitas' && currentPath === '/fasilitas') ||
                      (item.target_id === 'berita' && currentPath === '/berita')
                        ? 'text-[#1E4D6B] bg-[#1E4D6B]/5 font-extrabold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {currentRole === 'public' ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1E4D6B] to-[#85A389] text-white font-bold text-xs"
              >
                <LogIn className="w-4 h-4 text-white" />
                <span>Masuk Login Pengurus</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (currentRole === 'sekretaris_rt' || currentRole === 'developer') onOpenDashboard();
                    else onOpenPresensi();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-[#1E4D6B] text-white font-bold text-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Buka Dashboard Panel</span>
                </button>

                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-slate-50 text-rose-500 border border-slate-200 text-xs font-bold"
                >
                  <LogOut className="w-4.5 h-4.5" />
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

export default Navbar;
