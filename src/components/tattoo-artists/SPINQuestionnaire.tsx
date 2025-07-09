import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  BarChart3, 
  AlertTriangle, 
  TrendingDown, 
  Target,
  Info,
  CheckCircle,
  Save,
  Edit,
  ChevronDown,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SPINResponses {
  [key: string]: string;
}

interface SPINSectionState {
  [key: string]: boolean;
}

interface SPINQuestionnaireProps {
  responses: SPINResponses;
  onUpdate: (responses: SPINResponses) => void;
  onSave: () => void;
  onSaveSection: (section: string, answers: Record<string, string>) => Promise<boolean>;
  isLoading?: boolean;
}

const spinSections = {
  situacao: {
    title: "📊 Situação Atual",
    description: "Vamos entender sua situação atual no mercado",
    color: "bg-blue-50 border-blue-200",
    titleColor: "text-blue-700",
    icon: BarChart3,
    questions: [
      {
        id: "situacao_1",
        question: "Quantas tatuagens você realiza em média por mês atualmente?",
        placeholder: "Ex: Realizo entre 15 a 20 tatuagens por mês, dependendo da complexidade...",
        tooltip: "Esta informação nos ajuda a entender seu volume atual de trabalho"
      },
      {
        id: "situacao_2", 
        question: "Qual é o seu principal estilo de tatuagem e há quanto tempo atua profissionalmente?",
        placeholder: "Ex: Especializo-me em realismo há 8 anos, também faço blackwork...",
        tooltip: "Queremos conhecer sua especialização e experiência"
      },
      {
        id: "situacao_3",
        question: "Como você atualmente divulga seu trabalho e atrai novos clientes?",
        placeholder: "Ex: Uso principalmente Instagram, indicações de clientes, parcerias...",
        tooltip: "Entender seus canais de marketing atuais"
      }
    ]
  },
  problemas: {
    title: "❗ Problemas e Desafios",
    description: "Identifique os principais obstáculos que você enfrenta",
    color: "bg-orange-50 border-orange-200",
    titleColor: "text-orange-700",
    icon: AlertTriangle,
    questions: [
      {
        id: "problemas_1",
        question: "Quais são os maiores desafios que você enfrenta para atrair novos clientes?",
        placeholder: "Ex: Dificuldade em alcançar meu público-alvo, concorrência alta...",
        tooltip: "Identificar obstáculos na aquisição de clientes"
      },
      {
        id: "problemas_2",
        question: "Você sente que está aproveitando todo o seu potencial de faturamento?",
        placeholder: "Ex: Às vezes aceito valores baixos para não perder cliente...",
        tooltip: "Entender desafios na precificação e aproveitamento do potencial"
      },
      {
        id: "problemas_3",
        question: "Há alguma área do seu trabalho que você gostaria de melhorar?",
        placeholder: "Ex: Gestão de tempo, técnicas específicas, relacionamento com clientes...",
        tooltip: "Identificar oportunidades de melhoria"
      }
    ]
  },
  implicacoes: {
    title: "⚠️ Impactos e Consequências",
    description: "Como esses problemas afetam seu crescimento",
    color: "bg-red-50 border-red-200",
    titleColor: "text-red-700",
    icon: TrendingDown,
    questions: [
      {
        id: "implicacoes_1",
        question: "Se esses desafios persistirem, qual o impacto no crescimento do seu estúdio a longo prazo?",
        placeholder: "Ex: Pode limitar meu crescimento, perder clientes para concorrência...",
        tooltip: "Avaliar consequências futuras dos problemas atuais"
      },
      {
        id: "implicacoes_2",
        question: "Como a falta de tempo para aprimoramento técnico afeta sua satisfação profissional?",
        placeholder: "Ex: Me sinto estagnado, não consigo evoluir minha arte...",
        tooltip: "Entender impacto pessoal e profissional"
      }
    ]
  },
  necessidades: {
    title: "💡 Necessidades e Soluções",
    description: "Defina o cenário ideal para seu estúdio",
    color: "bg-green-50 border-green-200",
    titleColor: "text-green-700",
    icon: Target,
    questions: [
      {
        id: "necessidades_1",
        question: "Se você pudesse resolver seus principais problemas, como isso impactaria seu dia a dia e seus resultados?",
        placeholder: "Ex: Teria mais tempo para me dedicar à arte, aumentaria meu faturamento...",
        tooltip: "Visualizar benefícios da solução"
      },
      {
        id: "necessidades_2",
        question: "Qual seria o benefício de ter mais clientes que valorizam seu estilo artístico?",
        placeholder: "Ex: Maior satisfação no trabalho, melhor reconhecimento, preços justos...",
        tooltip: "Identificar valor da qualificação de clientes"
      }
    ]
  }
};

