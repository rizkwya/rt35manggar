import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Download, 
  Send, 
  UserCheck, 
  AlertCircle, 
  ShieldCheck, 
  QrCode, 
  Phone, 
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  MapPin,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { RTSuratRequest, FamilyMember } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { generateQRCodeDataURL, formatIndonesianDate } from '../../lib/crypto';
import { downloadSuratPDF } from '../../lib/pdfGenerator';

const JENIS_SURAT_OPTIONS = [
  { value: 'Surat Pengantar RT', label: 'Surat Pengantar Umum (KTP / KK / Pindah Datang)' },
  { value: 'Surat Pengantar SKCK', label: 'Surat Pengantar Pembuatan SKCK (Kepolisian)' },
  { value: 'Surat Keterangan Domisili', label: 'Surat Keterangan Domisili Tempat Tinggal' },
  { value: 'Surat Keterangan Usaha (UMKM)', label: 'Surat Keterangan Usaha Mikro Kecil Menengah (UMKM)' },
  { value: 'Surat Keterangan Tidak Mampu (SKTM)', label: 'Surat Keterangan Tidak Mampu (SKTM - Beasiswa / Berobat)' },
  { value: 'Surat Keterangan Kematian', label: 'Surat Keterangan Kematian Warga' },
  { value: 'Surat Keterangan Kelahiran', label: 'Surat Keterangan Kelahiran Anak' },
  { value: 'Surat Keterangan Lainnya', label: 'Surat Keterangan Lainnya' }
];

