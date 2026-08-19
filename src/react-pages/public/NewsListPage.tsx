import React, { useState, useEffect } from 'react';
import { NewsPost } from '../../types/database';
import { Calendar, User, Search, BookOpen, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { SupabaseService, supabase } from '../../lib/supabase';

interface NewsListPageProps {
  newsList: NewsPost[];
  onBackToHome: () => void;
}

export const NewsListPage: React.FC<NewsListPageProps> = ({
  newsList,
  onBackToHome
}) => {
  const [localNewsList, setLocalNewsList] = useState<NewsPost[]>(newsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Semua']);
  const [selectedArticle, setSelectedArticle] = useState<NewsPost | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset pagination to page 1 when search query or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories]);

  // Read slug from URL parameters on mount and browser navigation history changes
  useEffect(() => {
    const checkSlug = () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('slug');
      if (slug) {
        const found = localNewsList.find(a => a.slug === slug);
        if (found) {
          setSelectedArticle(found);
          return;
        }
      }
      setSelectedArticle(null);
    };

    checkSlug();
    
    window.addEventListener('popstate', checkSlug);
    return () => window.removeEventListener('popstate', checkSlug);
  }, [localNewsList]);

  // Sync prop changes and subscribe to realtime updates
  useEffect(() => {
    setLocalNewsList(newsList);

    const channel = supabase
      .channel('realtime-news-list-public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        async () => {
          const updated = await SupabaseService.fetchNews();
          setLocalNewsList(updated);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [newsList]);

  const handleSelectArticle = (article: NewsPost | null) => {
    if (article) {
      window.history.pushState(null, '', `/berita?slug=${article.slug}`);
    } else {
      window.history.pushState(null, '', '/berita');
    }
    setSelectedArticle(article);
  };

  const categories = ['Semua', 'Kegiatan Utama', 'Penghargaan', 'Pemberdayaan', 'Pembangunan', 'Lainnya'];

  const handleToggleCategory = (cat: string) => {
    if (cat === 'Semua') {
      setSelectedCategories(['Semua']);
    } else {
      let next = [...selectedCategories];
      next = next.filter(c => c !== 'Semua');
      if (next.includes(cat)) {
        next = next.filter(c => c !== cat);
      } else {
        next.push(cat);
      }
      if (next.length === 0) {
        next = ['Semua'];
      }
      setSelectedCategories(next);
    }
  };

  // Filter & Search Logic
  const filteredArticles = localNewsList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.includes('Semua') || selectedCategories.includes(item.category);
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-2 sm:px-6 lg:px-8 animate-fade-in space-y-8">
      
      {selectedArticle ? (
        // DETAIL VIEW (Premium International Standard layout)
        <div className="max-w-4xl mx-auto space-y-6">
          <button 
            onClick={() => handleSelectArticle(null)}
            className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors group bg-white border border-slate-200 px-4.5 py-2.5 rounded-xl shadow-sm hover:scale-[1.02]"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Daftar Berita</span>
          </button>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-md space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-[9px] uppercase font-black px-2.5 py-1 rounded bg-slate-900 text-white shadow-sm">
                  {selectedArticle.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {Math.max(1, Math.round((selectedArticle.content || '').split(' ').length / 200))} Menit Baca
                  </span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                {selectedArticle.title}
              </h1>

              {/* Author profile card */}
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                  {selectedArticle.author_name ? selectedArticle.author_name.substring(0, 2).toUpperCase() : 'RT'}
                </div>
                <div className="text-xs font-bold text-slate-705">
                  <p className="text-slate-900 font-black">{selectedArticle.author_name || 'Pengurus RT 35'}</p>
                  <p className="text-[10px] text-slate-405 mt-0.5">
                    Diterbitkan pada {new Date(selectedArticle.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <hr className="border-slate-150 my-4" />
            </div>

            {/* Huge cover image like a professional blog */}
            {selectedArticle.image_url ? (
              <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-150 bg-slate-50 flex justify-center">
                <img 
                  src={selectedArticle.image_url} 
                  alt={selectedArticle.title} 
                  className="max-w-full max-h-[600px] object-contain w-auto h-auto rounded-2xl"
                />
              </div>
            ) : (
              <div className="w-full h-52 sm:h-72 rounded-2xl overflow-hidden shadow-sm border border-slate-150 bg-slate-50 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-slate-400 opacity-45" />
              </div>
            )}

            <div 
              className="text-slate-750 text-sm sm:text-base leading-relaxed font-semibold pt-4 tiptap-content prose max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>
        </div>
      ) : (
        // LIST VIEW
        <>
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
              Kabar Seputar RT
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
              Berita Kegiatan RT 35
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
              Liputan berita resmi mengenai pencapaian, program kerja pengurus, serta dokumentasi kegiatan sosial kemasyarakatan warga RT 35.
            </p>
          </div>

          {/* Search and Category Filter Card */}
          <div className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Cari berita atau pengumuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-800 transition-all"
              />
            </div>

            {/* Horizontal Categories */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleToggleCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    selectedCategories.includes(cat)
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectArticle(item)}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Card Cover Image */}
                    {item.image_url ? (
                      <div className="h-52 w-full overflow-hidden relative border-b border-slate-100 bg-slate-50">
                        <img 
                          src={item.image_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-52 w-full bg-slate-50 flex items-center justify-center relative border-b border-slate-100">
                        <BookOpen className="w-10 h-10 text-slate-400 opacity-40 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-6 space-y-2">
                      <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-slate-700 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-[11px] text-slate-400 font-bold">
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredArticles.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-400 font-bold text-xs bg-white rounded-3xl border border-slate-200">
                  Tidak ada berita kegiatan ditemukan.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6 pb-2 md:pb-4">
                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[36px]"
                  aria-label="Previous page"
                >
                  &larr;
                </button>
                
                {/* Desktop Numeric Pagination */}
                <div className="hidden sm:flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setCurrentPage(p);
                        window.scrollTo({ top: 200, behavior: 'smooth' });
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
                </div>

                {/* Mobile Text Pagination Indicator */}
                <span className="sm:hidden text-xs font-bold text-slate-500 px-3">
                  Hal {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 200, behavior: 'smooth' });
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
        </>
      )}

    </div>
  );
};
