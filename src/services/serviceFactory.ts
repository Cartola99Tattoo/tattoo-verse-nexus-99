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

// Mock services
import { mockBlogService } from "./mock/mockBlogService";
import { mockAuthService } from "./mock/mockAuthService";
import { mockProductService } from "./mock/mockProductService";
import { mockDashboardService } from "./mock/mockDashboardService";
import { mockArtistsService } from "./mock/mockArtistsService";
import { mockTrackingService } from "./mock/mockTrackingService";
import { mockFinancialService } from './mock/mockFinancialService';

// Supabase services
import { supabaseFinancialService } from './supabase/SupabaseFinancialService';
import { handleSupabaseError } from "./supabaseService";

// Blog service factory
export const getBlogService = (): IBlogService => {
  if (appConfig.dataSource.useMockData) {
    return mockBlogService;
  }
  
  // This would be a real implementation that uses Supabase
  // For now we'll return the mock service
  return mockBlogService;
};

// Auth service factory
export const getAuthService = (): IAuthService => {
  if (appConfig.dataSource.useMockData) {
    return mockAuthService;
  }
  
  // This would be a real implementation that uses Supabase
  // For now we'll return the mock service
  return mockAuthService;
};

// Product service factory
export const getProductService = (): IProductService => {
  if (appConfig.dataSource.useMockData) {
    return mockProductService;
  }
  
  // This would be a real implementation that uses Supabase
  // For now we'll return the mock service
  return mockProductService;
};

// Dashboard service factory
export const getDashboardService = (): IDashboardService => {
  if (appConfig.dataSource.useMockData) {
    return mockDashboardService;
  }
  
  // This would be a real implementation that uses Supabase
  // For now we'll return the mock service
  return mockDashboardService;
};

// Artists service factory
export const getArtistsService = (): IArtistsService => {
  if (appConfig.dataSource.useMockData) {
    return mockArtistsService;
  }
  
  // This would be a real implementation that uses Supabase
  // For now we'll return the mock service
  return mockArtistsService;
};

// Financial service factory - agora usa Supabase quando conectado
export const getFinancialService = (): IFinancialService => {
  if (appConfig.dataSource.useMockData || !isSupabaseConnected()) {
    console.log("Using mock financial service");
    return mockFinancialService;
  }
  
  console.log("Using Supabase financial service");
  return supabaseFinancialService;
};

// Export the error handler for convenience
export { handleSupabaseError };

export function getTrackingService(): ITrackingService {
  // If we're using Supabase, return the Supabase implementation
  // if (useSupabase) {
  //   return new SupabaseTrackingService();
  // }
  
  // Otherwise return the mock implementation
  return mockTrackingService;
}
