-- Check current expenses table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'expenses'
ORDER BY ordinal_position;

-- Check if expenses table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'expenses'
) as expenses_table_exists; 