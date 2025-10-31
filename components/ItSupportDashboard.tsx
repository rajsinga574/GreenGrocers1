import React, { useState, useEffect } from 'react';
import type { ItTicketStatus } from '../types';
import { getItTicketCounts } from '../services/apiService';

interface ItSupportDashboardProps {
  showModal: (title: string, body: string) => void;
  onShowTicketList: (status: ItTicketStatus) => void;
}

const StatusCard: React.FC<{ title: string; count: number; color: string; icon: React.ReactNode; onClick: () => void;}> = ({ title, count, color, icon, onClick }) => (
    <div 
        onClick={onClick}
        className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border-l-4 ${color}`}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-4xl font-bold text-gray-800">{count}</p>
            </div>
            <div>
                {icon}
            </div>
        </div>
    </div>
);

const OpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const InProgressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CompletedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const ItSupportDashboard: React.FC<ItSupportDashboardProps> = ({ showModal, onShowTicketList }) => {
  const [ticketCounts, setTicketCounts] = useState<Record<ItTicketStatus, number> | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
        const counts = await getItTicketCounts();
        setTicketCounts(counts);
    };
    fetchCounts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ticket Status Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusCard 
                title="Open Tickets"
                count={ticketCounts?.Open ?? 0}
                color="border-red-500"
                icon={<OpenIcon />}
                onClick={() => onShowTicketList('Open')}
            />
            <StatusCard 
                title="In Progress"
                count={ticketCounts?.['In Progress'] ?? 0}
                color="border-blue-500"
                icon={<InProgressIcon />}
                onClick={() => onShowTicketList('In Progress')}
            />
            <StatusCard 
                title="Completed"
                count={ticketCounts?.Completed ?? 0}
                color="border-emerald-500"
                icon={<CompletedIcon />}
                onClick={() => onShowTicketList('Completed')}
            />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-3">System Maintenance</h3>
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-xl mt-4">
            <h4 className="text-lg font-bold text-emerald-800 mb-3">Data Pipeline Control</h4>
            <div className="flex items-center mb-4">
                <p className="text-gray-700 mr-2">Pipeline Status: </p>
                <span className="flex items-center text-green-700 font-semibold">
                    <span className="relative flex h-3 w-3 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Ready
                </span>
            </div>
            <button 
              onClick={() => showModal('Pipeline Triggered', 'Simulating manual data refresh from all data sources. This may take a few minutes.')} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md">
              Manual Data Pipeline Refresh
            </button>
        </div>
      </div>
    </div>
  );
};

export default ItSupportDashboard;
