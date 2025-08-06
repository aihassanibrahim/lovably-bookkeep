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
import { Plus, Edit, Trash2, Tag, DollarSign, Package, Image } from 'lucide-react';
import { useBizPal } from "@/context/BizPalContext";
import { testCreateProduct, checkProductsTable, detailedDatabaseTest } from "@/lib/testDatabase";

const Products = () => {
  // Use global state instead of local state
  const { products, addProduct, updateProduct, deleteProduct, stats } = useBizPal();
  
  const [showNewProductDialog, setShowNewProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    product_number: "",
    name: "",
    category: "",
    price: "",
    cost: "",
    description: ""
  });

  const defaultCategories = [
    "Kläder", "Accessoarer", "Smycken", "Keramik", "Textil", 
    "Konsthantverk", "Hemdekor", "Leksaker", "Konst", "Övrigt"
  ];

  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState("");

  const handleAddOrEditProduct = () => {
    // Validate required fields
    if (!newProduct.name.trim()) {
      alert('Produktnamn är obligatoriskt');
      return;
    }
    
    if (!newProduct.product_number.trim()) {
      alert('Produktnummer är obligatoriskt');
      return;
    }

    if (editingProduct) {
      updateProduct({ ...newProduct, id: editingProduct.id });
      setEditingProduct(null);
    } else {
      // Generate product number if not provided
      const productData = {
        ...newProduct,
        product_number: newProduct.product_number || `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        price: parseFloat(newProduct.price) || 0,
        cost: parseFloat(newProduct.cost) || 0
      };
      
      console.log('Creating product with data:', productData);
      addProduct(productData);
    }
    
    setShowNewProductDialog(false);
    resetForm();
  };

  const handleEditProduct = (product) => {
    setNewProduct(product);
    setEditingProduct(product);
    setShowNewProductDialog(true);
  };

  const handleDeleteProduct = (productId) => {
    deleteProduct(productId);
  };

  const resetForm = () => {
    setNewProduct({
      product_number: "",
      name: "",
      category: "",
      price: "",
      cost: "",
      description: ""
    });
  };

  const addNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewProduct({...newProduct, category: newCategory});
      setNewCategory("");
    }
  };

  const averagePrice = products.length > 0 
    ? Math.round(products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length)
    : 0;

  // Filter
  const [categoryFilter, setCategoryFilter] = useState("all");
  const filteredProducts = categoryFilter === "all" 
    ? products 
    : products.filter(product => product.category === categoryFilter);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Produkter</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Hantera din produktkatalog</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              detailedDatabaseTest().then(result => {
                alert(result);
              });
            }}
          >
            Test Database
          </Button>
          <Dialog open={showNewProductDialog} onOpenChange={setShowNewProductDialog}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                <Plus className="w-4 h-4 mr-2" />
                {editingProduct ? "Redigera Produkt" : "Ny Produkt"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Redigera produkt" : "Lägg till ny produkt"}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct ? "Uppdatera produktinformation" : "Skapa en ny produkt för din katalog"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Grundinfo</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Produktnummer *</Label>
                      <Input 
                        value={newProduct.product_number}
                        onChange={(e) => setNewProduct({...newProduct, product_number: e.target.value})}
                        placeholder="PROD-001"
                        required
                      />
                    </div>
                    <div>
                      <Label>Produktnamn *</Label>
                      <Input 
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="T-shirt, Halsband, Keramikskål..."
                        required
                      />
                    </div>
                    <div>
                      <Label>Kategori</Label>
                      <div className="flex gap-2">
                        <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
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
                      <Label>Pris (SEK)</Label>
                      <Input 
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="250"
                      />
                    </div>
                    <div>
                      <Label>Kostnad (SEK)</Label>
                      <Input 
                        type="number"
                        value={newProduct.cost}
                        onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                        placeholder="150"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div>
                    <Label>Beskrivning</Label>
                    <Textarea 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Beskrivning av produkten, dess egenskaper och användning..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setShowNewProductDialog(false);
                    setEditingProduct(null);
                    resetForm();
                  }}>
                    Avbryt
                  </Button>
                  <Button onClick={handleAddOrEditProduct} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                    {editingProduct ? "Uppdatera" : "Lägg till"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards - Now using real data from context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Antal produkter</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.products.total}</div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Genomsnittspris</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{averagePrice.toLocaleString()} SEK</div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">Kategorier</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.products.categories}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-4">
        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">Filtrera efter kategori:</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla kategorier</SelectItem>
            {Array.from(new Set(products.map(p => p.category))).filter(Boolean).map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Visar {filteredProducts.length} av {products.length} produkter
        </span>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Produktkatalog</h2>
        {filteredProducts.length === 0 ? (
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {categoryFilter === "all" ? "Inga produkter ännu" : `Inga produkter i kategorin "${categoryFilter}"`}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                {categoryFilter === "all"
                  ? "Lägg till din första produkt för att komma igång med katalogen"
                  : "Prova att ändra kategorifiltret eller lägg till en ny produkt"
                }
              </p>
              {categoryFilter === "all" && (
                <Button onClick={() => setShowNewProductDialog(true)} className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Lägg till produkt
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{product.name}</CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">{product.category}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
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
                  {product.imageUrl && (
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="max-w-full max-h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <Image className="w-8 h-8 mb-2" />
                        <span className="text-sm">Ingen bild</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {parseFloat(product.price || 0).toLocaleString()} SEK
                    </p>
                    {product.cost && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Kostnad: {parseFloat(product.cost || 0).toLocaleString()} SEK
                      </p>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  {product.category && (
                    <div>
                      <h4 className="font-medium text-sm mb-1 text-gray-900 dark:text-gray-100">Kategori</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                    </div>
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

export default Products; 