
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { getClientService } from "@/services/serviceFactory";
import { formatDate } from "@/lib/utils";
import { Users, Search, Filter, Plus, TrendingUp, UserCheck, UserX, Clock, Phone, Mail, MapPin, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const NaveMaeClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const clientService = getClientService();
  const { data: clientsData, loading } = useQuery({
    queryKey: ['clients', statusFilter, searchTerm],
    queryFn: () => clientService.fetchClients(),
  });

  const clients = clientsData || [];

  // Mock data adicional para demonstração completa
  const mockClients = [
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "(11) 99999-1234",
      status: 'active',
      total_spent: 2500,
      appointments_count: 8,
      last_activity: "2024-07-15",
      address: "Rua das Flores, 123 - São Paulo, SP",
      birth_date: "1985-03-15",
      notes: "Cliente preferencial, sempre pontual"
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao@email.com",
      phone: "(11) 88888-5678", 
      status: 'active',
      total_spent: 1800,
      appointments_count: 5,
      last_activity: "2024-07-18",
      address: "Av. Paulista, 456 - São Paulo, SP",
      birth_date: "1990-07-22",
      notes: "Interessado em tatuagens coloridas"
    },
    {
      id: 3,
      name: "Ana Costa",
      email: "ana@email.com",
      phone: "(11) 77777-9012",
      status: 'inactive',
      total_spent: 800,
      appointments_count: 2,
      last_activity: "2024-05-10",
      address: "Rua Augusta, 789 - São Paulo, SP", 
      birth_date: "1992-11-08",
      notes: "Cliente nova, primeira experiência"
    }
  ];

  const allClients = [...clients, ...mockClients];

  const filteredClients = allClients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalClients = allClients.length;
  const activeClients = allClients.filter(c => c.status === 'active').length;
  const inactiveClients = allClients.filter(c => c.status === 'inactive').length;
  const avgSpending = totalClients > 0 ? allClients.reduce((acc, c) => acc + (c.total_spent || 0), 0) / totalClients : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Header com gradiente 99Tattoo */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-black rounded-xl shadow-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-wider">CLIENTES 99TATTOO</h1>
              <p className="text-red-100 mt-2">Gestão completa da base de clientes</p>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total de Clientes</p>
                  <p className="text-3xl font-bold text-blue-800">{totalClients}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Clientes Ativos</p>
                  <p className="text-3xl font-bold text-green-800">{activeClients}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Clientes Inativos</p>
                  <p className="text-3xl font-bold text-gray-800">{inactiveClients}</p>
                </div>
                <UserX className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Ticket Médio</p>
                  <p className="text-3xl font-bold text-purple-800">R$ {avgSpending.toFixed(0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Controles */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-red-200 focus:border-red-500"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <CalendarDateRangePicker
                  date={dateRange}
                  onDateChange={setDateRange}
                />
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 border-red-200 focus:border-red-500">
                    <Filter className="h-4 w-4 mr-2 text-red-600" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                      <DialogDescription>
                        Preencha os dados do novo cliente
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Input placeholder="Nome completo" />
                      <Input placeholder="Email" type="email" />
                      <Input placeholder="Telefone" />
                      <Input placeholder="Endereço" />
                      <Button className="w-full bg-red-600 hover:bg-red-700">
                        Salvar Cliente
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="cards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cards">Visualização em Cards</TabsTrigger>
            <TabsTrigger value="table">Visualização em Tabela</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold">{client.name}</CardTitle>
                        <p className="text-sm text-gray-500">{client.email}</p>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(client.status)}`}>
                        {client.status === 'active' ? 'Ativo' : 
                         client.status === 'inactive' ? 'Inativo' : 'Pendente'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {client.address || 'Endereço não informado'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Última atividade: {client.last_activity ? new Date(client.last_activity).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total gasto:</span>
                        <span className="font-bold text-red-600">R$ {client.total_spent?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Agendamentos:</span>
                        <span className="font-medium">{client.appointments_count || 0}</span>
                      </div>
                    </div>

                    {client.notes && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Observações:</strong> {client.notes}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes do Cliente</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <strong>Nome:</strong> {client.name}
                            </div>
                            <div>
                              <strong>Email:</strong> {client.email}
                            </div>
                            <div>
                              <strong>Telefone:</strong> {client.phone}
                            </div>
                            <div>
                              <strong>Endereço:</strong> {client.address}
                            </div>
                            <div>
                              <strong>Data de Nascimento:</strong> {client.birth_date ? new Date(client.birth_date).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            <Card className="shadow-xl">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Gasto</TableHead>
                      <TableHead>Agendamentos</TableHead>
                      <TableHead>Última Atividade</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getStatusColor(client.status)}`}>
                            {client.status === 'active' ? 'Ativo' : 
                             client.status === 'inactive' ? 'Inativo' : 'Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-red-600">
                          R$ {client.total_spent?.toLocaleString() || '0'}
                        </TableCell>
                        <TableCell>{client.appointments_count || 0}</TableCell>
                        <TableCell>
                          {client.last_activity ? new Date(client.last_activity).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro cliente à base'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeClients;
