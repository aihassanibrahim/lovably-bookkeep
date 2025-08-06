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

    // Ensure plan_id is valid
    const planId = subscription.plan_id as 'free' | 'pro';
    if (!planId || !PRICING_PLANS[planId]) {
      console.warn(`Invalid subscription plan_id: ${subscription.plan_id}, defaulting to free`);
      return false;
    }

    const currentPlan = PRICING_PLANS[planId];
    if (!currentPlan) return false;

    // Check feature access
    if (action === 'use_feature' && feature) {
      return checkFeatureAccess(subscription.plan_id, feature);
    }

    // Check plan limits
    if (action === 'add_transaction' || action === 'add_customer') {
      const resource = action === 'add_transaction' ? 'transactions' : 'customers';
      const currentUsage = action === 'add_transaction' 
        ? (usage?.transactions_count || 0)
        : (usage?.customers_count || 0);
      
      return checkPlanLimits(resource, currentUsage, planId);
    }

    return true;
  };

  // Get current plan info
  const getCurrentPlan = () => {
    if (!subscription) return PRICING_PLANS.free;
    
    const planId = subscription.plan_id as 'free' | 'pro';
    if (!planId || !PRICING_PLANS[planId]) {
      console.warn(`Invalid subscription plan_id: ${subscription.plan_id}, defaulting to free`);
      return PRICING_PLANS.free;
    }
    
    return PRICING_PLANS[planId];
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