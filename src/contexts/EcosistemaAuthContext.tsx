
import { createContext, useContext, useState, ReactNode } from "react";
import { mockUsers } from "@/data/ecosistemaBenefits";

export type UserRole = "cliente" | "admin_estudio" | "tatuador_da_nova_era" | "admin_nave_mae";

export interface EcosistemaUser {
  email: string;
  name: string;
  role: UserRole;
}

interface EcosistemaAuthContextType {
  user: EcosistemaUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const EcosistemaAuthContext = createContext<EcosistemaAuthContextType | undefined>(undefined);

export function EcosistemaAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<EcosistemaUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser({
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role as UserRole
      });
      setIsLoading(false);
      return { success: true };
    } else {
      setIsLoading(false);
      return { success: false, error: "Credenciais inválidas" };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <EcosistemaAuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading
    }}>
      {children}
    </EcosistemaAuthContext.Provider>
  );
}

export function useEcosistemaAuth() {
  const context = useContext(EcosistemaAuthContext);
  if (context === undefined) {
    throw new Error("useEcosistemaAuth deve ser usado dentro de um EcosistemaAuthProvider");
  }
  return context;
}

export function getRedirectUrlByRole(role: UserRole): string {
  switch (role) {
    case "cliente":
      return "/";
    case "admin_estudio":
      return "/admin";
    case "tatuador_da_nova_era":
      return "/tatuadores-da-nova-era/dashboard";
    case "admin_nave_mae":
      return "/nave-mae-da-tatuagem";
    default:
      return "/";
  }
}
