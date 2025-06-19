
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, Star, Users, Trophy, Search, Filter, Plus, Crown, Award, Target } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockLoyaltyMembers = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    tier: "gold",
    points: 2850,
    totalSpent: 4500,
    joinDate: "2024-01-15",
    lastVisit: "2024-07-15",
    appointmentsCount: 12,
    referrals: 3,
    status: "active"
  },
  {
    id: 2,
    name: "João Santos",
    email: "joao@email.com",
    tier: "silver",
    points: 1200,
    totalSpent: 2800,
    joinDate: "2024-03-20",
    lastVisit: "2024-07-18",
    appointmentsCount: 7,
    referrals: 1,
    status: "active"
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@email.com",
    tier: "platinum",
    points: 5200,
    totalSpent: 8900,
    joinDate: "2023-11-10",
    lastVisit: "2024-07-19",
    appointmentsCount: 18,
    referrals: 5,
    status: "active"
  }
];

const NaveMaeLoyalty = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredMembers = mockLoyaltyMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'all' || member.tier === tierFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesTier && matchesStatus;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return <Award className="h-4 w-4" />;
      case 'silver': return <Star className="h-4 w-4" />;
      case 'gold': return <Crown className="h-4 w-4" />;
      case 'platinum': return <Trophy className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const totalMembers = mockLoyaltyMembers.length;
  const activeMembers = mockLoyaltyMembers.filter(m => m.status === 'active').length;
  const totalPoints = mockLoyaltyMembers.reduce((acc, m) => acc + m.points, 0);
  const avgPointsPerMember = totalMembers > 0 ? Math.round(totalPoints / totalMembers) : 0;

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total de Membros</p>
                  <p className="text-3xl font-bold text-purple-800">{totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Membros Ativos</p>
                  <p className="text-3xl font-bold text-green-800">{activeMembers}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Total de Pontos</p>
                  <p className="text-3xl font-bold text-yellow-800">{totalPoints.toLocaleString()}</p>
                </div>
                <Gift className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Média de Pontos</p>
                  <p className="text-3xl font-bold text-blue-800">{avgPointsPerMember}</p>
                </div>
                <Star className="h-8 w-8 text-blue-600" />
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
                  placeholder="Buscar membros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
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
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Membro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Membros */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold">{member.name}</CardTitle>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  <div className="flex gap-2 flex-col items-end">
                    <Badge className={`text-xs ${getTierColor(member.tier)} font-medium`}>
                      <div className="flex items-center gap-1">
                        {getTierIcon(member.tier)}
                        {member.tier.toUpperCase()}
                      </div>
                    </Badge>
                    <Badge className="text-xs bg-green-100 text-green-800">
                      {member.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {member.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-700">Pontos Acumulados</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{member.appointmentsCount}</div>
                      <div className="text-xs text-gray-500">Agendamentos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{member.referrals}</div>
                      <div className="text-xs text-gray-500">Indicações</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total gasto:</span>
                      <span className="font-medium">R$ {member.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Membro desde:</span>
                      <span className="font-medium">{new Date(member.joinDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última visita:</span>
                      <span className="font-medium">{new Date(member.lastVisit).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    Ver Histórico
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum membro encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || tierFilter !== 'all' || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione o primeiro membro ao programa de fidelidade'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeLoyalty;
