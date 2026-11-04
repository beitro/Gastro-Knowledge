// Canvas-based High-Resolution System Capture Generator for RestoSync Documentation (BRD, FSD, TSD)
// Produces crisp, publication-grade PNG image buffers (Uint8Array) matching the GastroStock UI/UX style.

export interface SystemCaptures {
  swimlane: Uint8Array;
  pos: Uint8Array;
  insufficientStock: Uint8Array;
  kds: Uint8Array;
  warehouse: Uint8Array;
  dashboard: Uint8Array;
}

// Helper to convert canvas to Uint8Array (PNG)
function canvasToUint8Array(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(new Uint8Array(0));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(new Uint8Array(arrayBuffer));
      };
      reader.readAsArrayBuffer(blob);
    }, 'image/png');
  });
}

// Helper to draw macOS-style window top bar
function drawWindowHeader(ctx: CanvasRenderingContext2D, width: number, title: string, subtitle: string) {
  // Top header background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, 52);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 52);
  ctx.lineTo(width, 52);
  ctx.stroke();

  // 3 Window control dots
  const dots = ['#EF4444', '#F59E0B', '#10B981'];
  dots.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(22 + i * 16, 26, 5.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Gastro Knowledge System Brand Pill
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(85, 12, 230, 28, 8);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('GASTRO KNOWLEDGE SYSTEM', 96, 30);

  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(232, 26, 4, 0, Math.PI * 2);
  ctx.fill();

  // Document & View Title
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 13px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(title, 265, 31);

  ctx.fillStyle = '#64748B';
  ctx.font = '11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText(`•  ${subtitle}`, 275 + ctx.measureText(title).width, 31);

  // Right Status Pill
  ctx.fillStyle = '#F1F5F9';
  ctx.beginPath();
  ctx.roundRect(width - 230, 14, 210, 24, 12);
  ctx.fill();
  ctx.fillStyle = '#047857';
  ctx.font = 'bold 10px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('● SYSTEM ONLINE · SYNC SUB-150MS', width - 218, 30);
}

// 1. CAPTURE 1: Diagram Swimlane Arsitektur Antar Sistem (GastroStock Light Style)
export function renderSwimlaneCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 700;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawWindowHeader(
    ctx,
    canvas.width,
    'DIAGRAM SWIMLANE ALUR PROSES ANTAR-SISTEM',
    'POS ↔ KDS ↔ Gudang HACCP ↔ Dashboard'
  );

  // 4 Lanes
  const lanes = [
    { name: 'INTERFACE KASIR (POS)', sub: 'Front of House • Order & BOM Check', y: 52, h: 160, border: '#F59E0B', bg: '#FFFFFF' },
    { name: 'INTERFACE DAPUR (KDS)', sub: 'Back of House • Cooking SLA & Chime', y: 212, h: 160, border: '#10B981', bg: '#FFFFFF' },
    { name: 'INTERFACE STOK & GUDANG', sub: 'Inventory Engine • HACCP Chiller & FEFO', y: 372, h: 160, border: '#06B6D4', bg: '#FFFFFF' },
    { name: 'DASHBOARD MONITORING', sub: 'Executive BI • Live Omset & COGS/HPP', y: 532, h: 168, border: '#3B82F6', bg: '#FFFFFF' }
  ];

  lanes.forEach((l) => {
    // Lane background
    ctx.fillStyle = l.bg;
    ctx.fillRect(0, l.y, canvas.width, l.h);

    // Bottom lane border
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, l.y + l.h);
    ctx.lineTo(canvas.width, l.y + l.h);
    ctx.stroke();

    // Left vertical lane title panel
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(0, l.y, 190, l.h);
    ctx.strokeStyle = '#E2E8F0';
    ctx.strokeRect(0, l.y, 190, l.h);

    // Colored left border accent
    ctx.fillStyle = l.border;
    ctx.fillRect(0, l.y, 6, l.h);

    // Lane header text
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(l.name, 18, l.y + 40);
    ctx.fillStyle = '#64748B';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(l.sub, 18, l.y + 60);
  });

  // Helper to draw modern node box
  const drawNode = (x: number, y: number, w: number, h: number, title: string, sub: string, borderCol: string, bgCol = '#FFFFFF') => {
    ctx.fillStyle = bgCol;
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(title, x + 12, y + 22);
    ctx.fillStyle = '#64748B';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(sub, x + 12, y + 40);
  };

  // Helper to draw connecting arrow
  const drawArrow = (x1: number, y1: number, x2: number, y2: number, label: string) => {
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 8 * Math.cos(angle - Math.PI / 6), y2 - 8 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - 8 * Math.cos(angle + Math.PI / 6), y2 - 8 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    if (label) {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.roundRect(mx - 50, my - 11, 100, 22, 6);
      ctx.fill();
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 9.5px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, mx, my + 3);
      ctx.textAlign = 'start';
    }
  };

  // Lane 1 (POS)
  drawNode(220, 95, 175, 55, '1. Input Pesanan Tamu', 'Dine-in Menu & Qty', '#F59E0B');
  drawNode(470, 95, 185, 55, '3. Terima Konfirmasi Stok', 'BOM Aman & Lanjut Bayar', '#10B981');
  drawNode(730, 95, 175, 55, '4. Pembayaran Selesai', 'Cetak Bill & QRIS/Cash', '#F59E0B');

  // Lane 2 (KDS)
  drawNode(730, 255, 175, 55, '5. Tiket Dapur Masuk', 'Audio Bell Ting-Ting!', '#10B981');
  drawNode(960, 255, 175, 55, '6. Mulai Masak (SLA)', 'Stopwatch SLA 12 Min', '#10B981');

  // Lane 3 (Stok & Gudang)
  drawNode(220, 415, 185, 55, '2. Cek BOM Resep', 'Verifikasi Saldo Fisik', '#06B6D4');
  drawNode(470, 415, 185, 55, 'Bahan Cukup?', 'Atomic Kuota Reservasi', '#06B6D4');
  drawNode(730, 415, 185, 55, 'Potong Stok Riil', 'Mutasi OUT_SALE (FIFO)', '#06B6D4');

  // Lane 4 (Dashboard)
  drawNode(730, 575, 185, 55, '7. Update Omzet Kasir', 'Gross Sales Bertambah', '#3B82F6');
  drawNode(960, 575, 185, 55, '8. Hitung Real-time COGS', 'Food Cost % & Sisa Stok', '#3B82F6');

  // Connectors
  drawArrow(305, 150, 305, 415, 'Request BOM');
  drawArrow(405, 442, 470, 442, 'Verifikasi');
  drawArrow(560, 415, 560, 150, 'Stok Tersedia');
  drawArrow(655, 122, 730, 122, 'Bayar');
  drawArrow(815, 150, 815, 255, 'Push Tiket');
  drawArrow(815, 310, 815, 415, 'Komit Stok');
  drawArrow(905, 282, 960, 282, 'Masak');
  drawArrow(815, 470, 815, 575, 'Data Sales');
  drawArrow(1045, 310, 1045, 575, 'COGS Matang');

  return canvas;
}

