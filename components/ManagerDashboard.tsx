import React, { useState, useEffect, useCallback } from 'react';
import type { ManagerDashboardData } from '../types';
import { getManagerDashboardData } from '../services/apiService';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;

const KpiCard: React.FC<{ title: string; value: string; icon: React.ReactNode; colorClass: string; }> = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
        <div className="flex items-center">
            <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

const KpiCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-full mr-4" />
            <div className="flex-1">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-3/4" />
            </div>
        </div>
    </div>
);

const ProductTable: React.FC<{ title: string; data: any[]; isSpoilage?: boolean }> = ({ title, data, isSpoilage }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="border-b-2 border-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase">{isSpoilage ? 'Spoiled Units' : 'Revenue'}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.productId} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{item.productName}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-700">
                                {isSpoilage ? `${item.value} ${item.unit}` : `$${item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ProductTableSkeleton: React.FC<{ title: string }> = ({ title }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <Skeleton className="h-7 w-3/4 mb-4" />
        <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-1/4" />
                </div>
            ))}
        </div>
    </div>
);

const ManagerDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ManagerDashboardData | null>(null);
    const [dates, setDates] = useState({
        startDate: (() => { const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split('T')[0]; })(),
        endDate: new Date().toISOString().split('T')[0],
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        // Assuming a fixed store ID for the logged-in manager
        const dashboardData = await getManagerDashboardData({ storeId: 1, ...dates });
        setData(dashboardData);
        setLoading(false);
    }, [dates]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Store Manager Dashboard</h2>
                    <p className="text-sm text-gray-500 mt-1">Key performance indicators for your store.</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div>
                        <label htmlFor="start-date" className="text-sm font-medium text-gray-500">From</label>
                        <input type="date" id="start-date" value={dates.startDate} onChange={e => setDates(d => ({...d, startDate: e.target.value}))} className="ml-2 border border-gray-300 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                     <div>
                        <label htmlFor="end-date" className="text-sm font-medium text-gray-500">To</label>
                        <input type="date" id="end-date" value={dates.endDate} min={dates.startDate} onChange={e => setDates(d => ({...d, endDate: e.target.value}))} className="ml-2 border border-gray-300 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />) : data ? (
                    <>
                        <KpiCard title="Total Revenue" value={`$${data.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} colorClass="bg-green-100" />
                        <KpiCard title="Units Sold" value={data.totalUnitsSold.toLocaleString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" /></svg>} colorClass="bg-blue-100" />
                        <KpiCard title="Spoilage Rate" value={`${data.spoilageRate.toFixed(1)}%`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>} colorClass="bg-red-100" />
                        <KpiCard title="Average Sale" value={`$${data.averageSaleValue.toFixed(2)}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>} colorClass="bg-yellow-100" />
                    </>
                ) : null}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {loading ? <ProductTableSkeleton title="Top 5 Selling Products" /> : data && <ProductTable title="Top 5 Selling Products" data={data.topSellingProducts} />}
                {loading ? <ProductTableSkeleton title="Top 5 High Spoilage Products" /> : data && <ProductTable title="Top 5 High Spoilage Products" data={data.highSpoilageProducts} isSpoilage />}
            </div>
        </div>
    );
};

export default ManagerDashboard;
