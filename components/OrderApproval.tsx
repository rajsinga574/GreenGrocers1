import React from 'react';
import type { Order } from '../types';

interface OrderApprovalProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const OrderApproval: React.FC<OrderApprovalProps> = ({ orders, onUpdateStatus }) => {
  const pendingOrders = orders.filter(order => order.status === 'Pending Approval');

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Order Approvals</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Date Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Submitted By</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-emerald-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pendingOrders.length > 0 ? pendingOrders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.supplier}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.quantity} {order.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.placedBy}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button 
                        onClick={() => onUpdateStatus(order.id, 'Approved')}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                    >
                        Approve
                    </button>
                     <button 
                        onClick={() => onUpdateStatus(order.id, 'Rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                    >
                        Reject
                    </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  <p className="font-semibold">No orders are pending approval.</p>
                  <p className="text-sm mt-1">When a team member submits an order, it will appear here for your review.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderApproval;