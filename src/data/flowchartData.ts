import { FlowModuleConfig } from '../types/inventory';

export const FLOW_MODULES: FlowModuleConfig[] = [
  {
    id: 'all',
    name: 'End-to-End Architecture (Matrix Terintegrasi)',
    shortDescription: 'Alur sinkronisasi lintas modul: Kasir -> Engine BOM -> Database ACID -> Broadcast WS -> Dapur, Gudang, & Dashboard',
    color: 'emerald',
    primaryGoal: 'Menjaga single source of truth untuk persediaan dengan latensi di bawah 150ms di seluruh stasiun restoran.',
    nodes: [
      {
        id: 'E2E-1',
        step: '01',
        title: 'Order Masuk di Kasir',
        type: 'io',
        actor: 'Kasir (POS)',
        swimlane: 'interface',
        description: 'Pelanggan memilih menu (Dine-in / Takeaway / Online). Kasir menekan tombol "Bayar & Proses Order".',
        x: 40,
        y: 190,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: '/api/v1/orders/checkout',
          httpMethod: 'POST',
          requestPayload: {
            tableNumber: "T-04",
            orderType: "DINE_IN",
            items: [{ menuItemId: "MENU-NASGOR-01", qty: 2 }]
          },
          concurrencyHandling: 'Idempotency-Key di header untuk mencegah double-order akibat koneksi terputus.'
        },
        connectedTo: ['E2E-2']
      },
      {
        id: 'E2E-2',
        step: '02',
        title: 'BOM Resolver & Cek Stok',
        type: 'process',
        actor: 'Backend Engine',
        swimlane: 'backend',
        description: 'Engine memecah menu menjadi kebutuhan bahan baku mentah (Bill of Materials) dan memeriksa ketersediaan stok fisik di gudang.',
        x: 260,
        y: 190,
        width: 170,
        height: 75,
        technicalDetails: {
          sqlOperation: 'SELECT material_sku, (qty_required * $1) as needed, current_stock FROM recipe_boms JOIN raw_materials ON ...',
          tablesAffected: ['recipe_boms', 'raw_materials', 'stock_batches']
        },
        connectedTo: ['E2E-3']
      },
      {
        id: 'E2E-3',
        step: '03',
        title: 'Stok Bahan Cukup?',
        type: 'decision',
        actor: 'Backend Engine',
        swimlane: 'backend',
        description: 'Pengecekan stok kumulatif untuk seluruh item pesanan: Current Stock >= Needed Stock?',
        x: 480,
        y: 175,
        width: 140,
        height: 105,
        technicalDetails: {
          edgeCaseHandling: 'Jika tidak cukup: HTTP 409 Conflict dengan daftar bahan spesifik yang out-of-stock. Kasir menerima pesan peringatan interaktif.'
        },
        decisionBranches: {
          yes: 'E2E-4',
          no: 'E2E-ERR',
          conditionText: 'Cek Stock >= Needed'
        }
      },
      {
        id: 'E2E-ERR',
        step: '03b',
        title: 'Tolak Order & Notif POS',
        type: 'start_end',
        actor: 'Kasir (POS)',
        swimlane: 'interface',
        description: 'Transaksi digagalkan secara graceful. Kasir menawarkan alternatif menu atau stok segera disesuaikan.',
        x: 465,
        y: 350,
        width: 170,
        height: 75,
        technicalDetails: {
          edgeCaseHandling: 'Stok tidak terpotong (Rollback total), log penolakan disimpan untuk audit loss opportunity.'
        }
      },
      {
        id: 'E2E-4',
        step: '04',
        title: 'ACID Lock & FIFO Deduct',
        type: 'database',
        actor: 'Database (ACID)',
        swimlane: 'database',
        description: 'Eksekusi transaksi database atomik: row-level lock (SELECT FOR UPDATE), potong batch terlama (FIFO), simpan order & buat stock ledger.',
        x: 680,
        y: 190,
        width: 170,
        height: 75,
        technicalDetails: {
          sqlOperation: `BEGIN TRANSACTION;
SELECT * FROM raw_materials WHERE sku IN (...) FOR UPDATE;
UPDATE raw_materials SET current_stock = current_stock - $delta;
INSERT INTO stock_transactions (...);
INSERT INTO orders (...);
COMMIT;`,
          tablesAffected: ['orders', 'order_items', 'raw_materials', 'stock_batches', 'stock_transactions']
        },
        connectedTo: ['E2E-5']
      },
      {
        id: 'E2E-5',
        step: '05',
        title: 'WebSocket Event Broadcast',
        type: 'event',
        actor: 'Backend Engine',
        swimlane: 'realtime',
        description: 'Server memancarkan event real-time ke semua client yang terhubung melalui WebSocket gateway (Redis Pub/Sub).',
        x: 900,
        y: 190,
        width: 170,
        height: 75,
        technicalDetails: {
          wsEvent: 'STOCK_UPDATED & KITCHEN_TICKET_CREATED',
          requestPayload: {
            eventType: "ORDER_PROCESSED",
            orderId: "ORD-9912",
            stockDeltas: [{ sku: "RAW-BERAS-01", delta: -360, unit: "gram" }]
          }
        },
        connectedTo: ['E2E-6A', 'E2E-6B', 'E2E-6C']
      },
      {
        id: 'E2E-6A',
        step: '06a',
        title: 'KDS Dapur: Tiket Masak',
        type: 'process',
        actor: 'Dapur (KDS)',
        swimlane: 'interface',
        description: 'Layar dapur berbunyi dan menampilkan pesanan baru lengkap dengan porsi dan catatan khusus koki.',
        x: 1130,
        y: 60,
        width: 170,
        height: 75,
        technicalDetails: {
          wsEvent: 'KITCHEN_TICKET_CREATED',
          tablesAffected: ['kitchen_tickets']
        }
      },
      {
        id: 'E2E-6B',
        step: '06b',
        title: 'Gudang: Update Stok Riil',
        type: 'process',
        actor: 'Stok & Gudang',
        swimlane: 'interface',
        description: 'Monitor gudang langsung menampilkan sisa stok riil. Jika di bawah ROP (Reorder Point), otomatis memicu draft PO.',
        x: 1130,
        y: 190,
        width: 170,
        height: 75,
        technicalDetails: {
          wsEvent: 'STOCK_UPDATED'
        }
      },
      {
        id: 'E2E-6C',
        step: '06c',
        title: 'Dashboard: Kalkulasi COGS',
        type: 'process',
        actor: 'Dashboard Monitoring',
        swimlane: 'interface',
        description: 'Dashboard manajemen memperbarui nilai HPP (Cost of Goods Sold), margin keuntungan, dan grafik konsumsi bahan hari ini.',
        x: 1130,
        y: 320,
        width: 170,
        height: 75,
        technicalDetails: {
          wsEvent: 'DASHBOARD_METRICS_SYNC'
        }
      }
    ]
  },
  {
    id: 'kasir',
    name: 'Modul 1: Interface Kasir (POS)',
    shortDescription: 'Alur pesanan kasir, dekomposisi recipe BOM, validasi stok multi-item, dan mekanisme void/refund rollback',
    color: 'amber',
    primaryGoal: 'Memastikan kasir tidak bisa menjual item yang bahannya habis dan memotong stok real-time saat transaksi berhasil.',
    nodes: [
      {
        id: 'POS-1',
        step: '01',
        title: 'Pilih Item Menu di POS',
        type: 'io',
        actor: 'Kasir (POS)',
        swimlane: 'interface',
        description: 'Kasir menginput pesanan ke keranjang belanja melalui POS tablet/desktop.',
        x: 40,
        y: 90,
        width: 170,
        height: 75,
        technicalDetails: {
          requestPayload: {
            items: [
              { menuItemId: "MENU-WAGYU-BURGER", quantity: 2, modifier: "Extra Cheese" }
            ]
          }
        },
        connectedTo: ['POS-2']
      },
      {
        id: 'POS-2',
        step: '02',
        title: 'Dekomposisi Resep (BOM)',
        type: 'process',
        actor: 'Backend Engine',
        swimlane: 'backend',
        description: 'Sistem mengambil resep spesifik dari tabel recipe_boms. Misal: 1 Burger = 1 Roti Bun, 150g Patty Wagyu, 20g Saus Spesial, 1 Slice Keju.',
        x: 260,
        y: 90,
        width: 170,
        height: 75,
        technicalDetails: {
          sqlOperation: 'SELECT rb.material_sku, rb.qty_required, rm.current_stock FROM recipe_boms rb JOIN raw_materials rm ON rb.material_sku = rm.sku WHERE rb.menu_item_id = $1;',
          tablesAffected: ['recipe_boms', 'raw_materials']
        },
        connectedTo: ['POS-3']
      },
      {
        id: 'POS-3',
        step: '03',
        title: 'Bahan Baku Cukup?',
        type: 'decision',
        actor: 'Backend Engine',
        swimlane: 'backend',
        description: 'Validasi apakah seluruh komponen bahan baku memenuhi: current_stock >= (qty_required * order_qty).',
        x: 480,
        y: 75,
        width: 140,
        height: 105,
        technicalDetails: {
          concurrencyHandling: 'Memverifikasi snapshot stok terkini sebelum mengunci baris database.'
        },
        decisionBranches: {
          yes: 'POS-4',
          no: 'POS-OUT',
          conditionText: 'Semua bahan cukup?'
        }
      },
      {
        id: 'POS-OUT',
        step: '03-ERR',
        title: 'Alert Out of Stock di POS',
        type: 'process',
        actor: 'Kasir (POS)',
        swimlane: 'interface',
        description: 'Layar kasir menampilkan badge merah: "Bahan Patty Wagyu tersisa 100g (Dibutuhkan 300g)". Menghindari pesanan yang tidak bisa dimasak.',
        x: 465,
        y: 260,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: 'Response 409 Conflict',
          edgeCaseHandling: 'Kasir dapat mengganti pesanan atau merekomendasikan menu sejenis kepada tamu.'
        }
      },
      {
        id: 'POS-4',
        step: '04',
        title: 'Proses Bayar (EDC/QRIS)',
        type: 'io',
        actor: 'Kasir (POS)',
        swimlane: 'interface',
        description: 'Kasir memilih metode pembayaran: QRIS, EDC Kartu, atau Tunai. Sistem menunggu status SUCCESS.',
        x: 700,
        y: 90,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: '/api/v1/orders/checkout',
          httpMethod: 'POST'
        },
        connectedTo: ['POS-5']
      },
      {
        id: 'POS-5',
        step: '05',
        title: 'Atomic Stock Deduct (ACID)',
        type: 'database',
        actor: 'Database (ACID)',
        swimlane: 'database',
        description: 'Membuka DB Transaction, mengunci baris bahan (SELECT FOR UPDATE), mengurangi stok di tabel raw_materials, dan mencatat transaksi OUT_SALE.',
        x: 920,
        y: 90,
        width: 170,
        height: 75,
        technicalDetails: {
          sqlOperation: `BEGIN;
UPDATE raw_materials SET current_stock = current_stock - $qty WHERE sku = $sku;
INSERT INTO stock_transactions (type, material_sku, qty_delta, reference_doc) VALUES ('OUT_SALE', $sku, -$qty, $orderId);
INSERT INTO orders (...);
COMMIT;`,
          tablesAffected: ['raw_materials', 'stock_transactions', 'orders', 'order_items']
        },
        connectedTo: ['POS-6']
      },
      {
        id: 'POS-6',
        step: '06',
        title: 'Kirim Event KDS & WS',
        type: 'event',
        actor: 'Backend Engine',
        swimlane: 'realtime',
        description: 'Tiket antrean dapur diterbitkan dan event WebSocket KITCHEN_TICKET_CREATED dan STOCK_UPDATED ditembakkan ke seluruh sistem.',
        x: 920,
        y: 250,
        width: 170,
        height: 75,
        technicalDetails: {
          wsEvent: 'KITCHEN_TICKET_CREATED'
        },
        connectedTo: ['POS-7']
      },
      {
        id: 'POS-7',
        step: '07',
        title: 'Cetak Struk & Selesai',
        type: 'start_end',
        actor: 'Kasir (POS)',
        swimlane: 'interface',
        description: 'Struk bukti transaksi dicetak ke printer thermal, antrean kasir kembali siap melayani pelanggan berikutnya.',
        x: 700,
        y: 250,
        width: 170,
        height: 75,
        technicalDetails: {
          edgeCaseHandling: 'Jika terjadi VOID pesanan setelah checkout: Trigger API /orders/{id}/void -> membalikkan mutasi stok dengan transaksi bertipe VOID_ROLLBACK.'
        }
      }
    ]
  },
  {
    id: 'dapur',
    name: 'Modul 2: Interface Dapur (KDS & Waste)',
    shortDescription: 'Manajemen tiket masak pesanan, kontrol durasi persiapan, dan pencatatan bahan rusak/terbuang (Kitchen Waste)',
    color: 'rose',
    primaryGoal: 'Sinkronisasi status saji ke kasir dan pencatatan bahan bocor/rusak/gosong secara instan agar stok akurat.',
    nodes: [
      {
        id: 'KDS-1',
        step: '01',
        title: 'Terima Tiket Pesanan Baru',
        type: 'event',
        actor: 'Dapur (KDS)',
        swimlane: 'interface',
        description: 'Tiket pesanan otomatis muncul di layar sentuh dapur disertai sinyal audio berbunyi ting-ting.',
        x: 40,
        y: 100,
        width: 170,
        height: 75,
        technicalDetails: {
          wsEvent: 'KITCHEN_TICKET_CREATED',
          requestPayload: {
            ticketId: "TKT-890",
            orderNumber: "ORD-2026-104",
            tableNumber: "T-04",
            items: [{ name: "Nasi Goreng Wagyu", qty: 2, notes: "Pedas Sedang, Tanpa Bawang Goreng" }]
          }
        },
        connectedTo: ['KDS-2']
      },
      {
        id: 'KDS-2',
        step: '02',
        title: 'Koki: Mulai Memasak',
        type: 'process',
        actor: 'Dapur (KDS)',
        swimlane: 'interface',
        description: 'Status tiket berubah menjadi COOKING. Timer countdown mulai berjalan untuk mengukur Service Level Agreement (SLA).',
        x: 250,
        y: 100,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: '/api/v1/kitchen/tickets/{id}/status',
          httpMethod: 'PATCH',
          requestPayload: { status: "COOKING" }
        },
        connectedTo: ['KDS-3']
      },
      {
        id: 'KDS-3',
        step: '03',
        title: 'Ada Bahan Rusak/Waste?',
        type: 'decision',
        actor: 'Dapur (KDS)',
        swimlane: 'interface',
        description: 'Saat proses memasak, apakah terjadi insiden seperti telur busuk, daging gosong, kuah tumpah, atau bahan kadaluarsa?',
        x: 470,
        y: 85,
        width: 140,
        height: 105,
        technicalDetails: {
          edgeCaseHandling: 'Waste di dapur adalah sumber varians persediaan terbesar (60-80% restoran bocor di area ini tanpa sistem KDS waste).'
        },
        decisionBranches: {
          yes: 'KDS-WASTE',
          no: 'KDS-SERVED',
          conditionText: 'Ada insiden waste?'
        }
      },
      {
        id: 'KDS-WASTE',
        step: '03-LOG',
        title: 'Input Waste Bahan di KDS',
        type: 'io',
        actor: 'Dapur (KDS)',
        swimlane: 'interface',
        description: 'Koki menekan tombol "Catat Waste Bahan", memilih bahan baku yang terbuang (misal: Telur Ayam 2 Butir), dan memilih alasan (BURNT_COOKING / DROPPED_SPILL).',
        x: 455,
        y: 260,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: '/api/v1/kitchen/waste',
          httpMethod: 'POST',
          requestPayload: {
            materialSku: "RAW-TELUR-01",
            quantity: 2,
            reason: "BURNT_COOKING",
            notes: "Api terlalu besar saat menumis batch 2"
          }
        },
        connectedTo: ['KDS-DED']
      },
      {
        id: 'KDS-DED',
        step: '03-DB',
        title: 'Potong Stok & Catat Rugi HPP',
        type: 'database',
        actor: 'Database (ACID)',
        swimlane: 'database',
        description: 'Stok fisik telur langsung dipotong 2 butir dengan transaksi bertipe OUT_WASTE. Biaya bahan masuk ke pos akun kerugian operasional dapur.',
        x: 680,
        y: 260,
        width: 170,
        height: 75,
        technicalDetails: {
          sqlOperation: `INSERT INTO kitchen_waste_logs (...);
UPDATE raw_materials SET current_stock = current_stock - $wasteQty WHERE sku = $sku;
INSERT INTO stock_transactions (type, material_sku, qty_delta, reference_doc) VALUES ('OUT_WASTE', $sku, -$wasteQty, $wasteLogId);`,
          tablesAffected: ['kitchen_waste_logs', 'raw_materials', 'stock_transactions']
        },
        connectedTo: ['KDS-SERVED']
      },
      {
        id: 'KDS-SERVED',
        step: '04',
        title: 'Pesanan Selesai (Mark READY)',
        type: 'process',
        actor: 'Dapur (KDS)',
        swimlane: 'interface',
        description: 'Koki menekan tombol "Pesanan Selesai / Siap Antar". Notifikasi dikirimkan ke pramusaji/runner.',
        x: 680,
        y: 100,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: '/api/v1/kitchen/tickets/{id}/status',
          httpMethod: 'PATCH',
          requestPayload: { status: "READY" },
          wsEvent: 'ORDER_READY_FOR_PICKUP'
        },
        connectedTo: ['KDS-5']
      },
      {
        id: 'KDS-5',
        step: '05',
        title: 'Saji ke Meja Tamu',
        type: 'start_end',
        actor: 'Dapur (KDS)',
        swimlane: 'interface',
        description: 'Pramusaji mengambil makanan, mengonfirmasi di sistem runner, dan menyajikan ke meja tamu.',
        x: 910,
        y: 100,
        width: 170,
        height: 75,
        technicalDetails: {
          tablesAffected: ['orders', 'kitchen_tickets']
        }
      }
    ]
  },
  {
    id: 'gudang',
    name: 'Modul 3: Interface Stok & Gudang',
    shortDescription: 'Penerimaan barang (Goods In / PO), pengelolaan batch FIFO & tanggal kadaluarsa, serta stock opname periodik',
    color: 'blue',
    primaryGoal: 'Mengatur mutasi masuk (IN) secara presisi, melacak kedaluwarsa bahan, dan menyelesaikan selisih opname fisik vs sistem.',
    nodes: [
      {
        id: 'WH-1',
        step: '01',
        title: 'Barang Tiba dari Supplier',
        type: 'io',
        actor: 'Stok & Gudang',
        swimlane: 'interface',
        description: 'Truk pengiriman supplier tiba di dermaga restoran membawa bahan baku sesuai Purchase Order (PO).',
        x: 40,
        y: 90,
        width: 170,
        height: 75,
        technicalDetails: {
          requestPayload: {
            poNumber: "PO-2026-OCT-091",
            supplierName: "PT Sumber Pangan Prima"
          }
        },
        connectedTo: ['WH-2']
      },
      {
        id: 'WH-2',
        step: '02',
        title: 'QC & Pengecekan Fisik',
        type: 'process',
        actor: 'Stok & Gudang',
        swimlane: 'interface',
        description: 'Staff gudang memeriksa temperatur (chilled/frozen), kondisi kemasan, berat riil timbangan, dan tanggal kadaluarsa produk.',
        x: 250,
        y: 90,
        width: 170,
        height: 75,
        technicalDetails: {
          edgeCaseHandling: 'Jika barang rusak atau tidak sesuai spesifikasi: Dibuat dokumen Retur Pengembalian (Goods Return) sebelum barang masuk sistem.'
        },
        connectedTo: ['WH-3']
      },
      {
        id: 'WH-3',
        step: '03',
        title: 'Input Goods In & Batch FEFO',
        type: 'io',
        actor: 'Stok & Gudang',
        swimlane: 'interface',
        description: 'Staff menginput data faktur penerimaan barang: Nomor Batch, Qty Diterima, Harga Beli per Unit, dan Expired Date.',
        x: 460,
        y: 90,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: '/api/v1/inventory/goods-in',
          httpMethod: 'POST',
          requestPayload: {
            poNumber: "PO-2026-OCT-091",
            items: [
              { materialSku: "RAW-BERAS-01", batchNo: "BATCH-BRS-261014", qty: 50, unitCost: 14500, expiryDate: "2027-04-14" },
              { materialSku: "RAW-TELUR-01", batchNo: "BATCH-TLR-261014", qty: 100, unitCost: 2000, expiryDate: "2026-10-28" }
            ]
          }
        },
        connectedTo: ['WH-4']
      },
      {
        id: 'WH-4',
        step: '04',
        title: 'DB Mutasi IN & Average Cost',
        type: 'database',
        actor: 'Database (ACID)',
        swimlane: 'database',
        description: 'Sistem mencatat batch baru di stock_batches, menambahkan current_stock, mencatat transaksi IN_PURCHASE, dan memperbarui harga pokok rata-rata.',
        x: 670,
        y: 90,
        width: 170,
        height: 75,
        technicalDetails: {
          sqlOperation: `BEGIN;
INSERT INTO stock_batches (material_sku, batch_no, qty_received, qty_remaining, expiry_date, purchase_cost) VALUES (...);
UPDATE raw_materials SET current_stock = current_stock + $qty, unit_cost = $newWeightedAverage WHERE sku = $sku;
INSERT INTO stock_transactions (type, material_sku, qty_delta, balance_after, reference_doc) VALUES ('IN_PURCHASE', ...);
COMMIT;`,
          tablesAffected: ['stock_batches', 'raw_materials', 'stock_transactions']
        },
        connectedTo: ['WH-5']
      },
      {
        id: 'WH-5',
        step: '05',
        title: 'Penataan Rak Chiller/Dry',
        type: 'process',
        actor: 'Stok & Gudang',
        swimlane: 'interface',
        description: 'Bahan ditempatkan sesuai prinsip First-Expired First-Out (FEFO), bahan terlama di baris depan agar dipakai koki terlebih dahulu.',
        x: 880,
        y: 90,
        width: 170,
        height: 75,
        technicalDetails: {
          wsEvent: 'STOCK_UPDATED'
        },
        connectedTo: ['WH-6']
      },
      {
        id: 'WH-6',
        step: '06',
        title: 'Stock Opname Fisik Rutin',
        type: 'process',
        actor: 'Stok & Gudang',
        swimlane: 'interface',
        description: 'Staff menghitung fisik riil bahan baku di rak dan memasukkan angka hasil perhitungan ke form Stock Opname.',
        x: 880,
        y: 250,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: '/api/v1/inventory/stock-opname',
          httpMethod: 'POST',
          requestPayload: {
            countedItems: [
              { materialSku: "RAW-BERAS-01", physicalCount: 48.5, theoreticalStock: 50.0, variance: -1.5 }
            ]
          }
        },
        connectedTo: ['WH-7']
      },
      {
        id: 'WH-7',
        step: '07',
        title: 'Rekonsiliasi Varians Saldo',
        type: 'start_end',
        actor: 'Database (ACID)',
        swimlane: 'database',
        description: 'Jika ada selisih, sistem membuat entri ADJUSTMENT_OPNAME. Varians dicatat sebagai penyusutan atau potensi kebocoran dapur.',
        x: 670,
        y: 250,
        width: 170,
        height: 75,
        technicalDetails: {
          sqlOperation: 'UPDATE raw_materials SET current_stock = $physicalCount; INSERT INTO stock_transactions (type = "ADJUSTMENT_OPNAME", ...);',
          tablesAffected: ['raw_materials', 'stock_transactions', 'inventory_audits']
        }
      }
    ]
  },
  {
    id: 'dashboard',
    name: 'Modul 4: Dashboard Monitoring & Alerting',
    shortDescription: 'Monitoring level stok real-time, alert safety stock & ROP, kalkulasi HPP harian, dan analitik varians bahan',
    color: 'violet',
    primaryGoal: 'Memberikan transparansi visibilitas penuh kepada pemilik restoran/manajemen atas kebocoran stok dan kesehatan rantai pasok.',
    nodes: [
      {
        id: 'DSH-1',
        step: '01',
        title: 'Listener Event Bus Real-Time',
        type: 'event',
        actor: 'Dashboard Monitoring',
        swimlane: 'realtime',
        description: 'Dashboard membuka koneksi WebSocket permanen ke backend stream (/ws/inventory-stream).',
        x: 40,
        y: 120,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: '/ws/inventory-stream',
          httpMethod: 'WS',
          wsEvent: 'CONNECTION_ESTABLISHED'
        },
        connectedTo: ['DSH-2']
      },
      {
        id: 'DSH-2',
        step: '02',
        title: 'Terima Payload Mutasi Stok',
        type: 'process',
        actor: 'Dashboard Monitoring',
        swimlane: 'interface',
        description: 'Setiap kali ada order di kasir, waste di dapur, atau barang masuk di gudang, metrik dashboard langsung berkedip update tanpa reload browser.',
        x: 250,
        y: 120,
        width: 170,
        height: 75,
        technicalDetails: {
          wsEvent: 'STOCK_DELTA_EVENT'
        },
        connectedTo: ['DSH-3']
      },
      {
        id: 'DSH-3',
        step: '03',
        title: 'Stok <= ROP Threshold?',
        type: 'decision',
        actor: 'Backend Engine',
        swimlane: 'backend',
        description: 'Sistem membandingkan sisa stok bahan baku dengan Reorder Point (ROP = Lead Time Demand + Safety Stock).',
        x: 470,
        y: 105,
        width: 140,
        height: 105,
        technicalDetails: {
          concurrencyHandling: 'Evaluasi dilakukan di tingkat worker asinkron agar tidak membebani latency kasir.'
        },
        decisionBranches: {
          yes: 'DSH-ALERT',
          no: 'DSH-OK',
          conditionText: 'Stok <= ROP?'
        }
      },
      {
        id: 'DSH-ALERT',
        step: '03-WARN',
        title: 'Alert ROP & Draft Reorder PO',
        type: 'event',
        actor: 'Dashboard Monitoring',
        swimlane: 'interface',
        description: 'Lampu indikator merah menyala, notifikasi push dikirim ke manajer pengadaan: "Stok Telur tersisa 18 butir (Safety Level: 30 butir)".',
        x: 455,
        y: 280,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: '/api/v1/inventory/alerts',
          wsEvent: 'ALERT_SAFETY_STOCK_BREACH',
          edgeCaseHandling: 'Otomatis membuat draft Purchase Requisition ke supplier langganan dengan estimasi lead time 2 hari.'
        },
        connectedTo: ['DSH-4']
      },
      {
        id: 'DSH-OK',
        step: '03-PASS',
        title: 'Stok Aman (Optimal Level)',
        type: 'process',
        actor: 'Dashboard Monitoring',
        swimlane: 'interface',
        description: 'Bahan berada di batas aman. Warna indikator hijau stabil.',
        x: 680,
        y: 120,
        width: 170,
        height: 75,
        technicalDetails: {
          concurrencyHandling: 'Evaluasi threshold dilakukan secara non-blocking di background stream listener.'
        },
        connectedTo: ['DSH-4']
      },
      {
        id: 'DSH-4',
        step: '04',
        title: 'Kalkulasi Real-time COGS',
        type: 'process',
        actor: 'Dashboard Monitoring',
        swimlane: 'interface',
        description: 'Sistem menghitung rasio Food Cost: (Total Pemakaian Bahan + Total Waste Dapur) / Total Omset Penjualan Kasir * 100%.',
        x: 890,
        y: 120,
        width: 170,
        height: 75,
        technicalDetails: {
          apiEndpoint: '/api/v1/reports/cogs-variance',
          httpMethod: 'GET',
          sqlOperation: 'SELECT SUM(cogs_amount) as total_cogs, SUM(total_amount) as revenue FROM orders WHERE created_at >= CURRENT_DATE;'
        },
        connectedTo: ['DSH-5']
      },
      {
        id: 'DSH-5',
        step: '05',
        title: 'Visualisasi Gap Varians',
        type: 'start_end',
        actor: 'Dashboard Monitoring',
        swimlane: 'interface',
        description: 'Menampilkan grafik audit selisih bahan. Jika varians melebihi batas toleransi 2%, sistem menyoroti potensi kebocoran porsi atau pencurian bahan.',
        x: 1100,
        y: 120,
        width: 170,
        height: 75,
        technicalDetails: {
          tablesAffected: ['inventory_audits', 'stock_transactions']
        }
      }
    ]
  }
];
