
import { CRUDOperations } from '../base/BaseService';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  category_id?: string;
  artist_id?: string;
  status: 'available' | 'unavailable' | 'limited';
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  artist_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
  userId?: string;
}

export interface IProductService extends CRUDOperations<Product> {
  // Core CRUD
  fetchProducts(options?: ProductFilters): Promise<Product[]>;
  fetchProductById(id: string | number): Promise<Product | null>;
  createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
  updateProduct(id: string | number, productData: Partial<Product>): Promise<Product>;
  deleteProduct(id: string | number): Promise<boolean>;
  
  // Specialized methods
  trackProductView(productId: string | number, userId?: string): Promise<void>;
  getRecommendedProducts(userId?: string, limit?: number): Promise<Product[]>;
  
  // Image management
  uploadProductImage(productId: string, imageFile: File): Promise<string>;
  deleteProductImage(productId: string, imageUrl: string): Promise<void>;
  reorderProductImages(productId: string, imageUrls: string[]): Promise<void>;
}
