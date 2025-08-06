import { supabase } from '@/integrations/supabase/client';

export async function testInventoryTable() {
  console.log('🔍 Testing inventory_items table...');
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ No authenticated user found');
      return 'No authenticated user found. Please log in.';
    }
    
    console.log('✅ User authenticated:', user.id);

    // Test 1: Check if inventory_items table exists
    console.log('1. Testing inventory_items table existence...');
    const { data: tableTest, error: tableError } = await supabase
      .from('inventory_items')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ Inventory items table error:', tableError);
      return `Inventory items table error: ${tableError.message}`;
    } else {
      console.log('✅ Inventory items table exists');
    }

    // Test 2: Check table structure
    console.log('2. Testing table structure...');
    const { data: structureTest, error: structureError } = await supabase
      .from('inventory_items')
      .select('id, item_number, name, description, category, current_stock, min_stock, max_stock, cost_per_unit, unit, supplier_id, location')
      .limit(0);

    if (structureError) {
      console.error('❌ Table structure error:', structureError);
      return `Table structure error: ${structureError.message}`;
    } else {
      console.log('✅ Table structure is correct');
    }

    // Test 3: Try to create a test inventory item
    console.log('3. Testing inventory item creation...');
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

    console.log('Test item data:', testItem);

    const { data: createData, error: createError } = await supabase
      .from('inventory_items')
      .insert(testItem)
      .select()
      .single();

    if (createError) {
      console.error('❌ Inventory item creation failed:', createError);
      return `Inventory item creation failed: ${createError.message}`;
    } else {
      console.log('✅ Inventory item creation successful:', createData);
      
      // Clean up
      const { error: deleteError } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', createData.id);
      
      if (deleteError) {
        console.error('Warning: Could not delete test inventory item:', deleteError);
      } else {
        console.log('✅ Test inventory item cleaned up');
      }
      
      return 'Inventory table test passed!';
    }

  } catch (error) {
    console.error('❌ Inventory test failed:', error);
    return `Test failed: ${error.message}`;
  }
} 