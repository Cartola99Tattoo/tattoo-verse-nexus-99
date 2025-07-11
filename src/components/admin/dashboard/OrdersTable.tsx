import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardService } from '@/services/serviceFactory';
import { useDataQuery } from '@/hooks/useDataQuery';

interface Order {
  id: string;
  reference_code: string;
  status: string;
  total_amount: number;
  created_at: string;
  customer_name?: string;
}

export default function OrdersTable() {
  const dashboardService = getDashboardService();
  
  const { data: orders = [], loading } = useDataQuery<Order[]>(
    () => dashboardService.fetchRecentOrders(5),
    []
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendente</Badge>;
      case 'paid':
      case 'pago':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Pago</Badge>;
      case 'shipped':
      case 'enviado':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Enviado</Badge>;
      case 'delivered':
      case 'entregue':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Entregue</Badge>;
      case 'canceled':
      case 'cancelado':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center justify-between p-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum pedido encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 font-medium text-sm text-gray-500 pb-1 border-b">
        <div>Pedido</div>
        <div>Cliente</div>
        <div>Status</div>
        <div className="text-right">Total</div>
      </div>
      {orders.map((order) => (
        <div key={order.id} className="grid grid-cols-4 items-center py-2 text-sm">
          <div>
            <div className="font-medium">{order.reference_code}</div>
            <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
          </div>
          <div className="truncate">{order.customer_name || 'Cliente'}</div>
          <div>{getStatusBadge(order.status)}</div>
          <div className="text-right font-medium">{formatCurrency(order.total_amount)}</div>
        </div>
      ))}
    </div>
  );
}
