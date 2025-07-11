
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Users, Calendar, BarChart, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardsProps {
  stats: {
    totalSales: number;
    newCustomers: number;
    pendingOrders: number;
    upcomingAppointments: number;
    blogViews: number;
  };
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const cardItems = [
    {
      title: 'Vendas Totais',
      value: formatCurrency(stats.totalSales),
      description: 'Nos últimos 30 dias',
      icon: <BarChart className="h-5 w-5 text-purple-600" />,
      trendValue: '12%',
      trendDirection: 'up',
    },
    {
      title: 'Novos Clientes',
      value: stats.newCustomers.toString(),
      description: 'Nos últimos 30 dias',
      icon: <Users className="h-5 w-5 text-blue-600" />,
      trendValue: '5%',
      trendDirection: 'up',
    },
    {
      title: 'Pedidos Pendentes',
      value: stats.pendingOrders.toString(),
      description: 'Aguardando processamento',
      icon: <ShoppingCart className="h-5 w-5 text-orange-600" />,
      trendValue: '',
      trendDirection: '',
    },
    {
      title: 'Agendamentos',
      value: stats.upcomingAppointments.toString(),
      description: 'Próximos agendamentos',
      icon: <Calendar className="h-5 w-5 text-green-600" />,
      trendValue: '',
      trendDirection: '',
    },
    {
      title: 'Visualizações Blog',
      value: stats.blogViews.toString(),
      description: 'Total de visualizações',
      icon: <FileText className="h-5 w-5 text-pink-600" />,
      trendValue: '8%',
      trendDirection: 'up',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cardItems.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-1/2 mb-1" />
            ) : (
              <div className="text-2xl font-bold">{item.value}</div>
            )}
            <p className="text-xs text-muted-foreground">{item.description}</p>
            {item.trendValue && (
              <div className={`flex items-center text-xs mt-1 ${
                item.trendDirection === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {item.trendDirection === 'up' ? '↑' : '↓'} {item.trendValue}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
