import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  matched: boolean;
  matched_transaction_id?: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  transaction_date: string;
  category: string;
  type: string;
}

const BankImport: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [existingTransactions, setExistingTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [selectedBankTransaction, setSelectedBankTransaction] = useState<BankTransaction | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Endast CSV-filer stöds');
      return;
    }

    try {
      setLoading(true);
      const text = await file.text();
      const lines = text.split('\n');
      
      // Skip header row and parse CSV
      const transactions: BankTransaction[] = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
          const [date, description, amount] = columns;
          
          const numAmount = parseFloat(amount) || 0;
          
          return {
            id: `bank_${index}`,
            date: date || new Date().toISOString().split('T')[0],
            description: description || 'Okänd transaktion',
            amount: Math.abs(numAmount),
            type: numAmount > 0 ? 'income' : 'expense',
            category: 'Ej kategoriserad',
            matched: false,
          };
        });

      setBankTransactions(transactions);
      await fetchExistingTransactions();
      toast.success(`${transactions.length} transaktioner importerade`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Kunde inte läsa CSV-filen');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      // Map the data to Transaction type, filling missing fields with defaults
      setExistingTransactions(
        (data || []).map((item: any) => ({
          id: item.id,
          description: item.description,
          amount: item.amount ?? item.total_amount ?? 0,
          category: item.category ?? 'Ej kategoriserad',
          type: item.type ?? (item.amount ?? item.total_amount ?? 0) > 0 ? 'income' : 'expense',
          transaction_date: item.transaction_date,
          reference_number: item.reference_number,
          created_at: item.created_at,
          updated_at: item.updated_at,
          user_id: item.user_id,
        }))
      );
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Kunde inte hämta befintliga transaktioner');
    }
  };

  const autoMatchTransactions = () => {
    const updatedTransactions = bankTransactions.map(bankTrans => {
      // Find matching transaction by amount and date
      const match = existingTransactions.find(existing => 
        Math.abs(existing.amount - bankTrans.amount) < 1 && // Within 1 SEK
        existing.transaction_date === bankTrans.date
      );

      if (match) {
        return {
          ...bankTrans,
          matched: true,
          matched_transaction_id: match.id,
          category: match.category,
        };
      }

      return bankTrans;
    });

    setBankTransactions(updatedTransactions);
    const matchedCount = updatedTransactions.filter(t => t.matched).length;
    toast.success(`${matchedCount} transaktioner automatiskt matchade`);
  };

  const manualMatch = (bankTransaction: BankTransaction, transactionId: string) => {
    const transaction = existingTransactions.find(t => t.id === transactionId);
    if (!transaction) return;

    const updatedTransactions = bankTransactions.map(t => 
      t.id === bankTransaction.id 
        ? { ...t, matched: true, matched_transaction_id: transactionId, category: transaction.category }
        : t
    );

    setBankTransactions(updatedTransactions);
    setShowMatchDialog(false);
    toast.success('Transaktion matchad');
  };

  const createTransaction = async (bankTransaction: BankTransaction) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          description: bankTransaction.description,
          amount: bankTransaction.amount,
          transaction_date: bankTransaction.date,
          category: bankTransaction.category,
          type: bankTransaction.type,
          transaction_type: 'bank_import',
        });

      if (error) throw error;

      // Mark as matched
      const updatedTransactions = bankTransactions.map(t => 
        t.id === bankTransaction.id 
          ? { ...t, matched: true }
          : t
      );

      setBankTransactions(updatedTransactions);
      await fetchExistingTransactions();
      toast.success('Transaktion skapad');
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Kunde inte skapa transaktion');
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

  const unmatchedCount = bankTransactions.filter(t => !t.matched).length;
  const matchedCount = bankTransactions.filter(t => t.matched).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-landing-primary">Bankmatchning</h2>
          <p className="text-landing-secondary mt-2">
            Importera banktransaktioner och matcha med befintliga transaktioner
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Importera CSV-fil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="max-w-sm"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="button-landing-primary"
              disabled={loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Välj fil
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Stöds format: CSV med kolumner för datum, beskrivning och belopp</p>
            <p>Exempel: 2024-01-15, "ICA Maxi", -250.00</p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {bankTransactions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-landing-secondary">Totalt importerade</CardTitle>
              <FileText className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-landing-primary">{bankTransactions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-landing-secondary">Matchade</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{matchedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-landing-secondary">Ej matchade</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{unmatchedCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions */}
      {bankTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Åtgärder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button 
                onClick={autoMatchTransactions}
                className="button-landing-secondary"
                disabled={unmatchedCount === 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Automatisk matchning
              </Button>
              <Button 
                onClick={() => {
                  const unmatched = bankTransactions.filter(t => !t.matched);
                  unmatched.forEach(createTransaction);
                }}
                className="button-landing-primary"
                disabled={unmatchedCount === 0}
              >
                <FileText className="h-4 w-4 mr-2" />
                Skapa alla ej matchade
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions List */}
      {bankTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Banktransaktioner</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Beskrivning</TableHead>
                  <TableHead>Belopp</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                        {transaction.type === 'income' ? 'Intäkt' : 'Utgift'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.matched ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Matchad
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Ej matchad
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {!transaction.matched && (
                          <>
                            <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedBankTransaction(transaction)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Matcha transaktion</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>Banktransaktion</Label>
                                    <p className="text-sm text-gray-600">
                                      {transaction.description} - {formatCurrency(transaction.amount)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Välj befintlig transaktion</Label>
                                    <Select onValueChange={(value) => manualMatch(transaction, value)}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Välj transaktion" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {existingTransactions.map((existing) => (
                                          <SelectItem key={existing.id} value={existing.id}>
                                            {existing.description} - {formatCurrency(existing.amount)}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => createTransaction(transaction)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankImport; 