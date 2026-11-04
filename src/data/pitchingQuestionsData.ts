// Data 50 Pertanyaan Audit & Pitching Restoran Komprehensif
// Dirancang khusus untuk Sales Consultant & Solution Architect GastroStock
// Memetakan kebutuhan riil, mengidentifikasi pain points, dan menyajikan rekomendasi solutif langsung ke Client/Owner Resto.

export interface PitchingQuestion {
  id: number;
  pillar: string;
  pillarName: string;
  pillarIcon: string;
  question: string;
  objective: string;
  redFlags: string[];
  options: {
    label: string;
    score: number; // 1 = Kritis/Rawan, 2 = Kurang, 3 = Standar, 4 = Baik/Modern
    hint: string;
  }[];
  recommendation: string;
  roiImpact: string;
}

export interface PillarCategory {
  id: string;
  name: string;
  badge: string;
  description: string;
  totalQuestions: number;
}

export const PILLARS: PillarCategory[] = [
  {
    id: 'pos_cashier',
    name: 'Operasional Kasir, POS & Penanganan Antrean',
    badge: 'Kasir & Front-of-House',
    description: 'Menilai kecepatan transaksi, keandalan sistem POS, pengelolaan meja, dan pencegahan antrean memanjang saat peak hours.',
    totalQuestions: 8
  },
  {
    id: 'kitchen_kds',
    name: 'Alur Komunikasi Dapur, KDS & Kitchen SLA',
    badge: 'Dapur & Back-of-House',
    description: 'Mengukur efektivitas pengiriman pesanan dari meja ke kompor, eliminasi kertas tiket kusut, dan durasi penyajian makanan.',
    totalQuestions: 8
  },
  {
    id: 'inventory_cogs',
    name: 'Manajemen Stok Bahan Baku, HPP (COGS) & Food Waste',
    badge: 'Gudang & Inventaris',
    description: 'Menganalisis kontrol bahan mentah, metode FEFO/FIFO, variance resep, dan kebocoran margin akibat basi/expired.',
    totalQuestions: 10
  },
  {
    id: 'finance_fraud',
    name: 'Keamanan Finansial, Audit Void & Pencegahan Fraud',
    badge: 'Finansial & Keamanan',
    description: 'Mengidentifikasi potensi manipulasi transaksi kasir, otorisasi void manual, selisih kas fisik closing, dan audit trail.',
    totalQuestions: 8
  },
  {
    id: 'customer_table',
    name: 'Pengalaman Pelanggan, Split Bill & Table Turn Rate',
    badge: 'Customer Experience',
    description: 'Mengevaluasi kenyamanan tamu dalam pembayaran (QRIS, kartu, split bill), durasi okupansi meja, dan retensi pelanggan.',
    totalQuestions: 8
  },
  {
    id: 'scale_multioutlet',
    name: 'Skalabilitas, Offline Resilience & Central Kitchen',
    badge: 'Infrastruktur & Multi-Outlet',
    description: 'Menilai kesiapan ekspansi cabang, ketahanan saat koneksi internet mati, konsolidasi laporan, dan pasokan dapur pusat.',
    totalQuestions: 8
  }
];

