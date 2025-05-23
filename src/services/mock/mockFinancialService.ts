
import { faker } from '@faker-js/faker';
import { IFinancialService, TattooTransaction, ArtistCommission, FinancialReport } from '../interfaces/IFinancialService';
import { generateMockId, delay } from './mockUtils';

class MockFinancialService implements IFinancialService {
  private mockTransactions: TattooTransaction[] = [];
  private mockCommissions: ArtistCommission[] = [];

  constructor() {
    this.generateMockData();
  }

  private generateMockData() {
    // Gerar transações mock
    for (let i = 0; i < 50; i++) {
      const transaction: TattooTransaction = {
        id: generateMockId(),
        order_id: generateMockId(),
        product_id: generateMockId(),
        artist_id: generateMockId(),
        customer_name: faker.person.fullName(),
        amount: faker.number.int({ min: 200, max: 1500 }),
        final_amount: faker.datatype.boolean() ? faker.number.int({ min: 250, max: 1800 }) : undefined,
        artist_commission: faker.datatype.boolean() ? faker.number.int({ min: 50, max: 500 }) : undefined,
        material_cost: faker.number.int({ min: 20, max: 100 }),
        payment_status: faker.helpers.arrayElement(['pending', 'confirmed', 'completed', 'cancelled']),
        transaction_date: faker.date.recent({ days: 90 }).toISOString(),
        completion_date: faker.datatype.boolean() ? faker.date.recent({ days: 30 }).toISOString() : undefined,
        created_at: faker.date.recent({ days: 100 }).toISOString(),
        updated_at: faker.date.recent({ days: 10 }).toISOString(),
      };
      this.mockTransactions.push(transaction);
    }

    // Gerar comissões mock
    for (let i = 0; i < 30; i++) {
      const commission: ArtistCommission = {
        id: generateMockId(),
        artist_id: generateMockId(),
        artist_name: faker.person.fullName(),
        transaction_id: this.mockTransactions[i]?.id || generateMockId(),
        base_amount: faker.number.int({ min: 200, max: 1500 }),
        commission_rate: faker.number.float({ min: 0.15, max: 0.35, fractionDigits: 2 }),
        commission_amount: faker.number.int({ min: 50, max: 500 }),
        status: faker.helpers.arrayElement(['pending', 'calculated', 'paid']),
        period_start: faker.date.recent({ days: 30 }).toISOString(),
        period_end: faker.date.recent({ days: 1 }).toISOString(),
        created_at: faker.date.recent({ days: 30 }).toISOString(),
      };
      this.mockCommissions.push(commission);
    }
  }

  async fetchTattooTransactions(options = {}): Promise<TattooTransaction[]> {
    await delay(800);
    let filtered = [...this.mockTransactions];

    if (options.status) {
      filtered = filtered.filter(t => t.payment_status === options.status);
    }

    if (options.artistId) {
      filtered = filtered.filter(t => t.artist_id === options.artistId);
    }

    if (options.startDate) {
      filtered = filtered.filter(t => new Date(t.transaction_date) >= new Date(options.startDate!));
    }

    if (options.endDate) {
      filtered = filtered.filter(t => new Date(t.transaction_date) <= new Date(options.endDate!));
    }

    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered.sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
  }

  async fetchTransactionById(id: string): Promise<TattooTransaction | null> {
    await delay(500);
    return this.mockTransactions.find(t => t.id === id) || null;
  }

