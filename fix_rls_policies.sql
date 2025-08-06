-- Fix RLS Policies for Expenses Table
-- This will allow authenticated users to insert, update, and delete their own expenses

-- 1. Enable RLS on expenses table
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can only access own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can view their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can create their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON public.expenses;

-- 3. Create a simple, comprehensive policy that allows all operations
CREATE POLICY "Users can only access own expenses" ON public.expenses
FOR ALL USING (auth.uid() = user_id);

-- 4. Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'expenses';

-- 5. Test the policy by checking if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'expenses';

-- 6. Show current user (for debugging)
SELECT current_user, auth.uid() as current_auth_uid; 