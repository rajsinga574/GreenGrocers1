import React from 'react';
import type { Role, Page } from '../types';
import { LEAF_SVG } from '../constants';

interface HeaderProps {
  role: Role;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const getTodayDate = () => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const NavLink: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode }> = ({ page, currentPage, onNavigate, children }) => {
  const isActive = page === currentPage;
  const activeClass = 'active text-emerald-700 border-b-2 border-emerald-600';
  const inactiveClass = 'text-gray-500 hover:text-emerald-700';
  return (
    <button onClick={() => onNavigate(page)} className={`nav-link px-3 py-2 text-sm font-medium ${isActive ? activeClass : inactiveClass}`}>
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ role, currentPage, onNavigate, onLogout }) => {
  const roleNameMapping: Record<Exclude<Role, null>, string> = {
    'manager': 'Store Manager',
    'store-employee': 'Store Employee',
    'it-support': 'IT Admin',
    'leadership': 'Leadership',
  };
  const roleName = role ? roleNameMapping[role] : '';


  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md rounded-xl p-4 mb-6 sticky top-4 z-10">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-700 flex items-center">
          {LEAF_SVG}
          Green Grocerers
        </h1>
        <div className="text-right mt-2 sm:mt-0">
          <p className="text-lg font-semibold text-gray-800">{roleName}</p>
          <p className="text-sm text-gray-500">
            {getTodayDate()}
            <button onClick={onLogout} className="font-semibold text-red-500 hover:text-red-700 ml-2"> (Logout)</button>
          </p>
        </div>
      </div>
      <nav className="flex space-x-4 mt-4 border-b border-gray-200">
        {role === 'manager' && (
          <>
            <NavLink page="manager-dashboard" currentPage={currentPage} onNavigate={onNavigate}>Dashboard</NavLink>
            <NavLink page="order-placement" currentPage={currentPage} onNavigate={onNavigate}>Order Placement</NavLink>
            <NavLink page="order-history" currentPage={currentPage} onNavigate={onNavigate}>Order History</NavLink>
            <NavLink page="order-approval" currentPage={currentPage} onNavigate={onNavigate}>Approvals</NavLink>
            <NavLink page="forecast" currentPage={currentPage} onNavigate={onNavigate}>Forecast</NavLink>
          </>
        )}
        {role === 'store-employee' && (
          <>
            <NavLink page="order-placement" currentPage={currentPage} onNavigate={onNavigate}>Order Placement</NavLink>
            <NavLink page="order-history" currentPage={currentPage} onNavigate={onNavigate}>Order History</NavLink>
          </>
        )}
        {role === 'it-support' && (
          <NavLink page="maintenance" currentPage={currentPage} onNavigate={onNavigate}>System Maintenance</NavLink>
        )}
        {role === 'leadership' && (
          <>
            <NavLink page="kpi-dashboard" currentPage={currentPage} onNavigate={onNavigate}>KPI Dashboard</NavLink>
            <NavLink page="pos-data" currentPage={currentPage} onNavigate={onNavigate}>Sales Summary</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;