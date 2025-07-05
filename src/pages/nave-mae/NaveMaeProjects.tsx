
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderKanban, Search, Plus, Calendar, Users, TrendingUp, Clock } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockProjects = [
  {
    id: 1,
    name: "Expansão Nacional 2024",
    description: "Abertura de 15 novos estúdios parceiros em capitais brasileiras",
    status: "in_progress",
    priority: "high",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    progress: 65,
    budget: 2500000,
    spent: 1625000,
    teamMembers: 12,
    tasksTotal: 45,
    tasksCompleted: 29
  },
  {
    id: 2,
    name: "Plataforma Mobile App",
    description: "Desenvolvimento do aplicativo mobile 99Tattoo para iOS e Android",
    status: "planning",
    priority: "medium",
    startDate: "2024-03-01",
    endDate: "2024-09-30",
    progress: 25,
    budget: 800000,
    spent: 200000,
    teamMembers: 8,
    tasksTotal: 32,
    tasksCompleted: 8
  },
  {
    id: 3,
    name: "Sistema de Fidelidade",
    description: "Implementação do programa de fidelidade unificado da rede",
    status: "completed",
    priority: "high",
    startDate: "2023-10-01",
    endDate: "2024-02-28",
    progress: 100,
    budget: 450000,
    spent: 425000,
    teamMembers: 6,
    tasksTotal: 28,
    tasksCompleted: 28
  }
];

const NaveMaeProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return 'Planejamento';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'on_hold': return 'Pausado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'in_progress').length;
  const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
  const totalBudget = mockProjects.reduce((acc, p) => acc + p.budget, 0);

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total de Projetos</p>
                  <p className="text-3xl font-bold text-blue-800">{totalProjects}</p>
                </div>
                <FolderKanban className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Em Andamento</p>
                  <p className="text-3xl font-bold text-yellow-800">{activeProjects}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Concluídos</p>
                  <p className="text-3xl font-bold text-green-800">{completedProjects}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Orçamento Total</p>
                  <p className="text-3xl font-bold text-purple-800">R$ {(totalBudget / 1000000).toFixed(1)}M</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar projetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="planning">Planejamento</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="on_hold">Pausado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Prioridades</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Projeto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Projetos */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                  </div>
                  <div className="flex gap-2 flex-col items-end">
                    <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
                      {getPriorityText(project.priority)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Progresso */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progresso</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Orçamento */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Orçamento</span>
                      <p className="font-bold text-blue-600">R$ {(project.budget / 1000).toLocaleString()}k</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Gasto</span>
                      <p className="font-bold text-red-600">R$ {(project.spent / 1000).toLocaleString()}k</p>
                    </div>
                  </div>

                  {/* Equipe e Tarefas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{project.teamMembers}</div>
                        <div className="text-xs text-gray-500">Membros</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="font-medium">{project.tasksCompleted}/{project.tasksTotal}</div>
                        <div className="text-xs text-gray-500">Tarefas</div>
                      </div>
                    </div>
                  </div>

                  {/* Datas */}
                  <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-4">
                    <div>
                      <span className="text-gray-600">Início: </span>
                      <span className="font-medium">{new Date(project.startDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fim: </span>
                      <span className="font-medium">{new Date(project.endDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Gerenciar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderKanban className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum projeto encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Crie o primeiro projeto estratégico'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeProjects;
