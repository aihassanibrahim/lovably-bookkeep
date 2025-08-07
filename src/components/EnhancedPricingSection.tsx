import React, { useState } from 'react';
import { PricingSection } from './PricingSection';
import { TaxAddressForm } from './TaxAddressForm';
import { CustomerDetails, redirectToCheckout } from '@/lib/stripe-client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EnhancedPricingSectionProps {
  onUpgrade?: (planId: string) => void;
}

export const EnhancedPricingSection: React.FC<EnhancedPricingSectionProps> = ({ onUpgrade }) => {
  const { user } = useAuth();
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast({
        title: 'Logga in först',
        description: 'Du måste logga in för att uppgradera din plan.',
        variant: 'destructive',
      });
      return;
    }

    // Check if tax is enabled (you can make this configurable)
    const taxEnabled = import.meta.env.VITE_STRIPE_TAX_ENABLED === 'true';
    
    if (taxEnabled) {
      // Show tax address form
      setSelectedPlanId(planId);
      setShowTaxForm(true);
    } else {
      // Proceed without tax calculation
      await proceedToCheckout(planId, user.id);
    }
  };

  const proceedToCheckout = async (planId: string, userId: string, customerDetails?: CustomerDetails) => {
    setIsLoading(true);
    try {
      await redirectToCheckout(planId, userId, customerDetails);
      toast({
        title: 'Omdirigerar till betalning',
        description: 'Du kommer att skickas till Stripe för att slutföra din prenumeration.',
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Något gick fel',
        description: 'Kunde inte starta uppgraderingen. Försök igen.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setShowTaxForm(false);
    }
  };

  const handleTaxFormSubmit = async (customerDetails: CustomerDetails) => {
    if (!user) return;
    await proceedToCheckout(selectedPlanId, user.id, customerDetails);
  };

  const handleTaxFormSkip = async () => {
    if (!user) return;
    await proceedToCheckout(selectedPlanId, user.id);
  };

  return (
    <>
      <PricingSection onUpgrade={handleUpgrade} />
      
      <Dialog open={showTaxForm} onOpenChange={setShowTaxForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Momsberäkning</DialogTitle>
          </DialogHeader>
          <TaxAddressForm
            onSubmit={handleTaxFormSubmit}
            onSkip={handleTaxFormSkip}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

