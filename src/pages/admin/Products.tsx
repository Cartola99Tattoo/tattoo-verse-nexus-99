
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
}

export default function Products() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Verificar se o usuário tem permissão para acessar o painel
  if (!user || !profile || (profile.role !== "admin" && profile.role !== "artista")) {
    return <Navigate to="/access-denied" />;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Buscar produtos
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("name");

        if (error) throw error;

        // Para cada produto, buscar o nome da categoria e do artista
        if (data) {
          const productsWithDetails = await Promise.all(
            data.map(async (product) => {
              // Buscar categoria
              let categoryName = "Sem categoria";
              if (product.category_id) {
                const { data: category } = await supabase
                  .from("product_categories")
                  .select("name")
                  .eq("id", product.category_id)
                  .single();
                
                if (category) {
                  categoryName = category.name;
                }
              }

              // Buscar artista
              let artistName = "Sem artista";
              if (product.artist_id) {
                const { data: artist } = await supabase
                  .from("artists")
                  .select("name")
                  .eq("id", product.artist_id)
                  .single();
                
                if (artist) {
                  artistName = artist.name;
                }
              }

              return {
                ...product,
                category_name: categoryName,
                artist_name: artistName
              };
            })
          );

          setProducts(productsWithDetails);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar a lista de produtos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
            <p className="text-gray-500">Gerencie os produtos da loja virtual</p>
          </div>
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
    </div>
  );
}
