
import React, { useState, useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, X, User } from 'lucide-react';
import { Control } from 'react-hook-form';

interface ImageUploadFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  currentImage?: string;
}

const ImageUploadField = ({ 
  control, 
  name, 
  label, 
  description, 
  placeholder = "Cole o URL da imagem ou escolha um arquivo",
  currentImage 
}: ImageUploadFieldProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular upload - em produção seria feito upload real
      const fakeUrl = `https://example.com/uploads/${file.name}`;
      setPreviewUrl(URL.createObjectURL(file));
      onChange(fakeUrl);
    }
  };

  const clearImage = (onChange: (value: string) => void) => {
    setPreviewUrl('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-red-800 font-bold">{label}</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {/* Preview da imagem */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-red-200 shadow-lg">
                  <AvatarImage src={previewUrl || field.value} />
                  <AvatarFallback className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                {(previewUrl || field.value) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => clearImage(field.onChange)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remover
                  </Button>
                )}
              </div>

              {/* URL Input */}
              <Input
                placeholder={placeholder}
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />

              {/* File Upload */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, field.onChange)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-red-50 to-red-100 border-red-300 text-red-700 hover:from-red-100 hover:to-red-200 hover:border-red-400"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Escolher Ficheiro
                </Button>
              </div>
            </div>
          </FormControl>
          {description && (
            <FormDescription className="text-red-600">{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;
