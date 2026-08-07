import React, { useState } from 'react';
import { MessageSquare, Shield, Clock, CheckCircle, Trash2, Mail, ExternalLink, Calendar, UserCheck } from 'lucide-react';
import { RTSettings, RTMessage } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

interface AspirasiTabProps {
  settings?: RTSettings;
  onSettingsUpdate?: (settings: RTSettings) => void;
  showSuccess: (msg: string) => void;
}

export const AspirasiTab: React.FC<AspirasiTabProps> = ({
  settings,
  onSettingsUpdate,
  showSuccess
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'aspirasi' | 'wajib_lapor'>('aspirasi');
  const [loading, setLoading] = useState(false);

  const messagesList = settings?.messages_list || [];

  // Filter messages based on type
  const aspirasiMessages = messagesList.filter(m => m.type === 'aspirasi');
  const wajibLaporMessages = messagesList.filter(m => m.type === 'wajib_lapor');

  const pendingAspirasiCount = aspirasiMessages.filter(m => m.status === 'pending').length;
  const pendingWajibLaporCount = wajibLaporMessages.filter(m => m.status === 'pending').length;

  const handleUpdateStatus = async (messageId: string, nextStatus: 'pending' | 'read' | 'resolved') => {
    if (!settings) return;
    setLoading(true);
    try {
      const updatedMessages = messagesList.map(m => {
        if (m.id === messageId) {
          return { ...m, status: nextStatus };
        }
        return m;
      });

      const updatedSettings: RTSettings = {
        ...settings,
        messages_list: updatedMessages
      };

      const savedSettings = await SupabaseService.updateSettings(updatedSettings);
      if (onSettingsUpdate) {
        onSettingsUpdate(savedSettings);
      }
      showSuccess('Status pesan berhasil diperbarui!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal memperbarui status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!settings || !confirm('Apakah Anda yakin ingin menghapus data laporan ini secara permanen?')) return;
    setLoading(true);
    try {
      const updatedMessages = messagesList.filter(m => m.id !== messageId);

      const updatedSettings: RTSettings = {
        ...settings,
        messages_list: updatedMessages
      };

      const savedSettings = await SupabaseService.updateSettings(updatedSettings);
      if (onSettingsUpdate) {
        onSettingsUpdate(savedSettings);
      }
      showSuccess('Data laporan berhasil dihapus!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menghapus data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-tabs switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('aspirasi')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 ${
            activeSubTab === 'aspirasi'
              ? 'border-[#1E4D6B] text-[#1E4D6B]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Aspirasi & Pengaduan Warga</span>
          {pendingAspirasiCount > 0 && (
            <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
              {pendingAspirasiCount} Baru
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('wajib_lapor')}
          className={`px-6 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center space-x-2 ${
            activeSubTab === 'wajib_lapor'
              ? 'border-[#1E4D6B] text-[#1E4D6B]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Wajib Lapor Tamu (1x24 Jam)</span>
          {pendingWajibLaporCount > 0 && (
            <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
              {pendingWajibLaporCount} Baru
            </span>
          )}
        </button>
      </div>

      {activeSubTab === 'aspirasi' ? (
        /* ASPIRASI TABLE LIST */
        <div className="premium-card p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">Kotak Masuk Saran & Aspirasi</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Daftar aspirasi, masukan, pengaduan kebersihan, dan keamanan dari warga RT 35.</p>
          </div>

          {aspirasiMessages.length === 0 ? (
            <div className="text-center py-12 text-xs font-semibold text-slate-400">
              Belum ada pesan aspirasi masuk dari warga.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 w-1/5">Pengirim & Kontak</th>
                    <th className="pb-3 w-2/5">Isi Pesan/Aspirasi</th>
                    <th className="pb-3 w-1/5">Tanggal Masuk</th>
                    <th className="pb-3 w-1/10">Status</th>
                    <th className="pb-3 w-1/10 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {aspirasiMessages.map((m) => (
                    <tr key={m.id} className={`hover:bg-slate-50/50 ${m.status === 'pending' ? 'bg-[#1E4D6B]/5 font-black' : ''}`}>
                      <td className="py-4 pr-3">
                        <div className="text-slate-900 font-black">{m.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{m.phone || '-'}</div>
                      </td>
                      <td className="py-4 pr-3 leading-relaxed text-slate-650 font-medium">
                        {m.message}
                      </td>
                      <td className="py-4 pr-3 text-slate-450 font-semibold">
                        {new Date(m.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-4 pr-3">
                        {m.status === 'pending' ? (
                          <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-250 px-2 py-0.5 rounded-full animate-pulse">Pending</span>
                        ) : m.status === 'read' ? (
                          <span className="text-[9px] font-black text-[#1E4D6B] bg-[#1E4D6B]/10 border border-[#1E4D6B]/25 px-2 py-0.5 rounded-full">Dibaca</span>
                        ) : (
                          <span className="text-[9px] font-black text-[#5F8D4E] bg-[#85A389]/10 border border-[#85A389]/25 px-2 py-0.5 rounded-full">Selesai</span>
                        )}
                      </td>
                      <td className="py-4 text-right space-x-1.5">
                        {m.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(m.id, 'read')}
                            className="p-1 rounded text-[#1E4D6B] hover:bg-[#1E4D6B]/10"
                            title="Tandai Dibaca"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {m.status === 'read' && (
                          <button
                            onClick={() => handleUpdateStatus(m.id, 'resolved')}
                            className="p-1 rounded text-[#5F8D4E] hover:bg-[#85A389]/10"
                            title="Selesaikan Aspirasi"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-600 hover:bg-rose-55"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* GUEST REPORT TABLE LIST */
        <div className="premium-card p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">Arsip Wajib Lapor Tamu 1x24 Jam</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Daftar laporan kedatangan tamu menginap yang dilaporkan oleh warga/penanggung jawab.</p>
          </div>

          {wajibLaporMessages.length === 0 ? (
            <div className="text-center py-12 text-xs font-semibold text-slate-400">
              Belum ada laporan tamu masuk.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Tamu (NIK)</th>
                    <th className="pb-3">Hubungan</th>
                    <th className="pb-3">Tuan Rumah</th>
                    <th className="pb-3">Stay Mulai</th>
                    <th className="pb-3">Durasi</th>
                    <th className="pb-3">Kontak Lapor</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {wajibLaporMessages.map((m) => (
                    <tr key={m.id} className={`hover:bg-slate-50/50 ${m.status === 'pending' ? 'bg-[#1E4D6B]/5 font-black' : ''}`}>
                      <td className="py-4 pr-3">
                        <div className="text-slate-900 font-black">{m.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">NIK: {m.guestNik || '-'}</div>
                      </td>
                      <td className="py-4 pr-3 font-semibold text-slate-700">{m.relation || '-'}</td>
                      <td className="py-4 pr-3 font-black text-slate-800">{m.hostName || '-'}</td>
                      <td className="py-4 pr-3 text-slate-500">
                        {m.startDate ? new Date(m.startDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : '-'}
                      </td>
                      <td className="py-4 pr-3">{m.duration ? `${m.duration} Hari` : '-'}</td>
                      <td className="py-4 pr-3 font-mono text-slate-500">{m.phone || '-'}</td>
                      <td className="py-4 pr-3">
                        {m.status === 'pending' ? (
                          <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-250 px-2 py-0.5 rounded-full animate-pulse">Menunggu</span>
                        ) : m.status === 'read' ? (
                          <span className="text-[9px] font-black text-[#1E4D6B] bg-[#1E4D6B]/10 border border-[#1E4D6B]/25 px-2 py-0.5 rounded-full">Diterima</span>
                        ) : (
                          <span className="text-[9px] font-black text-[#5F8D4E] bg-[#85A389]/10 border border-[#85A389]/25 px-2 py-0.5 rounded-full">Selesai</span>
                        )}
                      </td>
                      <td className="py-4 text-right space-x-1.5">
                        {m.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(m.id, 'read')}
                            className="p-1 rounded text-[#1E4D6B] hover:bg-[#1E4D6B]/10"
                            title="Konfirmasi / Terima Laporan"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {m.status === 'read' && (
                          <button
                            onClick={() => handleUpdateStatus(m.id, 'resolved')}
                            className="p-1 rounded text-[#5F8D4E] hover:bg-[#85A389]/10"
                            title="Selesaikan Status Tamu"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-600 hover:bg-rose-55"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
