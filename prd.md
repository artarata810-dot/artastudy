# PRODUCT REQUIREMENT DOCUMENT (PRD)
## Projek: Artastudy - Academic Research Suite & Paper Architect
*Versi Dokumen: 1.1.0 | Status: Aktif & Diimplementasikan | Standar: ZettBOT v4.1*

================================================================================
ZONA ATAS: SPESIFIKASI KEBUTUHAN PRODUK (BLUEPRINT AWAL)
================================================================================

### 1. Nama Projek & Problem Statement
- **Nama Aplikasi:** **Artastudy** (Academic Research Suite & Paper Architect).
- **Problem Statement:**
  Siswa, mahasiswa, dan peneliti mandiri sering mengalami kendala kritis dalam menyusun karya ilmiah dan proposal riset:
  1. Kesulitan memetakan **Research Gap (Celah Riset)** dan **Kebaruan (Novelty)** yang valid di mata pembimbing/reviewer.
  2. Sintesis literatur jurnal yang sering terpisah-pisah tanpa adanya **Matriks Sintesis Literatur** komparatif.
  3. Kebutuhan menyusun **Abstrak Dwibahasa (Bahasa Indonesia & Academic English)** sesuai standar jurnal bereputasi.
  4. Kerumitan mengelola sitasi ke Reference Manager (Mendeley, Zotero, EndNote) dan pemformatan dokumen sesuai standar baku skripsi.
- **Solusi Utama:**
  Web App riset akademik mandiri berbasis Google Apps Script dan Google Sheets dengan integrasi Crossref REST API dan Google Scholar:
  1. *Research Ideation & Gap Identifier*: Merumuskan judul, rumusan masalah, Research Gap, dan Novelty.
  2. *Literature Synthesis Matrix*: Menghasilkan tabel matriks komparatif paper ilmiah secara otomatis.
  3. *Bilingual Abstract & Chapter Drafter*: Generator Abstrak ID/EN dan kerangka Bab I-V dengan sitasi dinamis (APA, IEEE, Harvard).
  4. *Multi-Format Academic Export*: Ekspor Google Docs resmi format baku skripsi (4-4-3-3 cm) dan ekspor sitasi BibTeX (.bib) untuk Mendeley & Zotero.

---

### 2. Peran Pengguna (User Roles)
- **Peneliti / Mahasiswa / Akademisi (Pengguna Utama):**
  - Mengakses Web App langsung via browser dengan akun Google apapun tanpa hambatan setup izin admin/sekolah.
  - Menggunakan wizard 4 langkah riset ilmiah.
  - Mengunduh/menyalin berkas BibTeX untuk Mendeley/Zotero.
  - Membuka dan mengedit draf karya ilmiah yang otomatis terbuat di Google Docs milik pengguna.

---

### 3. Arsitektur & Lingkungan Kerja
- **Arsitektur Sistem:** Monolith Google Apps Script (GAS) Web App + Google Sheets Database.
- **Frontend Layer:** `index.html` (HTML5, Tailwind CSS modern via CDN, Inline SVG Icons, Vanilla JS dengan In-Memory Caching).
- **Backend Controller:** `code.gs` (REST-like RPC via `google.script.run`, Crossref Fetcher, BibTeX Converter, Docs Styler).
- **Database & Safe Migration:** `setup.gs` (Google Sheets non-destruktif: `ProjekRiset`, `RiwayatJurnal`, `PengaturanSistem`).
- **Target Tampilan:** Responsif Penuh (HP, Tablet, Laptop/PC).
- **Gaya Desain:** *Academic Anti-AI Aesthetic* (Deep Navy `#0F172A`, Slate, Sky Blue, tipografi baku, spasi lapang, tanpa emoji berlebih).

---

### 4. Alur Kerja Aplikasi (User Flow)
1. **Dashboard Utama:**
   - Ringkasan metrik (Proyek Aktif, Total Paper Terindeks, Naskah Siap Ekspor).
   - Tabel riwayat naskah dengan kolom ID, Judul, Research Gap, Metode, Status, dan aksi Buka/Hapus.
