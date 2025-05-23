
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getClientService } from "@/services/serviceFactory";
import { Client } from "@/services/interfaces/IClientService";
import { formatDate } from "@/lib/utils";
import { User, Calendar, MessageSquare, Crown } from "lucide-react";

interface ClientsKanbanProps {
  searchTerm: string;
  statusFilter: string;
  onClientClick: (clientId: string) => void;
}

const ClientsKanban = ({ searchTerm, statusFilter, onClientClick }: ClientsKanbanProps) => {
  const clientService = getClientService();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients', searchTerm, statusFilter],
    queryFn: () => clientService.fetchClients({
      search: searchTerm || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: 200
    }),
  });

  const getClientsByStatus = (status: string) => {
    return clients.filter(client => client.status === status);
  };

  const kanbanColumns = [
    { 
      id: 'new', 
      title: 'Novos Leads', 
      clients: getClientsByStatus('new'),
      color: 'bg-blue-50 border-blue-200'
    },
    { 
      id: 'active', 
      title: 'Ativos', 
      clients: getClientsByStatus('active'),
      color: 'bg-green-50 border-green-200'
    },
    { 
      id: 'inactive', 
      title: 'Inativos', 
      clients: getClientsByStatus('inactive'),
      color: 'bg-gray-50 border-gray-200'
    },
    { 
      id: 'vip', 
      title: 'VIP/Fidelidade', 
      clients: getClientsByStatus('vip'),
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  const ClientCard = ({ client }: { client: Client }) => (
    <Card 
      className="mb-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClientClick(client.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{client.name}</h4>
            <p className="text-xs text-gray-500 truncate">{client.email}</p>
            
            <div className="flex items-center gap-2 mt-2">
              {client.preferred_style && (
                <Badge variant="outline" className="text-xs">
                  {client.preferred_style}
                </Badge>
              )}
              
              {client.total_orders > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {client.total_orders} pedidos
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>Desde {formatDate(client.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kanbanColumns.map((column) => (
        <div key={column.id} className={`rounded-lg border-2 ${column.color} p-4`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">{column.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {column.clients.length}
            </Badge>
          </div>
          
          <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
            {column.clients.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">
                Nenhum cliente neste status
              </p>
            ) : (
              column.clients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientsKanban;
