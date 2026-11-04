// Enterprise-Grade UI/UX Wireframe & Interactive Prototype Specification Microsoft Word (.docx) Generator
// Covers Multi-Role User Flows, Screen Wireframes, Component Anatomy, Design Tokens, and Prototype User Testing.

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
    size?: number;
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
      before: options.spaceBefore !== undefined ? options.spaceBefore : 260,
      after: options.spaceAfter !== undefined ? options.spaceAfter : 100
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

export async function generateWireframeDocxBlob(restaurantInfo?: {
  name?: string;
  picName?: string;
}): Promise<Blob> {
  const captures = await generateAllSystemCaptures();

  const restoTitle = restaurantInfo?.name?.trim() ? restaurantInfo.name : 'GastroStock Restoran Mitra';
  const picTitle = restaurantInfo?.picName?.trim() ? restaurantInfo.picName : 'Lead UI/UX & System Design Team';

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
                    text: 'RESTOSYNC / GASTROSTOCK — UI/UX WIREFRAME & PROTOTYPE SPECIFICATION v2.0',
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
          // COVER TITLE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 120 },
            children: [
              new TextRun({
                text: 'DOKUMEN DESAIN SISTEM & WIREFRAME UI/UX',
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
                text: 'BLUEPRINT TAMPILAN, ANATOMI KOMPONEN & PROTOTYPE MULTI-ROLE RESTORAN',
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
                text: `Klien: ${restoTitle} | Lead Designer: ${picTitle} | Standar: Ergonomic Touch POS & KDS SLA`,
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
                  createTableCell('Parameter Desain', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Ketentuan & Spesifikasi', { isHeader: true, widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Klasifikasi Dokumen', { bold: true }),
                  createTableCell('Panduan Utama UI/UX Designer & Frontend Developer (Figma-Ready)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Multi-Role Coverage', { bold: true }),
                  createTableCell('6 Peran: (1) Kasir POS, (2) Waiter Lantai, (3) Kitchen Chef KDS, (4) Store Supervisor, (5) Owner Resto BI, (6) Staff Gudang HACCP')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Standar Ergonomi Layar', { bold: true }),
                  createTableCell('Minimum Hit-Area 48x48px (Touchscreen), Rasio Kontras WCAG AAA (7:1), Dark Mode Dapur Anti-Silau')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Status Prototyping', { bold: true }),
                  createTableCell('HIGH-FIDELITY INTERACTIVE PROTOTYPE (Telah divalidasi dengan alur User Persona)')
                ]
              })
            ]
          }),

          // BAB 1: DESIGN SYSTEM & DESIGN TOKENS
          createHeading('1. DESIGN SYSTEM & DESIGN TOKENS (FONDASI UI/UX)', HeadingLevel.HEADING_1),
          createParagraph(
            'Untuk memastikan konsistensi antarmuka lintas perangkat kasir, tablet waiter, layar gantung dapur (KDS), dan smartphone pemilik resto, sistem menggunakan design tokens standar:'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Elemen Token', { isHeader: true, widthPercent: 25 }),
                  createTableCell('Nilai & Spesifikasi', { isHeader: true, widthPercent: 35 }),
                  createTableCell('Peran & Rationale Penggunaan', { isHeader: true, widthPercent: 40 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Brand Primary', { bold: true }),
                  createTableCell('#0F2942 (Deep Navy Corporate)'),
                  createTableCell('Navbar, sidebar utama, tombol aksi primer kasir, dan teks judul resmi.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Status Ready / Lunas', { bold: true }),
                  createTableCell('#059669 (Emerald Green)'),
                  createTableCell('Meja kosong, pesanan lunas, bump bar KDS selesai saji, stok bahan aman.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Status Warning / SLA Cook', { bold: true }),
                  createTableCell('#D97706 (Amber Gold)'),
                  createTableCell('Meja minta tagihan, timer KDS 7-12 menit (kuning), stok mendekati ROP.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Status Danger / Defisit', { bold: true }),
                  createTableCell('#DC2626 (Rose Crimson)'),
                  createTableCell('Meja terisi aktif, dialog stok defisit rollback, timer KDS lewat SLA > 12 menit.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Tipografi (Typography)', { bold: true }),
                  createTableCell('SF Pro Display / Inter / Segoe UI'),
                  createTableCell('Font sans-serif modern dengan keterbacaan tinggi di bawah lampu restoran.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Grid & Hit Target', { bold: true }),
                  createTableCell('Minimum 48px touch target, 8px grid'),
                  createTableCell('Mencegah kasir salah sentuh tombol menu saat jam sibuk antrean.')
                ]
              })
            ]
          }),

          // BAB 2: WIREFRAME & ALUR PER-ROLE (6 PERAN SISTEM)
          createHeading('2. WIREFRAME & ALUR SISTEM BERDASARKAN ROLE PENGGUNA', HeadingLevel.HEADING_1),
          createParagraph(
            'Analisis mendalam antarmuka untuk masing-masing peran operasional restoran:'
          ),

          // Role 1: Kasir
          createHeading('2.1 Role: Kasir Restoran (Front of House POS)', HeadingLevel.HEADING_2),
          createParagraph(
            'Peran kasir berfokus pada kecepatan checkout (< 15 detik), pencegahan kesalahan kembalian, dan rekonsiliasi kas harian.'
          ),
          createParagraph(
            'Komponen Utama Layar Kasir: (A) Bilah Kategori Menu Horisontal, (B) Grid Katalog Menu 4 Kolom dengan foto & harga, (C) Panel Keranjang Belanja Dinamis, (D) Tombol Split Bill 1-Klik, (E) Tombol Pecahan Uang Cepat (Rp 50rb, Rp 100rb, Uang Pas), dan (F) Dialog Pembayaran QRIS Dinamis & EDC.'
          ),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 },
            children: [
              new ImageRun({
                data: captures.pos,
                transformation: { width: 560, height: 326 },
                type: 'png'
              })
            ]
          }),

          // Role 2: Waiter
          createHeading('2.2 Role: Waiter / Pramusaji (Floor Order Taking Tablet)', HeadingLevel.HEADING_2),
          createParagraph(
            'Tablet bergerak pramusaji dirancang ringan dengan navigasi sentuh 1 tangan.'
          ),
          createParagraph(
            'Fitur Kritis: Indikator visual real-time "SOLD OUT / HABIS" pada menu jika bahan mentah di gudang tidak mencukupi, pemilihan nomor meja langsung pada denah visual lantai, catatan pesanan khusus (modifier level pedas, es sedikit), dan tombol instan "Kirim ke Dapur".'
          ),

          // Role 3: Kitchen Chef
          createHeading('2.3 Role: Kitchen Staff & Head Chef (KDS Digital Board)', HeadingLevel.HEADING_2),
          createParagraph(
            'Layar KDS menggantikan kertas tiket bon dapur dengan kartu pesanan digital tahan minyak dan air.'
          ),
          createParagraph(
            'Anatomi Kartu KDS: (1) Header kartu berisi Nomor Order, Nomor Meja, dan Waktu Masuk, (2) SLA Stopwatch Timer yang berubah warna: Hijau (<7 menit) -> Kuning (7-12 menit) -> Merah Berkedip (>12 menit), (3) Checklist item menu dan modifier, (4) Tombol Bump Bar "Selesai Saji", dan (5) Tombol "Catat Waste / Spoilage" untuk mendata bahan gosong atau tumpah.'
          ),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 },
            children: [
              new ImageRun({
                data: captures.kds,
                transformation: { width: 560, height: 326 },
                type: 'png'
              })
            ]
          }),

          // Role 4: Store Manager
          createHeading('2.4 Role: Store Manager & Supervisor (Otorisasi & Audit)', HeadingLevel.HEADING_2),
          createParagraph(
            'Antarmuka supervisor berfokus pada kontrol integritas kas dan pencegahan kecurangan internal kasir.'
          ),
          createParagraph(
            'Fitur Utama: Popup Modal PIN Otorisasi 4-digit saat kasir melakukan pembatalan pesanan (Void), persetujuan diskon khusus, dan audit uang fisik laci kasir saat pergantian shift (X-Report & Z-Report) dengan perhitungan selisih otomatis.'
          ),

          // Role 5: Owner Resto
          createHeading('2.5 Role: Pemilik Restoran / Owner (Executive BI Dashboard)', HeadingLevel.HEADING_2),
          createParagraph(
            'Antarmuka mobile & web bagi pemilik restoran untuk memantau performa bisnis secara real-time.'
          ),
          createParagraph(
            'Metrik Utama: (A) Live Gross Omset hari ini, (B) Food Cost % Real-time vs Target 30%, (C) Total Kerugian Waste Dapur, (D) Perbandingan performa omset antar cabang outlet, dan (E) Buku besar mutasi inventori otomatis (Immutable Audit Ledger).'
          ),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 },
            children: [
              new ImageRun({
                data: captures.dashboard,
                transformation: { width: 560, height: 326 },
                type: 'png'
              })
            ]
          }),

          // Role 6: Staff Gudang & HACCP
          createHeading('2.6 Role: Staff Gudang & Procurement (Inventory & HACCP)', HeadingLevel.HEADING_2),
          createParagraph(
            'Antarmuka pergudangan untuk mencatat penerimaan barang (Goods-In PO), alokasi bahan FEFO (First-Expired, First-Out), dan pemantauan sensor suhu chiller.'
          ),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 },
            children: [
              new ImageRun({
                data: captures.warehouse,
                transformation: { width: 560, height: 326 },
                type: 'png'
              })
            ]
          }),

          // BAB 3: PENGESAHAN DESAIN
          createHeading('3. LEMBAR PENGESAHAN DESAIN WIREFRAME & PROTOTYPE', HeadingLevel.HEADING_1),
          createParagraph(
            'Dokumen blueprint wireframe dan spesifikasi prototype interaktif ini telah disetujui bersama untuk menjadi acuan implementasi kode antarmuka (frontend coding):'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Perwakilan Restoran / Klien', { isHeader: true, widthPercent: 50 }),
                  createTableCell('Lead UI/UX & Frontend Architect', { isHeader: true, widthPercent: 50 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell(`Nama Toko: ${restoTitle}\nNama PIC: ${picTitle}\nStatus: APPROVED PROTOTYPE\nTanggal: ____________________\n\n\n\nTanda Tangan: ________________________`),
                  createTableCell(`Nama: GastroStock UI/UX Engineering\nJabatan: Principal Frontend Architect\nStatus: READY FOR FIGMA & CODE\nTanggal: ____________________\n\n\n\nTanda Tangan: ________________________`)
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
