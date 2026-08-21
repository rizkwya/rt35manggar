import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, ProkerItem, TeamMember, RTSettings, NavigationItem, RTAnnouncement, NewsPost, RTDemographics, RTPengurus, RTFacility, DevBroadcast } from './types/database';
import { SupabaseService, supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { stripHtml, getPreviewText } from './lib/utils';
import { INITIAL_SETTINGS, INITIAL_NAV_ITEMS } from './lib/initialData';
import { DevBroadcastModal } from './components/admin/DevBroadcastModal';

// Page imports (Clean routing layout)
import { LandingPage } from './react-pages/public/LandingPage';
import { LoginPage } from './react-pages/public/LoginPage';
import { SekretarisRTDashboardPage } from './react-pages/admin/SekretarisRTDashboardPage';
import { DeveloperDashboardPage } from './react-pages/developer/DeveloperDashboardPage';
import { KKNPortalPage } from './react-pages/public/KKNPortalPage';
import { NewsListPage } from './react-pages/public/NewsListPage';
import { FacilitiesPage } from './react-pages/public/FacilitiesPage';

// Safe fetch helper to handle errors without breaking components
const safeFetch = async <T,>(fetchFn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fetchFn();
  } catch (error) {
    console.error('Fetch error:', error);
    return fallback;
  }
};

