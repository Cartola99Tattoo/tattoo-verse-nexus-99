
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Star, Package, TrendingUp } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  isHighlighted?: boolean;
  isNew?: boolean;
  category: string;
  image?: string;
}

interface ProductHighlightManagerProps {
  products: Product[];
  onUpdateHighlight: (productId: string, isHighlighted: boolean) => void;
  onUpdateNew: (productId: string, isNew: boolean) => void;
}

const ProductHighlightManager = ({ 
  products, 
  onUpdateHighlight, 
  onUpdateNew 
}: ProductHighlightManagerProps) => {
  const [filter, setFilter] = useState<"all" | "highlighted" | "new">("all");

  const filteredProducts = products.filter(product => {
    if (filter === "highlighted") return product.isHighlighted;
    if (filter === "new") return product.isNew;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-600" />
          Produtos em Destaque
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            <Package className="h-4 w-4 mr-1" />
            Todos ({products.length})
          </Button>
          <Button
            variant={filter === "highlighted" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("highlighted")}
          >
            <Star className="h-4 w-4 mr-1" />
            Em Destaque ({products.filter(p => p.isHighlighted).length})
          </Button>
          <Button
            variant={filter === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("new")}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Novidades ({products.filter(p => p.isNew).length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">{product.category}</span>
                    <span className="text-sm font-semibold">
                      R$ {product.price.toFixed(2)}
                    </span>
                    {product.isHighlighted && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                        <Star className="h-3 w-3 mr-1" />
                        Destaque
                      </Badge>
                    )}
                    {product.isNew && (
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Novo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`highlight-${product.id}`} className="text-sm">
                    Destaque
                  </Label>
                  <Switch
                    id={`highlight-${product.id}`}
                    checked={product.isHighlighted || false}
                    onCheckedChange={(checked) => onUpdateHighlight(product.id, checked)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor={`new-${product.id}`} className="text-sm">
                    Novidade
                  </Label>
                  <Switch
                    id={`new-${product.id}`}
                    checked={product.isNew || false}
                    onCheckedChange={(checked) => onUpdateNew(product.id, checked)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum produto encontrado para este filtro
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductHighlightManager;
