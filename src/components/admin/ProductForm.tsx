
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Loader } from "lucide-react";

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  categories: Array<{ id: string; name: string; }>;
  artists: Array<{ id: string; first_name: string; last_name: string; }>;
  isSubmitting: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  categories,
  artists,
  isSubmitting
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    stock_quantity: initialData?.stock_quantity || "",
    category_id: initialData?.category_id || "",
    size_specs: initialData?.size_specs || "",
    weight: initialData?.weight || "",
    shipping_options: initialData?.shipping_options || [],
    status: initialData?.status || "available",
    images: initialData?.images || []
  });

  const [newShippingOption, setNewShippingOption] = useState("");

  const productCategories = [
    { id: "vestuario", name: "Vestuário" },
    { id: "acessorios", name: "Acessórios" },
    { id: "pos-cuidado", name: "Pós-Cuidado" },
    { id: "materiais", name: "Materiais de Desenho" },
    { id: "decoracao", name: "Decoração" },
    { id: "livros", name: "Livros e Revistas" }
  ];

  const statusOptions = [
    { value: "available", label: "Disponível" },
    { value: "out_of_stock", label: "Esgotado" },
    { value: "featured", label: "Em Destaque" }
  ];

  const commonShippingOptions = [
    "Retirada na Loja",
    "Correios - PAC",
    "Correios - SEDEX",
    "Delivery Local",
    "Motoboy"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addShippingOption = (option: string) => {
    if (option.trim() && !formData.shipping_options.includes(option.trim())) {
      handleInputChange("shipping_options", [...formData.shipping_options, option.trim()]);
      setNewShippingOption("");
    }
  };

  const removeShippingOption = (index: number) => {
    const newOptions = [...formData.shipping_options];
    newOptions.splice(index, 1);
    handleInputChange("shipping_options", newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-black text-red-800 text-lg">Informações Básicas</h3>
            
            <div>
              <Label htmlFor="name" className="text-red-700 font-bold">Título do Produto</Label>
              <Input
                id="name"
                variant="tattoo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nome do produto"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-red-700 font-bold">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descrição detalhada do produto"
                className="border-red-200 focus:border-red-600 focus:ring-red-200"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price" className="text-red-700 font-bold">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  variant="tattoo"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock" className="text-red-700 font-bold">Quantidade em Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  variant="tattoo"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange("stock_quantity", parseInt(e.target.value) || 0)}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-red-700 font-bold">Categoria</Label>
                <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-red-200">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="status" className="text-red-700 font-bold">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-red-200">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Especificações Físicas */}
        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-black text-red-800 text-lg">Especificações Físicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size_specs" className="text-red-700 font-bold">Regras de Tamanho</Label>
                <Input
                  id="size_specs"
                  variant="tattoo"
                  value={formData.size_specs}
                  onChange={(e) => handleInputChange("size_specs", e.target.value)}
                  placeholder="Ex: Altura: 20cm, Largura: 15cm"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-red-700 font-bold">Peso (gramas)</Label>
                <Input
                  id="weight"
                  type="number"
                  variant="tattoo"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 250"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opções de Envio */}
        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-black text-red-800 text-lg">Opções de Envio</h3>
            
            <div>
              <Label className="text-red-700 font-bold">Opções de Envio Disponíveis</Label>
              <div className="flex gap-2 mt-2">
                <Select value={newShippingOption} onValueChange={setNewShippingOption}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-red-200 flex-1">
                    <SelectValue placeholder="Selecione uma opção de envio" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonShippingOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="tattooOutline"
                  size="icon"
                  onClick={() => addShippingOption(newShippingOption)}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.shipping_options.map((option: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-red-100 text-red-700 border-red-300">
                    {option}
                    <button
                      type="button"
                      onClick={() => removeShippingOption(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload de Imagens */}
        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-black text-red-800 text-lg">Imagens do Produto</h3>
            
            <div>
              <Label className="text-red-700 font-bold">Imagens do Produto</Label>
              <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-red-400" />
                <p className="mt-2 text-sm text-red-600">
                  Arraste e solte imagens aqui ou clique para selecionar
                </p>
                <p className="text-xs text-red-500 mt-1">
                  PNG, JPG, GIF até 10MB cada
                </p>
              </div>
              <p className="text-xs text-red-600 mt-2">
                Adicione múltiplas imagens do produto em diferentes ângulos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="tattoo"
            disabled={isSubmitting}
            className="shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Produto"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
