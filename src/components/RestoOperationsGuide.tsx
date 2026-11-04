import React, { useState } from 'react';
import { 
  Users, 
  Bot, 
  Terminal, 
  ChefHat, 
  ShoppingCart, 
  Warehouse, 
  LayoutDashboard, 
  Coffee, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  Flame, 
  Scale, 
  Package, 
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';

interface RestoOperationsGuideProps {
  onNavigateToServiceModes?: () => void;
}

export const RestoOperationsGuide: React.FC<RestoOperationsGuideProps> = ({
  onNavigateToServiceModes
}) => {
  const [activeSection, setActiveSection] = useState<'actions' | 'background_jobs' | 'api_mapping' | 'lifecycle'>('actions');
  const [selectedRole, setSelectedRole] = useState<'kasir' | 'dapur' | 'gudang' | 'bar' | 'manager'>('kasir');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-indigo-700">Panduan Operasional Restoran Lengkap</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-medium">Bahasa Umum &amp; Mudah Dipahami</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Peta Operasional Resto: Aksi Nyata, Background Job, &amp; API
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Panduan gamblang tentang apa saja tindakan kasir, koki, dan gudang, tugas apa saja yang dijalankan otomatis oleh sistem (bot/background job), dan bagaimana semuanya terhubung via API.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateToServiceModes && (
              <button
                onClick={onNavigateToServiceModes}
                className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>Lihat 16 Model Layanan &amp; Dev</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 font-semibold text-xs">
              Sistem Operasional 100% Terintegrasi
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-black/[0.04] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveSection('actions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeSection === 'actions'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-black/[0.04]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>1. Aksi-Aksi Petugas di Resto</span>
          </button>

          <button
            onClick={() => setActiveSection('background_jobs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeSection === 'background_jobs'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-black/[0.04]'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-500" />
            <span>2. Background Job Otomatis</span>
          </button>

          <button
            onClick={() => setActiveSection('api_mapping')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeSection === 'api_mapping'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-black/[0.04]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>3. Pemetaan Aksi ke API</span>
          </button>

          <button
            onClick={() => setActiveSection('lifecycle')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeSection === 'lifecycle'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-black/[0.04]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>4. Siklus 24 Jam Restoran</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: AKSI-AKSI PETUGAS DI RESTORAN */}
      {activeSection === 'actions' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Pilih Posisi Petugas:</span>
            {[
              { id: 'kasir', label: 'Kasir (POS Depan)', icon: ShoppingCart },
              { id: 'dapur', label: 'Koki / Dapur Utama (KDS)', icon: ChefHat },
              { id: 'bar', label: 'Barista / Stasiun Minuman', icon: Coffee },
              { id: 'gudang', label: 'Staff Gudang & Logistik', icon: Warehouse },
              { id: 'manager', label: 'Manajer Resto & Owner', icon: LayoutDashboard }
            ].map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Role Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            {selectedRole === 'kasir' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-amber-400" />
                    <span>Daftar Aksi Kasir di Layar POS (Point of Sale)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Kasir adalah pintu masuk penjualan. Semua aksi di kasir langsung mempengaruhi stok bahan mentah di belakang layar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">1. Input Pesanan Pelanggan</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">AKSI RUTIN</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Kasir memilih menu (misal: 2 Nasi Goreng Wagyu). Saat menu dipilih, sistem di balik layar langsung memeriksa apakah beras, daging, dan telur di gudang masih cukup.
                    </p>
                    <div className="text-[11px] text-amber-400 font-mono pt-1">
                      Menggunakan API: POST /api/v1/orders/checkout
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">2. Peringatan Menu Habis (Sold Out)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">PROTEKSI SISTEM</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Jika daging wagyu tersisa cuma 50 gram (padahal butuh 80 gram), tombol menu di layar kasir otomatis abu-abu atau memunculkan peringatan <em>"Bahan Tidak Cukup"</em> agar kasir tidak menjual menu yang tak bisa dimasak.
                    </p>
                    <div className="text-[11px] text-rose-400 font-mono pt-1">
                      Menerima Error: HTTP 409 Insufficient Stock
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">3. Terima Pembayaran (QRIS / Tunai / EDC)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">EKSEKUSI BAYAR</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Saat kasir menekan tombol "Bayar Lunas", dalam hitungan 0.1 detik stok beras, daging, dan telur langsung dipotong di sistem dan tiket pesanan langsung ditembakkan ke layar dapur koki.
                    </p>
                    <div className="text-[11px] text-emerald-400 font-mono pt-1">
                      Memicu Event: KITCHEN_TICKET_CREATED via WebSocket
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">4. Batalkan Pesanan (Void Order)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">KOREKSI STOK</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Jika tamu tiba-tiba membatalkan pesanan sebelum dimasak, kasir memasukkan PIN Supervisor untuk mem-VOID order. Sistem otomatis mengembalikan jatah bahan baku ke gudang (Rollback).
                    </p>
                    <div className="text-[11px] text-amber-400 font-mono pt-1">
                      Menggunakan API: POST /api/v1/orders/{'{id}'}/void
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'dapur' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-rose-400" />
                    <span>Daftar Aksi Koki di Layar Dapur (KDS - Kitchen Display System)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Koki tidak perlu kertas pesanan lagi. Semua pesanan tampil di tablet sentuh dapur tahan air/minyak.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">1. Terima Tiket Masak Real-Time</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">OTOMATIS</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Begitu kasir terima uang, monitor koki langsung berbunyi "ting-ting" dan memunculkan tiket pesanan baru berisi nama menu, jumlah porsi, dan catatan tamu (misal: "Pedas Sedang, Tanpa Acar").
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">2. Tekan "Mulai Masak" (Cooking)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">TRACKING SLA</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Koki menekan tiket pesanan saat wajan mulai dinyalakan. Timer stopwatch mulai berjalan untuk memastikan pesanan selesai di bawah standar waktu resto (misal: maksimal 15 menit).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">3. Catat Bahan Gosong / Tumpah (Waste Dapur)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">SANGAT PENTING</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Jika telur busuk, steak gosong, atau sup tumpah di lantai, koki menekan tombol merah <em>"Catat Bahan Rusak"</em>. Koki memasukkan jumlah dan alasannya. Stok fisik langsung berkurang saat itu juga agar angka pembukuan tidak meleset.
                    </p>
                    <div className="text-[11px] text-rose-400 font-mono pt-1">
                      Menggunakan API: POST /api/v1/kitchen/waste
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">4. Tekan "Selesai Saji" (Ready)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">PANGGIL RUNNER</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Ketika hidangan siap di piring saji, koki menekan tombol "Selesai". Sistem mengirim notifikasi ke waiter/runner untuk segera mengantarkan makanan ke meja tamu.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'bar' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-amber-400" />
                    <span>Daftar Aksi Barista di Stasiun Minuman (Bar Station)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Minuman memiliki alur terpisah dari dapur makanan agar tidak terjadi antrean tumpang tindih.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">1. Tiket Khusus Minuman</span>
                    <p className="text-slate-300">
                      Hanya pesanan kopi, teh, dan mocktail yang masuk ke layar barista (pesanan steak dan nasi goreng tidak masuk ke sini, melainkan ke dapur utama).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">2. Potong Otomatis Biji Kopi & Susu Cair</span>
                    <p className="text-slate-300">
                      Setiap 1 gelas Es Kopi Susu Aren memotong 18 gram bubuk espresso dan 150ml susu UHT di database gudang.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">3. Lapor Susu Rusak / Masam</span>
                    <p className="text-slate-300">
                      Jika kotak susu UHT basi saat dibuka, barista langsung mencatat "1 Liter Fresh Milk Masam/Basi" di tablet bar.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">4. Selesai Racik Minuman</span>
                    <p className="text-slate-300">
                      Barista menekan selesai, minuman siap diambil pramusaji untuk disajikan ke tamu sebelum makanan utama datang.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'gudang' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Warehouse className="w-5 h-5 text-blue-400" />
                    <span>Daftar Aksi Staff Gudang (Penerimaan Barang & Opname Fisik)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Penjaga gerbang bahan baku. Mengatur barang masuk (IN) dan memverifikasi sisa stok di rak.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">1. Cek Kualitas Barang Datang (QC)</span>
                    <p className="text-slate-300">
                      Saat truk pemasok datang, staff memeriksa suhu daging beku (harus &le; -18°C), kondisi karung beras tidak basah, dan sayur segar tidak layu. Jika cacat, langsung tolak di tempat.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">2. Input Penerimaan Barang (Goods In PO)</span>
                    <p className="text-slate-300">
                      Staff menimbang barang, lalu memasukkan nomor surat jalan, nomor batch/lot, dan tanggal kadaluarsa ke sistem RestoSync via tablet gudang. Saldo stok langsung bertambah saat itu juga.
                    </p>
                    <div className="text-[11px] text-blue-400 font-mono pt-1">
                      Menggunakan API: POST /api/v1/inventory/goods-in
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">3. Penataan Rak FEFO (Cepat Basi di Depan)</span>
                    <p className="text-slate-300">
                      Bahan dengan tanggal expired paling dekat ditaruh di rak baris paling depan agar diambil koki terlebih dahulu.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">4. Stock Opname Tutup Resto (Timbang Fisik)</span>
                    <p className="text-slate-300">
                      Saat resto tutup malam hari, staff menimbang fisik sisa beras dan menghitung tray telur. Hasilnya diinput ke form opname untuk dicek selisihnya dengan catatan sistem.
                    </p>
                    <div className="text-[11px] text-amber-400 font-mono pt-1">
                      Menggunakan API: POST /api/v1/inventory/stock-opname
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'manager' && (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-violet-400" />
                    <span>Daftar Aksi Manajer Resto & Pemilik (Owner)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mengontrol keuntungan, memantau kebocoran bahan, dan menyetujui pembelian ke supplier.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">1. Pantau Persentase Food Cost (HPP)</span>
                    <p className="text-slate-300">
                      Melihat perbandingan biaya bahan baku terhadap omset kasir secara real-time. Standar resto sehat biasanya 28% - 35%. Jika melonjak ke 45%, berarti ada pemborosan porsi di dapur.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">2. Setujui Pembelian Bahan (Approve PO)</span>
                    <p className="text-slate-300">
                      Ketika sistem otomatis membuatkan draft pesanan belanja karena stok telur mau habis, manajer tinggal menekan tombol "Approve PO" untuk dikirim ke WhatsApp supplier.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">3. Investigasi Selisih Opname (Audit Leakage)</span>
                    <p className="text-slate-300">
                      Jika hasil hitungan fisik staff gudang selisih &gt; 2% dibanding angka sistem kasir, manajer membuka laporan investigasi untuk memeriksa apakah ada salah takaran atau barang hilang.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="font-bold text-white block">4. Ubah Formulasi Resep (BOM Management)</span>
                    <p className="text-slate-300">
                      Jika resto ingin menaikkan ukuran porsi daging dari 80g menjadi 100g, manajer tinggal mengubahnya sekali di master recipe BOM, dan seluruh perhitungan stok ke depannya otomatis ikut berubah.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: BACKGROUND JOBS (BOT OTOMATIS) */}
      {activeSection === 'background_jobs' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>5 Background Job Otomatis yang "Ngecek dan Jalan Sendiri Tanpa Disuruh Manusia"</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Di sistem restoran pintar, banyak pekerjaan berjalan di latar belakang (server worker) secara otomatis berdasarkan waktu atau pemicu peristiwa (*event trigger*).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Bot Pengawas Batas Aman Stok (ROP Worker)</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Pemicu: Tiap kali ada order di kasir</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">AKTIF 24/7</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong>Apa yang Dicek:</strong> Setiap kali kasir menjual 1 porsi makanan, bot ini otomatis menghitung sisa stok fisik di gudang dan membandingkannya dengan <em>Reorder Point (Batas Pesan Ulang)</em>.
                </p>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <span className="font-semibold text-amber-300 block">Aksi yang Otomatis Dijalankan:</span>
                  <div>&bull; Jika Stok Telur &le; 40 butir: Bot langsung membunyikan lampu indikator merah di Dashboard.</div>
                  <div>&bull; Bot otomatis membuat draf Purchase Order (PO) pembelian 100 butir telur ke supplier langganan tanpa manajer harus ketik manual.</div>
                </div>
              </div>
            </div>

            {/* Job 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Bot Alarm Bahan Mendekati Basi (Expiry Guard)</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Pemicu: Cron Schedule Jam 06:00 Pagi</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">HARIAN</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong>Apa yang Dicek:</strong> Setiap jam 6 pagi sebelum resto buka, bot memeriksa kolom <em>expiry_date</em> pada semua lot batch bahan di chiller dan dry storage.
                </p>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <span className="font-semibold text-rose-300 block">Aksi yang Otomatis Dijalankan:</span>
                  <div>&bull; Jika ada susu atau daging yang expired dalam 2 hari ke depan: Bot mengirim pesan notifikasi ke tablet kepala koki: <em>"Gunakan Batch #2026-TLR-01 terlebih dahulu hari ini!"</em>.</div>
                  <div>&bull; Mencegah bahan terbuang sia-sia dan menekan angka kerugian resto hingga 40%.</div>
                </div>
              </div>
            </div>

            {/* Job 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Bot Kalkulator HPP & Food Cost Harian</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Pemicu: Tiap Transaksi Selesai & Tutup Kasir</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">REAL-TIME</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong>Apa yang Dicek:</strong> Mengkalkulasi formula keuangan restoran:
                </p>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                  Food Cost % = (Bahan Terpakai + Waste Dapur) / Omset Kasir &times; 100%
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <span className="font-semibold text-emerald-300 block">Aksi yang Otomatis Dijalankan:</span>
                  <div>&bull; Mengupdate grafik keuntungan kotor harian di dashboard owner tanpa perlu menunggu akuntan menghitung manual di akhir bulan.</div>
                </div>
              </div>
            </div>

            {/* Job 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    04
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Bot Penyelamat Kasir Offline (Sync Worker)</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Pemicu: Re-koneksi Internet Kasir</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold">OTOMATIS</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong>Apa yang Dicek:</strong> Ketika WiFi resto tiba-tiba putus, tablet kasir tetap bisa melayani tamu dan menyimpan data order secara lokal di memori tablet (IndexedDB).
                </p>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <span className="font-semibold text-purple-300 block">Aksi yang Otomatis Dijalankan:</span>
                  <div>&bull; Begitu WiFi menyala kembali, bot ini otomatis mengunggah antrean order offline ke server pusat secara berurutan.</div>
                  <div>&bull; Memakai <em>Idempotency-Key</em> sehingga tidak akan pernah memotong stok dua kali jika sinyal naik-turun.</div>
                </div>
              </div>
            </div>

            {/* Job 5 */}
            <div className="col-span-full bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    05
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Bot Detektif Kebocoran Bahan (Auto Variance Audit)</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Pemicu: Tiap Selesai Input Stock Opname Tutup Toko</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">AUDIT CERDAS</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong>Apa yang Dicek:</strong> Membandingkan <em>Stok Teoritis</em> (Stok Awal + Masuk Supplier - Terjual di Kasir - Rusak di Dapur) dengan <em>Stok Riil Fisik</em> yang baru saja ditimbang staf gudang.
                </p>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                  <span className="font-semibold text-cyan-300 block">Aksi yang Otomatis Dijalankan:</span>
                  <div>&bull; Jika beras seharusnya sisa 40kg tapi hasil timbangan cuma 37kg (selisih 3kg hilang tanpa catatan): Bot langsung menyorot baris merah dan menerbitkan notifikasi ke HP Owner: <em>"Peringatan Selisih Beras -3kg (Nilai Kerugian Rp 43.500)"</em>.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PEMETAAN AKSI KE API (BAHASA UMUM & SEDERHANA) */}
      {activeSection === 'api_mapping' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Daftar Aksi Restoran dan Pasangan API-nya (Mudah Dimengerti Programmer & Non-Programmer)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Setiap kali seseorang menekan tombol di layar kasir atau tablet koki, sistem memanggil API (jembatan komunikasi data). Berikut adalah daftarnya dalam bahasa sehari-hari:
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tindakan Nyata di Restoran</th>
                    <th className="py-3 px-3">Pelaku</th>
                    <th className="py-3 px-3">Nama API / Jalur Data</th>
                    <th className="py-3 px-3">Apa yang Terjadi di Database</th>
                    <th className="py-3 px-4">Hasil / Notifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-850/60">
                    <td className="py-3 px-4 font-semibold text-white">
                      Kasir proses bayar pesanan
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">Kasir POS</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 text-[11px]">
                      POST /api/v1/orders/checkout
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      Pecah resep BOM, potong stok beras/daging/telur secara atomik, simpan nota order.
                    </td>
                    <td className="py-3 px-4 text-emerald-400 text-[11px] font-medium">
                      Layar koki berbunyi, struk kasir tercetak.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850/60">
                    <td className="py-3 px-4 font-semibold text-white">
                      Tamu batal pesan sebelum dimasak
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold">Supervisor</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 text-[11px]">
                      POST /api/v1/orders/{'{id}'}/void
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      Batalkan status nota, kembalikan stok bahan mentah ke batch asalnya (Rollback).
                    </td>
                    <td className="py-3 px-4 text-amber-400 text-[11px] font-medium">
                      Stok kembali utuh, tiket di dapur dibatalkan.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850/60">
                    <td className="py-3 px-4 font-semibold text-white">
                      Koki lapor steak gosong / telur retak
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold">Koki Dapur</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 text-[11px]">
                      POST /api/v1/kitchen/waste
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      Potong stok fisik bahan dan bukukan nilai kerugian finansial ke buku besar.
                    </td>
                    <td className="py-3 px-4 text-rose-400 text-[11px] font-medium">
                      Kerugian tercatat, stok rak tetap akurat.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850/60">
                    <td className="py-3 px-4 font-semibold text-white">
                      Koki tekan pesanan matang & siap saji
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold">Koki Dapur</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 text-[11px]">
                      PATCH /api/v1/kitchen/tickets/{'{id}'}/status
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      Ubah status tiket dari COOKING jadi READY, catat waktu durasi memasak.
                    </td>
                    <td className="py-3 px-4 text-emerald-400 text-[11px] font-medium">
                      Layar pramusaji bergetar untuk ambil makanan.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850/60">
                    <td className="py-3 px-4 font-semibold text-white">
                      Truk supplier tiba bawa bahan baru
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">Staff Gudang</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 text-[11px]">
                      POST /api/v1/inventory/goods-in
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      Daftarkan nomor lot batch baru, simpan tanggal expired, tambah stok dan hitung harga rata-rata.
                    </td>
                    <td className="py-3 px-4 text-blue-400 text-[11px] font-medium">
                      Saldo gudang bertambah seketika.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850/60">
                    <td className="py-3 px-4 font-semibold text-white">
                      Hitung fisik tutup toko (Stock Opname)
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">Staff Gudang</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 text-[11px]">
                      POST /api/v1/inventory/stock-opname
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      Hitung selisih fisik vs sistem, update saldo dan catat mutasi ADJUSTMENT_OPNAME.
                    </td>
                    <td className="py-3 px-4 text-amber-400 text-[11px] font-medium">
                      Laporan audit varians diterbitkan ke owner.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850/60">
                    <td className="py-3 px-4 font-semibold text-white">
                      Layar dapur, gudang, dashboard kedip update
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold">Sistem (WS)</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-purple-400 text-[11px]">
                      WS /ws/inventory-stream
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      Tidak query ulang, data mutasi dipancarkan via Redis Pub/Sub ke semua browser.
                    </td>
                    <td className="py-3 px-4 text-purple-400 text-[11px] font-medium">
                      Update instan tanpa perlu reload halaman (&lt;150ms).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SIKLUS HIDUP BAHAN BAKU */}
      {activeSection === 'lifecycle' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-400" />
              <span>Contoh Nyata: Perjalanan 1 Butir Telur Ayam Omega dari Truk Sampai Meja Tamu</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Untuk memahami bagaimana integrasi ini bekerja secara utuh, mari kita ikuti perjalanan 1 butir telur di restoran:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-mono text-xs font-bold text-amber-400">FASE 1</span>
              <h4 className="text-xs font-bold text-white">Tiba di Gudang</h4>
              <p className="text-[11px] text-slate-300">
                Supplier kirim 100 butir telur. Staff cek tidak ada yang pecah, lalu input form Goods In dengan Expired Date 28 Oktober 2026.
              </p>
              <span className="text-[10px] font-mono text-blue-400 block pt-1">Stok Sistem: +100 Butir</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-mono text-xs font-bold text-amber-400">FASE 2</span>
              <h4 className="text-xs font-bold text-white">Disimpan di Chiller</h4>
              <p className="text-[11px] text-slate-300">
                Telur ditaruh di rak chiller suhu 4°C dengan prinsip FEFO (telur lama di depan, telur baru di belakang).
              </p>
              <span className="text-[10px] font-mono text-slate-400 block pt-1">Status: Ready Stock</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-mono text-xs font-bold text-amber-400">FASE 3</span>
              <h4 className="text-xs font-bold text-white">Tamu Pesan Nasgor</h4>
              <p className="text-[11px] text-slate-300">
                Tamu meja 5 pesan Nasi Goreng Spesial di kasir. Resep BOM sistem langsung memotong 1 butir telur secara otomatis.
              </p>
              <span className="text-[10px] font-mono text-rose-400 block pt-1">Stok Sistem: -1 Butir (OUT_SALE)</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-mono text-xs font-bold text-amber-400">FASE 4</span>
              <h4 className="text-xs font-bold text-white">Dimasak di Wajan</h4>
              <p className="text-[11px] text-slate-300">
                Koki ambil telur dari chiller depan, goreng jadi telur ceplok setengah matang sesuai catatan tiket KDS.
              </p>
              <span className="text-[10px] font-mono text-emerald-400 block pt-1">Status: Cooking &rarr; Ready</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-mono text-xs font-bold text-amber-400">FASE 5</span>
              <h4 className="text-xs font-bold text-white">Audit Malam Hari</h4>
              <p className="text-[11px] text-slate-300">
                Saat tutup toko, sisa telur dihitung fisik. Jumlah di tray cocok 100% dengan angka saldo di dashboard owner.
              </p>
              <span className="text-[10px] font-mono text-emerald-400 block pt-1">Varians: 0 (Nir-Selisih)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
