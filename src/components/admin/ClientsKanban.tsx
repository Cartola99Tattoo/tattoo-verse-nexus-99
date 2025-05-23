
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import KanbanColumn from "./KanbanColumn";
import { Client } from "@/services/interfaces/IClientService";
import { getClientService } from "@/services/serviceFactory";
import { toast } from "@/hooks/use-toast";

interface ClientsKanbanProps {
  clients: Client[];
  onViewClient: (clientId: string) => void;
}

const ClientsKanban = ({ clients, onViewClient }: ClientsKanbanProps) => {
  const queryClient = useQueryClient();
  const clientService = getClientService();

  const updateClientMutation = useMutation({
    mutationFn: ({ clientId, status }: { clientId: string; status: string }) =>
      clientService.updateClient(clientId, { status: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-stats'] });
      toast({
        title: "Status atualizado",
        description: "O status do cliente foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do cliente.",
        variant: "destructive"
      });
    }
  });

  const handleStatusChange = (clientId: string, newStatus: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client && client.status !== newStatus) {
      updateClientMutation.mutate({ clientId, status: newStatus });
    }
  };

  const columns = [
    {
      title: "Novos Leads",
      status: "new",
      clients: clients.filter(c => c.status === "new")
    },
    {
      title: "Interessados", 
      status: "interested",
      clients: clients.filter(c => c.status === "interested")
    },
    {
      title: "Agendamento Pendente",
      status: "pending", 
      clients: clients.filter(c => c.status === "pending")
    },
    {
      title: "Tatuagem Concluída",
      status: "completed",
      clients: clients.filter(c => c.status === "completed")
    },
    {
      title: "Retorno Esperado",
      status: "returning",
      clients: clients.filter(c => c.status === "returning")
    },
    {
      title: "VIP/Fidelidade", 
      status: "vip",
      clients: clients.filter(c => c.status === "vip")
    }
  ];

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-4" style={{ minWidth: `${columns.length * 300}px` }}>
        {columns.map((column) => (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            clients={column.clients}
            onViewClient={onViewClient}
            onDrop={handleStatusChange}
            count={column.clients.length}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientsKanban;
