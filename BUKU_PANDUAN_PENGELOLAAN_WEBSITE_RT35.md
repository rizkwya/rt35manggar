# 📘 BUKU PANDUAN PENGELOLAAN SISTEM INFORMASI & PORTAL RESMI RT 35 KELURAHAN MANGGAR

**Penyusun:** Tim KKN Kelompok Manggar 2 – Universitas Mulia  
**Sasaran Pengguna:** Sekretaris RT & Jajaran Pengurus RT 35 Kelurahan Manggar  
**Versi Sistem:** 1.0 (Digital Transformation Portal)  
**Tahun Pengabdian:** 2026  

---

## 📑 DAFTAR ISI
1. [Pendahuluan & Gambaran Umum Sistem](#1-pendahuluan--gambaran-umum-sistem)
2. [Akses Masuk & Autentikasi Admin (Login)](#2-akses-masuk--autentikasi-admin-login)
3. [Panduan Modul 1: Data Kependudukan & Demografi](#3-panduan-modul-1-data-kependudukan--demografi-admindemografis)
4. [Panduan Modul 2: Publikasi Kegiatan Warga & Berita](#4-panduan-modul-2-publikasi-kegiatan-warga--berita-adminkegiatan-warga--adminberita)
5. [Panduan Modul 3: Papan Pengumuman Warga](#5-panduan-modul-3-papan-pengumuman-warga-adminpengumuman)
6. [Panduan Modul 4: Pengelolaan Fasilitas RT](#6-panduan-modul-4-pengelolaan-fasilitas-rt-adminfasilitas)
7. [Panduan Modul 5: Kotak Aspirasi & Layanan Surat Warga](#7-panduan-modul-5-kotak-aspirasi--layanan-surat-warga-adminaspirasi)
8. [Panduan Modul 6: Pengaturan Kontak & Layanan RT](#8-panduan-modul-6-pengaturan-kontak--layanan-rt-adminsettings)
9. [Tips Operasional, Keamanan & Pemeliharaan](#9-tips-operasional-keamanan--pemeliharaan)
10. [Kontak Dukungan Pengembang](#10-kontak-dukungan-pengembang)

---

## 1. PENDAHULUAN & GAMBARAN UMUM SISTEM
Website Portal Resmi RT 35 Kelurahan Manggar dirancang sebagai platform pelayanan publik digital terpadu untuk:
* **Transparansi Data:** Menampilkan statistik kependudukan yang selalu terbarui secara otomatis.
* **Arsip Digital:** Mengabadikan seluruh kegiatan sosial, kerja bakti, dan agenda kemasyarakatan RT 35.
* **Pelayanan Warga 24 Jam:** Mempermudah warga dalam mengajukan aspirasi, melihat syarat surat pengantar, dan mengetahui kontak darurat lingkungan secara online.

---

## 2. AKSES MASUK & AUTENTIKASI ADMIN (LOGIN)

### A. Cara Masuk ke Panel Administrator
1. Buka aplikasi peramban (Google Chrome, Safari, Microsoft Edge) pada laptop atau ponsel pintar Anda.
2. Buka alamat login: **`https://rt35manggar.vercel.app/login`** (atau klik menu **Login Pengurus** di bagian bawah halaman web).
3. Masukkan kredensial resmi:
   * **Username / Email:** `sekretaris.rt35@gmail.com`
   * **Password:** *(Gunakan kata sandi resmi yang telah diserahterimakan)*
4. Klik tombol **"Masuk ke Dashboard"**.
5. Sistem akan membuka ruang kerja **Dashboard Sekretaris RT 35**.

> ⚠️ **Catatan Keamanan:** Selalu klik tombol **Keluar / Logout** di pojok kanan atas setelah selesai mengelola data, terutama jika menggunakan komputer atau perangkat bersama.

---

## 3. PANDUAN MODUL 1: DATA KEPENDUDUKAN & DEMOGRAFI (`/admin/demografis`)

Modul ini adalah pusat data kependudukan warga RT 35 yang otomatis terhubung dengan grafik di beranda publik.

### A. Menambahkan Kartu Keluarga (KK) Baru
1. Buka menu **Data Demografi & Kependudukan**.
2. Klik tombol hijau **"+ Tambah Kartu Keluarga"**.
3. Isi data utama kepala keluarga:
   * **Nomor KK:** (16 digit angka sesuai berkas fisik).
   * **Nama Kepala Keluarga:** (Nama lengkap).
   * **Alamat Rumah / Blok:** (Contoh: *Jl. Mulawarman RT 35 No. 12*).
   * **Nomor Telepon / WhatsApp:** (Untuk keperluan konfirmasi RT).
4. Klik **"Simpan Kartu Keluarga"**.

### B. Menambahkan Anggota Keluarga di dalam KK
1. Temukan Kartu Keluarga yang dimaksud menggunakan kolom pencarian.
2. Klik tombol **"Kelola Anggota"** pada baris KK tersebut.
3. Klik **"+ Tambah Anggota"**, lalu lengkapi rincian:
   * **NIK:** 16 digit angka.
   * **Nama Lengkap & Jenis Kelamin** (Laki-laki / Perempuan).
   * **Hubungan Keluarga:** Pilih *Kepala Keluarga, Istri, Anak, Orang Tua, atau Famili Lain*.
   * **Tanggal Lahir:** (Sistem akan mengklasifikasikan usia balita, usia produktif, atau lansia secara otomatis).
   * **Tingkat Pendidikan Terakhir:** (SD, SMP, SMA, Sarjana/Diploma, Belum Sekolah).
   * **Pekerjaan:** (Petani/Perkebunan, Nelayan, Karyawan Swasta, PNS/TNI/Polri, Wiraswasta, IRT/Pelajar/Lainnya).
4. Klik **"Simpan Anggota"**.

> 💡 **Fitur Otomatis:** Anda **tidak perlu menghitung manual** total jiwa, jumlah balita, lansia, atau persentase pekerjaan. Sistem web langsung mengalkulasi dan memperbarui grafik beranda publik secara *real-time*.

---

## 4. PANDUAN MODUL 2: PUBLIKASI KEGIATAN WARGA & BERITA (`/admin/kegiatan-warga` & `/admin/berita`)

### A. Mempublikasikan Liputan Kegiatan Warga Baru
1. Buka menu **Kegiatan Warga**.
2. Klik tombol **"+ Tambah Kegiatan Baru"**.
3. Lengkapi formulir:
   * **Judul Kegiatan:** (Contoh: *Kerja Bakti Massal Pembersihan Saluran Drainase RT 35*).
   * **Penulis / Dokumentator:** (Ketik nama Anda / Sekretariat RT 35).
   * **Tanggal Pelaksanaan:** Pilih tanggal acara berlangsung.
   * **Kategori Kegiatan:** Pilih kategori yang sesuai (Gotong Royong, HUT RI, Keagamaan, Posyandu, dll).
   * **Foto Sampul / Banner:** Unggah foto dokumentasi terbaik (format JPG/PNG).
   * **Deskripsi / Isi Liputan:** Tuliskan ringkasan jalannya acara, pihak yang hadir, dan hasil kegiatan.
4. Klik **"Terbitkan Kegiatan"**. Dokumentasi kegiatan langsung terbit di halaman publik `/page/kegiatan-warga`.

### B. Menerbitkan Warta Berita Lingkungan
1. Buka menu **Berita RT**.
2. Klik **"+ Tambah Berita"**.
3. Masukkan judul, kategori berita, foto pendukung, dan isi warta berita.
4. Klik **"Publikasikan Berita"**. Berita akan langsung tampil di halaman `/berita`.

---

## 5. PANDUAN MODUL 3: PAPAN PENGUMUMAN WARGA (`/admin/pengumuman`)

Modul ini digunakan untuk menyebarkan informasi penting yang akan tampil di bagian atas halaman depan website.

### A. Membuat Pengumuman Baru
1. Buka menu **Papan Pengumuman**.
2. Klik **"+ Buat Pengumuman"**.
3. Tentukan:
   * **Tingkat Prioritas / Kategori:** 
     * 🔴 *Siaga / Darurat* (Untuk info pemadaman air/listrik, peringatan cuaca).
     * 🟡 *Agenda Lingkungan* (Jadwal posyandu, rapat warga, kerja bakti).
     * 🔵 *Informasi Umum* (Penyaluran bantuan, info kelurahan).
   * **Judul & Isi Pesan:** Tuliskan informasi secara padat, ringkas, dan jelas.
4. Klik **"Simpan & Publikasikan"**. Pengumuman langsung aktif di beranda.

---

## 6. PANDUAN MODUL 4: PENGELOLAAN FASILITAS RT (`/admin/fasilitas`)

Modul ini memetakan fasilitas umum milik lingkungan RT 35 untuk diketahui warga:
1. Buka menu **Fasilitas RT**.
2. Klik **"+ Tambah Fasilitas"**.
3. Masukkan nama fasilitas (Balai Pertemuan RT, Pos Kamling Utama, Lapangan Olahraga, Tempat Pengolahan Sampah), lokasi, deskripsi singkat, kondisi (*Baik* / *Perlu Perbaikan*), dan foto fasilitas.
4. Klik **"Simpan Fasilitas"**. Fasilitas dapat dilihat warga di halaman `/fasilitas`.

---

## 7. PANDUAN MODUL 5: KOTAK ASPIRASI & LAYANAN SURAT WARGA (`/admin/aspirasi`)

Warga dapat mengirimkan aduan, saran, maupun permohonan melalui formulir online di website.
1. Buka menu **Kotak Aspirasi & Layanan Warga**.
2. Anda akan melihat daftar pesan masuk dari warga beserta nama, nomor kontak, dan isi laporan.
3. Ubah status respon pesan:
   * **Pending (Kuning):** Pesan baru masuk belum dibaca.
   * **Diproses (Biru):** Sedang ditindaklanjuti pengurus RT.
   * **Selesai (Hijau):** Laporan telah diselesaikan.
4. Terdapat tombol cepat **"Hubungi via WhatsApp"** untuk langsung membalas warga secara personal.

---

## 8. PANDUAN MODUL 6: PENGATURAN KONTAK & LAYANAN RT (`/admin/settings`)

Gunakan menu ini jika terdapat perubahan nomor pengurus atau syarat surat pengantar:
* **Nomor WhatsApp Layanan RT:** Ubah nomor WA yang menerima notifikasi warga.
* **Syarat Surat Pengantar:** Perbarui daftar persyaratan administrasi yang wajib dibawa warga ke rumah Ketua RT (misal: Fotokopi KK, KTP, Surat Pengantar).
* **Kontak Darurat:** Perbarui nomor darurat Babinsa, Bhabinkamtibmas, Puskesmas, atau Damkar terdekat.
* Klik **"Simpan Pengaturan"** di bagian bawah halaman.

---

## 9. TIPS OPERASIONAL, KEAMANAN & PEMELIHARAAN

1. **Ukuran Foto yang Dianjurkan:**
   * Sebelum mengunggah foto kegiatan, usahakan ukuran foto di bawah **2 MB** agar website dapat diakses dengan cepat oleh warga pengguna ponsel cerdas.
2. **Kerahasiaan Akun & Data Pribadi Warga:**
   * Jangan membagikan akun login admin kepada pihak di luar jajaran pengurus RT 35 demi menjaga kerahasiaan data kependudukan (NIK dan Nomor KK).
3. **Pencadangan Data (Backup):**
   * Data kependudukan tersimpan aman di cloud server PostgreSQL Supabase yang memiliki sistem pencadangan berkala otomatis.

---

## 10. KONTAK DUKUNGAN PENGEMBANG
Apabila Bapak/Ibu pengurus mengalami kendala teknis atau membutuhkan konsultasi lanjutan mengenai sistem website, silakan menghubungi:

* **Institusi:** Universitas Mulia – Balikpapan
* **Kelompok:** KKN Kelompok Manggar 2 (RT 35 Manggar)
* **Penanggung Jawab Sistem (PIC Web):** Gusti Ihsanuddin
* **Email Resmi:** `kkn.manggar2@universitasmulia.ac.id`

---
*Dokumen ini diserahterimakan secara resmi kepada Sekretaris dan Jajaran Pengurus RT 35 Kelurahan Manggar.*
