
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Target, Lightbulb, ShoppingCart } from 'lucide-react';
import { CustomerJourney } from '@/types/journey';

interface JourneyCardProps {
  journey: CustomerJourney;
  onEdit: (journey: CustomerJourney) => void;
}

const JourneyCard = ({ journey, onEdit }: JourneyCardProps) => {
  const getStageIcon = (stageKey: string) => {
    switch (stageKey) {
      case 'discovery': return <Lightbulb className="h-4 w-4" />;
      case 'problemRecognition': return <Target className="h-4 w-4" />;
      case 'solutionConsideration': return <User className="h-4 w-4" />;
      case 'purchaseDecision': return <ShoppingCart className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getStageColor = (stageKey: string) => {
    switch (stageKey) {
      case 'discovery': return 'from-blue-500 to-blue-700';
      case 'problemRecognition': return 'from-yellow-500 to-yellow-700';
      case 'solutionConsideration': return 'from-green-500 to-green-700';
      case 'purchaseDecision': return 'from-purple-500 to-purple-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg border-b border-red-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-2 rounded-full">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-red-600 font-bold text-xl">
                Jornada {journey.personaName ? `- ${journey.personaName}` : ''}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-red-100 text-red-700 border-red-300">
                  4 Estágios
                </Badge>
                {journey.personaName && (
                  <Badge variant="outline" className="border-red-200 text-red-600">
                    {journey.personaName}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(journey)}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {Object.entries(journey.stages).map(([key, stage]) => (
          <div key={key} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className={`bg-gradient-to-r ${getStageColor(key)} p-1.5 rounded-full`}>
                {getStageIcon(key)}
                <span className="sr-only">{stage.title}</span>
              </div>
              <span className="font-semibold text-gray-800">{stage.title}</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {stage.definition && (
                <p className="line-clamp-2">{stage.definition}</p>
              )}
              {stage.mainProblem && (
                <p className="line-clamp-2"><strong>Problema:</strong> {stage.mainProblem}</p>
              )}
              {stage.mainSolution && (
                <p className="line-clamp-2"><strong>Solução:</strong> {stage.mainSolution}</p>
              )}
              {stage.productService && (
                <p className="line-clamp-2"><strong>Produto/Serviço:</strong> {stage.productService}</p>
              )}
              <p className="text-xs text-gray-500">
                {stage.contentIdeas.length} ideias de conteúdo
              </p>
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-red-100">
          <p className="text-xs text-gray-500">
            Criado em: {new Date(journey.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyCard;
