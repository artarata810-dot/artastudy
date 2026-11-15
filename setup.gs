/**
 * ============================================================================
 * Artastudy - Academic Research Suite & Paper Architect
 * Berkas: setup.gs
 * Fungsi: Inisialisasi Database Google Sheets & Safe Migration Non-Destruktif
 * Lisensi: Proprietary - Zettbos (Standar ZettBOT v4.1)
 * ============================================================================
 */

// Konfigurasi Nama Tab Sheet (Dilarang menggunakan karakter underscore '_')
const SHEET_NAMES = {
  PROJEK: 'ProjekRiset',
  JURNAL: 'RiwayatJurnal',
  PENGATURAN: 'PengaturanSistem'
};

// Header Kolom Baku (v1.1.0 - Academic Professional Suite)
const HEADERS = {
  PROJEK: [
    'IdProjek',
    'TanggalBuat',
    'EmailPengguna',
    'BidangIlmu',
    'TopikAwal',
    'JudulTerpilih',
    'RumusanMasalah',
    'ResearchGap',
    'Novelty',
    'MetodePenelitian',
    'StatusProses',
    'UrlGoogleDoc'
  ],
  JURNAL: [
    'IdJurnal',
    'IdProjek',
    'JudulPaper',
    'Penulis',
    'Tahun',
    'NamaJurnal',
    'DoiUrl',
    'UrlGoogleScholar',
    'RingkasanKunci',
    'MetodePaper',
    'TemuanUtama'
  ],
  PENGATURAN: [
    'KunciSetting',
    'NilaiSetting'
  ]
};

/**
 * Inisialisasi & Safe Migration Database Artastudy
 * Aman dijalankan berulang kali tanpa merusak atau menimpa data pengguna.
 */
function inisialisasiDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    Logger.log('Peringatan: Script belum terikat pada Google Sheets aktif.');
    return {
      sukses: false,
      pesan: 'Spreadsheet aktif tidak ditemukan. Pastikan script ini dijalankan dari Google Sheets (Extensions > Apps Script).'
    };
  }

  // 1. Inisialisasi Sheet ProjekRiset
  migrasiSheetAman(ss, SHEET_NAMES.PROJEK, HEADERS.PROJEK, [
    [
      'RST-202611-001',
      Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss'),
      Session.getActiveUser().getEmail() || 'peneliti@artastudy.ac.id',
      'Teknologi Pendidikan',
      'Penerapan AI untuk Personalisasi Pembelajaran Siswa SMA',
      'Analisis Efektivitas Pembelajaran Adaptif Berbasis AI terhadap Pemahaman Konsep Sains Siswa SMA',
      '1. Bagaimana implementasi pembelajaran adaptif berbasis AI di kelas sains?\n2. Sejauh mana peningkatan pemahaman konsep siswa setelah intervensi?',
      'Sebagian besar studi terdahulu berfokus pada perguruan tinggi; minim evaluasi empiris pada materi sains sekolah menengah dengan kurikulum lokal.',
      'Integrasi model scaffolding berbasis AI real-time yang diselaraskan dengan capaian pembelajaran sains kurikulum nasional.',
      'Kuantitatif (Quasi-Experimental)',
      'Selesai',
      'https://docs.google.com/document/d/sample-doc-id/edit'
    ]
  ]);

  // 2. Inisialisasi Sheet RiwayatJurnal
  migrasiSheetAman(ss, SHEET_NAMES.JURNAL, HEADERS.JURNAL, [
    [
      'JRN-202611-001',
      'RST-202611-001',
      'Artificial Intelligence in Education: A Review of Adaptive Learning Systems',
      'Smith, J., & Rahardjo, B.',
      '2023',
      'International Journal of Educational Technology',
      'https://doi.org/10.1016/j.ijet.2023.01.004',
      'https://scholar.google.com/scholar?q=Artificial+Intelligence+in+Education+Adaptive+Learning+Systems',
      'Menjelaskan taksonomi adaptivitas sistem AI dalam meningkatkan retensi memori materi sains.',
      'Systematic Literature Review',
      'Retensi belajar meningkat hingga 24% pada intervensi adaptif terstruktur.'
    ]
  ]);

  // 3. Inisialisasi Sheet PengaturanSistem
  migrasiSheetAman(ss, SHEET_NAMES.PENGATURAN, HEADERS.PENGATURAN, [
    ['FormatSitasiDefault', 'APA 7th Edition'],
    ['VersiAplikasi', 'Artastudy Professional v1.1.0'],
    ['GayaPenulisan', 'Bahasa Baku Akademik KBBI / PUEBI & APA 7th'],
    ['ExportFormatDefault', 'Google Docs Standard 4-4-3-3']
  ]);

  SpreadsheetApp.flush();
  Logger.log('Inisialisasi database Artastudy v1.1.0 selesai.');
  return {
    sukses: true,
    pesan: 'Database Artastudy Professional berhasil disiapkan tanpa merusak data lama!'
  };
}

/**
 * Logika Safe Migration:
 * Menjaga integritas data pengguna lama, hanya menambahkan kolom baru di sisi kanan.
 */
function migrasiSheetAman(ss, sheetName, expectedHeaders, sampleRows) {
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
    sheet.getRange(1, 1, 1, expectedHeaders.length)
      .setFontWeight('bold')
      .setBackground('#0F172A')
      .setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);

    if (sampleRows && sampleRows.length > 0) {
      sheet.getRange(2, 1, sampleRows.length, sampleRows[0].length).setValues(sampleRows);
    }
  } else {
    // Sinkronisasi kolom baru secara non-destruktif
    const lastCol = sheet.getLastColumn();
    let currentHeaders = [];
    if (lastCol > 0) {
      currentHeaders = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
    }

    expectedHeaders.forEach(function (header) {
      if (currentHeaders.indexOf(header) === -1) {
        const newColIndex = sheet.getLastColumn() + 1;
        const cell = sheet.getRange(1, newColIndex);
        cell.setValue(header);
        cell.setFontWeight('bold')
          .setBackground('#0F172A')
          .setFontColor('#FFFFFF');
      }
    });
  }
}
