
export interface IProductService {
  fetchProducts(options?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]>;
  fetchProductById(id: string | number): Promise<any | null>;
}
