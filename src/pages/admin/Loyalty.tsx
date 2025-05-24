
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Award, Settings, Users, Star, Gift, Calendar } from "lucide-react";

export default function Loyalty() {
  const { user, profile } = useAuth();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg border border-gray-300 rounded-lg p-1">
          <TabsTrigger value="overview" className="bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">Visão Geral</TabsTrigger>
          <TabsTrigger value="rules" className="bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">Regras e Níveis</TabsTrigger>
          <TabsTrigger value="rewards" className="bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">Recompensas</TabsTrigger>
          <TabsTrigger value="members" className="bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">Membros</TabsTrigger>
          <TabsTrigger value="settings" className="bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="text-sm font-medium text-gray-700">Total de Membros</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-md mr-3">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">248</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-yellow-50 border-yellow-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-t-lg">
                <CardTitle className="text-sm font-medium text-gray-700">Pontos Distribuídos</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg shadow-md mr-3">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">12.540</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
                <CardTitle className="text-sm font-medium text-gray-700">Recompensas Resgatadas</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-green-100 to-green-50 rounded-lg shadow-md mr-3">
                    <Gift className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">85</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
                <CardTitle className="text-sm font-medium text-gray-700">Promoções Ativas</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg shadow-md mr-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">3</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-gray-800">Visão Geral do Programa</CardTitle>
              <CardDescription>Status e desempenho do programa de fidelidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center py-8 text-muted-foreground">
                Funcionalidade em desenvolvimento. Aqui serão exibidos gráficos e métricas do programa de fidelidade.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-gray-800">Regras e Níveis do Programa</CardTitle>
              <CardDescription>Configure os níveis e regras do programa de fidelidade</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Funcionalidade em desenvolvimento. Aqui serão definidas as regras do programa de fidelidade.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-lg">
              <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200">
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <div>
                <CardTitle className="text-gray-800">Recompensas do Programa</CardTitle>
                <CardDescription>Gerencie as recompensas disponíveis</CardDescription>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200">
                Nova Recompensa
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Funcionalidade em desenvolvimento. Aqui serão listadas e gerenciadas as recompensas.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <div>
                <CardTitle className="text-gray-800">Membros do Programa</CardTitle>
                <CardDescription>Lista de clientes participantes</CardDescription>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200">
                Adicionar Membro
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Funcionalidade em desenvolvimento. Aqui serão listados os membros do programa.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-gray-800">Configurações do Programa</CardTitle>
              <CardDescription>Configure os parâmetros gerais do programa de fidelidade</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Funcionalidade em desenvolvimento. Aqui serão definidas as configurações gerais do programa.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-lg">
              <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200">
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
