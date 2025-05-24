import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, Edit, Trash, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProductService, getArtistsService } from "@/services/serviceFactory";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProductForm from "@/components/admin/ProductForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: string[];
  category_id: string | null;
  artist_id: string | null;
  status: string;
  category_name?: string;
  artist_name?: string;
  category?: string;
  profiles?: any;
  average_time?: string;
  sizes?: string[];
  body_locations?: string[];
  style_tags?: string[];
}

interface Category {
  id: string;
  name: string;
}

interface Artist {
  id: string;
  first_name: string;
  last_name: string;
}

export default function Products() {
  const { user, profile } = useAuth();
  const productService = getProductService();
  const artistsService = getArtistsService();
  
  // State for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch products with the service
  const { data: rawProducts = [], loading, refresh } = useDataQuery<Product[]>(
    () => productService.fetchProducts(),
    []
  );

  // Fetch categories (simplified for demo)
  const { data: categories = [] } = useDataQuery<Category[]>(
    () => Promise.resolve([
      { id: "cat1", name: "Blackwork" },
      { id: "cat2", name: "Tradicional" },
      { id: "cat3", name: "Realista" },
      { id: "cat4", name: "Old School" },
      { id: "cat5", name: "New School" },
    ]),
    []
  );

  // Fetch artists - Fix the type mismatch and null handling
  const { data: artistsData } = useDataQuery<{ artists: Artist[]; total: number; totalPages: number; }>(
    () => artistsService.fetchArtists(),
    []
  );
  
  // Ensure artists is always an array, even if artistsData is null
  const artists = artistsData?.artists || [];

  // Transform raw products to add category name and artist name
  // Ensure products is always an array, even if rawProducts is null
  const products: Product[] = (rawProducts || []).map(product => ({
    ...product,
    category_name: product.category || "Sem categoria",
    artist_name: product.profiles ? 
      `${product.profiles.first_name || ''} ${product.profiles.last_name || ''}`.trim() || "Sem artista" : 
      "Sem artista"
  }));

  // Filtrar produtos com base no termo de pesquisa
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      product.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.artist_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'disponível':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Disponível</Badge>;
      case 'unavailable':
      case 'indisponível':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Indisponível</Badge>;
      case 'limited':
      case 'limitado':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Limitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handler for adding a new product
  const handleAddProduct = async (data: any) => {
    try {
      setIsSubmitting(true);
      await productService.createProduct(data);
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado com sucesso.",
      });
      refresh();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for editing a product
  const handleEditProduct = async (data: any) => {
    if (!currentProduct) return;
    
    try {
      setIsSubmitting(true);
      await productService.updateProduct(currentProduct.id, data);
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso.",
      });
      refresh();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for deleting a product
  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    
    try {
      setIsSubmitting(true);
      await productService.deleteProduct(currentProduct.id);
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      });
      refresh();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open edit dialog with product data
  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1"></div>
        <Button 
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus size={16} />
          <span>Novo Produto</span>
        </Button>
      </div>

      <Card className="mb-6 shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="text-lg text-gray-800">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <Loader className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-4 text-gray-500">Carregando produtos...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium">Nenhum produto encontrado</h2>
          <p className="mt-2 text-gray-500">
            {searchTerm ? "Tente ajustar seus filtros de busca." : "Comece adicionando seu primeiro produto."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-white shadow-xl">
          <div className="grid grid-cols-12 border-b px-6 py-3 font-medium text-sm text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="col-span-5">Produto</div>
            <div className="col-span-2">Categoria</div>
            <div className="col-span-1">Preço</div>
            <div className="col-span-2">Artista</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Ações</div>
          </div>

          {filteredProducts.map((product) => (
            <div key={product.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50 border-b last:border-0">
              <div className="col-span-5 flex items-center gap-3">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                    <Package size={16} className="text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  {product.description && (
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-2 text-sm">{product.category_name}</div>
              <div className="col-span-1 text-sm font-medium">{formatCurrency(product.price)}</div>
              <div className="col-span-2 text-sm">{product.artist_name}</div>
              <div className="col-span-1">{getStatusBadge(product.status)}</div>
              <div className="col-span-1 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => openDeleteDialog(product)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Produto</DialogTitle>
            <DialogDescription>
              Preencha os detalhes do novo produto abaixo.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setIsAddDialogOpen(false)}
            categories={categories}
            artists={artists}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Atualize os detalhes do produto abaixo.
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <ProductForm
              initialData={{
                name: currentProduct.name,
                description: currentProduct.description || "",
                price: currentProduct.price,
                category_id: currentProduct.category_id || "",
                artist_id: currentProduct.artist_id || "",
                status: currentProduct.status,
                images: currentProduct.images || [],
                average_time: currentProduct.average_time || "",
                sizes: currentProduct.sizes || [],
                body_locations: currentProduct.body_locations || [],
                style_tags: currentProduct.style_tags || []
              }}
              onSubmit={handleEditProduct}
              onCancel={() => setIsEditDialogOpen(false)}
              categories={categories}
              artists={artists}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{currentProduct?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
