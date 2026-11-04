import React, { useState, useMemo } from 'react';
import {
  RESTAURANT_SERVICE_MODES,
  RESTAURANT_SERVICE_CATEGORIES,
  RestaurantServiceMode,
  ServiceModeStep
} from '../data/restaurantServiceModesData';
import {
  UtensilsCrossed,
  Layers,
  Cpu,
  Car,
  Sparkles,
  Search,
  CheckCircle2,
  Download,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  Server,
  Database,
  Radio,
  Clock,
  ArrowRight,
  ShieldCheck,
  Flame,
  AlertTriangle,
  FileText,
  SlidersHorizontal,
  Bot,
  RefreshCw,
  PackageCheck,
  Play,
  RotateCcw,
  Presentation
} from 'lucide-react';
import { generateServiceModesDocx } from '../utils/serviceModesDocxGenerator';
import { DevMeetingPitchDeckViewer } from './DevMeetingPitchDeckViewer';

export const RestaurantServiceModesViewer: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModeId, setActiveModeId] = useState<string>('american_service');
  const [viewMode, setViewMode] = useState<'detail' | 'matrix' | 'simulator' | 'slides'>('detail');
  const [simulationStepIndex, setSimulationStepIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Filtered modes
  const filteredModes = useMemo(() => {
    return RESTAURANT_SERVICE_MODES.filter((mode) => {
      const matchCategory = selectedCategoryId === 'all' || mode.categoryId === selectedCategoryId;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchText =
        mode.name.toLowerCase().includes(q) ||
        mode.englishTitle.toLowerCase().includes(q) ||
        mode.overview.toLowerCase().includes(q) ||
        mode.targetVenues.some((v) => v.toLowerCase().includes(q)) ||
        mode.techArchitecture.hardwareRequired.some((h) => h.toLowerCase().includes(q)) ||
        mode.techArchitecture.protocols.some((p) => p.protocol.toLowerCase().includes(q));

      return matchCategory && matchText;
    });
  }, [selectedCategoryId, searchQuery]);

  // Current active mode object
  const activeMode: RestaurantServiceMode = useMemo(() => {
    return (
      RESTAURANT_SERVICE_MODES.find((m) => m.id === activeModeId) ||
      RESTAURANT_SERVICE_MODES[0]
    );
  }, [activeModeId]);

  // Copy Markdown Spec to Clipboard for Developer / Jira / Confluence
  const handleCopyMarkdown = () => {
    const md = `
# RestoSync Developer Technical Specification
## ${activeMode.name} (${activeMode.englishTitle})
**Kategori:** ${activeMode.categoryName}
**Badge:** ${activeMode.badge}

### Ringkasan Operasional
${activeMode.overview}

**Metrik:**
- Rata-rata Durasi Meja: ${activeMode.metrics.turnaroundTime}
- Tingkat Ketergantungan Teknologi: ${activeMode.metrics.techReliance}
- Intensitas Tenaga Kerja: ${activeMode.metrics.laborIntensity}
- Risiko Waste Bahan Baku: ${activeMode.metrics.wasteRiskLevel}
- Target Venue: ${activeMode.targetVenues.join(', ')}

---

### Alur Langkah Sistem & Operasional (5 Tahap)
${activeMode.operationalFlow
  .map(
    (s) => `
#### Tahap ${s.stepNumber}: ${s.phaseName}
- **Pelaku:** ${s.actor}
- **Tindakan:** ${s.actionSummary}
- **Detail Alur:** ${s.detailFlow}
- **System Trigger:** \`${s.systemTrigger}\`
- **Dampak Database:** ${s.dbImpact}
`
  )
  .join('\n')}

---

### Arsitektur Hardware & Protokol Jaringan
- **Hardware:** ${activeMode.techArchitecture.hardwareRequired.join(', ')}
- **Frontend Perangkat:** ${activeMode.techArchitecture.frontendDevices.join(', ')}

#### Protokol Komunikasi:
${activeMode.techArchitecture.protocols
  .map((p) => `- \`[${p.protocol}]\` ${p.usage} (Target: ${p.targetDeviceOrService})`)
  .join('\n')}

