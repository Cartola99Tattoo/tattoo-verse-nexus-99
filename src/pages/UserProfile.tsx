
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Upload,
  Clock,
  Heart,
  Brush,
  Settings,
  CheckCircle,
  Star,
  Target
} from "lucide-react";
import { useUserProfile, useUpdateTattooPreferences, useUpdatePersonalPreferences, useUpdateBasicInfo } from "@/hooks/useUserProfile";
import TattooPreferencesForm from "@/components/profile/TattooPreferencesForm";
import PersonalPreferencesForm from "@/components/profile/PersonalPreferencesForm";
import LoyaltyStatusCard from "@/components/profile/LoyaltyStatusCard";
import { toast } from "sonner";

const UserProfile = () => {
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [basicFormData, setBasicFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    bio: ""
  });

  // Mock user ID - in real app, this would come from auth context
  const userId = "auth_user_1";

  const { data: userProfile, isLoading, error } = useUserProfile(userId);
  const updateTattooPreferences = useUpdateTattooPreferences();
  const updatePersonalPreferences = useUpdatePersonalPreferences();
  const updateBasicInfo = useUpdateBasicInfo();

  React.useEffect(() => {
    if (userProfile) {
      setBasicFormData({
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        email: userProfile.email,
        phone: userProfile.phone || "",
        date_of_birth: userProfile.date_of_birth || "",
        address: userProfile.address || "",
        bio: userProfile.bio || ""
      });
    }
  }, [userProfile]);

  const handleTattooPreferencesUpdate = async (preferences: any) => {
    try {
      await updateTattooPreferences.mutateAsync({ userId, preferences });
      toast.success("Preferências de tatuagem atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar preferências de tatuagem");
    }
  };

  const handlePersonalPreferencesUpdate = async (preferences: any) => {
    try {
      await updatePersonalPreferences.mutateAsync({ userId, preferences });
      toast.success("Preferências pessoais atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar preferências pessoais");
    }
  };

  const handleBasicInfoUpdate = async () => {
    try {
      await updateBasicInfo.mutateAsync({ userId, basicInfo: basicFormData });
      setIsEditingBasic(false);
      toast.success("Informações básicas atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar informações básicas");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Carregando perfil...</div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Erro ao carregar perfil</div>
      </div>
    );
  }

  // Mock data para histórico de tatuagens
  const userTattoos = [
    {
      id: 1,
      name: "Lobo Realista",
      artist: "Mariana Silva",
      date: "2024-01-15",
      location: "Braço direito",
      image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=300&h=300&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Mandala Geométrica",
      artist: "Rafael Costa",
      date: "2023-08-20",
      location: "Antebraço",
      image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=300&h=300&auto=format&fit=crop"
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      artist: "Juliana Mendes",
      date: "2024-02-10",
      time: "14:00",
      service: "Tatuagem Aquarela - Flor",
      status: "Confirmado"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Seção Unificada de Perfil e Fidelidade */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl hover:shadow-red-glow transition-all duration-300">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Informações Básicas do Usuário */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="relative mb-4">
                    <Avatar className="w-32 h-32 border-4 border-red-600 shadow-xl">
                      <AvatarImage src={userProfile.avatar_url} />
                      <AvatarFallback className="text-2xl font-bold text-red-600 bg-red-50">
                        {userProfile.first_name[0]}{userProfile.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userProfile.first_name} {userProfile.last_name}
                  </h1>
                  <p className="text-gray-600 mb-4 max-w-md">
                    {userProfile.bio || "Adicione uma descrição ao seu perfil para que os artistas conheçam melhor você!"}
                  </p>
                  
                  {!isEditingBasic && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingBasic(true)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  )}
                </div>

                {/* Progresso do Perfil */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                  <div className="text-center mb-4">
                    <Target className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-red-700">Perfil Completo</h3>
                    <p className="text-red-600 text-2xl font-bold">{userProfile.profile_completion}%</p>
                  </div>
                  
                  <Progress 
                    value={userProfile.profile_completion} 
                    className="h-3 mb-4" 
                  />
                  
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-red-700 text-sm font-medium text-center">
                      💡 <strong>Quanto mais informações você compartilhar</strong> sobre suas preferências de tatuagens, gostos pessoais e interações com conteúdo, <strong>mais conseguiremos personalizar uma tatuagem única para você!</strong>
                    </p>
                  </div>
                  
                  {userProfile.profile_completion < 100 && (
                    <p className="text-red-600 text-sm mt-3 text-center">
                      Complete seu perfil para ganhar <strong>+50 pontos de fidelidade!</strong>
                    </p>
                  )}
                </div>

                {/* Status de Fidelidade */}
                <div>
                  <LoyaltyStatusCard loyaltyStatus={userProfile.loyalty_status} />
                </div>
              </div>

              {/* Edição de Informações Básicas */}
              {isEditingBasic && (
                <div className="mt-8 pt-8 border-t border-red-200">
                  <h3 className="text-xl font-bold text-red-600 mb-4">Editar Informações Básicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-red-600 font-medium">Nome</Label>
                      <Input
                        value={basicFormData.first_name}
                        onChange={(e) => setBasicFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        className="border-red-200 focus:border-red-600"
                      />
                    </div>
                    <div>
                      <Label className="text-red-600 font-medium">Sobrenome</Label>
                      <Input
                        value={basicFormData.last_name}
                        onChange={(e) => setBasicFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        className="border-red-200 focus:border-red-600"
                      />
                    </div>
                    <div>
                      <Label className="text-red-600 font-medium">E-mail</Label>
                      <Input
                        type="email"
                        value={basicFormData.email}
                        onChange={(e) => setBasicFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="border-red-200 focus:border-red-600"
                      />
                    </div>
                    <div>
                      <Label className="text-red-600 font-medium">Telefone</Label>
                      <Input
                        value={basicFormData.phone}
                        onChange={(e) => setBasicFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="border-red-200 focus:border-red-600"
                      />
                    </div>
                    <div>
                      <Label className="text-red-600 font-medium">Data de Nascimento</Label>
                      <Input
                        type="date"
                        value={basicFormData.date_of_birth}
                        onChange={(e) => setBasicFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                        className="border-red-200 focus:border-red-600"
                      />
                    </div>
                    <div>
                      <Label className="text-red-600 font-medium">Endereço</Label>
                      <Input
                        value={basicFormData.address}
                        onChange={(e) => setBasicFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="border-red-200 focus:border-red-600"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-red-600 font-medium">Bio</Label>
                      <Textarea
                        value={basicFormData.bio}
                        onChange={(e) => setBasicFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="border-red-200 focus:border-red-600"
                        placeholder="Conte um pouco sobre você, seus interesses e o que te inspira..."
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={handleBasicInfoUpdate}
                      disabled={updateBasicInfo.isPending}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg"
                    >
                      {updateBasicInfo.isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingBasic(false)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tattoo-preferences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-white border-red-200 shadow-lg">
            <TabsTrigger value="tattoo-preferences" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Brush className="h-4 w-4 mr-2" />
              Preferências de Tatuagem
            </TabsTrigger>
            <TabsTrigger value="personal-preferences" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Heart className="h-4 w-4 mr-2" />
              Gostos Pessoais
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              <Clock className="h-4 w-4 mr-2" />
              Meu Histórico
            </TabsTrigger>
          </TabsList>

          {/* Preferências de Tatuagem */}
          <TabsContent value="tattoo-preferences">
            <TattooPreferencesForm
              preferences={userProfile.tattoo_preferences}
              onUpdate={handleTattooPreferencesUpdate}
              isLoading={updateTattooPreferences.isPending}
            />
          </TabsContent>

          {/* Preferências Pessoais */}
          <TabsContent value="personal-preferences">
            <PersonalPreferencesForm
              preferences={userProfile.personal_preferences}
              onUpdate={handlePersonalPreferencesUpdate}
              isLoading={updatePersonalPreferences.isPending}
            />
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="history">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Minhas Tatuagens */}
              <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Minhas Tatuagens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userTattoos.map(tattoo => (
                      <div key={tattoo.id} className="group bg-white rounded-lg p-4 border border-red-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex gap-4">
                          <img
                            src={tattoo.image}
                            alt={tattoo.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-red-600 mb-1">{tattoo.name}</h4>
                            <p className="text-sm text-gray-600 mb-1">Por {tattoo.artist}</p>
                            <p className="text-xs text-gray-500">{tattoo.location}</p>
                            <p className="text-xs text-gray-500">{new Date(tattoo.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Próximos Agendamentos */}
              <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Próximos Agendamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map(appointment => (
                        <div key={appointment.id} className="bg-white rounded-lg p-4 border border-red-200">
                          <h4 className="font-semibold text-red-600 mb-2">{appointment.service}</h4>
                          <p className="text-sm text-gray-600 mb-1">Com {appointment.artist}</p>
                          <p className="text-sm text-gray-600 mb-2">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                          </p>
                          <Badge className="bg-green-100 text-green-700 border border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {appointment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Nenhum agendamento próximo</p>
                  )}
                  
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl"
                  >
                    Agendar Nova Consulta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
