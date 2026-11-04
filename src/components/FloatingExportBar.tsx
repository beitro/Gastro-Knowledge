import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Presentation, 
  Sparkles, 
  Network, 
  FileSpreadsheet, 
  Check, 
  Loader2, 
  X, 
  Layers, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { generateMaster4PhasesDocx } from '../utils/masterDocxGenerator';
import { generateBrdWordDocumentBlob } from '../utils/brdDocxGenerator';
import { generateFsdWordDocumentBlob } from '../utils/fsdDocxGenerator';
import { generateTsdWordDocumentBlob } from '../utils/tsdDocxGenerator';
import { generatePrdWordDocumentBlob } from '../utils/prdDocxGenerator';
import { generateDevWordDocumentBlob } from '../utils/devDocxGenerator';
import { generateOpsWordDocumentBlob } from '../utils/opsDocxGenerator';
import { downloadPitchingQuestionsDocx } from '../utils/pitchingQuestionsDocxGenerator';
import { downloadPitchDeckPptx } from '../utils/pptxGenerator';
import { downloadDevModesPitchDeckPptx } from '../utils/devDeckPptxGenerator';
import { downloadAllRolesFigmaSvgFile, downloadFigmaSvgFile, downloadFigmaTokensJsonFile } from '../utils/figmaExporter';
import { generateAllScenariosDrawioXml } from '../utils/drawioXmlGenerator';
import { SWIMLANE_SCENARIOS } from '../data/swimlaneScenariosData';
import { generateAuditSummaryPdf } from '../utils/auditSummaryPdfGenerator';

type ExportCategory = 'all' | 'docx' | 'pptx' | 'vector' | 'pdf';

interface ExportItem {
  id: string;
  category: 'docx' | 'pptx' | 'vector' | 'pdf';
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  sizeEstimate: string;
  action: () => Promise<void> | void;
}

