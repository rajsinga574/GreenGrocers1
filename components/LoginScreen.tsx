import React from 'react';
import type { Role } from '../types';
import { LEAF_SVG } from '../constants';

interface LoginScreenProps {
  onLogin: (role: Role) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col items-center justify-center text-center p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-4">
            {LEAF_SVG}
            <h1 className="text-4xl font-bold text-emerald-700">
                Green Grocerers
            </h1>
        </div>
        
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-emerald-900 tracking-tight mb-4 animate-fade-in-down">
          Inventory Management Reimagined
        </h2>
        
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-in-up">
          Transform your perishable inventory operations with our integrated, data-driven platform. Built for 300+ locations nationwide.
        </p>

        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md w-full mx-auto animate-fade-in">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Select Your Role to Begin</h3>
          <div className="space-y-4">
            <button 
              onClick={() => onLogin('store-employee')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Store Employee
            </button>
            <button 
              onClick={() => onLogin('manager')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Store Manager
            </button>
            <button 
              onClick={() => onLogin('it-support')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              IT Admin
            </button>
            <button 
              onClick={() => onLogin('leadership')}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Leadership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;