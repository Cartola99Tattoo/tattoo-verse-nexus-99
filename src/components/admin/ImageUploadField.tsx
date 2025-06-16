
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (value: string) => void;
  label: string;
}

const ImageUploadField = ({ value, onChange, label }: ImageUploadFieldProps) => {
  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 border-2 border-red-200 shadow-lg">
          <AvatarImage src={value} />
          <AvatarFallback className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold">
            IMG
          </AvatarFallback>
        </Avatar>
        <Input
          placeholder="URL da imagem..."
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default ImageUploadField;
