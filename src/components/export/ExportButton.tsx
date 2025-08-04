import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from '@/components/ui/sonner';

export const ExportButton = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const exportToCSV = async (type: 'orders' | 'expenses' | 'all') => {
    if (!user) return;

    setLoading(true);
    try {
      let data: any[] = [];
      let filename = '';

      if (type === 'orders' || type === 'all') {
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            customers(company_name),
            vat_rates(name, rate)
          `)
          .eq('user_id', user.id)
          .order('order_date', { ascending: false });

        if (ordersError) throw ordersError;

        const orderData = orders?.map(order => ({
          Typ: 'Intäkt',
          Nummer: order.order_number,
          Datum: order.order_date,
          Beskrivning: order.description,
          Kund: order.customers?.company_name || '',
          'Belopp exkl moms': order.amount_excluding_vat,
          Momssats: order.vat_rates?.name || '',
          Momsbelopp: order.vat_amount,
          'Totalt belopp': order.total_amount,
          Status: order.status,
        })) || [];

        data = [...data, ...orderData];
      }

      if (type === 'expenses' || type === 'all') {
        const { data: expenses, error: expensesError } = await supabase
          .from('expenses')
          .select(`
            *,
            suppliers(company_name),
            vat_rates(name, rate)
          `)
          .eq('user_id', user.id)
          .order('expense_date', { ascending: false });

        if (expensesError) throw expensesError;

        const expenseData = expenses?.map(expense => ({
          Typ: 'Utgift',
          Nummer: expense.expense_number,
          Datum: expense.expense_date,
          Beskrivning: expense.description,
          'Leverantör/Kund': expense.suppliers?.company_name || '',
          'Belopp exkl moms': expense.amount_excluding_vat,
          Momssats: expense.vat_rates?.name || '',
          Momsbelopp: expense.vat_amount,
          'Totalt belopp': expense.total_amount,
          Kategori: expense.category || '',
        })) || [];

        data = [...data, ...expenseData];
      }

      // Convert to CSV
      if (data.length === 0) {
        toast.error('Ingen data att exportera');
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      
      filename = type === 'all' ? 'bokforing_alla_transaktioner' : 
                type === 'orders' ? 'bokforing_intakter' : 'bokforing_utgifter';
      
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Data exporterad!');
    } catch (error: any) {
      toast.error('Kunde inte exportera data', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    toast.info('PDF-export kommer snart!');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={loading}>
          <Download className="h-4 w-4 mr-2" />
          {loading ? 'Exporterar...' : 'Exportera'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => exportToCSV('all')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Alla transaktioner (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCSV('orders')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Endast intäkter (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportToCSV('expenses')}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Endast utgifter (CSV)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Rapport (PDF)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};