export const PITCHING_QUESTIONS: PitchingQuestion[] = [
  // =========================================================================
  // PILAR 1: OPERASIONAL KASIR, POS & PENANGANAN ANTREAN (8 PERTANYAAN)
  // =========================================================================
  {
    id: 1,
    pillar: 'pos_cashier',
    pillarName: 'Operasional Kasir & POS',
    pillarIcon: 'CreditCard',
    question: 'Berapa rata-rata waktu yang dibutuhkan kasir Anda untuk menyelesaikan 1 transaksi (mulai input menu hingga struk tercetak)?',
    objective: 'Mengukur efisiensi sistem POS saat jam sibuk dan potensi kehilangan pelanggan akibat antrean yang terlalu lama.',
    redFlags: [
      'Waktu transaksi > 90 detik per pelanggan',
      'Kasir harus mencari-cari menu di banyak halaman yang tidak terstruktur',
      'Printer thermal sering macet atau delay response'
    ],
    options: [
      { label: '> 2 menit per transaksi (Sering terjadi antrean mengular)', score: 1, hint: 'Kritis: Risiko kehilangan 15-20% pembeli saat peak hours' },
      { label: '60 - 120 detik (Kadang lambat jika menu kustom/modifikasi)', score: 2, hint: 'Perlu optimasi UI kasir dan auto-modifier' },
      { label: '30 - 60 detik (Cukup wajar namun masih ada friksi)', score: 3, hint: 'Bisa dipercepat dengan quick-keys dan QRIS dinamis' },
      { label: '< 20 detik (Sangat cepat dan responsif)', score: 4, hint: 'Ideal: Menggunakan sistem modern berkecepatan tinggi' }
    ],
    recommendation: 'Terapkan GastroStock Ultra-Fast POS dengan teknologi Instant Touch Matrix dan Quick Split. Waktu input terpangkas dari 90 detik menjadi < 15 detik, meningkatkan kapasitas layanan antrean hingga 300%.',
    roiImpact: 'Peningkatan omset jam sibuk sebesar 18-25% karena meja dan kasir dapat melayani lebih banyak pelanggan dalam waktu bersamaan.'
  },
  {
    id: 2,
    pillar: 'pos_cashier',
    pillarName: 'Operasional Kasir & POS',
    pillarIcon: 'WifiOff',
    question: 'Apa yang terjadi pada operasional kasir jika jaringan internet atau Wi-Fi restoran tiba-tiba terputus di tengah jam sibuk?',
    objective: 'Menilai ketahanan bisnis (business continuity) terhadap downtime jaringan dan stabilitas operasional lokal.',
    redFlags: [
      'Kasir lumpuh total (aplikasi POS berbasis cloud murni tanpa offline storage)',
      'Staf beralih ke nota bon kertas manual yang rentan selisih hitung',
      'Tidak bisa mencetak struk atau menyimpan pesanan ke dapur'
    ],
    options: [
      { label: 'Kasir mati total, harus catat manual di kertas bon', score: 1, hint: 'Sangat Berbahaya: Potensi selisih kas dan salah harga sangat besar' },
      { label: 'Bisa catat manual tapi tidak bisa sync ke dapur dan laporan', score: 2, hint: 'Kekacauan komunikasi antara depan dan dapur' },
      { label: 'Ada mode offline sederhana tapi sering error saat reconnect', score: 3, hint: 'Rentan data corrupt atau pesanan ganda' },
      { label: 'Sistem tetap jalan 100% mulus (Zero-Downtime Local Mesh Sync)', score: 4, hint: 'Terbaik: Standar enterprise reliability' }
    ],
    recommendation: 'GastroStock dilengkapi Offline-First Architecture dengan Dexie IndexedDB dan Local Mesh WebSocket. Kasir dan dapur tetap beroperasi 100% normal tanpa internet sama sekali, lalu auto-sync aman begitu internet kembali.',
    roiImpact: 'Mengeliminasi potensi kerugian Rp 3.000.000 - Rp 12.000.000 per insiden downtime internet serta menjaga reputasi restoran.'
  },
  {
    id: 3,
    pillar: 'pos_cashier',
    pillarName: 'Operasional Kasir & POS',
    pillarIcon: 'LayoutGrid',
    question: 'Bagaimana staf Anda mengelola denah meja (table layout), pemindahan tamu (move table), dan penggabungan meja (merge table)?',
    objective: 'Mengetahui fleksibilitas FOH dalam mengakomodasi dinamika walk-in guest dan kapasitas meja.',
    redFlags: [
      'Tidak ada denah visual meja digital, waiter hanya menghafal nomor meja',
      'Pindah meja sering menyebabkan makanan salah diantar ke meja lama',
      'Tidak bisa memantau durasi meja mana yang sudah selesai makan'
    ],
    options: [
      { label: 'Hafalan staf / catatan kertas nomor meja di papan tulis', score: 1, hint: 'Rentan salah antar pesanan ke meja lain' },
      { label: 'Ada nomor meja di sistem POS tapi tanpa visual interaktif', score: 2, hint: 'Proses pindah meja rumit dan butuh intervensi kasir' },
      { label: 'Ada visual layout sederhana namun statis tanpa timer okupansi', score: 3, hint: 'Kurang data untuk optimasi perputaran meja' },
      { label: 'Visual Table Map interaktif realtime dengan drag & drop dan live occupancy timer', score: 4, hint: 'Optimal: Visibilitas 100% FOH' }
    ],
    recommendation: 'Gunakan Visual Table Management GastroStock yang mendukung dynamic color coding (Kosong, Terisi, Menunggu Makanan, Sudah Bayar) serta fitur 1-klik Move Table dan Merge Table.',
    roiImpact: 'Mempercepat perputaran meja (table turn) hingga 15 menit per sesi, memungkinkan tambahan 2-3 siklus tamu per hari di tiap meja.'
  },
  {
    id: 4,
    pillar: 'pos_cashier',
    pillarName: 'Operasional Kasir & POS',
    pillarIcon: 'SplitSquareVertical',
    question: 'Seberapa sering pelanggan meminta Split Bill (pisah bayar per orang/per menu) dan berapa lama waktu yang dihabiskan kasir untuk menghitungnya?',
    objective: 'Mengidentifikasi titik kemacetan kasir akibat permintaan split payment dari rombongan pelanggan.',
    redFlags: [
      'Kasir menggunakan kalkulator manual untuk membagi bon',
      'Split bill membutuhkan waktu > 5 menit sehingga antrean di belakang menggerutu',
      'Sistem POS sering crash saat pesanan 1 meja dipecah jadi 4 struk'
    ],
    options: [
      { label: 'Manual pakai kalkulator / staf sering menolak split bill', score: 1, hint: 'Menurunkan kepuasan tamu dan memperlambat antrean' },
      { label: 'Sistem POS bisa tapi rumit dan sering terjadi selisih nominal', score: 2, hint: 'Berisiko kerugian selisih pembulatan pajak/service' },
      { label: 'Bisa split per menu tetapi tidak bisa split rata nominal (equal split)', score: 3, hint: 'Masih terbatas untuk grup kantor/keluarga' },
      { label: 'Sistem mendukung 1-klik split item, split nominal, dan multi-QRIS terpisah', score: 4, hint: 'Sempurna: Seamless customer payment experience' }
    ],
    recommendation: 'GastroStock menyediakan Smart Split Bill Wizard: Drag-and-drop item ke sub-bill terpisah atau gunakan fitur 1-tap Equal Split dengan kalkulasi pajak dan diskon otomatis tanpa selisih 1 rupiah pun.',
    roiImpact: 'Menghilangkan antrean bottleneck kasir saat jam makan siang kantor, menaikkan kepuasan pelanggan sebesar 94%.'
  },
  {
    id: 5,
    pillar: 'pos_cashier',
    pillarName: 'Operasional Kasir & POS',
    pillarIcon: 'Smartphone',
    question: 'Apakah waiter/pramusaji Anda dapat mencatat pesanan langsung di sisi meja (table-side ordering) menggunakan perangkat mobile/tablet?',
    objective: 'Mengevaluasi mobilitas staf pramusaji dan kecepatan transmisi pesanan dari meja pelanggan langsung ke dapur.',
    redFlags: [
      'Waiter menulis di secarik kertas lalu berjalan bolak-balik ke kasir sentral',
      'Tulisan tangan waiter di kertas sering tidak terbaca oleh juru masak',
      'Waktu tempuh waiter bolak-balik meja-kasir-dapur menyita 40% jam kerja'
    ],
    options: [
      { label: 'Kertas bon tulisan tangan manual bolak-balik kasir', score: 1, hint: 'Sangat tidak efisien dan sering salah input' },
      { label: 'Input di satu terminal kasir statis, waiter antre gantian', score: 2, hint: 'Menimbulkan antrean internal antar waiter' },
      { label: 'Pakai tablet mobile tetapi sering putus koneksi ke kasir', score: 3, hint: 'Aplikasi mobile tidak stabil / sering logout' },
      { label: 'Mobile Waiter Pad dengan instant sync realtime langsung fire order ke KDS', score: 4, hint: 'Standar resto modern bintang lima' }
    ],
    recommendation: 'GastroStock Waiter Mobile Pad memungkinkan waiter mengirim pesanan makanan & minuman secara instan ke display dapur tepat saat tamu selesai menyebutkan menunya.',
    roiImpact: 'Menghemat waktu tunggu tamu rata-rata 12 menit per pesanan dan mengurangi kebutuhan staf FOH hingga 25% tanpa mengurangi keramahan layanan.'
  },
  {
    id: 6,
    pillar: 'pos_cashier',
    pillarName: 'Operasional Kasir & POS',
    pillarIcon: 'Printer',
    question: 'Bagaimana keandalan printer struk kasir dan printer dapur Anda saat pesanan masuk secara beruntun?',
    objective: 'Mendeteksi kerentanan perangkat keras pencetakan dan masalah "orderan hilang/skip".',
    redFlags: [
      'Printer sering kehabisan kertas tanpa ada notifikasi peringatan di layar',
      'Orderan dapur suka hilang atau loncat jika printer lag',
      'Kertas thermal terkena uap dapur berminyak sehingga tulisan pudar'
    ],
    options: [
      { label: 'Sering bermasalah, tiket dapur sering hilang atau dobel print', score: 1, hint: 'Menyebabkan komplain pesanan telat atau bahan terbuang' },
      { label: 'Kadang macet jika jam sibuk atau banyak modifikasi order', score: 2, hint: 'Butuh pengecekan manual berulang kali' },
      { label: 'Cukup stabil dengan printer thermal LAN/USB standard', score: 3, hint: 'Masih bergantung penuh pada konsumsi kertas struk' },
      { label: 'Paperless KDS + Auto-Failover Printer Backup dengan buzzer alarm', score: 4, hint: 'Zero lost orders dan hemat biaya kertas' }
    ],
    recommendation: 'GastroStock mengombinasikan Paperless Kitchen Display System (KDS) dengan Intelligent Print Queue Engine. Jika printer thermal offline, sistem otomatis mengalihkan ke printer cadangan atau KDS cadangan.',
    roiImpact: 'Menghemat pengeluaran kertas thermal hingga Rp 450.000/bulan per outlet dan menghilangkan 100% kasus "pesanan tamu terselip".'
  },
  {
    id: 7,
    pillar: 'pos_cashier',
    pillarName: 'Operasional Kasir & POS',
    pillarIcon: 'Tag',
    question: 'Seberapa fleksibel sistem Anda dalam menerapkan promo bertingkat (Happy Hour, Buy 1 Get 1, Diskon Member, Voucher OVO/GoPay)?',
    objective: 'Mengukur kemudahan tim pemasaran dalam menguji promosi tanpa bergantung pada tim IT atau vendor software.',
    redFlags: [
      'Kasir harus menghitung diskon secara manual dan memasukkan potongan angka bebas',
      'Promo tidak bisa dijadwalkan otomatis berdasarkan hari dan jam (misal 14:00 - 17:00)',
      'Sering terjadi double discount yang tidak terkendali'
    ],
    options: [
      { label: 'Manual hitung diskon / kasir input nominal bebas di POS', score: 1, hint: 'Celah kecurangan manipulasi diskon sangat terbuka' },
      { label: 'Hanya bisa diskon persentase sederhana di level total bill', score: 2, hint: 'Tidak bisa promo spesifik per kategori menu' },
      { label: 'Bisa promo waktu tetapi harus diatur manual setiap mau mulai', score: 3, hint: 'Sering lupa diaktifkan atau dinonaktifkan' },
      { label: 'Dynamic Automated Promo Engine berbasis waktu, member, dan bundle SKU', score: 4, hint: 'Aman, otomatis, dan terkunci dari kecurangan staf' }
    ],
    recommendation: 'GastroStock Promotion Rules Engine memungkinkan manajemen mengatur promo bundle, flash sale jam tertentu, dan cashback member dengan kalkulasi otomatis yang terkunci rapi dari manipulasi.',
    roiImpact: 'Mencegah potensi kerugian salah hitung diskon hingga jutaan rupiah dan menaikkan efektivitas program marketing hingga 35%.'
  },
  {
    id: 8,
    pillar: 'pos_cashier',
    pillarName: 'Operasional Kasir & POS',
    pillarIcon: 'Clock',
    question: 'Berapa lama proses Tutup Kasir / Closing Shift harian (End of Day Z-Report) dan rekonsiliasi uang fisik di laci kas?',
    objective: 'Mengukur beban administrasi kasir pada akhir jam kerja dan akurasi rekonsiliasi finansial.',
    redFlags: [
      'Proses closing kasir memakan waktu > 45 menit setiap malam',
      'Kasir sering pulang larut hanya untuk mencari selisih uang Rp 5.000 - Rp 20.000',
      'Laporan settlement EDC dan QRIS sering tidak klop dengan data POS'
    ],
    options: [
      { label: '> 1 jam setiap malam, sering terjadi selisih yang membingungkan', score: 1, hint: 'Staf kelelahan dan akurasi finansial harian rendah' },
      { label: '30 - 60 menit, butuh hitung manual struk fisik EDC satu per satu', score: 2, hint: 'Beban waktu tinggi dan berisiko salah rekap' },
      { label: '15 - 30 menit dengan laporan cetak Z-Report standard', score: 3, hint: 'Cukup baik namun masih ada langkah manual' },
      { label: '< 10 menit dengan Blind Closing System dan auto-reconciliation', score: 4, hint: 'Cepat, presisi tinggi, dan anti-intimidasi kasir' }
    ],
    recommendation: 'GastroStock menerapkan Blind Cash Float Closing: Kasir hanya memasukkan nominal uang fisik yang dihitung tanpa melihat nominal target di layar, sehingga sistem mendeteksi selisih secara objektif tanpa manipulasi.',
    roiImpact: 'Menghemat 40 menit waktu lembur staf kasir per hari dan memastikan 100% akurasi rekonsiliasi kas bank.'
  },

  // =========================================================================
  // PILAR 2: ALUR KOMUNIKASI DAPUR, KDS & KITCHEN SLA (8 PERTANYAAN)
  // =========================================================================
  {
    id: 9,
    pillar: 'kitchen_kds',
    pillarName: 'Alur Dapur & KDS',
    pillarIcon: 'ChefHat',
    question: 'Bagaimana juru masak (chef/cook) Anda mengetahui pesanan mana yang harus dimasak lebih dahulu sesuai urutan antrean?',
    objective: 'Mengukur disiplin FIFO (First-In First-Out) di dapur dan pencegahan keterlambatan makanan tamu.',
    redFlags: [
      'Kertas struk pesanan ditempel di rel dapur menggunakan jepitan secara acak',
      'Pesanan tamu yang baru datang sering kali tidak sengaja dimasak mendahului tamu lama',
      'Kertas struk terkena cipratan minyak/kuah sehingga tidak terbaca'
    ],
    options: [
      { label: 'Jepitan kertas nota manual di dinding dapur (sering hilang/kusut)', score: 1, hint: 'Sumber utama komplain tamu karena pesanan terlompat' },
      { label: 'Kertas printer dapur tetapi chef sering bingung urutan prioritas', score: 2, hint: 'Tidak ada indikator waktu tunggu yang jelas' },
      { label: 'Ada display TV dapur sederhana tanpa fitur interaktif bump order', score: 3, hint: 'Hanya berfungsi sebagai penampil pasif' },
      { label: 'Smart Kitchen Display System (KDS) dengan Color-Coded SLA Timers (Hijau/Kuning/Merah)', score: 4, hint: 'Standar QSR & Casual Dining kelas dunia' }
    ],
    recommendation: 'Pasang GastroStock Smart KDS: Pesanan otomatis berurut berdasarkan waktu masuk dengan indikator visual dinamis (Hijau <10m, Kuning 10-15m, Merah Berkedip >15m) serta tombol 1-tap Cook & Serve.',
    roiImpact: 'Memangkas waktu tunggu rata-rata makanan keluar sebesar 35% dan menurunkan komplain keterlambatan hingga 90%.'
  },
  {
    id: 10,
    pillar: 'kitchen_kds',
    pillarName: 'Alur Dapur & KDS',
    pillarIcon: 'AlertCircle',
    question: 'Jika ada pesanan kustom khusus (contoh: "Tanpa Bawang", "Alergi Kacang Ekstrem", "Less Spicy"), bagaimana hal itu dipastikan sampai ke juru masak?',
    objective: 'Menilai akurasi penanganan alergi dan kustomisasi menu yang sangat sensitif bagi keselamatan konsumen.',
    redFlags: [
      'Waiter harus teriak ke dapur atau menulis tangan catatan kecil yang rawan terabaikan',
      'Sering terjadi kesalahan masak sehingga makanan harus dibuang dan dimasak ulang',
      'Pernah ada insiden komplain alergi dari konsumen'
    ],
    options: [
      { label: 'Waiter teriak ke dapur atau tulis tangan di nota (sering lolos/salah)', score: 1, hint: 'Bahaya besar: Potensi insiden alergi dan waste makanan' },
      { label: 'Bisa ketik catatan teks bebas di POS tapi teks kecil di printer', score: 2, hint: 'Chef sering melewatkan teks kecil di struk' },
      { label: 'Ada opsi kustom menu dasar (Pedas/Tidak Pedas)', score: 3, hint: 'Belum mengakomodasi allergen alert secara tegas' },
      { label: 'Bold Allergen Warning System di KDS dengan warna kontras dan konfirmasi chef', score: 4, hint: 'Keamanan pelanggan 100% terjamin' }
    ],
    recommendation: 'GastroStock KDS menampilkan Modifier & Allergen Alert dengan kartu highlight mencolok berlatar merah/oranye terang yang mewajibkan konfirmasi juru masak sebelum pesanan diproses.',
    roiImpact: 'Menghilangkan 100% risiko salah masak pesanan kustom, menghemat hingga puluhan juta rupiah dari biaya makanan yang terbuang sia-sia.'
  },
  {
    id: 11,
    pillar: 'kitchen_kds',
    pillarName: 'Alur Dapur & KDS',
    pillarIcon: 'BellRing',
    question: 'Bagaimana pramusaji (waiter/runner) tahu bahwa makanan di dapur sudah matang dan siap diantar ke meja tamu?',
    objective: 'Mengukur efisiensi perpindahan makanan dari pass-bar dapur ke meja tamu (menjaga makanan tetap panas & segar).',
    redFlags: [
      'Chef membunyikan lonceng tangan manual "ting ting" atau berteriak nomor meja',
      'Makanan matang terbengkalai di meja pass dapur hingga dingin karena waiter tidak tahu',
      'Tamu sering menanyakan "makanan saya sudah sampai mana?"'
    ],
    options: [
      { label: 'Chef teriak nomor meja atau bunyikan lonceng manual', score: 1, hint: 'Suasana resto bising dan makanan sering keburu dingin' },
      { label: 'Waiter harus bolak-balik cek ke jendela dapur secara berkala', score: 2, hint: 'Waktu produktif waiter terbuang hanya untuk mengecek' },
      { label: 'Ada lampu buzzer sederhana di area pass-bar', score: 3, hint: 'Hanya efektif jika waiter sedang berdiri di dekat bar' },
      { label: 'Notifikasi instan getar & push notification ke smartwatch / tablet waiter', score: 4, hint: 'Layanan presisi tinggi, makanan sampai ke tamu dalam kondisi panas terbaik' }
    ],
    recommendation: 'Integrasikan GastroStock Kitchen Ready Alert: Saat juru masak menekan tombol "Serve" di KDS, notifikasi instan langsung muncul di perangkat waiter dengan rincian nomor meja dan nama item.',
    roiImpact: 'Waktu tempuh makanan dari kompor ke lidah konsumen turun menjadi < 60 detik, mendongkrak skor review bintang 5 di Google Maps.'
  },
  {
    id: 12,
    pillar: 'kitchen_kds',
    pillarName: 'Alur Dapur & KDS',
    pillarIcon: 'TrendingDown',
    question: 'Berapa persen menu makanan yang dibatalkan (voided) atau dimasak ulang (remake) karena kesalahan komunikasi dapur dalam sebulan?',
    objective: 'Mengukur besaran kerugian material makanan (food cost leakage) akibat miskomunikasi operasional.',
    redFlags: [
      'Restoran tidak pernah menghitung persentase food remake secara sistematis',
      'Bahan baku mahal (steak, seafood, keju premium) sering terbuang sia-sia',
      'Waiter dan dapur sering saling menyalahkan saat ada order yang salah'
    ],
    options: [
      { label: '> 5% dari total porsi makanan (Sangat tinggi, kerugian besar)', score: 1, hint: 'Alarm bahaya: Margin keuntungan restoran tergerus parah' },
      { label: '2% - 5% porsi makanan per bulan', score: 2, hint: 'Masih cukup tinggi, butuh standardisasi digital' },
      { label: '1% - 2% porsi makanan (Relatif wajar namun bisa ditekan)', score: 3, hint: 'Dapat ditekan lebih jauh dengan validasi resep' },
      { label: '< 0.5% (Hampir zero defect berkat sistem digital terintegrasi)', score: 4, hint: 'Efisiensi prima: Margin profit terlindungi' }
    ],
    recommendation: 'GastroStock mendokumentasikan setiap riwayat perubahan pesanan dengan digital audit trail. Jika ada perubahan meja atau void, KDS langsung membunyikan alert "Order Updated/Canceled" seketika.',
    roiImpact: 'Menyelamatkan biaya bahan baku terbuang senilai Rp 4.500.000 - Rp 15.000.000 per bulan per cabang.'
  },
  {
    id: 13,
    pillar: 'kitchen_kds',
    pillarName: 'Alur Dapur & KDS',
    pillarIcon: 'Layers',
    question: 'Apakah dapur Anda terbagi atas beberapa stasiun (misal: Kitchen Grill, Fryer, Salad/Cold Bar, dan Bar Minuman)? Bagaimana pembagian tiketnya?',
    objective: 'Menilai kemampuan routing pesanan secara cerdas ke stasiun masak yang tepat tanpa campur aduk.',
    redFlags: [
      '1 lembar struk panjang dicetak di satu tempat, chef harus membaca dan mengoper ke stasiun lain',
      'Barista minuman sering tidak tahu pesanan kopi karena struk tersangkut di bagian wajan dapur',
      'Makanan utama sudah keluar tetapi minuman tamu baru datang 20 menit kemudian'
    ],
    options: [
      { label: 'Satu printer untuk semua, staf dapur oper-operan kertas nota', score: 1, hint: 'Kekacauan alur kerja dan sering terjadi keterlambatan minuman' },
      { label: 'Printer terpisah tetapi sering salah rute pesanan menu baru', score: 2, hint: 'Konfigurasi IP printer rumit dan rentan offline' },
      { label: 'Ada pembagian printer dapur & bar tapi belum ada sinkronisasi waktu selesai', score: 3, hint: 'Makanan dan minuman tidak tersaji serempak' },
      { label: 'Multi-Station KDS Routing cerdas dengan auto-course synchronization (Appetizer, Main, Dessert)', score: 4, hint: 'Fine dining standard: Pengalaman santap terorkestrasikan sempurna' }
    ],
    recommendation: 'GastroStock Smart Station Router otomatis memisahkan item ke KDS Grill, KDS Bar, dan KDS Pastry secara terpisah, sekaligus menyinkronkan waktu penyajian hidangan pembuka dan hidangan utama.',
    roiImpact: 'Penyajian makanan dan minuman berjalan sinkron dan harmonis, meningkatkan kepuasan santap pelanggan hingga 40%.'
  },
  {
    id: 14,
    pillar: 'kitchen_kds',
    pillarName: 'Alur Dapur & KDS',
    pillarIcon: 'Timer',
    question: 'Apakah Head Chef atau Store Manager Anda memiliki laporan riwayat kecepatan masak (Cook Time SLA) per menu setiap harinya?',
    objective: 'Mengukur ketersediaan data analitik waktu masak untuk optimasi kapasitas dapur dan evaluasi kinerja tim cook.',
    redFlags: [
      'Manajemen sama sekali tidak tahu menu apa yang paling lama dimasak',
      'Tidak ada data objektif untuk mengevaluasi apakah dapur bekerja cepat atau lambat',
      'Hanya mengandalkan tebak-tebakan saat ada komplain dari pemilik restoran'
    ],
    options: [
      { label: 'Tidak ada data sama sekali / tidak pernah diukur', score: 1, hint: 'Blind management: Operasional berjalan tanpa metrik kinerja' },
      { label: 'Hanya diukur manual dengan stopwatch jika sedang ada evaluasi khusus', score: 2, hint: 'Data tidak akurat dan tidak berkelanjutan' },
      { label: 'Hanya ada data waktu cetak struk ke waktu bayar kasir', score: 3, hint: 'Tidak mencerminkan durasi riil memasak di kompor' },
      { label: 'Laporan otomatis realtime Cook Time vs SLA Target per menu di dashboard', score: 4, hint: 'Data-driven kitchen: Manajemen tahu persis titik bottleneck' }
    ],
    recommendation: 'GastroStock KDS Analytics mencatat waktu detik-per-detik mulai pesanan dikonfirmasi hingga di-bump. Laporan menyajikan rata-rata waktu masak per menu, per shift, dan per juru masak.',
    roiImpact: 'Manajemen dapat merekayasa ulang menu (menu engineering) yang lambat atau melatih staf yang membutuhkan bantuan, memotong waktu antrean total.'
  },
  {
    id: 15,
    pillar: 'kitchen_kds',
    pillarName: 'Alur Dapur & KDS',
    pillarIcon: 'Utensils',
    question: 'Bagaimana juru masak mengelola ketersediaan stok bahan harian (86 list / Out of Stock) ketika salah satu bahan baku habis di tengah shift?',
    objective: 'Mendeteksi kelancaran komunikasi "Sold Out" agar kasir tidak menjual menu yang bahannya sudah habis.',
    redFlags: [
      'Chef berteriak "Ayam Habis!" tetapi kasir di depan masih terus menerima pesanan ayam',
      'Waiter harus kembali ke meja tamu untuk meminta maaf dan menyuruh tamu ganti menu',
      'Merusak mood pelanggan yang sudah menunggu lama'
    ],
    options: [
      { label: 'Teriak lisan atau tulis di papan tulis dapur (sering kecolongan dijual)', score: 1, hint: 'Menyebabkan komplain memalukan di depan pelanggan' },
      { label: 'Kasir harus login ke menu admin yang rumit untuk mematikan menu', score: 2, hint: 'Butuh waktu lama dan akses manager yang menghambat' },
      { label: 'Ada fitur sold-out di kasir tapi tidak otomatis update di tablet waiter', score: 3, hint: 'Pramusaji masih menawarkan menu yang habis' },
      { label: 'Fitur 1-Tap "86 Item" dari KDS langsung auto-disable menu di kasir, waiter tablet, dan QR order realtime', score: 4, hint: 'Kecepatan sinkronisasi < 1 detik di seluruh perangkat' }
    ],
    recommendation: 'Dengan fitur GastroStock Instant 86, Chef cukup menekan 1 tombol di KDS dan menu tersebut seketika berstatus "Habis" di semua tablet waiter dan kasir, mencegah pesanan yang tidak bisa dimasak.',
    roiImpact: 'Menghilangkan 100% insiden pembatalan pesanan di meja tamu dan menjaga wibawa restoran.'
  },
  {
    id: 16,
    pillar: 'kitchen_kds',
    pillarName: 'Alur Dapur & KDS',
    pillarIcon: 'ShieldAlert',
    question: 'Bagaimana dapur Anda menerapkan standar kebersihan dan keamanan pangan (HACCP) seperti pencatatan suhu chiller/freezer dan pembuangan minyak?',
    objective: 'Menilai kepatuhan restoran terhadap regulasi keamanan pangan dan pencegahan kontaminasi bahan mentah.',
    redFlags: [
      'Pencatatan suhu freezer hanya formalitas di kertas formulir yang sering dipalsukan saat audit',
      'Pernah terjadi insiden bahan baku basi di freezer karena mati listrik tidak terdeteksi',
      'Minyak goreng digunakan berulang kali tanpa indikator TPM yang terukur'
    ],
    options: [
      { label: 'Tidak ada pencatatan rutin / hanya jika ada pemeriksaan', score: 1, hint: 'Risiko keracunan makanan dan penutupan paksa oleh dinas kesehatan' },
      { label: 'Pencatatan manual di kertas binder harian (rawan tidak diisi)', score: 2, hint: 'Data tidak bisa dianalisis trennya secara digital' },
      { label: 'Ada checklist digital mandiri tanpa integrasi alarm suhu', score: 3, hint: 'Belum ada peringatan dini jika suhu kulkas naik drastis' },
      { label: 'HACCP Digital Logs dengan IoT temperature monitoring & alert otomatis ke HP Manager', score: 4, hint: 'Standar keamanan pangan internasional' }
    ],
    recommendation: 'GastroStock menyediakan modul HACCP Digital Logs: Staf dapur mengisi checklist sanitasi harian dan sistem memberikan peringatan jika suhu penyimpanan melampaui batas aman (Critical Control Point).',
    roiImpact: 'Mencegah kerusakan bahan baku beku senilai puluhan juta rupiah dan melindungi restoran dari gugatan hukum higienitas.'
  },

  // =========================================================================
  // PILAR 3: MANAJEMEN STOK BAHAN BAKU, HPP / COGS & FOOD WASTE (10 PERTANYAAN)
  // =========================================================================
  {
    id: 17,
    pillar: 'inventory_cogs',
    pillarName: 'Manajemen Stok & COGS',
    pillarIcon: 'Package',
    question: 'Apakah sistem Anda saat ini otomatis memotong stok bahan baku mentah (misal: gramasi daging, minyak, bumbu saus) setiap kali kasir menjual 1 porsi makanan?',
    objective: 'Menilai apakah restoran memiliki Recipe Management & Automated Stock Deduction (Bill of Materials).',
    redFlags: [
      'Sistem hanya memotong kuantitas makanan jadi (contoh: "1 Nasi Goreng terjual"), bukan bahan mentahnya',
      'Owner tidak tahu berapa kilogram beras dan telur yang seharusnya tersisa di gudang',
      'Penghitungan HPP hanya berdasarkan perkiraan kasar (guesstimate)'
    ],
    options: [
      { label: 'Hanya potong stok produk jadi, bahan mentah tidak tercatat', score: 1, hint: 'Celah pencurian dan pemborosan bahan baku sangat besar' },
      { label: 'Ada resep di Excel terpisah, dikurangi manual di akhir bulan', score: 2, hint: 'Sangat lambat, butuh waktu berminggu-minggu untuk tahu margin' },
      { label: 'Sistem memotong stok bahan baku utama tapi bumbu pelengkap diabaikan', score: 3, hint: 'HPP tetap ada deviasi 5-8%' },
      { label: 'Multi-Level BOM (Bill of Materials) otomatis potong gramasi bahan realtime tiap transaksi', score: 4, hint: 'Presisi tingkat gram: Akurasi HPP hingga 99.8%' }
    ],
    recommendation: 'GastroStock Recipe Matrix Engine otomatis mendekomposisi setiap menu yang terjual menjadi pengurangan gramasi bahan baku riil di database gudang secara realtime.',
    roiImpact: 'Mengetahui HPP harian secara pasti, menghemat kebocoran bahan baku rata-rata 3% - 6% dari omset kotor.'
  },
  {
    id: 18,
    pillar: 'inventory_cogs',
    pillarName: 'Manajemen Stok & COGS',
    pillarIcon: 'RotateCcw',
    question: 'Berapa persen perbedaan (variance) antara stok fisik bahan baku di gudang/chiller dengan stok di sistem saat dilakukan Stock Opname?',
    objective: 'Mengukur tingkat akurasi inventaris, kebocoran fisik, atau pencurian internal bahan mentah.',
    redFlags: [
      'Selisih stok fisik vs sistem di atas 5%',
      'Stock opname hanya dilakukan sebulan sekali karena prosesnya menyiksa dan ribet',
      'Staf gudang sering beralasan "timbangan salah" atau "menguap saat dimasak"'
    ],
    options: [
      { label: 'Selisih > 7% dan sering tidak terlacak ke mana larinya bahan', score: 1, hint: 'Kerugian sangat parah: Mengikis 30-50% laba bersih usaha' },
      { label: 'Selisih 3% - 7%, dicatat sebagai biaya kehilangan umum', score: 2, hint: 'Toleransi pemborosan yang terlalu tinggi' },
      { label: 'Selisih 1% - 3%, dilakukan opname rutin mingguan', score: 3, hint: 'Sudah cukup terkontrol namun masih bisa dioptimalkan' },
      { label: 'Selisih < 0.5% dengan Barcode Mobile Stock Opname harian', score: 4, hint: 'Kontrol ketat dan akuntabel hingga tingkat satuan kecil' }
    ],
    recommendation: 'Gunakan GastroStock Barcode Mobile Audit: Staf gudang melakukan blind stock opname harian untuk kategori bahan bernilai tinggi (High-Value SKU) dalam hitungan menit menggunakan kamera smartphone.',
    roiImpact: 'Menurunkan angka kehilangan bahan baku hingga 85%, langsung menyelamatkan jutaan rupiah laba bersih per bulan.'
  },
  {
    id: 19,
    pillar: 'inventory_cogs',
    pillarName: 'Manajemen Stok & COGS',
    pillarIcon: 'Calendar',
    question: 'Bagaimana metode perputaran bahan baku yang diterapkan di gudang Anda? Apakah sudah menerapkan FEFO (First-Expired, First-Out)?',
    objective: 'Mendeteksi kerugian akibat bahan baku kedaluwarsa atau busuk karena tertimbun di rak belakang.',
    redFlags: [
      'Bahan baku baru ditaruh di depan, bahan lama tertimbun di pojok kulkas sampai berjamur',
      'Tidak ada label batch expired date pada daging beku atau saus racikan',
      'Restoran sering membuang bahan baku susu/cream/keju karena basi'
    ],
    options: [
      { label: 'Bahan ditaruh sembarangan tanpa label tanggal kedaluwarsa', score: 1, hint: 'Pemborosan biaya basi dan risiko makanan keracunan' },
      { label: 'Ada label spidol manual tapi staf sering lalai mengambil yang lama', score: 2, hint: 'Tergantung kedisiplinan individu tanpa sistem audit' },
      { label: 'Menerapkan FIFO sederhana (First In First Out) tanpa tracking batch expired', score: 3, hint: 'Bahan yang tanggal expired-nya lebih cepat bisa terlewat' },
      { label: 'FEFO Batch Tracking dengan label barcode digital & notifikasi H-3 sebelum expired', score: 4, hint: 'Standar industri kuliner modern: Zero expired waste' }
    ],
    recommendation: 'GastroStock Batch & Expiry Tracker otomatis memberikan alert visual jika ada batch bahan baku yang mendekati H-7 dan H-3 kedaluwarsa, serta memprioritaskan batch tersebut dalam resep menu harian.',
    roiImpact: 'Menekan kerugian akibat bahan kedaluwarsa (spoilage/waste) hingga 92%, menjaga kesegaran bahan baku optimal.'
  },
  {
    id: 20,
    pillar: 'inventory_cogs',
    pillarName: 'Manajemen Stok & COGS',
    pillarIcon: 'AlertTriangle',
    question: 'Kapan restoran Anda biasanya mengetahui bahwa bahan baku penting (seperti beras, saus signature, atau daging) sudah hampir habis?',
    objective: 'Menilai kemampuan sistem dalam memprediksi kebutuhan stok (Safety Stock & Par Level Alerts).',
    redFlags: [
      'Baru tahu saat juru masak mau memasak lalu panik karena bahan kosong',
      'Staf harus lari mendadak membeli eceran di supermarket terdekat dengan harga jauh lebih mahal',
      'Sering menolak pesanan menu andalan karena bahan habis di jam 8 malam'
    ],
    options: [
      { label: 'Baru tahu saat chef mau masak (sering panik beli eceran mahal)', score: 1, hint: 'Mengorbankan margin karena beli eceran dan mengecewakan tamu' },
      { label: 'Dicek manual secara visual oleh staf setiap pagi sebelum buka', score: 2, hint: 'Jika ramai tak terduga, bahan tetap bisa jebol di tengah hari' },
      { label: 'Ada alert stok minimum statis di komputer kasir', score: 3, hint: 'Hanya bisa dilihat jika staf rajin mengecek modul inventaris' },
      { label: 'Smart Par Level Alert otomatis kirim draft Purchase Order (PO) ke WhatsApp Manager/Supplier saat stok capai batas aman', score: 4, hint: 'Proaktif dan otomatis: Tidak pernah kehabisan bahan' }
    ],
    recommendation: 'GastroStock Smart Reorder Engine otomatis menghitung laju konsumsi harian dan mengirim peringatan stok kritis sebelum kehabisan, lengkap dengan rekomendasi kuantitas pemesanan (EOQ).',
    roiImpact: 'Menghilangkan biaya darurat pembelian eceran (hemat 15-20% harga bahan) dan menjamin menu selalu tersedia untuk tamu.'
  },
  {
    id: 21,
    pillar: 'inventory_cogs',
    pillarName: 'Manajemen Stok & COGS',
    pillarIcon: 'FileCheck',
    question: 'Bagaimana proses penerimaan barang (Goods Receiving) dari supplier saat kurir tiba di restoran?',
    objective: 'Mendeteksi kebocoran pada pintu masuk bahan baku (kuantitas kurang, timbangan dimanipulasi, atau kualitas reject).',
    redFlags: [
      'Surat jalan hanya ditandatangani staf tanpa ditimbang ulang dengan timbangan digital terkalibrasi',
      'Staf menerima bahan basah/sayur yang layu tanpa form retur barang',
      'Harga di invoice tagihan supplier sering kali berbeda dengan harga kesepakatan PO'
    ],
    options: [
      { label: 'Hanya paraf surat jalan tanpa ditimbang ulang', score: 1, hint: 'Rentan supplier nakal mengirim barang dengan berat kurang' },
      { label: 'Ditimbang manual di buku tulis, baru diinput ke komputer malam harinya', score: 2, hint: 'Proses lambat dan sering terjadi salah ketik angka timbangan' },
      { label: 'Diinput ke sistem POS tetapi tanpa fitur pencatatan foto bukti reject', score: 3, hint: 'Sulit klaim pengembalian dana ke supplier' },
      { label: '3-Way Matching Digital (PO vs Surat Jalan vs Tagihan) dengan upload foto timbangan dan auto-generate Form Retur', score: 4, hint: 'Audit ketat tingkat enterprise: Pembayaran 100% presisi' }
    ],
    recommendation: 'GastroStock Goods Receiving Module menerapkan 3-Way Matching: Sistem mencocokkan harga PO dengan tagihan faktur dan memblokir pembayaran jika ada selisih harga atau gramasi yang tidak disetujui manager.',
    roiImpact: 'Mencegah kelebihan bayar faktur supplier dan kecurangan timbangan hingga 4-7% dari total anggaran belanja bulanan.'
  },
  {
    id: 22,
    pillar: 'inventory_cogs',
    pillarName: 'Manajemen Stok & COGS',
    pillarIcon: 'Flame',
    question: 'Apakah restoran Anda mencatat "Yield & Shrinkage" (penyusutan bahan mentah saat proses trimming, thawing, dan memasak)?',
    objective: 'Mengukur akurasi perhitungan HPP sejati pada bahan baku hewani (daging sapi, ayam, ikan segar).',
    redFlags: [
      'Menghitung harga daging sapi 1 kg matang sama persis dengan harga 1 kg daging mentah beku',
      'Tidak memperhitungkan lemak yang dibuang (fat trim) dan air es (water loss)',
      'HPP aktual di lapangan jauh lebih tinggi daripada HPP di atas kertas kalkulasi'
    ],
    options: [
      { label: 'Tidak pernah hitung, dianggap 100% jadi makanan', score: 1, hint: 'Kesesatan perhitungan HPP yang membuat margin tampak semu' },
      { label: 'Tahu ada penyusutan tetapi hanya ditaksir persentase kasarnya', score: 2, hint: 'Variasi kualitas potongan daging membuat margin tidak stabil' },
      { label: 'Dihitung di Excel terpisah setiap kali ada perubahan supplier', score: 3, hint: 'Kalkulasi statis tidak terhubung dengan harga menu POS' },
      { label: 'Meat & Seafood Yield Calculator terintegrasi otomatis ke HPP dinamis per gram', score: 4, hint: 'Akurasi tingkat chef profesional internasional' }
    ],
    recommendation: 'GastroStock Meat Yield Module menghitung persentase susut bersih (Usable Yield %) setelah proses pembersihan lemak, menghasilkan angka HPP riil yang presisi untuk penetapan harga jual.',
    roiImpact: 'Memperbaiki penetapan harga jual (pricing strategy) sehingga margin laba bersih restoran tidak bocor tanpa disadari.'
  },
  {
    id: 23,
    pillar: 'inventory_cogs',
    pillarName: 'Manajemen Stok & COGS',
    pillarIcon: 'Trash2',
    question: 'Bagaimana restoran Anda mencatat sisa makanan terbuang (Food Waste / Scrap Log) dan apakah staf harus memberikan alasan pembuangan?',
    objective: 'Menilai kepedulian dan kontrol manajemen terhadap pemborosan bahan baku di dapur.',
    redFlags: [
      'Makanan basi atau gosong langsung dilempar ke tong sampah tanpa pencatatan sama sekali',
      'Owner tidak punya data berapa rupiah nilai bahan yang terbuang ke tempat sampah setiap bulan',
      'Staf tidak merasa bersalah saat membuang bahan makanan'
    ],
    options: [
      { label: 'Langsung buang ke tempat sampah tanpa dicatat', score: 1, hint: 'Uang dibuang ke tong sampah tanpa ada yang tahu jumlahnya' },
      { label: 'Dicatat seadanya di papan tulis jika jumlahnya besar', score: 2, hint: 'Hanya mencatat insiden fatal, kehilangan kecil terabaikan' },
      { label: 'Ada buku catatan limbah makanan fisik di dapur', score: 3, hint: 'Jarang direkap menjadi laporan finansial bulanan' },
      { label: 'Digital Waste Log dengan klasifikasi alasan (Gosong, Basi, Salah Buat, Uji Coba) & Approval Supervisor', score: 4, hint: 'Transparansi total: Menekan pemborosan hingga ke akar masalah' }
    ],
    recommendation: 'GastroStock Digital Waste Tracking mewajibkan staf mencatat berat dan alasan pembuangan bahan baku. Sistem langsung mengonversi kilogram limbah menjadi kerugian rupiah riil di dashboard owner.',
    roiImpact: 'Meningkatkan kesadaran staf dapur dan memangkas volume pembuangan makanan hingga 30-45% dalam 60 hari.'
  },
  {
    id: 24,
    pillar: 'inventory_cogs',
    pillarName: 'Manajemen Stok & COGS',
    pillarIcon: 'TrendingUp',
    question: 'Jika harga salah satu bahan baku utama naik di pasaran (misal cabai atau minyak naik 30%), seberapa cepat Anda mengetahui dampaknya terhadap profit margin per menu?',
    objective: 'Menguji ketajaman analitik finansial dan responsivitas bisnis terhadap inflasi harga pangan.',
    redFlags: [
      'Baru sadar 2 bulan kemudian saat laporan rugi-laba akuntan keluar dan profit anjlok',
      'Harus menghitung ulang manual puluhan resep satu per satu dengan rumus Excel rumit',
      'Tidak tahu menu mana yang paling terkena dampak kenaikan harga'
    ],
    options: [
      { label: 'Baru tahu berbulan-bulan kemudian saat omset naik tapi laba tipis', score: 1, hint: 'Sangat berbahaya: Menjual menu dengan margin minus' },
      { label: 'Butuh waktu berhari-hari hitung manual di spreadsheet Excel', score: 2, hint: 'Lambat merespons fluktuasi pasar' },
      { label: 'Bisa hitung simulasi sederhana di beberapa menu bestseller', score: 3, hint: 'Menu pendukung lainnya luput dari penyesuaian' },
      { label: 'Realtime Dynamic Margin Simulator: 1 input kenaikan harga bahan langsung simulasi dampak ke seluruh menu', score: 4, hint: 'Agile & cerdas: Responsif melindungi profitabilitas usaha' }
    ],
    recommendation: 'GastroStock Dynamic COGS Simulator memungkinkan owner memasukkan kenaikan harga cabai/daging, dan sistem seketika menampilkan menu mana yang marginnya turun di bawah target serta rekomendasi penyesuaian harga jual.',
    roiImpact: 'Mempertahankan target margin laba kotor restoran di angka sehat 65-70% meskipun terjadi inflasi bahan baku.'
  },
  {
    id: 25,
    pillar: 'inventory_cogs',
    pillarName: 'Manajemen Stok & COGS',
    pillarIcon: 'Truck',
    question: 'Berapa banyak supplier aktif yang memasok restoran Anda dan bagaimana performa ketepatan waktu serta stabilitas harga mereka dimonitor?',
    objective: 'Menilai manajemen rantai pasok (vendor performance management) untuk negosiasi harga terbaik.',
    redFlags: [
      'Data kontak supplier tersebar di buku kontak ponsel masing-masing staf',
      'Tidak ada riwayat perbandingan harga antar supplier dari waktu ke waktu',
      'Supplier sering telat mengirim barang di hari Sabtu/Minggu yang membuat operasional kalang kabut'
    ],
    options: [
      { label: 'Kontak di HP pribadi staf, tidak ada data performa supplier', score: 1, hint: 'Rentan ketergantungan staf dan permainan komisi terselubung' },
      { label: 'Ada daftar supplier di kertas/folder tapi tidak ada evaluasi ketepatan', score: 2, hint: 'Sulit menuntut komitmen SLA pengiriman dari vendor' },
      { label: 'Ada riwayat nota belanja bulanan untuk perbandingan harga manual', score: 3, hint: 'Membutuhkan waktu untuk merekap data historis' },
      { label: 'Vendor Performance Scorecard (Ketepatan Waktu, Kualitas, Stabilitas Harga) otomatis di sistem', score: 4, hint: 'Posisi tawar kuat dalam negosiasi harga dan payment term' }
    ],
    recommendation: 'GastroStock Supplier Portal merangkum riwayat pengiriman, rasio barang reject, dan fluktuasi harga tiap supplier, memberi Anda data konkret untuk menawar harga termurah dan tempo bayar (TOP) lebih panjang.',
    roiImpact: 'Mendapatkan penghematan belanja bahan baku 5-10% melalui negosiasi berbasis data performa historis.'
  },
  {
    id: 26,
    pillar: 'inventory_cogs',
    pillarName: 'Manajemen Stok & COGS',
    pillarIcon: 'ShieldCheck',
    question: 'Apakah ada otorisasi khusus atau batas maksimal saat staf dapur mengajukan permintaan bahan baku tambahan (Kitchen Requisition) di luar takaran standar?',
    objective: 'Mendeteksi kebocoran bahan mentah internal dari gudang ke dapur yang sering dijadikan celah pencurian.',
    redFlags: [
      'Staf dapur bebas keluar masuk gudang mengambil bahan kapan saja tanpa tanda terima',
      'Kunci gudang dipegang banyak orang tanpa catatan log pembukaan',
      'Staf sering berdalih bahan tumpah untuk menutupi bahan yang dibawa pulang'
    ],
    options: [
      { label: 'Bebas ambil sendiri di gudang tanpa form permintaan', score: 1, hint: 'Pintu gerbang pencurian terbuka lebar tanpa pengawasan' },
      { label: 'Ada buku bon fisik manual tetapi jarang diverifikasi manager', score: 2, hint: 'Formalitas tanpa fungsi kontrol yang sesungguhnya' },
      { label: 'Harus minta ke staf gudang tetapi tanpa batas kuota maksimal per hari', score: 3, hint: 'Dapur bisa boros melebihi target porsi penjualan' },
      { label: 'Digital Internal Transfer dengan batas kuota otomatis sesuai jumlah bill penjualan aktif + PIN Manager', score: 4, hint: 'Anti-Fraud System: Bahan baku keluar hanya jika ada tiket pesanan valid' }
    ],
    recommendation: 'GastroStock Internal Transfer Workflow membatasi pengeluaran bahan dari Gudang Utama ke Dapur hanya sesuai kuota produksi menu hari itu, mewajibkan PIN verifikasi jika meminta bahan tambahan.',
    roiImpact: 'Menghilangkan potensi pencurian bahan mentah internal yang umumnya merugikan 5-8% dari total aset bahan baku.'
  },

  // =========================================================================
  // PILAR 4: KEAMANAN FINANSIAL, AUDIT VOID & PENCEGAHAN FRAUD (8 PERTANYAAN)
  // =========================================================================
  {
    id: 27,
    pillar: 'finance_fraud',
    pillarName: 'Keamanan Finansial & Fraud',
    pillarIcon: 'ShieldAlert',
    question: 'Bagaimana prosedur pembatalan transaksi (Void) atau penghapusan item pesanan setelah tamu membayar atau setelah makanan dimasak?',
    objective: 'Mengidentifikasi celah kecurangan kasir paling umum di industri F&B (modus void transaksi tunai).',
    redFlags: [
      'Kasir memiliki wewenang penuh untuk membatalkan pesanan tanpa izin supervisor',
      'Modus umum: Tamu bayar tunai -> Kasir cetak struk -> Kasir void transaksi -> Uang tunai dikantongi kasir',
      'Restoran tidak memiliki laporan rekapitulasi void mingguan'
    ],
    options: [
      { label: 'Kasir bisa langsung void sendiri tanpa perlu izin siapa pun', score: 1, hint: 'Kritis: Risiko pencurian uang tunai kasir hampir 100% terjadi' },
      { label: 'Perlu panggil supervisor tapi PIN supervisor sering dibagikan ke kasir', score: 2, hint: 'PIN bocor sehingga otorisasi menjadi tidak berguna' },
      { label: 'Perlu PIN supervisor dan ada alasan void tapi tidak ada bukti foto', score: 3, hint: 'Cukup aman namun masih bisa disalahgunakan jika ada kongkalikong' },
      { label: 'Two-Factor Manager Authorization + Wajib Catat Alasan + Notifikasi Instan ke HP Owner jika Void > Rp 100.000', score: 4, hint: 'Benteng pertahanan anti-fraud tingkat perbankan' }
    ],
    recommendation: 'GastroStock menghadirkan Strict Supervisor Void Control: Setiap tindakan void item atau bill wajib menggunakan otorisasi PIN terenkripsi dan otomatis mengirimkan push notification seketika ke ponsel Owner.',
    roiImpact: 'Menutup celah kebocoran kas tunai kasir yang rata-rata merugikan restoran Rp 3.000.000 - Rp 10.000.000 per bulan per kasir.'
  },
  {
    id: 28,
    pillar: 'finance_fraud',
    pillarName: 'Keamanan Finansial & Fraud',
    pillarIcon: 'Lock',
    question: 'Apakah laci kasir (Cash Drawer) Anda hanya terbuka otomatis saat transaksi selesai, atau kasir bisa membukanya kapan saja dengan kunci fisik/tombol manual?',
    objective: 'Mendeteksi potensi transaksi tunai "gelap" yang tidak diinput ke dalam sistem.',
    redFlags: [
      'Laci kasir dibiarkan terbuka terus-menerus sepanjang hari',
      'Kasir memiliki kunci fisik dan sering membuka laci tanpa ada transaksi tercatat di layar',
      'Sering ada transaksi tunai tanpa struk resmi yang diberikan kepada pelanggan'
    ],
    options: [
      { label: 'Laci terbuka terus / kunci fisik menempel bebas di laci', score: 1, hint: 'Memudahkan kasir menyimpan dan mengambil uang tanpa jejak' },
      { label: 'Laci otomatis tapi staf tahu cara membukanya secara manual dari bawah', score: 2, hint: 'Sistem bypass mekanik yang tidak terpantau' },
      { label: 'Hanya terbuka saat transaksi bayar tunai tercetak struknya', score: 3, hint: 'Standar pengamanan dasar yang cukup baik' },
      { label: 'Smart Cash Drawer Event Logger: Mencatat stempel waktu setiap laci terbuka dan membunyikan alarm jika terbuka > 30 detik', score: 4, hint: 'Pengawasan presisi tanpa celah manipulasi' }
    ],
    recommendation: 'GastroStock Smart Cash Drawer Logic mengunci laci kasir secara elektronik dan mencatat event "Manual Drawer Open" ke dalam security audit log yang bisa diperiksa owner setiap saat.',
    roiImpact: 'Mencegah transaksi "bawah meja" dan memastikan 100% uang pembayaran pelanggan masuk ke rekening bisnis.'
  },
  {
    id: 29,
    pillar: 'finance_fraud',
    pillarName: 'Keamanan Finansial & Fraud',
    pillarIcon: 'QrCode',
    question: 'Bagaimana kasir Anda memverifikasi pembayaran QRIS? Apakah kasir mengecek bukti di HP pelanggan atau sistem Anda terintegrasi QRIS Dinamis langsung?',
    objective: 'Mencegah modus penipuan "Screenshot Bukti Bayar QRIS Palsu" yang marak menimpa kasir restoran.',
    redFlags: [
      'Restoran hanya memakai 1 stiker QRIS statis di meja kasir',
      'Kasir hanya melihat sekilas layar HP pembeli tanpa mengecek mutasi masuk di rekening',
      'Pernah tertipu pelanggan yang menunjukkan tangkapan layar (screenshot) transfer editan'
    ],
    options: [
      { label: 'Stiker QRIS statis di meja, kasir cuma intip HP pelanggan', score: 1, hint: 'Sangat rawan penipuan screenshot palsu dan salah nominal bayar' },
      { label: 'Kasir harus buka aplikasi m-banking di HP kasir untuk cek uang masuk', score: 2, hint: 'Sangat lambat, antrean macet saat jam ramai' },
      { label: 'QRIS dinamis dari mesin EDC bank tetapi tidak terhubung ke POS', score: 3, hint: 'Kasir harus input nominal 2 kali di mesin EDC' },
      { label: 'Integrated Dynamic QRIS di Layar Pelanggan: Terverifikasi otomatis 1-detik via webhook tanpa input nominal manual', score: 4, hint: '100% Kebal penipuan screenshot, instan dan higienis' }
    ],
    recommendation: 'GastroStock terintegrasi dengan Payment Gateway QRIS Dinamis resmi: Kode QR unik dengan nominal presisi langsung muncul di layar customer, transaksi otomatis lunas dalam 1 detik via webhook resmi.',
    roiImpact: 'Menghilangkan 100% potensi kerugian bayar QRIS palsu dan memangkas waktu verifikasi pembayaran dari 45 detik menjadi 2 detik.'
  },
  {
    id: 30,
    pillar: 'finance_fraud',
    pillarName: 'Keamanan Finansial & Fraud',
    pillarIcon: 'DollarSign',
    question: 'Bagaimana pengelolaan dana Kas Kecil (Petty Cash) harian untuk belanja operasional mendadak (misal: beli es batu, gas elpiji, parkir, galon air)?',
    objective: 'Menilai transparansi pengeluaran kas kecil yang sering menjadi area abu-abu pembengkakan biaya.',
    redFlags: [
      'Staf mengambil uang tunai dari laci kasir penjualan tanpa bukti struk belanja',
      'Bon belanja pasar ditulis tangan sendiri oleh staf dengan harga yang digelembungkan (mark-up)',
      'Tidak ada batasan plafon kas kecil harian'
    ],
    options: [
      { label: 'Ambil langsung dari laci kasir penjualan tanpa form resmi', score: 1, hint: 'Mencampuradukkan omset kotor dengan kas operasional' },
      { label: 'Ada amplop kas kecil terpisah tapi pencatatan manual di buku nota', score: 2, hint: 'Sering terjadi nota hilang atau nota fiktif' },
      { label: 'Ada modul pengeluaran kas di sistem POS tetapi tanpa wajib lampirkan foto struk', score: 3, hint: 'Sulit diverifikasi kebenaran fisik belanjanya' },
      { label: 'Petty Cash Management dengan Imprest System, Approval Limit, dan Wajib Upload Foto Struk/Nota via Kamera', score: 4, hint: 'Transparan, akuntabel, dan rapi sesuai kaidah akuntansi modern' }
    ],
    recommendation: 'GastroStock Petty Cash Vault memisahkan uang laci penjualan dari dana operasional, mewajibkan staf memfoto nota fisik menggunakan kamera sistem sebelum saldo kas kecil bisa dicairkan.',
    roiImpact: 'Menekan pengeluaran operasional liar hingga 20-30% dan memudahkan rekonsiliasi akuntansi akhir bulan.'
  },
  {
    id: 31,
    pillar: 'finance_fraud',
    pillarName: 'Keamanan Finansial & Fraud',
    pillarIcon: 'UserX',
    question: 'Apakah setiap staf kasir, waiter, dan manager memiliki akun login pribadi dengan PIN unik, atau menggunakan 1 akun bersama untuk semua orang?',
    objective: 'Mengukur akuntabilitas tindakan staf (audit log) jika terjadi insiden selisih kas atau manipulasi data.',
    redFlags: [
      'Semua staf menggunakan akun "ADMIN" atau "KASIR" dengan password yang sama',
      'Jika terjadi uang hilang Rp 500.000 di laci, tidak ada yang bisa dimintai pertanggungjawaban',
      'Mantan karyawan yang sudah resign masih tahu password sistem'
    ],
    options: [
      { label: 'Satu akun bersama untuk semua karyawan tanpa PIN pribadi', score: 1, hint: 'Nol akuntabilitas: Siapa pun bisa saling lempar tanggung jawab' },
      { label: 'Akun kasir terpisah tapi saling pinjam akun saat shift berlangsung', score: 2, hint: 'Audit trail menjadi kabur dan tidak valid' },
      { label: 'Akun individu dengan PIN 4-digit tetapi hak akses role belum terperinci', score: 3, hint: 'Staf kasir masih bisa mengintip laporan omset owner' },
      { label: 'Role-Based Access Control (RBAC) ketat dengan PIN individual, auto-logout saat idle, dan audit log stempel waktu', score: 4, hint: 'Standar kepatuhan keamanan data ISO/IEC & perbankan' }
    ],
    recommendation: 'GastroStock menerapkan Granular RBAC dengan 6 level hak akses (Kasir, Waiter, Kitchen, Store Manager, Owner, Gudang). Setiap penekanan tombol tercatat lengkap dengan identitas staf dan detiknya.',
    roiImpact: 'Menghilangkan perselisihan internal antar staf dan memberikan kendali otoritas penuh di tangan manajemen pemilik.'
  },
  {
    id: 32,
    pillar: 'finance_fraud',
    pillarName: 'Keamanan Finansial & Fraud',
    pillarIcon: 'Percent',
    question: 'Siapa yang berwenang memberikan diskon atau Compliment makanan (makanan gratis untuk relasi/influencer) di restoran Anda?',
    objective: 'Mendeteksi kebocoran diskon fiktif atau compliment liar yang tidak memberikan timbal balik promosi bagi resto.',
    redFlags: [
      'Kasir atau waiter bisa memberikan diskon seenaknya kepada teman atau keluarga tanpa izin',
      'Banyak item compliment keluar dapur tanpa persetujuan tertulis dari Owner/General Manager',
      'Tidak ada kuota maksimal diskon per bulan'
    ],
    options: [
      { label: 'Staf bebas berikan diskon atau free menu tanpa persetujuan', score: 1, hint: 'Celah manipulasi keuangan dan pembagian makanan gratis liar' },
      { label: 'Cukup izin lisan ke manager yang bertugas saat itu', score: 2, hint: 'Tidak terdokumentasi tujuan marketing-nya' },
      { label: 'Perlu PIN manager dan ada pilihan kategori diskon di POS', score: 3, hint: 'Cukup terkontrol namun belum ada batasan anggaran bulanan' },
      { label: 'Compliment Workflow dengan kuota bulanan, wajib isi nama penerima (influencer/VIP), dan push notif ke Owner', score: 4, hint: 'Terukur, akuntabel, dan berdampak nyata bagi promosi restoran' }
    ],
    recommendation: 'GastroStock Compliment & Discount Governance memastikan setiap diskon atau menu gratis terikat pada nama PIC, alasan bisnis, dan batas plafon bulanan yang disetujui owner.',
    roiImpact: 'Menghemat biaya diskon liar hingga jutaan rupiah per bulan dan memastikan setiap compliment menu menghasilkan ulasan promosi yang terukur.'
  },
  {
    id: 33,
    pillar: 'finance_fraud',
    pillarName: 'Keamanan Finansial & Fraud',
    pillarIcon: 'FileSpreadsheet',
    question: 'Berapa hari setelah akhir bulan laporan Laba-Rugi (P&L) komprehensif restoran Anda selesai disusun dan diserahkan kepada Owner?',
    objective: 'Mengukur kecepatan visibilitas finansial untuk pengambilan keputusan strategis bisnis.',
    redFlags: [
      'Laporan keuangan baru selesai tanggal 20 atau 25 bulan berikutnya',
      'Owner sering "buta arah" terhadap kondisi kas riil di pertengahan bulan berjalan',
      'Laporan akuntansi sering tidak sinkron dengan total omset riil di kasir'
    ],
    options: [
      { label: '> 20 hari setelah tutup bulan / sering tidak pernah buat laporan rapi', score: 1, hint: 'Sangat lambat: Tidak bisa mengambil keputusan penyelamatan tepat waktu' },
      { label: '10 - 20 hari setelah tutup bulan menggunakan jasa akuntan eksternal', score: 2, hint: 'Data historis yang sudah basi saat dianalisis' },
      { label: '3 - 7 hari setelah tutup bulan dengan bantuan spreadsheet rapi', score: 3, hint: 'Cukup lumrah untuk skala bisnis restoran mandiri' },
      { label: 'Realtime Live P&L: Owner bisa melihat estimasi Gross Profit & Net Margin detik ini juga di smartphone', score: 4, hint: 'Kecanggihan eksekutif: Visibilitas finansial instan 24/7' }
    ],
    recommendation: 'GastroStock Executive BI Dashboard menyajikan kalkulasi Net Sales, COGS riil, OPEX, dan Estimated EBITDA secara otomatis setiap hari tanpa perlu menunggu rekap akuntan berminggu-minggu.',
    roiImpact: 'Memungkinkan owner mengambil keputusan efisiensi biaya secara cepat di minggu yang sama saat terjadi penurunan margin.'
  },
  {
    id: 34,
    pillar: 'finance_fraud',
    pillarName: 'Keamanan Finansial & Fraud',
    pillarIcon: 'CreditCard',
    question: 'Bagaimana proses pencocokan biaya MDR (Merchant Discount Rate) EDC Bank dan komisi platform pesan-antar online (GrabFood/GoFood/ShopeeFood)?',
    objective: 'Menilai akurasi pemisahan omset kotor vs uang bersih yang benar-benar masuk ke rekening bank.',
    redFlags: [
      'Restoran mencatat omset GoFood/GrabFood kotor seolah-olah uang yang masuk ke bank sebesar itu (padahal dipotong komisi 20%)',
      'Tidak pernah mengecek apakah potongan MDR kartu kredit bank (1.5% - 2%) sudah sesuai kontrak',
      'Terjadi selisih ratusan ribu hingga jutaan rupiah antara mutasi bank dan laporan penjualan'
    ],
    options: [
      { label: 'Tidak pernah dicocokkan, hanya percaya pada mutasi bank', score: 1, hint: 'Potensi kerugian komisi tersembunyi yang tidak terpantau' },
      { label: 'Dicek manual oleh bagian finance dengan mencocokkan excel satu per satu', score: 2, hint: 'Memakan waktu berjam-jam dan rentan kekeliruan rekonsiliasi' },
      { label: 'Ada pencatatan persentase komisi standard di laporan bulanan', score: 3, hint: 'Belum memperhitungkan promo sharing dan diskon merchant' },
      { label: 'Automated Channel Reconciliation: Memisahkan Net Sales, MDR, dan Merchant Commission otomatis per channel penjualan', score: 4, hint: 'Presisi 100% klop dengan transferan bank bersih' }
    ],
    recommendation: 'GastroStock Multi-Channel Revenue Engine otomatis menghitung potongan komisi ojol dan MDR EDC, menyajikan laporan Net Cash Inflow yang siap disandingkan dengan rekening koran bank Anda.',
    roiImpact: 'Menghilangkan selisih pembukuan dan mempermudah rekonsiliasi kas tanpa perlu lembur staf finance.'
  },

  // =========================================================================
  // PILAR 5: PENGALAMAN PELANGGAN, SPLIT BILL & TABLE TURN RATE (8 PERTANYAAN)
  // =========================================================================
  {
    id: 35,
    pillar: 'customer_table',
    pillarName: 'Customer Experience & Table Turn',
    pillarIcon: 'QrCode',
    question: 'Apakah restoran Anda menyediakan opsi QR Menu atau Self-Ordering di meja sehingga tamu bisa langsung memesan dari smartphone tanpa menunggu waiter?',
    objective: 'Mengukur pemanfaatan teknologi self-service untuk meningkatkan kepuasan tamu dan mengefisiensikan jumlah staf.',
    redFlags: [
      'Tamu harus melambaikan tangan berkali-kali memanggil waiter yang sibuk di jam makan siang',
      'Tamu batal pesan menu tambahan (dessert/kopi) karena malas memanggil waiter lagi',
      'Buku menu cetak kotor, berminyak, atau harganya dicoret-coret spidol'
    ],
    options: [
      { label: 'Hanya buku menu fisik konvensional, waiter harus selalu datang', score: 1, hint: 'Tamu sering menunggu lama saat jam ramai' },
      { label: 'Ada QR code tetapi hanya membuka file PDF gambar menu yang berat', score: 2, hint: 'Tamu tetap harus memanggil waiter untuk mencatat pesanannya' },
      { label: 'Ada QR ordering berbasis web tetapi tidak sinkron dengan stok POS kasir', score: 3, hint: 'Tamu memesan menu yang ternyata sudah habis di dapur' },
      { label: 'Interactive Contactless QR Ordering: Terhubung realtime ke KDS, auto-detect nomor meja, dan bayar langsung di smartphone', score: 4, hint: 'Kenyamanan maksimal: Menaikkan pesanan ulang (re-order) hingga 28%' }
    ],
    recommendation: 'GastroStock QR Table-Order memungkinkan tamu memindai QR dinamis di meja, memilih menu dengan foto HD, menambahkan catatan, dan langsung mengirim pesanan ke dapur tanpa antre.',
    roiImpact: 'Meningkatkan rata-rata belanja tamu (Average Order Value) sebesar 15-22% berkat kemudahan memesan menu tambahan (upselling).'
  },
  {
    id: 36,
    pillar: 'customer_table',
    pillarName: 'Customer Experience & Table Turn',
    pillarIcon: 'Clock',
    question: 'Berapa rata-rata waktu yang dihabiskan satu kelompok tamu di meja makan (Dining Duration / Table Turnaround Time)?',
    objective: 'Menilai optimalisasi pemanfaatan kapasitas kursi restoran pada jam-jam paling menguntungkan.',
    redFlags: [
      'Waktu makan berlarut-larut > 90 menit bukan karena tamu ingin santai, tapi karena lamanya makanan keluar dan lamanya minta bill',
      'Banyak calon tamu walk-in pergi meninggalkan restoran (walk-out) karena antrean waiting list terlalu panjang',
      'Manajemen tidak tahu rata-rata durasi meja terisi per shift'
    ],
    options: [
      { label: '> 90 menit (Sebagian besar waktu terbuang untuk menunggu makanan dan tagihan)', score: 1, hint: 'Kapasitas restoran tidak termanfaatkan maksimal' },
      { label: '60 - 90 menit, proses minta bon dan pembayaran memakan waktu 15 menit', score: 2, hint: 'Titik lambat ada pada proses penyelesaian pembayaran tamu' },
      { label: '45 - 60 menit dengan alur kasir konvensional', score: 3, hint: 'Cukup standar untuk resto casual dining' },
      { label: '< 40 menit berkat alur cepat POS, KDS, dan Instant Digital Checkout', score: 4, hint: 'Perputaran meja sangat tinggi: Kapasitas melayani tamu naik 40%' }
    ],
    recommendation: 'Dengan integrasi GastroStock POS, KDS, dan Quick Pay, waktu tunggu makanan terpangkas 15 menit dan waktu pembayaran bill terpangkas 8 menit, melipatgandakan perputaran meja (table turnover).',
    roiImpact: 'Menambah 1-2 siklus pelanggan baru per meja setiap jam sibuk, mendongkrak omset harian hingga puluhan juta rupiah.'
  },
  {
    id: 37,
    pillar: 'customer_table',
    pillarName: 'Customer Experience & Table Turn',
    pillarIcon: 'Gift',
    question: 'Bagaimana restoran Anda mengelola program loyalitas pelanggan (Member Loyalty, Poin Belanja, atau Promo Ulang Tahun)?',
    objective: 'Mengukur kemampuan restoran dalam meningkatkan retensi pelanggan (Repeat Orders & Customer Lifetime Value).',
    redFlags: [
      'Hanya menggunakan kartu stempel kertas fisik yang mudah hilang atau rusak dicuci',
      'Restoran sama sekali tidak memiliki database nomor WhatsApp pelanggan setianya',
      'Tidak bisa mengirimkan promo khusus kepada pelanggan yang sudah 30 hari tidak berkunjung'
    ],
    options: [
      { label: 'Tidak ada program member sama sekali', score: 1, hint: 'Melewatkan peluang pendapatan terbesar dari pelanggan setia' },
      { label: 'Kartu stempel kertas manual (sering hilang atau dipalsukan stempelnya)', score: 2, hint: 'Biaya cetak kartu dan tidak menghasilkan database digital' },
      { label: 'Catat nomor HP di POS tetapi jarang diolah untuk kirim promo', score: 3, hint: 'Data pasif yang tidak menghasilkan transaksi berulang' },
      { label: 'Digital Phone-Number Membership terintegrasi: Auto-earn points, cashback wallet, dan WhatsApp Automated Re-Engagement', score: 4, hint: 'Mesin penghasil pelanggan loyal tanpa biaya iklan berbayar' }
    ],
    recommendation: 'GastroStock Customer CRM mengenali pelanggan cukup dengan nomor ponsel saat transaksi di kasir: Akumulasi poin otomatis, tier member (Silver/Gold/Platinum), dan auto-WhatsApp saat ulang tahun.',
    roiImpact: 'Meningkatkan frekuensi kunjungan ulang pelanggan setia sebesar 30-45%, menurunkan ketergantungan pada diskon marketplace berbayar.'
  },
  {
    id: 38,
    pillar: 'customer_table',
    pillarName: 'Customer Experience & Table Turn',
    pillarIcon: 'HeartHandshake',
    question: 'Bagaimana restoran Anda mengumpulkan dan merespons kritik/saran dari pelanggan sebelum mereka menulis ulasan negatif di Google Maps / media sosial?',
    objective: 'Mendeteksi insiden ketidakpuasan tamu secara dini dan memitigasi krisis reputasi resto.',
    redFlags: [
      'Owner baru tahu ada komplain makanan asin atau pelayanan judes setelah bintang 1 viral di Google Review',
      'Kotak saran kertas di dekat pintu keluar hampir tidak pernah dibuka atau diisi pelanggan',
      'Tidak ada mekanisme eskalasi langsung ke Manager saat tamu merasa kecewa di meja'
    ],
    options: [
      { label: 'Hanya tahu komplain dari review buruk di Google Maps atau medsos', score: 1, hint: 'Reputasi sudah terlanjur tercoreng di mata publik' },
      { label: 'Kotak saran kertas konvensional (jarang diisi tamu)', score: 2, hint: 'Metode kuno yang tidak dihiraukan generasi modern' },
      { label: 'Waiter bertanya lisan "Gimana makanannya kak?" saat angkat piring', score: 3, hint: 'Tamu Indonesia cenderung sungkan menjawab jujur secara langsung' },
      { label: 'Digital Feedback di Struk Digital / QR Order: Rating < 3 bintang seketika trigger alarm notifikasi ke HP Manager bertugas', score: 4, hint: 'Penyelamatan reputasi seketika sebelum tamu keluar dari restoran' }
    ],
    recommendation: 'GastroStock Instant Service Recovery mengirimkan alert real-time ke manajer jika ada pelanggan memberikan skor rendah di struk digital, memungkinkan manajer mendatangi meja dan memberikan solusi saat itu juga.',
    roiImpact: 'Mencegah 80% ulasan bintang 1 di Google Maps dan mempertahankan rating restoran di atas 4.7 bintang.'
  },
  {
    id: 39,
    pillar: 'customer_table',
    pillarName: 'Customer Experience & Table Turn',
    pillarIcon: 'Sparkles',
    question: 'Apakah pramusaji Anda memiliki panduan atau rekomendasi otomatis untuk melakukan Up-Selling (menawarkan menu pelengkap yang pas) saat melayani tamu?',
    objective: 'Menilai efektivitas tim FOH dalam mendongkrak nilai keranjang belanja (Basket Size).',
    redFlags: [
      'Waiter hanya pasif mencatat apa yang diminta tamu tanpa menawarkan menu pendamping',
      'Staf tidak tahu menu apa yang paling cocok dipasangkan dengan hidangan utama (food pairing)',
      'Tidak ada insentif atau panduan digital di layar tablet waiter'
    ],
    options: [
      { label: 'Staf hanya pasif menunggu tamu menyebutkan pesanan', score: 1, hint: 'Potensi penambahan penjualan per transaksi hilang' },
      { label: 'Diinstruksikan lisan saat briefing pagi tapi sering lupa saat jam sibuk', score: 2, hint: 'Konsistensi rendah saat operasional sedang ramai' },
      { label: 'Ada menu rekomendasi umum yang dihafal pramusaji', score: 3, hint: 'Belum berbasis data kombinasi menu terlaris' },
      { label: 'AI Smart Cross-Selling Prompt di tablet waiter: Sistem otomatis menyarankan add-on spesifik (misal: "Tambah Keju Mozzarella / Minuman Segar?")', score: 4, hint: 'Mendongkrak belanja tamu tanpa kesan memaksa' }
    ],
    recommendation: 'GastroStock Waiter Prompt Engine menampilkan saran add-on otomatis di layar tablet saat waiter memilih suatu hidangan, memudahkan staf menawarkan menu pelengkap dengan percaya diri.',
    roiImpact: 'Menaikkan rata-rata nilai transaksi per pelanggan sebesar 12-18% secara konsisten di setiap meja.'
  },
  {
    id: 40,
    pillar: 'customer_table',
    pillarName: 'Customer Experience & Table Turn',
    pillarIcon: 'Armchair',
    question: 'Bagaimana cara restoran Anda mengelola antrean tamu menunggu (Waiting List) saat kapasitas meja penuh di akhir pekan?',
    objective: 'Mengevaluasi kenyamanan tamu yang sedang menunggu tempat duduk dan pencegahan antrean berantakan di pintu masuk.',
    redFlags: [
      'Menulis nama dan nomor HP tamu di selembar kertas robek atau papan klip',
      'Staf memanggil nama tamu dengan berteriak kencang di depan pintu restoran',
      'Tamu kabur tanpa kabar karena bosan menunggu tanpa kejelasan estimasi waktu meja siap'
    ],
    options: [
      { label: 'Catat manual di kertas, staf teriak panggil nama tamu', score: 1, hint: 'Kesan tidak profesional dan suasana depan resto berantakan' },
      { label: 'Kasih nomor antrean kartu fisik tapi tamu tidak bisa jalan-jalan keluar', score: 2, hint: 'Tamu terikat di area tunggu yang sempit' },
      { label: 'Pakai buzzer piringan getar (pager disk) tapi jangkauan jarak terbatas', score: 3, hint: 'Alat pager sering rusak atau terbawa pulang oleh tamu' },
      { label: 'WhatsApp Smart Waiting List: Tamu scan QR, pantau nomor antrean di HP, dan dapat notifikasi WA otomatis saat meja siap', score: 4, hint: 'Tamu bebas berjalan-jalan di mall/sekitar resto dengan tenang' }
    ],
    recommendation: 'GastroStock Cloud Queue System mengirimkan pesan WhatsApp otomatis berisi link live status antrean dan estimasi menit tunggu kepada tamu, serta memanggil tamu dengan 1 klik saat meja dibersihkan.',
    roiImpact: 'Menurunkan angka pembatalan antrean (drop-off rate) sebesar 40% dan menciptakan kesan mewah modern sejak menit pertama tamu datang.'
  },
  {
    id: 41,
    pillar: 'customer_table',
    pillarName: 'Customer Experience & Table Turn',
    pillarIcon: 'ShoppingBag',
    question: 'Bagaimana alur pemesanan untuk pesanan Bawa Pulang (Takeaway / To-Go) atau Drive-Thru? Apakah bercampur aduk dengan antrean makan di tempat (Dine-In)?',
    objective: 'Menilai pemisahan alur pesanan untuk mencegah kekacauan operasional antara tamu meja dan pembeli takeaway.',
    redFlags: [
      'Staf dapur bingung mana makanan yang harus dipacking kotak kardus dan mana yang disajikan di atas piring porselen',
      'Makanan takeaway dingin karena kelamaan menunggu pembeli di kasir',
      'Antrean takeaway memblokir jalur jalan pramusaji yang sedang mengantar makanan'
    ],
    options: [
      { label: 'Bercampur total di satu antrean dan dapur sering salah piring/packaging', score: 1, hint: 'Kekacauan presentasi dan kemasan makanan' },
      { label: 'Bisa dipisah di kasir tetapi dapur harus baca detail kecil di struk kertas', score: 2, hint: 'Chef sering terlanjur plating di piring sebelum sadar itu takeaway' },
      { label: 'Ada antrean kasir terpisah tetapi stasiun packing masih menyatu', score: 3, hint: 'Masih terjadi kepadatan ruang di area bar pengeluaran makanan' },
      { label: 'Dedicated Order Type Dispatcher di KDS: Visual badge "TAKEAWAY" otomatis arahkan rute ke stasiun packaging khusus', score: 4, hint: 'Alur kerja terpisah rapi, cepat, dan zero salah bungkus' }
    ],
    recommendation: 'GastroStock KDS memberikan visual badge kontras dan ikon khusus untuk pesanan Takeaway/Delivery, memicu packing checklist khusus (sendok, tisu, saus sachet) agar tidak ada yang tertinggal.',
    roiImpact: 'Kecepatan penyerahan pesanan takeaway meningkat 50%, mencegah insiden komplain "saus atau alat makan tertinggal".'
  },
  {
    id: 42,
    pillar: 'customer_table',
    pillarName: 'Customer Experience & Table Turn',
    pillarIcon: 'CheckSquare',
    question: 'Apakah struk bukti pembayaran pelanggan dapat dikirimkan secara ramah lingkungan via WhatsApp / Email (E-Receipt) selain cetak fisik?',
    objective: 'Mengukur adopsi teknologi paperless dan efektivitas pengumpulan kontak konsumen secara sah (opt-in).',
    redFlags: [
      '100% bergantung pada kertas thermal yang 90% langsung dibuang ke tempat sampah oleh tamu',
      'Biaya pembelian roll kertas thermal membengkak setiap bulan',
      'Tidak memiliki cara legal untuk mengumpulkan data kontak pelanggan yang bertransaksi tunai/kartu'
    ],
    options: [
      { label: 'Hanya bisa cetak kertas thermal, jika printer mati tidak ada struk', score: 1, hint: 'Boros biaya kertas dan tidak ramah lingkungan' },
      { label: 'Bisa kirim email tapi kasir harus ketik manual alamat email tamu yang panjang', score: 2, hint: 'Sangat lambat dan sering salah ketik karakter email' },
      { label: 'Ada opsi struk digital tetapi jarang ditawarkan oleh kasir', score: 3, hint: 'Belum menjadi SOP standar operasional harian' },
      { label: 'Instant WhatsApp E-Receipt dengan 1-klik nomor HP: Hemat kertas + otomatis simpan database pelanggan ke CRM', score: 4, hint: 'Modern, ramah lingkungan, dan aset database pelanggan berharga' }
    ],
    recommendation: 'GastroStock Smart E-Receipt memungkinkan kasir mengirim struk resmi lengkap berlogo resto langsung ke WhatsApp pelanggan dalam hitungan 2 detik.',
    roiImpact: 'Menghemat 70% pengeluaran kertas struk tahunan dan mengumpulkan ribuan database kontak pelanggan aktif untuk keperluan pemasaran gratis.'
  },

  // =========================================================================
  // PILAR 6: SKALABILITAS, OFFLINE RESILIENCE & MULTI-OUTLET (8 PERTANYAAN)
  // =========================================================================
  {
    id: 43,
    pillar: 'scale_multioutlet',
    pillarName: 'Skalabilitas & Multi-Outlet',
    pillarIcon: 'Building',
    question: 'Berapa outlet/cabang yang Anda miliki saat ini, dan berapa lama waktu yang dibutuhkan tim Anda untuk membuka 1 cabang baru dari segi setup sistem POS & menu?',
    objective: 'Menilai kesiapan infrastruktur IT restoran dalam mendukung ekspansi cabang secara cepat (franchise-ready).',
    redFlags: [
      'Setiap buka cabang baru, harus input ulang ratusan menu dan harga secara manual satu per satu',
      'Setting hardware printer dan jaringan membutuhkan waktu berminggu-minggu dengan bantuan vendor eksternal mahal',
      'Data antar cabang berdiri sendiri-sendiri tanpa ada master data terpusat'
    ],
    options: [
      { label: 'Butuh > 2 minggu input manual menu satu per satu di setiap cabang baru', score: 1, hint: 'Sangat tidak efisien dan rentan perbedaan harga antar cabang' },
      { label: '1 - 2 minggu dengan bantuan teknisi khusus vendor software', score: 2, hint: 'Biaya deployment cabang baru sangat tinggi' },
      { label: '3 - 5 hari dengan fitur copy master database menu', score: 3, hint: 'Cukup cepat namun masih butuh beberapa kalibrasi manual' },
      { label: 'Instant Cloud Tenant Cloner: Cabang baru siap go-live dalam hitungan jam dengan 1-klik deploy menu & resep', score: 4, hint: 'Standar waralaba / franchise multinasional siap ekspansi masif' }
    ],
    recommendation: 'GastroStock Centralized Multi-Store Management memungkinkan Anda mereplikasi seluruh konfigurasi menu, resep, dan hak akses ke cabang baru hanya dalam waktu 30 menit.',
    roiImpact: 'Memangkas biaya go-live pembukaan cabang baru hingga 80% dan memastikan standarisasi rasa serta harga di seluruh outlet.'
  },
  {
    id: 44,
    pillar: 'scale_multioutlet',
    pillarName: 'Skalabilitas & Multi-Outlet',
    pillarIcon: 'Network',
    question: 'Bagaimana manajemen pusat (Owner/GM) memantau penjualan seluruh cabang secara serempak saat berada di luar kota atau luar negeri?',
    objective: 'Mengukur kemudahan monitoring performa jaringan restoran dalam satu layar konsol terpusat.',
    redFlags: [
      'Manager tiap cabang harus mengirimkan foto kertas Z-Report struk via WhatsApp setiap malam',
      'Owner harus merekap angka penjualan 5-10 cabang secara manual di Excel larut malam',
      'Tidak bisa membandingkan cabang mana yang kinerjanya di bawah target secara cepat'
    ],
    options: [
      { label: 'Minta kirim foto laporan struk kertas via WA dari tiap manajer cabang', score: 1, hint: 'Kuno, lambat, dan angka rawan dipalsukan atau salah hitung' },
      { label: 'Login satu per satu ke akun cabang yang berbeda-beda di aplikasi POS', score: 2, hint: 'Sangat merepotkan harus logout-login berulang kali' },
      { label: 'Ada website dashboard pusat tetapi data penjualan delay beberapa jam', score: 3, hint: 'Tidak bisa memantau kondisi operasional secara live detik ini' },
      { label: 'Multi-Outlet Consolidated Executive Cockpit: Live stream omset, HPP, dan perbandingan ranking cabang per detik di HP', score: 4, hint: 'Kendali penuh di genggaman tangan dari mana saja di seluruh dunia' }
    ],
    recommendation: 'GastroStock Multi-Store Master Console menyajikan dashboard konsol gabungan: Ranking performa cabang, menu terlaris nasional vs lokal, dan total omset kotor & bersih secara realtime 24 jam.',
    roiImpact: 'Menghemat waktu rekap harian Owner hingga 2 jam per hari dan memberikan ketajaman instan dalam mengidentifikasi cabang yang sedang bermasalah.'
  },
  {
    id: 45,
    pillar: 'scale_multioutlet',
    pillarName: 'Skalabilitas & Multi-Outlet',
    pillarIcon: 'Warehouse',
    question: 'Apakah bisnis Anda menggunakan atau berencana mendirikan Dapur Pusat (Central Kitchen) untuk memproduksi bahan setengah jadi / bumbu pasta bagi semua cabang?',
    objective: 'Menilai kebutuhan modul Central Kitchen & Inter-Branch Stock Transfer untuk menjaga konsistensi cita rasa.',
    redFlags: [
      'Cabang sering meminta kiriman bahan ke cabang lain tanpa ada dokumen transfer resmi',
      'Dapur pusat bingung berapa porsi bumbu yang harus diproduksi karena tidak tahu proyeksi kebutuhan cabang',
      'Sering terjadi selisih stok antara jumlah yang dikirim gudang pusat dan yang diterima cabang'
    ],
    options: [
      { label: 'Belum ada dan tidak berencana (tiap cabang masak sendiri dari nol)', score: 1, hint: 'Konsistensi rasa antar cabang sangat sulit dijaga' },
      { label: 'Ada dapur pusat tapi komunikasi order cabang masih via chat grup WA', score: 2, hint: 'Sering salah kirim varian bumbu atau tertukar jadwal kirim' },
      { label: 'Ada sistem request bahan sederhana tetapi belum terhubung ke jadwal produksi dapur pusat', score: 3, hint: 'Dapur pusat sering kelebihan atau kekurangan produksi' },
      { label: 'Central Kitchen Production & Inter-Branch Dispatch Engine: Auto-generate Work Order produksi berbasis sales forecast cabang', score: 4, hint: 'Efisiensi rantai pasok industri F&B modern skala besar' }
    ],
    recommendation: 'GastroStock Central Kitchen Suite mengotomatisasi rantai pasokan: Cabang mengajukan Internal PO, Central Kitchen menjadwalkan batch produksi dengan resep massal, dan sistem mencatat transfer antar cabang dengan barcode serah terima.',
    roiImpact: 'Menjaga 100% konsistensi cita rasa makanan di seluruh cabang dan menghemat biaya produksi bahan baku hingga 20% lewat skala ekonomi (bulk purchasing).'
  },
  {
    id: 46,
    pillar: 'scale_multioutlet',
    pillarName: 'Skalabilitas & Multi-Outlet',
    pillarIcon: 'DollarSign',
    question: 'Apakah Anda menerapkan perbedaan harga jual menu antar cabang (misal: cabang mall premium lebih mahal 15% dibanding cabang ruko biasa)?',
    objective: 'Menilai fleksibilitas Price Tiering (Multi-Tier Pricing) berdasarkan lokasi geografis dan daya beli target pasar.',
    redFlags: [
      'Harga harus seragam di semua tempat karena sistem POS tidak mendukung multi-tier pricing',
      'Jika mau beda harga, harus membuat nama menu baru yang membuat database menu menjadi berantakan',
      'Sulit menganalisis margin laba jika harga menu berbeda antar lokasi'
    ],
    options: [
      { label: 'Sistem POS mengharuskan harga sama persis di semua cabang', score: 1, hint: 'Membatasi strategi penetapan harga fleksibel di lokasi sewa mahal' },
      { label: 'Bisa beda harga tapi harus bikin menu duplikat manual di tiap cabang', score: 2, hint: 'Database resep dan pelaporan penjualan menjadi kacau' },
      { label: 'Bisa atur harga per cabang tetapi pengaturan diskon dan pajaknya masih global', score: 3, hint: 'Kurang fleksibel untuk pajak daerah (PB1) yang berbeda regulasi' },
      { label: 'Multi-Tier Price Matrix: 1 Master SKU dengan fleksibilitas setting harga, pajak daerah, dan margin per outlet', score: 4, hint: 'Manajemen harga enterprise yang rapi, dinamis, dan terpusat' }
    ],
    recommendation: 'GastroStock Price Tier Matrix memungkinkan Anda mengatur harga berbeda untuk menu yang sama di Cabang Bandara, Cabang Mall, dan Cabang Ruko cukup dari 1 layar master tanpa menduplikasi data SKU.',
    roiImpact: 'Memaksimalkan margin keuntungan di lokasi-lokasi prestisius tanpa kehilangan keselarasan data resep gudang.'
  },
  {
    id: 47,
    pillar: 'scale_multioutlet',
    pillarName: 'Skalabilitas & Multi-Outlet',
    pillarIcon: 'ShieldCheck',
    question: 'Bagaimana keamanan data dan cadangan (backup) transaksi Anda jika suatu saat perangkat tablet kasir di resto rusak, tercebur kuah, atau dicuri orang?',
    objective: 'Mengukur ketahanan terhadap bencana perangkat keras (disaster recovery) dan perlindungan data aset restoran.',
    redFlags: [
      'Data hanya tersimpan di memori lokal tablet tanpa cadangan cloud otomatis',
      'Jika tablet kasir rusak, seluruh data penjualan dan utang piutang pelanggan hilang selamanya',
      'Butuh waktu berhari-hari menginstal ulang sistem pada tablet baru'
    ],
    options: [
      { label: 'Data hanya di perangkat lokal, jika rusak data hilang total', score: 1, hint: 'Sangat berbahaya: Risiko kehilangan rekam jejak bisnis bertahun-tahun' },
      { label: 'Backup manual ke flashdisk yang jarang dilakukan oleh staf', score: 2, hint: 'Sering lupa dilakukan sehingga backup data sudah usang' },
      { label: 'Ada backup cloud harian setiap tengah malam', score: 3, hint: 'Jika rusak jam 8 malam, data transaksi hari itu dari pagi bisa hilang' },
      { label: 'Continuous Realtime Encrypted Cloud Sync + 5-Menit Hot Swap: Ganti tablet baru, login, langsung jalan tanpa hilang 1 transaksi pun', score: 4, hint: 'Toleransi downtime nol: Rasa tenang 100% untuk pemilik restoran' }
    ],
    recommendation: 'GastroStock menerapkan Dual-Zone Continuous Replication: Setiap transaksi tersimpan seketika di memori lokal terenkripsi dan tersinkronisasi ke cloud aman. Jika tablet rusak, cukup ambil tablet baru dan login, operasional kembali jalan dalam 2 menit.',
    roiImpact: 'Menghilangkan 100% risiko kehilangan data finansial dan menjamin operasional tidak pernah berhenti lebih dari 5 menit.'
  },
  {
    id: 48,
    pillar: 'scale_multioutlet',
    pillarName: 'Skalabilitas & Multi-Outlet',
    pillarIcon: 'Cpu',
    question: 'Apakah sistem POS Anda saat ini terkunci (vendor-locked) pada perangkat keras tertentu yang mahal, atau bisa berjalan di perangkat apa pun (Tablet Android, iPad, PC Windows, Touchscreen POS)?',
    objective: 'Menilai efisiensi belanja modal (CAPEX) dan kemudahan pengadaan hardware restoran Anda.',
    redFlags: [
      'Wajib membeli mesin kasir khusus dari vendor dengan harga Rp 15-25 juta per unit',
      'Jika mesin rusak, suku cadang langka dan harus menunggu impor berbulan-bulan',
      'Tidak bisa memanfaatkan tablet Android murah atau iPad yang sudah dimiliki owner'
    ],
    options: [
      { label: 'Terkunci hardware khusus vendor (sangat mahal dan servis lambat)', score: 1, hint: 'Biaya investasi tinggi dan ketergantungan sepihak pada satu vendor' },
      { label: 'Hanya bisa jalan di satu sistem operasi tertentu (misal: iOS saja atau Windows saja)', score: 2, hint: 'Membatasi fleksibilitas pilihan pengadaan perangkat' },
      { label: 'Bisa di Android dan Windows tetapi aplikasinya sering lambat di spek standar', score: 3, hint: 'Butuh perangkat spek tinggi agar tidak lemot' },
      { label: 'Hardware-Agnostic & Cross-Platform (Android, iPadOS, Windows, macOS, Linux) berkecepatan tinggi di perangkat ekonomis', score: 4, hint: 'Hemat biaya investasi awal hingga 60%' }
    ],
    recommendation: 'GastroStock dirancang Cross-Platform & Hardware-Agnostic: Berjalan super enteng di tablet Android ekonomis seharga Rp 1.5 jutaan maupun di iPad Pro atau all-in-one POS terminal yang sudah Anda miliki.',
    roiImpact: 'Menghemat biaya pengadaan perangkat keras (Hardware Capex) sebesar Rp 10.000.000 - Rp 25.000.000 per cabang.'
  },
  {
    id: 49,
    pillar: 'scale_multioutlet',
    pillarName: 'Skalabilitas & Multi-Outlet',
    pillarIcon: 'Smartphone',
    question: 'Apakah aplikasi pesan-antar makanan online (GoFood, GrabFood, ShopeeFood) terhubung langsung ke sistem kasir Anda, atau kasir harus memegang 3-4 HP terpisah di meja kasir?',
    objective: 'Mengukur efisiensi integrasi Omnichannel & Online Food Delivery (OFD) untuk mengeliminasi input ganda.',
    redFlags: [
      'Meja kasir dipenuhi 4 mesin HP/tab terpisah untuk masing-masing aplikasi ojol',
      'Kasir harus mengetik ulang pesanan dari aplikasi ojol ke komputer POS (double-entry)',
      'Sering terjadi salah ketik menu atau lupa input pesanan ojol saat kasir sedang sibuk melayani tamu dine-in'
    ],
    options: [
      { label: 'Pegang 4 HP terpisah, kasir ketik ulang pesanan manual ke POS', score: 1, hint: 'Meja kasir semrawut dan sangat rentan pesanan terlewat atau salah ketik' },
      { label: 'Ada alat aggregator terpisah tapi tidak otomatis masuk ke dapur KDS', score: 2, hint: 'Dapur tetap harus membaca tiket kertas tambahan' },
      { label: 'Terintegrasi sebagian channel tetapi sering gagal sync menu saat jam sibuk', score: 3, hint: 'Menu habis di resto masih bisa dipesan di aplikasi ojol' },
      { label: 'Unified Omnichannel Hub: Pesanan GoFood/GrabFood/ShopeeFood langsung masuk ke 1 layar POS & KDS otomatis dengan auto-accept cerdas', score: 4, hint: 'Meja kasir bersih, nol salah input, dan pesanan online langsung diproses dapur' }
    ],
    recommendation: 'GastroStock terhubung langsung dengan ekosistem aggregator OFD: Semua pesanan online masuk otomatis ke antrean dapur yang sama dengan pesanan dine-in tanpa perlu ketik ulang di kasir.',
    roiImpact: 'Mengurangi beban kerja kasir hingga 40%, mencegah kesalahan input pesanan online yang sering menyebabkan bintang 1 di aplikasi pesan-antar.'
  },
  {
    id: 50,
    pillar: 'scale_multioutlet',
    pillarName: 'Skalabilitas & Multi-Outlet',
    pillarIcon: 'Key',
    question: 'Bagaimana kesiapan sistem Anda terhadap kepatuhan regulasi perpajakan daerah (PB1 / Pajak Restoran 10%) dan integrasi Tapping Box Bapenda Pemda?',
    objective: 'Memastikan legalitas operasional bisnis aman dari sanksi pajak daerah dan audit resmi Bapenda.',
    redFlags: [
      'Pernah ditegur dinas perpajakan daerah karena laporan pajak tidak sesuai atau mesin tapping box sering offline',
      'Perhitungan pajak dan service charge tidak transparan di struk sehingga tamu komplain',
      'Kesulitan memisahkan omset yang terkena pajak dengan komponen non-objek pajak'
    ],
    options: [
      { label: 'Belum ada pengaturan pajak resmi / sering ada selisih perhitungan PB1', score: 1, hint: 'Risiko denda pajak daerah dan sanksi penutupan usaha' },
      { label: 'Perhitungan pajak global tapi belum kompatibel dengan alat Tapping Box Pemda', score: 2, hint: 'Bisa bermasalah saat inspeksi mendadak dinas pendapatan daerah' },
      { label: 'Sudah pasang Tapping Box bank daerah tetapi sering error atau memperlambat printer', score: 3, hint: 'Mengganggu kenyamanan cetak struk kasir' },
      { label: 'GovTax & Bapenda Ready: Mendukung dual-tax engine, compliant integrasi Tapping Box Pemda, dan auto-generate laporan SPT Masa Pajak Restoran', score: 4, hint: '100% Legal, patuh regulasi, dan aman untuk jangka panjang' }
    ],
    recommendation: 'GastroStock memiliki arsitektur kepatuhan pajak daerah yang fleksibel: Mendukung konfigurasi PB1 10%, Service Charge 5-7%, dan protokol integrasi Tapping Box resmi tanpa memperlambat pencetakan struk kasir.',
    roiImpact: 'Menghindarkan bisnis Anda dari denda pelanggaran pajak daerah serta mempermudah pelaporan pajak bulanan dalam hitungan menit.'
  }
];

