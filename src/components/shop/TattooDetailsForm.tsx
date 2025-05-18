
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
import TattooCopyrightNotice from "./TattooCopyrightNotice";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const tattooStyles: TattooStyle[] = [
    'Realismo',
    'Minimalista',
    'Old School',
    'Aquarela',
    'Blackwork',
    'Tradicional',
    'Neo-tradicional',
    'Geométrico',
    'Pontilhismo',
    'Tribal',
    'Japonês',
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
    'Ombro',
    'Peito',
    'Nuca',
    'Cabeça',
    'Rosto',
    'Outro'
  ];
  
  const handleChange = (field: keyof TattooDetails, value: any) => {
    setDetails(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Limpar erro quando o campo é preenchido
    if (errors[field] && value) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };
  
  const validateField = (field: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'style':
        if (!details.style) {
          newErrors.style = "Por favor, selecione um estilo de tatuagem";
        } else {
          delete newErrors.style;
        }
        break;
      case 'bodyPart':
        if (!details.bodyPart) {
          newErrors.bodyPart = "Por favor, selecione um local do corpo";
        } else {
          delete newErrors.bodyPart;
        }
        break;
      case 'size':
        if (!details.size) {
          newErrors.size = "Por favor, selecione um tamanho";
        } else {
          delete newErrors.size;
        }
        break;
      case 'estimatedTime':
        if (!details.estimatedTime) {
          newErrors.estimatedTime = "Por favor, selecione um tempo estimado";
        } else {
          delete newErrors.estimatedTime;
        }
        break;
      case 'estimatedSessions':
        if (!details.estimatedSessions || details.estimatedSessions < 1) {
          newErrors.estimatedSessions = "Por favor, informe o número de sessões (mínimo 1)";
        } else {
          delete newErrors.estimatedSessions;
        }
        break;
    }
    
    setErrors(newErrors);
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!details.style) newErrors.style = "Por favor, selecione um estilo de tatuagem";
    if (!details.bodyPart) newErrors.bodyPart = "Por favor, selecione um local do corpo";
    if (!details.size) newErrors.size = "Por favor, selecione um tamanho";
    if (!details.estimatedTime) newErrors.estimatedTime = "Por favor, selecione um tempo estimado";
    if (!details.estimatedSessions || details.estimatedSessions < 1) 
      newErrors.estimatedSessions = "Por favor, informe o número de sessões (mínimo 1)";
    
    setErrors(newErrors);
    // Marcar todos os campos como tocados para mostrar os erros
    const allTouched: Record<string, boolean> = {
      style: true,
      bodyPart: true,
      size: true,
      estimatedTime: true,
      estimatedSessions: true
    };
    setTouched(allTouched);
    
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(details);
    }
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
          <Label htmlFor="style" className="flex items-center form-required">
            Estilo da Tatuagem
          </Label>
          <Select
            value={details.style || ''}
            onValueChange={(value) => handleChange('style', value)}
            disabled={onlyDisplay}
            onOpenChange={() => !touched.style && setTouched({...touched, style: true})}
          >
            <SelectTrigger 
              className={`w-full ${(touched.style && errors.style) ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <SelectValue placeholder="Selecione um estilo" />
            </SelectTrigger>
            <SelectContent>
              {tattooStyles.map((style) => (
                <SelectItem key={style} value={style}>{style}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.style && errors.style && <p className="form-error-message">{errors.style}</p>}
        </div>
        
        <div>
          <Label htmlFor="bodyPart" className="flex items-center form-required">
            Local do Corpo
          </Label>
          <Select
            value={details.bodyPart || ''}
            onValueChange={(value) => handleChange('bodyPart', value)}
            disabled={onlyDisplay}
            onOpenChange={() => !touched.bodyPart && setTouched({...touched, bodyPart: true})}
          >
            <SelectTrigger 
              className={`w-full ${(touched.bodyPart && errors.bodyPart) ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <SelectValue placeholder="Selecione o local do corpo" />
            </SelectTrigger>
            <SelectContent>
              {bodyParts.map((part) => (
                <SelectItem key={part} value={part}>{part}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.bodyPart && errors.bodyPart && <p className="form-error-message">{errors.bodyPart}</p>}
        </div>
        
        <div>
          <Label htmlFor="size" className="flex items-center form-required">
            Tamanho Aproximado
          </Label>
          <Select
            value={details.size || ''}
            onValueChange={(value) => handleChange('size', value)}
            disabled={onlyDisplay}
            onOpenChange={() => !touched.size && setTouched({...touched, size: true})}
          >
            <SelectTrigger 
              className={`w-full ${(touched.size && errors.size) ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <SelectValue placeholder="Selecione um tamanho" />
            </SelectTrigger>
            <SelectContent>
              {tattooSizes.map((size) => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {touched.size && errors.size && <p className="form-error-message">{errors.size}</p>}
        </div>
        
        <div>
          <Label htmlFor="estimatedTime" className="flex items-center form-required">
            Tempo Estimado
          </Label>
          <Select
            value={details.estimatedTime || ''}
            onValueChange={(value) => handleChange('estimatedTime', value)}
            disabled={onlyDisplay}
            onOpenChange={() => !touched.estimatedTime && setTouched({...touched, estimatedTime: true})}
          >
            <SelectTrigger 
              className={`w-full ${(touched.estimatedTime && errors.estimatedTime) ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <SelectValue placeholder="Selecione o tempo estimado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2 horas">1-2 horas</SelectItem>
              <SelectItem value="2-4 horas">2-4 horas</SelectItem>
              <SelectItem value="4-6 horas">4-6 horas</SelectItem>
              <SelectItem value="Mais de 6 horas">Mais de 6 horas</SelectItem>
            </SelectContent>
          </Select>
          {touched.estimatedTime && errors.estimatedTime && <p className="form-error-message">{errors.estimatedTime}</p>}
        </div>
        
        <div>
          <Label htmlFor="estimatedSessions" className="flex items-center form-required">
            Sessões Estimadas
          </Label>
          <Input
            type="number"
            min="1"
            value={details.estimatedSessions || ''}
            onChange={(e) => handleChange('estimatedSessions', parseInt(e.target.value) || '')}
            onBlur={() => handleBlur('estimatedSessions')}
            placeholder="Número de sessões necessárias"
            disabled={onlyDisplay}
            className={touched.estimatedSessions && errors.estimatedSessions ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {touched.estimatedSessions && errors.estimatedSessions && <p className="form-error-message">{errors.estimatedSessions}</p>}
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
            fileTypes="image/png, image/jpeg, image/gif"
            maxSizeMB={2}
          />
          <p className="text-xs text-gray-500 mt-1">
            Formatos aceitos: JPG, PNG, GIF. Máximo 2MB por imagem.
          </p>
        </div>

        {!isValid && !onlyDisplay && (
          <Alert className="mt-2 bg-amber-50 border-amber-100">
            <Info className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800 text-xs">
              Por favor, preencha todos os campos obrigatórios marcados com <span className="text-red-500">*</span>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Aviso de direitos autorais */}
        {!onlyDisplay && artistName && (
          <TattooCopyrightNotice artistName={artistName} />
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
