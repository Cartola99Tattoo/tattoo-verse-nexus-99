
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

// Store user product views for recommendations
const userProductViews: Record<string, Record<string, number>> = {};

// Mock ProductService implementation
export class MockProductService implements IProductService {
  async fetchProducts(options?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
    userId?: string;
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

  // New method to track product views
  async trackProductView(productId: string | number, userId?: string): Promise<void> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockProductService: trackProductView called with productId:", productId, "userId:", userId);
    }
    
    // If we don't have a userId, we can't track the view
    if (!userId) return;
    
    // Initialize user's product views if they don't exist
    if (!userProductViews[userId]) {
      userProductViews[userId] = {};
    }
    
    // Increment the view count for this product
    userProductViews[userId][productId.toString()] = 
      (userProductViews[userId][productId.toString()] || 0) + 1;
    
    return Promise.resolve();
  }

  // New method to get recommended products based on user history
  async getRecommendedProducts(userId?: string, limit: number = 3): Promise<any[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockProductService: getRecommendedProducts called with userId:", userId);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch recommended products");
    }
    
    // If no userId is provided, return random products
    if (!userId || !userProductViews[userId]) {
      return this.getRandomProducts(limit);
    }
    
    // Get the user's product view history
    const viewHistory = userProductViews[userId];
    
    // Find the most viewed categories
    const categoryViewCounts: Record<string, number> = {};
    for (const productId in viewHistory) {
      const product = mockProducts.find(p => p.id === productId);
      if (product && product.category) {
        categoryViewCounts[product.category] = 
          (categoryViewCounts[product.category] || 0) + viewHistory[productId];
      }
    }
    
    // Sort categories by view count
    const sortedCategories = Object.entries(categoryViewCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // If no categories have been viewed, return random products
    if (sortedCategories.length === 0) {
      return this.getRandomProducts(limit);
    }
    
    // Filter products that match the most viewed categories
    // but exclude products that the user has already viewed
    const viewedProductIds = Object.keys(viewHistory);
    let recommendedProducts = mockProducts.filter(product => 
      sortedCategories.includes(product.category) && 
      !viewedProductIds.includes(product.id)
    );
    
    // If we don't have enough recommendations, add some random products
    if (recommendedProducts.length < limit) {
      const randomProducts = this.getRandomProducts(limit - recommendedProducts.length, viewedProductIds);
      recommendedProducts = [...recommendedProducts, ...randomProducts];
    }
    
    // Limit to the requested number
    return recommendedProducts.slice(0, limit);
  }

  // Helper method to get random products
  private getRandomProducts(limit: number, excludeIds: string[] = []): any[] {
    const availableProducts = mockProducts.filter(p => !excludeIds.includes(p.id));
    const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }
}

// Export a singleton instance of the service
export const mockProductService = new MockProductService();
