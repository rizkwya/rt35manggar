import React, { useState } from 'react';
import { UserProfile, PresensiRecord } from '../types/database';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  LogOut, 
  UserCheck, 
  Waves, 
  ExternalLink, 
  PlusCircle, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface MahasiswaDashboardPageProps {
  userProfile: UserProfile;
  presensiList: PresensiRecord[];
  onAddPresensi: (record: PresensiRecord) => void;
  onGoToLanding: () => void;
  onLogout: () => void;
}

export const MahasiswaDashboardPage: React.FC<MahasiswaDashboardPageProps> = ({
  userProfile,
  presensiList,
  onAddPresensi,
  onGoToLanding,
  onLogout,
}) => {
  const [statusInput, setStatusInput] = useState<'Hadir' | 'Izin' | 'Sakit'>('Hadir');
  const [logbookInput, setLogbookInput] = useState('');
  const [checkOutInput, setCheckOutInput] = useState('17:00 WITA');
  const [successAlert, setSuccessAlert] = useState(false);

  // Filter presensi history for current user
  const userHistory = presensiList.filter((p) => p.user_nim === userProfile.nim || p.user_name === userProfile.full_name);

  // Calculate statistics
  const totalHadir = userHistory.filter((p) => p.status === 'Hadir').length;
  const totalIzin = userHistory.filter((p) => p.status === 'Izin').length;
  const totalSakit = userHistory.filter((p) => p.status === 'Sakit').length;

  const handleSubmitPresensi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logbookInput.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';

    const newRecord: PresensiRecord = {
      id: 'pres-' + Date.now(),
      user_id: userProfile.id || 'usr-' + (userProfile.nim || '000'),
      user_name: userProfile.full_name,
      user_nim: userProfile.nim || '2311050',
      date: new Date().toISOString().split('T')[0],
      check_in_time: timeString,
      check_out_time: checkOutInput,
      status: statusInput,
      logbook_text: logbookInput,
      created_at: new Date().toISOString(),
    };

    onAddPresensi(newRecord);
    setLogbookInput('');
    setSuccessAlert(true);
    setTimeout(() => setSuccessAlert(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* TOP DASHBOARD HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* BRANDING */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#236F9E] text-white flex items-center justify-center shadow-md">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-black text-slate-900 text-base leading-tight">
                  PORTAL MAHASISWA KKN
                </h1>
                <p className="text-[11px] font-extrabold text-[#4F9460]">
                  RT 35 Manggar 2 • Presensi & Logbook
                </p>
              </div>
            </div>

            {/* USER PROFILE & ACTIONS */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onGoToLanding}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#DDF0FA] hover:bg-blue-100 text-[#1C597E] font-black text-xs border border-blue-200 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>🌐 Lihat Landing Page Publik</span>
              </button>

              <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200">
                <img
                  src={userProfile.avatar_url}
                  alt={userProfile.full_name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#4F9460]"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-slate-900 line-clamp-1">{userProfile.full_name}</p>
                  <p className="text-[10px] text-slate-500 font-mono font-bold">NIM: {userProfile.nim}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all"
                title="Keluar / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* DASHBOARD CONTENT BODY */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* WELCOME BANNER */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#236F9E] via-[#1C597E] to-[#4F9460] text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Sistem Presensi Digital Terverifikasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Selamat Datang, {userProfile.full_name}!
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-semibold mt-1">
              Program Studi: <strong className="text-white font-bold">{userProfile.prodi}</strong> • NIM: <strong className="text-white font-mono">{userProfile.nim}</strong>
            </p>
          </div>
        </div>

        {/* QUICK STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Hadir</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-1">{totalHadir} Hari</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Izin</p>
              <h3 className="text-3xl font-black text-amber-600 mt-1">{totalIzin} Hari</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Sakit</p>
              <h3 className="text-3xl font-black text-rose-600 mt-1">{totalSakit} Hari</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* MAIN 2-COLUMN GRID: FORM PRESENSI & RIWAYAT LOGBOOK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: FORM INPUT PRESENSI HARI INI */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-[#4F9460] font-black text-xs mb-1">
                <PlusCircle className="w-4 h-4" />
                <span>INPUT PRESENSI & LOGBOOK HARI INI</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Form Presensi Harian
              </h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Tanggal: <strong className="text-slate-900">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </p>
            </div>

            {successAlert && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Presensi & Logbook berhasil tersimpan ke sistem!</span>
              </div>
            )}

            <form onSubmit={handleSubmitPresensi} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Status Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Hadir', 'Izin', 'Sakit'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusInput(st)}
                      className={`py-2.5 rounded-xl text-xs font-black border transition-all ${
                        statusInput === st
                          ? st === 'Hadir'
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                            : st === 'Izin'
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-rose-600 text-white border-rose-700 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Jam Rencana Pulang / Check-Out
                </label>
                <input
                  type="text"
                  value={checkOutInput}
                  onChange={(e) => setCheckOutInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#236F9E]"
                  placeholder="Contoh: 17:00 WITA"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Uraian Kegiatan / Logbook Harian
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan kegiatan pengabdian KKN yang Anda lakukan hari ini di RT 35..."
                  value={logbookInput}
                  onChange={(e) => setLogbookInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#236F9E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#4F9460] hover:bg-[#3F774F] text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Kirim Presensi & Logbook</span>
              </button>
            </form>
          </div>

          {/* RIGHT: RIWAYAT LOGBOOK SAYA */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-[#236F9E] font-black text-xs mb-1">
                <FileText className="w-4 h-4" />
                <span>RIWAYAT CATATAN KEGIATAN</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Logbook & Histori Presensi Anda
              </h3>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {userHistory.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-black text-slate-700">Belum ada riwayat presensi</p>
                  <p className="text-[11px] text-slate-500 font-semibold">Isi form di sebelah kiri untuk mengirim presensi pertama Anda.</p>
                </div>
              ) : (
                userHistory.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#236F9E] transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          rec.status === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'Izin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          • {rec.status}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600">
                          {rec.date}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        Masuk: {rec.check_in_time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                      "{rec.logbook_text}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </main>

    </div>
  );
};
