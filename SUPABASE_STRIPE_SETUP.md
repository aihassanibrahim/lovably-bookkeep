# Supabase Stripe Integration Setup Guide

## Overview

This guide will help you set up Supabase's built-in Stripe integration for BizPal, which provides a much cleaner and more maintainable solution than custom Stripe webhooks.

## Benefits of Supabase Stripe Integration

1. **Built-in billing management** - No need for custom webhooks
2. **Automatic subscription sync** - Supabase handles Stripe events
3. **Simplified client code** - Fewer API endpoints to manage
4. **Better security** - Supabase handles sensitive operations
5. **Real-time updates** - Automatic UI updates when subscriptions change

## Step 1: Enable Stripe Integration in Supabase

### 1.1 Go to Supabase Dashboard
1. Visit [supabase.com](https://supabase.com)
2. Log in to your account
3. Select your BizPal project

### 1.2 Enable Stripe Integration
1. Go to **Settings** → **Integrations**
2. Find **Stripe** in the list
3. Click **Enable**
4. Enter your Stripe API keys:
   - **Publishable Key**: `pk_test_...` (for development)
   - **Secret Key**: `sk_test_...` (for development)
5. Click **Save**

## Step 2: Create Stripe Products and Prices

### 2.1 Create Products in Stripe Dashboard
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to **Products**
3. Create two products:

**BizPal Gratis (Free)**
- Name: `BizPal Gratis`
- Description: `Grundläggande bokföring och kundregister för småföretag`
- Price: `0 SEK`
- Billing: `Monthly`

**BizPal Pro**
- Name: `BizPal Pro`
- Description: `Komplett affärssystem med kvittoscanning, momsrapportering och export`
- Price: `99 SEK`
- Billing: `Monthly`

### 2.2 Get Price IDs
1. For each product, click on the product name
2. Copy the **Price ID** (starts with `price_`)
3. Note down both Price IDs

## Step 3: Update Database Schema

### 3.1 Run the Migration
Execute the SQL migration in your Supabase SQL Editor:

```sql
-- Run the migration from: supabase/migrations/20250806000003_supabase_stripe_tables.sql
```

### 3.2 Update Price IDs
Replace the placeholder price IDs in the migration with your actual Stripe price IDs:

```sql
-- Update with your actual Stripe price IDs
UPDATE public.prices 
SET id = 'your_actual_pro_price_id_here' 
WHERE product_id = 'prod_bizpal_pro';

UPDATE public.prices 
SET id = 'your_actual_free_price_id_here' 
WHERE product_id = 'prod_bizpal_free';
```

## Step 4: Deploy Edge Functions

### 4.1 Install Supabase CLI
```bash
npm install -g supabase
```

### 4.2 Login to Supabase
```bash
supabase login
```

### 4.3 Link Your Project
```bash
supabase link --project-ref your-project-ref
```

### 4.4 Deploy Functions
```bash
supabase functions deploy create-checkout-session
supabase functions deploy create-portal-session
```

## Step 5: Update Environment Variables

### 5.1 Add to Vercel
Go to your Vercel dashboard and add these environment variables:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

### 5.2 Add to Supabase
In your Supabase dashboard, go to **Settings** → **API** and add:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

## Step 6: Update Your Code

### 6.1 Replace Stripe Imports
Update your components to use the new Supabase Stripe integration:

```typescript
// Old imports
import { redirectToCheckout } from '@/lib/stripe-client';

// New imports
import { createCheckoutSession } from '@/lib/supabase-stripe';
```

### 6.2 Use the New Hook
Replace your subscription management with the new hook:

```typescript
// Old way
import { useSubscription } from '@/hooks/useSubscription';

// New way
import { useSupabaseSubscription } from '@/hooks/useSupabaseSubscription';

const { isPro, hasActiveSubscription, loading } = useSupabaseSubscription();
```

## Step 7: Test the Integration

### 7.1 Test Checkout Flow
1. Go to your pricing page
2. Click "Uppgradera till Pro"
3. Should redirect to Stripe Checkout
4. Complete test payment
5. Should redirect back to dashboard

### 7.2 Test Subscription Management
1. Go to user settings
2. Click "Manage Subscription"
3. Should open Stripe Customer Portal
4. Test canceling/updating subscription

## Step 8: Monitor and Debug

### 8.1 Check Supabase Logs
1. Go to **Logs** in Supabase dashboard
2. Monitor Edge Function logs
3. Check for any errors

### 8.2 Check Stripe Dashboard
1. Monitor webhook events
2. Check subscription status
3. Verify customer creation

## Troubleshooting

### Common Issues

1. **"Function not found" error**
   - Make sure Edge Functions are deployed
   - Check function names match exactly

2. **"Price not found" error**
   - Verify price IDs in database match Stripe
   - Check price is active in Stripe

3. **"User not authenticated" error**
   - Ensure user is logged in
   - Check Supabase auth is working

4. **Webhook not working**
   - Verify webhook endpoint in Stripe
   - Check webhook secret is correct

### Debug Steps

1. Check browser console for errors
2. Monitor Supabase Edge Function logs
3. Verify environment variables are set
4. Test with Stripe test mode first

## Migration from Custom Stripe

If you're migrating from the custom Stripe implementation:

1. **Backup existing data** - Export current subscriptions
2. **Run migration** - Execute the new database schema
3. **Update code** - Replace imports and function calls
4. **Test thoroughly** - Ensure all flows work
5. **Deploy gradually** - Use feature flags if needed

## Next Steps

After setup is complete:

1. **Add usage tracking** - Monitor feature usage
2. **Implement feature gates** - Restrict features by plan
3. **Add analytics** - Track conversion rates
4. **Optimize pricing** - A/B test different price points

## Support

If you encounter issues:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review [Stripe documentation](https://stripe.com/docs)
3. Check the [Supabase Discord](https://discord.supabase.com)
4. Review this project's issues on GitHub
