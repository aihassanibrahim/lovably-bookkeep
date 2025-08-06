import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, ArrowUp, Check, X } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/components/auth/AuthProvider';
import { redirectToCheckout } from '@/lib/stripe-client';
import { toast } from 'sonner';

interface FeatureRestrictionProps {
  feature: string;
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export const FeatureRestriction: React.FC<FeatureRestrictionProps> = ({
  feature,
  title,
  description,
  children,
  className = '',
}) => {
  const { canPerformAction, isFreePlan } = useSubscription();
  const { user } = useAuth();

  const hasAccess = canPerformAction('use_feature', feature);

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: 'Logga in först',
        description: 'Du måste logga in för att uppgradera din plan.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await redirectToCheckout('pro', user.id);
      toast({
        title: 'Omdirigerar till betalning',
        description: 'Du kommer att skickas till Stripe för att slutföra din prenumeration.',
      });
    } catch (error) {
      toast({
        title: 'Något gick fel',
        description: 'Kunde inte starta uppgraderingen. Försök igen.',
        variant: 'destructive',
      });
    }
  };

  if (hasAccess) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Card className={`border-dashed border-2 border-gray-300 bg-gray-50 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-gray-500" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="text-center">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Pro-funktion</span>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Denna funktion är endast tillgänglig för Pro-användare.
            </p>
            <Button 
              onClick={handleUpgrade}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Uppgradera till Pro
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Feature comparison component
export const FeatureComparison: React.FC = () => {
  const { isFreePlan, isProPlan } = useSubscription();
  const { user } = useAuth();

  const features = [
    {
      name: 'Kvittoscanning med AI',
      description: 'Ladda upp kvitton och få dem automatiskt registrerade',
      free: false,
      pro: true,
    },
    {
      name: 'Momsrapportering',
      description: 'Automatiska momsrapporter för alla perioder',
      free: false,
      pro: true,
    },
    {
      name: 'Export till Excel/PDF',
      description: 'Exportera alla data i olika format',
      free: false,
      pro: true,
    },
    {
      name: 'Avancerade rapporter',
      description: 'Detaljerade analyser och insikter',
      free: false,
      pro: true,
    },
    {
      name: 'Prioriterad support',
      description: 'Snabbare svar och dedikerad hjälp',
      free: false,
      pro: true,
    },
    {
      name: 'Obegränsade transaktioner',
      description: 'Inga gränser på antal transaktioner',
      free: false,
      pro: true,
    },
    {
      name: 'Obegränsat kundregister',
      description: 'Lägg till så många kunder du vill',
      free: false,
      pro: true,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Pro-funktioner</CardTitle>
        <p className="text-sm text-gray-600">
          Uppgradera till Pro för att låsa upp alla funktioner
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{feature.name}</span>
                  {isProPlan() && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Tillgänglig
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Free</span>
                <X className="w-4 h-4 text-red-500" />
                <span className="text-xs text-gray-500">Pro</span>
                <Check className="w-4 h-4 text-green-600" />
              </div>
            </div>
          ))}
        </div>
        
        {isFreePlan() && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-800 mb-1">
                  Uppgradera till Pro
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Få tillgång till alla funktioner för endast 99kr/månad.
                </p>
                <Button 
                  onClick={() => {
                    if (user) {
                      redirectToCheckout('pro', user.id);
                    }
                  }}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Uppgradera nu
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 