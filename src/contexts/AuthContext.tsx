
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Tipo para o perfil de usuário
export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: "cliente" | "artista" | "admin";
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

  // Autenticação inicial e configuração do listener para mudanças de auth
  useEffect(() => {
    // Configurar o listener de mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Carregar o perfil apenas se o usuário estiver autenticado
        if (newSession?.user) {
          setTimeout(() => {
            fetchProfile(newSession.user.id);
          }, 0);
        } else {
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
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      // Carregar o perfil do usuário se estiver logado
      if (currentSession?.user) {
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
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        return;
      }

      setProfile(data as UserProfile);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  };

  // Função para login
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Função para registro
  const signUp = async (email: string, password: string, first_name: string, last_name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name,
            last_name
          }
        }
      });
      
      if (!error) {
        toast({
          title: "Registro realizado com sucesso",
          description: "Verifique seu e-mail para confirmar sua conta.",
        });
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  // Função para logout
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Função para recuperação de senha
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (!error) {
        toast({
          title: "E-mail de recuperação enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      }
      
      return { error };
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

      const { error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id);

      if (!error) {
        // Atualizar o perfil localmente
        setProfile(prev => prev ? { ...prev, ...profileData } : null);
        
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
      }

      return { error };
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
