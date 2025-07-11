
import { ITrackingService, UserEvent, UserProfile } from "../interfaces/ITrackingService";
import { v4 as uuid } from 'uuid';

class MockTrackingService implements ITrackingService {
  private sessionId: string | null = null;
  private events: UserEvent[] = [];
  private userProfiles: Record<string, UserProfile> = {};

  constructor() {
    console.log("MockTrackingService initialized");
    
    // Load session from localStorage if it exists
    this.sessionId = localStorage.getItem('sessionId');
    
    // Simulate some existing user profiles for testing
    this.initializeMockProfiles();
  }

  private initializeMockProfiles() {
    // Create some mock user profiles
    const mockProfiles: Record<string, UserProfile> = {
      'user-1': {
        interests: ['tattoo', 'piercing'],
        preferredStyles: ['Blackwork', 'Old School'],
        interactions: {
          artists: { 'artist-1': 5, 'artist-2': 3 },
          products: { 'product-1': 2 },
          categories: { 'Blackwork': 7, 'Old School': 4 }
        },
        lastActivity: Date.now() - 86400000 // Yesterday
      },
      'user-2': {
        interests: ['tattoo'],
        preferredStyles: ['Realismo', 'Aquarela'],
        interactions: {
          artists: { 'artist-3': 8, 'artist-4': 2 },
          products: { 'product-2': 3, 'product-3': 1 },
          categories: { 'Realismo': 9, 'Aquarela': 3 }
        },
        lastActivity: Date.now() - 3600000 // 1 hour ago
      }
    };
    
    this.userProfiles = mockProfiles;
  }

  public async trackEvent(eventData: Omit<UserEvent, 'timestamp'>): Promise<void> {
    const event: UserEvent = {
      ...eventData,
      timestamp: Date.now(),
      sessionId: eventData.sessionId || this.getOrCreateSession()
    };
    
    console.log("Tracking event:", event);
    this.events.push(event);
    
    // In a real implementation, this would be sent to an analytics service or stored in a database
    
    // Update user profile based on the event
    this.updateUserProfileFromEvent(event);
    
    return Promise.resolve();
  }

  public getOrCreateSession(): string {
    if (!this.sessionId) {
      this.sessionId = uuid();
      localStorage.setItem('sessionId', this.sessionId);
    }
    
    return this.sessionId;
  }

  public async getUserProfile(userId?: string, sessionId?: string): Promise<UserProfile | null> {
    // In a real implementation, this would fetch from a database
    
    // If we have a userId, use that directly
    if (userId && this.userProfiles[userId]) {
      return this.userProfiles[userId];
    }
    
    // If we don't have a user profile yet but have a sessionId, create a new one
    const sid = sessionId || this.getOrCreateSession();
    
    // Look for a profile that matches this sessionId
    // In a real implementation, we would query the database for a profile with this sessionId
    
    // For now, just create a new empty profile if we don't have one
    if (!userId) {
      return {
        interests: [],
        preferredStyles: [],
        interactions: {
          artists: {},
          products: {},
          categories: {}
        },
        lastActivity: Date.now()
      };
    }
    
    return null;
  }

  public async updateQualification(userId: string, data: {
    interestedIn?: string[];
    budget?: string;
    timeframe?: string;
    bodyLocation?: string;
    contactPreference?: string;
  }): Promise<void> {
    console.log(`Updating qualification for user ${userId}:`, data);
    
    // In a real implementation, this would update a database
    
    // For the mock implementation, just log it
    if (!this.userProfiles[userId]) {
      this.userProfiles[userId] = {
        interests: [],
        preferredStyles: [],
        interactions: {
          artists: {},
          products: {},
          categories: {}
        },
        lastActivity: Date.now()
      };
    }
    
    // Update interests based on qualifications
    if (data.interestedIn) {
      this.userProfiles[userId].interests = [
        ...new Set([...this.userProfiles[userId].interests, ...data.interestedIn])
      ];
    }
    
    // Update last activity
    this.userProfiles[userId].lastActivity = Date.now();
    
    return Promise.resolve();
  }

  private updateUserProfileFromEvent(event: UserEvent): void {
    const { userId, eventType, data } = event;
    
    if (!userId) return; // Anonymous events don't update user profiles
    
    // Make sure user has a profile
    if (!this.userProfiles[userId]) {
      this.userProfiles[userId] = {
        interests: [],
        preferredStyles: [],
        interactions: {
          artists: {},
          products: {},
          categories: {}
        },
        lastActivity: Date.now()
      };
    }
    
    const profile = this.userProfiles[userId];
    
    // Update last activity
    profile.lastActivity = event.timestamp;
    
    // Update based on event type
    if (eventType === 'pageView' && data?.pageType) {
      if (data.pageType === 'artist' && data.artistId) {
        profile.interactions.artists[data.artistId] = 
          (profile.interactions.artists[data.artistId] || 0) + 1;
      } 
      else if (data.pageType === 'product' && data.productId) {
        profile.interactions.products[data.productId] = 
          (profile.interactions.products[data.productId] || 0) + 1;
      }
    }
    
    // If this is a filter or search event, update interests
    if ((eventType === 'filter' || eventType === 'search') && data?.category) {
      profile.interactions.categories[data.category] = 
        (profile.interactions.categories[data.category] || 0) + 1;
        
      // If searched for a style, add to preferred styles
      if (data.category && !profile.preferredStyles.includes(data.category)) {
        profile.preferredStyles.push(data.category);
      }
    }
    
    // In a real implementation, this would be persisted to a database
  }
}

export const mockTrackingService = new MockTrackingService();
