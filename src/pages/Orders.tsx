import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Package, User, DollarSign, Instagram, Phone, MapPin, Clock, Trash2, Edit } from 'lucide-react';
import { useBizPal } from "@/context/BizPalContext";

const Orders = () => {
  // Use global state instead of local state
  const { orders, addOrder, updateOrder, deleteOrder, stats } = useBizPal();
  
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    customer: { name: "", socialMedia: "", phone: "", address: "" },
    product: { name: "", details: "", customizations: "" },
    price: "",
    estimatedCompletion: "",
    notes: ""
  });

  const statusColors = {
    "Beställd": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    "Pågående": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300", 
    "Klar": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    "Skickad": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  };

  const statusOptions = ["Beställd", "Pågående", "Klar", "Skickad"];

  const updateOrderStatus = (orderId, newStatus) => {
    const orderToUpdate = orders.find(order => order.id === orderId);
    if (orderToUpdate) {
      updateOrder({ ...orderToUpdate, status: newStatus });
    }
  };

  const handleAddOrEditOrder = () => {
    if (editingOrder) {
      updateOrder({
        ...newOrder,
        id: editingOrder.id,
        orderNumber: editingOrder.orderNumber,
        orderDate: editingOrder.orderDate
      });
      setEditingOrder(null);
    } else {
      const nextId = Math.max(0, ...orders.map(o => o.id)) + 1;
      const orderNumber = `ORD-${String(nextId).padStart(3, '0')}`;
      
      const order = {
        id: nextId,
        orderNumber,
        customer: newOrder.customer,
        product: newOrder.product,
        price: parseFloat(newOrder.price) || 0,
        status: "Beställd",
        orderDate: new Date().toISOString().split('T')[0],
        estimatedCompletion: newOrder.estimatedCompletion,
        notes: newOrder.notes
      };

      addOrder(order);
    }
    
    setShowNewOrderDialog(false);
    resetForm();
  };

  const handleEditOrder = (order) => {
    setNewOrder({
      customer: order.customer,
      product: order.product,
      price: order.price.toString(),
      estimatedCompletion: order.estimatedCompletion,
      notes: order.notes
    });
    setEditingOrder(order);
    setShowNewOrderDialog(true);
  };

  const handleDeleteOrder = (orderId) => {
    deleteOrder(orderId);
  };

  const resetForm = () => {
    setNewOrder({
      customer: { name: "", socialMedia: "", phone: "", address: "" },
      product: { name: "", details: "", customizations: "" },
      price: "",
      estimatedCompletion: "",
      notes: ""
    });
  };

  // Filter options
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ordrar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Hantera alla beställningar från sociala medier</p>
        </div>
        
        <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600">
              <Package className="w-4 h-4 mr-2" />
              {editingOrder ? "Redigera Order" : "Ny Order"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOrder ? "Redigera order" : "Lägg till ny order"}</DialogTitle>
              <DialogDescription>
                {editingOrder ? "Uppdatera orderdetaljer" : "Fyll i orderdetaljer från sociala medier"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Kundinfo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Namn</Label>
                    <Input 
                      value={newOrder.customer.name}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        customer: {...newOrder.customer, name: e.target.value}
                      })}
                      placeholder="Anna Andersson"
                    />
                  </div>
                  <div>
                    <Label>Sociala medier</Label>
                    <Input 
                      value={newOrder.customer.socialMedia}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        customer: {...newOrder.customer, socialMedia: e.target.value}
                      })}
                      placeholder="@anna_style (Instagram/TikTok/etc)"
                    />
                  </div>
                  <div>
                    <Label>Telefon</Label>
                    <Input 
                      value={newOrder.customer.phone}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        customer: {...newOrder.customer, phone: e.target.value}
                      })}
                      placeholder="070-123 45 67"
                    />
                  </div>
                  <div>
                    <Label>Adress</Label>
                    <Input 
                      value={newOrder.customer.address}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        customer: {...newOrder.customer, address: e.target.value}
                      })}
                      placeholder="Storgatan 1, Stockholm"
                    />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Produktinfo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Produktnamn</Label>
                    <Input 
                      value={newOrder.product.name}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        product: {...newOrder.product, name: e.target.value}
                      })}
                      placeholder="T-shirt, Halsband, Keramikskål..."
                    />
                  </div>
                  <div>
                    <Label>Pris (SEK)</Label>
                    <Input 
                      type="number"
                      value={newOrder.price}
                      onChange={(e) => setNewOrder({...newOrder, price: e.target.value})}
                      placeholder="250"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Produktdetaljer</Label>
                    <Input 
                      value={newOrder.product.details}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        product: {...newOrder.product, details: e.target.value}
                      })}
                      placeholder="Storlek, färg, material, etc."
                    />
                  </div>
                  <div>
                    <Label>Anpassningar</Label>
                    <Input 
                      value={newOrder.product.customizations}
                      onChange={(e) => setNewOrder({
                        ...newOrder, 
                        product: {...newOrder.product, customizations: e.target.value}
                      })}
                      placeholder="Personlig gravyr, speciella önskemål..."
                    />
                  </div>
                  <div>
                    <Label>Uppskattat klardatum</Label>
                    <Input 
                      type="date"
                      value={newOrder.estimatedCompletion}
                      onChange={(e) => setNewOrder({...newOrder, estimatedCompletion: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Anteckningar</Label>
                  <Textarea 
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                    placeholder="Speciella önskemål från kunden..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowNewOrderDialog(false);
                  setEditingOrder(null);
                  resetForm();
                }}>
                  Avbryt
                </Button>
                <Button onClick={handleAddOrEditOrder} className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600">
                  {editingOrder ? "Uppdatera order" : "Lägg till order"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards - Now using real data from context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Aktiva ordrar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.orders.active}</div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Totalt ordervärde</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.orders.revenue.toLocaleString()} SEK</div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Genomsnittspris</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + o.price, 0) / orders.length).toLocaleString() : 0} SEK
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-4">
        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Filtrera efter status:</Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla ordrar</SelectItem>
            {statusOptions.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Visar {filteredOrders.length} av {orders.length} ordrar
        </span>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {statusFilter === "all" ? "Alla ordrar" : `${statusFilter} ordrar`}
        </h2>
        {filteredOrders.length === 0 ? (
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {statusFilter === "all" ? "Inga ordrar ännu" : `Inga ${statusFilter.toLowerCase()} ordrar`}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                {statusFilter === "all" 
                  ? "Lägg till din första order för att komma igång"
                  : "Inga ordrar matchar det valda filtret"
                }
              </p>
              {statusFilter === "all" && (
                <Button onClick={() => setShowNewOrderDialog(true)} className="bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600">
                  <Package className="w-4 h-4 mr-2" />
                  Lägg till order
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{order.orderNumber}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      {order.customer.name}
                      <Instagram className="w-4 h-4 ml-2" />
                      {order.customer.socialMedia}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditOrder(order)}
                      className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Ta bort order</AlertDialogTitle>
                          <AlertDialogDescription>
                            Är du säker på att du vill ta bort order <strong>{order.orderNumber}</strong> för {order.customer.name}? 
                            Denna åtgärd kan inte ångras.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                          >
                            Ta bort
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Produktinfo</h4>
                    <div className="text-sm space-y-1">
                      <p className="text-gray-700 dark:text-gray-300"><strong>Produkt:</strong> {order.product.name}</p>
                      {order.product.details && (
                        <p className="text-gray-700 dark:text-gray-300"><strong>Detaljer:</strong> {order.product.details}</p>
                      )}
                      {order.product.customizations && (
                        <p className="text-gray-700 dark:text-gray-300"><strong>Anpassningar:</strong> {order.product.customizations}</p>
                      )}
                      <p className="text-gray-700 dark:text-gray-300"><strong>Pris:</strong> {order.price.toLocaleString()} SEK</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Kundinfo & Datum</h4>
                    <div className="text-sm space-y-1">
                      <p className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <Phone className="w-3 h-3" />
                        {order.customer.phone}
                      </p>
                      <p className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <MapPin className="w-3 h-3" />
                        {order.customer.address}
                      </p>
                      <p className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <Calendar className="w-3 h-3" />
                        Beställd: {order.orderDate}
                      </p>
                      <p className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                        <Clock className="w-3 h-3" />
                        Klardatum: {order.estimatedCompletion}
                      </p>
                    </div>
                  </div>
                </div>
                
                {order.notes && (
                  <div>
                    <h4 className="font-medium mb-1 text-gray-900 dark:text-gray-100">Anteckningar</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders; 