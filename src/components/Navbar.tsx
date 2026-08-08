import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, NavigationItem } from '../types/database';
import { 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  Menu, 
  ShieldCheck, 
  PieChart, 
  GraduationCap,
  X,
  PhoneCall
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
  const [scrolled, setScrolled] = useState(false);
  const currentPath = window.location.pathname;

  // Track scroll position for transparent -> solid transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0b5665] shadow-lg py-3' 
        : 'bg-gradient-to-b from-black/50 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* BRAND LOGO */}
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
          <div className="w-10 h-10 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-white/10 rounded-xl p-1.5 border border-white/20">
            <img src="/logo.png" alt="Logo RT 35" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-white tracking-tight leading-none uppercase">
              PORTAL RT 35
            </span>
            <span className="text-[9px] font-black text-amber-450 mt-1 uppercase tracking-wider leading-none">
              Manggar Balikpapan
            </span>
          </div>
        </div>

        {/* DESKTOP NAV LINKS (Simkopdes style text-white) */}
        <nav className="hidden md:flex items-center gap-2 overflow-hidden">
          {visibleItems.map((item) => {
            const isActive = item.type === 'anchor' 
              ? isHomeActive(item.target_id) 
              : (currentPath === `/page/${item.target_id}` || (item.target_id === 'fasilitas' && currentPath === '/fasilitas') || (item.target_id === 'berita' && currentPath === '/berita'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item)}
                className={`px-3 py-2 rounded-full text-xs font-bold tracking-wide transition-all shrink-0 ${
                  isActive
                    ? 'text-white bg-white/15'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="hidden md:flex items-center space-x-3 shrink-0">
          
          {/* Lapor Tamu Pill (Simkopdes style mobile button) */}
          <button
            onClick={() => {
              const el = document.getElementById('kontak-layanan');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white hover:bg-white/95 text-[#0b5665] px-4.5 py-2 rounded-full font-black text-xs transition-all shadow flex items-center space-x-1.5 active:scale-98"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Lapor Tamu 24 Jam</span>
          </button>

          {currentRole === 'public' ? (
            /* Masuk Button (Simkopdes style circular outline button) */
            <button
              onClick={onOpenAuth}
              className="border border-white/60 hover:border-white hover:bg-white/10 text-white px-5 py-2 rounded-full font-black text-xs transition-all flex items-center space-x-1.5 active:scale-98"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              {currentRole === 'sekretaris_rt' && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider">
                  <PieChart className="w-3 h-3 text-amber-400" />
                  <span>Sekretaris RT</span>
                </div>
              )}

              {currentRole === 'mahasiswa' && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider">
                  <GraduationCap className="w-3 h-3 text-amber-400" />
                  <span>Anggota KKN</span>
                </div>
              )}

              {currentRole === 'developer' && (
                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[9px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-amber-450" />
                  <span>IT Developer</span>
                </div>
              )}

              <button
                onClick={currentRole === 'mahasiswa' ? onOpenPresensi : onOpenDashboard}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white font-extrabold text-xs transition-all"
              >
                Dashboard
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-full text-rose-300 hover:bg-white/10 hover:text-rose-200 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROP-DOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a4d5b] border-t border-white/10 px-6 py-4 space-y-4 animate-fade-in shadow-xl">
          <nav className="flex flex-col space-y-3">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item)}
                className="w-full text-left py-2 text-white/90 hover:text-white font-bold text-xs"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const el = document.getElementById('kontak-layanan');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-white text-[#0b5665] py-2.5 rounded-full font-black text-xs transition-all shadow text-center flex items-center justify-center space-x-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Lapor Tamu 24 Jam</span>
            </button>

            {currentRole === 'public' ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full border border-white/60 hover:border-white text-white py-2.5 rounded-full font-black text-xs transition-all text-center flex items-center justify-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Login</span>
              </button>
            ) : (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (currentRole === 'mahasiswa') onOpenPresensi();
                    else onOpenDashboard();
                  }}
                  className="w-full py-2.5 rounded-full bg-white/15 text-white font-extrabold text-xs text-center border border-white/20"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="w-full py-2.5 rounded-full bg-rose-500/20 text-rose-200 font-extrabold text-xs text-center"
                >
                  Logout
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
