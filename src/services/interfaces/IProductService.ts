
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
