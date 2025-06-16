
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Image, 
  Star,
  ArrowRight,
  Zap,
  Target,
  Award,
  BookOpen
} from "lucide-react";

const TatuadoresDashboard = () => {
  const { profile } = useAuth();

  const stats = [
    { label: "Clientes este mês", value: "23", icon: Users, color: "bg-blue-500" },
    { label: "Agendamentos", value: "12", icon: Calendar, color: "bg-green-500" },
    { label: "Fotos no portfólio", value: "47", icon: Image, color: "bg-purple-500" },
    { label: "Avaliação média", value: "4.9", icon: Star, color: "bg-yellow-500" },
  ];

  const quickActions = [
    { title: "Adicionar ao Portfólio", description: "Compartilhe seu último trabalho", icon: Image, href: "/tatuadores-da-nova-era/portfolio" },
    { title: "Ver Agenda", description: "Gerencie seus horários", icon: Calendar, href: "/tatuadores-da-nova-era/agenda" },
    { title: "Escrever Post", description: "Crie conteúdo para seu blog", icon: BookOpen, href: "/tatuadores-da-nova-era/blog" },
    { title: "Configurar Perfil", description: "Atualize suas informações", icon: Users, href: "/tatuadores-da-nova-era/perfil" },
  ];

  const evolutionGoals = [
    { title: "Dominar Técnica Realismo", progress: 65, color: "bg-red-500" },
    { title: "Aumentar Presença Digital", progress: 80, color: "bg-blue-500" },
    { title: "Fidelizar Clientes", progress: 90, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header de Boas-vindas */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-2">
              Bem-vindo, {profile?.first_name}! 🎨
            </h1>
            <p className="text-red-100 text-lg">
              Transforme sua arte em negócio digital. Você está na nova era da tatuagem.
            </p>
          </div>
          <div className="text-right">
            <Badge className="bg-white text-red-600 mb-2">
              <Zap className="h-3 w-3 mr-1" />
              Tatuador Digitalizado
            </Badge>
            <p className="text-red-200 text-sm">Membro desde Janeiro 2024</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
        {/* Ações Rápidas */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Continue construindo sua presença digital
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <action.icon className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Evolução Pessoal */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-red-600" />
              Sua Evolução
            </CardTitle>
            <CardDescription>
              Acompanhe seu crescimento como tatuador
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {evolutionGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                  <span className="text-sm text-gray-500">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${goal.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            ))}
            <Button className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ver Plano de Evolução
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Passos */}
      <Card className="shadow-xl bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">🚀 Próximos Passos na Sua Jornada</CardTitle>
          <CardDescription className="text-red-600">
            Continue evoluindo e digitalizando sua arte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Image className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium text-red-800 mb-2">Amplie seu Portfólio</h4>
              <p className="text-sm text-red-600">Adicione mais trabalhos para atrair clientes</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium text-red-800 mb-2">Crie Conteúdo</h4>
              <p className="text-sm text-red-600">Compartilhe conhecimento e atraia seguidores</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium text-red-800 mb-2">Automatize Processos</h4>
              <p className="text-sm text-red-600">Use tecnologia para otimizar seu tempo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TatuadoresDashboard;
