
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Crown, Calendar, Star, Heart, MapPin, Phone, Mail, Camera } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UserProfile = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    address: "São Paulo, SP",
    birthDate: "1990-01-01"
  });

  const [tattooPreferences, setTattooPreferences] = useState({
    preferredStyles: [] as string[],
    bodyLocations: [] as string[],
    sizePreference: "",
    budgetRange: "",
    colorPreference: "",
    timeframe: "",
    specialInterests: ""
  });

  // Dados simulados da jornada do cliente
  const journeyData = {
    totalTattoos: 3,
    currentStage: "Cliente Recorrente",
    loyaltyLevel: "Bronze",
    nextAppointment: "2024-02-15",
    completionPercentage: 75,
    benefits: ["10% desconto", "Agendamento prioritário"]
  };

  const handleSaveProfile = () => {
    // Aqui integraria com o serviço para salvar no Supabase
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso!"
    });
  };

  const handleStyleToggle = (style: string) => {
    setTattooPreferences(prev => ({
      ...prev,
      preferredStyles: prev.preferredStyles.includes(style)
        ? prev.preferredStyles.filter(s => s !== style)
        : [...prev.preferredStyles, style]
    }));
  };

  const tattooStyles = [
    "Realismo", "Traditional", "Neo Traditional", "Blackwork", 
    "Fine Line", "Aquarela", "Geometric", "Tribal", "Oriental", "Biomecânico"
  ];

  const bodyLocations = [
    "Braço", "Antebraço", "Peito", "Costas", "Perna", "Coxa", 
    "Pescoço", "Mão", "Pé", "Costela"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações e preferências</p>
        </div>

        {/* Jornada 99Tattoo */}
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Crown className="h-5 w-5" />
              Sua Jornada 99Tattoo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {journeyData.totalTattoos}
                </div>
                <p className="text-sm text-gray-600">Tatuagens Realizadas</p>
              </div>
              
              <div className="text-center">
                <Badge className="bg-red-100 text-red-800 mb-2">
                  {journeyData.currentStage}
                </Badge>
                <div className="space-y-2">
                  <Progress value={journeyData.completionPercentage} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {journeyData.completionPercentage}% para próximo nível
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{journeyData.loyaltyLevel}</span>
                </div>
                <div className="space-y-1">
                  {journeyData.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {journeyData.nextAppointment && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Próximo Agendamento</span>
                </div>
                <p className="text-gray-600 mt-1">
                  {new Date(journeyData.nextAppointment).toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="preferences">Preferências de Tatuagem</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input
                      value={personalInfo.name}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Data de Nascimento</Label>
                    <Input
                      type="date"
                      value={personalInfo.birthDate}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, birthDate: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input
                    value={personalInfo.address}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Preferências de Tatuagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Estilos Preferidos</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {tattooStyles.map((style) => (
                      <Button
                        key={style}
                        variant={tattooPreferences.preferredStyles.includes(style) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStyleToggle(style)}
                        className="justify-start"
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tamanho Preferido</Label>
                    <Select 
                      value={tattooPreferences.sizePreference}
                      onValueChange={(value) => setTattooPreferences(prev => ({ ...prev, sizePreference: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequena">Pequena (até 5cm)</SelectItem>
                        <SelectItem value="media">Média (5-15cm)</SelectItem>
                        <SelectItem value="grande">Grande (15-30cm)</SelectItem>
                        <SelectItem value="muito-grande">Muito Grande (30cm+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Faixa de Orçamento</Label>
                    <Select 
                      value={tattooPreferences.budgetRange}
                      onValueChange={(value) => setTattooPreferences(prev => ({ ...prev, budgetRange: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o orçamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ate-500">Até R$ 500</SelectItem>
                        <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                        <SelectItem value="1000-2000">R$ 1.000 - R$ 2.000</SelectItem>
                        <SelectItem value="2000-plus">Acima de R$ 2.000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferência de Cor</Label>
                    <Select 
                      value={tattooPreferences.colorPreference}
                      onValueChange={(value) => setTattooPreferences(prev => ({ ...prev, colorPreference: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a preferência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="preto-cinza">Preto e Cinza</SelectItem>
                        <SelectItem value="colorida">Colorida</SelectItem>
                        <SelectItem value="ambas">Ambas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Prazo Desejado</Label>
                    <Select 
                      value={tattooPreferences.timeframe}
                      onValueChange={(value) => setTattooPreferences(prev => ({ ...prev, timeframe: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Quando pretende tatuar?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-month">Próximo mês</SelectItem>
                        <SelectItem value="3-months">Próximos 3 meses</SelectItem>
                        <SelectItem value="6-months">Próximos 6 meses</SelectItem>
                        <SelectItem value="1-year">Próximo ano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interesses Especiais</Label>
                  <Textarea
                    placeholder="Descreva temas, símbolos ou ideias que te interessam..."
                    value={tattooPreferences.specialInterests}
                    onChange={(e) => setTattooPreferences(prev => ({ ...prev, specialInterests: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSaveProfile} className="bg-red-600 hover:bg-red-700">
            Salvar Perfil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
