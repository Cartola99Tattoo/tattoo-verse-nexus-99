import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, Star, Users, Trophy, Search, Filter, Plus, Crown, Award, Target, Calendar, Phone, Mail, User, UserPlus, Eye, Settings, Ticket, Zap, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AddLoyaltyMemberModal from "@/components/admin/AddLoyaltyMemberModal";
import PointsSystemModal from "@/components/admin/PointsSystemModal";
import TierManagementModal from "@/components/admin/TierManagementModal";
import BonusRulesModal from "@/components/admin/BonusRulesModal";
import RewardModal from "@/components/admin/RewardModal";
import CouponModal from "@/components/admin/CouponModal";

interface LoyaltyMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  primaryArtist?: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  points: number;
  totalSpent: number;
  joinDate: string;
  lastVisit: string;
  appointmentsCount: number;
  referrals: number;
  status: "active" | "inactive" | "pending";
}

const mockLoyaltyMembers: LoyaltyMember[] = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-0001",
    birthDate: "1990-05-15",
    primaryArtist: "João Tattoo",
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
    phone: "(11) 99999-0002",
    birthDate: "1985-08-22",
    primaryArtist: "Maria Tattoo",
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
    phone: "(11) 99999-0003",
    birthDate: "1992-12-10",
    primaryArtist: "Pedro Tattoo",
    tier: "platinum",
    points: 5200,
    totalSpent: 8900,
    joinDate: "2023-11-10",
    lastVisit: "2024-07-19",
    appointmentsCount: 18,
    referrals: 5,
    status: "active"
  },
  {
    id: 4,
    name: "Carlos Mendes",
    email: "carlos@email.com",
    phone: "(11) 99999-0004",
    birthDate: "1988-03-05",
    primaryArtist: "Ana Tattoo",
    tier: "bronze",
    points: 450,
    totalSpent: 1200,
    joinDate: "2024-06-01",
    lastVisit: "2024-07-10",
    appointmentsCount: 3,
    referrals: 0,
    status: "active"
  },
  {
    id: 5,
    name: "Fernanda Lima",
    email: "fernanda@email.com",
    phone: "(11) 99999-0005",
    birthDate: "1995-09-18",
    primaryArtist: "Carlos Tattoo",
    tier: "silver",
    points: 1800,
    totalSpent: 3200,
    joinDate: "2024-02-14",
    lastVisit: "2024-07-20",
    appointmentsCount: 8,
    referrals: 2,
    status: "active"
  },
  {
    id: 6,
    name: "Roberto Silva",
    email: "roberto@email.com",
    phone: "(11) 99999-0006",
    birthDate: "1982-11-30",
    primaryArtist: "João Tattoo",
    tier: "gold",
    points: 3100,
    totalSpent: 5800,
    joinDate: "2023-12-05",
    lastVisit: "2024-07-17",
    appointmentsCount: 14,
    referrals: 4,
    status: "active"
  },
  {
    id: 7,
    name: "Patricia Oliveira",
    email: "patricia@email.com",
    phone: "(11) 99999-0007",
    birthDate: "1993-07-25",
    tier: "bronze",
    points: 280,
    totalSpent: 850,
    joinDate: "2024-07-01",
    lastVisit: "2024-07-15",
    appointmentsCount: 2,
    referrals: 0,
    status: "pending"
  },
  {
    id: 8,
    name: "Lucas Rocha",
    email: "lucas@email.com",
    phone: "(11) 99999-0008",
    birthDate: "1987-04-12",
    primaryArtist: "Maria Tattoo",
    tier: "platinum",
    points: 4200,
    totalSpent: 7500,
    joinDate: "2023-09-20",
    lastVisit: "2024-07-21",
    appointmentsCount: 16,
    referrals: 6,
    status: "active"
  }
];

