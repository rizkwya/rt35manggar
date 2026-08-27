# STANDARD OPERATING PROCEDURE & USER MANUAL
## SISTEM INFORMASI & PORTAL LAYANAN PUBLIK DIGITAL RT 35 MANGGAR

```
================================================================================
NOMOR DOKUMEN       : SOP/UM-KKN/RT35-MGR/2026/001
EDISI / VERSI       : 1.0 (Official Production Release)
STATUS DOKUMEN      : RELEASED & HANDED OVER
ALAMAT RESMI DOMAIN : https://www.rt35manggar.my.id
HALAMAN LOGIN ADMIN : https://www.rt35manggar.my.id/login
LEMBAGA PELAKSANA   : TIM KKN KELOMPOK MANGGAR 2 – UNIVERSITAS MULIA
PENANGGUNG JAWAB    : GUSTI IHSANUDDIN
KONTAK TEKNIS       : 085821550980 | gustiihsanuddin08@gmail.com
SASARAN PENGGUNA    : SEKRETARIS RT & JAJARAN PENGURUS RT 35 KELURAHAN MANGGAR
TANGGAL SERAH TERIMA: AGUSTUS 2026
================================================================================
```

---

## 🏛️ LEMBAR PENGESAHAN & BERITA ACARA SERAH TERIMA SISTEM

Dokumen Manual Operasional dan Buku Pedoman Sistem Informasi ini disusun secara resmi sebagai panduan baku pengelolaan mandiri Website Portal Pelayanan Publik RT 35 Kelurahan Manggar, Kecamatan Balikpapan Timur.

Sistem perangkat lunak beserta seluruh basis data kependudukan telah diserahterimakan secara penuh oleh **Tim KKN Kelompok Manggar 2 Universitas Mulia** kepada **Sekretaris RT & Pengurus RT 35 Kelurahan Manggar** untuk dipergunakan demi kemaslahatan dan keterbukaan informasi warga.

---

