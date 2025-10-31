import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { SummaryView, StoreSalesSummary, ProductSalesSummary, DateSalesSummary } from '../types';
import { getSalesSummary } from '../services/apiService';

type SortConfig = { key: string; direction: 'ascending' | 'descending' } | null;

const useSortableData = (items: any[], config: SortConfig = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};


const SkeletonRow: React.FC<{ cols: number }> = ({ cols }) => (
    <tr>
        <td colSpan={cols} className="px-6 py-4">
            <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        </td>
    </tr>
);

const SortableHeader: React.FC<{ sortKey: string; title: string; requestSort: (key: string) => void; sortConfig: SortConfig; }> = ({ sortKey, title, requestSort, sortConfig }) => {
    const isSorted = sortConfig?.key === sortKey;
    const directionIcon = sortConfig?.direction === 'ascending' ? '▲' : '▼';
    
    return (
        <th 
            className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
            onClick={() => requestSort(sortKey)}
        >
            {title} {isSorted && <span className="text-slate-800">{directionIcon}</span>}
        </th>
    );
};

const PosData: React.FC = () => {
    const [summaryData, setSummaryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<SummaryView>('store');
    
    const { items: sortedData, requestSort, sortConfig } = useSortableData(summaryData);

    const fetchSummary = useCallback(async (currentView: SummaryView) => {
        setLoading(true);
        const data = await getSalesSummary(currentView);
        setSummaryData(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchSummary(view);
    }, [view, fetchSummary]);
    
    const handleExport = useCallback(() => {
        if (loading || sortedData.length === 0) {
            return;
        }

        let headers: string[] = [];
        let rows: (string|number)[][] = [];
        const filename = `sales-summary-by-${view}.csv`;

        switch (view) {
            case 'store':
                headers = ['Store', 'Region', 'Transactions', 'Items Sold', 'Avg. Sale ($)', 'Total Revenue ($)'];
                rows = sortedData.map((d: StoreSalesSummary) => [
                    `"${d.storeName.replace(/"/g, '""')}"`,
                    d.region,
                    d.totalTransactions,
                    d.totalItemsSold,
                    d.avgTransactionValue.toFixed(2),
                    d.totalRevenue.toFixed(2),
                ]);
                break;
            case 'product':
                headers = ['Product', 'Category', 'Units Sold', 'Total Revenue ($)'];
                rows = sortedData.map((d: ProductSalesSummary) => [
                     `"${d.productName.replace(/"/g, '""')}"`,
                     d.category,
                     d.totalUnitsSold,
                     d.totalRevenue.toFixed(2),
                ]);
                break;
            case 'date':
                headers = ['Date', 'Transactions', 'Items Sold', 'Total Revenue ($)'];
                rows = sortedData.map((d: DateSalesSummary) => [
                    d.date,
                    d.totalTransactions,
                    d.totalItemsSold,
                    d.totalRevenue.toFixed(2),
                ]);
                break;
        }

        if (headers.length === 0) return;

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [sortedData, view, loading]);

    const renderTableHeaders = () => {
        switch (view) {
            case 'store':
                return (
                    <tr>
                        <SortableHeader sortKey="storeName" title="Store" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="region" title="Region" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="totalTransactions" title="Transactions" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="totalItemsSold" title="Items Sold" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="avgTransactionValue" title="Avg. Sale" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="totalRevenue" title="Total Revenue" requestSort={requestSort} sortConfig={sortConfig} />
                    </tr>
                );
            case 'product':
                return (
                     <tr>
                        <SortableHeader sortKey="productName" title="Product" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="category" title="Category" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="totalUnitsSold" title="Units Sold" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="totalRevenue" title="Total Revenue" requestSort={requestSort} sortConfig={sortConfig} />
                    </tr>
                );
            case 'date':
                return (
                    <tr>
                        <SortableHeader sortKey="date" title="Date" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="totalTransactions" title="Transactions" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="totalItemsSold" title="Items Sold" requestSort={requestSort} sortConfig={sortConfig} />
                        <SortableHeader sortKey="totalRevenue" title="Total Revenue" requestSort={requestSort} sortConfig={sortConfig} />
                    </tr>
                );
        }
    };
    
    const renderTableBody = () => {
         if (loading) {
            const cols = view === 'store' ? 6 : 4;
            return Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} cols={cols} />);
        }
        if (sortedData.length === 0) {
            return (
                <tr>
                    <td colSpan={view === 'store' ? 6 : 4} className="text-center py-10 text-gray-500">
                        <p className="font-semibold">No summary data available.</p>
                    </td>
                </tr>
            );
        }

        switch (view) {
            case 'store':
                return sortedData.map((d: StoreSalesSummary) => (
                    <tr key={d.storeId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{d.storeName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{d.region}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{d.totalTransactions.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{d.totalItemsSold.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${d.avgTransactionValue.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">${d.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                ));
            case 'product':
                 return sortedData.map((d: ProductSalesSummary) => (
                    <tr key={d.productId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{d.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{d.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{d.totalUnitsSold.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">${d.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                ));
            case 'date':
                return sortedData.map((d: DateSalesSummary) => (
                     <tr key={d.date} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{d.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{d.totalTransactions.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{d.totalItemsSold.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">${d.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                ));
        }
    };
    
    const ViewButton: React.FC<{ current: SummaryView, target: SummaryView, children: React.ReactNode }> = ({ current, target, children }) => {
        const isActive = current === target;
        return (
            <button
                onClick={() => setView(target)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${isActive ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
            >
                {children}
            </button>
        )
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Sales Summary</h2>
                    <p className="text-sm text-gray-500 mt-1">Aggregated sales data from all store POS systems.</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <div className="p-1 bg-slate-100 rounded-lg flex space-x-2">
                        <ViewButton current={view} target="store">By Store</ViewButton>
                        <ViewButton current={view} target="product">By Product</ViewButton>
                        <ViewButton current={view} target="date">By Date</ViewButton>
                    </div>
                     <button
                        onClick={handleExport}
                        disabled={loading || sortedData.length === 0}
                        className="flex items-center bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export CSV
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-50">
                        {renderTableHeaders()}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderTableBody()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PosData;