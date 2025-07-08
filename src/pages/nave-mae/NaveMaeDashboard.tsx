
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, DollarSign, TrendingUp, Building, Calendar, Shield, Database } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import { calculateConsolidatedMetrics, mockStudios } from "@/services/mock/mockMultiTenantData";

const NaveMaeDashboard = () => {
  const consolidatedData = calculateConsolidatedMetrics();

  return (
    <NaveMaeLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
              Dashboard Nave Mãe
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Visão consolidada de toda a rede 99Tattoo
          </p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Receita Total da Rede</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                R$ {consolidatedData.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-300">
                Lucro: R$ {consolidatedData.netProfit.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Estúdios Ativos</CardTitle>
              <Building className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {consolidatedData.totalStudios}
              </div>
              <p className="text-xs text-gray-300">
                Média: R$ {Math.round(consolidatedData.averageRevenuePerStudio).toLocaleString()}/estúdio
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Agendamentos Totais</CardTitle>
              <Calendar className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {consolidatedData.totalAppointments}
              </div>
              <p className="text-xs text-gray-300">
                {consolidatedData.completedAppointments} concluídos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {consolidatedData.conversionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-300">
                {consolidatedData.totalClients} clientes totais
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm border-purple-500/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="studios" className="text-white data-[state=active]:bg-purple-600">
              Estúdios Parceiros
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-white data-[state=active]:bg-purple-600">
              Performance
            </TabsTrigger>
            <TabsTrigger value="security" className="text-white data-[state=active]:bg-purple-600">
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    Distribuição de Receita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {consolidatedData.revenueByStudio
                      .sort((a: any, b: any) => b.revenue - a.revenue)
                      .slice(0, 5)
                      .map((studio: any) => (
                        <div key={studio.id} className="flex justify-between items-center">
                          <div>
                            <span className="text-white font-medium">{studio.name}</span>
                            <p className="text-xs text-gray-400">{studio.location}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-purple-400 font-semibold">
                              R$ {studio.revenue.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">
                              {studio.appointments} agendamentos
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {consolidatedData.revenueByStudio
                      .sort((a: any, b: any) => b.profit - a.profit)
                      .slice(0, 5)
                      .map((studio: any, index: number) => (
                        <div key={studio.id} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <span className="text-white font-medium">{studio.name}</span>
                              <p className="text-xs text-gray-400">
                                {studio.clients} clientes
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 font-semibold">
                              R$ {studio.profit.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400">lucro</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="studios">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consolidatedData.revenueByStudio.map((studio: any) => (
                <Card key={studio.id} className="bg-white/5 backdrop-blur-sm border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      {studio.name}
                      <Badge 
                        variant={studio.subscription_tier === 'enterprise' ? 'default' : 'secondary'}
                        className="bg-purple-600 text-white"
                      >
                        {studio.subscription_tier}
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-400 text-sm">{studio.location}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Receita:</span>
                      <span className="text-green-400 font-semibold">
                        R$ {studio.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Despesas:</span>
                      <span className="text-red-400 font-semibold">
                        R$ {studio.expenses.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Lucro:</span>
                      <span className="text-purple-400 font-semibold">
                        R$ {studio.profit.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-purple-500/20 pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Agendamentos:</span>
                        <span className="text-white">{studio.appointments}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Clientes:</span>
                        <span className="text-white">{studio.clients}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Receita Total da Rede:</span>
                    <span className="text-green-400 font-bold">
                      R$ {consolidatedData.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Margem de Lucro:</span>
                    <span className="text-purple-400 font-bold">
                      {((consolidatedData.netProfit / consolidatedData.totalRevenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Taxa de Conversão:</span>
                    <span className="text-blue-400 font-bold">
                      {consolidatedData.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Ticket Médio:</span>
                    <span className="text-yellow-400 font-bold">
                      R$ {Math.round(consolidatedData.totalRevenue / consolidatedData.completedAppointments).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Crescimento da Rede</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Estúdios Enterprise:</span>
                    <span className="text-purple-400 font-bold">
                      {mockStudios.filter(s => s.subscription_tier === 'enterprise').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Estúdios Premium:</span>
                    <span className="text-blue-400 font-bold">
                      {mockStudios.filter(s => s.subscription_tier === 'premium').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Estúdios Basic:</span>
                    <span className="text-green-400 font-bold">
                      {mockStudios.filter(s => s.subscription_tier === 'basic').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Cobertura Nacional:</span>
                    <span className="text-yellow-400 font-bold">
                      {new Set(mockStudios.map(s => s.location.split(', ')[1])).size} estados
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-white/5 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-400" />
                  Status de Segurança da Plataforma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white">Segregação de Dados Ativa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white">RLS (Row Level Security) Configurado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white">Auditoria de Acessos Habilitada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white">Backup Automático Ativo</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300">Dados Protegidos:</span>
                      <span className="text-white font-semibold">
                        {consolidatedData.totalClients + consolidatedData.totalAppointments} registros
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300">Usuários Ativos:</span>
                      <span className="text-white font-semibold">
                        {mockStudios.length} administradores
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300">Último Teste de Segurança:</span>
                      <span className="text-green-400 font-semibold">Aprovado</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeDashboard;
