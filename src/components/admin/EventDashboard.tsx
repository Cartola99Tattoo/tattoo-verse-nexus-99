
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Clock, 
  DollarSign,
  BarChart3,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { IEvent } from '@/services/interfaces/IEventService';
import { IProjectSmartGoal } from '@/services/interfaces/IProjectService';

interface EventDashboardProps {
  events: IEvent[];
  smartGoals?: IProjectSmartGoal[];
}

const EventDashboard = ({ events, smartGoals = [] }: EventDashboardProps) => {
  // Calcular estatísticas dos eventos
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'active').length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const pendingEvents = events.filter(e => e.status === 'pending').length;

  // Próximos eventos (ordenados por data)
  const upcomingEvents = events
    .filter(e => e.status === 'active' || e.status === 'pending')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  // Calcular progresso das metas SMART
  const smartGoalsProgress = smartGoals.map(goal => ({
    ...goal,
    progressPercentage: Math.min((goal.progress || 0), 100)
  }));

  // Métricas mock para demonstração
  const mockMetrics = {
    totalParticipants: 1847,
    averageSatisfaction: 4.7,
    totalRevenue: 45890,
    socialReach: 12350
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'active': return 'Ativo';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-white to-red-50 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-red-800 mb-2">
          Dashboard de Gestão de Eventos
        </h2>
        <p className="text-red-600 font-medium">
          Visão estratégica completa dos seus eventos e metas
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-700 flex items-center gap-2 text-sm font-bold">
              <Calendar className="h-5 w-5" />
              Total de Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-blue-600">{totalEvents}</div>
            <p className="text-xs text-gray-600 mt-1">Eventos cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-700 flex items-center gap-2 text-sm font-bold">
              <CheckCircle2 className="h-5 w-5" />
              Eventos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-green-600">{activeEvents}</div>
            <p className="text-xs text-gray-600 mt-1">Em andamento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-700 flex items-center gap-2 text-sm font-bold">
              <Target className="h-5 w-5" />
              Metas SMART
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-purple-600">{smartGoals.length}</div>
            <p className="text-xs text-gray-600 mt-1">Metas ativas</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-700 flex items-center gap-2 text-sm font-bold">
              <TrendingUp className="h-5 w-5" />
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-orange-600">
              {totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-600 mt-1">Eventos concluídos</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-200 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-indigo-700 flex items-center gap-2 text-sm font-bold">
              <Users className="h-5 w-5" />
              Participantes Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-indigo-600">{mockMetrics.totalParticipants.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Todos os eventos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-yellow-50 border-yellow-200 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-700 flex items-center gap-2 text-sm font-bold">
              <Activity className="h-5 w-5" />
              Satisfação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-yellow-600">{mockMetrics.averageSatisfaction}/5.0</div>
            <p className="text-xs text-gray-600 mt-1">Avaliação dos participantes</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-emerald-50 border-emerald-200 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-emerald-700 flex items-center gap-2 text-sm font-bold">
              <DollarSign className="h-5 w-5" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-emerald-600">R$ {mockMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Receita gerada</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-pink-50 border-pink-200 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-pink-700 flex items-center gap-2 text-sm font-bold">
              <BarChart3 className="h-5 w-5" />
              Alcance Social
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-pink-600">{mockMetrics.socialReach.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1">Pessoas alcançadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Eventos e Progresso das Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Eventos */}
        <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum evento próximo</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-white p-4 rounded-lg border border-red-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-red-800 text-sm">{event.name}</h4>
                      <Badge className={getStatusColor(event.status)}>
                        {getStatusLabel(event.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.startDate).toLocaleDateString('pt-BR')}
                      </span>
                      <span>•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progresso das Metas SMART */}
        <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progresso das Metas SMART
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {smartGoalsProgress.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma meta SMART definida</p>
              </div>
            ) : (
              <div className="space-y-4">
                {smartGoalsProgress.slice(0, 5).map((goal) => (
                  <div key={goal.id} className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-blue-800 text-sm">{goal.title}</h4>
                      <span className="text-xs font-bold text-blue-600">
                        {goal.progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={goal.progressPercentage} 
                      className="h-2 mb-2" 
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Responsável: {goal.responsible || 'Não definido'}</span>
                      {goal.deadline && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status dos Eventos por Categoria */}
      <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribuição de Status dos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-yellow-600">{pendingEvents}</div>
              <div className="text-xs text-gray-600">Pendentes</div>
              <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalEvents > 0 ? (pendingEvents / totalEvents) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-black text-green-600">{activeEvents}</div>
              <div className="text-xs text-gray-600">Ativos</div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalEvents > 0 ? (activeEvents / totalEvents) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-black text-blue-600">{completedEvents}</div>
              <div className="text-xs text-gray-600">Concluídos</div>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-black text-red-600">
                {events.filter(e => e.status === 'cancelled').length}
              </div>
              <div className="text-xs text-gray-600">Cancelados</div>
              <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${totalEvents > 0 ? (events.filter(e => e.status === 'cancelled').length / totalEvents) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDashboard;
