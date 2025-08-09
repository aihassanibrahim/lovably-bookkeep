import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  getSubscription, 
  getCurrentPlan, 
  subscribeToSubscriptionChanges,
  type Subscription 
} from '@/lib/supabase-stripe';

export const useSupabaseSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro'>('free');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setCurrentPlan('free');
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [sub, plan] = await Promise.all([
          getSubscription(),
          getCurrentPlan()
        ]);
        
        setSubscription(sub);
        setCurrentPlan(plan);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();

    // Subscribe to real-time subscription changes
    const subscription = subscribeToSubscriptionChanges((newSubscription) => {
      setSubscription(newSubscription);
      setCurrentPlan(newSubscription ? 'pro' : 'free');
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [user]);

  const isPro = currentPlan === 'pro';
  const isFree = currentPlan === 'free';
  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';

  return {
    subscription,
    currentPlan,
    loading,
    error,
    isPro,
    isFree,
    hasActiveSubscription,
    refetch: () => {
      if (user) {
        getSubscription().then(setSubscription);
        getCurrentPlan().then(setCurrentPlan);
      }
    }
  };
};