export async function generateSwimlaneCapture(): Promise<Uint8Array> {
  return canvasToUint8Array(renderSwimlaneCanvas());
}

// 2. CAPTURE 2: Interface Kasir (Point of Sale / POS) - GastroStock Theme
export function renderPosCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#F5F5F7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawWindowHeader(ctx, canvas.width, 'KASIR POINT OF SALE (POS)', 'Terminal 01 · Kasir Utama');

  // Left 70%: Menu & Categories Card
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(24, 70, 700, 545, 16);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Category Pills
  const categories = ['Semua Menu (24)', 'Makanan Utama (12)', 'Minuman (8)', 'Dessert (4)'];
  categories.forEach((cat, idx) => {
    ctx.fillStyle = idx === 0 ? '#0F172A' : '#F1F5F9';
    ctx.beginPath();
    ctx.roundRect(40 + idx * 155, 86, 145, 34, 17);
    ctx.fill();
    ctx.fillStyle = idx === 0 ? '#FFFFFF' : '#475569';
    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(cat, 54 + idx * 155, 107);
  });

  // Menu Tiles Grid (2 cols x 3 rows)
  const menuItems = [
    { name: 'Nasi Goreng Wagyu', price: 'Rp 65.000', stock: 'Stok: 14 porsi', bom: 'Wagyu 80g, Beras 180g, Telur 1', col: '#10B981' },
    { name: 'Sirloin Steak 200g', price: 'Rp 145.000', stock: 'Stok: 8 porsi', bom: 'Sirloin 200g, Butter 30g, Kentang 150g', col: '#10B981' },
    { name: 'Ayam Bakar Madu', price: 'Rp 42.000', stock: 'Stok: 22 porsi', bom: 'Ayam 250g, Madu 20ml, Bumbu 40g', col: '#10B981' },
    { name: 'Salmon Mentai Rice', price: 'Rp 78.000', stock: 'Stok: 3 porsi (Menipis)', bom: 'Salmon 120g, Saus 50g, Nasi 200g', col: '#F59E0B' },
    { name: 'Iced Artisan Latte', price: 'Rp 32.000', stock: 'Stok: 45 porsi', bom: 'Espresso 36g, Fresh Milk 180ml', col: '#10B981' },
    { name: 'Truffle French Fries', price: 'Rp 38.000', stock: 'Stok: 18 porsi', bom: 'Kentang 200g, Truffle Oil 5ml, Mayo 30g', col: '#10B981' }
  ];

  menuItems.forEach((m, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const mx = 40 + col * 335;
    const my = 140 + row * 145;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(mx, my, 320, 130, 14);
    ctx.fill();
    ctx.stroke();

    // Menu Title & Price
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(m.name, mx + 16, my + 30);

    ctx.fillStyle = '#2563EB';
    ctx.font = 'bold 13px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(m.price, mx + 16, my + 52);

    // Stock Badge
    ctx.fillStyle = m.col === '#10B981' ? '#ECFDF5' : '#FEF3C7';
    ctx.beginPath();
    ctx.roundRect(mx + 16, my + 64, 150, 22, 6);
    ctx.fill();
    ctx.fillStyle = m.col === '#10B981' ? '#047857' : '#B45309';
    ctx.font = 'bold 10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(m.stock, mx + 24, my + 79);

    // BOM Info
    ctx.fillStyle = '#64748B';
    ctx.font = '9.5px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(`BOM: ${m.bom}`, mx + 16, my + 108);
  });

  // Right 30%: Active Cart & Bill Summary
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(740, 70, 335, 545, 16);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Bill Header
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 14px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Order #RS-2026-084', 760, 104);
  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Meja 04 · Dine-In', 760, 124);

  // Cart Items Divider
  ctx.strokeStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.moveTo(760, 140);
  ctx.lineTo(1055, 140);
  ctx.stroke();

  const cart = [
    { qty: '2x', name: 'Nasi Goreng Wagyu', price: 'Rp 130.000', bomNote: 'Potong Wagyu 160g, Telur 2' },
    { qty: '1x', name: 'Sirloin Steak 200g', price: 'Rp 145.000', bomNote: 'Potong Sirloin 200g' },
    { qty: '2x', name: 'Iced Artisan Latte', price: 'Rp 64.000', bomNote: 'Potong Fresh Milk 360ml' }
  ];

  cart.forEach((c, i) => {
    const cy = 165 + i * 65;
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(`${c.qty} ${c.name}`, 760, cy);
    ctx.textAlign = 'right';
    ctx.fillText(c.price, 1055, cy);
    ctx.textAlign = 'start';

    ctx.fillStyle = '#059669';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(`✓ ${c.bomNote}`, 760, cy + 18);
  });

  // Total Summary
  ctx.strokeStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.moveTo(760, 420);
  ctx.lineTo(1055, 420);
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = '12px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Subtotal (5 items)', 760, 445);
  ctx.textAlign = 'right';
  ctx.fillText('Rp 339.000', 1055, 445);
  ctx.textAlign = 'start';

  ctx.fillText('PB1 Resto (10%)', 760, 470);
  ctx.textAlign = 'right';
  ctx.fillText('Rp 33.900', 1055, 470);
  ctx.textAlign = 'start';

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 15px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Total Tagihan', 760, 510);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#2563EB';
  ctx.fillText('Rp 372.900', 1055, 510);
  ctx.textAlign = 'start';

  // Checkout Button
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(760, 535, 295, 55, 14);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 13px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BAYAR & TRANSMISI KE KDS DAPUR', 907, 568);
  ctx.textAlign = 'start';

  return canvas;
}

