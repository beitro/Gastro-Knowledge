import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Database, 
  ChefHat, 
  Warehouse, 
  LayoutDashboard, 
  ExternalLink,
  BookOpen,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Monitor,
  Printer as PrinterIcon,
  Wifi,
  Server,
  Calendar,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Award,
  Coffee,
  UtensilsCrossed,
  Zap,
  ShoppingBag,
  Edit3,
  CheckSquare,
  Square,
  RotateCcw,
  Smartphone,
  Cpu,
  SlidersHorizontal,
  Terminal,
  Package,
  Trash2,
  Lock,
  Boxes,
  Activity,
  Flame,
  Thermometer,
  Maximize2,
  Eye,
  Image as ImageIcon,
  ZoomIn,
  Presentation,
  X
} from 'lucide-react';
import { generateMaster4PhasesDocx, ClientCustomFormData } from '../utils/masterDocxGenerator';
import { generateBrdWordDocumentBlob } from '../utils/brdDocxGenerator';
import { generateFsdWordDocumentBlob } from '../utils/fsdDocxGenerator';
import { generateTsdWordDocumentBlob } from '../utils/tsdDocxGenerator';
import { generatePrdWordDocumentBlob } from '../utils/prdDocxGenerator';
import { generateDevWordDocumentBlob } from '../utils/devDocxGenerator';
import { generateOpsWordDocumentBlob } from '../utils/opsDocxGenerator';
import { getAllCaptureDataUrls, SystemCaptureDataUrls } from '../utils/brdCaptureGenerator';
import { POSTGRESQL_DDL_SCRIPT } from '../data/databaseSchemaData';
import { PrdDocumentSection } from './PrdDocumentSection';
import { DevDocumentSection } from './DevDocumentSection';
import { OpsDocumentSection } from './OpsDocumentSection';

export type DocumentType = 'prd' | 'brd' | 'fsd' | 'tsd' | 'developer' | 'ops' | 'workbook';

interface DocumentSuiteViewerProps {
  initialDoc?: DocumentType;
  onNavigateToTab?: (tab: any) => void;
}

