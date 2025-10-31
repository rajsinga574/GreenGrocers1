import React, { useState, useEffect, useMemo } from 'react';
import type { Forecast } from '../types';
import { getForecastData } from '../services/apiService';

const SkeletonRow: React.FC = () => (
    <tr>
        <td colSpan={6} className="px-6 py-4">
            <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        </td>
    </tr>
);

const ConfidenceBadge: React.FC<{ confidence: 'High' | 'Medium' | 'Low' }> = ({ confidence }) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    const confidenceMap = {
        'High': "bg-green-100 text-green-800",
        'Medium': "bg-yellow-100 text-yellow-800",
        'Low': "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${confidenceMap[confidence]}`}>{confidence}</span>
}


const Forecast: React.FC = () => {
    const [forecasts, setForecasts] = useState<Forecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7);

    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    useEffect(() => {
        const fetchForecasts = async () => {
            setLoading(true);
            const data = await getForecastData();
            setForecasts(data);
            setLoading(false);
        };
        fetchForecasts();
    }, []);
    
    const categories = useMemo(() => ['All', ...new Set(forecasts.map(f => f.category))], [forecasts]);

    const filteredForecasts = useMemo(() => {
        if (selectedCategory === 'All') {
            return forecasts;
        }
        return forecasts.filter(f => f.category === selectedCategory);
    }, [forecasts, selectedCategory]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Sales & Demand Forecast</h2>
            <p className="text-sm text-gray-500 mt-1">
                Forecast for Next 7 Days: {formatDate(startDate)} - {formatDate(endDate)}
            </p>
        </div>
        <div className="mt-4 sm:mt-0">
            <label htmlFor="category-filter" className="sr-only">Filter by Category</label>
            <select
                id="category-filter"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto border border-gray-300 rounded-lg p-2 text-base focus:ring-emerald-500 focus:border-emerald-500"
            >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Forecasted Sales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Expected Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Confidence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Exp. Spoilage Reduction</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : filteredForecasts.length > 0 ? filteredForecasts.map((forecast) => (
              <tr key={forecast.productId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{forecast.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{forecast.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{forecast.forecastedSalesUnits} {forecast.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">${forecast.expectedRevenue.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <ConfidenceBadge confidence={forecast.confidence} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                    ↓ {forecast.expectedSpoilageReduction.toFixed(1)}%
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  <p className="font-semibold">No forecast data available.</p>
                  <p className="text-sm mt-1">The forecast model has not generated data for the selected criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Forecast;