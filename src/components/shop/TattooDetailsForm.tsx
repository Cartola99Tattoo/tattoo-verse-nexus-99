
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TattooDetails, TattooStyle, TattooSize, BodyPart } from "@/services/interfaces/IProductService";
import ImageUploader from "./ImageUploader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface TattooDetailsFormProps {
  initialDetails?: TattooDetails;
  artistName?: string;
  availableArtists: string[];
  onSave: (details: TattooDetails) => void;
  onlyDisplay?: boolean;
}

const TattooDetailsForm: React.FC<TattooDetailsFormProps> = ({
  initialDetails,
  artistName,
  availableArtists,
  onSave,
  onlyDisplay = false,
}) => {
  const [details, setDetails] = useState<TattooDetails>(initialDetails || {});
  
  const tattooStyles: TattooStyle[] = [
    'Realismo',
    'Minimalista',
    'Old School',
    'Aquarela',
    'Outros'
  ];
  
  const tattooSizes: TattooSize[] = [
    'Pequeno (até 10cm)',
    'Médio (10-20cm)',
    'Grande (20-30cm)',
    'Extra Grande (acima de 30cm)'
  ];
  
  const bodyParts: BodyPart[] = [
    'Braço - Bíceps',
    'Braço - Antebraço',
    'Costas - Superior',
    'Costas - Inferior',
    'Perna - Coxa',
    'Perna - Panturrilha',
    'Tornozelo',
    'Pé',
    'Costelas',
    'Abdômen',
    'Pescoço',
    'Mão',
    'Pulso',
    'Ombro'
  ];
  
  const handleChange = (field: keyof TattooDetails, value: any) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(details);
  };
  
  const handleImagesChange = (images: string[]) => {
    handleChange('referenceImages', images);
  };

  // Check if all required fields are filled
  const isValid = details.style && details.bodyPart && details.size && 
                  details.estimatedTime && details.estimatedSessions;
  
  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 bg-gray-50 p-4 rounded-md">
      <h4 className="font-medium text-sm mb-2">Detalhes da Tatuagem</h4>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="style">Estilo da Tatuagem*</Label>
          <Select
            value={details.style || ''}
            onValueChange={(value) => handleChange('style', value)}
            disabled={onlyDisplay}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um estilo" />
            </SelectTrigger>
            <SelectContent>
              {tattooStyles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="bodyPart">Local do Corpo*</Label>
          <Select
            value={details.bodyPart || ''}
            onValueChange={(value) => handleChange('bodyPart', value)}
            disabled={onlyDisplay}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o local do corpo" />
            </SelectTrigger>
            <SelectContent>
              {bodyParts.map((part) => (
                <SelectItem key={part} value={part}>{part}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="size">Tamanho Aproximado*</Label>
          <Select
            value={details.size || ''}
            onValueChange={(value) => handleChange('size', value)}
            disabled={onlyDisplay}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um tamanho" />
            </SelectTrigger>
            <SelectContent>
              {tattooSizes.map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="estimatedTime">Tempo Estimado*</Label>
          <Select
            value={details.estimatedTime || ''}
            onValueChange={(value) => handleChange('estimatedTime', value)}
            disabled={onlyDisplay}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tempo estimado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2 horas">1-2 horas</SelectItem>
              <SelectItem value="2-4 horas">2-4 horas</SelectItem>
              <SelectItem value="4-6 horas">4-6 horas</SelectItem>
              <SelectItem value="Mais de 6 horas">Mais de 6 horas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="estimatedSessions">Sessões Estimadas*</Label>
          <Input
            type="number"
            min="1"
            value={details.estimatedSessions || ''}
            onChange={(e) => handleChange('estimatedSessions', parseInt(e.target.value))}
            placeholder="Número de sessões necessárias"
            disabled={onlyDisplay}
          />
        </div>
        
        <div>
          <Label htmlFor="preferredArtist">Artista Preferido</Label>
          <Select
            value={details.preferredArtist || artistName || ''}
            onValueChange={(value) => handleChange('preferredArtist', value)}
            disabled={onlyDisplay}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o artista" />
            </SelectTrigger>
            <SelectContent>
              {availableArtists.map((artist) => (
                <SelectItem key={artist} value={artist}>{artist}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="description">Descrição Detalhada da Ideia</Label>
          <Textarea
            value={details.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Descreva sua ideia de tatuagem com o máximo de detalhes possível..."
            rows={3}
            maxLength={1000}
            disabled={onlyDisplay}
          />
          <p className="text-xs text-gray-500 mt-1">
            {(details.description?.length || 0)}/1000 caracteres
          </p>
        </div>
        
        <div>
          <Label>Imagens de Referência</Label>
          <ImageUploader 
            initialImages={details.referenceImages || []} 
            onImagesChange={handleImagesChange}
            maxImages={3}
            disabled={onlyDisplay}
          />
        </div>

        {!isValid && !onlyDisplay && (
          <Alert className="mt-2 bg-amber-50 border-amber-100">
            <Info className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800 text-xs">
              Por favor, preencha todos os campos obrigatórios marcados com *
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {!onlyDisplay && (
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="bg-red-500 hover:bg-red-600"
            disabled={!isValid}
          >
            Salvar Detalhes
          </Button>
        </div>
      )}
    </form>
  );
};

export default TattooDetailsForm;
