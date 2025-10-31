
import React from 'react';

interface ModalProps {
  title: string;
  body: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, body, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all scale-95 hover:scale-100">
        <h3 className="text-xl font-bold mb-3 text-emerald-700">{title}</h3>
        <p className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
        <button 
          onClick={onClose} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
