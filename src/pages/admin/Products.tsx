
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProductService } from "@/services/serviceFactory";
import AdminLayout from "@/components/admin/AdminLayout";

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
}

export default function Products() {
  const { user, profile } = useAuth();
  const productService = getProductService();
  const [searchTerm, setSearchTerm] = useState("");

  // Use the product service to fetch products
  const { data: rawProducts = [], loading } = useDataQuery<Product[]>(
    () => productService.fetchProducts(),
    []
  );

  // Verificar se o usuário tem permissão para acessar o painel
  if (!user || !profile || (profile.role !== "admin" && profile.role !== "artista")) {
    return <Navigate to="/access-denied" />;
  }

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

  return (
    <AdminLayout 
      title="Produtos" 
      description="Gerencie os produtos da loja virtual"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1"></div>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span>Novo Produto</span>
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filtros</CardTitle>
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
              {/* Filtros adicionais podem ser adicionados aqui */}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-center py-8">Carregando produtos...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-medium">Nenhum produto encontrado</h2>
            <p className="mt-2 text-gray-500">
              {searchTerm ? "Tente ajustar seus filtros de busca." : "Comece adicionando seu primeiro produto."}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border bg-white">
            <div className="grid grid-cols-12 border-b px-6 py-3 font-medium text-sm text-gray-500">
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
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
