import React, { useState } from 'react';
import {
  Code,
  Terminal,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Cpu,
  Layers,
  Database,
  Key,
  Globe,
  Radio,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface DevDocumentSectionProps {
  restaurantName: string;
  clientPicName: string;
}

export const DevDocumentSection: React.FC<DevDocumentSectionProps> = ({
  restaurantName,
  clientPicName
}) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const sampleCheckoutPayload = `{
  "orderNumber": "ORD-20261015-0042",
  "tableNumber": 4,
  "guestCount": 3,
  "paymentMethod": "QRIS",
  "items": [
    { "menuItemId": "MNU-001", "quantity": 2, "notes": "Pedas level 3" },
    { "menuItemId": "MNU-004", "quantity": 3, "notes": "Es sedikit" }
  ]
}`;

  const sampleWebhookPayload = `{
  "transactionId": "TRX-QRIS-998811",
  "orderNumber": "ORD-20261015-0042",
  "grossAmount": 145000,
  "paymentStatus": "SETTLEMENT",
  "issuer": "BCA_QRIS",
  "settlementTime": "2026-10-15T12:30:15Z"
}`;

  return (
    <div className="space-y-6">
      {/* 1. DEVELOPER OVERVIEW & STANDARDS */}
      <div id="dev-standards" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.05] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Tahap 3: Dokumen Teknis Developer
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Coding Standards, Git Workflow &amp; Swagger API Documentation
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">DEV-DOC-GASTROSTOCK-V2.0</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Dokumen internal ini mengatur standar penulisan kode sumber (clean code), arsitektur modular TypeScript/React, tata kelola Git Flow, serta spesifikasi lengkap endpoint API (OpenAPI 3.0) dan integrasi webhook payment gateway / food delivery aggregator.
        </p>

        {/* 3 Core Engineering Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              TypeScript Strict Typing
            </span>
            <p className="text-slate-600">Zero <code className="font-mono text-rose-600">any</code> policy. Explicit return types &amp; strict null checks di seluruh repositori.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-purple-600" />
              Git Flow &amp; PR Review
            </span>
            <p className="text-slate-600">Branching feature/fix, conventional commits, wajib 1 approval senior engineer.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              OWASP Top 10 Compliance
            </span>
            <p className="text-slate-600">Parameterized SQL, rate limiting pada login/void, CSRF &amp; XSS sanitization.</p>
          </div>
        </div>
      </div>

      {/* 2. NAMING CONVENTIONS & CODING RULES */}
      <div id="dev-naming" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            D1
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Konvensi Penamaan (Naming Conventions) &amp; Aturan Kode
            </h3>
            <span className="text-xs text-slate-500">Kerapihan &amp; Kemudahan Perawatan Kode (Maintainability)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-black/[0.06] bg-slate-50">
                <th className="p-2.5 font-bold text-slate-900">ELEMEN ARSITEKTUR</th>
                <th className="p-2.5 font-bold text-slate-900">FORMAT KONVENSI</th>
                <th className="p-2.5 font-bold text-slate-900">CONTOH VALID</th>
                <th className="p-2.5 font-bold text-slate-900">ATURAN STRICT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04]">
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Komponen React &amp; File TSX</td>
                <td className="p-2.5 font-mono text-purple-700 font-bold">PascalCase</td>
                <td className="p-2.5 font-mono text-emerald-700">OrderCheckoutModal.tsx</td>
                <td className="p-2.5 text-slate-600">Wajib 1 komponen per file utama, export eksplisit.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Custom Hooks</td>
                <td className="p-2.5 font-mono text-purple-700 font-bold">camelCase (use*)</td>
                <td className="p-2.5 font-mono text-emerald-700">useRecipeCalculator.ts</td>
                <td className="p-2.5 text-slate-600">Harus memisahkan logika kalkulasi dari render UI.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Fungsi &amp; Variabel</td>
                <td className="p-2.5 font-mono text-purple-700 font-bold">camelCase</td>
                <td className="p-2.5 font-mono text-emerald-700">deductBomInventory()</td>
                <td className="p-2.5 text-slate-600">Gunakan kata kerja aktif (calculate, fetch, deduct).</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Konstanta Global</td>
                <td className="p-2.5 font-mono text-purple-700 font-bold">UPPER_SNAKE_CASE</td>
                <td className="p-2.5 font-mono text-emerald-700">MAX_OFFLINE_QUEUE_HOURS</td>
                <td className="p-2.5 text-slate-600">Dilarang hardcode angka ajaib (magic numbers).</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-slate-900">Tabel &amp; Kolom Database</td>
                <td className="p-2.5 font-mono text-purple-700 font-bold">snake_case</td>
                <td className="p-2.5 font-mono text-emerald-700">kitchen_tickets.table_number</td>
                <td className="p-2.5 text-slate-600">Nama tabel bentuk jamak (plural), timestamp timestamptz.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. GIT WORKFLOW & TESTING STANDARDS */}
      <div id="dev-git" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            D2
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Git Workflow, Pull Request &amp; Standar Unit Testing
            </h3>
            <span className="text-xs text-slate-500">Standar Kualitas CI/CD &amp; Code Coverage &gt; 85%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
            <span className="text-emerald-400 font-bold font-mono text-[11px] block flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              Standard Git Commands (GitHub Flow)
            </span>
            <div className="font-mono text-[11px] space-y-2 text-slate-300">
              <p className="text-slate-500"># Buat branch fitur baru</p>
              <p className="text-amber-300">git checkout -b feat/pos-split-bill-engine</p>
              <p className="text-slate-500 mt-2"># Commit pesan dengan conventional commit format</p>
              <p className="text-emerald-300">git commit -m "feat(pos): implement multi-guest split bill with decimal rounding"</p>
              <p className="text-slate-500 mt-2"># Jalankan linter dan unit testing sebelum push</p>
              <p className="text-blue-300">npm run lint &amp;&amp; npm run test</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-2">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Checklist Wajib Pull Request (PR)
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Unit test minimum 85% coverage pada modul kalkulasi BOM &amp; closing kasir.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Zero warning pada ESLint &amp; Prettier formatted (2 spaces indentation).</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Wajib menyertakan tangkapan layar (screenshot) sebelum &amp; sesudah untuk perubahan UI.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Tidak ada secret/token/password yang di-commit (gunakan .env).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. API DOCUMENTATION & OPENAPI 3.0 SPEC */}
      <div id="dev-api" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              D3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Spesifikasi REST API &amp; Swagger / OpenAPI 3.0
              </h3>
              <span className="text-xs text-slate-500">Endpoint Transaksi Kasir, Dapur KDS &amp; Webhook Integrasi</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
            OpenAPI 3.0.3
          </span>
        </div>

        {/* Endpoint 1: Checkout */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.04] pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-extrabold bg-emerald-600 text-white">
                POST
              </span>
              <code className="text-xs font-mono font-bold text-slate-900">
                /api/v1/orders/checkout
              </code>
            </div>
            <button
              onClick={() => handleCopy(sampleCheckoutPayload, 'checkout')}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-all"
            >
              {copiedEndpoint === 'checkout' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEndpoint === 'checkout' ? 'Tersalin' : 'Salin JSON Payload'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Membuka transaksi database atomik (ACID), mengunci baris bahan baku via <code className="font-mono text-cyan-700">SELECT ... FOR UPDATE</code>, memotong saldo stok bahan, membuat tiket dapur, dan mencatat transaksi penjualan.
          </p>

          <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto">
            {sampleCheckoutPayload}
          </pre>
        </div>

        {/* Endpoint 2: Payment Webhook */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-black/[0.04] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.04] pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-extrabold bg-blue-600 text-white">
                WEBHOOK
              </span>
              <code className="text-xs font-mono font-bold text-slate-900">
                /api/v1/webhooks/payment-callback
              </code>
            </div>
            <button
              onClick={() => handleCopy(sampleWebhookPayload, 'webhook')}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-all"
            >
              {copiedEndpoint === 'webhook' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEndpoint === 'webhook' ? 'Tersalin' : 'Salin Webhook JSON'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Menerima notifikasi otomatis settlement pembayaran QRIS Dinamis dari Payment Gateway (Midtrans / Xendit / DOKU). Dilengkapi validasi SHA-256 HMAC signature pada header <code className="font-mono text-blue-700">X-Signature</code>.
          </p>

          <pre className="p-3 bg-slate-900 text-cyan-300 rounded-xl font-mono text-[11px] overflow-x-auto">
            {sampleWebhookPayload}
          </pre>
        </div>
      </div>

      {/* 5. DEVELOPER SIGN-OFF */}
      <div id="dev-signoff" className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <span>Pengesahan Standar Arsitektur &amp; API Developer</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Dokumen standar kode dan spesifikasi API ini disahkan untuk menjadi acuan resmi seluruh tim software engineer dalam proses sprint development dan integrasi pihak ketiga.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
            <span className="font-bold text-slate-900 block">LEAD SOFTWARE ARCHITECT</span>
            <p className="text-slate-600 text-[11px]">Nama: Solution Architecture Team</p>
            <p className="text-slate-600 text-[11px]">Status: APPROVED ARCHITECTURE</p>
            <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
              <span className="text-[10px] text-slate-400">Tanda Tangan &amp; Approval</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-black/[0.08] space-y-2">
            <span className="font-bold text-slate-900 block">HEAD OF QA &amp; SECURITY</span>
            <p className="text-slate-600 text-[11px]">Nama: Quality Assurance Team</p>
            <p className="text-slate-600 text-[11px]">Status: PASSED CODE QUALITY AUDIT</p>
            <div className="h-14 border-b border-dashed border-slate-300 flex items-end">
              <span className="text-[10px] text-slate-400">Tanda Tangan &amp; Verifikasi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
