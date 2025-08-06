-- Add missing columns to transactions table for QuickActions functionality
-- This script adds the transaction_type and category columns that QuickActions component expects

-- Add transaction_type column
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS transaction_type VARCHAR(20);

-- Add category column  
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- Add comment to document the purpose
COMMENT ON COLUMN public.transactions.transaction_type IS 'Type of transaction: income, expense, transfer, etc.';
COMMENT ON COLUMN public.transactions.category IS 'Category for the transaction (e.g., sales, materials, utilities)';

-- Update existing records to have default values if needed
UPDATE public.transactions 
SET transaction_type = 'income' 
WHERE transaction_type IS NULL AND total_amount > 0;

UPDATE public.transactions 
SET transaction_type = 'expense' 
WHERE transaction_type IS NULL AND total_amount < 0;

UPDATE public.transactions 
SET category = 'Övrigt' 
WHERE category IS NULL;

-- Create index for better performance on these columns
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category);

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'transactions' 
AND column_name IN ('transaction_type', 'category')
ORDER BY column_name; 