export async function generatePosCapture(): Promise<Uint8Array> {
  return canvasToUint8Array(renderPosCanvas());
}

// 3. CAPTURE 3: Penanganan Stok Tidak Cukup (Defisit & Rollback)
export function renderInsufficientStockCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F5F5F7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawWindowHeader(ctx, canvas.width, 'PROTEKSI STOK KURANG & ATOMIC ROLLBACK', 'Pencegahan Overselling Kasir');

  // Background Dimmed POS
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(30, 75, 1040, 535, 16);
  ctx.fill();

  // Dim overlay
  ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.fillRect(0, 52, canvas.width, canvas.height - 52);

  // Modal Dialog Box
  const mx = 250;
  const my = 120;
  const mw = 600;
  const mh = 430;

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(mx, my, mw, mh, 20);
  ctx.fill();
  ctx.stroke();

  // Modal Header Banner
  ctx.fillStyle = '#FEF2F2';
  ctx.beginPath();
  ctx.roundRect(mx, my, mw, 70, [20, 20, 0, 0]);
  ctx.fill();

  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 16px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('⚠️  PERINGATAN: STOK BAHAN BAKU TIDAK MENCUKUPI', mx + 24, my + 42);

  // Message
  ctx.fillStyle = '#1E293B';
  ctx.font = '12px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Pesanan [2x Nasi Goreng Wagyu] ditolak oleh BOM Engine. Transaksi dibatalkan secara atomik.', mx + 24, my + 105);

  // Deficit Detail Table
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(mx + 24, my + 125, mw - 48, 145, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('BAHAN BAKU', mx + 40, my + 150);
  ctx.fillText('KEBUTUHAN', mx + 210, my + 150);
  ctx.fillText('STOK RIIL GUDANG', mx + 340, my + 150);
  ctx.fillText('STATUS DEFISIT', mx + 470, my + 150);

  // Row 1 (Deficit Item)
  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Daging Sapi Wagyu', mx + 40, my + 180);
  ctx.fillText('160 gram', mx + 210, my + 180);
  ctx.fillText('50 gram', mx + 340, my + 180);
  ctx.fillText('DEFISIT -110 gram', mx + 470, my + 180);

  // Row 2 (Safe Item)
  ctx.fillStyle = '#0F172A';
  ctx.font = '11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Beras Premium', mx + 40, my + 210);
  ctx.fillText('360 gram', mx + 210, my + 210);
  ctx.fillStyle = '#059669';
  ctx.fillText('18.500 gram', mx + 340, my + 210);
  ctx.fillText('Aman (Cukup)', mx + 470, my + 210);

  // Row 3 (Safe Item)
  ctx.fillStyle = '#0F172A';
  ctx.fillText('Telur Ayam Negeri', mx + 40, my + 240);
  ctx.fillText('2 butir', mx + 210, my + 240);
  ctx.fillStyle = '#059669';
  ctx.fillText('142 butir', mx + 340, my + 240);
  ctx.fillText('Aman (Cukup)', mx + 470, my + 240);

  // Action Buttons
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(mx + 24, my + 295, 260, 48, 12);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('KUNCI MENU MENJADI SOLD-OUT', mx + 154, my + 325);

  ctx.fillStyle = '#F1F5F9';
  ctx.beginPath();
  ctx.roundRect(mx + 300, my + 295, 252, 48, 12);
  ctx.fill();
  ctx.fillStyle = '#0F172A';
  ctx.fillText('GANTI MENU ALTERNATIF', mx + 426, my + 325);
  ctx.textAlign = 'start';

  // ACID Rollback note
  ctx.fillStyle = '#047857';
  ctx.font = '10.5px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('✓ Transaksi DB Berhasil di-ROLLBACK: Saldo beras dan telur aman tanpa pemotongan sepihak.', mx + 24, my + 380);

  return canvas;
}

