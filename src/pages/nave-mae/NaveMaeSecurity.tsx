
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, AlertTriangle, Eye, Lock, Users, Activity, Key, Globe } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const mockSecurityLogs = [
  {
    id: 1,
    type: "login_attempt",
    severity: "medium",
    user: "admin@99tattoo.com.br",
    ip: "192.168.0.100",
    location: "São Paulo, BR",
    timestamp: "2024-07-19 14:30:25",
    status: "success",
    details: "Login bem-sucedido"
  },
  {
    id: 2,
    type: "failed_login",
    severity: "high",
    user: "hacker@example.com",
    ip: "45.123.45.67",
    location: "Unknown",
    timestamp: "2024-07-19 13:15:10",
    status: "blocked",
    details: "Múltiplas tentativas de login falharam"
  },
  {
    id: 3,
    type: "api_access",
    severity: "low",
    user: "sistema",
    ip: "127.0.0.1",
    location: "Local",
    timestamp: "2024-07-19 12:45:00",
    status: "success",
    details: "Acesso à API autorizado"
  }
];

const NaveMaeSecurity = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    loginAttempts: "5",
    sessionTimeout: "24h",
    ipWhitelist: true,
    apiRateLimit: true,
    securityAlerts: true,
    auditLogs: true,
    passwordComplexity: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return severity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-red-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Segurança da Rede</h2>
                  <p className="text-gray-600">Monitoramento e configurações de segurança</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Sistema Seguro</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas de Segurança */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Status de Segurança</p>
                  <p className="text-3xl font-bold text-green-800">98%</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Alertas Ativos</p>
                  <p className="text-3xl font-bold text-yellow-800">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Usuários Ativos</p>
                  <p className="text-3xl font-bold text-blue-800">127</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Logs Hoje</p>
                  <p className="text-3xl font-bold text-purple-800">1,249</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Configurações de Autenticação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                Autenticação e Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Autenticação de Dois Fatores</Label>
                  <div className="text-sm text-gray-500">
                    Obrigar 2FA para todos os administradores
                  </div>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Máximo de Tentativas de Login</Label>
                <Input
                  id="loginAttempts"
                  value={securitySettings.loginAttempts}
                  onChange={(e) => handleSettingChange('loginAttempts', e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Complexidade de Senha</Label>
                  <div className="text-sm text-gray-500">
                    Exigir senhas complexas (8+ chars, números, símbolos)
                  </div>
                </div>
                <Switch
                  checked={securitySettings.passwordComplexity}
                  onCheckedChange={(checked) => handleSettingChange('passwordComplexity', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lista Branca de IPs</Label>
                  <div className="text-sm text-gray-500">
                    Restringir acesso a IPs autorizados
                  </div>
                </div>
                <Switch
                  checked={securitySettings.ipWhitelist}
                  onCheckedChange={(checked) => handleSettingChange('ipWhitelist', checked)}
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Configurar IPs Autorizados
              </Button>
            </CardContent>
          </Card>

          {/* Monitoramento e Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Monitoramento e Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Segurança</Label>
                  <div className="text-sm text-gray-500">
                    Notificações em tempo real sobre ameaças
                  </div>
                </div>
                <Switch
                  checked={securitySettings.securityAlerts}
                  onCheckedChange={(checked) => handleSettingChange('securityAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Logs de Auditoria</Label>
                  <div className="text-sm text-gray-500">
                    Registrar todas as ações do sistema
                  </div>
                </div>
                <Switch
                  checked={securitySettings.auditLogs}
                  onCheckedChange={(checked) => handleSettingChange('auditLogs', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate Limiting da API</Label>
                  <div className="text-sm text-gray-500">
                    Limitar requisições por IP/usuário
                  </div>
                </div>
                <Switch
                  checked={securitySettings.apiRateLimit}
                  onCheckedChange={(checked) => handleSettingChange('apiRateLimit', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Configurações de Monitoramento</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-1" />
                    Geolocation
                  </Button>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Configurar Alertas
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Logs de Segurança */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              Logs de Segurança Recentes
            </CardTitle>
            <Button variant="outline">
              Ver Todos os Logs
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSecurityLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      log.severity === 'high' ? 'bg-red-100 text-red-600' :
                      log.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {log.severity === 'high' ? <AlertTriangle className="h-4 w-4" /> :
                       log.severity === 'medium' ? <Eye className="h-4 w-4" /> :
                       <Shield className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium">{log.details}</p>
                        <Badge className={getSeverityColor(log.severity)}>
                          {getSeverityText(log.severity)}
                        </Badge>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {log.user} • {log.ip} • {log.location} • {log.timestamp}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Detalhes
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações de Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-600" />
              Ações de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Shield className="h-6 w-6 mb-2" />
                Scan de Vulnerabilidades
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Lock className="h-6 w-6 mb-2" />
                Forçar Logout Global
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Key className="h-6 w-6 mb-2" />
                Regenerar API Keys
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Activity className="h-6 w-6 mb-2" />
                Exportar Logs
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <AlertTriangle className="h-6 w-6 mb-2" />
                Modo de Emergência
              </Button>
              <Button 
                className="h-20 flex flex-col items-center justify-center bg-red-600 hover:bg-red-700 text-white"
              >
                <Shield className="h-6 w-6 mb-2" />
                Lockdown Total
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeSecurity;
