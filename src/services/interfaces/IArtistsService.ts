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
  
  // New fields for enhanced functionality
  internal_notes?: string;
  pricing?: ArtistPricing;
  work_schedule?: WeeklySchedule;
  unavailable_periods?: UnavailablePeriod[];
  
  created_at?: string;
  updated_at?: string;
}

/**
 * Portfolio item interface - Enhanced
 */
export interface PortfolioItem {
  id: string;
  artist_id?: string;
  image_url: string;
  title: string;
  description: string;
  style: string;
  category: string;
  completion_date: string;
  client_name?: string;
  session_duration?: string;
  caption?: string;
  is_featured?: boolean;
  order_index?: number;
  created_at?: string;
}

/**
 * Pricing item interface
 */
export interface PricingItem {
  id: string;
  category: string;
  min_price: number;
  max_price?: number;
  description?: string;
  estimated_hours?: number;
}

/**
 * Artist pricing configuration
 */
export interface ArtistPricing {
  base_price_per_hour?: number;
  minimum_session_price?: number;
  hourly_rate?: number;
  pricing_items?: PricingItem[];
  additional_costs?: {
    consultation: number;
    design: number;
    touch_up: number;
  };
  payment_methods?: string[];
  pricing_notes?: string;
  services?: PricingService[];
}

/**
 * Pricing service
 */
export interface PricingService {
  id: string;
  name: string;
  description?: string;
  price?: number;
  price_type: 'fixed' | 'hourly' | 'custom';
}

/**
 * Weekly schedule
 */
export interface WeeklySchedule {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

/**
 * Day schedule
 */
export interface DaySchedule {
  is_available?: boolean;
  is_working?: boolean;
  start_time?: string; // Format: "HH:mm"
  end_time?: string;   // Format: "HH:mm"
  break_start?: string;
  break_end?: string;
}

/**
 * Unavailable period
 */
export interface UnavailablePeriod {
  id: string;
  artist_id?: string;
  start_date: string;
  end_date: string;
  reason: string;
  type?: 'vacation' | 'sick_leave' | 'workshop' | 'personal' | 'other';
  created_at?: string;
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

  /**
   * Update portfolio item order
   * @param portfolioItems Array of portfolio items with new order
   */
  updatePortfolioOrder?: (portfolioItems: { id: string; order_index: number }[]) => Promise<boolean>;

  /**
   * Add unavailable period
   * @param artistId Artist ID
   * @param periodData Unavailable period data
   */
  addUnavailablePeriod?: (artistId: string | number, periodData: Omit<UnavailablePeriod, 'id' | 'artist_id' | 'created_at'>) => Promise<UnavailablePeriod>;

  /**
   * Remove unavailable period
   * @param periodId Period ID
   */
  removeUnavailablePeriod?: (periodId: string | number) => Promise<boolean>;
}
