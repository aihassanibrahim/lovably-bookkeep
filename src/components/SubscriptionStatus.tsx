import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Link } from 'react-router-dom';

interface SubscriptionStatusProps {
  className?: string;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ className }) => {
  const { 
    subscription, 
    loading, 
    error, 
    getSubscriptionPlan, 
    isActive, 
    isTrialing, 
    isCanceled,
    getCurrentPeriodEnd 
  } = useSubscription();

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-6">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600">Kunde inte ladda prenumerationsstatus</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription || !subscription.subscription_id) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Prenumeration
          </CardTitle>
          <CardDescription>
            Du har ingen aktiv prenumeration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/pricing">
              Uppgradera till Pro
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const planName = getSubscriptionPlan();
  const periodEnd = getCurrentPeriodEnd();

  const getStatusBadge = () => {
    if (isActive()) {
      return <Badge className="bg-green-100 text-green-800">Aktiv</Badge>;
    }
    if (isTrialing()) {
      return <Badge className="bg-blue-100 text-blue-800">Testperiod</Badge>;
    }
    if (isCanceled()) {
      return <Badge className="bg-red-100 text-red-800">Avbruten</Badge>;
    }
    return <Badge variant="secondary">{subscription.subscription_status}</Badge>;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Prenumeration
          </div>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          {planName || 'Din prenumerationsplan'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {periodEnd && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {subscription.cancel_at_period_end 
                ? `Upphör ${periodEnd.toLocaleDateString('sv-SE')}`
                : `Förnyas ${periodEnd.toLocaleDateString('sv-SE')}`
              }
            </span>
          </div>
        )}

        {subscription.payment_method_brand && subscription.payment_method_last4 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="h-4 w-4" />
            <span>
              {subscription.payment_method_brand.toUpperCase()} ****{subscription.payment_method_last4}
            </span>
          </div>
        )}

        {!isActive() && !isTrialing() && (
          <Button asChild className="w-full">
            <Link to="/pricing">
              Förnya prenumeration
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};