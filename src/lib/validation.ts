// Validering för datakvalitet och fältkontroller

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// E-postvalidering
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    errors.push('E-postadress krävs');
  } else if (!emailRegex.test(email)) {
    errors.push('Ogiltig e-postadress');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Telefonnummer-validering (svenska format)
export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  const phoneRegex = /^(\+46|0)[1-9]\d{8}$/;
  
  if (!phone) {
    errors.push('Telefonnummer krävs');
  } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    errors.push('Ogiltigt telefonnummer (svenskt format)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Datumvalidering
export const validateDate = (date: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!date) {
    errors.push('Datum krävs');
  } else {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      errors.push('Ogiltigt datum');
    } else if (dateObj > new Date()) {
      errors.push('Datum kan inte vara i framtiden');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Beloppvalidering
export const validateAmount = (amount: string | number): ValidationResult => {
  const errors: string[] = [];
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (amount === '' || amount === null || amount === undefined) {
    errors.push('Belopp krävs');
  } else if (isNaN(numAmount)) {
    errors.push('Ogiltigt belopp');
  } else if (numAmount < 0) {
    errors.push('Belopp kan inte vara negativt');
  } else if (numAmount > 999999999) {
    errors.push('Belopp är för stort');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Ordernummer-validering
export const validateOrderNumber = (orderNumber: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!orderNumber) {
    errors.push('Ordernummer krävs');
  } else if (orderNumber.length < 3) {
    errors.push('Ordernummer måste vara minst 3 tecken');
  } else if (orderNumber.length > 20) {
    errors.push('Ordernummer får inte vara längre än 20 tecken');
  } else if (!/^[A-Z0-9-_]+$/i.test(orderNumber)) {
    errors.push('Ordernummer får bara innehålla bokstäver, siffror, bindestreck och understreck');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Kundnamn-validering
export const validateCustomerName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Kundnamn krävs');
  } else if (name.length < 2) {
    errors.push('Kundnamn måste vara minst 2 tecken');
  } else if (name.length > 100) {
    errors.push('Kundnamn får inte vara längre än 100 tecken');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Produktnamn-validering
export const validateProductName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Produktnamn krävs');
  } else if (name.length < 2) {
    errors.push('Produktnamn måste vara minst 2 tecken');
  } else if (name.length > 200) {
    errors.push('Produktnamn får inte vara längre än 200 tecken');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Beskrivning-validering
export const validateDescription = (description: string): ValidationResult => {
  const errors: string[] = [];
  
  if (description && description.length > 1000) {
    errors.push('Beskrivning får inte vara längre än 1000 tecken');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sociala medier-validering
export const validateSocialMedia = (socialMedia: string): ValidationResult => {
  const errors: string[] = [];
  
  if (socialMedia) {
    if (socialMedia.length > 50) {
      errors.push('Sociala medier-handtag får inte vara längre än 50 tecken');
    } else if (!/^@?[a-zA-Z0-9._]+$/.test(socialMedia)) {
      errors.push('Ogiltigt format för sociala medier-handtag');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Kategori-validering
export const validateCategory = (category: string): ValidationResult => {
  const errors: string[] = [];
  
  if (category && category.length > 50) {
    errors.push('Kategori får inte vara längre än 50 tecken');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Order-validering (komplett)
export const validateOrder = (orderData: any): ValidationResult => {
  const errors: string[] = [];
  
  // Validera alla fält
  const orderNumberResult = validateOrderNumber(orderData.order_number);
  const customerNameResult = validateCustomerName(orderData.customer_name);
  const productNameResult = validateProductName(orderData.product_name);
  const priceResult = validateAmount(orderData.price);
  const orderDateResult = validateDate(orderData.order_date);
  const socialMediaResult = validateSocialMedia(orderData.customer_social_media);
  const descriptionResult = validateDescription(orderData.notes);
  
  // Samla alla fel
  errors.push(...orderNumberResult.errors);
  errors.push(...customerNameResult.errors);
  errors.push(...productNameResult.errors);
  errors.push(...priceResult.errors);
  errors.push(...orderDateResult.errors);
  errors.push(...socialMediaResult.errors);
  errors.push(...descriptionResult.errors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Kund-validering (komplett)
export const validateCustomer = (customerData: any): ValidationResult => {
  const errors: string[] = [];
  
  const nameResult = validateCustomerName(customerData.name);
  const emailResult = validateEmail(customerData.email);
  const phoneResult = validatePhone(customerData.phone);
  const socialMediaResult = validateSocialMedia(customerData.social_media);
  
  errors.push(...nameResult.errors);
  errors.push(...emailResult.errors);
  errors.push(...phoneResult.errors);
  errors.push(...socialMediaResult.errors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Produkt-validering (komplett)
export const validateProduct = (productData: any): ValidationResult => {
  const errors: string[] = [];
  
  const nameResult = validateProductName(productData.name);
  const priceResult = validateAmount(productData.price);
  const categoryResult = validateCategory(productData.category);
  const descriptionResult = validateDescription(productData.description);
  
  errors.push(...nameResult.errors);
  errors.push(...priceResult.errors);
  errors.push(...categoryResult.errors);
  errors.push(...descriptionResult.errors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Transaktion-validering (komplett)
export const validateTransaction = (transactionData: any): ValidationResult => {
  const errors: string[] = [];
  
  const amountResult = validateAmount(transactionData.total_amount);
  const dateResult = validateDate(transactionData.transaction_date);
  const descriptionResult = validateDescription(transactionData.description);
  const categoryResult = validateCategory(transactionData.category);
  
  errors.push(...amountResult.errors);
  errors.push(...dateResult.errors);
  errors.push(...descriptionResult.errors);
  errors.push(...categoryResult.errors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Formatera felmeddelanden för visning
export const formatValidationErrors = (errors: string[]): string => {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  return errors.join(', ');
};

// Sanitize input (ta bort farliga tecken)
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Ta bort < och >
    .replace(/javascript:/gi, '') // Ta bort javascript:
    .replace(/on\w+=/gi, ''); // Ta bort event handlers
};

// Formatera telefonnummer för visning
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Ta bort alla icke-siffror
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatera svenska nummer
  if (cleaned.startsWith('46')) {
    return `+46 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  } else if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
};

// Formatera belopp för visning
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Formatera datum för visning
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('sv-SE');
}; 