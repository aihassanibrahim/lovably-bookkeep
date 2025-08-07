# Stripe Tax API Integration

This document explains how to use the Stripe Tax API integration that has been implemented in BizPal.

## Overview

The Stripe Tax API integration allows you to automatically calculate and collect sales tax, GST, and VAT for your customers. The implementation includes:

- **Tax Calculation**: Calculate tax based on customer address and line items
- **Tax Collection**: Collect tax during checkout
- **Tax Recording**: Create tax transactions to record collected tax
- **Tax Reversals**: Handle refunds with automatic tax reversals

## Features Implemented

### 1. Server-Side Tax Endpoints

The following endpoints have been added to `server.js`:

#### `/api/stripe/calculate-tax`
Calculates tax for a given customer address and line items.

**Request:**
```json
{
  "customer": {
    "address": {
      "line1": "Storgatan 123",
      "city": "Stockholm",
      "postal_code": "123 45",
      "country": "SE"
    },
    "address_source": "billing"
  },
  "lineItems": [
    {
      "amount": 1000,
      "reference": "pro_plan_subscription",
      "tax_behavior": "exclusive",
      "tax_code": "txcd_99999999"
    }
  ],
  "currency": "sek"
}
```

**Response:**
```json
{
  "id": "txcal_1234567890",
  "tax_breakdown": {
    "tax_behavior": "exclusive",
    "taxable_amount": 1000,
    "tax_amount": 250,
    "breakdown": {
      "tax_rates": [
        {
          "tax_rate": "txr_swedish_vat",
          "taxable_amount": 1000,
          "tax_amount": 250,
          "display_name": "Swedish VAT",
          "percentage": 25.0,
          "country": "SE"
        }
      ]
    }
  }
}
```

#### `/api/stripe/create-tax-transaction`
Creates a tax transaction to record collected tax.

**Request:**
```json
{
  "calculation": "txcal_1234567890",
  "reference": "payment_cs_1234567890",
  "metadata": {
    "sessionId": "cs_1234567890",
    "userId": "user_123",
    "planId": "pro"
  }
}
```

#### `/api/stripe/create-tax-reversal`
Creates a tax reversal for refunds.

**Request:**
```json
{
  "original_transaction": "txn_1234567890",
  "reference": "refund_ch_1234567890",
  "metadata": {
    "chargeId": "ch_1234567890",
    "refundReason": "customer_requested"
  }
}
```

### 2. Enhanced Checkout Session

The checkout session creation now includes:

- **Tax Calculation**: Automatic tax calculation if customer details are provided
- **Tax ID Collection**: Enables tax ID collection in Stripe Checkout
- **Address Updates**: Allows customers to update their address during checkout
- **Tax Metadata**: Stores tax calculation ID in session metadata

### 3. Webhook Integration

The webhook handler now processes:

- **Payment Success**: Creates tax transaction when payment is completed
- **Refunds**: Creates tax reversal when charges are refunded

### 4. Client-Side Components

#### TaxAddressForm Component

A React component for collecting customer address information:

```tsx
import { TaxAddressForm } from '@/components/TaxAddressForm';

<TaxAddressForm
  onSubmit={(customerDetails) => {
    // Handle tax calculation with customer details
  }}
  onSkip={() => {
    // Proceed without tax calculation
  }}
  isLoading={false}
/>
```

#### EnhancedPricingSection Component

A wrapper around the pricing section that includes tax address collection:

```tsx
import { EnhancedPricingSection } from '@/components/EnhancedPricingSection';

<EnhancedPricingSection onUpgrade={(planId) => {
  // Handle plan upgrade with optional tax calculation
}} />
```

### 5. Client-Side Functions

#### calculateTax
Calculates tax for a transaction:

```tsx
import { calculateTax, CustomerDetails, LineItem } from '@/lib/stripe-client';

const customerDetails: CustomerDetails = {
  address: {
    line1: "Storgatan 123",
    city: "Stockholm",
    postal_code: "123 45",
    country: "SE"
  },
  address_source: "billing"
};

const lineItems: LineItem[] = [
  {
    amount: 1000,
    reference: "pro_plan_subscription",
    tax_behavior: "exclusive",
    tax_code: "txcd_99999999"
  }
];

const calculation = await calculateTax(customerDetails, lineItems, 'sek');
```

#### createTaxTransaction
Creates a tax transaction:

