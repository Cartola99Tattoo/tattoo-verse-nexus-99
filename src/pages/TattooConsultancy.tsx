
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { 
  CheckCircle, 
  Users, 
  Heart, 
  Palette, 
  Camera, 
  ArrowRight, 
  Star,
  MessageCircle,
  Clock,
  Target,
  ChevronDown
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const consultancyFormSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  whatsapp: z.string().min(10, { message: "WhatsApp é obrigatório" }),
  tattooStyle: z.string().min(1, { message: "Selecione um estilo" }),
  objective: z.string().min(1, { message: "Selecione um objetivo" }),
  additionalInfo: z.string().optional()
});

type ConsultancyFormValues = z.infer<typeof consultancyFormSchema>;

const TattooConsultancy = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ConsultancyFormValues>({
    resolver: zodResolver(consultancyFormSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      tattooStyle: "",
      objective: "",
      additionalInfo: ""
    }
  });

  const onSubmit = async (values: ConsultancyFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Consultancy form values:", values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Consultoria agendada com sucesso!",
        description: "Entraremos em contato pelo WhatsApp em breve.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting consultancy form:", error);
      toast({
        variant: "destructive",
        title: "Erro ao agendar consultoria",
        description: "Tente novamente mais tarde."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('consultancy-form')?.scrollIntoView({ 
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
            backgroundImage: `url('https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-red-900/70 to-black/80" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent leading-tight">
            Sua próxima tatuagem começa com uma história bem contada.
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Uma consultoria criativa para te ajudar a escolher a arte perfeita para o seu corpo, seu estilo e sua fase de vida.
          </p>
          <Button 
            onClick={scrollToForm}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white text-lg px-8 py-4 rounded-lg shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300"
            size="lg"
          >
            Agende sua Consultoria
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* O que é a Consultoria */}
      <section className="py-16 bg-gradient-to-b from-white to-red-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-6">O que você ganha com essa consultoria?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Users, text: "Conversa 1:1 com um artista especialista" },
              { icon: Palette, text: "Sugestões de estilo que combinam com você" },
              { icon: Target, text: "Indicação de melhor lugar no corpo para tatuar" },
              { icon: Heart, text: "Proposta de arte com significado emocional" },
              { icon: Camera, text: "Ajuda na cobertura de tatuagens antigas" },
              { icon: Star, text: "Transformação de cicatrizes em arte" }
            ].map((benefit, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-red-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-red-500/25">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="font-medium text-gray-800">{benefit.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Depoimento */}
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-red-50 to-white border-red-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <blockquote className="text-lg italic text-gray-700 mb-4">
                "A consultoria me deu confiança para finalmente fazer minha tattoo dos sonhos. O artista entendeu perfeitamente o que eu queria e sugeriu melhorias que eu nunca tinha pensado."
              </blockquote>
              <p className="font-semibold text-red-600">- Marina S., primeira tatuagem</p>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Button 
              onClick={scrollToForm}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3"
            >
              Quero uma tatuagem com propósito
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-red-600 text-center mb-12">Para quem é essa consultoria?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: "💔",
                title: "Tenho uma cicatriz e quero transformá-la em algo bonito",
                description: "Transformamos marcas do passado em arte significativa"
              },
              {
                icon: "🎨",
                title: "Tenho uma tatuagem antiga que não combina mais comigo",
                description: "Criamos covers incríveis que respeitam sua nova fase"
              },
              {
                icon: "✨",
                title: "Quero minha primeira tattoo mas não sei por onde começar",
                description: "Te guiamos em cada etapa da sua primeira experiência"
              },
              {
                icon: "❤️",
                title: "Quero que minha próxima arte tenha um significado real",
                description: "Desenvolvemos conceitos únicos baseados na sua história"
              }
            ].map((persona, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{persona.icon}</div>
                  <h3 className="font-bold text-lg text-red-600 mb-3">{persona.title}</h3>
                  <p className="text-gray-700">{persona.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="py-16 bg-gradient-to-b from-white to-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-red-600 text-center mb-6">Transformações Reais</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Cada pele tem uma história. Cada tatuagem é uma escolha consciente.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                image: "https://images.unsplash.com/photo-1590246815107-56d48602592f?w=600&auto=format&fit=crop&q=60",
                title: "Cobertura Transformadora",
                description: "De tatuagem antiga para obra de arte moderna"
              },
              {
                image: "https://images.unsplash.com/photo-1565058398932-9a36a1a3c2b9?w=600&auto=format&fit=crop&q=60",
                title: "Cicatriz em Arte",
                description: "Transformação de marca em símbolo de superação"
              },
              {
                image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?w=600&auto=format&fit=crop&q=60",
                title: "Design Personalizado",
                description: "Arte criada especialmente para o cliente"
              }
            ].map((example, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={example.image} 
                    alt={example.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-red-600 mb-2">{example.title}</h3>
                  <p className="text-gray-600">{example.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-red-600 text-center mb-12">Como funciona a consultoria</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">Etapas da sua experiência:</p>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { number: "1", title: "Formulário", description: "Preenchimento com suas ideias e gostos", icon: MessageCircle },
                { number: "2", title: "Reunião", description: "Encontro online ou presencial com o artista", icon: Users },
                { number: "3", title: "Sugestões", description: "Indicações de estilos, temas e áreas do corpo", icon: Palette },
                { number: "4", title: "Conceito", description: "Apresentação de conceito criativo exclusivo", icon: Star },
                { number: "5", title: "Agendamento", description: "Marcação da sessão de tatuagem (opcional)", icon: Clock }
              ].map((step, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-red-600 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="font-bold text-red-600 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 bg-gradient-to-b from-white to-red-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-red-600 text-center mb-12">Quem já viveu essa transformação</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Carlos M.",
                text: "A consultoria me ajudou a transformar uma cicatriz em uma obra de arte. Nunca imaginei que algo que me incomodava tanto poderia se tornar minha tatuagem favorita.",
                rating: 5
              },
              {
                name: "Ana P.",
                text: "Era minha primeira tatuagem e estava perdida. O artista me guiou em tudo, desde o estilo até o local. O resultado superou minhas expectativas!",
                rating: 5
              },
              {
                name: "Roberto S.",
                text: "Precisava cobrir uma tatuagem antiga que não combinava mais comigo. O design novo ficou incrível e tem um significado muito especial.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic mb-4">"{testimonial.text}"</blockquote>
                  <p className="font-semibold text-red-600">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-red-600 text-center mb-12">Perguntas Frequentes</h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border border-red-200 rounded-lg px-6">
                <AccordionTrigger className="text-red-600 hover:text-red-700">
                  A consultoria é online ou presencial?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Oferecemos ambas as opções! Você pode escolher uma videochamada ou vir ao nosso estúdio para a consultoria presencial.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border border-red-200 rounded-lg px-6">
                <AccordionTrigger className="text-red-600 hover:text-red-700">
                  Quanto tempo dura a consultoria?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Normalmente entre 45 minutos a 1 hora, dependendo da complexidade do seu projeto e suas necessidades específicas.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3" className="border border-red-200 rounded-lg px-6">
                <AccordionTrigger className="text-red-600 hover:text-red-700">
                  A consultoria tem algum custo?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  A primeira consultoria é gratuita! Se você decidir fazer a tatuagem conosco, o valor é descontado do orçamento final.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border border-red-200 rounded-lg px-6">
                <AccordionTrigger className="text-red-600 hover:text-red-700">
                  Preciso ter uma ideia definida?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  Não! Na verdade, muitos clientes chegam apenas com uma vontade de tatuar. Nosso trabalho é justamente te ajudar a descobrir o que combina com você.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Formulário Final */}
      <section id="consultancy-form" className="py-16 bg-gradient-to-b from-white to-red-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-red-600 mb-6">
              Pronto para descobrir a tatuagem que mais combina com você?
            </h2>
            <p className="text-xl text-gray-600">
              Preencha o formulário abaixo e nossa equipe entrará em contato pelo WhatsApp para agendar sua consultoria personalizada.
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-600 font-medium">Nome Completo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Como você gostaria de ser chamado?" 
                            {...field} 
                            className="border-red-200 focus:border-red-600 focus:ring-red-200" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-600 font-medium">WhatsApp</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(11) 99999-9999" 
                            {...field} 
                            className="border-red-200 focus:border-red-600 focus:ring-red-200" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tattooStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-600 font-medium">Estilo de tatuagem que mais gosta</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-red-200 focus:border-red-600">
                              <SelectValue placeholder="Selecione um estilo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="realismo">Realismo</SelectItem>
                            <SelectItem value="fineline">Fineline</SelectItem>
                            <SelectItem value="oldschool">Old School</SelectItem>
                            <SelectItem value="neotrad">Neo-Tradicional</SelectItem>
                            <SelectItem value="oriental">Oriental</SelectItem>
                            <SelectItem value="aquarela">Aquarela</SelectItem>
                            <SelectItem value="geometrico">Geométrico</SelectItem>
                            <SelectItem value="minimalista">Minimalista</SelectItem>
                            <SelectItem value="blackwork">Blackwork</SelectItem>
                            <SelectItem value="nao-sei">Não sei ainda</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="objective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-600 font-medium">Objetivo da consultoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-red-200 focus:border-red-600">
                              <SelectValue placeholder="O que você busca?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="primeira">Minha primeira tatuagem</SelectItem>
                            <SelectItem value="nova">Nova tatuagem</SelectItem>
                            <SelectItem value="cobertura">Cobertura de tatuagem antiga</SelectItem>
                            <SelectItem value="cicatriz">Transformar cicatriz em arte</SelectItem>
                            <SelectItem value="significado">Tatuagem com significado especial</SelectItem>
                            <SelectItem value="outro">Outro motivo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-600 font-medium">Informações adicionais (opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos mais sobre sua ideia, inspirações ou qualquer detalhe que considere importante..."
                            className="min-h-24 border-red-200 focus:border-red-600 focus:ring-red-200"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Enviando..." : "Agendar minha consultoria personalizada"}
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

export default TattooConsultancy;
