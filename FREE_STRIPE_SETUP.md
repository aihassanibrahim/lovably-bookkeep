# Free Stripe Integration Setup Guide

## Overview

This guide shows you how to implement Stripe integration using **free tier services only**:
- ✅ **Supabase Free Tier** - Database and authentication
- ✅ **Vercel Free Tier** - Serverless functions and hosting
- ✅ **Stripe Free Tier** - Payment processing (no monthly fees)

## What You Get for Free

### Supabase Free Tier
- 500MB database
- 50,000 monthly active users
- 2GB bandwidth
- Real-time subscriptions
- Row Level Security

### Vercel Free Tier
- 100GB bandwidth
- 100 serverless function executions/day
- Automatic deployments
- Custom domains

### Stripe Free Tier
- No monthly fees
- 2.9% + 30¢ per successful transaction
- Test mode for development

## Step 1: Set Up Stripe

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for a free account
3. Complete account verification

### 1.2 Create Products and Prices
1. Go to **Products** in Stripe Dashboard
2. Create two products:

**BizPal Gratis (Free)**
- Name: `BizPal Gratis`
- Price: `0 SEK`
- Billing: `Monthly`

**BizPal Pro**
- Name: `BizPal Pro`
- Price: `99 SEK`
- Billing: `Monthly`

### 1.3 Get API Keys
1. Go to **Developers** → **API keys**
2. Copy your keys:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

## Step 2: Set Up Supabase (Free Tier)

### 2.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for setup to complete

### 2.2 Run Database Migration
1. Go to **SQL Editor** in Supabase
2. Run this migration:

```sql
-- Run the migration from: supabase/migrations/20250806000003_supabase_stripe_tables.sql
```

### 2.3 Get Supabase Keys
1. Go to **Settings** → **API**
2. Copy:
   - **URL**: `https://your-project.supabase.co`
   - **Anon key**: `eyJ...`
   - **Service role key**: `eyJ...` (keep this secret!)

## Step 3: Set Up Vercel (Free Tier)

### 3.1 Deploy to Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Deploy automatically

### 3.2 Add Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables**:

```env
# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ_your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=eyJ_your_service_role_key_here
```

## Step 4: Set Up Stripe Webhooks

### 4.1 Create Webhook Endpoint
1. Go to **Developers** → **Webhooks** in Stripe
2. Click **Add endpoint**
3. Enter URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 4.2 Get Webhook Secret
1. Copy the webhook signing secret
2. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

## Step 5: Test the Integration

### 5.1 Test Checkout Flow
1. Go to your live app
2. Click "Uppgradera till Pro"
3. Should redirect to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete payment

### 5.2 Test Subscription Management
1. Go to user settings
2. Click "Manage Subscription"
3. Should open Stripe Customer Portal

## Step 6: Monitor Usage

### 6.1 Check Vercel Usage
- Go to Vercel dashboard
- Monitor function executions
- Stay under 100/day limit

### 6.2 Check Supabase Usage
- Go to Supabase dashboard
- Monitor database size
- Stay under 500MB limit

## Free Tier Limits & Workarounds

### Vercel Function Limits
- **100 executions/day** - Usually sufficient for small apps
- **Workaround**: Cache results, optimize function calls

### Supabase Database Limits
- **500MB** - Plenty for user data and subscriptions
- **Workaround**: Archive old data, use efficient queries

### Stripe Limits
- **No transaction limits** - Only pay per transaction
- **Test mode** - Unlimited testing

## Cost Optimization Tips

### 1. Minimize Function Calls
```typescript
// Cache subscription data
const { data: subscription } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', userId)
  .single();

// Only call Stripe when necessary
if (!subscription) {
  // Create new subscription
}
```

### 2. Efficient Database Queries
```sql
-- Use indexes for fast queries
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### 3. Optimize Webhooks
```typescript
// Only process relevant events
if (event.type === 'checkout.session.completed') {
  // Process payment
}
```

## Scaling Up (When You Need It)

### When to Upgrade Supabase
- Database > 500MB
- Users > 50,000/month
- Need more bandwidth

### When to Upgrade Vercel
- Function calls > 100/day
- Need more bandwidth
- Want custom domains

### When to Upgrade Stripe
- High transaction volume
- Need advanced features
- Want better rates

## Troubleshooting

### Common Issues

1. **"Function not found" error**
   - Check Vercel deployment
   - Verify function path

2. **"Database connection failed"**
   - Check Supabase status
   - Verify connection string

3. **"Webhook signature failed"**
   - Check webhook secret
   - Verify endpoint URL

### Debug Steps

1. Check Vercel function logs
2. Monitor Supabase logs
3. Test with Stripe CLI
4. Verify environment variables

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Free Tier Limits](https://vercel.com/docs/concepts/limits/overview)

## Next Steps

After setup:
1. **Add analytics** - Track conversion rates
2. **Implement feature gates** - Restrict features by plan
3. **Add usage tracking** - Monitor feature usage
4. **Optimize performance** - Reduce function calls

This setup gives you a fully functional Stripe integration using only free tier services!