2. **Tahap 1: Ide, Research Gap & Novelty (Step 1):**
   - Input bidang ilmu, jenjang pendidikan, dan minat topik.
   - AI menghasilkan 4 opsi proposal dengan Celah Riset (Research Gap) dan Kebaruan (Novelty) eksplisit.
   - Pengguna memilih dan dapat mengedit langsung formulasi tersebut.
3. **Tahap 2: Google Scholar & Matriks Literatur (Step 2):**
   - Pencarian jurnal ilmiah terhubung Crossref API & tautan langsung Google Scholar.
   - Tombol simpan sitasi ke proyek.
   - Penyusunan otomatis **Tabel Matriks Sintesis Literatur Komparatif** (Penulis/Tahun, Judul, Metodologi, Temuan Kunci, Relevansi).
4. **Tahap 3: Abstrak Dwibahasa & Draf Bab I-V (Step 3):**
   - Pemilihan gaya sitasi (APA 7th, IEEE, atau Harvard).
   - Sintesis Abstrak Bahasa Indonesia (+ Keywords) dan Academic English Abstract (+ Keywords).
   - Penyusunan kerangka lengkap Bab I s/d Bab V dengan editor naskah interaktif.
5. **Tahap 4: Ekspor Akademik & Reference Manager (Step 4):**
   - Sekali klik *Buat Google Doc Sekarang*: Naskah dicetak rapi ke Google Drive dengan format standar skripsi (margin 4-4-3-3 cm, Times New Roman 12pt, spasi 1.5, cover, abstrak, bab, matriks, daftar pustaka).
   - Reference Manager: Salin kode BibTeX atau unduh berkas `.bib` untuk Mendeley & Zotero.

---

### 5. Desain Basis Data (Google Sheets)
*Aturan Baku: DILARANG menggunakan karakter underscore `_` pada nama tab sheet. Menggunakan PascalCase.*

#### Tab 1: `ProjekRiset`
| No | Nama Kolom | Tipe Data | Deskripsi |
|:---|:---|:---|:---|
| 0 | IdProjek | String (PK) | Format `RST-YYYYMM-XXX` |
| 1 | TanggalBuat | String | Format `dd/MM/yyyy HH:mm:ss` |
| 2 | EmailPengguna | String | Email akun Google pengguna |
| 3 | BidangIlmu | String | Bidang keilmuan riset |
| 4 | TopikAwal | String | Minat/isu riset awal |
| 5 | JudulTerpilih | String | Judul resmi karya ilmiah |
| 6 | RumusanMasalah | Text | Butir-butir pertanyaan penelitian |
| 7 | ResearchGap | Text | Kesenjangan literatur terdahulu |
| 8 | Novelty | Text | Kebaruan unik penelitian |
| 9 | MetodePenelitian | String | Desain metodologi riset |
| 10 | StatusProses | String | `Draf`, `Siap Ekspor`, `Selesai` |
| 11 | UrlGoogleDoc | String | URL berkas Google Docs di Google Drive |

#### Tab 2: `RiwayatJurnal`
| No | Nama Kolom | Tipe Data | Deskripsi |
|:---|:---|:---|:---|
| 0 | IdJurnal | String (PK) | Format `JRN-YYYYMM-XXX` |
| 1 | IdProjek | String (FK) | Relasi ke `ProjekRiset` |
| 2 | JudulPaper | String | Judul artikel ilmiah/jurnal |
| 3 | Penulis | String | Nama penulis |
| 4 | Tahun | String | Tahun publikasi |
| 5 | NamaJurnal | String | Nama jurnal/prosiding |
| 6 | DoiUrl | String | Tautan DOI |
| 7 | UrlGoogleScholar | String | Tautan langsung Google Scholar |
| 8 | RingkasanKunci | Text | Intisari telaah paper |
| 9 | MetodePaper | String | Metodologi paper referensi |
| 10 | TemuanUtama | Text | Temuan empiris kunci paper |

