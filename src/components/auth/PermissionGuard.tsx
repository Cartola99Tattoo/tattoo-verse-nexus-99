
import React from "react";
import { usePermissions, UserPermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, XCircle } from "lucide-react";

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: keyof UserPermissions;
  adminOnly?: boolean;
  fallback?: React.ReactNode;
}

const PermissionGuard = ({ 
  children, 
  permission, 
  adminOnly = false, 
  fallback 
}: PermissionGuardProps) => {
  const { hasPermission, isAdmin, isLoading } = usePermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Verifica se é apenas para admin
  if (adminOnly && !isAdmin()) {
    return fallback || (
      <Alert className="border-red-200 bg-red-50 m-4">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">
          Acesso restrito a administradores.
        </AlertDescription>
      </Alert>
    );
  }

  // Verifica permissão específica
  if (permission && !hasPermission(permission)) {
    return fallback || (
      <Alert className="border-yellow-200 bg-yellow-50 m-4">
        <Shield className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-700">
          Você não tem permissão para acessar esta funcionalidade.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
