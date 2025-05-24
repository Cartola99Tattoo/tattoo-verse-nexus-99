
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { IProject } from "@/services/interfaces/IProjectService";

interface ProjectRisk {
  id: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'open' | 'mitigated' | 'occurred';
  createdAt: string;
}

interface ProjectRiskManagementProps {
  project: IProject;
}

const ProjectRiskManagement = ({ project }: ProjectRiskManagementProps) => {
  const [risks, setRisks] = useState<ProjectRisk[]>([
    {
      id: '1',
      description: 'Atraso na entrega de materiais de divulgação',
      probability: 'medium',
      impact: 'high',
      mitigation: 'Ter fornecedores alternativos e fazer pedidos com antecedência',
      status: 'open',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '2',
      description: 'Indisponibilidade de tatuadores no dia do evento',
      probability: 'low',
      impact: 'high',
      mitigation: 'Manter lista de tatuadores reserva e confirmar presença 48h antes',
      status: 'mitigated',
      createdAt: '2024-01-02T10:00:00Z'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingRisk, setEditingRisk] = useState<ProjectRisk | null>(null);
  const [formData, setFormData] = useState({
    description: '',
    probability: 'medium' as const,
    impact: 'medium' as const,
    mitigation: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRisk) {
      setRisks(risks.map(risk => 
        risk.id === editingRisk.id 
          ? { ...risk, ...formData }
          : risk
      ));
      setEditingRisk(null);
    } else {
      const newRisk: ProjectRisk = {
        id: Date.now().toString(),
        ...formData,
        status: 'open',
        createdAt: new Date().toISOString()
      };
      setRisks([...risks, newRisk]);
    }
    
    setFormData({ description: '', probability: 'medium', impact: 'medium', mitigation: '' });
    setShowForm(false);
  };

  const handleEdit = (risk: ProjectRisk) => {
    setEditingRisk(risk);
    setFormData({
      description: risk.description,
      probability: risk.probability,
      impact: risk.impact,
      mitigation: risk.mitigation
    });
    setShowForm(true);
  };

  const handleDelete = (riskId: string) => {
    if (confirm('Tem certeza que deseja excluir este risco?')) {
      setRisks(risks.filter(risk => risk.id !== riskId));
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Gestão de Riscos
            </CardTitle>
            <CardDescription>
              Identifique, avalie e mitigue riscos do projeto
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Risco
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingRisk ? 'Editar Risco' : 'Novo Risco'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Descrição do Risco</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descreva o risco identificado..."
                      required
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Probabilidade</label>
                      <Select value={formData.probability} onValueChange={(value: any) => setFormData({ ...formData, probability: value })}>
                        <SelectTrigger>
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
                      <label className="text-sm font-medium">Impacto</label>
                      <Select value={formData.impact} onValueChange={(value: any) => setFormData({ ...formData, impact: value })}>
                        <SelectTrigger>
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
                    <label className="text-sm font-medium">Plano de Mitigação</label>
                    <Textarea
                      value={formData.mitigation}
                      onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
                      placeholder="Como mitigar ou responder a este risco..."
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingRisk ? 'Atualizar' : 'Criar'} Risco
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowForm(false);
                        setEditingRisk(null);
                        setFormData({ description: '', probability: 'medium', impact: 'medium', mitigation: '' });
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {risks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum risco identificado. Clique em "Novo Risco" para adicionar.
              </div>
            ) : (
              risks.map((risk) => {
                const priority = getRiskPriority(risk.probability, risk.impact);
                return (
                  <Card key={risk.id}>
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
                          
                          <h4 className="font-medium mb-2">{risk.description}</h4>
                          
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
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(risk.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
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
