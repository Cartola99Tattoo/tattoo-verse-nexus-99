
import { faker } from '@faker-js/faker';

// Generate mock portfolio images
const generatePortfolioImages = (count = 6) => {
  return Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    image_url: `https://picsum.photos/seed/${faker.number.int({ min: 100, max: 999 })}/600/800`,
    description: faker.lorem.sentence(),
    category: faker.helpers.arrayElement(['Blackwork', 'Realismo', 'Aquarela', 'Old School', 'Minimalista']),
    created_at: faker.date.past().toISOString()
  }));
};

// Generate mock artists
const mockArtists = Array.from({ length: 8 }, (_, index) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const id = faker.string.uuid();
  
  return {
    id,
    first_name: firstName,
    last_name: lastName,
    bio: faker.lorem.paragraphs(3),
    avatar_url: `https://i.pravatar.cc/300?img=${index + 1}`,
    specialties: faker.helpers.arrayElements(
      ['Realismo', 'Blackwork', 'Aquarela', 'Geométrico', 'Old School', 'Minimalista', 'Tribal', 'Oriental'],
      faker.number.int({ min: 1, max: 4 })
    ),
    style: faker.helpers.arrayElement(['Realismo', 'Blackwork', 'Aquarela', 'Geométrico', 'Old School']),
    portfolio: generatePortfolioImages(faker.number.int({ min: 6, max: 12 })),
    contact: {
      phone: faker.phone.number(),
      email: faker.internet.email({ firstName, lastName }),
      instagram: `@${firstName.toLowerCase()}_tattoo`,
      facebook: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`
    },
    rating: faker.number.float({ min: 4.0, max: 5.0, fractionDigits: 1 }),
    total_reviews: faker.number.int({ min: 5, max: 200 })
  };
});

// Artists service interface implementation
export const mockArtistsService = {
  // Fetch all artists with optional filtering
  fetchArtists: async (options?: {
    limit?: number;
    offset?: number;
    specialties?: string[];
    style?: string;
    search?: string;
  }) => {
    console.info('MockArtistsService: fetchArtists called', options);
    
    let filteredArtists = [...mockArtists];
    
    // Apply filters
    if (options?.specialties && options.specialties.length > 0) {
      // Fix type error by using string comparison instead of strict typing
      filteredArtists = filteredArtists.filter(artist => 
        options.specialties?.some(specialty => 
          artist.specialties.some(artSpecialty => 
            artSpecialty.toLowerCase() === specialty.toLowerCase()
          )
        )
      );
    }
    
    if (options?.style) {
      // Fix type error by using string comparison instead of strictly typed comparison
      filteredArtists = filteredArtists.filter(artist => 
        artist.style.toLowerCase() === options.style?.toLowerCase()
      );
    }
    
    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      filteredArtists = filteredArtists.filter(artist => 
        artist.first_name.toLowerCase().includes(searchLower) || 
        artist.last_name.toLowerCase().includes(searchLower)
      );
    }
    
    // Calculate total before pagination
    const total = filteredArtists.length;
    
    // Apply pagination
    const limit = options?.limit || 10;
    const offset = options?.offset || 0;
    filteredArtists = filteredArtists.slice(offset, offset + limit);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      artists: filteredArtists,
      total,
      totalPages: Math.ceil(total / limit)
    };
  },
  
  // Fetch a single artist by ID
  fetchArtistById: async (id: string | number) => {
    console.info(`MockArtistsService: fetchArtistById called with id ${id}`);
    
    const artist = mockArtists.find(a => a.id === id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return artist || null;
  },
  
  // Fetch portfolio for an artist
  fetchArtistPortfolio: async (artistId: string | number, options?: {
    limit?: number;
    offset?: number;
    category?: string;
  }) => {
    console.info(`MockArtistsService: fetchArtistPortfolio called for artist ${artistId}`, options);
    
    const artist = mockArtists.find(a => a.id === artistId);
    if (!artist) return [];
    
    let portfolio = [...artist.portfolio];
    
    // Apply filters - Fix type issue by comparing strings without strict typing
    if (options?.category) {
      portfolio = portfolio.filter(item => 
        item.category.toLowerCase() === options.category?.toLowerCase()
      );
    }
    
    // Apply pagination
    const limit = options?.limit || 10;
    const offset = options?.offset || 0;
    portfolio = portfolio.slice(offset, offset + limit);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return portfolio;
  }
};