export async function generateInsufficientStockCapture(): Promise<Uint8Array> {
  return canvasToUint8Array(renderInsufficientStockCanvas());
}

// 4. CAPTURE 4: Layar Interface Dapur KDS (Kitchen Display System)
export function renderKdsCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F5F5F7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawWindowHeader(ctx, canvas.width, 'KITCHEN DISPLAY SYSTEM (KDS)', 'Stasiun Hot Kitchen · Audio Bell Chime Active');

  // Filter Bar
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(24, 70, 1052, 50, 14);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  const filters = ['Semua Tiket (6)', 'Hot Kitchen (4)', 'Bar & Minuman (2)', 'Waste Tracker'];
  filters.forEach((f, idx) => {
    ctx.fillStyle = idx === 1 ? '#0F172A' : '#F1F5F9';
    ctx.beginPath();
    ctx.roundRect(38 + idx * 165, 78, 150, 34, 10);
    ctx.fill();
    ctx.fillStyle = idx === 1 ? '#FFFFFF' : '#475569';
    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(f, 54 + idx * 165, 99);
  });

  // KDS Ticket Cards (3 Columns)
  const tickets = [
    { id: '#RS-1082', table: 'Meja 04', status: 'COOKING', time: '04:32 / 12:00', badgeCol: '#10B981', items: ['2x Nasi Goreng Wagyu (Medium)', '1x Sirloin Steak 200g (Well-Done)'], note: 'BOM Auto-Deduct: Wagyu 160g, Sirloin 200g' },
    { id: '#RS-1083', table: 'Meja 09', status: 'QUEUED', time: '01:15 / 15:00', badgeCol: '#F59E0B', items: ['2x Ayam Bakar Madu', '1x Truffle Fries (Extra Mayo)'], note: 'BOM Auto-Deduct: Ayam 500g, Kentang 200g' },
    { id: '#RS-1084', table: 'Takeaway #12', status: 'SLA WARNING', time: '11:45 / 12:00', badgeCol: '#EF4444', items: ['1x Salmon Mentai Rice', '1x Wagyu Fried Rice'], note: 'SLA hampir habis: Segera plating' }
  ];

  tickets.forEach((t, i) => {
    const tx = 24 + i * 360;
    const ty = 135;
    const tw = 336;
    const th = 475;

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = t.badgeCol;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, th, 16);
    ctx.fill();
    ctx.stroke();

    // Card Header
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect(tx, ty, tw, 65, [16, 16, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 15px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(t.id, tx + 16, ty + 30);

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(t.table, tx + 16, ty + 50);

    // Status Pill
    ctx.fillStyle = t.badgeCol;
    ctx.beginPath();
    ctx.roundRect(tx + tw - 120, ty + 18, 105, 26, 8);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.status, tx + tw - 68, ty + 35);
    ctx.textAlign = 'start';

    // Timer SLA
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText(`⏱ SLA Timer: ${t.time}`, tx + 16, ty + 95);

    // Items List
    t.items.forEach((item, itemIdx) => {
      const iy = ty + 130 + itemIdx * 45;
      ctx.fillStyle = '#F1F5F9';
      ctx.beginPath();
      ctx.roundRect(tx + 16, iy - 14, tw - 32, 36, 8);
      ctx.fill();

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(item, tx + 28, iy + 9);
    });

    // BOM Deduction Note
    ctx.fillStyle = '#059669';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(`✓ ${t.note}`, tx + 16, ty + 300);

    // Action Buttons
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(tx + 16, ty + 350, tw - 32, 44, 10);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SELESAI SAJI (PANGGIL RUNNER)', tx + tw / 2, ty + 377);

    ctx.fillStyle = '#FEF2F2';
    ctx.strokeStyle = '#FCA5A5';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tx + 16, ty + 406, tw - 32, 36, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('🗑 Catat Bahan Rusak / Waste Dapur', tx + tw / 2, ty + 429);
    ctx.textAlign = 'start';
  });

  return canvas;
}

