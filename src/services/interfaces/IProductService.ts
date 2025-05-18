
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

// Tipo de produto
export type ProductType = 'tattoo' | 'product';

// Tipo de categoria para tatuagens
export type TattooCategoryType = 'exclusive' | 'inspiration';

// Modelo expandido de produto
export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category_id?: string;
  artist_id?: string;
  status: string;
  product_type?: ProductType;
  category_type?: TattooCategoryType;
  package_size?: string;
  weight?: string;
  average_time?: string;
  sizes?: string[];
  body_locations?: string[];
  style_tags?: string[];
}
