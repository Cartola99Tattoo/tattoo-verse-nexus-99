
export interface TattooArtist {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  specialties: string[];
  location: {
    city: string;
    state: string;
    studio?: string;
  };
  portfolio: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    style: string;
  }>;
  contact: {
    whatsapp: string;
    instagram: string;
    email: string;
  };
  stats: {
    experience: number;
    worksCompleted: number;
    rating: number;
    reviews: number;
  };
  isAvailable: boolean;
}

export const mockTattooArtists: TattooArtist[] = [
  {
    id: "mariana-silva",
    name: "Mariana Silva",
    avatar: "https://images.unsplash.com/photo-1594736797933-d0589ba2fe65?q=80&w=200&h=200&fit=crop&crop=face",
    bio: "Especialista em tatuagens realistas e retratos, com mais de 8 anos transformando memórias em arte permanente. Cada trabalho é uma história única contada através da pele.",
    specialties: ["Realismo", "Retrato", "Preto e Cinza", "Fine Line"],
    location: {
      city: "São Paulo",
      state: "SP",
      studio: "Ink Masters Studio"
    },
    portfolio: [
      {
        id: "1",
        title: "Retrato Realista Feminino",
        description: "Retrato em preto e cinza com técnica de hiperrealismo",
        image: "https://placehold.co/400x500/dc2626/ffffff?text=Retrato+Realista",
        style: "Realismo"
      },
      {
        id: "2",
        title: "Tatuagem Floral Delicada",
        description: "Composição floral em fine line no antebraço",
        image: "https://placehold.co/400x500/dc2626/ffffff?text=Floral+Fine+Line",
        style: "Fine Line"
      },
      {
        id: "3",
        title: "Olho Realista",
        description: "Detalhe em preto e cinza com técnica de sombreamento",
        image: "https://placehold.co/400x500/dc2626/ffffff?text=Olho+Realista",
        style: "Realismo"
      },
      {
        id: "4",
        title: "Retrato Pet",
        description: "Retrato de animal de estimação em memória",
        image: "https://placehold.co/400x500/dc2626/ffffff?text=Retrato+Pet",
        style: "Retrato"
      },
      {
        id: "5",
        title: "Mandala Geométrica",
        description: "Padrão geométrico com linhas finas e precisas",
        image: "https://placehold.co/400x500/dc2626/ffffff?text=Mandala+Geometrica",
        style: "Fine Line"
      },
      {
        id: "6",
        title: "Paisagem Minimalista",
        description: "Montanha em traços simples e elegantes",
        image: "https://placehold.co/400x500/dc2626/ffffff?text=Paisagem+Minimal",
        style: "Fine Line"
      }
    ],
    contact: {
      whatsapp: "+55 11 99999-1234",
      instagram: "@mariana_tattoo",
      email: "mariana@99tattoo.com.br"
    },
    stats: {
      experience: 8,
      worksCompleted: 340,
      rating: 4.9,
      reviews: 127
    },
    isAvailable: true
  },
  {
    id: "rodrigo-blackwork",
    name: "Rodrigo Santos",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop&crop=face",
    bio: "Mestre em blackwork e geometric tattoos. Especializado em criar padrões únicos que combinam tradição e modernidade, sempre buscando a perfeição em cada traço.",
    specialties: ["Blackwork", "Geometric", "Ornamental", "Dotwork"],
    location: {
      city: "Rio de Janeiro",
      state: "RJ",
      studio: "Black Ocean Tattoo"
    },
    portfolio: [
      {
        id: "1",
        title: "Mandala Blackwork",
        description: "Mandala complexa em tinta preta sólida",
        image: "https://placehold.co/400x500/000000/ffffff?text=Mandala+Blackwork",
        style: "Blackwork"
      },
      {
        id: "2",
        title: "Geometric Sleeve",
        description: "Manga geométrica com padrões matemáticos",
        image: "https://placehold.co/400x500/000000/ffffff?text=Geometric+Sleeve",
        style: "Geometric"
      },
      {
        id: "3",
        title: "Ornamental Back",
        description: "Padrão ornamental completo nas costas",
        image: "https://placehold.co/400x500/000000/ffffff?text=Ornamental+Back",
        style: "Ornamental"
      },
      {
        id: "4",
        title: "Dotwork Lotus",
        description: "Flor de lótus em técnica pontilhismo",
        image: "https://placehold.co/400x500/000000/ffffff?text=Dotwork+Lotus",
        style: "Dotwork"
      },
      {
        id: "5",
        title: "Sacred Geometry",
        description: "Geometria sagrada em composição única",
        image: "https://placehold.co/400x500/000000/ffffff?text=Sacred+Geometry",
        style: "Geometric"
      },
      {
        id: "6",
        title: "Tribal Modern",
        description: "Releitura moderna de padrões tribais",
        image: "https://placehold.co/400x500/000000/ffffff?text=Tribal+Modern",
        style: "Blackwork"
      }
    ],
    contact: {
      whatsapp: "+55 21 99888-5678",
      instagram: "@rodrigo_blackwork",
      email: "rodrigo@99tattoo.com.br"
    },
    stats: {
      experience: 12,
      worksCompleted: 520,
      rating: 4.8,
      reviews: 203
    },
    isAvailable: true
  },
  {
    id: "ana-oldschool",
    name: "Ana Carolina",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&fit=crop&crop=face",
    bio: "Apaixonada pelo old school tradicional americano. Cores vibrantes, contornos marcantes e designs clássicos que nunca saem de moda são minha especialidade.",
    specialties: ["Old School", "Traditional", "Neo Traditional", "Colorido"],
    location: {
      city: "Belo Horizonte",
      state: "MG",
      studio: "Classic Ink BH"
    },
    portfolio: [
      {
        id: "1",
        title: "Pin-up Clássica",
        description: "Pin-up no estilo tradicional americano",
        image: "https://placehold.co/400x500/fbbf24/000000?text=Pin-up+Classica",
        style: "Old School"
      },
      {
        id: "2",
        title: "Águia Americana",
        description: "Águia em estilo tradicional com bandeira",
        image: "https://placehold.co/400x500/fbbf24/000000?text=Aguia+Americana",
        style: "Traditional"
      },
      {
        id: "3",
        title: "Rosa Neo Traditional",
        description: "Rosa estilizada com cores vibrantes",
        image: "https://placehold.co/400x500/fbbf24/000000?text=Rosa+Neo+Trad",
        style: "Neo Traditional"
      },
      {
        id: "4",
        title: "Swallow Vintage",
        description: "Andorinha clássica em cores tradicionais",
        image: "https://placehold.co/400x500/fbbf24/000000?text=Swallow+Vintage",
        style: "Old School"
      },
      {
        id: "5",
        title: "Caveira Mexicana",
        description: "Caveira colorida estilo Día de los Muertos",
        image: "https://placehold.co/400x500/fbbf24/000000?text=Caveira+Mexicana",
        style: "Colorido"
      },
      {
        id: "6",
        title: "Pantera Flash",
        description: "Pantera em estilo flash tradicional",
        image: "https://placehold.co/400x500/fbbf24/000000?text=Pantera+Flash",
        style: "Traditional"
      }
    ],
    contact: {
      whatsapp: "+55 31 99777-9012",
      instagram: "@ana_oldschool",
      email: "ana@99tattoo.com.br"
    },
    stats: {
      experience: 6,
      worksCompleted: 280,
      rating: 4.7,
      reviews: 89
    },
    isAvailable: false
  },
  {
    id: "carlos-oriental",
    name: "Carlos Tanaka",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop&crop=face",
    bio: "Especialista em tatuagens orientais tradicionais japonesas. Estudo há anos a arte do irezumi, trazendo autenticidade e respeito cultural para cada peça.",
    specialties: ["Oriental", "Japonês", "Irezumi", "Dragões"],
    location: {
      city: "Curitiba",
      state: "PR",
      studio: "Sakura Tattoo"
    },
    portfolio: [
      {
        id: "1",
        title: "Dragão Japonês",
        description: "Dragão tradicional japonês em manga completa",
        image: "https://placehold.co/400x500/ef4444/ffffff?text=Dragao+Japones",
        style: "Oriental"
      },
      {
        id: "2",
        title: "Carpa Koi",
        description: "Carpa nadando entre ondas e flores de cerejeira",
        image: "https://placehold.co/400x500/ef4444/ffffff?text=Carpa+Koi",
        style: "Japonês"
      },
      {
        id: "3",
        title: "Oni Mask",
        description: "Máscara oni tradicional com detalhes precisos",
        image: "https://placehold.co/400x500/ef4444/ffffff?text=Oni+Mask",
        style: "Irezumi"
      },
      {
        id: "4",
        title: "Samurai Warrior",
        description: "Guerreiro samurai em composição épica",
        image: "https://placehold.co/400x500/ef4444/ffffff?text=Samurai+Warrior",
        style: "Oriental"
      },
      {
        id: "5",
        title: "Sakura Branch",
        description: "Galho de cerejeira com pétalas caindo",
        image: "https://placehold.co/400x500/ef4444/ffffff?text=Sakura+Branch",
        style: "Japonês"
      },
      {
        id: "6",
        title: "Phoenix Rising",
        description: "Fênix renascendo das cinzas",
        image: "https://placehold.co/400x500/ef4444/ffffff?text=Phoenix+Rising",
        style: "Oriental"
      }
    ],
    contact: {
      whatsapp: "+55 41 99666-3456",
      instagram: "@carlos_oriental",
      email: "carlos@99tattoo.com.br"
    },
    stats: {
      experience: 15,
      worksCompleted: 780,
      rating: 5.0,
      reviews: 342
    },
    isAvailable: true
  },
  {
    id: "lucia-aquarela",
    name: "Lúcia Fernandes",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&fit=crop&crop=face",
    bio: "Artista especializada em aquarela e estilos artísticos. Transformo a pele em tela, criando obras únicas que parecem pinturas em movimento.",
    specialties: ["Aquarela", "Artístico", "Sketch", "Abstrato"],
    location: {
      city: "Salvador",
      state: "BA",
      studio: "Arte & Pele Studio"
    },
    portfolio: [
      {
        id: "1",
        title: "Flor Aquarela",
        description: "Flor em técnica de aquarela com respingos",
        image: "https://placehold.co/400x500/3b82f6/ffffff?text=Flor+Aquarela",
        style: "Aquarela"
      },
      {
        id: "2",
        title: "Beija-flor Sketch",
        description: "Beija-flor em estilo sketch artístico",
        image: "https://placehold.co/400x500/3b82f6/ffffff?text=Beija-flor+Sketch",
        style: "Sketch"
      },
      {
        id: "3",
        title: "Splash Colorido",
        description: "Composição abstrata com explosão de cores",
        image: "https://placehold.co/400x500/3b82f6/ffffff?text=Splash+Colorido",
        style: "Abstrato"
      },
      {
        id: "4",
        title: "Borboleta Artística",
        description: "Borboleta em estilo watercolor delicado",
        image: "https://placehold.co/400x500/3b82f6/ffffff?text=Borboleta+Art",
        style: "Artístico"
      },
      {
        id: "5",
        title: "Paisagem Dreamy",
        description: "Paisagem onírica em tons pastel",
        image: "https://placehold.co/400x500/3b82f6/ffffff?text=Paisagem+Dreamy",
        style: "Aquarela"
      },
      {
        id: "6",
        title: "Retrato Sketch",
        description: "Retrato feminino em traços soltos",
        image: "https://placehold.co/400x500/3b82f6/ffffff?text=Retrato+Sketch",
        style: "Sketch"
      }
    ],
    contact: {
      whatsapp: "+55 71 99555-7890",
      instagram: "@lucia_aquarela",
      email: "lucia@99tattoo.com.br"
    },
    stats: {
      experience: 7,
      worksCompleted: 195,
      rating: 4.8,
      reviews: 76
    },
    isAvailable: true
  },
  {
    id: "felipe-biomech",
    name: "Felipe Cyborg",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop&crop=face",
    bio: "Especialista em biomecânico e cyberpunk. Crio tatuagens que parecem integrar tecnologia à anatomia humana, explorando os limites entre orgânico e artificial.",
    specialties: ["Biomecânico", "Cyberpunk", "Sci-Fi", "3D"],
    location: {
      city: "Brasília",
      state: "DF",
      studio: "Future Ink DF"
    },
    portfolio: [
      {
        id: "1",
        title: "Braço Biomecânico",
        description: "Braço com engrenagens e circuitos integrados",
        image: "https://placehold.co/400x500/6b7280/ffffff?text=Braco+Biomech",
        style: "Biomecânico"
      },
      {
        id: "2",
        title: "Olho Cyborg",
        description: "Olho cibernético com interface digital",
        image: "https://placehold.co/400x500/6b7280/ffffff?text=Olho+Cyborg",
        style: "Cyberpunk"
      },
      {
        id: "3",
        title: "Spine Matrix",
        description: "Coluna vertebral com implantes tecnológicos",
        image: "https://placehold.co/400x500/6b7280/ffffff?text=Spine+Matrix",
        style: "Sci-Fi"
      },
      {
        id: "4",
        title: "Gear Heart",
        description: "Coração mecânico com engrenagens",
        image: "https://placehold.co/400x500/6b7280/ffffff?text=Gear+Heart",
        style: "Biomecânico"
      },
      {
        id: "5",
        title: "Neural Network",
        description: "Rede neural em 3D realístico",
        image: "https://placehold.co/400x500/6b7280/ffffff?text=Neural+Network",
        style: "3D"
      },
      {
        id: "6",
        title: "Robot Hand",
        description: "Mão robótica ultrarrealista",
        image: "https://placehold.co/400x500/6b7280/ffffff?text=Robot+Hand",
        style: "Cyberpunk"
      }
    ],
    contact: {
      whatsapp: "+55 61 99444-2468",
      instagram: "@felipe_cyborg",
      email: "felipe@99tattoo.com.br"
    },
    stats: {
      experience: 9,
      worksCompleted: 156,
      rating: 4.9,
      reviews: 94
    },
    isAvailable: true
  }
];

export const getTattooArtistById = (id: string): TattooArtist | undefined => {
  return mockTattooArtists.find(artist => artist.id === id);
};

export const getAllTattooArtists = (): TattooArtist[] => {
  return mockTattooArtists;
};

export const getTattooArtistsBySpecialty = (specialty: string): TattooArtist[] => {
  return mockTattooArtists.filter(artist => 
    artist.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
  );
};

export const getAvailableTattooArtists = (): TattooArtist[] => {
  return mockTattooArtists.filter(artist => artist.isAvailable);
};
