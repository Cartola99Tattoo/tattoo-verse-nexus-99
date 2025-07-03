
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useEcosistemaAuth, getRedirectUrlByRole } from "@/contexts/EcosistemaAuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const UnifiedLoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { login, isLoading } = useEcosistemaAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para sua área..."
      });
      
      // Buscar o usuário logado para obter role e profileId
      const mockUsers = [
        { email: "cliente@teste.com", role: "cliente", profileId: "cliente-1" },
        { email: "estudio@teste.com", role: "admin_estudio", profileId: "estudio-1" },
        { email: "tatuador@teste.com", role: "tatuador_da_nova_era", profileId: "1" },
        { email: "tatuadora@teste.com", role: "tatuador_da_nova_era", profileId: "2" },
        { email: "roberto@teste.com", role: "tatuador_cadastrado_admin", profileId: "3" },
        { email: "admin@teste.com", role: "admin_nave_mae", profileId: "admin-1" }
      ];
      
      const user = mockUsers.find(u => u.email === formData.email);
      if (user) {
        const redirectUrl = getRedirectUrlByRole(user.role as any, user.profileId);
        setTimeout(() => navigate(redirectUrl), 1500);
      }
    } else {
      toast({
        title: "Erro no login",
        description: result.error || "Credenciais inválidas",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white font-medium">
          E-mail
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10 bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-red-400"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white font-medium">
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
            className="pl-10 bg-white/20 border-white/30 text-white placeholder-gray-300 focus:border-red-400"
            required
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 text-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          <>
            Entrar no Ecossistema
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>

      <div className="text-center">
        <button 
          type="button"
          className="text-red-300 hover:text-red-200 text-sm transition-colors"
        >
          Esqueceu a senha?
        </button>
      </div>

      <div className="mt-4 p-3 bg-red-900/30 rounded-lg border border-red-500/30">
        <p className="text-xs text-red-200 mb-2">Dados para teste:</p>
        <p className="text-xs text-red-100">Cliente: cliente@teste.com / 123456</p>
        <p className="text-xs text-red-100">Estúdio: estudio@teste.com / 123456</p>
        <p className="text-xs text-red-100">Tatuador Carlos: tatuador@teste.com / 123456</p>
        <p className="text-xs text-red-100">Tatuadora Ana: tatuadora@teste.com / 123456</p>
        <p className="text-xs text-red-100">Tatuador Roberto: roberto@teste.com / 123456</p>
      </div>
    </form>
  );
};

export default UnifiedLoginForm;
