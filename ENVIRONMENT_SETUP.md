# Environment Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
STRIPE_PRO_PRICE_ID=price_test_your_pro_price_id_here
STRIPE_FREE_PRICE_ID=price_test_your_free_price_id_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Development Configuration
NODE_ENV=development
```

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Create products and price IDs for your plans
4. Set up webhook endpoints for payment processing

## Development Mode

The application includes fallback mechanisms for development:
- If Stripe keys are not configured, the app will simulate payments
- Demo mode is available for testing without real accounts
- LocalStorage fallbacks are in place for onboarding completion

## Security Notes

- Never commit real API keys to version control
- Use test keys for development
- Keep production keys secure
- The application now uses placeholder values by default 