import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Database, 
  Radio, 
  Terminal, 
  Info, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ChevronRight, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Sun, 
  Moon, 
  Grid,
  Image as ImageIcon,
  AlertOctagon,
  ChefHat,
  LayoutDashboard,
  HelpCircle,
  Package,
  Trash2,
  BellRing,
  ShieldAlert,
  ArrowDownCircle,
  Truck
} from 'lucide-react';
import { SWIMLANE_SCENARIOS, SwimlaneScenarioPackage, SwimlaneNodeData, SwimlaneConnectorData } from '../data/swimlaneScenariosData';
import { generateDrawioXml, generateAllScenariosDrawioXml } from '../utils/drawioXmlGenerator';
import { downloadSvgFile, downloadPngFile } from '../utils/swimlaneSvgExporter';

export const SwimlaneDiagramViewer: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SWIMLANE_SCENARIOS[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [canvasTheme, setCanvasTheme] = useState<'light' | 'dark'>('light');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(0.92);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 15 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Draw.io export modal
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedXml, setCopiedXml] = useState<boolean>(false);
  const [activeFaqTab, setActiveFaqTab] = useState<'stok_kurang' | 'pesanan_dapur' | 'sync_dashboard' | 'waste_dapur' | 'goods_in'>('stok_kurang');

  const scenario = SWIMLANE_SCENARIOS.find((s) => s.id === selectedScenarioId) || SWIMLANE_SCENARIOS[0];

  // Set default selected node when switching
  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    const newSc = SWIMLANE_SCENARIOS.find((s) => s.id === id);
    setSelectedNodeId(newSc?.nodes[1]?.id || null);
    setZoom(0.92);
    setPan({ x: 20, y: 15 });
  };

  // Calculate cumulative Y for each lane
  const getLaneYOffsets = (lanes: SwimlaneScenarioPackage['lanes']) => {
    const offsets: { [laneId: string]: number } = {};
    let currentY = 0;
    lanes.forEach((l) => {
      offsets[l.id] = currentY;
      currentY += l.height;
    });
    return { offsets, totalHeight: currentY };
  };

  const { offsets: laneOffsets, totalHeight: laneTotalHeight } = getLaneYOffsets(scenario.lanes);

  // Compute dynamic width to comfortably fit rightmost nodes
  const maxNodeX = Math.max(...scenario.nodes.map((n) => n.x + n.width), 1200);
  const canvasWidth = Math.max(maxNodeX + 120, 1380);
  const canvasHeight = laneTotalHeight + 40;

  const selectedNode = scenario.nodes.find((n) => n.id === selectedNodeId) || null;

  // Zoom and Pan
  const handleZoomIn = () => setZoom((z) => Math.min(1.6, Number((z + 0.1).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, Number((z - 0.1).toFixed(2))));
  const handleReset = () => {
    setZoom(0.92);
    setPan({ x: 20, y: 15 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.swimlane-node')) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Port coordinate calculation
  const getPortCoord = (node: SwimlaneNodeData, port: 'top' | 'bottom' | 'left' | 'right') => {
    const laneY = laneOffsets[node.laneId] || 0;
    const globalY = laneY + node.y;

    switch (port) {
      case 'top':
        return { x: node.x + node.width / 2, y: globalY };
      case 'bottom':
        return { x: node.x + node.width / 2, y: globalY + node.height };
      case 'left':
        return { x: node.x, y: globalY + node.height / 2 };
      case 'right':
        return { x: node.x + node.width, y: globalY + node.height / 2 };
    }
  };

  // Orthogonal SVG Connector Renderer
  const renderConnector = (conn: SwimlaneConnectorData) => {
    const fromNode = scenario.nodes.find((n) => n.id === conn.fromId);
    const toNode = scenario.nodes.find((n) => n.id === conn.toId);
    if (!fromNode || !toNode) return null;

    const fromPort = conn.fromPort || 'right';
    const toPort = conn.toPort || 'left';
    const start = getPortCoord(fromNode, fromPort);
    const end = getPortCoord(toNode, toPort);

    let pathD = '';
    let labelPos = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };

    if (fromPort === 'bottom' && toPort === 'top') {
      if (Math.abs(start.x - end.x) < 8) {
        pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      } else {
        const midY = (start.y + end.y) / 2;
        pathD = `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
      }
      labelPos = { x: (start.x + end.x) / 2 + 16, y: (start.y + end.y) / 2 };
    } else if (fromPort === 'top' && toPort === 'bottom') {
      const midY = (start.y + end.y) / 2;
      pathD = `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
      labelPos = { x: (start.x + end.x) / 2 + 16, y: (start.y + end.y) / 2 };
    } else if (fromPort === 'right' && toPort === 'left') {
      if (Math.abs(start.y - end.y) < 8) {
        pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      } else {
        const midX = (start.x + end.x) / 2;
        pathD = `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
      }
      labelPos = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 - 10 };
    } else if (fromPort === 'right' && toPort === 'top') {
      pathD = `M ${start.x} ${start.y} L ${end.x} ${start.y} L ${end.x} ${end.y}`;
      labelPos = { x: (start.x + end.x) / 2, y: start.y - 10 };
    } else if (fromPort === 'bottom' && toPort === 'left') {
      pathD = `M ${start.x} ${start.y} L ${start.x} ${end.y} L ${end.x} ${end.y}`;
      labelPos = { x: start.x + 14, y: (start.y + end.y) / 2 };
    } else {
      pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }

    const isSelected = fromNode.id === selectedNodeId || toNode.id === selectedNodeId;

    const strokeColor = canvasTheme === 'light'
      ? (isSelected ? '#d97706' : '#475569')
      : (isSelected ? '#f59e0b' : '#64748b');

    return (
      <g key={`${conn.fromId}->${conn.toId}`}>
        {isSelected && (
          <path
            d={pathD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={4}
            strokeOpacity={0.3}
            strokeLinecap="round"
          />
        )}

        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.8}
          strokeDasharray={conn.isDashed ? '4 3' : undefined}
          markerEnd={isSelected ? 'url(#swimlane-arrow-active)' : 'url(#swimlane-arrow-default)'}
        />

        {conn.label && (
          <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
            <rect
              x={-conn.label.length * 3.6 - 5}
              y={-10}
              width={conn.label.length * 7.2 + 10}
              height={20}
              rx={4}
              fill={canvasTheme === 'light' ? '#ffffff' : '#090d16'}
              stroke={canvasTheme === 'light' ? '#cbd5e1' : '#334155'}
              strokeWidth={0.8}
            />
            <text
              textAnchor="middle"
              y={3.5}
              fontSize={10}
              fontWeight="700"
              fill={isSelected ? '#d97706' : (canvasTheme === 'light' ? '#334155' : '#fbbf24')}
              fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            >
              {conn.label}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Generate Draw.io XML for current scenario with current theme
  const getDrawioXmlContent = () => {
    return generateDrawioXml(
      `RestoSync - ${scenario.title}`,
      scenario.lanes.map((l) => ({ id: l.id, name: l.name, subname: l.subname, height: l.height })),
      scenario.nodes.map((n) => ({
        id: n.id,
        laneId: n.laneId,
        label: n.title,
        subtitle: n.subtitle,
        type: n.type,
        x: n.x,
        y: n.y,
        width: n.width,
        height: n.height,
        description: n.description,
        apiEndpoint: n.technicalDetails.apiEndpoint,
        sqlOperation: n.technicalDetails.sqlOperation
      })),
      scenario.connectors.map((c) => ({
        id: c.id,
        sourceId: c.fromId,
        targetId: c.toId,
        label: c.label,
        dashed: c.isDashed
      })),
      canvasTheme
    );
  };

  const [copiedAllXml, setCopiedAllXml] = useState<boolean>(false);
  const [exportScope, setExportScope] = useState<'all' | 'single'>('all');

  // Multi-tab Draw.io XML containing ALL scenarios
  const getAllScenariosDrawioXmlContent = () => {
    return generateAllScenariosDrawioXml(
      SWIMLANE_SCENARIOS.map((sc) => ({
        id: sc.id,
        title: sc.title,
        badge: sc.badge,
        lanes: sc.lanes.map((l) => ({ id: l.id, name: l.name, subname: l.subname, height: l.height })),
        nodes: sc.nodes.map((n) => ({
          id: n.id,
          laneId: n.laneId,
          label: n.title,
          subtitle: n.subtitle,
          type: n.type,
          x: n.x,
          y: n.y,
          width: n.width,
          height: n.height,
          description: n.description,
          apiEndpoint: n.technicalDetails.apiEndpoint,
          sqlOperation: n.technicalDetails.sqlOperation
        })),
        edges: sc.connectors.map((c) => ({
          id: c.id,
          sourceId: c.fromId,
          targetId: c.toId,
          label: c.label,
          dashed: c.isDashed
        }))
      })),
      canvasTheme
    );
  };

  const handleDownloadAllScenariosDrawio = () => {
    const xml = getAllScenariosDrawioXmlContent();
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restosync_swimlane_all_6_tabs.drawio`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyAllXml = () => {
    const xml = getAllScenariosDrawioXmlContent();
    navigator.clipboard.writeText(xml);
    setCopiedAllXml(true);
    setTimeout(() => setCopiedAllXml(false), 2000);
  };

  const handleDownloadDrawio = () => {
    const xml = getDrawioXmlContent();
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restosync_swimlane_${scenario.id}.drawio`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyXml = () => {
    const xml = getDrawioXmlContent();
    navigator.clipboard.writeText(xml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-cyan-700">Arsitektur Lintas Jalur (Cross-Functional)</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-medium">Swimlane Process Map (Sesuai Draw.io / diagrams.net)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Swimlane Diagram: Alur Integrasi Antar Sistem Restoran
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Memetakan alur kerja langsung antar 4 antarmuka sistem: <strong>Interface Kasir (POS)</strong> ↔ <strong>Interface Dapur (KDS)</strong> ↔ <strong>Interface Stok &amp; Gudang</strong> ↔ <strong>Dashboard Monitoring</strong>. Menjawab tuntas kasus stok tidak cukup, pesanan masuk dapur, hingga sinkronisasi dashboard.
            </p>
          </div>

          {/* Quick Direct Download Action Buttons */}
          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0 flex-wrap">
            {/* Primary Highlighted: Download ALL 6 Tabs in 1 File */}
            <button
              onClick={handleDownloadAllScenariosDrawio}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full transition-all shadow-sm ring-2 ring-amber-400/30 active:scale-95"
              title="Sekali klik: Download 1 file .drawio yang otomatis berisi semua 6 tab skenario lengkap untuk Draw.io!"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Download Semua Tab Draw.io</span>
              <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold tracking-tight">
                6 Tab .drawio
              </span>
            </button>

            <button
              onClick={handleDownloadDrawio}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all shadow-xs"
              title="Download hanya file skenario tab aktif ini (.drawio)"
            >
              <Download className="w-3.5 h-3.5 text-slate-700" />
              <span>Tab Ini Saja</span>
            </button>

            <button
              onClick={() => downloadSvgFile(scenario, canvasTheme)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all shadow-xs"
              title="Download file vektor SVG (persis 100% seperti di layar)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>SVG</span>
            </button>

            <button
              onClick={() => downloadPngFile(scenario, canvasTheme)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all shadow-xs"
              title="Download gambar PNG resolusi tinggi 2x (persis tema aktif)"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>PNG (2x)</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              title="Buka dialog ekspor & opsi Draw.io"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Scenario Tabs */}
        <div className="mt-5 pt-4 border-t border-black/[0.04] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {SWIMLANE_SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                    : 'bg-slate-50/80 border-black/[0.04] hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                  <span className={isSelected ? 'text-amber-400' : 'text-slate-500'}>
                    {sc.badge}
                  </span>
                  <span className={`font-mono ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>{sc.lanes.length} Lanes</span>
                </div>
                <div className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>{sc.title}</div>
                <div className={`text-[11px] line-clamp-1 mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{sc.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Case Explainer Callout Box */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-start gap-2.5">
          {scenario.id === 'scenario_insufficient_stock' ? (
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : scenario.id === 'scenario_kds_kitchen_flow' ? (
            <ChefHat className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : scenario.id === 'scenario_dashboard_sync' ? (
            <LayoutDashboard className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          ) : scenario.id === 'scenario_kitchen_waste' ? (
            <Trash2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : scenario.id === 'scenario_goods_in' ? (
            <Truck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-bold text-slate-900 text-xs block mb-0.5">Penjelasan Skenario Aktif: {scenario.title}</span>
            <p className="text-slate-600 leading-relaxed text-xs">
              {scenario.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <span className="text-[11px] text-slate-400 font-mono">
            {scenario.nodes.length} Kotak Simbol · {scenario.connectors.length} Panah
          </span>
        </div>
      </div>

      {/* Main Swimlane Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Area */}
        <div className={`space-y-4 ${selectedNode ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {/* Canvas Navigation Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2.5 flex items-center justify-between text-xs border-b">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">{scenario.badge}:</span>
              <span className="text-slate-300 text-xs truncate max-w-[260px] sm:max-w-md">
                {scenario.title}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Theme Toggle (Light / Dark) */}
              <button
                onClick={() => setCanvasTheme(canvasTheme === 'dark' ? 'light' : 'dark')}
                className={`p-1.5 rounded transition-colors text-slate-300 hover:text-white ${
                  canvasTheme === 'light' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800'
                }`}
                title={canvasTheme === 'dark' ? 'Beralih ke Tema Putih (Mirip Draw.io Default)' : 'Beralih ke Tema Gelap Blueprint'}
              >
                {canvasTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              {/* Grid Toggle */}
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-1.5 rounded transition-colors text-slate-300 hover:text-white ${
                  showGrid ? 'bg-slate-800 text-amber-400' : 'bg-transparent text-slate-500'
                }`}
                title="Toggle Grid Canvas"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-slate-800 mx-1" />

              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs text-slate-300 w-11 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white ml-1"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Swimlane Viewport */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className={`relative h-[620px] border border-slate-800 rounded-b-xl overflow-hidden cursor-grab active:cursor-grabbing select-none transition-colors ${
              canvasTheme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
            }`}
            style={{
              backgroundImage: showGrid 
                ? (canvasTheme === 'light' 
                    ? 'radial-gradient(circle, rgba(100, 116, 139, 0.25) 1px, transparent 1px)' 
                    : 'radial-gradient(circle, rgba(148, 163, 184, 0.15) 1px, transparent 1px)')
                : 'none',
              backgroundSize: '20px 20px',
              backgroundPosition: `${pan.x}px ${pan.y}px`
            }}
          >
            {/* Zoom / Pan container */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
                position: 'relative'
              }}
              className="transition-transform duration-75 ease-out"
            >
              {/* 1. SWIMLANE BACKGROUND ROWS & LEFT VERTICAL ACTOR STRIPS */}
              {scenario.lanes.map((lane, idx) => {
                const yPos = laneOffsets[lane.id] || 0;
                const isEven = idx % 2 === 0;

                const laneBg = canvasTheme === 'light'
                  ? (isEven ? 'bg-white' : 'bg-slate-50')
                  : (isEven ? 'bg-slate-950/40' : 'bg-slate-900/30');

                const stripBg = canvasTheme === 'light'
                  ? 'bg-slate-200 border-r border-slate-400 text-slate-800'
                  : 'bg-slate-900/95 border-r border-slate-700/80 text-white';

                const dividerBorder = canvasTheme === 'light' ? 'border-b border-slate-300' : 'border-b border-slate-800/80';

                return (
                  <div
                    key={lane.id}
                    style={{
                      position: 'absolute',
                      top: `${yPos}px`,
                      left: '0px',
                      width: `${canvasWidth}px`,
                      height: `${lane.height}px`
                    }}
                    className={`${dividerBorder} ${laneBg}`}
                  >
                    {/* LEFT VERTICAL ACTOR STRIP (Persis gambar draw.io referensi) */}
                    <div className={`absolute top-0 left-0 bottom-0 w-28 flex items-center justify-center p-2 z-10 shadow-sm ${stripBg}`}>
                      <div className="text-center transform -rotate-90 whitespace-nowrap">
                        <span className={`text-xs font-bold uppercase tracking-wider block ${lane.color}`}>
                          {lane.name}
                        </span>
                        <span className="text-[9px] text-slate-400 font-normal block">
                          {lane.subname}
                        </span>
                      </div>
                    </div>

                    {/* Subtle lane watermark number on the far right */}
                    <div className="absolute right-4 top-2 text-[10px] font-mono text-slate-400 uppercase pointer-events-none opacity-40">
                      LANE 0{idx + 1} // {lane.name.toUpperCase()}
                    </div>
                  </div>
                );
              })}

              {/* 2. SVG CONNECTORS LAYER (Cross-Lane Arrows) */}
              <svg
                className="absolute inset-0 pointer-events-none z-20"
                width={canvasWidth}
                height={canvasHeight}
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <marker
                    id="swimlane-arrow-default"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill={canvasTheme === 'light' ? '#475569' : '#64748b'} />
                  </marker>
                  <marker
                    id="swimlane-arrow-active"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 9 5 L 0 9 z" fill="#f59e0b" />
                  </marker>
                </defs>

                {scenario.connectors.map(renderConnector)}
              </svg>

              {/* 3. SWIMLANE NODES */}
              {scenario.nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const laneY = laneOffsets[node.laneId] || 0;
                const globalY = laneY + node.y;

                const nodeBorder = canvasTheme === 'light'
                  ? (isSelected ? 'border-2 border-amber-500 ring-2 ring-amber-400/40 shadow-lg' : 'border-2 border-slate-700 bg-white text-slate-900 shadow-sm')
                  : (isSelected ? 'border-2 border-amber-400 ring-2 ring-amber-400/30 shadow-lg' : 'border-2 border-slate-600 bg-slate-900 text-white shadow-md');

                const textColor = canvasTheme === 'light' ? 'text-slate-900' : 'text-white';
                const subtextColor = canvasTheme === 'light' ? 'text-slate-600' : 'text-slate-400';

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{
                      position: 'absolute',
                      left: `${node.x}px`,
                      top: `${globalY}px`,
                      width: `${node.width}px`,
                      height: `${node.height}px`
                    }}
                    className={`swimlane-node cursor-pointer z-30 transition-all duration-150 select-none ${
                      isSelected ? 'z-40' : 'hover:scale-[1.02]'
                    }`}
                  >
                    {/* SHAPE 1: TERMINATOR (Rounded Stadium Capsule) */}
                    {node.type === 'terminator' && (
                      <div className={`w-full h-full rounded-full flex flex-col items-center justify-center p-2 text-center ${nodeBorder}`}>
                        <span className={`text-xs font-bold ${textColor}`}>{node.title}</span>
                        {node.subtitle && (
                          <span className={`text-[10px] mt-0.5 ${subtextColor}`}>{node.subtitle}</span>
                        )}
                      </div>
                    )}

                    {/* SHAPE 2: DOCUMENT (Folded top-right corner) */}
                    {node.type === 'document' && (
                      <div className={`w-full h-full relative flex flex-col justify-center p-2.5 text-center ${nodeBorder}`}>
                        <div className={`absolute top-0 right-0 w-3.5 h-3.5 border-l-2 border-b-2 ${
                          canvasTheme === 'light' ? 'bg-slate-300 border-slate-700' : 'bg-slate-950 border-slate-600'
                        }`} />
                        <span className={`text-xs font-bold leading-tight ${textColor}`}>{node.title}</span>
                        {node.subtitle && (
                          <span className="text-[10px] text-amber-500 font-mono mt-0.5 block">{node.subtitle}</span>
                        )}
                      </div>
                    )}

                    {/* SHAPE 3: DATABASE CYLINDER */}
                    {node.type === 'database' && (
                      <div className={`w-full h-full relative rounded-b-xl flex flex-col justify-between p-2 ${nodeBorder}`}>
                        <div className={`w-full h-3.5 rounded-full border-2 -mt-2 mx-auto ${
                          canvasTheme === 'light' ? 'border-slate-700 bg-slate-200' : 'border-slate-600 bg-slate-800'
                        }`} />
                        <div className="my-auto text-center px-1">
                          <span className={`text-xs font-bold leading-tight block ${textColor}`}>{node.title}</span>
                          {node.subtitle && (
                            <span className="text-[9px] text-emerald-500 font-mono block mt-0.5">{node.subtitle}</span>
                          )}
                        </div>
                        <div className={`w-full h-1.5 rounded-b-full border-b -mb-1 ${
                          canvasTheme === 'light' ? 'border-slate-400' : 'border-slate-700'
                        }`} />
                      </div>
                    )}

                    {/* SHAPE 4: DECISION DIAMOND */}
                    {node.type === 'decision' && (
                      <div className="w-full h-full relative flex items-center justify-center p-1">
                        <div className={`absolute inset-2 rotate-45 border-2 shadow-md ${
                          canvasTheme === 'light' 
                            ? (isSelected ? 'border-amber-600 bg-amber-50' : 'border-amber-600 bg-white')
                            : (isSelected ? 'border-amber-400 bg-amber-950/70' : 'border-amber-500 bg-slate-900')
                        }`} />
                        <div className="relative z-10 text-center px-1">
                          <span className={`text-[11px] font-bold leading-tight block ${textColor}`}>
                            {node.title}
                          </span>
                          {node.subtitle && (
                            <span className="text-[9px] text-amber-500 font-mono block mt-0.5">
                              {node.subtitle}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* SHAPE 5: STANDARD PROCESS (Rounded Rectangle) */}
                    {node.type === 'process' && (
                      <div className={`w-full h-full rounded-lg flex flex-col justify-center items-center p-2 text-center ${nodeBorder}`}>
                        <span className={`text-xs font-bold leading-tight ${textColor}`}>{node.title}</span>
                        {node.subtitle && (
                          <span className={`text-[10px] font-mono mt-0.5 block ${subtextColor}`}>{node.subtitle}</span>
                        )}
                      </div>
                    )}

                    {/* Selection Blue Square Dots (Draw.io selection aesthetic) */}
                    {isSelected && (
                      <>
                        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-blue-500 border border-white shadow-xs pointer-events-none" />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 border border-white shadow-xs pointer-events-none" />
                        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 border border-white shadow-xs pointer-events-none" />
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-500 border border-white shadow-xs pointer-events-none" />
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom floating legend */}
            <div className={`absolute bottom-3 left-3 rounded-md px-3 py-1.5 text-[11px] pointer-events-none flex items-center gap-2 shadow-lg backdrop-blur-sm ${
              canvasTheme === 'light' ? 'bg-white/90 border border-slate-300 text-slate-700' : 'bg-slate-900/90 border border-slate-800 text-slate-400'
            }`}>
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Gunakan tombol download di atas untuk export persis tampilan kanvas ini (SVG, PNG, atau .drawio).</span>
            </div>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="lg:col-span-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {selectedNode.type.toUpperCase()} NODE
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">
                    {selectedNode.title}
                  </h3>
                  {selectedNode.subtitle && (
                    <span className="text-xs text-slate-400">{selectedNode.subtitle}</span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lane & Actor */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Jalur (Swimlane):</span>
                  <span className="font-semibold text-amber-400 mt-0.5 block">{selectedNode.actor}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Fungsi Operasional:</span>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>
              </div>

              {/* Technical Details */}
              {selectedNode.technicalDetails && (
                <div className="space-y-2 text-xs">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Spesifikasi Teknis:
                  </span>

                  {selectedNode.technicalDetails.protocol && (
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Protokol:</span>
                      <span className="font-mono text-cyan-400">{selectedNode.technicalDetails.protocol}</span>
                    </div>
                  )}

                  {selectedNode.technicalDetails.apiEndpoint && (
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">API Endpoint:</span>
                      <span className="font-mono text-emerald-400">{selectedNode.technicalDetails.apiEndpoint}</span>
                    </div>
                  )}

                  {selectedNode.technicalDetails.samplePayload && (
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] mb-1">Payload JSON:</span>
                      <pre className="font-mono text-amber-300 text-[10px] overflow-x-auto bg-slate-900 p-2 rounded">
                        {JSON.stringify(selectedNode.technicalDetails.samplePayload, null, 2)}
                      </pre>
                    </div>
                  )}

                  {selectedNode.technicalDetails.sqlOperation && (
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Query PostgreSQL:</span>
                      <pre className="font-mono text-emerald-300 text-[10px] overflow-x-auto mt-1 leading-relaxed">
                        {selectedNode.technicalDetails.sqlOperation}
                      </pre>
                    </div>
                  )}

                  {selectedNode.technicalDetails.edgeCase && (
                    <div className="p-2.5 rounded bg-rose-950/30 border border-rose-800/40 text-rose-200">
                      <span className="text-rose-400 block text-[10px] font-bold">Penanganan Kasus Gagal:</span>
                      <span className="text-[11px] mt-0.5 block">{selectedNode.technicalDetails.edgeCase}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DETAILED RESTAURANT OPERATIONAL CASES ACCORDION (Menjawab Pertanyaan Pengguna) */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Logika &amp; Alur Penanganan Kasus Restoran Lengkap
              </h2>
              <p className="text-xs text-slate-500">
                Panduan praktis lapangan untuk kasir, koki, manajer, dan pemilik outlet
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full self-start sm:self-auto border border-cyan-100">
            5 Kasus Operasional Utama
          </span>
        </div>

        {/* Tab Buttons for FAQ */}
        <div className="bg-slate-100/80 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => {
              setActiveFaqTab('stok_kurang');
              handleSelectScenario('scenario_insufficient_stock');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeFaqTab === 'stok_kurang' 
                ? 'bg-white text-slate-900 shadow-xs border border-black/[0.04]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>1. Stok Tidak Cukup Gimana?</span>
          </button>

          <button
            onClick={() => {
              setActiveFaqTab('pesanan_dapur');
              handleSelectScenario('scenario_kds_kitchen_flow');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeFaqTab === 'pesanan_dapur' 
                ? 'bg-white text-slate-900 shadow-xs border border-black/[0.04]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-500" />
            <span>2. Pesanan Masuk Dapur?</span>
          </button>

          <button
            onClick={() => {
              setActiveFaqTab('sync_dashboard');
              handleSelectScenario('scenario_dashboard_sync');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeFaqTab === 'sync_dashboard' 
                ? 'bg-white text-slate-900 shadow-xs border border-black/[0.04]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
            <span>3. Ke Dashboard Gimana?</span>
          </button>

          <button
            onClick={() => {
              setActiveFaqTab('waste_dapur');
              handleSelectScenario('scenario_kitchen_waste');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeFaqTab === 'waste_dapur' 
                ? 'bg-white text-slate-900 shadow-xs border border-black/[0.04]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-purple-500" />
            <span>4. Bahan Rusak / Waste Dapur?</span>
          </button>

          <button
            onClick={() => {
              setActiveFaqTab('goods_in');
              handleSelectScenario('scenario_goods_in');
            }}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeFaqTab === 'goods_in' 
                ? 'bg-white text-slate-900 shadow-xs border border-black/[0.04]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-emerald-500" />
            <span>5. Barang Masuk Supplier (Goods In)?</span>
          </button>
        </div>

        {/* Tab Content 1: Kalau Stok Tidak Cukup */}
        {activeFaqTab === 'stok_kurang' && (
          <div className="bg-slate-50/80 border border-black/[0.04] rounded-2xl p-5 sm:p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertOctagon className="w-4 h-4" />
              <span>Kasus 1: Penanganan Jika Stok Bahan Baku Tidak Mencukupi (Out of Stock / Defisit)</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Jika pelanggan memesan menu (misal: 2 Nasi Goreng Wagyu), sistem tidak langsung memotong stok membabi-buta, melainkan menjalankan protokol perlindungan transaksi:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white border border-black/[0.05] shadow-xs space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">1. Cek BOM Atomic</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  BOM Engine menghitung kebutuhan (Beras 360g, Wagyu 160g, Telur 2 butir). Daging Wagyu di database ternyata hanya tersisa 50g (defisit 110g).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-rose-100 shadow-xs space-y-1.5">
                <span className="font-bold text-rose-600 block text-xs">2. Rollback Transaksi DB</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Perintah <code className="bg-rose-50 text-rose-700 px-1 py-0.5 rounded font-mono">ROLLBACK;</code> dijalankan. Beras dan telur batal dipotong sepihak. Saldo stok aman 100% tanpa selisih.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-100 shadow-xs space-y-1.5">
                <span className="font-bold text-amber-600 block text-xs">3. Pop-up Kasir &amp; Sold-Out</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Layar kasir menampilkan pop-up merah: "Wagyu sisa 50g (Defisit 110g)". Tombol menu otomatis terkunci (Sold-Out) agar tidak dipesan tamu lain.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1.5">
                <span className="font-bold text-emerald-600 block text-xs">4. Solusi Kasir &amp; Gudang</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Kasir menawarkan menu pengganti (misal: Nasi Goreng Ayam Suwir). Sinyal alert dikirim ke gudang untuk membuka safety stock atau PO darurat.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Pesanan Masuk ke Dapur */}
        {activeFaqTab === 'pesanan_dapur' && (
          <div className="bg-slate-50/80 border border-black/[0.04] rounded-2xl p-5 sm:p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <ChefHat className="w-4 h-4" />
              <span>Kasus 2: Penanganan Pesanan Masuk ke Dapur (KDS Kitchen Display System)</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Begitu kasir menyelesaikan pembayaran, pesanan tidak perlu dicetak di kertas manual, melainkan mengalir otomatis ke stasiun koki:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white border border-black/[0.05] shadow-xs space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">1. Transmisi Sub-150ms</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Setelah DB Commit, Redis Pub/Sub memancarkan event <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">KITCHEN_TICKET_CREATED</code> via WebSocket ke monitor dapur tanpa jeda.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-cyan-100 shadow-xs space-y-1.5">
                <span className="font-bold text-cyan-700 block text-xs">2. Multi-Station Split</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Sistem memecah tiket: Item makanan masuk ke KDS Hot Kitchen koki, sedangkan minuman masuk ke KDS Barista secara independen.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-100 shadow-xs space-y-1.5">
                <span className="font-bold text-amber-600 block text-xs">3. Audio Chime &amp; SLA Timer</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Tablet dapur berbunyi lonceng "Ting-Ting!". Koki klik "Mulai Masak" dan stopwatch menyala hijau (Target: selesai &lt; 12 menit).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1.5">
                <span className="font-bold text-emerald-600 block text-xs">4. Panggilan Runner Otomatis</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Saat matang, koki tekan "Selesai Saji". Notifikasi getar langsung memanggil runner untuk mengambil piring di pass-bar dan diantar ke meja tamu.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: Ke Dashboard Gimana */}
        {activeFaqTab === 'sync_dashboard' && (
          <div className="bg-slate-50/80 border border-black/[0.04] rounded-2xl p-5 sm:p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <LayoutDashboard className="w-4 h-4" />
              <span>Kasus 3: Alur Sinkronisasi ke Dashboard Manajemen &amp; Pemilik Restoran</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Dashboard memantau kesehatan bisnis secara langsung (Real-Time Monitoring) tanpa perlu refresh browser:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white border border-black/[0.05] shadow-xs space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">1. Live Omset &amp; HPP (COGS)</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Tiap pesanan kasir langsung menambah omset dan menghitung harga pokok penjualan (HPP) dari total gramatur bahan yang keluar.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-rose-100 shadow-xs space-y-1.5">
                <span className="font-bold text-rose-600 block text-xs">2. Lampu Merah Alert ROP</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Jika sisa bahan &lt; Reorder Point (misal telur sisa 38 dari batas 40), dashboard menyalakan banner merah berkedip &amp; notifikasi peringatan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-purple-100 shadow-xs space-y-1.5">
                <span className="font-bold text-purple-600 block text-xs">3. Draf Purchase Order (PO)</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Sistem otomatis menyusun dokumen draf PO belanja ke supplier langganan. Manajer cukup 1-klik "Approve &amp; Kirim via WhatsApp/Email".
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1.5">
                <span className="font-bold text-emerald-600 block text-xs">4. Buku Besar Audit (Ledger)</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Setiap mutasi (OUT_SALE, IN_PURCHASE, WASTE) dicatat secara permanen dengan batch FIFO, timestamp mikrodetik, dan nomor referensi struk.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Bahan Rusak / Waste Dapur */}
        {activeFaqTab === 'waste_dapur' && (
          <div className="bg-slate-50/80 border border-black/[0.04] rounded-2xl p-5 sm:p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
              <Trash2 className="w-4 h-4" />
              <span>Kasus 4: Penanganan Bahan Rusak, Gosong, atau Tumpah di Dapur (Waste Logging)</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Jika saat memasak koki tidak sengaja menghanguskan daging atau menumpahkan telur, sistem mencegah selisih stok (stock opname variance):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white border border-black/[0.05] shadow-xs space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">1. Input Cepat di Layar KDS</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Koki menekan tombol "Catat Waste", memilih bahan (misal Telur 2 butir), dan memilih alasan (Gosong, Tumpah, atau Rusak Kemasan).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-amber-100 shadow-xs space-y-1.5">
                <span className="font-bold text-amber-600 block text-xs">2. Penyesuaian Stok Otomatis</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Database memotong saldo fisik dengan tipe mutasi <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">ADJUST_WASTE</code> sehingga jumlah di rak fisik dan komputer tetap sinkron 100%.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-rose-100 shadow-xs space-y-1.5">
                <span className="font-bold text-rose-600 block text-xs">3. Laporan Kerugian Finansial</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Dashboard menghitung nilai kerugian finansial (2 telur x Rp 2.200 = Rp 4.400) dan menampilkannya pada grafik Variance &amp; Spoilage Loss.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 5: Barang Masuk Supplier */}
        {activeFaqTab === 'goods_in' && (
          <div className="bg-slate-50/80 border border-black/[0.04] rounded-2xl p-5 sm:p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <Package className="w-4 h-4" />
              <span>Kasus 5: Penerimaan Barang Masuk dari Supplier (Goods In &amp; Registrasi Lot FEFO)</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Saat truk vendor tiba mengantarkan bahan baku pesanan restoran:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl bg-white border border-black/[0.05] shadow-xs space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">1. QC Fisik &amp; Suhu Chiller</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Staff gudang memeriksa temperatur daging (&lt; 4°C), mengecek keutuhan karung beras, dan mencocokkan surat jalan dengan purchase order.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-blue-100 shadow-xs space-y-1.5">
                <span className="font-bold text-blue-600 block text-xs">2. Registrasi Batch Lot FEFO</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Staff menginput nomor batch dan tanggal kadaluarsa. Sistem menjadwalkan agar bahan ini digunakan berdasarkan First-Expired-First-Out (FEFO).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-1.5">
                <span className="font-bold text-emerald-600 block text-xs">3. Update Moving Average Cost</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Sistem menghitung ulang bobot harga beli rata-rata bahan baku (Moving Average Unit Cost) dan memperbarui total nilai aset persediaan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DRAW.IO EXPORT MODAL (GastroStock Clean Theme) */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-black/[0.08] rounded-3xl p-6 sm:p-7 max-w-2xl w-full space-y-5 shadow-2xl text-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-xs">
                  DIO
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    Ekspor Swimlane ke Draw.io / Diagrams.net
                  </h3>
                  <span className="text-xs text-slate-500">
                    File XML resmi .drawio · Multi-tab terintegrasi (Tema: {canvasTheme.toUpperCase()})
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowExportModal(false)} 
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scope Selection Pills */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs">
              <button
                onClick={() => setExportScope('all')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2 ${
                  exportScope === 'all'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Download className="w-3.5 h-3.5 text-amber-500" />
                <span>Semua 6 Tab (Sekali Download)</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full">
                  Direkomendasikan
                </span>
              </button>
              <button
                onClick={() => setExportScope('single')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-2 ${
                  exportScope === 'single'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Hanya Tab Aktif ({scenario.badge})</span>
              </button>
            </div>

            {exportScope === 'all' ? (
              <div className="space-y-4 text-xs">
                {/* Multi-tab Explainer Banner */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-slate-800 space-y-2">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    <span>Sekali download langsung memuat 6 Tab ke Draw.io!</span>
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Satu file <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-200 font-bold">restosync_swimlane_all_6_tabs.drawio</code> ini telah dikemas dengan struktur <strong>Multi-Page (Multi-Tab)</strong> standar diagrams.net. Saat Anda buka file ini di Draw.io, di bagian bawah layar akan otomatis muncul 6 tab terpisah:
                  </p>
                  
                  {/* List of 6 tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-xl bg-white border border-amber-200/50 font-medium text-slate-800">
                      <span className="text-amber-700 font-bold block text-[10px]">Tab 1</span>
                      Checkout Normal (Happy Path)
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200/50 font-medium text-slate-800">
                      <span className="text-amber-700 font-bold block text-[10px]">Tab 2</span>
                      Stok Kurang &amp; Auto Sold-Out
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200/50 font-medium text-slate-800">
                      <span className="text-amber-700 font-bold block text-[10px]">Tab 3</span>
                      Alur Dapur &amp; Layar KDS
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200/50 font-medium text-slate-800">
                      <span className="text-amber-700 font-bold block text-[10px]">Tab 4</span>
                      Sinkron Dashboard &amp; Auto PO
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200/50 font-medium text-slate-800">
                      <span className="text-amber-700 font-bold block text-[10px]">Tab 5</span>
                      Goods In Supplier (FEFO)
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-amber-200/50 font-medium text-slate-800">
                      <span className="text-amber-700 font-bold block text-[10px]">Tab 6</span>
                      Waste &amp; Bahan Gosong Dapur
                    </div>
                  </div>
                </div>

                {/* Step Instructions */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-black/[0.04] space-y-1.5 text-slate-700">
                  <span className="font-bold text-slate-900 block text-xs">Cara Pakai di Draw.io / Diagrams.net:</span>
                  <div className="text-[11px] space-y-1 text-slate-600">
                    <div>1. Klik tombol emas <strong>Download Semua 6 Tab (.drawio)</strong>.</div>
                    <div>2. Buka browser ke <a href="https://app.diagrams.net" target="_blank" rel="noreferrer" className="text-cyan-700 underline font-semibold">app.diagrams.net</a>.</div>
                    <div>3. Drag file yang terunduh langsung ke kanvas Draw.io (atau klik <em>File &rarr; Open From &rarr; Device</em>).</div>
                    <div>4. Klik tab di bagian bawah layar Draw.io untuk berpindah skenario!</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200/60 text-slate-800 space-y-1">
                  <span className="font-bold text-cyan-900 block text-xs">
                    Ekspor Khusus: {scenario.title}
                  </span>
                  <p className="text-[11px] text-slate-600">
                    Mengunduh hanya 1 halaman diagram aktif ({scenario.nodes.length} kotak simbol &amp; {scenario.connectors.length} relasi panah).
                  </p>
                </div>

                {/* XML Preview */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-slate-500 text-[11px]">Preview XML Output:</span>
                    <button
                      onClick={handleCopyXml}
                      className="flex items-center gap-1 text-[11px] text-cyan-700 hover:text-cyan-900 font-bold"
                    >
                      {copiedXml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedXml ? 'XML Tersalin!' : 'Salin XML ke Clipboard'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-[10px] text-slate-600 bg-slate-50 p-3 rounded-2xl border border-black/[0.06] max-h-32 overflow-y-auto">
                    {getDrawioXmlContent()}
                  </pre>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2 flex-wrap">
                {exportScope === 'all' ? (
                  <>
                    <button
                      onClick={handleCopyAllXml}
                      className="px-4 py-2 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5"
                    >
                      {copiedAllXml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{copiedAllXml ? 'XML Semua Tab Tersalin!' : 'Salin XML Semua Tab'}</span>
                    </button>
                    <button
                      onClick={handleDownloadAllScenariosDrawio}
                      className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Download Semua 6 Tab (.drawio)</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => downloadSvgFile(scenario, canvasTheme)}
                      className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Download SVG</span>
                    </button>
                    <button
                      onClick={() => downloadPngFile(scenario, canvasTheme)}
                      className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Download PNG</span>
                    </button>
                    <button
                      onClick={handleDownloadDrawio}
                      className="px-5 py-2 rounded-full text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-950" />
                      <span>Download Tab Ini (.drawio)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
