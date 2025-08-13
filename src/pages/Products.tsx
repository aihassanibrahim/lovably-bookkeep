import React, { useState } from 'react';
/**
 * MAJOR CHANGE: Simplified Products page to work with existing 'products' table
 * - Uses existing schema with product_number, price, cost, is_active
 * - Removed complex inventory management features
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Package, DollarSign, Tag } from 'lucide-react';
import { useBizPal } from "@/context/BizPalContext";
import { toast } from 'sonner';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useBizPal();
  
  const [showNewProductDialog, setShowNewProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    cost: "",
    description: "",
    sku: ""
  });

  // Simplified categories for small business
  const defaultCategories = [
    "Produkter", "Tjänster", "Material", "Tillbehör", "Övrigt"
  ];

  const handleAddOrEditProduct = async () => {
    // Validation
    if (!newProduct.name.trim()) {
      toast.error('Produktnamn krävs');
      return;
    }
    
    if (!newProduct.price || parseFloat(newProduct.price) < 0) {
      toast.error('Giltigt pris krävs');
      return;
    }

    setSubmitting(true);
    
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0,
        cost: parseFloat(newProduct.cost) || 0,
        product_number: newProduct.sku || `PROD-${Date.now()}`
      };

      if (editingProduct) {
        await updateProduct({ ...productData, id: editingProduct.id });
        setEditingProduct(null);
      } else {
        await addProduct(productData);
      }
      
      setShowNewProductDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      cost: product.cost?.toString() || "",
      description: product.description || "",
      sku: product.product_number || ""
    });
    setEditingProduct(product);
    setShowNewProductDialog(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      category: "",
      price: "",
      cost: "",
      description: "",
      sku: ""
    });
    setEditingProduct(null);
  };

  const filteredProducts = categoryFilter === "all" 
    ? products 
    : products.filter(product => product.category === categoryFilter);

  const averagePrice = products.length > 0 
    ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length
    : 0;

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Laddar produkter...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Produkter</h1>
          <p className="text-gray-600 mt-1">Hantera din produktkatalog</p>
        </div>
        
        <Dialog open={showNewProductDialog} onOpenChange={setShowNewProductDialog}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Ny Produkt
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Redigera produkt" : "Lägg till ny produkt"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? "Uppdatera produktinformation" : "Skapa en ny produkt för din katalog"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label>Produktnamn *</Label>
                <Input 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="T-shirt, Halsband, Keramikskål..."
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Kategori</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>SKU/Artikelnummer</Label>
                  <Input 
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    placeholder="PROD-001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pris (SEK) *</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="250"
                    required
                  />
                </div>
                <div>
                  <Label>Kostnad (SEK)</Label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={newProduct.cost}
                    onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                    placeholder="150"
                  />
                </div>
              </div>

              <div>
                <Label>Beskrivning</Label>
                <Textarea 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Beskrivning av produkten..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowNewProductDialog(false);
                  resetForm();
                }}>
                  Avbryt
                </Button>
                <Button onClick={handleAddOrEditProduct} disabled={submitting}>
                  {submitting ? 'Sparar...' : (editingProduct ? "Uppdatera" : "Lägg till")}
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
            <CardTitle className="text-sm font-medium">Antal Produkter</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genomsnittspris</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(averagePrice)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategorier</CardTitle>
            <Tag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-4">
        <Label className="text-sm font-medium">Filtrera efter kategori:</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla kategorier</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Produktkatalog</h2>
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {categoryFilter === "all" ? "Inga produkter ännu" : `Inga produkter i kategorin "${categoryFilter}"`}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {categoryFilter === "all"
                  ? "Lägg till din första produkt för att komma igång"
                  : "Prova att ändra kategorifiltret eller lägg till en ny produkt"
                }
              </p>
              <Button 
                onClick={() => setShowNewProductDialog(true)} 
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Lägg till produkt
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>
                        {product.category} {product.product_number && `• ${product.product_number}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ta bort produkt</AlertDialogTitle>
                            <AlertDialogDescription>
                              Är du säker på att du vill ta bort produkten <strong>{product.name}</strong>? 
                              Denna åtgärd kan inte ångras.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-red-600 hover:bg-red-700"
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
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(parseFloat(product.price || 0))}
                    </p>
                    {product.cost && (
                      <p className="text-sm text-gray-600">
                        Kostnad: {formatCurrency(parseFloat(product.cost || 0))}
                      </p>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  {product.category && (
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK'
  }).format(amount);
};

export default Products;