-- SQL Schema for Supabase - KKN RT 35 Kelurahan Manggar 2 Project
-- Project URL: https://atmqjbhrillqeehblizb.supabase.co
-- Execute this entire script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('developer', 'mahasiswa', 'sekretaris_rt')),
  prodi TEXT NOT NULL,
  nim TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RT DEMOGRAPHICS TABLE (Statistik Agregat Warga RT 35)
CREATE TABLE IF NOT EXISTS public.rt_demographics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_kk INT NOT NULL DEFAULT 85,
  total_warga INT NOT NULL DEFAULT 340,
  total_pria INT NOT NULL DEFAULT 175,
  total_wanita INT NOT NULL DEFAULT 165,
  total_balita INT NOT NULL DEFAULT 32,
  total_lansia INT NOT NULL DEFAULT 45,
  total_usia_produktif INT NOT NULL DEFAULT 263,
  total_umkm INT NOT NULL DEFAULT 18,
  income_under_2m INT NOT NULL DEFAULT 20,   -- < Rp 2 Juta
  income_2m_to_5m INT NOT NULL DEFAULT 45,   -- Rp 2 - 5 Juta
  income_5m_to_10m INT NOT NULL DEFAULT 15,  -- Rp 5 - 10 Juta
  income_above_10m INT NOT NULL DEFAULT 5,   -- > Rp 10 Juta
  
  -- 11. Tingkat Pendidikan
  edu_sd INT NOT NULL DEFAULT 35,
  edu_smp INT NOT NULL DEFAULT 45,
  edu_sma INT NOT NULL DEFAULT 110,
  edu_pt INT NOT NULL DEFAULT 50,
  edu_tidak_sekolah INT NOT NULL DEFAULT 100,

  -- 12. Profesi atau Mata Pencaharian
  prof_pns INT NOT NULL DEFAULT 15,
  prof_swasta INT NOT NULL DEFAULT 85,
  prof_wiraswasta INT NOT NULL DEFAULT 42,
  prof_nelayan INT NOT NULL DEFAULT 28,
  prof_lainnya INT NOT NULL DEFAULT 170,

  -- 13. Data Warga Baru Bulanan (Tren Statistik)
  warga_baru_jan INT NOT NULL DEFAULT 4,
  warga_baru_feb INT NOT NULL DEFAULT 2,
  warga_baru_mar INT NOT NULL DEFAULT 5,
  warga_baru_apr INT NOT NULL DEFAULT 3,
  warga_baru_mei INT NOT NULL DEFAULT 6,
  warga_baru_jun INT NOT NULL DEFAULT 8,
  warga_baru_jul INT NOT NULL DEFAULT 4,
  warga_baru_agu INT NOT NULL DEFAULT 7,
  warga_baru_sep INT NOT NULL DEFAULT 3,
  warga_baru_okt INT NOT NULL DEFAULT 5,
  warga_baru_nov INT NOT NULL DEFAULT 6,
  warga_baru_des INT NOT NULL DEFAULT 2,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ALTER STATEMENTS FOR EXISTING DATABASES (Run these if the table already exists):
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS edu_sd INT NOT NULL DEFAULT 35;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS edu_smp INT NOT NULL DEFAULT 45;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS edu_sma INT NOT NULL DEFAULT 110;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS edu_pt INT NOT NULL DEFAULT 50;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS edu_tidak_sekolah INT NOT NULL DEFAULT 100;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS prof_pns INT NOT NULL DEFAULT 15;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS prof_swasta INT NOT NULL DEFAULT 85;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS prof_wiraswasta INT NOT NULL DEFAULT 42;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS prof_nelayan INT NOT NULL DEFAULT 28;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS prof_lainnya INT NOT NULL DEFAULT 170;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_jan INT NOT NULL DEFAULT 4;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_feb INT NOT NULL DEFAULT 2;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_mar INT NOT NULL DEFAULT 5;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_apr INT NOT NULL DEFAULT 3;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_mei INT NOT NULL DEFAULT 6;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_jun INT NOT NULL DEFAULT 8;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_jul INT NOT NULL DEFAULT 4;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_agu INT NOT NULL DEFAULT 7;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_sep INT NOT NULL DEFAULT 3;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_okt INT NOT NULL DEFAULT 5;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_nov INT NOT NULL DEFAULT 6;
-- ALTER TABLE public.rt_demographics ADD COLUMN IF NOT EXISTS warga_baru_des INT NOT NULL DEFAULT 2;

