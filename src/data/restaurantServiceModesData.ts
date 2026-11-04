export interface ServiceModeStep {
  stepNumber: number;
  phaseName: string;
  actor: string;
  actionSummary: string;
  detailFlow: string;
  systemTrigger: string;
  apiTrigger?: string;
  dbImpact: string;
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'WS';
  endpoint: string;
  description: string;
  samplePayload?: string;
  sampleResponse?: string;
}

export interface RestaurantServiceMode {
  id: string;
  categoryId: 'table_service' | 'counter_self' | 'tech_automated' | 'drive_vehicle' | 'special_concepts';
  categoryName: string;
  name: string;
  englishTitle: string;
  badge: string;
  badgeColor: string;
  overview: string;
  targetVenues: string[];
  metrics: {
    turnaroundTime: string;
    laborIntensity: 'Sangat Rendah' | 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi' | string;
    techReliance: 'Dasar' | 'Sedang' | 'Tinggi' | 'Otomasi Penuh' | string;
    wasteRiskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis' | string;
    averageCheckSize: 'Ekonomis' | 'Menengah' | 'Premium' | 'Luxury/Ultra' | string;
  };
  operationalFlow: ServiceModeStep[];
  techArchitecture: {
    frontendDevices: string[];
    hardwareRequired: string[];
    protocols: {
      protocol: string;
      usage: string;
      targetDeviceOrService: string;
    }[];
    apiEndpoints: ApiEndpointSpec[];
    inventoryDeductionRule: {
      timing: string;
      logic: string;
      bomMapping: string;
      spoilageAndWaste: string;
    };
    concurrencyAndLocking: {
      lockMechanism: string;
      raceConditionHandling: string;
      rollbackPolicy: string;
    };
    offlineResilience: {
      localPersistence: string;
      syncStrategy: string;
      conflictResolution: string;
    };
    developerChecklist: string[];
  };
  sampleJsonPayload: string;
}

export const RESTAURANT_SERVICE_CATEGORIES = [
  {
    id: 'table_service',
    title: '1. Table Service (Pelayanan Meja)',
    description: 'Pelanggan duduk di meja terlebih dahulu; pemesanan, peracikan, dan penyajian dilayani oleh staf pramusaji.',
    count: 4,
    color: 'emerald'
  },
  {
    id: 'counter_self',
    title: '2. Counter & Self-Service (Pelayanan Konter & Mandiri)',
    description: 'Pelanggan mengambil peran aktif dalam antrean pemesanan, perakitan nampan, atau pengambilan makanan prasmanan.',
    count: 3,
    color: 'amber'
  },
  {
    id: 'tech_automated',
    title: '3. Service Berbasis Teknologi & Otomatisasi',
    description: 'Pemesanan digital nirsentuh, lintasan rel shinkansen, konveyor RFID, dan robot pengantar otonom.',
    count: 4,
    color: 'cyan'
  },
  {
    id: 'drive_vehicle',
    title: '4. Drive & Vehicle Service (Layanan Kendaraan)',
    description: 'Layanan terintegrasi kendaraan via intercom loop detector multi-window atau parkir pemesanan carhop.',
    count: 2,
    color: 'indigo'
  },
  {
    id: 'special_concepts',
    title: '5. Konsep Khusus & Kontemporer',
    description: 'Omakase personalisasi chef, food court multi-tenant bagi hasil, dan cloud kitchen agregator delivery.',
    count: 3,
    color: 'purple'
  }
];