export const App = () => {
  // ROUTING CONTROLLER
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search;
  });

  // ROLE & AUTH STATE
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('userRole') as UserRole) || 'public';
    }
    return 'public';
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.warn("Failed to parse stored user profile session on init:", e);
          return null;
        }
      }
    }
    return null;
  });

  const [isAppLoading, setIsAppLoading] = useState(true);

  // DATA STATES WITH INSTANT INITIAL FALLBACKS
  const [prokerList, setProkerList] = useState<ProkerItem[]>([]);
  const [kknTeam, setKknTeam] = useState<TeamMember[]>([]);
  const [settings, setSettings] = useState<RTSettings>(INITIAL_SETTINGS);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [announcements, setAnnouncements] = useState<RTAnnouncement[]>([]);
  const [newsList, setNewsList] = useState<NewsPost[]>([]);
  const [demographics, setDemographics] = useState<RTDemographics | null>(null);
  const [pengurusList, setPengurusList] = useState<RTPengurus[]>([]);
  const [facilitiesList, setFacilitiesList] = useState<RTFacility[]>([]);
  const [activeSection, setActiveSection] = useState('beranda');
  const [incomingBroadcast, setIncomingBroadcast] = useState<DevBroadcast | null>(null);

  // TRACK LAST PATHS FOR DASHBOARD <-> PUBLIC PORTAL PERSISTENT HISTORY
  const [lastDashboardPath, setLastDashboardPath] = useState<string>('/admin/dashboard');
  const [lastPublicPath, setLastPublicPath] = useState<string>('/');

  useEffect(() => {
    if (currentPath.startsWith('/admin')) {
      setLastDashboardPath(currentPath);
    } else if (currentPath !== '/login') {
      setLastPublicPath(currentPath);
    }
  }, [currentPath]);

  // INSTANT NAVIGATION HELPER
  const navigateTo = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // LOAD ALL DYNAMIC PORTAL DATA FROM SUPABASE
  useEffect(() => {
    const loadInitialData = async () => {
      setIsAppLoading(true);
      try {
        const [
          prokerData,
          teamData,
          settingsData,
          navData,
          announceData,
          newsData,
          demoData,
          pengurusData,
          facilitiesData
        ] = await Promise.all([
          safeFetch(() => SupabaseService.fetchProker(), []),
          safeFetch(() => SupabaseService.fetchKKNTeam(true), []),
          safeFetch(() => SupabaseService.fetchSettings(), INITIAL_SETTINGS),
          safeFetch(() => SupabaseService.fetchNavItems(), INITIAL_NAV_ITEMS),
          safeFetch(() => SupabaseService.fetchAnnouncements(), []),
          safeFetch(() => SupabaseService.fetchNews(), []),
          safeFetch(() => SupabaseService.fetchDemographics(), null),
          safeFetch(() => SupabaseService.fetchPengurus(), []),
          safeFetch(() => SupabaseService.fetchFacilities(), []),
        ]);

        if (prokerData) setProkerList(prokerData);
        if (teamData) setKknTeam(teamData);
        if (settingsData) setSettings(settingsData);
        if (navData) setNavItems(navData);
        if (announceData) setAnnouncements(announceData);
        if (newsData) setNewsList(newsData);
        if (demoData) setDemographics(demoData);
        if (pengurusData) setPengurusList(pengurusData);
        if (facilitiesData) setFacilitiesList(facilitiesData);
      } finally {
        setIsAppLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // REALTIME DATABASE CHANGE LISTENERS (REALTIME SYNC WITHOUT REFRESH)
  useEffect(() => {
    const settingsChannel = supabase
      .channel('realtime-settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_settings' },
        (payload) => {
          if (payload.new) {
            const row = payload.new as any;
            let maps_coordinate = '';
            let syarat_surat = '';
            let kontak_darurat = '';
            let emergency_title = row.emergency_title || '';
            let emergency_description = '';
            
            let vision = '';
            let mission = '';
            let history = '';
            let boundary_north = '';
            let boundary_south = '';
            let boundary_east = '';
            let boundary_west = '';
            let kk_list = [];
            let messages_list = [];

            if (row.emergency_description) {
              try {
                const extra = JSON.parse(row.emergency_description);
                maps_coordinate = extra.maps_coordinate || '';
                syarat_surat = extra.syarat_surat || '';
                kontak_darurat = extra.kontak_darurat || '';
                emergency_description = extra.emergency_description || '';
                
                if (extra.vision) vision = extra.vision;
                if (extra.mission) mission = extra.mission;
                if (extra.history) history = extra.history;
                if (extra.boundary_north) boundary_north = extra.boundary_north;
                if (extra.boundary_south) boundary_south = extra.boundary_south;
                if (extra.boundary_east) boundary_east = extra.boundary_east;
                if (extra.boundary_west) boundary_west = extra.boundary_west;
                if (extra.kk_list) kk_list = extra.kk_list;
                if (extra.messages_list) messages_list = extra.messages_list;
              } catch (jsonErr) {
                console.warn('Failed to parse emergency_description as JSON:', jsonErr);
                emergency_description = row.emergency_description;
              }
            }
            setSettings({
              ...row,
              emergency_title,
              emergency_description,
              maps_coordinate,
              syarat_surat,
              kontak_darurat,
              vision,
              mission,
              history,
              boundary_north,
              boundary_south,
              boundary_east,
              boundary_west,
              kk_list,
              messages_list
            });
          }
        }
      )
      .subscribe();

    const newsChannel = supabase
      .channel('realtime-news')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        async () => {
          const updatedNews = await SupabaseService.fetchNews();
          setNewsList(updatedNews);
        }
      )
      .subscribe();

    const announceChannel = supabase
      .channel('realtime-announcements')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_announcements' },
        async () => {
          const updatedAnnounce = await SupabaseService.fetchAnnouncements();
          setAnnouncements(updatedAnnounce);
        }
      )
      .subscribe();

    const demoChannel = supabase
      .channel('realtime-demographics')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_demographics' },
        async () => {
          const updatedDemo = await SupabaseService.fetchDemographics();
          setDemographics(updatedDemo);
        }
      )
      .subscribe();

    const usersChannel = supabase
      .channel('realtime-users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        async (payload) => {
          if (payload.new) {
            const updatedUser = payload.new as any;
            setUserProfile(currentUser => {
              if (currentUser && (
                currentUser.id === updatedUser.id || 
                currentUser.email.toLowerCase() === updatedUser.email.toLowerCase()
              )) {
                const finalProfile = {
                  ...currentUser,
                  full_name: updatedUser.full_name,
                  avatar_url: updatedUser.avatar_url || '/logo.png'
                };
                localStorage.setItem('userProfile', JSON.stringify(finalProfile));
                return finalProfile;
              }
              return currentUser;
            });
          }

          // Realtime KKN Team Sync
          try {
            const updatedTeam = await SupabaseService.fetchKKNTeam(true);
            setKknTeam(updatedTeam);
          } catch (e) {
            console.warn('Realtime KKN team sync failed:', e);
          }
        }
      )
    const kknTeamChannel = supabase
      .channel('realtime-kkn-team')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kkn_team' },
        async () => {
          try {
            const updatedTeam = await SupabaseService.fetchKKNTeam(true);
            setKknTeam(updatedTeam);
          } catch (e) {
            console.warn('Realtime KKN team sync failed:', e);
          }
        }
      )
      .subscribe();

    // Realtime Global Developer Broadcast Receiver
    const broadcastChannel = supabase
      .channel('global-dev-broadcast-channel')
      .on('broadcast', { event: 'dev_broadcast' }, (payload) => {
        if (payload && payload.payload) {
          setIncomingBroadcast(payload.payload as DevBroadcast);
        }
      })
      .on('broadcast', { event: 'dev_broadcast_clear' }, () => {
        setIncomingBroadcast(null);
      })
      .subscribe();

    // Check on mount for any active broadcast not yet dismissed
    try {
      SupabaseService.fetchActiveDevBroadcast().then((active) => {
        if (active) {
          try {
            const lastDismissed = localStorage.getItem('rt35_last_dismissed_broadcast');
            if (lastDismissed !== active.id) {
              setIncomingBroadcast(active);
            }
          } catch (e) {
            setIncomingBroadcast(active);
          }
        }
      });
    } catch (e) {}

    return () => {
      supabase.removeChannel(settingsChannel);
      supabase.removeChannel(newsChannel);
      supabase.removeChannel(announceChannel);
      supabase.removeChannel(demoChannel);
      supabase.removeChannel(usersChannel);
      supabase.removeChannel(kknTeamChannel);
      supabase.removeChannel(broadcastChannel);
    };
  }, []);

  // FAIL-SAFE BACKGROUND POLLING (PULLS UPDATES EVERY 8 SECONDS FOR PUBLIC/MOBILE VIEWS)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [settingsData, newsData, announceData, demoData, kknTeamData] = await Promise.all([
          SupabaseService.fetchSettings(),
          SupabaseService.fetchNews(),
          SupabaseService.fetchAnnouncements(),
          SupabaseService.fetchDemographics(),
          SupabaseService.fetchKKNTeam(true),
        ]);
        if (settingsData) setSettings(settingsData);
        if (newsData) setNewsList(newsData);
        if (announceData) setAnnouncements(announceData);
        if (demoData) setDemographics(demoData);
        if (kknTeamData) setKknTeam(kknTeamData);
      } catch (err) {
        console.warn('Fail-safe polling error:', err);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // SCROLLSPY TO UPDATE NAVBAR ACTIVE TAB
  useEffect(() => {
    if (currentPath !== '/') return;

    const sections = ['beranda', 'statistik-warga', 'pengumuman-rt', 'pengurus-rt', 'kkn-rt35', 'kontak-layanan'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

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

  const handleUpdateProker = async (item: ProkerItem) => {
    const updated = await SupabaseService.updateProker(item);
    setProkerList(updated);
  };

  // SUCCESSFUL LOGIN HANDLER -> REDIRECT TO DASHBOARD BASED ON ROLE
  const handleLoginSuccess = (
    role: UserRole, 
    profile: UserProfile, 
    _redirectTo?: 'dashboard'
  ) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', role);
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }

    setCurrentRole(role);
    setUserProfile(profile);

    if (role === 'sekretaris_rt') {
      navigateTo('/admin/dashboard');
    } else if (role === 'developer') {
      navigateTo('/admin/developer');
    } else {
      navigateTo('/');
    }
  };

  const handleLogout = () => {
    setCurrentRole('public');
    setUserProfile(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userProfile');
      window.location.href = '/';
    }
  };

  // ROUTER CONTROLLER MAP
  const renderRoute = () => {
    const [basePath, queryString] = currentPath.split('?');

    if (basePath.startsWith('/page/')) {
      const slug = basePath.substring(6);
      const pageItem = navItems.find((item) => item.target_id === slug && item.type === 'custom_page');
      if (pageItem) {
        // Parse structured page content
        let bannerUrl = '';
        let subtitle = '';
        let body = pageItem.custom_content || '';
        let gridItems: { title: string; description: string; image_url?: string; badge?: string; summary?: string; created_at?: string; }[] = [];

        if (pageItem.custom_content?.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(pageItem.custom_content);
            bannerUrl = parsed.banner_url || '';
            subtitle = parsed.subtitle || '';
            body = parsed.body || '';
            gridItems = parsed.grid_items || [];
          } catch (e) {
            console.warn("Failed to parse page content JSON:", e);
          }
        }

        const sortedGridItems = [...gridItems].sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });

        const urlParams = new URLSearchParams(queryString || '');
        const itemSlug = urlParams.get('slug');
        
        const generateSlug = (text: string) => {
          return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
        };

        const selectedGridItem = itemSlug 
          ? gridItems.find(item => generateSlug(item.title) === itemSlug)
          : null;

        if (selectedGridItem) {
          return (
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in space-y-6">
              {/* Back Button */}
              <div>
                <button 
                  onClick={() => navigateTo(`/page/${slug}`)}
                  className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors group bg-white border border-slate-200 px-4.5 py-2.5 rounded-xl shadow-sm hover:scale-[1.02]"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Kembali ke Halaman {pageItem.label}</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-md space-y-6">
                <div className="border-b border-slate-100 pb-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedGridItem.badge && (
                      <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-md bg-[#1E4D6B]/15 text-[#1E4D6B] border border-[#1E4D6B]/25">
                        {selectedGridItem.badge}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {selectedGridItem.title}
                  </h1>
                </div>

                {selectedGridItem.image_url ? (
                  <div className="w-full rounded-2xl overflow-hidden border border-slate-150 shadow-sm relative bg-slate-50 flex justify-center">
                    <img 
                      src={selectedGridItem.image_url} 
                      alt={selectedGridItem.title} 
                      className="max-w-full max-h-[600px] object-contain w-auto h-auto rounded-2xl"
                    />
                  </div>
                ) : (
                  <div className="w-full h-52 sm:h-72 rounded-2xl overflow-hidden shadow-sm border border-slate-150 bg-slate-50 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-slate-400 opacity-45" />
                  </div>
                )}

                <div 
                  className="text-slate-700 text-sm sm:text-base leading-relaxed font-semibold pt-2 tiptap-content"
                  dangerouslySetInnerHTML={{ __html: selectedGridItem.description }}
                />
              </div>
            </div>
          );
        }

        return (
          <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in space-y-8">
            {/* Back Button */}
            <div>
              <button 
                onClick={() => navigateTo('/')}
                className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors group bg-white border border-slate-200 px-4.5 py-2.5 rounded-xl shadow-sm hover:scale-[1.02]"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Kembali ke Beranda Utama</span>
              </button>
            </div>

            {/* Banner Image */}
            {bannerUrl && (
              <div className="w-full h-48 sm:h-72 rounded-3xl overflow-hidden shadow-md relative border border-slate-200">
                <img 
                  src={bannerUrl} 
                  alt={pageItem.label} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#85A389] bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    Transparansi RT 35
                  </span>
                  <h1 className="text-xl sm:text-3xl font-black mt-2 leading-tight">
                    {pageItem.label}
                  </h1>
                </div>
              </div>
            )}

            {/* Main Card (Info & Body Text) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-md space-y-6">
              {!bannerUrl && (
                <div className="border-b border-slate-100 pb-5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#85A389] bg-[#85A389]/10 px-3 py-1 rounded-full">
                    Transparansi RT 35
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-955 mt-3 leading-tight">
                    {pageItem.label}
                  </h1>
                </div>
              )}

              {subtitle && (
                <p className="text-sm sm:text-base text-slate-500 font-extrabold italic leading-relaxed border-l-4 border-[#85A389] pl-4">
                  {subtitle}
                </p>
              )}

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-semibold leading-relaxed">
                {body || 'Belum ada deskripsi konten ditulis.'}
              </div>
            </div>

            {/* Cards Grid Section */}
            {sortedGridItems.length > 0 && (
              <div className="space-y-6 pt-4">
                <h3 className="text-lg font-black text-slate-900 border-l-4 border-[#1E4D6B] pl-3">
                  Galeri Kegiatan & Informasi Terkait
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedGridItems.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => navigateTo(`/page/${slug}?slug=${generateSlug(item.title)}`)}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer group"
                    >
                      {item.image_url ? (
                        <div className="h-44 w-full overflow-hidden border-b border-slate-100 relative bg-slate-50">
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="h-44 w-full bg-slate-50 flex items-center justify-center relative border-b border-slate-100">
                          <BookOpen className="w-10 h-10 text-slate-400 opacity-40 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      )}
                      
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="text-base font-black text-slate-900 leading-snug group-hover:text-slate-700 transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-bold">
                            {new Date(item.created_at || new Date().toISOString()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }
    }

    switch (basePath) {
      case '/login':
      case '/admin/login':
        if (userProfile && currentRole !== 'public') {
          if (currentRole === 'sekretaris_rt') {
            return (
              <SekretarisRTDashboardPage 
                user={userProfile} 
                onLogout={handleLogout} 
                onUserProfileUpdate={setUserProfile}
                activeTab="demografis"
                onChangeTab={navigateTo}
                settings={settings}
                onSettingsUpdate={setSettings}
                lastPublicPath={lastPublicPath}
                onNavItemsUpdate={setNavItems}
                newsList={newsList}
                onUpdateNews={setNewsList}
                demographics={demographics}
                onUpdateDemographics={setDemographics}
                pengurusList={pengurusList}
                onUpdatePengurusList={setPengurusList}
                announcements={announcements}
                onUpdateAnnouncements={setAnnouncements}
                kknTeam={kknTeam}
                onUpdateKknTeam={setKknTeam}
                prokerList={prokerList}
                onUpdateProkerList={setProkerList}
                navItems={navItems}
                facilitiesList={facilitiesList}
                onUpdateFacilitiesList={setFacilitiesList}
              />
            );
          }
          if (currentRole === 'developer') return <DeveloperDashboardPage userProfile={userProfile} newsList={newsList} prokerList={prokerList} onAddNews={async () => []} onDeleteNews={async () => []} onUpdateProker={handleUpdateProker} onGoToLanding={() => { window.location.href = '/'; }} onLogout={handleLogout} />;
          return <SekretarisRTDashboardPage 
            user={userProfile} 
            onLogout={handleLogout} 
            onUserProfileUpdate={setUserProfile}
            activeTab="demografis"
            onChangeTab={navigateTo}
            settings={settings}
            onSettingsUpdate={setSettings}
            lastPublicPath={lastPublicPath}
            onNavItemsUpdate={setNavItems}
            newsList={newsList}
            onUpdateNews={setNewsList}
            demographics={demographics}
            onUpdateDemographics={setDemographics}
            pengurusList={pengurusList}
            onUpdatePengurusList={setPengurusList}
            announcements={announcements}
            onUpdateAnnouncements={setAnnouncements}
            kknTeam={kknTeam}
            onUpdateKknTeam={setKknTeam}
            prokerList={prokerList}
            onUpdateProkerList={setProkerList}
            navItems={navItems}
            facilitiesList={facilitiesList}
            onUpdateFacilitiesList={setFacilitiesList}
          />;
        }
        return <LoginPage onLoginSuccess={handleLoginSuccess} onBackToHome={() => navigateTo(lastPublicPath)} />;

      case '/admin/dashboard':
      case '/admin/demografis':
      case '/admin/pengumuman':
      case '/admin/pengurus':
      case '/admin/kegiatan-warga':
      case '/admin/kkn-team':
      case '/admin/kkn-proker':
      case '/admin/settings':
      case '/admin/menu-halaman':
      case '/admin/fasilitas':
      case '/admin/berita':
      case '/admin/aspirasi':
      case '/admin-rt':
      case '/admin/orders':
        if (!userProfile || (currentRole !== 'sekretaris_rt' && currentRole !== 'developer')) {
          return <LoginPage onLoginSuccess={handleLoginSuccess} onBackToHome={() => navigateTo(lastPublicPath)} />;
        }
        
        let dashboardTab: 'demografis' | 'pengumuman' | 'pengurus' | 'portal_settings' | 'kegiatan_warga' | 'kkn_team' | 'kkn_proker' | 'menu_navigation' | 'fasilitas' | 'berita' | 'aspirasi' = 'demografis';
        if (basePath === '/admin/pengumuman') dashboardTab = 'pengumuman';
        else if (basePath === '/admin/pengurus') dashboardTab = 'pengurus';
        else if (basePath === '/admin/settings') dashboardTab = 'portal_settings';
        else if (basePath === '/admin/kegiatan-warga') dashboardTab = 'kegiatan_warga';
        else if (basePath === '/admin/kkn-team') dashboardTab = 'kkn_team';
        else if (basePath === '/admin/kkn-proker') dashboardTab = 'kkn_proker';
        else if (basePath === '/admin/menu-halaman') dashboardTab = 'menu_navigation';
        else if (basePath === '/admin/fasilitas') dashboardTab = 'fasilitas';
        else if (basePath === '/admin/berita') dashboardTab = 'berita';
        else if (basePath === '/admin/aspirasi') dashboardTab = 'aspirasi';

        return (
          <SekretarisRTDashboardPage 
            user={userProfile} 
            onLogout={handleLogout} 
            onUserProfileUpdate={setUserProfile}
            activeTab={dashboardTab}
            onChangeTab={navigateTo}
            settings={settings}
            onSettingsUpdate={setSettings}
            lastPublicPath={lastPublicPath}
            onNavItemsUpdate={setNavItems}
            newsList={newsList}
            onUpdateNews={setNewsList}
            demographics={demographics}
            onUpdateDemographics={setDemographics}
            pengurusList={pengurusList}
            onUpdatePengurusList={setPengurusList}
            announcements={announcements}
            onUpdateAnnouncements={setAnnouncements}
            kknTeam={kknTeam}
            onUpdateKknTeam={setKknTeam}
            prokerList={prokerList}
            onUpdateProkerList={setProkerList}
            navItems={navItems}
            facilitiesList={facilitiesList}
            onUpdateFacilitiesList={setFacilitiesList}
          />
        );

      case '/admin/developer':
      case '/admin':
        if (!userProfile || currentRole !== 'developer') {
          return <LoginPage onLoginSuccess={handleLoginSuccess} onBackToHome={() => navigateTo(lastPublicPath)} />;
        }
        return (
          <DeveloperDashboardPage
            userProfile={userProfile}
            newsList={[]}
            prokerList={prokerList}
            onAddNews={async () => []}
            onDeleteNews={async () => []}
            onUpdateProker={handleUpdateProker}
            onGoToLanding={() => navigateTo(lastPublicPath)}
            onLogout={handleLogout}
          />
        );

      case '/berita':
        return (
          <NewsListPage
            newsList={newsList}
            onBackToHome={() => navigateTo(lastPublicPath)}
          />
        );

      case '/kkn':
        return (
          <KKNPortalPage
            prokerList={prokerList}
            kknTeam={kknTeam}
            onBackToHome={() => navigateTo(lastPublicPath)}
          />
        );

      case '/fasilitas':
        return (
          <FacilitiesPage
            onGoToLanding={() => navigateTo(lastPublicPath)}
            settings={settings}
            facilities={facilitiesList}
          />
        );


      case '/':
      default:
        return (
          <LandingPage
            currentRole={currentRole}
            navigateTo={navigateTo}
            settings={settings}
            navItems={navItems}
            pengurusList={pengurusList}
            onSettingsUpdate={setSettings}
            defaultFormTab={new URLSearchParams(window.location.search).get('tab') === 'wajib_lapor' ? 'wajib_lapor' : undefined}
            onClearDefaultFormTab={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('tab');
              window.history.replaceState(null, '', url.pathname + url.search + url.hash);
            }}
          />
        );
    }
  };

  if (isAppLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-[#85A389] selection:text-white">

      
      {/* TOP NAVBAR */}
      {!(currentPath === '/login' || currentPath.startsWith('/admin')) && (
        <Navbar
          currentRole={currentRole}
          userProfile={userProfile}
          onOpenAuth={() => { window.location.href = '/login'; }}
          onOpenDashboard={() => {
            window.location.href = lastDashboardPath;
          }}
          onLogout={handleLogout}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          navItems={navItems}
        />
      )}

      {/* MAIN CONTENT ROUTED */}
      <main className="flex-grow">
        {renderRoute()}
      </main>

      {/* FOOTER */}
      {!(currentPath === '/login' || currentPath.startsWith('/admin')) && (
        <Footer settings={settings} />
      )}

      {/* GLOBAL DEVELOPER BROADCAST NOTIFICATION POPUP */}
      {incomingBroadcast && (
        <DevBroadcastModal
          broadcast={incomingBroadcast}
          onClose={() => {
            try {
              localStorage.setItem('rt35_last_dismissed_broadcast', incomingBroadcast.id);
            } catch (e) {}
            setIncomingBroadcast(null);
          }}
        />
      )}

    </div>
  );
};

export default App;