-- 3. RT ANNOUNCEMENTS TABLE (Pengumuman Resmi RT 35)
CREATE TABLE IF NOT EXISTS public.rt_announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  author TEXT DEFAULT 'Sekretaris RT 35',
  is_urgent BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RT PENGURUS TABLE (Organogram & Layanan)
CREATE TABLE IF NOT EXISTS public.rt_pengurus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jabatan TEXT NOT NULL,
  nama TEXT NOT NULL,
  phone TEXT NOT NULL,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NEWS TABLE (Berita & Artikel RT 35 / KKN)
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Kegiatan Utama',
  image_url TEXT,
  author_name TEXT DEFAULT 'Tim KKN RT 35',
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT TRUE,
  views_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRESENSI & LOGBOOK TABLE (Mahasiswa KKN)
CREATE TABLE IF NOT EXISTS public.presensi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_nim TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in_time TEXT NOT NULL,
  check_out_time TEXT,
  status TEXT NOT NULL CHECK (status IN ('Hadir', 'Izin', 'Sakit')),
  logbook_text TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROKER TABLE (Program Kerja Progress KKN)
CREATE TABLE IF NOT EXISTS public.proker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'Teknologi & Informasi',
  target_date TEXT,
  progress_percent INT DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  status TEXT DEFAULT 'In Progress' CHECK (status IN ('Planned', 'In Progress', 'Completed')),
  pic_name TEXT DEFAULT 'Tim KKN RT 35',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rt_pengurus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proker ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR PUBLIC READ ACCESS
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read demographics" ON public.rt_demographics FOR SELECT USING (true);
CREATE POLICY "Allow public read announcements" ON public.rt_announcements FOR SELECT USING (true);
CREATE POLICY "Allow public read pengurus" ON public.rt_pengurus FOR SELECT USING (true);
CREATE POLICY "Allow public read published news" ON public.news FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read proker" ON public.proker FOR SELECT USING (true);
CREATE POLICY "Allow public read presensi" ON public.presensi FOR SELECT USING (true);

-- POLICIES FOR FULL WRITE ACCESS
CREATE POLICY "Allow all write users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all write demographics" ON public.rt_demographics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all write announcements" ON public.rt_announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all write pengurus" ON public.rt_pengurus FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all write news" ON public.news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all write proker" ON public.proker FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all write presensi" ON public.presensi FOR ALL USING (true) WITH CHECK (true);

-- INITIAL SEED DATA FOR DEMOGRAPHICS
INSERT INTO public.rt_demographics (
  total_kk, total_warga, total_pria, total_wanita, total_balita, total_lansia, total_usia_produktif, total_umkm,
  income_under_2m, income_2m_to_5m, income_5m_to_10m, income_above_10m
) VALUES (
  85, 340, 175, 165, 32, 45, 263, 18,
  20, 45, 15, 5
);

