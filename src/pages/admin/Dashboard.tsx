
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getDashboardService } from "@/services/serviceFactory";
import { IDashboardStats } from "@/services/interfaces/IDashboardService";

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
  
  const { data: stats, loading } = useDataQuery<IDashboardStats>(
    () => dashboardService.fetchDashboardStats() as Promise<IDashboardStats>,
    []
  );

  // Use default stats or fetched stats, ensuring we never have null values
  const safeStats = stats || defaultStats;

  return (
    <div className="space-y-6">
      <OptimizedStatsCards stats={safeStats} loading={loading} />

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
                <CardTitle className="text-gray-800">Agendamentos</CardTitle>
                <CardDescription>Próximos agendamentos</CardDescription>
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
                <p className="text-center py-8 text-muted-foreground">
                  Funcionalidade em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="text-gray-800">Análise de Tendências</CardTitle>
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
  );
};

export default Dashboard;
