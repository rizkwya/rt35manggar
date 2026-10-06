import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Download, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  QrCode, 
  Phone, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  X,
  User,
  Calendar,
  MapPin,
  Lock,
  Printer
} from 'lucide-react';
import { RTSuratRequest } from '../../types/database';
import { SupabaseService, supabase } from '../../lib/supabase';
import { generateHMACSHA256, generateQRCodeDataURL, formatIndonesianDate } from '../../lib/crypto';
import { downloadSuratPDF } from '../../lib/pdfGenerator';

export const LayananSuratTab: React.FC = () => {
  const [requests, setRequests] = useState<RTSuratRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'menunggu' | 'disetujui' | 'ditolak'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State for Approve
  const [approvingSurat, setApprovingSurat] = useState<RTSuratRequest | null>(null);
  const [nomorSuratInput, setNomorSuratInput] = useState('');
  const [penandatanganInput, setPenandatanganInput] = useState('H. AMIR');
  const [submittingApproval, setSubmittingApproval] = useState(false);

  // Modal State for Reject
  const [rejectingSurat, setRejectingSurat] = useState<RTSuratRequest | null>(null);
  const [alasanPenolakanInput, setAlasanPenolakanInput] = useState('');
  const [submittingRejection, setSubmittingRejection] = useState(false);

  // PDF Generating indicator
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();

    // Subscribe to realtime changes in rt_surat_requests
    const channel = supabase
      .channel('realtime-esurat-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rt_surat_requests' },
        () => {
          loadRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await SupabaseService.fetchAllSuratRequests();
      setRequests(data || []);
    } catch (e) {
      console.error('Failed to load surat requests:', e);
    } finally {
      setLoading(false);
    }
  };

  // Generate automated standard letter number format
  const getSuggestedNomorSurat = (indexOffset: number = 0) => {
    const currentYear = new Date().getFullYear();
    const monthsRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const currentMonth = monthsRomawi[new Date().getMonth()];
    
    // Count approved letters this year + offset
    const approvedCount = requests.filter(r => r.status === 'disetujui').length + 1 + indexOffset;
    const formattedCounter = String(approvedCount).padStart(3, '0');
    
    return `${formattedCounter}/RT35/MGR/BPT/${currentMonth}/${currentYear}`;
  };

  const handleOpenApproveModal = (surat: RTSuratRequest) => {
    setApprovingSurat(surat);
    setNomorSuratInput(getSuggestedNomorSurat());
    setPenandatanganInput('H. AMIR');
  };

  const handleConfirmApproval = async () => {
    if (!approvingSurat) return;
    if (!nomorSuratInput.trim()) {
      alert('Nomor surat wajib diisi.');
      return;
    }

    setSubmittingApproval(true);
    try {
      const tanggalTerbit = new Date().toISOString();
      
      // Cryptographic Payload for HMAC-SHA256
      const payload = `${nomorSuratInput.trim()}|${approvingSurat.nik}|${tanggalTerbit}|${approvingSurat.jenis_surat}|RT35_MANGGAR`;
      const tokenHash = generateHMACSHA256(payload);

      const success = await SupabaseService.approveSuratRequest(
        approvingSurat.id,
        nomorSuratInput.trim(),
        tokenHash,
        penandatanganInput.trim()
      );

      if (success) {
        // Open WhatsApp Web with notification template
        const cleanPhone = approvingSurat.phone_wa.replace(/\D/g, '').replace(/^0/, '62');
        const textMessage = encodeURIComponent(
          `Halo Bpk/Ibu *${approvingSurat.nama_pemohon}*,\n\nPermohonan *${approvingSurat.jenis_surat}* Anda di RT 35 Kelurahan Manggar telah *DISETUJUI* oleh Ketua RT.\n\nNomor Surat: *${nomorSuratInput.trim()}*\nStatus: *Resmi & Ber-QR Code HMAC-SHA256*\n\nAnda dapat mengunduh berkas PDF resmi secara mandiri melalui website RT 35: https://www.rt35manggar.my.id/surat (masukkan NIK Anda).\n\nTerima kasih.\n_Pengurus RT 35 Kelurahan Manggar_`
        );
        const waUrl = `https://wa.me/${cleanPhone}?text=${textMessage}`;

        const openWa = window.confirm(
          `Surat berhasil disetujui dengan Token HMAC-SHA256!\n\nApakah Anda ingin langsung membuka WhatsApp untuk mengabari warga (${approvingSurat.nama_pemohon})?`
        );
        if (openWa) {
          window.open(waUrl, '_blank');
        }

        setApprovingSurat(null);
        loadRequests();
      } else {
        alert('Gagal menyetujui surat. Silakan periksa koneksi.');
      }
    } catch (e: any) {
      console.error(e);
      alert('Terjadi kesalahan: ' + e.message);
    } finally {
      setSubmittingApproval(false);
    }
  };

  const handleOpenRejectModal = (surat: RTSuratRequest) => {
    setRejectingSurat(surat);
    setAlasanPenolakanInput('');
  };

  const handleConfirmRejection = async () => {
    if (!rejectingSurat) return;
    if (!alasanPenolakanInput.trim()) {
      alert('Harap tuliskan alasan penolakan agar warga mengetahuinya.');
      return;
    }

    setSubmittingRejection(true);
    try {
      const success = await SupabaseService.rejectSuratRequest(
        rejectingSurat.id,
        alasanPenolakanInput.trim(),
        'Sekretaris RT 35'
      );

      if (success) {
        // Option to notify citizen via WhatsApp
        const cleanPhone = rejectingSurat.phone_wa.replace(/\D/g, '').replace(/^0/, '62');
        const textMessage = encodeURIComponent(
          `Halo Bpk/Ibu *${rejectingSurat.nama_pemohon}*,\n\nMohon maaf, permohonan *${rejectingSurat.jenis_surat}* Anda di RT 35 Kelurahan Manggar saat ini *BELUM DAPAT DISETUJUI*.\n\nAlasan: *${alasanPenolakanInput.trim()}*\n\nSilakan lengkapi berkas atau hubungi pengurus RT 35 jika ada pertanyaan.\n\nTerima kasih.\n_Pengurus RT 35 Kelurahan Manggar_`
        );
        const waUrl = `https://wa.me/${cleanPhone}?text=${textMessage}`;

        const openWa = window.confirm(
          `Surat berhasil ditolak.\n\nKirim pesan WhatsApp ke warga untuk mengabari alasan penolakan?`
        );
        if (openWa) {
          window.open(waUrl, '_blank');
        }

        setRejectingSurat(null);
        loadRequests();
      } else {
        alert('Gagal menolak surat.');
      }
    } catch (e: any) {
      console.error(e);
      alert('Terjadi kesalahan: ' + e.message);
    } finally {
      setSubmittingRejection(false);
    }
  };

  const handleDownloadPDF = async (surat: RTSuratRequest) => {
    if (!surat.token_hash) {
      alert('Surat ini belum disetujui atau belum memiliki token tanda tangan digital.');
      return;
    }

    try {
      setDownloadingId(surat.id);
      const verifyUrl = `${window.location.origin}/validasi?token=${surat.token_hash}`;
      const qrDataUrl = await generateQRCodeDataURL(verifyUrl);
      downloadSuratPDF(surat, qrDataUrl);
    } catch (err) {
      console.error(err);
      alert('Gagal membuat PDF.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleOpenDirectWhatsApp = (surat: RTSuratRequest) => {
    const cleanPhone = surat.phone_wa.replace(/\D/g, '').replace(/^0/, '62');
    const msg = encodeURIComponent(`Halo Bpk/Ibu ${surat.nama_pemohon}, kami dari Pengurus RT 35 Kelurahan Manggar terkait permohonan ${surat.jenis_surat} Anda...`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  // Filter & Search Logic
  const filteredRequests = requests.filter((r) => {
    const matchesFilter = filterStatus === 'all' ? true : r.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      r.nama_pemohon.toLowerCase().includes(query) ||
      r.nik.includes(query) ||
      r.jenis_surat.toLowerCase().includes(query) ||
      r.keperluan.toLowerCase().includes(query) ||
      (r.nomor_surat && r.nomor_surat.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const totalMenunggu = requests.filter(r => r.status === 'menunggu').length;
  const totalDisetujui = requests.filter(r => r.status === 'disetujui').length;
  const totalDitolak = requests.filter(r => r.status === 'ditolak').length;

  return (
    <div className="space-y-6">
      
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Permohonan</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{requests.length}</p>
          </div>
          <div className="w-12 h-12 bg-slate-100 text-[#0b5665] rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Menunggu Verifikasi</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{totalMenunggu}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Surat Disetujui</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{totalDisetujui}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">Surat Ditolak</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{totalDitolak}</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              filterStatus === 'all'
                ? 'bg-[#0b5665] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({requests.length})
          </button>
          <button
            onClick={() => setFilterStatus('menunggu')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              filterStatus === 'menunggu'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu ({totalMenunggu})</span>
          </button>
          <button
            onClick={() => setFilterStatus('disetujui')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              filterStatus === 'disetujui'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disetujui ({totalDisetujui})</span>
          </button>
          <button
            onClick={() => setFilterStatus('ditolak')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              filterStatus === 'ditolak'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Ditolak ({totalDitolak})</span>
          </button>
        </div>

        {/* Search Input & Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIK, keperluan..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0b5665] outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={loadRequests}
            title="Muat ulang data"
            className="p-2.5 border border-slate-300 rounded-xl hover:bg-slate-100 transition text-slate-600"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. REQUESTS LIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && requests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0b5665]" />
            <p className="text-sm font-semibold">Memuat daftar permohonan surat...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Tidak Ada Permohonan Ditemukan</p>
            <p className="text-xs text-slate-400">Tidak ada data surat yang sesuai dengan filter atau pencarian saat ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Tanggal</th>
                  <th className="px-5 py-3.5">Pemohon & NIK</th>
                  <th className="px-5 py-3.5">Jenis Surat & Keperluan</th>
                  <th className="px-5 py-3.5">Kontak WhatsApp</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Aksi Layanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((surat) => (
                  <tr key={surat.id} className="hover:bg-slate-50/70 transition">
                    
                    {/* Tanggal */}
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-medium">
                      {formatIndonesianDate(surat.created_at)}
                    </td>

                    {/* Pemohon & NIK */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-900 block text-sm">
                          {surat.nama_pemohon}
                        </span>
                        <span className="font-mono text-slate-500 text-[11px] block">
                          NIK: {surat.nik}
                        </span>
                        <span className="text-[11px] text-slate-400 block line-clamp-1">
                          {surat.alamat}
                        </span>
                      </div>
                    </td>

                    {/* Jenis Surat & Keperluan */}
                    <td className="px-5 py-4 max-w-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#0b5665] block">
                          {surat.jenis_surat}
                        </span>
                        <p className="text-slate-600 text-[11px] line-clamp-2">
                          {surat.keperluan}
                        </p>
                        {surat.nomor_surat && (
                          <span className="inline-block mt-1 font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                            No: {surat.nomor_surat}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* WhatsApp */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDirectWhatsApp(surat)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-200 transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{surat.phone_wa}</span>
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {surat.status === 'menunggu' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-full text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>Menunggu</span>
                        </span>
                      )}
                      {surat.status === 'disetujui' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Disetujui</span>
                        </span>
                      )}
                      {surat.status === 'ditolak' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-rose-100 text-rose-800 font-bold rounded-full text-[11px]" title={surat.alasan_penolakan}>
                          <XCircle className="w-3 h-3" />
                          <span>Ditolak</span>
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        
                        {/* AKSI JIKA MENUNGGU */}
                        {surat.status === 'menunggu' && (
                          <>
                            <button
                              onClick={() => handleOpenApproveModal(surat)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition flex items-center space-x-1"
                              title="Setujui dan Terbitkan Surat"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Setujui</span>
                            </button>

                            <button
                              onClick={() => handleOpenRejectModal(surat)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold rounded-lg transition"
                              title="Tolak Permohonan"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </>
                        )}

                        {/* AKSI JIKA DISETUJUI */}
                        {surat.status === 'disetujui' && (
                          <>
                            <button
                              onClick={() => handleDownloadPDF(surat)}
                              disabled={downloadingId === surat.id}
                              className="px-3 py-1.5 bg-[#0b5665] hover:bg-[#08424e] text-white font-bold rounded-lg shadow-sm transition flex items-center space-x-1 disabled:opacity-50"
                              title="Unduh Lembar PDF Resmi"
                            >
                              {downloadingId === surat.id ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Printer className="w-3.5 h-3.5" />
                              )}
                              <span>Cetak PDF</span>
                            </button>

                            {surat.token_hash && (
                              <a
                                href={`/validasi?token=${surat.token_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                                title="Buka Halaman Validasi QR Code"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </>
                        )}

                        {/* AKSI JIKA DITOLAK */}
                        {surat.status === 'ditolak' && (
                          <button
                            onClick={() => handleOpenApproveModal(surat)}
                            className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[11px] underline"
                          >
                            Tinjau Ulang
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. MODAL PERSETUJUAN (APPROVE MODAL) */}
      {approvingSurat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Pengesahan E-Surat Resmi</h3>
                  <p className="text-xs text-slate-500">Tanda Tangan Digital Algoritma HMAC-SHA256</p>
                </div>
              </div>
              <button
                onClick={() => setApprovingSurat(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Pemohon:</span>
                <span className="font-bold text-slate-900">{approvingSurat.nama_pemohon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NIK:</span>
                <span className="font-mono font-bold text-slate-800">{approvingSurat.nik}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jenis Surat:</span>
                <span className="font-bold text-slate-900">{approvingSurat.jenis_surat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Keperluan:</span>
                <span className="text-slate-800 font-medium text-right max-w-xs">{approvingSurat.keperluan}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Nomor Surat Pengantar RT <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={nomorSuratInput}
                  onChange={(e) => setNomorSuratInput(e.target.value)}
                  placeholder="Contoh: 045/RT35/MGR/BPT/X/2026"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#0b5665] outline-none"
                />
                <p className="text-[11px] text-slate-400">
                  Format baku RT 35: [Nomor Urut]/RT35/MGR/BPT/[Bulan]/[Tahun]
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Nama Pejabat Penandatangan
                </label>
                <input
                  type="text"
                  value={penandatanganInput}
                  onChange={(e) => setPenandatanganInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#0b5665] outline-none"
                />
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-start space-x-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Sistem akan mengunci integritas dokumen dan menghasilkan stempel QR Code kriptografis HMAC-SHA256 yang sah di mata Kelurahan Manggar.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setApprovingSurat(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                disabled={submittingApproval}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2 disabled:opacity-50"
              >
                {submittingApproval ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menerbitkan Surat...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sahkan & Terbitkan Surat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL PENOLAKAN (REJECT MODAL) */}
      {rejectingSurat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5 text-rose-600">
                <XCircle className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 text-base">Tolak Permohonan Surat</h3>
              </div>
              <button
                onClick={() => setRejectingSurat(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tuliskan alasan penolakan untuk pemohon <strong className="text-slate-900">{rejectingSurat.nama_pemohon}</strong>. Keterangan ini akan terlihat saat warga mengecek status surat.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Alasan Penolakan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={alasanPenolakanInput}
                onChange={(e) => setAlasanPenolakanInput(e.target.value)}
                placeholder="Contoh: Berkas fotokopi KTP belum diserahkan, atau alamat domisili tidak sesuai data sensus RT 35."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingSurat(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                disabled={submittingRejection}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
              >
                {submittingRejection ? 'Menyimpan...' : 'Tolak Permohonan'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default LayananSuratTab;
