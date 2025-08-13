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
import { Package, User, DollarSign, Phone, MapPin, Clock, Trash2, Edit, Plus } from 'lucide-react';
import { useBizPal } from "@/context/BizPalContext";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from 'sonner';

const Orders = () => {
  const { orders, addOrder, updateOrder, deleteOrder, customers, products, stats, loading } = useBizPal();
  const { user } = useAuth();
  
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [newOrder, setNewOrder] = useState({
    order_number: '',
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    product_name: '',
    quantity: 1,
    price: '',
    status: 'Beställd',
    order_date: new Date().toISOString().split('T')[0],
    estimated_delivery: '',
    notes: ''
  });

  // Simplified status options for small business
  const statusOptions = [
    { value: "Beställd", label: "Beställd", color: "bg-blue-100 text-blue-800" },
    { value: "I produktion", label: "I produktion", color: "bg-orange-100 text-orange-800" },
    { value: "Klar", label: "Klar", color: "bg-purple-100 text-purple-800" },
    { value: "Levererad", label: "Levererad", color: "bg-green-100 text-green-800" },
    { value: "Avbruten", label: "Avbruten", color: "bg-gray-100 text-gray-800" }
  ];

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    return `ORD-${timestamp}`;
  };

  const handleAddOrEditOrder = async () => {
    if (!user) return;
    
    // Validation
    if (!newOrder.customer_name.trim()) {
      toast.error('Kundnamn krävs');
      return;
    }
    
    if (!newOrder.product_name.trim()) {
      toast.error('Produktnamn krävs');
      return;
    }
    
    if (!newOrder.price || parseFloat(newOrder.price) <= 0) {
      toast.error('Giltigt pris krävs');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const orderData = {
        ...newOrder,
        order_number: newOrder.order_number || generateOrderNumber(),
        price: parseFloat(newOrder.price),
        quantity: parseInt(newOrder.quantity) || 1
      };

      if (editingOrder) {
        await updateOrder({ ...orderData, id: editingOrder.id });
        setEditingOrder(null);
      } else {
        await addOrder(orderData);
      }
      
      setShowNewOrderDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOrder = (order) => {
    setNewOrder({
      order_number: order.order_number || '',
      customer_name: order.customer_name || '',
      customer_phone: order.customer_phone || '',
      customer_address: order.customer_address || '',
      product_name: order.product_name || '',
      quantity: order.quantity || 1,
      price: order.price?.toString() || '',
      status: order.status || 'Beställd',
      order_date: order.order_date || new Date().toISOString().split('T')[0],
      estimated_delivery: order.estimated_completion || '',
      notes: order.notes || ''
    });
    setEditingOrder(order);
    setShowNewOrderDialog(true);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const resetForm = () => {
    setNewOrder({
      order_number: '',
      customer_name: '',
      customer_phone: '',
      customer_address: '',
      product_name: '',
      quantity: 1,
      price: '',
      status: 'Beställd',
      order_date: new Date().toISOString().split('T')[0],
      estimated_delivery: '',
      notes: ''
    });
    setEditingOrder(null);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const orderToUpdate = orders.find(order => order.id === orderId);
    if (orderToUpdate) {
      try {
        await updateOrder({ ...orderToUpdate, status: newStatus });
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  };

  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sv-SE');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laddar ordrar...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ordrar</h1>
          <p className="text-gray-600">
            Hantera dina kundordrar och följ upp leveranser
          </p>
        </div>
        <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Ny Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? 'Redigera Order' : 'Skapa Ny Order'}
              </DialogTitle>
              <DialogDescription>
                Fyll i informationen för att {editingOrder ? 'uppdatera' : 'skapa'} en order
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order_number">Ordernummer</Label>
                  <Input
                    id="order_number"
                    value={newOrder.order_number}
                    onChange={(e) => setNewOrder({...newOrder, order_number: e.target.value})}
                    placeholder={generateOrderNumber()}
                  />
                </div>
                <div>
                  <Label htmlFor="order_date">Orderdatum</Label>
                  <Input
                    id="order_date"
                    type="date"
                    value={newOrder.order_date}
                    onChange={(e) => setNewOrder({...newOrder, order_date: e.target.value})}
                  />
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-medium">Kundinformation</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Kundnamn *</Label>
                    <Input
                      id="customer_name"
                      value={newOrder.customer_name}
                      onChange={(e) => setNewOrder({...newOrder, customer_name: e.target.value})}
                      placeholder="Anna Andersson"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_phone">Telefon</Label>
                    <Input
                      id="customer_phone"
                      value={newOrder.customer_phone}
                      onChange={(e) => setNewOrder({...newOrder, customer_phone: e.target.value})}
                      placeholder="070-123 45 67"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_address">Leveransadress</Label>
                    <Textarea
                      id="customer_address"
                      value={newOrder.customer_address}
                      onChange={(e) => setNewOrder({...newOrder, customer_address: e.target.value})}
                      placeholder="Storgatan 1, 12345 Stockholm"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <h3 className="font-medium">Produktinformation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product_name">Produkt *</Label>
                    <Input
                      id="product_name"
                      value={newOrder.product_name}
                      onChange={(e) => setNewOrder({...newOrder, product_name: e.target.value})}
                      placeholder="Produktnamn"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Antal</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newOrder.quantity}
                      onChange={(e) => setNewOrder({...newOrder, quantity: parseInt(e.target.value) || 1})}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Pris (SEK) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newOrder.price}
                      onChange={(e) => setNewOrder({...newOrder, price: e.target.value})}
                      placeholder="250"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={newOrder.status} 
                      onValueChange={(value) => setNewOrder({...newOrder, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Välj status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="estimated_delivery">Beräknad leverans</Label>
                  <Input
                    id="estimated_delivery"
                    type="date"
                    value={newOrder.estimated_delivery}
                    onChange={(e) => setNewOrder({...newOrder, estimated_delivery: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Anteckningar</Label>
                  <Textarea
                    id="notes"
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                    placeholder="Speciella önskemål från kunden..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowNewOrderDialog(false);
                resetForm();
              }}>
                Avbryt
              </Button>
              <Button onClick={handleAddOrEditOrder} disabled={submitting}>
                {submitting ? 'Sparar...' : (editingOrder ? 'Uppdatera' : 'Skapa')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt Ordrar</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.total}</div>
            <p className="text-xs text-gray-600">
              {stats.orders.active} aktiva
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Intäkt</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.orders.revenue)}
            </div>
            <p className="text-xs text-gray-600">
              Från levererade ordrar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Ordrar</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.orders.active}</div>
            <p className="text-xs text-gray-600">
              Pågående arbete
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Levererade</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.orders.completed}</div>
            <p className="text-xs text-gray-600">
              Slutförda ordrar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrera efter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla Ordrar</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {statusFilter === "all" ? "Inga ordrar än" : "Inga ordrar med denna status"}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {statusFilter === "all" 
                  ? "Skapa din första order för att komma igång"
                  : "Prova att ändra filtret eller skapa en ny order"
                }
              </p>
              <Button 
                onClick={() => setShowNewOrderDialog(true)} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Skapa Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{order.order_number}</h3>
                      <Badge className={statusOptions.find(s => s.value === order.status)?.color}>
                        {order.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{order.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{order.product_name}</span>
                        {order.quantity > 1 && <span>× {order.quantity}</span>}
                      </div>
                      {order.customer_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{order.customer_phone}</span>
                        </div>
                      )}
                      {order.customer_address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{order.customer_address}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm mt-3">
                      <span>Beställd: {formatDate(order.order_date)}</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(order.price)}
                      </span>
                      {order.estimated_completion && (
                        <span>Leverans: {formatDate(order.estimated_completion)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select 
                      value={order.status} 
                      onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOrder(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Denna åtgärd kan inte ångras. Ordern kommer att raderas permanent.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteOrder(order.id)}>
                            Radera
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;