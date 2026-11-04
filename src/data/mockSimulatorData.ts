import { RawMaterial, MenuItem, Order, KitchenTicket, StockTransaction, KitchenWasteLog } from '../types/inventory';

export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
  {
    sku: 'RAW-BERAS-01',
    name: 'Beras Pandan Wangi Super',
    category: 'Bahan Pokok',
    unit: 'kg',
    currentStock: 48.5,
    minStock: 15.0,
    safetyStock: 20.0,
    reorderPoint: 25.0,
    unitCost: 14500
  },
  {
    sku: 'RAW-WAGYU-01',
    name: 'Daging Wagyu Slice A5',
    category: 'Protein',
    unit: 'kg',
    currentStock: 5.2,
    minStock: 2.0,
    safetyStock: 3.0,
    reorderPoint: 4.5,
    unitCost: 280000
  },
  {
    sku: 'RAW-AYAM-01',
    name: 'Ayam Fillet Dada Paha',
    category: 'Protein',
    unit: 'kg',
    currentStock: 18.0,
    minStock: 6.0,
    safetyStock: 8.0,
    reorderPoint: 12.0,
    unitCost: 48000
  },
  {
    sku: 'RAW-TELUR-01',
    name: 'Telur Ayam Omega',
    category: 'Dairy & Telur',
    unit: 'butir',
    currentStock: 86,
    minStock: 30,
    safetyStock: 40,
    reorderPoint: 60,
    unitCost: 2200
  },
  {
    sku: 'RAW-KOPI-01',
    name: 'Biji Kopi House Blend',
    category: 'Bahan Pokok',
    unit: 'kg',
    currentStock: 6.8,
    minStock: 2.0,
    safetyStock: 2.5,
    reorderPoint: 3.5,
    unitCost: 165000
  },
  {
    sku: 'RAW-SUSU-01',
    name: 'Fresh Milk UHT Barista',
    category: 'Dairy & Telur',
    unit: 'liter',
    currentStock: 22.0,
    minStock: 8.0,
    safetyStock: 10.0,
    reorderPoint: 14.0,
    unitCost: 19500
  },
  {
    sku: 'RAW-MINYAK-01',
    name: 'Minyak Goreng Sawit',
    category: 'Bumbu & Saus',
    unit: 'liter',
    currentStock: 34.0,
    minStock: 10.0,
    safetyStock: 12.0,
    reorderPoint: 18.0,
    unitCost: 16000
  },
  {
    sku: 'RAW-BOX-01',
    name: 'Kemasan Kraft Box Takeaway',
    category: 'Packaging',
    unit: 'pcs',
    currentStock: 140,
    minStock: 40,
    safetyStock: 50,
    reorderPoint: 75,
    unitCost: 1200
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'MENU-NASGOR-WAGYU',
    code: 'NW01',
    name: 'Nasi Goreng Wagyu Royale',
    category: 'Makanan',
    price: 58000,
    bom: [
      { materialSku: 'RAW-BERAS-01', qty: 0.18, unit: 'kg' }, // 180 gram
      { materialSku: 'RAW-WAGYU-01', qty: 0.08, unit: 'kg' }, // 80 gram
      { materialSku: 'RAW-TELUR-01', qty: 1, unit: 'butir' },
      { materialSku: 'RAW-MINYAK-01', qty: 0.02, unit: 'liter' }
    ]
  },
  {
    id: 'MENU-AYAM-STEAK',
    code: 'AS02',
    name: 'Grilled Chicken Herb Steak',
    category: 'Makanan',
    price: 45000,
    bom: [
      { materialSku: 'RAW-AYAM-01', qty: 0.22, unit: 'kg' }, // 220 gram
      { materialSku: 'RAW-MINYAK-01', qty: 0.015, unit: 'liter' }
    ]
  },
  {
    id: 'MENU-ES-KOPI-AREN',
    code: 'KA03',
    name: 'Kopi Susu Gula Aren Barista',
    category: 'Minuman',
    price: 24000,
    bom: [
      { materialSku: 'RAW-KOPI-01', qty: 0.018, unit: 'kg' }, // 18 gram espresso
      { materialSku: 'RAW-SUSU-01', qty: 0.15, unit: 'liter' } // 150 ml
    ]
  },
  {
    id: 'MENU-NASGOR-AYAM',
    code: 'NA04',
    name: 'Nasi Goreng Ayam Suwir Spesial',
    category: 'Makanan',
    price: 36000,
    bom: [
      { materialSku: 'RAW-BERAS-01', qty: 0.18, unit: 'kg' },
      { materialSku: 'RAW-AYAM-01', qty: 0.09, unit: 'kg' },
      { materialSku: 'RAW-TELUR-01', qty: 1, unit: 'butir' },
      { materialSku: 'RAW-MINYAK-01', qty: 0.02, unit: 'liter' }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-2026-1001',
    tableNumber: 'Meja 03',
    orderType: 'DINE_IN',
    items: [
      {
        menuItemId: 'MENU-NASGOR-WAGYU',
        menuItemName: 'Nasi Goreng Wagyu Royale',
        quantity: 1,
        unitPrice: 58000,
        subtotal: 58000,
        bomConsumed: [
          { materialSku: 'RAW-BERAS-01', materialName: 'Beras Pandan Wangi', qtyPerUnit: 0.18, totalQty: 0.18, unit: 'kg' },
          { materialSku: 'RAW-WAGYU-01', materialName: 'Daging Wagyu Slice', qtyPerUnit: 0.08, totalQty: 0.08, unit: 'kg' },
          { materialSku: 'RAW-TELUR-01', materialName: 'Telur Ayam Omega', qtyPerUnit: 1, totalQty: 1, unit: 'butir' },
          { materialSku: 'RAW-MINYAK-01', materialName: 'Minyak Goreng Sawit', qtyPerUnit: 0.02, totalQty: 0.02, unit: 'liter' }
        ]
      },
      {
        menuItemId: 'MENU-ES-KOPI-AREN',
        menuItemName: 'Kopi Susu Gula Aren Barista',
        quantity: 2,
        unitPrice: 24000,
        subtotal: 48000,
        bomConsumed: [
          { materialSku: 'RAW-KOPI-01', materialName: 'Biji Kopi House Blend', qtyPerUnit: 0.018, totalQty: 0.036, unit: 'kg' },
          { materialSku: 'RAW-SUSU-01', materialName: 'Fresh Milk UHT Barista', qtyPerUnit: 0.15, totalQty: 0.3, unit: 'liter' }
        ]
      }
    ],
    totalAmount: 106000,
    cogsAmount: 34110,
    status: 'COOKING',
    createdAt: '10:05 WIB'
  }
];

