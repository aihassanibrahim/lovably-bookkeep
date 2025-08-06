-- Fix Expenses Table Structure
-- This script will update the expenses table to match the expected structure

-- First, let's see what we have
SELECT 'Current expenses table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'expenses'
ORDER BY ordinal_position;

-- Add missing columns that the application expects
ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS expense_number TEXT;

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS supplier_name TEXT;

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS expense_date DATE DEFAULT CURRENT_DATE;

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS kostnad_med_moms DECIMAL(10,2);

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS category TEXT;

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add unique constraint to expense_number if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'expenses_expense_number_key'
  ) THEN
    ALTER TABLE public.expenses ADD CONSTRAINT expenses_expense_number_key UNIQUE (expense_number);
  END IF;
END $$;

-- Update existing records to have expense_number if they don't have one
UPDATE public.expenses 
SET expense_number = 'EXP-' || EXTRACT(EPOCH FROM NOW())::BIGINT || '-' || id::text
WHERE expense_number IS NULL;

-- Show the final structure
SELECT 'Updated expenses table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'expenses'
ORDER BY ordinal_position;

-- Test insertion
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
  'Test expense after structure fix',
  150.00,
  'Test',
  '',
  'This is a test expense to verify the structure fix works'
) ON CONFLICT (expense_number) DO NOTHING;

-- Clean up test data
DELETE FROM public.expenses WHERE expense_number LIKE 'TEST-EXP-%';

SELECT 'Expenses table structure fix completed!' as status; 