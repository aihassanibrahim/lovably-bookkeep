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

interface Supplier {
  id: string;
  company_name: string;
  supplier_number: string;
}

interface ExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [vatRates, setVatRates] = useState<VatRate[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  const [formData, setFormData] = useState({
    expense_number: '',
    supplier_id: '',
    expense_date: new Date().toISOString().split('T')[0],
    description: '',
    amount_excluding_vat: '',
    vat_rate_id: '',
    category: '',
  });

  const [calculatedAmounts, setCalculatedAmounts] = useState({
    vat_amount: 0,
    total_amount: 0,
  });

  const expenseCategories = [
    'Kontorsmaterial',
    'Resor',
    'Marknadsföring',
    'IT och programvara',
    'Konsulttjänster',
    'Hyra',
    'Telefon och internet',
    'Försäkringar',
    'Övrigt',
  ];

  useEffect(() => {
    fetchVatRates();
    fetchSuppliers();
    generateExpenseNumber();
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

  const fetchSuppliers = async () => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('id, company_name, supplier_number')
      .eq('is_active', true)
      .order('company_name');

    if (error) {
      toast.error('Kunde inte hämta leverantörer');
      return;
    }

    setSuppliers(data || []);
  };

  const generateExpenseNumber = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('expense_number')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error generating expense number:', error);
      setFormData(prev => ({ ...prev, expense_number: 'EXP-001' }));
      return;
    }

    let nextNumber = 1;
    if (data && data.length > 0) {
      const lastNumber = data[0].expense_number.match(/\d+$/);
      if (lastNumber) {
        nextNumber = parseInt(lastNumber[0]) + 1;
      }
    }

    setFormData(prev => ({ 
      ...prev, 
      expense_number: `EXP-${nextNumber.toString().padStart(3, '0')}` 
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
        .from('expenses')
        .insert({
          user_id: user.id,
          expense_number: formData.expense_number,
          supplier_id: formData.supplier_id || null,
          expense_date: formData.expense_date,
          description: formData.description,
          amount_excluding_vat: parseFloat(formData.amount_excluding_vat),
          vat_rate_id: formData.vat_rate_id,
          vat_amount: calculatedAmounts.vat_amount,
          total_amount: calculatedAmounts.total_amount,
          category: formData.category,
        });

      if (error) throw error;

      toast.success('Utgift registrerad!');
      onSuccess?.();
    } catch (error: any) {
      toast.error('Kunde inte registrera utgift', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrera utgift</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expense_number">Utgiftsnummer</Label>
              <Input
                id="expense_number"
                value={formData.expense_number}
                onChange={(e) => setFormData(prev => ({ ...prev, expense_number: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="expense_date">Datum</Label>
              <Input
                id="expense_date"
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expense_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="supplier_id">Leverantör (valfritt)</Label>
            <Select value={formData.supplier_id} onValueChange={(value) => setFormData(prev => ({ ...prev, supplier_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Välj leverantör" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.company_name} ({supplier.supplier_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Välj kategori" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
              placeholder="Beskriv utgiften..."
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
              {loading ? 'Registrerar...' : 'Registrera utgift'}
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