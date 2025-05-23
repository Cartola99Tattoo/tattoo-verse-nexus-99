import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker";
import { getFinancialService } from "@/services/serviceFactory";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp, DollarSign, Users, PieChart, Search, Filter, Receipt, FileBarChart, Settings } from "lucide-react";
import ExpenseManagement from "@/components/admin/ExpenseManagement";
import DREReport from "@/components/admin/DREReport";
import CashFlowReport from "@/components/admin/CashFlowReport";
import CategoryManagement from "@/components/admin/CategoryManagement";
import FinancialTransactionManagement from "@/components/admin/FinancialTransactionManagement";
import FinancialSettings from "@/components/admin/FinancialSettings";

const Financial = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    to: new Date(),
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const financialService = getFinancialService();

  // Buscar transações
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['tattoo-transactions', statusFilter, searchTerm],
    queryFn: () => financialService.fetchTattooTransactions({
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: 50
    }),
  });

  // Buscar comissões
  const { data: commissions = [], isLoading: commissionsLoading } = useQuery({
    queryKey: ['artist-commissions'],
    queryFn: () => financialService.fetchArtistCommissions(),
  });

  // Gerar relatório financeiro
  const { data: report, isLoading: reportLoading } = useQuery({
    queryKey: ['financial-report', dateRange],
    queryFn: () => {
      if (!dateRange?.from || !dateRange?.to) return null;
      return financialService.generateFinancialReport(
        dateRange.from.toISOString(),
        dateRange.to.toISOString()
      );
    },
    enabled: !!(dateRange?.from && dateRange?.to),
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    
    const labels = {
      pending: "Pendente",
      confirmed: "Confirmado",
      completed: "Concluído",
      cancelled: "Cancelado",
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout 
      title="Módulo Financeiro" 
      description="Gestão financeira completa de tatuagens, despesas e análise de resultados"
    >
      <div className="space-y-6">
        {/* Filtros e Controles */}
        <div className="flex flex-col sm:flex-row gap-4">
          <CalendarDateRangePicker
            date={dateRange}
            onDateChange={setDateRange}
            className="w-full sm:w-auto"
          />
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards de Resumo */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(report.total_revenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {report.transaction_count} transações
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comissões Totais</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(report.total_commissions)}</div>
                <p className="text-xs text-muted-foreground">
                  Para artistas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(report.net_profit)}</div>
                <p className="text-xs text-muted-foreground">
                  Após comissões e custos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custos de Material</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(report.total_material_costs)}</div>
                <p className="text-xs text-muted-foreground">
                  Materiais utilizados
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs para diferentes visualizações */}
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="commissions">Comissões</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="dre">DRE</TabsTrigger>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transações de Tatuagens</CardTitle>
                <CardDescription>
                  Histórico de todas as transações de tatuagens realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Comissão</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            Carregando transações...
                          </TableCell>
                        </TableRow>
                      ) : filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            Nenhuma transação encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {transaction.customer_name}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {formatCurrency(transaction.final_amount || transaction.amount)}
                                </div>
                                {transaction.final_amount && transaction.final_amount !== transaction.amount && (
                                  <div className="text-sm text-gray-500 line-through">
                                    {formatCurrency(transaction.amount)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(transaction.payment_status)}
                            </TableCell>
                            <TableCell>
                              {formatDate(transaction.transaction_date)}
                            </TableCell>
                            <TableCell>
                              {transaction.artist_commission ? 
                                formatCurrency(transaction.artist_commission) : 
                                <span className="text-gray-400">Não calculada</span>
                              }
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Ver Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nova aba de Transações Financeiras */}
          <TabsContent value="financial" className="space-y-4">
            <FinancialTransactionManagement />
          </TabsContent>

          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comissões de Artistas</CardTitle>
                <CardDescription>
                  Gestão de comissões pagas aos artistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Artista</TableHead>
                        <TableHead>Valor Base</TableHead>
                        <TableHead>Taxa</TableHead>
                        <TableHead>Comissão</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commissionsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            Carregando comissões...
                          </TableCell>
                        </TableRow>
                      ) : commissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            Nenhuma comissão encontrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        commissions.map((commission) => (
                          <TableRow key={commission.id}>
                            <TableCell className="font-medium">
                              {commission.artist_name}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(commission.base_amount)}
                            </TableCell>
                            <TableCell>
                              {(commission.commission_rate * 100).toFixed(1)}%
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(commission.commission_amount)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(commission.status)}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Marcar como Pago
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba de Despesas */}
          <TabsContent value="expenses" className="space-y-4">
            <ExpenseManagement />
          </TabsContent>

          {/* Nova aba de Categorias */}
          <TabsContent value="categories" className="space-y-4">
            <CategoryManagement />
          </TabsContent>

          {/* Aba de DRE */}
          <TabsContent value="dre" className="space-y-4">
            <DREReport />
          </TabsContent>

          {/* Nova aba de Fluxo de Caixa */}
          <TabsContent value="cashflow" className="space-y-4">
            <CashFlowReport />
          </TabsContent>

          {/* Nova aba de Configurações */}
          <TabsContent value="settings" className="space-y-4">
            <FinancialSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Financial;
