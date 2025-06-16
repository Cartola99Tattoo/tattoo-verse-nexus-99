
import { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

// Tipo para o perfil de usuário expandido
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
  role: "cliente" | "tatuador_da_nova_era" | "admin_estudio" | "admin_nave_mae";
  tattoo_preferences?: any;
  studio_id?: string | null; // Para tatuadores associados a estúdios
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
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Simulando diferentes tipos de usuários para demonstração
  const [currentUserType, setCurrentUserType] = useState<"admin_nave_mae" | "admin_estudio" | "tatuador_da_nova_era" | "cliente">("admin_nave_mae");
  
  const [user] = useState<User | null>({
    id: "auto-admin-user",
    email: "admin@99tattoo.com",
    aud: "authenticated",
    role: "authenticated",
  } as User);
  
  const [profile] = useState<UserProfile | null>({
    id: "auto-admin-user",
    first_name: "Admin",
    last_name: "99Tattoo",
    avatar_url: null,
    phone: null,
    email: "admin@99tattoo.com",
    role: currentUserType,
    tattoo_preferences: null
  });
  
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  // Função para determinar o caminho de redirecionamento baseado no role
  const getRedirectPath = (): string => {
    if (!profile) return "/";
    
    switch (profile.role) {
      case "admin_nave_mae":
        return "/nave-mae-da-tatuagem";
      case "admin_estudio":
        return "/admin";
      case "tatuador_da_nova_era":
        return "/tatuadores-da-nova-era";
      case "cliente":
      default:
        return "/";
    }
  };

  // No-op functions since authentication is removed for now
  const signIn = async () => ({ error: null });
  const signUp = async () => ({ error: null });
  const signOut = async () => {};
  const resetPassword = async () => ({ error: null });
  const updateProfile = async () => ({ error: null });
  const simulateAdminSession = () => {
    // Cycle through different user types for testing
    const types: Array<typeof currentUserType> = ["admin_nave_mae", "admin_estudio", "tatuador_da_nova_era", "cliente"];
    const currentIndex = types.indexOf(currentUserType);
    const nextIndex = (currentIndex + 1) % types.length;
    setCurrentUserType(types[nextIndex]);
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
        simulateAdminSession,
        getRedirectPath,
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