#### Endpoint API Utama:
${activeMode.techArchitecture.apiEndpoints
  .map(
    (e) => `
- **${e.method}** \`${e.endpoint}\`
  ${e.description}
  \`\`\`json
  ${e.samplePayload || '{}'}
  \`\`\`
`
  )
  .join('\n')}

---

### Logika Pemotongan Stok & Inventaris
- **Waktu Deduct:** ${activeMode.techArchitecture.inventoryDeductionRule.timing}
- **Logika BOM:** ${activeMode.techArchitecture.inventoryDeductionRule.logic}
- **Pemetaan BOM:** ${activeMode.techArchitecture.inventoryDeductionRule.bomMapping}
- **Waste & Spoilage:** ${activeMode.techArchitecture.inventoryDeductionRule.spoilageAndWaste}

### Concurrency & Row-Level Locking
- **Mekanisme Lock:** ${activeMode.techArchitecture.concurrencyAndLocking.lockMechanism}
- **Penanganan Race Condition:** ${activeMode.techArchitecture.concurrencyAndLocking.raceConditionHandling}
- **Kebijakan Rollback:** ${activeMode.techArchitecture.concurrencyAndLocking.rollbackPolicy}

### Ketahanan Mode Offline
- **Penyimpanan Lokal:** ${activeMode.techArchitecture.offlineResilience.localPersistence}
- **Strategi Sinkronisasi:** ${activeMode.techArchitecture.offlineResilience.syncStrategy}

