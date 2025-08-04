import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Truck, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin,
  Package,
  DollarSign
} from 'lucide-react';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Silverleverantör AB",
      email: "info@silverleverantor.se",
      phone: "08-123 45 67",
      address: "Industrigatan 5, 12345 Stockholm",
      status: "Aktiv",
      category: "Material",
      totalOrders: 12,
      totalSpent: 8500,
      lastOrder: "2024-01-14",
      notes: "Levererar silver för halsband"
    },
    {
      id: 2,
      name: "Keramik AB",
      email: "info@keramik.se",
      phone: "031-987 65 43",
      address: "Fabriksgatan 10, 54321 Göteborg",
      status: "Aktiv",
      category: "Material",
      totalOrders: 8,
      totalSpent: 3200,
      lastOrder: "2024-01-10",
      notes: "Levererar keramikmaterial"
    },
    {
      id: 3,
      name: "Bomullsfabriken",
      email: "info@bomull.se",
      phone: "040-555 12 34",
      address: "Textilgatan 15, 67890 Malmö",
      status: "Inaktiv",
      category: "Material",
      totalOrders: 3,
      totalSpent: 1200,
      lastOrder: "2023-11-15",
      notes: "Ekologisk bomull för T-shirts"
    }
  ]);

  const [showNewSupplierDialog, setShowNewSupplierDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    category: "",
    notes: ""
  });

  const categories = ["Material", "Verktyg", "Förpackning", "Tjänster", "Övrigt"];

  const addNewSupplier = () => {
    const supplier = {
      id: Math.max(0, ...suppliers.map(s => s.id)) + 1,
      name: newSupplier.name,
      email: newSupplier.email,
      phone: newSupplier.phone,
      address: newSupplier.address,
      status: "Aktiv",
      category: newSupplier.category,
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: null,
      notes: newSupplier.notes
    };

    setSuppliers([...suppliers, supplier]);
    setShowNewSupplierDialog(false);
    setNewSupplier({
      name: "",
      email: "",
      phone: "",
      address: "",
      category: "",
      notes: ""
    });
  };

  const deleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.phone.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || supplier.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === "Aktiv").length;
  const totalSpent = suppliers.reduce((sum, s) => sum + s.totalSpent, 0);
  const averageOrderValue = totalSpent / suppliers.reduce((sum, s) => sum + s.totalOrders, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leverantörer</h1>
          <p className="text-gray-600 mt-1">Hantera ditt leverantörsregister</p>
        </div>
        
        <Dialog open={showNewSupplierDialog} onOpenChange={setShowNewSupplierDialog}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Ny Leverantör
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Lägg till ny leverantör</DialogTitle>
              <DialogDescription>
                Skapa en ny leverantör i registret
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Företagsnamn</Label>
                <Input 
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                  placeholder="Silverleverantör AB"
                />
              </div>
              <div>
                <Label>E-post</Label>
                <Input 
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                  placeholder="info@silverleverantor.se"
                />
              </div>
              <div>
                <Label>Telefon</Label>
                <Input 
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                  placeholder="08-123 45 67"
                />
              </div>
              <div>
                <Label>Adress</Label>
                <Textarea 
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
                  placeholder="Industrigatan 5, 12345 Stockholm"
                />
              </div>
              <div>
                <Label>Kategori</Label>
                <select 
                  value={newSupplier.category} 
                  onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Välj kategori</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Anteckningar</Label>
                <Textarea 
                  value={newSupplier.notes}
                  onChange={(e) => setNewSupplier({...newSupplier, notes: e.target.value})}
                  placeholder="Valfria anteckningar om leverantören..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewSupplierDialog(false)}>
                  Avbryt
                </Button>
                <Button onClick={addNewSupplier} className="bg-orange-600 hover:bg-orange-700">
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
            <CardTitle className="text-sm font-medium">Totalt Leverantörer</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Leverantörer</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSuppliers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utgift</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalSpent.toLocaleString()} kr</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genomsnittlig Order</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
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
              placeholder="Sök leverantörer..."
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Alla status</option>
            <option value="Aktiv">Aktiv</option>
            <option value="Inaktiv">Inaktiv</option>
          </select>
        </div>
      </div>

      {/* Suppliers List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Leverantörslista</h2>
        {filteredSuppliers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Truck className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Inga leverantörer</h3>
              <p className="text-gray-500 text-center mb-4">
                Lägg till din första leverantör för att komma igång
              </p>
              <Button onClick={() => setShowNewSupplierDialog(true)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Lägg till leverantör
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <CardDescription>
                        {supplier.email} • {supplier.phone}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={supplier.status === "Aktiv" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {supplier.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{supplier.address}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Package className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{supplier.category}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Orders:</span>
                      <p className="font-semibold">{supplier.totalOrders}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Totalt spenderat:</span>
                      <p className="font-semibold">{supplier.totalSpent.toLocaleString()} kr</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Senaste order:</span>
                      <p className="font-semibold">{supplier.lastOrder || "Ingen"}</p>
                    </div>
                  </div>
                  
                  {supplier.notes && (
                    <div>
                      <p className="text-sm text-gray-600">{supplier.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteSupplier(supplier.id)}>
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

export default Suppliers; 