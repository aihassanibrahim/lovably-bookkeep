import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");

  // Simulerad data för rapporter
  const reportData = {
    overview: {
      totalIncome: 125000,
      totalExpenses: 85000,
      netIncome: 40000,
      profitMargin: 32,
      totalOrders: 45,
      averageOrderValue: 2778
    },
    monthly: {
      january: { income: 15000, expenses: 12000, profit: 3000 },
      february: { income: 18000, expenses: 14000, profit: 4000 },
      march: { income: 22000, expenses: 16000, profit: 6000 },
      april: { income: 25000, expenses: 18000, profit: 7000 },
      may: { income: 28000, expenses: 20000, profit: 8000 },
      june: { income: 32000, expenses: 22000, profit: 10000 }
    },
    topProducts: [
      { name: "Keramikskål", sales: 25, revenue: 7475 },
      { name: "Halsband Silver", sales: 18, revenue: 10782 },
      { name: "T-shirt Ekologisk", sales: 12, revenue: 2388 },
      { name: "Örhängen", sales: 8, revenue: 3200 }
    ],
    topCustomers: [
      { name: "Anna Andersson", orders: 5, spent: 2500 },
      { name: "Erik Eriksson", orders: 3, spent: 1800 },
      { name: "Maria Svensson", orders: 1, spent: 299 },
      { name: "Johan Johansson", orders: 2, spent: 1200 }
    ]
  };

  const periods = [
    { value: "week", label: "Denna vecka" },
    { value: "month", label: "Denna månad" },
    { value: "quarter", label: "Detta kvartal" },
    { value: "year", label: "Detta år" }
  ];

  const reports = [
    { value: "overview", label: "Översikt", icon: BarChart3 },
    { value: "income", label: "Intäkter", icon: TrendingUp },
    { value: "expenses", label: "Utgifter", icon: TrendingDown },
    { value: "products", label: "Produkter", icon: PieChart },
    { value: "customers", label: "Kunder", icon: Activity }
  ];

  const generateReport = () => {
    // Här skulle man generera och ladda ner rapporten
    console.log(`Genererar ${selectedReport} rapport för ${selectedPeriod}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapporter</h1>
          <p className="text-gray-600 mt-1">Ekonomiska rapporter och statistik</p>
        </div>
        
        <Button onClick={generateReport} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Exportera Rapport
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Välj period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger>
              <FileText className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Välj rapport" />
            </SelectTrigger>
            <SelectContent>
              {reports.map(report => (
                <SelectItem key={report.value} value={report.value}>
                  <div className="flex items-center">
                    <report.icon className="w-4 h-4 mr-2" />
                    {report.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala Intäkter</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reportData.overview.totalIncome.toLocaleString()} kr</div>
            <p className="text-xs text-muted-foreground">+12% från förra perioden</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala Utgifter</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{reportData.overview.totalExpenses.toLocaleString()} kr</div>
            <p className="text-xs text-muted-foreground">+8% från förra perioden</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nettoresultat</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{reportData.overview.netIncome.toLocaleString()} kr</div>
            <p className="text-xs text-muted-foreground">Vinstmarginal: {reportData.overview.profitMargin}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genomsnittlig Order</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.overview.averageOrderValue.toLocaleString()} kr</div>
            <p className="text-xs text-muted-foreground">Totalt {reportData.overview.totalOrders} orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Månadsvis Trend</CardTitle>
          <CardDescription>Intäkter och utgifter över tid</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(reportData.monthly).map(([month, data]) => (
              <div key={month} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-20 text-sm font-medium capitalize">{month}</div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-green-600">Intäkter: {data.income.toLocaleString()} kr</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-red-600">Utgifter: {data.expenses.toLocaleString()} kr</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.profit >= 0 ? '+' : ''}{data.profit.toLocaleString()} kr
                  </div>
                  <div className="text-xs text-gray-500">Vinst/Förlust</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Products and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Bästsäljande Produkter</CardTitle>
            <CardDescription>Topp 4 produkter efter försäljning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sales} sålda</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{product.revenue.toLocaleString()} kr</div>
                    <div className="text-sm text-gray-500">Intäkter</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Bästa Kunder</CardTitle>
            <CardDescription>Topp 4 kunder efter försäljning</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topCustomers.map((customer, index) => (
                <div key={customer.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.orders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{customer.spent.toLocaleString()} kr</div>
                    <div className="text-sm text-gray-500">Totalt spenderat</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snabbåtgärder</CardTitle>
          <CardDescription>Vanliga rapporter och exporter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <FileText className="w-6 h-6 mb-2" />
              <span>Månadsrapport</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <BarChart3 className="w-6 h-6 mb-2" />
              <span>Produktanalys</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Activity className="w-6 h-6 mb-2" />
              <span>Kundanalys</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports; 