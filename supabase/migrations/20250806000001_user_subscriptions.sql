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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON public.user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);

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

-- Add indexes for usage
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON public.user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_month ON public.user_usage(month);

-- Add comments
COMMENT ON TABLE public.user_subscriptions IS 'Stores user subscription information';
COMMENT ON COLUMN public.user_subscriptions.plan_id IS 'Current plan: free, pro';
COMMENT ON COLUMN public.user_subscriptions.status IS 'Subscription status: active, canceled, past_due, etc.';
COMMENT ON TABLE public.user_usage IS 'Tracks monthly usage for plan limits';
COMMENT ON COLUMN public.user_usage.month IS 'Month in YYYY-MM format';
COMMENT ON COLUMN public.user_usage.transactions_count IS 'Number of transactions this month';
COMMENT ON COLUMN public.user_usage.customers_count IS 'Number of customers this month'; 