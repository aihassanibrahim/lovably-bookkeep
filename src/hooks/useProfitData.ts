import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface ProfitData {
  total_revenue: number;
  total_expenses: number;
  profit_before_tax: number;
  profit_after_tax: number;
  net_vat: number;
}

export const useProfitData = () => {
  const { user } = useAuth();
  const [profitData, setProfitData] = useState<ProfitData>({
    total_revenue: 0,
    total_expenses: 0,
    profit_before_tax: 0,
    profit_after_tax: 0,
    net_vat: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfitData();
    }
  }, [user]);

  const fetchProfitData = async () => {
    if (!user) return;

    setLoading(true);
    
    try {
      // Fetch orders (revenue)
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, vat_amount')
        .eq('user_id', user.id)
        .eq('status', 'paid');

      if (ordersError) throw ordersError;

      // Fetch expenses
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('total_amount, vat_amount')
        .eq('user_id', user.id);

      if (expensesError) throw expensesError;

      // Calculate totals
      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.total_amount, 0) || 0;
      const revenueVat = orders?.reduce((sum, order) => sum + order.vat_amount, 0) || 0;
      const expenseVat = expenses?.reduce((sum, expense) => sum + expense.vat_amount, 0) || 0;
      
      const profitBeforeTax = totalRevenue - totalExpenses;
      // Simplified tax calculation (assuming 20% corporate tax rate)
      const profitAfterTax = profitBeforeTax > 0 ? profitBeforeTax * 0.8 : profitBeforeTax;
      const netVat = revenueVat - expenseVat;

      setProfitData({
        total_revenue: totalRevenue,
        total_expenses: totalExpenses,
        profit_before_tax: profitBeforeTax,
        profit_after_tax: profitAfterTax,
        net_vat: netVat,
      });
    } catch (error) {
      console.error('Error fetching profit data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { profitData, loading, refetch: fetchProfitData };
};