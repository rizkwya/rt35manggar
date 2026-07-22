import { createClient } from '@supabase/supabase-js';
import { NewsPost, PresensiRecord, ProkerItem, TeamMember, UserProfile } from '../types/database';

// ENVIRONMENT VARIABLES FROM .env FILE
export const SUPABASE_URL = 
  (import.meta as any).env?.VITE_SUPABASE_URL || 'https://pwtmouagvqhafqewtkin.supabase.co';

export const SUPABASE_ANON_KEY = 
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_SSBgwLT0rUpEm8n0qDYaFw_Qp1vIm7G';

// Initialize Production Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// OFFICIAL TEAM MEMBERS SEED DATA (GUSTI IHSANUDDIN 2311050 IS SOLE DEVELOPER)
export const OFFICIAL_TEAM: TeamMember[] = [
  {
    id: 't1',
    name: 'LAKSAMANA ANDHIKA',
    nim: '2313008',
    prodi: 'SISTEM INFORMASI (S1)',
    role_kkn: 'Ketua Kelompok',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    is_developer: false
  },
  {
    id: 't2',
    name: 'ANNISA DEWI PUTRI INDRA',
    nim: '2321061',
    prodi: 'AKUNTANSI (S1)',
    role_kkn: 'Sekretaris & Bendahara',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    is_developer: false
  },
  {
    id: 't3',
    name: 'CHINTA SYAFIRNA RAMADHANI BUDI',
    nim: '2322089',
    prodi: 'MANAJEMEN (S1)',
    role_kkn: 'Humas & Media',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    is_developer: false
  },
  {
    id: 't4',
    name: 'EVA PUTRI NUR OKTAVIA',
    nim: '2322015',
    prodi: 'MANAJEMEN (S1)',
    role_kkn: 'Divisi Logistik & Acara',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    is_developer: false
  },
  {
    id: 't5',
    name: 'GUSTI IHSANUDDIN',
    nim: '2311050',
    prodi: 'INFORMATIKA (S1)',
    role_kkn: 'Lead Developer & Web Master',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    is_developer: true // SOLE DEVELOPER
  },
  {
    id: 't6',
    name: 'INDAH PUSPITA LOKA',
    nim: '2333018',
    prodi: 'FARMASI (S1)',
    role_kkn: 'Divisi Kesehatan Warga',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    is_developer: false
  },
  {
    id: 't7',
    name: 'MUHAMMAD AZIZ RAMADHANI',
    nim: '2322173',
    prodi: 'MANAJEMEN (S1)',
    role_kkn: 'Divisi Pemberdayaan UMKM',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    is_developer: false
  },
  {
    id: 't8',
    name: 'QOLBY ZAKIN SEPHIANA',
    nim: '2311090',
    prodi: 'INFORMATIKA (S1)',
    role_kkn: 'Co-Developer & IT Support',
    avatar_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
    is_developer: false
  }
];

export const INITIAL_NEWS: NewsPost[] = [
  {
    id: 'n1',
    title: 'Pembukaan Resmi KKN RT 35 Kelurahan Manggar 2',
    slug: 'pembukaan-resmi-kkn-rt35-manggar-2',
    summary: 'Penyambutan hangat tim KKN oleh Ketua RT 35 beserta tokoh masyarakat Kelurahan Manggar 2.',
    content: 'Kelurahan Manggar 2 khususnya lingkungan RT 35 secara resmi menyambut kedatangan 8 mahasiswa KKN lintas prodi (Informatika, Sistem Informasi, Manajemen, Akuntansi, Farmasi). Acara ini dipimpin oleh Ketua RT 35 beserta jajaran tokoh masyarakat. Program difokuskan pada digitalisasi UMKM lokal, sistem informasi presensi, dan edukasi kesehatan warga.',
    category: 'Kegiatan Utama',
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
    author_name: 'Gusti Ihsanuddin (Lead Developer)',
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'n2',
    title: 'Survei Lapangan & Pemetaan UMKM Pesisir RT 35',
    slug: 'survei-lapangan-umkm-rt35',
    summary: 'Pendataan usaha olahan laut, kuliner & kerajinan lokal warga RT 35 Manggar 2.',
    content: 'Tim KKN melakukan pemetaan potensi ekonomi lokal di sekitar wilayah RT 35 Manggar 2 Balikpapan Timur. Data yang diperoleh akan dimasukkan ke dalam Web Peta Digital UMKM untuk memperluas jangkauan pasar pelaku usaha lokal RT 35.',
    category: 'Digitalisasi UMKM',
    image_url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1000&q=80',
    author_name: 'Muhammad Aziz & Tim',
    is_published: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'n3',
    title: 'Peluncuran Portal Web & System Presensi Digital RT 35',
    slug: 'peluncuran-portal-web-rt35',
    summary: 'Implementasi platform digital KKN RT 35 dengan arsitektur React, Tailwind & Supabase.',
    content: 'Sebagai bentuk kontribusi mahasiswa prodi Informatika & Sistem Informasi, dibangun portal resmi KKN RT 35 Kelurahan Manggar 2 terintegrasi sistem presensi dan logbook harian anggota.',
    category: 'Teknologi',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    author_name: 'Gusti Ihsanuddin (Developer)',
    is_published: true,
    created_at: new Date().toISOString(),
  }
];

