
import React from 'react';
import { Target, BarChart3, AlertTriangle, TrendingDown } from 'lucide-react';
import ExpandableSPINSection from './ExpandableSPINSection';

interface SPINQuestionnaireProps {
  responses: Record<string, string>;
  onUpdate: (responses: Record<string, string>) => void;
  onSave?: () => Promise<void>;
  onSaveSection: (section: string, answers: Record<string, string>) => Promise<boolean>;
  isLoading?: boolean;
}

const SPINQuestionnaire: React.FC<SPINQuestionnaireProps> = ({
  responses,
  onUpdate,
  onSaveSection,
  isLoading = false
}) => {
  const spinSections = [
    {
      key: 'situacao',
      title: 'Situação Atual',
      icon: <BarChart3 className="h-5 w-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      questions: [
        {
          id: 'situacao-1',
          text: 'Quantas tatuagens você realiza por mês em média?',
          placeholder: 'Ex: Realizo entre 20 a 25 tatuagens por mês, variando conforme a demanda e complexidade dos trabalhos...',
          tooltip: 'Descreva seu volume de trabalho atual'
        },
        {
          id: 'situacao-2',
          text: 'Qual é sua especialidade e há quanto tempo você tatua?',
          placeholder: 'Ex: Especializo-me em realismo há 8 anos, também faço blackwork e ornamental...',
          tooltip: 'Conte sobre seu estilo e experiência'
        },
        {
          id: 'situacao-3',
          text: 'Como você atualmente divulga seu trabalho e atrai clientes?',
          placeholder: 'Ex: Uso principalmente Instagram, indicações de clientes e parcerias com outros estúdios...',
          tooltip: 'Descreva suas estratégias de marketing atuais'
        }
      ]
    },
    {
      key: 'problemas',
      title: 'Problemas e Desafios',
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      questions: [
        {
          id: 'problemas-1',
          text: 'Quais são suas principais dificuldades para atrair e conquistar novos clientes?',
          placeholder: 'Ex: Dificuldade em alcançar meu público-alvo ideal, muita concorrência com preços baixos...',
          tooltip: 'Identifique os obstáculos em sua captação de clientes'
        },
        {
          id: 'problemas-2',
          text: 'Você sente que não está aproveitando todo seu potencial profissional? Por quê?',
          placeholder: 'Ex: Às vezes aceito valores menores para não perder cliente, especialmente em épocas mais devagar...',
          tooltip: 'Reflita sobre limitações em seu crescimento'
        },
        {
          id: 'problemas-3',
          text: 'O que mais te frustra na gestão do seu negócio como tatuador?',
          placeholder: 'Ex: Gostaria de melhorar minha gestão de tempo e ter um processo mais organizado de agendamento...',
          tooltip: 'Pense nos aspectos administrativos que te incomodam'
        }
      ]
    },
    {
      key: 'implicacoes',
      title: 'Impactos e Consequências',
      icon: <TrendingDown className="h-5 w-5 text-red-600" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      questions: [
        {
          id: 'implicacoes-1',
          text: 'Se esses problemas persistirem, como isso pode afetar seu futuro profissional?',
          placeholder: 'Ex: Pode limitar significativamente meu crescimento e me manter sempre dependente de indicações...',
          tooltip: 'Considere as consequências de longo prazo'
        },
        {
          id: 'implicacoes-2',
          text: 'Como esses desafios impactam sua satisfação pessoal e qualidade de vida?',
          placeholder: 'Ex: Me sinto estagnado artisticamente, não consigo evoluir como gostaria devido à falta de tempo...',
          tooltip: 'Reflita sobre o impacto pessoal dos problemas'
        }
      ]
    },
    {
      key: 'necessidades',
      title: 'Necessidades e Soluções',
      icon: <Target className="h-5 w-5 text-green-600" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      questions: [
        {
          id: 'necessidades-1',
          text: 'Como seria sua situação ideal se você resolvesse esses problemas?',
          placeholder: 'Ex: Teria mais tempo para me dedicar à arte, aumentaria meu faturamento e teria mais satisfação profissional...',
          tooltip: 'Visualize seu estado futuro desejado'
        },
        {
          id: 'necessidades-2',
          text: 'Que benefícios específicos você espera alcançar ao superar esses desafios?',
          placeholder: 'Ex: Maior satisfação no trabalho, melhor reconhecimento da minha arte e preços mais justos pelo meu trabalho...',
          tooltip: 'Liste os benefícios concretos que você busca'
        }
      ]
    }
  ];

  const handleResponseChange = (questionId: string, value: string) => {
    const updatedResponses = {
      ...responses,
      [questionId]: value
    };
    onUpdate(updatedResponses);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-red-800 mb-3 flex items-center justify-center gap-3">
          <Target className="h-7 w-7" />
          Diagnóstico Estratégico SPIN
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete cada seção para construir um diagnóstico estratégico do seu negócio. 
          Você pode salvar suas respostas seção por seção conforme avança.
        </p>
      </div>

      <div className="space-y-6">
        {spinSections.map((section) => (
          <ExpandableSPINSection
            key={section.key}
            title={section.title}
            sectionKey={section.key}
            icon={section.icon}
            questions={section.questions}
            responses={responses}
            onResponseChange={handleResponseChange}
            onSaveSection={onSaveSection}
            isLoading={isLoading}
            bgColor={section.bgColor}
            borderColor={section.borderColor}
          />
        ))}
      </div>

      {/* Resumo de progresso */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 mt-8">
        <h3 className="font-semibold text-red-800 mb-3">📊 Progresso do Diagnóstico</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {spinSections.map((section) => {
            const sectionResponses = section.questions.filter(q => 
              responses[q.id] && responses[q.id].trim()
            );
            const isComplete = sectionResponses.length === section.questions.length;
            
            return (
              <div key={section.key} className="text-center">
                <div className={`text-2xl font-bold ${isComplete ? 'text-green-700' : 'text-gray-500'}`}>
                  {sectionResponses.length}/{section.questions.length}
                </div>
                <div className="text-sm text-gray-600">{section.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SPINQuestionnaire;
