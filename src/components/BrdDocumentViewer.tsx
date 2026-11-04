import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Database, 
  ChefHat, 
  Warehouse, 
  LayoutDashboard, 
  ExternalLink,
  BookOpen,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Monitor,
  Printer as PrinterIcon,
  Wifi,
  Server,
  Calendar,
  FileSpreadsheet,
  Settings,
  HelpCircle,
  Award,
  Coffee,
  UtensilsCrossed,
  Zap,
  ShoppingBag,
  Edit3,
  CheckSquare,
  Square,
  RotateCcw,
  Smartphone
} from 'lucide-react';
import { generateMaster4PhasesDocx, ClientCustomFormData } from '../utils/masterDocxGenerator';
import { generateBrdWordDocumentBlob } from '../utils/brdDocxGenerator';

type ActiveDocPhase = 'all' | 'phase1' | 'phase2' | 'phase3' | 'phase4';

export const BrdDocumentViewer: React.FC = () => {
  const [activePhase, setActivePhase] = useState<ActiveDocPhase>('all');
  const [isGeneratingMasterDocx, setIsGeneratingMasterDocx] = useState(false);
  const [isGeneratingBrdDocx, setIsGeneratingBrdDocx] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [activeChapter, setActiveChapter] = useState('cover');

  // Input Mode: 'fill' (Isi via HP / Tabel) vs 'blank' (Format Kosong Siap Print & Tulis Tangan)
  const [formMode, setFormMode] = useState<'fill' | 'blank'>('fill');

  // Client Custom Form Fields - NO DUMMY DATA! Clean fields
  const [restaurantName, setRestaurantName] = useState('');
  const [clientPicName, setClientPicName] = useState('');
  const [clientRole, setClientRole] = useState('Pemilik Restoran / PIC Operasional');
  const [clientPhone, setClientPhone] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [targetGoLiveDate, setTargetGoLiveDate] = useState('');

  // Interactive ROI Calculator State (Clean start: 0 or user typed)
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [foodCostPct, setFoodCostPct] = useState<number>(30);

  // Derived ROI calculations
  const monthlyCogs = (monthlyRevenue * foodCostPct) / 100;
  const wasteSavingsMonthly = monthlyCogs * 0.05; // 5% food waste reduction
  const wasteSavingsYearly = wasteSavingsMonthly * 12;
  const cashierErrorSavingsMonthly = (monthlyRevenue * 0.01); // 1% cashier leakage prevention
  const cashierErrorSavingsYearly = cashierErrorSavingsMonthly * 12;
  const paperMenuSavingsYearly = monthlyRevenue > 0 ? 7200000 : 0;
  const laborOvertimeSavingsYearly = monthlyRevenue > 0 ? 12000000 : 0;
  const totalAnnualSavings = wasteSavingsYearly + cashierErrorSavingsYearly + paperMenuSavingsYearly + laborOvertimeSavingsYearly;
  const systemCapex = 14500000;
  const paybackMonths = totalAnnualSavings > 0 
    ? ((systemCapex / totalAnnualSavings) * 12).toFixed(1)
    : '2,7';

  // Interactive Module Matrix Selector
  const [selectedRestoType, setSelectedRestoType] = useState<'finedining' | 'qsr' | 'cloud' | 'coffee'>('qsr');

  // Interactive Diagnostic Checklist in Fase 1
  const [diagnosticChecks, setDiagnosticChecks] = useState<Record<string, boolean>>({
    diag1: false,
    diag2: false,
    diag3: false,
    diag4: false
  });
  const [diagnosticNotes, setDiagnosticNotes] = useState('');

  // Interactive Hardware Checklist in Fase 1 (Clean blanks)
  const [hardwareInventory, setHardwareInventory] = useState({
    posUnit: '1',
    posStatus: 'Beli Paket',
    posSn: '',
    posIp: '192.168.10.50',
    kdsUnit: '1',
    kdsStatus: 'Beli Paket',
    kdsSn: '',
    kdsIp: '192.168.10.150',
    printerDapurUnit: '1',
    printerDapurStatus: 'Epson TM-T82X LAN',
    printerDapurIp: '192.168.10.201',
    printerKasirUnit: '1',
    printerKasirStatus: 'USB / BT 80mm',
    printerKasirSn: ''
  });

  // Interactive Recipe BOM in Fase 2 (5 Clean Blank Menu Rows)
  const [menus, setMenus] = useState<Array<{ name: string; category: string; b1: string; b2: string; b3: string; hpp: string }>>([
    { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
    { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
    { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
    { name: '', category: 'Minuman', b1: '', b2: '', b3: '', hpp: '' },
    { name: '', category: 'Minuman', b1: '', b2: '', b3: '', hpp: '' }
  ]);

  // Interactive Staff Accounts in Fase 2 (Clean Blank Staff Rows)
  const [staffAccounts, setStaffAccounts] = useState<Array<{ name: string; phone: string; role: string; pin: string }>>([
    { name: '', phone: '', role: 'Pemilik Restoran (Owner)', pin: '' },
    { name: '', phone: '', role: 'Store Manager / Supervisor', pin: '' },
    { name: '', phone: '', role: 'Head Chef / Koki', pin: '' },
    { name: '', phone: '', role: 'Kasir Utama (Cashier)', pin: '' },
    { name: '', phone: '', role: 'Staf Gudang & Inventory', pin: '' }
  ]);

  // Interactive UAT Checklist in Fase 3
  const [uatResults, setUatResults] = useState<Record<string, boolean>>({
    u1: false,
    u2: false,
    u3: false,
    u4: false,
    u5: false,
    u6: false,
    u7: false,
    u8: false,
    u9: false,
    u10: false
  });

  // Interactive Checklist states for SOP in Fase 4
  const [openingChecks, setOpeningChecks] = useState<Record<string, boolean>>({
    op1: false,
    op2: false,
    op3: false,
    op4: false
  });
  const [openingCashModal, setOpeningCashModal] = useState('');

  // Interactive Cash Closing Calculator in Fase 4 (Clean start: 0)
  const [cashDenominations, setCashDenominations] = useState({
    c100k: 0,
    c50k: 0,
    c20k: 0,
    c10k: 0,
    cCoins: 0
  });
  const [posReportCashTotal, setPosReportCashTotal] = useState<number>(0);

  const physicalCashTotal = 
    (cashDenominations.c100k * 100000) +
    (cashDenominations.c50k * 50000) +
    (cashDenominations.c20k * 20000) +
    (cashDenominations.c10k * 10000) +
    cashDenominations.cCoins;

  const cashVariance = physicalCashTotal - posReportCashTotal;

  // Reset all fields to clean blank template (ready for print & handwritten)
  const handleResetToBlank = () => {
    setRestaurantName('');
    setClientPicName('');
    setClientRole('Pemilik Restoran / PIC Operasional F&B');
    setClientPhone('');
    setRestaurantAddress('');
    setTargetGoLiveDate('');
    setMonthlyRevenue(0);
    setDiagnosticChecks({ diag1: false, diag2: false, diag3: false, diag4: false });
    setDiagnosticNotes('');
    setHardwareInventory({
      posUnit: '',
      posStatus: '',
      posSn: '',
      posIp: '',
      kdsUnit: '',
      kdsStatus: '',
      kdsSn: '',
      kdsIp: '',
      printerDapurUnit: '',
      printerDapurStatus: '',
      printerDapurIp: '',
      printerKasirUnit: '',
      printerKasirStatus: '',
      printerKasirSn: ''
    });
    setMenus([
      { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
      { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
      { name: '', category: 'Makanan', b1: '', b2: '', b3: '', hpp: '' },
      { name: '', category: 'Minuman', b1: '', b2: '', b3: '', hpp: '' },
      { name: '', category: 'Minuman', b1: '', b2: '', b3: '', hpp: '' }
    ]);
    setStaffAccounts([
      { name: '', phone: '', role: 'Pemilik Restoran (Owner)', pin: '' },
      { name: '', phone: '', role: 'Store Manager / SPV', pin: '' },
      { name: '', phone: '', role: 'Head Chef / Koki', pin: '' },
      { name: '', phone: '', role: 'Kasir Utama', pin: '' },
      { name: '', phone: '', role: 'Staf Gudang', pin: '' }
    ]);
    setUatResults({ u1: false, u2: false, u3: false, u4: false, u5: false, u6: false, u7: false, u8: false, u9: false, u10: false });
    setOpeningChecks({ op1: false, op2: false, op3: false, op4: false });
    setOpeningCashModal('');
    setCashDenominations({ c100k: 0, c50k: 0, c20k: 0, c10k: 0, cCoins: 0 });
    setPosReportCashTotal(0);
    setFormMode('blank');
  };

  // Download Master 4-Phase Document (.docx) with No Dummy Data
  const handleDownloadMasterDocx = async () => {
    try {
      setIsGeneratingMasterDocx(true);
      const customData: ClientCustomFormData = {
        restaurantName: restaurantName.trim() || undefined,
        clientPicName: clientPicName.trim() || undefined,
        clientRole: clientRole.trim() || undefined,
        clientPhone: clientPhone.trim() || undefined,
        restaurantAddress: restaurantAddress.trim() || undefined,
        monthlyRevenue: monthlyRevenue > 0 ? monthlyRevenue : undefined,
        foodCostPct: monthlyRevenue > 0 ? foodCostPct : undefined,
        restoType: selectedRestoType,
        targetPaybackMonths: monthlyRevenue > 0 ? `${paybackMonths} Bulan` : undefined,
        menus: menus.filter(m => m.name.trim().length > 0),
        staff: staffAccounts.filter(s => s.name.trim().length > 0),
        cash100k: cashDenominations.c100k > 0 ? cashDenominations.c100k : undefined,
        cash50k: cashDenominations.c50k > 0 ? cashDenominations.c50k : undefined,
        cash20k: cashDenominations.c20k > 0 ? cashDenominations.c20k : undefined,
        cash10k: cashDenominations.c10k > 0 ? cashDenominations.c10k : undefined,
        cashCoins: cashDenominations.cCoins > 0 ? cashDenominations.cCoins : undefined,
        cashPosReport: posReportCashTotal > 0 ? posReportCashTotal : undefined
      };

      const blob = await generateMaster4PhasesDocx(customData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanFileName = restaurantName.trim() 
        ? restaurantName.replace(/[^a-zA-Z0-9]/g, '_')
        : 'Format_Kosong_Siap_Isi';
      a.download = `RestoSync_Master_Dokumen_4_Fase_${cleanFileName}_v2.0.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate master docx:', err);
    } finally {
      setIsGeneratingMasterDocx(false);
    }
  };

  // Download Standalone BRD (.docx)
  const handleDownloadBrdDocx = async () => {
    try {
      setIsGeneratingBrdDocx(true);
      const blob = await generateBrdWordDocumentBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'BRD_RestoSync_Sistem_Inventaris_RealTime_Restoran_v1.0.docx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate brd docx:', err);
    } finally {
      setIsGeneratingBrdDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `DOKUMEN INDUK & LEMBAR KERJA SISTEM RESTORAN (RESTOSYNC) - 4 FASE LENGKAP\n` +
      `Status: Siap Diisi via HP / Tabel atau Dicetak Tulis Tangan (Tanpa Data Dummy)\n` +
      `Restoran: ${restaurantName || '[ ____________________ ]'} | PIC: ${clientPicName || '[ ____________________ ]'}\n` +
      `Kode Dokumen: DOC-RESTOSYNC-MASTER-2026-V2 (Workbook Edition)\n\n` +
      `Fase 1: Pre-Sales Pitching, Kuesioner Diagnosa Masalah, Lembar Isian ROI, & Checklist Hardware.\n` +
      `Fase 2: Analisis Kebutuhan (BRD Swimlane Antar-Sistem, Lembar Resep Master BOM, & Form Akun Staf).\n` +
      `Fase 3: Implementasi & Go-Live (Checklist 4 Minggu, Template CSV Resep, & Lembar UAT 10 Kriteria).\n` +
      `Fase 4: SOP Harian & Operasional (Formulir Pembukaan Kasir, Rekonsiliasi Kas Laci, Log Insiden, & Sign-off).`
    );
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownloadCsvTemplate = () => {
    const csvContent = 
      "KODE_MENU,NAMA_MENU,KATEGORI,HARGA_JUAL_RP,PAJAK_PPN_PCT,SERVICE_PCT,KODE_BAHAN_1,NAMA_BAHAN_1,GRAMATUR_1,SATUAN_1,KODE_BAHAN_2,NAMA_BAHAN_2,GRAMATUR_2,SATUAN_2\n" +
      ",,,,,,,,,,,,\n" +
      ",,,,,,,,,,,,\n" +
      ",,,,,,,,,,,,\n" +
      ",,,,,,,,,,,,";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RestoSync_Template_Master_Menu_Resep_Kosong.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const scrollToSection = (id: string) => {
    setActiveChapter(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Header */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 flex-wrap">
              <span className="text-emerald-700 font-bold uppercase tracking-wider">Enterprise Unified Workbook</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-mono">DOC-RESTOSYNC-MASTER-2026-V2</span>
              <span aria-hidden="true">·</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/60">
                1 Bentuk Terpadu: Isi via HP / Tabel atau Print Tulis Tangan
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>Dokumen Induk &amp; Lembar Kerja Sistem Restoran (4 Fase)</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-4xl leading-relaxed">
              Format lembar kerja resmi <strong>tanpa data dummy</strong>. Anda dapat mengisi formulir langsung dari <strong>layar HP / tabel</strong>, atau mengunduh / mencetak fisik dalam bentuk <strong>garis isian dan kotak centang [☐]</strong> untuk ditulis tangan dengan pulpen oleh pemilik dan staf restoran.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0 flex-wrap">
            <button
              onClick={handleDownloadMasterDocx}
              disabled={isGeneratingMasterDocx}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-full transition-all shadow-xs ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-black text-white active:scale-95'
              }`}
              title="Unduh 1 Dokumen Word (.docx) Tanpa Data Dummy (Siap Diisi via Word atau Print Tulis Tangan)"
            >
              {isGeneratingMasterDocx ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengompilasi Word 4 Fase...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>File Word Berhasil Diunduh!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Word (.docx)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all shadow-xs"
              title="Cetak atau Simpan sebagai PDF untuk Ditulis Tangan"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak Fisik</span>
            </button>

            <button
              onClick={handleResetToBlank}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all shadow-xs"
              title="Kosongkan seluruh isian agar menjadi format polos untuk print & tulis tangan"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>Kosongkan Form</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all shadow-xs"
              title="Salin ringkasan dokumen induk"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copiedText ? 'Tersalin' : 'Salin Info'}</span>
            </button>
          </div>
        </div>

        {/* Mode Selector & Quick Field Input (HP / Tablet Friendly) */}
        <div className="mt-4 pt-4 border-t border-black/[0.04]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                <span>Pilih Mode Tampilan:</span>
              </span>
              <div className="inline-flex rounded-full border border-black/[0.06] p-1 bg-slate-100">
                <button
                  onClick={() => setFormMode('fill')}
                  className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
                    formMode === 'fill' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Isi via HP / Tabel
                </button>
                <button
                  onClick={() => setFormMode('blank')}
                  className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
                    formMode === 'blank' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Format Kosong (Print &amp; Tulis Tangan)
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500">
              {formMode === 'fill' 
                ? 'Ketik data restoran Anda di bawah; nilai yang Anda ketik otomatis masuk ke file Word (.docx).'
                : 'Menampilkan format polos bergaris tanpa data dummy, siap dicetak langsung untuk ditulis dengan pena.'}
            </div>
          </div>

          {/* Form Isian Cepat HP / Tablet */}
          {formMode === 'fill' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-black/[0.04] text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Nama Restoran / Brand:</label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Ketik Nama Restoran Anda..."
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Nama Pemilik / PIC:</label>
                <input
                  type="text"
                  value={clientPicName}
                  onChange={(e) => setClientPicName(e.target.value)}
                  className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Nama Lengkap Anda..."
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">No. WhatsApp / Kontak:</label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="0812-xxxx-xxxx"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-1 font-semibold">Alamat Lengkap Outlet:</label>
                <input
                  type="text"
                  value={restaurantAddress}
                  onChange={(e) => setRestaurantAddress(e.target.value)}
                  className="w-full bg-white border border-black/[0.08] rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="Alamat Lokasi Restoran..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Phase Navigation Tabs */}
        <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold shrink-0 mr-1 text-[11px] uppercase tracking-wider">Navigasi Fase:</span>
          
          <button
            onClick={() => setActivePhase('all')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all ${
              activePhase === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua 4 Fase (Dokumen Lengkap)
          </button>

          <button
            onClick={() => setActivePhase('phase1')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all flex items-center gap-1.5 ${
              activePhase === 'phase1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Fase 1: Pre-Sales &amp; Hardware</span>
          </button>

          <button
            onClick={() => setActivePhase('phase2')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all flex items-center gap-1.5 ${
              activePhase === 'phase2'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fase 2: Desain BRD &amp; Resep BOM</span>
          </button>

          <button
            onClick={() => setActivePhase('phase3')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all flex items-center gap-1.5 ${
              activePhase === 'phase3'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Fase 3: Implementasi &amp; UAT</span>
          </button>

          <button
            onClick={() => setActivePhase('phase4')}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-semibold transition-all flex items-center gap-1.5 ${
              activePhase === 'phase4'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fase 4: Formulir SOP &amp; Kasir</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Paper Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Sticky Sidebar */}
        <div className="lg:col-span-1 space-y-4 sticky top-20">
          <div className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3 pb-2 border-b border-black/[0.04]">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Daftar Isi Lembar Kerja</span>
            </div>

            <nav className="space-y-1 text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 pt-1 pb-0.5">Fase 1: Pre-Sales</div>
              <button
                onClick={() => { setActivePhase('phase1'); scrollToSection('sec_diag'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>1.1 Kuesioner Masalah</span>
                <span className="text-[10px] text-blue-400 font-mono">[☐] Centang</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase1'); scrollToSection('sec_matrix'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>1.2 Checklist Modul Resto</span>
                <span className="text-[10px] text-amber-600 font-mono">Pilihan Tipe</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase1'); scrollToSection('sec_roi'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>1.3 Lembar Isian ROI</span>
                <span className="text-[10px] text-emerald-600 font-mono">Target Omzet</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase1'); scrollToSection('sec_hardware'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>1.4 Checklist Hardware &amp; IP</span>
                <span className="text-[10px] text-cyan-700 font-mono">Inventaris</span>
              </button>

              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 pt-2 pb-0.5 border-t border-black/[0.04] mt-2">Fase 2: Analisis &amp; Resep</div>
              <button
                onClick={() => { setActivePhase('phase2'); scrollToSection('sec_swimlane'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>2.1 Swimlane Antar-Sistem</span>
                <span className="text-[10px] text-amber-600 font-mono">4 Jalur</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase2'); scrollToSection('sec_bom'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>2.2 Lembar Resep Master BOM</span>
                <span className="text-[10px] text-blue-600 font-mono">5 Menu Kosong</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase2'); scrollToSection('sec_rollback'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>2.3 Kebijakan Stok Defisit</span>
                <span className="text-[10px] text-rose-600 font-mono">[☐] Centang</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase2'); scrollToSection('sec_rbac'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>2.4 Form Akun Staf &amp; PIN</span>
                <span className="text-[10px] text-slate-500 font-mono">Isian Staf</span>
              </button>

              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 pt-2 pb-0.5 border-t border-black/[0.04] mt-2">Fase 3: Implementasi</div>
              <button
                onClick={() => { setActivePhase('phase3'); scrollToSection('sec_timeline'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>3.1 Roadmap 4 Minggu</span>
                <span className="text-[10px] text-emerald-600 font-mono">Paraf PIC</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase3'); scrollToSection('sec_csv'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>3.2 Template Master CSV</span>
                <span className="text-[10px] text-amber-600 font-mono">Kolom CSV</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase3'); scrollToSection('sec_uat'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>3.3 Lembar UAT 10 Kriteria</span>
                <span className="text-[10px] text-purple-600 font-mono">[Lulus/Revisi]</span>
              </button>

              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 pt-2 pb-0.5 border-t border-black/[0.04] mt-2">Fase 4: SOP Harian</div>
              <button
                onClick={() => { setActivePhase('phase4'); scrollToSection('sec_sop'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>4.1 Lembar Harian Buka Toko</span>
                <span className="text-[10px] text-blue-600 font-mono">Opening [☐]</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase4'); scrollToSection('sec_cash'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>4.2 Form Hitung Kas Laci</span>
                <span className="text-[10px] text-emerald-600 font-mono">Zero Variance</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase4'); scrollToSection('sec_trouble'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>4.3 Log Troubleshooting</span>
                <span className="text-[10px] text-amber-600 font-mono">Tabel Isian</span>
              </button>
              <button
                onClick={() => { setActivePhase('phase4'); scrollToSection('sec_signoff'); }}
                className="w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <span>4.4 Pengesahan &amp; Cap</span>
                <span className="text-[10px] text-rose-600 font-mono">Sign-off</span>
              </button>
            </nav>
          </div>

          {/* Quick Download Card */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-xs text-xs space-y-2.5 border border-black/[0.04]">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Format Bersih Siap Pakai</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Tidak ada data nama atau angka palsu di file yang diunduh. Jika Anda belum mengisi data, kolom akan berupa garis titik-titik dan kotak kosong yang siap dicetak untuk ditulis tangan dengan pena.
            </p>
            <button
              onClick={handleDownloadMasterDocx}
              disabled={isGeneratingMasterDocx}
              className="w-full py-2.5 px-4 text-xs font-bold rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Word (.docx)</span>
            </button>
          </div>
        </div>

        {/* Right Main Document Paper View (Clean Format) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* ======================================================== */}
          {/* COVER & METADATA SECTION                                */}
          {/* ======================================================== */}
          <div id="cover" className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs border border-black/[0.06]">
            <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold text-blue-700 tracking-wider uppercase">RestoSync Standard Form Template</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
                  DOKUMEN INDUK &amp; LEMBAR KERJA SISTEM RESTORAN
                </h2>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  Panduan Lengkap 4 Fase: Pre-Sales Pitching, Desain Solusi (BRD), Implementasi Go-Live, dan SOP Harian (Format Siap Isi &amp; Cetak Tulis Tangan)
                </p>
              </div>
              <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono font-bold text-xs">
                  EDISI LEMBAR KERJA RESMI
                </span>
                <div className="text-[11px] text-slate-500 mt-1">Tanpa Data Dummy</div>
              </div>
            </div>

            {/* Document Metadata Table with Fill-In Lines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">Nama Restoran / Outlet:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {restaurantName ? restaurantName : '[ ___________________________ ]'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Pemilik Restoran / PIC:</span>
                <span className="font-semibold text-slate-900">
                  {clientPicName ? clientPicName : '[ ___________________________ ]'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">No. WhatsApp / Kontak:</span>
                <span className="font-semibold text-slate-900">
                  {clientPhone ? clientPhone : '[ ___________________________ ]'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Status Implementasi:</span>
                <span className="font-bold text-blue-700">[ ☐ ] Siap Dicentang &amp; Diisi</span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* FASE 1: PRE-SALES PITCHING, DIAGNOSA & ROI                */}
          {/* ======================================================== */}
          {(activePhase === 'all' || activePhase === 'phase1') && (
            <div id="sec_diag" className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-blue-200">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow">
                  1
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Fase 1 (Pre-Sales &amp; Pitching)</span>
                  <h3 className="text-xl font-bold text-slate-950">Kuesioner Diagnosa Masalah, Pemilihan Modul &amp; Target Finansial</h3>
                </div>
              </div>

              {/* 1.1 Kuesioner Diagnosa Masalah Restoran */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <span>1.1 Kuesioner Diagnosa Masalah Restoran (Bisa Dicentang &amp; Ditulis Tangan)</span>
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">Siap Diisi</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Beri tanda centang pada kotak [☐] di bawah ini sesuai kendala yang saat ini dihadapi outlet restoran Anda:
                </p>

                <div className="space-y-3 text-xs">
                  {[
                    { id: 'diag1', title: 'Sering terjadi selisih stok bahan baku antara catatan pembukuan dan fisik kulkas di akhir bulan (Varians > 5%)', impact: 'Dampak: Kerugian food waste tersembunyi hingga puluhan juta per bulan dan potensi kebocoran bahan.' },
                    { id: 'diag2', title: 'Antrean kasir panjang di jam sibuk karena kasir lambat mencatat pesanan & sering salah dengar varian menu', impact: 'Dampak: Meja lambat berputar (low table turnover), tamu komplain, dan makanan salah masak terbuang.' },
                    { id: 'diag3', title: 'Tiket pesanan dapur sering hilang, terkena minyak kuah, atau urutan memasak koki tertukar', impact: 'Dampak: Tamu menunggu lebih dari 30 menit, hidangan dingin sebelum diantar, dan ulasan bintang 1 di Google Review.' },
                    { id: 'diag4', title: 'Pemilik restoran baru mengetahui omzet dan HPP aktual 2 minggu setelah bulan berakhir', impact: 'Dampak: Terlambat mengambil keputusan promosi, tidak bisa negosiasi harga supplier, dan margin tergerus.' }
                  ].map((d) => (
                    <div key={d.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={diagnosticChecks[d.id]}
                          onChange={() => setDiagnosticChecks(prev => ({ ...prev, [d.id]: !prev[d.id] }))}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className={`font-bold block ${diagnosticChecks[d.id] ? 'text-blue-900' : 'text-slate-800'}`}>
                            {d.title}
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">{d.impact}</span>
                        </div>
                      </label>
                      <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-600">
                        <span className="font-semibold shrink-0">Catatan Khusus Outlet:</span>
                        <input
                          type="text"
                          value={formMode === 'blank' ? '' : undefined}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 text-[11px] focus:outline-none focus:border-blue-500"
                          placeholder="[ ____________________________________________________________________ ]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 1.2 Module Matrix Selection */}
              <div id="sec_matrix" className="pt-4 border-t border-slate-100">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>1.2 Checklist Pemilihan Modul Sesuai Tipe Restoran</span>
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  Pilih tipe restoran untuk menandai paket modul yang akan diaktifkan:
                </p>

                {/* Resto Type Switcher */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    { id: 'finedining', label: 'Fine Dining', icon: UtensilsCrossed, desc: 'Multi-course & Split Bill' },
                    { id: 'qsr', label: 'QSR / Fast Food', icon: Zap, desc: 'Kecepatan & Antrean Cepat' },
                    { id: 'cloud', label: 'Cloud Kitchen', icon: ShoppingBag, desc: 'Multi-brand Delivery' },
                    { id: 'coffee', label: 'Coffee Shop & Bakery', icon: Coffee, desc: 'Custom Beans & Loyalty' }
                  ].map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedRestoType(t.id as any)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          selectedRestoType === t.id
                            ? 'bg-blue-50 border-blue-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <Icon className={`w-3.5 h-3.5 ${selectedRestoType === t.id ? 'text-blue-600' : 'text-slate-500'}`} />
                          <span>{t.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{t.desc}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block mb-2">Checklist Modul Terpilih: {selectedRestoType.toUpperCase()}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                      <span>Manajemen Kasir POS &amp; Cetak Struk 80mm</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                      <span>Kitchen Display System (KDS) &amp; Timer SLA</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                      <span>Resep BOM Takaran Gramatur Otomatis</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                      <span>Dashboard Eksekutif HPP Real-time</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 1.3 Interactive ROI Simulator (Clean blanks or user typed) */}
              <div id="sec_roi" className="pt-4 border-t border-slate-100">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>1.3 Lembar Isian &amp; Target Finansial ROI Outlet Klien</span>
                </h4>
                <p className="text-xs text-slate-600 mb-4">
                  Ketik omzet bulanan aktual restoran Anda pada kolom di bawah untuk memproyeksikan penghematan:
                </p>

                <div className="p-4 rounded-xl bg-slate-900 text-white mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 block text-xs font-semibold mb-1">
                        Omzet Penjualan Bulanan (Rp):
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={1000000}
                        value={monthlyRevenue > 0 ? monthlyRevenue : ''}
                        onChange={(e) => setMonthlyRevenue(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                        placeholder="Contoh: 150000000 (atau kosongkan untuk print)"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block text-xs font-semibold mb-1">
                        Estimasi Food Cost / COGS (%):
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={60}
                        value={foodCostPct}
                        onChange={(e) => setFoodCostPct(parseInt(e.target.value) || 30)}
                        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                        placeholder="30"
                      />
                    </div>
                  </div>

                  {monthlyRevenue > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-center">
                      <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hemat Food Waste (5%)</span>
                        <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
                          Rp {(wasteSavingsYearly / 1000000).toFixed(1)} Jt / thn
                        </span>
                      </div>
                      <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cegah Selisih Kasir</span>
                        <span className="text-xs sm:text-sm font-bold text-amber-400 font-mono mt-0.5 block">
                          Rp {(cashierErrorSavingsYearly / 1000000).toFixed(1)} Jt / thn
                        </span>
                      </div>
                      <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Benefit Netto</span>
                        <span className="text-xs sm:text-sm font-bold text-cyan-400 font-mono mt-0.5 block">
                          Rp {(totalAnnualSavings / 1000000).toFixed(1)} Jt / thn
                        </span>
                      </div>
                      <div className="bg-emerald-950/80 p-2.5 rounded-lg border border-emerald-500/50">
                        <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">Payback Period</span>
                        <span className="text-xs sm:text-sm font-extrabold text-emerald-300 font-mono mt-0.5 block">
                          {paybackMonths} Bulan
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-slate-400 text-xs italic text-center">
                      (Kolom di Word akan berupa baris kosong [ Rp ____________________ ] siap ditulis tangan)
                    </div>
                  )}
                </div>
              </div>

              {/* 1.4 Checklist Hardware & Alamat IP */}
              <div id="sec_hardware" className="pt-4 border-t border-slate-100">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Monitor className="w-4 h-4 text-blue-600" />
                  <span>1.4 Checklist Inventarisasi Hardware &amp; Alamat IP (Bisa Diisi / Tulis Tangan)</span>
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Tabel inventaris perangkat keras outlet untuk mendata unit, nomor seri, dan alamat IP:
                </p>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="p-2.5 text-left border border-slate-700">Perangkat</th>
                        <th className="p-2.5 text-left border border-slate-700">Unit</th>
                        <th className="p-2.5 text-left border border-slate-700">Status Pengadaan</th>
                        <th className="p-2.5 text-left border border-slate-700">Nomor Seri / Alamat IP</th>
                        <th className="p-2.5 text-center border border-slate-700">Tes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Tablet Kasir Utama (10.1")</td>
                        <td className="p-2.5"><input type="text" placeholder="1 Unit" className="w-16 border rounded px-1.5 py-0.5 text-center" /></td>
                        <td className="p-2.5"><label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> <span>Ada / Beli Baru</span></label></td>
                        <td className="p-2.5"><input type="text" placeholder="S/N: ________________ IP: 192.168.10.50" className="w-full border rounded px-1.5 py-0.5" /></td>
                        <td className="p-2.5 text-center"><input type="checkbox" /></td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Display Dapur (KDS 15.6")</td>
                        <td className="p-2.5"><input type="text" placeholder="1 Unit" className="w-16 border rounded px-1.5 py-0.5 text-center" /></td>
                        <td className="p-2.5"><label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> <span>Ada / Beli Baru</span></label></td>
                        <td className="p-2.5"><input type="text" placeholder="S/N: ________________ IP: 192.168.10.150" className="w-full border rounded px-1.5 py-0.5" /></td>
                        <td className="p-2.5 text-center"><input type="checkbox" /></td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Thermal Printer Dapur LAN 80mm</td>
                        <td className="p-2.5"><input type="text" placeholder="1 Unit" className="w-16 border rounded px-1.5 py-0.5 text-center" /></td>
                        <td className="p-2.5"><label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> <span>Epson / Sunmi</span></label></td>
                        <td className="p-2.5"><input type="text" placeholder="IP Statis: 192.168.10.201" className="w-full border rounded px-1.5 py-0.5 font-mono" /></td>
                        <td className="p-2.5 text-center"><input type="checkbox" /></td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Thermal Printer Kasir 80mm</td>
                        <td className="p-2.5"><input type="text" placeholder="1 Unit" className="w-16 border rounded px-1.5 py-0.5 text-center" /></td>
                        <td className="p-2.5"><label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> <span>USB / BT / LAN</span></label></td>
                        <td className="p-2.5"><input type="text" placeholder="S/N: ________________ Konektor: RJ-11" className="w-full border rounded px-1.5 py-0.5" /></td>
                        <td className="p-2.5 text-center"><input type="checkbox" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* FASE 2: ANALISIS KEBUTUHAN & FORM RESEP BOM               */}
          {/* ======================================================== */}
          {(activePhase === 'all' || activePhase === 'phase2') && (
            <div id="sec_swimlane" className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-amber-200">
                <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base shadow">
                  2
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-600 tracking-wider uppercase">Fase 2 (Kebutuhan &amp; Blueprint)</span>
                  <h3 className="text-xl font-bold text-slate-950">Business Requirements Document (BRD) &amp; Lembar Isian Resep BOM</h3>
                </div>
              </div>

              {/* 2.1 Swimlane Process Map */}
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>2.1 Diagram Swimlane Integrasi Alur Komunikasi Antar-Sistem Restoran</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Diagram 4 jalur ini menggambarkan bagaimana pesanan mengalir antar terminal secara real-time:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-4">
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1">Lane 1: Kasir (POS)</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Input menu tamu, verifikasi kuota bahan, tagih pembayaran, &amp; trigger print struk.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                    <span className="font-bold text-orange-900 block mb-1">Lane 2: Dapur (KDS)</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Terima tiket pesanan sub-150ms, alarm chime audio, timer SLA porsi, &amp; catat waste bahan rusak.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-1">Lane 3: Gudang &amp; Stok</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Pengecekan stok rak dan auto-deduct batch FEFO. Jika bahan habis, sistem memicu penolakan aman.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="font-bold text-blue-900 block mb-1">Lane 4: Dashboard Owner</span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Live omzet outlet, pergerakan Food Cost %, alert stok menipis, &amp; auto-draft PO ke supplier.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2.2 Blank Recipe BOM Form (Clean Blank Rows) */}
              <div id="sec_bom" className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-amber-600" />
                    <span>2.2 Lembar Isian Resep Master BOM (5 Menu Andalan Restoran)</span>
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">Tabel Kosong Siap Diisi</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Tuliskan menu andalan dan takaran gramatur bahan baku resep restoran Anda (tanpa data dummy):
                </p>

                <div className="space-y-3 text-xs">
                  {menus.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Menu {idx + 1}: Nama Menu Jual</label>
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => {
                            const newM = [...menus];
                            newM[idx].name = e.target.value;
                            setMenus(newM);
                          }}
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900"
                          placeholder={`Ketik Menu ${idx + 1} Anda...`}
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 shrink-0">Target HPP: Rp</span>
                          <input
                            type="text"
                            value={m.hpp}
                            onChange={(e) => {
                              const newM = [...menus];
                              newM[idx].hpp = e.target.value;
                              setMenus(newM);
                            }}
                            className="w-full bg-white border border-slate-300 rounded px-2 py-0.5 font-mono text-slate-800 text-[11px]"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="font-bold text-slate-700 block mb-1">Rincian Bahan Baku Mentah &amp; Takaran Gramatur (BOM):</label>
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={m.b1}
                            onChange={(e) => {
                              const newM = [...menus];
                              newM[idx].b1 = e.target.value;
                              setMenus(newM);
                            }}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 text-xs"
                            placeholder="Bahan 1: Nama Bahan Baku (Takaran gr/ml)..."
                          />
                          <input
                            type="text"
                            value={m.b2}
                            onChange={(e) => {
                              const newM = [...menus];
                              newM[idx].b2 = e.target.value;
                              setMenus(newM);
                            }}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 text-xs"
                            placeholder="Bahan 2: Nama Bahan Baku (Takaran gr/ml)..."
                          />
                          <input
                            type="text"
                            value={m.b3}
                            onChange={(e) => {
                              const newM = [...menus];
                              newM[idx].b3 = e.target.value;
                              setMenus(newM);
                            }}
                            className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 text-xs"
                            placeholder="Bahan 3: Nama Bahan Baku (Takaran gr/ml)..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2.3 Exception Handling Checklist */}
              <div id="sec_rollback" className="pt-4 border-t border-slate-100">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>2.3 Checklist Kebijakan Penanganan Kasus Stok Defisit (HTTP 409)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 text-rose-600 rounded" />
                    <div>
                      <span className="font-bold text-rose-900 block">Kebijakan 1: Atomic Rollback Penuh</span>
                      <span className="text-[11px] text-slate-600">Sistem membatalkan transaksi dan saldo kasir tidak berkurang sepihak.</span>
                    </div>
                  </label>
                  <label className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 text-amber-600 rounded" />
                    <div>
                      <span className="font-bold text-amber-900 block">Kebijakan 2: Tawarkan Menu Alternatif</span>
                      <span className="text-[11px] text-slate-600">Layar kasir menampilkan pop-up rekomendasi menu serupa yang masih tersedia.</span>
                    </div>
                  </label>
                  <label className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 text-blue-600 rounded" />
                    <div>
                      <span className="font-bold text-blue-900 block">Kebijakan 3: Otorisasi PIN Manajer</span>
                      <span className="text-[11px] text-slate-600">Supervisor dapat mengizinkan substitusi bahan baku alternatif dengan PIN.</span>
                    </div>
                  </label>
                  <label className="p-3 rounded-lg bg-purple-50 border border-purple-200 flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 text-purple-600 rounded" />
                    <div>
                      <span className="font-bold text-purple-900 block">Kebijakan 4: Auto-Sold Out KDS &amp; QR</span>
                      <span className="text-[11px] text-slate-600">Menu otomatis dikunci menjadi HABIS di seluruh layar agar tidak dipesan ulang.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2.4 User Access Matrix (Clean Blank Rows) */}
              <div id="sec_rbac" className="pt-4 border-t border-slate-100">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>2.4 Formulir Pendaftaran Akun Staf &amp; Hak Akses (User RBAC)</span>
                </h4>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="p-2.5 text-left border border-slate-700">No</th>
                        <th className="p-2.5 text-left border border-slate-700">Nama Lengkap Staf</th>
                        <th className="p-2.5 text-left border border-slate-700">No. WhatsApp / HP</th>
                        <th className="p-2.5 text-left border border-slate-700">Jabatan &amp; Peran Sistem</th>
                        <th className="p-2.5 text-center border border-slate-700">Default PIN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {staffAccounts.map((s, idx) => (
                        <tr key={idx}>
                          <td className="p-2 text-center font-bold">{idx + 1}</td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={s.name}
                              onChange={(e) => {
                                const newS = [...staffAccounts];
                                newS[idx].name = e.target.value;
                                setStaffAccounts(newS);
                              }}
                              className="w-full border border-slate-300 rounded px-2 py-1 text-slate-900"
                              placeholder={`Nama Staf ${idx + 1}...`}
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={s.phone}
                              onChange={(e) => {
                                const newS = [...staffAccounts];
                                newS[idx].phone = e.target.value;
                                setStaffAccounts(newS);
                              }}
                              className="w-full border border-slate-300 rounded px-2 py-1 font-mono text-slate-900 text-[11px]"
                              placeholder="08xxxxxxxxxx"
                            />
                          </td>
                          <td className="p-2 font-semibold text-slate-800">
                            {s.role}
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="text"
                              maxLength={6}
                              value={s.pin}
                              onChange={(e) => {
                                const newS = [...staffAccounts];
                                newS[idx].pin = e.target.value;
                                setStaffAccounts(newS);
                              }}
                              className="w-16 text-center border border-slate-300 rounded px-1.5 py-1 font-mono text-slate-900 text-xs"
                              placeholder="PIN"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* FASE 3: IMPLEMENTASI, ROADMAP & UAT CHECKLIST             */}
          {/* ======================================================== */}
          {(activePhase === 'all' || activePhase === 'phase3') && (
            <div id="sec_timeline" className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-emerald-200">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow">
                  3
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase">Fase 3 (Implementasi &amp; Deployment)</span>
                  <h3 className="text-xl font-bold text-slate-950">Milestone Roadmap, Template CSV &amp; Lembar UAT Klien</h3>
                </div>
              </div>

              {/* 3.1 4-Week Milestone Checklist */}
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>3.1 Checklist Rencana Kerja 4 Minggu (Roadmap Paraf Selesai)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs mb-4">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] uppercase">Minggu 1</span>
                    <h5 className="font-bold text-slate-900 mt-2 mb-1">Kick-off &amp; Resep Master</h5>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                      Audit outlet, pengisian master data menu, formulasi resep gramatur BOM.
                    </p>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-800">
                      <input type="checkbox" className="rounded text-blue-600" />
                      <span>[ ☐ ] Selesai &amp; Paraf</span>
                    </label>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">Minggu 2</span>
                    <h5 className="font-bold text-slate-900 mt-2 mb-1">Hardware &amp; Cabling LAN</h5>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                      Pemasangan kabel CAT6, setting router Wi-Fi 5GHz, IP Statis printer dapur.
                    </p>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                      <input type="checkbox" className="rounded text-amber-600" />
                      <span>[ ☐ ] Selesai &amp; Paraf</span>
                    </label>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px] uppercase">Minggu 3</span>
                    <h5 className="font-bold text-slate-900 mt-2 mb-1">Training Staf &amp; Dry-Run</h5>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                      Pelatihan kasir &amp; koki. Simulasi jam sibuk (*dry-run peak hours*) tanpa tamu.
                    </p>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-800">
                      <input type="checkbox" className="rounded text-purple-600" />
                      <span>[ ☐ ] Selesai &amp; Paraf</span>
                    </label>
                  </div>
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">Minggu 4</span>
                    <h5 className="font-bold text-slate-900 mt-2 mb-1">UAT &amp; Cutover Go-Live</h5>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-2">
                      Pengujian UAT resmi dengan owner, migrasi stok awal gudang, &amp; Go-Live on-site.
                    </p>
                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
                      <input type="checkbox" className="rounded text-emerald-600" />
                      <span>[ ☐ ] Selesai &amp; Paraf</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 3.2 CSV Master Sheet Menu Downloader */}
              <div id="sec_csv" className="pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>3.2 Template Excel / CSV Master Data Menu &amp; Resep Bahan Baku</span>
                  </h4>
                  <button
                    onClick={handleDownloadCsvTemplate}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors self-start sm:self-auto"
                    title="Download template Excel/CSV kosong"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Template CSV Kosong (.csv)</span>
                  </button>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Format file spreadsheet untuk migrasi database menu massal ke sistem RestoSync:
                </p>

                <div className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                  <div className="text-slate-400 mb-1">// Format Kolom Header CSV RestoSync (Kosongkan baris bawahnya):</div>
                  <div className="text-amber-400">KODE_MENU,NAMA_MENU,KATEGORI,HARGA_JUAL_RP,PAJAK_PPN,KODE_BAHAN_1,NAMA_BAHAN_1,GRAMATUR_1</div>
                  <div className="text-slate-400">[ ... Tuliskan daftar menu dan gramatur resep Anda di file spreadsheet ini ... ]</div>
                </div>
              </div>

              {/* 3.3 UAT 10 Criteria Checklist */}
              <div id="sec_uat" className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>3.3 Lembar UAT (User Acceptance Testing) 10 Kriteria Keberterimaan Klien</span>
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">10 Kriteria Pengujian</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Beri centang status uji coba untuk setiap skenario di bawah ini sebelum menandatangani serah terima:
                </p>

                <div className="space-y-2 text-xs">
                  {[
                    { id: 'u1', text: '1. Kasir input pesanan meja makan di tempat (Dine-in)' },
                    { id: 'u2', text: '2. Tiket pesanan tercetak di printer thermal dapur dalam waktu <2 detik' },
                    { id: 'u3', text: '3. Layar KDS dapur koki berbunyi lonceng "Ting-Ting" dan timer mulai menghitung SLA' },
                    { id: 'u4', text: '4. Pemesanan menu dengan stok bahan habis otomatis ditolak via HTTP 409 & saldo kasir aman' },
                    { id: 'u5', text: '5. Penerimaan bahan masuk dari supplier (Goods In) langsung menambah saldo gudang' },
                    { id: 'u6', text: '6. Koki mencatat bahan gosong/tumpah via tombol Log Waste di layar KDS' },
                    { id: 'u7', text: '7. Pembayaran split bill non-tunai (QRIS & Kartu Debit) berhasil tercatat rapi' },
                    { id: 'u8', text: '8. Cetak Z-Report penutupan kasir cocok persis dengan total uang fisik di laci kas' },
                    { id: 'u9', text: '9. Mode Offline: Saat kabel internet dicabut, kasir dan printer dapur tetap berjalan normal' },
                    { id: 'u10', text: '10. Sinkronisasi data otomatis saat internet ISP tersambung kembali ke cloud' }
                  ].map((u) => (
                    <div key={u.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <span className="text-slate-800 font-medium">{u.text}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setUatResults(prev => ({ ...prev, [u.id]: true }))}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                            uatResults[u.id] ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          [ ☑ ] LULUS
                        </button>
                        <button
                          onClick={() => setUatResults(prev => ({ ...prev, [u.id]: false }))}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                            !uatResults[u.id] ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          [ ☐ ] REVISI
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* FASE 4: PANDUAN OPERASIONAL & FORMULIR HARIAN STAF        */}
          {/* ======================================================== */}
          {(activePhase === 'all' || activePhase === 'phase4') && (
            <div id="sec_sop" className="bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-purple-200">
                <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-base shadow">
                  4
                </div>
                <div>
                  <span className="text-xs font-bold text-purple-600 tracking-wider uppercase">Fase 4 (Operasional &amp; Handover)</span>
                  <h3 className="text-xl font-bold text-slate-950">Formulir SOP Pembukaan, Hitung Kas Laci &amp; Sign-off</h3>
                </div>
              </div>

              {/* 4.1 Daily Opening SOP Sheet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>4.1 Lembar Checklist Harian Pembukaan Outlet (Daily Opening Sheet)</span>
                  </h4>
                  <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-mono">09:00 - 10:00</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Wajib diisi oleh kasir pembuka shift dan ditandatangani supervisor sebelum pintu restoran dibuka:
                </p>

                <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 text-xs space-y-3">
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-blue-200">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Tanggal Pelaksanaan:</span>
                      <input
                        type="text"
                        className="w-full bg-white border border-blue-200 rounded px-2 py-1 text-slate-900 font-bold"
                        placeholder="[ ____ / ____ / 2026 ]"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Nama Kasir Pembuka:</span>
                      <input
                        type="text"
                        className="w-full bg-white border border-blue-200 rounded px-2 py-1 text-slate-900 font-bold"
                        placeholder="Nama Kasir Pagi..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    {[
                      { id: 'op1', text: '1. Nyalakan tablet kasir utama & pastikan tersambung ke Wi-Fi 5GHz "RESTO-POS-SECURE"' },
                      { id: 'op2', text: '2. Hitung fisik uang modal kembalian kasir awal di laci & masukkan nominal ke POS' },
                      { id: 'op3', text: '3. Lakukan Test Print printer kasir & printer dapur (cek kecukupan kertas rol thermal 80mm)' },
                      { id: 'op4', text: '4. Koki memeriksa daftar stok kritis di layar KDS & konfirmasi bahan habis sebelum jam buka' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={openingChecks[item.id]}
                          onChange={() => setOpeningChecks(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className={openingChecks[item.id] ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-medium'}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Paraf Kasir:</span>
                      <input type="text" placeholder="[ Paraf ]" className="w-24 text-center border rounded px-1.5 py-0.5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Paraf Supervisor:</span>
                      <input type="text" placeholder="[ Paraf ]" className="w-24 text-center border rounded px-1.5 py-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4.2 Daily Cash Closing & Blind Cash Count Sheet */}
              <div id="sec_cash" className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>4.2 Formulir Rekonsiliasi Kas Laci (Daily Cash Closing &amp; Blind Count)</span>
                  </h4>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono">21:30 - 23:00</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Hitung fisik seluruh lembar uang tunai di laci kasir saat toko tutup. Kolom ini siap diisi via HP atau ditulis tangan:
                </p>

                {/* Interactive Cash Denomination Calculator */}
                <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div className="bg-white p-2.5 rounded border border-emerald-200 text-center">
                      <span className="text-[11px] text-slate-500 block">Rp 100.000</span>
                      <input
                        type="number"
                        min={0}
                        value={cashDenominations.c100k > 0 ? cashDenominations.c100k : ''}
                        onChange={(e) => setCashDenominations(prev => ({ ...prev, c100k: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-full text-center font-bold text-slate-900 border border-slate-300 rounded py-1 mt-1 text-xs"
                        placeholder="0 lbr"
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">
                        = Rp {(cashDenominations.c100k * 100000).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-emerald-200 text-center">
                      <span className="text-[11px] text-slate-500 block">Rp 50.000</span>
                      <input
                        type="number"
                        min={0}
                        value={cashDenominations.c50k > 0 ? cashDenominations.c50k : ''}
                        onChange={(e) => setCashDenominations(prev => ({ ...prev, c50k: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-full text-center font-bold text-slate-900 border border-slate-300 rounded py-1 mt-1 text-xs"
                        placeholder="0 lbr"
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">
                        = Rp {(cashDenominations.c50k * 50000).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-emerald-200 text-center">
                      <span className="text-[11px] text-slate-500 block">Rp 20.000</span>
                      <input
                        type="number"
                        min={0}
                        value={cashDenominations.c20k > 0 ? cashDenominations.c20k : ''}
                        onChange={(e) => setCashDenominations(prev => ({ ...prev, c20k: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-full text-center font-bold text-slate-900 border border-slate-300 rounded py-1 mt-1 text-xs"
                        placeholder="0 lbr"
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">
                        = Rp {(cashDenominations.c20k * 20000).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-emerald-200 text-center">
                      <span className="text-[11px] text-slate-500 block">Rp 10.000</span>
                      <input
                        type="number"
                        min={0}
                        value={cashDenominations.c10k > 0 ? cashDenominations.c10k : ''}
                        onChange={(e) => setCashDenominations(prev => ({ ...prev, c10k: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-full text-center font-bold text-slate-900 border border-slate-300 rounded py-1 mt-1 text-xs"
                        placeholder="0 lbr"
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">
                        = Rp {(cashDenominations.c10k * 10000).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded border border-emerald-200 text-center">
                      <span className="text-[11px] text-slate-500 block">Uang Logam / Koin</span>
                      <input
                        type="number"
                        step={1000}
                        value={cashDenominations.cCoins > 0 ? cashDenominations.cCoins : ''}
                        onChange={(e) => setCashDenominations(prev => ({ ...prev, cCoins: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-full text-center font-bold text-slate-900 border border-slate-300 rounded py-1 mt-1 text-xs"
                        placeholder="Total Koin"
                      />
                      <span className="text-[10px] text-slate-400 block mt-1">
                        = Rp {cashDenominations.cCoins.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Cash Reconciliation Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-200 text-center">
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase block">Total Uang Fisik di Laci (A)</span>
                      <span className="text-sm font-bold text-slate-950 font-mono mt-0.5 block">
                        Rp {physicalCashTotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase block">Z-Report Sistem POS (B)</span>
                      <input
                        type="number"
                        min={0}
                        value={posReportCashTotal > 0 ? posReportCashTotal : ''}
                        onChange={(e) => setPosReportCashTotal(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full text-center font-bold text-blue-700 border border-slate-300 rounded py-1 mt-0.5 text-xs font-mono"
                        placeholder="Masukkan total Z-Report..."
                      />
                    </div>
                    <div className={`p-2.5 rounded border font-bold ${
                      cashVariance === 0 && physicalCashTotal > 0
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      <span className="text-[10px] uppercase block">Selisih Kas (A - B)</span>
                      <span className="text-sm font-mono mt-0.5 block">
                        {physicalCashTotal === 0 && posReportCashTotal === 0
                          ? 'Rp ____________________'
                          : cashVariance === 0 
                            ? 'Rp 0 (ZERO VARIANCE [V])' 
                            : `Rp ${cashVariance.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4.3 Incident Troubleshooting Log */}
              <div id="sec_trouble" className="pt-4 border-t border-slate-100">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-purple-600" />
                  <span>4.3 Lembar Log Troubleshooting &amp; Insiden Operasional Restoran</span>
                </h4>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full border-collapse border border-slate-200">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="p-2.5 text-left border border-slate-700">Tanggal &amp; Waktu</th>
                        <th className="p-2.5 text-left border border-slate-700">Kendala Teknis Lapangan</th>
                        <th className="p-2.5 text-left border border-slate-700">Tindakan Perbaikan Staf</th>
                        <th className="p-2.5 text-center border border-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr>
                        <td className="p-2 font-mono"><input type="text" placeholder="___/___/2026 __:__" className="w-full border rounded px-1.5 py-0.5" /></td>
                        <td className="p-2"><input type="text" placeholder="Kendala teknis yang terjadi..." className="w-full border rounded px-1.5 py-0.5" /></td>
                        <td className="p-2"><input type="text" placeholder="Tindakan yang diambil staf..." className="w-full border rounded px-1.5 py-0.5" /></td>
                        <td className="p-2 text-center"><input type="checkbox" /></td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono"><input type="text" placeholder="___/___/2026 __:__" className="w-full border rounded px-1.5 py-0.5" /></td>
                        <td className="p-2"><input type="text" placeholder="Kendala teknis yang terjadi..." className="w-full border rounded px-1.5 py-0.5" /></td>
                        <td className="p-2"><input type="text" placeholder="Tindakan yang diambil staf..." className="w-full border rounded px-1.5 py-0.5" /></td>
                        <td className="p-2 text-center"><input type="checkbox" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4.4 Formal Sign-off Sheet */}
              <div id="sec_signoff" className="pt-4 border-t border-slate-100">
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>4.4 Lembar Pengesahan &amp; Tanda Tangan Resmi (Sign-off)</span>
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Kedua pihak menyatakan persetujuan penuh atas implementasi 4 fase sistem RestoSync:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-5 rounded-lg bg-slate-50 border-2 border-dashed border-slate-300">
                    <span className="font-bold text-slate-900 block mb-1">PIHAK KLIEN (MANAJEMEN RESTORAN)</span>
                    <span className="text-slate-500 text-[11px] block mb-12">Disetujui dan disahkan oleh:</span>
                    <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-900">
                      Nama: {clientPicName || '_________________________________________'}
                    </div>
                    <span className="text-[11px] text-slate-600 block">Jabatan: {clientRole}</span>
                    <span className="text-[11px] text-slate-600 block">Outlet: {restaurantName || '_________________________________________'}</span>
                    <span className="text-[11px] text-slate-600 block">Tanggal: [ ____ / ____ / 2026 ]</span>
                    <div className="mt-4 pt-2 border-t border-slate-300 text-center text-[10px] text-slate-400 italic">
                      [ CAP / STEMPEL RESMI RESTORAN ]
                    </div>
                  </div>

                  <div className="p-5 rounded-lg bg-slate-50 border-2 border-dashed border-slate-300">
                    <span className="font-bold text-slate-900 block mb-1">PIHAK PENYEDIA (RESTOSYNC PLATFORM)</span>
                    <span className="text-slate-500 text-[11px] block mb-12">Diserahkan resmi oleh:</span>
                    <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-900">
                      Nama: Lead Solution Architect &amp; Head of Delivery
                    </div>
                    <span className="text-[11px] text-slate-600 block">Perusahaan: PT RestoSync Solusi Indonesia</span>
                    <span className="text-[11px] text-slate-600 block">Status: Enterprise Delivery Signed</span>
                    <span className="text-[11px] text-slate-600 block">Tanggal: 14 Oktober 2026</span>
                    <div className="mt-4 pt-2 border-t border-slate-300 text-center text-[10px] text-slate-400 italic">
                      [ CAP / STEMPEL RESMI RESTOSYNC ]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Floating Download CTA Bar */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Satu Format Terpadu: Siap Isi &amp; Cetak</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  File Word (.docx) murni berisi garis isian dan kotak centang tanpa data dummy, siap dicetak atau diedit langsung di HP/komputer.
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadMasterDocx}
              disabled={isGeneratingMasterDocx}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Master Dokumen (.docx)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
