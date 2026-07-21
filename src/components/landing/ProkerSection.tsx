import React from 'react';
import { ProkerItem } from '../../types/database';
import { Sparkles, Calendar, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface ProkerSectionProps {
  prokerList: ProkerItem[];
}

export const ProkerSection: React.FC<ProkerSectionProps> = ({ prokerList }) => {
  return (
    <section id="proker" className="py-20 relative bg-white border-t border-beach-sky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="beach-pill-sand mb-3 inline-flex">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Program Kerja Unggulan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-800 tracking-tight">
            Agenda Program Pengabdian KKN
          </h2>
          <p className="text-slate-600 text-sm font-medium mt-2">
            Inisiatif kerja nyata mahasiswa Informatika dalam mendukung pemberdayaan masyarakat Kelurahan Manggar 2.
          </p>
        </div>

        {/* PROKER CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prokerList.map((item) => (
            <div
              key={item.id}
              className="beach-card beach-card-hover p-6 flex flex-col justify-between bg-gradient-to-b from-white to-[#F7FCFF] border-2 border-beach-sky"
            >
              <div>
                {/* CATEGORY & STATUS */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="beach-pill-blue text-xs py-1 px-3">
                    {item.category}
                  </span>
                  
                  {item.status === 'Completed' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Selesai
                    </span>
                  )}
                  {item.status === 'In Progress' && (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold flex items-center gap-1 border border-amber-300">
                      <PlayCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Berjalan
                    </span>
                  )}
                  {item.status === 'Planned' && (
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1 border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Rencana
                    </span>
                  )}
                </div>

                {/* TITLE & DESCRIPTION */}
                <h3 className="text-xl font-black text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">{item.description}</p>
              </div>

              {/* PROGRESS BAR & FOOTER */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold">Capaian Progres:</span>
                  <span className="font-extrabold text-beach-blue-dark font-mono text-sm">{item.progress_percent}%</span>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-beach-blue to-beach-palm transition-all duration-500 shadow-sm"
                    style={{ width: `${item.progress_percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-bold">
                  <span className="flex items-center gap-1 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-beach-blue" /> Target: {item.target_date}
                  </span>
                  <span className="text-beach-palm-dark">PIC: {item.pic_name}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
