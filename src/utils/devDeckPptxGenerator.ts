// Developer Architecture Meeting Pitch Deck Generator (Apple Keynote Style 16:9 .pptx)
// Generates a 13-slide technical presentation for explaining the 16 Restaurant Service Models,
// Hardware Integrations, Network Protocols, and Concurrency Rules to Development Teams.

import PptxGenJS from 'pptxgenjs';

export interface DevDeckOptions {
  devTeamName?: string;
  leadArchitect?: string;
  meetingDate?: string;
  sprintTarget?: string;
}

export async function generateDevModesPitchDeckPresentation(options: DevDeckOptions = {}): Promise<PptxGenJS> {
  const {
    devTeamName = 'Tim Engineering & Software Architect RestoSync',
    leadArchitect = 'Lead Solution Architect & Tech Lead',
    meetingDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
    sprintTarget = 'Sprint 1 - 4: Core Engine, POS/KDS, IoT & Aggregator'
  } = options;

  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_16x9'; // 13.33 x 7.5 inches
  pres.author = 'RestoSync Engineering';
  pres.company = 'RestoSync Restaurant OS';
  pres.title = `RestoSync Developer Architecture - 16 Restaurant Service Models Blueprint`;
  pres.subject = 'Panduan Arsitektur Teknis, Hardware, Protokol Jaringan, dan Skema Inventaris untuk Tim Developer';

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

  // Helper for consistent slide headers
  const addSlideHeader = (slide: any, category: string, title: string, subtitle?: string) => {
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.5,
      w: 11.7,
      h: 0.35,
      fontSize: 11,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_CYAN
    });

    slide.addText(title, {
      x: 0.8,
      y: 0.85,
      w: 11.7,
      h: 0.7,
      fontSize: 26,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_WHITE
    });

    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8,
        y: 1.55,
        w: 11.7,
        h: 0.4,
        fontSize: 12,
        fontFace: 'Helvetica Neue',
        color: C_MUTED
      });
    }
  };

  interface FlowStepItem {
    step: string;
    title: string;
    device: string;
    protocol: string;
    detail: string;
  }

  // Helper for rendering a 5-step horizontal visual workflow flowchart in slides
  const addVisualWorkflowBar = (
    slide: any,
    yPos: number,
    title: string,
    badge: string,
    steps: FlowStepItem[],
    accentColor: string
  ) => {
    // Flow Container Box
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: yPos,
      w: 11.7,
      h: 1.85,
      fill: { color: '0D111A' },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.1
    });

    // Flow Title & Badge
    slide.addText(badge.toUpperCase(), {
      x: 1.0,
      y: yPos + 0.1,
      w: 4.8,
      h: 0.25,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: accentColor
    });

    slide.addText(title, {
      x: 6.0,
      y: yPos + 0.1,
      w: 6.3,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_WHITE,
      align: 'right'
    });

    // 5 Step Blocks
    const boxW = 2.05;
    const boxH = 1.25;
    const gap = 0.32;
    const startX = 1.0;

    steps.forEach((st, i) => {
      const bX = startX + i * (boxW + gap);
      const bY = yPos + 0.42;

      // Step Card
      slide.addShape(pres.ShapeType.roundRect, {
        x: bX,
        y: bY,
        w: boxW,
        h: boxH,
        fill: { color: C_CARD_BG },
        line: { color: i === 0 ? accentColor : C_BORDER, width: 1 },
        rectRadius: 0.08
      });

      // Step Number + Protocol Badge
      slide.addText(st.step, {
        x: bX + 0.1,
        y: bY + 0.08,
        w: 0.5,
        h: 0.2,
        fontSize: 8.5,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: accentColor
      });

      slide.addText(st.protocol, {
        x: bX + 0.6,
        y: bY + 0.08,
        w: boxW - 0.7,
        h: 0.2,
        fontSize: 7,
        fontFace: 'Courier New',
        bold: true,
        color: C_MUTED,
        align: 'right'
      });

      // Title & Device
      slide.addText(st.title, {
        x: bX + 0.1,
        y: bY + 0.3,
        w: boxW - 0.2,
        h: 0.35,
        fontSize: 8.5,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(`${st.device}\n${st.detail}`, {
        x: bX + 0.1,
        y: bY + 0.68,
        w: boxW - 0.2,
        h: 0.5,
        fontSize: 7,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacing: 10
      });

      // Connector arrow to next step
      if (i < steps.length - 1) {
        slide.addText('➔', {
          x: bX + boxW + 0.02,
          y: bY + 0.42,
          w: gap - 0.04,
          h: 0.3,
          fontSize: 11,
          fontFace: 'Helvetica Neue',
          bold: true,
          color: accentColor,
          align: 'center'
        });
      }
    });
  };

  // -----------------------------------------------------------------------------
  // SLIDE 1: COVER SLIDE
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };

    slide.addText('RESTOSYNC ENGINEERING • DEVELOPER ALIGNMENT MEETING', {
      x: 1.0,
      y: 1.3,
      w: 11.3,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_CYAN
    });

    slide.addText('Architecture.\nDeconstructed.', {
      x: 1.0,
      y: 1.8,
      w: 11.3,
      h: 1.8,
      fontSize: 52,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_WHITE,
      lineSpacing: 54
    });

    slide.addText('Blueprint 16 Model Layanan Restoran: Alur Operasional, Integrasi Hardware IoT, Protokol Jaringan (WSS, MQTT, Modbus, ESC/POS), API REST, dan Concurrency Lock.', {
      x: 1.0,
      y: 3.8,
      w: 10.5,
      h: 0.8,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    // 4 Key Engineering Pillars
    const pillars = [
      { num: '< 150 ms', label: 'Local LAN Latency', sub: 'WebSocket KDS & Dispatch' },
      { num: 'ACID Lock', label: 'Bank-Grade Concurrency', sub: 'Anti-Overselling BOM' },
      { num: '16 Methods', label: 'Universal Support', sub: 'Table, Kiosk, Conveyor & Drive' },
      { num: '100% Offline', label: 'Local Resilience', sub: 'SQLite / IndexedDB Sync' }
    ];

    pillars.forEach((p, idx) => {
      const xPos = 1.0 + idx * 2.85;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 4.8,
        w: 2.65,
        h: 1.5,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(p.num, {
        x: xPos + 0.2,
        y: 5.0,
        w: 2.25,
        h: 0.45,
        fontSize: 20,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: idx === 0 ? C_CYAN : idx === 1 ? C_AMBER : idx === 2 ? C_EMERALD : C_PURPLE
      });

      slide.addText(p.label, {
        x: xPos + 0.2,
        y: 5.45,
        w: 2.25,
        h: 0.35,
        fontSize: 11,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(p.sub, {
        x: xPos + 0.2,
        y: 5.8,
        w: 2.25,
        h: 0.35,
        fontSize: 9.5,
        fontFace: 'Helvetica Neue',
        color: C_MUTED
      });
    });

    slide.addText(`Disiapkan untuk: ${devTeamName}   •   Presenter: ${leadArchitect}   •   ${meetingDate}`, {
      x: 1.0,
      y: 6.7,
      w: 11.3,
      h: 0.35,
      fontSize: 10,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });
  }

  // -----------------------------------------------------------------------------
  // SLIDE 2: AGENDA & TAXONOMY (5 KATEGORI / 16 METODE)
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '01. TAXONOMY OVERVIEW', '5 Kategori Layanan & 16 Model Operasional Restoran', 'Arsitektur sistem harus mampu mendukung fleksibilitas 16 alur kerja dengan satu basis kode inti.');

    const categories = [
      {
        num: '01',
        title: 'Table Service (Meja)',
        items: ['American (Plated)', 'French (Gueridon/Flambé)', 'Russian (Silver Platter)', 'English (Family Style)'],
        color: C_EMERALD
      },
      {
        num: '02',
        title: 'Counter & Self-Service',
        items: ['Counter Service (Pay First)', 'Cafeteria / Line Service', 'Buffet (Prasmanan / AYCE)'],
        color: C_AMBER
      },
      {
        num: '03',
        title: 'Teknologi & Otomasi',
        items: ['QR-Code & Kiosk Ordering', 'Conveyor Belt (Kaiten Sushi)', 'Shinkansen Rail & Robot AMR', 'Smart Food Locker Automat'],
        color: C_CYAN
      },
      {
        num: '04',
        title: 'Layanan Kendaraan',
        items: ['Drive-Thru (Multi-Window Lane)', 'Drive-In / Carhop Bay Parking'],
        color: C_PURPLE
      },
      {
        num: '05',
        title: 'Konsep Khusus',
        items: ["Omakase / Chef's Table", 'Food Court / Food Hall Multi-Tenant', 'Ghost / Cloud Kitchen Hub'],
        color: C_ROSE
      }
    ];

    categories.forEach((cat, idx) => {
      const xPos = 0.8 + idx * 2.38;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 2.2,
        w: 2.25,
        h: 4.4,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(cat.num, {
        x: xPos + 0.2,
        y: 2.4,
        w: 1.85,
        h: 0.35,
        fontSize: 16,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: cat.color
      });

      slide.addText(cat.title, {
        x: xPos + 0.2,
        y: 2.75,
        w: 1.85,
        h: 0.55,
        fontSize: 12,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      const bulletText = cat.items.map(it => `• ${it}`).join('\n\n');
      slide.addText(bulletText, {
        x: xPos + 0.2,
        y: 3.4,
        w: 1.85,
        h: 3.0,
        fontSize: 10,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacing: 16
      });
    });
  }

  // -----------------------------------------------------------------------------
  // SLIDE 3: TABLE SERVICE DEEP-DIVE (AMERICAN & FRENCH)
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '02. TABLE SERVICE ARCHITECTURE', 'American Plated vs. French Gueridon Service', 'Perbedaan esensial pada flow coursing KDS dan pengukuran bahan baku cair/timbangan.');

    // Card 1: American Service
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 2.05,
      w: 5.7,
      h: 3.05,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addText('1.1 American Service (Plated)', {
      x: 1.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_EMERALD
    });

    slide.addText('Standar resto kasual - fine dining: makanan di-plating lengkap 100% di dapur.', {
      x: 1.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    const amItems = [
      '• State Machine Meja: VACANT -> SEATED -> ORDERED -> APPETIZER -> MAIN -> BILL -> BUSSING',
      '• Coursing KDS Fire: Starter COOKING, Main HELD hingga waiter tekan "Fire Mains"',
      '• Hardware: Tablet Waiter PWA, KDS Wall 21.5", Mobile POS Sunmi 58mm',
      '• Protokol: WSS WebSocket (<150ms) sinkronisasi course fire antar-stasiun dapur'
    ].join('\n');

    slide.addText(amItems, {
      x: 1.1,
      y: 2.95,
      w: 5.1,
      h: 2.0,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      color: C_WHITE,
      lineSpacing: 12
    });

    // Card 2: French Gueridon Service
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8,
      y: 2.05,
      w: 5.7,
      h: 3.05,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addText('1.2 French Service (Gueridon & Flambé)', {
      x: 7.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_AMBER
    });

    slide.addText('Par-cooked di dapur, diselesaikan dan flambé live di samping meja tamu.', {
      x: 7.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    const frItems = [
      '• Dual-Stage BOM: Tahap 1 par-cooked daging di dapur + Tahap 2 potong ml spirit flambé meja',
      '• Liquor Pour Tracking: Catat mililiter (ml) Cognac/Grand Marnier via tablet sommelier',
      '• Hardware: Timbangan Digital Bluetooth BLE (truffle/caviar per 0.1g) langsung ke POS',
      '• Protokol: Web Bluetooth API timbangan gramasi, SSE untuk timer par-cook troli'
    ].join('\n');

    slide.addText(frItems, {
      x: 7.1,
      y: 2.95,
      w: 5.1,
      h: 2.0,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      color: C_WHITE,
      lineSpacing: 12
    });

    // 5-Step Visual Flowchart
    addVisualWorkflowBar(
      slide,
      5.25,
      'Alur Operasional American Plated & Coursing KDS',
      'Visual Flow 01 · Table Service',
      [
        { step: '01', title: 'Tamu Duduk', device: 'Tablet Waiter', protocol: 'REST HTTPS', detail: 'Buka sesi T-04, 3 pax' },
        { step: '02', title: 'Input Coursing', device: 'Tablet Waiter', protocol: 'WSS Event', detail: 'Starter COOK, Main HELD' },
        { step: '03', title: 'ACID Lock Stok', device: 'PostgreSQL DB', protocol: 'ACID Lock', detail: 'SELECT FOR UPDATE porsi' },
        { step: '04', title: 'Fire Main Course', device: 'KDS Wall 21.5"', protocol: 'WSS Broadcast', detail: 'KDS expo alert masak' },
        { step: '05', title: 'Payment & Settle', device: 'Mobile EDC POS', protocol: 'Hard Deduct', detail: 'Struk cetak, meja clear' }
      ],
      C_EMERALD
    );
  }

  // -----------------------------------------------------------------------------
  // SLIDE 4: TABLE SERVICE DEEP-DIVE (RUSSIAN & ENGLISH FAMILY)
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '03. TABLE SERVICE ARCHITECTURE', 'Russian Silver Platter vs. English Family Style', 'Batch plating massal untuk perjamuan gala vs hidangan porsi tengah meja putar.');

    // Card 1: Russian Service
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 2.05,
      w: 5.7,
      h: 3.05,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addText('1.3 Russian / Silver Service', {
      x: 1.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_CYAN
    });

    slide.addText('Penyajian nampan perak besar (8-10 pax/baki) dipindahkan dengan jepitan sendok-garpu.', {
      x: 1.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    const ruItems = [
      '• Banquet Platter Batching: KDS kelompokkan per nampan baki, bukan tiket porsi tunggal',
      '• Multiplier BOM: 1 Baki Silver = 8 - 10 porsi standar x gramasi resep dasar',
      '• BEO Integration: Banquet Event Order mengunci jaminan pax kuota gudang 48 jam sebelum acara',
      '• Hardware: Scanner Barcode nampan dapur, Master Banquet POS, RFID Badge Tamu'
    ].join('\n');

    slide.addText(ruItems, {
      x: 1.1,
      y: 2.95,
      w: 5.1,
      h: 2.0,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      color: C_WHITE,
      lineSpacing: 12
    });

    // Card 2: English Family Style
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8,
      y: 2.05,
      w: 5.7,
      h: 3.05,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addText('1.4 English Service (Family Style)', {
      x: 7.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_PURPLE
    });

    slide.addText('Hidangan porsi tengah di meja bundar lazy susan; tamu berbagi atau dituangkan host.', {
      x: 7.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    const enItems = [
      '• Synchronous KDS Pass: Tag COMMUNAL_SYNC menahan sayur agar matang serentak dengan ikan',
      '• Live Seafood Scale RS232: Integrasi timbangan ikan hidup per gram otomatis ke POS',
      '• Portioned BOM: Formula BOM berskala dinamis (S = 1x, M = 2x, L = 3.5x yield)',
      '• Split-Bill Engine: Pemecahan nota tunggal meja besar hingga 12 orang secara proporsional'
    ].join('\n');

    slide.addText(enItems, {
      x: 7.1,
      y: 2.95,
      w: 5.1,
      h: 2.0,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      color: C_WHITE,
      lineSpacing: 12
    });

    // 5-Step Visual Flowchart
    addVisualWorkflowBar(
      slide,
      5.25,
      'Alur Operasional Russian Silver & English Communal Sync',
      'Visual Flow 02 · Table Service',
      [
        { step: '01', title: 'BEO Contract', device: 'Banquet POS', protocol: 'BEO Check', detail: 'Kunci kuota 100 pax' },
        { step: '02', title: 'Timbang Seafood', device: 'RS232 Scale', protocol: 'Serial 9600', detail: 'Gramasi live fish' },
        { step: '03', title: 'Platter Batch', device: 'KDS Expo Dapur', protocol: 'WSS Batch', detail: '1 Baki = 8x Porsi' },
        { step: '04', title: 'Communal Sync', device: 'Kitchen KDS', protocol: 'Sync Hold', detail: 'Sayur & ikan serentak' },
        { step: '05', title: 'Bussing & Yield', device: 'Barcode Expo', protocol: 'DB Commit', detail: 'Sisa porsi audit variance' }
      ],
      C_CYAN
    );
  }

  // -----------------------------------------------------------------------------
  // SLIDE 5: COUNTER & SELF-SERVICE (QSR, CAFETERIA, BUFFET)
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '04. COUNTER & SELF-SERVICE ARCHITECTURE', 'Counter Service, Cafeteria Line, & Buffet AYCE', 'Alur transaksi cepat: Pay First, integrasi buzzer pager, dan kontrol sesi waktu prasmanan.');

    const services = [
      {
        title: '2.1 Counter Service (QSR)',
        highlight: 'RF 433MHz Pager & Instant Deduct',
        color: C_AMBER,
        points: [
          '• Pay-First Workflow: Bayar di muka potong stok instan (ACID).',
          '• Pager Pairing: Kasir tap buzzer #12 di dock RFID.',
          '• Trigger Panggil: KDS tekan "Page", transmitter kirim RF 433MHz.',
          '• Target SLA: Transaksi kasir < 45 detik, prep < 5 menit.'
        ]
      },
      {
        title: '2.2 Cafeteria / Line Service',
        highlight: 'Tray Slide & HRIS RFID Tap',
        color: C_EMERALD,
        points: [
          '• End-of-Line Cashier: Deteksi piring nampan < 3 detik.',
          '• RFID Payroll Tap: Pembacaan kartu ID pegawai (<200ms).',
          '• Double-Tap Guard: Proteksi kunci cegah potong saldo ganda.',
          '• IoT Bain-Marie: Sensor MQTT pantau warmer >65°C HACCP.'
        ]
      },
      {
        title: '2.3 Buffet (Prasmanan / AYCE)',
        highlight: 'Session Timer & Waste Penalty',
        color: C_ROSE,
        points: [
          '• Countdown Timer: Sesi 90 mnt streaming via WSS ke tablet.',
          '• 15-Min Last Order: Alarm otomatis bunyi menit ke-75.',
          '• BLE Waste Scale: Timbangan Bluetooth denda sisa >100g.',
          '• Refill Patrol: Tombol tablet staf trigger masak kuah shabu.'
        ]
      }
    ];

    services.forEach((s, idx) => {
      const xPos = 0.8 + idx * 3.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 2.05,
        w: 3.75,
        h: 3.05,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(s.title, {
        x: xPos + 0.2,
        y: 2.2,
        w: 3.35,
        h: 0.3,
        fontSize: 13,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: s.color
      });

      slide.addText(s.highlight, {
        x: xPos + 0.2,
        y: 2.5,
        w: 3.35,
        h: 0.25,
        fontSize: 9,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(s.points.join('\n'), {
        x: xPos + 0.2,
        y: 2.85,
        w: 3.35,
        h: 2.1,
        fontSize: 8.5,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacing: 12
      });
    });

    // 5-Step Visual Flowchart
    addVisualWorkflowBar(
      slide,
      5.25,
      'Alur Transaksi Cepat Counter QSR & Buzzer RF 433MHz',
      'Visual Flow 03 · Counter & Self-Service',
      [
        { step: '01', title: 'Pesan & Bayar', device: 'Dual-POS Kasir', protocol: 'Pay-First', detail: 'Bayar instan < 45 detik' },
        { step: '02', title: 'Pairing Buzzer', device: 'RFID Dock Kasir', protocol: 'RF 433MHz', detail: 'Buzzer #12 terikat order' },
        { step: '03', title: 'KDS Masak Cepat', device: 'KDS Kitchen', protocol: 'Local LAN', detail: 'Prep selesai < 5 menit' },
        { step: '04', title: 'Panggil Tamu', device: 'RF Transmitter', protocol: 'RF Trigger', detail: 'Buzzer bergetar & bunyi' },
        { step: '05', title: 'Ambil & Selesai', device: 'Pick-up Counter', protocol: 'ESC/POS IP', detail: 'Serah terima makanan' }
      ],
      C_AMBER
    );
  }

  // -----------------------------------------------------------------------------
  // SLIDE 6: TECH & AUTOMATION (CONVEYOR RFID & SHINKANSEN EXPRESS)
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '05. AUTOMATION & ROBOTICS ARCHITECTURE', 'Conveyor Belt (Kaiten) & Shinkansen Express Rail', 'Hardware level control: RFID plate tracking, Freshness Decay Pusher, dan PLC Modbus motor drive.');

    // Card 1: Conveyor Belt Kaiten
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 2.05,
      w: 5.7,
      h: 3.05,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addText('3.2 Conveyor Belt (Kaiten Sushi)', {
      x: 1.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_CYAN
    });

    slide.addText('Piring berjalan di rel dengan tag RFID dan pembuangan otomatis piring basi.', {
      x: 1.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    const kaitenItems = [
      '• RFID Tag 13.56MHz: Terpasang di dasar piring berkubah transparan',
      '• Freshness Decay: Piring > 45 mnt didorong solenoid arm ke limbah HACCP',
      '• Chute Counter: Sensor optik lubang meja hitung piring & trigger gacha',
      '• Protokol: Modbus TCP kendali motor rel, Serial RS485 antena RFID'
    ].join('\n');

    slide.addText(kaitenItems, {
      x: 1.1,
      y: 2.95,
      w: 5.1,
      h: 2.0,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      color: C_WHITE,
      lineSpacing: 12
    });

    // Card 2: Shinkansen Express Rail & Robot AMR
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8,
      y: 2.05,
      w: 5.7,
      h: 3.05,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addText('3.3 Shinkansen Rail & Robot AMR Waiter', {
      x: 7.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_PURPLE
    });

    slide.addText('Pengantaran makanan super cepat dengan miniatur kereta rel atau robot otonom LiDAR.', {
      x: 7.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    const shinkansenItems = [
      '• High-Speed Dispatch: Kereta rel meluncur dari dapur berhenti presisi 12 detik',
      '• Load Cell Interlock: Sensor beban baki deteksi piring terangkat sebelum mundur',
      '• Robot AMR Navigation: Navigasi LiDAR SLAM standar VDA 5050 / ROS2',
      '• Return Button: Tamu menekan tombol kapasitif meja untuk memulangkan baki'
    ].join('\n');

    slide.addText(shinkansenItems, {
      x: 7.1,
      y: 2.95,
      w: 5.1,
      h: 2.0,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      color: C_WHITE,
      lineSpacing: 12
    });

    // 5-Step Visual Flowchart
    addVisualWorkflowBar(
      slide,
      5.25,
      'Alur Otomasi Kaiten Conveyor RFID & Shinkansen Express Rail',
      'Visual Flow 04 · Automation & Robotics',
      [
        { step: '01', title: 'Plating & RFID', device: 'Stasiun Sushi', protocol: 'RFID 13.56MHz', detail: 'Tulis timestamp ke tag' },
        { step: '02', title: 'Putar Konveyor', device: 'Motor Rel PLC', protocol: 'Modbus TCP', detail: 'Pita berputar keliling' },
        { step: '03', title: 'Decay Timer 45m', device: 'Solenoid Arm', protocol: 'Pneumatik', detail: 'Piring basi rejected' },
        { step: '04', title: 'Shinkansen Rail', device: 'Miniatur Train', protocol: 'PLC Servo', detail: 'Meluncur 12s ke meja' },
        { step: '05', title: 'Chute Counter', device: 'Sensor Meja', protocol: 'WSS Update', detail: 'Tamu masukkan piring' }
      ],
      C_CYAN
    );
  }

  // -----------------------------------------------------------------------------
  // SLIDE 7: TECH & AUTOMATION (SMART LOCKER & QR PWA)
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '06. AUTOMATION & DIGITAL ORDERING', 'Smart Food Locker (Automat) & QR Dynamic PWA', 'Nirsentuh penuh: Solenoid electromagnetics, MQTTS sensor suhu, dan Shared Table Cart WSS.');

    // Card 1: Smart Locker
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 2.05,
      w: 5.7,
      h: 3.05,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addText('3.4 Smart Food Locker (Automat)', {
      x: 1.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_EMERALD
    });

    slide.addText('Pengambilan mandiri modular dengan loker pemanas (>60°C) atau chiller (<4°C).', {
      x: 1.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    const lockerItems = [
      '• Kunci Solenoid 12V: Pintu otomatis pop-out saat tamu scan barcode QR',
      '• Sensor Suhu IoT (DS18B20): MQTTS pantau suhu pemanas tetap aman (>60°C)',
      '• Dynamic OTP QR: Token pengambilan aman dengan TTL 30 menit via Redis',
      '• UV-C Sterilisasi: Lampu UV menyala 60 detik setiap kali pintu ditutup'
    ].join('\n');

    slide.addText(lockerItems, {
      x: 1.1,
      y: 2.95,
      w: 5.1,
      h: 2.0,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      color: C_WHITE,
      lineSpacing: 12
    });

    // Card 2: QR PWA & Shared Cart
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8,
      y: 2.05,
      w: 5.7,
      h: 3.05,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addText('3.1 QR-Code PWA & Shared Table Cart', {
      x: 7.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_CYAN
    });

    slide.addText('Pemesanan mandiri dari smartphone tamu tanpa instalasi aplikasi native.', {
      x: 7.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    const qrItems = [
      '• HMAC Signed QR Token: URL memuat token anti pemesanan dari luar area resto',
      '• Shared Cart WebSocket Room: Semua tamu di satu meja melihat keranjang real-time',
      '• Instant Payment Webhook: QRIS memotong stok atomik begitu transfer sukses',
      '• Auto-Grayout Sold Out: Menu otomatis non-aktif jika resep BOM gudang habis'
    ].join('\n');

    slide.addText(qrItems, {
      x: 7.1,
      y: 2.95,
      w: 5.1,
      h: 2.0,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      color: C_WHITE,
      lineSpacing: 12
    });

    // 5-Step Visual Flowchart
    addVisualWorkflowBar(
      slide,
      5.25,
      'Alur Nirsentuh Smart Food Locker & QR-Code Shared Cart',
      'Visual Flow 05 · Automation & Digital Ordering',
      [
        { step: '01', title: 'Scan QR Meja', device: 'Smartphone Tamu', protocol: 'HMAC QR', detail: 'Buka menu tanpa app' },
        { step: '02', title: 'Shared Cart Sync', device: 'WSS Room Meja', protocol: 'WebSocket', detail: 'Keranjang live se-meja' },
        { step: '03', title: 'Dapur Masak KDS', device: 'KDS & Warmer', protocol: 'MQTTS Probe', detail: 'DS18B20 pantau >60°C' },
        { step: '04', title: 'Masuk Loker ESP32', device: 'Loker Pintar', protocol: 'Solenoid 12V', detail: 'OTP 6-digit terbit' },
        { step: '05', title: 'Scan OTP & Ambil', device: 'Scanner Kiosk', protocol: 'Relay Unlock', detail: 'Pintu pop-out & UV-C' }
      ],
      C_EMERALD
    );
  }

  // -----------------------------------------------------------------------------
  // SLIDE 8: DRIVE & VEHICLE SERVICE (DRIVE-THRU & CARHOP)
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '07. DRIVE & VEHICLE SERVICE ARCHITECTURE', 'Drive-Thru Multi-Window Lane & Carhop Bay Parking', 'Telemetri kendaraan: Inductive ground loop, LPR License Plate Recognition, dan audio duplex SIP/VoIP.');

    // Card 1: Drive-Thru
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y: 2.05,
      w: 5.7,
      h: 3.05,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addText('4.1 Drive-Thru (Multi-Window Lane)', {
      x: 1.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_CYAN
    });

    slide.addText('Pemesanan tiang interkom, bayar di jendela 1, ambil di jendela 2 dengan target SOS <180s.', {
      x: 1.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    const dtItems = [
      '• Ground Loop Detector: Mobil melindas aspal -> alert chime di headset kasir',
      '• LPR Camera AI: Membaca plat nomor mobil untuk mengikat order jendela 1 & 2',
      '• Full-Duplex VoIP SIP: Transmisi audio jernih antara tiang luar dan headset kasir',
      '• Speed of Service (SOS) SLA: Timer hitung antrean per zona (Target total < 180s)'
    ].join('\n');

    slide.addText(dtItems, {
      x: 1.1,
      y: 2.95,
      w: 5.1,
      h: 2.0,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      color: C_WHITE,
      lineSpacing: 12
    });

    // Card 2: Carhop Service
    slide.addShape(pres.ShapeType.roundRect, {
      x: 6.8,
      y: 2.05,
      w: 5.7,
      h: 3.05,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addText('4.2 Drive-In / Carhop Service', {
      x: 7.1,
      y: 2.2,
      w: 5.1,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_PURPLE
    });

    slide.addText('Tamu parkir di stall bay, memesan via tombol tiang, pelayan antar baki ke jendela mobil.', {
      x: 7.1,
      y: 2.55,
      w: 5.1,
      h: 0.35,
      fontSize: 9.5,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    const carhopItems = [
      '• Ultrasonic Bay Sensor: Deteksi slot parkir terisi dan update visual peta bay POS',
      '• Push-to-Talk Matrix: Tombol merah di 20 tiang parkir ke konsol sentral operator',
      '• Car Window Clamp Tray: Baki khusus berperekat kaca jendela samping mobil tamu',
      '• Mobile 4G EDC: Bayar kartu langsung dari dalam mobil tanpa tamu harus turun'
    ].join('\n');

    slide.addText(carhopItems, {
      x: 7.1,
      y: 2.95,
      w: 5.1,
      h: 2.0,
      fontSize: 8.5,
      fontFace: 'Helvetica Neue',
      color: C_WHITE,
      lineSpacing: 12
    });

    // 5-Step Visual Flowchart
    addVisualWorkflowBar(
      slide,
      5.25,
      'Alur Telemetri Kendaraan Drive-Thru & Carhop Bay Parking',
      'Visual Flow 06 · Vehicle Service',
      [
        { step: '01', title: 'Deteksi Kendaraan', device: 'Ground Loop', protocol: 'Inductive', detail: 'Mobil melindas aspal' },
        { step: '02', title: 'LPR AI Plat No', device: 'Kamera OCR IP', protocol: 'RTSP Stream', detail: 'Plat diikat ke tiket' },
        { step: '03', title: 'VoIP Interkom', device: 'Tiang Interkom', protocol: 'SIP Duplex', detail: 'Audio kasir jernih' },
        { step: '04', title: 'Bayar & Ambil', device: 'Window 1 & 2', protocol: 'SOS Timer', detail: 'SLA total < 180 detik' },
        { step: '05', title: 'Carhop Bay Park', device: 'Ultrasonic Stall', protocol: 'Mobile 4G EDC', detail: 'Antar baki ke mobil' }
      ],
      C_CYAN
    );
  }

  // -----------------------------------------------------------------------------
  // SLIDE 9: SPECIAL CONCEPTS (OMAKASE, FOOD COURT, GHOST KITCHEN)
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '08. CONTEMPORARY & SPECIAL CONCEPTS', "Omakase Chef's Table, Food Court & Cloud Kitchen", 'Arsitektur tingkat lanjut: Zero-excess daily catch, multi-tenant split escrow, dan middleware ojol.');

    const special = [
      {
        title: "5.1 Omakase / Chef's Table",
        badge: 'ZERO-EXCESS & PRE-AUTH',
        color: C_PURPLE,
        items: [
          '• 100% Pre-Auth Deposit: Kunci dana kartu di muka (0% No-Show).',
          '• Dynamic Daily BOM: Input tangkapan ikan lelang subuh.',
          '• Synchronous Coursing: Tablet pandu 18-course serentak.',
          '• Seat Allergy Matrix: Alergi per kursi bar konter.'
        ]
      },
      {
        title: '5.2 Food Court Multi-Tenant',
        badge: 'SPLIT ESCROW PAYOUT',
        color: C_AMBER,
        items: [
          '• Unified Cart: Pesan 3 tenant dalam 1 keranjang sentral.',
          '• Split Escrow Payment: Pisah dana (80% Tenant, 15% Mall).',
          '• RAW ESC/POS IP 9100: Tiket tembak ke printer tenant.',
          '• Tenant Isolation: Database bahan baku terisolasi ketat.'
        ]
      },
      {
        title: '5.3 Ghost / Cloud Kitchen',
        badge: 'OMNICHANNEL AGGREGATOR',
        color: C_ROSE,
        items: [
          '• Multi-Aggregator: Grab, GoFood & ShopeeFood di 1 konsol.',
          '• Virtual Brand Pooling: Berbagi stok bahan mentah bersama.',
          '• Driver Dispatch TV: Layar ruang tunggu pandu kurir ojol.',
          '• Kitchen Throttling: Naikkan estimasi prep jika order > 15.'
        ]
      }
    ];

    special.forEach((sp, idx) => {
      const xPos = 0.8 + idx * 3.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 2.05,
        w: 3.75,
        h: 3.05,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(sp.title, {
        x: xPos + 0.2,
        y: 2.2,
        w: 3.35,
        h: 0.3,
        fontSize: 13,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: sp.color
      });

      slide.addText(sp.badge, {
        x: xPos + 0.2,
        y: 2.5,
        w: 3.35,
        h: 0.25,
        fontSize: 9,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(sp.items.join('\n'), {
        x: xPos + 0.2,
        y: 2.85,
        w: 3.35,
        h: 2.1,
        fontSize: 8.5,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacing: 12
      });
    });

    // 5-Step Visual Flowchart
    addVisualWorkflowBar(
      slide,
      5.25,
      'Alur Pre-Auth Omakase, Multi-Tenant Food Court & Cloud Kitchen',
      'Visual Flow 07 · Special Concepts',
      [
        { step: '01', title: 'Pre-Auth Escrow', device: 'Payment Gateway', protocol: '100% Deposit', detail: 'Hold kartu 0% no-show' },
        { step: '02', title: 'Dynamic BOM', device: 'Tablet Chef', protocol: 'Zero-Excess', detail: 'Tangkapan lelang subuh' },
        { step: '03', title: 'Multi-Tenant Split', device: 'Central Kiosk', protocol: 'Split Escrow', detail: '80% Stand, 15% Mall' },
        { step: '04', title: 'Direct IP Print', device: 'Printer Stand', protocol: 'RAW TCP 9100', detail: 'Tiket cetak ke stand' },
        { step: '05', title: 'Omnichannel Hub', device: 'Aggregator API', protocol: 'HMAC Webhook', detail: 'Grab/GoFood auto-KDS' }
      ],
      C_PURPLE
    );
  }

  // -----------------------------------------------------------------------------
  // SLIDE 10: UNIFIED PROTOCOL MATRIX FOR DEVELOPERS
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '09. DEVELOPER PROTOCOL STACK', 'Matriks Protokol Komunikasi & Integrasi Perangkat', 'Ringkasan protokol jaringan yang harus diimplementasikan tim backend & IoT engineer.');

    const protocols = [
      { proto: 'WebSocket (WSS)', layer: 'Real-time Event Stream', speed: '< 150 ms', desc: 'Sinkronisasi KDS dapur, timer AYCE, live table status, shared QR cart, dan driver dispatch TV.' },
      { proto: 'MQTT over TLS', layer: 'IoT Sensor Telemetry', speed: '< 300 ms', desc: 'Kontrol relay loker pintar ESP32, probe suhu HACCP warmer/chiller, dan armada robot AMR.' },
      { proto: 'Modbus TCP / RS485', layer: 'Industrial Machine Bus', speed: '< 50 ms', desc: 'Inverter PLC motor konveyor Kaiten, rel Shinkansen tray, dan push button tiang carhop.' },
      { proto: 'RAW ESC/POS (TCP 9100)', layer: 'Direct Socket Printing', speed: '< 200 ms', desc: 'Pencetakan tiket dapur dan nota multi-tenant langsung ke printer thermal IP tanpa print spooler OS.' },
      { proto: 'SIP / VoIP / RTP', layer: 'Duplex Voice Stream', speed: '< 80 ms', desc: 'Audio headset interkom drive-thru tiang luar ruangan dan audio matrix parking stall carhop.' },
      { proto: 'HTTPS REST & HMAC', layer: 'Transactional & Webhooks', speed: '< 500 ms', desc: 'Submit checkout ACID, webhook payment QRIS, dan integrasi OpenAPI GrabFood/GoFood.' }
    ];

    protocols.forEach((p, idx) => {
      const yPos = 2.05 + idx * 0.48;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: yPos,
        w: 11.7,
        h: 0.42,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.06
      });

      slide.addText(p.proto, {
        x: 1.0,
        y: yPos + 0.08,
        w: 2.5,
        h: 0.28,
        fontSize: 10,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_CYAN
      });

      slide.addText(p.layer, {
        x: 3.5,
        y: yPos + 0.08,
        w: 2.2,
        h: 0.28,
        fontSize: 9.5,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: C_WHITE
      });

      slide.addText(p.speed, {
        x: 5.7,
        y: yPos + 0.08,
        w: 1.2,
        h: 0.28,
        fontSize: 9,
        fontFace: 'Helvetica Neue',
        color: C_EMERALD
      });

      slide.addText(p.desc, {
        x: 6.9,
        y: yPos + 0.06,
        w: 5.4,
        h: 0.32,
        fontSize: 8.5,
        fontFace: 'Helvetica Neue',
        color: C_MUTED
      });
    });

    // 5-Step Visual Flowchart
    addVisualWorkflowBar(
      slide,
      5.15,
      'Arsitektur Bus Komunikasi Data Client - Edge - Server - Hardware',
      'Visual Flow 08 · Developer Network Topology',
      [
        { step: '01', title: 'Client Tier', device: 'Tablet/QR/Phone', protocol: 'WSS / HTTPS', detail: 'Order & status meja' },
        { step: '02', title: 'Edge Gateway', device: 'Local Node Hub', protocol: 'mDNS / UDP', detail: 'Offline Store-Forward' },
        { step: '03', title: 'IoT Network Bus', device: 'MQTT / Modbus', protocol: 'Port 8883/502', detail: 'Relay loker & konveyor' },
        { step: '04', title: 'Hardware I/O', device: 'ESC/POS Printer', protocol: 'TCP Port 9100', detail: 'Direct thermal print' },
        { step: '05', title: 'Core DB Engine', device: 'PostgreSQL DB', protocol: 'ACID Row-Lock', detail: 'Persistensi inventaris' }
      ],
      C_CYAN
    );
  }

  // -----------------------------------------------------------------------------
  // SLIDE 11: CONCURRENCY & INVENTORY LOCKING ARCHITECTURE
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '10. CONCURRENCY & INVENTORY ENGINE', 'Arsitektur ACID Lock & Pencegah Overselling Multi-Kasir', 'Bagaimana sistem mencegah race condition saat ratusan kasir dan kiosk memesan bahan yang sama.');

    const rules = [
      {
        title: '1. Row-Level Pessimistic Locking',
        desc: 'Eksekusi SELECT stock_qty FROM inventory_items WHERE id = ? FOR UPDATE di PostgreSQL. Menjamin hanya 1 transaksi yang dapat memotong gramasi porsi terakhir.',
        color: C_ROSE
      },
      {
        title: '2. In-Memory Distributed Lock (Redis)',
        desc: 'Untuk flash-sale / QR Kiosk ramai, kuota item ditahan sementara (TTL 300 detik) di Redis sebelum transaksi pembayaran commit ke database persisten.',
        color: C_AMBER
      },
      {
        title: '3. Multi-Stage BOM Formulation',
        desc: 'Pemisahan status: Soft Hold (saat tamu memasukkan keranjang) -> Hard Deduct (saat bayar lunas) -> Waste Logging (saat makanan tumpah/gosong di dapur).',
        color: C_CYAN
      },
      {
        title: '4. Offline-First Store & Forward',
        desc: 'Saat Wi-Fi terputus, POS lokal menyimpan order di IndexedDB/SQLite lokal dengan Idempotency-Key. Begitu online, worker mengunggah tanpa duplikasi potongan stok.',
        color: C_EMERALD
      }
    ];

    rules.forEach((r, idx) => {
      const xPos = idx % 2 === 0 ? 0.8 : 6.8;
      const yPos = idx < 2 ? 2.05 : 3.55;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: yPos,
        w: 5.7,
        h: 1.35,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.1
      });

      slide.addText(r.title, {
        x: xPos + 0.25,
        y: yPos + 0.15,
        w: 5.2,
        h: 0.28,
        fontSize: 12,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: r.color
      });

      slide.addText(r.desc, {
        x: xPos + 0.25,
        y: yPos + 0.45,
        w: 5.2,
        h: 0.8,
        fontSize: 8.5,
        fontFace: 'Helvetica Neue',
        color: C_MUTED,
        lineSpacing: 12
      });
    });

    // 5-Step Visual Flowchart
    addVisualWorkflowBar(
      slide,
      5.15,
      'Simulasi Rebutan Porsi Terakhir (Race Condition) Kasir 1 vs Kiosk 2',
      'Visual Flow 09 · ACID Pessimistic Lock Sequence',
      [
        { step: '01', title: 'Dual Checkout', device: 'Kasir 1 & Kiosk 2', protocol: 'Simultaneous', detail: 'Pesan porsi terakhir' },
        { step: '02', title: 'Acquire Lock', device: 'PostgreSQL Core', protocol: 'FOR UPDATE', detail: 'Kasir 1 kunci row' },
        { step: '03', title: 'Blocked Waiting', device: 'Kiosk 2 Session', protocol: 'Lock Waiting', detail: 'Kiosk 2 ditahan antre' },
        { step: '04', title: 'Commit & Deduct', device: 'Kasir 1 Commit', protocol: 'Stock = 0', detail: 'Struk Kasir 1 tercetak' },
        { step: '05', title: 'Rollback 409', device: 'Kiosk 2 Release', protocol: 'Conflict Err', detail: 'Oversell dicegah 100%' }
      ],
      C_ROSE
    );
  }

  // -----------------------------------------------------------------------------
  // SLIDE 12: DEVELOPER CHECKLIST & SPRINT ROADMAP
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };
    addSlideHeader(slide, '11. ENGINEERING ROADMAP', 'Checklist Implementasi & Pembagian Tugas Tim Dev', 'Rencana sprint 4 fase untuk merealisasikan seluruh 16 modul layanan.');

    const tracks = [
      {
        track: 'Frontend / Client Apps',
        owner: 'Tim Web & Mobile PWA',
        tasks: [
          '• State Machine Meja visual (Vacant, Seated, Ordered, Bussing)',
          '• Shared Table Cart via WebSocket Room per meja tamu',
          '• Layar KDS multi-station (Fryer, Grill, Bar, Expo) <150ms',
          '• Web Bluetooth API untuk timbangan presisi gram & BLE scale'
        ]
      },
      {
        track: 'Backend & Transactions',
        owner: 'Tim Backend API & DB',
        tasks: [
          '• PostgreSQL Row-Lock & atomic inventory deduction engine',
          '• Webhook handler idempotent untuk QRIS & Aggregator ojol',
          '• Multi-Tenant Split-Escrow settlement & ledger akuntansi',
          '• Dynamic Daily BOM formulation untuk konsep Omakase'
        ]
      },
      {
        track: 'IoT & Hardware Drivers',
        owner: 'Tim Embedded / Firmware',
        tasks: [
          '• Serial RS232 driver untuk transmitter RF 433MHz buzzer pager',
          '• Modbus TCP PLC controller rel konveyor & shinkansen tray',
          '• Firmware ESP32 relay solenoid kunci locker & sensor DS18B20',
          '• RAW socket ESC/POS client port 9100 ke IP printer dapur'
        ]
      },
      {
        track: 'Network & DevOps',
        owner: 'Tim Infra & Site Reliability',
        tasks: [
          '• Isolated VLAN configuration (POS LAN terpisah dari Guest Wi-Fi)',
          '• Dual-WAN 4G Failover Router untuk garansi uptime 99.9%',
          '• Local On-Premise server cache untuk ketahanan mode offline',
          '• SIP/VoIP PBX gateway untuk interkom tiang drive-thru'
        ]
      }
    ];

    tracks.forEach((t, idx) => {
      const xPos = 0.8 + idx * 2.95;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos,
        y: 2.1,
        w: 2.8,
        h: 4.6,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.12
      });

      slide.addText(t.track, {
        x: xPos + 0.15,
        y: 2.3,
        w: 2.5,
        h: 0.35,
        fontSize: 12,
        fontFace: 'Helvetica Neue',
        bold: true,
        color: idx === 0 ? C_CYAN : idx === 1 ? C_AMBER : idx === 2 ? C_EMERALD : C_PURPLE
      });

      slide.addText(t.owner, {
        x: xPos + 0.15,
        y: 2.65,
        w: 2.5,
        h: 0.3,
        fontSize: 9.5,
        fontFace: 'Helvetica Neue',
        color: C_MUTED
      });

      slide.addText(t.tasks.join('\n\n'), {
        x: xPos + 0.15,
        y: 3.1,
        w: 2.5,
        h: 3.4,
        fontSize: 9.5,
        fontFace: 'Helvetica Neue',
        color: C_WHITE,
        lineSpacing: 15
      });
    });
  }

  // -----------------------------------------------------------------------------
  // SLIDE 13: CLOSING SLIDE
  // -----------------------------------------------------------------------------
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK_BG };

    slide.addText('RESTOSYNC • NEXT-GEN RESTAURANT OS', {
      x: 1.0,
      y: 1.8,
      w: 11.3,
      h: 0.4,
      fontSize: 12,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_CYAN
    });

    slide.addText('Ready for Implementation.', {
      x: 1.0,
      y: 2.3,
      w: 11.3,
      h: 1.0,
      fontSize: 44,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_WHITE
    });

    slide.addText('16 Model Layanan, 6 Protokol Utama, 1 Basis Kode Arsitektur Tangguh.\nMari kita mulai Sprint 1 untuk fondasi Table Service, KDS Engine, dan ACID Locking.', {
      x: 1.0,
      y: 3.4,
      w: 10.5,
      h: 0.8,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    // Call to Action Box
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.0,
      y: 4.6,
      w: 11.3,
      h: 1.8,
      fill: { color: C_CARD_BG },
      line: { color: C_BORDER, width: 1 },
      rectRadius: 0.15
    });

    slide.addText('🚀 Target Sprint Selanjutnya:', {
      x: 1.3,
      y: 4.85,
      w: 10.7,
      h: 0.35,
      fontSize: 14,
      fontFace: 'Helvetica Neue',
      bold: true,
      color: C_AMBER
    });

    slide.addText(`Target: ${sprintTarget}\nDokumentasi Teknis Lengkap & Kode Swagger API dapat diakses di tab "16 Model Layanan & Dev" dan "API & WS Spec".`, {
      x: 1.3,
      y: 5.25,
      w: 10.7,
      h: 0.5,
      fontSize: 11,
      fontFace: 'Helvetica Neue',
      color: C_MUTED
    });

    slide.addText(`Diselenggarakan oleh: ${leadArchitect}   •   ${devTeamName}   •   ${meetingDate}`, {
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

export async function downloadDevModesPitchDeckPptx(options: DevDeckOptions = {}): Promise<void> {
  const pres = await generateDevModesPitchDeckPresentation(options);
  const teamSanitized = (options.devTeamName || 'DevTeam').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `RestoSync_Architecture_16_Models_AppleKeynote_${teamSanitized}.pptx`;
  await pres.writeFile({ fileName: filename });
}
