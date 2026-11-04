// Enterprise-Grade Coding Standards & API Documentation (Swagger/OpenAPI) Microsoft Word (.docx) Generator
// Covers Developer Guidelines, Clean Code, Git Flow, Unit Testing, and Full API Specifications.

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
  Header,
  Footer,
  PageNumber,
  ShadingType
} from 'docx';

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

function createCodeBlock(code: string): Paragraph {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 240 },
    shading: {
      fill: 'F1F5F9',
      type: ShadingType.CLEAR
    },
    children: [
      new TextRun({
        text: code,
        font: 'Consolas',
        size: 19,
        color: '0F172A'
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

export async function generateDevWordDocumentBlob(restaurantInfo?: {
  name?: string;
  picName?: string;
}): Promise<Blob> {
  const restoTitle = restaurantInfo?.name?.trim() ? restaurantInfo.name : 'GastroStock Core Platform';
  const picTitle = restaurantInfo?.picName?.trim() ? restaurantInfo.picName : 'Lead Software Engineering Team';

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
                    text: 'RESTOSYNC / GASTROSTOCK — DEVELOPER GUIDELINES & API SPEC v2.0',
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
          // TITLE
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 120 },
            children: [
              new TextRun({
                text: 'DOKUMEN STANDAR KODE & SPESIFIKASI API',
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
                text: 'CODING STANDARDS, GIT WORKFLOW & SWAGGER / OPENAPI 3.0 SPECIFICATION',
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
                text: `Dokumen Internal Tim Developer | Arsitektur: Microservices & Event-Driven | Lead: ${picTitle}`,
                italics: true,
                size: 20,
                color: COLOR_MUTED
              })
            ]
          }),

          // METADATA
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Parameter Standar', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Ketentuan & Nilai', { isHeader: true, widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Bahasa Pemrograman', { bold: true }),
                  createTableCell('TypeScript 5.x (Strict Mode: true, noImplicitAny: true, strictNullChecks: true)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Framework & Library', { bold: true }),
                  createTableCell('React 18 SPA (Vite), Node.js / Express microservices, Tailwind CSS, Lucide Icons, docx')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Database & Concurrency', { bold: true }),
                  createTableCell('PostgreSQL 16 (Pessimistic SELECT FOR UPDATE, WAL Level Replica, UUIDv4 PK)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Standar API & Format', { bold: true }),
                  createTableCell('RESTful JSON Level 3 (OpenAPI 3.0.3) + WebSocket RFC 6455 Pub/Sub')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Target Test Coverage', { bold: true }),
                  createTableCell('Minimal 85% Code Coverage pada kalkulasi resep BOM, transaksi kasir & closing shift')
                ]
              })
            ]
          }),

          // BAGIAN 1: CODING STANDARDS
          createHeading('1. CODING STANDARDS & ARCHITECTURAL GUIDELINES', HeadingLevel.HEADING_1),
          createParagraph(
            'Aturan baku penulisan kode sumber (coding guidelines) yang wajib ditaati oleh seluruh software engineer dan kontributor baru:'
          ),
          createHeading('1.1 Prinsip TypeScript & Immutability', HeadingLevel.HEADING_2),
          createParagraph(
            '1. Hindari penggunaan tipe "any". Setiap objek data model harus didefinisikan dengan TypeScript interface atau type alias yang ketat.'
          ),
          createParagraph(
            '2. Gunakan fungsi murni (pure functions) untuk perhitungan keuangan, HPP, pembagian split bill, dan pemotongan BOM.'
          ),
          createParagraph(
            '3. Hindari mutasi langsung pada array/state React. Selalu gunakan immutable update patterns (spread operator atau functional state updates).'
          ),

          createHeading('1.2 Konvensi Penamaan (Naming Conventions)', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Elemen Kode', { isHeader: true, widthPercent: 25 }),
                  createTableCell('Konvensi', { isHeader: true, widthPercent: 25 }),
                  createTableCell('Contoh Valid', { isHeader: true, widthPercent: 25 }),
                  createTableCell('Contoh Dilarang', { isHeader: true, widthPercent: 25 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Komponen React', { bold: true }),
                  createTableCell('PascalCase'),
                  createTableCell('OrderTableGrid.tsx'),
                  createTableCell('ordertablegrid.tsx')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Variabel & Fungsi', { bold: true }),
                  createTableCell('camelCase'),
                  createTableCell('calculateBomDeduction()'),
                  createTableCell('Calculate_BOM()')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Konstanta Global', { bold: true }),
                  createTableCell('UPPER_SNAKE_CASE'),
                  createTableCell('MAX_OFFLINE_QUEUE_HOURS'),
                  createTableCell('maxOfflineQueue')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Tabel Database', { bold: true }),
                  createTableCell('snake_case (plural)'),
                  createTableCell('kitchen_tickets'),
                  createTableCell('KitchenTicket')
                ]
              })
            ]
          }),

          createHeading('1.3 Git Workflow & Pull Request (PR) Policy', HeadingLevel.HEADING_2),
          createParagraph(
            'Kami menggunakan GitHub Flow dengan branch terproteksi (protected main branch):'
          ),
          createCodeBlock('git checkout -b feat/pos-split-bill-engine\n# Format commit: <tipe>(<lingkup>): <deskripsi singkat>\n# Contoh: feat(pos): implement multi-guest split bill with decimal rounding\ngit commit -m "feat(pos): implement multi-guest split bill with decimal rounding"\ngit push origin feat/pos-split-bill-engine'),
          createParagraph(
            'Setiap Pull Request wajib melewati minimal 1 Senior Peer Review, lolos seluruh automated CI pipeline (ESLint, Prettier, TypeScript build, Jest tests), dan tidak memiliki merge conflict.'
          ),

          // BAGIAN 2: SPESIFIKASI API & SWAGGER
          createHeading('2. DOKUMENTASI REST API & INTEGRASI PIHAK KETIGA', HeadingLevel.HEADING_1),
          createParagraph(
            'Spesifikasi endpoint publik dan internal untuk integrasi frontend, EDC Payment Gateway, dan aplikasi aggregator:'
          ),

          createHeading('2.1 Endpoint Checkout Transaksi Kasir', HeadingLevel.HEADING_2),
          createParagraph('POST /api/v1/orders/checkout — Membuka transaksi ACID, mengunci baris bahan baku, dan mengurangi stok otomatis:'),
          createCodeBlock(
`POST /api/v1/orders/checkout HTTP/1.1
Host: api.resto-sync.com
Authorization: Bearer <JWT_CASHIER_TOKEN>
X-Station-Id: POS_TERMINAL_01
Idempotency-Key: a4c89f12-5813-4011-80bb-69dc3cfdb842
Content-Type: application/json

{
  "orderNumber": "ORD-20261015-0042",
  "tableNumber": 4,
  "guestCount": 3,
  "paymentMethod": "QRIS",
  "items": [
    {
      "menuItemId": "MNU-001",
      "quantity": 2,
      "notes": "Pedas level 3"
    },
    {
      "menuItemId": "MNU-004",
      "quantity": 3,
      "notes": "Es sedikit"
    }
  ]
}`
          ),
          createParagraph('Respon HTTP 201 Created jika transaksi berhasil:'),
          createCodeBlock(
`HTTP/1.1 201 Created
Content-Type: application/json

{
  "status": "SUCCESS",
  "orderId": "ORD-20261015-0042",
  "totalAmount": 145000,
  "timestamp": "2026-10-15T12:30:00Z",
  "stockDeductionSummary": [
    { "materialSku": "RAW-001", "name": "Fillet Dada Ayam", "deducted": 0.5, "unit": "kg" },
    { "materialSku": "RAW-002", "name": "Beras Premium", "deducted": 0.4, "unit": "kg" }
  ]
}`
          ),

          createHeading('2.2 Webhook Payment Gateway (QRIS Dynamic Callback)', HeadingLevel.HEADING_2),
          createParagraph('POST /api/v1/webhooks/payment-callback — Menerima sinyal pembayaran realtime dari Payment Gateway / Bank:'),
          createCodeBlock(
`POST /api/v1/webhooks/payment-callback HTTP/1.1
Host: api.resto-sync.com
X-Signature: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
Content-Type: application/json

{
  "transactionId": "TRX-QRIS-998811",
  "orderNumber": "ORD-20261015-0042",
  "grossAmount": 145000,
  "paymentStatus": "SETTLEMENT",
  "issuer": "BCA_QRIS",
  "settlementTime": "2026-10-15T12:30:15Z"
}`
          ),

          createHeading('2.3 Integrasi Food Delivery Aggregator (GrabFood / GoFood Bridge)', HeadingLevel.HEADING_2),
          createParagraph(
            'Sistem dilengkapi Webhook Ingestion Engine yang memetakan order dari mitra pengantaran makanan langsung ke antrean KDS Dapur tanpa kasir perlu mengetik ulang.'
          ),

          // PENGESAHAN DEVELOPER
          createHeading('3. PERSETUJUAN STANDAR ARSITEKTUR DEVELOPER', HeadingLevel.HEADING_1),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Engineering Lead / Architect', { isHeader: true, widthPercent: 50 }),
                  createTableCell('Quality Assurance Lead', { isHeader: true, widthPercent: 50 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell(`Nama: Solution Architecture Team\nJabatan: Principal Engineer\nTanggal: ____________________\n\n\n\nTanda Tangan: ________________________`),
                  createTableCell(`Nama: QA & Security Compliance Lead\nJabatan: Head of Testing\nTanggal: ____________________\n\n\n\nTanda Tangan: ________________________`)
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
