import { supabase } from '@/integrations/supabase/client';

export const testIncomeExpenseFunctionality = async () => {
  console.log('🧪 Testing Income & Expense Functionality...');
  
  try {
    // Test 1: Check if expenses table exists and works
    console.log('1. Testing Expenses Table...');
    const { data: expenseTest, error: expenseError } = await supabase
      .from('expenses')
      .insert({
        expense_number: `TEST-EXP-${Date.now()}`,
        supplier_name: 'Test Supplier',
        expense_date: new Date().toISOString().split('T')[0],
        description: 'Test expense for functionality check',
        kostnad_med_moms: 150.00,
        category: 'Test',
        receipt_url: '',
        notes: 'This is a test expense'
      })
      .select()
      .single();

    if (expenseError) {
      console.error('❌ Expenses table error:', expenseError);
      console.log('💡 You may need to run the expenses table creation SQL');
    } else {
      console.log('✅ Expenses table working - created test expense:', expenseTest.id);
      
      // Clean up
      await supabase.from('expenses').delete().eq('id', expenseTest.id);
      console.log('✅ Test expense cleaned up');
    }

    // Test 2: Check if transactions table exists and has required columns
    console.log('2. Testing Transactions Table...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'transactions')
      .order('ordinal_position');

    if (columnsError) {
      console.error('❌ Error checking transactions table:', columnsError);
      return;
    }

    const existingColumns = columns?.map(col => col.column_name) || [];
    const requiredColumns = ['transaction_type', 'category'];
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));

    if (missingColumns.length > 0) {
      console.log('❌ Missing columns in transactions table:', missingColumns);
      console.log('💡 Run the fix_transactions_table.sql script in your Supabase dashboard');
      return;
    }

    console.log('✅ Transactions table has all required columns');

    // Test 3: Test income transaction creation
    console.log('3. Testing Income Transaction Creation...');
    const { data: incomeTest, error: incomeError } = await supabase
      .from('transactions')
      .insert({
        transaction_date: new Date().toISOString().split('T')[0],
        description: 'Test income transaction',
        total_amount: 500.00,
        transaction_type: 'income',
        category: 'Test Income',
        reference_number: `TEST-INC-${Date.now()}`
      })
      .select()
      .single();

    if (incomeError) {
      console.error('❌ Income transaction error:', incomeError);
    } else {
      console.log('✅ Income transaction created successfully:', incomeTest.id);
      
      // Clean up
      await supabase.from('transactions').delete().eq('id', incomeTest.id);
      console.log('✅ Test income transaction cleaned up');
    }

    // Test 4: Test expense transaction creation
    console.log('4. Testing Expense Transaction Creation...');
    const { data: expenseTransTest, error: expenseTransError } = await supabase
      .from('transactions')
      .insert({
        transaction_date: new Date().toISOString().split('T')[0],
        description: 'Test expense transaction',
        total_amount: -200.00,
        transaction_type: 'expense',
        category: 'Test Expense',
        reference_number: `TEST-EXP-TRANS-${Date.now()}`
      })
      .select()
      .single();

    if (expenseTransError) {
      console.error('❌ Expense transaction error:', expenseTransError);
    } else {
      console.log('✅ Expense transaction created successfully:', expenseTransTest.id);
      
      // Clean up
      await supabase.from('transactions').delete().eq('id', expenseTransTest.id);
      console.log('✅ Test expense transaction cleaned up');
    }

    console.log('🎉 Income & Expense functionality test completed!');
    console.log('💡 Both QuickActions buttons should now work properly');

  } catch (error) {
    console.error('❌ Unexpected error during test:', error);
  }
};

export const checkDatabaseSetup = async () => {
  console.log('🔍 Checking Database Setup...');
  
  try {
    // Check all required tables
    const requiredTables = ['expenses', 'transactions', 'customers', 'products', 'orders'];
    
    for (const tableName of requiredTables) {
      const { data: tableInfo, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_name', tableName);

      if (error) {
        console.error(`❌ Error checking ${tableName}:`, error);
        continue;
      }

      if (!tableInfo || tableInfo.length === 0) {
        console.log(`❌ Table ${tableName} does not exist`);
      } else {
        console.log(`✅ Table ${tableName} exists`);
      }
    }

    console.log('📋 Database setup check completed');

  } catch (error) {
    console.error('❌ Error during database setup check:', error);
  }
}; 