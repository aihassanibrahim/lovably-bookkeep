import React, { useEffect, useRef } from 'react';
import { STRIPE_PRICING_TABLE_ID, STRIPE_PUBLISHABLE_KEY } from '@/lib/stripe';

interface StripePricingTableProps {
  className?: string;
}

export const StripePricingTable: React.FC<StripePricingTableProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The script is already loaded in index.html, so we just need to wait for it
    const checkStripe = () => {
      if (window.Stripe) {
        // Stripe is loaded, we can proceed
        return;
      }
      // Check again in 100ms
      setTimeout(checkStripe, 100);
    };

    checkStripe();
  }, []);

  return (
    <div ref={containerRef} className={`w-full max-w-4xl mx-auto ${className}`}>
      <stripe-pricing-table
        pricing-table-id={STRIPE_PRICING_TABLE_ID}
        publishable-key={STRIPE_PUBLISHABLE_KEY}
      />
    </div>
  );
}; 