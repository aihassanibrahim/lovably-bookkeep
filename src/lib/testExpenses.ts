import { supabase } from '@/integrations/supabase/client';

export const testExpensesTable = async () => {
  console.log('🧪 Testing Expenses Table...');
  
  try {
    // Test 1: Check if expenses table exists
    console.log('1. Checking if expenses table exists...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'expenses');

    if (tableError) {
      console.error('❌ Error checking table:', tableError);
      return;
    }

    if (!tableInfo || tableInfo.length === 0) {
      console.log('❌ Expenses table does not exist!');
      console.log('💡 You need to run the expenses table creation SQL in your Supabase dashboard');
      return;
    }

    console.log('✅ Expenses table exists');

    // Test 2: Check table structure
    console.log('2. Checking table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'expenses')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Error checking columns:', columnsError);
      return;
    }

    console.log('📋 Table columns:');
    columns?.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    // Test 3: Try to create a test expense
    console.log('3. Testing expense creation...');
    const testExpense = {
      expense_number: `TEST-EXP-${Date.now()}`,
      supplier_name: 'Test Supplier',
      expense_date: new Date().toISOString().split('T')[0],
      description: 'Test expense for functionality check',
      kostnad_med_moms: 100.50,
      category: 'Test',
      receipt_url: '',
      notes: 'This is a test expense'
    };

    const { data: newExpense, error: createError } = await supabase
      .from('expenses')
      .insert(testExpense)
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating test expense:', createError);
      console.log('💡 This might be due to missing user_id or RLS policies');
      return;
    }

    console.log('✅ Test expense created successfully:', newExpense);

    // Test 4: Clean up test data
    console.log('4. Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', newExpense.id);

    if (deleteError) {
      console.error('⚠️ Warning: Could not delete test expense:', deleteError);
    } else {
      console.log('✅ Test expense cleaned up');
    }

    console.log('🎉 Expenses table test completed successfully!');

  } catch (error) {
    console.error('❌ Unexpected error during expenses test:', error);
  }
};

export const testQuickActions = async () => {
  console.log('🧪 Testing QuickActions functionality...');
  
  try {
    // Test 1: Check if transactions table exists
    console.log('1. Checking if transactions table exists...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'transactions');

    if (tableError) {
      console.error('❌ Error checking transactions table:', tableError);
      return;
    }

    if (!tableInfo || tableInfo.length === 0) {
      console.log('❌ Transactions table does not exist!');
      return;
    }

    console.log('✅ Transactions table exists');

    // Test 2: Check if transactions table has required columns
    console.log('2. Checking transactions table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'transactions')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Error checking columns:', columnsError);
      return;
    }

    console.log('📋 Transactions table columns:');
    columns?.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });

    // Check if required columns exist
    const requiredColumns = ['transaction_type', 'category'];
    const existingColumns = columns?.map(col => col.column_name) || [];
    
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('❌ Missing required columns:', missingColumns);
      console.log('💡 You need to add these columns to the transactions table:');
      console.log('   ALTER TABLE transactions ADD COLUMN transaction_type VARCHAR(20);');
      console.log('   ALTER TABLE transactions ADD COLUMN category VARCHAR(100);');
      return;
    }

    console.log('✅ All required columns exist');

    console.log('🎉 QuickActions test completed! The component should work properly.');

  } catch (error) {
    console.error('❌ Unexpected error during QuickActions test:', error);
  }
}; 