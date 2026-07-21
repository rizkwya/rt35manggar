import React from 'react';
import { TeamMember } from '../../types/database';
import { Code2, Users } from 'lucide-react';

interface TeamSectionProps {
  team: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  return (
    <section id="tim" className="py-20 relative bg-white border-t border-beach-sky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#4F9460] text-white font-extrabold text-xs shadow-sm mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Struktur Kelompok KKN (8 Mahasiswa)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
            Tim Mahasiswa KKN Manggar 2
          </h2>
          <p className="text-slate-600 text-sm font-semibold mt-1">
            Geser (swipe) ke samping untuk melihat seluruh anggota tim KKN RT 35.
          </p>
        </div>

        {/* NATURAL HORIZONTAL SWIPE TRACK (4 CARDS VISIBLE ON DESKTOP, NATURAL TOUCH/TRACKPAD/DRAG SWIPE) */}
        <div className="relative">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-3 pb-8 cursor-grab active:cursor-grabbing select-none scroll-smooth">
            {team.map((member) => (
              <div
                key={member.id}
                className="w-[280px] sm:w-[280px] shrink-0 snap-start bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-[#236F9E] transition-all flex flex-col justify-between text-center group"
              >
                <div>
                  {/* AVATAR IMAGE WITH BORDER & BADGE */}
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm group-hover:border-[#236F9E] transition-all">
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {member.is_developer && (
                      <span className="absolute bottom-1 right-1 p-1 rounded-md bg-amber-500 text-slate-950 shadow-md" title="Role Developer Admin">
                        <Code2 className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* NAME, NIM & PRODI WITH CRISP CONTRAST */}
                  <h3 className="font-black text-slate-900 text-base line-clamp-2 leading-snug group-hover:text-[#236F9E] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-mono font-bold mt-1">
                    NIM: {member.nim}
                  </p>
                  <p className="text-xs text-[#236F9E] font-black mt-1">
                    {member.prodi}
                  </p>
                </div>

                {/* ROLE KKN BADGE */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <span className="inline-block w-full px-3 py-1.5 rounded-xl bg-[#FBEED2] border border-amber-300 text-amber-950 text-xs font-black shadow-sm truncate">
                    {member.role_kkn}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* MINIMALIST SWIPE INDICATOR */}
        <div className="text-center mt-2 text-xs font-extrabold text-[#236F9E] flex items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#DDF0FA] border border-blue-200">
            ← Usap / Swipe Ke Samping →
          </span>
        </div>

      </div>
    </section>
  );
};
