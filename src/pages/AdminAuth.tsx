
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
import { AlertCircle, Info, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Schema de validação para login de administrador
const adminLoginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

const AdminAuth = () => {
  const { user, signIn } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const navigate = useNavigate();

  // Verificar se o usuário admin existe
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        setCheckingAdmin(true);
        console.log("Verificando se o administrador existe...");
        const { data, error } = await supabase.functions.invoke("manage-admin", {
          body: {
            email: "adm99tattoo@gmail.com",
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
        } else {
          setAdminExists(data?.exists || false);
        }
      } catch (err) {
        console.error("Erro ao verificar administrador:", err);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminExists();
  }, []);

  // Se o usuário já estiver autenticado, redirecione para a página do admin
  if (user) {
    console.log("AdminAuth: Usuário já autenticado, redirecionando...", user);
    return <Navigate to="/admin" />;
  }

  // Form para login de administrador
  const loginForm = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "adm99tattoo@gmail.com", // Email do administrador já preenchido
      password: "",
    },
  });

  // Função para fazer login de administrador
  const handleAdminLogin = async (values: z.infer<typeof adminLoginSchema>) => {
    setIsSubmitting(true);
    setLoginError("");
    
    console.log("AdminAuth: Tentando fazer login administrativo com:", values.email);
    
    const { error } = await signIn(values.email, values.password);
    
    if (error) {
      console.error("AdminAuth: Erro ao fazer login:", error);
      setLoginError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha inválidos. Verifique se você configurou uma senha de administrador corretamente na página de configuração."
          : `Erro ao fazer login: ${error.message}`
      );
      
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: "Verifique suas credenciais e tente novamente.",
      });
    } else {
      console.log("AdminAuth: Login bem-sucedido, redirecionando para o painel administrativo...");
      toast({
        title: "Login bem-sucedido",
        description: "Redirecionando para o painel administrativo...",
      });
      navigate("/admin");
    }
    
    setIsSubmitting(false);
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
                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800" 
                  disabled={isSubmitting || !adminExists}
                >
                  {isSubmitting ? "Entrando..." : "Entrar como Administrador"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center">
              <Link to="/admin-setup" className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-md block font-medium">
                Configurar usuário administrador
              </Link>
              <p className="mt-2 text-gray-500">
                Não tem acesso? Você precisa configurar uma senha de administrador primeiro.
              </p>
            </div>
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
