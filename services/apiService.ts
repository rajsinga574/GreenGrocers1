import type { KpiFilters, KpiData, Region, Store, Supplier, ItTicket, ItTicketStatus, Product, TopStoreData, Order, Forecast, SummaryView, StoreSalesSummary, ProductSalesSummary, DateSalesSummary, SpoilageByCategoryData, ManagerDashboardData, ProductPerformance } from '../types';
import { REGIONS_DATA, STORES_DATA, SUPPLIERS_DATA, IT_TICKETS_DATA, PRODUCTS_DATA, PAST_ORDERS_DATA, FORECAST_DATA, POS_TRANSACTIONS_DATA } from '../data/mockData';

const API_LATENCY = 800; // ms

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getFilterOptions = async (): Promise<{ regions: Region[], stores: Store[], suppliers: Supplier[] }> => {
    await delay(200);
    return {
        regions: REGIONS_DATA,
        stores: STORES_DATA,
        suppliers: SUPPLIERS_DATA
    };
};

export const getKpiData = async (filters: KpiFilters): Promise<KpiData> => {
    await delay(API_LATENCY);

    // Filter POS transactions
    const filteredTransactions = POS_TRANSACTIONS_DATA.filter(tx => {
        const txDate = new Date(tx.timestamp);
        const store = STORES_DATA.find(s => s.id === tx.storeId);

        const dateMatch = txDate >= new Date(filters.startDate) && txDate <= new Date(filters.endDate);
        const regionMatch = filters.region === 'All Regions' || (store && store.region === filters.region);
        const storeMatch = filters.store === 'All Stores' || (store && store.id === parseInt(filters.store));
        
        // Supplier match requires checking each item in the transaction
        const supplierMatch = filters.supplier === 'All Suppliers' || tx.items.some(item => {
            const product = PRODUCTS_DATA.find(p => p.id === item.productId);
            return product && product.supplier === filters.supplier;
        });
        
        return dateMatch && regionMatch && storeMatch && supplierMatch;
    });

    // Aggregate filtered data
    let totalRevenue = 0;
    let totalQuantity = 0;
    let totalSpoiled = 0;
    const storePerformance: { [storeId: number]: { revenue: number; totalQty: number; spoiled: number; } } = {};
    const trend: { [key: string]: { spoiled: number, total: number } } = {};
    const categorySpoilage: { [category: string]: { spoiled: number, total: number } } = {};
    const productCategoryMap = new Map<number, string>(PRODUCTS_DATA.map(p => [p.id, p.category]));

    filteredTransactions.forEach(tx => {
        totalRevenue += tx.totalAmount;
        if (!storePerformance[tx.storeId]) {
            storePerformance[tx.storeId] = { revenue: 0, totalQty: 0, spoiled: 0 };
        }
        storePerformance[tx.storeId].revenue += tx.totalAmount;

        const month = new Date(tx.timestamp).toLocaleString('default', { month: 'short' });
        if (!trend[month]) {
            trend[month] = { spoiled: 0, total: 0 };
        }

        tx.items.forEach(item => {
            const quantity = item.quantity;
            totalQuantity += quantity;
            storePerformance[tx.storeId].totalQty += quantity;
            trend[month].total += quantity;

            const category = productCategoryMap.get(item.productId);
            if (category) {
                if (!categorySpoilage[category]) {
                    categorySpoilage[category] = { spoiled: 0, total: 0 };
                }
                categorySpoilage[category].total += quantity;
            }

            // Mock spoilage based on a probability
            const isSpoiled = Math.random() < 0.05; // 5% chance
            if (isSpoiled) {
                const spoiledQty = Math.max(1, Math.floor(quantity * Math.random() * 0.2)); // Spoil up to 20% of item quantity
                totalSpoiled += spoiledQty;
                storePerformance[tx.storeId].spoiled += spoiledQty;
                trend[month].spoiled += spoiledQty;
                if(category) {
                    categorySpoilage[category].spoiled += spoiledQty;
                }
            }
        });
    });

    const spoilageRate = totalQuantity > 0 ? (totalSpoiled / totalQuantity) * 100 : 0;
    const stockoutIncidents = Math.floor(Math.random() * 20) + 5; // Mocked for simplicity

    const spoilageTrend = Object.entries(trend).map(([period, data]) => ({
        period,
        value: data.total > 0 ? (data.spoiled / data.total) * 100 : 0,
    })).slice(-6);

    const topStores: TopStoreData[] = Object.entries(storePerformance)
        .map(([storeId, data]) => {
            const store = STORES_DATA.find(s => s.id === parseInt(storeId));
            return {
                rank: 0,
                name: store?.name || `Store ${storeId}`,
                spoilageRate: data.totalQty > 0 ? (data.spoiled / data.totalQty) * 100 : 0,
                stockouts: Math.floor(Math.random() * 5),
                revenue: data.revenue,
            };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)
        .map((store, index) => ({ ...store, rank: index + 1 }));

    const totalSpoiledAcrossCategories = Object.values(categorySpoilage).reduce((acc, curr) => acc + curr.spoiled, 0);
    const spoilageByCategory: SpoilageByCategoryData[] = Object.entries(categorySpoilage)
       .map(([category, data]) => ({
           category,
           spoilagePercentage: totalSpoiledAcrossCategories > 0 ? (data.spoiled / totalSpoiledAcrossCategories) * 100 : 0,
       }))
       .filter(item => item.spoilagePercentage > 0)
       .sort((a, b) => b.spoilagePercentage - a.spoilagePercentage);

    return {
        spoilageRate,
        stockoutIncidents,
        totalRevenue,
        spoilageTrend,
        topStores,
        spoilageByCategory,
    };
};

export const getItTickets = async (status: ItTicketStatus): Promise<ItTicket[]> => {
    await delay(500);
    return IT_TICKETS_DATA.filter(ticket => ticket.status === status);
};

export const getItTicketCounts = async (): Promise<Record<ItTicketStatus, number>> => {
    await delay(300);
    const counts = { 'Open': 0, 'In Progress': 0, 'Completed': 0 };
    IT_TICKETS_DATA.forEach(ticket => {
        counts[ticket.status]++;
    });
    return counts;
};


export const getProducts = async (): Promise<Product[]> => {
    await delay(200);
    return PRODUCTS_DATA;
}

export const getSuppliers = async (): Promise<Supplier[]> => {
    await delay(200);
    return SUPPLIERS_DATA;
}

export const getPastOrders = async (): Promise<Order[]> => {
    await delay(400);
    return PAST_ORDERS_DATA;
};

export const getForecastData = async (): Promise<Forecast[]> => {
    await delay(600);
    return FORECAST_DATA;
};

const storeMap = new Map<number, Store>(STORES_DATA.map(store => [store.id, store]));
const productMap = new Map<number, Product>(PRODUCTS_DATA.map(product => [product.id, product]));

export const getSalesSummary = async (view: SummaryView): Promise<Array<StoreSalesSummary | ProductSalesSummary | DateSalesSummary>> => {
    await delay(API_LATENCY);

    if (view === 'store') {
        const summary = new Map<number, StoreSalesSummary>();
        POS_TRANSACTIONS_DATA.forEach(tx => {
            const store = storeMap.get(tx.storeId);
            if (!store) return;

            let entry = summary.get(tx.storeId);
            if (!entry) {
                entry = {
                    storeId: tx.storeId,
                    storeName: store.name,
                    region: store.region,
                    totalTransactions: 0,
                    totalItemsSold: 0,
                    totalRevenue: 0,
                    avgTransactionValue: 0,
                };
            }
            entry.totalTransactions += 1;
            entry.totalItemsSold += tx.items.reduce((acc, item) => acc + item.quantity, 0);
            entry.totalRevenue += tx.totalAmount;
            summary.set(tx.storeId, entry);
        });

        return Array.from(summary.values()).map(s => ({
            ...s,
            avgTransactionValue: s.totalTransactions > 0 ? s.totalRevenue / s.totalTransactions : 0,
        }));
    }

    if (view === 'product') {
        const summary = new Map<number, ProductSalesSummary>();
        POS_TRANSACTIONS_DATA.forEach(tx => {
            tx.items.forEach(item => {
                const product = productMap.get(item.productId);
                if (!product) return;
                
                let entry = summary.get(item.productId);
                if (!entry) {
                    entry = {
                        productId: item.productId,
                        productName: product.name,
                        category: product.category,
                        totalUnitsSold: 0,
                        totalRevenue: 0,
                    };
                }
                entry.totalUnitsSold += item.quantity;
                entry.totalRevenue += item.quantity * item.price;
                summary.set(item.productId, entry);
            });
        });
        return Array.from(summary.values());
    }

    if (view === 'date') {
        const summary = new Map<string, DateSalesSummary>();
        POS_TRANSACTIONS_DATA.forEach(tx => {
            const date = tx.timestamp.split('T')[0];
            
            let entry = summary.get(date);
            if (!entry) {
                entry = {
                    date: date,
                    totalTransactions: 0,
                    totalItemsSold: 0,
                    totalRevenue: 0,
                };
            }
            entry.totalTransactions += 1;
            entry.totalItemsSold += tx.items.reduce((acc, item) => acc + item.quantity, 0);
            entry.totalRevenue += tx.totalAmount;
            summary.set(date, entry);
        });
        return Array.from(summary.values()).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    return [];
};


export const getManagerDashboardData = async (filters: { storeId: number; startDate: string; endDate: string; }): Promise<ManagerDashboardData> => {
    await delay(API_LATENCY);
    
    const { storeId, startDate, endDate } = filters;

    const filteredTransactions = POS_TRANSACTIONS_DATA.filter(tx => {
        const txDate = new Date(tx.timestamp);
        return tx.storeId === storeId && txDate >= new Date(startDate) && txDate <= new Date(endDate);
    });

    let totalRevenue = 0;
    let totalUnitsSold = 0;
    let totalSpoiledUnits = 0;
    const productSales = new Map<number, { units: number, revenue: number }>();
    const productSpoilage = new Map<number, { spoiledUnits: number }>();

    filteredTransactions.forEach(tx => {
        totalRevenue += tx.totalAmount;
        tx.items.forEach(item => {
            const quantity = item.quantity;
            totalUnitsSold += quantity;

            // Aggregate product sales
            const currentSales = productSales.get(item.productId) || { units: 0, revenue: 0 };
            currentSales.units += quantity;
            currentSales.revenue += item.price * quantity;
            productSales.set(item.productId, currentSales);

            // Mock spoilage
            const isSpoiled = Math.random() < 0.05; // 5% chance
            if (isSpoiled) {
                const spoiledQty = Math.max(1, Math.floor(quantity * Math.random() * 0.2));
                totalSpoiledUnits += spoiledQty;

                const currentSpoilage = productSpoilage.get(item.productId) || { spoiledUnits: 0 };
                currentSpoilage.spoiledUnits += spoiledQty;
                productSpoilage.set(item.productId, currentSpoilage);
            }
        });
    });

    const totalTransactions = filteredTransactions.length;
    const averageSaleValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const spoilageRate = totalUnitsSold > 0 ? (totalSpoiledUnits / totalUnitsSold) * 100 : 0;

    const topSellingProducts: ProductPerformance[] = Array.from(productSales.entries())
        .map(([productId, data]) => ({
            productId,
            productName: productMap.get(productId)?.name || `Product ${productId}`,
            value: data.units,
            unit: productMap.get(productId)?.unit,
            revenue: data.revenue
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
        
    const highSpoilageProducts: ProductPerformance[] = Array.from(productSpoilage.entries())
        .map(([productId, data]) => ({
            productId,
            productName: productMap.get(productId)?.name || `Product ${productId}`,
            value: data.spoiledUnits,
            unit: productMap.get(productId)?.unit,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    return {
        totalRevenue,
        totalUnitsSold,
        spoilageRate,
        averageSaleValue,
        topSellingProducts,
        highSpoilageProducts,
    };
};