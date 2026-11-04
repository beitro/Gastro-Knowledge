// Figma Integration Utility for GastroStock UI/UX Wireframe & Prototype
// Enables Direct SVG Copy-Paste into Figma, File Drag-and-Drop, and Design Tokens Studio Export.

export type FigmaRoleKey = 'kasir' | 'waiter' | 'kitchen' | 'manager' | 'owner' | 'gudang' | 'servicemodes';

// -----------------------------------------------------------------------------
// DESIGN TOKENS (FIGMA TOKENS STUDIO COMPATIBLE - RESTOSYNC 2.0)
// -----------------------------------------------------------------------------
export const GASTROSTOCK_DESIGN_TOKENS = {
  version: '2.0.0',
  name: 'RestoSync 2.0 & GastroStock Design Tokens (Figma Tokens Studio)',
  systemVersion: '2.0-ENTERPRISE',
  global: {
    color: {
      brandPrimary: { value: '#0F2942', type: 'color', description: 'Deep Navy Corporate' },
      brandSecondary: { value: '#0284C7', type: 'color', description: 'Tech Cyan Blue' },
      brandAccent: { value: '#D97706', type: 'color', description: 'Amber Gold Warning' },
      brandSuccess: { value: '#059669', type: 'color', description: 'Emerald Green Lunas' },
      brandDanger: { value: '#DC2626', type: 'color', description: 'Rose Crimson Defisit' },
      brandPurple: { value: '#7C3AED', type: 'color', description: 'Violet Indigo Otorisasi' },
      brandRestoSync2: { value: '#06B6D4', type: 'color', description: 'RestoSync 2.0 Cyan Accent' },
      canvasBg: { value: '#1E1E1E', type: 'color', description: 'Figma Dark Workspace' },
      frameBg: { value: '#FFFFFF', type: 'color', description: 'Frame Light Background' },
      frameDarkBg: { value: '#090D16', type: 'color', description: 'KDS Kitchen Dark Screen' },
      borderLight: { value: '#E2E8F0', type: 'color', description: 'Border Slate Light' },
      textPrimary: { value: '#0F172A', type: 'color', description: 'Slate 900 Text' },
      textMuted: { value: '#64748B', type: 'color', description: 'Slate 500 Subtext' }
    },
    spacing: {
      none: { value: '0px', type: 'spacing' },
      xs: { value: '4px', type: 'spacing' },
      sm: { value: '8px', type: 'spacing' },
      md: { value: '16px', type: 'spacing' },
      lg: { value: '24px', type: 'spacing' },
      xl: { value: '32px', type: 'spacing' },
      touchTargetMin: { value: '48px', type: 'spacing', description: 'Minimum Touch Hit Target' }
    },
    borderRadius: {
      sm: { value: '8px', type: 'borderRadius' },
      md: { value: '16px', type: 'borderRadius' },
      lg: { value: '24px', type: 'borderRadius' },
      full: { value: '9999px', type: 'borderRadius' }
    },
    typography: {
      headingLg: {
        fontFamily: 'Inter, Segoe UI, sans-serif',
        fontWeight: '700',
        fontSize: '24px',
        lineHeight: '32px'
      },
      headingMd: {
        fontFamily: 'Inter, Segoe UI, sans-serif',
        fontWeight: '700',
        fontSize: '18px',
        lineHeight: '26px'
      },
      bodyMd: {
        fontFamily: 'Inter, Segoe UI, sans-serif',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '20px'
      },
      captionSm: {
        fontFamily: 'Inter, Segoe UI, sans-serif',
        fontWeight: '500',
        fontSize: '11px',
        lineHeight: '16px'
      },
      codeMono: {
        fontFamily: 'JetBrains Mono, Consolas, monospace',
        fontWeight: '600',
        fontSize: '12px',
        lineHeight: '18px'
      }
    }
  }
};

// -----------------------------------------------------------------------------
// SVG GENERATOR FOR FIGMA PASTE / DOWNLOAD
// -----------------------------------------------------------------------------
export function generateFigmaSvgForRole(role: FigmaRoleKey): string {
  switch (role) {
    case 'kasir':
      return generateKasirPosFigmaSvg();
    case 'waiter':
      return generateWaiterTabletFigmaSvg();
    case 'kitchen':
      return generateKitchenKdsFigmaSvg();
    case 'manager':
      return generateStoreManagerFigmaSvg();
    case 'owner':
      return generateOwnerDashboardFigmaSvg();
    case 'gudang':
      return generateWarehouseFigmaSvg();
    case 'servicemodes':
      return generateServiceModes2FigmaSvg();
    default:
      return generateKasirPosFigmaSvg();
  }
}

