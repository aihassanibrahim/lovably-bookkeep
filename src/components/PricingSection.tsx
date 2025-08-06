import React from 'react';
import { StripePricingTable } from './StripePricingTable';

interface PricingSectionProps {
  onUpgrade?: (planId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onUpgrade }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Välj rätt plan för ditt företag
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Börja med 14 dagars gratis testperiod och uppgradera när du växer. 
            Alla planer inkluderar grundläggande bokföring och kundregister.
          </p>
        </div>

        {/* Stripe Pricing Table */}
        <StripePricingTable className="mb-16" />

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Vanliga frågor</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-sm text-gray-600">
            <div>
              <p className="font-medium mb-2">Kan jag byta plan?</p>
              <p>Ja, du kan uppgradera eller nedgradera när som helst.</p>
            </div>
            <div>
              <p className="font-medium mb-2">Vad händer med min data?</p>
              <p>Din data är säker och du kan exportera den när som helst.</p>
            </div>
            <div>
              <p className="font-medium mb-2">Finns det support?</p>
              <p>Gratis plan: E-post support. Pro: Prioriterad support.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 