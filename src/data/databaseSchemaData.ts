import { DbTableSpec } from '../types/inventory';

export const DB_TABLES: DbTableSpec[] = [
  {
    name: 'raw_materials',
    description: 'Master data bahan baku mentah (ingredient) yang dikelola di restoran.',
    primaryKey: 'sku',
    columns: [
      { name: 'sku', type: 'VARCHAR(64)', nullable: false, description: 'Kode unik bahan baku (e.g., RAW-BERAS-01)' },
      { name: 'name', type: 'VARCHAR(150)', nullable: false, description: 'Nama resmi bahan baku (e.g., Beras Pandan Wangi)' },
      { name: 'category', type: 'VARCHAR(50)', nullable: false, description: 'Kategori (Protein, Bumbu, Dairy, Bahan Pokok, Packaging)' },
      { name: 'unit', type: 'VARCHAR(20)', nullable: false, description: 'Satuan standar stok (kg, gram, butir, liter, ml, pcs)' },
      { name: 'current_stock', type: 'NUMERIC(14, 4)', nullable: false, description: 'Jumlah stok fisik aktual saat ini (terkini)' },
      { name: 'safety_stock', type: 'NUMERIC(14, 4)', nullable: false, description: 'Batas cadangan minimum darurat' },
      { name: 'reorder_point', type: 'NUMERIC(14, 4)', nullable: false, description: 'Titik pemesanan ulang (ROP = Lead Time Demand + Safety Stock)' },
      { name: 'unit_cost', type: 'NUMERIC(12, 2)', nullable: false, description: 'Harga pokok pembelian rata-rata per satuan (Moving Average Cost)' },
      { name: 'storage_temp', type: 'VARCHAR(30)', nullable: true, description: 'Suhu penyimpanan (Dry, Chiller 0-4C, Frozen -18C)' },
      { name: 'version', type: 'INT', nullable: false, description: 'Version lock column untuk optimis concurrency control' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_raw_materials_sku ON raw_materials(sku);',
      'CREATE INDEX idx_raw_materials_category ON raw_materials(category);',
      'CREATE INDEX idx_raw_materials_rop ON raw_materials(current_stock, reorder_point);'
    ]
  },
  {
    name: 'stock_batches',
    description: 'Pencatatan lot/batch penerimaan barang untuk mendukung algoritma konsumsi FIFO & FEFO (First-Expired, First-Out).',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, description: 'Primary key unik batch' },
      { name: 'material_sku', type: 'VARCHAR(64)', nullable: false, description: 'Foreign key ke raw_materials.sku', isForeignKey: true, foreignTable: 'raw_materials' },
      { name: 'batch_no', type: 'VARCHAR(80)', nullable: false, description: 'Nomor batch supplier atau kode lot internal' },
      { name: 'po_number', type: 'VARCHAR(80)', nullable: false, description: 'Nomor Purchase Order saat barang diterima' },
      { name: 'qty_received', type: 'NUMERIC(14, 4)', nullable: false, description: 'Jumlah awal barang saat diterima' },
      { name: 'qty_remaining', type: 'NUMERIC(14, 4)', nullable: false, description: 'Sisa stok pada batch ini yang belum terkonsumsi' },
      { name: 'purchase_cost', type: 'NUMERIC(12, 2)', nullable: false, description: 'Harga beli per unit pada batch ini' },
      { name: 'expiry_date', type: 'DATE', nullable: false, description: 'Tanggal kadaluarsa bahan baku (krusial untuk FEFO)' },
      { name: 'received_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Waktu penerimaan barang masuk ke gudang' }
    ],
    indexes: [
      'CREATE INDEX idx_stock_batches_material_expiry ON stock_batches(material_sku, expiry_date ASC, qty_remaining) WHERE qty_remaining > 0;'
    ]
  },
  {
    name: 'menu_items',
    description: 'Daftar produk makanan dan minuman siap saji yang dijual ke pelanggan melalui kasir.',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'VARCHAR(64)', nullable: false, description: 'Kode unik menu (e.g., MENU-NASGOR-WAGYU)' },
      { name: 'code', type: 'VARCHAR(30)', nullable: false, description: 'Shortcode kasir (e.g., NW01)' },
      { name: 'name', type: 'VARCHAR(150)', nullable: false, description: 'Nama menu lengkap' },
      { name: 'category', type: 'VARCHAR(50)', nullable: false, description: 'Kategori (Makanan Utama, Minuman, Dessert)' },
      { name: 'selling_price', type: 'NUMERIC(12, 2)', nullable: false, description: 'Harga jual ke konsumen (Rp)' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Status aktif menu di POS' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_menu_items_id ON menu_items(id);',
      'CREATE INDEX idx_menu_items_category ON menu_items(category);'
    ]
  },
  {
    name: 'recipe_boms',
    description: 'Bill of Materials (BOM) / formula takaran bahan baku baku per 1 porsi menu jualan.',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'BIGSERIAL', nullable: false, description: 'Primary key relasi BOM' },
      { name: 'menu_item_id', type: 'VARCHAR(64)', nullable: false, description: 'Foreign key ke menu_items.id', isForeignKey: true, foreignTable: 'menu_items' },
      { name: 'material_sku', type: 'VARCHAR(64)', nullable: false, description: 'Foreign key ke raw_materials.sku', isForeignKey: true, foreignTable: 'raw_materials' },
      { name: 'quantity_required', type: 'NUMERIC(14, 4)', nullable: false, description: 'Jumlah takaran bahan yang dibutuhkan per 1 porsi' },
      { name: 'unit', type: 'VARCHAR(20)', nullable: false, description: 'Satuan konsumsi resep' }
    ],
    indexes: [
      'CREATE INDEX idx_recipe_boms_menu ON recipe_boms(menu_item_id);',
      'CREATE INDEX idx_recipe_boms_material ON recipe_boms(material_sku);'
    ]
  },
  {
    name: 'orders',
    description: 'Header transaksi pesanan penjualan di kasir (POS).',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, description: 'ID internal pesanan' },
      { name: 'order_number', type: 'VARCHAR(50)', nullable: false, description: 'Nomor nota transaksi (e.g., ORD-2026-1049)' },
      { name: 'table_number', type: 'VARCHAR(20)', nullable: true, description: 'Nomor meja (Dine-in)' },
      { name: 'order_type', type: 'VARCHAR(20)', nullable: false, description: 'DINE_IN, TAKEAWAY, ONLINE_DELIVERY' },
      { name: 'total_amount', type: 'NUMERIC(12, 2)', nullable: false, description: 'Total nilai transaksi pembayaran' },
      { name: 'cogs_amount', type: 'NUMERIC(12, 2)', nullable: false, description: 'Total HPP bahan baku yang terkonsumsi' },
      { name: 'status', type: 'VARCHAR(20)', nullable: false, description: 'PENDING, COOKING, READY, COMPLETED, VOID' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Waktu transaksi dibayar di kasir' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_orders_number ON orders(order_number);',
      'CREATE INDEX idx_orders_created_at ON orders(created_at DESC);'
    ]
  },
  {
    name: 'order_items',
    description: 'Detail baris item menu yang dibeli di dalam setiap order.',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, description: 'ID baris pesanan' },
      { name: 'order_id', type: 'UUID', nullable: false, description: 'Foreign key ke orders.id', isForeignKey: true, foreignTable: 'orders' },
      { name: 'menu_item_id', type: 'VARCHAR(64)', nullable: false, description: 'Foreign key ke menu_items.id', isForeignKey: true, foreignTable: 'menu_items' },
      { name: 'quantity', type: 'INT', nullable: false, description: 'Jumlah porsi dipesan' },
      { name: 'unit_price', type: 'NUMERIC(12, 2)', nullable: false, description: 'Harga satuan saat transaksi terjadi' },
      { name: 'subtotal', type: 'NUMERIC(12, 2)', nullable: false, description: 'Subtotal per item' }
    ],
    indexes: [
      'CREATE INDEX idx_order_items_order ON order_items(order_id);'
    ]
  },
  {
    name: 'stock_transactions',
    description: 'Buku besar (General Stock Ledger) mutasi barang in & out untuk audit jejak mutasi tanpa cela (Immutability).',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'BIGSERIAL', nullable: false, description: 'Urutan audit ledger' },
      { name: 'transaction_type', type: 'VARCHAR(30)', nullable: false, description: 'IN_PURCHASE, OUT_SALE, OUT_WASTE, ADJUSTMENT_OPNAME, VOID_ROLLBACK' },
      { name: 'material_sku', type: 'VARCHAR(64)', nullable: false, description: 'Foreign key ke raw_materials.sku', isForeignKey: true, foreignTable: 'raw_materials' },
      { name: 'batch_id', type: 'UUID', nullable: true, description: 'Foreign key ke stock_batches.id (jika terlacak lot)', isForeignKey: true, foreignTable: 'stock_batches' },
      { name: 'qty_delta', type: 'NUMERIC(14, 4)', nullable: false, description: 'Perubahan jumlah stok (+ untuk masuk, - untuk keluar)' },
      { name: 'balance_after', type: 'NUMERIC(14, 4)', nullable: false, description: 'Saldo akhir persediaan setelah mutasi selesai' },
      { name: 'reference_doc', type: 'VARCHAR(80)', nullable: false, description: 'No Order, No PO, No Log Waste, atau No Opname' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Waktu transaksi tercatat di database' }
    ],
    indexes: [
      'CREATE INDEX idx_stock_trans_material ON stock_transactions(material_sku, created_at DESC);',
      'CREATE INDEX idx_stock_trans_type ON stock_transactions(transaction_type);'
    ]
  },
  {
    name: 'kitchen_waste_logs',
    description: 'Pencatatan bahan terbuang, rusak, tumpah, gosong di area dapur dan bar.',
    primaryKey: 'id',
    columns: [
      { name: 'id', type: 'UUID', nullable: false, description: 'ID pencatatan waste' },
      { name: 'material_sku', type: 'VARCHAR(64)', nullable: false, description: 'Foreign key ke raw_materials.sku', isForeignKey: true, foreignTable: 'raw_materials' },
      { name: 'quantity', type: 'NUMERIC(14, 4)', nullable: false, description: 'Jumlah bahan terbuang' },
      { name: 'reason', type: 'VARCHAR(40)', nullable: false, description: 'EXPIRED, BURNT_COOKING, DROPPED_SPILL, QUALITY_REJECT' },
      { name: 'estimated_loss_cost', type: 'NUMERIC(12, 2)', nullable: false, description: 'Estimasi nilai kerugian finansial (Rp)' },
      { name: 'logged_by', type: 'VARCHAR(100)', nullable: false, description: 'Nama koki / staf penanggung jawab' },
      { name: 'notes', type: 'TEXT', nullable: true, description: 'Catatan detail kejadian' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Waktu pencatatan waste' }
    ],
    indexes: [
      'CREATE INDEX idx_kitchen_waste_material ON kitchen_waste_logs(material_sku);',
      'CREATE INDEX idx_kitchen_waste_date ON kitchen_waste_logs(created_at DESC);'
    ]
  }
];