export const RESTAURANT_SERVICE_MODES: RestaurantServiceMode[] = [
  // 1.1 American Service
  {
    id: 'american_service',
    categoryId: 'table_service',
    categoryName: 'Pelayanan Meja',
    name: 'American Service (Plated Service)',
    englishTitle: 'Plated / Modern Casual & Fine Dining Service',
    badge: 'PLATED SERVICE',
    badgeColor: 'bg-emerald-600 text-white',
    overview: 'Makanan dimasak, ditata rapi di atas piring (plated) langsung di dapur oleh koki, lalu diantarkan pramusaji/runner ke meja tamu dari sisi kiri tamu. Standar industri resto kasual hingga fine dining modern.',
    targetVenues: ['Casual Dining', 'Bistro Modern', 'Steakhouse', 'Family Restaurant', 'Hotel Dining'],
    metrics: {
      turnaroundTime: '45 - 75 Menit',
      laborIntensity: 'Sedang',
      techReliance: 'Tinggi',
      wasteRiskLevel: 'Sedang',
      averageCheckSize: 'Menengah'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Kedatangan & Penempatan Meja',
        actor: 'Hostess / Receptionist',
        actionSummary: 'Tamu disambut di pintu depan, diarahkan ke nomor meja kosong sesuai jumlah pax.',
        detailFlow: 'Hostess membuka Table Management POS, memilih meja (misal T-04), memasukkan jumlah pax (3 tamu), dan mengubah status meja dari VACANT menjadi OCCUPIED.',
        systemTrigger: 'TABLE_STATUS_UPDATED event disiarkan ke server',
        apiTrigger: 'PATCH /api/v1/tables/{tableId}/status',
        dbImpact: 'Update status meja ke "occupied", catat seated_at timestamp, buat order_session_id aktif.'
      },
      {
        stepNumber: 2,
        phaseName: 'Input Pesanan & Coursing',
        actor: 'Pramusaji (Waiter)',
        actionSummary: 'Pramusaji mencatat menu di tablet waiter portabel dengan pemetaan seat-number dan urutan coursing.',
        detailFlow: 'Waiter memilih item: Seat 1 Sup Jamur (Starter), Seat 1 Tenderloin Steak (Main Medium Rare), Seat 2 Salmon Grill (Main). Waiter memvalidasi ketersediaan stok live di layar tablet sebelum kirim order.',
        systemTrigger: 'ORDER_SUBMITTED with Coursing tags (STARTER, MAIN, DESSERT)',
        apiTrigger: 'POST /api/v1/orders/table-order',
        dbImpact: 'Simpan orders & order_items dengan seat_number, status "sent_to_kitchen".'
      },
      {
        stepNumber: 3,
        phaseName: 'Routing KDS & Fire Control',
        actor: 'Sistem KDS & Head Chef',
        actionSummary: 'KDS memisahkan tiket ke stasiun Dapur Panas, Grill, dan Bar. Waiter mengirim sinyal "Fire Mains" saat starter selesai disantap.',
        detailFlow: 'Starter langsung berstatus COOKING di KDS. Main course berstatus HELD (ditahan). Saat piring sup diangkat, waiter menekan tombol "Fire Mains" di tablet, alarm KDS berbunyi dan timer memasak steak dimulai.',
        systemTrigger: 'COURSE_FIRED event disiarkan via WebSocket',
        apiTrigger: 'POST /api/v1/orders/{orderId}/fire-course',
        dbImpact: 'Update item course status dari "held" menjadi "queued_for_prep", catat fired_at.'
      },
      {
        stepNumber: 4,
        phaseName: 'Plating di Expo & Penyajian',
        actor: 'Koki Plater & Food Runner',
        actionSummary: 'Koki menata piring di pass expo, memasang garnish, dan menekan tiket "Ready". Runner mengantar piring ke meja tamu.',
        detailFlow: 'Runner mengambil piring dari heating lamp pass, memeriksa nota pencocokan seat-number (Seat 1 steak medium rare), dan menyajikan hidangan dari sisi kiri tamu dengan sopan.',
        systemTrigger: 'TICKET_STATUS_UPDATED to READY_FOR_RUNNER',
        apiTrigger: 'PATCH /api/v1/kitchen/tickets/{ticketId}/status',
        dbImpact: 'Catat prep_time_seconds, ubah status ticket item menjadi "served".'
      },
      {
        stepNumber: 5,
        phaseName: 'Penagihan & Reset Meja',
        actor: 'Kasir / Pramusaji & Bussing Staff',
        actionSummary: 'Tamu meminta bill, waiter mencetak struk atau menerima kartu/QRIS via mobile EDC di meja, staf membersihkan meja.',
        detailFlow: 'Kasir menyelesaikan pembayaran (PAID). Stok bahan resep BOM dipotong secara permanen. Status meja berubah menjadi BUSSING (dibersihkan) lalu kembali VACANT hijau di POS hostess.',
        systemTrigger: 'ORDER_SETTLED & TABLE_RELEASED',
        apiTrigger: 'POST /api/v1/orders/{orderId}/checkout',
        dbImpact: 'Eksekusi mutasi stock OUT_SALE via ACID transaction, update table state ke "vacant".'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Tablet Pramusaji (Android/iOS PWA 8"-10")', 'Layar Dapur KDS (Touchscreen 21.5")', 'Layar Expo Pass Dapur (15")', 'Kasir POS Utama (Dual-screen 15.6")'],
      hardwareRequired: ['Mobile POS Handheld (Sunmi/PAX) dengan Thermal Printer 58mm', 'Network KDS Wall Mount IP65 di Dapur', 'Router Wi-Fi Dual Band Dual SSID (Staff/POS isolated)', 'Thermal Receipt Printer 80mm ESC/POS'],
      protocols: [
        { protocol: 'WebSocket (WSS)', usage: 'Sinkronisasi instan status meja, pesanan baru, dan tombol Fire Course', targetDeviceOrService: 'Tablet Waiter <-> Node.js Server <-> KDS Dapur' },
        { protocol: 'REST JSON API (HTTPS)', usage: 'Submit order awal, checkout pembayaran, dan audit void', targetDeviceOrService: 'POS Client -> Backend API Server' },
        { protocol: 'ESC/POS over TCP (Port 9100)', usage: 'Pencetakan tiket pesanan cadangan dan nota kasir langsung ke printer IP', targetDeviceOrService: 'Backend Server -> Kitchen Printer Epson' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/orders/table-order',
          description: 'Submit order meja baru dengan pemetaan seat number dan coursing',
          samplePayload: '{\n  "table_id": "T-04",\n  "guest_count": 3,\n  "items": [\n    { "menu_id": "STK-WAGYU", "seat_number": 1, "course": "MAIN", "notes": "Medium Rare" },\n    { "menu_id": "SUP-MUSHROOM", "seat_number": 1, "course": "STARTER" }\n  ]\n}',
          sampleResponse: '{\n  "order_id": "ORD-20261029-0012",\n  "status": "active",\n  "held_courses": ["MAIN"],\n  "fired_courses": ["STARTER"]\n}'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/orders/{orderId}/fire-course',
          description: 'Memicu memasak hidangan utama / penutup setelah starter selesai',
          samplePayload: '{ "course": "MAIN", "waiter_pin": "1042" }',
          sampleResponse: '{ "order_id": "ORD-20261029-0012", "course_fired": "MAIN", "kds_countdown_seconds": 900 }'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Dua Fase: Soft Hold saat pesanan dikonfirmasi waiter, Hard Deduct saat nota dibayar lunas / checkout.',
        logic: 'Pecah resep Bill of Materials (BOM). Misal 1 Tenderloin Steak memotong 200g Daging Sapi Chilled, 30g Butter, 150g Kentang.',
        bomMapping: '1 Menu Item = N Bahan Baku mentah di tabel `recipe_bom_items`.',
        spoilageAndWaste: 'Jika steak gosong saat dimasak, koki menekan "Log Waste Dapur" di KDS untuk memotong 200g daging tambahan sebagai kerugian produksi.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'PostgreSQL Row-Level Locking (`SELECT stock_qty FROM inventory_items WHERE id = ? FOR UPDATE`).',
        raceConditionHandling: 'Mencegah 2 waiter menjual porsi steak terakhir yang tersisa bersamaan. Transaksi kedua mendapat pesan "Out of Stock".',
        rollbackPolicy: 'Jika order di-VOID oleh manajer sebelum dimasak, status dibatalkan dan kuota reservasi bahan dikembalikan utuh.'
      },
      offlineResilience: {
        localPersistence: 'Tablet Waiter menyimpan keranjang order di IndexedDB lokal browser jika sinyal Wi-Fi terputus sesaat.',
        syncStrategy: 'Background sync worker otomatis mengunggah saat koneksi Wi-Fi pulih dengan Idempotency-Key unik.',
        conflictResolution: 'Server-wins timestamp: jika meja terlanjur ditutup dari kasir lain, order offline ditahan untuk konfirmasi supervisor.'
      },
      developerChecklist: [
        'Implementasikan state machine status meja (VACANT, OCCUPIED, ORDERED, BILL_PRINTED, BUSSING)',
        'Buat modul fire-coursing di KDS agar hidangan utama tidak dimasak terlalu cepat',
        'Gunakan WebSocket room berbasis `table_{id}` untuk sinkronisasi antar tablet pramusaji',
        'Sediakan offline storage di tablet waiter agar tidak macet saat signal dead zone di sudut resto'
      ]
    },
    sampleJsonPayload: '{\n  "event": "TABLE_ORDER_PLACED",\n  "table_id": "T-04",\n  "waiter": "Budi Santoso",\n  "courses": [\n    {\n      "course": "STARTER",\n      "items": [{ "sku": "SUP-01", "name": "Cream Soup", "qty": 1, "seat": 1 }]\n    },\n    {\n      "course": "MAIN",\n      "items": [{ "sku": "STK-02", "name": "Sirloin 200g", "qty": 1, "seat": 1, "temp": "Medium" }]\n    }\n  ]\n}'
  },

  // 1.2 French Service
  {
    id: 'french_service',
    categoryId: 'table_service',
    categoryName: 'Pelayanan Meja',
    name: 'French Service (Gueridon / Cart / Flambé)',
    englishTitle: 'Gueridon Trolley Table-side Cooking Service',
    badge: 'GUERIDON & FLAMBÉ',
    badgeColor: 'bg-amber-600 text-white',
    overview: 'Makanan dimasak sebagian (par-cooked) di dapur utama, lalu dibawa ke hadapan tamu menggunakan meja dorong khusus (gueridon trolley). Chef de Rang menyelesaikan racikan saus, mengukir daging (carving), atau menyalakan api flambé tepat di samping meja tamu.',
    targetVenues: ['Fine Dining Klasik Prancis', 'Luxury Hotel Restaurant', 'Specialty Steak & Chateaubriand House', 'High-End Seafood Lounge'],
    metrics: {
      turnaroundTime: '90 - 150 Menit',
      laborIntensity: 'Sangat Tinggi',
      techReliance: 'Sedang',
      wasteRiskLevel: 'Tinggi',
      averageCheckSize: 'Luxury/Ultra'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Reservasi Spesial & Par-Cook Dapur',
        actor: 'Hostess & Sous Chef',
        actionSummary: 'Tamu memesan hidangan gueridon khusus (misal Crepes Suzette / Chateaubriand). Dapur menyiapkan par-cook setengah matang.',
        detailFlow: 'Dapur utama memanggang daging hingga 60% kematangan dan menyiapkan baki bahan pelengkap (cognac, butter, bumbu, garnish) di troli.',
        systemTrigger: 'SPECIAL_PREP_TICKET_GENERATED',
        apiTrigger: 'POST /api/v1/kitchen/gueridon-prep',
        dbImpact: 'Catat pre-allocated inventory untuk trolley batch.'
      },
      {
        stepNumber: 2,
        phaseName: 'Gueridon Positioning di Samping Meja',
        actor: 'Chef de Rang / Sommelier',
        actionSummary: 'Troli gueridon dengan kompor gas butana portabel dan perlengkapan perak diposisikan di sisi kanan meja tamu.',
        detailFlow: 'Staf memeriksa kesiapan burner kompor, piring pemanas (rechaud), dan safety distance api flambé dari tamu.',
        systemTrigger: 'TROLLEY_DEPLOYED event',
        apiTrigger: 'PATCH /api/v1/tables/{tableId}/service-state',
        dbImpact: 'Update status meja ke "tableside_cooking_active".'
      },
      {
        stepNumber: 3,
        phaseName: 'Live Cooking, Carving & Flambé',
        actor: 'Chef de Rang',
        actionSummary: 'Chef memasak saus, memotong daging chateaubriand secara presisi, menuang Grand Marnier / Cognac, dan menyulut atraksi flambé.',
        detailFlow: 'Chef de Rang menjelaskan profil rasa dan bahan baku sambil memasak di depan tamu secara interaktif.',
        systemTrigger: 'TABLESIDE_COOKING_IN_PROGRESS',
        apiTrigger: 'POST /api/v1/kitchen/log-tableside-step',
        dbImpact: 'Catat waktu mulai dan durasi show memasak meja.'
      },
      {
        stepNumber: 4,
        phaseName: 'Penataan Piring Hangat & Penyajian',
        actor: 'Commis de Rang (Asisten Waiter)',
        actionSummary: 'Makanan dipindahkan dari wajan gueridon ke piring hangat porselen, disajikan dari sisi kanan tamu.',
        detailFlow: 'Saus dituangkan perlahan, garnish microgreens ditata, piring ditaruh tepat di hadapan tamu lengkap dengan sendok-garpu perak baru.',
        systemTrigger: 'ITEM_SERVED_TO_GUEST',
        apiTrigger: 'PATCH /api/v1/orders/{orderId}/items/{itemId}/served',
        dbImpact: 'Status item menjadi "completed_serving".'
      },
      {
        stepNumber: 5,
        phaseName: 'Pencatatan Spirit Pour & Pembayaran',
        actor: 'Sommelier / Kasir',
        actionSummary: 'Pencatatan liquor/spirit yang terpakai untuk flambé dan wine pairing, diselesaikan dengan tagihan meja premium.',
        detailFlow: 'Tablet staf mencatat takaran alkohol (misal: 60ml Martell VSOP untuk flambé). Nota dicetak dengan rincian hidangan gourmet.',
        systemTrigger: 'LIQUOR_DISPENSE_LOGGED & CHECKOUT',
        apiTrigger: 'POST /api/v1/inventory/liquor-pour',
        dbImpact: 'Potong saldo botol alkohol per mililiter (ml) dari gudang cellar.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Tablet Kapten Resto / Sommelier (iPad Pro / Samsung Tab)', 'Kitchen Display System Dapur Utama', 'POS Terminal Kasir Master'],
      hardwareRequired: ['Bluetooth Precision Digital Scale (untuk timbang caviar / truffles per gram)', 'Tablet Sommelier Portabel', 'Thermal Bill Printer 80mm'],
      protocols: [
        { protocol: 'REST JSON (HTTPS)', usage: 'Reservasi paket degustasi dan log timbangan truffle/caviar', targetDeviceOrService: 'Tablet Kapten -> Backend Server' },
        { protocol: 'Server-Sent Events (SSE)', usage: 'Notifikasi countdown waktu prep par-cook dapur ke troli', targetDeviceOrService: 'Dapur Utama -> Tablet Waiter' },
        { protocol: 'Bluetooth LE (BLE)', usage: 'Membaca timbangan digital bahan premium per 0.1 gram langsung ke input form', targetDeviceOrService: 'Digital Scale -> Tablet Waiter' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/inventory/liquor-pour',
          description: 'Mencatat takaran alkohol/spirit untuk saus dan atraksi flambé meja dalam satuan mililiter',
          samplePayload: '{\n  "bottle_barcode": "BTL-COG-VSOP-001",\n  "pour_volume_ml": 60,\n  "table_id": "VIP-01",\n  "purpose": "flambe_crepes_suzette"\n}',
          sampleResponse: '{\n  "status": "success",\n  "remaining_bottle_ml": 480,\n  "cost_allocated": 72000\n}'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Dual-Stage: Pemotongan par-cook daging di dapur utama + Pemotongan live ad-hoc spirit/truffle via tablet saat cooking selesai.',
        logic: 'BOM multi-satuan (Kg untuk daging, Gram untuk truffle musim gugur, Mililiter untuk cognac flambé).',
        bomMapping: '1 Porsi Chateaubriand = 450g Daging Tenderloin Prime + 60ml Cognac + 40g Butter Truffle.',
        spoilageAndWaste: 'Jika flambe gagal atau saus gosong di gueridon, koki mencatat emergency replacement di tablet untuk re-order cepat ke dapur.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'Database reservation holding pada botol wine/spirit langka bernomor seri (Unique Serialized Bottle ID).',
        raceConditionHandling: 'Mencegah 2 sommelier mengalokasikan botol vintage tahun 1982 yang sama ke 2 meja VIP berbeda.',
        rollbackPolicy: 'Pengembalian botol yang belum dibuka ke rak cellar bersuhu terkontrol via form return.'
      },
      offlineResilience: {
        localPersistence: 'Local SQLite di tablet sommelier menyimpan log pour alkohol jika sinyal basement cellar lemah.',
        syncStrategy: 'Auto-sync saat tablet terdeteksi berada di radius AP Wi-Fi lantai atas.',
        conflictResolution: 'Strict audit review oleh F&B Director jika terjadi selisih mililiter botol.'
      },
      developerChecklist: [
        'Dukungan satuan desimal mililiter (ml) dan gram (g) pada tabel inventory transaksi',
        'Integrasi Bluetooth Web API (Web Bluetooth) untuk membaca timbangan gramasi secara otomatis',
        'Fitur pencatatan wine pairing & spirit allocation dengan nomor batch botol spesifik'
      ]
    },
    sampleJsonPayload: '{\n  "service_type": "FRENCH_GUERIDON",\n  "table_id": "VIP-02",\n  "action": "TABLESIDE_FLAMBE_EXECUTED",\n  "ingredients_consumed": [\n    { "ingredient_code": "ING-BEEF-TENDER", "qty": 0.45, "unit": "kg" },\n    { "ingredient_code": "ING-COGNAC-MARTELL", "qty": 60, "unit": "ml" }\n  ]\n}'
  },

  // 1.3 Russian / Silver Service
  {
    id: 'russian_service',
    categoryId: 'table_service',
    categoryName: 'Pelayanan Meja',
    name: 'Russian / Silver Service',
    englishTitle: 'Silver Platter & Spoon-Fork Transfer Service',
    badge: 'SILVER PLATTER',
    badgeColor: 'bg-slate-700 text-white',
    overview: 'Makanan dimasak dan dihias lengkap di dapur di atas baki nampan perak besar (silver platter) dengan cloche penutup. Pramusaji membawa baki ke meja, lalu menggunakan jepitan sendok dan garpu perak untuk memindahkan porsi makanan ke piring tamu dari sisi kiri.',
    targetVenues: ['Banquet Hall Hotel Bintang 5', 'State Dinners / Kedutaan', 'Ballroom Gala Event', 'Traditional Luxury Club'],
    metrics: {
      turnaroundTime: '60 - 120 Menit',
      laborIntensity: 'Tinggi',
      techReliance: 'Sedang',
      wasteRiskLevel: 'Sedang',
      averageCheckSize: 'Premium'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Setting Meja & Penataan Cover',
        actor: 'Staf Banquet / Waiter',
        actionSummary: 'Meja tamu ditata dengan show plate/cover kosong, sendok garpu perak, dan gelas goblet kristal.',
        detailFlow: 'Staf banquet mengonfirmasi jumlah kursi (misal 10 pax per meja bundar) di master banquet plan POS.',
        systemTrigger: 'BANQUET_TABLE_VERIFIED',
        apiTrigger: 'POST /api/v1/banquet/tables/{tableId}/confirm-setup',
        dbImpact: 'Kunci kapasitas meja dan alokasi menu banquet.'
      },
      {
        stepNumber: 2,
        phaseName: 'Batch Cooking & Perakitan Silver Platter',
        actor: 'Kitchen Banquet Production',
        actionSummary: 'Dapur memasak makanan dalam jumlah besar, menatanya di atas baki perak untuk 8-10 porsi per baki.',
        detailFlow: 'KDS Dapur Banquet menampilkan tiket "Baki Silver Meja 6 (10 Porsi Roast Beef, 20 Porsi Sayur Glaze)". Koki menutup baki dengan cloche perak penghangat.',
        systemTrigger: 'BANQUET_PLATTER_READY',
        apiTrigger: 'PATCH /api/v1/kitchen/banquet-platters/{platterId}/ready',
        dbImpact: 'Update status baki menjadi siap dijemput pramusaji.'
      },
      {
        stepNumber: 3,
        phaseName: 'Penyajian Menggunakan Jepitan Perak',
        actor: 'Silver Service Waiter',
        actionSummary: 'Pramusaji membawa baki perak di tangan kiri, menyajikan dari sisi kiri tamu menggunakan sendok di atas garpu sebagai jepitan.',
        detailFlow: 'Porsi daging dan saus dipindahkan ke piring tamu dengan hati-hati secara merata mengelilingi meja berlawanan arah jarum jam.',
        systemTrigger: 'TABLE_SERVING_COMPLETED',
        apiTrigger: 'POST /api/v1/banquet/tables/{tableId}/log-course-served',
        dbImpact: 'Catat waktu selesai saji per meja.'
      },
      {
        stepNumber: 4,
        phaseName: 'Penawaran Porsi Tambahan (Second Helping)',
        actor: 'Silver Service Waiter',
        actionSummary: 'Jika baki perak masih memiliki sisa porsi hangat, pelayan berkeliling menawarkan porsi tambahan kepada tamu.',
        detailFlow: 'Pelayan melayani tamu yang ingin menambah daging atau kentang panggang langsung dari baki.',
        systemTrigger: 'SECOND_HELPING_SERVED',
        apiTrigger: 'POST /api/v1/banquet/log-second-helping',
        dbImpact: 'Catat konsumsi porsi aktual baki.'
      },
      {
        stepNumber: 5,
        phaseName: 'Clearing Piring & Rekonsiliasi Event',
        actor: 'Banquet Captain & Kasir Event',
        actionSummary: 'Piring kotor diangkat dari sisi kanan tamu, rekonsiliasi total pax banquet dihitung untuk pelunasan BEO.',
        detailFlow: 'Sistem mencocokkan Banquet Event Order (BEO) yang ditandatangani panitia dengan jumlah pax riil yang hadir.',
        systemTrigger: 'BEO_FINAL_SETTLEMENT',
        apiTrigger: 'POST /api/v1/banquet/events/{eventId}/settlement',
        dbImpact: 'Kalkulasi total nilai kontrak banquet, tutup invoice, potong stok massal.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Banquet Master Control Console (Laptop/Desktop)', 'Mobile Handheld Scanner RFID Pax Tamu', 'KDS Banquet Dapur Masal'],
      hardwareRequired: ['Central Banquet POS Station', 'Barcode/QR Badge Scanner Tamu Undangan', 'Thermal Label Baki Dapur'],
      protocols: [
        { protocol: 'WebSocket (WSS)', usage: 'Sinkronisasi serentak waktu drop hidangan ke 50 meja banquet', targetDeviceOrService: 'Banquet Controller -> Kitchen KDS & Captain Tablets' },
        { protocol: 'REST JSON (HTTPS)', usage: 'BEO (Banquet Event Order) manajemen dan penagihan korporat', targetDeviceOrService: 'Event Management Client -> Database' },
        { protocol: 'RFID NFC (ISO 14443A)', usage: 'Absensi dan validasi pax tamu undangan di meja registrasi', targetDeviceOrService: 'Badge Scanner -> Registrasi POS' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/banquet/events/{eventId}/settlement',
          description: 'Penyelesaian pembayaran acara banquet multi-pax berdasarkan BEO dan porsi nampan',
          samplePayload: '{\n  "event_id": "EVT-GALA-202610",\n  "guaranteed_pax": 200,\n  "actual_pax_scanned": 215,\n  "overage_rate_per_pax": 350000\n}',
          sampleResponse: '{\n  "total_bill": 75250000,\n  "deposit_paid": 50000000,\n  "balance_due": 25250000,\n  "status": "invoiced"\n}'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Batch Platter Deduction: Stok dipotong per loyang nampan besar (batch BOM multiplier) saat makanan keluar dari dapur utama.',
        logic: '1 Baki Silver Service = 8 porsi x gramasi standar resep. Misal 1.6kg Daging Sapi Pilihan per nampan.',
        bomMapping: 'Grouped Table BOM (Porsi Meja = Total Pax Kursi Meja).',
        spoilageAndWaste: 'Sisa makanan di nampan perak yang tidak diambil tamu dicatat sebagai banquet yield variance.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'Table Batch Locking agar tidak ada duplikasi pengiriman baki perak ke meja yang sama oleh dua runner.',
        raceConditionHandling: 'Sistem KDS menandai baki meja X "LOCKED_IN_TRANSIT" begitu runner men-scan barcode baki.',
        rollbackPolicy: 'Penyesuaian pengurangan porsi jika meja dibatalkan sebelum baki keluar dari pass kitchen.'
      },
      offlineResilience: {
        localPersistence: 'Master Banquet Controller berjalan di Local Server On-Premise agar tidak tergantung internet ISP publik.',
        syncStrategy: 'Event sinkron ke Cloud ERP hotel setiap 15 menit.',
        conflictResolution: 'Local server memiliki wewenang master (Authoritative Node).'
      },
      developerChecklist: [
        'Dukungan modul Banquet Event Order (BEO) dengan hitungan pax massal',
        'Fitur batch printing tiket nampan dapur dengan QR code verifikasi meja',
        'Integrasi kartu registrasi RFID tamu untuk akurasi hitungan pax riil'
      ]
    },
    sampleJsonPayload: '{\n  "banquet_table_id": "TBL-06",\n  "course_name": "Main - Roasted Prime Rib",\n  "platter_barcode": "PLT-88219",\n  "portions_on_tray": 10,\n  "served_by": "Staff #22",\n  "timestamp": "2026-10-29T20:15:00Z"\n}'
  },

  // 1.4 English Service
  {
    id: 'english_service',
    categoryId: 'table_service',
    categoryName: 'Pelayanan Meja',
    name: 'English Service (Family Style)',
    englishTitle: 'Communal Sharing / Host Carving Service',
    badge: 'FAMILY SHARING',
    badgeColor: 'bg-teal-600 text-white',
    overview: 'Makanan disajikan dalam porsi besar (sharing platters) di mangkuk atau pinggan keramik di tengah meja. Tamu saling berbagi makanan atau tuan rumah meja (host) menuangkan hidangan ke piring anggota keluarga lainnya.',
    targetVenues: ['Chinese Restaurant (Meja Putar Lazy Susan)', 'Restoran Keluarga Tradisional', 'Seafood Panggang Kiloan', 'Middle Eastern Mandhi Feast'],
    metrics: {
      turnaroundTime: '50 - 90 Menit',
      laborIntensity: 'Sedang',
      techReliance: 'Sedang',
      wasteRiskLevel: 'Rendah',
      averageCheckSize: 'Menengah'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Penyambutan & Pemilihan Meja Bundar',
        actor: 'Hostess & Tamu',
        actionSummary: 'Keluarga besar duduk di meja bundar berputar (lazy susan) berkapasitas 6 - 12 orang.',
        detailFlow: 'Hostess memilih meja T-ROUND-08 di POS dan mengatur status meja menjadi grup sharing.',
        systemTrigger: 'TABLE_OPENED_COMMUNAL',
        apiTrigger: 'POST /api/v1/tables/communal-session',
        dbImpact: 'Buat sesi meja dengan parameter shared_check: true.'
      },
      {
        stepNumber: 2,
        phaseName: 'Pemesanan Set Menu & Porsi Kiloan',
        actor: 'Pramusaji',
        actionSummary: 'Pramusaji membantu memilih paket keluarga (Paket 6 Orang) atau menu lauk porsi Small/Medium/Large.',
        detailFlow: 'Waiter memasukkan: 1 Gurame Asam Manis (L - 800g), 1 Kepiting Saus Padang (1.2 Kg), 2 Bakul Nasi Putih, 1 Sayur Kangkung Hotplate (M).',
        systemTrigger: 'ORDER_FAMILY_STYLE_SUBMITTED',
        apiTrigger: 'POST /api/v1/orders/family-order',
        dbImpact: 'Kalkulasi BOM dinamis berdasarkan bobot timbangan gramasi dan atribut size lauk.'
      },
      {
        stepNumber: 3,
        phaseName: 'KDS Synchronous Firing',
        actor: 'KDS Dapur Wok & Seafood',
        actionSummary: 'Dapur mengoordinasikan waktu masak agar semua lauk tengah matang hampir bersamaan.',
        detailFlow: 'KDS menampilkan label `COMMUNAL_SYNC`. Layar memberi peringatan jika sayur matang terlalu dini mendahului ikan goreng agar makanan tidak dingin di meja pass.',
        systemTrigger: 'KITCHEN_COMMUNAL_PASS_READY',
        apiTrigger: 'PATCH /api/v1/kitchen/tickets/{ticketId}/sync-drop',
        dbImpact: 'Catat kesiapan seluruh wadah tengah dalam 1 batch saji.'
      },
      {
        stepNumber: 4,
        phaseName: 'Penyajian di Meja Putar (Lazy Susan)',
        actor: 'Food Runner & Tuan Rumah Meja',
        actionSummary: 'Wadah hidangan ditaruh merata di atas kaca putar meja. Pramusaji menyediakan sendok lauk khusus (serving spoons).',
        detailFlow: 'Tamu memutar meja dan mengambil lauk secara mandiri, atau tuan rumah memotongkan ikan untuk orang tua/anak.',
        systemTrigger: 'COMMUNAL_DISHES_PLACED',
        apiTrigger: 'POST /api/v1/orders/{orderId}/all-dishes-served',
        dbImpact: 'Status order berubah menjadi active_dining.'
      },
      {
        stepNumber: 5,
        phaseName: 'Refill Nasi/Teh & Pembayaran Tunggal',
        actor: 'Pramusaji & Kasir',
        actionSummary: 'Pramusaji mengisi ulang bakul nasi atau teko teh herbal, lalu tagihan dibayar lunas oleh kepala keluarga.',
        detailFlow: 'Kasir mencetak single nota tagihan. Sistem mendukung opsi split bill per anggota keluarga jika diminta.',
        systemTrigger: 'CHECKOUT_AND_COMMUNAL_CLOSE',
        apiTrigger: 'POST /api/v1/orders/{orderId}/checkout',
        dbImpact: 'Potong stok ikan per gram dan sayur per ikat, tutup sesi meja.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Tablet POS Waiter', 'KDS Dapur Wok/Seafood dengan Batch Synchronizer', 'Kasir POS Layar Sentuh'],
      hardwareRequired: ['Timbangan Digital Ikan Hidup (Live Seafood Scale Serial/BLE)', 'Wireless Table Call Bell di Meja', 'Printer Kasir 80mm'],
      protocols: [
        { protocol: 'WebSocket (WSS)', usage: 'Koordinasi sinkronisasi penyajian hidangan tengah di KDS pass', targetDeviceOrService: 'Wok KDS <-> Fryer KDS <-> Expo Screen' },
        { protocol: 'Serial RS232 / BLE', usage: 'Input berat ikan/kepiting hidup dari timbangan digital ke POS', targetDeviceOrService: 'Digital Scale -> POS Tablet' },
        { protocol: 'RF 433MHz / Zigbee', usage: 'Penerima tombol panggil pelayan (Call / Bill / Water Refill) dari meja', targetDeviceOrService: 'Table Button -> POS / Waiter Wristband' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/orders/family-order',
          description: 'Submit pesanan keluarga dengan porsi sharing dan berat timbangan aktual',
          samplePayload: '{\n  "table_id": "T-ROUND-08",\n  "items": [\n    { "menu_id": "IKAN-GURAME", "portion_size": "L", "weight_grams": 820, "cooking_style": "ASAM_MANIS" },\n    { "menu_id": "NASI-BAKUL", "qty": 2 }\n  ]\n}',
          sampleResponse: '{\n  "order_id": "ORD-FAM-1092",\n  "calculated_price": 184500,\n  "status": "in_kitchen"\n}'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Deduction saat penimbangan ikan hidup atau saat checkout transaksi.',
        logic: 'Pengurangan stok bobot variabel (Variable Weight Item) dikalikan gramasi riil yang terbaca dari timbangan.',
        bomMapping: '1 Porsi Gurame Asam Manis = Berat Ikan Hidup Riil (g) + Saus Asam Manis (150ml) + Nanas/Paprika (80g).',
        spoilageAndWaste: 'Pencatatan mortalitas ikan hidup di akuarium via modul "Aquarium Loss Log".'
      },
      concurrencyAndLocking: {
        lockMechanism: 'Optimistic Concurrency Control dengan field version pada order sharing multi-waiter.',
        raceConditionHandling: 'Dua waiter tidak bisa menambah lauk tambahan yang sama secara ganda berkat idempotency key per tombol kirim.',
        rollbackPolicy: 'Void item menuntut supervisor pin dan alasan pembatalan jika ikan belum disembelih.'
      },
      offlineResilience: {
        localPersistence: 'POS menyimpan master daftar harga timbangan per gram di memori lokal.',
        syncStrategy: 'Order tetap bisa dicetak ke dapur lokal via jaringan switch LAN tanpa internet luar.',
        conflictResolution: 'Local server resolver.'
      },
      developerChecklist: [
        'Dukungan penetapan harga berbasis berat dinamis (Price per 100g / Kg) dari timbangan digital',
        'Fitur grouping tiket KDS dengan rule "Serve Together" (hidangan disajikan serentak di meja tengah)',
        'Integrasi tombol panggil pelayan di meja (Table Call Bell Paging)'
      ]
    },
    sampleJsonPayload: '{\n  "service_model": "ENGLISH_FAMILY_STYLE",\n  "table_id": "T-ROUND-08",\n  "portions": "COMMUNAL_SHARING",\n  "items_count": 6,\n  "serving_mode": "SYNC_DROP_CENTER_TABLE"\n}'
  },

  // 2.1 Counter Service
  {
    id: 'counter_service',
    categoryId: 'counter_self',
    categoryName: 'Pelayanan Konter & Mandiri',
    name: 'Counter Service (Fast-Casual / QSR)',
    englishTitle: 'Front Counter Ordering, Pay First & Buzzer Pickup',
    badge: 'PAY FIRST & PAGER',
    badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    overview: 'Tamu memesan dan membayar langsung di konter/kasir depan sebelum makan (Pay First). Tamu menerima struk nomor antrean atau pager buzzer RFID, lalu mengambil nampan makanan sendiri di pick-up counter saat buzzer bergetar.',
    targetVenues: ['Fast Food / QSR (Burger & Fried Chicken)', 'Kopi & Roti Kekinian', 'Fast Casual Bowl', 'Bakso & Mie Cepat Saji'],
    metrics: {
      turnaroundTime: '15 - 35 Menit',
      laborIntensity: 'Rendah',
      techReliance: 'Tinggi',
      wasteRiskLevel: 'Rendah',
      averageCheckSize: 'Ekonomis'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Antrean Konter & Input Pesanan',
        actor: 'Tamu & Kasir Konter',
        actionSummary: 'Tamu berdiri di depan konter kasir, kasir menginput menu paket combo dengan cepat.',
        detailFlow: 'Kasir menekan layar sentuh POS: Paket Burger Keju + Kentang Goreng + Soda. Layar Customer Facing Display (CFD) menampilkan harga langsung ke tamu.',
        systemTrigger: 'ORDER_CART_BUILT',
        apiTrigger: 'POST /api/v1/counter/order-cart',
        dbImpact: 'Validasi stok real-time (jika kentang habis, tombol disabled).'
      },
      {
        stepNumber: 2,
        phaseName: 'Pembayaran di Muka (Pay First)',
        actor: 'Tamu & Kasir',
        actionSummary: 'Tamu membayar langsung via QRIS dinamis, kartu debit EDC, atau uang tunai di muka.',
        detailFlow: 'QRIS dinamis tampil di layar CFD kasir, tamu scan QRIS dengan mobile banking, sistem menerima webhook pembayaran lunas dalam 1.2 detik.',
        systemTrigger: 'PAYMENT_CONFIRMED & TICKET_DISPATCH',
        apiTrigger: 'POST /api/v1/payments/qris-instant',
        dbImpact: 'Status order seketika menjadi "PAID", ACID potong stok resep BOM.'
      },
      {
        stepNumber: 3,
        phaseName: 'Pemberian Pager Buzzer / Nomor Antrean',
        actor: 'Kasir',
        actionSummary: 'Kasir menyerahkan Pager Buzzer nirkabel nomor #12 dan struk antrean kepada tamu.',
        detailFlow: 'Kasir men-tap Pager #12 ke RFID reader di samping kasir untuk mem-pairing nomor pager dengan `order_id` secara otomatis.',
        systemTrigger: 'PAGER_PAIRED event',
        apiTrigger: 'POST /api/v1/paging/pair-buzzer',
        dbImpact: 'Simpan pairing order_id -> buzzer_number di tabel `active_pagers`.'
      },
      {
        stepNumber: 4,
        phaseName: 'Dapur Assembly & Pengemasan Nampan',
        actor: 'Koki Burger & Packager Dapur',
        actionSummary: 'KDS memisahkan jalur burger dan minuman. Packager mengumpulkan semua item ke atas nampan atau kantong take-away.',
        detailFlow: 'Packager memeriksa kelengkapan pesanan di layar Expo KDS, memasang sedotan dan saus sachet, lalu menekan tombol "Page Guest".',
        systemTrigger: 'KDS_EXPO_COMPLETED',
        apiTrigger: 'POST /api/v1/paging/trigger-buzzer',
        dbImpact: 'Ubah status order menjadi "ready_for_pickup", catat packing_duration.'
      },
      {
        stepNumber: 5,
        phaseName: 'Pemanggilan Pager & Pengambilan Makanan',
        actor: 'Tamu & Staf Pick-up',
        actionSummary: 'Pager #12 di tangan tamu bergetar, berbunyi beep, dan menyala merah. Tamu maju ke konter pick-up menukar pager dengan nampan.',
        detailFlow: 'Staf pick-up meletakkan pager kembali ke dock pengisian daya (charging base) dan menekan "Order Handed Over" di monitor.',
        systemTrigger: 'ORDER_PICKED_UP & PAGER_RETURNED',
        apiTrigger: 'PATCH /api/v1/orders/{orderId}/complete',
        dbImpact: 'Tutup siklus pesanan, lepaskan pairing nomor pager untuk antrean berikutnya.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Dual-Screen POS Terminal Kasir (15.6" Kasir + 10.1" Customer Facing Display)', 'KDS Stasiun Masak Dapur (15")', 'KDS Stasiun Packaging Expo (21.5")', 'Order Status Display (OSD) TV Monitor di atas Konter'],
      hardwareRequired: ['Wireless Buzzer Pager System (Transmitter RF 433MHz + 20 Pagers)', 'Barcode / QR Scanner 2D Omnidirectional', 'Integrated QRIS/EDC Payment Terminal', 'Thermal Struk Printer 80mm High Speed (250mm/s)'],
      protocols: [
        { protocol: 'Serial RS232 / USB HID', usage: 'Mengirim perintah trigger getar ke transmitter pemancar buzzer pager', targetDeviceOrService: 'POS Server -> Pager Base Station' },
        { protocol: 'WebSocket (WSS)', usage: 'Streaming nomor antrean ke TV monitor Order Status Display (OSD)', targetDeviceOrService: 'Server -> Android TV OSD Box' },
        { protocol: 'Webhook HTTPS', usage: 'Menerima notifikasi pelunasan QRIS / E-wallet seketika', targetDeviceOrService: 'Payment Gateway (Xendit/Midtrans) -> Backend' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/paging/pair-buzzer',
          description: 'Memasangkan nomor fisik pager buzzer ke ID order aktif',
          samplePayload: '{ "order_id": "QSR-9982", "buzzer_id": 12 }',
          sampleResponse: '{ "status": "paired", "battery_level": 94 }'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/paging/trigger-buzzer',
          description: 'Memanggil pager tamu agar bergetar dan berbunyi saat pesanan siap diambil',
          samplePayload: '{ "buzzer_id": 12, "vibrate_seconds": 30 }',
          sampleResponse: '{ "status": "dispatched", "signal_ack": true }'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Instant Hard Deduct: Stok bahan baku dipotong seketika saat kasir menekan tombol bayar lunas (status PAID).',
        logic: 'Pemotongan resep BOM baku (1 Bun Roti + 1 Patty Daging Sapi + 1 Slice Keju + 120g Kentang Beku + 1 Paper Cup).',
        bomMapping: 'Packaging item (cup, sedotan, box burger) ikut dimasukkan dalam resep BOM otomatis.',
        spoilageAndWaste: 'Kentang yang sudah digoreng >7 menit dan dingin dicatat via tombol "Discard Warm Holding" di KDS.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'High-throughput ACID transaction dengan Redis In-Memory Stock Counter sebelum commit PostgreSQL.',
        raceConditionHandling: 'Mampu menangani 10 kasir konter melayani 500 transaksi per jam tanpa bottleneck stok.',
        rollbackPolicy: 'Void uang kasir membutuhkan otorisasi manajer dengan PIN supervisor, stok bahan otomatis di-uncommit.'
      },
      offlineResilience: {
        localPersistence: 'POS dapat beroperasi secara Offline Mode penuh menggunakan SQLite lokal jika internet terputus.',
        syncStrategy: 'Order disimpan di antrean lokal (Local Queue) dan di-flush otomatis saat internet online kembali.',
        conflictResolution: 'Nomor nota unik berformat `[POS_ID]-[DATE]-[SEQ]` agar nomor nota tidak bentrok saat offline.'
      },
      developerChecklist: [
        'Integrasikan Customer Facing Display (CFD) untuk menampilkan QRIS dan rincian belanja ke tamu',
        'Buat driver controller RS232 untuk transmitter RF pager buzzer pemanggil antrean',
        'Rancang layar TV antrean publik (OSD) dengan status kolom "Sedang Disiapkan" dan "Siap Diambil"',
        'Pastikan transaksi kasir tetap bisa checkout cepat di bawah 3 detik per pelanggan'
      ]
    },
    sampleJsonPayload: '{\n  "service_type": "COUNTER_SERVICE",\n  "order_code": "QSR-4091",\n  "payment_method": "QRIS_INSTANT",\n  "amount_paid": 54000,\n  "pager_assigned": 12,\n  "target_prep_time_seconds": 300\n}'
  },

  // 2.2 Cafeteria / Line Service
  {
    id: 'cafeteria_service',
    categoryId: 'counter_self',
    categoryName: 'Pelayanan Konter & Mandiri',
    name: 'Cafeteria / Line Service',
    englishTitle: 'Tray Slide Line & Station Point-and-Pick Service',
    badge: 'TRAY SLIDE LINE',
    badgeColor: 'bg-emerald-700 text-white',
    overview: 'Tamu mengambil nampan dan meluncurkannya di atas rel stainless steel (tray slide line), memilih makanan di etalase kaca yang disendokkan staf atau diambil sendiri, lalu membayar di kasir ujung lintasan sebelum duduk di area makan bebas.',
    targetVenues: ['Kantin Korporat / Pabrik', 'Kantin Rumah Sakit', 'Food Court Universitas', 'Prasmanan Nasi Padang Modern / Warteg Modern'],
    metrics: {
      turnaroundTime: '20 - 40 Menit',
      laborIntensity: 'Sedang',
      techReliance: 'Tinggi',
      wasteRiskLevel: 'Sedang',
      averageCheckSize: 'Ekonomis'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Ambil Nampan di Awal Lintasan Rel',
        actor: 'Tamu',
        actionSummary: 'Tamu mengambil nampan plastik, alas kertas, sendok, garpu, dan serbet di stasiun awal.',
        detailFlow: 'Tamu meletakkan nampan di atas rel pipa stainless steel sepanjang 10-15 meter.',
        systemTrigger: 'GUEST_ENTERED_LINE',
        apiTrigger: 'POST /api/v1/cafeteria/footfall-in',
        dbImpact: 'Catat traffic counter pengunjung kantin.'
      },
      {
        stepNumber: 2,
        phaseName: 'Pilihan Makanan per Stasiun (Hot Bain-Marie)',
        actor: 'Tamu & Staf Server Etalase',
        actionSummary: 'Tamu menyusuri stasiun: Salad -> Karbohidrat (Nasi/Pasta) -> Lauk Daging -> Sayur -> Sup -> Minuman & Dessert.',
        detailFlow: 'Staf etalase menyendokkan porsi standar ke piring tamu (misal 1 centong nasi, 1 potong rendang, 1 mangkuk soto).',
        systemTrigger: 'FOOD_DISPENSED_TO_TRAY',
        apiTrigger: 'POST /api/v1/cafeteria/log-station-dispense',
        dbImpact: 'Pengurangan kuota porsi pan gastronorm.'
      },
      {
        stepNumber: 3,
        phaseName: 'Kasir Ujung Lintasan (End-of-Line POS)',
        actor: 'Tamu & Kasir Ujung',
        actionSummary: 'Tamu meluncurkan nampan ke meja kasir di ujung rel lintasan. Kasir mendeteksi item di nampan.',
        detailFlow: 'Kasir men-tap tombol cepat (atau menggunakan Kamera AI / RFID piring pengenal otomatis) untuk menghitung seluruh piring di nampan dalam waktu 3 detik.',
        systemTrigger: 'TRAY_SCANNED_AT_CHECKOUT',
        apiTrigger: 'POST /api/v1/cafeteria/scan-tray',
        dbImpact: 'Kalkulasi total harga item di nampan.'
      },
      {
        stepNumber: 4,
        phaseName: 'Pembayaran Cepat (Tap Kartu RFID / Saldo Pegawai)',
        actor: 'Tamu & Kasir',
        actionSummary: 'Tamu men-tap kartu ID karyawan / badge RFID atau QRIS untuk pembayaran nirsentuh secepat kilat.',
        detailFlow: 'Sistem memotong saldo kartu payroll pegawai atau e-wallet dalam 0.5 detik, struk tercetak, dan tamu melangkah ke ruang makan.',
        systemTrigger: 'EMPLOYEE_CARD_DEDUCTED',
        apiTrigger: 'POST /api/v1/cafeteria/pay-card-tap',
        dbImpact: 'Potong saldo debit kartu pegawai atau bukukan transaksi kasir.'
      },
      {
        stepNumber: 5,
        phaseName: 'Makan & Pengembalian Nampan Mandiri (Tray Return)',
        actor: 'Tamu & Petugas Dishwasher',
        actionSummary: 'Tamu menyantap makanan di meja bebas, lalu membawa nampan kotor ke rak pengembalian (tray return station).',
        detailFlow: 'Pemisahan sisa makanan basah dan alat makan di stasiun pencucian piring untuk audit waste harian.',
        systemTrigger: 'TRAY_RETURN_LOGGED',
        apiTrigger: 'POST /api/v1/cafeteria/tray-return-audit',
        dbImpact: 'Catat waktu selesai santap dan durasi perputaran nampan.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Rapid Cashier POS Ujung Rel (Touchscreen 15.6")', 'Station Monitoring Tablet untuk Refill Loyang Dapur', 'Customer Balance Reader Screen'],
      hardwareRequired: ['RFID Card Reader Mifare 13.56MHz (Integrasi ID Karyawan)', 'Overhead Tray Camera AI (Opsional untuk pengenalan visual piring otomatis)', 'Thermal Receipt Printer', 'Display Suhu IoT Bain-Marie'],
      protocols: [
        { protocol: 'REST JSON (HTTPS)', usage: 'Integrasi ke HRIS Payroll perusahaan untuk pemotongan saldo makan harian', targetDeviceOrService: 'POS Server -> Corporate HRIS API' },
        { protocol: 'MQTT over TLS', usage: 'Telemetri sensor suhu air panas hot bain-marie food warmer (>65°C)', targetDeviceOrService: 'IoT Temperature Probes -> Dashboard HACCP' },
        { protocol: 'USB HID / PC/SC', usage: 'Pembacaan kartu ID pegawai RFID instan (<200ms per tap)', targetDeviceOrService: 'Card Reader -> POS Client' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/cafeteria/pay-card-tap',
          description: 'Pembayaran cepat via tap kartu identitas pegawai / RFID kantin',
          samplePayload: '{\n  "badge_rfid": "E200-4491-0082",\n  "total_amount": 28000,\n  "tray_items": [\n    { "item_sku": "NASI-PUTIH", "price": 5000 },\n    { "item_sku": "AYAM-GORENG", "price": 18000 },\n    { "item_sku": "SOP-SAYUR", "price": 5000 }\n  ]\n}',
          sampleResponse: '{\n  "employee_name": "Agus Pratama",\n  "balance_before": 250000,\n  "balance_after": 222000,\n  "status": "APPROVED"\n}'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Dual Level: Level Dapur memotong batch bahan saat memasak loyang Gastronorm (GN Pan 1/1 = 30 porsi). Level Kasir menghitung porsi terjual.',
        logic: 'Rekonsiliasi harian: Total Porsi Masak Loyang vs Total Porsi Terjual di Kasir = Sisa/Selisih Porsi.',
        bomMapping: '1 Batch Masak Dapur = Resep Panci Besar (100 porsi). 1 Penjualan Kasir = 1 porsi satuan.',
        spoilageAndWaste: 'Sisa makanan di dasar loyang saat kantin tutup ditimbang dan dicatat sebagai food waste harian.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'High-speed row-level locking pada akun saldo pegawai dengan isolation level READ COMMITTED.',
        raceConditionHandling: 'Pencegahan double-tap kartu pegawai dalam jeda < 3 detik (Double Tap Guard lock).',
        rollbackPolicy: 'Kasir salah input item dapat di-void instan sebelum tamu beranjak dari garis rel.'
      },
      offlineResilience: {
        localPersistence: 'POS menyimpan whitelist UID kartu pegawai dan saldo batas harian di database SQLite lokal.',
        syncStrategy: 'Dapat memotong saldo secara offline (Store and Forward) dan di-rekonsiliasi ke server pusat saat malam hari.',
        conflictResolution: 'Saldo negatif ditagihkan ke payroll bulan berikutnya.'
      },
      developerChecklist: [
        'Dukungan integrasi kartu ID RFID pegawai (Mifare Classic / Desfire / NFC)',
        'Sistem double-tap prevention agar saldo tidak terpotong dua kali tanpa sengaja',
        'Layar ringkasan saldo yang langsung terlihat oleh tamu saat men-tap kartu',
        'Modul rekonsiliasi loyang batch dapur vs jumlah porsi yang melewati kasir'
      ]
    },
    sampleJsonPayload: '{\n  "service": "CAFETERIA_LINE",\n  "line_id": "LANE-01",\n  "tray_scanned_items_count": 4,\n  "total_checkout_ms": 1850,\n  "payment": "RFID_PAYROLL_DEDUCT"\n}'
  },

  // 2.3 Buffet (Prasmanan / All-You-Can-Eat)
  {
    id: 'buffet_ayce',
    categoryId: 'counter_self',
    categoryName: 'Pelayanan Konter & Mandiri',
    name: 'Buffet (Prasmanan / All-You-Can-Eat - AYCE)',
    englishTitle: 'All-You-Can-Eat & Self-Service Buffet Station',
    badge: 'AYCE & REFILL PATROL',
    badgeColor: 'bg-rose-600 text-white',
    overview: 'Tamu membayar paket tarif tetap (flat-rate per pax) atau skema timbang piring, lalu mengambil sendiri makanan sepuasnya dari meja saji prasmanan dalam batasan durasi waktu tertentu (misal 90 menit). Dilengkapi sensor patroli isi ulang loyang dan denda sisa makanan (waste charge penalty).',
    targetVenues: ['Restoran AYCE Shabu-Shabu & BBQ', 'Hotel Breakfast Buffet', 'Prasmanan Pernikahan', 'Mongolian Grill Buffet'],
    metrics: {
      turnaroundTime: '90 - 120 Menit (Fixed Timer)',
      laborIntensity: 'Sedang',
      techReliance: 'Tinggi',
      wasteRiskLevel: 'Kritis',
      averageCheckSize: 'Premium'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Check-In Paket & Mulai Timer Sesi',
        actor: 'Hostess / Kasir & Tamu',
        actionSummary: 'Tamu memilih paket AYCE (Standard / Premium Wagyu) dan mendaftarkan jumlah tamu dewasa/anak.',
        detailFlow: 'Hostess mencetak tiket meja yang memuat Countdown Timer 90 Menit dan QR code meja untuk pesanan item daging khusus ke dapur.',
        systemTrigger: 'AYCE_SESSION_STARTED',
        apiTrigger: 'POST /api/v1/buffet/start-session',
        dbImpact: 'Buat sesi AYCE: status active, start_time, end_time = now + 90 min.'
      },
      {
        stepNumber: 2,
        phaseName: 'Pengambilan Makanan Mandiri di Buffet Island',
        actor: 'Tamu',
        actionSummary: 'Tamu mengambil sendiri sayur, bakso, bumbu saus racikan, minuman, dan es krim dari pulau prasmanan.',
        detailFlow: 'Tamu bebas bolak-balik mengambil makanan tanpa perlu mencatat setiap piring di kasir.',
        systemTrigger: 'SELF_SERVICE_ACTIVE',
        apiTrigger: 'POST /api/v1/buffet/self-service-traffic',
        dbImpact: 'Catat estimasi konsumsi per pax.'
      },
      {
        stepNumber: 3,
        phaseName: 'Sensor Patroli Refill Chafing Dish Dapur',
        actor: 'Staf Patroli Buffet & Dapur',
        actionSummary: 'Staf memeriksa sisa loyang di meja saji. Jika makanan sisa < 20%, staf menekan tombol "Request Refill" di tablet patroli.',
        detailFlow: 'Dapur utama langsung memasak batch baru 5kg nasi goreng / kuah kaldu shabu untuk dituangkan ke loyang pemanas tamu.',
        systemTrigger: 'BUFFET_STATION_REFILL_REQUESTED',
        apiTrigger: 'POST /api/v1/buffet/stations/{stationId}/refill',
        dbImpact: 'Dapur memotong stok bahan baku batch saat makanan baru dituangkan.'
      },
      {
        stepNumber: 4,
        phaseName: 'Peringatan Countdown 15 Menit & Last Order',
        actor: 'Sistem Otomatis & Pramusaji',
        actionSummary: 'Pada menit ke-75, sistem membunyikan alarm di tablet pramusaji dan mengirim notifikasi ke layar tamu: "Waktu Tersisa 15 Menit".',
        detailFlow: 'Pramusaji mendatangi meja untuk konfirmasi pesanan terakhir (last order call) dan mengingatkan aturan sisa makanan.',
        systemTrigger: 'SESSION_EXPIRING_WARNING',
        apiTrigger: 'POST /api/v1/buffet/sessions/{sessionId}/alert-last-order',
        dbImpact: 'Ubah session state menjadi "last_order_active".'
      },
      {
        stepNumber: 5,
        phaseName: 'Timbang Sisa Makanan & Denda Waste Charge',
        actor: 'Pramusaji & Kasir',
        actionSummary: 'Saat sesi berakhir, staf memeriksa sisa daging yang tidak termakan di meja. Jika ada sisa > 100g, dikenakan denda timbang.',
        detailFlow: 'Staf meletakkan piring sisa di timbangan digital Bluetooth (misal sisa 240g daging). Sistem menghitung denda otomatis Rp 50.000 / 100g ke dalam bill akhir.',
        systemTrigger: 'SESSION_CLOSED_WITH_WASTE_AUDIT',
        apiTrigger: 'POST /api/v1/buffet/sessions/{sessionId}/close-and-bill',
        dbImpact: 'Catat denda waste charge, catat gramasi daging terbuang di log waste HPP, cetak tagihan lunas.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Layar Timer Meja Tamu (Tablet 8" / QR PWA HP Tamu)', 'Tablet Patroli Refill Buffet Staf', 'Layar KDS Dapur Meat Slicer', 'Kasir Checkout Utama'],
      hardwareRequired: ['Bluetooth Digital Precision Waste Scale (Timbangan Sisa Daging)', 'Beacon / Timer Display Meja', 'Printer Struk Kasir 80mm', 'Sensor Suhu IoT Chafing Dish'],
      protocols: [
        { protocol: 'WebSocket (WSS)', usage: 'Streaming mundur detik countdown waktu makan (90:00 -> 00:00) ke layar tamu & kasir', targetDeviceOrService: 'AYCE Timer Service <-> Guest Device & POS' },
        { protocol: 'Bluetooth LE (BLE)', usage: 'Membaca otomatis gramasi sisa daging dari timbangan ke modal denda kasir', targetDeviceOrService: 'Digital Scale -> Waiter Tablet' },
        { protocol: 'REST JSON (HTTPS)', usage: 'Pemesanan daging premium tambahan (a la carte request) dari meja ke KDS meat slicer', targetDeviceOrService: 'Table QR -> Kitchen API' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/buffet/start-session',
          description: 'Mulai sesi AYCE baru untuk meja dengan paket terpilih dan durasi menit',
          samplePayload: '{\n  "table_id": "B-12",\n  "package_id": "PKG-PREMIUM-WAGYU",\n  "pax_adult": 4,\n  "pax_child": 1,\n  "duration_minutes": 90\n}',
          sampleResponse: '{\n  "session_id": "AYCE-20261029-088",\n  "ends_at": "2026-10-29T21:45:00Z",\n  "qr_order_url": "https://restosync.io/t/b12?token=xyz"\n}'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/buffet/sessions/{sessionId}/log-waste-penalty',
          description: 'Mencatat sisa makanan tidak habis dan kalkulasi penalti denda per gram',
          samplePayload: '{\n  "waste_grams": 250,\n  "penalty_rate_per_100g": 50000,\n  "photo_evidence_url": "https://storage.restosync.io/waste/b12_evidence.jpg"\n}',
          sampleResponse: '{\n  "penalty_amount": 125000,\n  "added_to_bill": true\n}'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Tiga Tingkat: (1) Estimasi Konsumsi Flat per Pax, (2) Hard Deduct Dapur saat masak refill loyang prasmanan 5Kg, (3) Deduct live untuk item daging premium per piring via tablet.',
        logic: 'Pengurangan bahan baku buffet didasarkan pada Batch Refill Dapur, bukan per sendokan tamu.',
        bomMapping: '1 Loyang Chafing Dish Beef Teriyaki = 4kg Daging Slice + 800ml Saus Teriyaki + 500g Bawang Bombay.',
        spoilageAndWaste: 'Sisa daging mentah di meja tamu yang tidak habis ditimbang dan wajib dicatat di log waste kerugian operasional.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'Session Lock: Mencegah sesi meja ganda atau penambahan waktu (time extension) tanpa otorisasi manajer.',
        raceConditionHandling: 'Penanganan pemesanan daging iris di KDS dibatasi kuota (misal maksimal 3 piring per order agar tidak menumpuk di meja).',
        rollbackPolicy: 'Penyesuaian denda sisa makanan dapat di-override dengan persetujuan manajer jika ada alasan medis tamu.'
      },
      offlineResilience: {
        localPersistence: 'Timer sesi disimpan di local storage peramban dan sinkron dengan jam server (Server NTP Timestamp).',
        syncStrategy: 'Jika Wi-Fi putus sesaat, timer tetap menghitung mundur akurat berdasarkan selisih waktu timestamp.',
        conflictResolution: 'Server timestamp menjadi acuan mutlak.'
      },
      developerChecklist: [
        'Timer engine berbasis server timestamp yang tahan jika tamu me-refresh browser atau mematikan layar HP',
        'Fitur pembatasan pemesanan (Order Rate Limiting) agar tamu tidak memesan 50 piring daging sekaligus',
        'Kalkulator denda sisa makanan dengan integrasi timbangan digital dan upload foto bukti',
        'Modul "Request Refill Loyang" dengan notifikasi visual ke layar kepala koki dapur'
      ]
    },
    sampleJsonPayload: '{\n  "event": "BUFFET_SESSION_TICK",\n  "table_id": "B-12",\n  "minutes_remaining": 14,\n  "status": "LAST_ORDER_PERIOD",\n  "total_plates_consumed": 22,\n  "waste_penalty_flag": false\n}'
  },

  // 3.1 QR-Code & Kiosk Ordering
  {
    id: 'qr_kiosk_ordering',
    categoryId: 'tech_automated',
    categoryName: 'Otomatisasi & Robotik',
    name: 'QR-Code & Kiosk Ordering',
    englishTitle: 'Self-Ordering Kiosk & Table Dynamic QR PWA',
    badge: 'QR & KIOSK PWA',
    badgeColor: 'bg-cyan-600 text-white font-bold',
    overview: 'Pemesanan mandiri oleh pelanggan melalui Kiosk layar sentuh besar (21"-32") di lobi depan atau memindai kode QR dinamis di meja menggunakan smartphone tamu tanpa unduh aplikasi. Dilengkapi keranjang bersama (Shared Table Cart) tersinkronisasi real-time.',
    targetVenues: ['Restoran Modern Berkecepatan Tinggi', 'Kafe Millennial & Gen-Z', 'Food Hub Ramen Bar', 'Pusat Kuliner Ramai Pelanggan'],
    metrics: {
      turnaroundTime: '25 - 45 Menit',
      laborIntensity: 'Rendah',
      techReliance: 'Otomasi Penuh',
      wasteRiskLevel: 'Rendah',
      averageCheckSize: 'Menengah'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Scan QR Meja / Datangi Kiosk Layar Sentuh',
        actor: 'Tamu',
        actionSummary: 'Tamu mendekati Kiosk 27" di lobi atau duduk di meja dan memindai stiker QR ber-token aman anti-spoofing.',
        detailFlow: 'Browser HP tamu membuka WebApp PWA instan tanpa instalasi. Token QR memvalidasi bahwa tamu benar-benar berada di meja T-09 saat ini.',
        systemTrigger: 'TABLE_SESSION_ATTACHED',
        apiTrigger: 'POST /api/v1/qr/authenticate-session',
        dbImpact: 'Buat token sesi belanja terenkripsi dengan masa berlaku 120 menit.'
      },
      {
        stepNumber: 2,
        phaseName: 'Eksplorasi Menu & Shared Cart Real-Time',
        actor: 'Tamu Meja (Multi-User)',
        actionSummary: 'Semua tamu di meja yang sama bisa scan QR dan mengisi keranjang bersama (Shared Cart) secara serentak.',
        detailFlow: 'Tamu A memilih 1 Ramen Spesial (Spicy Level 3), Tamu B di meja yang sama langsung melihat item tersebut muncul di layar HP miliknya dalam 80ms.',
        systemTrigger: 'SHARED_CART_ITEM_MUTATED',
        apiTrigger: 'WS /ws/table-cart-room/{tableToken}',
        dbImpact: 'Update memori Redis state keranjang meja.'
      },
      {
        stepNumber: 3,
        phaseName: 'Checkout & Pembayaran Mandiri (Self-Payment)',
        actor: 'Tamu',
        actionSummary: 'Tamu memilih opsi "Kirim & Bayar Sekarang" via QRIS / E-wallet atau bayar di mesin Kiosk EDC.',
        detailFlow: 'Gateway pembayaran mengunci transaksi. Webhook verifikasi pembayaran diterima server, memvalidasi pelunasan dalam 1 detik.',
        systemTrigger: 'PAYMENT_WEBHOOK_RECEIVED',
        apiTrigger: 'POST /api/v1/payments/webhook-callback',
        dbImpact: 'Update status order menjadi "PAID", ACID potong stok resep bahan baku.'
      },
      {
        stepNumber: 4,
        phaseName: 'Injeksi Otomatis ke KDS Dapur & Bar',
        actor: 'Sistem Backend Otomatis',
        actionSummary: 'Pesanan langsung ditembakkan otomatis ke monitor dapur tanpa campur tangan pelayan.',
        detailFlow: 'Tiket mie masuk ke KDS Stasiun Ramen, tiket es teh lemon masuk ke KDS Stasiun Minuman, struk persiapan tercetak di printer ekspos.',
        systemTrigger: 'TICKETS_DISPATCHED_TO_KDS',
        apiTrigger: 'WS /ws/kitchen-ticket-stream',
        dbImpact: 'Simpan tiket produksi di tabel `kitchen_tickets` dengan status "queued".'
      },
      {
        stepNumber: 5,
        phaseName: 'Pengantaran Hidangan & Penutupan Sesi',
        actor: 'Runner / Robot Pelayan',
        actionSummary: 'Runner mengantarkan makanan ke meja T-09. Layar HP tamu berganti status menjadi "Pesanan Telah Disajikan".',
        detailFlow: 'Staf menekan tombol selesai di KDS. Tamu dapat mengunduh e-struk pajak PDF langsung dari browser HP mereka.',
        systemTrigger: 'ORDER_FULFILLED',
        apiTrigger: 'PATCH /api/v1/orders/{orderId}/complete-serving',
        dbImpact: 'Arsipkan sesi meja, kirim e-receipt via email/WhatsApp jika diinput tamu.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Mobile PWA WebApp (Responsive di Smartphone Tamu iOS/Android)', 'Kiosk Terminal Layar Sentuh 21.5"-32" (Android/Windows OS)', 'Layar KDS Dapur (Touchscreen 21.5")', 'Kitchen Printer Network'],
      hardwareRequired: ['Acrylic Table Tent dengan QR Code Dinamis / NFC Tag Tersemat', 'Kiosk Stand Industri dengan Thermal Printer 80mm & 2D Barcode Reader', 'Integrated EDC / QRIS Reader Box', 'Router Wi-Fi Guest Terisolasi dari LAN POS'],
      protocols: [
        { protocol: 'WebSocket (WSS)', usage: 'Sinkronisasi Shared Cart multi-perangkat di satu meja & live menu out-of-stock badge', targetDeviceOrService: 'Guest Smart Phones <-> Redis Pub/Sub' },
        { protocol: 'HTTPS REST & JWT', usage: 'Autentikasi token meja terenkripsi anti-spoofing dan submit order', targetDeviceOrService: 'Mobile Browser -> Backend API' },
        { protocol: 'Webhook (HTTPS)', usage: 'Penerimaan instan notifikasi bayar dari Payment Gateway QRIS/Stripe/Midtrans', targetDeviceOrService: 'Payment Gateway -> Backend Server' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/qr/authenticate-session',
          description: 'Validasi QR token meja dan inisialisasi sesi keranjang bersama',
          samplePayload: '{ "table_token": "jwt.signed.table09.hash", "device_fingerprint": "a9f8b1c2" }',
          sampleResponse: '{\n  "table_id": "T-09",\n  "session_token": "sess-88192",\n  "active_cart": {\n    "items": []\n  }\n}'
        },
        {
          method: 'WS',
          endpoint: '/ws/table-cart-room/{tableToken}',
          description: 'WebSocket saluran dua arah untuk keranjang belanja multi-pengguna di satu meja',
          samplePayload: '{ "action": "ADD_ITEM", "item_id": "RAMEN-SHOYU", "qty": 1, "customizations": { "spicy": 2 } }',
          sampleResponse: '{ "action": "CART_UPDATED", "items_count": 3, "subtotal": 135000 }'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Atomic Inventory Lock saat checkout payment gateway dimulai (Reservation Hold 5 menit) -> Hard Deduct saat bayar sukses.',
        logic: 'Pengurangan bahan baku otomatis berdasarkan formula BOM master menu.',
        bomMapping: '1 Porsi Ramen Shoyu = 120g Mie Segar + 300ml Kaldu Dashi + 2 Slice Chashu Daging + 1 Butir Telur Ajitsuke Tamago.',
        spoilageAndWaste: 'Jika bahan habis saat tamu sedang memilih, socket event `ITEM_SOLDOUT` seketika mendisable tombol di HP tamu.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'Distributed Redis Lock pada kuota item langka (Limited Quantity Menu) dengan TTL 300 detik.',
        raceConditionHandling: 'Mencegah 2 tamu di meja berbeda meng-checkout sisa 1 porsi menu terbatas terakhir.',
        rollbackPolicy: 'Jika tamu membatalkan pembayaran di gerbang QRIS atau expired, hold reservasi stok otomatis dikembalikan.'
      },
      offlineResilience: {
        localPersistence: 'Kiosk fisik memiliki Local Fallback Cache katalog menu dan aset foto di SSD lokal.',
        syncStrategy: 'Jika internet putus, Kiosk dapat beralih menerima pembayaran tunai atau offline card tap.',
        conflictResolution: 'Antrean transaksi di-buffer di local SQLite database Kiosk.'
      },
      developerChecklist: [
        'Enkripsi token QR meja dengan HMAC-SHA256 untuk mencegah pemesanan palsu dari luar resto',
        'Implementasikan WebSocket Room per meja untuk sinkronisasi Shared Cart antar handphone tamu',
        'Integrasikan Webhook payment gateway dengan Idempotency Key agar pembayaran tidak terduplikasi',
        'Pasang mekanisme auto-grayout / disabled pada menu jika bahan baku resep BOM di gudang habis'
      ]
    },
    sampleJsonPayload: '{\n  "service_mode": "QR_SELF_ORDER",\n  "table_id": "T-09",\n  "cart_session_id": "CART-T09-882",\n  "total_items": 4,\n  "amount": 168000,\n  "payment_provider": "QRIS_GOPAY",\n  "auto_injected_to_kds": true\n}'
  },

  // 3.2 Conveyor Belt (Kaiten Sushi)
  {
    id: 'conveyor_belt_kaiten',
    categoryId: 'tech_automated',
    categoryName: 'Otomatisasi & Robotik',
    name: 'Conveyor Belt (Kaiten Sushi)',
    englishTitle: 'Revolving Belt, RFID Plate Tracking & Freshness Decay',
    badge: 'CONVEYOR & RFID BELT',
    badgeColor: 'bg-indigo-600 text-white font-bold',
    overview: 'Piring makanan berpenutup kubah transparan (freshness dome) berjalan di atas pita konveyor mekanis mengelilingi meja tamu. Tamu mengambil piring langsung dari rel, memasukkan piring kosong ke lubang sensor meja (chute), atau memesan menu khusus via tablet meja.',
    targetVenues: ['Kaiten Sushi Bar', 'Conveyor Hotpot & Suki', 'Revolving Tapas Lounge', 'Modern Dim Sum Belt'],
    metrics: {
      turnaroundTime: '30 - 55 Menit',
      laborIntensity: 'Rendah',
      techReliance: 'Otomasi Penuh',
      wasteRiskLevel: 'Tinggi (Bahan Mentah)',
      averageCheckSize: 'Menengah'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Penempatan Piring Ber-RFID ke Lintasan Konveyor',
        actor: 'Koki Sushi & Antena RFID Dapur',
        actionSummary: 'Koki menaruh piring sushi segar dengan penutup kubah ke atas pita konveyor yang terus berputar.',
        detailFlow: 'Antena RFID di pass dapur membaca microchip RFID di bawah piring, mendaftarkan jenis sushi (Salmon Nigiri) dan timestamp waktu mulai berputar.',
        systemTrigger: 'PLATE_INTRODUCED_TO_BELT',
        apiTrigger: 'POST /api/v1/conveyor/register-plate',
        dbImpact: 'Catat ID piring, tipe sushi, dan expiry_timestamp = now + 45 menit.'
      },
      {
        stepNumber: 2,
        phaseName: 'Tamu Mengambil Piring Langsung dari Lintasan',
        actor: 'Tamu Meja',
        actionSummary: 'Tamu melihat hidangan yang lewat di depan meja dan mengangkat piring yang disukai dari rel berjalan.',
        detailFlow: 'Warna piring melambangkan harga (Merah Rp 15rb, Biru Rp 25rb, Emas Rp 35rb). Tamu dapat langsung menyantap tanpa menunggu pelayan.',
        systemTrigger: 'PLATE_PICKED_BY_GUEST',
        apiTrigger: 'WS /ws/conveyor-sensor-stream',
        dbImpact: 'Sensor rel mendeteksi piring terangkat dari titik konveyor.'
      },
      {
        stepNumber: 3,
        phaseName: 'Sensor Kadaluarsa Lintasan (Freshness Decay Pusher)',
        actor: 'Sistem Robotik IoT & Lengan Mekanik',
        actionSummary: 'Jika piring sushi berputar di lintasan lebih dari 45 menit tanpa diambil tamu, sistem otomatis membuangnya demi standar HACCP.',
        detailFlow: 'Antena pemindai membaca piring yang telah berputar > 45 menit, mengaktifkan lengan mekanik (pusher arm) otomatis mendorong piring ke wadah waste dapur.',
        systemTrigger: 'PLATE_EXPIRED_AUTO_EJECTED',
        apiTrigger: 'POST /api/v1/conveyor/eject-expired-plate',
        dbImpact: 'Catat otomatis kerugian bahan baku di log waste dapur (HACCP Food Safety Violation Prevention).'
      },
      {
        stepNumber: 4,
        phaseName: 'Pengembalian Piring ke Lubang Sensor Meja (Chute)',
        actor: 'Tamu & Sensor Optik Meja',
        actionSummary: 'Tamu memasukkan piring kosong ke lubang pembuangan piring di meja (plate return chute).',
        detailFlow: 'Sensor optik/induktif di dalam lubang meja menghitung jumlah piring secara instan dan mengupdate nominal tagihan di tablet meja. Tiap 5 piring memicu mini-game gacha berhadiah di layar tablet.',
        systemTrigger: 'PLATE_DROPPED_INTO_CHUTE',
        apiTrigger: 'POST /api/v1/tables/{tableId}/drop-plate',
        dbImpact: 'Tambah hitungan piring meja, kalkulasi subtotal tagihan, trigger gacha animasi.'
      },
      {
        stepNumber: 5,
        phaseName: 'Pembayaran Mandiri di Tablet Meja',
        actor: 'Tamu & Kasir',
        actionSummary: 'Tamu menekan tombol "Bayar" di tablet meja, memverifikasi hitungan piring otomatis, dan melunasi tagihan.',
        detailFlow: 'Sistem mencocokkan jumlah piring yang dimasukkan ke lubang meja dengan pesanan khusus tablet. Tamu membayar via QRIS di tablet atau menuju kasir pintu keluar.',
        systemTrigger: 'BELT_TABLE_SETTLED',
        apiTrigger: 'POST /api/v1/tables/{tableId}/checkout',
        dbImpact: 'Tutup sesi meja, potong akumulasi resep BOM seluruh piring yang dikonsumsi.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Tablet Layar Sentuh Meja Tamu (Android 10")', 'Layar Monitor Dapur Monitoring Lintasan (Belt Analytics Screen)', 'Kasir Utama Pintu Keluar'],
      hardwareRequired: ['Pita Konveyor Mekanik dengan Kontroler Motor PLC Modbus', 'Microchip RFID HF 13.56MHz Terpasang di Bawah Setiap Piring', 'Antena Pembaca RFID di Gerbang Masuk & Keluar Dapur', 'Sensor Optik / Induktif di Lubang Meja (Plate Chute Counter)', 'Lengan Solenoid Pembuang Piring Basi (Auto Pusher)'],
      protocols: [
        { protocol: 'Modbus TCP / MQTT', usage: 'Komunikasi data kontroler PLC motor konveyor dan aktuator solenoid pusher piring basi', targetDeviceOrService: 'PLC Industri Konveyor <-> IoT Gateway Server' },
        { protocol: 'Serial RS485 / USB', usage: 'Membaca deretan antena RFID piring sushi di sepanjang rel konveyor', targetDeviceOrService: 'RFID Reader Multiplexer -> POS Server' },
        { protocol: 'WebSocket (WSS)', usage: 'Streaming langsung hitungan piring dan animasi mini-game gacha ke tablet meja tamu', targetDeviceOrService: 'Backend Server -> Tablet Meja' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/conveyor/register-plate',
          description: 'Mendaftarkan piring sushi baru yang ditaruh koki ke lintasan conveyor dengan tag RFID',
          samplePayload: '{\n  "rfid_tag": "E280-1192-AA01",\n  "dish_id": "SUSHI-SALMON-NIGIRI",\n  "plate_tier": "GOLD",\n  "kitchen_station": "KITCHEN-A"\n}',
          sampleResponse: '{\n  "registered": true,\n  "expiry_minutes": 45,\n  "expires_at": "2026-10-29T21:40:00Z"\n}'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/tables/{tableId}/drop-plate',
          description: 'Mencatat piring kosong yang dimasukkan tamu ke lubang chute meja',
          samplePayload: '{\n  "table_id": "BELT-TBL-04",\n  "plate_tier": "GOLD",\n  "cumulative_dropped_count": 5\n}',
          sampleResponse: '{\n  "current_total_plates": 5,\n  "current_bill_amount": 175000,\n  "gacha_spin_awarded": true\n}'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Dua Jalur: Jalur Masak memotong bahan ikan segar saat piring didaftarkan ke belt. Jalur Konsumsi mengonfirmasi penjualan saat piring dimasukkan ke lubang meja.',
        logic: 'Piring yang terbuang oleh pusher kadaluarsa otomatis diklasifikasikan sebagai `WASTE_HACCP_EXPIRED`.',
        bomMapping: '1 Piring Salmon Nigiri = 40g Nasi Sushi Cuka + 35g Daging Salmon Segar + 2g Wasabi.',
        spoilageAndWaste: 'Dashboard mencatat persentase piring terjual vs piring terbuang (Belt Shrinkage Ratio) secara real-time.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'State lock pada RFID tag ID piring: `IN_PREP -> ON_BELT -> CONSUMED / EJECTED_WASTE`.',
        raceConditionHandling: 'Satu tag piring yang sama tidak dapat dihitung dua kali berkat deduplikasi UID RFID.',
        rollbackPolicy: 'Sensor optik chute memiliki proteksi debounce 500ms agar getaran mekanis tidak memicu hitungan ganda.'
      },
      offlineResilience: {
        localPersistence: 'PLC konveyor tetap memutar rel secara otonom meskipun server komputer mati.',
        syncStrategy: 'Penghitung piring di meja memiliki buffer memori mikrokontroler lokal yang menyimpan counter piring.',
        conflictResolution: 'Staf dapat menggunakan tongkat pemindai RFID portabel (RFID Wand Scanner) untuk hitungan manual darurat.'
      },
      developerChecklist: [
        'Integrasikan pembacaan RFID multi-tag dengan antena multiplexer berkecepatan tinggi',
        'Implementasikan timer kadaluarsa kesegaran (Freshness Decay) dengan trigger sinyal ke aktuator pusher mekanik',
        'Buat modul hitungan piring lubang meja dengan sensor optik anti-jamming',
        'Rancang animasi mini-game interaktif (gacha system) setiap kelipatan N piring di tablet tamu'
      ]
    },
    sampleJsonPayload: '{\n  "event": "PLATE_DECAY_EXPIRY_ALERT",\n  "rfid_uid": "E280-1192-AA01",\n  "item_name": "Salmon Nigiri",\n  "minutes_on_belt": 46,\n  "status": "DISCARDED_BY_PUSHER",\n  "loss_cost_idr": 18500\n}'
  },

  // 3.3 Automated / Express Delivery (Shinkansen Tray & Robot Waiter)
  {
    id: 'automated_express_delivery',
    categoryId: 'tech_automated',
    categoryName: 'Otomatisasi & Robotik',
    name: 'Automated / Express Delivery (Shinkansen Tray & Robot)',
    englishTitle: 'Autonomous Mobile Robot (AMR) & High-Speed Rail Tray',
    badge: 'SHINKANSEN & ROBOT AMR',
    badgeColor: 'bg-blue-600 text-white font-bold',
    overview: 'Makanan diantar langsung dari dapur ke meja tamu menggunakan miniatur kereta cepat rel ganda (Shinkansen express tray line) atau robot pelayan beroda otonom (Autonomous Mobile Robot - AMR) bersensor LiDAR dan kamera depth penghindar rintangan.',
    targetVenues: ['Restoran Sushi Rel Cepat', 'Restoran Masa Depan / Cyberpunk Diner', 'Restoran Keluarga Ramah Anak', 'Smart Japanese BBQ'],
    metrics: {
      turnaroundTime: '20 - 40 Menit',
      laborIntensity: 'Sangat Rendah',
      techReliance: 'Otomasi Penuh',
      wasteRiskLevel: 'Rendah',
      averageCheckSize: 'Menengah'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Pemesanan di Tablet Meja & Routing Dapur',
        actor: 'Tamu & Tablet Meja',
        actionSummary: 'Tamu memesan Ramen Panas dan Karage melalui tablet layar sentuh meja.',
        detailFlow: 'Tiket KDS dapur menampilkan instruksi: "Meja 14 - Jalur Express Shinkansen Bawah". Koki memasak pesanan dalam durasi 6 menit.',
        systemTrigger: 'EXPRESS_ORDER_QUEUED',
        apiTrigger: 'POST /api/v1/express/orders',
        dbImpact: 'Simpan tiket express di antrean rel pengiriman.'
      },
      {
        stepNumber: 2,
        phaseName: 'Pemuatan Makanan ke Kereta Rel / Nampan Robot',
        actor: 'Koki Dapur',
        actionSummary: 'Koki meletakkan mangkuk di atas baki miniatur kereta Shinkansen atau nampan robot pelayan beroda.',
        detailFlow: 'Koki menekan tombol "Kirim ke Meja 14" di monitor konsol stasiun keberangkatan rel dapur.',
        systemTrigger: 'DISPATCH_CARRIER_TRIGGERED',
        apiTrigger: 'POST /api/v1/fleet/dispatch',
        dbImpact: 'Ubah status armada dari IDLE menjadi DISPATCHED_EN_ROUTE.'
      },
      {
        stepNumber: 3,
        phaseName: 'Peluncuran Berkecepatan Tinggi & Navigasi Otonom',
        actor: 'Motor Servo Rel Shinkansen / Robot AMR LiDAR',
        actionSummary: 'Kereta miniatur meluncur mulus di atas rel khusus dan berhenti presisi di hadapan meja 14 dalam 12 detik.',
        detailFlow: 'Jika menggunakan robot berjalan (AMR), sensor LiDAR memetakan jalur lantai, menghindari anak-anak yang berlari, dan menyapa tamu dengan suara ramah.',
        systemTrigger: 'CARRIER_ARRIVED_AT_TABLE',
        apiTrigger: 'POST /api/v1/fleet/arrival-beacon',
        dbImpact: 'Catat waktu transit pengantaran (transit_time_seconds).'
      },
      {
        stepNumber: 4,
        phaseName: 'Pengambilan Hidangan & Sensor Beban (Load Cell)',
        actor: 'Tamu Meja',
        actionSummary: 'Tamu memindahkan piring makanan dari baki kereta/robot ke atas meja makan mereka.',
        detailFlow: 'Sensor beban (load cell) pada baki mendeteksi bahwa mangkuk telah diangkat. Lampu tombol di meja tamu berkedip hijau menandakan aman.',
        systemTrigger: 'WEIGHT_REMOVED_CONFIRMED',
        apiTrigger: 'POST /api/v1/fleet/confirm-tray-empty',
        dbImpact: 'Verifikasi hidangan telah diterima utuh oleh tamu.'
      },
      {
        stepNumber: 5,
        phaseName: 'Tamu Tekan Tombol Kembali & Pulang Otonom',
        actor: 'Tamu & Armada Kereta/Robot',
        actionSummary: 'Tamu menekan tombol merah menyala "Kembalikan Kereta" di meja. Kereta meluncur mundur kembali ke dapur.',
        detailFlow: 'Robot pelayan berucap "Selamat Menikmati Hidangan Anda!" dan otomatis bernavigasi kembali ke home dock stasiun dapur untuk tugas berikutnya.',
        systemTrigger: 'CARRIER_RETURNED_TO_BASE',
        apiTrigger: 'POST /api/v1/fleet/return-home',
        dbImpact: 'Reset status armada menjadi IDLE / READY.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Tablet Layar Sentuh Meja Tamu', 'Layar Konsol Dispatcher Dapur (Dispatch Terminal)', 'Dashboard Fleet Management Armada Robot'],
      hardwareRequired: ['Miniatur Kereta Shinkansen Rel dengan Motor Stepper & Sensor Posisi Hall Effect', 'Robot Pelayan Otonom (AMR) dengan Sensor LiDAR, Kamera RGBD 3D, dan Baterai Lithium Swap', 'Sensor Beban Load Cell pada Nampan Pengantar', 'Tombol Pulang Kapasitif Terpasang di Meja'],
      protocols: [
        { protocol: 'VDA 5050 / ROS2 / MQTT', usage: 'Protokol standar kendali armada robot AGV/AMR dan pemantauan koordinat posisi lantai', targetDeviceOrService: 'Fleet Management Server <-> Robot AMR' },
        { protocol: 'Modbus TCP / Ethernet IP', usage: 'Perintah kendali motor relay dan rem servo jalur rel Shinkansen berkecepatan tinggi', targetDeviceOrService: 'Kitchen Dispatch Terminal -> Motor Drive PLC' },
        { protocol: 'WebSocket (WSS)', usage: 'Streaming status posisi kereta/robot real-time ke layar tablet tamu meja', targetDeviceOrService: 'Server -> Tablet Meja' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/fleet/dispatch',
          description: 'Mengirim perintah peluncuran kereta rel atau robot ke meja tujuan',
          samplePayload: '{\n  "carrier_id": "TRAIN-LANE-TOP-01",\n  "destination_table": "TABLE-14",\n  "order_items": ["RAMEN-SPICY-01", "GYOZA-06"],\n  "load_weight_grams": 850\n}',
          sampleResponse: '{\n  "dispatch_status": "en_route",\n  "estimated_arrival_seconds": 12,\n  "interlock_safety_ok": true\n}'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/fleet/return-home',
          description: 'Sinyal konfirmasi bahwa tamu telah mengangkat piring dan memerintahkan kereta/robot kembali ke pangkalan dapur',
          samplePayload: '{ "carrier_id": "TRAIN-LANE-TOP-01", "table_id": "TABLE-14" }',
          sampleResponse: '{ "status": "returning", "station_dock_id": "KITCHEN-BAY-01" }'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Deduction saat pesanan dikonfirmasi tamu di tablet meja.',
        logic: 'Pengurangan resep BOM standar menu panas.',
        bomMapping: '1 Porsi Gyoza = 6 Lembar Kulit Pangsit + 90g Daging Cincang Ayam + 20ml Minyak Wijen.',
        spoilageAndWaste: 'Jika kereta mengalami tabrakan/tumpah di rel, staf menekan "Spill Incident Log" di konsol untuk memotong bahan baku dan mengirim re-cook otomatis ke dapur.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'Lane Interlock Mutex: Mencegah dua kereta dikirim ke segmen rel yang sama pada waktu bersamaan.',
        raceConditionHandling: 'Sensor posisi memastikan kereta berhenti dengan deselerasi lembut agar kuah ramen tidak tumpah.',
        rollbackPolicy: 'Sistem safety interlock menghentikan darurat (E-Stop) jika terdeteksi halangan tangan di rel.'
      },
      offlineResilience: {
        localPersistence: 'Pengendali PLC rel terhubung di jaringan LAN lokal mandiri tanpa ketergantungan internet Cloud.',
        syncStrategy: 'Robot AMR memiliki peta LiDAR SLAM tersimpan di memori onboard lokal.',
        conflictResolution: 'Offline-ready 100% di level local area network.'
      },
      developerChecklist: [
        'Kembangkan modul komunikasi Modbus TCP untuk kendali motor inverter rel Shinkansen',
        'Implementasikan interlock sensor beban (Load Cell Interlock) agar kereta tidak jalan mundur sebelum makanan diangkat',
        'Integrasikan driver API armada robot otonom menggunakan protokol MQTT / REST standar VDA 5050',
        'Pasang tombol fisik atau virtual darurat (Emergency Stop E-Stop) di layar dispatcher'
      ]
    },
    sampleJsonPayload: '{\n  "carrier_type": "SHINKANSEN_EXPRESS_RAIL",\n  "lane_id": "LANE-02",\n  "target_table": "TBL-14",\n  "status": "ARRIVED_AT_DESTINATION",\n  "tray_weight_detected_grams": 920,\n  "safety_lock_engaged": true\n}'
  },

  // 3.4 Automat / Vending Service
  {
    id: 'automat_vending_service',
    categoryId: 'tech_automated',
    categoryName: 'Otomatisasi & Robotik',
    name: 'Automat / Vending Service (Smart Locker)',
    englishTitle: 'Smart Heated/Chilled Pickup Locker & Robotic Vending',
    badge: 'SMART LOCKER & VENDING',
    badgeColor: 'bg-teal-600 text-white font-bold',
    overview: 'Seluruh proses dari pemesanan, pembayaran, hingga pengambilan makanan dilakukan secara mandiri melalui mesin otomatis pintar atau loker pengambilan modular (Smart Food Locker) bersuhu hangat (>60°C) atau dingin (<4°C) dengan kunci solenoid elektronik tanpa interaksi manusia.',
    targetVenues: ['Stasiun Kereta & Bandara', 'Gedung Perkantoran / Co-Working', 'Kampus Universitas 24 Jam', 'Ghost Kitchen Pickup Pods'],
    metrics: {
      turnaroundTime: '1 - 5 Menit (Instant Grab)',
      laborIntensity: 'Sangat Rendah',
      techReliance: 'Otomasi Penuh',
      wasteRiskLevel: 'Rendah',
      averageCheckSize: 'Ekonomis'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Pemesanan Mobile App / Kiosk Layar Loker',
        actor: 'Tamu / Pelanggan',
        actionSummary: 'Pelanggan memesan makanan via aplikasi handphone saat di perjalanan atau di layar sentuh sentral loker.',
        detailFlow: 'Pelanggan memilih Bento Beef Teriyaki Hangat dan Ice Latte Dingin, membayar langsung di aplikasi via E-Wallet/QRIS.',
        systemTrigger: 'LOCKER_ORDER_PLACED_AND_PAID',
        apiTrigger: 'POST /api/v1/automat/orders',
        dbImpact: 'Buat order ID, generate OTP PIN 6-digit & Dynamic Barcode unik.'
      },
      {
        stepNumber: 2,
        phaseName: 'Dapur Memasukkan Makanan ke Kompartemen Loker',
        actor: 'Koki Dapur / Kurir Resto',
        actionSummary: 'Dari balik dinding, koki memasukkan bento hangat ke kompartemen loker #05 bersuhu 65°C.',
        detailFlow: 'Koki memindai barcode pesanan di pintu belakang loker, pintu kompartemen #05 terbuka otomatis, makanan dimasukkan, pintu ditutup dan terkunci solenoid.',
        systemTrigger: 'LOCKER_COMPARTMENT_STOCKED',
        apiTrigger: 'POST /api/v1/automat/lockers/{lockerId}/load-food',
        dbImpact: 'Update status kompartemen #05 menjadi OCCUPIED_WARMING, simpan sensor suhu.'
      },
      {
        stepNumber: 3,
        phaseName: 'Pemberitahuan Siap Ambil ke Smartphone Tamu',
        actor: 'Sistem Notifikasi Cloud',
        actionSummary: 'Pelanggan menerima notifikasi instan di WhatsApp / Push Notification: "Bento Anda Siap di Loker #05".',
        detailFlow: 'Pesan memuat kode QR pengambilan cepat yang siap di-scan saat tiba di depan loker.',
        systemTrigger: 'PICKUP_READY_NOTIFIED',
        apiTrigger: 'POST /api/v1/notifications/send-pickup-qr',
        dbImpact: 'Catat waktu siap ambil, aktifkan expiry timer pengambilan 30 menit.'
      },
      {
        stepNumber: 4,
        phaseName: 'Scan QR di Scanner Loker & Pintu Membuka Otomatis',
        actor: 'Pelanggan & Scanner Loker',
        actionSummary: 'Pelanggan mendekatkan layar HP ke laser scanner loker sentral.',
        detailFlow: 'Mikrokontroler memvalidasi kode QR dalam 0.3 detik, lampu LED kompartemen #05 menyala hijau terang, dan kunci solenoid elektromagnetik melepaskan pintu hingga membuka (pop-out).',
        systemTrigger: 'LOCKER_DOOR_UNLOCKED',
        apiTrigger: 'POST /api/v1/automat/lockers/unlock-by-qr',
        dbImpact: 'Ubah status pintu menjadi UNLOCKED_OPEN, catat waktu buka.'
      },
      {
        stepNumber: 5,
        phaseName: 'Pengambilan Makanan & Penutupan Pintu Otomatis',
        actor: 'Pelanggan & Sensor Pintu Magnetik',
        actionSummary: 'Pelanggan mengambil makanan hangat, menutup pintu loker, dan langsung melanjutkan perjalanan.',
        detailFlow: 'Sensor magnetic reed switch mendeteksi pintu telah tertutup rapat. Sistem menandai transaksi selesai dan loker siap disanitasi sinar UV untuk pesanan berikutnya.',
        systemTrigger: 'ORDER_CLAIMED_AND_DOOR_LATCHED',
        apiTrigger: 'PATCH /api/v1/automat/lockers/{lockerId}/close-and-sanitize',
        dbImpact: 'Tutup status order "completed", aktifkan siklus UV lamp 60 detik.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Aplikasi Mobile Konsumen (Android/iOS PWA)', 'Layar Sentuh Sentral Loker Pintar 15.6"', 'Tablet Pengisi Dapur Belakang (Kitchen Depot Tablet)'],
      hardwareRequired: ['Kabinet Smart Locker Modular dengan Isolasi Termal (Heated Bay 65°C & Chilled Bay 4°C)', 'Papan Relai Mikrokontroler (ESP32 / Raspberry Pi) Pengendali Kunci Solenoid 12V', 'Laser Barcode / QR Scanner 2D Terintegrasi di Bodi Loker', 'Sensor Suhu Digital (DS18B20) per Kompartemen', 'Sensor Magnetik Pintu (Reed Switch) & Lampu UV-C Sanitasi'],
      protocols: [
        { protocol: 'MQTT over TLS (MQTTS)', usage: 'Komunikasi dua arah antara server Cloud dan mikrokontroler loker untuk perintah buka pintu dan telemetri suhu', targetDeviceOrService: 'Cloud Backend <-> ESP32 Locker Controller' },
        { protocol: 'HTTPS REST API', usage: 'Pemesanan makanan online, penerbitan token OTP, dan validasi barcode', targetDeviceOrService: 'Mobile App / Kiosk -> Backend Server' },
        { protocol: 'Web Push / WhatsApp Cloud API', usage: 'Mengirimkan notifikasi QR code dan nomor loker ke handphone pelanggan', targetDeviceOrService: 'Notification Worker -> Smartphone Tamu' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/automat/lockers/unlock-by-qr',
          description: 'Validasi kode QR tamu di depan loker dan memicu relay kunci solenoid terbuka',
          samplePayload: '{\n  "scanned_qr_payload": "LOCK-AUTH-TOKEN-99482",\n  "locker_kiosk_id": "STATION-GAMBIR-01"\n}',
          sampleResponse: '{\n  "compartment_number": 5,\n  "unlocked": true,\n  "led_color": "GREEN",\n  "item_name": "Bento Beef Teriyaki"\n}'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/automat/telemetry/temperatures',
          description: 'Laporan telemetri suhu kompartemen pemanas/pendingin dari sensor IoT',
          samplePayload: '{\n  "compartment_id": "C-05",\n  "temperature_celsius": 66.4,\n  "heater_status": "MAINTAINING",\n  "door_state": "CLOSED_LOCKED"\n}',
          sampleResponse: '{ "ack": true, "haccp_compliant": true }'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Immediate Hard Deduct saat pelanggan menyelesaikan pembayaran di aplikasi mobile.',
        logic: 'Pemotongan resep BOM baku bento pack dan cup minuman.',
        bomMapping: '1 Box Bento Teriyaki = 150g Daging Sapi + 200g Nasi Jepang + 1 Bento Box Packaging + 1 Set Sumpit.',
        spoilageAndWaste: 'Jika makanan tidak diambil tamu dalam 60 menit, sistem mengirim alarm disposal dan mencatat `EXPIRED_PICKUP_ABANDONED`.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'Database Compartment Allocation Lock: Mencegah dua pesanan berbeda dialokasikan ke kompartemen loker yang sama.',
        raceConditionHandling: 'Status kompartemen dikunci secara atomik saat dapur menekan "Load Food".',
        rollbackPolicy: 'Jika loker gagal membuka secara mekanis, sistem mendeteksi error solenoid dan mengembalikan dana tamu (Auto Refund).'
      },
      offlineResilience: {
        localPersistence: 'Mikrokontroler loker menyimpan tabel cache PIN OTP lokal selama 24 jam.',
        syncStrategy: 'Jika koneksi internet putus, pelanggan tetap bisa membuka loker dengan mengetik 6-digit PIN darurat di keypad fisik.',
        conflictResolution: 'Log buka pintu disimpan di memory flash lokal dan di-upload saat koneksi internet pulih.'
      },
      developerChecklist: [
        'Rancang firmware ESP32 untuk mengontrol relay solenoid kunci pintu loker via protokol MQTT',
        'Integrasikan sensor pembaca suhu DS18B20 per kompartemen untuk jaminan mutu makanan panas (>60°C HACCP)',
        'Buat sistem enkripsi OTP dan QR code bertanggal kedaluwarsa singkat (TTL 30 menit) anti-replay',
        'Implementasikan fitur fail-safe: jika pintu gagal membuka, kirim alert teknisi dan opsi pindah ke loker cadangan'
      ]
    },
    sampleJsonPayload: '{\n  "service_type": "SMART_AUTOMAT_LOCKER",\n  "order_id": "ATMT-00918",\n  "assigned_compartment": 5,\n  "temperature_zone": "HEATED_WARMER_65C",\n  "door_status": "POPPED_OPEN",\n  "sensor_temp_actual": 65.8\n}'
  },

  // 4.1 Drive-Thru
  {
    id: 'drive_thru_service',
    categoryId: 'drive_vehicle',
    categoryName: 'Layanan Kendaraan',
    name: 'Drive-Thru (Intercom, Multi-Window Lane)',
    englishTitle: 'Drive-Thru Multi-Window Lane & Speed-of-Service Telemetry',
    badge: 'DRIVE-THRU LANE',
    badgeColor: 'bg-indigo-700 text-white font-bold',
    overview: 'Pelanggan memesan dari dalam mobil melalui tiang intercom nirkabel (Order Post), melintasi loop detektor magnetik bawah aspal, membayar di jendela pertama (Window 1), dan mengambil kantong makanan di jendela kedua (Window 2) dengan pengawasan target durasi Speed of Service (<180 detik).',
    targetVenues: ['Fast Food Drive-Thru (Burger, Fried Chicken, Donat)', 'Coffee Shop Drive-Thru', 'Apotek & Toko Roti Jalur Mobil'],
    metrics: {
      turnaroundTime: '2 - 3.5 Menit (< 180s)',
      laborIntensity: 'Tinggi',
      techReliance: 'Tinggi',
      wasteRiskLevel: 'Rendah',
      averageCheckSize: 'Ekonomis'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Kedatangan Mobil & Deteksi Ground Loop',
        actor: 'Mobil Pelanggan & Sensor Magnetik',
        actionSummary: 'Mobil melindas sensor inductive loop di bawah aspal sebelum papan menu (Menu Board).',
        detailFlow: 'Sensor membunyikan nada chime di headset nirkabel kasir, kamera LPR (License Plate Recognition) membaca plat nomor mobil B 1234 XYZ, dan timer Speed-of-Service mulai berhitung.',
        systemTrigger: 'VEHICLE_APPROACHING_MENU_POST',
        apiTrigger: 'POST /api/v1/drivethru/vehicle-detected',
        dbImpact: 'Buat sesi drive-thru: license_plate = "B 1234 XYZ", start_timer = now.'
      },
      {
        stepNumber: 2,
        phaseName: 'Pemesanan via Interkom Nirkabel & Layar ODCU',
        actor: 'Pelanggan & Kasir Headset',
        actionSummary: 'Pelanggan berbicara dengan kasir melalui interkom audio duplex. Pesanan tampil di layar konfirmasi luar ruangan (ODCU).',
        detailFlow: 'Kasir menginput menu di POS drive-thru. Pelanggan melihat nama menu dan total harga langsung di layar luar ruangan tahan hujan/panas.',
        systemTrigger: 'ORDER_CONFIRMED_AT_SPEAKER',
        apiTrigger: 'POST /api/v1/drivethru/order-submit',
        dbImpact: 'Kirim tiket ke KDS dapur dengan tag antrean mobil #01.'
      },
      {
        stepNumber: 3,
        phaseName: 'Jendela 1 (Window 1) - Verifikasi & Pembayaran',
        actor: 'Pelanggan & Kasir Jendela 1',
        actionSummary: 'Mobil maju ke jendela pertama. Kasir mencocokkan plat nomor/foto mobil dan memproses pembayaran.',
        detailFlow: 'Pelanggan men-tap kartu debit/kredit di mesin EDC nirkabel atau scan QRIS melalui kaca mobil. Struk pembayaran tercetak.',
        systemTrigger: 'PAYMENT_COMPLETED_WINDOW_1',
        apiTrigger: 'POST /api/v1/drivethru/pay-window-1',
        dbImpact: 'Status order menjadi "PAID", mobil diarahkan meluncur ke jendela 2.'
      },
      {
        stepNumber: 4,
        phaseName: 'Jendela 2 (Window 2) - Pengemasan & Pengambilan',
        actor: 'Bagger Dapur & Runner Jendela 2',
        actionSummary: 'Mobil tiba di jendela kedua. Petugas menyerahkan kantong makanan panas dan minuman bersegel dingin.',
        detailFlow: 'Petugas mencocokkan nomor kantong dengan mobil yang ada di hadapannya, menyerahkan kantong melalui jendela mobil dalam < 15 detik.',
        systemTrigger: 'FOOD_HANDED_OVER_WINDOW_2',
        apiTrigger: 'PATCH /api/v1/drivethru/handoff-window-2',
        dbImpact: 'Catat waktu selesai saji per kendaraan.'
      },
      {
        stepNumber: 5,
        phaseName: 'Mobil Melindas Exit Loop & Tutup Timer SOS',
        actor: 'Mobil & Exit Loop Detector',
        actionSummary: 'Mobil melaju pergi melindas sensor loop keluar. Timer total Speed of Service (SOS) berhenti.',
        detailFlow: 'Dashboard memvalidasi total durasi: 142 detik (di bawah target standar 180s, indikator hijau). Data efisiensi shift terupdate otomatis.',
        systemTrigger: 'VEHICLE_EXITED_LANE',
        apiTrigger: 'POST /api/v1/drivethru/vehicle-exit',
        dbImpact: 'Simpan total durasi antrean kendaraan di log analitik performa.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Drive-Thru POS Kasir Jendela 1', 'Drive-Thru Hand-off Monitor Jendela 2', 'Layar Konfirmasi Pesanan Luar Ruangan (ODCU 32" High Brightness Outdoor)', 'KDS Stasiun Bagger Dapur'],
      hardwareRequired: ['Inductive Ground Loop Detector (Sensor Deteksi Mobil Bawah Aspal)', 'Kamera LPR (License Plate Recognition) Pembaca Plat Nomor', 'Sistem Interkom Headset Nirkabel Full Duplex (Frekuensi 1.9GHz DECT)', 'Dual-Window High-Speed Thermal Receipt & Label Printer'],
      protocols: [
        { protocol: 'SIP / VoIP / RTP', usage: 'Transmisi audio dua arah antara tiang interkom luar ruangan dan headset staf', targetDeviceOrService: 'Outdoor Intercom Post <-> Wireless Headset Base' },
        { protocol: 'RTSP / ONVIF', usage: 'Streaming video kamera LPR untuk deteksi plat nomor dan visual kendaraan', targetDeviceOrService: 'IP Camera -> AI Vision Engine' },
        { protocol: 'TCP/IP Socket', usage: 'Koneksi data real-time ke layar Outdoor Order Confirmation Unit (ODCU)', targetDeviceOrService: 'POS Server -> ODCU Display Controller' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/drivethru/vehicle-detected',
          description: 'Mencatat kedatangan mobil dari sensor loop detektor magnetik dan kamera plat nomor',
          samplePayload: '{\n  "loop_sensor_id": "LOOP-ORDER-POST",\n  "license_plate": "B 1234 XYZ",\n  "vehicle_type": "SUV_BLACK",\n  "timestamp": "2026-10-29T21:30:15Z"\n}',
          sampleResponse: '{\n  "queue_position": 2,\n  "session_id": "DT-20261029-019",\n  "headset_alert_chime": true\n}'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/drivethru/vehicle-exit',
          description: 'Mencatat mobil meninggalkan jendela 2 dan menghitung metrik Speed-of-Service (SOS)',
          samplePayload: '{ "session_id": "DT-20261029-019", "loop_sensor_id": "LOOP-EXIT" }',
          sampleResponse: '{\n  "total_seconds": 142,\n  "target_seconds": 180,\n  "performance_rating": "EXCELLENT",\n  "bottleneck_station": "NONE"\n}'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Deduction saat pembayaran di Jendela 1 sukses.',
        logic: 'Pemotongan resep BOM kombo (Burger, Minuman Soda, Kentang, Kantong Kertas Take-Away, Sedotan).',
        bomMapping: '1 Paket Drive-Thru Combo = Makanan + Minuman + Paper Bag Seal + Napkin Pack.',
        spoilageAndWaste: 'Jika mobil kabur (drive-off) sebelum bayar, kasir menekan tombol "Drive-Off Abandoned" untuk mem-void order dan mencatat waste daging yang terlanjur dirakit.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'FIFO Queue State Machine (`APPROACHING -> ORDERING -> PAYING -> PICKUP -> COMPLETED`).',
        raceConditionHandling: 'Penanganan jika ada mobil menyalip (overtaking) dengan mencocokkan plat nomor kamera di setiap jendela.',
        rollbackPolicy: 'Mekanisme "Park & Hold" (mobil dipersilakan parkir menunggu ke depan jika pesanan membutuhkan waktu masak lebih lama, agar tidak menyumbat antrean di belakang).'
      },
      offlineResilience: {
        localPersistence: 'Drive-Thru POS terhubung ke server lokal di dalam restoran (On-Premises Local Server).',
        syncStrategy: 'Berjalan 100% lancar saat internet mati. Data diunggah ke cloud saat koneksi internet aktif.',
        conflictResolution: 'Local server memiliki wewenang master mutlak.'
      },
      developerChecklist: [
        'Rancang State Machine antrean kendaraan berurutan (FIFO) dengan dukungan plat nomor LPR',
        'Integrasikan driver layar outdoor ODCU (Order Confirmation Unit) untuk menampilkan harga ke pengemudi',
        'Buat dashboard analitik Speed of Service (SOS) dengan target SLA durasi per zona antrean',
        'Sediakan tombol darurat "Park & Hold" untuk mengalihkan pesanan lama ke area parkir tunggu'
      ]
    },
    sampleJsonPayload: '{\n  "drive_thru_session": "DT-8891",\n  "license_plate": "B 1234 XYZ",\n  "current_zone": "WINDOW_2_PICKUP",\n  "elapsed_seconds": 138,\n  "sos_sla_status": "WITHIN_TARGET"\n}'
  },

  // 4.2 Drive-In / Carhop
  {
    id: 'drive_in_carhop',
    categoryId: 'drive_vehicle',
    categoryName: 'Layanan Kendaraan',
    name: 'Drive-In / Carhop Service',
    englishTitle: 'Dedicated Bay Parking, Window Tray & Carhop Delivery',
    badge: 'CARHOP & BAY PARKING',
    badgeColor: 'bg-indigo-600 text-white font-bold',
    overview: 'Pelanggan memarkir mobil di slot parkir khusus (stall/bay parking), memesan dari dalam mobil via tombol interkom tiang parkir atau aplikasi QR, lalu pelayan berseragam khusus (carhop) membawakan makanan dengan baki gantung yang dipasang di jendela kaca mobil pelanggan.',
    targetVenues: ['Retro American Diner', 'Drive-In Fast Food Tradisional', 'Tempat Nongkrong Mobil Komunitas', 'Street Food Parkir Mobil'],
    metrics: {
      turnaroundTime: '30 - 60 Menit',
      laborIntensity: 'Tinggi',
      techReliance: 'Sedang',
      wasteRiskLevel: 'Rendah',
      averageCheckSize: 'Menengah'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Parkir di Slot Stall Khusus (Bay Parking)',
        actor: 'Pengemudi Mobil & Sensor Parkir',
        actionSummary: 'Pengemudi memarkir mobil di Stall #07. Di depan mobil terdapat tiang menu dan tombol panggil interkom.',
        detailFlow: 'Sensor ultrasonik tiang parkir mendeteksi mobil terparkir, mengubah status Stall #07 menjadi OCCUPIED di peta monitor kasir.',
        systemTrigger: 'PARKING_BAY_OCCUPIED',
        apiTrigger: 'POST /api/v1/carhop/bays/{bayId}/occupy',
        dbImpact: 'Ubah status stall #07 menjadi occupied, nyalakan lampu bay.'
      },
      {
        stepNumber: 2,
        phaseName: 'Tekan Tombol Merah Interkom Tiang / Scan QR',
        actor: 'Pelanggan Mobil',
        actionSummary: 'Pelanggan menekan tombol merah menyala di tiang parkir atau memindai kode QR yang tertera di tiang.',
        detailFlow: 'Bel berbunyi di ruang operator kasir sentral, operator menjawab: "Halo Stall 07, mau pesan apa hari ini?". Pesanan dicatat di sistem.',
        systemTrigger: 'BAY_CALL_BUTTON_PRESSED',
        apiTrigger: 'POST /api/v1/carhop/bays/{bayId}/call-operator',
        dbImpact: 'Buat tiket pesanan terkait nomor stall #07.'
      },
      {
        stepNumber: 3,
        phaseName: 'Dapur Merakit Hidangan di Baki Kaca Mobil',
        actor: 'Koki Dapur & Carhop Staging',
        actionSummary: 'Dapur memasak burger, hotdog, dan milkshake, menatanya di atas baki logam khusus berperekat jendela mobil (window tray).',
        detailFlow: 'KDS memunculkan notifikasi: "Stall 07 Siap Diantar". Carhop mengambil baki dan membawa mesin EDC portabel.',
        systemTrigger: 'CARHOP_TRAY_READY',
        apiTrigger: 'PATCH /api/v1/kitchen/tickets/{ticketId}/ready-carhop',
        dbImpact: 'Catat waktu selesai masak di dapur.'
      },
      {
        stepNumber: 4,
        phaseName: 'Carhop Mengantarkan & Memasang Baki di Jendela',
        actor: 'Carhop (Pelayan)',
        actionSummary: 'Carhop menghampiri mobil di Stall 07, memasang kait baki di kaca jendela mobil pintu kemudi, dan menyapa tamu.',
        detailFlow: 'Tamu menikmati makanan dan minuman langsung dari kenyamanan dalam kabin mobil ber-AC sambil mendengarkan musik.',
        systemTrigger: 'FOOD_DELIVERED_TO_CAR_WINDOW',
        apiTrigger: 'POST /api/v1/carhop/bays/{bayId}/tray-hooked',
        dbImpact: 'Status bay menjadi "dining_in_car".'
      },
      {
        stepNumber: 5,
        phaseName: 'Panggilan Ambil Baki & Pembayaran di Mobil',
        actor: 'Pelanggan & Carhop',
        actionSummary: 'Setelah selesai makan, pelanggan menekan tombol panggil kembali. Carhop datang membawa EDC nirkabel untuk pembayaran.',
        detailFlow: 'Tamu membayar via kartu / uang tunai dari dalam mobil, carhop melepaskan baki jendela, membersihkan sampah, dan mobil melaju pulang.',
        systemTrigger: 'PAYMENT_AT_CAR_AND_BAY_RELEASED',
        apiTrigger: 'POST /api/v1/carhop/bays/{bayId}/checkout',
        dbImpact: 'Tutup sesi transaksi, ubah status stall menjadi VACANT hijau.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Konsol Operator Interkom Parkir Sentral', 'KDS Dapur Carhop', 'Layar Tablet / Mobile EDC Kasir Nirkabel Carhop'],
      hardwareRequired: ['Tiang Interkom Parkir Tahan Cuaca IP66 per Stall', 'Baki Gantung Kaca Mobil (Car Window Clamp Tray)', 'Mobile Wireless EDC 4G / Wi-Fi', 'Sensor Parkir Ultrasonik / Kamera Deteksi Slot Mobil'],
      protocols: [
        { protocol: 'Modbus / RS485 Industrial Bus', usage: 'Membaca tombol panggil fisik dari 30 tiang parkir ke sentral operator kasir', targetDeviceOrService: 'Stall Button Hardware <-> Central Relay Box' },
        { protocol: 'SIP / VoIP Analog-to-IP Gateway', usage: 'Routing suara audio interkom tiang parkir ke headset operator kasir', targetDeviceOrService: 'Outdoor Intercom Posts <-> PBX Server' },
        { protocol: 'WebSocket (WSS)', usage: 'Sinkronisasi peta visual status stall (Hijau: Kosong, Kuning: Memesan, Biru: Makan, Merah: Minta Bill)', targetDeviceOrService: 'POS Server -> Carhop Map UI' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/carhop/bays/{bayId}/occupy',
          description: 'Mencatat mobil masuk ke slot parkir stall carhop',
          samplePayload: '{ "bay_number": 7, "sensor_status": "VEHICLE_PRESENT" }',
          sampleResponse: '{ "bay_id": "BAY-07", "status": "OCCUPIED" }'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/carhop/bays/{bayId}/checkout',
          description: 'Penyelesaian pembayaran di jendela mobil dan pembebasan slot parkir',
          samplePayload: '{\n  "bay_id": "BAY-07",\n  "payment_method": "EDC_WIRELESS_CARD",\n  "amount": 128000,\n  "tray_retrieved": true\n}',
          sampleResponse: '{ "status": "closed", "bay_status": "VACANT" }'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Deduction saat pesanan di-input operator kasir ke sistem.',
        logic: 'Pemotongan resep BOM baku menu diner (Burger, Milkshake, Keripik Kentang).',
        bomMapping: '1 Milkshake Cokelat = 180ml Es Krim Vanilla + 120ml Susu Cair + 30ml Sirup Cokelat + Whipped Cream.',
        spoilageAndWaste: 'Pencatatan tumpahan makanan di luar ruangan via form kerugian carhop.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'Bay-Level Isolation Lock: Tiap slot parkir menjadi entitas terisolasi mirip nomor meja resto.',
        raceConditionHandling: 'Pencegahan dua mobil mengklaim bay yang sama dengan verifikasi sensor ultrasonik.',
        rollbackPolicy: 'Void order sebelum baki diantar membutuhkan pembatalan operator sentral.'
      },
      offlineResilience: {
        localPersistence: 'Mobile EDC nirkabel memiliki koneksi SIM 4G mandiri jika Wi-Fi luar ruangan lemah.',
        syncStrategy: 'Sistem interkom suara tetap berfungsi analog jika komputer lokal down.',
        conflictResolution: 'Manual ticket writing backup.'
      },
      developerChecklist: [
        'Desain visual peta denah parkir (Bay Parking Grid Map) interaktif dengan indikator warna status',
        'Integrasikan pembacaan tombol panggil tiang parkir via protokol serial/Modbus ke event WebSocket',
        'Dukungan mobile EDC pembayaran nirkabel portabel di area parkir luar gedung',
        'Fitur pencocokan durasi parkir mobil untuk analitik perputaran slot (Bay Turnaround Rate)'
      ]
    },
    sampleJsonPayload: '{\n  "service_type": "DRIVE_IN_CARHOP",\n  "bay_number": 7,\n  "carhop_staff": "Dina Astuti",\n  "window_tray_status": "ATTACHED_TO_CAR",\n  "order_total": 128000\n}'
  },

  // 5.1 Omakase / Chef's Table
  {
    id: 'omakase_chefs_table',
    categoryId: 'special_concepts',
    categoryName: 'Konsep Khusus',
    name: "Omakase / Chef's Table",
    englishTitle: 'Personalized Degustation & Live Counter Crafting',
    badge: 'OMAKASE & CHEF TABLE',
    badgeColor: 'bg-purple-700 text-white font-bold',
    overview: 'Tidak ada menu standar tetap; tamu duduk mengelilingi meja konter intim (8-12 kursi) langsung di hadapan Chef. Chef menentukan, meracik, menceritakan filosofi, dan menyajikan 15-20 hidangan berurutan (coursed degustation) menggunakan tangkapan laut musiman harian dengan sistem deposit reservasi ketat.',
    targetVenues: ['Authentic Japanese Omakase', "Fine Dining Chef's Table", 'Artisan Degustation Bar', 'Private Dining Club'],
    metrics: {
      turnaroundTime: '120 - 180 Menit (Fixed Seating)',
      laborIntensity: 'Sangat Tinggi',
      techReliance: 'Tinggi',
      wasteRiskLevel: 'Kritis (Fresh Seasonal)',
      averageCheckSize: 'Luxury/Ultra'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Reservasi Awal & Deposit Pre-Auth 100%',
        actor: 'Tamu & Engine Reservasi Online',
        actionSummary: 'Tamu memesan kursi berminggu-minggu sebelumnya, membayar deposit penuh (non-refundable) dan mencatat alergi.',
        detailFlow: 'Tamu memilih sesi (Sesi 1: 18.00, Sesi 2: 20.30), mengisi profil alergi (misal: Alergi Kerang / No Wasabi). Payment gateway menahan deposit kartu kredit.',
        systemTrigger: 'OMAKASE_RESERVATION_DEPOSITED',
        apiTrigger: 'POST /api/v1/omakase/reservations',
        dbImpact: 'Kunci kursi meja counter, catat profil alergi tamu di database tamu VIP.'
      },
      {
        stepNumber: 2,
        phaseName: 'Alokasi Belanja Pasar Subuh (Zero Excess Policy)',
        actor: 'Master Chef & Gudang Chiller',
        actionSummary: 'Chef membeli tangkapan laut harian di pasar ikan Toyosu/Lokal persis sesuai jumlah pax terdaftar hari itu.',
        detailFlow: 'Chef membuka menu "Daily Catch Input" di tablet, mendaftarkan nama ikan segar langka (Otoro, Uni Hokkaido, Kinmedai) dan mengaitkannya ke resep 18-course malam ini.',
        systemTrigger: 'DAILY_CATCH_ALLOCATED',
        apiTrigger: 'POST /api/v1/omakase/daily-catch-menu',
        dbImpact: 'Formulasi BOM dinamis hari ini: 12 pax x 1 porsi per jenis ikan segar.'
      },
      {
        stepNumber: 3,
        phaseName: 'Kedatangan Tamu Serentak & Duduk di Meja Konter',
        actor: 'Hostess & Tamu (Maksimal 12 Pax)',
        actionSummary: 'Seluruh tamu sesi 1 tiba tepat waktu dan duduk melingkari meja kayu hinoki di depan chef.',
        detailFlow: 'Hostess menyajikan handuk hangat (oshibori) dan sommelier menawarkan paket sake pairing eksklusif.',
        systemTrigger: 'OMAKASE_SEATING_COMMENCED',
        apiTrigger: 'PATCH /api/v1/omakase/sessions/{sessionId}/seat-guests',
        dbImpact: 'Status sesi menjadi active_dining_session.'
      },
      {
        stepNumber: 4,
        phaseName: 'Live Crafting & Course-by-Course Storytelling',
        actor: 'Master Chef',
        actionSummary: 'Chef mengiris sashimi, mengepal nigiri dengan beras sushi hangat, mengoleskan kecap nikiri, dan menyajikan langsung ke piring batu tamu.',
        detailFlow: 'Tablet Chef menampilkan urutan hidangan (Course 01/18 hingga 18/18) lengkap dengan catatan alergi tamu kursi #04 yang diganti jenis ikannya.',
        systemTrigger: 'COURSE_DISPENSED_LIVE',
        apiTrigger: 'POST /api/v1/omakase/advance-course',
        dbImpact: 'Catat progres course, update pacing timer degustasi.'
      },
      {
        stepNumber: 5,
        phaseName: 'Pencatatan Tambahan Minuman & Settlement',
        actor: 'Sommelier & Kasir',
        actionSummary: 'Kasir hanya menagih botol sake dan minuman tambahan karena biaya makanan sudah lunas di muka via deposit.',
        detailFlow: 'Deposit awal di-capture otomatis, nota akhir diterbitkan, dan preferensi hidangan favorit tamu disimpan di profil CRM untuk kunjungan berikutnya.',
        systemTrigger: 'OMAKASE_SESSION_COMPLETED',
        apiTrigger: 'POST /api/v1/omakase/sessions/{sessionId}/checkout',
        dbImpact: 'Selesaikan transaksi, potong stok sake dan catat feedback CRM tamu.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Tablet Master Chef (iPad Pro di Belakang Konter)', 'Tablet Sommelier Minuman Wine/Sake', 'Layar Booking & Profil Tamu Resepsionis'],
      hardwareRequired: ['Precision Gram Digital Scale Bluetooth (0.01g untuk Caviar / Uni)', 'Thermal Receipt Printer', 'Terminal Pembayaran Kartu EDC Terintegrasi'],
      protocols: [
        { protocol: 'HTTPS REST API', usage: 'Reservasi pre-payment deposit kartu kredit dan manajemen profil preferensi diet tamu', targetDeviceOrService: 'Web Booking Engine -> Cloud Backend' },
        { protocol: 'WebSocket (WSS)', usage: 'Sinkronisasi progres course (Course 7 dari 18) antara tablet chef dan stasiun persiapan dapur belakang', targetDeviceOrService: "Chef's Counter Tablet <-> Back Kitchen Prep Screen" },
        { protocol: 'Web Bluetooth API', usage: 'Membaca otomatis penimbangan ikan langka bernilai jutaan rupiah per porsi', targetDeviceOrService: 'Precision Scale -> Tablet Chef' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/omakase/daily-catch-menu',
          description: 'Input fleksibel daftar tangkapan ikan harian dan komposisi 18-course hari ini',
          samplePayload: '{\n  "session_date": "2026-10-29",\n  "courses_count": 18,\n  "fish_lot_items": [\n    { "course_num": 1, "name": "Otoro Nigiri", "origin": "Aomori Japan", "portion_grams": 35 },\n    { "course_num": 2, "name": "Bafun Uni Gunkan", "origin": "Hokkaido", "portion_grams": 25 }\n  ]\n}',
          sampleResponse: '{\n  "menu_id": "OMK-20261029",\n  "bom_formulation_locked": true,\n  "allocated_pax": 12\n}'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/omakase/advance-course',
          description: 'Melanjutkan ke urutan hidangan berikutnya untuk seluruh tamu counter',
          samplePayload: '{ "session_id": "SES-OMK-01", "current_course": 8, "next_course": 9 }',
          sampleResponse: '{ "course_title": "A5 Miyazaki Wagyu Sukiyaki", "allergy_alerts": ["Seat 4: No Raw Egg"] }'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Zero Excess Policy: Bahan baku ikan segar dialokasikan penuh di pagi hari saat chef mencatat Daily Catch Input.',
        logic: 'Pemotongan stok berbasis porsi presisi gramasi tanpa sisa (sisa potongan ikan otomatis dialokasikan ke kaldu sup miso dashi).',
        bomMapping: 'Dynamic Daily BOM: Resep disesuaikan setiap pagi hari sesuai pasokan ikan terbaik yang berhasil didapat chef di pasar.',
        spoilageAndWaste: 'Waste nyaris 0% karena semua pax terkonfirmasi 100% lunas deposit sebelum bahan dibeli.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'Seat-Specific Strict Reservation Lock: Mencegah overbooking pada meja counter yang hanya memiliki 8-12 kursi.',
        raceConditionHandling: 'Penanganan deposit kartu kredit dengan 3D Secure OTP untuk menjamin dana tersimpan aman di rekening penampung (escrow).',
        rollbackPolicy: 'Kebijakan no-refund jika tamu membatalkan kehadiran kurang dari 48 jam sebelum sesi.'
      },
      offlineResilience: {
        localPersistence: 'Tablet chef menyimpan daftar tamu dan alergi secara lokal di browser cache IndexedDB.',
        syncStrategy: 'Bisa berjalan mandiri tanpa koneksi internet saat sesi live crafting berlangsung.',
        conflictResolution: 'Chef adalah pemegang keputusan tertinggi (Human in the Loop).'
      },
      developerChecklist: [
        'Bangun sistem reservasi dengan pre-authorization deposit kartu kredit dan kebijakan pembatalan ketat',
        'Buat modul formulasi resep harian dinamis (Dynamic Daily BOM) yang bisa diubah chef setiap pagi',
        'Rancang layar pemantau alergi tamu per nomor kursi (Seat Allergy Matrix) di tablet chef',
        'Integrasikan CRM profil tamu untuk menyimpan catatan hidangan kesukaan dan botol sake langganan'
      ]
    },
    sampleJsonPayload: '{\n  "service_type": "OMAKASE_DEGUSTATION",\n  "counter_capacity": 10,\n  "active_course": 8,\n  "total_courses": 18,\n  "current_dish": "Hokkaido Scallop Aburi",\n  "seat_alerts": { "seat_4": "GLUTEN_FREE_TAMARI_SOY" }\n}'
  },

  // 5.2 Food Court / Food Hall
  {
    id: 'food_court_food_hall',
    categoryId: 'special_concepts',
    categoryName: 'Konsep Khusus',
    name: 'Food Court / Food Hall (Multi-Tenant)',
    englishTitle: 'Multi-Tenant Split Settlement & Central Escrow',
    badge: 'MULTI-TENANT & SPLIT ESCROW',
    badgeColor: 'bg-amber-600 text-white font-bold',
    overview: 'Konsep ruang makan komunal di mana pembeli memesan dari berbagai macam vendor/tenant independen yang berbeda di bawah satu atap. Dilengkapi sistem pemesanan kasir terpusat atau QR bersama, pemisahan tiket printer ke masing-masing stand, dan bagi hasil otomatis (split revenue settlement).',
    targetVenues: ['Food Court Mall Perbelanjaan', 'Modern Food Hall Terbuka', 'Pusat Jajanan Serba Ada (Pujasera)', 'Kolektif Kuliner Urban'],
    metrics: {
      turnaroundTime: '20 - 40 Menit',
      laborIntensity: 'Sedang',
      techReliance: 'Tinggi',
      wasteRiskLevel: 'Rendah',
      averageCheckSize: 'Ekonomis'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Tamu Jelajahi Multi-Tenant & Satu Keranjang Belanja',
        actor: 'Tamu / Pembeli',
        actionSummary: 'Tamu duduk di meja komunal atau mendatangi kasir sentral, memilih menu dari 3 tenant berbeda sekaligus.',
        detailFlow: 'Tamu memesan: 1 Nasi Padang (Tenant A), 1 Ramen Kuah (Tenant B), dan 2 Es Teh Manis (Tenant Minuman Sentral) dalam satu nota belanja.',
        systemTrigger: 'MULTI_TENANT_CART_CREATED',
        apiTrigger: 'POST /api/v1/foodcourt/unified-order',
        dbImpact: 'Buat master order ID yang memayungi 3 sub-order tenant.'
      },
      {
        stepNumber: 2,
        phaseName: 'Satu Pembayaran & Pembagian Rekening Otomatis (Split Escrow)',
        actor: 'Tamu & Payment Gateway',
        actionSummary: 'Tamu hanya membayar 1 kali total transaksi (misal Rp 115.000) via QRIS / Kartu.',
        detailFlow: 'Mesin pembayaran memecah dana otomatis: 80% ke rekening Tenant A, 80% ke Tenant B, 15% revenue share ke Pengelola Mall, dan 5% biaya admin MDR.',
        systemTrigger: 'SPLIT_PAYMENT_SETTLED',
        apiTrigger: 'POST /api/v1/payments/split-escrow-payout',
        dbImpact: 'Bukukan saldo ledger terpisah per akun tenant di database.'
      },
      {
        stepNumber: 3,
        phaseName: 'Pemisahan Tiket ke Masing-Masing Stand Dapur Tenant',
        actor: 'Router Tiket Server Dapur',
        actionSummary: 'Server memilah pesanan dan menembakkan tiket dapur hanya ke printer IP tenant yang bersangkutan.',
        detailFlow: 'Printer kasir Tenant A mencetak tiket nasi padang, tablet KDS Tenant B membunyikan lonceng pesanan ramen, printer bar mencetak pesanan es teh.',
        systemTrigger: 'DISPATCH_SUB_ORDERS_TO_TENANTS',
        apiTrigger: 'WS /ws/tenant-order-stream/{tenantId}',
        dbImpact: 'Sub-order status menjadi "preparing" di masing-masing tenant.'
      },
      {
        stepNumber: 4,
        phaseName: 'Pemberitahuan Siap Ambil per Tenant (Buzzer / SMS)',
        actor: 'Staf Tenant & Tamu',
        actionSummary: 'Saat Tenant A selesai menyiapkan nasi padang, staf menekan "Ready". Pager buzzer tamu bergetar atau SMS/WA terkirim.',
        detailFlow: 'Tamu mengambil nasi padang terlebih dahulu di counter Tenant A. 3 menit kemudian buzzer kedua bergetar untuk mengambil ramen di Tenant B.',
        systemTrigger: 'TENANT_SUB_ORDER_READY',
        apiTrigger: 'POST /api/v1/foodcourt/tenants/{tenantId}/ready',
        dbImpact: 'Catat kesiapan sub-order parsial.'
      },
      {
        stepNumber: 5,
        phaseName: 'Tutup Transaksi & Laporan Bagi Hasil Harian Otomatis',
        actor: 'Pengelola Food Court & Pemilik Tenant',
        actionSummary: 'Saat penutupan malam hari, sistem menerbitkan laporan rekonsiliasi omset bersih per tenant tanpa perselisihan.',
        detailFlow: 'Dana hasil penjualan otomatis ditransfer ke rekening bank masing-masing pemilik tenant setelah dikurangi komisi sewa tempat.',
        systemTrigger: 'DAILY_TENANT_RECONCILIATION_CLOSED',
        apiTrigger: 'POST /api/v1/foodcourt/daily-settlement-batch',
        dbImpact: 'Arsip penutupan buku besar harian multi-tenant.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Unified Kiosk / Kasir Sentral Pintu Masuk', 'Tablet KDS Ringan (Android 10") di Setiap Stand Tenant', 'Aplikasi Mobile Portal Pemilik Tenant (Pengecekan Omset Real-time)'],
      hardwareRequired: ['Router Subnet Jaringan Terisolasi antar Tenant', 'Thermal Printer Jaringan IP/LAN ESC/POS per Stand Tenant', 'Sistem Pager Buzzer Terpusat Multi-Channel', 'Monitor TV Status Antrean Publik Komunal'],
      protocols: [
        { protocol: 'RAW ESC/POS over TCP (Port 9100)', usage: 'Mengarahkan cetak struk pesanan dari kasir sentral langsung ke printer dapur IP masing-masing stand tenant', targetDeviceOrService: 'Backend Server -> IP Printers Tenant' },
        { protocol: 'WebSocket (Redis Pub/Sub)', usage: 'Kanal komunikasi data pesanan terisolasi per ID tenant (Tenant Isolation Room)', targetDeviceOrService: 'POS Sentral <-> Tablet Masing-Masing Stand' },
        { protocol: 'Webhook Split Payment API', usage: 'Integrasi transfer split payout perbankan otomatis ke multi-rekening mitra tenant', targetDeviceOrService: 'Payment Gateway -> Bank API Tenants' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/foodcourt/unified-order',
          description: 'Submit order komunal multi-tenant dengan pemecahan sub-order otomatis',
          samplePayload: '{\n  "table_id": "COMMUNAL-44",\n  "sub_orders": [\n    { "tenant_id": "TENANT-PADANG", "items": [{ "sku": "RENDANG", "qty": 1, "price": 28000 }] },\n    { "tenant_id": "TENANT-RAMEN", "items": [{ "sku": "TORI-PAITAN", "qty": 1, "price": 45000 }] }\n  ],\n  "payment_method": "QRIS_CENTRAL"\n}',
          sampleResponse: '{\n  "master_order_id": "FC-20261029-9901",\n  "total_amount": 73000,\n  "tenant_tickets_dispatched": ["TENANT-PADANG", "TENANT-RAMEN"]\n}'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/foodcourt/daily-settlement-batch',
          description: 'Eksekusi transfer bagi hasil harian otomatis ke rekening masing-masing pemilik tenant',
          samplePayload: '{ "settlement_date": "2026-10-29", "mall_commission_rate": 0.15 }',
          sampleResponse: '{\n  "total_gross_omset": 48500000,\n  "mall_revenue_share": 7275000,\n  "tenants_payout_total": 41225000,\n  "status": "TRANSFERRED_VIA_BANK_API"\n}'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Deduction terisolasi di database masing-masing tenant saat sub-order diterima stand.',
        logic: 'Tiap tenant memiliki master resep BOM dan stok bahan mentah mandiri yang tidak saling bercampur.',
        bomMapping: 'Multi-Tenant Database Isolation: Tenant A tidak bisa melihat stok bahan milik Tenant B.',
        spoilageAndWaste: 'Masing-masing pemilik tenant menginput kerugian bahan baku sendiri di aplikasi portal mitra.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'Distributed Two-Phase Commit (2PC) transaksi: Jika satu tenant menolak pesanan, sub-order tenant lain tetap diproses.',
        raceConditionHandling: 'Penanganan saldo penampung (escrow account) terpisah dengan audit trail buku besar akuntansi ganda.',
        rollbackPolicy: 'Refund parsial jika salah satu tenant kehabisan menu tanpa membatalkan pesanan tenant lainnya.'
      },
      offlineResilience: {
        localPersistence: 'Kasir sentral memiliki fallback printer antrean manual jika jaringan IP salah satu tenant terputus.',
        syncStrategy: 'Printer tenant memiliki antrean buffer cetak internal (hardware print spooler).',
        conflictResolution: 'Staf kasir sentral dapat memanggil kurir manual jika koneksi tablet tenant bermasalah.'
      },
      developerChecklist: [
        'Rancang arsitektur multi-tenant dengan isolasi data yang ketat antar stand makanan',
        'Implementasikan mesin pemisah pembayaran (Split Payment & Revenue Sharing) terintegrasi payment gateway',
        'Buat router pencetakan tiket dapur otomatis via protokol TCP Port 9100 ke IP printer tiap tenant',
        'Sediakan portal dashboard bagi hasil harian transparan untuk pemilik tenant dan pengelola food court'
      ]
    },
    sampleJsonPayload: '{\n  "food_court_id": "FC-GRAND-MALL",\n  "unified_order_id": "FC-9901",\n  "split_rules": [\n    { "tenant": "PADANG_EXPRESS", "amount": 28000, "net_payout": 23800 },\n    { "tenant": "RAMEN_BAR", "amount": 45000, "net_payout": 38250 },\n    { "mall_management_fee": 10950 }\n  ]\n}'
  },

  // 5.3 Ghost Kitchen / Cloud Kitchen
  {
    id: 'ghost_cloud_kitchen',
    categoryId: 'special_concepts',
    categoryName: 'Konsep Khusus',
    name: 'Ghost Kitchen / Cloud Kitchen',
    englishTitle: 'Multi-Brand Virtual Kitchen & Delivery Aggregator API Hub',
    badge: 'OMNICHANNEL AGGREGATOR',
    badgeColor: 'bg-rose-700 text-white font-bold',
    overview: 'Restoran tanpa fasilitas makan di tempat (delivery-only) yang mengoperasikan beberapa merek virtual (multi-brand) dalam satu fasilitas dapur bersama. Terintegrasi penuh dengan API agregator pengantaran (GrabFood, GoFood, ShopeeFood) dan papan koordinasi kurir ojek online.',
    targetVenues: ['Cloud Kitchen Hub', 'Virtual Brand Delivery Operator', 'Dark Kitchen Bakery & Dessert', 'Late-Night Delivery Hub'],
    metrics: {
      turnaroundTime: '10 - 20 Menit (Prep Time Target)',
      laborIntensity: 'Tinggi di Dapur',
      techReliance: 'Otomasi Penuh',
      wasteRiskLevel: 'Rendah (Prediktif)',
      averageCheckSize: 'Ekonomis'
    },
    operationalFlow: [
      {
        stepNumber: 1,
        phaseName: 'Penerimaan Pesanan Otomatis Multi-Aggregator (Omnichannel Hub)',
        actor: 'Konsumen Online & Aggregator API',
        actionSummary: 'Pesanan masuk serentak dari GrabFood, GoFood, dan ShopeeFood ke satu layar konsol sentral terpadu.',
        detailFlow: 'Sistem Middleware Omnichannel secara otomatis menerima pesanan (Auto-Accept) dalam 1 detik tanpa perlu staf menjaga 5 tablet ojol berbeda.',
        systemTrigger: 'DELIVERY_ORDER_WEBHOOK_INGESTED',
        apiTrigger: 'POST /api/v1/integrations/delivery-webhook',
        dbImpact: 'Simpan order dari berbagai merk virtual ke satu antrean dapur terpusat.'
      },
      {
        stepNumber: 2,
        phaseName: 'Routing Pesanan ke Stasiun Dapur Berdasarkan Jenis Masakan',
        actor: 'Sistem KDS Terpusat',
        actionSummary: 'Walaupun pesanan berasal dari 3 merk virtual berbeda, sistem membagi tiket berdasarkan stasiun wajan penggorengan (Fryer) dan stasiun panggangan (Grill).',
        detailFlow: 'Koki stasiun fryer menggoreng kentang untuk Brand A dan ayam geprek untuk Brand B secara efisien dari stok minyak yang sama.',
        systemTrigger: 'KDS_STATION_ROUTED',
        apiTrigger: 'WS /ws/kitchen-stations/fryer',
        dbImpact: 'Deduction stok bahan baku shared inventory secara atomik.'
      },
      {
        stepNumber: 3,
        phaseName: 'Pengemasan & Penempelan Label Segel Barcode (Bagger)',
        actor: 'Staf Bagging & Packaging',
        actionSummary: 'Makanan dimasukkan ke kantong take-away sesuai merk virtual, disegel dengan stiker keamanan tamper-evident.',
        detailFlow: 'Printer label berkecepatan tinggi mencetak stiker berisi: Nama Merk, Nomor Order (#GF-8821), Nama Driver, dan Rincian Menu.',
        systemTrigger: 'ORDER_PACKAGED_AND_SEALED',
        apiTrigger: 'POST /api/v1/kitchen/bag-sealed',
        dbImpact: 'Catat waktu selesai bungkus, ubah status order menjadi "ready_for_driver".'
      },
      {
        stepNumber: 4,
        phaseName: 'Papan TV Ruang Tunggu Kurir (Driver Dispatcher Board)',
        actor: 'Kurir Ojol & Layar TV Dispatcher',
        actionSummary: 'Layar TV di area parkir/ruang tunggu kurir menampilkan nomor order: "GrabFood #GF-8821 - Siap di Rak A-03".',
        detailFlow: 'Kurir ojol masuk ke area pickup, melihat nomor pesanannya, dan mengambil kantong makanan bersegel dari loker/rak A-03.',
        systemTrigger: 'DRIVER_DISPATCH_BOARD_UPDATED',
        apiTrigger: 'WS /ws/driver-board-stream',
        dbImpact: 'Broadcast status ke monitor TV driver.'
      },
      {
        stepNumber: 5,
        phaseName: 'Scan Barcode Serah Terima & Update Status Ojol OTW',
        actor: 'Kurir Ojol & Staf Dispatcher',
        actionSummary: 'Kurir atau staf men-scan barcode di kantong pesanan. Sistem mengirim webhook status "Driver On the Way" ke aplikasi konsumen.',
        detailFlow: 'Konsumen melihat status di aplikasi HP: "Makanan telah dijemput driver dan sedang meluncur ke alamat Anda". Siklus pesanan selesai.',
        systemTrigger: 'ORDER_HANDED_TO_DRIVER',
        apiTrigger: 'POST /api/v1/integrations/delivery/{orderId}/handover',
        dbImpact: 'Tutup siklus pesanan cloud kitchen, simpan analitik prep duration.'
      }
    ],
    techArchitecture: {
      frontendDevices: ['Omnichannel Aggregator Hub Screen (Tablet 12" / Desktop)', 'KDS Stasiun Dapur Multi-Brand (Touchscreen 21.5")', 'Driver Dispatcher Display TV (Android TV 43" di Ruang Tunggu Driver)'],
      hardwareRequired: ['Printer Label Thermal Khusus Stiker Segel Anti-Buka (Tamper-Evident Label Printer)', 'Scanner Barcode 2D Portabel untuk Serah Terima Driver', 'Rak Pengambilan Bernomor (Alphabetical Pickup Cubby Shelves A1-C10)'],
      protocols: [
        { protocol: 'Webhook (HTTPS REST dengan HMAC Signature)', usage: 'Menerima pesanan baru secara real-time dari API GrabFood, GoFood, dan ShopeeFood', targetDeviceOrService: 'Aggregator Servers -> Cloud Kitchen Gateway' },
        { protocol: 'WebSocket (WSS)', usage: 'Streaming nomor pesanan yang siap diambil ke layar TV ruang tunggu pengemudi ojek online', targetDeviceOrService: 'Server -> TV Driver Board' },
        { protocol: 'REST JSON (HTTPS)', usage: 'Mengupdate status toko (Buka/Tutup/Menu Habis) ke seluruh channel aplikasi ojol sekaligus', targetDeviceOrService: 'Kitchen Hub -> Aggregator OpenAPIs' }
      ],
      apiEndpoints: [
        {
          method: 'POST',
          endpoint: '/api/v1/integrations/delivery-webhook',
          description: 'Webhook penerima pesanan online dari GrabFood / GoFood / ShopeeFood',
          samplePayload: '{\n  "provider": "GRABFOOD",\n  "external_order_id": "GF-8821-X",\n  "virtual_brand": "Burger Brothers",\n  "items": [\n    { "item_sku": "BB-CHEESEBURGER", "qty": 2, "notes": "No Pickles" }\n  ],\n  "driver_name": "Rahmat Hidayat",\n  "driver_phone": "+6281299881122"\n}',
          sampleResponse: '{\n  "status": "ACCEPTED",\n  "prep_time_minutes": 15,\n  "kitchen_ticket_id": "CK-88192"\n}'
        },
        {
          method: 'POST',
          endpoint: '/api/v1/integrations/menu-sync/out-of-stock',
          description: 'Satu klik untuk menonaktifkan menu yang habis (86 Out of Stock) ke semua aplikasi pengantaran sekaligus',
          samplePayload: '{\n  "sku": "BB-CHEESEBURGER",\n  "is_available": false,\n  "apply_to_all_channels": true\n}',
          sampleResponse: '{\n  "channels_updated": ["GRABFOOD", "GOFOOD", "SHOPEEFOOD"],\n  "status": "synchronized"\n}'
        }
      ],
      inventoryDeductionRule: {
        timing: 'Immediate Hard Deduct begitu webhook order masuk dan di-auto-accept.',
        logic: 'Shared Raw Material Pooling: Dua brand virtual yang berbeda dapat menggunakan bahan baku yang sama dari satu gudang chiller.',
        bomMapping: '1 Burger Brand A & 1 Burger Brand B sama-sama memotong stok Patty Daging Sapi yang sama di gudang pusat.',
        spoilageAndWaste: 'Algoritma Kitchen Throttling: Jika antrean dapur > 20 order, sistem otomatis menambah estimasi prep time di aplikasi ojol agar makanan tidak terbengkalai.'
      },
      concurrencyAndLocking: {
        lockMechanism: 'High-Concurrency Atomic Ingestion Queue dengan Redis Queue / RabbitMQ.',
        raceConditionHandling: 'Mencegah lonjakan pesanan tiba-tiba membuat stok bahan minus dengan mekanisme auto-pause toko jika bahan kritis habis.',
        rollbackPolicy: 'Jika kurir membatalkan pengantaran, sistem mencari kurir pengganti otomatis melalui API aggregator.'
      },
      offlineResilience: {
        localPersistence: 'Local Hub Buffer: Jika internet Cloud down, order tetap diterima melalui koneksi 4G Failover LTE modem otomatis.',
        syncStrategy: 'Dual SIM 4G Router Failover untuk menjamin uptime dapur 99.9%.',
        conflictResolution: 'Auto-snooze toko sementara jika koneksi internet terputus lebih dari 3 menit.'
      },
      developerChecklist: [
        'Bangun middleware integrasi OpenAPI Aggregator (GrabFood Partner API, GoFood API, ShopeeFood)',
        'Implementasikan fitur 1-Klik Menu Sync (Ubah harga, status buka-tutup, dan 86 Out of Stock serentak)',
        'Buat layar antrean kurir ojol (Driver Dispatcher Display TV) dengan kode warna status pesanan',
        'Rancang arsitektur Shared Raw Material Pooling agar multi-brand virtual dapat berbagi inventaris fisik yang sama'
      ]
    },
    sampleJsonPayload: '{\n  "cloud_kitchen_id": "CK-JAKSEL-01",\n  "channel": "GRABFOOD",\n  "virtual_brand": "Ayam Geprek Sultan",\n  "order_code": "GF-8821",\n  "prep_status": "READY_IN_CUBBY_A03",\n  "driver_name": "Rahmat Hidayat",\n  "elapsed_prep_minutes": 11\n}'
  }
];
