
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, Calculator, CreditCard, PieChart } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockFinancialData = {
  revenue: {
    current: 2850000,
    previous: 2420000,
    growth: 17.8
  },
  expenses: {
    current: 1890000,
    previous: 1650000,
    growth: 14.5
  },
  profit: {
    current: 960000,
    previous: 770000,
    growth: 24.7
  },
  transactions: [
    {
      id: 1,
      type: "revenue",
      description: "Vendas Loja Online",
      amount: 45000,
      date: "2024-07-19",
      status: "completed"
    },
    {
      id: 2,
      type: "expense",
      description: "Compra de Estoque",
      amount: -12500,
      date: "2024-07-18",
      status: "completed"
    },
    {
      id: 3,
      type: "revenue",
      description: "Comissões de Estúdios",
      amount: 28500,
      date: "2024-07-17",
      status: "pending"
    }
  ],
  breakdown: {
    revenue: [
      { category: "Vendas Produtos", amount: 1250000, percentage: 43.9 },
      { category: "Comissões Estúdios", amount: 980000, percentage: 34.4 },
      { category: "Taxas de Transação", amount: 420000, percentage: 14.7 },
      { category: "Programa Fidelidade", amount: 200000, percentage: 7.0 }
    ],
    expenses: [
      { category: "Estoque", amount: 650000, percentage: 34.4 },
      { category: "Folha de Pagamento", amount: 520000, percentage: 27.5 },
      { category: "Marketing", amount: 350000, percentage: 18.5 },
      { category: "Operacional", amount: 370000, percentage: 19.6 }
    ]
  }
};

const NaveMaeFinancial = () => {
  const [periodFilter, setPeriodFilter] = useState("current_month");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Filtro de Período */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Relatório Financeiro</h2>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_month">Mês Atual</SelectItem>
                  <SelectItem value="last_month">Mês Anterior</SelectItem>
                  <SelectItem value="quarter">Trimestre</SelectItem>
                  <SelectItem value="year">Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-green-600 text-sm font-medium">Receita Total</p>
                  <p className="text-3xl font-bold text-green-800">
                    {formatCurrency(mockFinancialData.revenue.current)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className={`flex items-center gap-2 ${getGrowthColor(mockFinancialData.revenue.growth)}`}>
                {getGrowthIcon(mockFinancialData.revenue.growth)}
                <span className="text-sm font-medium">
                  +{mockFinancialData.revenue.growth}% vs período anterior
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-red-600 text-sm font-medium">Despesas</p>
                  <p className="text-3xl font-bold text-red-800">
                    {formatCurrency(mockFinancialData.expenses.current)}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-red-600" />
              </div>
              <div className={`flex items-center gap-2 ${getGrowthColor(mockFinancialData.expenses.growth)}`}>
                {getGrowthIcon(mockFinancialData.expenses.growth)}
                <span className="text-sm font-medium">
                  +{mockFinancialData.expenses.growth}% vs período anterior
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Lucro Líquido</p>
                  <p className="text-3xl font-bold text-blue-800">
                    {formatCurrency(mockFinancialData.profit.current)}
                  </p>
                </div>
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
              <div className={`flex items-center gap-2 ${getGrowthColor(mockFinancialData.profit.growth)}`}>
                {getGrowthIcon(mockFinancialData.profit.growth)}
                <span className="text-sm font-medium">
                  +{mockFinancialData.profit.growth}% vs período anterior
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown de Receitas e Despesas */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Breakdown de Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFinancialData.breakdown.revenue.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-red-600" />
                Breakdown de Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFinancialData.breakdown.expenses.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm text-gray-500">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <span className="text-sm font-bold text-red-600">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transações Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transações Recentes</CardTitle>
            <Button variant="outline">Ver Todas</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockFinancialData.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'revenue' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'revenue' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <Badge className={
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }>
                      {transaction.status === 'completed' ? 'Concluído' : 'Pendente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeFinancial;
