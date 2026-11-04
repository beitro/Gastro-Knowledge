// Enterprise-Grade Product Requirements Document (PRD) & User Persona / Survey Microsoft Word (.docx) Generator
// Covers Product Planning & Scope, MVP Feature Matrix, User Personas, User Journey Maps, and Restaurant Operational Surveys.

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ImageRun,
  Header,
  Footer,
  PageNumber,
  ShadingType
} from 'docx';
import { generateAllSystemCaptures } from './brdCaptureGenerator';

const COLOR_PRIMARY = '0F2942';   // Deep Navy Corporate
const COLOR_SECONDARY = '0284C7'; // Tech Blue
const COLOR_ACCENT = 'D97706';    // Amber Gold
const COLOR_SUCCESS = '059669';   // Emerald Green
const COLOR_PURPLE = '7C3AED';    // Violet Indigo
const COLOR_TEXT_DARK = '1E293B';  // Slate Dark
const COLOR_MUTED = '64748B';      // Slate Muted
const COLOR_BG_LIGHT = 'F8FAFC';   // Slate Light Background
const COLOR_BORDER = 'CBD5E1';     // Light Border

const cellBorderStandard = {
  top: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  left: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  right: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER }
};

function createParagraph(
  text: string,
  options: {
    bold?: boolean;
    italic?: boolean;
    size?: number; // half-points: 22 = 11pt
    color?: string;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    spaceBefore?: number;
    spaceAfter?: number;
  } = {}
): Paragraph {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: {
      before: options.spaceBefore !== undefined ? options.spaceBefore : 100,
      after: options.spaceAfter !== undefined ? options.spaceAfter : 100,
      line: 276
    },
    children: [
      new TextRun({
        text,
        bold: options.bold || false,
        italics: options.italic || false,
        size: options.size || 22,
        color: options.color || COLOR_TEXT_DARK,
        font: 'Segoe UI'
      })
    ]
  });
}

function createHeading(
  text: string,
  level: (typeof HeadingLevel)[keyof typeof HeadingLevel],
  options: { color?: string; spaceBefore?: number; spaceAfter?: number } = {}
): Paragraph {
  let size = 26;
  if (level === HeadingLevel.HEADING_1) size = 32;
  if (level === HeadingLevel.HEADING_2) size = 26;
  if (level === HeadingLevel.HEADING_3) size = 22;

  return new Paragraph({
    heading: level,
    spacing: {
      before: options.spaceBefore !== undefined ? options.spaceBefore : 280,
      after: options.spaceAfter !== undefined ? options.spaceAfter : 120
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size,
        color: options.color || (level === HeadingLevel.HEADING_1 ? COLOR_PRIMARY : COLOR_SECONDARY),
        font: 'Segoe UI Semibold'
      })
    ]
  });
}

function createBulletItem(boldPrefix: string, normalText: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 50, after: 50, line: 260 },
    children: [
      new TextRun({
        text: boldPrefix,
        bold: true,
        size: 21,
        color: COLOR_PRIMARY,
        font: 'Segoe UI'
      }),
      new TextRun({
        text: normalText,
        size: 21,
        color: COLOR_TEXT_DARK,
        font: 'Segoe UI'
      })
    ]
  });
}

function createTableCell(
  text: string,
  options: {
    isHeader?: boolean;
    bold?: boolean;
    widthPercent?: number;
    bgColor?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    color?: string;
  } = {}
): TableCell {
  const isHeader = options.isHeader || false;
  return new TableCell({
    width: options.widthPercent ? { size: options.widthPercent, type: WidthType.PERCENTAGE } : undefined,
    shading: {
      fill: options.bgColor || (isHeader ? COLOR_PRIMARY : 'FFFFFF'),
      type: ShadingType.CLEAR
    },
    borders: cellBorderStandard,
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: options.align || (isHeader ? AlignmentType.CENTER : AlignmentType.LEFT),
        children: [
          new TextRun({
            text,
            bold: isHeader || options.bold || false,
            size: isHeader ? 20 : 19,
            color: options.color || (isHeader ? 'FFFFFF' : COLOR_TEXT_DARK),
            font: 'Segoe UI'
          })
        ]
      })
    ]
  });
}

