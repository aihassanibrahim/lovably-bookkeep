import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Package, User, DollarSign, Instagram, Phone, MapPin, Clock } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: { name: "", socialMedia: "", phone: "", address: "" },
    product: { name: "", details: "", customizations: "" },
    price: "",
    estimatedCompletion: "",
    notes: ""
  });

  const statusColors = {
    "Beställd": "bg-blue-100 text-blue-800",
    "Pågående": "bg-yellow-100 text-yellow-800", 
    "Klar": "bg-green-100 text-green-800",
    "Skickad": "bg-gray-100 text-gray-800"
  };

  const statusOptions = ["Beställd", "Pågående", "Klar", "Skickad"];

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const addNewOrder = () => {
    const nextId = Math.max(0, ...orders.map(o => o.id)) + 1;
    const orderNumber = `ORD-${String(nextId).padStart(3, '0')}`;
    
    const order = {
      id: nextId,
      orderNumber,
      customer: newOrder.customer,
      product: newOrder.product,
      price: parseFloat(newOrder.price),
      status: "Beställd",
      orderDate: new Date().toISOString().split('T')[0],
      estimatedCompletion: newOrder.estimatedCompletion,
      notes: newOrder.notes
    };

    setOrders([...orders, order]);
    setShowNewOrderDialog(false);
    setNewOrder({
      customer: { name: "", socialMedia: "", phone: "", address: "" },
      product: { name: "", details: "", customizations: "" },
      price: "",
      estimatedCompletion: "",
      notes: ""
    });
  };

  const totalValue = orders.reduce((sum, order) => sum + order.price, 0);
  const activeOrders = orders.filter(order => order.status !== "Skickad").length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ordrar</h1>
          <p className="text-gray-600 mt-1">Hantera alla beställningar från sociala medier</p>
        </div>
        
        <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Package className="w-4 h-4 mr-2" />
              Ny Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Lägg till ny order</DialogTitle>
              <DialogDescription>
                Fyll i orderdetaljer från sociala medier
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
                <Button variant="outline" onClick={() => setShowNewOrderDialog(false)}>
                  Avbryt
                </Button>
                <Button onClick={addNewOrder} className="bg-pink-600 hover:bg-pink-700">
                  Lägg till order
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
            <CardTitle className="text-sm font-medium">Aktiva ordrar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt ordervärde</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toLocaleString()} SEK</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genomsnittspris</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.length > 0 ? Math.round(totalValue / orders.length).toLocaleString() : 0} SEK
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Alla ordrar</h2>
        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Inga ordrar ännu</h3>
              <p className="text-gray-500 text-center mb-4">
                Lägg till din första order för att komma igång
              </p>
              <Button onClick={() => setShowNewOrderDialog(true)} className="bg-pink-600 hover:bg-pink-700">
                <Package className="w-4 h-4 mr-2" />
                Lägg till order
              </Button>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
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
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Produktinfo</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Produkt:</strong> {order.product.name}</p>
                      {order.product.details && (
                        <p><strong>Detaljer:</strong> {order.product.details}</p>
                      )}
                      {order.product.customizations && (
                        <p><strong>Anpassningar:</strong> {order.product.customizations}</p>
                      )}
                      <p><strong>Pris:</strong> {order.price.toLocaleString()} SEK</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Kundinfo & Datum</h4>
                    <div className="text-sm space-y-1">
                      <p className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.customer.phone}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {order.customer.address}
                      </p>
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Beställd: {order.orderDate}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Klardatum: {order.estimatedCompletion}
                      </p>
                    </div>
                  </div>
                </div>
                
                {order.notes && (
                  <div>
                    <h4 className="font-medium mb-1">Anteckningar</h4>
                    <p className="text-sm text-gray-600">{order.notes}</p>
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