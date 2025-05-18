
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart, TattooDetails } from "@/contexts/CartContext";
import { Button } from "../ui/button";

interface TattooDetailsFormProps {
  productId: number;
  onSubmit: () => void;
}

const bodyPartOptions = [
  "Braço",
  "Costas",
  "Perna",
  "Tornozelo",
  "Costelas",
  "Peito",
  "Mão",
  "Antebraço",
  "Ombro",
  "Pulso",
  "Pescoço",
  "Outro"
];

const sizeOptions = [
  "Pequeno (até 5cm)",
  "Médio (5-10cm)",
  "Grande (10-20cm)",
  "Extra Grande (mais de 20cm)",
  "Personalizado"
];

const timeOptions = [
  "1-2 horas",
  "2-4 horas",
  "4-6 horas",
  "6+ horas",
  "Múltiplas sessões"
];

const TattooDetailsForm: React.FC<TattooDetailsFormProps> = ({ productId, onSubmit }) => {
  const { updateTattooDetails, getTattooDetails } = useCart();
  const savedDetails = getTattooDetails(productId);
  
  const [details, setDetails] = useState<TattooDetails>({
    bodyPart: savedDetails.bodyPart || "",
    size: savedDetails.size || "",
    artDescription: savedDetails.artDescription || "",
    estimatedTime: savedDetails.estimatedTime || "",
    estimatedSessions: savedDetails.estimatedSessions || 1,
    customSize: savedDetails.customSize || "",
  });

  const [showCustomSize, setShowCustomSize] = useState(details.size === "Personalizado");
  const [formValid, setFormValid] = useState(false);

  // Validar formulário
  useEffect(() => {
    const { bodyPart, artDescription, estimatedTime, estimatedSessions } = details;
    const sizeValid = details.size !== "Personalizado" || (details.size === "Personalizado" && details.customSize);
    
    setFormValid(
      !!bodyPart && sizeValid && !!artDescription && !!estimatedTime && !!estimatedSessions && estimatedSessions > 0
    );
  }, [details]);

  // Handler para atualizar os detalhes
  const handleChange = (field: keyof TattooDetails, value: any) => {
    const updatedDetails = { ...details, [field]: value };
    
    if (field === 'size') {
      setShowCustomSize(value === "Personalizado");
      if (value !== "Personalizado") {
        updatedDetails.customSize = "";
      }
    }
    
    setDetails(updatedDetails);
    updateTattooDetails(productId, updatedDetails);
  };

  // Handler de submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValid) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bodyPart">Parte do corpo *</Label>
        <Select
          value={details.bodyPart}
          onValueChange={(value) => handleChange("bodyPart", value)}
        >
          <SelectTrigger id="bodyPart" className="w-full">
            <SelectValue placeholder="Selecione a parte do corpo" />
          </SelectTrigger>
          <SelectContent>
            {bodyPartOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Tamanho da tatuagem *</Label>
        <Select
          value={details.size}
          onValueChange={(value) => handleChange("size", value)}
        >
          <SelectTrigger id="size" className="w-full">
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showCustomSize && (
        <div className="space-y-2">
          <Label htmlFor="customSize">Tamanho personalizado (ex: 10cm x 15cm) *</Label>
          <Input
            id="customSize"
            value={details.customSize}
            onChange={(e) => handleChange("customSize", e.target.value)}
            placeholder="Digite as dimensões"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="artDescription">Descrição da arte *</Label>
        <Textarea
          id="artDescription"
          value={details.artDescription}
          onChange={(e) => handleChange("artDescription", e.target.value)}
          placeholder="Descreva os detalhes da sua tatuagem"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimatedTime">Tempo estimado *</Label>
        <Select
          value={details.estimatedTime}
          onValueChange={(value) => handleChange("estimatedTime", value)}
        >
          <SelectTrigger id="estimatedTime" className="w-full">
            <SelectValue placeholder="Selecione o tempo estimado" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimatedSessions">Número de sessões estimadas *</Label>
        <Input
          id="estimatedSessions"
          type="number"
          min="1"
          value={details.estimatedSessions || ""}
          onChange={(e) => handleChange("estimatedSessions", parseInt(e.target.value) || 0)}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-red-500 hover:bg-red-600 mt-6"
        disabled={!formValid}
      >
        Confirmar detalhes
      </Button>
    </form>
  );
};

export default TattooDetailsForm;
