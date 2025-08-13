import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Crown, Zap } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { stripeProducts } from '@/stripe-config';
import { toast } from 'sonner';

interface StripeCheckoutProps {
  className?: string;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({ className }) => {
  const { user, session } = useAuth();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, mode: 'payment' | 'subscription') => {
    if (!user || !session) {
      toast.error('Du måste vara inloggad för att köpa');
      return;
    }

    setLoadingProductId(priceId);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
          mode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Något gick fel');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Ingen checkout URL mottagen');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Något gick fel vid checkout');
    } finally {
      setLoadingProductId(null);
    }
  };

  const formatPrice = (priceId: string) => {
    // For the BizPal Pro plan, we know it's 99 SEK
    if (priceId === 'price_1Rvmai5xRIq0n1Pt2tAgC2Vz') {
      return '99 kr/månad';
    }
    return 'Kontakta oss';
  };

  return (
    <div className={`${className} max-w-lg mx-auto`}>
      <div className="space-y-6">
        {stripeProducts.map((product) => (
          <Card key={product.priceId} className="finpay-card p-8 relative border-[hsl(var(--teal-primary))] shadow-lg">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-[hsl(var(--teal-primary))] text-white border-0 px-4 py-1">
                REKOMMENDERAD
              </Badge>
            </div>
            
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                  <Crown className="h-6 w-6 text-[hsl(var(--teal-primary))]" />
                  {product.name}
                </CardTitle>
                {product.mode === 'subscription' && (
                  <Badge className="bg-[hsl(var(--teal-primary))]/10 text-[hsl(var(--teal-primary))] border-0">
                    Prenumeration
                  </Badge>
                )}
              </div>
              <CardDescription className="text-lg">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[hsl(var(--dark-navy))]">
                {formatPrice(product.priceId)}
                </div>
                <div className="text-gray-500">/månad</div>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Obegränsade ordrar</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Avancerad kundhantering</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Produktkatalog</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Rapporter och analys</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Prioriterad support</span>
                </li>
              </ul>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Obegränsade ordrar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Kundhantering</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Produktkatalog</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Rapporter och statistik</span>
                </div>
              </div>

              <Button
                onClick={() => handleCheckout(product.priceId, product.mode)}
                disabled={loadingProductId === product.priceId}
                className="w-full finpay-button-primary h-12"
              >
                {loadingProductId === product.priceId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Laddar...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Uppgradera till Pro
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
              <Button
                onClick={() => handleCheckout(product.priceId, product.mode)}
                disabled={loadingProductId === product.priceId}
                className="w-full"
              >
                {loadingProductId === product.priceId ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Laddar...
                  </>
                ) : (
                  `Köp ${product.name}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};