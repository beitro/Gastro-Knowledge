# Gastro Knowledge System — Dark Slate Neumorphism & Role-Based Knowledge Architecture

Transform the Gastro Knowledge System interface into a sophisticated **Dark Slate Neumorphism** visual environment with clean tactile depth, structured role-based knowledge grouping (Kasir, Dapur, Gudang, and Manajemen), and zero feature loss across all interactive simulators, API documentation, and multi-format document generators.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Decisions from Phase 1 Consultation:**
> - **Aesthetic Theme**: **Dark Slate Neumorphism** (`#0B0F19` base canvas, `#141C2E` raised tactile surfaces, paired with dual-shadow illumination: `#1E293B` light rim highlights and `rgba(0,0,0,0.6)` soft drop shadows, inset shadows for pressed/active states, and vivid cyan/emerald/amber functional indicators).
> - **Knowledge Structure**: Reorganized around **4 Primary Operational Roles** (`Kasir`, `Dapur`, `Gudang`, and `Manajemen & Dev`), enabling users to navigate intuitively while preserving instant access to all 12+ sub-modules and simulators.
> - **Export & Download Center**: **Floating Neumorphic Quick-Action Bar** pinned at the bottom-right for universal 1-click access to all formats (DOCX, PPTX, Figma SVG, Draw.io XML, PDF) accompanied by contextual embossed Neumorphic download buttons on every document card.
> - **Zero Feature Loss Guarantee**: All 16 restaurant service flows, ACID row-lock simulator, interactive recipe BOM deduction, Swagger API console, ERD diagram, 13-slide Apple Keynote pitch deck, and 50-question diagnostic audit remain 100% active and functional.

---

### 1. Overview & Core Concept

- **What It Does**: Gastro Knowledge System is an enterprise restaurant operating system blueprint and operational knowledge base. It unites real-time inventory synchronization, cross-module hardware workflows, and pre-sales engineering documents in a single tactile, structured workspace.
- **Target Audience / Persona**: F&B Enterprise Founders, Head of Operations, Kitchen & Store Managers, Solutions Architects, and Software Engineers implementing restaurant tech stacks.
- **Key Value**: Delivers clarity and physical elegance through modern neumorphic depth without visual clutter, making complex systems (such as ACID row-locking, recipe explosion, and offline KDS syncing) immediately digestible and verifiable for both non-technical managers and senior developers.

---

### 2. User Experience & Visual Design

#### A. Dark Slate Neumorphic Surface & Depth System
The interface adopts a futuristic, high-contrast Dark Slate Neumorphism style:
- **Base Canvas**: Deep matte slate `#0B0F19` (`bg-slate-950/90`).
- **Extruded (Raised) Neumorphic Panels**: `#141C2E` with dual-drop shadows:
  - Top-left light catch: `inset 1px 1px 1px rgba(255, 255, 255, 0.08)`.
  - Bottom-right soft shadow: `6px 6px 16px rgba(0, 0, 0, 0.55), -4px -4px 12px rgba(30, 41, 59, 0.25)`.
- **Inset (Sunken) Interactive Surfaces**: Used for search bars, active tabs, toggle switches, and code terminal containers:
  - `inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -2px -2px 4px rgba(255, 255, 255, 0.04)`.
- **Accents & State Lighting**:
  - Cyan `#38BDF8` (Active navigation, API protocols, network links)
  - Emerald `#34D399` (ACID locking success, FEFO valid status, completed downloads)
  - Amber `#FBBF24` (Warning thresholds, low stock triggers, pending kitchen tickets)
  - Rose `#F43F5E` (High-priority kitchen alerts, void audit logs)

#### B. Role-Based Knowledge Base Navigation
Instead of an unstructured list of 12 unlinked tabs, the navigation is structured cleanly into 4 primary role hubs:
1. **Kasir (Front of House & POS Hub)**:
   - 16 Model Layanan Restoran (Table Service, Kiosk, Counter, Drive-Thru, Conveyor, etc.)
   - Alur Transaksi & Kasir POS Simulator Interaktif
   - Integrasi EDC, Thermal Printer ESC/POS, dan Barcode Scanner
