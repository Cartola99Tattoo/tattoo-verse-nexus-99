
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Palette, Mail, Lock, ArrowLeft } from "lucide-react";

const TatuadorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - redirect to tattoo artist dashboard
    navigate("/tatuadores-da-nova-era/dashboard");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <h1 className="text-3xl font-black text-gray-800 mb-2">99Tattoo</h1>
          <p className="text-gray-600">Login de Tatuador</p>
        </div>

        <Card className="shadow-lg border-gray-200">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-100 to-red-100 rounded-full flex items-center justify-center">
              <Palette className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Portal do Artista
            </CardTitle>
            <p className="text-gray-600">
              Gerencie seu perfil e conecte-se com clientes
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  E-mail do Artista
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="artista@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-bold py-3"
              >
                Acessar Dashboard
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Ainda não faz parte da comunidade?{" "}
                <Link to="/register/artist" className="text-purple-600 hover:text-purple-700 font-medium">
                  Cadastre-se aqui
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">Ou acesse como:</p>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login/cliente">
                  <Button variant="outline" className="w-full text-sm">
                    Cliente
                  </Button>
                </Link>
                <Link to="/login/estudio">
                  <Button variant="outline" className="w-full text-sm">
                    Estúdio
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TatuadorLogin;
