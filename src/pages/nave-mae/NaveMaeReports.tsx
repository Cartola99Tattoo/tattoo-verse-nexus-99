
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockReports = [
  {
    id: 1,
    name: "Relatório Mensal de Vendas",
    description: "Análise completa das vendas por estúdio e produto",
    type: "sales",
    frequency: "monthly",
    lastGenerated: "2024-07-15",
    size: "2.3 MB",
    format: "PDF"
  },
  {
    id: 2,
    name: "Performance dos Tatuadores",
    description: "Métricas de desempenho e avaliação dos tatuadores",
    type: "performance",
    frequency: "weekly",
    lastGenerated: "2024-07-18",
    size: "1.8 MB",
    format: "Excel"
  },
  {
    id: 3,
    name: "Análise Financeira Consolidada",
    description: "Relatório financeiro completo da rede",
    type: "financial",
    frequency: "monthly",
    lastGenerated: "2024-07-10",
    size: "4.1 MB",
    format: "PDF"
  },
  {
    id: 4,
    name: "Satisfação do Cliente",
    description: "Pesquisa de satisfação e NPS da rede",
    type: "customer",
    frequency: "quarterly",
    lastGenerated: "2024-06-30",
    size: "3.2 MB",
    format: "PDF"
  }
];

const NaveMaeReports = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");

  const filteredReports = mockReports.filter(report => {
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesFrequency = frequencyFilter === 'all' || report.frequency === frequencyFilter;
    return matchesType && matchesFrequency;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'bg-green-100 text-green-800';
      case 'financial': return 'bg-blue-100 text-blue-800';
      case 'performance': return 'bg-purple-100 text-purple-800';
      case 'customer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'sales': return 'Vendas';
      case 'financial': return 'Financeiro';
      case 'performance': return 'Performance';
      case 'customer': return 'Cliente';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sales': return <TrendingUp className="h-4 w-4" />;
      case 'financial': return <BarChart3 className="h-4 w-4" />;
      case 'performance': return <PieChart className="h-4 w-4" />;
      case 'customer': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Diário';
      case 'weekly': return 'Semanal';
      case 'monthly': return 'Mensal';
      case 'quarterly': return 'Trimestral';
      case 'yearly': return 'Anual';
      default: return frequency;
    }
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Header com Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Relatórios Executivos</h2>
                <p className="text-gray-600">Relatórios consolidados de toda a rede 99Tattoo</p>
              </div>
              
              <div className="flex gap-4 items-center">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tipo de Relatório" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="sales">Vendas</SelectItem>
                    <SelectItem value="financial">Financeiro</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="customer">Cliente</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Frequência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Frequências</SelectItem>
                    <SelectItem value="daily">Diário</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  Gerar Relatório Personalizado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Relatórios Gerados</p>
                  <p className="text-3xl font-bold text-blue-800">47</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Este Mês</p>
                  <p className="text-3xl font-bold text-green-800">12</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Downloads</p>
                  <p className="text-3xl font-bold text-purple-800">284</p>
                </div>
                <Download className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Automáticos</p>
                  <p className="text-3xl font-bold text-yellow-800">15</p>
                </div>
                <BarChart3 className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Relatórios */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(report.type)}`}>
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">{report.name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tipo:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                      {getTypeText(report.type)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Frequência:</span>
                    <span className="font-medium">{getFrequencyText(report.frequency)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Última geração:</span>
                    <span className="font-medium">
                      {new Date(report.lastGenerated).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tamanho:</span>
                    <span className="font-medium">{report.size}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-4">
                    <span className="text-gray-600">Formato:</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                      {report.format}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Gerar Novo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Relatórios Agendados */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Relatório Semanal de Performance</p>
                    <p className="text-sm text-gray-500">Toda segunda-feira às 09:00</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Editar</Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    Desativar
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Relatório Mensal Financeiro</p>
                    <p className="text-sm text-gray-500">Todo dia 1º do mês às 08:00</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Editar</Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    Desativar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum relatório encontrado</h3>
            <p className="text-gray-500">
              {typeFilter !== 'all' || frequencyFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Configure relatórios automáticos para monitorar a performance'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeReports;