export async function generateKdsCapture(): Promise<Uint8Array> {
  return canvasToUint8Array(renderKdsCanvas());
}

// 5. CAPTURE 5: Gudang, Chiller HACCP & Batch FEFO
export function renderWarehouseCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F5F5F7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawWindowHeader(ctx, canvas.width, 'GUDANG, STORAGE ZONES & INVENTARIS FEFO', 'Monitoring HACCP & Batch Kedaluwarsa');

  // Top 5 Storage Temperature Zone Cards (GastroStock signature widget)
  const zones = [
    { label: 'Walk-in Chiller', temp: '3.2°C', icon: '❄️', status: 'Optimal (<4°C)', col: '#10B981' },
    { label: 'Deep Freezer', temp: '-18.5°C', icon: '🧊', status: 'Beku Maksimum', col: '#10B981' },
    { label: 'Dry Storage', temp: '22.0°C', icon: '📦', status: 'HACCP OK', col: '#10B981' },
    { label: 'Bar & Beverage', temp: '19.5°C', icon: '🍸', status: 'Sejuk Dingin', col: '#10B981' },
    { label: 'Gas & Utilitas', temp: 'Safety OK', icon: '🔥', status: 'Sensor Aman', col: '#10B981' }
  ];

  zones.forEach((z, idx) => {
    const zx = 24 + idx * 215;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(zx, 70, 202, 85, 14);
    ctx.fill();
    ctx.stroke();

    ctx.font = '20px system-ui';
    ctx.fillText(z.icon, zx + 14, 104);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(z.label, zx + 46, 96);

    ctx.fillStyle = '#2563EB';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText(z.temp, zx + 46, 118);

    ctx.fillStyle = '#047857';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(z.status, zx + 14, 142);
  });

  // Main Stock Inventory & Batch Ledger Table
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(24, 170, 1052, 445, 16);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Table Title & Actions
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 14px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Daftar Bahan Baku Riil & Alokasi Batch FEFO (First-Expired-First-Out)', 44, 204);

  // Table Headers
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(44, 222, 1012, 34);
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('KODE SKU', 60, 243);
  ctx.fillText('NAMA BAHAN BAKU', 180, 243);
  ctx.fillText('LOKASI STORAGE', 380, 243);
  ctx.fillText('SALDO FISIK', 550, 243);
  ctx.fillText('REORDER POINT', 690, 243);
  ctx.fillText('BATCH FEFO EXPIRY', 830, 243);
  ctx.fillText('STATUS ROP', 970, 243);

  const inventoryRows = [
    { sku: 'RAW-BEEF-01', name: 'Daging Wagyu Meltique', loc: 'Walk-in Chiller', stock: '2.450 gram', rop: '3.000 gram', exp: 'LOT-2604 (22 Okt 2026)', status: 'LOW (ROP)', col: '#EF4444' },
    { sku: 'RAW-BEEF-02', name: 'Sirloin Cut 200g', loc: 'Walk-in Chiller', stock: '8.200 gram', rop: '4.000 gram', exp: 'LOT-2605 (28 Okt 2026)', status: 'SAFE', col: '#10B981' },
    { sku: 'RAW-CHKN-01', name: 'Ayam Fillet Paha', loc: 'Walk-in Chiller', stock: '14.500 gram', rop: '5.000 gram', exp: 'LOT-2608 (24 Okt 2026)', status: 'SAFE', col: '#10B981' },
    { sku: 'RAW-RICE-01', name: 'Beras Pandan Wangi', loc: 'Dry Storage', stock: '48.000 gram', rop: '20.000 gram', exp: 'LOT-2590 (15 Des 2026)', status: 'SAFE', col: '#10B981' },
    { sku: 'RAW-DAIR-01', name: 'Fresh Milk Pasteurisasi', loc: 'Bar Beverage', stock: '18 liter', rop: '10 liter', exp: 'LOT-2611 (20 Okt 2026)', status: 'SAFE', col: '#10B981' },
    { sku: 'RAW-OIL-01', name: 'White Truffle Oil', loc: 'Dry Storage', stock: '450 ml', rop: '500 ml', exp: 'LOT-2550 (30 Jan 2027)', status: 'LOW (ROP)', col: '#EF4444' }
  ];

  inventoryRows.forEach((row, i) => {
    const ry = 280 + i * 48;
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(44, ry + 12);
    ctx.lineTo(1056, ry + 12);
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(row.sku, 60, ry);

    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(row.name, 180, ry);

    ctx.font = '11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(row.loc, 380, ry);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText(row.stock, 550, ry);
    ctx.fillStyle = '#64748B';
    ctx.fillText(row.rop, 690, ry);
    ctx.fillText(row.exp, 830, ry);

    // Status Badge
    ctx.fillStyle = row.col === '#EF4444' ? '#FEE2E2' : '#DCFCE7';
    ctx.beginPath();
    ctx.roundRect(960, ry - 14, 85, 22, 6);
    ctx.fill();
    ctx.fillStyle = row.col;
    ctx.font = 'bold 10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(row.status, 1002, ry + 1);
    ctx.textAlign = 'start';
  });

  // Auto Draf PO Action
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(44, 565, 340, 38, 10);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('1-KLIK GENERATE DRAF PO BELANJA SUPPLIER', 214, 589);
  ctx.textAlign = 'start';

  return canvas;
}

