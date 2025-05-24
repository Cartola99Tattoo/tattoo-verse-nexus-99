
import { IArtistsService, Artist, ArtistsQueryParams, PortfolioItem } from "../interfaces/IArtistsService";

// Dados mock atualizados com todas as propriedades necessárias
const mockArtists: Artist[] = [
  {
    id: "1",
    first_name: "João",
    last_name: "Silva",
    email: "joao.silva@99tattoo.com",
    phone: "(11) 99999-1111",
    bio: "Especialista em realismo e retratos. Com mais de 10 anos de experiência, crio tatuagens únicas e detalhadas.",
    avatar_url: "/placeholder.svg",
    specialties: ["Realismo", "Blackwork"],
    style: "Realismo",
    contact: {
      phone: "(11) 99999-1111",
      email: "joao.silva@99tattoo.com",
      instagram: "@joaosilva_tattoo",
      facebook: "facebook.com/joaosilvatattoo"
    },
    rating: 4.9,
    total_reviews: 127,
    status: "active",
    commission_percentage: 50,
    availability_description: "Atende de terça a sábado, das 9h às 18h",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-05-20T14:30:00Z",
    portfolio: [
      {
        id: "p1",
        artist_id: "1",
        image_url: "/placeholder.svg",
        description: "Retrato realista em preto e cinza",
        category: "Realismo",
        is_featured: true,
        created_at: "2024-03-10T12:00:00Z"
      },
      {
        id: "p2",
        artist_id: "1",
        image_url: "/placeholder.svg",
        description: "Trabalho blackwork detalhado",
        category: "Blackwork",
        is_featured: false,
        created_at: "2024-04-05T15:30:00Z"
      }
    ]
  },
  {
    id: "2",
    first_name: "Maria",
    last_name: "Santos",
    email: "maria.santos@99tattoo.com",
    phone: "(11) 99999-2222",
    bio: "Artista especializada em aquarela e estilos delicados. Apaixonada por criar peças únicas e coloridas.",
    avatar_url: "/placeholder.svg",
    specialties: ["Aquarela", "Minimalista"],
    style: "Aquarela",
    contact: {
      phone: "(11) 99999-2222",
      email: "maria.santos@99tattoo.com",
      instagram: "@mariasantos_art",
      tiktok: "@mariasantos_tattoo"
    },
    rating: 4.8,
    total_reviews: 98,
    status: "active",
    commission_percentage: 45,
    availability_description: "Disponível de segunda a sexta, com agendamentos especiais aos sábados",
    created_at: "2024-02-01T09:00:00Z",
    updated_at: "2024-05-18T16:45:00Z",
    portfolio: [
      {
        id: "p3",
        artist_id: "2",
        image_url: "/placeholder.svg",
        description: "Tatuagem aquarela floral",
        category: "Aquarela",
        is_featured: true,
        created_at: "2024-03-15T14:00:00Z"
      }
    ]
  },
  {
    id: "3",
    first_name: "Carlos",
    last_name: "Oliveira",
    email: "carlos.oliveira@99tattoo.com",
    phone: "(11) 99999-3333",
    bio: "Mestre em old school e tradicional. Preservando a arte clássica da tatuagem com técnicas modernas.",
    avatar_url: "/placeholder.svg",
    specialties: ["Old School", "Tribal"],
    style: "Old School",
    contact: {
      phone: "(11) 99999-3333",
      email: "carlos.oliveira@99tattoo.com",
      instagram: "@carlosolive_tattoo",
      facebook: "facebook.com/carlosoldschool"
    },
    rating: 4.7,
    total_reviews: 156,
    status: "active",
    commission_percentage: 55,
    availability_description: "Atendimento de quarta a domingo",
    created_at: "2024-01-10T08:30:00Z",
    updated_at: "2024-05-22T11:15:00Z",
    portfolio: [
      {
        id: "p4",
        artist_id: "3",
        image_url: "/placeholder.svg",
        description: "Pin-up old school clássica",
        category: "Old School",
        is_featured: true,
        created_at: "2024-02-20T10:30:00Z"
      },
      {
        id: "p5",
        artist_id: "3",
        image_url: "/placeholder.svg",
        description: "Tribal contemporâneo",
        category: "Tribal",
        is_featured: false,
        created_at: "2024-04-12T13:45:00Z"
      }
    ]
  },
  {
    id: "4",
    first_name: "Ana",
    last_name: "Costa",
    email: "ana.costa@99tattoo.com",
    phone: "(11) 99999-4444",
    bio: "Especialista em geometria e linework. Criando designs únicos que combinam precisão e criatividade.",
    avatar_url: "/placeholder.svg",
    specialties: ["Geométrico", "Minimalista"],
    style: "Geométrico",
    contact: {
      phone: "(11) 99999-4444",
      email: "ana.costa@99tattoo.com",
      instagram: "@anacosta_geometric",
      tiktok: "@ana_geometric_art"
    },
    rating: 4.9,
    total_reviews: 89,
    status: "inactive",
    commission_percentage: 48,
    availability_description: "Temporariamente indisponível - retorno em junho",
    created_at: "2024-03-01T11:00:00Z",
    updated_at: "2024-05-25T09:20:00Z",
    portfolio: [
      {
        id: "p6",
        artist_id: "4",
        image_url: "/placeholder.svg",
        description: "Mandala geométrica detalhada",
        category: "Geométrico",
        is_featured: true,
        created_at: "2024-04-01T16:00:00Z"
      }
    ]
  }
];

