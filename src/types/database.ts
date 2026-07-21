export type UserRole = 'developer' | 'mahasiswa' | 'public';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  prodi: string;
  nim?: string;
  avatar_url?: string;
  phone?: string;
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
}
