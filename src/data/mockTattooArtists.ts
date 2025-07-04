
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
        title: "Retrato Realista Familiar",
        description: "Retrato em preto e cinza com técnica hiper-realista de pai e filha",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Retrato+Realista+Familiar",
        style: "Realismo"
      },
      {
        id: 2,
        title: "Fine Line Floral Delicado",
        description: "Desenho delicado com traços finos e detalhes florais no antebraço",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Fine+Line+Floral",
        style: "Fine Line"
      },
      {
        id: 3,
        title: "Retrato Pet Memorial",
        description: "Homenagem realista de golden retriever falecido",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Retrato+Pet+Memorial",
        style: "Realismo"
      },
      {
        id: 4,
        title: "Olho Realista Detalhado",
        description: "Olho humano com reflexos e texturas ultra-realistas",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Olho+Realista",
        style: "Realismo"
      },
      {
        id: 5,
        title: "Paisagem Montanha Realista",
        description: "Paisagem detalhada de montanhas com névoa matinal",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Paisagem+Montanha",
        style: "Realismo"
      },
      {
        id: 6,
        title: "Retrato Casal Vintage",
        description: "Retrato nostálgico de casal dos anos 50",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Retrato+Casal+Vintage",
        style: "Realismo"
      }
    ],
    contact: {
      whatsapp: "(11) 99999-1001",
      instagram: "@carlos_tattoo_sp",
      email: "carlos@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5 tatuadores",
      appointmentManagement: "Aplicativo de terceiros (Google Calendar)",
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
        title: "Mandala Complexa Braço",
        description: "Mandala intrincada com padrões geométricos simétricos cobrindo todo o braço",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Mandala+Complexa+Braco",
        style: "Geométrico"
      },
      {
        id: 2,
        title: "Blackwork Tribal Moderno",
        description: "Design tribal contemporâneo em preto sólido nas costas",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Blackwork+Tribal+Moderno",
        style: "Blackwork"
      },
      {
        id: 3,
        title: "Dotwork Floral Feminino",
        description: "Flores delicadas criadas com técnica de pontilhismo",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Dotwork+Floral+Feminino",
        style: "Dotwork"
      },
      {
        id: 4,
        title: "Geometria Sagrada Peito",
        description: "Símbolos geométricos com significado espiritual",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Geometria+Sagrada",
        style: "Geométrico"
      },
      {
        id: 5,
        title: "Mandala Costas Completa",
        description: "Mandala gigante cobrindo todas as costas com detalhes únicos",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Mandala+Costas+Completa",
        style: "Mandala"
      },
      {
        id: 6,
        title: "Padrão Geométrico Perna",
        description: "Design geométrico complexo envolvendo toda a perna",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Padrao+Geometrico+Perna",
        style: "Geométrico"
      },
      {
        id: 7,
        title: "Ornamental Dotwork Braço",
        description: "Arte ornamental criada inteiramente com pontos",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Ornamental+Dotwork",
        style: "Dotwork"
      }
    ],
    contact: {
      whatsapp: "(21) 99999-2002",
      instagram: "@ana_geometric_tattoo",
      email: "ana@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "1 tatuador (solo)",
      appointmentManagement: "Sistema próprio (aplicativo customizado)",
      marketingChannels: ["Instagram", "TikTok", "Site Próprio"],
      financialControl: "Software financeiro (Conta Azul)",
      stockControl: "Sim, com software específico",
      growthGoals: "Otimizar gestão e aumentar produtividade",
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
        title: "Pin-up Clássica Vintage",
        description: "Pin-up no estilo tradicional americano com cores vibrantes e contornos marcantes",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Pin-up+Classica+Vintage",
        style: "Old School"
      },
      {
        id: 2,
        title: "Âncora Marinheiro Tradicional",
        description: "Design clássico de âncora com banner, rosas e elementos navais",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Ancora+Marinheiro",
        style: "Tradicional Americana"
      },
      {
        id: 3,
        title: "Rosa Neo-Tradicional Colorida",
        description: "Rosa com técnica neo-tradicional e sombreamento moderno em cores vivas",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Rosa+Neo-Tradicional",
        style: "Neo-Tradicional"
      },
      {
        id: 4,
        title: "Águia Americana Clássica",
        description: "Águia com bandeira americana em estilo traditional",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Aguia+Americana",
        style: "Tradicional Americana"
      },
      {
        id: 5,
        title: "Caveira Mexicana Colorida",
        description: "Caveira no estilo Dia dos Mortos com flores coloridas",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Caveira+Mexicana",
        style: "Neo-Tradicional"
      },
      {
        id: 6,
        title: "Sereia Old School",
        description: "Sereia clássica com elementos marinhos tradicionais",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Sereia+Old+School",
        style: "Old School"
      },
      {
        id: 7,
        title: "Leão Traditional Peito",
        description: "Leão majestoso no estilo tradicional americano",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Leao+Traditional",
        style: "Tradicional Americana"
      },
      {
        id: 8,
        title: "Swallow Traditional Dupla",
        description: "Par de andorinhas clássicas com banner",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Swallow+Traditional",
        style: "Old School"
      }
    ],
    contact: {
      whatsapp: "(31) 99999-3003",
      instagram: "@roberto_oldschool",
      email: "roberto@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "6-10 tatuadores",
      appointmentManagement: "Planilha Excel compartilhada",
      marketingChannels: ["Instagram", "Indicações", "Google Meu Negócio"],
      financialControl: "Contador externo",
      stockControl: "Sim, de forma manual em caderno",
      growthGoals: "Expandir equipe e abrir filial",
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
        title: "Flores Aquarela Costela",
        description: "Buquê de flores com técnica de aquarela e respingos coloridos",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Flores+Aquarela+Costela",
        style: "Aquarela"
      },
      {
        id: 2,
        title: "Pássaro Minimalista Pulso",
        description: "Silhueta delicada de beija-flor com traços finos",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Passaro+Minimalista",
        style: "Minimalista"
      },
      {
        id: 3,
        title: "Paisagem Aquarela Braço",
        description: "Montanhas com efeito de aquarela e degradê suave",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Paisagem+Aquarela+Braco",
        style: "Aquarela"
      },
      {
        id: 4,
        title: "Borboleta Aquarela Ombro",
        description: "Borboleta com asas em aquarela colorida",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Borboleta+Aquarela",
        style: "Aquarela"
      },
      {
        id: 5,
        title: "Fine Line Constelação",
        description: "Constelação delicada com pontos conectados",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Fine+Line+Constelacao",
        style: "Fine Line"
      },
      {
        id: 6,
        title: "Galhos Aquarela Antebraço",
        description: "Galhos floridos com técnica de aquarela",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Galhos+Aquarela",
        style: "Aquarela"
      }
    ],
    contact: {
      whatsapp: "(48) 99999-4004",
      instagram: "@marina_watercolor",
      email: "marina@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5 tatuadores",
      appointmentManagement: "Aplicativo de terceiros (Calendly)",
      marketingChannels: ["Instagram", "TikTok"],
      financialControl: "Planilha Excel básica",
      stockControl: "Não realiza controle",
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
        title: "Braço Biomecânico Completo",
        description: "Braço inteiro com elementos mecânicos integrados à anatomia",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Braco+Biomecanico+Completo",
        style: "Biomecânico"
      },
      {
        id: 2,
        title: "Olho Robótico Futurista",
        description: "Olho com circuitos, LED e elementos de ficção científica",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Olho+Robotico+Futurista",
        style: "Ficção Científica"
      },
      {
        id: 3,
        title: "Coração Mecânico 3D",
        description: "Coração anatômico com partes mecânicas e efeito tridimensional",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Coracao+Mecanico+3D",
        style: "Biomecânico"
      },
      {
        id: 4,
        title: "Perna Cibernética",
        description: "Perna com implantes tecnológicos e circuitos visíveis",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Perna+Cibernetica",
        style: "Biomecânico"
      },
      {
        id: 5,
        title: "Alien Biomecânico",
        description: "Criatura extraterrestre com elementos orgânicos e mecânicos",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Alien+Biomecanico",
        style: "Ficção Científica"
      },
      {
        id: 6,
        title: "Espinha Cibernética",
        description: "Coluna vertebral com implantes tecnológicos",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Espinha+Cibernetica",
        style: "Biomecânico"
      },
      {
        id: 7,
        title: "Interface Neural",
        description: "Circuitos neurais conectados ao cérebro",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Interface+Neural",
        style: "Ficção Científica"
      }
    ],
    contact: {
      whatsapp: "(51) 99999-5005",
      instagram: "@lucas_biomech",
      email: "lucas@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5 tatuadores",
      appointmentManagement: "Sistema próprio desenvolvido",
      marketingChannels: ["Instagram", "Site Próprio", "Indicações"],
      financialControl: "Software financeiro (QuickBooks)",
      stockControl: "Sim, com software específico",
      growthGoals: "Aumentar valor por tatuagem e especialização",
      digitalizationInterest: "Muito Alto"
    },
    stats: {
      experience: 8,
      worksCompleted: 340,
      rating: 4.8,
      reviews: 73
    },
    isAvailable: false
  },
  {
    id: "6",
    name: "Juliana Mendes",
    bio: "Artista especializada em trabalhos femininos delicados e florais. Minha paixão é criar tatuagens que celebram a feminilidade com elegância e sofisticação.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    specialties: ["Floral", "Fine Line", "Feminino", "Aquarela", "Minimalista"],
    location: {
      city: "Curitiba",
      state: "PR",
      studio: "Bloom Tattoo Studio"
    },
    portfolio: [
      {
        id: 1,
        title: "Rosa Delicada Costela",
        description: "Rosa em fine line com detalhes sutis na costela",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Rosa+Delicada+Costela",
        style: "Fine Line"
      },
      {
        id: 2,
        title: "Peônia Aquarela Braço",
        description: "Peônia em aquarela com respingos coloridos",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Peonia+Aquarela+Braco",
        style: "Aquarela"
      },
      {
        id: 3,
        title: "Lavanda Minimalista",
        description: "Ramo de lavanda em estilo minimalista no pulso",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Lavanda+Minimalista",
        style: "Minimalista"
      },
      {
        id: 4,
        title: "Orquídea Fine Line",
        description: "Orquídea detalhada em traços finos no ombro",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Orquidea+Fine+Line",
        style: "Fine Line"
      },
      {
        id: 5,
        title: "Buquê Vintage Aquarela",
        description: "Buquê de flores vintage com técnica aquarela",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Buque+Vintage+Aquarela",
        style: "Aquarela"
      },
      {
        id: 6,
        title: "Girassol Fine Line Feminino",
        description: "Girassol delicado com elementos femininos",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Girassol+Fine+Line",
        style: "Fine Line"
      }
    ],
    contact: {
      whatsapp: "(41) 99999-6006",
      instagram: "@juliana_bloom_tattoo",
      email: "juliana@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5 tatuadores",
      appointmentManagement: "WhatsApp Business",
      marketingChannels: ["Instagram", "Pinterest", "Indicações"],
      financialControl: "Aplicativo do banco",
      stockControl: "Sim, de forma manual",
      growthGoals: "Especializar em público feminino",
      digitalizationInterest: "Médio"
    },
    stats: {
      experience: 6,
      worksCompleted: 280,
      rating: 4.9,
      reviews: 67
    },
    isAvailable: true
  },
  {
    id: "7",
    name: "Pedro Oliveira",
    bio: "Especialista em lettering e caligrafia. Transformo palavras em arte, criando tatuagens tipográficas únicas que carregam significados profundos para cada cliente.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    specialties: ["Lettering", "Caligrafia", "Tipografia", "Preto e Cinza"],
    location: {
      city: "Salvador",
      state: "BA",
      studio: "Words Ink Studio"
    },
    portfolio: [
      {
        id: 1,
        title: "Frase Motivacional Costela",
        description: "Lettering em script cursivo com sombreamento",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Frase+Motivacional",
        style: "Lettering"
      },
      {
        id: 2,
        title: "Nome Filho Caligrafia",
        description: "Nome em caligrafia clássica no antebraço",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Nome+Filho+Caligrafia",
        style: "Caligrafia"
      },
      {
        id: 3,
        title: "Citação Bíblica Costas",
        description: "Versículo em tipografia gótica nas costas",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Citacao+Biblica",
        style: "Tipografia"
      },
      {
        id: 4,
        title: "Data Especial Pulso",
        description: "Data em algarismos romanos minimalista",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Data+Especial+Pulso",
        style: "Tipografia"
      },
      {
        id: 5,
        title: "Poesia Lettering Braço",
        description: "Trecho de poesia em lettering artístico",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Poesia+Lettering",
        style: "Lettering"
      }
    ],
    contact: {
      whatsapp: "(71) 99999-7007",
      instagram: "@pedro_lettering",
      email: "pedro@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "1 tatuador (solo)",
      appointmentManagement: "Agenda física + WhatsApp",
      marketingChannels: ["Instagram", "Facebook", "Indicações"],
      financialControl: "Caderneta",
      stockControl: "Não realiza controle",
      growthGoals: "Aumentar número de clientes",
      digitalizationInterest: "Baixo"
    },
    stats: {
      experience: 4,
      worksCompleted: 150,
      rating: 4.6,
      reviews: 34
    },
    isAvailable: true
  },
  {
    id: "8",
    name: "Tatiane Silva",
    bio: "Especialista em trabalhos coloridos e ilustrativos. Minha arte combina elementos da cultura pop com técnicas tradicionais, criando tatuagens vibrantes e únicas.",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    specialties: ["Ilustrativo", "Pop Art", "Colorido", "Cartoon", "Anime"],
    location: {
      city: "Recife",
      state: "PE",
      studio: "Pop Culture Ink"
    },
    portfolio: [
      {
        id: 1,
        title: "Personagem Anime Colorido",
        description: "Personagem de anime em estilo colorido no braço",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Personagem+Anime",
        style: "Anime"
      },
      {
        id: 2,
        title: "Pop Art Pin-up",
        description: "Pin-up em estilo pop art com cores vibrantes",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Pop+Art+Pin-up",
        style: "Pop Art"
      },
      {
        id: 3,
        title: "Cartoon Mascote",
        description: "Mascote em estilo cartoon na perna",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Cartoon+Mascote",
        style: "Cartoon"
      },
      {
        id: 4,
        title: "Ilustração Fantasia",
        description: "Criatura fantástica colorida nas costas",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Ilustracao+Fantasia",
        style: "Ilustrativo"
      },
      {
        id: 5,
        title: "Super-herói Pop Art",
        description: "Super-herói clássico em estilo pop art",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Super-heroi+Pop+Art",
        style: "Pop Art"
      },
      {
        id: 6,
        title: "Anime Waifu Colorida",
        description: "Personagem feminina de anime com cores vibrantes",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Anime+Waifu",
        style: "Anime"
      }
    ],
    contact: {
      whatsapp: "(81) 99999-8008",
      instagram: "@tatiane_pop_tattoo",
      email: "tatiane@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5 tatuadores",
      appointmentManagement: "Aplicativo de terceiros",
      marketingChannels: ["Instagram", "TikTok", "YouTube"],
      financialControl: "Planilha Excel",
      stockControl: "Sim, de forma manual",
      growthGoals: "Crescer nas redes sociais",
      digitalizationInterest: "Alto"
    },
    stats: {
      experience: 7,
      worksCompleted: 290,
      rating: 4.7,
      reviews: 58
    },
    isAvailable: true
  },
  {
    id: "9",
    name: "Diego Monteiro",
    bio: "Mestre em técnicas orientais e blackwork. Especializo-me em designs japoneses tradicionais e contemporâneos, combinando tradição milenar com inovação artística moderna.",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face",
    specialties: ["Oriental", "Japonês", "Blackwork", "Irezumi", "Dragões"],
    location: {
      city: "Brasília",
      state: "DF",
      studio: "Rising Sun Tattoo"
    },
    portfolio: [
      {
        id: 1,
        title: "Dragão Japonês Braço Completo",
        description: "Dragão tradicional japonês cobrindo todo o braço com nuvens e ondas",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Dragao+Japones+Braco",
        style: "Oriental"
      },
      {
        id: 2,
        title: "Carpa Koi Colorida",
        description: "Carpa koi nadando em águas turbulentas com flores de cerejeira",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Carpa+Koi+Colorida",
        style: "Japonês"
      },
      {
        id: 3,
        title: "Samurai Guerreiro",
        description: "Samurai em posição de combate com armadura detalhada",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Samurai+Guerreiro",
        style: "Oriental"
      },
      {
        id: 4,
        title: "Máscara Hannya",
        description: "Máscara japonesa tradicional com expressão demoníaca",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Mascara+Hannya",
        style: "Japonês"
      },
      {
        id: 5,
        title: "Phoenix Oriental",
        description: "Fênix renascendo das cinzas em estilo oriental",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Phoenix+Oriental",
        style: "Oriental"
      },
      {
        id: 6,
        title: "Blackwork Geométrico Oriental",
        description: "Padrões geométricos inspirados na arte oriental",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Blackwork+Oriental",
        style: "Blackwork"
      },
      {
        id: 7,
        title: "Cerejeira Sakura",
        description: "Galhos de cerejeira com flores em plena florada",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Cerejeira+Sakura",
        style: "Japonês"
      },
      {
        id: 8,
        title: "Tigre Oriental Feroz",
        description: "Tigre em estilo oriental com bambus e névoa",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Tigre+Oriental",
        style: "Oriental"
      }
    ],
    contact: {
      whatsapp: "(61) 99999-9009",
      instagram: "@diego_oriental_ink",
      email: "diego@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5 tatuadores",
      appointmentManagement: "Sistema próprio (CRM customizado)",
      marketingChannels: ["Instagram", "Site Próprio", "Convenções", "Indicações"],
      financialControl: "Software financeiro (QuickBooks Pro)",
      stockControl: "Sim, com sistema integrado",
      growthGoals: "Especializar em arte oriental e expandir internationally",
      digitalizationInterest: "Muito Alto"
    },
    stats: {
      experience: 12,
      worksCompleted: 520,
      rating: 4.9,
      reviews: 98
    },
    isAvailable: true
  },
  {
    id: "10",
    name: "Camila Rodrigues",
    bio: "Especialista em trash polka e estilos abstratos. Minha arte desafia convenções, misturando elementos realistas com abstratos para criar composições únicas e impactantes.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    specialties: ["Trash Polka", "Abstrato", "Experimental", "Mixed Media", "Arte Conceitual"],
    location: {
      city: "Goiânia",
      state: "GO",
      studio: "Rebel Art Collective"
    },
    portfolio: [
      {
        id: 1,
        title: "Trash Polka Urbano",
        description: "Composição trash polka com elementos urbanos e abstratos",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Trash+Polka+Urbano",
        style: "Trash Polka"
      },
      {
        id: 2,
        title: "Abstrato Experimental",
        description: "Design abstrato experimental com formas orgânicas",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Abstrato+Experimental",
        style: "Abstrato"
      },
      {
        id: 3,
        title: "Mixed Media Collage",
        description: "Colagem artística misturando técnicas e estilos",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Mixed+Media+Collage",
        style: "Mixed Media"
      },
      {
        id: 4,
        title: "Conceitual Futurista",
        description: "Arte conceitual com visão futurista da humanidade",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Conceitual+Futurista",
        style: "Arte Conceitual"
      },
      {
        id: 5,
        title: "Trash Polka Portrait",
        description: "Retrato fragmentado em estilo trash polka",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Trash+Polka+Portrait",
        style: "Trash Polka"
      },
      {
        id: 6,
        title: "Experimental Orgânico",
        description: "Formas orgânicas experimentais em movimento",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Experimental+Organico",
        style: "Experimental"
      }
    ],
    contact: {
      whatsapp: "(62) 99999-1010",
      instagram: "@camila_rebel_art",
      email: "camila@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5 tatuadores",
      appointmentManagement: "Calendário online integrado",
      marketingChannels: ["Instagram", "Behance", "Exposições", "Arte Galerias"],
      financialControl: "Software financeiro personalizado",
      stockControl: "Sim, sistema automatizado",
      growthGoals: "Expandir para arte contemporânea e galerias",
      digitalizationInterest: "Muito Alto"
    },
    stats: {
      experience: 9,
      worksCompleted: 380,
      rating: 4.8,
      reviews: 71
    },
    isAvailable: false
  },
  {
    id: "11",
    name: "Fernando Costa",
    bio: "Veterano em tatuagens tribais e polynesian. Com mais de 18 anos de experiência, mantenho vivas as tradições ancestrais enquanto adapto para o mundo moderno.",
    avatar: "https://images.unsplash.com/photo-1507038732509-8b1a3f92228b?w=400&h=400&fit=crop&crop=face",
    specialties: ["Tribal", "Polynesian", "Maori", "Tradicional", "Cultural"],
    location: {
      city: "Vitória",
      state: "ES",
      studio: "Tribal Legacy Ink"
    },
    portfolio: [
      {
        id: 1,
        title: "Tribal Polynesian Completo",
        description: "Design polynesian tradicional cobrindo ombro e braço",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Tribal+Polynesian",
        style: "Polynesian"
      },
      {
        id: 2,
        title: "Maori Tradicional Perna",
        description: "Padrões maori autênticos na perna com significados ancestrais",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Maori+Tradicional",
        style: "Maori"
      },
      {
        id: 3,
        title: "Tribal Moderno Peito",
        description: "Adaptação moderna de tribal clássico no peito",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Tribal+Moderno",
        style: "Tribal"
      },
      {
        id: 4,
        title: "Polynesian Feminino",
        description: "Design polynesian adaptado para o público feminino",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Polynesian+Feminino",
        style: "Polynesian"
      },
      {
        id: 5,
        title: "Tribal Celta Braço",
        description: "Padrões celtas entrelaçados no antebraço",
        image: "https://placehold.co/400x400/000000/FFFFFF?text=Tribal+Celta",
        style: "Tribal"
      }
    ],
    contact: {
      whatsapp: "(27) 99999-1111",
      instagram: "@fernando_tribal_legacy",
      email: "fernando@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "2-5 tatuadores",
      appointmentManagement: "Agenda física tradicional",
      marketingChannels: ["Instagram", "Indicações", "Convenções"],
      financialControl: "Planilha Excel avançada",
      stockControl: "Sim, de forma manual detalhada",
      growthGoals: "Preservar tradições e formar novos artistas",
      digitalizationInterest: "Baixo"
    },
    stats: {
      experience: 18,
      worksCompleted: 950,
      rating: 4.8,
      reviews: 187
    },
    isAvailable: true
  },
  {
    id: "12",
    name: "Isabela Nunes",
    bio: "Especialista em neo-tradicional e new school. Combino a técnica clássica com cores vibrantes e elementos contemporâneos para criar peças modernas e atemporais.",
    avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=400&h=400&fit=crop&crop=face",
    specialties: ["Neo-Tradicional", "New School", "Colorido", "Cartoon", "Ilustrativo"],
    location: {
      city: "Fortaleza",
      state: "CE",
      studio: "New Wave Tattoo"
    },
    portfolio: [
      {
        id: 1,
        title: "Neo-Tradicional Feminino",
        description: "Mulher em estilo neo-tradicional com flores e elementos decorativos",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Neo-Tradicional+Feminino",
        style: "Neo-Tradicional"
      },
      {
        id: 2,
        title: "New School Cartoon",
        description: "Personagem cartoon em estilo new school colorido",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=New+School+Cartoon",
        style: "New School"
      },
      {
        id: 3,
        title: "Animal Neo-Tradicional",
        description: "Lobo em estilo neo-tradicional com elementos decorativos",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Animal+Neo-Tradicional",
        style: "Neo-Tradicional"
      },
      {
        id: 4,
        title: "Ilustração Colorida",
        description: "Ilustração moderna com cores vibrantes e contrastes",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Ilustracao+Colorida",
        style: "Ilustrativo"
      },
      {
        id: 5,
        title: "New School Gaming",
        description: "Elementos de videogame em estilo new school",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=New+School+Gaming",
        style: "New School"
      },
      {
        id: 6,
        title: "Neo-Tradicional Natureza",
        description: "Elementos da natureza em estilo neo-tradicional",
        image: "https://placehold.co/400x400/dc2626/FFFFFF?text=Neo-Tradicional+Natureza",
        style: "Neo-Tradicional"
      }
    ],
    contact: {
      whatsapp: "(85) 99999-1212",
      instagram: "@isabela_newwave",
      email: "isabela@99tattoo.com.br"
    },
    studioQualification: {
      teamSize: "6-10 tatuadores",
      appointmentManagement: "Sistema online próprio",
      marketingChannels: ["Instagram", "TikTok", "YouTube", "Twitch"],
      financialControl: "ERP completo",
      stockControl: "Sim, automatizado com RFID",
      growthGoals: "Tornar-se referência nacional em neo-tradicional",
      digitalizationInterest: "Muito Alto"
    },
    stats: {
      experience: 8,
      worksCompleted: 410,
      rating: 4.9,
      reviews: 93
    },
    isAvailable: true
  }
];

export const getAllTattooArtists = (): TattooArtist[] => mockTattooArtists;

export const getTattooArtistById = (id: string): TattooArtist | undefined => {
  return mockTattooArtists.find(artist => artist.id === id);
};
