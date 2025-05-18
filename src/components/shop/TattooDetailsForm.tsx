
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TattooDetails } from '@/services/interfaces/IProductService';

const bodyPartOptions = [
  { value: 'braco', label: 'Braço' },
  { value: 'costas', label: 'Costas' },
  { value: 'perna', label: 'Perna' },
  { value: 'tornozelo', label: 'Tornozelo' },
  { value: 'costelas', label: 'Costelas' },
  { value: 'peito', label: 'Peito' },
  { value: 'pescoco', label: 'Pescoço' },
];

const sizeOptions = [
  { value: 'pequeno', label: 'Pequeno' },
  { value: 'medio', label: 'Médio' },
  { value: 'grande', label: 'Grande' },
  { value: 'personalizado', label: 'Personalizado (especificar)' },
];

const timeOptions = [
  { value: '1-2', label: '1-2 horas' },
  { value: '2-4', label: '2-4 horas' },
  { value: '4+', label: '4+ horas' },
];

interface TattooDetailsFormProps {
  initialDetails?: TattooDetails;
  artistName: string;
  onSave: (details: TattooDetails) => void;
}

const TattooDetailsForm: React.FC<TattooDetailsFormProps> = ({ initialDetails, artistName, onSave }) => {
  const [details, setDetails] = useState<TattooDetails>(initialDetails || {});
  const [customSize, setCustomSize] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateDetail = (field: keyof TattooDetails, value: any) => {
    setDetails({ ...details, [field]: value });
    
    // Clear error when field is updated
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    
    if (!details.bodyPart) {
      newErrors.bodyPart = 'Por favor, selecione uma parte do corpo';
    }
    
    if (!details.size && !customSize) {
      newErrors.size = 'Por favor, selecione um tamanho';
    }
    
    if (!details.description) {
      newErrors.description = 'Por favor, descreva a arte desejada';
    }
    
    if (!details.estimatedTime) {
      newErrors.estimatedTime = 'Por favor, selecione um tempo estimado';
    }
    
    if (!details.estimatedSessions || details.estimatedSessions <= 0) {
      newErrors.estimatedSessions = 'Por favor, informe um número válido de sessões';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // If using custom size, update the size field
    const finalDetails = { ...details };
    if (details.size === 'personalizado' && customSize) {
      finalDetails.size = customSize;
    }
    
    onSave(finalDetails);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4 border-t pt-4">
      <h3 className="font-semibold text-lg mb-3">Detalhes da Tatuagem</h3>
      
      <div className="space-y-2">
        <Label htmlFor="bodyPart">Parte do corpo <span className="text-red-500">*</span></Label>
        <Select
          value={details.bodyPart}
          onValueChange={(value) => updateDetail('bodyPart', value)}
        >
          <SelectTrigger id="bodyPart" className={errors.bodyPart ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione a parte do corpo" />
          </SelectTrigger>
          <SelectContent>
            {bodyPartOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.bodyPart && <p className="text-xs text-red-500">{errors.bodyPart}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="size">Tamanho <span className="text-red-500">*</span></Label>
        <Select
          value={details.size}
          onValueChange={(value) => updateDetail('size', value)}
        >
          <SelectTrigger id="size" className={errors.size ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {details.size === 'personalizado' && (
          <Input
            placeholder="Ex: 10cm x 15cm"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
            className="mt-2"
          />
        )}
        {errors.size && <p className="text-xs text-red-500">{errors.size}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição da arte <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          placeholder="Descreva os detalhes da tatuagem que você deseja..."
          value={details.description || ''}
          onChange={(e) => updateDetail('description', e.target.value)}
          rows={3}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="estimatedTime">Tempo estimado <span className="text-red-500">*</span></Label>
        <Select
          value={details.estimatedTime}
          onValueChange={(value) => updateDetail('estimatedTime', value)}
        >
          <SelectTrigger id="estimatedTime" className={errors.estimatedTime ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecione o tempo estimado" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.estimatedTime && <p className="text-xs text-red-500">{errors.estimatedTime}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="estimatedSessions">Sessões estimadas <span className="text-red-500">*</span></Label>
        <Input
          id="estimatedSessions"
          type="number"
          min="1"
          value={details.estimatedSessions || ''}
          onChange={(e) => updateDetail('estimatedSessions', parseInt(e.target.value))}
          className={errors.estimatedSessions ? 'border-red-500' : ''}
        />
        {errors.estimatedSessions && <p className="text-xs text-red-500">{errors.estimatedSessions}</p>}
      </div>
      
      <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 mt-4">
        <p>
          Tatuagens são procedimentos artísticos e personalizados para que cada traço da sua tattoo seja único e exclusivo. 
          Ao reservar essa arte você estará garantindo uma obra de arte feita especialmente para você. 
          Todos os direitos autorais precisam ser preservados e essa arte só poderá ser tatuada e reproduzida por {artistName}.
        </p>
      </div>
      
      <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
        Salvar Detalhes
      </Button>
    </form>
  );
};

export default TattooDetailsForm;
