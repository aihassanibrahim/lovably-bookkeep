-- Comprehensive Database Fix for Income & Expense Functionality
-- Run this script in your Supabase SQL Editor

-- 1. Fix Transactions Table - Add missing columns
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS transaction_type VARCHAR(20);

ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- Add comments
COMMENT ON COLUMN public.transactions.transaction_type IS 'Type of transaction: income, expense, transfer, etc.';
COMMENT ON COLUMN public.transactions.category IS 'Category for the transaction (e.g., sales, materials, utilities)';

-- Set default values for existing records
UPDATE public.transactions 
SET transaction_type = 'income' 
WHERE transaction_type IS NULL AND total_amount > 0;

UPDATE public.transactions 
SET transaction_type = 'expense' 
WHERE transaction_type IS NULL AND total_amount < 0;

UPDATE public.transactions 
SET category = 'Övrigt' 
WHERE category IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category);

-- 2. Create Expenses Table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expense_number TEXT UNIQUE,
  supplier_name TEXT,
  expense_date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  kostnad_med_moms DECIMAL(10,2),
  category TEXT,
  receipt_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on expenses table
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for expenses
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'expenses' 
    AND policyname = 'Users can only access own expenses'
  ) THEN
    CREATE POLICY "Users can only access own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for expenses table
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);

-- 3. Verify the changes
SELECT 'Transactions table columns:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'transactions' 
AND column_name IN ('transaction_type', 'category')
ORDER BY column_name;

SELECT 'Expenses table exists:' as info;
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'expenses'
) as expenses_table_exists;

-- 4. Test data insertion (will be cleaned up automatically)
INSERT INTO public.expenses (
  expense_number, 
  supplier_name, 
  expense_date, 
  description, 
  kostnad_med_moms, 
  category, 
  notes
) VALUES (
  'TEST-EXP-' || EXTRACT(EPOCH FROM NOW())::BIGINT,
  'Test Supplier',
  CURRENT_DATE,
  'Test expense for verification',
  100.00,
  'Test',
  'This is a test expense to verify the table works'
) ON CONFLICT (expense_number) DO NOTHING;

-- Clean up test data
DELETE FROM public.expenses WHERE expense_number LIKE 'TEST-EXP-%';

SELECT 'Database fix completed successfully!' as status; 