export const INITIAL_KITCHEN_TICKETS: KitchenTicket[] = [
  {
    id: 'tkt-1001',
    orderId: 'ord-1001',
    orderNumber: 'ORD-2026-1001',
    tableNumber: 'Meja 03',
    orderType: 'Dine-In',
    items: [
      { name: '1x Nasi Goreng Wagyu Royale', qty: 1, notes: 'Pedas sedang, acar dipisah' },
      { name: '2x Kopi Susu Gula Aren Barista', qty: 2, notes: 'Less sugar, normal ice' }
    ],
    status: 'COOKING',
    createdAt: '10:05 WIB',
    startedAt: '10:06 WIB'
  }
];

export const INITIAL_TRANSACTIONS: StockTransaction[] = [
  {
    id: 'tx-001',
    type: 'IN_PURCHASE',
    materialSku: 'RAW-BERAS-01',
    materialName: 'Beras Pandan Wangi Super',
    qtyDelta: 50,
    unit: 'kg',
    batchNo: 'BATCH-BRS-261012',
    referenceDoc: 'PO-2026-8812',
    balanceAfter: 50.0,
    timestamp: '07:30 WIB',
    note: 'Penerimaan PO Supplier PT Sumber Pangan'
  },
  {
    id: 'tx-002',
    type: 'OUT_SALE',
    materialSku: 'RAW-BERAS-01',
    materialName: 'Beras Pandan Wangi Super',
    qtyDelta: -1.5,
    unit: 'kg',
    referenceDoc: 'ORD-2026-0994',
    balanceAfter: 48.5,
    timestamp: '09:45 WIB',
    note: 'Konsumsi Recipe BOM 8 Porsi Nasi Goreng'
  },
  {
    id: 'tx-003',
    type: 'OUT_SALE',
    materialSku: 'RAW-WAGYU-01',
    materialName: 'Daging Wagyu Slice A5',
    qtyDelta: -0.64,
    unit: 'kg',
    referenceDoc: 'ORD-2026-0994',
    balanceAfter: 5.2,
    timestamp: '09:45 WIB',
    note: 'Konsumsi Recipe BOM 8 Porsi Wagyu'
  }
];
