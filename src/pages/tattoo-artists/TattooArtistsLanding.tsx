
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Palette, Users, Calendar, TrendingUp, CheckCircle, Star } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  studioName: z.string().optional(),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone inválido" }),
  message: z.string().optional(),
});

const TattooArtistsLanding = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      studioName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      console.log("Dados do formulário de tatuadores:", values);
      
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      form.reset();
      
      toast({
        title: "Obrigado! 🎨",
        description: "Entraremos em contato em breve para digitalizar seu estúdio!",
      });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Users className="h-8 w-8 text-red-500" />,
      title: "Mais Clientes Qualificados",
      description: "Atraia clientes que realmente valorizam sua arte através de nossa plataforma especializada."
    },
    {
      icon: <Calendar className="h-8 w-8 text-red-500" />,
      title: "Agendamentos Otimizados",
      description: "Sistema inteligente de agendamentos que organiza sua agenda e reduz no-shows."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-red-500" />,
      title: "Faturamento Aumentado",
      description: "Ferramentas para precificar melhor seus trabalhos e aumentar sua receita mensal."
    },
    {
      icon: <Palette className="h-8 w-8 text-red-500" />,
      title: "Foco na Arte",
      description: "Automatize a parte administrativa e dedique mais tempo ao que você ama: tatuar."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-red-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">99</span>
              </div>
              <span className="text-xl font-bold text-white">Tattoo</span>
              <span className="text-red-400 text-sm ml-2">Para Tatuadores</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Digitalize Seu Estúdio de Tatuagem para a 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Nova Era!</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Atraia clientes qualificados, otimize agendamentos e foque no que você faz de melhor: criar arte na pele. 
                  Nossa plataforma conecta tatuadores excepcionais com clientes que valorizam qualidade.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-6 pt-6 border-t border-gray-700">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300 ml-2">5.0 • +200 Estúdios</span>
                </div>
                <div className="text-sm text-gray-400">
                  <CheckCircle className="h-4 w-4 text-green-400 inline mr-1" />
                  Resultado em 30 dias
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:pl-8">
              <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                    Comece Sua Transformação Digital
                  </CardTitle>
                  <p className="text-gray-600">
                    Preencha os dados e receba um plano personalizado para seu estúdio
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 font-semibold">Nome Completo *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Seu nome completo" 
                                className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="studioName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 font-semibold">Nome do Estúdio</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nome do seu estúdio (opcional)" 
                                className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 font-semibold">E-mail *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="seu@email.com" 
                                className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 font-semibold">Telefone (WhatsApp) *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="(11) 99999-9999" 
                                className="h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 font-semibold">Mensagem</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Conte-nos um pouco sobre seu estúdio e o que você busca..." 
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500 min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "🚀 Quero Digitalizar Meu Estúdio!"}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />
                      Resposta em até 24h • Consultoria gratuita
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-red-500/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 99Tattoo - Plataforma para Tatuadores da Nova Era
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TattooArtistsLanding;
