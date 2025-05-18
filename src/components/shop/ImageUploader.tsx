
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  initialImages?: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
  fileTypes?: string;
  maxSizeMB?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  initialImages = [],
  onImagesChange,
  maxImages = 5,
  disabled = false,
  fileTypes = "image/png, image/jpeg, image/gif",
  maxSizeMB = 2
}) => {
  const [images, setImages] = useState<string[]>(initialImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Atualizar as imagens quando initialImages mudar
  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newImages = [...images];

    // Verificar limite de imagens
    if (newImages.length + files.length > maxImages) {
      toast.error(`Limite excedido`, {
        description: `Você só pode adicionar até ${maxImages} imagens.`,
        position: "top-right",
        duration: 3000,
      });
      return;
    }

    // Processar cada arquivo
    Array.from(files).forEach((file) => {
      // Validação de tipo de arquivo
      if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
        toast.error("Formato inválido", {
          description: "Apenas imagens JPG, PNG e GIF são permitidas.",
          position: "top-right",
          duration: 3000,
        });
        return;
      }

      // Validação de tamanho
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast.error("Arquivo muito grande", {
          description: `O tamanho máximo é ${maxSizeMB}MB por imagem.`,
          position: "top-right",
          duration: 3000,
        });
        return;
      }

      // Ler o arquivo como uma URL de dados
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          newImages.push(e.target.result.toString());
          // Atualizar estado e notificar o componente pai somente após ler o arquivo
          setImages([...newImages]);
          onImagesChange([...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Limpar input para permitir selecionar o mesmo arquivo novamente
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange(newImages);

    toast.info("Imagem removida", {
      position: "top-right",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mt-2">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group w-24 h-24 rounded-md overflow-hidden border border-gray-200"
          >
            <img
              src={image}
              alt={`Referência ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {!disabled && (
              <button
                type="button"
                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        {!disabled && images.length < maxImages && (
          <button
            type="button"
            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 hover:text-gray-500 hover:border-gray-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-6 h-6 mb-1" />
            <span className="text-xs">Adicionar</span>
          </button>
        )}
      </div>

      {!disabled && (
        <input
          type="file"
          ref={fileInputRef}
          accept={fileTypes}
          multiple={maxImages > 1}
          onChange={handleImageUpload}
          className="hidden"
        />
      )}
      
      <div className="text-xs text-gray-500">
        {images.length} de {maxImages} imagens
      </div>
    </div>
  );
};

export default ImageUploader;
