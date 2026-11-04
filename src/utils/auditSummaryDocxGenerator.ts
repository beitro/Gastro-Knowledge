// Official Microsoft Word (.docx) Generator for GastroStock Audit Summary & Solution Recommendation Report
// Generates formal executive summary document with letterhead, diagnostic scores, findings, tailored solutions, and formal sign-off.

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  ShadingType
} from 'docx';
import { PITCHING_QUESTIONS, PILLARS, calculateVulnerabilityScore } from '../data/pitchingQuestionsData';
import { AuditSummaryReportOptions } from './auditSummaryPdfGenerator';

const COLOR_PRIMARY = '0F2942';   // Deep Navy Corporate
const COLOR_SECONDARY = '0284C7'; // Tech Blue
const COLOR_ACCENT = 'D97706';    // Amber Gold
const COLOR_ALERT = 'DC2626';     // Red Alert
const COLOR_SUCCESS = '059669';   // Emerald Green
const COLOR_TEXT_DARK = '1E293B';  // Slate Dark
const COLOR_MUTED = '64748B';      // Slate Muted
const COLOR_BORDER = 'CBD5E1';     // Light Border

const cellBorderStandard = {
  top: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  left: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  right: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER }
};

export async function generateAuditSummaryDocxBlob(options: AuditSummaryReportOptions): Promise<Blob> {
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

  const metrics = calculateVulnerabilityScore(answers);
  const answeredQuestions = PITCHING_QUESTIONS.filter(q => answers[q.id]);
  const displayQuestions = answeredQuestions.length > 0 ? answeredQuestions : PITCHING_QUESTIONS.slice(0, 10);

  const doc = new Document({
    creator: 'GastroStock Technologies Enterprise',
    title: `Ringkasan Hasil Audit & Solusi - ${clientName}`,
    description: 'Dokumen Resmi Hasil Diagnosa Titik Kebocoran Operasional dan Rekomendasi Solutif GastroStock OS',
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
            size: 21,
            color: COLOR_TEXT_DARK
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `GASTROSTOCK · RINGKASAN HASIL AUDIT & SOLUSI · NO: ${documentNumber}`,
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Arial'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Dokumen Resmi Rahasia GastroStock RestoSync · Halaman ',
                    size: 16,
                    color: COLOR_MUTED
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT]
                  }),
                  new TextRun({
                    text: ' dari ',
                    size: 16,
                    color: COLOR_MUTED
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES]
                  })
                ]
              })
            ]
          })
        },
        children: [
          // ===================================================================
          // KOP SURAT RESMI PERUSAHAAN (Official Letterhead)
          // ===================================================================
          new Paragraph({
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({
                text: 'GASTROSTOCK TECHNOLOGIES INDONESIA',
                bold: true,
                size: 28,
                color: COLOR_PRIMARY,
                font: 'Arial'
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: 'Enterprise Restaurant Operating System & Solution Architecture · www.gastrostock.id',
                size: 18,
                color: COLOR_SECONDARY
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 180 },
            children: [
              new TextRun({
                text: 'One Pacific Place Level 15, SCBD Jakarta Selatan · Telp: (021) 5088-7890 · Email: enterprise@gastrostock.id',
                size: 16,
                color: COLOR_MUTED
              })
            ]
          }),

          // Judul Dokumen
          new Paragraph({
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({
                text: 'RINGKASAN EKSEKUTIF HASIL AUDIT OPERASIONAL & SOLUSI GASTROSTOCK',
                bold: true,
                size: 26,
                color: COLOR_PRIMARY
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 200 },
            children: [
              new TextRun({
                text: `Laporan Resmi Diagnosa Titik Kebocoran, Mitigasi Red Flags, dan Rekomendasi Solusi Terpadu untuk ${clientName}`,
                italics: true,
                size: 20,
                color: COLOR_MUTED
              })
            ]
          }),

          // Metadata Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 28, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Nomor Dokumen', bold: true, size: 18 })] })]
                  }),
                  new TableCell({
                    width: { size: 72, type: WidthType.PERCENTAGE },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: documentNumber, bold: true, color: COLOR_PRIMARY, size: 18 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Nama Restoran / Klien', bold: true, size: 18 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: clientName, bold: true, color: COLOR_PRIMARY, size: 18 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'PIC / Narasumber Resto', bold: true, size: 18 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: picName, size: 18 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Tipe & Jumlah Outlet', bold: true, size: 18 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: `${restaurantType} (${outletCount})`, size: 18 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Konsultan Solusi GastroStock', bold: true, size: 18 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: consultantName, size: 18 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Tanggal Pelaksanaan Audit', bold: true, size: 18 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: auditDate, size: 18 })] })]
                  })
                ]
              })
            ]
          }),

          // ===================================================================
          // BAGIAN 1: RINGKASAN SKOR KEMATANGAN OPERASIONAL & ESTIMASI PENGHEMATAN
          // ===================================================================
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 100 },
            children: [
              new TextRun({ text: '1. Ringkasan Skor Kematangan & Proyeksi Finansial', bold: true, size: 24, color: COLOR_PRIMARY })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 33, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    borders: cellBorderStandard,
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'PROGRES AUDIT', bold: true, size: 16, color: COLOR_MUTED })] }),
                      new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: `${metrics.totalAnswered} / 50 Soal`, bold: true, size: 22, color: COLOR_PRIMARY })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Tinjauan 6 pilar strategis', size: 15, color: COLOR_MUTED })] })
                    ]
                  }),
                  new TableCell({
                    width: { size: 33, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    borders: cellBorderStandard,
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'SKOR KEMATANGAN', bold: true, size: 16, color: COLOR_MUTED })] }),
                      new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: `${metrics.averageScore > 0 ? metrics.averageScore : '-'} / 4.0`, bold: true, size: 22, color: COLOR_ACCENT })] }),
                      new Paragraph({ children: [new TextRun({ text: metrics.vulnerabilityLevel, size: 15, color: COLOR_MUTED })] })
                    ]
                  }),
                  new TableCell({
                    width: { size: 34, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'F0FDF4' },
                    borders: cellBorderStandard,
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'ESTIMASI PENGHEMATAN', bold: true, size: 16, color: COLOR_SUCCESS })] }),
                      new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: metrics.potentialMonthlySavings.split('(')[0].trim(), bold: true, size: 20, color: COLOR_SUCCESS })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Penyelamatan margin & anti-fraud', size: 15, color: COLOR_MUTED })] })
                    ]
                  })
                ]
              })
            ]
          }),

          // Tabel 6 Pilar
          new Paragraph({
            spacing: { before: 180, after: 80 },
            children: [
              new TextRun({ text: 'Tabel Status 6 Pilar Operasional Restoran Klien:', bold: true, size: 20, color: COLOR_PRIMARY })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Pilar', bold: true, color: 'FFFFFF', size: 17 })] })]
                  }),
                  new TableCell({
                    width: { size: 45, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Nama Dimensi Operasional', bold: true, color: 'FFFFFF', size: 17 })] })]
                  }),
                  new TableCell({
                    width: { size: 15, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Terjawab', bold: true, color: 'FFFFFF', size: 17 })] })]
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Status & Tingkat Risiko', bold: true, color: 'FFFFFF', size: 17 })] })]
                  })
                ]
              }),
              ...PILLARS.map((p, idx) => {
                const qInPillar = PITCHING_QUESTIONS.filter(q => q.pillar === p.id);
                const answeredInP = qInPillar.filter(q => answers[q.id]);
                const sumP = answeredInP.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
                const avgP = answeredInP.length > 0 ? (sumP / answeredInP.length).toFixed(1) : '-';
                
                let statusLabel = 'Belum Diuji';
                let statusColor = COLOR_MUTED;
                if (answeredInP.length > 0) {
                  const num = parseFloat(avgP);
                  if (num <= 2.0) {
                    statusLabel = 'KRITIS (Kebocoran)';
                    statusColor = COLOR_ALERT;
                  } else if (num <= 3.0) {
                    statusLabel = 'RENTAN (Perlu Solusi)';
                    statusColor = COLOR_ACCENT;
                  } else {
                    statusLabel = 'OPTIMAL (Modern)';
                    statusColor = COLOR_SUCCESS;
                  }
                }

                return new TableRow({
                  children: [
                    new TableCell({
                      borders: cellBorderStandard,
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Pilar ${idx + 1}`, bold: true, size: 16 })] })]
                    }),
                    new TableCell({
                      borders: cellBorderStandard,
                      children: [new Paragraph({ children: [new TextRun({ text: p.name, bold: true, size: 16 })] })]
                    }),
                    new TableCell({
                      borders: cellBorderStandard,
                      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${answeredInP.length}/${p.totalQuestions}`, size: 16 })] })]
                    }),
                    new TableCell({
                      borders: cellBorderStandard,
                      children: [new Paragraph({ children: [new TextRun({ text: statusLabel, bold: true, color: statusColor, size: 16 })] })]
                    })
                  ]
                });
              })
            ]
          }),

          // ===================================================================
          // BAGIAN 2: RINCIAN TEMUAN LAPANGAN & SOLUSI KONKRET YANG KITA PROVIDE
          // ===================================================================
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 350, after: 100 },
            children: [
              new TextRun({ text: '2. Temuan Lapangan & Solusi Konkret yang Disediakan GastroStock', bold: true, size: 24, color: COLOR_PRIMARY })
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 150 },
            children: [
              new TextRun({
                text: 'Berikut adalah rincian aspek operasional yang dinilai, kondisi riil restoran klien, identifikasi bahaya/red flag, serta solusi sistemik yang disediakan oleh GastroStock OS beserta proyeksi ROI-nya:',
                size: 18,
                color: COLOR_MUTED
              })
            ]
          }),

          // Matrix of Questions & Solutions
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 10, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 16 })] })]
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Aspek & Kondisi Klien Saat Ini', bold: true, color: 'FFFFFF', size: 16 })] })]
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Tanda Bahaya (Red Flags)', bold: true, color: 'FFFFFF', size: 16 })] })]
                  }),
                  new TableCell({
                    width: { size: 35, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Solusi Kongkrit GastroStock & ROI', bold: true, color: 'FFFFFF', size: 16 })] })]
                  })
                ]
              }),
              ...displayQuestions.map(q => {
                const selectedScore = answers[q.id];
                const selectedOption = q.options.find(opt => opt.score === selectedScore);
                const clientNote = notes[q.id] ? ` (Catatan: "${notes[q.id]}")` : '';
                const conditionText = selectedOption
                  ? `[Skor ${selectedScore}/4] ${selectedOption.label}${clientNote}`
                  : `Belum dijawab${clientNote}`;

                return new TableRow({
                  children: [
                    new TableCell({
                      borders: cellBorderStandard,
                      children: [
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `#${q.id}`, bold: true, color: COLOR_SECONDARY, size: 16 })] }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: q.pillarName, size: 13, color: COLOR_MUTED })] })
                      ]
                    }),
                    new TableCell({
                      borders: cellBorderStandard,
                      children: [
                        new Paragraph({ children: [new TextRun({ text: q.question, bold: true, size: 16, color: COLOR_PRIMARY })] }),
                        new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: 'Kondisi Klien: ', bold: true, size: 15, color: COLOR_MUTED }), new TextRun({ text: conditionText, size: 15 })] })
                      ]
                    }),
                    new TableCell({
                      borders: cellBorderStandard,
                      children: [
                        new Paragraph({ children: [new TextRun({ text: '⚠️ Red Flags Lapangan:', bold: true, size: 15, color: COLOR_ALERT })] }),
                        ...q.redFlags.map(rf => new Paragraph({ children: [new TextRun({ text: `• ${rf}`, size: 14, color: COLOR_ALERT })] }))
                      ]
                    }),
                    new TableCell({
                      shading: { type: ShadingType.CLEAR, fill: 'F0FDF4' },
                      borders: cellBorderStandard,
                      children: [
                        new Paragraph({ children: [new TextRun({ text: '💡 SOLUSI GASTROSTOCK:', bold: true, size: 15, color: COLOR_SUCCESS })] }),
                        new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: q.recommendation, size: 15, color: COLOR_TEXT_DARK })] }),
                        new Paragraph({ spacing: { before: 60 }, children: [new TextRun({ text: '📈 Proyeksi ROI: ', bold: true, size: 15, color: COLOR_ACCENT }), new TextRun({ text: q.roiImpact, bold: true, size: 15, color: COLOR_PRIMARY })] })
                      ]
                    })
                  ]
                });
              })
            ]
          }),

          // ===================================================================
          // BAGIAN 3: RENCANA AKSI & IMPLEMENTASI CEPAT (7 - 14 HARI)
          // ===================================================================
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 350, after: 100 },
            children: [
              new TextRun({ text: '3. Roadmap Implementasi Cepat Tanpa Gangguan Operasional (7-14 Hari)', bold: true, size: 24, color: COLOR_PRIMARY })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Fase Waktu', bold: true, color: 'FFFFFF', size: 17 })] })]
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Aktivitas Kunci', bold: true, color: 'FFFFFF', size: 17 })] })]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Hasil / Deliverables GastroStock', bold: true, color: 'FFFFFF', size: 17 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Hari 1 - 2', bold: true, size: 16 })] })] }),
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Audit Hardware & Jaringan', bold: true, size: 16 })] })] }),
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Pemeriksaan printer thermal, tablet Android/iPad, router offline mesh lokal, dan migrasi master menu database.', size: 16 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Hari 3 - 4', bold: true, size: 16 })] })] }),
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Setup Resep (BOM) & KDS', bold: true, size: 16 })] })] }),
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Input gramasi bahan baku resep otomatis, mapping stasiun masak grill/fryer/bar, dan setup peringatan allergen.', size: 16 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Hari 5 - 6', bold: true, size: 16 })] })] }),
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Training Staf & Role PIN', bold: true, size: 16 })] })] }),
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Pelatihan kasir, tablet waiter, KDS chef dapur, otorisasi PIN manager, dan uji coba simulasi jam sibuk tanpa tamu.', size: 16 })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Hari 7+', bold: true, size: 16 })] })] }),
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Full Go-Live On-Site', bold: true, size: 16 })] })] }),
                  new TableCell({ borders: cellBorderStandard, children: [new Paragraph({ children: [new TextRun({ text: 'Pendampingan langsung hari pertama go-live, pemantauan omset live BI di HP owner, dan jaminan zero-downtime.', size: 16 })] })] })
                ]
              })
            ]
          }),

          // ===================================================================
          // BAGIAN 4: BERITA ACARA PENGESAHAN & TANDA TANGAN
          // ===================================================================
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 350, after: 100 },
            children: [
              new TextRun({ text: '4. Lembar Berita Acara & Pengesahan Hasil Audit', bold: true, size: 24, color: COLOR_PRIMARY })
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 180 },
            children: [
              new TextRun({
                text: 'Dokumen ini merupakan hasil evaluasi bersama yang sah antara pihak manajemen restoran dan konsultan solusi GastroStock Technologies untuk ditindaklanjuti dalam perjanjian implementasi sistem.',
                size: 18,
                color: COLOR_MUTED
              })
            ]
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: cellBorderStandard,
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Pihak Manajemen Restoran Klien', bold: true, size: 18 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: clientName, bold: true, color: COLOR_PRIMARY, size: 18 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200, after: 80 }, children: [new TextRun({ text: `( ${picName} )`, bold: true, size: 18 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Pemilik / General Manager Restoran', size: 16, color: COLOR_MUTED })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Tanggal: ${auditDate}`, size: 15, color: COLOR_MUTED })] })
                    ]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: cellBorderStandard,
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Pihak Penyedia Solusi Sistem', bold: true, size: 18 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'GASTROSTOCK TECHNOLOGIES', bold: true, color: COLOR_PRIMARY, size: 18 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200, after: 80 }, children: [new TextRun({ text: `( ${consultantName} )`, bold: true, size: 18 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Lead Solution Architect', size: 16, color: COLOR_MUTED })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Tanggal: ${auditDate}`, size: 15, color: COLOR_MUTED })] })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }
    ]
  });

  return await Packer.toBlob(doc);
}

export async function downloadAuditSummaryDocx(options: AuditSummaryReportOptions): Promise<void> {
  const blob = await generateAuditSummaryDocxBlob(options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeClient = (options.clientName || 'Restoran_Mitra').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `GastroStock_Official_Audit_Summary_Report_${safeClient}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
