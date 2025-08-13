import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useBizPal } from "@/context/BizPalContext";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from 'sonner';

const Customers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, loading } = useBizPal();
  const { user } = useAuth();

  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: ""
  });

  const handleAddOrEditCustomer = async () => {
    if (!user) return;
    
    // Validation
    if (!newCustomer.company_name.trim()) {
      toast.error('Företagsnamn krävs');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const customerData = {
        ...newCustomer,
        customer_number: `KUND-${Date.now()}`
      };

      if (editingCustomer) {
        await updateCustomer({
          ...customerData,
          id: editingCustomer.id
        });
        setEditingCustomer(null);
      } else {
        await addCustomer(customerData);
      }
      
      setShowNewCustomerDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCustomer = (customer) => {
    setNewCustomer({
      company_name: customer.company_name || '',
      contact_person: customer.contact_person || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setEditingCustomer(customer);
    setShowNewCustomerDialog(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteCustomer(customerId);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const resetForm = () => {
    setNewCustomer({
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: ""
    });
    setEditingCustomer(null);
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return customer.company_name?.toLowerCase().includes(searchLower) ||
           customer.contact_person?.toLowerCase().includes(searchLower) ||
           customer.email?.toLowerCase().includes(searchLower) ||
           customer.phone?.includes(searchTerm);
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laddar kunder...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Ny Kund
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? 'Redigera Kund' : 'Lägg till ny kund'}
              </DialogTitle>
              <DialogDescription>
                {editingCustomer ? 'Uppdatera kundinformation' : 'Skapa en ny kund i registret'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Företagsnamn / Namn *</Label>
                <Input 
                  value={newCustomer.company_name}
                  onChange={(e) => setNewCustomer({...newCustomer, company_name: e.target.value})}
                  placeholder="Anna Andersson AB"
                  required
                />
              </div>
              
              <div>
                <Label>Kontaktperson</Label>
                <Input 
                  value={newCustomer.contact_person}
                  onChange={(e) => setNewCustomer({...newCustomer, contact_person: e.target.value})}
                  placeholder="Anna Andersson"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>E-post</Label>
                  <Input 
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                    placeholder="anna@example.com"
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
              </div>
              
              <div>
                <Label>Adress</Label>
                <Textarea 
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  placeholder="Storgatan 1, 12345 Stockholm"
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowNewCustomerDialog(false);
                  resetForm();
                }}>
                  Avbryt
                </Button>
                <Button onClick={handleAddOrEditCustomer} disabled={submitting}>
                  {submitting ? 'Sparar...' : (editingCustomer ? 'Uppdatera' : 'Lägg till')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Totalt Kunder</CardTitle>
          <Users className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customers.length}</div>
          <p className="text-xs text-gray-600">Registrerade kunder</p>
        </CardContent>
      </Card>

      {/* Search */}
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

      {/* Customers List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Kundlista</h2>
        {filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "Inga kunder hittades" : "Inga kunder än"}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {searchTerm 
                  ? "Prova att söka på något annat"
                  : "Lägg till din första kund för att komma igång"
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setShowNewCustomerDialog(true)} 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Lägg till kund
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{customer.company_name}</CardTitle>
                      <CardDescription>
                        {customer.contact_person}
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Aktiv
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {customer.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{customer.phone}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{customer.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Redigera
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Detta kommer att ta bort kunden permanent. Denna åtgärd kan inte ångras.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Avbryt</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
                            Ta bort
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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