export const INITIAL_PROKER: ProkerItem[] = [
  {
    id: 'p1',
    title: 'Website Portal & Presensi Digital KKN RT 35',
    description: 'Pengembangan portal resmi KKN RT 35 Manggar 2 berbasis React, TailwindCSS, dan Supabase real-time.',
    category: 'Teknologi & Informasi',
    target_date: '25 Juli 2026',
    progress_percent: 95,
    status: 'In Progress',
    pic_name: 'Gusti Ihsanuddin (Developer)'
  },
  {
    id: 'p2',
    title: 'Peta Digital & Katalog UMKM Warga RT 35',
    description: 'Pembuatan direktori interaktif dan Google Maps integration untuk produk unggulan warga RT 35 Manggar 2.',
    category: 'Digitalisasi UMKM',
    target_date: '30 Juli 2026',
    progress_percent: 75,
    status: 'In Progress',
    pic_name: 'Muhammad Aziz & Annisa'
  },
  {
    id: 'p3',
    title: 'Edukasi Kesehatan & Pembagian Vitamin Warga RT 35',
    description: 'Sosialisasi pola hidup bersih sehat dan pemeriksaan kesehatan gratis bagi lansia & balita RT 35.',
    category: 'Kesehatan & Masyarakat',
    target_date: '02 Agustus 2026',
    progress_percent: 50,
    status: 'In Progress',
    pic_name: 'Indah Puspita (Farmasi)'
  },
  {
    id: 'p4',
    title: 'Pelatihan Literasi Keuangan & Akuntansi UMKM RT 35',
    description: 'Pelatihan pembukuan keuangan sederhana bagi pelaku usaha mikro warga RT 35.',
    category: 'Edukasi & Keuangan',
    target_date: '06 Agustus 2026',
    progress_percent: 30,
    status: 'Planned',
    pic_name: 'Laksamana & Chinta'
  }
];

