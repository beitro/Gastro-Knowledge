import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  ChefHat,
  Database,
  Radio,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Server,
  Zap,
  Flame,
  Truck,
  Car,
  Bot,
  Box,
  Layers,
  ShoppingBag,
  CreditCard,
  Wifi,
  Scan,
  Sparkles
} from 'lucide-react';

export type VisualWorkflowType =
  | 'american_service'
  | 'french_service'
  | 'russian_service'
  | 'english_service'
  | 'counter_qsr'
  | 'cafeteria_line'
  | 'buffet_ayce'
  | 'conveyor_kaiten'
  | 'shinkansen_robot'
  | 'smart_locker'
  | 'qr_pwa'
  | 'drive_thru'
  | 'carhop_bay'
  | 'omakase'
  | 'food_court'
  | 'cloud_kitchen';

interface SlideWorkflowVisualizerProps {
  workflowType: VisualWorkflowType;
  title: string;
  badge: string;
}

interface StepConfig {
  number: number;
  label: string;
  sourceNode: string;
  targetNode: string;
  actionText: string;
  packetPayload: string;
  protocolBadge: string;
  deviceState: string;
  dbEffect: string;
}

export const SlideWorkflowVisualizer: React.FC<SlideWorkflowVisualizerProps> = ({
  workflowType,
  title,
  badge
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Define 5 animated steps per workflow type
  const stepsMap: Record<VisualWorkflowType, StepConfig[]> = {
    american_service: [
      {
        number: 1,
        label: 'Tamu Duduk & Buka Sesi Meja',
        sourceNode: 'Tamu Meja',
        targetNode: 'Hostess POS',
        actionText: 'Hostess memilih meja T-04 di floor map, mengisi 3 pax, meja berubah OCCUPIED.',
        packetPayload: 'PATCH /api/v1/tables/T-04 { "status": "OCCUPIED", "pax": 3 }',
        protocolBadge: 'REST HTTPS',
        deviceState: 'Meja T-04 menyala kuning di floor plan',
        dbEffect: 'INSERT INTO table_sessions (table_id, seated_at) VALUES ("T-04", NOW())'
      },
      {
        number: 2,
        label: 'Waiter Input Order & Coursing',
        sourceNode: 'Tablet Waiter',
        targetNode: 'KDS Stasiun Dapur',
        actionText: 'Waiter memilih Starter (Sup Jamur) & Main (Wagyu Steak). Validasi stok otomatis lolos.',
        packetPayload: 'POST /api/v1/orders { "items": [{ "sku": "SUP", "course": "STARTER" }, { "sku": "WAGYU", "course": "MAIN" }] }',
        protocolBadge: 'WebSocket WSS',
        deviceState: 'Tablet waiter bergetar konfirmasi, stok Wagyu reservasi -1 porsi',
        dbEffect: 'SELECT stock_qty FROM inventory WHERE id = ? FOR UPDATE'
      },
      {
        number: 3,
        label: 'Starter Dimasak, Main Course Ditahan (HELD)',
        sourceNode: 'KDS Expo Dapur',
        targetNode: 'Stasiun Grill / Wok',
        actionText: 'Tiket Starter berstatus COOKING dengan timer 8 menit. Tiket Main ditahan dengan tag HELD.',
        packetPayload: 'EVENT KDS_TICKET_SPLIT { "starter": "COOKING", "main": "HELD" }',
        protocolBadge: 'Redis Pub/Sub',
        deviceState: 'Layar KDS Dapur berbunyi lonceng "ting!", timer mulai berjalan',
        dbEffect: 'UPDATE order_items SET status = "cooking" WHERE course = "STARTER"'
      },
      {
        number: 4,
        label: 'Waiter Kirim Sinyal "Fire Mains"',
        sourceNode: 'Tablet Waiter',
        targetNode: 'KDS Grill Master',
        actionText: 'Saat piring starter diangkat, waiter menekan tombol "Fire Mains". Tiket steak aktif seketika.',
        packetPayload: 'POST /api/v1/orders/12/fire-course { "course": "MAIN" }',
        protocolBadge: 'WSS <150ms',
        deviceState: 'Layar KDS Grill berkedip merah memanggil chef menyalakan panggangan',
        dbEffect: 'UPDATE order_items SET status = "fired", fired_at = NOW() WHERE course = "MAIN"'
      },
      {
        number: 5,
        label: 'Plating di Expo & Kasir Settle',
        sourceNode: 'KDS Pass Dapur',
        targetNode: 'Kasir POS Utama',
        actionText: 'Chef menekan tombol Ready, runner menyajikan ke meja dari sisi kiri, kasir cetak bill.',
        packetPayload: 'POST /api/v1/orders/12/checkout { "method": "EDC_WIRELESS" }',
        protocolBadge: 'ACID COMMIT',
        deviceState: 'Printer 80mm cetak struk kasir, meja T-04 kembali VACANT hijau',
        dbEffect: 'UPDATE inventory SET stock_qty = stock_qty - 0.2 WHERE sku = "BEEF-WAGYU"'
      }
    ],

    french_service: [
      {
        number: 1,
        label: 'Dapur Par-Cook Daging 60%',
        sourceNode: 'Dapur Utama',
        targetNode: 'Troli Gueridon',
        actionText: 'Dapur memanggang Chateaubriand 60% matang, ditaruh di nampan pemanas troli meja dorong.',
        packetPayload: 'POST /api/v1/kitchen/gueridon-prep { "item": "CHATEAUBRIAND", "par_cook": 0.6 }',
        protocolBadge: 'REST HTTPS',
        deviceState: 'KDS Dapur mengonfirmasi baki siap dijemput Chef de Rang',
        dbEffect: 'UPDATE inventory SET reserved_qty = reserved_qty + 0.45 WHERE sku = "TENDERLOIN"'
      },
      {
        number: 2,
        label: 'Troli Gueridon Merapat ke Samping Meja',
        sourceNode: 'Chef de Rang',
        targetNode: 'Meja Tamu VIP',
        actionText: 'Troli ber-kompor gas butana portabel diposisikan di samping kanan meja tamu.',
        packetPayload: 'PATCH /api/v1/tables/VIP-01 { "service_state": "TABLESIDE_ACTIVE" }',
        protocolBadge: 'WebSocket WSS',
        deviceState: 'Tablet sommelier menampilkan checklist keselamatan api flambé',
        dbEffect: 'UPDATE tables SET active_service_mode = "FRENCH_GUERIDON"'
      },
      {
        number: 3,
        label: 'Penimbangan Truffle Presisi via Bluetooth',
        sourceNode: 'Timbangan BLE',
        targetNode: 'Tablet Kapten',
        actionText: 'Chef menimbang irisan black truffle (4.2 gram) di timbangan digital Bluetooth BLE.',
        packetPayload: 'BLE_NOTIFY { "scale_uuid": "BLE-SCALE-01", "weight_g": 4.2 }',
        protocolBadge: 'Web Bluetooth BLE',
        deviceState: 'Angka 4.2g terisi otomatis di layar tablet tanpa ketik manual',
        dbEffect: 'INSERT INTO item_customizations (gram_weight, cost_allocated) VALUES (4.2, 84000)'
      },
      {
        number: 4,
        label: 'Atraksi Flambé & Tuang Spirit Cognac',
        sourceNode: 'Chef de Rang',
        targetNode: 'Wajan Gueridon',
        actionText: 'Chef menuang 60ml Martell VSOP ke wajan panas, menyulut api flambé di hadapan tamu.',
        packetPayload: 'POST /api/v1/inventory/liquor-pour { "bottle_id": "COG-01", "pour_ml": 60 }',
        protocolBadge: 'HTTPS REST',
        deviceState: 'Botol Cognac berkurang 60ml di database cellar botol berseri',
        dbEffect: 'UPDATE serialized_bottles SET remaining_ml = remaining_ml - 60 WHERE id = "COG-01"'
      },
      {
        number: 5,
        label: 'Penyajian Piring Hangat & Settle Bill',
        sourceNode: 'Commis Waiter',
        targetNode: 'Meja Tamu & Kasir',
        actionText: 'Daging dipindahkan ke piring porselen hangat dengan saus reduksi cognac, nota di-settle.',
        packetPayload: 'POST /api/v1/orders/vip-settle { "paid": true }',
        protocolBadge: 'ACID COMMIT',
        deviceState: 'Struk cetak rincian degustasi gourmet, meja kembali bersih',
        dbEffect: 'COMMIT TRANSACTION: Deduct daging, cognac ml, dan truffle g'
      }
    ],

    russian_service: [
      {
        number: 1,
        label: 'BEO (Banquet Event Order) Diverifikasi',
        sourceNode: 'Banquet Hostess',
        targetNode: 'Master Banquet POS',
        actionText: 'Panitia verifikasi 20 meja banquet (masing-masing 10 pax = 200 pax terdaftar).',
        packetPayload: 'POST /api/v1/banquet/events/GALA-01/confirm { "total_pax": 200 }',
        protocolBadge: 'REST HTTPS',
        deviceState: 'Layar banquet mengunci alokasi 20 baki nampan perak',
        dbEffect: 'LOCK TABLES banquet_allocations IN EXCLUSIVE MODE'
      },
      {
        number: 2,
        label: 'Batch Plating di Baki Perak Besar',
        sourceNode: 'Kitchen Banquet',
        targetNode: 'Silver Platter #08',
        actionText: 'Koki menata 10 porsi Roast Beef di atas 1 nampan perak besar bertutup cloche pemanas.',
        packetPayload: 'POST /api/v1/kitchen/platters { "platter_id": "PLT-08", "portions": 10 }',
        protocolBadge: 'ESC/POS TCP 9100',
        deviceState: 'Label barcode baki tercetak di pass dapur untuk verifikasi meja #08',
        dbEffect: 'UPDATE inventory SET stock_qty = stock_qty - 2.5 WHERE sku = "BEEF-ROAST"'
      },
      {
        number: 3,
        label: 'Penyajian Menggunakan Jepitan Perak',
        sourceNode: 'Silver Service Waiter',
        targetNode: 'Meja Tamu Bundar',
        actionText: 'Waiter membawa baki di tangan kiri, memindahkan daging ke piring tamu dengan sendok-garpu.',
        packetPayload: 'EVENT TABLE_SERVED { "table": "T-08", "portions_dropped": 10 }',
        protocolBadge: 'WebSocket WSS',
        deviceState: 'Layar banquet supervisor menandai Meja #08 hijau terlayani',
        dbEffect: 'UPDATE banquet_table_status SET status = "SERVED" WHERE table_id = "T-08"'
      },
      {
        number: 4,
        label: 'Penawaran Porsi Tambahan (Second Helping)',
        sourceNode: 'Waiter Baki',
        targetNode: 'Tamu Meja',
        actionText: 'Waiter mengelilingi meja menawarkan sisa porsi hangat langsung dari baki nampan perak.',
        packetPayload: 'POST /api/v1/banquet/log-second-helping { "table": "T-08", "extra_portions": 2 }',
        protocolBadge: 'REST HTTPS',
        deviceState: 'Porsi tambahan tercatat untuk laporan konsumsi aktual',
        dbEffect: 'UPDATE banquet_consumption SET extra_portions = extra_portions + 2'
      },
      {
        number: 5,
        label: 'Rekonsiliasi BEO & Tutup Event',
        sourceNode: 'Kasir Banquet',
        targetNode: 'ERP Akuntansi',
        actionText: 'Sistem mencocokkan jaminan 200 pax vs 212 pax hadir riil untuk penerbitan invoice pelunasan.',
        packetPayload: 'POST /api/v1/banquet/settlement { "final_pax": 212, "overage": 12 }',
        protocolBadge: 'ACID COMMIT',
        deviceState: 'Invoice korporat diterbitkan, persentase yield variance tercatat otomatis',
        dbEffect: 'INSERT INTO corporate_invoices (event_id, amount_due) VALUES ("GALA-01", 74200000)'
      }
    ],

    english_service: [
      {
        number: 1,
        label: 'Pemesanan Porsi Sharing & Meja Putar',
        sourceNode: 'Pramusaji POS',
        targetNode: 'Meja Putar (Lazy Susan)',
        actionText: 'Tamu memesan Gurame Asam Manis Large, Kepiting Saus Padang 1.2kg, dan 2 Bakul Nasi.',
        packetPayload: 'POST /api/v1/orders/family { "table": "ROUND-08", "communal": true }',
        protocolBadge: 'WebSocket WSS',
        deviceState: 'Meja bundar #08 diset status shared communal dining',
        dbEffect: 'INSERT INTO orders (table_id, is_communal_sharing) VALUES ("ROUND-08", TRUE)'
      },
      {
        number: 2,
        label: 'Timbang Ikan Hidup via Serial RS232',
        sourceNode: 'Timbangan Akuarium',
        targetNode: 'Tablet Waiter POS',
        actionText: 'Staf menimbang ikan hidup di akuarium (840g). Bobot terbaca otomatis di POS via RS232.',
        packetPayload: 'SERIAL_READ_RS232 { "baud": 9600, "weight_g": 840, "sku": "IKAN-GURAME" }',
        protocolBadge: 'Serial RS232',
        deviceState: 'Harga terhitung otomatis: 840g x Rp 19.500/100g = Rp 163.800',
        dbEffect: 'UPDATE aquarium_stock SET live_weight_kg = live_weight_kg - 0.84'
      },
      {
        number: 3,
        label: 'KDS Synchronous Drop (Tag COMMUNAL_SYNC)',
        sourceNode: 'KDS Stasiun Wok',
        targetNode: 'KDS Stasiun Fryer',
        actionText: 'KDS menyamakan waktu masak agar ikan goreng, kepiting, dan sayur matang serentak.',
        packetPayload: 'EVENT KDS_SYNC_FIRE { "rule": "COMMUNAL_SYNC", "lead_time_min": 14 }',
        protocolBadge: 'Redis Pub/Sub',
        deviceState: 'Wajan sayur ditahan 6 menit agar tidak dingin menunggu ikan selesai digoreng',
        dbEffect: 'UPDATE kitchen_tickets SET sync_group_id = "GRP-881" WHERE order_id = 901'
      },
      {
        number: 4,
        label: 'Penyajian Mangkuk di Meja Putar',
        sourceNode: 'Food Runner',
        targetNode: 'Pusat Meja Lazy Susan',
        actionText: 'Seluruh hidangan ditaruh di atas kaca putar tengah meja. Tamu memutar meja dan mengambil sendiri.',
        packetPayload: 'POST /api/v1/orders/901/served { "dishes_count": 5 }',
        protocolBadge: 'WSS <150ms',
        deviceState: 'Status meja berubah menjadi ACTIVE_COMMUNAL_DINING',
        dbEffect: 'UPDATE orders SET status = "served" WHERE id = 901'
      },
      {
        number: 5,
        label: 'Tombol Panggil Refill & Single Check Settle',
        sourceNode: 'Tombol RF 433MHz',
        targetNode: 'Smartwatch Waiter',
        actionText: 'Tamu menekan tombol "Water/Refill" di meja, jam tangan pelayan bergetar. Tagihan dilunasi kepala keluarga.',
        packetPayload: 'RF_PACKET_433MHZ { "table_code": 8, "button": "BILL" }',
        protocolBadge: 'RF 433MHz / Zigbee',
        deviceState: 'Kasir menerima panggilan cetak bill, stok bumbu dan ikan dikurangi permanen',
        dbEffect: 'COMMIT: Potong 840g ikan, 150ml saus asam manis, 2 porsi nasi bakul'
      }
    ],

    counter_qsr: [
      {
        number: 1,
        label: 'Pilih Menu Paket di Kasir POS',
        sourceNode: 'Pelanggan',
        targetNode: 'Dual-Screen Kasir POS',
        actionText: 'Kasir menginput Paket Combo Burger + Kentang + Soda. Layar tamu (CFD) menampilkan total belanja.',
        packetPayload: 'POST /api/v1/counter/order-cart { "combo_sku": "CMB-BURGER-01" }',
        protocolBadge: 'REST HTTPS',
        deviceState: 'Layar CFD tamu menampilkan QRIS Dinamis dan rincian item',
        dbEffect: 'SELECT stock_qty FROM ingredients WHERE sku IN ("BUN", "PATTY", "FRIES") FOR UPDATE'
      },
      {
        number: 2,
        label: 'Bayar di Muka (Pay First Instant)',
        sourceNode: 'HP Tamu (QRIS)',
        targetNode: 'Payment Gateway',
        actionText: 'Tamu scan QRIS di layar kasir. Webhook mengonfirmasi dana masuk dalam 1.2 detik.',
        packetPayload: 'WEBHOOK PAYMENT_SETTLED { "amount": 58000, "order_id": "QSR-441" }',
        protocolBadge: 'HTTPS Webhook',
        deviceState: 'Kasir berbunyi "Payment Approved", tiket langsung lompat ke layar dapur',
        dbEffect: 'UPDATE orders SET payment_status = "PAID", paid_at = NOW() WHERE id = "QSR-441"'
      },
      {
        number: 3,
        label: 'Pairing Pager Buzzer RF 433MHz',
        sourceNode: 'Kasir POS',
        targetNode: 'Pager Buzzer #12',
        actionText: 'Kasir men-tap Pager #12 ke dock pembaca RFID, mengaitkan nomor pager ke order QSR-441.',
        packetPayload: 'SERIAL_TX /dev/ttyUSB0 { "cmd": "PAIR", "buzzer": 12, "order": "QSR-441" }',
        protocolBadge: 'Serial RS232 / USB',
        deviceState: 'Pager #12 berkedip biru menandakan telah terpasang dengan pesanan tamu',
        dbEffect: 'INSERT INTO active_pagers (buzzer_id, order_id) VALUES (12, "QSR-441")'
      },
      {
        number: 4,
        label: 'Dapur Selesai & Trigger Pager Bergetar',
        sourceNode: 'KDS Expo Dapur',
        targetNode: 'Transmitter RF Base',
        actionText: 'Packager selesai menaruh burger di nampan, menekan "Page Guest". Transmitter RF memancarkan sinyal getar.',
        packetPayload: 'RF_TRANSMIT { "freq": "433.92MHz", "target_pager": 12, "vibrate_sec": 30 }',
        protocolBadge: 'RF 433MHz Radio',
        deviceState: 'Pager #12 di tangan tamu bergetar kuat, berbunyi beep-beep, dan menyala merah',
        dbEffect: 'UPDATE orders SET status = "READY_FOR_PICKUP" WHERE id = "QSR-441"'
      },
      {
        number: 5,
        label: 'Tamu Ambil Nampan & Pager Dikembalikan',
        sourceNode: 'Pelanggan',
        targetNode: 'Pick-Up Counter',
        actionText: 'Tamu menukar pager #12 dengan nampan makanan. Pager ditaruh kembali di dock charging baterai.',
        packetPayload: 'PATCH /api/v1/orders/QSR-441/complete { "pager_returned": true }',
        protocolBadge: 'WSS Stream',
        deviceState: 'Nomor antrean di TV monitor berpindah ke kolom "Telah Diambil", siklus selesai',
        dbEffect: 'DELETE FROM active_pagers WHERE buzzer_id = 12; COMMIT INVENTORY'
      }
    ],

    cafeteria_line: [
      {
        number: 1,
        label: 'Ambil Nampan di Awal Rel Stainless',
        sourceNode: 'Karyawan',
        targetNode: 'Awal Lintasan Rel',
        actionText: 'Tamu mengambil nampan plastik dan menyusuri rel pipa stainless steel sepanjang 12 meter.',
        packetPayload: 'EVENT FOOTFALL_IN { "line_id": "LANE-01" }',
        protocolBadge: 'IoT Sensor',
        deviceState: 'Sensor gerak mencatat 1 antrean baru di garis nampan',
        dbEffect: 'INSERT INTO line_traffic (lane_id, timestamp) VALUES ("LANE-01", NOW())'
      },
      {
        number: 2,
        label: 'Pilih Lauk di Etalase Hot Bain-Marie',
        sourceNode: 'Staf Etalase',
        targetNode: 'Nampan Tamu',
        actionText: 'Staf menyendokkan nasi, rendang daging, dan sup sayur dari loyang pemanas ke piring tamu.',
        packetPayload: 'MQTT_PUB /haccp/bainmarie/temp { "pan_id": "PAN-RENDANG", "temp_c": 68.2 }',
        protocolBadge: 'MQTT over TLS',
        deviceState: 'Sensor IoT memastikan suhu makanan terjaga hangat >65°C sesuai standar HACCP',
        dbEffect: 'UPDATE pan_inventory SET estimated_portions_left = estimated_portions_left - 1'
      },
      {
        number: 3,
        label: 'Nampan Tiba di Kasir Ujung Rel (End-of-Line)',
        sourceNode: 'Nampan Makanan',
        targetNode: 'Kasir Ujung Rel',
        actionText: 'Kasir menekan tombol cepat (atau kamera AI mendeteksi 3 piring di nampan) dalam 2 detik.',
        packetPayload: 'POST /api/v1/cafeteria/scan-tray { "items": ["NASI", "RENDANG", "SUP"] }',
        protocolBadge: 'REST HTTPS',
        deviceState: 'Layar kasir menampilkan total: Rp 28.000',
        dbEffect: 'SELECT price FROM cafeteria_items WHERE sku IN ("NASI", "RENDANG", "SUP")'
      },
      {
        number: 4,
        label: 'Tap Kartu ID Pegawai RFID (<200ms)',
        sourceNode: 'Kartu ID RFID',
        targetNode: 'RFID Reader Kasir',
        actionText: 'Karyawan men-tap badge ID ke reader. Saldo makan harian langsung terpotong 0.2 detik.',
        packetPayload: 'PC_SC_APDU { "card_uid": "E200-4491-0082", "amount": 28000 }',
        protocolBadge: 'PC/SC USB HID',
        deviceState: 'Layar saldo tamu menampilkan: "Sisa Saldo: Rp 222.000 (Berhasil)"',
        dbEffect: 'UPDATE employee_balances SET balance = balance - 28000 WHERE rfid = "E200-4491-0082"'
      },
      {
        number: 5,
        label: 'Makan & Pengembalian Nampan (Tray Return)',
        sourceNode: 'Karyawan',
        targetNode: 'Rak Pengembalian Nampan',
        actionText: 'Karyawan membawa piring kotor ke stasiun cuci piring; sisa makanan ditimbang untuk audit waste.',
        packetPayload: 'POST /api/v1/cafeteria/tray-return { "tray_id": 44, "turnaround_min": 18 }',
        protocolBadge: 'REST API',
        deviceState: 'Perputaran nampan selesai, loyang dapur direkonsiliasi dengan penjualan',
        dbEffect: 'INSERT INTO cafeteria_daily_reconciliation (pan_qty_cooked, qty_sold) VALUES (60, 58)'
      }
    ],

    buffet_ayce: [
      {
        number: 1,
        label: 'Check-In Paket & Mulai Timer 90 Menit',
        sourceNode: 'Hostess POS',
        targetNode: 'Tablet Meja Tamu',
        actionText: 'Tamu memilih Paket Premium Wagyu (4 Pax). Timer countdown 90:00 mulai berhitung mundur.',
        packetPayload: 'POST /api/v1/buffet/start-session { "table": "B-12", "package": "WAGYU", "duration": 90 }',
        protocolBadge: 'WebSocket WSS',
        deviceState: 'Tablet di meja tamu menampilkan jam mundur: 89:59... 89:58...',
        dbEffect: 'INSERT INTO ayce_sessions (table_id, ends_at) VALUES ("B-12", NOW() + INTERVAL 90 MINUTE)'
      },
      {
        number: 2,
        label: 'Ambil Mandiri di Pulau Prasmanan',
        sourceNode: 'Tamu Meja',
        targetNode: 'Buffet Island',
        actionText: 'Tamu mengambil sendiri sayuran, bakso, jamur, bumbu racik suki, dan es krim tanpa kasir.',
        packetPayload: 'HEARTBEAT /ws/ayce-timer-stream { "session_id": "B-12", "elapsed_sec": 600 }',
        protocolBadge: 'WSS Socket',
        deviceState: 'Layar meja tamu menampilkan katalog daging tambahan yang bisa diorder via tablet',
        dbEffect: 'UPDATE ayce_sessions SET last_heartbeat = NOW() WHERE table_id = "B-12"'
      },
      {
        number: 3,
        label: 'Sensor Patroli Refill Chafing Dish Dapur',
        sourceNode: 'Tablet Patroli Staf',
        targetNode: 'KDS Dapur Meat Slicer',
        actionText: 'Staf melihat kaldu kuah tinggal sedikit, menekan tombol "Request Refill" 5 Liter ke dapur.',
        packetPayload: 'POST /api/v1/buffet/refill-request { "station": "KUAH-TOMYUM", "batch_kg": 5 }',
        protocolBadge: 'Redis Pub/Sub',
        deviceState: 'Layar KDS Dapur membunyikan alarm "Refill Kuah Tom Yum Meja Tengah"',
        dbEffect: 'UPDATE inventory SET stock_qty = stock_qty - 5 WHERE sku = "PASTA-TOMYUM"'
      },
      {
        number: 4,
        label: 'Peringatan Menit ke-75 (Last Order Call)',
        sourceNode: 'Server Otomatis',
        targetNode: 'Tablet Meja & Waiter',
        actionText: 'Waktu tersisa 15 menit. Layar tablet tamu berubah kuning menyala: "Waktu Last Order Telah Tiba".',
        packetPayload: 'WS_BROADCAST { "table": "B-12", "alert": "LAST_ORDER_15_MIN_REMAINING" }',
        protocolBadge: 'WSS Alert',
        deviceState: 'Waiter menghampiri meja untuk konfirmasi pesanan daging penutup terakhir',
        dbEffect: 'UPDATE ayce_sessions SET status = "LAST_ORDER_ACTIVE" WHERE table_id = "B-12"'
      },
      {
        number: 5,
        label: 'Timbang Sisa Makanan & Denda Waste Penalty',
        sourceNode: 'Timbangan Bluetooth',
        targetNode: 'Kasir Checkout',
        actionText: 'Staf menimbang sisa daging mentah di meja (240g). Denda Rp 50rb/100g = Rp 120.000 otomatis masuk bill.',
        packetPayload: 'POST /api/v1/buffet/sessions/B-12/close { "waste_grams": 240, "penalty": 120000 }',
        protocolBadge: 'ACID COMMIT',
        deviceState: 'Struk cetak tagihan paket + denda waste, meja dikunci kembali',
        dbEffect: 'INSERT INTO waste_penalties (session_id, waste_grams, penalty_fee) VALUES ("B-12", 240, 120000)'
      }
    ],

    conveyor_kaiten: [
      {
        number: 1,
        label: 'Koki Taruh Piring Sushi Ber-RFID ke Rel',
        sourceNode: 'Koki Sushi',
        targetNode: 'Pita Konveyor Berputar',
        actionText: 'Piring Salmon Nigiri berkubah transparan ditaruh di rel. Antena dapur membaca tag RFID piring.',
        packetPayload: 'POST /api/v1/conveyor/register { "rfid": "E280-AA01", "dish": "SALMON-NIGIRI", "ttl_min": 45 }',
        protocolBadge: 'Serial RS485',
        deviceState: 'Sistem mendaftarkan expiry timestamp = Waktu Sekarang + 45 Menit',
        dbEffect: 'INSERT INTO conveyor_plates (rfid_tag, dish_id, expires_at) VALUES ("E280-AA01", "SALMON", NOW() + 45m)'
      },
      {
        number: 2,
        label: 'Tamu Mengambil Piring Langsung dari Rel',
        sourceNode: 'Rel Berputar',
        targetNode: 'Meja Tamu',
        actionText: 'Tamu melihat hidangan lewat di depan meja dan mengangkat piring porselen warna emas.',
        packetPayload: 'EVENT PLATE_LIFTED_SENSOR { "gate_zone": "TABLE-04" }',
        protocolBadge: 'Modbus TCP',
        deviceState: 'Sensor deteksi optik menandai piring telah terambil dari lintasan',
        dbEffect: 'UPDATE conveyor_plates SET status = "PICKED_BY_GUEST" WHERE rfid_tag = "E280-AA01"'
      },
      {
        number: 3,
        label: 'Piring Basi >45 Mnt Dibuang Lengan Solenoid',
        sourceNode: 'Antena RFID Gate',
        targetNode: 'Lengan Pusher Otomatis',
        actionText: 'Piring berputar 46 menit tanpa diambil. Lengan mekanik solenoid otomatis mendorong piring ke bak sampah.',
        packetPayload: 'MODBUS_WRITE_COIL { "address": 104, "pulse_ms": 500, "reason": "HACCP_EXPIRED" }',
        protocolBadge: 'Modbus TCP / PLC',
        deviceState: 'Lengan solenoid "klik-push" piring jatuh ke tempat sampah pembuangan dapur',
        dbEffect: 'INSERT INTO kitchen_waste_log (sku, loss_cost, reason) VALUES ("SALMON-NIGIRI", 18500, "EXPIRED_BELT")'
      },
      {
        number: 4,
        label: 'Tamu Masukkan Piring ke Lubang Sensor Meja',
        sourceNode: 'Lubang Meja (Chute)',
        targetNode: 'Tablet Meja Tamu',
        actionText: 'Tamu memasukkan 5 piring kosong ke lubang meja. Sensor optik membaca hitungan dan trigger gacha game.',
        packetPayload: 'POST /api/v1/tables/T-04/drop-plate { "count": 5, "trigger_gacha": true }',
        protocolBadge: 'WSS Socket',
        deviceState: 'Tablet meja memainkan animasi gacha spin menang mainan kapsul!',
        dbEffect: 'UPDATE table_plate_counts SET count = count + 5, subtotal = subtotal + 175000'
      },
      {
        number: 5,
        label: 'Tekan Bayar di Tablet Meja & Settle',
        sourceNode: 'Tablet Meja Tamu',
        targetNode: 'Kasir Exit Gate',
        actionText: 'Tamu memverifikasi 15 piring yang telah dimasukkan ke lubang, bayar QRIS langsung di tablet meja.',
        packetPayload: 'POST /api/v1/tables/T-04/checkout { "total_plates": 15, "method": "QRIS" }',
        protocolBadge: 'ACID COMMIT',
        deviceState: 'Layar tablet berucap "Terima Kasih atas Kunjungan Anda!", sesi meja di-reset',
        dbEffect: 'COMMIT TRANSACTION: Deduct 15 piring bahan baku ikan & nasi sushi'
      }
    ],

    shinkansen_robot: [
      {
        number: 1,
        label: 'Tamu Order Ramen di Tablet Meja',
        sourceNode: 'Tablet Meja #14',
        targetNode: 'KDS Stasiun Express',
        actionText: 'Tamu memilih Ramen Spesial dan Gyoza. Tiket masuk ke stasiun rel Shinkansen jalur atas.',
        packetPayload: 'POST /api/v1/express/orders { "dest_table": "TABLE-14", "lane": "UPPER_RAIL" }',
        protocolBadge: 'WSS <150ms',
        deviceState: 'Lampu stasiun rel dapur menyala kuning: "Siapkan Makanan Jalur 2"',
        dbEffect: 'INSERT INTO express_rail_queue (order_id, destination_table) VALUES (401, "TABLE-14")'
      },
      {
        number: 2,
        label: 'Koki Letakkan Mangkok & Tekan "Luncurkan"',
        sourceNode: 'Koki Dapur',
        targetNode: 'Kereta Shinkansen Rel',
        actionText: 'Koki menaruh mangkuk ramen di atas baki miniatur kereta Shinkansen, menekan tombol meja 14.',
        packetPayload: 'MODBUS_CMD_LAUNCH { "lane": 2, "target_stop": 14, "speed_profile": "SMOOTH" }',
        protocolBadge: 'Modbus TCP',
        deviceState: 'Motor servo rel mulai berputar, lampu depan miniatur kereta menyala putih',
        dbEffect: 'UPDATE express_rail_queue SET status = "DISPATCHED" WHERE order_id = 401'
      },
      {
        number: 3,
        label: 'Kereta Meluncur Cepat & Berhenti Presisi',
        sourceNode: 'Miniatur Shinkansen',
        targetNode: 'Meja Tamu #14',
        actionText: 'Kereta meluncur di atas rel ganda dan berhenti mulus tepat di hadapan meja tamu dalam 12 detik.',
        packetPayload: 'EVENT RAIL_CARRIER_ARRIVED { "table": "TABLE-14", "transit_sec": 12 }',
        protocolBadge: 'Ethernet IP',
        deviceState: 'Lampu meja tamu berkedip hijau dan berbunyi nada kedatangan kereta',
        dbEffect: 'UPDATE express_rail_queue SET arrived_at = NOW() WHERE order_id = 401'
      },
      {
        number: 4,
        label: 'Sensor Beban Deteksi Piring Diangkat Tamu',
        sourceNode: 'Sensor Load Cell Baki',
        targetNode: 'Controller Rel',
        actionText: 'Tamu memindahkan mangkuk ke mejanya. Sensor beban mendeteksi berat berkurang menjadi 0 gram.',
        packetPayload: 'LOAD_CELL_TELEMETRY { "weight_grams": 0, "tray_empty": true }',
        protocolBadge: 'Analog ADC Bus',
        deviceState: 'Interlock safety terbuka: Kereta aman untuk bergerak kembali',
        dbEffect: 'UPDATE express_rail_queue SET food_retrieved = TRUE WHERE order_id = 401'
      },
      {
        number: 5,
        label: 'Tamu Tekan Tombol Pulang & Kereta Mundur',
        sourceNode: 'Tombol Meja Tamu',
        targetNode: 'Pangkalan Dapur',
        actionText: 'Tamu menekan tombol merah "Kembalikan Kereta". Miniatur Shinkansen meluncur mundur kembali ke dapur.',
        packetPayload: 'MODBUS_CMD_RETURN { "lane": 2, "dock_station": "KITCHEN-BAY-01" }',
        protocolBadge: 'Modbus TCP',
        deviceState: 'Kereta parkir di pangkalan dapur siap untuk pengiriman ke meja berikutnya',
        dbEffect: 'UPDATE express_rail_queue SET status = "COMPLETED" WHERE order_id = 401'
      }
    ],

    smart_locker: [
      {
        number: 1,
        label: 'Pesan Bento & Bayar di Mobile App',
        sourceNode: 'Smartphone Konsumen',
        targetNode: 'Cloud Backend',
        actionText: 'Konsumen memesan Bento Beef Teriyaki Hangat saat di perjalanan dan membayar via E-Wallet.',
        packetPayload: 'POST /api/v1/automat/orders { "sku": "BENTO-BEEF", "paid": true }',
        protocolBadge: 'REST HTTPS',
        deviceState: 'Sistem men-generate OTP PIN 6-digit (992811) dan Dynamic Barcode QR',
        dbEffect: 'INSERT INTO locker_orders (order_code, pin_hash, status) VALUES ("BENTO-01", "hash", "PAID")'
      },
      {
        number: 2,
        label: 'Dapur Masukkan Makanan dari Pintu Belakang',
        sourceNode: 'Koki Dapur',
        targetNode: 'Kompartemen Loker #05',
        actionText: 'Koki scan barcode pesanan di pintu belakang loker, pintu kompartemen #05 membuka, makanan ditaruh.',
        packetPayload: 'MQTT_PUB /lockers/load { "compartment": 5, "temp_zone": "HEATED_65C" }',
        protocolBadge: 'MQTT over TLS',
        deviceState: 'Sensor suhu memvalidasi pemanas kompartemen #05 berada di suhu optimal 66.2°C',
        dbEffect: 'UPDATE locker_compartments SET status = "OCCUPIED_WARMING", order_id = "BENTO-01"'
      },
      {
        number: 3,
        label: 'Push Notifikasi "Makanan Siap di Loker #05"',
        sourceNode: 'Notification Worker',
        targetNode: 'HP Konsumen',
        actionText: 'Konsumen menerima notifikasi instan: "Pesanan Anda siap diambil di Loker #05 Stasiun Gambir".',
        packetPayload: 'FCM_PUSH /topics/order-BENTO-01 { "body": "Siap di Loker 05", "qr_token": "token" }',
        protocolBadge: 'Web Push / FCM',
        deviceState: 'Layar HP menampilkan barcode siap scan di depan kabinet loker',
        dbEffect: 'UPDATE locker_orders SET status = "READY_FOR_PICKUP", ready_at = NOW()'
      },
      {
        number: 4,
        label: 'Scan QR di Scanner Loker & Pintu Membuka',
        sourceNode: 'Scanner Laser Loker',
        targetNode: 'Relay Kunci Solenoid 12V',
        actionText: 'Konsumen scan QR HP ke scanner sentral. Relay solenoid melepaskan kunci dan pintu #05 pop-out terbuka.',
        packetPayload: 'MQTT_PUB /lockers/cmd/unlock { "compartment": 5, "pulse_ms": 300 }',
        protocolBadge: 'MQTTS ESP32',
        deviceState: 'Lampu LED kompartemen #05 menyala hijau terang, pintu terdorong membuka',
        dbEffect: 'UPDATE locker_compartments SET door_state = "OPEN_UNLOCKED"'
      },
      {
        number: 5,
        label: 'Ambil Makanan & Sanitasi UV-C Otomatis',
        sourceNode: 'Konsumen',
        targetNode: 'Loker #05',
        actionText: 'Konsumen mengambil makanan hangat dan menutup pintu. Saklar magnetik mendeteksi tutup, lampu UV menyala.',
        packetPayload: 'EVENT DOOR_CLOSED_SENSOR { "compartment": 5, "start_uv_seconds": 60 }',
        protocolBadge: 'MQTT over TLS',
        deviceState: 'Lampu UV-C menyala 60 detik untuk membunuh bakteri, loker siap untuk tamu berikutnya',
        dbEffect: 'UPDATE locker_orders SET status = "COMPLETED"; UPDATE compartments SET status = "EMPTY"'
      }
    ],

    qr_pwa: [
      {
        number: 1,
        label: 'Scan QR Meja & Validasi Token HMAC',
        sourceNode: 'Smartphone Tamu',
        targetNode: 'PWA Web Server',
        actionText: 'Tamu scan QR di meja T-09. URL terenkripsi memvalidasi bahwa tamu benar-benar di meja T-09.',
        packetPayload: 'POST /api/v1/qr/authenticate { "token": "hmac.signed.t09.hash" }',
        protocolBadge: 'HTTPS JWT',
        deviceState: 'Web browser HP membuka katalog menu PWA tanpa perlu instal aplikasi apapun',
        dbEffect: 'SELECT * FROM tables WHERE id = "T-09" AND qr_token_valid = TRUE'
      },
      {
        number: 2,
        label: 'Shared Cart Multi-User Real-Time',
        sourceNode: 'Tamu A & Tamu B',
        targetNode: 'Redis WebSocket Room',
        actionText: 'Tamu A memilih Ramen, Tamu B di meja yang sama langsung melihat item muncul di HP-nya dalam 80ms.',
        packetPayload: 'WS_ROOM_BROADCAST room:table_T-09 { "action": "CART_ADD", "item": "RAMEN-SHOYU" }',
        protocolBadge: 'WSS Socket',
        deviceState: 'Keranjang bersama terupdate serentak di semua handphone yang scan QR meja tersebut',
        dbEffect: 'HSET table_carts:T-09 "RAMEN-SHOYU" 1'
      },
      {
        number: 3,
        label: 'Self-Checkout & Bayar QRIS Instan',
        sourceNode: 'Smartphone Tamu',
        targetNode: 'Payment Gateway',
        actionText: 'Tamu menekan "Kirim & Bayar". Gateway memproses pembayaran QRIS, webhook diterima server 1 detik.',
        packetPayload: 'POST /api/v1/payments/qris { "cart_id": "T-09-CART", "amount": 168000 }',
        protocolBadge: 'HTTPS Webhook',
        deviceState: 'Layar HP tamu menampilkan centang hijau "Pembayaran Berhasil! Pesanan Sedang Dimasak"',
        dbEffect: 'INSERT INTO orders (table_id, total, status) VALUES ("T-09", 168000, "PAID")'
      },
      {
        number: 4,
        label: 'Injeksi Otomatis ke KDS Dapur & Bar',
        sourceNode: 'Backend Engine',
        targetNode: 'Layar KDS Dapur',
        actionText: 'Pesanan langsung ditembakkan otomatis ke monitor koki tanpa campur tangan pelayan.',
        packetPayload: 'WS_PUSH /kds/kitchen-tickets { "table": "T-09", "items": ["RAMEN-SHOYU", "ES-TEH"] }',
        protocolBadge: 'WebSocket WSS',
        deviceState: 'Layar sentuh dapur berbunyi lonceng dan menampilkan tiket ramen meja 09',
        dbEffect: 'INSERT INTO kitchen_tickets (order_id, station) VALUES (8821, "RAMEN_STATION")'
      },
      {
        number: 5,
        label: 'Penyajian Makanan & Unduh E-Receipt',
        sourceNode: 'Food Runner',
        targetNode: 'Meja Tamu T-09',
        actionText: 'Runner menyajikan ramen ke meja T-09. Tamu mengunduh e-struk pajak PDF langsung dari browser HP.',
        packetPayload: 'PATCH /api/v1/orders/8821/served { "runner": "Budi" }',
        protocolBadge: 'REST API',
        deviceState: 'Sesi meja di HP tamu berganti status menjadi "Pesanan Telah Disajikan"',
        dbEffect: 'UPDATE orders SET status = "COMPLETED"; COMMIT INVENTORY'
      }
    ],

    drive_thru: [
      {
        number: 1,
        label: 'Mobil Lindas Ground Loop & AI LPR',
        sourceNode: 'Mobil di Aspal',
        targetNode: 'Headset Nirkabel Kasir',
        actionText: 'Mobil melindas sensor inductive loop di bawah aspal; kamera AI membaca plat nomor B 1234 XYZ.',
        packetPayload: 'LOOP_DETECTOR_EVENT { "sensor": "LOOP-ORDER-01", "lpr_plate": "B 1234 XYZ" }',
        protocolBadge: 'RTSP AI LPR',
        deviceState: 'Headset kasir berbunyi "chime ding-dong", timer Speed of Service (SOS) mulai berhitung',
        dbEffect: 'INSERT INTO drivethru_sessions (license_plate, arrived_at) VALUES ("B 1234 XYZ", NOW())'
      },
      {
        number: 2,
        label: 'Pemesanan Interkom & Layar ODCU',
        sourceNode: 'Tiang Interkom Luar',
        targetNode: 'Layar Outdoor ODCU 32"',
        actionText: 'Pengemudi berbicara via interkom full-duplex. Pesanan tampil jelas di layar luar tahan hujan/panas.',
        packetPayload: 'SIP_RTP_STREAM audio:g711u <-> ODCU_UPDATE { "items": ["COMBO-BURGER"] }',
        protocolBadge: 'VoIP SIP / TCP',
        deviceState: 'Pengemudi melihat nama menu dan total harga di layar luar mobil',
        dbEffect: 'INSERT INTO drivethru_items (session_id, sku) VALUES (881, "COMBO-BURGER")'
      },
      {
        number: 3,
        label: 'Jendela 1: Verifikasi Plat & Bayar',
        sourceNode: 'Kasir Jendela 1',
        targetNode: 'Mobil Pengemudi',
        actionText: 'Mobil meluncur ke jendela pertama. Kasir mencocokkan plat mobil di layar dan memproses EDC/QRIS.',
        packetPayload: 'POST /api/v1/drivethru/pay-window-1 { "session": 881, "method": "EDC_TAP" }',
        protocolBadge: 'REST HTTPS',
        deviceState: 'Struk bayar tercetak, lampu penunjuk hijau mengarahkan mobil maju ke Jendela 2',
        dbEffect: 'UPDATE drivethru_sessions SET payment_status = "PAID", window1_sec = 42'
      },
      {
        number: 4,
        label: 'Jendela 2: Serah Terima Makanan Panas',
        sourceNode: 'Runner Jendela 2',
        targetNode: 'Kabin Mobil',
        actionText: 'Runner menyerahkan kantong makanan bersegel dan minuman dingin melalui kaca mobil dalam < 15 detik.',
        packetPayload: 'PATCH /api/v1/drivethru/handoff-window-2 { "session": 881, "handed_over": true }',
        protocolBadge: 'WSS Socket',
        deviceState: 'Layar stasiun bagger menandai pesanan mobil B 1234 XYZ telah diserahkan',
        dbEffect: 'UPDATE drivethru_sessions SET handoff_at = NOW()'
      },
      {
        number: 5,
        label: 'Mobil Lindas Loop Keluar & Tutup SOS',
        sourceNode: 'Sensor Loop Keluar',
        targetNode: 'Dashboard Metrik SOS',
        actionText: 'Mobil melindas sensor keluar. Timer berhenti pada 142 detik (di bawah target standar 180s = Hijau).',
        packetPayload: 'EXIT_LOOP_TRIGGER { "session": 881, "total_sos_sec": 142, "rating": "EXCELLENT" }',
        protocolBadge: 'Analog IO Pulse',
        deviceState: 'Layar analitik manajer mencatat: 1 Mobil Sukses dengan SLA Hebat',
        dbEffect: 'UPDATE drivethru_sessions SET total_duration_sec = 142; COMMIT INVENTORY'
      }
    ],

    carhop_bay: [
      {
        number: 1,
        label: 'Mobil Parkir di Stall #07 (Bay Parking)',
        sourceNode: 'Mobil Tamu',
        targetNode: 'Sensor Ultrasonik Tiang',
        actionText: 'Mobil masuk ke slot parkir stall #07. Sensor ultrasonik mendeteksi mobil dan update peta kasir.',
        packetPayload: 'ULTRASONIC_DETECT { "bay_id": 7, "distance_cm": 45, "status": "OCCUPIED" }',
        protocolBadge: 'Modbus RS485',
        deviceState: 'Lampu LED tiang stall #07 menyala biru, di layar POS kasir stall 07 berubah terisi',
        dbEffect: 'UPDATE carhop_bays SET status = "OCCUPIED", parked_at = NOW() WHERE bay_id = 7'
      },
      {
        number: 2,
        label: 'Tekan Tombol Merah Tiang / Scan QR Tiang',
        sourceNode: 'Tombol Tiang Parkir',
        targetNode: 'Headset Operator Kasir',
        actionText: 'Tamu menekan tombol merah fisik di tiang. Bel berbunyi di kasir: "Halo Stall 07 mau pesan apa?".',
        packetPayload: 'GPIO_INTERRUPT { "stall": 7, "event": "BUTTON_PRESSED" }',
        protocolBadge: 'SIP VoIP Audio',
        deviceState: 'Operator kasir mencatat Hotdog, Burger Retro, dan 2 Milkshake Cokelat',
        dbEffect: 'INSERT INTO carhop_orders (bay_id, items) VALUES (7, "HOTDOG, BURGER, MILKSHAKE")'
      },
      {
        number: 3,
        label: 'Dapur Merakit di Baki Gantung Kaca Mobil',
        sourceNode: 'KDS Stasiun Carhop',
        targetNode: 'Baki Window Clamp Tray',
        actionText: 'Dapur menyiapkan pesanan di atas baki logam khusus berkait penjepit jendela mobil.',
        packetPayload: 'PATCH /api/v1/kitchen/tickets/c7/ready { "tray_ready": true }',
        protocolBadge: 'WebSocket WSS',
        deviceState: 'Layar pelayan carhop membunyikan lonceng: "Stall 07 Siap Diantar"',
        dbEffect: 'UPDATE carhop_orders SET kitchen_status = "READY" WHERE bay_id = 7'
      },
      {
        number: 4,
        label: 'Carhop Antar & Pasang Baki di Kaca Mobil',
        sourceNode: 'Pelayan Carhop',
        targetNode: 'Jendela Kaca Mobil Kemudi',
        actionText: 'Pelayan memasang kait baki di kaca jendela pintu supir. Tamu makan di dalam kenyamanan mobil.',
        packetPayload: 'POST /api/v1/carhop/bays/7/tray-hooked { "carhop_staff": "Dina" }',
        protocolBadge: 'REST HTTPS',
        deviceState: 'Peta denah parkir berubah menjadi DINING_IN_CAR',
        dbEffect: 'UPDATE carhop_bays SET dining_state = "EATING" WHERE bay_id = 7'
      },
      {
        number: 5,
        label: 'Panggilan Ambil Baki & Bayar di Mobil',
        sourceNode: 'Tamu Mobil',
        targetNode: 'Mobile EDC Carhop',
        actionText: 'Tamu menekan tombol panggil kembali. Pelayan datang membawa EDC nirkabel 4G, baki dilepas.',
        packetPayload: 'POST /api/v1/carhop/bays/7/checkout { "payment": "WIRELESS_CARD_TAP" }',
        protocolBadge: 'ACID COMMIT',
        deviceState: 'Mobil melaju pergi, tiang stall #07 kembali hijau VACANT',
        dbEffect: 'UPDATE carhop_bays SET status = "VACANT"; COMMIT INVENTORY'
      }
    ],

    omakase: [
      {
        number: 1,
        label: 'Reservasi 100% Pre-Auth Deposit Escrow',
        sourceNode: 'Tamu VIP',
        targetNode: 'Engine Booking Online',
        actionText: 'Tamu memesan 2 kursi Omakase sesi jam 19:00, deposit kartu kredit 100% terkunci aman di escrow.',
        packetPayload: 'POST /api/v1/omakase/book { "session": "19:00", "seats": [3, 4], "deposit_paid": 4500000 }',
        protocolBadge: '3D-Secure HTTPS',
        deviceState: 'Kursi #03 & #04 terkunci di denah meja konter hinoki chef',
        dbEffect: 'INSERT INTO omakase_reservations (session_id, seats, deposit_held) VALUES ("SES-01", [3,4], 4500000)'
      },
      {
        number: 2,
        label: 'Chef Alokasi Ikan Pasar Subuh (Zero Excess)',
        sourceNode: 'Master Chef',
        targetNode: 'Tablet Dapur Omakase',
        actionText: 'Chef mendaftarkan ikan segar harian (Otoro Aomori, Uni Hokkaido) persis sesuai jumlah pax sesi malam.',
        packetPayload: 'POST /api/v1/omakase/daily-catch { "pax": 10, "courses": 18, "fish_lots": ["OTORO", "UNI"] }',
        protocolBadge: 'REST API',
        deviceState: 'Resep BOM dinamis hari ini terbit: 10 porsi per jenis tangkapan laut',
        dbEffect: 'INSERT INTO dynamic_daily_bom (date, total_pax, fish_allocations) VALUES (TODAY, 10, {...})'
      },
      {
        number: 3,
        label: 'Tamu Duduk Serentak & Seat Allergy Matrix',
        sourceNode: 'Tamu di Meja Konter',
        targetNode: 'Tablet Master Chef',
        actionText: '10 Tamu duduk melingkari meja chef. Tablet chef menampilkan matriks alergi (Kursi 4: No Raw Egg).',
        packetPayload: 'PATCH /api/v1/omakase/sessions/01/seat { "guests_present": 10 }',
        protocolBadge: 'WSS Socket',
        deviceState: 'Tablet chef menyorot kursi #04 dengan warna amber peringatan alergi',
        dbEffect: 'UPDATE omakase_sessions SET status = "LIVE_DEGUSTATION_ACTIVE"'
      },
      {
        number: 4,
        label: 'Live Crafting & Course Advancement (1 s/d 18)',
        sourceNode: 'Master Chef',
        targetNode: 'Piring Batu Tamu',
        actionText: 'Chef mengiris sashimi, menyajikan course demi course sambil menceritakan filosofi rasa.',
        packetPayload: 'POST /api/v1/omakase/advance-course { "current_course": 8, "dish": "A5 Miyazaki Wagyu" }',
        protocolBadge: 'WSS Broadcast',
        deviceState: 'Layar dapur belakang bersiap memanggang course nomor 9',
        dbEffect: 'UPDATE omakase_pacing SET current_course_num = 8, time_elapsed_min = 52'
      },
      {
        number: 5,
        label: 'Capture Deposit & Settle Minuman Tambahan',
        sourceNode: 'Kasir Sommelier',
        targetNode: 'Payment Gateway',
        actionText: 'Deposit makanan di-capture permanen, kasir hanya menagih botol sake tambahan. CRM preferensi tamu tersimpan.',
        packetPayload: 'POST /api/v1/omakase/settle { "capture_deposit": true, "extra_sake": 480000 }',
        protocolBadge: 'ACID COMMIT',
        deviceState: 'E-struk VIP terkirim via WhatsApp, profil selera tamu disimpan di CRM',
        dbEffect: 'COMMIT TRANSACTION; INSERT INTO guest_crm_profiles (favorite_dishes, visit_count)'
      }
    ],

    food_court: [
      {
        number: 1,
        label: 'Unified Cart: Pesan dari 3 Tenant Sekaligus',
        sourceNode: 'Pelanggan',
        targetNode: 'Kiosk Sentral / QR Bersama',
        actionText: 'Tamu memilih Nasi Padang (Tenant A), Ramen (Tenant B), dan Es Teh (Tenant Minuman) dalam 1 nota.',
        packetPayload: 'POST /api/v1/foodcourt/unified-cart { "tenants": ["PADANG", "RAMEN", "BAR"] }',
        protocolBadge: 'REST HTTPS',
        deviceState: 'Keranjang belanja sentral menggabungkan 3 tenant dengan subtotal Rp 88.000',
        dbEffect: 'INSERT INTO master_foodcourt_orders (total_amount) VALUES (88000)'
      },
      {
        number: 2,
        label: 'Satu Pembayaran & Split Escrow Payout',
        sourceNode: 'Pelanggan',
        targetNode: 'Payment Gateway Splitter',
        actionText: 'Tamu bayar QRIS 1 kali. Mesin split payment memecah dana otomatis ke rekening bank tiap tenant.',
        packetPayload: 'WEBHOOK_SPLIT_PAYOUT { "tenant_padang": 28000, "tenant_ramen": 45000, "mall_fee": 15000 }',
        protocolBadge: 'Split Escrow API',
        deviceState: 'Saldo kasir sentral terbagi ke 3 dompet rekening terpisah secara otomatis',
        dbEffect: 'UPDATE tenant_ledgers SET balance = balance + net_share WHERE tenant_id IN (...)'
      },
      {
        number: 3,
        label: 'Router Tiket ke Masing-Masing Printer Stand',
        sourceNode: 'Print Router Server',
        targetNode: 'Printer IP Port 9100 Stand',
        actionText: 'Server memilah dan menembakkan tiket dapur langsung ke IP printer printer masing-masing tenant.',
        packetPayload: 'RAW_TCP_SOCKET 192.168.1.101:9100 (Padang) & 192.168.1.102:9100 (Ramen)',
        protocolBadge: 'RAW ESC/POS TCP 9100',
        deviceState: 'Printer stand Padang mencetak rendang, stand Ramen mencetak ramen kuah',
        dbEffect: 'INSERT INTO tenant_sub_tickets (master_id, tenant_id, status) VALUES (...)'
      },
      {
        number: 4,
        label: 'Buzzer Stand Tenant Bergetar Mandiri',
        sourceNode: 'Stand Tenant A',
        targetNode: 'Pager Tamu',
        actionText: 'Saat nasi padang matang lebih dulu, tenant menekan "Ready". Pager tamu bergetar untuk ambil di stand A.',
        packetPayload: 'EVENT SUB_ORDER_READY { "tenant": "PADANG", "pickup_counter": "STAND-01" }',
        protocolBadge: 'WSS Push',
        deviceState: 'Tamu mengambil nasi padang, 3 menit kemudian stand B memanggil untuk ambil ramen',
        dbEffect: 'UPDATE tenant_sub_tickets SET status = "READY" WHERE tenant_id = "PADANG"'
      },
      {
        number: 5,
        label: 'Tutup Hari & Rekonsiliasi Bagi Hasil Bersih',
        sourceNode: 'Server Sentral',
        targetNode: 'Bank Rekening Mitra Tenant',
        actionText: 'Malam hari sistem mentransfer omset bersih per tenant setelah dipotong sewa mall secara transparan.',
        packetPayload: 'POST /api/v1/foodcourt/daily-settlement { "auto_wire_bank": true }',
        protocolBadge: 'ACID COMMIT',
        deviceState: 'Laporan omset harian terkirim ke aplikasi smartphone pemilik tenant',
        dbEffect: 'COMMIT DAILY LEDGER: Selesai tanpa selisih hitungan manual'
      }
    ],

    cloud_kitchen: [
      {
        number: 1,
        label: 'Omnichannel Ingestion (Grab/GoFood/Shopee)',
        sourceNode: 'Aplikasi Ojek Online',
        targetNode: 'Middleware Cloud Hub',
        actionText: 'Pesanan masuk bersamaan dari GrabFood & GoFood ke 1 layar sentral tanpa 5 tablet terpisah.',
        packetPayload: 'WEBHOOK_INGESTION HMAC_SHA256 { "provider": "GRABFOOD", "brand": "Burger Bros", "order": "#GF-88" }',
        protocolBadge: 'Webhook Ingestion',
        deviceState: 'Sistem Auto-Accept pesanan dalam 1 detik, estimasi prep time 15 menit',
        dbEffect: 'INSERT INTO cloud_kitchen_orders (channel, virtual_brand, external_order_id) VALUES (...)'
      },
      {
        number: 2,
        label: 'Routing Tiket Berdasarkan Stasiun Dapur',
        sourceNode: 'KDS Sentral',
        targetNode: 'Stasiun Fryer & Stasiun Grill',
        actionText: 'Koki fryer menggoreng kentang untuk Brand A dan ayam untuk Brand B dari stok minyak yang sama.',
        packetPayload: 'WS_DISPATCH /kds/fryer { "items": ["FRIES_BRAND_A", "AYAM_BRAND_B"] }',
        protocolBadge: 'WebSocket WSS',
        deviceState: 'Koki bekerja efisien mengolah bahan baku shared inventory pool',
        dbEffect: 'UPDATE shared_inventory SET stock_qty = stock_qty - 0.2 WHERE sku = "MINYAK-GORENG"'
      },
      {
        number: 3,
        label: 'Packing & Cetak Label Segel Tamper-Evident',
        sourceNode: 'Staf Bagging',
        targetNode: 'Printer Label Barcode',
        actionText: 'Makanan dibungkus ke paper bag sesuai brand virtual, disegel stiker barcode anti-buka.',
        packetPayload: 'POST /api/v1/kitchen/bag-sealed { "order": "#GF-88", "cubby": "A-03" }',
        protocolBadge: 'ZPL / ESC/POS',
        deviceState: 'Stiker segel memuat: #GF-88 · Driver: Rahmat · Siap di Rak A-03',
        dbEffect: 'UPDATE cloud_kitchen_orders SET packaging_status = "SEALED", cubby_assigned = "A-03"'
      },
      {
        number: 4,
        label: 'TV Driver Dispatcher Board di Ruang Tunggu',
        sourceNode: 'Cloud Server',
        targetNode: 'TV Monitor 43" Parkir Driver',
        actionText: 'Layar TV di area tunggu kurir menampilkan: "GrabFood #GF-88 · SIAP DI RAK A-03".',
        packetPayload: 'WS_BROADCAST /display/driver-board { "ready_orders": [{ "id": "#GF-88", "rack": "A-03" }] }',
        protocolBadge: 'WSS TV Stream',
        deviceState: 'Kurir ojol masuk ke area pickup dan mengambil kantong di loker A-03 tanpa tanya staf',
        dbEffect: 'UPDATE cloud_kitchen_orders SET driver_board_displayed = TRUE'
      },
      {
        number: 5,
        label: 'Scan Barcode Serah Terima & Ojol OTW',
        sourceNode: 'Scanner Kurir / Staf',
        targetNode: 'API Aggregator Ojol',
        actionText: 'Barcode di kantong di-scan. Status pesanan di HP konsumen seketika berubah: "Driver Menuju Lokasi Anda".',
        packetPayload: 'POST /api/v1/integrations/delivery/handover { "status": "DRIVER_ON_THE_WAY" }',
        protocolBadge: 'HTTPS REST API',
        deviceState: 'Pesanan keluar dari antrean dapur, siklus selesai dalam 12 menit',
        dbEffect: 'UPDATE cloud_kitchen_orders SET status = "HANDED_TO_DRIVER", completed_at = NOW()'
      }
    ]
  };

  const steps = stepsMap[workflowType] || stepsMap.american_service;

  // Auto-play steps simulation
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const activeStepConfig = steps[currentStep];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-slate-950/90 border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-inner">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-bold text-white tracking-wide">
            Simulasi Visual Alur: <span className="text-cyan-300">{title}</span>
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
            {badge}
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-amber-400 text-slate-950'
                : 'bg-white/10 text-slate-300 hover:text-white'
            }`}
            title={isPlaying ? 'Jeda Animasi' : 'Jalankan Animasi'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>
          <button
            onClick={() => setCurrentStep(0)}
            className="p-1.5 rounded-lg bg-white/10 text-slate-300 hover:text-white text-xs transition-all"
            title="Ulangi dari Langkah 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive 5-Step Segmented Navigation */}
      <div className="grid grid-cols-5 gap-1.5 py-2 relative z-10">
        {steps.map((st, idx) => {
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;
          return (
            <button
              key={st.number}
              onClick={() => {
                setCurrentStep(idx);
                setIsPlaying(false);
              }}
              className={`p-1.5 sm:p-2 rounded-xl text-left border transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md scale-[1.02]'
                  : isDone
                  ? 'bg-white/10 text-emerald-400 border-emerald-500/30 font-medium'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-[9px] font-mono leading-none">0{st.number}</div>
              <div className="text-[10px] truncate mt-0.5 leading-tight">{st.label.split('&')[0]}</div>
            </button>
          );
        })}
      </div>

      {/* Main Animated Flow Simulation Rig */}
      <div className="my-auto py-2 relative z-10 flex flex-col space-y-3">
        {/* Animated Visual Rig: Source Node -> Signal Pulse -> Target Node */}
        <div className="p-3 sm:p-4 rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden flex items-center justify-between gap-2">
          {/* Node 1: Source */}
          <div className="w-2/5 p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-center space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-mono block">
              1. Pengirim / Titik Awal
            </span>
            <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate">{activeStepConfig.sourceNode}</span>
            </div>
          </div>

          {/* Animated Connecting Pulse */}
          <div className="flex-1 flex flex-col items-center justify-center px-1 relative">
            <div className="text-[9px] font-mono text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 mb-1">
              {activeStepConfig.protocolBadge}
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
              <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[pulse_1.2s_ease-in-out_infinite]" />
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 mt-1" />
          </div>

          {/* Node 2: Target */}
          <div className="w-2/5 p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-center space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono block">
              2. Penerima / Hardware Dapur
            </span>
            <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate">{activeStepConfig.targetNode}</span>
            </div>
          </div>
        </div>

        {/* Action Detail & Physical Device State */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
              ✓
            </span>
            <p className="text-slate-200 text-xs leading-relaxed font-medium">
              {activeStepConfig.actionText}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-white/5 text-[11px] text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate"><strong>Status Alat:</strong> {activeStepConfig.deviceState}</span>
          </div>
        </div>

        {/* Live Payload & DB Lock Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono">
          <div className="p-2.5 rounded-xl bg-black/80 border border-white/10 text-cyan-300 overflow-x-auto">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">
              Payload Paket Data (Jaringan):
            </span>
            <div className="truncate">{activeStepConfig.packetPayload}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/80 border border-white/10 text-amber-300 overflow-x-auto">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block mb-0.5">
              Dampak Database &amp; ACID Lock:
            </span>
            <div className="truncate">{activeStepConfig.dbEffect}</div>
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono relative z-10">
        <span>Fase {currentStep + 1} dari {steps.length}: {activeStepConfig.label}</span>
        <div className="flex items-center gap-1">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === currentStep ? 'w-4 bg-cyan-400' : 'w-1 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
