import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Users, 
  Megaphone, 
  TrendingUp, 
  Settings, 
  FolderGit2, 
  Navigation,
  Sparkles,
  ArrowLeft,
  LogOut,
  Clock,
  Edit,
  Trash2,
  Save,
  Upload,
  Smartphone,
  MapPin,
  Newspaper,
  MessageSquare
} from 'lucide-react';
import { RTDemographics, RTAnnouncement, UserProfile, RTPengurus, TeamMember, ProkerItem, RTSettings, NavigationItem, NewsPost } from '../../types/database';
import { SupabaseService } from '../../lib/supabase';
import { KegiatanWargaTab } from '../../components/admin/KegiatanWargaTab';
import { DemografisTab } from '../../components/admin/DemografisTab';
import { PengumumanTab } from '../../components/admin/PengumumanTab';
import { PengurusTab } from '../../components/admin/PengurusTab';
import { PortalSettingsTab } from '../../components/admin/PortalSettingsTab';
import { MenuNavigationTab } from '../../components/admin/MenuNavigationTab';
import { FasilitasTab } from '../../components/admin/FasilitasTab';
import { NewsTab } from '../../components/admin/NewsTab';
import { AspirasiTab } from '../../components/admin/AspirasiTab';

interface SekretarisRTDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onUserProfileUpdate?: (profile: UserProfile) => void;
  activeTab?: 'demografis' | 'pengumuman' | 'pengurus' | 'kkn_team' | 'kkn_proker' | 'portal_settings' | 'menu_navigation' | 'kegiatan_warga' | 'fasilitas' | 'berita' | 'aspirasi';
  onChangeTab?: (path: string) => void;
  settings?: RTSettings;
  onSettingsUpdate?: (settings: RTSettings) => void;
  lastPublicPath?: string;
  onNavItemsUpdate?: (items: NavigationItem[]) => void;
  newsList: NewsPost[];
  onUpdateNews: (data: NewsPost[]) => void;

  demographics: RTDemographics | null;
  onUpdateDemographics: (demo: RTDemographics | null) => void;
  pengurusList: RTPengurus[];
  onUpdatePengurusList: (list: RTPengurus[]) => void;
  announcements: RTAnnouncement[];
  onUpdateAnnouncements: (list: RTAnnouncement[]) => void;
  kknTeam: TeamMember[];
  onUpdateKknTeam: (list: TeamMember[]) => void;
  prokerList: ProkerItem[];
  onUpdateProkerList: (list: ProkerItem[]) => void;
  navItems: NavigationItem[];
}

