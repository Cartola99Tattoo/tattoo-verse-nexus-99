
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit2, GripVertical, Save, ArrowLeft } from "lucide-react";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProjectService } from "@/services/serviceFactory";
import { IProject, IKanbanStage } from "@/services/interfaces/IProjectService";
import { toast } from "@/hooks/use-toast";

interface ProjectKanbanSettingsProps {
  project: IProject;
  onClose: () => void;
}

const ProjectKanbanSettings = ({ project, onClose }: ProjectKanbanSettingsProps) => {
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("gray");
  const projectService = getProjectService();

  const { data: stages = [], loading, refresh } = useDataQuery<IKanbanStage[]>(
    () => projectService.fetchKanbanStages(project.id),
    [project.id]
  );

  const addStage = async () => {
    if (!newStageName.trim()) return;
    
    try {
      await projectService.createKanbanStage({
        projectId: project.id,
        name: newStageName,
        order: stages.length + 1,
        color: newStageColor
      });
      
      setNewStageName("");
      setNewStageColor("gray");
      refresh();
      toast({
        title: "Etapa adicionada",
        description: `A etapa "${newStageName}" foi adicionada com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar etapa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const deleteStage = async (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    if (!stage) return;
    
    if (!confirm(`Tem certeza que deseja excluir a etapa "${stage.name}"?`)) return;
    
    try {
      await projectService.deleteKanbanStage(stageId);
      refresh();
      toast({
        title: "Etapa removida",
        description: `A etapa "${stage.name}" foi removida.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover etapa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const editStageName = async (stageId: string, newName: string) => {
    if (!newName.trim()) return;
    
    try {
      await projectService.updateKanbanStage(stageId, { name: newName });
      setEditingStage(null);
      refresh();
      toast({
        title: "Etapa atualizada",
        description: "O nome da etapa foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar etapa. Tente novamente.",
        variant: "destructive",
      });
    }
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
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurar Etapas</h1>
          <p className="text-gray-600">Projeto: {project.name}</p>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Etapas do Kanban</CardTitle>
            <CardDescription>
              Configure as etapas que aparecerão no quadro Kanban
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : stages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma etapa configurada. Adicione a primeira etapa abaixo.
                </div>
              ) : (
                stages
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
                              if (e.key === 'Escape') {
                                setEditingStage(null);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{stage.name}</span>
                            <Badge className={getColorClass(stage.color)}>
                              {stage.color}
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
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Nome da etapa"
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addStage()}
                className="flex-1"
              />
              <Select value={newStageColor} onValueChange={setNewStageColor}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addStage}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            <Save className="h-4 w-4 mr-2" />
            Concluir Configuração
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectKanbanSettings;
