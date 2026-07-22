import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, NewsPost, ProkerItem, PresensiRecord, TeamMember } from './types/database';
import { SupabaseService, OFFICIAL_TEAM } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginPage } from './components/auth/LoginPage';
import { MahasiswaDashboardPage } from './pages/MahasiswaDashboardPage';
import { DeveloperDashboardPage } from './pages/DeveloperDashboardPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { HeroSection } from './components/landing/HeroSection';
import { AboutSection } from './components/landing/AboutSection';
import { TeamSection } from './components/landing/TeamSection';
import { ProkerSection } from './components/landing/ProkerSection';
import { NewsSection } from './components/landing/NewsSection';
import { GallerySection } from './components/landing/GallerySection';
import { ContactSection } from './components/landing/ContactSection';
import { LoadingSplashScreen } from './components/common/LoadingSplashScreen';

export const App: React.FC = () => {
  // SPLASH SCREEN LOADING STATE FOR SMOOTH PAGE TRANSITION
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);

  // BROWSER PATH ROUTING STATE (/home, /login, /presensi, /admin)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    if (path === '' || path === '/') {
      window.history.replaceState(null, '', '/home');
      return '/home';
    }
    return path;
  });

  // ROLE & AUTH STATE (DEFAULT TO PUBLIC VISITOR)
  const [currentRole, setCurrentRole] = useState<UserRole>('public');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // DATA STATES
  const [newsList, setNewsList] = useState<NewsPost[]>([]);
  const [prokerList, setProkerList] = useState<ProkerItem[]>([]);
  const [presensiList, setPresensiList] = useState<PresensiRecord[]>([]);
  const [teamList] = useState<TeamMember[]>(OFFICIAL_TEAM);

  const [activeSection, setActiveSection] = useState('beranda');

  // CUSTOM PATH NAVIGATION HELPER THAT UPDATES BROWSER URL BAR!
  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // LISTEN TO BROWSER BACK / FORWARD BUTTONS & ENSURE ROOT REDIRECTS TO /home
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '' || path === '/') {
        window.history.replaceState(null, '', '/home');
        setCurrentPath('/home');
      } else {
        setCurrentPath(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // LOAD DYNAMIC DATA FROM SUPABASE ON MOUNT
  useEffect(() => {
    const loadDynamicData = async () => {
      const news = await SupabaseService.fetchNews();
      const proker = await SupabaseService.fetchProker();
      const presensi = await SupabaseService.fetchPresensi();

      setNewsList(news);
      setProkerList(proker);
      setPresensiList(presensi);
    };

    loadDynamicData();
  }, []);

  // SCROLLSPY TO AUTOMATICALLY UPDATE ACTIVE NAVBAR LINK ON SCROLL (ONLY ON LANDING PAGE)
  useEffect(() => {
    if (currentPath !== '/' && currentPath !== '/home') return;

    const sections = ['beranda', 'tentang', 'proker', 'berita', 'tim', 'galeri', 'kontak'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // Offset for header navbar height

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPath]);

  // HANDLERS FOR REALTIME DATA UPDATE WITH SUPABASE
  const handleAddNews = async (newNews: NewsPost) => {
    const updated = await SupabaseService.addNews(newNews);
    setNewsList(updated);
  };

  const handleDeleteNews = async (id: string) => {
    const updated = await SupabaseService.deleteNews(id);
    setNewsList(updated);
  };

  const handleUpdateProker = async (updatedItem: ProkerItem) => {
    const updated = await SupabaseService.updateProker(updatedItem);
    setProkerList(updated);
  };

  const handleAddPresensi = async (newRecord: PresensiRecord) => {
    const updated = await SupabaseService.addPresensi(newRecord);
    setPresensiList(updated);
  };

  // SUCCESSFUL LOGIN WITH NIM & PASSWORD -> NAVIGATE TO /presensi OR /admin PATH!
  const handleLoginSuccess = (
    role: UserRole, 
    profile: UserProfile, 
    redirectTo: 'presensi' | 'dashboard'
  ) => {
    setCurrentRole(role);
    setUserProfile(profile);

    if (role === 'developer') {
      navigateTo('/admin');
    } else {
      navigateTo('/presensi');
    }
  };

  const handleLogout = () => {
    setCurrentRole('public');
    setUserProfile(null);
    navigateTo('/home');
  };

  // --- ROUTING RENDER LOGIC BASED ON URL PATH ---

  // ROUTE 1: /login
  if (currentPath === '/login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => navigateTo('/home')}
      />
    );
  }

  // ROUTE 2: /presensi (PORTAL PRESENSI MAHASISWA)
  if (currentPath === '/presensi') {
    if (!userProfile) {
      // If not logged in, redirect to /login
      navigateTo('/login');
      return null;
    }

    return (
      <MahasiswaDashboardPage
        userProfile={userProfile}
        presensiList={presensiList}
        onAddPresensi={handleAddPresensi}
        onGoToLanding={() => navigateTo('/home')}
        onLogout={handleLogout}
      />
    );
  }

  // ROUTE 3: /admin OR /dashboard (CONTROL PANEL DEVELOPER CMS)
  if (currentPath === '/admin' || currentPath === '/dashboard') {
    if (!userProfile || currentRole !== 'developer') {
      // If not logged in or not Gusti Ihsanuddin (developer), redirect to /login
      navigateTo('/login');
      return null;
    }

    return (
      <DeveloperDashboardPage
        userProfile={userProfile}
        newsList={newsList}
        prokerList={prokerList}
        presensiList={presensiList}
        onAddNews={handleAddNews}
        onDeleteNews={handleDeleteNews}
        onUpdateProker={handleUpdateProker}
        onGoToLanding={() => navigateTo('/home')}
        onLogout={handleLogout}
      />
    );
  }

  // ROUTE 4: DEDICATED FULL-PAGE NEWS DETAIL (/berita/:slug)
  if (currentPath.startsWith('/berita/')) {
    const slug = currentPath.replace('/berita/', '');
    return (
      <NewsDetailPage
        slug={slug}
        newsList={newsList}
        onBackToLanding={() => navigateTo('/home')}
        onNavigateToNews={(newSlug) => navigateTo('/berita/' + newSlug)}
      />
    );
  }

  // ROUTE 5: DEFAULT LANDING PAGE (/home or /)
  return (
    <>
      {showSplashScreen && (
        <LoadingSplashScreen onFinished={() => setShowSplashScreen(false)} />
      )}
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* NAVBAR */}
      <Navbar
        currentRole={currentRole}
        userProfile={userProfile}
        onOpenAuth={() => navigateTo('/login')}
        onOpenPresensi={() => {
          if (currentRole === 'developer') navigateTo('/admin');
          else if (currentRole === 'mahasiswa') navigateTo('/presensi');
          else navigateTo('/login');
        }}
        onOpenDashboard={() => navigateTo('/admin')}
        onLogout={handleLogout}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* MAIN CONTENT LANDING PAGE */}
      <main className="flex-grow">
        <HeroSection
          currentRole={currentRole}
          onOpenPresensi={() => {
            if (currentRole === 'developer') navigateTo('/admin');
            else if (currentRole === 'mahasiswa') navigateTo('/presensi');
            else navigateTo('/login');
          }}
          onOpenDashboard={() => navigateTo('/admin')}
          onOpenAuth={() => navigateTo('/login')}
          newsCount={newsList.length}
          prokerCount={prokerList.length}
        />

        <AboutSection />

        <ProkerSection prokerList={prokerList} />

        <NewsSection
          newsList={newsList}
          currentRole={currentRole}
          onOpenDashboard={() => navigateTo('/admin')}
          onSelectNews={(slug) => navigateTo('/berita/' + slug)}
        />

        <TeamSection team={teamList} />

        <GallerySection />

        <ContactSection />
      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  </>
);
};

export default App;
