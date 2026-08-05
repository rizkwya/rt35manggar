export type UserRole = 'sekretaris_rt' | 'mahasiswa' | 'developer' | 'public';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  prodi?: string;
  nim?: string;
  avatar_url?: string;
  phone?: string;
}

export interface RTDemographics {
  id?: string;
  total_kk: number;
  total_warga: number;
  total_pria: number;
  total_wanita: number;
  total_balita: number;
  total_lansia: number;
  total_usia_produktif: number;
  total_umkm: number;
  income_under_2m: number;   // < Rp 2 Juta
  income_2m_to_5m: number;   // Rp 2 - 5 Juta
  income_5m_to_10m: number;  // Rp 5 - 10 Juta
  income_above_10m: number;  // > Rp 10 Juta
  
  // 11. Tingkat Pendidikan
  edu_sd: number;
  edu_smp: number;
  edu_sma: number;
  edu_pt: number;
  edu_tidak_sekolah: number;

  // 12. Profesi atau Mata Pencaharian
  prof_pns: number;
  prof_swasta: number;
  prof_wiraswasta: number;
  prof_nelayan: number;
  prof_lainnya: number;

  // 13. Data Warga Baru Bulanan
  warga_baru_jan: number;
  warga_baru_feb: number;
  warga_baru_mar: number;
  warga_baru_apr: number;
  warga_baru_mei: number;
  warga_baru_jun: number;
  warga_baru_jul: number;
  warga_baru_agu: number;
  warga_baru_sep: number;
  warga_baru_okt: number;
  warga_baru_nov: number;
  warga_baru_des: number;

  updated_at?: string;
}

export interface RTAnnouncement {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  author: string;
  is_urgent?: boolean;
  image_url?: string;
  created_at?: string;
}

export interface RTPengurus {
  id: string;
  jabatan: string;
  nama: string;
  phone: string;
  foto_url?: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  image_url: string;
  author_name: string;
  is_published: boolean;
  views_count?: number;
  created_at: string;
}

export interface PresensiRecord {
  id: string;
  user_id: string;
  user_name: string;
  user_nim: string;
  date: string;
  check_in_time: string;
  check_out_time?: string;
  status: 'Hadir' | 'Izin' | 'Sakit';
  logbook_text: string;
  photo_url?: string;
  created_at: string;
}

export interface ProkerItem {
  id: string;
  title: string;
  description: string;
  category: string;
  target_date: string;
  progress_percent: number;
  status: 'Planned' | 'In Progress' | 'Completed';
  pic_name: string;
}

export interface TeamMember {
  id: string;
  name: string;
  nim: string;
  prodi: string;
  role_kkn: string;
  avatar_url: string;
  is_developer?: boolean;
  email?: string;
}

export interface RTSettings {
  id?: string;
  portal_name: string;
  portal_description: string;
  address: string;
  address_detail: string;
  service_hours: string;
  phone_secretary: string;
  emergency_title: string;
  emergency_description: string;
  maps_coordinate: string;
  syarat_surat: string;
  kontak_darurat: string;
  
  // Profil RT
  vision?: string;
  mission?: string;
  history?: string;
  boundary_north?: string;
  boundary_south?: string;
  boundary_east?: string;
  boundary_west?: string;

  kk_list?: KKRecord[];

  updated_at?: string;
}

export interface KKMember {
  id: string;
  name: string;
  nik: string;
  gender: 'Laki-laki' | 'Perempuan';
  birthDate: string; // YYYY-MM-DD
  education: 'SD' | 'SMP' | 'SMA' | 'Sarjana/Diploma' | 'Tidak Sekolah';
  job: 'PNS' | 'Swasta' | 'Wiraswasta' | 'Nelayan' | 'Lainnya';
}

export interface KKRecord {
  id: string;
  no_kk: string;
  kepala_keluarga: string;
  income: 'under_2m' | '2m_5m' | '5m_10m' | 'above_10m';
  members: KKMember[];
}

export interface RTFacility {
  id?: string;
  name: string;
  description: string;
  location?: string;
  image_url?: string;
  latitude_longitude?: string;
  created_at?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  type: 'anchor' | 'custom_page';
  target_id: string;
  order_index: number;
  is_visible: boolean;
  custom_content?: string;
}



