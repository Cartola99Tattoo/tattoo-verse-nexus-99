
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Target, TrendingUp, Users, Lightbulb } from 'lucide-react';
import { CustomerJourney, CreateJourneyData } from '@/types/journey';
import { Persona } from '@/types/persona';
import JourneyCard from './JourneyCard';
import JourneyForm from './JourneyForm';
import { toast } from '@/hooks/use-toast';

interface JourneyManagerProps {
  personas: Persona[];
}

const JourneyManager = ({ personas }: JourneyManagerProps) => {
  const [journeys, setJourneys] = useState<CustomerJourney[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJourney, setEditingJourney] = useState<CustomerJourney | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJourneys = journeys.filter(journey =>
    journey.personaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(journey.stages).some(stage => 
      stage.definition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.mainProblem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.mainSolution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stage.productService?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCreateJourney = (data: CreateJourneyData) => {
    const newJourney: CustomerJourney = {
      id: Date.now().toString(),
      personaId: data.personaId,
      personaName: data.personaName,
      stages: {
        discovery: {
          id: `${Date.now()}-discovery`,
          title: data.stages.discovery.title,
          definition: data.stages.discovery.definition,
          contentIdeas: data.stages.discovery.contentIdeas || []
        },
        problemRecognition: {
          id: `${Date.now()}-problem`,
          title: data.stages.problemRecognition.title,
          mainProblem: data.stages.problemRecognition.mainProblem,
          contentIdeas: data.stages.problemRecognition.contentIdeas || []
        },
        solutionConsideration: {
          id: `${Date.now()}-solution`,
          title: data.stages.solutionConsideration.title,
          mainSolution: data.stages.solutionConsideration.mainSolution,
          contentIdeas: data.stages.solutionConsideration.contentIdeas || []
        },
        purchaseDecision: {
          id: `${Date.now()}-purchase`,
          title: data.stages.purchaseDecision.title,
          productService: data.stages.purchaseDecision.productService,
          contentIdeas: data.stages.purchaseDecision.contentIdeas || []
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setJourneys(prev => [...prev, newJourney]);
    setShowForm(false);
    toast({
      title: "Sucesso!",
      description: "Jornada de compra criada com sucesso!"
    });
  };

  const handleEditJourney = (data: CreateJourneyData) => {
    if (!editingJourney) return;

    const updatedJourney: CustomerJourney = {
      ...editingJourney,
      personaId: data.personaId,
      personaName: data.personaName,
      stages: {
        discovery: {
          ...editingJourney.stages.discovery,
          definition: data.stages.discovery.definition,
          contentIdeas: data.stages.discovery.contentIdeas || []
        },
        problemRecognition: {
          ...editingJourney.stages.problemRecognition,
          mainProblem: data.stages.problemRecognition.mainProblem,
          contentIdeas: data.stages.problemRecognition.contentIdeas || []
        },
        solutionConsideration: {
          ...editingJourney.stages.solutionConsideration,
          mainSolution: data.stages.solutionConsideration.mainSolution,
          contentIdeas: data.stages.solutionConsideration.contentIdeas || []
        },
        purchaseDecision: {
          ...editingJourney.stages.purchaseDecision,
          productService: data.stages.purchaseDecision.productService,
          contentIdeas: data.stages.purchaseDecision.contentIdeas || []
        }
      },
      updated_at: new Date().toISOString(),
    };

    setJourneys(prev => prev.map(j => 
      j.id === editingJourney.id ? updatedJourney : j
    ));
    setEditingJourney(null);
    setShowForm(false);
    toast({
      title: "Sucesso!",
      description: "Jornada de compra atualizada com sucesso!"
    });
  };

  const handleEdit = (journey: CustomerJourney) => {
    setEditingJourney(journey);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingJourney(null);
  };

  if (showForm) {
    return (
      <JourneyForm
        journey={editingJourney || undefined}
        personas={personas}
        onSave={editingJourney ? handleEditJourney : handleCreateJourney}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-xl font-black">
              <Target className="h-6 w-6" />
              Jornada de Compra
            </CardTitle>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Jornada
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 h-4 w-4" />
                <Input
                  placeholder="Buscar jornadas por persona ou conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full"></div>
                <span>{journeys.length} jornadas mapeadas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      {journeys.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-blue-800">Total</span>
              </div>
              <p className="text-2xl font-black text-blue-600">{journeys.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-800">Com Personas</span>
              </div>
              <p className="text-2xl font-black text-green-600">
                {journeys.filter(j => j.personaId).length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                <span className="font-bold text-purple-800">Ideias</span>
              </div>
              <p className="text-sm font-medium text-purple-600">
                {journeys.reduce((total, journey) => 
                  total + Object.values(journey.stages).reduce((stageTotal, stage) => 
                    stageTotal + stage.contentIdeas.length, 0
                  ), 0
                )} total
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="font-bold text-orange-800">Estágios</span>
              </div>
              <p className="text-sm font-medium text-orange-600">
                4 por jornada
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Journeys Grid */}
      {filteredJourneys.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJourneys.map((journey) => (
            <JourneyCard
              key={journey.id}
              journey={journey}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : journeys.length === 0 ? (
        <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <Target className="h-16 w-16 mx-auto text-red-300 mb-4" />
              <h3 className="text-xl font-bold text-red-600 mb-2">Nenhuma Jornada Mapeada</h3>
              <p className="text-gray-600 mb-6">
                Comece criando suas primeiras jornadas de compra para mapear o caminho dos seus clientes.
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Jornada
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
          <CardContent className="p-12 text-center">
            <Search className="h-16 w-16 mx-auto text-red-300 mb-4" />
            <h3 className="text-xl font-bold text-red-600 mb-2">Nenhuma Jornada Encontrada</h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca ou criar uma nova jornada.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JourneyManager;
