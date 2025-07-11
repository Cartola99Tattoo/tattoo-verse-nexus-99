
import { appConfig } from "@/config/appConfig";
import { isSupabaseConnected } from "@/integrations/supabase/client";

// Interfaces
import { IBlogService } from "./interfaces/IBlogService";
import { IAuthService } from "./interfaces/IAuthService";
import { IProductService } from "./interfaces/IProductService";
import { IDashboardService } from "./interfaces/IDashboardService";
import { IArtistsService } from "./interfaces/IArtistsService";
import { ITrackingService } from "./interfaces/ITrackingService";
import { IFinancialService } from './interfaces/IFinancialService';
import { IClientService } from './interfaces/IClientService';
import { IProjectService } from './interfaces/IProjectService';
import { IBedService } from './interfaces/IBedService';
import { IEventService } from './interfaces/IEventService';
import { ITattooArtistService } from './interfaces/ITattooArtistService';

// Mock services
import { mockBlogService } from "./mock/mockBlogService";
import { mockAuthService } from "./mock/mockAuthService";
import { mockProductService } from "./mock/mockProductService";
import { mockDashboardService } from "./mock/mockDashboardService";
import { mockArtistsService } from "./mock/mockArtistsService";
import { mockTrackingService } from "./mock/mockTrackingService";
import { mockFinancialService } from './mock/mockFinancialService';
import { mockClientService } from './mock/mockClientService';
import { mockProjectService } from './mock/mockProjectService';
import { mockBedService } from './mock/mockBedService';
import mockEventService from './mock/mockEventService';
import { mockUserProfileService } from "./mock/mockUserProfileService";
import { mockTattooArtistService } from './mock/mockTattooArtistService';
import { mockStudioService } from './mock/mockStudioService';
import { mockNaveMaeService } from './mock/mockNaveMaeService';

// Supabase services
import { supabaseFinancialService } from './supabase/SupabaseFinancialService';
import { supabaseArtistService } from './supabase/SupabaseArtistService';
import { supabaseProductService } from './supabase/SupabaseProductService';
import { supabaseAuthService } from './supabase/SupabaseAuthService';
import { supabaseStudioService } from './supabase/SupabaseStudioService';
import { supabaseNaveMaeService } from './supabase/SupabaseNaveMaeService';
import { handleSupabaseError } from "./supabaseService";

// Blog service factory
export const getBlogService = (): IBlogService => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock blog service");
    return mockBlogService;
  }
  
  // TODO: Implement SupabaseBlogService
  console.log("Using mock blog service (Supabase implementation pending)");
  return mockBlogService;
};

// Auth service factory - now uses Supabase when connected
export const getAuthService = (): IAuthService => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock auth service");
    return mockAuthService;
  }
  
  console.log("Using Supabase auth service");
  return supabaseAuthService;
};

// Product service factory
export const getProductService = (): IProductService => {
  console.log(`Using ${appConfig.dataSource.useMockData ? 'mock' : 'supabase'} product service`);
  
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    return mockProductService;
  }
  
  return supabaseProductService;
};

// Dashboard service factory
export const getDashboardService = (): IDashboardService => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock dashboard service");
    return mockDashboardService;
  }
  
  // TODO: Implement SupabaseDashboardService
  console.log("Using mock dashboard service (Supabase implementation pending)");
  return mockDashboardService;
};

// Artists service factory
export const getArtistsService = (): IArtistsService => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock artists service");
    return mockArtistsService;
  }
  
  console.log("Using Supabase artists service");
  return supabaseArtistService;
};

// Financial service factory
export const getFinancialService = (): IFinancialService => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock financial service");
    return mockFinancialService;
  }
  
  console.log("Using Supabase financial service");
  return supabaseFinancialService;
};

// Client Service Factory
export const getClientService = (): IClientService => {
  console.log(`Using ${appConfig.dataSource.useMockData ? 'mock' : 'supabase'} client service`);
  
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    return mockClientService;
  }
  
  // TODO: Implement SupabaseClientService when needed
  return mockClientService;
};

// Bed Service Factory
export const getBedService = (): IBedService => {
  console.log(`Using ${appConfig.dataSource.useMockData ? 'mock' : 'supabase'} bed service`);
  
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    return mockBedService;
  }
  
  // TODO: Implement SupabaseBedService when needed
  return mockBedService;
};

// Tracking Service Factory
export function getTrackingService(): ITrackingService {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock tracking service");
    return mockTrackingService;
  }
  
  // TODO: Implement SupabaseTrackingService
  return mockTrackingService;
}

// Project Service Factory
export function getProjectService(): IProjectService {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log('Using mock project service');
    return mockProjectService;
  } else {
    // TODO: Implement SupabaseProjectService when needed
    console.log('Using mock project service (Supabase implementation pending)');
    return mockProjectService;
  }
}

// Event Service Factory
export const getEventService = (): IEventService => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock event service");
    return mockEventService;
  }
  // TODO: Return SupabaseEventService when implemented
  return mockEventService;
};

// User Profile Service Factory
export const getUserProfileService = () => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock user profile service");
    return mockUserProfileService;
  }
  
  // TODO: Implement SupabaseUserProfileService
  return mockUserProfileService;
};

// Tattoo Artist Service Factory
export const getTattooArtistService = (): ITattooArtistService => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock tattoo artist service");
    return mockTattooArtistService;
  }
  
  // TODO: Implement SupabaseTattooArtistService
  console.log("Using mock tattoo artist service (Supabase implementation pending)");
  return mockTattooArtistService;
};

// NEW: Studio Service Factory for multi-tenant management
export const getStudioService = () => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock studio service");
    return mockStudioService;
  }
  
  console.log("Using Supabase studio service");
  return supabaseStudioService;
};

// NEW: Nave Mãe Service Factory for consolidated management
export const getNaveMaeService = () => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock nave mae service");
    return mockNaveMaeService;
  }
  
  console.log("Using Supabase nave mae service");
  return supabaseNaveMaeService;
};

// Export error handler
export { handleSupabaseError };