export class MockArtistsService implements IArtistsService {
  async fetchArtists(options: ArtistsQueryParams = {}) {
    const { limit = 50, offset = 0, specialties, style, search, status = 'active' } = options;
    
    let filteredArtists = [...mockArtists];
    
    // Apply status filter
    if (status !== 'all') {
      filteredArtists = filteredArtists.filter(artist => artist.status === status);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArtists = filteredArtists.filter(artist => 
        artist.first_name.toLowerCase().includes(searchLower) ||
        artist.last_name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply style filter
    if (style) {
      filteredArtists = filteredArtists.filter(artist => artist.style === style);
    }
    
    // Apply specialties filter
    if (specialties && specialties.length > 0) {
      filteredArtists = filteredArtists.filter(artist => 
        specialties.some(specialty => artist.specialties.includes(specialty))
      );
    }
    
    // Apply pagination
    const paginatedArtists = filteredArtists.slice(offset, offset + limit);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      artists: paginatedArtists,
      total: filteredArtists.length,
      totalPages: Math.ceil(filteredArtists.length / limit)
    };
  }
  
  async fetchArtistById(id: string | number) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const artist = mockArtists.find(a => a.id === id.toString());
    return artist || null;
  }
  
  async fetchArtistPortfolio(artistId: string | number, options: {
    limit?: number;
    offset?: number;
    category?: string;
  } = {}) {
    const { limit = 50, offset = 0, category } = options;
    
    const artist = mockArtists.find(a => a.id === artistId.toString());
    if (!artist || !artist.portfolio) {
      return [];
    }
    
    let portfolio = [...artist.portfolio];
    
    // Apply category filter
    if (category) {
      portfolio = portfolio.filter(item => item.category === category);
    }
    
    // Apply pagination
    const paginatedPortfolio = portfolio.slice(offset, offset + limit);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return paginatedPortfolio;
  }

  async createArtist(artistData: Omit<Artist, 'id'>) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newArtist: Artist = {
      ...artistData,
      id: (mockArtists.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      portfolio: artistData.portfolio || []
    };
    
    mockArtists.push(newArtist);
    return newArtist;
  }

  async updateArtist(id: string | number, artistData: Partial<Artist>) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockArtists.findIndex(a => a.id === id.toString());
    if (index === -1) {
      throw new Error('Artista não encontrado');
    }
    
    const updatedArtist = {
      ...mockArtists[index],
      ...artistData,
      updated_at: new Date().toISOString()
    };
    
    mockArtists[index] = updatedArtist;
    return updatedArtist;
  }

  async deleteArtist(id: string | number) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockArtists.findIndex(a => a.id === id.toString());
    if (index === -1) {
      throw new Error('Artista não encontrado');
    }
    
    mockArtists.splice(index, 1);
    return true;
  }

  async addPortfolioItem(artistId: string | number, portfolioData: Omit<PortfolioItem, 'id' | 'created_at'>) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const artist = mockArtists.find(a => a.id === artistId.toString());
    if (!artist) {
      throw new Error('Artista não encontrado');
    }
    
    const newPortfolioItem: PortfolioItem = {
      ...portfolioData,
      id: `p${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    if (!artist.portfolio) {
      artist.portfolio = [];
    }
    
    artist.portfolio.push(newPortfolioItem);
    return newPortfolioItem;
  }

  async removePortfolioItem(portfolioId: string | number) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    for (const artist of mockArtists) {
      if (artist.portfolio) {
        const index = artist.portfolio.findIndex(p => p.id === portfolioId.toString());
        if (index !== -1) {
          artist.portfolio.splice(index, 1);
          return true;
        }
      }
    }
    
    throw new Error('Item do portfólio não encontrado');
  }
}

export const mockArtistsService = new MockArtistsService();
