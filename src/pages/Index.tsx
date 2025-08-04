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
  const { stats } = useBizPal();

  const quickActions = [
    {
      title: "Ny Order",
      description: "Lägg till beställning från sociala medier",
      icon: <Plus className="h-5 w-5" />,
      color: "bg-pink-600 hover:bg-pink-700",
      link: "/orders"
    },
    {
      title: "Produktionsstatus",
      description: "Se vad som behöver göras",
      icon: <Clock className="h-5 w-5" />,
      color: "bg-purple-600 hover:bg-purple-700",
      link: "/production"
    },
    {
      title: "Ny Produkt",
      description: "Lägg till produkt i katalogen",
      icon: <Package className="h-5 w-5" />,
      color: "bg-indigo-600 hover:bg-indigo-700",
      link: "/products"
    },
    {
      title: "Hantera Lager",
      description: "Uppdatera material och komponenter",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-emerald-600 hover:bg-emerald-700",
      link: "/inventory"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Översikt av din verksamhet - {new Date().toLocaleDateString('sv-SE')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${action.color} text-white`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva ordrar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.orders.total} totalt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Månadens intäkter</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.revenue.toLocaleString()} SEK</div>
            <p className="text-xs text-muted-foreground">
              {stats.orders.completed} slutförda ordrar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produktionsuppgifter</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.production.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.production.urgent > 0 ? (
                <span className="text-red-600">{stats.production.urgent} brådskande</span>
              ) : (
                "Allt under kontroll"
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lagervärde</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventory.totalValue.toLocaleString()} SEK</div>
            <p className="text-xs text-muted-foreground">
              {stats.inventory.lowStock > 0 ? (
                <span className="text-amber-600">{stats.inventory.lowStock} låga lager</span>
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Senaste ordrar</CardTitle>
              <Link to="/orders">
                <Button variant="outline" size="sm">
                  Se alla <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              Dina senaste beställningar från sociala medier
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.orders.total === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Inga ordrar ännu</h3>
                <p className="text-gray-500 mb-4">
                  Lägg till din första order för att komma igång
                </p>
                <Link to="/orders">
                  <Button className="bg-pink-600 hover:bg-pink-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg till order
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Här visas dina senaste ordrar när du har lagt till några
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Production Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Produktionsstatus</CardTitle>
              <Link to="/production">
                <Button variant="outline" size="sm">
                  Se alla <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              Vad som behöver göras denna vecka
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.production.active === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Inga aktiva uppgifter</h3>
                <p className="text-gray-500 mb-4">
                  Skapa produktionsuppgifter för dina ordrar
                </p>
                <Link to="/production">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg till uppgift
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Här visas dina produktionsuppgifter när du har skapat några
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lagervarningar</CardTitle>
              <Link to="/inventory">
                <Button variant="outline" size="sm">
                  Hantera lager <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              Material som snart tar slut
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.inventory.lowStock === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {stats.inventory.totalItems === 0 ? "Inga material ännu" : "Alla lager OK"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {stats.inventory.totalItems === 0 
                    ? "Lägg till dina första material"
                    : "Inga material behöver påfyllning just nu"
                  }
                </p>
                <Link to="/inventory">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    {stats.inventory.totalItems === 0 ? "Lägg till material" : "Visa lager"}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {stats.inventory.lowStock} material behöver påfyllning
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Produktkatalog</CardTitle>
              <Link to="/products">
                <Button variant="outline" size="sm">
                  Se katalog <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              Dina produkter och tjänster
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.products.total === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ingen produktkatalog</h3>
                <p className="text-gray-500 mb-4">
                  Lägg till dina produkter för att bygga din katalog
                </p>
                <Link to="/products">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg till produkt
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Totalt produkter:</span>
                  <span className="font-medium">{stats.products.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kategorier:</span>
                  <span className="font-medium">{stats.products.categories}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">💡 Tips för att komma igång</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
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