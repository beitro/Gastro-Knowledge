import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Printer,
  Wifi,
  Server,
  ShieldCheck,
  ShoppingBag,
  DollarSign,
  RotateCcw,
  Maximize2,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  Lock
} from 'lucide-react';
import { SystemCaptureDataUrls } from '../utils/brdCaptureGenerator';

interface OpsDocumentSectionProps {
  restaurantName: string;
  clientPicName: string;
  formMode: 'fill' | 'blank';
  captureUrls: SystemCaptureDataUrls | null;
  onZoomImage: (image: { title: string; subtitle: string; url: string }) => void;
}

export const OpsDocumentSection: React.FC<OpsDocumentSectionProps> = ({
  restaurantName,
  clientPicName,
  formMode,
  captureUrls,
  onZoomImage
}) => {
  const [selectedErrorCode, setSelectedErrorCode] = useState<string>('ERR_PRINTER_OFFLINE');

  const troubleshootingDatabase: Record<string, { title: string; symptom: string; causes: string[]; steps: string[]; priority: string }> = {
    ERR_PRINTER_OFFLINE: {
      title: 'ERR_PRINTER_OFFLINE (Printer Tiket Dapur / Kasir Tidak Merespons)',
      symptom: 'Pesanan tidak keluar di printer dapur, lampu error merah berkedip atau berbunyi bip.',
      causes: [
        'Kertas termal 80mm habis atau macet (paper jam).',
        'Kabel LAN RJ45 lepas atau switch hub mati.',
        'Alamat IP printer bentrok atau berubah karena DHCP.'
      ],
      steps: [
        '1. Buka tutup printer dan pastikan gulungan kertas termal masih ada dan terpasang benar (sisi licin menghadap bawah).',
        '2. Cek konektor LAN di belakang printer: lampu hijau/oranye harus menyala berkedip.',
        '3. Matikan printer, tekan tahan tombol FEED sambil nyalakan power untuk self-test. Pastikan IP statis tercetak 192.168.10.201.',
        '4. Buka menu POS Kasir -> Pengaturan Printer -> klik "Test Print LAN".'
      ],
      priority: 'CRITICAL (Dapur butuh tiket pesanan)'
    },
    ERR_STOCK_DEFICIT: {
      title: 'ERR_STOCK_DEFICIT (Saldo Bahan Baku Kurang Saat Checkout)',
      symptom: 'Muncul popup merah saat kasir menekan tombol bayar: "Bahan Baku Tidak Cukup".',
      causes: [
        'Stok fisik di dapur sudah habis atau belum dilakukan input penerimaan barang PO di gudang.',
        'Ada pencatatan waste/spoilage yang melebihi estimasi.'
      ],
      steps: [
        '1. Lihat daftar bahan defisit di popup (misal: Fillet Ayam kurang 0.3 kg).',
        '2. Jika bahan fisik di dapur sebenarnya masih ada: Minta Store Manager input penerimaan darurat di modul Gudang.',
        '3. Jika fisik memang habis: Ubah status menu tersebut menjadi "Sold Out" agar waiter tidak menerima pesanan lagi.'
      ],
      priority: 'HIGH (Mencegah overselling)'
    },
    ERR_SYNC_CONFLICT: {
      title: 'ERR_SYNC_CONFLICT (Bentrok Sinkronisasi Offline & Cloud)',
      symptom: 'Notifikasi kuning: "Transaksi offline terdeteksi bentrok dengan database pusat".',
      causes: [
        'Kasir beroperasi offline selama internet padam, jam tablet tidak sinkron dengan waktu internet.'
      ],
      steps: [
        '1. Jangan hapus cache browser atau uninstall aplikasi kasir.',
        '2. Sambungkan kembali Wi-Fi kasir ke internet.',
        '3. Buka menu Pengaturan -> Status Sinkronisasi -> klik "Verifikasi UUID & Jam Sistem". Sistem akan menggabungkan data via CRDT atomik.'
      ],
      priority: 'MEDIUM (Data aman di SQLite lokal)'
    },
    ERR_PAYMENT_TIMEOUT: {
      title: 'ERR_PAYMENT_TIMEOUT (Waktu Tunggu QRIS / EDC Habis)',
      symptom: 'Tamu sudah scan QRIS tetapi status di layar kasir tetap "Menunggu Pembayaran".',
      causes: [
        'Koneksi bank lambat mengirim webhook callback ke server POS.',
        'Tamu scan QRIS namun transaksi pending di rekening tamu.'
      ],
      steps: [
        '1. Tekan tombol "Cek Status Settlement QRIS" di bawah tombol pembayaran.',
        '2. Jika tetap pending: Minta tamu menunjukkan bukti mutasi rekening m-banking.',
        '3. Jika mutasi berhasil: Supervisor memasukkan nomor Ref-ID bank ke kolom "Override Otorisasi Manual" untuk mencetak struk.'
      ],
      priority: 'HIGH (Kepuasan tamu & kas)'
    }
  };

  const currentTrouble = troubleshootingDatabase[selectedErrorCode];

  return (
    <div className="space-y-6">
      {/* 1. OPERATIONS & MANUAL OVERVIEW */}
      <div id="ops-manual" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Tahap 4: Dokumen Operasional &amp; Panduan Pengguna
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Buku Panduan Pengguna (User Manual) &amp; SOP Deployment
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">OPS-SOP-GASTROSTOCK-V2.0</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Dokumen ini menjadi pegangan wajib bagi manajemen restoran, kasir, tim dapur, dan teknisi support lapangan dalam mengoperasikan sistem harian, menginstal hardware restoran baru, serta menyelesaikan kendala error code secara mandiri dalam waktu &lt; 2 menit.
        </p>

        {/* 4 Pillars of Daily Restaurant Ops */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              1. Buka Shift &amp; Float
            </span>
            <p className="text-slate-600">Hitung modal receh laci kasir dan cetak slip shift dibuka.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-600" />
              2. Open Bill Meja
            </span>
            <p className="text-slate-600">Alokasi meja, input pesanan, dan kirim tiket ke printer dapur.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              3. Split Bill &amp; Void
            </span>
            <p className="text-slate-600">Pisah bon multi-tamu dan pembatalan menu dengan PIN supervisor.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              4. Closing Z-Report
            </span>
            <p className="text-slate-600">Hitung kas fisik akhir shift dan cetak laporan penutupan resmi.</p>
          </div>
        </div>
      </div>

      {/* 2. STEP-BY-STEP USER MANUAL */}
      <div id="ops-order" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            U1
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Panduan Langkah Demi Langkah Operasional Kasir (Step-by-Step)
            </h3>
            <span className="text-xs text-slate-500">Alur Buka Shift, Transaksi, Split Bill &amp; Tutup Kasir</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">1</span>
                Cara Buka Shift Kasir &amp; Uang Modal Awal (Open Float)
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Awal Shift</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Nyalakan layar POS Touchscreen dan masukkan 4-digit PIN kasir.<br />
              2. Pada popup "Buka Shift Baru", hitung uang receh fisik di dalam laci kasir (misal: Rp 300.000).<br />
              3. Masukkan nominal uang modal lalu klik <strong>"Konfirmasi Buka Shift"</strong>. Printer kasir akan mencetak slip pembukaan shift dengan jam dan nama kasir tercatat.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">2</span>
                Cara Buka Meja, Input Pesanan &amp; Kirim ke Dapur
              </span>
              <span className="text-[10px] font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-full">Order Taking</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Sentuh nomor meja tamu pada denah visual meja (misal: Meja 05). Status berubah dari hijau menjadi merah.<br />
              2. Masukkan jumlah pax tamu.<br />
              3. Sentuh menu makanan/minuman yang dipesan. Tambahkan catatan jika ada modifier (misal: Level Pedas 3, Es Sedikit).<br />
              4. Sentuh tombol hijau besar <strong>"Kirim Pesanan ke Dapur"</strong>. Tiket pesanan akan tercetak di printer dapur dalam waktu &lt; 1.5 detik.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">3</span>
                Cara Pembayaran &amp; Split Bill (Pisah Tagihan)
              </span>
              <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">Checkout</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Buka meja tamu yang ingin membayar, tekan tombol <strong>"Bayar / Checkout"</strong>.<br />
              2. Jika tamu meminta pisah tagihan: klik tombol <strong>"Split Bill"</strong>. Anda dapat memilih (A) Split Rata (misal tagihan Rp 200rb dibagi 4 orang = @Rp 50rb) atau (B) Split per Item Menu.<br />
              3. Pilih metode pembayaran: Tunai (klik pecahan cepat), QRIS (tampilkan QR dinamis di layar), atau Mesin EDC (gesek kartu debit/kredit).<br />
              4. Setelah pembayaran lunas, laci kasir terbuka otomatis dan struk belanja tercetak.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">4</span>
                Cara Void Pembatalan Menu &amp; Diskon Otorisasi
              </span>
              <span className="text-[10px] font-mono text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full">Otorisasi</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Kasir memilih item yang ingin dibatalkan, lalu tekan tombol merah <strong>"Batalkan / Void"</strong>.<br />
              2. Pilih alasan pembatalan (misal: Tamu salah pesan, Dapur gosong, Tamu buru-buru pulang).<br />
              3. Store Manager memasukkan 4-digit PIN otorisasi supervisor. Sistem mencatat log audit dan mengembalikan saldo stok bahan baku secara otomatis.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">5</span>
                Cara Tutup Kasir / Closing Shift Harian (Cetak Z-Report)
              </span>
              <span className="text-[10px] font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">End of Shift</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Pastikan seluruh meja sudah berstatus kosong (tidak ada bill gantung).<br />
              2. Lakukan perhitungan fisik uang tunai di laci (Blind Count). Masukkan jumlah uang tunai ke menu <strong>"Tutup Kasir / End Shift"</strong>.<br />
              3. Klik <strong>"Cetak Laporan Z-Report &amp; Tutup Kasir"</strong>. Sistem mencetak rekapitulasi: Total Omset, Penjualan QRIS/EDC, Modal Awal, dan Selisih Uang Fisik (Over/Short).
            </p>
          </div>
        </div>
      </div>

      {/* 3. SOP DEPLOYMENT & STATIC IP SCHEME */}
      <div id="ops-sop" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            S1
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              SOP Deployment &amp; Skema Alamat IP Hardware Restoran
            </h3>
            <span className="text-xs text-slate-500">Panduan Instalasi POS, Tablet KDS &amp; Printer LAN Epson</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/[0.06] bg-slate-50">
                <th className="p-2.5 font-bold text-slate-900">PERANGKAT HARDWARE</th>
                <th className="p-2.5 font-bold text-slate-900">ALAMAT IP STATIS</th>
                <th className="p-2.5 font-bold text-slate-900">SUBNET &amp; GATEWAY</th>
                <th className="p-2.5 font-bold text-slate-900">PORT &amp; PROTOKOL</th>
                <th className="p-2.5 font-bold text-slate-900">STANDAR PEMASANGAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              <tr>
                <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                  Master POS Kasir 1
                </td>
                <td className="p-2.5 font-mono text-cyan-700 font-bold">192.168.10.50</td>
                <td className="p-2.5 font-mono text-slate-600">255.255.255.0 / .1</td>
                <td className="p-2.5 font-mono text-slate-600">Port 3000 (HTTP)</td>
                <td className="p-2.5 text-slate-600">Wajib terhubung UPS 600VA &amp; kabel LAN terisolasi.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-amber-600" />
                  Printer Tiket Dapur LAN
                </td>
                <td className="p-2.5 font-mono text-amber-700 font-bold">192.168.10.201</td>
                <td className="p-2.5 font-mono text-slate-600">255.255.255.0 / .1</td>
                <td className="p-2.5 font-mono text-slate-600">Port 9100 (RAW)</td>
                <td className="p-2.5 text-slate-600">Epson TM-T82X LAN, kabel Cat6 conduit pelindung tikus/minyak.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-purple-600" />
                  Printer Tiket Bar Minuman
                </td>
                <td className="p-2.5 font-mono text-purple-700 font-bold">192.168.10.202</td>
                <td className="p-2.5 font-mono text-slate-600">255.255.255.0 / .1</td>
                <td className="p-2.5 font-mono text-slate-600">Port 9100 (RAW)</td>
                <td className="p-2.5 text-slate-600">Cetak otomatis untuk minuman dingin, es &amp; dessert.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  Kitchen Display Tablet (KDS)
                </td>
                <td className="p-2.5 font-mono text-emerald-700 font-bold">192.168.10.150</td>
                <td className="p-2.5 font-mono text-slate-600">255.255.255.0 / .1</td>
                <td className="p-2.5 font-mono text-slate-600">Port 8080 (WSS)</td>
                <td className="p-2.5 text-slate-600">Tablet Android 10" wall-mount dengan speaker alert audio.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. INTERACTIVE TROUBLESHOOTING MATRIX & QUICK FIX */}
      <div id="ops-trouble" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              T1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Matriks Troubleshooting &amp; Kode Error (Quick Fix &lt; 2 Menit)
              </h3>
              <span className="text-xs text-slate-500">Solusi Mandiri Saat Terjadi Kendala Operasional di Restoran</span>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Emergency Guide
          </span>
        </div>

        {/* Error Code Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(troubleshootingDatabase).map((code) => (
            <button
              key={code}
              onClick={() => setSelectedErrorCode(code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedErrorCode === code
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        {/* Selected Error Code Details Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-black/[0.05] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.05] pb-3">
            <div>
              <h4 className="font-bold text-sm text-slate-900">{currentTrouble.title}</h4>
              <p className="text-xs text-rose-600 font-medium mt-0.5">{currentTrouble.symptom}</p>
            </div>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 self-start sm:self-auto">
              {currentTrouble.priority}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 block">Kemungkinan Penyebab:</span>
              <ul className="space-y-1 text-slate-600">
                {currentTrouble.causes.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-slate-800 block">Langkah Perbaikan Cepat (Quick Fix):</span>
              <div className="space-y-1.5 text-slate-700 font-medium bg-white p-3 rounded-xl border border-black/[0.05]">
                {currentTrouble.steps.map((s, i) => (
                  <p key={i} className="leading-relaxed">{s}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRAINING SIGN-OFF & HANDOVER */}
      <div id="ops-signoff" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Berita Acara Serah Terima Panduan &amp; Training Pengguna</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Dokumen ini menjadi bukti bahwa buku panduan operasional kasir, SOP deployment hardware, dan pelatihan penanganan error telah diserahterimakan dan dipahami oleh seluruh staf restoran.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
            <span className="font-bold text-slate-900 block">DITERIMA OLEH RESTORAN</span>
            <p className="text-slate-600 text-[11px]">Restoran: {restaurantName || '[ ____________________ ]'}</p>
            <p className="text-slate-600 text-[11px]">Nama Staf/Penerima: {clientPicName || '[ ____________________ ]'}</p>
            <p className="text-slate-600 text-[11px]">Jabatan: Store Manager / Head Cashier</p>
            <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
              <span className="text-[10px] text-slate-400">Tanda Tangan &amp; Cap Outlet</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
            <span className="font-bold text-slate-900 block">DISERAHKAN OLEH RESTOSYNC</span>
            <p className="text-slate-600 text-[11px]">Instruktur Training: Implementation Team</p>
            <p className="text-slate-600 text-[11px]">Status: TRAINING COMPLETED</p>
            <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
              <span className="text-[10px] text-slate-400">Tanda Tangan Trainer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
