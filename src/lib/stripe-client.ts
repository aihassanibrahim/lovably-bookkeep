import { stripePromise } from './stripe';
import { STRIPE_PRICE_IDS } from './stripe';

// Redirect to Stripe Checkout
export const redirectToCheckout = async (planId: string, userId: string) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Get the correct price ID based on plan
    const priceId = planId === 'pro' ? STRIPE_PRICE_IDS.PRO_MONTHLY : STRIPE_PRICE_IDS.FREE_MONTHLY;
    
    // For now, use a simple redirect to Stripe Checkout
    // In production, you would create a checkout session first
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: `${window.location.origin}/dashboard?success=true`,
      cancelUrl: `${window.location.origin}/pricing?canceled=true`,
      clientReferenceId: userId,
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    // Fallback to mock checkout for now
    console.log('Falling back to mock checkout...');
    await mockCheckout(planId);
  }
};

// Create customer portal session
export const createCustomerPortalSession = async (userId: string) => {
  try {
    const response = await fetch('/api/create-portal-session', {
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
      throw new Error('Failed to create portal session');
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

export const mockCheckout = async (planId: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    message: `Mock checkout successful for ${planId} plan`,
  };
}; 