export async function generateWarehouseCapture(): Promise<Uint8Array> {
  return canvasToUint8Array(renderWarehouseCanvas());
}

// 6. CAPTURE 6: Executive BI Dashboard (Live Omset, COGS & Audit)
export function renderDashboardCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1100;
  canvas.height = 640;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F5F5F7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawWindowHeader(ctx, canvas.width, 'DASHBOARD EKSEKUTIF REAL-TIME', 'Live Omset, HPP (COGS), Spoilage & Audit Ledger');

  // Top 4 Metric KPI Cards
  const kpis = [
    { title: 'Gross Omset Hari Ini', val: 'Rp 18.450.000', sub: '+14% vs target harian', col: '#10B981' },
    { title: 'Real-time COGS / HPP', val: '31.2%', sub: 'Target ideal: < 33.0%', col: '#10B981' },
    { title: 'Kitchen Spoilage Waste', val: 'Rp 14.500', sub: '2 insiden tercatat (0.07%)', col: '#0F172A' },
    { title: 'Bahan ROP Alert', val: '2 SKU', sub: 'Wagyu & Truffle Oil', col: '#EF4444' }
  ];

  kpis.forEach((k, idx) => {
    const kx = 24 + idx * 268;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(kx, 70, 256, 100, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(k.title, kx + 18, 98);

    ctx.fillStyle = k.col;
    ctx.font = 'bold 20px "JetBrains Mono", monospace';
    ctx.fillText(k.val, kx + 18, 130);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(k.sub, kx + 18, 152);
  });

  // Middle Split: Left Graph (Food Cost Trend), Right Live Audit Ledger
  // Left: COGS Chart representation
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(24, 185, 480, 430, 16);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 14px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Grafik Real-Time Food Cost Ratio (Harian)', 44, 218);

  // Bars representing last 7 days
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min (Hari Ini)'];
  const ratios = [33.5, 32.8, 31.9, 32.2, 30.8, 31.5, 31.2];
  days.forEach((d, di) => {
    const bx = 55 + di * 60;
    const barHeight = (ratios[di] - 25) * 20;
    const by = 530 - barHeight;

    ctx.fillStyle = di === 6 ? '#2563EB' : '#E2E8F0';
    ctx.beginPath();
    ctx.roundRect(bx, by, 38, barHeight, 6);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(`${ratios[di]}%`, bx - 2, by - 8);

    ctx.fillStyle = '#64748B';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(d, bx + 4, 555);
  });

  // Benchmark line
  ctx.strokeStyle = '#EF4444';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(50, 370);
  ctx.lineTo(470, 370);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#EF4444';
  ctx.font = 'bold 9.5px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Batas Ambang Target HPP: 33.0%', 280, 365);

  // Right: Real-time Stock Transactions & Audit Ledger
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(520, 185, 556, 430, 16);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 14px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Live Audit Ledger Transaksi Mutasi Stok (Sub-150ms)', 544, 218);

  const logs = [
    { time: '14:28:02', type: 'OUT_SALE', ref: 'Order #RS-1082', detail: '-160g Wagyu, -180g Beras', user: 'Kasir POS' },
    { time: '14:26:14', type: 'OUT_SALE', ref: 'Order #RS-1081', detail: '-200g Sirloin Steak', user: 'Kasir POS' },
    { time: '14:15:30', type: 'ADJUST_WASTE', ref: 'Waste Dapur', detail: '-2 Butir Telur (Pecah)', user: 'Chef KDS' },
    { time: '13:50:22', type: 'IN_PURCHASE', ref: 'PO-2026-091', detail: '+10kg Beras Pandan Wangi', user: 'Staf Gudang' },
    { time: '13:32:05', type: 'OUT_SALE', ref: 'Order #RS-1080', detail: '-360ml Fresh Milk', user: 'Kasir POS' },
    { time: '12:45:10', type: 'VOID_ROLLBACK', ref: 'Void Order #RS-1077', detail: '+80g Wagyu (Kembali ke Stok)', user: 'Supervisor' }
  ];

  logs.forEach((log, li) => {
    const ly = 265 + li * 54;
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(544, ly + 16);
    ctx.lineTo(1050, ly + 16);
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(log.time, 544, ly);

    ctx.fillStyle = log.type === 'OUT_SALE' ? '#2563EB' : log.type === 'IN_PURCHASE' ? '#059669' : log.type === 'ADJUST_WASTE' ? '#DC2626' : '#D97706';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(log.type, 615, ly);

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(log.ref, 730, ly);

    ctx.fillStyle = '#64748B';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(log.detail, 730, ly + 14);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#475569';
    ctx.fillText(log.user, 1050, ly);
    ctx.textAlign = 'start';
  });

  return canvas;
}

