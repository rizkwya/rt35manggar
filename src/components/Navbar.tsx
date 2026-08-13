import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, NavigationItem } from '../types/database';
import { 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  Menu, 
  PieChart, 
  GraduationCap,
  X,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  userProfile: UserProfile | null;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onLogout: () => void;
  onLaporTamu?: () => void;
  activeSection: string;
  setActiveSection?: (sec: string) => void;
  navItems: NavigationItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onOpenAuth,
  onOpenDashboard,
  onLogout,
  onLaporTamu,
  activeSection,
  setActiveSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [localRole, setLocalRole] = useState<UserRole>(currentRole);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('userRole') as UserRole;
      if (storedRole) {
        setLocalRole(storedRole);
      } else {
        setLocalRole(currentRole);
      }
    }
  }, [currentRole]);
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track scroll position for transparent -> bright white solid transition
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
    { id: 'nav-4', label: 'Berita RT', type: 'custom_page', target_id: 'berita', order_index: 4, is_visible: true },
    { id: 'nav-5', label: 'Tim KKN', type: 'custom_page', target_id: 'kkn', order_index: 5, is_visible: true }
  ];

  const handleOpenAuth = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      window.location.href = '/login';
    }
  };

  const handleOpenDashboard = () => {
    if (onOpenDashboard) {
      onOpenDashboard();
    } else {
      window.location.href = '/admin/dashboard';
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userRole');
        localStorage.removeItem('userProfile');
        window.location.href = '/';
      }
    }
  };

  const handleNavItemClick = (item: NavigationItem) => {
    setMobileMenuOpen(false);
    if (item.target_id === 'kkn') {
      window.location.href = '/kkn';
      return;
    }
    if (item.target_id === 'fasilitas') {
      window.location.href = '/fasilitas';
      return;
    }
    if (item.target_id === 'berita') {
      window.location.href = '/berita';
      return;
    }
    if (item.type === 'anchor') {
      if (setActiveSection) {
        setActiveSection(item.target_id);
      }
      const currentPathName = typeof window !== 'undefined' ? window.location.pathname : '/';
      const isOutsideHome = currentPathName !== '/' && currentPathName !== '/home' && currentPathName !== '/index.html';
      
      if (isOutsideHome) {
        if (item.target_id === 'beranda') {
          window.location.href = '/';
        } else {
          window.location.href = '/#' + item.target_id;
        }
      } else {
        if (item.target_id === 'beranda') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(item.target_id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    } else {
      window.location.href = `/page/${item.target_id}`;
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-350 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-2.5' 
        : 'bg-gradient-to-b from-black/60 to-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 relative">
        
        {/* BRAND LOGOS: logo.png | hutri.png (Simkopdes style, no border, bigger) */}
        <div 
          className="flex items-center space-x-3.5 cursor-pointer group shrink-0" 
          onClick={() => {
            window.location.href = '/';
          }}
        >
          {/* Logo RT 35 KKN */}
          <img 
            src="/logo.png" 
            alt="Logo RT 35" 
            className="w-auto object-contain transition-transform duration-300 group-hover:scale-102" 
            style={{ height: '32px' }}
          />
          
          {/* Vertical divider line */}
          <div 
            className={`w-[1.5px] transition-colors duration-300 ${
              scrolled ? 'bg-[#0b5665]/40' : 'bg-white/50'
            }`} 
            style={{ height: '22px' }}
          />
          
          {/* Logo HUT RI */}
          <img 
            src={scrolled ? "/hutri_black.png" : "/hutri.png"} 
            alt="Logo HUT RI" 
            className="w-auto object-contain transition-transform duration-300 group-hover:scale-102" 
            style={{ height: '32px' }}
          />

          {/* Text branding */}
          <div className="flex flex-col pl-1">
            <span className={`font-black text-[10px] sm:text-[11px] tracking-wider leading-none transition-colors duration-300 ${
              scrolled ? 'text-[#0b5665]' : 'text-white'
            }`}>
              PORTAL RT 35
            </span>
            <span className={`text-[7.5px] font-black mt-1 uppercase tracking-wider leading-none transition-colors duration-300 ${
              scrolled ? 'text-[#5F8D4E]' : 'text-slate-200'
            }`}>
              Manggar Balikpapan
            </span>
          </div>
        </div>

        {/* DESKTOP NAV LINKS (Bright/readable/modern) */}
        <nav className="hidden md:flex items-center gap-1 xl:gap-2 absolute left-1/2 transform -translate-x-1/2">
          {visibleItems.map((item) => {
            const [basePath] = currentPath.split('?');
            const isActive = item.type === 'anchor' 
              ? isHomeActive(item.target_id) 
              : (basePath === `/page/${item.target_id}` || (item.target_id === 'fasilitas' && basePath === '/fasilitas') || (item.target_id === 'berita' && basePath === '/berita') || (item.target_id === 'kkn' && basePath === '/kkn'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item)}
                className={`px-3 py-2 rounded-full text-xs font-black tracking-wide transition-all shrink-0 ${
                  scrolled 
                    ? isActive 
                      ? 'text-[#0b5665] bg-[#0b5665]/10' 
                      : 'text-slate-700 hover:text-[#0b5665] hover:bg-slate-100'
                    : isActive
                      ? 'text-white bg-white/20'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="hidden md:flex items-center space-x-3 shrink-0">
          
          {/* Lapor Tamu Pill (Simkopdes style) */}
          <button
            onClick={() => {
              const [basePath] = currentPath.split('?');
              const isNotHome = basePath !== '/' && basePath !== '/home';
              if (isNotHome) {
                window.location.href = '/#kontak-layanan';
              } else {
                const el = document.getElementById('kontak-layanan');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`px-4.5 py-2.5 rounded-full font-black text-xs transition-all shadow-sm flex items-center space-x-1.5 active:scale-98 ${
              scrolled
                ? 'bg-[#0b5665] hover:bg-[#08424e] text-white'
                : 'bg-white hover:bg-white/95 text-[#0b5665]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Lapor Tamu 24 Jam</span>
          </button>

          {localRole === 'public' ? (
            /* Masuk Button (Simkopdes outline style, bright & readable) */
            <button
              onClick={handleOpenAuth}
              className={`border px-5 py-2.5 rounded-full font-black text-xs transition-all flex items-center space-x-1.5 active:scale-98 ${
                scrolled
                  ? 'border-[#0b5665] text-[#0b5665] hover:bg-[#0b5665]/5'
                  : 'border-white/70 text-white hover:bg-white/10'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              {localRole === 'sekretaris_rt' && (
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  scrolled 
                    ? 'bg-[#0b5665]/10 text-[#0b5665]' 
                    : 'bg-white/15 text-white'
                }`}>
                  <PieChart className="w-3 h-3 text-amber-500" />
                  <span>Sekretaris RT</span>
                </div>
              )}

              {localRole === 'developer' && (
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  scrolled 
                    ? 'bg-[#0b5665]/10 text-[#0b5665]' 
                    : 'bg-white/15 text-white'
                }`}>
                  <CheckCircle2 className="w-3 h-3 text-amber-500" />
                  <span>IT Developer</span>
                </div>
              )}

              <button
                onClick={handleOpenDashboard}
                className={`px-4.5 py-2.5 rounded-full font-black text-xs transition-all border ${
                  scrolled
                    ? 'bg-[#0b5665] hover:bg-[#08424e] text-white border-transparent'
                    : 'bg-white/20 hover:bg-white/30 text-white border-white/20'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={handleLogoutClick}
                className={`p-2.5 rounded-full transition-colors ${
                  scrolled 
                    ? 'text-rose-600 hover:bg-rose-50' 
                    : 'text-rose-250 hover:bg-white/10'
                }`}
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
            className={`p-2.5 rounded-xl transition-all ${
              scrolled 
                ? 'bg-slate-100 text-[#0b5665] hover:bg-slate-200' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROP-DOWN MENU (Bright/readable & modern) */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-6 py-5 space-y-4 animate-fade-in shadow-xl ${
          scrolled 
            ? 'bg-white border-slate-150' 
            : 'bg-[#08424e] border-white/10'
        }`}>
          <nav className="flex flex-col space-y-3">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item)}
                className={`w-full text-left py-2.5 font-bold text-xs ${
                  scrolled ? 'text-slate-800 hover:text-[#0b5665]' : 'text-white/95 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className={`pt-4 border-t flex flex-col space-y-3 ${
            scrolled ? 'border-slate-100' : 'border-white/10'
          }`}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const [basePath] = currentPath.split('?');
                const isNotHome = basePath !== '/' && basePath !== '/home';
                if (isNotHome) {
                  window.location.href = '/#kontak-layanan';
                } else {
                  const el = document.getElementById('kontak-layanan');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`w-full py-3 rounded-full font-black text-xs transition-all shadow-sm text-center flex items-center justify-center space-x-1.5 ${
                scrolled
                  ? 'bg-[#0b5665] text-white hover:bg-[#08424e]'
                  : 'bg-white text-[#0b5665] hover:bg-white/95'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Lapor Tamu 24 Jam</span>
            </button>

            {localRole === 'public' ? (
              <button
                onClick={() => { setMobileMenuOpen(false); handleOpenAuth(); }}
                className={`w-full py-3 rounded-full font-black text-xs transition-all text-center flex items-center justify-center space-x-1.5 border ${
                  scrolled
                    ? 'border-[#0b5665] text-[#0b5665] hover:bg-[#0b5665]/5'
                    : 'border-white/60 text-white hover:bg-white/10'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Login</span>
              </button>
            ) : (
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenDashboard();
                  }}
                  className={`w-full py-3 rounded-full font-black text-xs text-center border ${
                    scrolled
                      ? 'bg-[#0b5665] text-white border-transparent'
                      : 'bg-white/15 text-white border-white/20'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogoutClick(); }}
                  className="w-full py-3 rounded-full bg-rose-600/10 text-rose-500 font-extrabold text-xs text-center border border-rose-500/25"
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
