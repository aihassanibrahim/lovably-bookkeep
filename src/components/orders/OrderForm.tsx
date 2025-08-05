import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { useBizPal } from '@/context/BizPalContext';

interface OrderFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { addOrder } = useBizPal();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    order_number: '',
    customer_name: '',
    customer_social_media: '',
    customer_phone: '',
    customer_address: '',
    product_name: '',
    product_details: '',
    product_customizations: '',
    price: '',
    status: 'Beställd',
    order_date: new Date().toISOString().split('T')[0],
    estimated_completion: '',
    notes: ''
  });

  useEffect(() => {
    generateOrderNumber();
  }, []);

  const generateOrderNumber = () => {
    // Simple number generation - in a real app you might want to get this from context
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    setFormData(prev => ({ ...prev, order_number: `ORD-${timestamp}-${randomNum}` }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      await addOrder({
        order_number: formData.order_number,
        customer_name: formData.customer_name,
        customer_social_media: formData.customer_social_media,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
        product_name: formData.product_name,
        product_details: formData.product_details,
        product_customizations: formData.product_customizations,
        price: parseFloat(formData.price) || 0,
        status: formData.status,
        order_date: formData.order_date,
        estimated_completion: formData.estimated_completion || null,
        notes: formData.notes
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skapa ny order från sociala medier</CardTitle>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_name">Kundnamn</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                required
                placeholder="Kundens namn"
              />
            </div>
            <div>
              <Label htmlFor="customer_social_media">Sociala medier</Label>
              <Input
                id="customer_social_media"
                value={formData.customer_social_media}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_social_media: e.target.value }))}
                placeholder="Instagram, Facebook, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_phone">Telefon</Label>
              <Input
                id="customer_phone"
                value={formData.customer_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
                placeholder="070-123 45 67"
              />
            </div>
            <div>
              <Label htmlFor="price">Pris (SEK)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customer_address">Adress</Label>
            <Textarea
              id="customer_address"
              value={formData.customer_address}
              onChange={(e) => setFormData(prev => ({ ...prev, customer_address: e.target.value }))}
              placeholder="Leveransadress"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product_name">Produktnamn</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                required
                placeholder="Vad kunden beställt"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beställd">Beställd</SelectItem>
                  <SelectItem value="I produktion">I produktion</SelectItem>
                  <SelectItem value="Klar">Klar</SelectItem>
                  <SelectItem value="Skickad">Skickad</SelectItem>
                  <SelectItem value="Levererad">Levererad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="product_details">Produktdetaljer</Label>
            <Textarea
              id="product_details"
              value={formData.product_details}
              onChange={(e) => setFormData(prev => ({ ...prev, product_details: e.target.value }))}
              placeholder="Beskrivning av produkten..."
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="product_customizations">Anpassningar</Label>
            <Textarea
              id="product_customizations"
              value={formData.product_customizations}
              onChange={(e) => setFormData(prev => ({ ...prev, product_customizations: e.target.value }))}
              placeholder="Specifika önskemål från kunden..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimated_completion">Beräknad leverans</Label>
              <Input
                id="estimated_completion"
                type="date"
                value={formData.estimated_completion}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_completion: e.target.value }))}
              />
            </div>
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
              {loading ? 'Skapar...' : 'Skapa Order'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};