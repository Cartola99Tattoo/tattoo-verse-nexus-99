import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, Edit, Trash, Loader, Palette, ShoppingBag, Heart, Image as ImageIcon, TrendingUp, TrendingDown, Star, BarChart3 } from "lucide-react";
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

  const getItemTypeIcon = (item: Product) => {
    // Determine type based on item properties
    if (item.style_tags || item.body_locations || item.average_time) {
      return <Palette className="h-4 w-4 text-red-600" />;
    } else if (item.category_id?.includes('digital') || item.category_id?.includes('apoio')) {
      return <Heart className="h-4 w-4 text-purple-600" />;
    } else {
      return <ShoppingBag className="h-4 w-4 text-blue-600" />;
    }
  };

  const getItemTypeBadge = (item: Product) => {
    if (item.style_tags || item.body_locations || item.average_time) {
      return <Badge className="bg-red-100 text-red-800 border-red-300">Tatuagem</Badge>;
    } else if (item.category_id?.includes('digital') || item.category_id?.includes('apoio')) {
      return <Badge className="bg-purple-100 text-purple-800 border-purple-300">Serviço</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Produto</Badge>;
    }
  };

  // Mock dashboard data - in a real app, this would come from the service
  const dashboardStats = {
    totalTattoos: products.filter(p => p.style_tags || p.body_locations || p.average_time).length,
    totalProducts: products.filter(p => !p.style_tags && !p.body_locations && !p.average_time && !p.category_id?.includes('digital')).length,
    totalServices: products.filter(p => p.category_id?.includes('digital') || p.category_id?.includes('apoio')).length,
    availableTattoos: products.filter(p => (p.style_tags || p.body_locations) && p.status === 'available').length,
    soldTattoos: products.filter(p => (p.style_tags || p.body_locations) && p.status === 'unavailable').length,
    popularTattoo: products.find(p => p.style_tags && p.name.includes('Tradicional')) || products[0],
    topProduct: products.find(p => !p.style_tags && p.name.includes('Produto')) || products[0],
    activeServices: products.filter(p => p.category_id?.includes('digital') && p.status === 'available').length
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

      {/* Dashboard Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-black text-red-800 mb-4">Dashboard de Produtos</h2>
        
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card variant="tattooRed" className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Total de Tatuagens</CardTitle>
              <Palette className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-red-800">{dashboardStats.totalTattoos}</div>
              <p className="text-xs text-red-500">
                {dashboardStats.availableTattoos} disponíveis, {dashboardStats.soldTattoos} vendidas
              </p>
            </CardContent>
          </Card>

          <Card variant="tattooRed" className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Total de Produtos</CardTitle>
              <ShoppingBag className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-red-800">{dashboardStats.totalProducts}</div>
              <p className="text-xs text-red-500">
                Merchandising e cuidados
              </p>
            </CardContent>
          </Card>

          <Card variant="tattooRed" className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Total de Serviços</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-red-800">{dashboardStats.totalServices}</div>
              <p className="text-xs text-red-500">
                {dashboardStats.activeServices} ativos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Insights Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card variant="tattooRed" className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-red-800 font-black flex items-center gap-2">
                <Star className="h-5 w-5" />
                Tatuagem Popular
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardStats.popularTattoo && (
                <div className="space-y-2">
                  <p className="font-bold text-red-800">{dashboardStats.popularTattoo.name}</p>
                  <p className="text-sm text-red-600">{formatCurrency(dashboardStats.popularTattoo.price)}</p>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    {dashboardStats.popularTattoo.status === 'available' ? 'Disponível' : 'Vendida'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="tattooRed" className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-red-800 font-black flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Produto Destaque
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardStats.topProduct && (
                <div className="space-y-2">
                  <p className="font-bold text-red-800">{dashboardStats.topProduct.name}</p>
                  <p className="text-sm text-red-600">{formatCurrency(dashboardStats.topProduct.price)}</p>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    Mais vendido
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <Card variant="tattooRed" className="hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-red-800 font-black flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Insights Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-xl font-black text-red-800">{products.length}</div>
                <p className="text-sm text-red-600">Total de Itens</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-green-600">
                  {products.filter(p => p.status === 'available').length}
                </div>
                <p className="text-sm text-red-600">Itens Disponíveis</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-yellow-600">
                  {products.filter(p => p.status === 'limited').length}
                </div>
                <p className="text-sm text-red-600">Itens Limitados</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
        /* Cards Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="group cursor-pointer shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105"
              onClick={() => openEditDialog(product)}
            >
              <CardHeader className="p-0">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden rounded-t-lg bg-gradient-to-br from-red-100 to-red-200">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-16 w-16 text-red-400" />
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    {getItemTypeBadge(product)}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(product.status)}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditDialog(product);
                      }}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(product);
                      }}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  {/* Title and Type Icon */}
                  <div className="flex items-start justify-between">
                    <h3 className="font-black text-red-800 text-lg leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    {getItemTypeIcon(product)}
                  </div>
                  
                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-red-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  {/* Category and Artist */}
                  <div className="space-y-1">
                    <p className="text-xs text-red-500">
                      <strong>Categoria:</strong> {product.category_name}
                    </p>
                    <p className="text-xs text-red-500">
                      <strong>Artista:</strong> {product.artist_name}
                    </p>
                  </div>
                  
                  {/* Price */}
                  <div className="pt-2 border-t border-red-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-red-800">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
