import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { KeyRound, UserCheck, AlertCircle, ArrowLeft, Waves, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, profile: UserProfile, redirectTo: 'presensi' | 'dashboard') => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [nimInput, setNimInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedNim = nimInput.trim();
    const trimmedPass = passwordInput.trim();

    if (!trimmedNim || !trimmedPass) {
      setErrorMsg('Harap isi NIM dan Password Anda.');
      return;
    }

    setIsLoading(true);

    try {
      // Dynamic Supabase Database Authentication Query
      const profile = await SupabaseService.authenticateUser(trimmedNim, trimmedPass);

      if (!profile) {
        setErrorMsg(`Authentikasi Gagal: NIM "${trimmedNim}" atau Password salah. Silakan periksa kembali.`);
        setIsLoading(false);
        return;
      }

      const role: UserRole = profile.role;
      const target = role === 'mahasiswa' ? 'presensi' : 'dashboard';
      onLoginSuccess(role, profile, target);
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi ke server Supabase. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#DDF0FA] via-[#E8F5FC] to-[#EBF5FA] flex items-center justify-center p-4 relative">
      
      {/* BACK TO HOME BUTTON */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-slate-800 font-extrabold text-xs shadow-md border border-slate-200 hover:bg-slate-100 transition-all"
      >
        <ArrowLeft className="w-4 h-4 text-[#236F9E]" />
        <span>Kembali ke Beranda</span>
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-2xl relative my-12">
        
        {/* BRANDING HEADER */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#236F9E] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Waves className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">
            Portal Login KKN RT 35
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-1">
            Kelurahan Manggar 2, Balikpapan Timur
          </p>
        </div>

        {/* ERROR ALERT */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              NIM Mahasiswa / User ID
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan NIM (contoh: 2311050)"
                value={nimInput}
                onChange={(e) => setNimInput(e.target.value)}
                disabled={isLoading}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#236F9E] focus:bg-white disabled:opacity-60"
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
              Password System
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Masukkan Password Anda"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                disabled={isLoading}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#236F9E] focus:bg-white disabled:opacity-60"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#236F9E] hover:bg-[#1C597E] text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 text-white animate-spin" />
                <span>Memverifikasi Databased Supabase...</span>
              </>
            ) : (
              <span>Masuk Ke Portal</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 font-semibold text-center mt-6 border-t border-slate-100 pt-4">
          Hak Cipta © 2026 Tim KKN RT 35 Kelurahan Manggar 2.
        </p>

      </div>

    </div>
  );
};
