import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { OrderForm } from "@/components/orders/OrderForm";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  profitBeforeTax: number;
  profitAfterTax: number;
  taxRate: number;
}

export default function Dashboard() {
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpenses: 0,
    profitBeforeTax: 0,
    profitAfterTax: 0,
    taxRate: 30
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchFinancialData();
    }
  }, [user]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      
      // Fetch user settings
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      const taxRate = settings?.skatt_sats || 30;

      // Fetch total income (sum of summa_med_moms from orders)
      const { data: incomeData } = await supabase
        .from('orders')
        .select('summa_med_moms')
        .eq('user_id', user?.id);

      const totalIncome = incomeData?.reduce((sum, order) => sum + (order.summa_med_moms || 0), 0) || 0;

      // Fetch total expenses (sum of kostnad_med_moms from expenses)
      const { data: expenseData } = await supabase
        .from('expenses')
        .select('kostnad_med_moms')
        .eq('user_id', user?.id);

      const totalExpenses = expenseData?.reduce((sum, expense) => sum + (expense.kostnad_med_moms || 0), 0) || 0;

      const profitBeforeTax = totalIncome - totalExpenses;
      const profitAfterTax = profitBeforeTax * (1 - taxRate / 100);

      setFinancialData({
        totalIncome,
        totalExpenses,
        profitBeforeTax,
        profitAfterTax,
        taxRate
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Översikt</h1>
              <p className="text-muted-foreground">Laddar ekonomisk data...</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Ekonomisk Översikt</h1>
            <p className="text-muted-foreground">
              Välkommen tillbaka! Här är din ekonomiska situation.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowOrderForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ny intäkt
            </Button>
            <Button variant="outline" onClick={() => setShowExpenseForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ny utgift
            </Button>
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Inställningar
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totala Intäkter</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(financialData.totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                Summa med moms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totala Utgifter</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(financialData.totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Kostnader med moms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vinst före skatt</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${financialData.profitBeforeTax >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(financialData.profitBeforeTax)}
              </div>
              <p className="text-xs text-muted-foreground">
                Intäkter - Utgifter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vinst efter skatt</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${financialData.profitAfterTax >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                {formatCurrency(financialData.profitAfterTax)}
              </div>
              <p className="text-xs text-muted-foreground">
                Skattesats: {financialData.taxRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Snabbåtgärder</CardTitle>
              <CardDescription>
                Kom igång snabbt med dessa funktioner
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <button 
                onClick={() => setShowOrderForm(true)}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors text-left"
              >
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Registrera intäkt</p>
                  <p className="text-sm text-muted-foreground">Lägg till en ny försäljning</p>
                </div>
              </button>
              <button 
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors text-left"
              >
                <TrendingDown className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Registrera utgift</p>
                  <p className="text-sm text-muted-foreground">Lägg till en ny kostnad</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/orders')}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors text-left"
              >
                <DollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Visa alla intäkter</p>
                  <p className="text-sm text-muted-foreground">Se alla dina försäljningar</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/expenses')}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors text-left"
              >
                <TrendingDown className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Visa alla utgifter</p>
                  <p className="text-sm text-muted-foreground">Se alla dina kostnader</p>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inställningar</CardTitle>
              <CardDescription>
                Hantera dina bokföringsinställningar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Momsats:</span>
                  <span className="font-medium">{financialData.taxRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Skattesats:</span>
                  <span className="font-medium">{financialData.taxRate}%</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Ändra inställningar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrera ny intäkt/order</DialogTitle>
            </DialogHeader>
            <OrderForm 
              onSuccess={() => {
                setShowOrderForm(false);
                fetchFinancialData();
              }}
              onCancel={() => setShowOrderForm(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrera ny utgift</DialogTitle>
            </DialogHeader>
            <ExpenseForm 
              onSuccess={() => {
                setShowExpenseForm(false);
                fetchFinancialData();
              }}
              onCancel={() => setShowExpenseForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}