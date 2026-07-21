import React, { useState } from 'react';
import { NewsPost, PresensiRecord, ProkerItem, UserProfile } from '../../types/database';
import { 
  Code2, 
  Download, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Users, 
  X, 
  Check, 
  Search,
  Waves
} from 'lucide-react';

interface DeveloperDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  newsList: NewsPost[];
  prokerList: ProkerItem[];
  presensiList: PresensiRecord[];
  onAddNews: (news: NewsPost) => void;
  onDeleteNews: (id: string) => void;
  onUpdateProker: (updated: ProkerItem) => void;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  isOpen,
  onClose,
  newsList,
  prokerList,
  presensiList,
  onAddNews,
  onDeleteNews,
  onUpdateProker
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'proker' | 'presensi'>('news');
  
  // NEW POST FORM STATE
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Kegiatan Utama');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80');

  // PROKER EDITING STATE
  const [editingProkerId, setEditingProkerId] = useState<string | null>(null);
  const [editPercent, setEditPercent] = useState<number>(50);
  const [editStatus, setEditStatus] = useState<'Planned' | 'In Progress' | 'Completed'>('In Progress');

  // PRESENSI FILTER & EXPORT
  const [presensiSearch, setPresensiSearch] = useState('');

  if (!isOpen) return null;

  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) return;

    const slug = newsTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newPost: NewsPost = {
      id: 'n_' + Date.now(),
      title: newsTitle,
      slug: slug,
      summary: newsSummary || newsTitle,
      content: newsContent,
      category: newsCategory,
      image_url: newsImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
      author_name: 'Developer Admin',
      is_published: true,
      created_at: new Date().toISOString(),
    };

    onAddNews(newPost);
    setIsAddingNews(false);
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
  };

  const handleSaveProker = (item: ProkerItem) => {
    onUpdateProker({
      ...item,
      progress_percent: editPercent,
      status: editStatus,
    });
    setEditingProkerId(null);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Mahasiswa', 'NIM', 'Tanggal', 'Jam Check-in', 'Status', 'Uraian Logbook'];
    const rows = presensiList.map((p) => [
      p.id,
      `"${p.user_name}"`,
      `"${p.user_nim}"`,
      p.date,
      p.check_in_time,
      p.status,
      `"${p.logbook_text.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Presensi_KKN_Manggar2_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPresensi = presensiList.filter(
    (p) => p.user_name.toLowerCase().includes(presensiSearch.toLowerCase()) ||
           p.user_nim.includes(presensiSearch)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border-2 border-beach-sky shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* DASHBOARD HEADER */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-500 via-amber-400 to-beach-sand text-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-0.5 shadow-md flex items-center justify-center text-amber-600">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-slate-900">CMS Developer & Management Panel</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-900 text-[10px] font-extrabold shadow-sm">
                  REALTIME CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-800 font-bold">Kelola berita realtime, progres proker & export presensi KKN Manggar 2</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-800 hover:bg-white/50 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* TABS HEADER */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('news')}
            className={`py-3.5 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'news'
                ? 'border-amber-500 text-amber-800 bg-amber-50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> Live Report Publisher ({newsList.length})
          </button>

          <button
            onClick={() => setActiveTab('proker')}
            className={`py-3.5 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'proker'
                ? 'border-amber-500 text-amber-800 bg-amber-50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Kelola Progres Proker ({prokerList.length})
          </button>

          <button
            onClick={() => setActiveTab('presensi')}
            className={`py-3.5 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'presensi'
                ? 'border-amber-500 text-amber-800 bg-amber-50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" /> Rekap Presensi & Logbook ({presensiList.length})
          </button>
        </div>

        {/* DASHBOARD CONTENT BODY */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          
          {/* TAB 1: NEWS CMS */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-800">Daftar Live Report Berita Tayang</h3>
                <button
                  onClick={() => setIsAddingNews(!isAddingNews)}
                  className="px-4 py-2 rounded-xl bg-beach-palm hover:bg-beach-palm-dark text-white font-extrabold text-xs flex items-center gap-1.5 shadow-palm"
                >
                  {isAddingNews ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{isAddingNews ? 'Batal' : '+ Tambah Live Report Baru'}</span>
                </button>
              </div>

              {/* FORM ADD NEWS */}
              {isAddingNews && (
                <form onSubmit={handlePublishNews} className="p-5 rounded-3xl bg-[#F0F8FF] border-2 border-beach-sky space-y-4 animate-fadeIn">
                  <h4 className="font-extrabold text-beach-blue-dark text-sm">Form Live Report Berita Realtime Baru</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Judul Berita *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Peresmian Peta UMKM Manggar 2..."
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-beach-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Berita</label>
                      <select
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-beach-blue"
                      >
                        <option value="Kegiatan Utama">Kegiatan Utama</option>
                        <option value="Digitalisasi UMKM">Digitalisasi UMKM</option>
                        <option value="Teknologi">Teknologi</option>
                        <option value="Edukasi">Edukasi</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat (Summary)</label>
                    <input
                      type="text"
                      placeholder="Ringkasan 1-2 kalimat..."
                      value={newsSummary}
                      onChange={(e) => setNewsSummary(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-beach-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Sampul (Unsplash / Supabase Storage)</label>
                    <input
                      type="text"
                      value={newsImage}
                      onChange={(e) => setNewsImage(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-beach-blue"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Isi Berita Lengkap *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tuliskan berita lengkap di sini..."
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-beach-blue"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-2xl bg-beach-blue hover:bg-beach-blue-dark text-white font-extrabold text-xs shadow-beach"
                  >
                    🚀 Publish Live Report (Sync Realtime Ke Landing Page)
                  </button>
                </form>
              )}

              {/* LIST OF NEWS POSTS */}
              <div className="space-y-3">
                {newsList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 hover:border-beach-sky transition-all"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-300"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="beach-pill-sand text-[10px] py-0.5 px-2">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-sm truncate mt-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 truncate font-medium">{item.summary}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteNews(item.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-200 transition-all shrink-0"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: PROKER MANAGER */}
          {activeTab === 'proker' && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-800 mb-2">Update Progres & Status Program Kerja</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prokerList.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="beach-pill-blue text-xs py-0.5 px-2.5">
                        {item.category}
                      </span>
                      <span className="font-extrabold font-mono text-beach-blue-dark text-sm">{item.progress_percent}%</span>
                    </div>

                    <h4 className="font-extrabold text-slate-800 text-base">{item.title}</h4>
                    <p className="text-xs text-slate-600 font-medium">{item.description}</p>

                    {editingProkerId === item.id ? (
                      <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-400 space-y-3 shadow-sm">
                        <div>
                          <label className="block text-xs font-bold text-amber-800 mb-1">
                            Ubah Progres (%): {editPercent}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={editPercent}
                            onChange={(e) => setEditPercent(Number(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Status Proker:</label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
                          >
                            <option value="Planned">Planned (Rencana)</option>
                            <option value="In Progress">In Progress (Berjalan)</option>
                            <option value="Completed">Completed (Selesai)</option>
                          </select>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleSaveProker(item)}
                            className="flex-1 py-1.5 rounded-xl bg-beach-palm text-white font-extrabold text-xs shadow-palm"
                          >
                            Simpan Perubahan
                          </button>
                          <button
                            onClick={() => setEditingProkerId(null)}
                            className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingProkerId(item.id);
                          setEditPercent(item.progress_percent);
                          setEditStatus(item.status);
                        }}
                        className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Edit Progres & Status</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRESENSI REKAP & EXPORT */}
          {activeTab === 'presensi' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama / NIM anggota..."
                    value={presensiSearch}
                    onChange={(e) => setPresensiSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleExportCSV}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-beach-palm hover:bg-beach-palm-dark text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-palm"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Rekap Ke CSV / Excel</span>
                </button>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                      <th className="p-3.5">Nama Anggota</th>
                      <th className="p-3.5">NIM</th>
                      <th className="p-3.5">Tanggal</th>
                      <th className="p-3.5">Jam Check-In</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Logbook Uraian Kegiatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPresensi.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-extrabold text-slate-800">{rec.user_name}</td>
                        <td className="p-3.5 text-slate-500 font-mono font-bold">{rec.user_nim}</td>
                        <td className="p-3.5 text-slate-700 font-semibold">{rec.date}</td>
                        <td className="p-3.5 text-beach-blue-dark font-mono font-bold">{rec.check_in_time}</td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                            rec.status === 'Hadir' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 max-w-xs truncate font-medium">{rec.logbook_text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
