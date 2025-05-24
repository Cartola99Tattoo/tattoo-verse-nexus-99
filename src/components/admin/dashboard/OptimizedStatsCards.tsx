
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
      <Card className="animate-pulse">
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center text-xs ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="ml-1">{Math.abs(change)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OptimizedStatsCards = ({ stats, loading }: OptimizedStatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Vendas Totais"
        value={`R$ ${stats.totalSales?.toLocaleString('pt-BR') || '0'}`}
        change={12.5}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />
      <StatCard
        title="Novos Clientes"
        value={stats.newCustomers || 0}
        change={8.2}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />
      <StatCard
        title="Pedidos Pendentes"
        value={stats.pendingOrders || 0}
        change={-2.1}
        icon={<Minus className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />
      <StatCard
        title="Próximos Agendamentos"
        value={stats.upcomingAppointments || 0}
        change={15.3}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        loading={loading}
      />
    </div>
  );
};

export default OptimizedStatsCards;
