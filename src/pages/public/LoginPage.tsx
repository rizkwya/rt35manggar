import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { KeyRound, UserCheck, AlertCircle, ArrowLeft, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, profile: UserProfile, redirectTo: 'presensi' | 'dashboard') => void;
  onBackToHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-white text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* LEFT COLUMN: BRAND PANEL (teal-green background, simkopdes style) */}
      <div className="w-full md:w-1/2 bg-[#0b5665] flex flex-col justify-center items-center p-8 md:p-16 relative overflow-hidden shrink-0 min-h-[300px] md:min-h-screen">
        {/* Subtle background curved graphic overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,40 70,60 100,0 L100,100 Z" fill="#ffffff" />
          </svg>
        </div>

        <div className="relative z-10 text-center space-y-4 max-w-md">
          {/* Logo RT */}
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto border border-white/20 shadow-lg">
            <img src="/logo.png" alt="Logo RT 35" className="w-16 h-16 object-contain filter brightness-100" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
              RT 35 Manggar
            </h1>
            <p className="text-white/80 text-xs md:text-sm font-medium tracking-wide">
              Sistem Informasi & Manajemen Kemasyarakatan
            </p>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="absolute bottom-6 left-6 text-white/50 text-[10px] hidden md:block">
          Kelompok 7 KKN KKNMANGGAR2 © 2026
        </div>
      </div>

      {/* RIGHT COLUMN: LOGIN FORM PANEL (clean white, simkopdes style) */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 relative">
        
        <div className="w-full max-w-[420px] space-y-6">
          
          {/* Form Header */}
          <div className="space-y-2 text-left md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[#0b5665] tracking-tight">
              Masuk Ke Akun Portal Resmi RT 35 Manggar
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Gunakan akun pengurus RT, sekretaris, atau NIM mahasiswa KKN Anda untuk mengakses dashboard.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start space-x-2.5 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username atau NIM Mahasiswa <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Masukkan username atau NIM Anda"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] focus:ring-1 focus:ring-[#0b5665] bg-white transition-all disabled:opacity-60"
                  required
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Kata Sandi <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Silakan hubungi administrator IT/developer untuk melakukan reset password.')}
                  className="text-xs text-[#0b5665] hover:underline font-bold"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi Anda"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b5665] focus:ring-1 focus:ring-[#0b5665] bg-white transition-all disabled:opacity-60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#0b5665] hover:bg-[#094652] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-65"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk'}</span>
            </button>
          </form>

          {/* Footer Navigation & Notes */}
          <div className="pt-6 border-t border-slate-100 flex flex-col items-center space-y-4">
            <button
              onClick={onBackToHome}
              className="text-xs text-[#0b5665] hover:underline font-extrabold flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Halaman Utama</span>
            </button>

            <div className="text-center space-y-1">
              <p className="text-[9px] text-slate-400 font-bold">
                Hak Cipta © 2026 Portal Resmi RT 35 Kelurahan Manggar 2.
              </p>
              <p className="text-[8px] text-slate-400/80 font-semibold">
                Sistem ini terhubung ke Supabase Cloud Enterprise Database.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default LoginPage;