-- INITIAL SEED DATA FOR PENGURUS RT 35
INSERT INTO public.rt_pengurus (jabatan, nama, phone, foto_url) VALUES
('Ketua RT 35', 'Bapak H. Ahmad Sujono', '081234567890', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'),
('Sekretaris RT 35', 'Ibu Nurhayati, S.Pd', '081298765432', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'),
('Bendahara RT 35', 'Bapak Bambang Irawan', '081377889900', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80'),
('Ketua Posyandu RT 35', 'Ibu Siti Aminah', '081544332211', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80');

-- INITIAL SEED DATA FOR ANNOUNCEMENTS
INSERT INTO public.rt_announcements (title, category, content, date, author, is_urgent) VALUES
('Kerja Bakti Masal Pembersihan Saluran Air RT 35', 'Kerja Bakti', 'Dihimbau seluruh warga RT 35 untuk berkumpul di Balai RT pada hari Minggu jam 07.00 WITA dengan membawa alat kerja bakti.', CURRENT_DATE, 'Sekretaris RT 35', true),
('Jadwal Posyandu Balita & Lansia Bulan Ini', 'Posyandu', 'Kegiatan posyandu rutin akan dilaksanakan di rumah Ibu RT 35 pada hari Rabu pekan depan jam 08.30 WITA.', CURRENT_DATE - INTERVAL '2 days', 'Ketua Posyandu RT 35', false),
('Pengumpulan Data Ulang Kartu Keluarga (KK)', 'Pengumuman RT', 'Mohon kepala keluarga RT 35 menyerahkan fotokopi KK terbaru ke Sekretaris RT untuk pemutakhiran data portal web RT 35.', CURRENT_DATE - INTERVAL '4 days', 'Sekretaris RT 35', false);

-- INITIAL SEED DATA FOR KKN TEAM MEMBERS (GUSTI IHSANUDDIN IS DEVELOPER)
INSERT INTO public.users (full_name, email, role, prodi, nim, phone, avatar_url) VALUES
('GUSTI IHSANUDDIN', '2311050@fasilkom.ac.id', 'developer', 'INFORMATIKA (S1)', '2311050', '085821550980', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'),
('LAKSAMANA ANDHIKA', '2313008@fasilkom.ac.id', 'mahasiswa', 'SISTEM INFORMASI (S1)', '2313008', '085796156789', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
('ANNISA DEWI PUTRI INDRA', '2321061@fasilkom.ac.id', 'mahasiswa', 'AKUNTANSI (S1)', '2321061', '081325631937', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'),
('CHINTA SYAFIRNA RAMADHANI BUDI', '2322089@fasilkom.ac.id', 'mahasiswa', 'MANAJEMEN (S1)', '2322089', '081254710280', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'),
('EVA PUTRI NUR OKTAVIA', '2322015@fasilkom.ac.id', 'mahasiswa', 'MANAJEMEN (S1)', '2322015', '085654287971', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'),
('INDAH PUSPITA LOKA', '2333018@fasilkom.ac.id', 'mahasiswa', 'FARMASI (S1)', '2333018', '085753642200', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
('MUHAMMAD AZIZ RAMADHANI', '2322173@fasilkom.ac.id', 'mahasiswa', 'MANAJEMEN (S1)', '2322173', '081347368110', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'),
('QOLBY ZAKIN SEPHIANA', '2311090@fasilkom.ac.id', 'mahasiswa', 'INFORMATIKA (S1)', '2311090', '081345416605', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80')
ON CONFLICT (nim) DO NOTHING;

-- INITIAL SEED DATA FOR PROKER
INSERT INTO public.proker (title, description, category, target_date, progress_percent, status, pic_name) VALUES
('Website Portal & Presensi Digital KKN RT 35', 'Pengembangan portal resmi KKN RT 35 Manggar 2 berbasis React, TailwindCSS, dan Supabase real-time.', 'Teknologi & Informasi', '25 Juli 2026', 95, 'In Progress', 'Gusti Ihsanuddin (Developer)'),
('Peta Digital & Katalog UMKM Warga RT 35', 'Pembuatan direktori interaktif dan Google Maps integration untuk produk unggulan warga RT 35 Manggar 2.', 'Digitalisasi UMKM', '30 Juli 2026', 75, 'In Progress', 'Muhammad Aziz & Annisa'),
('Edukasi Kesehatan & Pembagian Vitamin Warga RT 35', 'Sosialisasi pola hidup bersih sehat dan pemeriksaan kesehatan gratis bagi lansia & balita RT 35.', 'Kesehatan & Masyarakat', '02 Agustus 2026', 50, 'In Progress', 'Indah Puspita (Farmasi)'),
('Pelatihan Literasi Keuangan & Akuntansi UMKM RT 35', 'Pelatihan pembukuan keuangan sederhana bagi pelaku usaha mikro warga RT 35.', 'Edukasi & Keuangan', '06 Agustus 2026', 30, 'Planned', 'Laksamana & Chinta');

-- INITIAL SEED DATA FOR NEWS
INSERT INTO public.news (title, slug, summary, content, category, image_url, author_name) VALUES
('Pembukaan Resmi KKN RT 35 Kelurahan Manggar 2', 'pembukaan-resmi-kkn-rt35-manggar-2', 'Penyambutan hangat tim KKN oleh Ketua RT 35 beserta tokoh masyarakat Kelurahan Manggar 2.', 'Kelurahan Manggar 2 khususnya lingkungan RT 35 secara resmi menyambut kedatangan 8 mahasiswa KKN lintas prodi (Informatika, Sistem Informasi, Manajemen, Akuntansi, Farmasi). Acara ini dipimpin oleh Ketua RT 35 beserta jajaran tokoh masyarakat. Program difokuskan pada digitalisasi UMKM lokal, sistem informasi presensi, dan edukasi kesehatan warga.', 'Kegiatan Utama', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80', 'Gusti Ihsanuddin (Lead Developer)'),
('Survei Lapangan & Pemetaan UMKM Pesisir RT 35', 'survei-lapangan-umkm-rt35', 'Pendataan usaha olahan laut, kuliner & kerajinan lokal warga RT 35 Manggar 2.', 'Tim KKN melakukan pemetaan potensi ekonomi lokal di sekitar wilayah RT 35 Manggar 2 Balikpapan Timur. Data yang diperoleh akan dimasukkan ke dalam Web Peta Digital UMKM untuk memperluas jangkauan pasar pelaku usaha lokal RT 35.', 'Digitalisasi UMKM', 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1000&q=80', 'Muhammad Aziz & Tim'),
('Peluncuran Portal Web & System Presensi Digital RT 35', 'peluncuran-portal-web-rt35', 'Implementasi platform digital KKN RT 35 dengan arsitektur React, Tailwind & Supabase.', 'Sebagai bentuk kontribusi mahasiswa prodi Informatika & Sistem Informasi, dibangun portal resmi KKN RT 35 Kelurahan Manggar 2 terintegrasi sistem presensi dan logbook harian anggota.', 'Teknologi', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80', 'Gusti Ihsanuddin (Developer)');

-- =========================================================================
-- SUPABASE AUTH SYNCHRONIZATION TRIGGER (FOR PRODUCTION SECURITY)
-- =========================================================================
-- Automatically maps users created in the Supabase Auth system to our
-- public profiles 'users' table, keeping existing profile attributes intact.

CREATE OR REPLACE FUNCTION public.handle_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  -- If user profile already exists with this email, update its UUID to match the Auth UUID
  IF EXISTS (SELECT 1 FROM public.users WHERE email = NEW.email) THEN
    UPDATE public.users
    SET id = NEW.id,
        phone = COALESCE(NEW.phone, phone)
    WHERE email = NEW.email;
  ELSE
    -- Otherwise, insert a new user profile record
    INSERT INTO public.users (id, email, full_name, role, prodi, nim, avatar_url, phone)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'User Baru RT 35'),
      COALESCE(NEW.raw_user_meta_data->>'role', 'mahasiswa'),
      COALESCE(NEW.raw_user_meta_data->>'prodi', 'Umum'),
      COALESCE(NEW.raw_user_meta_data->>'nim', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'),
      NEW.phone
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user_created();


-- 8. RT NAVIGATION ITEMS TABLE (Dynamic Menu & Custom Pages)
CREATE TABLE IF NOT EXISTS public.rt_navigation_items (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('anchor', 'custom_page')),
  target_id TEXT NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  custom_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.rt_navigation_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read navigation" ON public.rt_navigation_items FOR SELECT USING (true);
CREATE POLICY "Allow all write navigation" ON public.rt_navigation_items FOR ALL USING (true) WITH CHECK (true);

-- Initial Navigation Items Seed Data
INSERT INTO public.rt_navigation_items (id, label, type, target_id, order_index, is_visible) VALUES
('nav-1', 'Beranda', 'anchor', 'beranda', 1, true),
('nav-2', 'Statistik RT 35', 'anchor', 'statistik-warga', 2, true),
('nav-3', 'Pengumuman', 'anchor', 'pengumuman-rt', 3, true),
('nav-4', 'Pengurus RT', 'anchor', 'pengurus-rt', 4, true),
('nav-5', 'Layanan Aspirasi', 'anchor', 'kontak-layanan', 5, true),
('nav-6', 'Informasi KKN', 'anchor', 'kkn', 6, true)
ON CONFLICT (id) DO NOTHING;


-- 9. RT SETTINGS TABLE (Emergency & General Settings)
CREATE TABLE IF NOT EXISTS public.rt_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portal_name TEXT NOT NULL DEFAULT 'Portal Resmi RT 35 Manggar',
  portal_description TEXT,
  address TEXT,
  address_detail TEXT,
  service_hours TEXT,
  phone_secretary TEXT,
  emergency_title TEXT,
  emergency_description TEXT, -- JSON string containing extra parameters
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for settings
ALTER TABLE public.rt_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read settings" ON public.rt_settings FOR SELECT USING (true);
CREATE POLICY "Allow all write settings" ON public.rt_settings FOR ALL USING (true) WITH CHECK (true);

-- Seed initial data for rt_settings
INSERT INTO public.rt_settings (portal_name, portal_description, address, address_detail, service_hours, phone_secretary, emergency_title, emergency_description)
VALUES (
  'Portal Resmi RT 35 Manggar',
  'Media informasi resmi warga pesisir RT 35. Menyediakan transparansi data demografi kependudukan, pemetaan tingkat kesejahteraan warga, papan pengumuman lingkungan, serta integrasi layanan aspirasi online.',
  'Balai RT 35 Kelurahan Manggar 2, Balikpapan Timur',
  'Kawasan Pesisir RT 35, Kelurahan Manggar 2, Kecamatan Balikpapan Timur, Kota Balikpapan, Kalimantan Timur (76116).',
  'Senin - Jumat: 19.30 - 21.30 WITA (Di Balai RT)\nSabtu - Minggu: Dengan Perjanjian',
  '081298765432',
  'Siaga Darurat RT 35',
  '{"maps_coordinate":"1°14''11.4\"S 116°56''04.0\"E","syarat_surat":"Fotokopi Kartu Keluarga (KK) terbaru\nFotokopi KTP Pemohon\nMenyebutkan tujuan pembuatan surat","kontak_darurat":"Ambulans: 118\nPemadam Kebakaran: 113\nPolsek Balikpapan Timur: (0542) 770110","emergency_description":"Hubungi kontak darurat berikut jika memerlukan bantuan cepat.","vision":"Menjadi lingkungan RT 35 Kelurahan Manggar yang religius, mandiri, aman, tenteram, dan unggul dalam pelayanan digital.","mission":"1. Meningkatkan kerukunan antar tetangga dengan kerja bakti rutin.\n2. Memberikan keterbukaan administrasi digital bagi seluruh warga.\n3. Mendorong kemandirian ekonomi UMKM pesisir.\n4. Memelihara keamanan lingkungan dengan siskamling aktif.","history":"RT 35 didirikan di kawasan pesisir Kelurahan Manggar pada tahun 1998 sebagai pemekaran wilayah guna mempercepat pembangunan sosial masyarakat nelayan dan pelaku usaha mikro. Sejak pendiriannya, RT 35 telah menjadi contoh lingkungan gotong royong di Balikpapan Timur.","boundary_north":"Kelurahan Manggar Sari / RT 34","boundary_south":"Kawasan Pantai Nelayan Manggar","boundary_east":"Selat Makassar / Area Pesisir","boundary_west":"Jalan Mulawarman Raya / RT 36"}'
) ON CONFLICT DO NOTHING;


-- 10. RT FACILITIES TABLE (Fasilitas Umum RT 35)
CREATE TABLE IF NOT EXISTS public.rt_facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for facilities
ALTER TABLE public.rt_facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read facilities" ON public.rt_facilities FOR SELECT USING (true);
CREATE POLICY "Allow all write facilities" ON public.rt_facilities FOR ALL USING (true) WITH CHECK (true);

-- Seed initial data for rt_facilities
INSERT INTO public.rt_facilities (name, description, location, image_url) VALUES
('Balai Pertemuan Warga RT 35', 'Pusat musyawarah, koordinasi program kerja, dan pos pelayanan posyandu bulanan.', 'Dekat Masjid RT 35', 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80'),
('Pos Keamanan Lingkungan (Ronda)', 'Pos jaga siskamling malam untuk menjaga ketertiban dan keamanan lingkungan.', 'Pintu Masuk Utama RT 35', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'),
('Lapangan Olahraga & Bermain', 'Ruang terbuka hijau multifungsi untuk sarana olahraga anak-anak dan senam gotong royong.', 'Sektor Barat RT 35', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80');



