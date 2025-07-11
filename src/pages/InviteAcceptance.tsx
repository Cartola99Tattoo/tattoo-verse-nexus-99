
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, CheckCircle, XCircle, UserPlus, Lock, Mail, User } from "lucide-react";

const InviteAcceptance = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [artistData, setArtistData] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    setIsLoading(true);
    
    // Simula validação do token
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (token && token.startsWith('invite_')) {
      // Simula dados do artista baseado no token
      const mockArtistData = {
        id: "artist_123",
        first_name: "João",
        last_name: "Silva",
        email: "joao.silva@example.com",
        style: "Realismo",
        permissions: {
          canViewOwnAppointments: true,
          canEditOwnAppointments: false,
          canViewClients: true,
          canAddClients: false,
          canEditOwnPortfolio: true,
          canViewFinancialSummary: false,
          canAccessShop: false,
          canViewReports: false,
        }
      };
      
      setArtistData(mockArtistData);
      setIsValidToken(true);
      
      console.log('Token validado:', {
        token,
        artistData: mockArtistData,
        validatedAt: new Date().toISOString()
      });
    } else {
      setIsValidToken(false);
    }
    
    setIsLoading(false);
  };

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simula criação de conta e login
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Convite aceito:', {
        token,
        artistId: artistData.id,
        password: password, // Em produção, isso seria hasheado
        acceptedAt: new Date().toISOString(),
        status: 'activated'
      });

      // Simula invalidação do token
      console.log('Token invalidado:', token);

      toast({
        title: "Bem-vindo!",
        description: "Sua conta foi criada com sucesso",
      });

      // Redireciona para o painel do tatuador
      navigate('/artist-dashboard');
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar convite. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl bg-gradient-to-br from-white to-red-50 border-red-200">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <h2 className="text-xl font-bold text-gray-800">Validando convite...</h2>
              <p className="text-gray-600">Aguarde enquanto verificamos seu convite</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl bg-gradient-to-br from-white to-red-50 border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-t-lg">
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <XCircle className="h-6 w-6" />
              Convite Inválido
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Este link de convite é inválido ou já foi utilizado. Entre em contato com o administrador para obter um novo convite.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => navigate('/')}
              className="w-full mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl bg-gradient-to-br from-white to-red-50 border-red-200">
        <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-t-lg">
          <CardTitle className="text-xl font-black flex items-center gap-2">
            <UserPlus className="h-6 w-6" />
            Bem-vindo à 99Tattoo
          </CardTitle>
          <CardDescription className="text-red-100">
            Complete seu cadastro para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {/* Informações do artista */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Convite Válido</p>
                <p className="text-sm text-green-600">
                  {artistData.first_name} {artistData.last_name}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAcceptInvite} className="space-y-6">
            {/* Informações preenchidas */}
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-red-600" />
                  Nome Completo
                </Label>
                <Input
                  value={`${artistData.first_name} ${artistData.last_name}`}
                  disabled
                  className="bg-gray-100 border-gray-300"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-red-600" />
                  E-mail
                </Label>
                <Input
                  value={artistData.email}
                  disabled
                  className="bg-gray-100 border-gray-300"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-red-600" />
                  Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="pr-10 border-red-200 focus:border-red-500 focus:ring-red-200"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirmar Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua senha"
                    className="pr-10 border-red-200 focus:border-red-500 focus:ring-red-200"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Criando conta...
                </div>
              ) : (
                "Aceitar Convite e Criar Conta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <strong>Suas permissões:</strong> Após criar sua conta, você terá acesso a funcionalidades específicas definidas pelo administrador do estúdio.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteAcceptance;
