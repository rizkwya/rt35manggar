import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  MessageSquare, 
  Shield, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Mail, 
  ExternalLink, 
  Calendar, 
  Eye, 
  X, 
  Search, 
  Phone, 
  User, 
  Check, 
  AlertTriangle,
  RotateCcw,
  Loader2,
  Share2,
  Home
} from 'lucide-react';
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'read' | 'resolved'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Search & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals state
  const [selectedMessage, setSelectedMessage] = useState<RTMessage | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Lock background scrolling when any modal is open
  React.useEffect(() => {
    if (selectedMessage || deleteTargetId) {
      const originalOverflow = document.body.style.overflow;
      const originalTouch = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouch;
      };
    }
  }, [selectedMessage, deleteTargetId]);

  const messagesList = settings?.messages_list || [];

  // Filter messages based on sub-tab
  const currentTabMessages = messagesList.filter(m => m.type === activeSubTab);

  // Filter by Status & Search Query
  const filteredMessages = currentTabMessages.filter(m => {
    // Status Filter
    if (statusFilter !== 'all' && m.status !== statusFilter) {
      return false;
    }

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    
    if (activeSubTab === 'aspirasi') {
      return (
        m.name.toLowerCase().includes(q) ||
        (m.message || '').toLowerCase().includes(q) ||
        (m.phone || '').includes(q)
      );
    } else {
      return (
        m.name.toLowerCase().includes(q) ||
        (m.guestNik || '').includes(q) ||
        (m.hostName || '').toLowerCase().includes(q) ||
        (m.phone || '').includes(q) ||
        (m.relation || '').toLowerCase().includes(q)
      );
    }
  });

  // Reset pagination on sub-tab, search, or status filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeSubTab, searchQuery, statusFilter, itemsPerPage]);

  const pendingAspirasiCount = messagesList.filter(m => m.type === 'aspirasi' && m.status === 'pending').length;
  const pendingWajibLaporCount = messagesList.filter(m => m.type === 'wajib_lapor' && m.status === 'pending').length;

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
    setProcessingId(messageId);
    
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

    // Update inside modal if currently opened
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage({ ...selectedMessage, status: nextStatus });
    }

    try {
      await SupabaseService.updateSettings(updatedSettings);
      const statusLabels = {
        pending: 'Menunggu',
        read: 'Dibaca',
        resolved: 'Selesai'
      };
      showSuccess(`Status berhasil diubah menjadi: ${statusLabels[nextStatus]}`);
    } catch (err: any) {
      console.error(err);
      alert('Gagal memperbarui status: ' + err.message);
      if (onSettingsUpdate) {
        onSettingsUpdate(settings);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!settings || !deleteTargetId) return;
    const targetId = deleteTargetId;
    setProcessingId(targetId);
    
    const updatedMessages = messagesList.filter(m => m.id !== targetId);

    const updatedSettings: RTSettings = {
      ...settings,
      messages_list: updatedMessages
    };

    if (onSettingsUpdate) {
      onSettingsUpdate(updatedSettings);
    }

    if (selectedMessage && selectedMessage.id === targetId) {
      setSelectedMessage(null);
    }
    setDeleteTargetId(null);

    try {
      await SupabaseService.updateSettings(updatedSettings);
      showSuccess('Data pesan/laporan berhasil dihapus!');
    } catch (err: any) {
      console.error(err);
      alert('Gagal menghapus data: ' + err.message);
      if (onSettingsUpdate) {
        onSettingsUpdate(settings);
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. SUB-TABS SWITCHER */}
      <div className="bg-white p-2 border border-slate-200 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => { setActiveSubTab('aspirasi'); setStatusFilter('all'); setSearchQuery(''); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 ${
            activeSubTab === 'aspirasi'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Aspirasi & Pengaduan Warga</span>
          {pendingAspirasiCount > 0 && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              activeSubTab === 'aspirasi' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600'
            }`}>
              {pendingAspirasiCount} Baru
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => { setActiveSubTab('wajib_lapor'); setStatusFilter('all'); setSearchQuery(''); }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2.5 ${
            activeSubTab === 'wajib_lapor'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Wajib Lapor Tamu (1x24 Jam)</span>
          {pendingWajibLaporCount > 0 && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              activeSubTab === 'wajib_lapor' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600'
            }`}>
              {pendingWajibLaporCount} Baru
            </span>
          )}
        </button>
      </div>

      {/* 2. MAIN CONTAINER CARD */}
      <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
        
        {/* Header & Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              {activeSubTab === 'aspirasi' ? 'Kotak Masuk Saran & Aspirasi' : 'Arsip Wajib Lapor Tamu 1x24 Jam'}
            </h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">
              {activeSubTab === 'aspirasi' 
                ? 'Kelola aspirasi, masukan kebersihan, dan keamanan warga RT 35 secara real-time.' 
                : 'Daftar laporan kedatangan tamu menginap yang dilaporkan oleh warga/penanggung jawab.'}
            </p>
          </div>

          {/* Search, Filter & Items per page controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-initial min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Cari nama, kontak, isi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter Dropdown / Pill */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-800"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu (Pending)</option>
              <option value="read">Dibaca / Diterima</option>
              <option value="resolved">Selesai</option>
            </select>

            {/* Items Per Page */}
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-slate-800"
              title="Jumlah baris per halaman"
            >
              <option value={5}>5 Data</option>
              <option value={10}>10 Data</option>
              <option value={20}>20 Data</option>
            </select>

            {/* Total Data Count Badge */}
            <span className="text-xs font-black text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl shrink-0">
              {filteredMessages.length} Total
            </span>
          </div>
        </div>

        {/* 3. LIST / TABLE DATA */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Tidak ada data yang sesuai dengan filter atau pencarian Anda.'
                : 'Belum ada data pesan masuk di kategori ini.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
              <table className="w-full text-left text-xs font-bold text-slate-700 min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-[22%]">Pengirim / Tamu</th>
                    <th className="py-3.5 px-4 w-[38%]">{activeSubTab === 'aspirasi' ? 'Isi Aspirasi' : 'Detail Tuan Rumah & Durasi'}</th>
                    <th className="py-3.5 px-4 w-[18%]">Waktu Masuk</th>
                    <th className="py-3.5 px-4 w-[10%]">Status</th>
                    <th className="py-3.5 px-4 w-[12%] text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedMessages.map((m) => {
                    const isProcessing = processingId === m.id;
                    return (
                      <tr 
                        key={m.id} 
                        className={`hover:bg-slate-50/60 transition-colors ${
                          m.status === 'pending' ? 'bg-[#0b5665]/[0.03]' : ''
                        }`}
                      >
                        {/* Column 1: Sender & Contact */}
                        <td className="py-4 px-4 align-top">
                          <div className="text-slate-900 font-black text-xs">{m.name}</div>
                          {activeSubTab === 'wajib_lapor' && m.guestNik && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              NIK: {m.guestNik}
                            </div>
                          )}
                          {m.phone ? (
                            <a 
                              href={formatWhatsAppLink(m.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-slate-500 hover:text-emerald-600 transition-colors inline-flex items-center gap-1 mt-1 font-mono font-bold"
                              title="Hubungi Pengirim via WhatsApp"
                            >
                              <span>{m.phone}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">-</div>
                          )}
                        </td>

                        {/* Column 2: Message Content / Guest Details */}
                        <td className="py-4 px-4 align-top">
                          {activeSubTab === 'aspirasi' ? (
                            <div className="line-clamp-2 text-slate-700 leading-relaxed font-semibold">
                              {m.message || '-'}
                            </div>
                          ) : (
                            <div className="space-y-1 text-slate-700 text-xs">
                              <div>
                                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Tuan Rumah:</span>{' '}
                                <span className="font-bold text-slate-900">{m.hostName || '-'}</span>
                              </div>
                              <div className="text-[11px] text-slate-500 font-bold">
                                Hubungan: {m.relation || '-'} • Durasi: {m.duration ? `${m.duration} Hari` : '-'}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Column 3: Submission Date */}
                        <td className="py-4 px-4 align-top text-slate-500 text-[11px] font-bold">
                          {new Date(m.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>

                        {/* Column 4: Status Badge */}
                        <td className="py-4 px-4 align-top">
                          {m.status === 'pending' ? (
                            <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full inline-block">
                              Menunggu
                            </span>
                          ) : m.status === 'read' ? (
                            <span className="text-[10px] font-black text-[#0b5665] bg-[#0b5665]/10 border border-[#0b5665]/20 px-2.5 py-1 rounded-full inline-block">
                              Dibaca
                            </span>
                          ) : (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full inline-block">
                              Selesai
                            </span>
                          )}
                        </td>

                        {/* Column 5: Actions */}
                        <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            
                            {/* View Detail Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedMessage(m)}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                              title="Lihat Detail Pesan"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Status Advancement Button */}
                            {m.status === 'pending' && (
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleUpdateStatus(m.id, 'read')}
                                className="p-2 rounded-xl bg-[#0b5665]/10 hover:bg-[#0b5665]/20 text-[#0b5665] transition-all disabled:opacity-50"
                                title="Tandai Sudah Dibaca"
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            {m.status === 'read' && (
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleUpdateStatus(m.id, 'resolved')}
                                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all disabled:opacity-50"
                                title="Tandai Selesai"
                              >
                                {isProcessing ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeleteTargetId(m.id)}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
                              title="Hapus Pesan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 4. RESPONSIVE PAGINATION CONTROLS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-slate-400 font-bold">
                Menampilkan <span className="text-slate-700 font-black">{filteredMessages.length === 0 ? 0 : startIndex + 1}</span> - <span className="text-slate-700 font-black">{Math.min(startIndex + itemsPerPage, filteredMessages.length)}</span> dari <span className="text-slate-700 font-black">{filteredMessages.length}</span> data
              </p>

              {totalPages > 1 && (
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-black text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center h-9"
                    aria-label="Halaman sebelumnya"
                  >
                    &larr; Prev
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .map((p, idx, arr) => {
                        const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1;
                        return (
                          <React.Fragment key={p}>
                            {showEllipsisBefore && (
                              <span className="px-1 text-slate-400 text-xs font-black">...</span>
                            )}
                            <button
                              onClick={() => setCurrentPage(p)}
                              className={`w-9 h-9 rounded-xl text-xs font-black transition-all active:scale-95 border ${
                                currentPage === p
                                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-black text-xs transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center h-9"
                    aria-label="Halaman berikutnya"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* 5. DETAIL POPUP MODAL (MODERN, RESPONSIVE, STANDARD INTERNASIONAL) */}
      {typeof document !== 'undefined' && selectedMessage && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedMessage(null); }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto overscroll-contain touch-none select-none"
        >
          <div 
            className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-w-lg sm:max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden animate-scale-up max-h-[90vh] flex flex-col justify-between touch-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Top decorative accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${
              selectedMessage.type === 'aspirasi' 
                ? 'from-emerald-500 via-[#0b5665] to-teal-400' 
                : 'from-amber-500 via-orange-500 to-emerald-500'
            }`} />

            {/* Header with Close */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-2xl ${
                  selectedMessage.type === 'aspirasi' ? 'bg-[#0b5665]/10 text-[#0b5665]' : 'bg-amber-500/10 text-amber-600'
                }`}>
                  {selectedMessage.type === 'aspirasi' ? <MessageSquare className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 leading-tight">
                    {selectedMessage.type === 'aspirasi' ? 'Detail Aspirasi Warga' : 'Detail Laporan Tamu (1x24 Jam)'}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                    Diterima pada {new Date(selectedMessage.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                aria-label="Tutup popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="space-y-4 overflow-y-auto pr-1 text-xs font-semibold">
              
              {/* Profile Details Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nama Lengkap</span>
                  <span className="font-black text-slate-900">{selectedMessage.name}</span>
                </div>

                {selectedMessage.phone && (
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">No. HP / WhatsApp</span>
                    <a
                      href={formatWhatsAppLink(selectedMessage.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-black text-[#0b5665] hover:underline flex items-center gap-1"
                    >
                      <span>{selectedMessage.phone}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {selectedMessage.type === 'wajib_lapor' && (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">NIK Tamu</span>
                      <span className="font-mono font-black text-slate-900">{selectedMessage.guestNik || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Hubungan</span>
                      <span className="font-bold text-slate-800">{selectedMessage.relation || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tuan Rumah</span>
                      <span className="font-bold text-slate-800">{selectedMessage.hostName || '-'}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tanggal Menginap</span>
                      <span className="font-bold text-slate-800">
                        {selectedMessage.startDate ? new Date(selectedMessage.startDate).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Durasi</span>
                      <span className="font-bold text-slate-800">{selectedMessage.duration ? `${selectedMessage.duration} Hari` : '-'}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Pesan</span>
                  <div>
                    {selectedMessage.status === 'pending' ? (
                      <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">Menunggu</span>
                    ) : selectedMessage.status === 'read' ? (
                      <span className="text-[10px] font-black text-[#0b5665] bg-[#0b5665]/10 border border-[#0b5665]/20 px-2.5 py-0.5 rounded-full">Dibaca</span>
                    ) : (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">Selesai</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Box if Aspirasi */}
              {selectedMessage.type === 'aspirasi' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Isi Pesan / Saran Warga:</label>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message || 'Tidak ada pesan tertulis.'}
                  </div>
                </div>
              )}

            </div>

            {/* Footer Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              {selectedMessage.phone ? (
                <a
                  href={formatWhatsAppLink(selectedMessage.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm active:scale-98"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Balas via WhatsApp</span>
                </a>
              ) : <div />}

              <div className="flex items-center space-x-2">
                {selectedMessage.status !== 'resolved' ? (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedMessage.id, selectedMessage.status === 'pending' ? 'read' : 'resolved')}
                    className="px-4 py-2.5 rounded-xl bg-[#0b5665] hover:bg-[#08424e] text-white text-xs font-black transition-all shadow-sm active:scale-98"
                  >
                    {selectedMessage.status === 'pending' ? 'Tandai Dibaca' : 'Tandai Selesai'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'pending')}
                    className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black transition-all active:scale-98"
                  >
                    Kembalikan ke Pending
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {typeof document !== 'undefined' && deleteTargetId && createPortal(
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteTargetId(null); }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto overscroll-contain touch-none select-none"
        >
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-6 animate-scale-up touch-auto">
            <div className="w-14 h-14 rounded-full bg-rose-50 border-4 border-rose-100 mx-auto flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-black text-slate-900">Hapus Data Permanen?</h4>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Tindakan ini tidak dapat dibatalkan. Laporan ini akan dihapus permanen dari daftar arsip.
              </p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all shadow-md active:scale-98"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
