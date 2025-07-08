import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  artist: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  detailedDescription?: string;
  specifications?: string[];
  badge?: string;
  favorited: boolean;
  stock: number;
  gallery?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

interface TattooArtistShopContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: number) => boolean;
  getProduct: (productId: number) => Product | undefined;
}

const TattooArtistShopContext = createContext<TattooArtistShopContextType | undefined>(undefined);

export const useTattooArtistShop = () => {
  const context = useContext(TattooArtistShopContext);
  if (!context) {
    throw new Error('useTattooArtistShop must be used within a TattooArtistShopProvider');
  }
  return context;
};

interface TattooArtistShopProviderProps {
  children: ReactNode;
}

export const TattooArtistShopProvider: React.FC<TattooArtistShopProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Dados Mock Expandidos - Produtos Diversificados para Tatuadores
  const products: Product[] = [
    // Máquinas de Tatuagem
    {
      id: 1,
      name: "Máquina Rotativa ProArt X1",
      artist: "ProArt Equipment",
      price: 1299.90,
      originalPrice: 1499.90,
      category: "machines",
      image: "https://placehold.co/400x300/dc2626/ffffff?text=Máquina+Rotativa",
      rating: 4.9,
      reviews: 234,
      description: "Máquina rotativa profissional com motor japonês de alta performance",
      detailedDescription: "A Máquina Rotativa ProArt X1 é a escolha perfeita para tatuadores profissionais que buscam precisão e conforto. Equipada com motor japonês de alta qualidade, oferece vibração mínima e torque constante para linhas perfeitas e sombreados suaves.",
      specifications: ["Motor japonês 10.000 RPM", "Peso: 180g", "Voltagem: 6-12V", "Cabo RCA incluído", "Garantia: 2 anos"],
      badge: "Mais Vendido",
      favorited: true,
      stock: 15,
      gallery: ["https://placehold.co/400x300/dc2626/ffffff?text=Máquina+1", "https://placehold.co/400x300/dc2626/ffffff?text=Máquina+2"]
    },
    {
      id: 2,
      name: "Máquina de Bobina Traditional",
      artist: "Old School Tattoo",
      price: 899.90,
      originalPrice: null,
      category: "machines",
      image: "https://placehold.co/400x300/000000/ffffff?text=Máquina+Bobina",
      rating: 4.7,
      reviews: 156,
      description: "Máquina de bobina tradicional feita à mão por artesãos especializados",
      detailedDescription: "Máquina de bobina tradicional construída com técnicas artesanais tradicionais. Ideal para linhas e sombreados tradicionais, oferece o controle clássico que muitos tatuadores experientes preferem.",
      specifications: ["10 wraps", "Peso: 220g", "Frame de ferro fundido", "Molas ajustáveis", "Garantia: 1 ano"],
      badge: "Tradicional",
      favorited: false,
      stock: 8,
      gallery: ["https://placehold.co/400x300/000000/ffffff?text=Bobina+1", "https://placehold.co/400x300/000000/ffffff?text=Bobina+2"]
    },
    
    // Tintas
    {
      id: 3,
      name: "Set de Tintas Premium - 12 Cores",
      artist: "ColorMaster",
      price: 459.90,
      originalPrice: 549.90,
      category: "inks",
      image: "https://placehold.co/400x300/dc2626/ffffff?text=Tintas+Premium",
      rating: 4.8,
      reviews: 189,
      description: "Kit completo com 12 cores vibrantes e duradouras para tatuagem profissional",
      detailedDescription: "Set profissional com as 12 cores mais utilizadas em tatuagem. Fórmula exclusiva com pigmentos de alta qualidade que garantem cores vibrantes e durabilidade excepcional.",
      specifications: ["12 cores de 30ml cada", "Pigmentos alemães", "Livre de metais pesados", "Esterilizado por raios gama", "Validade: 5 anos"],
      badge: "Profissional",
      favorited: true,
      stock: 23,
      gallery: ["https://placehold.co/400x300/dc2626/ffffff?text=Tintas+1", "https://placehold.co/400x300/dc2626/ffffff?text=Tintas+2"]
    },
    {
      id: 4,
      name: "Tinta Preta Outliner 60ml",
      artist: "BlackLine Pro",
      price: 89.90,
      originalPrice: null,
      category: "inks",
      image: "https://placehold.co/400x300/000000/ffffff?text=Tinta+Preta",
      rating: 4.9,
      reviews: 412,
      description: "Tinta preta premium especial para contornos e linhas definidas",
      detailedDescription: "A tinta preta mais vendida entre profissionais. Formulação especial para contornos precisos e linhas definidas, com consistência perfeita e secagem rápida.",
      specifications: ["Volume: 60ml", "Pigmento carbon black", "Consistência ideal para linhas", "Esterilizada", "Vegana"],
      badge: "Best Seller",
      favorited: true,
      stock: 47,
      gallery: ["https://placehold.co/400x300/000000/ffffff?text=Preta+1", "https://placehold.co/400x300/000000/ffffff?text=Preta+2"]
    },

    // Agulhas
    {
      id: 5,
      name: "Agulhas Descartáveis - Kit Misto",
      artist: "SterilePro",
      price: 124.90,
      originalPrice: 149.90,
      category: "needles",
      image: "https://placehold.co/400x300/dc2626/ffffff?text=Agulhas+Kit",
      rating: 4.8,
      reviews: 298,
      description: "Kit com 50 agulhas descartáveis em configurações variadas",
      detailedDescription: "Kit profissional com agulhas descartáveis em diversas configurações. Ideal para ter sempre a agulha certa para cada tipo de trabalho.",
      specifications: ["50 unidades", "Configurações: RL, RS, M1, M2", "Aço inoxidável", "Esterilizadas individualmente", "Embalagem selada"],
      badge: "Kit Completo",
      favorited: false,
      stock: 34,
      gallery: ["https://placehold.co/400x300/dc2626/ffffff?text=Agulhas+1", "https://placehold.co/400x300/dc2626/ffffff?text=Agulhas+2"]
    },

    // Cursos
    {
      id: 6,
      name: "Curso Online: Realismo Avançado",
      artist: "Mestre Carlos Artwork",
      price: 497.00,
      originalPrice: 697.00,
      category: "courses",
      image: "https://placehold.co/400x300/dc2626/ffffff?text=Curso+Realismo",
      rating: 4.9,
      reviews: 87,
      description: "Curso completo de tatuagem realista com técnicas avançadas",
      detailedDescription: "Aprenda as técnicas mais avançadas de tatuagem realista com um dos mestres mais reconhecidos do Brasil. Curso com mais de 40 horas de conteúdo prático e teórico.",
      specifications: ["40h de conteúdo", "Certificado incluso", "Acesso vitalício", "Suporte direto com instrutor", "Material de apoio PDF"],
      badge: "Novo",
      favorited: true,
      stock: 999,
      gallery: ["https://placehold.co/400x300/dc2626/ffffff?text=Curso+1", "https://placehold.co/400x300/dc2626/ffffff?text=Curso+2"]
    },
    {
      id: 7,
      name: "Workshop Presencial - Técnicas Japonesas",
      artist: "Sensei Takeshi",
      price: 1200.00,
      originalPrice: null,
      category: "courses",
      image: "https://placehold.co/400x300/000000/ffffff?text=Workshop+JP",
      rating: 5.0,
      reviews: 34,
      description: "Workshop exclusivo com técnicas tradicionais japonesas",
      detailedDescription: "Workshop presencial exclusivo com Sensei Takeshi, mestre em técnicas tradicionais japonesas. Aprenda os segredos da tatuagem oriental tradicional.",
      specifications: ["2 dias intensivos", "Máximo 10 alunos", "Material incluso", "Certificado de participação", "Localização: São Paulo"],
      badge: "Exclusivo",
      favorited: false,
      stock: 3,
      gallery: ["https://placehold.co/400x300/000000/ffffff?text=Workshop+1", "https://placehold.co/400x300/000000/ffffff?text=Workshop+2"]
    },

    // Software
    {
      id: 8,
      name: "TattooManager Pro - Licença Anual",
      artist: "TechTattoo Solutions",
      price: 299.90,
      originalPrice: 399.90,
      category: "software",
      image: "https://placehold.co/400x300/dc2626/ffffff?text=Software+Pro",
      rating: 4.6,
      reviews: 145,
      description: "Software completo para gestão de estúdio de tatuagem",
      detailedDescription: "Sistema completo para gerenciar seu estúdio: agendamentos, controle financeiro, portfólio digital, CRM de clientes e muito mais.",
      specifications: ["Gestão de agendamentos", "Controle financeiro", "CRM de clientes", "Portfólio digital", "Relatórios avançados"],
      badge: "Desconto",
      favorited: false,
      stock: 999,
      gallery: ["https://placehold.co/400x300/dc2626/ffffff?text=Software+1", "https://placehold.co/400x300/dc2626/ffffff?text=Software+2"]
    },

    // Designs
    {
      id: 9,
      name: "Pack Designs Tribais - 50 Desenhos",
      artist: "Tribal Master",
      price: 149.90,
      originalPrice: null,
      category: "designs",
      image: "https://placehold.co/400x300/000000/ffffff?text=Designs+Tribais",
      rating: 4.7,
      reviews: 203,
      description: "Coleção exclusiva com 50 designs tribais únicos",
      detailedDescription: "Coleção exclusiva com 50 designs tribais únicos, criados especialmente para tatuadores profissionais. Arquivos em alta resolução para impressão perfeita.",
      specifications: ["50 designs únicos", "Alta resolução", "Formatos: PDF, PNG, SVG", "Licença comercial", "Download imediato"],
      badge: "Digital",
      favorited: true,
      stock: 999,
      gallery: ["https://placehold.co/400x300/000000/ffffff?text=Tribal+1", "https://placehold.co/400x300/000000/ffffff?text=Tribal+2"]
    },

    // Acessórios
    {
      id: 10,
      name: "Luvas Nitrílicas Premium - Caixa 100un",
      artist: "SafeHands",
      price: 89.90,
      originalPrice: null,
      category: "accessories",
      image: "https://placehold.co/400x300/dc2626/ffffff?text=Luvas+Premium",
      rating: 4.8,
      reviews: 167,
      description: "Luvas nitrílicas de alta qualidade para proteção profissional",
      detailedDescription: "Luvas nitrílicas de alta qualidade, livres de latex e pó. Oferecem proteção superior e tato preciso para trabalhos de tatuagem.",
      specifications: ["100 unidades", "Sem látex e sem pó", "Textura antiderrapante", "Tamanhos: P, M, G, GG", "Certificação CE"],
      badge: null,
      favorited: false,
      stock: 89,
      gallery: ["https://placehold.co/400x300/dc2626/ffffff?text=Luvas+1", "https://placehold.co/400x300/dc2626/ffffff?text=Luvas+2"]
    },

    // Produtos Exclusivos 99Tattoo
    {
      id: 11,
      name: "Camiseta 99Tattoo - Edição Limitada",
      artist: "99Tattoo Official",
      price: 89.90,
      originalPrice: 120.00,
      category: "clothing",
      image: "https://placehold.co/400x300/dc2626/ffffff?text=Camiseta+99",
      rating: 4.7,
      reviews: 234,
      description: "Camiseta premium com design exclusivo da comunidade 99Tattoo",
      detailedDescription: "Camiseta premium 100% algodão com design exclusivo da comunidade 99Tattoo. Edição limitada para tatuadores da nova era.",
      specifications: ["100% algodão premium", "Design exclusivo", "Tamanhos: P ao GG", "Impressão resistente", "Edição limitada"],
      badge: "Limitado",
      favorited: true,
      stock: 42,
      gallery: ["https://placehold.co/400x300/dc2626/ffffff?text=Camiseta+1", "https://placehold.co/400x300/dc2626/ffffff?text=Camiseta+2"]
    },

    // Consultoria
    {
      id: 12,
      name: "Consultoria de Marketing Digital - 1h",
      artist: "Marketing Tattoo Expert",
      price: 197.00,
      originalPrice: null,
      category: "services",
      image: "https://placehold.co/400x300/000000/ffffff?text=Consultoria+MKT",
      rating: 4.9,
      reviews: 78,
      description: "Consultoria especializada em marketing digital para tatuadores",
      detailedDescription: "Sessão de consultoria individual focada em estratégias de marketing digital específicas para tatuadores. Aprenda a conquistar mais clientes online.",
      specifications: ["1 hora de consultoria", "Estratégias personalizadas", "Material de apoio", "Gravação da sessão", "Suporte pós-consultoria"],
      badge: "Personalizado",
      favorited: false,
      stock: 999,
      gallery: ["https://placehold.co/400x300/000000/ffffff?text=Consultoria+1", "https://placehold.co/400x300/000000/ffffff?text=Consultoria+2"]
    }
  ];

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: number) => {
    return cart.some(item => item.id === productId);
  };

  const getProduct = (productId: number) => {
    return products.find(product => product.id === productId);
  };

  const value = {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    getProduct
  };

  return (
    <TattooArtistShopContext.Provider value={value}>
      {children}
    </TattooArtistShopContext.Provider>
  );
};