#### Tab 3: `PengaturanSistem`
| No | Nama Kolom | Tipe Data | Nilai Default |
|:---|:---|:---|:---|
| 0 | KunciSetting | String | `FormatSitasiDefault`, `VersiAplikasi` |
| 1 | NilaiSetting | String | `APA 7th Edition`, `Artastudy Professional v1.1.0` |

---

### 6. Aturan Validasi & Logika Khusus
1. **Incremental Unique ID Generator:** Format `RST-YYYYMM-XXX` dan `JRN-YYYYMM-XXX` dengan `LockService`.
2. **Academic Safety & Free Access:** Pencarian literatur menggunakan Crossref REST API publik (tanpa key berbayar) + Deep Link Google Scholar untuk pencarian sitasi lanjutan.
3. **Standar Format Dokumen Skripsi:**
   - Margin: Kiri 4 cm (113.4 pt), Atas 3 cm (85 pt), Kanan 3 cm (85 pt), Bawah 3 cm (85 pt).
   - Font: Times New Roman 12 pt, Spasi 1.5, Halaman Judul, Abstrak Dwibahasa, Bab 1-5, Matriks Literatur, dan Daftar Pustaka (hanging indent).
4. **BibTeX Compatibility:** Sintesis format `.bib` valid untuk Mendeley, Zotero, dan JabRef.
5. **Anti-Freeze & Anti-SyntaxError:** Form menggunakan `event.preventDefault()`, failure handler `.withFailureHandler()`, dan data primitif.

================================================================================
ZONA BAWAH: MASTER CONTEXT & LOGIKA SISTEM TERKINI (LIVING CONTEXT)
================================================================================

### Status Arsitektur & Lingkungan Aktif
- **Platform:** Vercel Cloud Edge Deployment (Universal SPA) & Google Apps Script.
- **Frontend Stack:** HTML5 + Tailwind CSS + Vanilla JavaScript ES6 + In-Memory Cache.
- **Backend Stack:** Google Apps Script (`code.gs`, `setup.gs`).
- **External Integration:**
  - Google Drive & Google Docs API (`DocumentApp`, `DriveApp`).
  - Academic Search Engine (Crossref REST API) + Deep Link Google Scholar.
  - Reference Manager Engine (BibTeX Generator).
- **Versi Terkini:** v1.2.0 (Vercel Cloud Deployment Ready).

### Skema Kolom Database Terkini (Active Schema)
- `ProjekRiset`: `[IdProjek, TanggalBuat, EmailPengguna, BidangIlmu, TopikAwal, JudulTerpilih, RumusanMasalah, ResearchGap, Novelty, MetodePenelitian, StatusProses, UrlGoogleDoc]`
- `RiwayatJurnal`: `[IdJurnal, IdProjek, JudulPaper, Penulis, Tahun, NamaJurnal, DoiUrl, UrlGoogleScholar, RingkasanKunci, MetodePaper, TemuanUtama]`
- `PengaturanSistem`: `[KunciSetting, NilaiSetting]`

### Log Pembaruan Resmi (Change Log)
- **v1.2.0 (15-11-2026):** Arsitektur Vercel-Ready (vercel.json, package.json, client storage, live Crossref browser fetch, export .doc skripsi, dan BibTeX .bib untuk Mendeley/Zotero).
- **v1.1.0 (15-11-2026):** Transformasi ke Artastudy Professional Suite. Menghapus dependensi Google Classroom 100%. Mengintegrasikan fitur Research Gap & Novelty Identifier, Matriks Sintesis Literatur Komparatif, Generator Abstrak Dwibahasa (ID/EN), Multi-Style Citation Engine (APA, IEEE, Harvard), Mendeley/Zotero BibTeX Exporter, dan Ekspor Google Docs Standar Baku Skripsi (4-4-3-3 cm).
- **v1.0.0 (08-11-2026):** Inisiasi blueprint dan implementasi awal sistem Artastudy.
