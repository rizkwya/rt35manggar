import React from 'react';
import { Camera, ArrowRight, BookOpen } from 'lucide-react';
import { NavigationItem } from '../../types/database';

interface LatestActivitiesSectionProps {
  navigateTo: (path: string) => void;
  navItems: NavigationItem[];
}

export const LatestActivitiesSection: React.FC<LatestActivitiesSectionProps> = ({ navigateTo, navItems }) => {
  const kegiatanPageItem = navItems.find((item) => item.target_id === 'kegiatan-warga');
  let activities: any[] = [];
  if (kegiatanPageItem?.custom_content) {
    try {
      const parsed = JSON.parse(kegiatanPageItem.custom_content);
      const gridItems = parsed.grid_items || [];
      activities = [...gridItems].reverse().slice(0, 3);
    } catch (e) {
      console.warn('Failed parsing activities JSON:', e);
    }
  }

  if (activities.length === 0) return null;

  return (
    <section id="kegiatan-terbaru" className="py-24 bg-white relative border-t border-slate-200/60 scroll-mt-16 bg-grid-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10 animate-fade-in">
        
        {/* SECTION HEADER & VIEW ALL BUTTON */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-xs font-black uppercase tracking-wider">
              <Camera className="w-4 h-4 text-[#0b5665]" />
              <span>Dokumentasi & Galeri Warga</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Kegiatan Terbaru <span className="text-[#0b5665]">Warga RT 35</span>
            </h2>
            <p className="text-slate-500 max-w-xl text-xs sm:text-sm leading-relaxed font-bold">
              Dokumentasi foto kegiatan gotong royong, arisan warga, posyandu, dan penyuluhan sosial terkini di wilayah RT 35.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/page/kegiatan-warga')}
            className="px-6 py-3.5 rounded-full bg-[#0b5665] hover:bg-[#08424e] text-white font-black text-xs shadow-sm flex items-center space-x-2 transition-all hover:scale-[1.02] shrink-0 self-start md:self-auto active:scale-98"
          >
            <span>Lihat Semua Dokumentasi</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((item, idx) => {
            const generateSlug = (text: string) => {
              return text
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
            };
            return (
              <div
                key={idx}
                onClick={() => navigateTo(`/page/kegiatan-warga?slug=${generateSlug(item.title)}`)}
                className="premium-card overflow-hidden cursor-pointer group hover:border-[#0b5665]/40"
              >
                <div>
                  {/* Image */}
                  {item.image_url ? (
                    <div className="h-52 w-full overflow-hidden relative bg-slate-50 border-b border-slate-200">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-52 w-full bg-slate-100 flex items-center justify-center relative border-b border-slate-200">
                      <BookOpen className="w-10 h-10 text-[#0b5665] opacity-40 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-6 space-y-2">
                    <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-[#0b5665] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {new Date(item.created_at || new Date().toISOString()).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
export default LatestActivitiesSection;
