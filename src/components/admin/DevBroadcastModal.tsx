import React, { useEffect } from 'react';
import { DevBroadcast } from '../../types/database';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  X, 
  Terminal, 
  Sparkles,
  ShieldAlert,
  Volume2
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
      themeBg: 'bg-rose-500',
      badgeBg: 'bg-rose-500/10 text-rose-600 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-600 border-rose-200',
      cardBorder: 'border-rose-300 ring-4 ring-rose-500/10',
      icon: AlertTriangle,
      badgeText: 'PEMBERITAHUAN MENDESAK',
      accentColor: '#e11d48'
    },
    warning: {
      themeBg: 'bg-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-600 border-amber-200',
      cardBorder: 'border-amber-300 ring-4 ring-amber-500/10',
      icon: AlertCircle,
      badgeText: 'PERINGATAN SISTEM',
      accentColor: '#d97706'
    },
    success: {
      themeBg: 'bg-emerald-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      cardBorder: 'border-emerald-300 ring-4 ring-emerald-500/10',
      icon: CheckCircle2,
      badgeText: 'PENGUMUMAN PENGEMBANG',
      accentColor: '#059669'
    },
    info: {
      themeBg: 'bg-sky-500',
      badgeBg: 'bg-sky-500/10 text-sky-700 border-sky-200',
      iconBg: 'bg-sky-100 text-sky-600 border-sky-200',
      cardBorder: 'border-sky-300 ring-4 ring-sky-500/10',
      icon: Info,
      badgeText: 'INFO RESMI DEVELOPER',
      accentColor: '#0284c7'
    }
  }[broadcast.type || 'info'];

  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      
      {/* Background Click to Dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div 
        className={`relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border ${config.cardBorder} overflow-hidden z-10 animate-scale-up`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Accent Banner */}
        <div className={`h-2.5 w-full ${config.themeBg}`} />

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className={`w-12 h-12 rounded-2xl ${config.iconBg} border flex items-center justify-center shrink-0 shadow-sm`}>
                <IconComponent className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badgeBg}`}>
                    {config.badgeText}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
                    <Terminal className="w-3 h-3 text-slate-400" />
                    <span>Live Broadcast</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-bold mt-1">
                  {broadcast.timestamp || 'Baru Saja'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all shrink-0 active:scale-95"
              title="Tutup Pemberitahuan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title & Message Content */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {broadcast.title}
            </h3>
            
            <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold max-h-[260px] overflow-y-auto whitespace-pre-line shadow-inner">
              {broadcast.message}
            </div>
          </div>

          {/* Author Signature & Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <img
                src={broadcast.author_avatar || '/logo.png'}
                alt={broadcast.author_name}
                className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">
                  {broadcast.author_name || 'Tim Developer RT 35'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Developer & System Administrator</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5 shrink-0"
            >
              <span>✓ Mengerti & Tutup</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
