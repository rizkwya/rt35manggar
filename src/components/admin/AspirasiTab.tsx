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

  // Search & Pagination States
  const [searchAspirasi, setSearchAspirasi] = useState('');
  const [currentPageAspirasi, setCurrentPageAspirasi] = useState(1);
  
  const [searchLapor, setSearchLapor] = useState('');
  const [currentPageLapor, setCurrentPageLapor] = useState(1);

  const itemsPerPage = 11;

  const messagesList = settings?.messages_list || [];

  // Filter messages based on type
  const aspirasiMessages = messagesList.filter(m => m.type === 'aspirasi');
  const wajibLaporMessages = messagesList.filter(m => m.type === 'wajib_lapor');

  // Filter by Search Query
  const filteredAspirasi = aspirasiMessages.filter(m => 
    m.name.toLowerCase().includes(searchAspirasi.toLowerCase()) ||
    (m.message || '').toLowerCase().includes(searchAspirasi.toLowerCase()) ||
    (m.phone || '').includes(searchAspirasi)
  );

  const filteredLapor = wajibLaporMessages.filter(m => 
    m.name.toLowerCase().includes(searchLapor.toLowerCase()) ||
    (m.guestNik || '').includes(searchLapor) ||
    (m.hostName || '').toLowerCase().includes(searchLapor.toLowerCase()) ||
    (m.phone || '').includes(searchLapor)
  );

  // Reset pagination on search or list change
  React.useEffect(() => {
    setCurrentPageAspirasi(1);
  }, [searchAspirasi, aspirasiMessages.length]);

  React.useEffect(() => {
    setCurrentPageLapor(1);
  }, [searchLapor, wajibLaporMessages.length]);

  const pendingAspirasiCount = aspirasiMessages.filter(m => m.status === 'pending').length;
  const pendingWajibLaporCount = wajibLaporMessages.filter(m => m.status === 'pending').length;

  const formatWhatsAppLink = (phone: string) => {
    if (!phone) return '#';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    return `https://wa.me/${cleaned}`;
  };

  const handleUpdateStatus = async (messageId: string, nextStatus: 'pending' | 'read' | 'resolved') => {
    if (!settings) return;
    
    // Optimistic update for instant UI feedback
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

    if (onSettingsUpdate) {
      onSettingsUpdate(updatedSettings);
    }

    setLoading(true);
    try {
      await SupabaseService.updateSettings(updatedSettings);
      showSuccess('Status pesan berhasil diperbarui!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal memperbarui status: ' + err.message);
      // Revert state if api fails
      if (onSettingsUpdate) {
        onSettingsUpdate(settings);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!settings || !confirm('Apakah Anda yakin ingin menghapus data laporan ini secara permanen?')) return;
    
    // Optimistic update for instant UI feedback
    const updatedMessages = messagesList.filter(m => m.id !== messageId);

    const updatedSettings: RTSettings = {
      ...settings,
      messages_list: updatedMessages
    };

    if (onSettingsUpdate) {
      onSettingsUpdate(updatedSettings);
    }

    setLoading(true);
    try {
      await SupabaseService.updateSettings(updatedSettings);
      showSuccess('Data laporan berhasil dihapus!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menghapus data: ' + err.message);
      // Revert state if api fails
      if (onSettingsUpdate) {
        onSettingsUpdate(settings);
      }
    } finally {
      setLoading(false);
    }
  };

  // Pagination Slice
  const totalPagesAspirasi = Math.ceil(filteredAspirasi.length / itemsPerPage);
  const paginatedAspirasi = filteredAspirasi.slice(
    (currentPageAspirasi - 1) * itemsPerPage,
    currentPageAspirasi * itemsPerPage
  );

  const totalPagesLapor = Math.ceil(filteredLapor.length / itemsPerPage);
  const paginatedLapor = filteredLapor.slice(
    (currentPageLapor - 1) * itemsPerPage,
    currentPageLapor * itemsPerPage
  );

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Kotak Masuk Saran & Aspirasi</h3>
              <p className="text-xs text-slate-505 font-semibold mt-1">Daftar aspirasi, masukan, pengaduan kebersihan, dan keamanan dari warga RT 35.</p>
            </div>
            
            {/* Search Input */}
            <div className="flex items-center space-x-2">
              <input 
                type="text"
                placeholder="Cari nama, pesan, kontak..."
                value={searchAspirasi}
                onChange={(e) => setSearchAspirasi(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400"
              />
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full shrink-0">
                {filteredAspirasi.length} Data
              </span>
            </div>
          </div>

          {filteredAspirasi.length === 0 ? (
            <div className="text-center py-12 text-xs font-semibold text-slate-400">
              Tidak ada data aspirasi yang cocok atau belum ada pesan masuk.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold text-slate-700 min-w-[700px]">
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
                    {paginatedAspirasi.map((m) => (
                      <tr key={m.id} className={`hover:bg-slate-50/50 ${m.status === 'pending' ? 'bg-[#1E4D6B]/5 font-black' : ''}`}>
                        <td className="py-4 pr-3">
                          <div className="text-slate-900 font-black">{m.name}</div>
                          {m.phone ? (
                            <a 
                              href={formatWhatsAppLink(m.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1 mt-0.5 font-mono"
                              title="Hubungi via WhatsApp"
                            >
                              <span>{m.phone}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          ) : (
                            <div className="text-[10px] text-slate-400 mt-0.5">-</div>
                          )}
                        </td>
                        <td className="py-4 pr-3 leading-relaxed text-slate-650 font-medium whitespace-pre-wrap break-all">
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
                        <td className="py-4 text-right space-x-1.5 whitespace-nowrap">
                          {m.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(m.id, 'read')}
                              className="p-1 rounded text-[#1E4D6B] hover:bg-[#1E4D6B]/10"
                              title="Tandai Dibaca"
                            >
                              <CheckCircle className="w-3.5 h-3.5 inline" />
                            </button>
                          )}
                          {m.status === 'read' && (
                            <button
                              onClick={() => handleUpdateStatus(m.id, 'resolved')}
                              className="p-1 rounded text-[#5F8D4E] hover:bg-[#85A389]/10"
                              title="Selesaikan Aspirasi"
                            >
                              <CheckCircle className="w-3.5 h-3.5 inline" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="p-1 rounded text-rose-500 hover:text-rose-600 hover:bg-rose-55"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPagesAspirasi > 1 && (
                <div className="flex items-center justify-center space-x-1.5 pt-2">
                  <button
                    onClick={() => setCurrentPageAspirasi((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPageAspirasi === 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8"
                    aria-label="Previous page"
                  >
                    &larr;
                  </button>
                  {Array.from({ length: totalPagesAspirasi }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPageAspirasi(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-black transition-all active:scale-95 border ${
                        currentPageAspirasi === p
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPageAspirasi((prev) => Math.min(prev + 1, totalPagesAspirasi))}
                    disabled={currentPageAspirasi === totalPagesAspirasi}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8"
                    aria-label="Next page"
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* GUEST REPORT TABLE LIST */
        <div className="premium-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Arsip Wajib Lapor Tamu 1x24 Jam</h3>
              <p className="text-xs text-slate-505 font-semibold mt-1">Daftar laporan kedatangan tamu menginap yang dilaporkan oleh warga/penanggung jawab.</p>
            </div>
            
            {/* Search Input */}
            <div className="flex items-center space-x-2">
              <input 
                type="text"
                placeholder="Cari nama, NIK, tuan rumah..."
                value={searchLapor}
                onChange={(e) => setSearchLapor(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-400"
              />
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full shrink-0">
                {filteredLapor.length} Data
              </span>
            </div>
          </div>

          {filteredLapor.length === 0 ? (
            <div className="text-center py-12 text-xs font-semibold text-slate-400">
              Tidak ada data lapor tamu yang cocok atau belum ada laporan masuk.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-bold text-slate-700 min-w-[850px]">
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
                    {paginatedLapor.map((m) => (
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
                        <td className="py-4 pr-3">
                          {m.phone ? (
                            <a 
                              href={formatWhatsAppLink(m.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1 font-mono font-bold"
                              title="Hubungi via WhatsApp"
                            >
                              <span>{m.phone}</span>
                              <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                            </a>
                          ) : (
                            <div className="text-xs text-slate-500 font-mono">-</div>
                          )}
                        </td>
                        <td className="py-4 pr-3">
                          {m.status === 'pending' ? (
                            <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-250 px-2 py-0.5 rounded-full animate-pulse">Menunggu</span>
                          ) : m.status === 'read' ? (
                            <span className="text-[9px] font-black text-[#1E4D6B] bg-[#1E4D6B]/10 border border-[#1E4D6B]/25 px-2 py-0.5 rounded-full">Diterima</span>
                          ) : (
                            <span className="text-[9px] font-black text-[#5F8D4E] bg-[#85A389]/10 border border-[#85A389]/25 px-2 py-0.5 rounded-full">Selesai</span>
                          )}
                        </td>
                        <td className="py-4 text-right space-x-1.5 whitespace-nowrap">
                          {m.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(m.id, 'read')}
                              className="p-1 rounded text-[#1E4D6B] hover:bg-[#1E4D6B]/10"
                              title="Konfirmasi / Terima Laporan"
                            >
                              <CheckCircle className="w-3.5 h-3.5 inline" />
                            </button>
                          )}
                          {m.status === 'read' && (
                            <button
                              onClick={() => handleUpdateStatus(m.id, 'resolved')}
                              className="p-1 rounded text-[#5F8D4E] hover:bg-[#85A389]/10"
                              title="Selesaikan Status Tamu"
                            >
                              <CheckCircle className="w-3.5 h-3.5 inline" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="p-1 rounded text-rose-500 hover:text-rose-600 hover:bg-rose-55"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPagesLapor > 1 && (
                <div className="flex items-center justify-center space-x-1.5 pt-2">
                  <button
                    onClick={() => setCurrentPageLapor((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPageLapor === 1}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8"
                    aria-label="Previous page"
                  >
                    &larr;
                  </button>
                  {Array.from({ length: totalPagesLapor }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPageLapor(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-black transition-all active:scale-95 border ${
                        currentPageLapor === p
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPageLapor((prev) => Math.min(prev + 1, totalPagesLapor))}
                    disabled={currentPageLapor === totalPagesLapor}
                    className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-extrabold text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center min-w-[32px] h-8"
                    aria-label="Next page"
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
