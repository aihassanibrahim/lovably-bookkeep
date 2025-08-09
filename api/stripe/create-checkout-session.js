const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

module.exports = async (req, res) => {
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
    const { priceId, userId, successUrl, cancelUrl } = req.body;

    console.log('Environment variables check:');
    console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
    console.log('STRIPE_SECRET_KEY starts with:', process.env.STRIPE_SECRET_KEY?.substring(0, 10));
    console.log('Price ID received:', priceId);
    console.log('User ID received:', userId);

    if (!priceId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Create checkout session
    console.log('Creating Stripe checkout session with price ID:', priceId);
    
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
      metadata: {
        userId: userId,
      },
    });

    console.log('Stripe session created successfully:', session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
