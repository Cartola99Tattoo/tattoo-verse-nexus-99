
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TattooJourney from "@/components/user/TattooJourney";
import UserPreferences from "@/components/user/UserPreferences";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

const UserProfile = () => {
  // TODO: Get user data from auth context or service
  const user = {
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    address: "São Paulo, SP",
    memberSince: "2024-01-15"
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-gray-600 mt-2">
              Gerencie suas informações e acompanhe sua jornada na 99Tattoo
            </p>
          </div>

          {/* User Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Nome:</span>
                  <span>{user.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Telefone:</span>
                  <span>{user.phone}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Localização:</span>
                  <span>{user.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Membro desde:</span>
                  <span>{new Date(user.memberSince).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tattoo Journey */}
          <TattooJourney />

          {/* User Preferences */}
          <UserPreferences />

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Suas últimas interações com a 99Tattoo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Cadastro realizado</p>
                    <p className="text-xs text-gray-500">15 de janeiro, 2024</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Preferências atualizadas</p>
                    <p className="text-xs text-gray-500">20 de janeiro, 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
