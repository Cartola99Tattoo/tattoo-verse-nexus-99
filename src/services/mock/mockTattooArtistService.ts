import { ITattooArtistService, TattooArtistPortfolioItem, TattooArtistBlogPost, ProfessionalProduct, ConsultingService } from '../interfaces/ITattooArtistService';
import { generateMockId, createMockTimestamps } from './mockUtils';

class MockTattooArtistService implements ITattooArtistService {
  private portfolioItems: TattooArtistPortfolioItem[] = [
    {
      id: '1',
      artist_id: 'artist_1',
      title: 'Tatuagem Realista de Leão',
      description: 'Trabalho realista em preto e cinza, técnica de sombreamento avançada aplicada em 3 sessões.',
      image_url: 'https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop',
      style: 'Realismo',
      category: 'Trabalho Original',
      completion_date: '2024-01-15',
      client_name: 'João Silva',
      session_duration: '4 horas',
      tags: ['realismo', 'preto-cinza', 'animal'],
      ...createMockTimestamps()
    },
    {
      id: '2',
      artist_id: 'artist_1',
      title: 'Cover Up Floral',
      description: 'Transformação completa de tatuagem antiga em design floral moderno com técnicas de aquarela.',
      image_url: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1974&auto=format&fit=crop',
      style: 'Aquarela',
      category: 'Cover Up',
      completion_date: '2024-01-10',
      session_duration: '6 horas',
      tags: ['coverup', 'aquarela', 'floral'],
      ...createMockTimestamps()
    }
  ];

  private blogPosts: TattooArtistBlogPost[] = [
    {
      id: '1',
      artist_id: 'artist_1',
      title: 'Técnicas Avançadas de Realismo em Tatuagem',
      slug: 'tecnicas-avancadas-realismo-tatuagem',
      content: 'O realismo em tatuagem exige domínio técnico e compreensão profunda de luz, sombra e textura...',
      excerpt: 'Aprenda as técnicas fundamentais para criar tatuagens realistas impressionantes.',
      cover_image: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop',
      category: 'tecnicas',
      status: 'published',
      published_at: '2024-01-15T10:00:00Z',
      tags: ['realismo', 'tecnica', 'tutorial'],
      ...createMockTimestamps()
    },
    {
      id: '2',
      artist_id: 'artist_1',
      title: 'Como Precificar Seus Trabalhos de Forma Justa',
      slug: 'como-precificar-trabalhos-tatuagem',
      content: 'A precificação é um dos aspectos mais desafiadores para tatuadores...',
      excerpt: 'Estratégias para definir preços justos que valorizam seu trabalho e atraem clientes.',
      category: 'negocios',
      status: 'published',
      published_at: '2024-01-12T10:00:00Z',
      tags: ['negocios', 'precificacao', 'estrategia'],
      ...createMockTimestamps()
    }
  ];

  private professionalProducts: ProfessionalProduct[] = [
    {
      id: '1',
      name: 'Kit Agulhas Premium Professional',
      description: 'Conjunto completo de agulhas profissionais para diferentes estilos de tatuagem.',
      price: 89.90,
      professional_price: 67.43,
      category: 'agulhas',
      brand: 'TattooTech Pro',
      stock_quantity: 45,
      images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=1000'],
      specifications: ['Aço inoxidável', 'Esterilizadas', 'Embalagem individual'],
      professional_only: true,
      ...createMockTimestamps()
    },
    {
      id: '2',
      name: 'Tinta Profissional Black Label Set',
      description: 'Conjunto de tintas profissionais com pigmentação superior e durabilidade.',
      price: 450.00,
      professional_price: 337.50,
      category: 'tintas',
      brand: 'ColorMaster Pro',
      stock_quantity: 28,
      images: ['https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000'],
      specifications: ['Pigmentação vegana', 'Aprovado ANVISA', '15 cores'],
      professional_only: true,
      ...createMockTimestamps()
    }
  ];

