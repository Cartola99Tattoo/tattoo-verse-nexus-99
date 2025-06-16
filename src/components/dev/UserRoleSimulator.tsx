
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Building, Palette, Users, LogOut } from "lucide-react";

const UserRoleSimulator = () => {
  const { profile, simulateUserRole, signOut, getRedirectPath } = useAuth();

  const roles = [
    {
      key: "admin_nave_mae" as const,
      label: "Admin Nave-Mãe",
      description: "Central de comando 99Tattoo",
      icon: Building,
      color: "bg-red-600 text-white"
    },
    {
      key: "admin_estudio" as const,
      label: "Admin Estúdio", 
      description: "Cliente da consultoria",
      icon: UserCheck,
      color: "bg-blue-600 text-white"
    },
    {
      key: "tatuador_da_nova_era" as const,
      label: "Tatuador Nova Era",
      description: "Comunidade de tatuadores",
      icon: Palette,
      color: "bg-purple-600 text-white"
    },
    {
      key: "cliente" as const,
      label: "Cliente Final",
      description: "Usuário público",
      icon: Users,
      color: "bg-green-600 text-white"
    }
  ];

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <Card className="fixed top-4 right-4 w-80 z-50 shadow-xl border-2 border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          Simulador de Usuário (Dev)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Usuário atual */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Usuário atual:</span>
          <Badge variant="outline" className="text-xs">
            {profile?.role || "Nenhum"}
          </Badge>
        </div>

        {/* Botões de role */}
        <div className="grid grid-cols-2 gap-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = profile?.role === role.key;
            
            return (
              <Button
                key={role.key}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={`h-auto p-2 flex flex-col gap-1 ${isActive ? role.color : ""}`}
                onClick={() => simulateUserRole(role.key)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{role.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Ações de navegação */}
        <div className="border-t pt-3 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleNavigate(getRedirectPath())}
          >
            Ir para Dashboard
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Info do path atual */}
        <div className="text-xs text-gray-500 border-t pt-2">
          Path: {getRedirectPath()}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRoleSimulator;
