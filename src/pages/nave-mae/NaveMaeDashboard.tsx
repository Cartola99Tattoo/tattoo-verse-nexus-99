
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, TrendingUp, DollarSign, Calendar, Star, Building2, Package } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const NaveMaeDashboard = () => {
  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Estúdios Ativos</p>
                  <p className="text-3xl font-bold text-blue-800">47</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Tatuadores</p>
                  <p className="text-3xl font-bold text-green-800">312</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Receita Mensal</p>
                  <p className="text-3xl font-bold text-purple-800">R$ 2.8M</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Crescimento</p>
                  <p className="text-3xl font-bold text-yellow-800">+24%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo de Atividades */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Agendamentos Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total de agendamentos</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Confirmados</span>
                  <span className="font-bold text-green-600">1,089</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pendentes</span>
                  <span className="font-bold text-yellow-600">158</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-600" />
                Performance da Rede
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avaliação média</span>
                  <span className="font-bold">4.8 ⭐</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NPS Score</span>
                  <span className="font-bold text-green-600">87</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxa de conversão</span>
                  <span className="font-bold text-purple-600">73%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e Análises */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Estúdios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Black Art Studio", revenue: "R$ 45.2K" },
                  { name: "Aquarela Ink", revenue: "R$ 38.9K" },
                  { name: "Neo Tattoo", revenue: "R$ 32.1K" },
                  { name: "Ink Masters", revenue: "R$ 28.7K" }
                ].map((studio, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{studio.name}</span>
                    <span className="text-sm text-purple-600 font-bold">{studio.revenue}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Máquina Rotativa", sales: "89 vendas" },
                  { name: "Kit Tintas", sales: "76 vendas" },
                  { name: "Agulhas Premium", sales: "64 vendas" },
                  { name: "Cartuchos", sales: "52 vendas" }
                ].map((product, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-green-600 font-bold">{product.sales}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alertas do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">3 estúdios com estoque baixo</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">2 pagamentos pendentes</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">15 novos cadastros hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeDashboard;
