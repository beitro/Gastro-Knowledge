import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  GitBranch, 
  RefreshCw, 
  Radio, 
  AlertOctagon, 
  CheckCircle2, 
  Server, 
  Clock 
} from 'lucide-react';

export const ConcurrencyGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span className="font-semibold text-rose-700">Keandalan &amp; Transaksi Atomik</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-500 font-medium">Pessimistic Locking &amp; FIFO Algorithm</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Mekanisme Sinkronisasi Stok Otomatis &amp; Kontrol Konkurensi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Penjelasan arsitektural mendalam mengenai strategi pencegahan stok minus (race condition saat jam makan siang sibuk), algoritma alokasi batch FIFO/FEFO, dan arsitektur WebSocket event stream.
        </p>
      </div>

      {/* Grid of Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Race Condition & Database Locking */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                1. Penanganan Race Condition Saat Rush Hour
              </h2>
              <span className="text-xs text-slate-400">Pessimistic vs Optimistic Locking</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-3">
            <p>
              Pada jam sibuk makan siang (peak lunch hour), 3 kasir dan 1 aplikasi pemesanan QR table dapat memesan menu <strong>Nasi Goreng Wagyu</strong> pada milidetik yang sama ketika stok tersisa hanya 1 porsi.
            </p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-semibold text-amber-300 block text-[11px]">
                Solusi yang Diterapkan: Row-Level Pessimistic Locking
              </span>
              <p className="text-[11px] text-slate-400">
                Sebelum stok dikurangi, sistem mengeksekusi:
              </p>
              <pre className="font-mono text-[11px] bg-slate-900 p-2 rounded text-emerald-300 border border-slate-800">
{`BEGIN;
SELECT current_stock 
FROM raw_materials 
WHERE sku = 'RAW-WAGYU-01' 
FOR UPDATE;

-- Permintaan transaksi lain akan menunggu (blocked)
-- hingga transaksi pertama selesai commit.
IF current_stock >= 0.08 THEN
  UPDATE raw_materials SET current_stock = current_stock - 0.08;
  COMMIT;
ELSE
  ROLLBACK;
  -- Return HTTP 409 Conflict
END IF;`}
              </pre>
            </div>

            <div className="flex items-start gap-2 text-slate-300 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Hasil:</strong> Mencegah stok menjadi negatif dan menjamin tidak ada pesanan yang diterima bila bahan fisik tidak ada.
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 2: FIFO & FEFO Batch Depletion */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                2. Algoritma Alokasi Batch FIFO & FEFO
              </h2>
              <span className="text-xs text-slate-400">First-Expired, First-Out Strategy</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-3">
            <p>
              Bahan segar restoran (daging, susu, telur) memiliki masa simpan terbatas. Algoritma FEFO menjamin sistem memotong stok dari batch dengan <em>expiry date</em> terdekat terlebih dahulu.
            </p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-semibold text-cyan-300 block text-[11px]">
                Urutan Konsumsi Multi-Batch:
              </span>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span>Batch A (Exp: 18 Okt 2026, Sisa: 1.5kg)</span>
                  <span className="text-cyan-400 font-bold">&larr; Dipotong Pertama</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <span>Batch B (Exp: 25 Okt 2026, Sisa: 5.0kg)</span>
                  <span className="text-slate-400">&larr; Dipotong Kedua</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-300 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Hasil:</strong> Meminimalkan resiko bahan basi di gudang (spoilage reduction hingga 40%).
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Offline POS Resiliency & Idempotency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                3. Ketahanan Jaringan & Idempotency Key
              </h2>
              <span className="text-xs text-slate-400">Mencegah Double Order Kasir</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-3">
            <p>
              Jika koneksi internet WiFi restoran terputus saat kasir menekan tombol "Bayar", kasir mungkin akan menekan tombol tersebut 2 atau 3 kali.
            </p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
              <span className="font-semibold text-purple-300 block">
                Implementasi Idempotency-Key:
              </span>
              <p className="text-slate-400">
                Setiap klik order menghasilkan UUID v4 di client:
              </p>
              <code className="block bg-slate-900 p-2 rounded text-amber-300 font-mono border border-slate-800">
                Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
              </code>
              <p className="text-slate-400">
                Backend menyimpan key ini di Redis dengan TTL 24 jam. Jika permintaan dengan key yang sama masuk kembali, backend langsung mengembalikan respons cache tanpa memotong stok dua kali.
              </p>
            </div>
          </div>
        </div>

        {/* Pillar 4: Event-Driven Real-time WebSocket Architecture */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                4. Sinkronisasi Real-Time Lintas Interface
              </h2>
              <span className="text-xs text-slate-400">Transactional Outbox Pattern & Redis Pub/Sub</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed space-y-3">
            <p>
              Saat transaksi database berhasil di-commit, event tidak dikirim langsung secara blocking, melainkan dipublikasikan ke Redis Pub/Sub channel.
            </p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
              <span className="font-semibold text-emerald-300 block">
                Alur Distribusi Pesan (Broadcast):
              </span>
              <div className="space-y-1 text-slate-300">
                <div>1. Kasir POS bayar &rarr; DB Commit</div>
                <div>2. Redis Publisher memancarkan channel: <code className="text-amber-400 font-mono">resto:inventory:events</code></div>
                <div>3. Node.js WebSocket Cluster meneruskan ke:</div>
                <div className="pl-4 text-slate-400">
                  &bull; <strong className="text-white">Interface Dapur (KDS)</strong>: Tiket order baru muncul & bunyi audio.<br />
                  &bull; <strong className="text-white">Interface Gudang</strong>: Counter sisa bahan berkurang.<br />
                  &bull; <strong className="text-white">Dashboard Monitoring</strong>: HPP / Food Cost terupdate otomatis.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