2. **Dapur (Kitchen Display System - KDS Hub)**:
   - KDS Multi-Station Routing (Hot Kitchen, Cold, Bar, Dessert)
   - Real-time Ticket Status (Queue → Cooking → Ready → Bumped)
   - Resep Bom Real-Time & HACCP Quality Control
3. **Gudang (Warehouse & Supply Chain Hub)**:
   - FEFO & FIFO Stock Management Engine
   - Batch Expiry Tracking & Minimum Threshold Alert
   - Supplier Receiving, Purchase Orders & Inter-Outlet Stock Transfer
4. **Manajemen & Dev (Executive BI, Legal & Architecture Hub)**:
   - Dokumen 4 Fase Lengkap (BRD, FSD, TSD, Master Workbook)
   - ACID Row-Level Locking Concurrency Guide
   - REST & WebSocket API Specification (Swagger Explorer)
   - Skema Basis Data Relasional (PostgreSQL ERD & DDL)
   - Presentasi Tim Developer & Pitch Deck Klien (Apple Keynote PPTX)
   - 50 Pertanyaan Audit & Diagnosa Kelayakan F&B

#### C. Floating Neumorphic Quick-Action Export Hub
- Fixed bottom-right docked Neumorphic pill/capsule that expands on click into an instant download matrix.
- Provides immediate downloads with zero navigation friction:
  - 📥 **Word Suite**: BRD (.docx), FSD (.docx), TSD (.docx), Master Workbook (.docx)
  - 📊 **Keynote Slides**: Sales Pitch Deck (.pptx), Dev Team Architecture (.pptx)
  - 🎨 **Figma Assets**: Complete UI Component Kit & 16-Service Mode SVG (.svg)
  - 📐 **Draw.io Diagrams**: Enterprise Architecture & Swimlane Flow (.xml)
  - 📑 **Audit Diagnosa**: F&B Feasibility Questionnaire (.docx & .pdf)

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Layer Navigation (Role Filter + Sub-Module Selector)**
  - *Chosen Approach*: Maintain high-level role selector buttons (`Kasir`, `Dapur`, `Gudang`, `Manajemen & Dev`) at the top, which gracefully filters and highlights the sub-navigation tabs while still allowing power users to switch directly to any specific technical module.
  - *Why*: Eliminates overwhelming horizontal scroll while guaranteeing 100% feature discoverability.
- **Decision 2: Neumorphic Styling via Pure CSS & Tailwind Shadows**
  - *Chosen Approach*: Implement Neumorphic shadows and bevels using modular Tailwind utility classes and CSS variables in `index.css` rather than heavy external UI libraries.
  - *Why*: Maintains high rendering performance (<16ms frame budget), zero bundle bloat, and total consistency across dark surfaces.
- **Decision 3: Retaining In-Card Download Triggers alongside the Floating Quick Bar**
  - *Chosen Approach*: Keep the download buttons within each document preview card (e.g., inside `DocumentSuiteViewer`, `PitchDeckViewer`, `FigmaCanvasStudio`, `DrawioCanvas`) while introducing the Floating Quick-Action Bar.
  - *Why*: Direct satisfaction of user requirement ("fitur2 download nya jangan hilang") ensuring users have both contextual and global export pathways.

---

### 4. Technical Architecture & Component Mapping

