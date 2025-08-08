import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());

// Webhook must use the raw body for signature verification, so register this route BEFORE express.json()
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

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Payment successful for session:', session.id);
        // Persist subscription as Pro in Supabase
        await upsertUserSubscription({
          userId: session.metadata?.userId,
          planId: session.metadata?.planId || 'pro',
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          status: 'active',
        });
        break;
      }
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        console.log('Subscription created:', subscription.id);
        await updateSubscriptionByCustomer({
          customerId: subscription.customer,
          updates: {
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
        });
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription updated:', subscription.id);
        await updateSubscriptionByCustomer({
          customerId: subscription.customer,
          updates: {
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription deleted:', subscription.id);
        await updateSubscriptionByCustomer({
          customerId: subscription.customer,
          updates: {
            plan_id: 'free',
            status: 'canceled',
            updated_at: new Date().toISOString(),
          },
        });
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// After webhook handler registration, we can parse JSON for remaining routes
app.use(express.json());

// Initialize Stripe
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.warn('Warning: STRIPE_SECRET_KEY environment variable is not set');
}
const stripe = stripeKey ? new Stripe(stripeKey) : null;

// Tax calculation endpoint
app.post('/api/stripe/calculate-tax', async (req, res) => {
  try {
    const { customer, lineItems, currency = 'sek' } = req.body;

    if (!stripe || !stripeKey || !stripeKey.startsWith('sk_')) {
      console.log('Invalid Stripe configuration, using development mode...');
      // Return mock tax calculation for development
      return res.status(200).json({
        tax_breakdown: {
          tax_behavior: 'exclusive',
          taxable_amount: 1000,
          tax_amount: 250,
          breakdown: {
            tax_rates: [
              {
                tax_rate: 'txr_mock_swedish_vat',
                taxable_amount: 1000,
                tax_amount: 250,
                display_name: 'Swedish VAT',
                percentage: 25.0,
                country: 'SE',
                state: null,
                jurisdiction: 'SE',
                inclusive: false
              }
            ]
          }
        },
        isDevelopment: true
      });
    }

    // Create tax calculation using Stripe Tax API
    const calculation = await stripe.tax.calculations.create({
      currency,
      line_items: lineItems,
      customer_details: customer,
      tax_behavior: 'exclusive',
    });

    console.log('Tax calculation created:', calculation.id);
    res.status(200).json(calculation);
  } catch (error) {
    console.error('Error calculating tax:', error);
    res.status(500).json({ error: 'Failed to calculate tax' });
  }
});

// Create tax transaction endpoint
app.post('/api/stripe/create-tax-transaction', async (req, res) => {
  try {
    const { calculation, reference, metadata } = req.body;

    if (!stripe || !stripeKey || !stripeKey.startsWith('sk_')) {
      console.log('Invalid Stripe configuration, using development mode...');
      return res.status(200).json({
        id: 'txn_mock_tax_transaction_' + Date.now(),
        isDevelopment: true
      });
    }

    // Create tax transaction to record collected tax
    const transaction = await stripe.tax.transactions.createFromCalculation({
      calculation,
      reference,
      metadata,
    });

    console.log('Tax transaction created:', transaction.id);
    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error creating tax transaction:', error);
    res.status(500).json({ error: 'Failed to create tax transaction' });
  }
});

// Create tax transaction reversal endpoint (for refunds)
app.post('/api/stripe/create-tax-reversal', async (req, res) => {
  try {
    const { original_transaction, reference, metadata } = req.body;

    if (!stripe || !stripeKey || !stripeKey.startsWith('sk_')) {
      console.log('Invalid Stripe configuration, using development mode...');
      return res.status(200).json({
        id: 'txn_mock_tax_reversal_' + Date.now(),
        isDevelopment: true
      });
    }

    // Create tax transaction reversal for refunds
    const reversal = await stripe.tax.transactions.createReversal({
      original_transaction,
      reference,
      metadata,
    });

    console.log('Tax reversal created:', reversal.id);
    res.status(200).json(reversal);
  } catch (error) {
    console.error('Error creating tax reversal:', error);
    res.status(500).json({ error: 'Failed to create tax reversal' });
  }
});

// Stripe checkout session endpoint
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { planId, userId, successUrl, cancelUrl, customerDetails } = req.body;

    if (!planId || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Creating Stripe checkout session for:', { planId, userId });

    // Check if we have a valid Stripe configuration
    if (!stripe || !stripeKey || !stripeKey.startsWith('sk_')) {
      console.log('Invalid Stripe configuration, using development mode...');
      // Immediately persist subscription upgrade for development/testing
      try {
        await upsertUserSubscription({
          userId,
          planId,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          status: 'active',
        });
      } catch (e) {
        console.error('Dev upsert subscription failed:', e);
      }

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

    // Define line items for tax calculation
    const lineItems = [
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
        taxCalculation = await stripe.tax.calculations.create({
          currency: 'sek',
          line_items: lineItems,
          customer_details: customerDetails,
          tax_behavior: 'exclusive',
        });
        console.log('Tax calculation created for checkout:', taxCalculation.id);
      } catch (taxError) {
        console.error('Error calculating tax for checkout:', taxError);
        // Continue without tax calculation if it fails
      }
    }

    // Create real Stripe checkout session
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID || 'price_test_your_pro_price_id_here',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `http://localhost:8083/?success=true&plan=${planId}`,
      cancel_url: cancelUrl || `http://localhost:8083/?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
        planId,
        taxCalculationId: taxCalculation?.id || '',
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
          taxCalculationId: taxCalculation?.id || '',
        },
      },
    };

    // Add tax calculation to session if available
    if (taxCalculation) {
      sessionConfig.tax_id_collection = {
        enabled: true,
      };
      sessionConfig.customer_update = {
        address: 'auto',
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Stripe session created:', session.id);
    res.status(200).json({ 
      sessionId: session.id,
      taxCalculation: taxCalculation ? {
        id: taxCalculation.id,
        taxAmount: taxCalculation.tax_breakdown.tax_amount,
        totalAmount: taxCalculation.amount_total
      } : null
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Helper: Supabase client (optional in dev). Only initialize if env vars are present
let supabaseServiceClient = null;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (supabaseUrl && supabaseServiceKey) {
  try {
    supabaseServiceClient = createClient(supabaseUrl, supabaseServiceKey);
  } catch (e) {
    console.warn('Failed to initialize Supabase client. Continuing without DB sync.', e);
  }
} else {
  console.warn('Supabase env not configured. Webhook will skip DB updates.');
}

async function upsertUserSubscription({ userId, planId, stripeCustomerId, stripeSubscriptionId, status }) {
  if (!userId) return;
  if (!supabaseServiceClient) {
    console.log('Skipping DB upsert (Supabase not configured)');
    return;
  }
  try {
    const { error } = await supabaseServiceClient
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        plan_id: planId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        status: status || 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      });
    if (error) console.error('Supabase upsert error:', error);
  } catch (e) {
    console.error('Supabase upsert exception:', e);
  }
}

async function updateSubscriptionByCustomer({ customerId, updates }) {
  if (!customerId) return;
  if (!supabaseServiceClient) {
    console.log('Skipping DB update (Supabase not configured)');
    return;
  }
  try {
    const { data: userSub, error: fetchError } = await supabaseServiceClient
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return;
    }
    if (!userSub) return;

    const { error } = await supabaseServiceClient
      .from('user_subscriptions')
      .update(updates)
      .eq('user_id', userSub.user_id);
    if (error) console.error('Supabase update error:', error);
  } catch (e) {
    console.error('Supabase update exception:', e);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Stripe API server is running' });
});

app.listen(port, () => {
  console.log(`🚀 Stripe API server running on http://localhost:${port}`);
  console.log(`📝 API endpoints:`);
  console.log(`   POST /api/stripe/create-checkout-session`);
  console.log(`   POST /api/stripe/calculate-tax`);
  console.log(`   POST /api/stripe/create-tax-transaction`);
  console.log(`   POST /api/stripe/create-tax-reversal`);
  console.log(`   POST /api/stripe/webhook`);
  console.log(`   GET  /api/health`);
  console.log(`💰 Stripe Tax API: ${stripe && stripeKey ? 'Enabled' : 'Development Mode'}`);
}); 