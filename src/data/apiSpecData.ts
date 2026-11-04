import { ApiEndpointSpec } from '../types/inventory';

export const API_ENDPOINTS: ApiEndpointSpec[] = [
  {
    id: 'api-checkout',
    title: 'POS Order Checkout & Atomic BOM Stock Deduction',
    method: 'POST',
    path: '/api/v1/orders/checkout',
    module: 'kasir',
    description: 'Menerima transaksi kasir, memecah pesanan berdasarkan recipe BOM, memvalidasi ketersediaan stok fisik di gudang, melakukan pengurangan stok atomik, dan menerbitkan tiket dapur.',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <cashier_jwt_token>',
      'Idempotency-Key': 'uuid-v4-client-generated-key',
      'X-Station-Id': 'POS-COUNTER-01'
    },
    requestBody: JSON.stringify({
      orderNumber: "ORD-2026-1049",
      orderType: "DINE_IN",
      tableNumber: "T-07",
      paymentMethod: "QRIS",
      customerName: "Bpk. Hendra",
      items: [
        {
          menuItemId: "MENU-NASGOR-WAGYU",
          quantity: 2,
          unitPrice: 55000,
          notes: "Tingkat kepedasan level 3, tanpa acar"
        },
        {
          menuItemId: "MENU-ES-KOPI-AREN",
          quantity: 2,
          unitPrice: 22000,
          notes: "Less ice, normal sugar"
        }
      ]
    }, null, 2),
    responses: [
      {
        status: 201,
        description: 'Order berhasil dibuat, stok bahan baku terpotong atomik, tiket KDS diterbitkan.',
        body: JSON.stringify({
          status: "SUCCESS",
          orderId: "ord_882910fa",
          orderNumber: "ORD-2026-1049",
          totalAmount: 154000,
          cogsAmount: 46200,
          kitchenTicketId: "tkt_551928ab",
          stockDeductedSummary: [
            { materialSku: "RAW-BERAS-01", name: "Beras Pandan Wangi", qtyDeducted: 360, unit: "gram", remainingStock: 48.2 },
            { materialSku: "RAW-WAGYU-01", name: "Daging Wagyu Slice", qtyDeducted: 200, unit: "gram", remainingStock: 4.8 },
            { materialSku: "RAW-TELUR-01", name: "Telur Ayam Omega", qtyDeducted: 2, unit: "butir", remainingStock: 86 },
            { materialSku: "RAW-KOPI-01", name: "Biji Kopi House Blend", qtyDeducted: 36, unit: "gram", remainingStock: 6.2 },
            { materialSku: "RAW-SUSU-01", name: "Fresh Milk UHT", qtyDeducted: 300, unit: "ml", remainingStock: 18.5 }
          ],
          timestamp: "2026-10-14T10:14:22Z"
        }, null, 2)
      },
      {
        status: 409,
        description: 'Conflict / Insufficient Stock: Bahan baku tidak cukup untuk memenuhi pesanan.',
        body: JSON.stringify({
          status: "ERROR",
          errorCode: "INSUFFICIENT_STOCK",
          message: "Tidak dapat memproses pesanan. Terdapat bahan baku yang habis atau tidak mencukupi di gudang.",
          insufficientMaterials: [
            {
              materialSku: "RAW-WAGYU-01",
              materialName: "Daging Wagyu Slice",
              requiredQty: 200,
              availableStock: 80,
              unit: "gram",
              deficit: 120
            }
          ],
          timestamp: "2026-10-14T10:14:23Z"
        }, null, 2)
      }
    ],
    websocketEvents: [
      {
        event: 'KITCHEN_TICKET_CREATED',
        direction: 'Server to Client',
        payload: JSON.stringify({ ticketId: "tkt_551928ab", orderNumber: "ORD-2026-1049", table: "T-07", items: ["2x Nasi Goreng Wagyu", "2x Es Kopi Aren"] }),
        targetInterfaces: ['Dapur (KDS)', 'Bar Station']
      },
      {
        event: 'STOCK_UPDATED',
        direction: 'Server to Client',
        payload: JSON.stringify({ updatedSkus: ["RAW-BERAS-01", "RAW-WAGYU-01", "RAW-TELUR-01", "RAW-KOPI-01", "RAW-SUSU-01"], source: "POS_SALE" }),
        targetInterfaces: ['Stok & Gudang', 'Dashboard Monitoring']
      }
    ]
  },
  {
    id: 'api-void',
    title: 'Void Order & Stock Rollback',
    method: 'POST',
    path: '/api/v1/orders/{orderId}/void',
    module: 'kasir',
    description: 'Membatalkan pesanan yang belum dimasak atau pesanan keliru, mengembalikan stok bahan baku ke gudang secara otomatis (Inventory Rollback), dan membatalkan tiket KDS.',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <supervisor_jwt_token>'
    },
    requestBody: JSON.stringify({
      voidReason: "CUSTOMER_CANCELLED",
      notes: "Pelanggan salah pesan dan mengganti ke meja lain",
      approvedBySupervisorPin: "9921"
    }, null, 2),
    responses: [
      {
        status: 200,
        description: 'Order berhasil dibatalkan dan stok seluruh bahan dikembalikan ke batch asal.',
        body: JSON.stringify({
          status: "SUCCESS",
          orderId: "ord_882910fa",
          orderStatus: "VOID",
          restoredMaterials: [
            { materialSku: "RAW-BERAS-01", restoredQty: 360, unit: "gram", currentBalance: 48.56 },
            { materialSku: "RAW-WAGYU-01", restoredQty: 200, unit: "gram", currentBalance: 5.0 },
            { materialSku: "RAW-TELUR-01", restoredQty: 2, unit: "butir", currentBalance: 88 }
          ]
        }, null, 2)
      }
    ]
  },
  {
    id: 'api-kitchen-waste',
    title: 'Log Kitchen Waste / Spoilage / Spill',
    method: 'POST',
    path: '/api/v1/kitchen/waste',
    module: 'dapur',
    description: 'Mencatat bahan baku yang rusak, gosong, tumpah, atau kadaluarsa di area dapur saat proses persiapan memasak.',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <chef_jwt_token>',
      'X-Kitchen-Station': 'HOT_KITCHEN_LINE_1'
    },
    requestBody: JSON.stringify({
      materialSku: "RAW-TELUR-01",
      quantity: 3,
      unit: "butir",
      reason: "BURNT_COOKING",
      notes: "Telur mata sapi gosong karena wajan terlalu panas saat rush hour",
      loggedBy: "Chef Junaedi"
    }, null, 2),
    responses: [
      {
        status: 201,
        description: 'Waste berhasil dicatat, stok fisik dipotong di database, dan beban kerugian dibukukan ke laporan HPP.',
        body: JSON.stringify({
          status: "SUCCESS",
          wasteLogId: "wst_771829",
          materialSku: "RAW-TELUR-01",
          materialName: "Telur Ayam Omega",
          qtyDeducted: 3,
          estimatedLossRp: 6000,
          currentRemainingStock: 85,
          timestamp: "2026-10-14T10:28:11Z"
        }, null, 2)
      }
    ],
    websocketEvents: [
      {
        event: 'STOCK_UPDATED',
        direction: 'Server to Client',
        payload: JSON.stringify({ materialSku: "RAW-TELUR-01", newStock: 85, delta: -3, trigger: "KITCHEN_WASTE" }),
        targetInterfaces: ['Stok & Gudang', 'Dashboard Monitoring']
      }
    ]
  },
  {
    id: 'api-goods-in',
    title: 'Goods In / PO Receiving (FIFO Batch Registration)',
    method: 'POST',
    path: '/api/v1/inventory/goods-in',
    module: 'gudang',
    description: 'Mencatat penerimaan barang dari supplier, meregistrasi nomor batch fisik baru, mencatat tanggal kadaluarsa (FEFO support), serta memperbarui saldo stok dan harga pokok pembelian rata-rata.',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <warehouse_jwt_token>'
    },
    requestBody: JSON.stringify({
      poNumber: "PO-2026-OCT-091",
      supplierId: "SUP-PANGAN-PRIMA",
      receivedAt: "2026-10-14T08:00:00Z",
      invoiceNumber: "INV-SUP-88910",
      items: [
        {
          materialSku: "RAW-BERAS-01",
          batchNo: "BATCH-BRS-261014-A",
          qtyReceived: 50,
          unitCost: 14500,
          expiryDate: "2027-04-14",
          storageLocation: "DRY_STORAGE_RACK_A1"
        },
        {
          materialSku: "RAW-TELUR-01",
          batchNo: "BATCH-TLR-261014-C",
          qtyReceived: 100,
          unitCost: 2000,
          expiryDate: "2026-10-28",
          storageLocation: "CHILLER_WALK_IN_02"
        }
      ]
    }, null, 2),
    responses: [
      {
        status: 201,
        description: 'Barang berhasil diterima, batch baru terdaftar, stok bertambah secara instan.',
        body: JSON.stringify({
          status: "SUCCESS",
          goodsInReceiptId: "gr_2026_9941",
          totalItemsReceived: 2,
          totalInventoryValueAdded: 925000,
          updatedBatches: [
            { batchId: "btc_brs_01", materialSku: "RAW-BERAS-01", newBalance: 98.2 },
            { batchId: "btc_tlr_01", materialSku: "RAW-TELUR-01", newBalance: 185 }
          ]
        }, null, 2)
      }
    ]
  },
  {
    id: 'api-stock-opname',
    title: 'Stock Opname & Variance Reconciliation',
    method: 'POST',
    path: '/api/v1/inventory/stock-opname',
    module: 'gudang',
    description: 'Menyimpan hasil audit fisik persediaan di rak vs saldo teoritis sistem, menghitung nilai varians selisih, dan melakukan penyesuaian otomatis dengan jejak audit.',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <auditor_jwt_token>'
    },
    requestBody: JSON.stringify({
      auditSessionName: "Opname Mingguan Shift Pagi 14 Okt 2026",
      auditorName: "Rudi Hartono (Head Store)",
      countedItems: [
        {
          materialSku: "RAW-BERAS-01",
          physicalCount: 48.0,
          theoreticalStock: 48.2,
          discrepancyReason: "NORMAL_SCALE_TOLERANCE",
          notes: "Toleransi timbangan karung beras 200 gram"
        },
        {
          materialSku: "RAW-WAGYU-01",
          physicalCount: 4.8,
          theoreticalStock: 4.8,
          discrepancyReason: "PERFECT_MATCH",
          notes: "Stok fisik cocok 100%"
        }
      ]
    }, null, 2),
    responses: [
      {
        status: 200,
        description: 'Audit tersimpan, transaksi ADJUSTMENT_OPNAME dibuat, laporan varians diterbitkan.',
        body: JSON.stringify({
          status: "SUCCESS",
          auditId: "adt_2026_104",
          varianceSummary: {
            totalItemsAudited: 2,
            itemsWithVariance: 1,
            netVarianceValueRp: -2900,
            status: "APPROVED_WITHIN_TOLERANCE"
          }
        }, null, 2)
      }
    ]
  },
  {
    id: 'api-realtime-status',
    title: 'Real-time Stock Level & ROP Alert Status',
    method: 'GET',
    path: '/api/v1/inventory/realtime-status',
    module: 'dashboard',
    description: 'Mengambil ringkasan stok real-time seluruh bahan baku, status keselamatan stok (Normal, Warning ROP, Kritis), serta estimasi hari sebelum kehabisan.',
    headers: {
      'Authorization': 'Bearer <manager_jwt_token>'
    },
    responses: [
      {
        status: 200,
        description: 'Daftar status bahan baku terkini dengan kalkulasi lead time.',
        body: JSON.stringify({
          status: "SUCCESS",
          timestamp: "2026-10-14T10:35:00Z",
          totalMaterialsCount: 18,
          criticalAlertsCount: 2,
          materials: [
            {
              sku: "RAW-WAGYU-01",
              name: "Daging Wagyu Slice",
              currentStock: 4.8,
              unit: "kg",
              safetyStock: 3.0,
              reorderPoint: 5.0,
              stockStatus: "WARNING_ROP",
              estimatedDaysRemaining: 1.4,
              recommendedOrderQty: 15.0
            },
            {
              sku: "RAW-TELUR-01",
              name: "Telur Ayam Omega",
              currentStock: 85,
              unit: "butir",
              safetyStock: 40,
              reorderPoint: 80,
              stockStatus: "NORMAL",
              estimatedDaysRemaining: 4.2
            }
          ]
        }, null, 2)
      }
    ]
  }
];
