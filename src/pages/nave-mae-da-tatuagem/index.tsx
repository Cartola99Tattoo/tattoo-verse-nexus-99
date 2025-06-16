
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Rocket, 
  Building, 
  Users, 
  Globe, 
  BarChart3,
  Zap,
  Shield,
  TrendingUp,
  Activity,
  DollarSign,
  Target,
  AlertTriangle
} from "lucide-react";

const NaveMaeDashboard = () => {
  const { profile } = useAuth();

  const globalStats = [
    { label: "Estúdios Ativos", value: "127", icon: Building, color: "bg-blue-500", change: "+12%" },
    { label: "Tatuadores Rede", value: "342", icon: Users, color: "bg-green-500", change: "+8%" },
    { label: "Plataformas Digitais", value: "89", icon: Globe, color: "bg-purple-500", change: "+15%" },
    { label: "Receita Mensal", value: "R$ 2.1M", icon: DollarSign, color: "bg-yellow-500", change: "+23%" },
  ];

  const systemHealth = [
    { system: "Autenticação Central", status: "online", uptime: "99.9%" },
    { system: "Banco de Dados", status: "online", uptime: "99.8%" },
    { system: "CDN Global", status: "warning", uptime: "97.2%" },
    { system: "APIs Externas", status: "online", uptime: "99.5%" },
  ];

  const recentActivities = [
    { action: "Novo estúdio digitalizado", studio: "Ink Masters SP", time: "2h atrás", type: "success" },
    { action: "Atualização de segurança", studio: "Sistema Global", time: "4h atrás", type: "info" },
    { action: "Backup automático", studio: "Dados Globais", time: "6h atrás", type: "success" },
    { action: "Alert: Alto tráfego", studio: "Servidor EU", time: "8h atrás", type: "warning" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "offline": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-600";
      case "warning": return "text-yellow-600";
      case "error": return "text-red-600";
      default: return "text-blue-600";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header de Boas-vindas */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Rocket className="h-8 w-8" />
              Central de Comando - Nave-Mãe
            </h1>
            <p className="text-red-100 text-lg">
              Bem-vindo, {profile?.first_name}! Gerencie todo o ecossistema 99Tattoo daqui.
            </p>
          </div>
          <div className="text-right">
            <Badge className="bg-white text-red-600 mb-2">
              <Shield className="h-3 w-3 mr-1" />
              Administrador Master
            </Badge>
            <p className="text-red-200 text-sm">Último acesso: Agora</p>
          </div>
        </div>
      </div>

      {/* Estatísticas Globais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change} vs mês anterior</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status dos Sistemas */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              Status dos Sistemas
            </CardTitle>
            <CardDescription>
              Monitoramento em tempo real da infraestrutura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemHealth.map((system, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${getStatusColor(system.status)} rounded-full`} />
                  <div>
                    <h4 className="font-medium text-gray-900">{system.system}</h4>
                    <p className="text-sm text-gray-600">Uptime: {system.uptime}</p>
                  </div>
                </div>
                <Badge variant={system.status === "online" ? "default" : "secondary"}>
                  {system.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Eventos importantes no ecossistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className={`font-medium ${getActivityColor(activity.type)}`}>
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600">{activity.studio}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas da Nave-Mãe */}
      <Card className="shadow-xl bg-gradient-to-r from-gray-50 to-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Centro de Comando Rápido
          </CardTitle>
          <CardDescription className="text-red-600">
            Gerencie operações críticas do ecossistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-24 flex-col bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Building className="h-6 w-6 mb-2" />
              <span className="text-sm">Gestão de Estúdios</span>
            </Button>
            <Button className="h-24 flex-col bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Rede de Tatuadores</span>
            </Button>
            <Button className="h-24 flex-col bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
              <Globe className="h-6 w-6 mb-2" />
              <span className="text-sm">Plataformas Digitais</span>
            </Button>
            <Button className="h-24 flex-col bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
              <Zap className="h-6 w-6 mb-2" />
              <span className="text-sm">Automações</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertas e Notificações */}
      <Card className="shadow-xl border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <AlertTriangle className="h-5 w-5" />
            Alertas e Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Atualização de Segurança Pendente</p>
                <p className="text-sm text-yellow-600">3 estúdios precisam aplicar a atualização crítica</p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto">
                Gerenciar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NaveMaeDashboard;
