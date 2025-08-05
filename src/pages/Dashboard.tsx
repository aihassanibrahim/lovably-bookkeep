import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Settings, 
  Package, 
  Clock, 
  Heart, 
  Calendar,
  Users,
  Building2,
  FileText,
  BarChart3,
  ShoppingBag,
  Truck,
  Receipt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { OrderForm } from "@/components/orders/OrderForm";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBizPal } from "@/context/BizPalContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  profitBeforeTax: number;
  profitAfterTax: number;
  taxRate: number;
}

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  lowStockItems: number;
  pendingProductionTasks: number;
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
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    lowStockItems: 0,
    pendingProductionTasks: 0
  });
  const { user } = useAuth();
  const { orders, products, customers, suppliers, expenses, stats, loading } = useBizPal();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchFinancialData();
      calculateDashboardStats();
    }
  }, [user, orders, products, customers, suppliers, expenses, stats]);

  const fetchFinancialData = async () => {
    try {
      // Fetch user settings
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      const taxRate = settings?.skatt_sats || 30;

      // Fetch total income (sum of price from orders)
      const { data: incomeData } = await supabase
        .from('orders')
        .select('price')
        .eq('user_id', user?.id)
        .eq('status', 'Skickad');

      const totalIncome = incomeData?.reduce((sum, order) => sum + (order.price || 0), 0) || 0;

      // Calculate total expenses from context
      const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.kostnad_med_moms || 0), 0);

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
    }
  };

  const calculateDashboardStats = () => {
    setDashboardStats({
      totalOrders: stats.orders.total,
      activeOrders: stats.orders.active,
      completedOrders: stats.orders.completed,
      totalRevenue: stats.orders.revenue,
      totalProducts: stats.products.total,
      totalCustomers: customers.length,
      totalSuppliers: suppliers.length,
      lowStockItems: stats.inventory.lowStock,
      pendingProductionTasks: stats.production.active
    });
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

  if (loading) {
    return (
      <div className="space-y-6 p-4 lg:space-y-8 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-base lg:text-lg">Laddar data...</p>
          </div>
        </div>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:space-y-8 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-base lg:text-lg">
            Översikt av din verksamhet - {new Date().toLocaleDateString('sv-SE')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:gap-3">
          <Button 
            onClick={() => setShowOrderForm(true)}
            className="px-4 py-2 lg:px-6 lg:py-2.5 text-sm lg:text-base rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ny Order</span>
            <span className="sm:hidden">Order</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowExpenseForm(true)}
            className="px-4 py-2 lg:px-6 lg:py-2.5 text-sm lg:text-base rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Ny Utgift</span>
            <span className="sm:hidden">Utgift</span>
          </Button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowOrderForm(true)}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-full mb-4">
              <Plus className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Ny Order</h3>
            <p className="text-sm text-muted-foreground">Lägg till beställning från sociala medier</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/production')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Produktionsstatus</h3>
            <p className="text-sm text-muted-foreground">Se vad som behöver göras</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/inventory')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Hantera lager</h3>
            <p className="text-sm text-muted-foreground">Kontrollera material & komponenter</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/reports')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Rapporter</h3>
            <p className="text-sm text-muted-foreground">Statistik & analys</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva ordrar</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeOrders}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.totalOrders} totalt
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Månadens intäkter</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.completedOrders} slutförda ordrar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produktion</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingProductionTasks}</div>
            <p className="text-xs text-muted-foreground">
              Väntar på slutförande
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lager</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Låga lagernivåer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Latest Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Dina senaste beställningar från sociala medier
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Inga ordrar än</p>
              <Button 
                onClick={() => setShowOrderForm(true)}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Skapa första ordern
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{order.order_number}</h4>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(order.price || 0)}</div>
                    <Badge variant={order.status === 'Skickad' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => navigate('/orders')}>
                    Se alla
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala Intäkter</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
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
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
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
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
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
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
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

      {/* Modals */}
      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Skapa ny order</DialogTitle>
          </DialogHeader>
          <OrderForm 
            onSuccess={() => {
              setShowOrderForm(false);
              fetchFinancialData();
              calculateDashboardStats();
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