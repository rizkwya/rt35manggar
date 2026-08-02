import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { KeyRound, UserCheck, AlertCircle, ArrowLeft, Lock, ShieldCheck, Anchor } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, profile: UserProfile, redirectTo: 'presensi' | 'dashboard') => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedInput = usernameInput.trim();
    const trimmedPass = passwordInput.trim();

    if (!trimmedInput || !trimmedPass) {
      setErrorMsg('Harap isi Username/NIM dan Password Anda.');
      return;
    }

    setIsLoading(true);

    try {
      const profile = await SupabaseService.authenticateUser(trimmedInput, trimmedPass);

      if (!profile) {
        setErrorMsg('Kredensial tidak valid: Username/NIM atau Password salah.');
        setIsLoading(false);
        return;
      }

      const role: UserRole = profile.role;
      const target = role === 'mahasiswa' ? 'presensi' : 'dashboard';
      onLoginSuccess(role, profile, target);
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi ke database Supabase Cloud.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 relative selection:bg-[#85A389] selection:text-white">

      {/* BACK TO HOME BUTTON */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-slate-700 font-bold text-xs shadow-sm border border-slate-200 hover:bg-slate-100 transition-all"
      >
        <ArrowLeft className="w-4 h-4 text-[#85A389]" />
        <span>Kembali ke Portal RT 35</span>
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative my-12 space-y-6">

        {/* SECURE HEADER */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E4D6B] via-[#85A389] to-[#E5D3B3] text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-[#1E4D6B] tracking-tight">
            Login Admin RT 35
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            Portal Khusus Pengurus RT 35 & Tim KKN Kelompok 7
          </p>
        </div>

        {/* ERROR ALERT */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SECURE LOGIN FORM */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Username / NIM Mahasiswa
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan Username / NIM"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                disabled={isLoading}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#85A389] focus:bg-white disabled:opacity-60"
                required
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-650 uppercase tracking-wider mb-1.5">
              Password Sistem
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Masukkan Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                disabled={isLoading}
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#85A389] focus:bg-white disabled:opacity-60"
                required
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1E4D6B] via-[#85A389] to-[#E5D3B3] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Masuk Ke Dashboard Admin</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center space-y-1">
          <p className="text-[10px] text-slate-500 font-semibold flex items-center justify-center gap-1.5">
            <img src="/logo.png" alt="Logo RT 35" className="w-4 h-4 object-contain" />
            <span>Terhubung ke Supabase Cloud Enterprise Database</span>
          </p>
          <p className="text-[9px] text-slate-400">
            Hak Cipta © 2026 Portal Resmi RT 35 Kelurahan Manggar 2
          </p>
        </div>

      </div>

    </div>
  );
};
export default LoginPage;
