import { useState, useEffect } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info, ArrowRight, Loader2, Key, RefreshCw, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

// Esquema de validação para login de administrador
const adminLoginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

const AdminAuth = () => {
  const { user, signIn, profile } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState<{status: string, message: string} | null>(null);
  const navigate = useNavigate();
  const adminEmail = "adm99tattoo@gmail.com";

  // Se o usuário já estiver autenticado e for admin, redirecione para a página correta
  useEffect(() => {
    if (user && profile && (profile.role === "admin_estudio" || profile.role === "admin_nave_mae")) {
      console.log("AdminAuth: Usuário já autenticado como administrador, redirecionando...");
      const redirectPath = profile.role === "admin_nave_mae" ? "/nave-mae-da-tatuagem" : "/admin";
      navigate(redirectPath);
    }
  }, [user, profile, navigate]);

  // Verificar se o usuário admin existe
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        setCheckingAdmin(true);
        console.log("Verificando se o administrador existe...");
        const { data, error } = await supabase.functions.invoke("manage-admin", {
          body: {
            email: adminEmail,
            action: "check"
          }
        });
        
        console.log("Resposta da verificação do administrador:", data);
        
        if (error) {
          console.error("Erro ao verificar administrador:", error);
          toast({
            variant: "destructive",
            title: "Erro ao verificar administrador",
            description: error.message,
          });
          setLoginError(`Erro ao verificar status do administrador: ${error.message}`);
        } else {
          setAdminExists(data?.exists || false);
          setIsAdmin(data?.isAdmin || false);
          
          if (!data?.exists) {
            setLoginError("Conta de administrador ainda não foi configurada. Configure-a primeiro.");
          } else if (!data?.isAdmin) {
            setLoginError("A conta existe mas não tem permissão de administrador. Clique em 'Corrigir Permissões'.");
          }
        }
      } catch (err: any) {
        console.error("Erro ao verificar administrador:", err);
        setLoginError(`Erro ao verificar status do administrador: ${err.message}`);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminExists();
  }, []);

  // Form para login de administrador
  const loginForm = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: adminEmail, // Email do administrador já preenchido
      password: "",
    },
  });

  // Testar conexão para diagnóstico
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionInfo(null);
    
    try {
      // Verificar conexão com Supabase
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        setConnectionInfo({
          status: "error",
          message: `Erro de conexão com Supabase: ${error.message}`
        });
      } else {
        setConnectionInfo({
          status: "success",
          message: "Conexão com Supabase funcionando corretamente"
        });
      }
    } catch (err: any) {
      setConnectionInfo({
        status: "error",
        message: `Erro inesperado no teste de conexão: ${err.message}`
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Função para corrigir permissões de administrador
  const handleFixAdminRole = async () => {
    setIsUpdatingRole(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("manage-admin", {
        body: {
          email: adminEmail,
          action: "force_admin"
        }
      });
      
      if (error) {
        console.error("Erro ao atualizar permissões:", error);
        toast({
          variant: "destructive",
          title: "Erro ao atualizar permissões",
          description: error.message,
        });
      } else {
        console.log("Permissões atualizadas com sucesso:", data);
        toast({
          title: "Permissões atualizadas",
          description: "O usuário agora tem permissões de administrador.",
        });
        setIsAdmin(true);
        setLoginError("");
      }
    } catch (err: any) {
      console.error("Erro ao atualizar permissões:", err);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar permissões",
        description: err.message,
      });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Função para fazer login de administrador
  const handleAdminLogin = async (values: z.infer<typeof adminLoginSchema>) => {
    setIsSubmitting(true);
    setLoginError("");
    
    console.log("AdminAuth: Tentando fazer login administrativo com:", values.email);
    
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        console.error("AdminAuth: Erro ao fazer login:", error);
        
        let errorMessage: string;
        if (error.message === "Invalid login credentials") {
          errorMessage = "E-mail ou senha inválidos. Verifique se você configurou a senha de administrador corretamente na página de configuração.";
        } else {
          errorMessage = `Erro ao fazer login: ${error.message}`;
        }
        
        setLoginError(errorMessage);
        
        toast({
          variant: "destructive",
          title: "Falha no login",
          description: "Verifique suas credenciais e tente novamente.",
        });
      } else {
        console.log("AdminAuth: Login bem-sucedido, verificando permissões...");
        
        // Verificar se o usuário tem papel de administrador
        const { data } = await supabase.functions.invoke("manage-admin", {
          body: {
            email: adminEmail,
            action: "check"
          }
        });
        
        if (!data?.isAdmin) {
          console.log("Usuário logado mas não tem permissão de administrador, atualizando...");
          
          // Atualizar o papel do usuário para admin
          await supabase.functions.invoke("manage-admin", {
            body: {
              email: adminEmail,
              action: "force_admin"
            }
          });
          
          toast({
            title: "Permissões de administrador atualizadas",
            description: "Redirecionando para o painel administrativo...",
          });
        }
        
        toast({
          title: "Login bem-sucedido",
          description: "Redirecionando para o painel administrativo...",
        });
        
        // Recarregar a página para garantir que as permissões são aplicadas corretamente
        window.location.href = "/admin";
      }
    } catch (err: any) {
      console.error("AdminAuth: Erro não tratado:", err);
      setLoginError(`Erro inesperado: ${err.message}`);
      
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingAdmin) {
    return (
      <Layout>
        <div className="container max-w-md py-10">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            <p className="text-lg font-medium">Verificando configuração do administrador...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Admin Login - 99Tattoo</title>
      </Helmet>
      <div className="container max-w-md py-10">
        <Card className="border-2 border-black">
          <CardHeader className="bg-black text-white">
            <CardTitle>Painel Administrativo</CardTitle>
            <CardDescription className="text-gray-300">
              Acesso restrito para administradores do 99Tattoo.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {!adminExists ? (
              <Alert className="mb-4 bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">Administrador não configurado</AlertTitle>
                <AlertDescription className="text-amber-600">
                  A conta de administrador ainda não foi configurada. Você precisa configurar uma senha para a conta de administrador primeiro.
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300"
                      onClick={() => navigate("/admin-setup")}
                    >
                      Ir para configuração <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ) : adminExists && !isAdmin ? (
              <Alert className="mb-4 bg-amber-50 border-amber-200">
                <Shield className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">Permissão de administrador ausente</AlertTitle>
                <AlertDescription className="text-amber-600">
                  A conta existe mas não tem permissões de administrador. Isso pode ser corrigido automaticamente.
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300"
                      onClick={handleFixAdminRole}
                      disabled={isUpdatingRole}
                    >
                      {isUpdatingRole ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Atualizando...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Corrigir permissões
                        </>
                      )}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700">Informação</AlertTitle>
                <AlertDescription className="text-blue-600">
                  Use a senha configurada para a conta de administrador. Se você esqueceu, pode resetá-la na página de configuração.
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleAdminLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail de Administrador</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite sua senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loginError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                <div className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-black hover:bg-gray-800" 
                    disabled={isSubmitting || !adminExists}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      <>
                        <Key className="mr-2 h-4 w-4" />
                        Entrar como Administrador
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center my-1">
                    <Link to="/admin-setup" className="text-blue-600 hover:underline w-full">
                      Esqueci minha senha / Configurar senha
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Ferramentas de diagnóstico</h4>
              
              <Button 
                variant="outline" 
                onClick={handleTestConnection} 
                disabled={isTestingConnection}
                className="w-full"
                size="sm"
              >
                {isTestingConnection ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Testar conexão com Supabase
              </Button>
              
              {connectionInfo && (
                <Alert variant={connectionInfo.status === "success" ? "default" : "destructive"} className={connectionInfo.status === "success" ? "bg-green-50 border-green-200" : ""}>
                  <AlertTitle>{connectionInfo.status === "success" ? "Sucesso" : "Erro"}</AlertTitle>
                  <AlertDescription>{connectionInfo.message}</AlertDescription>
                </Alert>
              )}
              
              <div className="text-sm text-gray-500 mt-4">
                <h5 className="font-medium">Passos para solucionar problemas:</h5>
                <ol className="list-decimal list-inside space-y-1 mt-1">
                  <li>Verifique se você configurou a senha na página <Link to="/admin-setup" className="text-blue-600 hover:underline">configuração</Link></li>
                  <li>Limpe o cache do navegador e tente novamente</li>
                  <li>Tente usar o botão "Corrigir permissões" se disponível</li>
                  <li>Após o login bem-sucedido, recarregue a página se necessário</li>
                </ol>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center mt-4">
              <Link to="/auth" className="text-blue-600 hover:underline">
                Voltar para login de cliente
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminAuth;