### Checklist Implementasi Tim Developer
${activeMode.techArchitecture.developerChecklist.map((c) => `- [ ] ${c}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(md);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download Word docx
  const handleDownloadDocx = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateServiceModesDocx();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `RestoSync_Blueprint_16_Model_Layanan_Resto_Arsitektur_Dev.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading docx:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-blue-700">Arsitektur F&amp;B Engineering</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-medium">16 Model Layanan Restoran Lengkap</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-mono">5 Kategori Industri</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Panduan 16 Model Layanan Resto &amp; Arsitektur Developer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-4xl leading-relaxed">
              Penjelasan gamblang alur operasional tamu dan staf, pemetaan perangkat keras (POS, KDS, RFID, Loop Detector, Robot), protokol jaringan (WSS, MQTT, Modbus, ESC/POS), API endpoints, serta proteksi stok inventaris untuk Anda diskusikan dan implementasikan bersama tim developer.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all active:scale-95 border border-black/[0.04]"
              title="Salin Spesifikasi Teknis Metode Ini dalam Format Markdown (untuk Jira/Notion)"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{isCopied ? 'Tersalin!' : 'Salin Panduan Dev (Markdown)'}</span>
            </button>

            <button
              onClick={handleDownloadDocx}
              disabled={isDownloading}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50"
              title="Unduh Seluruh 16 Model dalam Dokumen Word (.docx)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isDownloading ? 'Menyusun Word...' : 'Download Word (.docx)'}</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher & Category Filter Tabs */}
        <div className="mt-6 pt-5 border-t border-black/[0.04] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategoryId === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-black/[0.04]'
              }`}
            >
              Semua ({RESTAURANT_SERVICE_MODES.length})
            </button>
            {RESTAURANT_SERVICE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategoryId === cat.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-black/[0.04]'
                }`}
              >
                {cat.title.split('(')[0].trim()} ({cat.count})
              </button>
            ))}
          </div>

          {/* View Modes (Detail, Matrix, Simulator) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl shrink-0 self-start md:self-auto border border-black/[0.03]">
            <button
              onClick={() => setViewMode('detail')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                viewMode === 'detail'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Detail &amp; Alur Sistem
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                viewMode === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Matriks Perbandingan
            </button>
            <button
              onClick={() => setViewMode('simulator')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 ${
                viewMode === 'simulator'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Simulasi Interaktif</span>
            </button>
            <button
              onClick={() => setViewMode('slides')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                viewMode === 'slides'
                  ? 'bg-slate-900 text-cyan-400 shadow-md border border-cyan-500/30'
                  : 'text-cyan-700 hover:text-cyan-900 hover:bg-white/60'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slide Apple Keynote (13 Slide PPTX)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-cyan-500 text-slate-950">
                PPTX
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 4: SLIDE DECK APPLE KEYNOTE (DEV MEETING) */}
      {viewMode === 'slides' && (
        <DevMeetingPitchDeckViewer />
      )}

      {/* VIEW MODE 1: DETAIL & ALUR SISTEM */}
      {viewMode === 'detail' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Method Selector List */}
          <div className="lg:col-span-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari metode, hardware (RFID, Robot, Intercom, Loop)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-black/[0.06] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* List of Models */}
            <div className="space-y-1.5 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredModes.map((mode, idx) => {
                const isSelected = mode.id === activeMode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setActiveModeId(mode.id);
                      setSimulationStepIndex(0);
                    }}
                    className={`w-full text-left p-3 rounded-2xl transition-all border flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-black/[0.05]'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <span className="text-xs font-bold truncate">{mode.name.split('(')[0].trim()}</span>
                      </div>
                      <div className={`text-[11px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {mode.englishTitle}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                        <span>{mode.categoryName}</span>
                        <span>·</span>
                        <span>{mode.metrics.turnaroundTime}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isSelected ? 'text-amber-400 translate-x-0.5' : 'text-slate-300'}`} />
                  </button>
                );
              })}

              {filteredModes.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-black/[0.08] text-slate-400 text-xs">
                  Tidak ditemukan metode yang cocok dengan pencarian "{searchQuery}".
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Deep-Dive Details of Active Method */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Overview & Metrics */}
            <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.04] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-700">{activeMode.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500 font-mono">{activeMode.englishTitle}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                    {activeMode.name}
                  </h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide self-start sm:self-auto ${activeMode.badgeColor}`}>
                  {activeMode.badge}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeMode.overview}
              </p>

              {/* Operational Metrics Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-slate-50 border border-black/[0.03]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Waktu Meja</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{activeMode.metrics.turnaroundTime}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-black/[0.03]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ketergantungan IT</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{activeMode.metrics.techReliance}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-black/[0.03]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Intensitas Staf</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{activeMode.metrics.laborIntensity}</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-black/[0.03]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Risiko Waste</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{activeMode.metrics.wasteRiskLevel}</div>
                </div>
              </div>

              {/* Target Venues */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
                <span className="font-semibold text-slate-500 mr-1">Cocok Untuk:</span>
                {activeMode.targetVenues.map((v, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {v}
                  </span>
                ))}
              </div>
            </div>

            {/* Card 2: Interactive 5-Step Operational Flowchart */}
            <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Alur Langkah Operasional &amp; Sistem (5 Tahap)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perjalanan pelanggan dari kedatangan hingga selesai dan bagaimana sistem merespons di setiap detik.
                  </p>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-4">
                {activeMode.operationalFlow.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-50 border border-black/[0.04] space-y-2.5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{step.phaseName}</h4>
                          <span className="text-[11px] text-blue-600 font-semibold">{step.actor}</span>
                        </div>
                      </div>
                      {step.apiTrigger && (
                        <code className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 shrink-0 hidden sm:inline-block">
                          {step.apiTrigger}
                        </code>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {step.actionSummary}
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.detailFlow}
                    </p>

                    {/* Technical Footprint Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-black/[0.04] text-[11px]">
                      <div className="p-2 rounded-xl bg-white border border-black/[0.03]">
                        <span className="text-slate-400 font-medium block">Sistem Event Trigger:</span>
                        <span className="font-mono text-emerald-700 font-semibold">{step.systemTrigger}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-black/[0.03]">
                        <span className="text-slate-400 font-medium block">Dampak Database / State:</span>
                        <span className="text-slate-700">{step.dbImpact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Developer Architecture & Integrasi Hardware */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Arsitektur Perangkat Keras, Protokol &amp; API (Dev Blueprint)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Spesifikasi teknis yang wajib disiapkan tim developer, engineer IoT, dan backend architect.
                  </p>
                </div>
              </div>

              {/* Hardware & Devices Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" />
                    Perangkat Keras (Hardware Required)
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {activeMode.techArchitecture.hardwareRequired.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-0.5">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5" />
                    Perangkat Tampilan &amp; Frontend
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {activeMode.techArchitecture.frontendDevices.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Communication Protocols */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Protokol Komunikasi Jaringan:
                </span>
                <div className="space-y-2">
                  {activeMode.techArchitecture.protocols.map((proto, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono font-bold text-[11px]">
                          {proto.protocol}
                        </span>
                        <span className="text-slate-300">{proto.usage}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Target: {proto.targetDeviceOrService}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* API Endpoints */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Spesifikasi Endpoint API:
                </span>
                <div className="space-y-2">
                  {activeMode.techArchitecture.apiEndpoints.map((ep, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/90 border border-white/10 space-y-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px]">
                          {ep.method}
                        </span>
                        <span className="font-mono text-cyan-300">{ep.endpoint}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{ep.description}</p>
                      {ep.samplePayload && (
                        <pre className="p-2.5 rounded-lg bg-black/60 text-slate-300 font-mono text-[10px] overflow-x-auto">
                          {ep.samplePayload}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Concurrency & Inventory Lock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    Aturan Pemotongan Stok (Inventory BOM)
                  </span>
                  <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                    <p><strong>Timing:</strong> {activeMode.techArchitecture.inventoryDeductionRule.timing}</p>
                    <p><strong>Logika:</strong> {activeMode.techArchitecture.inventoryDeductionRule.logic}</p>
                    <p><strong>Pemetaan:</strong> {activeMode.techArchitecture.inventoryDeductionRule.bomMapping}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Concurrency &amp; Offline Mode
                  </span>
                  <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                    <p><strong>Lock Mechanism:</strong> {activeMode.techArchitecture.concurrencyAndLocking.lockMechanism}</p>
                    <p><strong>Race Condition:</strong> {activeMode.techArchitecture.concurrencyAndLocking.raceConditionHandling}</p>
                    <p><strong>Offline Sync:</strong> {activeMode.techArchitecture.offlineResilience.syncStrategy}</p>
                  </div>
                </div>
              </div>

              {/* Developer Checklist */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Checklist Pekerjaan untuk Tim Developer:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {activeMode.techArchitecture.developerChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded bg-white/10 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        ✓
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 4: Sample JSON Event Payload */}
            <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Contoh Real JSON WebSocket / Webhook Event:
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeMode.sampleJsonPayload);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Copy className="w-3 h-3" />
                  <span>{isCopied ? 'Tersalin' : 'Salin JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed border border-black/[0.04]">
                {activeMode.sampleJsonPayload}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: MATRIKS PERBANDINGAN DEV (ALL 16 METHODS) */}
      {viewMode === 'matrix' && (
        <div className="bg-white border border-black/[0.06] rounded-3xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-black/[0.04]">
            <h3 className="text-base font-bold text-slate-900">
              Matriks Komparasi 16 Model Layanan Restoran &amp; Arsitektur Teknis
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Tabel perbandingan berdampingan: hardware utama, protokol jaringan, metode potong stok, kecepatan putar meja, dan tingkat ketergantungan IT.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-black/[0.06]">
                <tr>
                  <th className="py-3.5 px-4">Metode &amp; Kategori</th>
                  <th className="py-3.5 px-3">Hardware Utama</th>
                  <th className="py-3.5 px-3">Protokol Jaringan</th>
                  <th className="py-3.5 px-3">Metode Potong Stok (BOM)</th>
                  <th className="py-3.5 px-3">Waktu Meja</th>
                  <th className="py-3.5 px-3">Ketergantungan IT</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] text-slate-700">
                {RESTAURANT_SERVICE_MODES.map((mode) => (
                  <tr key={mode.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{mode.name.split('(')[0].trim()}</div>
                      <div className="text-[11px] text-slate-400">{mode.categoryName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="max-w-xs text-[11px] truncate text-slate-600" title={mode.techArchitecture.hardwareRequired.join(', ')}>
                        {mode.techArchitecture.hardwareRequired[0]} &amp; lainnya
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {mode.techArchitecture.protocols.slice(0, 2).map((p, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-700">
                            {p.protocol.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-slate-600">{mode.techArchitecture.inventoryDeductionRule.timing.split(':')[0]}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                      {mode.metrics.turnaroundTime}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mode.metrics.techReliance === 'Otomasi Penuh'
                          ? 'bg-cyan-100 text-cyan-800'
                          : mode.metrics.techReliance === 'Tinggi'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {mode.metrics.techReliance}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setActiveModeId(mode.id);
                          setViewMode('detail');
                        }}
                        className="px-3 py-1 rounded-full bg-slate-900 hover:bg-black text-white text-[11px] font-semibold transition-all active:scale-95"
                      >
                        Buka Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: SIMULATOR ALUR INTERAKTIF */}
      {viewMode === 'simulator' && (
        <div className="space-y-6">
          {/* Simulation Header */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Simulasi Jalur Data Real-Time
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Simulasi Alur: {activeMode.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Klik langkah 1 sampai 5 untuk melihat pergerakan paket data dari pelanggan, server, layar dapur, hingga pemotongan stok gudang.
                </p>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-2">
                <button
                  disabled={simulationStepIndex === 0}
                  onClick={() => setSimulationStepIndex(Math.max(0, simulationStepIndex - 1))}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold disabled:opacity-30 transition-all"
                >
                  Sebelumnya
                </button>
                <span className="text-xs font-mono text-slate-400 px-1">
                  Langkah {simulationStepIndex + 1} / 5
                </span>
                <button
                  disabled={simulationStepIndex === 4}
                  onClick={() => setSimulationStepIndex(Math.min(4, simulationStepIndex + 1))}
                  className="px-3 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold disabled:opacity-30 transition-all shadow-xs"
                >
                  Lanjut &rarr;
                </button>
                <button
                  onClick={() => setSimulationStepIndex(0)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  title="Ulangi dari Langkah 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {activeMode.operationalFlow.map((step, idx) => {
                const isCurrent = idx === simulationStepIndex;
                const isPast = idx < simulationStepIndex;
                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => setSimulationStepIndex(idx)}
                    className={`p-2.5 rounded-xl text-left transition-all border ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm font-bold'
                        : isPast
                        ? 'bg-white/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-white/5 text-slate-400 border-white/5'
                    }`}
                  >
                    <div className="text-[10px] font-mono">Fase 0{step.stepNumber}</div>
                    <div className="text-xs truncate">{step.phaseName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Interactive Breakdown Card */}
          {(() => {
            const currentStep = activeMode.operationalFlow[simulationStepIndex];
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Node 1: Client & Pelaku */}
                <div className="p-6 rounded-3xl bg-white border border-black/[0.06] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">1. Sisi Frontline / Tamu</span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{currentStep.actor}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{currentStep.actionSummary}</p>
                  <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-xs text-blue-900">
                    <span className="font-semibold block mb-0.5">Detail Lapangan:</span>
                    {currentStep.detailFlow}
                  </div>
                </div>

                {/* Node 2: Server API & Network Protocol */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">2. Lapisan Server &amp; Jaringan</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-mono text-xs truncate">
                    {currentStep.apiTrigger || 'Internal Worker Trigger'}
                  </h4>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 space-y-1 font-mono text-xs text-cyan-300">
                    <div className="text-[10px] text-slate-400 uppercase">Event Dispatched:</div>
                    <div>{currentStep.systemTrigger}</div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sistem memancarkan paket data secara asinkronus ke KDS dapur dan modul terkait tanpa jeda (&lt;150ms).
                  </p>
                </div>

                {/* Node 3: Database & Hardware Impact */}
                <div className="p-6 rounded-3xl bg-white border border-black/[0.06] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">3. Dampak Database &amp; Stok</span>
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Mutasi State &amp; Gudang</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{currentStep.dbImpact}</p>
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900">
                    <span className="font-semibold block mb-0.5">Status Proteksi ACID:</span>
                    Transaksi terkunci aman (Row Locked), siap rollback otomatis jika terjadi kegagalan sistem.
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
