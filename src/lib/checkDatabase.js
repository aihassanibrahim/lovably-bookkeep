import { supabase } from '@/integrations/supabase/client';

export async function checkAndCreateTables() {
  console.log('Checking database tables...');
  
  try {
    // Check if orders table exists by trying to select from it
    const { data: ordersCheck, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);
    
    if (ordersError) {
      console.log('Orders table error:', ordersError.message);
      console.log('You need to create the database tables. Please run the following SQL in your Supabase dashboard:');
      console.log(`
-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
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

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can only access own orders" ON orders FOR ALL USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  social_media TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own customers" ON customers FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_company_name ON customers(company_name);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  price DECIMAL(10,2),
  cost DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own products" ON products FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT,
  expense_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);
      `);
    } else {
      console.log('Orders table exists ✓');
    }

    // Check customers table
    const { data: customersCheck, error: customersError } = await supabase
      .from('customers')
      .select('id')
      .limit(1);
    
    if (customersError) {
      console.log('Customers table error:', customersError.message);
    } else {
      console.log('Customers table exists ✓');
    }

    // Check products table
    const { data: productsCheck, error: productsError } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (productsError) {
      console.log('Products table error:', productsError.message);
    } else {
      console.log('Products table exists ✓');
    }

    // Check expenses table
    const { data: expensesCheck, error: expensesError } = await supabase
      .from('expenses')
      .select('id')
      .limit(1);
    
    if (expensesError) {
      console.log('Expenses table error:', expensesError.message);
    } else {
      console.log('Expenses table exists ✓');
    }

    console.log('Database check complete!');
    
  } catch (error) {
    console.error('Error checking database:', error);
  }
} 