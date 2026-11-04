import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Search,
  SlidersHorizontal,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  ChefHat,
  CreditCard,
  Package,
  Layers,
  Sparkles,
  RotateCcw,
  Check,
  Share2,
  Building,
  User,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet
} from 'lucide-react';
import {
  PITCHING_QUESTIONS,
  PILLARS,
  PitchingQuestion,
  calculateVulnerabilityScore
} from '../data/pitchingQuestionsData';
import { downloadPitchingQuestionsDocx } from '../utils/pitchingQuestionsDocxGenerator';
import { downloadAuditSummaryPdf } from '../utils/auditSummaryPdfGenerator';
import { downloadAuditSummaryDocx } from '../utils/auditSummaryDocxGenerator';
import { AuditSummaryReportModal } from './AuditSummaryReportModal';

export const PitchingQuestionsViewer: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(1);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [isDownloadingSummaryDocx, setIsDownloadingSummaryDocx] = useState<boolean>(false);

  // Client Details
  const [clientName, setClientName] = useState<string>('Resto Nusantara & Hospitality Group');
  const [picName, setPicName] = useState<string>('Bpk. Hendra Gunawan (Owner / Managing Director)');
  const [consultantName, setConsultantName] = useState<string>('GastroStock Enterprise Solution Team');
  const [restaurantType, setRestaurantType] = useState<string>('Casual Dining & Family Restaurant');
  const [outletCount, setOutletCount] = useState<string>('3 Cabang Aktif + 2 Rencana Ekspansi');
  const [showClientModal, setShowClientModal] = useState<boolean>(false);

  // Answers: Record<questionId, score (1-4)>
  const [answers, setAnswers] = useState<Record<number, number>>({
    1: 2,
    2: 1,
    9: 1,
    17: 1,
    18: 2,
    27: 1,
    28: 1,
    35: 2
  });

  // Notes: Record<questionId, string>
  const [notes, setNotes] = useState<Record<number, string>>({
    1: 'Kasir mengeluh sering antre panjang di kasir 1 saat jam 12.00 - 13.30.',
    2: 'Wi-Fi IndiHome sering putus saat hujan, kasir terpaksa catat manual di kertas bon.',
    9: 'Kertas bon dapur sering tercecer minyak dan juru masak sering salah urutan antrean.'
  });

  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return PITCHING_QUESTIONS.filter(q => {
      const matchPillar = selectedPillar === 'all' || q.pillar === selectedPillar;
      const matchSearch =
        searchQuery === '' ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.recommendation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.objective.toLowerCase().includes(searchQuery.toLowerCase());
      return matchPillar && matchSearch;
    });
  }, [selectedPillar, searchQuery]);

  // Scoring Metrics
  const scoreMetrics = useMemo(() => {
    return calculateVulnerabilityScore(answers);
  }, [answers]);

  // Handlers
  const handleSelectOption = (questionId: number, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const handleNoteChange = (questionId: number, text: string) => {
    setNotes(prev => ({
      ...prev,
      [questionId]: text
    }));
  };

  // Download Full 50-Question Questionnaire DOCX
  const handleDownloadDocx = async () => {
    try {
      setIsDownloading(true);
      await downloadPitchingQuestionsDocx({
        clientName,
        picName,
        consultantName,
        restaurantType,
        outletCount,
        answers,
        notes
      });
      setDownloadSuccess('50 PERTANYAAN AUDIT RESTORAN (.DOCX)');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (e) {
      console.error('Error downloading docx:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  // Download Official Executive Summary Report PDF
  const handleDownloadSummaryPdf = () => {
    try {
      setIsDownloadingPdf(true);
      downloadAuditSummaryPdf({
        clientName,
        picName,
        consultantName,
        restaurantType,
        outletCount,
        answers,
        notes
      });
      setDownloadSuccess('SUMMARY HASIL AUDIT & SOLUSI (PDF RESMI)');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (e) {
      console.error('Error downloading summary pdf:', e);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Download Official Executive Summary Report Word DOCX
  const handleDownloadSummaryDocx = async () => {
    try {
      setIsDownloadingSummaryDocx(true);
      await downloadAuditSummaryDocx({
        clientName,
        picName,
        consultantName,
        restaurantType,
        outletCount,
        answers,
        notes
      });
      setDownloadSuccess('SUMMARY HASIL AUDIT & SOLUSI (.DOCX RESMI)');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (e) {
      console.error('Error downloading summary docx:', e);
    } finally {
      setIsDownloadingSummaryDocx(false);
    }
  };

  const handleExportJson = () => {
    const payload = {
      metadata: {
        exportedAt: new Date().toISOString(),
        clientName,
        picName,
        consultantName,
        restaurantType,
        outletCount
      },
      summary: scoreMetrics,
      answers,
      notes,
      questions: PITCHING_QUESTIONS.map(q => ({
        id: q.id,
        pillar: q.pillar,
        question: q.question,
        selectedScore: answers[q.id] || null,
        notes: notes[q.id] || '',
        recommendation: q.recommendation
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GastroStock_Audit_Assessment_${clientName.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadPreset = (presetType: 'vulnerable' | 'optimized' | 'clear') => {
    if (presetType === 'clear') {
      setAnswers({});
      setNotes({});
      return;
    }

    if (presetType === 'vulnerable') {
      const demoAnswers: Record<number, number> = {};
      PITCHING_QUESTIONS.forEach(q => {
        demoAnswers[q.id] = (q.id % 2 === 0) ? 1 : 2;
      });
      setAnswers(demoAnswers);
    } else {
      const demoAnswers: Record<number, number> = {};
      PITCHING_QUESTIONS.forEach(q => {
        demoAnswers[q.id] = (q.id % 3 === 0) ? 3 : 4;
      });
      setAnswers(demoAnswers);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ===================================================================== */}
      {/* TOP HERO & AUDIT DASHBOARD HEADER */}
      {/* ===================================================================== */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-950 text-white p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>GastroStock Pre-Sales & Diagnostic Consultancy Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              50 Pertanyaan Audit & Pitching Restoran
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Panduan interaktif 50 pertanyaan diagnostik menyeluruh untuk membedah titik kebocoran operasional, 
              mencegah fraud, menekan food waste, dan menyajikan rekomendasi solutif langsung di hadapan Owner Restoran.
            </p>

            {/* Client Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                <strong className="text-slate-200">Klien:</strong> {clientName}
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <strong className="text-slate-200">PIC:</strong> {picName}
              </span>
              <button
                onClick={() => setShowClientModal(true)}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Ubah Profil Klien
              </button>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* PRIMARY BUTTON 1: DOWNLOAD OFFICIAL SUMMARY PDF */}
            <button
              onClick={handleDownloadSummaryPdf}
              disabled={isDownloadingPdf}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 active:scale-95 disabled:opacity-50"
              title="Download Ringkasan Eksekutif Hasil Audit dalam format PDF Resmi Berkop Surat"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingPdf ? 'Menyusun PDF...' : 'Download Summary Resmi (PDF)'}</span>
            </button>

            {/* PRIMARY BUTTON 2: DOWNLOAD OFFICIAL SUMMARY DOCX */}
            <button
              onClick={handleDownloadSummaryDocx}
              disabled={isDownloadingSummaryDocx}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 active:scale-95 disabled:opacity-50"
              title="Download Ringkasan Eksekutif Hasil Audit dalam format Word (.docx) Resmi Berkop Surat"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingSummaryDocx ? 'Menyusun Word...' : 'Download Summary Resmi (.docx)'}</span>
            </button>

            {/* PREVIEW SUMMARY MODAL BUTTON */}
            <button
              onClick={() => setShowSummaryModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
              title="Lihat Tampilan Dokumen Eksekutif Resmi Hasil Diagnosa & Solusi"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Preview Dokumen Solusi</span>
            </button>

            {/* SECONDARY: FULL 50-QUESTION QUESTIONNAIRE DOCX */}
            <button
              onClick={handleDownloadDocx}
              disabled={isDownloading}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
              title="Download Blanko / Lembar Soal Lengkap 50 Pertanyaan (.docx)"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Kuesioner 50 Tanya (.docx)</span>
            </button>

            <button
              onClick={handleExportJson}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center shadow-sm"
              title="Export Hasil Asesmen dalam format JSON"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Download Toast Notification */}
        {downloadSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Berhasil mengunduh dokumen: {downloadSuccess}! Siap dibuka di Microsoft Word atau Google Docs.</span>
          </div>
        )}

        {/* Score & Vulnerability Summary Cards */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Progres Pengisian</div>
            <div className="text-xl font-extrabold text-white mt-1">
              {scoreMetrics.totalAnswered} <span className="text-xs text-slate-400 font-normal">/ 50 Pertanyaan</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(scoreMetrics.totalAnswered / 50) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Skor Operasional</div>
            <div className="text-xl font-extrabold text-amber-400 mt-1 flex items-baseline gap-1">
              {scoreMetrics.averageScore > 0 ? scoreMetrics.averageScore : '-'}
              <span className="text-xs text-slate-400 font-normal">/ 4.0 Skala</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {scoreMetrics.vulnerabilityLevel}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 col-span-2">
            <div className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Estimasi Penghematan & Peningkatan Laba</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-emerald-300 mt-1">
              {scoreMetrics.potentialMonthlySavings}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Fokus Utama: <span className="text-slate-200 font-medium">{scoreMetrics.urgentPillars.slice(0, 2).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* EXECUTIVE SUMMARY REPORT DOWNLOAD CALLOUT (OFFICIAL PDF & WORD) */}
      {/* ===================================================================== */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 p-5 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
              Dokumen Resmi Siap Diserahkan ke Owner
            </span>
            <span className="text-xs text-slate-400 font-mono">No: GS-AUDIT/202610/7842</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Summary Hasil Audit &amp; Solusi Kongkrit GastroStock
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Menghasilkan dokumen resmi berkop surat dengan rincian temuan lapangan, mitigasi celah kebocoran/red flags, 
            <strong className="text-emerald-300 font-bold"> solusi terpadu yang kita sediakan</strong>, estimasi penghematan finansial, roadmap 7-hari, dan lembar berita acara tanda tangan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadSummaryPdf}
            disabled={isDownloadingPdf}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
            title="Download Ringkasan Eksekutif Hasil Audit dalam format PDF Resmi Berkop Surat"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingPdf ? 'Menyusun PDF...' : 'Download PDF Resmi'}</span>
          </button>

          <button
            onClick={handleDownloadSummaryDocx}
            disabled={isDownloadingSummaryDocx}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
            title="Download Ringkasan Eksekutif Hasil Audit dalam format Word (.docx) Resmi Berkop Surat"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingSummaryDocx ? 'Menyusun Word...' : 'Download Word (.docx)'}</span>
          </button>

          <button
            onClick={() => setShowSummaryModal(true)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all flex items-center gap-1.5"
            title="Buka Pratinjau Dokumen Eksekutif"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* FILTER CONTROLS & DEMO PRESETS */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        {/* Search Bar & Preset Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pertanyaan, kata kunci (misal: void, QRIS, KDS, stok, resep)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Contoh Profil Klien:</span>
            <button
              onClick={() => handleLoadPreset('vulnerable')}
              className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-medium transition-colors"
            >
              Resto Rawan Kebocoran
            </button>
            <button
              onClick={() => handleLoadPreset('optimized')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-medium transition-colors"
            >
              Resto Sudah Modern
            </button>
            <button
              onClick={() => handleLoadPreset('clear')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 6 Strategic Pillar Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedPillar('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedPillar === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua (50 Pertanyaan)
          </button>
          {PILLARS.map(p => {
            const countInPillar = PITCHING_QUESTIONS.filter(q => q.pillar === p.id && answers[q.id]).length;
            const isSelected = selectedPillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{p.badge}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {countInPillar}/{p.totalQuestions}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 50 QUESTIONS CARD LIST */}
      {/* ===================================================================== */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">Tidak ada pertanyaan yang cocok</h3>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ganti filter pilar di atas.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            const currentAnswer = answers[q.id];
            const currentNote = notes[q.id] || '';

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  isExpanded
                    ? 'border-blue-400 ring-2 ring-blue-100'
                    : currentAnswer
                    ? 'border-emerald-200 bg-white'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* Header Question Item */}
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    {/* Number Badge */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5 ${
                      currentAnswer === 1
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : currentAnswer === 2
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : currentAnswer >= 3
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      #{q.id}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {q.pillarName}
                        </span>
                        {currentAnswer && (
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                            currentAnswer === 1
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : currentAnswer === 2
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          }`}>
                            Status: Skor {currentAnswer}/4
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {q.question}
                      </h3>
                      <p className="text-xs text-slate-500">
                        <strong className="text-slate-700">Tujuan:</strong> {q.objective}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Diagnostic Body */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/50">
                    {/* Answer Options Radio Grid */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Pilih Kondisi Lapangan Restoran Klien:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isSelected = currentAnswer === opt.score;
                          return (
                            <button
                              key={opt.score}
                              type="button"
                              onClick={() => handleSelectOption(q.id, opt.score)}
                              className={`p-3 rounded-xl text-left border text-xs transition-all flex items-start gap-2.5 ${
                                isSelected
                                  ? opt.score === 1
                                    ? 'bg-rose-50/90 border-rose-300 ring-1 ring-rose-300 text-rose-950 font-semibold'
                                    : opt.score === 2
                                    ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300 text-amber-950 font-semibold'
                                    : 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-300 text-emerald-950 font-semibold'
                                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                                isSelected
                                  ? opt.score === 1
                                    ? 'border-rose-600 bg-rose-600 text-white'
                                    : opt.score === 2
                                    ? 'border-amber-600 bg-amber-600 text-white'
                                    : 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div className="space-y-0.5 flex-1">
                                <div className="text-xs leading-snug">{opt.label}</div>
                                <div className="text-[11px] text-slate-500 font-normal">
                                  {opt.hint}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Red Flags & GastroStock Solution Side-by-Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                      {/* Red Flags Warning Box */}
                      <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs space-y-1.5">
                        <div className="font-bold text-rose-800 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Tanda Bahaya & Celah Kebocoran (Red Flags)</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-rose-900/90 pl-1 leading-relaxed">
                          {q.redFlags.map((rf, i) => (
                            <li key={i}>{rf}</li>
                          ))}
                        </ul>
                      </div>

                      {/* GastroStock Recommendation Box */}
                      <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs space-y-1.5">
                        <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Rekomendasi Solutif GastroStock</span>
                        </div>
                        <p className="text-emerald-950 leading-relaxed font-medium">
                          {q.recommendation}
                        </p>
                        <div className="pt-1 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>ROI: {q.roiImpact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Field Audit Notes Input */}
                    <div className="pt-1">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                        Catatan Spesifik / Temuan Lapangan di Resto Klien:
                      </label>
                      <input
                        type="text"
                        value={currentNote}
                        onChange={(e) => handleNoteChange(q.id, e.target.value)}
                        placeholder="Contoh: Owner mengaku tiap malam selisih kas fisik sekitar Rp 30.000, printer dapur sering paper-jam..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ===================================================================== */}
      {/* MODAL: UBAH PROFIL KLIEN / RESTORAN */}
      {/* ===================================================================== */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Ubah Profil Restoran Klien</h3>
              <button
                onClick={() => setShowClientModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Restoran / Brand:</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama PIC / Jabatan:</label>
                <input
                  type="text"
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipe Bisnis Restoran:</label>
                <input
                  type="text"
                  value={restaurantType}
                  onChange={(e) => setRestaurantType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jumlah Outlet Saat Ini:</label>
                <input
                  type="text"
                  value={outletCount}
                  onChange={(e) => setOutletCount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowClientModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
              >
                Simpan Profil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Summary Dokumen Resmi Hasil Audit & Solusi */}
      <AuditSummaryReportModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        clientName={clientName}
        picName={picName}
        consultantName={consultantName}
        restaurantType={restaurantType}
        outletCount={outletCount}
        answers={answers}
        notes={notes}
      />
    </div>
  );
};