export async function generateDashboardCapture(): Promise<Uint8Array> {
  return canvasToUint8Array(renderDashboardCanvas());
}

// Master generator to export all system captures
export async function generateAllSystemCaptures(): Promise<SystemCaptures> {
  const [swimlane, pos, insufficientStock, kds, warehouse, dashboard] = await Promise.all([
    generateSwimlaneCapture(),
    generatePosCapture(),
    generateInsufficientStockCapture(),
    generateKdsCapture(),
    generateWarehouseCapture(),
    generateDashboardCapture()
  ]);

  return {
    swimlane,
    pos,
    insufficientStock,
    kds,
    warehouse,
    dashboard
  };
}

export interface SystemCaptureDataUrls {
  swimlane: string;
  pos: string;
  insufficientStock: string;
  kds: string;
  warehouse: string;
  dashboard: string;
}

// Synchronously generate all 6 crisp data URLs for fast browser rendering & preview
export function getAllCaptureDataUrls(): SystemCaptureDataUrls {
  return {
    swimlane: renderSwimlaneCanvas().toDataURL('image/png'),
    pos: renderPosCanvas().toDataURL('image/png'),
    insufficientStock: renderInsufficientStockCanvas().toDataURL('image/png'),
    kds: renderKdsCanvas().toDataURL('image/png'),
    warehouse: renderWarehouseCanvas().toDataURL('image/png'),
    dashboard: renderDashboardCanvas().toDataURL('image/png')
  };
}

