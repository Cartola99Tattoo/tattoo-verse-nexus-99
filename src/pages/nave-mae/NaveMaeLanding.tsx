
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Settings, Users, BarChart3, Database, Zap } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const NaveMaeLanding = () => {
  return (
    <NaveMaeLayout>
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white mb-16">
          <h1 className="text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Nave Mãe</span>
          </h1>
          <h2 className="text-3xl font-semibold mb-4">Centro de Comando 99Tattoo</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Plataforma administrativa principal para gerenciar toda a rede de estúdios, tatuadores e operações da 99Tattoo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: <Users className="h-12 w-12 text-purple-400" />,
              title: "Gestão de Rede",
              description: "Controle completo sobre todos os estúdios parceiros e tatuadores da plataforma"
            },
            {
              icon: <BarChart3 className="h-12 w-12 text-purple-400" />,
              title: "Analytics Avançado",
              description: "Relatórios detalhados de performance, faturamento e métricas de toda a rede"
            },
            {
              icon: <Database className="h-12 w-12 text-purple-400" />,
              title: "Banco de Dados Central",
              description: "Gerenciamento centralizado de todos os dados de clientes, agendamentos e transações"
            },
            {
              icon: <Settings className="h-12 w-12 text-purple-400" />,
              title: "Configurações Globais",
              description: "Controle de parâmetros e configurações que afetam toda a plataforma"
            },
            {
              icon: <Shield className="h-12 w-12 text-purple-400" />,
              title: "Segurança e Compliance",
              description: "Monitoramento de segurança, auditoria e conformidade regulatória"
            },
            {
              icon: <Zap className="h-12 w-12 text-purple-400" />,
              title: "Automações",
              description: "Sistema de automações para otimizar processos em toda a rede"
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-purple-500/20 hover:bg-white/10 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-center">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Card className="bg-purple-600/10 border-purple-500/30 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Plataforma em Desenvolvimento</h2>
              <p className="text-gray-300 text-lg">
                A Nave Mãe está sendo construída para ser o centro de comando mais avançado da indústria de tatuagem. 
                Em breve, administradores terão acesso a ferramentas poderosas para gerenciar toda a operação 99Tattoo.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeLanding;