// DYNAMIC SUPABASE REALTIME DATA SERVICES
export const SupabaseService = {
  // DYNAMIC USER AUTHENTICATION
  async authenticateUser(nim: string, pass: string): Promise<UserProfile | null> {
    const trimmedNim = nim.trim();
    const trimmedPass = pass.trim();

    try {
      // 1. Try querying live Supabase 'users' table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('nim', trimmedNim)
        .single();

      if (data && !error) {
        const role = data.role === 'developer' || data.is_developer ? 'developer' : 'mahasiswa';
        return {
          id: data.id,
          email: data.email || `${trimmedNim}@fasilkom.ac.id`,
          full_name: data.full_name || data.name,
          role: role,
          prodi: data.prodi,
          nim: data.nim,
          avatar_url: data.avatar_url,
        };
      }
    } catch (err) {
      console.warn('Supabase users query fallback to official team list:', err);
    }

    // 2. Official Team Database fallback
    const member = OFFICIAL_TEAM.find((m) => m.nim === trimmedNim);
    if (member && (trimmedPass === 'kkn35manggar2' || trimmedPass === trimmedNim)) {
      const role = member.is_developer ? 'developer' : 'mahasiswa';
      return {
        id: member.id,
        email: `${member.nim}@fasilkom.ac.id`,
        full_name: member.name,
        role: role,
        prodi: member.prodi,
        nim: member.nim,
        avatar_url: member.avatar_url,
      };
    }

    return null;
  },

  // DYNAMIC FETCH NEWS
  async fetchNews(): Promise<NewsPost[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0 && !error) {
        return data as NewsPost[];
      }
    } catch (e) {
      console.warn('Supabase news query fallback:', e);
    }
    return DataManager.getNews();
  },

  // DYNAMIC INSERT NEWS
  async addNews(newsItem: NewsPost): Promise<NewsPost[]> {
    try {
      await supabase.from('news').insert([newsItem]);
    } catch (e) {
      console.warn('Supabase news insert error:', e);
    }
    const current = DataManager.getNews();
    const updated = [newsItem, ...current];
    DataManager.saveNews(updated);
    return updated;
  },

  // DYNAMIC DELETE NEWS
  async deleteNews(id: string): Promise<NewsPost[]> {
    try {
      await supabase.from('news').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase news delete error:', e);
    }
    const current = DataManager.getNews();
    const updated = current.filter((n) => n.id !== id);
    DataManager.saveNews(updated);
    return updated;
  },

  // DYNAMIC FETCH PROKER
  async fetchProker(): Promise<ProkerItem[]> {
    try {
      const { data, error } = await supabase.from('proker').select('*');
      if (data && data.length > 0 && !error) {
        return data as ProkerItem[];
      }
    } catch (e) {
      console.warn('Supabase proker query fallback:', e);
    }
    return DataManager.getProker();
  },

  // DYNAMIC UPDATE PROKER
  async updateProker(item: ProkerItem): Promise<ProkerItem[]> {
    try {
      await supabase.from('proker').upsert([item]);
    } catch (e) {
      console.warn('Supabase proker update error:', e);
    }
    const current = DataManager.getProker();
    const updated = current.map((p) => (p.id === item.id ? item : p));
    DataManager.saveProker(updated);
    return updated;
  },

  // DYNAMIC FETCH PRESENSI
  async fetchPresensi(): Promise<PresensiRecord[]> {
    try {
      const { data, error } = await supabase
        .from('presensi')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0 && !error) {
        return data as PresensiRecord[];
      }
    } catch (e) {
      console.warn('Supabase presensi query fallback:', e);
    }
    return DataManager.getPresensi();
  },

  // DYNAMIC INSERT PRESENSI
  async addPresensi(record: PresensiRecord): Promise<PresensiRecord[]> {
    try {
      await supabase.from('presensi').insert([record]);
    } catch (e) {
      console.warn('Supabase presensi insert error:', e);
    }
    const current = DataManager.getPresensi();
    const updated = [record, ...current];
    DataManager.savePresensi(updated);
    return updated;
  }
};

// LOCAL STORAGE PERSISTENCE MANAGER
export const DataManager = {
  getNews: (): NewsPost[] => {
    try {
      const stored = localStorage.getItem('kkn_news');
      return stored ? JSON.parse(stored) : INITIAL_NEWS;
    } catch (e) {
      return INITIAL_NEWS;
    }
  },

  saveNews: (news: NewsPost[]) => {
    localStorage.setItem('kkn_news', JSON.stringify(news));
  },

  getProker: (): ProkerItem[] => {
    try {
      const stored = localStorage.getItem('kkn_proker');
      return stored ? JSON.parse(stored) : INITIAL_PROKER;
    } catch (e) {
      return INITIAL_PROKER;
    }
  },

  saveProker: (proker: ProkerItem[]) => {
    localStorage.setItem('kkn_proker', JSON.stringify(proker));
  },

  getPresensi: (): PresensiRecord[] => {
    try {
      const stored = localStorage.getItem('kkn_presensi');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  savePresensi: (records: PresensiRecord[]) => {
    localStorage.setItem('kkn_presensi', JSON.stringify(records));
  }
};
