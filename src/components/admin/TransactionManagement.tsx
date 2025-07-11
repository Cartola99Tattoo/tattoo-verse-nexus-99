
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabaseFinancialService } from "@/services/supabase/SupabaseFinancialService";
import { TattooTransaction } from "@/services/interfaces/IFinancialService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Edit, Trash2, Calendar, User, Palette, ArrowUp, ArrowDown, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TransactionFormData {
  customer_name: string;
  amount: number;
  artist_id: string;
  payment_status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  transaction_date: string;
  product_id: string;
  order_id: string;
  final_amount?: number;
  material_cost?: number;
  notes?: string;
}

const TransactionManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TattooTransaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<TransactionFormData>({
    customer_name: '',
    amount: 0,
    artist_id: '',
    payment_status: 'pending',
    transaction_date: new Date().toISOString().split('T')[0],
    product_id: '',
    order_id: '',
    final_amount: 0,
    material_cost: 0,
    notes: ''
  });

  const queryClient = useQueryClient();

  // Mock data para simulação de integração
  const mockArtists = [
    { id: "1", name: "Ana Silva" },
    { id: "2", name: "Carlos Santos" },
    { id: "3", name: "Pedro Costa" },
    { id: "4", name: "Maria Oliveira" }
  ];

  const mockProducts = [
    { id: "1", name: "Tatuagem Fineline - Flor" },
    { id: "2", name: "Tatuagem Realismo - Retrato" },
    { id: "3", name: "Tatuagem Old School - Âncora" },
    { id: "4", name: "Produto Físico - Pomada" }
  ];

  // Buscar transações
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['tattoo-transactions-management'],
    queryFn: () => supabaseFinancialService.fetchTattooTransactions({ limit: 100 }),
  });

  // Criar/atualizar transação
  const createUpdateMutation = useMutation({
    mutationFn: (transactionData: any) => {
      if (editingTransaction) {
        return supabaseFinancialService.updateTattooTransaction(editingTransaction.id, transactionData);
      } else {
        return supabaseFinancialService.createTattooTransaction({
          ...transactionData,
          order_id: `ORD-${Date.now()}`,
          product_id: formData.product_id || `PROD-${Date.now()}`,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tattoo-transactions-management'] });
      setIsDialogOpen(false);
      setEditingTransaction(null);
      resetForm();
      toast({
        title: editingTransaction ? "Transação atualizada" : "Transação criada",
        description: "A transação foi salva com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      customer_name: '',
      amount: 0,
      artist_id: '',
      payment_status: 'pending',
      transaction_date: new Date().toISOString().split('T')[0],
      product_id: '',
      order_id: '',
      final_amount: 0,
      material_cost: 0,
      notes: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.artist_id || formData.amount <= 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    createUpdateMutation.mutate(formData);
  };

  const handleEdit = (transaction: TattooTransaction) => {
    setEditingTransaction(transaction);
    setFormData({
      customer_name: transaction.customer_name,
      amount: transaction.amount,
      artist_id: transaction.artist_id,
      payment_status: transaction.payment_status,
      transaction_date: transaction.transaction_date.split('T')[0],
      product_id: transaction.product_id,
      order_id: transaction.order_id,
      final_amount: transaction.final_amount || transaction.amount,
      material_cost: transaction.material_cost || 0,
      notes: ''
    });
    setIsDialogOpen(true);
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Gestão de Transações
          </h2>
          <p className="text-gray-600">Controle completo de todas as transações financeiras</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingTransaction(null);
                resetForm();
              }}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-gradient-to-br from-white to-red-50 border-red-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction ? 'Atualize os dados da transação' : 'Registre uma nova transação financeira'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name" className="text-red-700 font-bold">Cliente *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="Nome do cliente"
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="artist_id" className="text-red-700 font-bold">Tatuador *</Label>
                  <Select
                    value={formData.artist_id}
                    onValueChange={(value) => setFormData({ ...formData, artist_id: value })}
                  >
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue placeholder="Selecione o tatuador" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200">
                      {mockArtists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-red-600" />
                            {artist.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product_id" className="text-red-700 font-bold">Produto/Serviço</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                  >
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue placeholder="Selecione o produto/serviço" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200">
                      {mockProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4 text-red-600" />
                            {product.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payment_status" className="text-red-700 font-bold">Status *</Label>
                  <Select
                    value={formData.payment_status}
                    onValueChange={(value) => setFormData({ ...formData, payment_status: value as any })}
                  >
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue placeholder="Status do pagamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200">
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="confirmed">Confirmado</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="amount" className="text-red-700 font-bold">Valor Original *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="final_amount" className="text-red-700 font-bold">Valor Final</Label>
                  <Input
                    id="final_amount"
                    type="number"
                    step="0.01"
                    value={formData.final_amount}
                    onChange={(e) => setFormData({ ...formData, final_amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                </div>

                <div>
                  <Label htmlFor="material_cost" className="text-red-700 font-bold">Custo Material</Label>
                  <Input
                    id="material_cost"
                    type="number"
                    step="0.01"
                    value={formData.material_cost}
                    onChange={(e) => setFormData({ ...formData, material_cost: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="transaction_date" className="text-red-700 font-bold">Data da Transação *</Label>
                <Input
                  id="transaction_date"
                  type="date"
                  value={formData.transaction_date}
                  onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-red-700 font-bold">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações adicionais sobre a transação..."
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={createUpdateMutation.isPending}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white flex-1"
                >
                  {createUpdateMutation.isPending ? 
                    (editingTransaction ? "Atualizando..." : "Salvando...") : 
                    (editingTransaction ? "Atualizar Transação" : "Salvar Transação")
                  }
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de busca */}
      <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar transações por cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-red-200 focus:border-red-500 focus:ring-red-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resumo das transações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total de Receitas</p>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => ['completed', 'confirmed'].includes(t.payment_status))
                      .reduce((sum, t) => sum + (t.final_amount || t.amount), 0)
                  )}
                </p>
              </div>
              <ArrowUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Transações Pendentes</p>
                <p className="text-2xl font-bold text-blue-800">
                  {filteredTransactions.filter(t => t.payment_status === 'pending').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Transações Hoje</p>
                <p className="text-2xl font-bold text-red-800">
                  {filteredTransactions.filter(t => 
                    new Date(t.transaction_date).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Transações */}
      <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="text-gray-800">Todas as Transações</CardTitle>
          <CardDescription>
            Histórico completo de transações com controle total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tatuador</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
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
                    <TableRow key={transaction.id} className="hover:bg-red-50/50 transition-colors">
                      <TableCell className="font-medium">
                        {transaction.customer_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-red-600" />
                          {mockArtists.find(a => a.id === transaction.artist_id)?.name || 'Artista'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-green-700">
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
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionManagement;
