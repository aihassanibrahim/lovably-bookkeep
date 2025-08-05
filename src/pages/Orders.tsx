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
import { useAuth } from "@/components/auth/AuthProvider";

const Orders = () => {
  // Use global state instead of local state
  const { orders, addOrder, updateOrder, deleteOrder, stats, loading } = useBizPal();
  const { user } = useAuth();
  
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newOrder, setNewOrder] = useState({
    order_number: '',
    customer_name: '',
    customer_social_media: '',
    customer_phone: '',
    customer_address: '',
    product_name: '',
    product_details: '',
    product_customizations: '',
    price: '',
    status: 'Beställd',
    order_date: new Date().toISOString().split('T')[0],
    estimated_completion: '',
    notes: ''
  });

  const statusColors = {
    "Beställd": "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    "Pågående": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
    "Klar": "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    "Skickad": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  };

  const statusOptions = [
    { value: "Beställd", label: "Beställd" },
    { value: "Pågående", label: "Pågående" },
    { value: "Klar", label: "Klar" },
    { value: "Skickad", label: "Skickad" }
  ];

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

  const handleAddOrEditOrder = async () => {
    if (!user) return;
    
    setSubmitting(true);
    
    try {
      if (editingOrder) {
        await updateOrder({
          ...newOrder,
          id: editingOrder.id
        });
        setEditingOrder(null);
      } else {
        await addOrder(newOrder);
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
      customer_social_media: order.customer_social_media || '',
      customer_phone: order.customer_phone || '',
      customer_address: order.customer_address || '',
      product_name: order.product_name || '',
      product_details: order.product_details || '',
      product_customizations: order.product_customizations || '',
      price: order.price?.toString() || '',
      status: order.status || 'Beställd',
      order_date: order.order_date || new Date().toISOString().split('T')[0],
      estimated_completion: order.estimated_completion || '',
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
      customer_social_media: '',
      customer_phone: '',
      customer_address: '',
      product_name: '',
      product_details: '',
      product_customizations: '',
      price: '',
      status: 'Beställd',
      order_date: new Date().toISOString().split('T')[0],
      estimated_completion: '',
      notes: ''
    });
  };

  // Filter options
  const [statusFilter, setStatusFilter] = useState("all");
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Laddar orders...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Hantera dina kundorders och följ upp leveranser
          </p>
        </div>
        <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
          <DialogTrigger asChild>
            <Button>
              <Package className="mr-2 h-4 w-4" />
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
                    placeholder="ORD-001"
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer_name">Kundnamn</Label>
                    <Input
                      id="customer_name"
                      value={newOrder.customer_name}
                      onChange={(e) => setNewOrder({...newOrder, customer_name: e.target.value})}
                      placeholder="Anna Andersson"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer_social_media">Sociala medier</Label>
                    <Input
                      id="customer_social_media"
                      value={newOrder.customer_social_media}
                      onChange={(e) => setNewOrder({...newOrder, customer_social_media: e.target.value})}
                      placeholder="@anna_style"
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
                    <Label htmlFor="customer_address">Adress</Label>
                    <Input
                      id="customer_address"
                      value={newOrder.customer_address}
                      onChange={(e) => setNewOrder({...newOrder, customer_address: e.target.value})}
                      placeholder="Storgatan 1, Stockholm"
                    />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <h3 className="font-medium">Produktinformation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product_name">Produktnamn</Label>
                    <Input
                      id="product_name"
                      value={newOrder.product_name}
                      onChange={(e) => setNewOrder({...newOrder, product_name: e.target.value})}
                      placeholder="T-shirt, Halsband, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Pris (SEK)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newOrder.price}
                      onChange={(e) => setNewOrder({...newOrder, price: e.target.value})}
                      placeholder="250"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="product_details">Produktdetaljer</Label>
                    <Input
                      id="product_details"
                      value={newOrder.product_details}
                      onChange={(e) => setNewOrder({...newOrder, product_details: e.target.value})}
                      placeholder="Storlek, färg, material, etc."
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="product_customizations">Anpassningar</Label>
                    <Input
                      id="product_customizations"
                      value={newOrder.product_customizations}
                      onChange={(e) => setNewOrder({...newOrder, product_customizations: e.target.value})}
                      placeholder="Personlig gravyr, speciella önskemål..."
                    />
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimated_completion">Uppskattat klardatum</Label>
                  <Input
                    id="estimated_completion"
                    type="date"
                    value={newOrder.estimated_completion}
                    onChange={(e) => setNewOrder({...newOrder, estimated_completion: e.target.value})}
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
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewOrderDialog(false)}>
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
            <CardTitle className="text-sm font-medium">Totalt Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.orders.active} aktiva, {stats.orders.completed} slutförda
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Intäkt</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.orders.revenue)}</div>
            <p className="text-xs text-muted-foreground">
              Från slutförda orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.active}</div>
            <p className="text-xs text-muted-foreground">
              Väntar på slutförande
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slutförda</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.completed}</div>
            <p className="text-xs text-muted-foreground">
              Levererade orders
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
            <SelectItem value="all">Alla Orders</SelectItem>
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
            <CardContent className="flex flex-col items-center justify-center h-32">
              <Package className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Inga orders hittades</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{order.order_number}</h3>
                      <Badge className={statusColors[order.status]}>
                        {statusOptions.find(s => s.value === order.status)?.label || order.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3 w-3" />
                        <span>{order.customer_name}</span>
                        {order.customer_social_media && (
                          <>
                            <Instagram className="h-3 w-3" />
                            <span>{order.customer_social_media}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-3 w-3" />
                        <span>{order.product_name}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(order.order_date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatCurrency(order.price)}</span>
                      </div>
                      {order.estimated_completion && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Klar: {formatDate(order.estimated_completion)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select 
                      value={order.status} 
                      onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
                    >
                      <SelectTrigger className="w-[120px]">
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