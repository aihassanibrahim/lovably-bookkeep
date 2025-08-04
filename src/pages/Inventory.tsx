import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBizPal } from "@/context/BizPalContext";
import { Plus, Edit, Trash2, AlertTriangle, Package, DollarSign, TrendingDown } from 'lucide-react';

const Inventory = () => {
  const { inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, stats } = useBizPal();
  const [showNewItemDialog, setShowNewItemDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    currentStock: "",
    minStock: "",
    unit: "",
    costPerUnit: "",
    supplier: "",
    description: "",
    location: ""
  });

  const defaultCategories = [
    "Tyg/Material", 
    "Metaller", 
    "Kemikalier/Färger", 
    "Verktyg", 
    "Fästelement", 
    "Elektronik",
    "Förpackning",
    "Keramik/Lera",
    "Smycken/Pärlor",
    "Träbearbetning",
    "Konstnärsmaterial",
    "Övrigt"
  ];

  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState("");

  const units = ["st", "m", "m²", "cm", "kg", "g", "liter", "ml", "paket", "rulle", "ark"];

    const addOrEditItem = () => {
    if (editingItem) {
      updateInventoryItem({ ...newItem, id: editingItem.id });
      setEditingItem(null);
    } else {
      const nextId = Math.max(0, ...inventoryItems.map(item => item.id)) + 1;
      addInventoryItem({ ...newItem, id: nextId });
    }

    setShowNewItemDialog(false);
    setNewItem({
      name: "",
      category: "",
      currentStock: "",
      minStock: "",
      unit: "",
      costPerUnit: "",
      supplier: "",
      description: "",
      location: ""
    });
  };

  const editItem = (item) => {
    setNewItem(item);
    setEditingItem(item);
    setShowNewItemDialog(true);
  };

  const deleteItem = (itemId) => {
    deleteInventoryItem(itemId);
  };

  const updateStock = (itemId, newStock) => {
    const itemToUpdate = inventoryItems.find(item => item.id === itemId);
    if (itemToUpdate) {
      updateInventoryItem({ ...itemToUpdate, currentStock: newStock });
    }
  };

  const addNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewItem({...newItem, category: newCategory});
      setNewCategory("");
    }
  };

    const lowStockItems = inventoryItems.filter(item =>
    parseFloat(item.currentStock) <= parseFloat(item.minStock)
  );

  const getStockStatus = (item) => {
    const current = parseFloat(item.currentStock);
    const min = parseFloat(item.minStock);
    
    if (current <= min) return { status: "Låg", color: "bg-red-100 text-red-800" };
    if (current <= min * 1.5) return { status: "Varning", color: "bg-yellow-100 text-yellow-800" };
    return { status: "OK", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lager</h1>
          <p className="text-gray-600 mt-1">Hantera material och komponenter</p>
        </div>
        
        <Dialog open={showNewItemDialog} onOpenChange={setShowNewItemDialog}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Lägg till material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Redigera material" : "Lägg till nytt material"}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? "Uppdatera materialinformation" : "Lägg till ett nytt material i lagret"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Grundinfo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Materialnamn</Label>
                    <Input 
                      value={newItem.name}
                      onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      placeholder="Bomullstyg blå, Silver tråd, Akrylfärg röd..."
                    />
                  </div>
                  <div>
                    <Label>Kategori</Label>
                    <div className="flex gap-2">
                      <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Välj kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-1">
                        <Input 
                          placeholder="Ny kategori"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-24"
                        />
                        <Button type="button" size="sm" onClick={addNewCategory}>+</Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Leverantör</Label>
                    <Input 
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                      placeholder="Materialbolaget AB, Hobby House..."
                    />
                  </div>
                  <div>
                    <Label>Placering</Label>
                    <Input 
                      value={newItem.location}
                      onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                      placeholder="Hylla A3, Låda 1, Förråd..."
                    />
                  </div>
                </div>
              </div>

              {/* Stock Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Lagerinfo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nuvarande lager</Label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={newItem.currentStock}
                      onChange={(e) => setNewItem({...newItem, currentStock: e.target.value})}
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <Label>Minimumnivå</Label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={newItem.minStock}
                      onChange={(e) => setNewItem({...newItem, minStock: e.target.value})}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <Label>Enhet</Label>
                    <Select value={newItem.unit} onValueChange={(value) => setNewItem({...newItem, unit: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj enhet" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Kostnad per enhet (SEK)</Label>
                    <Input 
                      type="number"
                      step="0.01"
                      value={newItem.costPerUnit}
                      onChange={(e) => setNewItem({...newItem, costPerUnit: e.target.value})}
                      placeholder="25.50"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Beskrivning</Label>
                <Textarea 
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Beskrivning av materialets egenskaper, kvalitet, användningsområde..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowNewItemDialog(false);
                  setEditingItem(null);
                  setNewItem({
                    name: "",
                    category: "",
                    currentStock: "",
                    minStock: "",
                    unit: "",
                    costPerUnit: "",
                    supplier: "",
                    description: "",
                    location: ""
                  });
                }}>
                  Avbryt
                </Button>
                <Button onClick={addOrEditItem} className="bg-emerald-600 hover:bg-emerald-700">
                  {editingItem ? "Uppdatera" : "Lägg till"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Antal material</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventory.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lagervärde</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventory.totalValue.toLocaleString()} SEK</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Låga lager</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inventory.lowStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Låga lager - Behöver påfyllning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-red-600">
                    {item.currentStock} {item.unit} (Min: {item.minStock})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Lagerlista</h2>
        {inventoryItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Inga material ännu</h3>
              <p className="text-gray-500 text-center mb-4">
                Lägg till ditt första material för att komma igång med lagerhanteringen
              </p>
              <Button onClick={() => setShowNewItemDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Lägg till material
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inventoryItems.map((item) => {
              const stockStatus = getStockStatus(item);
              const itemValue = (parseFloat(item.currentStock) * parseFloat(item.costPerUnit)) || 0;
              
              return (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>
                          {item.category} • {item.supplier}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={stockStatus.color}>
                          {stockStatus.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Nuvarande lager</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.1"
                            value={item.currentStock}
                            onChange={(e) => updateStock(item.id, e.target.value)}
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">{item.unit}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Minimumnivå</Label>
                        <p className="text-lg font-medium">
                          {item.minStock} {item.unit}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Kostnad per enhet</Label>
                        <p className="text-lg font-medium">
                          {parseFloat(item.costPerUnit).toLocaleString()} SEK
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Totalt värde</Label>
                        <p className="text-lg font-medium text-emerald-600">
                          {itemValue.toLocaleString()} SEK
                        </p>
                      </div>
                    </div>

                    {item.location && (
                      <div>
                        <Label className="text-sm text-gray-600">Placering</Label>
                        <p className="text-sm">{item.location}</p>
                      </div>
                    )}

                    {item.description && (
                      <div>
                        <Label className="text-sm text-gray-600">Beskrivning</Label>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory; 