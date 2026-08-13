import React, { useState } from 'react';
import { UserProfile, NewsPost, ProkerItem } from '../../types/database';
import { 
  Code2, 
  FileText, 
  PlusCircle, 
  Trash2, 
  Download, 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  Sparkles, 
  Waves,
  LayoutDashboard
} from 'lucide-react';

interface DeveloperDashboardPageProps {
  userProfile: UserProfile;
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
  newsList,
  prokerList,
  onAddNews,
  onDeleteNews,
  onUpdateProker,
  onGoToLanding,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'proker'>('news');

  // FORM NEWS STATE
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Kegiatan Utama');
  const [summaryInput, setSummaryInput] = useState('');
  const [contentInput, setContentInput] = useState('');
  const [imageInput, setImageInput] = useState('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80');
  const [alertSuccess, setAlertSuccess] = useState(false);

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
                  CMS DEVELOPER & ADMIN
                </h1>
                <p className="text-[11px] font-extrabold text-amber-400">
                  RT 35 Manggar 2 • Control Panel
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
                <span>🌐 Lihat Landing Page Utama</span>
              </button>

              <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-800">
                <img
                  src={userProfile.avatar_url}
                  alt={userProfile.full_name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-amber-500"
                />
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-white line-clamp-1">{userProfile.full_name}</p>
                  <p className="text-[10px] text-amber-400 font-mono font-bold">Dev Master</p>
                </div>
              </div>

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
          <div className="flex space-x-2">
            {[
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
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
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

    </div>
  );
};
export default DeveloperDashboardPage;
