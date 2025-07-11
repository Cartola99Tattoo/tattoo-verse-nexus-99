import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Lightbulb, Filter, BarChart3, Target, Users, ArrowRight } from 'lucide-react';
import { ContentIdea, CreateContentIdeaData } from '@/types/contentIdea';
import { Persona } from '@/types/persona';
import ContentIdeaCard from './ContentIdeaCard';
import ContentIdeaForm from './ContentIdeaForm';
import { toast } from '@/hooks/use-toast';

interface ContentIdeaManagerProps {
  personas: Persona[];
  ideas: ContentIdea[];
  onIdeaCreate: (data: CreateContentIdeaData) => void;
  onIdeaUpdate: (idea: ContentIdea, data: CreateContentIdeaData) => void;
}

const ContentIdeaManager = ({ personas, ideas, onIdeaCreate, onIdeaUpdate }: ContentIdeaManagerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<ContentIdea | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.focusKeyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.personaRelevance.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
    const matchesStage = stageFilter === 'all' || idea.purchaseStage === stageFilter;
    const matchesFormat = formatFilter === 'all' || idea.format === formatFilter;
    
    return matchesSearch && matchesStatus && matchesStage && matchesFormat;
  });

  const handleSave = (data: CreateContentIdeaData) => {
    if (editingIdea) {
      onIdeaUpdate(editingIdea, data);
      toast({
        title: "Sucesso!",
        description: "Ideia de conteúdo atualizada com sucesso! Ela aparecerá no Kanban de Produção."
      });
    } else {
      onIdeaCreate(data);
      toast({
        title: "Sucesso!",
        description: "Ideia de conteúdo criada com sucesso! Vá para a aba 'Produção' para acompanhar o desenvolvimento."
      });
    }
    setEditingIdea(null);
    setShowForm(false);
  };

  const handleEdit = (idea: ContentIdea) => {
    setEditingIdea(idea);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIdea(null);
  };

  const getStatusStats = () => {
    return {
      total: ideas.length,
      ideia: ideas.filter(i => i.status === 'Ideia').length,
      planejado: ideas.filter(i => i.status === 'Planejado').length,
      producao: ideas.filter(i => i.status === 'Em Produção').length,
      publicado: ideas.filter(i => i.status === 'Publicado').length
    };
  };

  const stats = getStatusStats();

  if (showForm) {
    return (
      <ContentIdeaForm
        idea={editingIdea || undefined}
        personas={personas}
        onSave={handleSave}
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
              <Lightbulb className="h-6 w-6" />
              Ideias de Conteúdo
            </CardTitle>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 shadow-lg backdrop-blur-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Ideia
              </Button>
              <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  💡 Ideias criadas aqui aparecerão no Kanban
                </span>
                <ArrowRight className="h-4 w-4 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por tema, keyword ou relevância..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full"></div>
                <span>{filteredIdeas.length} ideias encontradas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {ideas.length > 0 && (
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Ações Rápidas:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => setStatusFilter('Ideia')}
                >
                  Ver Novas Ideias ({ideas.filter(i => i.status === 'Ideia').length})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => setStatusFilter('Em Produção')}
                >
                  Em Produção ({ideas.filter(i => i.status === 'Em Produção').length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      {ideas.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="font-bold text-blue-800">Total</span>
              </div>
              <p className="text-2xl font-black text-blue-600">{stats.total}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <span className="font-bold text-gray-800 text-sm">Ideias</span>
              <p className="text-xl font-black text-gray-600">{stats.ideia}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <span className="font-bold text-yellow-800 text-sm">Produção</span>
              <p className="text-xl font-black text-yellow-600">{stats.producao}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <span className="font-bold text-blue-800 text-sm">Planejado</span>
              <p className="text-xl font-black text-blue-600">{stats.planejado}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <span className="font-bold text-green-800 text-sm">Publicado</span>
              <p className="text-xl font-black text-green-600">{stats.publicado}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg border-b border-red-200">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-red-700 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Ideia">Ideia</SelectItem>
                  <SelectItem value="Planejado">Planejado</SelectItem>
                  <SelectItem value="Em Produção">Em Produção</SelectItem>
                  <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                  <SelectItem value="Fazendo Imagens/Gráficos">Fazendo Imagens/Gráficos</SelectItem>
                  <SelectItem value="Conteúdo Agendado">Conteúdo Agendado</SelectItem>
                  <SelectItem value="Publicado">Publicado</SelectItem>
                  <SelectItem value="Promover/Distribuir">Promover/Distribuir</SelectItem>
                  <SelectItem value="Arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-red-700 mb-2 block">Etapa de Compra</label>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Etapas</SelectItem>
                  <SelectItem value="Aprendizado e Descoberta">Aprendizado e Descoberta</SelectItem>
                  <SelectItem value="Reconhecimento do Problema">Reconhecimento do Problema</SelectItem>
                  <SelectItem value="Consideração da Solução">Consideração da Solução</SelectItem>
                  <SelectItem value="Decisão de Compra">Decisão de Compra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-red-700 mb-2 block">Formato</label>
              <Select value={formatFilter} onValueChange={setFormatFilter}>
                <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Formatos</SelectItem>
                  <SelectItem value="Blog Post">Blog Post</SelectItem>
                  <SelectItem value="eBook">eBook</SelectItem>
                  <SelectItem value="Webinar/Live">Webinar/Live</SelectItem>
                  <SelectItem value="Vídeo Curto">Vídeo Curto</SelectItem>
                  <SelectItem value="Post de Redes Sociais">Post de Redes Sociais</SelectItem>
                  <SelectItem value="Infográfico">Infográfico</SelectItem>
                  <SelectItem value="Estudo de Caso">Estudo de Caso</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ideas Grid */}
      {filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <ContentIdeaCard
              key={idea.id}
              idea={idea}
              personas={personas}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <Lightbulb className="h-16 w-16 mx-auto text-red-300 mb-4" />
              <h3 className="text-xl font-bold text-red-600 mb-2">Nenhuma Ideia Cadastrada</h3>
              <p className="text-gray-600 mb-6">
                Comece criando suas primeiras ideias de conteúdo para alimentar sua estratégia de marketing.
                <br />
                <strong className="text-red-600">Dica:</strong> As ideias criadas aqui aparecerão automaticamente no Kanban de Produção!
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Ideia
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
          <CardContent className="p-12 text-center">
            <Search className="h-16 w-16 mx-auto text-red-300 mb-4" />
            <h3 className="text-xl font-bold text-red-600 mb-2">Nenhuma Ideia Encontrada</h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca ou criar uma nova ideia.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentIdeaManager;
