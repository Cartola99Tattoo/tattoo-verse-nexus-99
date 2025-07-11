
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { TrendingUp, DollarSign, Users, PieChart, Search, Filter, Receipt, FileBarChart, Settings, Plus, Download, Upload, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import TransactionManagement from "@/components/admin/TransactionManagement";
import ExpenseManagement from "@/components/admin/ExpenseManagement";
import CommissionManagement from "@/components/admin/CommissionManagement";
import DREFlowReport from "@/components/admin/DREFlowReport";
import ImportExportModal from "@/components/admin/ImportExportModal";

const Financial = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    to: new Date(),
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      <div className="space-y-6 p-6">
        {/* Header Principal com Gradiente 99Tattoo */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-black rounded-xl shadow-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-wider">FINANCEIRO 99TATTOO</h1>
              <p className="text-red-100 mt-2">Gestão completa das finanças do estúdio</p>
            </div>
            
            {/* Botões de Importar/Exportar */}
            <div className="flex gap-3">
              <Button
                onClick={() => setIsImportExportOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                variant="outline"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Dados
              </Button>
              <Button
                onClick={() => setIsImportExportOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros e Controles */}
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <CardContent className="p-6">
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
                    className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] border-red-200 focus:border-red-500">
                    <Filter className="h-4 w-4 mr-2 text-red-600" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-red-200">
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Resumo */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">{formatCurrency(report.total_revenue)}</div>
                <p className="text-xs text-green-600">
                  {report.transaction_count} transações
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Comissões Totais</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800">{formatCurrency(report.total_commissions)}</div>
                <p className="text-xs text-blue-600">
                  Para artistas
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">Lucro Líquido</CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-800">{formatCurrency(report.net_profit)}</div>
                <p className="text-xs text-red-600">
                  Após comissões e custos
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Custos de Material</CardTitle>
                <PieChart className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-800">{formatCurrency(report.total_material_costs)}</div>
                <p className="text-xs text-purple-600">
                  Materiais utilizados
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs para navegação aprimorada */}
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-red-100 to-red-200 p-1 rounded-lg shadow-lg">
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Receipt className="h-4 w-4 mr-2" />
              Transações
            </TabsTrigger>
            <TabsTrigger 
              value="expenses" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              Despesas
            </TabsTrigger>
            <TabsTrigger 
              value="commissions" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <Users className="h-4 w-4 mr-2" />
              Comissões
            </TabsTrigger>
            <TabsTrigger 
              value="dre-flow" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
            >
              <FileBarChart className="h-4 w-4 mr-2" />
              DRE & Fluxo de Caixa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <TransactionManagement />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <ExpenseManagement />
          </TabsContent>

          <TabsContent value="commissions" className="space-y-4">
            <CommissionManagement />
          </TabsContent>

          <TabsContent value="dre-flow" className="space-y-4">
            <DREFlowReport />
          </TabsContent>
        </Tabs>

        {/* Modal de Importar/Exportar */}
        <ImportExportModal 
          isOpen={isImportExportOpen} 
          onClose={() => setIsImportExportOpen(false)} 
        />
      </div>
    </div>
  );
};

export default Financial;
