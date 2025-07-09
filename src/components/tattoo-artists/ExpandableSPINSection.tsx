
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, Save, CheckCircle, Loader2 } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  placeholder: string;
  tooltip?: string;
}

interface ExpandableSPINSectionProps {
  title: string;
  sectionKey: string;
  icon: React.ReactNode;
  questions: Question[];
  responses: Record<string, string>;
  onResponseChange: (questionId: string, value: string) => void;
  onSaveSection: (sectionKey: string, responses: Record<string, string>) => Promise<boolean>;
  isLoading?: boolean;
  bgColor?: string;
  borderColor?: string;
}

const ExpandableSPINSection: React.FC<ExpandableSPINSectionProps> = ({
  title,
  sectionKey,
  icon,
  questions,
  responses,
  onResponseChange,
  onSaveSection,
  isLoading = false,
  bgColor = "bg-white",
  borderColor = "border-gray-200"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Verificar se a seção está completa
  const isComplete = questions.every(q => responses[q.id] && responses[q.id].trim());
  const completedQuestions = questions.filter(q => responses[q.id] && responses[q.id].trim()).length;

  const handleSaveSection = async () => {
    setIsSaving(true);
    try {
      // Filtrar apenas as respostas desta seção
      const sectionResponses: Record<string, string> = {};
      questions.forEach(q => {
        if (responses[q.id] && responses[q.id].trim()) {
          sectionResponses[q.id] = responses[q.id];
        }
      });

      const success = await onSaveSection(sectionKey, sectionResponses);
      if (success) {
        // Feedback visual já é tratado no hook
      }
    } catch (error) {
      console.error('Erro ao salvar seção:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={`${bgColor} ${borderColor} border-2 rounded-xl transition-all duration-200 hover:shadow-md`}>
      <CardHeader 
        className="cursor-pointer transition-colors hover:bg-gray-50 rounded-t-xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-800">
            {icon}
            <span>{title}</span>
          </CardTitle>
          <div className="flex items-center gap-3">
            {/* Status da seção */}
            <div className="flex items-center gap-2">
              {isComplete ? (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Completo</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  {completedQuestions}/{questions.length} perguntas
                </div>
              )}
            </div>
            
            {/* Ícone de expansão */}
            <div className="transition-transform duration-200">
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-6">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <span className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  {question.text}
                </span>
              </label>
              
              <Textarea
                placeholder={question.placeholder}
                value={responses[question.id] || ''}
                onChange={(e) => onResponseChange(question.id, e.target.value)}
                className="min-h-[100px] resize-none border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg"
                title={question.tooltip}
              />
            </div>
          ))}

          {/* Botão de salvar seção */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              onClick={handleSaveSection}
              disabled={isSaving || isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Respostas
                </>
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ExpandableSPINSection;
