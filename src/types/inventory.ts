export type SystemModuleId = 'all' | 'kasir' | 'dapur' | 'gudang' | 'dashboard';

export type NodeType = 'start_end' | 'process' | 'decision' | 'io' | 'database' | 'event';

export type ActorRole = 
  | 'Kasir (POS)' 
  | 'Dapur (KDS)' 
  | 'Stok & Gudang' 
  | 'Dashboard Monitoring' 
  | 'Backend Engine' 
  | 'Database (ACID)';

export interface FlowNode {
  id: string;
  step: string;
  title: string;
  type: NodeType;
  actor: ActorRole;
  swimlane: 'interface' | 'backend' | 'database' | 'realtime';
  description: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  technicalDetails: {
    apiEndpoint?: string;
    httpMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'WS';
    requestPayload?: Record<string, any>;
    sqlOperation?: string;
    tablesAffected?: string[];
    wsEvent?: string;
    concurrencyHandling?: string;
    edgeCaseHandling?: string;
  };
  connectedTo?: string[];
  decisionBranches?: {
    yes?: string;
    no?: string;
    conditionText?: string;
  };
}

export interface FlowModuleConfig {
  id: SystemModuleId;
  name: string;
  shortDescription: string;
  color: string;
  primaryGoal: string;
  nodes: FlowNode[];
}

export interface RawMaterial {
  sku: string;
  name: string;
  category: 'Protein' | 'Bahan Pokok' | 'Bumbu & Saus' | 'Dairy & Telur' | 'Packaging';
  unit: string;
  currentStock: number;
  minStock: number;
  safetyStock: number;
  reorderPoint: number;
  unitCost: number; // Rupiah
}

export interface StockBatch {
  id: string;
  materialSku: string;
  batchNo: string;
  qtyReceived: number;
  qtyRemaining: number;
  expiryDate: string;
  purchaseCost: number;
  receivedDate: string;
}

export interface BomItem {
  materialSku: string;
  qty: number;
  unit: string;
}

export interface MenuItem {
  id: string;
  code: string;
  name: string;
  category: 'Makanan' | 'Minuman' | 'Side Dish';
  price: number;
  bom: BomItem[];
}

export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  bomConsumed: {
    materialSku: string;
    materialName: string;
    qtyPerUnit: number;
    totalQty: number;
    unit: string;
  }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'ONLINE';
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'COOKING' | 'READY' | 'COMPLETED' | 'VOID';
  createdAt: string;
  cogsAmount: number;
}

export interface KitchenTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  tableNumber?: string;
  orderType: string;
  items: {
    name: string;
    qty: number;
    notes?: string;
  }[];
  status: 'QUEUED' | 'COOKING' | 'READY';
  createdAt: string;
  startedAt?: string;
}

export interface KitchenWasteLog {
  id: string;
  materialSku: string;
  materialName: string;
  qty: number;
  unit: string;
  reason: 'EXPIRED' | 'BURNT_COOKING' | 'DROPPED_SPILL' | 'QUALITY_REJECT';
  loggedBy: string;
  loggedAt: string;
  estimatedCostLoss: number;
}

export interface StockTransaction {
  id: string;
  type: 'IN_PURCHASE' | 'OUT_SALE' | 'OUT_WASTE' | 'ADJUSTMENT_OPNAME' | 'VOID_ROLLBACK';
  materialSku: string;
  materialName: string;
  qtyDelta: number; // negative for deduction, positive for addition
  unit: string;
  batchNo?: string;
  referenceDoc: string; // e.g. "ORD-2026-001" or "PO-8821" or "WST-003"
  balanceAfter: number;
  timestamp: string;
  note?: string;
}

export interface ApiEndpointSpec {
  id: string;
  title: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'WS';
  path: string;
  module: SystemModuleId;
  description: string;
  headers: Record<string, string>;
  requestBody?: string;
  responses: {
    status: number;
    description: string;
    body: string;
  }[];
  websocketEvents?: {
    event: string;
    direction: 'Server to Client' | 'Client to Server';
    payload: string;
    targetInterfaces: string[];
  }[];
}

export interface DbTableSpec {
  name: string;
  description: string;
  primaryKey: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    description: string;
    isForeignKey?: boolean;
    foreignTable?: string;
  }[];
  indexes: string[];
}
