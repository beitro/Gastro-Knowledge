// Enterprise-Grade Technical Specification Document (TSD) Microsoft Word (.docx) Generator
// Produces formal, publication-ready TSD document with embedded high-resolution GastroStock captures,
// PostgreSQL DDL scripts, API payloads, concurrency control protocols, and architecture sign-off sheets.

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
import { POSTGRESQL_DDL_SCRIPT } from '../data/databaseSchemaData';

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
        font: 'Calibri'
      })
    ]
  });
}

function createCodeBlock(code: string): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '334155' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: '334155' },
              left: { style: BorderStyle.SINGLE, size: 1, color: '334155' },
              right: { style: BorderStyle.SINGLE, size: 1, color: '334155' }
            },
            shading: { type: ShadingType.CLEAR, fill: '0F172A' },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            children: code.split('\n').map(
              (line) =>
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({
                      text: line,
                      font: 'Consolas',
                      size: 19,
                      color: line.startsWith('--') || line.startsWith('//') ? '94A3B8' : line.includes('SELECT') || line.includes('CREATE') ? '38BDF8' : 'E2E8F0'
                    })
                  ]
                })
            )
          })
        ]
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
        size: 32,
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
        size: 26,
        color: COLOR_SECONDARY,
        font: 'Calibri'
      })
    ]
  });
}

