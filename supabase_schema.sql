-- SQL Schema for Supabase - KKN RT 35 Kelurahan Manggar 2 Project
-- Project URL: https://pwtmouagvqhafqewtkin.supabase.co
-- Execute this entire script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('developer', 'mahasiswa')),
  prodi TEXT NOT NULL,
  nim TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NEWS TABLE (Live Report Berita Realtime)
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

-- 3. PRESENSI & LOGBOOK TABLE
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

-- 4. PROKER TABLE (Program Kerja Progress)
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
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proker ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR PUBLIC ANONYMOUS ACCESS (READ ONLY FOR LANDING PAGE)
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public read published news" ON public.news FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read proker" ON public.proker FOR SELECT USING (true);
CREATE POLICY "Allow public read presensi" ON public.presensi FOR SELECT USING (true);

-- POLICIES FOR FULL INSERT/UPDATE FOR DEMO & AUTHENTICATED USERS
CREATE POLICY "Allow all write users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all write news" ON public.news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all write proker" ON public.proker FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all write presensi" ON public.presensi FOR ALL USING (true) WITH CHECK (true);

-- INITIAL SEED DATA FOR THE 8 TEAM MEMBERS (ONLY GUSTI IHSANUDDIN IS DEVELOPER!)
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