## 📑 DAFTAR ISI SISTEMATIS
* [BAB I: GAMBARAN UMUM & ARSITEKTUR SISTEM](#bab-i-gambaran-umum--arsitektur-sistem)
* [BAB II: HAK AKSES, AUTENTIKASI & KEAMANAN AKUN](#bab-ii-hak-akses-autentikasi--keamanan-akun)
* [BAB III: SOP MANAJEMEN DATA KEPENDUDUKAN & DEMOGRAFI](#bab-iii-sop-manajemen-data-kependudukan--demografi)
* [BAB IV: SOP PUBLIKASI KEGIATAN WARGA & ARSIP DIGITAL](#bab-iv-sop-publikasi-kegiatan-warga--arsip-digital)
* [BAB V: SOP PENERBITAN WARTA BERITA LINGKUNGAN](#bab-v-sop-penerbitan-warta-berita-lingkungan)
* [BAB VI: SOP PENYEBARAN PENGUMUMAN & INFORMASI SIAGA](#bab-vi-sop-penyebaran-pengumuman--informasi-siaga)
* [BAB VII: SOP INVENTARISASI & PEMETAAN FASILITAS RT](#bab-vii-sop-inventarisasi--pemetaan-fasilitas-rt)
* [BAB VIII: SOP KOTAK ASPIRASI & PENANGANAN LAPORAN WARGA](#bab-viii-sop-kotak-aspirasi--penanganan-laporan-warga)
* [BAB IX: SOP KONFIGURASI PROFIL, LAYANAN SURAT & KONTAK RT](#bab-ix-sop-konfigurasi-profil-layanan-surat--kontak-rt)
* [BAB X: STANDAR PENGELOLAAN MEDIA & PEMELIHARAAN SISTEM](#bab-x-standar-pengelolaan-media--pemeliharaan-sistem)
* [BAB XI: DUKUNGAN TEKNIS & SERVICE LEVEL AGREEMENT (SLA)](#bab-xi-dukungan-teknis--service-level-agreement-sla)

---

## BAB I: GAMBARAN UMUM & ARSITEKTUR SISTEM

### 1.1 Identitas Sistem
* **Nama Sistem:** Portal Pelayanan Publik & Sistem Informasi Kependudukan RT 35 Manggar.
* **Alamat Domain Publik:** **`https://www.rt35manggar.my.id`**
* **Arsitektur Aplikasi:** Astro Framework SSG + React Interactive Component + PostgreSQL Supabase Real-time Cloud Engine.

### 1.2 Tujuan Utama Implementasi
1. **Transparansi Kependudukan:** Menyajikan agregat statistik jumlah KK, penduduk, rasio gender, distribusi usia, dan mata pencaharian warga secara otomatis.
2. **Digitalisasi Pelayanan Administrasi:** Menyediakan informasi persyaratan surat pengantar RT dan form aduan warga 24 jam.
3. **Pusat Warta & Dokumentasi Lingkungan:** Mengabadikan kegiatan gotong royong, perayaan kemerdekaan, dan agenda sosial secara terstruktur.

---

## BAB II: HAK AKSES, AUTENTIKASI & KEAMANAN AKUN

### 2.1 Alur Masuk Administrator (*Admin Login*)
1. Buka browser pada komputer atau smartphone.
2. Akses gerbang otentikasi: **`https://www.rt35manggar.my.id/login`**
3. Masukkan kredensial resmi pengurus:
   * **Username:** `sekretaris`
   * **Password:** *(Gunakan password resmi yang diserahterimakan)*
4. Klik tombol **"Masuk ke Dashboard"**.

### 2.2 Prosedur Keamanan Sesi (*Session Security*)
* **Logout Mandiri:** Wajib menekan tombol **"Keluar / Logout"** setelah selesai melakukan pembaruan data.
* **Kerahasiaan Kredensial:** Dilarang mendistribusikan username dan password kepada pihak di luar struktur pengurus RT 35 guna melindungi data privat kependudukan (NIK dan Nomor KK warga).

---

## BAB III: SOP MANAJEMEN DATA KEPENDUDUKAN & DEMOGRAFI

Modul ini berlokasi di menu **Data Demografis** (`/admin/demografis`).

### 3.1 Prosedur Entri Kartu Keluarga (KK) Baru
1. Klik tombol **"+ Tambah Kartu Keluarga"**.
2. Masukkan **16 Digit Nomor KK** yang tertera pada berkas fisik.
3. Masukkan **Nama Lengkap Kepala Keluarga**.
4. Masukkan **Alamat Domisili / Blok Rumah** (Contoh: *Jl. Mulawarman RT 35 No. 12*).
5. Masukkan **Nomor WhatsApp / Telepon** warga.
6. Klik **"Simpan Kartu Keluarga"**.

### 3.2 Prosedur Entri & Pengelolaan Anggota Keluarga
1. Gunakan kolom pencarian instan untuk menemukan data KK yang bersangkutan.
2. Klik tombol **"Kelola Anggota"**.
3. Klik **"+ Tambah Anggota"**, lalu lengkapi atribut data:
   * **NIK:** 16 digit angka.
   * **Nama Anggota & Jenis Kelamin:** (Laki-laki / Perempuan).
   * **Hubungan Keluarga:** *Kepala Keluarga, Istri, Anak, Orang Tua, atau Famili Lain*.
   * **Tanggal Lahir:** (Menentukan klasifikasi balita, usia produktif, atau lansia secara otomatis).
   * **Pendidikan Terakhir:** *SD, SMP, SMA, Sarjana/Diploma, Belum/Tidak Sekolah*.
   * **Mata Pencaharian:** *Petani/Perkebunan, Nelayan, Karyawan Swasta, PNS/TNI/Polri, Wiraswasta/Dagang, IRT/Pelajar/Lainnya*.
4. Klik **"Simpan Anggota"**.

### 3.3 Otomatisasi Perhitungan Data Kependudukan
* Sistem web telah dilengkapi algoritma kalkulasi reaktif. Setiap kali ada penambahan atau perubahan data KK, **seluruh grafik statistik di halaman depan beranda publik akan terkalkulasi ulang secara otomatis** tanpa membutuhkan perhitungan manual.

---

## BAB IV: SOP PUBLIKASI KEGIATAN WARGA & ARSIP DIGITAL

Modul ini berlokasi di menu **Kegiatan Warga** (`/admin/kegiatan-warga`).

1. Klik tombol **"+ Tambah Kegiatan Baru"**.
2. Isi formulir publikasi:
   * **Judul Kegiatan:** Tuliskan nama kegiatan yang jelas (Contoh: *Peringatan HUT Kemerdekaan RI Ke-81 Lingkungan RT 35*).
   * **Penulis / Dokumentator:** Masukkan nama pengarsip (Contoh: *Sekretariat RT 35*).
   * **Tanggal Kegiatan:** Pilih tanggal pelaksanaan.
   * **Kategori Kegiatan:** Pilih kategori (*Gotong Royong, Peringatan HUT RI, Posyandu, Pertemuan Warga, Keagamaan*).
   * **Foto Sampul:** Unggah foto dokumentasi utama kegiatan.
   * **Uraian Kegiatan:** Tuliskan deskripsi ringkas pelaksanaan kegiatan.
3. Klik **"Terbitkan Kegiatan"**. Dokumentasi akan langsung terbit pada halaman publik **`/page/kegiatan-warga`**.

---

## BAB V: SOP PENERBITAN WARTA BERITA LINGKUNGAN

Modul ini berlokasi di menu **Berita RT** (`/admin/berita`).

1. Klik tombol **"+ Tambah Berita"**.
2. Masukkan **Judul Berita**, **Kategori Warta**, **Gambar Berita**, dan **Isi Teks Berita**.
3. Klik **"Publikasikan Berita"**.
4. Berita akan langsung terbit seketika di halaman publik **`/berita`**.

---

## BAB VI: SOP PENYEBARAN PENGUMUMAN & INFORMASI SIAGA

Modul ini berlokasi di menu **Papan Pengumuman** (`/admin/pengumuman`).

1. Klik tombol **"+ Buat Pengumuman"**.
2. Pilih Kategori & Tingkat Urgensi:
   * 🔴 **Siaga / Darurat:** Digunakan untuk pemadaman air/listrik mendadak atau himbauan keamanan.
   * 🟡 **Agenda Lingkungan:** Digunakan untuk jadwal posyandu, kerja bakti, atau pertemuan pengurus.
   * 🔵 **Informasi Umum:** Digunakan untuk pengumuman bantuan sosial atau program kelurahan.
3. Masukkan **Judul** dan **Isi Pesan Singkat**.
4. Klik **"Simpan & Publikasikan"**. Pengumuman akan langsung muncul di bagian teratas beranda website.

---

## BAB VII: SOP INVENTARISASI & PEMETAAN FASILITAS RT

Modul ini berlokasi di menu **Fasilitas RT** (`/admin/fasilitas`).

1. Klik tombol **"+ Tambah Fasilitas"**.
2. Masukkan nama fasilitas umum (Balai Pertemuan, Pos Kamling, Lapangan Olahraga), lokasi, deskripsi, kondisi fisik (*Sangat Baik, Baik, Perlu Perbaikan*), dan unggah foto sarana.
3. Klik **"Simpan Fasilitas"**. Data dapat diakses publik pada menu **`/fasilitas`**.

---

## BAB VIII: SOP KOTAK ASPIRASI & PENANGANAN LAPORAN WARGA

Modul ini berlokasi di menu **Kotak Aspirasi** (`/admin/aspirasi`).

1. Sekretaris RT memeriksa daftar laporan dan aduan online warga yang masuk secara berkala.
2. **Respon Cepat via WhatsApp:** Klik tombol *Hubungi via WhatsApp* pada baris aduan untuk langsung berkomunikasi dengan warga pelapor.
3. **Pembaruan Status Laporan:**
   * 🟡 *Pending:* Laporan baru masuk dan belum diproses.
   * 🔵 *Diproses:* Sedang ditindaklanjuti oleh pengurus RT / seksi terkait.
   * 🟢 *Selesai:* Masalah atau aduan telah berhasil diselesaikan.

---

## BAB IX: SOP KONFIGURASI PROFIL, LAYANAN SURAT & KONTAK RT

Modul ini berlokasi di menu **Pengaturan Sistem** (`/admin/settings`).

1. Kolom konfigurasi yang dapat disesuaikan:
   * **Nomor WhatsApp Resmi Pelayanan RT:** Nomor penerima konfirmasi warga.
   * **Alamat Balai Pertemuan / Posko:** Keterangan lokasi fisik sekretariat.
   * **Daftar Syarat Surat Pengantar:** Petunjuk berkas yang wajib dibawa warga ke rumah Ketua RT (misal: Fotokopi KTP, KK, Surat Pengantar).
   * **Kontak Darurat Wilayah:** Nomor telepon Babinsa, Bhabinkamtibmas, Puskesmas Manggar, dan Damkar.
2. Klik tombol **"Simpan Pengaturan"** di akhir halaman.

---

## BAB X: STANDAR PENGELOLAAN MEDIA & PEMELIHARAAN SISTEM

1. **Spesifikasi Foto yang Diunggah:**
   * Format yang didukung: **JPG, PNG, WebP**.
   * Batas ukuran yang disarankan: **Maksimal 1 MB – 2 MB** per file gambar.
   * Rekomendasi: Sebelum diunggah, foto dari kamera HP dapat dikirimkan ke WhatsApp terlebih dahulu agar otomatis terkompresi ringan tanpa mengurangi kualitas visual di website.
2. **Keandalan Server & Cloud Database:**
   * Basis data tersimpan pada cloud engine PostgreSQL Supabase dengan sistem pencadangan (*automated backup*) berkala 24 jam.

---

## BAB XI: DUKUNGAN TEKNIS & SERVICE LEVEL AGREEMENT (SLA)

Apabila pengurus RT 35 membutuhkan bantuan teknis darurat, pemulihan akun (*password recovery*), atau penambahan modul lanjutan, silakan menghubungi narahubung teknis resmi pengembang:

```
================================================================================
LEMBAGA PENGEMBANG : TIM KKN KELOMPOK MANGGAR 2 – UNIVERSITAS MULIA
PENANGGUNG JAWAB   : GUSTI IHSANUDDIN (PIC SISTEM & WEB PORTAL)
NOMOR TELEPON / WA : 085821550980 (Layanan Konsultasi 24 Jam)
ALAMAT EMAIL RESMI : gustiihsanuddin08@gmail.com
DOMAIN RESMI WEB   : https://www.rt35manggar.my.id
================================================================================
```

---
*Dokumen ini diterbitkan secara sah dan diserahkan sebagai aset digital milik RT 35 Kelurahan Manggar.*