  async createTattooTransaction(transactionData: Omit<TattooTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<TattooTransaction> {
    await delay(1000);
    const newTransaction: TattooTransaction = {
      ...transactionData,
      id: generateMockId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.mockTransactions.unshift(newTransaction);
    return newTransaction;
  }

  async updateTattooTransaction(id: string, transactionData: Partial<TattooTransaction>): Promise<TattooTransaction> {
    await delay(800);
    const index = this.mockTransactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transação não encontrada');
    }
    
    this.mockTransactions[index] = {
      ...this.mockTransactions[index],
      ...transactionData,
      updated_at: new Date().toISOString(),
    };
    
    return this.mockTransactions[index];
  }

  async fetchArtistCommissions(options = {}): Promise<ArtistCommission[]> {
    await delay(600);
    let filtered = [...this.mockCommissions];

    if (options.artistId) {
      filtered = filtered.filter(c => c.artist_id === options.artistId);
    }

    if (options.status) {
      filtered = filtered.filter(c => c.status === options.status);
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async calculateArtistCommission(transactionId: string, commissionRate: number): Promise<ArtistCommission> {
    await delay(1000);
    const transaction = this.mockTransactions.find(t => t.id === transactionId);
    if (!transaction) {
      throw new Error('Transação não encontrada');
    }

    const baseAmount = transaction.final_amount || transaction.amount;
    const commissionAmount = Math.round(baseAmount * commissionRate);

    const commission: ArtistCommission = {
      id: generateMockId(),
      artist_id: transaction.artist_id,
      artist_name: faker.person.fullName(),
      transaction_id: transactionId,
      base_amount: baseAmount,
      commission_rate: commissionRate,
      commission_amount: commissionAmount,
      status: 'calculated',
      period_start: new Date().toISOString(),
      period_end: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    this.mockCommissions.unshift(commission);
    return commission;
  }

  async updateCommissionStatus(commissionId: string, status: ArtistCommission['status']): Promise<ArtistCommission> {
    await delay(500);
    const index = this.mockCommissions.findIndex(c => c.id === commissionId);
    if (index === -1) {
      throw new Error('Comissão não encontrada');
    }
    
    this.mockCommissions[index].status = status;
    return this.mockCommissions[index];
  }

  async generateFinancialReport(startDate: string, endDate: string): Promise<FinancialReport> {
    await delay(1200);
    
    const filteredTransactions = this.mockTransactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });

    const totalRevenue = filteredTransactions.reduce((sum, t) => sum + (t.final_amount || t.amount), 0);
    const totalCommissions = filteredTransactions.reduce((sum, t) => sum + (t.artist_commission || 0), 0);
    const totalMaterialCosts = filteredTransactions.reduce((sum, t) => sum + (t.material_cost || 0), 0);

    return {
      period: `${startDate} a ${endDate}`,
      total_revenue: totalRevenue,
      total_commissions: totalCommissions,
      total_material_costs: totalMaterialCosts,
      net_profit: totalRevenue - totalCommissions - totalMaterialCosts,
      transaction_count: filteredTransactions.length,
      top_artists: [
        { artist_id: '1', artist_name: 'Carlos Silva', revenue: 12500, commission: 3750, tattoo_count: 8 },
        { artist_id: '2', artist_name: 'Ana Costa', revenue: 9800, commission: 2940, tattoo_count: 6 },
        { artist_id: '3', artist_name: 'João Santos', revenue: 7200, commission: 2160, tattoo_count: 5 },
      ],
      revenue_by_style: [
        { style: 'Realismo', revenue: 15600, count: 12 },
        { style: 'Old School', revenue: 8900, count: 7 },
        { style: 'Minimalista', revenue: 5000, count: 10 },
      ],
    };
  }

  async fetchRevenueByPeriod(period: 'daily' | 'weekly' | 'monthly', startDate: string, endDate: string): Promise<Array<{
    date: string;
    revenue: number;
    transaction_count: number;
  }>> {
    await delay(800);
    
    // Simulação de dados de receita por período
    const data = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      data.push({
        date: d.toISOString().split('T')[0],
        revenue: faker.number.int({ min: 500, max: 3000 }),
        transaction_count: faker.number.int({ min: 1, max: 8 }),
      });
    }
    
    return data;
  }

  async fetchTopArtistsByRevenue(startDate: string, endDate: string, limit = 10): Promise<Array<{
    artist_id: string;
    artist_name: string;
    revenue: number;
    commission: number;
    tattoo_count: number;
  }>> {
    await delay(600);
    
    return [
      { artist_id: '1', artist_name: 'Carlos Silva', revenue: 12500, commission: 3750, tattoo_count: 8 },
      { artist_id: '2', artist_name: 'Ana Costa', revenue: 9800, commission: 2940, tattoo_count: 6 },
      { artist_id: '3', artist_name: 'João Santos', revenue: 7200, commission: 2160, tattoo_count: 5 },
      { artist_id: '4', artist_name: 'Maria Oliveira', revenue: 6800, commission: 2040, tattoo_count: 4 },
      { artist_id: '5', artist_name: 'Pedro Lima', revenue: 5900, commission: 1770, tattoo_count: 3 },
    ].slice(0, limit);
  }
}

export const mockFinancialService = new MockFinancialService();
