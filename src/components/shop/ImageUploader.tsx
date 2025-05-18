
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Image } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploaderProps {
  maxImages?: number;
  onImagesChange: (images: string[]) => void;
  initialImages?: string[];
  disabled?: boolean;
  maxFileSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  maxImages = 3,
  onImagesChange,
  initialImages = [],
  disabled = false,
  maxFileSizeMB = 2,
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [error, setError] = useState<string | null>(null);

  const validateFileType = (file: File): boolean => {
    return file.type === "image/jpeg" || 
           file.type === "image/png" || 
           file.type === "image/gif";
  };

  const validateFileSize = (file: File): boolean => {
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024; // Convert MB to bytes
    return file.size <= maxSizeBytes;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || disabled) return;
    
    setError(null);
    const newFiles = Array.from(e.target.files);
    
    // Validar número de imagens
    if (images.length + newFiles.length > maxImages) {
      setError(`Você pode fazer upload de no máximo ${maxImages} imagens.`);
      toast({
        title: "Limite excedido",
        description: `Você pode fazer upload de no máximo ${maxImages} imagens.`,
        variant: "destructive",
      });
      return;
    }
    
    // Validar tipo de arquivo e tamanho
    const invalidTypeFiles = newFiles.filter(file => !validateFileType(file));
    const oversizedFiles = newFiles.filter(file => !validateFileSize(file));
    
    if (invalidTypeFiles.length > 0) {
      setError("Por favor, faça upload apenas de arquivos JPG, PNG ou GIF.");
      toast({
        title: "Formato inválido",
        description: "Por favor, faça upload apenas de arquivos JPG, PNG ou GIF.",
        variant: "destructive",
      });
      return;
    }
    
    if (oversizedFiles.length > 0) {
      setError(`Os arquivos devem ter no máximo ${maxFileSizeMB}MB.`);
      toast({
        title: "Tamanho excedido",
        description: `Os arquivos devem ter no máximo ${maxFileSizeMB}MB.`,
        variant: "destructive",
      });
      return;
    }
    
    // Converter para base64 para preview
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newImages = [...images, base64String];
        setImages(newImages);
        onImagesChange(newImages);
      };
      reader.readAsDataURL(file);
    });
    
    // Limpar input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    if (disabled) return;
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);
    setError(null); // Limpar erro quando uma imagem é removida
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
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="Remover imagem"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        
        {images.length < maxImages && !disabled && (
          <label className="flex flex-col items-center justify-center w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Image className="h-8 w-8 text-gray-400 mb-1" />
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
      
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      <p className="text-xs text-gray-500 flex items-center justify-between">
        <span>Adicione até {maxImages} imagens de referência</span>
        <span>JPG, PNG ou GIF (máx. {maxFileSizeMB}MB)</span>
      </p>
    </div>
  );
};

export default ImageUploader;
