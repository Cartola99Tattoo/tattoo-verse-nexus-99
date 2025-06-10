
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { 
  Building2, 
  Heart, 
  Music, 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Mail,
  Phone,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";

const eventFormSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone é obrigatório" }),
  eventType: z.string().min(1, { message: "Selecione um tipo de evento" }),
  date: z.string().min(1, { message: "Data é obrigatória" }),
  location: z.string().min(1, { message: "Local é obrigatório" }),
  guestCount: z.string().min(1, { message: "Número de convidados é obrigatório" }),
  description: z.string().optional()
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const Events = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      date: "",
      location: "",
      guestCount: "",
      description: ""
    }
  });

  const onSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Event form values:", values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Proposta enviada com sucesso!",
        description: "Entraremos em contato em breve para detalhar seu evento.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting event form:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar proposta",
        description: "Tente novamente mais tarde."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('event-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-black via-red-900 to-black"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-red-900/70 to-black/80" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent leading-tight">
            Transforme Seu Evento em uma Experiência Inesquecível
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Levamos a arte da tatuagem para seu evento especial, criando momentos únicos e memórias que durarão para sempre
          </p>
          <Button 
            onClick={scrollToForm}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4 rounded-lg"
            size="lg"
          >
            Solicitar Proposta Personalizada
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Seu Evento, Sua Arte Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-red-600">
              Seu Evento, Sua Arte: A 99Tattoo Cria Experiências Exclusivas para Você
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Cada evento é único, assim como cada tatuagem. Desenvolvemos experiências personalizadas que se adaptam perfeitamente ao seu estilo e ocasião.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-white border-2 border-red-200/50 shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-700 transform hover:scale-105 hover:border-red-400/70">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-red-600 group-hover:text-red-700 transition-colors duration-300">
                    Eventos Corporativos
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                    Confraternizações, team buildings e celebrações empresariais com tatuagens temporárias personalizadas da marca ou designs exclusivos para fortalecer o espírito de equipe.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-white border-2 border-red-200/50 shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-700 transform hover:scale-105 hover:border-red-400/70">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-red-600 group-hover:text-red-700 transition-colors duration-300">
                    Festas e Casamentos
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                    Despedidas de solteiro(a), aniversários e celebrações íntimas onde cada convidado pode levar uma lembrança artística única da data especial.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-white border-2 border-red-200/50 shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-700 transform hover:scale-105 hover:border-red-400/70">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Music className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-red-600 group-hover:text-red-700 transition-colors duration-300">
                    Festivais e Convenções
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                    Eventos culturais, shows e convenções onde oferecemos estações de tatuagem com designs temáticos exclusivos do evento.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials and Benefits */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-red-600">Por que escolher a 99Tattoo para seu evento?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              { icon: CheckCircle, text: "Artistas profissionais certificados" },
              { icon: Star, text: "Materiais esterilizados e de alta qualidade" },
              { icon: Users, text: "Atendimento simultâneo para múltiplos convidados" },
              { icon: Calendar, text: "Flexibilidade total de horários e datas" },
              { icon: MapPin, text: "Atendemos em qualquer local da cidade" },
              { icon: Clock, text: "Setup completo em menos de 1 hora" }
            ].map((benefit, index) => (
              <Card key={index} className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-medium text-gray-800">{benefit.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <blockquote className="text-xl italic text-gray-700 mb-6">
                "A 99Tattoo transformou nossa festa de casamento em algo absolutamente mágico. Nossos convidados ainda falam sobre as tatuagens personalizadas que fizeram. Foi o diferencial que tornou nossa celebração única e inesquecível!"
              </blockquote>
              <p className="font-semibold text-red-600 text-lg">- Marina & Carlos, Casamento 2023</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="event-form" className="py-16 md:py-24 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Receber Proposta Personalizada
            </h2>
            <p className="text-xl text-red-100 leading-relaxed">
              Preencha o formulário abaixo e nossa equipe criará uma proposta exclusiva para o seu evento, com todos os detalhes e investimento necessário.
            </p>
          </div>
          
          <Card className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-red-50 to-white">
              <CardTitle className="text-2xl text-red-800 text-center">Detalhes do Seu Evento</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-600 font-medium">Nome Completo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Seu nome completo" 
                              {...field} 
                              className="border-red-200 focus:border-red-500 focus:ring-red-200" 
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
                          <FormLabel className="text-red-600 font-medium">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="seu@email.com" 
                              {...field} 
                              className="border-red-200 focus:border-red-500 focus:ring-red-200" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-600 font-medium">WhatsApp</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(11) 99999-9999" 
                              {...field} 
                              className="border-red-200 focus:border-red-500 focus:ring-red-200" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-600 font-medium">Tipo de Evento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-red-200 focus:border-red-500">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                              <SelectItem value="casamento">Casamento</SelectItem>
                              <SelectItem value="festa">Festa de Aniversário</SelectItem>
                              <SelectItem value="despedida">Despedida de Solteiro(a)</SelectItem>
                              <SelectItem value="festival">Festival/Convenção</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-600 font-medium">Data do Evento</FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...field} 
                              className="border-red-200 focus:border-red-500 focus:ring-red-200" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-600 font-medium">Local</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Cidade/Bairro" 
                              {...field} 
                              className="border-red-200 focus:border-red-500 focus:ring-red-200" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="guestCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-600 font-medium">Nº de Convidados</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Ex: 50" 
                              {...field} 
                              className="border-red-200 focus:border-red-500 focus:ring-red-200" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-600 font-medium">Detalhes Adicionais</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos mais sobre seu evento, expectativas e qualquer detalhe importante..."
                            className="min-h-24 border-red-200 focus:border-red-500 focus:ring-red-200"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 py-4 text-lg"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Enviando..." : "Solicitar Proposta Personalizada"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Events;
