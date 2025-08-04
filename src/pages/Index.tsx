import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useBizPal } from "@/context/BizPalContext";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react';

const Index = () => {
  // Get real data from context
  const { stats, orders, productionTasks, inventoryItems } = useBizPal();

  const quickActions = [
    {
      title: "Ny Order",
      description: "Lägg till beställning från sociala medier",
      icon: <Plus className="h-5 w-5" />,
      color: "bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600",
      link: "/orders"
    },
    {
      title: "Produktionsstatus",
      description: "Se vad som behöver göras",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600",
      link: "/production"
    },
    {
      title: "Ny Produkt",
      description: "Lägg till produkt i katalogen",
      icon: <Package className="h-5 w-5" />,
      color: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600",
      link: "/products"
    },
    {
      title: "Hantera Lager",
      description: "Uppdatera material och komponenter",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600",
      link: "/inventory"
    }
  ];

  // Get recent orders (last 3)
  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 3);

  // Get urgent production tasks
  const urgentProductionTasks = productionTasks
    .filter(task => {
      if (task.status === "Klar" || !task.dueDate) return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilDue <= 3;
    })
    .slice(0, 3);

  // Get low stock items
  const lowStockItems = inventoryItems
    .filter(item => parseFloat(item.currentStock || 0) <= parseFloat(item.minStock || 0))
    .slice(0, 3);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Översikt av din verksamhet - {new Date().toLocaleDateString('sv-SE')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${action.color} text-white`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{action.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Aktiva ordrar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.orders.active}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {stats.orders.total} totalt
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Månadens intäkter</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.orders.revenue.toLocaleString()} SEK</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {stats.orders.completed} slutförda ordrar
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Produktionsuppgifter</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.production.active}</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {stats.production.urgent > 0 ? (
                <span className="text-red-600 dark:text-red-400">{stats.production.urgent} brådskande</span>
              ) : (
                "Allt under kontroll"
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Lagervärde</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.inventory.totalValue.toLocaleString()} SEK</div>
            <p className="text-xs text-muted-foreground dark:text-gray-400">
              {stats.inventory.lowStock > 0 ? (
                <span className="text-amber-600 dark:text-amber-400">{stats.inventory.lowStock} låga lager</span>
              ) : (
                `${stats.inventory.totalItems} material`
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-gray-100">Senaste ordrar</CardTitle>
              <Link to="/orders">
                <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Se alla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Dina senaste beställningar från sociala medier
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Inga ordrar ännu</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Lägg till din första order för att komma igång
                </p>
                <Link to="/orders">
                  <Button className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg till order
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{order.orderNumber}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{order.customer.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{order.price.toLocaleString()} SEK</p>
                      <Badge className="text-xs" variant={order.status === "Klar" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Production Status */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-gray-100">Produktionsstatus</CardTitle>
              <Link to="/production">
                <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Se alla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Vad som behöver göras denna vecka
            </CardDescription>
          </CardHeader>
          <CardContent>
            {urgentProductionTasks.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {stats.production.active === 0 ? "Inga aktiva uppgifter" : "Inga brådskande uppgifter"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {stats.production.active === 0 ? "Skapa produktionsuppgifter för dina ordrar" : "Alla uppgifter är under kontroll"}
                </p>
                <Link to="/production">
                  <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    {stats.production.active === 0 ? "Lägg till uppgift" : "Visa alla"}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentProductionTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{task.productName}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{task.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">Brådskande</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{task.dueDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-gray-100">Lagervarningar</CardTitle>
              <Link to="/inventory">
                <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Hantera lager
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Material som snart tar slut
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 dark:text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {stats.inventory.totalItems === 0 ? "Inga material ännu" : "Alla lager OK"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {stats.inventory.totalItems === 0 ? "Lägg till dina första material" : "Inga material behöver påfyllning just nu"}
                </p>
                <Link to="/inventory">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600">
                    <Plus className="w-4 h-4 mr-2" />
                    {stats.inventory.totalItems === 0 ? "Lägg till material" : "Visa lager"}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-500">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Lågt lager</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.currentStock} {item.unit} kvar
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Overview */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-gray-100">Produktkatalog</CardTitle>
              <Link to="/products">
                <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Se katalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Dina produkter och tjänster
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.products.total === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Ingen produktkatalog</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Lägg till dina produkter för att bygga din katalog
                </p>
                <Link to="/products">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg till produkt
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Totalt produkter:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{stats.products.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Kategorier:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{stats.products.categories}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Genomsnittspris:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {stats.products.total > 0 ? "Se katalog" : "—"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-300">💡 Tips för att komma igång</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700 dark:text-blue-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">1. Skapa din produktkatalog</h4>
              <p>Lägg till dina produkter/tjänster med priser och beskrivningar</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. Hantera material</h4>
              <p>Lägg in allt material du använder för att hålla koll på lagret</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. Lägg till ordrar</h4>
              <p>Registrera beställningar från sociala medier för att hålla ordning</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">4. Planera produktion</h4>
              <p>Skapa uppgifter för att hålla koll på vad som behöver göras</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index; 