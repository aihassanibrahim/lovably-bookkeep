import { loadStripe } from '@stripe/stripe-js';

// Stripe public key - replace with your actual key
const STRIPE_PUBLISHABLE_KEY = process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key_here';

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Pricing plans configuration
export const PRICING_PLANS = {
  FREE: {
    id: 'free',
    name: 'Gratis',
    price: 0,
    currency: 'SEK',
    interval: 'month',
    features: [
      'Bokföring (max 50 transaktioner/månad)',
      'Kundregister (max 20 kunder)',
      'Grundläggande rapporter',
      'E-post support'
    ],
    limits: {
      transactions: 50,
      customers: 20
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 99,
    currency: 'SEK',
    interval: 'month',
    features: [
      'Obegränsad bokföring',
      'Obegränsat kundregister',
      'Kvittoscanning med AI',
      'Momsrapportering',
      'Export till Excel/PDF',
      'Prioriterad support',
      'Avancerade rapporter'
    ],
    limits: {
      transactions: -1, // Unlimited
      customers: -1 // Unlimited
    }
  }
};

// Stripe configuration
export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51Rt4jwBK2aelwOoZSywqmWu1HwUXgggEnUuIB7RgX11jRv5owMJSC7uekpyVXrN2XlRChyGFrYnFZik30em1jfif00Sp4DWa9e';

// Stripe Pricing Table ID
export const STRIPE_PRICING_TABLE_ID = 'prctbl_1Rt5kxBK2aelwOoZMbCtsMWM';

// Stripe price IDs - replace with your actual price IDs
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: 'price_1Rt5J1BK2aelwOoZwlbWikOe',
  FREE_MONTHLY: 'price_1Rt5IaBK2aelwOoZUhe1kzdl'
};

// Check if user has access to feature based on their plan
export const checkFeatureAccess = (userPlan: string, feature: string): boolean => {
  const plan = PRICING_PLANS[userPlan as keyof typeof PRICING_PLANS];
  
  if (!plan) return false;
  
  switch (feature) {
    case 'receipt_scanning':
      return userPlan === 'PRO';
    case 'advanced_reports':
      return userPlan === 'PRO';
    case 'export':
      return userPlan === 'PRO';
    case 'priority_support':
      return userPlan === 'PRO';
    default:
      return true;
  }
};

// Check if user has reached their plan limits
export const checkPlanLimits = (
  userPlan: string, 
  currentUsage: { transactions: number; customers: number }
): { canAddTransaction: boolean; canAddCustomer: boolean } => {
  const plan = PRICING_PLANS[userPlan as keyof typeof PRICING_PLANS];
  
  if (!plan) {
    return { canAddTransaction: false, canAddCustomer: false };
  }
  
  const canAddTransaction = plan.limits.transactions === -1 || 
    currentUsage.transactions < plan.limits.transactions;
    
  const canAddCustomer = plan.limits.customers === -1 || 
    currentUsage.customers < plan.limits.customers;
    
  return { canAddTransaction, canAddCustomer };
}; 