const SPINQuestionnaire: React.FC<SPINQuestionnaireProps> = ({ 
  responses, 
  onUpdate, 
  onSave, 
  onSaveSection,
  isLoading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localResponses, setLocalResponses] = useState<SPINResponses>(responses);
  const [expandedSections, setExpandedSections] = useState<SPINSectionState>({
    situacao: true,
    problemas: false,
    implicacoes: false,
    necessidades: false
  });
  const [savingSections, setSavingSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocalResponses(responses);
  }, [responses]);

  const totalQuestions = Object.values(spinSections).reduce((acc, section) => acc + section.questions.length, 0);
  const answeredQuestions = Object.keys(localResponses).filter(key => localResponses[key]?.trim()).length;
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  const handleResponseChange = (questionId: string, value: string) => {
    const updated = { ...localResponses, [questionId]: value };
    setLocalResponses(updated);
    onUpdate(updated);
  };

  const handleSaveSection = async (sectionKey: string) => {
    setSavingSections(prev => ({ ...prev, [sectionKey]: true }));
    
    try {
      const section = spinSections[sectionKey as keyof typeof spinSections];
      const sectionAnswers: Record<string, string> = {};
      
      section.questions.forEach(q => {
        if (localResponses[q.id]) {
          sectionAnswers[q.id] = localResponses[q.id];
        }
      });

      const success = await onSaveSection(sectionKey, sectionAnswers);
      
    } catch (error) {
      console.error('Erro ao salvar seção:', error);
    } finally {
      setSavingSections(prev => ({ ...prev, [sectionKey]: false }));
    }
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const getSectionProgress = (sectionKey: string) => {
    const section = spinSections[sectionKey as keyof typeof spinSections];
    const sectionQuestions = section.questions.length;
    const answeredInSection = section.questions.filter(q => localResponses[q.id]?.trim()).length;
    return Math.round((answeredInSection / sectionQuestions) * 100);
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-red-500 cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const isCompleted = progressPercentage === 100;
  const hasAnyResponses = answeredQuestions > 0;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-red-700 mb-2 flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Diagnóstico Estratégico
              </h2>
              <p className="text-red-600">
                Responda às perguntas por seção para que possamos entender melhor seu negócio e oferecer soluções personalizadas
              </p>
            </div>
            <div className="text-right">
              {isCompleted ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completo
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-300 text-red-700">
                  {answeredQuestions}/{totalQuestions} Respondidas
                </Badge>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-red-700">Progresso do Diagnóstico</span>
              <span className="text-sm font-bold text-red-800">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {!isCompleted && (
              <p className="text-xs text-red-600 mt-2">
                Complete o diagnóstico seção por seção para receber insights personalizados da nossa equipe!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {hasAnyResponses && !isEditing && (
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {isCompleted ? "Diagnóstico completo! " : "Diagnóstico em andamento. "}
            Você pode editar suas respostas a qualquer momento.
          </p>
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Respostas
          </Button>
        </div>
      )}

      {(!hasAnyResponses || isEditing) && (
        <div className="space-y-4">
          {Object.entries(spinSections).map(([sectionKey, section]) => {
            const sectionProgress = getSectionProgress(sectionKey);
            const isExpanded = expandedSections[sectionKey];
            const sectionHasResponses = section.questions.some(q => localResponses[q.id]?.trim());
            const isSaving = savingSections[sectionKey];

            return (
              <Card key={sectionKey} className={`${section.color} shadow-lg transition-all duration-300`}>
                <Collapsible open={isExpanded} onOpenChange={() => toggleSection(sectionKey)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-white/20 transition-colors rounded-t-lg">
                      <CardTitle className={`${section.titleColor} text-xl flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <section.icon className="h-5 w-5" />
                          {section.title}
                          <Badge className="bg-white text-gray-700">
                            {sectionProgress}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {sectionHasResponses && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-5 w-5 transition-transform duration-200" />
                          )}
                        </div>
                      </CardTitle>
                      <p className="text-gray-600">{section.description}</p>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="transition-all duration-300 ease-in-out">
                    <CardContent className="space-y-4 pt-0">
                      {section.questions.map((q, index) => (
                        <div key={q.id} className="bg-white p-4 rounded-lg border border-gray-200">
                          <Label className="text-gray-800 font-medium flex items-center">
                            {index + 1}. {q.question}
                            <InfoTooltip content={q.tooltip} />
                          </Label>
                          <Textarea
                            value={localResponses[q.id] || ''}
                            onChange={(e) => handleResponseChange(q.id, e.target.value)}
                            placeholder={q.placeholder}
                            className="mt-2 rounded-lg border-gray-300 focus:border-red-500"
                            rows={3}
                            maxLength={500}
                          />
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                              {(localResponses[q.id] || '').length}/500 caracteres
                            </span>
                            {localResponses[q.id]?.trim() && (
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Respondida
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex justify-center pt-4">
                        <Button
                          onClick={() => handleSaveSection(sectionKey)}
                          disabled={isSaving}
                          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 rounded-lg"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Salvar Seção
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}

          <div className="flex justify-center pt-4">
            <Button
              onClick={() => {
                onSave();
                setIsEditing(false);
              }}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 rounded-lg"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Finalizar Diagnóstico
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {hasAnyResponses && !isEditing && (
        <div className="space-y-4">
          {Object.entries(spinSections).map(([sectionKey, section]) => {
            const sectionResponses = section.questions.filter(q => localResponses[q.id]?.trim());
            if (sectionResponses.length === 0) return null;

            return (
              <Card key={sectionKey} className={`${section.color} shadow-lg`}>
                <CardHeader>
                  <CardTitle className={`${section.titleColor} text-lg flex items-center gap-2`}>
                    <section.icon className="h-5 w-5" />
                    {section.title}
                    <Badge className="bg-white text-gray-700">
                      {sectionResponses.length}/{section.questions.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {section.questions.map((q, index) => {
                    const response = localResponses[q.id];
                    if (!response?.trim()) return null;

                    return (
                      <div key={q.id} className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="font-medium text-gray-800 text-sm mb-2">
                          {index + 1}. {q.question}
                        </p>
                        <p className="text-gray-700 text-sm">
                          {response}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SPINQuestionnaire;
