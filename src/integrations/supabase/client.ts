
import { createClient } from '@supabase/supabase-js';

// Supabase connection config (we'll use hardcoded values for now)
const supabaseUrl = 'https://hlirmvgytxjvfoorvxsv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsaXJtdmd5dHhqdmZvb3J2eHN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzE4MjQsImV4cCI6MjA2MTEwNzgyNH0.RIAMZIvIWbuRyAk6usBMVdh3urYs6WINofL_4RgwK7A';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
