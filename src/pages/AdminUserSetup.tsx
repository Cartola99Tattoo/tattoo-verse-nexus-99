
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
import { CheckCircle, AlertCircle } from "lucide-react";

// Schema de validação para setup do administrador
const adminSetupSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  confirmPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const AdminUserSetup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Verificar a configuração do Supabase ao carregar a página
    console.log("AdminUserSetup: Verificando configuração do Supabase...");
    // Remover a referência direta ao supabaseUrl que estava causando o erro
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
      
      // Utilizando a função customizada do Edge Function para verificar se o usuário existe
      console.log("AdminUserSetup: Verificando se o usuário existe...");
      const { data: userCheck, error: checkError } = await supabase.functions.invoke("manage-admin", {
        body: {
          email: values.email,
          action: "check"
        }
      });
      
      console.log("AdminUserSetup: Resposta da verificação:", userCheck);
      
      if (checkError) {
        console.error("AdminUserSetup: Erro ao verificar usuário:", checkError);
        throw checkError;
      }
      
      if (userCheck?.exists) {
        console.log("AdminUserSetup: Usuário existe, atualizando senha...");
        // Usuário existe, atualizar a senha
        const { error: updateError } = await supabase.functions.invoke("manage-admin", {
          body: {
            email: values.email,
            password: values.password,
            action: "update_password"
          }
        });
        
        if (updateError) {
          console.error("AdminUserSetup: Erro ao atualizar senha:", updateError);
          throw updateError;
        }
        
        console.log("AdminUserSetup: Senha atualizada com sucesso");
        setSuccess(`Senha atualizada com sucesso para ${values.email}. Você pode fazer login agora.`);
        
        // Adicionar um toast para melhor feedback visual
        toast({
          title: "Senha atualizada",
          description: `A senha para ${values.email} foi atualizada com sucesso.`,
        });
        
        setTimeout(() => navigate('/auth'), 3000);
      } else {
        console.log("AdminUserSetup: Usuário não existe, criando novo...");
        // Usuário não existe, criar novo
        const { error: createError } = await supabase.functions.invoke("manage-admin", {
          body: {
            email: values.email,
            password: values.password,
            action: "create"
          }
        });
        
        if (createError) {
          console.error("AdminUserSetup: Erro ao criar usuário:", createError);
          throw createError;
        }
        
        console.log("AdminUserSetup: Usuário administrador criado com sucesso");
        setSuccess(`Usuário administrador criado com sucesso: ${values.email}. Você pode fazer login agora.`);
        
        // Adicionar um toast para melhor feedback visual
        toast({
          title: "Administrador criado",
          description: `O usuário administrador ${values.email} foi criado com sucesso.`,
        });
        
        setTimeout(() => navigate('/auth'), 3000);
      }
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

  return (
    <Layout>
      <Helmet>
        <title>Configuração de Administrador - 99Tattoo</title>
      </Helmet>
      <div className="container max-w-md py-10">
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Administrador</CardTitle>
            <CardDescription>
              Configure o acesso do administrador para o sistema 99Tattoo.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      <FormLabel>Senha</FormLabel>
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
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirme a senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Configurando..." : "Configurar Administrador"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={() => navigate("/auth")}
              className="p-0 h-auto"
            >
              Voltar para o login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminUserSetup;