export const POSTGRESQL_DDL_SCRIPT = `-- ============================================================================
-- RESTOSYNC: ENTERPRISE RESTAURANT INVENTORY REAL-TIME SCHEMA
-- Database Engine: PostgreSQL 15+ with ACID Row-Level Locking & Audit Ledger
-- ============================================================================

-- 1. Master Bahan Baku
CREATE TABLE raw_materials (
    sku VARCHAR(64) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    current_stock NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
    safety_stock NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
    reorder_point NUMERIC(14, 4) NOT NULL DEFAULT 0.0000,
    unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    storage_temp VARCHAR(30) DEFAULT 'Dry Ambient',
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Stock Batches (FIFO / FEFO Tracking)
CREATE TABLE stock_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_sku VARCHAR(64) NOT NULL REFERENCES raw_materials(sku) ON DELETE RESTRICT,
    batch_no VARCHAR(80) NOT NULL,
    po_number VARCHAR(80) NOT NULL,
    qty_received NUMERIC(14, 4) NOT NULL,
    qty_remaining NUMERIC(14, 4) NOT NULL,
    purchase_cost NUMERIC(12, 2) NOT NULL,
    expiry_date DATE NOT NULL,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index khusus untuk query alokasi FEFO / FIFO tercepat
CREATE INDEX idx_stock_batches_fefo ON stock_batches (material_sku, expiry_date ASC)
WHERE qty_remaining > 0;

-- 3. Master Katalog Menu POS
CREATE TABLE menu_items (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    selling_price NUMERIC(12, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Recipe Bill of Materials (BOM)
CREATE TABLE recipe_boms (
    id BIGSERIAL PRIMARY KEY,
    menu_item_id VARCHAR(64) NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    material_sku VARCHAR(64) NOT NULL REFERENCES raw_materials(sku) ON DELETE RESTRICT,
    quantity_required NUMERIC(14, 4) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    CONSTRAINT uq_recipe_material UNIQUE (menu_item_id, material_sku)
);

-- 5. Transaksi Penjualan (Orders)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    table_number VARCHAR(20),
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('DINE_IN', 'TAKEAWAY', 'ONLINE_DELIVERY')),
    total_amount NUMERIC(12, 2) NOT NULL,
    cogs_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COOKING', 'READY', 'COMPLETED', 'VOID')),
    payment_method VARCHAR(30) NOT NULL,
    idempotency_key VARCHAR(120) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id VARCHAR(64) NOT NULL REFERENCES menu_items(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- 6. General Stock Ledger (Buku Besar Mutasi Stok - Immutable)
CREATE TABLE stock_transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_type VARCHAR(30) NOT NULL CHECK (
        transaction_type IN ('IN_PURCHASE', 'OUT_SALE', 'OUT_WASTE', 'ADJUSTMENT_OPNAME', 'VOID_ROLLBACK')
    ),
    material_sku VARCHAR(64) NOT NULL REFERENCES raw_materials(sku),
    batch_id UUID REFERENCES stock_batches(id),
    qty_delta NUMERIC(14, 4) NOT NULL,
    balance_after NUMERIC(14, 4) NOT NULL,
    reference_doc VARCHAR(80) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Pencatatan Kitchen Spoilage / Waste
CREATE TABLE kitchen_waste_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_sku VARCHAR(64) NOT NULL REFERENCES raw_materials(sku),
    quantity NUMERIC(14, 4) NOT NULL,
    reason VARCHAR(40) NOT NULL CHECK (
        reason IN ('EXPIRED', 'BURNT_COOKING', 'DROPPED_SPILL', 'QUALITY_REJECT')
    ),
    estimated_loss_cost NUMERIC(12, 2) NOT NULL,
    logged_by VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- STORED PROCEDURE: FIFO STOCK DEDUCTION WITH ROW-LEVEL LOCKING
-- ============================================================================
CREATE OR REPLACE FUNCTION deduct_inventory_fifo(
    p_material_sku VARCHAR(64),
    p_qty_needed NUMERIC(14, 4),
    p_reference_doc VARCHAR(80),
    p_tx_type VARCHAR(30)
) RETURNS NUMERIC(14, 4) AS $$
DECLARE
    v_remaining_needed NUMERIC(14, 4) := p_qty_needed;
    v_batch RECORD;
    v_deduct_from_batch NUMERIC(14, 4);
    v_new_total_stock NUMERIC(14, 4);
BEGIN
    -- 1. Kunci baris master bahan baku untuk mencegah race condition (Pessimistic Lock)
    SELECT current_stock INTO v_new_total_stock
    FROM raw_materials
    WHERE sku = p_material_sku
    FOR UPDATE;

    IF v_new_total_stock < p_qty_needed THEN
        RAISE EXCEPTION 'Insufficient stock for material %: available %, requested %',
            p_material_sku, v_new_total_stock, p_qty_needed;
    END IF;

    -- 2. Kurangi batch berdasarkan FEFO (First-Expired, First-Out)
    FOR v_batch IN
        SELECT id, qty_remaining
        FROM stock_batches
        WHERE material_sku = p_material_sku AND qty_remaining > 0
        ORDER BY expiry_date ASC, received_at ASC
        FOR UPDATE
    LOOP
        IF v_remaining_needed <= 0 THEN
            EXIT;
        END IF;

        IF v_batch.qty_remaining >= v_remaining_needed THEN
            v_deduct_from_batch := v_remaining_needed;
            v_remaining_needed := 0;
        ELSE
            v_deduct_from_batch := v_batch.qty_remaining;
            v_remaining_needed := v_remaining_needed - v_batch.qty_remaining;
        END IF;

        -- Kurangi saldo batch
        UPDATE stock_batches
        SET qty_remaining = qty_remaining - v_deduct_from_batch
        WHERE id = v_batch.id;

        -- Catat ledger transaksi per batch
        UPDATE raw_materials
        SET current_stock = current_stock - v_deduct_from_batch
        WHERE sku = p_material_sku
        RETURNING current_stock INTO v_new_total_stock;

        INSERT INTO stock_transactions (
            transaction_type, material_sku, batch_id, qty_delta, balance_after, reference_doc
        ) VALUES (
            p_tx_type, p_material_sku, v_batch.id, -v_deduct_from_batch, v_new_total_stock, p_reference_doc
        );
    END LOOP;

    RETURN v_new_total_stock;
END;
$$ LANGUAGE plpgsql;
`;
