import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import type { NavigationItem } from '../types/database';
import { SupabaseService, supabase } from '../lib/supabase';

interface CustomPageDetailProps {
  pageItem: NavigationItem;
  slug: string;
}

export const CustomPageDetail: React.FC<CustomPageDetailProps> = ({ pageItem: initialPageItem, slug }) => {
  const [pageItem, setPageItem] = useState<NavigationItem>(initialPageItem);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  useEffect(() => {
    const loadLivePage = async () => {
      try {
        const liveItems = await SupabaseService.fetchNavItems();
        const livePage = liveItems.find((item) => item.id === initialPageItem.id || item.target_id === initialPageItem.target_id);
        if (livePage) {
          setPageItem(livePage);
        }
      } catch (err) {
        console.warn('Failed to fetch live page content:', err);
      }
    };
    loadLivePage();

    const channel = supabase
      .channel('realtime-navigation-page')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_navigation_items' },
        async () => {
          const liveItems = await SupabaseService.fetchNavItems();
          const livePage = liveItems.find((item) => item.id === initialPageItem.id || item.target_id === initialPageItem.target_id);
          if (livePage) {
            setPageItem(livePage);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialPageItem]);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      setSelectedSlug(params.get('slug'));
    };
    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const sortedGridItems = [...gridItems].sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedGridItems.length / itemsPerPage);
  const paginatedGridItems = sortedGridItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const selectedGridItem = selectedSlug 
    ? gridItems.find(item => generateSlug(item.title) === selectedSlug)
    : null;

  const navigateToSlug = (slugStr: string | null) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (slugStr) {
        url.searchParams.set('slug', slugStr);
      } else {
        url.searchParams.delete('slug');
      }
      window.history.pushState(null, '', url.pathname + url.search);
      setSelectedSlug(slugStr);
    }
  };

  if (selectedGridItem) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-fade-in space-y-6">
        {/* Back Button */}
        <div>
          <button 
            onClick={() => navigateToSlug(null)}
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
                className="max-w-full max-h-[600px] object-contain w-auto h-auto rounded-2xl animate-fade-in"
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
          onClick={() => { window.location.href = '/'; }}
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
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-3 leading-tight">
              {pageItem.label}
            </h1>
          </div>
        )}

        {subtitle && (
          <p className="text-sm sm:text-base text-slate-500 font-extrabold italic leading-relaxed border-l-4 border-[#85A389] pl-4">
            {subtitle}
          </p>
        )}

        <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-semibold">
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
            {paginatedGridItems.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => navigateToSlug(generateSlug(item.title))}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6 pb-2">
              <button
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[36px]"
                aria-label="Previous page"
              >
                &larr;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setCurrentPage(p);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all active:scale-95 border ${
                    currentPage === p
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[36px]"
                aria-label="Next page"
              >
                &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
