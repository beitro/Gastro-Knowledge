import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Presentation } from 'lucide-react';
import { POSTGRESQL_DDL_SCRIPT } from '../data/databaseSchemaData';

interface TechnicalDocExportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalDocExport: React.FC<TechnicalDocExportProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const technicalDocument = `# RESTOSYNC: DOKUMEN ARSITEKTUR & SPESIFIKASI SISTEM INVENTARIS REAL-TIME RESTORAN

## 1. DESKRIPSI SISTEM
RestoSync adalah sistem manajemen inventaris bahan baku restoran terintegrasi yang menyinkronkan data stok secara otomatis dan real-time lintas 4 antarmuka:
1. Interface Kasir (POS)
2. Interface Dapur (Kitchen Display System / KDS)
3. Interface Stok & Gudang (Warehouse & Procurement)
4. Dashboard Monitoring & Manajemen Eksekutif

Prinsip Utama: Single Source of Truth, Zero Blind Spots, Atomic Deduction, dan Sub-150ms Latency.

---

## 2. FLOWCHART & ALUR PROSES PER MODUL

### A. Modul 1: Interface Kasir (POS)
- Customer memesan menu (Dine-in / Takeaway / Online).
- Sistem memanggil Recipe BOM (Bill of Materials) Engine untuk menghitung kebutuhan bahan mentah:
    Total Kebutuhan = ∑ (BOM_Item_Qty × Order_Quantity)
- Validasi stok fisik di gudang:
    IF current_stock < Total Kebutuhan -> Kembalikan HTTP 409 Conflict (Out of Stock alert di POS)
- Transaksi Pembayaran sukses -> Buka transaksi database ACID:
    - Kunci baris bahan (SELECT FOR UPDATE)
    - Potong stok riil di tabel raw_materials
    - Buat entri mutasi OUT_SALE di stock_transactions
    - Buat kitchen ticket di kitchen_tickets
- Kirim sinyal WebSocket: KITCHEN_TICKET_CREATED & STOCK_UPDATED.
- Rollback Handler: Jika order di-VOID, buat mutasi VOID_ROLLBACK dan kembalikan stok secara atomik.

### B. Modul 2: Interface Dapur (KDS & Waste Management)
- KDS menerima event WebSocket pesanan baru -> status QUEUED dengan alarm audio.
- Koki menekan "Mulai Memasak" -> status berubah menjadi COOKING (SLA timer berjalan).
- Fitur Kitchen Waste / Spoilage:
    - Koki dapat mencatat bahan rusak, gosong, tumpah, atau basi langsung dari tablet dapur.
    - Sistem langsung memotong stok fisik dengan mutasi OUT_WASTE.
    - Mencatat estimasi kerugian finansial ke akun kerugian dapur.
- Koki menekan "Selesai Saji" -> status READY, runner/pramusaji menyajikan pesanan ke meja.

### C. Modul 3: Interface Stok & Gudang (Inventory & Procurement)
- Goods In (Penerimaan Barang PO):
    - QC fisik barang datang dari supplier.
    - Input faktur & registrasi nomor batch + tanggal kedaluwarsa.
    - Mutasi IN_PURCHASE ditambahkan ke database, moving average unit cost diperbarui.
- Konsumsi Batch Berbasis FEFO (First-Expired, First-Out):
    - Bahan dengan expiry date terdekat dialokasikan lebih dahulu untuk mencegah kadaluarsa.
- Stock Opname Harian/Mingguan:
    - Input hasil perhitungan fisik riil di rak.
    - Rekonsiliasi varians otomatis dengan transaksi ADJUSTMENT_OPNAME.

### D. Modul 4: Dashboard Monitoring & Alerting
- Listener event stream WebSocket real-time.
- Pemantauan Reorder Point (ROP = Lead Time Demand + Safety Stock).
    - Jika stok <= ROP: Trigger alert merah & buat draft Purchase Requisition otomatis.
- Kalkulasi Real-time COGS (HPP):
    - Food Cost Ratio = (Total Nilai Bahan Terpakai + Waste Dapur) / Total Omset Penjualan × 100%
- Visualisasi gap varians antara stok teoritis vs stok riil opname.

---

## 3. SPESIFIKASI REST API UTAMA

1. POST /api/v1/orders/checkout
   - Header: Idempotency-Key, Authorization, X-Station-Id
   - Request: { orderNumber, tableNumber, orderType, items: [{ menuItemId, quantity }] }
   - Response 201: { status: "SUCCESS", orderId, stockDeductedSummary: [...] }
   - Response 409: { status: "ERROR", errorCode: "INSUFFICIENT_STOCK", insufficientMaterials: [...] }

2. POST /api/v1/orders/{orderId}/void
   - Membatalkan order dan mengembalikan stok secara atomik (VOID_ROLLBACK).

3. POST /api/v1/kitchen/waste
   - Request: { materialSku, quantity, reason, notes, loggedBy }
   - Memotong stok fisik dan membukukan kerugian operasional dapur.

4. POST /api/v1/inventory/goods-in
   - Request: { poNumber, supplierId, items: [{ materialSku, batchNo, qtyReceived, expiryDate, unitCost }] }
   - Mendaftarkan batch FIFO/FEFO dan menambah current_stock.

5. POST /api/v1/inventory/stock-opname
   - Menyelaraskan selisih hitung fisik dengan buku besar stok.

6. WS /ws/inventory-stream
   - Event: STOCK_UPDATED, KITCHEN_TICKET_CREATED, ALERT_SAFETY_STOCK_BREACH, ORDER_READY.

---

## 4. SKEMA BASIS DATA POSTGRESQL (ACID DDL)
\`\`\`sql
${POSTGRESQL_DDL_SCRIPT}
\`\`\`
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(technicalDocument);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([technicalDocument], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RestoSync-Technical-Architecture.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white border border-black/[0.08] rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-[0_24px_48px_rgba(0,0,0,0.14)]">
        <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Export Dokumen Teknis Arsitektur (Markdown / PDF / Word Ready)
              </h2>
              <p className="text-xs text-slate-500">Spesifikasi sistem, DDL basis data, dan dokumen induk 4 fase</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50/80 p-4 rounded-2xl border border-black/[0.04]">
          <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
            {technicalDocument}
          </pre>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-black/[0.04]">
          <span className="text-xs text-slate-500">
            Format: Standard Markdown (.md) &amp; Microsoft Word (.docx)
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Semua'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
            <button
              onClick={async () => {
                const { downloadPitchDeckPptx } = await import('../utils/pptxGenerator');
                await downloadPitchDeckPptx();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-full transition-all shadow-xs active:scale-95"
              title="Unduh Slide Presentasi PowerPoint Klien (.pptx)"
            >
              <Presentation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download Pitch Deck (.pptx)</span>
            </button>
            <button
              onClick={async () => {
                const { generateMaster4PhasesDocx } = await import('../utils/masterDocxGenerator');
                const blob = await generateMaster4PhasesDocx();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'RestoSync_Master_Dokumen_4_Fase_Restoran_v2.0.docx';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-full transition-all shadow-xs active:scale-95"
              title="Unduh 1 Dokumen Word Master Lengkap 4 Fase"
            >
              <FileText className="w-3.5 h-3.5 text-slate-950" />
              <span>Download Master 4 Fase (.docx)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
