
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Database, Mail, Bell, Globe, Palette, Users, Shield } from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";

const NaveMaeSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "99Tattoo - Rede Nacional",
    siteUrl: "https://99tattoo.com.br",
    adminEmail: "admin@99tattoo.com.br",
    supportEmail: "suporte@99tattoo.com.br",
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
    currency: "BRL",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    maxFileSize: "10MB",
    sessionTimeout: "24h"
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h2>
                <p className="text-gray-600">Configurações globais da rede 99Tattoo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Configurações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteUrl">URL do Site</Label>
                <Input
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Select 
                  value={settings.timezone} 
                  onValueChange={(value) => handleSettingChange('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Sao_Paulo">Brasil (GMT-3)</SelectItem>
                    <SelectItem value="America/New_York">Nova York (GMT-5)</SelectItem>
                    <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => handleSettingChange('language', value)}
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
                <Label htmlFor="currency">Moeda</Label>
                <Select 
                  value={settings.currency} 
                  onValueChange={(value) => handleSettingChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                    <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                Configurações de Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email do Administrador</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportEmail">Email de Suporte</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Configurações SMTP</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Servidor SMTP" />
                  <Input placeholder="Porta" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Usuário" />
                  <Input placeholder="Senha" type="password" />
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Testar Configuração de Email
              </Button>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <div className="text-sm text-gray-500">
                    Receber notificações importantes via email
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por SMS</Label>
                  <div className="text-sm text-gray-500">
                    Receber alertas críticos via SMS
                  </div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <div className="text-sm text-gray-500">
                    Notificações push no navegador
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Segurança e Acesso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Segurança e Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo de Manutenção</Label>
                  <div className="text-sm text-gray-500">
                    Desativar acesso público ao sistema
                  </div>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir Cadastros</Label>
                  <div className="text-sm text-gray-500">
                    Novos usuários podem se cadastrar
                  </div>
                </div>
                <Switch
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => handleSettingChange('allowRegistration', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Verificação de Email</Label>
                  <div className="text-sm text-gray-500">
                    Obrigar verificação de email no cadastro
                  </div>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Timeout de Sessão</Label>
                <Select 
                  value={settings.sessionTimeout} 
                  onValueChange={(value) => handleSettingChange('sessionTimeout', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 hora</SelectItem>
                    <SelectItem value="8h">8 horas</SelectItem>
                    <SelectItem value="24h">24 horas</SelectItem>
                    <SelectItem value="never">Nunca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Upload e Arquivos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Tamanho Máximo de Arquivo</Label>
                <Select 
                  value={settings.maxFileSize} 
                  onValueChange={(value) => handleSettingChange('maxFileSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5MB">5 MB</SelectItem>
                    <SelectItem value="10MB">10 MB</SelectItem>
                    <SelectItem value="25MB">25 MB</SelectItem>
                    <SelectItem value="50MB">50 MB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipos de Arquivo Permitidos</Label>
                <div className="text-sm text-gray-500 space-y-1">
                  <div>• Imagens: JPG, PNG, GIF, WEBP</div>
                  <div>• Documentos: PDF, DOC, DOCX</div>
                  <div>• Vídeos: MP4, MOV, AVI</div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Configurar Tipos de Arquivo
              </Button>
            </CardContent>
          </Card>

          {/* Integração e APIs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-indigo-600" />
                Integrações e APIs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Google Analytics</Label>
                <Input placeholder="Tracking ID (GA4)" />
              </div>

              <div className="space-y-2">
                <Label>Meta Pixel</Label>
                <Input placeholder="Pixel ID do Facebook" />
              </div>

              <div className="space-y-2">
                <Label>API Key Externa</Label>
                <Input placeholder="Chave da API" type="password" />
              </div>

              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <Input placeholder="URL para webhooks" />
              </div>

              <Button variant="outline" className="w-full">
                Testar Integrações
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 justify-end">
              <Button variant="outline">
                Restaurar Padrões
              </Button>
              <Button variant="outline">
                Fazer Backup
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeSettings;
