
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Calendar, Palette, User, Star } from "lucide-react";

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
}

const TattooJourney = () => {
  const journeySteps: JourneyStep[] = [
    {
      id: 'registration',
      title: 'Cadastro Completo',
      description: 'Perfil criado com sucesso',
      completed: true,
      icon: <User className="h-4 w-4" />
    },
    {
      id: 'preferences',
      title: 'Preferências Definidas',
      description: 'Estilo e preferências de tatuagem configurados',
      completed: true,
      icon: <Palette className="h-4 w-4" />
    },
    {
      id: 'consultation',
      title: 'Consulta Agendada',
      description: 'Primeira consulta para discussão da ideia',
      completed: false,
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: 'design',
      title: 'Design Aprovado',
      description: 'Arte finalizada e aprovada pelo cliente',
      completed: false,
      icon: <Star className="h-4 w-4" />
    },
    {
      id: 'appointment',
      title: 'Sessão Agendada',
      description: 'Data e horário da tatuagem confirmados',
      completed: false,
      icon: <Calendar className="h-4 w-4" />
    }
  ];

  const completedSteps = journeySteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / journeySteps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-purple-600" />
          Sua Jornada 99Tattoo
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso</span>
            <span>{completedSteps} de {journeySteps.length} etapas</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {journeySteps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              step.completed 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
            }`}>
              {step.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {step.icon}
                <h4 className={`font-medium ${
                  step.completed ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {step.title}
                </h4>
                {step.completed && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Concluído
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>
            </div>
          </div>
        ))}

        {progressPercentage < 100 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Próximo Passo</h4>
            <p className="text-sm text-blue-600">
              {journeySteps.find(step => !step.completed)?.description || 'Continue sua jornada!'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TattooJourney;
