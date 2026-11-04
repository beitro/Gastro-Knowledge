import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Terminal, 
  Database, 
  ShieldCheck, 
  Download, 
  PlayCircle, 
  FileText, 
  Network, 
  Bell, 
  RotateCcw, 
  SlidersHorizontal, 
  ChefHat, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  UtensilsCrossed,
  Smartphone,
  Presentation,
  FolderOpen,
  LayoutGrid,
  Search,
  ExternalLink,
  ChevronRight,
  Warehouse,
  Briefcase,
  Users
} from 'lucide-react';

export type ActiveTab = 
  | 'brd' 
  | 'pitchdeck'
  | 'servicemodes'
  | 'wireframe'
  | 'figma'
  | 'swimlane' 
  | 'simulator' 
  | 'operations' 
  | 'flowcharts' 
  | 'apispec' 
  | 'database' 
  | 'concurrency';

export type RoleCategory = 'all' | 'kasir' | 'dapur' | 'gudang' | 'manajemen';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenExport: () => void;
  onToggleWidgets?: () => void;
}

interface NavItem {
  id: ActiveTab;
  roles: RoleCategory[];
  label: string;
  shortLabel: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  subtitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  onToggleWidgets,
}) => {
  const [selectedRole, setSelectedRole] = useState<RoleCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Stok Daging Sapi Sirloin Menipis',
      message: 'Tersisa 1.4 kg (Par Min: 5.0 kg). Auto-PO disiapkan ke Supplier PT Meat Prima.',
      time: 'Baru saja',
    },
    {
      id: 2,
      type: 'info',
      title: 'Proteksi Defisit Aktif (ACID Rollback)',
      message: 'Transaksi Kasir POS memvalidasi stok riil sebelum melempar tiket ke layar KDS.',
      time: '2 mnt lalu',
    },
    {
      id: 3,
      type: 'success',
      title: 'Dokumen 4 Fase Siap Diunduh',
      message: 'Format Word .docx dengan blanko formulir resmi siap cetak dan tanda tangan.',
      time: '10 mnt lalu',
    },
  ]);

  // Full 12 Modules accurately mapped to 4 Primary User Roles (Kasir, Dapur, Gudang, Manajemen & Dev)
  const navItems: NavItem[] = [
    // 1. KASIR (Front of House & POS)
    {
      id: 'servicemodes',
      roles: ['kasir', 'manajemen'],
      label: '16 Model Layanan Restoran & Arsitektur Dev',
      shortLabel: '16 Model Layanan',
      badge: '16 MODEL',
      badgeColor: 'text-cyan-400 bg-cyan-950/70 border-cyan-500/30',
      icon: <Layers className="w-3.5 h-3.5" />,
      subtitle: 'Table Service, Kiosk, Counter, Drive-Thru, Conveyor, Robot & Protokol Hardware',
    },
    {
      id: 'simulator',
      roles: ['kasir', 'dapur', 'gudang'],
      label: 'Kasir POS & KDS Live Engine',
      shortLabel: 'Kasir POS & KDS Live',
      badge: 'LIVE ENGINE',
      badgeColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/30',
      icon: <PlayCircle className="w-3.5 h-3.5" />,
      subtitle: 'Simulasi Order Kasir, Deduct Resep BOM Atomik & Rollback Defisit',
    },
    {
      id: 'wireframe',
      roles: ['kasir', 'dapur', 'gudang', 'manajemen'],
      label: 'Wireframe & Prototype Multi-Role',
      shortLabel: 'Wireframe UX (6 Role)',
      badge: '6 ROLE UX',
      badgeColor: 'text-slate-300 bg-slate-800 border-slate-700',
      icon: <Smartphone className="w-3.5 h-3.5" />,
      subtitle: 'Simulasi Alur Kasir, Waiter, KDS, Manager, Owner & Gudang',
    },

    // 2. DAPUR (Kitchen Display System - KDS)
    {
      id: 'operations',
      roles: ['dapur', 'kasir'],
      label: 'SOP & Aksi Operasional Resto',
      shortLabel: 'SOP Resto',
      badge: 'SOP HARIAN',
      badgeColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/30',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      subtitle: 'SOP Opening Kasir, Shift Handover & Closing Kitchen',
    },
    {
      id: 'swimlane',
      roles: ['dapur', 'kasir', 'manajemen'],
      label: 'Swimlane Inter-Sistem Sinkronisasi',
      shortLabel: 'Swimlane Alur',
      badge: '4 AKTOR',
      badgeColor: 'text-blue-400 bg-blue-950/70 border-blue-500/30',
      icon: <Layers className="w-3.5 h-3.5" />,
      subtitle: 'Sinkronisasi Kasir POS, KDS Dapur, Gudang & Executive Dashboard',
    },

    // 3. GUDANG (Stok & Supply Chain)
    {
      id: 'figma',
      roles: ['gudang', 'kasir', 'manajemen'],
      label: 'Figma Studio Canvas 2.0 & Tokens',
      shortLabel: 'Figma Studio 2.0',
      badge: '2.0 VECTOR',
      badgeColor: 'text-purple-400 bg-purple-950/70 border-purple-500/30',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      subtitle: 'Canvas Vektor 2.0, 16 Model Layanan & Copy-Paste SVG Langsung (Ctrl+V)',
    },

    // 4. MANAJEMEN & DEV (Executive BI, Legal & Architecture)
    {
      id: 'brd',
      roles: ['manajemen'],
      label: 'Dokumen Resmi 4 Fase (PRD, FSD, TSD, BRD & SOP)',
      shortLabel: 'Dokumen Resmi (7 DOCX)',
      badge: '7 DOCX',
      badgeColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/30',
      icon: <FileText className="w-3.5 h-3.5" />,
      subtitle: 'Preview & Download 7 Dokumen Word Resmi, UI/UX Captures, Flow & 4-Fase',
    },
    {
      id: 'pitchdeck',
      roles: ['manajemen'],
      label: 'Pitch Deck Apple Keynote & 50 Audit Resto',
      shortLabel: 'Pitch Deck & 50 Tanya',
      badge: 'PPTX + 50 Q',
      badgeColor: 'text-rose-400 bg-rose-950/70 border-rose-500/30',
      icon: <Presentation className="w-3.5 h-3.5" />,
      subtitle: 'Slide Presentasi Penjualan Berstandar Apple, Visual Hero & Unduh PPTX',
    },
    {
      id: 'flowcharts',
      roles: ['manajemen', 'kasir', 'dapur'],
      label: 'Flowchart BPMN & Draw.io',
      shortLabel: 'Flowchart Draw.io',
      badge: '.DRAWIO.XML',
      badgeColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/30',
      icon: <Network className="w-3.5 h-3.5" />,
      subtitle: 'Peta Diagram Alur Sistem End-to-End & Ekspor XML',
    },
    {
      id: 'apispec',
      roles: ['manajemen'],
      label: 'Spesifikasi API REST & WebSocket',
      shortLabel: 'API & WS Spec',
      badge: 'REST + WS',
      badgeColor: 'text-cyan-400 bg-cyan-950/70 border-cyan-500/30',
      icon: <Terminal className="w-3.5 h-3.5" />,
      subtitle: 'Spesifikasi Endpoint REST & WebSocket Tiket Dapur <15ms',
    },
    {
      id: 'database',
      roles: ['manajemen', 'gudang'],
      label: 'Database ERD & Skema DDL Relasional',
      shortLabel: 'Database ERD',
      badge: 'POSTGRES 15',
      badgeColor: 'text-slate-300 bg-slate-800 border-slate-700',
      icon: <Database className="w-3.5 h-3.5" />,
      subtitle: 'Skema Relasional PostgreSQL & Log Mutasi Stok Bertingkat',
    },
    {
      id: 'concurrency',
      roles: ['manajemen', 'kasir'],
      label: 'ACID & Row-Level Locking Concurrency',
      shortLabel: 'ACID & Row-Lock',
      badge: 'ZERO OVERSELL',
      badgeColor: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/30',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      subtitle: 'Row-Level Locking & Pencegah Overselling Multi-Kasir',
    },
  ];

  // 4 Primary Roles definition requested by user
  const roleCategories: { id: RoleCategory; label: string; count: number; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: 'Semua Peran',
      count: 12,
      icon: <LayoutGrid className="w-3.5 h-3.5 text-slate-400" />,
    },
    {
      id: 'kasir',
      label: 'Kasir (POS & FOH)',
      count: 3,
      icon: <Smartphone className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      id: 'dapur',
      label: 'Dapur (KDS & Station)',
      count: 3,
      icon: <ChefHat className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      id: 'gudang',
      label: 'Gudang (Stok FEFO)',
      count: 3,
      icon: <Warehouse className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      id: 'manajemen',
      label: 'Manajemen & Dev',
      count: 7,
      icon: <Briefcase className="w-3.5 h-3.5 text-indigo-400" />,
    },
  ];

  // Find currently active item
  const currentItem = useMemo(() => {
    return navItems.find((item) => item.id === activeTab) || navItems[0];
  }, [activeTab]);

  // Filter items based on selectedRole and searchQuery
  const filteredNavItems = useMemo(() => {
    return navItems.filter((item) => {
      const matchRole = selectedRole === 'all' || item.roles.includes(selectedRole);
      const matchQuery = !searchQuery || 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchQuery;
    });
  }, [selectedRole, searchQuery]);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* 1. TOP BRAND & ACTION ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between gap-3">
        {/* Brand Group (Tactile Neumorphic) */}
        <div 
          onClick={() => {
            setActiveTab('brd');
            setSelectedRole('all');
          }}
          className="flex items-center space-x-3 cursor-pointer shrink-0 select-none group"
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl neu-flat text-white transition-transform group-hover:scale-105">
            <UtensilsCrossed className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                Gastro Knowledge System
              </span>
              <span className="neu-tag px-2 py-0.5 text-[10px] font-bold tracking-wider rounded-md text-cyan-400">
                Resto OS 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block font-normal">
              Sistem Manajemen Inventaris &amp; Operasional Restoran
            </p>
          </div>
        </div>

        {/* Center Current Module Breadcrumb / Info Capsule */}
        <div className="hidden lg:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl neu-pressed text-xs">
          <div className="flex items-center justify-center text-cyan-400">
            {currentItem.icon}
          </div>
          <span className="font-bold text-slate-200">{currentItem.shortLabel}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-normal truncate max-w-xs">{currentItem.subtitle}</span>
        </div>

        {/* Right Action Icons & Primary Triggers */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Quick Kasir POS & KDS Button */}
          <button
            onClick={() => {
              setActiveTab('simulator');
              setSelectedRole('kasir');
            }}
            className={`hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'neu-btn-active text-cyan-400'
                : 'neu-btn text-slate-300 hover:text-white'
            }`}
            title="Buka Layar Kasir POS & Dapur KDS Live"
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kasir &amp; KDS</span>
            <span className="neu-tag px-1.5 py-0.2 rounded text-[10px] font-extrabold text-emerald-400">
              LIVE
            </span>
          </button>

          {/* Quick Master Export Modal Trigger */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl neu-btn-emerald text-white text-xs font-bold transition-all cursor-pointer"
            title="Download Master Dokumen Suite (.docx & formulir)"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Dokumen</span>
            <span className="neu-tag px-1.5 py-0.2 rounded text-[10px] text-white font-extrabold bg-emerald-950/60">
              7 DOCX
            </span>
          </button>

          {/* Widget Kanan Toggle Button */}
          {onToggleWidgets && (
            <button
              onClick={onToggleWidgets}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl neu-btn text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              title="Panel Ringkasan & Kalkulator Cepat"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Widget Kanan</span>
            </button>
          )}

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 rounded-xl neu-btn text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Pemberitahuan & Peringatan Stok"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-92 neu-flat rounded-2xl border border-slate-700/80 shadow-2xl z-50 overflow-hidden p-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">
                    Notifikasi Sistem ({notifications.length})
                  </span>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    >
                      Bersihkan
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-400 mb-1" />
                      <p className="text-xs font-medium text-slate-300">
                        Semua sistem dan stok dalam kondisi optimal
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 text-xs flex items-start space-x-2.5 neu-flat-sm rounded-xl hover:border-slate-600/60 transition-colors"
                      >
                        <span className="mt-0.5">
                          {n.type === 'warning' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-100">{n.title}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetModal(true)}
            className="w-9 h-9 rounded-xl neu-btn text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Reset Data Simulasi"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. ROLE-BASED SEGMENTED CONTROL: KASIR, DAPUR, GUDANG, MANAJEMEN */}
      <div className="bg-[#0E1524] border-t border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Peran Operasional:</span>
          </span>

          {/* Role Filter Segmented Control */}
          <div className="inline-flex gap-1.5">
            {roleCategories.map((cat) => {
              const isSelected = selectedRole === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedRole(cat.id)}
                  className={`
                    px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center space-x-1.5 cursor-pointer
                    ${isSelected
                      ? 'neu-btn-active text-cyan-400 font-bold'
                      : 'neu-btn text-slate-400 hover:text-slate-200'
                    }
                  `}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span className={`neu-tag px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    isSelected ? 'text-cyan-300' : 'text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Knowledge Search Input */}
        <div className="relative shrink-0 w-44 sm:w-60 hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari modul / topik..."
            className="w-full pl-8.5 pr-3 py-1.5 text-xs neu-pressed rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-200 font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. SUB-MODULE HORIZONTAL NEUMORPHIC PILLS */}
      <div className="bg-[#0B0F19] px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto scrollbar-none flex items-center space-x-2">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 shrink-0 pr-1">
          Modul:
        </span>

        {filteredNavItems.length === 0 ? (
          <span className="text-xs text-slate-500 italic">
            Tidak ada modul yang cocok dengan pencarian "{searchQuery}"
          </span>
        ) : (
          filteredNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (selectedRole !== 'all' && !item.roles.includes(selectedRole)) {
                    setSelectedRole('all');
                  }
                }}
                className={`
                  px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center space-x-2 cursor-pointer
                  ${isActive
                    ? 'neu-btn-active text-cyan-400 font-bold'
                    : 'neu-btn text-slate-300 hover:text-white'
                  }
                `}
                title={item.subtitle}
              >
                <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.shortLabel}</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* Reset Data Confirmation Modal (Tactile Neumorphic) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="neu-flat border border-slate-700/80 rounded-3xl max-w-sm w-full p-6 text-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              Kembalikan Data Awal?
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Tindakan ini akan mengatur ulang stok bahan, formulir interaktif, dan simulasi kasir ke data default standar Gastro Knowledge System RestoSync.
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white neu-btn rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  window.location.reload();
                }}
                className="px-4 py-2 text-xs font-bold neu-btn text-rose-400 border border-rose-500/30 hover:border-rose-500/60 rounded-xl transition-colors cursor-pointer"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
