import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/components/auth/AuthProvider';

interface VatRate {
  id: string;
  name: string;
  rate: number;
}

interface Customer {
  id: string;
  company_name: string;
  customer_number: string;
}

interface OrderFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [vatRates, setVatRates] = useState<VatRate[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [formData, setFormData] = useState({
    order_number: '',
    customer_id: '',
    order_date: new Date().toISOString().split('T')[0],
    description: '',
    amount_excluding_vat: '',
    vat_rate_id: '',
  });

  const [calculatedAmounts, setCalculatedAmounts] = useState({
    vat_amount: 0,
    total_amount: 0,
  });

  useEffect(() => {
    fetchVatRates();
    fetchCustomers();
    generateOrderNumber();
  }, []);

  useEffect(() => {
    calculateAmounts();
  }, [formData.amount_excluding_vat, formData.vat_rate_id]);

  const fetchVatRates = async () => {
    const { data, error } = await supabase
      .from('vat_rates')
      .select('*')
      .eq('is_active', true)
      .order('rate', { ascending: true });

    if (error) {
      toast.error('Kunde inte hämta momsatser');
      return;
    }

    setVatRates(data || []);
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('id, company_name, customer_number')
      .eq('is_active', true)
      .order('company_name');

    if (error) {
      toast.error('Kunde inte hämta kunder');
      return;
    }

    setCustomers(data || []);
  };

  const generateOrderNumber = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('order_number')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error generating order number:', error);
      setFormData(prev => ({ ...prev, order_number: 'ORD-001' }));
      return;
    }

    let nextNumber = 1;
    if (data && data.length > 0) {
      const lastNumber = data[0].order_number.match(/\d+$/);
      if (lastNumber) {
        nextNumber = parseInt(lastNumber[0]) + 1;
      }
    }

    setFormData(prev => ({ 
      ...prev, 
      order_number: `ORD-${nextNumber.toString().padStart(3, '0')}` 
    }));
  };

  const calculateAmounts = () => {
    const amount = parseFloat(formData.amount_excluding_vat) || 0;
    const selectedVatRate = vatRates.find(rate => rate.id === formData.vat_rate_id);
    const vatRate = selectedVatRate ? selectedVatRate.rate : 0;
    
    const vatAmount = (amount * vatRate) / 100;
    const totalAmount = amount + vatAmount;

    setCalculatedAmounts({
      vat_amount: vatAmount,
      total_amount: totalAmount,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: formData.order_number,
          customer_id: formData.customer_id || null,
          order_date: formData.order_date,
          description: formData.description,
          amount_excluding_vat: parseFloat(formData.amount_excluding_vat),
          vat_rate_id: formData.vat_rate_id,
          vat_amount: calculatedAmounts.vat_amount,
          total_amount: calculatedAmounts.total_amount,
          status: 'draft',
        });

      if (error) throw error;

      toast.success('Order skapad!');
      onSuccess?.();
    } catch (error: any) {
      toast.error('Kunde inte skapa order', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skapa ny order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order_number">Ordernummer</Label>
              <Input
                id="order_number"
                value={formData.order_number}
                onChange={(e) => setFormData(prev => ({ ...prev, order_number: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="order_date">Orderdatum</Label>
              <Input
                id="order_date"
                type="date"
                value={formData.order_date}
                onChange={(e) => setFormData(prev => ({ ...prev, order_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customer_id">Kund (valfritt)</Label>
            <Select value={formData.customer_id} onValueChange={(value) => setFormData(prev => ({ ...prev, customer_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Välj kund" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.company_name} ({customer.customer_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Beskrivning</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              placeholder="Beskriv vad ordern gäller..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount_excluding_vat">Belopp exkl. moms</Label>
              <Input
                id="amount_excluding_vat"
                type="number"
                step="0.01"
                value={formData.amount_excluding_vat}
                onChange={(e) => setFormData(prev => ({ ...prev, amount_excluding_vat: e.target.value }))}
                required
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="vat_rate_id">Momssats</Label>
              <Select value={formData.vat_rate_id} onValueChange={(value) => setFormData(prev => ({ ...prev, vat_rate_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Välj momssats" />
                </SelectTrigger>
                <SelectContent>
                  {vatRates.map((rate) => (
                    <SelectItem key={rate.id} value={rate.id}>
                      {rate.name} ({rate.rate}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.amount_excluding_vat && formData.vat_rate_id && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Belopp exkl. moms:</span>
                <span>{parseFloat(formData.amount_excluding_vat).toFixed(2)} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Moms:</span>
                <span>{calculatedAmounts.vat_amount.toFixed(2)} kr</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Totalt inkl. moms:</span>
                <span>{calculatedAmounts.total_amount.toFixed(2)} kr</span>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Skapar...' : 'Skapa order'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Avbryt
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};