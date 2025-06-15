
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, Edit, Trash, Loader, Palette, ShoppingBag, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProductService, getArtistsService } from "@/services/serviceFactory";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Product } from "@/services/interfaces/IProductService";
import TattooForm from "@/components/admin/TattooForm";
import ProductForm from "@/components/admin/ProductForm";
import ServiceForm from "@/components/admin/ServiceForm";

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
  const [isAddTattooDialogOpen, setIsAddTattooDialogOpen] = useState(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
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

  // Handler for adding a new tattoo
  const handleAddTattoo = async (data: any) => {
    try {
      setIsSubmitting(true);
      await productService.createProduct({ ...data, type: 'tattoo' });
      toast({
        title: "Tatuagem adicionada",
        description: "A tatuagem foi adicionada com sucesso.",
      });
      refresh();
      setIsAddTattooDialogOpen(false);
    } catch (error) {
      console.error("Error adding tattoo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a tatuagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for adding a new product
  const handleAddProduct = async (data: any) => {
    try {
      setIsSubmitting(true);
      await productService.createProduct({ ...data, type: 'product' });
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado com sucesso.",
      });
      refresh();
      setIsAddProductDialogOpen(false);
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

  // Handler for adding a new service
  const handleAddService = async (data: any) => {
    try {
      setIsSubmitting(true);
      await productService.createProduct({ ...data, type: 'service' });
      toast({
        title: "Serviço adicionado",
        description: "O serviço foi adicionado com sucesso.",
      });
      refresh();
      setIsAddServiceDialogOpen(false);
    } catch (error) {
      console.error("Error adding service:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o serviço. Tente novamente.",
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
        title: "Item atualizado",
        description: "O item foi atualizado com sucesso.",
      });
      refresh();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item. Tente novamente.",
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
        title: "Item excluído",
        description: "O item foi excluído com sucesso.",
      });
      refresh();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o item. Tente novamente.",
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
    <div className="p-6 bg-gradient-to-br from-gray-50 to-red-50 min-h-screen">
      {/* Header with gradient buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-black text-red-800 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Gestão de Produtos 99Tattoo
          </h1>
          <p className="text-gray-600 mt-2">Gerencie tatuagens, produtos e serviços</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="tattoo"
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
            onClick={() => setIsAddTattooDialogOpen(true)}
          >
            <Palette size={16} />
            <span>Adicionar Tattoo</span>
          </Button>
          <Button 
            variant="tattooSecondary"
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
            onClick={() => setIsAddProductDialogOpen(true)}
          >
            <ShoppingBag size={16} />
            <span>Adicionar Produto</span>
          </Button>
          <Button 
            variant="tattooBlack"
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
            onClick={() => setIsAddServiceDialogOpen(true)}
          >
            <Heart size={16} />
            <span>Adicionar Serviço</span>
          </Button>
        </div>
      </div>

      {/* Filter Card with enhanced styling */}
      <Card className="mb-6 shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-2 bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
          <CardTitle className="text-lg text-red-800 font-black">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-red-400" />
              <Input
                variant="tattoo"
                placeholder="Buscar itens..."
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
          <Loader className="mx-auto h-8 w-8 animate-spin text-red-400" />
          <p className="mt-4 text-red-600 font-medium">Carregando itens...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-lg font-black text-red-800">Nenhum item encontrado</h2>
          <p className="mt-2 text-red-600">
            {searchTerm ? "Tente ajustar seus filtros de busca." : "Comece adicionando seu primeiro item."}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-white shadow-xl border-red-200">
          <div className="grid grid-cols-12 border-b px-6 py-3 font-black text-sm text-red-700 bg-gradient-to-r from-red-50 to-red-100">
            <div className="col-span-5">Item</div>
            <div className="col-span-2">Categoria</div>
            <div className="col-span-1">Preço</div>
            <div className="col-span-2">Artista</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Ações</div>
          </div>

          {filteredProducts.map((product) => (
            <div key={product.id} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-red-50 border-b last:border-0 transition-all duration-300">
              <div className="col-span-5 flex items-center gap-3">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover shadow-md border border-red-200"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-md">
                    <Package size={16} className="text-red-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-black text-red-800">{product.name}</h3>
                  {product.description && (
                    <p className="text-xs text-red-600 truncate max-w-xs">
                      {product.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-2 text-sm font-medium text-red-700">{product.category_name}</div>
              <div className="col-span-1 text-sm font-black text-red-800">{formatCurrency(product.price)}</div>
              <div className="col-span-2 text-sm font-medium text-red-700">{product.artist_name}</div>
              <div className="col-span-1">{getStatusBadge(product.status)}</div>
              <div className="col-span-1 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-700"
                  onClick={() => openDeleteDialog(product)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Tattoo Dialog */}
      <Dialog open={isAddTattooDialogOpen} onOpenChange={setIsAddTattooDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader>
            <DialogTitle className="text-red-800 font-black">Adicionar Nova Tatuagem</DialogTitle>
            <DialogDescription className="text-red-600">
              Preencha os detalhes da nova tatuagem/design abaixo.
            </DialogDescription>
          </DialogHeader>
          <TattooForm
            onSubmit={handleAddTattoo}
            onCancel={() => setIsAddTattooDialogOpen(false)}
            categories={categories}
            artists={artists}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader>
            <DialogTitle className="text-red-800 font-black">Adicionar Novo Produto</DialogTitle>
            <DialogDescription className="text-red-600">
              Preencha os detalhes do novo produto abaixo.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setIsAddProductDialogOpen(false)}
            categories={categories}
            artists={artists}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Add Service Dialog */}
      <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader>
            <DialogTitle className="text-red-800 font-black">Adicionar Novo Serviço</DialogTitle>
            <DialogDescription className="text-red-600">
              Preencha os detalhes do novo serviço abaixo.
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            onSubmit={handleAddService}
            onCancel={() => setIsAddServiceDialogOpen(false)}
            categories={categories}
            artists={artists}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader>
            <DialogTitle className="text-red-800 font-black">Editar Item</DialogTitle>
            <DialogDescription className="text-red-600">
              Atualize os detalhes do item abaixo.
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
        <AlertDialogContent className="bg-gradient-to-br from-white to-red-50 border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-800 font-black">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-red-600">
              Tem certeza que deseja excluir o item "{currentProduct?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting} className="border-red-200 text-red-600 hover:bg-red-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
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
