
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image as ImageIcon, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface OptimizedImageUploadProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  className?: string;
}

interface UploadState {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  preview?: string;
}

const OptimizedImageUpload = ({
  onImagesChange,
  maxImages = 9,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB = 5,
  className = ""
}: OptimizedImageUploadProps) => {
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de arquivo não suportado. Use: ${acceptedTypes.join(', ')}`;
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Arquivo muito grande. Máximo: ${maxSizeMB}MB`;
    }
    
    return null;
  };

  const processFile = async (file: File): Promise<UploadState> => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: "Erro no arquivo",
        description: error,
        variant: "destructive",
      });
      throw new Error(error);
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    
    return new Promise((resolve) => {
      const uploadState: UploadState = {
        file,
        progress: 0,
        status: 'uploading',
        preview
      };

      // Simulate upload progress
      const interval = setInterval(() => {
        uploadState.progress += Math.random() * 30;
        
        if (uploadState.progress >= 100) {
          uploadState.progress = 100;
          uploadState.status = 'completed';
          clearInterval(interval);
          resolve(uploadState);
        }
        
        setUploads(prev => 
          prev.map(u => u.file === file ? { ...uploadState } : u)
        );
      }, 200);
    });
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    
    if (uploads.length + fileArray.length > maxImages) {
      toast({
        title: "Muitos arquivos",
        description: `Máximo de ${maxImages} imagens permitido.`,
        variant: "destructive",
      });
      return;
    }

    const newUploads: UploadState[] = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
      preview: URL.createObjectURL(file)
    }));

    setUploads(prev => [...prev, ...newUploads]);

    try {
      const processedUploads = await Promise.all(
        fileArray.map(file => processFile(file))
      );
      
      const completedFiles = processedUploads.map(u => u.file);
      onImagesChange([...uploads.map(u => u.file), ...completedFiles]);
      
    } catch (error) {
      console.error('Upload error:', error);
    }
  }, [uploads, maxImages, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeUpload = (index: number) => {
    setUploads(prev => {
      const newUploads = prev.filter((_, i) => i !== index);
      onImagesChange(newUploads.map(u => u.file));
      return newUploads;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <div className="text-center">
            <p className="text-lg font-medium">
              Arraste imagens aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Máximo {maxImages} imagens, até {maxSizeMB}MB cada
            </p>
          </div>
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <Button asChild variant="outline" className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              Selecionar Arquivos
            </label>
          </Button>
        </CardContent>
      </Card>

      {uploads.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploads.map((upload, index) => (
            <Card key={index} className="relative">
              <CardContent className="p-2">
                <div className="aspect-square relative rounded overflow-hidden">
                  {upload.preview ? (
                    <img 
                      src={upload.preview} 
                      alt={upload.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => removeUpload(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  {upload.status === 'completed' && (
                    <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="mt-2">
                  <p className="text-xs text-gray-600 truncate">
                    {upload.file.name}
                  </p>
                  {upload.status === 'uploading' && (
                    <Progress value={upload.progress} className="mt-1 h-1" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptimizedImageUpload;
