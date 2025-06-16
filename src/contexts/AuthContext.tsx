
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
  simulateUserRole: (role: UserProfile["role"]) => void;
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários mock para simulação
const mockUsers = {
  admin_nave_mae: {
    id: "nave-mae-user",
    email: "navemae@99tattoo.com",
    first_name: "Admin",
    last_name: "Nave-Mãe",
    role: "admin_nave_mae" as const
  },
  admin_estudio: {
    id: "estudio-user", 
    email: "estudio@99tattoo.com",
    first_name: "Admin",
    last_name: "Estúdio",
    role: "admin_estudio" as const
  },
  tatuador_da_nova_era: {
    id: "tatuador-user",
    email: "tatuador@99tattoo.com", 
    first_name: "Tatuador",
    last_name: "Nova Era",
    role: "tatuador_da_nova_era" as const
  },
  cliente: {
    id: "cliente-user",
    email: "cliente@99tattoo.com",
    first_name: "Cliente",
    last_name: "Final", 
    role: "cliente" as const
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado dinâmico baseado em localStorage para persistir durante desenvolvimento
  const [currentRole, setCurrentRole] = useState<UserProfile["role"]>(() => {
    const stored = localStorage.getItem("99tattoo_dev_role");
    return (stored as UserProfile["role"]) || "admin_nave_mae";
  });
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  // Atualizar usuário quando o role muda
  useEffect(() => {
    const mockUser = mockUsers[currentRole];
    console.log("AuthContext: Changing user role to:", currentRole, mockUser);
    
    setUser({
      id: mockUser.id,
      email: mockUser.email,
      aud: "authenticated",
      role: "authenticated",
    } as User);

    setProfile({
      id: mockUser.id,
      first_name: mockUser.first_name,
      last_name: mockUser.last_name,
      avatar_url: null,
      phone: null,
      email: mockUser.email,
      role: mockUser.role,
      tattoo_preferences: null
    });

    // Persistir role no localStorage
    localStorage.setItem("99tattoo_dev_role", currentRole);
  }, [currentRole]);

  // Função para determinar o caminho de redirecionamento baseado no role
  const getRedirectPath = (): string => {
    if (!profile) return "/";
    
    console.log("AuthContext: Getting redirect path for role:", profile.role);
    
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

  // Função para simular mudança de role (apenas para desenvolvimento)
  const simulateUserRole = (role: UserProfile["role"]) => {
    console.log("AuthContext: Simulating user role change to:", role);
    setCurrentRole(role);
    toast({
      title: "Role simulado alterado",
      description: `Agora você está logado como: ${role}`,
    });
  };

  // No-op functions para manter compatibilidade
  const signIn = async () => ({ error: null });
  const signUp = async () => ({ error: null });
  const signOut = async () => {
    console.log("AuthContext: Signing out");
    // Reset para role padrão
    setCurrentRole("cliente");
  };
  const resetPassword = async () => ({ error: null });
  const updateProfile = async () => ({ error: null });

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
        simulateUserRole,
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
