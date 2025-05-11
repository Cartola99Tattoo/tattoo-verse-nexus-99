
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

// Schema de validação para registro
const registerSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  firstName: z.string().min(2, { message: "Nome muito curto" }),
  lastName: z.string().min(2, { message: "Sobrenome muito curto" }),
});

// Schema de validação para recuperação de senha
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
});

const Auth = () => {
  const { user, signIn, signUp, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Se o usuário já estiver autenticado, redirecione para a página inicial
  if (user) {
    return <Navigate to="/" />;
  }

  // Form para login
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form para registro
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  // Form para recuperação de senha
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Função para fazer login
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    setLoginError("");
    
    const { error } = await signIn(values.email, values.password);
    
    if (error) {
      setLoginError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha inválidos"
          : "Erro ao fazer login. Tente novamente."
      );
    } else {
      navigate("/");
    }
    
    setIsSubmitting(false);
  };

  // Função para fazer registro
  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
    setRegisterError("");
    
    const { error } = await signUp(
      values.email, 
      values.password, 
      values.firstName, 
      values.lastName
    );
    
    if (error) {
      setRegisterError(
        error.message.includes("already registered")
          ? "Este e-mail já está registrado"
          : "Erro ao criar conta. Tente novamente."
      );
    } else {
      setActiveTab("login");
    }
    
    setIsSubmitting(false);
  };

  // Função para recuperar senha
  const handleForgotPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsSubmitting(true);
    setForgotError("");
    
    const { error } = await resetPassword(values.email);
    
    if (error) {
      setForgotError("Erro ao enviar e-mail de recuperação. Verifique o e-mail e tente novamente.");
    } else {
      // Limpar o formulário
      forgotPasswordForm.reset();
    }
    
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <Helmet>
        <title>Login/Registro - 99Tattoo</title>
      </Helmet>
      <div className="container max-w-md py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
            <TabsTrigger value="forgot">Recuperar Senha</TabsTrigger>
          </TabsList>
          
          {/* Tab de Login */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Entre com seu e-mail e senha para acessar sua conta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" {...field} />
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
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {loginError && (
                      <div className="text-red-500 text-sm">{loginError}</div>
                    )}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <div className="text-sm text-center">
                  Não tem uma conta?{" "}
                  <Button
                    variant="link"
                    onClick={() => setActiveTab("register")}
                    className="p-0 h-auto"
                  >
                    Cadastre-se
                  </Button>
                </div>
                <div className="text-sm text-center">
                  <Button
                    variant="link"
                    onClick={() => setActiveTab("forgot")}
                    className="p-0 h-auto"
                  >
                    Esqueceu sua senha?
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Tab de Registro */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro</CardTitle>
                <CardDescription>
                  Crie sua conta para agendar tatuagens e compras online.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobrenome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu sobrenome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {registerError && (
                      <div className="text-red-500 text-sm">{registerError}</div>
                    )}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <div className="text-sm">
                  Já tem uma conta?{" "}
                  <Button
                    variant="link"
                    onClick={() => setActiveTab("login")}
                    className="p-0 h-auto"
                  >
                    Entre aqui
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Tab de Recuperação de Senha */}
          <TabsContent value="forgot">
            <Card>
              <CardHeader>
                <CardTitle>Recuperar Senha</CardTitle>
                <CardDescription>
                  Informe seu e-mail para receber um link de recuperação de senha.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...forgotPasswordForm}>
                  <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                    <FormField
                      control={forgotPasswordForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {forgotError && (
                      <div className="text-red-500 text-sm">{forgotError}</div>
                    )}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  variant="link"
                  onClick={() => setActiveTab("login")}
                  className="p-0 h-auto"
                >
                  Voltar para o login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Auth;
