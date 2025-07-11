
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  DollarSign, 
  Edit, 
  Play, 
  Check, 
  X, 
  Activity,
  Palette,
  Zap,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Client } from '@/services/interfaces/IClientService';

interface StudioDayByDayProps {
  appointments: Appointment[];
  clients: Client[];
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

const StudioDayByDay: React.FC<StudioDayByDayProps> = ({
  appointments,
  clients,
  selectedDate,
  onDateChange,
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Usar currentDate se selectedDate não estiver definido
  const displayDate = selectedDate || currentDate;

  // Filtrar agendamentos do dia selecionado
  const dayKey = format(displayDate, 'yyyy-MM-dd');
  const dayAppointments = appointments
    .filter(apt => apt.date === dayKey)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Artistas com cores
  const artists = [
    { id: '1', name: 'João Silva', gradient: 'from-red-500 to-red-700', bg: 'bg-red-500', ring: 'ring-red-200' },
    { id: '2', name: 'Maria Santos', gradient: 'from-blue-500 to-blue-700', bg: 'bg-blue-500', ring: 'ring-blue-200' },
    { id: '3', name: 'Pedro Costa', gradient: 'from-green-500 to-green-700', bg: 'bg-green-500', ring: 'ring-green-200' },
    { id: '4', name: 'Ana Oliveira', gradient: 'from-purple-500 to-purple-700', bg: 'bg-purple-500', ring: 'ring-purple-200' },
    { id: '5', name: 'Carlos Mendes', gradient: 'from-amber-500 to-amber-700', bg: 'bg-amber-500', ring: 'ring-amber-200' },
  ];

  // Tipos de serviço
  const serviceTypes = {
    tattoo: { icon: Palette, name: 'Tatuagem', color: 'text-red-700', bg: 'bg-red-100' },
    piercing: { icon: Zap, name: 'Piercing', color: 'text-blue-700', bg: 'bg-blue-100' },
    consultation: { icon: User, name: 'Consulta', color: 'text-purple-700', bg: 'bg-purple-100' },
  };

  // Status com cores
  const statusConfig = {
    scheduled: { name: 'Agendado', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    confirmed: { name: 'Confirmado', color: 'bg-green-100 text-green-800 border-green-200' },
    in_progress: { name: 'Em Andamento', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    completed: { name: 'Concluído', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    cancelled: { name: 'Cancelado', color: 'bg-red-100 text-red-800 border-red-200' },
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' 
      ? subDays(displayDate, 1) 
      : addDays(displayDate, 1);
    
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const handleActionClick = (appointment: Appointment, action: string) => {
    console.log(`Ação ${action} para agendamento ${appointment.id}`);
    // Aqui seria implementada a lógica específica de cada ação
  };

  const handleShowDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const getArtist = (artistId: string) => {
    return artists.find(a => a.id === artistId) || artists[0];
  };

  const getClient = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  const getServiceConfig = (serviceType: string) => {
    return serviceTypes[serviceType as keyof typeof serviceTypes] || serviceTypes.tattoo;
  };

  // Calcular estatísticas do dia
  const dayStats = {
    total: dayAppointments.length,
    confirmed: dayAppointments.filter(apt => apt.status === 'confirmed').length,
    completed: dayAppointments.filter(apt => apt.status === 'completed').length,
    revenue: dayAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0),
    duration: dayAppointments.reduce((sum, apt) => sum + (apt.duration_minutes || 60), 0),
  };

  return (
    <div className="space-y-8">
      {/* Header com Navegação de Data */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-2xl shadow-red-glow border border-red-500">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigateDate('prev')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg rounded-xl"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-3xl font-black mb-2">
              Dia a Dia do Estúdio
            </h2>
            <p className="text-xl font-bold mb-1">
              {format(displayDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            <p className="text-red-100 font-medium">Gestão Detalhada dos Agendamentos Diários</p>
          </div>
          
          <Button
            onClick={() => navigateDate('next')}
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:shadow-lg rounded-xl"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Dashboard do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-black text-red-800 mb-2">{dayStats.total}</div>
            <div className="text-sm text-red-600 font-bold">Total de Agendamentos</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-black text-green-800 mb-2">{dayStats.confirmed}</div>
            <div className="text-sm text-green-600 font-bold">Confirmados</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-black text-purple-800 mb-2">{dayStats.completed}</div>
            <div className="text-sm text-purple-600 font-bold">Concluídos</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-black text-blue-800 mb-2">
              R$ {dayStats.revenue.toLocaleString()}
            </div>
            <div className="text-sm text-blue-600 font-bold">Receita do Dia</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 shadow-xl">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-black text-amber-800 mb-2">
              {Math.round(dayStats.duration / 60)}h
            </div>
            <div className="text-sm text-amber-600 font-bold">Duração Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Agendamentos Detalhada */}
      <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-xl p-6">
          <CardTitle className="text-2xl font-black flex items-center gap-3">
            <CalendarIcon className="h-8 w-8" />
            Cronograma Detalhado do Dia
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {dayAppointments.length === 0 ? (
            <div className="text-center py-16">
              <CalendarIcon className="h-24 w-24 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-black text-gray-600 mb-3">Dia Livre</h3>
              <p className="text-gray-500 text-lg">Nenhum agendamento para este dia</p>
            </div>
          ) : (
            <div className="space-y-6">
              {dayAppointments.map((appointment, index) => {
                const artist = getArtist(appointment.artist_id);
                const client = getClient(appointment.client_id);
                const serviceConfig = getServiceConfig(appointment.service_type);
                const statusInfo = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.scheduled;
                const ServiceIcon = serviceConfig.icon;

                return (
                  <Card key={appointment.id} className="border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        {/* Informações Principais */}
                        <div className="flex-1 space-y-4">
                          {/* Linha 1: Horário e Status */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-red-600" />
                              <span className="text-xl font-black text-red-800">
                                {appointment.time}
                              </span>
                              <span className="text-sm text-gray-600">
                                ({appointment.duration_minutes || 60} min)
                              </span>
                            </div>
                            
                            <Badge className={`${statusInfo.color} border font-bold px-3 py-1`}>
                              {statusInfo.name}
                            </Badge>
                          </div>

                          {/* Linha 2: Cliente e Artista */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="font-bold text-blue-800">Cliente:</span>
                              </div>
                              <div className="ml-6 space-y-1">
                                <p className="font-bold text-gray-800">{client?.name || 'Cliente não encontrado'}</p>
                                {client?.phone && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Phone className="h-3 w-3" />
                                    <span>{client.phone}</span>
                                  </div>
                                )}
                                {client?.email && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <Mail className="h-3 w-3" />
                                    <span>{client.email}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full ${artist.bg}`}></div>
                                <span className="font-bold text-purple-800">Artista:</span>
                              </div>
                              <div className="ml-6">
                                <p className="font-bold text-gray-800">{artist.name}</p>
                              </div>
                            </div>
                          </div>

                          {/* Linha 3: Serviço e Preço */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <ServiceIcon className={`h-4 w-4 ${serviceConfig.color}`} />
                                <span className="font-bold text-green-800">Serviço:</span>
                              </div>
                              <div className="ml-6">
                                <p className="font-bold text-gray-800">{serviceConfig.name}</p>
                                {appointment.service_description && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {appointment.service_description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {appointment.estimated_price && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="font-bold text-green-800">Preço:</span>
                                </div>
                                <div className="ml-6">
                                  <p className="font-bold text-gray-800 text-lg">
                                    R$ {appointment.estimated_price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Notas */}
                          {appointment.notes && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-gray-600" />
                                <span className="font-bold text-gray-800">Observações:</span>
                              </div>
                              <div className="ml-6">
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                  {appointment.notes}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex flex-col gap-2 ml-6">
                          <Button
                            onClick={() => handleShowDetails(appointment)}
                            variant="outline"
                            size="sm"
                            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 font-bold"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>

                          {appointment.status === 'confirmed' && (
                            <Button
                              onClick={() => handleActionClick(appointment, 'start')}
                              size="sm"
                              className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 font-bold"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Iniciar
                            </Button>
                          )}

                          {appointment.status === 'in_progress' && (
                            <Button
                              onClick={() => handleActionClick(appointment, 'complete')}
                              size="sm"
                              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 font-bold"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Concluir
                            </Button>
                          )}

                          <Button
                            onClick={() => handleActionClick(appointment, 'cancel')}
                            variant="outline"
                            size="sm"
                            className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 font-bold"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-xl -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <CalendarIcon className="h-6 w-6" />
              Detalhes do Agendamento
            </DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6 p-6">
              {/* Conteúdo do modal seria implementado aqui */}
              <div className="text-center py-8">
                <p className="text-lg text-gray-600">
                  Modal de detalhes do agendamento será implementado conforme necessário.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudioDayByDay;