#### A. System Layout & Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        GASTRO KNOWLEDGE SYSTEM                         │
│               [Dark Slate Neumorphic Application Shell]                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌─────────────────────────────────────┐   ┌─────────────────────────────────────┐
│       NEUMORPHIC TOP NAVBAR         │   │   FLOATING QUICK-ACTION EXPORT BAR  │
│ - Brand: Gastro Knowledge System    │   │ - 1-Click DOCX Suite (BRD/FSD/TSD)  │
│ - Role Switcher:                    │   │ - 1-Click Keynote PPTX (Sales/Dev)  │
│   [Kasir | Dapur | Gudang | Mgmt]   │   │ - 1-Click Figma SVG & Draw.io XML   │
│ - Sub-Module Capsule & Data Reset   │   │ - 1-Click PDF Audit Summary Report  │
└──────────────────┬──────────────────┘   └─────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   ROLE-FILTERED VIEWPORT CONTAINER                     │
│                                                                        │
│  [Role: KASIR]             [Role: DAPUR]          [Role: GUDANG]       │
│  • 16 Service Modes        • KDS Multi-Station    • FEFO/FIFO Ledger   │
│  • Kasir POS Simulator     • Recipe Explosion     • Batch Expiry Grid  │
│  • Hardware Protocols      • Order Bump Tracker   • Stock Opname       │
│                                                                        │
│  [Role: MANAJEMEN & DEV]                                               │
│  • Dokumen 4 Fase (BRD / FSD / TSD / Master DOCX)                      │
│  • ACID Row-Locking & Concurrency Engine                               │
│  • REST & WebSocket API Specification (Interactive Console)           │
│  • PostgreSQL ERD & Database Schema DDL                                │
│  • Apple Keynote Presentations (Pitch Deck & Dev Alignment)            │
│  • 50 Pertanyaan Audit & Diagnosa Restoran                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               SHARED PERSISTENCE & GENERATION UTILITIES                │
│  • docx Generator (brdDocx, fsdDocx, tsdDocx, masterDocx, opsDocx)    │
│  • pptxgenjs Generator (Sales Deck PPTX, Dev Keynote PPTX)            │
│  • Vector SVG & XML Exporters (figmaExporter, drawioXmlGenerator)     │
│  • jsPDF Executive Exporter (auditSummaryPdfGenerator)                │
└────────────────────────────────────────────────────────────────────────┘
```

#### B. Component & State Implementation Plan
1. **Styling Foundation (`src/index.css`)**:
   - Establish Dark Slate Neumorphic design tokens:
     - `.neu-flat`: Extruded surface with dual dark-mode shadows.
     - `.neu-pressed`: Inset sunken surface for pressed buttons and input wells.
     - `.neu-convex`: Gentle radial gradient surface for key CTA cards.
     - `.neu-concave`: Recessed displays for technical stats and code blocks.
     - Focus rings and active state indicators tailored for WCAG AA compliance against dark slate backgrounds.
2. **Navbar & Role Grouping (`src/components/Navbar.tsx`)**:
   - Implement role-based quick filter pills:
     - 💳 **Kasir**: 16 Model Layanan, Alur Kasir, POS Simulator
     - 🍳 **Dapur**: KDS & Tiket, Alur Dapur, Resep BOM
     - 📦 **Gudang**: Gudang FEFO, Kartu Stok, Mutasi
     - 📊 **Manajemen & Dev**: Dokumen 4 Fase, ACID Lock, API Spec, ERD, Keynote Deck, 50 Pertanyaan Audit
   - Style the entire header in seamless Dark Slate Neumorphism with crisp typography (`Plus Jakarta Sans` + `JetBrains Mono`).
3. **Floating Quick-Action Export Bar (`src/components/FloatingExportBar.tsx`)**:
   - Create a clean Neumorphic floating speed-dial component docked in the bottom-right viewport corner.
   - Categorized download triggers for DOCX, PPTX, Figma, Draw.io, and PDF with visual feedback and status tooltips.
4. **View Modules Theming & Preservation**:
   - Ensure all sub-components (`DocumentSuiteViewer`, `PitchDeckViewer`, `InteractiveSimulator`, `WireframePrototypeViewer`, `DatabaseErdViewer`, `ApiDocumentation`, `ConcurrencyGuide`, `PitchingQuestionsViewer`, `DrawioCanvas`, `FigmaCanvasStudio`) harmonize naturally with the dark slate neumorphic aesthetic without losing a single function, button, or parameter.

---

### 5. Verification Plan

- **Visual & Style Audit**: Verify all surfaces render cleanly in dark slate neumorphism with balanced light highlights and deep shadows across desktop (1440px) and responsive viewports.
- **Role Navigation Audit**: Verify clicking any of the 4 role buttons (`Kasir`, `Dapur`, `Gudang`, `Manajemen`) seamlessly highlights and filters the associated modules without breaking deep-link state.
- **Export Integrity Test**: Test every download button:
  - Download BRD, FSD, TSD, and Master DOCX
  - Download Sales Deck and Dev Keynote PPTX
  - Download Figma SVG and Draw.io XML
  - Download Audit Diagnosa PDF
- **Compilation & Linting**: Run `lint_applet` and `compile_applet` to ensure zero TypeScript errors and zero build failures.
