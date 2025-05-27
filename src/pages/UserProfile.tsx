
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import UserProfileForm from "@/components/profile/UserProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const UserProfile = () => {
  const navigate = useNavigate();
  
  // Mock user ID - em uma aplicação real, viria do contexto de autenticação
  const userId = "user-1";

  // Redirecionar /profile para /user-profile
  useEffect(() => {
    if (window.location.pathname === '/profile') {
      navigate('/user-profile', { replace: true });
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Button>
              
              <Card className="card-enhanced">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold text-gradient-red">
                    Meu Perfil 99Tattoo
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Gerencie suas informações e preferências para uma experiência personalizada
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Formulário do Perfil */}
            <UserProfileForm userId={userId} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
