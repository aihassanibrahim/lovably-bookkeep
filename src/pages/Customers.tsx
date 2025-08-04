import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Anna Andersson",
      email: "anna.andersson@email.com",
      phone: "070-123 45 67",
      address: "Storgatan 1, 12345 Stockholm",
      status: "Aktiv",
      totalOrders: 5,
      totalSpent: 2500,
      lastOrder: "2024-01-15",
      notes: "Föredrar keramikprodukter"
    },
    {
      id: 2,
      name: "Erik Eriksson",
      email: "erik.eriksson@email.com",
      phone: "070-987 65 43",
      address: "Lillgatan 5, 54321 Göteborg",
      status: "Aktiv",
      totalOrders: 3,
      totalSpent: 1800,
      lastOrder: "2024-01-13",
      notes: "Intresserad av silverhalsband"
    },
    {
      id: 3,
      name: "Maria Svensson",
      email: "maria.svensson@email.com",
      phone: "070-555 12 34",
      address: "Mellangatan 10, 67890 Malmö",
      status: "Inaktiv",
      totalOrders: 1,
      totalSpent: 299,
      lastOrder: "2023-12-20",
      notes: "Köpte en keramikskål"
    }
  ]);

  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });

  const addNewCustomer = () => {
    const customer = {
      id: Math.max(0, ...customers.map(c => c.id)) + 1,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      status: "Aktiv",
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: null,
      notes: newCustomer.notes
    };

    setCustomers([...customers, customer]);
    setShowNewCustomerDialog(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: ""
    });
  };

  const deleteCustomer = (id: number) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "Aktiv").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kunder</h1>
          <p className="text-gray-600 mt-1">Hantera ditt kundregister</p>
        </div>
        
        <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Ny Kund
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Lägg till ny kund</DialogTitle>
              <DialogDescription>
                Skapa en ny kund i registret
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Namn</Label>
                <Input 
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="Anna Andersson"
                />
              </div>
              <div>
                <Label>E-post</Label>
                <Input 
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  placeholder="anna.andersson@email.com"
                />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input 
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="070-123 45 67"
                />
              </div>
              <div>
                <Label>Adress</Label>
                <Textarea 
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  placeholder="Storgatan 1, 12345 Stockholm"
                />
              </div>
              <div>
                <Label>Anteckningar</Label>
                <Textarea 
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                  placeholder="Valfria anteckningar om kunden..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>
                  Avbryt
                </Button>
                <Button onClick={addNewCustomer} className="bg-blue-600 hover:bg-blue-700">
                  Lägg till
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt Kunder</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Kunder</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Intäkt</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()} kr</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genomsnittlig Order</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isNaN(averageOrderValue) ? 0 : averageOrderValue.toFixed(0)} kr</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Sök kunder..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full sm:w-48">
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alla status</option>
            <option value="Aktiv">Aktiv</option>
            <option value="Inaktiv">Inaktiv</option>
          </select>
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Kundlista</h2>
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Inga kunder</h3>
              <p className="text-gray-500 text-center mb-4">
                Lägg till din första kund för att komma igång
              </p>
              <Button onClick={() => setShowNewCustomerDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Lägg till kund
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <CardDescription>
                        {customer.email} • {customer.phone}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={customer.status === "Aktiv" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {customer.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{customer.address}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Orders:</span>
                      <p className="font-semibold">{customer.totalOrders}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Totalt spenderat:</span>
                      <p className="font-semibold">{customer.totalSpent.toLocaleString()} kr</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Senaste order:</span>
                      <p className="font-semibold">{customer.lastOrder || "Ingen"}</p>
                    </div>
                  </div>
                  
                  {customer.notes && (
                    <div>
                      <p className="text-sm text-gray-600">{customer.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteCustomer(customer.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers; 