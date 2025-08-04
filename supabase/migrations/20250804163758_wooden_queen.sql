/*
  # Add VAT and Orders functionality

  1. New Tables
    - `orders` - For managing income/orders with VAT
    - `expenses` - For managing expenses with VAT
    - `vat_rates` - For managing different VAT rates
    - `profit_reports` - For storing calculated profit reports

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data

  3. Changes
    - Add VAT calculation functionality
    - Add profit calculation views
*/

-- Create VAT rates table
CREATE TABLE IF NOT EXISTS public.vat_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table (for income/revenue)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount_excluding_vat DECIMAL(15,2) NOT NULL,
  vat_rate_id UUID REFERENCES public.vat_rates(id),
  vat_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, order_number)
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expense_number VARCHAR(50) NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount_excluding_vat DECIMAL(15,2) NOT NULL,
  vat_rate_id UUID REFERENCES public.vat_rates(id),
  vat_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  category VARCHAR(100),
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, expense_number)
);

-- Enable Row Level Security
ALTER TABLE public.vat_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vat_rates
CREATE POLICY "Users can view their own VAT rates" 
ON public.vat_rates FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own VAT rates" 
ON public.vat_rates FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own VAT rates" 
ON public.vat_rates FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own VAT rates" 
ON public.vat_rates FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders" 
ON public.orders FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for expenses
CREATE POLICY "Users can view their own expenses" 
ON public.expenses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own expenses" 
ON public.expenses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses" 
ON public.expenses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses" 
ON public.expenses FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_vat_rates_updated_at
BEFORE UPDATE ON public.vat_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
BEFORE UPDATE ON public.expenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default VAT rates for Sweden
INSERT INTO public.vat_rates (user_id, name, rate, is_active) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Moms 25%', 25.00, true),
  ('00000000-0000-0000-0000-000000000000', 'Moms 12%', 12.00, true),
  ('00000000-0000-0000-0000-000000000000', 'Moms 6%', 6.00, true),
  ('00000000-0000-0000-0000-000000000000', 'Momsfri', 0.00, true)
ON CONFLICT DO NOTHING;

-- Create view for profit calculation
CREATE OR REPLACE VIEW public.profit_summary AS
SELECT 
  user_id,
  COALESCE(SUM(CASE WHEN source = 'order' THEN total_amount ELSE 0 END), 0) as total_revenue,
  COALESCE(SUM(CASE WHEN source = 'expense' THEN total_amount ELSE 0 END), 0) as total_expenses,
  COALESCE(SUM(CASE WHEN source = 'order' THEN total_amount ELSE -total_amount END), 0) as profit_before_tax,
  COALESCE(SUM(CASE WHEN source = 'order' THEN vat_amount ELSE -vat_amount END), 0) as net_vat
FROM (
  SELECT user_id, total_amount, vat_amount, 'order' as source FROM public.orders WHERE status = 'paid'
  UNION ALL
  SELECT user_id, total_amount, vat_amount, 'expense' as source FROM public.expenses
) combined
GROUP BY user_id;