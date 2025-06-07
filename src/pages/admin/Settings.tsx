
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Upload, MapPin, Phone, Mail, Instagram, Facebook, Clock, Users, DollarSign, CreditCard } from "lucide-react";

const Settings = () => {
  const [studioSettings, setStudioSettings] = useState({
    name: "99 Tattoo Studio",
    description: "Estúdio de tatuagem especializado em arte de qualidade e atendimento personalizado",
    address: {
      street: "Rua das Tattoos, 99",
      neighborhood: "Vila Madalena",
      city: "São Paulo",
      state: "SP",
      cep: "01234-567"
    },
    contact: {
      phone: "(11) 99999-9999",
      email: "contato@99tattoo.com",
      whatsapp: "(11) 99999-9999"
    },
    social: {
      instagram: "@99tattoo_oficial",
      facebook: "99TattooStudio",
      tiktok: "@99tattoo"
    },
    hours: {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "10:00", close: "16:00", closed: false },
      sunday: { open: "10:00", close: "16:00", closed: true }
    },
    settings: {
      totalBeds: 4,
      defaultAppointmentDuration: 60,
      defaultCommission: 50,
      paymentMethods: ["Cartão de Crédito", "PIX", "Dinheiro", "Cartão de Débito"]
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log("Studio settings saved:", studioSettings);
  };

  const updateField = (section: string, field: string, value: any) => {
    setStudioSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const updateHours = (day: string, field: string, value: any) => {
    setStudioSettings(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day as keyof typeof prev.hours],
          [field]: value
        }
      }
    }));
  };

  const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira", 
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-lg">
        <h2 className="text-xl font-bold text-red-600 mb-2">Configurações do Estúdio</h2>
        <p className="text-gray-600">Configure as informações gerais do seu estúdio de tatuagem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="studio-name" className="text-red-600 font-medium">Nome do Estúdio</Label>
              <Input
                id="studio-name"
                value={studioSettings.name}
                onChange={(e) => setStudioSettings(prev => ({ ...prev, name: e.target.value }))}
                className="border-red-200 focus:border-red-600"
              />
            </div>
            
            <div>
              <Label htmlFor="studio-description" className="text-red-600 font-medium">Descrição</Label>
              <Textarea
                id="studio-description"
                value={studioSettings.description}
                onChange={(e) => setStudioSettings(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="border-red-200 focus:border-red-600"
              />
            </div>
            
            <div>
              <Label className="text-red-600 font-medium">Logo do Estúdio</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center border-2 border-red-200">
                  <Upload className="h-8 w-8 text-red-500" />
                </div>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  <Upload className="h-4 w-4 mr-2" />
                  Escolher Arquivo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-red-600 font-medium">Rua e Número</Label>
              <Input
                value={studioSettings.address.street}
                onChange={(e) => updateField('address', 'street', e.target.value)}
                className="border-red-200 focus:border-red-600"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-red-600 font-medium">Bairro</Label>
                <Input
                  value={studioSettings.address.neighborhood}
                  onChange={(e) => updateField('address', 'neighborhood', e.target.value)}
                  className="border-red-200 focus:border-red-600"
                />
              </div>
              <div>
                <Label className="text-red-600 font-medium">CEP</Label>
                <Input
                  value={studioSettings.address.cep}
                  onChange={(e) => updateField('address', 'cep', e.target.value)}
                  className="border-red-200 focus:border-red-600"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-red-600 font-medium">Cidade</Label>
                <Input
                  value={studioSettings.address.city}
                  onChange={(e) => updateField('address', 'city', e.target.value)}
                  className="border-red-200 focus:border-red-600"
                />
              </div>
              <div>
                <Label className="text-red-600 font-medium">Estado</Label>
                <Input
                  value={studioSettings.address.state}
                  onChange={(e) => updateField('address', 'state', e.target.value)}
                  className="border-red-200 focus:border-red-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Informações de Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-red-600 font-medium">Telefone</Label>
              <Input
                value={studioSettings.contact.phone}
                onChange={(e) => updateField('contact', 'phone', e.target.value)}
                className="border-red-200 focus:border-red-600"
              />
            </div>
            
            <div>
              <Label className="text-red-600 font-medium">E-mail</Label>
              <Input
                type="email"
                value={studioSettings.contact.email}
                onChange={(e) => updateField('contact', 'email', e.target.value)}
                className="border-red-200 focus:border-red-600"
              />
            </div>
            
            <div>
              <Label className="text-red-600 font-medium">WhatsApp</Label>
              <Input
                value={studioSettings.contact.whatsapp}
                onChange={(e) => updateField('contact', 'whatsapp', e.target.value)}
                className="border-red-200 focus:border-red-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociais */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Instagram className="h-5 w-5" />
              Redes Sociais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-red-600 font-medium">Instagram</Label>
              <Input
                value={studioSettings.social.instagram}
                onChange={(e) => updateField('social', 'instagram', e.target.value)}
                className="border-red-200 focus:border-red-600"
                placeholder="@seu_instagram"
              />
            </div>
            
            <div>
              <Label className="text-red-600 font-medium">Facebook</Label>
              <Input
                value={studioSettings.social.facebook}
                onChange={(e) => updateField('social', 'facebook', e.target.value)}
                className="border-red-200 focus:border-red-600"
                placeholder="Sua página do Facebook"
              />
            </div>
            
            <div>
              <Label className="text-red-600 font-medium">TikTok</Label>
              <Input
                value={studioSettings.social.tiktok}
                onChange={(e) => updateField('social', 'tiktok', e.target.value)}
                className="border-red-200 focus:border-red-600"
                placeholder="@seu_tiktok"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Horário de Funcionamento */}
      <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horário de Funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(dayNames).map(([day, displayName]) => {
              const dayData = studioSettings.hours[day as keyof typeof studioSettings.hours];
              return (
                <div key={day} className="p-4 border border-red-200 rounded-lg bg-gradient-to-br from-red-50 to-white">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-red-600 font-medium">{displayName}</Label>
                    <Switch
                      checked={!dayData.closed}
                      onCheckedChange={(checked) => updateHours(day, 'closed', !checked)}
                    />
                  </div>
                  {!dayData.closed && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-gray-600">Abertura</Label>
                        <Input
                          type="time"
                          value={dayData.open}
                          onChange={(e) => updateHours(day, 'open', e.target.value)}
                          className="text-xs border-red-200 focus:border-red-600"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Fechamento</Label>
                        <Input
                          type="time"
                          value={dayData.close}
                          onChange={(e) => updateHours(day, 'close', e.target.value)}
                          className="text-xs border-red-200 focus:border-red-600"
                        />
                      </div>
                    </div>
                  )}
                  {dayData.closed && (
                    <p className="text-sm text-gray-500 text-center py-2">Fechado</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Agendamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Configurações de Agendamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-red-600 font-medium">Número de Macas Disponíveis</Label>
              <Input
                type="number"
                value={studioSettings.settings.totalBeds}
                onChange={(e) => updateField('settings', 'totalBeds', parseInt(e.target.value))}
                className="border-red-200 focus:border-red-600"
                min="1"
                max="20"
              />
            </div>
            
            <div>
              <Label className="text-red-600 font-medium">Duração Padrão do Agendamento (minutos)</Label>
              <Input
                type="number"
                value={studioSettings.settings.defaultAppointmentDuration}
                onChange={(e) => updateField('settings', 'defaultAppointmentDuration', parseInt(e.target.value))}
                className="border-red-200 focus:border-red-600"
                min="30"
                max="480"
                step="30"
              />
            </div>
            
            <div>
              <Label className="text-red-600 font-medium">Comissão Padrão para Novos Tatuadores (%)</Label>
              <Input
                type="number"
                value={studioSettings.settings.defaultCommission}
                onChange={(e) => updateField('settings', 'defaultCommission', parseInt(e.target.value))}
                className="border-red-200 focus:border-red-600"
                min="0"
                max="100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pagamento */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Métodos de Pagamento Aceitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {studioSettings.settings.paymentMethods.map((method, index) => (
                <Badge key={index} variant="outline" className="border-red-200 text-red-600 bg-red-50">
                  {method}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Configuração informativa dos métodos de pagamento aceitos pelo estúdio.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botão de Salvar */}
      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl px-8 py-2"
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
