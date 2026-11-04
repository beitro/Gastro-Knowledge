import React, { useState, useEffect } from 'react';
import {
  Layers,
  Smartphone,
  Monitor,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  ShoppingBag,
  ChefHat,
  ShieldCheck,
  LayoutDashboard,
  Warehouse,
  UtensilsCrossed,
  DollarSign,
  Lock,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  Sparkles,
  Maximize2,
  Search,
  Filter,
  Check,
  Copy,
  ArrowRight,
  TrendingUp,
  Cpu,
  FileText
} from 'lucide-react';
import { generateWireframeDocxBlob } from '../utils/wireframeDocxGenerator';
import { getAllCaptureDataUrls, SystemCaptureDataUrls } from '../utils/brdCaptureGenerator';
import { FigmaCanvasStudio } from './FigmaCanvasStudio';
import {
  copyFigmaSvgToClipboard,
  downloadFigmaSvgFile,
  downloadFigmaTokensJsonFile,
  downloadAllRolesFigmaSvgFile
} from '../utils/figmaExporter';

export type UserRole = 'kasir' | 'waiter' | 'kitchen' | 'manager' | 'owner' | 'gudang';
export type DisplayMode = 'prototype' | 'wireframe' | 'figma';

export const WireframePrototypeViewer: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRole>('kasir');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('prototype');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedFigmaToast, setCopiedFigmaToast] = useState<boolean>(false);
  const [captureUrls, setCaptureUrls] = useState<SystemCaptureDataUrls | null>(null);

  // Load High-Res captures for wireframe mockups
  useEffect(() => {
    try {
      const urls = getAllCaptureDataUrls();
      setCaptureUrls(urls);
    } catch (e) {
      console.warn('Failed to generate capture urls:', e);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // INTERACTIVE STATE FOR KASIR PROTOTYPE
  // ---------------------------------------------------------------------------
  const [selectedTable, setSelectedTable] = useState<number>(3);
  const [cartItems, setCartItems] = useState<Array<{ id: string; name: string; price: number; qty: number; modifier?: string }>>([
    { id: '1', name: 'Ayam Goreng Lengkuas', price: 38000, qty: 2, modifier: 'Pedas Level 2' },
    { id: '2', name: 'Nasi Liwet Solo', price: 12000, qty: 2 },
    { id: '3', name: 'Es Teh Manis', price: 8000, qty: 2, modifier: 'Less Ice' }
  ]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'edc'>('qris');
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState<boolean>(false);
  const [showSupervisorPinModal, setShowSupervisorPinModal] = useState<boolean>(false);
  const [supervisorPin, setSupervisorPin] = useState<string>('');
  const [supervisorPinError, setSupervisorPinError] = useState<boolean>(false);
  const [splitBillActive, setSplitBillActive] = useState<boolean>(false);
  const [splitGuests, setSplitGuests] = useState<number>(2);

  // Calculations for Kasir
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const service = subtotal * 0.05;
  const grandTotal = subtotal + tax + service;
  const splitPerPerson = grandTotal / splitGuests;

  const handleAddToCart = (item: { id: string; name: string; price: number }) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean) as any);
  };

  const handleCompleteOrder = () => {
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      setShowCheckoutSuccess(false);
      setCartItems([]);
    }, 3000);
  };

  const handleVerifySupervisorPin = () => {
    if (supervisorPin === '8888' || supervisorPin === '1234') {
      setShowSupervisorPinModal(false);
      setSupervisorPin('');
      setSupervisorPinError(false);
      alert('Otorisasi Supervisor Berhasil! Pembatalan/Void telah dicatat di Audit Log.');
    } else {
      setSupervisorPinError(true);
    }
  };

  // ---------------------------------------------------------------------------
  // INTERACTIVE STATE FOR KITCHEN KDS PROTOTYPE
  // ---------------------------------------------------------------------------
  const [kdsOrders, setKdsOrders] = useState([
    {
      id: 'ORD-101',
      table: 'Meja 04',
      time: '04:12',
      status: 'cooking' as 'queued' | 'cooking' | 'ready',
      items: [
        { name: 'Sate Ayam Madura (10 tusuk)', qty: 2, notes: 'Bumbu kacang pisah' },
        { name: 'Nasi Liwet Solo', qty: 2 }
      ],
      elapsedSec: 250
    },
    {
      id: 'ORD-102',
      table: 'Meja 07',
      time: '08:45',
      status: 'queued' as 'queued' | 'cooking' | 'ready',
      items: [
        { name: 'Iga Bakar Madu', qty: 1, notes: 'Sangat pedas' },
        { name: 'Sop Iga Kuah Bening', qty: 1 }
      ],
      elapsedSec: 520
    },
    {
      id: 'ORD-103',
      table: 'Meja 02',
      time: '13:20',
      status: 'ready' as 'queued' | 'cooking' | 'ready',
      items: [
        { name: 'Tahu Telur Surabaya', qty: 1 },
        { name: 'Es Cincau Hijau', qty: 2 }
      ],
      elapsedSec: 800
    }
  ]);

  const handleBumpKds = (orderId: string) => {
    setKdsOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        if (o.status === 'queued') return { ...o, status: 'cooking' };
        if (o.status === 'cooking') return { ...o, status: 'ready' };
        return null;
      }
      return o;
    }).filter(Boolean) as any);
  };

  // ---------------------------------------------------------------------------
  // DOWNLOAD WORD SPECIFICATION HANDLER
  // ---------------------------------------------------------------------------
  const handleDownloadDocx = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateWireframeDocxBlob({
        name: 'GastroStock Restoran',
        picName: 'Lead UI/UX Designer & Architect'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `RestoSync_UIUX_Wireframe_Prototype_Specification_v2.0.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess('WIREFRAME & PROTOTYPE (.DOCX)');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // FIGMA ACTIONS: COPY SVG & DOWNLOAD ASSETS
  // ---------------------------------------------------------------------------
  const handleCopyFigmaSvg = async (role: UserRole | 'all' = activeRole) => {
    const success = await copyFigmaSvgToClipboard(role as any);
    if (success) {
      setCopiedFigmaToast(true);
      setTimeout(() => setCopiedFigmaToast(false), 3500);
    }
  };

  const handleDownloadFigmaSvg = (role: UserRole | 'all' = activeRole) => {
    downloadFigmaSvgFile(role as any);
    setDownloadSuccess(`VECTOR SVG (${role.toUpperCase()})`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadTokens = () => {
    downloadFigmaTokensJsonFile();
    setDownloadSuccess('FIGMA DESIGN TOKENS (.JSON)');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ===================================================================== */}
      {/* TOP HEADER & CONTROL BAR */}
      {/* ===================================================================== */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-black/[0.05] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                Wireframe &amp; Working Prototype Multi-Role • Figma-Ready
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Desain Antarmuka Sistem Berdasarkan Peran Pengguna (Role-Based System)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Uji alur kerja nyata kasir, waiter, koki dapur, store manager, pemilik resto, hingga staff gudang, lengkap dengan kanvas dan aset export Figma.
            </p>
          </div>

          {/* Action Buttons: Download Word, Salin untuk Figma, & Display Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Download Docx Word */}
            <button
              onClick={handleDownloadDocx}
              disabled={isDownloading}
              className="py-2.5 px-3.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
              title="Unduh Spesifikasi UI/UX Lengkap 4-Fase dalam format Word"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{isDownloading ? 'Menyusun...' : 'Download Dokumen (.docx)'}</span>
            </button>

            {/* Quick Copy SVG for Figma */}
            <button
              onClick={() => handleCopyFigmaSvg(activeRole)}
              className="py-2.5 px-3.5 rounded-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Salin komponen vector aktif untuk langsung di-paste di Figma (Ctrl+V)"
            >
              {copiedFigmaToast ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFigmaToast ? 'Tersalin untuk Figma!' : 'Salin untuk Figma (Ctrl+V)'}</span>
            </button>

            {/* Download Figma SVG */}
            <button
              onClick={() => handleDownloadFigmaSvg(activeRole)}
              className="py-2.5 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 border border-black/[0.06] active:scale-95"
              title="Download file .svg untuk dibuka langsung di Figma"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Download SVG</span>
            </button>

            {/* Download Tokens */}
            <button
              onClick={handleDownloadTokens}
              className="py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 border border-black/[0.06] active:scale-95"
              title="Download Design Tokens Studio kompatibel dengan Figma"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tokens (.json)</span>
            </button>

            {/* Display Mode Toggle: 3 Modes (Prototype, Wireframe, Figma Studio) */}
            <div className="inline-flex rounded-full border border-black/[0.08] p-1 bg-slate-100 shadow-inner">
              <button
                onClick={() => setDisplayMode('prototype')}
                className={`px-3 py-1.5 text-xs rounded-full font-bold transition-all flex items-center gap-1.5 ${
                  displayMode === 'prototype'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-600" />
                <span>Prototype Interaktif</span>
              </button>
              <button
                onClick={() => setDisplayMode('wireframe')}
                className={`px-3 py-1.5 text-xs rounded-full font-bold transition-all flex items-center gap-1.5 ${
                  displayMode === 'wireframe'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Blueprint Wireframe</span>
              </button>
              <button
                onClick={() => setDisplayMode('figma')}
                className={`px-3 py-1.5 text-xs rounded-full font-bold transition-all flex items-center gap-1.5 ${
                  displayMode === 'figma'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#1ABCFE]" />
                <span>Figma Studio 2.0</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-cyan-500/20 text-cyan-700 font-extrabold">2.0</span>
              </button>
            </div>
          </div>
        </div>

        {/* Success Feedback Notification */}
        {downloadSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>File {downloadSuccess} berhasil disiapkan dan terunduh!</span>
          </div>
        )}

        {copiedFigmaToast && (
          <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-bold flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Vector SVG untuk peran <strong>{activeRole.toUpperCase()}</strong> berhasil disalin! Buka Figma lalu tekan <strong>Ctrl + V</strong> (atau <strong>Cmd + V</strong>).</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-700 bg-white px-2 py-0.5 rounded-full border border-cyan-200">
              PASTE READY
            </span>
          </div>
        )}

        {/* =================================================================== */}
        {/* ROLE SELECTOR: MASUK SEBAGAI ROLE APA? */}
        {/* =================================================================== */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-600" />
            <span>Pilih Peran Pengguna (Masuk Sebagai):</span>
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* Role 1: Kasir */}
            <button
              onClick={() => setActiveRole('kasir')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeRole === 'kasir'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                  : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-black/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <ShoppingBag className={`w-4 h-4 ${activeRole === 'kasir' ? 'text-amber-400' : 'text-slate-600'}`} />
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${activeRole === 'kasir' ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-700'}`}>
                  FOH POS
                </span>
              </div>
              <div className={`text-xs font-bold ${activeRole === 'kasir' ? 'text-white' : 'text-slate-900'}`}>
                1. Kasir Resto
              </div>
              <div className={`text-[10px] truncate ${activeRole === 'kasir' ? 'text-slate-300' : 'text-slate-500'}`}>
                Siti (Checkout &amp; Bill)
              </div>
            </button>

            {/* Role 2: Waiter */}
            <button
              onClick={() => setActiveRole('waiter')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeRole === 'waiter'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                  : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-black/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <UtensilsCrossed className={`w-4 h-4 ${activeRole === 'waiter' ? 'text-cyan-400' : 'text-slate-600'}`} />
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${activeRole === 'waiter' ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-200 text-slate-700'}`}>
                  TABLET
                </span>
              </div>
              <div className={`text-xs font-bold ${activeRole === 'waiter' ? 'text-white' : 'text-slate-900'}`}>
                2. Pramusaji
              </div>
              <div className={`text-[10px] truncate ${activeRole === 'waiter' ? 'text-slate-300' : 'text-slate-500'}`}>
                Budi (Meja &amp; Order)
              </div>
            </button>

            {/* Role 3: Kitchen Chef */}
            <button
              onClick={() => setActiveRole('kitchen')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeRole === 'kitchen'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                  : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-black/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <ChefHat className={`w-4 h-4 ${activeRole === 'kitchen' ? 'text-rose-400' : 'text-slate-600'}`} />
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${activeRole === 'kitchen' ? 'bg-rose-400/20 text-rose-300' : 'bg-slate-200 text-slate-700'}`}>
                  KDS BOH
                </span>
              </div>
              <div className={`text-xs font-bold ${activeRole === 'kitchen' ? 'text-white' : 'text-slate-900'}`}>
                3. Chef Dapur
              </div>
              <div className={`text-[10px] truncate ${activeRole === 'kitchen' ? 'text-slate-300' : 'text-slate-500'}`}>
                Chef Wayan (Tiket SLA)
              </div>
            </button>

            {/* Role 4: Store Manager */}
            <button
              onClick={() => setActiveRole('manager')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeRole === 'manager'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                  : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-black/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <ShieldCheck className={`w-4 h-4 ${activeRole === 'manager' ? 'text-purple-400' : 'text-slate-600'}`} />
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${activeRole === 'manager' ? 'bg-purple-400/20 text-purple-300' : 'bg-slate-200 text-slate-700'}`}>
                  PIN AUTH
                </span>
              </div>
              <div className={`text-xs font-bold ${activeRole === 'manager' ? 'text-white' : 'text-slate-900'}`}>
                4. Supervisor
              </div>
              <div className={`text-[10px] truncate ${activeRole === 'manager' ? 'text-slate-300' : 'text-slate-500'}`}>
                Doni (Void &amp; Closing)
              </div>
            </button>

            {/* Role 5: Owner Resto */}
            <button
              onClick={() => setActiveRole('owner')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeRole === 'owner'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                  : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-black/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <LayoutDashboard className={`w-4 h-4 ${activeRole === 'owner' ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${activeRole === 'owner' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-slate-200 text-slate-700'}`}>
                  LIVE BI
                </span>
              </div>
              <div className={`text-xs font-bold ${activeRole === 'owner' ? 'text-white' : 'text-slate-900'}`}>
                5. Owner Resto
              </div>
              <div className={`text-[10px] truncate ${activeRole === 'owner' ? 'text-slate-300' : 'text-slate-500'}`}>
                Hendra (Omset &amp; COGS)
              </div>
            </button>

            {/* Role 6: Staff Gudang */}
            <button
              onClick={() => setActiveRole('gudang')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                activeRole === 'gudang'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                  : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-black/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Warehouse className={`w-4 h-4 ${activeRole === 'gudang' ? 'text-blue-400' : 'text-slate-600'}`} />
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${activeRole === 'gudang' ? 'bg-blue-400/20 text-blue-300' : 'bg-slate-200 text-slate-700'}`}>
                  HACCP
                </span>
              </div>
              <div className={`text-xs font-bold ${activeRole === 'gudang' ? 'text-white' : 'text-slate-900'}`}>
                6. Gudang &amp; PO
              </div>
              <div className={`text-[10px] truncate ${activeRole === 'gudang' ? 'text-slate-300' : 'text-slate-500'}`}>
                Pak Joko (Batch FEFO)
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DISPLAY MODE 3: FIGMA STUDIO CANVAS (DIRECT VECTOR & TOKENS) */}
      {/* ===================================================================== */}
      {displayMode === 'figma' ? (
        <FigmaCanvasStudio
          initialRole={activeRole}
          onRoleChange={(r) => {
            if (r !== 'servicemodes') {
              setActiveRole(r);
            }
          }}
          onDownloadDocx={handleDownloadDocx}
        />
      ) : (
        <>
          {/* ===================================================================== */}
          {/* ROLE 1: KASIR RESTO (POINT OF SALE / POS) */}
          {/* ===================================================================== */}
          {activeRole === 'kasir' && (
        <div className="space-y-6">
          {displayMode === 'prototype' ? (
            /* INTERACTIVE WORKING PROTOTYPE: KASIR */
            <div className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Layar Kasir Interaktif (Live POS Terminal)
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    Terminal Kasir 01 — Restoran Mitra GastroStock
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Pilih Meja:</span>
                  {[1, 2, 3, 4, 5, 6].map((tbl) => (
                    <button
                      key={tbl}
                      onClick={() => setSelectedTable(tbl)}
                      className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                        selectedTable === tbl
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* POS Dual Column Grid: Menu Catalog (Left) + Cart Bill (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Menu Catalog Grid */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">Katalog Menu Terlaris (1-Klik Tambah ke Pesanan):</span>
                    <span className="text-slate-400">Sentuh item menu</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    {[
                      { id: '1', name: 'Ayam Goreng Lengkuas', price: 38000, tag: 'BOM: Ayam 0.25kg', cat: 'Makanan' },
                      { id: '2', name: 'Nasi Liwet Solo', price: 12000, tag: 'BOM: Beras 0.15kg', cat: 'Makanan' },
                      { id: '3', name: 'Es Teh Manis', price: 8000, tag: 'BOM: Teh & Gula', cat: 'Minuman' },
                      { id: '4', name: 'Sate Ayam Madura (10)', price: 35000, tag: 'BOM: Fillet 0.2kg', cat: 'Makanan' },
                      { id: '5', name: 'Iga Bakar Madu', price: 68000, tag: 'BOM: Iga Sapi 0.35kg', cat: 'Makanan' },
                      { id: '6', name: 'Jus Alpukat Kocok', price: 18000, tag: 'BOM: Alpukat 0.2kg', cat: 'Minuman' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleAddToCart(item)}
                        className="p-3.5 rounded-2xl border border-black/[0.06] bg-slate-50 hover:bg-white hover:border-black/[0.12] hover:shadow-sm text-left transition-all active:scale-95 group"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                          <span>{item.cat}</span>
                          <Plus className="w-3.5 h-3.5 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.name}</h4>
                        <div className="text-[11px] font-mono font-bold text-cyan-700 mt-1">
                          Rp {item.price.toLocaleString('id-ID')}
                        </div>
                        <span className="inline-block text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono mt-1.5">
                          {item.tag}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Quick Action Tools for Cashier */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-black/[0.04] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSplitBillActive(!splitBillActive)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          splitBillActive ? 'bg-cyan-600 text-white shadow-xs' : 'bg-white border text-slate-700'
                        }`}
                      >
                        {splitBillActive ? '✓ Mode Split Bill Aktif' : 'Fitur Split Bill'}
                      </button>

                      <button
                        onClick={() => setShowSupervisorPinModal(true)}
                        className="px-3 py-1.5 rounded-xl font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Otorisasi Void / Diskon</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      Shift Kasir: Aktif • Meja #{selectedTable}
                    </span>
                  </div>
                </div>

                {/* Right: Bill Basket & Payment Panel */}
                <div className="lg:col-span-5 bg-slate-50 border border-black/[0.05] rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-cyan-600" />
                      <span>Tagihan Meja 0{selectedTable} ({cartItems.length} Item)</span>
                    </span>
                    <button
                      onClick={() => setCartItems([])}
                      className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors"
                      title="Hapus seluruh isi keranjang"
                    >
                      Kosongkan
                    </button>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1 text-xs scrollbar-thin">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs">
                        Belum ada item dipilih. Sentuh menu di samping untuk menambahkan.
                      </div>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-white border border-black/[0.04] flex items-center justify-between gap-2 shadow-2xs">
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-slate-900 block truncate">{item.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              Rp {item.price.toLocaleString('id-ID')}
                            </span>
                            {item.modifier && (
                              <span className="text-[10px] text-amber-700 block italic">[{item.modifier}]</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleUpdateQty(item.id, -1)}
                              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="font-bold font-mono text-xs w-5 text-center">{item.qty}</span>
                            <button
                              onClick={() => handleUpdateQty(item.id, 1)}
                              className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Split Bill Calculator if Active */}
                  {splitBillActive && (
                    <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-cyan-900 font-bold">
                        <span>Bagi Rata Tagihan (Split Bill):</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setSplitGuests(Math.max(2, splitGuests - 1))}
                            className="w-5 h-5 rounded bg-cyan-200 text-cyan-900 font-bold flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="font-mono px-1 font-bold">{splitGuests} Orang</span>
                          <button
                            onClick={() => setSplitGuests(splitGuests + 1)}
                            className="w-5 h-5 rounded bg-cyan-200 text-cyan-900 font-bold flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-[11px] text-cyan-800 flex justify-between">
                        <span>Tagihan per orang:</span>
                        <span className="font-mono font-bold">Rp {Math.round(splitPerPerson).toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  )}

                  {/* Totals Breakdown */}
                  <div className="space-y-1.5 pt-2 border-t border-black/[0.05] text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal Menu:</span>
                      <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>PB1 Restoran (10%):</span>
                      <span className="font-mono">Rp {tax.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Service Charge (5%):</span>
                      <span className="font-mono">Rp {service.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-black/[0.04]">
                      <span>Total Tagihan:</span>
                      <span className="font-mono text-cyan-700">Rp {grandTotal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <button
                      onClick={() => setPaymentMethod('qris')}
                      className={`p-2 rounded-xl font-bold transition-all text-center ${
                        paymentMethod === 'qris'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      QRIS Dinamis
                    </button>
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-2 rounded-xl font-bold transition-all text-center ${
                        paymentMethod === 'cash'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Tunai (Cash)
                    </button>
                    <button
                      onClick={() => setPaymentMethod('edc')}
                      className={`p-2 rounded-xl font-bold transition-all text-center ${
                        paymentMethod === 'edc'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Mesin EDC
                    </button>
                  </div>

                  {/* Final Checkout Button */}
                  <button
                    onClick={handleCompleteOrder}
                    disabled={cartItems.length === 0}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Selesaikan Pembayaran &amp; Cetak Tiket</span>
                  </button>

                  {/* Success Toast */}
                  {showCheckoutSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-bounce">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Transaksi Berhasil! Tiket Dapur telah terkirim otomatis via LAN.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* WIREFRAME BLUEPRINT & COMPONENT ANATOMY: KASIR */
            <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.05] pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    WIREFRAME SPECIFICATION
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Anatomi Wireframe &amp; Layout Grid Kasir (POS Touchscreen)
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">RESOLUTION: 1920x1080 / 1280x800</span>
              </div>

              {captureUrls?.pos && (
                <div className="rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-950">
                  <img src={captureUrls.pos} alt="POS Wireframe Layout" className="w-full h-auto object-cover" />
                </div>
              )}

              {/* Wireframe Specifications Table */}
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/[0.06] bg-slate-50">
                      <th className="p-2.5 font-bold text-slate-900">ZONA TAMPILAN</th>
                      <th className="p-2.5 font-bold text-slate-900">KOMPONEN UI &amp; HIT-AREA</th>
                      <th className="p-2.5 font-bold text-slate-900">STATE KOMPONEN</th>
                      <th className="p-2.5 font-bold text-slate-900">UX RATIONALE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.04]">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Header Terminal</td>
                      <td className="p-2.5 text-slate-600">Status shift, nama kasir, jam server, nomor meja aktif.</td>
                      <td className="p-2.5 font-mono text-emerald-700">Static Online</td>
                      <td className="p-2.5 text-slate-600">Memberikan kepastian konektivitas dan station ID.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Katalog Menu Grid</td>
                      <td className="p-2.5 text-slate-600">Tombol menu 4-kolom, minimum hit-target 48px, foto item &amp; harga.</td>
                      <td className="p-2.5 font-mono text-cyan-700">Default / Active / Sold-Out</td>
                      <td className="p-2.5 text-slate-600">Mencegah salah klik saat peak hours kasir.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Panel Keranjang (Bill)</td>
                      <td className="p-2.5 text-slate-600">Daftar item belanja, tombol plus/minus kuantitas, breakdown pajak PB1.</td>
                      <td className="p-2.5 font-mono text-amber-700">Dynamic Scroll</td>
                      <td className="p-2.5 text-slate-600">Kasir dapat memverifikasi pesanan sebelum pembayaran.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">Metode Bayar</td>
                      <td className="p-2.5 text-slate-600">3 Tab: Tunai (uang pas/pecahan), QRIS Dinamis di layar, Mesin EDC.</td>
                      <td className="p-2.5 font-mono text-purple-700">Radio Toggle</td>
                      <td className="p-2.5 text-slate-600">Penyelesaian transaksi &lt; 15 detik per tamu.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* ROLE 2: WAITER / PRAMUSAJI LANTAI */}
      {/* ===================================================================== */}
      {activeRole === 'waiter' && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                Tablet Pramusaji (Floor Order Taking)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Navigasi Denah Meja &amp; Peringatan Bahan Habis (Sold-Out)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Device: Android Tablet 10"</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Visual Floor Map Wireframe */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.05] space-y-3">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-cyan-600" />
                <span>Denah Meja Lantai Restoran (Table Map):</span>
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { num: 'Meja 01', status: 'KOSONG', pax: '2 Pax', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                  { num: 'Meja 02', status: 'TERISI', pax: '4 Pax', color: 'bg-rose-50 text-rose-800 border-rose-300' },
                  { num: 'Meja 03', status: 'TERISI', pax: '3 Pax', color: 'bg-rose-50 text-rose-800 border-rose-300' },
                  { num: 'Meja 04', status: 'BILLING', pax: '2 Pax', color: 'bg-amber-50 text-amber-800 border-amber-300' },
                  { num: 'Meja 05', status: 'KOSONG', pax: '6 Pax', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                  { num: 'Meja 06', status: 'KOSONG', pax: '4 Pax', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' }
                ].map((t) => (
                  <div key={t.num} className={`p-3 rounded-2xl border text-center space-y-1 ${t.color}`}>
                    <span className="font-bold block text-xs">{t.num}</span>
                    <span className="text-[10px] block font-mono">{t.pax}</span>
                    <span className="text-[9px] font-bold block uppercase tracking-wider">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sold-out Real-time Guard */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.05] space-y-3">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Indikator Otomatis Menu "Habis" Berdasarkan Saldo BOM:</span>
              </span>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-rose-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Iga Bakar Madu</span>
                    <span className="text-[10px] text-rose-600">Stok Daging Iga di Dapur: 0.15 kg (Kurang)</span>
                  </div>
                  <span className="px-2 py-1 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                    AUTO SOLD OUT
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">Ayam Goreng Lengkuas</span>
                    <span className="text-[10px] text-emerald-600">Stok Ayam: 12.4 kg (Aman untuk 48 porsi)</span>
                  </div>
                  <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    TERSEDIA
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                *Waiter tidak dapat mengklik menu yang berstatus Sold Out sehingga komplain makanan batal dapat dicegah 100%.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ROLE 3: KITCHEN STAFF & HEAD CHEF (KDS) */}
      {/* ===================================================================== */}
      {activeRole === 'kitchen' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  Kitchen Display System (KDS)
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  Station: Dapur Masak Panas (Hot Kitchen) • SLA Target: &lt; 12 Menit
                </h3>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-400">Audio Alarm: ON 🔔</span>
          </div>

          {/* KDS Ticket Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kdsOrders.map((ord) => {
              const isOverdue = ord.elapsedSec > 720;
              const isWarning = ord.elapsedSec > 420 && ord.elapsedSec <= 720;
              const timerColor = isOverdue
                ? 'text-rose-400 border-rose-500/40 bg-rose-500/10'
                : isWarning
                ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                : 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';

              return (
                <div key={ord.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <span className="font-bold text-sm text-white">{ord.table}</span>
                      <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-xs border ${timerColor}`}>
                        ⏱ {Math.floor(ord.elapsedSec / 60)}:{(ord.elapsedSec % 60).toString().padStart(2, '0')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mb-2">
                      Order ID: <span className="font-mono text-slate-300">{ord.id}</span> • Status: <span className="font-bold uppercase text-cyan-400">{ord.status}</span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                          <div className="flex justify-between font-bold text-slate-200">
                            <span>{it.name}</span>
                            <span className="font-mono text-cyan-400">x{it.qty}</span>
                          </div>
                          {it.notes && (
                            <span className="text-[10px] text-amber-300 block mt-0.5 italic">⚠️ {it.notes}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* KDS Bump Bar Button */}
                  <button
                    onClick={() => handleBumpKds(ord.id)}
                    className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {ord.status === 'queued' && 'Mulai Memasak'}
                      {ord.status === 'cooking' && 'Selesai Masak (Panggil Waiter)'}
                      {ord.status === 'ready' && 'Sajikan ke Meja'}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ROLE 4: STORE MANAGER & SUPERVISOR */}
      {/* ===================================================================== */}
      {activeRole === 'manager' && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Otorisasi &amp; Audit Pengawasan (Store Manager)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                PIN Berjenjang, Pembatalan Void &amp; Rekapitulasi Z-Report
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Level: Supervisor Access</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-purple-600" />
                <span>Otorisasi PIN Berjenjang</span>
              </span>
              <p className="text-slate-600">
                Setiap void transaksi kasir, hapus pesanan dapur, atau diskon khusus staf wajib memasukkan 4-digit PIN supervisor.
              </p>
              <button
                onClick={() => setShowSupervisorPinModal(true)}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-purple-600 text-white font-bold transition-all hover:bg-purple-500"
              >
                Uji Modal PIN Supervisor
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Audit Selisih Kasir Shift</span>
              </span>
              <p className="text-slate-600">
                Perbandingan otomatis antara modal awal kasir + penerimaan tunai sistem vs uang fisik aktual di laci (Blind Count).
              </p>
              <div className="font-mono text-[11px] p-2 bg-white rounded-lg border border-black/[0.05]">
                Toleransi Maksimal: <span className="font-bold text-emerald-700">Rp 0 (Cocok)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-600" />
                <span>Cetak Lembar Z-Report</span>
              </span>
              <p className="text-slate-600">
                Pencetakan laporan penutupan shift kasir pada akhir operasional toko untuk ditandatangani kasir dan supervisor.
              </p>
              <span className="inline-block text-[10px] text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded font-bold">
                Auto-Synced to Cloud
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ROLE 5: OWNER RESTORAN (EXECUTIVE BI DASHBOARD) */}
      {/* ===================================================================== */}
      {activeRole === 'owner' && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Executive BI Dashboard (Mobile &amp; Web)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Live Omset, HPP Real-time &amp; Deteksi Kebocoran Margin
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ● Live Stream Sub-150ms
            </span>
          </div>

          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
              <span className="text-slate-500 font-medium">Total Omset Hari Ini (Gross):</span>
              <div className="text-lg font-bold font-mono text-slate-900">Rp 14.850.000</div>
              <span className="text-[10px] text-emerald-700 font-semibold">↑ +18.4% vs kemarin</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
              <span className="text-slate-500 font-medium">Food Cost % (HPP Riil):</span>
              <div className="text-lg font-bold font-mono text-cyan-700">28.4%</div>
              <span className="text-[10px] text-emerald-700 font-semibold">✓ Di bawah batas max (30%)</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
              <span className="text-slate-500 font-medium">Kerugian Waste Dapur:</span>
              <div className="text-lg font-bold font-mono text-rose-600">Rp 82.500</div>
              <span className="text-[10px] text-slate-500 font-mono">2 Insiden Spoilage</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
              <span className="text-slate-500 font-medium">Estimasi Laba Bersih:</span>
              <div className="text-lg font-bold font-mono text-emerald-700">Rp 5.240.000</div>
              <span className="text-[10px] text-emerald-700 font-semibold">Margin Bersih ~35.2%</span>
            </div>
          </div>

          {captureUrls?.dashboard && (
            <div className="rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-950">
              <img src={captureUrls.dashboard} alt="Executive Dashboard" className="w-full h-auto object-cover" />
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* ROLE 6: STAFF GUDANG & PROCUREMENT (HACCP) */}
      {/* ===================================================================== */}
      {activeRole === 'gudang' && (
        <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Gudang, Penerimaan PO &amp; HACCP Storage
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Pencatatan Batch FEFO &amp; Monitoring Suhu Chiller 3.2°C
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Inventory Level: 98% Normal</span>
          </div>

          {captureUrls?.warehouse && (
            <div className="rounded-2xl overflow-hidden border border-black/[0.08] bg-slate-950">
              <img src={captureUrls.warehouse} alt="Warehouse Storage" className="w-full h-auto object-cover" />
            </div>
          )}
        </div>
      )}
        </>
      )}

      {/* ===================================================================== */}
      {/* SUPERVISOR PIN AUTHORIZATION MODAL */}
      {/* ===================================================================== */}
      {showSupervisorPinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-black/[0.08] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Otorisasi Supervisor</h4>
                <p className="text-xs text-slate-500">Masukkan 4-digit PIN Manajer Toko</p>
              </div>
            </div>

            <div className="space-y-1">
              <input
                type="password"
                maxLength={4}
                value={supervisorPin}
                onChange={(e) => setSupervisorPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center text-2xl font-mono tracking-widest py-3 border border-black/[0.1] rounded-2xl focus:outline-purple-600"
              />
              <span className="text-[10px] text-slate-400 block text-center font-mono">
                PIN Demo: Ketik 8888 atau 1234
              </span>
            </div>

            {supervisorPinError && (
              <span className="text-xs text-rose-600 font-bold block text-center">
                PIN Salah! Silakan coba kembali.
              </span>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setShowSupervisorPinModal(false);
                  setSupervisorPin('');
                  setSupervisorPinError(false);
                }}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleVerifySupervisorPin}
                className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
