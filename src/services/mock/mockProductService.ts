import { IProductService } from "../interfaces/IProductService";

// Mock data for products
const mockProducts = [
  {
    id: "prod_1",
    name: "Tatuagem Blackwork",
    description: "Design minimalista em preto sólido.",
    price: 120.00,
    images: ["/images/products/blackwork.jpg"],
    category_id: "cat_1",
    artist_id: "artist_1",
    status: "available",
  },
  {
    id: "prod_2",
    name: "Tatuagem Tradicional",
    description: "Cores vibrantes e contornos marcados.",
    price: 150.00,
    images: ["/images/products/tradicional.jpg"],
    category_id: "cat_2",
    artist_id: "artist_2",
    status: "available",
  },
  {
    id: "prod_3",
    name: "Tatuagem Realista",
    description: "Detalhes incríveis que imitam a realidade.",
    price: 250.00,
    images: ["/images/products/realista.jpg"],
    category_id: "cat_3",
    artist_id: "artist_3",
    status: "unavailable",
  },
  {
    id: "prod_4",
    name: "Tatuagem Old School",
    description: "Estilo clássico com temas náuticos e águias.",
    price: 180.00,
    images: ["/images/products/oldschool.jpg"],
    category_id: "cat_4",
    artist_id: "artist_1",
    status: "limited",
  },
  {
    id: "prod_5",
    name: "Tatuagem New School",
    description: "Abordagem moderna com cores neon e cartoon.",
    price: 200.00,
    images: ["/images/products/newschool.jpg"],
    category_id: "cat_5",
    artist_id: "artist_2",
    status: "available",
  },
];

// Add the new CRUD methods to the mockProductService
export const mockProductService: IProductService = {
  async fetchProducts(options?: { category?: string; search?: string; limit?: number; offset?: number; userId?: string | undefined; }): Promise<any[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredProducts = [...mockProducts];

    // Apply category filter
    if (options?.category) {
      filteredProducts = filteredProducts.filter(product => product.category_id === options.category);
    }

    // Apply search filter
    if (options?.search) {
      const searchTerm = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description?.toLowerCase().includes(searchTerm) ?? false)
      );
    }

    // Apply limit and offset for pagination
    if (options?.limit) {
      const offset = options.offset || 0;
      filteredProducts = filteredProducts.slice(offset, offset + options.limit);
    }

    console.log("MockProductService: fetchProducts called with options:", options, "returning", filteredProducts.length, "products");
    return filteredProducts;
  },

  async fetchProductById(id: string | number): Promise<any | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const product = mockProducts.find(product => product.id === id);

    console.log("MockProductService: fetchProductById called with id:", id, "returning", product ? product.name : 'null');
    return product || null;
  },

  // New method for creating a product
  async createProduct(productData: any): Promise<any> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    console.log("MockProductService: createProduct called with data:", productData);
    
    // Generate a new ID for the product
    const newProduct = {
      id: `prod_${Math.random().toString(36).substring(2, 11)}`,
      ...productData,
      created_at: new Date().toISOString()
    };
    
    // Add the new product to the mockProducts array (in a real app, this would be stored in a database)
    mockProducts.push(newProduct);
    
    return newProduct;
  },
  
  // New method for updating a product
  async updateProduct(id: string | number, productData: any): Promise<any> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    console.log(`MockProductService: updateProduct called for id ${id} with data:`, productData);
    
    // Find the product by ID
    const productIndex = mockProducts.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    // Update the product
    const updatedProduct = {
      ...mockProducts[productIndex],
      ...productData,
      updated_at: new Date().toISOString()
    };
    
    mockProducts[productIndex] = updatedProduct;
    
    return updatedProduct;
  },
  
  // New method for deleting a product
  async deleteProduct(id: string | number): Promise<boolean> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    console.log(`MockProductService: deleteProduct called for id ${id}`);
    
    // Find the product by ID
    const productIndex = mockProducts.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    // Remove the product
    mockProducts.splice(productIndex, 1);
    
    return true;
  },
  
  async trackProductView(productId: string | number, userId?: string): Promise<void> {
    console.log(`MockProductService: trackProductView called for product ${productId} and user ${userId || 'anonymous'}`);
    // In a real app, this would track user interactions with products
  },
  
  async getRecommendedProducts(userId?: string, limit: number = 4): Promise<any[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    console.log(`MockProductService: getRecommendedProducts called for user ${userId || 'anonymous'} with limit ${limit}`);
    
    // In a real app, this would return personalized recommendations
    // For the mock, just return random products
    const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }
};
