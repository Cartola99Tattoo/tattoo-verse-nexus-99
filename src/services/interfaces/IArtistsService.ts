
/**
 * Artist interface
 */
export interface Artist {
  id: string;
  first_name: string;
  last_name: string;
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
  };
  rating?: number;
  total_reviews?: number;
}

/**
 * Portfolio item interface
 */
export interface PortfolioItem {
  id: string;
  image_url: string;
  description?: string;
  category?: string;
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
}
