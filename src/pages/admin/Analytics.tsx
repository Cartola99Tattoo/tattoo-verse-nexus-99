
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Users, Calendar, ShoppingCart, Repeat } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Analytics() {
  const { user, profile } = useAuth();
  const [timeRange, setTimeRange] = useState("30");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-800">Visão Geral</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Período:</span>
          <Select defaultValue="30" onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] shadow-md bg-white border-gray-300">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-xl border-gray-200">
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 3 meses</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-gray-700">Visitantes</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg shadow-md mr-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800">3,427</span>
              <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full shadow-sm">+5.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-gray-700">Conversões</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-green-100 to-green-50 rounded-lg shadow-md mr-3">
                <Repeat className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800">12.3%</span>
              <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full shadow-sm">+1.8%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-purple-50 border-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-gray-700">Pedidos</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg shadow-md mr-3">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800">284</span>
              <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full shadow-sm">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-orange-50 border-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-gray-700">Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg shadow-md mr-3">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-800">156</span>
              <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full shadow-sm">+8.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="space-y-6">
        <TabsList className="bg-gradient-to-r from-gray-100 to-gray-200 shadow-lg border border-gray-300 rounded-lg p-1">
          <TabsTrigger value="traffic" className="bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">Tráfego</TabsTrigger>
          <TabsTrigger value="sales" className="bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">Vendas</TabsTrigger>
          <TabsTrigger value="customers" className="bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">Clientes</TabsTrigger>
          <TabsTrigger value="appointments" className="bg-white shadow-md hover:shadow-lg transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-400 data-[state=active]:text-white">Agendamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-gray-800">Análise de Tráfego</CardTitle>
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
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-gray-800">Análise de Vendas</CardTitle>
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
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-gray-800">Análise de Clientes</CardTitle>
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
          <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-gray-800">Análise de Agendamentos</CardTitle>
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
  );
}
