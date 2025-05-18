
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  maxImages?: number;
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  maxImages = 3,
  onImagesChange,
  initialImages = [],
  disabled = false,
}) => {
  const [images, setImages] = useState<string[]>(initialImages);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || disabled) return;
    
    const newFiles = Array.from(e.target.files);
    
    // Check file types
    const validFiles = newFiles.filter(file => 
      file.type === "image/jpeg" || 
      file.type === "image/png" || 
      file.type === "image/gif"
    );
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Formato inválido",
        description: "Por favor, faça upload apenas de arquivos JPG, PNG ou GIF.",
        variant: "destructive",
      });
    }
    
    // Check max images
    if (images.length + validFiles.length > maxImages) {
      toast({
        title: "Limite excedido",
        description: `Você pode fazer upload de no máximo ${maxImages} imagens.`,
        variant: "destructive",
      });
      return;
    }
    
    // Convert to base64 for preview
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newImages = [...images, base64String];
        setImages(newImages);
        onImagesChange(newImages);
      };
      reader.readAsDataURL(file);
    });
    
    // Reset input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    if (disabled) return;
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((img, index) => (
          <div key={index} className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={img} 
              alt={`Referência ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                aria-label="Remover imagem"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        
        {images.length < maxImages && !disabled && (
          <label className="flex flex-col items-center justify-center w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <span className="text-2xl">+</span>
              <span className="text-xs text-gray-500">Adicionar</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Adicione até {maxImages} imagens de referência (JPG, PNG ou GIF)
      </p>
    </div>
  );
};

export default ImageUploader;
