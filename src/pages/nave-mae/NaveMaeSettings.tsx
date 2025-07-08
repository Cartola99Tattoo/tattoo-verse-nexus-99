
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Bell, Shield, Palette, Globe, Database, Users, Mail } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const NaveMaeSettings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      appointmentReminders: true,
      promotionalEmails: false
    },
    system: {
      darkMode: false,
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
      autoBackup: true,
      maintenanceMode: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAttempts: 5,
      passwordExpiry: 90
    }
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handleSystemChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      system: {
        ...prev.system,
        [key]: value
      }
    }));
  };

  const handleSecurityChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações do Sistema</h1>
            <p className="text-gray-500 mt-2">Gerencie as configurações globais da Nave-Mãe</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
            <Settings className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configurações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma do Sistema</Label>
                    <Select 
                      value={settings.system.language}
                      onValueChange={(value) => handleSystemChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select 
                      value={settings.system.timezone}
                      onValueChange={(value) => handleSystemChange('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoBackup">Backup Automático</Label>
                      <p className="text-sm text-gray-500">Realizar backup diário dos dados</p>
                    </div>
                    <Switch
                      id="autoBackup"
                      checked={settings.system.autoBackup}
                      onCheckedChange={(value) => handleSystemChange('autoBackup', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Modo Manutenção</Label>
                      <p className="text-sm text-gray-500">Ativar modo de manutenção para todos os usuários</p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.system.maintenanceMode}
                      onCheckedChange={(value) => handleSystemChange('maintenanceMode', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Configurações de Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Notificações por Email</Label>
                      <p className="text-sm text-gray-500">Receber notificações gerais por email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(value) => handleNotificationChange('emailNotifications', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smsNotifications">Notificações por SMS</Label>
                      <p className="text-sm text-gray-500">Receber notificações críticas por SMS</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(value) => handleNotificationChange('smsNotifications', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">Notificações Push</Label>
                      <p className="text-sm text-gray-500">Receber notificações no navegador</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(value) => handleNotificationChange('pushNotifications', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="appointmentReminders">Lembretes de Agendamento</Label>
                      <p className="text-sm text-gray-500">Enviar lembretes automáticos de agendamentos</p>
                    </div>
                    <Switch
                      id="appointmentReminders"
                      checked={settings.notifications.appointmentReminders}
                      onCheckedChange={(value) => handleNotificationChange('appointmentReminders', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="promotionalEmails">Emails Promocionais</Label>
                      <p className="text-sm text-gray-500">Receber emails sobre promoções e novidades</p>
                    </div>
                    <Switch
                      id="promotionalEmails"
                      checked={settings.notifications.promotionalEmails}
                      onCheckedChange={(value) => handleNotificationChange('promotionalEmails', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configurações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Tentativas de Login</Label>
                    <Input
                      id="loginAttempts"
                      type="number"
                      value={settings.security.loginAttempts}
                      onChange={(e) => handleSecurityChange('loginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorAuth">Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-gray-500">Exigir 2FA para todos os administradores</p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(value) => handleSecurityChange('twoFactorAuth', value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Expiração de Senha (dias)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => handleSecurityChange('passwordExpiry', parseInt(e.target.value))}
                    className="w-48"
                  />
                  <p className="text-sm text-gray-500">0 = nunca expira</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Configurações de Aparência
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode">Modo Escuro</Label>
                    <p className="text-sm text-gray-500">Ativar tema escuro para toda a plataforma</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={settings.system.darkMode}
                    onCheckedChange={(value) => handleSystemChange('darkMode', value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Cores do Sistema</Label>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-600 rounded-lg mx-auto mb-2"></div>
                      <p className="text-sm">Primária</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-600 rounded-lg mx-auto mb-2"></div>
                      <p className="text-sm">Secundária</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-600 rounded-lg mx-auto mb-2"></div>
                      <p className="text-sm">Sucesso</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-600 rounded-lg mx-auto mb-2"></div>
                      <p className="text-sm">Alerta</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Integrações Externas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Google Analytics</h3>
                      <p className="text-sm text-gray-500">Integração com Google Analytics para métricas</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">WhatsApp Business</h3>
                      <p className="text-sm text-gray-500">Envio de mensagens automáticas via WhatsApp</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Mercado Pago</h3>
                      <p className="text-sm text-gray-500">Gateway de pagamento para processar transações</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Mailgun</h3>
                      <p className="text-sm text-gray-500">Serviço de envio de emails transacionais</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup e Recuperação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Último Backup</h3>
                    <p className="text-sm text-gray-500 mb-4">19/07/2024 às 03:00</p>
                    <Button size="sm" variant="outline">Ver Detalhes</Button>
                  </Card>

                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Próximo Backup</h3>
                    <p className="text-sm text-gray-500 mb-4">20/07/2024 às 03:00</p>
                    <Button size="sm" variant="outline">Agendar</Button>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Database className="h-4 w-4 mr-2" />
                    Fazer Backup Agora
                  </Button>

                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Restaurar do Backup
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Atenção</h4>
                  <p className="text-sm text-yellow-700">
                    Os backups são armazenados com segurança na nuvem e mantidos por 30 dias. 
                    Certifique-se de que o backup automático esteja habilitado nas configurações gerais.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeSettings;