// Helper Functions
export function getQuestionsByPillar(pillarId: string): PitchingQuestion[] {
  if (pillarId === 'all') return PITCHING_QUESTIONS;
  return PITCHING_QUESTIONS.filter(q => q.pillar === pillarId);
}

export function calculateVulnerabilityScore(answers: Record<number, number>): {
  totalAnswered: number;
  averageScore: number;
  vulnerabilityLevel: 'Sangat Kritis (Bahaya Tinggi)' | 'Rentan (Banyak Kebocoran)' | 'Cukup Baik (Perlu Modernisasi)' | 'Prima (Optimasi Skalabilitas)';
  potentialMonthlySavings: string;
  urgentPillars: string[];
} {
  const answeredIds = Object.keys(answers).map(Number);
  const totalAnswered = answeredIds.length;
  if (totalAnswered === 0) {
    return {
      totalAnswered: 0,
      averageScore: 0,
      vulnerabilityLevel: 'Sangat Kritis (Bahaya Tinggi)',
      potentialMonthlySavings: 'Rp 15.000.000 - Rp 45.000.000 / bln',
      urgentPillars: ['Semua 6 Pilar Operasional']
    };
  }

  const sum = answeredIds.reduce((acc, id) => acc + (answers[id] || 0), 0);
  const averageScore = Number((sum / totalAnswered).toFixed(2));

  let vulnerabilityLevel: 'Sangat Kritis (Bahaya Tinggi)' | 'Rentan (Banyak Kebocoran)' | 'Cukup Baik (Perlu Modernisasi)' | 'Prima (Optimasi Skalabilitas)';
  let potentialMonthlySavings = '';

  if (averageScore <= 1.8) {
    vulnerabilityLevel = 'Sangat Kritis (Bahaya Tinggi)';
    potentialMonthlySavings = 'Rp 25.000.000 - Rp 65.000.000 / bln (Kebocoran Bahan, Fraud & Downtime)';
  } else if (averageScore <= 2.6) {
    vulnerabilityLevel = 'Rentan (Banyak Kebocoran)';
    potentialMonthlySavings = 'Rp 12.000.000 - Rp 30.000.000 / bln (Optimasi HPP & Efisiensi Staf)';
  } else if (averageScore <= 3.4) {
    vulnerabilityLevel = 'Cukup Baik (Perlu Modernisasi)';
    potentialMonthlySavings = 'Rp 6.000.000 - Rp 15.000.000 / bln (Peningkatan Table Turn & Upselling)';
  } else {
    vulnerabilityLevel = 'Prima (Optimasi Skalabilitas)';
    potentialMonthlySavings = 'Rp 10.000.000+ / cabang baru (Efisiensi Sentralisasi Multi-Outlet)';
  }

  // Cari pilar dengan skor terendah
  const pillarScores: Record<string, { total: number; count: number; name: string }> = {};
  PITCHING_QUESTIONS.forEach(q => {
    if (answers[q.id]) {
      if (!pillarScores[q.pillar]) {
        pillarScores[q.pillar] = { total: 0, count: 0, name: q.pillarName };
      }
      pillarScores[q.pillar].total += answers[q.id];
      pillarScores[q.pillar].count += 1;
    }
  });

  const urgentPillars: string[] = [];
  Object.keys(pillarScores).forEach(pKey => {
    const avg = pillarScores[pKey].total / pillarScores[pKey].count;
    if (avg < 2.5) {
      urgentPillars.push(pillarScores[pKey].name);
    }
  });

  return {
    totalAnswered,
    averageScore,
    vulnerabilityLevel,
    potentialMonthlySavings,
    urgentPillars: urgentPillars.length > 0 ? urgentPillars : ['Pertahankan performa operasional prima']
  };
}
