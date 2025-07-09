import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3, 
  Calendar,
  Clock,
  DollarSign,
  Brush,
  Share2,
  Eye,
  EyeOff,
  Trophy,
  Target,
  Zap,
  Calculator,
  Coins,
  Loader2
} from 'lucide-react';
import { MonthlyMetrics } from '@/services/FirestoreService';

interface MonthlyMetric {
  id: string;
  month: number;
  year: number;
  tattoosCompleted: number;
  hoursWorked: number;
  monthlyRevenue: number;
  isShared: boolean;
  createdAt: string;
}

interface MonthlyMetricsManagerProps {
  metrics: Record<string, MonthlyMetrics>;
  onUpdate: (monthYear: string, metrics: Omit<MonthlyMetrics, 'dataRegistro'>) => Promise<boolean>;
}

const MonthlyMetricsManager: React.FC<MonthlyMetricsManagerProps> = ({ metrics, onUpdate }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<MonthlyMetric | null>(null);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    tattoosCompleted: 0,
    hoursWorked: 0,
    monthlyRevenue: 0,
    isShared: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Converter dados do Firestore para o formato local
  const localMetrics: MonthlyMetric[] = Object.entries(metrics).map(([monthYear, data]) => {
    const [year, month] = monthYear.split('-').map(Number);
    return {
      id: monthYear,
      month,
      year,
      tattoosCompleted: data.tatuagensRealizadas,
      hoursWorked: data.horasTrabalhadas,
      monthlyRevenue: data.valorTotalRecebido,
      isShared: data.compartilhadoComunidade,
      createdAt: data.dataRegistro?.toDate?.()?.toISOString() || new Date().toISOString()
    };
  });

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Ordenar métricas por data (mais recente primeiro)
  const sortedMetrics = [...localMetrics].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const isMonthYearExists = (month: number, year: number, excludeId?: string) => {
    return localMetrics.some(m => m.month === month && m.year === year && m.id !== excludeId);
  };

  const calculateDerivedMetrics = (metric: MonthlyMetric) => {
    const avgPerTattoo = metric.tattoosCompleted > 0 
      ? metric.monthlyRevenue / metric.tattoosCompleted 
      : 0;
    
    const avgPerHour = metric.hoursWorked > 0 
      ? metric.monthlyRevenue / metric.hoursWorked 
      : 0;

    return {
      avgPerTattoo,
      avgPerHour
    };
  };

  const getComparison = (currentMetric: MonthlyMetric) => {
    const currentIndex = sortedMetrics.findIndex(m => m.id === currentMetric.id);
    if (currentIndex === -1 || currentIndex === sortedMetrics.length - 1) return null;
    
    const previousMetric = sortedMetrics[currentIndex + 1];
    const currentDerived = calculateDerivedMetrics(currentMetric);
    const previousDerived = calculateDerivedMetrics(previousMetric);
    
    return {
      tattoos: {
        current: currentMetric.tattoosCompleted,
        previous: previousMetric.tattoosCompleted,
        diff: currentMetric.tattoosCompleted - previousMetric.tattoosCompleted,
        percentage: previousMetric.tattoosCompleted > 0 
          ? Math.round(((currentMetric.tattoosCompleted - previousMetric.tattoosCompleted) / previousMetric.tattoosCompleted) * 100)
          : 0
      },
      hours: {
        current: currentMetric.hoursWorked,
        previous: previousMetric.hoursWorked,
        diff: currentMetric.hoursWorked - previousMetric.hoursWorked,
        percentage: previousMetric.hoursWorked > 0 
          ? Math.round(((currentMetric.hoursWorked - previousMetric.hoursWorked) / previousMetric.hoursWorked) * 100)
          : 0
      },
      revenue: {
        current: currentMetric.monthlyRevenue,
        previous: previousMetric.monthlyRevenue,
        diff: currentMetric.monthlyRevenue - previousMetric.monthlyRevenue,
        percentage: previousMetric.monthlyRevenue > 0 
          ? Math.round(((currentMetric.monthlyRevenue - previousMetric.monthlyRevenue) / previousMetric.monthlyRevenue) * 100)
          : 0
      },
      avgPerTattoo: {
        current: currentDerived.avgPerTattoo,
        previous: previousDerived.avgPerTattoo,
        diff: currentDerived.avgPerTattoo - previousDerived.avgPerTattoo,
        percentage: previousDerived.avgPerTattoo > 0 
          ? Math.round(((currentDerived.avgPerTattoo - previousDerived.avgPerTattoo) / previousDerived.avgPerTattoo) * 100)
          : 0
      },
      avgPerHour: {
        current: currentDerived.avgPerHour,
        previous: previousDerived.avgPerHour,
        diff: currentDerived.avgPerHour - previousDerived.avgPerHour,
        percentage: previousDerived.avgPerHour > 0 
          ? Math.round(((currentDerived.avgPerHour - previousDerived.avgPerHour) / previousDerived.avgPerHour) * 100)
          : 0
      }
    };
  };

  const handleAdd = async () => {
    if (isMonthYearExists(formData.month, formData.year)) {
      toast({
        title: "Registro já existe",
        description: `Já existe um registro para ${months.find(m => m.value === formData.month)?.label} de ${formData.year}`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    const monthYear = `${formData.year}-${formData.month.toString().padStart(2, '0')}`;
    const success = await onUpdate(monthYear, {
      tatuagensRealizadas: formData.tattoosCompleted,
      horasTrabalhadas: formData.hoursWorked,
      valorTotalRecebido: formData.monthlyRevenue,
      compartilhadoComunidade: formData.isShared
    });

    if (success) {
      setIsAddModalOpen(false);
      resetForm();
      toast({
        title: "Registro adicionado!",
        description: "Suas métricas mensais foram salvas com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as métricas. Tente novamente.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleEdit = (metric: MonthlyMetric) => {
    setEditingMetric(metric);
    setFormData({
      month: metric.month,
      year: metric.year,
      tattoosCompleted: metric.tattoosCompleted,
      hoursWorked: metric.hoursWorked,
      monthlyRevenue: metric.monthlyRevenue,
      isShared: metric.isShared
    });
  };

  const handleUpdate = async () => {
    if (!editingMetric) return;

    if (isMonthYearExists(formData.month, formData.year, editingMetric.id)) {
      toast({
        title: "Registro já existe",
        description: `Já existe um registro para ${months.find(m => m.value === formData.month)?.label} de ${formData.year}`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    const monthYear = `${formData.year}-${formData.month.toString().padStart(2, '0')}`;
    const success = await onUpdate(monthYear, {
      tatuagensRealizadas: formData.tattoosCompleted,
      horasTrabalhadas: formData.hoursWorked,
      valorTotalRecebido: formData.monthlyRevenue,
      compartilhadoComunidade: formData.isShared
    });

    if (success) {
      setEditingMetric(null);
      resetForm();
      toast({
        title: "Registro atualizado!",
        description: "Suas métricas foram atualizadas com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar as métricas. Tente novamente.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const handleDelete = (metricId: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este registro?");
    if (confirmDelete) {
      // onUpdate(metrics.filter(m => m.id !== metricId));
      toast({
        title: "Não implementado",
        description: "Ainda não é possível excluir registros.",
      });
    }
  };

  const handleToggleShare = async (metricId: string) => {
    const metric = localMetrics.find(m => m.id === metricId);
    if (!metric) return;

    const success = await onUpdate(metricId, {
      tatuagensRealizadas: metric.tattoosCompleted,
      horasTrabalhadas: metric.hoursWorked,
      valorTotalRecebido: metric.monthlyRevenue,
      compartilhadoComunidade: !metric.isShared
    });

    if (success) {
      const monthName = months.find(m => m.value === metric?.month)?.label;
    
      toast({
        title: metric?.isShared ? "Compartilhamento removido" : "Compartilhado na comunidade!",
        description: metric?.isShared 
          ? `O registro de ${monthName} não é mais público`
          : `Seu progresso de ${monthName} agora é visível para a comunidade`,
      });
    } else {
      toast({
        title: "Erro ao compartilhar",
        description: "Ocorreu um erro ao alterar o status de compartilhamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      tattoosCompleted: 0,
      hoursWorked: 0,
      monthlyRevenue: 0,
      isShared: false
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const TrendIcon = ({ value, className = "h-4 w-4" }: { value: number; className?: string }) => {
    if (value > 0) return <TrendingUp className={`${className} text-green-500`} />;
    if (value < 0) return <TrendingDown className={`${className} text-red-500`} />;
    return <div className={`${className} border border-gray-300 rounded-full`} />;
  };

  const TrendBadge = ({ value, showPercentage = false, isCurrency = false }: { 
    value: number; 
    showPercentage?: boolean; 
    isCurrency?: boolean;
  }) => {
    const isPositive = value > 0;
    const isNegative = value < 0;
    
    if (value === 0) return null;

    const displayValue = showPercentage 
      ? `${Math.abs(value)}%` 
      : isCurrency 
        ? formatCurrency(Math.abs(value))
        : `${value > 0 ? '+' : ''}${value}`;

    return (
      <Badge className={`ml-2 ${
        isPositive ? 'bg-green-100 text-green-800 border-green-200' :
        isNegative ? 'bg-red-100 text-red-800 border-red-200' :
        'bg-gray-100 text-gray-800 border-gray-200'
      }`}>
        <TrendIcon value={value} className="h-3 w-3 mr-1" />
        {displayValue}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Acompanhamento de Métricas
              </h2>
              <p className="text-blue-600">
                Registre suas métricas mensais para acompanhar seu crescimento e compartilhar conquistas com a comunidade
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-blue-600 text-white">
                {localMetrics.length} {localMetrics.length === 1 ? 'Registro' : 'Registros'}
              </Badge>
            </div>
          </div>

          {localMetrics.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <Trophy className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Melhor Mês (Tatuagens)</div>
                  <div className="font-bold text-blue-700">
                    {Math.max(...localMetrics.map(m => m.tattoosCompleted))}
                  </div>
                </div>
                <div>
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Melhor Mês (Horas)</div>
                  <div className="font-bold text-blue-700">
                    {Math.max(...localMetrics.map(m => m.hoursWorked))}h
                  </div>
                </div>
                <div>
                  <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Melhor Faturamento</div>
                  <div className="font-bold text-blue-700">
                    {formatCurrency(Math.max(...localMetrics.map(m => m.monthlyRevenue)))}
                  </div>
                </div>
                <div>
                  <Calculator className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Melhor Valor/Tatuagem</div>
                  <div className="font-bold text-blue-700">
                    {formatCurrency(Math.max(...localMetrics.map(m => {
                      const derived = calculateDerivedMetrics(m);
                      return derived.avgPerTattoo;
                    })))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botão Adicionar */}
      <div className="flex justify-center">
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Registro Mensal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Registro Mensal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mês</Label>
                  <Select value={formData.month.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, month: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ano</Label>
                  <Select value={formData.year.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tatuagens Realizadas</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.tattoosCompleted}
                  onChange={(e) => setFormData(prev => ({ ...prev, tattoosCompleted: parseInt(e.target.value) || 0 }))}
                  className="rounded-lg"
                />
              </div>

              <div>
                <Label>Horas Trabalhadas</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.hoursWorked}
                  onChange={(e) => setFormData(prev => ({ ...prev, hoursWorked: parseInt(e.target.value) || 0 }))}
                  className="rounded-lg"
                />
              </div>

              <div>
                <Label>Faturamento Total (R$)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyRevenue}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyRevenue: parseFloat(e.target.value) || 0 }))}
                  className="rounded-lg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isShared}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isShared: checked }))}
                />
                <Label>Compartilhar na comunidade</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleAdd} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Adicionar'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="border-blue-200">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Métricas */}
      {localMetrics.length === 0 ? (
        <Card className="border-blue-100">
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Comece a registrar suas métricas
            </h3>
            <p className="text-gray-600 mb-6">
              Acompanhe seu crescimento registrando suas métricas mensais e veja sua evolução ao longo do tempo
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedMetrics.map((metric, index) => {
            const monthName = months.find(m => m.value === metric.month)?.label;
            const comparison = getComparison(metric);
            const derived = calculateDerivedMetrics(metric);
            const isCurrentMonth = index === 0;

            return (
              <Card key={metric.id} className={`${isCurrentMonth ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`${isCurrentMonth ? 'text-blue-700' : 'text-gray-800'} flex items-center gap-2`}>
                      <Calendar className="h-5 w-5" />
                      {monthName} {metric.year}
                      {isCurrentMonth && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          <Zap className="h-3 w-3 mr-1" />
                          Mais Recente
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {metric.isShared ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <Eye className="h-3 w-3 mr-1" />
                          Público
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Privado
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleShare(metric.id)}
                        className="text-blue-600 hover:bg-blue-100"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(metric)}
                        className="text-gray-600 hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(metric.id)}
                        className="text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Métricas Principais */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Brush className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-gray-600">Tatuagens</span>
                        </div>
                        {comparison && (
                          <TrendBadge value={comparison.tattoos.diff} />
                        )}
                      </div>
                      <div className="text-2xl font-bold text-purple-700">
                        {metric.tattoosCompleted}
                      </div>
                      {comparison && (
                        <div className="text-xs text-gray-500 mt-1">
                          vs {comparison.tattoos.previous} no mês anterior
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span className="text-sm text-gray-600">Horas</span>
                        </div>
                        {comparison && (
                          <TrendBadge value={comparison.hours.diff} />
                        )}
                      </div>
                      <div className="text-2xl font-bold text-orange-700">
                        {metric.hoursWorked}h
                      </div>
                      {comparison && (
                        <div className="text-xs text-gray-500 mt-1">
                          vs {comparison.hours.previous}h no mês anterior
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">Faturamento</span>
                        </div>
                        {comparison && (
                          <TrendBadge value={comparison.revenue.percentage} showPercentage />
                        )}
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {formatCurrency(metric.monthlyRevenue)}
                      </div>
                      {comparison && (
                        <div className="text-xs text-gray-500 mt-1">
                          vs {formatCurrency(comparison.revenue.previous)} no mês anterior
                        </div>
                      )}
                    </div>

                    {/* Novas Métricas Calculadas */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-indigo-600" />
                          <span className="text-sm text-gray-600">Valor/Tatuagem</span>
                        </div>
                        {comparison && (
                          <TrendBadge value={comparison.avgPerTattoo.diff} isCurrency />
                        )}
                      </div>
                      <div className="text-2xl font-bold text-indigo-700">
                        {derived.avgPerTattoo > 0 ? formatCurrency(derived.avgPerTattoo) : 'N/A'}
                      </div>
                      {comparison && comparison.avgPerTattoo.previous > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          vs {formatCurrency(comparison.avgPerTattoo.previous)} no mês anterior
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4 text-teal-600" />
                          <span className="text-sm text-gray-600">Valor/Hora</span>
                        </div>
                        {comparison && (
                          <TrendBadge value={comparison.avgPerHour.diff} isCurrency />
                        )}
                      </div>
                      <div className="text-2xl font-bold text-teal-700">
                        {derived.avgPerHour > 0 ? formatCurrency(derived.avgPerHour) : 'N/A'}
                      </div>
                      {comparison && comparison.avgPerHour.previous > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          vs {formatCurrency(comparison.avgPerHour.previous)} no mês anterior
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal de Edição */}
      {editingMetric && (
        <Dialog open={!!editingMetric} onOpenChange={() => setEditingMetric(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Registro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mês</Label>
                  <Select value={formData.month.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, month: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ano</Label>
                  <Select value={formData.year.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, year: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tatuagens Realizadas</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.tattoosCompleted}
                  onChange={(e) => setFormData(prev => ({ ...prev, tattoosCompleted: parseInt(e.target.value) || 0 }))}
                  className="rounded-lg"
                />
              </div>

              <div>
                <Label>Horas Trabalhadas</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.hoursWorked}
                  onChange={(e) => setFormData(prev => ({ ...prev, hoursWorked: parseInt(e.target.value) || 0 }))}
                  className="rounded-lg"
                />
              </div>

              <div>
                <Label>Faturamento Total (R$)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyRevenue}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthlyRevenue: parseFloat(e.target.value) || 0 }))}
                  className="rounded-lg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isShared}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isShared: checked }))}
                />
                <Label>Compartilhar na comunidade</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleUpdate} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    'Atualizar'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setEditingMetric(null)} className="border-blue-200">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MonthlyMetricsManager;
