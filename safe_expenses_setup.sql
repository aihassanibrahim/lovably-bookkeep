-- Safe Expenses Table Setup (won't cause conflicts if already exists)

-- Create the expenses table if it doesn't exist
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

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies safely (only if they don't exist)
DO $$ 
BEGIN
  -- Check if policy exists before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'expenses' 
    AND policyname = 'Users can only access own expenses'
  ) THEN
    CREATE POLICY "Users can only access own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes safely
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);

-- Verify the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'expenses' 
AND table_schema = 'public'
ORDER BY ordinal_position; 