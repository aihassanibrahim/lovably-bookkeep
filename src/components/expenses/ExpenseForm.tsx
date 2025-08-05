import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { useBizPal } from '@/context/BizPalContext';

interface ExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { addExpense } = useBizPal();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    expense_number: '',
    supplier_name: '',
    expense_date: new Date().toISOString().split('T')[0],
    description: '',
    kostnad_med_moms: '',
    category: '',
    receipt_url: '',
    notes: ''
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
    'Material',
    'Verktyg',
    'Transport',
    'Övrigt'
  ];

  useEffect(() => {
    generateExpenseNumber();
  }, []);

  const generateExpenseNumber = () => {
    // Simple number generation - in a real app you might want to get this from context
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    setFormData(prev => ({ ...prev, expense_number: `EXP-${timestamp}-${randomNum}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      await addExpense({
        expense_number: formData.expense_number,
        supplier_name: formData.supplier_name,
        expense_date: formData.expense_date,
        description: formData.description,
        kostnad_med_moms: parseFloat(formData.kostnad_med_moms) || 0,
        category: formData.category,
        receipt_url: formData.receipt_url,
        notes: formData.notes
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrera ny utgift</CardTitle>
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
              <Label htmlFor="expense_date">Utgiftsdatum</Label>
              <Input
                id="expense_date"
                type="date"
                value={formData.expense_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expense_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier_name">Leverantör</Label>
              <Input
                id="supplier_name"
                value={formData.supplier_name}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier_name: e.target.value }))}
                placeholder="Leverantörens namn"
              />
            </div>
            <div>
              <Label htmlFor="kostnad_med_moms">Kostnad med moms (SEK)</Label>
              <Input
                id="kostnad_med_moms"
                type="number"
                step="0.01"
                value={formData.kostnad_med_moms}
                onChange={(e) => setFormData(prev => ({ ...prev, kostnad_med_moms: e.target.value }))}
                required
                placeholder="0.00"
              />
            </div>
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
              placeholder="Beskriv vad utgiften gäller..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="receipt_url">Kvittolänk (valfritt)</Label>
            <Input
              id="receipt_url"
              type="url"
              value={formData.receipt_url}
              onChange={(e) => setFormData(prev => ({ ...prev, receipt_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="notes">Anteckningar</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Övriga anteckningar..."
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Avbryt
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registrerar...' : 'Registrera Utgift'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};