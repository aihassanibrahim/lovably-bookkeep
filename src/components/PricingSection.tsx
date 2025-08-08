import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Star } from 'lucide-react';
import { PRICING_PLANS, checkFeatureAccess } from '@/lib/stripe';
import { useAuth } from '@/components/auth/AuthProvider';
import { redirectToCheckout } from '@/lib/stripe-client';
import { toast } from 'sonner';

interface PricingSectionProps {
  onUpgrade?: (planId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onUpgrade }) => {
  const { user } = useAuth();

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast.error('Logga in först', {
        description: 'Du måste logga in för att uppgradera din plan.',
      });
      return;
    }

    try {
      await redirectToCheckout(planId, user.id);
      toast.success('Omdirigerar till betalning', {
        description: 'Du kommer att skickas till Stripe för att slutföra din prenumeration.',
      });
    } catch (error) {
      toast.error('Något gick fel', {
        description: 'Kunde inte starta uppgraderingen. Försök igen.',
      });
    }
  };

  const plans = Object.values(PRICING_PLANS);

  return (
    <section id="priser" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            Freemium Modell
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Välj rätt plan för ditt företag
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Börja free och uppgradera när du växer. Alla planer inkluderar grundläggande funktioner.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.id === 'pro' ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'}`}
            >
              {plan.id === 'pro' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Populärast
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? '0kr' : `${plan.price}kr`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/{plan.interval}</span>
                  )}
                </div>
                {plan.price === 0 && (
                  <p className="text-sm text-gray-600">För alltid</p>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>



                {/* CTA Button */}
                <Button 
                  onClick={() => handleUpgrade(plan.id)}
                  className={`w-full ${plan.id === 'pro' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                  disabled={plan.id === 'free'}
                >
                  {plan.id === 'free' ? 'Nuvarande plan' : 'Uppgradera till Pro'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Funktionsjämförelse</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold">Funktion</th>
                  <th className="text-center py-4 px-4 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-4 font-medium">Bokföring</td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Kundregister</td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Kvittoscanning med AI</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Momsrapportering</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Export till Excel/PDF</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Avancerade rapporter</td>
                  <td className="text-center py-4 px-4">
                    <X className="w-5 h-5 text-red-500 mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Support</td>
                  <td className="text-center py-4 px-4 text-sm">E-post</td>
                  <td className="text-center py-4 px-4 text-sm font-medium">Prioriterad</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">Vanliga frågor</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            <div className="space-y-2">
              <h4 className="font-semibold">Kan jag byta plan?</h4>
              <p className="text-sm text-gray-600">
                Ja, du kan uppgradera till Pro när som helst. Du kan också nedgradera tillbaka till free planen.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Vad händer med min data?</h4>
              <p className="text-sm text-gray-600">
                Din data är säker och du kan exportera den när som helst. Vi sparar dina uppgifter i 30 dagar efter uppsägning.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Finns det en testperiod?</h4>
              <p className="text-sm text-gray-600">
                Pro-planen har en 14-dagars free testperiod. Du kan avbryta när som helst utan kostnad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 