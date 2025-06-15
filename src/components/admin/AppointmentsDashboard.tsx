
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Bed, TrendingUp, User, Scissors, CheckCircle, DollarSign, Eye, BarChart3, PieChart } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';

interface AppointmentsDashboardProps {
  appointments: Appointment[];
  clients: Client[];
}

const AppointmentsDashboard: React.FC<AppointmentsDashboardProps> = ({
  appointments,
  clients,
}) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const thisWeek = new Date();
  const weekStart = new Date(thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay()));
  const weekEnd = new Date(thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay() + 6));
  
  // Métricas calculadas
  const todayAppointments = appointments.filter(apt => apt.date === today);
  const weekAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= weekStart && aptDate <= weekEnd;
  });
  
  const appointmentsByArtist = appointments.reduce((acc, apt) => {
    const artistName = ['João Silva', 'Maria Santos', 'Pedro Costa'].find((_, index) => 
      ['1', '2', '3'][index] === apt.artist_id
    ) || 'Artista';
    acc[artistName] = (acc[artistName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const appointmentsByService = appointments.reduce((acc, apt) => {
    const serviceType = apt.service_type === 'tattoo' ? 'Tatuagem' : 
                      apt.service_type === 'piercing' ? 'Piercing' : 'Consultoria';
    acc[serviceType] = (acc[serviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const appointmentsByStatus = appointments.reduce((acc, apt) => {
    const statusText = apt.status === 'confirmed' ? 'Confirmado' :
                     apt.status === 'scheduled' ? 'Agendado' :
                     apt.status === 'cancelled' ? 'Cancelado' :
                     apt.status === 'completed' ? 'Concluído' : 'Pendente';
    acc[statusText] = (acc[statusText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bedOccupancy = Math.floor(Math.random() * 30) + 70; // Simulado: 70-100%
  const totalRevenue = appointments
    .filter(apt => apt.estimated_price)
    .reduce((sum, apt) => sum + (apt.estimated_price || 0), 0);

  const weekRevenue = weekAppointments
    .filter(apt => apt.estimated_price)
    .reduce((sum, apt) => sum + (apt.estimated_price || 0), 0);

  const upcomingImportant = appointments
    .filter(apt => apt.date >= today)
    .filter(apt => apt.estimated_price && apt.estimated_price > 300)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5);

  const topClients = clients
    .filter(client => appointments.some(apt => apt.client_id === client.id))
    .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Introdução ao Dashboard */}
      <div className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 rounded-xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-8 w-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-black text-red-800">Dashboard de Agendamentos</h2>
            <p className="text-red-600 font-medium">Visão completa e métricas inteligentes do estúdio</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="text-lg font-bold text-red-800">{appointments.length}</div>
            <div className="text-sm text-red-600">Total de Agendamentos</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-800">{clients.length}</div>
            <div className="text-sm text-green-600">Clientes Cadastrados</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-800">3</div>
            <div className="text-sm text-blue-600">Tatuadores Ativos</div>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-black text-red-800">{todayAppointments.length}</div>
            <p className="text-sm text-red-600 font-medium">agendamentos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Esta Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-black text-red-800">{weekAppointments.length}</div>
            <p className="text-sm text-red-600 font-medium">agendamentos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Bed className="h-4 w-4" />
              Ocupação Macas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-black text-red-800">{bedOccupancy}%</div>
            <p className="text-sm text-red-600 font-medium">taxa média</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-black text-red-800">R$ {totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-red-600 font-medium">valor estimado</p>
          </CardContent>
        </Card>
      </div>

      {/* Análises Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agendamentos por Tatuador */}
        <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Por Tatuador
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {Object.entries(appointmentsByArtist).map(([artist, count]) => (
                <div key={artist} className="flex justify-between items-center">
                  <span className="text-red-800 font-medium">{artist}</span>
                  <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agendamentos por Serviço */}
        <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Por Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {Object.entries(appointmentsByService).map(([service, count]) => (
                <div key={service} className="flex justify-between items-center">
                  <span className="text-red-800 font-medium">{service}</span>
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agendamentos por Status */}
        <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Por Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {Object.entries(appointmentsByStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-red-800 font-medium">{status}</span>
                  <Badge className="bg-gradient-to-r from-green-600 to-green-800 text-white font-bold">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Clientes */}
        <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {topClients.map((client) => (
                <div key={client.id} className="flex justify-between items-center bg-red-50 p-2 rounded border border-red-200">
                  <div>
                    <span className="text-red-800 font-medium text-sm">{client.name?.split(' ')[0]}</span>
                    <div className="text-xs text-red-600">
                      {client.total_orders} agendamentos
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold">
                    R$ {client.total_spent?.toLocaleString() || 0}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Agendamentos Importantes */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximos Agendamentos VIP (Acima de R$ 300)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {upcomingImportant.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingImportant.map((appointment) => {
                const client = clients.find(c => c.id === appointment.client_id);
                const artist = ['João Silva', 'Maria Santos', 'Pedro Costa'].find((_, index) => 
                  ['1', '2', '3'][index] === appointment.artist_id
                );
                
                return (
                  <div key={appointment.id} className="bg-red-50 p-3 rounded-lg border border-red-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-red-600" />
                      <span className="font-bold text-red-800 text-sm">
                        {client?.name?.split(' ')[0] || 'Cliente'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-red-600" />
                      <span className="text-xs text-red-700">
                        {format(new Date(appointment.date), 'dd/MM', { locale: ptBR })} - {appointment.time}
                      </span>
                    </div>
                    
                    {artist && (
                      <div className="flex items-center gap-2 mb-2">
                        <Scissors className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-red-700">
                          {artist.split(' ')[0]}
                        </span>
                      </div>
                    )}
                    
                    <div className="text-sm font-bold text-green-600 mb-1">
                      R$ {appointment.estimated_price?.toLocaleString()}
                    </div>
                    
                    <div className="text-xs text-red-600 line-clamp-2">
                      {appointment.service_description}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-red-600">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">Nenhum agendamento VIP próximo</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo Financeiro da Semana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Receita da Semana
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-black text-green-800 mb-2">
              R$ {weekRevenue.toLocaleString()}
            </div>
            <p className="text-green-600 font-medium">
              {weekAppointments.length} agendamentos confirmados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Taxa de Confirmação:</span>
                <span className="text-blue-800 font-bold">
                  {Math.round((appointments.filter(apt => apt.status === 'confirmed').length / appointments.length) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Ticket Médio:</span>
                <span className="text-blue-800 font-bold">
                  R$ {Math.round(totalRevenue / appointments.length).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentsDashboard;
