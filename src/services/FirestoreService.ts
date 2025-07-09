import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  Timestamp,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db, authenticateUser, getFirebaseAppId, getCurrentUserId } from '@/lib/firebase';

// Interfaces para tipagem
export interface SPINAnswers {
  situacao?: Record<string, string>;
  problemas?: Record<string, string>;
  implicacoes?: Record<string, string>;
  necessidades?: Record<string, string>;
  ultimaAtualizacao?: Timestamp;
}

export interface MonthlyMetrics {
  tatuagensRealizadas: number;
  horasTrabalhadas: number;
  valorTotalRecebido: number;
  compartilhadoComunidade: boolean;
  dataRegistro: Timestamp;
}

export interface TattooArtistData {
  userId: string;
  diagnostico?: SPINAnswers;
  metricasMensais?: Record<string, MonthlyMetrics>;
}

class FirestoreService {
  private async ensureAuthenticated(): Promise<boolean> {
    return await authenticateUser();
  }

  private getBasePath(): string {
    const appId = getFirebaseAppId();
    return `artifacts/${appId}/public/artists`;
  }

  // SPIN Selling - Diagnóstico
  async saveSPINAnswers(section: string, answers: Record<string, string>): Promise<void> {
    if (!await this.ensureAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('ID do usuário não encontrado');
    }

    const docRef = doc(db, `${this.getBasePath()}/${userId}/diagnostico/spin_answers`);
    
    const updateData: Partial<SPINAnswers> = {
      [section]: answers,
      ultimaAtualizacao: Timestamp.now()
    };

    await setDoc(docRef, updateData, { merge: true });
  }

