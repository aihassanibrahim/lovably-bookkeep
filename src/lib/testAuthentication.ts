import { supabase } from '@/integrations/supabase/client';

export const testAuthentication = async () => {
  console.log('🔐 Testing Authentication...');
  
  try {
    // Test 1: Check if user is authenticated
    console.log('1. Checking authentication status...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Authentication error:', authError);
      return;
    }
    
    if (!user) {
      console.error('❌ No authenticated user found');
      console.log('💡 You need to log in to use the application');
      return;
    }
    
    console.log('✅ User authenticated:', user.email);
    console.log('✅ User ID:', user.id);

    // Test 2: Check if we can access the database with the current user
    console.log('2. Testing database access with current user...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Database access error:', profileError);
    } else {
      console.log('✅ Database access working');
    }

    // Test 3: Try to insert a test record with explicit user_id
    console.log('3. Testing expense insertion with explicit user_id...');
    const testExpense = {
      expense_number: `AUTH-TEST-${Date.now()}`,
      supplier_name: 'Auth Test Supplier',
      expense_date: new Date().toISOString().split('T')[0],
      description: 'Authentication test expense',
      kostnad_med_moms: 50.00,
      amount: 50.00, // Also populate old column
      category: 'Test',
      receipt_url: '',
      notes: 'Testing authentication',
      user_id: user.id // Explicitly set user_id
    };

    const { data: newExpense, error: insertError } = await supabase
      .from('expenses')
      .insert(testExpense)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Expense insertion error:', insertError);
      
      if (insertError.message && insertError.message.includes('row-level security')) {
        console.log('💡 RLS policy is still blocking the insert');
        console.log('💡 You need to run the RLS fix SQL script');
        return;
      }
      
      console.log('💡 This might be a different database issue');
      return;
    }

    console.log('✅ Test expense created successfully:', newExpense.id);

    // Clean up
    await supabase.from('expenses').delete().eq('id', newExpense.id);
    console.log('✅ Test expense cleaned up');

    console.log('🎉 Authentication test completed successfully!');
    console.log('💡 The user is properly authenticated and can access the database');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}; 