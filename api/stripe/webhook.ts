import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  
  if (!userId || !customerId) {
    console.error('Missing userId or customerId in session');
    return;
  }

  // Update user subscription
                await supabase
                .from('subscriptions')
                .upsert({
                  user_id: userId,
                  stripe_customer_id: customerId,
                  price_id: process.env.STRIPE_PRO_PRICE_ID || 'price_1RuD20BK2aelwOoZFGExG9jq', // Use actual price ID
                  status: 'active',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get user by customer ID
  const { data: userSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (userSub) {
                    await supabase
                  .from('subscriptions')
                  .update({
                    stripe_subscription_id: subscription.id,
                    status: subscription.status,
                    current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
                    current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                  .eq('user_id', userSub.user_id);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get user by customer ID
  const { data: userSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (userSub) {
                    await supabase
                  .from('subscriptions')
                  .update({
                    status: subscription.status,
                    current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
                    current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
                    cancel_at_period_end: subscription.cancel_at_period_end,
                    updated_at: new Date().toISOString(),
                  })
                  .eq('user_id', userSub.user_id);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get user by customer ID
  const { data: userSub } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (userSub) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userSub.user_id);
  }
}
