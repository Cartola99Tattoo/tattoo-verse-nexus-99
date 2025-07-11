
import { IProductService, Product, ProductFilters } from "../interfaces/IProductService";

// Mock data for products
const mockProducts: Product[] = [
  {
    id: "prod_1",
    name: "Tatuagem Blackwork",
    description: "Design minimalista em preto sólido.",
    price: 120.00,
    images: ["/images/products/blackwork.jpg"],
    category_id: "cat_1",
    artist_id: "artist_1",
    status: "available",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockProductService: IProductService = {
  // Base CRUD operations
  async create(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const newProduct: Product = {
      ...productData,
      id: `prod_${Math.random().toString(36).substring(2, 11)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockProducts.push(newProduct);
    console.log("MockProductService: create called with data:", productData);
    return newProduct;
  },

  async fetchAll(options?: ProductFilters): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredProducts = [...mockProducts];

    if (options?.category) {
      filteredProducts = filteredProducts.filter(product => product.category_id === options.category);
    }

    if (options?.search) {
      const searchTerm = options.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description?.toLowerCase().includes(searchTerm) ?? false)
      );
    }

    if (options?.limit) {
      const offset = options.offset || 0;
      filteredProducts = filteredProducts.slice(offset, offset + options.limit);
    }

    console.log("MockProductService: fetchAll called with options:", options, "returning", filteredProducts.length, "products");
    return filteredProducts;
  },

  async fetchById(id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const product = mockProducts.find(product => product.id === id);
    console.log("MockProductService: fetchById called with id:", id, "returning", product ? product.name : 'null');
    return product || null;
  },

  async update(id: string, productData: Partial<Product>): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const productIndex = mockProducts.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    const updatedProduct: Product = {
      ...mockProducts[productIndex],
      ...productData,
      updated_at: new Date().toISOString()
    };
    
    mockProducts[productIndex] = updatedProduct;
    console.log(`MockProductService: update called for id ${id} with data:`, productData);
    return updatedProduct;
  },

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const productIndex = mockProducts.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    
    mockProducts.splice(productIndex, 1);
    console.log(`MockProductService: delete called for id ${id}`);
  },

  // IProductService specific methods
  async fetchProducts(options?: ProductFilters): Promise<Product[]> {
    return this.fetchAll(options);
  },

  async fetchProductById(id: string | number): Promise<Product | null> {
    return this.fetchById(String(id));
  },

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    return this.create(productData);
  },

  async updateProduct(id: string | number, productData: Partial<Product>): Promise<Product> {
    return this.update(String(id), productData);
  },

  async deleteProduct(id: string | number): Promise<boolean> {
    try {
      await this.delete(String(id));
      return true;
    } catch (error) {
      return false;
    }
  },
  
  async trackProductView(productId: string | number, userId?: string): Promise<void> {
    console.log(`MockProductService: trackProductView called for product ${productId} and user ${userId || 'anonymous'}`);
  },
  
  async getRecommendedProducts(userId?: string, limit: number = 4): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    console.log(`MockProductService: getRecommendedProducts called for user ${userId || 'anonymous'} with limit ${limit}`);
    
    const shuffled = [...mockProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  },

  async uploadProductImage(productId: string, imageFile: File): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('MockProductService: Uploading product image', productId, imageFile.name);
    
    const mockImageUrl = `/uploads/products/${productId}/${imageFile.name}`;
    return mockImageUrl;
  },

  async deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('MockProductService: Deleting product image', productId, imageUrl);
  },

  async reorderProductImages(productId: string, imageUrls: string[]): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log('MockProductService: Reordering product images', productId, imageUrls);
  }
};
