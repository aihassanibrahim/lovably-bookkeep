import React from 'react';
import ReceiptScanner from '@/components/receipts/ReceiptScanner';

const Receipts: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kvitton & Skattehantering</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Scanna kvitton automatiskt och håll koll på moms och avdrag
        </p>
      </div>
      <ReceiptScanner />
    </div>
  );
};

export default Receipts; 