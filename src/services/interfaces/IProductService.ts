
export interface IProductService {
  fetchProducts(options?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
    userId?: string; // For tracking user-specific recommendations
  }): Promise<any[]>;
  
  fetchProductById(id: string | number): Promise<any | null>;
  
  createProduct(productData: any): Promise<any>;
  
  updateProduct(id: string | number, productData: any): Promise<any>;
  
  deleteProduct(id: string | number): Promise<boolean>;
  
  // Track user interactions with products
  trackProductView(productId: string | number, userId?: string): Promise<void>;
  
  // Get personalized recommendations based on user behavior
  getRecommendedProducts(userId?: string, limit?: number): Promise<any[]>;
}

// Product types for the tattoo studio
export type ProductType = 'tattoo' | 'product';
export type CategoryType = 'exclusive' | 'inspiration';
export type TattooStyle = 'Realismo' | 'Minimalista' | 'Old School' | 'Aquarela' | 'Outros';
export type TattooSize = 'Pequeno (até 10cm)' | 'Médio (10-20cm)' | 'Grande (20-30cm)' | 'Extra Grande (acima de 30cm)' | string;
export type BodyPart = 'Braço - Bíceps' | 'Braço - Antebraço' | 'Costas - Superior' | 'Costas - Inferior' | 
                     'Perna - Coxa' | 'Perna - Panturrilha' | 'Tornozelo' | 'Pé' | 'Costelas' | 
                     'Abdômen' | 'Pescoço' | 'Mão' | 'Pulso' | 'Ombro' | string;
export type PreferredTime = 'Manhã' | 'Tarde' | 'Noite' | 'Qualquer horário';

// Interface for tattoo-specific details
export interface TattooDetails {
  bodyPart?: BodyPart;
  size?: TattooSize;
  style?: TattooStyle;
  description?: string;
  estimatedTime?: string;
  estimatedSessions?: number;
  preferredArtist?: string;
  referenceImages?: string[];
}

// Interface for scheduling preferences
export interface SchedulingPreferences {
  preferredDates?: string[];
  preferredTime?: PreferredTime;
  isFlexible?: boolean;
  additionalNotes?: string;
}
