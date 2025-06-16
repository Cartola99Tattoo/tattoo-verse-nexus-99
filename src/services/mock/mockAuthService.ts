import { appConfig } from "@/config/appConfig";
import { Session, User } from "@supabase/supabase-js";
import { UserProfile } from "@/contexts/AuthContext";
import { IAuthService } from "../interfaces/IAuthService";
import { simulateNetworkDelay, simulateError } from "./mockUtils";

// Mock user data - updated with new role types
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123", // In a real app, passwords would be hashed
    profile: {
      id: "1",
      first_name: "Admin",
      last_name: "User",
      avatar_url: null,
      phone: "555-1234",
      email: "admin@example.com",
      role: "admin_estudio" as const
    }
  },
  {
    id: "2",
    email: "artist@example.com",
    password: "artist123",
    profile: {
      id: "2",
      first_name: "Artist",
      last_name: "Creative",
      avatar_url: null,
      phone: "555-5678",
      email: "artist@example.com",
      role: "tatuador_da_nova_era" as const
    }
  },
  {
    id: "3",
    email: "client@example.com",
    password: "client123",
    profile: {
      id: "3",
      first_name: "Client",
      last_name: "Regular",
      avatar_url: null,
      phone: "555-9012",
      email: "client@example.com",
      role: "cliente" as const
    }
  },
  {
    id: "4",
    email: "navemae@example.com",
    password: "navemae123",
    profile: {
      id: "4",
      first_name: "Nave-Mãe",
      last_name: "Admin",
      avatar_url: null,
      phone: "555-0000",
      email: "navemae@example.com",
      role: "admin_nave_mae" as const
    }
  }
];

// Local storage keys
const LOCAL_STORAGE_AUTH_KEY = "mock_auth_session";

// Helper functions
const createMockSession = (user: typeof mockUsers[0]): Session => {
  return {
    access_token: `mock_token_${user.id}`,
    refresh_token: `mock_refresh_${user.id}`,
    user: {
      id: user.id,
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      email: user.email,
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: "",
      updated_at: new Date().toISOString()
    },
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    expires_in: 3600, // Adding the missing expires_in property (1 hour in seconds)
    token_type: "bearer" // Adding the missing token_type property
  };
};

// Mock AuthService implementation
export class MockAuthService implements IAuthService {
  private listeners: ((event: string, session: Session | null) => void)[] = [];
  
  constructor() {
    // Check if we have a stored session on initialization
    this.checkStoredSession();
  }
  
  private checkStoredSession() {
    const storedSession = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (storedSession) {
      const session = JSON.parse(storedSession);
      // Notify listeners of the existing session
      this.notifyListeners("SIGNED_IN", session);
    }
  }
  
  private notifyListeners(event: string, session: Session | null) {
    this.listeners.forEach(listener => listener(event, session));
  }
  
  private saveSession(session: Session | null) {
    if (session) {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }
  }
  
  async getSession(): Promise<Session | null> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockAuthService: getSession called");
    }
    
    const storedSession = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    return storedSession ? JSON.parse(storedSession) : null;
  }
  
  async getUser(): Promise<User | null> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockAuthService: getUser called");
    }
    
    const session = await this.getSession();
    return session?.user || null;
  }
  
  async signIn(email: string, password: string): Promise<{ error: any }> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockAuthService: signIn called with email:", email);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      return { error: new Error("Failed to sign in") };
    }
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      const session = createMockSession(user);
      this.saveSession(session);
      this.notifyListeners("SIGNED_IN", session);
      return { error: null };
    }
    
    return { error: { message: "Invalid login credentials" } };
  }
  
  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<{ error: any }> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockAuthService: signUp called with email:", email);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      return { error: new Error("Failed to sign up") };
    }
    
    if (mockUsers.some(u => u.email === email)) {
      return { error: { message: "Email already registered" } };
    }
    
    // In a real implementation, we would create a new user in the database
    // For mock purposes, we'll just return success without actually storing
    return { error: null };
  }
  
  async signOut(): Promise<void> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockAuthService: signOut called");
    }
    
    await simulateNetworkDelay();
    this.saveSession(null);
    this.notifyListeners("SIGNED_OUT", null);
  }
  
  async resetPassword(email: string): Promise<{ error: any }> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockAuthService: resetPassword called with email:", email);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      return { error: new Error("Failed to reset password") };
    }
    
    const userExists = mockUsers.some(u => u.email === email);
    if (!userExists) {
      return { error: { message: "User not found" } };
    }
    
    return { error: null };
  }
  
  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<{ error: any }> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockAuthService: updateProfile called for user:", userId);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      return { error: new Error("Failed to update profile") };
    }
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return { error: { message: "User not found" } };
    }
    
    // In a real implementation, we would update the user profile in the database
    // For mock purposes, we'll just return success without actually updating
    return { error: null };
  }
  
  async fetchProfile(userId: string): Promise<UserProfile | null> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockAuthService: fetchProfile called for user:", userId);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch profile");
    }
    
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.profile : null;
  }
  
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    this.listeners.push(callback);
    
    // Immediately notify with the current state
    this.getSession().then(session => {
      if (session) {
        callback("INITIAL_SESSION", session);
      }
    });
    
    // Return an object with unsubscribe method
    return {
      subscription: {
        unsubscribe: () => {
          const index = this.listeners.indexOf(callback);
          if (index !== -1) {
            this.listeners.splice(index, 1);
          }
        }
      }
    };
  }
}

// Export a singleton instance of the service
export const mockAuthService = new MockAuthService();
