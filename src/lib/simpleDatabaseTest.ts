import { supabase } from '@/integrations/supabase/client';

export const simpleDatabaseTest = async () => {
  console.log('🔍 Simple Database Test...');
  
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('expenses')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection error:', testError);
      return;
    }
    console.log('✅ Supabase connection working');

    // Test 2: Try to insert a test expense (this will tell us if columns exist)
    console.log('2. Testing expense insertion...');
    const testExpense = {
      expense_number: `TEST-${Date.now()}`,
      supplier_name: 'Test Supplier',
      expense_date: new Date().toISOString().split('T')[0],
      description: 'Test expense',
      kostnad_med_moms: 100.00,
      category: 'Test',
      receipt_url: '',
      notes: 'Test notes'
    };

    const { data: newExpense, error: insertError } = await supabase
      .from('expenses')
      .insert(testExpense)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Expense insertion error:', insertError);
      
      // Check if it's a column error
      if (insertError.message && insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        console.log('💡 This is a column mismatch error. You need to run the database fix SQL script.');
        console.log('💡 Missing columns that the application expects.');
        return;
      }
      
      // Check if it's an RLS error
      if (insertError.message && insertError.message.includes('row-level security')) {
        console.log('💡 This is an RLS (Row Level Security) error. The user might not be authenticated properly.');
        return;
      }
      
      console.log('💡 This might be due to missing user_id or other database issues');
      return;
    }

    console.log('✅ Test expense created successfully:', newExpense.id);

    // Test 3: Try to fetch the expense back
    console.log('3. Testing expense retrieval...');
    const { data: fetchedExpense, error: fetchError } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', newExpense.id)
      .single();

    if (fetchError) {
      console.error('❌ Expense retrieval error:', fetchError);
    } else {
      console.log('✅ Test expense retrieved successfully:', fetchedExpense);
    }

    // Clean up
    await supabase.from('expenses').delete().eq('id', newExpense.id);
    console.log('✅ Test expense cleaned up');

    console.log('🎉 Database test completed successfully!');
    console.log('💡 The expenses functionality should work properly now!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}; 