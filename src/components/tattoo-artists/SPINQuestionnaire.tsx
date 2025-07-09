
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  AlertTriangle, 
  TrendingDown, 
  Target,
  Info,
  CheckCircle,
  Save,
  Edit
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SPINResponses {
  [key: string]: string;
}

interface SPINQuestionnaireProps {
  responses: SPINResponses;
  onUpdate: (responses: SPINResponses) => void;
  onSave: () => void;
  isLoading?: boolean;
}

const spinQuestions = {
  situation: {
    title: "📊 Situação Atual",
    description: "Vamos entender sua situação atual no mercado",
    color: "bg-blue-50 border-blue-200",
    titleColor: "text-blue-700",
    questions: [
      {
        id: "situation_1",
        question: "Quantas tatuagens você realiza em média por mês atualmente?",
        placeholder: "Ex: Realizo entre 15 a 20 tatuagens por mês, dependendo da complexidade...",
        tooltip: "Esta informação nos ajuda a entender seu volume atual de trabalho"
      },
      {
        id: "situation_2", 
        question: "Qual é o seu principal estilo de tatuagem e há quanto tempo atua profissionalmente?",
        placeholder: "Ex: Especializo-me em realismo há 8 anos, também faço blackwork...",
        tooltip: "Queremos conhecer sua especialização e experiência"
      },
      {
        id: "situation_3",
        question: "Como você atualmente divulga seu trabalho e atrai novos clientes?",
        placeholder: "Ex: Uso principalmente Instagram, indicações de clientes, parcerias...",
        tooltip: "Entender seus canais de marketing atuais"
      },
      {
        id: "situation_4",
        question: "Qual é a faixa de preço que você pratica e como define seus valores?",
        placeholder: "Ex: Cobro entre R$ 200-800 por sessão, baseado no tempo e complexidade...",
        tooltip: "Compreender sua estratégia de precificação"
      }
    ]
  },
  problem: {
    title: "❗ Problemas e Desafios",
    description: "Identifique os principais obstáculos que você enfrenta",
    color: "bg-orange-50 border-orange-200",
    titleColor: "text-orange-700",
    questions: [
      {
        id: "problem_1",
        question: "Quais são os maiores desafios que você enfrenta para atrair novos clientes?",
        placeholder: "Ex: Dificuldade em alcançar meu público-alvo, concorrência alta...",
        tooltip: "Identificar obstáculos na aquisição de clientes"
      },
      {
        id: "problem_2",
        question: "Você sente dificuldades em precificar seu trabalho de forma justa?",
        placeholder: "Ex: Às vezes aceito valores baixos para não perder cliente...",
        tooltip: "Entender desafios na precificação"
      },
      {
        id: "problem_3",
        question: "Qual é a sua maior dificuldade no dia a dia do estúdio?",
        placeholder: "Ex: Falta de organização, gestão de tempo, materiais...",
        tooltip: "Identificar problemas operacionais"
      },
      {
        id: "problem_4",
        question: "Você tem dificuldades para se manter atualizado com novas técnicas?",
        placeholder: "Ex: Falta tempo para cursos, recursos para equipamentos...",
        tooltip: "Compreender desafios de desenvolvimento profissional"
      }
    ]
  },
  implication: {
    title: "⚠️ Impactos e Consequências",
    description: "Como esses problemas afetam seu crescimento",
    color: "bg-red-50 border-red-200",
    titleColor: "text-red-700",
    questions: [
      {
        id: "implication_1",
        question: "Se esses desafios persistirem, qual o impacto no crescimento do seu estúdio a longo prazo?",
        placeholder: "Ex: Pode limitar meu crescimento, perder clientes para concorrência...",
        tooltip: "Avaliar consequências futuras dos problemas atuais"
      },
      {
        id: "implication_2",
        question: "Como a precificação inadequada afeta sua motivação e sustentabilidade financeira?",
        placeholder: "Ex: Trabalho mais e ganho menos, afeta minha qualidade de vida...",
        tooltip: "Entender impacto pessoal e financeiro"
      },
      {
        id: "implication_3",
        question: "Qual o custo de oportunidade de não ter uma gestão eficiente do estúdio?",
        placeholder: "Ex: Perco tempo que poderia usar para tatuar ou me aperfeiçoar...",
        tooltip: "Identificar oportunidades perdidas"
      }
    ]
  },
  need: {
    title: "💡 Necessidades e Soluções",
    description: "Defina o cenário ideal para seu estúdio",
    color: "bg-green-50 border-green-200",
    titleColor: "text-green-700",
    questions: [
      {
        id: "need_1",
        question: "Como seria o cenário ideal para o seu estúdio em termos de clientes e faturamento?",
        placeholder: "Ex: Gostaria de ter agenda sempre cheia com clientes que valorizam meu trabalho...",
        tooltip: "Visualizar objetivos de crescimento"
      },
      {
        id: "need_2",
        question: "Quais recursos ou ferramentas poderiam te ajudar a superar esses desafios?",
        placeholder: "Ex: Sistema de gestão, cursos online, mentoria, marketing digital...",
        tooltip: "Identificar necessidades de recursos"
      },
      {
        id: "need_3",
        question: "O que você mais precisa para atingir seus objetivos profissionais?",
        placeholder: "Ex: Mais conhecimento em gestão, networking, equipamentos melhores...",
        tooltip: "Priorizar necessidades principais"
      },
      {
        id: "need_4",
        question: "Como uma comunidade de tatuadores poderia apoiar seu crescimento?",
        placeholder: "Ex: Troca de experiências, parcerias, indicações, apoio técnico...",
        tooltip: "Entender valor da comunidade"
      }
    ]
  }
};

