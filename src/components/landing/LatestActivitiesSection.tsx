import React, { useEffect, useState } from 'react';
import { Camera, Calendar, ArrowRight, BookOpen, Compass } from 'lucide-react';
import { SupabaseService } from '../../lib/supabase';
import { NavigationItem } from '../../types/database';
import { getPreviewText } from '../../lib/utils';

interface LatestActivitiesSectionProps {
  navigateTo: (path: string) => void;
}

export const LatestActivitiesSection: React.FC<LatestActivitiesSectionProps> = ({ navigateTo }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      try {
        const navItems = await SupabaseService.fetchNavItems();
        const kegiatanPageItem = navItems.find((item) => item.target_id === 'kegiatan-warga');
        if (kegiatanPageItem?.custom_content) {
          try {
            const parsed = JSON.parse(kegiatanPageItem.custom_content);
            const gridItems = parsed.grid_items || [];
            // Slice to get the latest 3 items (most recently added items are usually at the end of the array, so reverse and take 3)
            setActivities([...gridItems].reverse().slice(0, 3));
          } catch (e) {
            console.warn('Failed parsing activities JSON:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load latest activities:', err);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  if (loading) return null;
  if (activities.length === 0) return null;

  return (
    <section id="kegiatan-terbaru" className="py-24 bg-[#FAF9F6] relative border-t border-slate-100 scroll-mt-16 bg-grid-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10 animate-fade-in">
        
        {/* SECTION HEADER & VIEW ALL BUTTON */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 text-left">
            <div className="badge-premium-sage">
              <Camera className="w-4 h-4 text-[#85A389]" />
              <span>Dokumentasi & Galeri Warga</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Kegiatan Terbaru <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E4D6B] via-[#85A389] to-[#bca481]">Warga RT 35</span>
            </h2>
            <p className="text-slate-600 max-w-xl text-sm sm:text-base leading-relaxed font-semibold">
              Dokumentasi foto kegiatan gotong royong, arisan warga, posyandu, dan penyuluhan sosial terkini di wilayah RT 35.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('/page/kegiatan-warga')}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-sm flex items-center space-x-2 transition-all hover:scale-[1.02] shrink-0 self-start md:self-auto active:scale-98"
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
                className="premium-card overflow-hidden cursor-pointer group"
              >
                <div>
                  {/* Image */}
                  {item.image_url ? (
                    <div className="h-52 w-full overflow-hidden relative bg-slate-50 border-b border-slate-100">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-52 w-full bg-gradient-to-tr from-[#1E4D6B]/5 via-[#85A389]/10 to-[#E5D3B3]/5 flex items-center justify-center relative border-b border-slate-100">
                      <BookOpen className="w-10 h-10 text-[#85A389] opacity-40 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-6 space-y-2">
                    <h4 className="text-base font-black text-slate-900 leading-snug group-hover:text-slate-700 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-bold">
                      {new Date(item.created_at || new Date().toISOString()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
