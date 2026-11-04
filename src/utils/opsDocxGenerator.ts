// Enterprise-Grade User Manual & SOP Deployment / Troubleshooting Microsoft Word (.docx) Generator
// Covers Step-by-Step Restaurant Operations, Shift Management, Hardware Installation, and Error Code Troubleshooting.

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

function createStepItem(stepNum: string, title: string, desc: string): Paragraph {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 260 },
    children: [
      new TextRun({
        text: `Langkah ${stepNum}: [${title}] `,
        bold: true,
        size: 21,
        color: COLOR_PRIMARY,
        font: 'Segoe UI'
      }),
      new TextRun({
        text: desc,
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

export async function generateOpsWordDocumentBlob(restaurantInfo?: {
  name?: string;
  picName?: string;
  targetGoLiveDate?: string;
}): Promise<Blob> {
  const captures = await generateAllSystemCaptures();

  const restoTitle = restaurantInfo?.name?.trim() ? restaurantInfo.name : 'GastroStock Restoran Mitra';
  const picTitle = restaurantInfo?.picName?.trim() ? restaurantInfo.picName : 'Tim Support & Operasional Restoran';

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
                    text: 'RESTOSYNC / GASTROSTOCK — USER MANUAL & SOP DEPLOYMENT v2.0',
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
                text: 'BUKU PANDUAN PENGGUNA (USER MANUAL)',
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
                text: 'STANDAR OPERASIONAL PROSEDUR (SOP) DEPLOYMENT & TROUBLESHOOTING',
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
                text: `Panduan Operasional & Support Teknis | Restoran: ${restoTitle} | Penyusun: ${picTitle}`,
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
                  createTableCell('Parameter Dokumen', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Informasi Operasional', { isHeader: true, widthPercent: 70 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Judul Panduan', { bold: true }),
                  createTableCell(`Panduan Resmi Operasional Kasir, Dapur & Support Teknis (GastroStock for ${restoTitle})`)
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Audiens Pengguna', { bold: true }),
                  createTableCell('Kasir, Waiter, Barista, Head Chef, Store Supervisor, IT Support & Teknisi Lapangan')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Klasifikasi Sistem', { bold: true }),
                  createTableCell('Sistem Operasional Kritis (Tier-1 POS & Real-Time Kitchen Dispatch)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Versi Dokumen', { bold: true }),
                  createTableCell('Versi 2.0 (Stabil — Dilengkapi Matriks Error Code & Prosedur Closing Z-Report)')
                ]
              })
            ]
          }),

          // BAGIAN I: USER MANUAL OPERASIONAL HARIAN
          createHeading('BAGIAN I: BUKU PANDUAN PENGGUNA (USER MANUAL HARIAN)', HeadingLevel.HEADING_1),
          createParagraph(
            'Panduan langkah demi langkah (step-by-step) untuk memandu staf restoran dari awal buka toko hingga penutupan kasir akhir hari:'
          ),

          // Bab 1: Buka Shift Kasir
          createHeading('1. Prosedur Buka Shift & Uang Modal Kasir (Open Float)', HeadingLevel.HEADING_2),
          createParagraph('Setiap pergantian shift atau awal operasional toko pagi hari, kasir wajib melakukan buka shift sebagai berikut:'),
          createStepItem('1.1', 'Nyalakan POS & Login', 'Tekan tombol power layar POS Touchscreen. Masukkan 4-digit PIN Kasir (atau tap kartu RFID staf).'),
          createStepItem('1.2', 'Menu Buka Shift (Open Shift)', 'Sistem akan otomatis menampilkan popup konfirmasi "Buka Shift Kasir Baru".'),
          createStepItem('1.3', 'Input Uang Modal Awal (Cash Float)', 'Hitung uang receh fisik di dalam laci kasir (biasanya Rp 300.000 atau Rp 500.000). Masukkan nominal uang modal ke dalam kolom yang tersedia.'),
          createStepItem('1.4', 'Cetak Slip Buka Shift', 'Klik tombol "Konfirmasi Buka Shift". Printer kasir akan otomatis mencetak slip "SHIFT OPENED" yang mencantumkan nama kasir, jam buka, dan saldo modal awal.'),

          // Bab 2: Manajemen Meja & Pesanan
          createHeading('2. Manajemen Meja & Pembuatan Pesanan (Dine-In / Takeaway)', HeadingLevel.HEADING_2),
          createParagraph('Cara melayani tamu yang makan di tempat (Dine-in) maupun pesanan bungkus:'),
          createStepItem('2.1', 'Pilih Nomor Meja', 'Pada layar POS atau tablet waiter, sentuh nomor meja tamu pada denah (misal: Meja 04). Meja akan berubah status dari hijau (kosong) menjadi merah (terisi).'),
          createStepItem('2.2', 'Input Jumlah Tamu (Pax)', 'Pilih jumlah tamu (misal: 4 Pax) untuk keperluan statistik spend-per-head.'),
          createStepItem('2.3', 'Pilih Menu & Modifier', 'Pilih kategori makanan/minuman, lalu sentuh item menu. Pilih modifier jika tamu meminta kustomisasi (misal: Level Pedas: 3, Minuman: Kurang Manis / Less Ice).'),
          createStepItem('2.4', 'Kirim ke Dapur (Send Order)', 'Sentuh tombol hijau besar "Kirim Pesanan ke Dapur". Tiket pesanan akan langsung tercetak di printer dapur dan muncul di layar KDS secara real-time.'),

          // Bab 3: Pembayaran & Split Bill
          createHeading('3. Pembayaran Tagihan & Fitur Split Bill', HeadingLevel.HEADING_2),
          createParagraph('Langkah penyelesaian pembayaran saat tamu meminta tagihan:'),
          createStepItem('3.1', 'Buka Bill Meja', 'Sentuh meja tamu yang sedang aktif di layar, lalu sentuh tombol "Bayar / Checkout".'),
          createStepItem('3.2', 'Pilihan Metode Pembayaran', 'Pilih metode: (A) Tunai: tekan tombol nominal pas atau pecahan uang tamu. (B) QRIS: sistem akan menampilkan QRIS Dinamis langsung di layar untuk discan tamu via BCA/Gopay/OVO. (C) Kartu EDC: gesek kartu di mesin EDC dan masukkan approval code.'),
          createStepItem('3.3', 'Cara Split Bill (Pisah Tagihan)', 'Jika tamu meminta pisah bon: klik tombol "Split Bill". Anda bisa memilih (1) Split Rata (misal tagihan Rp 200.000 dibagi 4 orang = @Rp 50.000) atau (2) Split per Item (pindahkan menu yang dimakan masing-masing orang ke sub-bill 1, 2, dst). Cetak masing-masing struk.'),
          createStepItem('3.4', 'Selesai & Laci Terbuka', 'Setelah pembayaran sukses, laci kasir (cash drawer) akan terbuka otomatis dan struk belanja pelanggan tercetak.'),

          // Bab 4: Void Transaksi & Diskon
          createHeading('4. Prosedur Pembatalan Pesanan (Void) & Diskon Khusus', HeadingLevel.HEADING_2),
          createParagraph('Untuk mencegah kecurangan kasir, seluruh pembatalan menu atau void transaksi wajib memerlukan otorisasi supervisor:'),
          createStepItem('4.1', 'Permintaan Void Item', 'Kasir memilih item yang ingin dibatalkan, lalu menekan tombol merah "Batalkan Item / Void".'),
          createStepItem('4.2', 'Pilih Alasan Void', 'Pilih alasan dari daftar standar: (A) Tamu salah pesan, (B) Makanan tumpah / cacat masak, (C) Waktu saji terlalu lama.'),
          createStepItem('4.3', 'PIN Otorisasi Supervisor', 'Supervisor operasional memasukkan PIN khusus. Sistem akan mencatat riwayat pembatalan ke log audit server dan mengembalikan saldo stok bahan baku secara otomatis.'),

          // Bab 5: Tutup Kasir / Closing Shift
          createHeading('5. Prosedur Tutup Kasir & Laporan Harian (Closing Z-Report)', HeadingLevel.HEADING_2),
          createParagraph('Prosedur wajib setiap akhir pergantian shift atau tutup restoran malam hari:'),
          createStepItem('5.1', 'Pastikan Semua Meja Selesai', 'Pastikan tidak ada meja yang masih berstatus "Aktif / Terisi" pada denah.'),
          createStepItem('5.2', 'Hitung Uang Fisik (Blind Cash Count)', 'Buka laci kasir dan hitung seluruh uang fisik (kertas & koin) yang terkumpul tanpa melihat estimasi sistem untuk menjaga keakuratan.'),
          createStepItem('5.3', 'Input Nominal Uang Fisik', 'Masuk ke menu "Tutup Kasir / End Shift". Masukkan total uang fisik yang dihitung.'),
          createStepItem('5.4', 'Cetak Laporan Z-Report', 'Tekan tombol "Cetak Z-Report & Tutup Shift". Sistem akan mencetak laporan komprehensif yang menampilkan: Total Penjualan, Total QRIS/EDC, Modal Awal, Penerimaan Tunai, dan Nilai Selisih Kas (Over/Short). Kasir dan supervisor menandatangani lembar fisik tersebut.'),

          // SCREENSHOT POS & KDS PREVIEWS
          createHeading('Tampilan Antarmuka Kasir & Dapur GastroStock', HeadingLevel.HEADING_2),
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

          // BAGIAN II: SOP DEPLOYMENT & INSTALASI HARDWARE
          createHeading('BAGIAN II: SOP DEPLOYMENT & INSTALASI RESTORAN BARU', HeadingLevel.HEADING_1),
          createParagraph(
            'Panduan teknis bagi tim implementor dan support saat melakukan pemasangan sistem baru di lokasi restoran klien:'
          ),

          // SOP-01: Site Readiness
          createHeading('SOP-01: Pemeriksaan Kesiapan Lokasi (Site Readiness Survey)', HeadingLevel.HEADING_2),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Item Pengecekan', { isHeader: true, widthPercent: 30 }),
                  createTableCell('Standar Kelayakan', { isHeader: true, widthPercent: 40 }),
                  createTableCell('Status Verifikasi', { isHeader: true, widthPercent: 30 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Catu Daya Listrik', { bold: true }),
                  createTableCell('Stop kontak khusus meja kasir dengan grounding (< 2 Volt AC). Wajib dilengkapi UPS minimal 600VA untuk mencegah POS mati mendadak saat listrik padam.'),
                  createTableCell('[  ] LULUS  /  [  ] PERBAIKI')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Jaringan Internet & Router', { bold: true }),
                  createTableCell('Koneksi internet minimal 20 Mbps. Router Wi-Fi terpisah: SSID "Resto_Internal_POS" (WPA2-PSK) dengan IP statis, terpisah dari Wi-Fi tamu/publik.'),
                  createTableCell('[  ] LULUS  /  [  ] PERBAIKI')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Kabel LAN ke Dapur', { bold: true }),
                  createTableCell('Kabel UTP Cat6 dari switch kasir menuju printer dapur terlindung pipa conduit / pelindung kabel tahan minyak dan tikus.'),
                  createTableCell('[  ] LULUS  /  [  ] PERBAIKI')
                ]
              })
            ]
          }),

          // SOP-02: Konfigurasi IP
          createHeading('SOP-02: Alokasi Alamat IP Jaringan Restoran (Static IP Scheme)', HeadingLevel.HEADING_2),
          createParagraph('Seluruh perangkat kasir dan printer dapur wajib menggunakan alamat IP Statis (bukan DHCP) agar komunikasi cetak tiket tidak terputus:'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Perangkat Hardware', { isHeader: true, widthPercent: 28 }),
                  createTableCell('Alamat IP Statis', { isHeader: true, widthPercent: 24 }),
                  createTableCell('Subnet & Gateway', { isHeader: true, widthPercent: 24 }),
                  createTableCell('Port Layanan', { isHeader: true, widthPercent: 24 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Master POS Kasir Utama', { bold: true }),
                  createTableCell('192.168.10.50'),
                  createTableCell('255.255.255.0 / .1'),
                  createTableCell('Port 3000 / HTTP')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('POS Kasir 2 (Opsional)', { bold: true }),
                  createTableCell('192.168.10.51'),
                  createTableCell('255.255.255.0 / .1'),
                  createTableCell('Port 3000 / HTTP')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Printer Tiket Dapur (LAN)', { bold: true }),
                  createTableCell('192.168.10.201'),
                  createTableCell('255.255.255.0 / .1'),
                  createTableCell('Port 9100 (RAW ESC/POS)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Printer Tiket Bar Minuman (LAN)', { bold: true }),
                  createTableCell('192.168.10.202'),
                  createTableCell('255.255.255.0 / .1'),
                  createTableCell('Port 9100 (RAW ESC/POS)')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('Kitchen Display Tablet (KDS)', { bold: true }),
                  createTableCell('192.168.10.150'),
                  createTableCell('255.255.255.0 / .1'),
                  createTableCell('WebSocket WSS / 8080')
                ]
              })
            ]
          }),

          // BAGIAN III: MATRIKS TROUBLESHOOTING & KODE ERROR
          createHeading('BAGIAN III: MATRIKS TROUBLESHOOTING & KODE ERROR (QUICK FIX)', HeadingLevel.HEADING_1),
          createParagraph(
            'Panduan penanganan cepat (< 3 menit) saat kasir atau staf restoran menghadapi kendala teknis operasional:'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Kode Error', { isHeader: true, widthPercent: 20 }),
                  createTableCell('Gejala Lapangan', { isHeader: true, widthPercent: 35 }),
                  createTableCell('Langkah Perbaikan Cepat (Quick Fix)', { isHeader: true, widthPercent: 45 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('ERR_PRINTER_OFFLINE', { bold: true, color: 'DC2626' }),
                  createTableCell('Tiket pesanan tidak keluar di printer dapur, lampu merah printer berkedip atau berbunyi bip berulang.'),
                  createTableCell('1. Periksa kertas termal (pastikan tidak macet / kertas habis).\n2. Cek kabel LAN di belakang printer (lampu hijau konektor harus menyala).\n3. Lakukan test print: matikan printer, tekan tahan tombol FEED sambil menyalakan power hingga kertas cetak konfigurasi keluar.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('ERR_STOCK_DEFICIT', { bold: true, color: 'D97706' }),
                  createTableCell('Muncul popup merah saat kasir menekan tombol kirim order: "Bahan Baku Tidak Cukup".'),
                  createTableCell('1. Buka rincian popup untuk melihat bahan apa yang kurang (misal: Fillet Ayam sisa 0.2 kg sedangkan pesanan butuh 0.5 kg).\n2. Hubungi supervisor untuk (A) Ubah menu ke status "Sold Out" atau (B) Lakukan penerimaan barang darurat di menu Gudang.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('ERR_SYNC_CONFLICT', { bold: true, color: '2563EB' }),
                  createTableCell('Pemberitahuan: "Transaksi offline terdeteksi bentrok dengan data cloud".'),
                  createTableCell('1. Buka menu Pengaturan -> Sinkronisasi Data.\n2. Klik tombol "Verifikasi UUID & Jam Sistem".\n3. Pastikan jam tablet kasir sesuai dengan waktu internet (WIB/WITA/WIT). Sistem akan menggabungkan data via CRDT secara otomatis.')
                ]
              }),
              new TableRow({
                children: [
                  createTableCell('ERR_PAYMENT_TIMEOUT', { bold: true, color: 'DC2626' }),
                  createTableCell('Tamu sudah scan QRIS dan mengaku saldo terpotong, tetapi status layar kasir masih "Menunggu Pembayaran".'),
                  createTableCell('1. Tekan tombol "Cek Status Settlement QRIS" di bawah tombol batal.\n2. Jika tetap gagal: minta tamu menunjukkan bukti mutasi rekening m-banking.\n3. Masukkan nomor Ref-ID bank ke kolom "Override Pembayaran Manual" setelah diotorisasi supervisor.')
                ]
              })
            ]
          }),

          // LEMBAR PENGESAHAN USER MANUAL & SOP
          createHeading('LEMBAR SERAH TERIMA PANDUAN & TRAINING PENGGUNA', HeadingLevel.HEADING_1),
          createParagraph(
            'Dokumen ini menjadi bukti sah bahwa buku manual operasional, SOP deployment, serta pelatihan dasar kasir telah diserahkan dan dipahami oleh pihak manajemen restoran klien.'
          ),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createTableCell('Diterima oleh Restoran Klien', { isHeader: true, widthPercent: 50 }),
                  createTableCell('Diserahkan oleh Tim Support RestoSync', { isHeader: true, widthPercent: 50 })
                ]
              }),
              new TableRow({
                children: [
                  createTableCell(`Nama Toko: ${restoTitle}\nNama Penerima: ____________________\nJabatan: Store Manager / Head Cashier\nTanggal: ____________________\n\n\n\nTanda Tangan: ________________________`),
                  createTableCell(`Nama Instruktur: ${picTitle}\nJabatan: Senior Implementation Specialist\nTanggal: ____________________\n\n\n\nTanda Tangan: ________________________`)
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