  async getSPINAnswers(userId?: string): Promise<SPINAnswers | null> {
    if (!await this.ensureAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    const targetUserId = userId || getCurrentUserId();
    if (!targetUserId) {
      throw new Error('ID do usuário não encontrado');
    }

    const docRef = doc(db, `${this.getBasePath()}/${targetUserId}/diagnostico/spin_answers`);
    const docSnap = await getDoc(docRef);
    
    return docSnap.exists() ? docSnap.data() as SPINAnswers : null;
  }

  // Métricas Mensais
  async saveMonthlyMetrics(monthYear: string, metrics: Omit<MonthlyMetrics, 'dataRegistro'>): Promise<void> {
    if (!await this.ensureAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('ID do usuário não encontrado');
    }

    const docRef = doc(db, `${this.getBasePath()}/${userId}/metricasMensais/${monthYear}`);
    
    const metricsData: MonthlyMetrics = {
      ...metrics,
      dataRegistro: Timestamp.now()
    };

    await setDoc(docRef, metricsData);
  }

  async getMonthlyMetrics(userId?: string): Promise<Record<string, MonthlyMetrics>> {
    if (!await this.ensureAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    const targetUserId = userId || getCurrentUserId();
    if (!targetUserId) {
      throw new Error('ID do usuário não encontrado');
    }

    const collectionRef = collection(db, `${this.getBasePath()}/${targetUserId}/metricasMensais`);
    const querySnapshot = await getDocs(collectionRef);
    
    const metrics: Record<string, MonthlyMetrics> = {};
    querySnapshot.forEach((doc) => {
      metrics[doc.id] = doc.data() as MonthlyMetrics;
    });
    
    return metrics;
  }

  // CRM - Listar todos os tatuadores
  async getAllArtists(): Promise<TattooArtistData[]> {
    if (!await this.ensureAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    const collectionRef = collection(db, this.getBasePath());
    const querySnapshot = await getDocs(collectionRef);
    
    const artists: TattooArtistData[] = [];
    
    for (const artistDoc of querySnapshot.docs) {
      const userId = artistDoc.id;
      
      // Buscar diagnóstico
      const diagnostico = await this.getSPINAnswers(userId);
      
      // Buscar métricas mensais
      const metricasMensais = await this.getMonthlyMetrics(userId);
      
      artists.push({
        userId,
        diagnostico: diagnostico || undefined,
        metricasMensais: Object.keys(metricasMensais).length > 0 ? metricasMensais : undefined
      });
    }
    
    return artists;
  }

  // Observador em tempo real para o CRM
  onArtistsChange(callback: (artists: TattooArtistData[]) => void): () => void {
    const collectionRef = collection(db, this.getBasePath());
    
    return onSnapshot(collectionRef, async (snapshot) => {
      const artists: TattooArtistData[] = [];
      
      for (const artistDoc of snapshot.docs) {
        const userId = artistDoc.id;
        
        try {
          const diagnostico = await this.getSPINAnswers(userId);
          const metricasMensais = await this.getMonthlyMetrics(userId);
          
          artists.push({
            userId,
            diagnostico: diagnostico || undefined,
            metricasMensais: Object.keys(metricasMensais).length > 0 ? metricasMensais : undefined
          });
        } catch (error) {
          console.error(`Erro ao buscar dados do tatuador ${userId}:`, error);
        }
      }
      
      callback(artists);
    });
  }

  // Popular dados mock iniciais
  async populateMockData(): Promise<void> {
    if (!await this.ensureAuthenticated()) {
      throw new Error('Usuário não autenticado');
    }

    const mockArtists = [
      {
        userId: 'user_tatuador_123',
        diagnostico: {
          situacao: {
            pergunta1: 'Realizo entre 20 a 25 tatuagens por mês, principalmente realismo e blackwork.',
            pergunta2: 'Especializo-me em realismo há 8 anos, também faço blackwork e ornamental.',
            pergunta3: 'Uso principalmente Instagram, indicações de clientes e parcerias com outros estúdios.'
          },
          problemas: {
            pergunta1: 'Dificuldade em alcançar meu público-alvo ideal, muita concorrência com preços baixos.',
            pergunta2: 'Às vezes aceito valores menores para não perder cliente, especialmente em épocas mais devagar.',
            pergunta3: 'Gostaria de melhorar minha gestão de tempo e ter um processo mais organizado de agendamento.'
          },
          implicacoes: {
            pergunta1: 'Pode limitar significativamente meu crescimento e me manter sempre dependente de indicações.',
            pergunta2: 'Me sinto estagnado artisticamente, não consigo evoluir como gostaria devido à falta de tempo.'
          },
          necessidades: {
            pergunta1: 'Teria mais tempo para me dedicar à arte, aumentaria meu faturamento e teria mais satisfação profissional.',
            pergunta2: 'Maior satisfação no trabalho, melhor reconhecimento da minha arte e preços mais justos pelo meu trabalho.'
          }
        },
        metricasMensais: {
          '2025-03': {
            tatuagensRealizadas: 22,
            horasTrabalhadas: 160,
            valorTotalRecebido: 5200,
            compartilhadoComunidade: true
          },
          '2025-04': {
            tatuagensRealizadas: 18,
            horasTrabalhadas: 140,
            valorTotalRecebido: 4000,
            compartilhadoComunidade: false
          },
          '2025-05': {
            tatuagensRealizadas: 20,
            horasTrabalhadas: 150,
            valorTotalRecebido: 4500,
            compartilhadoComunidade: true
          },
          '2025-06': {
            tatuagensRealizadas: 25,
            horasTrabalhadas: 180,
            valorTotalRecebido: 6000,
            compartilhadoComunidade: true
          },
          '2025-07': {
            tatuagensRealizadas: 23,
            horasTrabalhadas: 170,
            valorTotalRecebido: 5500,
            compartilhadoComunidade: false
          }
        }
      },
      {
        userId: 'user_tatuador_456',
        diagnostico: {
          situacao: {
            pergunta1: 'Faço cerca de 15 tatuagens por mês, ainda estou construindo minha clientela.',
            pergunta2: 'Trabalho principalmente com traço fino e minimalismo há 3 anos.'
          },
          problemas: {
            pergunta1: 'Tenho dificuldade para precificar meu trabalho e conquistar a confiança dos clientes.'
          }
        },
        metricasMensais: {
          '2025-06': {
            tatuagensRealizadas: 15,
            horasTrabalhadas: 120,
            valorTotalRecebido: 3000,
            compartilhadoComunidade: false
          },
          '2025-07': {
            tatuagensRealizadas: 18,
            horasTrabalhadas: 140,
            valorTotalRecebido: 3800,
            compartilhadoComunidade: true
          }
        }
      },
      {
        userId: 'user_tatuador_789',
        diagnostico: {
          situacao: {
            pergunta1: 'Estou começando, faço cerca de 8-10 tatuagens por mês.'
          }
        },
        metricasMensais: {}
      }
    ];

    // Verificar se já existem dados antes de popular
    const existingArtists = await this.getAllArtists();
    if (existingArtists.length > 0) {
      console.log('Dados mock já existem, pulando população inicial');
      return;
    }

    // Popular dados mock
    for (const artist of mockArtists) {
      // Salvar diagnóstico se existir
      if (artist.diagnostico) {
        for (const [section, answers] of Object.entries(artist.diagnostico)) {
          const docRef = doc(db, `${this.getBasePath()}/${artist.userId}/diagnostico/spin_answers`);
          const updateData: Partial<SPINAnswers> = {
            [section]: answers,
            ultimaAtualizacao: Timestamp.now()
          };
          await setDoc(docRef, updateData, { merge: true });
        }
      }

      // Salvar métricas mensais se existirem
      if (artist.metricasMensais) {
        for (const [monthYear, metrics] of Object.entries(artist.metricasMensais)) {
          const docRef = doc(db, `${this.getBasePath()}/${artist.userId}/metricasMensais/${monthYear}`);
          const metricsData: MonthlyMetrics = {
            tatuagensRealizadas: metrics.tatuagensRealizadas,
            horasTrabalhadas: metrics.horasTrabalhadas,
            valorTotalRecebido: metrics.valorTotalRecebido,
            compartilhadoComunidade: metrics.compartilhadoComunidade,
            dataRegistro: Timestamp.now()
          };
          await setDoc(docRef, metricsData);
        }
      }
    }

    console.log('Dados mock populados com sucesso');
  }
}

export const firestoreService = new FirestoreService();
