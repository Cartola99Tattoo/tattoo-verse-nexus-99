
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
import SectionWrapper from "@/components/ui/section-wrapper";

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
        
        <div className="relative z-10 container mx-auto px-4 text-center tattoo-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tattoo-title-gradient leading-tight">
            Sua próxima tatuagem não precisa ser um risco. Descubra a arte que realmente te representa.
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Chega de dúvidas! Nossa consultoria criativa te guia para escolher a tatuagem perfeita, que celebra seu corpo, sua história e sua essência, sem arrependimentos.
          </p>
          <Button 
            onClick={scrollToForm}
            className="tattoo-button-primary text-lg px-8 py-4 rounded-lg"
            size="lg"
          >
            Agende sua Consultoria Personalizada
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* O que é a Consultoria */}
      <SectionWrapper variant="white" withSeparator separatorType="thick">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold tattoo-title-red mb-6">O que você ganha com essa consultoria?</h2>
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
            <Card key={index} className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg tattoo-hover-glow">
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
        <Card className="max-w-3xl mx-auto tattoo-card-enhanced">
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <blockquote className="text-lg italic text-gray-700 mb-4">
              "Eu estava prestes a fazer uma tatuagem que provavelmente me arrependeria. A consultoria da 99Tattoo abriu meus olhos para estilos que eu nem imaginava que combinariam comigo. Minha tatuagem agora é parte de mim, e sou grato por ter tido essa orientação."
            </blockquote>
            <p className="font-semibold text-red-600">- Cliente Satisfeito</p>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button 
            onClick={scrollToForm}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 tattoo-hover-lift"
          >
            Quero uma tatuagem com propósito
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </SectionWrapper>

      {/* Para quem é */}
      <SectionWrapper variant="red" withSeparator separatorType="gradient">
        <h2 className="text-4xl font-bold text-red-600 text-center mb-12">Para quem é essa consultoria?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: "💔",
              title: "Minha cicatriz me incomoda, quero transformá-la em algo que amo.",
              description: "Transformamos marcas do passado em arte significativa que celebra sua superação"
            },
            {
              icon: "😔",
              title: "Tenho uma tatuagem antiga e me arrependo. Preciso de uma cobertura ou ressignificação.",
              description: "Criamos covers incríveis que respeitam sua nova fase e apagam arrependimentos"
            },
            {
              icon: "😰",
              title: "Quero minha primeira tattoo mas tenho medo de escolher algo que não combine comigo.",
              description: "Te guiamos com segurança na sua primeira experiência, eliminando o medo do arrependimento"
            },
            {
              icon: "💭",
              title: "Minha próxima arte precisa ter um significado profundo e eu não sei como expressá-lo.",
              description: "Desenvolvemos conceitos únicos que traduzem sua essência em arte permanente"
            }
          ].map((persona, index) => (
            <Card key={index} className="tattoo-card-enhanced tattoo-hover-lift">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{persona.icon}</div>
                <h3 className="font-bold text-lg text-red-600 mb-3">{persona.title}</h3>
                <p className="text-gray-700">{persona.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={scrollToForm}
            className="tattoo-button-primary px-8 py-3 shadow-lg"
          >
            Quero uma tatuagem com propósito
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </SectionWrapper>

      {/* Galeria */}
      <SectionWrapper variant="white" withSeparator separatorType="thick">
        <h2 className="text-4xl font-bold tattoo-title-red text-center mb-6">Transformações Reais</h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-4xl mx-auto">
          Escolher uma tatuagem é escolher uma parte de você para sempre. Não deixe o receio de uma má decisão te impedir de ter a arte que sempre sonhou. Com a 99Tattoo, cada pele tem uma história bem escrita. Cada tatuagem é uma escolha consciente e planejada para você.
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
            <Card key={index} className="tattoo-card-enhanced overflow-hidden">
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
      </SectionWrapper>

      {/* Como funciona */}
      <SectionWrapper variant="red" withSeparator separatorType="gradient">
        <h2 className="text-4xl font-bold text-red-600 text-center mb-12">Etapas da sua experiência:</h2>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { number: "1", title: "Formulário", description: "Preenchimento com suas ideias e gostos", icon: MessageCircle },
              { number: "2", title: "Reunião", description: "Encontro online ou presencial com o artista", icon: Users },
              { number: "3", title: "Sugestões", description: "Indicações de estilos, temas e áreas do corpo", icon: Palette },
              { number: "4", title: "Conceito", description: "Apresentação de conceito criativo exclusivo", icon: Star },
              { number: "5", title: "Agendamento", description: "Marcação da sessão de tatuagem (opcional)", icon: Clock }
            ].map((step, index) => (
              <div key={index} className="text-center group tattoo-hover-lift">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto shadow-lg tattoo-hover-glow">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-red-600 rounded-full flex items-center justify-center text-red-600 font-bold text-sm shadow-lg">
                    {step.number}
                  </div>
                </div>
                <h3 className="font-bold text-red-600 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Depoimentos */}
      <SectionWrapper variant="white" withSeparator separatorType="thick">
        <h2 className="text-4xl font-bold tattoo-title-red text-center mb-12">Quem já viveu essa transformação</h2>
        
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
            <Card key={index} className="tattoo-card-enhanced tattoo-hover-lift">
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
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper variant="red" withSeparator separatorType="gradient">
        <h2 className="text-4xl font-bold text-red-600 text-center mb-12">Sua confiança é nossa prioridade. Tire suas dúvidas:</h2>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-red-200 rounded-lg px-6 tattoo-card-enhanced">
              <AccordionTrigger className="text-red-600 hover:text-red-700">
                A consultoria é online ou presencial?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Oferecemos ambas as opções! Você pode escolher uma videochamada ou vir ao nosso estúdio para a consultoria presencial.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border border-red-200 rounded-lg px-6 tattoo-card-enhanced">
              <AccordionTrigger className="text-red-600 hover:text-red-700">
                Qual o tempo de duração da consultoria?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Normalmente entre 45 minutos a 1 hora, dependendo da complexidade do seu projeto e suas necessidades específicas.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border border-red-200 rounded-lg px-6 tattoo-card-enhanced">
              <AccordionTrigger className="text-red-600 hover:text-red-700">
                A consultoria inclui o valor da tatuagem?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                A primeira consultoria é gratuita! Se você decidir fazer a tatuagem conosco, o valor é descontado do orçamento final.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border border-red-200 rounded-lg px-6 tattoo-card-enhanced">
              <AccordionTrigger className="text-red-600 hover:text-red-700">
                Se eu não gostar da proposta, o que acontece?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                Nosso compromisso é com sua satisfação. Trabalhamos juntos até encontrar a proposta ideal para você, sem compromisso de execução.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-red-200 rounded-lg px-6 tattoo-card-enhanced">
              <AccordionTrigger className="text-red-600 hover:text-red-700">
                Qual o valor da consultoria?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                A primeira consultoria é completamente gratuita! É nossa forma de conhecer você e apresentar nosso trabalho.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SectionWrapper>

      {/* Formulário Final */}
      <SectionWrapper variant="white" withSeparator separatorType="thick">
        <div id="consultancy-form" className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold tattoo-title-red mb-6">
            Chega de dúvidas! Agende sua consultoria e descubra a tatuagem que nasceu para você.
          </h2>
          <p className="text-xl text-gray-600">
            Preencha o formulário abaixo e nossa equipe entrará em contato pelo WhatsApp para agendar sua consultoria personalizada.
          </p>
        </div>
        
        <Card className="max-w-2xl mx-auto tattoo-card-enhanced">
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
                          className="tattoo-input-enhanced" 
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
                          className="tattoo-input-enhanced" 
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
                          <SelectTrigger className="tattoo-input-enhanced">
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
                          <SelectTrigger className="tattoo-input-enhanced">
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
                  className="w-full tattoo-button-primary py-4 text-lg shadow-lg"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Enviando..." : "Agendar Minha Consultoria Agora!"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </SectionWrapper>
    </div>
  );
};

export default TattooConsultancy;
