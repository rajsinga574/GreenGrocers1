import React, { useState, useEffect, useCallback } from 'react';
import type { Region, Store, Supplier, KpiData, KpiFilters, SpoilageByCategoryData } from '../types';
import { getKpiData, getFilterOptions } from '../services/apiService';

// --- SVG Icons for KPI Cards ---
const SpoilageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const StockoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" /></svg>;
const RevenueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4a1 1 0 011 1v10a1 1 0 01-1 1h-4v-1m-4 0H5a1 1 0 01-1-1V7a1 1 0 011-1h3v1" /></svg>;

// --- Reusable Components & Skeletons ---

const Skeleton: React.FC<{ className?: string }> = ({ className }) => <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;

const FilterSelect: React.FC<{ label: string; options: {value: string, label: string}[]; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; disabled?: boolean; }> = ({ label, options, value, onChange, disabled }) => (
    <div>
        <label htmlFor={label} className="block text-sm font-medium text-gray-500">{label}</label>
        <select id={label} value={value} onChange={onChange} disabled={disabled} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md disabled:bg-gray-100">
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
    </div>
);

interface KpiCardProps { title: string; value: string; target: string; trendDirection: 'good' | 'bad'; icon: React.ReactNode; }
const KpiCard: React.FC<KpiCardProps> = ({ title, value, target, trendDirection, icon }) => (
    <div className={`relative overflow-hidden bg-white p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl`}>
        {trendDirection === 'good' && <div className="absolute top-0 right-0 h-24 w-24 -mt-12 -mr-12 bg-emerald-50 rounded-full"></div>}
        <div className="relative">
            <div className="flex justify-between items-start"><div className="flex-shrink-0">{icon}</div></div>
            <p className="text-4xl font-bold text-gray-800 mt-4">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
            <p className="text-xs text-gray-400 mt-2">Target: {target}</p>
        </div>
    </div>
);

const KpiCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-10 w-3/4 mt-4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
        <Skeleton className="h-3 w-1/4 mt-2" />
    </div>
);

const SpoilageCategorySkeleton: React.FC = () => (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full h-80">
        <Skeleton className="w-48 h-48 rounded-full" />
        <div className="w-full md:w-1/3 space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/6" />
        </div>
    </div>
);

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
interface DonutChartProps { data: SpoilageByCategoryData[]; }

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
    const size = 200;
    const strokeWidth = 30;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                {data.map((item, index) => {
                    const dashArray = (circumference * item.spoilagePercentage) / 100;
                    const dashOffset = (circumference * accumulatedPercentage) / 100;
                    accumulatedPercentage += item.spoilagePercentage;

                    return (
                        <circle
                            key={item.category}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            strokeWidth={strokeWidth}
                            stroke={COLORS[index % COLORS.length]}
                            fill="none"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={-dashOffset}
                            className="transition-all duration-500"
                        />
                    );
                })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold text-gray-700">Total</span>
                <span className="text-lg text-gray-500">Spoilage</span>
            </div>
        </div>
    );
};


const SPOILAGE_TARGET = 4.5;

const KpiDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [kpiData, setKpiData] = useState<KpiData | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [filters, setFilters] = useState<KpiFilters>({
        startDate: (() => { const d = new Date(); d.setMonth(d.getMonth() - 3); return d.toISOString().split('T')[0]; })(),
        endDate: new Date().toISOString().split('T')[0],
        region: 'All Regions',
        store: 'All Stores',
        supplier: 'All Suppliers',
    });

    useEffect(() => {
        const fetchOptions = async () => {
            const { regions, stores, suppliers } = await getFilterOptions();
            setRegions(regions);
            setStores(stores);
            setSuppliers(suppliers);
        };
        fetchOptions();
    }, []);

    const fetchDashboardData = useCallback(async (currentFilters: KpiFilters) => {
        setLoading(true);
        const data = await getKpiData(currentFilters);
        setKpiData(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchDashboardData(filters);
    }, [filters, fetchDashboardData]);

    const handleFilterChange = (filterName: keyof KpiFilters, value: string) => {
        const newFilters = { ...filters, [filterName]: value };
        // If region changes, filter stores and reset store filter
        if (filterName === 'region') {
            newFilters.store = 'All Stores';
        }
        setFilters(newFilters);
    };

    const handleExport = useCallback(() => {
        if (loading || !kpiData?.topStores || kpiData.topStores.length === 0) {
            return;
        }

        const headers = ['Rank', 'Store', 'Revenue ($)', 'Spoilage Rate (%)', 'Stockouts'];
        const rows = kpiData.topStores.map(store => [
            store.rank,
            `"${store.name.replace(/"/g, '""')}"`, // Handle quotes in store name
            store.revenue,
            store.spoilageRate.toFixed(1),
            store.stockouts
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "top-performing-stores.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [kpiData, loading]);
    
    const filteredStores = filters.region === 'All Regions' ? stores : stores.filter(s => s.region === filters.region);
    const maxTrendValue = Math.max(...(kpiData?.spoilageTrend.map(d => d.value) || [0]), SPOILAGE_TARGET, 0) * 1.2 || 1;

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800">Leadership Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">Displaying KPIs for selected filters.</p>
            </div>
            
            <details className="bg-white rounded-xl shadow-lg overflow-hidden">
                <summary className="p-4 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50">Adjust Filters</summary>
                <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <FilterSelect label="Region" value={filters.region} onChange={e => handleFilterChange('region', e.target.value)} options={[{ value: 'All Regions', label: 'All Regions' }, ...regions.map(r => ({ value: r, label: r }))]} />
                        <FilterSelect label="Store" value={filters.store} onChange={e => handleFilterChange('store', e.target.value)} options={[{ value: 'All Stores', label: 'All Stores' }, ...filteredStores.map(s => ({ value: String(s.id), label: s.name }))]} />
                        <FilterSelect label="Supplier" value={filters.supplier} onChange={e => handleFilterChange('supplier', e.target.value)} options={[{ value: 'All Suppliers', label: 'All Suppliers' }, ...suppliers.map(s => ({ value: s.name, label: s.name }))]} />
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-gray-500">Start Date</label>
                            <input type="date" id="start-date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-gray-500">End Date</label>
                            <input type="date" id="end-date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} min={filters.startDate} className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md" />
                        </div>
                    </div>
                </div>
            </details>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? Array.from({ length: 3 }).map((_, i) => <KpiCardSkeleton key={i} />) : kpiData ? <>
                    <KpiCard title="Spoilage Rate" value={`${kpiData.spoilageRate.toFixed(1)}%`} target="< 4.5%" trendDirection={kpiData.spoilageRate < 4.5 ? 'good' : 'bad'} icon={<SpoilageIcon />} />
                    <KpiCard title="Stockout Incidents" value={kpiData.stockoutIncidents.toString()} target="< 10" trendDirection={kpiData.stockoutIncidents < 10 ? 'good' : 'bad'} icon={<StockoutIcon />} />
                    <KpiCard title="Total Revenue" value={`$${(kpiData.totalRevenue / 1_000_000).toFixed(2)}M`} target="$4.0M" trendDirection={kpiData.totalRevenue > 4_000_000 ? 'good' : 'bad'} icon={<RevenueIcon />} />
                </> : null}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Spoilage Rate Trend (vs. Target)</h3>
                <div className="relative flex h-80 space-x-2 items-end pr-4 pl-8">
                    {loading ? <Skeleton className="w-full h-full" /> : <>
                        <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-xs text-gray-400 font-semibold"><span>{maxTrendValue.toFixed(1)}%</span><span>0%</span></div>
                        <div className="absolute w-full border-t-2 border-dashed border-red-400" style={{ bottom: `${(SPOILAGE_TARGET / maxTrendValue) * 100}%` }}><span className="absolute -top-2.5 right-0 text-xs font-bold text-red-500 bg-white pr-2">Target: {SPOILAGE_TARGET}%</span></div>
                        {kpiData?.spoilageTrend.map(data => (
                            <div key={data.period} className="group flex flex-col items-center flex-1 h-full justify-end">
                                <div className="w-full bg-emerald-300 hover:bg-emerald-500 rounded-t-md transition-all duration-300 ease-out" style={{ height: `${(data.value / maxTrendValue) * 100}%` }}>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs rounded-md py-1 px-2 absolute -top-8 left-1/2 -translate-x-1/2">{data.value.toFixed(1)}%<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div></div>
                                </div>
                                <div className="mt-2 text-xs font-medium text-gray-500">{data.period}</div>
                            </div>
                        ))}
                    </>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Spoilage by Category</h3>
                {loading ? <SpoilageCategorySkeleton /> : kpiData && kpiData.spoilageByCategory.length > 0 ? (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <DonutChart data={kpiData.spoilageByCategory} />
                        <div className="w-full md:w-auto md:max-w-xs space-y-2">
                            {kpiData.spoilageByCategory.map((item, index) => (
                                <div key={item.category} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span className="text-gray-600">{item.category}</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">{item.spoilagePercentage.toFixed(1)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-80 text-gray-500">
                        No spoilage data to display for the selected period.
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Top 10 Best Performing Stores (by Revenue)</h3>
                    <button
                        onClick={handleExport}
                        disabled={loading || !kpiData?.topStores || kpiData.topStores.length === 0}
                        className="mt-2 sm:mt-0 flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export to CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spoilage Rate</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stockouts</th>
                        </tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? Array.from({ length: 10 }).map((_, i) => <tr key={i}><td colSpan={5}><Skeleton className="h-12 w-full" /></td></tr>) : kpiData?.topStores.map(store => (
                                <tr key={store.rank} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.rank}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{store.name}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">${store.revenue.toLocaleString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{store.spoilageRate.toFixed(1)}%</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{store.stockouts} incidents</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default KpiDashboard;