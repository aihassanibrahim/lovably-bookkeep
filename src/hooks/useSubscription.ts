import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { PRICING_PLANS, checkFeatureAccess, checkPlanLimits } from '@/lib/stripe';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface UserUsage {
  id: string;
  user_id: string;
  month: string;
  transactions_count: number;
  customers_count: number;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  // Load user subscription
  const loadSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      setSubscription(data || {
        id: '',
        user_id: user.id,
        plan_id: 'free',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error loading subscription:', err);
      setError('Kunde inte ladda prenumerationsinformation');
    }
  };

  // Load user usage
  const loadUsage = async () => {
    if (!user) {
      setUsage(null);
      return;
    }

    try {
      const currentMonth = getCurrentMonth();
      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setUsage(data || {
        id: '',
        user_id: user.id,
        month: currentMonth,
        transactions_count: 0,
        customers_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error loading usage:', err);
    }
  };

  // Update usage
  const updateUsage = async (type: 'transactions' | 'customers', increment: number = 1) => {
    if (!user || !usage) return;

    try {
      const newCount = type === 'transactions' 
        ? usage.transactions_count + increment
        : usage.customers_count + increment;

      const { data, error } = await supabase
        .from('user_usage')
        .upsert({
          id: usage.id || undefined,
          user_id: user.id,
          month: usage.month,
          transactions_count: type === 'transactions' ? newCount : usage.transactions_count,
          customers_count: type === 'customers' ? newCount : usage.customers_count,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      setUsage(data);
    } catch (err) {
      console.error('Error updating usage:', err);
    }
  };

  // Check if user can perform action
  const canPerformAction = (action: 'add_transaction' | 'add_customer' | 'use_feature', feature?: string) => {
    if (!subscription) return false;

    const currentPlan = PRICING_PLANS[subscription.plan_id as keyof typeof PRICING_PLANS];
    if (!currentPlan) return false;

    // Check feature access
    if (action === 'use_feature' && feature) {
      return checkFeatureAccess(subscription.plan_id, feature);
    }

    // Check plan limits
    if (action === 'add_transaction' || action === 'add_customer') {
      const limits = checkPlanLimits(subscription.plan_id, {
        transactions: usage?.transactions_count || 0,
        customers: usage?.customers_count || 0,
      });

      return action === 'add_transaction' ? limits.canAddTransaction : limits.canAddCustomer;
    }

    return true;
  };

  // Get current plan info
  const getCurrentPlan = () => {
    if (!subscription) return PRICING_PLANS.FREE;
    return PRICING_PLANS[subscription.plan_id as keyof typeof PRICING_PLANS] || PRICING_PLANS.FREE;
  };

  // Check if user is on free plan
  const isFreePlan = () => {
    return subscription?.plan_id === 'free';
  };

  // Check if user is on pro plan
  const isProPlan = () => {
    return subscription?.plan_id === 'pro';
  };

  // Check if subscription is active
  const isActive = () => {
    return subscription?.status === 'active';
  };

  // Load data on mount and when user changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    Promise.all([loadSubscription(), loadUsage()]).finally(() => {
      setLoading(false);
    });
  }, [user]);

  return {
    subscription,
    usage,
    loading,
    error,
    updateUsage,
    canPerformAction,
    getCurrentPlan,
    isFreePlan,
    isProPlan,
    isActive,
    reload: () => {
      setLoading(true);
      Promise.all([loadSubscription(), loadUsage()]).finally(() => {
        setLoading(false);
      });
    },
  };
}; 