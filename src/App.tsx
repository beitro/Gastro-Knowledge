import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { FlowchartViewer } from './components/FlowchartViewer';
import { SwimlaneDiagramViewer } from './components/SwimlaneDiagramViewer';
import { RestoOperationsGuide } from './components/RestoOperationsGuide';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { ApiDocumentation } from './components/ApiDocumentation';
import { DatabaseErdViewer } from './components/DatabaseErdViewer';
import { ConcurrencyGuide } from './components/ConcurrencyGuide';
import { TechnicalDocExport } from './components/TechnicalDocExport';
import { DocumentSuiteViewer } from './components/DocumentSuiteViewer';
import { WireframePrototypeViewer } from './components/WireframePrototypeViewer';
import { FigmaCanvasStudio } from './components/FigmaCanvasStudio';
import { PitchDeckViewer } from './components/PitchDeckViewer';
import { RestaurantServiceModesViewer } from './components/RestaurantServiceModesViewer';
import { RightSidebarWidget } from './components/RightSidebarWidget';
import { FloatingExportBar } from './components/FloatingExportBar';
import { 
  SlidersHorizontal, 
  CheckCircle2, 
  FolderOpen, 
  Download, 
  ChevronRight, 
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('brd');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isMobileWidgetsOpen, setIsMobileWidgetsOpen] = useState<boolean>(false);

  // Metadata lookup for breadcrumb
  const moduleGroupMeta: Record<ActiveTab, { group: string; label: string; badge: string; badgeClass: string }> = {
    brd: {
      group: '1. Dokumen Resmi & Pitch Deck',
      label: 'Dokumen Resmi 4 Fase (PRD, FSD, TSD, BRD, DEV, OPS, SOP)',
      badge: '7 DOCX SIAP UNDUH',
      badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
    },
    pitchdeck: {
      group: '1. Dokumen Resmi & Pitch Deck',
      label: 'Slide Penawaran Klien (Apple Keynote 16:9) & 50 Tanya Audit',
      badge: 'PPTX + 50 PERTANYAAN',
      badgeClass: 'text-rose-400 bg-rose-950/60 border-rose-500/30'
    },
    servicemodes: {
      group: '2. Operasional Front & Back of House',
      label: '16 Model Layanan Restoran & Arsitektur Dev',
      badge: '16 MODEL LENGKAP',
      badgeClass: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30'
    },
    wireframe: {
      group: '2. Operasional Front & Back of House',
      label: 'Wireframe & Prototype Multi-Role (Kasir, Waiter, KDS, Manager)',
      badge: '6 ROLE INTERAKTIF',
      badgeClass: 'text-slate-300 bg-slate-800 border-slate-700'
    },
    operations: {
      group: '2. Operasional Front & Back of House',
      label: 'SOP & Aksi Harian Operasional Restoran',
      badge: 'CHECKLIST HARIAN',
      badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
    },
    simulator: {
      group: '3. Inventaris & Studio Desain',
      label: 'Kasir POS & KDS Live Engine (Deduct BOM & Anti-Defisit)',
      badge: 'LIVE SIMULATOR',
      badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
    },
    figma: {
      group: '3. Inventaris & Studio Desain',
      label: 'Figma Studio Canvas 2.0 & Design Tokens',
      badge: 'COPY-PASTE SVG 2.0',
      badgeClass: 'text-purple-400 bg-purple-950/60 border-purple-500/30'
    },
    swimlane: {
      group: '4. Arsitektur Teknis & Database',
      label: 'Swimlane Inter-Sistem Sinkronisasi (POS, KDS, Gudang, BI)',
      badge: '4 AKTOR REALTIME',
      badgeClass: 'text-blue-400 bg-blue-950/60 border-blue-500/30'
    },
    flowcharts: {
      group: '4. Arsitektur Teknis & Database',
      label: 'Flowchart BPMN & Draw.io Terintegrasi',
      badge: 'FORMAT .DRAWIO.XML',
      badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
    },
    apispec: {
      group: '4. Arsitektur Teknis & Database',
      label: 'Spesifikasi API REST & WebSocket Dapur (<15ms)',
      badge: 'SWAGGER REST + WS',
      badgeClass: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30'
    },
    database: {
      group: '4. Arsitektur Teknis & Database',
      label: 'Database ERD & Skema DDL Relasional (PostgreSQL 15+)',
      badge: 'ACID COMPLIANT',
      badgeClass: 'text-slate-300 bg-slate-800 border-slate-700'
    },
    concurrency: {
      group: '4. Arsitektur Teknis & Database',
      label: 'ACID & Row-Level Locking (Pencegah Overselling)',
      badge: 'ZERO OVERSELL',
      badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
    },
  };

  const currentMeta = moduleGroupMeta[activeTab];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Gastro Knowledge System Top Navigation Header with Role Grouping */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setShowExportModal(true)}
        onToggleWidgets={() => setIsMobileWidgetsOpen(!isMobileWidgetsOpen)}
      />

      {/* Structured Dark Slate Neumorphic Breadcrumb Bar */}
      <div className="bg-[#0E1524] border-b border-slate-800/80 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <FolderOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-semibold text-slate-400">{currentMeta.group}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="font-bold text-slate-100">{currentMeta.label}</span>
            <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${currentMeta.badgeClass}`}>
              {currentMeta.badge}
            </span>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl neu-btn text-slate-200 hover:text-white font-semibold transition-all text-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unduh Master Paket (.docx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Layout */}
      <div className="flex-1 flex w-full relative">
        {/* Main Content View Container */}
        <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-5 overflow-x-hidden">
          {activeTab === 'brd' && (
            <DocumentSuiteViewer onNavigateToTab={(tab) => setActiveTab(tab)} />
          )}

          {activeTab === 'pitchdeck' && (
            <PitchDeckViewer />
          )}

          {activeTab === 'servicemodes' && (
            <RestaurantServiceModesViewer />
          )}

          {activeTab === 'wireframe' && (
            <WireframePrototypeViewer />
          )}

          {activeTab === 'figma' && (
            <div className="space-y-4">
              <FigmaCanvasStudio initialRole="servicemodes" />
            </div>
          )}

          {activeTab === 'swimlane' && (
            <SwimlaneDiagramViewer />
          )}

          {activeTab === 'simulator' && (
            <InteractiveSimulator />
          )}

          {activeTab === 'operations' && (
            <RestoOperationsGuide onNavigateToServiceModes={() => setActiveTab('servicemodes')} />
          )}

          {activeTab === 'flowcharts' && (
            <FlowchartViewer onNavigateToSimulator={() => setActiveTab('simulator')} />
          )}

          {activeTab === 'apispec' && (
            <ApiDocumentation />
          )}

          {activeTab === 'database' && (
            <DatabaseErdViewer />
          )}

          {activeTab === 'concurrency' && (
            <ConcurrencyGuide />
          )}
        </main>

        {/* Right Sidebar Widget */}
        <RightSidebarWidget
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isMobileWidgetsOpen}
          onCloseMobile={() => setIsMobileWidgetsOpen(false)}
        />
      </div>

      {/* Floating 1-Click Quick-Action Export Bar */}
      <FloatingExportBar />

      {/* Mobile Floating Widget Trigger Button */}
      <div className="fixed bottom-22 right-6 z-30 xl:hidden">
        <button
          onClick={() => setIsMobileWidgetsOpen(true)}
          className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl neu-btn text-white text-xs font-bold active:scale-95 transition-transform"
        >
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span className="tracking-tight">Widget Kanan</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      </div>

      {/* Export Technical Documentation Modal */}
      <TechnicalDocExport
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* Clean Dark Slate Neumorphic Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#0E1524] py-5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">Gastro Knowledge System</span>
            <span>·</span>
            <span className="text-slate-400 font-medium">Sistem Manajemen Inventaris &amp; Operasional Restoran</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              FEFO &amp; HACCP Compliant
            </span>
            <span>·</span>
            <button 
              onClick={() => setActiveTab('brd')}
              className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
            >
              7 Format Dokumen Resmi (.docx)
            </button>
            <span>·</span>
            <span className="text-slate-500">Dark Slate Neumorphism</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
