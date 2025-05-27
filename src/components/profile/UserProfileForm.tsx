
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { getUserProfileService } from "@/services/serviceFactory";
import { UserProfile } from "@/services/interfaces/IUserProfileService";
import { toast } from "@/hooks/use-toast";
import { Camera, User, MapPin, Heart, Star, Trophy } from "lucide-react";

interface UserProfileFormProps {
  userId: string;
}

const TATTOO_STYLES = [
  'Realismo', 'Old School', 'Neo-Tradicional', 'Fineline', 'Oriental',
  'Geométrica', 'Blackwork', 'Aquarela', 'Minimalista', 'Biomecânico'
];

const TATTOO_THEMES = [
  'Animais', 'Flores', 'Geométrica', 'Filmes/Séries', 'Geek',
  'Religiosa', 'Tribal', 'Natureza', 'Abstrata', 'Retratos'
];

const BODY_PARTS = [
  'Braço', 'Antebraço', 'Peito', 'Costas', 'Perna', 'Coxa',
  'Ombro', 'Punho', 'Tornozelo', 'Pescoço', 'Mão', 'Pé'
];

const MOCK_ARTISTS = [
  { id: 'artist-1', name: 'Carlos Rodrigues' },
  { id: 'artist-2', name: 'Ana Santos' },
  { id: 'artist-3', name: 'Pedro Lima' },
  { id: 'artist-4', name: 'Maria Costa' }
];