// 1. KASIR POS SVG (1440x900 FRAME)
function generateKasirPosFigmaSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900">
  <defs>
    <style>
      .bg { fill: #F8FAFC; }
      .card { fill: #FFFFFF; stroke: #E2E8F0; stroke-width: 1.5; rx: 16px; }
      .header { fill: #0F2942; }
      .text-title { font-family: Inter, Segoe UI, sans-serif; font-weight: 700; fill: #0F172A; }
      .text-sub { font-family: Inter, Segoe UI, sans-serif; font-weight: 500; fill: #64748B; font-size: 13px; }
      .text-white { font-family: Inter, Segoe UI, sans-serif; font-weight: 600; fill: #FFFFFF; }
      .text-brand { font-family: Inter, Segoe UI, sans-serif; font-weight: 700; fill: #0284C7; }
      .badge-bom { fill: #ECFDF5; stroke: #A7F3D0; stroke-width: 1; rx: 6px; }
      .btn-primary { fill: #059669; rx: 12px; }
      .btn-tab { fill: #0F172A; rx: 10px; }
      .btn-outline { fill: #FFFFFF; stroke: #CBD5E1; stroke-width: 1.5; rx: 10px; }
      .tag { fill: #F1F5F9; rx: 6px; }
    </style>
  </defs>

  <!-- Frame Background -->
  <rect width="1440" height="900" class="bg" />

  <!-- Figma Frame Label -->
  <rect x="0" y="0" width="1440" height="32" fill="#1E293B" />
  <text x="24" y="21" font-family="JetBrains Mono, monospace" font-size="12" fill="#38BDF8" font-weight="bold"># 💻 Frame: POS Kasir Touchscreen [1440x900] • Auto Layout 8px</text>

  <!-- Top App Navigation Bar -->
  <rect x="0" y="32" width="1440" height="64" class="header" />
  <text x="32" y="72" class="text-white" font-size="20">GastroStock POS</text>
  <text x="200" y="72" fill="#94A3B8" font-family="Inter, sans-serif" font-size="13">Station: Kasir-01 • Meja Terpilih: Meja 03 (4 Pax)</text>
  <rect x="1220" y="48" width="190" height="32" fill="#1E3A5F" rx="8" />
  <text x="1236" y="69" class="text-white" font-size="12">Kasir: Siti Aminah [Shift 1]</text>

  <!-- Main Left: Menu Catalog (Width: 920px) -->
  <rect x="32" y="120" width="900" height="740" class="card" />
  <text x="56" y="155" class="text-title" font-size="18">Katalog Menu &amp; Resep BOM</text>
  <text x="56" y="175" class="text-sub">Sentuh kartu menu untuk menambah pesanan &amp; validasi stok</text>

  <!-- Category Pills (Auto Layout Horizontal) -->
  <rect x="56" y="200" width="110" height="36" class="btn-tab" />
  <text x="80" y="223" class="text-white" font-size="13">Semua (24)</text>

  <rect x="176" y="200" width="120" height="36" class="btn-outline" />
  <text x="196" y="223" class="text-sub" font-size="13">Makanan (14)</text>

  <rect x="306" y="200" width="120" height="36" class="btn-outline" />
  <text x="326" y="223" class="text-sub" font-size="13">Minuman (8)</text>

  <rect x="436" y="200" width="110" height="36" class="btn-outline" />
  <text x="460" y="223" class="text-sub" font-size="13">Snack (2)</text>

  <!-- Menu Grid Item 1 -->
  <rect x="56" y="260" width="260" height="160" class="card" />
  <text x="76" y="295" class="text-title" font-size="15">Ayam Lengkuas</text>
  <text x="76" y="325" class="text-brand" font-size="16">Rp 38.000</text>
  <rect x="76" y="345" width="130" height="24" class="badge-bom" />
  <text x="86" y="361" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#047857">BOM: Ayam 0.25 kg</text>
  <rect x="76" y="380" width="220" height="28" fill="#F8FAFC" stroke="#CBD5E1" rx="6" />
  <text x="145" y="399" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">+ Tambah</text>

  <!-- Menu Grid Item 2 -->
  <rect x="336" y="260" width="260" height="160" class="card" />
  <text x="356" y="295" class="text-title" font-size="15">Nasi Liwet Solo</text>
  <text x="356" y="325" class="text-brand" font-size="16">Rp 12.000</text>
  <rect x="356" y="345" width="130" height="24" class="badge-bom" />
  <text x="366" y="361" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#047857">BOM: Beras 0.15 kg</text>
  <rect x="356" y="380" width="220" height="28" fill="#F8FAFC" stroke="#CBD5E1" rx="6" />
  <text x="425" y="399" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">+ Tambah</text>

  <!-- Menu Grid Item 3 -->
  <rect x="616" y="260" width="260" height="160" class="card" />
  <text x="636" y="295" class="text-title" font-size="15">Es Teh Manis</text>
  <text x="636" y="325" class="text-brand" font-size="16">Rp 8.000</text>
  <rect x="636" y="345" width="130" height="24" class="badge-bom" />
  <text x="646" y="361" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#047857">BOM: Teh &amp; Gula</text>
  <rect x="636" y="380" width="220" height="28" fill="#F8FAFC" stroke="#CBD5E1" rx="6" />
  <text x="705" y="399" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">+ Tambah</text>

  <!-- Menu Grid Item 4 (Sold Out Example) -->
  <rect x="56" y="440" width="260" height="160" class="card" stroke="#FDA4AF" fill="#FFF1F2" />
  <text x="76" y="475" class="text-title" font-size="15" fill="#9F1239">Iga Bakar Madu</text>
  <text x="76" y="505" font-family="Inter, sans-serif" font-weight="bold" font-size="16" fill="#9F1239">Rp 68.000</text>
  <rect x="76" y="525" width="120" height="24" fill="#FFE4E6" stroke="#FECDD3" rx="6" />
  <text x="86" y="541" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#BE123C">HABIS (Defisit)</text>
  <text x="76" y="580" font-family="Inter, sans-serif" font-size="11" fill="#881337">Daging iga &lt; 0.3kg di gudang</text>

  <!-- Right: Shopping Cart & Checkout Panel (Width: 440px) -->
  <rect x="960" y="120" width="448" height="740" class="card" />
  <text x="988" y="155" class="text-title" font-size="18">Keranjang Meja 03</text>
  <text x="988" y="175" class="text-sub">3 Item dipesan • Tamu: 4 Pax</text>

  <!-- Order Items in Cart -->
  <rect x="988" y="200" width="392" height="64" fill="#F8FAFC" stroke="#E2E8F0" rx="12" />
  <text x="1004" y="226" class="text-title" font-size="14">2x Ayam Goreng Lengkuas</text>
  <text x="1004" y="248" class="text-sub">Level Pedas: 2</text>
  <text x="1310" y="235" class="text-title" font-size="14">Rp 76.000</text>

  <rect x="988" y="276" width="392" height="64" fill="#F8FAFC" stroke="#E2E8F0" rx="12" />
  <text x="1004" y="302" class="text-title" font-size="14">2x Nasi Liwet Solo</text>
  <text x="1310" y="311" class="text-title" font-size="14">Rp 24.000</text>

  <rect x="988" y="352" width="392" height="64" fill="#F8FAFC" stroke="#E2E8F0" rx="12" />
  <text x="1004" y="378" class="text-title" font-size="14">2x Es Teh Manis</text>
  <text x="1004" y="400" class="text-sub">Less Ice</text>
  <text x="1310" y="387" class="text-title" font-size="14">Rp 16.000</text>

  <!-- Split Bill Banner -->
  <rect x="988" y="440" width="392" height="50" fill="#E0F2FE" stroke="#BAE6FD" rx="10" />
  <text x="1008" y="470" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#0369A1">Split Bill Aktif: 2 Orang (@ Rp 66.700)</text>

  <!-- Financial Summary -->
  <line x1="988" y1="520" x2="1380" y2="520" stroke="#E2E8F0" stroke-width="1.5" />
  <text x="988" y="550" class="text-sub">Subtotal</text>
  <text x="1310" y="550" class="text-title" font-size="13">Rp 116.000</text>
  <text x="988" y="575" class="text-sub">PB1 Resto (10%)</text>
  <text x="1310" y="575" class="text-title" font-size="13">Rp 11.600</text>
  <text x="988" y="600" class="text-sub">Service Charge (5%)</text>
  <text x="1310" y="600" class="text-title" font-size="13">Rp 5.800</text>

  <line x1="988" y1="620" x2="1380" y2="620" stroke="#CBD5E1" stroke-width="1.5" />
  <text x="988" y="650" class="text-title" font-size="17">Total Tagihan</text>
  <text x="1275" y="650" class="text-brand" font-size="20">Rp 133.400</text>

  <!-- Payment Methods Tabs -->
  <rect x="988" y="680" width="124" height="40" class="btn-tab" />
  <text x="1025" y="705" class="text-white" font-size="13">QRIS</text>

  <rect x="1122" y="680" width="124" height="40" class="btn-outline" />
  <text x="1165" y="705" class="text-sub" font-size="13">Tunai</text>

  <rect x="1256" y="680" width="124" height="40" class="btn-outline" />
  <text x="1302" y="705" class="text-sub" font-size="13">EDC</text>

  <!-- Checkout Button (48px Touch Ergonomic) -->
  <rect x="988" y="740" width="392" height="52" class="btn-primary" />
  <text x="1080" y="772" class="text-white" font-size="16">Bayar &amp; Cetak Tiket LAN</text>
</svg>`;
}

// 2. WAITER TABLET SVG (800x1280 FRAME)
function generateWaiterTabletFigmaSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1280" width="800" height="1280">
  <defs>
    <style>
      .bg { fill: #F8FAFC; }
      .card { fill: #FFFFFF; stroke: #E2E8F0; stroke-width: 1.5; rx: 16px; }
      .header { fill: #0F2942; }
      .text-title { font-family: Inter, Segoe UI, sans-serif; font-weight: 700; fill: #0F172A; }
      .text-sub { font-family: Inter, Segoe UI, sans-serif; font-weight: 500; fill: #64748B; font-size: 13px; }
      .text-white { font-family: Inter, Segoe UI, sans-serif; font-weight: 600; fill: #FFFFFF; }
      .table-green { fill: #ECFDF5; stroke: #10B981; stroke-width: 2; rx: 16px; }
      .table-red { fill: #FFF1F2; stroke: #F43F5E; stroke-width: 2; rx: 16px; }
      .table-amber { fill: #FFFBEB; stroke: #F59E0B; stroke-width: 2; rx: 16px; }
    </style>
  </defs>

  <rect width="800" height="1280" class="bg" />

  <!-- Frame Label -->
  <rect x="0" y="0" width="800" height="32" fill="#1E293B" />
  <text x="24" y="21" font-family="JetBrains Mono, monospace" font-size="12" fill="#38BDF8" font-weight="bold"># 📱 Frame: Waiter Mobile Tablet [800x1280] • Table Map</text>

  <!-- Header -->
  <rect x="0" y="32" width="800" height="64" class="header" />
  <text x="24" y="72" class="text-white" font-size="18">GastroStock Waiter</text>
  <text x="630" y="72" fill="#94A3B8" font-family="Inter, sans-serif" font-size="13">Budi (Lantai 1)</text>

  <!-- Section 1: Table Map -->
  <rect x="24" y="120" width="752" height="420" class="card" />
  <text x="48" y="155" class="text-title" font-size="18">Peta Meja Tamu (Table Map)</text>
  <text x="48" y="175" class="text-sub">Sentuh meja untuk membuka tagihan atau mencatat pesanan baru</text>

  <!-- Table 1: Empty (Green) -->
  <rect x="48" y="200" width="220" height="130" class="table-green" />
  <text x="120" y="245" class="text-title" font-size="18">Meja 01</text>
  <text x="135" y="270" font-family="Inter, sans-serif" font-size="12" fill="#047857">2 Pax</text>
  <text x="125" y="300" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#065F46">KOSONG</text>

  <!-- Table 2: Occupied (Red) -->
  <rect x="290" y="200" width="220" height="130" class="table-red" />
  <text x="360" y="245" class="text-title" font-size="18" fill="#BE123C">Meja 02</text>
  <text x="375" y="270" font-family="Inter, sans-serif" font-size="12" fill="#BE123C">4 Pax</text>
  <text x="365" y="300" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#9F1239">TERISI</text>

  <!-- Table 3: Billing (Amber) -->
  <rect x="532" y="200" width="220" height="130" class="table-amber" />
  <text x="605" y="245" class="text-title" font-size="18" fill="#B45309">Meja 03</text>
  <text x="620" y="270" font-family="Inter, sans-serif" font-size="12" fill="#B45309">3 Pax</text>
  <text x="605" y="300" font-family="Inter, sans-serif" font-size="11" font-weight="bold" fill="#92400E">BILLING</text>

  <!-- Section 2: Order Taking & Sold Out Alert -->
  <rect x="24" y="560" width="752" height="680" class="card" />
  <text x="48" y="595" class="text-title" font-size="18">Input Pesanan Meja 02</text>
  <text x="48" y="615" class="text-sub">Ketersediaan menu divalidasi langsung terhadap saldo resep</text>

  <!-- Menu Item Row 1 -->
  <rect x="48" y="640" width="704" height="80" fill="#F8FAFC" stroke="#E2E8F0" rx="12" />
  <text x="72" y="675" class="text-title" font-size="16">Ayam Lengkuas (Rp 38.000)</text>
  <text x="72" y="700" class="text-sub">Sisa kuota porsi: 42 porsi (Aman)</text>
  <rect x="620" y="658" width="110" height="44" fill="#0F172A" rx="10" />
  <text x="645" y="685" class="text-white" font-size="13">+ Tambah</text>

  <!-- Menu Item Row 2: Sold out alert -->
  <rect x="48" y="736" width="704" height="80" fill="#FFF1F2" stroke="#FDA4AF" rx="12" />
  <text x="72" y="771" class="text-title" font-size="16" fill="#9F1239">Iga Bakar Madu (Rp 68.000)</text>
  <text x="72" y="796" font-family="Inter, sans-serif" font-size="13" fill="#E11D48">Stok Dapur Defisit • Terkunci Otomatis</text>
  <rect x="620" y="754" width="110" height="44" fill="#FFE4E6" rx="10" />
  <text x="635" y="781" font-family="Inter, sans-serif" font-size="12" font-weight="bold" fill="#BE123C">SOLD OUT</text>
</svg>`;
}

// 3. KITCHEN KDS SVG (1920x1080 FRAME)
function generateKitchenKdsFigmaSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <style>
      .bg-kds { fill: #0B0F19; }
      .ticket { fill: #151C2C; stroke: #2A364F; stroke-width: 1.5; rx: 16px; }
      .timer-green { fill: #064E3B; stroke: #10B981; rx: 8px; }
      .timer-yellow { fill: #78350F; stroke: #F59E0B; rx: 8px; }
      .timer-red { fill: #7F1D1D; stroke: #EF4444; rx: 8px; }
      .text-title { font-family: Inter, Segoe UI, sans-serif; font-weight: 700; fill: #F8FAFC; }
      .text-sub { font-family: Inter, Segoe UI, sans-serif; font-weight: 500; fill: #94A3B8; font-size: 13px; }
      .btn-bump { fill: #0284C7; rx: 10px; }
    </style>
  </defs>

  <rect width="1920" height="1080" class="bg-kds" />

  <!-- Frame Label -->
  <rect x="0" y="0" width="1920" height="32" fill="#000000" />
  <text x="24" y="21" font-family="JetBrains Mono, monospace" font-size="12" fill="#38BDF8" font-weight="bold"># 📺 Frame: Kitchen Display System (KDS 1080p) • FIFO SLA Countdown</text>

  <!-- KDS Top Bar -->
  <rect x="0" y="32" width="1920" height="60" fill="#111827" />
  <text x="32" y="70" class="text-title" font-size="20">KDS HOT KITCHEN — GASTROSTOCK</text>
  <text x="1600" y="70" class="text-sub">SLA Target: 12 Menit • 4 Tiket Aktif</text>

  <!-- Ticket 1: Normal (Green) -->
  <rect x="40" y="120" width="430" height="500" class="ticket" />
  <text x="64" y="165" class="text-title" font-size="22">Meja 04</text>
  <rect x="340" y="140" width="105" height="34" class="timer-green" />
  <text x="355" y="163" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" fill="#34D399">⏱ 04:15</text>
  <text x="64" y="200" class="text-sub">Order ID: #ORD-101 • Waiter: Budi</text>

  <line x1="64" y1="220" x2="445" y2="220" stroke="#334155" stroke-width="1" />
  <text x="64" y="260" class="text-title" font-size="16">2x Sate Ayam Madura</text>
  <text x="64" y="285" font-family="Inter, sans-serif" font-size="12" fill="#FBBF24">Catatan: Bumbu kacang pisah</text>
  <text x="64" y="325" class="text-title" font-size="16">2x Nasi Liwet Solo</text>

  <rect x="64" y="550" width="382" height="48" class="btn-bump" />
  <text x="180" y="580" class="text-title" font-size="14">Mulai Memasak</text>

  <!-- Ticket 2: Warning (Yellow) -->
  <rect x="500" y="120" width="430" height="500" class="ticket" stroke="#B45309" />
  <text x="524" y="165" class="text-title" font-size="22">Meja 07</text>
  <rect x="800" y="140" width="105" height="34" class="timer-yellow" />
  <text x="815" y="163" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" fill="#FBBF24">⏱ 09:42</text>
  <text x="524" y="200" class="text-sub">Order ID: #ORD-102 • Waktu Sedang</text>
  <line x1="524" y1="220" x2="905" y2="220" stroke="#334155" stroke-width="1" />
  <text x="524" y="260" class="text-title" font-size="16">1x Iga Bakar Madu</text>
  <text x="524" y="300" class="text-title" font-size="16">1x Sop Iga Bening</text>

  <rect x="524" y="550" width="382" height="48" fill="#F59E0B" rx="10" />
  <text x="640" y="580" font-family="Inter, sans-serif" font-weight="bold" font-size="14" fill="#78350F">Selesaikan Sajian</text>

  <!-- Ticket 3: Overdue (Red Flash) -->
  <rect x="960" y="120" width="430" height="500" class="ticket" stroke="#E11D48" />
  <text x="984" y="165" class="text-title" font-size="22">Meja 02</text>
  <rect x="1260" y="140" width="105" height="34" class="timer-red" />
  <text x="1275" y="163" font-family="JetBrains Mono, monospace" font-size="14" font-weight="bold" fill="#F87171">⚠️ 13:50</text>
  <text x="984" y="200" class="text-sub">Order ID: #ORD-099 • LEWAT SLA!</text>
  <line x1="984" y1="220" x2="1365" y2="220" stroke="#334155" stroke-width="1" />
  <text x="984" y="260" class="text-title" font-size="16">1x Tahu Telur Surabaya</text>
  <text x="984" y="300" class="text-title" font-size="16">2x Es Cincau Hijau</text>

  <rect x="984" y="550" width="382" height="48" fill="#E11D48" rx="10" />
  <text x="1100" y="580" class="text-title" font-size="14">Panggil Waiter (Siap Saji)</text>
</svg>`;
}

// 4. STORE MANAGER BACKOFFICE SVG
function generateStoreManagerFigmaSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900">
  <defs>
    <style>
      .bg { fill: #F8FAFC; }
      .card { fill: #FFFFFF; stroke: #E2E8F0; stroke-width: 1.5; rx: 16px; }
      .header { fill: #0F2942; }
      .text-title { font-family: Inter, Segoe UI, sans-serif; font-weight: 700; fill: #0F172A; }
      .text-sub { font-family: Inter, Segoe UI, sans-serif; font-weight: 500; fill: #64748B; font-size: 13px; }
      .text-white { font-family: Inter, Segoe UI, sans-serif; font-weight: 600; fill: #FFFFFF; }
    </style>
  </defs>

  <rect width="1440" height="900" class="bg" />
  <rect x="0" y="0" width="1440" height="32" fill="#1E293B" />
  <text x="24" y="21" font-family="JetBrains Mono, monospace" font-size="12" fill="#38BDF8" font-weight="bold"># 💻 Frame: Store Manager Supervisor &amp; Void Auth [1440x900]</text>

  <rect x="0" y="32" width="1440" height="64" class="header" />
  <text x="32" y="72" class="text-white" font-size="20">GastroStock Backoffice • Store Supervisor</text>

  <!-- Modal PIN Otorisasi Wireframe in Center -->
  <rect x="470" y="180" width="500" height="420" class="card" stroke="#7C3AED" stroke-width="2" />
  <rect x="470" y="180" width="500" height="50" fill="#F5F3FF" rx="16" />
  <text x="500" y="212" font-family="Inter, sans-serif" font-weight="bold" font-size="16" fill="#6D28D9">🔒 Otorisasi Supervisor (PIN Void Bill)</text>
  <text x="500" y="260" class="text-sub">Permintaan pembatalan item pesanan oleh Kasir Siti Aminah</text>
  <text x="500" y="285" class="text-title" font-size="14">Item: 1x Ayam Lengkuas • Alasan: Tamu Salah Pilih</text>

  <rect x="500" y="320" width="440" height="60" fill="#F8FAFC" stroke="#CBD5E1" rx="12" />
  <text x="680" y="360" font-family="JetBrains Mono, monospace" font-size="28" font-weight="bold" fill="#0F172A">• • • •</text>

  <rect x="500" y="420" width="210" height="48" fill="#F1F5F9" rx="10" />
  <text x="585" y="450" class="text-title" font-size="14">Batal</text>

  <rect x="730" y="420" width="210" height="48" fill="#7C3AED" rx="10" />
  <text x="790" y="450" class="text-white" font-size="14">Konfirmasi PIN</text>
</svg>`;
}

// 5. OWNER DASHBOARD SVG (390x844 MOBILE FRAME)
function generateOwnerDashboardFigmaSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" width="390" height="844">
  <defs>
    <style>
      .bg { fill: #0B0F19; }
      .card { fill: #151C2C; stroke: #2A364F; stroke-width: 1.5; rx: 16px; }
      .text-white { font-family: Inter, Segoe UI, sans-serif; font-weight: 700; fill: #FFFFFF; }
      .text-muted { font-family: Inter, Segoe UI, sans-serif; font-weight: 500; fill: #94A3B8; font-size: 11px; }
      .text-green { font-family: Inter, Segoe UI, sans-serif; font-weight: 700; fill: #34D399; font-size: 20px; }
    </style>
  </defs>

  <rect width="390" height="844" class="bg" />
  <rect x="0" y="0" width="390" height="28" fill="#000" />
  <text x="16" y="19" font-family="JetBrains Mono, monospace" font-size="10" fill="#38BDF8"># 📱 Frame: Owner Mobile BI [390x844]</text>

  <text x="20" y="65" class="text-white" font-size="18">Executive BI Live</text>
  <text x="20" y="85" class="text-muted">Outlet Utama • Real-Time Stream</text>

  <!-- Gross Omset Card -->
  <rect x="20" y="110" width="350" height="110" class="card" />
  <text x="36" y="140" class="text-muted">Total Omset Hari Ini</text>
  <text x="36" y="175" class="text-green">Rp 14.850.000</text>
  <text x="36" y="200" font-family="Inter, sans-serif" font-size="11" fill="#34D399">↑ +18.4% vs hari kemarin</text>

  <!-- Food Cost % Card -->
  <rect x="20" y="235" width="350" height="110" class="card" />
  <text x="36" y="265" class="text-muted">Food Cost % (HPP Riil)</text>
  <text x="36" y="300" font-family="Inter, sans-serif" font-weight="bold" font-size="20" fill="#38BDF8">28.4%</text>
  <text x="36" y="325" font-family="Inter, sans-serif" font-size="11" fill="#34D399">✓ Di bawah target aman 30%</text>

  <!-- Spoilage Loss Card -->
  <rect x="20" y="360" width="350" height="100" class="card" />
  <text x="36" y="390" class="text-muted">Kerugian Waste Dapur</text>
  <text x="36" y="425" font-family="Inter, sans-serif" font-weight="bold" font-size="18" fill="#F87171">Rp 82.500</text>
</svg>`;
}

// 6. WAREHOUSE & FEFO SVG
function generateWarehouseFigmaSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" width="1440" height="900">
  <defs>
    <style>
      .bg { fill: #F8FAFC; }
      .card { fill: #FFFFFF; stroke: #E2E8F0; stroke-width: 1.5; rx: 16px; }
      .header { fill: #0F2942; }
      .text-title { font-family: Inter, Segoe UI, sans-serif; font-weight: 700; fill: #0F172A; }
      .text-sub { font-family: Inter, Segoe UI, sans-serif; font-weight: 500; fill: #64748B; font-size: 13px; }
      .text-white { font-family: Inter, Segoe UI, sans-serif; font-weight: 600; fill: #FFFFFF; }
    </style>
  </defs>

  <rect width="1440" height="900" class="bg" />
  <rect x="0" y="0" width="1440" height="32" fill="#1E293B" />
  <text x="24" y="21" font-family="JetBrains Mono, monospace" font-size="12" fill="#38BDF8" font-weight="bold"># 📦 Frame: Gudang HACCP &amp; Batch FEFO [1440x900]</text>
  <rect x="0" y="32" width="1440" height="64" class="header" />
  <text x="32" y="72" class="text-white" font-size="20">GastroStock Gudang &amp; Penerimaan PO</text>

  <rect x="32" y="120" width="1376" height="740" class="card" />
  <text x="64" y="165" class="text-title" font-size="18">Penerimaan Barang Supplier (Goods In) &amp; Monitor Chiller 3.2°C</text>
  <text x="64" y="190" class="text-sub">Setiap batch barang masuk dicatat nomor lot dan tanggal kadaluarsa untuk alokasi FEFO</text>
</svg>`;
}

// 7. 16 SERVICE MODES & DEVELOPER ARCHITECTURE 2.0 (1920x1200 FRAME)
export function generateServiceModes2FigmaSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1200" width="1920" height="1200">
  <defs>
    <style>
      .bg-dark { fill: #0B0F19; }
      .card-dark { fill: #111827; stroke: #1F2937; stroke-width: 1.5; rx: 16px; }
      .card-accent { fill: #182234; stroke: #38BDF8; stroke-width: 1.5; rx: 16px; }
      .header-bar { fill: #030712; }
      .text-heading { font-family: Inter, Segoe UI, sans-serif; font-weight: 800; fill: #FFFFFF; }
      .text-subheading { font-family: Inter, Segoe UI, sans-serif; font-weight: 500; fill: #94A3B8; font-size: 13px; }
      .text-cyan { font-family: Inter, Segoe UI, sans-serif; font-weight: 700; fill: #38BDF8; }
      .text-body { font-family: Inter, Segoe UI, sans-serif; font-weight: 500; fill: #CBD5E1; font-size: 12px; }
      .text-muted { font-family: Inter, Segoe UI, sans-serif; font-weight: 400; fill: #64748B; font-size: 11px; }
      .badge-bg { rx: 6px; }
      .mono { font-family: JetBrains Mono, Consolas, monospace; font-size: 11px; font-weight: 600; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1200" class="bg-dark" />

  <!-- Top Hero Header Bar (RestoSync 2.0 Branding) -->
  <rect x="0" y="0" width="1920" height="110" class="header-bar" />
  <rect x="40" y="24" width="140" height="32" fill="#0284C7" class="badge-bg" />
  <text x="50" y="46" font-family="Inter, sans-serif" font-weight="900" font-size="13" fill="#FFFFFF">RESTOSYNC 2.0</text>
  <rect x="190" y="24" width="190" height="32" fill="#1E293B" stroke="#0284C7" stroke-width="1" class="badge-bg" />
  <text x="202" y="46" class="mono" fill="#38BDF8">VERSION 2.0 ENTERPRISE</text>
  <rect x="390" y="24" width="220" height="32" fill="#065F46" class="badge-bg" />
  <text x="402" y="46" class="mono" fill="#34D399">✓ 16 SERVICE MODES STACK</text>
  <rect x="620" y="24" width="180" height="32" fill="#312E81" class="badge-bg" />
  <text x="632" y="46" class="mono" fill="#A5B4FC">⚡ 6 NETWORK PROTOCOLS</text>

  <text x="40" y="90" class="text-heading" font-size="24">Arsitektur 16 Model Layanan Restoran &amp; Integrasi Hardware Sistem 2.0</text>
  <text x="820" y="90" class="text-subheading">Figma Vector Blueprint • Low Latency WSS &amp; MQTT • Multi-Tenant &amp; ACID Concurrency Locking</text>

  <!-- 5 CATEGORY GRID COLUMNS (X: 40, 410, 780, 1150, 1520 - Width: 350) -->

  <!-- CATEGORY 1: TABLE SERVICE -->
  <g id="Cat1_Table_Service" transform="translate(40, 130)">
    <rect width="350" height="690" class="card-dark" />
    <rect x="16" y="16" width="318" height="40" fill="#0284C7" rx="8" />
    <text x="28" y="42" font-family="Inter, sans-serif" font-weight="800" font-size="15" fill="#FFFFFF">1. TABLE SERVICE</text>
    <text x="250" y="42" class="mono" fill="#BAE6FD">4 Model</text>

    <!-- Item 1.1: American Service -->
    <rect x="16" y="68" width="318" height="140" fill="#1E293B" rx="10" />
    <text x="28" y="92" class="text-cyan" font-size="13">1.1 American (Plated) Service</text>
    <text x="28" y="112" class="text-body">Makanan di-plate lengkap di dapur, diantar ke meja.</text>
    <text x="28" y="130" class="text-muted">Hardware: Tablet Waiter 10", KDS Dapur, ESC/POS Slip.</text>
    <rect x="28" y="142" width="80" height="20" fill="#0C4A6E" rx="4" />
    <text x="34" y="156" class="mono" fill="#38BDF8">WSS Tiket</text>
    <rect x="114" y="142" width="90" height="20" fill="#065F46" rx="4" />
    <text x="120" y="156" class="mono" fill="#34D399">BOM Deduct</text>
    <rect x="210" y="142" width="100" height="20" fill="#4C1D95" rx="4" />
    <text x="216" y="156" class="mono" fill="#DDD6FE">Split Bill EDC</text>

    <!-- Item 1.2: French Service -->
    <rect x="16" y="218" width="318" height="140" fill="#1E293B" rx="10" />
    <text x="28" y="242" class="text-cyan" font-size="13">1.2 French (Gueridon) Service</text>
    <text x="28" y="262" class="text-body">Dimasak/flambé di samping meja di atas gueridon cart.</text>
    <text x="28" y="280" class="text-muted">Hardware: Mobile POS Bluetooth, Step Timer Gueridon.</text>
    <rect x="28" y="292" width="100" height="20" fill="#78350F" rx="4" />
    <text x="34" y="306" class="mono" fill="#FDE68A">Stage Tracking</text>
    <rect x="134" y="292" width="110" height="20" fill="#065F46" rx="4" />
    <text x="140" y="306" class="mono" fill="#34D399">Raw Stock Lock</text>

    <!-- Item 1.3: Russian / Silver Service -->
    <rect x="16" y="368" width="318" height="140" fill="#1E293B" rx="10" />
    <text x="28" y="392" class="text-cyan" font-size="13">1.3 Russian (Silver) Service</text>
    <text x="28" y="412" class="text-body">Nampan besar perak dibawa pelayan, diporsikan di meja.</text>
    <text x="28" y="430" class="text-muted">Hardware: Kitchen Platter KDS, Batch Portions Counter.</text>
    <rect x="28" y="442" width="110" height="20" fill="#0C4A6E" rx="4" />
    <text x="34" y="456" class="mono" fill="#38BDF8">Batch Portions</text>
    <rect x="144" y="442" width="120" height="20" fill="#1F2937" rx="4" />
    <text x="150" y="456" class="mono" fill="#CBD5E1">Gram Scale IoT</text>

    <!-- Item 1.4: English Service -->
    <rect x="16" y="518" width="318" height="155" fill="#1E293B" rx="10" />
    <text x="28" y="542" class="text-cyan" font-size="13">1.4 English (Family Style)</text>
    <text x="28" y="562" class="text-body">Porsi besar disajikan di tengah meja untuk dinikmati bersama.</text>
    <text x="28" y="580" class="text-muted">Hardware: Table Master Order, QR Re-order, Central POS.</text>
    <rect x="28" y="595" width="130" height="20" fill="#065F46" rx="4" />
    <text x="34" y="609" class="mono" fill="#34D399">Family BOM Alloc</text>
    <rect x="164" y="595" width="110" height="20" fill="#701A75" rx="4" />
    <text x="170" y="609" class="mono" fill="#F5D0FE">Multi-User Seat</text>
  </g>

  <!-- CATEGORY 2: COUNTER & SELF-SERVICE -->
  <g id="Cat2_Counter_Service" transform="translate(410, 130)">
    <rect width="350" height="690" class="card-dark" />
    <rect x="16" y="16" width="318" height="40" fill="#D97706" rx="8" />
    <text x="28" y="42" font-family="Inter, sans-serif" font-weight="800" font-size="15" fill="#FFFFFF">2. COUNTER &amp; SELF-SERVICE</text>
    <text x="250" y="42" class="mono" fill="#FEF3C7">3 Model</text>

    <!-- Item 2.1: Counter Service -->
    <rect x="16" y="68" width="318" height="190" fill="#1E293B" rx="10" />
    <text x="28" y="92" class="text-cyan" font-size="13">2.1 Counter Service (Fast-Casual)</text>
    <text x="28" y="112" class="text-body">Pesan &amp; bayar langsung di kasir depan, ambil di konter.</text>
    <text x="28" y="130" class="text-muted">Hardware: Dual-Screen POS 15", Pager Buzzer Transmitter, QRIS EDC.</text>
    <text x="28" y="152" class="mono" fill="#F59E0B">SLA Kasir: &lt; 45 detik / transaksi</text>
    <rect x="28" y="165" width="110" height="20" fill="#78350F" rx="4" />
    <text x="34" y="179" class="mono" fill="#FDE68A">Buzzer RF 433MHz</text>
    <rect x="144" y="165" width="100" height="20" fill="#0C4A6E" rx="4" />
    <text x="150" y="179" class="mono" fill="#38BDF8">Fast Checkout</text>

    <!-- Item 2.2: Cafeteria / Line Service -->
    <rect x="16" y="270" width="318" height="190" fill="#1E293B" rx="10" />
    <text x="28" y="294" class="text-cyan" font-size="13">2.2 Cafeteria / Line Service</text>
    <text x="28" y="314" class="text-body">Tamu bawa nampan menyusuri line kaca, bayar di kasir ujung.</text>
    <text x="28" y="330" class="text-muted">Hardware: Barcode/RFID Tray Scanner, Final Weight Scale, POS Terminal.</text>
    <text x="28" y="352" class="mono" fill="#F59E0B">Integrasi: RFID Tray &amp; Auto-Item Scan</text>
    <rect x="28" y="365" width="100" height="20" fill="#065F46" rx="4" />
    <text x="34" y="379" class="mono" fill="#34D399">Auto Tray Scan</text>
    <rect x="134" y="365" width="100" height="20" fill="#0C4A6E" rx="4" />
    <text x="140" y="379" class="mono" fill="#38BDF8">Line End POS</text>

    <!-- Item 2.3: Buffet / Prasmanan -->
    <rect x="16" y="472" width="318" height="200" fill="#1E293B" rx="10" />
    <text x="28" y="496" class="text-cyan" font-size="13">2.3 Buffet (AYCE / Per Piring)</text>
    <text x="28" y="516" class="text-body">Skema All You Can Eat atau pay-per-plate prasmanan.</text>
    <text x="28" y="530" class="text-muted">Hardware: Wristband RFID Reader, Table AYCE Timer Screen, Waste Scale.</text>
    <text x="28" y="552" class="mono" fill="#F59E0B">Pencegahan Defisit: Denda Sisa Makanan</text>
    <rect x="28" y="565" width="120" height="20" fill="#991B1B" rx="4" />
    <text x="34" y="579" class="mono" fill="#FECACA">Leftover Penalty</text>
    <rect x="154" y="565" width="110" height="20" fill="#312E81" rx="4" />
    <text x="160" y="579" class="mono" fill="#C7D2FE">Timer 90 Mins</text>
  </g>

  <!-- CATEGORY 3: TECHNOLOGY & AUTOMATION -->
  <g id="Cat3_Automation_Service" transform="translate(780, 130)">
    <rect width="350" height="690" class="card-accent" />
    <rect x="16" y="16" width="318" height="40" fill="#7C3AED" rx="8" />
    <text x="28" y="42" font-family="Inter, sans-serif" font-weight="800" font-size="15" fill="#FFFFFF">3. TECH &amp; AUTOMATION (2.0)</text>
    <text x="250" y="42" class="mono" fill="#DDD6FE">4 Model</text>

    <!-- Item 3.1: QR-Code & Kiosk -->
    <rect x="16" y="68" width="318" height="140" fill="#1E293B" rx="10" />
    <text x="28" y="92" class="text-cyan" font-size="13">3.1 QR-Code &amp; Self-Kiosk</text>
    <text x="28" y="112" class="text-body">Pesan mandiri via HP pelanggan atau Kiosk 27" sentuh.</text>
    <text x="28" y="130" class="text-muted">Hardware: Kiosk Touchscreen, Thermal Slip, Dynamic QRIS.</text>
    <rect x="28" y="142" width="110" height="20" fill="#0C4A6E" rx="4" />
    <text x="34" y="156" class="mono" fill="#38BDF8">Direct KDS WSS</text>
    <rect x="144" y="142" width="120" height="20" fill="#065F46" rx="4" />
    <text x="150" y="156" class="mono" fill="#34D399">Auto Stock Lock</text>

    <!-- Item 3.2: Conveyor Belt (Kaiten) -->
    <rect x="16" y="218" width="318" height="140" fill="#1E293B" rx="10" />
    <text x="28" y="242" class="text-cyan" font-size="13">3.2 Conveyor Belt (Kaiten Sushi)</text>
    <text x="28" y="262" class="text-body">Piring berjalan mengitari meja pelanggan secara kontinu.</text>
    <text x="28" y="280" class="text-muted">Hardware: RFID Under-Plate, Modbus Conveyor PLC, Table Scanner.</text>
    <rect x="28" y="292" width="120" height="20" fill="#581C87" rx="4" />
    <text x="34" y="306" class="mono" fill="#E9D5FF">Modbus TCP PLC</text>
    <rect x="154" y="292" width="110" height="20" fill="#0C4A6E" rx="4" />
    <text x="160" y="306" class="mono" fill="#38BDF8">RFID 13.56MHz</text>

    <!-- Item 3.3: Automated / Shinkansen Express -->
    <rect x="16" y="368" width="318" height="140" fill="#1E293B" rx="10" />
    <text x="28" y="392" class="text-cyan" font-size="13">3.3 Express Delivery (Robot/Train)</text>
    <text x="28" y="412" class="text-body">Miniatur shinkansen tray atau robot antar langsung ke meja.</text>
    <text x="28" y="430" class="text-muted">Hardware: Shinkansen Rail Controller, AGV Robot ROS, Table Sensor.</text>
    <rect x="28" y="442" width="110" height="20" fill="#701A75" rx="4" />
    <text x="34" y="456" class="mono" fill="#F5D0FE">MQTT Dispatch</text>
    <rect x="144" y="442" width="110" height="20" fill="#065F46" rx="4" />
    <text x="150" y="456" class="mono" fill="#34D399">Table Arrived CB</text>

    <!-- Item 3.4: Automat / Vending -->
    <rect x="16" y="518" width="318" height="155" fill="#1E293B" rx="10" />
    <text x="28" y="542" class="text-cyan" font-size="13">3.4 Automat &amp; Smart Vending</text>
    <text x="28" y="562" class="text-body">Transaksi 100% tanpa kasir, locker makanan otomatis terbuka.</text>
    <text x="28" y="580" class="text-muted">Hardware: MDB/ccTalk Controller, Solenoid Locker, IoT Telemetry.</text>
    <rect x="28" y="595" width="120" height="20" fill="#581C87" rx="4" />
    <text x="34" y="609" class="mono" fill="#E9D5FF">MDB / ccTalk</text>
    <rect x="154" y="595" width="110" height="20" fill="#0C4A6E" rx="4" />
    <text x="160" y="609" class="mono" fill="#38BDF8">Instant Pickup</text>
  </g>

  <!-- CATEGORY 4: VEHICLE & DRIVE SERVICE -->
  <g id="Cat4_Drive_Service" transform="translate(1150, 130)">
    <rect width="350" height="690" class="card-dark" />
    <rect x="16" y="16" width="318" height="40" fill="#059669" rx="8" />
    <text x="28" y="42" font-family="Inter, sans-serif" font-weight="800" font-size="15" fill="#FFFFFF">4. DRIVE &amp; VEHICLE SERVICE</text>
    <text x="250" y="42" class="mono" fill="#D1FAE5">2 Model</text>

    <!-- Item 4.1: Drive-Thru -->
    <rect x="16" y="68" width="318" height="280" fill="#1E293B" rx="10" />
    <text x="28" y="92" class="text-cyan" font-size="13">4.1 Drive-Thru Dual-Window</text>
    <text x="28" y="112" class="text-body">Pesan via Intercom speaker, bayar di Jendela 1, ambil Jendela 2.</text>
    <text x="28" y="130" class="text-muted">Hardware: Induction Loop Sensor, SIP Intercom VOIP, Digital Menu Board.</text>
    <text x="28" y="152" class="mono" fill="#34D399">Target Speed of Service (SOS): &lt; 180 detik</text>
    <rect x="28" y="170" width="130" height="22" fill="#064E3B" rx="4" />
    <text x="34" y="186" class="mono" fill="#A7F3D0">SIP / RTP Intercom</text>
    <rect x="164" y="170" width="120" height="22" fill="#0C4A6E" rx="4" />
    <text x="170" y="186" class="mono" fill="#38BDF8">Loop Vehicle Det</text>
    <rect x="28" y="200" width="130" height="22" fill="#78350F" rx="4" />
    <text x="34" y="216" class="mono" fill="#FDE68A">Window 1 Pay POS</text>
    <rect x="164" y="200" width="120" height="22" fill="#4C1D95" rx="4" />
    <text x="170" y="216" class="mono" fill="#DDD6FE">Window 2 Bump</text>
    <text x="28" y="246" class="text-muted">Sinkronisasi: Antrean mobil otomatis sinkron antar 2 jendela kasir.</text>

    <!-- Item 4.2: Drive-In / Carhop -->
    <rect x="16" y="360" width="318" height="310" fill="#1E293B" rx="10" />
    <text x="28" y="384" class="text-cyan" font-size="13">4.2 Drive-In / Carhop Service</text>
    <text x="28" y="404" class="text-body">Mobil parkir di stall bernomor, pesan via kiosk stall/app, makan di mobil.</text>
    <text x="28" y="422" class="text-muted">Hardware: Stall Terminal, Car Window Tray Clip, Waiter Mobile Runner POS.</text>
    <text x="28" y="444" class="mono" fill="#34D399">Alokasi Slot: Bay Slot Parking 01 - 24</text>
    <rect x="28" y="462" width="130" height="22" fill="#064E3B" rx="4" />
    <text x="34" y="478" class="mono" fill="#A7F3D0">Bay Sensor Parking</text>
    <rect x="164" y="462" width="120" height="22" fill="#0C4A6E" rx="4" />
    <text x="170" y="478" class="mono" fill="#38BDF8">Carhop Tray Run</text>
    <text x="28" y="515" class="text-body">Validasi Pembayaran: Mobile EDC contactless di jendela mobil.</text>
    <text x="28" y="535" class="text-muted">Anti-Fraud: Order tidak bisa dicancel setelah status Masak di KDS.</text>
  </g>

  <!-- CATEGORY 5: SPECIAL CONCEPTS -->
  <g id="Cat5_Special_Service" transform="translate(1520, 130)">
    <rect width="360" height="690" class="card-dark" />
    <rect x="16" y="16" width="328" height="40" fill="#E11D48" rx="8" />
    <text x="28" y="42" font-family="Inter, sans-serif" font-weight="800" font-size="15" fill="#FFFFFF">5. KONSEP KHUSUS (2.0)</text>
    <text x="260" y="42" class="mono" fill="#FFE4E6">3 Model</text>

    <!-- Item 5.1: Omakase -->
    <rect x="16" y="68" width="328" height="190" fill="#1E293B" rx="10" />
    <text x="28" y="92" class="text-cyan" font-size="13">5.1 Omakase / Chef’s Table</text>
    <text x="28" y="112" class="text-body">Menu dinamis disesuaikan koki langsung di depan tamu.</text>
    <text x="28" y="130" class="text-muted">Hardware: Chef Direct POS Tablet, Allergen Profiler, Course Pacer.</text>
    <rect x="28" y="145" width="130" height="20" fill="#881337" rx="4" />
    <text x="34" y="159" class="mono" fill="#FECDD3">Dynamic Course Lock</text>
    <rect x="164" y="145" width="120" height="20" fill="#065F46" rx="4" />
    <text x="170" y="159" class="mono" fill="#34D399">Guest Allergy DB</text>

    <!-- Item 5.2: Food Court -->
    <rect x="16" y="270" width="328" height="190" fill="#1E293B" rx="10" />
    <text x="28" y="294" class="text-cyan" font-size="13">5.2 Food Court Multi-Tenant</text>
    <text x="28" y="314" class="text-body">Pesan berbagai tenant berbeda, bayar di kasir pusat (Central POS).</text>
    <text x="28" y="330" class="text-muted">Hardware: Central Cashier Hub, Tenant KDS Splitter, Universal Pager.</text>
    <rect x="28" y="345" width="140" height="20" fill="#4C1D95" rx="4" />
    <text x="34" y="359" class="mono" fill="#DDD6FE">Tenant Revenue Share</text>
    <rect x="174" y="345" width="120" height="20" fill="#0C4A6E" rx="4" />
    <text x="180" y="359" class="mono" fill="#38BDF8">Multi-KDS Router</text>

    <!-- Item 5.3: Ghost Kitchen -->
    <rect x="16" y="472" width="328" height="200" fill="#1E293B" rx="10" />
    <text x="28" y="496" class="text-cyan" font-size="13">5.3 Ghost / Cloud Kitchen (Delivery)</text>
    <text x="28" y="516" class="text-body">100% delivery-only. Integrasi GoFood, GrabFood &amp; ShopeeFood.</text>
    <text x="28" y="530" class="text-muted">Hardware: Delivery Webhook Aggregator, Label Bag Printer, Driver Handover TV.</text>
    <rect x="28" y="550" width="140" height="20" fill="#0C4A6E" rx="4" />
    <text x="34" y="564" class="mono" fill="#38BDF8">Aggregator Webhooks</text>
    <rect x="174" y="550" width="120" height="20" fill="#065F46" rx="4" />
    <text x="180" y="550" class="mono" fill="#34D399">Auto Accept Rule</text>
  </g>

  <!-- BOTTOM PANEL: 6 PROTOCOL STACKS & ACID CONCURRENCY LOCKING -->
  <g id="Protocol_Stack_Architecture" transform="translate(40, 840)">
    <rect width="1840" height="330" fill="#0A0E1A" stroke="#1E293B" stroke-width="1.5" rx="16" />
    
    <!-- Left Column: 6 Protocol Stack -->
    <text x="30" y="40" class="text-heading" font-size="18">⚡ 6 Protokol Jaringan RestoSync 2.0 untuk Developer</text>
    <text x="30" y="65" class="text-subheading">Konektivitas heterogen multi-perangkat dari sensor fisik pabrikan hingga cloud ERP.</text>

    <!-- Protocol 1: WSS -->
    <g transform="translate(30, 90)">
      <rect width="270" height="100" fill="#111827" stroke="#0284C7" stroke-width="1" rx="8" />
      <text x="16" y="30" class="text-cyan" font-size="14">1. WebSocket (WSS &lt;15ms)</text>
      <text x="16" y="52" class="text-body">Sync real-time Kasir ke KDS &amp; Tablet Waiter.</text>
      <text x="16" y="75" class="mono" fill="#64748B">Event: order:placed, order:bump</text>
    </g>

    <!-- Protocol 2: MQTT -->
    <g transform="translate(320, 90)">
      <rect width="270" height="100" fill="#111827" stroke="#7C3AED" stroke-width="1" rx="8" />
      <text x="16" y="30" class="text-cyan" font-size="14">2. MQTT Broker (IoT)</text>
      <text x="16" y="52" class="text-body">Telemetry sensor chiller &amp; buzzer paging.</text>
      <text x="16" y="75" class="mono" fill="#64748B">Topic: resto/iot/chiller/temp</text>
    </g>

    <!-- Protocol 3: Modbus TCP -->
    <g transform="translate(610, 90)">
      <rect width="270" height="100" fill="#111827" stroke="#059669" stroke-width="1" rx="8" />
      <text x="16" y="30" class="text-cyan" font-size="14">3. Modbus TCP / PLC</text>
      <text x="16" y="52" class="text-body">Kontrol relay konveyor kaiten &amp; shinkansen tray.</text>
      <text x="16" y="75" class="mono" fill="#64748B">Coil 0x01: StartBelt, 0x02: Stop</text>
    </g>

    <!-- Protocol 4: ESC/POS -->
    <g transform="translate(900, 90)">
      <rect width="270" height="100" fill="#111827" stroke="#D97706" stroke-width="1" rx="8" />
      <text x="16" y="30" class="text-cyan" font-size="14">4. ESC/POS Raw Network</text>
      <text x="16" y="52" class="text-body">Printer thermal dapur 80mm &amp; checker bill.</text>
      <text x="16" y="75" class="mono" fill="#64748B">TCP Port 9100 Direct Socket</text>
    </g>

    <!-- Protocol 5: SIP / RTP -->
    <g transform="translate(1190, 90)">
      <rect width="270" height="100" fill="#111827" stroke="#E11D48" stroke-width="1" rx="8" />
      <text x="16" y="30" class="text-cyan" font-size="14">5. SIP / RTP (VOIP Intercom)</text>
      <text x="16" y="52" class="text-body">Audio interkom Drive-Thru kristal jernih.</text>
      <text x="16" y="75" class="mono" fill="#64748B">SIP Server UDP 5060, Codec G.711u</text>
    </g>

    <!-- Protocol 6: REST & Webhooks -->
    <g transform="translate(1480, 90)">
      <rect width="270" height="100" fill="#111827" stroke="#38BDF8" stroke-width="1" rx="8" />
      <text x="16" y="30" class="text-cyan" font-size="14">6. REST &amp; Webhooks</text>
      <text x="16" y="52" class="text-body">Integrasi GoFood, GrabFood &amp; ERP Akuntansi.</text>
      <text x="16" y="75" class="mono" fill="#64748B">HTTPS JSON, HMAC SHA-256 Auth</text>
    </g>

    <!-- Concurrency Architecture Strip -->
    <g transform="translate(30, 210)">
      <rect width="1780" height="95" fill="#182234" stroke="#0284C7" stroke-width="1.5" rx="10" />
      <text x="24" y="32" class="text-heading" font-size="15">🔒 ACID Row-Level Locking Architecture (Anti-Overselling RestoSync 2.0)</text>
      <text x="24" y="56" class="text-body">PostgreSQL Transaction: BEGIN; SELECT stock FROM inventory_lots WHERE item_id = :id FOR UPDATE; -- Validasi BOM Resep. Jika stok &lt; kebutuhan resep: ROLLBACK 409 Conflict. Jika cukup: UPDATE lots; COMMIT; [Latensi &lt;12ms].</text>
      <text x="24" y="80" class="mono" fill="#38BDF8">Garansi 100% Konsistensi Stok Real-Time: Kasir POS, Tablet Waiter, Kiosk Mandiri &amp; Online Aggregator tidak akan pernah menjual barang habis.</text>
    </g>
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// MASTER MULTI-FRAME FIGMA CANVAS (ALL ROLES & 2.0 ARCHITECTURE COMBINED)
// -----------------------------------------------------------------------------
export function generateAllRolesOverviewFigmaSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4600 2400" width="4600" height="2400">
  <defs>
    <style>
      .canvas-bg { fill: #1E1E1E; }
      .grid-dot { fill: #333333; }
      .frame-border { fill: none; stroke: #38BDF8; stroke-width: 2; stroke-dasharray: 6 6; }
      .flow-line { fill: none; stroke: #F59E0B; stroke-width: 4; stroke-dasharray: 8 8; }
      .flow-text { font-family: Inter, Segoe UI, sans-serif; font-weight: 700; fill: #FBBF24; font-size: 14px; }
      .master-title { font-family: Inter, Segoe UI, sans-serif; font-weight: 800; fill: #FFFFFF; font-size: 36px; }
      .master-sub { font-family: Inter, Segoe UI, sans-serif; font-weight: 500; fill: #94A3B8; font-size: 18px; }
    </style>
  </defs>

  <!-- Figma Dark Canvas Workspace -->
  <rect width="4600" height="2400" class="canvas-bg" />

  <!-- Top Figma Studio Canvas Banner -->
  <rect x="0" y="0" width="4600" height="100" fill="#18181B" />
  <circle cx="60" cy="50" r="22" fill="#0284C7" />
  <text x="50" y="58" font-family="Inter, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF">F</text>
  <text x="100" y="48" class="master-title">RestoSync 2.0 &amp; GastroStock • Multi-Role &amp; 16 Service Modes Ecosystem</text>
  <text x="100" y="78" class="master-sub">Figma Architecture Canvas 2.0 [Kasir, Waiter, Kitchen KDS, Supervisor Manager, Owner BI, Gudang FEFO + 16 Service Models]</text>
  <rect x="3900" y="32" width="220" height="40" fill="#0284C7" rx="20" />
  <text x="3925" y="57" font-family="Inter, sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF">★ RESTOSYNC 2.0 NEW</text>
  <rect x="4150" y="32" width="390" height="40" fill="#059669" rx="20" />
  <text x="4175" y="57" font-family="Inter, sans-serif" font-weight="bold" font-size="14" fill="#FFFFFF">✓ Auto-Layout 8px • Tokens Studio 2.0</text>

  <!-- ROW 1: FRONT OF HOUSE & KITCHEN OPERATIONS -->

  <!-- 1. KASIR POS FRAME -->
  <g id="Frame_Kasir_POS" transform="translate(80, 160)">
    <rect x="-10" y="-35" width="1460" height="955" class="frame-border" />
    <rect x="-10" y="-35" width="320" height="28" fill="#0284C7" rx="4" />
    <text x="5" y="-16" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" fill="#FFFFFF"># 1. Kasir POS Touchscreen [1440x900]</text>
    ${generateKasirPosFigmaSvg().replace(/<\/?svg[^>]*>/g, '')}
  </g>

  <!-- Connector Line 1: Kasir to Waiter -->
  <path d="M 1540 600 L 1680 600" class="flow-line" />
  <rect x="1550" y="580" width="120" height="26" fill="#18181B" rx="6" />
  <text x="1560" y="598" class="flow-text">Real-time LAN</text>

  <!-- 2. WAITER TABLET FRAME -->
  <g id="Frame_Waiter_Tablet" transform="translate(1720, 160)">
    <rect x="-10" y="-35" width="820" height="1335" class="frame-border" />
    <rect x="-10" y="-35" width="300" height="28" fill="#10B981" rx="4" />
    <text x="5" y="-16" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" fill="#FFFFFF"># 2. Waiter Tablet [800x1280]</text>
    ${generateWaiterTabletFigmaSvg().replace(/<\/?svg[^>]*>/g, '')}
  </g>

  <!-- Connector Line 2: Waiter to KDS -->
  <path d="M 2540 600 L 2680 600" class="flow-line" />
  <rect x="2550" y="580" width="120" height="26" fill="#18181B" rx="6" />
  <text x="2560" y="598" class="flow-text">WebSocket Tiket</text>

  <!-- 3. KITCHEN KDS FRAME -->
  <g id="Frame_Kitchen_KDS" transform="translate(2680, 160)">
    <rect x="-10" y="-35" width="1800" height="1135" class="frame-border" />
    <rect x="-10" y="-35" width="320" height="28" fill="#EF4444" rx="4" />
    <text x="5" y="-16" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" fill="#FFFFFF"># 3. Kitchen KDS TV [1920x1080]</text>
    ${generateKitchenKdsFigmaSvg().replace(/<\/?svg[^>]*>/g, '')}
  </g>

  <!-- ROW 2: MANAGEMENT, EXECUTIVE BI & GUDANG LOGISTICS -->

  <!-- 4. STORE MANAGER FRAME -->
  <g id="Frame_Store_Manager" transform="translate(80, 1300)">
    <rect x="-10" y="-35" width="1460" height="955" class="frame-border" />
    <rect x="-10" y="-35" width="320" height="28" fill="#7C3AED" rx="4" />
    <text x="5" y="-16" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" fill="#FFFFFF"># 4. Supervisor PIN &amp; Void [1440x900]</text>
    ${generateStoreManagerFigmaSvg().replace(/<\/?svg[^>]*>/g, '')}
  </g>

  <!-- 5. OWNER DASHBOARD FRAME -->
  <g id="Frame_Owner_Mobile" transform="translate(1720, 1530)">
    <rect x="-10" y="-35" width="410" height="895" class="frame-border" />
    <rect x="-10" y="-35" width="280" height="28" fill="#D97706" rx="4" />
    <text x="5" y="-16" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" fill="#FFFFFF"># 5. Owner Mobile BI [390x844]</text>
    ${generateOwnerDashboardFigmaSvg().replace(/<\/?svg[^>]*>/g, '')}
  </g>

  <!-- 6. GUDANG & CHILLER HACCP FRAME -->
  <g id="Frame_Gudang_FEFO" transform="translate(2300, 1340)">
    <rect x="-10" y="-35" width="1460" height="955" class="frame-border" />
    <rect x="-10" y="-35" width="320" height="28" fill="#0369A1" rx="4" />
    <text x="5" y="-16" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold" fill="#FFFFFF"># 6. Gudang FEFO &amp; Chiller [1440x900]</text>
    ${generateWarehouseFigmaSvg().replace(/<\/?svg[^>]*>/g, '')}
  </g>
</svg>`;
}

// -----------------------------------------------------------------------------
// HELPER ACTIONS: COPY TO CLIPBOARD & DOWNLOAD
// -----------------------------------------------------------------------------
export async function copyFigmaSvgToClipboard(role: FigmaRoleKey | 'all'): Promise<boolean> {
  try {
    const svgContent = role === 'all' ? generateAllRolesOverviewFigmaSvg() : generateFigmaSvgForRole(role);
    await navigator.clipboard.writeText(svgContent);
    return true;
  } catch (err) {
    console.error('Failed to copy SVG to clipboard:', err);
    return false;
  }
}

export function downloadFigmaSvgFile(role: FigmaRoleKey | 'all'): void {
  const svgContent = role === 'all' ? generateAllRolesOverviewFigmaSvg() : generateFigmaSvgForRole(role);
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  if (role === 'all') {
    a.download = `RestoSync2_Figma_Master_All_Roles_Canvas.svg`;
  } else if (role === 'servicemodes') {
    a.download = `RestoSync2_Figma_16_Service_Modes_Architecture.svg`;
  } else {
    a.download = `RestoSync2_Figma_Wireframe_${role.toUpperCase()}.svg`;
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAllRolesFigmaSvgFile(): void {
  downloadFigmaSvgFile('all');
}

export function downloadFigmaTokensJsonFile(): void {
  const jsonContent = JSON.stringify(GASTROSTOCK_DESIGN_TOKENS, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `RestoSync2_Figma_Design_Tokens_v2.0.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


