# Stripe Setup Guide for BizPal Freemium Model

## Step 1: Create Stripe Products

### 1.1 Go to Stripe Dashboard
- Visit [dashboard.stripe.com](https://dashboard.stripe.com)
- Log in to your Stripe account

### 1.2 Create "BizPal Gratis" Product
1. Go to **Products** → **Add product**
2. Fill in the details:
   - **Name:** `BizPal Gratis`
   - **Description:** `Grundläggande bokföring och kundregister för småföretag`
   - **Pricing model:** `Standard pricing`
   - **Price:** `0 SEK`
   - **Billing period:** `Monthly`
3. Click **Save product**

### 1.3 Create "BizPal Pro" Product
1. Go to **Products** → **Add product**
2. Fill in the details:
   - **Name:** `BizPal Pro`
   - **Description:** `Komplett affärssystem med kvittoscanning, momsrapportering och export`
   - **Pricing model:** `Standard pricing`
   - **Price:** `199 SEK`
   - **Billing period:** `Monthly`
3. Click **Save product**

### 1.4 Get Price IDs
1. For each product, click on the product name
2. Copy the **Price ID** (starts with `price_`)
3. Note down both Price IDs

## Step 2: Update Configuration

### 2.1 Update Stripe Configuration
Replace the placeholder in `src/lib/stripe.ts`:

```typescript
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: 'price_YOUR_ACTUAL_PRO_PRICE_ID_HERE'
};
```

### 2.2 Add Environment Variables
Create or update your `.env` file:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
```

## Step 3: Create Test User

### 3.1 In Supabase Dashboard
1. Go to your Supabase project
2. Navigate to **Authentication** → **Users**
3. Click **Add user**
4. Fill in:
   - **Email:** `guest@bizpal.test`
   - **Password:** `guest123456`
   - **Email confirm:** `true`
5. Click **Add user**

## Step 4: Run Database Migrations

### 4.1 In Supabase SQL Editor
Run these SQL scripts:

```sql
-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback (for non-authenticated users)
CREATE POLICY "Anyone can insert feedback" ON public.feedback
    FOR INSERT WITH CHECK (true);

-- Only allow reading feedback if you're the one who created it (by email)
CREATE POLICY "Users can read own feedback" ON public.feedback
    FOR SELECT USING (email = auth.jwt() ->> 'email');

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) NOT NULL DEFAULT 'free',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add RLS policies
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own subscription
CREATE POLICY "Users can access own subscription" ON public.user_subscriptions
    FOR ALL USING (auth.uid() = user_id);

-- Create usage tracking table
CREATE TABLE IF NOT EXISTS public.user_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    transactions_count INTEGER DEFAULT 0,
    customers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month)
);

-- Add RLS policies for usage
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Users can only access their own usage
CREATE POLICY "Users can access own usage" ON public.user_usage
    FOR ALL USING (auth.uid() = user_id);
```

## Step 5: Test Everything

### 5.1 Test Guest Login
1. Go to your landing page
2. Click "Testa som gäst"
3. Should log in with test credentials

### 5.2 Test Feedback Form
1. Scroll to feedback section
2. Fill out and submit feedback
3. Check Supabase dashboard for new feedback entry

### 5.3 Test Pricing Section
1. Click "Uppgradera till Pro" on pricing card
2. Should show upgrade flow (currently mock)

## Step 6: Deploy Updates

```bash
git add .
git commit -m "Complete Stripe freemium model setup"
git push
vercel --prod
```

## Troubleshooting

### Common Issues:
1. **"Name is required" error**: Make sure to fill in the product name in Stripe
2. **Guest login fails**: Ensure test user exists in Supabase
3. **Feedback not saving**: Check RLS policies in Supabase
4. **Price ID not found**: Verify the Price ID is correct in `stripe.ts`

### Support:
- Check browser console for errors
- Verify Supabase connection
- Ensure all environment variables are set 