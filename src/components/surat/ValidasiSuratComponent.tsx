import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  User, 
  Calendar, 
  Lock, 
  Search, 
  RefreshCw,
  FileText,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { RTSuratRequest } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { formatIndonesianDate } from '../../lib/crypto';

export const ValidasiSuratComponent: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [surat, setSurat] = useState<RTSuratRequest | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token') || window.location.pathname.split('/validasi/')[1] || '';
      if (urlToken.trim()) {
        setTokenInput(urlToken.trim());
        verifyToken(urlToken.trim());
      } else {
        setLoading(false);
      }
    }
  }, []);

  const verifyToken = async (targetToken: string) => {
    setLoading(true);
    setChecked(true);
    try {
      const data = await SupabaseService.verifySuratByToken(targetToken.trim());
      if (data && data.status === 'disetujui') {
        setSurat(data);
      } else {
        setSurat(null);
      }
    } catch (e) {
      console.error('Failed to verify surat token:', e);
      setSurat(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      alert('Masukkan kode token digital surat.');
      return;
    }
    verifyToken(tokenInput.trim());
  };

  const maskNIK = (nikStr: string) => {
    if (!nikStr || nikStr.length < 8) return nikStr;
    return nikStr.substring(0, 6) + '******' + nikStr.substring(nikStr.length - 4);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* LOADING STATE */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-slate-200 space-y-4">
            <RefreshCw className="w-10 h-10 text-[#0b5665] animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Memverifikasi Integritas Kriptografis Dokumen...</h3>
            <p className="text-xs text-slate-400">Menghubungkan ke basis data tanda tangan digital RT 35 Manggar</p>
          </div>
        )}

        {/* VERIFIED & VALID STATE */}
        {!loading && checked && surat && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Top Certificate Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 sm:p-8 text-white text-center space-y-3">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto border border-white/30 shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-emerald-200" />
              </div>
              <div>
                <span className="inline-block px-3.5 py-1 bg-white/20 text-white rounded-full text-[11px] font-black uppercase tracking-wider mb-2">
                  Sistem Validasi Resmi RT 35 Manggar
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  DOKUMEN RESMI & TERVERIFIKASI
                </h1>
                <p className="text-emerald-100 text-xs sm:text-sm max-w-md mx-auto font-medium">
                  Surat ini diterbitkan secara sah dan terlacak secara digital oleh Rukun Tetangga (RT) 35 Kelurahan Manggar, Balikpapan Timur.
                </p>
              </div>
            </div>

            {/* Document Details */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="border-b border-slate-200 pb-4 text-center space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pemerintah Kota Balikpapan</p>
                <h2 className="text-sm font-extrabold text-slate-800 uppercase">Kecamatan Balikpapan Timur &bull; Kelurahan Manggar</h2>
                <p className="text-xs font-bold text-[#0b5665]">RUKUN TETANGGA (RT) 35</p>
              </div>

              {/* Box Nomor Surat */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-semibold">Jenis Surat:</span>
                  <span className="font-extrabold text-[#0b5665] text-sm">{surat.jenis_surat}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-2.5">
                  <span className="text-slate-500 font-semibold">Nomor Surat Resmi:</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{surat.nomor_surat}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-2.5">
                  <span className="text-slate-500 font-semibold">Tanggal Terbit & Pengesahan:</span>
                  <span className="font-bold text-slate-800">{formatIndonesianDate(surat.approved_at || surat.created_at)}</span>
                </div>
              </div>

              {/* Rincian Pemohon */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <User className="w-4 h-4 text-[#0b5665]" />
                  <span>Identitas Pemohon</span>
                </h3>

                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
                  <div className="p-3.5 flex justify-between">
                    <span className="text-slate-500">Nama Lengkap</span>
                    <span className="font-extrabold text-slate-900">{surat.nama_pemohon}</span>
                  </div>
                  <div className="p-3.5 flex justify-between">
                    <span className="text-slate-500">NIK (Nomor KTP)</span>
                    <span className="font-mono font-bold text-slate-800">{maskNIK(surat.nik)}</span>
                  </div>
                  <div className="p-3.5 flex justify-between">
                    <span className="text-slate-500">Tempat, Tanggal Lahir</span>
                    <span className="font-semibold text-slate-800">{surat.tempat_lahir || 'Balikpapan'}, {formatIndonesianDate(surat.tanggal_lahir)}</span>
                  </div>
                  <div className="p-3.5 flex justify-between">
                    <span className="text-slate-500">Alamat Domisili</span>
                    <span className="font-semibold text-slate-800 text-right max-w-xs">{surat.alamat}</span>
                  </div>
                  <div className="p-3.5 flex justify-between">
                    <span className="text-slate-500">Maksud / Keperluan</span>
                    <span className="font-semibold text-slate-800 text-right max-w-xs">{surat.keperluan}</span>
                  </div>
                </div>
              </div>

              {/* Pengesahan Ketua RT */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-500 block">Pejabat Pengesah:</span>
                  <span className="font-black text-slate-900 text-sm">{surat.approved_by || 'H. AMIR'}</span>
                  <span className="text-slate-500 block">Ketua Rukun Tetangga (RT) 35</span>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              {/* Kriptografi Hash HMAC-SHA256 */}
              <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl space-y-2 text-[11px]">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bukti Tanda Tangan Digital (Digital Signature)</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Dokumen ini telah diotentikasi menggunakan algoritma kriptografi <strong>HMAC-SHA256</strong>. Integritas data terjamin 100% otentik dan bebas manipulasi.
                </p>
                <div className="bg-black/60 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] break-all text-emerald-300">
                  Digest Hash: {surat.token_hash}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* INVALID TOKEN STATE */}
        {!loading && checked && !surat && (
          <div className="bg-white rounded-3xl shadow-xl border border-rose-200 p-8 sm:p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold uppercase tracking-wider">
                Peringatan Keabsahan Dokumen
              </span>
              <h1 className="text-2xl font-black text-slate-900">
                Dokumen Tidak Ditemukan / Tidak Sah
              </h1>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Token tanda tangan digital yang Anda periksa tidak terdaftar di sistem resmi RT 35 Kelurahan Manggar atau dokumen belum disahkan oleh Ketua RT.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-xs text-slate-500 font-mono break-all">
              Token: {tokenInput || '(Kosong)'}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setChecked(false)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-[#0b5665] text-white rounded-xl text-xs font-bold shadow hover:bg-[#08424e] transition"
              >
                <span>Periksa Token Lainnya</span>
              </button>
            </div>
          </div>
        )}

        {/* MANUAL TOKEN INPUT FORM IF OPENED WITHOUT PARAMS */}
        {!loading && !checked && (
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-200 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Validasi Digital E-Surat RT 35</h2>
              <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto">
                Verifikasi keaslian surat pengantar resmi yang diterbitkan oleh RT 35 Kelurahan Manggar menggunakan kode token kriptografi HMAC-SHA256.
              </p>
            </div>

            <form onSubmit={handleManualSearch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Masukkan Kode Hash Token Dokumen:
                </label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Tempelkan 64 karakter kode hash token di sini..."
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-[#0b5665] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0b5665] text-white font-bold rounded-xl text-sm shadow hover:bg-[#08424e] transition flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Verifikasi Dokumen Sekarang</span>
              </button>
            </form>
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="text-center pt-2">
          <a
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-[#0b5665] font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Utama Portal RT 35</span>
          </a>
        </div>

      </div>
    </div>
  );
};
export default ValidasiSuratComponent;
