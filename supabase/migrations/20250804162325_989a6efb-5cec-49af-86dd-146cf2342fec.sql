-- Create accounts table (chart of accounts)
CREATE TABLE public.accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_number VARCHAR(10) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  parent_account_id UUID REFERENCES public.accounts(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, account_number)
);

-- Create transactions table (journal entries)
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_number VARCHAR(50),
  description TEXT NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transaction_lines table (double-entry lines)
CREATE TABLE public.transaction_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  description TEXT,
  debit_amount DECIMAL(15,2) DEFAULT 0,
  credit_amount DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_amounts CHECK (
    (debit_amount > 0 AND credit_amount = 0) OR 
    (debit_amount = 0 AND credit_amount > 0)
  )
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_number VARCHAR(20) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  org_number VARCHAR(20),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, customer_number)
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_number VARCHAR(20) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  org_number VARCHAR(20),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, supplier_number)
);

-- Enable Row Level Security
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for accounts
CREATE POLICY "Users can view their own accounts" 
ON public.accounts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own accounts" 
ON public.accounts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts" 
ON public.accounts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts" 
ON public.accounts FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.transactions FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for transaction_lines
CREATE POLICY "Users can view their own transaction lines" 
ON public.transaction_lines FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transaction lines" 
ON public.transaction_lines FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transaction lines" 
ON public.transaction_lines FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transaction lines" 
ON public.transaction_lines FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for customers
CREATE POLICY "Users can view their own customers" 
ON public.customers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customers" 
ON public.customers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers" 
ON public.customers FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers" 
ON public.customers FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for suppliers
CREATE POLICY "Users can view their own suppliers" 
ON public.suppliers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own suppliers" 
ON public.suppliers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers" 
ON public.suppliers FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers" 
ON public.suppliers FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_accounts_updated_at
BEFORE UPDATE ON public.accounts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();