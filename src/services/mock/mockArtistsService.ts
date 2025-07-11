import { IArtistsService, Artist, PortfolioItem, ArtistPricing, WeeklySchedule, UnavailablePeriod } from "../interfaces/IArtistsService";

export const mockArtistsService: IArtistsService = {
  fetchArtists: async (options = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockArtists: Artist[] = [
      {
        id: "1",
        first_name: "Marina",
        last_name: "Silva",
        email: "marina@99tattoo.com",
        phone: "+55 11 98765-4321",
        bio: "Especialista em tatuagens realistas com mais de 8 anos de experiência. Focada em retratos e natureza.",
        avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&h=150&auto=format&fit=crop",
        specialties: ["Realismo", "Retratos", "Natureza"],
        style: "Realismo",
        portfolio: [
          {
            id: "p1",
            artist_id: "1",
            image_url: "https://images.unsplash.com/photo-1565058379802-bbe93b2f9e5a?q=80&w=400&h=400&auto=format&fit=crop",
            title: "Retrato Realista",
            description: "Retrato em preto e branco no antebraço",
            style: "Realismo",
            category: "Retratos",
            completion_date: "2024-01-15",
            client_name: "João Silva",
            session_duration: "4 horas",
            caption: "Trabalho incrível de retrato realista",
            is_featured: true,
            order_index: 1,
            created_at: "2024-01-15T10:00:00Z"
          },
          {
            id: "p2",
            artist_id: "1",
            image_url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=400&h=400&auto=format&fit=crop",
            title: "Tatuagem Floral",
            description: "Flores realistas no braço",
            style: "Realismo",
            category: "Natureza",
            completion_date: "2024-01-20",
            client_name: "Maria Costa",
            session_duration: "3 horas",
            caption: "Detalhes incríveis em flores",
            is_featured: false,
            order_index: 2,
            created_at: "2024-01-20T14:00:00Z"
          }
        ],
        contact: {
          phone: "+55 11 98765-4321",
          email: "marina@99tattoo.com",
          instagram: "@marina_tattoo_artist",
          facebook: "Marina Silva Tattoo",
          tiktok: "@marina_tattoos"
        },
        rating: 4.9,
        total_reviews: 127,
        status: "active",
        commission_percentage: 60,
        availability_description: "Disponível de terça a sábado, das 10h às 19h",
        internal_notes: "Artista muito detalhista, especializada em trabalhos grandes",
        pricing: {
          base_price_per_hour: 200,
          minimum_session_price: 300,
          hourly_rate: 200,
          pricing_items: [
            {
              id: "pr1",
              category: "Retratos",
              min_price: 500,
              max_price: 2000,
              description: "Retratos realistas",
              estimated_hours: 4
            }
          ],
          additional_costs: {
            consultation: 50,
            design: 100,
            touch_up: 150
          },
          payment_methods: ["Dinheiro", "PIX", "Cartão"],
          pricing_notes: "Preços podem variar conforme complexidade",
          services: [
            {
              id: "s1",
              name: "Retrato Realista",
              description: "Retrato em preto e branco ou colorido",
              price: 800,
              price_type: "fixed"
            }
          ]
        },
        work_schedule: {
          tuesday: { is_available: true, is_working: true, start_time: "10:00", end_time: "19:00" },
          wednesday: { is_available: true, is_working: true, start_time: "10:00", end_time: "19:00" },
          thursday: { is_available: true, is_working: true, start_time: "10:00", end_time: "19:00" },
          friday: { is_available: true, is_working: true, start_time: "10:00", end_time: "19:00" },
          saturday: { is_available: true, is_working: true, start_time: "10:00", end_time: "17:00" }
        },
        unavailable_periods: [],
        locations: ["São Paulo - SP", "Santos - SP"],
        created_at: "2023-06-15T10:00:00Z",
        updated_at: "2024-01-20T15:30:00Z"
      },
      {
        id: "2",
        first_name: "Carlos",
        last_name: "Mendes",
        email: "carlos@99tattoo.com",
        phone: "+55 11 97654-3210",
        bio: "Mestre em blackwork e geometric tattoos. Criando arte corporal única há mais de 10 anos.",
        avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop",
        specialties: ["Blackwork", "Geometric", "Linework"],
        style: "Blackwork",
        portfolio: [
          {
            id: "p3",
            artist_id: "2",
            image_url: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=400&h=400&auto=format&fit=crop",
            title: "Mandala Geométrica",
            description: "Mandala complexa no ombro",
            style: "Geometric",
            category: "Mandala",
            completion_date: "2024-01-18",
            client_name: "Ana Paula",
            session_duration: "5 horas",
            caption: "Precisão geométrica perfeita",
            is_featured: true,
            order_index: 1,
            created_at: "2024-01-18T09:00:00Z"
          }
        ],
        contact: {
          phone: "+55 11 97654-3210",
          email: "carlos@99tattoo.com",
          instagram: "@carlos_blackwork",
          facebook: "Carlos Mendes Tattoo"
        },
        rating: 4.8,
        total_reviews: 89,
        status: "active",
        commission_percentage: 65,
        availability_description: "Disponível de segunda a sexta, das 9h às 18h",
        internal_notes: "Especialista em trabalhos geométricos complexos",
        pricing: {
          base_price_per_hour: 180,
          minimum_session_price: 250,
          hourly_rate: 180,
          pricing_items: [
            {
              id: "pr2",
              category: "Blackwork",
              min_price: 300,
              max_price: 1500,
              description: "Trabalhos em blackwork",
              estimated_hours: 3
            }
          ],
          additional_costs: {
            consultation: 40,
            design: 80,
            touch_up: 120
          },
          payment_methods: ["Dinheiro", "PIX"],
          pricing_notes: "Especializado em projetos geométricos",
          services: [
            {
              id: "s2",
              name: "Mandala Geométrica",
              description: "Mandalas e padrões geométricos",
              price: 600,
              price_type: "fixed"
            }
          ]
        },
        work_schedule: {
          monday: { is_available: true, is_working: true, start_time: "09:00", end_time: "18:00" },
          tuesday: { is_available: true, is_working: true, start_time: "09:00", end_time: "18:00" },
          wednesday: { is_available: true, is_working: true, start_time: "09:00", end_time: "18:00" },
          thursday: { is_available: true, is_working: true, start_time: "09:00", end_time: "18:00" },
          friday: { is_available: true, is_working: true, start_time: "09:00", end_time: "18:00" }
        },
        unavailable_periods: [],
        locations: ["São Paulo - SP", "Campinas - SP"],
        created_at: "2023-08-10T14:00:00Z",
        updated_at: "2024-01-18T16:45:00Z"
      },
      {
        id: "3",
        first_name: "Lucia",
        last_name: "Rodrigues",
        email: "lucia@99tattoo.com",
        phone: "+55 11 96543-2109",
        bio: "Artista especializada em aquarela e técnicas coloridas. Transformando pele em tela há 6 anos.",
        avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop",
        specialties: ["Aquarela", "Colorido", "Floral"],
        style: "Aquarela",
        portfolio: [
          {
            id: "p4",
            artist_id: "3",
            image_url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=400&h=400&auto=format&fit=crop",
            title: "Borboleta Aquarela",
            description: "Borboleta em estilo aquarela no pulso",
            style: "Aquarela",
            category: "Animais",
            completion_date: "2024-01-22",
            client_name: "Fernanda Lima",
            session_duration: "2 horas",
            caption: "Cores vibrantes em aquarela",
            is_featured: true,
            order_index: 1,
            created_at: "2024-01-22T11:00:00Z"
          },
          {
            id: "p5",
            artist_id: "3",
            image_url: "https://images.unsplash.com/photo-1565058379802-bbe93b2f9e5a?q=80&w=400&h=400&auto=format&fit=crop",
            title: "Flores Coloridas",
            description: "Buquê de flores no braço",
            style: "Aquarela",
            category: "Floral",
            completion_date: "2024-01-25",
            client_name: "Roberto Santos",
            session_duration: "3 horas",
            caption: "Explosão de cores naturais",
            is_featured: false,
            order_index: 2,
            created_at: "2024-01-25T13:30:00Z"
          }
        ],
        contact: {
          phone: "+55 11 96543-2109",
          email: "lucia@99tattoo.com",
          instagram: "@lucia_watercolor_tattoos",
          tiktok: "@lucia_tattoos"
        },
        rating: 4.7,
        total_reviews: 64,
        status: "active",
        commission_percentage: 55,
        availability_description: "Disponível de quarta a domingo, das 11h às 20h",
        internal_notes: "Excelente com cores, muito criativa",
        pricing: {
          base_price_per_hour: 160,
          minimum_session_price: 200,
          hourly_rate: 160,
          pricing_items: [
            {
              id: "pr3",
              category: "Aquarela",
              min_price: 250,
              max_price: 1200,
              description: "Tatuagens em aquarela",
              estimated_hours: 2
            }
          ],
          additional_costs: {
            consultation: 30,
            design: 60,
            touch_up: 100
          },
          payment_methods: ["Dinheiro", "PIX", "Cartão"],
          pricing_notes: "Cores especiais podem ter custo adicional",
          services: [
            {
              id: "s3",
              name: "Aquarela Floral",
              description: "Flores em estilo aquarela",
              price: 400,
              price_type: "fixed"
            }
          ]
        },
        work_schedule: {
          wednesday: { is_available: true, is_working: true, start_time: "11:00", end_time: "20:00" },
          thursday: { is_available: true, is_working: true, start_time: "11:00", end_time: "20:00" },
          friday: { is_available: true, is_working: true, start_time: "11:00", end_time: "20:00" },
          saturday: { is_available: true, is_working: true, start_time: "11:00", end_time: "20:00" },
          sunday: { is_available: true, is_working: true, start_time: "11:00", end_time: "18:00" }
        },
        unavailable_periods: [],
        locations: ["Rio de Janeiro - RJ", "Niterói - RJ"],
        created_at: "2023-09-20T16:00:00Z",
        updated_at: "2024-01-25T17:15:00Z"
      }
    ];

    let filteredArtists = mockArtists;

    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredArtists = filteredArtists.filter(artist =>
        artist.first_name.toLowerCase().includes(searchLower) ||
        artist.last_name.toLowerCase().includes(searchLower) ||
        artist.specialties.some(specialty => specialty.toLowerCase().includes(searchLower)) ||
        artist.style.toLowerCase().includes(searchLower)
      );
    }

    if (options.specialties && options.specialties.length > 0) {
      filteredArtists = filteredArtists.filter(artist =>
        options.specialties!.some(specialty => artist.specialties.includes(specialty))
      );
    }

    if (options.style) {
      filteredArtists = filteredArtists.filter(artist =>
        artist.style.toLowerCase().includes(options.style!.toLowerCase())
      );
    }

    if (options.status && options.status !== 'all') {
      filteredArtists = filteredArtists.filter(artist => artist.status === options.status);
    }

    const total = filteredArtists.length;
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    const totalPages = Math.ceil(total / limit);

    const paginatedArtists = filteredArtists.slice(offset, offset + limit);

    return {
      artists: paginatedArtists,
      total,
      totalPages
    };
  },

  fetchArtistById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const artists = await mockArtistsService.fetchArtists();
    return artists.artists.find(artist => artist.id === id.toString()) || null;
  },

  fetchArtistPortfolio: async (artistId, options = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const artist = await mockArtistsService.fetchArtistById(artistId);
    return artist?.portfolio || [];
  },

  createArtist: async (artistData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate a unique ID for the new artist
    const newArtistId = Math.random().toString(36).substring(2, 15);

    const newArtist: Artist = {
      id: newArtistId,
      ...artistData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Here you would typically save the new artist to a database
    // For the mock service, we'll just return the new artist
    return newArtist;
  },

  updateArtist: async (id, artistData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Here you would typically update the artist in a database
    // For the mock service, we'll just return the updated artist data
    const updatedArtist: Artist = {
      id: id.toString(),
      first_name: artistData.first_name || 'Updated First Name',
      last_name: artistData.last_name || 'Updated Last Name',
      email: artistData.email || 'updated@email.com',
      phone: artistData.phone || '+55 11 99999-9999',
      bio: artistData.bio || 'Updated bio',
      avatar_url: artistData.avatar_url || 'https://example.com/updated-avatar.jpg',
      specialties: artistData.specialties || ['Updated Specialty'],
      style: artistData.style || 'Updated Style',
      portfolio: artistData.portfolio || [],
      contact: artistData.contact || {
        phone: '+55 11 99999-9999',
        email: 'updated@email.com',
        instagram: '@updated_instagram',
        facebook: 'Updated Facebook',
        tiktok: '@updated_tiktok'
      },
      rating: artistData.rating || 4.5,
      total_reviews: artistData.total_reviews || 50,
      status: artistData.status || 'active',
      commission_percentage: artistData.commission_percentage || 50,
      availability_description: artistData.availability_description || 'Updated availability',
      internal_notes: artistData.internal_notes || 'Updated internal notes',
      pricing: artistData.pricing || {
        base_price_per_hour: 150,
        minimum_session_price: 200,
        hourly_rate: 150,
        pricing_items: [],
        additional_costs: {
          consultation: 30,
          design: 50,
          touch_up: 80
        },
        payment_methods: ['Dinheiro', 'PIX', 'Cartão'],
        pricing_notes: 'Updated pricing notes',
        services: []
      },
      work_schedule: artistData.work_schedule || {
        monday: { is_available: true, is_working: true, start_time: '09:00', end_time: '18:00' }
      },
      unavailable_periods: artistData.unavailable_periods || [],
      locations: artistData.locations || ['Updated Location'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return updatedArtist;
  },

  deleteArtist: async (id) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Here you would typically delete the artist from a database
    // For the mock service, we'll just return true
    return true;
  },

  addPortfolioItem: async (artistId, portfolioData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate a unique ID for the new portfolio item
    const newPortfolioItemId = Math.random().toString(36).substring(2, 15);

    const newPortfolioItem: PortfolioItem = {
      id: newPortfolioItemId,
      artist_id: artistId.toString(),
      ...portfolioData,
      created_at: new Date().toISOString(),
    };

    // Here you would typically save the new portfolio item to a database
    // For the mock service, we'll just return the new portfolio item
    return newPortfolioItem;
  },

  removePortfolioItem: async (portfolioId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Here you would typically delete the portfolio item from a database
    // For the mock service, we'll just return true
    return true;
  },

  updatePortfolioOrder: async (portfolioItems) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Here you would typically update the order of the portfolio items in a database
    // For the mock service, we'll just return true
    return true;
  },

  addUnavailablePeriod: async (artistId, periodData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate a unique ID for the new unavailable period
    const newPeriodId = Math.random().toString(36).substring(2, 15);

    const newPeriod: UnavailablePeriod = {
      id: newPeriodId,
      artist_id: artistId.toString(),
      ...periodData,
      created_at: new Date().toISOString(),
    };

    // Here you would typically save the new unavailable period to a database
    // For the mock service, we'll just return the new period
    return newPeriod;
  },

  removeUnavailablePeriod: async (periodId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Here you would typically delete the unavailable period from a database
    // For the mock service, we'll just return true
    return true;
  },
};

export default mockArtistsService;
