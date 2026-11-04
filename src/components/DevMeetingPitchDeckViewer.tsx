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
  Sliders,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
  Clock,
  Printer,
  Terminal,
  Cpu,
  Radio,
  FileText,
  User,
  Users,
  Server,
  Database,
  Activity,
  Workflow,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  CreditCard,
  Smartphone,
  Car,
  Truck
} from 'lucide-react';
import { downloadDevModesPitchDeckPptx, DevDeckOptions } from '../utils/devDeckPptxGenerator';
import { SlideWorkflowVisualizer, VisualWorkflowType } from './dev-slides/SlideWorkflowVisualizer';

export const DevMeetingPitchDeckViewer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Sub-method states per slide for visual flow toggles
  const [slide3Method, setSlide3Method] = useState<VisualWorkflowType>('american_service');
  const [slide4Method, setSlide4Method] = useState<VisualWorkflowType>('russian_service');
  const [slide5Method, setSlide5Method] = useState<VisualWorkflowType>('counter_qsr');
  const [slide6Method, setSlide6Method] = useState<VisualWorkflowType>('conveyor_kaiten');
  const [slide7Method, setSlide7Method] = useState<VisualWorkflowType>('smart_locker');
  const [slide8Method, setSlide8Method] = useState<VisualWorkflowType>('drive_thru');
  const [slide9Method, setSlide9Method] = useState<VisualWorkflowType>('omakase');

  // Protocol simulator for Slide 10
  const [activeProtoTest, setActiveProtoTest] = useState<string>('WebSocket (WSS)');
  const [protoPingRunning, setProtoPingRunning] = useState<boolean>(false);
  const [protoLog, setProtoLog] = useState<{ ts: string; from: string; to: string; payload: string; latency: string; status: string } | null>(null);

  // ACID simulator for Slide 11
  const [acidSimStep, setAcidSimStep] = useState<number>(0);
  const [acidSimRunning, setAcidSimRunning] = useState<boolean>(false);

  // Customization inputs for dev meeting
  const [devTeamName, setDevTeamName] = useState<string>('Tim Engineering & Software Architect RestoSync');
  const [leadArchitect, setLeadArchitect] = useState<string>('Lead Solution Architect & Tech Lead');
  const [sprintTarget, setSprintTarget] = useState<string>('Sprint 1 - 4: Core Engine, POS/KDS, IoT & Aggregator');
  const [meetingDate, setMeetingDate] = useState<string>('29 Oktober 2026');
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = 13;

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

  const handleDownloadPptx = async () => {
    try {
      setIsDownloading(true);
      await downloadDevModesPitchDeckPptx({
        devTeamName,
        leadArchitect,
        meetingDate,
        sprintTarget
      });
      setDownloadSuccess('File presentasi PowerPoint (.pptx) 13 slide berhasil diunduh!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Speaker notes per slide for the presenter during developer meeting
  const speakerNotes: Record<number, string> = {
    1: 'Pembuka Rapat: "Rekan-rekan tim engineering, hari ini kita membedah arsitektur 16 model layanan restoran RestoSync. Fondasi sistem kita dibangun di atas 4 pilar teknis: latensi lokal <150ms untuk KDS, ACID row-level locking anti-overselling bahan baku, dukungan universal 16 metode, dan ketahanan 100% offline."',
    2: 'Taksonomi 5 Kategori: "Industri F&B terbagi menjadi 5 kategori: Table Service, Counter/Self-Service, Teknologi & Otomasi, Layanan Kendaraan, dan Konsep Khusus. Arsitektur backend kita harus modular sehingga core engine inventaris tidak perlu di-rewrite saat berpindah model layanan."',
    3: 'American vs French Service: "Pada American Service, perhatikan State Machine coursing KDS (Starter vs Main Course Fire). Pada French Service, perhatikan pemotongan mililiter (ml) Cognac flambé dan timbangan Bluetooth BLE untuk truffle/caviar per 0.1 gram."',
    4: 'Russian Silver vs English Family: "Russian Service menggunakan Platter Batch Multiplier (1 baki nampan = 8 porsi). English Family Style menggunakan tag COMMUNAL_SYNC di KDS agar seluruh piring tengah matang serentak, serta integrasi timbangan ikan hidup Serial RS232."',
    5: 'Counter & Self-Service: "Pada Counter QSR, kita pakai alur Pay-First dengan transmitter radio RF 433MHz buzzer pager. Cafeteria Line mengintegrasikan tap RFID kartu ID pegawai (<200ms) dengan double-tap guard. Buffet AYCE mengendalikan countdown sesi 90 menit via WebSocket."',
    6: 'Conveyor Kaiten & Shinkansen Express: "Ini integrasi hardware paling krusial: Kaiten Sushi menggunakan chip RFID 13.56MHz pada piring dengan Freshness Decay Timer 45 menit dan solenoid pusher arm otomatis. Shinkansen tray dikendalikan Modbus TCP PLC dengan load cell safety interlock."',
    7: 'Smart Food Locker & QR PWA: "Smart Locker memakai mikrokontroler ESP32 relay solenoid kunci 12V dan sensor suhu DS18B20 MQTTS (>60°C). Untuk QR Meja, kita implementasikan HMAC Signed Token dengan WebSocket Room Shared Table Cart antar-smartphone tamu."',
    8: 'Drive-Thru & Carhop: "Drive-thru membutuhkan integrasi 3 perangkat: Inductive Ground Loop di aspal, RTSP kamera LPR plat nomor, dan audio full-duplex VoIP SIP ke headset kasir dengan SLA SOS <180 detik. Carhop menggunakan ultrasonic bay sensor dan mobile 4G EDC."',
    9: 'Special Concepts (Omakase, Food Court, Cloud Kitchen): "Omakase memakai 100% Pre-Auth Escrow dan formulasi Dynamic Daily BOM. Food Court memakai Split-Escrow Payment (transfer multi-rekening) dan RAW ESC/POS printer router port 9100. Cloud Kitchen adalah Omnichannel Webhook Ingestion."',
    10: 'Matriks Protokol Developer: "Rangkuman protokol jaringan: WebSocket (WSS) untuk KDS/TV, MQTT over TLS untuk sensor IoT/Locker, Modbus TCP untuk mesin konveyor/rel, RAW ESC/POS port 9100 untuk printer IP, SIP/VoIP untuk interkom, dan HTTPS REST/HMAC untuk payment."',
    11: 'Concurrency & ACID Lock: "Pencegahan overselling memakai PostgreSQL `SELECT FOR UPDATE` pada baris bahan baku kritis, ditambah Redis Distributed Lock dengan TTL 300 detik saat flash-order, serta arsitektur Offline-First Store-and-Forward."',
    12: 'Engineering Roadmap Sprint: "Pembagian tugas sprint: Tim Frontend mengerjakan visual table map & shared cart; Tim Backend mengerjakan atomic lock & split payout; Tim Embedded/IoT mengerjakan driver RF pager, ESP32, dan Modbus; Tim DevOps menyiapkan VLAN & 4G Failover."',
    13: 'Penutup Pertemuan: "Kita siap memulai Sprint 1 dengan fokus fondasi Table Service, KDS Engine, dan ACID Locking. Silakan cek dokumentasi endpoint Swagger dan skema database ERD di tab terkait."'
  };

  return (
    <div className="space-y-4">
      {/* Top Deck Control Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-md border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold tracking-wider uppercase">
                Apple Keynote Slide Deck · 16:9 Widescreen
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Slide {currentSlide} / {totalSlides}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              Presentasi Rapat Tim Developer: Arsitektur 16 Model Layanan Resto
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Slide Navigation Buttons */}
          <div className="flex items-center bg-slate-950 rounded-full p-1 border border-white/10">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(1, prev - 1))}
              disabled={currentSlide === 1}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
              title="Slide Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-mono font-bold text-slate-200">
              {currentSlide < 10 ? `0${currentSlide}` : currentSlide} / {totalSlides}
            </span>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(totalSlides, prev + 1))}
              disabled={currentSlide === totalSlides}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
              title="Slide Berikutnya (Panah Kanan / Spasi)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Customize Dev Team Modal Trigger */}
          <button
            onClick={() => setShowCustomizeModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 transition-all active:scale-95"
            title="Ubah Nama Tim Dev / Tanggal Rapat"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Kustomisasi Tim</span>
          </button>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
              showNotes
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10'
            }`}
            title="Buka Skrip Catatan Presentasi untuk Pembicara"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Skrip Rapat Dev</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center border border-white/10 transition-all active:scale-95"
            title="Layar Penuh (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download PPTX Button */}
          <button
            onClick={handleDownloadPptx}
            disabled={isDownloading}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            title="Download Slide Presentasi PowerPoint Asli (.pptx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Menyusun PPTX...' : 'Download PPTX (.pptx)'}</span>
          </button>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            {downloadSuccess}
          </span>
          <button onClick={() => setDownloadSuccess(null)} className="text-emerald-400 font-bold">×</button>
        </div>
      )}

      {/* 16:9 Widescreen Presentation Canvas */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-video bg-[#0A0A0E] text-white rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col justify-between p-6 sm:p-10 select-none ${
          isFullscreen ? 'p-12 sm:p-16 rounded-none' : ''
        }`}
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {/* SLIDE 1: COVER */}
        {currentSlide === 1 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                RESTOSYNC ENGINEERING • DEVELOPER ALIGNMENT MEETING
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                Architecture.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Deconstructed.
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed pt-1">
                Blueprint 16 Model Layanan Restoran: Alur Operasional, Integrasi Hardware IoT, Protokol Jaringan (WSS, MQTT, Modbus, ESC/POS), API REST, dan Concurrency Lock.
              </p>
            </div>

            {/* 4 Tech Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-auto">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">&lt; 150 ms</div>
                <div className="text-xs font-bold text-white">Local LAN Latency</div>
                <div className="text-[10px] text-slate-400">WebSocket KDS &amp; Dispatch</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">ACID Lock</div>
                <div className="text-xs font-bold text-white">Bank-Grade Security</div>
                <div className="text-[10px] text-slate-400">Anti-Overselling Resep BOM</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">16 Methods</div>
                <div className="text-xs font-bold text-white">Universal Support</div>
                <div className="text-[10px] text-slate-400">Table, Kiosk, Conveyor &amp; Drive</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono">100% Offline</div>
                <div className="text-xs font-bold text-white">Local Resilience</div>
                <div className="text-[10px] text-slate-400">SQLite &amp; IndexedDB Sync</div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-4">
              <span>Disiapkan Khusus untuk: <strong className="text-white">{devTeamName}</strong></span>
              <span>Presenter: <strong className="text-white">{leadArchitect}</strong> · {meetingDate}</span>
            </div>
          </div>
        )}

        {/* SLIDE 2: 5 CATEGORIES TAXONOMY */}
        {currentSlide === 2 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                01. TAXONOMY OVERVIEW
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                5 Kategori Layanan &amp; 16 Model Operasional Restoran
              </h2>
              <p className="text-xs text-slate-400">
                Arsitektur sistem harus mampu mendukung fleksibilitas 16 alur kerja dengan satu basis kode inti.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 my-auto">
              {[
                { num: '01', title: 'Table Service (Meja)', color: 'text-emerald-400', items: ['American (Plated)', 'French (Gueridon)', 'Russian (Silver)', 'English (Family)'] },
                { num: '02', title: 'Counter & Self-Service', color: 'text-amber-400', items: ['Counter (Pay First)', 'Cafeteria Line', 'Buffet (AYCE)'] },
                { num: '03', title: 'Teknologi & Otomasi', color: 'text-cyan-400', items: ['QR-Code & Kiosk', 'Conveyor (Kaiten)', 'Shinkansen & Robot', 'Automat Smart Locker'] },
                { num: '04', title: 'Layanan Kendaraan', color: 'text-purple-400', items: ['Drive-Thru Lane', 'Drive-In / Carhop Bay'] },
                { num: '05', title: 'Konsep Khusus', color: 'text-rose-400', items: ["Omakase Chef's Table", 'Food Court Multi-Tenant', 'Ghost / Cloud Kitchen'] }
              ].map((c, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className={`text-base font-black font-mono ${c.color}`}>{c.num}</div>
                  <div className="text-xs font-bold text-white">{c.title}</div>
                  <div className="space-y-1 text-[11px] text-slate-400 pt-1">
                    {c.items.map((it, idx) => (
                      <div key={idx}>• {it}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 border-t border-white/10 pt-3">
              Kunci Desain: Pemisahan state machine frontend (table/counter/bay/locker) dari backend transaction engine.
            </div>
          </div>
        )}

        {/* SLIDE 3: TABLE SERVICE (AMERICAN & FRENCH) */}
        {currentSlide === 3 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in space-y-3">
            {/* Header with Sub-Service Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  02. TABLE SERVICE ARCHITECTURE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  American Plated vs. French Gueridon Service
                </h2>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <button
                  onClick={() => setSlide3Method('american_service')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide3Method === 'american_service'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1.1 American Plated
                </button>
                <button
                  onClick={() => setSlide3Method('french_service')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide3Method === 'french_service'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1.2 French Gueridon
                </button>
              </div>
            </div>

            {/* Split Content: Left Architecture Specs, Right Interactive Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-auto flex-1 min-h-0 items-stretch">
              {/* Left Column: Tech Architecture */}
              <div className="lg:col-span-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2.5 overflow-y-auto">
                {slide3Method === 'american_service' ? (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        1.1 American Plated Service (Standar Resto Modern)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Makanan dimasak dan di-plating lengkap 100% di dapur, diantar ke meja menggunakan nomor urut tempat duduk (Seat Number).
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">State Machine Meja:</span>
                        <span className="text-[11px] font-mono text-white">VACANT &rarr; SEATED &rarr; ORDERED &rarr; FIRED &rarr; BUSSING</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">Coursing KDS Engine:</span>
                        <span className="text-[11px] text-slate-300">Starter langsung berstatus COOKING. Main Course ditahan (HELD) hingga waiter menekan "Fire Mains".</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">Hardware &amp; Network:</span>
                        <span className="text-[11px] text-slate-300">Tablet Waiter Android/iOS, KDS Wall-mount 21.5", WSS WebSocket broadcast latensi &lt;150ms.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      ✓ ACID Lock: Row-level lock stok porsi daging steak saat pesanan dikirim dari tablet.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" />
                        1.2 French Gueridon Service (Flambé &amp; Trolley)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Makanan dimasak par-cooked di dapur, diselesaikan dan flambé di samping meja tamu menggunakan kereta gueridon.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">Dual-Stage BOM Formulation:</span>
                        <span className="text-[11px] text-slate-300">Tahap 1: Potong daging par-cooked di dapur. Tahap 2: Potong live 30ml Cognac saat flambé di meja.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">Hardware BLE &amp; Sensor:</span>
                        <span className="text-[11px] text-slate-300">Timbangan Digital Bluetooth BLE untuk gramasi truffle/caviar (akurasi 0.1g) langsung ke POS.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-purple-300 font-bold block uppercase">Wine Cellar Serialization:</span>
                        <span className="text-[11px] text-slate-300">Barcode scan serial botol vintage wine mengunci lot khusus di database cellar.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      ✓ ACID Lock: Kunci botol vintage bernomor seri unik dengan SELECT FOR UPDATE.
                    </div>
                  </>
                )}
              </div>

              {/* Right Column: Live Animated Diagram */}
              <div className="lg:col-span-7 flex flex-col">
                <SlideWorkflowVisualizer
                  workflowType={slide3Method}
                  title={slide3Method === 'american_service' ? 'Simulasi Alur Kasir & Dapur American Plated' : 'Simulasi Alur French Gueridon & Flambé'}
                  badge={slide3Method === 'american_service' ? 'KDS COURSING ENGINE' : 'DUAL-STAGE BOM & BLE SCALE'}
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>Arsitektur Kunci: Sinkronisasi status meja multi-waiter menggunakan room WebSocket.</span>
              <span className="text-cyan-400 font-mono font-bold">Latency SLA: &lt; 150ms</span>
            </div>
          </div>
        )}

        {/* SLIDE 4: TABLE SERVICE (RUSSIAN & ENGLISH FAMILY) */}
        {currentSlide === 4 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in space-y-3">
            {/* Header with Sub-Service Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  03. TABLE SERVICE ARCHITECTURE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Russian Silver Platter vs. English Family Style
                </h2>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <button
                  onClick={() => setSlide4Method('russian_service')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide4Method === 'russian_service'
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1.3 Russian Silver
                </button>
                <button
                  onClick={() => setSlide4Method('english_service')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide4Method === 'english_service'
                      ? 'bg-purple-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1.4 English Family Style
                </button>
              </div>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-auto flex-1 min-h-0 items-stretch">
              <div className="lg:col-span-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2.5 overflow-y-auto">
                {slide4Method === 'russian_service' ? (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        1.3 Russian Silver Service (Banquet Platter)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Makanan disajikan dari nampan perak besar (8–10 pax/baki), waiter memindahkan porsi ke piring tamu menggunakan sendok-garpu perak.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">Platter Batch Multiplier:</span>
                        <span className="text-[11px] text-slate-300">KDS mengelompokkan pesanan per nampan baki (1 Platter = 8x - 10x porsi standar) bukan piring tunggal.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">BEO Contract Integration:</span>
                        <span className="text-[11px] text-slate-300">Banquet Event Order mengunci jaminan pax kuota bahan baku gudang 48 jam sebelum acara.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-purple-300 font-bold block uppercase">Hardware Dispatch:</span>
                        <span className="text-[11px] text-slate-300">Barcode Scanner nampan baki expo &amp; RFID Badge Scanner pelayan untuk audit flow nampan.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      ✓ Yield Variance: Sisa porsi pada nampan dicatat di log pembuangan banquet variance.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        1.4 English Service (Family Style &amp; Lazy Susan)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Hidangan porsi besar diletakkan di tengah meja putar; tamu saling menyendokkan hidangan secara komunal.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-purple-300 font-bold block uppercase">Synchronous Pass (COMMUNAL_SYNC):</span>
                        <span className="text-[11px] text-slate-300">KDS menahan tiket sayur dan sup agar matang bersamaan dengan ikan bakar meja putar.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">Live Seafood Scale Serial RS232:</span>
                        <span className="text-[11px] text-slate-300">Timbangan ikan hidup (kerapu/kepiting per gram) otomatis mengisi field gramasi ke POS via serial RS232.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">BOM Skala Porsi:</span>
                        <span className="text-[11px] text-slate-300">Pilihan porsi S (1x), M (2x), L (3.5x) memotong bahan resep secara dinamis.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      ✓ Split Bill Engine: Mendukung pemecahan tagihan proporsional meja besar hingga 12 orang.
                    </div>
                  </>
                )}
              </div>

              <div className="lg:col-span-7 flex flex-col">
                <SlideWorkflowVisualizer
                  workflowType={slide4Method}
                  title={slide4Method === 'russian_service' ? 'Simulasi Alur Russian Silver Platter' : 'Simulasi Alur English Family Style'}
                  badge={slide4Method === 'russian_service' ? 'BANQUET BATCH MULTIPLIER' : 'COMMUNAL SYNC & RS232 SCALE'}
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>Arsitektur Kunci: Penjadwalan serentak hidangan meja komunal (Synchronous Expo Dispatch).</span>
              <span className="text-cyan-400 font-mono font-bold">RS232 Baud Rate: 9600 8N1</span>
            </div>
          </div>
        )}

        {/* SLIDE 5: COUNTER, CAFETERIA & BUFFET */}
        {currentSlide === 5 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in space-y-3">
            {/* Header with Sub-Service Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  04. COUNTER &amp; SELF-SERVICE ARCHITECTURE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Counter Service, Cafeteria Line, &amp; Buffet AYCE
                </h2>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <button
                  onClick={() => setSlide5Method('counter_qsr')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide5Method === 'counter_qsr'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2.1 Counter QSR
                </button>
                <button
                  onClick={() => setSlide5Method('cafeteria_line')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide5Method === 'cafeteria_line'
                      ? 'bg-emerald-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2.2 Cafeteria Line
                </button>
                <button
                  onClick={() => setSlide5Method('buffet_ayce')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide5Method === 'buffet_ayce'
                      ? 'bg-rose-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2.3 Buffet AYCE
                </button>
              </div>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-auto flex-1 min-h-0 items-stretch">
              <div className="lg:col-span-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2.5 overflow-y-auto">
                {slide5Method === 'counter_qsr' && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5" />
                        2.1 Counter Service (Pay First &amp; RF Pager)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Tamu pesan dan bayar di kasir konter. Stok dipotong seketika (Instant Deduct) dan tamu memegang buzzer pager nirkabel RF 433MHz.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">Pay-First Instant Deduct:</span>
                        <span className="text-[11px] text-slate-300">Tidak ada fase Soft Hold; transaksi pembayaran berhasil langsung mengeksekusi Hard Stock Deduct.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">Transmitter RF 433MHz Pager:</span>
                        <span className="text-[11px] text-slate-300">Kasir memindai nomor pager di dock RFID. Saat KDS dapur selesai, server trigger sinyal RF pager bergetar.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">SLA Transaksi:</span>
                        <span className="text-[11px] text-slate-300">Durasi tap kasir &lt; 45 detik, print thermal direct ESC/POS port 9100 &lt; 200ms.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      ✓ Anti-Antre: Mendukung auto-forwarding order ke printer station dapur tanpa antre KDS.
                    </div>
                  </>
                )}

                {slide5Method === 'cafeteria_line' && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        2.2 Cafeteria Line (Tray Slide &amp; RFID Tap)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Tamu menyusuri rel nampan memilih hidangan hangat. Di ujung rel, kasir memindai nampan dan tamu tap ID Badge RFID &lt; 3 detik.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">HRIS &amp; RFID Tap Integration:</span>
                        <span className="text-[11px] text-slate-300">Tap kartu pegawai memotong saldo kupon makan dengan validasi double-tap guard (&lt;200ms).</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">IoT Warmer HACCP Sensor:</span>
                        <span className="text-[11px] text-slate-300">Sensor probe MQTT membaca temperatur bain-marie tetap &gt; 65°C untuk kepatuhan sanitasi.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">Batch Refill Logging:</span>
                        <span className="text-[11px] text-slate-300">Gudang mengeluarkan batch loyang 50 porsi ke konter display dengan FIFO tracking.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      ✓ Kecepatan Kasir: SLA identifikasi nampan &lt; 3 detik per pengunjung.
                    </div>
                  </>
                )}

                {slide5Method === 'buffet_ayce' && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        2.3 Buffet All-You-Can-Eat (Session Timer)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Tamu membayar paket per pax dengan batas waktu santap (90 menit). Sistem menyiarkan timer sisa waktu ke tablet meja via WebSocket.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-rose-300 font-bold block uppercase">Server-Authoritative Countdown:</span>
                        <span className="text-[11px] text-slate-300">Timer 90 menit dihitung dari server timestamp PostgreSQL (aman dari refresh browser tamu).</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">Last Order &amp; Auto-Lock:</span>
                        <span className="text-[11px] text-slate-300">Menit ke-75 sistem membunyikan alarm Last Order dan mengunci tombol pesan daging premium.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">Bluetooth Waste Penalty Scale:</span>
                        <span className="text-[11px] text-slate-300">Timbangan Bluetooth menimbang sisa daging meja (&gt;100g = denda Rp 50.000 / 100g di bill).</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      ✓ Batch Refill Station: Dapur memantau kuota kuah kaldu &amp; refill daging loyang per 5kg.
                    </div>
                  </>
                )}
              </div>

              <div className="lg:col-span-7 flex flex-col">
                <SlideWorkflowVisualizer
                  workflowType={slide5Method}
                  title={slide5Method === 'counter_qsr' ? 'Simulasi Alur Kasir Counter QSR' : slide5Method === 'cafeteria_line' ? 'Simulasi Alur Cafeteria Line' : 'Simulasi Sesi Waktu Buffet AYCE'}
                  badge={slide5Method === 'counter_qsr' ? 'RF 433MHZ PAGER' : slide5Method === 'cafeteria_line' ? 'HRIS RFID TAP & MQTT' : 'WEBSOCKET SESSION TIMER'}
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>Arsitektur Kunci: Transaksi berkecepatan tinggi dengan locking instan dan audit timer server.</span>
              <span className="text-cyan-400 font-mono font-bold">Timer Protocol: WSS Heartbeat</span>
            </div>
          </div>
        )}

        {/* SLIDE 6: CONVEYOR RFID & SHINKANSEN RAIL */}
        {currentSlide === 6 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in space-y-3">
            {/* Header with Sub-Service Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  05. AUTOMATION &amp; ROBOTICS ARCHITECTURE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Conveyor Belt (Kaiten) &amp; Shinkansen Express Rail
                </h2>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <button
                  onClick={() => setSlide6Method('conveyor_kaiten')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide6Method === 'conveyor_kaiten'
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3.2 Conveyor Kaiten Sushi
                </button>
                <button
                  onClick={() => setSlide6Method('shinkansen_robot')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide6Method === 'shinkansen_robot'
                      ? 'bg-purple-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3.3 Shinkansen &amp; Robot AMR
                </button>
              </div>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-auto flex-1 min-h-0 items-stretch">
              <div className="lg:col-span-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2.5 overflow-y-auto">
                {slide6Method === 'conveyor_kaiten' ? (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" />
                        3.2 Kaiten Conveyor Belt (RFID &amp; Solenoid Pusher)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Piring sushi dipasangi microchip RFID 13.56MHz berputar di pita konveyor. Sistem memantau batas kesegaran piring (Freshness Decay).
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">Freshness Decay &amp; Solenoid Pusher:</span>
                        <span className="text-[11px] text-slate-300">Piring berputar &gt; 45 menit otomatis ditolak oleh lengan solenoid elektro-pneumatik ke tempat limbah HACCP.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">Chute Optical Counter:</span>
                        <span className="text-[11px] text-slate-300">Sensor inframerah di lubang meja membaca piring kotor yang dimasukkan tamu dan update bill otomatis.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">Protokol Hardware:</span>
                        <span className="text-[11px] text-slate-300">Modbus TCP ke PLC inverter motor penggerak rel, Serial RS485 ke antena pembaca RFID.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      ✓ Emergency Stop (E-Stop): Tombol darurat di layar KDS dapat memutus arus motor PLC seketika.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        3.3 Shinkansen Rail &amp; Autonomous AMR Robot
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Miniatur kereta cepat meluncur langsung ke meja dalam 12 detik, atau robot AMR ber-LiDAR mengantarkan nampan secara otonom.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-purple-300 font-bold block uppercase">Load Cell Safety Interlock:</span>
                        <span className="text-[11px] text-slate-300">Sensor beban baki mendeteksi piring telah diangkat tamu sebelum kereta diizinkan meluncur mundur.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">Robot AMR VDA 5050 / ROS2:</span>
                        <span className="text-[11px] text-slate-300">Navigasi LiDAR SLAM menghindari orang lewat dan berhenti di koordinat meja tujuan dengan presisi &plusmn;2cm.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">Multi-Station Dispatch:</span>
                        <span className="text-[11px] text-slate-300">KDS Dapur memilih stasiun meja tujuan, motor servo stepper mengatur akselerasi rel &lt; 15 detik.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      ✓ Return Button: Tamu menekan tombol hijau berkedip di tiang meja untuk memulangkan kereta.
                    </div>
                  </>
                )}
              </div>

              <div className="lg:col-span-7 flex flex-col">
                <SlideWorkflowVisualizer
                  workflowType={slide6Method}
                  title={slide6Method === 'conveyor_kaiten' ? 'Simulasi Kaiten Conveyor RFID & Solenoid' : 'Simulasi Shinkansen Express Rail & Robot'}
                  badge={slide6Method === 'conveyor_kaiten' ? 'MODBUS TCP & RFID DECAY' : 'LOAD CELL INTERLOCK & AMR'}
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>Arsitektur Kunci: Integrasi PLC mesin industri dengan WebSocket event broker RestoSync.</span>
              <span className="text-cyan-400 font-mono font-bold">PLC Modbus: Port 502 TCP</span>
            </div>
          </div>
        )}

        {/* SLIDE 7: SMART LOCKER & QR PWA */}
        {currentSlide === 7 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in space-y-3">
            {/* Header with Sub-Service Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  06. AUTOMATION &amp; DIGITAL ORDERING
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Smart Food Locker (Automat) &amp; QR Dynamic PWA
                </h2>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <button
                  onClick={() => setSlide7Method('smart_locker')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide7Method === 'smart_locker'
                      ? 'bg-emerald-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3.4 Smart Food Locker
                </button>
                <button
                  onClick={() => setSlide7Method('qr_pwa')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide7Method === 'qr_pwa'
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3.1 QR-Code Shared Cart
                </button>
              </div>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-auto flex-1 min-h-0 items-stretch">
              <div className="lg:col-span-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2.5 overflow-y-auto">
                {slide7Method === 'smart_locker' ? (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        3.4 Smart Food Locker (Automat Nirsentuh)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Loker pemanas pintar berpintu solenoid 12V. Tamu memindai kode QR OTP dinamis di scanner kiosk untuk membuka pintu loker spesifik.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">Solenoid 12V &amp; ESP32 Controller:</span>
                        <span className="text-[11px] text-slate-300">Relay magnetik menarik pasak pintu pop-out saat token QR cocok. Sensor reed switch memantau pintu ditutup.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">DS18B20 Telemetry over MQTTS:</span>
                        <span className="text-[11px] text-slate-300">Probe suhu membaca ruang loker tetap hangat (&gt;60°C) sesuai protokol sanitasi makanan hangat.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-purple-300 font-bold block uppercase">Dynamic OTP QR Code:</span>
                        <span className="text-[11px] text-slate-300">OTP 6-digit dengan TTL 30 menit di Redis; sekali dipakai langsung di-invalidate (One-Time Use).</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      ✓ UV-C Sanitasi: Lampu UV-C menyala 60 detik setiap kali pintu ditutup kembali.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        3.1 QR-Code PWA &amp; Shared Table Cart
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Tamu memindai QR meja tanpa install aplikasi. Seluruh tamu di meja yang sama tergabung dalam WebSocket Room Shared Cart secara real-time.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">HMAC Signed QR Token:</span>
                        <span className="text-[11px] text-slate-300">Token QR di-sign dengan kunci rahasia resto + rotasi harian untuk mencegah pemesanan fiktif dari luar resto.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">Shared Table Cart Room:</span>
                        <span className="text-[11px] text-slate-300">Jika Tamu A menambah Es Teh, layar HP Tamu B dan C seketika terupdate via WebSocket broadcast.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">Auto-Grayout Menu Habis:</span>
                        <span className="text-[11px] text-slate-300">Jika stok bahan BOM habis, item di layar smartphone tamu seketika non-aktif tanpa reload halaman.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      ✓ Instant Payment Webhook: QRIS payment gateway menembakkan webhook pemotongan inventaris.
                    </div>
                  </>
                )}
              </div>

              <div className="lg:col-span-7 flex flex-col">
                <SlideWorkflowVisualizer
                  workflowType={slide7Method}
                  title={slide7Method === 'smart_locker' ? 'Simulasi Smart Food Locker Nirsentuh' : 'Simulasi QR-Code PWA & Shared Cart Meja'}
                  badge={slide7Method === 'smart_locker' ? 'ESP32 MQTT & SOLENOID' : 'HMAC QR & SHARED CART WSS'}
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>Arsitektur Kunci: Pengambilan mandiri tanpa antre kasir dengan enkripsi OTP dan rooming real-time.</span>
              <span className="text-cyan-400 font-mono font-bold">Locker Protocol: MQTTS Port 8883</span>
            </div>
          </div>
        )}

        {/* SLIDE 8: DRIVE-THRU & CARHOP */}
        {currentSlide === 8 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in space-y-3">
            {/* Header with Sub-Service Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  07. DRIVE &amp; VEHICLE SERVICE ARCHITECTURE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Drive-Thru Multi-Window Lane &amp; Carhop Bay Parking
                </h2>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <button
                  onClick={() => setSlide8Method('drive_thru')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide8Method === 'drive_thru'
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4.1 Drive-Thru Lane
                </button>
                <button
                  onClick={() => setSlide8Method('carhop_bay')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide8Method === 'carhop_bay'
                      ? 'bg-purple-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4.2 Carhop Bay
                </button>
              </div>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-auto flex-1 min-h-0 items-stretch">
              <div className="lg:col-span-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2.5 overflow-y-auto">
                {slide8Method === 'drive_thru' ? (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" />
                        4.1 Drive-Thru Multi-Window (Ground Loop &amp; LPR)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Alur pemesanan kendaraan: Jendela 1 (Pesan &amp; Bayar) dan Jendela 2 (Ambil). Dilengkapi telemetri ground loop aspal dan kamera OCR plat nomor.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">Inductive Ground Loop Aspal:</span>
                        <span className="text-[11px] text-slate-300">Sensor medan magnet mendeteksi massa logam kendaraan &rarr; membunyikan chime otomatis di headset kasir.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">LPR Camera AI Plat Nomor:</span>
                        <span className="text-[11px] text-slate-300">Kamera OCR membaca plat nomor (misal B 1234 XYZ) untuk mengikat tiket pesanan antara Jendela 1 dan Jendela 2.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">Speed of Service (SOS) SLA Timer:</span>
                        <span className="text-[11px] text-slate-300">Timer multi-zona menghitung durasi antre kendaraan dengan target ketat &lt; 180 detik.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                      ✓ Park &amp; Hold: Tombol khusus jika ada menu lama masak, mobil diarahkan ke bay parkir tunggu.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        4.2 Drive-In / Carhop Bay Parking
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Mobil parkir di stall khusus berpilar interkom. Pelayan carhop bersepatu roda membawa baki berperekat jendela dan mesin EDC nirkabel.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-purple-300 font-bold block uppercase">Ultrasonic Bay Sensor:</span>
                        <span className="text-[11px] text-slate-300">Sensor sonar di atap kanopi slot mendeteksi keberadaan mobil dan mengubah warna bay di peta POS.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">Push-to-Talk (PTT) Matrix:</span>
                        <span className="text-[11px] text-slate-300">Tombol panggil tiang menghubungkan audio analog/VoIP ke konsol sentral operator kasir.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">Mobile 4G EDC Payment:</span>
                        <span className="text-[11px] text-slate-300">Tamu membayar kartu kredit/debit langsung dari dalam mobil tanpa perlu turun dari kursi kemudi.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      ✓ Window Clamp Tray: Baki mekanis khusus dikaitkan aman pada kaca pintu samping mobil tamu.
                    </div>
                  </>
                )}
              </div>

              <div className="lg:col-span-7 flex flex-col">
                <SlideWorkflowVisualizer
                  workflowType={slide8Method}
                  title={slide8Method === 'drive_thru' ? 'Simulasi Drive-Thru Ground Loop & LPR' : 'Simulasi Carhop Bay Ultrasonic & PTT'}
                  badge={slide8Method === 'drive_thru' ? 'TELEMETRY · VEHICLE LOOP & SIP' : 'PARKING IOT · ULTRASONIC SENSOR'}
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>Arsitektur Kunci: Telemetri loop kawat aspal berpadu dengan pengenalan visual AI plat nomor.</span>
              <span className="text-cyan-400 font-mono font-bold">Target SOS: &lt; 180 Detik</span>
            </div>
          </div>
        )}

        {/* SLIDE 9: SPECIAL CONCEPTS (OMAKASE, FOOD COURT, CLOUD KITCHEN) */}
        {currentSlide === 9 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in space-y-3">
            {/* Header with Sub-Service Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  08. CONTEMPORARY &amp; SPECIAL CONCEPTS
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Omakase Chef's Table, Food Court &amp; Cloud Kitchen
                </h2>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <button
                  onClick={() => setSlide9Method('omakase')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide9Method === 'omakase'
                      ? 'bg-purple-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  5.1 Omakase Table
                </button>
                <button
                  onClick={() => setSlide9Method('food_court')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide9Method === 'food_court'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  5.2 Food Court Multi
                </button>
                <button
                  onClick={() => setSlide9Method('cloud_kitchen')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    slide9Method === 'cloud_kitchen'
                      ? 'bg-rose-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  5.3 Ghost / Cloud Kitchen
                </button>
              </div>
            </div>

            {/* Split Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-auto flex-1 min-h-0 items-stretch">
              <div className="lg:col-span-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2.5 overflow-y-auto">
                {slide9Method === 'omakase' && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                        <ChefHat className="w-3.5 h-3.5" />
                        5.1 Omakase Chef's Table (Zero-Excess Daily Catch)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Tamu duduk berhadapan langsung dengan Chef tanpa buku menu standar. Sistem mengelola reservasi Pre-Auth 100% dan formulasi Dynamic Daily BOM.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-purple-300 font-bold block uppercase">100% Pre-Auth Escrow:</span>
                        <span className="text-[11px] text-slate-300">Deposit kartu kredit di-hold saat booking kursi via payment gateway; auto-capture saat tamu hadir di kursi meja.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">Dynamic Daily BOM:</span>
                        <span className="text-[11px] text-slate-300">Chef mengunggah tangkapan ikan lelang pasar subuh ke inventory, sistem menyusun 18-course pairing secara dinamis.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">Seat Allergy Matrix:</span>
                        <span className="text-[11px] text-slate-300">Tablet Chef menampilkan catatan alergi spesifik per kursi (misal Kursi 3 no shellfish).</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      ✓ Synchronous Serving: 18 hidangan disajikan serempak kepada seluruh 10 tamu di meja bar.
                    </div>
                  </>
                )}

                {slide9Method === 'food_court' && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        5.2 Food Court Multi-Tenant (Split Escrow Payout)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Pemesanan terpadu di kasir sentral atau kiosk gabungan. Sistem memecah transaksi (Split Payment) otomatis ke masing-masing stand vendor.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">Split-Escrow Settlement:</span>
                        <span className="text-[11px] text-slate-300">Total belanja Rp 100k dipecah: Stand A Rp 45k, Stand B Rp 40k, Pengelola Mall Rp 15k secara atomik.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">RAW ESC/POS IP Routing:</span>
                        <span className="text-[11px] text-slate-300">Server me-route socket TCP port 9100 langsung mencetak tiket pesanan di printer thermal stand masing-masing.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">Isolasi Database Tenant:</span>
                        <span className="text-[11px] text-slate-300">Setiap stand hanya dapat mengakses resep dan laporan stok bahan bakunya sendiri via multi-tenant schema.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                      ✓ Central Kiosk: 1 Mesin Kiosk mandiri melayani pemesanan menu dari 20 gerai sekaligus.
                    </div>
                  </>
                )}

                {slide9Method === 'cloud_kitchen' && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        5.3 Ghost / Cloud Kitchen (Omnichannel Aggregator)
                      </span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Restoran delivery-only tanpa ruang makan tamu. Seluruh order dari GoFood, GrabFood, dan ShopeeFood masuk ke satu hub layar KDS sentral.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-rose-300 font-bold block uppercase">Omnichannel Webhook Ingestion:</span>
                        <span className="text-[11px] text-slate-300">Standarisasi pesanan dari berbagai platform delivery menjadi format seragam JSON RestoSync.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">Shared Virtual Brand BOM:</span>
                        <span className="text-[11px] text-slate-300">5 Merek virtual (Burger, Bento, Ayam Geprek) berbagi stok bahan dasar yang sama di 1 gudang dingin.</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold block uppercase">TV Driver Dispatch Board:</span>
                        <span className="text-[11px] text-slate-300">Layar TV di lobi driver memandu driver ojol mengambil bungkusan di rak loker penjemputan spesifik.</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      ✓ Auto-Throttle: Jika antrean dapur &gt; 15 order, sistem otomatis menaikkan estimasi prep time ke ojol.
                    </div>
                  </>
                )}
              </div>

              <div className="lg:col-span-7 flex flex-col">
                <SlideWorkflowVisualizer
                  workflowType={slide9Method}
                  title={slide9Method === 'omakase' ? 'Simulasi Omakase Pre-Auth & Dynamic BOM' : slide9Method === 'food_court' ? 'Simulasi Food Court Split Escrow' : 'Simulasi Cloud Kitchen Omnichannel'}
                  badge={slide9Method === 'omakase' ? 'FINE DINING · DYNAMIC BOM' : slide9Method === 'food_court' ? 'MULTI-TENANT · SPLIT ESCROW' : 'DELIVERY · OMNICHANNEL KDS'}
                />
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>Arsitektur Kunci: Manajemen alokasi inventaris modular multi-tenant dan webhook ingestion berdaya tampung tinggi.</span>
              <span className="text-cyan-400 font-mono font-bold">Webhook Security: HMAC-SHA256</span>
            </div>
          </div>
        )}

        {/* SLIDE 10: PROTOCOL MATRIX & PACKET INSPECTOR */}
        {currentSlide === 10 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in space-y-3">
            <div className="space-y-0.5 border-b border-white/10 pb-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                09. DEVELOPER PROTOCOL STACK &amp; LIVE PACKET INSPECTOR
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Matriks Protokol Komunikasi &amp; Uji Payload Real-Time
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-auto flex-1 min-h-0 items-stretch">
              {/* Left Column: 6 Core Protocols */}
              <div className="lg:col-span-5 space-y-2 overflow-y-auto">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">
                  Pilih Protokol untuk Diuji:
                </span>
                {[
                  {
                    proto: 'WebSocket (WSS)',
                    port: 'Port 443',
                    speed: '< 150 ms',
                    desc: 'Sinkronisasi KDS dapur, timer AYCE, status meja live, dan shared table cart.',
                    from: 'Tablet Waiter (Client)',
                    to: 'KDS Node Server',
                    payload: '{"event":"COURSE_FIRE","table":"T-04","course":"MAIN","timestamp":1730248800}',
                    latency: '18 ms'
                  },
                  {
                    proto: 'MQTT over TLS',
                    port: 'Port 8883',
                    speed: '< 300 ms',
                    desc: 'Kontrol relay loker ESP32, sensor suhu DS18B20 HACCP warmer & chiller.',
                    from: 'ESP32 Smart Locker',
                    to: 'EMQX IoT Broker',
                    payload: '{"topic":"resto/lockers/L-04/temp","temp_c":64.2,"door_state":"LOCKED"}',
                    latency: '42 ms'
                  },
                  {
                    proto: 'Modbus TCP / RS485',
                    port: 'Port 502',
                    speed: '< 50 ms',
                    desc: 'Inverter PLC motor konveyor sushi Kaiten, rel Shinkansen tray, dan safety interlock.',
                    from: 'Edge Gateway Resto',
                    to: 'PLC Mitsubishi FX5U',
                    payload: 'Modbus WriteSingleCoil [Addr: 0x0010, Value: 0xFF00] (Start Conveyor)',
                    latency: '7 ms'
                  },
                  {
                    proto: 'RAW ESC/POS (TCP 9100)',
                    port: 'Port 9100',
                    speed: '< 200 ms',
                    desc: 'Pencetakan tiket dapur dan nota multi-tenant langsung ke printer IP tanpa spooler.',
                    from: 'Kitchen Router Service',
                    to: 'Epson TM-T82X IP',
                    payload: 'ESC @ \\x1B\\x45\\x01 [PESANAN T-04] 2x WAGYU STEAK WELL-DONE \\x1D\\x56\\x00',
                    latency: '24 ms'
                  },
                  {
                    proto: 'SIP / VoIP / RTP',
                    port: 'Port 5060 UDP',
                    speed: '< 80 ms',
                    desc: 'Audio headset interkom drive-thru tiang luar ruangan dan audio matrix carhop bay.',
                    from: 'Drive-Thru Post Intercom',
                    to: 'Cashier Wireless Headset',
                    payload: 'RTP G.711u Audio Stream 64kbps, PTT Triggered, Volume Gain: +6dB',
                    latency: '31 ms'
                  },
                  {
                    proto: 'HTTPS REST & HMAC',
                    port: 'Port 443',
                    speed: '< 500 ms',
                    desc: 'Submit checkout ACID, webhook payment QRIS, dan integrasi Grab/GoFood API.',
                    from: 'Payment Gateway Webhook',
                    to: 'RestoSync Auth API',
                    payload: 'POST /api/v1/payments/webhook { "order_id": "ORD-9921", "status": "SETTLED" }',
                    latency: '88 ms'
                  }
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveProtoTest(p.proto);
                      setProtoLog({
                        ts: new Date().toLocaleTimeString('id-ID'),
                        from: p.from,
                        to: p.to,
                        payload: p.payload,
                        latency: p.latency,
                        status: 'OK 200 SUCCESS'
                      });
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                      activeProtoTest === p.proto
                        ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-sm'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold font-mono text-cyan-300">{p.proto}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">{p.speed}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{p.desc}</p>
                  </button>
                ))}
              </div>

              {/* Right Column: Live Network Bus Packet Inspector */}
              <div className="lg:col-span-7 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Live Packet Inspector: <span className="font-mono text-cyan-300">{activeProtoTest}</span></span>
                  </div>
                  <button
                    onClick={() => {
                      setProtoPingRunning(true);
                      setTimeout(() => {
                        setProtoPingRunning(false);
                        setProtoLog({
                          ts: new Date().toLocaleTimeString('id-ID'),
                          from: activeProtoTest.includes('Modbus') ? 'Edge Gateway' : 'Tablet / Client',
                          to: activeProtoTest.includes('ESC/POS') ? 'Thermal Printer 9100' : 'Backend Server',
                          payload: `{"test_packet": true, "proto": "${activeProtoTest}", "epoch": ${Date.now()}}`,
                          latency: `${Math.floor(Math.random() * 25 + 8)} ms`,
                          status: 'ACK RECEIVED'
                        });
                      }, 500);
                    }}
                    disabled={protoPingRunning}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <Zap className="w-3 h-3" />
                    <span>{protoPingRunning ? 'Pinging Bus...' : 'Kirim Test Packet (Ping)'}</span>
                  </button>
                </div>

                {/* Network Bus Visual Diagram */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-bold">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <span className="text-[10px]">Client / IoT</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-3">
                      <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`absolute top-0 bottom-0 bg-cyan-400 rounded-full transition-all duration-500 ${protoPingRunning ? 'w-full animate-pulse' : 'w-1/2'}`} />
                      </div>
                      <span className="text-[9px] text-cyan-300 mt-1 uppercase font-bold">{activeProtoTest} Stream</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold">
                        <Server className="w-4 h-4" />
                      </div>
                      <span className="text-[10px]">Edge Gateway</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-3">
                      <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`absolute top-0 bottom-0 bg-emerald-400 rounded-full transition-all duration-500 ${protoPingRunning ? 'w-full animate-pulse' : 'w-1/2'}`} />
                      </div>
                      <span className="text-[9px] text-emerald-300 mt-1 uppercase font-bold">ACID Transaction</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold">
                        <Database className="w-4 h-4" />
                      </div>
                      <span className="text-[10px]">PostgreSQL DB</span>
                    </div>
                  </div>
                </div>

                {/* Packet Raw Payload Stream */}
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 font-mono text-xs space-y-1.5 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/10 pb-1">
                    <span>Packet Log: <strong className="text-white">{protoLog?.ts || 'Live Stream Active'}</strong></span>
                    <span className="text-emerald-400 font-bold">{protoLog?.status || 'OK 200 SUCCESS'}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed font-mono break-all py-1">
                    <span className="text-cyan-400 font-bold">&gt;&gt; PAYLOAD:</span> {protoLog?.payload || '{"event":"CONNECTED","proto":"RESTOSYNC_V1","state":"READY"}'}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                    <span>From: <strong className="text-white">{protoLog?.from || 'POS Terminal #01'}</strong></span>
                    <span>To: <strong className="text-white">{protoLog?.to || 'KDS Expo Display'}</strong></span>
                    <span>Round-Trip: <strong className="text-cyan-300">{protoLog?.latency || '14 ms'}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>Standardisasi: Seluruh protokol menggunakan payload JSON bertipe eksplisit dan checksum verifikasi.</span>
              <span className="text-cyan-400 font-mono font-bold">Offline Fallback: Local SQLite Queue</span>
            </div>
          </div>
        )}

        {/* SLIDE 11: CONCURRENCY & ACID LOCK RACE CONDITION SIMULATOR */}
        {currentSlide === 11 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in space-y-3">
            <div className="space-y-0.5 border-b border-white/10 pb-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                10. CONCURRENCY &amp; INVENTORY ENGINE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Arsitektur ACID Lock &amp; Pencegah Overselling Multi-Kasir
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 my-auto flex-1 min-h-0 items-stretch">
              {/* Left Column: 4 Architecture Locking Rules */}
              <div className="lg:col-span-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-2.5 overflow-y-auto">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Pilar Keamanan Transaksi Inventaris
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Menghindari race condition saat ratusan kasir dan QR kiosk memesan porsi terakhir secara serentak.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[10px] font-mono text-rose-300 font-bold block uppercase">1. Pessimistic Row Locking:</span>
                    <span className="text-[11px] font-mono text-white block">SELECT stock_qty FROM inventory WHERE id = ? FOR UPDATE;</span>
                    <span className="text-[10px] text-slate-400">Database mengunci baris stok bahan hingga transaksi selesai.</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[10px] font-mono text-amber-300 font-bold block uppercase">2. In-Memory Distributed Lock:</span>
                    <span className="text-[11px] text-slate-300">Redis lock dengan TTL 300 detik menahan kuota selama tamu berada di halaman checkout.</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold block uppercase">3. Non-Negative Balance Invariant:</span>
                    <span className="text-[11px] text-slate-300">Constraint basis data memastikan kolom stok tidak pernah bernilai di bawah nol (&ge; 0).</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  ✓ Idempotency Key: Mencegah double deduction akibat jaringan putus saat kirim pembayaran.
                </div>
              </div>

              {/* Right Column: Live Race Condition Duel Simulator */}
              <div className="lg:col-span-7 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Simulasi Rebutan Porsi Terakhir (Race Condition)</span>
                      <span className="text-[10px] text-slate-400">Kasir POS #1 vs Kiosk Tamu #2 · Stok Wagyu Tersisa = <strong className="text-amber-300">{acidSimStep >= 3 ? '0' : '1'} Porsi</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (acidSimStep < 4) {
                          setAcidSimStep(prev => prev + 1);
                        } else {
                          setAcidSimStep(0);
                        }
                      }}
                      className="px-3 py-1 rounded-full bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>{acidSimStep === 4 ? 'Ulangi Duel' : `Langkah ${acidSimStep + 1} / 4`}</span>
                    </button>
                    <button
                      onClick={() => setAcidSimStep(0)}
                      className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                      title="Reset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2 Cashiers Duel Visual Rig */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Cashier 1 */}
                  <div className={`p-3 rounded-xl border transition-all ${
                    acidSimStep >= 1 ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/60 border-white/10 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>Kasir POS #1 (Waitress)</span>
                      <span className="font-mono text-[10px]">{acidSimStep >= 3 ? 'BERHASIL' : acidSimStep >= 1 ? 'LOCKED' : 'READY'}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-1">
                      <div>Pesanan: 1x Wagyu Steak A5</div>
                      <div className="font-mono text-[10px] text-cyan-300">
                        {acidSimStep === 0 && 'Menunggu klik Bayar...'}
                        {acidSimStep === 1 && 'BEGIN; SELECT ... FOR UPDATE (Kunci Diperoleh!)'}
                        {acidSimStep >= 2 && 'UPDATE inventory SET stock=0; COMMIT;'}
                      </div>
                    </div>
                  </div>

                  {/* Cashier 2 / Kiosk */}
                  <div className={`p-3 rounded-xl border transition-all ${
                    acidSimStep === 2
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : acidSimStep >= 4
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                      : 'bg-slate-950/60 border-white/10 text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>Kiosk Meja #2 (Tamu)</span>
                      <span className="font-mono text-[10px]">{acidSimStep >= 4 ? 'REJECTED' : acidSimStep === 2 ? 'WAITING' : 'READY'}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 space-y-1">
                      <div>Pesanan: 1x Wagyu Steak A5</div>
                      <div className="font-mono text-[10px] text-amber-300">
                        {acidSimStep === 0 && 'Menunggu klik Bayar...'}
                        {acidSimStep === 1 && 'Klik bayar selisih 0.05 detik...'}
                        {acidSimStep === 2 && 'Query TERTAHAN: Menunggu Lock Kasir 1...'}
                        {acidSimStep === 3 && 'Lock lepas -> Baca stok = 0 porsi'}
                        {acidSimStep >= 4 && 'ROLLBACK: 409 Conflict (Overselling Dicegah!)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database State Console */}
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 font-mono text-xs space-y-1 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/10 pb-1">
                    <span>Database Engine State:</span>
                    <span className="text-cyan-400 font-bold">PostgreSQL ACID Engine</span>
                  </div>
                  <div className="text-[11px] text-slate-200 py-1">
                    {acidSimStep === 0 && 'Status Awal: Baris SKU "WAGYU-A5" berstatus UNLOCKED, stock_qty = 1.'}
                    {acidSimStep === 1 && 'Langkah 1: Kasir #1 memperoleh EXCLUSIVE ROW LOCK. Sesi lain yang mencoba membaca row ini harus antre.'}
                    {acidSimStep === 2 && 'Langkah 2: Kiosk #2 mencoba mengunci row yang sama, transaksi Kiosk #2 masuk status BLOCKED / WAITING.'}
                    {acidSimStep === 3 && 'Langkah 3: Kasir #1 commit UPDATE stock_qty = 0 dan melepas lock. Struk Kasir #1 tercetak.'}
                    {acidSimStep >= 4 && 'Langkah 4: Kiosk #2 lanjut membaca row -> stock_qty = 0. Sistem menolak transaksi (409 Conflict). Kasir #2 batal dan inventaris aman!'}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-1">
                    <span>Non-Negative Balance: <strong className="text-emerald-400">TERJAMIN</strong></span>
                    <span>Overselling: <strong className="text-emerald-400">0% RISK</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>Arsitektur Kunci: Transaksi ACID PostgreSQL menjamin konsistensi stok porsi bahan baku secara matematis.</span>
              <span className="text-rose-400 font-mono font-bold">SELECT FOR UPDATE Active</span>
            </div>
          </div>
        )}

        {/* SLIDE 12: SPRINT ROADMAP & CHECKLIST */}
        {currentSlide === 12 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                11. ENGINEERING ROADMAP
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Checklist Implementasi &amp; Pembagian Tugas Tim Dev
              </h2>
              <p className="text-xs text-slate-400">
                Rencana sprint 4 fase untuk merealisasikan seluruh 16 modul layanan.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-auto">
              {[
                { track: 'Frontend Client Apps', owner: 'Web & Mobile PWA', color: 'text-cyan-400', tasks: ['• Visual table map state machine', '• Shared cart WebSocket room', '• Multi-station KDS (<150ms)', '• Web Bluetooth scale reading'] },
                { track: 'Backend & Transactions', owner: 'API & Database', color: 'text-amber-400', tasks: ['• PostgreSQL Row-Lock BOM engine', '• Idempotent payment webhooks', '• Split-escrow multi-tenant', '• Dynamic daily Omakase BOM'] },
                { track: 'IoT & Hardware Drivers', owner: 'Embedded / Firmware', color: 'text-emerald-400', tasks: ['• Serial RS232 RF buzzer pager', '• Modbus TCP PLC konveyor rel', '• ESP32 solenoid & DS18B20', '• Direct socket ESC/POS 9100'] },
                { track: 'Network & DevOps', owner: 'Infra & Reliability', color: 'text-purple-400', tasks: ['• Isolated VLAN POS vs Guest', '• Dual-WAN 4G Failover Router', '• Local server cache for offline', '• SIP/VoIP PBX drive-thru'] }
              ].map((t, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className={`text-xs font-bold ${t.color}`}>{t.track}</div>
                  <div className="text-[10px] text-slate-400">{t.owner}</div>
                  <div className="space-y-1 text-[11px] text-slate-300 pt-1">
                    {t.tasks.map((task, tIdx) => (
                      <div key={tIdx}>{task}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 border-t border-white/10 pt-3">
              Sprint 1: Prioritas penyelesaian Core Engine, Table Service, KDS WebSocket, dan ACID Row-Locking.
            </div>
          </div>
        )}

        {/* SLIDE 13: CLOSING SLIDE */}
        {currentSlide === 13 && (
          <div className="h-full flex flex-col justify-between relative z-10 animate-fade-in">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                RESTOSYNC • NEXT-GEN RESTAURANT OS
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Ready for Implementation.
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed pt-1">
                16 Model Layanan, 6 Protokol Utama, 1 Basis Kode Arsitektur Tangguh.<br />
                Mari kita mulai Sprint 1 untuk fondasi Table Service, KDS Engine, dan ACID Locking.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 my-auto max-w-2xl">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Target Sprint Selanjutnya:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Target:</strong> {sprintTarget}<br />
                Dokumentasi Teknis Lengkap &amp; Kode Swagger API dapat diakses di tab <strong>"16 Model Layanan &amp; Dev"</strong> dan <strong>"API &amp; WS Spec"</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-4">
              <span>Diselenggarakan oleh: <strong className="text-white">{leadArchitect}</strong> · {devTeamName}</span>
              <span>Gunakan panah keyboard (&larr; &rarr;) untuk navigasi · 16:9 HD</span>
            </div>
          </div>
        )}

        {/* Bottom Slide Number Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1 z-20">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx + 1)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === idx + 1 ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              title={`Buka Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Speaker Notes / Meeting Script Drawer (collapsible) */}
      {showNotes && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-amber-400/30 shadow-md space-y-2 text-xs text-slate-200 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-amber-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Skrip Pembicara Rapat Dev (Slide {currentSlide} dari {totalSlides})</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Bahan Bicara Presenter</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans italic bg-slate-950 p-3.5 rounded-2xl border border-white/5">
            "{speakerNotes[currentSlide] || 'Jelaskan poin-poin teknis di slide ini kepada tim developer.'}"
          </p>
        </div>
      )}

      {/* Customization Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Kustomisasi Slide Rapat Tim Dev</span>
              </h3>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Tim Engineering / Divisi:</label>
                <input
                  type="text"
                  value={devTeamName}
                  onChange={(e) => setDevTeamName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Pemimpin Rapat / Presenter:</label>
                <input
                  type="text"
                  value={leadArchitect}
                  onChange={(e) => setLeadArchitect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Sprint:</label>
                <input
                  type="text"
                  value={sprintTarget}
                  onChange={(e) => setSprintTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tanggal Pertemuan:</label>
                <input
                  type="text"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="px-4 py-2 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full transition-colors"
              >
                Terapkan ke Slide &amp; PPTX
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
