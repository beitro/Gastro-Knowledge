// Official PDF Generator for GastroStock Audit Summary & Solution Recommendation Report
// Generates formal executive report with corporate letterhead, diagnostic scores, findings, tailored solutions, and formal sign-off.

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PITCHING_QUESTIONS, PILLARS, PitchingQuestion, calculateVulnerabilityScore } from '../data/pitchingQuestionsData';

export interface AuditSummaryReportOptions {
  clientName?: string;
  picName?: string;
  consultantName?: string;
  restaurantType?: string;
  outletCount?: string;
  auditDate?: string;
  documentNumber?: string;
  answers: Record<number, number>;
  notes: Record<number, string>;
}

export function generateAuditSummaryPdf(options: AuditSummaryReportOptions): jsPDF {
  const {
    clientName = 'Restoran Mitra & Hospitality Group',
    picName = 'Pemilik / General Manager Restoran',
    consultantName = 'GastroStock Enterprise Solution Team',
    restaurantType = 'Casual Dining & Family Restaurant',
    outletCount = '3 Cabang Aktif',
    auditDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    documentNumber = `GS-AUDIT/${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`,
    answers = {},
    notes = {}
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const metrics = calculateVulnerabilityScore(answers);

  // Corporate Colors (Explicit [number, number, number] tuples for jsPDF and autoTable)
  const COLOR_NAVY: [number, number, number] = [15, 41, 66];      // #0F2942
  const COLOR_BLUE: [number, number, number] = [2, 132, 199];     // #0284C7
  const COLOR_DARK: [number, number, number] = [30, 41, 59];      // #1E293B
  const COLOR_MUTED: [number, number, number] = [100, 116, 139];  // #64748B
  const COLOR_LIGHT: [number, number, number] = [248, 250, 252];  // #F8FAFC
  const COLOR_RED: [number, number, number] = [220, 38, 38];      // #DC2626
  const COLOR_GREEN: [number, number, number] = [5, 150, 105];    // #059669
  const COLOR_AMBER: [number, number, number] = [217, 119, 6];    // #D97706

  // ---------------------------------------------------------------------------
  // HEADER KOP SURAT RESMI (Official Corporate Letterhead)
  // ---------------------------------------------------------------------------
  // Header accent bar
  doc.setFillColor(15, 41, 66);
  doc.rect(0, 0, pageWidth, 8, 'F');
  doc.setFillColor(2, 132, 199);
  doc.rect(0, 8, pageWidth, 1.5, 'F');

  let currentY = 16;

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 41, 66);
  doc.text('GASTROSTOCK TECHNOLOGIES INDONESIA', margin, currentY);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Divisi Arsitektur Solusi & Operasional Restoran Modern · www.gastrostock.id', margin, currentY + 4.5);
  doc.text('One Pacific Place Level 15, SCBD Jakarta Selatan · Telp: (021) 5088-7890', margin, currentY + 8.5);

  // Document Badge on Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(2, 132, 199);
  doc.text('DOKUMEN RESMI HASIL AUDIT', pageWidth - margin, currentY, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`No: ${documentNumber}`, pageWidth - margin, currentY + 4.5, { align: 'right' });
  doc.text(`Tanggal: ${auditDate}`, pageWidth - margin, currentY + 8.5, { align: 'right' });

  // Divider line
  currentY += 12;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 41, 66);
  doc.text('RINGKASAN EKSEKUTIF HASIL AUDIT OPERASIONAL & SOLUSI GASTROSTOCK', margin, currentY);
  
  currentY += 4.5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(2, 132, 199);
  doc.text('Laporan Diagnosa Titik Kebocoran Finansial, Red Flags Lapangan, dan Rekomendasi Solusi Terpadu', margin, currentY);

  currentY += 5;

  // ---------------------------------------------------------------------------
  // METADATA KLIEN TABLE
  // ---------------------------------------------------------------------------
  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, textColor: COLOR_DARK },
    headStyles: { fillColor: COLOR_NAVY, textColor: [255, 255, 255], fontStyle: 'bold' },
    body: [
      [
        { content: 'Nama Restoran / Klien:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 45 } },
        { content: clientName, styles: { fontStyle: 'bold', textColor: COLOR_NAVY } },
        { content: 'PIC / Jabatan:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 35 } },
        { content: picName }
      ],
      [
        { content: 'Tipe & Jumlah Cabang:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
        { content: `${restaurantType} (${outletCount})` },
        { content: 'Konsultan Solusi:', styles: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
        { content: consultantName }
      ]
    ]
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 6;

  // ---------------------------------------------------------------------------
  // HIGHLIGHT METRICS BOX (SKOR KELAIKAN & ESTIMASI PENGHEMATAN)
  // ---------------------------------------------------------------------------
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 22, 2, 2, 'FD');

  // Metric 1: Pertanyaan Terjawab
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PROGRES AUDIT', margin + 4, currentY + 5);
  doc.setFontSize(11);
  doc.setTextColor(15, 41, 66);
  doc.text(`${metrics.totalAnswered} / 50 Pertanyaan`, margin + 4, currentY + 11);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Evaluasi menyeluruh 6 pilar', margin + 4, currentY + 16);

  // Metric 2: Skor Kematangan
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('SKOR KEMATANGAN', margin + 55, currentY + 5);
  doc.setFontSize(11);
  doc.setTextColor(metrics.averageScore <= 2.2 ? COLOR_RED[0] : COLOR_AMBER[0], metrics.averageScore <= 2.2 ? COLOR_RED[1] : COLOR_AMBER[1], metrics.averageScore <= 2.2 ? COLOR_RED[2] : COLOR_AMBER[2]);
  doc.text(`${metrics.averageScore > 0 ? metrics.averageScore : '-'} / 4.0 Skala`, margin + 55, currentY + 11);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(metrics.vulnerabilityLevel, margin + 55, currentY + 16);

  // Metric 3: Estimasi Penghematan
  doc.setFontSize(7.5);
  doc.setTextColor(5, 150, 105);
  doc.text('POTENSI PENGHEMATAN & KENAIKAN LABA', margin + 115, currentY + 5);
  doc.setFontSize(10.5);
  doc.setTextColor(5, 150, 105);
  doc.text(metrics.potentialMonthlySavings.split('(')[0].trim(), margin + 115, currentY + 11);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Eliminasi kebocoran bahan, fraud & downtime', margin + 115, currentY + 16);

  currentY += 28;

  // ---------------------------------------------------------------------------
  // TABEL STATUS 6 PILAR STRATEGIS
  // ---------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 41, 66);
  doc.text('1. Ringkasan Diagnosa Per Pilar Operasional', margin, currentY);

  currentY += 3;

  const pillarRows = PILLARS.map((p, idx) => {
    const questionsInPillar = PITCHING_QUESTIONS.filter(q => q.pillar === p.id);
    const answeredInPillar = questionsInPillar.filter(q => answers[q.id]);
    const scoreSum = answeredInPillar.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
    const avg = answeredInPillar.length > 0 ? (scoreSum / answeredInPillar.length).toFixed(1) : '-';
    
    let status = 'Belum Diuji';
    let statusColor = COLOR_MUTED;
    if (answeredInPillar.length > 0) {
      const numAvg = parseFloat(avg);
      if (numAvg <= 2.0) {
        status = 'KRITIS (Kebocoran Tinggi)';
        statusColor = COLOR_RED;
      } else if (numAvg <= 3.0) {
        status = 'RENTAN (Perlu Solusi)';
        statusColor = COLOR_AMBER;
      } else {
        status = 'OPTIMAL (Modern)';
        statusColor = COLOR_GREEN;
      }
    }

    return [
      `Pilar ${idx + 1}`,
      p.name,
      `${answeredInPillar.length} / ${p.totalQuestions}`,
      avg,
      status
    ];
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2, textColor: COLOR_DARK },
    headStyles: { fillColor: COLOR_NAVY, textColor: [255, 255, 255], fontStyle: 'bold' },
    head: [['Pilar', 'Nama Dimensi Operasional', 'Terjawab', 'Rata-rata', 'Status & Tingkat Risiko']],
    body: pillarRows,
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 4) {
        const text = String(data.cell.raw);
        if (text.includes('KRITIS')) {
          data.cell.styles.textColor = COLOR_RED;
          data.cell.styles.fontStyle = 'bold';
        } else if (text.includes('RENTAN')) {
          data.cell.styles.textColor = COLOR_AMBER;
          data.cell.styles.fontStyle = 'bold';
        } else if (text.includes('OPTIMAL')) {
          data.cell.styles.textColor = COLOR_GREEN;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // ---------------------------------------------------------------------------
  // TABEL DETAIL TEMUAN LAPANGAN & SOLUSI KONKRET YANG KITA PROVIDE
  // ---------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 41, 66);
  doc.text('2. Rincian Temuan Lapangan & Solusi Konkret yang Diberikan GastroStock', margin, currentY);

  currentY += 3;

  // Filter answered questions or show prioritized questions
  const answeredQuestions = PITCHING_QUESTIONS.filter(q => answers[q.id]);
  const displayQuestions = answeredQuestions.length > 0 ? answeredQuestions : PITCHING_QUESTIONS.slice(0, 8);

  const solutionRows = displayQuestions.map(q => {
    const selectedScore = answers[q.id];
    const selectedOption = q.options.find(opt => opt.score === selectedScore);
    const clientNote = notes[q.id] ? `\nCatatan Resto: "${notes[q.id]}"` : '';
    const clientCondition = selectedOption
      ? `[Skor ${selectedScore}/4] ${selectedOption.label}${clientNote}`
      : `Belum dijawab${clientNote}`;

    return [
      `#${q.id}\n[${q.pillarName}]`,
      `${q.question}\n\nKondisi Klien:\n${clientCondition}`,
      `Bahaya / Red Flag:\n• ${q.redFlags.slice(0, 2).join('\n• ')}`,
      `SOLUSI GASTROSTOCK:\n${q.recommendation}\n\nNilai Tambah / ROI:\n${q.roiImpact}`
    ];
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 2.5, textColor: COLOR_DARK, overflow: 'linebreak' },
    headStyles: { fillColor: COLOR_NAVY, textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 22, fontStyle: 'bold', textColor: COLOR_BLUE },
      1: { cellWidth: 50 },
      2: { cellWidth: 42, textColor: COLOR_RED },
      3: { cellWidth: 68, textColor: COLOR_DARK }
    },
    head: [['No & Pilar', 'Pertanyaan & Kondisi Lapangan', 'Tanda Bahaya (Red Flags)', 'Solusi Konkret GastroStock & Dampak ROI']],
    body: solutionRows,
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        data.cell.styles.fillColor = [240, 253, 244]; // Soft green tint for solution column
      }
    }
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  // Check if page break is needed for the Roadmap & Sign-Off section
  if (currentY > pageHeight - 55) {
    doc.addPage();
    currentY = 16;
  }

  // ---------------------------------------------------------------------------
  // ROADMAP IMPLEMENTASI CEPAT (7 - 14 HARI)
  // ---------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 41, 66);
  doc.text('3. Rencana Aksi Implementasi Cepat Tanpa Gangguan Operasional (7-14 Hari)', margin, currentY);

  currentY += 3;

  const roadmapData = [
    ['Fase 1 (Hari 1-2)', 'Audit Hardware & LAN', 'Verifikasi printer thermal, tablet Android/iPad, router offline mesh, dan master menu.'],
    ['Fase 2 (Hari 3-4)', 'Setup Resep & KDS', 'Digitalisasi resep gramasi BOM, konfigurasi alert allergen, dan mapping stasiun masak.'],
    ['Fase 3 (Hari 5-6)', 'Pelatihan Staf & Role PIN', 'Training kasir, waiter tablet, juru masak KDS, store manager PIN, dan simulasi rush-hour.'],
    ['Fase 4 (Hari 7+)', 'Go-Live & Monitoring', 'Go-live didampingi Lead Consultant on-site, aktivasi live BI executive di smartphone owner.']
  ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2, textColor: COLOR_DARK },
    headStyles: { fillColor: COLOR_NAVY, textColor: [255, 255, 255], fontStyle: 'bold' },
    head: [['Tahapan Waktu', 'Nama Aktivitas', 'Ruang Lingkup & Deliverables GastroStock']],
    body: roadmapData
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 8;

  if (currentY > pageHeight - 45) {
    doc.addPage();
    currentY = 16;
  }

  // ---------------------------------------------------------------------------
  // LEMBAR PENGESAHAN & BERITA ACARA RESMI
  // ---------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 41, 66);
  doc.text('4. Lembar Berita Acara & Pengesahan Rekomendasi Solusi', margin, currentY);

  currentY += 3;

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3, textColor: COLOR_DARK },
    body: [
      [
        {
          content: `Pihak Manajemen Restoran\n${clientName}\n\n\n\n\n( ${picName} )\nJabatan: Pemilik / General Manager\nTanggal: ${auditDate}`,
          styles: { halign: 'center', fillColor: [248, 250, 252], cellWidth: (pageWidth - (margin * 2)) / 2 }
        },
        {
          content: `Pihak Penyedia Solusi\nGASTROSTOCK TECHNOLOGIES\n\n\n\n\n( ${consultantName} )\nJabatan: Lead Solutions Architect\nTanggal: ${auditDate}`,
          styles: { halign: 'center', fillColor: [248, 250, 252], cellWidth: (pageWidth - (margin * 2)) / 2 }
        }
      ]
    ]
  });

  // Add Page Numbers in Footer for all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Dokumen Resmi GastroStock RestoSync · Rahasia & Hak Cipta Dilindungi · Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  return doc;
}

export function downloadAuditSummaryPdf(options: AuditSummaryReportOptions): void {
  const doc = generateAuditSummaryPdf(options);
  const safeClient = (options.clientName || 'Restoran_Mitra').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`GastroStock_Official_Audit_Summary_Report_${safeClient}.pdf`);
}
