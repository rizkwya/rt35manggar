# 📘 BUKU PEDOMAN PENGELOLAAN SISTEM INFORMASI & PORTAL RESMI RT 35 KELURAHAN MANGGAR

**Penyusun:** Tim KKN Kelompok Manggar 2 – Universitas Mulia  
**Penanggung Jawab Sistem (PIC):** Gusti Ihsanuddin  
**Sasaran Pengguna:** Sekretaris RT & Jajaran Pengurus RT 35 Kelurahan Manggar  
**Versi Sistem:** 1.0 (Production Release)  
**Tahun Pengabdian:** 2026  

---

## 📑 DAFTAR ISI LENGKAP
1. [Pendahuluan & Hak Akses Pengurus](#1-pendahuluan--hak-akses-pengurus)
2. [Akses Masuk (Login) & Pengamanan Akun](#2-akses-masuk-login--pengamanan-akun)
3. [Panduan Modul 1: Manajemen Data Kependudukan & Demografi](#3-panduan-modul-1-manajemen-data-kependudukan--demografi)
4. [Panduan Modul 2: Publikasi Liputan Kegiatan Warga](#4-panduan-modul-2-publikasi-liputan-kegiatan-warga)
5. [Panduan Modul 3: Penerbitan Warta Berita Lingkungan](#5-panduan-modul-3-penerbitan-warta-berita-lingkungan)
6. [Panduan Modul 4: Papan Pengumuman & Informasi Siaga Warga](#6-panduan-modul-4-papan-pengumuman--informasi-siaga-warga)
7. [Panduan Modul 5: Pemetaan & Pengelolaan Fasilitas Lingkungan](#7-panduan-modul-5-pemetaan--pengelolaan-fasilitas-lingkungan)
8. [Panduan Modul 6: Kotak Aspirasi & Layanan Aduan Warga Online](#8-panduan-modul-6-kotak-aspirasi--layanan-aduan-warga-online)
9. [Panduan Modul 7: Pengaturan Kontak RT, Syarat Surat & Lokasi](#9-panduan-modul-7-pengaturan-kontak-rt-syarat-surat--lokasi)
10. [Panduan Teknis: Standar Pengunggahan Foto & Media](#10-panduan-teknis-standar-pengunggahan-foto--media)
11. [Kontak Bantuan & Dukungan Teknis Pengembang](#11-kontak-bantuan--dukungan-teknis-pengembang)

---

## 1. PENDAHULUAN & HAK AKSES PENGURUS
Website Portal Resmi RT 35 Kelurahan Manggar adalah inovasi digital berbasis web (*Web-Based Portal*) yang dibangun untuk mempermudah sekretariat RT dalam mendokumentasikan arsip kependudukan, mempublikasikan kegiatan lingkungan, menyebarkan pengumuman siaga, serta menerima aspirasi warga secara cepat dan transparan.

Seluruh data yang diinputkan oleh Sekretaris RT di panel admin akan **otomatis terhubung secara real-time** dengan halaman publik yang dapat dibaca oleh warga di:
👉 **`https://rt35manggar.vercel.app`**

---

## 2. AKSES MASUK (LOGIN) & PENGAMANAN AKUN

### A. Langkah-Langkah Masuk ke Dashboard Admin:
1. Buka browser (Google Chrome / Safari / Edge) di laptop, tablet, atau HP Anda.
2. Buka alamat: **`https://rt35manggar.vercel.app/login`** (atau klik menu **Login Pengurus** di bagian paling bawah/footer website).
3. Masukkan informasi login resmi:
   * **Username:** `sekretaris`
   * **Password:** *(Gunakan kata sandi resmi yang telah diserahterimakan)*
4. Klik tombol hijau **"Masuk ke Dashboard"**.
5. Anda akan diarahkan ke halaman utama **Dashboard Sekretaris RT**.

### B. Prosedur Keluar Akun (*Logout*):
* Setelah selesai melakukan penginputan atau pengeditan data, klik tombol **"Keluar / Logout"** di pojok kanan atas layar demi menjaga privasi dan keamanan basis data kependudukan warga RT 35.

---

## 3. PANDUAN MODUL 1: MANAJEMEN DATA KEPENDUDUKAN & DEMOGRAFI

Modul ini adalah pusat data kependudukan RT 35 yang mencakup data Kartu Keluarga (KK) dan data setiap anggota keluarga.

### A. Menambahkan Kartu Keluarga (KK) Baru:
1. Klik menu **Data Demografis** di menu samping (sidebar).
2. Klik tombol hijau **"+ Tambah Kartu Keluarga"**.
3. Isi kolom formulir:
   * **Nomor KK:** Masukkan 16 digit Nomor Kartu Keluarga.
   * **Nama Kepala Keluarga:** Masukkan nama lengkap kepala rumah tangga.
   * **Alamat Rumah / Blok:** Masukkan alamat domisili (Contoh: *Jl. Mulawarman RT 35 Blok C No. 04*).
   * **Nomor Telepon / WhatsApp:** Masukkan nomor kontak aktif warga.
4. Klik tombol **"Simpan Kartu Keluarga"**.

### B. Menambahkan Anggota Keluarga di dalam KK:
1. Cari nama kepala keluarga di tabel KK menggunakan kolom pencarian instan.
2. Klik tombol **"Kelola Anggota"** (ikon rincian keluarga).
3. Klik tombol **"+ Tambah Anggota"**, lalu lengkapi:
   * **NIK:** 16 digit Nomor Induk Kependudukan.
   * **Nama Lengkap:** Nama anggota keluarga.
   * **Jenis Kelamin:** Pilih *Laki-laki* atau *Perempuan*.
   * **Hubungan Keluarga:** Pilih *Kepala Keluarga, Istri, Anak, Orang Tua, atau Famili Lain*.
   * **Tanggal Lahir:** Pilih tanggal, bulan, dan tahun lahir (sistem otomatis menghitung kelompok umur balita, usia produktif, atau lansia).
   * **Tingkat Pendidikan Terakhir:** Pilih *SD, SMP, SMA, Sarjana/Diploma, atau Belum Sekolah*.
   * **Pekerjaan Utama:** Pilih *Petani/Perkebunan, Nelayan, Karyawan Swasta, PNS/TNI/Polri, Wiraswasta/Dagang, atau IRT/Pelajar/Lainnya*.
4. Klik **"Simpan Anggota"**.

### C. Mengedit & Menghapus Data Warga:
* **Mengedit Anggota:** Klik tombol pensil (*Edit*) pada baris nama anggota keluarga yang ingin diperbaiki, perbarui datanya, lalu klik *Simpan Perubahan*.
* **Menghapus Anggota:** Klik tombol tempat sampah (*Hapus*) jika ada warga yang pindah domisili atau mutasi keluar.

> 💡 **Kalkulasi Otomatis Sistem:** Sekretaris RT **tidak perlu menghitung manual** total jiwa, rasio pria/wanita, kelompok balita/lansia, maupun persentase pekerjaan. Sistem web secara otomatis mengkalkulasi dan memperbarui seluruh grafik beranda publik seketika.

---

## 4. PANDUAN MODUL 2: PUBLIKASI LIPUTAN KEGIATAN WARGA

Modul ini berfungsi untuk mengarsipkan kegiatan gotong royong, perayaan kemerdekaan, posyandu, dan agenda sosial RT 35.

### A. Menerbitkan Liputan Baru:
1. Buka menu **Kegiatan Warga** &rarr; Klik **"+ Tambah Kegiatan Baru"**.
2. Lengkapi isian formulir:
   * **Judul Kegiatan:** (Contoh: *Gotong Royong Pembersihan Saluran Air & Drainase RT 35*).
   * **Penulis / Dokumentator:** Masukkan nama penulis (Contoh: *Sekretariat RT 35* atau nama Anda).
   * **Tanggal Pelaksanaan:** Tentukan tanggal acara diadakan.
   * **Kategori Kegiatan:** Pilih kategori (Gotong Royong, Peringatan HUT RI, Posyandu, Pertemuan Warga, Keagamaan).
   * **Foto Sampul Utama:** Unggah foto dokumentasi terbaik acara.
   * **Uraian / Isi Liputan:** Tuliskan deskripsi ringkas jalannya acara, jumlah warga yang hadir, dan capaian kegiatan.
3. Klik **"Terbitkan Kegiatan"**. Dokumentasi akan langsung tampil di halaman publik `/page/kegiatan-warga`.

---

## 5. PANDUAN MODUL 3: PENERBITAN WARTA BERITA LINGKUNGAN

Modul ini digunakan untuk mempublikasikan artikel berita penting seputar lingkungan RT 35 dan kelurahan.

1. Buka menu **Berita RT** &rarr; Klik **"+ Tambah Berita"**.
2. Isi formulir:
   * **Judul Berita:** Tuliskan judul warta yang menarik dan informatif.
   * **Kategori Berita:** Pilih kategori (*Kegiatan Utama, Pengumuman, Pembangunan, Pemberdayaan, Lainnya*).
   * **Gambar Utama Berita:** Unggah gambar pendukung artikel.
   * **Isi Lengkap Berita:** Tuliskan isi berita secara terperinci.
3. Klik **"Publikasikan Berita"**. Berita langsung terbit secara *real-time* di halaman `/berita`.

---

## 6. PANDUAN MODUL 4: PAPAN PENGUMUMAN & INFORMASI SIAGA WARGA

Modul ini berfungsi untuk menyebarkan informasi mendesak atau pengumuman agenda rutin yang tampil di bagian atas beranda website.

1. Buka menu **Papan Pengumuman** &rarr; Klik **"+ Buat Pengumuman"**.
2. Pilih Kategori & Tingkat Urgensi:
   * 🔴 **Siaga / Darurat:** Digunakan untuk info pemadaman listrik/air, peringatan banjir, atau waspada keamanan.
   * 🟡 **Agenda Lingkungan:** Digunakan untuk jadwal posyandu balita/lansia, kerja bakti, atau arisan warga.
   * 🔵 **Informasi Umum:** Digunakan untuk info bansos, pendataan kelurahan, atau himbauan kebersihan.
3. Masukkan **Judul Pengumuman** dan **Isi Pengumuman**.
4. Klik **"Simpan & Publikasikan"**. Pengumuman langsung aktif di beranda web.

---

## 7. PANDUAN MODUL 5: PEMETAAN & PENGELOLAAN FASILITAS LINGKUNGAN

Modul ini mencatat sarana dan prasarana umum yang ada di lingkungan RT 35 agar diketahui seluruh warga.

1. Buka menu **Fasilitas RT** &rarr; Klik **"+ Tambah Fasilitas"**.
2. Isi informasi fasilitas:
   * **Nama Fasilitas:** (Contoh: *Balai Pertemuan Warga RT 35, Pos Kamling Utama, Lapangan Olahraga, Bank Sampah Mandiri*).
   * **Lokasi / Alamat:** Keterangan letak fasilitas di lingkungan.
   * **Kondisi Fasilitas:** Pilih *Sangat Baik, Baik, atau Perlu Perbaikan*.
   * **Foto Fasilitas:** Unggah foto fisik sarana prasarana.
   * **Deskripsi Singkat:** Keterangan jam operasional atau fasilitas pendukung.
3. Klik **"Simpan Fasilitas"**. Fasilitas dapat dilihat warga di halaman `/fasilitas`.

---

## 8. PANDUAN MODUL 6: KOTAK ASPIRASI & LAYANAN ADUAN WARGA ONLINE

Warga dapat mengirimkan saran, kritik, pengaduan lingkungan, maupun permohonan surat secara mandiri melalui form online.

1. Buka menu **Kotak Aspirasi & Layanan Warga**.
2. Pada tabel pesan masuk, Anda dapat melihat:
   * Nama Warga, Nomor WhatsApp, Tanggal Masuk, dan Isi Aspirasi / Laporan.
3. **Tindak Lanjut Laporan:**
   * Klik tombol **"Hubungi via WhatsApp"** untuk langsung membalas warga secara personal melalui aplikasi WhatsApp.
   * Ubah status penanganan laporan:
     * 🟡 *Pending:* Pesan baru masuk belum ditinjau.
     * 🔵 *Diproses:* Sedang ditindaklanjuti pengurus RT.
     * 🟢 *Selesai:* Pengaduan atau permohonan telah terselesaikan.

---

## 9. PANDUAN MODUL 7: PENGATURAN KONTAK RT, SYARAT SURAT & LOKASI

Gunakan menu ini untuk memperbarui profil dan kontak resmi sekretariat RT 35:

1. Buka menu **Pengaturan Sistem** (`/admin/settings`).
2. Kolom yang dapat diperbarui sewaktu-waktu:
   * **Nomor WhatsApp Resmi Pelayanan RT:** Nomor yang akan menerima notifikasi dari warga.
   * **Alamat Balai RT / Posko:** Keterangan alamat fisik balai pertemuan.
   * **Daftar Syarat Pengurusan Surat Pengantar:** Daftar berkas fisik yang wajib dibawa warga ke rumah Ketua RT (misal: *Fotokopi KTP, Fotokopi KK, Surat Pernyataan*).
   * **Nomor Kontak Darurat Lingkungan:** Nomor telepon darurat Babinsa, Bhabinkamtibmas, Puskesmas Manggar, dan Damkar.
3. Klik tombol **"Simpan Pengaturan"** di bagian bawah halaman.

---

## 10. PANDUAN TEKNIS: STANDAR PENGUNGGAHAN FOTO & MEDIA

Agar website tetap bekerja dengan kecepatan tinggi dan hemat kuota internet bagi warga yang mengakses lewat smartphone:
* **Format Foto yang Didukung:** JPG, JPEG, PNG, dan WebP.
* **Ukuran File yang Dianjurkan:** Maksimal **1 MB – 2 MB** per foto.
* **Tips Praktis:** Sebelum mengunggah foto dari kamera HP yang berukuran besar (misal 5MB–10MB), kirimkan foto terlebih dahulu ke WhatsApp (atau lakukan *screenshot*) agar ukurannya otomatis terkompresi ringan tanpa mengurangi kejernihan gambar.

---

## 11. KONTAK BANTUAN & DUKUNGAN TEKNIS PENGEMBANG

Apabila Bapak/Ibu Sekretaris RT atau jajaran pengurus RT 35 mengalami kendala teknis, lupa kata sandi, atau membutuhkan panduan lanjutan terkait sistem informasi ini, silakan langsung menghubungi kontak pengembang resmi:

* **Penanggung Jawab Sistem (PIC Web):** **Gusti Ihsanuddin**
* **Institusi Pelaksana:** KKN Kelompok Manggar 2 – Universitas Mulia Balikpapan
* **No. Telepon / WhatsApp:** **`085821550980`**
* **Alamat Email:** **`gustiihsanuddin08@gmail.com`**

---
*Buku Pedoman ini diserahterimakan secara resmi kepada Sekretaris dan Jajaran Pengurus RT 35 Kelurahan Manggar.*
