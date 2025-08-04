import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Layout } from "@/components/Layout";

interface Expense {
  id: string;
  datum: string;
  kostnad_utan_moms: number;
  moms_sats: number;
  kostnad_med_moms: number;
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
        .order('datum', { ascending: false });

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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.kostnad_med_moms, 0);
  const totalExpenseCount = expenses.length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Utgifter & Kostnader</h1>
            <p className="text-muted-foreground">
              Hantera dina utgifter och kostnader
            </p>
          </div>
          <Button onClick={() => setShowExpenseForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ny utgift
          </Button>
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
            <CardTitle>Alla Utgifter</CardTitle>
            <CardDescription>
              En lista över alla dina registrerade kostnader
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Laddar utgifter...</p>
              </div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-8">
                <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Inga utgifter ännu</h3>
                <p className="text-muted-foreground mb-4">
                  Börja med att registrera din första kostnad
                </p>
                <Button onClick={() => setShowExpenseForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrera första utgift
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-red-100 rounded-full">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {formatCurrency(expense.kostnad_med_moms)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(expense.kostnad_utan_moms)} + {expense.moms_sats}% moms
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatDate(expense.datum)}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
    </Layout>
  );
} 