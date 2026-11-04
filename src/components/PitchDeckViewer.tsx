import React, { useState, useEffect, useRef } from 'react';
import {
  Presentation,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers,
  ChefHat,
  Warehouse,
  TrendingUp,
  LayoutDashboard,
  Calendar,
  Phone,
  FileText,
  User,
  Sliders,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
  Clock,
  Printer,
  ShoppingBag,
  ExternalLink,
  Terminal
} from 'lucide-react';
import { downloadPitchDeckPptx, PitchDeckOptions } from '../utils/pptxGenerator';
import { getAllCaptureDataUrls, SystemCaptureDataUrls } from '../utils/brdCaptureGenerator';
import { PitchingQuestionsViewer } from './PitchingQuestionsViewer';
import { DevMeetingPitchDeckViewer } from './DevMeetingPitchDeckViewer';

export type PitchSubMode = 'slides' | 'dev_slides' | 'questions';

export const PitchDeckViewer: React.FC = () => {
  const [pitchSubMode, setPitchSubMode] = useState<PitchSubMode>('slides');
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [captures, setCaptures] = useState<SystemCaptureDataUrls | null>(null);

  // Client customization inputs
  const [clientName, setClientName] = useState<string>('Restoran Mitra & Hospitality Group');
  const [picName, setPicName] = useState<string>('GastroStock Enterprise Sales Team');
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = 11;

  // Load High-Res captures for slide mockups
  useEffect(() => {
    try {
      const urls = getAllCaptureDataUrls();
      setCaptures(urls);
    } catch (e) {
      console.warn('Failed to load captures:', e);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        setCurrentSlide(prev => Math.min(totalSlides, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide(prev => Math.max(1, prev - 1));
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Download PPTX presentation
  const handleDownloadPptx = async () => {
    try {
      setIsDownloading(true);
      await downloadPitchDeckPptx({
        clientName,
        picName
      });
      setDownloadSuccess('FILE POWERPOINT (.PPTX)');
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err) {
      console.error('Error generating PPTX:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Slide Speaker Notes / Sales Script
  const speakerNotes: Record<number, { title: string; script: string }> = {
    1: {
      title: 'Pembukaan & Nilai Utama',
      script: 'Selamat pagi/siang Bapak/Ibu. Hari ini kami tidak sekadar menawarkan software kasir biasa, melainkan ekosistem terpadu berkecepatan tinggi yang dirancang khusus untuk memotong kebocoran margin dan mempercepat perputaran meja restoran Anda.'
    },
    2: {
      title: 'Validasi Masalah Lapangan',
      script: 'Dari 50+ restoran yang kami survei, 68% kehilangan 4-8 juta per bulan hanya dari bahan busuk di chiller, kertas bon hilang saat rush hour, dan kasir menjual menu yang bahannya sudah habis. GastroStock memecahkan ketiga titik ini.'
    },
    3: {
      title: 'Penjelasan Ekosistem 6 Peran',
      script: 'Semua pihak terhubung: Kasir di depan, Waiter dengan tablet meja, Dapur dengan layar KDS tahan panas, Supervisor dengan otorisasi PIN, Gudang dengan alokasi FEFO, dan Anda sebagai Pemilik dengan Live BI di smartphone.'
    },
    4: {
      title: 'Kecepatan & Ketahanan Offline',
      script: 'Kecepatan respon sub-150ms via Local LAN. Bila koneksi internet restoran mati total, transaksi kasir dan pesanan dapur tetap beroperasi normal 100%. Tidak ada tamu menunggu karena internet putus.'
    },
    5: {
      title: 'Keamanan Database & Anti-Fraud',
      script: 'Sistem menggunakan ACID Row-Locking sekelas perbankan. Dua kasir tidak akan bisa menjual sisa porsi terakhir bersamaan. Semua void dan diskon membutuhkan 4-digit PIN Supervisor dengan catatan audit permanen.'
    },
    6: {
      title: 'Efisiensi Dapur KDS',
      script: 'Gantikan bon kertas yang berminyak dan hilang dengan KDS cerdas. Timer SLA otomatis memberi warna merah berkedip jika masakan lewat dari 10 menit. Rasio salah masak berkurang drastis.'
    },
    7: {
      title: 'Gudang FEFO & Monitoring Chiller',
      script: 'Bahan baku yang kadaluarsa lebih dulu otomatis dipotong ke resep menu lebih dulu. Chiller 3.2°C dipantau berkala. Daging dan dairy tetap segar, sisa makanan terbuang turun 78%.'
    },
    8: {
      title: 'Kendali Pemilik Restoran',
      script: 'Bapak/Ibu tidak perlu menelepon kasir menanyakan omset hari ini. Di smartphone Anda, omset kotor, HPP riil, dan laba bersih ter-update detik demi detik setiap kali tamu membayar.'
    },
    9: {
      title: 'Justifikasi ROI Finansial',
      script: 'Berdasarkan data riil, sistem ini menghasilkan ROI dalam 45 hari. Kenaikan omset 18.4% dan penghematan food cost 4.2% menutupi seluruh investasi awal Anda.'
    },
    10: {
      title: 'Paket Turnkey & Tanpa Gangguan',
      script: 'Proses go-live hanya butuh 7 hari tanpa menghentikan jam operasional restoran Anda. Kami siapkan skema LAN statis, input menu, pelatihan staf, dan pendampingan hari pertama.'
    },
    11: {
      title: 'Penutupan & Tindak Lanjut',
      script: 'Mari jadwalkan simulasi demo on-site gratis langsung di restoran Bapak/Ibu minggu ini. Kami akan bawa unit demo lengkap untuk Anda dan tim coba secara langsung.'
    }
  };

  return (
    <div
      ref={containerRef}
      className={`space-y-5 animate-fade-in ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#08090C] p-4 sm:p-6 overflow-y-auto' : ''
      }`}
    >
      {/* ===================================================================== */}
      {/* TOP CONTROL BAR & ACTIONS */}
      {/* ===================================================================== */}
      <div className="bg-[#12131A] text-slate-200 border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: Title & Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                Apple Keynote Slide Deck • 16:9 Widescreen
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                Slide {currentSlide} / {totalSlides}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Presentasi Penawaran Klien (Sales Pitch Deck)
            </h2>
          </div>
        </div>

        {/* Center: Slide Jump Navigator */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-full p-1 space-x-1">
          <button
            onClick={() => setCurrentSlide(prev => Math.max(1, prev - 1))}
            disabled={currentSlide === 1}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 disabled:opacity-30 transition-colors"
            title="Slide Sebelumnya (Arrow Left)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold text-white px-2">
            {currentSlide.toString().padStart(2, '0')} <span className="text-slate-500">/</span> {totalSlides}
          </span>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(totalSlides, prev + 1))}
            disabled={currentSlide === totalSlides}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 disabled:opacity-30 transition-colors"
            title="Slide Selanjutnya (Arrow Right / Space)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions (Download PPTX, Speaker Notes, Fullscreen, Customize) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Customize Client Button */}
          <button
            onClick={() => setShowCustomizeModal(true)}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
            title="Kustomisasi Nama Klien & Presenter"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Kustomisasi Klien</span>
          </button>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              showNotes
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="Tampilkan Skrip & Catatan Sales Presenter"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Skrip Sales</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            title={isFullscreen ? 'Keluar Fullscreen (Esc)' : 'Tampilan Penuh (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* PRIMARY ACTION: DOWNLOAD PPTX */}
          <button
            onClick={handleDownloadPptx}
            disabled={isDownloading}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
            title="Download file Microsoft PowerPoint asli (.pptx)"
          >
            <Download className="w-4 h-4 text-white" />
            <span>{isDownloading ? 'Menyusun File PPTX...' : 'Download PPTX (.pptx)'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Presentasi PowerPoint berhasil diunduh! Siap dibuka di Microsoft PowerPoint, Apple Keynote, atau Google Slides.</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* PITCH DECK VS DEV DECK VS 50 PERTANYAAN AUDIT SUB-MODE TOGGLE */}
      {/* ===================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#12131A] border border-white/10">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setPitchSubMode('slides')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              pitchSubMode === 'slides'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Slide Pitching Klien (11 Slides)</span>
          </button>

          <button
            onClick={() => setPitchSubMode('dev_slides')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              pitchSubMode === 'dev_slides'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-300" />
            <span>Slide Rapat Tim Dev: 16 Model Resto (13 Slides)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-extrabold">
              PPTX DEV
            </span>
          </button>

          <button
            onClick={() => setPitchSubMode('questions')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              pitchSubMode === 'questions'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>50 Pertanyaan Audit &amp; Diagnosa</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden lg:block pr-2">
          {pitchSubMode === 'dev_slides'
            ? 'Format Apple Keynote • 16 Model Layanan, Protokol & Hardware • Unduh .PPTX'
            : pitchSubMode === 'slides'
            ? 'Format Apple Keynote Minimalist • Kecepatan <15ms & Keamanan Perbankan'
            : '50 Pertanyaan Komprehensif • 6 Pilar Operasional Restoran • Download Word'}
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* SUB-VIEW 3: SLIDE RAPAT TIM DEV (16 MODEL RESTO & DEV BLUEPRINT)      */}
      {/* --------------------------------------------------------------------- */}
      {pitchSubMode === 'dev_slides' && (
        <DevMeetingPitchDeckViewer />
      )}

      {/* --------------------------------------------------------------------- */}
      {/* SUB-VIEW 2: 50 PERTANYAAN AUDIT & DIAGNOSIS RESTORAN */}
      {/* --------------------------------------------------------------------- */}
      {pitchSubMode === 'questions' && (
        <PitchingQuestionsViewer />
      )}

      {/* --------------------------------------------------------------------- */}
      {/* SUB-VIEW 1: 16:9 APPLE KEYNOTE SLIDES CANVAS & SPEAKER NOTES */}
      {/* --------------------------------------------------------------------- */}
      {pitchSubMode === 'slides' && (
        <>
          <div className="w-full bg-[#08090C] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative min-h-[580px] flex flex-col justify-between select-none">
            {/* Subtle Apple Keynote Gradient Aura */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 1: COVER / HERO KEYNOTE */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 1 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-6">
            <div className="space-y-4">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.25em] text-cyan-400 block uppercase">
                GASTROSTOCK RESTOSYNC • NEXT-GEN RESTAURANT OS
              </span>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
                Operations.<br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Reimagined.
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
                Sistem Manajemen Inventaris &amp; Operasional Restoran Berkecepatan Tinggi.
                Sinkronisasi Terpadu: Kasir POS, Tablet Waiter, KDS Dapur, Gudang FEFO, dan Executive BI.
              </p>
            </div>

            {/* Apple Keynote Metric Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">&lt; 150 ms</div>
                <div className="text-xs text-slate-300 font-semibold mt-1">Local LAN Latency</div>
                <div className="text-[10px] text-slate-500">Respon tiket seketika</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">ACID Lock</div>
                <div className="text-xs text-slate-300 font-semibold mt-1">Bank-Grade Security</div>
                <div className="text-[10px] text-slate-500">Anti-overselling resep</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">100%</div>
                <div className="text-xs text-slate-300 font-semibold mt-1">Offline-First Resilient</div>
                <div className="text-[10px] text-slate-500">Tetap aktif saat internet mati</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">+18.4%</div>
                <div className="text-xs text-slate-300 font-semibold mt-1">Perputaran Meja</div>
                <div className="text-[10px] text-slate-500">Omset harian terdongkrak</div>
              </div>
            </div>

            {/* Footer Presentation Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-2">
              <span>Disiapkan Khusus untuk: <strong className="text-slate-300">{clientName}</strong></span>
              <span>Dipresentasikan oleh: <strong className="text-slate-300">{picName}</strong></span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 2: THE PROBLEM */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 2 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-rose-400 uppercase">
                TANTANGAN INDUSTRI F&amp;B
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                68% Restoran Mengalami Kebocoran Margin Diam-Diam.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Tiga celah kritis yang menguras keuntungan operasional harian restoran tanpa disadari oleh pemilik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#141721] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-950/60 text-rose-400 flex items-center justify-center font-bold text-lg">
                  ⚠️
                </div>
                <h3 className="text-base font-bold text-white">Kebocoran Stok &amp; Spoilage</h3>
                <div className="text-rose-400 font-mono font-bold text-sm">Rp 4 – 8 Juta / Bulan</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bahan baku rusak di chiller karena tidak terpantau (tanpa alokasi FEFO). Deviasi gramatur resep antar koki membuat HPP membengkak tidak terkendali.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#141721] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center font-bold text-lg">
                  ⏱️
                </div>
                <h3 className="text-base font-bold text-white">Kertas Bon Hilang &amp; SLA Molor</h3>
                <div className="text-amber-400 font-mono font-bold text-sm">18 Menit Rata-rata Masak</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kertas struk pesanan tercecer saat jam sibuk. Tamu menunggu lebih dari 20 menit, meja lambat berganti, dan kepuasan tamu anjlok drastis.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#141721] border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-950/60 text-blue-400 flex items-center justify-center font-bold text-lg">
                  🛑
                </div>
                <h3 className="text-base font-bold text-white">Overselling &amp; Fraud Kasir</h3>
                <div className="text-cyan-400 font-mono font-bold text-sm">12% Pembatalan Meja</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Menu tetap dijual kasir padahal daging habis di dapur (tanpa kunci database). Pembatalan void bill dilakukan tanpa otorisasi PIN manajer toko.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>GastroStock RestoSync diciptakan khusus untuk menutup ketiga lubang kebocoran tersebut secara permanen.</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 3: UNIFIED 6-ROLE ARCHITECTURE */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 3 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
                EKOSISTEM TERPADU
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Satu Jantung Sinkronisasi. 6 Peran Tanpa Hambatan.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Arsitektur cerdas yang menghubungkan seluruh alur staf restoran dalam satu koordinasi real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: '1. Kasir POS', device: 'Touch POS 15-21"', color: 'text-cyan-400', desc: 'Input menu, kalkulasi split bill, validasi resep BOM instan & cetak tiket LAN.' },
                { title: '2. Pramusaji Tablet', device: 'Android Tablet 10"', color: 'text-emerald-400', desc: 'Peta meja dinamis (Kosong/Terisi/Billing), order di meja & peringatan menu habis.' },
                { title: '3. Chef Dapur KDS', device: 'Commercial TV Screen', color: 'text-rose-400', desc: 'Tiket antrean FIFO, SLA countdown visual cerdas, dan satu sentuhan bump order.' },
                { title: '4. Supervisor Toko', device: 'Backoffice Station', color: 'text-purple-400', desc: 'Otorisasi PIN void 4-digit, persetujuan diskon, dan rekonsiliasi kas harian.' },
                { title: '5. Owner Restoran', device: 'Mobile Smartphone', color: 'text-amber-400', desc: 'Live gross omset, HPP food cost % riil, deteksi kebocoran dan margin laba bersih.' },
                { title: '6. Staff Gudang', device: 'Barcode Terminal', color: 'text-blue-400', desc: 'Penerimaan PO supplier, pencatatan batch lot FEFO, dan monitor chiller 3.2°C.' }
              ].map((r, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold text-white`}>{r.title}</span>
                    <span className={`text-[10px] font-mono font-bold ${r.color}`}>{r.device}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Semua data tersinkronisasi otomatis via Local LAN WebSocket &lt;150ms tanpa ketergantungan internet luar.
              </span>
              <span className="text-cyan-400 font-mono text-[11px] font-bold">AUTONOMOUS RESTO OS</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 4: SPEED & OFFLINE-FIRST */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 4 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
                PERFORMA TANPA TANDING
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Secepat Kilat. Bahkan Saat Internet Mati.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Dibangun dengan arsitektur Local LAN Resilience dan Offline-First Autonomous Engine.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Big Metrics */}
              <div className="lg:col-span-5 space-y-3">
                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <div className="text-3xl font-extrabold font-mono text-cyan-400">&lt; 150 ms</div>
                  <div className="text-sm font-bold text-white">Response Time Antar Perangkat</div>
                  <p className="text-xs text-slate-400">
                    Tiket dari kasir sampai di layar dapur sebelum kertas struk printer selesai bergerak.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <div className="text-3xl font-extrabold font-mono text-emerald-400">3.2x</div>
                  <div className="text-sm font-bold text-white">Perputaran Meja Lebih Cepat</div>
                  <p className="text-xs text-slate-400">
                    Proses checkout, split bill, dan pemesanan dipersingkat dari 7 menit ke 90 detik.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <div className="text-3xl font-extrabold font-mono text-amber-400">100%</div>
                  <div className="text-sm font-bold text-white">Offline-First Uptime Guarantee</div>
                  <p className="text-xs text-slate-400">
                    Internet resto terputus? Kasir dan dapur tetap berjalan normal tanpa downtime sedetik pun.
                  </p>
                </div>
              </div>

              {/* Right Column: Visual Capture Mockup */}
              <div className="lg:col-span-7">
                {captures?.pos ? (
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                    <img src={captures.pos} alt="POS Touchscreen Mockup" className="w-full h-auto object-cover" />
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[#141721] border border-white/10 text-center text-slate-400">
                    Layar Kasir Touchscreen POS
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 5: BANK-GRADE SECURITY */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 5 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-purple-400 uppercase">
                PROTEKSI KEAMANAN BERLAPIS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Keamanan Sekelas Perbankan. Tanpa Kompromi.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Menghilangkan potensi pencurian kas, overselling porsi, dan void ilegal di kasir.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-3">
                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider block">
                    TRANSACTION LOCK
                  </span>
                  <div className="text-sm font-bold text-white">ACID Row-Level Locking Database</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mencegah 2 kasir menjual porsi sisa terakhir bersamaan. Jika bahan kurang 1 gram pun, database otomatis membatalkan pesanan (rollback).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    AUTH SHIELD
                  </span>
                  <div className="text-sm font-bold text-white">Supervisor 4-Digit PIN Authorization</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Kasir tidak dapat membatalkan pesanan (void bill) atau memberi diskon manual tanpa kehadiran fisik manajer dan PIN otorisasi.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                    AUDIT LOG
                  </span>
                  <div className="text-sm font-bold text-white">Tamper-Proof Stock Mutation Trail</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Setiap gram bahan keluar masuk dicatat permanen per detik bersama ID pesanan, nama staf kasir, dan stempel waktu server.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                {captures?.insufficientStock ? (
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                    <img src={captures.insufficientStock} alt="Stock Deficit Protection" className="w-full h-auto object-cover" />
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[#141721] border border-white/10 text-center text-slate-400">
                    Proteksi Defisit &amp; Modal Otorisasi PIN
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 6: KITCHEN DISPLAY SYSTEM */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 6 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-rose-400 uppercase">
                KITCHEN DISPLAY SYSTEM (KDS)
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Dapur Cepat. Tanpa Bon Kertas yang Hilang.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Pesanan terorganisir rapi dalam antrean cerdas dengan pengingat SLA visual tahan uap panas dapur.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7">
                {captures?.kds ? (
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                    <img src={captures.kds} alt="Kitchen KDS Display" className="w-full h-auto object-cover" />
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[#141721] border border-white/10 text-center text-slate-400">
                    Layar Kitchen Display System (KDS)
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <div className="text-rose-400 font-mono font-bold text-sm">01. Smart SLA Countdown Timer</div>
                  <div className="text-sm font-bold text-white">Warna Tiket Berubah Otomatis</div>
                  <p className="text-xs text-slate-400">
                    Hijau (&lt;5 mnt), Kuning (5-10 mnt), dan Merah Berkedip (&gt;10 mnt). Menghindarkan komplain tamu meja karena pesanan telat.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <div className="text-cyan-400 font-mono font-bold text-sm">02. One-Touch Order Bump</div>
                  <div className="text-sm font-bold text-white">Sentuh Layar untuk Status Masak</div>
                  <p className="text-xs text-slate-400">
                    Chef cukup menyentuh tiket untuk memindahkan status: Mengantri → Dimasak → Siap Saji. Waiter menerima notifikasi instan.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <div className="text-emerald-400 font-mono font-bold text-sm">03. Presisi Resep BOM Standar</div>
                  <div className="text-sm font-bold text-white">Rasa Selalu Konsisten</div>
                  <p className="text-xs text-slate-400">
                    Gramatur standar resep terpampang jelas di layar. Koki baru dapat memasak dengan rasa 100% presisi dengan standar Head Chef.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 7: WAREHOUSE FEFO & CHILLER */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 7 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-blue-400 uppercase">
                MANAJEMEN BAHAN BAKU &amp; HACCP
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Bahan Selalu Segar. Sisa Spoilage Mendekati 0%.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Standar pergudangan hotel &amp; resto bintang lima dengan First-Expired First-Out dan sensor chiller 3.2°C.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-3">
                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <div className="text-lg">📦</div>
                  <div className="text-sm font-bold text-white">Alokasi Otomatis Batch FEFO</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bahan baku dengan tanggal kedaluwarsa terdekat otomatis diprioritaskan untuk dipotong ke resep menu terlebih dahulu.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <div className="text-lg">❄️</div>
                  <div className="text-sm font-bold text-white">Monitor Suhu Chiller 3.2°C</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Telemetri memantau suhu lemari pendingin. Notifikasi darurat langsung berbunyi jika suhu naik di atas ambang batas aman 4°C.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <div className="text-lg">🏷️</div>
                  <div className="text-sm font-bold text-white">Pencatatan PO &amp; Barcode Lot</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Barang masuk supplier diverifikasi timbangan dan nomor lot sebelum disetujui masuk neraca inventaris aktif.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                {captures?.warehouse ? (
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                    <img src={captures.warehouse} alt="Warehouse FEFO Storage" className="w-full h-auto object-cover" />
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[#141721] border border-white/10 text-center text-slate-400">
                    Layar Gudang &amp; Penerimaan PO
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 8: EXECUTIVE BI DASHBOARD */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 8 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase">
                EXECUTIVE INTELLIGENCE
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Kendali Penuh di Genggaman Tangan Anda.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Pantau omset kotor, HPP riil, kerugian bahan, dan laba bersih restoran secara real-time via smartphone.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7">
                {captures?.dashboard ? (
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
                    <img src={captures.dashboard} alt="Executive BI Dashboard" className="w-full h-auto object-cover" />
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[#141721] border border-white/10 text-center text-slate-400">
                    Layar Executive BI Dashboard
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">OMSET GROSS HARI INI</span>
                  <div className="text-lg font-mono font-extrabold text-emerald-400">Rp 14.850.000</div>
                  <span className="text-[10px] text-emerald-400">↑ +18.4% vs kemarin</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">HPP / FOOD COST RIIL</span>
                  <div className="text-lg font-mono font-extrabold text-cyan-400">28.4%</div>
                  <span className="text-[10px] text-emerald-400">✓ Di bawah batas 30%</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">KERUGIAN WASTE DAPUR</span>
                  <div className="text-lg font-mono font-extrabold text-rose-400">Rp 82.500</div>
                  <span className="text-[10px] text-slate-400">Turun 78% pasca FEFO</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#141721] border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">ESTIMASI LABA BERSIH</span>
                  <div className="text-lg font-mono font-extrabold text-amber-400">Rp 5.240.000</div>
                  <span className="text-[10px] text-amber-300">Margin Bersih ~35.2%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 9: RETURN ON INVESTMENT */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 9 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase">
                KALKULASI RETURN ON INVESTMENT
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Investasi yang Membayar Dirinya Sendiri dalam 45 Hari.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Studi kasus riil yang terukur pada 50+ restoran mitra yang telah bermigrasi ke GastroStock RestoSync.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-[#141721] border border-white/10 text-center space-y-2">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-emerald-400">+18.4%</div>
                <h3 className="text-base font-bold text-white">Kenaikan Omset Meja</h3>
                <p className="text-xs text-slate-400">
                  Perputaran meja meningkat dari 2.1x menjadi 3.3x per hari saat jam makan malam sibuk.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#141721] border border-white/10 text-center space-y-2">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-cyan-400">-4.2%</div>
                <h3 className="text-base font-bold text-white">Penurunan Food Cost %</h3>
                <p className="text-xs text-slate-400">
                  Penghematan rata-rata Rp 6.300.000 per bulan dari pencegahan bahan busuk dan resep berlebih.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#141721] border border-white/10 text-center space-y-2">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-purple-400">99.98%</div>
                <h3 className="text-base font-bold text-white">Akurasi Stok Opname</h3>
                <p className="text-xs text-slate-400">
                  Menghilangkan selisih fisik vs sistem dari sebelumnya deviasi 8.5% menjadi hampir nol.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#141721] border border-white/10 text-center space-y-2">
                <div className="text-4xl sm:text-5xl font-extrabold font-mono text-amber-400">45 Hari</div>
                <h3 className="text-base font-bold text-white">Rata-rata Balik Modal</h3>
                <p className="text-xs text-slate-400">
                  Seluruh biaya perangkat lunak dan setup tertutupi oleh efisiensi bahan dalam 1.5 bulan.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 flex items-center justify-between">
              <span>Garansi Uji Coba Lapangan: Jika dalam 30 hari food cost Anda tidak membaik, tim kami akan memberikan audit gratis.</span>
              <span className="font-mono text-emerald-400 font-bold">GUARANTEED ROI</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 10: TURNKEY IMPLEMENTATION */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 10 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">
                LAYANAN IMPLEMENTASI
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Go-Live Cepat 7 Hari. Tanpa Henti Operasional.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Paket lengkap pendampingan instalasi perangkat keras, jaringan LAN, dan pelatihan seluruh staf restoran.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { phase: 'FASE 1', title: 'Survei & Skema LAN Statis', desc: 'Pengecekan jaringan resto, penetapan IP statis terminal kasir, router dapur, dan uji ketahanan sinyal.' },
                { phase: 'FASE 2', title: 'Migrasi Menu & Resep BOM', desc: 'Input katalog menu, gramatur takaran BOM, harga jual, pajak PB1, dan batas stok minimum (Par Level).' },
                { phase: 'FASE 3', title: 'Pelatihan Staf & Simulasi', desc: 'Pelatihan pramusaji, kasir, koki dapur, hingga supervisor toko dengan buku saku SOP & video tutorial.' },
                { phase: 'FASE 4', title: 'Go-Live & Dedicated Support', desc: 'Pendampingan langsung tim teknis di restoran saat hari pembukaan dan jaminan respon darurat <15 menit.' }
              ].map((s, i) => (
                <div key={i} className="p-5 rounded-2xl bg-[#141721] border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    {s.phase}
                  </span>
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 flex items-center justify-between">
              <span>Seluruh dokumen teknis (FSD, TSD, BRD, User Manual, SOP Deployment) telah disediakan dalam format Word .docx resmi.</span>
              <span className="font-mono text-cyan-400 font-bold">ENTERPRISE SLA 99.9%</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* SLIDE 11: CLOSING / ONE MORE THING */}
        {/* ------------------------------------------------------------------- */}
        {currentSlide === 11 && (
          <div className="relative z-10 flex flex-col justify-between flex-1 py-4 animate-fadeIn space-y-6">
            <div className="space-y-3">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-[0.25em] text-amber-400 block uppercase">
                ONE MORE THING...
              </span>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
                Bawa Restoran Anda Melompat<br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                  ke Standar Masa Depan.
                </span>
              </h2>

              <p className="text-sm sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                Tingkatkan margin laba bersih, hilangkan komplain tamu, dan amankan setiap gram bahan baku Anda mulai hari ini.
              </p>
            </div>

            {/* Call to Action Box */}
            <div className="p-6 rounded-3xl bg-[#141721] border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <span>Jadwalkan Demo Eksklusif On-Site di Restoran Anda</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tim kami akan membawakan unit demo POS Touchscreen, Tablet Waiter, dan KDS langsung ke restoran Anda.
                  </p>
                </div>

                <button
                  onClick={handleDownloadPptx}
                  disabled={isDownloading}
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 shrink-0"
                >
                  <Download className="w-4 h-4 text-white" />
                  <span>Download File PPT (.pptx)</span>
                </button>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span>Presenter: <strong className="text-white">{picName}</strong></span>
                <span>Klien: <strong className="text-white">{clientName}</strong></span>
                <span>Hotline 24/7 Priority Support Restoran</span>
              </div>
            </div>
          </div>
        )}

        {/* Slide Bottom Bar Navigation Indicator */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 overflow-x-auto max-w-md sm:max-w-xl">
            {Array.from({ length: totalSlides }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => setCurrentSlide(num)}
                className={`w-7 h-7 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  currentSlide === num
                    ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="hidden sm:inline text-slate-500">Gunakan panah keyboard (← →) untuk navigasi</span>
            <span className="text-cyan-400 font-mono font-bold">16:9 HD</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SPEAKER NOTES DRAWER (ACCORDION) */}
      {/* ===================================================================== */}
      {showNotes && (
        <div className="p-5 rounded-3xl bg-[#141721] border border-amber-500/30 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Catatan Sales &amp; Skrip Presenter (Slide {currentSlide})
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">{speakerNotes[currentSlide]?.title}</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-black/40 p-3.5 rounded-2xl border border-white/5">
            "{speakerNotes[currentSlide]?.script}"
          </p>

          <div className="text-[10px] text-slate-500 flex items-center gap-2">
            <span>💡 Tips Pitching:</span>
            <span>Tekankan perbandingan sebelum vs sesudah dan garansi 45 hari balik modal untuk meyakinkan pemilik resto.</span>
          </div>
        </div>
      )}
        </>
      )}

      {/* ===================================================================== */}
      {/* CUSTOMIZE CLIENT MODAL */}
      {/* ===================================================================== */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#181820] border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Kustomisasi Penawaran Klien</h3>
              </div>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Nama Restoran / Grup Klien:</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Contoh: PT Boga Selaras Mandiri / Resto Padang Sederhana"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">Nama Sales / Tim Presenter:</label>
                <input
                  type="text"
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  placeholder="Contoh: Budi Santoso (Lead Solutions Architect)"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-cyan-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Nama ini akan otomatis tercantum pada halaman judul, penutup, dan di dalam file PowerPoint (.pptx) yang diunduh.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Simpan &amp; Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
