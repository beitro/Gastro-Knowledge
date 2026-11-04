// Enterprise-Grade Functional Specification Document (FSD) Microsoft Word (.docx) Generator
// Produces formal, publication-ready FSD document with embedded high-resolution GastroStock captures,
// detailed functional requirements, business rules, UI mockups, and sign-off sheets.

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
    spacing: { before: 180, after: 80 },
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

function createTableCell(
  text: string,
  options: {
    bold?: boolean;
    isHeader?: boolean;
    widthPercent?: number;
    fillColor?: string;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
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
        alignment: options.alignment || AlignmentType.LEFT,
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

export async function generateFsdWordDocumentBlob(): Promise<Blob> {
  const captures = await generateAllSystemCaptures();

  const doc = new Document({
    creator: 'RestoSync Solution Architecture Team',
    title: 'Functional Specification Document (FSD) - RestoSync Enterprise OS',
    description: 'Spesifikasi Fungsional Lengkap Sistem Inventaris Real-Time Restoran 4 Antarmuka',
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
                    text: 'RestoSync™ Enterprise Solution  |  Functional Specification Document (FSD)',
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
                text: 'FUNCTIONAL SPECIFICATION DOCUMENT (FSD)',
                bold: true,
                size: 38, // 19pt
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
                text: 'SPESIFIKASI KEBUTUHAN FUNGSIONAL SISTEM OPERASIONAL & INVENTARIS RESTORAN',
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
                text: 'Platform Terintegrasi: Kasir POS, Recipe BOM Engine, KDS Dapur, Gudang HACCP, & Executive Dashboard',
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
                  createTableCell('PROYEK', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('RestoSync Enterprise Restaurant OS (Gastro Knowledge System Edition)', { widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('KODE DOKUMEN', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('DOC-RESTOSYNC-FSD-2026-V2.0', { widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('STATUS DOKUMEN', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('APPROVED FOR SYSTEM IMPLEMENTATION & UAT TESTING', { bold: true, widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('TARGET IMPLEMENTASI', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell('Single & Multi-Outlet F&B (Fine Dining, Casual, QSR, Cloud Kitchen, Cafe)', { widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('VERSI / TANGGAL', { bold: true, widthPercent: 30, fillColor: COLOR_BG_LIGHT }),
                  createTableCell(`Versi 2.0 (Revisi GastroStock UI/UX) · Tanggal: ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`, { widthPercent: 70 })
                ]
              })
            ]
          }),

          new Paragraph({ spacing: { before: 200, after: 100 } }),
          createCalloutBox(
            'TUJUAN PENULISAN DOKUMEN SPESIFIKASI FUNGSIONAL (FSD)',
            'Dokumen ini mendefinisikan seluruh perilaku fungsional, aturan bisnis (business rules), alur interaksi antarmuka (UI/UX), dan validasi data yang harus disediakan oleh sistem RestoSync. Dokumen ini menjadi acuan tunggal bagi tim pengembang software, QA tester, operasional restoran, dan manajer proyek dalam fase pengembangan dan acceptance testing.',
            COLOR_PRIMARY,
            'F1F5F9'
          ),

          // ==========================================
          // BAB 1: IKHTISAR SISTEM & ARSITEKTUR FUNGSIONAL
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('BAB 1: IKHTISAR SISTEM & ARSITEKTUR FUNGSIONAL'),
          createParagraph('RestoSync adalah platform operasional restoran modern yang dirancang untuk menghilangkan blind spot pencatatan stok dan kebocoran margin dengan mengintegrasikan empat antarmuka sistem secara sub-150ms:'),
          createParagraph('1. Interface Kasir (POS): Pemesanan meja, verifikasi resep otomatis, pembayaran tunai/QRIS, dan split bill.'),
          createParagraph('2. Interface Dapur (Kitchen Display System / KDS): Penerimaan tiket pesanan otomatis, lonceng notifikasi audio ting-ting, SLA stopwatch, dan pencatatan bahan rusak/waste.'),
          createParagraph('3. Interface Gudang & Storage HACCP: Manajemen zona penyimpanan (Walk-in Chiller, Deep Freezer, Dry Storage, Gas Bay), alokasi batch FEFO, dan penerimaan barang supplier (Goods In).'),
          createParagraph('4. Dashboard Monitoring Eksekutif: Pemantauan omset langsung, kalkulasi HPP (COGS) real-time, lampu peringatan Reorder Point (ROP), dan audit ledger permanen.'),

          ...createImageFigure(
            captures.swimlane,
            'Diagram Swimlane Alur Proses Integrasi Lintas 4 Antarmuka Sistem Restoran (POS ↔ Dapur KDS ↔ Gudang HACCP ↔ Dashboard BI)'
          ),

          // ==========================================
          // BAB 2: SPESIFIKASI MODUL KASIR (POINT OF SALE / POS)
          // ==========================================
          createHeading1('BAB 2: SPESIFIKASI FUNGSIONAL MODUL KASIR (POS)'),
          createParagraph('Modul Kasir bertanggung jawab atas penerimaan pesanan pelanggan di area Front of House (FOH) serta melakukan verifikasi ketersediaan bahan mentah sebelum pembayaran diterima.'),

          createHeading2('2.1. Alur Pemesanan & Validasi Ketersediaan Menu'),
          createParagraph('Saat kasir memilih menu pada layar sentuh, sistem secara instan memanggil Recipe BOM Engine untuk memeriksa saldo bahan baku di database:'),
          createParagraph('• Kasir memilih tipe order: Dine-In (pilih nomor meja), Takeaway (nomor antrean), atau Layanan Antar Online.'),
          createParagraph('• Validasi BOM Instan: Setiap item menu menampilkan badge stok real-time (contoh: "Stok: 14 porsi"). Jika salah satu bahan resep defisit, tombol menu langsung terkunci menjadi status "SOLD-OUT".'),
          createParagraph('• Pemesanan Aman: Sistem menjamin tidak ada pesanan yang dapat dibayar jika stok fisiknya tidak mencukupi di dapur atau chiller.'),

          ...createImageFigure(
            captures.pos,
            'Tampilan Antarmuka Kasir POS Terminal 01: Katalog Menu, Sisa Porsi BOM, dan Ringkasan Tagihan Meja'
          ),

          createHeading2('2.2. Protokol Penanganan Stok Defisit & Rollback Transaksi'),
          createParagraph('Jika terjadi pesanan melebihi saldo fisik riil di gudang (contoh: tamu memesan 2 Wagyu Fried Rice namun sisa daging Wagyu hanya 50 gram dari kebutuhan 160 gram):'),
          createParagraph('1. Sistem menolak transaksi dan memicu pop-up peringatan merah di layar kasir.'),
          createParagraph('2. Database menjalankan perintah ROLLBACK; secara otomatis sehingga bahan lain (beras dan telur) batal dipotong.'),
          createParagraph('3. Kasir diberikan rekomendasi menu pengganti dengan bahan baku yang masih melimpah.'),

          ...createImageFigure(
            captures.insufficientStock,
            'Pop-up Penanganan Stok Kurang di Layar Kasir POS: Informasi Defisit Bahan & Protokol Atomic Rollback'
          ),

          // ==========================================
          // BAB 3: SPESIFIKASI KITCHEN DISPLAY SYSTEM (KDS)
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('BAB 3: SPESIFIKASI FUNGSIONAL KITCHEN DISPLAY SYSTEM (KDS)'),
          createParagraph('Kitchen Display System (KDS) menggantikan kertas struk manual dapur dengan monitor/tablet interaktif layar sentuh yang diletakkan di stasiun koki dan barista.'),

          createHeading2('3.1. Fitur Utama KDS Dapur'),
          createParagraph('• Transmisi Otomatis Sub-150ms: Begitu kasir menekan tombol bayar, tiket pesanan langsung muncul di KDS tanpa delay.'),
          createParagraph('• Notifikasi Audio "Ting-Ting": Tablet dapur membunyikan lonceng audio keras saat ada pesanan baru masuk.'),
          createParagraph('• Routing Multi-Stasiun: Item makanan berat otomatis dialirkan ke KDS Hot Kitchen koki, sedangkan minuman dialirkan ke KDS Barista.'),
          createParagraph('• Stopwatch SLA Memasak: Timer berjalan otomatis dengan indikator warna: Hijau (0-8 menit), Kuning (8-12 menit), dan Merah (>12 menit SLA breach).'),
          createParagraph('• Panggilan Runner Otomatis: Saat koki menekan tombol "Selesai Saji", sistem mengirimkan getaran/sinyal ke smartwatch atau tablet runner untuk mengambil piring di pass-bar.'),

          ...createImageFigure(
            captures.kds,
            'Layar Monitor Kitchen Display System (KDS) Dapur: Kartu Tiket Pesanan, Timer SLA, dan Tombol Pencatat Waste'
          ),

          createHeading2('3.2. Pencatatan Bahan Rusak & Gosong di Dapur (Waste Logging)'),
          createParagraph('Koki dapat langsung mencatat insiden bahan rusak saat memasak melalui tombol "Catat Waste" di layar KDS:'),
          createParagraph('• Koki memilih bahan baku (misal: Telur 2 butir, Daging Wagyu 100g).'),
          createParagraph('• Koki memilih kategori alasan: Gosong / Terlalu Matang, Tumpah di Lantai, Rusak / Busuk, atau Salah Pesanan.'),
          createParagraph('• Sistem langsung memotong stok fisik di database dengan mutasi ADJUST_WASTE sehingga hasil stock opname tetap akurat 100%.'),
          createParagraph('• Sistem mengkalkulasikan nilai kerugian finansial bahan tersebut dan melaporkannya ke Dashboard Kerugian Dapur.'),

          // ==========================================
          // BAB 4: SPESIFIKASI GUDANG, STORAGE ZONES & FEFO
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('BAB 4: SPESIFIKASI GUDANG, STORAGE HACCP & BATCH FEFO'),
          createParagraph('Modul Gudang memastikan bahan baku disimpan sesuai standar higienitas HACCP dan dikonsumsi berdasarkan urutan kedaluwarsa.'),

          createHeading2('4.1. Monitoring Suhu Ruang Penyimpanan HACCP'),
          createParagraph('Sistem menyediakan dashboard pemantau suhu terintegrasi dengan 5 zona penyimpanan:'),
          createParagraph('1. Walk-in Chiller: Suhu operasional 1°C - 4°C (penyimpanan daging sapi, ayam, dan susu segar).'),
          createParagraph('2. Deep Freezer: Suhu operasional -18°C hingga -22°C (penyimpanan bahan beku jangka panjang).'),
          createParagraph('3. Dry Storage: Suhu operasional 20°C - 24°C, kelembaban < 60% (penyimpanan beras, minyak, bumbu kering).'),
          createParagraph('4. Bar & Beverage Area: Suhu operasional 18°C - 20°C (penyimpanan sirup, kopi, garnish).'),
          createParagraph('5. Gas & Utilitas Bay: Sensor kebocoran gas LPG dan tekanan pipa keselamatan.'),

          ...createImageFigure(
            captures.warehouse,
            'Modul Inventaris Gudang GastroStock: Widget Suhu HACCP 5 Zona, Buku Besar Batch FEFO, dan Peringatan Ambang ROP'
          ),

          createHeading2('4.2. Logika Konsumsi Batch FEFO (First-Expired, First-Out)'),
          createParagraph('Untuk bahan baku yang memiliki masa kedaluwarsa pendek, sistem mewajibkan pengeluaran berdasarkan batch terdekat dari expired date:'),
          createParagraph('• Saat kasir atau dapur memotong stok, database otomatis memotong saldo dari nomor LOT/Batch dengan tanggal kedaluwarsa terdekat.'),
          createParagraph('• Mencegah pembusukan bahan di dasar rak dan menekan kerugian pembusukan bahan baku hingga 0%.'),

          // ==========================================
          // BAB 5: EXECUTIVE BI DASHBOARD & AUDIT LEDGER
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('BAB 5: SPESIFIKASI EXECUTIVE BI DASHBOARD & AUDIT LEDGER'),
          createParagraph('Dashboard Manajemen Eksekutif menyediakan visibilitas finansial dan operasional menyeluruh bagi General Manager dan Pemilik Restoran.'),

          createHeading2('5.1. Live KPI & Kalkulasi Real-Time COGS (HPP)'),
          createParagraph('• Live Omset Penjualan: Akumulasi nilai transaksi kasir ter-update setiap detik tanpa perlu refresh browser.'),
          createParagraph('• Real-time HPP / Food Cost %: Dihitung secara matematis dari gramatur bahan baku resep yang keluar dikalikan moving average unit cost ditambah kerugian waste dapur.'),
          createParagraph('• Formula Food Cost Ratio: (Total Biaya Bahan Terpakai + Biaya Waste Dapur) / Total Omset Kotor × 100%.'),
          createParagraph('• Peringatan Dini ROP: Lampu merah menyala otomatis ketika saldo bahan menyentuh batas minimum pengadaan (Reorder Point = Lead Time Demand + Safety Stock).'),

          ...createImageFigure(
            captures.dashboard,
            'Executive BI Dashboard: Grafik Tren Food Cost Harian, 4 Metrik KPI Utama, dan Live Audit Ledger Transaksi Mutasi'
          ),

          createHeading2('5.2. Buku Besar Audit Stok Permanen (Audit Ledger)'),
          createParagraph('Setiap perubahan saldo bahan dicatat secara permanen dengan tipe mutasi standar:'),
          createParagraph('• OUT_SALE: Pemotongan bahan otomatis saat pesanan kasir dibayar.'),
          createParagraph('• IN_PURCHASE: Penambahan saldo bahan saat barang supplier diterima di gudang.'),
          createParagraph('• ADJUST_WASTE: Pengurangan saldo bahan akibat tumpah, gosong, atau basi di dapur.'),
          createParagraph('• VOID_ROLLBACK: Pengembalian saldo bahan akibat pembatalan pesanan kasir.'),
          createParagraph('• ADJUST_OPNAME: Penyelarasan saldo antara hitungan fisik di rak dengan komputer.'),

          // ==========================================
          // BAB 6: MATRIKS HAK AKSES PENGGUNA (RBAC)
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('BAB 6: MATRIKS HAK AKSES PENGGUNA (RBAC)'),
          createParagraph('Untuk menjaga integritas data dan keamanan operasional restoran, hak akses pengguna dibagi ke dalam 5 tingkatan peran:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('MODUL / FITUR SISTEM', { isHeader: true, widthPercent: 30 }),
                  createTableCell('OWNER', { isHeader: true, widthPercent: 14 }),
                  createTableCell('MANAJER', { isHeader: true, widthPercent: 14 }),
                  createTableCell('KASIR', { isHeader: true, widthPercent: 14 }),
                  createTableCell('CHEF', { isHeader: true, widthPercent: 14 }),
                  createTableCell('GUDANG', { isHeader: true, widthPercent: 14 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Input Pesanan & Pembayaran Kasir', { bold: true }),
                  createTableCell('Akses Penuh'),
                  createTableCell('Akses Penuh'),
                  createTableCell('Akses Penuh'),
                  createTableCell('Tidak'),
                  createTableCell('Tidak')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Otorisasi Void / Diskon Meja', { bold: true }),
                  createTableCell('Akses Penuh'),
                  createTableCell('Akses Penuh'),
                  createTableCell('Perlu PIN Spv'),
                  createTableCell('Tidak'),
                  createTableCell('Tidak')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Monitor Tiket Dapur (KDS)', { bold: true }),
                  createTableCell('Lihat Saja'),
                  createTableCell('Akses Penuh'),
                  createTableCell('Lihat Saja'),
                  createTableCell('Akses Penuh'),
                  createTableCell('Tidak')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Catat Waste / Spoilage Dapur', { bold: true }),
                  createTableCell('Lihat Saja'),
                  createTableCell('Akses Penuh'),
                  createTableCell('Tidak'),
                  createTableCell('Akses Penuh'),
                  createTableCell('Tidak')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Penerimaan Barang PO (Goods In)', { bold: true }),
                  createTableCell('Lihat Saja'),
                  createTableCell('Approve PO'),
                  createTableCell('Tidak'),
                  createTableCell('Tidak'),
                  createTableCell('Input QC')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Eksekutif Dashboard & Laba Rugi', { bold: true }),
                  createTableCell('Akses Penuh'),
                  createTableCell('Akses Penuh'),
                  createTableCell('Tidak'),
                  createTableCell('Tidak'),
                  createTableCell('Tidak')
                ]
              })
            ]
          }),

          // ==========================================
          // LEMBAR PERSETUJUAN & SIGN-OFF
          // ==========================================
          new Paragraph({ pageBreakBefore: true }),
          createHeading1('LEMBAR PERSETUJUAN SPESIFIKASI FUNGSIONAL (SIGN-OFF)'),
          createParagraph('Dengan menandatangani dokumen ini, seluruh pemangku kepentingan menyetujui bahwa seluruh spesifikasi fungsional di atas telah lengkap, akurat, dan siap diimplementasikan ke dalam kode program sistem.'),

          new Paragraph({ spacing: { before: 200, after: 100 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('DISETUJUI OLEH PIHAK RESTORAN (KLIEN)', { isHeader: true, widthPercent: 50 }),
                  createTableCell('DISETUJUI OLEH PIHAK PENGEMBANG (RESTOSYNC)', { isHeader: true, widthPercent: 50 })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorderStandard,
                    margins: { top: 120, bottom: 120, left: 140, right: 140 },
                    children: [
                      createParagraph('Nama Outlet: ____________________________________', { spaceAfter: 60 }),
                      createParagraph('Nama PIC: ________________________________________', { spaceAfter: 60 }),
                      createParagraph('Jabatan: Pemilik Restoran / GM Operasional', { spaceAfter: 120 }),
                      createParagraph('Tanda Tangan: \n\n\n________________________________________', { spaceAfter: 40 }),
                      createParagraph('Tanggal: [ ______ / ______ / 2026 ]')
                    ]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    margins: { top: 120, bottom: 120, left: 140, right: 140 },
                    children: [
                      createParagraph('Perusahaan: RestoSync Solution Architecture Ltd', { spaceAfter: 60 }),
                      createParagraph('Lead Architect: Lead Solution Architect', { spaceAfter: 60 }),
                      createParagraph('Jabatan: Enterprise Solution Consultant', { spaceAfter: 120 }),
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
