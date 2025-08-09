import Stripe from 'stripe';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId, successUrl, cancelUrl } = req.body || {};

    const hasSecret = !!process.env.STRIPE_SECRET_KEY;
    const secretPrefix = process.env.STRIPE_SECRET_KEY?.slice(0, 7) || 'NOT_SET';
    const proPriceEnv = process.env.STRIPE_PRO_PRICE_ID || 'NOT_SET';

    console.log('[Stripe] Creating checkout session:', {
      priceId,
      userId,
      successUrl,
      cancelUrl,
      hasSecret,
      secretPrefix,
      proPriceEnv,
    });

    if (!priceId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe not configured: missing STRIPE_SECRET_KEY' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.origin}/dashboard?success=true`,
      cancel_url: cancelUrl || `${req.headers.origin}/pricing?canceled=true`,
      client_reference_id: userId,
      metadata: { userId },
    });

    console.log('[Stripe] Session created:', session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Stripe] Create session error:', message, error);
    res.status(500).json({ error: 'Failed to create checkout session', message });
  }
}
