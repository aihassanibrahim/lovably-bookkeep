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
import { Plus, Edit, Trash2, Tag, DollarSign, Package, Image } from 'lucide-react';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct, stats } = useBizPal();
  const [showNewProductDialog, setShowNewProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    basePrice: "",
    description: "",
    materials: "",
    sizes: [],
    colors: [],
    variations: "",
    customizable: false,
    productionTime: "",
    imageUrl: ""
  });

  const defaultCategories = [
    "Kläder", "Accessoarer", "Smycken", "Keramik", "Textil", 
    "Konsthantverk", "Hemdekor", "Leksaker", "Konst", "Övrigt"
  ];

  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState("");

  const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const defaultColors = [
    "Svart", "Vit", "Grå", "Brun", "Beige", "Röd", "Rosa", 
    "Orange", "Gul", "Grön", "Blå", "Lila", "Silver", "Guld"
  ];

  const addOrEditProduct = () => {
    if (editingProduct) {
      updateProduct({ ...newProduct, id: editingProduct.id });
      setEditingProduct(null);
    } else {
      const nextId = Math.max(0, ...products.map(p => p.id)) + 1;
      addProduct({ ...newProduct, id: nextId });
    }
    
    setShowNewProductDialog(false);
    setNewProduct({
      name: "",
      category: "",
      basePrice: "",
      description: "",
      materials: "",
      sizes: [],
      colors: [],
      variations: "",
      customizable: false,
      productionTime: "",
      imageUrl: ""
    });
  };

  const editProduct = (product) => {
    setNewProduct(product);
    setEditingProduct(product);
    setShowNewProductDialog(true);
  };

  const deleteProduct = (productId) => {
    deleteProduct(productId);
  };

  const toggleSize = (size) => {
    setNewProduct({
      ...newProduct,
      sizes: newProduct.sizes.includes(size)
        ? newProduct.sizes.filter(s => s !== size)
        : [...newProduct.sizes, size]
    });
  };

  const toggleColor = (color) => {
    setNewProduct({
      ...newProduct,
      colors: newProduct.colors.includes(color)
        ? newProduct.colors.filter(c => c !== color)
        : [...newProduct.colors, color]
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
    ? Math.round(products.reduce((sum, p) => sum + (parseFloat(p.basePrice) || 0), 0) / products.length)
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produkter</h1>
          <p className="text-gray-600 mt-1">Hantera din produktkatalog</p>
        </div>
        
        <Dialog open={showNewProductDialog} onOpenChange={setShowNewProductDialog}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Ny Produkt
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
                    <Label>Produktnamn</Label>
                    <Input 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="T-shirt, Halsband, Keramikskål..."
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
                    <Label>Grundpris (SEK)</Label>
                    <Input 
                      type="number"
                      value={newProduct.basePrice}
                      onChange={(e) => setNewProduct({...newProduct, basePrice: e.target.value})}
                      placeholder="250"
                    />
                  </div>
                  <div>
                    <Label>Produktionstid (dagar)</Label>
                    <Input 
                      type="number"
                      value={newProduct.productionTime}
                      onChange={(e) => setNewProduct({...newProduct, productionTime: e.target.value})}
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>

              {/* Description & Materials */}
              <div className="space-y-4">
                <div>
                  <Label>Beskrivning</Label>
                  <Textarea 
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Beskrivning av produkten, dess egenskaper och användning..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Material</Label>
                    <Input 
                      value={newProduct.materials}
                      onChange={(e) => setNewProduct({...newProduct, materials: e.target.value})}
                      placeholder="Bomull, silver, keramik, trä..."
                    />
                  </div>
                  <div>
                    <Label>Variationer</Label>
                    <Input 
                      value={newProduct.variations}
                      onChange={(e) => setNewProduct({...newProduct, variations: e.target.value})}
                      placeholder="Mönster, textur, finish..."
                    />
                  </div>
                </div>
                <div>
                  <Label>Bild URL (valfritt)</Label>
                  <Input 
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <Label>Tillgängliga storlekar (om tillämpligt)</Label>
                <div className="flex flex-wrap gap-2">
                  {defaultSizes.map(size => (
                    <Button
                      key={size}
                      type="button"
                      variant={newProduct.sizes.includes(size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <Label>Tillgängliga färger</Label>
                <div className="flex flex-wrap gap-2">
                  {defaultColors.map(color => (
                    <Button
                      key={color}
                      type="button"
                      variant={newProduct.colors.includes(color) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Customizable */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="customizable"
                  checked={newProduct.customizable}
                  onChange={(e) => setNewProduct({...newProduct, customizable: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="customizable">Kan anpassas (personlig gravyr, specialfärger, etc.)</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowNewProductDialog(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: "",
                    category: "",
                    basePrice: "",
                    description: "",
                    materials: "",
                    sizes: [],
                    colors: [],
                    variations: "",
                    customizable: false,
                    productionTime: "",
                    imageUrl: ""
                  });
                }}>
                  Avbryt
                </Button>
                <Button onClick={addOrEditProduct} className="bg-indigo-600 hover:bg-indigo-700">
                  {editingProduct ? "Uppdatera" : "Lägg till"}
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
            <CardTitle className="text-sm font-medium">Antal produkter</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genomsnittspris</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averagePrice.toLocaleString()} SEK</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategorier</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.products.categories}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Produktkatalog</h2>
        {products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Inga produkter ännu</h3>
              <p className="text-gray-500 text-center mb-4">
                Lägg till din första produkt för att komma igång med katalogen
              </p>
              <Button onClick={() => setShowNewProductDialog(true)} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Lägg till produkt
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {product.imageUrl && (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="max-w-full max-h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden flex-col items-center justify-center text-gray-500">
                        <Image className="w-8 h-8 mb-2" />
                        <span className="text-sm">Ingen bild</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">
                      {parseFloat(product.basePrice).toLocaleString()} SEK
                    </p>
                    {product.productionTime && (
                      <p className="text-sm text-gray-600">
                        Produktionstid: {product.productionTime} dagar
                      </p>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {product.description}
                    </p>
                  )}

                  {product.materials && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Material</h4>
                      <p className="text-sm text-gray-600">{product.materials}</p>
                    </div>
                  )}

                  {product.variations && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Variationer</h4>
                      <p className="text-sm text-gray-600">{product.variations}</p>
                    </div>
                  )}

                  {product.sizes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Storlekar</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map(size => (
                          <Badge key={size} variant="outline" className="text-xs">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.colors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Färger</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.colors.map(color => (
                          <Badge key={color} variant="outline" className="text-xs">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.customizable && (
                    <Badge className="bg-green-100 text-green-800">
                      Kan anpassas
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

export default Products; 