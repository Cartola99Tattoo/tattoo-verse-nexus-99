
import { createClient } from '@supabase/supabase-js';
import { appConfig } from '@/config/appConfig';

// Supabase connection config (we'll use hardcoded values for now)
const supabaseUrl = 'https://hlirmvgytxjvfoorvxsv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsaXJtdmd5dHhqdmZvb3J2eHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzE4MjQsImV4cCI6MjA2MTEwNzgyNH0.RIAMZIvIWbuRyAk6usBMVdh3urYs6WINofL_4RgwK7A';

// Create Supabase client - only if we're not using mock data
export const supabase = appConfig.dataSource.useMockData ? 
  null :
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });

// Export a helper to check if we're connected to Supabase
export const isSupabaseConnected = () => !appConfig.dataSource.useMockData && supabase !== null;

// Create a warning function to use when trying to access Supabase while in mock mode
export const warnNotConnected = () => {
  console.warn("Attempting to use Supabase while in mock data mode. This operation will not work.");
  return null;
};
