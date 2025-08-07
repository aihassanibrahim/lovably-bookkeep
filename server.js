pimport express from 'express';
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
      
      // Create tax transaction if tax calculation exists
      if (session.metadata?.taxCalculationId) {
        try {
          const taxTransaction = await stripe.tax.transactions.createFromCalculation({
            calculation: session.metadata.taxCalculationId,
            reference: `payment_${session.id}`,
            metadata: {
              sessionId: session.id,
              userId: session.metadata.userId,
              planId: session.metadata.planId,
            },
          });
          console.log('Tax transaction created for payment:', taxTransaction.id);
        } catch (taxError) {
          console.error('Error creating tax transaction:', taxError);
        }
      }
      
      // Here you would typically update your database
      break;
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('Subscription created:', subscription.id);
      break;
    case 'charge.refunded':
      const charge = event.data.object;
      console.log('Charge refunded:', charge.id);
      
      // Create tax reversal if original tax transaction exists
      if (charge.metadata?.originalTaxTransactionId) {
        try {
          const taxReversal = await stripe.tax.transactions.createReversal({
            original_transaction: charge.metadata.originalTaxTransactionId,
            reference: `refund_${charge.id}`,
            metadata: {
              chargeId: charge.id,
              refundReason: charge.refunds?.data[0]?.reason || 'customer_requested',
            },
          });
          console.log('Tax reversal created for refund:', taxReversal.id);
        } catch (taxError) {
          console.error('Error creating tax reversal:', taxError);
        }
      }
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
  console.log(`   POST /api/stripe/calculate-tax`);
  console.log(`   POST /api/stripe/create-tax-transaction`);
  console.log(`   POST /api/stripe/create-tax-reversal`);
  console.log(`   POST /api/stripe/webhook`);
  console.log(`   GET  /api/health`);
  console.log(`💰 Stripe Tax API: ${stripe && stripeKey ? 'Enabled' : 'Development Mode'}`);
}); 