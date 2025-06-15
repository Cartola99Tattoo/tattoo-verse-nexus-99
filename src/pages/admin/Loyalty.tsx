import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown, Gift, Star, Plus, Users, Settings, Award, TrendingUp, Coins, Tag, Calendar, Percent, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface LoyaltyProgram {
  id: string;
  name: string;
  type: 'points' | 'levels' | 'cashback';
  isActive: boolean;
  rules: {
    pointsPerReal?: number;
    minSpendForLevel?: number;
    cashbackPercentage?: number;
  };
  levels?: LoyaltyLevel[];
  rewards?: LoyaltyReward[];
}

interface LoyaltyLevel {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'service' | 'product';
  value: number;
  isActive: boolean;
}

interface LoyaltyMember {
  id: string;
  clientName: string;
  email: string;
  totalPoints: number;
  currentLevel: string;
  totalSpent: number;
  joinDate: string;
  lastActivity: string;
  rewardsRedeemed: number;
}

interface EventCoupon {
  id: string;
  name: string;
  code: string;
  eventId: string;
  eventName: string;
  usageLimit: number;
  usedCount: number;
  categories: string[];
  validArtists: string[];
  expirationDate: string;
  discountType: 'percentage' | 'fixed' | 'free_tattoo';
  discountValue: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const Loyalty = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);
  const [isCreateRewardOpen, setIsCreateRewardOpen] = useState(false);
  const [isCreateCouponOpen, setIsCreateCouponOpen] = useState(false);

  // Mock data - existing data
  const loyaltyPrograms: LoyaltyProgram[] = [
    {
      id: "1",
      name: "99Tattoo Points",
      type: "points",
      isActive: true,
      rules: { pointsPerReal: 1 },
      levels: [
        { id: "1", name: "Bronze", minPoints: 0, benefits: ["5% desconto"], color: "bg-orange-100 text-orange-800" },
        { id: "2", name: "Prata", minPoints: 500, benefits: ["10% desconto", "Retoque grátis"], color: "bg-gray-100 text-gray-800" },
        { id: "3", name: "Ouro", minPoints: 1000, benefits: ["15% desconto", "Consulta grátis", "Prioridade"], color: "bg-yellow-100 text-yellow-800" }
      ],
      rewards: [
        { id: "1", name: "10% de Desconto", description: "Aplicável em qualquer tatuagem", pointsCost: 100, type: "discount", value: 10, isActive: true },
        { id: "2", name: "Sessão de Retoque", description: "Uma sessão gratuita de retoque", pointsCost: 300, type: "service", value: 0, isActive: true }
      ]
    }
  ];

  const loyaltyMembers: LoyaltyMember[] = [
    {
      id: "1",
      clientName: "João Silva",
      email: "joao@email.com",
      totalPoints: 850,
      currentLevel: "Prata",
      totalSpent: 2500,
      joinDate: "2024-01-15",
      lastActivity: "2024-11-20",
      rewardsRedeemed: 3
    },
    {
      id: "2",
      clientName: "Maria Santos",
      email: "maria@email.com",
      totalPoints: 1250,
      currentLevel: "Ouro",
      totalSpent: 4200,
      joinDate: "2023-08-10",
      lastActivity: "2024-11-22",
      rewardsRedeemed: 7
    }
  ];

  // Mock data for event coupons
  const eventCoupons: EventCoupon[] = [
    {
      id: "1",
      name: "Flash Party Verão",
      code: "99FLASH2025",
      eventId: "ev1",
      eventName: "Flash Day Verão 2025",
      usageLimit: 50,
      usedCount: 23,
      categories: ["Fineline", "Minimalista"],
      validArtists: ["Ana Silva", "Carlos Santos"],
      expirationDate: "2025-02-15",
      discountType: "percentage",
      discountValue: 20,
      status: "active",
      createdAt: "2024-12-01"
    },
    {
      id: "2",
      name: "Tattoo Fest Exclusivo",
      code: "99EXCLUSIVE",
      eventId: "ev2",
      eventName: "Workshop Old School",
      usageLimit: 30,
      usedCount: 8,
      categories: ["Old School", "Tradicional"],
      validArtists: ["Pedro Costa"],
      expirationDate: "2025-03-20",
      discountType: "fixed",
      discountValue: 100,
      status: "active",
      createdAt: "2024-12-05"
    }
  ];

  // Mock data for events and artists
  const mockEvents = [
    { id: "ev1", name: "Flash Day Verão 2025" },
    { id: "ev2", name: "Workshop Old School" },
    { id: "ev3", name: "Exposição Realismo" }
  ];

  const mockCategories = ["Fineline", "Old School", "Realismo", "Minimalista", "Tradicional", "Blackwork"];
  const mockArtists = ["Ana Silva", "Carlos Santos", "Pedro Costa", "Maria Lima", "João Oliveira"];

  const getLevelBadge = (level: string) => {
    const levels = {
      "Bronze": "bg-orange-100 text-orange-800 border-orange-300",
      "Prata": "bg-gray-100 text-gray-800 border-gray-300",
      "Ouro": "bg-yellow-100 text-yellow-800 border-yellow-300"
    };
    return levels[level as keyof typeof levels] || "bg-gray-100 text-gray-800";
  };

  const getDiscountLabel = (type: string, value: number) => {
    switch (type) {
      case 'percentage': return `${value}% desconto`;
      case 'fixed': return `R$ ${value} desconto`;
      case 'free_tattoo': return 'Tatuagem grátis';
      default: return 'Desconto';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-50 p-4 md:p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Centro de Gestão de Fidelidade & Cupons 99Tattoo
            </h1>
            <p className="text-red-600 font-medium mt-2">Gerencie programas de fidelidade, recompensas e cupons promocionais para eventos</p>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-red-700">Membros Ativos</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-red-600">{loyaltyMembers.length}</div>
              <p className="text-xs text-red-500 font-medium">+12% este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-gradient-to-br from-white to-yellow-50 border-yellow-200 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-yellow-700">Pontos Distribuídos</CardTitle>
              <Coins className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-yellow-600">24,567</div>
              <p className="text-xs text-yellow-600 font-medium">Este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-green-700">Recompensas Resgatadas</CardTitle>
              <Gift className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-green-600">89</div>
              <p className="text-xs text-green-600 font-medium">+5% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card className="shadow-xl bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-purple-700">Cupons Ativos</CardTitle>
              <Tag className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-purple-600">{eventCoupons.filter(c => c.status === 'active').length}</div>
              <p className="text-xs text-purple-600 font-medium">Cupons em eventos</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-red-50 to-red-100 border-red-200 shadow-lg">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="programs" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm"
            >
              Programas
            </TabsTrigger>
            <TabsTrigger 
              value="members" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm"
            >
              Membros
            </TabsTrigger>
            <TabsTrigger 
              value="rewards" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm"
            >
              Recompensas
            </TabsTrigger>
            <TabsTrigger 
              value="coupons" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white font-bold text-xs md:text-sm"
            >
              <Tag className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              Cupons de Eventos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Programas Ativos */}
            <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Crown className="h-5 w-5 text-red-600" />
                  Programas Ativos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {loyaltyPrograms.filter(p => p.isActive).map((program) => (
                    <div key={program.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{program.name}</h3>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Tipo: {program.type === 'points' ? 'Sistema de Pontos' : program.type === 'levels' ? 'Níveis de Fidelidade' : 'Cashback'}
                      </p>
                      
                      {program.levels && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Níveis:</h4>
                          <div className="flex gap-2">
                            {program.levels.map((level) => (
                              <Badge key={level.id} className={level.color}>
                                {level.name} ({level.minPoints}+ pts)
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Membros */}
            <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <Star className="h-5 w-5 text-red-600" />
                  Top Membros Fidelidade
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {loyaltyMembers.slice(0, 5).map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-red-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{member.clientName}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge className={getLevelBadge(member.currentLevel)}>
                            {member.currentLevel}
                          </Badge>
                          <span className="font-semibold">{member.totalPoints} pts</span>
                        </div>
                        <p className="text-sm text-gray-600">{formatCurrency(member.totalSpent)} gastos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Configuração de Programas</CardTitle>
                  <Dialog open={isCreateProgramOpen} onOpenChange={setIsCreateProgramOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Programa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Novo Programa de Fidelidade</DialogTitle>
                        <DialogDescription>
                          Configure um novo programa de recompensas para seus clientes
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Nome do Programa</Label>
                          <Input placeholder="Ex: 99Tattoo VIP" />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo de Programa</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="points">Sistema de Pontos</SelectItem>
                              <SelectItem value="levels">Níveis de Fidelidade</SelectItem>
                              <SelectItem value="cashback">Cashback</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Pontos por Real Gasto</Label>
                          <Input type="number" placeholder="1" />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button className="flex-1">Criar Programa</Button>
                          <Button variant="outline" onClick={() => setIsCreateProgramOpen(false)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loyaltyPrograms.map((program) => (
                    <div key={program.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{program.name}</h3>
                          <p className="text-sm text-gray-600">
                            {program.type === 'points' ? 'Sistema de Pontos' : 
                             program.type === 'levels' ? 'Níveis de Fidelidade' : 'Cashback'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={program.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {program.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {program.rules && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Regras:</h4>
                          {program.rules.pointsPerReal && (
                            <p className="text-sm text-gray-600">
                              • {program.rules.pointsPerReal} ponto(s) por real gasto
                            </p>
                          )}
                        </div>
                      )}
                      
                      {program.levels && (
                        <div>
                          <h4 className="font-medium mb-2">Níveis de Fidelidade:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {program.levels.map((level) => (
                              <div key={level.id} className="border rounded p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Award className="h-4 w-4" />
                                  <span className="font-medium">{level.name}</span>
                                  <Badge className={level.color}>
                                    {level.minPoints}+ pts
                                  </Badge>
                                </div>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {level.benefits.map((benefit, index) => (
                                    <li key={index}>• {benefit}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membros do Programa de Fidelidade</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead>Total Gasto</TableHead>
                      <TableHead>Recompensas</TableHead>
                      <TableHead>Última Atividade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loyaltyMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{member.clientName}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getLevelBadge(member.currentLevel)}>
                            {member.currentLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">{member.totalPoints}</span>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(member.totalSpent)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {member.rewardsRedeemed} resgatadas
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(member.lastActivity).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recompensas Disponíveis</CardTitle>
                  <Dialog open={isCreateRewardOpen} onOpenChange={setIsCreateRewardOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Recompensa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Nova Recompensa</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Nome da Recompensa</Label>
                          <Input placeholder="Ex: 15% de Desconto" />
                        </div>
                        <div className="space-y-2">
                          <Label>Descrição</Label>
                          <Input placeholder="Descrição da recompensa..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Custo em Pontos</Label>
                          <Input type="number" placeholder="100" />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo da recompensa" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="discount">Desconto</SelectItem>
                              <SelectItem value="service">Serviço Gratuito</SelectItem>
                              <SelectItem value="product">Produto Gratuito</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button className="flex-1">Criar Recompensa</Button>
                          <Button variant="outline" onClick={() => setIsCreateRewardOpen(false)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loyaltyPrograms[0]?.rewards?.map((reward) => (
                    <Card key={reward.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Gift className="h-5 w-5 text-red-600" />
                          <Badge className={reward.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {reward.isActive ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1">{reward.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Coins className="h-4 w-4 text-yellow-600" />
                            <span className="font-semibold">{reward.pointsCost} pts</span>
                          </div>
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <Tag className="h-5 w-5 text-red-600" />
                    Gestão de Cupons Promocionais para Eventos
                  </CardTitle>
                  <Dialog open={isCreateCouponOpen} onOpenChange={setIsCreateCouponOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Novo Cupom de Evento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-red-50 border-red-200">
                      <DialogHeader>
                        <DialogTitle className="text-red-800 font-black text-xl">Criar Novo Cupom Promocional para Evento</DialogTitle>
                        <DialogDescription className="text-red-600">
                          Configure um cupom promocional específico para um evento
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-red-700 font-bold">Nome do Cupom</Label>
                            <Input placeholder="Ex: FlashPartyVerão-A" className="border-red-200 focus:border-red-500 focus:ring-red-200" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-red-700 font-bold">Código do Cupom</Label>
                            <Input placeholder="Ex: 99FLASH2025" className="border-red-200 focus:border-red-500 focus:ring-red-200" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-red-700 font-bold">Evento Associado</Label>
                            <Select>
                              <SelectTrigger className="border-red-200 focus:border-red-500">
                                <SelectValue placeholder="Selecione um evento" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-red-200">
                                {mockEvents.map((event) => (
                                  <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-red-700 font-bold">Limitação de Uso</Label>
                            <Input type="number" placeholder="50" className="border-red-200 focus:border-red-500 focus:ring-red-200" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-red-700 font-bold">Data de Expiração</Label>
                            <Input type="date" className="border-red-200 focus:border-red-500 focus:ring-red-200" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-red-700 font-bold">Categorias de Tatuagens Válidas</Label>
                            <div className="border border-red-200 rounded-md p-3 max-h-32 overflow-y-auto">
                              {mockCategories.map((category) => (
                                <div key={category} className="flex items-center space-x-2 mb-2">
                                  <Checkbox id={category} />
                                  <Label htmlFor={category} className="text-sm">{category}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-red-700 font-bold">Tatuadores Válidos</Label>
                            <div className="border border-red-200 rounded-md p-3 max-h-32 overflow-y-auto">
                              {mockArtists.map((artist) => (
                                <div key={artist} className="flex items-center space-x-2 mb-2">
                                  <Checkbox id={artist} />
                                  <Label htmlFor={artist} className="text-sm">{artist}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-red-700 font-bold">Tipo de Desconto</Label>
                            <Select>
                              <SelectTrigger className="border-red-200 focus:border-red-500">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-red-200">
                                <SelectItem value="percentage">% de desconto</SelectItem>
                                <SelectItem value="fixed">Valor fixo</SelectItem>
                                <SelectItem value="free_tattoo">Tatuagem grátis</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-red-700 font-bold">Valor do Desconto</Label>
                            <Input type="number" placeholder="20" className="border-red-200 focus:border-red-500 focus:ring-red-200" />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg">
                          Criar Cupom
                        </Button>
                        <Button variant="outline" onClick={() => setIsCreateCouponOpen(false)} className="border-red-200 text-red-600 hover:bg-red-50">
                          Cancelar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {eventCoupons.map((coupon) => (
                    <Card key={coupon.id} className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-red-600" />
                            <span className="font-bold text-red-800 text-sm">{coupon.code}</span>
                          </div>
                          <Badge className={coupon.status === 'active' ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}>
                            {coupon.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        
                        <h3 className="font-bold text-red-800 mb-2">{coupon.name}</h3>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-red-600">
                            <Calendar className="h-3 w-3" />
                            <span>{coupon.eventName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-red-600">
                            <Percent className="h-3 w-3" />
                            <span>{getDiscountLabel(coupon.discountType, coupon.discountValue)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-red-600">
                            <Users className="h-3 w-3" />
                            <span>{coupon.usedCount}/{coupon.usageLimit} utilizados</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-red-600">
                            <Clock className="h-3 w-3" />
                            <span>Válido até {new Date(coupon.expirationDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-red-200">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {coupon.categories.slice(0, 2).map((category) => (
                              <Badge key={category} variant="outline" className="text-xs border-red-200 text-red-600">
                                {category}
                              </Badge>
                            ))}
                            {coupon.categories.length > 2 && (
                              <Badge variant="outline" className="text-xs border-red-200 text-red-600">
                                +{coupon.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-red-500">
                              {coupon.validArtists.length} tatuador(es)
                            </span>
                            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Loyalty;
