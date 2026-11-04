import React, { useState } from 'react';
import {
  FileText,
  Target,
  Users,
  Compass,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  Smartphone,
  ChefHat,
  ShoppingBag,
  Store,
  DollarSign,
  Maximize2
} from 'lucide-react';
import { SystemCaptureDataUrls } from '../utils/brdCaptureGenerator';

interface PrdDocumentSectionProps {
  restaurantName: string;
  clientPicName: string;
  targetGoLiveDate: string;
  formMode: 'fill' | 'blank';
  captureUrls: SystemCaptureDataUrls | null;
  onZoomImage: (image: { title: string; subtitle: string; url: string }) => void;
}

export const PrdDocumentSection: React.FC<PrdDocumentSectionProps> = ({
  restaurantName,
  clientPicName,
  targetGoLiveDate,
  formMode,
  captureUrls,
  onZoomImage
}) => {
  // Interactive Survey Form State
  const [surveyAnswers, setSurveyAnswers] = useState({
    avgWeekdayReceipts: '120',
    avgWeekendReceipts: '280',
    primaryBottleneck: 'kasir',
    internetSpeed: '50 Mbps (Biznet Dedicated)',
    hasDedicatedPosWifi: true,
    estimatedCashVariance: 'Rp 15.000',
    hasStandardRecipes: 'sebagian'
  });

  // Interactive SUS (System Usability Scale) Scores
  const [susScores, setSusScores] = useState<Record<number, number>>({
    1: 5,
    2: 5,
    3: 4,
    4: 5,
    5: 5
  });

  const handleSusChange = (questionId: number, score: number) => {
    setSusScores(prev => ({ ...prev, [questionId]: score }));
  };

  const calculatedSusAvg = (
    Object.values(susScores).reduce((a, b) => a + b, 0) / Object.keys(susScores).length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* 1. PRD COVER & SCOPE CREEP GUARD */}
      <div id="prd-cover" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Tahap 1: Dokumen Perencanaan Produk
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Product Requirements Document (PRD) — MVP Scope Guard
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">PRD-GASTROSTOCK-MVP-V1.0</span>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 space-y-2">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Fungsi Dokumen: Pelindung dari Scope Creep (Pembengkakan Fitur)</span>
          </div>
          <p className="text-xs text-indigo-950/80 leading-relaxed">
            Dokumen ini dibuat oleh Product Manager / System Analyst bersama pemilik restoran guna menentukan batas tegas fitur Minimum Viable Product (MVP). Fitur di luar dokumen ini tidak akan dikerjakan pada rilis pertama agar sistem dapat go-live tepat waktu dan minim bug.
          </p>
        </div>

        {/* Vision & Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              Kecepatan Checkout
            </span>
            <p className="text-slate-600">&lt; 15 detik per transaksi tamu saat jam sibuk (peak hours).</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Target Food Cost (HPP)
            </span>
            <p className="text-slate-600">Tekan kebocoran bahan baku dari 6% menjadi &lt; 1.2% via Recipe BOM.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              Rekonsiliasi Kasir
            </span>
            <p className="text-slate-600">Closing shift harian akurat tanpa selisih, selesai dalam &lt; 10 menit.</p>
          </div>
        </div>
      </div>

      {/* 2. MATRIKS FITUR UTAMA MVP */}
      <div id="prd-matrix" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              P1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Matriks Ruang Lingkup Fitur MVP (Minimum Viable Product)
              </h3>
              <span className="text-xs text-slate-500">Spesifikasi 5 Fitur Inti Wajib Rilis Pertama</span>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Locked Scope
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/[0.06] bg-slate-50">
                <th className="p-2.5 font-bold text-slate-900">MODUL FITUR</th>
                <th className="p-2.5 font-bold text-slate-900">BATASAN FUNGSIONAL MVP</th>
                <th className="p-2.5 font-bold text-slate-900">FASE RILIS</th>
                <th className="p-2.5 font-bold text-slate-900">PRIORITAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              <tr>
                <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-indigo-600" />
                  Manajemen Meja (Table Map)
                </td>
                <td className="p-2.5 text-slate-600">
                  Denah visual interaktif meja restoran, indikator status warna (Hijau: Kosong, Merah: Terisi, Kuning: Minta Tagihan), alokasi nomor meja dan jumlah pax tamu.
                </td>
                <td className="p-2.5 font-mono text-emerald-700 font-bold">MVP v1.0</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">P0 (Must Have)</span></td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-cyan-600" />
                  Kasir POS &amp; Split Bill
                </td>
                <td className="p-2.5 text-slate-600">
                  Grid katalog menu cepat, varian &amp; modifier (pedas, less ice), diskon promosi per-item / per-bill, 1-klik Split Bill multi-tamu, multi-payment (Cash, QRIS Dinamis, Kartu EDC).
                </td>
                <td className="p-2.5 font-mono text-emerald-700 font-bold">MVP v1.0</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">P0 (Must Have)</span></td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                  Cetak Struk &amp; Tiket Dapur
                </td>
                <td className="p-2.5 text-slate-600">
                  Auto-routing tiket pesanan ke printer thermal dapur (LAN) dan printer kasir 80mm ESC/POS secara terpisah berdasarkan kategori makanan dan minuman.
                </td>
                <td className="p-2.5 font-mono text-emerald-700 font-bold">MVP v1.0</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">P0 (Must Have)</span></td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-teal-600" />
                  Deduksi Stok Resep (BOM)
                </td>
                <td className="p-2.5 text-slate-600">
                  Pengurangan saldo bahan mentah (ayam, beras, minyak) secara otomatis dan real-time saat transaksi berhasil dengan proteksi anti-minus stok.
                </td>
                <td className="p-2.5 font-mono text-emerald-700 font-bold">MVP v1.0</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">P0 (Must Have)</span></td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Laporan Closing (Z-Report)
                </td>
                <td className="p-2.5 text-slate-600">
                  Rekonsiliasi uang fisik laci kasir terhadap total penjualan sistem, cetak laporan Z-Report resmi, dan deteksi selisih kas fisik secara transparan.
                </td>
                <td className="p-2.5 font-mono text-emerald-700 font-bold">MVP v1.0</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">P0 (Must Have)</span></td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Kitchen Display (KDS) Digital</td>
                <td className="p-2.5 text-slate-500">Layar tablet KDS dengan SLA timer otomatis dan bump bar pesanan.</td>
                <td className="p-2.5 font-mono text-slate-500">Fase 2</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">P1 (Next)</span></td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Sensor Suhu Chiller HACCP</td>
                <td className="p-2.5 text-slate-500">Integrasi sensor IoT suhu pendingin daging &amp; batch FEFO kadaluarsa.</td>
                <td className="p-2.5 font-mono text-slate-500">Fase 3</td>
                <td className="p-2.5"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">P2 (Roadmap)</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Embedded POS Preview Banner */}
        {captureUrls?.pos && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-bold text-slate-700">Lampiran UI/UX MVP: Antarmuka Kasir Touchscreen GastroStock</span>
              <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                1200x700 HD Capture
              </span>
            </div>
            <div 
              onClick={() => onZoomImage({ title: 'Antarmuka POS Kasir MVP', subtitle: 'Desain Ergonomis Touchscreen 48px', url: captureUrls.pos })}
              className="relative rounded-2xl overflow-hidden border border-black/[0.08] shadow-sm cursor-zoom-in group bg-slate-950"
            >
              <img src={captureUrls.pos} alt="POS Interface Preview" className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                <Maximize2 className="w-4 h-4" />
                <span>Klik untuk Zoom Layar Penuh</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. USER PERSONAS (PROFIL PENGGUNA SISTEM) */}
      <div id="prd-persona" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            P2
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Analisis Profil Pengguna (User Personas)
            </h3>
            <span className="text-xs text-slate-500">5 Aktor Utama Lapangan: Kasir, Waiter, Kitchen, Manager &amp; Owner</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Persona 1: Kasir */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.05] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs">
                K1
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Siti Aminah (23 thn)</h4>
                <span className="text-[10px] text-cyan-700 font-semibold">Kasir Utama Restoran</span>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <p><strong>Goals:</strong> Checkout kilat, laci uang cocok saat closing.</p>
              <p><strong>Pain Points:</strong> Tamu minta split bill ribet, salah hitung kembalian, panik bila internet mati.</p>
              <p className="text-emerald-700 font-semibold"><strong>Solusi:</strong> 1-klik Split Bill, tombol uang pecahan cepat, mode offline stabil.</p>
            </div>
          </div>

          {/* Persona 2: Waiter */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.05] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                W2
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Budi Santoso (21 thn)</h4>
                <span className="text-[10px] text-amber-700 font-semibold">Pramusaji / Waiter Lantai</span>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <p><strong>Goals:</strong> Catat pesanan meja cepat, pesanan langsung sampai ke dapur.</p>
              <p><strong>Pain Points:</strong> Kertas nota basah, menu habis baru ketahuan setelah tamu memesan.</p>
              <p className="text-emerald-700 font-semibold"><strong>Solusi:</strong> Indikator "Sold Out" otomatis langsung di tablet waiter.</p>
            </div>
          </div>

          {/* Persona 3: Head Chef */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.05] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
                C3
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Chef Wayan (38 thn)</h4>
                <span className="text-[10px] text-rose-700 font-semibold">Head Chef &amp; Kitchen Lead</span>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <p><strong>Goals:</strong> Kecepatan saji &lt; 15 menit, mutu rasa seragam, stok bahan aman.</p>
              <p><strong>Pain Points:</strong> Tiket kertas hilang/kotor minyak, urutan masak tidak FIFO.</p>
              <p className="text-emerald-700 font-semibold"><strong>Solusi:</strong> Tiket dapur teratur via printer LAN &amp; KDS alert audio berkedip.</p>
            </div>
          </div>

          {/* Persona 4: Store Manager */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.05] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                M4
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Doni Prasetyo (32 thn)</h4>
                <span className="text-[10px] text-purple-700 font-semibold">Store Operational Manager</span>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <p><strong>Goals:</strong> Operasional lancar, cegah kecurangan kasir, audit shift cepat.</p>
              <p><strong>Pain Points:</strong> Bolak-balik ke kasir untuk swipe kartu void, audit stok manual larut malam.</p>
              <p className="text-emerald-700 font-semibold"><strong>Solusi:</strong> Otorisasi PIN supervisor berjenjang dan laporan Z-Report otomatis.</p>
            </div>
          </div>

          {/* Persona 5: Owner Restoran */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.05] space-y-3 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                O5
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Hendra Wijaya (45 thn)</h4>
                <span className="text-[10px] text-emerald-700 font-semibold">Pemilik / Investor Multi-Cabang</span>
              </div>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <p><strong>Goals:</strong> Pantau laba kotor &amp; omset live di ponsel, tekan kebocoran bahan, scale-up cabang baru.</p>
              <p><strong>Pain Points:</strong> Laporan bulanan lambat datang 3 hari setelah tutup buku, tidak tahu cabang mana yang boros bahan baku.</p>
              <p className="text-emerald-700 font-semibold"><strong>Solusi:</strong> Executive BI Dashboard mobile dengan alert Food Cost % real-time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. USER JOURNEY MAP (END-TO-END TOUCHPOINTS) */}
      <div id="prd-journey" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            P3
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Peta Perjalanan Pengguna (User Journey Map)
            </h3>
            <span className="text-xs text-slate-500">Alur End-to-End dari Kedatangan Tamu hingga Tutup Kasir</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2 relative">
            <span className="text-[10px] font-mono font-bold text-slate-400">FASE 01</span>
            <h4 className="font-bold text-slate-900">1. Tamu Masuk &amp; Buka Meja</h4>
            <p className="text-[11px] text-slate-600">Pramusaji memilih meja kosong di denah POS. Status berubah menjadi merah (Terisi) &amp; catat pax.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2 relative">
            <span className="text-[10px] font-mono font-bold text-cyan-600">FASE 02</span>
            <h4 className="font-bold text-slate-900">2. Pesan &amp; Cek Stok BOM</h4>
            <p className="text-[11px] text-slate-600">Input menu + modifier. Engine otomatis memeriksa saldo bahan baku di gudang.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2 relative">
            <span className="text-[10px] font-mono font-bold text-amber-600">FASE 03</span>
            <h4 className="font-bold text-slate-900">3. Tiket Dapur &amp; Masak</h4>
            <p className="text-[11px] text-slate-600">Tiket terkirim instan &lt; 1.5 detik ke dapur. SLA timer berjalan di KDS.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2 relative">
            <span className="text-[10px] font-mono font-bold text-emerald-600">FASE 04</span>
            <h4 className="font-bold text-slate-900">4. Pembayaran &amp; Struk</h4>
            <p className="text-[11px] text-slate-600">Kasir memproses tagihan (Tunai/QRIS/EDC), laci terbuka otomatis, cetak struk.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2 relative">
            <span className="text-[10px] font-mono font-bold text-purple-600">FASE 05</span>
            <h4 className="font-bold text-slate-900">5. Tutup Kasir (Z-Report)</h4>
            <p className="text-[11px] text-slate-600">Kasir hitung uang fisik laci, cetak Z-Report, dan rekonsiliasi bebas selisih.</p>
          </div>
        </div>
      </div>

      {/* 5. INSTRUMEN SURVEI RESTORAN & STANDAR KEPUASAN SUS */}
      <div id="prd-survey" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              P4
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Instrumen Kuesioner Survei Restoran &amp; Standar Evaluasi SUS
              </h3>
              <span className="text-xs text-slate-500">Kuesioner Diagnostik Pre-Deployment &amp; Evaluasi Usability ISO 9241</span>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            Survey Tool
          </span>
        </div>

        {/* Section A: Diagnostik Pre-Implementation Survey */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-teal-600" />
            <span>Bagian A: Kuesioner Survei Kesiapan Outlet (Pre-Implementation)</span>
          </h4>
          <p className="text-xs text-slate-600">
            Kuesioner wajib bagi PIC / Store Manager untuk memetakan volume dan kondisi fisik restoran:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
              <label className="font-bold text-slate-800 block">Q1. Rata-Rata Transaksi (Struk / Hari):</label>
              {formMode === 'fill' ? (
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Weekday:</span>
                    <input
                      type="text"
                      value={surveyAnswers.avgWeekdayReceipts}
                      onChange={(e) => setSurveyAnswers({...surveyAnswers, avgWeekdayReceipts: e.target.value})}
                      className="w-full bg-white border border-black/[0.08] rounded-xl px-2.5 py-1 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Weekend:</span>
                    <input
                      type="text"
                      value={surveyAnswers.avgWeekendReceipts}
                      onChange={(e) => setSurveyAnswers({...surveyAnswers, avgWeekendReceipts: e.target.value})}
                      className="w-full bg-white border border-black/[0.08] rounded-xl px-2.5 py-1 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              ) : (
                <span className="font-mono text-slate-500 block pt-1">Weekday: [ _____ ] | Weekend: [ _____ ]</span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
              <label className="font-bold text-slate-800 block">Q2. Titik Antrean / Bottleneck Terberat:</label>
              {formMode === 'fill' ? (
                <select
                  value={surveyAnswers.primaryBottleneck}
                  onChange={(e) => setSurveyAnswers({...surveyAnswers, primaryBottleneck: e.target.value})}
                  className="w-full mt-1 bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium"
                >
                  <option value="kasir">Antrean Kasir Pembayaran (Checkout lambat)</option>
                  <option value="dapur">Dapur Memasak Lama (Kertas pesanan menumpuk)</option>
                  <option value="waiter">Waiter Lambat Mencatat Order Tamu</option>
                  <option value="salah_antar">Sering Terjadi Salah Antar Menu ke Meja Tamu</option>
                </select>
              ) : (
                <span className="font-mono text-slate-500 block pt-1">[  ] Kasir   [  ] Dapur   [  ] Waiter   [  ] Salah Meja</span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
              <label className="font-bold text-slate-800 block">Q3. Koneksi Internet &amp; Wi-Fi Khusus POS:</label>
              {formMode === 'fill' ? (
                <input
                  type="text"
                  value={surveyAnswers.internetSpeed}
                  onChange={(e) => setSurveyAnswers({...surveyAnswers, internetSpeed: e.target.value})}
                  className="w-full mt-1 bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs font-medium"
                />
              ) : (
                <span className="font-mono text-slate-500 block pt-1">Provider: [ ____________________ ] Speed: [ _____ Mbps ]</span>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
              <label className="font-bold text-slate-800 block">Q4. Estimasi Selisih Uang Kasir per Shift:</label>
              {formMode === 'fill' ? (
                <input
                  type="text"
                  value={surveyAnswers.estimatedCashVariance}
                  onChange={(e) => setSurveyAnswers({...surveyAnswers, estimatedCashVariance: e.target.value})}
                  className="w-full mt-1 bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 text-xs font-mono font-bold"
                />
              ) : (
                <span className="font-mono text-slate-500 block pt-1">Rp [ ____________________ ] / shift</span>
              )}
            </div>
          </div>
        </div>

        {/* Section B: Standar Kuesioner Usability SUS (System Usability Scale) */}
        <div className="space-y-3 pt-3 border-t border-black/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Bagian B: Standar Kuesioner Evaluasi SUS (System Usability Scale)</span>
              </h4>
              <p className="text-[11px] text-slate-500">Evaluasi kepuasan pengguna 30 hari pasca go-live (Skala Likert 1-5)</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Rata-rata Skor:</span>
              <span className="text-sm font-bold font-mono text-emerald-600">{calculatedSusAvg} / 5.0</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { id: 1, text: 'Antarmuka kasir sangat mudah dipelajari oleh staf kasir baru dalam waktu kurang dari 30 menit.' },
              { id: 2, text: 'Sistem merespons sangat cepat tanpa lag saat jam sibuk pesanan restoran berlangsung.' },
              { id: 3, text: 'Peringatan otomatis stok bahan habis berhasil mencegah dapur menerima pesanan yang batal.' },
              { id: 4, text: 'Laporan closing kasir (Z-Report) menghemat waktu tutup toko tanpa perlu hitung nota fisik.' },
              { id: 5, text: 'Secara keseluruhan, saya merekomendasikan sistem ini untuk cabang restoran berikutnya (NPS).' }
            ].map((q) => (
              <div key={q.id} className="p-3 rounded-2xl bg-slate-50 border border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <span className="text-slate-800 font-medium">
                  {q.id}. {q.text}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleSusChange(q.id, score)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        susScores[q.id] === score
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-black/[0.08]'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. LEMBAR PENGESAHAN DOKUMEN PRD */}
      <div id="prd-signoff" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span>Lembar Pengesahan Ruang Lingkup PRD MVP (Sign-Off)</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Dengan menandatangani dokumen ini, kedua belah pihak sepakat mengunci batasan fungsional MVP v1.0 di atas. Setiap penambahan fitur baru di luar daftar ini akan dimasukkan ke dalam Change Request (CR) Fase 2.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
            <span className="font-bold text-slate-900 block">PIHAK RESTORAN (KLIEN)</span>
            <p className="text-slate-600 text-[11px]">Nama Toko: {restaurantName || '[ ____________________ ]'}</p>
            <p className="text-slate-600 text-[11px]">Nama PIC: {clientPicName || '[ ____________________ ]'}</p>
            <p className="text-slate-600 text-[11px]">Target Go-Live: {targetGoLiveDate || '[ ____________________ ]'}</p>
            <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
              <span className="text-[10px] text-slate-400">Tanda Tangan &amp; Cap Restoran</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
            <span className="font-bold text-slate-900 block">PRODUCT MANAGEMENT TEAM</span>
            <p className="text-slate-600 text-[11px]">Perusahaan: GastroStock POS Architecture</p>
            <p className="text-slate-600 text-[11px]">Lead Product Manager: Solution Architect Lead</p>
            <p className="text-slate-600 text-[11px]">Status Persetujuan: APPROVED FOR SPRINT 1</p>
            <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
              <span className="text-[10px] text-slate-400">Tanda Tangan Resmi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
