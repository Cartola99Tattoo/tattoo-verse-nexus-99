
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Search, Filter, Plus, CreditCard, Banknote } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockTransactions = [
  {
    id: 1,
    description: "Pagamento - Tatuagem Realista",
    amount: 800.00,
    type: "income",
    category: "Serviços",
    date: "2024-07-19",
    client: "Maria Silva",
    artist: "Carlos Mendes",
    studio: "Estúdio Principal",
    paymentMethod: "PIX"
  },
  {
    id: 2,
    description: "Compra de Tintas",
    amount: -320.00,
    type: "expense",
    category: "Material",
    date: "2024-07-18",
    supplier: "Color Ink Pro",
    studio: "Estúdio Principal",
    paymentMethod: "Cartão"
  },
  {
    id: 3,
    description: "Pagamento - Workshop Sombreamento",
    amount: 180.00,
    type: "income",
    category: "Cursos",
    date: "2024-07-17",
    client: "João Santos",
    studio: "Estúdio Filial",
    paymentMethod: "Transferência"
  }
];

const NaveMaeFinancial = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("month");

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.artist?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalRevenue = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = Math.abs(mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0));

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'bg-green-100 text-green-800';
      case 'expense': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'PIX': return <Banknote className="h-4 w-4" />;
      case 'Cartão': return <CreditCard className="h-4 w-4" />;
      case 'Transferência': return <TrendingUp className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas Financeiras */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Receita Total</p>
                  <p className="text-3xl font-bold text-green-800">R$ {totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Despesas Total</p>
                  <p className="text-3xl font-bold text-red-800">R$ {totalExpenses.toLocaleString()}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Lucro Líquido</p>
                  <p className="text-3xl font-bold text-purple-800">R$ {netProfit.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Margem de Lucro</p>
                  <p className="text-3xl font-bold text-blue-800">{profitMargin.toFixed(1)}%</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Categorias</SelectItem>
                    <SelectItem value="Serviços">Serviços</SelectItem>
                    <SelectItem value="Material">Material</SelectItem>
                    <SelectItem value="Cursos">Cursos</SelectItem>
                    <SelectItem value="Aluguel">Aluguel</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="year">Este Ano</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Transações */}
        <div className="grid gap-6">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {transaction.type === 'income' ? 
                        <TrendingUp className="h-5 w-5 text-green-600" /> : 
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      }
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{transaction.description}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div className={`text-2xl font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString()}
                      </div>
                      <Badge className={`${getTypeColor(transaction.type)} text-xs`}>
                        {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {transaction.client && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Cliente</p>
                      <p className="text-sm text-gray-600">{transaction.client}</p>
                    </div>
                  )}
                  {transaction.artist && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Artista</p>
                      <p className="text-sm text-gray-600">{transaction.artist}</p>
                    </div>
                  )}
                  {transaction.supplier && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Fornecedor</p>
                      <p className="text-sm text-gray-600">{transaction.supplier}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Estúdio</p>
                    <p className="text-sm text-gray-600">{transaction.studio}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</p>
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                      <span className="text-sm text-gray-600">{transaction.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button size="sm" variant="outline">
                    Imprimir Recibo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma transação encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' || categoryFilter !== 'all'
                ? 'Tente ajustar os filtros de busca' 
                : 'Adicione a primeira transação financeira'
              }
            </p>
          </div>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeFinancial;
