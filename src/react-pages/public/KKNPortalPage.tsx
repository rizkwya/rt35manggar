import React from 'react';
import { CheckCircle2, GraduationCap, Clock, Award, ArrowLeft, ArrowRight, MapPin, Briefcase, ChevronLeft, ChevronRight, Home, Users } from 'lucide-react';
import { ProkerItem, TeamMember, RTSettings } from '../../types/database';
import { SupabaseService, supabase } from '../../lib/supabase';

interface KKNPortalPageProps {
  prokerList: ProkerItem[];
  kknTeam: TeamMember[];
  settings?: RTSettings;
  onBackToHome: () => void;
}

export const KKNPortalPage: React.FC<KKNPortalPageProps> = ({ prokerList: initialProker, kknTeam: initialTeam, settings, onBackToHome }) => {
  const [localKknTeam, setLocalKknTeam] = React.useState<TeamMember[]>([]);
  const [localProkerList, setLocalProkerList] = React.useState<ProkerItem[]>([]);
  const [localSettings, setLocalSettings] = React.useState<RTSettings | undefined>(settings);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedProker, setSelectedProker] = React.useState<ProkerItem | null>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);

  // Proker horizontal slider auto-swipe & active dot state
  const [prokerActiveDot, setProkerActiveDot] = React.useState(0);
  const [isProkerHovered, setIsProkerHovered] = React.useState(false);
  const [cardsPerSlide, setCardsPerSlide] = React.useState(3);
  const prokerScrollRef = React.useRef<HTMLDivElement>(null);

  // Swipe gesture touch state hooks
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const minSwipeDistance = 50;

  // Track responsive cards per slide
  React.useEffect(() => {
    const updateCardsPerSlide = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 768) {
        setCardsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(3);
      }
    };
    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(localProkerList.length / cardsPerSlide));

  const handleProkerScroll = () => {
    const el = prokerScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 5) {
      setProkerActiveDot(0);
      return;
    }
    const ratio = el.scrollLeft / maxScroll;
    const currentSlide = Math.min(totalSlides - 1, Math.max(0, Math.round(ratio * (totalSlides - 1))));
    setProkerActiveDot(currentSlide);
  };

  const scrollToProkerSlide = (slideIdx: number) => {
    const el = prokerScrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (totalSlides <= 1 || maxScroll <= 0) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      const targetScroll = (slideIdx / (totalSlides - 1)) * maxScroll;
      el.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
    setProkerActiveDot(slideIdx);
  };

  // Auto-swipe horizontal carousel per slide every 4.5 seconds
  React.useEffect(() => {
    if (totalSlides <= 1 || isProkerHovered) return;
    const timer = setInterval(() => {
      setProkerActiveDot((prev) => {
        const nextSlide = (prev + 1) % totalSlides;
        scrollToProkerSlide(nextSlide);
        return nextSlide;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [totalSlides, isProkerHovered]);

  React.useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  React.useEffect(() => {
    const fetchFreshData = async () => {
      setIsLoading(true);
      try {
        const [freshTeam, freshProker, freshSettings] = await Promise.all([
          SupabaseService.fetchKKNTeam(true),
          SupabaseService.fetchProker(),
          SupabaseService.fetchSettings()
        ]);
        if (freshTeam) setLocalKknTeam(freshTeam);
        if (freshProker) setLocalProkerList(freshProker);
        if (freshSettings) setLocalSettings(freshSettings);
      } catch (err) {
        console.warn('Failed to fetch fresh data on mount:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFreshData();

    const teamChannel = supabase
      .channel('realtime-kkn-public-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kkn_team' },
        async () => {
          const updated = await SupabaseService.fetchKKNTeam(true);
          setLocalKknTeam(updated);
        }
      )
      .subscribe();

    const prokerChannel = supabase
      .channel('realtime-proker-public-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'proker' },
        async () => {
          const updated = await SupabaseService.fetchProker();
          setLocalProkerList(updated);
        }
      )
      .subscribe();

    const settingsChannel = supabase
      .channel('realtime-settings-kkn-portal-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_settings' },
        async () => {
          const updated = await SupabaseService.fetchSettings();
          if (updated) setLocalSettings(updated);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(teamChannel);
      supabase.removeChannel(prokerChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNextMember();
    }
    if (isRightSwipe) {
      handlePrevMember();
    }
  };

  // Auto-slide effect for KKN Team (every 4 seconds)
  React.useEffect(() => {
    if (localKknTeam.length === 0 || !isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % localKknTeam.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [localKknTeam, isAutoPlaying]);

  const handleNextMember = () => {
    if (localKknTeam.length === 0) return;
    setActiveIdx((prev) => (prev + 1) % localKknTeam.length);
    setIsAutoPlaying(false); // Pause autoplay on manual interaction
  };

  const handlePrevMember = () => {
    if (localKknTeam.length === 0) return;
    setActiveIdx((prev) => (prev - 1 + localKknTeam.length) % localKknTeam.length);
    setIsAutoPlaying(false); // Pause autoplay on manual interaction
  };

  // Sync proker from query param slug
  React.useEffect(() => {
    const checkProkerParam = () => {
      const params = new URLSearchParams(window.location.search);
      const prokerSlug = params.get('proker');
      if (prokerSlug && localProkerList.length > 0) {
        const generateSlug = (text: string) => {
          return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
        };
        const found = localProkerList.find(p => generateSlug(p.title) === prokerSlug);
        if (found) {
          setSelectedProker(found);
          window.scrollTo({ top: 0, behavior: 'instant' });
          return;
        }
      }
      setSelectedProker(null);
    };

    checkProkerParam();
    window.addEventListener('popstate', checkProkerParam);
    return () => window.removeEventListener('popstate', checkProkerParam);
  }, [localProkerList]);

  const handleSelectProker = (proker: ProkerItem | null) => {
    const generateSlug = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    };

    if (proker) {
      window.history.pushState(null, '', `/kkn?proker=${generateSlug(proker.title)}`);
    } else {
      window.history.pushState(null, '', '/kkn');
    }
    window.dispatchEvent(new Event('popstate'));
    setSelectedProker(proker);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4 pt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0b5665]"></div>
        <p className="text-xs font-bold text-slate-450 animate-pulse">Menghubungkan ke pusat data KKN RT 35...</p>
      </div>
    );
  }

  if (selectedProker) {
    // FULL DETAIL PAGE VIEW (Clean & modern, matching the reference images)
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
          
          {/* Back Button */}
          <div>
            <button 
              onClick={() => handleSelectProker(null)}
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#0b5665] hover:text-[#08424e] transition-colors group bg-white border border-slate-200 px-5 py-3 rounded-full shadow-sm hover:scale-[1.02] active:scale-98"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Kembali ke Portal KKN</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: MAIN ARTICLE DETAIL (8 Columns) */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
              
              {/* Category & Date */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#0b5665]/10 text-[#0b5665] border border-[#0b5665]/20">
                    {selectedProker.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
                  {selectedProker.title}
                </h1>
                <div className="text-xs text-slate-400 font-bold flex items-center space-x-1 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target Selesai: {selectedProker.target_date}</span>
                </div>
              </div>

              {/* Cover Image */}
              {selectedProker.image_url ? (
                <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative bg-slate-50 flex justify-center max-h-[500px]">
                  <img 
                    src={selectedProker.image_url} 
                    alt={selectedProker.title} 
                    className="w-full object-cover rounded-2xl max-h-[500px]"
                  />
                </div>
              ) : (
                <div className="w-full h-52 sm:h-72 rounded-2xl overflow-hidden shadow-sm border border-slate-150 bg-slate-50 flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-[#0b5665] opacity-25" />
                </div>
              )}

              {/* Long Description Body */}
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                {selectedProker.description || (
                  <p className="italic text-slate-400">Belum ada rincian deskripsi program kerja yang ditulis.</p>
                )}
              </div>
            </div>

            {/* RIGHT: COMPANION SIDEBAR (4 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Capaian Progress Card */}
              <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-100 pb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0b5665]" />
                  <span>Progress Capaian Kerja</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-slate-500">Capaian Proker:</span>
                    <span className="text-[#0b5665]">{selectedProker.progress_percent}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="h-full rounded-full bg-[#0b5665] transition-all duration-500"
                      style={{ width: `${selectedProker.progress_percent}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-bold text-slate-500 border-t border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">PJ Kegiatan</span>
                    <p className="text-slate-800 truncate">{selectedProker.pic_name}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">Status</span>
                    <p className={`font-black uppercase text-[10px] ${
                      selectedProker.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>{selectedProker.status}</p>
                  </div>
                </div>
              </div>

              {/* Other Prokers Quick Nav */}
              <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-l-2 border-[#0b5665] pl-3">
                  Program KKN Lainnya
                </h3>
                <ul className="space-y-3 text-xs font-semibold">
                  {localProkerList
                    .filter((p: any) => p.id !== selectedProker.id)
                    .slice(0, 4)
                    .map((proker: any) => (
                      <li key={proker.id} className="border-b border-slate-100 pb-2.5 last:border-b-0 last:pb-0">
                        <button 
                          onClick={() => handleSelectProker(proker)} 
                          className="text-left text-slate-600 hover:text-[#0b5665] transition-colors font-bold block"
                        >
                          <span className="text-[9px] uppercase tracking-wider block text-slate-400 mb-0.5">{proker.category}</span>
                          <span className="line-clamp-2 leading-snug">{proker.title}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-[#0b5665] selection:text-white">
      
      {/* 1. HERO BANNER - CLEAN FULL GROUP PHOTO ONLY (NO CUTOUT OVERLAYS) */}
      <section className="relative min-h-[640px] lg:min-h-[760px] flex flex-col justify-center items-center py-24 sm:py-32 overflow-hidden text-white bg-slate-50">
        
        {/* Absolute Background Photo - Offset by wave height at the bottom to prevent cropping */}
        <div 
          className="absolute inset-0 bottom-[30px] sm:bottom-[45px] z-10"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(11, 86, 101, 0.42) 0%, rgba(6, 48, 57, 0.65) 100%), url("/hero_sawah.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 82%',
            backgroundAttachment: 'scroll'
          }}
        />

        {/* Glowing auras */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none z-10" />

        {/* Outer container of the banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col justify-center items-center text-center">
          
          {/* CENTERED TEXT & ACTION CONTROLS */}
          <div className="max-w-3xl mx-auto text-center space-y-8">
            
            {/* HERO TITLE */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-sm">
              KKN Kelompok Manggar 2 <br />
              <span className="text-amber-400">Universitas Mulia</span>
            </h1>

            {/* SUBTITLE */}
            <p className="text-white/85 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-bold drop-shadow-sm">
              Sistem Informasi Portal RT 35 Manggar ini dirancang, dibangun, dan dihibahkan oleh mahasiswa Kuliah Kerja Nyata (KKN) Kelompok Manggar 2 Universitas Mulia Balikpapan sebagai program kerja utama digitalisasi pelayanan administrasi kependudukan.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={onBackToHome}
                className="px-6 py-3 rounded-full bg-white text-slate-900 font-extrabold text-xs hover:bg-slate-100 transition-all shadow-md flex items-center space-x-2 active:scale-95"
              >
                <Home className="w-4 h-4 text-[#0b5665]" />
                <span>Beranda Portal RT</span>
              </button>
            </div>

          </div>
        </div>

        {/* Dynamic wave SVG transition - Placed in the offset area below the photo */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-20">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[30px] sm:h-[45px]">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-slate-50"></path>
          </svg>
        </div>
      </section>

      {/* DETAILED INFO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        {/* STATS HIGHLIGHT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-[#0b5665]/10 text-[#0b5665] border border-[#0b5665]/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Lokasi Posko</p>
              <h4 className="text-sm sm:text-base font-black text-slate-800">
                {localSettings?.kkn_posko_location || settings?.kkn_posko_location || 'RT 35 Kel. Manggar'}
              </h4>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Jumlah Proker</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900">{localProkerList.length} Program</h4>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-black uppercase tracking-wider">Anggota Tim</p>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900">{localKknTeam.length} Mahasiswa</h4>
            </div>
          </div>
        </div>

        {/* SHOWCASE PROKER SECTION: Reference Style */}
        <div className="space-y-8">
          
          {/* Header Section from Reference */}
          <div className="text-center max-w-3xl mx-auto space-y-2.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0b5665] tracking-tight">
              Warta Program Kerja KKN
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Dapatkan informasi terbaru seputar program kerja dan pengabdian masyarakat KKN Kelompok Manggar 2 di RT 35 Manggar.
            </p>
          </div>

          {/* Full-width Pill Button from Reference */}
          <div className="max-w-4xl mx-auto w-full px-2">
            <div className="w-full py-2.5 px-6 rounded-full bg-[#0b5665] hover:bg-[#08424e] text-white font-bold text-xs sm:text-sm text-center shadow-sm transition-all duration-200 select-none">
              Daftar Program Kerja & Dokumentasi Aksi
            </div>
          </div>

          {/* Cards Showcase: Strict 1-Row Horizontal Swipe Carousel on All Devices */}
          {localProkerList.length === 0 ? (
            <div className="text-center py-16 text-slate-400 font-bold text-xs bg-white rounded-3xl border border-slate-200 max-w-4xl mx-auto">
              Belum ada program kerja terdaftar.
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Swipeable 1-Row Container across Desktop & Mobile */}
              <div
                ref={prokerScrollRef}
                onScroll={handleProkerScroll}
                onMouseEnter={() => setIsProkerHovered(true)}
                onMouseLeave={() => setIsProkerHovered(false)}
                onTouchStart={() => setIsProkerHovered(true)}
                onTouchEnd={() => setIsProkerHovered(false)}
                className="flex flex-nowrap gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-2 px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {localProkerList.map((item: any, itemIdx: number) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectProker(item)}
                    className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#0b5665]/40 transition-all duration-200 flex flex-col justify-between p-4 sm:p-5 w-[84vw] sm:w-[320px] md:w-[340px] lg:w-[calc(33.333%-14px)] shrink-0 snap-start cursor-pointer"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative aspect-[16/10] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 mb-3.5">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                            <Briefcase className="w-9 h-9 opacity-30 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1.5">Dokumentasi Proker</span>
                          </div>
                        )}

                        {/* Floating Status Badge */}
                        <div className="absolute top-2.5 right-2.5 pointer-events-none">
                          <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-xs border ${
                            item.status === 'Completed'
                              ? 'bg-emerald-500 text-white border-emerald-600'
                              : item.status === 'In Progress'
                                ? 'bg-amber-500 text-white border-amber-600'
                                : 'bg-slate-800 text-white border-slate-900'
                          }`}>
                            {item.status === 'Completed' ? '✓ Selesai' : item.status === 'In Progress' ? '● Berjalan' : '○ Rencana'}
                          </span>
                        </div>
                      </div>

                      {/* Title matching reference */}
                      <h3 className="text-[#0b5665] font-black text-sm sm:text-[15px] leading-snug line-clamp-2 group-hover:underline">
                        {item.title}
                      </h3>

                      {/* Description matching reference */}
                      <p className="text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed line-clamp-3 mt-1.5 mb-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer with Date & Progress */}
                    <div className="pt-2 border-t border-slate-150/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-700 font-extrabold text-xs">
                          {item.target_date || 'Agustus 2026'}
                        </span>
                        <span className="text-[11px] font-black text-[#0b5665]">
                          {item.progress_percent}%
                        </span>
                      </div>
                      
                      {/* Mini Capaian Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-150 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.progress_percent === 100
                              ? 'bg-emerald-500'
                              : item.progress_percent >= 50
                                ? 'bg-[#0b5665]'
                                : 'bg-amber-500'
                          }`}
                          style={{ width: `${item.progress_percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Interactive Dot Indicators (Exact match to total slides) */}
              {totalSlides > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-4">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => scrollToProkerSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        prokerActiveDot === idx
                          ? 'w-6 bg-[#0b5665]'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Lihat slide ke-${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

          {/* 3D INTERACTIVE TEAM SHOWCASE SECTION */}
          <div id="tim-mahasiswa" className="space-y-12 scroll-mt-20">
            <div className="border-b border-slate-200 pb-4 space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" />
                <span>Tim Mahasiswa KKN Kelompok Manggar 2 Universitas Mulia</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-bold">
                Kolaborasi mahasiswa lintas program studi Universitas Mulia dalam program pengabdian masyarakat. Klik salah satu anggota untuk menyorot profil 3D mereka!
              </p>
            </div>

            {/* Interactive Spotlight Layout */}
            {localKknTeam.length > 0 && (() => {
              const activeMember = localKknTeam[activeIdx] || localKknTeam[0];
              const len = localKknTeam.length;
              
              // Calculate indices for 3-member coverflow layout
              const leftIdx = (activeIdx - 1 + len) % len;
              const rightIdx = (activeIdx + 1) % len;
 
              const leftMember = localKknTeam[leftIdx];
              const rightMember = localKknTeam[rightIdx];
 
              const leftCutout = (leftMember.avatar_url && leftMember.avatar_url !== '/default_avatar.svg') ? leftMember.avatar_url : `/kkn_member_${(leftIdx % 8) + 1}.png`;
              const activeCutout = (activeMember.avatar_url && activeMember.avatar_url !== '/default_avatar.svg') ? activeMember.avatar_url : `/kkn_member_${(activeIdx % 8) + 1}.png`;
              const rightCutout = (rightMember.avatar_url && rightMember.avatar_url !== '/default_avatar.svg') ? rightMember.avatar_url : `/kkn_member_${(rightIdx % 8) + 1}.png`;
 
              return (
                <div className="w-full flex flex-col items-center py-6 space-y-8 animate-fade-in relative z-10">
                  
                  {/* The Coverflow Slider Track */}
                  <div 
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    className="relative flex items-center justify-center w-full max-w-4xl overflow-hidden py-4 px-2 cursor-grab active:cursor-grabbing"
                  >
                    
                    {/* Navigation Buttons (hidden on mobile, visible from md screens) */}
                    <button
                      onClick={handlePrevMember}
                      className="hidden md:flex absolute left-2 sm:left-6 z-30 p-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 transition-all active:scale-95 items-center justify-center"
                      aria-label="Previous member"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextMember}
                      className="hidden md:flex absolute right-2 sm:right-6 z-30 p-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 transition-all active:scale-95 items-center justify-center"
                      aria-label="Next member"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
 
                    <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 w-full select-none">
                      
                      {/* LEFT MEMBER (Faded, Blurred, Clickable to slide left) */}
                      {len > 1 && (
                        <div 
                          onClick={handlePrevMember}
                          className="w-28 h-40 sm:w-36 sm:h-52 md:w-48 md:h-68 lg:w-56 lg:h-80 shrink-0 bg-transparent flex items-center justify-center cursor-pointer opacity-30 blur-[2px] scale-90 hover:scale-95 hover:opacity-50 transition-all duration-500 overflow-visible"
                        >
                          <img
                            src={leftCutout}
                            alt={leftMember.name}
                            className="w-full h-full object-contain pointer-events-none"
                          />
                        </div>
                      )}
 
                      {/* ACTIVE CENTER MEMBER (Highlighted, Opaque, Sharp) */}
                      <div 
                        className="w-60 h-80 sm:w-64 sm:h-84 md:w-72 md:h-[400px] lg:w-84 lg:h-[450px] shrink-0 bg-transparent flex items-center justify-center scale-110 md:scale-115 transition-all duration-500 relative z-10 overflow-visible"
                      >
                        <img
                          src={activeCutout}
                          alt={activeMember.name}
                          className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
                        />
                      </div>
 
                      {/* RIGHT MEMBER (Faded, Blurred, Clickable to slide right) */}
                      {len > 2 && (
                        <div 
                          onClick={handleNextMember}
                          className="w-28 h-40 sm:w-36 sm:h-52 md:w-48 md:h-68 lg:w-56 lg:h-80 shrink-0 bg-transparent flex items-center justify-center cursor-pointer opacity-30 blur-[2px] scale-90 hover:scale-95 hover:opacity-50 transition-all duration-500 overflow-visible"
                        >
                          <img
                            src={rightCutout}
                            alt={rightMember.name}
                            className="w-full h-full object-contain pointer-events-none"
                          />
                        </div>
                      )}
                      
                    </div>
                  </div>
 
                  {/* Active Member Details Centered Below */}
                  <div key={activeIdx} className="text-center max-w-2xl mx-auto space-y-4 px-4 pt-2 animate-fade-in">
                    <div className="space-y-1">
                      <span className="inline-flex px-3 py-1 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-[10px] font-black uppercase tracking-wider">
                        {activeMember.role_kkn}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                        {activeMember.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-bold tracking-wide uppercase">
                        {activeMember.prodi}
                      </p>
                    </div>
 
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold max-w-lg mx-auto">
                      {activeMember.description || 'Bertanggung jawab penuh atas kelancaran program kerja pengabdian masyarakat di RT 35 Manggar, berkolaborasi aktif dengan warga sekitar untuk menciptakan solusi berbasis digital dan pemberdayaan berkelanjutan.'}
                    </p>
                  </div>
 
                  {/* Indicators (Dots) */}
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    {localKknTeam.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveIdx(idx);
                          setIsAutoPlaying(false);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === activeIdx ? 'bg-[#0b5665] w-5' : 'bg-slate-300 hover:bg-slate-400 w-2'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                </div>
              );
            })()}
          </div>

      </div>

    </div>
  );
};
export default KKNPortalPage;
