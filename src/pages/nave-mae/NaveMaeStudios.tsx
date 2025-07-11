
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, Plus, MapPin, Users, Star, TrendingUp, DollarSign } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockStudios = [
  {
    id: 1,
    name: "Black Art Studio",
    owner: "João Silva Santos",
    address: "Rua Augusta, 1234 - São Paulo, SP",
    phone: "(11) 3456-7890",
    email: "contato@blackartstudio.com.br",
    status: "active",
    artistsCount: 5,
    monthlyRevenue: 45000,
    rating: 4.8,
    reviews: 127,
    joinDate: "2023-03-15",
    plan: "premium",
    commission: 15
  },
  {
    id: 2,
    name: "Aquarela Ink",
    owner: "Maria Fernanda Costa",
    address: "Av. Copacabana, 567 - Rio de Janeiro, RJ",
    phone: "(21) 2345-6789",
    email: "contato@aquarelaink.com.br",
    status: "active",
    artistsCount: 3,
    monthlyRevenue: 32000,
    rating: 4.9,
    reviews: 89,
    joinDate: "2023-06-20",
    plan: "standard",
    commission: 12
  },
  {
    id: 3,
    name: "Neo Tattoo Studio",
    owner: "Carlos Alberto",
    address: "Rua XV de Novembro, 890 - Curitiba, PR",
    phone: "(41) 3456-7890",
    email: "contato@neotattoo.com.br",
    status: "pending",
    artistsCount: 4,
    monthlyRevenue: 0,
    rating: 0,
    reviews: 0,
    joinDate: "2024-07-10",
    plan: "basic",
    commission: 10
  }
];

const NaveMaeStudios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  const filteredStudios = mockStudios.filter(studio => {
    const matchesSearch = studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         studio.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         studio.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || studio.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'inactive': return 'Inativo';
      case 'suspended': return 'Suspenso';
      default: return status;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-gray-100 text-gray-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanText = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Básico';
      case 'standard': return 'Padrão';
      case 'premium': return 'Premium';
      case 'enterprise': return 'Enterprise';
      default: return plan;
    }
  };

  const totalStudios = mockStudios.length;
  const activeStudios = mockStudios.filter(s => s.status === 'active').length;
  const pendingStudios = mockStudios.filter(s => s.status === 'pending').length;
  const totalRevenue = mockStudios.reduce((acc, s) => acc + s.monthlyRevenue, 0);

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total de Estúdios</p>
                  <p className="text-3xl font-bold text-blue-800">{totalStudios}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Estúdios Ativos</p>
                  <p className="text-3xl font-bold text-green-800">{activeStudios}</p>
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
                  <p className="text-3xl font-bold text-yellow-800">{pendingStudios}</p>
                </div>
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Receita Mensal</p>
                  <p className="text-3xl font-bold text-purple-800">R$ {(totalRevenue / 1000).toFixed(0)}k</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
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
                  placeholder="Buscar estúdios..."
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
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="suspended">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Estados</SelectItem>
                    <SelectItem value="SP">São Paulo</SelectItem>
                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                    <SelectItem value="MG">Minas Gerais</SelectItem>
                    <SelectItem value="PR">Paraná</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Estúdio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Estúdios */}
        <div className="space-y-6">
          {filteredStudios.map((studio) => (
            <Card key={studio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl font-bold">{studio.name}</CardTitle>
                      <Badge className={`${getStatusColor(studio.status)}`}>
                        {getStatusText(studio.status)}
                      </Badge>
                      <Badge className={`${getPlanColor(studio.plan)}`}>
                        {getPlanText(studio.plan)}
                      </Badge>
                    </div>
                    <p className="text-gray-600">Proprietário: {studio.owner}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-sm">{studio.address}</div>
                      <div className="text-sm text-gray-500">{studio.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold">{studio.artistsCount} Tatuadores</div>
                      <div className="text-sm text-gray-500">Equipe ativa</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold">R$ {studio.monthlyRevenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Receita mensal</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-semibold">
                        {studio.rating > 0 ? `${studio.rating} ⭐` : 'Sem avaliações'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {studio.reviews > 0 ? `${studio.reviews} avaliações` : 'Aguardando'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{studio.commission}%</div>
                    <div className="text-xs text-gray-500">Comissão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {new Date(studio.joinDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-gray-500">Data de Adesão</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{studio.email}</div>
                    <div className="text-xs text-gray-500">Email de Contato</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                  {studio.status === 'active' && (
                    <>
                      <Button size="sm" variant="outline">
                        Ver Analytics
                      </Button>
                      <Button size="sm" variant="outline">
                        Gerenciar Comissões
                      </Button>
                    </>
                  )}
                  {studio.status === 'pending' && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        Aprovar
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        Rejeitar
                      </Button>
                    </>
                  )}
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudios.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum estúdio encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro estúdio à rede'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeStudios;
