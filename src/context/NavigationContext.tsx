import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  enabled: boolean;
}

interface NavigationContextType {
  mobileNavItems: NavigationItem[];
  updateMobileNavItems: (items: NavigationItem[]) => void;
  saveMobileNavPreferences: () => Promise<void>;
  loading: boolean;
}

const defaultNavItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: 'Home', enabled: true },
  { name: 'Ordrar', href: '/orders', icon: 'Package', enabled: true },
  { name: 'Fakturor', href: '/invoices', icon: 'FileText', enabled: true },
  { name: 'Produkter', href: '/products', icon: 'ShoppingBag', enabled: true },
  { name: 'Ekonomi', href: '/transactions', icon: 'DollarSign', enabled: true },
  { name: 'Kvitton', href: '/receipts', icon: 'FileText', enabled: true },
  { name: 'Kunder', href: '/customers', icon: 'Users', enabled: false },
  { name: 'Produktion', href: '/production', icon: 'Clock', enabled: false },
  { name: 'Lager', href: '/inventory', icon: 'Building2', enabled: false },
  { name: 'Leverantörer', href: '/suppliers', icon: 'Truck', enabled: false },
  { name: 'Rapporter', href: '/reports', icon: 'BarChart3', enabled: false },
];

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileNavItems, setMobileNavItems] = useState<NavigationItem[]>(defaultNavItems);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchMobileNavPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMobileNavPreferences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_preferences')
        .select('mobile_nav_items')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching navigation preferences:', error);
      }

      if (data?.mobile_nav_items) {
        setMobileNavItems(data.mobile_nav_items);
      }
    } catch (error) {
      console.error('Error fetching navigation preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMobileNavItems = (items: NavigationItem[]) => {
    setMobileNavItems(items);
  };

  const saveMobileNavPreferences = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          mobile_nav_items: mobileNavItems,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving navigation preferences:', error);
      throw error;
    }
  };

  const value = {
    mobileNavItems,
    updateMobileNavItems,
    saveMobileNavPreferences,
    loading
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}; 