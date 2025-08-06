-- Fix Expenses Table Column Mismatch (Corrected Version)
-- The existing table has different column names than what the application expects

-- 1. Add missing columns
ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS expense_number TEXT;

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS supplier_name TEXT;

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS kostnad_med_moms DECIMAL(10,2);

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- 2. Copy data from existing columns to new columns
-- Copy amount to kostnad_med_moms
UPDATE public.expenses 
SET kostnad_med_moms = amount 
WHERE kostnad_med_moms IS NULL AND amount IS NOT NULL;

-- Generate expense_number for existing records
UPDATE public.expenses 
SET expense_number = 'EXP-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || id::text
WHERE expense_number IS NULL;

-- Set default supplier_name for existing records
UPDATE public.expenses 
SET supplier_name = 'Unknown Supplier'
WHERE supplier_name IS NULL;

-- 3. Add unique constraint to expense_number (fixed syntax)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'expenses_expense_number_key'
  ) THEN
    ALTER TABLE public.expenses ADD CONSTRAINT expenses_expense_number_key UNIQUE (expense_number);
  END IF;
END $$;

-- 4. Show the updated structure
SELECT 'Updated expenses table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'expenses'
ORDER BY ordinal_position;

-- 5. Test the fix with a new expense
INSERT INTO public.expenses (
  expense_number,
  supplier_name,
  expense_date,
  description,
  kostnad_med_moms,
  category,
  receipt_url,
  notes
) VALUES (
  'TEST-EXP-' || EXTRACT(EPOCH FROM NOW())::BIGINT,
  'Test Supplier',
  CURRENT_DATE,
  'Test expense after column fix',
  200.00,
  'Test',
  '',
  'This is a test expense to verify the column fix works'
) ON CONFLICT (expense_number) DO NOTHING;

-- 6. Clean up test data
DELETE FROM public.expenses WHERE expense_number LIKE 'TEST-EXP-%';

SELECT 'Expenses table column mismatch fix completed!' as status; 