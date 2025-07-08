
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Plus, MapPin, Users, Clock, Star } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockEvents = [
  {
    id: 1,
    name: "Convenção Nacional 99Tattoo 2024",
    description: "Encontro anual da rede com workshops, competições e networking",
    type: "convention",
    status: "upcoming",
    date: "2024-08-15",
    endDate: "2024-08-17",
    location: "São Paulo Convention Center",
    city: "São Paulo",
    state: "SP",
    capacity: 5000,
    registered: 3200,
    organizer: "Equipe 99Tattoo",
    priority: "high"
  },
  {
    id: 2,
    name: "Workshop: Técnicas Avançadas de Realismo",
    description: "Workshop intensivo com mestres do realismo em tatuagem",
    type: "workshop",
    status: "ongoing",
    date: "2024-07-20",
    endDate: "2024-07-21",
    location: "Black Art Studio",
    city: "São Paulo",
    state: "SP",
    capacity: 30,
    registered: 30,
    organizer: "João Silva Santos",
    priority: "medium"
  },
  {
    id: 3,
    name: "Feira de Produtos e Equipamentos",
    description: "Exposição dos melhores produtos e lançamentos do mercado",
    type: "fair",
    status: "completed",
    date: "2024-06-10",
    endDate: "2024-06-12",
    location: "Centro de Exposições Rio",
    city: "Rio de Janeiro",
    state: "RJ",
    capacity: 10000,
    registered: 8500,
    organizer: "99Tattoo Comercial",
    priority: "high"
  }
];

const NaveMaeEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Próximo';
      case 'ongoing': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'convention': return 'bg-purple-100 text-purple-800';
      case 'workshop': return 'bg-yellow-100 text-yellow-800';
      case 'fair': return 'bg-green-100 text-green-800';
      case 'competition': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'convention': return 'Convenção';
      case 'workshop': return 'Workshop';
      case 'fair': return 'Feira';
      case 'competition': return 'Competição';
      default: return type;
    }
  };

  const totalEvents = mockEvents.length;
  const upcomingEvents = mockEvents.filter(e => e.status === 'upcoming').length;
  const ongoingEvents = mockEvents.filter(e => e.status === 'ongoing').length;
  const totalParticipants = mockEvents.reduce((acc, e) => acc + e.registered, 0);

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total de Eventos</p>
                  <p className="text-3xl font-bold text-purple-800">{totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Próximos</p>
                  <p className="text-3xl font-bold text-blue-800">{upcomingEvents}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Em Andamento</p>
                  <p className="text-3xl font-bold text-green-800">{ongoingEvents}</p>
                </div>
                <Star className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Participantes</p>
                  <p className="text-3xl font-bold text-yellow-800">{totalParticipants.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-600" />
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
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="convention">Convenção</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="fair">Feira</SelectItem>
                    <SelectItem value="competition">Competição</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="upcoming">Próximo</SelectItem>
                    <SelectItem value="ongoing">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Eventos */}
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl font-bold">{event.name}</CardTitle>
                      <Badge className={`${getTypeColor(event.type)}`}>
                        {getTypeText(event.type)}
                      </Badge>
                      <Badge className={`${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold">
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                        {event.endDate && event.endDate !== event.date && (
                          <> - {new Date(event.endDate).toLocaleDateString('pt-BR')}</>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">Data do evento</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">{event.location}</div>
                      <div className="text-sm text-gray-500">{event.city}, {event.state}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold">{event.registered} / {event.capacity}</div>
                      <div className="text-sm text-gray-500">Participantes</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-semibold">{event.organizer}</div>
                      <div className="text-sm text-gray-500">Organizador</div>
                    </div>
                  </div>
                </div>

                {/* Barra de Progresso de Inscrições */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Taxa de Ocupação</span>
                    <span className="text-sm font-medium">
                      {Math.round((event.registered / event.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                  {event.status === 'upcoming' && (
                    <>
                      <Button size="sm" variant="outline">
                        Gerenciar Inscrições
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Editar Evento
                      </Button>
                    </>
                  )}
                  {event.status === 'completed' && (
                    <Button size="sm" variant="outline">
                      Ver Relatório
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Crie o primeiro evento da rede'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeEvents;
