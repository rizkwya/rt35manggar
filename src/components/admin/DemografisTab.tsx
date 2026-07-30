import React, { useState, useEffect } from 'react';
import { Save, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area, CartesianGrid, Legend } from 'recharts';
import { RTDemographics } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';

interface DemografisTabProps {
  initialDemographics: RTDemographics | null;
  onUpdateDemographics: (data: RTDemographics) => void;
  showSuccess: (msg: string) => void;
}

export const DemografisTab: React.FC<DemografisTabProps> = ({
  initialDemographics,
  onUpdateDemographics,
  showSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [demographics, setDemographics] = useState<RTDemographics | null>(null);

  useEffect(() => {
    if (initialDemographics) {
      setDemographics(initialDemographics);
    }
  }, [initialDemographics]);

  const adjustDemoField = (field: keyof RTDemographics, amount: number) => {
    if (!demographics) return;
    const currentVal = (demographics[field] as number) || 0;
    const newVal = Math.max(0, currentVal + amount);
    setDemographics({
      ...demographics,
      [field]: newVal
    });
  };

  const handleDemographicsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demographics) return;

    setLoading(true);
    try {
      const updatedData: RTDemographics = {
        ...demographics,
        total_warga: Number(demographics.total_pria) + Number(demographics.total_wanita),
        updated_at: new Date().toISOString(),
      };
      await SupabaseService.updateDemographics(updatedData);
      setDemographics(updatedData);
      onUpdateDemographics(updatedData);
      showSuccess('Data statistik kependudukan RT 35 berhasil diperbarui!');
    } catch (err: any) {
      console.error('Failed updating demographics:', err);
      alert('Gagal memperbarui data demografis: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!demographics) {
    return (
      <div className="p-8 text-center text-xs font-bold text-slate-400">
        Memuat data demografis...
      </div>
    );
  }

  const genderData = [
    { name: 'Pria', value: demographics.total_pria || 0, color: '#1e293b' },
    { name: 'Wanita', value: demographics.total_wanita || 0, color: '#cbd5e1' },
  ];

  const incomeData = [
    { range: 'Under 2M', KK: demographics.income_under_2m || 0, color: '#475569' },
    { range: '2 - 5 Jt', KK: demographics.income_2m_to_5m || 0, color: '#475569' },
    { range: '5 - 10 Jt', KK: demographics.income_5m_to_10m || 0, color: '#475569' },
    { range: '> 10 Jt', KK: demographics.income_above_10m || 0, color: '#475569' },
  ];

  const educationData = [
    { name: 'SD', value: demographics.edu_sd || 0, color: '#0f172a' },
    { name: 'SMP', value: demographics.edu_smp || 0, color: '#334155' },
    { name: 'SMA', value: demographics.edu_sma || 0, color: '#475569' },
    { name: 'PT', value: demographics.edu_pt || 0, color: '#64748b' },
    { name: 'Tdk Sekolah', value: demographics.edu_tidak_sekolah || 0, color: '#94a3b8' },
  ];

  const professionData = [
    { name: 'PNS', jumlah: demographics.prof_pns || 0, color: '#475569' },
    { name: 'Swasta', jumlah: demographics.prof_swasta || 0, color: '#475569' },
    { name: 'Wira', jumlah: demographics.prof_wiraswasta || 0, color: '#475569' },
    { name: 'Nelayan', jumlah: demographics.prof_nelayan || 0, color: '#475569' },
    { name: 'Lainnya', jumlah: demographics.prof_lainnya || 0, color: '#475569' },
  ];

  const newWargaData = [
    { month: 'Jan', jumlah: demographics.warga_baru_jan || 0 },
    { month: 'Feb', jumlah: demographics.warga_baru_feb || 0 },
    { month: 'Mar', jumlah: demographics.warga_baru_mar || 0 },
    { month: 'Apr', jumlah: demographics.warga_baru_apr || 0 },
    { month: 'Mei', jumlah: demographics.warga_baru_mei || 0 },
    { month: 'Jun', jumlah: demographics.warga_baru_jun || 0 },
    { month: 'Jul', jumlah: demographics.warga_baru_jul || 0 },
    { month: 'Agu', jumlah: demographics.warga_baru_agu || 0 },
    { month: 'Sep', jumlah: demographics.warga_baru_sep || 0 },
    { month: 'Okt', jumlah: demographics.warga_baru_okt || 0 },
    { month: 'Nov', jumlah: demographics.warga_baru_nov || 0 },
    { month: 'Des', jumlah: demographics.warga_baru_des || 0 },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start animate-fade-in">
      
      {/* Form Input Data Warga */}
      <form onSubmit={handleDemographicsSubmit} className="xl:col-span-2 space-y-8">
        
        {/* CARD 1.1: KK & GENDER */}
        <div className="premium-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">1. Penduduk & Kepala Keluarga (KK)</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Gunakan tombol kurangi (-) dan tambah (+) terintegrasi untuk memperbarui data.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* KK CAPSULE */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider">Total Kepala Keluarga (KK)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button
                  type="button"
                  onClick={() => adjustDemoField('total_kk', -1)}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-200 text-slate-600 transition-colors font-extrabold text-lg select-none"
                >
                  −
                </button>
                <input
                  type="text"
                  value={demographics.total_kk}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                    setDemographics({ ...demographics, total_kk: val });
                  }}
                  className="w-full text-center py-2.5 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-805 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustDemoField('total_kk', 1)}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E] transition-colors font-extrabold text-lg select-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* PRIA CAPSULE */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider">Warga Laki-laki (Jiwa)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button
                  type="button"
                  onClick={() => adjustDemoField('total_pria', -1)}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-200 text-slate-600 transition-colors font-extrabold text-lg select-none"
                >
                  −
                </button>
                <input
                  type="text"
                  value={demographics.total_pria}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                    setDemographics({ ...demographics, total_pria: val });
                  }}
                  className="w-full text-center py-2.5 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-805 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustDemoField('total_pria', 1)}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E] transition-colors font-extrabold text-lg select-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* WANITA CAPSULE */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-505 uppercase tracking-wider">Warga Perempuan (Jiwa)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button
                  type="button"
                  onClick={() => adjustDemoField('total_wanita', -1)}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-200 text-slate-600 transition-colors font-extrabold text-lg select-none"
                >
                  −
                </button>
                <input
                  type="text"
                  value={demographics.total_wanita}
                  onChange={(e) => {
                    const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                    setDemographics({ ...demographics, total_wanita: val });
                  }}
                  className="w-full text-center py-2.5 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-805 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustDemoField('total_wanita', 1)}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E] transition-colors font-extrabold text-lg select-none"
                >
                  +
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* CARD 1.2: UMKM & USIA */}
        <div className="premium-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">2. Kelompok Usia & Wirausaha</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Data kelompok lansia, balita, dan unit usaha.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* UMKM */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pelaku UMKM (Unit)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('total_umkm', -1)} className="px-3 py-2 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-base">
                  −
                </button>
                <input
                  type="text"
                  value={demographics.total_umkm}
                  onChange={(e) => setDemographics({ ...demographics, total_umkm: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-2 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('total_umkm', 1)} className="px-3 py-2 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">
                  +
                </button>
              </div>
            </div>

            {/* BALITA */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Balita (&lt; 5 Thn)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('total_balita', -1)} className="px-3 py-2 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-base">
                  −
                </button>
                <input
                  type="text"
                  value={demographics.total_balita}
                  onChange={(e) => setDemographics({ ...demographics, total_balita: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-2 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('total_balita', 1)} className="px-3 py-2 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">
                  +
                </button>
              </div>
            </div>

            {/* PRODUSEN */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Usia Kerja (15-60 Thn)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('total_usia_produktif', -1)} className="px-3 py-2 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-base">
                  −
                </button>
                <input
                  type="text"
                  value={demographics.total_usia_produktif}
                  onChange={(e) => setDemographics({ ...demographics, total_usia_produktif: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-2 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('total_usia_produktif', 1)} className="px-3 py-2 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">
                  +
                </button>
              </div>
            </div>

            {/* LANSIA */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Lansia (&gt; 60 Thn)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('total_lansia', -1)} className="px-3 py-2 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-base">
                  −
                </button>
                <input
                  type="text"
                  value={demographics.total_lansia}
                  onChange={(e) => setDemographics({ ...demographics, total_lansia: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-2 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('total_lansia', 1)} className="px-3 py-2 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">
                  +
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* CARD 1.3: PENDAPATAN */}
        <div className="premium-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">3. Tingkat Pendapatan Bulanan per KK</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Pembagian kategori besaran pendapatan tiap KK (Kartu Keluarga).</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* UNDER 2M */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">&lt; Rp 2 Jt (KK)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('income_under_2m', -1)} className="px-3 py-2 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-base">
                  −
                </button>
                <input
                  type="text"
                  value={demographics.income_under_2m}
                  onChange={(e) => setDemographics({ ...demographics, income_under_2m: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-2 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('income_under_2m', 1)} className="px-3 py-2 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">
                  +
                </button>
              </div>
            </div>

            {/* 2M - 5M */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">Rp 2 - 5 Jt (KK)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('income_2m_to_5m', -1)} className="px-3 py-2 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-base">
                  −
                </button>
                <input
                  type="text"
                  value={demographics.income_2m_to_5m}
                  onChange={(e) => setDemographics({ ...demographics, income_2m_to_5m: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-2 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('income_2m_to_5m', 1)} className="px-3 py-2 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">
                  +
                </button>
              </div>
            </div>

            {/* 5M - 10M */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">Rp 5 - 10 Jt (KK)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('income_5m_to_10m', -1)} className="px-3 py-2 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-base">
                  −
                </button>
                <input
                  type="text"
                  value={demographics.income_5m_to_10m}
                  onChange={(e) => setDemographics({ ...demographics, income_5m_to_10m: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-2 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('income_5m_to_10m', 1)} className="px-3 py-2 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">
                  +
                </button>
              </div>
            </div>

            {/* ABOVE 10M */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-550 uppercase tracking-wider">&gt; Rp 10 Jt (KK)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('income_above_10m', -1)} className="px-3 py-2 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-base">
                  −
                </button>
                <input
                  type="text"
                  value={demographics.income_above_10m}
                  onChange={(e) => setDemographics({ ...demographics, income_above_10m: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-2 bg-white border-x-2 border-slate-200 font-black text-sm text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('income_above_10m', 1)} className="px-3 py-2 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">
                  +
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* CARD 1.4: TINGKAT PENDIDIKAN */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900">4. Distribusi Pendidikan Terakhir</h3>
            <p className="text-xs text-slate-550 font-semibold mt-1">Pembagian jumlah warga berdasarkan jenjang pendidikan terakhir.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {/* SD */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">SD/Sederajat</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('edu_sd', -1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-sm">−</button>
                <input
                  type="text"
                  value={demographics.edu_sd}
                  onChange={(e) => setDemographics({ ...demographics, edu_sd: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-1.5 bg-white border-x-2 border-slate-200 font-black text-xs text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('edu_sd', 1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">+</button>
              </div>
            </div>

            {/* SMP */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">SMP/Sederajat</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('edu_smp', -1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-sm">−</button>
                <input
                  type="text"
                  value={demographics.edu_smp}
                  onChange={(e) => setDemographics({ ...demographics, edu_smp: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-1.5 bg-white border-x-2 border-slate-200 font-black text-xs text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('edu_smp', 1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">+</button>
              </div>
            </div>

            {/* SMA */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">SMA/Sederajat</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('edu_sma', -1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-sm">−</button>
                <input
                  type="text"
                  value={demographics.edu_sma}
                  onChange={(e) => setDemographics({ ...demographics, edu_sma: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-1.5 bg-white border-x-2 border-slate-200 font-black text-xs text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('edu_sma', 1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">+</button>
              </div>
            </div>

            {/* PT */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Diploma/Sarjana</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('edu_pt', -1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-sm">−</button>
                <input
                  type="text"
                  value={demographics.edu_pt}
                  onChange={(e) => setDemographics({ ...demographics, edu_pt: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-1.5 bg-white border-x-2 border-slate-200 font-black text-xs text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('edu_pt', 1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">+</button>
              </div>
            </div>

            {/* Belum Sekolah */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Belum/Tdk Sekolah</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('edu_tidak_sekolah', -1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-sm">−</button>
                <input
                  type="text"
                  value={demographics.edu_tidak_sekolah}
                  onChange={(e) => setDemographics({ ...demographics, edu_tidak_sekolah: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-1.5 bg-white border-x-2 border-slate-200 font-black text-xs text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('edu_tidak_sekolah', 1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">+</button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 1.5: JENIS PROFESI */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900">5. Rumpun Pekerjaan / Profesi Warga</h3>
            <p className="text-xs text-slate-550 font-semibold mt-1">Pembagian kategori profesi untuk warga aktif terdata.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {/* PNS */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">PNS/TNI/Polri</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('prof_pns', -1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-sm">−</button>
                <input
                  type="text"
                  value={demographics.prof_pns}
                  onChange={(e) => setDemographics({ ...demographics, prof_pns: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-1.5 bg-white border-x-2 border-slate-200 font-black text-xs text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('prof_pns', 1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">+</button>
              </div>
            </div>

            {/* Swasta */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Swasta (Karyawan)</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('prof_swasta', -1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-sm">−</button>
                <input
                  type="text"
                  value={demographics.prof_swasta}
                  onChange={(e) => setDemographics({ ...demographics, prof_swasta: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-1.5 bg-white border-x-2 border-slate-200 font-black text-xs text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('prof_swasta', 1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">+</button>
              </div>
            </div>

            {/* Wiraswasta */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Wiraswasta/Dagang</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('prof_wiraswasta', -1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-sm">−</button>
                <input
                  type="text"
                  value={demographics.prof_wiraswasta}
                  onChange={(e) => setDemographics({ ...demographics, prof_wiraswasta: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-1.5 bg-white border-x-2 border-slate-200 font-black text-xs text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('prof_wiraswasta', 1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">+</button>
              </div>
            </div>

            {/* Nelayan */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">Nelayan/Petani</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('prof_nelayan', -1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-sm">−</button>
                <input
                  type="text"
                  value={demographics.prof_nelayan}
                  onChange={(e) => setDemographics({ ...demographics, prof_nelayan: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-1.5 bg-white border-x-2 border-slate-200 font-black text-xs text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('prof_nelayan', 1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">+</button>
              </div>
            </div>

            {/* Lainnya */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-550 uppercase tracking-wider">IRT/Belum Kerja/Lain</label>
              <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                <button type="button" onClick={() => adjustDemoField('prof_lainnya', -1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-200 text-slate-655 font-bold text-sm">−</button>
                <input
                  type="text"
                  value={demographics.prof_lainnya}
                  onChange={(e) => setDemographics({ ...demographics, prof_lainnya: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                  className="w-full text-center py-1.5 bg-white border-x-2 border-slate-200 font-black text-xs text-slate-800 focus:outline-none"
                />
                <button type="button" onClick={() => adjustDemoField('prof_lainnya', 1)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-[#85A389]/10 text-[#5F8D4E]">+</button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 1.6: WARGA BARU BULANAN */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900">6. Mutasi Pendaftaran Warga Baru per Bulan</h3>
            <p className="text-xs text-slate-550 font-semibold mt-1">Angka statistik warga masuk baru pada tahun berjalan untuk analisis grafik.</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {[
              { label: 'Januari', key: 'warga_baru_jan' },
              { label: 'Februari', key: 'warga_baru_feb' },
              { label: 'Maret', key: 'warga_baru_mar' },
              { label: 'April', key: 'warga_baru_apr' },
              { label: 'Mei', key: 'warga_baru_mei' },
              { label: 'Juni', key: 'warga_baru_jun' },
              { label: 'Juli', key: 'warga_baru_jul' },
              { label: 'Agustus', key: 'warga_baru_agu' },
              { label: 'September', key: 'warga_baru_sep' },
              { label: 'Oktober', key: 'warga_baru_okt' },
              { label: 'November', key: 'warga_baru_nov' },
              { label: 'Desember', key: 'warga_baru_des' }
            ].map((m) => (
              <div key={m.key} className="space-y-1.5">
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-tight">{m.label}</label>
                <div className="flex items-center border border-slate-250 rounded-lg overflow-hidden bg-slate-50 focus-within:border-[#85A389] transition-all">
                  <button type="button" onClick={() => adjustDemoField(m.key as any, -1)} className="px-1.5 py-1 bg-slate-55 hover:bg-slate-200 text-slate-655 font-bold text-xs select-none">−</button>
                  <input
                    type="text"
                    value={(demographics as any)[m.key]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
                      setDemographics({ ...demographics, [m.key]: val });
                    }}
                    className="w-full text-center py-1 bg-white border-x border-slate-200 font-extrabold text-[11px] text-slate-800 focus:outline-none"
                  />
                  <button type="button" onClick={() => adjustDemoField(m.key as any, 1)} className="px-1.5 py-1 bg-slate-55 hover:bg-[#85A389]/10 text-[#5F8D4E] select-none">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1E4D6B] to-[#85A389] hover:opacity-95 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center space-x-2 hover:scale-[1.02]"
          >
            <Save className="w-5 h-5 text-white" />
            <span>Simpan Transparansi Data Warga</span>
          </button>
        </div>

      </form>

      {/* LIVE GRAPHICS PREVIEW PANEL (STICKY ON DESKTOP) */}
      <div className="xl:col-span-1 space-y-6 xl:sticky xl:top-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
          <div>
            <h3 className="text-base font-black text-[#1E4D6B] flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[#85A389]" />
              <span>Grafik Live Preview</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-semibold">
              Pratinjau visual ini ter-update secara real-time mengikuti tombol (+) dan (-) di sebelah kiri sebelum disimpan ke database.
            </p>
          </div>

          {/* Rasio Gender */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Proporsi Gender Penduduk</h4>
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={62}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
                <span className="text-lg font-black text-slate-800 leading-none">
                  {Number(demographics.total_pria || 0) + Number(demographics.total_wanita || 0)}
                </span>
                <span className="text-[8px] text-slate-400 font-extrabold uppercase mt-1">Total Jiwa</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
              <div className="bg-[#1E4D6B]/5 p-2.5 rounded-xl border border-[#1E4D6B]/15">
                <span className="text-[#1A5F7A] text-[9px] block">Pria</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{demographics.total_pria}</strong>
              </div>
              <div className="bg-[#85A389]/5 p-2.5 rounded-xl border border-[#85A389]/15">
                <span className="text-[#57C5B6] text-[9px] block">Wanita</span>
                <strong className="text-slate-800 text-sm mt-0.5 block">{demographics.total_wanita}</strong>
              </div>
            </div>
          </div>

          {/* Distribusi Pendapatan */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Estimasi Pendapatan (KK)</h4>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData} margin={{ top: 10, right: 0, left: -28, bottom: 0 }}>
                  <XAxis dataKey="range" tick={{ fill: '#64748B', fontSize: 9, fontWeight: 'bold' }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 9, fontWeight: 'bold' }} />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                  <Bar dataKey="KK" radius={[4, 4, 0, 0]}>
                    {incomeData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rasio Pendidikan */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Rasio Jenjang Pendidikan</h4>
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={educationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={52}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {educationData.map((entry, index) => (
                      <Cell key={`cell-edu-prev-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tren Warga Baru */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Tren Warga Baru Bulanan</h4>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={newWargaData} margin={{ top: 5, right: 0, left: -32, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 8, fontWeight: 'bold' }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 8, fontWeight: 'bold' }} />
                  <Tooltip contentStyle={{ fontSize: '9px', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="jumlah" stroke="#85A389" fill="#85A389" fillOpacity={0.2} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