export const DocumentSuiteViewer: React.FC<DocumentSuiteViewerProps> = ({
  initialDoc = 'brd',
  onNavigateToTab
}) => {
  const [selectedDoc, setSelectedDoc] = useState<DocumentType>(initialDoc);
  const [activeChapter, setActiveChapter] = useState<string>('cover');
  const [formMode, setFormMode] = useState<'fill' | 'blank'>('fill');

  // Loading & Action states
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // High-Resolution System UI/UX Captures for Live Preview & Zoom
  const [captureUrls, setCaptureUrls] = useState<SystemCaptureDataUrls | null>(null);
  const [activeGalleryCapture, setActiveGalleryCapture] = useState<keyof SystemCaptureDataUrls>('swimlane');
  const [zoomedImage, setZoomedImage] = useState<{ title: string; subtitle: string; url: string } | null>(null);

  useEffect(() => {
    try {
      const urls = getAllCaptureDataUrls();
      setCaptureUrls(urls);
    } catch (err) {
      console.warn('Capture generation error:', err);
    }
  }, []);

  const handleDownloadPngCapture = (title: string, dataUrl: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `RestoSync_UIUX_${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Sync initialDoc changes from navbar/sidebar
  useEffect(() => {
    if (initialDoc) {
      setSelectedDoc(initialDoc);
      setActiveChapter('cover');
    }
  }, [initialDoc]);

  // Client Custom Form Fields - Clean, NO DUMMY DATA!
  const [restaurantName, setRestaurantName] = useState('');
  const [clientPicName, setClientPicName] = useState('');
  const [clientRole, setClientRole] = useState('Pemilik Restoran / PIC Operasional');
  const [clientPhone, setClientPhone] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [targetGoLiveDate, setTargetGoLiveDate] = useState('');

  // Interactive ROI Calculator State
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [foodCostPct, setFoodCostPct] = useState<number>(30);

  // Derived calculations
  const monthlyCogs = (monthlyRevenue * foodCostPct) / 100;
  const wasteSavingsMonthly = monthlyCogs * 0.05;
  const wasteSavingsYearly = wasteSavingsMonthly * 12;
  const cashierErrorSavingsMonthly = monthlyRevenue * 0.01;
  const cashierErrorSavingsYearly = cashierErrorSavingsMonthly * 12;
  const paperMenuSavingsYearly = monthlyRevenue > 0 ? 7200000 : 0;
  const laborOvertimeSavingsYearly = monthlyRevenue > 0 ? 12000000 : 0;
  const totalAnnualSavings = wasteSavingsYearly + cashierErrorSavingsYearly + paperMenuSavingsYearly + laborOvertimeSavingsYearly;
  const systemCapex = 14500000;
  const paybackMonths = totalAnnualSavings > 0 
    ? ((systemCapex / totalAnnualSavings) * 12).toFixed(1)
    : '2,7';

  // Interactive diagnostic checklist
  const [diagnosticChecks, setDiagnosticChecks] = useState<Record<string, boolean>>({
    diag1: false,
    diag2: false,
    diag3: false,
    diag4: false
  });

  // Hardware blanks
  const [hardwareInventory, setHardwareInventory] = useState({
    posUnit: '1',
    posStatus: 'Beli Paket',
    posSn: '',
    posIp: '192.168.10.50',
    kdsUnit: '1',
    kdsStatus: 'Beli Paket',
    kdsSn: '',
    kdsIp: '192.168.10.150',
    printerDapurUnit: '1',
    printerDapurStatus: 'Epson TM-T82X LAN',
    printerDapurIp: '192.168.10.201',
    printerKasirUnit: '1',
    printerKasirStatus: 'USB / BT 80mm',
    printerKasirSn: ''
  });

  // Recipe BOM items (5 clean blank rows)
  const [menus, setMenus] = useState<Array<{ name: string; category: string; b1: string; b2: string; b3: string; hpp: string }>>([
    { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
    { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
    { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
    { name: '', category: 'Minuman', b1: '', b2: '', b3: '', hpp: '' },
    { name: '', category: 'Minuman', b1: '', b2: '', b3: '', hpp: '' }
  ]);

  // Download Handlers
  const handleDownloadDocx = async (type: DocumentType) => {
    try {
      setIsGeneratingDocx(true);
      let blob: Blob;
      let filename: string;

      if (type === 'prd') {
        blob = await generatePrdWordDocumentBlob({
          name: restaurantName,
          picName: clientPicName,
          targetGoLiveDate
        });
        filename = `RestoSync_1_PRD_Product_Requirements_Document_v1.0.docx`;
      } else if (type === 'brd') {
        blob = await generateBrdWordDocumentBlob();
        filename = `RestoSync_BRD_Business_Requirements_Document_v2.0.docx`;
      } else if (type === 'fsd') {
        blob = await generateFsdWordDocumentBlob();
        filename = `RestoSync_2_FSD_Functional_Specification_Document_v2.0.docx`;
      } else if (type === 'tsd') {
        blob = await generateTsdWordDocumentBlob();
        filename = `RestoSync_2_TSD_Technical_Specification_Document_v2.0.docx`;
      } else if (type === 'developer') {
        blob = await generateDevWordDocumentBlob({
          name: restaurantName,
          picName: clientPicName
        });
        filename = `RestoSync_3_Developer_Coding_Standards_and_API_v2.0.docx`;
      } else if (type === 'ops') {
        blob = await generateOpsWordDocumentBlob({
          name: restaurantName,
          picName: clientPicName,
          targetGoLiveDate
        });
        filename = `RestoSync_4_User_Manual_and_SOP_Deployment_v2.0.docx`;
      } else {
        const clientData: ClientCustomFormData = {
          restaurantName,
          clientPicName,
          clientRole,
          clientPhone,
          restaurantAddress,
          monthlyRevenue,
          foodCostPct,
          menus: menus.filter(m => m.name.trim() !== '')
        };
        blob = await generateMaster4PhasesDocx(clientData);
        filename = `RestoSync_Master_Workbook_4_Fase_Blanko_v2.0.docx`;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(type.toUpperCase());
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error(`Download error for ${type}:`, err);
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const handleDownloadAllDocuments = async () => {
    try {
      setIsGeneratingDocx(true);
      const allDocs: DocumentType[] = ['prd', 'brd', 'fsd', 'tsd', 'developer', 'ops', 'workbook'];
      for (const docType of allDocs) {
        await handleDownloadDocx(docType);
        await new Promise(r => setTimeout(r, 600));
      }
      setDownloadSuccess('SEMUA 7 DOKUMEN');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch (err) {
      console.error('Download all error:', err);
    } finally {
      setIsGeneratingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetToBlank = () => {
    setRestaurantName('');
    setClientPicName('');
    setClientPhone('');
    setRestaurantAddress('');
    setMonthlyRevenue(0);
    setDiagnosticChecks({ diag1: false, diag2: false, diag3: false, diag4: false });
    setMenus([
      { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
      { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
      { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
      { name: '', category: 'Minuman', b1: '', b2: '', b3: '', hpp: '' },
      { name: '', category: 'Minuman', b1: '', b2: '', b3: '', hpp: '' }
    ]);
  };

  const handleCopySummary = () => {
    let summaryText = '';
    if (selectedDoc === 'brd') {
      summaryText = `RESTOSYNC: BUSINESS REQUIREMENTS DOCUMENT (BRD) v2.0\n` +
        `Restoran: ${restaurantName || '[ ____________________ ]'} | PIC: ${clientPicName || '[ ____________________ ]'}\n` +
        `Ruang Lingkup: Diagnosa kebocoran, estimasi ROI payback 2.7 bulan, integrasi 4 antarmuka sistem (POS, KDS, Gudang, BI Dashboard), dan kriteria UAT 10 skenario.`;
    } else if (selectedDoc === 'fsd') {
      summaryText = `RESTOSYNC: FUNCTIONAL SPECIFICATION DOCUMENT (FSD) v2.0\n` +
        `10 Modul Fungsional: Kasir POS, Recipe BOM Engine, Proteksi Defisit Rollback, KDS Dapur, Waste Logging, Gudang HACCP (Chiller 3.2°C), Batch FEFO, Stock Opname, Executive Dashboard, dan RBAC Matrix.`;
    } else if (selectedDoc === 'tsd') {
      summaryText = `RESTOSYNC: TECHNICAL SPECIFICATION DOCUMENT (TSD) v2.0\n` +
        `Arsitektur Teknis: TypeScript, React 18 SPA, PostgreSQL 16 ACID dengan SELECT FOR UPDATE Row-Level Locking, Redis 7 Pub/Sub WebSocket (<150ms latency), REST API Idempotency Key, Draw.io Multi-Tab XML standard.`;
    } else {
      summaryText = `RESTOSYNC: MASTER WORKBOOK 4 FASE (FORMAT BLANKO ISIAN)\n` +
        `Fase 1: Pre-Sales & ROI | Fase 2: BRD & Resep BOM | Fase 3: UAT Go-Live | Fase 4: SOP Operasional Harian.`;
    }
    navigator.clipboard.writeText(summaryText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveChapter(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Document Suite Switcher & Action Header */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 flex-wrap">
              <span className="text-cyan-700 font-bold uppercase tracking-wider">Enterprise Document Suite</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-mono">Gastro Knowledge System OS Edition</span>
              <span aria-hidden="true">·</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60">
                Resmi Word (.docx) &amp; Print-Ready
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-cyan-600 shrink-0" />
              <span>Dokumen Lengkap: BRD, FSD, TSD &amp; Master Workbook</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-4xl leading-relaxed">
              Pusat dokumentasi resmi arsitektur sistem restoran. Dilengkapi pratinjau interaktif, <strong>tangkapan layar UI/UX GastroStock terbaru</strong>, tabel matriks fungsional, skema DDL PostgreSQL, serta unduhan <strong>file Word (.docx)</strong> siap cetak atau tulis tangan tanpa data dummy.
            </p>
          </div>

          {/* Download & Export Action Group */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0 flex-wrap">
            <button
              onClick={() => handleDownloadDocx(selectedDoc)}
              disabled={isGeneratingDocx}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-full transition-all shadow-sm bg-slate-900 hover:bg-black text-white active:scale-95 disabled:opacity-50"
              title={`Download dokumen ${selectedDoc.toUpperCase()} resmi dalam format Microsoft Word (.docx)`}
            >
              {isGeneratingDocx ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyusun File Word...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{downloadSuccess} Terunduh!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download {selectedDoc.toUpperCase()} (.docx)</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadAllDocuments}
              disabled={isGeneratingDocx}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-full transition-all shadow-xs active:scale-95 disabled:opacity-50"
              title="Download Seluruh 7 Dokumen Word Resmi Sekaligus"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Paket 7 Dokumen (.docx)</span>
            </button>

            <button
              onClick={() => onNavigateToTab?.('pitchdeck')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-full transition-all shadow-xs active:scale-95"
              title="Buka Slide Presentasi Penjualan Klien Berstandar Apple (.pptx)"
            >
              <Presentation className="w-3.5 h-3.5 text-white" />
              <span>Pitch Deck (.pptx)</span>
            </button>

            <button
              onClick={() => onNavigateToTab?.('pitchdeck')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-full transition-all shadow-xs active:scale-95"
              title="Buka 50 Pertanyaan Audit & Pitching Restoran (.docx)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>50 Tanya Audit (.docx)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all shadow-xs"
              title="Cetak Fisik atau Simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all shadow-xs"
              title="Salin Ringkasan Dokumen Aktif"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copiedText ? 'Tersalin' : 'Salin Info'}</span>
            </button>

            {formMode === 'fill' && (
              <button
                onClick={handleResetToBlank}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border border-black/[0.04]"
                title="Kosongkan form agar bersih tanpa isian"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Form</span>
              </button>
            )}
          </div>
        </div>

        {/* 7 Enterprise Document Selector Cards (Lifecycle Phase 1 to Phase 4 + Technical) */}
        <div className="mt-5 pt-4 border-t border-black/[0.04] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">
          {/* 1. PRD (Product Planning & Scope) */}
          <button
            onClick={() => {
              setSelectedDoc('prd');
              setActiveChapter('cover');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedDoc === 'prd'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className={selectedDoc === 'prd' ? 'text-indigo-400' : 'text-slate-500'}>
                1. PERENCANAAN
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${selectedDoc === 'prd' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-200 text-slate-700'}`}>
                .DOCX
              </span>
            </div>
            <div className={`text-xs font-bold truncate ${selectedDoc === 'prd' ? 'text-white' : 'text-slate-900'}`}>
              PRD &amp; Persona
            </div>
            <div className={`text-[10px] mt-0.5 truncate ${selectedDoc === 'prd' ? 'text-slate-300' : 'text-slate-500'}`}>
              MVP Scope, Persona &amp; Survei
            </div>
          </button>

          {/* 2. BRD (Business Requirements) */}
          <button
            onClick={() => {
              setSelectedDoc('brd');
              setActiveChapter('cover');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedDoc === 'brd'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className={selectedDoc === 'brd' ? 'text-cyan-400' : 'text-slate-500'}>
                BISNIS &amp; ROI
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${selectedDoc === 'brd' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-200 text-slate-700'}`}>
                .DOCX
              </span>
            </div>
            <div className={`text-xs font-bold truncate ${selectedDoc === 'brd' ? 'text-white' : 'text-slate-900'}`}>
              BRD (Bisnis)
            </div>
            <div className={`text-[10px] mt-0.5 truncate ${selectedDoc === 'brd' ? 'text-slate-300' : 'text-slate-500'}`}>
              Kalkulator ROI &amp; 10 UAT
            </div>
          </button>

          {/* 3. FSD (Functional Specification & UI/UX Design) */}
          <button
            onClick={() => {
              setSelectedDoc('fsd');
              setActiveChapter('cover');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedDoc === 'fsd'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className={selectedDoc === 'fsd' ? 'text-amber-400' : 'text-slate-500'}>
                2. ANALISIS &amp; DESAIN
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${selectedDoc === 'fsd' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-200 text-slate-700'}`}>
                .DOCX
              </span>
            </div>
            <div className={`text-xs font-bold truncate ${selectedDoc === 'fsd' ? 'text-white' : 'text-slate-900'}`}>
              FSD (Fungsional)
            </div>
            <div className={`text-[10px] mt-0.5 truncate ${selectedDoc === 'fsd' ? 'text-slate-300' : 'text-slate-500'}`}>
              10 Modul POS, KDS &amp; UI/UX
            </div>
          </button>

          {/* 4. TSD (Technical Specification & Architecture) */}
          <button
            onClick={() => {
              setSelectedDoc('tsd');
              setActiveChapter('cover');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedDoc === 'tsd'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className={selectedDoc === 'tsd' ? 'text-blue-400' : 'text-slate-500'}>
                ARSITEKTUR &amp; DB
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${selectedDoc === 'tsd' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-200 text-slate-700'}`}>
                .DOCX
              </span>
            </div>
            <div className={`text-xs font-bold truncate ${selectedDoc === 'tsd' ? 'text-white' : 'text-slate-900'}`}>
              TSD (Arsitektur)
            </div>
            <div className={`text-[10px] mt-0.5 truncate ${selectedDoc === 'tsd' ? 'text-slate-300' : 'text-slate-500'}`}>
              PostgreSQL DDL &amp; ACID
            </div>
          </button>

          {/* 5. DEV (Coding Standards & Guidelines) */}
          <button
            onClick={() => {
              setSelectedDoc('developer');
              setActiveChapter('cover');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedDoc === 'developer'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className={selectedDoc === 'developer' ? 'text-purple-400' : 'text-slate-500'}>
                3. TEKNIS DEV
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${selectedDoc === 'developer' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-200 text-slate-700'}`}>
                .DOCX
              </span>
            </div>
            <div className={`text-xs font-bold truncate ${selectedDoc === 'developer' ? 'text-white' : 'text-slate-900'}`}>
              Standar Kode &amp; API
            </div>
            <div className={`text-[10px] mt-0.5 truncate ${selectedDoc === 'developer' ? 'text-slate-300' : 'text-slate-500'}`}>
              Git Flow &amp; Swagger API
            </div>
          </button>

          {/* 6. OPS (User Manual & SOP Deployment) */}
          <button
            onClick={() => {
              setSelectedDoc('ops');
              setActiveChapter('cover');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedDoc === 'ops'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className={selectedDoc === 'ops' ? 'text-emerald-400' : 'text-slate-500'}>
                4. OPERASIONAL
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${selectedDoc === 'ops' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-200 text-slate-700'}`}>
                .DOCX
              </span>
            </div>
            <div className={`text-xs font-bold truncate ${selectedDoc === 'ops' ? 'text-white' : 'text-slate-900'}`}>
              User Manual &amp; SOP
            </div>
            <div className={`text-[10px] mt-0.5 truncate ${selectedDoc === 'ops' ? 'text-slate-300' : 'text-slate-500'}`}>
              Kasir Step-by-Step &amp; Error
            </div>
          </button>

          {/* 7. WORKBOOK 4-FASE */}
          <button
            onClick={() => {
              setSelectedDoc('workbook');
              setActiveChapter('cover');
            }}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedDoc === 'workbook'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] hover:bg-slate-100 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className={selectedDoc === 'workbook' ? 'text-rose-400' : 'text-slate-500'}>
                BUKU KERJA
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${selectedDoc === 'workbook' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-200 text-slate-700'}`}>
                BLANKO
              </span>
            </div>
            <div className={`text-xs font-bold truncate ${selectedDoc === 'workbook' ? 'text-white' : 'text-slate-900'}`}>
              Workbook 4-Fase
            </div>
            <div className={`text-[10px] mt-0.5 truncate ${selectedDoc === 'workbook' ? 'text-slate-300' : 'text-slate-500'}`}>
              Format Blanko Siap Centang
            </div>
          </button>
        </div>

        {/* Input Mode Toggle */}
        <div className="mt-4 pt-4 border-t border-black/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
              <span>Mode Tampilan:</span>
            </span>
            <div className="inline-flex rounded-full border border-black/[0.06] p-1 bg-slate-100">
              <button
                onClick={() => setFormMode('fill')}
                className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
                  formMode === 'fill' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Isi via HP / Tabel Interaktif
              </button>
              <button
                onClick={() => setFormMode('blank')}
                className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
                  formMode === 'blank' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Format Kosong (Print &amp; Tulis Tangan)
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            {formMode === 'fill' 
              ? 'Ketik data outlet F&B Anda; nilai yang Anda masukkan langsung disematkan ke file Word (.docx).'
              : 'Menampilkan format polos bergaris tanpa data dummy, siap dicetak langsung untuk ditulis dengan pena.'}
          </div>
        </div>
      </div>

      {/* Main Document Layout (Sidebar Chapter Nav + Content Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sticky Chapter Directory */}
        <div className="lg:col-span-3 sticky top-4 space-y-3">
          <div className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.05]">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-600" />
                <span>Daftar Bab {selectedDoc.toUpperCase()}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Navigasi</span>
            </div>

            <div className="space-y-1 text-xs">
              {selectedDoc === 'prd' && (
                <>
                  <button onClick={() => scrollToSection('prd-cover')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">1. Judul &amp; Scope Guard</button>
                  <button onClick={() => scrollToSection('prd-matrix')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">2. Matriks Fitur MVP (P0-P2)</button>
                  <button onClick={() => scrollToSection('prd-persona')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">3. 5 Profil User Personas</button>
                  <button onClick={() => scrollToSection('prd-journey')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">4. User Journey Map</button>
                  <button onClick={() => scrollToSection('prd-survey')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">5. Kuesioner Survei &amp; SUS</button>
                  <button onClick={() => scrollToSection('prd-signoff')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">6. Lembar Pengesahan PRD</button>
                </>
              )}

              {selectedDoc === 'brd' && (
                <>
                  <button onClick={() => scrollToSection('brd-cover')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">1. Identitas &amp; Lembar Judul</button>
                  <button onClick={() => scrollToSection('brd-background')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">2. Latar Belakang &amp; Kebocoran</button>
                  <button onClick={() => scrollToSection('brd-roi')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">3. Kalkulator Finansial &amp; ROI</button>
                  <button onClick={() => scrollToSection('brd-scope')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">4. Ruang Lingkup 4 Antarmuka</button>
                  <button onClick={() => scrollToSection('brd-flow')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">5. Swimlane Alur Bisnis</button>
                  <button onClick={() => scrollToSection('brd-uat')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">6. 10 Kriteria Pengujian UAT</button>
                  <button onClick={() => scrollToSection('brd-signoff')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">7. Lembar Sign-off Klien</button>
                </>
              )}

              {selectedDoc === 'fsd' && (
                <>
                  <button onClick={() => scrollToSection('fsd-cover')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">1. Ikhtisar Sistem &amp; Swimlane</button>
                  <button onClick={() => scrollToSection('fsd-pos')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">2. Modul Kasir POS &amp; Order</button>
                  <button onClick={() => scrollToSection('fsd-deficit')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">3. Proteksi Defisit &amp; Rollback</button>
                  <button onClick={() => scrollToSection('fsd-kds')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">4. Kitchen Display System (KDS)</button>
                  <button onClick={() => scrollToSection('fsd-waste')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">5. Waste Logging Bahan Rusak</button>
                  <button onClick={() => scrollToSection('fsd-warehouse')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">6. Gudang HACCP &amp; Chiller 3.2°C</button>
                  <button onClick={() => scrollToSection('fsd-fefo')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">7. Alokasi Batch FEFO &amp; PO</button>
                  <button onClick={() => scrollToSection('fsd-dashboard')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">8. Executive BI Dashboard</button>
                  <button onClick={() => scrollToSection('fsd-rbac')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">9. Matriks Hak Akses (RBAC)</button>
                  <button onClick={() => scrollToSection('fsd-signoff')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">10. Lembar Persetujuan FSD</button>
                </>
              )}

              {selectedDoc === 'tsd' && (
                <>
                  <button onClick={() => scrollToSection('tsd-cover')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">1. Arsitektur &amp; Topologi Sistem</button>
                  <button onClick={() => scrollToSection('tsd-concurrency')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">2. ACID &amp; SELECT FOR UPDATE</button>
                  <button onClick={() => scrollToSection('tsd-ddl')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">3. Skema PostgreSQL DDL</button>
                  <button onClick={() => scrollToSection('tsd-api')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">4. Spesifikasi REST API JSON</button>
                  <button onClick={() => scrollToSection('tsd-ws')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">5. WebSocket Pub/Sub Stream</button>
                  <button onClick={() => scrollToSection('tsd-drawio')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">6. Standar XML Draw.io 6-Tab</button>
                  <button onClick={() => scrollToSection('tsd-security')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">7. Keamanan &amp; Backup Snapshot</button>
                  <button onClick={() => scrollToSection('tsd-signoff')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">8. Lembar Tanda Tangan TSD</button>
                </>
              )}

              {selectedDoc === 'developer' && (
                <>
                  <button onClick={() => scrollToSection('dev-standards')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">1. TypeScript &amp; React Standards</button>
                  <button onClick={() => scrollToSection('dev-naming')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">2. Konvensi Penamaan Kode</button>
                  <button onClick={() => scrollToSection('dev-git')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">3. Git Flow &amp; Testing &gt;85%</button>
                  <button onClick={() => scrollToSection('dev-api')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">4. REST API &amp; Swagger Spec</button>
                  <button onClick={() => scrollToSection('dev-signoff')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">5. Pengesahan Lead Developer</button>
                </>
              )}

              {selectedDoc === 'ops' && (
                <>
                  <button onClick={() => scrollToSection('ops-manual')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">1. Buka Shift &amp; Uang Modal</button>
                  <button onClick={() => scrollToSection('ops-order')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">2. Panduan Transaksi &amp; Void</button>
                  <button onClick={() => scrollToSection('ops-sop')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">3. SOP Deployment &amp; IP Static</button>
                  <button onClick={() => scrollToSection('ops-trouble')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">4. Matriks Troubleshooting</button>
                  <button onClick={() => scrollToSection('ops-signoff')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">5. Lembar Serah Terima Training</button>
                </>
              )}

              {selectedDoc === 'workbook' && (
                <>
                  <button onClick={() => scrollToSection('wb-cover')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">Cover: Metadata Outlet</button>
                  <button onClick={() => scrollToSection('wb-phase1')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">Fase 1: Pre-Sales &amp; Hardware</button>
                  <button onClick={() => scrollToSection('wb-phase2')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">Fase 2: BRD &amp; Resep Master BOM</button>
                  <button onClick={() => scrollToSection('wb-phase3')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">Fase 3: UAT &amp; Checklist Go-Live</button>
                  <button onClick={() => scrollToSection('wb-phase4')} className="w-full text-left p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-medium">Fase 4: SOP Harian Kasir/Dapur</button>
                </>
              )}
            </div>

            {/* Quick Action Box */}
            <div className="pt-3 border-t border-black/[0.05]">
              <button
                onClick={() => handleDownloadDocx(selectedDoc)}
                className="w-full py-2.5 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh {selectedDoc.toUpperCase()} (.docx)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Preview Canvas */}
        <div className="lg:col-span-9 space-y-6">
          {/* Metadata Card (Without Dummy Data) */}
          <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-100">
                  Dokumen Aktif: {selectedDoc.toUpperCase()}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  {selectedDoc === 'prd' && 'Tahap 1: Product Requirements Document (PRD) & User Persona / Survey'}
                  {selectedDoc === 'brd' && 'Business Requirements Document (BRD) RestoSync v2.0'}
                  {selectedDoc === 'fsd' && 'Tahap 2: Functional Specification Document (FSD) & UI/UX Captures'}
                  {selectedDoc === 'tsd' && 'Technical Specification Document (TSD) & Database Architecture'}
                  {selectedDoc === 'developer' && 'Tahap 3: Standar Kode Developer & Spesifikasi Swagger API'}
                  {selectedDoc === 'ops' && 'Tahap 4: Buku Panduan Pengguna (User Manual) & SOP Deployment'}
                  {selectedDoc === 'workbook' && 'Dokumen Induk & Workbook 4-Fase RestoSync'}
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400 self-start sm:self-auto">
                DOC-RESTOSYNC-{selectedDoc.toUpperCase()}-2026-V2.0
              </span>
            </div>

            {/* Metadata Fields Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
                <span className="font-bold text-slate-700 block">Nama Restoran / Outlet:</span>
                {formMode === 'fill' ? (
                  <input
                    type="text"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="Ketik nama restoran Anda..."
                    className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 font-bold text-slate-900 focus:outline-cyan-600 text-xs"
                  />
                ) : (
                  <span className="font-mono text-slate-500">[ ________________________________________ ]</span>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
                <span className="font-bold text-slate-700 block">Pemilik Restoran / PIC:</span>
                {formMode === 'fill' ? (
                  <input
                    type="text"
                    value={clientPicName}
                    onChange={(e) => setClientPicName(e.target.value)}
                    placeholder="Ketik nama PIC operasional..."
                    className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 font-bold text-slate-900 focus:outline-cyan-600 text-xs"
                  />
                ) : (
                  <span className="font-mono text-slate-500">[ ________________________________________ ]</span>
                )}
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* SHOWCASE: TANGKAPAN LAYAR UI/UX & ARSITEKTUR GASTROSTOCK TERBARU */}
          {/* ================================================================= */}
          <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                    UI/UX GastroStock Live Capture
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Tangkapan Layar &amp; Alur Sistem Resmi (High-Resolution 1200x700)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual arsitektur resmi yang disematkan langsung dalam lampiran dokumen FSD, TSD, dan BRD Word (.docx).
                </p>
              </div>

              {captureUrls && (
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => {
                      const titles: Record<keyof SystemCaptureDataUrls, { t: string; s: string }> = {
                        swimlane: { t: 'Diagram Swimlane Interkoneksi 4 Sistem', s: 'POS ↔ KDS ↔ Gudang HACCP ↔ Dashboard' },
                        pos: { t: 'Layar Touchscreen Kasir POS', s: 'Katalog Menu & Validasi BOM Resep Instan' },
                        insufficientStock: { t: 'Proteksi Stok Kurang & Dialog Auto Sold-Out', s: 'ACID Rollback & Pencegahan Overselling' },
                        kds: { t: 'Layar Kitchen Display System (KDS)', s: 'Stopwatch SLA 12 Menit & Lonceng Ting-Ting' },
                        warehouse: { t: 'Gudang Storage HACCP & Alokasi Batch FEFO', s: 'Monitoring Suhu Chiller 3.2°C & Reorder Point' },
                        dashboard: { t: 'Dashboard Eksekutif Real-Time', s: 'Live Omset, HPP (COGS), Spoilage & Audit Ledger' },
                      };
                      const curr = titles[activeGalleryCapture];
                      setZoomedImage({ title: curr.t, subtitle: curr.s, url: captureUrls[activeGalleryCapture] });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all shadow-xs"
                    title="Perbesar Layar Penuh"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Perbesar</span>
                  </button>

                  <button
                    onClick={() => {
                      handleDownloadPngCapture(activeGalleryCapture, captureUrls[activeGalleryCapture]);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-full transition-all shadow-xs active:scale-95"
                    title="Download File Gambar PNG Resolusi Penuh"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unduh PNG</span>
                  </button>
                </div>
              )}
            </div>

            {/* 6 Capture Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { key: 'swimlane' as keyof SystemCaptureDataUrls, label: '1. Swimlane Alur', badge: 'DIAGRAM' },
                { key: 'pos' as keyof SystemCaptureDataUrls, label: '2. Kasir POS', badge: 'FOH' },
                { key: 'insufficientStock' as keyof SystemCaptureDataUrls, label: '3. Kurang Stok', badge: 'ROLLBACK' },
                { key: 'kds' as keyof SystemCaptureDataUrls, label: '4. Dapur KDS', badge: 'BOH' },
                { key: 'warehouse' as keyof SystemCaptureDataUrls, label: '5. Gudang Chiller', badge: '3.2°C' },
                { key: 'dashboard' as keyof SystemCaptureDataUrls, label: '6. Dashboard BI', badge: 'OWNER' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveGalleryCapture(tab.key)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    activeGalleryCapture === tab.key
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/10'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-black/[0.04]'
                  }`}
                >
                  <span className={`block text-[9px] font-mono font-bold ${activeGalleryCapture === tab.key ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {tab.badge}
                  </span>
                  <span className="block text-xs font-bold truncate mt-0.5">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Image Preview Box with Window Styling */}
            <div className="relative rounded-2xl border border-black/[0.08] bg-slate-950 overflow-hidden shadow-inner group">
              {captureUrls ? (
                <img
                  src={captureUrls[activeGalleryCapture]}
                  alt={`Tangkapan Layar UI/UX GastroStock - ${activeGalleryCapture}`}
                  className="w-full h-auto cursor-zoom-in transition-transform duration-200 group-hover:scale-[1.005]"
                  onClick={() => {
                    const titles: Record<keyof SystemCaptureDataUrls, { t: string; s: string }> = {
                      swimlane: { t: 'Diagram Swimlane Interkoneksi 4 Sistem', s: 'POS ↔ KDS ↔ Gudang HACCP ↔ Dashboard' },
                      pos: { t: 'Layar Touchscreen Kasir POS', s: 'Katalog Menu & Validasi BOM Resep Instan' },
                      insufficientStock: { t: 'Proteksi Stok Kurang & Dialog Auto Sold-Out', s: 'ACID Rollback & Pencegahan Overselling' },
                      kds: { t: 'Layar Kitchen Display System (KDS)', s: 'Stopwatch SLA 12 Menit & Lonceng Ting-Ting' },
                      warehouse: { t: 'Gudang Storage HACCP & Alokasi Batch FEFO', s: 'Monitoring Suhu Chiller 3.2°C & Reorder Point' },
                      dashboard: { t: 'Dashboard Eksekutif Real-Time', s: 'Live Omset, HPP (COGS), Spoilage & Audit Ledger' },
                    };
                    const curr = titles[activeGalleryCapture];
                    setZoomedImage({ title: curr.t, subtitle: curr.s, url: captureUrls[activeGalleryCapture] });
                  }}
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
                  Menyiapkan pratinjau resolusi tinggi...
                </div>
              )}

              {/* Floating Action Badge on Hover */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (captureUrls) {
                      const titles: Record<keyof SystemCaptureDataUrls, { t: string; s: string }> = {
                        swimlane: { t: 'Diagram Swimlane Interkoneksi 4 Sistem', s: 'POS ↔ KDS ↔ Gudang HACCP ↔ Dashboard' },
                        pos: { t: 'Layar Touchscreen Kasir POS', s: 'Katalog Menu & Validasi BOM Resep Instan' },
                        insufficientStock: { t: 'Proteksi Stok Kurang & Dialog Auto Sold-Out', s: 'ACID Rollback & Pencegahan Overselling' },
                        kds: { t: 'Layar Kitchen Display System (KDS)', s: 'Stopwatch SLA 12 Menit & Lonceng Ting-Ting' },
                        warehouse: { t: 'Gudang Storage HACCP & Alokasi Batch FEFO', s: 'Monitoring Suhu Chiller 3.2°C & Reorder Point' },
                        dashboard: { t: 'Dashboard Eksekutif Real-Time', s: 'Live Omset, HPP (COGS), Spoilage & Audit Ledger' },
                      };
                      const curr = titles[activeGalleryCapture];
                      setZoomedImage({ title: curr.t, subtitle: curr.s, url: captureUrls[activeGalleryCapture] });
                    }
                  }}
                  className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-[11px] font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Klik untuk Perbesar</span>
                </button>
              </div>
            </div>

            {/* Contextual Explainer for Selected Capture */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] text-xs space-y-1">
              {activeGalleryCapture === 'swimlane' && (
                <>
                  <span className="font-bold text-slate-900 block">Peta Alur Kerja Swimlane Inter-Sistem (Kasir POS ↔ KDS ↔ Gudang ↔ Dashboard):</span>
                  <p className="text-slate-600 leading-relaxed">
                    Diagram ini memetakan sinkronisasi 4 sistem dalam tempo sub-150ms: Kasir POS mencatat pesanan tamu, memverifikasi ketersediaan bahan baku ke gudang secara atomik, menerbitkan tiket KDS dapur dengan lonceng ting-ting, dan mengupdate omset kotor serta COGS di dashboard eksekutif secara real-time.
                  </p>
                </>
              )}
              {activeGalleryCapture === 'pos' && (
                <>
                  <span className="font-bold text-slate-900 block">Layar Antarmuka Kasir Touchscreen (Point of Sale):</span>
                  <p className="text-slate-600 leading-relaxed">
                    Menampilkan katalog menu dengan badge kuota porsi riil ("Stok: 14 porsi"). Keranjang pesanan langsung mengkalkulasi Bill of Materials (BOM) per gramatur bahan, diskon meja, PB1 Resto 10%, dan tombol transmisi instan ke dapur.
                  </p>
                </>
              )}
              {activeGalleryCapture === 'insufficientStock' && (
                <>
                  <span className="font-bold text-slate-900 block">Proteksi Stok Kurang &amp; Dialog Auto Sold-Out (ACID Rollback):</span>
                  <p className="text-slate-600 leading-relaxed">
                    Saat stok daging Wagyu hanya tersisa 80g namun kasir memesan 2 porsi (kebutuhan 160g), sistem menolak transaksi secara atomik, memicu dialog proteksi merah, dan mengunci menu menjadi "SOLD OUT" di seluruh terminal kasir tanpa pemotongan sepihak.
                  </p>
                </>
              )}
              {activeGalleryCapture === 'kds' && (
                <>
                  <span className="font-bold text-slate-900 block">Kitchen Display System (KDS), Stopwatch SLA &amp; Waste Logging:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Tablet koki dapur dilengkapi alarm audio ting-ting saat tiket masuk, stopwatch SLA hitung mundur 12 menit, kartu resep bahan baku, serta tombol cepat "Catat Bahan Rusak / Waste Dapur" untuk membukukan kerugian secara akurat ke buku besar.
                  </p>
                </>
              )}
              {activeGalleryCapture === 'warehouse' && (
                <>
                  <span className="font-bold text-slate-900 block">Gudang, Storage HACCP 5 Zona &amp; Alokasi Batch FEFO:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Monitoring suhu real-time Walk-in Chiller (3.2°C) dan Deep Freezer (-18.5°C). Terintegrasi dengan alokasi batch First-Expired-First-Out (FEFO), indikator Reorder Point (ROP), dan tombol 1-klik untuk menerbitkan draf Purchase Order ke supplier.
                  </p>
                </>
              )}
              {activeGalleryCapture === 'dashboard' && (
                <>
                  <span className="font-bold text-slate-900 block">Dashboard Eksekutif Real-Time (BI Analytics &amp; Margin Leak):</span>
                  <p className="text-slate-600 leading-relaxed">
                    Menampilkan Gross Sales hari ini, persentase Food Cost / COGS riil vs teoritis, total kerugian waste dapur, alert bahan di bawah ROP, serta mutasi buku besar stok (OUT_SALE, ADJUST_WASTE, IN_PURCHASE) yang tidak dapat dimanipulasi.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* ================================================================= */}
          {/* VIEW 1: PRD (PRODUCT REQUIREMENTS DOCUMENT & USER PERSONA / SURVEY) */}
          {/* ================================================================= */}
          {selectedDoc === 'prd' && (
            <PrdDocumentSection
              restaurantName={restaurantName}
              clientPicName={clientPicName}
              targetGoLiveDate={targetGoLiveDate}
              formMode={formMode}
              captureUrls={captureUrls}
              onZoomImage={(img) => setZoomedImage(img)}
            />
          )}

          {/* ================================================================= */}
          {/* VIEW 2: BRD (BUSINESS REQUIREMENTS DOCUMENT) */}
          {/* ================================================================= */}
          {selectedDoc === 'brd' && (
            <div className="space-y-6">
              {/* Chapter 1: Latar Belakang & Masalah Kebocoran */}
              <div id="brd-background" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Latar Belakang Bisnis &amp; Diagnosa Kebocoran Margin F&amp;B
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Operasional restoran seringkali mengalami penurunan margin akibat 3 kebocoran klasik: (1) <em>Blind Spot Stok</em> saat jam sibuk kasir, (2) Bahan terbuang (waste &amp; spoilage) tanpa pencatatan pertanggungjawaban, dan (3) Ketidaksesuaian resep standar (porsi koki tidak presisi). RestoSync hadir sebagai solusi terpadu untuk mengunci setiap gramatur bahan baku sejak pesanan pertama dicatat di kasir.
                </p>

                {/* Checklist Diagnosa Lapangan */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-3">
                  <span className="font-bold text-xs text-slate-900 block">Checklist Diagnosa Kendala Lapangan (Centang [☐] Sesuai Kondisi Outlet):</span>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={diagnosticChecks.diag1} 
                        onChange={(e) => setDiagnosticChecks({...diagnosticChecks, diag1: e.target.checked})}
                        className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500" 
                      />
                      <span className="text-slate-700">Pernah terjadi kasir menerima pesanan menu tertentu, namun koki dapur melapor bahwa bahannya sudah habis (overselling).</span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={diagnosticChecks.diag2} 
                        onChange={(e) => setDiagnosticChecks({...diagnosticChecks, diag2: e.target.checked})}
                        className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500" 
                      />
                      <span className="text-slate-700">Stock opname mingguan/bulanan sering menemukan selisih (variance) antara saldo komputer dan fisik di rak chiller/gudang.</span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={diagnosticChecks.diag3} 
                        onChange={(e) => setDiagnosticChecks({...diagnosticChecks, diag3: e.target.checked})}
                        className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500" 
                      />
                      <span className="text-slate-700">Dapur tidak memiliki pencatatan resmi saat daging hangus, telur tumpah, atau saus basi, sehingga kerugian tidak terhitung.</span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={diagnosticChecks.diag4} 
                        onChange={(e) => setDiagnosticChecks({...diagnosticChecks, diag4: e.target.checked})}
                        className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500" 
                      />
                      <span className="text-slate-700">Pemilik restoran kesulitan mengetahui Harga Pokok Penjualan (HPP) riil dan keuntungan bersih harian secara tepat waktu.</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Chapter 2: Simulasi Finansial & ROI */}
              <div id="brd-roi" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Kalkulator Finansial &amp; Proyeksi Balik Modal (ROI)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04]">
                    <span className="font-semibold text-slate-500 block">Omset Bulanan Resto:</span>
                    {formMode === 'fill' ? (
                      <input
                        type="number"
                        value={monthlyRevenue || ''}
                        onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                        placeholder="Contoh: 150000000"
                        className="w-full mt-1 bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900 text-xs"
                      />
                    ) : (
                      <span className="font-mono text-slate-700">Rp ____________________</span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04]">
                    <span className="font-semibold text-slate-500 block">Target Food Cost %:</span>
                    {formMode === 'fill' ? (
                      <input
                        type="number"
                        value={foodCostPct || ''}
                        onChange={(e) => setFoodCostPct(Number(e.target.value))}
                        placeholder="Contoh: 30"
                        className="w-full mt-1 bg-white border border-black/[0.08] rounded-xl px-3 py-1.5 font-mono font-bold text-slate-900 text-xs"
                      />
                    ) : (
                      <span className="font-mono text-slate-700">______ %</span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <span className="font-semibold text-emerald-800 block">Proyeksi Payback Period:</span>
                    <span className="text-lg font-bold font-mono text-emerald-700 block mt-1">
                      {monthlyRevenue > 0 ? `${paybackMonths} Bulan` : '< 3 Bulan (Target)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chapter 3: Swimlane Alur Bisnis */}
              <div id="brd-flow" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Peta Alur Kerja Swimlane Interkoneksi 4 Antarmuka Sistem
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  RestoSync menghubungkan seluruh titik operasional restoran secara instan:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/50">
                    <span className="font-bold text-amber-900 block text-xs">1. Kasir POS (FOH)</span>
                    <p className="text-[11px] text-slate-600 mt-1">Pemesanan meja, cek resep BOM otomatis, dan cetak bill.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/50">
                    <span className="font-bold text-emerald-900 block text-xs">2. KDS Dapur (BOH)</span>
                    <p className="text-[11px] text-slate-600 mt-1">Lonceng ting-ting, stopwatch SLA 12 menit, dan catat waste.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200/50">
                    <span className="font-bold text-cyan-900 block text-xs">3. Gudang &amp; Chiller</span>
                    <p className="text-[11px] text-slate-600 mt-1">Monitoring suhu HACCP 3.2°C, batch FEFO, dan Goods In.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/50">
                    <span className="font-bold text-blue-900 block text-xs">4. Dashboard BI</span>
                    <p className="text-[11px] text-slate-600 mt-1">Live omset, HPP real-time, alert ROP, dan audit ledger.</p>
                  </div>
                </div>

                {/* Embedded Swimlane Capture in Document */}
                {captureUrls?.swimlane && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Lampiran Visual 1: Diagram Swimlane Arsitektur Alur Sistem</span>
                      <span className="text-[10px] font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                        Disematkan di Dokumen Word (.docx)
                      </span>
                    </div>
                    <div 
                      onClick={() => setZoomedImage({ title: 'Diagram Swimlane Interkoneksi 4 Sistem', subtitle: 'POS ↔ KDS ↔ Gudang HACCP ↔ Dashboard', url: captureUrls.swimlane })}
                      className="relative rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-950 cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img src={captureUrls.swimlane} alt="Swimlane Alur Antar-Sistem" className="w-full h-auto" />
                      <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Perbesar Diagram</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chapter 4: UAT & Sign-off */}
              <div id="brd-signoff" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                    4
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Berita Acara &amp; Lembar Persetujuan BRD (Sign-Off)
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
                    <span className="font-bold text-slate-900 block">PIHAK RESTORAN (KLIEN)</span>
                    <p className="text-slate-600 text-[11px]">Outlet: {restaurantName || '[ ____________________ ]'}</p>
                    <p className="text-slate-600 text-[11px]">Nama PIC: {clientPicName || '[ ____________________ ]'}</p>
                    <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
                      <span className="text-[10px] text-slate-400">Tanda Tangan &amp; Cap Outlet</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
                    <span className="font-bold text-slate-900 block">PIHAK RESTOSYNC (PENGEMBANG)</span>
                    <p className="text-slate-600 text-[11px]">Perusahaan: RestoSync Solution Architecture Ltd</p>
                    <p className="text-slate-600 text-[11px]">Lead Architect: Solution Consultant Team</p>
                    <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
                      <span className="text-[10px] text-slate-400">Tanda Tangan Resmi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 2: FSD (FUNCTIONAL SPECIFICATION DOCUMENT) */}
          {/* ================================================================= */}
          {selectedDoc === 'fsd' && (
            <div className="space-y-6">
              {/* FSD Module 1: POS & BOM Check */}
              <div id="fsd-pos" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      F1
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Modul Kasir POS &amp; Validasi Kuota Resep BOM Instan
                      </h3>
                      <span className="text-xs text-slate-500">Sub-150ms Atomic Check &amp; Anti-Overselling</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Sistem Aktif
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Setiap item menu di layar kasir memiliki rumus Bill of Materials (BOM). Saat kasir menekan menu, sistem melakukan verifikasi ke database secara instan:
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                    <div className="p-2.5 rounded-xl bg-white border border-black/[0.05]">
                      <span className="font-bold text-slate-900 block">Katalog Menu Kasir</span>
                      Menampilkan foto, harga, dan badge kuota porsi riil ("Stok: 14 porsi").
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-black/[0.05]">
                      <span className="font-bold text-slate-900 block">Split Bill &amp; Meja</span>
                      Dukungan multi-meja, pemisahan pembayaran per tamu, dan QRIS instan.
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-rose-100">
                      <span className="font-bold text-rose-600 block">Auto Sold-Out Lock</span>
                      Jika 1 bahan resep habis, tombol menu langsung terkunci otomatis.
                    </div>
                  </div>
                </div>

                {/* Embedded POS Capture */}
                {captureUrls?.pos && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Lampiran Visual 2: Layar Touchscreen Kasir POS GastroStock</span>
                      <span className="text-[10px] font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                        Disematkan di Dokumen Word (.docx)
                      </span>
                    </div>
                    <div 
                      onClick={() => setZoomedImage({ title: 'Layar Touchscreen Kasir POS', subtitle: 'Katalog Menu & Validasi BOM Resep Instan', url: captureUrls.pos })}
                      className="relative rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-950 cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img src={captureUrls.pos} alt="Layar Kasir POS" className="w-full h-auto" />
                      <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Perbesar Layar Kasir</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FSD Module 2: Deficit Protection & Auto Sold Out */}
              <div id="fsd-deficit" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      F2
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Proteksi Defisit Stok &amp; Dialog Auto Sold-Out (ACID Rollback)
                      </h3>
                      <span className="text-xs text-slate-500">Pencegahan Overselling &amp; Notifikasi Antar-Sistem</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    ACID Protected
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Jika bahan baku kritis tidak mencukupi saat proses checkout, engine validasi transaksi secara atomik membatalkan (ROLLBACK) seluruh pesanan dan memicu dialog penolakan terisolasi di kasir:
                </p>

                {/* Embedded Insufficient Stock Capture */}
                {captureUrls?.insufficientStock && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Lampiran Visual 3: Dialog Peringatan Defisit &amp; Auto Sold-Out</span>
                      <span className="text-[10px] font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                        Disematkan di Dokumen Word (.docx)
                      </span>
                    </div>
                    <div 
                      onClick={() => setZoomedImage({ title: 'Proteksi Stok Kurang & Dialog Auto Sold-Out', subtitle: 'ACID Rollback & Pencegahan Overselling', url: captureUrls.insufficientStock })}
                      className="relative rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-950 cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img src={captureUrls.insufficientStock} alt="Proteksi Defisit & Auto Sold-Out" className="w-full h-auto" />
                      <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Perbesar Dialog Defisit</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FSD Module 3: KDS & Waste Logging */}
              <div id="fsd-kds" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    F3
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Kitchen Display System (KDS), SLA Timer &amp; Waste Logging
                    </h3>
                    <span className="text-xs text-slate-500">Monitor Koki, Lonceng Ting-Ting &amp; Runner Dispatch</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Menggantikan kertas struk dapur fisik dengan monitor tablet interaktif yang terhubung langsung ke kasir:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1.5">
                    <span className="font-bold text-slate-900 block">Lonceng Ting-Ting &amp; Stopwatch SLA</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Tablet berbunyi alarm audio saat tiket baru masuk. Koki klik "Mulai Masak" dan timer menghitung mundur SLA 12 menit.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/50 space-y-1.5">
                    <span className="font-bold text-rose-900 block">Tombol Cepat "Catat Waste Dapur"</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Koki dapat mencatat bahan rusak, tumpah, atau gosong langsung dari layar KDS. Database otomatis memotong saldo dengan mutasi <code>ADJUST_WASTE</code>.
                    </p>
                  </div>
                </div>

                {/* Embedded KDS Capture */}
                {captureUrls?.kds && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Lampiran Visual 4: Monitor Tablet Dapur KDS</span>
                      <span className="text-[10px] font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                        Disematkan di Dokumen Word (.docx)
                      </span>
                    </div>
                    <div 
                      onClick={() => setZoomedImage({ title: 'Layar Kitchen Display System (KDS)', subtitle: 'Stopwatch SLA 12 Menit & Lonceng Ting-Ting', url: captureUrls.kds })}
                      className="relative rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-950 cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img src={captureUrls.kds} alt="Layar Dapur KDS" className="w-full h-auto" />
                      <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Perbesar Layar KDS</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FSD Module 4: Storage HACCP & Chiller Monitoring */}
              <div id="fsd-warehouse" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                    F4
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Gudang, Storage HACCP 5 Zona &amp; Alokasi Batch FEFO
                    </h3>
                    <span className="text-xs text-slate-500">First-Expired-First-Out &amp; Auto Draf Purchase Order</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-lg">❄️</span>
                    <div className="font-bold text-slate-900 mt-1">Walk-in Chiller</div>
                    <div className="font-mono text-cyan-700 font-bold">3.2°C</div>
                    <div className="text-[10px] text-emerald-700">HACCP OK</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-lg">🧊</span>
                    <div className="font-bold text-slate-900 mt-1">Deep Freezer</div>
                    <div className="font-mono text-cyan-700 font-bold">-18.5°C</div>
                    <div className="text-[10px] text-emerald-700">Beku Maks</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-lg">📦</span>
                    <div className="font-bold text-slate-900 mt-1">Dry Storage</div>
                    <div className="font-mono text-cyan-700 font-bold">22.0°C</div>
                    <div className="text-[10px] text-emerald-700">Kering OK</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-lg">🍸</span>
                    <div className="font-bold text-slate-900 mt-1">Bar Beverage</div>
                    <div className="font-mono text-cyan-700 font-bold">19.5°C</div>
                    <div className="text-[10px] text-emerald-700">Sejuk OK</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-black/[0.04]">
                    <span className="text-lg">🔥</span>
                    <div className="font-bold text-slate-900 mt-1">Gas Bay</div>
                    <div className="font-mono text-cyan-700 font-bold">Safety OK</div>
                    <div className="text-[10px] text-emerald-700">Aman</div>
                  </div>
                </div>

                {/* Embedded Warehouse Capture */}
                {captureUrls?.warehouse && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Lampiran Visual 5: Gudang, Chiller HACCP &amp; Batch FEFO</span>
                      <span className="text-[10px] font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                        Disematkan di Dokumen Word (.docx)
                      </span>
                    </div>
                    <div 
                      onClick={() => setZoomedImage({ title: 'Gudang Storage HACCP & Alokasi Batch FEFO', subtitle: 'Monitoring Suhu Chiller 3.2°C & Reorder Point', url: captureUrls.warehouse })}
                      className="relative rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-950 cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img src={captureUrls.warehouse} alt="Gudang dan Chiller HACCP" className="w-full h-auto" />
                      <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Perbesar Layar Gudang</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FSD Module 5: Executive BI Dashboard */}
              <div id="fsd-dashboard" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    F5
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Executive BI Analytics &amp; Pelacak Kebocoran Margin
                    </h3>
                    <span className="text-xs text-slate-500">Live Omset, HPP Riil, Waste Tracker &amp; Audit Ledger</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Menyajikan data analitik operasional terpusat bagi pemilik restoran tanpa keterlambatan rekonsiliasi malam hari:
                </p>

                {/* Embedded Dashboard Capture */}
                {captureUrls?.dashboard && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Lampiran Visual 6: Dashboard Eksekutif BI Real-Time</span>
                      <span className="text-[10px] font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                        Disematkan di Dokumen Word (.docx)
                      </span>
                    </div>
                    <div 
                      onClick={() => setZoomedImage({ title: 'Dashboard Eksekutif Real-Time', subtitle: 'Live Omset, HPP (COGS), Spoilage & Audit Ledger', url: captureUrls.dashboard })}
                      className="relative rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-950 cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img src={captureUrls.dashboard} alt="Dashboard Eksekutif BI" className="w-full h-auto" />
                      <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Perbesar Dashboard BI</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FSD Module 6: RBAC Matrix */}
              <div id="fsd-rbac" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    F6
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Matriks Hak Akses Pengguna (Role-Based Access Control)
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black/[0.06] bg-slate-50">
                        <th className="p-2.5 font-bold text-slate-900">FITUR / MODUL</th>
                        <th className="p-2.5 font-bold text-slate-900">OWNER</th>
                        <th className="p-2.5 font-bold text-slate-900">MANAJER</th>
                        <th className="p-2.5 font-bold text-slate-900">KASIR</th>
                        <th className="p-2.5 font-bold text-slate-900">CHEF</th>
                        <th className="p-2.5 font-bold text-slate-900">GUDANG</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      <tr>
                        <td className="p-2.5 font-medium">Input Pesanan &amp; Checkout POS</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-slate-400">-</td>
                        <td className="p-2.5 text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Otorisasi Void / Diskon Meja</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-amber-600 font-bold">PIN Spv</td>
                        <td className="p-2.5 text-slate-400">-</td>
                        <td className="p-2.5 text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Monitor Tiket KDS &amp; SLA Dapur</td>
                        <td className="p-2.5 text-slate-600">Lihat</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-slate-600">Lihat</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Pencatatan Waste / Spoilage Dapur</td>
                        <td className="p-2.5 text-slate-600">Lihat</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-slate-400">-</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-slate-400">-</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Penerimaan Barang PO (Goods In)</td>
                        <td className="p-2.5 text-slate-600">Lihat</td>
                        <td className="p-2.5 text-emerald-700 font-bold">Approve</td>
                        <td className="p-2.5 text-slate-400">-</td>
                        <td className="p-2.5 text-slate-400">-</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Input QC</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-medium">Dashboard Omset &amp; COGS Real-Time</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-emerald-700 font-bold">✓ Penuh</td>
                        <td className="p-2.5 text-slate-400">-</td>
                        <td className="p-2.5 text-slate-400">-</td>
                        <td className="p-2.5 text-slate-400">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FSD Module 7: 10 Skenario Pengujian UAT */}
              <div id="fsd-uat" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    F7
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Matriks 10 Skenario UAT (User Acceptance Testing)
                    </h3>
                    <span className="text-xs text-slate-500">Kriteria Keberterimaan Fungsional Go-Live</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black/[0.06] bg-slate-50">
                        <th className="p-2.5 font-bold text-slate-900">ID</th>
                        <th className="p-2.5 font-bold text-slate-900">SKENARIO OPERASIONAL</th>
                        <th className="p-2.5 font-bold text-slate-900">KONDISI AWAL &amp; AKSI</th>
                        <th className="p-2.5 font-bold text-slate-900">HASIL YANG DIHARAPKAN</th>
                        <th className="p-2.5 font-bold text-slate-900">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-cyan-700">UAT-01</td>
                        <td className="p-2.5 font-bold">Checkout Normal Kasir</td>
                        <td className="p-2.5 text-slate-600">Stok cukup, kasir bayar order</td>
                        <td className="p-2.5 text-slate-700">Tiket KDS muncul, stok terpotong, omset bertambah</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-cyan-700">UAT-02</td>
                        <td className="p-2.5 font-bold">Proteksi Stok Kurang</td>
                        <td className="p-2.5 text-slate-600">Stok wagyu kurang saat checkout</td>
                        <td className="p-2.5 text-slate-700">Rollback atomik, popup merah, menu auto sold-out</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-cyan-700">UAT-03</td>
                        <td className="p-2.5 font-bold">Void Pesanan Kasir</td>
                        <td className="p-2.5 text-slate-600">Kasir batalkan menu salah input</td>
                        <td className="p-2.5 text-slate-700">Saldo stok kembali pulih, mutasi VOID tercatat</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-cyan-700">UAT-04</td>
                        <td className="p-2.5 font-bold">Customer Cancel Saat Masak</td>
                        <td className="p-2.5 text-slate-600">Bahan sudah terlanjur dipotong/dimasak</td>
                        <td className="p-2.5 text-slate-700">Tiket batal, biaya dibukukan sebagai waste kerugian</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-cyan-700">UAT-05</td>
                        <td className="p-2.5 font-bold">Pencatatan Waste Dapur KDS</td>
                        <td className="p-2.5 text-slate-600">Daging hangus saat di pan</td>
                        <td className="p-2.5 text-slate-700">Koki klik waste, stok dipotong mutasi ADJUST_WASTE</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-cyan-700">UAT-06</td>
                        <td className="p-2.5 font-bold">Penerimaan Goods In PO</td>
                        <td className="p-2.5 text-slate-600">Supplier kirim bahan dengan faktur</td>
                        <td className="p-2.5 text-slate-700">Stok bertambah, nomor batch FEFO &amp; kedaluwarsa masuk</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-cyan-700">UAT-07</td>
                        <td className="p-2.5 font-bold">Peringatan Suhu Chiller HACCP</td>
                        <td className="p-2.5 text-slate-600">Suhu chiller naik di atas 4.0°C</td>
                        <td className="p-2.5 text-slate-700">Sistem memicu indikator bahaya suhu di dashboard</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-cyan-700">UAT-08</td>
                        <td className="p-2.5 font-bold">Tutup Shift &amp; Settlement</td>
                        <td className="p-2.5 text-slate-600">Kasir input uang fisik blind count</td>
                        <td className="p-2.5 text-slate-700">Sistem bandingkan dengan omset sistem &amp; deteksi selisih</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-cyan-700">UAT-09</td>
                        <td className="p-2.5 font-bold">Multi-Channel Order Rush</td>
                        <td className="p-2.5 text-slate-600">Order kasir dan online masuk bersamaan</td>
                        <td className="p-2.5 text-slate-700">SELECT FOR UPDATE kunci stok antrean tanpa tabrakan</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-mono font-bold text-cyan-700">UAT-10</td>
                        <td className="p-2.5 font-bold">Ekspor Multi-Tab Draw.io</td>
                        <td className="p-2.5 text-slate-600">Download diagram 6 skenario</td>
                        <td className="p-2.5 text-slate-700">File .drawio terbuka dengan 6 tab terpisah sempurna</td>
                        <td className="p-2.5 text-emerald-700 font-bold">PASS</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* FSD Module 8: Lembar Persetujuan FSD */}
              <div id="fsd-signoff" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    F8
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Berita Acara &amp; Lembar Persetujuan FSD (Functional Sign-Off)
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
                    <span className="font-bold text-slate-900 block">PIHAK KLIEN (OUTLET RESTORAN)</span>
                    <p className="text-slate-600 text-[11px]">Nama Outlet: {restaurantName || '[ ____________________ ]'}</p>
                    <p className="text-slate-600 text-[11px]">PIC Operasional: {clientPicName || '[ ____________________ ]'}</p>
                    <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
                      <span className="text-[10px] text-slate-400">Tanda Tangan &amp; Cap Restoran</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
                    <span className="font-bold text-slate-900 block">PIHAK PENGEMBANG (RESTOSYNC)</span>
                    <p className="text-slate-600 text-[11px]">Perusahaan: RestoSync Solution Architecture Ltd</p>
                    <p className="text-slate-600 text-[11px]">Lead Solution Architect: Gastro Systems Engineering</p>
                    <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
                      <span className="text-[10px] text-slate-400">Tanda Tangan Resmi Pengembang</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 3: TSD (TECHNICAL SPECIFICATION DOCUMENT) */}
          {/* ================================================================= */}
          {selectedDoc === 'tsd' && (
            <div className="space-y-6">
              {/* TSD Section 0: Topologi Arsitektur Sistem */}
              <div id="tsd-cover" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                      T0
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Topologi Arsitektur Micro-Services &amp; Alur Data Sistem
                      </h3>
                      <span className="text-xs text-slate-500">React 18 SPA + Node.js Express + PostgreSQL 16 + Redis Pub/Sub</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    Latency &lt;150ms
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Arsitektur RestoSync mengadopsi pola event-driven dengan single authoritative PostgreSQL database untuk menjamin integritas stok dan konkurensi multi-kasir.
                </p>

                {/* Embedded Swimlane Architecture Capture */}
                {captureUrls?.swimlane && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-slate-700">Lampiran Visual Arsitektur: Peta Diagram Alur Antar-Sistem</span>
                      <span className="text-[10px] font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
                        Disematkan di Dokumen Word (.docx)
                      </span>
                    </div>
                    <div 
                      onClick={() => setZoomedImage({ title: 'Topologi Arsitektur Antar-Sistem', subtitle: 'POS ↔ KDS ↔ Gudang HACCP ↔ Dashboard BI', url: captureUrls.swimlane })}
                      className="relative rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-950 cursor-pointer group shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img src={captureUrls.swimlane} alt="Topologi Arsitektur Sistem" className="w-full h-auto" />
                      <div className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-[11px] font-bold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Perbesar Diagram</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TSD Section 1: Architecture & Concurrency */}
              <div id="tsd-concurrency" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      T1
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Kontrol Konkurensi &amp; Transaksi ACID Anti-Overselling
                      </h3>
                      <span className="text-xs text-slate-500">Pessimistic Row-Level Locking (SELECT FOR UPDATE)</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    PostgreSQL 16
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pada saat jam makan sibuk (*rush hour*), puluhan kasir dapat memicu pesanan secara bersamaan. RestoSync menerapkan transaksi ACID terisolasi menggunakan kueri penguncian baris:
                </p>

                <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto space-y-1">
                  <div className="text-cyan-400">-- TRANSAKSI CHECKOUT KASIR DENGAN ROW-LEVEL LOCKING</div>
                  <div className="text-amber-300">BEGIN TRANSACTION;</div>
                  <div className="text-slate-300">SELECT id, sku, current_stock FROM raw_materials WHERE id IN ('wagyu_meltique', 'beras') <span className="text-emerald-400 font-bold">FOR UPDATE;</span></div>
                  <div className="text-slate-400">-- Validasi stok fisik di level server. Jika defisit:</div>
                  <div className="text-rose-400">-- ROLLBACK; RETURN HTTP 409 Conflict;</div>
                  <div className="text-slate-300">UPDATE raw_materials SET current_stock = current_stock - 160 WHERE id = 'wagyu_meltique';</div>
                  <div className="text-slate-300">INSERT INTO stock_transactions (id, type, qty, ref) VALUES (gen_random_uuid(), 'OUT_SALE', 160, 'order_1082');</div>
                  <div className="text-amber-300">COMMIT;</div>
                </div>
              </div>

              {/* TSD Section 2: PostgreSQL DDL Script */}
              <div id="tsd-ddl" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      T2
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Skema Basis Data Relasional PostgreSQL (DDL Resmi)
                      </h3>
                      <span className="text-xs text-slate-500">Tabel Master Bahan, Resep BOM, Tiket Dapur &amp; Mutasi</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    8 Tabel Relasional
                  </span>
                </div>

                <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto max-h-72 scrollbar-thin">
                  <pre>{POSTGRESQL_DDL_SCRIPT.slice(0, 1600)}</pre>
                </div>
              </div>

              {/* TSD Section 3: REST API Contracts */}
              <div id="tsd-api" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    T3
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Spesifikasi REST API &amp; WebSocket Event Streaming (Sub-150ms)
                    </h3>
                    <span className="text-xs text-slate-500">Idempotency-Key &amp; Pub/Sub Channel</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold text-[10px]">POST</span>
                      <span className="font-mono font-bold text-slate-900">/api/v1/orders/checkout</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">Validasi resep BOM atomik, potong saldo stok, dan terbitkan tiket KDS.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono font-bold text-[10px]">POST</span>
                      <span className="font-mono font-bold text-slate-900">/api/v1/kitchen/waste</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">Input bahan rusak/gosong di KDS dapur dan bukukan kerugian finansial.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-[10px]">POST</span>
                      <span className="font-mono font-bold text-slate-900">/api/v1/inventory/goods-in</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">Penerimaan faktur PO supplier, registrasi batch FEFO, dan update saldo.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-mono font-bold text-[10px]">WS</span>
                      <span className="font-mono font-bold text-slate-900">/ws/inventory-stream</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">Event stream live: KITCHEN_TICKET_CREATED, STOCK_UPDATED, ROP_ALERT.</p>
                  </div>
                </div>
              </div>

              {/* TSD Section 4: Standar Format XML Multi-Tab Draw.io */}
              <div id="tsd-drawio" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      T4
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Standar Format XML Draw.io 6-Tab Multi-Diagram
                      </h3>
                      <span className="text-xs text-slate-500">Sekali Download Memuat 6 Skenario Operasional Restoran</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    mxGraphModel
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  File Draw.io diekspor dengan struktur <code>&lt;mxfile&gt;</code> yang membungkus 6 elemen <code>&lt;diagram id="..." name="..."&gt;</code> terpisah. Saat file dibuka di <strong>diagrams.net</strong>, pengguna langsung mendapatkan 6 tab navigasi di bagian bawah.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Unduh File Draw.io 6-Tab Lengkap:</span>
                    <span className="text-slate-500 text-[11px]">Memuat skenario: Happy Path, Kurang Stok, Void Kasir, Cancel Tamu, Tutup Shift &amp; Multi-Channel.</span>
                  </div>
                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab('swimlane')}
                      className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Buka Kanvas &amp; Unduh Draw.io</span>
                    </button>
                  )}
                </div>
              </div>

              {/* TSD Section 5: Lembar Tanda Tangan TSD */}
              <div id="tsd-signoff" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    T5
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Berita Acara &amp; Lembar Persetujuan TSD (Technical Sign-Off)
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
                    <span className="font-bold text-slate-900 block">PIHAK LEAD ARCHITECT / CTPO</span>
                    <p className="text-slate-600 text-[11px]">Nama: Enterprise Architecture Review Board</p>
                    <p className="text-slate-600 text-[11px]">Status: APPROVED ARCHITECTURE SPECIFICATION</p>
                    <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
                      <span className="text-[10px] text-slate-400">Tanda Tangan &amp; Cap Teknis</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
                    <span className="font-bold text-slate-900 block">PIHAK DEVOPS &amp; SECURITY INFRASTRUCTURE</span>
                    <p className="text-slate-600 text-[11px]">Sistem: Cloud PostgreSQL &amp; Redis Cluster</p>
                    <p className="text-slate-600 text-[11px]">Status: AUDITED &amp; PRODUCTION-READY</p>
                    <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
                      <span className="text-[10px] text-slate-400">Tanda Tangan Verifikasi DevOps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* VIEW 5: DEVELOPER STANDARDS & API DOCUMENTATION */}
          {/* ================================================================= */}
          {selectedDoc === 'developer' && (
            <DevDocumentSection
              restaurantName={restaurantName}
              clientPicName={clientPicName}
            />
          )}

          {/* ================================================================= */}
          {/* VIEW 6: OPS (USER MANUAL & SOP DEPLOYMENT / TROUBLESHOOTING) */}
          {/* ================================================================= */}
          {selectedDoc === 'ops' && (
            <OpsDocumentSection
              restaurantName={restaurantName}
              clientPicName={clientPicName}
              formMode={formMode}
              captureUrls={captureUrls}
              onZoomImage={(img) => setZoomedImage(img)}
            />
          )}

          {/* ================================================================= */}
          {/* VIEW 7: WORKBOOK 4-FASE (BLANKO ISIAN & PRINT TULIS TANGAN) */}
          {/* ================================================================= */}
          {selectedDoc === 'workbook' && (
            <div className="space-y-6">
              {/* Fase 1: Pre-Sales & Hardware */}
              <div id="wb-phase1" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                      W1
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Fase 1: Lembar Isian Hardware &amp; Kebutuhan Outlet
                      </h3>
                      <span className="text-xs text-slate-500">Format Blanko Siap Isi atau Cetak Fisik</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    Tanpa Data Dummy
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
                    <span className="font-bold text-slate-900 block">Stasiun Kasir POS:</span>
                    <div className="space-y-1 text-slate-600">
                      <div>Jumlah Unit Tablet: {formMode === 'fill' ? <input type="text" value={hardwareInventory.posUnit} onChange={(e) => setHardwareInventory({...hardwareInventory, posUnit: e.target.value})} className="w-16 px-2 py-0.5 rounded border text-xs" /> : '[ ____ ]'}</div>
                      <div>Nomor Seri (SN): {formMode === 'fill' ? <input type="text" value={hardwareInventory.posSn} onChange={(e) => setHardwareInventory({...hardwareInventory, posSn: e.target.value})} placeholder="Contoh: SN-IPAD-901" className="w-40 px-2 py-0.5 rounded border text-xs" /> : '[ ____________________ ]'}</div>
                      <div>Alamat IP: {formMode === 'fill' ? <input type="text" value={hardwareInventory.posIp} onChange={(e) => setHardwareInventory({...hardwareInventory, posIp: e.target.value})} className="w-32 px-2 py-0.5 rounded border text-xs" /> : '[ ____________________ ]'}</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
                    <span className="font-bold text-slate-900 block">Stasiun Dapur KDS:</span>
                    <div className="space-y-1 text-slate-600">
                      <div>Jumlah Unit Monitor: {formMode === 'fill' ? <input type="text" value={hardwareInventory.kdsUnit} onChange={(e) => setHardwareInventory({...hardwareInventory, kdsUnit: e.target.value})} className="w-16 px-2 py-0.5 rounded border text-xs" /> : '[ ____ ]'}</div>
                      <div>Nomor Seri (SN): {formMode === 'fill' ? <input type="text" value={hardwareInventory.kdsSn} onChange={(e) => setHardwareInventory({...hardwareInventory, kdsSn: e.target.value})} placeholder="Contoh: SN-TAB-KDS-01" className="w-40 px-2 py-0.5 rounded border text-xs" /> : '[ ____________________ ]'}</div>
                      <div>Printer LAN Dapur: {formMode === 'fill' ? <input type="text" value={hardwareInventory.printerDapurStatus} onChange={(e) => setHardwareInventory({...hardwareInventory, printerDapurStatus: e.target.value})} className="w-40 px-2 py-0.5 rounded border text-xs" /> : '[ ____________________ ]'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fase 2: Master Resep BOM Blanko */}
              <div id="wb-phase2" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      W2
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Fase 2: Formulir Resep Master Bill of Materials (BOM)
                      </h3>
                      <span className="text-xs text-slate-500">Lembar Isian Koki untuk Pendaftaran Menu &amp; Gramatur</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-black/[0.06] bg-slate-50">
                        <th className="p-2.5 font-bold text-slate-900">NAMA MENU RESTO</th>
                        <th className="p-2.5 font-bold text-slate-900">KATEGORI</th>
                        <th className="p-2.5 font-bold text-slate-900">BAHAN 1 &amp; GRAMATUR</th>
                        <th className="p-2.5 font-bold text-slate-900">BAHAN 2 &amp; GRAMATUR</th>
                        <th className="p-2.5 font-bold text-slate-900">ESTIMASI HPP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      {menus.map((m, idx) => (
                        <tr key={idx}>
                          <td className="p-2">
                            {formMode === 'fill' ? (
                              <input 
                                type="text" 
                                value={m.name} 
                                onChange={(e) => {
                                  const copy = [...menus];
                                  copy[idx].name = e.target.value;
                                  setMenus(copy);
                                }}
                                placeholder={`Menu #${idx + 1}`} 
                                className="w-full px-2 py-1 border rounded text-xs" 
                              />
                            ) : (
                              <span className="font-mono text-slate-500">[ ________________________ ]</span>
                            )}
                          </td>
                          <td className="p-2">
                            {formMode === 'fill' ? (
                              <input 
                                type="text" 
                                value={m.category} 
                                onChange={(e) => {
                                  const copy = [...menus];
                                  copy[idx].category = e.target.value;
                                  setMenus(copy);
                                }}
                                className="w-24 px-2 py-1 border rounded text-xs" 
                              />
                            ) : (
                              <span className="font-mono text-slate-500">[ ____________ ]</span>
                            )}
                          </td>
                          <td className="p-2">
                            {formMode === 'fill' ? (
                              <input 
                                type="text" 
                                value={m.b1} 
                                onChange={(e) => {
                                  const copy = [...menus];
                                  copy[idx].b1 = e.target.value;
                                  setMenus(copy);
                                }}
                                placeholder="Misal: Wagyu 80g" 
                                className="w-full px-2 py-1 border rounded text-xs" 
                              />
                            ) : (
                              <span className="font-mono text-slate-500">[ ________________________ ]</span>
                            )}
                          </td>
                          <td className="p-2">
                            {formMode === 'fill' ? (
                              <input 
                                type="text" 
                                value={m.b2} 
                                onChange={(e) => {
                                  const copy = [...menus];
                                  copy[idx].b2 = e.target.value;
                                  setMenus(copy);
                                }}
                                placeholder="Misal: Beras 180g" 
                                className="w-full px-2 py-1 border rounded text-xs" 
                              />
                            ) : (
                              <span className="font-mono text-slate-500">[ ________________________ ]</span>
                            )}
                          </td>
                          <td className="p-2">
                            {formMode === 'fill' ? (
                              <input 
                                type="text" 
                                value={m.hpp} 
                                onChange={(e) => {
                                  const copy = [...menus];
                                  copy[idx].hpp = e.target.value;
                                  setMenus(copy);
                                }}
                                placeholder="Rp" 
                                className="w-24 px-2 py-1 border rounded text-xs font-mono" 
                              />
                            ) : (
                              <span className="font-mono text-slate-500">Rp ____________</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-black/[0.06] flex items-center justify-between shrink-0 bg-slate-50/80">
              <div>
                <h4 className="font-bold text-sm sm:text-base text-slate-900">{zoomedImage.title}</h4>
                <p className="text-xs text-slate-500">{zoomedImage.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPngCapture(zoomedImage.title, zoomedImage.url)}
                  className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unduh PNG</span>
                </button>
                <button
                  onClick={() => setZoomedImage(null)}
                  className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-all"
                  title="Tutup (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body with Zoomable Image */}
            <div className="flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center">
              <img 
                src={zoomedImage.url} 
                alt={zoomedImage.title} 
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
