// Generator Microsoft Word (.docx) 50 Pertanyaan Audit & Pitching Restoran
// Menghasilkan dokumen resmi berstandar Enterprise untuk Sales Consultant & Solution Architect GastroStock

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
import { PITCHING_QUESTIONS, PILLARS } from '../data/pitchingQuestionsData';

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

export interface PitchingDocxOptions {
  clientName?: string;
  picName?: string;
  consultantName?: string;
  auditDate?: string;
  restaurantType?: string;
  outletCount?: string;
  answers?: Record<number, number>;
  notes?: Record<number, string>;
}

export async function generatePitchingQuestionsDocxBlob(options: PitchingDocxOptions = {}): Promise<Blob> {
  const {
    clientName = 'Restoran Mitra & Hospitality Group',
    picName = 'Pemilik / General Manager Restoran',
    consultantName = 'GastroStock Enterprise Sales Team',
    auditDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    restaurantType = 'Casual Dining & Multi-Outlet Cafe',
    outletCount = '1 - 5 Cabang',
    answers = {},
    notes = {}
  } = options;

  const doc = new Document({
    creator: 'GastroStock Technologies Enterprise',
    title: `50 Pertanyaan Audit & Pitching Restoran - ${clientName}`,
    description: 'Panduan Wawancara Diagnosa Kebutuhan, Evaluasi Titik Kebocoran, dan Rekomendasi Solusi Operasional Restoran',
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
                    text: 'GASTROSTOCK RESTOSYNC · DOKUMEN AUDIT & PITCHING 50 PERTANYAAN',
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
                    text: 'Kerahasiaan Dokumen Dilindungi · Halaman ',
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
          // JUDUL & COVER
          // ===================================================================
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: 'DOKUMEN DIAGNOSA & 50 PERTANYAAN AUDIT RESTORAN',
                bold: true,
                size: 36,
                color: COLOR_PRIMARY,
                font: 'Arial'
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 0, after: 200 },
            children: [
              new TextRun({
                text: 'Panduan Evaluasi Kebutuhan Riil, Identifikasi Titik Kebocoran Operasional, dan Rekomendasi Solutif GastroStock OS',
                italics: true,
                size: 22,
                color: COLOR_SECONDARY
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
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Nama Restoran / Klien', bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: clientName, bold: true, color: COLOR_PRIMARY, size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'PIC / Narasumber', bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: picName, size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Lead Solution Consultant', bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: consultantName, size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Model Bisnis & Jumlah Cabang', bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: `${restaurantType} (${outletCount})`, size: 20 })] })]
                  })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Tanggal Pelaksanaan Audit', bold: true, size: 20 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: auditDate, size: 20 })] })]
                  })
                ]
              })
            ]
          }),

          // ===================================================================
          // PENGANTAR & TUJUAN AUDIT
          // ===================================================================
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 120 },
            children: [
              new TextRun({ text: '1. Petunjuk & Metodologi Audit Lapangan', bold: true, size: 26, color: COLOR_PRIMARY })
            ]
          }),
          new Paragraph({
            spacing: { before: 60, after: 120 },
            children: [
              new TextRun({
                text: 'Dokumen ini memuat 50 pertanyaan terstruktur yang dibagi ke dalam 6 pilar strategis operasional restoran. Tujuannya adalah menggali secara mendalam titik kelemahan (pain points), celah kebocoran laba (fraud & food waste), serta hambatan skalabilitas yang dialami pemilik restoran. Setiap pertanyaan disertai indikator tanda bahaya (Red Flags), pilihan kondisi lapangan, dan rekomendasi solusi bernilai tambah dari ekosistem GastroStock.'
              })
            ]
          }),

          // 6 Pilar Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Pilar Strategis', bold: true, color: 'FFFFFF', size: 18 })] })]
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: 'Fokus Diagnosa & Manfaat untuk Klien', bold: true, color: 'FFFFFF', size: 18 })] })]
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: COLOR_PRIMARY },
                    borders: cellBorderStandard,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Jml Soal', bold: true, color: 'FFFFFF', size: 18 })] })]
                  })
                ]
              }),
              ...PILLARS.map(p => new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorderStandard,
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [new Paragraph({ children: [new TextRun({ text: p.name, bold: true, size: 18 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ children: [new TextRun({ text: p.description, size: 18 })] })]
                  }),
                  new TableCell({
                    borders: cellBorderStandard,
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${p.totalQuestions}`, bold: true, size: 18 })] })]
                  })
                ]
              }))
            ]
          }),

          // ===================================================================
          // ISI 50 PERTANYAAN LENGKAP PER PILAR
          // ===================================================================
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 150 },
            children: [
              new TextRun({ text: '2. Daftar Lengkap 50 Pertanyaan Diagnosa & Rekomendasi Solusi', bold: true, size: 26, color: COLOR_PRIMARY })
            ]
          }),

          // Iterasi semua 50 pertanyaan
          ...PITCHING_QUESTIONS.flatMap((q) => {
            const clientScore = answers[q.id];
            const clientNote = notes[q.id];

            return [
              new Paragraph({
                spacing: { before: 240, after: 60 },
                children: [
                  new TextRun({
                    text: `Pertanyaan #${q.id} [${q.pillarName}]`,
                    bold: true,
                    size: 20,
                    color: COLOR_SECONDARY
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 80 },
                children: [
                  new TextRun({
                    text: q.question,
                    bold: true,
                    size: 22,
                    color: COLOR_PRIMARY
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [
                  new TextRun({ text: 'Tujuan Diagnosa: ', bold: true, size: 18, color: COLOR_MUTED }),
                  new TextRun({ text: q.objective, size: 18, color: COLOR_MUTED })
                ]
              }),

              // Opsi Jawaban Table
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 10, type: WidthType.PERCENTAGE },
                        shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
                        borders: cellBorderStandard,
                        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Pilih', bold: true, size: 16 })] })]
                      }),
                      new TableCell({
                        width: { size: 65, type: WidthType.PERCENTAGE },
                        shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
                        borders: cellBorderStandard,
                        children: [new Paragraph({ children: [new TextRun({ text: 'Kondisi Nyata di Restoran Klien', bold: true, size: 16 })] })]
                      }),
                      new TableCell({
                        width: { size: 25, type: WidthType.PERCENTAGE },
                        shading: { type: ShadingType.CLEAR, fill: 'E2E8F0' },
                        borders: cellBorderStandard,
                        children: [new Paragraph({ children: [new TextRun({ text: 'Keterangan Diagnosa', bold: true, size: 16 })] })]
                      })
                    ]
                  }),
                  ...q.options.map((opt) => {
                    const isSelected = clientScore === opt.score;
                    return new TableRow({
                      children: [
                        new TableCell({
                          borders: cellBorderStandard,
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [new TextRun({ text: isSelected ? ' [✓] ' : ' [   ] ', bold: isSelected, color: isSelected ? COLOR_PRIMARY : COLOR_MUTED, size: 18 })]
                            })
                          ]
                        }),
                        new TableCell({
                          borders: cellBorderStandard,
                          shading: isSelected ? { type: ShadingType.CLEAR, fill: 'E0F2FE' } : undefined,
                          children: [new Paragraph({ children: [new TextRun({ text: opt.label, bold: isSelected, size: 18 })] })]
                        }),
                        new TableCell({
                          borders: cellBorderStandard,
                          children: [new Paragraph({ children: [new TextRun({ text: opt.hint, size: 16, color: COLOR_MUTED })] })]
                        })
                      ]
                    });
                  })
                ]
              }),

              // Red Flags Box
              new Paragraph({
                spacing: { before: 80, after: 40 },
                children: [
                  new TextRun({ text: '⚠️ Tanda Bahaya / Celah Kerugian (Red Flags): ', bold: true, size: 18, color: COLOR_ALERT }),
                  new TextRun({ text: q.redFlags.join('; '), size: 18, color: COLOR_TEXT_DARK })
                ]
              }),

              // Saran Solusi GastroStock Box
              new Paragraph({
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: '💡 Rekomendasi Solusi GastroStock: ', bold: true, size: 18, color: COLOR_SUCCESS }),
                  new TextRun({ text: q.recommendation, size: 18, color: COLOR_TEXT_DARK })
                ]
              }),

              // Dampak Finansial / ROI
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({ text: '📈 Potensi Dampak ROI & Keuntungan: ', bold: true, size: 18, color: COLOR_ACCENT }),
                  new TextRun({ text: q.roiImpact, size: 18, bold: true, color: COLOR_PRIMARY })
                ]
              }),

              // Catatan Tambahan (jika diisi)
              new Paragraph({
                spacing: { before: 40, after: 120 },
                children: [
                  new TextRun({ text: 'Catatan Khusus Lapangan: ', italics: true, size: 16, color: COLOR_MUTED }),
                  new TextRun({ text: clientNote || '__________________________________________________________________________________', size: 16, color: COLOR_TEXT_DARK })
                ]
              })
            ];
          }),

          // ===================================================================
          // LEMBAR TANDA TANGAN & KESEPAKATAN AUDIT
          // ===================================================================
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 350, after: 120 },
            children: [
              new TextRun({ text: '3. Lembar Pengesahan & Berita Acara Audit', bold: true, size: 26, color: COLOR_PRIMARY })
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 160 },
            children: [
              new TextRun({
                text: 'Hasil pengisian 50 pertanyaan audit di atas telah ditinjau secara bersama antara perwakilan manajemen restoran dan konsultan solusi GastroStock untuk dijadikan dasar perumusan dokumen implementasi sistem.'
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
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Pihak Restoran / Klien', bold: true, size: 20 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200, after: 80 }, children: [new TextRun({ text: `( ${picName} )`, bold: true, size: 20 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Pemilik / General Manager', size: 18, color: COLOR_MUTED })] })
                    ]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: cellBorderStandard,
                    shading: { type: ShadingType.CLEAR, fill: 'F8FAFC' },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Pihak Solusi GastroStock', bold: true, size: 20 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200, after: 80 }, children: [new TextRun({ text: `( ${consultantName} )`, bold: true, size: 20 })] }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Lead Restaurant Solution Specialist', size: 18, color: COLOR_MUTED })] })
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

export async function downloadPitchingQuestionsDocx(options: PitchingDocxOptions = {}): Promise<void> {
  const blob = await generatePitchingQuestionsDocxBlob(options);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeClient = (options.clientName || 'Restoran_Mitra').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.download = `GastroStock_50_Pertanyaan_Audit_Pitching_${safeClient}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
