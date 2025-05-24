import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PortfolioItem } from "@/services/interfaces/IArtistsService";
import { Upload, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ArtistPortfolioManagerProps {
  portfolioItems: PortfolioItem[];
  onItemsChange: (items: PortfolioItem[]) => void;
  maxItems?: number;
}

const ArtistPortfolioManager = ({ 
  portfolioItems, 
  onItemsChange, 
  maxItems = 9 
}: ArtistPortfolioManagerProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const availableSlots = maxItems - portfolioItems.length;
    
    if (files.length > availableSlots) {
      toast({
        title: "Limite excedido",
        description: `Você pode adicionar apenas ${availableSlots} imagens a mais.`,
        variant: "destructive",
      });
      return;
    }

    setNewImages(prev => [...prev, ...files.slice(0, availableSlots)]);
  }, [portfolioItems.length, maxItems]);

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingItem = (itemId: string) => {
    onItemsChange(portfolioItems.filter(item => item.id !== itemId));
  };

  const handleUpdateCaption = (itemId: string, caption: string) => {
    onItemsChange(
      portfolioItems.map(item => 
        item.id === itemId ? { ...item, caption } : item
      )
    );
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent, dropIndex: number) => {
    event.preventDefault();
    
    if (draggedIndex === null) return;

    const newItems = [...portfolioItems];
    const draggedItem = newItems[draggedIndex];
    
    newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    
    // Update order_index for all items
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order_index: index
    }));
    
    onItemsChange(updatedItems);
    setDraggedIndex(null);
  };

  const saveNewImages = async () => {
    if (newImages.length === 0) return;

    try {
      // Here you would typically upload to a storage service
      // For now, we'll create placeholder URLs
      const newPortfolioItems: PortfolioItem[] = newImages.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        artist_id: '', // Will be set by parent component
        image_url: URL.createObjectURL(file), // Temporary URL
        description: '',
        caption: '',
        category: '',
        is_featured: false,
        order_index: portfolioItems.length + index,
        created_at: new Date().toISOString()
      }));

      onItemsChange([...portfolioItems, ...newPortfolioItems]);
      setNewImages([]);
      
      toast({
        title: "Sucesso",
        description: "Imagens adicionadas ao portfólio!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar imagens. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Gerenciar Portfólio ({portfolioItems.length}/{maxItems})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-gray-600">
              Arraste e solte até {maxItems - portfolioItems.length} imagens aqui
            </p>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={portfolioItems.length >= maxItems}
              className="w-full"
            />
          </div>
        </div>

        {/* New Images Preview */}
        {newImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Novas Imagens</h3>
              <Button onClick={saveNewImages}>
                Salvar Imagens
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {newImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Nova imagem ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => handleRemoveNewImage(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Portfolio Items */}
        {portfolioItems.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Portfólio Atual</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioItems
                .sort((a, b) => a.order_index - b.order_index)
                .map((item, index) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="bg-white border rounded-lg p-3 space-y-3 cursor-move hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={item.image_url}
                        alt={item.description || `Portfólio ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="absolute top-2 left-2">
                        <GripVertical className="h-4 w-4 text-white bg-black bg-opacity-50 rounded" />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => handleRemoveExistingItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      {item.is_featured && (
                        <Badge className="absolute bottom-2 left-2 text-xs">
                          Destaque
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Legenda da imagem..."
                        value={item.caption || ''}
                        onChange={(e) => handleUpdateCaption(item.id, e.target.value)}
                        className="text-sm"
                      />
                      <p className="text-xs text-gray-500">
                        Ordem: {item.order_index + 1}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {portfolioItems.length === 0 && newImages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma imagem no portfólio ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtistPortfolioManager;
