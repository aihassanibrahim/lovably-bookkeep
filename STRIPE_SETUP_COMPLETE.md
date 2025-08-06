# Complete Stripe Setup Guide

## ✅ What's Already Done
- Stripe products created with Price IDs
- Frontend integration ready
- Database tables created

## 🔧 What You Need to Complete

### 1. Get Your Stripe Keys
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 2. Add Environment Variables to Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

### 3. Create Test User in Supabase
1. Go to Supabase → Authentication → Users
2. Click **Add user**
3. Fill in:
   - **Email:** `guest@bizpal.test`
   - **Password:** `guest123456`
   - **Email confirm:** `true`

### 4. Test the Payment Flow
1. Go to your live app
2. Log in with test user
3. Click "Uppgradera till Pro"
4. Should redirect to Stripe Checkout

## 🎯 Current Status
- ✅ Frontend: Ready
- ✅ Database: Ready  
- ✅ Stripe Products: Ready
- ⏳ Environment Variables: Need to add
- ⏳ Test User: Need to create

## 🚀 After Setup
Your freemium model will be fully functional with:
- Real Stripe payments
- Subscription management
- Usage tracking
- Guest login for testing

## 💡 Troubleshooting
If payments don't work:
1. Check environment variables are set
2. Verify Stripe keys are correct
3. Check browser console for errors
4. Ensure test user exists in Supabase 