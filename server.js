import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
}) : null;

// Debug endpoint
app.get('/api/debug', (req, res) => {
  try {
    const envCheck = {
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasStripePriceId: !!process.env.STRIPE_PRO_PRICE_ID,
      hasViteStripePriceId: !!process.env.VITE_STRIPE_PRO_PRICE_ID,
      stripeSecretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'NOT_SET',
      supabaseServiceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) || 'NOT_SET',
      stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'NOT_SET',
      viteStripePriceId: process.env.VITE_STRIPE_PRO_PRICE_ID || 'NOT_SET'
    };

    res.json({
      message: 'Debug endpoint working',
      timestamp: new Date().toISOString(),
      environment: envCheck
    });
  } catch (error) {
    res.status(500).json({
      error: 'Debug endpoint failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Create checkout session
app.post('/api/stripe/create-checkout-session', async (req, res) => {
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

    if (!stripe) {
      console.log('Stripe not configured, returning mock response');
      return res.json({ 
        sessionId: 'cs_test_mock_session_' + Date.now(),
        isDevelopment: true,
        message: 'Development mode: Mock session created'
      });
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
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 