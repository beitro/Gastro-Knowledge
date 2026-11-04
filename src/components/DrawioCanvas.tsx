import React, { useState, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Grid, 
  Layers, 
  MousePointer, 
  Database, 
  Radio, 
  Terminal, 
  Check, 
  X, 
  Sparkles,
  Info
} from 'lucide-react';
import { FlowModuleConfig, FlowNode } from '../types/inventory';

interface DrawioCanvasProps {
  moduleConfig: FlowModuleConfig;
  activeNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
}

export const DrawioCanvas: React.FC<DrawioCanvasProps> = ({
  moduleConfig,
  activeNodeId,
  onSelectNode
}) => {
  const [zoom, setZoom] = useState<number>(0.95);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Calculate canvas bounding box
  const nodes = moduleConfig.nodes;
  const maxX = Math.max(...nodes.map((n) => (n.x || 0) + (n.width || 170))) + 120;
  const maxY = Math.max(...nodes.map((n) => (n.y || 0) + (n.height || 75))) + 140;
  const canvasWidth = Math.max(1280, maxX);
  const canvasHeight = Math.max(520, maxY);

  const handleZoomIn = () => setZoom((z) => Math.min(1.6, Number((z + 0.1).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, Number((z - 0.1).toFixed(2))));
  const handleResetView = () => {
    setZoom(0.95);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drawio-node')) return;
    setIsPanning(true);
    startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPanRef.current.x,
      y: e.clientY - startPanRef.current.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Helper to get center point or anchor ports of a node
  const getNodePorts = (node: FlowNode) => {
    const x = node.x || 0;
    const y = node.y || 0;
    const w = node.width || 170;
    const h = node.height || 75;

    return {
      top: { x: x + w / 2, y },
      bottom: { x: x + w / 2, y: y + h },
      left: { x, y: y + h / 2 },
      right: { x: x + w, y: y + h / 2 },
      center: { x: x + w / 2, y: y + h / 2 }
    };
  };

  // Helper to generate orthogonal connector path between two nodes
  const renderConnector = (fromNode: FlowNode, toNode: FlowNode, label?: string, isNegativeBranch?: boolean) => {
    const fromPorts = getNodePorts(fromNode);
    const toPorts = getNodePorts(toNode);

    let start = fromPorts.right;
    let end = toPorts.left;
    let pathD = '';

    // Route logic based on relative positions
    if (fromNode.type === 'decision' && isNegativeBranch) {
      // Downward decision branch
      start = fromPorts.bottom;
      end = toPorts.top;
      const midY = (start.y + end.y) / 2;
      pathD = `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
    } else if (fromNode.x !== undefined && toNode.x !== undefined && toNode.x < fromNode.x) {
      // Flow looping backwards/downwards (e.g. POS-5 -> POS-6)
      start = fromPorts.bottom;
      end = toPorts.right;
      pathD = `M ${start.x} ${start.y} L ${start.x} ${start.y + 30} L ${end.x + 30} ${start.y + 30} L ${end.x + 30} ${end.y} L ${end.x} ${end.y}`;
    } else if (Math.abs(fromPorts.right.y - toPorts.left.y) < 15) {
      // Direct horizontal straight line
      pathD = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    } else {
      // Orthogonal elbow line
      const midX = (start.x + end.x) / 2;
      pathD = `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
    }

    const midPoint = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };

    const isConnectedToActive = fromNode.id === activeNodeId || toNode.id === activeNodeId;

    return (
      <g key={`${fromNode.id}->${toNode.id}`}>
        {/* Glow halo when active */}
        {isConnectedToActive && (
          <path
            d={pathD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={4}
            strokeOpacity={0.3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Main Connector Line */}
        <path
          d={pathD}
          fill="none"
          stroke={isConnectedToActive ? '#f59e0b' : '#64748b'}
          strokeWidth={isNegativeBranch ? 1.8 : 2}
          strokeDasharray={isNegativeBranch ? '4 3' : undefined}
          markerEnd={isConnectedToActive ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          className="transition-colors duration-200"
        />

        {/* Branch Label Badge if any */}
        {label && (
          <g transform={`translate(${start.x + (isNegativeBranch ? 8 : 14)}, ${start.y + (isNegativeBranch ? 25 : -14)})`}>
            <rect
              x={-4}
              y={-10}
              width={label.length * 6.5 + 10}
              height={18}
              rx={4}
              fill="#0f172a"
              stroke={isNegativeBranch ? '#f43f5e' : '#10b981'}
              strokeWidth={1}
            />
            <text
              x={2}
              y={3}
              fontSize={10}
              fontWeight="bold"
              fill={isNegativeBranch ? '#f43f5e' : '#10b981'}
              fontFamily="sans-serif"
            >
              {label}
            </text>
          </g>
        )}
      </g>
    );
  };

  // Render node shape based on Draw.io standard symbols
  const renderDrawioNode = (node: FlowNode) => {
    const isSelected = activeNodeId === node.id;
    const x = node.x || 0;
    const y = node.y || 0;
    const width = node.width || 170;
    const height = node.height || 75;

    // Distinct styles for draw.io shapes
    const isDecision = node.type === 'decision';
    const isDatabase = node.type === 'database';
    const isTerminator = node.type === 'start_end';
    const isEvent = node.type === 'event';
    const isIO = node.type === 'io';

    return (
      <div
        key={node.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode(node.id);
        }}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`
        }}
        className={`drawio-node cursor-pointer select-none transition-all duration-150 group ${
          isSelected ? 'z-30' : 'z-20 hover:z-25'
        }`}
      >
        {/* Draw.io Selection Bounding Box & 4-Corner Handles */}
        {isSelected && (
          <div className="absolute -inset-1.5 border border-dashed border-amber-400 pointer-events-none rounded">
            {/* 4 corner square handles */}
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-blue-500 border border-white shadow-xs" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 border border-white shadow-xs" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-blue-500 border border-white shadow-xs" />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-500 border border-white shadow-xs" />
            {/* 4 middle edge handles */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 border border-white" />
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white" />
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-blue-500 border border-white" />
          </div>
        )}

        {/* DECISION NODE: Rhombus / Diamond Shape */}
        {isDecision ? (
          <div className="w-full h-full relative flex items-center justify-center p-2">
            {/* Rotated diamond background box */}
            <div
              className={`absolute inset-2 rotate-45 rounded border transition-colors shadow-md ${
                isSelected
                  ? 'bg-amber-950/90 border-amber-400 shadow-amber-500/20'
                  : 'bg-slate-900 border-amber-500/60 group-hover:border-amber-400 group-hover:bg-slate-850'
              }`}
            />
            {/* Centered Content */}
            <div className="relative z-10 text-center px-2">
              <span className="font-mono text-[9px] font-bold text-amber-400 block uppercase">
                {node.step} · DECISION
              </span>
              <span className="text-[11px] font-bold text-white leading-tight block mt-0.5">
                {node.title}
              </span>
            </div>
          </div>
        ) : isDatabase ? (
          /* DATABASE NODE: Storage Cylinder Style */
          <div
            className={`w-full h-full rounded border flex flex-col justify-between p-2.5 shadow-md transition-colors ${
              isSelected
                ? 'bg-blue-950/90 border-blue-400 shadow-blue-500/20'
                : 'bg-slate-900 border-blue-500/50 group-hover:border-blue-400 group-hover:bg-slate-850'
            }`}
          >
            {/* Fake top cylinder oval lid */}
            <div className="flex items-center justify-between border-b border-blue-500/30 pb-1 mb-1">
              <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-blue-400">
                <Database className="w-3 h-3 text-blue-400" />
                <span>STEP {node.step}</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400">ACID DB</span>
            </div>
            <div className="text-center my-auto">
              <div className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                {node.title}
              </div>
            </div>
            <div className="text-[9px] text-center font-mono text-blue-300">
              SELECT FOR UPDATE
            </div>
          </div>
        ) : isTerminator ? (
          /* TERMINATOR NODE: Rounded Stadium/Capsule */
          <div
            className={`w-full h-full rounded-2xl border flex flex-col justify-center items-center p-2 shadow-md transition-colors ${
              isSelected
                ? 'bg-emerald-950/90 border-emerald-400 shadow-emerald-500/20'
                : 'bg-slate-900 border-emerald-500/50 group-hover:border-emerald-400 group-hover:bg-slate-850'
            }`}
          >
            <span className="font-mono text-[9px] font-bold text-emerald-400">
              {node.step} · TERMINATOR
            </span>
            <div className="text-[11px] font-bold text-white text-center leading-tight mt-0.5 line-clamp-2">
              {node.title}
            </div>
          </div>
        ) : isEvent ? (
          /* EVENT NODE: WebSocket Broadcast */
          <div
            className={`w-full h-full rounded border flex flex-col justify-between p-2.5 shadow-md transition-colors ${
              isSelected
                ? 'bg-purple-950/90 border-purple-400 shadow-purple-500/20'
                : 'bg-slate-900 border-purple-500/50 group-hover:border-purple-400 group-hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-1">
              <span className="flex items-center gap-1 font-mono text-[9px] font-bold text-purple-400">
                <Radio className="w-3 h-3 text-purple-400" />
                <span>STEP {node.step}</span>
              </span>
              <span className="text-[9px] font-mono text-purple-300">WS EVENT</span>
            </div>
            <div className="text-center my-auto">
              <div className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                {node.title}
              </div>
            </div>
            <div className="text-[9px] text-center font-mono text-slate-400">
              Broadcast Pub/Sub
            </div>
          </div>
        ) : (
          /* STANDARD PROCESS / I/O NODE: Compact Rectangular Card */
          <div
            className={`w-full h-full rounded border flex flex-col justify-between p-2.5 shadow-md transition-colors ${
              isSelected
                ? 'bg-slate-850 border-amber-400 shadow-amber-500/20'
                : isIO
                ? 'bg-slate-900 border-cyan-500/50 group-hover:border-cyan-400 group-hover:bg-slate-850'
                : 'bg-slate-900 border-slate-700 group-hover:border-slate-500 group-hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-1">
              <span className="font-mono text-[9px] font-bold text-amber-400">
                STEP {node.step}
              </span>
              <span className="text-[9px] text-slate-400 font-medium truncate max-w-[85px]">
                {node.actor.split(' ')[0]}
              </span>
            </div>
            <div className="my-auto text-center">
              <div className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                {node.title}
              </div>
            </div>
            <div className="text-[9px] text-slate-400 truncate flex items-center justify-between">
              <span className="font-mono text-cyan-400">{node.swimlane}</span>
              <span className="text-slate-500">ID: {node.id}</span>
            </div>
          </div>
        )}

        {/* 4 Connection Ports Dots on Hover (Draw.io Port Anchors) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 rounded-full bg-cyan-400 border border-slate-900 shadow-xs" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 rounded-full bg-cyan-400 border border-slate-900 shadow-xs" />
          <div className="absolute top-1/2 left-0 -translate-x-1 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 border border-slate-900 shadow-xs" />
          <div className="absolute top-1/2 right-0 translate-x-1 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 border border-slate-900 shadow-xs" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
      {/* Draw.io Top Floating Control Ribbon */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left stencil / tool indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Draw.io Canvas Engine</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
            <span>Grid: 20px</span>
            <span aria-hidden="true">·</span>
            <span>{nodes.length} Kotak Simbol</span>
            <span aria-hidden="true">·</span>
            <span>Orthogonal Routing</span>
          </div>
        </div>

        {/* Right Canvas Actions & Zoom */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded transition-colors text-slate-300 hover:text-white ${
              showGrid ? 'bg-slate-800 text-amber-400' : 'bg-transparent text-slate-500'
            }`}
            title="Toggle Grid Canvas"
          >
            <Grid className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs text-slate-300 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetView}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors ml-1"
            title="Reset Zoom & Pan (Fit)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Draw.io Shape Stencil Legend Bar */}
      <div className="bg-slate-950/80 border-b border-slate-850 px-4 py-1.5 flex items-center gap-3 overflow-x-auto text-[10px] text-slate-400 scrollbar-none">
        <span className="font-semibold text-slate-500 uppercase tracking-wider shrink-0">
          Standar Simbol Draw.io:
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full border border-emerald-400 bg-emerald-950/60" />
          <span>Terminator (Mulai/Selesai)</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2.5 h-2.5 rounded-xs border border-slate-600 bg-slate-800" />
          <span>Proses (Eksekusi Operasi)</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2.5 h-2.5 rotate-45 border border-amber-400 bg-amber-950/60" />
          <span>Keputusan (Diamond Decision)</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2.5 h-2.5 rounded-xs border border-cyan-400 bg-cyan-950/60" />
          <span>I/O (Input Kasir/PO)</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2.5 h-2.5 rounded-xs border border-blue-400 bg-blue-950/60" />
          <span>Database (PostgreSQL ACID)</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <span className="w-2.5 h-2.5 rounded-xs border border-purple-400 bg-purple-950/60" />
          <span>Event Bus (WebSocket Push)</span>
        </span>
      </div>

      {/* Interactive Infinite Canvas Viewport */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => onSelectNode(null)}
        className="relative h-[480px] sm:h-[560px] overflow-auto cursor-grab active:cursor-grabbing bg-slate-950 select-none"
        style={{
          backgroundImage: showGrid 
            ? 'radial-gradient(circle, rgba(148, 163, 184, 0.15) 1px, transparent 1px)' 
            : 'none',
          backgroundSize: '20px 20px',
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        {/* Transform Group (Zoom & Pan) */}
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
          {/* SVG Connector Layer */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={canvasWidth}
            height={canvasHeight}
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Default Arrow Marker */}
              <marker
                id="arrow-default"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#64748b" />
              </marker>

              {/* Active Golden Arrow Marker */}
              <marker
                id="arrow-active"
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

            {/* Render all standard and decision connectors */}
            {nodes.map((node) => {
              const elements: React.ReactNode[] = [];

              // 1. Regular connectedTo
              if (node.connectedTo) {
                node.connectedTo.forEach((targetId) => {
                  const targetNode = nodes.find((n) => n.id === targetId);
                  if (targetNode) {
                    elements.push(renderConnector(node, targetNode));
                  }
                });
              }

              // 2. Decision branches (Yes / No)
              if (node.decisionBranches) {
                if (node.decisionBranches.yes) {
                  const yesNode = nodes.find((n) => n.id === node.decisionBranches?.yes);
                  if (yesNode) {
                    elements.push(renderConnector(node, yesNode, 'Ya / Cukup', false));
                  }
                }
                if (node.decisionBranches.no) {
                  const noNode = nodes.find((n) => n.id === node.decisionBranches?.no);
                  if (noNode) {
                    elements.push(renderConnector(node, noNode, 'Tidak / Kurang', true));
                  }
                }
              }

              return elements;
            })}
          </svg>

          {/* Draw.io Nodes Layer */}
          {nodes.map(renderDrawioNode)}
        </div>

        {/* Floating Hint Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded-md px-3 py-1.5 text-[11px] text-slate-400 pointer-events-none flex items-center gap-2 shadow-lg backdrop-blur-sm">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>Klik salah satu kotak untuk inspeksi detail teknis API & SQL. Drag mouse untuk geser kanvas.</span>
        </div>
      </div>
    </div>
  );
};
