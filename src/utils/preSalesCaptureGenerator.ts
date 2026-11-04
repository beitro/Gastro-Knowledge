// High-Resolution Visual Capture Generator for Pre-Sales Pitching, ROI, Hardware, & SOP Document
// Generates crisp PNG image buffers (Uint8Array) for embedding into Microsoft Word (.docx) matching GastroStock style.

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

// 1. CAPTURE: Business Case & Simulasi ROI Restoran (Return on Investment) - GastroStock Light
export async function generateRoiSimulatorCapture(): Promise<Uint8Array> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 680;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#F5F5F7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Top Bar
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, 56);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 56);
  ctx.lineTo(canvas.width, 56);
  ctx.stroke();

  // Control dots
  const dots = ['#EF4444', '#F59E0B', '#10B981'];
  dots.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(24 + i * 16, 28, 5.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Title
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 15px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('GASTRO KNOWLEDGE SYSTEM · KALKULATOR ROI & STUDI KELAYAKAN INVESTASI F&B', 90, 33);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('● TARGET PAYBACK: < 3 BULAN (BALIK MODAL CEPAT)', 820, 33);

  // 4 Highlight KPI Summary Cards
  const kpis = [
    { title: 'OMZET BULANAN BASELINE', val: 'Rp 150.000.000', sub: 'Kapasitas 60 Kursi • 1 Outlet', col: '#2563EB' },
    { title: 'PENGHEMATAN FOOD WASTE (5%)', val: 'Rp 27.000.000 / thn', sub: 'Via Resep BOM & Auto-Deduct', col: '#059669' },
    { title: 'EFISIENSI BIAYA CETAK & KASIR', val: 'Rp 37.200.000 / thn', sub: 'QR Menu & Eliminasi Salah Input', col: '#D97706' },
    { title: 'TOTAL BENEFIT NETTO TAHUN 1', val: 'Rp 64.200.000', sub: 'ROI 342% vs Investasi Sistem', col: '#0891B2' }
  ];

  kpis.forEach((k, idx) => {
    const kx = 24 + idx * 288;
    const ky = 76;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(kx, ky, 276, 110, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 10.5px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(k.title, kx + 18, ky + 30);

    ctx.fillStyle = k.col;
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText(k.val, kx + 18, ky + 62);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(k.sub, kx + 18, ky + 86);
  });

  // Middle Split: Left Breakdown Table, Right Cumulative Savings Chart
  // Left: Breakdown Table
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(24, 204, 570, 445, 16);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 14px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Rincian Pos Efisiensi Finansial & Pencegahan Kebocoran', 44, 238);

  const breakdown = [
    { pos: '1. Food Waste Reduction (Bahan Rusak/Gosong)', pct: '5.0%', val: 'Rp 2.250.000 / bln', annual: 'Rp 27.000.000' },
    { pos: '2. Pencegahan Kasir Typo / Salah Hitung Bill', pct: '1.0%', val: 'Rp 1.500.000 / bln', annual: 'Rp 18.000.000' },
    { pos: '3. Penghematan Cetak Kertas Menu Fisik', pct: 'Fixed', val: 'Rp 600.000 / bln', annual: 'Rp 7.200.000' },
    { pos: '4. Efisiensi Jam Kerja Overtime Kasir & Koki', pct: '2.5%', val: 'Rp 1.000.000 / bln', annual: 'Rp 12.000.000' },
    { pos: 'TOTAL DAMPAK FINANSIAL TAHUNAN', pct: 'Netto', val: 'Rp 5.350.000 / bln', annual: 'Rp 64.200.000' }
  ];

  breakdown.forEach((b, bi) => {
    const by = 280 + bi * 68;
    const isTotal = bi === breakdown.length - 1;

    ctx.fillStyle = isTotal ? '#F8FAFC' : '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(44, by - 16, 530, 54, 10);
    ctx.fill();
    ctx.strokeStyle = isTotal ? '#0284C7' : '#F1F5F9';
    ctx.stroke();

    ctx.fillStyle = isTotal ? '#0F172A' : '#1E293B';
    ctx.font = isTotal ? 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif' : '11.5px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(b.pos, 56, by + 10);

    ctx.fillStyle = isTotal ? '#059669' : '#2563EB';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(b.annual, 430, by + 10);

    ctx.fillStyle = '#64748B';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(`Benefit Bulanan: ${b.val} (${b.pct})`, 56, by + 28);
  });

  // Right: Cumulative Cash Flow & Payback Chart
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(610, 204, 566, 445, 16);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 14px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Kurva Proyeksi Balik Modal (Payback Period: 2,7 Bulan)', 632, 238);

  // Month bars
  const months = ['Bulan 0', 'Bln 1', 'Bln 2', 'Bln 3 (BEP)', 'Bln 6', 'Bln 9', 'Bln 12'];
  const cashflows = [-14.5, -9.15, -3.8, 1.55, 17.6, 33.65, 49.7];

  months.forEach((m, mi) => {
    const mx = 645 + mi * 72;
    const cf = cashflows[mi];
    const isPositive = cf >= 0;
    const barHeight = Math.abs(cf) * 5.2;
    const zeroY = 440;
    const barY = isPositive ? zeroY - barHeight : zeroY;

    ctx.fillStyle = isPositive ? (mi === 3 ? '#10B981' : '#059669') : '#EF4444';
    ctx.beginPath();
    ctx.roundRect(mx, barY, 44, barHeight, 6);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText(`${cf > 0 ? '+' : ''}${cf}jt`, mx - 2, isPositive ? barY - 8 : barY + barHeight + 14);

    ctx.fillStyle = '#64748B';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(m, mx - 2, 580);
  });

  return canvasToUint8Array(canvas);
}

// 2. CAPTURE: Hardware Topology & LAN Architecture - GastroStock Light
export async function generateHardwareArchitectureCapture(): Promise<Uint8Array> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 680;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F5F5F7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, 56);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 56);
  ctx.lineTo(canvas.width, 56);
  ctx.stroke();

  // Control dots
  const dots = ['#EF4444', '#F59E0B', '#10B981'];
  dots.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(24 + i * 16, 28, 5.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 15px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('TOPOLOGI PERANGKAT KERAS (HARDWARE) & JARINGAN LOKAL RESTORAN', 90, 33);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('● DUAL-BAND WI-FI 6 + LAN OFFLINE RESILIENCE', 830, 33);

  // 4 Station Panels
  const stations = [
    { title: 'STASIUN KASIR (FOH)', ip: '192.168.10.50', dev: 'Tablet iPad / Android 10"', printer: 'Thermal Printer USB/LAN 80mm', cashDrawer: 'RJ11 Auto Cash Drawer', col: '#F59E0B' },
    { title: 'STASIUN DAPUR (KDS HOT)', ip: '192.168.10.150', dev: 'Tablet KDS 11" Wall Mount', printer: 'Epson TM-T82X LAN Chime', cashDrawer: 'Lonceng Ting-Ting Audio', col: '#10B981' },
    { title: 'STASIUN BAR / BARISTA', ip: '192.168.10.160', dev: 'Tablet KDS Minuman 10"', printer: 'Label Printer Cup Struk', cashDrawer: 'Split Ticket Automatic', col: '#06B6D4' },
    { title: 'GUDANG & STORAGE (WMS)', ip: '192.168.10.170', dev: 'Barcode Scanner Handheld', printer: 'Zebra Barcode Label Roll', cashDrawer: 'Sensor Suhu Chiller IoT', col: '#3B82F6' }
  ];

  stations.forEach((st, idx) => {
    const sx = 24 + idx * 288;
    const sy = 80;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = st.col;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(sx, sy, 276, 320, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect(sx, sy, 276, 55, [16, 16, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(st.title, sx + 16, sy + 26);

    ctx.fillStyle = '#64748B';
    ctx.font = '10.5px "JetBrains Mono", monospace';
    ctx.fillText(`IP: ${st.ip}`, sx + 16, sy + 44);

    // Specs
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('Perangkat Display:', sx + 16, sy + 85);
    ctx.font = '11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(st.dev, sx + 16, sy + 105);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('Printer / Output:', sx + 16, sy + 145);
    ctx.font = '11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(st.printer, sx + 16, sy + 165);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('Aksesori Khusus:', sx + 16, sy + 205);
    ctx.font = '11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(st.cashDrawer, sx + 16, sy + 225);

    // Online badge
    ctx.fillStyle = '#ECFDF5';
    ctx.beginPath();
    ctx.roundRect(sx + 16, sy + 265, 244, 32, 8);
    ctx.fill();
    ctx.fillStyle = '#047857';
    ctx.font = 'bold 10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('● STATUS HARDWARE: AKTIF ONLINE', sx + 138, sy + 285);
    ctx.textAlign = 'start';
  });

  // Bottom Center: Core Network Router / Gateway
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(24, 430, 1152, 215, 16);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 14px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('Spesifikasi Router, Switch & Mekanisme Failover Offline (High Availability)', 44, 465);

  const netSpecs = [
    { title: 'Dual-Band Wi-Fi 6 Router', desc: 'MikroTik / Ruijie Reyee RG-EW1800GX dengan 2 SSID terisolasi (POS-INTERNAL VLAN 10 dan GUEST-WIFI VLAN 20).' },
    { title: 'Gigabit PoE Switch 8-Port', desc: 'Menghubungkan printer LAN dapur dan access point dengan kabel Cat6 shielded untuk transmisi zero-packet-loss.' },
    { title: 'Offline Local SQLite Cache', desc: 'Jika koneksi internet putus, kasir tetap bisa checkout & cetak struk; data tersinkronisasi saat online.' },
    { title: 'UPS Baterai Backup 1200VA', desc: 'Menjamin stasiun kasir & KDS tetap menyala 45 menit saat listrik PLN padam tiba-tiba.' }
  ];

  netSpecs.forEach((ns, ni) => {
    const nx = 44 + (ni % 2) * 565;
    const ny = 495 + Math.floor(ni / 2) * 65;

    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect(nx, ny, 545, 52, 10);
    ctx.fill();
    ctx.strokeStyle = '#F1F5F9';
    ctx.stroke();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(ns.title, nx + 14, ny + 20);

    ctx.fillStyle = '#64748B';
    ctx.font = '10px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(ns.desc, nx + 14, ny + 38);
  });

  return canvasToUint8Array(canvas);
}

// 3. CAPTURE: Daily Operational SOP Timeline - GastroStock Light
export async function generateDailyOperationsTimelineCapture(): Promise<Uint8Array> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 680;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F5F5F7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, 56);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 56);
  ctx.lineTo(canvas.width, 56);
  ctx.stroke();

  // Control dots
  const dots = ['#EF4444', '#F59E0B', '#10B981'];
  dots.forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(24 + i * 16, 28, 5.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 15px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('TIMELINE STANDAR OPERASIONAL PROSEDUR (SOP) HARIAN RESTORAN', 90, 33);

  ctx.fillStyle = '#059669';
  ctx.font = 'bold 11px "Plus Jakarta Sans", system-ui, sans-serif';
  ctx.fillText('● 3 FASE OPERASIONAL: OPENING · PEAK HOURS · CLOSING', 790, 33);

  // 3 Large Phase Panels
  const phases = [
    {
      title: 'FASE 1: OPENING RESTO (08:00 - 10:00)',
      sub: 'Persiapan Bahan, Modal Kasir & Pengecekan Suhu Chiller',
      color: '#0284C7',
      items: [
        'Input modal kasir laci (Petty Cash Rp 500.000) di POS.',
        'Pemeriksaan temperatur Walk-in Chiller (< 4°C) & Freezer (-18°C).',
        'QC fisik bahan prep koki: daging potongan porsi & saus batch.',
        'Pemeriksaan ketersediaan kertas struk & tes lonceng KDS dapur.'
      ]
    },
    {
      title: 'FASE 2: PEAK-HOUR SERVICE (11:30 - 14:00 & 18:30 - 21:00)',
      sub: 'Layanan Meja, Validasi BOM Resep & Manajemen Tiket KDS',
      color: '#F59E0B',
      items: [
        'Kasir menerima pesanan dengan auto-check saldo bahan resep.',
        'Koki memasak sesuai tiket KDS dengan target SLA < 12 menit.',
        'Pencatatan langsung insiden bahan rusak/gosong di layar KDS.',
        'Dashboard memantau lampu alert merah jika saldo bahan < ROP.'
      ]
    },
    {
      title: 'FASE 3: CLOSING & SETTLEMENT (21:30 - 23:00)',
      sub: 'Rekonsiliasi Kas Laci, Stock Opname & Laporan HPP',
      color: '#10B981',
      items: [
        'Hitung fisik uang kas laci vs laporan X/Z kasir (toleransi Rp 0).',
        'Stock opname kilat bahan mahal (Daging Wagyu, Salmon, Truffle).',
        'Review laporan waste harian & persetujuan draf PO belanja besok.',
        'Sign-off digital manajer & auto-sync laporan keuangan ke Owner.'
      ]
    }
  ];

  phases.forEach((p, idx) => {
    const px = 24 + idx * 388;
    const py = 80;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(px, py, 372, 560, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect(px, py, 372, 70, [16, 16, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 13px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(p.title, px + 18, py + 30);

    ctx.fillStyle = '#64748B';
    ctx.font = '10.5px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(p.sub, px + 18, py + 52);

    // Items Checklist
    p.items.forEach((item, ii) => {
      const iy = py + 105 + ii * 105;

      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(px + 16, iy - 14, 340, 85, 10);
      ctx.fill();
      ctx.strokeStyle = '#F1F5F9';
      ctx.stroke();

      ctx.fillStyle = p.color;
      ctx.font = 'bold 12px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(`Langkah ${ii + 1}:`, px + 28, iy + 10);

      ctx.fillStyle = '#334155';
      ctx.font = '11px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText(item, px + 28, iy + 34);

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 9.5px "Plus Jakarta Sans", system-ui, sans-serif';
      ctx.fillText('✓ WAJIB DICENTANG [☐] DI FORMULIR', px + 28, iy + 58);
    });
  });

  return canvasToUint8Array(canvas);
}

export async function generateAllPreSalesCaptures(): Promise<{
  roi: Uint8Array;
  hardware: Uint8Array;
  timeline: Uint8Array;
}> {
  const [roi, hardware, timeline] = await Promise.all([
    generateRoiSimulatorCapture(),
    generateHardwareArchitectureCapture(),
    generateDailyOperationsTimelineCapture()
  ]);

  return { roi, hardware, timeline };
}
