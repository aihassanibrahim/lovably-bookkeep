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
  Receipt,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBizPal } from "@/context/BizPalContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import QuickActions from "@/components/QuickActions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSubscription } from "@/hooks/useSubscription";
import { UsageTracker } from "@/components/PlanLimitBanner";
import { redirectToCheckout } from "@/lib/stripe-client";

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
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    customer_name: '',
    product_name: '',
    price: '',
    order_date: new Date().toISOString().split('T')[0],
    notes: ''
  });
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
  const { orders, products, customers, suppliers, expenses, stats, loading, addOrder } = useBizPal();
  const { subscription, usage, isFreePlan, isProPlan, getCurrentPlan } = useSubscription();
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

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${randomNum}`;
  };

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        title: 'Logga in först',
        description: 'Du måste logga in för att uppgradera din plan.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await redirectToCheckout('pro', user.id);
      toast({
        title: 'Omdirigerar till betalning',
        description: 'Du kommer att skickas till Stripe för att slutföra din prenumeration.',
      });
    } catch (error) {
      toast({
        title: 'Något gick fel',
        description: 'Kunde inte starta uppgraderingen. Försök igen.',
        variant: 'destructive',
      });
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setOrderLoading(true);
    try {
      await addOrder({
        order_number: generateOrderNumber(),
        customer_name: orderData.customer_name,
        customer_social_media: '',
        customer_phone: '',
        customer_address: '',
        product_name: orderData.product_name,
        product_details: '',
        product_customizations: '',
        price: parseFloat(orderData.price) || 0,
        status: 'Beställd',
        order_date: orderData.order_date,
        estimated_completion: '',
        notes: orderData.notes
      });

      toast.success('Order skapad!');
      setIsOrderModalOpen(false);
      setOrderData({
        customer_name: '',
        product_name: '',
        price: '',
        order_date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      fetchFinancialData();
      calculateDashboardStats();
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Kunde inte skapa order');
    } finally {
      setOrderLoading(false);
    }
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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Dashboard</h1>
            {localStorage.getItem('bizpal-demo-mode') === 'true' && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                Demo-läge
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-base lg:text-lg">
            Översikt av din verksamhet - {new Date().toLocaleDateString('sv-SE')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:gap-3">
          <QuickActions />
        </div>
      </div>

      {/* Plan Information and Usage */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UsageTracker />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Din plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Nuvarande plan:</span>
              <Badge variant={isProPlan() ? "default" : "secondary"}>
                {isProPlan() ? "Pro" : "Gratis"}
              </Badge>
            </div>
            {isFreePlan() && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Uppgradera till Pro</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Få tillgång till alla funktioner för endast 99kr/månad.
                </p>
                <Button 
                  onClick={handleUpgrade}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Uppgradera nu
                </Button>
              </div>
            )}
            {isProPlan() && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Pro-funktioner aktiva</h4>
                <p className="text-sm text-green-700">
                  Du har tillgång till alla funktioner och obegränsad användning.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsOrderModalOpen(true)}>
          <CardContent className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-pink-100 dark:bg-pink-900/20 rounded-full mb-4">
              <Plus className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Ny Order</h3>
            <p className="text-sm text-muted-foreground">Lägg till beställning</p>
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
            Dina senaste beställningar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Inga ordrar än</p>
              <Button 
                onClick={() => setIsOrderModalOpen(true)}
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

      {/* Order Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-600" />
              Skapa ny order
            </DialogTitle>
            <DialogDescription>
              Lägg till en ny order från sociala medier.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div>
              <Label htmlFor="order-customer">Kundnamn</Label>
              <Input
                id="order-customer"
                value={orderData.customer_name}
                onChange={(e) => setOrderData({...orderData, customer_name: e.target.value})}
                placeholder="Kundens namn"
                required
              />
            </div>
            <div>
              <Label htmlFor="order-product">Produkt</Label>
              <Input
                id="order-product"
                value={orderData.product_name}
                onChange={(e) => setOrderData({...orderData, product_name: e.target.value})}
                placeholder="Produktnamn"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order-price">Pris (SEK)</Label>
                <Input
                  id="order-price"
                  type="number"
                  step="0.01"
                  value={orderData.price}
                  onChange={(e) => setOrderData({...orderData, price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="order-date">Orderdatum</Label>
                <Input
                  id="order-date"
                  type="date"
                  value={orderData.order_date}
                  onChange={(e) => setOrderData({...orderData, order_date: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="order-notes">Anteckningar</Label>
              <Textarea
                id="order-notes"
                value={orderData.notes}
                onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                placeholder="Lägg till anteckningar..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOrderModalOpen(false)}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={orderLoading}>
                {orderLoading ? 'Sparar...' : 'Skapa order'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}