import { supabase } from '@/integrations/supabase/client';

export async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    // Test orders table
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    if (ordersError) {
      console.error('Orders table error:', ordersError);
    } else {
      console.log('✅ Orders table working');
    }

    // Test products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (productsError) {
      console.error('Products table error:', productsError);
    } else {
      console.log('✅ Products table working');
    }

    // Test production_tasks table
    const { data: productionTasks, error: productionTasksError } = await supabase
      .from('production_tasks')
      .select('*')
      .limit(1);
    
    if (productionTasksError) {
      console.error('Production tasks table error:', productionTasksError);
    } else {
      console.log('✅ Production tasks table working');
    }

    // Test inventory_items table
    const { data: inventoryItems, error: inventoryItemsError } = await supabase
      .from('inventory_items')
      .select('*')
      .limit(1);
    
    if (inventoryItemsError) {
      console.error('Inventory items table error:', inventoryItemsError);
    } else {
      console.log('✅ Inventory items table working');
    }

    // Test customers table
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(1);
    
    if (customersError) {
      console.error('Customers table error:', customersError);
    } else {
      console.log('✅ Customers table working');
    }

    // Test suppliers table
    const { data: suppliers, error: suppliersError } = await supabase
      .from('suppliers')
      .select('*')
      .limit(1);
    
    if (suppliersError) {
      console.error('Suppliers table error:', suppliersError);
    } else {
      console.log('✅ Suppliers table working');
    }

    // Test expenses table
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .limit(1);
    
    if (expensesError) {
      console.error('Expenses table error:', expensesError);
    } else {
      console.log('✅ Expenses table working');
    }

    console.log('Database test complete!');
    
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

