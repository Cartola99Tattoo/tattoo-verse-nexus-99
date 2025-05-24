
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { IDashboardStats } from "@/services/interfaces/IDashboardService";

interface OptimizedStatsCardsProps {
  stats: IDashboardStats;
  loading: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  loading: boolean;
}

const StatCard = ({ title, value, change, icon, loading }: StatCardProps) => {
  const getChangeIcon = () => {
    if (change === undefined || change === 0) return <Minus className="h-3 w-3" />;
    return change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getChangeColor = () => {
    if (change === undefined || change === 0) return "text-gray-500";
    return change > 0 ? "text-green-600" : "text-red-600";
  };

  if (loading) {
    return (
      <Card className="animate-pulse shadow-lg bg-gradient-to-br from-white to-gray-100 border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </CardTitle>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-br from-white via-gray-50 to-white border-gray-200 hover:border-red-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className="p-2 bg-gradient-to-r from-red-100 to-red-50 rounded-lg shadow-md">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold text-gray-800 mb-2">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center text-xs ${getChangeColor()} bg-gray-50 px-2 py-1 rounded-full shadow-sm`}>
            {getChangeIcon()}
            <span className="ml-1 font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OptimizedStatsCards = ({ stats, loading }: OptimizedStatsCardsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Vendas Totais"
        value={`R$ ${stats.totalSales?.toLocaleString('pt-BR') || '0'}`}
        change={12.5}
        icon={<TrendingUp className="h-4 w-4 text-red-600" />}
        loading={loading}
      />
      <StatCard
        title="Novos Clientes"
        value={stats.newCustomers || 0}
        change={8.2}
        icon={<TrendingUp className="h-4 w-4 text-green-600" />}
        loading={loading}
      />
      <StatCard
        title="Pedidos Pendentes"
        value={stats.pendingOrders || 0}
        change={-2.1}
        icon={<Minus className="h-4 w-4 text-gray-600" />}
        loading={loading}
      />
      <StatCard
        title="Próximos Agendamentos"
        value={stats.upcomingAppointments || 0}
        change={15.3}
        icon={<TrendingUp className="h-4 w-4 text-blue-600" />}
        loading={loading}
      />
    </div>
  );
};

export default OptimizedStatsCards;
