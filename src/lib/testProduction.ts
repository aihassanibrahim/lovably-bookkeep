import { supabase } from '@/integrations/supabase/client';

export async function testProductionTable() {
  console.log('🔍 Testing production_tasks table...');
  
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ No authenticated user found');
      return 'No authenticated user found. Please log in.';
    }
    
    console.log('✅ User authenticated:', user.id);

    // Test 1: Check if production_tasks table exists
    console.log('1. Testing production_tasks table existence...');
    const { data: tableTest, error: tableError } = await supabase
      .from('production_tasks')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ Production tasks table error:', tableError);
      return `Production tasks table error: ${tableError.message}`;
    } else {
      console.log('✅ Production tasks table exists');
    }

    // Test 2: Check table structure
    console.log('2. Testing table structure...');
    const { data: structureTest, error: structureError } = await supabase
      .from('production_tasks')
      .select('id, task_number, title, description, order_id, product_id, status, priority, due_date, estimated_hours, actual_hours, assigned_to, notes')
      .limit(0);

    if (structureError) {
      console.error('❌ Table structure error:', structureError);
      return `Table structure error: ${structureError.message}`;
    } else {
      console.log('✅ Table structure is correct');
    }

    // Test 3: Try to create a test production task
    console.log('3. Testing production task creation...');
    const testTask = {
      task_number: `TEST-${Date.now()}`,
      title: 'Test Production Task',
      description: 'This is a test production task',
      status: 'pending',
      priority: 'medium',
      user_id: user.id
    };

    console.log('Test task data:', testTask);

    const { data: createData, error: createError } = await supabase
      .from('production_tasks')
      .insert(testTask)
      .select()
      .single();

    if (createError) {
      console.error('❌ Production task creation failed:', createError);
      return `Production task creation failed: ${createError.message}`;
    } else {
      console.log('✅ Production task creation successful:', createData);
      
      // Clean up
      const { error: deleteError } = await supabase
        .from('production_tasks')
        .delete()
        .eq('id', createData.id);
      
      if (deleteError) {
        console.error('Warning: Could not delete test production task:', deleteError);
      } else {
        console.log('✅ Test production task cleaned up');
      }
      
      return 'Production table test passed!';
    }

  } catch (error) {
    console.error('❌ Production test failed:', error);
    return `Test failed: ${error.message}`;
  }
} 