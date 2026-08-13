import { 
  RTDemographics, 
  RTSettings, 
  RTAnnouncement, 
  RTPengurus, 
  TeamMember, 
  ProkerItem,
  NavigationItem,
  RTFacility
} from '../types/database';

// INITIAL DEMOGRAPHICS DATA (RT 35 KELURAHAN MANGGAR 2 BALIKPAPAN TIMUR) - SET TO ZERO (REAL DATA ONLY)
export const INITIAL_DEMOGRAPHICS: RTDemographics = {
  total_kk: 0,
  total_warga: 0,
  total_pria: 0,
  total_wanita: 0,
  total_balita: 0,
  total_lansia: 0,
  total_usia_produktif: 0,
  total_umkm: 0,
  income_under_2m: 0,
  income_2m_to_5m: 0,
  income_5m_to_10m: 0,
  income_above_10m: 0,
  
  // 11. Tingkat Pendidikan
  edu_sd: 0,
  edu_smp: 0,
  edu_sma: 0,
  edu_pt: 0,
  edu_tidak_sekolah: 0,

  // 12. Profesi
  prof_pns: 0,
  prof_swasta: 0,
  prof_wiraswasta: 0,
  prof_nelayan: 0,
  prof_lainnya: 0,

  // 13. Data Warga Baru Bulanan
  warga_baru_jan: 0,
  warga_baru_feb: 0,
  warga_baru_mar: 0,
  warga_baru_apr: 0,
  warga_baru_mei: 0,
  warga_baru_jun: 0,
  warga_baru_jul: 0,
  warga_baru_agu: 0,
  warga_baru_sep: 0,
  warga_baru_okt: 0,
  warga_baru_nov: 0,
  warga_baru_des: 0,

  updated_at: new Date().toISOString()
};

// INITIAL SETTINGS - SET TO EMPTY (REAL DATA ONLY)
export const INITIAL_SETTINGS: RTSettings = {
  portal_name: 'Portal Resmi RT 35 Manggar',
  portal_description: '',
  address: '',
  address_detail: '',
  service_hours: '',
  phone_secretary: '',
  emergency_title: '',
  emergency_description: '',
  maps_coordinate: '',
  syarat_surat: '',
  kontak_darurat: '',
  
  // Profil RT
  vision: '',
  mission: '',
  history: '',
  boundary_north: '',
  boundary_south: '',
  boundary_east: '',
  boundary_west: '',

  updated_at: new Date().toISOString()
};

export const INITIAL_FACILITIES: RTFacility[] = [];

// INITIAL ANNOUNCEMENTS (PENGUMUMAN RT 35) - SET TO EMPTY (REAL DATA ONLY)
export const INITIAL_ANNOUNCEMENTS: RTAnnouncement[] = [];

// INITIAL PENGURUS RT 35 - SET TO EMPTY (REAL DATA ONLY)
export const INITIAL_PENGURUS: RTPengurus[] = [];

// INITIAL KKN TEAM MEMBERS - SET TO EMPTY (REAL DATA ONLY)
export const INITIAL_KKN_TEAM: TeamMember[] = [
  { id: 'kkn-1', name: 'Dessy Adelia', nim: '2311001', prodi: 'S1 Sistem Informasi', role_kkn: 'Ketua RT 35', avatar_url: '/kkn_member_1.png' },
  { id: 'kkn-2', name: 'Mas Gusti Mas Gusti', nim: '2311002', prodi: 'S1 Informatika', role_kkn: 'Preman', avatar_url: '/kkn_member_2.png' },
  { id: 'kkn-3', name: 'hh', nim: '2311003', prodi: 'S1 Sistem Informasi', role_kkn: 'HGG', avatar_url: '/kkn_member_3.png' },
  { id: 'kkn-4', name: 'Dimarco', nim: '2311004', prodi: 'S1 Informatika', role_kkn: 'Media Komunikasi', avatar_url: '/kkn_member_4.png' },
  { id: 'kkn-5', name: 'Anggota KKN 5', nim: '2311005', prodi: 'S1 Sistem Informasi', role_kkn: 'Hubungan Masyarakat', avatar_url: '/kkn_member_5.png' },
  { id: 'kkn-6', name: 'Anggota KKN 6', nim: '2311006', prodi: 'S1 Informatika', role_kkn: 'Sekretaris KKN', avatar_url: '/kkn_member_6.png' },
  { id: 'kkn-7', name: 'Anggota KKN 7', nim: '2311007', prodi: 'S1 Sistem Informasi', role_kkn: 'Bendahara KKN', avatar_url: '/kkn_member_7.png' },
  { id: 'kkn-8', name: 'Anggota KKN 8', nim: '2311008', prodi: 'S1 Informatika', role_kkn: 'Dokumentasi', avatar_url: '/kkn_member_8.png' }
];

