export interface SwimlaneNodeData {
  id: string;
  laneId: string;
  title: string;
  subtitle?: string;
  type: 'terminator' | 'process' | 'document' | 'database' | 'decision';
  x: number;
  y: number; // offset within the lane
  width: number;
  height: number;
  actor: string;
  description: string;
  technicalDetails: {
    apiEndpoint?: string;
    sqlOperation?: string;
    protocol?: string;
    edgeCase?: string;
    samplePayload?: Record<string, any>;
  };
}

export interface SwimlaneConnectorData {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
  fromPort?: 'bottom' | 'right' | 'top' | 'left';
  toPort?: 'top' | 'left' | 'bottom' | 'right';
  isDashed?: boolean;
}

export interface SwimlaneLaneData {
  id: string;
  name: string;
  subname: string;
  height: number;
  color: string;
}

export interface SwimlaneScenarioPackage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  lanes: SwimlaneLaneData[];
  nodes: SwimlaneNodeData[];
  connectors: SwimlaneConnectorData[];
}

// =============================================================================
// STANDARD 4 RESTAURANT INTERFACE LANES (ANTAR SISTEM)
// =============================================================================
const COMMON_RESTO_SYSTEM_LANES: SwimlaneLaneData[] = [
  {
    id: 'sys-pos',
    name: 'Interface Kasir (Sistem POS)',
    subname: 'Pemesanan, Validasi Menu, Struk & QR Meja',
    height: 145,
    color: 'text-amber-400 border-amber-500/40'
  },
  {
    id: 'sys-kds',
    name: 'Interface Dapur (Sistem KDS)',
    subname: 'Monitor Koki, Barista, SLA & Antrean Saji',
    height: 145,
    color: 'text-rose-400 border-rose-500/40'
  },
  {
    id: 'sys-wh',
    name: 'Interface Stok & Gudang',
    subname: 'Saldo Bahan Riil, Resep BOM & Penerimaan PO',
    height: 155,
    color: 'text-emerald-400 border-emerald-500/40'
  },
  {
    id: 'sys-dash',
    name: 'Dashboard Monitoring',
    subname: 'Layar Owner, HPP Realtime, Alert ROP & Ledger',
    height: 145,
    color: 'text-blue-400 border-blue-500/40'
  }
];

