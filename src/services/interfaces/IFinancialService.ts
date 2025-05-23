
export interface TattooTransaction {
  id: string;
  order_id: string;
  product_id: string;
  artist_id: string;
  customer_name: string;
  amount: number;
  final_amount?: number;
  artist_commission?: number;
  material_cost?: number;
  payment_status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  transaction_date: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ArtistCommission {
  id: string;
  artist_id: string;
  artist_name: string;
  transaction_id: string;
  base_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'calculated' | 'paid';
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface FinancialReport {
  period: string;
  total_revenue: number;
  total_commissions: number;
  total_material_costs: number;
  net_profit: number;
  transaction_count: number;
  top_artists: Array<{
    artist_id: string;
    artist_name: string;
    revenue: number;
    commission: number;
    tattoo_count: number;
  }>;
  revenue_by_style: Array<{
    style: string;
    revenue: number;
    count: number;
  }>;
}

export interface IFinancialService {
  // Transações de tatuagens
  fetchTattooTransactions(options?: {
    startDate?: string;
    endDate?: string;
    artistId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<TattooTransaction[]>;
  
  fetchTransactionById(id: string): Promise<TattooTransaction | null>;
  
  createTattooTransaction(transactionData: Omit<TattooTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<TattooTransaction>;
  
  updateTattooTransaction(id: string, transactionData: Partial<TattooTransaction>): Promise<TattooTransaction>;
  
  // Comissões de artistas
  fetchArtistCommissions(options?: {
    artistId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ArtistCommission[]>;
  
  calculateArtistCommission(transactionId: string, commissionRate: number): Promise<ArtistCommission>;
  
  updateCommissionStatus(commissionId: string, status: ArtistCommission['status']): Promise<ArtistCommission>;
  
  // Relatórios financeiros
  generateFinancialReport(startDate: string, endDate: string): Promise<FinancialReport>;
  
  fetchRevenueByPeriod(period: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string): Promise<Array<{
    date: string;
    revenue: number;
    transaction_count: number;
  }>>;
  
  fetchTopArtistsByRevenue(startDate: string, endDate: string, limit?: number): Promise<Array<{
    artist_id: string;
    artist_name: string;
    revenue: number;
    commission: number;
    tattoo_count: number;
  }>>;
}
