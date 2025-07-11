
import React, { useState, useEffect } from "react";
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
import { getEventService } from "@/services/serviceFactory";
import { IEvent } from "@/services/interfaces/IEventService";
import { 
  Calendar, 
  MapPin, 
  Users,
  Sparkles,
  Heart,
  Camera,
  Shield,
  Zap,
  Star,
  Clock,
  ArrowRight,
  CheckCircle,
  Music,
  Gift
} from "lucide-react";

const eventFormSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  eventType: z.string().min(1, { message: "Selecione um tipo de evento" }),
  date: z.string().min(1, { message: "Data é obrigatória" }),
  guestCount: z.string().min(1, { message: "Número de convidados é obrigatório" }),
  phone: z.string().min(10, { message: "Telefone é obrigatório" }),
  location: z.string().min(1, { message: "Local é obrigatório" }),
  message: z.string().optional()
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const TattooEvents = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<IEvent[]>([]);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      eventType: "",
      date: "",
      guestCount: "",
      phone: "",
      location: "",
      message: ""
    }
  });

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const eventService = getEventService();
        const events = await eventService.fetchPublicEvents();
        setUpcomingEvents(events.slice(0, 3)); // Mostrar apenas os próximos 3 eventos
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const onSubmit = async (values: EventFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Tattoo Events form values:", values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Proposta enviada com sucesso!",
        description: "Entraremos em contato em breve para criar seu evento único.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting tattoo events form:", error);
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
    document.getElementById('events-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const scrollToEventsPage = () => {
    window.location.href = '/events';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden section-pattern-red-intense">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-red-800/80 to-black/90" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-white leading-tight tattoo-fade-in">
            Já pensou em ter tatuagens sendo feitas{' '}
            <span className="bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent">
              AO VIVO
            </span>{' '}
            no seu evento?
          </h1>
          <h2 className="text-xl md:text-2xl text-red-100 mb-8 max-w-5xl mx-auto leading-relaxed">
            Transforme-o em uma galeria de arte viva!
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
            Uma performance artística que eterniza momentos, transforma a energia da festa e entrega uma experiência inesquecível e altamente compartilhável para os seus convidados. Chega de atrações comuns: sua festa merece uma marca indelével!
          </p>
          <Button 
            onClick={scrollToForm}
            className="tattoo-button-primary text-lg px-10 py-6 rounded-lg tattoo-hover-lift"
            size="lg"
          >
            Quero um evento com tatuagens exclusivas
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* O que é o serviço */}
      <section className="py-16 md:py-24 section-pattern-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tattoo-title-red">
              A Experiência 99Tattoo Live: Sua Festa, Sua Arte, Sua História!
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg tattoo-hover-glow">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tattoo-title-red">
                  Tatuagens personalizadas e criadas na hora
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Nossos artistas transformam ideias em obras de arte únicas, feitas sob medida para cada convidado, ali, ao vivo! Garanta que cada tatuagem seja um reflexo do momento e da identidade do seu evento.
                </p>
              </CardContent>
            </Card>

            <Card className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg tattoo-hover-glow">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tattoo-title-red">
                  Performance ao vivo do tatuador em espaço visual
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Mais que um estande, um palco de arte! Montamos um espaço profissional e esteticamente impecável, onde o processo de criação vira um espetáculo fascinante, atraindo e envolvendo a todos.
                </p>
              </CardContent>
            </Card>

            <Card className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg tattoo-hover-glow">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tattoo-title-red">
                  Memórias eternizadas na pele dos convidados
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Seus convidados não levarão para casa apenas uma lembrancinha, mas uma lembrança que dura para sempre! Uma tatuagem feita em seu evento é um marco, um registro visceral de um momento inesquecível.
                </p>
              </CardContent>
            </Card>

            <Card className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg tattoo-hover-glow">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tattoo-title-red">
                  Possibilidade de tema personalizado
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Do clássico ao inusitado, adaptamos os estilos e temas das tatuagens à identidade visual e à vibe do seu evento, garantindo uma coesão artística que impressiona e surpreende.
                </p>
              </CardContent>
            </Card>

            <Card className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg tattoo-hover-glow">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tattoo-title-red">
                  Totalmente seguro e profissional
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Utilizamos apenas materiais descartáveis, tintas hipoalergênicas e seguimos todas as normas de biossegurança, com tatuadores experientes e responsáveis, para uma experiência impecável e segura.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefícios para o organizador */}
      <section className="py-16 md:py-24 section-pattern-red-intense">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Transforme sua festa em um marco inesquecível
            </h2>
            <p className="text-xl text-red-100 max-w-4xl mx-auto">
              Vantagens que você não encontra em outra atração
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">Atração original que viraliza nas redes sociais</h3>
                  <p className="text-red-100 leading-relaxed">
                    Fuja do comum! Uma tatuagem ao vivo é uma atração 'instagramável' por natureza, gerando um buzz espontâneo e alcance orgânico muito além do seu evento. Seus convidados serão seus embaixadores!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">Convidados impactados emocionalmente</h3>
                  <p className="text-red-100 leading-relaxed">
                    Ofereça uma experiência que toca a alma. A arte na pele cria uma conexão profunda, deixando seus convidados realmente encantados e com um sentimento de gratidão pela memória única.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">Interação artística e personalizada</h3>
                  <p className="text-red-100 leading-relaxed">
                    Proporcione momentos de diálogo e co-criação. Nossos tatuadores interagem com os convidados, transformando ideias em arte na hora, tornando o processo parte da diversão e personalização.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">Agregação de valor à marca ou ao evento</h3>
                  <p className="text-red-100 leading-relaxed">
                    Eleve o patamar da sua marca ou celebração. Uma tatuagem customizada reflete inovação, cuidado e uma visão única, diferenciando seu evento e solidificando sua reputação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onde funciona bem */}
      <section className="py-16 md:py-24 section-pattern-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tattoo-title-red">
              Tatuagem ao Vivo: Perfeita para Qualquer Celebração que Queria Brilhar!
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tattoo-title-red">
                  Aniversários e festas especiais
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Comemore cada década com uma marca para sempre. Uma tatuagem ao vivo é o presente que seus convidados nunca esquecerão, transformando sua festa em lenda.
                </p>
              </CardContent>
            </Card>

            <Card className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tattoo-title-red">
                  Casamentos e pré-weddings alternativos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Eternize o amor e a união de uma forma única e moderna, com tatuagens que celebram este dia especial para noivos e convidados. Uma aliança na pele que dura a vida toda!
                </p>
              </CardContent>
            </Card>

            <Card className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tattoo-title-red">
                  Festas de bar ou ativações em baladas
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Transforme seu happy hour ou balada em um evento pop-up de arte, atraindo um público diferenciado e gerando uma experiência inesquecível e altamente compartilhável.
                </p>
              </CardContent>
            </Card>

            <Card className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tattoo-title-red">
                  Feiras culturais, artísticas ou místicas
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Destaque-se em eventos de nicho, oferecendo uma atração que ressoa profundamente com o público, complementa a temática da feira e atrai olhares curiosos.
                </p>
              </CardContent>
            </Card>

            <Card className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 tattoo-title-red">
                  Eventos promocionais com marcas
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Crie uma ativação de marca inesquecível! Tatuagens customizadas com a identidade visual da sua empresa geram engajamento profundo, mídia espontânea e fidelidade à marca.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Galeria Visual */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Galeria de Momentos Únicos
            </h2>
            <p className="text-xl text-red-100 max-w-4xl mx-auto leading-relaxed">
              Mais do que tatuagens… criamos conexões visuais com a alma da sua festa. Momentos que se tornam arte na pele e eternizam a energia da sua celebração, transformando a atmosfera e gerando memórias tangíveis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-video bg-gradient-to-br from-red-600/20 to-black/40 rounded-lg mb-4 flex items-center justify-center">
                <Camera className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Performance Ao Vivo</h3>
              <p className="text-gray-300 text-sm">Artista criando arte em tempo real durante o evento</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-video bg-gradient-to-br from-red-600/20 to-black/40 rounded-lg mb-4 flex items-center justify-center">
                <Heart className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Momentos Especiais</h3>
              <p className="text-gray-300 text-sm">Convidados vivenciando uma experiência única</p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="aspect-video bg-gradient-to-br from-red-600/20 to-black/40 rounded-lg mb-4 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Arte Personalizada</h3>
              <p className="text-gray-300 text-sm">Cada tatuagem única e com significado especial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 md:py-24 section-pattern-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tattoo-title-red">
              A voz de quem já transformou seus eventos com a 99Tattoo
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="tattoo-card-enhanced">
              <CardContent className="p-8">
                <blockquote className="text-lg italic text-gray-700 mb-6">
                  "Foi o ponto alto da festa. Todo mundo ficou encantado e a experiência de ter uma tattoo feita na hora é algo que ninguém esperava. A equipe da 99Tattoo foi incrível, superou todas as expectativas e deixou uma marca real no nosso evento!"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-red-600">Ana Carolina</p>
                    <p className="text-gray-600">Cerimonialista de Eventos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="tattoo-card-enhanced">
              <CardContent className="p-8">
                <blockquote className="text-lg italic text-gray-700 mb-6">
                  "Nunca vi uma atração que gerasse tanto engajamento! As pessoas estavam fazendo fila e postando nas redes sociais o tempo todo. Foi a melhor decisão para o nosso evento corporativo. Inovador e memorável!"
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-red-600">Marco Silva</p>
                    <p className="text-gray-600">Diretor de Marketing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chamada para Ação com Urgência */}
      <section className="py-16 md:py-24 section-pattern-red-intense">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Não deixe seu evento ser "apenas mais um"
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Feche datas exclusivas antes que esgotem e garanta uma experiência que todos vão querer falar!
          </p>
          <p className="text-lg text-white/90 mb-10 max-w-3xl mx-auto">
            A demanda por experiências únicas é alta, e nossas vagas para eventos são limitadas por mês para garantir a exclusividade e a qualidade que seu evento merece. Garanta que sua data seja marcada por arte, emoção e uma performance inesquecível!
          </p>
          <Button 
            onClick={scrollToForm}
            className="tattoo-button-primary text-lg px-10 py-6 rounded-lg tattoo-hover-lift"
            size="lg"
          >
            Fale com o Artista e Agende Agora!
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Formulário de Contato */}
      <section id="events-form" className="py-16 md:py-24 section-pattern-red-intense">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Pronto para criar uma experiência inesquecível?
            </h2>
            <p className="text-xl text-red-100 leading-relaxed">
              Preencha e receba uma proposta personalizada
            </p>
          </div>
          
          <Card className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-0">
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
                              className="tattoo-input-enhanced" 
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
                              <SelectTrigger className="tattoo-input-enhanced">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="aniversario">Aniversário</SelectItem>
                              <SelectItem value="casamento">Casamento</SelectItem>
                              <SelectItem value="corporativo">Corporativo</SelectItem>
                              <SelectItem value="festival">Festival</SelectItem>
                              <SelectItem value="bar_balada">Bar/Balada</SelectItem>
                              <SelectItem value="cultural_mistico">Cultural/Místico</SelectItem>
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
                          <FormLabel className="text-red-600 font-medium">Data Estimada</FormLabel>
                          <FormControl>
                            <Input 
                              type="date"
                              {...field} 
                              className="tattoo-input-enhanced" 
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
                              placeholder="Ex: 100" 
                              {...field} 
                              className="tattoo-input-enhanced" 
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
                          <FormLabel className="text-red-600 font-medium">WhatsApp</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(11) 99999-9999" 
                              {...field} 
                              className="tattoo-input-enhanced" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-600 font-medium">Local (Cidade/Estado)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="São Paulo/SP" 
                            {...field} 
                            className="tattoo-input-enhanced" 
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
                        <FormLabel className="text-red-600 font-medium">Mensagem / Ideias para o Evento</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos mais sobre sua visão para o evento, temas, expectativas..."
                            className="min-h-24 tattoo-input-enhanced"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full tattoo-button-primary py-4 text-lg"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Enviando..." : "Receber Minha Proposta Personalizada"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Nossos Próximos Eventos Abertos */}
      <section className="py-16 md:py-24 section-pattern-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tattoo-title-red">
              Quer Ver a 99Tattoo em Ação?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Confira Nossos Próximos Eventos Abertos!
            </p>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="tattoo-card-enhanced tattoo-hover-lift">
                  <div className="aspect-video bg-gradient-to-br from-red-600/20 to-black/10 rounded-t-lg flex items-center justify-center">
                    {event.featuredImage ? (
                      <img 
                        src={event.featuredImage} 
                        alt={event.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <Calendar className="h-12 w-12 text-red-600" />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 tattoo-title-red">{event.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-red-600" />
                        <span>{event.startDate}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-red-600" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-red-600" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      {event.description}
                    </p>
                    <Button 
                      onClick={scrollToEventsPage}
                      className="w-full tattoo-button-primary"
                      size="sm"
                    >
                      Ver Mais Detalhes
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Novos eventos em breve!</h3>
              <p className="text-gray-600">Estamos preparando experiências incríveis para você.</p>
            </div>
          )}
          
          <div className="text-center">
            <Button 
              onClick={scrollToEventsPage}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              size="lg"
            >
              Ver Todos os Eventos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TattooEvents;
