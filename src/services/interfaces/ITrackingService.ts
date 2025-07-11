
export interface UserEvent {
  eventType: 'pageView' | 'click' | 'search' | 'filter' | 'appointment' | 'contact' | 'custom';
  timestamp: number;
  userId?: string;
  sessionId: string;
  path: string;
  data?: Record<string, any>;
}

export interface UserProfile {
  interests: string[];
  preferredStyles: string[];
  interactions: {
    artists: Record<string, number>; // artistId -> interaction count
    products: Record<string, number>; // productId -> interaction count
    categories: Record<string, number>; // category -> interaction count
  };
  lastActivity: number;
}

export interface ITrackingService {
  // Track user events (page views, clicks, etc)
  trackEvent(event: Omit<UserEvent, 'timestamp'>): Promise<void>;
  
  // Get user session or create a new one
  getOrCreateSession(): string;
  
  // Get user profile data (for personalization)
  getUserProfile(userId?: string, sessionId?: string): Promise<UserProfile | null>;
  
  // Update user qualification data
  updateQualification(userId: string, data: {
    interestedIn?: string[];
    budget?: string;
    timeframe?: string;
    bodyLocation?: string;
    contactPreference?: string;
  }): Promise<void>;
}
