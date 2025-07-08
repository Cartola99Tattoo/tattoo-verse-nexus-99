import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, MapPin, Search, Filter, Plus, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockAppointments = [
  {
    id: 1,
    clientName: "Maria Silva",
    artistName: "Carlos Mendes",
    service: "Tatuagem Realista",
    date: "2024-07-20",
    time: "14:00",
    duration: "4 horas",
    status: "confirmed",
    phone: "(11) 99999-1234",
    location: "Estúdio Principal",
    price: 800,
    notes: "Primeira sessão - braço direito"
  },
  {
    id: 2,
    clientName: "João Santos",
    artistName: "Ana Costa",
    service: "Tatuagem Blackwork",
    date: "2024-07-21",
    time: "10:00",
    duration: "3 horas",
    status: "pending",
    phone: "(11) 88888-5678",
    location: "Estúdio Filial",
    price: 600,
    notes: "Retoque em tatuagem existente"
  },
  {
    id: 3,
    clientName: "Pedro Oliveira",
    artistName: "Rafael Lima",
    service: "Tatuagem Colorida",
    date: "2024-07-22",
    time: "16:00",
    duration: "5 horas",
    status: "completed",
    phone: "(11) 77777-9012",
    location: "Estúdio Principal",
    price: 1200,
    notes: "Sessão final - peça completa"
  }
];

const NaveMaeAppointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const totalAppointments = mockAppointments.length;
  const confirmedAppointments = mockAppointments.filter(a => a.status === 'confirmed').length;
  const pendingAppointments = mockAppointments.filter(a => a.status === 'pending').length;
  const completedAppointments = mockAppointments.filter(a => a.status === 'completed').length;

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total de Agendamentos</p>
                  <p className="text-3xl font-bold text-blue-800">{totalAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Confirmados</p>
                  <p className="text-3xl font-bold text-green-800">{confirmedAppointments}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-800">{pendingAppointments}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Concluídos</p>
                  <p className="text-3xl font-bold text-purple-800">{completedAppointments}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
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
                  placeholder="Buscar agendamentos..."
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
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Datas</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Agendamentos */}
        <div className="grid gap-6">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getStatusColor(appointment.status).replace('text-', 'bg-').replace('100', '500')}/10`}>
                      {getStatusIcon(appointment.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{appointment.clientName}</h3>
                      <p className="text-sm text-gray-500">com {appointment.artistName}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(appointment.status)}`}>
                    {appointment.status === 'confirmed' ? 'Confirmado' :
                     appointment.status === 'pending' ? 'Pendente' :
                     appointment.status === 'completed' ? 'Concluído' : 'Cancelado'}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{appointment.time} ({appointment.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{appointment.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{appointment.location}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Serviço</p>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Valor</p>
                      <p className="text-sm text-gray-600 font-bold">R$ {appointment.price.toLocaleString()}</p>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Observações</p>
                      <p className="text-sm text-gray-600">{appointment.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  {appointment.status === 'pending' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Confirmar
                    </Button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Finalizar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro agendamento'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeAppointments;
