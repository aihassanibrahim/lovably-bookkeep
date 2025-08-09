import { stripePromise } from './stripe';

// Tax calculation interface
export interface CustomerDetails {
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  address_source: 'billing' | 'shipping';
}

export interface LineItem {
  amount: number;
  reference: string;
  tax_behavior: 'exclusive' | 'inclusive' | 'unspecified';
  tax_code?: string;
}

// Calculate tax for a transaction
export const calculateTax = async (
  customerDetails: CustomerDetails,
  lineItems: LineItem[],
  currency: string = 'sek'
) => {
  try {
    const apiUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
    const response = await fetch(`${apiUrl}/api/stripe/calculate-tax`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: customerDetails,
        lineItems,
        currency,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to calculate tax');
    }

    const calculation = await response.json();
    return calculation;
  } catch (error) {
    console.error('Error calculating tax:', error);
    throw error;
  }
};

// Create tax transaction
export const createTaxTransaction = async (
  calculationId: string,
  reference: string,
  metadata: Record<string, string> = {}
) => {
  try {
    const apiUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
    const response = await fetch(`${apiUrl}/api/stripe/create-tax-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        calculation: calculationId,
        reference,
        metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create tax transaction');
    }

    const transaction = await response.json();
    return transaction;
  } catch (error) {
    console.error('Error creating tax transaction:', error);
    throw error;
  }
};

// Create tax reversal for refunds
export const createTaxReversal = async (
  originalTransactionId: string,
  reference: string,
  metadata: Record<string, string> = {}
) => {
  try {
    const apiUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
    const response = await fetch(`${apiUrl}/api/stripe/create-tax-reversal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        original_transaction: originalTransactionId,
        reference,
        metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create tax reversal');
    }

    const reversal = await response.json();
    return reversal;
  } catch (error) {
    console.error('Error creating tax reversal:', error);
    throw error;
  }
};

// Redirect to Stripe Checkout (production + dev)
export const redirectToCheckout = async (
  planId: string,
  userId: string,
  _customerDetails?: CustomerDetails
) => {
  try {
    console.log(`Creating Stripe checkout session for ${planId} plan...`);

    const priceId = import.meta.env.VITE_STRIPE_PRO_PRICE_ID;
    if (!priceId) {
      throw new Error('Missing VITE_STRIPE_PRO_PRICE_ID');
    }

    const apiUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
    const response = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();

    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({ sessionId });
    if (error) throw error;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

// Create customer portal session
export const createCustomerPortalSession = async (userId: string) => {
  try {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
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
    throw error;
  }
};

export const redirectToCustomerPortal = async (userId: string) => {
  try {
    const url = await createCustomerPortalSession(userId);
    window.location.href = url;
  } catch (error) {
    console.error('Error redirecting to portal:', error);
    throw error;
  }
}; 