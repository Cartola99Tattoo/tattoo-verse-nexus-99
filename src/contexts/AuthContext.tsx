
import { createContext, useContext, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  
  // Get the auth service
  const authService = getAuthService();

  // Autenticação inicial e configuração do listener para mudanças de auth
  useEffect(() => {
    console.log("Iniciando AuthProvider...");
    
    // Configurar o listener de mudanças de estado de autenticação
    const { subscription } = authService.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed event:", event);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Carregar o perfil apenas se o usuário estiver autenticado
        if (newSession?.user) {
          console.log("Usuário autenticado, carregando perfil...");
          setTimeout(() => {
            fetchProfile(newSession.user.id);
          }, 0);
        } else {
          console.log("Usuário não autenticado, limpando perfil");
          setProfile(null);
        }

        // Mostrar toasts para eventos de autenticação
        if (event === 'SIGNED_IN') {
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo de volta!`,
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logout realizado com sucesso",
            description: "Volte logo!",
          });
        }
      }
    );

    // Verificar a sessão atual
    authService.getSession().then((currentSession) => {
      console.log("Session check result:", currentSession ? "Session found" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      // Carregar o perfil do usuário se estiver logado
      if (currentSession?.user) {
        console.log("Carregando perfil do usuário da sessão atual...");
        fetchProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para buscar o perfil do usuário
  const fetchProfile = async (userId: string) => {
    try {
      console.log("Buscando perfil para o userId:", userId);
      
      const userProfile = await authService.fetchProfile(userId);

      if (userProfile) {
        console.log("Perfil recebido:", userProfile);
        setProfile(userProfile);
        console.log("Perfil atualizado no estado:", userProfile);
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  };

  // Função para login
  const signIn = async (email: string, password: string) => {
    try {
      return await authService.signIn(email, password);
    } catch (error) {
      return { error };
    }
  };

  // Função para registro
  const signUp = async (email: string, password: string, first_name: string, last_name: string) => {
    try {
      const result = await authService.signUp(email, password, first_name, last_name);
      
      if (!result.error) {
        toast({
          title: "Registro realizado com sucesso",
          description: "Verifique seu e-mail para confirmar sua conta.",
        });
      }
      
      return result;
    } catch (error) {
      return { error };
    }
  };

  // Função para logout
  const signOut = async () => {
    await authService.signOut();
  };

  // Função para recuperação de senha
  const resetPassword = async (email: string) => {
    try {
      const result = await authService.resetPassword(email);
      
      if (!result.error) {
        toast({
          title: "E-mail de recuperação enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      }
      
      return result;
    } catch (error) {
      return { error };
    }
  };

  // Função para atualizar o perfil
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      if (!user) {
        return { error: new Error("Usuário não autenticado") };
      }

      const result = await authService.updateProfile(user.id, profileData);

      if (!result.error) {
        // Atualizar o perfil localmente
        setProfile(prev => prev ? { ...prev, ...profileData } : null);
        
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      }

      return result;
    } catch (error) {
      return { error };
    }
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
