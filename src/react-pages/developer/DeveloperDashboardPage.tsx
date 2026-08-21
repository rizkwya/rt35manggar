import React, { useState, useEffect } from 'react';
import { UserProfile, NewsPost, ProkerItem, DevBroadcast } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { 
  Code2, 
  FileText, 
  PlusCircle, 
  Trash2, 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  Sparkles, 
  Radio,
  Send,
  AlertTriangle,
  AlertCircle,
  Info,
  Eye,
  Camera,
  Upload,
  User,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { DevBroadcastModal } from '../../components/admin/DevBroadcastModal';

interface DeveloperDashboardPageProps {
  userProfile: UserProfile;
  onUserProfileUpdate?: (profile: UserProfile) => void;
  newsList: NewsPost[];
  prokerList: ProkerItem[];
  onAddNews: (news: NewsPost) => void;
  onDeleteNews: (id: string) => void;
  onUpdateProker: (proker: ProkerItem) => void;
  onGoToLanding: () => void;
  onLogout: () => void;
}

export const DeveloperDashboardPage: React.FC<DeveloperDashboardPageProps> = ({
  userProfile,
  onUserProfileUpdate,
  newsList,
  prokerList,
  onAddNews,
  onDeleteNews,
  onUpdateProker,
  onGoToLanding,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'proker' | 'broadcast'>('broadcast');

  // PROFILE EDIT STATE
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userProfile.full_name || '');
  const [editAvatar, setEditAvatar] = useState(userProfile.avatar_url || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // FORM NEWS STATE
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Kegiatan Utama');
  const [summaryInput, setSummaryInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [imageInput, setImageInput] = useState('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80');
  const [alertSuccess, setAlertSuccess] = useState(false);

  // BROADCAST STATE
  const [bcTitle, setBcTitle] = useState('');
  const [bcMessage, setBcMessage] = useState('');
  const [bcType, setBcType] = useState<'info' | 'warning' | 'urgent' | 'success'>('urgent');
  const [bcSending, setBcSending] = useState(false);
  const [bcSuccessMsg, setBcSuccessMsg] = useState('');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activeBroadcast, setActiveBroadcast] = useState<DevBroadcast | null>(null);

  useEffect(() => {
    const loadCurrentBroadcast = async () => {
      const active = await SupabaseService.fetchActiveDevBroadcast();
      setActiveBroadcast(active);
    };
    loadCurrentBroadcast();
  }, []);

  // IMAGE RESIZER & COMPRESSOR
  const resizeAndCompressImage = (file: File, callback: (base64: string) => void) => {
    const isTransparentFormat = file.type.includes('png') || file.type.includes('webp') || file.type.includes('svg');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          const outputFormat = isTransparentFormat ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(outputFormat, isTransparentFormat ? 0.95 : 0.85);
          callback(dataUrl);
        } else {
          callback(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    resizeAndCompressImage(file, setEditAvatar);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      alert('Nama tidak boleh kosong!');
      return;
    }

    setIsSavingProfile(true);
    try {
      const updatedUser: UserProfile = {
        ...userProfile,
        full_name: editName.trim(),
        avatar_url: editAvatar || userProfile.avatar_url || '/logo.png',
      };

      const result = await SupabaseService.updateUserProfile(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userProfile', JSON.stringify(result));
      }
      if (onUserProfileUpdate) {
        onUserProfileUpdate(result);
      }

      setProfileSuccessMsg('Foto profil dan nama developer berhasil diperbarui!');
      setTimeout(() => {
        setProfileSuccessMsg('');
        setIsEditingProfile(false);
      }, 1500);
    } catch (err: any) {
      alert('Gagal menyimpan profil: ' + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAddNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !summaryInput.trim()) return;

    const slug = titleInput.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newNews: NewsPost = {
      id: 'news-' + Date.now(),
      title: titleInput,
      slug: slug,
      summary: summaryInput,
      content: contentInput || summaryInput,
      category: categoryInput,
      image_url: imageInput || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
      author_name: userProfile.full_name,
      is_published: true,
      created_at: new Date().toISOString(),
    };

    onAddNews(newNews);
    setTitleInput('');
    setSummaryInput('');
    setContentInput('');
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 4000);
  };

  // BROADCAST SUBMISSION
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle.trim() || !bcMessage.trim()) {
      alert('Judul dan pesan siaran wajib diisi!');
      return;
    }

    setBcSending(true);
    try {
      const nowStr = new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Makassar'
      }).format(new Date()) + ' WITA';

      const payload: DevBroadcast = {
        id: 'bc-' + Date.now(),
        title: bcTitle.trim(),
        message: bcMessage.trim(),
        type: bcType,
        author_name: userProfile.full_name,
        author_avatar: userProfile.avatar_url || '/logo.png',
        timestamp: nowStr,
        is_active: true
      };

      const success = await SupabaseService.sendDevBroadcast(payload);
      if (success) {
        setActiveBroadcast(payload);
        setBcSuccessMsg('Siaran berhasil dikirim ke seluruh layar admin secara realtime!');
        setTimeout(() => setBcSuccessMsg(''), 5000);
      } else {
        alert('Gagal mengirim siaran. Silakan coba lagi.');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setBcSending(false);
    }
  };

  const handleClearBroadcast = async () => {
    if (!confirm('Hapus siaran popup aktif dari semua layar?')) return;
    setBcSending(true);
    try {
      await SupabaseService.clearActiveDevBroadcast();
      setActiveBroadcast(null);
      setBcSuccessMsg('Siaran aktif berhasil dibersihkan.');
      setTimeout(() => setBcSuccessMsg(''), 4000);
    } finally {
      setBcSending(false);
    }
  };

  const applyTemplate = (title: string, message: string, type: 'info' | 'warning' | 'urgent' | 'success') => {
    setBcTitle(title);
    setBcMessage(message);
    setBcType(type);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* TOP DASHBOARD HEADER */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* BRANDING */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <Code2 className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h1 className="font-display font-black text-white text-base leading-tight">
                  CMS DEVELOPER & CONTROL PANEL
                </h1>
                <p className="text-[11px] font-extrabold text-amber-400">
                  RT 35 Manggar 2 • System Command Center
                </p>
              </div>
            </div>

            {/* USER PROFILE & ACTIONS */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onGoToLanding}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs border border-slate-700 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>🌐 Lihat Portal Publik</span>
              </button>

              {/* CLICKABLE PROFILE TO EDIT PHOTO */}
              <button
                onClick={() => {
                  setEditName(userProfile.full_name);
                  setEditAvatar(userProfile.avatar_url || '');
                  setIsEditingProfile(true);
                }}
                className="flex items-center space-x-2.5 pl-3 pr-2 py-1 rounded-2xl border-l border-slate-800 hover:bg-slate-800/80 transition-all group cursor-pointer text-left"
                title="Klik untuk ubah foto profil developer"
              >
                <div className="relative">
                  <img
                    src={userProfile.avatar_url || '/logo.png'}
                    alt={userProfile.full_name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-amber-500 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] shadow">
                    <Camera className="w-2.5 h-2.5" />
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center space-x-1">
                    <p className="text-xs font-black text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {userProfile.full_name}
                    </p>
                  </div>
                  <p className="text-[10px] text-amber-400 font-mono font-bold flex items-center space-x-1">
                    <span>Dev Master</span>
                    <span className="text-slate-500">• Ubah Foto</span>
                  </p>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 transition-all"
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
        
        {/* TABS HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex space-x-2 flex-wrap gap-y-2">
            {[
              { id: 'broadcast', label: 'Broadcast Notifikasi Dev', icon: Radio },
              { id: 'news', label: 'CMS Berita Realtime', icon: FileText },
              { id: 'proker', label: 'Kelola Proker', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/20'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 0: BROADCAST NOTIFICATION CENTER */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SENDER FORM */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-6">
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider border border-rose-200">
                    Live Broadcast Hub
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-2">Kirim Siaran Notifikasi ke Seluruh Admin</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Pemberitahuan ini akan langsung muncul sebagai <strong>modal popup seketika</strong> di seluruh layar pengguna/admin yang sedang membuka dashboard RT 35 secara real-time.
                </p>
              </div>

              {bcSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2.5 animate-scale-up">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{bcSuccessMsg}</span>
                </div>
              )}

              {/* QUICK TEMPLATES */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                  ⚡ Template Cepat Siaran:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplate(
                      'Pemeliharaan Server & Database',
                      'Halo Petugas RT 35, sistem portal akan melakukan maintenance dan optimasi database pada pukul 23:00 WITA. Harap pastikan data yang sedang diinput telah disimpan.',
                      'warning'
                    )}
                    className="p-2.5 text-left rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold text-amber-900 transition-all flex items-center space-x-2"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">Pemeliharaan Server</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate(
                      'Pemberitahuan Mendesak Developer',
                      'PERHATIAN: Mohon tidak mengubah data demografis untuk 15 menit ke depan karena sedang sinkronisasi cadangan server cloud.',
                      'urgent'
                    )}
                    className="p-2.5 text-left rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[11px] font-bold text-rose-900 transition-all flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="truncate">Pemberitahuan Mendesak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate(
                      'Pembaruan Fitur Baru Selesai',
                      'Fitur sinkronisasi real-time dan paginasi kartu KKN telah berhasil diperbarui dan aktif di sistem. Terima kasih atas kerja samanya!',
                      'success'
                    )}
                    className="p-2.5 text-left rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold text-emerald-900 transition-all flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">Pembaruan Fitur Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate(
                      'Informasi Pengembang',
                      'Halo admin, pastikan selalu memeriksa menu Aspirasi Warga secara berkala setiap pagi untuk respon cepat warga RT 35.',
                      'info'
                    )}
                    className="p-2.5 text-left rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-[11px] font-bold text-sky-900 transition-all flex items-center space-x-2"
                  >
                    <Info className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="truncate">Informasi Pengembang</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                
                {/* SEVERITY TYPE SELECTOR */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tingkat Urgensi / Tipe Notifikasi</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'urgent', label: 'Mendesak (Rose)', icon: AlertTriangle, bg: 'peer-checked:bg-rose-50 peer-checked:border-rose-500 peer-checked:text-rose-700' },
                      { id: 'warning', label: 'Peringatan (Kuning)', icon: AlertCircle, bg: 'peer-checked:bg-amber-50 peer-checked:border-amber-500 peer-checked:text-amber-700' },
                      { id: 'info', label: 'Info (Biru)', icon: Info, bg: 'peer-checked:bg-sky-50 peer-checked:border-sky-500 peer-checked:text-sky-700' },
                      { id: 'success', label: 'Pengumuman (Hijau)', icon: CheckCircle2, bg: 'peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <label key={item.id} className="cursor-pointer">
                          <input
                            type="radio"
                            name="bcType"
                            value={item.id}
                            checked={bcType === item.id}
                            onChange={() => setBcType(item.id as any)}
                            className="hidden peer"
                          />
                          <div className={`p-3 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold flex flex-col items-center justify-center space-y-1.5 transition-all text-center ${item.bg}`}>
                            <Icon className="w-4 h-4" />
                            <span className="text-[11px] leading-tight">{item.label}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* TITLE INPUT */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Pemberitahuan <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pemberitahuan Pemeliharaan Sistem..."
                    value={bcTitle}
                    onChange={(e) => setBcTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                {/* MESSAGE INPUT */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pesan Lengkap Siaran <span className="text-rose-500">*</span></label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan pesan yang akan dibaca oleh seluruh user di admin dashboard..."
                    value={bcMessage}
                    onChange={(e) => setBcMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800 resize-none leading-relaxed"
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPreviewModalOpen(true)}
                    disabled={!bcTitle.trim() || !bcMessage.trim()}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                  >
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span>Lihat Preview Popup</span>
                  </button>

                  <button
                    type="submit"
                    disabled={bcSending || !bcTitle.trim() || !bcMessage.trim()}
                    className="w-full sm:flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{bcSending ? 'Mengirim Siaran...' : '🚀 Kirim Siaran Realtime Sekarang'}</span>
                  </button>
                </div>

              </form>
            </div>

            {/* ACTIVE BROADCAST STATUS & CONTROLS */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <h4 className="text-sm font-black text-slate-900">Status Siaran Aktif</h4>
                  </div>
                  {activeBroadcast && (
                    <button
                      onClick={handleClearBroadcast}
                      disabled={bcSending}
                      className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold border border-rose-200 transition-all"
                    >
                      Hapus Siaran
                    </button>
                  )}
                </div>

                {activeBroadcast ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {activeBroadcast.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{activeBroadcast.timestamp}</span>
                    </div>
                    <h5 className="font-black text-slate-900 text-sm leading-snug">{activeBroadcast.title}</h5>
                    <p className="text-xs text-slate-600 font-semibold line-clamp-3 leading-relaxed">{activeBroadcast.message}</p>
                    <p className="text-[10px] text-slate-400 font-bold">Oleh: {activeBroadcast.author_name}</p>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                    <Radio className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-bold">Tidak ada siaran popup aktif saat ini.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Siaran yang dikirim akan tampil di sini.</p>
                  </div>
                )}
              </div>

              {/* INSTRUCTION CARD */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md space-y-3">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">Bagaimana Fitur Ini Bekerja?</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 font-medium leading-relaxed">
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Realtime WebSocket:</strong> Notifikasi langsung menyembur ke setiap browser pengguna tanpa delay.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Audio Chime:</strong> Dilengkapi nada notifikasi lembut yang memicu perhatian admin.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span><strong>Persistent:</strong> Pengguna yang baru membuka admin 5 menit kemudian tetap melihat pengumuman aktif ini.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        )}

        {/* TAB 1: CMS BERITA */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FORM POST NEWS */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Post Live Report Berita Baru</h3>
                <p className="text-xs text-slate-605 font-semibold mt-0.5">Berita langsung tayang di Landing Page secara realtime.</p>
              </div>

              {alertSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-805 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Berita Live Report berhasil diterbitkan!</span>
                </div>
              )}

              <form onSubmit={handleAddNewsSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">Judul Berita</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pemetaan UMKM RT 35"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#236F9E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">Kategori</label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:border-[#236F9E]"
                  >
                    <option value="Kegiatan Utama">Kegiatan Utama</option>
                    <option value="Digitalisasi UMKM">Digitalisasi UMKM</option>
                    <option value="Teknologi">Teknologi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">Ringkasan Singkat</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Ringkasan singkat berita..."
                    value={summaryInput}
                    onChange={(e) => setSummaryInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">Isi Lengkap Berita</label>
                  <textarea
                    rows={4}
                    placeholder="Uraian berita lengkap..."
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">URL Gambar Thumbnail</label>
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Publikasikan Live Report</span>
                </button>
              </form>
            </div>

            {/* LIST EXISTING NEWS */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-black text-slate-900">Daftar Berita Aktif ({newsList.length})</h3>
              
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {newsList.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black">{item.category}</span>
                        <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-1 mt-0.5">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold line-clamp-1">{item.summary}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteNews(item.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-650 transition-all shrink-0"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROKER MANAGER */}
        {activeTab === 'proker' && (
          <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-black text-slate-900">Kelola Progres Program Kerja ({prokerList.length})</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prokerList.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black">{p.category}</span>
                    <span className="text-xs font-black text-[#236F9E]">{p.progress_percent}% Selesai</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-base">{p.title}</h4>
                  <p className="text-xs text-slate-600 font-semibold line-clamp-2">{p.description}</p>

                  <div className="flex items-center space-x-2 pt-2">
                    <label className="text-xs font-bold text-slate-700">Update Progres:</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={p.progress_percent}
                      onChange={(e) => onUpdateProker({ ...p, progress_percent: parseInt(e.target.value) })}
                      className="w-full accent-[#236F9E]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => !isSavingProfile && setIsEditingProfile(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 z-10 animate-scale-up" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-200 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Ubah Profil Developer</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Perbarui nama dan foto profil Anda</p>
                </div>
              </div>
              <button
                type="button"
                disabled={isSavingProfile}
                onClick={() => setIsEditingProfile(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {profileSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* AVATAR PREVIEW & UPLOAD */}
              <div className="flex flex-col items-center justify-center space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="relative group">
                  <img
                    src={editAvatar || userProfile.avatar_url || '/logo.png'}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-4 border-amber-500 shadow-md"
                  />
                  <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 cursor-pointer shadow transition-all active:scale-95">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isSavingProfile}
                      className="hidden"
                      onChange={handleProfileImageUpload}
                    />
                  </label>
                </div>
                
                <div className="text-center">
                  <label className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-all shadow-sm">
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                    <span>Pilih Foto Baru dari Galeri / Kamera</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isSavingProfile}
                      className="hidden"
                      onChange={handleProfileImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* NAME INPUT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Developer</label>
                <input
                  type="text"
                  required
                  value={editName}
                  disabled={isSavingProfile}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="GUSTI IHSANUDDIN"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* AVATAR URL ALTERNATIVE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Atau Masukkan URL Gambar (Opsional)</label>
                <input
                  type="text"
                  value={editAvatar}
                  disabled={isSavingProfile}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  placeholder="https://example.com/foto.jpg"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* BUTTON ACTIONS */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSavingProfile}
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-black text-xs shadow-md transition-all flex items-center space-x-2"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewModalOpen && (
        <DevBroadcastModal
          broadcast={{
            id: 'preview',
            title: bcTitle || 'Judul Contoh Siaran',
            message: bcMessage || 'Ini adalah contoh isi pesan siaran yang akan tampil.',
            type: bcType,
            author_name: userProfile.full_name,
            author_avatar: userProfile.avatar_url,
            timestamp: 'Pratinjau Langsung',
            is_active: true
          }}
          onClose={() => setPreviewModalOpen(false)}
        />
      )}

    </div>
  );
};
export default DeveloperDashboardPage;
