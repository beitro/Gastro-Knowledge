import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  FileText, 
  Download, 
  Layers, 
  PlayCircle, 
  ShieldCheck, 
  Network, 
  Database, 
  Terminal, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Thermometer, 
  AlertTriangle, 
  ChefHat, 
  Warehouse, 
  ArrowUpRight,
  CheckCircle2,
  Package,
  Flame,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { generateMaster4PhasesDocx } from '../utils/masterDocxGenerator';
import { SWIMLANE_SCENARIOS } from '../data/swimlaneScenariosData';
import { generateAllScenariosDrawioXml } from '../utils/drawioXmlGenerator';

interface RightSidebarWidgetProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const RightSidebarWidget: React.FC<RightSidebarWidgetProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      setTimeString(
        new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: !1,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickDownloadDocx = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateMaster4PhasesDocx();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RestoSync_Master_Dokumen_4_Fase_Blanko_Formulir_v2.0.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleQuickDownloadAllDrawio = () => {
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
      'light'
    );
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `restosync_swimlane_all_6_tabs.drawio`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const navModules = [
    {
      id: 'brd' as ActiveTab,
      title: 'Dokumen FSD, TSD, PRD & SOP',
      subtitle: 'Preview & download 7 Word .docx resmi',
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
      badge: '7 DOCX',
      badgeColor: 'bg-emerald-600 text-white font-bold',
    },
    {
      id: 'servicemodes' as ActiveTab,
      title: '16 Model Layanan & Dev',
      subtitle: 'Alur, hardware, protokol & API dev',
      icon: <Layers className="w-4 h-4 text-blue-600" />,
      badge: '16 METODE',
      badgeColor: 'bg-blue-600 text-white font-bold',
    },
    {
      id: 'wireframe' as ActiveTab,
      title: 'Wireframe & Prototype',
      subtitle: 'Simulasi Kasir, Waiter, KDS & Owner',
      icon: <Smartphone className="w-4 h-4 text-cyan-600" />,
      badge: 'ROLE UX',
      badgeColor: 'bg-cyan-600 text-white font-bold',
    },
    {
      id: 'figma' as ActiveTab,
      title: 'Figma Studio 2.0',
      subtitle: 'Canvas 16 Model, Vector SVG & Tokens 2.0',
      icon: <Sparkles className="w-4 h-4 text-cyan-500" />,
      badge: '2.0 NEW',
      badgeColor: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black',
    },
    {
      id: 'swimlane' as ActiveTab,
      title: 'Swimlane Interkoneksi',
      subtitle: 'Sinkronisasi POS, KDS & Gudang',
      icon: <Layers className="w-4 h-4 text-cyan-600" />,
      badge: 'SYNC',
      badgeColor: 'bg-cyan-600 text-white font-bold',
    },
    {
      id: 'simulator' as ActiveTab,
      title: 'Kasir POS & KDS Live',
      subtitle: 'Simulasi order, auto-deduct & defisit',
      icon: <PlayCircle className="w-4 h-4 text-amber-500" />,
      badge: 'LIVE',
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'operations' as ActiveTab,
      title: 'SOP Operasional Resto',
      subtitle: 'Opening, peak-hour & closing checklist',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
    },
    {
      id: 'flowcharts' as ActiveTab,
      title: 'Flowchart Draw.io',
      subtitle: 'Peta visual alur sistem end-to-end',
      icon: <Network className="w-4 h-4 text-purple-600" />,
    },
    {
      id: 'apispec' as ActiveTab,
      title: 'Spesifikasi REST & WS',
      subtitle: 'Payload tiket dapur & notifikasi',
      icon: <Terminal className="w-4 h-4 text-blue-600" />,
    },
    {
      id: 'database' as ActiveTab,
      title: 'Skema Database ERD',
      subtitle: 'Relasi tabel inventaris & audit log',
      icon: <Database className="w-4 h-4 text-teal-600" />,
    },
    {
      id: 'concurrency' as ActiveTab,
      title: 'ACID & Proteksi Stok',
      subtitle: 'Row lock pencegah overselling',
      icon: <CheckCircle2 className="w-4 h-4 text-rose-600" />,
    },
  ];

  const storageZones = [
    { label: 'Walk-in Chiller', temp: '3.2°C', icon: '❄️', status: 'Optimal' },
    { label: 'Deep Freezer', temp: '-18.5°C', icon: '🧊', status: 'Beku Maks' },
    { label: 'Dry Storage', temp: '22.0°C', icon: '📦', status: 'HACCP OK' },
    { label: 'Bar & Beverage', temp: '19.5°C', icon: '🍸', status: 'Sejuk' },
    { label: 'Packaging Bay', temp: '22.0°C', icon: '🥡', status: 'Kering' },
    { label: 'Gas Bay', temp: 'Safety OK', icon: '🔥', status: 'Aman' },
    { label: 'Chemical Storage', temp: 'HACCP OK', icon: '🧼', status: 'Terpisah' },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/25 backdrop-blur-xs z-40 xl:hidden animate-fade-in"
        />
      )}

      {/* Aside Container */}
      <aside
        className={`
          fixed xl:sticky top-0 right-0 z-40 h-screen xl:h-[calc(100vh-4.5rem)]
          bg-[#0E1524]/95 backdrop-blur-xl border-l border-slate-800/80 text-slate-200
          transition-all duration-300 ease-out flex flex-col shrink-0
          ${isOpenMobile ? 'translate-x-0 w-84 sm:w-92 shadow-2xl' : 'translate-x-full xl:translate-x-0'}
          ${isCollapsed ? 'xl:w-20' : 'xl:w-84 2xl:w-92'}
        `}
      >
        {/* Header Bar with Clock & Collapse */}
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between shrink-0 bg-[#121A2B]">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl neu-flat text-white shadow-xs">
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono font-bold text-xs text-white">{timeString}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Sistem Online · Real-Time</div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden xl:flex items-center justify-center w-8 h-8 rounded-xl neu-btn text-slate-300 hover:text-white transition-colors"
              title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            >
              {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <button
              onClick={onCloseMobile}
              className="xl:hidden flex items-center justify-center w-8 h-8 rounded-xl neu-btn text-slate-300 hover:text-white transition-colors"
              title="Tutup Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
          {!isCollapsed ? (
            <>
              {/* Primary Call-to-Action Card: 4-Phase Document Download */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-md relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950">
                    Buku Kerja Induk
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Word .docx</span>
                </div>
                <h4 className="text-sm font-bold text-white">Dokumen 4 Fase Restoran</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Format blanko siap centang <code className="text-emerald-300 font-mono">[☐]</code> & siap tulis tangan/cetak untuk pemilik & staf.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleQuickDownloadDocx}
                    disabled={isDownloading}
                    className="flex-1 py-2 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'Menyusun Word...' : 'Download .docx'}</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('brd')}
                    className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                    title="Buka Lembar Kerja Interaktif"
                  >
                    Buka
                  </button>
                </div>
              </div>

              {/* Pitch Deck Apple Keynote (.pptx) Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 text-white shadow-md relative overflow-hidden border border-cyan-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950">
                    Pitch Deck Klien
                  </span>
                  <span className="text-[11px] font-mono text-cyan-300 font-bold">PowerPoint .pptx</span>
                </div>
                <h4 className="text-sm font-bold text-white">Slide Apple Keynote (16:9)</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Slide penawaran penjualan berstandar Apple: visual hero, kecepatan, keamanan & ROI nyata untuk pemilik resto.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const { downloadPitchDeckPptx } = await import('../utils/pptxGenerator');
                      await downloadPitchDeckPptx();
                    }}
                    className="flex-1 py-2 px-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    title="Download Slide PowerPoint (.pptx)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .pptx</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('pitchdeck')}
                    className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                    title="Buka Slide Presentasi Interaktif"
                  >
                    Buka
                  </button>
                </div>
              </div>

              {/* Dev Meeting Pitch Deck (.pptx) Card */}
              <div className="p-4 rounded-3xl bg-slate-900 text-white shadow-md relative overflow-hidden border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-400 text-slate-950">
                    Rapat Tim Dev
                  </span>
                  <span className="text-[11px] font-mono text-cyan-300 font-bold">13 Slide .pptx</span>
                </div>
                <h4 className="text-sm font-bold text-white">Slide Arsitektur 16 Model Resto</h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  Format Apple Keynote: WSS, MQTT, Modbus PLC, RFID decay, Ground Loop &amp; ACID Row-Lock.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const { downloadDevModesPitchDeckPptx } = await import('../utils/devDeckPptxGenerator');
                      await downloadDevModesPitchDeckPptx();
                    }}
                    className="flex-1 py-2 px-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    title="Download Slide PowerPoint Rapat Tim Dev (.pptx)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .pptx</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('servicemodes')}
                    className="py-2 px-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
                    title="Buka Presentasi Dev Interaktif"
                  >
                    Buka
                  </button>
                </div>
              </div>

              {/* Quick Call-to-Action Card: Swimlane Draw.io 6-Tabs in 1 File */}
              <div className="p-4 rounded-3xl bg-amber-50/90 border border-amber-200/70 shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950">
                    Sekali Download
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-800">Draw.io (6 Tab)</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">Swimlane 6 Tab Draw.io</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  1 File <code className="text-amber-900 font-mono font-bold">.drawio</code> otomatis memuat ke-6 skenario sebagai tab mandiri saat dibuka di diagrams.net.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleQuickDownloadAllDrawio}
                    className="flex-1 py-2 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    title="Download 1 file berisi 6 Tab skenario untuk Draw.io"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download 6 Tab</span>
                  </button>
                  <button
                    onClick={() => handleSelectTab('swimlane')}
                    className="py-2 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-all"
                    title="Buka Kanvas Swimlane"
                  >
                    Buka
                  </button>
                </div>
              </div>

              {/* Real-time Storage Temperature Monitor */}
              <div className="p-4 rounded-3xl neu-flat-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Suhu &amp; Storage Monitoring</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    HACCP OK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {storageZones.slice(0, 4).map((zone, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-2xl neu-pressed flex items-center justify-between hover:border-slate-600/50 transition-colors"
                    >
                      <div className="flex items-center space-x-1.5 truncate">
                        <span className="text-sm shrink-0">{zone.icon}</span>
                        <div className="truncate">
                          <div className="text-[11px] font-semibold text-slate-200 truncate">{zone.label}</div>
                          <div className="text-[10px] font-mono text-cyan-400">{zone.temp}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Semua Storage Zone Normal
                  </span>
                  <button
                    onClick={() => handleSelectTab('swimlane')}
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    Alur Stok <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Module Directory */}
              <div className="space-y-1.5">
                <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Modul Arsitektur &amp; Operasional</span>
                  <span className="text-[10px] font-normal text-slate-500">{navModules.length} Modul</span>
                </div>

                <div className="space-y-1.5">
                  {navModules.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`
                          w-full p-2.5 rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer
                          ${isActive 
                            ? 'neu-btn-active text-cyan-400 font-bold' 
                            : 'neu-btn text-slate-300 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/30' : 'neu-pressed text-slate-400'}`}>
                            {item.icon}
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold truncate leading-tight">{item.title}</div>
                            <div className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                              {item.subtitle}
                            </div>
                          </div>
                        </div>

                        {item.badge && (
                          <span className={`shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] ${item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700')}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Operational Summary Card */}
              <div className="p-4 rounded-3xl neu-flat-sm space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Ringkasan Proteksi Restoran
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Auto-Deduct Resep BOM
                    </span>
                    <span className="font-bold text-white">Aktif Real-time</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Deficit Prevention Modal
                    </span>
                    <span className="font-bold text-white">ACID Rollback</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Sync Latensi KDS Dapur
                    </span>
                    <span className="font-mono font-bold text-cyan-400">&lt; 15 ms (LAN)</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Collapsed Icon-only view */
            <div className="space-y-3 flex flex-col items-center">
              <button
                onClick={handleQuickDownloadDocx}
                className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                title="Download Dokumen 4 Fase (.docx)"
              >
                <Download className="w-4 h-4" />
              </button>
              {navModules.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`
                      w-10 h-10 rounded-2xl flex items-center justify-center transition-all
                      ${isActive ? 'bg-slate-900 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-700 border border-black/[0.04]'}
                    `}
                    title={`${item.title} - ${item.subtitle}`}
                  >
                    {item.icon}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
