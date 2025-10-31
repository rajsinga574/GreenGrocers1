export type Role = 'manager' | 'it-support' | 'leadership' | 'store-employee' | null;
export type Page = 'login' | 'order-placement' | 'order-history' | 'maintenance' | 'it-ticket-list' | 'kpi-dashboard' | 'forecast' | 'pos-data' | 'manager-dashboard' | 'order-approval';

export interface Product {
  id: number;
  name: string;
  supplier: string;
  category: string;
  current_stock: number;
  forecast_rec: number;
  unit: string;
  spoilage_rate: number;
}

export interface ModalInfo {
  title: string;
  body: string;
}

export interface AIRecommendation {
  recommended_quantity: number;
  reasoning: string;
}

export interface Order {
  id: string;
  productName: string;
  supplier: string;
  quantity: number;
  unit: string;
  date: string; // YYYY-MM-DD
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Placed';
  placedBy: string;
}

// --- New Data Models for Mock Backend ---

export type Region = 'North' | 'South' | 'East' | 'West';

export interface Store {
    id: number;
    name: string;
    region: Region;
}

export interface Supplier {
    id: number;
    name: string;
}

export interface Sale {
    id: number;
    storeId: number;
    productId: number;
    date: string; // YYYY-MM-DD
    quantity: number;
    revenue: number;
    spoiled_quantity: number;
}

export type ItTicketStatus = 'Open' | 'In Progress' | 'Completed';

export interface ItTicket {
    id: string;
    subject: string;
    requester: string;
    date: string;
    status: ItTicketStatus;
}

export interface Forecast {
    productId: number;
    productName: string;
    category: string;
    forecastedSalesUnits: number;
    unit: string;
    expectedRevenue: number;
    confidence: 'High' | 'Medium' | 'Low';
    expectedSpoilageReduction: number; // In percentage
}

export interface PosTransaction {
    transactionId: string;
    storeId: number;
    timestamp: string; // ISO 8601 format
    items: {
        productId: number;
        quantity: number;
        price: number; // Price per unit
    }[];
    totalAmount: number;
    paymentMethod: 'Credit Card' | 'Debit Card' | 'Cash' | 'Mobile';
}

// --- API Service & KPI Dashboard Types ---

export interface KpiFilters {
    startDate: string;
    endDate: string;
    region: string; // 'All' or a specific region
    store: string; // 'All' or a store ID
    supplier: string; // 'All' or a supplier name
}

export interface SpoilageTrendData {
    period: string;
    value: number;
}

export interface TopStoreData {
    rank: number;
    name: string;
    spoilageRate: number;
    stockouts: number;
    revenue: number;
}

export interface SpoilageByCategoryData {
    category: string;
    spoilagePercentage: number;
}

export interface KpiData {
    spoilageRate: number;
    stockoutIncidents: number;
    totalRevenue: number;
    spoilageTrend: SpoilageTrendData[];
    topStores: TopStoreData[];
    spoilageByCategory: SpoilageByCategoryData[];
}

// --- Sales Summary Types ---

export type SummaryView = 'store' | 'product' | 'date';

export interface StoreSalesSummary {
    storeId: number;
    storeName: string;
    region: Region;
    totalTransactions: number;
    totalItemsSold: number;
    totalRevenue: number;
    avgTransactionValue: number;
}

export interface ProductSalesSummary {
    productId: number;
    productName: string;
    category: string;
    totalUnitsSold: number;
    totalRevenue: number;
}

export interface DateSalesSummary {
    date: string;
    totalTransactions: number;
    totalItemsSold: number;
    totalRevenue: number;
}

// --- Manager Dashboard Types ---

export interface ProductPerformance {
    productId: number;
    productName: string;
    value: number; // Can be units sold, revenue, or spoiled units
    unit?: string;
    revenue?: number; // Optional revenue for top sellers
}

export interface ManagerDashboardData {
    totalRevenue: number;
    totalUnitsSold: number;
    spoilageRate: number;
    averageSaleValue: number;
    topSellingProducts: ProductPerformance[];
    highSpoilageProducts: ProductPerformance[];
}