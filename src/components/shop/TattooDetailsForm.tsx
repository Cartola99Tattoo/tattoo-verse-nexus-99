
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CartItem } from "@/contexts/CartContext";

interface TattooDetailsFormProps {
  item: CartItem;
  onUpdate: (id: number, data: Partial<CartItem>) => void;
}

const bodyPartOptions = [
  "Braço", "Antebraço", "Mão", "Costas", "Peito", 
  "Abdômen", "Perna", "Coxa", "Panturrilha", "Tornozelo", 
  "Pé", "Costelas", "Ombro", "Pescoço", "Cabeça"
];

const sizeOptions = [
  "Pequeno (até 7cm)", "Médio (7-15cm)", "Grande (15-25cm)", "Extra grande (acima de 25cm)"
];

const timeOptions = [
  "1-2 horas", "2-4 horas", "4-6 horas", "6+ horas"
];

const TattooDetailsForm: React.FC<TattooDetailsFormProps> = ({ item, onUpdate }) => {
  const handleChange = (field: keyof CartItem, value: any) => {
    onUpdate(item.id, { [field]: value });
  };

  return (
    <div className="space-y-4 border rounded-md p-4 bg-gray-50">
      <h3 className="font-medium text-lg">Detalhes da Tatuagem</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`bodyPart-${item.id}`}>Parte do corpo</Label>
          <Select 
            value={item.bodyPart || ""} 
            onValueChange={(value) => handleChange("bodyPart", value)}
          >
            <SelectTrigger id={`bodyPart-${item.id}`}>
              <SelectValue placeholder="Selecione a parte do corpo" />
            </SelectTrigger>
            <SelectContent>
              {bodyPartOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`size-${item.id}`}>Tamanho</Label>
          <Select 
            value={item.size || ""} 
            onValueChange={(value) => handleChange("size", value)}
          >
            <SelectTrigger id={`size-${item.id}`}>
              <SelectValue placeholder="Selecione o tamanho" />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`artDescription-${item.id}`}>Descrição da arte</Label>
        <Textarea
          id={`artDescription-${item.id}`}
          placeholder="Descreva a arte desejada com detalhes..."
          value={item.artDescription || ""}
          onChange={(e) => handleChange("artDescription", e.target.value)}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`estimatedTime-${item.id}`}>Tempo estimado</Label>
          <Select 
            value={item.estimatedTime || ""} 
            onValueChange={(value) => handleChange("estimatedTime", value)}
          >
            <SelectTrigger id={`estimatedTime-${item.id}`}>
              <SelectValue placeholder="Selecione o tempo estimado" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`estimatedSessions-${item.id}`}>Sessões estimadas</Label>
          <Input
            id={`estimatedSessions-${item.id}`}
            type="number"
            min="1"
            placeholder="Número de sessões"
            value={item.estimatedSessions || ""}
            onChange={(e) => handleChange("estimatedSessions", parseInt(e.target.value) || 1)}
          />
        </div>
      </div>
    </div>
  );
};

export default TattooDetailsForm;
