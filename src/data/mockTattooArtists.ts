export interface TattooArtist {
  id: string;
  name: string;
  bio: string;
  experience: string;
  location: string;
  specialties: string[];
  portfolio: PortfolioItem[];
  rating: number;
  reviews: number;
  contact: {
    phone: string;
    email: string;
    instagram: string;
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
}

export const mockTattooArtists: TattooArtist[] = [
  {
    id: "1",
    name: "João Silva Santos",
    bio: "Especialista em tatuagens realistas e blackwork com mais de 8 anos de experiência. Formado pela Academy of Tattoo Arts e com certificações internacionais.",
    experience: "8 anos",
    location: "São Paulo, SP",
    specialties: ["Realismo", "Blackwork", "Sombreado"],
    rating: 4.9,
    reviews: 127,
    contact: {
      phone: "(11) 99999-9999",
      email: "joao.silva@email.com",
      instagram: "@joaosilvatattoo"
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
        image: "https://placehold.co/400x400/1a1a1a/ffffff?text=Retrato+Realista",
        description: "Retrato realista em preto e cinza, técnica de sombreado avançada",
        style: "Realismo",
        year: 2024
      },
      {
        id: "2",
        title: "Mandala Geométrica",
        image: "https://placehold.co/400x400/dc2626/ffffff?text=Mandala+Blackwork",
        description: "Mandala complexa em blackwork com detalhes geométricos precisos",
        style: "Blackwork",
        year: 2024
      },
      {
        id: "3",
        title: "Leão Sombreado",
        image: "https://placehold.co/400x400/374151/ffffff?text=Leão+Realista",
        description: "Leão em técnica de sombreado realista, trabalho de 8 horas",
        style: "Realismo",
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
      investmentCapacity: "R$ 10.000 - R$ 25.000"
    }
  },
  {
    id: "2",
    name: "Maria Fernanda Costa",
    bio: "Artista especializada em tatuagens aquarela e fine line. Pioneira no Brasil em técnicas de aquarela realística.",
    experience: "6 anos",
    location: "Rio de Janeiro, RJ",
    specialties: ["Aquarela", "Fine Line", "Floral"],
    rating: 4.8,
    reviews: 98,
    contact: {
      phone: "(21) 98888-8888",
      email: "maria.costa@email.com",
      instagram: "@mariaaquarela"
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
        id: "4",
        title: "Flores Aquarela",
        image: "https://placehold.co/400x400/dc2626/ffffff?text=Flores+Aquarela",
        description: "Composição floral em técnica aquarela com degradês únicos",
        style: "Aquarela",
        year: 2024
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
      investmentCapacity: "R$ 5.000 - R$ 15.000"
    }
  }
];

export const getTattooArtistById = (id: string): TattooArtist | undefined => {
  return mockTattooArtists.find(artist => artist.id === id);
};
