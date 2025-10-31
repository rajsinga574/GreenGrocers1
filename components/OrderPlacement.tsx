import React, { useState, useEffect, useCallback } from 'react';
import type { Product, Supplier, Order, Role } from '../types';
import { getAIOrderRecommendation } from '../services/geminiService';
import { getProducts, getSuppliers } from '../services/apiService';

interface OrderPlacementProps {
  showModal: (title: string, body: string) => void;
  onPlaceOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'placedBy'>, forApproval: boolean) => void;
  role: Role;
}

const LoadingSpinner: React.FC = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const OrderPlacement: React.FC<OrderPlacementProps> = ({ showModal, onPlaceOrder, role }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [orderQuantities, setOrderQuantities] = useState<Record<number, number | string>>({});
  const [aiLoading, setAiLoading] = useState<Record<number, boolean>>({});
  
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  });

  useEffect(() => {
    const fetchData = async () => {
        const [productsData, suppliersData] = await Promise.all([getProducts(), getSuppliers()]);
        setProducts(productsData);
        setSuppliers(suppliersData);
        if (productsData.length > 0) {
            setSelectedProductId(productsData[0].id);
            const initialQuantities: Record<number, number> = {};
            productsData.forEach(p => {
                initialQuantities[p.id] = p.forecast_rec;
            });
            setOrderQuantities(initialQuantities);
        }
    };
    fetchData();
  }, []);

  const handleQuantityChange = (productId: number, value: string) => {
    setOrderQuantities(prev => ({ ...prev, [productId]: value }));
  };
  
  const handleGetAIRecommendation = useCallback(async (product: Product) => {
    setAiLoading(prev => ({...prev, [product.id]: true}));
    try {
        const recommendation = await getAIOrderRecommendation(product, startDate, endDate);
        setOrderQuantities(prev => ({ ...prev, [product.id]: recommendation.recommended_quantity }));
        showModal(
            `AI Recommendation for ${product.name}`,
            `We recommend ordering **${recommendation.recommended_quantity} ${product.unit}**. <br/><br/>**Reasoning:** ${recommendation.reasoning}`
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        showModal('AI Recommendation Failed', errorMessage);
    } finally {
        setAiLoading(prev => ({...prev, [product.id]: false}));
    }
  }, [showModal, startDate, endDate]);

  const handleSubmit = (forApproval: boolean) => {
    if (!selectedSupplier) {
      showModal('Order Failed', 'Please select a supplier before submitting the order.');
      return;
    }
    
    if (selectedProductId === null) {
        showModal('Order Failed', 'Please select a product.');
        return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const orderQty = Number(orderQuantities[product.id]);
    if (isNaN(orderQty) || orderQty <= 0) {
      showModal('Order Failed', `Please enter a valid order quantity for ${product.name}.`);
      return;
    }

    onPlaceOrder({
        productName: product.name,
        supplier: selectedSupplier,
        quantity: orderQty,
        unit: product.unit,
    }, forApproval);

    const successMessage = forApproval 
      ? `Order for **${product.name}** has been submitted for manager approval.`
      : `Order for **${product.name}** has been placed and synced with the ERP system.`;

    showModal('Order Submitted', successMessage);
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Fresh Produce Order Placement</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Forecast Period</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
                <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-emerald-500 focus:border-emerald-500" />
                </div>
            </div>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="supplier-select" className="block text-sm font-medium text-gray-700 mb-2">Select Supplier</label>
            <select id="supplier-select" value={selectedSupplier} onChange={e => setSelectedSupplier(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-emerald-500 focus:border-emerald-500">
              <option value="" disabled>-- Choose a Supplier --</option>
              {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-2">Select Product</label>
            <select id="product-select" value={selectedProductId ?? ''} onChange={e => setSelectedProductId(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-emerald-500 focus:border-emerald-500">
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Product</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Current Stock</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Forecast Rec.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Avg. Spoilage</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Order Qty</th>
                <th className="px-3 py-3 text-center text-xs font-medium text-emerald-700 uppercase tracking-wider">AI Assist</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedProduct ? (
                <tr className="hover:bg-gray-50" key={selectedProduct.id}>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{selectedProduct.name}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{selectedProduct.current_stock} {selectedProduct.unit}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">{selectedProduct.forecast_rec} {selectedProduct.unit}</td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-red-500">{selectedProduct.spoilage_rate.toFixed(1)}%</td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input type="number" value={orderQuantities[selectedProduct.id] || ''} onChange={e => handleQuantityChange(selectedProduct.id, e.target.value)} min="0" className="w-24 border border-gray-300 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-center">
                    <button type="button" onClick={() => handleGetAIRecommendation(selectedProduct)} disabled={!selectedProduct || aiLoading[selectedProduct.id]} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center disabled:bg-indigo-400 disabled:cursor-not-allowed">
                      {aiLoading[selectedProduct.id] ? <LoadingSpinner/> : '✨ Ask AI'}
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                        Loading products...
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={`mt-6 flex flex-col sm:flex-row ${role === 'manager' ? 'justify-end' : 'justify-center'} space-y-2 sm:space-y-0 sm:space-x-3`}>
          <button type="button" onClick={() => handleSubmit(true)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-200">
            Submit for Approval
          </button>
          {role === 'manager' && (
            <button type="button" onClick={() => handleSubmit(false)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-200">
                Submit Order
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrderPlacement;