
/**
 * Artist interface
 */
export interface Artist {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  bio: string;
  avatar_url: string;
  specialties: string[];
  style: string;
  portfolio?: PortfolioItem[];
  contact: {
    phone?: string;
    email?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  rating?: number;
  total_reviews?: number;
  status: 'active' | 'inactive';
  commission_percentage: number;
  availability_description?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Portfolio item interface
 */
export interface PortfolioItem {
  id: string;
  artist_id: string;
  image_url: string;
  description?: string;
  category?: string;
  is_featured: boolean;
  created_at: string;
}

/**
 * Artists fetch options interface
 */
export interface ArtistsQueryParams {
  limit?: number;
  offset?: number;
  specialties?: string[];
  style?: string;
  search?: string;
  status?: 'active' | 'inactive' | 'all';
}

/**
 * Artists service interface
 */
export interface IArtistsService {
  /**
   * Fetch artists with optional filtering
   * @param options Query parameters
   */
  fetchArtists: (options?: ArtistsQueryParams) => Promise<{
    artists: Artist[];
    total: number;
    totalPages: number;
  }>;
  
  /**
   * Fetch a single artist by ID
   * @param id Artist ID
   */
  fetchArtistById: (id: string | number) => Promise<Artist | null>;
  
  /**
   * Fetch portfolio items for an artist
   * @param artistId Artist ID
   * @param options Query parameters
   */
  fetchArtistPortfolio: (artistId: string | number, options?: {
    limit?: number;
    offset?: number;
    category?: string;
  }) => Promise<PortfolioItem[]>;

  /**
   * Create a new artist
   * @param artistData Artist data without ID
   */
  createArtist?: (artistData: Omit<Artist, 'id'>) => Promise<Artist>;

  /**
   * Update an existing artist
   * @param id Artist ID
   * @param artistData Partial artist data
   */
  updateArtist?: (id: string | number, artistData: Partial<Artist>) => Promise<Artist>;

  /**
   * Delete an artist
   * @param id Artist ID
   */
  deleteArtist?: (id: string | number) => Promise<boolean>;

  /**
   * Add portfolio item to artist
   * @param artistId Artist ID
   * @param portfolioData Portfolio item data
   */
  addPortfolioItem?: (artistId: string | number, portfolioData: Omit<PortfolioItem, 'id' | 'created_at'>) => Promise<PortfolioItem>;

  /**
   * Remove portfolio item
   * @param portfolioId Portfolio item ID
   */
  removePortfolioItem?: (portfolioId: string | number) => Promise<boolean>;
}
