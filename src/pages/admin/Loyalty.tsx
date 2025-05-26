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
import { Crown, Gift, Star, Plus, Users, Settings, Award, TrendingUp, Coins } from "lucide-react";
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

const Loyalty = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);
  const [isCreateRewardOpen, setIsCreateRewardOpen] = useState(false);

  // Mock data
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

  const getLevelBadge = (level: string) => {
    const levels = {
      "Bronze": "bg-orange-100 text-orange-800 border-orange-300",
      "Prata": "bg-gray-100 text-gray-800 border-gray-300",
      "Ouro": "bg-yellow-100 text-yellow-800 border-yellow-300"
    };
    return levels[level as keyof typeof levels] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programa de Fidelidade</h1>
          <p className="text-gray-600">Gerencie programas de fidelidade e recompensas</p>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{loyaltyMembers.length}</div>
            <p className="text-xs text-muted-foreground">+12% este mês</p>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Distribuídos</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">24,567</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recompensas Resgatadas</CardTitle>
            <Gift className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">89</div>
            <p className="text-xs text-muted-foreground">+5% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">76%</div>
            <p className="text-xs text-muted-foreground">Membros ativos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="programs">Programas</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Programas Ativos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-purple-600" />
                Programas Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Top Membros Fidelidade
              </CardTitle>
            </CardHeader>
            <CardContent>
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
      </Tabs>
    </div>
  );
};

export default Loyalty;
