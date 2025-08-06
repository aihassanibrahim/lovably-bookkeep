import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Stripe
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.warn('Warning: STRIPE_SECRET_KEY environment variable is not set');
}
const stripe = stripeKey ? new Stripe(stripeKey) : null;

// Stripe checkout session endpoint
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { planId, userId, successUrl, cancelUrl } = req.body;

    if (!planId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Creating Stripe checkout session for:', { planId, userId });

    // Check if we have a valid Stripe configuration
    if (!stripe || !stripeKey || !stripeKey.startsWith('sk_')) {
      console.log('Invalid Stripe configuration, using development mode...');
      
      // Simulate successful payment after 2 seconds
      setTimeout(() => {
        console.log('Simulated payment successful, redirecting to:', successUrl);
      }, 2000);
      
      // Return a mock session ID for development
      res.status(200).json({ 
        sessionId: 'cs_test_mock_session_' + Date.now(),
        isDevelopment: true,
        message: 'Development mode: Payment simulation successful'
      });
      return;
    }

    // Create real Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
               line_items: [
           {
             price: process.env.STRIPE_PRO_PRICE_ID || 'price_test_your_pro_price_id_here', // Pro plan
             quantity: 1,
           },
         ],
      mode: 'subscription',
      success_url: successUrl || `http://localhost:8080/onboarding?success=true&plan=${planId}`,
      cancel_url: cancelUrl || `http://localhost:8080/onboarding?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
        planId,
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
        },
      },
    });

    console.log('Stripe session created:', session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe webhook endpoint
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !endpointSecret) {
    console.warn('Stripe webhook called but Stripe is not configured');
    return res.status(400).json({ error: 'Stripe not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);
      // Here you would typically update your database
      break;
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('Subscription created:', subscription.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stripe API server is running' });
});

app.listen(port, () => {
  console.log(`🚀 Stripe API server running on http://localhost:${port}`);
  console.log(`📝 API endpoints:`);
  console.log(`   POST /api/stripe/create-checkout-session`);
  console.log(`   POST /api/stripe/webhook`);
  console.log(`   GET  /api/health`);
}); 