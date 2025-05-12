
import { appConfig } from "@/config/appConfig";
import { IProductService } from "../interfaces/IProductService";
import { simulateNetworkDelay, simulateError } from "./mockUtils";

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Flash Tradicional Americana",
    description: "Design tradicional americano, perfeito para quem ama tatuagens clássicas.",
    price: 150.00,
    images: ["https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1887&auto=format&fit=crop"],
    category: "Flash",
    artist_id: "1",
    rating: 4.8,
    status: "available",
    profiles: {
      first_name: "André",
      last_name: "Silva"
    }
  },
  {
    id: "2",
    name: "Kit de Cuidados para Tatuagem",
    description: "Kit completo com produtos para cuidar da sua tattoo nos primeiros dias.",
    price: 89.90,
    images: ["https://images.unsplash.com/photo-1598971639058-a2335bde0a49?q=80&w=2148&auto=format&fit=crop"],
    category: "Cuidados",
    artist_id: null,
    rating: 4.5,
    status: "available",
    profiles: null
  },
  {
    id: "3",
    name: "Sessão de Design Personalizado",
    description: "Uma hora com nosso artista para criar o design perfeito para sua próxima tatuagem.",
    price: 200.00,
    images: ["https://images.unsplash.com/photo-1590246815107-56d48602592f?q=80&w=2148&auto=format&fit=crop"],
    category: "Serviços",
    artist_id: "2",
    rating: 5.0,
    status: "available",
    profiles: {
      first_name: "Mariana",
      last_name: "Costa"
    }
  }
];

// Mock product categories
const mockProductCategories = [
  { id: "1", name: "Flash" },
  { id: "2", name: "Cuidados" },
  { id: "3", name: "Serviços" },
  { id: "4", name: "Acessórios" }
];

// Mock ProductService implementation
export class MockProductService implements IProductService {
  async fetchProducts(options?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockProductService: fetchProducts called with options:", options);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch products");
    }
    
    let filteredProducts = [...mockProducts];
    
    // Apply category filter
    if (options?.category) {
      filteredProducts = filteredProducts.filter(
        product => product.category === options.category
      );
    }
    
    // Apply search filter
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) || 
          (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply pagination
    let paginatedProducts = filteredProducts;
    if (options?.offset !== undefined && options?.limit) {
      paginatedProducts = filteredProducts.slice(
        options.offset, 
        options.offset + options.limit
      );
    } else if (options?.limit) {
      paginatedProducts = filteredProducts.slice(0, options.limit);
    }
    
    return paginatedProducts;
  }

  async fetchProductById(id: string | number): Promise<any | null> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockProductService: fetchProductById called with id:", id);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch product");
    }
    
    return mockProducts.find(p => p.id === id) || null;
  }
}

// Export a singleton instance of the service
export const mockProductService = new MockProductService();