export async function generatePrdWordDocumentBlob(restaurantInfo?: {
  name?: string;
  picName?: string;
  targetGoLiveDate?: string;
}): Promise<Blob> {
  const captures = await generateAllSystemCaptures();

  const restoTitle = restaurantInfo?.name?.trim() ? restaurantInfo.name : 'GastroStock Enterprise POS';
  const picTitle = restaurantInfo?.picName?.trim() ? restaurantInfo.picName : 'Product Management Team';
  const targetDate = restaurantInfo?.targetGoLiveDate?.trim() ? restaurantInfo.targetGoLiveDate : 'Q4 2026';

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Segoe UI',
            size: 22,
            color: COLOR_TEXT_DARK
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'RESTOSYNC / GASTROSTOCK — PRODUCT REQUIREMENTS DOCUMENT (PRD)',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'Halaman ', size: 16, color: COLOR_MUTED }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: COLOR_MUTED }),
                  new TextRun({ text: ' dari ', size: 16, color: COLOR_MUTED }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: COLOR_MUTED })
                ]
              })
            ]
          })
        },
        children: [
          // COVER HEADER
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 120 },
            children: [
              new TextRun({
                text: 'PRODUCT REQUIREMENTS DOCUMENT (PRD)',
                bold: true,
                size: 38,
                color: COLOR_PRIMARY,
                font: 'Segoe UI Semibold'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 200 },
            children: [
              new TextRun({
                text: 'SISTEM POS KASIR & MANAJEMEN RESTORAN MULTI-OUTLET MVP v1.0',
                bold: true,
                size: 24,
                color: COLOR_SECONDARY,
                font: 'Segoe UI'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 400 },
            children: [
              new TextRun({
                text: `Klien / Entitas: ${restoTitle} | Target Go-Live: ${targetDate} | Penulis: ${picTitle}`,
                italics: true,
                size: 20,
                color: COLOR_MUTED
              })
            ]
          }),

          // METADATA TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Atribut Dokumen', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Rincian Spesifikasi', { isHeader: true, widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Nama Produk / Inisiatif', { bold: true }),
                  createTableCell(`GastroStock Resto POS & Inventory Ecosystem (Implementasi: ${restoTitle})`)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Status Dokumen', { bold: true }),
                  createTableCell('APPROVED — Baseline Pengembangan MVP Phase 1 (Scope Creep Guard)', { color: COLOR_SUCCESS })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Product Manager / Lead SA', { bold: true }),
                  createTableCell(picTitle)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Klasifikasi Rilis', { bold: true }),
                  createTableCell('Minimum Viable Product (MVP) v1.0 + Roadmap Fase 2 (Kitchen Display) & Fase 3 (Warehouse HACCP)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Target Platform', { bold: true }),
                  createTableCell('PWA Web (Touchscreen POS Kasir), Android Tablet 10" (KDS Dapur), Cloud Web Portal (Backoffice & Owner)')
                ]
              })
            ]
          }),

          // BAB 1: LATAR BELAKANG & TUJUAN BISNIS
          createHeading('1. LATAR BELAKANG, VISI & TUJUAN BISNIS', HeadingLevel.HEADING_1),
          createParagraph(
            'Dokumen Product Requirements Document (PRD) ini disusun sebagai single source of truth untuk mendefinisikan batasan fitur, ruang lingkup teknis, dan prioritas implementasi agar tim pengembang terhindar dari scope creep selama siklus hidup proyek.'
          ),
          createBulletItem('Visi Produk: ', 'Menciptakan sistem kasir restoran yang cepat (kecepatan checkout < 15 detik), anti-selisih stok (pengurangan bahan otomatis via BOM), dan tahan gangguan jaringan (offline-first architecture).'),
          createBulletItem('Tujuan Finansial Restoran: ', 'Menurunkan food waste dan kebocoran stok dari rata-rata industri 6% menjadi di bawah 1.2%, serta memangkas waktu rekonsiliasi kas kasir harian dari 45 menit menjadi kurang dari 10 menit.'),
          createBulletItem('Kriteria Sukses MVP: ', '100% pesanan meja berhasil tercatat, tiket dapur terdistribusi otomatis tanpa kertas bon hilang, selisih kas closing di bawah Rp 5.000 / shift, dan ketersediaan sistem 99.9%.'),

          // BAB 2: MATRIX FITUR MVP (PRODUCT SCOPE DEFINITION)
          createHeading('2. MATRIKS RUANG LINGKUP FITUR (MVP VS ROADMAP)', HeadingLevel.HEADING_1),
          createParagraph(
            'Tabel berikut mengunci batasan fungsional rilis pertama (MVP) dibandingkan dengan fitur yang dialokasikan untuk ekspansi tahap berikutnya:'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Modul / Fitur', { isHeader: true, widthPercent: 25 }),
                  createTableCell('Fungsi Spesifik', { isHeader: true, widthPercent: 45 }),
                  createTableCell('Rilis Target', { isHeader: true, widthPercent: 15 }),
                  createTableCell('Prioritas', { isHeader: true, widthPercent: 15 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Manajemen Meja (Table Map)', { bold: true }),
                  createTableCell('Visualisasi denah meja interaktif, status meja (Kosong/Hijau, Terisi/Merah, Billing/Kuning), alokasi nomor meja dan jumlah tamu (pax).'),
                  createTableCell('MVP v1.0', { color: COLOR_SUCCESS, bold: true }),
                  createTableCell('P0 (Must Have)', { color: 'DC2626', bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Point of Sale (Kasir)', { bold: true }),
                  createTableCell('Katalog menu grid cepat, varian & modifiers (level pedas, es), diskon promosi per-item / per-bill, split bill per tamu / per item, multi-payment (Cash, QRIS dinamis, EDC Debit/Kredit).'),
                  createTableCell('MVP v1.0', { color: COLOR_SUCCESS, bold: true }),
                  createTableCell('P0 (Must Have)', { color: 'DC2626', bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Cetak Struk & Tiket Dapur', { bold: true }),
                  createTableCell('Cetak struk kasir 80mm/58mm ESC/POS, auto-routing tiket pesanan ke printer dapur dan bar sesuai kategori item menu.'),
                  createTableCell('MVP v1.0', { color: COLOR_SUCCESS, bold: true }),
                  createTableCell('P0 (Must Have)', { color: 'DC2626', bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Deduksi Stok Resep (BOM)', { bold: true }),
                  createTableCell('Pemotongan saldo bahan baku otomatis secara real-time saat transaksi sukses dengan validasi saldo agar tidak terjadi minus stok.'),
                  createTableCell('MVP v1.0', { color: COLOR_SUCCESS, bold: true }),
                  createTableCell('P0 (Must Have)', { color: 'DC2626', bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Laporan Closing Kas (Z-Report)', { bold: true }),
                  createTableCell('Hitung modal awal kasir (float), total penerimaan tunai vs non-tunai, rekap diskon & void, hitung selisih kas fisik (over/short), dan cetak lembar Z-Report.'),
                  createTableCell('MVP v1.0', { color: COLOR_SUCCESS, bold: true }),
                  createTableCell('P0 (Must Have)', { color: 'DC2626', bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Kitchen Display System (KDS)', { bold: true }),
                  createTableCell('Layar tablet dapur digital dengan timer SLA countdown otomatis, indikator peringatan order terlambat, dan tombol bump bar pesanan selesai.'),
                  createTableCell('Phase 2', { color: COLOR_SECONDARY }),
                  createTableCell('P1 (High)', { color: COLOR_SECONDARY })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Manajemen Batch FEFO & Chiller', { bold: true }),
                  createTableCell('Pelacakan tanggal kadaluarsa bahan baku per batch penerimaan gudang dan sensor suhu chiller terintegrasi HACCP.'),
                  createTableCell('Phase 3', { color: COLOR_MUTED }),
                  createTableCell('P2 (Medium)', { color: COLOR_MUTED })
                ]
              })
            ]
          }),

          // CAPTURE 1: POS INTERFACE PREVIEW
          createHeading('3. MOCKUP ANTARMUKA POS KASIR (MVP STANDARD)', HeadingLevel.HEADING_1),
          createParagraph('Antarmuka kasir dirancang dengan prinsip ergonomic touch 48px, font kontras tinggi, dan akses cepat ke kategori menu.'),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 140, after: 140 },
            children: [
              new ImageRun({
                data: captures.pos,
                transformation: { width: 560, height: 326 },
                type: 'png'
              })
            ]
          }),

          // BAB 4: USER PERSONAS
          createHeading('4. PROFIL PENGGUNA (USER PERSONAS)', HeadingLevel.HEADING_1),
          createParagraph(
            'Analisis mendalam terhadap 5 aktor utama operasional restoran untuk memastikan rancangan alur antarmuka menjawab tantangan nyata di lapangan:'
          ),

          // Persona 1: Kasir
          createHeading('Persona 1: Kasir Restoran (Front of House)', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Atribut Persona', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Deskripsi Profil & Kebutuhan', { isHeader: true, widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Nama Tipikal & Peran', { bold: true }),
                  createTableCell('Siti Aminah (23 tahun) — Kasir Senior Shift Siang')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Tujuan Kerja (Goals)', { bold: true }),
                  createTableCell('Menyelesaikan pembayaran tamu secepat mungkin saat peak hours makan siang tanpa antrean panjang, dan memastikan uang fisik di laci kasir cocok 100% saat closing shift.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Keluhan Utama (Pain Points)', { bold: true }),
                  createTableCell('Sering terjadi salah ketik jumlah uang kembalian, tamu meminta split bill rumit saat antrean menumpuk, dan panik jika koneksi internet mendadak putus.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Solusi RestoSync', { bold: true, color: COLOR_SUCCESS }),
                  createTableCell('Tombol pecahan uang cepat (Rp 50rb, Rp 100rb, Pas), fitur 1-klik Split Bill otomatis, dan mode offline transparan tanpa lagging.')
                ]
              })
            ]
          }),

          // Persona 2: Waiter / Pramusaji
          createHeading('Persona 2: Waiter / Pramusaji', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Atribut Persona', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Deskripsi Profil & Kebutuhan', { isHeader: true, widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Nama Tipikal & Peran', { bold: true }),
                  createTableCell('Budi Santoso (21 tahun) — Waiter Area Lantai 1')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Tujuan Kerja (Goals)', { bold: true }),
                  createTableCell('Mencatat pesanan tamu di meja dengan akurat, menyampaikan pesanan ke dapur dalam hitungan detik tanpa harus bolak-balik fisik ke dapur.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Keluhan Utama (Pain Points)', { bold: true }),
                  createTableCell('Tulisan tangan pada kertas nota sering tidak terbaca oleh chef dapur, bahan habis baru diketahui setelah waiter selesai mencatat di depan tamu.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Solusi RestoSync', { bold: true, color: COLOR_SUCCESS }),
                  createTableCell('Auto-lock dan penanda visual "Habis / Out of Stock" langsung di katalog menu berdasarkan saldo riil gudang.')
                ]
              })
            ]
          }),

          // Persona 3: Kitchen Staff / Head Chef
          createHeading('Persona 3: Head Chef / Tim Dapur', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Atribut Persona', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Deskripsi Profil & Kebutuhan', { isHeader: true, widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Nama Tipikal & Peran', { bold: true }),
                  createTableCell('Chef Wayan (38 tahun) — Head Chef & Kitchen Manager')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Tujuan Kerja (Goals)', { bold: true }),
                  createTableCell('Menjaga standar rasa dan kecepatan saji (SLA saji < 15 menit), serta memastikan ketersediaan bahan baku protein dan saus.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Keluhan Utama (Pain Points)', { bold: true }),
                  createTableCell('Tiket kertas basah terkena minyak atau air, urutan masak kacau (tamu yang datang belakangan mendapat makanan lebih dulu).')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Solusi RestoSync', { bold: true, color: COLOR_SUCCESS }),
                  createTableCell('KDS Digital dengan urutan FIFO (First In First Out), kartu pesanan dengan timer warna (Hijau -> Kuning -> Merah berkedip saat melewati SLA).')
                ]
              })
            ]
          }),

          // Persona 4: Store Manager
          createHeading('Persona 4: Store Manager (Operasional)', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Atribut Persona', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Deskripsi Profil & Kebutuhan', { isHeader: true, widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Nama Tipikal & Peran', { bold: true }),
                  createTableCell('Doni Prasetyo (32 tahun) — Restaurant Operational Manager')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Tujuan Kerja (Goals)', { bold: true }),
                  createTableCell('Mengawasi seluruh shift berjalan mulus, menyetujui void / refund yang sah, mencegah kecurangan internal kasir, dan menerima laporan ringkas.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Keluhan Utama (Pain Points)', { bold: true }),
                  createTableCell('Harus dipanggil ke kasir berulang kali hanya untuk swipe kartu otorisasi void transaksi, proses audit inventori manual memakan waktu hingga larut malam.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Solusi RestoSync', { bold: true, color: COLOR_SUCCESS }),
                  createTableCell('PIN otorisasi supervisor berjenjang dengan audit trail tercatat di server, serta laporan rekonsiliasi kas otomatis X-Report & Z-Report.')
                ]
              })
            ]
          }),

          // Persona 5: Owner Restoran
          createHeading('Persona 5: Pemilik / Investor Restoran (Owner)', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Atribut Persona', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Deskripsi Profil & Kebutuhan', { isHeader: true, widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Nama Tipikal & Peran', { bold: true }),
                  createTableCell('Hendra Wijaya (45 tahun) — Pemilik Restoran Multi-Cabang')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Tujuan Kerja (Goals)', { bold: true }),
                  createTableCell('Memantau omset live dari smartphone secara real-time, mengetahui persentase HPP (Food Cost %) harian, dan mendeteksi anomali penjualan sedini mungkin.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Keluhan Utama (Pain Points)', { bold: true }),
                  createTableCell('Laporan keuangan baru selesai 3 hari setelah akhir bulan, tidak tahu cabang mana yang mengalami pemborosan bahan baku.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Solusi RestoSync', { bold: true, color: COLOR_SUCCESS }),
                  createTableCell('Executive BI Dashboard di browser/mobile dengan grafik live omset, perhitungan laba kotor instan, dan alarm otomatis jika HPP melebihi 35%.')
                ]
              })
            ]
          }),

          // BAB 5: USER JOURNEY MAP (END-TO-END DINING EXPERIENCE)
          createHeading('5. USER JOURNEY MAP (ALUR KERJA PELANGGAN & STAF)', HeadingLevel.HEADING_1),
          createParagraph(
            'Memetakan setiap touchpoint interaksi mulai dari kedatangan tamu hingga penyelesaian transaksi dan audit harian:'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Tahapan (Stage)', { isHeader: true, widthPercent: 18 }),
                  createTableCell('Aktivitas Tamu / Staf', { isHeader: true, widthPercent: 28 }),
                  createTableCell('Touchpoint Sistem', { isHeader: true, widthPercent: 26 }),
                  createTableCell('Indikator Sukses & Nilai', { isHeader: true, widthPercent: 28 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('1. Seating & Open Table', { bold: true }),
                  createTableCell('Tamu tiba di resto. Waiter menyapa dan memilih nomor meja kosong pada denah.'),
                  createTableCell('Peta Meja POS / Tablet Waiter (Ubah status Hijau -> Merah).'),
                  createTableCell('Alokasi meja < 10 detik, mencegah double booking meja.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('2. Order Taking & BOM Check', { bold: true }),
                  createTableCell('Tamu memesan menu. Waiter memasukkan item pesanan. Sistem memvalidasi saldo bahan baku.'),
                  createTableCell('Katalog Menu POS & Recipe Validator (Cek saldo ayam, beras, minyak goreng).'),
                  createTableCell('Mencegah pesanan diterima jika stok dapur kosong (0 komplain pesanan batal).')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('3. Kitchen Routing', { bold: true }),
                  createTableCell('Pesanan dikonfirmasi. Tiket pesanan terkirim otomatis ke printer dapur & KDS.'),
                  createTableCell('Auto-Spooler ESC/POS LAN & WebSocket real-time KDS.'),
                  createTableCell('Waktu transmisi order ke dapur < 1.5 detik tanpa pelari nota kertas.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('4. Billing & Checkout', { bold: true }),
                  createTableCell('Tamu meminta tagihan. Kasir membuka bill meja, memilih metode pembayaran (Cash/QRIS/EDC).'),
                  createTableCell('Modul Kasir POS, Integrasi EDC & Dynamic QRIS Generator.'),
                  createTableCell('Durasi checkout kasir < 20 detik, cetak struk rapi 80mm.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('5. Closing & Audit', { bold: true }),
                  createTableCell('Shift berakhir. Kasir menghitung uang fisik di laci dan mencetak lembar Z-Report.'),
                  createTableCell('Modul Closing Shift POS, Rekonsiliasi Kas, & Kirim Summary ke Owner.'),
                  createTableCell('Selisih kas terdeteksi transparan, waktu closing pangkas 75%.')
                ]
              })
            ]
          }),

          // BAB 6: INSTRUMEN SURVEI LAPANGAN & EVALUASI KEPUASAN (SURVEY QUESTIONNAIRE)
          createHeading('6. INSTRUMEN SURVEI LAPANGAN & EVALUASI KEPUASAN', HeadingLevel.HEADING_1),
          createParagraph(
            'Instrumen kuesioner resmi berstandar industri untuk mengukur kesiapan operasional sebelum go-live (Pre-Deployment) dan kepuasan pengguna setelah implementasi (Post-Implementation SUS):'
          ),

          createHeading('A. Survei Diagnostik Kesiapan Restoran (Pre-Implementation Survey)', HeadingLevel.HEADING_2),
          createParagraph('Daftar pertanyaan yang wajib diisi oleh Store Manager / PIC Operasional sebelum instalasi dimulai:'),
          createBulletItem('Q1. Volume Transaksi: ', 'Berapa rata-rata jumlah transaksi (struk) harian pada hari kerja (weekday) vs akhir pekan (weekend)? [ _____ struk/hari ]'),
          createBulletItem('Q2. Titik Hambatan (Bottleneck): ', 'Di mana lokasi antrean terlama saat jam sibuk? (Pilihan: [ ] Antrean kasir bayar, [ ] Dapur lama masak, [ ] Waiter lama catat order, [ ] Salah antar meja).'),
          createBulletItem('Q3. Infrastruktur Jaringan: ', 'Apakah restoran memiliki koneksi internet kabel (Indihome/Biznet/FirstMedia) dengan router Wi-Fi terpisah untuk staf kasir? [ Ya / Tidak, Kecepatan: _____ Mbps ].'),
          createBulletItem('Q4. Riwayat Selisih Kasir: ', 'Dalam 30 hari terakhir, berapa rata-rata nilai selisih uang kas fisik kasir per shift? [ Rp _____ / shift ].'),
          createBulletItem('Q5. Manajemen Resep: ', 'Apakah restoran sudah memiliki daftar resep baku (BOM - Bill of Materials) terukur per porsi untuk menu terlaris? [ Ya lengkap / Sebagian / Belum ada ].'),

          createHeading('B. Kuesioner Kepuasan Pengguna Berstandar SUS (System Usability Scale)', HeadingLevel.HEADING_2),
          createParagraph('Kuesioner evaluasi 30 hari pasca go-live dengan skala Likert 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju):'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('No', { isHeader: true, widthPercent: 8 }),
                  createTableCell('Pernyataan Evaluasi Usability (Standar ISO 9241-11)', { isHeader: true, widthPercent: 62 }),
                  createTableCell('Target Skor', { isHeader: true, widthPercent: 30 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('1', { align: AlignmentType.CENTER }),
                  createTableCell('Saya merasa antarmuka kasir RestoSync sangat mudah dipelajari oleh staf baru dalam waktu kurang dari 30 menit.'),
                  createTableCell('Skor >= 4.5 / 5.0', { color: COLOR_SUCCESS, bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('2', { align: AlignmentType.CENTER }),
                  createTableCell('Sistem bekerja sangat cepat dan tidak mengalami lag saat jam sibuk restoran berlangsung.'),
                  createTableCell('Skor >= 4.7 / 5.0', { color: COLOR_SUCCESS, bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('3', { align: AlignmentType.CENTER }),
                  createTableCell('Fitur peringatan stok bahan habis berhasil mencegah dapur menerima pesanan yang tidak bisa dimasak.'),
                  createTableCell('Skor >= 4.8 / 5.0', { color: COLOR_SUCCESS, bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('4', { align: AlignmentType.CENTER }),
                  createTableCell('Laporan harian Z-Report memudahkan saya menutup kasir tanpa perlu menghitung nota fisik secara manual.'),
                  createTableCell('Skor >= 4.9 / 5.0', { color: COLOR_SUCCESS, bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('5', { align: AlignmentType.CENTER }),
                  createTableCell('Secara keseluruhan, saya merekomendasikan sistem ini untuk operasional cabang restoran lain (Net Promoter Score).'),
                  createTableCell('NPS > +65 (Excellent)', { color: COLOR_SUCCESS, bold: true })
                ]
              })
            ]
          }),

          // BAB 7: TANDA TANGAN PERSETUJUAN (SIGN-OFF)
          createHeading('7. LEMBAR PENGESAHAN DOKUMEN PERENCANAAN (SIGN-OFF)', HeadingLevel.HEADING_1),
          createParagraph(
            'Dengan menandatangani dokumen ini, seluruh pemangku kepentingan menyetujui batasan ruang lingkup produk (PRD), profil pengguna, alur proses, dan target rilis MVP v1.0 yang dijadwalkan.'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Perwakilan Restoran / Klien', { isHeader: true, widthPercent: 50 }),
                  createTableCell('Tim Pengembang / Solution Architect', { isHeader: true, widthPercent: 50 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell(`Nama: ${restoTitle}\nPIC: ${picTitle}\nJabatan: Pemilik / GM Operasional\nTanggal: ____________________\n\n\n\nTanda Tangan: ________________________`),
                  createTableCell(`Nama: GastroStock Engineering Team\nLead: Lead Product Manager / Architect\nJabatan: Principal Solution Architect\nTanggal: ____________________\n\n\n\nTanda Tangan: ________________________`)
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  return await Packer.toBlob(doc);
}
