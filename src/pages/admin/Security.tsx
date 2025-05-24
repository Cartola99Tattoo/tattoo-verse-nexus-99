
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Users, Eye, AlertTriangle, CheckCircle } from "lucide-react";

const Security = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Cards de Estatísticas de Segurança */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Seguro</div>
            <p className="text-xs text-muted-foreground">
              Todos os sistemas operacionais
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tentativas de Login</CardTitle>
            <Lock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">247</div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground">
              Conectados agora
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <p className="text-xs text-muted-foreground">
              Requerem atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configurações de Segurança */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="text-gray-800">Configurações de Acesso</CardTitle>
            <CardDescription>
              Gerencie permissões e controle de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                <p className="text-sm text-gray-500">Proteção adicional para contas admin</p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Bloqueio por Tentativas</h4>
                <p className="text-sm text-gray-500">Bloqueia após 5 tentativas falhadas</p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SSL/HTTPS</h4>
                <p className="text-sm text-gray-500">Conexão criptografada</p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
            </div>
            
            <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-200">
              Configurar Permissões
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
            <CardTitle className="text-gray-800">Logs de Atividade</CardTitle>
            <CardDescription>
              Monitoramento em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 rounded border-l-4 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Login Admin</p>
                  <p className="text-xs text-gray-500">admin@99tattoo.com - há 2 min</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded border-l-4 border-blue-200">
                <Eye className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Acesso ao Dashboard</p>
                  <p className="text-xs text-gray-500">Maria Santos - há 5 min</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded border-l-4 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Tentativa de Login Falhada</p>
                  <p className="text-xs text-gray-500">IP: 192.168.1.100 - há 10 min</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full mt-4">
              Ver Todos os Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Políticas de Segurança */}
      <Card className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
          <CardTitle className="text-gray-800">Políticas de Segurança</CardTitle>
          <CardDescription>
            Configurações de segurança e compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Senhas Fortes</h4>
              <p className="text-sm text-gray-600 mb-2">
                Mínimo 8 caracteres com números e símbolos
              </p>
              <Badge className="bg-green-100 text-green-800">Obrigatório</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Backup Automático</h4>
              <p className="text-sm text-gray-600 mb-2">
                Backup diário dos dados críticos
              </p>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">LGPD Compliance</h4>
              <p className="text-sm text-gray-600 mb-2">
                Proteção de dados pessoais
              </p>
              <Badge className="bg-green-100 text-green-800">Conforme</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;
