
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/services/interfaces/IClientService";
import ClientCard from "./ClientCard";

interface KanbanColumnProps {
  title: string;
  status: string;
  clients: Client[];
  onViewClient: (clientId: string) => void;
  onDrop: (clientId: string, newStatus: string) => void;
  count: number;
}

const KanbanColumn = ({ 
  title, 
  status, 
  clients, 
  onViewClient, 
  onDrop, 
  count 
}: KanbanColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const clientId = e.dataTransfer.getData('text/plain');
    onDrop(clientId, status);
  };

  return (
    <div 
      className="flex-1 min-w-[280px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
          {clients.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              Nenhum cliente neste estágio
            </div>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', client.id);
                }}
                className="cursor-move"
              >
                <ClientCard 
                  client={client} 
                  onViewClient={onViewClient}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanColumn;
