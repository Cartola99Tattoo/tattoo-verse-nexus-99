
// Simple auth hook for blog module
// To be expanded in the future for full authentication
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // For development only - create a mock user
  // In a real application, this would be replaced with actual Supabase auth
  useEffect(() => {
    const mockUser: User = {
      id: '12345',
      email: 'admin@example.com'
    };
    
    setUser(mockUser);
    setLoading(false);
  }, []);

  return { user, loading };
};
