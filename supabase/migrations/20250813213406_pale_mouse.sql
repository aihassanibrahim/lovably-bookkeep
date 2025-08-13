/*
  # Fix Foreign Key Constraints and Data Integrity

  1. Ensure all foreign key relationships are properly handled
  2. Add proper constraints and validation
  3. Create indexes for better performance
  4. Add triggers for data consistency
*/

-- Ensure profiles table has proper constraints
DO $$
BEGIN
  -- Add unique constraint on user_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_user_id_key' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Add check constraints for data validation
DO $$
BEGIN
  -- Orders table constraints
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'orders_price_positive'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_price_positive CHECK (price >= 0);
  END IF;

  -- Products table constraints
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'products_price_positive'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT products_price_positive CHECK (price >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'products_cost_positive'
  ) THEN
    ALTER TABLE products ADD CONSTRAINT products_cost_positive CHECK (cost >= 0);
  END IF;
END $$;

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, onboarding_completed, onboarding_step)
  VALUES (NEW.id, false, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id_status ON orders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_products_user_id_active ON products(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_customers_user_id_active ON customers(user_id, is_active);

-- Function to safely delete user data
CREATE OR REPLACE FUNCTION safe_delete_user_data(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Delete in correct order to avoid foreign key violations
  DELETE FROM orders WHERE user_id = user_uuid;
  DELETE FROM products WHERE user_id = user_uuid;
  DELETE FROM customers WHERE user_id = user_uuid;
  DELETE FROM profiles WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;