const Loyalty = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showPointsSystemModal, setShowPointsSystemModal] = useState(false);
  const [showTierManagementModal, setShowTierManagementModal] = useState(false);
  const [showBonusRulesModal, setShowBonusRulesModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [members, setMembers] = useState<LoyaltyMember[]>(mockLoyaltyMembers);
  const [activeTab, setActiveTab] = useState("overview");

  const filteredMembers = members.filter(member => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const handleAddMember = (newMemberData: any) => {
    const newMember: LoyaltyMember = {
      id: members.length + 1,
      name: newMemberData.name,
      email: newMemberData.email,
      phone: newMemberData.phone,
      birthDate: newMemberData.birthDate,
      primaryArtist: newMemberData.primaryArtist,
      tier: "bronze", // Novos membros começam no Bronze
      points: newMemberData.initialPoints || 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0],
      lastVisit: new Date().toISOString().split('T')[0],
      appointmentsCount: 0,
      referrals: 0,
      status: newMemberData.status
    };

    setMembers(prev => [...prev, newMember]);
    setShowAddMemberModal(false);
    
    toast({
      title: "Membro adicionado com sucesso!",
      description: `${newMember.name} foi adicionado ao programa de fidelidade.`,
    });
  };

  const handleEditReward = (reward: any) => {
    setSelectedReward(reward);
    setShowRewardModal(true);
  };

  const handleDeleteReward = (rewardName: string) => {
    toast({
      title: "Recompensa Removida!",
      description: `${rewardName} foi removida do catálogo.`,
    });
  };

  const handleEditCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    setShowCouponModal(true);
  };

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const totalPoints = members.reduce((acc, m) => acc + m.points, 0);
  const avgPointsPerMember = totalMembers > 0 ? Math.round(totalPoints / totalMembers) : 0;

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 via-red-50/30 to-white min-h-screen">
      {/* Header Principal com Identidade 99Tattoo */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>
        
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-black mb-2 flex items-center justify-center gap-3">
            <Gift className="h-8 w-8" />
            🎨 99TATTOO - Programa de Fidelidade
          </h1>
          <p className="text-red-100 text-lg font-medium">Gestão Completa de Membros e Recompensas</p>
        </div>
      </div>

      {/* Sistema de Navegação por Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 shadow-xl rounded-xl p-2 h-auto">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white font-bold py-3 rounded-lg transition-all duration-300 hover:bg-red-200 flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger 
            value="programs" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white font-bold py-3 rounded-lg transition-all duration-300 hover:bg-red-200 flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Programas
          </TabsTrigger>
          <TabsTrigger 
            value="members" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white font-bold py-3 rounded-lg transition-all duration-300 hover:bg-red-200 flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Membros
          </TabsTrigger>
          <TabsTrigger 
            value="rewards" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white font-bold py-3 rounded-lg transition-all duration-300 hover:bg-red-200 flex items-center gap-2"
          >
            <Gift className="h-4 w-4" />
            Recompensas
          </TabsTrigger>
          <TabsTrigger 
            value="coupons" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white font-bold py-3 rounded-lg transition-all duration-300 hover:bg-red-200 flex items-center gap-2"
          >
            <Ticket className="h-4 w-4" />
            Cupons de Eventos
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da Aba Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* Métricas do Programa */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-bold">Total de Membros</p>
                    <p className="text-3xl font-black text-red-800">{totalMembers}</p>
                  </div>
                  <div className="bg-red-600 p-3 rounded-xl">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-bold">Membros Ativos</p>
                    <p className="text-3xl font-black text-green-800">{activeMembers}</p>
                  </div>
                  <div className="bg-green-600 p-3 rounded-xl">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-bold">Total de Pontos</p>
                    <p className="text-3xl font-black text-yellow-800">{totalPoints.toLocaleString()}</p>
                  </div>
                  <div className="bg-yellow-600 p-3 rounded-xl">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-bold">Média de Pontos</p>
                    <p className="text-3xl font-black text-blue-800">{avgPointsPerMember}</p>
                  </div>
                  <div className="bg-blue-600 p-3 rounded-xl">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Programa */}
          <Card className="shadow-xl border-2 border-red-200/50">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-red-600 flex items-center gap-3">
                <Eye className="h-6 w-6" />
                Resumo do Programa de Fidelidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">Status dos Membros</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="font-medium text-green-800">Membros Ativos</span>
                      <Badge className="bg-green-600 text-white">{activeMembers}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <span className="font-medium text-orange-800">Membros Pendentes</span>
                      <Badge className="bg-orange-600 text-white">{members.filter(m => m.status === 'pending').length}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <span className="font-medium text-red-800">Membros Inativos</span>
                      <Badge className="bg-red-600 text-white">{members.filter(m => m.status === 'inactive').length}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-800">Distribuição por Nível</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <span className="font-medium text-amber-800 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Bronze
                      </span>
                      <Badge className="bg-amber-600 text-white">{members.filter(m => m.tier === 'bronze').length}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-800 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Silver
                      </span>
                      <Badge className="bg-gray-600 text-white">{members.filter(m => m.tier === 'silver').length}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <span className="font-medium text-yellow-800 flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Gold
                      </span>
                      <Badge className="bg-yellow-600 text-white">{members.filter(m => m.tier === 'gold').length}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="font-medium text-purple-800 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Platinum
                      </span>
                      <Badge className="bg-purple-600 text-white">{members.filter(m => m.tier === 'platinum').length}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo da Aba Programas */}
        <TabsContent value="programs" className="space-y-6">
          <Card className="shadow-xl border-2 border-red-200/50">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-red-600 flex items-center gap-3">
                <Settings className="h-6 w-6" />
                Configuração dos Programas de Fidelidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-blue-800">Sistema de Pontos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-blue-700">Pontos por R$ Gasto</label>
                      <Input value="1 ponto = R$ 100" disabled className="bg-white/70" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-blue-700">Conversão de Pontos</label>
                      <Input value="100 pontos = R$ 10" disabled className="bg-white/70" />
                    </div>
                    <Button 
                      onClick={() => setShowPointsSystemModal(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    >
                      Configurar Sistema de Pontos
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-purple-800">Níveis do Programa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-white/70 rounded">
                        <span className="font-medium">Bronze</span>
                        <span className="text-sm text-gray-600">0-500 pts</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/70 rounded">
                        <span className="font-medium">Silver</span>
                        <span className="text-sm text-gray-600">501-1500 pts</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/70 rounded">
                        <span className="font-medium">Gold</span>
                        <span className="text-sm text-gray-600">1501-3000 pts</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white/70 rounded">
                        <span className="font-medium">Platinum</span>
                        <span className="text-sm text-gray-600">3000+ pts</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowTierManagementModal(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    >
                      Editar Níveis
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-800">Regras de Bonificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/70 rounded-lg">
                      <h4 className="font-bold text-green-700 mb-2">Indicação</h4>
                      <p className="text-sm text-green-600">R$ 50 para ambos</p>
                    </div>
                    <div className="p-4 bg-white/70 rounded-lg">
                      <h4 className="font-bold text-green-700 mb-2">Aniversário</h4>
                      <p className="text-sm text-green-600">Flash grátis</p>
                    </div>
                    <div className="p-4 bg-white/70 rounded-lg">
                      <h4 className="font-bold text-green-700 mb-2">Cashback</h4>
                      <p className="text-sm text-green-600">5% em créditos</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowBonusRulesModal(true)}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold"
                  >
                    Configurar Bonificações
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo da Aba Membros */}
        <TabsContent value="members" className="space-y-6">
          {/* Filtros e Botão Adicionar Membro */}
          <Card className="shadow-xl border-2 border-red-200/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="w-full md:w-96 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar membros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-red-200 focus:border-red-400 focus:ring-red-400"
                  />
                </div>
                
                <div className="flex gap-4 items-center">
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="w-48 border-red-200 focus:border-red-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200">
                      <SelectItem value="all">Todos os Níveis</SelectItem>
                      <SelectItem value="bronze">Bronze</SelectItem>
                      <SelectItem value="silver">Silver</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48 border-red-200 focus:border-red-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200">
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-black px-6 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Novo Membro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Membros */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-red-100 hover:border-red-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-black text-gray-900">{member.name}</CardTitle>
                      <p className="text-sm text-gray-500 font-medium">{member.email}</p>
                      <p className="text-sm text-gray-500 font-medium">{member.phone}</p>
                    </div>
                    <div className="flex gap-2 flex-col items-end">
                      <Badge className={`text-xs font-bold ${getTierColor(member.tier)}`}>
                        <div className="flex items-center gap-1">
                          {getTierIcon(member.tier)}
                          {member.tier.toUpperCase()}
                        </div>
                      </Badge>
                      <Badge className={`text-xs font-bold ${getStatusColor(member.status)}`}>
                        {getStatusText(member.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                      <div className="text-center">
                        <div className="text-2xl font-black text-red-600 mb-1">
                          {member.points.toLocaleString()}
                        </div>
                        <div className="text-sm text-red-700 font-bold">Pontos Acumulados</div>
                      </div>
                    </div>

                    {member.primaryArtist && (
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-purple-600" />
                          <div>
                            <div className="text-sm font-bold text-purple-800">Tatuador Principal</div>
                            <div className="text-xs text-purple-600">{member.primaryArtist}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {member.birthDate && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="text-sm font-bold text-blue-800">Aniversário</div>
                            <div className="text-xs text-blue-600">
                              {new Date(member.birthDate).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-black text-gray-900">{member.appointmentsCount}</div>
                        <div className="text-xs text-gray-500 font-medium">Agendamentos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-gray-900">{member.referrals}</div>
                        <div className="text-xs text-gray-500 font-medium">Indicações</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Total gasto:</span>
                        <span className="font-black text-gray-900">R$ {member.totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Membro desde:</span>
                        <span className="font-bold text-gray-900">{new Date(member.joinDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Última visita:</span>
                        <span className="font-bold text-gray-900">{new Date(member.lastVisit).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-400">
                      Ver Histórico
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-bold">
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
              <h3 className="text-xl font-black text-gray-900 mb-2">Nenhum membro encontrado</h3>
              <p className="text-gray-500 font-medium">
                {searchTerm || tierFilter !== 'all' || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Adicione o primeiro membro ao programa de fidelidade'
                }
              </p>
              {(!searchTerm && tierFilter === 'all' && statusFilter === 'all') && (
                <Button 
                  onClick={() => setShowAddMemberModal(true)}
                  className="mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Membro
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        {/* Conteúdo da Aba Recompensas */}
        <TabsContent value="rewards" className="space-y-6">
          <Card className="shadow-xl border-2 border-red-200/50">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-red-600 flex items-center gap-3">
                <Gift className="h-6 w-6" />
                Catálogo de Recompensas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Gerencie as recompensas disponíveis no programa de fidelidade</p>
                <Button 
                  onClick={() => {
                    setSelectedReward(null);
                    setShowRewardModal(true);
                  }}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Recompensa
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Desconto 10%
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-yellow-700 font-medium">Desconto de 10% em qualquer tatuagem</p>
                      <div className="flex justify-between">
                        <span className="text-sm text-yellow-600">Custo:</span>
                        <span className="font-bold text-yellow-800">500 pontos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-yellow-600">Status:</span>
                        <Badge className="bg-green-600 text-white">Ativo</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditReward({ name: 'Desconto 10%', description: 'Desconto de 10% em qualquer tatuagem', pointsCost: 500, category: 'discount', status: 'active' })}
                        className="flex-1 border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteReward('Desconto 10%')}
                        className="border-red-400 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-blue-800 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Flash Grátis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-blue-700 font-medium">Tatuagem flash grátis (até 5cm)</p>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-600">Custo:</span>
                        <span className="font-bold text-blue-800">1000 pontos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-600">Status:</span>
                        <Badge className="bg-green-600 text-white">Ativo</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditReward({ name: 'Flash Grátis', description: 'Tatuagem flash grátis (até 5cm)', pointsCost: 1000, category: 'service', status: 'active' })}
                        className="flex-1 border-blue-400 text-blue-700 hover:bg-blue-100"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteReward('Flash Grátis')}
                        className="border-red-400 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-purple-800 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Sessão Prioritária
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-purple-700 font-medium">Agendamento com prioridade</p>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-600">Custo:</span>
                        <span className="font-bold text-purple-800">200 pontos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-purple-600">Status:</span>
                        <Badge className="bg-green-600 text-white">Ativo</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditReward({ name: 'Sessão Prioritária', description: 'Agendamento com prioridade', pointsCost: 200, category: 'priority', status: 'active' })}
                        className="flex-1 border-purple-400 text-purple-700 hover:bg-purple-100"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteReward('Sessão Prioritária')}
                        className="border-red-400 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo da Aba Cupons de Eventos */}
        <TabsContent value="coupons" className="space-y-6">
          <Card className="shadow-xl border-2 border-red-200/50">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-red-600 flex items-center gap-3">
                <Ticket className="h-6 w-6" />
                Cupons de Eventos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Gerencie cupons de desconto para eventos especiais</p>
                <Button 
                  onClick={() => {
                    setSelectedCoupon(null);
                    setShowCouponModal(true);
                  }}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cupom
                </Button>
              </div>

              <div className="space-y-4">
                <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-green-800">VERÃO2024</h3>
                        <p className="text-green-700">Desconto de 20% em tatuagens coloridas</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-green-600">Válido até: 31/03/2024</span>
                          <span className="text-green-600">Usos: 45/100</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-green-600 text-white">Ativo</Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditCoupon({ code: 'VERÃO2024', description: 'Desconto de 20% em tatuagens coloridas', discountType: 'percentage', discountValue: 20 })}
                          className="border-green-400 text-green-700 hover:bg-green-100"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-red-800">FLASH15</h3>
                        <p className="text-red-700">15% de desconto em flash tattoos</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-red-600">Válido até: 15/04/2024</span>
                          <span className="text-red-600">Usos: 23/50</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-red-600 text-white">Ativo</Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditCoupon({ code: 'FLASH15', description: '15% de desconto em flash tattoos', discountType: 'percentage', discountValue: 15 })}
                          className="border-red-400 text-red-700 hover:bg-red-100"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-800">FIRST50</h3>
                        <p className="text-gray-700">50% de desconto para primeira tatuagem</p>
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-600">Válido até: 01/02/2024</span>
                          <span className="text-gray-600">Usos: 12/20</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-gray-600 text-white">Expirado</Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditCoupon({ code: 'FIRST50', description: '50% de desconto para primeira tatuagem', discountType: 'percentage', discountValue: 50 })}
                          className="border-gray-400 text-gray-700 hover:bg-gray-100"
                        >
                          Renovar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <AddLoyaltyMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onAddMember={handleAddMember}
      />

      <PointsSystemModal
        isOpen={showPointsSystemModal}
        onClose={() => setShowPointsSystemModal(false)}
      />

      <TierManagementModal
        isOpen={showTierManagementModal}
        onClose={() => setShowTierManagementModal(false)}
      />

      <BonusRulesModal
        isOpen={showBonusRulesModal}
        onClose={() => setShowBonusRulesModal(false)}
      />

      <RewardModal
        isOpen={showRewardModal}
        onClose={() => {
          setShowRewardModal(false);
          setSelectedReward(null);
        }}
        reward={selectedReward}
        isEdit={!!selectedReward}
      />

      <CouponModal
        isOpen={showCouponModal}
        onClose={() => {
          setShowCouponModal(false);
          setSelectedCoupon(null);
        }}
        coupon={selectedCoupon}
        isEdit={!!selectedCoupon}
      />
    </div>
  );
};

export default Loyalty;
