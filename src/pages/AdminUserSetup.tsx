
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Info, Loader2, KeyRound } from "lucide-react";

// Schema de validação para setup do administrador
const adminSetupSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
    .refine(password => {
      // Verifica se a senha contém pelo menos um número
      return /\d/.test(password);
    }, {
      message: "A senha deve conter pelo menos um número",
    })
    .refine(password => {
      // Verifica se a senha contém pelo menos um caractere especial
      return /[!@#$%^&*(),.?":{}|<>]/.test(password);
    }, {
      message: "A senha deve conter pelo menos um caractere especial",
    }),
  confirmPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const AdminUserSetup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const navigate = useNavigate();
  
  // Verificar se o usuário admin existe
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        setCheckingAdmin(true);
        const { data, error } = await supabase.functions.invoke("manage-admin", {
          body: {
            email: "adm99tattoo@gmail.com",
            action: "check"
          }
        });
        
        console.log("AdminUserSetup: Resposta da verificação:", data);
        setDebugInfo(data);
        
        if (error) {
          console.error("AdminUserSetup: Erro ao verificar usuário:", error);
          setError(`Erro ao verificar usuário administrador: ${error.message}`);
        } else {
          setAdminExists(data?.exists || false);
        }
      } catch (err: any) {
        console.error("AdminUserSetup: Erro ao verificar usuário:", err);
        setError(`Erro ao verificar usuário administrador: ${err.message}`);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminExists();
  }, []);
  
  const form = useForm<z.infer<typeof adminSetupSchema>>({
    resolver: zodResolver(adminSetupSchema),
    defaultValues: {
      email: "adm99tattoo@gmail.com", // Email pré-definido
      password: "",
      confirmPassword: "",
    },
  });

  const handleSetupAdmin = async (values: z.infer<typeof adminSetupSchema>) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log("AdminUserSetup: Iniciando configuração do administrador...");
      
      const action = adminExists ? "update_password" : "create";
      
      // Utilizando a função customizada do Edge Function para criar ou atualizar o administrador
      console.log(`AdminUserSetup: ${adminExists ? 'Atualizando' : 'Criando'} usuário administrador...`);
      const { data, error: actionError } = await supabase.functions.invoke("manage-admin", {
        body: {
          email: values.email,
          password: values.password,
          action: action
        }
      });
      
      setDebugInfo(data);
      
      if (actionError) {
        console.error(`AdminUserSetup: Erro ao ${adminExists ? 'atualizar' : 'criar'} administrador:`, actionError);
        throw actionError;
      }
      
      console.log("AdminUserSetup: Operação concluída com sucesso");
      setSuccess(`${adminExists ? 'Senha atualizada' : 'Usuário administrador criado'} com sucesso! Você já pode fazer login usando o email ${values.email} e a senha que acabou de configurar.`);
      setAdminExists(true);
      
      // Adicionar um toast para melhor feedback visual
      toast({
        title: adminExists ? "Senha atualizada" : "Administrador criado",
        description: `${adminExists ? 'A senha para' : 'O usuário administrador'} ${values.email} foi ${adminExists ? 'atualizada' : 'criado'} com sucesso.`,
      });
      
      // Reset form
      form.reset({
        email: values.email,
        password: "",
        confirmPassword: "",
      });
      
      // Redirecionar após um tempo
      setTimeout(() => navigate('/admin-auth'), 3000);
    } catch (err: any) {
      console.error("AdminUserSetup: Erro completo:", err);
      const errorMessage = err.message || "Erro desconhecido";
      setError(`Erro ao configurar usuário administrador: ${errorMessage}`);
      
      // Adicionar um toast para melhor feedback visual
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao configurar administrador: ${errorMessage}`
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
        <title>Configuração de Administrador - 99Tattoo</title>
      </Helmet>
      <div className="container max-w-md py-10">
        <Card className="border-2 border-black">
          <CardHeader className="bg-black text-white">
            <CardTitle>Configuração de Administrador</CardTitle>
            <CardDescription className="text-gray-300">
              {adminExists 
                ? "Atualize a senha do administrador para o sistema 99Tattoo." 
                : "Configure o acesso do administrador para o sistema 99Tattoo."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">Sucesso</AlertTitle>
                <AlertDescription className="text-green-600">{success}</AlertDescription>
              </Alert>
            )}
            
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Instruções importantes</AlertTitle>
              <AlertDescription className="text-blue-600">
                {adminExists 
                  ? "Esta página permite atualizar a senha da conta de administrador." 
                  : "Esta página permite criar a conta de administrador inicial do sistema."}
                <ul className="list-disc pl-5 mt-2">
                  <li>A senha deve ter pelo menos 8 caracteres</li>
                  <li>Deve incluir pelo menos um número</li>
                  <li>Deve incluir pelo menos um caractere especial (ex: !@#$%)</li>
                </ul>
                {adminExists && (
                  <p className="mt-2 font-semibold">Após salvar, você poderá fazer login com o email adm99tattoo@gmail.com e a nova senha.</p>
                )}
              </AlertDescription>
            </Alert>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSetupAdmin)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail do Administrador</FormLabel>
                      <FormControl>
                        <Input disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite a senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirme a senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {adminExists ? "Atualizando senha..." : "Configurando..."}
                    </>
                  ) : (
                    <>
                      <KeyRound className="mr-2 h-4 w-4" />
                      {adminExists ? "Atualizar senha do administrador" : "Configurar administrador"}
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            {debugInfo && (
              <div className="mt-6">
                <details className="text-xs text-gray-500">
                  <summary className="cursor-pointer">Informações de diagnóstico</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-gray-700 overflow-x-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={() => navigate("/admin-auth")}
              className="p-0 h-auto"
            >
              Voltar para o login de administrador
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminUserSetup;
