
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

const ImageUploadField = ({ value, onChange, label = "Foto de Perfil", placeholder }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Erro", 
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simular upload - no futuro conectar com Firebase Storage
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setTimeout(() => {
        onChange(result);
        setIsUploading(false);
        toast({
          title: "Sucesso",
          description: "Imagem carregada com sucesso!",
        });
      }, 1000); // Simular delay do upload
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      
      {value ? (
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24 border-2 border-red-200 shadow-lg">
            <AvatarImage src={value} alt="Foto de perfil" />
            <AvatarFallback className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <Camera className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={removeImage}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Remover Foto
            </Button>
            <p className="text-xs text-gray-500">Clique para remover a imagem atual</p>
          </div>
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${isDragging 
              ? 'border-red-500 bg-red-50' 
              : 'border-red-300 hover:border-red-400 hover:bg-red-50'
            }
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-800">
                {isUploading ? 'Enviando imagem...' : 'Escolher Foto de Perfil'}
              </h3>
              <p className="text-sm text-gray-600">
                Arraste uma imagem aqui ou clique para selecionar
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG ou JPEG (máx. 5MB)
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="image-upload"
              disabled={isUploading}
            />
            
            <Button
              type="button"
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isUploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              {isUploading ? 'Enviando...' : 'Escolher Ficheiros'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
