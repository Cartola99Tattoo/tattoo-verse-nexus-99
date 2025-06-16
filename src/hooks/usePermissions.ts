
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface UserPermissions {
  canViewOwnAppointments: boolean;
  canEditOwnAppointments: boolean;
  canViewClients: boolean;
  canAddClients: boolean;
  canEditOwnPortfolio: boolean;
  canViewFinancialSummary: boolean;
  canAccessShop: boolean;
  canViewReports: boolean;
}

export interface UserRole {
  role: 'admin' | 'tatuador';
  permissions?: UserPermissions;
}

const defaultAdminPermissions: UserPermissions = {
  canViewOwnAppointments: true,
  canEditOwnAppointments: true,
  canViewClients: true,
  canAddClients: true,
  canEditOwnPortfolio: true,
  canViewFinancialSummary: true,
  canAccessShop: true,
  canViewReports: true,
};

const defaultTatuadorPermissions: UserPermissions = {
  canViewOwnAppointments: true,
  canEditOwnAppointments: false,
  canViewClients: false,
  canAddClients: false,
  canEditOwnPortfolio: true,
  canViewFinancialSummary: false,
  canAccessShop: false,
  canViewReports: false,
};

export const usePermissions = () => {
  const { user, profile } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      // Para o usuário admin simulado
      if (profile.role === 'admin') {
        setUserRole({
          role: 'admin',
          permissions: defaultAdminPermissions
        });
      } else if (profile.role === 'artista') {
        // Simula buscar permissões específicas do tatuador
        // Em produção, isso viria do backend/Firestore
        setUserRole({
          role: 'tatuador',
          permissions: defaultTatuadorPermissions
        });
      }
      setIsLoading(false);
    }
  }, [profile]);

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!userRole) return false;
    
    // Admin sempre tem todas as permissões
    if (userRole.role === 'admin') return true;
    
    // Verifica permissão específica para tatuador
    return userRole.permissions?.[permission] || false;
  };

  const isAdmin = (): boolean => {
    return userRole?.role === 'admin' || false;
  };

  const isTatuador = (): boolean => {
    return userRole?.role === 'tatuador' || false;
  };

  return {
    userRole,
    isLoading,
    hasPermission,
    isAdmin,
    isTatuador,
  };
};
