
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Lightbulb, Save, X, Target, User, Tag } from 'lucide-react';
import { ContentIdea, CreateContentIdeaData } from '@/types/contentIdea';
import { Persona } from '@/types/persona';

interface ContentIdeaFormProps {
  idea?: ContentIdea;
  personas: Persona[];
  onSave: (data: CreateContentIdeaData) => void;
  onCancel: () => void;
}

const ContentIdeaForm = ({ idea, personas, onSave, onCancel }: ContentIdeaFormProps) => {
  const [formData, setFormData] = useState<CreateContentIdeaData>({
    theme: idea?.theme || '',
    format: idea?.format || 'Blog Post',
    purchaseStage: idea?.purchaseStage || 'Aprendizado e Descoberta',
    focusPersonas: idea?.focusPersonas || [],
    personaRelevance: idea?.personaRelevance || '',
    focusKeyword: idea?.focusKeyword || '',
    status: idea?.status || 'Ideia',
    notes: idea?.notes || '',
    ideaCreator: idea?.ideaCreator || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePersonaToggle = (personaId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      focusPersonas: checked
        ? [...prev.focusPersonas, personaId]
        : prev.focusPersonas.filter(id => id !== personaId)
    }));
  };

  const formatOptions = [
    'Blog Post', 'eBook', 'Webinar/Live', 'Vídeo Curto', 
    'Post de Redes Sociais', 'Infográfico', 'Estudo de Caso', 'Outro'
  ];

  const stageOptions = [
    'Aprendizado e Descoberta', 'Reconhecimento do Problema', 
    'Consideração da Solução', 'Decisão de Compra'
  ];

  const statusOptions = [
    'Ideia', 'Planejado', 'Em Produção', 'Em Revisão', 'Publicado', 'Arquivado'
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl font-black">
            <Lightbulb className="h-6 w-6" />
            {idea ? 'Editar Ideia de Conteúdo' : 'Nova Ideia de Conteúdo'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tema do Conteúdo */}
            <div>
              <Label className="text-red-700 font-medium">Tema do Conteúdo *</Label>
              <Input
                value={formData.theme}
                onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                placeholder="Ex: Guia Completo: Cuidados Pós-Tatuagem para uma Cicatrização Perfeita"
                className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                required
              />
            </div>

            {/* Formato e Etapa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-red-700 font-medium">Formato *</Label>
                <Select value={formData.format} onValueChange={(value: any) => setFormData(prev => ({ ...prev, format: value }))}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map(format => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-red-700 font-medium">Etapa de Compra *</Label>
                <Select value={formData.purchaseStage} onValueChange={(value: any) => setFormData(prev => ({ ...prev, purchaseStage: value }))}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stageOptions.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Personas Foco */}
            <div>
              <Label className="text-red-700 font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Persona Foco (Múltipla Seleção)
              </Label>
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200 space-y-3">
                {personas.length > 0 ? (
                  personas.map(persona => (
                    <div key={persona.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={persona.id}
                        checked={formData.focusPersonas.includes(persona.id)}
                        onCheckedChange={(checked) => handlePersonaToggle(persona.id, checked as boolean)}
                      />
                      <Label
                        htmlFor={persona.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {persona.name} - {persona.age} anos ({persona.occupation})
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">Nenhuma persona disponível. Crie personas primeiro na seção "Personas".</p>
                )}
              </div>
            </div>

            {/* Relevância para Persona */}
            <div>
              <Label className="text-red-700 font-medium">Relevância para a Persona</Label>
              <Textarea
                value={formData.personaRelevance}
                onChange={(e) => setFormData(prev => ({ ...prev, personaRelevance: e.target.value }))}
                placeholder="Descreva brevemente por que essa ideia é relevante para a persona foco e qual problema ela resolve..."
                className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 min-h-[80px]"
              />
            </div>

            {/* Keyword e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-red-700 font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Keyword Foco
                </Label>
                <Input
                  value={formData.focusKeyword}
                  onChange={(e) => setFormData(prev => ({ ...prev, focusKeyword: e.target.value }))}
                  placeholder="Ex: cuidados tattoo, tatuagem realismo SP"
                  className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <Label className="text-red-700 font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Observações */}
            <div>
              <Label className="text-red-700 font-medium">Obs. / Referências</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Anotações adicionais, links de referência, rascunhos de estrutura, etc..."
                className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200 min-h-[100px]"
              />
            </div>

            {/* Quem Deu a Ideia */}
            <div>
              <Label className="text-red-700 font-medium">Quem Deu a Ideia?</Label>
              <Input
                value={formData.ideaCreator}
                onChange={(e) => setFormData(prev => ({ ...prev, ideaCreator: e.target.value }))}
                placeholder="Nome do responsável pela sugestão da ideia"
                className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4 pt-6 border-t border-red-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {idea ? 'Atualizar' : 'Criar'} Ideia
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentIdeaForm;
