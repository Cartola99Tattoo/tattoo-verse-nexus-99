
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit2, GripVertical, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface KanbanStage {
  id: string;
  name: string;
  order: number;
  color: string;
  status_key: string;
}

interface KanbanSettingsProps {
  onClose: () => void;
}

const KanbanSettings = ({ onClose }: KanbanSettingsProps) => {
  const [stages, setStages] = useState<KanbanStage[]>([
    { id: "1", name: "Novos Leads", order: 1, color: "blue", status_key: "new" },
    { id: "2", name: "Interessados", order: 2, color: "yellow", status_key: "interested" },
    { id: "3", name: "Agendamento Pendente", order: 3, color: "orange", status_key: "pending" },
    { id: "4", name: "Tatuagem Concluída", order: 4, color: "green", status_key: "completed" },
    { id: "5", name: "Retorno Esperado", order: 5, color: "purple", status_key: "returning" },
    { id: "6", name: "VIP/Fidelidade", order: 6, color: "pink", status_key: "vip" },
  ]);

  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [newStageName, setNewStageName] = useState("");

  const addStage = () => {
    if (!newStageName.trim()) return;
    
    const newStage: KanbanStage = {
      id: Date.now().toString(),
      name: newStageName,
      order: stages.length + 1,
      color: "gray",
      status_key: newStageName.toLowerCase().replace(/\s+/g, '_')
    };
    
    setStages([...stages, newStage]);
    setNewStageName("");
    toast({
      title: "Estágio adicionado",
      description: `O estágio "${newStageName}" foi adicionado com sucesso.`,
    });
  };

  const deleteStage = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return;
    
    setStages(stages.filter(s => s.id !== stageId));
    toast({
      title: "Estágio removido",
      description: `O estágio "${stage.name}" foi removido.`,
    });
  };

  const editStageName = (stageId: string, newName: string) => {
    setStages(stages.map(stage => 
      stage.id === stageId 
        ? { ...stage, name: newName }
        : stage
    ));
    setEditingStage(null);
    toast({
      title: "Estágio atualizado",
      description: "O nome do estágio foi atualizado com sucesso.",
    });
  };

  const saveSettings = () => {
    // Em uma implementação real, aqui seria feita a persistência no banco de dados
    console.log("Salvando configurações do Kanban:", stages);
    toast({
      title: "Configurações salvas",
      description: "As configurações do Kanban foram salvas com sucesso.",
    });
    onClose();
  };

  const colorOptions = [
    { value: "blue", label: "Azul", class: "bg-blue-100 text-blue-800" },
    { value: "green", label: "Verde", class: "bg-green-100 text-green-800" },
    { value: "yellow", label: "Amarelo", class: "bg-yellow-100 text-yellow-800" },
    { value: "orange", label: "Laranja", class: "bg-orange-100 text-orange-800" },
    { value: "red", label: "Vermelho", class: "bg-red-100 text-red-800" },
    { value: "purple", label: "Roxo", class: "bg-purple-100 text-purple-800" },
    { value: "pink", label: "Rosa", class: "bg-pink-100 text-pink-800" },
    { value: "gray", label: "Cinza", class: "bg-gray-100 text-gray-800" },
  ];

  const getColorClass = (color: string) => {
    return colorOptions.find(opt => opt.value === color)?.class || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estágios do Kanban</CardTitle>
          <CardDescription>
            Configure os estágios que aparecerão no painel Kanban
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stages
              .sort((a, b) => a.order - b.order)
              .map((stage) => (
                <div
                  key={stage.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  
                  <div className="flex-1">
                    {editingStage === stage.id ? (
                      <Input
                        defaultValue={stage.name}
                        onBlur={(e) => editStageName(stage.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            editStageName(stage.id, e.currentTarget.value);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stage.name}</span>
                        <Badge className={getColorClass(stage.color)}>
                          {stage.status_key}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingStage(stage.id)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteStage(stage.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Estágio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Nome do estágio"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStage()}
            />
            <Button onClick={addStage}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={saveSettings}>
          <Save className="h-4 w-4 mr-1" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default KanbanSettings;