const SPINQuestionnaire: React.FC<SPINQuestionnaireProps> = ({ 
  responses, 
  onUpdate, 
  onSave, 
  isLoading = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localResponses, setLocalResponses] = useState<SPINResponses>(responses);

  // Calcular progresso de preenchimento
  const totalQuestions = Object.values(spinQuestions).reduce((acc, category) => acc + category.questions.length, 0);
  const answeredQuestions = Object.keys(localResponses).filter(key => localResponses[key]?.trim()).length;
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  const handleResponseChange = (questionId: string, value: string) => {
    const updated = { ...localResponses, [questionId]: value };
    setLocalResponses(updated);
    onUpdate(updated);
  };

  const handleSave = () => {
    onSave();
    setIsEditing(false);
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
      {/* Header com Progresso */}
      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-red-700 mb-2 flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Diagnóstico Estratégico
              </h2>
              <p className="text-red-600">
                Responda às perguntas para que possamos entender melhor seu negócio e oferecer soluções personalizadas
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

          {/* Barra de Progresso */}
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-red-700">Progresso do Diagnóstico</span>
              <span className="text-sm font-bold text-red-800">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {!isCompleted && (
              <p className="text-xs text-red-600 mt-2">
                Complete o diagnóstico para receber insights personalizados da nossa equipe!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controles de Edição */}
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

      {/* Seções SPIN */}
      {(!hasAnyResponses || isEditing) && (
        <>
          {Object.entries(spinQuestions).map(([categoryKey, category]) => (
            <Card key={categoryKey} className={`${category.color} shadow-lg`}>
              <CardHeader>
                <CardTitle className={`${category.titleColor} text-xl flex items-center gap-2`}>
                  {categoryKey === 'situation' && <BarChart3 className="h-5 w-5" />}
                  {categoryKey === 'problem' && <AlertTriangle className="h-5 w-5" />}
                  {categoryKey === 'implication' && <TrendingDown className="h-5 w-5" />}
                  {categoryKey === 'need' && <Target className="h-5 w-5" />}
                  {category.title}
                </CardTitle>
                <p className="text-gray-600">{category.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.questions.map((q, index) => (
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
              </CardContent>
            </Card>
          ))}

          {/* Botão de Salvar */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 rounded-lg"
              size="lg"
            >
              {isLoading ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Diagnóstico
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {/* Resumo das Respostas (Modo Visualização) */}
      {hasAnyResponses && !isEditing && (
        <div className="space-y-4">
          {Object.entries(spinQuestions).map(([categoryKey, category]) => {
            const categoryResponses = category.questions.filter(q => localResponses[q.id]?.trim());
            if (categoryResponses.length === 0) return null;

            return (
              <Card key={categoryKey} className={`${category.color} shadow-lg`}>
                <CardHeader>
                  <CardTitle className={`${category.titleColor} text-lg flex items-center gap-2`}>
                    {categoryKey === 'situation' && <BarChart3 className="h-5 w-5" />}
                    {categoryKey === 'problem' && <AlertTriangle className="h-5 w-5" />}
                    {categoryKey === 'implication' && <TrendingDown className="h-5 w-5" />}
                    {categoryKey === 'need' && <Target className="h-5 w-5" />}
                    {category.title}
                    <Badge className="bg-white text-gray-700">
                      {categoryResponses.length}/{category.questions.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.questions.map((q, index) => {
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
