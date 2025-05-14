
import { createContext, useContext, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { getAuthService } from "@/services/serviceFactory";

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Get the auth service
  const authService = getAuthService();

  // Função para login - simulada
  const signIn = async (email: string, password: string) => {
    console.log("Modo de demonstração - login simulado para:", email);
    toast({
      title: "Modo de demonstração",
      description: "O site está em modo de demonstração. Todas as funcionalidades estão disponíveis sem login.",
    });
    return { error: null };
  };

  // Função para registro - simulada
  const signUp = async (email: string, password: string, first_name: string, last_name: string) => {
    console.log("Modo de demonstração - registro simulado para:", email);
    toast({
      title: "Modo de demonstração",
      description: "O site está em modo de demonstração. Todas as funcionalidades estão disponíveis sem login.",
    });
    return { error: null };
  };

  // Função para logout - simulada
  const signOut = async () => {
    console.log("Modo de demonstração - logout simulado");
    toast({
      title: "Modo de demonstração",
      description: "O site está em modo de demonstração. Todas as funcionalidades estão disponíveis sem login.",
    });
  };

  // Função para recuperação de senha - simulada
  const resetPassword = async (email: string) => {
    console.log("Modo de demonstração - recuperação de senha simulada para:", email);
    toast({
      title: "Modo de demonstração",
      description: "O site está em modo de demonstração. Todas as funcionalidades estão disponíveis sem login.",
    });
    return { error: null };
  };

  // Função para atualizar o perfil - simulada
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    console.log("Modo de demonstração - atualização de perfil simulada:", profileData);
    toast({
      title: "Modo de demonstração",
      description: "O site está em modo de demonstração. Todas as funcionalidades estão disponíveis sem login.",
    });
    return { error: null };
  };

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
