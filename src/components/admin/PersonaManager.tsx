
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, Target, Heart, TrendingUp } from 'lucide-react';
import { Persona, CreatePersonaData } from '@/types/persona';
import PersonaCard from './PersonaCard';
import PersonaForm from './PersonaForm';
import { toast } from '@/hooks/use-toast';

const PersonaManager = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPersonas = personas.filter(persona =>
    persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    persona.occupation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePersona = (data: CreatePersonaData) => {
    const newPersona: Persona = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setPersonas(prev => [...prev, newPersona]);
    setShowForm(false);
    toast({
      title: "Sucesso!",
      description: "Persona criada com sucesso!"
    });
  };

  const handleEditPersona = (data: CreatePersonaData) => {
    if (!editingPersona) return;

    const updatedPersona: Persona = {
      ...editingPersona,
      ...data,
      updated_at: new Date().toISOString(),
    };

    setPersonas(prev => prev.map(p => 
      p.id === editingPersona.id ? updatedPersona : p
    ));
    setEditingPersona(null);
    setShowForm(false);
    toast({
      title: "Sucesso!",
      description: "Persona atualizada com sucesso!"
    });
  };

  const handleEdit = (persona: Persona) => {
    setEditingPersona(persona);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPersona(null);
  };

  if (showForm) {
    return (
      <PersonaForm
        persona={editingPersona || undefined}
        onSave={editingPersona ? handleEditPersona : handleCreatePersona}
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
              <Users className="h-6 w-6" />
              Gestão de Personas
            </CardTitle>
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Persona
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 h-4 w-4" />
                <Input
                  placeholder="Buscar personas por nome ou ocupação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full"></div>
                <span>{personas.length} personas criadas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      {personas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-blue-800">Total</span>
              </div>
              <p className="text-2xl font-black text-blue-600">{personas.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="h-5 w-5 text-green-600" />
                <span className="font-bold text-green-800">Idade Média</span>
              </div>
              <p className="text-2xl font-black text-green-600">
                {Math.round(personas.reduce((sum, p) => sum + p.age, 0) / personas.length)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-purple-600" />
                <span className="font-bold text-purple-800">Gêneros</span>
              </div>
              <p className="text-sm font-medium text-purple-600">
                {new Set(personas.map(p => p.gender)).size} diferentes
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="font-bold text-orange-800">Ocupações</span>
              </div>
              <p className="text-sm font-medium text-orange-600">
                {new Set(personas.map(p => p.occupation)).size} únicas
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Personas Grid */}
      {filteredPersonas.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPersonas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : personas.length === 0 ? (
        <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <Users className="h-16 w-16 mx-auto text-red-300 mb-4" />
              <h3 className="text-xl font-bold text-red-600 mb-2">Nenhuma Persona Criada</h3>
              <p className="text-gray-600 mb-6">
                Comece criando suas primeiras personas para entender melhor seu público-alvo.
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Persona
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
          <CardContent className="p-12 text-center">
            <Search className="h-16 w-16 mx-auto text-red-300 mb-4" />
            <h3 className="text-xl font-bold text-red-600 mb-2">Nenhuma Persona Encontrada</h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca ou criar uma nova persona.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonaManager;
