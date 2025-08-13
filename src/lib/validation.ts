// Validation utilities for BizPal application
// Ensures data integrity before sending to Supabase

export interface OrderData {
  customer_name: string;
  product_name: string;
  price: number;
  customer_social_media?: string;
  customer_phone?: string;
  customer_address?: string;
  product_details?: string;
  product_customizations?: string;
  status?: string;
  order_date?: string;
  estimated_completion?: string;
  notes?: string;
}

export interface ProductData {
  name: string;
  price: number;
  cost?: number;
  category?: string;
  description?: string;
  product_number?: string;
}

export interface CustomerData {
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Order validation
export const validateOrderData = (data: Partial<OrderData>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.customer_name?.trim()) {
    errors.push('Kundnamn krävs');
  }

  if (!data.product_name?.trim()) {
    errors.push('Produktnamn krävs');
  }

  if (data.price === undefined || data.price === null || isNaN(data.price) || data.price < 0) {
    errors.push('Giltigt pris krävs (minst 0 SEK)');
  }

  if (data.status && !['Beställd', 'I produktion', 'Klar', 'Levererad', 'Avbruten'].includes(data.status)) {
    errors.push('Ogiltig status');
  }

  if (data.order_date && !isValidDate(data.order_date)) {
    errors.push('Ogiltigt orderdatum');
  }

  if (data.estimated_completion && !isValidDate(data.estimated_completion)) {
    errors.push('Ogiltigt leveransdatum');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Product validation
export const validateProductData = (data: Partial<ProductData>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push('Produktnamn krävs');
  }

  if (data.price === undefined || data.price === null || isNaN(data.price) || data.price < 0) {
    errors.push('Giltigt pris krävs (minst 0 SEK)');
  }

  if (data.cost !== undefined && data.cost !== null && (isNaN(data.cost) || data.cost < 0)) {
    errors.push('Kostnad kan inte vara negativ');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Customer validation
export const validateCustomerData = (data: Partial<CustomerData>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.company_name?.trim()) {
    errors.push('Företagsnamn krävs');
  }

  if (data.email && data.email.trim() && !isValidEmail(data.email.trim())) {
    errors.push('Ogiltig e-postadress');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Sanitize data before sending to database
export const sanitizeOrderData = (data: Partial<OrderData>): OrderData => {
  return {
    customer_name: data.customer_name?.trim() || '',
    product_name: data.product_name?.trim() || '',
    price: Number(data.price) || 0,
    customer_social_media: data.customer_social_media?.trim() || '',
    customer_phone: data.customer_phone?.trim() || '',
    customer_address: data.customer_address?.trim() || '',
    product_details: data.product_details?.trim() || '',
    product_customizations: data.product_customizations?.trim() || '',
    status: data.status || 'Beställd',
    order_date: data.order_date || new Date().toISOString().split('T')[0],
    estimated_completion: data.estimated_completion || '',
    notes: data.notes?.trim() || ''
  };
};

export const sanitizeProductData = (data: Partial<ProductData>): ProductData => {
  return {
    name: data.name?.trim() || '',
    price: Number(data.price) || 0,
    cost: Number(data.cost) || 0,
    category: data.category?.trim() || '',
    description: data.description?.trim() || '',
    product_number: data.product_number?.trim() || `PROD-${Date.now()}`
  };
};

export const sanitizeCustomerData = (data: Partial<CustomerData>): CustomerData => {
  return {
    company_name: data.company_name?.trim() || '',
    contact_person: data.contact_person?.trim() || '',
    email: data.email?.trim() || '',
    phone: data.phone?.trim() || '',
    address: data.address?.trim() || ''
  };
};