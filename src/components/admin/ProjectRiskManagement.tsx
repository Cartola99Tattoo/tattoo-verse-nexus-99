
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { IProject, IProjectRisk, IProjectSmartGoal, SmartCriteria } from "@/services/interfaces/IProjectService";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getProjectService } from "@/services/serviceFactory";
import { toast } from "@/hooks/use-toast";
import SmartCriteriaSelector from "@/components/admin/SmartCriteriaSelector";

interface ProjectRiskManagementProps {
  project: IProject;
}

const ProjectRiskManagement = ({ project }: ProjectRiskManagementProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRisk, setEditingRisk] = useState<IProjectRisk | null>(null);
  const [formData, setFormData] = useState<{
    description: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
    smartGoalId: string;
    smartCriteria: SmartCriteria[];
  }>({
    description: '',
    probability: 'medium',
    impact: 'medium',
    mitigation: '',
    smartGoalId: 'none',
    smartCriteria: []
  });

  const projectService = getProjectService();

  const { data: risks = [], loading: risksLoading, refresh: refreshRisks } = useDataQuery<IProjectRisk[]>(
    () => projectService.fetchProjectRisks(project.id),
    [project.id]
  );

  const { data: smartGoals = [] } = useDataQuery<IProjectSmartGoal[]>(
    () => projectService.fetchProjectSmartGoals(project.id),
    [project.id]
  );

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occurred': return 'bg-red-100 text-red-800';
      case 'mitigated': return 'bg-green-100 text-green-800';
      case 'open': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'occurred': return 'Ocorrido';
      case 'mitigated': return 'Mitigado';
      case 'open': return 'Aberto';
      default: return status;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const riskData = {
        projectId: project.id,
        description: formData.description,
        probability: formData.probability,
        impact: formData.impact,
        mitigation: formData.mitigation,
        status: 'open' as const,
        smartGoalId: formData.smartGoalId !== 'none' ? formData.smartGoalId : undefined,
        smartCriteria: formData.smartCriteria.length > 0 ? formData.smartCriteria[0] : undefined
      };

      if (editingRisk) {
        await projectService.updateRisk(editingRisk.id, riskData);
        toast({
          title: "Risco atualizado",
          description: "O risco foi atualizado com sucesso.",
        });
      } else {
        await projectService.createRisk(riskData);
        toast({
          title: "Risco criado",
          description: "O risco foi criado com sucesso.",
        });
      }

      refreshRisks();
      resetForm();
    } catch (error) {
      console.error('Error saving risk:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar o risco. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      probability: 'medium',
      impact: 'medium',
      mitigation: '',
      smartGoalId: 'none',
      smartCriteria: []
    });
    setShowForm(false);
    setEditingRisk(null);
  };

  const handleEdit = (risk: IProjectRisk) => {
    setEditingRisk(risk);
    setFormData({
      description: risk.description,
      probability: risk.probability,
      impact: risk.impact,
      mitigation: risk.mitigation,
      smartGoalId: risk.smartGoalId || 'none',
      smartCriteria: risk.smartCriteria ? [risk.smartCriteria] : []
    });
    setShowForm(true);
  };

  const handleDelete = async (risk: IProjectRisk) => {
    if (confirm('Tem certeza que deseja excluir este risco?')) {
      try {
        await projectService.deleteRisk(risk.id);
        toast({
          title: "Risco excluído",
          description: "O risco foi excluído com sucesso.",
        });
        refreshRisks();
      } catch (error) {
        console.error('Error deleting risk:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir o risco. Tente novamente.",
          variant: "destructive"
        });
      }
    }
  };

  const getRiskPriority = (probability: string, impact: string) => {
    const probScore = probability === 'high' ? 3 : probability === 'medium' ? 2 : 1;
    const impactScore = impact === 'high' ? 3 : impact === 'medium' ? 2 : 1;
    const total = probScore * impactScore;
    
    if (total >= 6) return { label: 'Crítico', color: 'bg-red-100 text-red-800' };
    if (total >= 4) return { label: 'Alto', color: 'bg-orange-100 text-orange-800' };
    if (total >= 2) return { label: 'Médio', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Baixo', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-red-600 shadow-tattoo">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-red-50 to-white border-b border-red-100">
          <div>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Gestão de Riscos
            </CardTitle>
            <CardDescription>
              Identifique, avalie e mitigue riscos do projeto
            </CardDescription>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white shadow-red-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Risco
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {showForm && (
            <Card className="mb-6 border-red-200">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-800">
                  {editingRisk ? 'Editar Risco' : 'Novo Risco'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Descrição do Risco *</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descreva o risco identificado..."
                      required
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Probabilidade</label>
                      <Select value={formData.probability} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, probability: value })}>
                        <SelectTrigger className="border-red-200 focus:border-red-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Impacto</label>
                      <Select value={formData.impact} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, impact: value })}>
                        <SelectTrigger className="border-red-200 focus:border-red-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixo</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="high">Alto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Plano de Mitigação *</label>
                    <Textarea
                      value={formData.mitigation}
                      onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
                      placeholder="Como mitigar ou responder a este risco..."
                      required
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>

                  <SmartCriteriaSelector
                    smartGoals={smartGoals}
                    selectedGoalId={formData.smartGoalId}
                    selectedCriteria={formData.smartCriteria}
                    onGoalChange={(goalId) => setFormData({ ...formData, smartGoalId: goalId })}
                    onCriteriaChange={(criteria) => setFormData({ ...formData, smartCriteria: criteria })}
                    showLabel={false}
                  />
                  
                  <div className="flex gap-2 pt-4 border-t border-red-100">
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      {editingRisk ? 'Atualizar' : 'Criar'} Risco
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {risksLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando riscos...</p>
              </div>
            ) : risks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Nenhum risco identificado.</p>
                <p className="text-sm">Clique em "Novo Risco" para adicionar.</p>
              </div>
            ) : (
              risks.map((risk) => {
                const priority = getRiskPriority(risk.probability, risk.impact);
                return (
                  <Card key={risk.id} className="border-red-100 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={priority.color}>
                              {priority.label}
                            </Badge>
                            <Badge className={getStatusColor(risk.status)}>
                              {getStatusLabel(risk.status)}
                            </Badge>
                          </div>
                          
                          <h4 className="font-medium mb-2 text-gray-900">{risk.description}</h4>
                          
                          <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <span>Probabilidade:</span>
                              <Badge className={getProbabilityColor(risk.probability)}>
                                {risk.probability === 'high' ? 'Alta' : 
                                 risk.probability === 'medium' ? 'Média' : 'Baixa'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Impacto:</span>
                              <Badge className={getImpactColor(risk.impact)}>
                                {risk.impact === 'high' ? 'Alto' : 
                                 risk.impact === 'medium' ? 'Médio' : 'Baixo'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-sm">
                            <strong>Mitigação:</strong> {risk.mitigation}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(risk)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(risk)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectRiskManagement;
