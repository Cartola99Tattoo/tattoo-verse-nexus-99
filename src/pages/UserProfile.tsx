
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  Upload,
  Star,
  Clock,
  Target
} from "lucide-react";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "João",
    lastName: "Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    dateOfBirth: "1990-05-15",
    address: "Rua das Flores, 123 - Vila Madalena, São Paulo - SP",
    bio: "Apaixonado por tatuagens e arte corporal. Colecionador de trabalhos únicos e sempre em busca de novos estilos.",
    preferences: {
      styles: ["Realismo", "Blackwork", "Geométrico"],
      bodyParts: ["Braço", "Perna", "Costas"],
      budget: "R$ 1.000 - R$ 2.500"
    }
  });

  // Mock data for user tattoos and appointments
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

  const loyaltyStatus = {
    level: "Bronze",
    points: 150,
    nextLevel: "Prata",
    pointsToNext: 100,
    benefits: ["5% desconto", "Prioridade no agendamento"]
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile updated:", profileData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&auto=format&fit=crop" />
                <AvatarFallback className="text-2xl font-bold text-red-600">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-white text-red-600 hover:bg-red-50 shadow-lg"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-red-100 mb-4 max-w-md">
                {profileData.bio}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className="bg-white text-red-600 font-medium">
                  Cliente {loyaltyStatus.level}
                </Badge>
                <Badge variant="outline" className="border-white text-white">
                  {loyaltyStatus.points} pontos
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  {isEditing ? "Cancelar" : "Editar"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-red-600 font-medium">Nome</Label>
                        <Input
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="border-red-200 focus:border-red-600"
                        />
                      </div>
                      <div>
                        <Label className="text-red-600 font-medium">Sobrenome</Label>
                        <Input
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="border-red-200 focus:border-red-600"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-red-600 font-medium">E-mail</Label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="border-red-200 focus:border-red-600"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-red-600 font-medium">Telefone</Label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="border-red-200 focus:border-red-600"
                        />
                      </div>
                      <div>
                        <Label className="text-red-600 font-medium">Data de Nascimento</Label>
                        <Input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          className="border-red-200 focus:border-red-600"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-red-600 font-medium">Endereço</Label>
                      <Input
                        value={profileData.address}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        className="border-red-200 focus:border-red-600"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-red-600 font-medium">Bio</Label>
                      <Textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="border-red-200 focus:border-red-600"
                      />
                    </div>
                    
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg"
                    >
                      Salvar Alterações
                    </Button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-600">E-mail</p>
                          <p className="font-medium">{profileData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-600">Telefone</p>
                          <p className="font-medium">{profileData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-600">Data de Nascimento</p>
                          <p className="font-medium">{new Date(profileData.dateOfBirth).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-600">Endereço</p>
                          <p className="font-medium">{profileData.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Tattoos */}
            <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Minhas Tatuagens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Preferences */}
            <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Preferências
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-red-600 font-medium mb-2 block">Estilos Favoritos</Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.preferences.styles.map(style => (
                      <Badge key={style} variant="outline" className="border-red-200 text-red-600">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-red-600 font-medium mb-2 block">Partes do Corpo</Label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.preferences.bodyParts.map(part => (
                      <Badge key={part} variant="outline" className="border-red-200 text-red-600">
                        {part}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-red-600 font-medium mb-2 block">Orçamento</Label>
                  <Badge className="bg-red-100 text-red-700 border border-red-200">
                    {profileData.preferences.budget}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Loyalty Status */}
            <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Status de Fidelidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-full p-6">
                    <h3 className="text-2xl font-bold text-red-600">{loyaltyStatus.level}</h3>
                    <p className="text-red-600">{loyaltyStatus.points} pontos</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-sm text-gray-600 mb-2">Próximo nível: {loyaltyStatus.nextLevel}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-red-600 to-red-800 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(loyaltyStatus.points / (loyaltyStatus.points + loyaltyStatus.pointsToNext)) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">Faltam {loyaltyStatus.pointsToNext} pontos</p>
                  </div>
                  
                  <div>
                    <h4 className="text-red-600 font-medium mb-2">Benefícios Ativos</h4>
                    <div className="space-y-1">
                      {loyaltyStatus.benefits.map((benefit, index) => (
                        <Badge key={index} variant="outline" className="border-red-200 text-red-600 block">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
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
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum agendamento próximo</p>
                )}
                
                <Button 
                  className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                >
                  Agendar Nova Consulta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
