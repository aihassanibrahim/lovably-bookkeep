import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerDetails } from '@/lib/stripe-client';

interface TaxAddressFormProps {
  onSubmit: (customerDetails: CustomerDetails) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export const TaxAddressForm: React.FC<TaxAddressFormProps> = ({
  onSubmit,
  onSkip,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'SE', // Default to Sweden
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.line1.trim()) {
      newErrors.line1 = 'Adress krävs';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Stad krävs';
    }

    if (!formData.postal_code.trim()) {
      newErrors.postal_code = 'Postnummer krävs';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Land krävs';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const customerDetails: CustomerDetails = {
      address: {
        line1: formData.line1,
        line2: formData.line2 || undefined,
        city: formData.city,
        state: formData.state || undefined,
        postal_code: formData.postal_code,
        country: formData.country,
      },
      address_source: 'billing',
    };

    onSubmit(customerDetails);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Fakturaadress för momsberäkning</CardTitle>
        <CardDescription>
          Ange din fakturaadress för att beräkna rätt momsbelopp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="line1">Gatuadress *</Label>
            <Input
              id="line1"
              type="text"
              value={formData.line1}
              onChange={(e) => handleInputChange('line1', e.target.value)}
              placeholder="Storgatan 123"
              className={errors.line1 ? 'border-red-500' : ''}
            />
            {errors.line1 && (
              <p className="text-sm text-red-500">{errors.line1}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="line2">Adressrad 2 (valfritt)</Label>
            <Input
              id="line2"
              type="text"
              value={formData.line2}
              onChange={(e) => handleInputChange('line2', e.target.value)}
              placeholder="Lägenhet, hus, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Stad *</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Stockholm"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Län (valfritt)</Label>
              <Input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Stockholms län"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postnummer *</Label>
              <Input
                id="postal_code"
                type="text"
                value={formData.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                placeholder="123 45"
                className={errors.postal_code ? 'border-red-500' : ''}
              />
              {errors.postal_code && (
                <p className="text-sm text-red-500">{errors.postal_code}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Land *</Label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="SE">Sverige</option>
                <option value="NO">Norge</option>
                <option value="DK">Danmark</option>
                <option value="FI">Finland</option>
                <option value="DE">Tyskland</option>
                <option value="US">USA</option>
                <option value="GB">Storbritannien</option>
              </select>
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              disabled={isLoading}
              className="flex-1"
            >
              Hoppa över
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Beräknar...' : 'Fortsätt'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

