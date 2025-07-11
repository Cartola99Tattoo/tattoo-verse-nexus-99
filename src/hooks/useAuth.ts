
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getAuthService } from '@/services/serviceFactory';
import { UserPermissions } from '@/services/supabase/SupabaseAuthService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  permissions: UserPermissions | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  refreshPermissions: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  const authService = getAuthService();

  const refreshPermissions = async () => {
    if (user) {
      try {
        const userPermissions = await authService.getUserPermissions?.(user.id);
        setPermissions(userPermissions || null);
      } catch (error) {
        console.error('Error fetching user permissions:', error);
        setPermissions(null);
      }
    } else {
      setPermissions(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (!result.error) {
      const currentSession = await authService.getSession();
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(currentSession.user);
        await refreshPermissions();
      }
    }
    return result;
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const result = await authService.signUp(email, password, firstName, lastName);
    return result;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
    setPermissions(null);
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentSession = await authService.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          await refreshPermissions();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { subscription } = authService.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshPermissions();
      } else {
        setPermissions(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    permissions,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshPermissions
  };
};
