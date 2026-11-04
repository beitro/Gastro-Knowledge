// Enterprise Sales Pitch Deck Generator for GastroStock RestoSync
// Generates Apple Keynote-Style Presentation (.pptx) using PptxGenJS
// Focused on Speed (Kecepatan), Bank-Grade Security (Keamanan), Real ROI, and High-Resolution Visual Mockups.

import PptxGenJS from 'pptxgenjs';
import { getAllCaptureDataUrls } from './brdCaptureGenerator';

export interface PitchDeckOptions {
  clientName?: string;
  picName?: string;
  presenterTitle?: string;
  presentationDate?: string;
}

export async function generatePitchDeckPresentation(options: PitchDeckOptions = {}): Promise<PptxGenJS> {
  const {
    clientName = 'Restoran Mitra & Hospitality Group',
    picName = 'GastroStock Enterprise Sales Team',
    presenterTitle = 'Lead Product Specialist & Restaurant Architect',
    presentationDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
  } = options;

  // Initialize PptxGenJS with 16:9 Widescreen Layout
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_16x9'; // 13.33 x 7.5 inches
  pres.author = 'GastroStock Technologies';
  pres.company = 'GastroStock Enterprise';
  pres.title = `GastroStock RestoSync - Sales Pitch Deck for ${clientName}`;
  pres.subject = 'Sistem Manajemen Inventaris & Operasional Restoran Berkecepatan Tinggi & Keamanan Tingkat Bank';

  // Retrieve crisp system capture data URLs
  let captures: ReturnType<typeof getAllCaptureDataUrls> | null = null;
  try {
    captures = getAllCaptureDataUrls();
  } catch (err) {
    console.warn('Failed to load system captures for PPTX:', err);
  }

  // Apple Keynote Dark Color Palette
  const C_DARK_BG = '0A0A0E';       // Deep Charcoal Black
  const C_CARD_BG = '141721';       // Dark Slate Card
  const C_BORDER = '232A3B';        // Subtle Card Border
  const C_WHITE = 'FFFFFF';         // Crisp White
  const C_MUTED = '94A3B8';         // Slate Muted Subtext
  const C_CYAN = '38BDF8';          // Tech Cyan Highlight
  const C_EMERALD = '34D399';       // Emerald Success
  const C_AMBER = 'FBBF24';         // Amber Gold Accent
  const C_ROSE = 'F87171';          // Rose Alert
  const C_PURPLE = 'A78BFA';        // Violet Supervisor

  // Helper for consistent slide styling
  const addAppleSlideHeader = (slide: any, category: string, title: string, subtitle?: string) => {
    // Top category badge
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.5,
      w: 11.5,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_CYAN,
      charSpacing: 3
    });

    // Main Apple-style bold headline
    slide.addText(title, {
      x: 0.8,
      y: 0.85,
      w: 11.7,
      h: 0.85,
      fontSize: 26,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_WHITE
    });

    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8,
        y: 1.65,
        w: 11.7,
        h: 0.45,
        fontSize: 13,
        fontFace: 'Helvetica Neue',
        color: C_MUTED
      });
    }
  };

  // ===========================================================================
  // SLIDE 1: COVER / HERO KEYNOTE (APPLE STYLE)
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };

    // Brand Tag
    slide.addText('GASTROSTOCK RESTOSYNC • NEXT-GEN RESTAURANT OS', {
      x: 1.0,
      y: 1.2,
      w: 11.3,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_CYAN,
      charSpacing: 4
    });

    // Huge Hero Headline
    slide.addText('Operations.\nReimagined.', {
      x: 1.0,
      y: 1.7,
      w: 11.3,
      h: 2.2,
      fontSize: 60,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_WHITE,
      lineSpacingMultiple: 1.05
    });

    // Subtitle
    slide.addText('Sistem Manajemen Inventaris & Operasional Restoran Berkecepatan Tinggi.\nSinkronisasi Terpadu: Kasir POS, Tablet Waiter, KDS Dapur, Gudang FEFO & Executive BI.', {
      x: 1.0,
      y: 4.1,
      w: 10.5,
      h: 0.9,
      fontSize: 16,
      fontFace: 'Helvetica Neue',
      color: C_MUTED,
      lineSpacingMultiple: 1.2
    });

    // Key Performance Pills
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: 5.3,
      w: 11.3,
      h: 0.85,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('⚡ Sub-150ms LAN Latency   |   🔒 Bank-Grade ACID Locking   |   🛡️ 100% Offline-First   |   📈 +18.4% Table Turnover', {
      x: 1.2,
      y: 5.5,
      w: 10.9,
      h: 0.45,
      fontSize: 13,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_WHITE
    });

    // Footer Client Personalization
    slide.addText(`Disiapkan Khusus untuk: ${clientName}   •   Dipresentasikan oleh: ${picName}   •   ${presentationDate}`, {
      x: 1.0,
      y: 6.7,
      w: 11.3,
      h: 0.4,
      fontSize: 10,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });
  }

  // ===========================================================================
  // SLIDE 2: THE PROBLEM (WHY RESTAURANTS LOSE MARGIN)
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addAppleSlideHeader(slide, 'Tantangan Industri F&B', '68% Restoran Mengalami Kebocoran Margin Diam-Diam.', 'Tiga celah kritis yang menguras keuntungan operasional harian restoran.');

    // 3 Cards Problem Grid
    const cards = [
      {
        icon: '⚠️',
        title: 'Kebocoran Stok & Spoilage',
        stat: 'Rp 4–8 Juta / Bulan',
        desc: 'Bahan baku rusak di chiller karena tidak terpantau (tanpa FEFO). Deviasi gramatur resep antar koki dapur membuat HPP membengkak tidak terkendali.'
      },
      {
        icon: '⏱️',
        title: 'Kertas Bon Hilang & SLA Molor',
        stat: '18 Menit Rata-Rata Masak',
        desc: 'Kertas struk pesanan tercecer saat jam sibuk. Tamu menunggu lebih dari 20 menit, meja lambat berganti, dan kepuasan tamu anjlok drastis.'
      },
      {
        icon: '🛑',
        title: 'Overselling & Fraud Kasir',
        stat: '12% Pembatalan Meja',
        desc: 'Menu tetap dijual kasir padahal daging habis di dapur (tanpa kunci database). Pembatalan void dilakukan tanpa PIN otorisasi supervisor.'
      }
    ];

    cards.forEach((c, idx) => {
      const xPos = 0.8 + idx * 3.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 2.3,
        w: 3.75,
        h: 4.5,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.15
      });

      slide.addText(c.icon, {
        x: xPos + 0.3,
        y: 2.6,
        w: 1.0,
        h: 0.5,
        fontSize: 24
      });

      slide.addText(c.title, {
        x: xPos + 0.3,
        y: 3.2,
        w: 3.15,
        h: 0.6,
        fontSize: 17,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(c.stat, {
        x: xPos + 0.3,
        y: 3.85,
        w: 3.15,
        h: 0.45,
        fontSize: 14,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_ROSE
      });

      slide.addText(c.desc, {
        x: xPos + 0.3,
        y: 4.4,
        w: 3.15,
        h: 2.1,
        fontSize: 12,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacingMultiple: 1.25
      });
    });
  }

  // ===========================================================================
  // SLIDE 3: THE UNIFIED ARCHITECTURE (6 ROLES IN SYNC)
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addAppleSlideHeader(slide, 'Ekosistem Terpadu', 'Satu Jantung Sinkronisasi. 6 Peran Tanpa Hambatan.', 'Arsitektur cerdas yang menghubungkan seluruh alur staf dalam satu koordinasi real-time.');

    const roles = [
      { name: '1. Kasir POS', device: 'Touch POS 15-21"', color: C_CYAN, desc: 'Input menu, kalkulasi split-bill, validasi resep BOM seketika & cetak tiket LAN.' },
      { name: '2. Pramusaji', device: 'Android Tablet 10"', color: C_EMERALD, desc: 'Peta meja dinamis (Kosong/Terisi/Billing), order di meja & peringatan bahan habis.' },
      { name: '3. Chef Dapur', device: 'KDS TV Screen 32"', color: C_ROSE, desc: 'Tiket antrean FIFO, SLA countdown cerdas, dan satu sentuhan bump order.' },
      { name: '4. Supervisor', device: 'Backoffice Station', color: C_PURPLE, desc: 'Otorisasi 4-digit PIN void, persetujuan diskon, dan audit rekonsiliasi kas.' },
      { name: '5. Owner Resto', device: 'Mobile Smartphone', color: C_AMBER, desc: 'Live gross omset, food cost % riil, deteksi kebocoran dan margin bersih.' },
      { name: '6. Staff Gudang', device: 'Barcode Terminal', color: '60A5FA', desc: 'Penerimaan PO supplier, pencatatan batch lot FEFO, dan monitor chiller 3.2°C.' }
    ];

    roles.forEach((r, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const xPos = 0.8 + col * 3.95;
      const yPos = 2.3 + row * 2.35;

      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: yPos,
        w: 3.75,
        h: 2.15,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(r.name, {
        x: xPos + 0.3,
        y: yPos + 0.25,
        w: 2.2,
        h: 0.4,
        fontSize: 16,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(r.device, {
        x: xPos + 2.1,
        y: yPos + 0.25,
        w: 1.4,
        h: 0.35,
        fontSize: 10,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: r.color,
        align: 'right'
      });

      slide.addText(r.desc, {
        x: xPos + 0.3,
        y: yPos + 0.7,
        w: 3.15,
        h: 1.3,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacingMultiple: 1.2
      });
    });
  }

  // ===========================================================================
  // SLIDE 4: SPEED & OFFLINE RESILIENCE (KECEPATAN)
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addAppleSlideHeader(slide, 'Performa Tanpa Tanding', 'Secepat Kilat. Bahkan Saat Internet Mati.', 'Dibangun dengan protokol Local LAN Resilience dan arsitektur Offline-First.');

    // Left Column: 3 Big Apple Metrics
    const metrics = [
      { num: '< 150 ms', label: 'Response Time Antar Perangkat', desc: 'Tiket dari kasir sampai di layar dapur sebelum kertas printer selesai bergerak.' },
      { num: '3.2x', label: 'Perputaran Meja Lebih Cepat', desc: 'Proses checkout, split bill, dan pemesanan dipersingkat dari 7 menit ke 90 detik.' },
      { num: '100%', label: 'Offline-First Uptime Guarantee', desc: 'Internet resto putus? Kasir & dapur tetap beroperasi normal tanpa downtime sedetik pun.' }
    ];

    metrics.forEach((m, idx) => {
      const yPos = 2.3 + idx * 1.55;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: yPos,
        w: 5.5,
        h: 1.4,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(m.num, {
        x: 1.1,
        y: yPos + 0.15,
        w: 5.0,
        h: 0.45,
        fontSize: 26,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_CYAN
      });

      slide.addText(m.label, {
        x: 1.1,
        y: yPos + 0.62,
        w: 5.0,
        h: 0.3,
        fontSize: 12,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(m.desc, {
        x: 1.1,
        y: yPos + 0.92,
        w: 5.0,
        h: 0.4,
        fontSize: 10,
        fontFace: 'Helvetica Neue',
        color: C_MUTED
      });
    });

    // Right Column: System Capture / POS Mockup Image
    if (captures?.pos) {
      slide.addImage({
        data: captures.pos,
        x: 6.6,
        y: 2.3,
        w: 5.9,
        h: 4.5
      });
    } else {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 6.6,
        y: 2.3,
        w: 5.9,
        h: 4.5,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 }
      });
      slide.addText('POS Kasir Touchscreen Interface', {
        x: 6.9,
        y: 4.3,
        w: 5.3,
        h: 0.5,
        fontSize: 18,
        color: C_MUTED,
        align: 'center'
      });
    }
  }

  // ===========================================================================
  // SLIDE 5: BANK-GRADE SECURITY & FRAUD PROTECTION (KEAMANAN)
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addAppleSlideHeader(slide, 'Proteksi Keamanan Berlapis', 'Keamanan Sekelas Perbankan. Tanpa Kompromi.', 'Menghilangkan potensi pencurian kas, overselling bahan, dan void ilegal.');

    // Right Column: System Capture / Deficit Modal Image
    if (captures?.insufficientStock) {
      slide.addImage({
        data: captures.insufficientStock,
        x: 6.6,
        y: 2.3,
        w: 5.9,
        h: 4.5
      });
    }

    // Left Column: 3 Security Pillars
    const securityPillars = [
      {
        badge: 'TRANSACTION LOCK',
        title: 'ACID Row-Level Locking Database',
        desc: 'Mencegah 2 kasir menjual sisa porsi terakhir secara bersamaan. Jika bahan kurang 1 gram pun, sistem otomatis melakukan rollback tanpa membuat saldo negatif.'
      },
      {
        badge: 'AUTH SHIELD',
        title: 'Supervisor 4-Digit PIN Authorization',
        desc: 'Kasir tidak dapat membatalkan pesanan (void bill) atau memberikan diskon tanpa kehadiran manajer toko. Seluruh otorisasi tercatat di audit log permanen.'
      },
      {
        badge: 'AUDIT LOG',
        title: 'Tamper-Proof Stock Mutation Trail',
        desc: 'Setiap gram bahan yang keluar masuk dicatat detik demi detik bersama Order ID, nama staf, dan stempel waktu server. Menghapus risiko manipulasi laporan stok.'
      }
    ];

    securityPillars.forEach((p, idx) => {
      const yPos = 2.3 + idx * 1.55;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: yPos,
        w: 5.5,
        h: 1.4,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(p.badge, {
        x: 1.1,
        y: yPos + 0.15,
        w: 5.0,
        h: 0.25,
        fontSize: 9,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_PURPLE,
        charSpacing: 2
      });

      slide.addText(p.title, {
        x: 1.1,
        y: yPos + 0.4,
        w: 5.0,
        h: 0.35,
        fontSize: 14,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(p.desc, {
        x: 1.1,
        y: yPos + 0.78,
        w: 5.0,
        h: 0.55,
        fontSize: 10.5,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacingMultiple: 1.2
      });
    });
  }

  // ===========================================================================
  // SLIDE 6: KITCHEN DISPLAY SYSTEM (KDS)
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addAppleSlideHeader(slide, 'Kitchen Display System (KDS)', 'Dapur Cepat. Tanpa Bon Kertas yang Hilang.', 'Pesanan terorganisir rapi dalam antrean cerdas dengan pengingat SLA visual.');

    // Left Column: KDS Image Capture
    if (captures?.kds) {
      slide.addImage({
        data: captures.kds,
        x: 0.8,
        y: 2.3,
        w: 6.2,
        h: 4.5
      });
    }

    // Right Column: KDS Key Features
    const kdsFeatures = [
      {
        title: 'Smart SLA Countdown Timer',
        desc: 'Warna tiket berubah dinamis: Hijau (<5 mnt), Kuning (5-10 mnt), dan Merah Berkedip (>10 mnt). Menghindarkan komplain tamu meja.'
      },
      {
        title: 'One-Touch Order Bump',
        desc: 'Chef cukup menyentuh layar untuk memindahkan status dari Mengantri → Dimasak → Siap Saji. Waiter otomatis menerima notifikasi ambil pesanan.'
      },
      {
        title: 'Presisi Resep BOM Standar',
        desc: 'Komposisi gramatur resep terpampang jelas di layar. Koki baru dapat memasak dengan konsistensi rasa 100% sama dengan Head Chef.'
      }
    ];

    kdsFeatures.forEach((f, idx) => {
      const yPos = 2.3 + idx * 1.55;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 7.3,
        y: yPos,
        w: 5.2,
        h: 1.4,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(`0${idx + 1}`, {
        x: 7.5,
        y: yPos + 0.18,
        w: 0.8,
        h: 0.4,
        fontSize: 18,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_ROSE
      });

      slide.addText(f.title, {
        x: 8.3,
        y: yPos + 0.18,
        w: 4.0,
        h: 0.35,
        fontSize: 14,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(f.desc, {
        x: 8.3,
        y: yPos + 0.58,
        w: 4.0,
        h: 0.7,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacingMultiple: 1.2
      });
    });
  }

  // ===========================================================================
  // SLIDE 7: WAREHOUSE FEFO & CHILLER MONITORING
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addAppleSlideHeader(slide, 'Manajemen Bahan Baku & HACCP', 'Bahan Selalu Segar. Sisa Spoilage Mendekati 0%.', 'Standar pergudangan profesional dengan alokasi otomatis First-Expired First-Out.');

    // Right Column: Warehouse Image Capture
    if (captures?.warehouse) {
      slide.addImage({
        data: captures.warehouse,
        x: 6.6,
        y: 2.3,
        w: 5.9,
        h: 4.5
      });
    }

    // Left Column: FEFO Features
    const fefoFeatures = [
      {
        icon: '📦',
        title: 'Alokasi Otomatis Batch FEFO',
        desc: 'Bahan baku yang memiliki tanggal kadaluarsa paling dekat otomatis diprioritaskan untuk dipotong ke resep menu terlebih dahulu.'
      },
      {
        icon: '❄️',
        title: 'Monitor Suhu Chiller 3.2°C',
        desc: 'Sensor telemetri memantau suhu lemari pendingin secara berkala. Notifikasi instan terkirim jika suhu naik di atas ambang batas 4°C.'
      },
      {
        icon: '🏷️',
        title: 'Pencatatan PO & Barcode Lot',
        desc: 'Barang datang dari supplier dicatat nomor lot, tanggal kirim, dan verifikasi timbangan sebelum masuk ke neraca gudang aktif.'
      }
    ];

    fefoFeatures.forEach((f, idx) => {
      const yPos = 2.3 + idx * 1.55;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: yPos,
        w: 5.5,
        h: 1.4,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(f.icon, {
        x: 1.1,
        y: yPos + 0.15,
        w: 0.8,
        h: 0.4,
        fontSize: 20
      });

      slide.addText(f.title, {
        x: 1.8,
        y: yPos + 0.18,
        w: 4.3,
        h: 0.35,
        fontSize: 14,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(f.desc, {
        x: 1.8,
        y: yPos + 0.58,
        w: 4.3,
        h: 0.7,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacingMultiple: 1.2
      });
    });
  }

  // ===========================================================================
  // SLIDE 8: EXECUTIVE BI DASHBOARD (FOR OWNER)
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addAppleSlideHeader(slide, 'Executive Intelligence', 'Kendali Penuh di Genggaman Tangan Anda.', 'Pantau omset kotor, HPP riil, kerugian bahan, dan laba bersih secara real-time.');

    // Left Column: Dashboard Image Capture
    if (captures?.dashboard) {
      slide.addImage({
        data: captures.dashboard,
        x: 0.8,
        y: 2.3,
        w: 6.2,
        h: 4.5
      });
    }

    // Right Column: 4 KPI Cards
    const kpis = [
      { label: 'OMSET GROSS HARIAN', val: 'Rp 14.850.000', change: '↑ +18.4% vs kemarin', color: C_EMERALD },
      { label: 'HPP / FOOD COST RIIL', val: '28.4%', change: '✓ Di bawah batas max 30%', color: C_CYAN },
      { label: 'KERUGIAN WASTE DAPUR', val: 'Rp 82.500', change: 'Turun 78% pasca FEFO', color: C_ROSE },
      { label: 'ESTIMASI LABA BERSIH', val: 'Rp 5.240.000', change: 'Margin Bersih ~35.2%', color: C_AMBER }
    ];

    kpis.forEach((k, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = 7.3 + col * 2.65;
      const yPos = 2.3 + row * 2.3;

      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: yPos,
        w: 2.5,
        h: 2.15,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(k.label, {
        x: xPos + 0.2,
        y: yPos + 0.2,
        w: 2.1,
        h: 0.3,
        fontSize: 9,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_MUTED
      });

      slide.addText(k.val, {
        x: xPos + 0.2,
        y: yPos + 0.6,
        w: 2.1,
        h: 0.6,
        fontSize: 18,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: k.color
      });

      slide.addText(k.change, {
        x: xPos + 0.2,
        y: yPos + 1.4,
        w: 2.1,
        h: 0.5,
        fontSize: 10,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });
    });
  }

  // ===========================================================================
  // SLIDE 9: RETURN ON INVESTMENT (ROI)
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addAppleSlideHeader(slide, 'Kalkulasi Return on Investment', 'Investasi yang Membayar Dirinya Sendiri dalam 45 Hari.', 'Hasil nyata yang terukur pada 50+ restoran mitra GastroStock.');

    // 4 Huge Metric Cards (Apple Style Impact)
    const roiMetrics = [
      {
        num: '+18.4%',
        title: 'Kenaikan Omset Meja',
        desc: 'Waktu perputaran meja meningkat dari 2.1x menjadi 3.3x per hari saat jam sibuk.'
      },
      {
        num: '-4.2%',
        title: 'Penurunan Food Cost',
        desc: 'Penghematan rata-rata Rp 6.300.000 per bulan dari pencegahan bahan busuk dan resep berlebih.'
      },
      {
        num: '99.98%',
        title: 'Akurasi Stok Opname',
        desc: 'Menghilangkan selisih fisik vs sistem dari sebelumnya deviasi 8.5% menjadi hampir nol.'
      },
      {
        num: '45 Hari',
        title: 'Rata-rata Balik Modal',
        desc: 'Seluruh biaya perangkat lunak dan setup tertutupi oleh efisiensi bahan dalam 1.5 bulan.'
      }
    ];

    roiMetrics.forEach((m, idx) => {
      const xPos = 0.8 + idx * 2.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 2.3,
        w: 2.8,
        h: 4.5,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.15
      });

      slide.addText(m.num, {
        x: xPos + 0.25,
        y: 2.8,
        w: 2.3,
        h: 0.8,
        fontSize: 32,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_EMERALD,
        align: 'center'
      });

      slide.addText(m.title, {
        x: xPos + 0.25,
        y: 3.8,
        w: 2.3,
        h: 0.6,
        fontSize: 16,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE,
        align: 'center'
      });

      slide.addText(m.desc, {
        x: xPos + 0.25,
        y: 4.5,
        w: 2.3,
        h: 1.8,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        align: 'center',
        lineSpacingMultiple: 1.25
      });
    });
  }

  // ===========================================================================
  // SLIDE 10: TURNKEY IMPLEMENTATION & SLA (PENAWARAN KITA)
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addAppleSlideHeader(slide, 'Layanan Implementasi', 'Go-Live Cepat 7 Hari. Tanpa Henti Operasional.', 'Paket lengkap pendampingan instalasi perangkat keras, jaringan LAN, dan pelatihan staf.');

    const services = [
      {
        step: 'Fase 1',
        title: 'Survei & Skema LAN Statis',
        desc: 'Pengecekan jaringan restoran, penetapan IP statis terminal kasir, router dapur, dan uji ketahanan sinyal.'
      },
      {
        step: 'Fase 2',
        title: 'Migrasi Master Menu & Resep',
        desc: 'Input katalog menu, gramatur takaran BOM, harga jual, pajak PB1, dan batas stok minimum (Par Level).'
      },
      {
        step: 'Fase 3',
        title: 'Pelatihan Staf & Simulasi Kasir',
        desc: 'Pelatihan pramusaji, kasir, koki dapur, hingga supervisor toko dengan buku saku SOP & video tutorial.'
      },
      {
        step: 'Fase 4',
        title: 'Go-Live & 24/7 Dedicated Support',
        desc: 'Pendampingan langsung tim teknis di restoran saat hari pembukaan dan jaminan respon darurat <15 menit.'
      }
    ];

    services.forEach((s, idx) => {
      const xPos = 0.8 + idx * 2.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 2.3,
        w: 2.8,
        h: 4.5,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.15
      });

      slide.addText(s.step.toUpperCase(), {
        x: xPos + 0.25,
        y: 2.6,
        w: 2.3,
        h: 0.3,
        fontSize: 10,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_CYAN,
        charSpacing: 2
      });

      slide.addText(s.title, {
        x: xPos + 0.25,
        y: 3.1,
        w: 2.3,
        h: 0.7,
        fontSize: 15,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(s.desc, {
        x: xPos + 0.25,
        y: 4.0,
        w: 2.3,
        h: 2.4,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacingMultiple: 1.25
      });
    });
  }

  // ===========================================================================
  // SLIDE 11: CLOSING / ONE MORE THING (CALL TO ACTION)
  // ===========================================================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };

    slide.addText('ONE MORE THING...', {
      x: 1.0,
      y: 1.3,
      w: 11.3,
      h: 0.4,
      fontSize: 13,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_AMBER,
      charSpacing: 4
    });

    slide.addText('Bawa Restoran Anda Melompat\nke Standar Masa Depan.', {
      x: 1.0,
      y: 1.8,
      w: 11.3,
      h: 1.8,
      fontSize: 48,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_WHITE,
      lineSpacingMultiple: 1.05
    });

    slide.addText('Tingkatkan margin laba bersih, hilangkan komplain tamu, dan amankan setiap gram bahan baku Anda hari ini.', {
      x: 1.0,
      y: 3.8,
      w: 10.5,
      h: 0.6,
      fontSize: 16,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    // Contact Action Card
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: 4.7,
      w: 11.3,
      h: 1.7,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('📅 Jadwalkan On-Site Demo Gratis di Restoran Anda:', {
      x: 1.3,
      y: 4.95,
      w: 10.7,
      h: 0.35,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_CYAN
    });

    slide.addText('Kami akan membawakan unit demo POS Touchscreen, Tablet Waiter, dan KDS langsung ke restoran Anda untuk simulasi alur operasional riil.', {
      x: 1.3,
      y: 5.35,
      w: 10.7,
      h: 0.4,
      fontSize: 11,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    slide.addText(`Hubungi Tim Solusi Restoran: ${picName}   •   Email: sales@gastrostock.com   •   Hotline 24/7 Priority`, {
      x: 1.3,
      y: 5.85,
      w: 10.7,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_WHITE
    });
  }

  return pres;
}

// -----------------------------------------------------------------------------
// DOWNLOAD HANDLER (DIRECT BROWSER DOWNLOAD)
// -----------------------------------------------------------------------------
export async function downloadPitchDeckPptx(options: PitchDeckOptions = {}): Promise<void> {
  const pres = await generatePitchDeckPresentation(options);
  const clientSanitized = (options.clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `GastroStock_RestoSync_PitchDeck_AppleKeynote_${clientSanitized}.pptx`;
  await pres.writeFile({ fileName: filename });
}