export const FloatingExportBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ExportCategory>('all');
  const [loadingItem, setLoadingItem] = useState<string | null>(null);
  const [successItem, setSuccessItem] = useState<string | null>(null);

  const triggerDownload = async (id: string, fn: () => Promise<void> | void) => {
    try {
      setLoadingItem(id);
      await fn();
      setSuccessItem(id);
      setTimeout(() => setSuccessItem(null), 2500);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setLoadingItem(null);
    }
  };

  const exportItems: ExportItem[] = [
    // 1. DOCX SUITE
    {
      id: 'master-docx',
      category: 'docx',
      title: 'Master Workbook Restoran (4 Fase)',
      badge: 'DOCX LENGKAP',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
      description: 'Seluruh fase (PRD, BRD, FSD, TSD, DEV, OPS) dalam 1 dokumen komprehensif.',
      sizeEstimate: '~4.2 MB',
      action: async () => {
        const blob = await generateMaster4PhasesDocx({});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gastro_Knowledge_System_Master_Workbook_4_Fase_${new Date().getFullYear()}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    {
      id: 'brd-docx',
      category: 'docx',
      title: 'BRD (Business Requirements Document)',
      badge: 'DOCX BISNIS',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
      description: 'Latar belakang bisnis, stakeholder RACI, analisis ROI, dan SOP operasional.',
      sizeEstimate: '~1.8 MB',
      action: async () => {
        const blob = await generateBrdWordDocumentBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gastro_Knowledge_System_BRD_${new Date().getFullYear()}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    {
      id: 'fsd-docx',
      category: 'docx',
      title: 'FSD (Functional Specification Document)',
      badge: 'DOCX FUNGSIONAL',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
      description: 'Matriks fitur, flow use-case Kasir POS, KDS Dapur, dan Gudang FEFO.',
      sizeEstimate: '~2.1 MB',
      action: async () => {
        const blob = await generateFsdWordDocumentBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gastro_Knowledge_System_FSD_${new Date().getFullYear()}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    {
      id: 'tsd-docx',
      category: 'docx',
      title: 'TSD (Technical Specification Document)',
      badge: 'DOCX ARSITEKTUR',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
      description: 'Arsitektur PostgreSQL, ACID locking, API Swagger, WebSocket & latency <15ms.',
      sizeEstimate: '~2.4 MB',
      action: async () => {
        const blob = await generateTsdWordDocumentBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gastro_Knowledge_System_TSD_${new Date().getFullYear()}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    {
      id: 'prd-docx',
      category: 'docx',
      title: 'PRD (Product Requirements Document)',
      badge: 'DOCX PRODUK',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
      description: 'Visi produk F&B, user persona, problem statement, dan roadmap kuartalan.',
      sizeEstimate: '~1.5 MB',
      action: async () => {
        const blob = await generatePrdWordDocumentBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gastro_Knowledge_System_PRD_${new Date().getFullYear()}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    {
      id: 'dev-docx',
      category: 'docx',
      title: 'DEV (Panduan Implementasi Engineering)',
      badge: 'DOCX DEV SPRINT',
      badgeColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30',
      description: 'Sprint planning, struktur skema ORM, protokol IoT hardware, dan panduan dev.',
      sizeEstimate: '~1.9 MB',
      action: async () => {
        const blob = await generateDevWordDocumentBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gastro_Knowledge_System_DEV_Guide_${new Date().getFullYear()}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    {
      id: 'ops-docx',
      category: 'docx',
      title: 'OPS (Standar Prosedur Operasional)',
      badge: 'DOCX SOP RESTO',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
      description: 'Checklist opening/closing kasir, serah terima shift, dan mitigasi darurat POS.',
      sizeEstimate: '~1.6 MB',
      action: async () => {
        const blob = await generateOpsWordDocumentBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gastro_Knowledge_System_SOP_Ops_${new Date().getFullYear()}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    {
      id: 'audit-docx',
      category: 'docx',
      title: '50 Pertanyaan Audit & Diagnosa Resto',
      badge: 'DOCX AUDIT',
      badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-500/30',
      description: 'Blanko survei kelayakan dan diagnosa operasional 50 pertanyaan terstruktur.',
      sizeEstimate: '~1.2 MB',
      action: async () => {
        await downloadPitchingQuestionsDocx({
          clientName: 'Restoran_Mitra_GKS',
          consultantName: 'Gastro Knowledge Team'
        });
      }
    },

    // 2. PPTX KEYNOTE
    {
      id: 'pitch-sales-pptx',
      category: 'pptx',
      title: 'Apple Keynote Sales Pitch Deck (11 Slide)',
      badge: 'PPTX 16:9 SALES',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
      description: 'Slide penawaran klien berstandar Apple Keynote, visual hero, & kalkulasi ROI.',
      sizeEstimate: '~3.5 MB',
      action: async () => {
        await downloadPitchDeckPptx({
          clientName: 'Restoran Mitra & Hospitality Group',
          picName: 'Gastro Knowledge Enterprise Sales'
        });
      }
    },
    {
      id: 'pitch-dev-pptx',
      category: 'pptx',
      title: 'Presentasi Tim Developer: 16 Model Layanan',
      badge: 'PPTX 16:9 DEV',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
      description: '13 Slide arsitektur teknis 16 model layanan, 6 protokol hardware, dan ACID lock.',
      sizeEstimate: '~4.1 MB',
      action: async () => {
        await downloadDevModesPitchDeckPptx({
          devTeamName: 'Tim Engineering Gastro Knowledge System',
          leadArchitect: 'Lead Restaurant Software Architect'
        });
      }
    },

    // 3. VECTOR FIGMA & DRAW.IO
    {
      id: 'figma-all-svg',
      category: 'vector',
      title: 'Figma Master Studio Canvas 2.0 (.svg)',
      badge: 'VECTOR FIGMA',
      badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/30',
      description: 'Vektor lengkap wireframe multi-role siap copy-paste langsung ke Figma (Ctrl+V).',
      sizeEstimate: '~850 KB',
      action: () => {
        downloadAllRolesFigmaSvgFile();
      }
    },
    {
      id: 'figma-servicemodes-svg',
      category: 'vector',
      title: 'Figma 16 Model Layanan Architecture (.svg)',
      badge: '16 MODEL SVG',
      badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/30',
      description: 'Diagram visual 16 model layanan restoran lengkap dengan flow perangkat keras.',
      sizeEstimate: '~620 KB',
      action: () => {
        downloadFigmaSvgFile('servicemodes');
      }
    },
    {
      id: 'figma-tokens-json',
      category: 'vector',
      title: 'Figma Design Tokens 2.0 Studio (.json)',
      badge: 'TOKENS JSON',
      badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/30',
      description: 'Variabel warna, radius, dan tipografi kompatibel dengan Figma Tokens Studio plugin.',
      sizeEstimate: '~45 KB',
      action: () => {
        downloadFigmaTokensJsonFile();
      }
    },
    {
      id: 'drawio-all-xml',
      category: 'vector',
      title: 'Draw.io Enterprise Architecture (Multi-Tab .xml)',
      badge: 'DRAW.IO XML',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
      description: 'File diagram XML swimlane & flowchart terintegrasi untuk dibuka di diagrams.net.',
      sizeEstimate: '~320 KB',
      action: () => {
        const xml = generateAllScenariosDrawioXml(
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
          'dark'
        );
        const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Gastro_Knowledge_System_DrawIO_Architecture.drawio.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },

    // 4. PDF EXECUTIVE REPORT
    {
      id: 'audit-pdf',
      category: 'pdf',
      title: 'Laporan Eksekutif Audit & Diagnosa Resto (.pdf)',
      badge: 'PDF RESMI',
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
      description: 'Laporan diagnosa resmi berformat A4 dengan kop perusahaan, skor, dan tanda tangan.',
      sizeEstimate: '~750 KB',
      action: () => {
        const doc = generateAuditSummaryPdf({
          clientName: 'Restoran Mitra & Hospitality Group',
          consultantName: 'Gastro Knowledge System Specialist',
          answers: {},
          notes: {}
        });
        doc.save(`Gastro_Knowledge_System_Laporan_Audit_Eksekutif_${new Date().getFullYear()}.pdf`);
      }
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? exportItems 
    : exportItems.filter((item) => item.category === activeCategory);

  return (
    <>
      {/* Docked Neumorphic Quick-Action Floating Button */}
      <aside 
        aria-label="Pusat Unduhan Cepat"
        className="fixed bottom-6 right-6 z-40 select-none"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className={`flex items-center space-x-3 px-4 py-3 rounded-2xl neu-btn font-semibold text-xs transition-all duration-200 cursor-pointer ${
            isOpen 
              ? 'neu-btn-active text-cyan-400' 
              : 'text-slate-100 hover:text-white'
          }`}
          title="Buka Pusat Unduhan Gastro Knowledge System"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
            <Download className="w-4 h-4 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-900" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="font-bold block tracking-tight text-white">Unduhan Cepat</span>
            <span className="text-[10px] text-slate-400 block font-normal">14 Berkas Resmi Tersedia</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
            Export Hub
          </span>
        </button>
      </aside>

      {/* Neumorphic Modal Drawer */}
      {isOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-hub-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 animate-fade-in"
        >
          <div className="neu-flat rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-200 border border-slate-700/60 shadow-2xl">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between gap-4 bg-[#141E32]">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 id="export-hub-title" className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Pusat Unduhan &amp; Berkas Resmi
                    </h2>
                    <span className="neu-tag px-2 py-0.5 rounded-full text-[10px] font-semibold text-cyan-400">
                      14 Berkas
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gastro Knowledge System · Word (.docx), Keynote (.pptx), Figma (.svg), Draw.io (.xml) &amp; PDF
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl neu-btn flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 py-3 border-b border-slate-800/60 bg-[#0E1524] flex items-center gap-2 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-medium ${
                  activeCategory === 'all'
                    ? 'neu-btn-active text-cyan-400 font-bold'
                    : 'neu-btn text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua Format (14)
              </button>
              <button
                onClick={() => setActiveCategory('docx')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-medium flex items-center gap-1.5 ${
                  activeCategory === 'docx'
                    ? 'neu-btn-active text-cyan-400 font-bold'
                    : 'neu-btn text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Word .docx (8)</span>
              </button>
              <button
                onClick={() => setActiveCategory('pptx')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-medium flex items-center gap-1.5 ${
                  activeCategory === 'pptx'
                    ? 'neu-btn-active text-rose-400 font-bold'
                    : 'neu-btn text-slate-400 hover:text-slate-200'
                }`}
              >
                <Presentation className="w-3.5 h-3.5 text-rose-400" />
                <span>Keynote .pptx (2)</span>
              </button>
              <button
                onClick={() => setActiveCategory('vector')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-medium flex items-center gap-1.5 ${
                  activeCategory === 'vector'
                    ? 'neu-btn-active text-purple-400 font-bold'
                    : 'neu-btn text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Figma &amp; Draw.io (4)</span>
              </button>
              <button
                onClick={() => setActiveCategory('pdf')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap font-medium flex items-center gap-1.5 ${
                  activeCategory === 'pdf'
                    ? 'neu-btn-active text-emerald-400 font-bold'
                    : 'neu-btn text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Laporan PDF (1)</span>
              </button>
            </div>

            {/* Scrollable File Items Grid */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-3 max-h-[58vh]">
              {filteredItems.map((item) => {
                const isLoading = loadingItem === item.id;
                const isSuccess = successItem === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl neu-flat-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-600/60 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-sm text-slate-100 tracking-tight">
                          {item.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {item.sizeEstimate}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => triggerDownload(item.id, item.action)}
                        disabled={isLoading}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all ${
                          isSuccess
                            ? 'neu-btn-emerald text-white'
                            : isLoading
                            ? 'neu-btn text-slate-400 cursor-not-allowed'
                            : 'neu-btn-primary text-white hover:scale-[1.02]'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Memproses...</span>
                          </>
                        ) : isSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Terunduh!</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh File</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Quick Action */}
            <div className="p-4 bg-[#101827] border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 text-center sm:text-left">
                Semua dokumen siap cetak dan bebas data dummy.
              </span>
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl neu-btn text-slate-400 hover:text-white font-semibold transition-colors flex-1 sm:flex-none text-center"
                >
                  Tutup
                </button>
                <button
                  onClick={() => triggerDownload('master-docx-footer', exportItems[0].action)}
                  className="px-4 py-2 rounded-xl neu-btn-emerald font-bold text-white transition-all flex items-center justify-center space-x-1.5 flex-1 sm:flex-none"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Master Paket (.docx)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
