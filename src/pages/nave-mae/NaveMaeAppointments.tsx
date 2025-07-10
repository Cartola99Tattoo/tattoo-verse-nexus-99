
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter, Plus, Clock, MapPin, User, Star } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockAppointments = [
  {
    id: 1,
    clientName: "Ana Silva",
    artistName: "João Silva Santos",
    studioName: "Black Art Studio",
    date: "2024-07-20",
    time: "14:00",
    service: "Tatuagem Realista",
    duration: "3 horas",
    price: 450,
    status: "confirmed",
    city: "São Paulo"
  },
  {
    id: 2,
    clientName: "Carlos Santos",
    artistName: "Maria Fernanda Costa",
    studioName: "Aquarela Ink",
    date: "2024-07-20",
    time: "16:30",
    service: "Tatuagem Aquarela",
    duration: "2 horas",
    price: 320,
    status: "pending",
    city: "Rio de Janeiro"
  },
  {
    id: 3,
    clientName: "Mariana Costa",
    artistName: "João Silva Santos",
    studioName: "Black Art Studio",
    date: "2024-07-21",
    time: "10:00",
    service: "Blackwork",
    duration: "4 horas",
    price: 600,
    status: "completed",
    city: "São Paulo"
  }
];

const NaveMaeAppointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.studioName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const totalAppointments = mockAppointments.length;
  const confirmedAppointments = mockAppointments.filter(a => a.status === 'confirmed').length;
  const pendingAppointments = mockAppointments.filter(a => a.status === 'pending').length;
  const totalRevenue = mockAppointments.filter(a => a.status === 'completed').reduce((acc, a) => acc + a.price, 0);

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Hoje</p>
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
                <Star className="h-8 w-8 text-green-600" />
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
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Receita</p>
                  <p className="text-3xl font-bold text-purple-800">R$ {totalRevenue}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
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
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Agendamentos */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-gray-900">
                        {appointment.clientName}
                      </span>
                      <span className="text-sm text-gray-500">
                        Cliente
                      </span>
                    </div>
                    <div className="h-8 w-px bg-gray-300"></div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-purple-600">
                        {appointment.artistName}
                      </span>
                      <span className="text-sm text-gray-500">
                        Tatuador
                      </span>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(appointment.status)} font-medium`}>
                    {getStatusText(appointment.status)}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{new Date(appointment.date).toLocaleDateString('pt-BR')}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{appointment.studioName}</div>
                      <div className="text-sm text-gray-500">{appointment.city}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{appointment.service}</div>
                      <div className="text-sm text-gray-500">{appointment.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <div className="font-bold text-green-600">R$ {appointment.price}</div>
                      <div className="text-sm text-gray-500">Valor</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                  {appointment.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Confirmar
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        Cancelar
                      </Button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Marcar como Concluído
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
                : 'Nenhum agendamento para hoje'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeAppointments;
