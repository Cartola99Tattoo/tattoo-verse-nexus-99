import { supabase, isSupabaseConnected } from "@/integrations/supabase/client";
import { 
  IFinancialService, 
  TattooTransaction, 
  ArtistCommission, 
  FinancialReport,
  TransactionCategory,
  FinancialTransaction,
  DashboardMetrics
} from "../interfaces/IFinancialService";
import { toast } from "@/hooks/use-toast";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'materials' | 'rent' | 'marketing' | 'utilities' | 'salaries' | 'other';
  date: string;
  created_at: string;
  updated_at: string;
}

export interface DREData {
  period: string;
  gross_revenue: number;
  sales_deductions: number;
  net_revenue: number;
  material_costs: number;
  gross_profit: number;
  operational_expenses: number;
  artist_commissions: number;
  operational_result: number;
  non_operational_expenses: number;
  result_before_taxes: number;
  taxes: number;
  net_result: number;
}

export class SupabaseFinancialService implements IFinancialService {
  
  async fetchDashboardMetrics(): Promise<DashboardMetrics> {
    if (!isSupabaseConnected()) {
      // Return mock data when Supabase is not connected
      return {
        totalRevenue: 15420,
        totalExpenses: 8750,
        netProfit: 6670,
        monthlyGrowth: 12.5
      };
    }

    try {
      // Calculate metrics from financial transactions
      const { data: transactions, error } = await supabase
        .from('financial_transactions')
        .select('type, amount')
        .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);

      if (error) throw error;

      const totalRevenue = (transactions || [])
        .filter(t => t.type === 'entrada')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = (transactions || [])
        .filter(t => t.type === 'saida')
        .reduce((sum, t) => sum + t.amount, 0);

      const netProfit = totalRevenue - totalExpenses;

      // Calculate monthly growth (simplified)
      const monthlyGrowth = 12.5; // This would need more complex calculation

      return {
        totalRevenue,
        totalExpenses,
        netProfit,
        monthlyGrowth
      };
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error);
      // Return mock data as fallback
      return {
        totalRevenue: 15420,
        totalExpenses: 8750,
        netProfit: 6670,
        monthlyGrowth: 12.5
      };
    }
  }

  async fetchTattooTransactions(options?: {
    startDate?: string;
    endDate?: string;
    artistId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<TattooTransaction[]> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      let query = supabase
        .from('tattoo_transactions')
        .select(`
          *,
          profiles:customer_id(first_name, last_name),
          artists:artist_id(first_name, last_name)
        `);

      if (options?.status) {
        query = query.eq('payment_status', options.status);
      }

      if (options?.artistId) {
        query = query.eq('artist_id', options.artistId);
      }

      if (options?.startDate) {
        query = query.gte('transaction_date', options.startDate);
      }

      if (options?.endDate) {
        query = query.lte('transaction_date', options.endDate);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
      }

      query = query.order('transaction_date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(item => ({
        ...item,
        customer_name: `${item.profiles?.first_name || ''} ${item.profiles?.last_name || ''}`.trim() || 'Cliente não identificado'
      })) || [];

    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      toast({
        title: "Erro ao carregar transações",
        description: "Não foi possível carregar as transações.",
        variant: "destructive"
      });
      return [];
    }
  }

  async fetchTransactionById(id: string): Promise<TattooTransaction | null> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      const { data, error } = await supabase
        .from('tattoo_transactions')
        .select(`
          *,
          profiles:customer_id(first_name, last_name),
          artists:artist_id(first_name, last_name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        return {
          ...data,
          customer_name: `${data.profiles?.first_name || ''} ${data.profiles?.last_name || ''}`.trim() || 'Cliente não identificado'
        };
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      return null;
    }
  }

  async createTattooTransaction(transactionData: Omit<TattooTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<TattooTransaction> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      const { data, error } = await supabase
        .from('tattoo_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) throw error;

      // Calcular comissão automaticamente se o pagamento foi confirmado
      if (data.payment_status === 'completed') {
        await this.calculateArtistCommission(data.id, 0.3); // 30% padrão
      }

      return { ...data, customer_name: 'Cliente' };
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  }

  async updateTattooTransaction(id: string, transactionData: Partial<TattooTransaction>): Promise<TattooTransaction> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      const { data, error } = await supabase
        .from('tattoo_transactions')
        .update(transactionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { ...data, customer_name: 'Cliente' };
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  }

  async fetchArtistCommissions(options?: {
    artistId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ArtistCommission[]> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      let query = supabase
        .from('artist_commissions')
        .select(`
          *,
          artists:artist_id(first_name, last_name)
        `);

      if (options?.artistId) {
        query = query.eq('artist_id', options.artistId);
      }

      if (options?.status) {
        query = query.eq('status', options.status);
      }

      if (options?.startDate) {
        query = query.gte('period_start', options.startDate);
      }

      if (options?.endDate) {
        query = query.lte('period_end', options.endDate);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        ...item,
        artist_name: `${item.artists?.first_name || ''} ${item.artists?.last_name || ''}`.trim() || 'Artista'
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar comissões:', error);
      return [];
    }
  }

  async calculateArtistCommission(transactionId: string, commissionRate: number): Promise<ArtistCommission> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      // Buscar a transação
      const transaction = await this.fetchTransactionById(transactionId);
      if (!transaction) {
        throw new Error("Transação não encontrada");
      }

      const commissionAmount = (transaction.final_amount || transaction.amount) * commissionRate;

      const commissionData = {
        artist_id: transaction.artist_id,
        transaction_id: transactionId,
        base_amount: transaction.final_amount || transaction.amount,
        commission_rate: commissionRate,
        commission_amount: commissionAmount,
        status: 'calculated' as const,
        period_start: new Date().toISOString(),
        period_end: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('artist_commissions')
        .insert(commissionData)
        .select()
        .single();

      if (error) throw error;

      return { ...data, artist_name: 'Artista' };
    } catch (error) {
      console.error('Erro ao calcular comissão:', error);
      throw error;
    }
  }

  async updateCommissionStatus(commissionId: string, status: ArtistCommission['status']): Promise<ArtistCommission> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      const { data, error } = await supabase
        .from('artist_commissions')
        .update({ status })
        .eq('id', commissionId)
        .select()
        .single();

      if (error) throw error;

      return { ...data, artist_name: 'Artista' };
    } catch (error) {
      console.error('Erro ao atualizar status da comissão:', error);
      throw error;
    }
  }

  async generateFinancialReport(startDate: string, endDate: string): Promise<FinancialReport> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      // Buscar transações do período
      const transactions = await this.fetchTattooTransactions({
        startDate,
        endDate,
        status: 'completed'
      });

      // Buscar comissões do período
      const commissions = await this.fetchArtistCommissions({
        startDate,
        endDate,
        status: 'paid'
      });

      const totalRevenue = transactions.reduce((sum, t) => sum + (t.final_amount || t.amount), 0);
      const totalCommissions = commissions.reduce((sum, c) => sum + c.commission_amount, 0);
      const totalMaterialCosts = transactions.reduce((sum, t) => sum + (t.material_cost || 0), 0);

      // Calcular top artistas
      const artistsRevenue = transactions.reduce((acc, t) => {
        const artistId = t.artist_id;
        if (!acc[artistId]) {
          acc[artistId] = {
            artist_id: artistId,
            artist_name: 'Artista',
            revenue: 0,
            commission: 0,
            tattoo_count: 0
          };
        }
        acc[artistId].revenue += (t.final_amount || t.amount);
        acc[artistId].tattoo_count += 1;
        return acc;
      }, {} as Record<string, any>);

      const topArtists = Object.values(artistsRevenue)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 5);

      // Calcular receita por estilo (mock data por enquanto)
      const revenueByStyle = [
        { style: 'Realismo', revenue: totalRevenue * 0.4, count: Math.floor(transactions.length * 0.4) },
        { style: 'Traditional', revenue: totalRevenue * 0.3, count: Math.floor(transactions.length * 0.3) },
        { style: 'Aquarela', revenue: totalRevenue * 0.2, count: Math.floor(transactions.length * 0.2) },
        { style: 'Minimalista', revenue: totalRevenue * 0.1, count: Math.floor(transactions.length * 0.1) }
      ];

      return {
        period: `${startDate} a ${endDate}`,
        total_revenue: totalRevenue,
        total_commissions: totalCommissions,
        total_material_costs: totalMaterialCosts,
        net_profit: totalRevenue - totalCommissions - totalMaterialCosts,
        transaction_count: transactions.length,
        top_artists: topArtists,
        revenue_by_style: revenueByStyle
      };
    } catch (error) {
      console.error('Erro ao gerar relatório financeiro:', error);
      throw error;
    }
  }

  async fetchRevenueByPeriod(period: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string): Promise<Array<{
    date: string;
    revenue: number;
    transaction_count: number;
  }>> {
    // Implementação simplificada - pode ser expandida
    const transactions = await this.fetchTattooTransactions({ startDate, endDate });
    
    return [{
      date: startDate,
      revenue: transactions.reduce((sum, t) => sum + (t.final_amount || t.amount), 0),
      transaction_count: transactions.length
    }];
  }

  async fetchTopArtistsByRevenue(startDate: string, endDate: string, limit: number = 5): Promise<Array<{
    artist_id: string;
    artist_name: string;
    revenue: number;
    commission: number;
    tattoo_count: number;
  }>> {
    const report = await this.generateFinancialReport(startDate, endDate);
    return report.top_artists.slice(0, limit);
  }

  // Métodos específicos para despesas
  async fetchExpenses(options?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    limit?: number;
  }): Promise<Expense[]> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      let query = supabase.from('expenses').select('*');

      if (options?.category) {
        query = query.eq('category', options.category);
      }

      if (options?.startDate) {
        query = query.gte('date', options.startDate);
      }

      if (options?.endDate) {
        query = query.lte('date', options.endDate);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
      return [];
    }
  }

  async createExpense(expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert(expenseData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Despesa criada",
        description: "A despesa foi registrada com sucesso.",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      toast({
        title: "Erro ao criar despesa",
        description: "Não foi possível registrar a despesa.",
        variant: "destructive"
      });
      throw error;
    }
  }

  async generateDRE(startDate: string, endDate: string): Promise<DREData> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      // Buscar dados do período
      const transactions = await this.fetchTattooTransactions({
        startDate,
        endDate,
        status: 'completed'
      });

      const expenses = await this.fetchExpenses({ startDate, endDate });
      const commissions = await this.fetchArtistCommissions({ startDate, endDate, status: 'paid' });

      // Calcular valores do DRE
      const grossRevenue = transactions.reduce((sum, t) => sum + (t.final_amount || t.amount), 0);
      const salesDeductions = 0; // Pode ser implementado conforme necessário
      const netRevenue = grossRevenue - salesDeductions;
      const materialCosts = transactions.reduce((sum, t) => sum + (t.material_cost || 0), 0);
      const grossProfit = netRevenue - materialCosts;

      const operationalExpenses = expenses
        .filter(e => ['rent', 'utilities', 'marketing'].includes(e.category))
        .reduce((sum, e) => sum + e.amount, 0);
      
      const artistCommissions = commissions.reduce((sum, c) => sum + c.commission_amount, 0);
      const operationalResult = grossProfit - operationalExpenses - artistCommissions;

      const nonOperationalExpenses = expenses
        .filter(e => e.category === 'other')
        .reduce((sum, e) => sum + e.amount, 0);

      const resultBeforeTaxes = operationalResult - nonOperationalExpenses;
      const taxes = resultBeforeTaxes * 0.08; // 8% estimado
      const netResult = resultBeforeTaxes - taxes;

      return {
        period: `${startDate} a ${endDate}`,
        gross_revenue: grossRevenue,
        sales_deductions: salesDeductions,
        net_revenue: netRevenue,
        material_costs: materialCosts,
        gross_profit: grossProfit,
        operational_expenses: operationalExpenses,
        artist_commissions: artistCommissions,
        operational_result: operationalResult,
        non_operational_expenses: nonOperationalExpenses,
        result_before_taxes: resultBeforeTaxes,
        taxes: taxes,
        net_result: netResult
      };
    } catch (error) {
      console.error('Erro ao gerar DRE:', error);
      throw error;
    }
  }

  // Novos métodos para categorias de transações
  async fetchTransactionCategories(type?: 'entrada' | 'saida'): Promise<TransactionCategory[]> {
    if (!isSupabaseConnected()) {
      // Retornar dados mock para desenvolvimento
      const mockCategories: TransactionCategory[] = [
        { id: '1', name: 'Venda de Tatuagem', type: 'entrada', created_at: '', updated_at: '' },
        { id: '2', name: 'Venda de Produtos', type: 'entrada', created_at: '', updated_at: '' },
        { id: '3', name: 'Materiais', type: 'saida', created_at: '', updated_at: '' },
        { id: '4', name: 'Aluguel', type: 'saida', created_at: '', updated_at: '' },
        { id: '5', name: 'Marketing', type: 'saida', created_at: '', updated_at: '' },
      ];
      return type ? mockCategories.filter(cat => cat.type === type) : mockCategories;
    }

    try {
      let query = supabase.from('transaction_categories').select('*');
      
      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('name');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }

  async createTransactionCategory(categoryData: Omit<TransactionCategory, 'id' | 'created_at' | 'updated_at'>): Promise<TransactionCategory> {
    if (!isSupabaseConnected()) {
      // Mock para desenvolvimento
      return {
        id: Math.random().toString(),
        ...categoryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase
        .from('transaction_categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
  }

  async updateTransactionCategory(id: string, categoryData: Partial<TransactionCategory>): Promise<TransactionCategory> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      const { data, error } = await supabase
        .from('transaction_categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      throw error;
    }
  }

  async deleteTransactionCategory(id: string): Promise<void> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      const { error } = await supabase
        .from('transaction_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      throw error;
    }
  }

  // Novos métodos para transações financeiras gerais
  async fetchFinancialTransactions(options?: {
    startDate?: string;
    endDate?: string;
    type?: 'entrada' | 'saida';
    categoryId?: string;
    limit?: number;
    offset?: number;
  }): Promise<FinancialTransaction[]> {
    if (!isSupabaseConnected()) {
      // Dados mock para desenvolvimento
      const mockTransactions: FinancialTransaction[] = [
        {
          id: '1',
          type: 'entrada',
          amount: 1500,
          date: new Date().toISOString().split('T')[0],
          description: 'Venda de produtos físicos',
          category_id: '2',
          category_name: 'Venda de Produtos',
          payment_method: 'cartao_credito',
          observations: 'Venda no balcão',
          created_at: '',
          updated_at: ''
        },
        {
          id: '2',
          type: 'saida',
          amount: 800,
          date: new Date().toISOString().split('T')[0],
          description: 'Compra de materiais',
          category_id: '3',
          category_name: 'Materiais',
          payment_method: 'pix',
          observations: 'Tintas e agulhas',
          created_at: '',
          updated_at: ''
        }
      ];
      
      let filtered = mockTransactions;
      if (options?.type) {
        filtered = filtered.filter(t => t.type === options.type);
      }
      return filtered;
    }

    try {
      let query = supabase
        .from('financial_transactions')
        .select(`
          *,
          transaction_categories:category_id(name)
        `);

      if (options?.type) {
        query = query.eq('type', options.type);
      }

      if (options?.categoryId) {
        query = query.eq('category_id', options.categoryId);
      }

      if (options?.startDate) {
        query = query.gte('date', options.startDate);
      }

      if (options?.endDate) {
        query = query.lte('date', options.endDate);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
      }

      query = query.order('date', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(item => ({
        ...item,
        category_name: item.transaction_categories?.name || 'Sem categoria'
      })) || [];

    } catch (error) {
      console.error('Erro ao buscar transações financeiras:', error);
      return [];
    }
  }

  async createFinancialTransaction(transactionData: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<FinancialTransaction> {
    if (!isSupabaseConnected()) {
      // Mock para desenvolvimento
      return {
        id: Math.random().toString(),
        ...transactionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Transação criada",
        description: "A transação foi registrada com sucesso.",
      });

      return data;
    } catch (error) {
      console.error('Erro ao criar transação financeira:', error);
      toast({
        title: "Erro ao criar transação",
        description: "Não foi possível registrar a transação.",
        variant: "destructive"
      });
      throw error;
    }
  }

  async updateFinancialTransaction(id: string, transactionData: Partial<FinancialTransaction>): Promise<FinancialTransaction> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .update(transactionData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao atualizar transação financeira:', error);
      throw error;
    }
  }

  async deleteFinancialTransaction(id: string): Promise<void> {
    if (!isSupabaseConnected()) {
      throw new Error("Supabase não conectado");
    }

    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar transação financeira:', error);
      throw error;
    }
  }
}

export const supabaseFinancialService = new SupabaseFinancialService();
