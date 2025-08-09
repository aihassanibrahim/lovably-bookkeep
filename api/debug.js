export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const envCheck = {
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripeSecretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) || 'NOT_SET',
      stripeProPriceId: process.env.STRIPE_PRO_PRICE_ID || 'NOT_SET',
      viteStripeProPriceId: process.env.VITE_STRIPE_PRO_PRICE_ID || 'NOT_SET',
      vitePublishableKeyPrefix: process.env.VITE_STRIPE_PUBLISHABLE_KEY?.substring(0, 7) || 'NOT_SET',
      nodeEnv: process.env.NODE_ENV || 'NOT_SET'
    };

    res.status(200).json({
      message: 'Debug endpoint working',
      timestamp: new Date().toISOString(),
      environment: envCheck
    });
  } catch (error) {
    res.status(500).json({
      error: 'Debug endpoint failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
