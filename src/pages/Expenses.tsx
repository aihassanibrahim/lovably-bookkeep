import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { testExpensesTable, testQuickActions } from "@/lib/testExpenses";
import { testIncomeExpenseFunctionality, checkDatabaseSetup } from "@/lib/testIncomeExpense";
import { simpleDatabaseTest } from "@/lib/simpleDatabaseTest";
import { testAuthentication } from "@/lib/testAuthentication";

// Debug import
console.log('🔍 simpleDatabaseTest imported:', typeof simpleDatabaseTest);
console.log('🔍 testAuthentication imported:', typeof testAuthentication);
interface Expense {
  id: string;
  expense_number?: string;
  supplier_name?: string;
  expense_date: string;
  description: string;
  kostnad_med_moms: number;
  amount?: number; // fallback for existing data
  category?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user?.id)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Kunde inte hämta utgifter');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.kostnad_med_moms || expense.amount || 0), 0);
  const totalExpenseCount = expenses.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Utgifter</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Hantera dina utgifter och kostnader</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => setShowExpenseForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ny utgift
            </Button>
            <Button 
              variant="outline" 
              onClick={() => testExpensesTable()}
              title="Test expenses table functionality"
            >
              Test Expenses
            </Button>
            <Button 
              variant="outline" 
              onClick={() => testQuickActions()}
              title="Test QuickActions functionality"
            >
              Test QuickActions
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('🧪 Test All button clicked!');
                testIncomeExpenseFunctionality().catch(error => {
                  console.error('❌ Test All failed:', error);
                });
              }}
              title="Test complete income/expense functionality"
            >
              Test All
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('🔍 Check DB button clicked!');
                checkDatabaseSetup().catch(error => {
                  console.error('❌ Check DB failed:', error);
                });
              }}
              title="Check database setup"
            >
              Check DB
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('🧪 Simple DB Test button clicked!');
                alert('Button works! Check console for test results.');
                simpleDatabaseTest().catch(error => {
                  console.error('❌ Simple DB Test failed:', error);
                  alert('Test failed! Check console for details.');
                });
              }}
              title="Simple database test"
            >
              Simple DB Test
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('✅ Basic test button clicked!');
                alert('Basic test button works!');
              }}
              title="Basic functionality test"
            >
              Basic Test
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('🔐 Auth Test button clicked!');
                try {
                  testAuthentication().catch(error => {
                    console.error('❌ Auth Test failed:', error);
                    alert('Auth Test failed! Check console for details.');
                  });
                } catch (error) {
                  console.error('❌ Auth Test function not found:', error);
                  alert('Auth Test function not found! Check console for details.');
                }
              }}
              title="Test authentication and user access"
            >
              Auth Test
            </Button>
            <Button 
              variant="outline" 
              onClick={async () => {
                console.log('🔐 Inline Auth Test clicked!');
                try {
                  const { data: { user }, error } = await supabase.auth.getUser();
                  if (error) {
                    console.error('❌ Auth error:', error);
                    alert('Authentication error! Check console.');
                  } else if (!user) {
                    console.error('❌ No user found');
                    alert('No authenticated user found!');
                  } else {
                    console.log('✅ User authenticated:', user.email);
                    alert(`User authenticated: ${user.email}`);
                  }
                } catch (error) {
                  console.error('❌ Inline auth test failed:', error);
                  alert('Inline auth test failed! Check console.');
                }
              }}
              title="Simple authentication test"
            >
              Inline Auth
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totala Utgifter</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                Summa med moms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Antal Utgifter</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {totalExpenseCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Registrerade kostnader
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Genomsnittlig Utgift</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {totalExpenseCount > 0 ? formatCurrency(totalExpenses / totalExpenseCount) : formatCurrency(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per kostnad
              </p>
            </CardContent>
          </Card>
        </div>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Alla Utgifter</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            En lista över alla dina registrerade kostnader
          </CardDescription>
        </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Laddar utgifter...</p>
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-12">
                <TrendingDown className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Inga utgifter ännu</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Börja med att registrera din första kostnad för att hålla koll på dina utgifter
                </p>
                <Button onClick={() => setShowExpenseForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrera första utgift
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(expense.kostnad_med_moms || expense.amount || 0)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {expense.description || 'Ingen beskrivning'}
                        </p>
                        {expense.supplier_name && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Leverantör: {expense.supplier_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(expense.expense_date)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(expense.created_at).toLocaleDateString('sv-SE')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrera ny utgift</DialogTitle>
            </DialogHeader>
            <ExpenseForm 
              onSuccess={() => {
                setShowExpenseForm(false);
                fetchExpenses();
                toast.success('Utgift registrerad!');
              }}
              onCancel={() => setShowExpenseForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
  );
} 