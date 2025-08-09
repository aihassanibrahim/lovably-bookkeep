import { supabase } from '../integrations/supabase/client';

// Supabase Stripe integration types
export interface Subscription {
  id: string;
  user_id: string;
  status: 'trialing' | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'unpaid';
  price_id: string;
  quantity: number;
  cancel_at_period_end: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
}

export interface Price {
  id: string;
  product_id: string;
  active: boolean;
  description: string | null;
  unit_amount: number;
  currency: string;
  type: 'one_time' | 'recurring';
  interval: 'day' | 'week' | 'month' | 'year' | null;
  interval_count: number | null;
  trial_period_days: number | null;
  metadata: Record<string, string>;
}

export interface Product {
  id: string;
  active: boolean;
  name: string;
  description: string | null;
  image: string | null;
  metadata: Record<string, string>;
}

// Pricing plans configuration
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'SEK',
    interval: 'month',
    features: [
      'Bokföring',
      'Kundregister',
      'Upp till 10 transaktioner/månad',
      'Upp till 5 kunder',
      'Grundläggande rapporter',
      'E-post support'
    ],
    limits: {
      transactions: 10,
      customers: 5,
      products: 10,
      orders: 10,
      expenses: 10
    }
  },
  pro: {
    name: 'Pro',
    price: 99,
    currency: 'SEK',
    interval: 'mån',
    features: [
      'Allt i Free-planen',
      'Kvittoscanning',
      'Momsrapportering',
      'Obegränsade transaktioner',
      'Obegränsade kunder',
      'Avancerade rapporter',
      'Export till Excel/PDF',
      'Prioriterad support',
      'API-åtkomst'
    ],
    limits: {
      transactions: -1, // Unlimited
      customers: -1, // Unlimited
      products: -1, // Unlimited
      orders: -1, // Unlimited
      expenses: -1 // Unlimited
    }
  }
};

// Get user's current subscription
export const getSubscription = async (): Promise<Subscription | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
};

// Get all available prices
export const getPrices = async (): Promise<Price[]> => {
  try {
    const { data, error } = await supabase
      .from('prices')
      .select('*')
      .eq('active', true)
      .order('unit_amount');

    if (error) {
      console.error('Error fetching prices:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting prices:', error);
    return [];
  }
};

// Get products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true);

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

// Create checkout session
export const createCheckoutSession = async (priceId: string): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId: user.id,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
};

// Create customer portal session
export const createPortalSession = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        returnUrl: `${window.location.origin}/dashboard`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create portal session');
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    return null;
  }
};

// Check if user has access to a feature
export const checkFeatureAccess = (feature: string, subscription: Subscription | null): boolean => {
  if (!subscription) {
    // Free plan features
    const freeFeatures = [
      'bookkeeping',
      'customer_register',
      'basic_reports',
      'email_support'
    ];
    return freeFeatures.includes(feature);
  }

  // Pro plan features
  const proFeatures = [
    'bookkeeping',
    'customer_register',
    'basic_reports',
    'email_support',
    'receipt_scanning',
    'vat_reporting',
    'unlimited_transactions',
    'unlimited_customers',
    'advanced_reports',
    'export',
    'priority_support',
    'api_access'
  ];

  return proFeatures.includes(feature);
};

// Check plan limits
export const checkPlanLimits = (resource: string, currentUsage: number, subscription: Subscription | null): boolean => {
  if (!subscription) {
    // Free plan limits
    const freeLimits = {
      transactions: 10,
      customers: 5,
      products: 10,
      orders: 10,
      expenses: 10
    };
    const limit = freeLimits[resource as keyof typeof freeLimits];
    return currentUsage < limit;
  }

  // Pro plan has unlimited usage
  return true;
};

// Get current user's plan
export const getCurrentPlan = async (): Promise<'free' | 'pro'> => {
  const subscription = await getSubscription();
  return subscription ? 'pro' : 'free';
};

// Subscribe to subscription changes
export const subscribeToSubscriptionChanges = (callback: (subscription: Subscription | null) => void) => {
  const { data: { user } } = supabase.auth.getUser();
  if (!user) return null;

  return supabase
    .channel('subscription-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'subscriptions',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          callback(payload.new as Subscription);
        } else if (payload.eventType === 'DELETE') {
          callback(null);
        }
      }
    )
    .subscribe();
};
