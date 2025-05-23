
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { supabaseFinancialService, DREData } from "@/services/supabase/SupabaseFinancialService";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, FileText, Download } from "lucide-react";

const DREReport = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Primeiro dia do mês atual
    to: new Date(),
  });

  // Buscar dados do DRE
  const { data: dreData, isLoading } = useQuery({
    queryKey: ['dre-report', dateRange],
    queryFn: () => {
      if (!dateRange?.from || !dateRange?.to) return null;
      return supabaseFinancialService.generateDRE(
        dateRange.from.toISOString(),
        dateRange.to.toISOString()
      );
    },
    enabled: !!(dateRange?.from && dateRange?.to),
  });

  const DRELine = ({ 
    label, 
    value, 
    isSubtotal = false, 
    isTotal = false, 
    isNegative = false 
  }: { 
    label: string; 
    value: number; 
    isSubtotal?: boolean; 
    isTotal?: boolean; 
    isNegative?: boolean; 
  }) => (
    <div className={`flex justify-between items-center py-2 px-4 ${
      isTotal ? 'bg-gray-50 border-t-2 border-gray-300 font-bold text-lg' : 
      isSubtotal ? 'bg-gray-25 border-t border-gray-200 font-semibold' : ''
    }`}>
      <span className={isNegative ? 'text-red-600' : ''}>{label}</span>
      <span className={`${isNegative ? 'text-red-600' : ''} ${
        value > 0 && !isNegative ? 'text-green-600' : value < 0 ? 'text-red-600' : ''
      }`}>
        {isNegative && value > 0 ? '(-)' : ''} {formatCurrency(Math.abs(value))}
      </span>
    </div>
  );

  const exportDRE = () => {
    if (!dreData) return;
    
    // Preparar dados para exportação
    const dreText = `
DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO
Período: ${dreData.period}

RECEITA BRUTA: ${formatCurrency(dreData.gross_revenue)}
(-) DEDUÇÕES DE VENDAS: ${formatCurrency(dreData.sales_deductions)}
= RECEITA LÍQUIDA: ${formatCurrency(dreData.net_revenue)}

(-) CUSTOS DA TATUAGEM (CPV): ${formatCurrency(dreData.material_costs)}
= LUCRO BRUTO: ${formatCurrency(dreData.gross_profit)}

(-) DESPESAS OPERACIONAIS: ${formatCurrency(dreData.operational_expenses)}
(-) COMISSÕES DE ARTISTAS: ${formatCurrency(dreData.artist_commissions)}
= RESULTADO OPERACIONAL: ${formatCurrency(dreData.operational_result)}

(-) DESPESAS NÃO OPERACIONAIS: ${formatCurrency(dreData.non_operational_expenses)}
= RESULTADO ANTES DO IR/CSLL: ${formatCurrency(dreData.result_before_taxes)}

(-) IMPOSTOS: ${formatCurrency(dreData.taxes)}
= RESULTADO LÍQUIDO DO EXERCÍCIO: ${formatCurrency(dreData.net_result)}
    `;

    // Criar e baixar arquivo
    const blob = new Blob([dreText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DRE_${dreData.period.replace(/\s/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Demonstração do Resultado do Exercício (DRE)
          </h2>
          <p className="text-gray-600">Análise detalhada da performance financeira</p>
        </div>
        {dreData && (
          <Button onClick={exportDRE} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar DRE
          </Button>
        )}
      </div>

      {/* Filtro de Período */}
      <Card>
        <CardHeader>
          <CardTitle>Período de Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarDateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full sm:w-auto"
          />
        </CardContent>
      </Card>

      {/* DRE */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p>Carregando DRE...</p>
          </CardContent>
        </Card>
      ) : dreData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DRE Detalhado */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>DRE - {dreData.period}</CardTitle>
                <CardDescription>
                  Demonstração completa do resultado do exercício
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  <DRELine label="RECEITA BRUTA" value={dreData.gross_revenue} />
                  <DRELine label="(-) Deduções de Vendas" value={dreData.sales_deductions} isNegative />
                  <DRELine label="= RECEITA LÍQUIDA DE VENDAS" value={dreData.net_revenue} isSubtotal />
                  
                  <div className="h-4"></div>
                  
                  <DRELine label="(-) Custos da Tatuagem (CPV)" value={dreData.material_costs} isNegative />
                  <DRELine label="= LUCRO BRUTO" value={dreData.gross_profit} isSubtotal />
                  
                  <div className="h-4"></div>
                  
                  <DRELine label="(-) Despesas Operacionais" value={dreData.operational_expenses} isNegative />
                  <DRELine label="(-) Comissões de Artistas" value={dreData.artist_commissions} isNegative />
                  <DRELine label="= RESULTADO OPERACIONAL" value={dreData.operational_result} isSubtotal />
                  
                  <div className="h-4"></div>
                  
                  <DRELine label="(-) Despesas Não Operacionais" value={dreData.non_operational_expenses} isNegative />
                  <DRELine label="= RESULTADO ANTES DO IR/CSLL" value={dreData.result_before_taxes} isSubtotal />
                  
                  <div className="h-4"></div>
                  
                  <DRELine label="(-) Impostos" value={dreData.taxes} isNegative />
                  <DRELine label="= RESULTADO LÍQUIDO DO EXERCÍCIO" value={dreData.net_result} isTotal />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Indicadores */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resultado Líquido</CardTitle>
                {dreData.net_result >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${dreData.net_result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(dreData.net_result)}
                </div>
                <Badge variant={dreData.net_result >= 0 ? "default" : "destructive"} className="mt-2">
                  {dreData.net_result >= 0 ? "Lucro" : "Prejuízo"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Margem Bruta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dreData.net_revenue > 0 ? ((dreData.gross_profit / dreData.net_revenue) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Lucro Bruto / Receita Líquida
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Margem Líquida</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dreData.net_revenue > 0 ? ((dreData.net_result / dreData.net_revenue) * 100).toFixed(1) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Resultado Líquido / Receita Líquida
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Participação dos Custos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Materiais:</span>
                    <span>{dreData.net_revenue > 0 ? ((dreData.material_costs / dreData.net_revenue) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Comissões:</span>
                    <span>{dreData.net_revenue > 0 ? ((dreData.artist_commissions / dreData.net_revenue) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Operacionais:</span>
                    <span>{dreData.net_revenue > 0 ? ((dreData.operational_expenses / dreData.net_revenue) * 100).toFixed(1) : 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Selecione um período para gerar o DRE</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DREReport;
