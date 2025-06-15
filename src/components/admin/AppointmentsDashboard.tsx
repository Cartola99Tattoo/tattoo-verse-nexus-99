
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Bed, TrendingUp, User, Scissors, CheckCircle, DollarSign } from 'lucide-react';
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

  const bedOccupancy = Math.floor(Math.random() * 30) + 70; // Simulado: 70-100%
  const totalRevenue = appointments
    .filter(apt => apt.estimated_price)
    .reduce((sum, apt) => sum + (apt.estimated_price || 0), 0);

  const upcomingImportant = appointments
    .filter(apt => apt.date >= today)
    .filter(apt => apt.estimated_price && apt.estimated_price > 500)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 3);

  return (
    <div className="space-y-6">
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
              Receita Estimada
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-black text-red-800">R$ {totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-red-600 font-medium">valor total</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <CheckCircle className="h-5 w-5" />
              Por Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {Object.entries(appointmentsByService).map(([service, count]) => (
                <div key={service} className="flex justify-between items-center">
                  <span className="text-red-800 font-medium">{service}</span>
                  <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white font-bold">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximos Agendamentos Importantes */}
        <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-lg">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximos VIP
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {upcomingImportant.length > 0 ? (
                upcomingImportant.map((appointment) => {
                  const client = clients.find(c => c.id === appointment.client_id);
                  return (
                    <div key={appointment.id} className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3 w-3 text-red-600" />
                        <span className="font-bold text-red-800 text-sm">
                          {client?.name?.split(' ')[0] || 'Cliente'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-red-600" />
                        <span className="text-xs text-red-700">
                          {format(new Date(appointment.date), 'dd/MM', { locale: ptBR })} - {appointment.time}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-green-600">
                        R$ {appointment.estimated_price}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-red-600">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Nenhum agendamento VIP próximo</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentsDashboard;
