-- Drop the existing orders table and create a simplified version
-- This matches the structure the user wanted for social media orders

-- First, drop the existing orders table if it exists
DROP TABLE IF EXISTS public.orders CASCADE;

-- Create the simplified orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE,
  customer_name TEXT,
  customer_social_media TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  product_name TEXT,
  product_details TEXT,
  product_customizations TEXT,
  price DECIMAL(10,2),
  status TEXT DEFAULT 'Beställd',
  order_date DATE DEFAULT CURRENT_DATE,
  estimated_completion DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access own orders" ON orders FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_customer_name ON orders(customer_name); 