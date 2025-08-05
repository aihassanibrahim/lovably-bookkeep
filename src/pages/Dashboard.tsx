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
      <div className="space-y-6 p-4 lg:space-y-8 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-landing-primary">Översikt</h1>
            <p className="text-landing-secondary text-base lg:text-lg">Laddar ekonomisk data...</p>
          </div>
        </div>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="card-modern">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="h-3 md:h-4 w-16 md:w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-6 w-6 md:h-8 md:w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 md:h-10 w-16 md:w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-3 md:h-4 w-24 md:w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

    return (
    <div className="space-y-6 p-4 lg:space-y-8 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-landing-primary">Översikt</h1>
          <p className="text-landing-secondary text-base lg:text-lg">
            Välkommen tillbaka! Här är din ekonomiska situation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:gap-3">
          <Button 
            onClick={() => setShowOrderForm(true)}
            className="button-landing-primary px-4 py-2 lg:px-6 lg:py-2.5 text-sm lg:text-base rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ny intäkt</span>
            <span className="sm:hidden">Intäkt</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowExpenseForm(true)}
            className="button-landing-secondary px-4 py-2 lg:px-6 lg:py-2.5 text-sm lg:text-base rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ny utgift</span>
            <span className="sm:hidden">Utgift</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/settings')}
            className="button-landing-secondary px-4 py-2 lg:px-6 lg:py-2.5 text-sm lg:text-base rounded-lg"
          >
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Inställningar</span>
            <span className="sm:hidden">Inställ</span>
          </Button>
        </div>
      </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-landing-secondary">Totala Intäkter</CardTitle>
              <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">
                {formatCurrency(financialData.totalIncome)}
              </div>
              <p className="text-xs md:text-sm text-landing-secondary">
                Summa med moms
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-landing-secondary">Totala Utgifter</CardTitle>
              <div className="p-1.5 md:p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-red-600 mb-1">
                {formatCurrency(financialData.totalExpenses)}
              </div>
              <p className="text-xs md:text-sm text-landing-secondary">
                Kostnader med moms
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-landing-secondary">Vinst före skatt</CardTitle>
              <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl md:text-3xl font-bold mb-1 ${financialData.profitBeforeTax >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(financialData.profitBeforeTax)}
              </div>
              <p className="text-xs md:text-sm text-landing-secondary">
                Intäkter - Utgifter
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs md:text-sm font-medium text-landing-secondary">Vinst efter skatt</CardTitle>
              <div className="p-1.5 md:p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl md:text-3xl font-bold mb-1 ${financialData.profitAfterTax >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                {formatCurrency(financialData.profitAfterTax)}
              </div>
              <p className="text-xs md:text-sm text-landing-secondary">
                Skattesats: {financialData.taxRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          <Card className="card-modern">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-xl">Snabbåtgärder</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Kom igång snabbt med dessa funktioner
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:gap-4">
              <button 
                onClick={() => setShowOrderForm(true)}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-left border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-base md:text-lg">Registrera intäkt</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Lägg till en ny försäljning</p>
                </div>
              </button>
              <button 
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-left border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 md:p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <TrendingDown className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-base md:text-lg">Registrera utgift</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Lägg till en ny kostnad</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/orders')}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-left border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-base md:text-lg">Visa alla intäkter</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Se alla dina försäljningar</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/expenses')}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-left border border-gray-100 dark:border-gray-700"
              >
                <div className="p-2 md:p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <TrendingDown className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-base md:text-lg">Visa alla utgifter</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Se alla dina kostnader</p>
                </div>
              </button>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-xl">Inställningar</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Hantera dina bokföringsinställningar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-center p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Momsats:</span>
                  <span className="font-semibold text-base md:text-lg">{financialData.taxRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Skattesats:</span>
                  <span className="font-semibold text-base md:text-lg">{financialData.taxRate}%</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full button-modern py-2.5 md:py-3 text-sm md:text-base"
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
  );
}