
import { CRUDOperations } from '../base/BaseService';

export interface TattooArtistPortfolioItem {
  id: string;
  artist_id: string;
  title: string;
  description: string;
  image_url: string;
  style: string;
  category: string;
  completion_date: string;
  client_name?: string;
  session_duration?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface TattooArtistBlogPost {
  id: string;
  artist_id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image?: string;
  category: 'tecnicas' | 'cuidados' | 'tendencias' | 'negocios';
  status: 'draft' | 'published';
  published_at?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfessionalProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  professional_price: number;
  category: 'equipamentos' | 'tintas' | 'agulhas' | 'descartaveis' | 'acessorios';
  brand: string;
  stock_quantity: number;
  images: string[];
  specifications?: string[];
  professional_only: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConsultingService {
  id: string;
  title: string;
  description: string;
  type: 'consultoria' | 'treinamento' | 'workshop' | 'digitalizacao';
  duration: string;
  price: number;
  available_slots?: string[];
  requirements?: string[];
  created_at: string;
  updated_at: string;
}

export interface ITattooArtistService extends CRUDOperations<any> {
  // Portfolio methods
  getPortfolioItems(artistId: string): Promise<TattooArtistPortfolioItem[]>;
  createPortfolioItem(artistId: string, item: Omit<TattooArtistPortfolioItem, 'id' | 'artist_id' | 'created_at' | 'updated_at'>): Promise<TattooArtistPortfolioItem>;
  updatePortfolioItem(itemId: string, updates: Partial<TattooArtistPortfolioItem>): Promise<TattooArtistPortfolioItem>;
  deletePortfolioItem(itemId: string): Promise<boolean>;
  
  // Blog methods
  getBlogPosts(artistId?: string): Promise<TattooArtistBlogPost[]>;
  createBlogPost(artistId: string, post: Omit<TattooArtistBlogPost, 'id' | 'artist_id' | 'created_at' | 'updated_at'>): Promise<TattooArtistBlogPost>;
  updateBlogPost(postId: string, updates: Partial<TattooArtistBlogPost>): Promise<TattooArtistBlogPost>;
  deleteBlogPost(postId: string): Promise<boolean>;
  
  // Professional products methods
  getProfessionalProducts(category?: string): Promise<ProfessionalProduct[]>;
  
  // Consulting services methods
  getConsultingServices(): Promise<ConsultingService[]>;
  requestConsulting(serviceId: string, clientData: any): Promise<boolean>;
}
