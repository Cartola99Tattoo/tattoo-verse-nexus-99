
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
  role: 'admin_nave_mae' | 'admin_estudio' | 'tatuador_da_nova_era' | 'cliente';
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
      // Para administradores (nave-mãe e estúdio)
      if (profile.role === 'admin_nave_mae' || profile.role === 'admin_estudio') {
        setUserRole({
          role: profile.role,
          permissions: defaultAdminPermissions
        });
      } else if (profile.role === 'tatuador_da_nova_era') {
        // Simula buscar permissões específicas do tatuador
        // Em produção, isso viria do backend/Firestore
        setUserRole({
          role: 'tatuador_da_nova_era',
          permissions: defaultTatuadorPermissions
        });
      } else if (profile.role === 'cliente') {
        setUserRole({
          role: 'cliente',
          permissions: {
            canViewOwnAppointments: true,
            canEditOwnAppointments: false,
            canViewClients: false,
            canAddClients: false,
            canEditOwnPortfolio: false,
            canViewFinancialSummary: false,
            canAccessShop: true,
            canViewReports: false,
          }
        });
      }
      setIsLoading(false);
    }
  }, [profile]);

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!userRole) return false;
    
    // Admins sempre têm todas as permissões
    if (userRole.role === 'admin_nave_mae' || userRole.role === 'admin_estudio') return true;
    
    // Verifica permissão específica para outros tipos
    return userRole.permissions?.[permission] || false;
  };

  const isAdmin = (): boolean => {
    return userRole?.role === 'admin_nave_mae' || userRole?.role === 'admin_estudio' || false;
  };

  const isTatuador = (): boolean => {
    return userRole?.role === 'tatuador_da_nova_era' || false;
  };

  return {
    userRole,
    isLoading,
    hasPermission,
    isAdmin,
    isTatuador,
  };
};