export const SuratPublicPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ajukan' | 'status'>('ajukan');

  // Form State
  const [nik, setNik] = useState('');
  const [namaPemohon, setNamaPemohon] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
  const [agama, setAgama] = useState('Islam');
  const [pekerjaan, setPekerjaan] = useState('');
  const [alamat, setAlamat] = useState('');
  const [phoneWa, setPhoneWa] = useState('');
  const [jenisSurat, setJenisSurat] = useState('Surat Pengantar RT');
  const [keperluan, setKeperluan] = useState('');

  // NIK Verification State
  const [checkingNik, setCheckingNik] = useState(false);
  const [nikVerified, setNikVerified] = useState<boolean | null>(null);
  const [verifiedMember, setVerifiedMember] = useState<FamilyMember | null>(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<RTSuratRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Status Search State
  const [searchNik, setSearchNik] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [historyList, setHistoryList] = useState<RTSuratRequest[]>([]);
  const [searched, setSearched] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Auto-check NIK when length reaches 16
  useEffect(() => {
    const cleanNik = nik.trim();
    if (cleanNik.length === 16 && /^\d+$/.test(cleanNik)) {
      handleCheckNIK(cleanNik);
    } else {
      setNikVerified(null);
      setVerifiedMember(null);
    }
  }, [nik]);

  const handleCheckNIK = async (inputNik: string) => {
    setCheckingNik(true);
    setErrorMessage('');
    try {
      const res = await SupabaseService.checkCitizenByNIK(inputNik);
      if (res && res.found && res.member) {
        setNikVerified(true);
        setVerifiedMember(res.member);
        setNamaPemohon(res.member.nama);
        if (res.member.tempat_lahir) setTempatLahir(res.member.tempat_lahir);
        if (res.member.tanggal_lahir) setTanggalLahir(res.member.tanggal_lahir);
        if (res.member.jenis_kelamin) setJenisKelamin(res.member.jenis_kelamin);
        if (res.member.agama) setAgama(res.member.agama);
        if (res.member.pekerjaan) setPekerjaan(res.member.pekerjaan);
        if (res.alamat) setAlamat(res.alamat);
      } else {
        setNikVerified(false);
        setVerifiedMember(null);
      }
    } catch (e) {
      console.error(e);
      setNikVerified(false);
    } finally {
      setCheckingNik(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik.trim() || nik.trim().length !== 16) {
      alert('Harap masukkan 16 digit NIK dengan benar.');
      return;
    }
    if (!namaPemohon.trim()) {
      alert('Nama pemohon wajib diisi.');
      return;
    }
    if (!phoneWa.trim()) {
      alert('Nomor WhatsApp aktif wajib diisi agar pengurus RT dapat menghubungi Anda.');
      return;
    }
    if (!keperluan.trim()) {
      alert('Harap jelaskan keperluan atau maksud surat pengantar Anda.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await SupabaseService.submitSuratRequest({
        nik: nik.trim(),
        nama_pemohon: namaPemohon.trim(),
        tempat_lahir: tempatLahir.trim(),
        tanggal_lahir: tanggalLahir || undefined,
        jenis_kelamin: jenisKelamin,
        agama: agama,
        pekerjaan: pekerjaan.trim(),
        alamat: alamat.trim() || 'RT 35 Kelurahan Manggar, Balikpapan Timur',
        phone_wa: phoneWa.trim(),
        jenis_surat: jenisSurat,
        keperluan: keperluan.trim()
      });

      if (res.success && res.data) {
        setSubmitSuccess(res.data);
      } else {
        setErrorMessage(res.error || 'Terjadi kendala saat mengirim permohonan.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengirim permohonan surat.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchHistory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanNik = searchNik.trim();
    if (!cleanNik || cleanNik.length !== 16) {
      alert('Masukkan 16 digit NIK untuk melihat riwayat surat.');
      return;
    }

    setSearchLoading(true);
    setSearched(true);
    try {
      const list = await SupabaseService.fetchSuratHistoryByNIK(cleanNik);
      setHistoryList(list || []);
    } catch (err) {
      console.error(err);
      setHistoryList([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDownloadPDF = async (surat: RTSuratRequest) => {
    if (!surat.token_hash) {
      alert('Surat ini belum memiliki tanda tangan digital resmi.');
      return;
    }

    try {
      setDownloadingId(surat.id);
      // Construct public verification URL embedded in QR Code
      const verifyUrl = `${window.location.origin}/validasi?token=${surat.token_hash}`;
      const qrDataUrl = await generateQRCodeDataURL(verifyUrl);
      downloadSuratPDF(surat, qrDataUrl);
    } catch (err) {
      console.error(err);
      alert('Gagal membuat file PDF. Harap coba lagi.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* HEADER BRANDING BANNER */}
        <div className="bg-gradient-to-r from-[#063039] to-[#0b5665] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <QrCode className="w-80 h-80" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Layanan Publik Digital Resmi RT 35 Manggar</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Modul E-Surat Berbasis QR Code
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
              Pelayanan permohonan surat pengantar RT secara mandiri, cepat, dan transparan. Terverifikasi secara kriptografis menggunakan algoritma <strong className="text-emerald-300">HMAC-SHA256</strong> dan QR Code resmi.
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 bg-white p-2 rounded-2xl shadow-sm gap-2">
          <button
            onClick={() => setActiveTab('ajukan')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'ajukan'
                ? 'bg-[#0b5665] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Ajukan Surat Baru</span>
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'status'
                ? 'bg-[#0b5665] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Cek Status & Unduh Surat</span>
          </button>
        </div>

        {/* TAB 1: FORM PENGAJUAN */}
        {activeTab === 'ajukan' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
            
            {submitSuccess ? (
              <div className="space-y-6 text-center py-8">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900">Permohonan Surat Berhasil Dikirim!</h3>
                  <p className="text-slate-600 max-w-md mx-auto text-sm">
                    Permohonan surat pengantar untuk <strong className="text-slate-900">{submitSuccess.nama_pemohon}</strong> telah tercatat di sistem RT 35 dengan status <span className="text-amber-600 font-bold">Menunggu Verifikasi</span>.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-lg mx-auto text-left space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Nomor NIK:</span>
                    <span className="font-mono font-bold text-slate-800">{submitSuccess.nik}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Jenis Surat:</span>
                    <span className="font-bold text-slate-800">{submitSuccess.jenis_surat}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Nomor WhatsApp:</span>
                    <span className="font-bold text-slate-800">{submitSuccess.phone_wa}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Waktu Pengajuan:</span>
                    <span className="text-slate-800">{formatIndonesianDate(submitSuccess.created_at)}</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs text-left max-w-lg mx-auto flex items-start space-x-3">
                  <Info className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                  <p>
                    Pengurus RT 35 akan meninjau permohonan ini. Anda akan menerima pesan WhatsApp saat surat disetujui, atau Anda dapat mengecek status dan mengunduh berkas PDF kapan saja di tab <strong>"Cek Status & Unduh Surat"</strong>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <button
                    onClick={() => {
                      setSearchNik(submitSuccess.nik);
                      setActiveTab('status');
                      handleSearchHistory();
                    }}
                    className="px-6 py-3 bg-[#0b5665] text-white rounded-xl font-bold text-sm shadow hover:bg-[#08424e] transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Pantau Status Surat Sekarang</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSubmitSuccess(null);
                      setNik('');
                      setKeperluan('');
                      setNikVerified(null);
                      setVerifiedMember(null);
                    }}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                  >
                    Ajukan Surat Baru Lainnya
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. NIK INPUT WITH AUTO-DETECTION */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-slate-900">
                      Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-slate-500">Wajib 16 Digit Angka Sesuai KTP/KK</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={16}
                      value={nik}
                      onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                      placeholder="Contoh: 6471012304950001"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 font-mono text-base focus:ring-2 focus:ring-[#0b5665] focus:border-transparent outline-none transition"
                    />
                    <div className="absolute right-3.5 top-3.5">
                      {checkingNik ? (
                        <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
                      ) : nikVerified === true ? (
                        <div className="flex items-center space-x-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Terdata di RT 35</span>
                        </div>
                      ) : nikVerified === false ? (
                        <div className="flex items-center space-x-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                          <AlertCircle className="w-4 h-4" />
                          <span>Warga Baru / Belum Terdata</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {nikVerified === true && verifiedMember && (
                    <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-xs sm:text-sm text-emerald-900">
                      <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Biodata Anda Ditemukan di Database RT 35!</p>
                        <p className="text-emerald-700 text-xs mt-0.5">
                          Nama: <strong>{verifiedMember.nama}</strong> | Hubungan: {verifiedMember.hubungan} | Alamat otomatis disesuaikan.
                        </p>
                      </div>
                    </div>
                  )}

                  {nikVerified === false && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
                      <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">NIK Anda Belum Tercatat di Database Sensus Digital</p>
                        <p className="mt-0.5">
                          Jangan khawatir, Anda tetap dapat melanjutkan pengajuan dengan melengkapi biodata di bawah ini secara manual.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. BIODATA PEMOHON */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Nama Lengkap Pemohon <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={namaPemohon}
                      onChange={(e) => setNamaPemohon(e.target.value)}
                      placeholder="Nama lengkap sesuai KTP"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0b5665] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      value={tempatLahir}
                      onChange={(e) => setTempatLahir(e.target.value)}
                      placeholder="Contoh: Balikpapan"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0b5665] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={tanggalLahir}
                      onChange={(e) => setTanggalLahir(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0b5665] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Jenis Kelamin
                    </label>
                    <select
                      value={jenisKelamin}
                      onChange={(e) => setJenisKelamin(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0b5665] outline-none bg-white"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Agama
                    </label>
                    <select
                      value={agama}
                      onChange={(e) => setAgama(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0b5665] outline-none bg-white"
                    >
                      <option value="Islam">Islam</option>
                      <option value="Kristen Protestan">Kristen Protestan</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Konghucu">Konghucu</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Pekerjaan
                    </label>
                    <input
                      type="text"
                      value={pekerjaan}
                      onChange={(e) => setPekerjaan(e.target.value)}
                      placeholder="Contoh: Wiraswasta / Karyawan Swasta"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0b5665] outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneWa}
                      onChange={(e) => setPhoneWa(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0b5665] outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Alamat Domisili di RT 35
                    </label>
                    <input
                      type="text"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Contoh: Jl. Mulawarman RT 35 Kelurahan Manggar, Balikpapan Timur"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0b5665] outline-none"
                    />
                  </div>
                </div>

                {/* 3. RINCIAN PERMOHONAN SURAT */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                    Detail Keperluan Surat
                  </h4>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Jenis Surat Pengantar <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={jenisSurat}
                      onChange={(e) => setJenisSurat(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-[#0b5665] outline-none bg-white text-slate-800"
                    >
                      {JENIS_SURAT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Maksud / Keperluan Pengajuan <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={keperluan}
                      onChange={(e) => setKeperluan(e.target.value)}
                      placeholder="Contoh: Mengurus perpanjangan KTP elektronik dan Kartu Keluarga di Kantor Kelurahan Manggar"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0b5665] outline-none"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#0b5665] text-white rounded-2xl font-black text-base shadow-lg hover:bg-[#08424e] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Sedang Mengirim Permohonan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Kirim Permohonan Surat Sekarang</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: CEK STATUS & RIWAYAT SURAT */}
        {activeTab === 'status' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Cek Status & Unduh Surat Resmi</h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Masukkan 16 digit NIK Anda untuk melihat riwayat surat pengantar yang pernah diajukan, status verifikasi, dan mengunduh berkas PDF resmi yang sudah ber-QR Code.
              </p>
            </div>

            <form onSubmit={handleSearchHistory} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={16}
                  value={searchNik}
                  onChange={(e) => setSearchNik(e.target.value.replace(/\D/g, ''))}
                  placeholder="Masukkan 16 digit NIK pemohon..."
                  className="w-full px-4 py-3.5 pl-11 rounded-xl border border-slate-300 font-mono text-sm sm:text-base focus:ring-2 focus:ring-[#0b5665] outline-none"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="px-6 py-3.5 bg-[#0b5665] text-white rounded-xl font-bold text-sm shadow hover:bg-[#08424e] transition-all flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
              >
                {searchLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <span>Cari Riwayat Surat</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* RESULTS LIST */}
            {searched && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {historyList.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-600 font-bold text-sm">Tidak Ada Riwayat Pengajuan</p>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Belum ditemukan pengajuan surat untuk NIK <strong>{searchNik}</strong>. Silakan periksa kembali NIK atau buat pengajuan baru.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                      <span>Ditemukan {historyList.length} Pengajuan Surat</span>
                      <span>NIK: {searchNik}</span>
                    </div>

                    {historyList.map((surat) => (
                      <div
                        key={surat.id}
                        className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-[#0b5665] uppercase tracking-wider">
                              {surat.jenis_surat}
                            </span>
                            <h4 className="text-base sm:text-lg font-extrabold text-slate-900">
                              {surat.nama_pemohon}
                            </h4>
                          </div>

                          {/* STATUS BADGE */}
                          <div>
                            {surat.status === 'menunggu' && (
                              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Menunggu Verifikasi RT</span>
                              </div>
                            )}
                            {surat.status === 'disetujui' && (
                              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Disetujui & Terbit</span>
                              </div>
                            )}
                            {surat.status === 'ditolak' && (
                              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Permohonan Ditolak</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-slate-400 block">Maksud / Keperluan:</span>
                            <span className="font-medium text-slate-800">{surat.keperluan}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Waktu Pengajuan:</span>
                            <span className="font-medium text-slate-800">{formatIndonesianDate(surat.created_at)}</span>
                          </div>
                          {surat.nomor_surat && (
                            <div>
                              <span className="text-slate-400 block">Nomor Surat Resmi:</span>
                              <span className="font-mono font-bold text-slate-900">{surat.nomor_surat}</span>
                            </div>
                          )}
                          {surat.approved_at && (
                            <div>
                              <span className="text-slate-400 block">Tanggal Pengesahan:</span>
                              <span className="font-medium text-slate-800">{formatIndonesianDate(surat.approved_at)}</span>
                            </div>
                          )}
                        </div>

                        {/* REJECTION REASON */}
                        {surat.status === 'ditolak' && surat.alasan_penolakan && (
                          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold">Alasan Penolakan dari Pengurus RT:</span>
                              <p className="mt-0.5">{surat.alasan_penolakan}</p>
                            </div>
                          </div>
                        )}

                        {/* APPROVED ACTIONS: DOWNLOAD PDF & VERIFICATION LINK */}
                        {surat.status === 'disetujui' && (
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                            <div className="flex items-center space-x-2 text-xs text-emerald-700 font-semibold">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>Ditandatangani Digital (HMAC-SHA256)</span>
                            </div>

                            <div className="flex items-center space-x-2 w-full sm:w-auto">
                              {surat.token_hash && (
                                <a
                                  href={`/validasi?token=${surat.token_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 flex-1 sm:flex-none"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Lihat Sertifikat</span>
                                </a>
                              )}

                              <button
                                onClick={() => handleDownloadPDF(surat)}
                                disabled={downloadingId === surat.id}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-2 flex-1 sm:flex-none disabled:opacity-50"
                              >
                                {downloadingId === surat.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                                <span>Unduh Surat (PDF Resmi)</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
export default SuratPublicPortal;