export const SekretarisRTDashboardPage: React.FC<SekretarisRTDashboardProps> = ({ 
  user, 
  onLogout, 
  onUserProfileUpdate,
  activeTab: propActiveTab,
  onChangeTab,
  settings,
  onSettingsUpdate,
  lastPublicPath,
  onNavItemsUpdate,
  newsList,
  onUpdateNews,

  demographics,
  onUpdateDemographics,
  pengurusList,
  onUpdatePengurusList,
  announcements,
  onUpdateAnnouncements,
  kknTeam,
  onUpdateKknTeam,
  prokerList,
  onUpdateProkerList,
  navItems
}) => {
  const [activeTab, setActiveTab] = useState<'demografis' | 'pengumuman' | 'pengurus' | 'kkn_team' | 'kkn_proker' | 'portal_settings' | 'menu_navigation' | 'kegiatan_warga' | 'fasilitas' | 'berita' | 'aspirasi'>('demografis');
  
  
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Local Profile Edit Form
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileName, setEditProfileName] = useState(user.full_name || '');
  const [editProfileAvatar, setEditProfileAvatar] = useState(user.avatar_url || '');

  const handleSaveProfile = async () => {
    if (!editProfileName.trim()) return;
    setLoading(true);
    try {
      const updated = {
        ...user,
        full_name: editProfileName,
        avatar_url: editProfileAvatar
      };
      const res = await SupabaseService.updateUserProfile(updated);
      if (onUserProfileUpdate) {
        onUserProfileUpdate(res);
      }
      setIsEditingProfile(false);
      showSuccess('Profil petugas berhasil disimpan!');
    } catch (err: any) {
      alert('Gagal memperbarui profil: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditProfileAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Edit states for KKN Team Member
  const [editingKKNId, setEditingKKNId] = useState<string | null>(null);
  const [editKName, setEditKName] = useState('');
  const [editKNim, setEditKNim] = useState('');
  const [editKProdi, setEditKProdi] = useState('');
  const [editKRole, setEditKRole] = useState('');
  const [editKAvatar, setEditKAvatar] = useState('');

  // Edit states for Proker
  const [editingProkerId, setEditingProkerId] = useState<string | null>(null);
  const [editPrTitle, setEditPrTitle] = useState('');
  const [editPrDesc, setEditPrDesc] = useState('');
  const [editPrCategory, setEditPrCategory] = useState('');
  const [editPrTarget, setEditPrTarget] = useState('');
  const [editPrProgress, setEditPrProgress] = useState(0);
  const [editPrStatus, setEditPrStatus] = useState<'Planned' | 'In Progress' | 'Completed'>('In Progress');
  const [editPrPIC, setEditPrPIC] = useState('');

  // Sync activeTab with propActiveTab
  useEffect(() => {
    if (propActiveTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  const updateNavItemsState = (items: NavigationItem[]) => {
    if (onNavItemsUpdate) {
      onNavItemsUpdate(items);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setSuccessMsg('');
    }, 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setTarget: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setTarget(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // KKN TEAM ACTIONS
  const startEditKKN = (m: TeamMember) => {
    setEditingKKNId(m.id);
    setEditKName(m.name);
    setEditKNim(m.nim);
    setEditKProdi(m.prodi);
    setEditKRole(m.role_kkn);
    setEditKAvatar(m.avatar_url);
  };

  const handleSaveKKN = async (mId: string) => {
    if (!editKName.trim() || !editKNim.trim()) return;
    setLoading(true);
    try {
      const target = kknTeam.find((m) => m.id === mId);
      if (!target) return;

      const updatedMember: TeamMember = {
        ...target,
        name: editKName,
        nim: editKNim,
        prodi: editKProdi,
        role_kkn: editKRole,
        avatar_url: editKAvatar
      };

      const res = await SupabaseService.updateKKNTeamMember(updatedMember);
      onUpdateKknTeam(res);
      setEditingKKNId(null);
      showSuccess('Data tim mahasiswa KKN Kelompok 7 berhasil disimpan!');
    } catch (err: any) {
      console.error('Error saving KKN member:', err);
      alert('Gagal menyimpan perubahan tim KKN: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteKKN = async (mId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data mahasiswa KKN ini?')) return;
    setLoading(true);
    try {
      const res = await SupabaseService.deleteKKNTeamMember(mId);
      onUpdateKknTeam(res);
      showSuccess('Data mahasiswa KKN berhasil dihapus!');
    } catch (err: any) {
      console.error('Error deleting KKN member:', err);
      alert('Gagal menghapus anggota tim KKN: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // PROKER ACTIONS
  const startEditProker = (p: ProkerItem) => {
    setEditingProkerId(p.id);
    setEditPrTitle(p.title);
    setEditPrDesc(p.description);
    setEditPrCategory(p.category);
    setEditPrTarget(p.target_date);
    setEditPrProgress(p.progress_percent);
    setEditPrStatus(p.status);
    setEditPrPIC(p.pic_name);
  };

  const handleSaveProker = async (pId: string) => {
    if (!editPrTitle.trim()) return;
    setLoading(true);
    try {
      const target = prokerList.find((p) => p.id === pId);
      if (!target) return;

      const updatedItem: ProkerItem = {
        ...target,
        title: editPrTitle,
        description: editPrDesc,
        category: editPrCategory,
        target_date: editPrTarget,
        progress_percent: Number(editPrProgress),
        status: editPrStatus,
        pic_name: editPrPIC
      };

      const res = await SupabaseService.updateProker(updatedItem);
      onUpdateProkerList(res);
      setEditingProkerId(null);
      showSuccess('Program Kerja (Proker) KKN berhasil diperbarui!');
    } catch (err: any) {
      console.error('Error saving proker:', err);
      alert('Gagal menyimpan program kerja KKN: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProker = async (pId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus program kerja KKN ini?')) return;
    setLoading(true);
    try {
      const res = await SupabaseService.deleteProker(pId);
      onUpdateProkerList(res);
      showSuccess('Program Kerja KKN berhasil dihapus!');
    } catch (err: any) {
      console.error('Error deleting proker:', err);
      alert('Gagal menghapus program kerja KKN: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabId: 'demografis' | 'pengumuman' | 'pengurus' | 'kkn_team' | 'kkn_proker' | 'portal_settings' | 'menu_navigation' | 'kegiatan_warga' | 'fasilitas' | 'berita' | 'aspirasi') => {
    setActiveTab(tabId);
    
    const pathMap = {
      demografis: '/admin/demografis',
      pengumuman: '/admin/pengumuman',
      pengurus: '/admin/pengurus',
      kkn_team: '/admin/kkn-team',
      kkn_proker: '/admin/kkn-proker',
      portal_settings: '/admin/settings',
      menu_navigation: '/admin/navigation',
      kegiatan_warga: '/admin/kegiatan-warga',
      fasilitas: '/admin/fasilitas',
      berita: '/admin/berita',
      aspirasi: '/admin/aspirasi'
    };

    if (onChangeTab) {
      onChangeTab(pathMap[tabId]);
    } else {
      window.history.pushState(null, '', pathMap[tabId]);
      window.dispatchEvent(new Event('popstate'));
    }
  };

  const pendingMessagesCount = settings?.messages_list?.filter(m => m.status === 'pending').length || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      
      {/* 1. SIDEBAR CONTROLLER */}
      <aside className="w-full lg:w-72 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto bg-slate-900 text-white p-6 flex flex-col justify-between shrink-0 border-r border-slate-800">
        
        <div className="space-y-8">
          {/* Logo & Info Header */}
          <div className="flex items-center space-x-3 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.png" alt="Logo RT 35" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-none">{user.full_name || 'Sekretaris RT 35'}</h1>
              <p className="text-[9px] text-[#85A389] font-black mt-1.5 uppercase tracking-wider">Manggar - Balikpapan</p>
            </div>
          </div>

          {/* Navigation Tab Menu */}
          <nav className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 block pb-2">Kontrol Data Warga</span>
            
            <button
              onClick={() => handleTabClick('demografis')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'demografis' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp className="w-4.5 h-4.5" />
              <span>Statistik Warga (Demografi)</span>
            </button>

            <button
              onClick={() => handleTabClick('pengumuman')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'pengumuman' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Megaphone className="w-4.5 h-4.5" />
              <span>Pengumuman RT</span>
            </button>

            <button
              onClick={() => handleTabClick('pengurus')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'pengurus' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              <span>Aparatur RT (Pengurus)</span>
            </button>

            <button
              onClick={() => handleTabClick('kegiatan_warga')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'kegiatan_warga' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4.5 h-4.5" />
              <span>Kegiatan Warga</span>
            </button>

            <button
              onClick={() => handleTabClick('fasilitas')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'fasilitas' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4.5 h-4.5" />
              <span>Fasilitas RT</span>
            </button>

            <button
              onClick={() => handleTabClick('berita')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'berita' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Newspaper className="w-4.5 h-4.5" />
              <span>Berita RT</span>
            </button>

            <button
              onClick={() => handleTabClick('aspirasi')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'aspirasi' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-4.5 h-4.5" />
                <span>Aspirasi & Lapor Tamu</span>
              </div>
              {pendingMessagesCount > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  {pendingMessagesCount}
                </span>
              )}
            </button>

            <div className="pt-4 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 block">Mitra KKN RT</span>
            </div>

            <button
              onClick={() => handleTabClick('kkn_team')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'kkn_team' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              <span>Tim KKN Kelompok 7</span>
            </button>

            <button
              onClick={() => handleTabClick('kkn_proker')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'kkn_proker' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderGit2 className="w-4.5 h-4.5" />
              <span>Program Kerja KKN</span>
            </button>

            <div className="pt-4 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 block">Sistem Portal</span>
            </div>

            <button
              onClick={() => handleTabClick('portal_settings')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'portal_settings' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              <span>Pengaturan Portal</span>
            </button>

            {user?.role === 'developer' && (
              <button
                onClick={() => handleTabClick('menu_navigation')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'menu_navigation' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Navigation className="w-4.5 h-4.5" />
                <span>Menu & Halaman</span>
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar Footer Operations */}
        <div className="pt-6 border-t border-slate-800 mt-8 space-y-3">
          <button
            onClick={() => {
              if (onChangeTab) {
                onChangeTab(lastPublicPath || '/home');
              } else {
                window.history.pushState(null, '', '/home');
                window.dispatchEvent(new Event('popstate'));
              }
            }}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-355 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4.5 h-4.5 text-slate-600" />
            <span>Lihat Portal Publik</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-rose-900/20 hover:bg-rose-900/30 text-rose-300 text-xs font-bold border border-rose-900/40 transition-all"
          >
            <LogOut className="w-4.5 h-4.5 text-rose-450" />
            <span>Keluar Dashboard</span>
          </button>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-grow p-6 sm:p-8 lg:p-12 overflow-y-auto relative z-10 max-w-[1400px] mx-auto w-full space-y-8">
        
        {/* TAB HEADER */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize">
              {activeTab === 'kkn_team' ? 'Tim Mahasiswa KKN 7' : activeTab === 'kkn_proker' ? 'Program Kerja KKN' : activeTab.replace('_', ' ')}
            </h2>
            <p className="text-sm text-slate-550 font-semibold mt-1">Konfigurasi data publik RT 35 secara real-time</p>
          </div>
          
          {/* Active Administrator Identity Badge */}
          <div 
            onClick={() => {
              setEditProfileName(user.full_name || '');
              setEditProfileAvatar(user.avatar_url || '');
              setIsEditingProfile(true);
            }}
            className="hidden sm:flex items-center space-x-3 bg-[#85A389]/10 border border-[#85A389]/20 px-4 py-2 rounded-2xl cursor-pointer hover:bg-[#85A389]/20 transition-all"
            title="Klik untuk Edit Profil"
          >
            <img 
              src={user.avatar_url || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23CBD5E1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'} 
              alt={user.full_name} 
              className="w-8 h-8 rounded-full object-cover border border-[#85A389]/30 bg-slate-100" 
            />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-bold leading-none">Login Petugas:</span>
              <strong className="text-xs text-[#5F8D4E] font-black mt-0.5 block">{user.full_name || 'Sekretaris RT'}</strong>
            </div>
          </div>
        </div>

        {/* PROFILE EDIT MODAL DIALOG */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-scale-up">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-slate-900">Ubah Profil Petugas</h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">Ubah nama tampilan dan foto profil untuk identitas dashboard Anda.</p>
              </div>

              <div className="space-y-4 text-xs font-bold text-slate-700">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <img 
                      src={editProfileAvatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23CBD5E1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'} 
                      alt="Profile Preview" 
                      className="w-24 h-24 rounded-full object-cover border-2 border-[#85A389] bg-slate-100" 
                    />
                    <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#85A389] text-white hover:opacity-95 shadow cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleProfileImageUpload} 
                      />
                    </label>
                  </div>
                  {editProfileAvatar && (
                    <button 
                      type="button" 
                      onClick={() => setEditProfileAvatar('')} 
                      className="text-[10px] text-rose-600 font-black hover:text-rose-800"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase tracking-wider text-slate-500">Nama Tampilan Petugas</label>
                  <input
                    type="text"
                    value={editProfileName}
                    onChange={(e) => setEditProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold transition-all"
                >
                  Simpan Profil
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Action Toast successMsg Alerts */}
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs shadow-md border border-emerald-600 animate-slide-up flex items-center justify-center">
            <span>🎉 {successMsg}</span>
          </div>
        )}

        {/* TAB CONTENTS */}
        
        {/* 1. DEMOGRAFIS TAB */}
        {activeTab === 'demografis' && (
          <DemografisTab
            initialDemographics={demographics}
            onUpdateDemographics={onUpdateDemographics}
            showSuccess={showSuccess}
            settings={settings}
            onSettingsUpdate={onSettingsUpdate}
          />
        )}

        {/* 2. PENGUMUMAN TAB */}
        {activeTab === 'pengumuman' && (
          <PengumumanTab
            announcements={announcements}
            user={user}
            onUpdateAnnouncements={onUpdateAnnouncements}
            showSuccess={showSuccess}
          />
        )}

        {/* 3. PENGURUS TAB */}
        {activeTab === 'pengurus' && (
          <PengurusTab
            pengurusList={pengurusList}
            onUpdatePengurusList={onUpdatePengurusList}
            showSuccess={showSuccess}
          />
        )}

        {/* 4. KEGIATAN WARGA TAB */}
        {activeTab === 'kegiatan_warga' && (
          <KegiatanWargaTab
            navItems={navItems}
            onNavItemsUpdate={updateNavItemsState}
            showSuccess={showSuccess}
          />
        )}

        {/* FASILITAS TAB */}
        {activeTab === 'fasilitas' && (
          <FasilitasTab
            showSuccess={showSuccess}
          />
        )}

        {/* BERITA TAB */}
        {activeTab === 'berita' && (
          <NewsTab
            newsList={newsList}
            user={user}
            onUpdateNews={onUpdateNews}
            showSuccess={showSuccess}
          />
        )}

        {/* ASPIRASI & LAPOR TAMU TAB */}
        {activeTab === 'aspirasi' && (
          <AspirasiTab
            settings={settings}
            onSettingsUpdate={onSettingsUpdate}
            showSuccess={showSuccess}
          />
        )}

        {/* 5. PORTAL SETTINGS TAB */}
        {activeTab === 'portal_settings' && (
          <PortalSettingsTab
            settings={settings}
            onUpdateSettings={(updated) => {
              if (onSettingsUpdate) onSettingsUpdate(updated);
            }}
            showSuccess={showSuccess}
          />
        )}

        {/* 6. MENU NAVIGATION TAB */}
        {activeTab === 'menu_navigation' && (
          <MenuNavigationTab
            navItems={navItems}
            onNavItemsUpdate={updateNavItemsState}
            showSuccess={showSuccess}
          />
        )}

        {/* TAB CONTENT: KKN TEAM (Mitra KKN) */}
        {activeTab === 'kkn_team' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {kknTeam.map((m) => {
              const isEditing = editingKKNId === m.id;
              return (
                <div key={m.id} className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col justify-between space-y-6 hover:border-[#85A389]/30 transition-all">
                  
                  {isEditing ? (
                    <div className="space-y-3.5 text-xs font-bold text-slate-700">
                      <div>
                        <label className="block text-xs font-bold text-slate-505 mb-1">Nama Mahasiswa</label>
                        <input
                          type="text"
                          value={editKName}
                          onChange={(e) => setEditKName(e.target.value)}
                          className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-505 mb-1">NIM</label>
                        <input
                          type="text"
                          value={editKNim}
                          onChange={(e) => setEditKNim(e.target.value)}
                          className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-505 mb-1">Program Studi</label>
                        <input
                          type="text"
                          value={editKProdi}
                          onChange={(e) => setEditKProdi(e.target.value)}
                          className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-505 mb-1">Peran di Kelompok</label>
                        <input
                          type="text"
                          value={editKRole}
                          onChange={(e) => setEditKRole(e.target.value)}
                          className="w-full px-4.5 py-2.5 rounded-xl bg-slate-50 border-2 border-slate-200 font-semibold"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-505">Unggah Foto Avatar</label>
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                          {editKAvatar && (
                            <img src={editKAvatar} alt="Preview" className="w-10 h-10 rounded-full object-cover" />
                          )}
                          <label className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-slate-350 hover:bg-slate-100 text-slate-750 font-bold text-xs cursor-pointer">
                            <Upload className="w-4 h-4 text-slate-500" />
                            <span>Pilih Avatar</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, setEditKAvatar)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <img
                        src={m.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={m.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#85A389]/25 shadow-sm"
                      />
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-[#5F8D4E] bg-[#85A389]/10 px-2 py-0.5 rounded border border-[#85A389]/20 uppercase tracking-wider">
                          {m.role_kkn}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 leading-tight pt-1 truncate">{m.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">NIM: {m.nim} • {m.prodi}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4 border-t border-slate-100">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveKKN(m.id)}
                          className="flex-grow py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow"
                        >
                          <Save className="w-4 h-4" />
                          <span>Simpan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingKKNId(null)}
                          className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                        >
                          Batal
                        </button>
                      </>
                    ) : (
                      <div className="flex w-full space-x-2">
                        <button
                          type="button"
                          onClick={() => startEditKKN(m)}
                          className="flex-grow py-2.5 rounded-xl bg-slate-50 hover:bg-slate-105 text-slate-750 text-xs font-bold border-2 border-slate-200 flex items-center justify-center space-x-2 shadow-sm"
                        >
                          <Edit className="w-4 h-4 text-[#85A389]" />
                          <span>Ubah Anggota</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteKKN(m.id)}
                          className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center justify-center shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* TAB CONTENT: KKN PROKER (Mitra KKN Program Kerja) */}
        {activeTab === 'kkn_proker' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-3 space-y-6">
              <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-md">
                <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100 mb-4">
                  Daftar Program Kerja KKN Kelompok 7
                </h3>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {prokerList.map((p) => {
                    const isEditing = editingProkerId === p.id;
                    return (
                      <div key={p.id} className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-150 flex flex-col justify-between space-y-4 hover:border-[#85A389]/25 transition-all">
                        {isEditing ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-black uppercase text-slate-500">Judul Program Kerja</label>
                              <input
                                type="text"
                                value={editPrTitle}
                                onChange={(e) => setEditPrTitle(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-black uppercase text-slate-500">Kategori / Sektor</label>
                              <input
                                type="text"
                                value={editPrCategory}
                                onChange={(e) => setEditPrCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 font-semibold"
                              />
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <label className="block text-[10px] font-black uppercase text-slate-500">Deskripsi / Uraian Rencana Kerja</label>
                              <textarea
                                rows={2}
                                value={editPrDesc}
                                onChange={(e) => setEditPrDesc(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 font-medium"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-black uppercase text-slate-500">Target Tanggal Pelaksanaan</label>
                              <input
                                type="text"
                                value={editPrTarget}
                                onChange={(e) => setEditPrTarget(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-black uppercase text-slate-500">PIC Penanggung Jawab</label>
                              <input
                                type="text"
                                value={editPrPIC}
                                onChange={(e) => setEditPrPIC(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 font-semibold"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                              <div className="space-y-1">
                                <label className="block text-[10px] font-black uppercase text-slate-500">Progres Kerja (% - angka saja)</label>
                                <input
                                  type="number"
                                  min={0}
                                  max={100}
                                  value={editPrProgress}
                                  onChange={(e) => setEditPrProgress(Number(e.target.value))}
                                  className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-[10px] font-black uppercase text-slate-500">Status Capaian</label>
                                <select
                                  value={editPrStatus}
                                  onChange={(e) => setEditPrStatus(e.target.value as any)}
                                  className="w-full px-3 py-2 rounded-lg bg-white border-2 border-slate-200 font-semibold"
                                >
                                  <option value="Planned">Planned (Direncanakan)</option>
                                  <option value="In Progress">In Progress (Berjalan)</option>
                                  <option value="Completed">Completed (Selesai)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-2 min-w-0">
                              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#85A389]/10 text-[#5F8D4E] border border-[#85A389]/20">
                                  {p.category}
                                </span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                  p.status === 'Completed' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : p.status === 'In Progress'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                      : 'bg-slate-100 text-slate-550 border border-slate-200'
                                }`}>
                                  {p.status}
                                </span>
                                <span className="text-[10px] text-slate-400 font-semibold">Target: {p.target_date}</span>
                              </div>
                              
                              <h4 className="text-sm sm:text-base font-black text-slate-850">{p.title}</h4>
                              <p className="text-xs text-slate-550 leading-relaxed font-semibold">{p.description}</p>
                              <p className="text-[10px] text-slate-400 font-bold">PIC Penanggung Jawab: <strong className="text-slate-700">{p.pic_name}</strong></p>
                            </div>
                            
                            {/* Progress bar visualizer */}
                            <div className="w-full sm:w-44 shrink-0 space-y-1 pt-2 sm:pt-0">
                              <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500">
                                <span>Capaian Target</span>
                                <span>{p.progress_percent}%</span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-slate-205 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#85A389] to-[#5F8D4E] transition-all" style={{ width: `${p.progress_percent}%` }} />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2 pt-3 border-t border-slate-150 justify-end">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveProker(p.id)}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow"
                              >
                                <Save className="w-4 h-4" />
                                <span>Simpan</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingProkerId(null)}
                                className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                              >
                                Batal
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditProker(p)}
                                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-855 text-xs font-bold border-2 border-slate-200 flex items-center space-x-1.5"
                              >
                                <Edit className="w-4 h-4 text-[#85A389]" />
                                <span>Ubah Proker</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProker(p.id)}
                                className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};

export default SekretarisRTDashboardPage;
