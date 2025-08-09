import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    env: {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasPriceId: !!process.env.VITE_STRIPE_PRO_PRICE_ID
    }
  });
}