const UserProfileForm = ({ userId }: UserProfileFormProps) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const queryClient = useQueryClient();
  const userProfileService = getUserProfileService();

  // Buscar perfil do usuário
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => userProfileService.fetchUserProfile(userId),
  });

  // Buscar jornada do usuário
  const { data: journey } = useQuery({
    queryKey: ['user-journey', userId],
    queryFn: () => userProfileService.getTattooJourney(userId),
  });

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: (profileData: Partial<UserProfile>) =>
      userProfileService.updateUserProfile(userId, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['user-journey', userId] });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleArrayFieldChange = (field: keyof UserProfile, value: string, checked: boolean) => {
    const currentValues = (formData[field] as string[]) || [];
    if (checked) {
      setFormData({
        ...formData,
        [field]: [...currentValues, value]
      });
    } else {
      setFormData({
        ...formData,
        [field]: currentValues.filter(item => item !== value)
      });
    }
  };

  const getStageLabel = (stage: string) => {
    const labels = {
      new_client: 'Novo Cliente',
      returning_client: 'Cliente Recorrente',
      bronze_loyalty: 'Fidelidade Bronze',
      vip_client: 'Cliente VIP'
    };
    return labels[stage as keyof typeof labels] || stage;
  };

  const getStageColor = (stage: string) => {
    const colors = {
      new_client: 'bg-blue-100 text-blue-800',
      returning_client: 'bg-green-100 text-green-800',
      bronze_loyalty: 'bg-orange-100 text-orange-800',
      vip_client: 'bg-purple-100 text-purple-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando perfil...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Jornada 99Tattoo */}
      {journey && (
        <Card className="card-enhanced">
          <CardHeader className="card-header-red">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-red-600" />
                  Sua Jornada 99Tattoo
                </CardTitle>
                <CardDescription>Acompanhe seu progresso conosco</CardDescription>
              </div>
              <Badge className={getStageColor(journey.stage)}>
                {getStageLabel(journey.stage)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{journey.total_tattoos}</div>
                <p className="text-sm text-gray-600">Tatuagens Realizadas</p>
              </div>
              
              {journey.next_appointment && (
                <div className="text-center">
                  <div className="text-lg font-semibold">{new Date(journey.next_appointment.date).toLocaleDateString()}</div>
                  <p className="text-sm text-gray-600">Próximo Agendamento</p>
                  <p className="text-xs text-gray-500">com {journey.next_appointment.artist}</p>
                </div>
              )}
              
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{journey.loyalty_benefits?.length || 0}</div>
                <p className="text-sm text-gray-600">Benefícios Ativos</p>
              </div>
            </div>

            {journey.loyalty_benefits && journey.loyalty_benefits.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Seus Benefícios de Fidelidade:</h4>
                <div className="space-y-1">
                  {journey.loyalty_benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Completude do Perfil */}
      {profile && (
        <Card className="card-enhanced">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Completude do Perfil</span>
              <span className="text-sm text-gray-600">{profile.profile_completeness}%</span>
            </div>
            <Progress value={profile.profile_completeness} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              Complete seu perfil para receber recomendações personalizadas
            </p>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Pessoais */}
        <Card className="card-enhanced">
          <CardHeader className="card-header-gradient">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData.profile_image} />
                <AvatarFallback className="bg-red-100 text-red-800">
                  {formData.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Alterar Foto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor="birth_date">Data de Nascimento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date || ''}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="gender">Gênero</Label>
                <Select
                  value={formData.gender || ''}
                  onValueChange={(value) => setFormData({ ...formData, gender: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefiro não dizer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card className="card-enhanced">
          <CardHeader className="card-header-gradient">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address_street">Rua</Label>
                <Input
                  id="address_street"
                  value={formData.address_street || ''}
                  onChange={(e) => setFormData({ ...formData, address_street: e.target.value })}
                  placeholder="Nome da rua"
                />
              </div>

              <div>
                <Label htmlFor="address_number">Número</Label>
                <Input
                  id="address_number"
                  value={formData.address_number || ''}
                  onChange={(e) => setFormData({ ...formData, address_number: e.target.value })}
                  placeholder="123"
                />
              </div>

              <div>
                <Label htmlFor="address_district">Bairro</Label>
                <Input
                  id="address_district"
                  value={formData.address_district || ''}
                  onChange={(e) => setFormData({ ...formData, address_district: e.target.value })}
                  placeholder="Nome do bairro"
                />
              </div>

              <div>
                <Label htmlFor="address_city">Cidade</Label>
                <Input
                  id="address_city"
                  value={formData.address_city || ''}
                  onChange={(e) => setFormData({ ...formData, address_city: e.target.value })}
                  placeholder="Nome da cidade"
                />
              </div>

              <div>
                <Label htmlFor="address_state">Estado</Label>
                <Input
                  id="address_state"
                  value={formData.address_state || ''}
                  onChange={(e) => setFormData({ ...formData, address_state: e.target.value })}
                  placeholder="SP"
                />
              </div>

              <div>
                <Label htmlFor="address_zip_code">CEP</Label>
                <Input
                  id="address_zip_code"
                  value={formData.address_zip_code || ''}
                  onChange={(e) => setFormData({ ...formData, address_zip_code: e.target.value })}
                  placeholder="12345-678"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferências de Tatuagem */}
        <Card className="card-enhanced">
          <CardHeader className="card-header-red">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Preferências de Tatuagem
            </CardTitle>
            <CardDescription>
              Nos conte sobre seus gostos para recebermos recomendações personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Estilos Preferidos */}
            <div>
              <Label className="text-base font-medium mb-3 block">Estilos Preferidos</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TATTOO_STYLES.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={`style-${style}`}
                      checked={(formData.preferred_tattoo_styles || []).includes(style)}
                      onCheckedChange={(checked) => 
                        handleArrayFieldChange('preferred_tattoo_styles', style, checked as boolean)
                      }
                    />
                    <Label htmlFor={`style-${style}`} className="text-sm">{style}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Temas de Interesse */}
            <div>
              <Label className="text-base font-medium mb-3 block">Temas de Interesse</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {TATTOO_THEMES.map((theme) => (
                  <div key={theme} className="flex items-center space-x-2">
                    <Checkbox
                      id={`theme-${theme}`}
                      checked={(formData.preferred_themes || []).includes(theme)}
                      onCheckedChange={(checked) => 
                        handleArrayFieldChange('preferred_themes', theme, checked as boolean)
                      }
                    />
                    <Label htmlFor={`theme-${theme}`} className="text-sm">{theme}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tatuadores de Interesse */}
            <div>
              <Label className="text-base font-medium mb-3 block">Tatuadores de Interesse</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {MOCK_ARTISTS.map((artist) => (
                  <div key={artist.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`artist-${artist.id}`}
                      checked={(formData.preferred_artists || []).includes(artist.id)}
                      onCheckedChange={(checked) => 
                        handleArrayFieldChange('preferred_artists', artist.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`artist-${artist.id}`} className="text-sm">{artist.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Partes do Corpo */}
            <div>
              <Label className="text-base font-medium mb-3 block">Partes do Corpo Preferidas</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {BODY_PARTS.map((part) => (
                  <div key={part} className="flex items-center space-x-2">
                    <Checkbox
                      id={`part-${part}`}
                      checked={(formData.preferred_body_parts || []).includes(part)}
                      onCheckedChange={(checked) => 
                        handleArrayFieldChange('preferred_body_parts', part, checked as boolean)
                      }
                    />
                    <Label htmlFor={`part-${part}`} className="text-sm">{part}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tamanho Preferido */}
            <div>
              <Label htmlFor="preferred_size">Tamanho Preferido</Label>
              <Select
                value={formData.preferred_size || ''}
                onValueChange={(value) => setFormData({ ...formData, preferred_size: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tamanho preferido" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Pequena</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                  <SelectItem value="sleeve">Fechamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Observações Adicionais */}
            <div>
              <Label htmlFor="additional_notes">Observações Adicionais</Label>
              <Textarea
                id="additional_notes"
                value={formData.additional_notes || ''}
                onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                placeholder="Conte-nos mais sobre suas preferências, inspirações ou qualquer informação que possa nos ajudar a personalizar sua experiência..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={updateProfileMutation.isPending}
            className="btn-gradient"
          >
            {updateProfileMutation.isPending ? "Salvando..." : "Salvar Perfil"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;
