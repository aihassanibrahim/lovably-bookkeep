import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, DollarSign, Calendar, FileText } from 'lucide-react';
import { useAuth } from "@/components/auth/AuthProvider";
import { useBizPal } from "@/context/BizPalContext";
import { toast } from "sonner";

const QuickActions = () => {
  const { user } = useAuth();
  const { addExpense, addIncomeTransaction } = useBizPal();
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [incomeData, setIncomeData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [expenseData, setExpenseData] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });



  const incomeCategories = [
    { value: 'sales', label: 'Försäljning' },
    { value: 'services', label: 'Tjänster' },
    { value: 'other', label: 'Övrigt' }
  ];

  const expenseCategories = [
    { value: 'materials', label: 'Material' },
    { value: 'supplies', label: 'Förnödenheter' },
    { value: 'utilities', label: 'El, vatten, värme' },
    { value: 'rent', label: 'Hyra' },
    { value: 'marketing', label: 'Marknadsföring' },
    { value: 'other', label: 'Övrigt' }
  ];



  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addIncomeTransaction({
        date: incomeData.date,
        description: incomeData.description,
        amount: incomeData.amount,
        category: incomeData.category
      });

      toast.success('Intäkt registrerad!');
      setIsIncomeModalOpen(false);
      setIncomeData({
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding income:', error);
      toast.error('Kunde inte registrera intäkt');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create expense using BizPalContext
      await addExpense({
        expense_number: `EXP-${Date.now()}`,
        supplier_name: 'Quick Expense',
        expense_date: expenseData.date,
        description: expenseData.description,
        kostnad_med_moms: parseFloat(expenseData.amount),
        category: expenseData.category,
        receipt_url: '',
        notes: 'Created via QuickActions'
      });

      toast.success('Utgift registrerad!');
      setIsExpenseModalOpen(false);
      setExpenseData({
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Kunde inte registrera utgift');
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      {/* Income Modal */}
      <Dialog open={isIncomeModalOpen} onOpenChange={setIsIncomeModalOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ny intäkt</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Registrera ny intäkt
            </DialogTitle>
            <DialogDescription>
              Lägg till en ny intäkt i ditt ekonomisystem.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleIncomeSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="income-amount">Belopp (SEK)</Label>
                <Input
                  id="income-amount"
                  type="number"
                  step="0.01"
                  value={incomeData.amount}
                  onChange={(e) => setIncomeData({...incomeData, amount: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="income-date">Datum</Label>
                <Input
                  id="income-date"
                  type="date"
                  value={incomeData.date}
                  onChange={(e) => setIncomeData({...incomeData, date: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="income-category">Kategori</Label>
              <Select 
                value={incomeData.category} 
                onValueChange={(value) => setIncomeData({...incomeData, category: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj kategori" />
                </SelectTrigger>
                <SelectContent>
                  {incomeCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="income-description">Beskrivning</Label>
              <Textarea
                id="income-description"
                value={incomeData.description}
                onChange={(e) => setIncomeData({...incomeData, description: e.target.value})}
                placeholder="Beskriv intäkten..."
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsIncomeModalOpen(false)}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Sparar...' : 'Registrera'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Expense Modal */}
      <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="gap-2">
            <Minus className="h-4 w-4" />
            <span className="hidden sm:inline">Ny utgift</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-red-600" />
              Registrera ny utgift
            </DialogTitle>
            <DialogDescription>
              Lägg till en ny utgift i ditt ekonomisystem.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expense-amount">Belopp (SEK)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expense-date">Datum</Label>
                <Input
                  id="expense-date"
                  type="date"
                  value={expenseData.date}
                  onChange={(e) => setExpenseData({...expenseData, date: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="expense-category">Kategori</Label>
              <Select 
                value={expenseData.category} 
                onValueChange={(value) => setExpenseData({...expenseData, category: value})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Välj kategori" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expense-description">Beskrivning</Label>
              <Textarea
                id="expense-description"
                value={expenseData.description}
                onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                placeholder="Beskriv utgiften..."
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsExpenseModalOpen(false)}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Sparar...' : 'Registrera'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


    </>
  );
};

export default QuickActions; 