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
export const INITIAL_KKN_TEAM: TeamMember[] = [];

// INITIAL KKN PROKER (PROGRAM KERJA PENGABDIAN RT 35) - SET TO EMPTY (REAL DATA ONLY)
export const INITIAL_PROKER: ProkerItem[] = [];

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
