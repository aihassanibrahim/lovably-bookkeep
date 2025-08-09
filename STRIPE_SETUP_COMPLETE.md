# Stripe Setup Complete! 🎉

## Environment Variables for Vercel

Add these to your Vercel project settings → Environment Variables. Do NOT commit real keys to git.

### Production Environment Variables (LIVE)
- `STRIPE_SECRET_KEY` = `sk_live_****************` (copy from Stripe Dashboard)
- `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_****************`
- `VITE_STRIPE_PRO_PRICE_ID` = `price_****************`
- `STRIPE_PRO_PRICE_ID` = `price_****************`

### Preview/Development (TEST)
- `STRIPE_SECRET_KEY` = `sk_test_****************`
- `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_test_****************`
- `VITE_STRIPE_PRO_PRICE_ID` = `price_test_****************`
- `STRIPE_PRO_PRICE_ID` = `price_test_****************`

Note: Manage real values only in Vercel environment variables. Never store secrets in the repository.

## What happens now:

1. ✅ Real Stripe checkout sessions are created
2. ✅ Customers are redirected to Stripe
3. ✅ Payments are processed
4. ✅ You get paid when customers subscribe to Pro

## Test the payment flow (test mode)
- Use a Preview deployment with test keys
- Card: `4242 4242 4242 4242`

## Next steps
- Ensure `VITE_PUBLIC_APP_URL` or `NEXT_PUBLIC_APP_URL` is set to your live URL
- Redeploy: `npx vercel --prod --yes`
- Optional: Configure webhooks for subscription sync

Secrets policy: All keys must live in Vercel env vars only. 