function createTableCell(
  text: string,
  options: {
    bold?: boolean;
    isHeader?: boolean;
    widthPercent?: number;
    fillColor?: string;
  } = {}
): TableCell {
  const isHeader = options.isHeader || false;
  const fill = options.fillColor || (isHeader ? COLOR_PRIMARY : 'FFFFFF');
  const textColor = isHeader ? 'FFFFFF' : COLOR_TEXT_DARK;

  return new TableCell({
    borders: cellBorderStandard,
    width: { size: options.widthPercent || 25, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill },
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    children: [
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({
            text,
            bold: isHeader || options.bold || false,
            color: textColor,
            size: isHeader ? 21 : 20,
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
            margins: { top: 120, bottom: 120, left: 160, right: 140 },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 40 },
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
                    size: 20,
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
      spacing: { before: 40, after: 180 },
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

export async function generateTsdWordDocumentBlob(): Promise<Blob> {
  const captures = await generateAllSystemCaptures();

  const doc = new Document({
    creator: 'RestoSync Principal Architecture Group',
    title: 'Technical Specification Document (TSD) - RestoSync Enterprise Architecture',
    description: 'Spesifikasi Arsitektur Teknis, PostgreSQL DDL, REST API & WebSocket Event Engine',
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
                    text: 'RestoSync™ Enterprise Solution  |  Technical Specification Document (TSD)',
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
                    text: 'Halaman ',
                    size: 17,
                    color: COLOR_MUTED,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 17,
                    color: COLOR_MUTED,
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
                    color: COLOR_MUTED,
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
          new Paragraph({ spacing: { before: 800, after: 100 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({
                text: 'TECHNICAL SPECIFICATION DOCUMENT (TSD)',
                bold: true,
                size: 38,
                color: COLOR_PRIMARY,
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: 'ARSITEKTUR TEKNIS SISTEM, SKEMA DATABASE POSTGRESQL & KONTRAK API',
                bold: true,
                size: 24,
                color: COLOR_SECONDARY,
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 260 },
            children: [
              new TextRun({
                text: 'Teknologi: TypeScript · React SPA · PostgreSQL ACID · Redis Pub/Sub · WebSocket Sub-150ms · Draw.io Engine',
                italics: true,
                size: 20,
                color: COLOR_MUTED,
                font: 'Calibri'
              })
            ]
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('SISTEM ARSITEKTUR', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('RestoSync Enterprise High-Throughput Inventory Engine v2.0', { widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('KODE DOKUMEN', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('DOC-RESTOSYNC-TSD-2026-V2.0 (Engineering Architecture)', { widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('TINGKAT KEANDALAN (SLA)', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('99.95% Availability, Sub-150ms WebSocket Broadcast, Zero-Overselling Concurrency', { widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('INFRASTRUKTUR & DATABASE', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('PostgreSQL 16 (Row-Level Locking), Redis 7 (Pub/Sub Stream), Node.js Runtime', { widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('TANGGAL RILIS TEKNIS', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell(`${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })} · Status: READY FOR PRODUCTION`, { widthPercent: 70 })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 200, after: 100 } }),
          createCalloutBox(
            'TARGET DESAIN ARSITEKTUR TEKNIS (CORE ENGINEERING MANDATE)',
            'Arsitektur RestoSync dibangun di atas prinsip Zero Inconsistency dan High Availability. Sistem menggunakan transaksi isolasi Serializable dengan mekanisme pesimistik SELECT FOR UPDATE pada level baris bahan mentah, memastikan tidak akan pernah terjadi penjualan menu yang stoknya telah habis (anti-overselling), bahkan pada jam makan sibuk (peak hours) dengan puluhan terminal kasir dan KDS aktif secara paralel.',
            COLOR_PRIMARY,
            'F1F5F9'
          ),

          // ==========================================
          // BAB 1: TOPOLOGI ARSITEKTUR & INTEGRASI SISTEM
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('BAB 1: TOPOLOGI ARSITEKTUR & INTEGRASI SISTEM'),
          createParagraph('Topologi sistem RestoSync terdiri atas tiga lapisan utama:'),
          createParagraph('1. Client Presentation Tier: React 18 TypeScript Single Page Application (SPA) yang dioptimasi untuk tablet kasir POS, monitor KDS dapur, mobile scanner gudang, dan browser manajemen eksekutif.'),
          createParagraph('2. Application & Messaging Tier: Node.js/Express REST API gateway dan Redis Pub/Sub WebSocket broker yang menyalurkan mutasi tiket dapur dan stok dalam latensi sub-150 milidetik.'),
          createParagraph('3. Persistence & Transaction Tier: PostgreSQL 16 ACID-compliant relational database yang mengelola tabel master bahan, resep BOM, pesanan, dan buku besar audit (audit ledger).'),

          ...createImageFigure(
            captures.swimlane,
            'Topologi Arsitektur Cross-Functional Antar-Sistem (Kasir POS, Dapur KDS, Gudang HACCP & Executive Dashboard)'
          ),

          // ==========================================
          // BAB 2: KONTROL KONKURENSI & TRANSAKSI ACID
          // ==========================================
          createHeading1('BAB 2: KONTROL KONKURENSI & TRANSAKSI DATABASE ATOMIK'),
          createParagraph('Untuk mencegah perlombaan data (race condition) saat dua kasir checkout menu yang sama di waktu bersamaan:'),
          createParagraph('• Row-Level Locking: Sistem mengunci baris bahan baku pada tabel raw_materials menggunakan kueri SQL SELECT ... FOR UPDATE.'),
          createParagraph('• Validasi Saldo Stok: Jika (current_stock - required_stock < 0), sistem segera menjalankan perintah ROLLBACK; dan mengembalikan HTTP 409 Conflict ke kasir.'),
          createParagraph('• Atomic Deduction: Jika seluruh bahan mencukupi, stok dipotong dan tiket dapur dibuat dalam satu unit kerja atomik (COMMIT;).'),

          new Paragraph({ spacing: { before: 100, after: 60 } }),
          createCodeBlock(
`-- ATOMIC STOCK DEDUCTION WITH ROW-LEVEL LOCKING
BEGIN TRANSACTION;

-- 1. Kunci baris bahan baku secara eksklusif
SELECT id, sku, name, current_stock 
FROM raw_materials 
WHERE id IN ('mat_wagyu_beef', 'mat_rice_premium', 'mat_egg') 
FOR UPDATE;

-- 2. Validasi ketersediaan saldo fisik di database
-- Jika stok daging Wagyu < 160 gram:
-- ROLLBACK; RAISE EXCEPTION 'INSUFFICIENT_STOCK: Wagyu sisa 50g';

-- 3. Potong stok riil secara atomik
UPDATE raw_materials 
SET current_stock = current_stock - 160, updated_at = NOW() 
WHERE id = 'mat_wagyu_beef';

-- 4. Catat ke buku besar transaksi mutasi
INSERT INTO stock_transactions (
  id, material_id, transaction_type, quantity, unit, reference_type, reference_id, created_at
) VALUES (
  gen_random_uuid(), 'mat_wagyu_beef', 'OUT_SALE', 160, 'gram', 'ORDER', 'order_1082', NOW()
);

-- 5. Terbitkan tiket dapur & broadcast WebSocket
INSERT INTO kitchen_tickets (id, order_id, station, status, created_at)
VALUES (gen_random_uuid(), 'order_1082', 'HOT_KITCHEN', 'QUEUED', NOW());

COMMIT;`
          ),

          ...createImageFigure(
            captures.insufficientStock,
            'Simulasi Eksekusi Atomic Rollback Saat Validasi BOM Mendeteksi Defisit Bahan di Kasir POS'
          ),

          // ==========================================
          // BAB 3: SKEMA DATABASE RELASIONAL POSTGRESQL (DDL)
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('BAB 3: SKEMA BASIS DATA RELASIONAL POSTGRESQL (DDL)'),
          createParagraph('Berikut adalah skrip Data Definition Language (DDL) resmi untuk pembuatan tabel-tabel utama RestoSync:'),

          createCodeBlock(POSTGRESQL_DDL_SCRIPT.slice(0, 1800) + '\n\n-- [Skrip DDL tabel lanjutan: stock_transactions, kitchen_tickets, storage_zones terlampir lengkap]'),

          ...createImageFigure(
            captures.warehouse,
            'Relasi Skema Database Terhadap Tampilan Inventaris Gudang, Monitoring Suhu Chiller & Alokasi Batch FEFO'
          ),

          // ==========================================
          // BAB 4: SPESIFIKASI RESTFUL API & KONTRAK JSON
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('BAB 4: SPESIFIKASI RESTFUL API & KONTRAK DATA'),
          createParagraph('Seluruh endpoint API menggunakan format JSON standar dengan header Idempotency-Key untuk mencegah duplicate charges:'),

          createHeading2('4.1. Endpoint Checkout Kasir (POST /api/v1/orders/checkout)'),
          createCodeBlock(
`// Request Body:
{
  "orderNumber": "RS-2026-084",
  "tableNumber": "04",
  "orderType": "DINE_IN",
  "cashierId": "usr_kasir_01",
  "items": [
    { "menuItemId": "menu_wagyu_fried_rice", "quantity": 2 },
    { "menuItemId": "menu_sirloin_steak_200g", "quantity": 1 }
  ]
}

// Success Response (HTTP 201 Created):
{
  "status": "SUCCESS",
  "orderId": "ord_88201",
  "totalPrice": 372900,
  "stockDeduction": [
    { "materialSku": "RAW-BEEF-01", "name": "Daging Wagyu Meltique", "deducted": 160, "unit": "gram", "remaining": 2290 },
    { "materialSku": "RAW-BEEF-02", "name": "Sirloin Cut 200g", "deducted": 200, "unit": "gram", "remaining": 8000 }
  ],
  "kitchenTicketId": "tkt_5501",
  "wsBroadcasted": true
}`
          ),

          createHeading2('4.2. Endpoint Pencatatan Waste Dapur (POST /api/v1/kitchen/waste)'),
          createCodeBlock(
`// Request Body:
{
  "materialSku": "RAW-EGG-01",
  "quantity": 2,
  "unit": "butir",
  "reason": "PECAH_SAAT_PREP",
  "estimatedLossRp": 4400,
  "chefId": "usr_chef_kds",
  "notes": "Tumpah saat plating jam peak"
}

// Success Response (HTTP 200 OK):
{
  "status": "SUCCESS",
  "wasteLogId": "wst_9901",
  "stockUpdated": { "materialSku": "RAW-EGG-01", "newCurrentStock": 140 },
  "ledgerTransactionId": "tx_waste_7712"
}`
          ),

          ...createImageFigure(
            captures.dashboard,
            'Live Audit Ledger & Transmisi Event Stream WebSocket pada Dashboard Eksekutif RestoSync'
          ),

          // ==========================================
          // BAB 5: SPESIFIKASI DRAW.IO MULTI-TAB XML
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('BAB 5: SPESIFIKASI FORMAT DRAW.IO MULTI-TAB XML (.drawio)'),
          createParagraph('Sesuai kebutuhan integrasi diagram alur, sistem menyediakan generator file .drawio standar diagrams.net yang mengemas ke-6 skenario ke dalam 1 file multi-tab:'),
          createParagraph('• Standar Schema: XML root <mxfile host="app.diagrams.net" version="21.0.0" type="device">'),
          createParagraph('• Multi-Page Structure: Setiap skenario dibungkus dalam tag <diagram id="..." name="Tab N: ..."> dengan kanvas <mxGraphModel> terisolasi.'),
          createParagraph('• Saat file dibuka di browser diagrams.net, ke-6 tab otomatis muncul di navigasi bawah editor.'),

          // ==========================================
          // SIGN-OFF TEKNIS
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('LEMBAR PERSETUJUAN SPESIFIKASI TEKNIS (TSD SIGN-OFF)'),
          createParagraph('Dengan menandatangani dokumen ini, Lead Architect dan Technical Lead menyatakan bahwa arsitektur sistem, skema database, dan spesifikasi API di atas siap di-deploy ke lingkungan produksi Cloud Run.'),

          new Paragraph({ spacing: { before: 200, after: 100 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('LEAD SYSTEM ARCHITECT', { isHeader: true, widthPercent: 50 }),
                  createTableCell('HEAD OF INFRASTRUCTURE & SECURITY', { isHeader: true, widthPercent: 50 })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorderStandard,
                    margins: { top: 120, bottom: 120, left: 140, right: 140 },
                    children: [
                      createParagraph('Nama: Principal Enterprise Architect', { spaceAfter: 60 }),
                      createParagraph('Peran: Solution & Database Design Lead', { spaceAfter: 120 }),
                      createParagraph('Tanda Tangan: \n\n\n________________________________________', { spaceAfter: 40 }),
                      createParagraph('Tanggal: [ ______ / ______ / 2026 ]')
                    ]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    margins: { top: 120, bottom: 120, left: 140, right: 140 },
                    children: [
                      createParagraph('Nama: Lead DevOps & Reliability Engineer', { spaceAfter: 60 }),
                      createParagraph('Peran: Cloud Run & PostgreSQL Infrastructure', { spaceAfter: 120 }),
                      createParagraph('Tanda Tangan: \n\n\n________________________________________', { spaceAfter: 40 }),
                      createParagraph('Tanggal: [ ______ / ______ / 2026 ]')
                    ]
                  })
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
