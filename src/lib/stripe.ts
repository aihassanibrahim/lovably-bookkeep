import { loadStripe } from '@stripe/stripe-js';

// Stripe configuration and pricing plans
// Note: Vite only exposes variables prefixed with VITE_ to the client
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
export const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET;
export const STRIPE_PRO_PRICE_ID = import.meta.env.STRIPE_PRO_PRICE_ID;

// Initialize Stripe (publishable key is required only when redirecting to real Checkout)
export const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : Promise.resolve(null as any);

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

// Stripe Pricing Table ID
export const STRIPE_PRICING_TABLE_ID = 'prctbl_test_your_pricing_table_id_here';

// Stripe price IDs - your actual price IDs
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: 'price_test_your_pro_price_id_here',
  FREE_MONTHLY: 'price_test_your_free_price_id_here'
};

// Feature access checking
export const checkFeatureAccess = (feature: string, plan: 'free' | 'pro'): boolean => {
  const planFeatures = {
    free: [
      'bookkeeping',
      'customer_register',
      'basic_reports',
      'email_support'
    ],
    pro: [
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
    ]
  };

  return planFeatures[plan].includes(feature);
};

// Plan limits checking
export const checkPlanLimits = (resource: string, currentUsage: number, plan: 'free' | 'pro'): boolean => {
  // Add safety check for plan parameter
  if (!plan || !PRICING_PLANS[plan]) {
    console.warn(`Invalid plan: ${plan}, defaulting to free plan`);
    plan = 'free';
  }
  
  const limits = PRICING_PLANS[plan].limits;
  const limit = limits[resource as keyof typeof limits];
  
  if (limit === -1) return true; // Unlimited
  return currentUsage < limit;
}; 