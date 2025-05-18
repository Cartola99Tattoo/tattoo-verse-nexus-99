
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from "./ImageUploader";
import { TattooDetails, TattooStyle, TattooSize, BodyPart } from "@/services/interfaces/IProductService";

const tattooStyles: TattooStyle[] = ["Realismo", "Minimalista", "Old School", "Aquarela", "Outros"];
const tattooSizes: TattooSize[] = ["Pequeno (até 10cm)", "Médio (10-20cm)", "Grande (20-30cm)", "Extra Grande (acima de 30cm)"];
const bodyParts: BodyPart[] = [
  "Braço - Bíceps", "Braço - Antebraço", "Costas - Superior", "Costas - Inferior", 
  "Perna - Coxa", "Perna - Panturrilha", "Tornozelo", "Pé", "Costelas", 
  "Abdômen", "Pescoço", "Mão", "Pulso", "Ombro"
];
const estimatedTimes = ["1-2 horas", "2-4 horas", "4+ horas"];

interface TattooDetailsFormProps {
  initialDetails?: TattooDetails;
  artistName?: string;
  availableArtists?: string[];
  onSave: (details: TattooDetails) => void;
}

const TattooDetailsForm: React.FC<TattooDetailsFormProps> = ({ 
  initialDetails = {}, 
  artistName, 
  availableArtists = [],
  onSave 
}) => {
  const [details, setDetails] = useState<TattooDetails>({
    bodyPart: initialDetails.bodyPart || undefined,
    size: initialDetails.size || undefined,
    style: initialDetails.style || undefined,
    description: initialDetails.description || "",
    estimatedTime: initialDetails.estimatedTime || "",
    estimatedSessions: initialDetails.estimatedSessions || 1,
    preferredArtist: initialDetails.preferredArtist || artistName,
    referenceImages: initialDetails.referenceImages || [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (field: keyof TattooDetails, value: any) => {
    setDetails(prev => ({ ...prev, [field]: value }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    
    if (!details.bodyPart) {
      newErrors.bodyPart = "Parte do corpo é obrigatória";
    }
    
    if (!details.size) {
      newErrors.size = "Tamanho é obrigatório";
    }
    
    if (!details.style) {
      newErrors.style = "Estilo é obrigatório";
    }
    
    if (!details.estimatedTime) {
      newErrors.estimatedTime = "Tempo estimado é obrigatório";
    }
    
    if (!details.estimatedSessions || details.estimatedSessions < 1) {
      newErrors.estimatedSessions = "Número de sessões deve ser maior que zero";
    }
    
    // If there are validation errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(details);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-3 bg-gray-50 rounded-md mt-3">
      <h5 className="font-semibold text-sm mb-2">Detalhes da Tatuagem</h5>
      
      {/* Artista preferencial */}
      {availableArtists.length > 0 && (
        <div className="space-y-1">
          <Label htmlFor="artist" className="text-xs">
            Artista <span className="text-red-500">*</span>
          </Label>
          <Select
            value={details.preferredArtist}
            onValueChange={(value) => handleChange('preferredArtist', value)}
          >
            <SelectTrigger id="artist" className={errors.preferredArtist ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecione um artista" />
            </SelectTrigger>
            <SelectContent>
              {availableArtists.map((artist) => (
                <SelectItem key={artist} value={artist}>
                  {artist}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.preferredArtist && (
            <p className="text-xs text-red-500">{errors.preferredArtist}</p>
          )}
        </div>
      )}
      
      {/* Estilo da tatuagem */}
      <div className="space-y-1">
        <Label htmlFor="style" className="text-xs">
          Estilo da Tatuagem <span className="text-red-500">*</span>
        </Label>
        <Select
          value={details.style}
          onValueChange={(value) => handleChange('style', value as TattooStyle)}
        >
          <SelectTrigger id="style" className={errors.style ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecione um estilo" />
          </SelectTrigger>
          <SelectContent>
            {tattooStyles.map((style) => (
              <SelectItem key={style} value={style}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.style && (
          <p className="text-xs text-red-500">{errors.style}</p>
        )}
      </div>
      
      {/* Tamanho */}
      <div className="space-y-1">
        <Label htmlFor="size" className="text-xs">
          Tamanho Aproximado <span className="text-red-500">*</span>
        </Label>
        <Select
          value={details.size}
          onValueChange={(value) => handleChange('size', value as TattooSize)}
        >
          <SelectTrigger id="size" className={errors.size ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            {tattooSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.size && (
          <p className="text-xs text-red-500">{errors.size}</p>
        )}
      </div>
      
      {/* Parte do corpo */}
      <div className="space-y-1">
        <Label htmlFor="bodyPart" className="text-xs">
          Local do Corpo <span className="text-red-500">*</span>
        </Label>
        <Select
          value={details.bodyPart}
          onValueChange={(value) => handleChange('bodyPart', value as BodyPart)}
        >
          <SelectTrigger id="bodyPart" className={errors.bodyPart ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecione o local do corpo" />
          </SelectTrigger>
          <SelectContent>
            {bodyParts.map((part) => (
              <SelectItem key={part} value={part}>
                {part}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.bodyPart && (
          <p className="text-xs text-red-500">{errors.bodyPart}</p>
        )}
      </div>
      
      {/* Tempo estimado */}
      <div className="space-y-1">
        <Label htmlFor="estimatedTime" className="text-xs">
          Tempo Estimado <span className="text-red-500">*</span>
        </Label>
        <Select
          value={details.estimatedTime}
          onValueChange={(value) => handleChange('estimatedTime', value)}
        >
          <SelectTrigger id="estimatedTime" className={errors.estimatedTime ? "border-red-500" : ""}>
            <SelectValue placeholder="Selecione o tempo estimado" />
          </SelectTrigger>
          <SelectContent>
            {estimatedTimes.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.estimatedTime && (
          <p className="text-xs text-red-500">{errors.estimatedTime}</p>
        )}
      </div>
      
      {/* Número de sessões */}
      <div className="space-y-1">
        <Label htmlFor="estimatedSessions" className="text-xs">
          Sessões Estimadas <span className="text-red-500">*</span>
        </Label>
        <Input
          id="estimatedSessions"
          type="number"
          min="1"
          value={details.estimatedSessions || ""}
          onChange={(e) => handleChange('estimatedSessions', parseInt(e.target.value) || "")}
          className={errors.estimatedSessions ? "border-red-500" : ""}
        />
        {errors.estimatedSessions && (
          <p className="text-xs text-red-500">{errors.estimatedSessions}</p>
        )}
      </div>
      
      {/* Descrição */}
      <div className="space-y-1">
        <Label htmlFor="description" className="text-xs">
          Descrição Detalhada da Ideia <span className="text-gray-500">(recomendado)</span>
        </Label>
        <Textarea
          id="description"
          value={details.description || ""}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Descreva sua ideia em detalhes para ajudar o artista"
          maxLength={1000}
          className="h-24"
        />
        <p className="text-xs text-right text-gray-500">
          {(details.description?.length || 0)}/1000 caracteres
        </p>
      </div>
      
      {/* Imagens de referência */}
      <div className="space-y-1">
        <Label className="text-xs">
          Imagens de Referência <span className="text-gray-500">(opcional)</span>
        </Label>
        <ImageUploader 
          maxImages={3} 
          onImagesChange={(images) => handleChange('referenceImages', images)}
          initialImages={details.referenceImages}
        />
      </div>
      
      <div className="pt-2 flex justify-end">
        <Button type="submit" className="bg-red-500 hover:bg-red-600">
          Salvar Detalhes
        </Button>
      </div>
    </form>
  );
};

export default TattooDetailsForm;
