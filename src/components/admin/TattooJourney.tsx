
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { Client } from "@/services/interfaces/IClientService";

interface TattooJourneyProps {
  client: Client;
}

const TattooJourney = ({ client }: TattooJourneyProps) => {
  const journeySteps = [
    {
      id: "registration",
      title: "Cadastro Completo",
      description: "Cliente registrado no sistema",
      completed: true
    },
    {
      id: "idea_submission", 
      title: "Ideia Enviada",
      description: "Cliente enviou sua ideia de tatuagem",
      completed: client.status !== "new"
    },
    {
      id: "quote_received",
      title: "Orçamento Recebido", 
      description: "Orçamento foi enviado para o cliente",
      completed: ["interested", "pending", "completed", "returning", "vip"].includes(client.status)
    },
    {
      id: "appointment_scheduled",
      title: "Agendamento Realizado",
      description: "Sessão de tatuagem agendada",
      completed: ["pending", "completed", "returning", "vip"].includes(client.status)
    },
    {
      id: "tattoo_completed", 
      title: "Tatuagem Concluída",
      description: "Primeira tatuagem finalizada",
      completed: ["completed", "returning", "vip"].includes(client.status)
    },
    {
      id: "follow_up",
      title: "Acompanhamento",
      description: "Cuidados pós-tatuagem orientados", 
      completed: ["returning", "vip"].includes(client.status)
    }
  ];

  const getNextStep = () => {
    const nextStep = journeySteps.find(step => !step.completed);
    if (!nextStep) return "Jornada completa! Cliente fidelizado.";
    
    const suggestions = {
      idea_submission: "Solicite que o cliente envie sua ideia de tatuagem",
      quote_received: "Prepare e envie um orçamento personalizado",
      appointment_scheduled: "Entre em contato para agendar a sessão",
      tattoo_completed: "Confirme o agendamento e prepare-se para a sessão",
      follow_up: "Envie orientações de cuidados pós-tatuagem"
    };
    
    return suggestions[nextStep.id as keyof typeof suggestions] || "Continue o atendimento";
  };

  const completedSteps = journeySteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / journeySteps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Jornada 99Tattoo</span>
          <Badge variant="outline">
            {completedSteps}/{journeySteps.length} Etapas
          </Badge>
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {journeySteps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-3">
              {step.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className={`font-medium text-sm ${step.completed ? 'text-green-800' : 'text-gray-600'}`}>
                  {step.title}
                </h4>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < journeySteps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-300 mt-0.5" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-sm text-blue-800 mb-1">Próximo Passo:</h4>
          <p className="text-sm text-blue-700">{getNextStep()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TattooJourney;
