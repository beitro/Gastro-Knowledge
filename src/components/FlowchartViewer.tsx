import React, { useState } from 'react';
import { 
  ArrowRight, 
  Database, 
  Radio, 
  Terminal, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  X, 
  Maximize2, 
  Workflow, 
  Layers, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  ArrowDown,
  LayoutGrid,
  ListOrdered
} from 'lucide-react';
import { FLOW_MODULES } from '../data/flowchartData';
import { FlowNode, SystemModuleId } from '../types/inventory';
import { DrawioCanvas } from './DrawioCanvas';

interface FlowchartViewerProps {
  onNavigateToSimulator: () => void;
}

export const FlowchartViewer: React.FC<FlowchartViewerProps> = ({ onNavigateToSimulator }) => {
  const [selectedModuleId, setSelectedModuleId] = useState<SystemModuleId>('all');
  const [activeNodeId, setActiveNodeId] = useState<string | null>('E2E-1');
  const [viewMode, setViewMode] = useState<'drawio' | 'swimlane' | 'steplist'>('drawio');

  const currentModule = FLOW_MODULES.find((m) => m.id === selectedModuleId) || FLOW_MODULES[0];
  const activeNode = currentModule.nodes.find((n) => n.id === activeNodeId) || null;

  // Handle module change
  const handleSelectModule = (id: SystemModuleId) => {
    setSelectedModuleId(id);
    const mod = FLOW_MODULES.find((m) => m.id === id);
    setActiveNodeId(mod?.nodes[0]?.id || null);
  };

  // Step navigation handlers
  const handleNextStep = () => {
    if (!activeNodeId) {
      setActiveNodeId(currentModule.nodes[0]?.id || null);
      return;
    }
    const currentIndex = currentModule.nodes.findIndex((n) => n.id === activeNodeId);
    if (currentIndex >= 0 && currentIndex < currentModule.nodes.length - 1) {
      setActiveNodeId(currentModule.nodes[currentIndex + 1].id);
    }
  };

  const handlePrevStep = () => {
    if (!activeNodeId) return;
    const currentIndex = currentModule.nodes.findIndex((n) => n.id === activeNodeId);
    if (currentIndex > 0) {
      setActiveNodeId(currentModule.nodes[currentIndex - 1].id);
    }
  };

  const getNodeBadge = (type: FlowNode['type']) => {
    switch (type) {
      case 'start_end':
        return { label: 'Terminator (Capsule)', bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50' };
      case 'decision':
        return { label: 'Decision (Diamond)', bg: 'bg-amber-950/60 text-amber-400 border-amber-700/50' };
      case 'database':
        return { label: 'Database (Cylinder)', bg: 'bg-blue-950/60 text-blue-400 border-blue-700/50' };
      case 'event':
        return { label: 'WebSocket Event', bg: 'bg-purple-950/60 text-purple-400 border-purple-700/50' };
      case 'io':
        return { label: 'I/O Input Kasir/User', bg: 'bg-cyan-950/60 text-cyan-400 border-cyan-700/50' };
      default:
        return { label: 'Process (Rectangular)', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-purple-700">Diagram Arsitektur Alur Proses</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-medium">Format Kotak Simbol Draw.io</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Flowchart Sistem Inventaris Real-Time Restoran
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              {currentModule.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            {/* View Mode Toggle Buttons */}
            <div className="p-1 rounded-full bg-slate-100 border border-black/[0.04] flex items-center gap-1">
              <button
                onClick={() => setViewMode('drawio')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'drawio'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilan Kotak-Kotak Kecil Mirip Draw.io"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Draw.io Canvas</span>
              </button>

              <button
                onClick={() => setViewMode('swimlane')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'swimlane'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilan Swimlane 4-Layer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Swimlane</span>
              </button>

              <button
                onClick={() => setViewMode('steplist')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  viewMode === 'steplist'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Tampilan Daftar Langkah Vertikal"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Daftar Alur</span>
              </button>
            </div>

            <button
              onClick={onNavigateToSimulator}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-full transition-all shadow-xs active:scale-95"
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Buka Live Simulator</span>
            </button>
          </div>
        </div>

        {/* Module Switcher Tabs */}
        <div className="mt-5 pt-4 border-t border-black/[0.04] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Modul Alur:
          </span>
          {FLOW_MODULES.map((m) => {
            const isSelected = m.id === selectedModuleId;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectModule(m.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 border-black/[0.04] text-slate-700 hover:bg-slate-100'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Flowchart & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Diagram Canvas Area */}
        <div className={`space-y-4 ${activeNode ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          {/* Tour Guidance bar */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-lg px-4 py-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {viewMode === 'drawio' 
                  ? 'Format diagram kotak-kotak Draw.io: klik kotak untuk memilih node, gunakan tombol zoom/pan.' 
                  : 'Klik salah satu langkah untuk menginspeksi rincian teknis.'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handlePrevStep}
                disabled={!activeNodeId || currentModule.nodes.findIndex((n) => n.id === activeNodeId) === 0}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                title="Langkah Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-medium"
              >
                <span>Langkah Berikutnya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* VIEW 1: DRAW.IO 2D CANVAS (KOTAK-KOTAK KECIL) */}
          {viewMode === 'drawio' && (
            <DrawioCanvas
              moduleConfig={currentModule}
              activeNodeId={activeNodeId}
              onSelectNode={(id) => setActiveNodeId(id)}
            />
          )}

          {/* VIEW 2: SWIMLANE MATRIX VIEW */}
          {viewMode === 'swimlane' && (
            <div className="space-y-4">
              {[
                { key: 'interface', title: '1. Interface Layer (Kasir, KDS, Scanner Gudang, Dashboard)', color: 'text-amber-400 border-amber-500/30 bg-amber-950/10' },
                { key: 'backend', title: '2. Backend Service & BOM Resolver Engine (Node.js)', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/10' },
                { key: 'database', title: '3. Data Layer (PostgreSQL Row-Locking & ACID)', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/10' },
                { key: 'realtime', title: '4. Real-time Event Bus (WebSocket & Redis)', color: 'text-purple-400 border-purple-500/30 bg-purple-950/10' }
              ].map((lane) => {
                const laneNodes = currentModule.nodes.filter((n) => n.swimlane === lane.key);
                if (laneNodes.length === 0) return null;

                return (
                  <div key={lane.key} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                      <h3 className={`text-xs font-bold uppercase tracking-wider ${lane.color}`}>
                        {lane.title}
                      </h3>
                      <span className="text-[11px] text-slate-500">{laneNodes.length} Kotak</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {laneNodes.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => setActiveNodeId(n.id)}
                          className={`cursor-pointer p-3 rounded-lg border transition-all ${
                            activeNodeId === n.id
                              ? 'bg-slate-850 border-amber-400 text-white ring-1 ring-amber-500/30'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-mono text-amber-400 font-semibold text-[10px]">STEP {n.step}</span>
                            <span className="text-[10px] text-slate-400">{n.actor}</span>
                          </div>
                          <div className="text-xs font-bold text-white">{n.title}</div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{n.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 3: VERTICAL STEP LIST VIEW */}
          {viewMode === 'steplist' && (
            <div className="space-y-3">
              {currentModule.nodes.map((node, index) => {
                const isSelected = activeNodeId === node.id;
                const badge = getNodeBadge(node.type);

                return (
                  <div key={node.id} className="relative">
                    <div
                      onClick={() => setActiveNodeId(node.id)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        isSelected
                          ? 'bg-slate-850 border-amber-400 ring-1 ring-amber-500/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                            STEP {node.step}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{node.actor}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white">{node.title}</h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{node.description}</p>
                    </div>

                    {index < currentModule.nodes.length - 1 && (
                      <div className="flex justify-center my-1.5">
                        <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Technical Inspector / Draw.io Format Panel */}
        {activeNode && (
          <div className="lg:col-span-5">
            <div className="sticky top-20 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto shadow-2xl">
              {/* Header inside format panel */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      STEP {activeNode.step}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {activeNode.id}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {activeNode.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveNodeId(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Tutup Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Actor & Simbol Type */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Aktor / Interface:</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{activeNode.actor}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bentuk Simbol Draw.io:</span>
                  <span className="font-semibold text-amber-400 mt-0.5 block capitalize">{activeNode.type.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Functional description */}
              <div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Deskripsi Alur Operasional:
                </span>
                <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800 leading-relaxed">
                  {activeNode.description}
                </p>
              </div>

              {/* API Trigger Specification */}
              {activeNode.technicalDetails.apiEndpoint && (
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Trigger Endpoint API:
                  </span>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        {activeNode.technicalDetails.httpMethod || 'POST'}
                      </span>
                      <span className="text-slate-200">{activeNode.technicalDetails.apiEndpoint}</span>
                    </div>

                    {activeNode.technicalDetails.requestPayload && (
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Sample Payload JSON:</span>
                        <pre className="text-[11px] font-mono bg-slate-900 p-2.5 rounded text-amber-300 overflow-x-auto border border-slate-800">
                          {JSON.stringify(activeNode.technicalDetails.requestPayload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SQL Database Query & Affected Tables */}
              {activeNode.technicalDetails.sqlOperation && (
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Operasi Database (PostgreSQL ACID):
                  </span>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <pre className="text-[11px] font-mono text-emerald-300 bg-slate-900 p-2.5 rounded overflow-x-auto border border-slate-800 leading-relaxed">
                      {activeNode.technicalDetails.sqlOperation}
                    </pre>

                    {activeNode.technicalDetails.tablesAffected && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[11px] text-slate-400">Tabel:</span>
                        {activeNode.technicalDetails.tablesAffected.map((t) => (
                          <span key={t} className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* WebSocket Real-time Event */}
              {activeNode.technicalDetails.wsEvent && (
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    WebSocket Broadcast:
                  </span>
                  <div className="bg-purple-950/20 border border-purple-800/40 p-3 rounded-lg flex items-start gap-2.5 text-xs">
                    <Radio className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-purple-300 font-mono">
                        {activeNode.technicalDetails.wsEvent}
                      </span>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Didistribusikan ke KDS Dapur, Kasir POS, Gudang, dan Dashboard secara sub-150ms.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Concurrency & Edge Cases */}
              {(activeNode.technicalDetails.concurrencyHandling || activeNode.technicalDetails.edgeCaseHandling) && (
                <div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Mitigasi Concurrency & Rollback:
                  </span>
                  <div className="space-y-2 text-xs">
                    {activeNode.technicalDetails.concurrencyHandling && (
                      <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-800/30 text-blue-200">
                        <span className="font-semibold block text-blue-400 text-[11px] mb-0.5">Kontrol Konkurensi:</span>
                        {activeNode.technicalDetails.concurrencyHandling}
                      </div>
                    )}
                    {activeNode.technicalDetails.edgeCaseHandling && (
                      <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-amber-200">
                        <span className="font-semibold block text-amber-400 text-[11px] mb-0.5">Penanganan Kasus Gagal:</span>
                        {activeNode.technicalDetails.edgeCaseHandling}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
