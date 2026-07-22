import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface PageTransitionLoaderProps {
  isLoading: boolean;
}

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (isLoading) {
      setVisible(true);
      setProgress(15);

      // Fast initial progress increment
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.floor(Math.random() * 15 + 10);
        });
      }, 50);

    } else {
      setProgress(100);
      timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none">
      {/* 1. TOP PROGRESS BAR */}
      <div className="h-1 w-full bg-slate-800/30 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 2. FLOATING MINI LOGO BUFFERING BADGE (TOP RIGHT) */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center space-x-3 bg-[#1E4D6B]/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-2xl border border-white/20 animate-fade-in">
        {/* LOGO WITH BUFFERING SPINNER */}
        <div className="relative w-7 h-7 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 border-r-emerald-400 animate-spin" />
          <div className="w-5 h-5 rounded-full bg-white p-0.5 shadow flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Logo KKN" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* BUFFERING TEXT */}
        <div className="flex flex-col">
          <span className="text-[11px] font-extrabold text-amber-300 tracking-wider flex items-center gap-1 uppercase">
            <Sparkles className="w-3 h-3 animate-spin text-emerald-300" />
            Buffering...
          </span>
          <span className="text-[9px] text-slate-200 font-medium">Memuat Halaman</span>
        </div>
      </div>
    </div>
  );
};
