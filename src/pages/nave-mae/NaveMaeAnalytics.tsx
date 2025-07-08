
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Eye, Target, Globe } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockAnalyticsData = {
  overview: {
    totalRevenue: 2850000,
    revenueGrowth: 18.5,
    totalUsers: 12450,
    userGrowth: 12.3,
    appointments: 8965,
    appointmentGrowth: 15.7,
    conversion: 73.2,
    conversionGrowth: 2.1
  },
  topStudios: [
    { name: "Black Art Studio", revenue: 142000, growth: 25.4 },
    { name: "Aquarela Ink", revenue: 98000, growth: 18.2 },
    { name: "Neo Tattoo", revenue: 76000, growth: -5.1 },
    { name: "Ink Masters", revenue: 65000, growth: 32.1 }
  ],
  topServices: [
    { name: "Tatuagem Realista", bookings: 1250, revenue: 562500 },
    { name: "Tatuagem Aquarela", bookings: 890, revenue: 356000 },
    { name: "Blackwork", bookings: 760, revenue: 456000 },
    { name: "Fine Line", bookings: 650, revenue: 260000 }
  ],
  demographics: {
    age: [
      { range: "18-25", percentage: 35 },
      { range: "26-35", percentage: 42 },
      { range: "36-45", percentage: 18 },
      { range: "46+", percentage: 5 }
    ],
    gender: [
      { type: "Feminino", percentage: 58 },
      { type: "Masculino", percentage: 40 },
      { type: "Outro", percentage: 2 }
    ]
  },
  regions: [
    { state: "São Paulo", users: 4200, revenue: 1140000 },
    { state: "Rio de Janeiro", users: 2800, revenue: 756000 },
    { state: "Minas Gerais", users: 1900, revenue: 513000 },
    { state: "Paraná", users: 1200, revenue: 324000 }
  ]
};

const NaveMaeAnalytics = () => {
  const [periodFilter, setPeriodFilter] = useState("last_30_days");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? '↗' : '↘';
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Header com Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Consolidado</h2>
                <p className="text-gray-600">Análise de dados de toda a rede 99Tattoo</p>
              </div>
              
              <div className="flex gap-4 items-center">
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                    <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                    <SelectItem value="last_90_days">Últimos 90 dias</SelectItem>
                    <SelectItem value="this_year">Este ano</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="revenue">Receita</SelectItem>
                    <SelectItem value="users">Usuários</SelectItem>
                    <SelectItem value="appointments">Agendamentos</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  Exportar Relatório
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-green-600 text-sm font-medium">Receita Total</p>
                  <p className="text-3xl font-bold text-green-800">
                    {formatCurrency(mockAnalyticsData.overview.totalRevenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className={`flex items-center gap-2 ${getGrowthColor(mockAnalyticsData.overview.revenueGrowth)}`}>
                <span className="text-lg font-bold">
                  {getGrowthIcon(mockAnalyticsData.overview.revenueGrowth)} {Math.abs(mockAnalyticsData.overview.revenueGrowth)}%
                </span>
                <span className="text-sm">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total de Usuários</p>
                  <p className="text-3xl font-bold text-blue-800">
                    {mockAnalyticsData.overview.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className={`flex items-center gap-2 ${getGrowthColor(mockAnalyticsData.overview.userGrowth)}`}>
                <span className="text-lg font-bold">
                  {getGrowthIcon(mockAnalyticsData.overview.userGrowth)} {Math.abs(mockAnalyticsData.overview.userGrowth)}%
                </span>
                <span className="text-sm">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Agendamentos</p>
                  <p className="text-3xl font-bold text-purple-800">
                    {mockAnalyticsData.overview.appointments.toLocaleString()}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className={`flex items-center gap-2 ${getGrowthColor(mockAnalyticsData.overview.appointmentGrowth)}`}>
                <span className="text-lg font-bold">
                  {getGrowthIcon(mockAnalyticsData.overview.appointmentGrowth)} {Math.abs(mockAnalyticsData.overview.appointmentGrowth)}%
                </span>
                <span className="text-sm">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Taxa de Conversão</p>
                  <p className="text-3xl font-bold text-yellow-800">
                    {mockAnalyticsData.overview.conversion}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
              <div className={`flex items-center gap-2 ${getGrowthColor(mockAnalyticsData.overview.conversionGrowth)}`}>
                <span className="text-lg font-bold">
                  {getGrowthIcon(mockAnalyticsData.overview.conversionGrowth)} {Math.abs(mockAnalyticsData.overview.conversionGrowth)}%
                </span>
                <span className="text-sm">vs período anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Estúdios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Estúdios por Receita
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.topStudios.map((studio, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{studio.name}</p>
                        <p className="text-sm text-gray-500">{formatCurrency(studio.revenue)}</p>
                      </div>
                    </div>
                    <div className={`text-right ${getGrowthColor(studio.growth)}`}>
                      <p className="font-bold">
                        {getGrowthIcon(studio.growth)} {Math.abs(studio.growth)}%
                      </p>
                      <p className="text-xs">crescimento</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Serviços */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Serviços Mais Populares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.bookings} agendamentos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(service.revenue)}</p>
                      <p className="text-xs text-gray-500">receita</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Demografia por Idade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Demografia por Idade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.demographics.age.map((ageGroup, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{ageGroup.range} anos</span>
                        <span className="text-sm text-gray-500">{ageGroup.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${ageGroup.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance por Região */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Performance por Região
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.regions.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{region.state}</p>
                      <p className="text-sm text-gray-500">{region.users.toLocaleString()} usuários</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{formatCurrency(region.revenue)}</p>
                      <p className="text-xs text-gray-500">receita</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demografia por Gênero */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-yellow-600" />
              Distribuição por Gênero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {mockAnalyticsData.demographics.gender.map((gender, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-4xl font-bold text-purple-600 mb-2">{gender.percentage}%</div>
                  <div className="text-sm font-medium text-gray-700">{gender.type}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeAnalytics;
