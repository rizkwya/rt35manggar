import React, { useEffect, useState } from 'react';
import { Waves, Sparkles } from 'lucide-react';

interface LoadingSplashScreenProps {
  onFinished?: () => void;
  minimumDurationMs?: number; // Minimum display time for smooth UX (e.g. 1800ms)
}

export const LoadingSplashScreen: React.FC<LoadingSplashScreenProps> = ({
  onFinished,
  minimumDurationMs = 1800,
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const loadingMessages = [
    'Memuat Portal KKN Manggar 2 Balikpapan Timur...',
    'Menghubungkan Database Supabase Realtime...',
    'Menyiapkan Posko RT 35 & Program Kerja...',
    'Portal Siap Dipersembahkan...',
  ];

  useEffect(() => {
    // 1. Progress increment timer (smooth 0% -> 100%)
    const startTime = Date.now();
    const intervalTime = 30; // ms
    const totalSteps = minimumDurationMs / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(100, Math.round((currentStep / totalSteps) * 100));
      setProgress(currentProgress);

      // Change loading message at progress milestones
      if (currentProgress > 75) {
        setLoadingTextIndex(3);
      } else if (currentProgress > 45) {
        setLoadingTextIndex(2);
      } else if (currentProgress > 20) {
        setLoadingTextIndex(1);
      }

      if (currentProgress >= 100) {
        clearInterval(timer);
        // Trigger fade out
        setIsFadingOut(true);
        setTimeout(() => {
          if (onFinished) onFinished();
        }, 600); // 600ms fade out duration
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [minimumDurationMs, onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0B2536] via-[#1E4D6B] to-[#0A1E2B] text-white transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* AMBIENT BACKGROUND GLOW EFFECTS */}
      <div className="absolute w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-amber-400/15 rounded-full blur-2xl animate-ping duration-[3000ms] pointer-events-none" />

      {/* CENTER CONTENT CARD */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md w-full">
        
        {/* LOGO CONTAINER WITH ORBITING BUFFERING SPINNER */}
        <div className="relative mb-8 group">
          {/* OUTER DUAL BUFFERING SPINNER RINGS */}
          <div className="absolute -inset-4 rounded-full border-4 border-transparent border-t-amber-400 border-r-emerald-400 animate-spin" />
          <div className="absolute -inset-7 rounded-full border-2 border-transparent border-b-sky-300 border-l-teal-300 animate-spin duration-1000" />
          <div className="absolute -inset-10 rounded-full border border-white/10 animate-pulse" />

          {/* WHITE LOGO BADGE WITH GLASS EFFECT */}
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-white/95 p-3 shadow-2xl border-2 border-white/40 flex items-center justify-center backdrop-blur-xl transform transition-transform duration-500 hover:scale-105">
            <img
              src="/logo.png"
              alt="Logo KKN Manggar 2"
              className="w-full h-full object-contain filter drop-shadow-md animate-pulse"
              onError={(e) => {
                // Fallback icon if logo image hasn't loaded
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {/* Fallback Icon */}
            <div className="hidden items-center justify-center text-beach-blue-dark">
              <Waves className="w-16 h-16 animate-bounce" />
            </div>
          </div>

          {/* GLOWING BADGE DECORATION */}
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-lg border border-amber-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-spin" /> RT 35
          </div>
        </div>

        {/* TITLE & SUBTITLE */}
        <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider mb-1 drop-shadow-md">
          KKN MANGGAR 2
        </h1>
        <p className="text-xs font-semibold text-amber-300 tracking-widest uppercase mb-6">
          BALIKPAPAN TIMUR • KKN7MANGGAR.VERCEL.APP
        </p>

        {/* BUFFERING PROGRESS BAR */}
        <div className="w-full max-w-xs bg-white/10 backdrop-blur-md h-3 rounded-full overflow-hidden border border-white/20 mb-3 shadow-inner relative">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 transition-all duration-150 ease-out rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* PROGRESS PERCENTAGE & DYNAMIC STATUS MESSAGE */}
        <div className="flex items-center justify-between w-full max-w-xs text-xs font-semibold text-slate-200 mb-2 px-1">
          <span className="text-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            Buffering...
          </span>
          <span className="font-mono text-emerald-300 font-bold">{progress}%</span>
        </div>

        <p className="text-xs text-slate-300 min-h-[20px] font-medium animate-pulse">
          {loadingMessages[loadingTextIndex]}
        </p>

      </div>

      {/* FOOTER BRANDING */}
      <div className="absolute bottom-6 text-[11px] text-slate-400 font-medium tracking-wide">
        Fasilkom Informatika • Kelurahan Manggar 2
      </div>
    </div>
  );
};
