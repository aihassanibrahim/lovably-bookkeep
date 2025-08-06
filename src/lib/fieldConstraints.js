// Database Field Constraints and Required Fields Reference

export const FIELD_CONSTRAINTS = {
  products: {
    required: ['product_number', 'name', 'price', 'cost'],
    maxLengths: {
      product_number: 50,
      name: 255,
      category: 100,
      description: 'TEXT' // No limit
    }
  },
  customers: {
    required: ['customer_number', 'company_name'],
    maxLengths: {
      customer_number: 20,
      company_name: 255,
      contact_person: 255,
      email: 255,
      phone: 50,
      org_number: 20,
      address: 'TEXT' // No limit
    }
  },
  orders: {
    required: [], // All fields are optional in the simplified schema
    maxLengths: {
      order_number: 'TEXT', // No limit
      customer_name: 'TEXT',
      customer_social_media: 'TEXT',
      customer_phone: 'TEXT',
      customer_address: 'TEXT',
      product_name: 'TEXT',
      product_details: 'TEXT',
      product_customizations: 'TEXT',
      status: 'TEXT',
      notes: 'TEXT'
    }
  },
  production_tasks: {
    required: ['task_number', 'title'],
    maxLengths: {
      task_number: 50,
      title: 255,
      description: 'TEXT',
      status: 20,
      priority: 20,
      assigned_to: 255,
      notes: 'TEXT'
    }
  },
  inventory_items: {
    required: ['item_number', 'name'],
    maxLengths: {
      item_number: 50,
      name: 255,
      description: 'TEXT',
      category: 100,
      unit: 20,
      location: 255
    }
  },
  expenses: {
    required: [], // All fields are optional in the simplified schema
    maxLengths: {
      expense_number: 'TEXT',
      supplier_name: 'TEXT',
      description: 'TEXT',
      category: 'TEXT',
      receipt_url: 'TEXT',
      notes: 'TEXT'
    }
  }
};

// Helper function to validate field lengths
export function validateFieldLength(table, field, value) {
  const constraints = FIELD_CONSTRAINTS[table];
  if (!constraints || !constraints.maxLengths[field]) {
    return true; // No constraint defined
  }
  
  const maxLength = constraints.maxLengths[field];
  if (maxLength === 'TEXT') {
    return true; // TEXT fields have no limit
  }
  
  return value.length <= maxLength;
}

// Helper function to get required fields for a table
export function getRequiredFields(table) {
  return FIELD_CONSTRAINTS[table]?.required || [];
}

// Helper function to check if all required fields are filled
export function validateRequiredFields(table, data) {
  const required = getRequiredFields(table);
  return required.every(field => data[field] && data[field].toString().trim() !== '');
} 