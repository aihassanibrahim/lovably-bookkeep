-- Enable the pg_net extension for making HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create products table (mirrors Stripe products)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    active BOOLEAN DEFAULT true,
    name TEXT,
    description TEXT,
    image TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prices table (mirrors Stripe prices)
CREATE TABLE IF NOT EXISTS public.prices (
    id TEXT PRIMARY KEY,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true,
    description TEXT,
    unit_amount INTEGER,
    currency TEXT DEFAULT 'sek',
    type TEXT CHECK (type IN ('one_time', 'recurring')),
    interval TEXT CHECK (interval IN ('day', 'week', 'month', 'year')),
    interval_count INTEGER,
    trial_period_days INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table (mirrors Stripe subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid')),
    price_id TEXT REFERENCES public.prices(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created TIMESTAMP WITH TIME ZONE,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table (mirrors Stripe customers)
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    phone TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (read-only for all authenticated users)
CREATE POLICY "Products are viewable by everyone" ON public.products
    FOR SELECT USING (true);

-- RLS Policies for prices (read-only for all authenticated users)
CREATE POLICY "Prices are viewable by everyone" ON public.prices
    FOR SELECT USING (true);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscription" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for customers
CREATE POLICY "Users can view own customer" ON public.customers
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customer" ON public.customers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customer" ON public.customers
    FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers(user_id);
CREATE INDEX IF NOT EXISTS idx_prices_product_id ON public.prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_active ON public.prices(active);

-- Create function to handle Stripe webhooks
CREATE OR REPLACE FUNCTION handle_stripe_webhook()
RETURNS TRIGGER AS $$
BEGIN
    -- This function will be called by the Stripe webhook handler
    -- You can add custom logic here if needed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for subscription updates
CREATE TRIGGER on_subscription_updated
    AFTER UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION handle_stripe_webhook();

-- Insert default products and prices for BizPal
INSERT INTO public.products (id, name, description, active) VALUES
    ('prod_bizpal_free', 'BizPal Gratis', 'Grundläggande bokföring och kundregister för småföretag', true),
    ('prod_bizpal_pro', 'BizPal Pro', 'Komplett affärssystem med kvittoscanning, momsrapportering och export', true)
ON CONFLICT (id) DO NOTHING;

-- Insert default prices (you'll need to replace these with your actual Stripe price IDs)
INSERT INTO public.prices (id, product_id, unit_amount, currency, type, interval, active) VALUES
    ('price_bizpal_free', 'prod_bizpal_free', 0, 'sek', 'recurring', 'month', true),
    ('price_bizpal_pro', 'prod_bizpal_pro', 9900, 'sek', 'recurring', 'month', true)
ON CONFLICT (id) DO NOTHING;
