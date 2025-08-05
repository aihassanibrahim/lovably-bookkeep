import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Download, Mail, Eye, Edit, Trash2, FileText } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  subtotal: number;
  vat_amount: number;
  total_amount: number;
  notes: string;
  created_at: string;
}

interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
  total: number;
}

interface Customer {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  organization_number: string;
}

const Invoices: React.FC = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  const [formData, setFormData] = useState({
    customer_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const [itemForm, setItemForm] = useState({
    description: '',
    quantity: 1,
    unit_price: 0,
    vat_rate: 25,
  });

  useEffect(() => {
    if (user) {
      fetchInvoices();
      fetchCustomers();
    }
  }, [user]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          customers!inner(company_name)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Kunde inte hämta fakturor');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('company_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Kunde inte hämta kunder');
    }
  };

  const generateInvoiceNumber = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const lastNumber = data?.[0]?.invoice_number || 'F0000';
    const nextNumber = parseInt(lastNumber.substring(1)) + 1;
    return `F${nextNumber.toString().padStart(4, '0')}`;
  };

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const vatAmount = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unit_price;
      return sum + (itemTotal * (item.vat_rate / 100));
    }, 0);
    const total = subtotal + vatAmount;

    return { subtotal, vatAmount, total };
  };

  const addItem = () => {
    if (!itemForm.description || itemForm.unit_price <= 0) {
      toast.error('Fyll i beskrivning och pris');
      return;
    }

    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      invoice_id: '',
      description: itemForm.description,
      quantity: itemForm.quantity,
      unit_price: itemForm.unit_price,
      vat_rate: itemForm.vat_rate,
      total: itemForm.quantity * itemForm.unit_price * (1 + itemForm.vat_rate / 100),
    };

    setInvoiceItems([...invoiceItems, newItem]);
    setItemForm({
      description: '',
      quantity: 1,
      unit_price: 0,
      vat_rate: 25,
    });
  };

  const removeItem = (itemId: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId));
  };

  const createInvoice = async () => {
    if (!formData.customer_id || invoiceItems.length === 0) {
      toast.error('Välj kund och lägg till minst en rad');
      return;
    }

    try {
      const invoiceNumber = await generateInvoiceNumber();
      const { subtotal, vatAmount, total } = calculateTotals(invoiceItems);

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: user?.id,
          invoice_number: invoiceNumber,
          customer_id: formData.customer_id,
          issue_date: formData.issue_date,
          due_date: formData.due_date,
          status: 'draft',
          subtotal,
          vat_amount: vatAmount,
          total_amount: total,
          notes: formData.notes,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Lägg till fakturarader
      const itemsWithInvoiceId = invoiceItems.map(item => ({
        ...item,
        invoice_id: invoice.id,
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsWithInvoiceId);

      if (itemsError) throw itemsError;

      toast.success('Faktura skapad!');
      setShowInvoiceForm(false);
      setInvoiceItems([]);
      setFormData({
        customer_id: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
      });
      fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Kunde inte skapa faktura');
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', invoiceId);

      if (error) throw error;
      toast.success('Status uppdaterad');
      fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Kunde inte uppdatera status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Utkast', color: 'bg-gray-100 text-gray-800' },
      sent: { label: 'Skickad', color: 'bg-blue-100 text-blue-800' },
      paid: { label: 'Betald', color: 'bg-green-100 text-green-800' },
      overdue: { label: 'Förfallen', color: 'bg-red-100 text-red-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-landing-primary">Fakturor</h1>
            <p className="text-landing-secondary mt-2">
              Hantera fakturor och kundbetalningar
            </p>
          </div>
          <Dialog open={showInvoiceForm} onOpenChange={setShowInvoiceForm}>
            <DialogTrigger asChild>
              <Button className="button-landing-primary">
                <Plus className="h-4 w-4 mr-2" />
                Ny faktura
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Skapa ny faktura</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Kund och datum */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="customer">Kund</Label>
                    <Select value={formData.customer_id} onValueChange={(value) => setFormData({...formData, customer_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj kund" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="issue_date">Fakturadatum</Label>
                    <Input
                      type="date"
                      value={formData.issue_date}
                      onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="due_date">Förfallodatum</Label>
                    <Input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    />
                  </div>
                </div>

                {/* Fakturarader */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Fakturarader</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <Input
                      placeholder="Beskrivning"
                      value={itemForm.description}
                      onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Antal"
                      value={itemForm.quantity}
                      onChange={(e) => setItemForm({...itemForm, quantity: parseInt(e.target.value) || 0})}
                    />
                    <Input
                      type="number"
                      placeholder="Pris"
                      value={itemForm.unit_price}
                      onChange={(e) => setItemForm({...itemForm, unit_price: parseFloat(e.target.value) || 0})}
                    />
                    <Select value={itemForm.vat_rate.toString()} onValueChange={(value) => setItemForm({...itemForm, vat_rate: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="6">6%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="25">25%</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addItem} className="button-landing-secondary">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Lista över rader */}
                  {invoiceItems.length > 0 && (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Beskrivning</TableHead>
                            <TableHead>Antal</TableHead>
                            <TableHead>Pris</TableHead>
                            <TableHead>Moms</TableHead>
                            <TableHead>Summa</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoiceItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                              <TableCell>{item.vat_rate}%</TableCell>
                              <TableCell>{formatCurrency(item.quantity * item.unit_price * (1 + item.vat_rate / 100))}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Summering */}
                  {invoiceItems.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Delsumma:</span>
                        <span>{formatCurrency(calculateTotals(invoiceItems).subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Moms:</span>
                        <span>{formatCurrency(calculateTotals(invoiceItems).vatAmount)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Totalt:</span>
                        <span>{formatCurrency(calculateTotals(invoiceItems).total)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Anteckningar */}
                <div>
                  <Label htmlFor="notes">Anteckningar</Label>
                  <Textarea
                    placeholder="Lägg till anteckningar..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                  />
                </div>

                {/* Knappar */}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowInvoiceForm(false)}>
                    Avbryt
                  </Button>
                  <Button onClick={createInvoice} className="button-landing-primary">
                    Skapa faktura
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-landing-secondary">Totalt antal</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-landing-primary">{totalInvoices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-landing-secondary">Betald</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-landing-secondary">Förfallen</CardTitle>
              <FileText className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-landing-secondary">Totalt belopp</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Fakturalista */}
        <Card>
          <CardHeader>
            <CardTitle>Fakturor</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fakturanummer</TableHead>
                  <TableHead>Kund</TableHead>
                  <TableHead>Fakturadatum</TableHead>
                  <TableHead>Förfallodatum</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Belopp</TableHead>
                  <TableHead>Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.customer_name}</TableCell>
                    <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                    <TableCell>{formatDate(invoice.due_date)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Select value={invoice.status} onValueChange={(value) => updateInvoiceStatus(invoice.id, value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Utkast</SelectItem>
                            <SelectItem value="sent">Skickad</SelectItem>
                            <SelectItem value="paid">Betald</SelectItem>
                            <SelectItem value="overdue">Förfallen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Invoices; 