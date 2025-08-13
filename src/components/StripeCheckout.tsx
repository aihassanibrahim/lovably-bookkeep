import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
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
    <div className={className}>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {stripeProducts.map((product) => (
          <Card key={product.priceId} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{product.name}</CardTitle>
                {product.mode === 'subscription' && (
                  <Badge variant="secondary">Prenumeration</Badge>
                )}
              </div>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">
                {formatPrice(product.priceId)}
              </div>
              
              <div className="space-y-2">
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