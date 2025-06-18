
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, Plus, TrendingUp, UserCheck, UserX, Clock } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getClientService } from "@/services/serviceFactory";

const NaveMaeClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [studioFilter, setStudioFilter] = useState("all");

  const clientService = getClientService();
  const { data: clientsData, loading } = useDataQuery(
    () => clientService.fetchClients(),
    []
  );

  const clients = clientsData || [];

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const inactiveClients = clients.filter(c => c.status === 'inactive').length;
  const pendingClients = clients.filter(c => c.status === 'pending').length;

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
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
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

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
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

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
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

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-800">{pendingClients}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
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
                  placeholder="Buscar clientes..."
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
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={studioFilter} onValueChange={setStudioFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estúdios</SelectItem>
                    <SelectItem value="studio1">Estúdio 1</SelectItem>
                    <SelectItem value="studio2">Estúdio 2</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Clientes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
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
                
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Telefone:</strong> {client.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Última visita:</strong> {new Date(client.lastVisit).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Total gasto:</strong> R$ {client.totalSpent?.toLocaleString() || '0'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filteredClients.length === 0 && !loading && (
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
