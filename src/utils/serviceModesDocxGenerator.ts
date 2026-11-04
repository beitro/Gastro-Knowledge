// Enterprise Restaurant Service Modes & Developer Architecture Microsoft Word (.docx) Generator
// Generates complete operational flows, technology stacks, protocols, API endpoints, and inventory locking rules for all 16 restaurant service models.

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
import { RESTAURANT_SERVICE_MODES, RESTAURANT_SERVICE_CATEGORIES } from '../data/restaurantServiceModesData';

const COLOR_PRIMARY = '0F2942';   // Deep Navy
const COLOR_SECONDARY = '0284C7'; // Tech Cyan
const COLOR_ACCENT = 'D97706';    // Amber Gold
const COLOR_TEXT_DARK = '1E293B';  // Slate Dark
const COLOR_MUTED = '64748B';      // Slate Muted
const COLOR_BG_LIGHT = 'F8FAFC';   // Slate Light Background
const COLOR_BORDER = 'CBD5E1';     // Slate Border Light

const cellBorderStandard = {
  top: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  left: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
  right: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER }
};

function createParagraph(
  text: string,
  options: {
    bold?: boolean;
    italic?: boolean;
    size?: number;
    color?: string;
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    spaceBefore?: number;
    spaceAfter?: number;
  } = {}
): Paragraph {
  return new Paragraph({
    alignment: options.alignment || AlignmentType.LEFT,
    spacing: {
      before: options.spaceBefore !== undefined ? options.spaceBefore : 100,
      after: options.spaceAfter !== undefined ? options.spaceAfter : 100,
      line: 276
    },
    children: [
      new TextRun({
        text,
        bold: options.bold || false,
        italics: options.italic || false,
        size: options.size || 22,
        color: options.color || COLOR_TEXT_DARK,
        font: 'Segoe UI'
      })
    ]
  });
}

function createHeading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel], color: string = COLOR_PRIMARY): Paragraph {
  let size = 32;
  let before = 240;
  let after = 120;
  if (level === HeadingLevel.HEADING_2) {
    size = 26;
    before = 200;
    after = 100;
  } else if (level === HeadingLevel.HEADING_3) {
    size = 22;
    before = 160;
    after = 80;
  }

  return new Paragraph({
    heading: level,
    spacing: { before, after, line: 276 },
    children: [
      new TextRun({
        text,
        bold: true,
        size,
        color,
        font: 'Segoe UI'
      })
    ]
  });
}

