
export interface TattooArtist {
  id: string;
  name: string;
  bio: string;
  experience: string;
  location: {
    city: string;
    state: string;
    studio?: string;
  };
  specialties: string[];
  portfolio: PortfolioItem[];
  rating: number;
  reviews: number;
  avatar: string;
  stats: {
    rating: number;
    reviews: number;
    experience: number;
    worksCompleted: number;
  };
  isAvailable: boolean;
  contact: {
    phone: string;
    email: string;
    instagram: string;
    whatsapp: string;
  };
  studioQualification: StudioQualification;
  address?: {
    fullName: string;
    email: string;
    phone: string;
    zipCode: string;
    address: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  description: string;
  style: string;
  year: number;
}

export interface StudioQualification {
  studioSize: string;
  yearlyRevenue: string;
  clientManagement: string;
  financialControl: string;
  marketingApproach: string;
  digitalizationInterest: string;
  mainChallenges: string[];
  technologyComfort: string;
  growthGoals: string;
  investmentCapacity: string;
  teamSize: string;
  appointmentManagement: string;
  marketingChannels: string[];
  stockControl: string;
}

export const mockTattooArtists: TattooArtist[] = [
  {
    id: "1",
    name: "João Silva Santos",
    bio: "Especialista em tatuagens realistas e blackwork com mais de 8 anos de experiência. Formado pela Academy of Tattoo Arts e com certificações internacionais. Minha paixão pela arte da tatuagem começou ainda na adolescência, inspirado pelos grandes mestres do realismo. Hoje, busco transformar cada sessão em uma experiência única, criando peças que contam histórias e eternizam memórias.",
    experience: "8 anos",
    location: {
      city: "São Paulo",
      state: "SP",
      studio: "Black Art Studio"
    },
    specialties: ["Realismo", "Blackwork", "Sombreado", "Preto e Cinza", "Retratos"],
    rating: 4.9,
    reviews: 127,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    stats: {
      rating: 4.9,
      reviews: 127,
      experience: 8,
      worksCompleted: 450
    },
    isAvailable: true,
    contact: {
      phone: "(11) 99999-9999",
      email: "joao.silva@email.com",
      instagram: "@joaosilvatattoo",
      whatsapp: "11999999999"
    },
    address: {
      fullName: "João Silva Santos",
      email: "joao.silva@email.com",
      phone: "(11) 99999-9999",
      zipCode: "01310-100",
      address: "Av. Paulista, 1578",
      number: "1578",
      complement: "Sala 401",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
    },
    portfolio: [
      {
        id: "1",
        title: "Retrato Realista",
        image: "https://images.unsplash.com/photo-1564131072-6c4d41e23ba6?w=400&h=400&fit=crop",
        description: "Retrato realista em preto e cinza, técnica de sombreado avançada com 12 horas de trabalho",
        style: "Realismo",
        year: 2024
      },
      {
        id: "2",
        title: "Mandala Geométrica",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
        description: "Mandala complexa em blackwork com detalhes geométricos precisos e simbolismo espiritual",
        style: "Blackwork",
        year: 2024
      },
      {
        id: "3",
        title: "Leão Sombreado",
        image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?w=400&h=400&fit=crop",
        description: "Leão em técnica de sombreado realista, trabalho de 8 horas representando força e coragem",
        style: "Realismo",
        year: 2023
      },
      {
        id: "4",
        title: "Rosa Blackwork",
        image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop",
        description: "Rosa em estilo blackwork com elementos ornamentais únicos",
        style: "Blackwork",
        year: 2023
      },
      {
        id: "5",
        title: "Olho Realista",
        image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop",
        description: "Olho hiper-realista com reflexos e detalhes impressionantes",
        style: "Realismo",
        year: 2024
      },
      {
        id: "6",
        title: "Tribal Moderno",
        image: "https://images.unsplash.com/photo-1565058379802-bbe93b2b2a98?w=400&h=400&fit=crop",
        description: "Interpretação moderna do estilo tribal com elementos contemporâneos",
        style: "Blackwork",
        year: 2023
      }
    ],
    studioQualification: {
      studioSize: "Médio (3-5 tatuadores)",
      yearlyRevenue: "R$ 200.000 - R$ 500.000",
      clientManagement: "Agenda física + WhatsApp",
      financialControl: "Planilhas Excel",
      marketingApproach: "Instagram + indicações",
      digitalizationInterest: "Muito alto - Preciso modernizar urgentemente",
      mainChallenges: ["Gestão de agenda", "Controle financeiro", "Marketing digital"],
      technologyComfort: "Intermediário",
      growthGoals: "Expandir para 2 unidades nos próximos 2 anos",
      investmentCapacity: "R$ 10.000 - R$ 25.000",
      teamSize: "Médio (3-5 tatuadores)",
      appointmentManagement: "Agenda física + WhatsApp",
      marketingChannels: ["Instagram", "Indicações", "Facebook"],
      stockControl: "Não possui"
    }
  },
  {
    id: "2",
    name: "Maria Fernanda Costa",
    bio: "Artista especializada em tatuagens aquarela e fine line. Pioneira no Brasil em técnicas de aquarela realística. Formada em Artes Visuais pela UFRJ, trouxe para a tatuagem técnicas tradicionais de pintura, criando um estilo único que combina delicadeza e impacto visual. Cada trabalho é uma obra de arte pensada para durar toda a vida.",
    experience: "6 anos",
    location: {
      city: "Rio de Janeiro",
      state: "RJ",
      studio: "Aquarela Ink"
    },
    specialties: ["Aquarela", "Fine Line", "Floral", "Minimalista", "Cores Vibrantes"],
    rating: 4.8,
    reviews: 98,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c42c?w=200&h=200&fit=crop&crop=face",
    stats: {
      rating: 4.8,
      reviews: 98,
      experience: 6,
      worksCompleted: 320
    },
    isAvailable: false,
    contact: {
      phone: "(21) 98888-8888",
      email: "maria.costa@email.com",
      instagram: "@mariaaquarela",
      whatsapp: "21988888888"
    },
    address: {
      fullName: "Maria Fernanda Costa",
      email: "maria.costa@email.com",
      phone: "(21) 98888-8888",
      zipCode: "22071-100",
      address: "Av. Atlântica, 1702",
      number: "1702",
      complement: "Cobertura",
      neighborhood: "Copacabana",
      city: "Rio de Janeiro",
      state: "RJ",
    },
    portfolio: [
      {
        id: "7",
        title: "Flores Aquarela",
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
        description: "Composição floral em técnica aquarela com degradês únicos e cores vibrantes",
        style: "Aquarela",
        year: 2024
      },
      {
        id: "8",
        title: "Beija-flor Fine Line",
        image: "https://images.unsplash.com/photo-1596730018434-f2b4a4e73e8c?w=400&h=400&fit=crop",
        description: "Beija-flor delicado em traços finos com detalhes minimalistas",
        style: "Fine Line",
        year: 2024
      },
      {
        id: "9",
        title: "Borboleta Colorida",
        image: "https://images.unsplash.com/photo-1606830713264-f1b9f00a0e4d?w=400&h=400&fit=crop",
        description: "Borboleta em aquarela com explosão de cores e movimento",
        style: "Aquarela",
        year: 2023
      },
      {
        id: "10",
        title: "Mandala Fine Line",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
        description: "Mandala delicada em traços finos com precisão milimétrica",
        style: "Fine Line",
        year: 2023
      }
    ],
    studioQualification: {
      studioSize: "Pequeno (1-2 tatuadores)",
      yearlyRevenue: "R$ 100.000 - R$ 200.000",
      clientManagement: "Aplicativo próprio básico",
      financialControl: "Sistema ERP simples",
      marketingApproach: "Instagram + TikTok + parcerias",
      digitalizationInterest: "Alto - Quero melhorar o que já tenho",
      mainChallenges: ["Expansão da clientela", "Precificação", "Gestão de tempo"],
      technologyComfort: "Avançado",
      growthGoals: "Tornar-se referência nacional em aquarela",
      investmentCapacity: "R$ 5.000 - R$ 15.000",
      teamSize: "Pequeno (1-2 tatuadores)",
      appointmentManagement: "Aplicativo próprio básico",
      marketingChannels: ["Instagram", "TikTok", "Parcerias"],
      stockControl: "Planilha básica"
    }
  }
];

export const getTattooArtistById = (id: string): TattooArtist | undefined => {
  return mockTattooArtists.find(artist => artist.id === id);
};

export const getAllTattooArtists = (): TattooArtist[] => {
  return mockTattooArtists;
};
