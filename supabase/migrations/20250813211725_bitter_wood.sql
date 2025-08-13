/*
  # Simplified BizPal Schema for Small Business Order Management

  1. New Tables
    - `simple_orders` - Core order management with customer, product, quantity, status, and dates
    - `simple_products` - Basic product catalog with name, price, and description
    - `simple_customers` - Essential customer information
    - `profiles` - User profile and company information (if not exists)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data

  3. Changes
    - Simplified structure focused on core business needs
    - Removed complex features and unnecessary fields
    - Clear, minimal schema for order management workflow
*/

-- Create simplified orders table
CREATE TABLE IF NOT EXISTS public.simple_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'Beställd' CHECK (status IN ('Beställd', 'I produktion', 'Klar', 'Levererad', 'Avbruten')),
  order_date DATE DEFAULT CURRENT_DATE,
  estimated_delivery DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create simplified products table
CREATE TABLE IF NOT EXISTS public.simple_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  description TEXT,
  sku TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create simplified customers table
CREATE TABLE IF NOT EXISTS public.simple_customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  customer_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT,
  contact_person TEXT,
  company_email TEXT,
  company_phone TEXT,
  company_address TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.simple_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simple_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simple_customers ENABLE ROW LEVEL SECURITY;

-- Only enable RLS on profiles if it doesn't already exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles'
  ) THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create RLS policies for simple_orders
CREATE POLICY "Users can access own orders" ON public.simple_orders
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for simple_products
CREATE POLICY "Users can access own products" ON public.simple_products
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for simple_customers
CREATE POLICY "Users can access own customers" ON public.simple_customers
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for profiles (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can access own profile'
  ) THEN
    CREATE POLICY "Users can access own profile" ON public.profiles
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_simple_orders_user_id ON public.simple_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_simple_orders_status ON public.simple_orders(status);
CREATE INDEX IF NOT EXISTS idx_simple_orders_order_date ON public.simple_orders(order_date);

CREATE INDEX IF NOT EXISTS idx_simple_products_user_id ON public.simple_products(user_id);
CREATE INDEX IF NOT EXISTS idx_simple_products_category ON public.simple_products(category);
CREATE INDEX IF NOT EXISTS idx_simple_products_is_active ON public.simple_products(is_active);

CREATE INDEX IF NOT EXISTS idx_simple_customers_user_id ON public.simple_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_simple_customers_company_name ON public.simple_customers(company_name);
CREATE INDEX IF NOT EXISTS idx_simple_customers_is_active ON public.simple_customers(is_active);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_simple_orders_updated_at
  BEFORE UPDATE ON public.simple_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_simple_products_updated_at
  BEFORE UPDATE ON public.simple_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_simple_customers_updated_at
  BEFORE UPDATE ON public.simple_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Only create profiles trigger if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Insert sample data for testing (optional)
-- This will help users understand the system structure
INSERT INTO public.simple_orders (
  user_id, order_number, customer_name, customer_phone, product_name, 
  quantity, price, status, order_date, notes
) VALUES (
  '00000000-0000-0000-0000-000000000000', 
  'SAMPLE-001', 
  'Exempel Kund', 
  '070-123 45 67', 
  'Exempel Produkt', 
  1, 
  299.00, 
  'Beställd', 
  CURRENT_DATE, 
  'Detta är en exempelorder som visar hur systemet fungerar'
) ON CONFLICT DO NOTHING;

INSERT INTO public.simple_products (
  user_id, name, category, price, cost, description, sku
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Exempel Produkt',
  'Produkter',
  299.00,
  150.00,
  'Detta är en exempelprodukt som visar hur katalogen fungerar',
  'SAMPLE-PROD-001'
) ON CONFLICT DO NOTHING;

INSERT INTO public.simple_customers (
  user_id, company_name, contact_person, email, phone, customer_number
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Exempel Kund AB',
  'Anna Andersson',
  'anna@exempel.se',
  '070-123 45 67',
  'SAMPLE-CUST-001'
) ON CONFLICT DO NOTHING;