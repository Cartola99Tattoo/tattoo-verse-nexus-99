
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, AlertTriangle, TrendingUp, Users, ShoppingCart, Calendar, Package, DollarSign, FileText, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getDashboardService, getClientService, getProductService, getFinancialService } from "@/services/serviceFactory";
import { IDashboardStats } from "@/services/interfaces/IDashboardService";
import { DashboardMetrics } from "@/services/interfaces/IFinancialService";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

// Componentes de Gráficos
import SalesChart from "@/components/admin/dashboard/SalesChart";
import OrdersTable from "@/components/admin/dashboard/OrdersTable";
import AppointmentsWidget from "@/components/admin/dashboard/AppointmentsWidget";
import RecentCustomers from "@/components/admin/dashboard/RecentCustomers";
import OptimizedStatsCards from "@/components/admin/dashboard/OptimizedStatsCards";

// Default stats to prevent null errors
const defaultStats: IDashboardStats = {
  totalSales: 0,
  newCustomers: 0,
  pendingOrders: 0,
  upcomingAppointments: 0,
  blogViews: 0
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const dashboardService = getDashboardService();
  const clientService = getClientService();
  const productService = getProductService();
  const financialService = getFinancialService();
  
  // Dashboard stats
  const { data: stats, loading } = useDataQuery<IDashboardStats>(
    () => dashboardService.fetchDashboardStats() as Promise<IDashboardStats>,
    []
  );

  // Dados de clientes
  const { data: clientStats } = useDataQuery(
    () => clientService.fetchClientStats(),
    []
  );

  // Dados de agendamentos
  const { data: appointments = [] } = useDataQuery(
    () => clientService.fetchUpcomingAppointments(10),
    []
  );

  // Dados de produtos
  const { data: products = [] } = useDataQuery(
    () => productService.fetchProducts({ limit: 5 }),
    []
  );

  // Dados financeiros
  const { data: financialData } = useDataQuery<DashboardMetrics>(
    () => financialService.fetchDashboardMetrics(),
    []
  );

  // Use default stats or fetched stats, ensuring we never have null values
  const safeStats = stats || defaultStats;

  // Calcular métricas do dia
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today);
  const confirmedAppointments = todayAppointments.filter(apt => apt.status === 'confirmed');

  // Alertas de estoque baixo (simulado)
  const lowStockItems = [
    { name: "Tinta Preta", quantity: 2, minimum: 5 },
    { name: "Agulhas 5RL", quantity: 3, minimum: 10 }
  ];

  return (
    <div className="space-y-6">
      {/* Alertas importantes */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center gap-2 p-4">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-800">
                Alerta de Estoque Baixo
              </p>
              <p className="text-xs text-orange-700">
                {lowStockItems.length} item(s) com estoque baixo
              </p>
            </div>
            <Badge variant="outline" className="text-orange-800 border-orange-300">
              {lowStockItems.length} alertas
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Vendas */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(financialData?.totalRevenue || 15420)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Agendamentos Hoje */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {todayAppointments.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {confirmedAppointments.length} confirmados
            </p>
          </CardContent>
        </Card>

        {/* Novos Clientes */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {clientStats?.new_clients_this_month || 8}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        {/* Produtos em Destaque */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
            <Package className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {products.length || 24}
            </div>
            <p className="text-xs text-muted-foreground">
              Na loja online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Blog Stats */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-600" />
              Blog Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Visualizações</span>
              <span className="font-semibold">2,340</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Artigos Publicados</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Engajamento</span>
              <span className="font-semibold text-green-600">+18%</span>
            </div>
          </CardContent>
        </Card>

        {/* Projetos */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-red-600" />
              Projetos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Flash Day Nov</span>
              <Badge variant="outline" className="text-orange-600">75%</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Novo Site</span>
              <Badge variant="outline" className="text-blue-600">90%</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Event Marketing</span>
              <Badge variant="outline" className="text-green-600">Concluído</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Finanças Resumo */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Receita</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(financialData?.totalRevenue || 15420)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Despesas</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(financialData?.totalExpenses || 8750)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Lucro</span>
              <span className="font-semibold text-green-600">
                {formatCurrency((financialData?.totalRevenue || 15420) - (financialData?.totalExpenses || 8750))}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg border border-gray-300 rounded-lg p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">
            <BarChart className="h-4 w-4" />
            <span>Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2 bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">
            <LineChart className="h-4 w-4" />
            <span>Vendas</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">
            <PieChart className="h-4 w-4" />
            <span>Análises</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="text-gray-800">Vendas Recentes</CardTitle>
                <CardDescription>Últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3 shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="text-gray-800">Próximos Agendamentos</CardTitle>
                <CardDescription>Agenda dos próximos dias</CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentsWidget />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="text-gray-800">Pedidos Recentes</CardTitle>
                <CardDescription>Últimos pedidos realizados</CardDescription>
              </CardHeader>
              <CardContent>
                <OrdersTable />
              </CardContent>
            </Card>
            
            <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="text-gray-800">Novos Clientes</CardTitle>
                <CardDescription>Clientes cadastrados recentemente</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentCustomers />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sales">
          <div className="grid gap-6">
            <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="text-gray-800">Análise de Vendas Detalhada</CardTitle>
                <CardDescription>Desempenho de vendas por categoria e período</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="text-gray-800">Performance do Blog</CardTitle>
                <CardDescription>Artigos mais acessados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Guia Completo: Cuidados Pós-Tatuagem</span>
                    <Badge variant="outline">1.2k views</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Estilos de Tatuagem: Old School vs New School</span>
                    <Badge variant="outline">890 views</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">História das Tatuagens no Brasil</span>
                    <Badge variant="outline">634 views</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="text-gray-800">Análise de Clientes</CardTitle>
                <CardDescription>Demografia e comportamento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxa de Conversão</span>
                    <span className="font-semibold text-green-600">
                      {clientStats?.conversion_rate || 24}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Clientes Ativos</span>
                    <span className="font-semibold">
                      {clientStats?.active_clients || 156}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ticket Médio</span>
                    <span className="font-semibold">
                      {formatCurrency(clientStats?.average_order_value || 520)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
