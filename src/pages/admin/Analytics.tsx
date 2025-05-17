import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Users, Calendar, ShoppingCart, Repeat } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
  const { user, profile } = useAuth();
  const [timeRange, setTimeRange] = useState("30");

  return (
    <AdminLayout 
      title="Analytics" 
      description="Análise de dados e performance do estúdio"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium">Visão Geral</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Período:</span>
            <Select defaultValue="30" onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
                <SelectItem value="365">Último ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">3,427</span>
                <span className="ml-2 text-xs text-green-600">+5.2%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Repeat className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">12.3%</span>
                <span className="ml-2 text-xs text-green-600">+1.8%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">284</span>
                <span className="ml-2 text-xs text-green-600">+12.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-2xl font-bold">156</span>
                <span className="ml-2 text-xs text-green-600">+8.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="traffic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="traffic">Tráfego</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="traffic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Tráfego</CardTitle>
                <CardDescription>Origem e comportamento dos visitantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    <BarChart className="mx-auto h-16 w-16 opacity-20 mb-2" />
                    Funcionalidade em desenvolvimento. Aqui serão exibidas métricas de tráfego e comportamento dos usuários.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Vendas</CardTitle>
                <CardDescription>Performance de vendas e produtos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    <LineChart className="mx-auto h-16 w-16 opacity-20 mb-2" />
                    Funcionalidade em desenvolvimento. Aqui serão exibidas métricas de vendas e produtos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Clientes</CardTitle>
                <CardDescription>Comportamento e segmentação de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    <Users className="mx-auto h-16 w-16 opacity-20 mb-2" />
                    Funcionalidade em desenvolvimento. Aqui serão exibidas métricas de clientes e segmentação.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Agendamentos</CardTitle>
                <CardDescription>Ocupação e eficiência dos agendamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    <Calendar className="mx-auto h-16 w-16 opacity-20 mb-2" />
                    Funcionalidade em desenvolvimento. Aqui serão exibidas métricas de agendamentos.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
