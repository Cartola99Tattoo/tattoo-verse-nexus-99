
export interface Product {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Máquina Rotativa Premium Dragon X1",
    description: "Máquina rotativa profissional de alta precisão",
    detailedDescription: "A Máquina Rotativa Premium Dragon X1 representa o que há de mais avançado em tecnologia para tatuagem. Construída com materiais de primeira qualidade, oferece precisão milimétrica e controle total sobre o processo. O motor rotativo de alta performance garante movimentos suaves e consistentes, reduzindo a fadiga do tatuador e proporcionando maior conforto ao cliente.",
    price: 1299.99,
    originalPrice: 1599.99,
    category: "Máquinas",
    brand: "DragonTech",
    images: [
      "https://placehold.co/600x600/1a1a1a/ffffff?text=Máquina+Dragon+X1",
      "https://placehold.co/600x600/dc2626/ffffff?text=Vista+Lateral",
      "https://placehold.co/600x600/374151/ffffff?text=Detalhes"
    ],
    specifications: {
      "Voltagem": "110V - 220V",
      "Frequência": "50-60 Hz",
      "Peso": "180g",
      "Material": "Liga de alumínio aeronáutico",
      "Stroke": "3.5mm ajustável",
      "Conexão": "RCA padrão"
    },
    inStock: true,
    stockQuantity: 15,
    rating: 4.9,
    reviews: 156,
    isBestseller: true
  },
  {
    id: "2",
    name: "Kit Tintas Coloridas Professional 24 Cores",
    description: "Set completo com 24 cores vibrantes e duradouras",
    detailedDescription: "Kit profissional com 24 cores cuidadosamente selecionadas para oferecer máxima versatilidade ao tatuador. Fórmula vegana desenvolvida com pigmentos de alta qualidade que garantem cores vibrantes e duradouras. Todas as tintas são certificadas pela ANVISA e testadas dermatologicamente.",
    price: 489.99,
    originalPrice: 599.99,
    category: "Tintas",
    brand: "ColorPro",
    images: [
      "https://placehold.co/600x600/dc2626/ffffff?text=Kit+24+Cores",
      "https://placehold.co/600x600/1a1a1a/ffffff?text=Todas+as+Cores",
      "https://placehold.co/600x600/374151/ffffff?text=Qualidade"
    ],
    specifications: {
      "Quantidade": "24 cores x 30ml",
      "Fórmula": "Vegana",
      "Certificação": "ANVISA",
      "Validade": "3 anos",
      "Base": "Glicerina vegetal",
      "pH": "7.0 - 7.5"
    },
    inStock: true,
    stockQuantity: 28,
    rating: 4.8,
    reviews: 203,
    isNew: true
  },
  {
    id: "3",
    name: "Agulhas Descartáveis Sterile Pack 100un",
    description: "Pacote com 100 agulhas esterilizadas de alta qualidade",
    detailedDescription: "Agulhas descartáveis de alta precisão, fabricadas com aço inoxidável cirúrgico. Cada agulha é individualmente embalada e esterilizada por radiação gama, garantindo máxima segurança e higiene. Disponível em diversos tamanhos para diferentes tipos de trabalho.",
    price: 89.99,
    category: "Descartáveis",
    brand: "SafeNeedle",
    images: [
      "https://placehold.co/600x600/374151/ffffff?text=Agulhas+Sterile",
      "https://placehold.co/600x600/dc2626/ffffff?text=Embalagem",
      "https://placehold.co/600x600/1a1a1a/ffffff?text=Qualidade"
    ],
    specifications: {
      "Quantidade": "100 unidades",
      "Material": "Aço inoxidável cirúrgico",
      "Esterilização": "Radiação gama",
      "Tamanhos": "3RL, 5RL, 7RL, 9RL",
      "Embalagem": "Individual",
      "Certificação": "CE, ANVISA"
    },
    inStock: true,
    stockQuantity: 45,
    rating: 4.7,
    reviews: 89
  },
  {
    id: "4",
    name: "Fonte Digital Pro Power 2.0",
    description: "Fonte de energia digital com controle preciso",
    detailedDescription: "Fonte de energia digital de última geração com display LCD e controle preciso de voltagem. Equipada com proteção contra surtos e sistema de segurança integrado. Design compacto e ergonômico, ideal para uso profissional em estúdios de tatuagem.",
    price: 679.99,
    originalPrice: 849.99,
    category: "Equipamentos",
    brand: "PowerTech",
    images: [
      "https://placehold.co/600x600/1a1a1a/ffffff?text=Fonte+Digital",
      "https://placehold.co/600x600/dc2626/ffffff?text=Display+LCD",
      "https://placehold.co/600x600/374151/ffffff?text=Controles"
    ],
    specifications: {
      "Voltagem de Entrada": "110V - 240V",
      "Voltagem de Saída": "0-18V",
      "Display": "LCD digital",
      "Proteção": "Contra surtos",
      "Dimensões": "15x10x8cm",
      "Peso": "800g"
    },
    inStock: true,
    stockQuantity: 12,
    rating: 4.9,
    reviews: 134,
    isBestseller: true
  },
  {
    id: "5",
    name: "Kit Proteção Completo Studio Pro",
    description: "Kit completo de proteção para estúdio profissional",
    detailedDescription: "Kit de proteção completo para manter a segurança e higiene do seu estúdio. Inclui luvas de nitrilo, papel filme, máscaras descartáveis e álcool gel 70%. Todos os produtos são certificados e atendem às normas sanitárias mais rigorosas.",
    price: 129.99,
    category: "Proteção",
    brand: "SafeStudio",
    images: [
      "https://placehold.co/600x600/dc2626/ffffff?text=Kit+Proteção",
      "https://placehold.co/600x600/1a1a1a/ffffff?text=Itens+Inclusos",
      "https://placehold.co/600x600/374151/ffffff?text=Segurança"
    ],
    specifications: {
      "Luvas": "100 unidades nitrilo",
      "Papel Filme": "2 rolos 30cm",
      "Máscaras": "50 unidades descartáveis",
      "Álcool Gel": "500ml 70%",
      "Certificação": "ANVISA",
      "Validade": "2 anos"
    },
    inStock: true,
    stockQuantity: 35,
    rating: 4.6,
    reviews: 67
  },
  {
    id: "6",
    name: "Transfer Paper Professional A4 100fls",
    description: "Papel transfer profissional para transferência perfeita",
    detailedDescription: "Papel transfer de alta qualidade para transferência precisa de desenhos. Desenvolvido especialmente para uso profissional, garante transferência limpa sem borrões ou falhas. Compatível com todos os tipos de stencil e máquinas copiadoras.",
    price: 49.99,
    originalPrice: 69.99,
    category: "Materiais",
    brand: "TransferPro",
    images: [
      "https://placehold.co/600x600/374151/ffffff?text=Transfer+Paper",
      "https://placehold.co/600x600/dc2626/ffffff?text=Alta+Qualidade",
      "https://placehold.co/600x600/1a1a1a/ffffff?text=100+Folhas"
    ],
    specifications: {
      "Tamanho": "A4 (21x29.7cm)",
      "Quantidade": "100 folhas",
      "Gramatura": "18g/m²",
      "Cor": "Roxo",
      "Tipo": "Termal",
      "Compatibilidade": "Universal"
    },
    inStock: true,
    stockQuantity: 58,
    rating: 4.5,
    reviews: 45
  },
  {
    id: "7",
    name: "Grip Ergonômico Silicone Pro",
    description: "Grip profissional em silicone antiderrapante",
    detailedDescription: "Grip ergonômico desenvolvido para proporcionar máximo conforto durante longas sessões de tatuagem. Fabricado em silicone médico antiderrapante, oferece aderência perfeita e reduz a fadiga das mãos. Disponível em diferentes tamanhos e cores.",
    price: 39.99,
    category: "Acessórios",
    brand: "ComfortGrip",
    images: [
      "https://placehold.co/600x600/dc2626/ffffff?text=Grip+Silicone",
      "https://placehold.co/600x600/1a1a1a/ffffff?text=Ergonômico",
      "https://placehold.co/600x600/374151/ffffff?text=Antiderrapante"
    ],
    specifications: {
      "Material": "Silicone médico",
      "Tamanhos": "P, M, G",
      "Cores": "Preto, Vermelho, Azul",
      "Peso": "25g",
      "Diâmetro": "25mm",
      "Comprimento": "5cm"
    },
    inStock: true,
    stockQuantity: 42,
    rating: 4.4,
    reviews: 78
  },
  {
    id: "8",
    name: "Pomada Cicatrizante Tattoo Heal 50g",
    description: "Pomada profissional para cuidados pós-tatuagem",
    detailedDescription: "Pomada cicatrizante desenvolvida especificamente para cuidados pós-tatuagem. Fórmula com ingredientes naturais que aceleram a cicatrização, mantém a hidratação da pele e preserva as cores da tatuagem. Testada dermatologicamente e aprovada por tatuadores profissionais.",
    price: 24.99,
    category: "Cuidados",
    brand: "TattooHeal",
    images: [
      "https://placehold.co/600x600/1a1a1a/ffffff?text=Pomada+Heal",
      "https://placehold.co/600x600/dc2626/ffffff?text=Natural",
      "https://placehold.co/600x600/374151/ffffff?text=50g"
    ],
    specifications: {
      "Conteúdo": "50g",
      "Fórmula": "Natural",
      "pH": "5.5",
      "Ingredientes": "Pantenol, Aloe Vera, Vitamina E",
      "Uso": "3x ao dia",
      "Validade": "2 anos"
    },
    inStock: true,
    stockQuantity: 67,
    rating: 4.7,
    reviews: 123,
    isNew: true
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "Todos") return mockProducts;
  return mockProducts.filter(product => product.category === category);
};

export const getCategories = (): string[] => {
  const categories = ["Todos", ...new Set(mockProducts.map(product => product.category))];
  return categories;
};