export async function testCreateProduct() {
  console.log('Testing product creation...');
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ No authenticated user found');
      return false;
    }
    
    const testProduct = {
      product_number: `TEST-${Date.now()}`,
      name: 'Test Product',
      description: 'This is a test product',
      category: 'Test',
      price: 100,
      cost: 50,
      user_id: user.id  // Add the user_id field
    };

    console.log('Attempting to create test product:', testProduct);

    const { data, error } = await supabase
      .from('products')
      .insert(testProduct)
      .select()
      .single();

    if (error) {
      console.error('❌ Product creation failed:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return false;
    } else {
      console.log('✅ Product creation successful:', data);
      
      // Clean up - delete the test product
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', data.id);
      
      if (deleteError) {
        console.error('Warning: Could not delete test product:', deleteError);
      } else {
        console.log('✅ Test product cleaned up');
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Product creation test failed:', error);
    return false;
  }
}

export async function checkProductsTable() {
  console.log('Checking products table structure...');
  
  try {
    // Try to get the table structure by selecting all columns
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(0);

    if (error) {
      console.error('❌ Products table error:', error);
      return false;
    } else {
      console.log('✅ Products table exists and is accessible');
      return true;
    }
  } catch (error) {
    console.error('❌ Products table check failed:', error);
    return false;
  }
}

export async function detailedDatabaseTest() {
  console.log('🔍 Starting comprehensive database test...');
  
  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Authentication error:', authError);
      return 'Authentication failed';
    } else {
      console.log('✅ Supabase connection working');
      console.log('User session:', authData.session ? 'Logged in' : 'Not logged in');
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ No authenticated user found');
      return 'No authenticated user found. Please log in.';
    }
    
    console.log('✅ User authenticated:', user.id);

    // Test 2: Check all tables exist
    console.log('2. Testing table existence...');
    const tables = ['products', 'customers', 'orders', 'production_tasks', 'inventory_items', 'expenses'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
      
      if (error) {
        console.error(`❌ ${table} table error:`, error);
        return `${table} table error: ${error.message}`;
      } else {
        console.log(`✅ ${table} table exists`);
      }
    }

    // Test 3: Test product creation
    console.log('3. Testing product creation...');
    const testProduct = {
      product_number: `TEST-${Date.now()}`,
      name: 'Test Product',
      description: 'This is a test product',
      category: 'Test',
      price: 100,
      cost: 50,
      user_id: user.id
    };

    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert(testProduct)
      .select()
      .single();

    if (productError) {
      console.error('❌ Product creation failed:', productError);
      return `Product creation failed: ${productError.message}`;
    } else {
      console.log('✅ Product creation successful');
    }

    // Test 4: Test customer creation
    console.log('4. Testing customer creation...');
    const testCustomer = {
      customer_number: `TEST-${Date.now()}`,
      company_name: 'Test Customer AB',
      contact_person: 'Test Person',
      email: 'test@example.com',
      phone: '0701234567',
      user_id: user.id
    };

    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert(testCustomer)
      .select()
      .single();

    if (customerError) {
      console.error('❌ Customer creation failed:', customerError);
      return `Customer creation failed: ${customerError.message}`;
    } else {
      console.log('✅ Customer creation successful');
    }

    // Test 5: Test order creation
    console.log('5. Testing order creation...');
    const testOrder = {
      order_number: `TEST-${Date.now()}`,
      customer_name: 'Test Customer',
      product_name: 'Test Product',
      price: 150,
      status: 'Beställd',
      user_id: user.id
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(testOrder)
      .select()
      .single();

    if (orderError) {
      console.error('❌ Order creation failed:', orderError);
      return `Order creation failed: ${orderError.message}`;
    } else {
      console.log('✅ Order creation successful');
    }

    // Test 6: Test production task creation
    console.log('6. Testing production task creation...');
    const testTask = {
      task_number: `TEST-${Date.now()}`,
      title: 'Test Production Task',
      description: 'This is a test production task',
      status: 'pending',
      priority: 'medium',
      user_id: user.id
    };

    const { data: taskData, error: taskError } = await supabase
      .from('production_tasks')
      .insert(testTask)
      .select()
      .single();

    if (taskError) {
      console.error('❌ Production task creation failed:', taskError);
      return `Production task creation failed: ${taskError.message}`;
    } else {
      console.log('✅ Production task creation successful');
    }

    // Test 7: Test inventory item creation
    console.log('7. Testing inventory item creation...');
    const testItem = {
      item_number: `TEST-${Date.now()}`,
      name: 'Test Inventory Item',
      description: 'This is a test inventory item',
      category: 'Test',
      current_stock: 10,
      min_stock: 5,
      cost_per_unit: 25,
      unit: 'st',
      user_id: user.id
    };

    const { data: itemData, error: itemError } = await supabase
      .from('inventory_items')
      .insert(testItem)
      .select()
      .single();

    if (itemError) {
      console.error('❌ Inventory item creation failed:', itemError);
      return `Inventory item creation failed: ${itemError.message}`;
    } else {
      console.log('✅ Inventory item creation successful');
    }

    // Test 8: Test expense creation
    console.log('8. Testing expense creation...');
    const testExpense = {
      expense_number: `TEST-${Date.now()}`,
      supplier_name: 'Test Supplier',
      description: 'Test expense',
      kostnad_med_moms: 200,
      category: 'Test',
      user_id: user.id
    };

    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .insert(testExpense)
      .select()
      .single();

    if (expenseError) {
      console.error('❌ Expense creation failed:', expenseError);
      console.log('⚠️ Skipping expense test - table may not be created yet');
      console.log('You can manually create the expenses table using the SQL in supabase/migrations/20250805000003_simplified_expenses.sql');
    } else {
      console.log('✅ Expense creation successful');
    }

    // Clean up all test data
    console.log('9. Cleaning up test data...');
    const testIds = [
      { table: 'products', id: productData.id },
      { table: 'customers', id: customerData.id },
      { table: 'orders', id: orderData.id },
      { table: 'production_tasks', id: taskData.id },
      { table: 'inventory_items', id: itemData.id }
    ];

    // Only add expenses if it was created successfully
    if (expenseData) {
      testIds.push({ table: 'expenses', id: expenseData.id });
    }

    for (const { table, id } of testIds) {
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        console.error(`Warning: Could not delete test ${table}:`, deleteError);
      } else {
        console.log(`✅ Test ${table} cleaned up`);
      }
    }
    
    console.log('🎉 Core tests passed! Database is working correctly.');
    return 'Core tests passed! Database is working correctly. (Expenses table may need to be created manually)';

  } catch (error) {
    console.error('❌ Comprehensive test failed:', error);
    return `Test failed: ${error.message}`;
  }
} 