  private consultingServices: ConsultingService[] = [
    {
      id: '1',
      title: 'Consultoria de Gestão de Estúdio',
      description: 'Consultoria completa para otimização de processos e aumento de lucratividade.',
      type: 'consultoria',
      duration: '4 horas',
      price: 800,
      available_slots: ['2024-02-15', '2024-02-22', '2024-03-01'],
      requirements: ['Dados financeiros básicos', 'Estrutura atual do estúdio'],
      ...createMockTimestamps()
    },
    {
      id: '2',
      title: 'Workshop: Técnicas de Realismo',
      description: 'Workshop prático intensivo sobre técnicas avançadas de realismo em tatuagem.',
      type: 'workshop',
      duration: '8 horas (2 dias)',
      price: 1200,
      available_slots: ['2024-02-10-11', '2024-02-24-25'],
      requirements: ['Experiência mínima de 2 anos', 'Equipamentos próprios'],
      ...createMockTimestamps()
    }
  ];

  async getAll(): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  }

  async getById(id: string): Promise<any | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return null;
  }

  async fetchAll(): Promise<any[]> {
    return this.getAll();
  }

  async fetchById(id: string): Promise<any | null> {
    return this.getById(id);
  }

  async create(data: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...data, id: generateMockId(), ...createMockTimestamps() };
  }

  async update(id: string, data: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...data, id, updated_at: new Date().toISOString() };
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  async getPortfolioItems(artistId: string): Promise<TattooArtistPortfolioItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.portfolioItems.filter(item => item.artist_id === artistId);
  }

  async createPortfolioItem(artistId: string, item: Omit<TattooArtistPortfolioItem, 'id' | 'artist_id' | 'created_at' | 'updated_at'>): Promise<TattooArtistPortfolioItem> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newItem: TattooArtistPortfolioItem = {
      ...item,
      id: generateMockId(),
      artist_id: artistId,
      ...createMockTimestamps()
    };
    this.portfolioItems.push(newItem);
    return newItem;
  }

  async updatePortfolioItem(itemId: string, updates: Partial<TattooArtistPortfolioItem>): Promise<TattooArtistPortfolioItem> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.portfolioItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this.portfolioItems[index] = { ...this.portfolioItems[index], ...updates, updated_at: new Date().toISOString() };
      return this.portfolioItems[index];
    }
    throw new Error('Portfolio item not found');
  }

  async deletePortfolioItem(itemId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.portfolioItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this.portfolioItems.splice(index, 1);
      return true;
    }
    return false;
  }

  async getBlogPosts(artistId?: string): Promise<TattooArtistBlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (artistId) {
      return this.blogPosts.filter(post => post.artist_id === artistId);
    }
    return this.blogPosts;
  }

  async createBlogPost(artistId: string, post: Omit<TattooArtistBlogPost, 'id' | 'artist_id' | 'created_at' | 'updated_at'>): Promise<TattooArtistBlogPost> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPost: TattooArtistBlogPost = {
      ...post,
      id: generateMockId(),
      artist_id: artistId,
      ...createMockTimestamps()
    };
    this.blogPosts.push(newPost);
    return newPost;
  }

  async updateBlogPost(postId: string, updates: Partial<TattooArtistBlogPost>): Promise<TattooArtistBlogPost> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.blogPosts.findIndex(post => post.id === postId);
    if (index !== -1) {
      this.blogPosts[index] = { ...this.blogPosts[index], ...updates, updated_at: new Date().toISOString() };
      return this.blogPosts[index];
    }
    throw new Error('Blog post not found');
  }

  async deleteBlogPost(postId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.blogPosts.findIndex(post => post.id === postId);
    if (index !== -1) {
      this.blogPosts.splice(index, 1);
      return true;
    }
    return false;
  }

  async getProfessionalProducts(category?: string): Promise<ProfessionalProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    if (category) {
      return this.professionalProducts.filter(product => product.category === category);
    }
    return this.professionalProducts;
  }

  async getConsultingServices(): Promise<ConsultingService[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.consultingServices;
  }

  async requestConsulting(serviceId: string, clientData: any): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Consultoria solicitada:', { serviceId, clientData });
    return true;
  }
}

export const mockTattooArtistService = new MockTattooArtistService();
