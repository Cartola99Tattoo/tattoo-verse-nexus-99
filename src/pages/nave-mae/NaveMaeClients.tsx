import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, Plus, Star, Calendar, Phone, Mail, Edit, Trash2, Eye } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import ClientModal from "@/components/nave-mae/ClientModal";

const mockClients = [
  {
    id: 1,
    name: "Ana Silva",
    email: "ana.silva@email.com",
    phone: "(11) 99999-1111",
    city: "São Paulo",
    state: "SP",
    totalSpent: 2500,
    appointments: 8,
    lastVisit: "2024-07-15",
    rating: 5,
    status: "active",
    loyaltyTier: "gold"
  },
  {
    id: 2,
    name: "Carlos Santos",
    email: "carlos.santos@email.com",
    phone: "(21) 88888-2222",
    city: "Rio de Janeiro",
    state: "RJ",
    totalSpent: 1800,
    appointments: 5,
    lastVisit: "2024-07-18",
    rating: 4,
    status: "active",
    loyaltyTier: "silver"
  },
  {
    id: 3,
    name: "Mariana Costa",
    email: "mariana.costa@email.com",
    phone: "(31) 77777-3333",
    city: "Belo Horizonte",
    state: "MG",
    totalSpent: 950,
    appointments: 3,
    lastVisit: "2024-06-20",
    rating: 5,
    status: "inactive",
    loyaltyTier: "bronze"
  }
];

const NaveMaeClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [clients, setClients] = useState(mockClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesTier = tierFilter === 'all' || client.loyaltyTier === tierFilter;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const handleSaveClient = (clientData) => {
    if (clientData.id) {
      // Update existing client
      setClients(prev => prev.map(client => 
        client.id === clientData.id ? { ...client, ...clientData } : client
      ));
    } else {
      // Add new client
      const newClient = {
        ...clientData,
        id: Math.max(...clients.map(c => c.id)) + 1,
        totalSpent: 0,
        appointments: 0,
        lastVisit: new Date().toISOString().split('T')[0],
        rating: 0
      };
      setClients(prev => [...prev, newClient]);
    }
    setSelectedClient(null);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (clientId) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(prev => prev.filter(client => client.id !== clientId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalRevenue = clients.reduce((acc, c) => acc + c.totalSpent, 0);

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
                  <p className="text-3xl font-bold text-blue-800">{totalClients.toLocaleString()}</p>
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
                <Star className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Receita Total</p>
                  <p className="text-3xl font-bold text-purple-800">R$ {totalRevenue.toLocaleString()}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Ticket Médio</p>
                  <p className="text-3xl font-bold text-yellow-800">R$ {Math.round(totalRevenue / totalClients)}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
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
                  </SelectContent>
                </Select>
                
                <Select value={tierFilter} onValueChange={setTierFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Níveis</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={() => {
                    setSelectedClient(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Clientes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{client.name}</CardTitle>
                    <p className="text-sm text-gray-500">{client.city}, {client.state}</p>
                  </div>
                  <div className="flex gap-2 flex-col items-end">
                    <Badge className={`text-xs ${getStatusColor(client.status)}`}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <Badge className={`text-xs ${getTierColor(client.loyaltyTier)}`}>
                      {client.loyaltyTier.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {client.phone}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">R$ {client.totalSpent.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Total Gasto</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{client.appointments}</div>
                      <div className="text-xs text-gray-500">Agendamentos</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Última visita:</span>
                    <span className="font-medium">{new Date(client.lastVisit).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avaliação:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{client.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditClient(client)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || tierFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro cliente à base'
              }
            </p>
          </div>
        )}

        <ClientModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClient(null);
          }}
          client={selectedClient}
          onSave={handleSaveClient}
        />
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeClients;
