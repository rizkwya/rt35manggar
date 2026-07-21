import React, { useState } from 'react';
import { NewsPost, UserRole } from '../../types/database';
import { FileText, Calendar, User, Search, PlusCircle, ArrowRight } from 'lucide-react';

interface NewsSectionProps {
  newsList: NewsPost[];
  currentRole: UserRole;
  onOpenDashboard: () => void;
  onSelectNews: (slug: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  newsList,
  currentRole,
  onOpenDashboard,
  onSelectNews,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua', 'Kegiatan Utama', 'Digitalisasi UMKM', 'Teknologi'];

  const filteredNews = newsList.filter((item) => {
    const matchesCat = activeCategory === 'Semua' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="berita" className="py-20 relative bg-[#EBF5FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER & REALTIME BADGE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#4F9460] text-white font-extrabold text-xs shadow-md mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>• LIVE REPORT BERITA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
              Kabar Harian & Live Report KKN
            </h2>
            <p className="text-slate-700 text-sm font-semibold mt-1">
              Diterbitkan secara realtime oleh Tim Developer & Humas KKN RT 35 Manggar 2.
            </p>
          </div>

          {/* DEVELOPER ADD NEWS ACTION BUTTON */}
          {currentRole === 'developer' && (
            <button
              onClick={onOpenDashboard}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md flex items-center space-x-2 shrink-0 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>+ Post Live Report di CMS</span>
            </button>
          )}
        </div>

        {/* SEARCH & CATEGORY FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-sm">
          
          {/* CATEGORIES WITH HIGH CONTRAST */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeCategory === cat
                    ? 'bg-[#4F9460] text-white shadow-md'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SEARCH INPUT WITH CRISP DARK TEXT & PLACEHOLDER */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Tulis kegiatan / cari berita di sini..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0F8FF] border border-slate-300 rounded-full pl-4 pr-10 py-2 text-xs font-bold text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#236F9E]"
            />
            <Search className="w-4 h-4 text-[#236F9E] absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

        </div>

        {/* NEWS GRID */}
        {filteredNews.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-slate-800 font-extrabold text-base">Belum ada berita di kategori ini</h4>
            <p className="text-slate-600 text-xs font-semibold mt-1">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                onClick={() => onSelectNews(item.slug)}
                className="bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* IMAGE THUMBNAIL */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-[#4F9460] text-white text-[10px] font-black shadow-sm">
                        • LIVE REPORT
                      </span>
                    </div>
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-[#FBEED2] border border-amber-300 text-amber-950 text-[10px] font-black shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* CONTENT BODY */}
                  <div className="p-5">
                    <div className="flex items-center space-x-3 text-xs mb-2.5 font-bold">
                      <span className="flex items-center gap-1 text-[#236F9E]">
                        <Calendar className="w-3.5 h-3.5 text-[#236F9E]" />
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="flex items-center gap-1 text-[#4F9460]">
                        <User className="w-3.5 h-3.5 text-[#4F9460]" />
                        {item.author_name}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-lg group-hover:text-[#236F9E] transition-colors line-clamp-2 mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-slate-700 text-xs line-clamp-3 leading-relaxed font-semibold">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* CARD FOOTER WITH SOLID HIGH CONTRAST OCEAN BLUE TEXT */}
                <div className="p-5 pt-2 flex items-center justify-between text-xs text-[#236F9E] font-black border-t border-slate-100 group-hover:translate-x-0.5 transition-transform">
                  <span className="text-[#236F9E] font-black">Baca Live Report Selengkapnya</span>
                  <ArrowRight className="w-4 h-4 text-[#236F9E]" />
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
