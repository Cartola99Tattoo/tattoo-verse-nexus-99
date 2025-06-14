
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Save, X, Plus, Trash2, Lightbulb, AlertTriangle, CheckCircle, ShoppingCart } from 'lucide-react';
import { CustomerJourney, CreateJourneyData } from '@/types/journey';
import { Persona } from '@/types/persona';

interface JourneyFormProps {
  journey?: CustomerJourney;
  personas: Persona[];
  onSave: (data: CreateJourneyData) => void;
  onCancel: () => void;
}

const JourneyForm = ({ journey, personas, onSave, onCancel }: JourneyFormProps) => {
  const [formData, setFormData] = useState<CreateJourneyData>({
    personaId: journey?.personaId || '',
    personaName: journey?.personaName || '',
    stages: {
      discovery: {
        title: 'Aprendizado e Descoberta',
        definition: journey?.stages.discovery.definition || '',
        contentIdeas: journey?.stages.discovery.contentIdeas || []
      },
      problemRecognition: {
        title: 'Reconhecimento do Problema',
        mainProblem: journey?.stages.problemRecognition.mainProblem || '',
        contentIdeas: journey?.stages.problemRecognition.contentIdeas || []
      },
      solutionConsideration: {
        title: 'Consideração da Solução',
        mainSolution: journey?.stages.solutionConsideration.mainSolution || '',
        contentIdeas: journey?.stages.solutionConsideration.contentIdeas || []
      },
      purchaseDecision: {
        title: 'Decisão de Compra',
        productService: journey?.stages.purchaseDecision.productService || '',
        contentIdeas: journey?.stages.purchaseDecision.contentIdeas || []
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePersonaChange = (personaId: string) => {
    const persona = personas.find(p => p.id === personaId);
    setFormData(prev => ({
      ...prev,
      personaId,
      personaName: persona?.name || ''
    }));
  };

  const addContentIdea = (stageKey: keyof CreateJourneyData['stages']) => {
    setFormData(prev => ({
      ...prev,
      stages: {
        ...prev.stages,
        [stageKey]: {
          ...prev.stages[stageKey],
          contentIdeas: [...prev.stages[stageKey].contentIdeas, '']
        }
      }
    }));
  };

  const updateContentIdea = (stageKey: keyof CreateJourneyData['stages'], index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      stages: {
        ...prev.stages,
        [stageKey]: {
          ...prev.stages[stageKey],
          contentIdeas: prev.stages[stageKey].contentIdeas.map((idea, i) => i === index ? value : idea)
        }
      }
    }));
  };

  const removeContentIdea = (stageKey: keyof CreateJourneyData['stages'], index: number) => {
    setFormData(prev => ({
      ...prev,
      stages: {
        ...prev.stages,
        [stageKey]: {
          ...prev.stages[stageKey],
          contentIdeas: prev.stages[stageKey].contentIdeas.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const getStageIcon = (stageKey: string) => {
    switch (stageKey) {
      case 'discovery': return <Lightbulb className="h-5 w-5" />;
      case 'problemRecognition': return <AlertTriangle className="h-5 w-5" />;
      case 'solutionConsideration': return <CheckCircle className="h-5 w-5" />;
      case 'purchaseDecision': return <ShoppingCart className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getStageColor = (stageKey: string) => {
    switch (stageKey) {
      case 'discovery': return 'from-blue-50 to-blue-100 border-blue-200';
      case 'problemRecognition': return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'solutionConsideration': return 'from-green-50 to-green-100 border-green-200';
      case 'purchaseDecision': return 'from-purple-50 to-purple-100 border-purple-200';
      default: return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getStageTextColor = (stageKey: string) => {
    switch (stageKey) {
      case 'discovery': return 'text-blue-800';
      case 'problemRecognition': return 'text-yellow-800';
      case 'solutionConsideration': return 'text-green-800';
      case 'purchaseDecision': return 'text-purple-800';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl font-black">
            <Target className="h-6 w-6" />
            {journey ? 'Editar Jornada de Compra' : 'Nova Jornada de Compra'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Seleção de Persona */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
              <h3 className="text-red-800 font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Configuração da Jornada
              </h3>
              <div>
                <Label className="text-red-700 font-medium">Persona Associada (Opcional)</Label>
                <Select value={formData.personaId} onValueChange={handlePersonaChange}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200">
                    <SelectValue placeholder="Selecione uma persona ou deixe em branco para jornada genérica" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Jornada Genérica (Sem Persona)</SelectItem>
                    {personas.map(persona => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.name} - {persona.age} anos
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Estágio 1: Aprendizado e Descoberta */}
            <div className={`bg-gradient-to-r ${getStageColor('discovery')} p-6 rounded-lg border`}>
              <h3 className={`${getStageTextColor('discovery')} font-bold text-lg mb-4 flex items-center gap-2`}>
                {getStageIcon('discovery')}
                Estágio 1: Aprendizado e Descoberta
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-blue-700 font-medium">Definição do Estágio</Label>
                  <Textarea
                    value={formData.stages.discovery.definition}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      stages: {
                        ...prev.stages,
                        discovery: { ...prev.stages.discovery, definition: e.target.value }
                      }
                    }))}
                    placeholder="Descreva as necessidades e perguntas da persona quando ela ainda não tem claro qual o problema que está enfrentando..."
                    className="border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-blue-700 font-medium">Ideias de Conteúdo</Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addContentIdea('discovery')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  {formData.stages.discovery.contentIdeas.map((idea, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={idea}
                        onChange={(e) => updateContentIdea('discovery', index, e.target.value)}
                        placeholder="Ex: Como a arte corporal pode expressar sua personalidade"
                        className="border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeContentIdea('discovery', index)}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Estágio 2: Reconhecimento do Problema */}
            <div className={`bg-gradient-to-r ${getStageColor('problemRecognition')} p-6 rounded-lg border`}>
              <h3 className={`${getStageTextColor('problemRecognition')} font-bold text-lg mb-4 flex items-center gap-2`}>
                {getStageIcon('problemRecognition')}
                Estágio 2: Reconhecimento do Problema
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-yellow-700 font-medium">Principal Problema/Desafio</Label>
                  <Textarea
                    value={formData.stages.problemRecognition.mainProblem}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      stages: {
                        ...prev.stages,
                        problemRecognition: { ...prev.stages.problemRecognition, mainProblem: e.target.value }
                      }
                    }))}
                    placeholder="Ex: Medo de se arrepender da tatuagem, Dúvidas sobre higiene e segurança..."
                    className="border-yellow-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-yellow-700 font-medium">Ideias de Conteúdo</Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addContentIdea('problemRecognition')}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  {formData.stages.problemRecognition.contentIdeas.map((idea, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={idea}
                        onChange={(e) => updateContentIdea('problemRecognition', index, e.target.value)}
                        placeholder="Ex: Guia completo: como escolher sua primeira tatuagem sem arrependimentos"
                        className="border-yellow-200 focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeContentIdea('problemRecognition', index)}
                        className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Estágio 3: Consideração da Solução */}
            <div className={`bg-gradient-to-r ${getStageColor('solutionConsideration')} p-6 rounded-lg border`}>
              <h3 className={`${getStageTextColor('solutionConsideration')} font-bold text-lg mb-4 flex items-center gap-2`}>
                {getStageIcon('solutionConsideration')}
                Estágio 3: Consideração da Solução
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-green-700 font-medium">Principal Solução para o Problema/Desafio</Label>
                  <Textarea
                    value={formData.stages.solutionConsideration.mainSolution}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      stages: {
                        ...prev.stages,
                        solutionConsideration: { ...prev.stages.solutionConsideration, mainSolution: e.target.value }
                      }
                    }))}
                    placeholder="Ex: Melhor controle financeiro para tatuagem, Escolha do estilo ideal, Segurança e reputação do estúdio..."
                    className="border-green-200 focus:border-green-600 focus:ring-2 focus:ring-green-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-green-700 font-medium">Ideias de Conteúdo</Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addContentIdea('solutionConsideration')}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  {formData.stages.solutionConsideration.contentIdeas.map((idea, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={idea}
                        onChange={(e) => updateContentIdea('solutionConsideration', index, e.target.value)}
                        placeholder="Ex: Os melhores estúdios de tatuagem: um guia para sua escolha"
                        className="border-green-200 focus:border-green-600 focus:ring-2 focus:ring-green-200"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeContentIdea('solutionConsideration', index)}
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Estágio 4: Decisão de Compra */}
            <div className={`bg-gradient-to-r ${getStageColor('purchaseDecision')} p-6 rounded-lg border`}>
              <h3 className={`${getStageTextColor('purchaseDecision')} font-bold text-lg mb-4 flex items-center gap-2`}>
                {getStageIcon('purchaseDecision')}
                Estágio 4: Decisão de Compra
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-purple-700 font-medium">Produto/Serviço da 99Tattoo</Label>
                  <Textarea
                    value={formData.stages.purchaseDecision.productService}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      stages: {
                        ...prev.stages,
                        purchaseDecision: { ...prev.stages.purchaseDecision, productService: e.target.value }
                      }
                    }))}
                    placeholder="Ex: Serviços de Tatuagem Personalizada, Agendamento com Tatuadores Especialistas, Tatuagem em Eventos..."
                    className="border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-purple-700 font-medium">Ideias de Conteúdo</Label>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addContentIdea('purchaseDecision')}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  {formData.stages.purchaseDecision.contentIdeas.map((idea, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={idea}
                        onChange={(e) => updateContentIdea('purchaseDecision', index, e.target.value)}
                        placeholder="Ex: Por que a 99Tattoo é a escolha certa para sua próxima tatuagem"
                        className="border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => removeContentIdea('purchaseDecision', index)}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
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
                {journey ? 'Atualizar' : 'Criar'} Jornada
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyForm;
