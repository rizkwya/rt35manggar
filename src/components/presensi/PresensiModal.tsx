import React, { useState } from 'react';
import { UserProfile, PresensiRecord } from '../../types/database';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  FileText, 
  Camera, 
  X, 
  Check, 
  History, 
  Send,
  AlertCircle
} from 'lucide-react';

interface PresensiModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  presensiList: PresensiRecord[];
  onAddPresensi: (record: PresensiRecord) => void;
}

export const PresensiModal: React.FC<PresensiModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  presensiList,
  onAddPresensi
}) => {
  const [activeTab, setActiveTab] = useState<'input' | 'riwayat'>('input');
  const [status, setStatus] = useState<'Hadir' | 'Izin' | 'Sakit'>('Hadir');
  const [logbookText, setLogbookText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen || !userProfile) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const userTodayRecord = presensiList.find(
    (p) => p.user_id === userProfile.id && p.date === todayStr
  );

  const handleSubmitPresensi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logbookText.trim()) return;

    const newRecord: PresensiRecord = {
      id: 'pr_' + Date.now(),
      user_id: userProfile.id,
      user_name: userProfile.full_name,
      user_nim: userProfile.nim || '220101001',
      date: todayStr,
      check_in_time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA',
      status: status,
      logbook_text: logbookText,
      created_at: new Date().toISOString(),
    };

    onAddPresensi(newRecord);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setLogbookText('');
      setActiveTab('riwayat');
    }, 1500);
  };

  const userRecords = presensiList.filter((p) => p.user_id === userProfile.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 border-2 border-beach-sky shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* USER PROFILE INFO HEADER */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <img
            src={userProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={userProfile.full_name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-beach-palm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-slate-800 text-base">{userProfile.full_name}</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                {userProfile.nim}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">{userProfile.prodi} • Presensi Digital KKN</p>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex border-b border-slate-100 my-4">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'input'
                ? 'border-beach-palm text-beach-palm-dark bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Input Presensi Hari Ini
          </button>

          <button
            onClick={() => setActiveTab('riwayat')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'riwayat'
                ? 'border-beach-palm text-beach-palm-dark bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" /> Riwayat Presensi ({userRecords.length})
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="overflow-y-auto pr-1 flex-1">
          {activeTab === 'input' ? (
            <div>
              {userTodayRecord ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-extrabold text-slate-800 text-base">Presensi Hari Ini Sudah Tercatat!</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Jam Check-in: <span className="font-mono text-beach-blue-dark font-bold">{userTodayRecord.check_in_time}</span> | Status: <span className="font-extrabold text-slate-800">{userTodayRecord.status}</span>
                  </p>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-left text-xs text-slate-700">
                    <span className="font-bold text-slate-500 block mb-1">Uraian Logbook Hari Ini:</span>
                    {userTodayRecord.logbook_text}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitPresensi} className="space-y-4">
                  
                  {/* DATE & TIME CARD */}
                  <div className="p-3.5 rounded-2xl bg-[#F0F8FF] border border-beach-sky flex items-center justify-between text-xs text-slate-700 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-beach-blue-dark" />
                      Tanggal: <strong className="text-slate-900">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-beach-palm-dark font-mono font-bold">
                      <Clock className="w-4 h-4" />
                      {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA
                    </span>
                  </div>

                  {/* STATUS SELECTION */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Status Kehadiran:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['Hadir', 'Izin', 'Sakit'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStatus(st)}
                          className={`py-2.5 rounded-xl text-xs font-extrabold transition-all border ${
                            status === st
                              ? st === 'Hadir'
                                ? 'bg-beach-palm text-white border-beach-palm-dark shadow-palm'
                                : st === 'Izin'
                                ? 'bg-amber-500 text-white border-amber-600 shadow-sand'
                                : 'bg-rose-500 text-white border-rose-600 shadow-sm'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* LOGBOOK URAIAN KEGIATAN */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Logbook Uraian Kegiatan Harian *</span>
                      <span className="text-slate-400 font-normal">Wajib diisi</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tuliskan detail kegiatan KKN yang telah dilaksanakan hari ini..."
                      value={logbookText}
                      onChange={(e) => setLogbookText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-beach-blue"
                    />
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={submittedSuccess}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-beach-palm hover:bg-beach-palm-dark text-white font-extrabold text-xs shadow-palm transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submittedSuccess ? 'Menyimpan Presensi...' : 'Simpan Presensi Harian'}</span>
                  </button>

                </form>
              )}
            </div>
          ) : (
            /* RIWAYAT PRESENSI TAB */
            <div className="space-y-3">
              {userRecords.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">Belum ada riwayat presensi recorded.</div>
              ) : (
                userRecords.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-beach-blue" />
                        {rec.date}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        rec.status === 'Hadir' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}>
                        {rec.status} ({rec.check_in_time})
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200 font-medium">
                      {rec.logbook_text}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
