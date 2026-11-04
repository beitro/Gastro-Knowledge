// Enterprise-Grade Business Requirements Document (BRD) Microsoft Word (.docx) Generator
// Incorporates high-resolution system captures, table of contents, professional styling, tables, and sign-off sheets

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
  ShadingType,
  LevelFormat
} from 'docx';
import { generateAllSystemCaptures, SystemCaptures } from './brdCaptureGenerator';

// Styling Constants for Enterprise Corporate Document
const COLOR_PRIMARY = '0F2942';   // Deep Navy Blue
const COLOR_SECONDARY = '0284C7'; // Cyan / Sky Blue
const COLOR_ACCENT = 'D97706';    // Amber Gold
const COLOR_TEXT_DARK = '1E293B';  // Slate Dark
const COLOR_MUTED = '64748B';      // Slate Muted
const COLOR_BG_LIGHT = 'F8FAFC';   // Slate Light Background
const COLOR_BORDER = 'CBD5E1';     // Slate Border Light

// Table Cell Border Style
const cellBorderStandard = {
  top: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  left: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  right: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER }
};

// Helper to create styled paragraph
function createParagraph(
  text: string,
  options: {
    bold?: boolean;
    italic?: boolean;
    size?: number; // half-points: 24 = 12pt
    color?: string;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    spaceBefore?: number;
    spaceAfter?: number;
  } = {}
): Paragraph {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: {
      before: options.spaceBefore !== undefined ? options.spaceBefore : 120,
      after: options.spaceAfter !== undefined ? options.spaceAfter : 120,
      line: 276 // 1.15 line spacing
    },
    children: [
      new TextRun({
        text,
        bold: options.bold || false,
        italics: options.italic || false,
        size: options.size || 22, // 11pt
        color: options.color || COLOR_TEXT_DARK,
        font: 'Calibri'
      })
    ]
  });
}

// Helper to create Section Heading 1
function createHeading1(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32, // 16pt
        color: COLOR_PRIMARY,
        font: 'Calibri'
      })
    ]
  });
}

// Helper to create Section Heading 2
function createHeading2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26, // 13pt
        color: COLOR_SECONDARY,
        font: 'Calibri'
      })
    ]
  });
}

// Helper to create Bullet Point
function createBullet(text: string, boldPrefix?: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60 },
    children: [
      ...(boldPrefix
        ? [
            new TextRun({
              text: boldPrefix + ' ',
              bold: true,
              size: 21,
              color: COLOR_TEXT_DARK,
              font: 'Calibri'
            })
          ]
        : []),
      new TextRun({
        text,
        size: 21,
        color: COLOR_TEXT_DARK,
        font: 'Calibri'
      })
    ]
  });
}

// Helper to create a Table Cell with padding and text
function createTableCell(
  text: string,
  options: {
    bold?: boolean;
    isHeader?: boolean;
    fillColor?: string;
    widthPercent?: number;
    color?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  } = {}
): TableCell {
  return new TableCell({
    borders: cellBorderStandard,
    shading: {
      type: ShadingType.CLEAR,
      fill: options.isHeader ? COLOR_PRIMARY : options.fillColor || (options.isHeader ? COLOR_PRIMARY : 'FFFFFF')
    },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    children: [
      new Paragraph({
        alignment: options.align || AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: options.bold || options.isHeader || false,
            size: options.isHeader ? 20 : 19,
            color: options.isHeader ? 'FFFFFF' : options.color || COLOR_TEXT_DARK,
            font: 'Calibri'
          })
        ]
      })
    ]
  });
}

// Helper to create Image container with caption
function createImageParagraph(
  imageData: Uint8Array,
  captionText: string,
  width: number = 580,
  height: number = 320
): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new ImageRun({
          data: imageData,
          transformation: {
            width,
            height
          },
          type: 'png'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 240 },
      children: [
        new TextRun({
          text: captionText,
          italics: true,
          bold: true,
          size: 18, // 9pt
          color: COLOR_MUTED,
          font: 'Calibri'
        })
      ]
    })
  ];
}

