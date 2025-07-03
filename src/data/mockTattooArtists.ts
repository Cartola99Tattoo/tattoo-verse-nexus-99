
export interface TattooArtist {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  specialties: string[];
  location: {
    city: string;
    state: string;
    studio: string;
  };
  portfolio: {
    id: number;
    title: string;
    description: string;
    image: string;
    style: string;
  }[];
  contact: {
    whatsapp: string;
    instagram: string;
    email: string;
  };
  studioQualification: {
    teamSize: string;
    appointmentManagement: string;
    marketingChannels: string[];
    financialControl: string;
    stockControl: string;
    growthGoals: string;
    digitalizationInterest: string;
  };
  stats: {
    experience: number;
    worksCompleted: number;
    rating: number;
    reviews: number;
  };
  isAvailable: boolean;
}

const mockTattooArtists: TattooArtist[] = [
  {
    id: "1",
    name: "Carlos Silva",
    bio: "Especialista em realismo há mais de 10 anos. Meu trabalho é transformar memórias em arte permanente, capturando cada detalhe com precisão fotográfica. Acredito que cada tatuagem conta uma história única.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    specialties: ["Realismo", "Retrato", "Preto e Cinza", "Fine Line"],
    location: {
      city: "São Paulo",
      state: "SP",
      studio: "Ink Masters Studio"
    },
    portfolio: [
      {
        id: 1,
        title: "Retrato Realista",
        description: "Retrato em preto e cinza com técnica hiper-realista",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Retrato+Realista",
        style: "Realismo"
      },
      {
        id: 2,
        title: "Fine Line Floral",
        description: "Desenho delicado com traços finos e detalhes florais",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Fine+Line+Floral",
        style: "Fine Line"
      },
      {
        id: 3,
        title: "Retrato Pet",
        description: "Homenagem realista de animal de estimação",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Retrato+Pet",
        style: "Realismo"
      }
    ],
    contact: {
      whatsapp: "(11) 99999-1001",
      instagram: "@carlos_tattoo_sp",
      email: "carlos@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5",
      appointmentManagement: "Aplicativo de terceiros",
      marketingChannels: ["Instagram", "Google Meu Negócio", "Indicações"],
      financialControl: "Planilha Excel",
      stockControl: "Sim, de forma manual",
      growthGoals: "Aumentar valor por tatuagem",
      digitalizationInterest: "Alto"
    },
    stats: {
      experience: 10,
      worksCompleted: 450,
      rating: 4.9,
      reviews: 89
    },
    isAvailable: true
  },
  {
    id: "2",
    name: "Ana Costa",
    bio: "Apaixonada por tatuagens geométricas e mandálicas. Cada desenho é uma meditação visual que busca o equilíbrio perfeito entre precisão matemática e beleza artística.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b732?w=400&h=400&fit=crop&crop=face",
    specialties: ["Geométrico", "Mandala", "Blackwork", "Dotwork"],
    location: {
      city: "Rio de Janeiro",
      state: "RJ",
      studio: "Sacred Geometry Tattoo"
    },
    portfolio: [
      {
        id: 1,
        title: "Mandala Complexa",
        description: "Mandala intrincada com padrões geométricos simétricos",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Mandala+Complexa",
        style: "Geométrico"
      },
      {
        id: 2,
        title: "Blackwork Tribal",
        description: "Design tribal moderno em preto sólido",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Blackwork+Tribal",
        style: "Blackwork"
      },
      {
        id: 3,
        title: "Dotwork Floral",
        description: "Flores criadas com técnica de pontilhismo",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Dotwork+Floral",
        style: "Dotwork"
      }
    ],
    contact: {
      whatsapp: "(21) 99999-2002",
      instagram: "@ana_geometric_tattoo",
      email: "ana@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "1",
      appointmentManagement: "Sistema próprio",
      marketingChannels: ["Instagram", "TikTok", "Site Próprio"],
      financialControl: "Software financeiro",
      stockControl: "Sim, com software",
      growthGoals: "Otimizar gestão",
      digitalizationInterest: "Muito Alto"
    },
    stats: {
      experience: 7,
      worksCompleted: 320,
      rating: 4.8,
      reviews: 64
    },
    isAvailable: false
  },
  {
    id: "3",
    name: "Roberto Alves",
    bio: "Veterano do Old School com 15 anos de experiência. Mantenho viva a tradição da tatuagem americana clássica, sempre com cores vibrantes e traços marcantes que resistem ao tempo.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    specialties: ["Old School", "Tradicional Americana", "Neo-Tradicional", "Colorido"],
    location: {
      city: "Belo Horizonte",
      state: "MG",
      studio: "Classic Ink Parlor"
    },
    portfolio: [
      {
        id: 1,
        title: "Pin-up Clássica",
        description: "Pin-up no estilo tradicional americano com cores vibrantes",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Pin-up+Classica",
        style: "Old School"
      },
      {
        id: 2,
        title: "Âncora Marinheiro",
        description: "Design clássico de âncora com banner e rosas",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Ancora+Marinheiro",
        style: "Tradicional Americana"
      },
      {
        id: 3,
        title: "Rosa Neo-Tradicional",
        description: "Rosa com técnica neo-tradicional e sombreamento moderno",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Rosa+Neo-Tradicional",
        style: "Neo-Tradicional"
      }
    ],
    contact: {
      whatsapp: "(31) 99999-3003",
      instagram: "@roberto_oldschool",
      email: "roberto@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "6-10",
      appointmentManagement: "Planilha Excel",
      marketingChannels: ["Instagram", "Indicações", "Google Meu Negócio"],
      financialControl: "Contador externo",
      stockControl: "Sim, de forma manual",
      growthGoals: "Expandir equipe",
      digitalizationInterest: "Médio"
    },
    stats: {
      experience: 15,
      worksCompleted: 780,
      rating: 4.7,
      reviews: 156
    },
    isAvailable: true
  },
  {
    id: "4",
    name: "Marina Santos",
    bio: "Especialista em aquarela e técnicas delicadas. Transformo a pele em uma tela para criar obras de arte únicas, inspiradas na natureza e nas emoções mais profundas.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    specialties: ["Aquarela", "Fine Line", "Minimalista", "Natureza"],
    location: {
      city: "Florianópolis",
      state: "SC",
      studio: "Watercolor Dreams"
    },
    portfolio: [
      {
        id: 1,
        title: "Flores Aquarela",
        description: "Buquê de flores com técnica de aquarela",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Flores+Aquarela",
        style: "Aquarela"
      },
      {
        id: 2,
        title: "Pássaro Minimalista",
        description: "Silhueta de pássaro com traços delicados",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Passaro+Minimalista",
        style: "Minimalista"
      },
      {
        id: 3,
        title: "Paisagem Aquarela",
        description: "Montanhas com efeito de aquarela e degradê",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Paisagem+Aquarela",
        style: "Aquarela"
      }
    ],
    contact: {
      whatsapp: "(48) 99999-4004",
      instagram: "@marina_watercolor",
      email: "marina@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5",
      appointmentManagement: "Aplicativo de terceiros",
      marketingChannels: ["Instagram", "TikTok"],
      financialControl: "Planilha Excel",
      stockControl: "Não",
      growthGoals: "Aumentar número de clientes",
      digitalizationInterest: "Alto"
    },
    stats: {
      experience: 5,
      worksCompleted: 180,
      rating: 4.9,
      reviews: 42
    },
    isAvailable: true
  },
  {
    id: "5",
    name: "Lucas Ferreira",
    bio: "Especialista em biomecânico e ficção científica. Cada peça é uma jornada futurística, mesclando elementos orgânicos e mecânicos em composições que desafiam a realidade.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    specialties: ["Biomecânico", "Ficção Científica", "3D", "Preto e Cinza"],
    location: {
      city: "Porto Alegre",
      state: "RS",
      studio: "Cyber Ink Studio"
    },
    portfolio: [
      {
        id: 1,
        title: "Braço Biomecânico",
        description: "Braço com elementos mecânicos integrados à pele",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Braco+Biomecanico",
        style: "Biomecânico"
      },
      {
        id: 2,
        title: "Olho Robótico",
        description: "Olho com circuitos e elementos futuristas",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Olho+Robotico",
        style: "Ficção Científica"
      },
      {
        id: 3,
        title: "Coração Mecânico",
        description: "Coração anatômico com partes mecânicas",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Coracao+Mecanico",
        style: "Biomecânico"
      }
    ],
    contact: {
      whatsapp: "(51) 99999-5005",
      instagram: "@lucas_biomech",
      email: "lucas@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5",
      appointmentManagement: "Sistema próprio",
      marketingChannels: ["Instagram", "Site Próprio", "Indicações"],
      financialControl: "Software financeiro",
      stockControl: "Sim, com software",
      growthGoals: "Aumentar valor por tatuagem",
      digitalizationInterest: "Muito Alto"
    },
    stats: {
      experience: 8,
      worksCompleted: 340,
      rating: 4.8,
      reviews: 73
    },
    isAvailable: false
  }
];

export const getAllTattooArtists = (): TattooArtist[] => mockTattooArtists;

export const getTattooArtistById = (id: string): TattooArtist | undefined => {
  return mockTattooArtists.find(artist => artist.id === id);
};
