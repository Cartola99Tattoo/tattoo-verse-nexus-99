
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Loader } from "lucide-react";

interface TattooFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  categories: Array<{ id: string; name: string; }>;
  artists: Array<{ id: string; first_name: string; last_name: string; }>;
  isSubmitting: boolean;
}

export default function TattooForm({
  initialData,
  onSubmit,
  onCancel,
  categories,
  artists,
  isSubmitting
}: TattooFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    average_time: initialData?.average_time || "",
    category_id: initialData?.category_id || "",
    artist_id: initialData?.artist_id || "",
    status: initialData?.status || "available",
    sizes: initialData?.sizes || [],
    body_locations: initialData?.body_locations || [],
    style_tags: initialData?.style_tags || [],
    images: initialData?.images || [],
    notes: initialData?.notes || ""
  });

  const [newSize, setNewSize] = useState("");
  const [newBodyLocation, setNewBodyLocation] = useState("");
  const [newStyleTag, setNewStyleTag] = useState("");

  const tattooCategories = [
    { id: "flash", name: "Flash" },
    { id: "personalizado", name: "Personalizado" },
    { id: "disponivel", name: "Disponível para Agendamento" },
    { id: "blackwork", name: "Blackwork" },
    { id: "realismo", name: "Realismo" },
    { id: "tradicional", name: "Tradicional" },
    { id: "fineline", name: "Fineline" },
    { id: "oldschool", name: "Old School" },
    { id: "newschool", name: "New School" },
    { id: "geometrico", name: "Geométrico" }
  ];

  const statusOptions = [
    { value: "available", label: "Disponível" },
    { value: "sold", label: "Vendida/Fechada" },
    { value: "featured", label: "Em Destaque" },
    { value: "draft", label: "Rascunho" }
  ];

  const commonBodyLocations = [
    "Braço", "Perna", "Costas", "Peito", "Pescoço", "Torso", "Ombro", 
    "Punho", "Tornozelo", "Costela", "Nuca", "Antebraço", "Panturrilha"
  ];

  const commonStyleTags = [
    "Realismo", "Fineline", "Old School", "Blackwork", "Geométrico", 
    "Aquarela", "Pontilhismo", "Minimalista", "Tribal", "Ornamental",
    "Biomecânico", "Japonês", "Chicano", "Lettering"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToArray = (field: string, value: string, setter: (value: string) => void) => {
    if (value.trim() && !formData[field as keyof typeof formData].includes(value.trim())) {
      handleInputChange(field, [...formData[field as keyof typeof formData], value.trim()]);
      setter("");
    }
  };

  const removeFromArray = (field: string, index: number) => {
    const newArray = [...formData[field as keyof typeof formData]];
    newArray.splice(index, 1);
    handleInputChange(field, newArray);
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
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-red-700 font-bold">Título da Tattoo</Label>
                <Input
                  id="name"
                  variant="tattoo"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nome do design ou tattoo"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price" className="text-red-700 font-bold">Preço Sugerido (R$)</Label>
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
            </div>

            <div>
              <Label htmlFor="description" className="text-red-700 font-bold">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descrição detalhada do design, conceito, etc."
                className="border-red-200 focus:border-red-600 focus:ring-red-200"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="average_time" className="text-red-700 font-bold">Tempo Médio (horas)</Label>
                <Input
                  id="average_time"
                  type="number"
                  variant="tattoo"
                  value={formData.average_time}
                  onChange={(e) => handleInputChange("average_time", e.target.value)}
                  placeholder="Ex: 2.5"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-red-700 font-bold">Categoria</Label>
                <Select value={formData.category_id} onValueChange={(value) => handleInputChange("category_id", value)}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-red-200">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {tattooCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="artist" className="text-red-700 font-bold">Artista/Tatuador</Label>
                <Select value={formData.artist_id} onValueChange={(value) => handleInputChange("artist_id", value)}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-red-200">
                    <SelectValue placeholder="Selecione o artista" />
                  </SelectTrigger>
                  <SelectContent>
                    {artists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id}>
                        {artist.first_name} {artist.last_name}
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

        {/* Especificações Técnicas */}
        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-black text-red-800 text-lg">Especificações Técnicas</h3>
            
            {/* Tamanhos Sugeridos */}
            <div>
              <Label className="text-red-700 font-bold">Tamanhos Sugeridos</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  variant="tattoo"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Ex: Pequena: 5-10cm"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="tattooOutline"
                  size="icon"
                  onClick={() => addToArray("sizes", newSize, setNewSize)}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.sizes.map((size: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-red-100 text-red-700 border-red-300">
                    {size}
                    <button
                      type="button"
                      onClick={() => removeFromArray("sizes", index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Locais do Corpo */}
            <div>
              <Label className="text-red-700 font-bold">Locais do Corpo Sugeridos</Label>
              <div className="flex gap-2 mt-2">
                <Select value={newBodyLocation} onValueChange={setNewBodyLocation}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-red-200 flex-1">
                    <SelectValue placeholder="Selecione um local" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonBodyLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="tattooOutline"
                  size="icon"
                  onClick={() => addToArray("body_locations", newBodyLocation, setNewBodyLocation)}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.body_locations.map((location: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-red-100 text-red-700 border-red-300">
                    {location}
                    <button
                      type="button"
                      onClick={() => removeFromArray("body_locations", index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags de Estilos */}
            <div>
              <Label className="text-red-700 font-bold">Tags de Estilos</Label>
              <div className="flex gap-2 mt-2">
                <Select value={newStyleTag} onValueChange={setNewStyleTag}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-red-200 flex-1">
                    <SelectValue placeholder="Selecione um estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonStyleTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="tattooOutline"
                  size="icon"
                  onClick={() => addToArray("style_tags", newStyleTag, setNewStyleTag)}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.style_tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-red-100 text-red-700 border-red-300">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeFromArray("style_tags", index)}
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

        {/* Outras Informações */}
        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-black text-red-800 text-lg">Informações Adicionais</h3>
            
            <div>
              <Label htmlFor="notes" className="text-red-700 font-bold">Outras Informações Importantes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Notas adicionais, cuidados especiais, informações sobre o design..."
                className="border-red-200 focus:border-red-600 focus:ring-red-200"
                rows={3}
              />
            </div>

            {/* Upload de Imagens (Simulado) */}
            <div>
              <Label className="text-red-700 font-bold">Imagens da Tattoo</Label>
              <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-red-400" />
                <p className="mt-2 text-sm text-red-600">
                  Arraste e solte imagens aqui ou clique para selecionar
                </p>
                <p className="text-xs text-red-500 mt-1">
                  PNG, JPG, GIF até 10MB cada
                </p>
              </div>
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
              "Salvar Tatuagem"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