```tsx
import { createTaxTransaction } from '@/lib/stripe-client';

const transaction = await createTaxTransaction(
  calculation.id,
  `payment_${sessionId}`,
  { sessionId, userId, planId }
);
```

#### createTaxReversal
Creates a tax reversal for refunds:

```tsx
import { createTaxReversal } from '@/lib/stripe-client';

const reversal = await createTaxReversal(
  originalTransactionId,
  `refund_${chargeId}`,
  { chargeId, refundReason: 'customer_requested' }
);
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Stripe Tax API Configuration
STRIPE_TAX_ENABLED=true
STRIPE_TAX_REGISTRATION_NUMBER=your_tax_registration_number_here
VITE_STRIPE_TAX_ENABLED=true
```

### Stripe Dashboard Setup

1. **Enable Stripe Tax**: Go to your Stripe Dashboard → Tax → Get Started
2. **Configure Tax Registration**: Add your tax registration numbers
3. **Set Up Tax Codes**: Configure tax codes for your products/services
4. **Test Mode**: Use test mode for development

## Usage Examples

### Basic Tax Calculation

```tsx
import { redirectToCheckout } from '@/lib/stripe-client';

// Without tax calculation
await redirectToCheckout('pro', userId);

// With tax calculation
const customerDetails = {
  address: {
    line1: "Storgatan 123",
    city: "Stockholm",
    postal_code: "123 45",
    country: "SE"
  },
  address_source: "billing"
};

await redirectToCheckout('pro', userId, customerDetails);
```

### Custom Tax Calculation

```tsx
import { calculateTax, createTaxTransaction } from '@/lib/stripe-client';

// Calculate tax
const calculation = await calculateTax(customerDetails, lineItems, 'sek');

// Create tax transaction
const transaction = await createTaxTransaction(
  calculation.id,
  'custom_reference',
  { customField: 'value' }
);
```

### Handling Refunds

```tsx
import { createTaxReversal } from '@/lib/stripe-client';

// Create tax reversal for refund
const reversal = await createTaxReversal(
  originalTaxTransactionId,
  `refund_${chargeId}`,
  { chargeId, refundReason: 'customer_requested' }
);
```

## Development Mode

In development mode (when `STRIPE_SECRET_KEY` is not set), the system provides mock responses:

- **Tax Calculation**: Returns mock Swedish VAT calculation (25%)
- **Tax Transactions**: Returns mock transaction IDs
- **Tax Reversals**: Returns mock reversal IDs

## Error Handling

The integration includes comprehensive error handling:

- **Tax Calculation Failures**: Gracefully falls back to checkout without tax
- **Network Errors**: Retries with exponential backoff
- **Invalid Addresses**: Validates address format before sending to Stripe
- **Missing Configuration**: Provides helpful error messages

## Testing

### Test Addresses

Use these test addresses for different tax scenarios:

**Sweden (25% VAT):**
```json
{
  "line1": "Storgatan 123",
  "city": "Stockholm",
  "postal_code": "123 45",
  "country": "SE"
}
```

**Norway (25% VAT):**
```json
{
  "line1": "Karl Johans gate 1",
  "city": "Oslo",
  "postal_code": "0154",
  "country": "NO"
}
```

**USA (varies by state):**
```json
{
  "line1": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US"
}
```

### Test Line Items

```json
[
  {
    "amount": 1000,
    "reference": "test_product",
    "tax_behavior": "exclusive",
    "tax_code": "txcd_99999999"
  }
]
```

## Production Considerations

1. **Tax Registration**: Ensure all required tax registrations are completed
2. **Compliance**: Verify tax calculation accuracy for your jurisdiction
3. **Monitoring**: Set up alerts for tax calculation failures
4. **Backup**: Implement fallback tax calculation methods
5. **Audit Trail**: Maintain records of all tax transactions

## Support

For issues with the Stripe Tax API integration:

1. Check the Stripe Tax API documentation
2. Verify your Stripe Dashboard configuration
3. Review the server logs for detailed error messages
4. Test with the provided test addresses and line items

## Future Enhancements

Potential improvements to consider:

1. **IP-based Tax Estimation**: Estimate tax based on customer IP address
2. **Tax ID Collection**: Collect customer tax IDs for B2B transactions
3. **Tax-inclusive Pricing**: Support for tax-inclusive pricing models
4. **Multiple Tax Rates**: Handle complex tax scenarios with multiple rates
5. **Tax Reporting**: Generate tax reports for compliance

