import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/stripe';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

interface PricingSectionProps {
  onUpgrade?: (planId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onUpgrade }) => {
  const { user } = useAuth();

  const handlePlanSelect = (planId: string) => {
    if (planId === 'free') {
      toast({
        title: 'Gratis plan vald',
        description: 'Du använder redan denna plan.',
      });
      return;
    }

    if (planId === 'pro') {
      if (onUpgrade) {
        onUpgrade(planId);
      } else {
        toast({
          title: 'Uppgradering',
          description: 'Kontakta support för att uppgradera din plan.',
        });
      }
    }
  };

  const plans = [
    {
      ...PRICING_PLANS.FREE,
      icon: Zap,
      popular: false,
      description: 'Perfekt för att komma igång',
      buttonText: 'Använd gratis',
      buttonVariant: 'outline' as const,
    },
    {
      ...PRICING_PLANS.PRO,
      icon: Crown,
      popular: true,
      description: 'För växande företag',
      buttonText: 'Uppgradera till Pro',
      buttonVariant: 'default' as const,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Välj rätt plan för ditt företag
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Börja gratis och uppgradera när du växer. Alla planer inkluderar 
            grundläggande bokföring och kundregister.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-lg scale-105' 
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                    Mest populär
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {plan.price === 0 ? 'Gratis' : `${plan.price}kr`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">/månad</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    variant={plan.buttonVariant}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>

                  {/* Additional Info */}
                  {plan.id === 'free' && (
                    <p className="text-xs text-gray-500 text-center">
                      Ingen kreditkort krävs • Avsluta när som helst
                    </p>
                  )}
                  
                  {plan.id === 'pro' && (
                    <p className="text-xs text-gray-500 text-center">
                      30 dagar gratis testperiod • Avsluta när som helst
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

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