// INITIAL KKN PROKER (PROGRAM KERJA PENGABDIAN RT 35) - 5 PROGRAM UTAMA
export const INITIAL_PROKER: ProkerItem[] = [
  {
    id: 'proker-1',
    title: 'Digitalisasi Pelayanan Administrasi & Sistem Informasi RT 35',
    description: 'Pengembangan portal resmi web RT 35 Manggar untuk mempermudah warga dalam mengakses informasi pelayanan, pengajuan data, dan transparansi lingkungan.',
    category: 'Digitalisasi & TI',
    target_date: '15 Agustus 2026',
    progress_percent: 100,
    status: 'Completed',
    pic_name: 'Mas Gusti (Informatika)',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proker-2',
    title: 'Pemetaan Pendataan Demografi & Kesejahteraan Warga',
    description: 'Survei dan pengolahan data statistik kependudukan RT 35 mencakup tingkat pendidikan, pekerjaan, serta pendapatan keluarga secara akurat.',
    category: 'Pendataan & Sosial',
    target_date: '20 Agustus 2026',
    progress_percent: 85,
    status: 'In Progress',
    pic_name: 'Dessy Adelia (Sistem Informasi)',
    image_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proker-3',
    title: 'Edukasi Manajemen Pembukuan & Akuntansi UMKM Warga',
    description: 'Pelatihan pencatatan keuangan digital dan strategi pengembangan usaha bagi pelaku UMKM di lingkungan RT 35 Manggar Balikpapan.',
    category: 'Ekonomi & UMKM',
    target_date: '25 Agustus 2026',
    progress_percent: 60,
    status: 'In Progress',
    pic_name: 'Dimarco (Informatika)',
    image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proker-4',
    title: 'Pengembangan Papan Pengumuman Digital & Kanal Aspirasi Warga',
    description: 'Integrasi sistem pengumuman kegiatan lingkungan RT dan formulir pelaporan tamu 24 jam berbasis online.',
    category: 'Layanan Publik',
    target_date: '28 Agustus 2026',
    progress_percent: 90,
    status: 'In Progress',
    pic_name: 'Tim KKN Kelompok 7',
    image_url: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proker-5',
    title: 'Dokumentasi & Publikasi Pengabdian Masyarakat KKN',
    description: 'Penyusunan laporan kegiatan, video dokumenter pengabdian, serta publikasi berita resmi pengabdian mahasiswa di Balikpapan Timur.',
    category: 'Publikasi & Humas',
    target_date: '30 Agustus 2026',
    progress_percent: 40,
    status: 'In Progress',
    pic_name: 'Divisi Publikasi KKN',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  }
];

// INITIAL NAVBAR & CUSTOM PAGES MENU - CLEAN STRUCT (NO MOCK DATA)
export const INITIAL_NAV_ITEMS: NavigationItem[] = [
  { id: 'nav-1', label: 'Beranda', type: 'anchor', target_id: 'beranda', order_index: 1, is_visible: true },
  { 
    id: 'nav-2', 
    label: 'Kegiatan Warga', 
    type: 'custom_page', 
    target_id: 'kegiatan-warga', 
    order_index: 2, 
    is_visible: true,
    custom_content: JSON.stringify({
      banner_url: "",
      subtitle: "",
      body: "",
      grid_items: []
    })
  },
  { id: 'nav-3', label: 'Berita', type: 'anchor', target_id: 'berita', order_index: 3, is_visible: true }
];
