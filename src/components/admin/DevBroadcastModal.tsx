import React, { useEffect } from 'react';
import { DevBroadcast } from '../../types/database';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  X, 
  Radio, 
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';

interface DevBroadcastModalProps {
  broadcast: DevBroadcast;
  onClose: () => void;
}

export const DevBroadcastModal: React.FC<DevBroadcastModalProps> = ({ broadcast, onClose }) => {
  // Lock background scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Play gentle subtle notification chime using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const config = {
    urgent: {
      gradientBar: 'from-rose-500 via-red-500 to-amber-500',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      iconContainer: 'bg-rose-500 text-white shadow-rose-500/25',
      glowRing: 'ring-rose-500/10 border-rose-200',
      icon: AlertTriangle,
      badgeText: 'Pemberitahuan Mendesak',
    },
    warning: {
      gradientBar: 'from-amber-500 via-orange-500 to-yellow-500',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      iconContainer: 'bg-amber-500 text-white shadow-amber-500/25',
      glowRing: 'ring-amber-500/10 border-amber-200',
      icon: AlertCircle,
      badgeText: 'Peringatan Sistem',
    },
    success: {
      gradientBar: 'from-emerald-500 via-teal-500 to-green-500',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      iconContainer: 'bg-emerald-600 text-white shadow-emerald-500/25',
      glowRing: 'ring-emerald-500/10 border-emerald-200',
      icon: CheckCircle2,
      badgeText: 'Pengumuman Rilis Fitur',
    },
    info: {
      gradientBar: 'from-sky-500 via-blue-600 to-indigo-600',
      badgeBg: 'bg-sky-50 text-sky-800 border-sky-200/80',
      iconContainer: 'bg-[#0b5665] text-white shadow-[#0b5665]/25',
      glowRing: 'ring-[#0b5665]/10 border-slate-200',
      icon: Info,
      badgeText: 'Informasi Resmi Pengembang',
    }
  }[broadcast.type || 'info'];

  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      
      {/* Background Click to Dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card (International Standard Dimensions & Spacing) */}
      <div 
        className={`relative w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border ${config.glowRing} ring-4 sm:ring-8 overflow-hidden z-10 animate-scale-up`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Decorative Gradient Accent Bar */}
        <div className={`h-2.5 sm:h-3 w-full bg-gradient-to-r ${config.gradientBar}`} />

        <div className="p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-7">
          
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-3.5 sm:space-x-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${config.iconContainer} shadow-lg flex items-center justify-center shrink-0`}>
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${config.badgeBg}`}>
                    {config.badgeText}
                  </span>
                  
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Broadcast</span>
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 font-bold">
                  {broadcast.timestamp || 'Baru Saja'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all shrink-0 active:scale-95 shadow-2xs"
              title="Tutup Notifikasi"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Title & Message Content */}
          <div className="space-y-3.5">
            <h3 className="text-xl sm:text-2xl md:text-[26px] font-black text-slate-900 leading-snug tracking-tight">
              {broadcast.title}
            </h3>
            
            <div className="p-5 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl bg-slate-50/90 border border-slate-200/90 text-sm sm:text-base text-slate-700 leading-relaxed font-medium max-h-[320px] overflow-y-auto whitespace-pre-line shadow-inner">
              {broadcast.message}
            </div>
          </div>

          {/* Footer: Author Info & CTA Button */}
          <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <img
                  src={broadcast.author_avatar || '/logo.png'}
                  alt={broadcast.author_name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-amber-500 shadow-md shrink-0"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-slate-900 border border-white flex items-center justify-center text-[8px] text-amber-400">
                  ⚡
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                  {broadcast.author_name || 'Tim Developer RT 35'}
                </p>
                <p className="text-[11px] text-slate-500 font-bold flex items-center space-x-1 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Developer & System Administrator</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Mengerti & Tutup</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
