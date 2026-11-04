import React, { useState } from 'react';
import { 
  ShoppingCart, 
  ChefHat, 
  Warehouse, 
  LayoutDashboard, 
  Plus, 
  Minus, 
  Trash2, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Radio, 
  Flame, 
  PackageCheck, 
  Scale, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  X,
  Play,
  RotateCw,
  BellRing,
  Volume2,
  AlertOctagon,
  FileText,
  Send,
  Coffee,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { 
  INITIAL_RAW_MATERIALS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_KITCHEN_TICKETS, 
  INITIAL_TRANSACTIONS 
} from '../data/mockSimulatorData';
import { 
  RawMaterial, 
  MenuItem, 
  Order, 
  KitchenTicket, 
  StockTransaction, 
  KitchenWasteLog 
} from '../types/inventory';

export const InteractiveSimulator: React.FC = () => {
  // Simulator states
  const [activeTab, setActiveTab] = useState<'kasir' | 'dapur' | 'gudang' | 'dashboard'>('kasir');
  const [materials, setMaterials] = useState<RawMaterial[]>(INITIAL_RAW_MATERIALS);
  const [menuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [kitchenTickets, setKitchenTickets] = useState<KitchenTicket[]>(INITIAL_KITCHEN_TICKETS);
  const [transactions, setTransactions] = useState<StockTransaction[]>(INITIAL_TRANSACTIONS);
  const [wasteLogs, setWasteLogs] = useState<KitchenWasteLog[]>([]);

  // POS Cart State
  const [cart, setCart] = useState<{ [menuId: string]: number }>({
    'MENU-NASGOR-WAGYU': 1,
    'MENU-ES-KOPI-AREN': 1
  });
  const [tableNumber, setTableNumber] = useState('Meja 05');
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY' | 'ONLINE'>('DINE_IN');

  // Modals / forms
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showWasteModal, setShowWasteModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showOpnameModal, setShowOpnameModal] = useState(false);
  const [showInsufficientStockModal, setShowInsufficientStockModal] = useState(false);
  const [showDraftPoModal, setShowDraftPoModal] = useState(false);

  // KDS Station Filter
  const [kdsStation, setKdsStation] = useState<'ALL' | 'HOT_KITCHEN' | 'BARISTA'>('ALL');

  // Waste Form State
  const [selectedWasteSku, setSelectedWasteSku] = useState(materials[3]?.sku || 'RAW-TELUR-01');
  const [wasteQty, setWasteQty] = useState<number>(2);
  const [wasteReason, setWasteReason] = useState<'BURNT_COOKING' | 'DROPPED_SPILL' | 'EXPIRED' | 'QUALITY_REJECT'>('BURNT_COOKING');

  // Restock Form State
  const [restockSku, setRestockSku] = useState(materials[0]?.sku || 'RAW-BERAS-01');
  const [restockQty, setRestockQty] = useState<number>(20);

  // Helper Web Audio API synthetic chime bell ("Ting-Ting!")
  const playKitchenChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start(ctx.currentTime + 0.08);
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio fallback
    }
  };

  // Helper notification
  const triggerNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Cart operations
  const updateCartQty = (menuId: string, delta: number) => {
    setCart((prev) => {
      const current = prev[menuId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const { [menuId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [menuId]: next };
    });
  };

  // Calculate needed BOM for current cart
  const calculateNeededBom = () => {
    const required: { [sku: string]: { sku: string; name: string; needed: number; available: number; unit: string; ok: boolean } } = {};

    Object.entries(cart).forEach(([menuId, qty]) => {
      const menu = menuItems.find((m) => m.id === menuId);
      if (!menu) return;

      menu.bom.forEach((b) => {
        const mat = materials.find((m) => m.sku === b.materialSku);
        if (!mat) return;

        const needed = b.qty * qty;
        if (!required[b.materialSku]) {
          required[b.materialSku] = {
            sku: b.materialSku,
            name: mat.name,
            needed: needed,
            available: mat.currentStock,
            unit: mat.unit,
            ok: mat.currentStock >= needed
          };
        } else {
          required[b.materialSku].needed += needed;
          required[b.materialSku].ok = required[b.materialSku].available >= required[b.materialSku].needed;
        }
      });
    });

    return Object.values(required);
  };

  const neededBomList = calculateNeededBom();
  const hasInsufficientStock = neededBomList.some((item) => !item.ok);

  const cartTotal = Object.entries(cart).reduce((sum, [menuId, qty]) => {
    const item = menuItems.find((m) => m.id === menuId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  // Quick Trigger for "Out of Stock" simulation test
  const handleSimulateOutOfStock = () => {
    setCart({
      'MENU-NASGOR-WAGYU': 8 // Exceeds available wagyu (needs 0.64kg, but wagyu has less or depleted)
    });
    setShowInsufficientStockModal(true);
  };

  // Swap to alternative menu
  const handleSwapToAlternativeMenu = () => {
    setCart({
      'MENU-NASGOR-AYAM': 2,
      'MENU-ES-KOPI-AREN': 2
    });
    setShowInsufficientStockModal(false);
    triggerNotification('Keranjang diganti ke Nasi Goreng Ayam Suwir Spesial (Stok Ayam & Beras Cukup)!', 'info');
  };

  // 1. Process POS Order (Atomic checkout & stock deduction)
  const handleProcessOrder = () => {
    if (Object.keys(cart).length === 0) {
      triggerNotification('Keranjang pesanan masih kosong!', 'error');
      return;
    }

    if (hasInsufficientStock) {
      setShowInsufficientStockModal(true);
      return;
    }

    const orderId = `ord-${Date.now().toString().slice(-4)}`;
    const orderNo = `ORD-${Date.now().toString().slice(-4)}`;
    let totalCogs = 0;

    // Deduct stock in materials state
    const newMaterials = [...materials];
    const newTransactions: StockTransaction[] = [];

    neededBomList.forEach((req) => {
      const matIndex = newMaterials.findIndex((m) => m.sku === req.sku);
      if (matIndex >= 0) {
        const mat = newMaterials[matIndex];
        const newBalance = Math.max(0, Number((mat.currentStock - req.needed).toFixed(3)));
        newMaterials[matIndex] = {
          ...mat,
          currentStock: newBalance
        };

        const itemCogs = req.needed * mat.unitCost;
        totalCogs += itemCogs;

        newTransactions.unshift({
          id: `tx-${Date.now()}-${req.sku.slice(-4)}`,
          type: 'OUT_SALE',
          materialSku: mat.sku,
          materialName: mat.name,
          qtyDelta: -req.needed,
          unit: mat.unit,
          referenceDoc: orderNo,
          balanceAfter: newBalance,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
          note: `BOM Deduction untuk ${orderNo}`
        });
      }
    });

    setMaterials(newMaterials);
    setTransactions((prev) => [...newTransactions, ...prev].slice(0, 30));

    // Create Order Record
    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNo,
      tableNumber: orderType === 'DINE_IN' ? tableNumber : 'Takeaway',
      orderType,
      items: Object.entries(cart).map(([menuId, qty]) => {
        const m = menuItems.find((item) => item.id === menuId)!;
        return {
          menuItemId: m.id,
          menuItemName: m.name,
          quantity: qty,
          unitPrice: m.price,
          subtotal: m.price * qty,
          bomConsumed: m.bom.map((b) => {
            const mat = materials.find((mt) => mt.sku === b.materialSku)!;
            return {
              materialSku: b.materialSku,
              materialName: mat.name,
              qtyPerUnit: b.qty,
              totalQty: b.qty * qty,
              unit: b.unit
            };
          })
        };
      }),
      totalAmount: cartTotal,
      cogsAmount: totalCogs,
      status: 'COOKING',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Create Kitchen Ticket with Station Tags
    const newTicket: KitchenTicket = {
      id: `tkt-${Date.now().toString().slice(-4)}`,
      orderId,
      orderNumber: orderNo,
      tableNumber: orderType === 'DINE_IN' ? tableNumber : 'Takeaway',
      orderType: orderType === 'DINE_IN' ? 'Dine-In' : 'Takeaway',
      items: Object.entries(cart).map(([menuId, qty]) => {
        const m = menuItems.find((item) => item.id === menuId)!;
        return {
          name: `${qty}x ${m.name}`,
          qty,
          notes: m.category === 'Makanan' ? 'SOP Wajan Panas - Pedas Sedang' : 'Barista Special Blend'
        };
      }),
      status: 'COOKING',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      startedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };

    setKitchenTickets((prev) => [newTicket, ...prev]);

    // Play synthetic chime bell
    playKitchenChime();

    // Reset Cart
    setCart({});
    triggerNotification(`Pesanan ${orderNo} sukses! Resep BOM memotong stok, notifikasi Ting-Ting berbunyi di KDS Dapur.`);
  };

  // 2. Rollback / Void Last Order
  const handleVoidLastOrder = () => {
    if (orders.length === 0) return;
    const lastOrder = orders[0];
    if (lastOrder.status === 'VOID') {
      triggerNotification('Pesanan terakhir sudah dibatalkan sebelumnya.', 'info');
      return;
    }

    const newMaterials = [...materials];
    const newTransactions: StockTransaction[] = [];

    // Reconstruct items to restore
    lastOrder.items.forEach((item) => {
      item.bomConsumed.forEach((b) => {
        const matIdx = newMaterials.findIndex((m) => m.sku === b.materialSku);
        if (matIdx >= 0) {
          const mat = newMaterials[matIdx];
          const newBal = Number((mat.currentStock + b.totalQty).toFixed(3));
          newMaterials[matIdx] = {
            ...mat,
            currentStock: newBal
          };

          newTransactions.unshift({
            id: `tx-void-${Date.now()}-${b.materialSku.slice(-4)}`,
            type: 'VOID_ROLLBACK',
            materialSku: b.materialSku,
            materialName: b.materialName,
            qtyDelta: b.totalQty,
            unit: b.unit,
            referenceDoc: `VOID-${lastOrder.orderNumber}`,
            balanceAfter: newBal,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            note: `Rollback stok karena void order ${lastOrder.orderNumber}`
          });
        }
      });
    });

    setMaterials(newMaterials);
    setTransactions((prev) => [...newTransactions, ...prev].slice(0, 30));
    setOrders((prev) => prev.map((o) => (o.id === lastOrder.id ? { ...o, status: 'VOID' } : o)));
    setKitchenTickets((prev) => prev.filter((t) => t.orderId !== lastOrder.id));

    triggerNotification(`Order ${lastOrder.orderNumber} berhasil di-VOID. Stok telah dikembalikan ke gudang!`, 'info');
  };

  // 3. Kitchen Display System Actions
  const updateTicketStatus = (ticketId: string, nextStatus: 'COOKING' | 'READY') => {
    setKitchenTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: nextStatus } : t))
    );
    if (nextStatus === 'READY') {
      playKitchenChime();
      triggerNotification(`Pesanan #${ticketId} SIAP SAJI! Notifikasi getar terkirim ke Pramusaji/Runner untuk diantar ke meja.`);
    } else {
      triggerNotification(`Status Tiket #${ticketId} diupdate menjadi: ${nextStatus}`);
    }
  };

  // 4. Log Kitchen Waste / Spoilage
  const handleLogWaste = () => {
    const mat = materials.find((m) => m.sku === selectedWasteSku);
    if (!mat) return;

    if (wasteQty <= 0) {
      triggerNotification('Jumlah waste harus lebih dari 0', 'error');
      return;
    }

    const lossCost = wasteQty * mat.unitCost;
    const newStock = Math.max(0, Number((mat.currentStock - wasteQty).toFixed(3)));

    setMaterials((prev) =>
      prev.map((m) => (m.sku === mat.sku ? { ...m, currentStock: newStock } : m))
    );

    const wasteLog: KitchenWasteLog = {
      id: `wst-${Date.now()}`,
      materialSku: mat.sku,
      materialName: mat.name,
      qty: wasteQty,
      unit: mat.unit,
      reason: wasteReason,
      loggedBy: 'Chef Rudi',
      loggedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      estimatedCostLoss: lossCost
    };

    setWasteLogs((prev) => [wasteLog, ...prev]);

    const tx: StockTransaction = {
      id: `tx-waste-${Date.now()}`,
      type: 'OUT_WASTE',
      materialSku: mat.sku,
      materialName: mat.name,
      qtyDelta: -wasteQty,
      unit: mat.unit,
      referenceDoc: `WASTE-${wasteLog.id.slice(-4)}`,
      balanceAfter: newStock,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      note: `Bahan rusak/waste dapur: ${wasteReason}`
    };

    setTransactions((prev) => [tx, ...prev].slice(0, 30));
    setShowWasteModal(false);
    triggerNotification(`Kitchen Waste dicatat: ${wasteQty} ${mat.unit} ${mat.name} terbuang (-Rp ${lossCost.toLocaleString('id-ID')}). Stok fisik dipotong.`);
  };

  // 5. Goods In / Restock
  const handleRestock = () => {
    const mat = materials.find((m) => m.sku === restockSku);
    if (!mat) return;

    const newStock = Number((mat.currentStock + restockQty).toFixed(3));
    setMaterials((prev) =>
      prev.map((m) => (m.sku === mat.sku ? { ...m, currentStock: newStock } : m))
    );

    const tx: StockTransaction = {
      id: `tx-restock-${Date.now()}`,
      type: 'IN_PURCHASE',
      materialSku: mat.sku,
      materialName: mat.name,
      qtyDelta: restockQty,
      unit: mat.unit,
      referenceDoc: `PO-SUPP-${Date.now().toString().slice(-4)}`,
      balanceAfter: newStock,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      note: `Goods In restock supplier`
    };

    setTransactions((prev) => [tx, ...prev].slice(0, 30));
    setShowRestockModal(false);
    triggerNotification(`Goods In berhasil: +${restockQty} ${mat.unit} ${mat.name} ditambahkan ke saldo gudang.`);
  };

  // Quick reset to initial state
  const handleResetSimulator = () => {
    setMaterials(INITIAL_RAW_MATERIALS);
    setOrders(INITIAL_ORDERS);
    setKitchenTickets(INITIAL_KITCHEN_TICKETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setWasteLogs([]);
    setCart({
      'MENU-NASGOR-WAGYU': 1,
      'MENU-ES-KOPI-AREN': 1
    });
    triggerNotification('Simulasi berhasil di-reset ke kondisi awal.', 'info');
  };

  // Metrics for dashboard
  const totalStockValue = materials.reduce((acc, m) => acc + m.currentStock * m.unitCost, 0);
  const totalSalesRevenue = orders.filter((o) => o.status !== 'VOID').reduce((acc, o) => acc + o.totalAmount, 0);
  const totalCogsToday = orders.filter((o) => o.status !== 'VOID').reduce((acc, o) => acc + o.cogsAmount, 0);
  const totalWasteLoss = wasteLogs.reduce((acc, w) => acc + w.estimatedCostLoss, 0);
  const criticalItems = materials.filter((m) => m.currentStock <= m.reorderPoint);

  // Filter kitchen tickets
  const filteredTickets = kitchenTickets.filter((t) => {
    if (kdsStation === 'ALL') return true;
    if (kdsStation === 'HOT_KITCHEN') {
      return t.items.some((i) => i.name.toLowerCase().includes('nasi') || i.name.toLowerCase().includes('ayam') || i.name.toLowerCase().includes('wagyu'));
    }
    if (kdsStation === 'BARISTA') {
      return t.items.some((i) => i.name.toLowerCase().includes('kopi') || i.name.toLowerCase().includes('teh') || i.name.toLowerCase().includes('es'));
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-medium shadow-xl transition-all ${
          notification.type === 'error'
            ? 'bg-rose-950/90 border-rose-800 text-rose-200'
            : notification.type === 'info'
            ? 'bg-blue-950/90 border-blue-800 text-blue-200'
            : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Simulator Control Panel */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-emerald-700">Simulasi Terpadu</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-medium">Sinkronisasi Real-Time 4 Modul</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Simulator Operasional Inventaris Restoran
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Uji langsung kasus nyata: Stok Tidak Cukup (Conflict 409) → Tiket Masuk Dapur (KDS Audio Chime) → Catat Waste Masakan → Update Dashboard Live.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={handleSimulateOutOfStock}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-full transition-all shadow-xs"
              title="Simulasikan kasus saat stok bahan baku tidak mencukupi"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              <span>⚡ Uji Kasus: Stok Tidak Cukup</span>
            </button>

            <button
              onClick={handleResetSimulator}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all shadow-xs"
              title="Kembalikan data ke awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Interface Module Switcher Tabs */}
        <div className="mt-5 pt-4 border-t border-black/[0.04] grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() => setActiveTab('kasir')}
            className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'kasir'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'kasir' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white text-slate-600 shadow-xs'}`}>
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-xs font-bold ${activeTab === 'kasir' ? 'text-white' : 'text-slate-900'}`}>1. Interface Kasir (POS)</div>
              <div className={`text-[11px] ${activeTab === 'kasir' ? 'text-slate-300' : 'text-slate-400'}`}>Pesan Menu & Potong Stok</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('dapur')}
            className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'dapur'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'dapur' ? 'bg-rose-500 text-white font-bold' : 'bg-white text-slate-600 shadow-xs'}`}>
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-xs font-bold ${activeTab === 'dapur' ? 'text-white' : 'text-slate-900'}`}>2. Interface Dapur (KDS)</div>
              <div className={`text-[11px] ${activeTab === 'dapur' ? 'text-slate-300' : 'text-slate-400'}`}>{kitchenTickets.length} Tiket Antrean & Waste</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('gudang')}
            className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'gudang'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'gudang' ? 'bg-cyan-500 text-white font-bold' : 'bg-white text-slate-600 shadow-xs'}`}>
              <Warehouse className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-xs font-bold ${activeTab === 'gudang' ? 'text-white' : 'text-slate-900'}`}>3. Stok & Gudang</div>
              <div className={`text-[11px] ${activeTab === 'gudang' ? 'text-slate-300' : 'text-slate-400'}`}>Goods In, ROP & Opname</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                : 'bg-slate-50/80 border-black/[0.04] text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'dashboard' ? 'bg-indigo-500 text-white font-bold' : 'bg-white text-slate-600 shadow-xs'}`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-xs font-bold ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-900'}`}>4. Dashboard Monitoring</div>
              <div className={`text-[11px] ${activeTab === 'dashboard' ? 'text-slate-300' : 'text-slate-400'}`}>COGS, Alert ROP & Ledger</div>
            </div>
          </button>
        </div>
      </div>

      {/* MODUL 1: INTERFACE KASIR (POS) */}
      {activeTab === 'kasir' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Menu Catalog */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                <span>Pilih Menu Jualan Restoran</span>
              </h2>
              <span className="text-xs text-slate-400">BOM terhubung otomatis ke stok gudang</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menuItems.map((item) => {
                const count = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 font-semibold">{item.category}</span>
                        <span>{item.id}</span>
                      </div>
                      <h3 className="font-bold text-white text-sm">{item.name}</h3>
                      <div className="text-xs font-mono text-emerald-400 font-medium mt-1">
                        Rp {item.price.toLocaleString('id-ID')}
                      </div>

                      {/* Recipe BOM Ingredients preview */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300 block mb-1">Resep BOM per porsi:</span>
                        <div className="flex flex-wrap gap-1">
                          {item.bom.map((b) => {
                            const mat = materials.find((m) => m.sku === b.materialSku);
                            return (
                              <span key={b.materialSku} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px]">
                                {b.qty} {b.unit} {mat?.name.split(' ')[0]}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Jumlah:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQty(item.id, -1)}
                          disabled={count === 0}
                          className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-white">
                          {count}
                        </span>
                        <button
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-7 h-7 rounded bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-slate-950 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart & Real-time BOM Stock Check Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-amber-400" />
                  <h2 className="font-bold text-white text-sm">Keranjang & Validasi Stok Real-Time</h2>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {Object.keys(cart).length} Menu Dipilih
                </span>
              </div>

              {/* Order Options */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Nomor Meja</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tipe Pesanan</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="DINE_IN">Dine-In (Makan di Tempat)</option>
                    <option value="TAKEAWAY">Takeaway (Bungkus)</option>
                    <option value="ONLINE">Online Delivery</option>
                  </select>
                </div>
              </div>

              {/* Cart List */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {Object.keys(cart).length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-3">
                    Keranjang kosong. Pilih menu di sebelah kiri.
                  </p>
                ) : (
                  Object.entries(cart).map(([menuId, qty]) => {
                    const item = menuItems.find((m) => m.id === menuId);
                    if (!item) return null;
                    return (
                      <div key={menuId} className="flex items-center justify-between text-xs p-2 rounded bg-slate-950/60 border border-slate-800">
                        <div>
                          <span className="text-white font-medium">{item.name}</span>
                          <span className="text-slate-400 block text-[11px] font-mono">
                            {qty} x Rp {item.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <span className="font-mono font-semibold text-slate-200">
                          Rp {(item.price * qty).toLocaleString('id-ID')}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Live BOM Decomposition Breakdown */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Dekomposisi Bahan (BOM Engine):</span>
                  <span className="text-[11px] text-slate-400">Status Stok Gudang</span>
                </div>

                {neededBomList.length === 0 ? (
                  <span className="text-[11px] text-slate-500 italic block">Pilih menu untuk kalkulasi BOM</span>
                ) : (
                  <div className="space-y-1.5">
                    {neededBomList.map((item) => (
                      <div
                        key={item.sku}
                        className={`flex items-center justify-between text-[11px] p-1.5 rounded ${
                          item.ok ? 'bg-slate-900/60 text-slate-300' : 'bg-rose-950/60 border border-rose-800 text-rose-200 font-bold'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono">{item.sku.replace('RAW-', '')}:</span>
                          <span>{item.name}</span>
                        </div>
                        <div className="font-mono text-right">
                          <span className={item.ok ? 'text-amber-400' : 'text-rose-400 font-bold'}>
                            -{item.needed.toFixed(2)} {item.unit}
                          </span>
                          <span className="text-slate-500 ml-1">
                            (Sisa: {item.available.toFixed(1)})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total & Checkout Button */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Pembayaran:</span>
                  <span className="text-lg font-bold font-mono text-white">
                    Rp {cartTotal.toLocaleString('id-ID')}
                  </span>
                </div>

                {hasInsufficientStock && (
                  <div
                    onClick={() => setShowInsufficientStockModal(true)}
                    className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center justify-between gap-2 text-xs text-rose-200 cursor-pointer hover:bg-rose-900/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
                      <div>
                        <span className="font-bold block">Defisit Stok Terdeteksi (HTTP 409)!</span>
                        <span className="text-[11px] text-rose-300">Klik untuk melihat detail & tawarkan menu alternatif</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-400" />
                  </div>
                )}

                <button
                  onClick={handleProcessOrder}
                  disabled={Object.keys(cart).length === 0}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    hasInsufficientStock
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>
                    {hasInsufficientStock ? 'Lihat Peringatan Stok Tidak Cukup (409)' : 'Bayar & Eksekusi Atomic Stock Deduct'}
                  </span>
                </button>

                <button
                  onClick={handleVoidLastOrder}
                  className="w-full py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/30 border border-rose-900/40 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Simulasi Void Pesanan Terakhir (Rollback Stok)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODUL 2: INTERFACE DAPUR (KDS & WASTE) */}
      {activeTab === 'dapur' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-rose-400" />
                <span>Kitchen Display System (KDS) & Pemantauan Waktu Masak</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Tiket masuk otomatis sub-150ms via WebSocket saat kasir checkout, disertai audio chime lonceng "Ting-Ting!".
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <button
                onClick={playKitchenChime}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-lg transition-colors"
                title="Tes suara lonceng KDS saat pesanan baru tiba"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Tes Lonceng Dapur (Ting-Ting!)</span>
              </button>

              <button
                onClick={() => setShowWasteModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-sm"
              >
                <Flame className="w-4 h-4" />
                <span>Catat Waste / Masakan Gosong</span>
              </button>
            </div>
          </div>

          {/* Station Filter Tabs */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Filter Stasiun:</span>
            <button
              onClick={() => setKdsStation('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                kdsStation === 'ALL' ? 'bg-amber-500 text-slate-950' : 'bg-slate-850 text-slate-400 hover:text-white'
              }`}
            >
              Semua Stasiun ({kitchenTickets.length})
            </button>
            <button
              onClick={() => setKdsStation('HOT_KITCHEN')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                kdsStation === 'HOT_KITCHEN' ? 'bg-rose-500 text-white' : 'bg-slate-850 text-slate-400 hover:text-white'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Hot Kitchen (Makanan)</span>
            </button>
            <button
              onClick={() => setKdsStation('BARISTA')}
              className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                kdsStation === 'BARISTA' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-850 text-slate-400 hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Barista (Minuman)</span>
            </button>
          </div>

          {/* Active Kitchen Tickets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-xs">
                Tidak ada tiket antrean dapur aktif untuk stasiun ini. Buat pesanan baru di Interface Kasir!
              </div>
            ) : (
              filteredTickets.map((ticket, idx) => (
                <div
                  key={ticket.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all shadow-md ${
                    ticket.status === 'READY'
                      ? 'bg-slate-900/60 border-emerald-800/40 opacity-70'
                      : 'bg-slate-900 border-amber-500/50 ring-1 ring-amber-500/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {ticket.orderNumber}
                        </span>
                        <span className="text-xs text-white font-bold ml-2">({ticket.tableNumber})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">
                          Timer: 0{idx + 3}:24
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ticket.status === 'READY'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400 animate-pulse'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {ticket.items.map((item, i) => (
                        <div key={i} className="text-xs p-2 rounded bg-slate-950/60 border border-slate-800/70">
                          <div className="text-white font-semibold text-sm">{item.name}</div>
                          {item.notes && (
                            <div className="text-[11px] text-amber-300 italic mt-0.5">Catatan: {item.notes}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs gap-2">
                    <button
                      onClick={() => {
                        setSelectedWasteSku(materials[1]?.sku || 'RAW-WAGYU-01');
                        setShowWasteModal(true);
                      }}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Laporkan Gosong</span>
                    </button>

                    {ticket.status === 'COOKING' ? (
                      <button
                        onClick={() => updateTicketStatus(ticket.id, 'READY')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Selesai Saji (Panggil Runner)</span>
                      </button>
                    ) : (
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Makanan Siap di Pass-Bar</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Waste Logs Audit Table */}
          {wasteLogs.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>Log Pencatatan Bahan Terbuang (Kitchen Waste) Hari Ini</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Bahan Baku</th>
                      <th className="py-2 px-3">Jumlah Waste</th>
                      <th className="py-2 px-3">Alasan Kerusakan</th>
                      <th className="py-2 px-3">Taksiran Kerugian (Rp)</th>
                      <th className="py-2 px-3">Waktu Log</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {wasteLogs.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-850">
                        <td className="py-2 px-3 font-medium text-white">{w.materialName}</td>
                        <td className="py-2 px-3 font-mono text-rose-400 font-bold">-{w.qty} {w.unit}</td>
                        <td className="py-2 px-3 text-slate-300">{w.reason}</td>
                        <td className="py-2 px-3 font-mono text-slate-300">Rp {w.estimatedCostLoss.toLocaleString('id-ID')}</td>
                        <td className="py-2 px-3 text-slate-500 font-mono">{w.loggedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODUL 3: STOK & GUDANG (INVENTORY) */}
      {activeTab === 'gudang' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Warehouse className="w-5 h-5 text-blue-400" />
                <span>Manajemen Stok Gudang & Restock</span>
              </h2>
              <p className="text-xs text-slate-400">
                Penerimaan barang (Goods In), kontrol Reorder Point (ROP), dan audit Stock Opname fisik.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setShowRestockModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Goods In (Restock PO)</span>
              </button>
              <button
                onClick={() => setShowOpnameModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Stock Opname Fisik</span>
              </button>
            </div>
          </div>

          {/* Raw Materials Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">SKU / Nama Bahan</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3 text-right">Stok Riil Fisik</th>
                    <th className="py-3 px-3 text-right">Safety Stock</th>
                    <th className="py-3 px-3 text-right">Reorder Point (ROP)</th>
                    <th className="py-3 px-3 text-right">Harga Satuan</th>
                    <th className="py-3 px-4 text-center">Status Kesehatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {materials.map((m) => {
                    const isBelowSafety = m.currentStock <= m.safetyStock;
                    const isBelowRop = m.currentStock <= m.reorderPoint;

                    return (
                      <tr key={m.sku} className="hover:bg-slate-850/60 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-[11px] text-amber-400 block font-semibold">{m.sku}</span>
                          <span className="font-medium text-white text-xs">{m.name}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-400">{m.category}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-white">
                          {m.currentStock.toFixed(2)} {m.unit}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">
                          {m.safetyStock} {m.unit}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">
                          {m.reorderPoint} {m.unit}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">
                          Rp {m.unitCost.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isBelowSafety ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              KRITIS &lt; SAFETY
                            </span>
                          ) : isBelowRop ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              PERLU REORDER (ROP)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                              AMAN
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODUL 4: DASHBOARD MONITORING & AUDIT */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-purple-400" />
                <span>Dashboard Monitoring Real-Time & Ledger Audit</span>
              </h2>
              <p className="text-xs text-slate-400">
                Transparansi omset, HPP aktual (COGS), kerugian waste, dan buku besar transaksi per detik.
              </p>
            </div>

            {criticalItems.length > 0 && (
              <button
                onClick={() => setShowDraftPoModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm self-start sm:self-auto"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Review & Kirim Draf PO ({criticalItems.length} Bahan)</span>
              </button>
            )}
          </div>

          {/* Critical Items Alert Banner */}
          {criticalItems.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <div>
                  <span className="text-xs font-bold text-rose-300 block">
                    Peringatan Reorder Point (ROP): {criticalItems.length} Bahan Baku Menipis!
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Bahan: {criticalItems.map((m) => `${m.name} (Sisa ${m.currentStock} ${m.unit})`).join(', ')}.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDraftPoModal(true)}
                className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 shadow-sm"
              >
                Buka Draf Purchase Order
              </button>
            </div>
          )}

          {/* Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 block mb-1">Total Nilai Persediaan</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-white">
                Rp {totalStockValue.toLocaleString('id-ID')}
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Saldo fisik di gudang & chiller</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 block mb-1">COGS / HPP Bahan Terpakai</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                Rp {totalCogsToday.toLocaleString('id-ID')}
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Food Cost: {totalSalesRevenue > 0 ? ((totalCogsToday / totalSalesRevenue) * 100).toFixed(1) : '0'}% dari omset
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 block mb-1">Total Waste Dapur (Rugi)</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-rose-400">
                Rp {totalWasteLoss.toLocaleString('id-ID')}
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">{wasteLogs.length} insiden kerusakan</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
              <span className="text-xs text-slate-400 block mb-1">Alert Stok Kritis (ROP)</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-amber-400">
                {criticalItems.length} Bahan
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">Memicu auto draft purchase order</span>
            </div>
          </div>

          {/* General Stock Ledger (Buku Besar Mutasi Real-time) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">General Stock Ledger (Live Event Bus)</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {transactions.length} Mutasi Tercatat
              </span>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 border-b border-slate-800 sticky top-0 bg-slate-900">
                  <tr>
                    <th className="py-2 px-3">Tipe Mutasi</th>
                    <th className="py-2 px-3">Bahan Baku</th>
                    <th className="py-2 px-3 text-right">Delta Qty</th>
                    <th className="py-2 px-3 text-right">Saldo Akhir</th>
                    <th className="py-2 px-3">Dokumen Referensi</th>
                    <th className="py-2 px-3">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {transactions.map((tx) => {
                    const isPositive = tx.qtyDelta > 0;
                    return (
                      <tr key={tx.id} className="hover:bg-slate-850">
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'IN_PURCHASE'
                              ? 'bg-blue-500/20 text-blue-400'
                              : tx.type === 'OUT_SALE'
                              ? 'bg-amber-500/20 text-amber-400'
                              : tx.type === 'OUT_WASTE'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans font-medium text-white">{tx.materialName}</td>
                        <td className={`py-2 px-3 text-right font-bold ${isPositive ? 'text-blue-400' : 'text-amber-400'}`}>
                          {isPositive ? `+${tx.qtyDelta}` : tx.qtyDelta} {tx.unit}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-300">
                          {tx.balanceAfter.toFixed(2)} {tx.unit}
                        </td>
                        <td className="py-2 px-3 text-slate-400 font-sans">{tx.referenceDoc}</td>
                        <td className="py-2 px-3 text-slate-500">{tx.timestamp}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP MODAL: KASUS STOK TIDAK CUKUP (HTTP 409 CONFLICT) */}
      {showInsufficientStockModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-600 rounded-xl p-5 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-rose-900/50 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    HTTP 409 Conflict: Stok Bahan Baku Tidak Cukup!
                  </h3>
                  <span className="text-xs text-rose-300 font-mono">ErrorCode: INSUFFICIENT_STOCK</span>
                </div>
              </div>
              <button onClick={() => setShowInsufficientStockModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Sistem menolak pesanan ini untuk melindungi integritas transaksi restoran Anda:
              </p>

              {/* Deficit list */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-300 block text-[11px] uppercase tracking-wider">
                  Rincian Bahan Baku yang Defisit:
                </span>
                {neededBomList.filter((m) => !m.ok).map((item) => (
                  <div key={item.sku} className="p-2 rounded bg-rose-950/40 border border-rose-800/40 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{item.name}</span>
                      <span className="text-[11px] text-slate-400 block font-mono">Dibutuhkan: {item.needed.toFixed(2)} {item.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-rose-400 font-bold font-mono block">
                        Defisit: -{(item.needed - item.available).toFixed(2)} {item.unit}
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono">
                        Tersedia: {item.available.toFixed(2)} {item.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Database Protection Note */}
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Jaminan Database ACID Rollback:</span>
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Perintah <code>ROLLBACK;</code> telah dieksekusi. Bahan lain yang mencukupi (seperti Beras dan Telur) <strong>TIDAK terpotong sedikitpun</strong>. Saldo stok 100% aman dan akurat!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <span className="font-bold text-white text-xs block">Rekomendasi Tindakan Kasir:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleSwapToAlternativeMenu}
                    className="p-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold text-left transition-colors shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <span>Tawarkan Menu Pengganti</span>
                      <span className="text-[10px] text-slate-800 block font-normal">Ganti ke Nasi Goreng Ayam Suwir</span>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0 ml-1" />
                  </button>

                  <button
                    onClick={() => {
                      setShowInsufficientStockModal(false);
                      setShowDraftPoModal(true);
                    }}
                    className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span>Picu Emergency PO</span>
                      <span className="text-[10px] text-slate-400 block font-normal">Kirim alert restock ke supplier</span>
                    </div>
                    <Send className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowInsufficientStockModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                Tutup Notifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP MODAL: DRAFT PURCHASE ORDER (PO) SUPLIER */}
      {showDraftPoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    Draf Purchase Order Otomatis (Auto-PO)
                  </h3>
                  <span className="text-xs text-slate-400">Pemesanan Bahan Baku ke Supplier Berdasarkan Ambang ROP</span>
                </div>
              </div>
              <button onClick={() => setShowDraftPoModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Nomor Dokumen:</span>
                  <span className="font-mono text-amber-400 font-bold">PO-RESTO-2026-OCT-109</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Vendor Supplier:</span>
                  <span className="text-white font-medium">PT Sumber Boga Segar Utama (Supplier Resmi)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Metode Pengiriman:</span>
                  <span className="text-emerald-400 font-medium">Same-Day Chilled Logistic (Truk Dingin)</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 block">Daftar Bahan yang Dipesan:</span>
                <div className="divide-y divide-slate-800 bg-slate-950 rounded-lg p-2 border border-slate-800">
                  <div className="py-1.5 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-white block">Daging Wagyu Slice (RAW-WAGYU-01)</span>
                      <span className="text-[10px] text-slate-400">Rekomendasi Reorder: 10 kg</span>
                    </div>
                    <span className="font-mono text-slate-200">Rp 2.800.000</span>
                  </div>
                  <div className="py-1.5 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-white block">Telur Ayam Negeri Fresh (RAW-TELUR-01)</span>
                      <span className="text-[10px] text-slate-400">Rekomendasi Reorder: 150 butir</span>
                    </div>
                    <span className="font-mono text-slate-200">Rp 330.000</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Saat tombol diklik, pesan draf PO akan dikirimkan otomatis via WhatsApp Bisnis / Email Supplier.</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDraftPoModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setShowDraftPoModal(false);
                  triggerNotification('Draf PO-RESTO-2026-OCT-109 telah dikirimkan ke Supplier via WhatsApp/Email API!', 'success');
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Approve & Kirim PO ke Supplier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kitchen Waste */}
      {showWasteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>Pencatatan Bahan Rusak / Waste Dapur</span>
              </h3>
              <button onClick={() => setShowWasteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Pilih Bahan Baku yang Terbuang</label>
                <select
                  value={selectedWasteSku}
                  onChange={(e) => setSelectedWasteSku(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-rose-500 focus:outline-none"
                >
                  {materials.map((m) => (
                    <option key={m.sku} value={m.sku}>
                      {m.name} (Tersedia: {m.currentStock} {m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Jumlah Terbuang</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={wasteQty}
                  onChange={(e) => setWasteQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Alasan Kerusakan / Spoilage</label>
                <select
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-rose-500 focus:outline-none"
                >
                  <option value="BURNT_COOKING">Gosong saat dimasak (Burnt)</option>
                  <option value="DROPPED_SPILL">Jatuh / Tumpah di lantai (Spill)</option>
                  <option value="EXPIRED">Sudah kadaluarsa / Bau (Expired)</option>
                  <option value="QUALITY_REJECT">Kualitas ditolak koki (Quality Reject)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowWasteModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleLogWaste}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md"
              >
                Potong Stok & Simpan Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Restock Goods In */}
      {showRestockModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-blue-400" />
                <span>Goods In Penerimaan Supplier (PO)</span>
              </h3>
              <button onClick={() => setShowRestockModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Bahan Baku Masuk</label>
                <select
                  value={restockSku}
                  onChange={(e) => setRestockSku(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  {materials.map((m) => (
                    <option key={m.sku} value={m.sku}>
                      {m.name} ({m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Jumlah Masuk (Diterima)</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300">
                Otomatis membuat registrasi nomor batch FIFO baru dan memperbarui sisa stok secara real-time.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowRestockModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleRestock}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md"
              >
                Konfirmasi Penerimaan Barang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Stock Opname Fisik */}
      {showOpnameModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Simulasi Stock Opname Fisik</span>
              </h3>
              <button onClick={() => setShowOpnameModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Bandingkan stok fisik hasil timbangan manual staf dengan stok teoritis sistem untuk mendeteksi varians/kebocoran.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {materials.slice(0, 4).map((m) => (
                <div key={m.sku} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">{m.name}</span>
                    <span className="text-[11px] text-slate-400">Stok Sistem: {m.currentStock.toFixed(2)} {m.unit}</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-slate-900 text-amber-300 font-mono text-xs border border-slate-700">
                    Fisik Sesuai (Toleransi &plusmn;0%)
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setShowOpnameModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300"
              >
                Tutup Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
