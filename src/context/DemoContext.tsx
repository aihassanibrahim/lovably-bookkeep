import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DemoContextType {
  isDemoMode: boolean;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  demoData: {
    orders: any[];
    products: any[];
    customers: any[];
    suppliers: any[];
    transactions: any[];
  };
  addDemoOrder: (orderData: any) => Promise<void>;
  addDemoProduct: (productData: any) => Promise<void>;
  addDemoCustomer: (customerData: any) => Promise<void>;
  addDemoTransaction: (transactionData: any) => Promise<void>;
  clearDemoData: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Demo data för att visa hur systemet fungerar
const initialDemoData = {
  orders: [
    {
      id: 'demo-1',
      order_number: 'ORD-001',
      customer_name: 'Anna Andersson',
      customer_social_media: '@anna_handmade',
      product_name: 'Handgjord halsband',
      price: 299,
      status: 'Beställd',
      order_date: '2025-08-01',
      estimated_completion: '2025-08-10'
    },
    {
      id: 'demo-2', 
      order_number: 'ORD-002',
      customer_name: 'Erik Eriksson',
      customer_social_media: '@erik_creative',
      product_name: 'Personligad träskål',
      price: 450,
      status: 'Pågående',
      order_date: '2025-08-02',
      estimated_completion: '2025-08-15'
    }
  ],
  products: [
    {
      id: 'demo-1',
      name: 'Handgjord halsband',
      category: 'Smycken',
      price: 299,
      description: 'Unikt handgjort halsband i silver'
    },
    {
      id: 'demo-2',
      name: 'Personligad träskål',
      category: 'Träarbete',
      price: 450,
      description: 'Handsnidad träskål med personlig gravyr'
    }
  ],
  customers: [
    {
      id: 'demo-1',
      name: 'Anna Andersson',
      email: 'anna@example.com',
      phone: '070-123 45 67',
      social_media: '@anna_handmade'
    },
    {
      id: 'demo-2',
      name: 'Erik Eriksson', 
      email: 'erik@example.com',
      phone: '070-987 65 43',
      social_media: '@erik_creative'
    }
  ],
  suppliers: [
    {
      id: 'demo-1',
      name: 'Silver & Co',
      email: 'info@silverco.se',
      phone: '08-123 45 67',
      category: 'Material'
    }
  ],
  transactions: [
    {
      id: 'demo-1',
      transaction_date: '2025-08-01',
      description: 'Försäljning halsband',
      total_amount: 299,
      transaction_type: 'income',
      category: 'sales'
    },
    {
      id: 'demo-2',
      transaction_date: '2025-08-02', 
      description: 'Köp silvermaterial',
      total_amount: 150,
      transaction_type: 'expense',
      category: 'materials'
    }
  ]
};

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoData, setDemoData] = useState(initialDemoData);

  // Kontrollera om användaren är i demo-läge
  useEffect(() => {
    const demoMode = localStorage.getItem('bizpal-demo-mode') === 'true';
    setIsDemoMode(demoMode);
  }, []);

  const enableDemoMode = () => {
    setIsDemoMode(true);
    localStorage.setItem('bizpal-demo-mode', 'true');
    toast.success('Demo-läge aktiverat! Du kan nu testa systemet utan att spara data.');
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem('bizpal-demo-mode');
    toast.success('Demo-läge inaktiverat. Nu sparas all data permanent.');
  };

  const addDemoOrder = async (orderData: any) => {
    const newOrder = {
      id: `demo-${Date.now()}`,
      ...orderData,
      created_at: new Date().toISOString()
    };
    
    setDemoData(prev => ({
      ...prev,
      orders: [...prev.orders, newOrder]
    }));
    
    toast.success('Demo-order skapad! (Data sparas inte permanent)');
  };

  const addDemoProduct = async (productData: any) => {
    const newProduct = {
      id: `demo-${Date.now()}`,
      ...productData,
      created_at: new Date().toISOString()
    };
    
    setDemoData(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
    
    toast.success('Demo-produkt skapad! (Data sparas inte permanent)');
  };

  const addDemoCustomer = async (customerData: any) => {
    const newCustomer = {
      id: `demo-${Date.now()}`,
      ...customerData,
      created_at: new Date().toISOString()
    };
    
    setDemoData(prev => ({
      ...prev,
      customers: [...prev.customers, newCustomer]
    }));
    
    toast.success('Demo-kund skapad! (Data sparas inte permanent)');
  };

  const addDemoTransaction = async (transactionData: any) => {
    const newTransaction = {
      id: `demo-${Date.now()}`,
      ...transactionData,
      created_at: new Date().toISOString()
    };
    
    setDemoData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction]
    }));
    
    toast.success('Demo-transaktion skapad! (Data sparas inte permanent)');
  };

  const clearDemoData = () => {
    setDemoData(initialDemoData);
    toast.success('Demo-data återställd!');
  };

  const value = {
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    demoData,
    addDemoOrder,
    addDemoProduct,
    addDemoCustomer,
    addDemoTransaction,
    clearDemoData
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}; 