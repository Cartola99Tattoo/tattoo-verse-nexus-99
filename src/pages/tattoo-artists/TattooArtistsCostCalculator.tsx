
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Target,
  Building2,
  Zap,
  Users,
  Megaphone,
  Laptop,
  FileText,
  Shield,
  MoreHorizontal,
  Palette,
  Handshake,
  Sparkles,
  MapPin,
  Plus
} from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const TattooArtistsCostCalculator = () => {
  // Estados para custos fixos
  const [fixedCosts, setFixedCosts] = useState({
    rent: 2500,
    utilities: 450,
    salaries: 3500,
    marketing: 800,
    software: 150,
    accounting: 300,
    insurance: 200,
    otherFixed: 400
  });

  // Estados para custos variáveis
  const [variableCosts, setVariableCosts] = useState({
    materials: 35,
    commission: 80,
    cleaning: 15,
    travel: 300,
    otherVariable: 50
  });

  // Estados para análise
  const [analysis, setAnalysis] = useState({
    avgTattooPrice: 450,
    profitGoal: 8000
  });

  // Cálculos automáticos
  const [results, setResults] = useState({
    totalFixedCosts: 0,
    totalVariableCosts: 0,
    totalMonthlyCosts: 0,
    breakEvenTattoos: 0,
    profitGoalTattoos: 0
  });

  // Função para calcular resultados
  useEffect(() => {
    const totalFixed = Object.values(fixedCosts).reduce((sum, cost) => sum + cost, 0);
    const totalVariable = Object.values(variableCosts).reduce((sum, cost) => sum + cost, 0);
    const totalMonthly = totalFixed + totalVariable;
    const breakEven = analysis.avgTattooPrice > 0 ? Math.ceil(totalMonthly / analysis.avgTattooPrice) : 0;
    const profitGoal = analysis.avgTattooPrice > 0 ? Math.ceil((totalMonthly + analysis.profitGoal) / analysis.avgTattooPrice) : 0;

    setResults({
      totalFixedCosts: totalFixed,
      totalVariableCosts: totalVariable,
      totalMonthlyCosts: totalMonthly,
      breakEvenTattoos: breakEven,
      profitGoalTattoos: profitGoal
    });
  }, [fixedCosts, variableCosts, analysis]);

  // Função para atualizar custos fixos
  const updateFixedCost = (key: string, value: number) => {
    setFixedCosts(prev => ({ ...prev, [key]: value || 0 }));
  };

  // Função para atualizar custos variáveis
  const updateVariableCost = (key: string, value: number) => {
    setVariableCosts(prev => ({ ...prev, [key]: value || 0 }));
  };

  // Função para atualizar análise
  const updateAnalysis = (key: string, value: number) => {
    setAnalysis(prev => ({ ...prev, [key]: value || 0 }));
  };

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const fixedCostFields = [
    { key: 'rent', label: 'Aluguel do Estúdio', icon: Building2 },
    { key: 'utilities', label: 'Contas (Água, Luz, Internet)', icon: Zap },
    { key: 'salaries', label: 'Salários/Pró-labore', icon: Users },
    { key: 'marketing', label: 'Marketing e Publicidade', icon: Megaphone },
    { key: 'software', label: 'Softwares/Assinaturas', icon: Laptop },
    { key: 'accounting', label: 'Contador/Serviços Jurídicos', icon: FileText },
    { key: 'insurance', label: 'Seguro do Estúdio', icon: Shield },
    { key: 'otherFixed', label: 'Outros Custos Fixos', icon: MoreHorizontal }
  ];

  const variableCostFields = [
    { key: 'materials', label: 'Materiais por Tatuagem', icon: Palette },
    { key: 'commission', label: 'Comissão de Tatuadores', icon: Handshake },
    { key: 'cleaning', label: 'Materiais de Limpeza', icon: Sparkles },
    { key: 'travel', label: 'Viagens/Eventos (mensal)', icon: MapPin },
    { key: 'otherVariable', label: 'Outros Custos Variáveis', icon: Plus }
  ];

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Calculator className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Calculadora de Custos do Estúdio
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Mantenha a saúde financeira do seu estúdio no positivo. Calcule seus custos fixos e variáveis, 
              descubra seu ponto de equilíbrio e defina metas de lucratividade realistas.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Custos Fixos */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-red-600" />
                    Custos Fixos Mensais
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {fixedCostFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <field.icon className="h-4 w-4 text-red-600" />
                        {field.label}
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <Input
                          type="number"
                          value={fixedCosts[field.key as keyof typeof fixedCosts]}
                          onChange={(e) => updateFixedCost(field.key, parseFloat(e.target.value))}
                          className="pl-12 border-red-200 focus:border-red-600 focus:ring-red-200"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Custos Variáveis */}
            <div className="lg:col-span-1">
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                    Custos Variáveis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {variableCostFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <field.icon className="h-4 w-4 text-red-600" />
                        {field.label}
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <Input
                          type="number"
                          value={variableCosts[field.key as keyof typeof variableCosts]}
                          onChange={(e) => updateVariableCost(field.key, parseFloat(e.target.value))}
                          className="pl-12 border-red-200 focus:border-red-600 focus:ring-red-200"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Configurações de Análise */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-red-600" />
                      Configurações de Análise
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Preço Médio por Tatuagem
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                          <Input
                            type="number"
                            value={analysis.avgTattooPrice}
                            onChange={(e) => updateAnalysis('avgTattooPrice', parseFloat(e.target.value))}
                            className="pl-12 border-red-200 focus:border-red-600 focus:ring-red-200"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Meta de Lucro Mensal
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                          <Input
                            type="number"
                            value={analysis.profitGoal}
                            onChange={(e) => updateAnalysis('profitGoal', parseFloat(e.target.value))}
                            className="pl-12 border-red-200 focus:border-red-600 focus:ring-red-200"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dashboard de Resultados */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Resumo de Custos */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-red-50 border-red-200">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Resumo Financeiro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-red-100">
                        <div className="text-sm text-gray-600 mb-1">Custos Fixos Mensais</div>
                        <div className="text-2xl font-bold text-red-600">
                          {formatCurrency(results.totalFixedCosts)}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-red-100">
                        <div className="text-sm text-gray-600 mb-1">Custos Variáveis Mensais</div>
                        <div className="text-2xl font-bold text-orange-600">
                          {formatCurrency(results.totalVariableCosts)}
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg p-4">
                        <div className="text-sm opacity-90 mb-1">Custo Total Mensal</div>
                        <div className="text-2xl font-bold">
                          {formatCurrency(results.totalMonthlyCosts)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Análise de Lucratividade */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50 border-green-200">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Análise de Lucratividade
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        <div className="text-sm text-gray-600 mb-2">Ponto de Equilíbrio</div>
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {results.breakEvenTattoos}
                        </div>
                        <div className="text-sm text-gray-500">tatuagens/mês</div>
                      </div>
                      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-4">
                        <div className="text-sm opacity-90 mb-2">Para Atingir Meta de Lucro</div>
                        <div className="text-3xl font-bold mb-1">
                          {results.profitGoalTattoos}
                        </div>
                        <div className="text-sm opacity-90">tatuagens/mês</div>
                      </div>
                      
                      {/* Indicadores Adicionais */}
                      <div className="space-y-2 pt-2 border-t border-green-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Lucro por Tatuagem:</span>
                          <Badge className="bg-green-100 text-green-800">
                            {formatCurrency(analysis.avgTattooPrice - (results.totalMonthlyCosts / (results.breakEvenTattoos || 1)))}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Margem de Lucro:</span>
                          <Badge className="bg-blue-100 text-blue-800">
                            {((analysis.avgTattooPrice - (results.totalMonthlyCosts / (results.breakEvenTattoos || 1))) / analysis.avgTattooPrice * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Botão de Ação */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-gray-900 to-black text-white">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-bold mb-2">Otimize seus Resultados</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      Ajuste seus custos e preços para maximizar a lucratividade
                    </p>
                    <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900">
                      Salvar Configurações
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsCostCalculator;
