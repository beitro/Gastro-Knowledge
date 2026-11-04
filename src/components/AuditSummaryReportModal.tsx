import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Building,
  User,
  Calendar,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  X
} from 'lucide-react';
import {
  PITCHING_QUESTIONS,
  PILLARS,
  calculateVulnerabilityScore
} from '../data/pitchingQuestionsData';
import { downloadAuditSummaryPdf } from '../utils/auditSummaryPdfGenerator';
import { downloadAuditSummaryDocx } from '../utils/auditSummaryDocxGenerator';

interface AuditSummaryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  picName: string;
  consultantName: string;
  restaurantType: string;
  outletCount: string;
  answers: Record<number, number>;
  notes: Record<number, string>;
}

export const AuditSummaryReportModal: React.FC<AuditSummaryReportModalProps> = ({
  isOpen,
  onClose,
  clientName,
  picName,
  consultantName,
  restaurantType,
  outletCount,
  answers,
  notes
}) => {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const metrics = calculateVulnerabilityScore(answers);
  const auditDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const documentNumber = `GS-AUDIT/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/7842`;

  const answeredQuestions = PITCHING_QUESTIONS.filter(q => answers[q.id]);
  const displayQuestions = answeredQuestions.length > 0 ? answeredQuestions : PITCHING_QUESTIONS.slice(0, 8);

  const handleDownloadPdf = () => {
    try {
      setIsDownloadingPdf(true);
      downloadAuditSummaryPdf({
        clientName,
        picName,
        consultantName,
        restaurantType,
        outletCount,
        auditDate,
        documentNumber,
        answers,
        notes
      });
      setToastMessage('Dokumen Resmi PDF berhasil diunduh!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.error('PDF generation error:', e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsDownloadingDocx(true);
      await downloadAuditSummaryDocx({
        clientName,
        picName,
        consultantName,
        restaurantType,
        outletCount,
        auditDate,
        documentNumber,
        answers,
        notes
      });
      setToastMessage('Dokumen Resmi Word (.DOCX) berhasil diunduh!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.error('DOCX generation error:', e);
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* =================================================================== */}
        {/* TOP MODAL HEADER WITH ACTION BUTTONS */}
        {/* =================================================================== */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Format Resmi Eksekutif
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {documentNumber}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Ringkasan Hasil Audit &amp; Solusi GastroStock OS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
              title="Download Hasil Audit dalam format PDF Resmi Berkop Surat"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingPdf ? 'Menyusun PDF...' : 'Download PDF'}</span>
            </button>

            {/* Download Word DOCX Button */}
            <button
              onClick={handleDownloadDocx}
              disabled={isDownloadingDocx}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
              title="Download Hasil Audit dalam format Word (.DOCX) Resmi"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloadingDocx ? 'Menyusun Word...' : 'Download Word (.docx)'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              title="Cetak Dokumen"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* =================================================================== */}
        {/* DOCUMENT PREVIEW BODY (OFFICIAL CORPORATE REPORT LAYOUT) */}
        {/* =================================================================== */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 font-sans space-y-6">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-slate-200 max-w-4xl mx-auto space-y-8 text-slate-800">
            {/* 1. KOP SURAT RESMI (Official Header) */}
            <div className="border-b-2 border-slate-900 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#0F2942] tracking-tight">
                    GASTROSTOCK TECHNOLOGIES INDONESIA
                  </h1>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">
                    Divisi Arsitektur Solusi &amp; Operasional Restoran Modern · www.gastrostock.id
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    One Pacific Place Level 15, SCBD Jakarta Selatan · Telp: (021) 5088-7890 · Email: enterprise@gastrostock.id
                  </p>
                </div>
                <div className="text-right sm:shrink-0 space-y-1">
                  <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold uppercase tracking-wider">
                    DOKUMEN RESMI HASIL AUDIT
                  </span>
                  <div className="text-xs font-mono font-bold text-slate-700">No: {documentNumber}</div>
                  <div className="text-[11px] text-slate-500">Tanggal: {auditDate}</div>
                </div>
              </div>
            </div>

            {/* 2. DOKUMEN TITLE */}
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F2942] leading-snug">
                RINGKASAN EKSEKUTIF HASIL AUDIT OPERASIONAL &amp; SOLUSI GASTROSTOCK
              </h2>
              <p className="text-xs text-slate-500 italic">
                Laporan Resmi Diagnosa Titik Kebocoran Finansial, Mitigasi Red Flags Lapangan, dan Rekomendasi Solusi Terpadu
              </p>
            </div>

            {/* 3. METADATA KLIEN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>Nama Restoran / Klien:</strong> {clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>PIC / Jabatan:</strong> {picName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>Tipe &amp; Cabang:</strong> {restaurantType} ({outletCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong>Konsultan Solusi:</strong> {consultantName}</span>
              </div>
            </div>

            {/* 4. SUMMARY SCORE BADGES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Progres Pertanyaan</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {metrics.totalAnswered} <span className="text-xs font-normal text-slate-500">/ 50 Pertanyaan</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Evaluasi komprehensif 6 pilar</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Skor Kematangan</div>
                <div className="text-2xl font-black text-amber-600 mt-1">
                  {metrics.averageScore > 0 ? metrics.averageScore : '-'} <span className="text-xs font-normal text-slate-500">/ 4.0 Skala</span>
                </div>
                <div className="text-[11px] font-bold text-amber-800 mt-1">{metrics.vulnerabilityLevel}</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Estimasi Penghematan</span>
                </div>
                <div className="text-lg font-black text-emerald-700 mt-1">
                  {metrics.potentialMonthlySavings.split('(')[0].trim()}
                </div>
                <div className="text-[11px] text-emerald-800/80 mt-1">Eliminasi kebocoran bahan &amp; fraud</div>
              </div>
            </div>

            {/* 5. TABEL RINGKASAN 6 PILAR STRATEGIS */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#0F2942] uppercase tracking-wider flex items-center gap-2">
                <span>1. Evaluasi Kesiapan Per Pilar Operasional</span>
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#0F2942] text-white">
                    <tr>
                      <th className="p-2.5 font-bold">Pilar</th>
                      <th className="p-2.5 font-bold">Dimensi Operasional</th>
                      <th className="p-2.5 font-bold text-center">Terjawab</th>
                      <th className="p-2.5 font-bold text-center">Rata-rata</th>
                      <th className="p-2.5 font-bold">Status &amp; Tingkat Risiko</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {PILLARS.map((p, idx) => {
                      const qInPillar = PITCHING_QUESTIONS.filter(q => q.pillar === p.id);
                      const answeredInP = qInPillar.filter(q => answers[q.id]);
                      const sumP = answeredInP.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
                      const avgP = answeredInP.length > 0 ? (sumP / answeredInP.length).toFixed(1) : '-';
                      
                      let statusBadge = (
                        <span className="text-slate-400 font-medium">Belum Diuji</span>
                      );
                      if (answeredInP.length > 0) {
                        const num = parseFloat(avgP);
                        if (num <= 2.0) {
                          statusBadge = <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">KRITIS (Kebocoran)</span>;
                        } else if (num <= 3.0) {
                          statusBadge = <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">RENTAN (Perlu Solusi)</span>;
                        } else {
                          statusBadge = <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">OPTIMAL (Modern)</span>;
                        }
                      }

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80">
                          <td className="p-2.5 font-bold text-slate-500">Pilar {idx + 1}</td>
                          <td className="p-2.5 font-semibold text-slate-800">{p.name}</td>
                          <td className="p-2.5 text-center font-mono">{answeredInP.length} / {p.totalQuestions}</td>
                          <td className="p-2.5 text-center font-bold font-mono text-slate-900">{avgP}</td>
                          <td className="p-2.5">{statusBadge}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. TABEL TEMUAN & SOLUSI KONKRET YANG KITA PROVIDE (CORE REQUIREMENT) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#0F2942] uppercase tracking-wider flex items-center justify-between">
                <span>2. Rincian Temuan Lapangan &amp; Solusi Konkret GastroStock</span>
                <span className="text-[11px] text-emerald-700 normal-case font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {displayQuestions.length} Aspek Solutif Ditampilkan
                </span>
              </h3>

              <div className="space-y-4">
                {displayQuestions.map(q => {
                  const selectedScore = answers[q.id];
                  const selectedOption = q.options.find(opt => opt.score === selectedScore);
                  const clientNote = notes[q.id];

                  return (
                    <div
                      key={q.id}
                      className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 hover:border-slate-300 transition-colors"
                    >
                      {/* Question Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold text-[11px]">
                            #{q.id} {q.pillarName}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {q.question}
                          </span>
                        </div>
                        {selectedScore && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            selectedScore <= 2
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            Skor Lapangan: {selectedScore}/4
                          </span>
                        )}
                      </div>

                      {/* Client Condition & Red Flags */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <div className="font-bold text-slate-700">Kondisi Lapangan Resto Saat Ini:</div>
                          <p className="text-slate-800 leading-relaxed">
                            {selectedOption ? selectedOption.label : 'Belum diisi oleh staf / opsi default'}
                          </p>
                          {clientNote && (
                            <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-slate-600 italic">
                              Catatan Audit: "{clientNote}"
                            </div>
                          )}
                        </div>

                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1">
                          <div className="font-bold text-rose-800 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Tanda Bahaya &amp; Celah Kebocoran (Red Flags):</span>
                          </div>
                          <ul className="list-disc list-inside text-rose-900 text-[11px] space-y-0.5">
                            {q.redFlags.map((rf, i) => (
                              <li key={i}>{rf}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* SOLUSI YANG KITA PROVIDE (Highlighted in Green) */}
                      <div className="p-3.5 rounded-lg bg-emerald-50/90 border border-emerald-300 text-xs space-y-2">
                        <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>SOLUSI GASTROSTOCK YANG KITA PROVIDE:</span>
                        </div>
                        <p className="text-emerald-950 font-medium leading-relaxed">
                          {q.recommendation}
                        </p>
                        <div className="pt-1 flex items-center justify-between border-t border-emerald-200/80 text-[11px]">
                          <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Dampak Nilai Tambah / ROI:</span>
                          </span>
                          <span className="font-extrabold text-[#0F2942]">
                            {q.roiImpact}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7. ROADMAP IMPLEMENTASI CEPAT (7 - 14 HARI) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#0F2942] uppercase tracking-wider">
                3. Roadmap Implementasi Cepat Tanpa Gangguan Operasional (7-14 Hari)
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#0F2942] text-white">
                    <tr>
                      <th className="p-2.5 font-bold w-28">Fase Waktu</th>
                      <th className="p-2.5 font-bold w-48">Aktivitas Kunci</th>
                      <th className="p-2.5 font-bold">Hasil &amp; Deliverables GastroStock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-bold">Hari 1 - 2</td>
                      <td className="p-2.5 font-semibold text-slate-900">Audit Hardware &amp; LAN</td>
                      <td className="p-2.5">Pemeriksaan printer thermal, tablet Android/iPad, router offline mesh lokal, dan migrasi master menu.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Hari 3 - 4</td>
                      <td className="p-2.5 font-semibold text-slate-900">Setup Resep (BOM) &amp; KDS</td>
                      <td className="p-2.5">Input gramasi bahan baku resep otomatis, mapping stasiun masak grill/fryer/bar, dan setup alergen.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Hari 5 - 6</td>
                      <td className="p-2.5 font-semibold text-slate-900">Training Staf &amp; Role PIN</td>
                      <td className="p-2.5">Pelatihan kasir, tablet waiter, KDS chef dapur, PIN manager, dan simulasi rush-hour tanpa tamu.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Hari 7+</td>
                      <td className="p-2.5 font-semibold text-slate-900">Full Go-Live On-Site</td>
                      <td className="p-2.5">Pendampingan langsung on-site hari pertama, pemantauan live BI di HP owner, jaminan zero-downtime.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 8. LEMBAR PENGESAHAN & TANDA TANGAN */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <h3 className="text-sm font-bold text-[#0F2942] uppercase tracking-wider">
                4. Lembar Pengesahan &amp; Berita Acara Rekomendasi Solusi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-8">
                  <div className="font-bold text-slate-700">
                    Pihak Manajemen Restoran Klien<br />
                    <span className="font-extrabold text-[#0F2942] text-sm">{clientName}</span>
                  </div>
                  <div className="pt-8">
                    <div className="font-bold text-slate-900">( {picName} )</div>
                    <div className="text-[11px] text-slate-500">Pemilik / General Manager Restoran</div>
                    <div className="text-[10px] text-slate-400 mt-1">Tanggal: {auditDate}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-8">
                  <div className="font-bold text-slate-700">
                    Pihak Penyedia Solusi Sistem<br />
                    <span className="font-extrabold text-[#0F2942] text-sm">GASTROSTOCK TECHNOLOGIES</span>
                  </div>
                  <div className="pt-8">
                    <div className="font-bold text-slate-900">( {consultantName} )</div>
                    <div className="text-[11px] text-slate-500">Lead Restaurant Solution Architect</div>
                    <div className="text-[10px] text-slate-400 mt-1">Tanggal: {auditDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* FOOTER ACTION BAR */}
        {/* =================================================================== */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Format resmi ini siap dicetak atau diserahkan langsung ke jajaran Direksi / Owner Restoran.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Resmi</span>
            </button>

            <button
              onClick={handleDownloadDocx}
              disabled={isDownloadingDocx}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Word (.docx)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
