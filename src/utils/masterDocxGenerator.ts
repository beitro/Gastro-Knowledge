// Enterprise-Grade Master Restaurant Document (.docx) Generator
// Clean, Production-Ready Interactive Workbook & Form Template (No Dummy Data)
// Ready to be filled via table / mobile / Word / Google Docs, or printed and handwritten with pen.

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
import { generateAllPreSalesCaptures } from './preSalesCaptureGenerator';
import { generateAllSystemCaptures } from './brdCaptureGenerator';

export interface ClientCustomFormData {
  restaurantName?: string;
  clientPicName?: string;
  clientRole?: string;
  clientPhone?: string;
  restaurantAddress?: string;
  monthlyRevenue?: number;
  foodCostPct?: number;
  restoType?: 'finedining' | 'qsr' | 'cloud' | 'coffee';
  targetPaybackMonths?: string;
  // Optional custom items filled via HP/browser
  menus?: Array<{
    name: string;
    category?: string;
    b1?: string;
    b2?: string;
    b3?: string;
    hpp?: string;
  }>;
  staff?: Array<{
    name: string;
    phone?: string;
    role?: string;
    pin?: string;
  }>;
  hardware?: Array<{
    device: string;
    status?: string;
    sn?: string;
    ip?: string;
  }>;
  cash100k?: number;
  cash50k?: number;
  cash20k?: number;
  cash10k?: number;
  cashCoins?: number;
  cashPosReport?: number;
}

// Professional Corporate Color Palette
const COLOR_PRIMARY = '0F2942';   // Deep Navy Corporate
const COLOR_SECONDARY = '0284C7'; // Tech Blue
const COLOR_ACCENT = 'D97706';    // Amber Gold
const COLOR_SUCCESS = '059669';   // Emerald Green
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

const cellBorderDotted = {
  top: { style: BorderStyle.DOTTED, size: 1, color: COLOR_BORDER },
  bottom: { style: BorderStyle.DOTTED, size: 1, color: COLOR_BORDER },
  left: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  right: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER }
};

function createParagraph(
  text: string,
  options: {
    bold?: boolean;
    italic?: boolean;
    size?: number; // half-points: 24 = 12pt, 22 = 11pt, 20 = 10pt
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
      line: 276 // 1.15 line height
    },
    children: [
      new TextRun({
        text,
        bold: options.bold || false,
        italics: options.italic || false,
        size: options.size || 22,
        color: options.color || COLOR_TEXT_DARK,
        font: 'Calibri'
      })
    ]
  });
}

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

function createHeading3(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 90 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 23, // 11.5pt
        color: COLOR_ACCENT,
        font: 'Calibri'
      })
    ]
  });
}

function createBullet(text: string, boldPrefix?: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 50, after: 50 },
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

// Checkbox helper for Word: ☐ (Unchecked) or ☑ (Checked)
function createCheckboxItem(
  label: string,
  options: {
    checked?: boolean;
    subtext?: string;
    noteField?: boolean;
    boldLabel?: boolean;
    spaceBefore?: number;
    spaceAfter?: number;
  } = {}
): Paragraph[] {
  const boxChar = options.checked ? '☑ ' : '☐ ';
  const items: Paragraph[] = [
    new Paragraph({
      spacing: { before: options.spaceBefore || 60, after: options.subtext || options.noteField ? 20 : 60 },
      children: [
        new TextRun({
          text: boxChar,
          bold: true,
          size: 24,
          color: options.checked ? COLOR_SUCCESS : COLOR_PRIMARY,
          font: 'Segoe UI Symbol'
        }),
        new TextRun({
          text: label,
          bold: options.boldLabel !== false,
          size: 21,
          color: COLOR_TEXT_DARK,
          font: 'Calibri'
        })
      ]
    })
  ];

  if (options.subtext) {
    items.push(
      new Paragraph({
        spacing: { before: 0, after: options.noteField ? 30 : 60 },
        indent: { left: 400 },
        children: [
          new TextRun({
            text: options.subtext,
            size: 19,
            italics: true,
            color: COLOR_MUTED,
            font: 'Calibri'
          })
        ]
      })
    );
  }

  if (options.noteField) {
    items.push(
      new Paragraph({
        spacing: { before: 0, after: 80 },
        indent: { left: 400 },
        children: [
          new TextRun({
            text: 'Catatan / Tindakan Lapangan: ____________________________________________________________________',
            size: 18,
            color: COLOR_MUTED,
            font: 'Calibri'
          })
        ]
      })
    );
  }

  return items;
}

function createTableCell(
  text: string,
  options: {
    bold?: boolean;
    isHeader?: boolean;
    fillColor?: string;
    widthPercent?: number;
    color?: string;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    isDotted?: boolean;
  } = {}
): TableCell {
  return new TableCell({
    borders: options.isDotted ? cellBorderDotted : cellBorderStandard,
    shading: {
      type: ShadingType.CLEAR,
      fill: options.fillColor || (options.isHeader ? '1E293B' : 'FFFFFF')
    },
    margins: { top: 130, bottom: 130, left: 140, right: 140 },
    width: options.widthPercent ? { size: options.widthPercent, type: WidthType.PERCENTAGE } : undefined,
    children: [
      new Paragraph({
        alignment: options.align || (options.isHeader ? AlignmentType.CENTER : AlignmentType.LEFT),
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text,
            bold: options.bold || options.isHeader || false,
            color: options.color || (options.isHeader ? 'FFFFFF' : COLOR_TEXT_DARK),
            size: options.isHeader ? 20 : 19,
            font: 'Calibri'
          })
        ]
      })
    ]
  });
}

function createCalloutBox(title: string, content: string, borderColor = COLOR_SECONDARY, bgColor = 'F0F9FF'): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
              left: { style: BorderStyle.SINGLE, size: 24, color: borderColor }
            },
            shading: { type: ShadingType.CLEAR, fill: bgColor },
            margins: { top: 140, bottom: 140, left: 180, right: 160 },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 22,
                    color: borderColor === COLOR_SECONDARY ? '0369A1' : borderColor === COLOR_ACCENT ? 'B45309' : '047857',
                    font: 'Calibri'
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({
                    text: content,
                    size: 21,
                    color: COLOR_TEXT_DARK,
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

function createImageFigure(imageBuffer: Uint8Array, caption: string, width = 580, height = 310): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 80 },
      children: [
        new ImageRun({
          data: imageBuffer,
          transformation: { width, height },
          type: 'png'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 200 },
      children: [
        new TextRun({
          text: `Gambar: ${caption}`,
          italics: true,
          size: 19,
          color: COLOR_MUTED,
          font: 'Calibri'
        })
      ]
    })
  ];
}

