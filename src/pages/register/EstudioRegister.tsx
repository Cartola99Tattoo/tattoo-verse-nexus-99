
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Building, Mail, User, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const EstudioRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studioName: "",
    cnpj: "",
    responsibleName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Bem-vindo ao ecossistema 99Tattoo. Redirecionando para configuração inicial..."
    });
    
    setTimeout(() => navigate("/admin/user-setup"), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/ecosistema" className="inline-flex items-center text-gray-600 hover:text-gray-700 mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Ecossistema
          </Link>
          <h1 className="text-3xl font-black text-gray-800 mb-2">99Tattoo</h1>
          <p className="text-gray-600">Cadastro de Estúdio</p>
        </div>

        <Card className="shadow-lg border-gray-200">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Building className="h-8 w-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Cadastre seu Estúdio
            </CardTitle>
            <p className="text-gray-600">
              Faça parte da maior plataforma de gestão para estúdios de tatuagem
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studioName" className="text-gray-700 font-medium">
                  Nome do Estúdio
                </Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="studioName"
                    name="studioName"
                    placeholder="Nome do seu estúdio"
                    value={formData.studioName}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 focus:border-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-gray-700 font-medium">
                  CNPJ
                </Label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibleName" className="text-gray-700 font-medium">
                  Nome do Responsável
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="responsibleName"
                    name="responsibleName"
                    placeholder="Seu nome completo"
                    value={formData.responsibleName}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 focus:border-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contato@estudio.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 border-gray-300 focus:border-gray-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-gray-500"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Cadastrar Estúdio
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Já tem conta?{" "}
                <Link to="/ecosistema" className="text-gray-600 hover:text-gray-700 font-medium">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstudioRegister;
