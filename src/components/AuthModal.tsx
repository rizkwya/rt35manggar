import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types/database';
import { OFFICIAL_TEAM } from '../lib/supabase';
import { Code2, GraduationCap, Lock, ShieldCheck, UserCheck, X, Check, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole, profile: UserProfile | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('mahasiswa');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(OFFICIAL_TEAM[0].id);

  if (!isOpen) return null;

  const handleConfirmLogin = () => {
    if (selectedRole === 'public') {
      onSelectRole('public', null);
    } else {
      const member = OFFICIAL_TEAM.find((m) => m.id === selectedMemberId) || OFFICIAL_TEAM[0];
      const profile: UserProfile = {
        id: member.id,
        email: `${member.nim}@fasilkom.ac.id`,
        full_name: member.name,
        role: selectedRole,
        prodi: member.prodi,
        nim: member.nim,
        avatar_url: member.avatar_url,
      };
      onSelectRole(selectedRole, profile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border-2 border-beach-sky shadow-2xl">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-beach-blue text-white p-0.5 mx-auto mb-3 shadow-beach flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-black text-slate-800">Akses Sistem & Role</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Pilih peran Anda untuk mengakses fitur presensi atau CMS developer</p>
        </div>

        {/* ROLE SELECTION CARDS */}
        <div className="space-y-3 mb-6">
          
          {/* OPTION 1: MAHASISWA */}
          <div
            onClick={() => setSelectedRole('mahasiswa')}
            className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
              selectedRole === 'mahasiswa'
                ? 'bg-emerald-50 border-beach-palm text-slate-800 shadow-palm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${selectedRole === 'mahasiswa' ? 'bg-beach-palm text-white' : 'bg-slate-200 text-slate-600'}`}>
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">Mahasiswa KKN</h4>
                <p className="text-xs text-slate-500 font-medium">Akses fitur presensi harian & isi logbook</p>
              </div>
            </div>
            {selectedRole === 'mahasiswa' && <Check className="w-5 h-5 text-beach-palm-dark" />}
          </div>

          {/* OPTION 2: DEVELOPER / ADMIN */}
          <div
            onClick={() => setSelectedRole('developer')}
            className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
              selectedRole === 'developer'
                ? 'bg-amber-50 border-amber-400 text-slate-800 shadow-sand'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${selectedRole === 'developer' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">Developer / Admin CMS</h4>
                <p className="text-xs text-slate-500 font-medium">Posting berita realtime, edit proker, & export presensi</p>
              </div>
            </div>
            {selectedRole === 'developer' && <Check className="w-5 h-5 text-amber-600" />}
          </div>

          {/* OPTION 3: PUBLIC */}
          <div
            onClick={() => setSelectedRole('public')}
            className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
              selectedRole === 'public'
                ? 'bg-[#F0F8FF] border-beach-blue text-slate-800 shadow-beach'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${selectedRole === 'public' ? 'bg-beach-blue text-white' : 'bg-slate-200 text-slate-600'}`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">Pengunjung Publik</h4>
                <p className="text-xs text-slate-500 font-medium">Hanya melihat landing page, berita, & proker</p>
              </div>
            </div>
            {selectedRole === 'public' && <Check className="w-5 h-5 text-beach-blue-dark" />}
          </div>

        </div>

        {/* SELECT ANGGOTA TIM (IF MAHASISWA OR DEVELOPER) */}
        {selectedRole !== 'public' && (
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Pilih Identitas Anggota KKN:
            </label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-beach-blue"
            >
              {OFFICIAL_TEAM.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.nim}) - {m.role_kkn}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ACTION SUBMIT */}
        <button
          onClick={handleConfirmLogin}
          className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-beach-blue hover:bg-beach-blue-dark text-white font-extrabold text-xs shadow-beach transition-all"
        >
          <span>Masuk Sebagai {selectedRole.toUpperCase()}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
