
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MessageCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Eye,
  Heart,
  Settings,
  Camera,
  Clock
} from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const TattooArtistDashboard = () => {
  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-800 mb-2">
              Dashboard do Artista
            </h1>
            <p className="text-gray-600">
              Gerencie seu perfil, portfolio e conecte-se com clientes
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Visualizações</p>
                    <p className="text-3xl font-bold">2,847</p>
                  </div>
                  <Eye className="h-8 w-8 text-red-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Curtidas</p>
                    <p className="text-3xl font-bold">1,234</p>
                  </div>
                  <Heart className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Mensagens</p>
                    <p className="text-3xl font-bold">42</p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Avaliação</p>
                    <p className="text-3xl font-bold">4.8</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="bg-red-600 hover:bg-red-700 h-16 text-left flex-col items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <Camera className="h-4 w-4" />
                      <span className="font-bold">Adicionar Trabalho</span>
                    </div>
                    <span className="text-sm text-red-100">Compartilhe sua nova arte</span>
                  </Button>

                  <Button variant="outline" className="h-16 text-left flex-col items-start border-blue-300 hover:bg-blue-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-bold text-blue-600">Gerenciar Agenda</span>
                    </div>
                    <span className="text-sm text-blue-500">Configure horários disponíveis</span>
                  </Button>

                  <Button variant="outline" className="h-16 text-left flex-col items-start border-green-300 hover:bg-green-50">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span className="font-bold text-green-600">Responder Mensagens</span>
                    </div>
                    <span className="text-sm text-green-500">42 mensagens pendentes</span>
                  </Button>

                  <Button variant="outline" className="h-16 text-left flex-col items-start border-purple-300 hover:bg-purple-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Settings className="h-4 w-4 text-purple-600" />
                      <span className="font-bold text-purple-600">Editar Perfil</span>
                    </div>
                    <span className="text-sm text-purple-500">Atualize suas informações</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-red-600" />
                    Atividade Recente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Nova curtida no seu trabalho</p>
                        <p className="text-sm text-gray-600">Tatuagem de dragão • há 2 horas</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Nova mensagem recebida</p>
                        <p className="text-sm text-gray-600">Maria Silva • há 4 horas</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Perfil visualizado</p>
                        <p className="text-sm text-gray-600">João Santos • há 6 horas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-red-600" />
                    Status do Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Disponibilidade</span>
                      <Badge className="bg-green-100 text-green-800">Disponível</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Portfolio</span>
                      <span className="text-sm font-medium">12 trabalhos</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avaliações</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">4.8 (127)</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Experiência</span>
                      <span className="text-sm font-medium">8 anos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximos Agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-medium text-red-800">Hoje, 14:00</p>
                      <p className="text-sm text-red-600">Tatuagem de Rosa - Ana</p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="font-medium text-blue-800">Amanhã, 10:00</p>
                      <p className="text-sm text-blue-600">Consulta - Carlos</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="font-medium text-green-800">Sex, 16:00</p>
                      <p className="text-sm text-green-600">Retoque - Maria</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistDashboard;
