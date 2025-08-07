// Test script for Stripe Tax API integration
const API_BASE = 'http://localhost:3001';

async function testTaxCalculation() {
  console.log('🧪 Testing Stripe Tax API Integration...\n');

  // Test 1: Tax calculation
  console.log('1. Testing tax calculation...');
  try {
    const taxResponse = await fetch(`${API_BASE}/api/stripe/calculate-tax`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: {
          address: {
            line1: "Storgatan 123",
            city: "Stockholm",
            postal_code: "123 45",
            country: "SE"
          },
          address_source: "billing"
        },
        lineItems: [
          {
            amount: 1000,
            reference: "pro_plan_subscription",
            tax_behavior: "exclusive",
            tax_code: "txcd_99999999"
          }
        ],
        currency: "sek"
      }),
    });

    const taxData = await taxResponse.json();
    console.log('✅ Tax calculation response:', JSON.stringify(taxData, null, 2));
  } catch (error) {
    console.error('❌ Tax calculation failed:', error.message);
  }

  // Test 2: Checkout session with tax
  console.log('\n2. Testing checkout session with tax...');
  try {
    const checkoutResponse = await fetch(`${API_BASE}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: 'pro',
        userId: 'test_user_123',
        customerDetails: {
          address: {
            line1: "Storgatan 123",
            city: "Stockholm",
            postal_code: "123 45",
            country: "SE"
          },
          address_source: "billing"
        },
        successUrl: "http://localhost:8080/success",
        cancelUrl: "http://localhost:8080/cancel"
      }),
    });

    const checkoutData = await checkoutResponse.json();
    console.log('✅ Checkout session response:', JSON.stringify(checkoutData, null, 2));
  } catch (error) {
    console.error('❌ Checkout session failed:', error.message);
  }

  // Test 3: Health check
  console.log('\n3. Testing health check...');
  try {
    const healthResponse = await fetch(`${API_BASE}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check response:', JSON.stringify(healthData, null, 2));
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }

  console.log('\n🎉 Tax API integration test completed!');
}

// Run the test
testTaxCalculation().catch(console.error);

