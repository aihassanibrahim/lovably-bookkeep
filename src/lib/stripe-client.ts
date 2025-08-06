import { stripePromise } from './stripe';
import { STRIPE_PRO_PRICE_ID } from './stripe';

// Redirect to Stripe Checkout
export const redirectToCheckout = async (planId: string, userId: string) => {
  try {
    console.log(`Creating Stripe checkout session for ${planId} plan...`);
    
    // Create checkout session
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        userId,
        successUrl: `${window.location.origin}/dashboard?success=true&plan=${planId}`,
        cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    // Redirect to Stripe Checkout
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