// Master Generator Function returning Document Blob with Interactive Form Fields & Checkboxes (NO DUMMY DATA)
export async function generateMaster4PhasesDocx(clientData: ClientCustomFormData = {}): Promise<Blob> {
  // Clean field values - NO DUMMY DATA! If not supplied, provide clean fill-in blank line
  const restoName = clientData.restaurantName?.trim() || '__________________________________________________';
  const picName = clientData.clientPicName?.trim() || '__________________________________________________';
  const picRole = clientData.clientRole?.trim() || 'Pemilik Restoran / PIC Operasional F&B';
  const picPhone = clientData.clientPhone?.trim() || '__________________________________________________';
  const address = clientData.restaurantAddress?.trim() || '__________________________________________________';
  
  const hasRevenue = !!clientData.monthlyRevenue && clientData.monthlyRevenue > 0;
  const monthlyRevenueStr = hasRevenue 
    ? `Rp ${clientData.monthlyRevenue!.toLocaleString('id-ID')}` 
    : 'Rp ____________________';

  const hasFoodCost = !!clientData.foodCostPct && clientData.foodCostPct > 0;
  const foodCostStr = hasFoodCost 
    ? `${clientData.foodCostPct}%` 
    : '________ %';

  const wasteSavingsStr = (hasRevenue && hasFoodCost)
    ? `Rp ${((clientData.monthlyRevenue! * clientData.foodCostPct! * 0.05 * 12) / 100).toLocaleString('id-ID')} / tahun`
    : 'Rp ____________________ / tahun';

  const cashierSavingsStr = hasRevenue
    ? `Rp ${(clientData.monthlyRevenue! * 0.01 * 12).toLocaleString('id-ID')} / tahun`
    : 'Rp ____________________ / tahun';

  const paybackStr = clientData.targetPaybackMonths?.trim() || '[ ☐ ] < 3 Bulan   [ ☐ ] 3-6 Bulan   [ ☐ ] > 6 Bulan';

  // 1. Generate Structural Reference Captures in parallel
  const [preSalesCaptures, sysCaptures] = await Promise.all([
    generateAllPreSalesCaptures(),
    generateAllSystemCaptures()
  ]);

  // 2. Build Document Structure
  const doc = new Document({
    creator: 'RestoSync Solution Architecture & Deployment Team',
    title: 'Dokumen Induk & Lembar Kerja Sistem Restoran Terpadu (4 Fase)',
    description: 'Format lembar kerja resmi 4 fase siap diisi via tabel/HP atau dicetak dan ditulis tangan dengan pena.',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'RestoSync™ Enterprise Solution  |  Dokumen Induk & Lembar Kerja 4 Fase',
                    size: 17,
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
                    text: 'Kerahasiaan Klien: Strictly Confidential  |  Halaman ',
                    size: 17,
                    color: COLOR_MUTED,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 17,
                    bold: true,
                    color: COLOR_PRIMARY,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: ' dari ',
                    size: 17,
                    color: COLOR_MUTED,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 17,
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
          // ==========================================
          // COVER PAGE
          // ==========================================
          new Paragraph({
            spacing: { before: 200, after: 100 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'DOKUMEN INDUK & LEMBAR KERJA SISTEM RESTORAN TERPADU',
                bold: true,
                size: 38, // 19pt
                color: COLOR_PRIMARY,
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 140 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'PANDUAN LENGKAP 4 FASE (SIAP DIISI VIA TABEL/HP ATAU PRINT TULIS TANGAN)',
                bold: true,
                size: 24, // 12pt
                color: COLOR_SECONDARY,
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 260 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Format Terpadu: Diagnosa Pre-Sales, Kuesioner ROI, Blueprint BRD, Form Resep BOM, Checklist UAT, & SOP Harian',
                italics: true,
                size: 21,
                color: COLOR_MUTED,
                font: 'Calibri'
              })
            ]
          }),

          // Metadata Card Table with Fill-In Lines (NO DUMMY DATA)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('NAMA RESTORAN / OUTLET', { bold: true, widthPercent: 35, fillColor: COLOR_BG_LIGHT }),
                  createTableCell(restoName, { bold: true, widthPercent: 65 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('PEMILIK RESTORAN / PIC', { bold: true, widthPercent: 35, fillColor: COLOR_BG_LIGHT }),
                  createTableCell(picName, { widthPercent: 65 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('JABATAN PIC', { bold: true, widthPercent: 35, fillColor: COLOR_BG_LIGHT }),
                  createTableCell(picRole, { widthPercent: 65 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('ALAMAT LENGKAP OUTLET', { bold: true, widthPercent: 35, fillColor: COLOR_BG_LIGHT }),
                  createTableCell(address, { widthPercent: 65 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('NO. WHATSAPP / KONTAK', { bold: true, widthPercent: 35, fillColor: COLOR_BG_LIGHT }),
                  createTableCell(picPhone, { widthPercent: 65 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('KODE DOKUMEN', { bold: true, widthPercent: 35, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('DOC-RESTOSYNC-MASTER-2026-V2 (Workbook Edition)', { widthPercent: 65 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('TARGET TANGGAL GO-LIVE', { bold: true, widthPercent: 35, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('Tanggal: [ ____ / ____ / 2026 ]  |  Status: [ ☐ ] Persiapan   [ ☐ ] UAT   [ ☐ ] Siap Go-Live', { widthPercent: 65 })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 200, after: 80 } }),
          createCalloutBox(
            'PETUNJUK PENGISIAN & PENCENTANGAN DOKUMEN (SATU FORMAT UNTUK SEMUA)',
            'Dokumen ini merupakan master workbook resmi yang dapat diisi langsung melalui tabel di HP/komputer (Word / Docs) maupun dicetak fisik untuk ditulis tangan dengan pulpen. Seluruh kolom isian bergaris [ _________________ ] dan kotak centang [ ☐ ] disediakan bersih tanpa data dummy sehingga siap digunakan langsung oleh pemilik restoran, manajer, kasir, dan staf dapur.',
            COLOR_PRIMARY,
            'F1F5F9'
          ),

          // ==========================================
          // DAFTAR ISI (TABLE OF CONTENTS)
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('DAFTAR ISI & LEMBAR KERJA 4 FASE'),
          createParagraph('Dokumen ini mencakup 4 fase berurutan yang siap diisi dan dicentang:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('BAGIAN', { isHeader: true, widthPercent: 15 }),
                  createTableCell('BAB & TOPIK DOKUMEN', { isHeader: true, widthPercent: 55 }),
                  createTableCell('FORMAT LEMBAR KERJA', { isHeader: true, widthPercent: 30 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('FASE 1', { bold: true, fillColor: 'EFF6FF', align: AlignmentType.CENTER }),
                  createTableCell('TAHAP PERKENALAN & PITCHING (PRE-SALES)\n• 1.1 Kuesioner Diagnosa Masalah Restoran\n• 1.2 Product Catalog & Checklist Pemilihan Modul Restoran\n• 1.3 Lembar Isian Finansial & Target ROI Outlet Klien\n• 1.4 Checklist Inventarisasi Hardware & Alamat IP'),
                  createTableCell('Kuesioner Centang [☐]\nIsian Target Omzet [Rp]\nChecklist Inventaris Hardware', { color: COLOR_SECONDARY })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('FASE 2', { bold: true, fillColor: 'FEF3C7', align: AlignmentType.CENTER }),
                  createTableCell('ANALISIS KEBUTUHAN & DESAIN SOLUSI (BRD)\n• 2.1 Diagram Swimlane Alur Komunikasi Antar-Sistem\n• 2.2 Lembar Isian Resep Master BOM 5 Menu Andalan\n• 2.3 Checklist Kebijakan Penanganan Stok Defisit (HTTP 409)\n• 2.4 Formulir Pendaftaran Akun Staf & Hak Akses (RBAC)'),
                  createTableCell('Diagram Alur Antar-Sistem\nTabel Resep Kosong [gr/ml]\nForm Akun & PIN Staf', { color: COLOR_ACCENT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('FASE 3', { bold: true, fillColor: 'F0FDF4', align: AlignmentType.CENTER }),
                  createTableCell('IMPLEMENTASI, ONBOARDING & GO-LIVE\n• 3.1 Checklist Rencana Kerja 4 Minggu (Roadmap Paraf)\n• 3.2 Panduan Struktur Master Sheet Menu CSV\n• 3.3 Formulir Alokasi IP Statis & Topologi Jaringan\n• 3.4 Lembar UAT 10 Kriteria Pengujian Penerimaan Klien'),
                  createTableCell('Roadmap Paraf PIC [☐]\nStruktur Kolom CSV\nLembar UAT [Lulus/Revisi]', { color: COLOR_SUCCESS })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('FASE 4', { bold: true, fillColor: 'FAF5FF', align: AlignmentType.CENTER }),
                  createTableCell('PANDUAN OPERASIONAL HARIAN & SOP RESTORAN\n• 4.1 Lembar Checklist Harian Pembukaan (Daily Opening)\n• 4.2 Disiplin Jam Sibuk & SLA Layar KDS\n• 4.3 Formulir Rekonsiliasi Kas Laci (Daily Cash Closing)\n• 4.4 Lembar Log Troubleshooting & Insiden Operasional\n• 4.5 Lembar Pengesahan Resmi & Cap Perusahaan'),
                  createTableCell('Form Opening Harian [☐]\nForm Blind Cash Count\nSign-Off & Cap Resmi', { color: '7E22CE' })
                ]
              })
            ]
          }),

          // ==========================================
          // FASE 1: PRE-SALES PITCHING, ROI & HARDWARE
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('FASE 1: TAHAP PERKENALAN & PITCHING (PRE-SALES)'),
          createParagraph('Tahap awal ini membedah masalah nyata di restoran Anda dan merumuskan efisiensi operasional serta target finansial yang terukur.'),

          createHeading2('1.1 Kuesioner Diagnosa Masalah Restoran (Bisa Dicentang & Ditulis)'),
          createParagraph('Beri tanda centang [ ☑ ] pada masalah yang saat ini sering dialami outlet restoran Anda:'),

          ...createCheckboxItem('Sering terjadi selisih stok bahan baku antara catatan pembukuan dan fisik kulkas/gudang di akhir bulan (Varians > 5%).', {
            noteField: true,
            subtext: 'Dampak: Kerugian food waste tersembunyi hingga puluhan juta per bulan dan potensi kebocoran bahan.'
          }),
          ...createCheckboxItem('Antrean kasir panjang di jam sibuk karena kasir lambat mencatat pesanan & sering salah dengar varian/meja.', {
            noteField: true,
            subtext: 'Dampak: Meja lambat berputar (low table turnover), tamu komplain, dan makanan salah masak terbuang.'
          }),
          ...createCheckboxItem('Tiket pesanan dapur sering hilang, terkena minyak kuah, atau urutan memasak koki tertukar.', {
            noteField: true,
            subtext: 'Dampak: Tamu menunggu lebih dari 30 menit, hidangan dingin sebelum diantar, dan ulasan bintang 1 di Google Review.'
          }),
          ...createCheckboxItem('Pemilik restoran baru mengetahui omzet dan HPP aktual 2 minggu setelah bulan berakhir.', {
            noteField: true,
            subtext: 'Dampak: Terlambat mengambil keputusan promosi, tidak bisa negosiasi harga supplier, dan margin tergerus.'
          }),

          new Paragraph({
            spacing: { before: 80, after: 120 },
            children: [
              new TextRun({
                text: 'Catatan Masalah Operasional Khusus Outlet Klien (Bisa Ditulis Tangan / Diketik):',
                bold: true,
                size: 21,
                color: COLOR_PRIMARY
              }),
              new TextRun({
                text: '\n[ ____________________________________________________________________________________________________ ]\n[ ____________________________________________________________________________________________________ ]',
                color: COLOR_MUTED,
                size: 20
              })
            ]
          }),

          createHeading2('1.2 Product Catalog & Checklist Pemilihan Modul Restoran'),
          createParagraph('Centang [ ☑ ] paket modul yang ingin diaktifkan sesuai tipe bisnis restoran Anda:'),

          ...createImageFigure(
            sysCaptures.pos,
            'Katalog Menu Kasir POS & Matriks Pemetaan Modul RestoSync',
            580,
            330
          ),

          ...createCheckboxItem('Modul Fine Dining: Manajemen Meja 3D, Split Bill per Kursi, Reservasi VIP, dan Multi-Course Pacing.', {
            checked: clientData.restoType === 'finedining'
          }),
          ...createCheckboxItem('Modul QSR / Fast Food: Layar Antrean Tamu (Queue Calling Display), Input Kasir Cepat <45 Detik, dan KDS Stasiun Cepat.', {
            checked: clientData.restoType === 'qsr' || !clientData.restoType
          }),
          ...createCheckboxItem('Modul Cloud Kitchen: Multi-Brand dalam 1 Dapur, Integrasi Pesanan Ojek Online (Grab/Gojek/Shopee), dan Printer Stiker.', {
            checked: clientData.restoType === 'cloud'
          }),
          ...createCheckboxItem('Modul Coffee Shop & Bakery: Kustomisasi Biji Kopi, Tingkat Gula, Tampilan Barista Cup Queue, & Loyalty Stamp Member.', {
            checked: clientData.restoType === 'coffee'
          }),

          createHeading2('1.3 Lembar Isian & Target Finansial ROI Outlet Klien'),
          createParagraph('Isi data finansial restoran Anda pada tabel di bawah ini untuk menghitung proyeksi balik modal:'),

          ...createImageFigure(
            preSalesCaptures.roi,
            'Kerangka Model Proyeksi Finansial & Payback Period Restoran',
            580,
            330
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('PARAMETER FINANSIAL', { isHeader: true, widthPercent: 40 }),
                  createTableCell('DATA OUTLET KLIEN (BISA DIISI / TULIS TANGAN)', { isHeader: true, widthPercent: 35 }),
                  createTableCell('PROYEKSI EFISIENSI SISTEM', { isHeader: true, widthPercent: 25 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Rata-rata Omzet Penjualan Bulanan', { bold: true }),
                  createTableCell(monthlyRevenueStr, { isDotted: true, bold: hasRevenue }),
                  createTableCell('Baseline kalkulasi')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Estimasi Food Cost / COGS (%)', { bold: true }),
                  createTableCell(foodCostStr, { isDotted: true, bold: hasFoodCost }),
                  createTableCell('HPP Bahan Baku')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Target Penghematan Food Waste (5%)', { bold: true }),
                  createTableCell(wasteSavingsStr, { bold: hasRevenue, color: COLOR_SUCCESS, isDotted: !hasRevenue }),
                  createTableCell('Via Resep BOM Atomik')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Pencegahan Kebocoran Kas Kasir (1%)', { bold: true }),
                  createTableCell(cashierSavingsStr, { bold: hasRevenue, color: COLOR_SUCCESS, isDotted: !hasRevenue }),
                  createTableCell('Eliminasi Selisih Laci')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Target Periode Balik Modal (Payback)', { bold: true }),
                  createTableCell(paybackStr, { isDotted: true, bold: true, color: COLOR_PRIMARY }),
                  createTableCell('Target ROI Klien')
                ]
              })
            ]
          }),

          createHeading2('1.4 Checklist Inventarisasi Hardware & Alamat IP'),
          createParagraph('Isi dan centang status kepemilikan perangkat keras yang ada di outlet restoran Anda:'),

          ...createImageFigure(
            preSalesCaptures.hardware,
            'Topologi Jaringan Lokal LAN & Perangkat Keras Restoran Berkecepatan Tinggi',
            580,
            330
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('PERANGKAT', { isHeader: true, widthPercent: 24 }),
                  createTableCell('KEBUTUHAN', { isHeader: true, widthPercent: 14 }),
                  createTableCell('STATUS PENGADAAN', { isHeader: true, widthPercent: 26 }),
                  createTableCell('MERK / S/N / ALAMAT IP (BISA DIISI)', { isHeader: true, widthPercent: 26 }),
                  createTableCell('TEST', { isHeader: true, widthPercent: 10 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Tablet Kasir Utama (POS 10.1")', { bold: true }),
                  createTableCell('[ ___ ] Unit', { align: AlignmentType.CENTER }),
                  createTableCell('[ ☐ ] Milik Resto  [ ☐ ] Beli Paket', { isDotted: true }),
                  createTableCell('Merk: ____________ S/N: ____________\nIP: 192.168.10.50', { isDotted: true }),
                  createTableCell('[ ☐ ] Ok', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Display Dapur (KDS 15.6")', { bold: true }),
                  createTableCell('[ ___ ] Unit', { align: AlignmentType.CENTER }),
                  createTableCell('[ ☐ ] Milik Resto  [ ☐ ] Beli Paket', { isDotted: true }),
                  createTableCell('Merk: ____________ S/N: ____________\nIP: 192.168.10.150', { isDotted: true }),
                  createTableCell('[ ☐ ] Ok', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Thermal Printer Dapur LAN 80mm', { bold: true }),
                  createTableCell('[ ___ ] Unit', { align: AlignmentType.CENTER }),
                  createTableCell('[ ☐ ] Epson  [ ☐ ] Sunmi  [ ☐ ] Lain', { isDotted: true }),
                  createTableCell('IP Statis: 192.168.10.201\nPort: 9100 RAW', { isDotted: true }),
                  createTableCell('[ ☐ ] Ok', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Thermal Printer Kasir 80mm', { bold: true }),
                  createTableCell('[ ___ ] Unit', { align: AlignmentType.CENTER }),
                  createTableCell('[ ☐ ] USB  [ ☐ ] BT  [ ☐ ] Beli Paket', { isDotted: true }),
                  createTableCell('Merk: ____________ S/N: ____________\nKonektor: RJ-11 Drawer', { isDotted: true }),
                  createTableCell('[ ☐ ] Ok', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Laci Uang Kasir (Cash Drawer)', { bold: true }),
                  createTableCell('[ ___ ] Unit', { align: AlignmentType.CENTER }),
                  createTableCell('[ ☐ ] RJ-11 Port  [ ☐ ] Beli Paket', { isDotted: true }),
                  createTableCell('Tipe: 5 Slot Uang Kertas + 8 Koin\nKabel: RJ-11 ke Printer Kasir', { isDotted: true }),
                  createTableCell('[ ☐ ] Ok', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Router Wi-Fi 6 & Switch 8-Port', { bold: true }),
                  createTableCell('[ ___ ] Unit', { align: AlignmentType.CENTER }),
                  createTableCell('[ ☐ ] Gigabit LAN  [ ☐ ] Beli Paket', { isDotted: true }),
                  createTableCell('SSID: ______________________________\nPassword: __________________________', { isDotted: true }),
                  createTableCell('[ ☐ ] Ok', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Perangkat Tambahan 1 (Custom)', { isDotted: true }),
                  createTableCell('[ ___ ] Unit', { align: AlignmentType.CENTER, isDotted: true }),
                  createTableCell('[ ☐ ] Milik Resto  [ ☐ ] Beli Paket', { isDotted: true }),
                  createTableCell('Nama: ______________________________\nS/N / IP: __________________________', { isDotted: true }),
                  createTableCell('[ ☐ ] Ok', { align: AlignmentType.CENTER, isDotted: true })
                ]
              })
            ]
          }),

          // ==========================================
          // FASE 2: ANALISIS KEBUTUHAN (BRD) & LEMBAR RESEP
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('FASE 2: TAHAP ANALISIS KEBUTUHAN & DESAIN SOLUSI (BRD)'),
          createParagraph('Fase ini mendokumentasikan arsitektur sistem, lembar resep bahan baku (BOM) kosong untuk diisi koki, dan formulir pendaftaran akun pengguna.'),

          createHeading2('2.1 Diagram Swimlane Alur Komunikasi Antar-Sistem Restoran'),
          createParagraph('Diagram 4 jalur ini menggambarkan bagaimana pesanan mengalir antar terminal secara real-time:'),

          ...createImageFigure(
            sysCaptures.swimlane,
            'Diagram Swimlane Alur Komunikasi 4 Sistem: Kasir (POS) ➔ Dapur (KDS) ➔ Gudang ➔ Dashboard',
            580,
            330
          ),

          createBullet('Kasir memilih menu / tamu memindai QR meja. Sistem secara otomatis menghitung kebutuhan gramatur bahan resep BOM.', 'Jalur 1 - Kasir (POS):'),
          createBullet('Pesanan terverifikasi langsung muncul pada layar koki dengan audio chime lonceng dan timer SLA porsi.', 'Jalur 2 - Layar Dapur (KDS):'),
          createBullet('Pengecekan stok rak dan auto-deduct batch FEFO. Jika bahan habis, sistem memicu penolakan aman.', 'Jalur 3 - Gudang & Stok:'),
          createBullet('Pemilik restoran menerima analitik real-time: Gross Margin, status HPP, peringatan stok kritis, dan proyeksi omzet harian.', 'Jalur 4 - Dashboard Eksekutif:'),

          createHeading2('2.2 Lembar Isian Resep Master BOM (5 Menu Andalan Restoran)'),
          createParagraph('Tuliskan resep takaran baku (Bill of Materials) untuk 5 menu andalan outlet Anda pada tabel kosong di bawah ini:'),

          ...createImageFigure(
            sysCaptures.pos,
            'Antarmuka Kasir (POS): Pemilihan Menu & Perhitungan Otomatis Kebutuhan Bahan Baku Resep',
            580,
            330
          ),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('NO', { isHeader: true, widthPercent: 8 }),
                  createTableCell('NAMA MENU JUAL', { isHeader: true, widthPercent: 30 }),
                  createTableCell('KATEGORI', { isHeader: true, widthPercent: 16 }),
                  createTableCell('RINCIAN BAHAN BAKU MENTAH & TAKARAN (BOM) (BISA DIISI)', { isHeader: true, widthPercent: 32 }),
                  createTableCell('EST. HPP (RP)', { isHeader: true, widthPercent: 14 })
                ]
              }),
              ...(clientData.menus && clientData.menus.length > 0
                ? clientData.menus.map((m, idx) => 
                    new TableRow({
                      children: [
                        createTableCell(`${idx + 1}`, { align: AlignmentType.CENTER }),
                        createTableCell(m.name || 'Nama: _______________________', { bold: true, isDotted: !m.name }),
                        createTableCell(m.category || '[ ☐ ] Mkn  [ ☐ ] Mnm', { isDotted: !m.category }),
                        createTableCell(`1. ${m.b1 || '________________ : ___ gr/ml'}\n2. ${m.b2 || '________________ : ___ gr/ml'}\n3. ${m.b3 || '________________ : ___ gr/ml'}`, { isDotted: true }),
                        createTableCell(m.hpp ? `Rp ${m.hpp}` : 'Rp _________', { align: AlignmentType.RIGHT, isDotted: !m.hpp })
                      ]
                    })
                  )
                : [1, 2, 3, 4, 5].map((num) =>
                    new TableRow({
                      children: [
                        createTableCell(`${num}`, { align: AlignmentType.CENTER }),
                        createTableCell('Nama: _______________________', { isDotted: true, bold: true }),
                        createTableCell('[ ☐ ] Makanan\n[ ☐ ] Minuman', { isDotted: true }),
                        createTableCell('Bahan 1: ________________ : ___ gr/ml\nBahan 2: ________________ : ___ gr/ml\nBahan 3: ________________ : ___ gr/ml\nBahan 4: ________________ : ___ gr/ml', { isDotted: true }),
                        createTableCell('Rp _________', { isDotted: true, align: AlignmentType.RIGHT })
                      ]
                    })
                  )
              )
            ]
          }),

          createHeading2('2.3 Checklist Kebijakan Penanganan Kasus Stok Defisit (HTTP 409)'),
          createParagraph('Pilih centang [ ☑ ] kebijakan yang disepakati jika kasir menginput pesanan saat stok bahan baku habis di dapur:'),

          ...createImageFigure(
            sysCaptures.insufficientStock,
            'Modal Proteksi Stok Defisit: Konfirmasi Rollback Kasir, Notifikasi KDS, dan Alert Dashboard',
            580,
            330
          ),

          ...createCheckboxItem('Kebijakan 1: Atomic Rollback Penuh (Sistem membatalkan reservasi dan saldo kasir tidak berkurang sepihak).', {
            checked: true
          }),
          ...createCheckboxItem('Kebijakan 2: Tampilkan Pop-up Rekomendasi Menu Serupa kepada Kasir untuk ditawarkan ke tamu.', {
            checked: true
          }),
          ...createCheckboxItem('Kebijakan 3: Berikan opsi Otorisasi PIN Supervisor / Manajer untuk substitusi bahan baku alternatif.', {
            checked: true
          }),
          ...createCheckboxItem('Kebijakan 4: Otomatis kunci status menu menjadi "SOLD OUT" di seluruh layar KDS dan QR Meja Tamu.', {
            checked: true
          }),

          new Paragraph({
            spacing: { before: 80, after: 120 },
            children: [
              new TextRun({
                text: 'Batas Maksimum Pembatalan / Void Struk Kasir Tanpa PIN Supervisor: ',
                bold: true,
                size: 21,
                color: COLOR_PRIMARY
              }),
              new TextRun({
                text: 'Rp [ ____________________ ] (Default: Wajib PIN untuk semua nominal)',
                color: COLOR_MUTED,
                size: 20
              })
            ]
          }),

          createHeading2('2.4 Formulir Pendaftaran Akun Staf & Hak Akses (User RBAC)'),
          createParagraph('Tuliskan nama staf outlet dan beri centang peran akses yang diberikan (tanpa data dummy):'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('NO', { isHeader: true, widthPercent: 8 }),
                  createTableCell('NAMA LENGKAP STAF', { isHeader: true, widthPercent: 28 }),
                  createTableCell('NO. WA / TELEPON', { isHeader: true, widthPercent: 20 }),
                  createTableCell('JABATAN', { isHeader: true, widthPercent: 16 }),
                  createTableCell('PERAN HAK AKSES SISTEM', { isHeader: true, widthPercent: 28 })
                ]
              }),
              ...(clientData.staff && clientData.staff.length > 0
                ? clientData.staff.map((st, idx) =>
                    new TableRow({
                      children: [
                        createTableCell(`${idx + 1}`, { align: AlignmentType.CENTER }),
                        createTableCell(st.name || 'Nama: _______________________', { bold: !!st.name, isDotted: !st.name }),
                        createTableCell(st.phone || 'WA: ________________', { isDotted: !st.phone }),
                        createTableCell(st.role || 'Jabatan: _____________', { isDotted: !st.role }),
                        createTableCell(`[ ☑ ] ${st.role || 'Staf'}`, { bold: true })
                      ]
                    })
                  )
                : [
                    new TableRow({
                      children: [
                        createTableCell('1', { align: AlignmentType.CENTER }),
                        createTableCell(clientData.clientPicName || 'Nama: _______________________', { bold: true, isDotted: !clientData.clientPicName }),
                        createTableCell(clientData.clientPhone || 'WA: ________________', { isDotted: !clientData.clientPhone }),
                        createTableCell(clientData.clientRole || 'Pemilik / GM', { isDotted: !clientData.clientRole }),
                        createTableCell('[ ☑ ] Owner / GM   [ ☐ ] Lainnya', { bold: true, color: COLOR_PRIMARY })
                      ]
                    }),
                    new TableRow({
                      children: [
                        createTableCell('2', { align: AlignmentType.CENTER }),
                        createTableCell('Nama: _______________________', { isDotted: true }),
                        createTableCell('WA: ________________', { isDotted: true }),
                        createTableCell('Store Manager / SPV', { isDotted: true }),
                        createTableCell('[ ☐ ] Store Manager   [ ☐ ] Supervisor', { isDotted: true })
                      ]
                    }),
                    new TableRow({
                      children: [
                        createTableCell('3', { align: AlignmentType.CENTER }),
                        createTableCell('Nama: _______________________', { isDotted: true }),
                        createTableCell('WA: ________________', { isDotted: true }),
                        createTableCell('Head Chef / Cook', { isDotted: true }),
                        createTableCell('[ ☐ ] Head Chef   [ ☐ ] Barista', { isDotted: true })
                      ]
                    }),
                    new TableRow({
                      children: [
                        createTableCell('4', { align: AlignmentType.CENTER }),
                        createTableCell('Nama: _______________________', { isDotted: true }),
                        createTableCell('WA: ________________', { isDotted: true }),
                        createTableCell('Kasir Kasir Utama', { isDotted: true }),
                        createTableCell('[ ☐ ] Kasir Utama   [ ☐ ] Pramusaji', { isDotted: true })
                      ]
                    }),
                    new TableRow({
                      children: [
                        createTableCell('5', { align: AlignmentType.CENTER }),
                        createTableCell('Nama: _______________________', { isDotted: true }),
                        createTableCell('WA: ________________', { isDotted: true }),
                        createTableCell('Staf Gudang & Logistik', { isDotted: true }),
                        createTableCell('[ ☐ ] Gudang & Purchasing', { isDotted: true })
                      ]
                    })
                  ]
              )
            ]
          }),

          // ==========================================
          // FASE 3: IMPLEMENTASI & GO-LIVE (CHECKLIST UAT)
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('FASE 3: TAHAP IMPLEMENTASI, ONBOARDING & GO-LIVE'),
          createParagraph('Gunakan lembar checklist di bawah ini untuk memantau kemajuan implementasi dan melakukan uji terima sistem (UAT) sebelum outlet dibuka.'),

          createHeading2('3.1 Checklist Rencana Kerja 4 Minggu (Roadmap Paraf)'),
          createParagraph('Beri tanda centang [ ☑ ] pada milestone yang telah selesai dilaksanakan beserta tanggal dan paraf PIC:'),

          ...createCheckboxItem('Minggu 1: Audit Restoran, Finalisasi Data Menu, & Resep BOM Takaran Gramatur.', {
            subtext: 'Target Output: File Master CSV Resep selesai diisi & diverifikasi oleh Head Chef.',
            noteField: true
          }),
          ...createCheckboxItem('Minggu 2: Penarikan Kabel LAN CAT6, Konfigurasi IP Statis Printer Dapur, & Pasang Tablet KDS.', {
            subtext: 'Target Output: Uji ping jaringan lancar & printer dapur merespons perintah cetak lokal.',
            noteField: true
          }),
          ...createCheckboxItem('Minggu 3: Training Intensif Staf (Kasir, Koki, Gudang) & Simulasi Jam Sibuk Tanpa Tamu.', {
            subtext: 'Target Output: Kasir lulus tes input pesanan <45 detik & koki mahir mengoperasikan KDS.',
            noteField: true
          }),
          ...createCheckboxItem('Minggu 4: Pelaksanaan UAT dengan Pemilik Restoran, Migrasi Stok Awal, & Cutover Go-Live.', {
            subtext: 'Target Output: Seluruh transaksi hari pertama berjalan lancar dengan pendampingan on-site.',
            noteField: true
          }),

          createHeading2('3.2 Lembar UAT (User Acceptance Testing) 10 Kriteria Pengujian'),
          createParagraph('Uji coba 10 skenario di bawah ini bersama Tim RestoSync, lalu beri centang LULUS atau PERLU REVISI:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('NO', { isHeader: true, widthPercent: 8 }),
                  createTableCell('SKENARIO PENGUJIAN UAT', { isHeader: true, widthPercent: 40 }),
                  createTableCell('HASIL PENGUJIAN (CENTANG SALAH SATU)', { isHeader: true, widthPercent: 32 }),
                  createTableCell('PARAF PENGUJI', { isHeader: true, widthPercent: 20 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('1', { align: AlignmentType.CENTER }),
                  createTableCell('Kasir input pesanan meja makan di tempat (Dine-in)'),
                  createTableCell('[ ☐ ] LULUS   [ ☐ ] PERLU REVISI', { bold: true }),
                  createTableCell('Paraf: __________')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('2', { align: AlignmentType.CENTER }),
                  createTableCell('Tiket pesanan tercetak di printer thermal dapur <2 detik'),
                  createTableCell('[ ☐ ] LULUS   [ ☐ ] PERLU REVISI', { bold: true }),
                  createTableCell('Paraf: __________')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('3', { align: AlignmentType.CENTER }),
                  createTableCell('Layar KDS dapur berbunyi lonceng "Ting-Ting" dan timer mulai'),
                  createTableCell('[ ☐ ] LULUS   [ ☐ ] PERLU REVISI', { bold: true }),
                  createTableCell('Paraf: __________')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('4', { align: AlignmentType.CENTER }),
                  createTableCell('Pemesanan item dengan stok habis memicu blokir HTTP 409'),
                  createTableCell('[ ☐ ] LULUS   [ ☐ ] PERLU REVISI', { bold: true }),
                  createTableCell('Paraf: __________')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('5', { align: AlignmentType.CENTER }),
                  createTableCell('Penerimaan bahan masuk (Goods In) menambah stok gudang'),
                  createTableCell('[ ☐ ] LULUS   [ ☐ ] PERLU REVISI', { bold: true }),
                  createTableCell('Paraf: __________')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('6', { align: AlignmentType.CENTER }),
                  createTableCell('Koki mencatat bahan gosong/tumpah via tombol Log Waste'),
                  createTableCell('[ ☐ ] LULUS   [ ☐ ] PERLU REVISI', { bold: true }),
                  createTableCell('Paraf: __________')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('7', { align: AlignmentType.CENTER }),
                  createTableCell('Pembayaran split bill non-tunai (QRIS & Kartu Debit)'),
                  createTableCell('[ ☐ ] LULUS   [ ☐ ] PERLU REVISI', { bold: true }),
                  createTableCell('Paraf: __________')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('8', { align: AlignmentType.CENTER }),
                  createTableCell('Cetak Z-Report kasir cocok persis dengan uang laci kas'),
                  createTableCell('[ ☐ ] LULUS   [ ☐ ] PERLU REVISI', { bold: true }),
                  createTableCell('Paraf: __________')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('9', { align: AlignmentType.CENTER }),
                  createTableCell('Mode Offline: Saat kabel internet ISP dicabut, POS tetap bisa order'),
                  createTableCell('[ ☐ ] LULUS   [ ☐ ] PERLU REVISI', { bold: true }),
                  createTableCell('Paraf: __________')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('10', { align: AlignmentType.CENTER }),
                  createTableCell('Sinkronisasi data otomatis saat internet ISP tersambung kembali'),
                  createTableCell('[ ☐ ] LULUS   [ ☐ ] PERLU REVISI', { bold: true }),
                  createTableCell('Paraf: __________')
                ]
              })
            ]
          }),

          // ==========================================
          // FASE 4: PANDUAN OPERASIONAL & FORMULIR HARIAN
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('FASE 4: PANDUAN OPERASIONAL HARIAN & SOP RESTORAN'),
          createParagraph('Lembar kerja ini wajib dipatuhi dan diisi oleh kasir, koki, dan manajer restoran setiap harinya.'),

          ...createImageFigure(
            preSalesCaptures.timeline,
            'Diagram Tiga Fase Standar Operasional Harian: Pembukaan (Opening), Jam Sibuk (Peak Hours), dan Penutupan (Closing)',
            580,
            330
          ),

          createHeading2('4.1 Lembar Checklist Harian Pembukaan (Daily Opening Sheet)'),
          createParagraph('Waktu: 09:00 - 10:00 (Wajib diisi kasir dan supervisor sebelum pintu restoran dibuka):'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('TANGGAL: [ ____ / ____ / 2026 ]', { bold: true, widthPercent: 50, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('NAMA KASIR BUKA: ___________________________', { bold: true, widthPercent: 50, fillColor: COLOR_BG_LIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('DAFTAR TUGAS PEMBUKAAN (OPENING CHECKLIST)', { isHeader: true, widthPercent: 75 }),
                  createTableCell('STATUS CENTANG', { isHeader: true, widthPercent: 25 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('1. Nyalakan tablet kasir utama & pastikan tersambung ke Wi-Fi 5GHz "RESTO-POS-SECURE"'),
                  createTableCell('[ ☐ ] SELESAI', { align: AlignmentType.CENTER, bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('2. Hitung fisik uang modal kembalian kasir awal di laci. Masukkan nominal ke POS.\nNominal Modal Awal Terhitung: Rp [ ____________________ ]'),
                  createTableCell('[ ☐ ] SELESAI', { align: AlignmentType.CENTER, bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('3. Lakukan Test Print printer kasir dan printer dapur. Pastikan rol kertas 80mm tebal & pemotong tajam.'),
                  createTableCell('[ ☐ ] SELESAI', { align: AlignmentType.CENTER, bold: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('4. Koki menyalakan layar KDS dan memeriksa menu berstok kritis. Jika supplier terlambat kirim bahan, tandai "Habis Sementara" sebelum jam buka.'),
                  createTableCell('[ ☐ ] SELESAI', { align: AlignmentType.CENTER, bold: true })
                ]
              })
            ]
          }),

          createParagraph('\nTanda Tangan Kasir Pembuka: ____________________  |  Tanda Tangan Supervisor: ____________________', { bold: true }),

          createHeading2('4.2 Formulir Rekonsiliasi Kas Laci (Daily Cash Closing Sheet)'),
          createParagraph('Waktu: 21:30 - 23:00 (Penutupan Shift & Blind Cash Count untuk mencegah kebocoran kas):'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('TANGGAL: [ ____ / ____ / 2026 ]', { bold: true, widthPercent: 50, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('NAMA KASIR TUTUP: ___________________________', { bold: true, widthPercent: 50, fillColor: COLOR_BG_LIGHT })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('RINCIAN PECAHAN UANG FISIK DI LACI KASIR', { isHeader: true, widthPercent: 60 }),
                  createTableCell('JUMLAH LEMBAR / KEPING (BISA DIISI)', { isHeader: true, widthPercent: 40 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Pecahan Rp 100.000'),
                  createTableCell(clientData.cash100k !== undefined ? `[ ${clientData.cash100k} ] lembar = Rp ${(clientData.cash100k * 100000).toLocaleString('id-ID')}` : '[ ______ ] lembar = Rp ____________________', { isDotted: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Pecahan Rp 50.000'),
                  createTableCell(clientData.cash50k !== undefined ? `[ ${clientData.cash50k} ] lembar = Rp ${(clientData.cash50k * 50000).toLocaleString('id-ID')}` : '[ ______ ] lembar = Rp ____________________', { isDotted: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Pecahan Rp 20.000'),
                  createTableCell(clientData.cash20k !== undefined ? `[ ${clientData.cash20k} ] lembar = Rp ${(clientData.cash20k * 20000).toLocaleString('id-ID')}` : '[ ______ ] lembar = Rp ____________________', { isDotted: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Pecahan Rp 10.000 / Rp 5.000 / Rp 2.000'),
                  createTableCell(clientData.cash10k !== undefined ? `[ ${clientData.cash10k} ] lembar = Rp ${(clientData.cash10k * 10000).toLocaleString('id-ID')}` : '[ ______ ] lembar = Rp ____________________', { isDotted: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Uang Koin / Logam Kembalian'),
                  createTableCell(clientData.cashCoins !== undefined ? `Total Koin = Rp ${clientData.cashCoins.toLocaleString('id-ID')}` : 'Total Koin = Rp ____________________', { isDotted: true })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('TOTAL FISIK UANG DI LACI (A)', { bold: true, fillColor: 'EFF6FF' }),
                  createTableCell('Rp ____________________ (Fisik Laci)', { bold: true, fillColor: 'EFF6FF' })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('TOTAL OMZET TUNAI SISTEM POS / Z-REPORT (B)', { bold: true, fillColor: 'EFF6FF' }),
                  createTableCell(clientData.cashPosReport !== undefined ? `Rp ${clientData.cashPosReport.toLocaleString('id-ID')} (Sistem POS)` : 'Rp ____________________ (Sistem POS)', { bold: true, fillColor: 'EFF6FF' })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('SELISIH KAS (A - B) - WAJIB RP 0 (ZERO VARIANCE)', { bold: true, fillColor: 'FEF3C7' }),
                  createTableCell('Rp ____________________ ([ ☐ ] Match [ ☐ ] Selisih)', { bold: true, color: 'B45309', fillColor: 'FEF3C7' })
                ]
              })
            ]
          }),

          createParagraph('\nKeterangan Selisih Kas (jika ada): ____________________________________________________________________\nParaf Kasir: ____________________  |  Paraf Store Manager: ____________________', { italic: true }),

          createHeading2('4.3 Lembar Log Troubleshooting & Insiden Operasional'),
          createParagraph('Gunakan tabel kosong ini untuk mencatat kejadian kendala teknis dan tindakan yang diambil oleh tim:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('TANGGAL & JAM', { isHeader: true, widthPercent: 18 }),
                  createTableCell('GEJALA KENDALA (PRINTER / OFFLINE / KDS)', { isHeader: true, widthPercent: 35 }),
                  createTableCell('TINDAKAN PERBAIKAN STAF', { isHeader: true, widthPercent: 35 }),
                  createTableCell('SELESAI', { isHeader: true, widthPercent: 12 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('___/___/2026 __:__', { isDotted: true }),
                  createTableCell('Kendala: _________________________________', { isDotted: true }),
                  createTableCell('Tindakan: _________________________________', { isDotted: true }),
                  createTableCell('[ ☐ ] Ya', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('___/___/2026 __:__', { isDotted: true }),
                  createTableCell('Kendala: _________________________________', { isDotted: true }),
                  createTableCell('Tindakan: _________________________________', { isDotted: true }),
                  createTableCell('[ ☐ ] Ya', { align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('___/___/2026 __:__', { isDotted: true }),
                  createTableCell('Kendala: _________________________________', { isDotted: true }),
                  createTableCell('Tindakan: _________________________________', { isDotted: true }),
                  createTableCell('[ ☐ ] Ya', { align: AlignmentType.CENTER })
                ]
              })
            ]
          }),

          // ==========================================
          // LEMBAR PENGESAHAN & TANDA TANGAN (SIGN-OFF)
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('LEMBAR PENGESAHAN & TANDA TANGAN RESMI (SIGN-OFF)'),
          createParagraph('Dengan menandatangani dokumen ini, kedua belah pihak menyatakan sepakat dan menyetujui seluruh ruang lingkup, hasil simulasi ROI, spesifikasi teknis, hasil pengujian UAT, serta standar operasional prosedur yang tercantum di dalam Dokumen Induk ini:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('PIHAK KLIEN (MANAJEMEN RESTORAN)', { isHeader: true, widthPercent: 50, align: AlignmentType.CENTER }),
                  createTableCell('PIHAK PENYEDIA SISTEM (RESTOSYNC PLATFORM)', { isHeader: true, widthPercent: 50, align: AlignmentType.CENTER })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorderStandard,
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      createParagraph('Disetujui dan Diterima Oleh:', { bold: true }),
                      createParagraph('\n\n\n_________________________________________', { color: COLOR_MUTED }),
                      createParagraph(`Nama: ${picName}`, { bold: true }),
                      createParagraph(`Jabatan: ${picRole}`),
                      createParagraph(`Nama Outlet: ${restoName}`),
                      createParagraph('Tanggal Pengesahan: [ ____ / ____ / 2026 ]'),
                      new Paragraph({
                        spacing: { before: 80 },
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: '[ CAP / STEMPEL RESMI RESTORAN ]',
                            italics: true,
                            size: 18,
                            color: COLOR_MUTED
                          })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    margins: { top: 140, bottom: 140, left: 160, right: 160 },
                    children: [
                      createParagraph('Diserahkan Resmi Oleh:', { bold: true }),
                      createParagraph('\n\n\n_________________________________________', { color: COLOR_MUTED }),
                      createParagraph('Nama: Lead Solution Architect', { bold: true }),
                      createParagraph('Jabatan: Head of Enterprise Architecture & Deployment'),
                      createParagraph('Perusahaan: PT RestoSync Solusi Indonesia'),
                      createParagraph('Tanggal Pengesahan: 14 Oktober 2026'),
                      new Paragraph({
                        spacing: { before: 80 },
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: '[ CAP / STEMPEL RESMI RESTOSYNC ]',
                            italics: true,
                            size: 18,
                            color: COLOR_MUTED
                          })
                        ]
                      })
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
                text: '=== AKHIR DARI DOKUMEN INDUK & LEMBAR KERJA SISTEM RESTORAN (4 FASE) ===',
                bold: true,
                size: 19,
                color: COLOR_MUTED,
                font: 'Calibri'
              })
            ]
          })
        ]
      }
    ]
  });

  return await Packer.toBlob(doc);
}
