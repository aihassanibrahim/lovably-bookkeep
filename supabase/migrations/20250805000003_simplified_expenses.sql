-- Drop the existing expenses table and create a simplified version
-- This matches the structure the user wanted for simple expense tracking

-- First, drop the existing expenses table if it exists
DROP TABLE IF EXISTS public.expenses CASCADE;

-- Create the simplified expenses table
CREATE TABLE public.expenses (
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

-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date); 