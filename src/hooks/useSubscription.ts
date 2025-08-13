import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { getProductByPriceId } from '@/stripe-config';

interface SubscriptionData {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('stripe_user_subscriptions')
          .select('*')
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        setSubscription(data);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const getSubscriptionPlan = () => {
    if (!subscription || !subscription.price_id) {
      return null;
    }

    const product = getProductByPriceId(subscription.price_id);
    return product ? product.name : 'Unknown Plan';
  };

  const isActive = () => {
    return subscription?.subscription_status === 'active';
  };

  const isTrialing = () => {
    return subscription?.subscription_status === 'trialing';
  };

  const isCanceled = () => {
    return subscription?.subscription_status === 'canceled';
  };

  const getCurrentPeriodEnd = () => {
    if (!subscription?.current_period_end) {
      return null;
    }
    return new Date(subscription.current_period_end * 1000);
  };

  return {
    subscription,
    loading,
    error,
    getSubscriptionPlan,
    isActive,
    isTrialing,
    isCanceled,
    getCurrentPeriodEnd,
  };
};