export async function generateServiceModesDocx(): Promise<Blob> {
  const sectionsContent: (Paragraph | Table)[] = [];

  // Title Cover
  sectionsContent.push(
    createParagraph('RESTOSYNC ENTERPRISE RESTAURANT OS', {
      bold: true,
      size: 26,
      color: COLOR_SECONDARY,
      alignment: AlignmentType.CENTER,
      spaceBefore: 300,
      spaceAfter: 100
    }),
    createParagraph('BLUEPRINT 16 MODEL LAYANAN RESTORAN & ARSITEKTUR TEKNOLOGI PENGEMBANGAN', {
      bold: true,
      size: 38,
      color: COLOR_PRIMARY,
      alignment: AlignmentType.CENTER,
      spaceBefore: 100,
      spaceAfter: 150
    }),
    createParagraph('Panduan Komprehensif Alur Operasional, Integrasi Perangkat Keras, Protokol Jaringan, Skema API, dan Logika Inventaris untuk Tim Developer & F&B Engineer', {
      italic: true,
      size: 22,
      color: COLOR_MUTED,
      alignment: AlignmentType.CENTER,
      spaceBefore: 50,
      spaceAfter: 350
    })
  );

  // Executive Summary Table
  const summaryHeader = new TableRow({
    children: [
      new TableCell({
        children: [createParagraph('Kategori Layanan', { bold: true, color: 'FFFFFF', size: 20 })],
        shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
        borders: cellBorderStandard
      }),
      new TableCell({
        children: [createParagraph('Jumlah Model', { bold: true, color: 'FFFFFF', size: 20 })],
        shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
        borders: cellBorderStandard
      }),
      new TableCell({
        children: [createParagraph('Fokus Integrasi Utama', { bold: true, color: 'FFFFFF', size: 20 })],
        shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR },
        borders: cellBorderStandard
      })
    ]
  });

  const summaryRows = RESTAURANT_SERVICE_CATEGORIES.map(cat => new TableRow({
    children: [
      new TableCell({
        children: [createParagraph(cat.title, { bold: true, size: 20 })],
        borders: cellBorderStandard
      }),
      new TableCell({
        children: [createParagraph(`${cat.count} Metode`, { size: 20 })],
        borders: cellBorderStandard
      }),
      new TableCell({
        children: [createParagraph(cat.description, { size: 18, color: COLOR_MUTED })],
        borders: cellBorderStandard
      })
    ]
  }));

  sectionsContent.push(
    new Table({
      rows: [summaryHeader, ...summaryRows],
      width: { size: 100, type: WidthType.PERCENTAGE }
    }),
    createParagraph('', { spaceBefore: 200, spaceAfter: 100 })
  );

  // Iterate categories & models
  for (const cat of RESTAURANT_SERVICE_CATEGORIES) {
    sectionsContent.push(
      createHeading(cat.title, HeadingLevel.HEADING_1, COLOR_PRIMARY),
      createParagraph(cat.description, { italic: true, color: COLOR_MUTED, size: 20, spaceAfter: 200 })
    );

    const modes = RESTAURANT_SERVICE_MODES.filter(m => m.categoryId === cat.id);

    for (const mode of modes) {
      sectionsContent.push(
        createHeading(`${mode.name} (${mode.englishTitle})`, HeadingLevel.HEADING_2, COLOR_SECONDARY),
        createParagraph(mode.overview, { size: 20, spaceAfter: 150 })
      );

      // Operational Matrix Table
      const metricsTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [createParagraph('Rata-rata Waktu Meja', { bold: true, size: 18 })], borders: cellBorderStandard }),
              new TableCell({ children: [createParagraph(mode.metrics.turnaroundTime, { size: 18 })], borders: cellBorderStandard }),
              new TableCell({ children: [createParagraph('Ketergantungan Teknologi', { bold: true, size: 18 })], borders: cellBorderStandard }),
              new TableCell({ children: [createParagraph(mode.metrics.techReliance, { size: 18 })], borders: cellBorderStandard })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({ children: [createParagraph('Intensitas Tenaga Kerja', { bold: true, size: 18 })], borders: cellBorderStandard }),
              new TableCell({ children: [createParagraph(mode.metrics.laborIntensity, { size: 18 })], borders: cellBorderStandard }),
              new TableCell({ children: [createParagraph('Risiko Waste Bahan', { bold: true, size: 18 })], borders: cellBorderStandard }),
              new TableCell({ children: [createParagraph(mode.metrics.wasteRiskLevel, { size: 18 })], borders: cellBorderStandard })
            ]
          })
        ],
        width: { size: 100, type: WidthType.PERCENTAGE }
      });

      sectionsContent.push(metricsTable, createParagraph('', { spaceBefore: 100, spaceAfter: 80 }));

      // Operational Flow Table (5 Steps)
      sectionsContent.push(createHeading('Alur Langkah Operasional & Sistem (5 Tahap)', HeadingLevel.HEADING_3, COLOR_PRIMARY));

      const flowHeader = new TableRow({
        children: [
          new TableCell({ children: [createParagraph('Tahap', { bold: true, color: 'FFFFFF', size: 18 })], shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR }, borders: cellBorderStandard }),
          new TableCell({ children: [createParagraph('Pelaku & Tindakan', { bold: true, color: 'FFFFFF', size: 18 })], shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR }, borders: cellBorderStandard }),
          new TableCell({ children: [createParagraph('Detail Alur & Reaksi Sistem', { bold: true, color: 'FFFFFF', size: 18 })], shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR }, borders: cellBorderStandard }),
          new TableCell({ children: [createParagraph('Dampak Database', { bold: true, color: 'FFFFFF', size: 18 })], shading: { fill: COLOR_PRIMARY, type: ShadingType.CLEAR }, borders: cellBorderStandard })
        ]
      });

      const flowRows = mode.operationalFlow.map(step => new TableRow({
        children: [
          new TableCell({ children: [createParagraph(`Fase ${step.stepNumber}: ${step.phaseName}`, { bold: true, size: 18 })], borders: cellBorderStandard }),
          new TableCell({ children: [createParagraph(`${step.actor}: ${step.actionSummary}`, { size: 18 })], borders: cellBorderStandard }),
          new TableCell({ children: [createParagraph(`${step.detailFlow}\nTrigger: ${step.systemTrigger}`, { size: 16, color: COLOR_MUTED })], borders: cellBorderStandard }),
          new TableCell({ children: [createParagraph(step.dbImpact, { size: 16, color: COLOR_TEXT_DARK })], borders: cellBorderStandard })
        ]
      }));

      sectionsContent.push(
        new Table({
          rows: [flowHeader, ...flowRows],
          width: { size: 100, type: WidthType.PERCENTAGE }
        }),
        createParagraph('', { spaceBefore: 150, spaceAfter: 80 })
      );

      // Tech Stack & Hardware
      sectionsContent.push(
        createHeading('Arsitektur Perangkat Keras & Protokol Jaringan', HeadingLevel.HEADING_3, COLOR_PRIMARY),
        createParagraph(`Hardware Diperlukan: ${mode.techArchitecture.hardwareRequired.join(', ')}`, { size: 18, bold: true, spaceAfter: 60 }),
        createParagraph(`Perangkat Frontend: ${mode.techArchitecture.frontendDevices.join(', ')}`, { size: 18, color: COLOR_MUTED, spaceAfter: 80 })
      );

      // Protocol List
      for (const proto of mode.techArchitecture.protocols) {
        sectionsContent.push(
          createParagraph(`• [${proto.protocol}] ${proto.usage} (Target: ${proto.targetDeviceOrService})`, {
            size: 18,
            spaceBefore: 30,
            spaceAfter: 30
          })
        );
      }

      // Inventory & Concurrency
      sectionsContent.push(
        createParagraph('', { spaceBefore: 80, spaceAfter: 40 }),
        createParagraph(`Aturan Pemotongan Stok: ${mode.techArchitecture.inventoryDeductionRule.timing} - ${mode.techArchitecture.inventoryDeductionRule.logic}`, { size: 18, italic: true }),
        createParagraph(`Mekanisme Concurrency: ${mode.techArchitecture.concurrencyAndLocking.lockMechanism}. ${mode.techArchitecture.concurrencyAndLocking.raceConditionHandling}`, { size: 18, color: COLOR_MUTED, spaceAfter: 150 })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'RestoSync · Blueprint 16 Model Layanan Restoran & Arsitektur Dev',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
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
                    text: 'Halaman ',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
                  }),
                  new TextRun({
                    text: ' dari ',
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 16,
                    color: COLOR_MUTED,
                    font: 'Segoe UI'
                  })
                ]
              })
            ]
          })
        },
        children: sectionsContent
      }
    ]
  });

  return await Packer.toBlob(doc);
}
