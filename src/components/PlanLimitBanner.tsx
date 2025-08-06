import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Crown, ArrowUp } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/components/auth/AuthProvider';
import { redirectToCheckout } from '@/lib/stripe-client';
import { toast } from 'sonner';

interface PlanLimitBannerProps {
  type: 'transactions' | 'customers';
  currentCount: number;
  limit: number;
  className?: string;
}

export const PlanLimitBanner: React.FC<PlanLimitBannerProps> = ({
  type,
  currentCount,
  limit,
  className = '',
}) => {
  const { subscription, canPerformAction, isFreePlan } = useSubscription();
  const { user } = useAuth();

  const percentage = Math.min((currentCount / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

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

  if (!isFreePlan() || !isNearLimit) {
    return null;
  }

  return (
    <Alert className={`border-orange-200 bg-orange-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="mt-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-orange-800">
              {type === 'transactions' ? 'Transaktioner' : 'Kunder'} denna månad
            </span>
            <Badge variant="outline" className="text-orange-700 border-orange-300">
              {currentCount} / {limit}
            </Badge>
          </div>
          
          <Progress value={percentage} className="h-2" />
          
          {isAtLimit ? (
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-800 mb-1">
                    Du har nått din gräns
                  </h4>
                  <p className="text-sm text-orange-700 mb-3">
                    Uppgradera till Pro för obegränsad användning av {type === 'transactions' ? 'transaktioner' : 'kunder'}.
                  </p>
                  <Button 
                    onClick={handleUpgrade}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <ArrowUp className="w-4 h-4 mr-2" />
                    Uppgradera till Pro
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-orange-800 mb-1">
                    Nästan vid gränsen
                  </h4>
                  <p className="text-sm text-orange-700 mb-3">
                    Du har använt {Math.round(percentage)}% av din {type === 'transactions' ? 'transaktions' : 'kund'}gräns denna månad.
                  </p>
                  <Button 
                    onClick={handleUpgrade}
                    size="sm"
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Uppgradera för obegränsat
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Usage tracking component
export const UsageTracker: React.FC = () => {
  const { usage, getCurrentPlan } = useSubscription();
  
  if (!usage) return null;

  const plan = getCurrentPlan();
  
  // Safety check for plan limits
  if (!plan || !plan.limits) {
    console.warn('Plan or plan limits not found, using default free plan limits');
    return null;
  }
  
  const transactionPercentage = plan.limits.transactions === -1 
    ? 0 
    : Math.min((usage.transactions_count / plan.limits.transactions) * 100, 100);
  const customerPercentage = plan.limits.customers === -1 
    ? 0 
    : Math.min((usage.customers_count / plan.limits.customers) * 100, 100);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Användning denna månad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Transaktioner</span>
            <span className="font-medium">
              {usage.transactions_count} / {plan.limits.transactions === -1 ? '∞' : plan.limits.transactions}
            </span>
          </div>
          <Progress value={transactionPercentage} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Kunder</span>
            <span className="font-medium">
              {usage.customers_count} / {plan.limits.customers === -1 ? '∞' : plan.limits.customers}
            </span>
          </div>
          <Progress value={customerPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}; 