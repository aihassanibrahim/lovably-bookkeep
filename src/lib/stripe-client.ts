import { stripePromise } from './stripe';
import { STRIPE_PRO_PRICE_ID } from './stripe';

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

// Redirect to Stripe Checkout with tax calculation
export const redirectToCheckout = async (
  planId: string, 
  userId: string, 
  customerDetails?: CustomerDetails
) => {
  try {
    console.log(`Creating Stripe checkout session for ${planId} plan...`);
    
    // For development, use real Stripe checkout (remove simulation)
    console.log('Creating real Stripe checkout session...');
    
    // Define line items for tax calculation
    const lineItems: LineItem[] = [
      {
        amount: 1000, // Amount in cents (10 SEK)
        reference: 'pro_plan_subscription',
        tax_behavior: 'exclusive',
        tax_code: 'txcd_99999999', // General tax code
      },
    ];

    // Calculate tax if customer details are provided
    let taxCalculation = null;
    if (customerDetails) {
      try {
        taxCalculation = await calculateTax(customerDetails, lineItems, 'sek');
        console.log('Tax calculation completed:', taxCalculation.id);
      } catch (taxError) {
        console.error('Tax calculation failed, proceeding without tax:', taxError);
      }
    }
    
    // Use Stripe API (works in both dev and production)
    const apiUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
    const response = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        userId,
        customerDetails,
        successUrl: `${window.location.origin}/?success=true&plan=${planId}`,
        cancelUrl: `${window.location.origin}/?canceled=true`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const responseData = await response.json();
    const { sessionId, isDevelopment, taxCalculation: sessionTaxCalculation } = responseData;
    
    if (isDevelopment) {
      console.log('Development mode: Simulating payment success...');
      // In development mode, redirect directly to success URL
      setTimeout(() => {
        window.location.href = `${window.location.origin}/?success=true&plan=${planId}`;
      }, 1000);
      return;
    }
    
    // Redirect to real Stripe Checkout
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw error;
    }
    
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