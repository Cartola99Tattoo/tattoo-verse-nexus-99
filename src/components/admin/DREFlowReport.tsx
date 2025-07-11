
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { supabaseFinancialService } from "@/services/supabase/SupabaseFinancialService";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, PieChart, ArrowUp, ArrowDown, BarChart3 } from "lucide-react";

const DREFlowReport = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  // Dados simulados para DRE
  const mockDREData = {
    period: "Últimos 30 dias",
    gross_revenue: 45000,
    sales_deductions: 1500,
    net_revenue: 43500,
    material_costs: 8500,
    gross_profit: 35000,
    operational_expenses: 15000,
    artist_commissions: 12000,
    operational_result: 8000,
    non_operational_expenses: 500,
    result_before_taxes: 7500,
    taxes: 600,
    net_result: 6900
  };

  // Dados simulados para Fluxo de Caixa
  const mockCashFlowData = [
    { date: "2024-01-01", entradas: 5500, saidas: 2300, saldo: 3200 },
    { date: "2024-01-02", entradas: 4200, saidas: 1800, saldo: 2400 },
    { date: "2024-01-03", entradas: 6800, saidas: 3100, saldo: 3700 },
    { date: "2024-01-04", entradas: 3900, saidas: 1600, saldo: 2300 },
    { date: "2024-01-05", entradas: 7200, saidas: 2900, saldo: 4300 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            DRE & Fluxo de Caixa
          </h2>
          <p className="text-gray-600">Demonstrativo de resultados e controle de fluxo de caixa</p>
        </div>
        <CalendarDateRangePicker
          date={dateRange}
          onDateChange={setDateRange}
          className="w-auto"
        />
      </div>

      {/* Cards de Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Receita Bruta</p>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(mockDREData.gross_revenue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Lucro Bruto</p>
                <p className="text-2xl font-bold text-blue-800">
                  {formatCurrency(mockDREData.gross_profit)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Resultado Operacional</p>
                <p className="text-2xl font-bold text-purple-800">
                  {formatCurrency(mockDREData.operational_result)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Lucro Líquido</p>
                <p className="text-2xl font-bold text-red-800">
                  {formatCurrency(mockDREData.net_result)}
                </p>
              </div>
              <PieChart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DRE - Demonstrativo de Resultados */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Demonstrativo de Resultados (DRE)
            </CardTitle>
            <CardDescription>
              Análise detalhada da performance financeira
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Receita Bruta</span>
                <span className="font-bold text-green-700">{formatCurrency(mockDREData.gross_revenue)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 ml-4">(-) Deduções de Vendas</span>
                <span className="text-red-600">({formatCurrency(mockDREData.sales_deductions)})</span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium text-gray-700">Receita Líquida</span>
                <span className="font-bold text-blue-700">{formatCurrency(mockDREData.net_revenue)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 ml-4">(-) Custos de Material</span>
                <span className="text-red-600">({formatCurrency(mockDREData.material_costs)})</span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium text-gray-700">Lucro Bruto</span>
                <span className="font-bold text-green-700">{formatCurrency(mockDREData.gross_profit)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 ml-4">(-) Despesas Operacionais</span>
                <span className="text-red-600">({formatCurrency(mockDREData.operational_expenses)})</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 ml-4">(-) Comissões de Artistas</span>
                <span className="text-red-600">({formatCurrency(mockDREData.artist_commissions)})</span>
              </div>
              
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium text-gray-700">Resultado Operacional</span>
                <span className="font-bold text-blue-700">{formatCurrency(mockDREData.operational_result)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 ml-4">(-) Despesas Não Operacionais</span>
                <span className="text-red-600">({formatCurrency(mockDREData.non_operational_expenses)})</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 ml-4">(-) Impostos</span>
                <span className="text-red-600">({formatCurrency(mockDREData.taxes)})</span>
              </div>
              
              <div className="flex justify-between items-center border-t-2 border-red-200 pt-3">
                <span className="font-bold text-gray-800">LUCRO LÍQUIDO</span>
                <span className="font-black text-2xl text-red-700">{formatCurrency(mockDREData.net_result)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fluxo de Caixa */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Fluxo de Caixa
            </CardTitle>
            <CardDescription>
              Controle diário de entradas e saídas
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockCashFlowData.map((day, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">
                      {new Date(day.date).toLocaleDateString('pt-BR')}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={day.saldo >= 0 ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}
                    >
                      Saldo: {formatCurrency(day.saldo)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-green-600" />
                      <span className="text-gray-600">Entradas:</span>
                      <span className="font-medium text-green-700">{formatCurrency(day.entradas)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 text-red-600" />
                      <span className="text-gray-600">Saídas:</span>
                      <span className="font-medium text-red-700">{formatCurrency(day.saidas)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Resumo do Período */}
            <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-800 mb-3">Resumo do Período</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-600">Total Entradas</p>
                  <p className="font-bold text-green-700">
                    {formatCurrency(mockCashFlowData.reduce((sum, day) => sum + day.entradas, 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Total Saídas</p>
                  <p className="font-bold text-red-700">
                    {formatCurrency(mockCashFlowData.reduce((sum, day) => sum + day.saidas, 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Saldo Final</p>
                  <p className="font-bold text-blue-700">
                    {formatCurrency(
                      mockCashFlowData.reduce((sum, day) => sum + day.entradas, 0) - 
                      mockCashFlowData.reduce((sum, day) => sum + day.saidas, 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DREFlowReport;
