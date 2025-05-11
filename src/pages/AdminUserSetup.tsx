
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
      // Verificar se o usuário já existe
      const { data: existingUser } = await supabase.auth.admin.getUserByEmail(values.email);
      
      if (existingUser) {
        // Usuário existe, atualizar a senha
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          existingUser.id,
          { password: values.password }
        );
        
        if (updateError) throw updateError;
        
        setSuccess(`Senha atualizada com sucesso para ${values.email}. Você pode fazer login agora.`);
        setTimeout(() => navigate('/auth'), 3000);
      } else {
        // Usuário não existe, criar novo
        const { error: createError } = await supabase.auth.admin.createUser({
          email: values.email,
          password: values.password,
          email_confirm: true,
          user_metadata: { first_name: "Admin", last_name: "99Tattoo" },
        });
        
        if (createError) throw createError;
        
        // Atualizar o perfil para ter a função de admin
        const { data: userData } = await supabase.auth.admin.getUserByEmail(values.email);
        
        if (userData) {
          await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userData.id);
        }
        
        setSuccess(`Usuário administrador criado com sucesso: ${values.email}. Você pode fazer login agora.`);
        setTimeout(() => navigate('/auth'), 3000);
      }
    } catch (err: any) {
      setError(`Erro ao configurar usuário administrador: ${err.message || "Erro desconhecido"}`);
      console.error("Erro na configuração do admin:", err);
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
