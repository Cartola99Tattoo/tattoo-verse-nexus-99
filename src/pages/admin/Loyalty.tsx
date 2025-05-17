
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Award, Settings, Users, Star, Gift, Calendar } from "lucide-react";

export default function Loyalty() {
  const { user, profile } = useAuth();

  // Verificar se o usuário tem permissão para acessar o painel
  if (!user || !profile || profile.role !== "admin") {
    return <Navigate to="/access-denied" />;
  }

  return (
    <AdminLayout 
      title="Programa de Fidelidade" 
      description="Gerencie o programa de fidelidade do estúdio"
    >
      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="rules">Regras e Níveis</TabsTrigger>
            <TabsTrigger value="rewards">Recompensas</TabsTrigger>
            <TabsTrigger value="members">Membros</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">248</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pontos Distribuídos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">12.540</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recompensas Resgatadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Gift className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">85</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Promoções Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-2xl font-bold">3</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Visão Geral do Programa</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Regras e Níveis do Programa</CardTitle>
                <CardDescription>Configure os níveis e regras do programa de fidelidade</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Funcionalidade em desenvolvimento. Aqui serão definidas as regras do programa de fidelidade.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recompensas do Programa</CardTitle>
                  <CardDescription>Gerencie as recompensas disponíveis</CardDescription>
                </div>
                <Button size="sm">Nova Recompensa</Button>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Funcionalidade em desenvolvimento. Aqui serão listadas e gerenciadas as recompensas.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Membros do Programa</CardTitle>
                  <CardDescription>Lista de clientes participantes</CardDescription>
                </div>
                <Button size="sm">Adicionar Membro</Button>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Funcionalidade em desenvolvimento. Aqui serão listados os membros do programa.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Programa</CardTitle>
                <CardDescription>Configure os parâmetros gerais do programa de fidelidade</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Funcionalidade em desenvolvimento. Aqui serão definidas as configurações gerais do programa.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Salvar Configurações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
