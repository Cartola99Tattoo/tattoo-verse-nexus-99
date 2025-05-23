
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
import { FinancialTransaction } from "@/services/interfaces/IFinancialService";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TransactionFormData {
  type: 'entrada' | 'saida' | '';
  amount: number;
  date: string;
  description: string;
  category_id: string;
  payment_method: string;
  observations: string;
}

const FinancialTransactionManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    type: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    category_id: '',
    payment_method: '',
    observations: ''
  });

  const queryClient = useQueryClient();

  // Buscar transações
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['financial-transactions'],
    queryFn: () => supabaseFinancialService.fetchFinancialTransactions({ limit: 50 }),
  });

  // Buscar categorias
  const { data: categories = [] } = useQuery({
    queryKey: ['transaction-categories'],
    queryFn: () => supabaseFinancialService.fetchTransactionCategories(),
  });

  // Criar transação
  const createTransactionMutation = useMutation({
    mutationFn: (transactionData: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>) =>
      supabaseFinancialService.createFinancialTransaction(transactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      setIsDialogOpen(false);
      setFormData({
        type: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: '',
        category_id: '',
        payment_method: '',
        observations: ''
      });
      toast({
        title: "Transação criada",
        description: "A transação foi registrada com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar transação",
        description: "Não foi possível registrar a transação.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.description || !formData.category_id || formData.amount <= 0) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    createTransactionMutation.mutate({
      type: formData.type as 'entrada' | 'saida',
      amount: formData.amount,
      date: formData.date,
      description: formData.description,
      category_id: formData.category_id,
      payment_method: formData.payment_method as any,
      observations: formData.observations
    });
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      entrada: "bg-green-100 text-green-800 border-green-300",
      saida: "bg-red-100 text-red-800 border-red-300",
    };

    return (
      <Badge variant="outline" className={variants[type as keyof typeof variants]}>
        <span className="flex items-center gap-1">
          {type === 'entrada' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {type === 'entrada' ? 'Entrada' : 'Saída'}
        </span>
      </Badge>
    );
  };

  const filteredCategories = categories.filter(cat => 
    !formData.type || cat.type === formData.type
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Transações Financeiras</h2>
          <p className="text-gray-600">Gerencie todas as entradas e saídas financeiras</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nova Transação</DialogTitle>
              <DialogDescription>
                Adicione uma nova entrada ou saída financeira
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as 'entrada' | 'saida', category_id: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Valor *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da transação"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    disabled={!formData.type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="payment_method">Método de Pagamento</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                      <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  placeholder="Informações adicionais (opcional)"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createTransactionMutation.isPending}>
                  {createTransactionMutation.isPending ? "Salvando..." : "Salvar Transação"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entradas</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(transactions.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0))}
                </p>
              </div>
              <ArrowUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Saídas</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(transactions.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0))}
                </p>
              </div>
              <ArrowDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saldo</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    transactions.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.amount, 0) -
                    transactions.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.amount, 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            Todas as transações financeiras registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Carregando transações...
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {getTypeBadge(transaction.type)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        {transaction.category_name || 'Sem categoria'}
                      </TableCell>
                      <TableCell className={`font-medium ${transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'entrada' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.payment_method?.replace('_', ' ') || '-'}
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

export default FinancialTransactionManagement;
