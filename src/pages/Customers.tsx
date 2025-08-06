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
  MapPin,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useBizPal } from "@/context/BizPalContext";
import { useAuth } from "@/components/auth/AuthProvider";

const Customers = () => {
  // Use global state instead of local state
  const { customers, addCustomer, updateCustomer, deleteCustomer, loading } = useBizPal();
  const { user } = useAuth();

  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customer_number: "",
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    org_number: ""
  });

  const handleAddOrEditCustomer = async () => {
    if (!user) return;
    
    setSubmitting(true);
    
    try {
      if (editingCustomer) {
        await updateCustomer({
          ...newCustomer,
          id: editingCustomer.id
        });
        setEditingCustomer(null);
      } else {
        await addCustomer(newCustomer);
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
      customer_number: customer.customer_number || '',
      company_name: customer.company_name || '',
      contact_person: customer.contact_person || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      org_number: customer.org_number || ''
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
      customer_number: "",
      company_name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      org_number: ""
    });
    setEditingCustomer(null);
  };

  // Calculate stats from global state
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.is_active).length;

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone?.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || 
                         (selectedStatus === "active" && customer.is_active) ||
                         (selectedStatus === "inactive" && !customer.is_active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Laddar kunder...</p>
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
            <Button className="bg-blue-600 hover:bg-blue-700">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Kundnummer *</Label>
                  <Input 
                    value={newCustomer.customer_number}
                    onChange={(e) => setNewCustomer({...newCustomer, customer_number: e.target.value})}
                    placeholder="KUND-001"
                    required
                  />
                </div>
                <div>
                  <Label>Företagsnamn *</Label>
                  <Input 
                    value={newCustomer.company_name}
                    onChange={(e) => setNewCustomer({...newCustomer, company_name: e.target.value})}
                    placeholder="Anna Andersson AB"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Kontaktperson</Label>
                <Input 
                  value={newCustomer.contact_person}
                  onChange={(e) => setNewCustomer({...newCustomer, contact_person: e.target.value})}
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
                <Label>Organisationsnummer</Label>
                <Input 
                  value={newCustomer.org_number}
                  onChange={(e) => setNewCustomer({...newCustomer, org_number: e.target.value})}
                  placeholder="556123-4567"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>
                  Avbryt
                </Button>
                <Button onClick={handleAddOrEditCustomer} disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                  {submitting ? 'Sparar...' : (editingCustomer ? 'Uppdatera' : 'Lägg till')}
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
            <CardTitle className="text-sm font-medium">Kundnummer</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inaktiva Kunder</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalCustomers - activeCustomers}</div>
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
            <option value="all">Alla kunder</option>
            <option value="active">Aktiva</option>
            <option value="inactive">Inaktiva</option>
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
                      <CardTitle className="text-lg">{customer.company_name}</CardTitle>
                      <CardDescription>
                        {customer.customer_number} • {customer.contact_person}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={customer.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {customer.is_active ? "Aktiv" : "Inaktiv"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{customer.email || "Ingen e-post"}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">{customer.phone || "Inget telefonnummer"}</span>
                    </div>
                    {customer.address && (
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-gray-600">{customer.address}</span>
                      </div>
                    )}
                    {customer.org_number && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 mr-2">Org.nr:</span>
                        <span className="text-gray-600">{customer.org_number}</span>
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