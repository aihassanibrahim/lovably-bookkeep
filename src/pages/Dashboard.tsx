import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingBag,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBizPal } from "@/context/BizPalContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { SubscriptionStatus } from "@/components/SubscriptionStatus";

export default function Dashboard() {
  const { user } = useAuth();
  const { orders, products, customers, stats, loading } = useBizPal();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  // Get recent orders for display
  const recentOrders = orders
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Get orders by status
  const ordersByStatus = {
    'Beställd': orders.filter(o => o.status === 'Beställd').length,
    'I produktion': orders.filter(o => o.status === 'I produktion').length,
    'Klar': orders.filter(o => o.status === 'Klar').length,
    'Levererad': orders.filter(o => o.status === 'Levererad').length
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6 lg:space-y-8 lg:p-8 bg-[hsl(var(--light-gray))] min-h-screen">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-[hsl(var(--dark-navy))]">Dashboard</h1>
            <p className="text-gray-600 text-base lg:text-lg">Laddar data...</p>
          </div>
        </div>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="finpay-card animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:space-y-8 lg:p-8 bg-[hsl(var(--light-gray))] min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-finpay-navy">Dashboard</h1>
          <p className="text-gray-600 text-base lg:text-lg">
            Översikt av din verksamhet - {new Date().toLocaleDateString('sv-SE')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:gap-3">
          <Button 
            onClick={() => navigate('/orders')}
            className="bg-finpay-teal hover:bg-finpay-teal-dark text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ny Order
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Ordrar</CardTitle>
            <Package className="h-5 w-5 text-finpay-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-finpay-navy">{stats.orders.active}</div>
            <p className="text-xs text-gray-600">
              {stats.orders.total} totalt
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Månadens Intäkter</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">
              {formatCurrency(stats.orders.revenue)}
            </div>
            <p className="text-xs text-gray-600">
              {stats.orders.completed} levererade
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produkter</CardTitle>
            <ShoppingBag className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-finpay-navy">{products.length}</div>
            <p className="text-xs text-gray-600">
              I katalogen
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kunder</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-finpay-navy">{customers.length}</div>
            <p className="text-xs text-gray-600">
              Registrerade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Overview */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="finpay-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beställda</CardTitle>
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{ordersByStatus['Beställd']}</div>
          </CardContent>
        </Card>
        
        <Card className="finpay-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">I Produktion</CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{ordersByStatus['I produktion']}</div>
          </CardContent>
        </Card>
        
        <Card className="finpay-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klara</CardTitle>
            <CheckCircle className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{ordersByStatus['Klar']}</div>
          </CardContent>
        </Card>
        
        <Card className="finpay-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Levererade</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{ordersByStatus['Levererad']}</div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Status */}
      <SubscriptionStatus />

      {/* Recent Orders */}
      <Card className="finpay-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Senaste Ordrar
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/orders')}
              className="finpay-button-secondary"
            >
              Se alla
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Inga ordrar än</p>
              <Button 
                onClick={() => navigate('/orders')}
                className="finpay-button-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Skapa första ordern
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-[hsl(var(--teal-primary))]/10 rounded-xl">
                      <Package className="h-5 w-5 text-[hsl(var(--teal-primary))]" />
                    </div>
                    <div>
                      <h4 className="font-medium">{order.order_number}</h4>
                      <p className="text-sm text-gray-600">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.product_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(order.price || 0)}</div>
                    <Badge 
                      className={
                        order.status === 'Levererad' ? 'bg-green-100 text-green-800' :
                        order.status === 'Klar' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'I produktion' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          className="finpay-card hover:shadow-lg transition-all duration-300 cursor-pointer border-[hsl(var(--teal-primary))]/20 hover:border-[hsl(var(--teal-primary))]/40" 
          onClick={() => navigate('/orders')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-[hsl(var(--teal-primary))]/10 rounded-xl mb-4">
              <Plus className="h-6 w-6 text-[hsl(var(--teal-primary))]" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Ny Order</h3>
            <p className="text-sm text-gray-600">Lägg till ny beställning</p>
          </CardContent>
        </Card>

        <Card 
          className="finpay-card hover:shadow-lg transition-all duration-300 cursor-pointer border-green-200 hover:border-green-400" 
          onClick={() => navigate('/products')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Hantera Produkter</h3>
            <p className="text-sm text-gray-600">Uppdatera produktkatalog</p>
          </CardContent>
        </Card>

        <Card 
          className="finpay-card hover:shadow-lg transition-all duration-300 cursor-pointer border-purple-200 hover:border-purple-400" 
          onClick={() => navigate('/customers')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Kundregister</h3>
            <p className="text-sm text-gray-600">Hantera kunder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}