export const SWIMLANE_SCENARIOS: SwimlaneScenarioPackage[] = [
  // =========================================================================
  // SCENARIO 1: PESANAN NORMAL (STOK CUKUP) ANTAR SISTEM
  // =========================================================================
  {
    id: 'scenario_order_bom',
    title: 'Skenario 1: Alur Pemesanan Normal (Happy Path Checkout Antar Sistem)',
    subtitle: 'Sinkronisasi instan dari Kasir POS → Pemotongan Stok Gudang → Tiket Dapur KDS → Update Dashboard',
    badge: 'Alur Normal (Antar Sistem)',
    description: 'Menunjukkan alur kolaborasi antar 4 sistem ketika stok cukup: Kasir menginput pesanan, Sistem Gudang memotong stok bahan baku berdasarkan resep BOM secara FIFO, Sistem Dapur menerima tiket pesanan dan membunyikan lonceng, lalu Dashboard Manajemen mengupdate omset serta HPP secara real-time.',
    lanes: COMMON_RESTO_SYSTEM_LANES,
    nodes: [
      // Lane 1: Interface Kasir
      {
        id: 's1-start',
        laneId: 'sys-pos',
        title: 'Start',
        subtitle: 'Tamu Pesan Menu',
        type: 'terminator',
        x: 140,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Pelanggan & Kasir',
        description: 'Pelanggan memesan 2 porsi Nasi Goreng Wagyu Royale di meja 04.',
        technicalDetails: { protocol: 'Input Touchscreen Kasir' }
      },
      {
        id: 's1-pos-pay',
        laneId: 'sys-pos',
        title: 'Kasir Input & Klik "Bayar"',
        subtitle: 'Proses Order Rp 116.000',
        type: 'process',
        x: 275,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Kasir (POS)',
        description: 'Kasir memvalidasi pembayaran dan memicu verifikasi pemotongan stok bahan baku ke sistem gudang.',
        technicalDetails: {
          apiEndpoint: 'POST /api/v1/orders/checkout',
          protocol: 'Inter-System REST API',
          samplePayload: {
            tableNumber: "Meja 04",
            items: [{ menuItemId: "MENU-NASGOR-WAGYU", qty: 2 }]
          }
        }
      },
      {
        id: 's1-pos-receipt',
        laneId: 'sys-pos',
        title: 'Cetak Struk & Sajikan',
        subtitle: 'Pramusaji Antar ke Meja',
        type: 'process',
        x: 1055,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Kasir & Runner',
        description: 'Kasir mencetak struk transaksi, dan makanan diantar langsung ke meja tamu.',
        technicalDetails: { protocol: 'Thermal ESC/POS & Waiter Service' }
      },
      {
        id: 's1-pos-end',
        laneId: 'sys-pos',
        title: 'End',
        subtitle: 'Transaksi Selesai',
        type: 'terminator',
        x: 1255,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Sistem RestoSync',
        description: 'Siklus pemesanan tuntas. Seluruh 4 antarmuka sistem telah tersinkronisasi 100%.',
        technicalDetails: { protocol: 'Transaction Completed' }
      },

      // Lane 2: Interface Dapur
      {
        id: 's1-kds-receive',
        laneId: 'sys-kds',
        title: 'Tiket Masuk KDS ("Ting!")',
        subtitle: 'Tiket #1049: 2x Nasgor Wagyu',
        type: 'document',
        x: 655,
        y: 32,
        width: 165,
        height: 75,
        actor: 'Interface Dapur (KDS)',
        description: 'Tablet dapur berbunyi lonceng "Ting-Ting!" dan kartu antrean masak muncul dengan catatan memo tamu.',
        technicalDetails: {
          protocol: 'WebSocket Push Sub-150ms',
          apiEndpoint: 'WS EVENT KITCHEN_TICKET_CREATED'
        }
      },
      {
        id: 's1-kds-cook',
        laneId: 'sys-kds',
        title: 'Koki Mulai Memasak',
        subtitle: 'Timer SLA Stopwatch Berjalan',
        type: 'process',
        x: 855,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Koki Hot Kitchen',
        description: 'Koki menekan tiket. Status berubah COOKING, timer stopwatch menyala hijau (target selesai < 12 menit).',
        technicalDetails: {
          apiEndpoint: 'PATCH /api/v1/kitchen/tickets/{id}/status',
          protocol: 'HTTP PATCH'
        }
      },
      {
        id: 's1-kds-ready',
        laneId: 'sys-kds',
        title: 'Tekan "Selesai Saji"',
        subtitle: 'Panggil Runner / Pramusaji',
        type: 'process',
        x: 1055,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Koki & Pass-Bar',
        description: 'Makanan matang ditaruh di pass-bar. Koki tekan READY, memanggil runner untuk mengantar ke meja tamu.',
        technicalDetails: { protocol: 'Runner Notification Ping' }
      },

      // Lane 3: Interface Stok & Gudang
      {
        id: 's1-wh-bom',
        laneId: 'sys-wh',
        title: 'Urai Resep BOM Bahan',
        subtitle: 'Butuh: Beras 360g, Wagyu 160g',
        type: 'process',
        x: 275,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Interface Stok & Gudang',
        description: 'Sistem gudang memecah 2 porsi menjadi gramatur bahan: Beras 360g, Daging Wagyu 160g, Telur 2 butir.',
        technicalDetails: {
          sqlOperation: 'SELECT material_sku, qty FROM recipe_boms WHERE menu_item_id = $1;'
        }
      },
      {
        id: 's1-wh-decision',
        laneId: 'sys-wh',
        title: 'Stok Bahan Cukup?',
        subtitle: 'Cek Saldo Gudang & Chiller',
        type: 'decision',
        x: 475,
        y: 32,
        width: 145,
        height: 90,
        actor: 'Sistem Stok Validator',
        description: 'Membandingkan saldo fisik riil di gudang dengan kebutuhan resep pesanan.',
        technicalDetails: { edgeCase: 'Jika tidak cukup: Batalkan transaksi dan kembalikan error 409.' }
      },
      {
        id: 's1-wh-deduct',
        laneId: 'sys-wh',
        title: 'Potong Stok Otomatis (FIFO)',
        subtitle: 'Alokasi Batch Lot Tertua',
        type: 'process',
        x: 655,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Interface Stok & Gudang',
        description: 'Saldo stok terpotong atomik. Mengurangi kuantitas batch tertua dan mencatat mutasi keluar OUT_SALE.',
        technicalDetails: {
          sqlOperation: 'UPDATE raw_materials SET current_stock = current_stock - $qty; INSERT INTO stock_transactions (...);'
        }
      },

      // Lane 4: Dashboard Monitoring
      {
        id: 's1-dash-sync',
        laneId: 'sys-dash',
        title: 'Update Omset & HPP Live',
        subtitle: 'Omset +Rp 116rb · HPP +Rp 34,8rb',
        type: 'process',
        x: 855,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Dashboard Monitoring',
        description: 'Dashboard owner memperbarui total omset harian dan menghitung Food Cost rasio secara seketika.',
        technicalDetails: { protocol: 'WebSocket Client Broadcast' }
      },
      {
        id: 's1-dash-ledger',
        laneId: 'sys-dash',
        title: 'Buku Besar Audit (Ledger)',
        subtitle: 'Log Mutasi Permanen & ROP',
        type: 'database',
        x: 1055,
        y: 30,
        width: 165,
        height: 85,
        actor: 'Dashboard Ledger',
        description: 'Mencatat entri permanen di buku besar audit dengan timestamp mikrodetik dan memeriksa batas aman ROP.',
        technicalDetails: { sqlOperation: 'SELECT * FROM stock_transactions ORDER BY id DESC LIMIT 50;' }
      }
    ],
    connectors: [
      { id: 'c1-1', fromId: 's1-start', toId: 's1-pos-pay', fromPort: 'right', toPort: 'left' },
      { id: 'c1-2', fromId: 's1-pos-pay', toId: 's1-wh-bom', fromPort: 'bottom', toPort: 'top', label: 'Cek Bahan Resep' },
      { id: 'c1-3', fromId: 's1-wh-bom', toId: 's1-wh-decision', fromPort: 'right', toPort: 'left' },
      { id: 'c1-4', fromId: 's1-wh-decision', toId: 's1-wh-deduct', fromPort: 'right', toPort: 'left', label: 'YA (Stok Cukup)' },
      { id: 'c1-5', fromId: 's1-wh-deduct', toId: 's1-kds-receive', fromPort: 'top', toPort: 'bottom', label: 'Kirim Tiket Masak' },
      { id: 'c1-6', fromId: 's1-wh-deduct', toId: 's1-dash-sync', fromPort: 'bottom', toPort: 'top', label: 'Sync Omset & HPP' },
      { id: 'c1-7', fromId: 's1-kds-receive', toId: 's1-kds-cook', fromPort: 'right', toPort: 'left' },
      { id: 'c1-8', fromId: 's1-kds-cook', toId: 's1-kds-ready', fromPort: 'right', toPort: 'left', label: 'Matang' },
      { id: 'c1-9', fromId: 's1-kds-ready', toId: 's1-pos-receipt', fromPort: 'top', toPort: 'bottom', label: 'Makanan Siap Saji' },
      { id: 'c1-10', fromId: 's1-pos-receipt', toId: 's1-pos-end', fromPort: 'right', toPort: 'left' },
      { id: 'c1-11', fromId: 's1-dash-sync', toId: 's1-dash-ledger', fromPort: 'right', toPort: 'left' }
    ]
  },

  // =========================================================================
  // SCENARIO 2: KASUS JIKA STOK TIDAK CUKUP ANTAR SISTEM
  // =========================================================================
  {
    id: 'scenario_insufficient_stock',
    title: 'Skenario 2: Alur Jika Stok Tidak Cukup (Defisit Bahan & Auto Sold-Out Antar Sistem)',
    subtitle: 'Proteksi transaksi antar sistem: Rollback total, pop-up defisit ke kasir & penawaran menu pengganti',
    badge: 'Kasus Stok Kurang (Antar Sistem)',
    description: 'Menjawab pertanyaan: "Kalau stok tidak cukup gimana?". Sistem Kasir meminta pengecekan ke Sistem Gudang. Sistem Gudang mendeteksi defisit bahan, membatalkan pemotongan (Rollback) agar bahan lain tidak terpotong sepihak, mengirim status 409 ke Kasir. Layar Kasir memunculkan pop-up merah, mengunci menu (Sold-Out), kasir menawarkan menu pengganti, dan Dashboard mencatat peluang omset hilang.',
    lanes: COMMON_RESTO_SYSTEM_LANES,
    nodes: [
      // Lane 1: Interface Kasir
      {
        id: 's2-start',
        laneId: 'sys-pos',
        title: 'Start',
        subtitle: 'Tamu Pesan 2x Wagyu',
        type: 'terminator',
        x: 140,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Pelanggan & Kasir',
        description: 'Tamu memesan 2 porsi Nasi Goreng Wagyu Royale (kebutuhan 160g daging wagyu).',
        technicalDetails: { protocol: 'Input Kasir' }
      },
      {
        id: 's2-pos-pay',
        laneId: 'sys-pos',
        title: 'Kasir Klik "Bayar & Proses"',
        subtitle: 'Kirim Permintaan Cek Stok',
        type: 'process',
        x: 275,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Kasir (POS)',
        description: 'Kasir memproses pesanan dan meminta sistem gudang memverifikasi ketersediaan bahan baku.',
        technicalDetails: { apiEndpoint: 'POST /api/v1/orders/checkout' }
      },
      {
        id: 's2-pos-alert',
        laneId: 'sys-pos',
        title: 'Pop-up Merah: Stok Kurang!',
        subtitle: 'Defisit: Wagyu Sisa 50g (-110g)',
        type: 'document',
        x: 655,
        y: 32,
        width: 170,
        height: 75,
        actor: 'Interface Kasir (POS)',
        description: 'Layar kasir memunculkan pop-up merah: "Daging Wagyu tersisa 50g (Dibutuhkan 160g, Defisit 110g). Transaksi Dibatalkan".',
        technicalDetails: {
          protocol: 'UI Error Modal 409 Conflict',
          samplePayload: { errorCode: "INSUFFICIENT_STOCK", deficitSku: "RAW-WAGYU-01", deficitQty: 110 }
        }
      },
      {
        id: 's2-pos-lock',
        laneId: 'sys-pos',
        title: 'Kunci Menu (Auto Sold-Out)',
        subtitle: 'Terkunci di Kasir & QR Meja',
        type: 'process',
        x: 855,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Kasir (POS)',
        description: 'Tombol menu Wagyu otomatis dikunci menjadi abu-abu (Sold-Out) agar tidak bisa dipesan lagi.',
        technicalDetails: { protocol: 'POS Dynamic Item Lock' }
      },
      {
        id: 's2-pos-alt',
        laneId: 'sys-pos',
        title: 'Tawarkan Menu Pengganti',
        subtitle: 'Ganti ke Nasgor Ayam Suwir',
        type: 'process',
        x: 1055,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Kasir & Pelanggan',
        description: 'Kasir menginfokan stok habis dan menawarkan Nasi Goreng Ayam Suwir Spesial yang stok ayamnya masih 18kg.',
        technicalDetails: { protocol: 'Sales Recommendation' }
      },
      {
        id: 's2-pos-end',
        laneId: 'sys-pos',
        title: 'End',
        subtitle: 'Menu Baru Diproses',
        type: 'terminator',
        x: 1255,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Interface Kasir',
        description: 'Pelanggan setuju mengganti menu. Transaksi baru dengan stok cukup dilanjutkan.',
        technicalDetails: { protocol: 'Cycle Completed' }
      },

      // Lane 2: Interface Dapur
      {
        id: 's2-kds-idle',
        laneId: 'sys-kds',
        title: 'KDS Dapur Bersih (Idle)',
        subtitle: 'Tidak Ada Tiket Terbit',
        type: 'process',
        x: 655,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Dapur (KDS)',
        description: 'Layar dapur tidak menerbitkan tiket palsu/gagal. Koki tetap fokus memasak pesanan lain.',
        technicalDetails: { protocol: 'No Ticket Emitted' }
      },

      // Lane 3: Interface Stok & Gudang
      {
        id: 's2-wh-check',
        laneId: 'sys-wh',
        title: 'Hitung Kebutuhan Bahan',
        subtitle: 'Beras 360g, Wagyu 160g',
        type: 'process',
        x: 275,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Interface Stok & Gudang',
        description: 'Sistem gudang mengecek saldo rak: Beras 48kg (Cukup), tapi Daging Wagyu hanya tersisa 50g (Kurang 110g).',
        technicalDetails: { protocol: 'Stock Evaluation Engine' }
      },
      {
        id: 's2-wh-decision',
        laneId: 'sys-wh',
        title: 'Semua Bahan Cukup?',
        subtitle: 'Wagyu 50g < Butuh 160g',
        type: 'decision',
        x: 475,
        y: 32,
        width: 145,
        height: 90,
        actor: 'Sistem Stok Validator',
        description: 'Pengecekan: Stok daging Wagyu tidak mencukupi!',
        technicalDetails: { edgeCase: 'Branch NO: Batalkan pemotongan & Rollback' }
      },
      {
        id: 's2-wh-rollback',
        laneId: 'sys-wh',
        title: 'Batalkan Pemotongan (Rollback)',
        subtitle: 'Beras & Telur Batal Dipotong',
        type: 'process',
        x: 655,
        y: 42,
        width: 170,
        height: 70,
        actor: 'Interface Stok & Gudang',
        description: 'Eksekusi Rollback. Beras dan telur TIDAK terpotong sedikitpun. Saldo persediaan tetap aman 100%.',
        technicalDetails: { sqlOperation: 'ROLLBACK; -- 0 gram deducted' }
      },
      {
        id: 's2-wh-safety',
        laneId: 'sys-wh',
        title: 'Cek Safety Stock / PO',
        subtitle: 'Notif Buka Cadangan Gudang',
        type: 'process',
        x: 855,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Staff Gudang',
        description: 'Staff gudang menerima notifikasi untuk memeriksa cadangan beku di freezer belakang atau membuat PO darurat.',
        technicalDetails: { protocol: 'Warehouse Restock Ping' }
      },

      // Lane 4: Dashboard Monitoring
      {
        id: 's2-dash-loss',
        laneId: 'sys-dash',
        title: 'Catat Lost Sales Opportunity',
        subtitle: 'Peluang Hilang: Rp 116.000',
        type: 'process',
        x: 855,
        y: 38,
        width: 170,
        height: 68,
        actor: 'Dashboard Monitoring',
        description: 'Dashboard mencatat potensi omset yang gagal diraih akibat stok habis guna evaluasi kuota belanja.',
        technicalDetails: { sqlOperation: 'INSERT INTO lost_sales_logs (menu_id, amount, reason) VALUES (...);' }
      },
      {
        id: 's2-dash-alert',
        laneId: 'sys-dash',
        title: 'Alert Stok Kritis ke Owner',
        subtitle: 'Wagyu Masuk Draf Reorder PO',
        type: 'document',
        x: 1055,
        y: 32,
        width: 165,
        height: 75,
        actor: 'Dashboard Monitoring',
        description: 'Lampu merah menyala di dashboard owner menandakan Wagyu harus segera dipesan ulang ke supplier.',
        technicalDetails: { protocol: 'Owner Push Alert' }
      }
    ],
    connectors: [
      { id: 'c2-1', fromId: 's2-start', toId: 's2-pos-pay', fromPort: 'right', toPort: 'left' },
      { id: 'c2-2', fromId: 's2-pos-pay', toId: 's2-wh-check', fromPort: 'bottom', toPort: 'top', label: 'Cek Ketersediaan' },
      { id: 'c2-3', fromId: 's2-wh-check', toId: 's2-wh-decision', fromPort: 'right', toPort: 'left' },
      { id: 'c2-4', fromId: 's2-wh-decision', toId: 's2-wh-rollback', fromPort: 'right', toPort: 'left', label: 'TIDAK (Kurang 110g)' },
      { id: 'c2-5', fromId: 's2-wh-rollback', toId: 's2-pos-alert', fromPort: 'top', toPort: 'bottom', label: 'Kirim Error 409 Defisit' },
      { id: 'c2-6', fromId: 's2-wh-rollback', toId: 's2-kds-idle', fromPort: 'top', toPort: 'bottom', label: 'Batal Kirim Tiket' },
      { id: 'c2-7', fromId: 's2-wh-rollback', toId: 's2-wh-safety', fromPort: 'right', toPort: 'left' },
      { id: 'c2-8', fromId: 's2-pos-alert', toId: 's2-pos-lock', fromPort: 'right', toPort: 'left' },
      { id: 'c2-9', fromId: 's2-pos-lock', toId: 's2-pos-alt', fromPort: 'right', toPort: 'left' },
      { id: 'c2-10', fromId: 's2-pos-alt', toId: 's2-pos-end', fromPort: 'right', toPort: 'left' },
      { id: 'c2-11', fromId: 's2-pos-lock', toId: 's2-dash-loss', fromPort: 'bottom', toPort: 'top', label: 'Lapor Omset Hilang' },
      { id: 'c2-12', fromId: 's2-dash-loss', toId: 's2-dash-alert', fromPort: 'right', toPort: 'left' }
    ]
  },

  // =========================================================================
  // SCENARIO 3: PESANAN MASUK KE DAPUR (KDS, MULTI-STATION & SLA ANTAR SISTEM)
  // =========================================================================
  {
    id: 'scenario_kds_kitchen_flow',
    title: 'Skenario 3: Alur Pesanan Masuk ke Dapur (KDS, Lonceng Ting-Ting & SLA Antar Sistem)',
    subtitle: 'Bagaimana tiket dikirim sub-150ms ke koki, dipisah stasiun makanan/minuman, hingga diantar runner',
    badge: 'Alur Dapur KDS (Antar Sistem)',
    description: 'Menjawab pertanyaan: "Pesanan masuk ke dapur gimana?". Begitu transaksi selesai di Kasir, tiket langsung dipancarkan via WebSocket ke tablet dapur dalam sub-150ms. Sistem membagi otomatis tiket makanan ke Hot Kitchen dan minuman ke Barista. Tablet berbunyi lonceng audio "Ting-Ting!", koki memulai timer masak SLA, dan saat matang pramusaji dipanggil otomatis.',
    lanes: COMMON_RESTO_SYSTEM_LANES,
    nodes: [
      // Lane 1: Interface Kasir
      {
        id: 's3-start',
        laneId: 'sys-pos',
        title: 'Start',
        subtitle: 'Tamu Selesai Bayar',
        type: 'terminator',
        x: 140,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Kasir & Tamu',
        description: 'Tamu membayar pesanan di kasir untuk meja 04.',
        technicalDetails: { protocol: 'Payment Completed' }
      },
      {
        id: 's3-pos-push',
        laneId: 'sys-pos',
        title: 'Kasir Terbitkan Tiket',
        subtitle: 'Kirim ke Sistem Dapur',
        type: 'process',
        x: 275,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Kasir (POS)',
        description: 'Kasir menyimpan transaksi dan otomatis memancarkan tiket pesanan ke sistem dapur.',
        technicalDetails: { protocol: 'WebSocket Event Dispatcher' }
      },
      {
        id: 's3-pos-serve',
        laneId: 'sys-pos',
        title: 'Pramusaji Antar ke Meja',
        subtitle: 'Runner Antar Piring Meja 04',
        type: 'process',
        x: 1070,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Pramusaji (Runner)',
        description: 'Pramusaji mengambil piring di pass-bar dan menyajikan ke meja tamu.',
        technicalDetails: { protocol: 'Food Serving Confirmation' }
      },
      {
        id: 's3-pos-end',
        laneId: 'sys-pos',
        title: 'End',
        subtitle: 'Tamu Menikmati Makanan',
        type: 'terminator',
        x: 1270,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Pelanggan Meja 04',
        description: 'Seluruh pesanan selesai disajikan tepat waktu.',
        technicalDetails: { protocol: 'Order Delivered' }
      },

      // Lane 2: Interface Dapur
      {
        id: 's3-kds-split',
        laneId: 'sys-kds',
        title: 'Pisahkan Stasiun Otomatis',
        subtitle: 'Makanan vs Minuman',
        type: 'process',
        x: 275,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Dapur (KDS)',
        description: 'Sistem KDS membagi pesanan: makanan diarahkan ke Hot Kitchen, minuman ke Barista.',
        technicalDetails: { protocol: 'Station Routing Engine' }
      },
      {
        id: 's3-kds-food',
        laneId: 'sys-kds',
        title: 'Layar Koki "Ting-Ting!"',
        subtitle: 'Hot Kitchen: 2x Nasgor Wagyu',
        type: 'document',
        x: 475,
        y: 18,
        width: 165,
        height: 60,
        actor: 'Koki Makanan',
        description: 'Monitor dapur berbunyi lonceng nyaring. Tiket berkedip kuning dengan memo pedas sedang.',
        technicalDetails: { protocol: 'Audio Chime + Screen Highlight' }
      },
      {
        id: 's3-kds-bar',
        laneId: 'sys-kds',
        title: 'Layar Barista "Ting!"',
        subtitle: 'Bar Station: 2x Kopi Susu',
        type: 'document',
        x: 475,
        y: 84,
        width: 165,
        height: 55,
        actor: 'Barista',
        description: 'Layar bar menerima tiket kopi susu aren dan barista langsung meracik minuman.',
        technicalDetails: { protocol: 'Bar Station Display' }
      },
      {
        id: 's3-kds-cook',
        laneId: 'sys-kds',
        title: 'Koki Klik "Mulai Masak"',
        subtitle: 'Stopwatch SLA Berjalan',
        type: 'process',
        x: 675,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Koki Dapur',
        description: 'Koki menekan tiket. Status berubah COOKING. Stopwatch timer hijau menyala (target < 12 menit).',
        technicalDetails: { apiEndpoint: 'PATCH /api/v1/kitchen/tickets/{id}/status' }
      },
      {
        id: 's3-kds-ready',
        laneId: 'sys-kds',
        title: 'Tekan "Selesai Saji"',
        subtitle: 'Panggil Runner ke Pass-Bar',
        type: 'process',
        x: 875,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Koki Dapur',
        description: 'Piring ditaruh di pass-bar. Koki tekan READY, memicu notifikasi getar ke tablet runner.',
        technicalDetails: { protocol: 'Waiter Pager Call' }
      },

      // Lane 3: Interface Stok & Gudang
      {
        id: 's3-wh-confirm',
        laneId: 'sys-wh',
        title: 'Konfirmasi Bahan Terolah',
        subtitle: 'SOP Gramatur Terpenuhi',
        type: 'process',
        x: 675,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Interface Stok & Gudang',
        description: 'Sistem gudang memastikan bahan baku di chiller dapur telah diolah sesuai porsi gramatur.',
        technicalDetails: { protocol: 'BOM Consumption Locked' }
      },

      // Lane 4: Dashboard Monitoring
      {
        id: 's3-dash-sla',
        laneId: 'sys-dash',
        title: 'Pantau Waktu Masak SLA',
        subtitle: 'Selesai 11 Menit (Hijau OK)',
        type: 'process',
        x: 875,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Dashboard Monitoring',
        description: 'Kecepatan saji dapur terpantau hijau (< 12 menit) di dashboard efisiensi manager.',
        technicalDetails: { protocol: 'SLA Performance Metric' }
      },
      {
        id: 's3-dash-cogs',
        laneId: 'sys-dash',
        title: 'HPP Porsi Terkunci',
        subtitle: 'Food Cost Tersinkronisasi',
        type: 'database',
        x: 1070,
        y: 30,
        width: 165,
        height: 85,
        actor: 'Dashboard Monitoring',
        description: 'Biaya modal bahan porsi terkunci dan tersinkronisasi di laporan laba rugi restoran.',
        technicalDetails: { sqlOperation: 'UPDATE orders SET status = "SERVED";' }
      }
    ],
    connectors: [
      { id: 'c3-1', fromId: 's3-start', toId: 's3-pos-push', fromPort: 'right', toPort: 'left' },
      { id: 'c3-2', fromId: 's3-pos-push', toId: 's3-kds-split', fromPort: 'bottom', toPort: 'top', label: 'WebSocket Push' },
      { id: 'c3-3', fromId: 's3-kds-split', toId: 's3-kds-food', fromPort: 'right', toPort: 'left', label: 'Hot Kitchen' },
      { id: 'c3-4', fromId: 's3-kds-split', toId: 's3-kds-bar', fromPort: 'right', toPort: 'left', label: 'Bar Station' },
      { id: 'c3-5', fromId: 's3-kds-food', toId: 's3-kds-cook', fromPort: 'right', toPort: 'left' },
      { id: 'c3-6', fromId: 's3-kds-bar', toId: 's3-kds-ready', fromPort: 'right', toPort: 'left', label: 'Minuman Siap' },
      { id: 'c3-7', fromId: 's3-kds-cook', toId: 's3-wh-confirm', fromPort: 'bottom', toPort: 'top', label: 'Bahan Diolah' },
      { id: 'c3-8', fromId: 's3-kds-cook', toId: 's3-kds-ready', fromPort: 'right', toPort: 'left', label: 'Matang' },
      { id: 'c3-9', fromId: 's3-kds-ready', toId: 's3-pos-serve', fromPort: 'top', toPort: 'bottom', label: 'Panggil Runner' },
      { id: 'c3-10', fromId: 's3-kds-ready', toId: 's3-dash-sla', fromPort: 'bottom', toPort: 'top', label: 'Lapor Selesai SLA' },
      { id: 'c3-11', fromId: 's3-pos-serve', toId: 's3-pos-end', fromPort: 'right', toPort: 'left' },
      { id: 'c3-12', fromId: 's3-dash-sla', toId: 's3-dash-cogs', fromPort: 'right', toPort: 'left' }
    ]
  },

  // =========================================================================
  // SCENARIO 4: SINKRONISASI KE DASHBOARD & AUTO DRAFT PO ANTAR SISTEM
  // =========================================================================
  {
    id: 'scenario_dashboard_sync',
    title: 'Skenario 4: Alur Sinkronisasi ke Dashboard (HPP Realtime & Auto Draf PO Antar Sistem)',
    subtitle: 'Bagaimana penjualan memicu update metrik owner, peringatan stok kritis ROP, hingga pengiriman PO belanja',
    badge: 'Alur Dashboard (Antar Sistem)',
    description: 'Menjawab pertanyaan: "Trus ke dashboard gimana?". Setiap transaksi di Kasir atau Dapur langsung memperbarui metrik Omset, HPP, dan Food Cost di Dashboard tanpa reload halaman. Jika sisa bahan menyentuh batas aman ROP, Dashboard menyalakan Lampu Merah Kritis dan otomatis menyusun draf Purchase Order ke supplier langganan.',
    lanes: COMMON_RESTO_SYSTEM_LANES,
    nodes: [
      // Lane 1: Interface Kasir
      {
        id: 's4-start',
        laneId: 'sys-pos',
        title: 'Start',
        subtitle: 'Transaksi Kasir Sukses',
        type: 'terminator',
        x: 140,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Kasir POS',
        description: 'Kasir memproses order makan senilai Rp 154.000.',
        technicalDetails: { protocol: 'Checkout Success' }
      },
      {
        id: 's4-pos-event',
        laneId: 'sys-pos',
        title: 'Kirim Data Transaksi',
        subtitle: 'Order #1050 Ter-commit',
        type: 'process',
        x: 275,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Kasir (POS)',
        description: 'Kasir mengirim data rincian pesanan ke sistem gudang dan dashboard monitoring.',
        technicalDetails: { protocol: 'Transaction Event Broadcast' }
      },

      // Lane 2: Interface Dapur
      {
        id: 's4-kds-notify',
        laneId: 'sys-kds',
        title: 'Notif Dapur: Stok Menipis',
        subtitle: 'Koki Info Sisa 38 Telur',
        type: 'process',
        x: 655,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Dapur (KDS)',
        description: 'Layar dapur menampilkan lencana kuning bahwa stok telur menipis dan sedang dipesan ulang.',
        technicalDetails: { protocol: 'Kitchen Low-Stock Indicator' }
      },

      // Lane 3: Interface Stok & Gudang
      {
        id: 's4-wh-deduct',
        laneId: 'sys-wh',
        title: 'Saldo Stok Menipis',
        subtitle: 'Telur Sisa 38 Butir',
        type: 'process',
        x: 275,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Interface Stok & Gudang',
        description: 'Stok telur terpotong 2 butir, menyisakan 38 butir di rak penyimpanan.',
        technicalDetails: { sqlOperation: 'UPDATE raw_materials SET current_stock = 38 WHERE sku = "RAW-TELUR-01";' }
      },
      {
        id: 's4-wh-decision',
        laneId: 'sys-wh',
        title: 'Sisa Stok <= ROP?',
        subtitle: 'Telur 38 <= Batas ROP 40?',
        type: 'decision',
        x: 475,
        y: 32,
        width: 145,
        height: 90,
        actor: 'Sistem ROP Engine',
        description: 'Pengecekan: Stok telur (38 butir) telah menembus di bawah batas aman Reorder Point (40 butir)!',
        technicalDetails: { edgeCase: 'Branch YES: Picu Peringatan ROP & Draf PO' }
      },
      {
        id: 's4-wh-alert',
        laneId: 'sys-wh',
        title: 'Kirim Sinyal Stok Kritis',
        subtitle: 'Picu Auto Draft PO Supplier',
        type: 'process',
        x: 655,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Interface Stok & Gudang',
        description: 'Sistem gudang memancarkan alert darurat ke dashboard owner untuk segera melakukan pengadaan.',
        technicalDetails: { protocol: 'Critical ROP Event' }
      },
      {
        id: 's4-wh-receive',
        laneId: 'sys-wh',
        title: 'Gudang Siap Terima Pasokan',
        subtitle: 'Jadwal Truk Vendor Tercatat',
        type: 'process',
        x: 1055,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Staff Gudang',
        description: 'Staff gudang menjadwalkan kedatangan truk supplier pengantar telur.',
        technicalDetails: { protocol: 'Inbound Logistics Scheduled' }
      },

      // Lane 4: Dashboard Monitoring
      {
        id: 's4-dash-update',
        laneId: 'sys-dash',
        title: 'Live Update Omset & HPP',
        subtitle: 'Grafik Food Cost Terupdate',
        type: 'process',
        x: 275,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Dashboard Monitoring',
        description: 'Angka omset naik seketika dan HPP terhitung otomatis dari gramatur bahan keluar tanpa reload browser.',
        technicalDetails: { protocol: 'WebSocket Push Update' }
      },
      {
        id: 's4-dash-lamp',
        laneId: 'sys-dash',
        title: 'Lampu Merah: Alert ROP',
        subtitle: 'Banner Berkedip: Telur Kritis',
        type: 'document',
        x: 655,
        y: 32,
        width: 165,
        height: 75,
        actor: 'Dashboard Monitoring',
        description: 'Lampu indikator merah menyala di dashboard owner disertai notifikasi bunyi peringatan stok menipis.',
        technicalDetails: { protocol: 'Push Notification UI' }
      },
      {
        id: 's4-dash-po',
        laneId: 'sys-dash',
        title: 'Susun Draf PO Otomatis',
        subtitle: 'PO #109: 100 Butir Telur',
        type: 'process',
        x: 855,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Dashboard Monitoring',
        description: 'Sistem menyusun draf purchase order ke supplier langganan dengan kuantitas pemesanan ekonomis (EOQ).',
        technicalDetails: { sqlOperation: 'INSERT INTO purchase_orders (supplier_id, status) VALUES (...);' }
      },
      {
        id: 's4-dash-approve',
        laneId: 'sys-dash',
        title: 'Owner Klik "Approve PO"',
        subtitle: 'Kirim via WhatsApp / Email',
        type: 'process',
        x: 1055,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Pemilik Resto (Owner)',
        description: 'Owner cukup menekan 1 tombol untuk mengirim dokumen belanja ke supplier resmi.',
        technicalDetails: { protocol: 'WhatsApp Business / Email Webhook API' }
      },
      {
        id: 's4-dash-end',
        laneId: 'sys-dash',
        title: 'End',
        subtitle: 'Rantai Pasok Terlindungi',
        type: 'terminator',
        x: 1255,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Sistem RestoSync',
        description: 'Persediaan bahan baku aman sebelum stok di dapur benar-benar habis.',
        technicalDetails: { protocol: 'Supply Chain Safeguarded' }
      }
    ],
    connectors: [
      { id: 'c4-1', fromId: 's4-start', toId: 's4-pos-event', fromPort: 'right', toPort: 'left' },
      { id: 'c4-2', fromId: 's4-pos-event', toId: 's4-wh-deduct', fromPort: 'bottom', toPort: 'top', label: 'Potong Saldo' },
      { id: 'c4-3', fromId: 's4-wh-deduct', toId: 's4-dash-update', fromPort: 'bottom', toPort: 'top', label: 'Live Update' },
      { id: 'c4-4', fromId: 's4-wh-deduct', toId: 's4-wh-decision', fromPort: 'right', toPort: 'left' },
      { id: 'c4-5', fromId: 's4-wh-decision', toId: 's4-wh-alert', fromPort: 'right', toPort: 'left', label: 'YA (Sisa <= ROP)' },
      { id: 'c4-6', fromId: 's4-wh-alert', toId: 's4-dash-lamp', fromPort: 'bottom', toPort: 'top', label: 'Alert Merah Owner' },
      { id: 'c4-7', fromId: 's4-wh-alert', toId: 's4-kds-notify', fromPort: 'top', toPort: 'bottom', label: 'Info ke Dapur' },
      { id: 'c4-8', fromId: 's4-dash-lamp', toId: 's4-dash-po', fromPort: 'right', toPort: 'left' },
      { id: 'c4-9', fromId: 's4-dash-po', toId: 's4-dash-approve', fromPort: 'right', toPort: 'left' },
      { id: 'c4-10', fromId: 's4-dash-approve', toId: 's4-wh-receive', fromPort: 'top', toPort: 'bottom', label: 'PO Terkirim' },
      { id: 'c4-11', fromId: 's4-dash-approve', toId: 's4-dash-end', fromPort: 'right', toPort: 'left' }
    ]
  },

  // =========================================================================
  // SCENARIO 5: PENERIMAAN BARANG MASUK (GOODS IN PO ANTAR SISTEM)
  // =========================================================================
  {
    id: 'scenario_goods_in',
    title: 'Skenario 5: Penerimaan Barang Masuk Supplier (Goods In PO & FEFO Antar Sistem)',
    subtitle: 'Bagaimana penerimaan barang di gudang langsung membuka kembali menu di kasir dan mengupdate nilai aset di dashboard',
    badge: 'Alur Masuk (In)',
    description: 'Menunjukkan kolaborasi antar sistem saat truk logistik supplier tiba: Staff Gudang melakukan inspeksi QC suhu dan input faktur, sistem mendaftarkan nomor batch FEFO, Dashboard mengupdate nilai persediaan dan menutup PO, Kasir otomatis mengaktifkan menu yang sebelumnya Sold-Out, dan Koki menerima konfirmasi bahan segar siap diolah.',
    lanes: COMMON_RESTO_SYSTEM_LANES,
    nodes: [
      // Lane 1: Interface Kasir
      {
        id: 's5-pos-unlock',
        laneId: 'sys-pos',
        title: 'Buka Menu Sold-Out',
        subtitle: 'Wagyu Aktif Kembali di POS',
        type: 'process',
        x: 1055,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Kasir (POS)',
        description: 'Menu Nasi Goreng Wagyu yang sebelumnya Sold-Out otomatis terbuka kembali dan siap dijual ke pelanggan.',
        technicalDetails: { protocol: 'POS Auto-Unlock Item' }
      },

      // Lane 2: Interface Dapur
      {
        id: 's5-kds-ready',
        laneId: 'sys-kds',
        title: 'Bahan Segar Tersedia',
        subtitle: 'Chiller Dapur Terisi Penuh',
        type: 'process',
        x: 1055,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Dapur (KDS)',
        description: 'Koki menerima konfirmasi bahwa daging dan telur baru sudah siap digunakan untuk memasak.',
        technicalDetails: { protocol: 'Kitchen Inventory Ready' }
      },

      // Lane 3: Interface Stok & Gudang
      {
        id: 's5-start',
        laneId: 'sys-wh',
        title: 'Start',
        subtitle: 'Truk Vendor Tiba',
        type: 'terminator',
        x: 140,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Supplier & Gudang',
        description: 'Truk vendor membawa kiriman bahan baku (Beras 100kg, Daging 20kg, Telur 300 butir).',
        technicalDetails: { protocol: 'Delivery PO-2026-OCT-091' }
      },
      {
        id: 's5-wh-qc',
        laneId: 'sys-wh',
        title: 'Inspeksi QC & Suhu',
        subtitle: 'Cek Daging < 4°C & Kemasan',
        type: 'process',
        x: 275,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Staff QC Gudang',
        description: 'Staff mengecek temperatur daging menggunakan probe termal dan memastikan kemasan utuh.',
        technicalDetails: { protocol: 'QC Food Safety Probe' }
      },
      {
        id: 's5-wh-decision',
        laneId: 'sys-wh',
        title: 'Barang Lolos QC?',
        subtitle: 'Suhu & Expired Valid?',
        type: 'decision',
        x: 475,
        y: 32,
        width: 145,
        height: 90,
        actor: 'Staff QC Gudang',
        description: 'Pengecekan kesegaran bahan baku sesuai standar SOP mutu restoran.',
        technicalDetails: { edgeCase: 'Jika reject: Terbitkan nota retur barang kembali ke supplier.' }
      },
      {
        id: 's5-wh-input',
        laneId: 'sys-wh',
        title: 'Input Goods In (PO)',
        subtitle: 'No Batch & Tanggal Expired',
        type: 'process',
        x: 655,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Staff Gudang',
        description: 'Staff menginput data faktur: No Batch, kuantitas riil timbangan, dan tanggal kadaluarsa.',
        technicalDetails: { apiEndpoint: 'POST /api/v1/inventory/goods-in' }
      },
      {
        id: 's5-wh-fefo',
        laneId: 'sys-wh',
        title: 'Registrasi Batch FEFO',
        subtitle: 'Tambah Saldo Persediaan',
        type: 'database',
        x: 855,
        y: 32,
        width: 165,
        height: 85,
        actor: 'Interface Stok & Gudang',
        description: 'Mencatat nomor lot batch baru di tabel stock_batches untuk prioritas pemakaian First-Expired-First-Out.',
        technicalDetails: { sqlOperation: 'INSERT INTO stock_batches (...); UPDATE raw_materials SET current_stock = ...;' }
      },
      {
        id: 's5-wh-end',
        laneId: 'sys-wh',
        title: 'End',
        subtitle: 'Barang Siap Pakai',
        type: 'terminator',
        x: 1255,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Staff Gudang',
        description: 'Bahan baku telah tersimpan rapi di rak chiller dan dry storage.',
        technicalDetails: { protocol: 'Inbound Completed' }
      },

      // Lane 4: Dashboard Monitoring
      {
        id: 's5-dash-po',
        laneId: 'sys-dash',
        title: 'Tutup Status PO: COMPLETED',
        subtitle: 'Nilai Aset Gudang Bertambah',
        type: 'process',
        x: 855,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Dashboard Monitoring',
        description: 'Status purchase order berubah menjadi selesai dan total nilai aset persediaan restoran bertambah.',
        technicalDetails: { protocol: 'Purchase Order Closed' }
      },
      {
        id: 's5-dash-cost',
        laneId: 'sys-dash',
        title: 'Update Moving Average Cost',
        subtitle: 'Kalkulasi Ulang Harga Pokok',
        type: 'process',
        x: 1055,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Dashboard Monitoring',
        description: 'Sistem memperbarui bobot harga beli rata-rata untuk kalkulasi HPP yang akurat.',
        technicalDetails: { sqlOperation: 'UPDATE raw_materials SET unit_cost = $newMovingAvgCost WHERE sku = $sku;' }
      }
    ],
    connectors: [
      { id: 'c5-1', fromId: 's5-start', toId: 's5-wh-qc', fromPort: 'right', toPort: 'left' },
      { id: 'c5-2', fromId: 's5-wh-qc', toId: 's5-wh-decision', fromPort: 'right', toPort: 'left' },
      { id: 'c5-3', fromId: 's5-wh-decision', toId: 's5-wh-input', fromPort: 'right', toPort: 'left', label: 'Lolos QC' },
      { id: 'c5-4', fromId: 's5-wh-input', toId: 's5-wh-fefo', fromPort: 'right', toPort: 'left' },
      { id: 'c5-5', fromId: 's5-wh-fefo', toId: 's5-dash-po', fromPort: 'bottom', toPort: 'top', label: 'Sync Status PO' },
      { id: 'c5-6', fromId: 's5-dash-po', toId: 's5-dash-cost', fromPort: 'right', toPort: 'left' },
      { id: 'c5-7', fromId: 's5-dash-cost', toId: 's5-pos-unlock', fromPort: 'top', toPort: 'bottom', label: 'Buka Menu di Kasir' },
      { id: 'c5-8', fromId: 's5-dash-cost', toId: 's5-kds-ready', fromPort: 'top', toPort: 'bottom', label: 'Konfirmasi ke Koki' },
      { id: 'c5-9', fromId: 's5-wh-fefo', toId: 's5-wh-end', fromPort: 'right', toPort: 'left' }
    ]
  },

  // =========================================================================
  // SCENARIO 6: KASUS BAHAN RUSAK / WASTE DAPUR ANTAR SISTEM
  // =========================================================================
  {
    id: 'scenario_kitchen_waste',
    title: 'Skenario 6: Kasus Bahan Rusak / Gosong di Dapur (Waste Logging Antar Sistem)',
    subtitle: 'Bagaimana insiden masakan gosong/tumpah di KDS memotong stok gudang dan mencatat kerugian di dashboard',
    badge: 'Kasus Waste Dapur (Antar Sistem)',
    description: 'Menjawab kasus: "Kalau masakan gosong atau bahan rusak di dapur gimana?". Koki mencatat insiden di layar KDS dengan alasan (Gosong, Tumpah, Kadaluwarsa). Sistem Gudang langsung memotong stok fisik penyesuaian (ADJUST_WASTE), Dashboard menghitung nilai kerugian finansial secara real-time, dan Kasir memastikan kuota porsi tetap akurat.',
    lanes: COMMON_RESTO_SYSTEM_LANES,
    nodes: [
      // Lane 1: Interface Kasir
      {
        id: 's6-pos-sync',
        laneId: 'sys-pos',
        title: 'Sync Kuota Porsi Kasir',
        subtitle: 'Update Sisa Porsi Jual',
        type: 'process',
        x: 675,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Interface Kasir (POS)',
        description: 'Kasir otomatis mengetahui sisa kuota porsi yang bisa dijual setelah terjadi pengurangan waste di dapur.',
        technicalDetails: { protocol: 'POS Availability Sync' }
      },

      // Lane 2: Interface Dapur
      {
        id: 's6-start',
        laneId: 'sys-kds',
        title: 'Start',
        subtitle: 'Masakan Gosong / Tumpah',
        type: 'terminator',
        x: 140,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Koki Dapur',
        description: 'Saat memasak, 2 butir telur pecah di lantai dapur atau porsi wagyu gosong.',
        technicalDetails: { protocol: 'Incident Discovered' }
      },
      {
        id: 's6-kds-input',
        laneId: 'sys-kds',
        title: 'Klik "Catat Waste Bahan"',
        subtitle: 'Pilih Telur 2 Butir (Spill)',
        type: 'process',
        x: 275,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Koki Dapur (KDS)',
        description: 'Koki menekan menu waste di tablet: Pilih Telur 2 butir, alasan DROPPED_SPILL.',
        technicalDetails: {
          apiEndpoint: 'POST /api/v1/kitchen/waste',
          samplePayload: { materialSku: "RAW-TELUR-01", qty: 2, reason: "DROPPED_SPILL" }
        }
      },
      {
        id: 's6-kds-confirm',
        laneId: 'sys-kds',
        title: 'Ambil Bahan Baru & Lanjut',
        subtitle: 'Koki Masak Porsi Ulang',
        type: 'process',
        x: 475,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Koki Dapur',
        description: 'Koki mengambil bahan pengganti dari kulkas dan melanjutkan proses masak pesanan tamu.',
        technicalDetails: { protocol: 'Kitchen Cooking Resumed' }
      },

      // Lane 3: Interface Stok & Gudang
      {
        id: 's6-wh-deduct',
        laneId: 'sys-wh',
        title: 'Potong Penyesuaian Stok',
        subtitle: 'Mutasi ADJUST_WASTE (-2 Butir)',
        type: 'process',
        x: 475,
        y: 42,
        width: 165,
        height: 70,
        actor: 'Interface Stok & Gudang',
        description: 'Sistem gudang memotong saldo telur sebanyak 2 butir dengan tipe mutasi penyesuaian limbah (ADJUST_WASTE).',
        technicalDetails: {
          sqlOperation: 'UPDATE raw_materials SET current_stock = current_stock - 2 WHERE sku = "RAW-TELUR-01";'
        }
      },
      {
        id: 's6-wh-balance',
        laneId: 'sys-wh',
        title: 'Saldo Rak Fisik Sinkron',
        subtitle: 'Komputer & Rak Sama Persis',
        type: 'database',
        x: 675,
        y: 32,
        width: 165,
        height: 85,
        actor: 'Interface Stok & Gudang',
        description: 'Jumlah telur di rak fisik dapur dan saldo di sistem tetap sinkron 100% sehingga tidak terjadi selisih opname.',
        technicalDetails: { protocol: 'Physical Shelf Reconciliation' }
      },

      // Lane 4: Dashboard Monitoring
      {
        id: 's6-dash-loss',
        laneId: 'sys-dash',
        title: 'Hitung Kerugian Finansial',
        subtitle: 'Rugi Bahan: Rp 4.400',
        type: 'process',
        x: 675,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Dashboard Monitoring',
        description: 'Dashboard mengalikan kuantitas rusak dengan harga modal (2 butir x Rp 2.200 = Rp 4.400 kerugian).',
        technicalDetails: { protocol: 'Waste Financial Costing' }
      },
      {
        id: 's6-dash-kpi',
        laneId: 'sys-dash',
        title: 'Update Grafik Waste & Susut',
        subtitle: 'Tercatat di KPI Kerugian Hari Ini',
        type: 'process',
        x: 875,
        y: 38,
        width: 165,
        height: 68,
        actor: 'Dashboard Monitoring',
        description: 'Owner melihat grafik persentase bahan terbuang dan mengevaluasi efisiensi kerja koki.',
        technicalDetails: { protocol: 'Dashboard Metric Refresh' }
      },
      {
        id: 's6-dash-end',
        laneId: 'sys-dash',
        title: 'End',
        subtitle: 'Laporan Keuangan Akurat',
        type: 'terminator',
        x: 1075,
        y: 45,
        width: 100,
        height: 50,
        actor: 'Sistem RestoSync',
        description: 'Seluruh sistem tercatat transparan, akuntansi resto tidak mengalami kebocoran biaya.',
        technicalDetails: { protocol: 'Waste Reconciled' }
      }
    ],
    connectors: [
      { id: 'c6-1', fromId: 's6-start', toId: 's6-kds-input', fromPort: 'right', toPort: 'left' },
      { id: 'c6-2', fromId: 's6-kds-input', toId: 's6-wh-deduct', fromPort: 'bottom', toPort: 'top', label: 'Kirim Data Waste' },
      { id: 'c6-3', fromId: 's6-kds-input', toId: 's6-kds-confirm', fromPort: 'right', toPort: 'left' },
      { id: 'c6-4', fromId: 's6-wh-deduct', toId: 's6-wh-balance', fromPort: 'right', toPort: 'left' },
      { id: 'c6-5', fromId: 's6-wh-deduct', toId: 's6-dash-loss', fromPort: 'bottom', toPort: 'top', label: 'Lapor Kerugian' },
      { id: 'c6-6', fromId: 's6-wh-deduct', toId: 's6-pos-sync', fromPort: 'top', toPort: 'bottom', label: 'Sync Kuota Kasir' },
      { id: 'c6-7', fromId: 's6-dash-loss', toId: 's6-dash-kpi', fromPort: 'right', toPort: 'left' },
      { id: 'c6-8', fromId: 's6-dash-kpi', toId: 's6-dash-end', fromPort: 'right', toPort: 'left' }
    ]
  }
];
