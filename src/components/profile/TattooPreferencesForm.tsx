
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brush, Target, DollarSign, Clock } from "lucide-react";
import { TattooPreferences } from "@/services/mock/mockUserProfileService";

interface TattooPreferencesFormProps {
  preferences: TattooPreferences;
  onUpdate: (preferences: Partial<TattooPreferences>) => void;
  isLoading?: boolean;
}

const TattooPreferencesForm: React.FC<TattooPreferencesFormProps> = ({ 
  preferences, 
  onUpdate, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<TattooPreferences>(preferences);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const tattooStyles = [
    "Realismo", "Fineline", "Old School", "Neo-Tradicional", "Oriental", 
    "Aquarela", "Pontilhismo", "Geométrico", "Minimalista", "Blackwork",
    "Tradicional Americano", "New School", "Chicano", "Tribal", "Biomecânico"
  ];

  const bodyParts = [
    "Braço", "Perna", "Costas", "Pescoço", "Mão", "Pé", 
    "Tórax", "Glúteos", "Região Íntima", "Rosto", "Outro"
  ];

  const budgetRanges = [
    "Até R$ 500",
    "R$ 500 - R$ 1.000",
    "R$ 1.000 - R$ 2.500",
    "R$ 2.500 - R$ 5.000",
    "Acima de R$ 5.000"
  ];

  const frequencies = [
    "Primeira tatuagem",
    "Uma vez por ano",
    "A cada 6 meses",
    "A cada 3 meses",
    "Sempre que possível"
  ];

  const themes = [
    "Animais", "Natureza", "Mitologia", "Cultura Pop", "Geometria Sagrada",
    "Religioso/Espiritual", "Familiar", "Abstrato", "Retratos", "Lettering",
    "Símbolos", "Flores", "Crânios", "Dragões", "Mandalas"
  ];

  const toggleArrayItem = (array: string[], item: string, setter: (newArray: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-red-600 flex items-center gap-2">
          <Brush className="h-5 w-5" />
          Preferências de Tatuagem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Estilos Favoritos */}
          <div>
            <Label className="text-red-600 font-medium mb-3 block flex items-center gap-2">
              <Target className="h-4 w-4" />
              Estilos Favoritos
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {tattooStyles.map(style => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox
                    id={style}
                    checked={formData.favorite_styles.includes(style)}
                    onCheckedChange={() => 
                      toggleArrayItem(
                        formData.favorite_styles, 
                        style, 
                        (newArray) => setFormData(prev => ({ ...prev, favorite_styles: newArray }))
                      )
                    }
                  />
                  <Label htmlFor={style} className="text-sm cursor-pointer">
                    {style}
                  </Label>
                </div>
              ))}
            </div>
            {formData.favorite_styles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.favorite_styles.map(style => (
                  <Badge key={style} variant="outline" className="border-red-200 text-red-600">
                    {style}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Partes do Corpo Preferidas */}
          <div>
            <Label className="text-red-600 font-medium mb-3 block">
              Partes do Corpo Preferidas
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {bodyParts.map(part => (
                <div key={part} className="flex items-center space-x-2">
                  <Checkbox
                    id={part}
                    checked={formData.preferred_body_parts.includes(part)}
                    onCheckedChange={() => 
                      toggleArrayItem(
                        formData.preferred_body_parts, 
                        part, 
                        (newArray) => setFormData(prev => ({ ...prev, preferred_body_parts: newArray }))
                      )
                    }
                  />
                  <Label htmlFor={part} className="text-sm cursor-pointer">
                    {part}
                  </Label>
                </div>
              ))}
            </div>
            {formData.preferred_body_parts.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.preferred_body_parts.map(part => (
                  <Badge key={part} variant="outline" className="border-red-200 text-red-600">
                    {part}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Orçamento e Frequência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-red-600 font-medium mb-2 block flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Orçamento Estimado
              </Label>
              <Select 
                value={formData.budget_range} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, budget_range: value }))}
              >
                <SelectTrigger className="border-red-200 focus:border-red-600">
                  <SelectValue placeholder="Selecione sua faixa de orçamento" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-red-600 font-medium mb-2 block flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Frequência de Tatuagem
              </Label>
              <Select 
                value={formData.tattoo_frequency} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, tattoo_frequency: value }))}
              >
                <SelectTrigger className="border-red-200 focus:border-red-600">
                  <SelectValue placeholder="Com que frequência você tatua?" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map(frequency => (
                    <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Inspirações Atuais */}
          <div>
            <Label className="text-red-600 font-medium mb-2 block">
              Inspirações Atuais
            </Label>
            <Textarea
              value={formData.current_inspirations}
              onChange={(e) => setFormData(prev => ({ ...prev, current_inspirations: e.target.value }))}
              placeholder="Descreva ideias ou conceitos que o inspiram no momento..."
              rows={3}
              className="border-red-200 focus:border-red-600"
            />
          </div>

          {/* Temas de Interesse */}
          <div>
            <Label className="text-red-600 font-medium mb-3 block">
              Temas de Interesse
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {themes.map(theme => (
                <div key={theme} className="flex items-center space-x-2">
                  <Checkbox
                    id={theme}
                    checked={formData.themes_of_interest.includes(theme)}
                    onCheckedChange={() => 
                      toggleArrayItem(
                        formData.themes_of_interest, 
                        theme, 
                        (newArray) => setFormData(prev => ({ ...prev, themes_of_interest: newArray }))
                      )
                    }
                  />
                  <Label htmlFor={theme} className="text-sm cursor-pointer">
                    {theme}
                  </Label>
                </div>
              ))}
            </div>
            {formData.themes_of_interest.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {formData.themes_of_interest.map(theme => (
                  <Badge key={theme} variant="outline" className="border-red-200 text-red-600">
                    {theme}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl"
          >
            {isLoading ? "Salvando..." : "Salvar Preferências de Tatuagem"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TattooPreferencesForm;
