
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
  spinDiagnostic: SpinDiagnostic;
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

export interface SpinDiagnostic {
  situation: {
    tattoosPerWeek: string;
    schedulingMethod: string;
    hasWebsite: string;
    clientSource: string;
    clientSourceOther?: string;
    hasAfterSales: string;
    budgetProcess: string;
    studioSetup: string;
    studioLocation: string;
  };
  problems: {
    lostClientsOrganization: string;
    timeWastedRepeatingAnswers: string;
    budgetWithoutReturn: string;
    clientsSeekingPrice: string;
    pricingDifficulty: string;
    frustratedWithCompetition: string;
    dependsOnInstagram: string;
  };
  implications: {
    clientAbsenceImpact: string;
    timeWastedPerWeek: string;
    incomeAndEnergyImpact: string;
    instagramDependencyRisk: string;
    moneyLostEstimate: string;
    professionalImageImpact: string;
    thoughtAboutQuitting: string;
  };
  needs: {
    automaticSystemImpact: string;
    fullAgendaValue: string;
    digitalizedStudioMeaning: string;
    wantToBeReference: string;
    professionalSupport24h: string;
    dedicatedTeamDifference: string;
  };
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
    spinDiagnostic: {
      situation: {
        tattoosPerWeek: "6-10",
        schedulingMethod: "WhatsApp",
        hasWebsite: "Não",
        clientSource: "Redes sociais",
        hasAfterSales: "Sim, de forma esporádica",
        budgetProcess: "Respondo pessoalmente via DM/WhatsApp",
        studioSetup: "Divido estúdio com 3 outros tatuadores",
        studioLocation: "Movimento moderado (galeria, rua secundária)"
      },
      problems: {
        lostClientsOrganization: "Sim, ocasionalmente",
        timeWastedRepeatingAnswers: "Sim, muito tempo",
        budgetWithoutReturn: "Mais de 10 vezes",
        clientsSeekingPrice: "Alguns buscam preço, outros valorizam a arte",
        pricingDifficulty: "Sim, foi bem difícil",
        frustratedWithCompetition: "Sim, muito frustrado",
        dependsOnInstagram: "Sim, é a principal"
      },
      implications: {
        clientAbsenceImpact: "Perco o dia de trabalho e a renda daquele horário, o que impacta o faturamento do mês.",
        timeWastedPerWeek: "5-10 horas",
        incomeAndEnergyImpact: "Minha renda fica instável e sinto que não tenho tempo para praticar novos estilos ou descansar.",
        instagramDependencyRisk: "Minha captação de clientes despencaria e eu não saberia como encontrar novos, seria um caos.",
        moneyLostEstimate: "Muito, acredito que mais de R$ 2.000",
        professionalImageImpact: "Às vezes, parece que sou menos profissional. Gostaria de ser visto como referência na minha área, mas a falta de tempo atrapalha.",
        thoughtAboutQuitting: "Já passou pela cabeça"
      },
      needs: {
        automaticSystemImpact: "Seria um alívio enorme! Poderia focar mais na arte e menos na burocracia, além de atrair clientes mais alinhados.",
        fullAgendaValue: "Seria a realização de um sonho. Significaria que meu trabalho está sendo verdadeiramente reconhecido e valorizado.",
        digitalizedStudioMeaning: "Representaria um salto de nível profissional. Acredito que dobraria meu faturamento e eu teria muito mais controle sobre o negócio.",
        wantToBeReference: "Sim, é meu maior desejo",
        professionalSupport24h: "Ajudaria imensamente, resolveria muitos problemas",
        dedicatedTeamDifference: "Seria um divisor de águas. Minha criatividade fluiria mais e eu poderia aceitar projetos maiores e mais desafiadores."
      }
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
    spinDiagnostic: {
      situation: {
        tattoosPerWeek: "11-15",
        schedulingMethod: "Agenda digital (Google Calendar/etc.)",
        hasWebsite: "Sim",
        clientSource: "Indicação de amigos/clientes",
        clientSourceOther: "Feiras de tatuagem",
        hasAfterSales: "Sim, bem estruturado",
        budgetProcess: "Tenho mensagens prontas",
        studioSetup: "Trabalho sozinha (estúdio próprio)",
        studioLocation: "Grande movimento (rua principal, shopping)"
      },
      problems: {
        lostClientsOrganization: "Raramente",
        timeWastedRepeatingAnswers: "Um pouco",
        budgetWithoutReturn: "1-4 vezes",
        clientsSeekingPrice: "Geralmente valorizam a arte",
        pricingDifficulty: "Não tive dificuldade",
        frustratedWithCompetition: "Um pouco",
        dependsOnInstagram: "Não, tenho outras fontes"
      },
      implications: {
        clientAbsenceImpact: "Consigo reagendar rapidamente, mas ainda assim afeta o planejamento do dia.",
        timeWastedPerWeek: "1-4 horas",
        incomeAndEnergyImpact: "Tenho conseguido manter uma renda estável, mas poderia ser mais eficiente.",
        instagramDependencyRisk: "Não me preocupo tanto porque tenho várias fontes de clientes, mas seria um impacto considerável.",
        moneyLostEstimate: "Alguns centenas de reais",
        professionalImageImpact: "Me considero bem posicionada profissionalmente, mas sempre há espaço para melhorar.",
        thoughtAboutQuitting: "Nunca, mas é desgastante"
      },
      needs: {
        automaticSystemImpact: "Facilitaria muito minha organização e me daria mais tempo para criar novos designs e técnicas.",
        fullAgendaValue: "É o que busco sempre - clientes que entendem e valorizam meu trabalho artístico.",
        digitalizedStudioMeaning: "Seria o próximo passo para me tornar uma referência ainda maior no mercado de aquarela.",
        wantToBeReference: "Sim, é um objetivo",
        professionalSupport24h: "Ajudaria bastante",
        dedicatedTeamDifference: "Me permitiria expandir para workshops e cursos, além de focar em projetos mais elaborados."
      }
    }
  }
];

export const getTattooArtistById = (id: string): TattooArtist | undefined => {
  return mockTattooArtists.find(artist => artist.id === id);
};

export const getAllTattooArtists = (): TattooArtist[] => {
  return mockTattooArtists;
};
