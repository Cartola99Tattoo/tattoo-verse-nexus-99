
import { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

// Tipo para o perfil de usuário
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
  role: "cliente" | "artista" | "admin";
  tattoo_preferences?: any;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, first_name: string, last_name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ error: any }>;
  simulateAdminSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Always simulate an admin user automatically
  const [user] = useState<User | null>({
    id: "auto-admin-user",
    email: "admin@example.com",
    aud: "authenticated",
    role: "authenticated",
  } as User);
  
  const [profile] = useState<UserProfile | null>({
    id: "auto-admin-user",
    first_name: "Auto",
    last_name: "Admin",
    avatar_url: null,
    phone: null,
    email: "admin@example.com",
    role: "admin",
    tattoo_preferences: null
  });
  
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  // No-op functions since authentication is removed
  const signIn = async () => ({ error: null });
  const signUp = async () => ({ error: null });
  const signOut = async () => {};
  const resetPassword = async () => ({ error: null });
  const updateProfile = async () => ({ error: null });
  const simulateAdminSession = () => {};

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        simulateAdminSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
