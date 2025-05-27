
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { getProjectService } from "@/services/serviceFactory";
import { toast } from "@/hooks/use-toast";

interface CreateProjectFormProps {
  onProjectCreated: () => void;
  onCancel: () => void;
  initialDate?: string;
}

const CreateProjectForm = ({ onProjectCreated, onCancel, initialDate }: CreateProjectFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: initialDate || '',
    endDate: '',
    status: 'planning' as const,
    mainHypothesis: '',
    validationMetrics: '',
    valueCurve: '',
    valueInnovations: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const projectService = getProjectService();

  useEffect(() => {
    if (initialDate) {
      setFormData(prev => ({ ...prev, startDate: initialDate }));
    }
  }, [initialDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do projeto é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await projectService.createProject(formData);
      toast({
        title: "Sucesso",
        description: "Projeto criado com sucesso!",
      });
      onProjectCreated();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Projeto</h1>
          <p className="text-gray-600">Crie um novo projeto para organizar tarefas e eventos</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Projeto</CardTitle>
            <CardDescription>
              Preencha as informações básicas do seu projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Flash Day Verão 2024"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o objetivo e escopo do projeto..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status Inicial</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planejamento</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="on_hold">Em Espera</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Seção Lean Startup */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">Metodologia Lean Startup</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="hypothesis">Hipótese Principal</Label>
                  <Textarea
                    id="hypothesis"
                    placeholder="Qual é a principal hipótese que queremos validar com este projeto?"
                    value={formData.mainHypothesis}
                    onChange={(e) => handleInputChange('mainHypothesis', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metrics">Métricas de Validação</Label>
                  <Input
                    id="metrics"
                    placeholder="Como mediremos o sucesso? Ex: número de participantes, vendas"
                    value={formData.validationMetrics}
                    onChange={(e) => handleInputChange('validationMetrics', e.target.value)}
                  />
                </div>
              </div>

              {/* Seção Oceano Azul */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium">Estratégia Oceano Azul</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="valueCurve">Curva de Valor</Label>
                  <Textarea
                    id="valueCurve"
                    placeholder="Descreva os fatores de concorrência e como este projeto se diferencia..."
                    value={formData.valueCurve}
                    onChange={(e) => handleInputChange('valueCurve', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="innovations">Inovações de Valor</Label>
                  <Textarea
                    placeholder="Liste as inovações que tornam este projeto único (uma por linha)"
                    value={formData.valueInnovations.join('\n')}
                    onChange={(e) => handleInputChange('valueInnovations', e.target.value.split('\n').filter(Boolean))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Criando...' : 'Criar Projeto'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProjectForm;
