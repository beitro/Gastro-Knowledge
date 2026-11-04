import React, { useState } from 'react';
import {
  Layers,
  Smartphone,
  Monitor,
  Download,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  MousePointer,
  Square,
  Type,
  Hand,
  MessageSquare,
  Play,
  Share2,
  Sliders,
  Code,
  Palette,
  ExternalLink,
  ChevronDown,
  Info,
  CheckCircle2,
  Sparkles,
  FileText
} from 'lucide-react';
import {
  FigmaRoleKey,
  generateFigmaSvgForRole,
  generateAllRolesOverviewFigmaSvg,
  copyFigmaSvgToClipboard,
  downloadFigmaSvgFile,
  downloadFigmaTokensJsonFile,
  GASTROSTOCK_DESIGN_TOKENS
} from '../utils/figmaExporter';

interface FigmaCanvasStudioProps {
  initialRole?: FigmaRoleKey;
  onRoleChange?: (role: FigmaRoleKey) => void;
  onDownloadDocx?: () => void;
}

export const FigmaCanvasStudio: React.FC<FigmaCanvasStudioProps> = ({
  initialRole = 'kasir',
  onRoleChange,
  onDownloadDocx
}) => {
  const [selectedFrame, setSelectedFrame] = useState<FigmaRoleKey | 'all'>(initialRole);
  const [zoomLevel, setZoomLevel] = useState<number>(75);
  const [activeFigmaTool, setActiveFigmaTool] = useState<'select' | 'frame' | 'shape' | 'text' | 'hand' | 'comment'>('select');
  const [inspectorTab, setInspectorTab] = useState<'design' | 'inspect' | 'export'>('design');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Sync initialRole when changed externally
  React.useEffect(() => {
    if (initialRole) {
      setSelectedFrame(initialRole);
    }
  }, [initialRole]);

  // Frame metadata for Figma inspector
  const frameMeta: Record<FigmaRoleKey | 'all', { name: string; dim: string; autoLayout: string; targetDevice: string; roleDesc: string }> = {
    kasir: {
      name: 'Frame: FOH-Kasir-Checkout-POS',
      dim: '1440 × 900 px',
      autoLayout: 'Vertical & Horizontal Flex (Pad: 24, Gap: 16)',
      targetDevice: 'Desktop / All-in-One Touchscreen POS 15-21"',
      roleDesc: 'Alur Kasir: Menu Catalog, BOM Recipe validation, Cart, Split-Bill, PB1 & Service, Dynamic QRIS.'
    },
    waiter: {
      name: 'Frame: Waiter-Floor-Tablet',
      dim: '800 × 1280 px',
      autoLayout: 'Vertical Auto-Layout (Pad: 16, Gap: 12)',
      targetDevice: 'Android Tablet 10" / iPad 10.2"',
      roleDesc: 'Alur Pramusaji: Interactive Table Map (Kosong/Terisi/Billing), Input Order, Out-of-Stock Alert.'
    },
    kitchen: {
      name: 'Frame: Kitchen-KDS-Hotstation',
      dim: '1920 × 1080 px',
      autoLayout: 'Grid Multi-Ticket (Pad: 32, Gap: 24)',
      targetDevice: 'Commercial Smart TV / Touch KDS Monitor 24-32"',
      roleDesc: 'Alur Dapur: Real-time Ticket SLA Countdown (Green/Yellow/Red Overdue), Order Bump Action.'
    },
    manager: {
      name: 'Frame: Manager-Supervisor-Portal',
      dim: '1440 × 900 px',
      autoLayout: 'Centered Modal Overlay (Pad: 32, Gap: 20)',
      targetDevice: 'Store Manager Laptop / Backoffice Station',
      roleDesc: 'Alur Supervisor: PIN Authorization Modal (4-digit), Void Bill audit logging, Daily Closing.'
    },
    owner: {
      name: 'Frame: Owner-Executive-BI-Mobile',
      dim: '390 × 844 px',
      autoLayout: 'Vertical Stack Mobile (Pad: 20, Gap: 16)',
      targetDevice: 'iPhone 14/15 / Android Smartphone',
      roleDesc: 'Alur Pemilik: Live Gross Sales, Real-time COGS/HPP Food Cost %, Kitchen Waste Loss & Net Margin.'
    },
    gudang: {
      name: 'Frame: Gudang-HACCP-Receiving',
      dim: '1440 × 900 px',
      autoLayout: 'Table & List Auto-Layout (Pad: 24, Gap: 16)',
      targetDevice: 'Warehouse Terminal / Barcode Scanner Tablet',
      roleDesc: 'Alur Gudang: Goods Receiving PO, Batch FEFO lot tagging, Chiller 3.2°C Temperature monitor.'
    },
    servicemodes: {
      name: 'Frame: RestoSync-2.0-16-Service-Modes-Architecture',
      dim: '1920 × 1200 px',
      autoLayout: '5-Column Modular Architecture (Pad: 40, Gap: 20)',
      targetDevice: 'Enterprise Architecture Blueprint / Dev Meeting',
      roleDesc: 'Arsitektur RestoSync 2.0: 16 Model Layanan Resto, 6 Protokol (WSS, MQTT, Modbus, ESC/POS, SIP, REST), dan ACID Locking.'
    },
    all: {
      name: 'Frame: Master-Architecture-All-Roles-Canvas',
      dim: '4600 × 2400 px',
      autoLayout: 'Multi-Artboard Distributed Canvas with Inter-System Sync Lines',
      targetDevice: 'All Ecosystem Devices (Desktop, Tablet, TV, Mobile)',
      roleDesc: 'Arsitektur Lengkap: Menampilkan seluruh 6 peran sekaligus dalam satu canvas interaktif Figma.'
    }
  };

  const currentFrame = frameMeta[selectedFrame];

  // Copy SVG for direct Ctrl+V in Figma
  const handleCopyFigmaSvg = async () => {
    const success = await copyFigmaSvgToClipboard(selectedFrame);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3500);
    }
  };

  // Download SVG
  const handleDownloadSvg = () => {
    downloadFigmaSvgFile(selectedFrame);
    setDownloadSuccess('FILE VECTOR SVG');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  // Download Tokens
  const handleDownloadTokens = () => {
    downloadFigmaTokensJsonFile();
    setDownloadSuccess('FIGMA DESIGN TOKENS (.JSON)');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="bg-[#18181B] text-slate-200 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col font-sans">
      {/* ===================================================================== */}
      {/* FIGMA TOP NAVIGATION BAR */}
      {/* ===================================================================== */}
      <div className="bg-[#242428] border-b border-white/[0.08] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Left: Figma Brand & Document Title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-lg bg-black/40 border border-white/10">
            {/* Figma 4-color diamond logo representation */}
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F24E1E]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF7262]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1ABCFE]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ACF83]" />
            </div>
            <span className="text-[11px] font-bold text-white tracking-wider">FIGMA STUDIO</span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-white font-semibold">RestoSync-Restaurant-OS-v2.0.fig</span>
            <span className="text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/40 font-bold">
              RestoSync 2.0 NEW
            </span>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              Design System v2.0 (Saved)
            </span>
          </div>
        </div>

        {/* Center: Figma Toolbar Tools */}
        <div className="flex items-center bg-black/30 border border-white/10 rounded-xl p-0.5 text-xs">
          <button
            onClick={() => setActiveFigmaTool('select')}
            title="Move / Select (V)"
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeFigmaTool === 'select' ? 'bg-[#0284C7] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveFigmaTool('frame')}
            title="Frame Tool (F)"
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeFigmaTool === 'frame' ? 'bg-[#0284C7] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveFigmaTool('text')}
            title="Text Tool (T)"
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeFigmaTool === 'text' ? 'bg-[#0284C7] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveFigmaTool('hand')}
            title="Hand Tool (H)"
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeFigmaTool === 'hand' ? 'bg-[#0284C7] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveFigmaTool('comment')}
            title="Add Comment (C)"
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeFigmaTool === 'comment' ? 'bg-[#0284C7] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Zoom & Figma Actions */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Zoom Controls */}
          <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-1.5 py-0.5 space-x-1">
            <button
              onClick={() => setZoomLevel(Math.max(35, zoomLevel - 15))}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="font-mono text-[11px] text-slate-300 w-11 text-center font-bold">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => setZoomLevel(75)}
              className="px-1.5 py-0.5 text-[10px] bg-white/10 hover:bg-white/20 rounded text-slate-300 font-mono transition-colors"
              title="Fit to Screen"
            >
              Fit
            </button>
          </div>

          {/* Direct Figma Action: Salin SVG */}
          <button
            onClick={handleCopyFigmaSvg}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copySuccess ? 'Tersalin untuk Figma!' : 'Salin SVG (Ctrl+V)'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* RESTOSYNC 2.0 ANNOUNCEMENT BANNER */}
      {/* ===================================================================== */}
      <div className="bg-gradient-to-r from-[#082f49] via-[#0f172a] to-[#1e1b4b] border-b border-cyan-500/25 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-[10px] font-black tracking-wider uppercase shadow-xs">
            RESTOSYNC 2.0 UPGRADE
          </span>
          <span className="text-slate-200 font-medium">
            Sistem kini ditingkatkan ke <strong>RestoSync 2.0</strong>: Menghadirkan Frame <strong>16 Model Layanan Resto</strong>, integrasi 6 protokol hardware (WSS/MQTT/Modbus/SIP), dan Desain Token Studio 2.0.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSelectedFrame('servicemodes'); onRoleChange?.('servicemodes'); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFrame === 'servicemodes'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Lihat Blueprint 16 Model 2.0</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FIGMA FRAME ROLE SELECTOR TABS (MASUK SEBAGAI ROLE APA) */}
      {/* ===================================================================== */}
      <div className="bg-[#1C1C20] border-b border-white/[0.06] px-4 py-2 flex items-center justify-between gap-3 overflow-x-auto text-xs">
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mr-2">
            <Layers className="w-3 h-3 text-[#38BDF8]" />
            <span>Pilih Artboard Frame:</span>
          </span>

          <button
            onClick={() => { setSelectedFrame('kasir'); onRoleChange?.('kasir'); }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedFrame === 'kasir'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span>💻 1. Kasir POS</span>
            <span className="text-[10px] opacity-75 font-mono">1440×900</span>
          </button>

          <button
            onClick={() => { setSelectedFrame('waiter'); onRoleChange?.('waiter'); }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedFrame === 'waiter'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span>📱 2. Waiter Tablet</span>
            <span className="text-[10px] opacity-75 font-mono">800×1280</span>
          </button>

          <button
            onClick={() => { setSelectedFrame('kitchen'); onRoleChange?.('kitchen'); }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedFrame === 'kitchen'
                ? 'bg-[#EF4444] text-white shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span>📺 3. Dapur KDS</span>
            <span className="text-[10px] opacity-75 font-mono">1920×1080</span>
          </button>

          <button
            onClick={() => { setSelectedFrame('manager'); onRoleChange?.('manager'); }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedFrame === 'manager'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span>🔒 4. Supervisor</span>
            <span className="text-[10px] opacity-75 font-mono">1440×900</span>
          </button>

          <button
            onClick={() => { setSelectedFrame('owner'); onRoleChange?.('owner'); }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedFrame === 'owner'
                ? 'bg-[#D97706] text-white shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span>📊 5. Owner BI</span>
            <span className="text-[10px] opacity-75 font-mono">390×844</span>
          </button>

          <button
            onClick={() => { setSelectedFrame('gudang'); onRoleChange?.('gudang'); }}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedFrame === 'gudang'
                ? 'bg-[#0369A1] text-white shadow-xs'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <span>📦 6. Gudang FEFO</span>
            <span className="text-[10px] opacity-75 font-mono">1440×900</span>
          </button>

          {/* 7. NEW 2.0 SERVICE MODES ARTBOARD */}
          <button
            onClick={() => { setSelectedFrame('servicemodes'); onRoleChange?.('servicemodes'); }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFrame === 'servicemodes'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>⚡ 7. 16 Service Modes 2.0</span>
            <span className="text-[9px] px-1 py-0.2 rounded-full bg-cyan-400/20 text-cyan-200 font-mono">1920×1200</span>
          </button>

          <button
            onClick={() => setSelectedFrame('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedFrame === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs'
                : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Master All Frames Canvas</span>
          </button>
        </div>

        {/* Quick Guide Indicator */}
        <div className="flex items-center space-x-2 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-500/20 px-2.5 py-0.5 rounded-full shrink-0">
          <Info className="w-3 h-3" />
          <span>Bisa langsung di-paste di Figma (Ctrl+V)</span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FIGMA WORKSPACE: CANVAS (LEFT) + PROPERTIES INSPECTOR (RIGHT) */}
      {/* ===================================================================== */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 min-h-[640px]">
        {/* LEFT 9 COLS: FIGMA DOT GRID CANVAS WORKSPACE */}
        <div
          className="xl:col-span-8 2xl:col-span-9 p-6 overflow-auto flex items-center justify-center relative select-none"
          style={{
            backgroundColor: '#1E1E1E',
            backgroundImage: 'radial-gradient(#333333 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px'
          }}
        >
          {/* Active Frame Canvas Container with Transform Zoom */}
          <div
            className="transition-transform duration-200 origin-top shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10 rounded-2xl overflow-hidden bg-slate-900/90 relative"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              maxWidth: selectedFrame === 'all' ? '1200px' : selectedFrame === 'servicemodes' ? '1100px' : '960px'
            }}
          >
            {/* Figma Frame Top Label Badge */}
            <div className="bg-[#1E293B] border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                <span className="font-mono font-bold text-[#38BDF8]">{currentFrame.name}</span>
                <span className="text-[11px] text-slate-400">[{currentFrame.dim}]</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[11px] text-emerald-400">
                <span>{currentFrame.autoLayout}</span>
              </div>
            </div>

            {/* Embedded Live SVG Vector */}
            <div
              className="w-full h-auto overflow-hidden bg-[#0B0F19] flex items-center justify-center"
              dangerouslySetInnerHTML={{
                __html: selectedFrame === 'all'
                  ? generateAllRolesOverviewFigmaSvg()
                  : generateFigmaSvgForRole(selectedFrame)
              }}
            />
          </div>

          {/* Floating Canvas Quick Notice */}
          <div className="absolute bottom-4 left-6 z-10 bg-black/80 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Peran Aktif:</span>
            <span className="font-bold text-white">{currentFrame.name}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 text-[11px]">{currentFrame.targetDevice}</span>
          </div>
        </div>

        {/* RIGHT 3-4 COLS: FIGMA PROPERTIES INSPECTOR */}
        <div className="xl:col-span-4 2xl:col-span-3 bg-[#242428] border-l border-white/[0.08] flex flex-col justify-between text-xs">
          {/* Inspector Tabs */}
          <div>
            <div className="border-b border-white/[0.08] px-4 py-2 flex items-center justify-between">
              <div className="inline-flex rounded-lg bg-black/40 p-0.5 border border-white/10 w-full">
                <button
                  onClick={() => setInspectorTab('design')}
                  className={`flex-1 py-1.5 text-center font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                    inspectorTab === 'design' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Design</span>
                </button>
                <button
                  onClick={() => setInspectorTab('inspect')}
                  className={`flex-1 py-1.5 text-center font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                    inspectorTab === 'inspect' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
                <button
                  onClick={() => setInspectorTab('export')}
                  className={`flex-1 py-1.5 text-center font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                    inspectorTab === 'export' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: DESIGN TOKENS & AUTO-LAYOUT PROPERTIES */}
            {inspectorTab === 'design' && (
              <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto">
                {/* Frame Geometry */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Frame Layout &amp; Geometry</span>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="bg-black/30 border border-white/10 p-2 rounded-xl">
                      <span className="text-slate-500 block text-[9px]">DIMENSIONS:</span>
                      <span className="text-white font-bold">{currentFrame.dim}</span>
                    </div>
                    <div className="bg-black/30 border border-white/10 p-2 rounded-xl">
                      <span className="text-slate-500 block text-[9px]">CORNER RADIUS:</span>
                      <span className="text-white font-bold">16px (Auto)</span>
                    </div>
                  </div>
                </div>

                {/* Auto Layout Configuration */}
                <div className="space-y-2 border-t border-white/[0.08] pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Auto Layout Properties</span>
                  <div className="bg-black/30 border border-white/10 p-3 rounded-xl space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Direction:</span>
                      <span className="text-cyan-400 font-bold">Vertical / Flex Grid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Resizing:</span>
                      <span className="text-slate-200">Hug Contents / Fill</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Padding:</span>
                      <span className="font-mono text-emerald-400">24px (Top/Bottom/Sides)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Item Spacing (Gap):</span>
                      <span className="font-mono text-amber-400">16px (Grid 8pt)</span>
                    </div>
                  </div>
                </div>

                {/* Color Styles / Swatches */}
                <div className="space-y-2 border-t border-white/[0.08] pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Figma Color Styles</span>
                  <div className="space-y-1.5">
                    {[
                      { name: 'brandPrimary', hex: '#0F2942', label: 'Corporate Deep Navy' },
                      { name: 'brandSecondary', hex: '#0284C7', label: 'Tech Cyan Blue' },
                      { name: 'brandSuccess', hex: '#059669', label: 'Emerald Lunas / Aman' },
                      { name: 'brandAccent', hex: '#D97706', label: 'Amber Peringatan' },
                      { name: 'brandDanger', hex: '#DC2626', label: 'Rose Defisit Habis' },
                      { name: 'brandPurple', hex: '#7C3AED', label: 'Violet PIN Supervisor' }
                    ].map(c => (
                      <div key={c.name} className="flex items-center justify-between p-1.5 rounded-lg bg-black/20 hover:bg-black/40 border border-white/5">
                        <div className="flex items-center space-x-2">
                          <span className="w-3.5 h-3.5 rounded-md border border-white/20" style={{ backgroundColor: c.hex }} />
                          <span className="text-slate-200 font-medium">{c.label}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">{c.hex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Role Description Note */}
                <div className="border-t border-white/[0.08] pt-3 text-[11px] text-slate-400 bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                  <span className="font-bold text-slate-200 block">Keterangan Alur Peran:</span>
                  <p>{currentFrame.roleDesc}</p>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: INSPECT / CSS CODE */}
            {inspectorTab === 'inspect' && (
              <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto font-mono text-[11px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                  CSS / Tailwind Properties for Developer
                </span>
                <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-slate-300 space-y-2 overflow-x-auto">
                  <p className="text-cyan-400">/* Auto-Layout Container */</p>
                  <p>display: flex;</p>
                  <p>flex-direction: column;</p>
                  <p>padding: 24px;</p>
                  <p>gap: 16px;</p>
                  <p>border-radius: 16px;</p>
                  <p>background: #FFFFFF;</p>
                  <p>box-shadow: 0 4px 20px rgba(0,0,0,0.06);</p>
                  <p className="text-cyan-400 mt-2">/* Tailwind Classes */</p>
                  <p className="text-emerald-400">flex flex-col p-6 gap-4 rounded-2xl bg-white shadow-sm border border-slate-200</p>
                </div>

                <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-slate-300 space-y-1 overflow-x-auto">
                  <p className="text-amber-400">/* Minimum Touch Hit-Target */</p>
                  <p>min-height: 48px;</p>
                  <p>touch-action: manipulation;</p>
                  <p>cursor: pointer;</p>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: EXPORT & FIGMA COMPATIBILITY ACTIONS */}
            {inspectorTab === 'export' && (
              <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Export Langsung ke Figma
                </span>

                {/* Primary Action 1: Copy SVG */}
                <button
                  onClick={handleCopyFigmaSvg}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copySuccess ? 'SVG Berhasil Disalin ke Clipboard!' : '1. Salin SVG untuk Figma (Ctrl+V)'}</span>
                </button>

                {/* Primary Action 2: Download SVG */}
                <button
                  onClick={handleDownloadSvg}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>2. Download File Vector SVG (.svg)</span>
                </button>

                {/* Primary Action 3: Download Figma Tokens JSON */}
                <button
                  onClick={handleDownloadTokens}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
                >
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>3. Download Design Tokens (.json)</span>
                </button>

                {/* Primary Action 4: Download Word Specification */}
                {onDownloadDocx && (
                  <button
                    onClick={onDownloadDocx}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>4. Download Dokumen Word (.docx)</span>
                  </button>
                )}

                {/* Notification Toast */}
                {downloadSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Berhasil mendownload: {downloadSuccess}!</span>
                  </div>
                )}

                {/* Step-by-Step Instructions */}
                <div className="bg-black/30 border border-white/10 rounded-xl p-3 text-[11px] text-slate-300 space-y-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Cara Pakai di Figma:
                  </span>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400">
                    <li>Klik <strong className="text-white">"Salin SVG untuk Figma"</strong> di atas.</li>
                    <li>Buka tab baru <strong className="text-white">figma.com</strong> atau aplikasi Figma desktop.</li>
                    <li>Di dalam kanvas Figma, tekan <kbd className="px-1.5 py-0.5 bg-black/60 rounded text-cyan-300 font-mono">Ctrl + V</kbd> (atau <kbd className="px-1.5 py-0.5 bg-black/60 rounded text-cyan-300 font-mono">Cmd + V</kbd> di Mac).</li>
                    <li>Semua frame, kartu, tombol, dan teks langsung berubah menjadi vector layer Figma yang dapat diedit!</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Footer Notice */}
          <div className="p-3 border-t border-white/[0.08] text-[10px] text-slate-500 flex items-center justify-between">
            <span>Figma Tokens Studio v2.0 Compatible</span>
            <span className="font-mono text-slate-400">W3C Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
