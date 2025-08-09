module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    // Check environment variables
    const envCheck = {
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasStripePriceId: !!process.env.STRIPE_PRO_PRICE_ID,
      hasViteStripePriceId: !!process.env.VITE_STRIPE_PRO_PRICE_ID,
      stripeSecretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'NOT_SET',
      supabaseServiceKeyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) || 'NOT_SET',
      stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'NOT_SET',
      viteStripePriceId: process.env.VITE_STRIPE_PRO_PRICE_ID || 'NOT_SET'
    };

    res.status(200).json({
      message: 'Debug endpoint working',
      timestamp: new Date().toISOString(),
      environment: envCheck
    });
  } catch (error) {
    res.status(500).json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};
