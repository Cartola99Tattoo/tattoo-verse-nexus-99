
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getDashboardService } from "@/services/serviceFactory";
import { IDashboardStats } from "@/services/interfaces/IDashboardService";

// Componentes de Gráficos
import SalesChart from "@/components/admin/dashboard/SalesChart";
import OrdersTable from "@/components/admin/dashboard/OrdersTable";
import AppointmentsWidget from "@/components/admin/dashboard/AppointmentsWidget";
import RecentCustomers from "@/components/admin/dashboard/RecentCustomers";
import StatsCards from "@/components/admin/dashboard/StatsCards";
import AdminLayout from "@/components/admin/AdminLayout";

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
  
  const { data: stats, loading } = useDataQuery<IDashboardStats>(
    () => dashboardService.fetchDashboardStats() as Promise<IDashboardStats>,
    []
  );

  // Verificar se o usuário tem permissão para acessar o painel
  if (!user || !profile || (profile.role !== "admin" && profile.role !== "artista")) {
    return <Navigate to="/access-denied" />;
  }

  // Use default stats or fetched stats, ensuring we never have null values
  const safeStats = stats || defaultStats;

  return (
    <AdminLayout 
      title="Dashboard" 
      description="Bem-vindo ao painel de administração do 99Tattoo"
    >
      <div className="p-6">
        <StatsCards stats={safeStats} loading={loading} />

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Vendas</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Análises</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Vendas Recentes</CardTitle>
                  <CardDescription>Últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesChart />
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Agendamentos</CardTitle>
                  <CardDescription>Próximos agendamentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <AppointmentsWidget />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pedidos Recentes</CardTitle>
                  <CardDescription>Últimos pedidos realizados</CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdersTable />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Novos Clientes</CardTitle>
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
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Vendas Detalhada</CardTitle>
                  <CardDescription>Desempenho de vendas por categoria e período</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Funcionalidade em desenvolvimento
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Tendências</CardTitle>
                  <CardDescription>Insights sobre o desempenho do estúdio</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Funcionalidade em desenvolvimento
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