// Main Export Generator Function
export async function generateBrdWordDocumentBlob(): Promise<Blob> {
  // 1. Generate all system captures as high-res PNG buffers
  const captures: SystemCaptures = await generateAllSystemCaptures();

  // 2. Build Document Structure
  const doc = new Document({
    creator: 'RestoSync Solution Engineering Team',
    title: 'Business Requirements Document (BRD) - RestoSync Real-Time Inventory Engine',
    description: 'Dokumen Spesifikasi Kebutuhan Bisnis & Arsitektur Sistem Terintegrasi Restoran',
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22,
            color: COLOR_TEXT_DARK
          }
        }
      }
    },
    sections: [
      // ==========================================
      // SECTION 1: COVER PAGE & DOCUMENT CONTROL
      // ==========================================
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 0, after: 400 },
            children: [
              new TextRun({
                text: 'DOKUMEN KONTRAK & ARSITEKTUR BISNIS • CONFIDENTIAL',
                bold: true,
                size: 18,
                color: COLOR_MUTED,
                font: 'Calibri'
              })
            ]
          }),

          // Cover Title Box
          new Paragraph({
            spacing: { before: 600, after: 100 },
            children: [
              new TextRun({
                text: 'BUSINESS REQUIREMENTS DOCUMENT',
                bold: true,
                size: 44, // 22pt
                color: COLOR_PRIMARY,
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 300 },
            children: [
              new TextRun({
                text: '(BRD - SPESIFIKASI KEBUTUHAN BISNIS & TEKNIS)',
                bold: true,
                size: 28, // 14pt
                color: COLOR_SECONDARY,
                font: 'Calibri'
              })
            ]
          }),

          new Paragraph({
            spacing: { before: 200, after: 600 },
            children: [
              new TextRun({
                text: 'SISTEM MANAJEMEN INVENTARIS BAHAN BAKU REAL-TIME & TERINTEGRASI RESTORAN (RESTOSYNC)',
                bold: true,
                size: 26,
                color: COLOR_ACCENT,
                font: 'Calibri'
              }),
              new TextRun({
                text: '\nIntegrasi Multi-Interface: Kasir (POS) ↔ Dapur (KDS) ↔ Stok & Gudang (WMS) ↔ Dashboard Monitoring',
                size: 22,
                color: COLOR_TEXT_DARK,
                font: 'Calibri'
              })
            ]
          }),

          // Document Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Nomor Dokumen', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('BRD-RESTOSYNC-2026-V1.0', { widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Nama Proyek', { bold: true, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('RestoSync Multi-Interface Real-Time Inventory & Procurement Platform')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Target Klien / Industri', { bold: true, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('Bisnis Restoran F&B, Cafe Chains, & Cloud Kitchen')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Penyusun Dokumen', { bold: true, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('Lead Solution Architect & Senior Product Manager')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Status Dokumen', { bold: true, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('APPROVED FOR CLIENT SIGN-OFF (SIAP TANDATANGAN)', { bold: true, color: '15803D' })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Tanggal Efektif', { bold: true, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('14 Oktober 2026')
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 500, after: 150 }, children: [] }),

          // Version Control Table
          createParagraph('Riwayat Perubahan Dokumen (Version Control):', { bold: true, size: 22 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Versi', { isHeader: true, widthPercent: 12 }),
                  createTableCell('Tanggal', { isHeader: true, widthPercent: 18 }),
                  createTableCell('Penyusun', { isHeader: true, widthPercent: 22 }),
                  createTableCell('Deskripsi Perubahan', { isHeader: true, widthPercent: 48 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('v0.1', { align: AlignmentType.CENTER }),
                  createTableCell('01 Okt 2026'),
                  createTableCell('Solution Team'),
                  createTableCell('Draft awal kerangka kebutuhan bisnis & integrasi POS-Gudang.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('v0.5', { align: AlignmentType.CENTER }),
                  createTableCell('07 Okt 2026'),
                  createTableCell('System Architect'),
                  createTableCell('Penambahan modul KDS Dapur, audio lonceng, dan manajemen waste.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('v1.0', { align: AlignmentType.CENTER, bold: true }),
                  createTableCell('14 Okt 2026', { bold: true }),
                  createTableCell('Lead PM & Architect', { bold: true }),
                  createTableCell('Final Approved: Swimlane antar sistem, penanganan stok defisit, dan capture layar lengkap.', { bold: true })
                ]
              })
            ]
          }),

          // Page Break to Content
          new Paragraph({
            children: [new TextRun({ text: '', break: 1 })],
            pageBreakBefore: true
          })
        ]
      },

      // ==========================================
      // SECTION 2: DAFTAR ISI & ISI UTAMA DOKUMEN
      // ==========================================
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
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: 'BRD: Sistem Inventaris Real-Time Restoran (RestoSync) • Rahasia Klien',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Calibri'
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
                  new TextRun({
                    text: '© 2026 RestoSync Platform. Hak Cipta Dilindungi Undang-Undang.',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: '   |   Halaman ',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    bold: true,
                    color: COLOR_PRIMARY,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: ' dari ',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    bold: true,
                    color: COLOR_PRIMARY,
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        },
        children: [
          // DAFTAR ISI
          createHeading1('DAFTAR ISI DOKUMEN BRD'),
          new Paragraph({
            spacing: { before: 60, after: 200 },
            children: [
              new TextRun({
                text: 'Dokumen ini disusun secara terstruktur sesuai format standar enterprise software engineering untuk kemudahan peninjauan pihak manajemen restoran, operasional, dan tim teknologi informasi klien.',
                italics: true,
                size: 20,
                color: COLOR_MUTED
              })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('No', { isHeader: true, widthPercent: 8 }),
                  createTableCell('Bab & Bagian Dokumen', { isHeader: true, widthPercent: 74 }),
                  createTableCell('Topik Utama', { isHeader: true, widthPercent: 18 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('1.', { bold: true }),
                  createTableCell('Ringkasan Eksekutif (Executive Summary)', { bold: true }),
                  createTableCell('Value Proposition')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('2.', { bold: true }),
                  createTableCell('Latar Belakang & Identifikasi Masalah Bisnis Restoran', { bold: true }),
                  createTableCell('Pain Points & Risk')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('3.', { bold: true }),
                  createTableCell('Tujuan Proyek & Parameter Keberhasilan (KPIs)', { bold: true }),
                  createTableCell('Metrik Target')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('4.', { bold: true }),
                  createTableCell('Ruang Lingkup Proyek (In-Scope vs Out-of-Scope)', { bold: true }),
                  createTableCell('Batasan Pekerjaan')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('5.', { bold: true }),
                  createTableCell('Analisis Pemangku Kepentingan (Stakeholders & Persona)', { bold: true }),
                  createTableCell('Peran & User')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('6.', { bold: true }),
                  createTableCell('Diagram Alur & Arsitektur Swimlane Antar Sistem (Capture 1)', { bold: true }),
                  createTableCell('Cross-System Map')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('7.', { bold: true }),
                  createTableCell('Spesifikasi Kebutuhan Fungsional per Modul & UI Captures:', { bold: true }),
                  createTableCell('Detail Fungsional')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell(''),
                  createTableCell('• 7.1. Modul Interface Kasir (Point of Sale / POS) [Capture 2]'),
                  createTableCell('Pemesanan & BOM')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell(''),
                  createTableCell('• 7.2. Penanganan Kasus Stok Defisit (HTTP 409 & Atomic Rollback) [Capture 3]'),
                  createTableCell('Proteksi ACID')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell(''),
                  createTableCell('• 7.3. Modul Interface Dapur (Kitchen Display System / KDS) [Capture 4]'),
                  createTableCell('Tiket & SLA Timer')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell(''),
                  createTableCell('• 7.4. Modul Manajemen Waste Dapur & Kerugian Bahan Baku'),
                  createTableCell('Food Loss Control')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell(''),
                  createTableCell('• 7.5. Modul Interface Stok & Gudang (Goods In & FEFO) [Capture 5]'),
                  createTableCell('WMS & Opname')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell(''),
                  createTableCell('• 7.6. Modul Dashboard Monitoring & Executive BI Real-time [Capture 6]'),
                  createTableCell('KPI & Auto PO')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('8.', { bold: true }),
                  createTableCell('Arsitektur Integrasi & Spesifikasi API Antar Sistem', { bold: true }),
                  createTableCell('REST & WebSocket')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('9.', { bold: true }),
                  createTableCell('Spesifikasi Database, Integritas Relasional, & FEFO Ledger', { bold: true }),
                  createTableCell('Skema Data')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('10.', { bold: true }),
                  createTableCell('Kebutuhan Non-Fungsional (Performance, Security, Concurrency)', { bold: true }),
                  createTableCell('SLA & Uptime')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('11.', { bold: true }),
                  createTableCell('Matriks RACI & Kriteria Penerimaan Pengguna (UAT Acceptance)', { bold: true }),
                  createTableCell('Quality Sign-off')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('12.', { bold: true }),
                  createTableCell('Lembar Pengesahan & Tanda Tangan Klien (Sign-off Sheet)', { bold: true }),
                  createTableCell('Legal Approval')
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 300 }, children: [] }),

          // ==========================================
          // BAB 1: RINGKASAN EKSEKUTIF
          // ==========================================
          createHeading1('1. RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)'),
          createParagraph(
            'Dokumen Kebutuhan Bisnis (Business Requirements Document / BRD) ini merumuskan secara komprehensif rancang-bangun platform RestoSync. RestoSync adalah solusi Enterprise Resource Planning (ERP) terintegrasi berbasis real-time yang dirancang khusus untuk memecahkan tantangan kritis dalam industri Food & Beverage (F&B): ketidaksinkronan antara penjualan di kasir, produksi di dapur, mutasi stok bahan baku fisik di gudang, dan visibilitas finansial pada dashboard manajemen.'
          ),
          createParagraph(
            'Melalui integrasi 4 antarmuka sistem utama secara simultan (Interface Kasir POS, Interface Dapur KDS, Interface Stok & Gudang, dan Dashboard Monitoring), RestoSync menjamin penghapusan celah operasional (zero blind spots), penerapan kalkulasi resep Bill of Materials (BOM) otomatis, serta pemotongan stok berakurasi mutlak (atomic transaction).'
          ),
          createBullet('Menghilangkan over-selling menu saat bahan baku di dapur telah habis melalui mekanisme pre-check BOM atomik.', '1. Eliminasi Penjualan Buta:'),
          createBullet('Mengotomatisasi pesanan kasir langsung ke layar stasiun koki dan barista tanpa kertas tiket manual.', '2. Otomasi Antrian Dapur:'),
          createBullet('Menggunakan metode FEFO (First-Expired, First-Out) sehingga bahan dengan kedaluwarsa terdekat diprioritaskan.', '3. Penurunan Food Waste:'),
          createBullet('Menyediakan angka omzet, Harga Pokok Penjualan (HPP / COGS), dan Food Cost % aktual dengan latensi di bawah 150 milidetik.', '4. Visibilitas Finansial Real-Time:'),

          // ==========================================
          // BAB 2: LATAR BELAKANG & IDENTIFIKASI MASALAH
          // ==========================================
          createHeading1('2. LATAR BELAKANG & IDENTIFIKASI MASALAH BISNIS'),
          createParagraph(
            'Bisnis restoran modern kerap mengalami kebocoran biaya (cost leakage) hingga 15% - 25% dari total omzet akibat manajemen inventaris yang dikelola secara parsial, terpisah-pisah (siloed), atau masih bertumpu pada pencatatan manual di buku opname. Berdasarkan studi operasional, berikut adalah titik masalah utama (pain points) yang dihadapi:'
          ),
          createBullet('Kasir menerima pesanan menu daging atau ayam dari tamu, namun koki di dapur baru mengetahui bahan baku tersebut telah habis setelah tamu menunggu 15 menit. Hal ini menimbulkan pembatalan sepihak dan merusak reputasi restoran.', 'a. Masalah Over-Selling & Stok Kosong:'),
          createBullet('Kasir hanya mencatat menu jadi (misal: "Nasi Goreng Wagyu"), tetapi tidak ada sistem yang otomatis mendekomposisi dan memotong saldo bahan mentah (180g beras, 80g daging wagyu, 1 butir telur) detik itu juga.', 'b. Tiadanya Otomasi BOM Resep:'),
          createBullet('Bahan yang gosong saat digoreng, basi di chiller, atau tumpah oleh pramusaji seringkali tidak dicatat, sehingga terjadi selisih (varians) misterius yang sangat besar saat stock opname akhir bulan.', 'c. Kebocoran Bahan Rusak (Waste Dapur):'),
          createBullet('Owner dan manajer baru mengetahui margin keuntungan atau membengkaknya food cost di akhir bulan setelah pembukuan akuntansi selesai, terlambat untuk mengambil tindakan perbaikan biaya.', 'd. Blind Spot Biaya (Keterlambatan HPP):'),

          // ==========================================
          // BAB 3: TUJUAN PROYEK & INDIKATOR KEBERHASILAN (KPI)
          // ==========================================
          createHeading1('3. TUJUAN PROYEK & PARAMETER KEBERHASILAN (KPI)'),
          createParagraph('Implementasi platform RestoSync memiliki target pencapaian terukur yang dituangkan dalam Key Performance Indicators (KPIs) berikut:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Parameter Target', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Kondisi Eksisting (Sebelum)', { isHeader: true, widthPercent: 35 }),
                  createTableCell('Target RestoSync (Sesudah)', { isHeader: true, widthPercent: 35 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Kejadian Over-Selling Menu', { bold: true }),
                  createTableCell('5 - 12 insiden per hari per outlet'),
                  createTableCell('0 insiden (Otomatis dicegah & Sold-Out)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Akurasi Saldo Bahan Baku', { bold: true }),
                  createTableCell('75% - 82% (Varians tinggi)'),
                  createTableCell('≥ 99.2% (Tercatat atomik setiap detik)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Persentase Food Waste Dapur', { bold: true }),
                  createTableCell('6.5% - 9.0% dari total bahan'),
                  createTableCell('≤ 1.5% (Terkontrol via FEFO & log waste)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Waktu Tunggu Pesanan Masuk Dapur', { bold: true }),
                  createTableCell('2 - 5 menit (Antar struk kertas fisik)'),
                  createTableCell('< 150 milidetik (Push WebSocket KDS)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Perhitungan HPP & Food Cost %', { bold: true }),
                  createTableCell('H+30 hari (Manual bulanan)'),
                  createTableCell('Real-Time (Setiap transaksi kasir selesai)')
                ]
              })
            ]
          }),

          // ==========================================
          // BAB 4: RUANG LINGKUP PROYEK
          // ==========================================
          createHeading1('4. RUANG LINGKUP PROYEK (SCOPE OF WORK)'),
          createHeading2('4.1. Dalam Ruang Lingkup (In-Scope)'),
          createBullet('Pengembangan Interface Kasir (POS) multi-channel (Dine-in, Takeaway, Online Delivery) dengan BOM Recipe Calculator bawaan.', '1. Modul POS:'),
          createBullet('Pengembangan Kitchen Display System (KDS) stasiun Koki Hot Kitchen & Barista Minuman lengkap dengan lonceng chime audio dan SLA stopwatch.', '2. Modul KDS Dapur:'),
          createBullet('Modul pelaporan bahan rusak, gosong, basi, dan kedaluwarsa langsung dari layar sentuh dapur koki.', '3. Modul Waste Log:'),
          createBullet('Penerimaan barang dari supplier (Goods In), pencatatan nomor batch, expired date, alokasi FEFO, dan rekonsiliasi stock opname fisik.', '4. Modul Gudang & WMS:'),
          createBullet('Dashboard eksekutif live stream dengan metrik omzet, HPP berjalan, food cost ratio, dan auto-draft Purchase Order (PO).', '5. Modul Executive BI:'),
          createBullet('API Gateway RESTful dan WebSocket Event Bus untuk sinkronisasi sub-150ms dengan ACID transaction guarantees.', '6. Arsitektur Komunikasi:'),

          createHeading2('4.2. Luar Ruang Lingkup (Out-of-Scope)'),
          createBullet('Sistem penggajian karyawan restoran (Payroll) dan manajemen absensi biometrik HRD.', '• Non-HRD:'),
          createBullet('Perangkat keras fisik (Hardware POS, tablet koki, barcode scanner) disediakan mandiri oleh klien.', '• Pengadaan Hardware:'),

          // ==========================================
          // BAB 5: ANALISIS PEMANGKU KEPENTINGAN
          // ==========================================
          createHeading1('5. ANALISIS PEMANGKU KEPENTINGAN (STAKEHOLDERS)'),
          createParagraph('Sistem ini melayani 4 persona pengguna utama dengan wewenang dan antarmuka kerja yang berbeda:'),
          createBullet('Menginput pesanan pelanggan, memeriksa rekomendasi ketersediaan menu, menerima pembayaran multi-metode (QRIS, Kartu, Cash), dan mencetak bill resmi.', '1. Kasir & Pramusaji (Front of House):'),
          createBullet('Melihat antrian piring pesanan, mendengar lonceng tiket masuk, menyalakan timer memasak, menekan panggil runner saat matang, dan mencatat bahan rusak.', '2. Koki Kepala & Barista (Back of House):'),
          createBullet('Menerima kiriman bahan dari truk supplier, melakukan QC suhu dingin (cold chain), mendaftarkan batch FEFO, dan menghitung stok fisik rak.', '3. Petugas Gudang & Purchasing (Inventory Staff):'),
          createBullet('Memantau omzet toko harian, mengevaluasi food cost % terhadap standar budget, menyetujui draf PO darurat, dan mengaudit buku besar transaksi.', '4. Manajer Operasional & Pemilik Restoran (Management):'),

          // ==========================================
          // BAB 6: DIAGRAM ARSITEKTUR SWIMLANE ANTAR SISTEM
          // ==========================================
          createHeading1('6. DIAGRAM ALUR & ARSITEKTUR SWIMLANE ANTAR SISTEM'),
          createParagraph(
            'Arsitektur alur kerja RestoSync disusun dalam bentuk Swimlane Process Map antar 4 antarmuka sistem mandiri. Setiap jalur (lane) mewakili satu sistem antarmuka operasional tanpa menyatukan backend internal, memperlihatkan aliran payload API dan sinyal event WebSocket secara transparan:'
          ),

          // EMBED CAPTURE 1: SWIMLANE
          ...createImageParagraph(
            captures.swimlane,
            'Gambar 6.1: Diagram Swimlane Integrasi Alur Proses Antar 4 Sistem Antarmuka Restoran (RestoSync v1.0)',
            580,
            338
          ),

          createParagraph(
            'Penjelasan Alur Komunikasi Antar Jalur (Cross-Lane Data Flow):'
          ),
          createBullet('Kasir memilih menu yang dipesan tamu (misal: 2 porsi Nasi Goreng Wagyu). Sebelum kasir menagih pembayaran, POS secara otomatis menembakkan request pengecekan kuota bahan ke Interface Stok & Gudang.', 'Jalur 1 ke Jalur 3 (Validasi BOM):'),
          createBullet('Interface Stok & Gudang memverifikasi saldo di rak database. Jika cukup, sistem gudang mengunci kuota bahan sementara dan mengirimkan status hijau ke POS.', 'Jalur 3 ke Jalur 1 (Status Persediaan):'),
          createBullet('Tamu membayar pesanan. Begitu transaksi kasir terbayar lunas, POS memancarkan sinyal digital instan ke monitor dapur. Stasiun koki langsung berbunyi lonceng "Ting-Ting!" dan tiket muncul di layar KDS.', 'Jalur 1 ke Jalur 2 (Push Tiket Dapur):'),
          createBullet('Interface Stok & Gudang mengomit pemotongan stok riil secara permanen (OUT_SALE) berbasis metode FIFO/FEFO.', 'Jalur 1 ke Jalur 3 (Komitmen Stok):'),
          createBullet('Koki menekan tombol "Mulai Masak" (SLA timer 12 menit berjalan). Saat hidangan matang, koki menekan "Selesai Saji" yang memanggil runner untuk mengantar piring ke meja tamu.', 'Aktivitas Mandiri Jalur 2 (KDS):'),
          createBullet('Seluruh data penjualan, perubahan saldo bahan, dan biaya HPP langsung dialirkan ke Dashboard Monitoring detik itu juga untuk memperbarui grafik omzet dan margin kotor.', 'Jalur 1, 2, & 3 ke Jalur 4 (Sinkronisasi BI):'),

          // ==========================================
          // BAB 7: SPESIFIKASI KEBUTUHAN FUNGSIONAL & UI CAPTURES
          // ==========================================
          createHeading1('7. SPESIFIKASI KEBUTUHAN FUNGSIONAL PER MODUL & CAPTURES'),
          createParagraph(
            'Bagian ini memaparkan rincian kebutuhan fungsional dari masing-masing modul sistem yang disertai tangkapan layar antarmuka (system UI captures) yang telah siap pakai.'
          ),

          // SUB-BAB 7.1: POS
          createHeading2('7.1. Modul Interface Kasir (Point of Sale / POS)'),
          createParagraph(
            'Modul Interface Kasir bertindak sebagai gerbang terdepan (Front of House) penerimaan transaksi tamu restoran. Modul ini dilengkapi dengan kalkulator Recipe Bill of Materials (BOM) otomatis yang langsung menghitung gramatur bahan mentah saat menu dipilih.'
          ),

          // EMBED CAPTURE 2: POS
          ...createImageParagraph(
            captures.pos,
            'Gambar 7.1: Interface Kasir (POS) RestoSync - Katalog Menu, Panel Resep BOM Otomatis, & Tombol Checkout Atomik',
            580,
            338
          ),

          createBullet('Dukungan pemilihan pesanan berdasarkan meja (Dine-in), bungkusan bawa pulang (Takeaway), maupun kurir makanan online.', '• Fitur Meja & Tipe Order:'),
          createBullet('Setiap menu memiliki tautan resep ke master bahan mentah (contoh: 1 porsi Wagyu Royale = 180g beras, 80g daging wagyu, 1 butir telur).', '• Resep BOM Otomatis:'),
          createBullet('Kasir dapat melihat ringkasan bahan baku yang akan terpotong sebelum menyelesaikan transaksi pada panel bill.', '• Panel Transparansi Resep:'),

          // SUB-BAB 7.2: KASUS DEFISIT STOK (HTTP 409 & ROLLBACK)
          createHeading2('7.2. Penanganan Kasus: Stok Bahan Baku Tidak Cukup (Out of Stock / Defisit)'),
          createParagraph(
            'Salah satu keunggulan proteksi integritas RestoSync adalah penanganan kasus defisit bahan baku. Jika pelanggan memesan menu sementara salah satu bahan mentah pada resep tidak mencukupi, sistem menolak pemotongan sepihak dan melindungi saldo gudang secara penuh.'
          ),

          // EMBED CAPTURE 3: DEFISIT MODAL
          ...createImageParagraph(
            captures.insufficientStock,
            'Gambar 7.2: Dialog Peringatan HTTP 409 Conflict - Proteksi Rollback Database ACID & Rekomendasi Menu Pengganti',
            580,
            336
          ),

          createParagraph('Rangkaian Protokol Penanganan Kasus Stok Defisit:'),
          createBullet('Saat pesanan divalidasi, sistem mendeteksi bahwa saldo Daging Wagyu tersisa 50g, sedangkan pesanan membutuhkan 160g (defisit 110g).', '1. Deteksi Defisit Bahan:'),
          createBullet('Perintah ROLLBACK TRANSACTION dijalankan. Reservasi bahan lain (beras dan telur) yang sebelumnya cukup otomatis dibatalkan serentak. Tidak ada bahan yang terpotong 1 gram pun.', '2. Pembatalan Atomik (ACID Rollback):'),
          createBullet('Layar kasir memunculkan pop-up modal merah besar: "HTTP 409 Conflict: Stok Bahan Baku Tidak Cukup". Tombol menu bersangkutan otomatis dikunci (Sold-Out) agar kasir atau tamu lain tidak memesan lagi.', '3. Peringatan Kasir & Penguncian Menu:'),
          createBullet('Layar kasir menyediakan tombol 1-klik untuk merekomendasikan menu pengganti kepada tamu (misal: "Ganti ke Nasi Goreng Ayam Suwir" yang stoknya melimpah).', '4. Solusi Menu Alternatif:'),
          createBullet('Sistem langsung menembakkan sinyal peringatan ke Interface Gudang dan Dashboard untuk membuka safety stock atau menerbitkan draf Purchase Order darurat.', '5. Sinyal Restock Darurat:'),

          // SUB-BAB 7.3: KDS DAPUR
          createHeading2('7.3. Modul Interface Dapur (Kitchen Display System / KDS)'),
          createParagraph(
            'Modul KDS menggantikan printer kertas fisik dengan tablet layar sentuh interaktif berlatar belakang kontras tinggi yang diletakkan di setiap stasiun memasak koki dan barista.'
          ),

          // EMBED CAPTURE 4: KDS
          ...createImageParagraph(
            captures.kds,
            'Gambar 7.3: Interface Dapur (KDS) - Multi-Station Hot Kitchen & Barista, SLA Cooking Timer, & Audio Chime Koki',
            580,
            338
          ),

          createBullet('Begitu kasir menyelesaikan pembayaran, tablet dapur berbunyi lonceng digital "Ting-Ting!" secara otomatis untuk menarik atensi koki.', '• Notifikasi Audio Chime:'),
          createBullet('Pesanan makanan (Wagyu, Ayam) otomatis masuk ke layar Koki Hot Kitchen, sedangkan pesanan minuman (Kopi, Matcha) masuk ke layar Barista secara independen.', '• Pemisahan Stasiun Memasak:'),
          createBullet('Stopwatch otomatis menghitung waktu memasak sejak koki menekan "Mulai Masak" dengan target penyajian di bawah 12 menit.', '• SLA Stopwatch Timer:'),
          createBullet('Saat koki menekan "Selesai Saji", sistem mengirimkan notifikasi getar ke pager runner untuk segera mengantarkan piring panas ke meja tamu.', '• Panggilan Runner Otomatis:'),

          // SUB-BAB 7.4: WASTE LOG
          createHeading2('7.4. Modul Manajemen Waste Dapur (Bahan Rusak & Tumpah)'),
          createParagraph(
            'Untuk mengontrol food loss dan spoilage, koki dapat mencatat insiden bahan rusak langsung dari tombol "Laporkan Waste" di layar KDS dapur:'
          ),
          createBullet('Koki memilih bahan baku (contoh: 2 butir telur pecah, atau 200g daging ayam gosong terbakar wajan).', 'a. Input Kejadian di Dapur:'),
          createBullet('Sistem langsung memotong stok fisik dengan mutasi khusus bertipe OUT_WASTE sehingga saldo gudang tetap akurat.', 'b. Pemotongan Stok Spoilage:'),
          createBullet('Sistem secara otomatis mengalikan jumlah bahan yang rusak dengan unit cost moving average, lalu membukukan nilai kerugian ke pos biaya Food Waste pada Dashboard.', 'c. Pembukuan Kerugian Finansial:'),

          // SUB-BAB 7.5: WMS GUDANG
          createHeading2('7.5. Modul Interface Stok & Gudang (Warehouse Management System / WMS)'),
          createParagraph(
            'Modul Interface Stok & Gudang mengelola pergerakan bahan masuk (Goods In), alokasi stok First-Expired, First-Out (FEFO), dan rekonsiliasi stock opname fisik berkala.'
          ),

          // EMBED CAPTURE 5: WMS
          ...createImageParagraph(
            captures.warehouse,
            'Gambar 7.4: Interface Stok & Gudang - Buku Besar Saldo Riil, Penerimaan Barang (Goods In), & Alokasi FEFO',
            580,
            338
          ),

          createBullet('Petugas gudang mencatat nomor PO, memeriksa suhu dingin chiller (Cold Chain QC), serta menginput nomor batch dan tanggal kedaluwarsa.', '• Penerimaan Barang (Goods In):'),
          createBullet('Sistem memastikan bahan dengan tanggal kedaluwarsa terdekat yang pertama kali dialokasikan untuk pemotongan pesanan dapur guna meminimalisir pembusukan.', '• Algoritma FEFO Otomatis:'),
          createBullet('Fitur input hasil hitung fisik di rak gudang untuk menyelaraskan selisih riil dengan buku besar sistem melalui transaksi ADJUSTMENT_OPNAME.', '• Rekonsiliasi Stock Opname:'),

          // SUB-BAB 7.6: DASHBOARD
          createHeading2('7.6. Modul Dashboard Monitoring & Executive Business Intelligence'),
          createParagraph(
            'Dashboard eksekutif menyajikan indikator kinerja utama (KPI) secara real-time yang diperbarui setiap detik tanpa perlu refresh halaman web.'
          ),

          // EMBED CAPTURE 6: DASHBOARD
          ...createImageParagraph(
            captures.dashboard,
            'Gambar 7.5: Dashboard Monitoring Eksekutif - Omzet Real-Time, Monitoring HPP / Food Cost %, & Peringatan Reorder Point',
            580,
            338
          ),

          createBullet('Akumulasi nilai penjualan kotor dari seluruh kasir yang aktif pada shift berjalan.', '• Omzet Penjualan (Gross Sales):'),
          createBullet('Rasio antara nilai bahan baku yang terpakai dan waste dapur terhadap total omzet: Food Cost % = (Total COGS / Gross Sales) × 100%.', '• Real-Time Food Cost Ratio:'),
          createBullet('Jika stok fisik berada di bawah Reorder Point (ROP), sistem menyalakan lampu merah dan otomatis menyusun draf Purchase Order ke supplier langganan.', '• Peringatan Safety Stock & Draf PO:'),

          // ==========================================
          // BAB 8: ARSITEKTUR INTEGRASI & SPESIFIKASI API
          // ==========================================
          createHeading1('8. ARSITEKTUR INTEGRASI & SPESIFIKASI API ANTAR SISTEM'),
          createParagraph(
            'Seluruh komunikasi antar sistem berjalan melalui REST API terstandarisasi dan WebSocket Pub/Sub event bus:'
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Metode & Endpoint API', { isHeader: true, widthPercent: 32 }),
                  createTableCell('Arah Antar Sistem', { isHeader: true, widthPercent: 24 }),
                  createTableCell('Fungsi & Payload Data Utama', { isHeader: true, widthPercent: 44 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('POST /api/v1/orders/checkout', { bold: true }),
                  createTableCell('Kasir (POS) ➔ Stok (WMS)'),
                  createTableCell('Checkout pesanan, verifikasi BOM, potong stok atomik, atau balas HTTP 409 jika defisit.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('POST /api/v1/orders/{id}/void', { bold: true }),
                  createTableCell('Kasir (POS) ➔ Stok (WMS)'),
                  createTableCell('Pembatalan pesanan resmi; mengembalikan stok ke gudang via mutasi VOID_ROLLBACK.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('POST /api/v1/kitchen/waste', { bold: true }),
                  createTableCell('Dapur (KDS) ➔ Stok & BI'),
                  createTableCell('Pelaporan bahan rusak/gosong, memotong stok fisik, dan membukukan pos kerugian.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('POST /api/v1/inventory/goods-in', { bold: true }),
                  createTableCell('Gudang ➔ Database'),
                  createTableCell('Penerimaan PO supplier, pencatatan batch FEFO, dan update moving average unit cost.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('WS /ws/inventory-stream', { bold: true }),
                  createTableCell('Cross-System Broadcast'),
                  createTableCell('Event bus: KITCHEN_TICKET_CREATED, STOCK_UPDATED, ALERT_ROP, ORDER_READY.')
                ]
              })
            ]
          }),

          // ==========================================
          // BAB 9: SKEMA BASIS DATA & INTEGRITAS TRANSAKSI
          // ==========================================
          createHeading1('9. SKEMA BASIS DATA & INTEGRITAS RELASIONAL (ACID)'),
          createParagraph(
            'Sistem mengadopsi Relational Database Engine (PostgreSQL Enterprise) yang menerapkan prinsip ACID (Atomicity, Consistency, Isolation, Durability) secara ketat untuk menjamin ketiadaan anomali data (zero race condition):'
          ),
          createBullet('Tabel menu, kategori, harga jual, dan status ketersediaan (is_active / is_sold_out).', '1. Tabel menu_items:'),
          createBullet('Tabel master bahan mentah (nama, sku, satuan, current_stock, safety_stock, moving_avg_cost).', '2. Tabel raw_materials:'),
          createBullet('Tabel relasi resep (menu_item_id, material_id, quantity_required) yang menjadi acuan BOM engine.', '3. Tabel recipe_boms:'),
          createBullet('Buku besar mutasi stok tak terhapus (immutable ledger): mencatat jenis IN_PURCHASE, OUT_SALE, OUT_WASTE, VOID_ROLLBACK.', '4. Tabel stock_transactions:'),
          createBullet('Pencatatan batch penerimaan bahan dengan kolom expiry_date untuk mendukung alokasi FEFO.', '5. Tabel stock_batches:'),
          createParagraph(
            'Mekanisme Row-Level Locking: Saat kasir memproses pembayaran, sistem mengeksekusi SELECT FOR UPDATE pada baris bahan baku terkait, mengunci saldo hingga transaksi selesai untuk mencegah dua kasir menjual bahan yang sama dalam fraksi detik yang bersamaan.'
          ),

          // ==========================================
          // BAB 10: KEBUTUHAN NON-FUNGSIONAL (NFR)
          // ==========================================
          createHeading1('10. KEBUTUHAN NON-FUNGSIONAL (NON-FUNCTIONAL REQUIREMENTS)'),
          createBullet('Sistem menjamin Service Level Agreement (SLA) ketersediaan layanan sebesar 99.9% uptime per tahun.', '• Ketersediaan (High Availability):'),
          createBullet('Waktu transmisi tiket dari kasir ke monitor dapur tidak melebihi 150 milidetik via protokol WebSocket murni.', '• Latensi & Kecepatan:'),
          createBullet('Mampu menangani lonjakan transaksi simultan hingga 500 transaksi per detik pada jam makan siang (peak hours) tanpa bottleneck.', '• Skalabilitas & Concurrency:'),
          createBullet('Setiap mutasi stok dan pembatalan pesanan kasir terekam lengkap beserta identitas kasir/koki, alamat IP stasiun, dan timestamp ISO 8601.', '• Keamanan & Audit Trail:'),

          // ==========================================
          // BAB 11: MATRIKS RACI & KRITERIA PENERIMAAN UAT
          // ==========================================
          createHeading1('11. MATRIKS TANGGUNG JAWAB (RACI) & KRITERIA UAT'),
          createParagraph('Pembagian peran dan tanggung jawab implementasi antara Klien dan Penyedia Sistem:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Aktivitas Proyek', { isHeader: true, widthPercent: 36 }),
                  createTableCell('Pemilik Resto (Klien)', { isHeader: true, widthPercent: 21 }),
                  createTableCell('Manajer Outlet (Klien)', { isHeader: true, widthPercent: 21 }),
                  createTableCell('Tim RestoSync (Vendor)', { isHeader: true, widthPercent: 22 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Penyediaan Data Master Menu & Resep BOM'),
                  createTableCell('Accountable (A)', { align: AlignmentType.CENTER }),
                  createTableCell('Responsible (R)', { align: AlignmentType.CENTER }),
                  createTableCell('Consulted (C)', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Instalasi & Konfigurasi Sistem RestoSync'),
                  createTableCell('Informed (I)', { align: AlignmentType.CENTER }),
                  createTableCell('Consulted (C)', { align: AlignmentType.CENTER }),
                  createTableCell('Responsible (R)', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Pengujian Integrasi Kasus Stok Defisit & KDS'),
                  createTableCell('Consulted (C)', { align: AlignmentType.CENTER }),
                  createTableCell('Accountable (A)', { align: AlignmentType.CENTER }),
                  createTableCell('Responsible (R)', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Pelatihan Staf Kasir, Koki, & Gudang'),
                  createTableCell('Informed (I)', { align: AlignmentType.CENTER }),
                  createTableCell('Accountable (A)', { align: AlignmentType.CENTER }),
                  createTableCell('Responsible (R)', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Pengesahan Akhir & Go-Live (Sign-Off)'),
                  createTableCell('Accountable (A)', { align: AlignmentType.CENTER }),
                  createTableCell('Responsible (R)', { align: AlignmentType.CENTER }),
                  createTableCell('Support (S)', { align: AlignmentType.CENTER })
                ]
              })
            ]
          }),

          createParagraph(
            'Kriteria Penerimaan Pengguna (User Acceptance Testing / UAT):'
          ),
          createBullet('Kasir dapat memilih menu dan memicu kalkulasi BOM secara akurat.', '✓ Skenario UAT 1 (POS Normal):'),
          createBullet('Memesan menu melebihi stok gudang wajib memunculkan modal HTTP 409, membatalkan transaksi secara atomik, dan tidak memotong saldo bahan.', '✓ Skenario UAT 2 (Stok Kurang):'),
          createBullet('Pesanan terbayar wajib muncul di monitor koki dalam tempo < 150ms disertai audio chime bel dapur.', '✓ Skenario UAT 3 (Tiket KDS):'),
          createBullet('Mencatat bahan rusak di tablet dapur wajib mengurangi saldo bahan fisik dan mencatat nilai kerugian di Dashboard.', '✓ Skenario UAT 4 (Waste Log):'),
          createBullet('Dashboard wajib mencerminkan perubahan omzet dan nilai HPP secara real-time.', '✓ Skenario UAT 5 (Dashboard):'),

          // ==========================================
          // BAB 12: LEMBAR PENGESAHAN KLIEN (SIGN-OFF)
          // ==========================================
          createHeading1('12. LEMBAR PENGESAHAN & TANDA TANGAN (SIGN-OFF SHEET)'),
          createParagraph(
            'Dengan menandatangani dokumen ini, kedua belah pihak menyatakan telah membaca, memahami, dan menyetujui seluruh ruang lingkup, arsitektur alur proses antar sistem, serta spesifikasi fungsional dan teknis yang tercantum dalam Business Requirements Document (BRD) RestoSync ini.'
          ),

          new Paragraph({ spacing: { before: 200 }, children: [] }),

          // 2x2 Signature Grid Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('PIHAK KLIEN (RESTORAN)', { isHeader: true, widthPercent: 50, align: AlignmentType.CENTER }),
                  createTableCell('PIHAK PENYEDIA SISTEM (RESTOSYNC)', { isHeader: true, widthPercent: 50, align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorderStandard,
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      createParagraph('Disetujui Oleh:', { bold: true }),
                      createParagraph('\n\n\n_________________________________________', { color: COLOR_MUTED }),
                      createParagraph('Nama: ___________________________________', { bold: true }),
                      createParagraph('Jabatan: Pemilik / Direktur Operasional F&B'),
                      createParagraph('Nama Restoran: ___________________________'),
                      createParagraph('Tanggal: _________________________________')
                    ]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      createParagraph('Diserahkan Oleh:', { bold: true }),
                      createParagraph('\n\n\n_________________________________________', { color: COLOR_MUTED }),
                      createParagraph('Nama: Lead Solution Architect', { bold: true }),
                      createParagraph('Jabatan: Head of Enterprise Architecture'),
                      createParagraph('Perusahaan: RestoSync Platform Ltd.'),
                      createParagraph('Tanggal: 14 Oktober 2026')
                    ]
                  })
                ]
              })
            ]
          }),

          new Paragraph({
            spacing: { before: 400 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '--- AKHIR DARI DOKUMEN BUSINESS REQUIREMENTS DOCUMENT (BRD) ---',
                bold: true,
                size: 18,
                color: COLOR_MUTED,
                font: 'Calibri'
              })
            ]
          })
        ]
      }
    ]
  });

  // 3. Pack to Blob
  const blob = await Packer.toBlob(doc);
  return blob;
}
