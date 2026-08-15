import React, { useEffect, useState } from 'react';
import { Users, Home, Store, TrendingUp, Bell, ShieldAlert, Sparkles, UserCheck, FileText, Landmark, Clock, Phone } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, AreaChart, Area, CartesianGrid } from 'recharts';
import { RTDemographics, RTAnnouncement, RTSettings } from '../../types/database';
import { SupabaseService, INITIAL_DEMOGRAPHICS, INITIAL_ANNOUNCEMENTS } from '../../lib/supabase';

interface DemographicsSectionProps {
  settings?: RTSettings;
}

export const DemographicsSection: React.FC<DemographicsSectionProps> = ({ settings }) => {
  const [demographics, setDemographics] = useState<RTDemographics>(INITIAL_DEMOGRAPHICS);
  const [announcements, setAnnouncements] = useState<RTAnnouncement[]>(INITIAL_ANNOUNCEMENTS);
  const [selectedTrendYear, setSelectedTrendYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [demoData, announceData] = await Promise.all([
          SupabaseService.fetchDemographics(),
          SupabaseService.fetchAnnouncements(),
        ]);
        if (demoData) setDemographics(demoData);
        if (announceData) setAnnouncements(announceData);
      } catch (err) {
        console.error('Error loading RT data:', err);
      }
    };
    loadData();
  }, []);

  const genderData = [
    { name: 'Pria', value: demographics.total_pria || 0, color: '#1e293b' }, // Slate 800
    { name: 'Wanita', value: demographics.total_wanita || 0, color: '#cbd5e1' }, // Slate 300
  ];

  const ageChartData = [
    { name: 'Balita (<5 thn)', value: demographics.total_balita || 0, color: '#f59e0b' }, // Amber 500
    { name: 'Usia Kerja (15-60)', value: demographics.total_usia_produktif || 0, color: '#1e293b' }, // Slate 800
    { name: 'Lansia (>60 thn)', value: demographics.total_lansia || 0, color: '#94a3b8' }, // Slate 400
  ];



  const ageData = [
    { group: 'Balita (<5 thn)', total: demographics.total_balita || 0, icon: '👶', color: 'bg-slate-50 text-slate-800 border-slate-200' },
    { group: 'Usia Kerja (15-60)', total: demographics.total_usia_produktif || 0, icon: '💼', color: 'bg-slate-50 text-slate-800 border-slate-200' },
    { group: 'Lansia (>60 thn)', total: demographics.total_lansia || 0, icon: '👵', color: 'bg-slate-50 text-slate-800 border-slate-200' },
  ];

  const educationData = [
    { name: 'SD/Sederajat', value: demographics.edu_sd || 0, color: '#0f172a' }, // Slate 900
    { name: 'SMP/Sederajat', value: demographics.edu_smp || 0, color: '#334155' }, // Slate 700
    { name: 'SMA/Sederajat', value: demographics.edu_sma || 0, color: '#475569' }, // Slate 600
    { name: 'Diploma/Sarjana', value: demographics.edu_pt || 0, color: '#64748b' }, // Slate 500
    { name: 'Belum/Tdk Sekolah', value: demographics.edu_tidak_sekolah || 0, color: '#94a3b8' }, // Slate 400
  ];

  const professionData = [
    { name: 'PNS/TNI/Polri', jumlah: demographics.prof_pns || 0, color: '#475569' }, // Solid Slate 600
    { name: 'Karyawan Swasta', jumlah: demographics.prof_swasta || 0, color: '#475569' },
    { name: 'Wiraswasta/Dagang', jumlah: demographics.prof_wiraswasta || 0, color: '#475569' },
    { name: 'Nelayan/Petani/Buruh', jumlah: demographics.prof_nelayan || 0, color: '#475569' },
    { name: 'IRT/Pelajar/Lainnya', jumlah: demographics.prof_lainnya || 0, color: '#475569' },
  ];

  // Get unique list of years from registration/exit dates in database, plus a standard 2020-future range
  const getAvailableTrendYears = () => {
    const yearsSet = new Set<number>();
    
    // Generate standard range from 2020 to current year + 5
    const currentYear = new Date().getFullYear();
    for (let y = 2020; y <= currentYear + 5; y++) {
      yearsSet.add(y);
    }

    if (settings?.kk_list) {
      settings.kk_list.forEach(kk => {
        kk.members.forEach(m => {
          if (m.registrationDate) {
            const d = new Date(m.registrationDate);
            if (!isNaN(d.getTime())) yearsSet.add(d.getFullYear());
          }
          if (m.exitDate) {
            const d = new Date(m.exitDate);
            if (!isNaN(d.getTime())) yearsSet.add(d.getFullYear());
          }
        });
      });
    }

    return Array.from(yearsSet).sort((a, b) => b - a); // Descending order
  };

  // Dynamic calculation for Monthly Trend Data (masuk/keluar)
  const getMonthlyTrendData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const trend = months.map(m => ({ month: m, masuk: 0, keluar: 0 }));

    if (settings?.kk_list && settings.kk_list.length > 0) {
      settings.kk_list.forEach(kk => {
        kk.members.forEach(m => {
          // Masuk
          if (m.registrationDate) {
            const regDate = new Date(m.registrationDate);
            if (!isNaN(regDate.getTime())) {
              const year = regDate.getFullYear();
              const monthIdx = regDate.getMonth();
              if (year === selectedTrendYear && monthIdx >= 0 && monthIdx < 12) {
                trend[monthIdx].masuk++;
              }
            }
          }
          // Keluar / Meninggal
          if ((m.status === 'Keluar' || m.status === 'Meninggal') && m.exitDate) {
            const outDate = new Date(m.exitDate);
            if (!isNaN(outDate.getTime())) {
              const year = outDate.getFullYear();
              const monthIdx = outDate.getMonth();
              if (year === selectedTrendYear && monthIdx >= 0 && monthIdx < 12) {
                trend[monthIdx].keluar++;
              }
            }
          }
        });
      });
      return trend;
    }

    // Fallback using Supabase demographics
    return [
      { month: 'Jan', masuk: demographics.warga_baru_jan || 0, keluar: 0 },
      { month: 'Feb', masuk: demographics.warga_baru_feb || 0, keluar: 0 },
      { month: 'Mar', masuk: demographics.warga_baru_mar || 0, keluar: 0 },
      { month: 'Apr', masuk: demographics.warga_baru_apr || 0, keluar: 0 },
      { month: 'Mei', masuk: demographics.warga_baru_mei || 0, keluar: 0 },
      { month: 'Jun', masuk: demographics.warga_baru_jun || 0, keluar: 0 },
      { month: 'Jul', masuk: demographics.warga_baru_jul || 0, keluar: 0 },
      { month: 'Agu', masuk: demographics.warga_baru_agu || 0, keluar: 0 },
      { month: 'Sep', masuk: demographics.warga_baru_sep || 0, keluar: 0 },
      { month: 'Okt', masuk: demographics.warga_baru_okt || 0, keluar: 0 },
      { month: 'Nov', masuk: demographics.warga_baru_nov || 0, keluar: 0 },
      { month: 'Des', masuk: demographics.warga_baru_des || 0, keluar: 0 },
    ];
  };

  const trendData = getMonthlyTrendData();

  // Helper to parse newline settings
  const getSyaratList = () => {
    if (!settings?.syarat_surat) {
      return [
        'Fotokopi Kartu Keluarga (KK) terbaru',
        'Fotokopi KTP Pemohon',
        'Menyebutkan tujuan pembuatan surat'
      ];
    }
    return settings.syarat_surat.split('\n').filter(line => line.trim() !== '');
  };

  const getKontakList = () => {
    if (!settings?.kontak_darurat) {
      return [
        'Ambulans: 118',
        'Pemadam Kebakaran: 113',
        'Polsek Balikpapan Timur: (0542) 770110'
      ];
    }
    return settings.kontak_darurat.split('\n').filter(line => line.trim() !== '');
  };

  const cleanPhoneForWA = (phone?: string) => {
    if (!phone) return '6281298765432';
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) {
      return '62' + digits.substring(1);
    }
    return digits;
  };

  return (
    <section id="statistik-warga" className="py-24 relative bg-[#FAF9F6] border-t border-slate-100 bg-grid-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#0b5665]/10 border border-[#0b5665]/20 text-[#0b5665] text-xs font-black uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Keterbukaan Data & Demografi RT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Visualisasi Data Penduduk <br />
            <span className="text-[#0b5665]">
              RT 35 Kelurahan Manggar
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-bold">
            Statistik agregat kependudukan, pembagian kelompok usia, dan pemetaan tingkat pendapatan keluarga untuk transparansi publik yang rapi.
          </p>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="premium-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Kepala Keluarga</span>
              <div className="p-2.5 rounded-2xl bg-[#0b5665]/10 text-[#0b5665]">
                <Home className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 leading-none">{demographics.total_kk}</span>
              <span className="text-xs text-slate-500 ml-1.5 font-bold">KK</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-semibold">Terdata Aktif di Lingkungan</p>
          </div>

          <div className="premium-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Total Penduduk</span>
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 leading-none">{demographics.total_warga}</span>
              <span className="text-xs text-slate-500 ml-1.5 font-bold">Jiwa</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-semibold">Laki-laki & Perempuan</p>
          </div>

          <div className="premium-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Usia Produktif</span>
              <div className="p-2.5 rounded-2xl bg-[#0b5665]/10 text-[#0b5665]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 leading-none">{demographics.total_usia_produktif}</span>
              <span className="text-xs text-slate-500 ml-1.5 font-bold">Jiwa</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-semibold">Rentang Usia 15 - 60 Tahun</p>
          </div>

          <div className="premium-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider">Usaha / UMKM</span>
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-slate-900 leading-none">{demographics.total_umkm}</span>
              <span className="text-xs text-slate-500 ml-1.5 font-bold">Unit</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-semibold">Usaha Mandiri Warga RT</p>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className="space-y-8">
          {/* ROW 1: Rasio Gender & Estimasi Pendapatan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* DONUT CHART: DEMOGRAFI GENDER */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-[#0b5665]" />
                  <span>Rasio Pembagian Gender</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Perbandingan jumlah warga berjenis kelamin pria dan wanita</p>
              </div>

              <div className="h-64 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#334155' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
                  <span className="text-2xl font-black text-slate-800">{demographics.total_warga}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Jiwa</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-105 text-center">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-700 font-extrabold">Warga Laki-Laki</p>
                  <p className="text-base font-black text-slate-950 mt-0.5">
                    {demographics.total_pria} <span className="text-xs text-slate-500 font-semibold">({demographics.total_warga > 0 ? Math.round((demographics.total_pria / demographics.total_warga) * 100) : 0}%)</span>
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <p className="text-xs text-slate-700 font-extrabold">Warga Perempuan</p>
                  <p className="text-base font-black text-slate-950 mt-0.5">
                    {demographics.total_wanita} <span className="text-xs text-slate-500 font-semibold">({demographics.total_warga > 0 ? Math.round((demographics.total_wanita / demographics.total_warga) * 100) : 0}%)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* KELOMPOK USIA WARGA */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-slate-700" />
                  <span>Statistik Kelompok Usia</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Pembagian demografi warga berdasarkan rentang usia di RT 35</p>
              </div>

              <div className="h-48 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ageChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {ageChartData.map((entry, index) => (
                        <Cell key={`cell-age-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#334155' }}
                      formatter={(value: any) => [`${value} Jiwa`, 'Jumlah']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Centered Total */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-900">{demographics.total_warga}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Total Jiwa</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-slate-100">
                {ageData.map((item, idx) => (
                  <div key={idx} className={`p-2.5 rounded-2xl border ${item.color} text-center space-y-1 shadow-sm flex flex-col items-center justify-center`}>
                    <span className="text-base">{item.icon}</span>
                    <p className="text-[8px] font-black tracking-tight uppercase opacity-90 leading-none">{item.group.split(' ')[0]}</p>
                    <p className="text-sm font-black mt-0.5">{item.total} <span className="text-[9px] font-normal opacity-70">Jiwa</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 2: Tingkat Pendidikan & Jenis Profesi */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* PIE CHART: TINGKAT PENDIDIKAN */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Landmark className="w-5 h-5 text-slate-700" />
                  <span>Distribusi Tingkat Pendidikan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Pembagian jenjang pendidikan terakhir warga RT 35</p>
              </div>

              <div className="h-64 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={educationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {educationData.map((entry, index) => (
                        <Cell key={`cell-edu-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#334155' }}
                      formatter={(value: any) => [`${value} Jiwa`, 'Jumlah']}
                    />
                    <Legend verticalAlign="bottom" height={40} wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* HORIZONTAL BAR CHART: JENIS PROFESI */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Store className="w-5 h-5 text-slate-700" />
                  <span>Mata Pencaharian & Profesi Warga</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Pembagian rumpun pekerjaan warga aktif di RT 35</p>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={professionData}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                  >
                    <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" width={110} tick={{ fill: '#475569', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#334155' }}
                      formatter={(value: any) => [`${value} Jiwa`, 'Jumlah']}
                    />
                    <Bar dataKey="jumlah" radius={[0, 6, 6, 0]}>
                      {professionData.map((entry, index) => (
                        <Cell key={`bar-prof-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ROW 3: TREN PERTUMBUHAN & MUTASI PENDUDUK */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-slate-700" />
                  <span>Tren Pertumbuhan & Mutasi Penduduk RT</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Statistik pendaftaran warga masuk (mutasi masuk) dan warga keluar/meninggal per bulan</p>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun:</span>
                <select
                  value={selectedTrendYear}
                  onChange={(e) => setSelectedTrendYear(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0b5665]"
                >
                  {getAvailableTrendYears().map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMasukPub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E4D6B" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1E4D6B" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorKeluarPub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                  <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '16px', color: '#334155' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 850 }} />
                  <Area name="Warga Masuk (Jiwa)" type="monotone" dataKey="masuk" stroke="#1E4D6B" strokeWidth={3} fillOpacity={1} fill="url(#colorMasukPub)" />
                  <Area name="Warga Keluar / Wafat (Jiwa)" type="monotone" dataKey="keluar" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorKeluarPub)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ANNOUNCEMENT & SERVICES */}
        <div id="pengumuman-rt" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ANNOUNCEMENTS (SPAN 2) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Papan Pengumuman Resmi</h3>
                  <p className="text-xs text-slate-400">Jadwal kegiatan, agenda kerja bakti & info penting</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                {announcements.length} Warta
              </span>
            </div>

            <div 
              className="flex md:flex-col items-start md:items-stretch overflow-x-auto md:overflow-y-auto md:overflow-x-hidden gap-4 pb-4 md:pb-2 md:max-h-[520px] snap-x snap-mandatory w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {announcements.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-8 w-full">Belum ada pengumuman baru dari pengurus RT.</p>
              ) : (
                announcements.map((item) => (
                  <div
                    key={item.id}
                    className={`min-w-[85%] sm:min-w-[450px] md:min-w-0 flex-shrink-0 snap-start p-5 rounded-2xl border transition-all duration-200 ${
                      item.is_urgent
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9px] uppercase font-black px-2.5 py-0.5 rounded-md ${
                            item.is_urgent ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">{item.date}</span>
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-800 pt-1">{item.title}</h4>
                      </div>
                      {item.is_urgent && (
                        <ShieldAlert className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-650 mt-3 leading-relaxed whitespace-pre-line break-all break-words">{item.content}</p>
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                      <span>Penerbit: <strong className="text-slate-700">{item.author}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* GOVERNMENT SERVICE PANEL */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-[#E5D3B3]/20 text-[#bda783]">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Layanan Administrasi</h3>
                <p className="text-xs text-slate-400">Surat pengantar & info pelayanan</p>
              </div>
            </div>

            <div className="space-y-5 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start space-x-3">
                <Clock className="w-4.5 h-4.5 text-[#0b5665] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">Jam Operasional Pelayanan</p>
                  {(settings?.service_hours || 'Senin - Jumat: 19.30 - 21.30 WITA\nSabtu - Minggu: Dengan Perjanjian')
                    .split('\n')
                    .map((line, idx) => (
                      <p key={idx} className="text-slate-500 text-xs">{line}</p>
                    ))
                  }
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="w-4.5 h-4.5 text-[#E5D3B3] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">Syarat Surat Pengantar RT</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500 text-xs">
                    {getSyaratList().map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-4.5 h-4.5 text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">{settings?.emergency_title || 'Pusat Kontak Darurat'}</p>
                  {settings?.emergency_description && (
                    <p className="text-[#0b5665] text-[11px] font-bold pb-1">{settings.emergency_description}</p>
                  )}
                  {getKontakList().map((item, idx) => (
                    <p key={idx} className="text-slate-500 text-xs">{item}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center space-y-2.5">
              <p className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">Butuh Pelayanan Surat?</p>
              <p className="text-[10px] text-slate-500">Ajukan permohonan surat pengantar secara cepat ke Sekretaris RT</p>
              <a
                href={`https://wa.me/${cleanPhoneForWA(settings?.phone_secretary)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block w-full py-2.5 px-4 rounded-xl bg-[#0b5665] hover:bg-[#08424e] text-white text-xs font-bold transition-all shadow-sm text-center"
              >
                Hubungi Sekretaris (WhatsApp)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default DemographicsSection;
