
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { DateRange } from "react-day-picker";
import { supabaseFinancialService } from "@/services/supabase/SupabaseFinancialService";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const CashFlowReport = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  // Buscar receitas
  const { data: transactions = [] } = useQuery({
    queryKey: ['cash-flow-transactions', dateRange],
    queryFn: () => {
      if (!dateRange?.from || !dateRange?.to) return [];
      return supabaseFinancialService.fetchTattooTransactions({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        status: 'completed'
      });
    },
    enabled: !!(dateRange?.from && dateRange?.to),
  });

  // Buscar despesas
  const { data: expenses = [] } = useQuery({
    queryKey: ['cash-flow-expenses', dateRange],
    queryFn: () => {
      if (!dateRange?.from || !dateRange?.to) return [];
      return supabaseFinancialService.fetchExpenses({
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString()
      });
    },
    enabled: !!(dateRange?.from && dateRange?.to),
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.final_amount || t.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const cashFlow = totalRevenue - totalExpenses;

  // Calculate expenses by category with proper typing
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const amount = Number(expense.amount || 0);
    if (!acc[category]) acc[category] = 0;
    acc[category] += amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          Fluxo de Caixa
        </h2>
        <p className="text-gray-600">Acompanhe entradas e saídas de caixa</p>
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

      {/* Cards de Resumo do Fluxo de Caixa */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {transactions.length} transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.length} despesas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            {cashFlow >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(cashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">
              {cashFlow >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue > 0 ? ((cashFlow / totalRevenue) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo / Receitas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalhamento por Categoria */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>
              Distribuição das despesas por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <div className="space-y-4">
                {Object.entries(expensesByCategory).map(([category, amount]) => {
                  const numericAmount = Number(amount);
                  return (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{category}</p>
                        <p className="text-sm text-gray-500">
                          {totalExpenses > 0 ? ((numericAmount / totalExpenses) * 100).toFixed(1) : 0}% do total
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">{formatCurrency(numericAmount)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">Nenhuma despesa no período</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Período</CardTitle>
            <CardDescription>
              Análise consolidada do fluxo de caixa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-800 font-medium">Total de Receitas</span>
                <span className="text-green-800 font-bold">{formatCurrency(totalRevenue)}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-red-800 font-medium">Total de Despesas</span>
                <span className="text-red-800 font-bold">{formatCurrency(totalExpenses)}</span>
              </div>
              
              <div className={`flex justify-between items-center p-3 rounded-lg ${
                cashFlow >= 0 ? 'bg-blue-50' : 'bg-yellow-50'
              }`}>
                <span className={`font-medium ${cashFlow >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>
                  Fluxo de Caixa Líquido
                </span>
                <span className={`font-bold ${cashFlow >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>
                  {formatCurrency(cashFlow)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashFlowReport;
