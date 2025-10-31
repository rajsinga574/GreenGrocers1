import React, { useState, useEffect } from 'react';
import type { ItTicket, ItTicketStatus } from '../types';
import { getItTickets } from '../services/apiService';

interface ItTicketListProps {
  status: ItTicketStatus;
  onBack: () => void;
}

const ItTicketList: React.FC<ItTicketListProps> = ({ status, onBack }) => {
  const [tickets, setTickets] = useState<ItTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
        setLoading(true);
        const fetchedTickets = await getItTickets(status);
        setTickets(fetchedTickets);
        setLoading(false);
    };
    fetchTickets();
  }, [status]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{status} Tickets</h2>
        <button 
            onClick={onBack}
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Dashboard
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Ticket ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Requester</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Date Submitted</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                        Loading tickets...
                    </td>
                </tr>
            ) : tickets.length > 0 ? tickets.map((ticket, index) => (
              <tr key={ticket.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ticket.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{ticket.requester}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.date}</td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                        No {status.toLowerCase()} tickets found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItTicketList;
